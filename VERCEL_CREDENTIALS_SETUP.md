# Vercel Deployment Credentials Setup

## Required GitHub Secrets

You need to add these 3 secrets to your GitHub repository for deployment to work.

### 1. Get Your Vercel Token

1. Go to: https://vercel.com/account/tokens
2. Click "Create Token"
3. Give it a name like "GitHub Actions Deploy"
4. Set expiration (recommend: 1 year)
5. Copy the token immediately (you won't see it again!)

### 2. Add Secrets to GitHub

Go to: https://github.com/Gage5977/AxisThorn-website/settings/secrets/actions

Add these 3 repository secrets:

#### Secret 1: VERCEL_TOKEN
- **Name:** `VERCEL_TOKEN`
- **Value:** [The token you just created in step 1]

#### Secret 2: VERCEL_ORG_ID
- **Name:** `VERCEL_ORG_ID`
- **Value:** `team_XWJ8xFpSjwpFLoumfQUMCUoM`

#### Secret 3: VERCEL_PROJECT_ID
- **Name:** `VERCEL_PROJECT_ID`
- **Value:** `prj_2P2rOhpmpjfQfUQjvg17de2foPQf`

### 3. Trigger Deployment

After adding all 3 secrets, the deployment will run automatically on the next push.
Or trigger manually:

```bash
# Option 1: Empty commit
git commit --allow-empty -m "Trigger deployment with credentials" && git push

# Option 2: Re-run failed workflow
gh run rerun 15816079056
```

### Quick Links

- Create Token: https://vercel.com/account/tokens
- Add Secrets: https://github.com/Gage5977/AxisThorn-website/settings/secrets/actions
- View Workflows: https://github.com/Gage5977/AxisThorn-website/actions

---
**Security Note:** Delete this file after adding credentials.