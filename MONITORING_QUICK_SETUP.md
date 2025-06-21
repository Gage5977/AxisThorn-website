# Quick Monitoring Setup (2 minutes)

## 1. Enable Vercel Analytics (30 seconds)
1. Go to: https://vercel.com/axis-thorns-projects/axis-thorn-llc-website
2. Click on the "Analytics" tab
3. Click "Enable Analytics"
4. Done! Analytics will start collecting data immediately

## 2. Setup UptimeRobot (90 seconds)
1. Go to: https://uptimerobot.com/signUp
2. Sign up with your email
3. Click "Add New Monitor"
4. Configure:
   - Monitor Type: HTTP(s)
   - Friendly Name: Axis Thorn Website
   - URL: https://axisthorn.com
   - Monitoring Interval: 5 minutes
5. Click "Create Monitor"

### Add API Health Monitor
1. Click "Add New Monitor" again
2. Configure:
   - Monitor Type: HTTP(s)
   - Friendly Name: Axis Thorn API
   - URL: https://axisthorn.com/api/health
   - Monitoring Interval: 5 minutes
3. Click "Create Monitor"

## 3. Get Alerts
1. In UptimeRobot, go to "My Settings"
2. Add your email for alerts
3. Optional: Add SMS number for critical alerts

---

## What You'll Get:
- **Vercel Analytics**: Real-time visitor data, page views, performance metrics
- **UptimeRobot**: Instant alerts if site goes down, uptime percentage reports

That's it! Your monitoring is now active.