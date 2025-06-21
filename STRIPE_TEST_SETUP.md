# Stripe Test Configuration Guide

## Quick Setup for Testing

### 1. Get Test Keys from Stripe Dashboard
1. Log into [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your test keys:
   - Publishable key: `pk_test_...`
   - Secret key: `sk_test_...`

### 2. Add to Vercel Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/axis-thorns-projects/axis-thorn-llc-website/settings/environment-variables)
2. Add these variables:
   ```
   STRIPE_SECRET_KEY=sk_test_51...
   STRIPE_PUBLISHABLE_KEY=pk_test_51...
   JWT_SECRET=your-generated-secret-here
   ```

### 3. Generate JWT Secret
```bash
# Generate a secure JWT secret
openssl rand -base64 32
# Example output: 47D5nKtQp8V5jXFyP8lWZ3nMkR9TzU8QWs5+XVBmRDo=
```

### 4. Test Card Numbers
Use these test cards for different scenarios:
- **Success**: 4242 4242 4242 4242
- **Requires authentication**: 4000 0025 0000 3155
- **Declined**: 4000 0000 0000 9995

All test cards use:
- Any future date for expiry
- Any 3 digits for CVC
- Any 5 digits for postal code

### 5. Create Test Products
```javascript
// Example API call to create a product
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const product = await stripe.products.create({
  name: 'Axis AI Access - Monthly',
  description: 'Monthly subscription to Axis AI platform',
});

const price = await stripe.prices.create({
  product: product.id,
  unit_amount: 9900, // $99.00
  currency: 'usd',
  recurring: {
    interval: 'month',
  },
});

console.log('Price ID:', price.id); // Use this in your checkout
```

### 6. Test Webhook (Optional)
1. Install Stripe CLI:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. Login and forward webhooks:
   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/stripe-webhook
   ```

3. Copy the webhook signing secret and add to Vercel:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## Testing the Integration

### 1. Test API Health
```bash
curl https://axisthorn.com/api/env-check
```

### 2. Test Checkout Session
```bash
curl -X POST https://axisthorn.com/api/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{
    "priceId": "price_1234567890",
    "customerEmail": "test@example.com",
    "successUrl": "https://axisthorn.com/success",
    "cancelUrl": "https://axisthorn.com"
  }'
```

### 3. Frontend Integration Example
```javascript
// In your frontend code
async function createCheckout() {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      priceId: 'price_1234567890',
      customerEmail: document.getElementById('email').value,
    }),
  });

  const { url } = await response.json();
  window.location.href = url; // Redirect to Stripe Checkout
}
```

## Common Issues

### "Stripe is not configured"
- Make sure STRIPE_SECRET_KEY is set in Vercel environment variables
- Redeploy after adding environment variables

### CORS errors
- The API already includes CORS headers for axisthorn.com
- For local testing, use http://localhost:3000

### "Price ID is required"
- Create products and prices in Stripe Dashboard first
- Use the price ID (not product ID) in checkout sessions

## Going Live

When ready for production:
1. Switch to live keys in Stripe Dashboard
2. Update Vercel environment variables with live keys
3. Update webhook endpoint to live URL
4. Test with real cards (small amounts first!)