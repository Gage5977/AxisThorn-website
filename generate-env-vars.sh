#!/bin/bash

# Environment Variable Generator for Axis Thorn LLC
# This script generates secure values for your environment variables

echo "🔐 Generating Secure Environment Variables"
echo "========================================"
echo ""
echo "Copy these values to your Vercel dashboard:"
echo ""

# Generate JWT Secret (32 bytes, base64 encoded)
JWT_SECRET=$(openssl rand -base64 32)
echo "JWT_SECRET=$JWT_SECRET"
echo ""

# Generate Payment API Key (32 bytes, hex encoded)
PAYMENT_API_KEY=$(openssl rand -hex 32)
echo "PAYMENT_API_KEY=$PAYMENT_API_KEY"
echo ""

# Generate Demo Client Secret (16 bytes, hex encoded)
DEMO_CLIENT_SECRET=$(openssl rand -hex 16)
echo "DEMO_CLIENT_SECRET=$DEMO_CLIENT_SECRET"
echo ""

echo "========================================"
echo ""
echo "⚠️  IMPORTANT:"
echo "1. Save these values securely"
echo "2. Add them to Vercel Environment Variables"
echo "3. Never commit these to Git"
echo "4. Use different values for production"
echo ""
echo "📝 You still need to add:"
echo "- STRIPE_SECRET_KEY (from Stripe Dashboard)"
echo "- STRIPE_PUBLISHABLE_KEY (from Stripe Dashboard)"
echo "- STRIPE_WEBHOOK_SECRET (from Stripe Webhooks)"
echo ""