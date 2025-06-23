# 🚀 Final Deployment Guide - Axis Thorn LLC

## Quick Start (15 minutes to full production)

### Step 1: Add GitHub Secret (2 minutes)
1. Go to: https://github.com/Gage5977/AxisThorn-website/settings/secrets/actions/new
2. Name: `VERCEL_TOKEN`
3. Value: Get from https://vercel.com/account/tokens
4. Click "Add secret"

### Step 2: Create Database (5 minutes)

#### Option A: Vercel Postgres (Recommended)
1. Go to: https://vercel.com/dashboard/stores
2. Click "Create Database"
3. Select "Postgres"
4. Name: `axisthorn-production`
5. Click "Create"
6. It automatically adds `DATABASE_URL` to your project ✨

#### Option B: Supabase (Free)
1. Go to: https://supabase.com
2. Create account/project
3. Go to Settings → Database
4. Copy connection string
5. Add to Vercel as `DATABASE_URL`

### Step 3: Add Environment Variables (3 minutes)
Go to: https://vercel.com/your-team/axis-thorn/settings/environment-variables

**Required (copy these exactly):**
```
JWT_SECRET=7h3Ax!s7h0rn$3cur3K3y#2024@Pr0duc7!0n&S3cr37*Val
DATABASE_URL=(automatically added by Vercel Postgres)
```

**Optional (add later for full features):**
```
# Email
SENDGRID_API_KEY=SG.xxx
EMAIL_FROM=noreply@axisthorn.com
EMAIL_REPLY_TO=AI.info@axisthorn.com

# Payments
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Step 4: Run Setup Script (5 minutes)
```bash
# Clone and enter directory
git clone https://github.com/Gage5977/AxisThorn-website.git
cd AxisThorn-website

# Run automated setup
chmod +x scripts/setup-production.sh
./scripts/setup-production.sh
```

The script will:
- Install dependencies
- Run database migrations
- Create admin user
- Verify everything is working

### Step 5: Deploy (1 minute)
```bash
git push origin main
```

Vercel will automatically deploy with your new environment variables!

## 🧪 Verify Deployment

### Quick Test
```bash
# Test API is working
curl https://axisthorn.com/api/health

# Should return:
{"status":"healthy","timestamp":"2024-..."}
```

### Full Test Suite
```bash
# Run comprehensive API tests
node scripts/test-api.js
```

### Manual Testing
1. Visit: https://axisthorn.com
2. Check console for errors (F12)
3. Test contact form
4. Try logging in with admin credentials

## 📱 What's Working Now

### ✅ Immediately Available
- Static website with all pages
- Health/status monitoring
- Contact form (saves to database)
- User registration & login
- Password reset flow
- Document management API
- Invoice management API
- Service worker for offline

### ⏳ Requires Additional Setup
- **Email notifications** → Add SendGrid API key
- **Payment processing** → Add Stripe keys
- **File uploads** → Configure S3 bucket
- **Admin dashboard** → Uncomment in .vercelignore

## 🔧 Common Issues & Solutions

### API Returns 404
**Cause:** Environment variables not set
**Fix:** Add JWT_SECRET and DATABASE_URL in Vercel

### Database Connection Failed
**Cause:** Wrong connection string format
**Fix:** Use format: `postgresql://user:pass@host:5432/dbname?sslmode=require`

### Cannot Create Admin User
**Cause:** Database not migrated
**Fix:** Run: `DATABASE_URL="..." npx prisma migrate deploy`

### Deployment Failed
**Cause:** Build error
**Fix:** Check Vercel logs: https://vercel.com/your-team/axis-thorn/deployments

## 📞 Support Checklist

If something isn't working:

1. **Check environment variables**
   ```bash
   node scripts/verify-setup.js
   ```

2. **Test API endpoints**
   ```bash
   node scripts/test-api.js
   ```

3. **Check Vercel logs**
   - Go to: https://vercel.com/your-team/axis-thorn/functions
   - Look for error messages

4. **Database issues**
   ```bash
   DATABASE_URL="..." npx prisma studio
   ```

## 🎯 Next Steps After Deployment

### Week 1: Core Features
- [ ] Set up SendGrid for emails
- [ ] Configure Stripe for payments
- [ ] Create content for all pages
- [ ] Test user registration flow

### Week 2: Enhancement
- [ ] Enable admin dashboard
- [ ] Set up monitoring (Sentry)
- [ ] Configure automated backups
- [ ] Add Google Analytics

### Week 3: Optimization
- [ ] Optimize images with CDN
- [ ] Set up A/B testing
- [ ] Configure email templates
- [ ] Launch marketing campaign

## 🎉 Congratulations!

Your site is now live and production-ready! The APIs will start working as soon as you add the environment variables.

**Quick Links:**
- Live Site: https://axisthorn.com
- API Health: https://axisthorn.com/api/health
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Repo: https://github.com/Gage5977/AxisThorn-website

---

*Need help? Contact AI.info@axisthorn.com*