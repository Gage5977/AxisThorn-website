// Admin Analytics API
import { verifyAuth } from '../middleware/auth.js';
import { createRateLimiter } from '../middleware/rate-limit.js';

const adminRateLimit = createRateLimiter({
    windowMs: 60000, // 1 minute
    max: 30 // 30 requests per minute for admin endpoints
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
        // Mock analytics data - in production, this would come from a database
        const analytics = {
            overview: {
                totalRevenue: 1250000,
                activeClients: 24,
                avgProjectValue: 52083,
                systemUptime: 99.9
            },
            revenue: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                values: [150000, 180000, 200000, 220000, 250000, 250000]
            },
            activities: [
                {
                    description: 'New client onboarded: TechCorp Inc.',
                    timestamp: new Date(Date.now() - 15 * 60000).toISOString()
                },
                {
                    description: 'Financial analysis completed for Global Finance Ltd.',
                    timestamp: new Date(Date.now() - 45 * 60000).toISOString()
                },
                {
                    description: 'Contract automation deployed for Legal Partners',
                    timestamp: new Date(Date.now() - 2 * 3600000).toISOString()
                },
                {
                    description: 'System maintenance completed',
                    timestamp: new Date(Date.now() - 5 * 3600000).toISOString()
                },
                {
                    description: 'Portfolio optimization run for Investment Group',
                    timestamp: new Date(Date.now() - 8 * 3600000).toISOString()
                }
            ],
            clients: [
                {
                    id: 'client_1',
                    name: 'John Smith',
                    company: 'TechCorp Inc.',
                    status: 'active',
                    services: ['Financial Systems', 'Portfolio Engineering'],
                    lastActivity: new Date(Date.now() - 15 * 60000).toISOString()
                },
                {
                    id: 'client_2',
                    name: 'Sarah Johnson',
                    company: 'Global Finance Ltd.',
                    status: 'active',
                    services: ['Contract Automation'],
                    lastActivity: new Date(Date.now() - 45 * 60000).toISOString()
                },
                {
                    id: 'client_3',
                    name: 'Michael Chen',
                    company: 'Investment Group',
                    status: 'active',
                    services: ['Portfolio Engineering'],
                    lastActivity: new Date(Date.now() - 8 * 3600000).toISOString()
                },
                {
                    id: 'client_4',
                    name: 'Emily Davis',
                    company: 'Legal Partners',
                    status: 'pending',
                    services: ['Contract Automation', 'Financial Systems'],
                    lastActivity: new Date(Date.now() - 24 * 3600000).toISOString()
                },
                {
                    id: 'client_5',
                    name: 'Robert Wilson',
                    company: 'Wealth Management Co.',
                    status: 'inactive',
                    services: ['Portfolio Engineering'],
                    lastActivity: new Date(Date.now() - 72 * 3600000).toISOString()
                }
            ]
        };

        res.status(200).json(analytics);
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
}