# Axis Thorn Production Runbook

**Last Updated:** 2025-01-21  
**Service:** Axis Thorn API & Portal  
**Primary URL:** https://axisthorn.com  
**API Base:** https://axisthorn.com/api/v1  

## Quick Reference

### Health Check
```bash
curl https://axisthorn.com/api/health
```

### Contact Chain
1. **On-Call Engineer:** [YOUR_PHONE] / [YOUR_EMAIL]
2. **Platform Lead:** [LEAD_EMAIL]
3. **Escalation:** [MANAGER_EMAIL]

## Deployment Steps

### 1. Standard Deploy (GitHub → Production)
```bash
# 1. Merge to main branch
git checkout main
git pull origin main

# 2. Push triggers GitHub Actions CI/CD
git push origin main

# 3. Monitor deployment
# Check: https://github.com/Gage5977/AxisThorn-website/actions

# 4. Verify deployment
curl https://axisthorn.com/api/health
```

### 2. Manual Deploy (if CI/CD fails)
```bash
# 1. Build Docker image locally
docker build -t axis-api:latest .

# 2. Tag for registry
docker tag axis-api:latest [REGISTRY]/axis-api:latest

# 3. Push to registry
docker push [REGISTRY]/axis-api:latest

# 4. Update deployment
kubectl set image deployment/axis-api api=[REGISTRY]/axis-api:latest
# OR for Docker Swarm:
docker service update --image [REGISTRY]/axis-api:latest axis-api
```

## Environment Variables

### Required in Production
```
NODE_ENV=production
DATABASE_URL=postgresql://[user]:[pass]@[host]:5432/[db]
REDIS_URL=redis://[host]:6379
JWT_SECRET=[32+ chars]
STRIPE_SECRET_KEY=sk_live_[...]
STRIPE_WEBHOOK_SECRET=whsec_[...]
ALLOWED_ORIGINS=https://axisthorn.com,https://www.axisthorn.com
```

### Optional but Recommended
```
SMTP_HOST=smtp.[provider].com
SMTP_PORT=587
SMTP_USER=[email]
SMTP_PASS=[password]
EMAIL_FROM=noreply@axisthorn.com
LOG_SERVICE=datadog|logtail
LOG_TOKEN=[token]
FORCE_HTTPS=true
```

## Rollback Procedure

### Quick Rollback (< 5 min)
```bash
# 1. Get previous image tag
kubectl rollout history deployment/axis-api

# 2. Rollback to previous version
kubectl rollout undo deployment/axis-api

# 3. Verify rollback
curl https://axisthorn.com/api/health
```

### Database Rollback
```bash
# 1. Stop application
kubectl scale deployment/axis-api --replicas=0

# 2. Restore database
pg_restore -h [host] -U [user] -d [db] [backup_file]

# 3. Run migrations down (if needed)
npx prisma migrate resolve --rolled-back [migration_name]

# 4. Restart application
kubectl scale deployment/axis-api --replicas=3
```

## Hotfix Process

### Critical Security Fix
```bash
# 1. Create hotfix branch
git checkout -b hotfix/security-patch main

# 2. Apply fix
# ... make changes ...

# 3. Test locally
npm test
docker build -t axis-api:hotfix .
docker run -p 3000:3000 axis-api:hotfix

# 4. Deploy directly to production
git push origin hotfix/security-patch
# Create PR and merge with admin override

# 5. Backport to develop
git checkout develop
git cherry-pick [commit-sha]
git push origin develop
```

## Monitoring & Alerts

### Key Metrics
- **Health Endpoint:** `GET /api/health` (expect 200)
- **Response Time:** p95 < 200ms, p99 < 500ms
- **Error Rate:** < 1% 5xx responses
- **Memory Usage:** < 512MB per container
- **CPU Usage:** < 80% sustained

### Alert Thresholds
```yaml
alerts:
  - name: API Down
    condition: health_check_failures > 3
    severity: critical
    
  - name: High Error Rate
    condition: error_rate_5xx > 5%
    severity: warning
    
  - name: Slow Response
    condition: p95_latency > 500ms
    severity: warning
    
  - name: Memory Leak
    condition: memory_usage > 450MB
    severity: warning
```

