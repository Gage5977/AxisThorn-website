# Stripe Checkout Integration Guide

## Overview

The Invoice Generator now includes complete Stripe Checkout functionality, providing a seamless payment experience for customers. This implementation mirrors Stripe's Checkout Sessions API while maintaining full compatibility.

## 🛒 Checkout Features

### Core Functionality
- **Secure Checkout Pages** - Professional, mobile-friendly payment forms
- **Multiple Payment Methods** - Support for 21+ payment options
- **Session Management** - Complete lifecycle from creation to completion
- **Real-time Processing** - Instant payment confirmation and status updates
- **Webhook Support** - Automated payment processing and notifications

### Checkout Flow
1. **Create Session** - Generate secure checkout link from invoice
2. **Customer Payment** - Customer completes payment on secure page
3. **Payment Processing** - Real-time payment validation and processing
4. **Confirmation** - Automatic invoice updates and receipt generation

## 🔧 API Endpoints

### Create Checkout Session
```javascript
POST /api/checkout/sessions
{
  "invoice_id": "inv_123",
  "success_url": "https://yoursite.com/success?session_id={CHECKOUT_SESSION_ID}",
  "cancel_url": "https://yoursite.com/cancel",
  "payment_method_types": ["card", "paypal", "apple_pay"],
  "customer_email": "customer@example.com"
}
```

### Create from Invoice
```javascript
POST /api/checkout/sessions/from-invoice/:invoice_id
{
  "success_url": "https://yoursite.com/success?session_id={CHECKOUT_SESSION_ID}",
  "cancel_url": "https://yoursite.com/cancel"
}
```

### Retrieve Session
```javascript
GET /api/checkout/sessions/:id
```

### Process Payment
```javascript
POST /api/checkout/process-payment
{
  "session_id": "cs_123",
  "payment_method": "card",
  "billing_details": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": { ... }
  }
}
```

### List Sessions
```javascript
GET /api/checkout/sessions
```

## 💳 Payment Methods Supported

### Instant Methods
- **Credit/Debit Cards** - Visa, Mastercard, Amex, Discover
- **Digital Wallets** - PayPal, Apple Pay, Google Pay
- **Buy Now Pay Later** - Klarna, Afterpay
- **Regional Methods** - iDEAL, Giropay, Sofort

### Delayed Methods
- **Bank Transfers** - ACH, Wire Transfer, SEPA
- **Traditional** - Check, Cash, Money Order

## 🎯 Implementation Examples

### Frontend Integration
```javascript
// Create checkout session for an invoice
async function createCheckout(invoiceId) {
  const response = await fetch(`/api/checkout/sessions/from-invoice/${invoiceId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success_url: window.location.origin + '/success.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: window.location.origin + '/cancel.html'
    })
  });
  
  const session = await response.json();
  
  // Redirect to checkout
  window.location.href = session.url;
}

// Or open in new window
window.open(session.url, '_blank');
```

### Backend Processing
```javascript
// Handle successful payment webhook
app.post('/webhook', (req, res) => {
  const event = req.body;
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Update invoice status
    if (session.metadata.invoice_id) {
      const invoice = getInvoice(session.metadata.invoice_id);
      invoice.markAsPaid();
      
      // Send receipt email
      sendReceiptEmail(invoice, session);
    }
  }
  
  res.json({ received: true });
});
```

## 📱 Checkout Pages

### Checkout Flow
1. **Loading** - Session validation and payment method loading
2. **Payment Form** - Customer details and payment method selection
3. **Processing** - Secure payment processing with loading states
4. **Confirmation** - Success/failure redirect with receipt options

### Page URLs
- **Checkout**: `/checkout.html?session_id=cs_xxx`
- **Success**: `/success.html?session_id=cs_xxx`
- **Cancel**: `/cancel.html?session_id=cs_xxx`

### Mobile Optimization
- Responsive design for all screen sizes
- Touch-friendly payment method selection
- Optimized input fields for mobile keyboards
- Native mobile wallet integration

## 🔒 Security Features

### Payment Security
- **PCI Compliance Ready** - Secure payment form handling
- **Encrypted Sessions** - All checkout sessions use secure tokens
- **Fraud Protection** - Built-in payment validation
- **Secure Redirects** - Validated success/cancel URLs

### Data Protection
- **No Card Storage** - Card details processed securely
- **Session Expiration** - Automatic 24-hour session timeout
- **HTTPS Required** - Secure communication only
- **Webhook Validation** - Cryptographic signature verification

## 📊 Session Lifecycle

### States
```
draft → open → complete/expired
```

### Status Flow
1. **Created** - Session generated with payment details
2. **Open** - Customer can complete payment
3. **Complete** - Payment successful, invoice updated
4. **Expired** - Session timeout (24 hours)

### Metadata Tracking
```javascript
{
  "id": "cs_xxx",
  "status": "complete",
  "payment_status": "paid",
  "amount_total": 295000, // $2,950.00 in cents
  "customer_details": { ... },
  "metadata": {
    "invoice_id": "inv_xxx",
    "invoice_number": "INV-2025-001"
  }
}
```

## 🎨 Customization

### Branding
- **Logo Integration** - Add your company logo
- **Color Themes** - Match your brand colors
- **Custom Messaging** - Personalized payment instructions
- **Email Templates** - Branded receipt emails

### Payment Options
```javascript
// Configure available payment methods
{
  "payment_method_types": [
    "card",           // Credit/debit cards
    "paypal",         // PayPal
    "apple_pay",      // Apple Pay
    "google_pay",     // Google Pay
    "klarna",         // Buy now, pay later
    "bank_account"    // Direct bank transfer
  ],
  "payment_method_options": {
    "card": {
      "request_three_d_secure": "automatic"
    }
  }
}
```

## 📈 Analytics & Reporting

### Conversion Tracking
- Session creation rates
- Payment completion rates
- Abandonment analysis
- Payment method preferences

### Revenue Insights
- Total processed amounts
- Average transaction value
- Payment method distribution
- Geographic payment patterns

## 🚀 Deployment

### Environment Variables
```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Application URLs
BASE_URL=https://yourdomain.com
SUCCESS_URL=https://yourdomain.com/success
CANCEL_URL=https://yourdomain.com/cancel
```

### Production Setup
1. Configure Stripe live keys
2. Set up webhook endpoints
3. Implement SSL certificates
4. Configure domain validation
5. Test payment flows

## 🔧 Testing

### Test Cards (Sandbox)
```
# Successful payments
4242424242424242  # Visa
4000056655665556  # Visa (debit)
5555555555554444  # Mastercard

# Failed payments
4000000000000002  # Card declined
4000000000009995  # Insufficient funds
```

### Test Scenarios
```bash
# Run checkout tests
node test-checkout.js

# Test payment flows
curl -X POST http://localhost:3000/api/checkout/sessions \
  -H "Content-Type: application/json" \
  -d '{"invoice_id": "inv_test"}'
```

## 📞 Support

### Common Issues
- **Session Expired** - Generate new checkout link
- **Payment Failed** - Check payment method details
- **Webhook Errors** - Verify endpoint configuration
- **SSL Issues** - Ensure HTTPS for production

### Troubleshooting
```javascript
// Check session status
GET /api/checkout/sessions/:id

// Retry failed payment
POST /api/checkout/sessions/:id/retry

// Expire old session
POST /api/checkout/sessions/:id/expire
```

This checkout integration provides a complete, Stripe-compatible payment solution with professional UI, comprehensive payment method support, and enterprise-grade security features.