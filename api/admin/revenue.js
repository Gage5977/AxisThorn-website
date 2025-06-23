// Admin Revenue Analytics API
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
        // Mock revenue data - in production, this would come from a database
        const revenueData = {
            mrr: 104166, // Monthly Recurring Revenue
            arr: 1250000, // Annual Run Rate
            outstanding: 75000, // Outstanding invoices
            serviceRevenue: {
                labels: ['Financial Systems', 'Portfolio Engineering', 'Contract Automation'],
                values: [600000, 400000, 250000]
            },
            monthlyGrowth: [
                { month: 'Jan', revenue: 150000, growth: 0 },
                { month: 'Feb', revenue: 180000, growth: 20 },
                { month: 'Mar', revenue: 200000, growth: 11.1 },
                { month: 'Apr', revenue: 220000, growth: 10 },
                { month: 'May', revenue: 250000, growth: 13.6 },
                { month: 'Jun', revenue: 250000, growth: 0 }
            ],
            topClients: [
                { name: 'TechCorp Inc.', revenue: 250000, percentage: 20 },
                { name: 'Global Finance Ltd.', revenue: 200000, percentage: 16 },
                { name: 'Investment Group', revenue: 175000, percentage: 14 },
                { name: 'Legal Partners', revenue: 150000, percentage: 12 },
                { name: 'Wealth Management Co.', revenue: 125000, percentage: 10 }
            ],
            projections: {
                q3: 780000,
                q4: 850000,
                nextYear: 3500000
            }
        };

        res.status(200).json(revenueData);
    } catch (error) {
        console.error('Revenue analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch revenue data' });
    }
}