#!/bin/bash

# Deployment Status Checker for Axis Thorn LLC Website

echo "🔍 Checking Axis Thorn LLC Website Deployment Status..."
echo "================================================"

# Set your domain here
DOMAIN="https://axisthorn.vercel.app"  # Update with your actual domain

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check URL status
check_url() {
    local url=$1
    local description=$2
    
    echo -n "Checking $description... "
    
    # Get HTTP status code
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status_code" = "200" ]; then
        echo -e "${GREEN}✓ OK${NC} (Status: $status_code)"
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Status: $status_code)"
        return 1
    fi
}

# Function to check API endpoint
check_api() {
    local endpoint=$1
    local description=$2
    
    echo -n "Checking API: $description... "
    
    # Make API request and check if valid JSON
    response=$(curl -s "$DOMAIN$endpoint")
    
    if echo "$response" | jq . >/dev/null 2>&1; then
        echo -e "${GREEN}✓ OK${NC} (Valid JSON response)"
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Invalid response)"
        return 1
    fi
}

echo ""
echo "🌐 Testing Domain: $DOMAIN"
echo ""

# Check main pages
echo "📄 Checking Static Pages:"
check_url "$DOMAIN/" "Homepage"
check_url "$DOMAIN/banking-portal.html" "Banking Portal"
check_url "$DOMAIN/banking.html" "Banking Page"
check_url "$DOMAIN/invoices.html" "Client Portal"
check_url "$DOMAIN/axis-ai.html" "Axis AI"

echo ""
echo "🔌 Checking API Endpoints:"
check_api "/api/payment-methods" "Payment Methods"

echo ""
echo "🔒 Checking Protected Endpoints (should fail without auth):"
# This should return 401
api_response=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/api/stripe-payment" -X POST -H "Content-Type: application/json" -d '{"action":"test"}')
if [ "$api_response" = "401" ]; then
    echo -e "Stripe Payment API... ${GREEN}✓ Properly Protected${NC} (401 Unauthorized)"
else
    echo -e "Stripe Payment API... ${YELLOW}⚠ Unexpected${NC} (Status: $api_response)"
fi

echo ""
echo "📊 Checking Resources:"
check_url "$DOMAIN/logo.svg" "Logo"
check_url "$DOMAIN/css/styles.css" "Main Stylesheet"

echo ""
echo "================================================"
echo "🏁 Deployment Check Complete!"
echo ""
echo "Next steps:"
echo "1. If all checks passed, proceed with testing payment flow"
echo "2. Update Stripe publishable key in banking.html"
echo "3. Test authentication with demo credentials"
echo "4. Monitor Vercel dashboard for any runtime errors"
echo ""

# Additional helpful commands
echo "📝 Useful Commands:"
echo "  - View build logs: vercel logs"
echo "  - Check functions: vercel functions"
echo "  - Open dashboard: vercel"
echo ""