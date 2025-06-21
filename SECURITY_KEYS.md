# Security Keys Configuration

This document outlines all the security keys and secrets required for production deployment of Axis Thorn.

## Required Environment Variables

### 🔴 Critical (Application won't start without these in production)

| Variable | Purpose | Example | Where to Set |
|----------|---------|---------|--------------|
| `NODE_ENV` | Environment mode | `production` | Platform config |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@host:5432/db` | Platform secrets |
| `JWT_SECRET` | JWT signing key (min 32 chars) | `your-super-secret-jwt-key-at-least-32-chars` | Platform secrets |
| `ALLOWED_ORIGINS` | CORS whitelist | `https://axisthorn.com,https://www.axisthorn.com` | Platform config |

### 🟡 Important (Features won't work without these)

| Variable | Purpose | Example | Where to Set |
|----------|---------|---------|--------------|
| `REDIS_URL` | Rate limiting store | `redis://host:6379` | Platform secrets |
| `STRIPE_SECRET_KEY` | Stripe API key | `sk_live_...` | Platform secrets |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification | `whsec_...` | Platform secrets |

### 🟢 Optional (Graceful degradation if missing)

| Variable | Purpose | Example | Where to Set |
|----------|---------|---------|--------------|
| `SMTP_HOST` | Email server | `smtp.sendgrid.net` | Platform secrets |
| `SMTP_PORT` | Email port | `587` | Platform config |
| `SMTP_USER` | Email username | `apikey` | Platform secrets |
| `SMTP_PASS` | Email password | `SG.xxx...` | Platform secrets |
| `EMAIL_FROM` | From address | `noreply@axisthorn.com` | Platform config |
| `LOG_SERVICE` | Log aggregator | `datadog` or `logtail` | Platform config |
| `LOG_TOKEN` | Log service API key | Service-specific token | Platform secrets |
| `FORCE_HTTPS` | Force HTTPS redirect | `true` | Platform config |

### 🔐 Admin Setup

| Variable | Purpose | Example | Where to Set |
|----------|---------|---------|--------------|
| `ADMIN_EMAIL` | Admin user email | `admin@axisthorn.com` | Platform secrets |
| `ADMIN_PASSWORD` | Admin initial password | Strong password | Platform secrets |
| `ADMIN_NAME` | Admin display name | `System Administrator` | Platform config |

## Security Configuration by Component

### Public Site (/)
- **Protection**: None (intentionally public)
- **Keys Required**: None
- **Notes**: All marketing pages are publicly accessible

### Client Portal (/portal)
- **Protection**: JWT Bearer token via `Authorization` header
- **Keys Required**: 
  - `JWT_SECRET` - For token signing/verification
- **Flow**: Login → JWT issued → Token in all API requests
- **Status**: ✅ Fully implemented

### API Rate Limiting
- **Protection**: Redis-backed rate limiter by IP + route
- **Keys Required**:
  - `REDIS_URL` - Redis connection string
- **Limits**: 
  - General: 100 req/15min
  - Auth: 5 req/15min
  - Payments: 10 req/min
- **Status**: ✅ Implemented, fails to memory store in dev

### Stripe Payments
- **Protection**: Webhook signature verification
- **Keys Required**:
  - `STRIPE_SECRET_KEY` - For API calls
  - `STRIPE_WEBHOOK_SECRET` - For webhook verification
  - `STRIPE_PUBLISHABLE_KEY` - For client-side (public)
- **Status**: ✅ Code ready, needs real keys

### Access Code Wall (NEW)
- **Protection**: One-time or limited-use invite codes
- **Keys Required**: None (codes stored in database)
- **Features**:
  - Format: `XXXX-XXXX-XXXX` (e.g., `A3F7-9BK2-M5P8`)
  - Configurable max uses and expiration
  - Tracks usage by IP, user, timestamp
- **Status**: ✅ Implemented

## Setting Secrets in Different Platforms

### Vercel
```bash
vercel env add JWT_SECRET production
vercel env add DATABASE_URL production
vercel env add REDIS_URL production
# ... etc
```

### Heroku
```bash
heroku config:set JWT_SECRET="your-secret" --app your-app
heroku config:set DATABASE_URL="postgresql://..." --app your-app
# ... etc
```

### Docker/Kubernetes
```yaml
# docker-compose.yml
environment:
  - JWT_SECRET=${JWT_SECRET}
  - DATABASE_URL=${DATABASE_URL}
  # ... etc

# k8s secret
kubectl create secret generic axis-secrets \
  --from-literal=JWT_SECRET="your-secret" \
  --from-literal=DATABASE_URL="postgresql://..."
```

### AWS/GCP
Use respective secret management services:
- AWS Secrets Manager or Parameter Store
- GCP Secret Manager
- Azure Key Vault

## Validation Checklist

Run this before deploying to production:

```bash
# 1. Check all required vars are set
node -e "require('./lib/env-check').validateEnvironment()"

# 2. Test database connection
npx prisma db push --skip-generate

# 3. Test Redis connection
redis-cli -u $REDIS_URL ping

# 4. Verify JWT secret strength
node -e "console.log(process.env.JWT_SECRET.length >= 32 ? '✅ JWT OK' : '❌ JWT too short')"

# 5. Test Stripe webhook
curl -X POST https://your-domain.com/api/v1/stripe-webhook \
  -H "Stripe-Signature: test" \
  -d '{}' 
# Should return 400 with signature error
```

## Security Best Practices

1. **Rotate secrets quarterly**
   - JWT_SECRET - Implement key rotation strategy
   - API keys - Use provider's key rotation feature
   - Database passwords - Coordinate with ops

2. **Use different secrets per environment**
   - Never reuse production secrets in staging
   - Use weak/test secrets in development only

3. **Monitor secret usage**
   - Set up alerts for failed auth attempts
   - Track API key usage patterns
   - Monitor for exposed secrets in logs

4. **Principle of least privilege**
   - Create separate API keys for different services
   - Use read-only database users where possible
   - Limit CORS origins to exact domains

## Access Code Management

### Creating Access Codes (Admin Only)
```bash
# Via API
curl -X POST https://axisthorn.com/api/v1/access-codes \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "VIP Partner Access",
    "maxUses": 10,
    "expiresIn": 720
  }'
```

### Using Access Codes
1. Direct URL: `https://axisthorn.com/invite?code=XXXX-XXXX-XXXX`
2. Manual entry: Visit `/invite` and enter code
3. API header: `X-Access-Code: XXXX-XXXX-XXXX`

### Monitoring Access Codes
- Track usage in admin dashboard
- Set up alerts for suspicious patterns
- Regular audit of active codes

---

**Remember**: Never commit actual secrets to the repository. Use `.env` files locally and secure secret management in production.