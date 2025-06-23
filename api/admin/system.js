// Admin System Health API
import { verifyAuth } from '../middleware/auth.js';
import { createRateLimiter } from '../middleware/rate-limit.js';

const adminRateLimit = createRateLimiter({
    windowMs: 60000,
    max: 30
});

export default async function handler(req, res) {
    // Apply rate limiting
    await new Promise((resolve) => {
        adminRateLimit(req, res, resolve);
    });
    
    if (res.headersSent) return;

    // Only allow GET requests
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    // Verify authentication and admin role
    const authResult = verifyAuth(req);
    if (!authResult.authenticated) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    if (authResult.user.role !== 'admin') {
        res.status(403).json({ error: 'Admin access required' });
        return;
    }

    try {
        // Mock system health data - in production, this would come from monitoring tools
        const systemData = {
            activeSessions: Math.floor(Math.random() * 20) + 5,
            performance: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                responseTimes: [35, 38, 42, 45, 48, 41]
            },
            apiMetrics: {
                totalRequests: 125000,
                successRate: 99.98,
                avgResponseTime: 42,
                peakResponseTime: 250
            },
            resources: {
                cpuUsage: 35.2,
                memoryUsage: 62.8,
                diskUsage: 45.1,
                bandwidth: {
                    incoming: 2.4, // GB
                    outgoing: 8.7  // GB
                }
            },
            errors: {
                last24Hours: 25,
                last7Days: 142,
                topErrors: [
                    { code: 404, count: 85, message: 'Resource not found' },
                    { code: 401, count: 32, message: 'Authentication failed' },
                    { code: 500, count: 15, message: 'Internal server error' },
                    { code: 429, count: 10, message: 'Rate limit exceeded' }
                ]
            },
            deployments: [
                {
                    version: '2.4.1',
                    timestamp: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
                    status: 'success',
                    duration: 124
                },
                {
                    version: '2.4.0',
                    timestamp: new Date(Date.now() - 7 * 24 * 3600000).toISOString(),
                    status: 'success',
                    duration: 98
                }
            ]
        };

        res.status(200).json(systemData);
    } catch (error) {
        console.error('System health error:', error);
        res.status(500).json({ error: 'Failed to fetch system data' });
    }
}