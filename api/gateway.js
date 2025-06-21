// API Gateway - handles auth protection for v1 endpoints
const { verifyToken } = require('./middleware/jwt-auth');
const { logger } = require('./middleware/security');

// Public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  '/api/health',
  '/api/v1/auth/register',
  '/api/v1/auth/login',
  '/api/v1/auth/verify',
  '/api/v1/payment-methods' // Public payment options
];

// Read-only endpoints that allow optional auth
const OPTIONAL_AUTH_ENDPOINTS = [
  '/api/v1/products' // Can view products without auth
];

async function apiGateway(req, res, next) {
  const path = req.url.split('?')[0];
  
  // Health check - always public
  if (path === '/api/health' || path === '/api/v1/health') {
    return next();
  }
  
  // Check if endpoint is public
  const isPublic = PUBLIC_ENDPOINTS.some(endpoint => path.startsWith(endpoint));
  if (isPublic) {
    logger.info(`Public endpoint accessed: ${path}`);
    return next();
  }
  
  // Check if endpoint allows optional auth
  const isOptionalAuth = OPTIONAL_AUTH_ENDPOINTS.some(endpoint => path.startsWith(endpoint));
  if (isOptionalAuth && !req.headers.authorization) {
    logger.info(`Optional auth endpoint accessed without auth: ${path}`);
    return next();
  }
  
  // All other endpoints require authentication
  logger.info(`Protected endpoint accessed: ${path}`);
  return verifyToken(req, res, next);
}

module.exports = apiGateway;