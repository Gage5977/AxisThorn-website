# Deployment Checklist ✓

## Pre-Deployment

### Code Quality
- [x] Run linter: `npm run lint`
- [x] Format code: `npm run format`
- [x] Build locally: `npm run build`
- [x] Test locally: `npm test`

### Security
- [x] No hardcoded secrets in code
- [x] Environment variables documented
- [x] CORS configured correctly
- [x] Security headers in vercel.json

## Deployment Steps

### 1. Commit Changes
```bash
git add -A
git commit -m "feat: your descriptive message"
git push origin main
```

### 2. Verify Deployment
```bash
# Wait 2-3 minutes for Vercel deployment
npm test
npm run test:api
```

### 3. Check Production
- [ ] Homepage loads: https://axisthorn.com
- [ ] Portal pages work: /invoices, /banking-portal
- [ ] API health: https://axisthorn.com/api/health
- [ ] No console errors
- [ ] Mobile responsive

## Post-Deployment

### Monitoring
- [ ] Check Vercel dashboard for errors
- [ ] Verify Analytics is tracking
- [ ] Test critical user flows

### If Issues Occur
1. Check Vercel logs
2. Run `npm run test:api` for API issues
3. Rollback if needed: Vercel dashboard → Deployments → Promote previous

## Environment Variables Required

Add these in Vercel Dashboard → Settings → Environment Variables:

### Essential (for basic operation)
```
JWT_SECRET=[generate with: openssl rand -base64 32]
NODE_ENV=production
```

### For Payments (when ready)
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Optional
```
DATABASE_URL=postgresql://...
SENDGRID_API_KEY=SG...
```

## Quick Commands

```bash
# Local development
npm run dev

# Build and test
npm run build && npm test

# Deploy
git push origin main

# Check deployment
npm run test:api

# View logs
vercel logs
```

## Critical Files to Never Delete
- `/public/api/*` - API endpoints
- `/public/robots.txt` - SEO
- `/public/sitemap.xml` - SEO
- `/public/.well-known/*` - Domain verification
- `/vercel.json` - Deployment config

## Performance Goals
- [ ] Lighthouse score > 90
- [ ] First paint < 2s
- [ ] API response < 500ms
- [ ] No 404s for critical paths

## Monthly Maintenance
- [ ] Update dependencies: `npm update`
- [ ] Check for security issues: `npm audit`
- [ ] Review error logs
- [ ] Backup database (if applicable)
- [ ] Rotate JWT secret

## Emergency Contacts
- Vercel Support: https://vercel.com/support
- Domain Issues: Your registrar
- API Issues: Check /api/health first