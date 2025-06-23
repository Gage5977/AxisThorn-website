# Safe Deployment Guide

## Current Safe Deployment ✅

The website is currently configured for **FRONTEND-ONLY** deployment, which is safe and will not crash.

### What's Included:
- ✅ All static pages (homepage, about, services, etc.)
- ✅ CSS and JavaScript assets
- ✅ Contact form (visual only)
- ✅ Service worker for offline support
- ✅ Performance optimizations

### What's Excluded:
- ❌ API endpoints (returns 503 maintenance)
- ❌ Authentication system
- ❌ Payment processing
- ❌ Admin dashboard
- ❌ Document management

## Deploy Now (Safe)

```bash
# 1. Ensure .vercelignore excludes backend
cat .vercelignore

# 2. Deploy to Vercel
vercel --prod

# 3. Your site will be live with static content only
```

## Future Full Deployment

### Step 1: Database Setup
```bash
# 1. Create PostgreSQL database
# 2. Add to Vercel environment variables:
DATABASE_URL="postgresql://user:pass@host:5432/db"

# 3. Run migrations
npx prisma migrate deploy
```

### Step 2: Required Environment Variables
Add these in Vercel Dashboard > Settings > Environment Variables:

```env
# Required
DATABASE_URL="postgresql://..."
JWT_SECRET="32-character-random-string"
NODE_ENV="production"

# For payments
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
PAYMENT_API_KEY="secure-api-key"

# For emails
EMAIL_HOST="smtp.sendgrid.net"
EMAIL_PORT="587"
EMAIL_USER="apikey"
EMAIL_PASS="your-sendgrid-api-key"
```

### Step 3: Update .vercelignore
Remove these lines to enable backend:
```
# Comment out or remove:
# api/
# prisma/
# lib/
```

### Step 4: Test Before Deploy
```bash
# Check environment
node scripts/check-env.js

# Test locally with production env
vercel dev
```

## Deployment Checklist

### Safe Static Deployment (NOW)
- [x] .vercelignore excludes /api
- [x] Static pages work
- [x] No database required
- [x] No external services needed

### Full Production Deployment (LATER)
- [ ] PostgreSQL database created
- [ ] All env variables in Vercel
- [ ] Stripe account configured
- [ ] Email service connected
- [ ] Migrations run successfully
- [ ] .vercelignore updated
- [ ] Health check passes
- [ ] Test user can login

## Emergency Rollback

If anything breaks after enabling backend:

1. **Quick Fix**: Re-add to .vercelignore:
   ```
   api/
   prisma/
   lib/
   ```

2. **Redeploy**: `vercel --prod`

3. **Site returns to static-only mode**

## Support

For deployment issues:
- Check `/deployment-status.html` on your site
- Run `node scripts/check-env.js` locally
- Contact: AI.info@axisthorn.com

---

**Remember**: The current configuration is SAFE. The backend will not crash because it's excluded from deployment.