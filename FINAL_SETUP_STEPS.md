# Final Setup Steps - Follow in Order

## Step 1: Add Environment Variables (5 minutes)

1. **Open Vercel Dashboard**
   - Go to: https://vercel.com/axis-thorns-projects/axis-thorn-llc-website/settings/environment-variables

2. **Add these variables** (click "Add New" for each):
   
   | Key | Value | Environment |
   |-----|-------|-------------|
   | JWT_SECRET | t3k50m2o9ONFqlvSQjNCwY9xrYlxKXwoZOBYuu0R5wc= | All |
   | JWT_EXPIRY | 30d | All |
   | NODE_ENV | production | Production |
   | STRIPE_SECRET_KEY | (use test key from Stripe dashboard) | All |
   | STRIPE_PUBLISHABLE_KEY | (use test key from Stripe dashboard) | All |

3. **Redeploy** (IMPORTANT!)
   - Go to: https://vercel.com/axis-thorns-projects/axis-thorn-llc-website
   - Click "Deployments" tab
   - On the latest deployment, click "..." → "Redeploy"
   - Wait 2-3 minutes for deployment to complete

## Step 2: Enable Analytics (30 seconds)

1. While deployment is running, go to: https://vercel.com/axis-thorns-projects/axis-thorn-llc-website/analytics
2. Click "Enable Analytics"
3. Select "Free" plan
4. Done!

## Step 3: Test Everything (2 minutes)

After deployment completes, run these commands:

```bash
# Test API endpoints
npm run test:api

# Test full website
npm test

# Check specific endpoints
curl https://axisthorn.com/api/ping
curl https://axisthorn.com/api/env-check
```

## Expected Results After Setup:

✅ API tests should pass (except maybe database connection)
✅ Environment check should show:
```json
{
  "configured": true,
  "environment": {
    "stripe": {
      "secretKey": true,
      "publishableKey": true
    },
    "jwt": {
      "secret": true
    }
  }
}
```

## Quick Monitoring Setup (Optional - 2 min)

1. **UptimeRobot** (Free monitoring)
   - Go to: https://uptimerobot.com
   - Sign up
   - Add monitor for: https://axisthorn.com
   - Add monitor for: https://axisthorn.com/api/health

## Troubleshooting

If API still returns 404:
1. Check Vercel logs: https://vercel.com/axis-thorns-projects/axis-thorn-llc-website/functions
2. Make sure you redeployed after adding env vars
3. Try manual deploy: `vercel --prod`

---

## You're Done! 🎉

Once tests pass, your website is fully operational with:
- Payment processing ready
- API endpoints working
- Monitoring active
- CI/CD running

Next: Create Stripe products in your Stripe dashboard to start accepting payments!