# Axis Thorn Production Deployment Checklist

## ✅ Completed Updates

### 1. Security Fixes
- [x] Removed hardcoded admin credentials
- [x] Added proper password hashing with crypto
- [x] JWT secret now requires environment variable
- [x] Development admin user only created with explicit flag

### 2. Database Integration
- [x] Created unified database interface (`lib/db.js`)
- [x] Supports both PostgreSQL (production) and in-memory (development)
- [x] Updated auth middleware to use database
- [x] Updated registration endpoint to use database
- [x] Created admin user creation script

### 3. Email Service
- [x] Created email service module (`lib/email.js`)
- [x] Supports SendGrid and AWS SES
- [x] Fallback to console logging if not configured
- [x] Contact form endpoint with email integration
- [x] Email templates for welcome, password reset, and contact

### 4. Documentation
- [x] Created `.env.example` with all required variables
- [x] Created `DEPLOYMENT_SETUP.md` with step-by-step guide
- [x] GitHub Actions workflow ready for deployment

## 🚀 Deployment Steps

### Step 1: GitHub Actions (5 minutes)
1. Go to: https://github.com/YOUR_REPO/settings/secrets/actions
2. Add these secrets:
   ```
   VERCEL_TOKEN=<your-token>
   VERCEL_ORG_ID=team_XWJ8xFpSjwpFLoumfQUMCUoM
   VERCEL_PROJECT_ID=prj_2P2rOhpmpjfQfUQjvg17de2foPQf
   ```

### Step 2: Database Setup (15 minutes)
1. Create PostgreSQL database (Vercel Postgres recommended)
2. Get connection string
3. Run migrations:
   ```bash
   DATABASE_URL="your-url" npx prisma migrate deploy
   ```

### Step 3: Vercel Environment Variables (10 minutes)
Add to https://vercel.com/your-team/axis-thorn/settings/environment-variables:

**Required:**
```
JWT_SECRET=<32+ character secret>
DATABASE_URL=<postgres connection string>
```

**For Email (choose one):**
```
# SendGrid
SENDGRID_API_KEY=SG.xxx
EMAIL_FROM=noreply@axisthorn.com
EMAIL_REPLY_TO=AI.info@axisthorn.com

# OR AWS SES
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=us-east-1
```

**For Payments:**
```
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Step 4: Create Admin User (5 minutes)
```bash
DATABASE_URL="your-url" node scripts/create-admin.js
```

### Step 5: Update .vercelignore (2 minutes)
Remove or comment out these lines to enable backend:
```
# api/
# prisma/
# lib/
```

### Step 6: Deploy (5 minutes)
```bash
git add .
git commit -m "Enable production backend"
git push origin main
```

## 🔍 Post-Deployment Verification

1. **Check static site**: https://axisthorn.com
2. **Test API health**: https://axisthorn.com/api/health
3. **Check status**: https://axisthorn.com/api/status
4. **Test contact form**: Submit test message
5. **Test authentication**: Try admin login
6. **Check logs**: https://vercel.com/your-team/axis-thorn/logs

## ⚠️ Important Notes

1. **Stripe Setup**: Required for payment features
   - Create webhook endpoint for `/api/webhooks/stripe`
   - Add events: `payment_intent.succeeded`, `payment_intent.failed`

2. **Email Verification**: 
   - Verify domain in SendGrid or AWS SES
   - Test email delivery before going live

3. **Security**:
   - Use strong JWT_SECRET (32+ characters)
   - Enable 2FA on all service accounts
   - Regular security audits

4. **Monitoring**:
   - Set up error tracking (Sentry)
   - Configure uptime monitoring
   - Regular backup schedule

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Verify all environment variables are set
3. Test database connection separately
4. Contact: AI.info@axisthorn.com

---

Last Updated: ${new Date().toISOString()}
Ready for Production: YES ✅