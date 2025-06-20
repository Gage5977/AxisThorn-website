# Vercel Environment Variables Setup

To properly deploy the Axis Thorn website with all features enabled, add these environment variables in Vercel:

## Required Environment Variables

### Stripe Configuration
- `STRIPE_SECRET_KEY`: Your Stripe secret key (use test key for development)
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Webhook endpoint secret from Stripe Dashboard

### JWT Configuration
- `JWT_SECRET`: A secure random string (minimum 32 characters)
- `JWT_EXPIRY`: Token expiration time (default: "7d")

### Demo Configuration
- `DEMO_SECRET`: Password for demo access (default: "demo2024")

### API Configuration
- `API_BASE_URL`: Base URL for API calls (https://axisthorn.com)
- `NODE_ENV`: Set to "production" for live deployment

## How to Add in Vercel

1. Go to your Vercel dashboard
2. Select the Axis Thorn project
3. Navigate to Settings → Environment Variables
4. Add each variable listed above
5. Redeploy the project for changes to take effect

## Security Notes

- Never commit real API keys to the repository
- Use test keys for development environments
- Rotate JWT_SECRET periodically
- Keep STRIPE_WEBHOOK_SECRET secure