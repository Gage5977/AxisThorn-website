#!/bin/bash

# Database Backup Script for Axis Thorn
# Run via cron: 0 2 * * * /path/to/backup-db.sh

set -euo pipefail

# Configuration
BACKUP_DIR="/var/backups/postgres"
S3_BUCKET="axis-thorn-backups"
DB_NAME="axisthorn"
RETENTION_DAYS=30
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${DB_NAME}_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Log function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Error handler
error_exit() {
    log "ERROR: $1"
    # Send alert if webhook is configured
    if [ ! -z "${SLACK_WEBHOOK_URL:-}" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"⚠️ Database backup failed: $1\"}" \
            "$SLACK_WEBHOOK_URL" 2>/dev/null || true
    fi
    exit 1
}

# Check prerequisites
command -v pg_dump >/dev/null 2>&1 || error_exit "pg_dump not found"
command -v aws >/dev/null 2>&1 || error_exit "AWS CLI not found"

log "Starting database backup for $DB_NAME"

# Perform backup
log "Creating backup file: $BACKUP_FILE"
if pg_dump "$DATABASE_URL" \
    --verbose \
    --no-owner \
    --no-privileges \
    --format=custom \
    --file="$BACKUP_DIR/$BACKUP_FILE" 2>&1 | while read line; do
        log "pg_dump: $line"
    done; then
    log "Database backup completed successfully"
else
    error_exit "pg_dump failed"
fi

# Verify backup
BACKUP_SIZE=$(stat -f%z "$BACKUP_DIR/$BACKUP_FILE" 2>/dev/null || stat -c%s "$BACKUP_DIR/$BACKUP_FILE")
if [ "$BACKUP_SIZE" -lt 1000 ]; then
    error_exit "Backup file is too small: ${BACKUP_SIZE} bytes"
fi
log "Backup file size: $(numfmt --to=iec-i --suffix=B $BACKUP_SIZE)"

# Compress backup
log "Compressing backup..."
gzip "$BACKUP_DIR/$BACKUP_FILE"
BACKUP_FILE="${BACKUP_FILE}.gz"

# Upload to S3
log "Uploading to S3..."
if aws s3 cp "$BACKUP_DIR/$BACKUP_FILE" "s3://$S3_BUCKET/postgres/$BACKUP_FILE" \
    --storage-class STANDARD_IA \
    --metadata "timestamp=$TIMESTAMP,database=$DB_NAME"; then
    log "Upload to S3 completed"
else
    error_exit "S3 upload failed"
fi

# Create latest symlink in S3
aws s3 cp "s3://$S3_BUCKET/postgres/$BACKUP_FILE" \
    "s3://$S3_BUCKET/postgres/latest.sql.gz" \
    --metadata-directive REPLACE \
    --metadata "timestamp=$TIMESTAMP,database=$DB_NAME,original=$BACKUP_FILE"

# Clean up old local backups
log "Cleaning up old local backups..."
find "$BACKUP_DIR" -name "backup_${DB_NAME}_*.sql.gz" -mtime +7 -delete

# Clean up old S3 backups
log "Cleaning up old S3 backups..."
CUTOFF_DATE=$(date -d "$RETENTION_DAYS days ago" +%Y%m%d 2>/dev/null || date -v-${RETENTION_DAYS}d +%Y%m%d)
aws s3 ls "s3://$S3_BUCKET/postgres/" | while read -r line; do
    FILE_DATE=$(echo "$line" | grep -oE '[0-9]{8}_[0-9]{6}' | cut -d_ -f1)
    FILE_NAME=$(echo "$line" | awk '{print $4}')
    
    if [[ ! -z "$FILE_DATE" ]] && [[ "$FILE_DATE" < "$CUTOFF_DATE" ]]; then
        log "Deleting old backup: $FILE_NAME"
        aws s3 rm "s3://$S3_BUCKET/postgres/$FILE_NAME"
    fi
done

# Test restore capability (optional, runs monthly)
if [ "$(date +%d)" == "01" ]; then
    log "Running monthly restore test..."
    TEST_DB="${DB_NAME}_restore_test"
    
    # Download latest backup
    aws s3 cp "s3://$S3_BUCKET/postgres/latest.sql.gz" "/tmp/test_restore.sql.gz"
    gunzip "/tmp/test_restore.sql.gz"
    
    # Create test database
    psql "$DATABASE_URL" -c "CREATE DATABASE $TEST_DB;" 2>/dev/null || true
    
    # Restore
    if pg_restore --dbname="$TEST_DB" --verbose "/tmp/test_restore.sql" 2>&1 | tail -20; then
        log "Restore test passed"
        # Verify data
        ROW_COUNT=$(psql "$DATABASE_URL" -d "$TEST_DB" -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null || echo "0")
        log "Restored database has $ROW_COUNT users"
    else
        log "WARNING: Restore test failed"
    fi
    
    # Cleanup
    psql "$DATABASE_URL" -c "DROP DATABASE IF EXISTS $TEST_DB;"
    rm -f "/tmp/test_restore.sql"
fi

# Report success
log "Backup completed successfully"

# Send success notification
if [ ! -z "${SLACK_WEBHOOK_URL:-}" ]; then
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"✅ Database backup completed: ${BACKUP_FILE} ($(numfmt --to=iec-i --suffix=B $BACKUP_SIZE))\"}" \
        "$SLACK_WEBHOOK_URL" 2>/dev/null || true
fi

# Create backup metadata
cat > "$BACKUP_DIR/latest_backup.json" <<EOF
{
  "timestamp": "$TIMESTAMP",
  "database": "$DB_NAME",
  "file": "$BACKUP_FILE",
  "size": $BACKUP_SIZE,
  "s3_location": "s3://$S3_BUCKET/postgres/$BACKUP_FILE",
  "retention_days": $RETENTION_DAYS
}
EOF

exit 0