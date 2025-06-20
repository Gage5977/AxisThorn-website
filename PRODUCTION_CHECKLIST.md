# Production Deployment Checklist

## Pre-Deployment Requirements

### 1. Stripe Configuration ✓
- [ ] Create Stripe account (if not already)
- [ ] Complete Stripe identity verification
- [ ] Enable live mode in Stripe Dashboard
- [ ] Get production API keys:
  - Secret Key: `sk_live_...`
  - Publishable Key: `pk_live_...`
- [ ] Configure webhook endpoint:
  - URL: `https://axisthorn.com/api/stripe-webhook`
  - Events: payment_intent.succeeded, payment_intent.payment_failed, etc.
- [ ] Copy webhook signing secret: `whsec_...`

### 2. Environment Variables in Vercel ✓
Add these in Vercel Dashboard → Settings → Environment Variables:

**Required:**
```
NODE_ENV=production
STRIPE_SECRET_KEY=sk_live_YOUR_KEY
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY  
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
JWT_SECRET=[Generated 32+ char secret]
PAYMENT_API_KEY=[Generated API key]
```

**Optional:**
```
PRODUCTION_CLIENTS={"client-id":{"secret":"...","name":"...","allowedInvoicePatterns":["*"]}}
VITE_GA_MEASUREMENT_ID=G-YOUR_ID
OPENAI_API_KEY=sk-YOUR_KEY
```

### 3. Domain Configuration ✓
- [ ] Add custom domain in Vercel: axisthorn.com
- [ ] Configure DNS records:
  - A record: @ → 76.76.21.21
  - CNAME: www → cname.vercel-dns.com
- [ ] Enable HTTPS (automatic in Vercel)
- [ ] Set up domain redirects (www → non-www)

### 4. Security Review ✓
- [ ] Remove all test/demo credentials
- [ ] Verify Content Security Policy headers
- [ ] Enable HSTS with preload
- [ ] Set secure cookie flags
- [ ] Review CORS configuration
- [ ] Validate input sanitization

### 5. Code Updates ✓
- [ ] Update Stripe key in config.js
- [ ] Remove console.log statements
- [ ] Minify JavaScript/CSS
- [ ] Optimize images
- [ ] Enable gzip compression

## Deployment Process

### 1. Final Build Test
```bash
# Clean install and build
rm -rf node_modules
npm install
npm run build:vercel

# Test locally
npm run preview
```

### 2. Deploy to Production
```bash
# Use the deployment script
./deploy-production.sh

# Or manual deployment
vercel --prod
```

### 3. Post-Deployment Verification

#### A. Basic Functionality
- [ ] Homepage loads: https://axisthorn.com
- [ ] Banking portal accessible: https://axisthorn.com/banking-portal
- [ ] Banking page loads: https://axisthorn.com/banking
- [ ] Client portal works: https://axisthorn.com/invoices
- [ ] All navigation links functional

#### B. Payment Testing
- [ ] Create test payment with live card
- [ ] Verify payment appears in Stripe Dashboard
- [ ] Check webhook delivery
- [ ] Confirm email notifications
- [ ] Test payment authentication flow

#### C. Security Testing
- [ ] SSL certificate valid
- [ ] Security headers present
- [ ] API endpoints require authentication
- [ ] Rate limiting works
- [ ] No sensitive data exposed

#### D. Performance Testing
- [ ] Page load time < 3 seconds
- [ ] Lighthouse score > 90
- [ ] Mobile responsive
- [ ] Images optimized
- [ ] JavaScript minified

## Monitoring Setup

### 1. Error Tracking
- [ ] Set up Vercel Analytics
- [ ] Configure error alerts
- [ ] Monitor function logs
- [ ] Track API response times

### 2. Payment Monitoring
- [ ] Stripe Dashboard notifications
- [ ] Failed payment alerts
- [ ] Daily transaction reports
- [ ] Webhook failure notifications

### 3. Security Monitoring
- [ ] Failed authentication attempts
- [ ] Rate limit violations
- [ ] CSP violation reports
- [ ] SSL certificate expiration

## Rollback Plan

If issues occur after deployment:

1. **Immediate Rollback**
   ```bash
   vercel rollback
   ```

2. **Check Previous Deployments**
   ```bash
   vercel ls
   ```

3. **Promote Specific Deployment**
   ```bash
   vercel promote [deployment-url]
   ```

## Support Contacts

- **Stripe Support**: support.stripe.com
- **Vercel Support**: vercel.com/support
- **Domain Issues**: Your registrar's support
- **Development**: AI.info@axisthorn.com

## Final Sign-off

- [ ] All checklist items completed
- [ ] Production testing successful
- [ ] Monitoring configured
- [ ] Team notified of go-live
- [ ] Documentation updated

**Deployment Date**: _______________
**Deployed By**: _______________
**Version**: _______________