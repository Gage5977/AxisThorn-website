// Admin Client Details API
import { verifyAuth } from '../../middleware/auth.js';

// Mock client data - in production, use a real database
const mockClients = {
    'client_1': {
        id: 'client_1',
        name: 'John Smith',
        email: 'john.smith@techcorp.com',
        company: 'TechCorp Inc.',
        status: 'active',
        services: ['Financial Systems', 'Portfolio Engineering'],
        createdAt: new Date(Date.now() - 90 * 24 * 3600000).toISOString(),
        lastActivity: new Date(Date.now() - 15 * 60000).toISOString(),
        phone: '+1 (555) 123-4567',
        address: {
            street: '123 Business St, Suite 100',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            country: 'USA'
        },
        accountValue: 250000,
        paymentTerms: 'Net 30',
        activeProjects: 3,
        healthScore: 'excellent'
    },
    'client_2': {
        id: 'client_2',
        name: 'Sarah Johnson',
        email: 'sarah@globalfinance.com',
        company: 'Global Finance Ltd.',
        status: 'active',
        services: ['Contract Automation'],
        createdAt: new Date(Date.now() - 60 * 24 * 3600000).toISOString(),
        lastActivity: new Date(Date.now() - 45 * 60000).toISOString(),
        phone: '+1 (555) 234-5678',
        address: {
            street: '456 Financial Ave',
            city: 'San Francisco',
            state: 'CA',
            zip: '94105',
            country: 'USA'
        },
        accountValue: 180000,
        paymentTerms: 'Net 30',
        activeProjects: 1,
        healthScore: 'good'
    }
};

export default async function handler(req, res) {
    // Extract client ID from URL
    const { id } = req.query;
    
    if (!id) {
        res.status(400).json({ error: 'Client ID required' });
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

    // Only allow GET requests
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const client = mockClients[id];
        
        if (!client) {
            res.status(404).json({ error: 'Client not found' });
            return;
        }

        res.status(200).json(client);
    } catch (error) {
        console.error('Client details error:', error);
        res.status(500).json({ error: 'Failed to fetch client details' });
    }
}