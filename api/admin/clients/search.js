// Admin Client Search API
import { verifyAuth } from '../../middleware/auth.js';

export default async function handler(req, res) {
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
        const { q } = req.query;
        const searchQuery = (q || '').toLowerCase();

        // Mock client data - in production, this would come from a database
        const allClients = [
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
        ];

        // Filter clients based on search query
        const filteredClients = searchQuery
            ? allClients.filter(client => 
                client.name.toLowerCase().includes(searchQuery) ||
                (client.company && client.company.toLowerCase().includes(searchQuery)) ||
                client.services.some(service => service.toLowerCase().includes(searchQuery))
              )
            : allClients;

        res.status(200).json(filteredClients);
    } catch (error) {
        console.error('Client search error:', error);
        res.status(500).json({ error: 'Failed to search clients' });
    }
}