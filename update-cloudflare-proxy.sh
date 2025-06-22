#!/bin/bash

# Update Cloudflare DNS to disable proxy (orange cloud to gray cloud)
ZONE_ID="95630f075913ce585a9271ef6146b2f6"
API_TOKEN="wqgieCwlzNaL-6cXrLFvQZHZmynWwnsG8bBRNppp"

echo "🔍 Fetching existing DNS records..."

# Get all DNS records
records=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json")

# Check if successful
if ! echo "$records" | grep -q '"success":true'; then
    echo "❌ Failed to fetch DNS records"
    echo "$records"
    exit 1
fi

echo "✅ DNS records fetched successfully"

# Extract root domain A record ID
root_record_id=$(echo "$records" | grep -B10 '"name":"axisthorn.com"' | grep -A10 '"type":"A"' | grep '"id":' | head -1 | cut -d'"' -f4)

# Extract www subdomain A record ID
www_record_id=$(echo "$records" | grep -B10 '"name":"www.axisthorn.com"' | grep -A10 '"type":"A"' | grep '"id":' | head -1 | cut -d'"' -f4)

echo "📝 Record IDs found:"
echo "   Root domain ID: $root_record_id"
echo "   WWW domain ID: $www_record_id"

# Update root domain record to disable proxy
if [ ! -z "$root_record_id" ]; then
    echo "🔄 Updating root domain record to disable proxy..."
    
    root_update=$(curl -s -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$root_record_id" \
        -H "Authorization: Bearer $API_TOKEN" \
        -H "Content-Type: application/json" \
        --data '{
            "type": "A",
            "name": "axisthorn.com",
            "content": "76.76.21.21",
            "ttl": 300,
            "proxied": false
        }')
    
    if echo "$root_update" | grep -q '"success":true'; then
        echo "✅ Root domain proxy disabled (gray cloud)!"
    else
        echo "❌ Failed to update root domain:"
        echo "$root_update"
    fi
else
    echo "⚠️  Root domain record not found"
fi

# Update www subdomain record to disable proxy
if [ ! -z "$www_record_id" ]; then
    echo "🔄 Updating www subdomain record to disable proxy..."
    
    www_update=$(curl -s -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$www_record_id" \
        -H "Authorization: Bearer $API_TOKEN" \
        -H "Content-Type: application/json" \
        --data '{
            "type": "A",
            "name": "www",
            "content": "76.76.21.21",
            "ttl": 300,
            "proxied": false
        }')
    
    if echo "$www_update" | grep -q '"success":true'; then
        echo "✅ WWW subdomain proxy disabled (gray cloud)!"
    else
        echo "❌ Failed to update www subdomain:"
        echo "$www_update"
    fi
else
    echo "⚠️  WWW subdomain record not found"
fi

echo ""
echo "🎉 DNS update complete!"
echo "⏳ Wait 5-10 minutes for DNS propagation"
echo "🌐 Then test your site at https://axisthorn.com"