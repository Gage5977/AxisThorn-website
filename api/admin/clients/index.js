// Admin Client Management API
import { verifyAuth } from '../../middleware/auth.js';
import { validateRequest } from '../../middleware/validate-request.js';

// Mock database - in production, use a real database
let mockClients = [
    {
        id: 'client_1',
        name: 'John Smith',
        email: 'john.smith@techcorp.com',
        company: 'TechCorp Inc.',
        status: 'active',
        services: ['Financial Systems', 'Portfolio Engineering'],
        createdAt: new Date(Date.now() - 90 * 24 * 3600000).toISOString(),
        lastActivity: new Date(Date.now() - 15 * 60000).toISOString()
    },
    {
        id: 'client_2',
        name: 'Sarah Johnson',
        email: 'sarah@globalfinance.com',
        company: 'Global Finance Ltd.',
        status: 'active',
        services: ['Contract Automation'],
        createdAt: new Date(Date.now() - 60 * 24 * 3600000).toISOString(),
        lastActivity: new Date(Date.now() - 45 * 60000).toISOString()
    }
];

const clientSchema = {
    name: {
        required: true,
        type: 'string',
        minLength: 2,
        maxLength: 100
    },
    email: {
        required: true,
        type: 'email'
    },
    company: {
        type: 'string',
        maxLength: 100
    },
    services: {
        type: 'array',
        items: {
            type: 'string',
            enum: ['Financial Systems', 'Portfolio Engineering', 'Contract Automation']
        }
    }
};

export default async function handler(req, res) {
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

    switch (req.method) {
        case 'GET':
            // Get all clients
            res.status(200).json(mockClients);
            break;

        case 'POST':
            // Create new client
            const validation = validateRequest(req.body, clientSchema);
            if (!validation.valid) {
                res.status(400).json({ errors: validation.errors });
                return;
            }

            const newClient = {
                id: `client_${Date.now()}`,
                ...req.body,
                status: 'pending',
                createdAt: new Date().toISOString(),
                lastActivity: new Date().toISOString()
            };

            mockClients.push(newClient);
            res.status(201).json(newClient);
            break;

        case 'PUT':
            // Update client
            const { id } = req.query;
            if (!id) {
                res.status(400).json({ error: 'Client ID required' });
                return;
            }

            const clientIndex = mockClients.findIndex(c => c.id === id);
            if (clientIndex === -1) {
                res.status(404).json({ error: 'Client not found' });
                return;
            }

            const updateValidation = validateRequest(req.body, clientSchema);
            if (!updateValidation.valid) {
                res.status(400).json({ errors: updateValidation.errors });
                return;
            }

            mockClients[clientIndex] = {
                ...mockClients[clientIndex],
                ...req.body,
                lastActivity: new Date().toISOString()
            };

            res.status(200).json(mockClients[clientIndex]);
            break;

        case 'DELETE':
            // Delete client
            const { id: deleteId } = req.query;
            if (!deleteId) {
                res.status(400).json({ error: 'Client ID required' });
                return;
            }

            const deleteIndex = mockClients.findIndex(c => c.id === deleteId);
            if (deleteIndex === -1) {
                res.status(404).json({ error: 'Client not found' });
                return;
            }

            mockClients.splice(deleteIndex, 1);
            res.status(204).end();
            break;

        default:
            res.status(405).json({ error: 'Method not allowed' });
    }
}