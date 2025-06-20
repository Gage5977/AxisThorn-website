const { generateAccessToken, rateLimit } = require('../middleware/auth');
const crypto = require('crypto');

// In production, store these in a database
const VALID_CLIENTS = new Map([
  ['demo-client', {
    secret: process.env.DEMO_CLIENT_SECRET || 'demo-secret-key',
    name: 'Demo Client',
    allowedInvoicePatterns: ['*']
  }]
]);

// Validate client credentials
function validateClient(clientId, clientSecret) {
  const client = VALID_CLIENTS.get(clientId);
  if (!client) return false;
  
  // In production, use bcrypt or similar for comparing secrets
  return client.secret === clientSecret;
}

// Validate invoice access
function hasInvoiceAccess(clientId, invoiceNumber) {
  const client = VALID_CLIENTS.get(clientId);
  if (!client) return false;

  // Check if client has access to all invoices
  if (client.allowedInvoicePatterns.includes('*')) return true;

  // Check specific invoice patterns
  return client.allowedInvoicePatterns.some(pattern => {
    const regex = new RegExp(pattern.replace('*', '.*'));
    return regex.test(invoiceNumber);
  });
}

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (!rateLimit(clientIp || 'unknown')) {
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later'
    });
  }

  try {
    const { 
      clientId, 
      clientSecret, 
      invoiceNumber,
      customerEmail 
    } = req.body;

    // Validate required fields
    if (!clientId || !clientSecret) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Client ID and secret are required'
      });
    }

    // Validate client credentials
    if (!validateClient(clientId, clientSecret)) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'The provided client credentials are invalid'
      });
    }

    // If invoice number provided, validate access
    if (invoiceNumber && !hasInvoiceAccess(clientId, invoiceNumber)) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have access to this invoice'
      });
    }

    // Generate access token
    const token = generateAccessToken(clientId, {
      invoiceNumber,
      customerEmail,
      timestamp: Date.now()
    });

    // Return token with expiry info
    return res.status(200).json({
      access_token: token,
      token_type: 'Bearer',
      expires_in: 3600, // 1 hour
      scope: 'payment_processing',
      client_id: clientId
    });

  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({
      error: 'Authentication failed',
      message: 'An error occurred during authentication'
    });
  }
};