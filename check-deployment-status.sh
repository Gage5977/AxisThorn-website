#!/bin/bash

echo "🔍 Checking Axis Thorn Deployment Status"
echo "========================================"
echo ""

# Check Vercel deployment
echo "📦 Frontend (Vercel):"
echo "--------------------"
VERCEL_URL="https://axis-thorn-llc-website.vercel.app"
if curl -s -o /dev/null -w "%{http_code}" "$VERCEL_URL" | grep -q "200"; then
  echo "✅ Status: LIVE"
  echo "   URL: $VERCEL_URL"
  echo "   API URL configured: https://axis-thorn-api.onrender.com"
else
  echo "⚠️  Status: DEPLOYING"
fi
echo ""

# Check Render API deployment
echo "🚀 API (Render):"
echo "---------------"
API_URL="https://axis-thorn-api.onrender.com"
HEALTH_CHECK=$(curl -s "$API_URL/api/health" 2>/dev/null || echo "{}")

if echo "$HEALTH_CHECK" | grep -q "healthy"; then
  echo "✅ Status: LIVE"
  echo "   URL: $API_URL"
  echo "   Health: $HEALTH_CHECK"
else
  echo "⏳ Status: DEPLOYING (this can take 5-10 minutes)"
  echo "   Monitor at: https://dashboard.render.com"
fi
echo ""

# DNS Status
echo "🌐 DNS Configuration:"
echo "-------------------"
DNS_CHECK=$(dig +short api.axisthorn.com 2>/dev/null || echo "Not configured")
if [ "$DNS_CHECK" != "Not configured" ]; then
  echo "✅ api.axisthorn.com -> $DNS_CHECK"
else
  echo "⚠️  Pending: Add CNAME record"
  echo "   Name: api"
  echo "   Value: axis-thorn-api.onrender.com"
fi
echo ""

# Summary
echo "📊 Deployment Summary:"
echo "--------------------"
echo "Frontend: $VERCEL_URL"
echo "API: $API_URL"
echo ""
echo "🔐 Admin Access:"
echo "Email: admin@axisthorn.com"
echo "Password: qwKG6keEE166rg9thZJL7A=="
echo ""
echo "📝 Next Steps:"
echo "1. Wait for Render deployment to complete (5-10 mins)"
echo "2. Configure DNS for api.axisthorn.com"
echo "3. Run database migrations in Render shell"
echo "4. Test access codes and authentication"