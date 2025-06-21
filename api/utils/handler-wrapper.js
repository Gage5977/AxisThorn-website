// Wrapper for Vercel serverless functions to apply middleware
const cors = require('cors');
const { corsOptions, errorHandler, requestLogger, securityHeaders } = require('../middleware/security');
const { sanitizeInputs } = require('../middleware/validation');

// Create a wrapper that applies middleware to serverless functions
const withMiddleware = (handler, options = {}) => {
  return async (req, res) => {
    // Apply CORS
    const corsMiddleware = cors(corsOptions);
    await new Promise((resolve, reject) => {
      corsMiddleware(req, res, (err) => {
        if (err) {reject(err);}
        else {resolve();}
      });
    });

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Apply security headers
    securityHeaders(req, res, () => {});

    // Log the request
    requestLogger(req, res, () => {});

    // Sanitize inputs
    sanitizeInputs(req, res, () => {});

    try {
      // Call the actual handler
      await handler(req, res);
    } catch (error) {
      // Handle errors
      errorHandler(error, req, res, () => {});
    }
  };
};

// Apply rate limiting for specific endpoints
const withRateLimit = (handler, limiter) => {
  return async (req, res) => {
    await new Promise((resolve, reject) => {
      limiter(req, res, (err) => {
        if (err) {reject(err);}
        else {resolve();}
      });
    });
    return handler(req, res);
  };
};

module.exports = {
  withMiddleware,
  withRateLimit
};