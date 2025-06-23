#!/bin/bash

# Axis Thorn Production Setup Script
# This script guides you through setting up the production environment

echo "🚀 Axis Thorn Production Setup"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: This script must be run from the project root directory${NC}"
    exit 1
fi

# Step 1: Check Node.js version
echo "1️⃣ Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "   Node.js version: $NODE_VERSION"
echo ""

# Step 2: Install dependencies
echo "2️⃣ Installing dependencies..."
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 3: Environment variables check
echo "3️⃣ Checking environment variables..."
if [ -z "$DATABASE_URL" ]; then
    echo -e "${YELLOW}⚠️  DATABASE_URL not set${NC}"
    echo "   To set it, run:"
    echo "   export DATABASE_URL='postgresql://user:pass@host/db'"
    echo ""
else
    echo -e "${GREEN}✓ DATABASE_URL is set${NC}"
fi

if [ -z "$JWT_SECRET" ]; then
    echo -e "${YELLOW}⚠️  JWT_SECRET not set${NC}"
    echo "   To set it, run:"
    echo "   export JWT_SECRET='$(openssl rand -base64 32)'"
    echo ""
else
    echo -e "${GREEN}✓ JWT_SECRET is set${NC}"
fi

# Step 4: Database setup
echo "4️⃣ Setting up database..."
if [ ! -z "$DATABASE_URL" ]; then
    echo "   Generating Prisma client..."
    npx prisma generate
    
    echo "   Running database migrations..."
    npx prisma migrate deploy
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Database setup complete${NC}"
    else
        echo -e "${RED}✗ Database setup failed${NC}"
        echo "   Please check your DATABASE_URL and try again"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Skipping database setup (no DATABASE_URL)${NC}"
fi
echo ""

# Step 5: Create admin user
echo "5️⃣ Admin user setup..."
if [ ! -z "$DATABASE_URL" ]; then
    read -p "Do you want to create an admin user now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        node scripts/create-admin.js
    else
        echo "   Skipping admin user creation"
        echo "   You can run 'node scripts/create-admin.js' later"
    fi
else
    echo -e "${YELLOW}⚠️  Cannot create admin user without database${NC}"
fi
echo ""

# Step 6: Verify setup
echo "6️⃣ Verifying setup..."
node scripts/verify-setup.js
echo ""

# Step 7: Next steps
echo "📋 Next Steps:"
echo "============="
echo ""
echo "1. Add environment variables to Vercel:"
echo "   https://vercel.com/your-team/axis-thorn/settings/environment-variables"
echo ""
echo "2. Add these required variables:"
echo "   - JWT_SECRET (use the one generated above)"
echo "   - DATABASE_URL (your PostgreSQL connection string)"
echo ""
echo "3. Optional but recommended:"
echo "   - SENDGRID_API_KEY (for emails)"
echo "   - STRIPE_SECRET_KEY (for payments)"
echo "   - STRIPE_PUBLISHABLE_KEY"
echo "   - STRIPE_WEBHOOK_SECRET"
echo ""
echo "4. Deploy to production:"
echo "   git push origin main"
echo ""
echo "5. Test your deployment:"
echo "   curl https://axisthorn.com/api/health"
echo ""
echo -e "${GREEN}Setup script complete!${NC}"