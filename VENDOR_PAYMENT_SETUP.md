# Vendor Payment Portal Setup Guide

## Overview
The vendor payment portal has been created to allow vendors to pay invoices online using Stripe. The portal supports both credit/debit card payments and ACH bank transfers (ACH to be implemented).

## New Files Created

1. **`/public/vendor-payment-portal.html`**
   - Main vendor payment portal page
   - Features:
     - Payment method selection (Card/ACH)
     - Invoice details form
     - Stripe card element integration
     - Real-time payment validation
     - Payment success/failure status display

2. **`/public/js/vendor-payment.js`**
   - JavaScript handler for payment processing
   - Features:
     - Authentication management
     - Stripe payment intent creation
     - Payment confirmation
     - Error handling
     - Session storage for auth tokens

## Setup Instructions

### 1. Update Stripe Publishable Key
You need to update the Stripe publishable key in two places:

**In vendor-payment-portal.html (line ~232):**
```javascript
const stripe = Stripe('pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE');
```

**In vendor-payment.js (bottom of file):**
```javascript
window.vendorPaymentPortal = new VendorPaymentPortal('pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE');
```

Replace `pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE` with your actual Stripe publishable key from your Stripe dashboard.

### 2. Update Script Reference
In vendor-payment-portal.html, update the script tag to use the external JS file instead of inline script:

Replace the entire `<script>` section (starting around line 230) with:
```html
<script src="js/vendor-payment.js"></script>
```

### 3. Environment Variables Required
Make sure these are set in your deployment environment (Vercel):
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `JWT_SECRET` - For authentication tokens
- `PAYMENT_API_KEY` - For API authentication

### 4. Authentication System
The portal uses client credentials for authentication:
- Vendors need a Client ID and Client Secret to access payments
- Credentials can be created by contacting AI.info@axisthorn.com
- For testing, use the demo credentials from your environment

## Testing the Portal

1. **Access the portal:**
   - Go to: https://axis-thorn-llc-website.vercel.app/vendor-payment-portal.html
   - Or from the banking portal, click "Vendor Payments"

2. **Test with Stripe test cards:**
   - Card number: 4242 4242 4242 4242
   - Any future expiry date
   - Any 3-digit CVC
   - Any 5-digit ZIP

3. **Test authentication:**
   - Use demo credentials or create test credentials
   - Auth tokens expire after 1 hour

## Features Implemented

### ✅ Completed
- Credit/debit card payments via Stripe
- Invoice-based payment tracking
- Real-time form validation
- Payment authentication system
- Success/failure status display
- Responsive design matching site theme
- Security with encrypted payments

### 🔄 To Be Implemented
- ACH bank transfer payments
- Email confirmation system
- PDF receipt generation
- Payment history dashboard
- Recurring payment options
- Multiple invoice payments

## API Endpoints Used

1. **`/api/stripe-payment`**
   - Creates payment intents
   - Confirms payments
   - Checks payment status

2. **`/api/auth/payment-access`**
   - Handles vendor authentication
   - Issues JWT tokens

## Security Considerations

1. **PCI Compliance:**
   - Card details are handled by Stripe Elements
   - No card data touches your servers

2. **Authentication:**
   - JWT tokens with 1-hour expiry
   - Client credentials required
   - Session-based auth storage

3. **HTTPS Only:**
   - All payment pages must use HTTPS
   - Stripe will not work on HTTP

## Customization Options

1. **Styling:**
   - Update colors in the Stripe Elements style object
   - Modify CSS classes for different themes

2. **Fields:**
   - Add custom fields to the payment form
   - Modify metadata sent to Stripe

3. **Validation:**
   - Add custom validation rules
   - Implement field dependencies

## Support

For issues or questions:
- Technical support: AI.info@axisthorn.com
- Stripe documentation: https://stripe.com/docs
- View logs in Stripe Dashboard for debugging