// Consolidated API Router - All endpoints in one file for Vercel Hobby plan
import { parse } from 'url';

// Import all route handlers
import healthHandler from '../lib/api/health.js';
import statusHandler from '../lib/api/status.js';
import contactHandler from '../lib/api/contact.js';
import authHandlers from '../lib/api/auth/index.js';
import adminHandlers from '../lib/api/admin/index.js';
import documentsHandler from '../lib/api/documents.js';
import invoicesHandler from '../lib/api/invoices.js';
import paymentsHandler from '../lib/api/payments.js';
import webhooksHandler from '../lib/api/webhooks.js';

// Route configuration
const routes = {
  // Health & Status
  '/api/health': healthHandler,
  '/api/status': statusHandler,
  
  // Contact
  '/api/contact': contactHandler,
  
  // Authentication
  '/api/auth/login': authHandlers.login,
  '/api/auth/register': authHandlers.register,
  '/api/auth/refresh': authHandlers.refresh,
  '/api/auth/reset-password': authHandlers.resetPassword,
  
  // Admin
  '/api/admin/analytics': adminHandlers.analytics,
  '/api/admin/realtime': adminHandlers.realtime,
  '/api/admin/revenue': adminHandlers.revenue,
  '/api/admin/system': adminHandlers.system,
  
  // Documents
  '/api/documents': documentsHandler,
  
  // Invoices
  '/api/invoices': invoicesHandler,
  
  // Payments
  '/api/payment/create-intent': paymentsHandler.createIntent,
  '/api/payment/history': paymentsHandler.history,
  '/api/payment/links': paymentsHandler.links,
  
  // Webhooks
  '/api/webhooks/stripe': webhooksHandler.stripe,
};

// Main handler
export default async function handler(req, res) {
  const { pathname } = parse(req.url, true);
  
  // Find matching route
  const routeHandler = routes[pathname];
  
  if (routeHandler) {
    // Call the appropriate handler
    return routeHandler(req, res);
  }
  
  // Handle dynamic routes (with parameters)
  for (const [route, handler] of Object.entries(routes)) {
    // Check for document ID routes
    if (pathname.startsWith('/api/documents/') && route === '/api/documents') {
      req.documentId = pathname.split('/').pop();
      return handler(req, res);
    }
    
    // Check for invoice ID routes
    if (pathname.startsWith('/api/invoices/') && route === '/api/invoices') {
      req.invoiceId = pathname.split('/').pop();
      return handler(req, res);
    }
  }
  
  // 404 for unmatched routes
  res.status(404).json({
    error: 'Not Found',
    message: `API endpoint ${pathname} not found`,
    timestamp: new Date().toISOString()
  });
}

// Export config for Vercel
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    // Disable body parsing for webhooks that need raw body
    ...(process.env.DISABLE_BODY_PARSER && { bodyParser: false })
  },
};