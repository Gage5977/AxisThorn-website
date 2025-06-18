#!/bin/bash

# Cloudflare DNS Setup Script for axisthorn.com
# This script will configure your domain to point to Vercel

echo "=== Cloudflare DNS Setup for axisthorn.com ==="
echo ""

# You'll need to get these from your Cloudflare dashboard:
# 1. Go to https://dash.cloudflare.com/profile/api-tokens
# 2. Create token with Zone:Edit permissions for axisthorn.com
echo "You need to set these environment variables:"
echo "export CF_API_TOKEN='your_api_token_here'"
echo "export CF_ZONE_ID='your_zone_id_here'"
echo ""

if [ -z "$CF_API_TOKEN" ] || [ -z "$CF_ZONE_ID" ]; then
    echo "ERROR: Please set CF_API_TOKEN and CF_ZONE_ID environment variables"
    echo ""
    echo "To get your Zone ID:"
    echo "1. Go to https://dash.cloudflare.com"
    echo "2. Click on axisthorn.com"
    echo "3. Copy the Zone ID from the right sidebar"
    echo ""
    echo "To get your API Token:"
    echo "1. Go to https://dash.cloudflare.com/profile/api-tokens"
    echo "2. Click 'Create Token'"
    echo "3. Use 'Edit zone DNS' template"
    echo "4. Select axisthorn.com as the zone"
    echo ""
    exit 1
fi

echo "Setting up DNS records..."

# Delete existing A records if they exist
echo "Checking for existing A records..."
RECORDS=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records?type=A&name=axisthorn.com" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json")

# Add root domain A record
echo "Adding A record for axisthorn.com..."
curl -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "A",
    "name": "axisthorn.com",
    "content": "76.76.21.21",
    "ttl": 300,
    "proxied": false
  }'

echo ""

# Add www subdomain A record
echo "Adding A record for www.axisthorn.com..."
curl -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "A",
    "name": "www",
    "content": "76.76.21.21",
    "ttl": 300,
    "proxied": false
  }'

echo ""
echo "DNS records have been created!"
echo "It may take 5-15 minutes for DNS to propagate worldwide."
echo ""
echo "You can test with:"
echo "  dig axisthorn.com"
echo "  dig www.axisthorn.com"
echo ""
echo "Your website will be available at:"
echo "  https://axisthorn.com"
echo "  https://www.axisthorn.com"