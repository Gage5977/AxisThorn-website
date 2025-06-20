# Update Stripe Publishable Key

## Current Status
The Stripe publishable key in the banking.html file is currently set to a placeholder: `pk_test_51234567890`

## How to Update

### Option 1: Direct Edit (Recommended for Production)
1. Get your real Stripe publishable key from the Stripe Dashboard
2. Edit the file at line 84 in `dist/banking.html`
3. Replace `pk_test_51234567890` with your actual key

### Option 2: Environment Variable (Better for Security)
Instead of hardcoding the key, you can modify the code to fetch it from an API endpoint:

1. Create a new API endpoint `/api/config/stripe-key.js`:
```javascript
export default function handler(req, res) {
  res.status(200).json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  });
}
```

2. Update the banking.html to fetch the key dynamically:
```javascript
// Replace line 84 with:
let STRIPE_PUBLISHABLE_KEY = null;

// Add before openPaymentModal function:
async function loadStripeKey() {
  try {
    const response = await fetch('/api/config/stripe-key');
    const data = await response.json();
    STRIPE_PUBLISHABLE_KEY = data.publishableKey;
  } catch (error) {
    console.error('Failed to load Stripe key:', error);
  }
}

// Call on page load:
document.addEventListener('DOMContentLoaded', loadStripeKey);
```

## Test Cards for Stripe

Use these test card numbers:
- **Success**: 4242 4242 4242 4242
- **Requires Authentication**: 4000 0025 0000 3155
- **Declined**: 4000 0000 0000 9995

All test cards use:
- Any future expiry date
- Any 3-digit CVC
- Any 5-digit ZIP code

## Important Notes
- Never commit your live Stripe keys to Git
- Always use test keys for development
- Switch to live keys only in production via environment variables