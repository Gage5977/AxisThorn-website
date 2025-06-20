# Vercel Environment Variables Checklist

## Required Environment Variables

Please ensure these are set in your Vercel dashboard under **Settings > Environment Variables**:

### Stripe Configuration
- [ ] `STRIPE_SECRET_KEY` - Your Stripe secret key (sk_live_... or sk_test_...)
- [ ] `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key (pk_live_... or pk_test_...)
- [ ] `STRIPE_WEBHOOK_SECRET` - Webhook signing secret (whsec_...)

### Security Configuration
- [ ] `JWT_SECRET` - A secure random string (32+ characters)
  - Example: `openssl rand -base64 32`
- [ ] `PAYMENT_API_KEY` - API key for server-to-server auth
  - Example: `openssl rand -hex 32`
- [ ] `DEMO_CLIENT_SECRET` - Demo client secret (change from default)
  - Default: `demo-secret-key` (MUST CHANGE IN PRODUCTION)

### Optional Configuration
- [ ] `OPENAI_API_KEY` - If using AI features
- [ ] `VITE_GA_MEASUREMENT_ID` - Google Analytics ID

## How to Add Environment Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with:
   - Key: Variable name (e.g., `STRIPE_SECRET_KEY`)
   - Value: Your actual key/secret
   - Environment: Select all (Production, Preview, Development)
4. Click **Save** for each variable

## Verify Deployment

After setting environment variables:

1. **Check Build Logs**:
   - Go to Vercel Dashboard → Your Project → Functions tab
   - Verify no build errors

2. **Test Banking Portal**:
   - Visit: `https://your-domain.vercel.app/banking-portal.html`
   - Should load without errors

3. **Test Banking Page**:
   - Visit: `https://your-domain.vercel.app/banking.html`
   - Click "Pay with Card" button
   - Should prompt for authentication

4. **Test API Endpoints**:
   ```bash
   # Test payment methods API
   curl https://your-domain.vercel.app/api/payment-methods
   
   # Should return JSON with payment methods
   ```

## Troubleshooting

If deployment fails:
1. Check Vercel build logs for missing dependencies
2. Verify all environment variables are set
3. Check function logs for runtime errors
4. Ensure Node.js version is >=18.0.0

## Security Note

**IMPORTANT**: Never commit actual keys to Git. Always use environment variables for sensitive data.