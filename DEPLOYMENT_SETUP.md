# Axis Thorn LLC - Production Deployment Setup

## ⚡ Quick Start Checklist

### 1. GitHub Actions Setup (5 minutes)
```bash
# Go to: https://github.com/YOUR_REPO/settings/secrets/actions/new
# Add these secrets:
VERCEL_TOKEN=<get from https://vercel.com/account/tokens>
VERCEL_ORG_ID=team_XWJ8xFpSjwpFLoumfQUMCUoM
VERCEL_PROJECT_ID=prj_2P2rOhpmpjfQfUQjvg17de2foPQf
```

### 2. Vercel Environment Variables (10 minutes)
1. Go to: https://vercel.com/your-team/axis-thorn/settings/environment-variables
2. Add these **required** variables:

```bash
# Generate JWT secret:
openssl rand -base64 32

# Then add:
JWT_SECRET=<your-generated-secret>
DATABASE_URL=<from Vercel Postgres setup below>
```

### 3. Database Setup (15 minutes)

#### Option A: Vercel Postgres (Recommended)
1. Go to: https://vercel.com/dashboard/stores
2. Click "Create Database" → Select "Postgres"
3. Name it: `axisthorn-production`
4. Copy the connection string to `DATABASE_URL`

#### Option B: External PostgreSQL
- Supabase: https://supabase.com
- Neon: https://neon.tech
- Railway: https://railway.app

### 4. Run Database Migrations (5 minutes)
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
DATABASE_URL="your-connection-string" npx prisma migrate deploy
```

### 5. Create Admin User (2 minutes)
```bash
# Run the admin creation script
DATABASE_URL="your-connection-string" node scripts/create-admin.js
```

## 📧 Email Service Setup

### SendGrid (Recommended)
1. Sign up: https://sendgrid.com
2. Create API Key: Settings → API Keys
3. Add to Vercel:
   ```
   SENDGRID_API_KEY=SG.xxx
   EMAIL_FROM=noreply@axisthorn.com
   ```

### AWS SES (Alternative)
1. Verify domain in AWS SES
2. Create IAM user with SES permissions
3. Add credentials to Vercel

## 💳 Stripe Setup

1. Create account: https://stripe.com
2. Get API keys: https://dashboard.stripe.com/apikeys
3. Add to Vercel:
   ```
   STRIPE_SECRET_KEY=sk_live_xxx
   STRIPE_PUBLISHABLE_KEY=pk_live_xxx
   ```
4. Configure webhook endpoint:
   - URL: `https://axisthorn.com/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.failed`

## 🚀 Deploy to Production

### Automatic Deployment
```bash
# Push to main branch
git add .
git commit -m "Deploy to production"
git push origin main
```

### Manual Deployment
```bash
# Using Vercel CLI
vercel --prod
```

## 🔍 Verify Deployment

1. Check deployment: https://axisthorn.com
2. Test API health: https://axisthorn.com/api/health
3. View status: https://axisthorn.com/api/status
4. Check logs: https://vercel.com/your-team/axis-thorn/logs

## 🛡️ Security Checklist

- [ ] JWT_SECRET is 32+ characters
- [ ] Database uses SSL connection
- [ ] Stripe keys are production (not test)
- [ ] Email service is configured
- [ ] Admin password is strong
- [ ] 2FA enabled on all service accounts
- [ ] Environment variables are set in Vercel (not in code)

## 🔧 Troubleshooting

### Database Connection Failed
```bash
# Test connection
DATABASE_URL="your-url" npx prisma db pull
```

### API Returns 503
- Check `.vercelignore` - remove API exclusions when ready
- Verify all environment variables are set
- Check Vercel function logs

### Authentication Not Working
- Ensure JWT_SECRET is set
- Database migrations are run
- Admin user is created

## 📊 Monitoring

1. **Vercel Analytics**: Included free
2. **Error Tracking**: Add Sentry DSN
3. **Uptime Monitoring**: Use Better Uptime or similar

## 🔄 Next Steps After Deployment

1. Remove `.vercelignore` restrictions
2. Test payment flow with Stripe test mode
3. Configure email templates
4. Set up regular database backups
5. Enable production error tracking

---

Need help? Contact AI.info@axisthorn.com