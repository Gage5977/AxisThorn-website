// Health check endpoint
const prisma = require('../../lib/prisma');

module.exports = async function handler(req, res) {
  // Support both GET and HEAD
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.setHeader('Allow', ['GET', 'HEAD']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Basic health check
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'axis-thorn-api',
      version: 'v1'
    };

    // Check database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
      health.database = 'connected';
    } catch (dbError) {
      health.database = 'disconnected';
      health.status = 'degraded';
    }

    // Check environment
    health.environment = process.env.NODE_ENV || 'unknown';

    // For HEAD requests, just return 200 OK
    if (req.method === 'HEAD') {
      return res.status(200).end();
    }

    // For GET requests, return full health info
    return res.status(health.status === 'ok' ? 200 : 503).json(health);

  } catch (error) {
    console.error('Health check error:', error);
    return res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
};