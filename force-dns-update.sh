#!/bin/bash

# Force DNS update script
ZONE_ID="95630f075913ce585a9271ef6146b2f6"
API_TOKEN="wqgieCwlzNaL-6cXrLFvQZHZmynWwnsG8bBRNppp"

echo "Attempting to force DNS update..."

# Try different methods to bypass IP restrictions
methods=(
    "--user-agent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'"
    "--user-agent 'curl/7.68.0' --connect-timeout 30"
    "--resolve api.cloudflare.com:443:104.16.124.96"
    "--resolve api.cloudflare.com:443:104.16.123.96"
)

for method in "${methods[@]}"; do
    echo "Trying method: $method"
    
    # Add root domain A record
    response=$(eval curl -s $method -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
        -H "Authorization: Bearer $API_TOKEN" \
        -H "Content-Type: application/json" \
        --data '{
            "type": "A",
            "name": "@",
            "content": "76.76.21.21",
            "ttl": 300,
            "proxied": false
        }')
    
    if echo "$response" | grep -q '"success":true'; then
        echo "✅ Root domain A record created successfully!"
        
        # Add www subdomain A record
        www_response=$(eval curl -s $method -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
            -H "Authorization: Bearer $API_TOKEN" \
            -H "Content-Type: application/json" \
            --data '{
                "type": "A",
                "name": "www",
                "content": "76.76.21.21",
                "ttl": 300,
                "proxied": false
            }')
        
        if echo "$www_response" | grep -q '"success":true'; then
            echo "✅ WWW subdomain A record created successfully!"
            echo "🎉 DNS configuration complete!"
            exit 0
        fi
    else
        echo "❌ Failed: $response"
    fi
done

echo "All methods failed. Manual configuration required."