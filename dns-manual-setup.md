# Manual DNS Setup for axisthorn.com

Since the API token has IP restrictions, here's the manual setup:

## Option 1: Update API Token (Recommended)
1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Find your token and click "Edit"
3. Under "IP Address Filtering":
   - Select "All IPs" (removes restrictions)
   - OR add your current IP: `104.145.90.20`
4. Save changes
5. Run: `cd "/Users/axisthornllc/Documents/Axis-Thorn-LLC-Website" && ./setup-dns.sh`

## Option 2: Manual DNS Configuration
1. Go to: https://dash.cloudflare.com
2. Click on "axisthorn.com"
3. Go to "DNS" → "Records"
4. Add these two A records:

   **Record 1:**
   - Type: A
   - Name: @
   - IPv4 address: 76.76.21.21
   - TTL: Auto
   - Proxy status: DNS only (gray cloud)

   **Record 2:**
   - Type: A
   - Name: www
   - IPv4 address: 76.76.21.21
   - TTL: Auto
   - Proxy status: DNS only (gray cloud)

5. Click "Save" for both records

## After Setup
DNS propagation takes 5-15 minutes. Test with:
```bash
dig axisthorn.com
dig www.axisthorn.com
```

Your website will be available at:
- https://axisthorn.com
- https://www.axisthorn.com

Current working URL: https://axis-thorn-llc-website.vercel.app