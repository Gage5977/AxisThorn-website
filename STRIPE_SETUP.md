# Stripe Payment Integration Setup

## Overview
This document provides instructions for setting up and configuring the Stripe payment integration for the Axis Thorn LLC website.

## Prerequisites
- Stripe account (create at https://stripe.com)
- Node.js and npm installed
- Access to environment variables in your deployment platform

## Setup Instructions

### 1. Get Your Stripe API Keys
1. Log into your Stripe Dashboard
2. Navigate to Developers > API Keys
3. Copy your **Publishable key** and **Secret key**
4. For production, use live keys; for testing, use test keys

### 2. Configure Environment Variables
Add the following to your `.env` file (or deployment platform):

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # Your secret key
STRIPE_PUBLISHABLE_KEY=pk_test_... # Your publishable key
STRIPE_WEBHOOK_SECRET=whsec_... # Your webhook secret (see step 3)

# Security Configuration
JWT_SECRET=your_jwt_secret_here_32_chars_minimum # Generate a secure random string
PAYMENT_API_KEY=your_secure_api_key_here # For server-to-server communication
DEMO_CLIENT_SECRET=change_this_in_production # Demo client credentials
```

### 3. Set Up Webhooks
1. In Stripe Dashboard, go to Developers > Webhooks
2. Click "Add endpoint"
3. Enter your endpoint URL: `https://axisthorn.com/api/stripe-webhook`
4. Select the following events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.succeeded`
   - `charge.failed`
   - `customer.created`
5. Copy the webhook signing secret and add it to your environment variables

### 4. Update Frontend Configuration
In `/dist/banking.html`, update the Stripe publishable key:

```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_KEY_HERE'; // Line 460
```

### 5. Test the Integration
1. Use Stripe test cards: https://stripe.com/docs/testing
2. Common test card: `4242 4242 4242 4242`
3. Test the payment flow on your banking page
4. Check Stripe Dashboard for payment confirmations

## API Endpoints

### `/api/stripe-payment`
Handles payment processing:
- `POST` with action: `create-payment-intent` - Creates a new payment
- `POST` with action: `confirm-payment` - Confirms a payment
- `POST` with action: `get-payment-status` - Checks payment status

### `/api/stripe-webhook`
Receives and processes Stripe webhook events for payment confirmations and updates.

## Security Features

### Authentication System
The payment system requires authentication before processing:
1. Client credentials (ID and secret) are required
2. JWT tokens are issued with 1-hour expiry
3. All payment API calls require valid authentication
4. Rate limiting prevents abuse (10 requests/minute)

### Client Access
To create client credentials for payment access:
1. Contact AI.info@axisthorn.com for client credentials
2. Use the demo credentials for testing:
   - Client ID: `demo-client`
   - Client Secret: Use the value from your `.env` file

### Security Considerations
1. Never expose your secret key in client-side code
2. Always validate webhook signatures
3. Use HTTPS for all payment pages
4. Implement proper error handling
5. Log payment events for auditing
6. Client credentials should be stored securely
7. JWT tokens expire after 1 hour
8. API endpoints are protected with authentication middleware

## Testing Checklist
- [ ] Environment variables configured
- [ ] Webhook endpoint accessible
- [ ] Test payment succeeds
- [ ] Payment confirmation received
- [ ] Error handling works properly
- [ ] Mobile responsiveness verified

## Support
For issues or questions:
- Email: AI.info@axisthorn.com
- Stripe Support: https://support.stripe.com