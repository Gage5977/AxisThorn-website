#!/bin/bash

# Script to add environment variables to Vercel
echo "Setting up Vercel environment variables..."

# Add JWT_SECRET
echo "t3k50m2o9ONFqlvSQjNCwY9xrYlxKXwoZOBYuu0R5wc=" | vercel env add JWT_SECRET production preview development

# Add JWT_EXPIRY
echo "30d" | vercel env add JWT_EXPIRY production preview development

# Add NODE_ENV
echo "production" | vercel env add NODE_ENV production

# Add Stripe test keys (replace with your actual test keys)
# echo "sk_test_YOUR_KEY_HERE" | vercel env add STRIPE_SECRET_KEY production preview development
# echo "pk_test_YOUR_KEY_HERE" | vercel env add STRIPE_PUBLISHABLE_KEY production preview development

# Add Demo secret
echo "demo2024" | vercel env add DEMO_SECRET production preview development

# Add API URL
echo "https://axisthorn.com/api" | vercel env add NEXT_PUBLIC_API_URL production preview development

echo "Environment variables added successfully!"
echo "Now redeploying..."

# Redeploy
vercel --prod

echo "Deployment complete!"