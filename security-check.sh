#!/bin/bash

echo "🔒 Axis Thorn Security Check"
echo "============================"
echo ""

# Check for vulnerabilities
echo "📦 Checking npm vulnerabilities..."
npm audit --production

echo ""
echo "🔍 Checking for secrets in code..."
# Basic secret detection
if grep -r "password\|secret\|key" --include="*.js" --exclude-dir=node_modules --exclude-dir=.git . | grep -v "process.env" | grep -i "="; then
  echo "⚠️  WARNING: Potential hardcoded secrets found!"
else
  echo "✅ No hardcoded secrets detected"
fi

echo ""
echo "🔐 Checking environment configuration..."
if [ -f .env ]; then
  echo "✅ .env file exists"
  
  # Check if .env is in .gitignore
  if grep -q "^\.env" .gitignore; then
    echo "✅ .env is in .gitignore"
  else
    echo "❌ CRITICAL: .env is NOT in .gitignore!"
  fi
else
  echo "⚠️  No .env file found"
fi

echo ""
echo "🛡️  Checking security headers..."
# This would need to be run against a running server
echo "   Run 'curl -I http://localhost:3000/api/health' to check headers"

echo ""
echo "📊 Security Summary:"
echo "==================="
echo "- Run 'npm audit fix' to fix vulnerabilities"
echo "- Ensure all secrets are in environment variables"
echo "- Use 'docker-compose up' for production deployment"
echo "- Enable HTTPS in production"
echo "- Monitor logs for suspicious activity"