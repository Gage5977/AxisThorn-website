# Axis Thorn Website Deployment Guide

## Overview
This is a static website with Vercel serverless functions for API endpoints. The site is deployed on Vercel and uses Stripe for payment processing.

## Project Structure
```
axis-thorn-llc-website/
├── api/                    # Vercel serverless functions
│   ├── create-payment-intent.js
│   ├── stripe-webhook.js
│   ├── payment-links.js
│   ├── payment-history.js
│   └── invoices/
│       ├── index.js
│       └── pdf.js
├── public/                 # Static website files
│   ├── index.html         # Homepage
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   └── images/            # Image assets
├── finance-management/     # Financial tools subdirectory
├── vercel.json            # Vercel configuration
├── package.json           # Node.js dependencies
└── .env.example           # Environment variables template
```

## Environment Variables
Copy `.env.example` to `.env` and configure:
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYMENT_API_KEY=your_secure_api_key
NODE_ENV=production
```

## Local Development
```bash
# Install dependencies
npm install

# Run locally with Vercel CLI
npm run dev

# Or run static server only
npm run serve
```

## Deployment

### Automatic Deployment
Push to the main branch triggers automatic deployment on Vercel.

### Manual Deployment
```bash
# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

## API Security
- All payment APIs require Bearer token authentication
- CORS is restricted to production domains
- Stripe webhooks are verified with signatures

## Adding New Pages
1. Create HTML file in `public/`
2. Add corresponding CSS in `public/css/`
3. Add JavaScript in `public/js/`
4. Update navigation in existing pages

## Adding New API Endpoints
1. Create new file in `api/` directory
2. Export default async function handler
3. Follow existing patterns for CORS and authentication

## Monitoring
- Check Vercel dashboard for deployment status
- Monitor API logs in Vercel Functions tab
- Review Stripe dashboard for payment events

## Troubleshooting
- Clear browser cache if changes don't appear
- Check Vercel function logs for API errors
- Verify environment variables are set correctly
- Ensure all file paths are relative in HTML