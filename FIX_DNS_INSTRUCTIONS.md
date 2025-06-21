# Manual DNS Fix Instructions

Since I cannot directly access Cloudflare, here are the exact steps to fix the DNS/SSL issue:

## Option 1: Quick Fix in Cloudflare (5 minutes)

1. **Login to Cloudflare**: https://dash.cloudflare.com
2. **Select axisthorn.com**
3. **Go to DNS → Records**
4. **Look for existing A records** for axisthorn.com
5. **Click the orange cloud icon** next to each record to make it grey (this disables proxy)
6. **Ensure these records exist**:
   - Type: A, Name: @, Content: 76.76.21.21, Proxy: OFF (grey cloud)
   - Type: A, Name: www, Content: 76.76.21.21, Proxy: OFF (grey cloud)

## Option 2: Switch to Vercel DNS (Best long-term)

1. **Login to your domain registrar** (where you bought axisthorn.com)
2. **Find nameserver settings**
3. **Change nameservers to**:
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com
4. **Save changes**
5. **Wait 24-48 hours for propagation**

## What I've Already Done

✅ Created new SSL certificate in Vercel
✅ Set up proper alias (axisthorn.com → axis-thorn-website deployment)
✅ Configured DNS records in Vercel (pending nameserver change)

## Testing

After making changes, test with:
```bash
curl -I https://axisthorn.com/
```

You should see `HTTP/2 200` status.

## Current Status

- Deployment: https://axis-thorn-website-4mwsgg7oo-axis-thorns-projects.vercel.app/ ✅ Working
- Domain: axisthorn.com ❌ SSL blocked by Cloudflare proxy
- Fix: Disable Cloudflare proxy (orange → grey cloud)