#!/usr/bin/env python3
import requests
import json
import time

# Cloudflare credentials
ZONE_ID = "95630f075913ce585a9271ef6146b2f6"
API_TOKEN = "wqgieCwlzNaL-6cXrLFvQZHZmynWwnsG8bBRNppp"
DOMAIN = "axisthorn.com"
VERCEL_IP = "76.76.21.21"

headers = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

print("🔧 Attempting to fix Cloudflare DNS for axisthorn.com...")
print("=" * 50)

# Try different API endpoints
base_urls = [
    "https://api.cloudflare.com/client/v4",
    "https://104.16.124.96/client/v4",  # Direct IP
    "https://104.16.123.96/client/v4"   # Alternate IP
]

for base_url in base_urls:
    print(f"\n🔍 Trying API endpoint: {base_url}")
    
    try:
        # Custom headers for direct IP access
        custom_headers = headers.copy()
        if "104.16" in base_url:
            custom_headers["Host"] = "api.cloudflare.com"
        
        # Get DNS records
        response = requests.get(
            f"{base_url}/zones/{ZONE_ID}/dns_records",
            headers=custom_headers,
            timeout=10,
            verify=False if "104.16" in base_url else True
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                print("✅ Successfully connected to Cloudflare API!")
                
                records = data.get("result", [])
                updates_needed = []
                
                # Find records that need updating
                for record in records:
                    if record["type"] == "A" and record["content"] == VERCEL_IP:
                        if record["name"] == DOMAIN or record["name"] == f"www.{DOMAIN}":
                            if record["proxied"]:
                                updates_needed.append(record)
                                print(f"📌 Found proxied record: {record['name']} (ID: {record['id']})")
                
                if not updates_needed:
                    print("✅ No updates needed - proxy might already be disabled!")
                else:
                    # Update each record
                    for record in updates_needed:
                        print(f"\n🔄 Updating {record['name']} to disable proxy...")
                        
                        update_data = {
                            "type": "A",
                            "name": record["name"],
                            "content": VERCEL_IP,
                            "ttl": 1,
                            "proxied": False
                        }
                        
                        update_response = requests.patch(
                            f"{base_url}/zones/{ZONE_ID}/dns_records/{record['id']}",
                            headers=custom_headers,
                            json=update_data,
                            timeout=10,
                            verify=False if "104.16" in base_url else True
                        )
                        
                        if update_response.status_code == 200:
                            result = update_response.json()
                            if result.get("success"):
                                print(f"✅ Successfully disabled proxy for {record['name']}!")
                            else:
                                print(f"❌ Failed to update: {result.get('errors', 'Unknown error')}")
                        else:
                            print(f"❌ HTTP {update_response.status_code}: {update_response.text}")
                
                print("\n🎉 DNS update process complete!")
                print("⏳ Wait 5-10 minutes for DNS propagation")
                print("🌐 Then test your site at https://axisthorn.com")
                break
                
        elif response.status_code == 403:
            print(f"❌ Access denied - IP restriction in effect")
        else:
            print(f"❌ HTTP {response.status_code}: {response.text[:100]}...")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

print("\n" + "=" * 50)
print("\n📋 If all methods failed, manual action required:")
print("1. Go to https://dash.cloudflare.com")
print("2. Click 'axisthorn.com' → 'DNS' → 'Records'")
print("3. Click orange cloud icons to turn them gray")
print("4. Save changes")