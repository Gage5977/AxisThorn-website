# 🎯 Axis Thorn Quick Reference

## 🔑 Copy-Paste Environment Variables

### For Vercel Dashboard
```
JWT_SECRET=7h3Ax!s7h0rn$3cur3K3y#2024@Pr0duc7!0n&S3cr37*Val
```

### Test Commands
```bash
# Test if API is working
curl https://axisthorn.com/api/health

# Run setup
./scripts/setup-production.sh

# Verify everything
node scripts/verify-setup.js

# Test all endpoints
node scripts/test-api.js

# Create admin user
DATABASE_URL="your-url" node scripts/create-admin.js
```

## 📍 Important URLs

### Your Project
- **GitHub**: https://github.com/Gage5977/AxisThorn-website
- **Add Secret**: https://github.com/Gage5977/AxisThorn-website/settings/secrets/actions/new
- **Live Site**: https://axisthorn.com

### Vercel
- **Dashboard**: https://vercel.com/dashboard
- **Env Vars**: https://vercel.com/your-team/axis-thorn/settings/environment-variables
- **Create DB**: https://vercel.com/dashboard/stores
- **Get Token**: https://vercel.com/account/tokens

### Services
- **SendGrid**: https://sendgrid.com
- **Stripe**: https://dashboard.stripe.com/apikeys
- **Supabase**: https://supabase.com

## ⚡ Quick Fixes

### API not working?
1. Add `JWT_SECRET` to Vercel
2. Add `DATABASE_URL` to Vercel
3. Redeploy

### Can't login?
1. Run: `DATABASE_URL="..." node scripts/create-admin.js`
2. Use the email/password you created

### Emails not sending?
1. Add `SENDGRID_API_KEY` to Vercel
2. Verify your domain in SendGrid

### Payments not working?
1. Add `STRIPE_SECRET_KEY` to Vercel
2. Add `STRIPE_PUBLISHABLE_KEY` to Vercel
3. Configure webhook in Stripe dashboard

## 🚀 Deploy Command
```bash
git add .
git commit -m "Deploy with environment variables"
git push origin main
```

---
**Support**: AI.info@axisthorn.com