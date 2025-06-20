# Deployment Testing Guide

## Pre-Testing Checklist

### 1. Verify Deployment Status
- [ ] Check Vercel dashboard for successful build
- [ ] Confirm all environment variables are set in Vercel
- [ ] Note your deployment URL (e.g., https://axisthorn.vercel.app)

### 2. Environment Variables to Verify
In Vercel Dashboard > Settings > Environment Variables:
- [ ] STRIPE_SECRET_KEY (starts with sk_)
- [ ] STRIPE_PUBLISHABLE_KEY (starts with pk_)
- [ ] STRIPE_WEBHOOK_SECRET (starts with whsec_)
- [ ] JWT_SECRET (32+ characters)
- [ ] PAYMENT_API_KEY
- [ ] DEMO_CLIENT_SECRET

## Testing Steps

### 1. Test Homepage Navigation
```bash
# Visit your deployment
https://your-domain.vercel.app/

# Verify:
- [ ] Homepage loads without errors
- [ ] "System Access" section shows 4 cards
- [ ] Banking Portal link is visible
```

### 2. Test Banking Portal
```bash
# Visit banking portal
https://your-domain.vercel.app/banking-portal.html

# Verify:
- [ ] Page loads without JavaScript errors
- [ ] Navigation tabs work (Overview, Banking Instructions, etc.)
- [ ] Banking details show "[Click to Request]" placeholders
- [ ] 1099 form loads
```

### 3. Test Banking Page (Stripe Integration)
```bash
# Visit banking page
https://your-domain.vercel.app/banking.html

# Verify:
- [ ] Page loads with payment methods
- [ ] "Pay with Card" button is visible
- [ ] Clicking button shows authentication modal
```

### 4. Test Authentication Flow
1. Click "Pay with Card" on banking page
2. Use demo credentials:
   - Client ID: `demo-client`
   - Client Secret: (value from your DEMO_CLIENT_SECRET env var)
3. Verify:
   - [ ] Authentication succeeds
   - [ ] Payment modal opens
   - [ ] Stripe card element loads

### 5. Test API Endpoints
```bash
# Test payment methods API
curl https://your-domain.vercel.app/api/payment-methods

# Test with authentication (will fail without token)
curl https://your-domain.vercel.app/api/stripe-payment \
  -H "Content-Type: application/json" \
  -d '{"action":"get-payment-status","paymentIntentId":"test"}'

# Should return 401 Unauthorized
```

### 6. Test Stripe Payment (Test Mode)
If Stripe key is configured:
1. Complete authentication
2. Fill payment form:
   - Invoice: INV-2025-TEST
   - Amount: 10.00
   - Email: test@example.com
3. Use test card: 4242 4242 4242 4242
4. Verify:
   - [ ] Payment processes without errors
   - [ ] Success message appears

## Console Commands for Debugging

```javascript
// Run in browser console on banking page

// Check if Stripe loaded
console.log('Stripe loaded:', typeof Stripe !== 'undefined');

// Check authentication status
console.log('Auth manager:', authManager);
console.log('Has valid token:', authManager.hasValidToken());

// Check for JavaScript errors
console.log('Page errors:', window.onerror);
```

## Common Issues and Solutions

### Issue: Banking portal not loading
- **Solution**: Check if banking-portal.html exists in deployment
- Run: `curl -I https://your-domain.vercel.app/banking-portal.html`

### Issue: Authentication fails with demo credentials
- **Solution**: Verify DEMO_CLIENT_SECRET is set in Vercel env vars
- Check API logs in Vercel dashboard

### Issue: Stripe not loading
- **Solution**: 
  1. Update STRIPE_PUBLISHABLE_KEY in banking.html
  2. Ensure Stripe JS library loads (check network tab)
  3. Verify no Content Security Policy blocks

### Issue: API returns 500 errors
- **Solution**: Check function logs in Vercel dashboard
- Common causes: Missing env vars, dependency issues

## Mobile Testing
- [ ] Test on mobile device or responsive mode
- [ ] Verify navigation menu works
- [ ] Check modal displays properly
- [ ] Confirm forms are usable

## Performance Checks
```bash
# Run Lighthouse audit
# In Chrome DevTools > Lighthouse > Generate report

Target scores:
- Performance: >90
- Accessibility: >95
- Best Practices: >95
- SEO: >95
```

## Final Verification
- [ ] All pages load without errors
- [ ] Navigation works across all pages
- [ ] Payment authentication flow completes
- [ ] No console errors in browser
- [ ] Mobile experience is smooth

## Post-Testing Actions
1. Document any issues found
2. Update Stripe key from test to live (when ready)
3. Set up monitoring for API endpoints
4. Configure Stripe webhooks in dashboard
5. Test live payment with small amount