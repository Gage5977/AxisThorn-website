// Consolidated Admin Handlers
import { requireAdmin } from '../../../api/middleware/auth.js';
import db from '../../db.js';

// Analytics handler
export async function analytics(req, res) {
    await requireAdmin(req, res, async () => {
        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        try {
            // Get date range
            const { startDate, endDate } = req.query;
            const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const end = endDate ? new Date(endDate) : new Date();

            // Fetch analytics data
            const [users, documents, invoices, revenue] = await Promise.all([
                // User stats
                db.user.count({
                    where: {
                        createdAt: { gte: start, lte: end }
                    }
                }),
                // Document stats
                db.isUsingDatabase() ? 0 : 0, // Placeholder
                // Invoice stats
                db.isUsingDatabase() ? 0 : 0, // Placeholder
                // Revenue stats
                db.isUsingDatabase() ? 0 : 0  // Placeholder
            ]);

            const analytics = {
                period: { start, end },
                users: {
                    total: users,
                    new: users,
                    active: Math.floor(users * 0.7)
                },
                documents: {
                    total: documents,
                    uploaded: documents
                },
                invoices: {
                    total: invoices,
                    paid: Math.floor(invoices * 0.8),
                    pending: Math.floor(invoices * 0.2)
                },
                revenue: {
                    total: revenue,
                    currency: 'USD'
                }
            };

            res.status(200).json(analytics);
        } catch (error) {
            console.error('Analytics error:', error);
            res.status(500).json({ error: 'Failed to fetch analytics' });
        }
    });
}

// Real-time stats handler
export async function realtime(req, res) {
    await requireAdmin(req, res, async () => {
        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        try {
            const stats = {
                timestamp: new Date().toISOString(),
                activeUsers: Math.floor(Math.random() * 50) + 10,
                activeConnections: Math.floor(Math.random() * 100) + 20,
                requestsPerMinute: Math.floor(Math.random() * 1000) + 100,
                avgResponseTime: Math.floor(Math.random() * 100) + 50,
                systemLoad: {
                    cpu: Math.random() * 100,
                    memory: Math.random() * 100,
                    disk: Math.random() * 100
                }
            };

            res.status(200).json(stats);
        } catch (error) {
            console.error('Realtime stats error:', error);
            res.status(500).json({ error: 'Failed to fetch realtime stats' });
        }
    });
}

// Revenue handler
export async function revenue(req, res) {
    await requireAdmin(req, res, async () => {
        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        try {
            const { period = 'month' } = req.query;
            
            // Calculate date range
            const now = new Date();
            let startDate;
            
            switch (period) {
                case 'day':
                    startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                    break;
                case 'week':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'year':
                    startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                    break;
                default: // month
                    startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            }

            // Mock revenue data
            const revenue = {
                period: { start: startDate, end: now },
                summary: {
                    total: 125000,
                    growth: 15.5,
                    transactions: 342,
                    avgTransaction: 365.50
                },
                byDay: [], // Would be populated from database
                byCategory: {
                    'AI Services': 75000,
                    'Consulting': 35000,
                    'Support': 15000
                },
                topClients: [] // Would be populated from database
            };

            res.status(200).json(revenue);
        } catch (error) {
            console.error('Revenue error:', error);
            res.status(500).json({ error: 'Failed to fetch revenue data' });
        }
    });
}

// System handler
export async function system(req, res) {
    await requireAdmin(req, res, async () => {
        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        try {
            const system = {
                status: 'operational',
                version: process.env.npm_package_version || '1.0.0',
                environment: process.env.NODE_ENV || 'development',
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
                services: {
                    database: db.isUsingDatabase() ? 'connected' : 'in-memory',
                    email: process.env.SENDGRID_API_KEY ? 'configured' : 'not configured',
                    payments: process.env.STRIPE_SECRET_KEY ? 'configured' : 'not configured',
                    storage: 'local'
                },
                resources: {
                    memory: process.memoryUsage(),
                    cpu: process.cpuUsage()
                }
            };

            res.status(200).json(system);
        } catch (error) {
            console.error('System status error:', error);
            res.status(500).json({ error: 'Failed to fetch system status' });
        }
    });
}

export default {
    analytics,
    realtime,
    revenue,
    system
};