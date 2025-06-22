# Fix Cloudflare DNS for axisthorn.com

## Current Status
- ✅ Website successfully deployed to Vercel
- ✅ Domain added to Vercel project
- ❌ DNS records need updating in Cloudflare

## Your Vercel Deployment
- Production URL: https://axis-thorn-llc-website.vercel.app
- Status: Live and working

## Required Cloudflare DNS Settings

1. **Log in to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com
   - Select domain: axisthorn.com

2. **Update DNS Records**
   
   ### Root Domain (axisthorn.com)
   - Type: `A`
   - Name: `@` (or leave blank)
   - IPv4 address: `76.76.21.21`
   - Proxy status: **DNS only** (gray cloud icon)
   - TTL: Auto

   ### WWW Subdomain
   - Type: `A`
   - Name: `www`
   - IPv4 address: `76.76.21.21`
   - Proxy status: **DNS only** (gray cloud icon)
   - TTL: Auto

3. **Important: Disable Cloudflare Proxy**
   - Make sure the cloud icon is GRAY (not orange)
   - This allows Vercel to handle SSL certificates

## Verification Steps

After updating DNS (wait 5-10 minutes):

1. Test with: `curl -I https://axisthorn.com`
2. Visit https://axisthorn.com in your browser
3. Check SSL certificate (should show Vercel/Let's Encrypt)

## Alternative Option

If you prefer to keep Cloudflare's proxy enabled:
- You'll need to configure SSL/TLS settings in Cloudflare
- Set SSL/TLS encryption mode to "Full (strict)"
- But Vercel's automatic SSL works better with DNS-only mode

## Need Help?

Your site is live at: https://axis-thorn-llc-website.vercel.app

Once DNS propagates, it will be accessible at https://axisthorn.com