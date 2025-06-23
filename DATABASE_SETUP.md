# Database Setup Guide

## Overview
The Axis Thorn website uses PostgreSQL with Prisma ORM for database management. The current implementation uses in-memory storage for development, but this guide will help you set up a proper database.

## Prerequisites
- PostgreSQL 12+ installed
- Node.js 16+ installed
- Access to create databases

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up PostgreSQL Database
Create a new database for the project:
```sql
CREATE DATABASE axisthorn_db;
```

### 3. Configure Environment Variables
Update your `.env` file with the database connection string:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/axisthorn_db"
```

### 4. Generate Prisma Client
```bash
npx prisma generate
```

### 5. Run Database Migrations
```bash
npx prisma migrate dev --name init
```

### 6. Seed Initial Data (Optional)
```bash
npx prisma db seed
```

## Migration from In-Memory Storage

The current implementation uses in-memory Maps for storage. To migrate to a database:

1. **Authentication System** (`/api/middleware/auth.js`)
   - Replace `const users = new Map()` with database queries
   - Update all user operations to use Prisma

2. **Update API Endpoints**
   - `/api/auth/register.js` - Use `prisma.user.create()`
   - `/api/auth/login.js` - Use `prisma.user.findUnique()`
   - `/api/documents/index.js` - Use `prisma.document` methods
   - All admin endpoints - Update to use database queries

3. **Session Management**
   - Store refresh tokens in the Session table
   - Implement proper session cleanup

## Example Code Updates

### Before (In-Memory):
```javascript
const users = new Map();
users.set(email, userData);
```

### After (Database):
```javascript
import { prisma } from '@/lib/db';

const user = await prisma.user.create({
  data: userData
});
```

## Database Schema Overview

- **Users** - Store user accounts with authentication
- **Sessions** - JWT refresh token storage
- **Documents** - File metadata for document management
- **Invoices** - Billing and invoice records
- **Notes** - Internal admin notes about clients
- **Activities** - Activity log for audit trail
- **PasswordReset** - Temporary password reset tokens

## Backup and Maintenance

### Create Backup
```bash
pg_dump axisthorn_db > backup.sql
```

### Restore Backup
```bash
psql axisthorn_db < backup.sql
```

### View Database Schema
```bash
npx prisma studio
```

## Production Considerations

1. **Connection Pooling** - Use PgBouncer or similar for production
2. **SSL/TLS** - Enable encrypted connections
3. **Backups** - Set up automated daily backups
4. **Monitoring** - Use tools like pgAdmin or DataDog
5. **Indexes** - Review and optimize indexes based on query patterns

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check PostgreSQL is running
   - Verify connection string
   - Check firewall settings

2. **Migration Errors**
   - Run `npx prisma migrate reset` to start fresh
   - Check for conflicting migrations

3. **Performance Issues**
   - Run `ANALYZE` on tables
   - Check for missing indexes
   - Review slow query logs

## Next Steps

1. Update all API endpoints to use the database
2. Implement proper error handling
3. Add database connection health checks
4. Set up monitoring and alerts
5. Plan for data migration from existing system