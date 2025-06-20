#!/bin/bash

# Production Deployment Script for Axis Thorn LLC
# This script safely deploys to production with validation

set -e  # Exit on error

echo "🚀 Axis Thorn LLC Production Deployment"
echo "======================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${RED}ERROR: You must be on the main branch to deploy to production${NC}"
    echo "Current branch: $CURRENT_BRANCH"
    exit 1
fi

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo -e "${RED}ERROR: You have uncommitted changes${NC}"
    echo "Please commit or stash your changes before deploying"
    git status -s
    exit 1
fi

# Pull latest changes
echo -e "${BLUE}Pulling latest changes from origin...${NC}"
git pull origin main

# Run build
echo -e "${BLUE}Building production assets...${NC}"
NODE_ENV=production npm run build:vercel

# Run basic tests
echo -e "${BLUE}Running validation checks...${NC}"

# Check if critical files exist
CRITICAL_FILES=(
    "public/index.html"
    "public/banking.html"
    "public/banking-portal.html"
    "public/js/config.js"
    "api/stripe-payment/index.js"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}ERROR: Critical file missing: $file${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✓ All critical files present${NC}"

# Production environment checklist
echo ""
echo -e "${YELLOW}⚠️  PRODUCTION CHECKLIST${NC}"
echo "========================="
echo ""
echo "Before deploying, confirm you have set these in Vercel:"
echo ""
echo "1. Environment Variables (Production):"
echo "   - [ ] STRIPE_SECRET_KEY (live key)"
echo "   - [ ] STRIPE_PUBLISHABLE_KEY (live key)"
echo "   - [ ] STRIPE_WEBHOOK_SECRET (live webhook)"
echo "   - [ ] JWT_SECRET (secure random)"
echo "   - [ ] PAYMENT_API_KEY (secure random)"
echo "   - [ ] NODE_ENV=production"
echo "   - [ ] PRODUCTION_CLIENTS (JSON config)"
echo ""
echo "2. Domain Configuration:"
echo "   - [ ] Custom domain configured (axisthorn.com)"
echo "   - [ ] SSL certificate active"
echo "   - [ ] www redirect configured"
echo ""
echo "3. Stripe Configuration:"
echo "   - [ ] Live mode activated"
echo "   - [ ] Webhook endpoint configured"
echo "   - [ ] Payment methods enabled"
echo ""

read -p "Have you completed all items above? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Deployment cancelled${NC}"
    exit 1
fi

# Deploy with production configuration
echo ""
echo -e "${BLUE}Deploying to production...${NC}"

# Use production configuration
cp vercel.production.json vercel.json

# Deploy to production
vercel --prod --yes

# Restore original vercel.json
git checkout vercel.json

echo ""
echo -e "${GREEN}✅ PRODUCTION DEPLOYMENT COMPLETE${NC}"
echo "===================================="
echo ""
echo "Post-deployment steps:"
echo "1. Test live site immediately"
echo "2. Verify payment processing works"
echo "3. Check all API endpoints"
echo "4. Monitor error logs"
echo "5. Test on multiple devices"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT:${NC}"
echo "If any issues occur, rollback using:"
echo "  vercel rollback"
echo ""