# Axis Thorn Deployment Guide

## Architecture Overview

| Tier | Service | URL |
|------|---------|-----|
| Frontend | Vercel | https://axisthorn.com |
| API | Render/Railway/Fly | https://api.axisthorn.com |
| Database | PostgreSQL | Managed by platform |
| Cache | Redis | Managed by platform |

## Frontend Deployment (Vercel)

Already deployed at: https://axis-thorn-llc-website.vercel.app

To update:
```bash
git push origin main
```

## API Deployment Options

### Option 1: Render.com (Recommended)

1. Go to https://render.com
2. Create account and connect GitHub
3. New > Blueprint > Select `api-deployment/render.yaml`
4. Set environment variables:
   - `ALLOWED_ORIGINS`: Add your Vercel URL
   - `ADMIN_EMAIL`: Your admin email
   - `ADMIN_PASSWORD`: Secure password
   - `STRIPE_SECRET_KEY`: Your Stripe key
5. Deploy

### Option 2: Railway

1. Install Railway CLI: `npm i -g @railway/cli`
2. From `api-deployment/` directory:
```bash
railway login
railway init
railway add postgresql
railway add redis
railway up
railway domain api.axisthorn.com
```

### Option 3: Fly.io

1. Install Fly CLI: `brew install flyctl`
2. From `api-deployment/` directory:
```bash
fly launch
fly postgres create --name axis-thorn-db
fly postgres attach axis-thorn-db
fly redis create
fly secrets set JWT_SECRET="your-secret-here"
fly secrets set ALLOWED_ORIGINS="https://axisthorn.com,..."
fly deploy
```

## Post-Deployment Steps

1. **Update DNS**:
   - Add CNAME record: `api.axisthorn.com` → Your API host

2. **Update Frontend**:
   - Set `NEXT_PUBLIC_API_URL=https://api.axisthorn.com` in Vercel

3. **Run Migrations**:
   ```bash
   # On your deployment platform, run:
   npx prisma migrate deploy
   npx prisma db seed
   ```

4. **Verify Deployment**:
   ```bash
   curl https://api.axisthorn.com/api/health
   curl https://api.axisthorn.com/api/v1
   ```

5. **Test Access Codes**:
   ```bash
   curl -X POST https://api.axisthorn.com/api/v1/access-codes/redeem \
     -H "Content-Type: application/json" \
     -d '{"code":"DEMO-2025-AXIS"}'
   ```

## Environment Variables Summary

### Required
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: At least 32 characters
- `ALLOWED_ORIGINS`: Comma-separated list

### Recommended
- `REDIS_URL`: For rate limiting
- `ADMIN_EMAIL`: For initial admin user
- `ADMIN_PASSWORD`: For initial admin user

### Optional
- `STRIPE_SECRET_KEY`: For payments
- `STRIPE_WEBHOOK_SECRET`: For Stripe webhooks
- `LOG_SERVICE`: datadog or logtail
- `LOG_TOKEN`: For log aggregation