#!/bin/bash

# Sync main files to public directory for Vercel deployment

echo "Syncing files to public directory..."

# Copy HTML files
cp -v index.html public/
cp -v 1099.html public/
cp -v banking.html public/
cp -v consultation.html public/
cp -v implementation.html public/
cp -v support.html public/
cp -v invoices.html public/

# Copy assets
cp -v logo.svg public/
cp -v script.js public/
cp -v styles.css public/

# Copy logo variants if they exist
[ -f logo-modern-v1.svg ] && cp -v logo-modern-v1.svg public/
[ -f logo-modern-v2.svg ] && cp -v logo-modern-v2.svg public/
[ -f logo-modern-v3.svg ] && cp -v logo-modern-v3.svg public/

# Copy favicon files if they exist
[ -f favicon.svg ] && cp -v favicon.svg public/
[ -f site.webmanifest ] && cp -v site.webmanifest public/

echo "Sync complete!"