## Database Operations

### Backup Schedule
- **Automated:** Daily at 2 AM UTC
- **Retention:** 30 days rolling
- **Location:** S3 bucket `axis-thorn-backups`

### Manual Backup
```bash
# Create backup
pg_dump -h [host] -U [user] -d [db] -f backup_$(date +%Y%m%d_%H%M%S).sql

# Verify backup
pg_restore --list backup_[timestamp].sql | head -20
```

### Restore from Backup
```bash
# 1. Create new database
createdb -h [host] -U [user] axisthorn_restore

# 2. Restore
pg_restore -h [host] -U [user] -d axisthorn_restore backup.sql

# 3. Verify
psql -h [host] -U [user] -d axisthorn_restore -c "SELECT COUNT(*) FROM users;"

# 4. Switch application
# Update DATABASE_URL to point to axisthorn_restore
```

## Common Issues

### Issue: 502 Bad Gateway
```bash
# Check if containers are running
kubectl get pods -l app=axis-api

# Check logs
kubectl logs -l app=axis-api --tail=100

# Restart if needed
kubectl rollout restart deployment/axis-api
```

### Issue: Database Connection Errors
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# Check connection pool
kubectl exec -it [pod-name] -- node -e "
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  prisma.\$connect().then(() => console.log('Connected')).catch(console.error);
"
```

### Issue: Redis Connection Failed
```bash
# Test Redis
redis-cli -u $REDIS_URL ping

# Flush if corrupted (CAUTION: clears rate limits)
redis-cli -u $REDIS_URL FLUSHDB
```

### Issue: Stripe Webhooks Failing
```bash
# Check webhook secret
curl -X POST https://axisthorn.com/api/v1/stripe-webhook \
  -H "Stripe-Signature: test" \
  -d '{}'
# Should return 400 with signature error

# Verify endpoint in Stripe Dashboard
# https://dashboard.stripe.com/webhooks
```

## Performance Testing

### Quick Load Test
```bash
# Install k6 if needed
brew install k6

# Run load test
k6 run --vus 100 --duration 5m performance/load-test.js
```

### Memory Profiling
```bash
# Connect to container
kubectl exec -it [pod-name] -- sh

# Start with profiling
node --inspect=0.0.0.0:9229 server.js

# Forward port locally
kubectl port-forward [pod-name] 9229:9229

# Open chrome://inspect in browser
```

## Security Checklist

- [ ] All secrets rotated quarterly
- [ ] JWT_SECRET is 32+ characters
- [ ] HTTPS enforced (HSTS headers present)
- [ ] CORS restricted to production domains
- [ ] Rate limiting active (Redis-backed)
- [ ] SQL injection protection (Prisma parameterized queries)
- [ ] XSS protection (Helmet CSP headers)
- [ ] Dependencies updated (no critical CVEs)

## Disaster Recovery

### Full System Recovery
1. **Database:** Restore from latest S3 backup
2. **Redis:** Can be rebuilt (transient data)
3. **Application:** Deploy from last known good image
4. **DNS:** Update if using new IPs
5. **SSL:** Ensure certs are valid

### RTO/RPO Targets
- **RTO (Recovery Time):** < 1 hour
- **RPO (Data Loss):** < 24 hours
- **Degraded Mode:** API read-only in 15 min

## Appendix

### Useful Commands
```bash
# View all environment variables (masked)
kubectl exec [pod] -- env | grep -E '^[A-Z_]+=' | sed 's/=.*/=***/'

# Database query stats
kubectl exec [pod] -- npx prisma studio

# Clear application cache
kubectl exec [pod] -- rm -rf .cache/

# Force garbage collection
kubectl exec [pod] -- node -e "global.gc()"
```

### Dependencies
- Node.js 20.x (LTS)
- PostgreSQL 15.x
- Redis 7.x
- Docker 24.x
- Kubernetes 1.28.x / Docker Swarm

---

**Remember:** Always test in staging first. When in doubt, escalate.