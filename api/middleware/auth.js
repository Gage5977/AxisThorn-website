const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// In production, these should come from environment variables
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
const API_KEY = process.env.PAYMENT_API_KEY;

// Rate limiting cache
const rateLimitCache = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // 10 requests per minute

function cleanupRateLimitCache() {
  const now = Date.now();
  for (const [key, value] of rateLimitCache.entries()) {
    if (now - value.firstRequest > RATE_LIMIT_WINDOW) {
      rateLimitCache.delete(key);
    }
  }
}

// Clean up cache every minute
setInterval(cleanupRateLimitCache, RATE_LIMIT_WINDOW);

function rateLimit(identifier) {
  const now = Date.now();
  const userLimit = rateLimitCache.get(identifier);

  if (!userLimit) {
    rateLimitCache.set(identifier, {
      count: 1,
      firstRequest: now
    });
    return true;
  }

  if (now - userLimit.firstRequest > RATE_LIMIT_WINDOW) {
    rateLimitCache.set(identifier, {
      count: 1,
      firstRequest: now
    });
    return true;
  }

  if (userLimit.count >= MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

function validateAPIKey(req) {
  const apiKey = req.headers['x-api-key'];
  return apiKey && apiKey === API_KEY;
}

function validateJWT(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

function generateAccessToken(clientId, metadata = {}) {
  return jwt.sign(
    {
      clientId,
      type: 'payment_access',
      ...metadata,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiry
    },
    JWT_SECRET
  );
}

// Main authentication middleware
async function authenticate(req, res, next) {
  // Check if it's a preflight request
  if (req.method === 'OPTIONS') {
    return next();
  }

  // Get client identifier for rate limiting
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const identifier = clientIp || 'unknown';

  // Apply rate limiting
  if (!rateLimit(identifier)) {
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later'
    });
  }

  // Check for API key (for server-to-server calls)
  if (validateAPIKey(req)) {
    req.auth = {
      type: 'api_key',
      clientId: 'api_client'
    };
    return next();
  }

  // Check for JWT token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Please provide a valid access token'
    });
  }

  const token = authHeader.substring(7);
  const decoded = validateJWT(token);

  if (!decoded) {
    return res.status(401).json({
      error: 'Invalid token',
      message: 'Your access token is invalid or expired'
    });
  }

  // Validate token type
  if (decoded.type !== 'payment_access') {
    return res.status(403).json({
      error: 'Invalid token type',
      message: 'This token cannot be used for payment operations'
    });
  }

  // Add auth info to request
  req.auth = {
    type: 'jwt',
    clientId: decoded.clientId,
    metadata: decoded
  };

  next();
}

// Middleware for validating payment amounts
function validatePaymentAmount(req, res, next) {
  const { amount } = req.body;

  if (!amount || typeof amount !== 'number') {
    return res.status(400).json({
      error: 'Invalid amount',
      message: 'Amount must be a valid number'
    });
  }

  // Minimum amount: $0.50
  if (amount < 0.50) {
    return res.status(400).json({
      error: 'Amount too small',
      message: 'Minimum payment amount is $0.50'
    });
  }

  // Maximum amount: $50,000
  if (amount > 50000) {
    return res.status(400).json({
      error: 'Amount too large',
      message: 'Maximum payment amount is $50,000. For larger amounts, please contact support.'
    });
  }

  next();
}

// Export middleware and utilities
module.exports = {
  authenticate,
  validatePaymentAmount,
  generateAccessToken,
  rateLimit
};