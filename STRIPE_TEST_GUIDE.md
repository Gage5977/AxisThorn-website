# Stripe Payment Integration Test Guide

## Test Mode Configuration

To test the Stripe payment flow on your Axis Thorn website:

### 1. Environment Variables Required

Set these in your Vercel dashboard:

```
STRIPE_SECRET_KEY=sk_test_[your_test_key]
STRIPE_PUBLISHABLE_KEY=pk_test_[your_test_key]
STRIPE_WEBHOOK_SECRET=whsec_[your_webhook_secret]
JWT_SECRET=[32+ character random string]
DEMO_SECRET=demo2024
```

### 2. Test Credit Cards

Use these test card numbers for different scenarios:

**Successful Payment:**
- Card: 4242 4242 4242 4242
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

**Payment Requires Authentication:**
- Card: 4000 0025 0000 3155
- This will trigger 3D Secure authentication

**Payment Declined:**
- Card: 4000 0000 0000 0002

### 3. Testing the Banking Portal

1. Navigate to `/banking-portal` or click "Banking Portal" from homepage
2. Enter access code: `demo2024`
3. Click on "Payment Options" tab
4. Test the "Pay with Card" functionality

### 4. Testing the Client Portal (Invoices)

1. Navigate to `/invoices` or click "Client Portal" from homepage
2. Enter access code: `demo2024`
3. Create a test invoice
4. Process payment for the invoice

### 5. API Endpoints

The payment API endpoints are available at:

- **Create Payment Intent:** POST `/api/stripe-payment`
  ```json
  {
    "action": "create-payment-intent",
    "amount": 100.00,
    "currency": "usd",
    "description": "Test payment",
    "customer_email": "test@example.com"
  }
  ```

- **Get Payment Status:** POST `/api/stripe-payment`
  ```json
  {
    "action": "get-payment-status",
    "paymentIntentId": "pi_..."
  }
  ```

### 6. Webhook Configuration

In your Stripe Dashboard:
1. Go to Developers → Webhooks
2. Add endpoint: `https://axisthorn.com/api/stripe-webhook`
3. Select events:
   - payment_intent.succeeded
   - payment_intent.payment_failed
   - charge.succeeded

### 7. Monitoring Payments

- View test payments in Stripe Dashboard (test mode)
- Check browser console for client-side errors
- Monitor Vercel function logs for server-side errors

### 8. Common Issues & Solutions

**"Stripe configuration missing" error:**
- Ensure STRIPE_SECRET_KEY is set in Vercel env vars

**Authentication errors:**
- Check JWT_SECRET is set and valid
- Verify DEMO_SECRET matches the access code

**CORS errors:**
- Ensure your domain is in the ALLOWED_ORIGINS list
- Check Vercel deployment URL is correct

## Production Checklist

Before going live:
- [ ] Switch to live Stripe keys
- [ ] Remove test card numbers from documentation
- [ ] Implement proper user authentication (replace demo)
- [ ] Set up real webhook endpoints
- [ ] Enable Stripe fraud protection
- [ ] Configure payment receipt emails
- [ ] Test with real payment methods