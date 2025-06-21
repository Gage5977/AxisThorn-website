# Monitoring & Analytics Setup Guide

## 1. Vercel Analytics (Recommended)

### Enable Web Analytics
1. Go to [Vercel Dashboard](https://vercel.com/axis-thorns-projects/axis-thorn-llc-website)
2. Navigate to the "Analytics" tab
3. Click "Enable Web Analytics" (free for up to 2,500 page views/month)
4. No code changes needed - automatically injected!

### View Analytics
- Real-time visitor data
- Page views and unique visitors
- Top pages and referrers
- Device and browser breakdown

## 2. Google Analytics 4

### Setup
1. Create GA4 property at [analytics.google.com](https://analytics.google.com)
2. Get your Measurement ID (G-XXXXXXXXXX)
3. Update in `/src/index.html`:
   ```javascript
   gtag('config', 'G-YOUR-MEASUREMENT-ID');
   ```

### Enhanced Events
Already configured in your site:
- Page views
- Custom event tracking function
- Scroll tracking
- Click tracking

## 3. Error Monitoring with Sentry

### Quick Setup
1. Create account at [sentry.io](https://sentry.io)
2. Create new project (select JavaScript)
3. Add to your site:

```javascript
// Add to src/js/main.js
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "YOUR-SENTRY-DSN",
  environment: "production",
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 0.1, // 10% of transactions
  beforeSend(event) {
    // Filter out known non-issues
    if (event.exception?.values?.[0]?.value?.includes('ResizeObserver')) {
      return null;
    }
    return event;
  }
});
```

### What Sentry Monitors
- JavaScript errors
- Network failures
- Performance issues
- User sessions

## 4. Uptime Monitoring

### Option 1: Vercel Checks (Built-in)
- Automatically monitors deployment health
- Alerts on deployment failures
- No additional setup needed

### Option 2: UptimeRobot (Free)
1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Add monitors:
   - `https://axisthorn.com` (Main site)
   - `https://axisthorn.com/api/health` (API health)
3. Set check interval: 5 minutes
4. Add alert contacts (email/SMS)

### Option 3: Better Stack (Free tier)
1. Sign up at [betterstack.com](https://betterstack.com)
2. Create monitors for critical endpoints
3. Get status page for free

## 5. Performance Monitoring

### Lighthouse CI (Automated)
Add to `.github/workflows/lighthouse.yml`:

```yaml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://axisthorn.com
            https://axisthorn.com/axis-ai
          uploadArtifacts: true
          temporaryPublicStorage: true
```

### Core Web Vitals
Monitor these metrics:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## 6. API Monitoring

### Health Check Automation
Create a simple monitor that pings your API:

```bash
# Add to cron or monitoring service
curl -f https://axisthorn.com/api/health || alert "API is down!"
```

### Response Time Tracking
```javascript
// Add to api/health/index.js
const startTime = Date.now();
// ... health check logic ...
const responseTime = Date.now() - startTime;

health.metrics = {
  responseTime,
  timestamp: new Date().toISOString()
};
```

## 7. Log Aggregation

### Vercel Logs (Built-in)
- Access via Vercel Dashboard → Functions tab
- Real-time function logs
- Error tracking

### Custom Logging
For production, consider:
- LogDNA
- Papertrail
- Datadog

## 8. Setting Up Alerts

### Critical Alerts
1. **Site Down**: Uptime monitor → Email + SMS
2. **API Errors**: Sentry → Slack/Email
3. **High Traffic**: Vercel Analytics → Email
4. **Security Issues**: GitHub Security → Email

### Alert Channels
Configure these in each service:
- Primary: Email to AI.info@axisthorn.com
- Urgent: SMS to on-call number
- Team: Slack webhook (if using Slack)

## 9. Dashboard Setup

### Create a monitoring dashboard with:
1. [Geckoboard](https://www.geckoboard.com) (free trial)
2. Custom page at `/admin/status` showing:
   - API health status
   - Recent errors
   - Traffic stats
   - Performance metrics

## 10. Monthly Review Checklist

- [ ] Review Vercel Analytics trends
- [ ] Check Sentry for recurring errors
- [ ] Analyze Core Web Vitals scores
- [ ] Review uptime percentage
- [ ] Check API response times
- [ ] Audit security alerts
- [ ] Update monitoring thresholds

## Quick Start (5 minutes)

1. **Enable Vercel Analytics** (1 min)
   - Just click "Enable" in dashboard

2. **Setup UptimeRobot** (2 min)
   - Add monitor for https://axisthorn.com
   - Add your email for alerts

3. **Test monitoring** (2 min)
   ```bash
   # Check if monitoring is working
   curl https://axisthorn.com/api/health
   ```

That's it! You now have basic monitoring. Add more services as needed.