// Admin Realtime Updates API
import { verifyAuth } from '../middleware/auth.js';

// Store for tracking active sessions (in production, use Redis or similar)
const activeSessions = new Map();

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
        // Clean up old sessions
        const now = Date.now();
        for (const [sessionId, lastSeen] of activeSessions.entries()) {
            if (now - lastSeen > 300000) { // 5 minutes
                activeSessions.delete(sessionId);
            }
        }

        // Track this admin session
        const sessionId = req.headers['x-session-id'] || authResult.user.id;
        activeSessions.set(sessionId, now);

        // Generate realtime data
        const realtimeData = {
            activeSessions: activeSessions.size + Math.floor(Math.random() * 5), // Add some random user sessions
            newActivities: []
        };

        // Randomly add new activities
        if (Math.random() > 0.7) {
            const activities = [
                'New payment received from client',
                'Document uploaded by user',
                'API request spike detected',
                'Backup completed successfully',
                'New client registration',
                'Contract signed and processed',
                'System optimization completed'
            ];
            
            realtimeData.newActivities.push({
                description: activities[Math.floor(Math.random() * activities.length)],
                timestamp: new Date().toISOString()
            });
        }

        res.status(200).json(realtimeData);
    } catch (error) {
        console.error('Realtime update error:', error);
        res.status(500).json({ error: 'Failed to fetch realtime data' });
    }
}