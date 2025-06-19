#!/bin/bash

# Sync main files to public directory for Vercel deployment

echo "Syncing files to public directory..."

# Copy HTML files from src
cp -v src/index.html public/
cp -v src/1099.html public/
cp -v src/banking.html public/
cp -v src/consultation.html public/
cp -v src/implementation.html public/
cp -v src/support.html public/
cp -v src/invoices.html public/
cp -v src/axis-ai.html public/

# Copy JavaScript files
cp -rv src/js/* public/js/

# Copy CSS files
cp -v src/css/styles.css public/
cp -v src/css/invoices.css public/
cp -v src/css/axis-ai.css public/
cp -v src/css/icons.css public/

# Copy assets
cp -v src/logo.svg public/
cp -v src/site.webmanifest public/

# Copy logo variants if they exist
[ -f logo-modern-v1.svg ] && cp -v logo-modern-v1.svg public/
[ -f logo-modern-v2.svg ] && cp -v logo-modern-v2.svg public/
[ -f logo-modern-v3.svg ] && cp -v logo-modern-v3.svg public/

# Copy favicon files if they exist
[ -f favicon.svg ] && cp -v favicon.svg public/
[ -f site.webmanifest ] && cp -v site.webmanifest public/

echo "Sync complete!"