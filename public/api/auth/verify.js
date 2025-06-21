// Token verification endpoint
const { withMiddleware, withRateLimit } = require('../utils/handler-wrapper');
const { rateLimiters, logger } = require('../middleware/security');
const prisma = require('../../lib/prisma');
const jwt = require('jsonwebtoken');

const handler = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'axis-thorn-secret');
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check if session exists and is valid
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session) {
      return res.status(401).json({ error: 'Session not found' });
    }

    if (session.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Session expired' });
    }

    return res.status(200).json({
      valid: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role
      },
      expiresAt: session.expiresAt
    });

  } catch (error) {
    logger.error('Token verification error:', error);
    throw error;
  }
};

module.exports = withMiddleware(
  withRateLimit(handler, rateLimiters.general)
);