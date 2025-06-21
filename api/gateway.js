// API Gateway - handles auth protection for v1 endpoints
const { verifyToken } = require('./middleware/jwt-auth');
const { logger } = require('./middleware/security');

// Public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  '/api/health',
  '/api/v1', // API version info
  '/api/v1/auth/register',
  '/api/v1/auth/login',
  '/api/v1/auth/verify',
  '/api/v1/payment-methods', // Public payment options
  '/api/v1/access-codes/redeem' // Allow public access code redemption
];

// Read-only endpoints that allow optional auth
const OPTIONAL_AUTH_ENDPOINTS = [
  '/api/v1/products', // Can view products without auth
  '/api/v1/exclusive' // Allow access with access code
];

async function apiGateway(req, res, next) {
  const path = req.originalUrl || req.url;
  const cleanPath = path.split('?')[0].replace(/\/+$/, ''); // Remove trailing slashes
  
  // Health check - always public
  if (cleanPath === '/api/health' || cleanPath === '/api/v1/health') {
    return next();
  }
  
  // Check if endpoint is public
  const isPublic = PUBLIC_ENDPOINTS.some(endpoint => 
    cleanPath === endpoint || 
    cleanPath.startsWith(endpoint + '/') ||
    cleanPath.startsWith(endpoint.replace(/\/$/, '') + '/')
  );
  if (isPublic) {
    logger.info(`Public endpoint accessed: ${cleanPath}`);
    return next();
  }
  
  // Check if endpoint allows optional auth
  const isOptionalAuth = OPTIONAL_AUTH_ENDPOINTS.some(endpoint => cleanPath.startsWith(endpoint));
  if (isOptionalAuth && !req.headers.authorization) {
    logger.info(`Optional auth endpoint accessed without auth: ${cleanPath}`);
    return next();
  }
  
  // All other endpoints require authentication
  logger.info(`Protected endpoint accessed: ${cleanPath}`);
  return verifyToken(req, res, next);
}

module.exports = apiGateway;