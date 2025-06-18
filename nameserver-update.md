# Fix Your Domain - Two Solutions

## Current Issue
Your domain uses Cloudflare nameservers but Vercel needs to manage the DNS.

## Solution 1: Change Nameservers to Vercel (Recommended)
**Where you registered axisthorn.com:**
1. Log into your domain registrar (GoDaddy, Namecheap, etc.)
2. Find DNS/Nameserver settings for axisthorn.com
3. Change nameservers to:
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com
4. Save changes

This will make Vercel handle all DNS automatically.

## Solution 2: Keep Cloudflare, Add A Record
**In Cloudflare dashboard:**
1. Go to https://dash.cloudflare.com
2. Click axisthorn.com → DNS → Records
3. Add A record: @ → 76.76.21.21
4. Add A record: www → 76.76.21.21

## Current Status
✅ Website working: https://axis-thorn-llc-website.vercel.app
✅ Vercel DNS configured
❌ Domain nameservers pointing to Cloudflare instead of Vercel

Choose either solution - both will work!