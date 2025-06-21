// API Version 1 Router
// This file handles routing for API v1 endpoints

const API_VERSION = 'v1';

// Map of available endpoints
const endpoints = {
  // Auth endpoints (no authentication required)
  'auth/register': require('../auth/register'),
  'auth/login': require('../auth/login'),
  'auth/verify': require('../auth/verify'),
  
  // Protected endpoints
  invoices: require('./invoices/router'),
  customers: require('../customers'),
  products: require('../products'),
  payments: require('../payments'),
  'stripe-payment': require('../stripe-payment'),
  'payment-methods': require('../payment-methods'),
  'ai-chat': require('../ai-chat'),
  'ai-demo': require('../ai-demo')
};

// Version information
const versionInfo = {
  version: API_VERSION,
  status: 'stable',
  deprecated: false,
  sunset: null,
  endpoints: Object.keys(endpoints).map(endpoint => ({
    path: `/api/${API_VERSION}/${endpoint}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }))
};

// Main handler that routes to appropriate endpoint
module.exports = async (req, res) => {
  // Extract the endpoint from the URL
  const urlParts = req.url.split('?')[0].split('/').filter(Boolean);
  
  // Handle version info request
  if (urlParts.length === 2 && urlParts[0] === 'api' && urlParts[1] === API_VERSION) {
    return res.status(200).json(versionInfo);
  }
  
  // Extract endpoint name (should be at position 2 after /api/v1/)
  // Handle nested endpoints like auth/login
  const endpointName = urlParts.slice(2).join('/');
  
  if (!endpointName || !endpoints[endpointName]) {
    return res.status(404).json({
      error: 'Endpoint not found',
      version: API_VERSION,
      availableEndpoints: Object.keys(endpoints).map(ep => `/api/${API_VERSION}/${ep}`)
    });
  }
  
  // Get the handler for this endpoint
  const handler = endpoints[endpointName];
  
  // Adjust the request URL to remove the version prefix
  // This allows existing handlers to work without modification
  const prefixToRemove = `/api/${API_VERSION}/${endpointName}`;
  req.url = req.url.replace(prefixToRemove, '');
  if (req.url === '') {req.url = '/';}
  
  // Add version header to response
  res.setHeader('X-API-Version', API_VERSION);
  
  // Call the endpoint handler
  return handler(req, res);
};