#!/bin/bash

# Cloudflare DNS Fix Script
ZONE_ID="95630f075913ce585a9271ef6146b2f6"
API_TOKEN="wqgieCwlzNaL-6cXrLFvQZHZmynWwnsG8bBRNppp"
DOMAIN="axisthorn.com"
VERCEL_IP="76.76.21.21"

echo "🔧 Attempting to fix axisthorn.com DNS configuration..."
echo "📍 Your current IP: 75.70.239.150"
echo ""

# Method 1: Try to list DNS records first to check if API works
echo "Method 1: Testing API access..."
records=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json")

if echo "$records" | grep -q '"success":true'; then
    echo "✅ API access successful!"
    
    # Parse existing records
    echo "🔍 Analyzing existing DNS records..."
    
    # Find root domain A record
    root_record=$(echo "$records" | python3 -c "
import json, sys
data = json.load(sys.stdin)
for record in data.get('result', []):
    if record['type'] == 'A' and record['name'] == '$DOMAIN':
        print(json.dumps(record))
        break
")
    
    # Find www subdomain A record  
    www_record=$(echo "$records" | python3 -c "
import json, sys
data = json.load(sys.stdin)
for record in data.get('result', []):
    if record['type'] == 'A' and record['name'] == 'www.$DOMAIN':
        print(json.dumps(record))
        break
")
    
    # Update root domain if exists
    if [ ! -z "$root_record" ] && [ "$root_record" != "null" ]; then
        root_id=$(echo "$root_record" | python3 -c "import json, sys; print(json.load(sys.stdin)['id'])")
        root_proxied=$(echo "$root_record" | python3 -c "import json, sys; print(json.load(sys.stdin)['proxied'])")
        
        echo "📝 Root domain record found (ID: $root_id, Proxied: $root_proxied)"
        
        if [ "$root_proxied" = "True" ]; then
            echo "🔄 Disabling proxy for root domain..."
            update=$(curl -s -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$root_id" \
                -H "Authorization: Bearer $API_TOKEN" \
                -H "Content-Type: application/json" \
                --data "{
                    \"type\": \"A\",
                    \"name\": \"$DOMAIN\",
                    \"content\": \"$VERCEL_IP\",
                    \"ttl\": 1,
                    \"proxied\": false
                }")
            
            if echo "$update" | grep -q '"success":true'; then
                echo "✅ Root domain proxy disabled!"
            else
                echo "❌ Failed to update root domain"
            fi
        else
            echo "✅ Root domain already has proxy disabled"
        fi
    fi
    
    # Update www subdomain if exists
    if [ ! -z "$www_record" ] && [ "$www_record" != "null" ]; then
        www_id=$(echo "$www_record" | python3 -c "import json, sys; print(json.load(sys.stdin)['id'])")
        www_proxied=$(echo "$www_record" | python3 -c "import json, sys; print(json.load(sys.stdin)['proxied'])")
        
        echo "📝 WWW subdomain record found (ID: $www_id, Proxied: $www_proxied)"
        
        if [ "$www_proxied" = "True" ]; then
            echo "🔄 Disabling proxy for www subdomain..."
            update=$(curl -s -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$www_id" \
                -H "Authorization: Bearer $API_TOKEN" \
                -H "Content-Type: application/json" \
                --data "{
                    \"type\": \"A\",
                    \"name\": \"www\",
                    \"content\": \"$VERCEL_IP\",
                    \"ttl\": 1,
                    \"proxied\": false
                }")
            
            if echo "$update" | grep -q '"success":true'; then
                echo "✅ WWW subdomain proxy disabled!"
            else
                echo "❌ Failed to update www subdomain"
            fi
        else
            echo "✅ WWW subdomain already has proxy disabled"
        fi
    fi
    
    echo ""
    echo "🎉 DNS configuration complete!"
    echo "⏳ Wait 5-10 minutes for DNS propagation"
    echo "🌐 Then test your site at https://axisthorn.com"
    
else
    echo "❌ API authentication failed"
    echo ""
    echo "📋 MANUAL STEPS REQUIRED:"
    echo ""
    echo "1. Go to: https://dash.cloudflare.com/profile/api-tokens"
    echo "2. Find the token and click 'Edit'"
    echo "3. Under 'IP Address Filtering', add: 75.70.239.150"
    echo "4. Save changes and run this script again"
    echo ""
    echo "OR follow manual DNS setup:"
    echo ""
    echo "1. Go to: https://dash.cloudflare.com"
    echo "2. Click on 'axisthorn.com' → 'DNS' → 'Records'"
    echo "3. Find the A record for @ (root domain)"
    echo "4. Click on the orange cloud icon to turn it gray"
    echo "5. Do the same for the www A record"
    echo "6. Save changes"
fi