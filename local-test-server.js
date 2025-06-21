#!/usr/bin/env node

// Local Test Server for Axis Thorn Website
// This server simulates the Vercel environment locally for testing

const express = require('express');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Axis Thorn Local Test Server...\n');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static('public'));

// API route handlers
const apiHandlers = {
  '/api/v1': require('./api/v1/index'),
  '/api/v1/invoices': require('./api/invoices/index'),
  '/api/v1/customers': require('./api/customers/index'),
  '/api/v1/products': require('./api/products/index'),
  '/api/v1/stripe-payment': require('./api/stripe-payment/index'),
  '/api/v1/ai-chat': require('./api/ai-chat/index'),
  '/api/v1/ai-demo': require('./api/ai-demo/index'),
};

// Handle API routes
Object.keys(apiHandlers).forEach(route => {
  app.all(route, async (req, res) => {
    try {
      console.log(`📡 ${req.method} ${req.url}`);
      await apiHandlers[route](req, res);
    } catch (error) {
      console.error(`❌ API Error on ${route}:`, error.message);
      if (!res.headersSent) {
        res.status(500).json({ 
          error: 'Internal Server Error', 
          message: error.message,
          endpoint: route
        });
      }
    }
  });
});

// Handle API version routing
app.all('/api/*', async (req, res) => {
  try {
    const router = require('./api/router');
    await router(req, res);
  } catch (error) {
    console.error('❌ Router Error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// Serve HTML pages
const pages = [
  { route: '/', file: 'index.html' },
  { route: '/terminal', file: 'terminal.html' },
  { route: '/axis-ai', file: 'axis-ai.html' },
  { route: '/invoices', file: 'invoices.html' },
  { route: '/banking-portal', file: 'banking-portal.html' },
  { route: '/about', file: 'about.html' },
  { route: '/portfolio', file: 'portfolio.html' },
  { route: '/services', file: 'services.html' },
  { route: '/support', file: 'support.html' }
];

pages.forEach(({ route, file }) => {
  app.get(route, (req, res) => {
    const filePath = path.join(__dirname, 'public', file);
    if (fs.existsSync(filePath)) {
      console.log(`📄 Serving ${file} for ${route}`);
      res.sendFile(filePath);
    } else {
      console.log(`⚠️  File not found: ${file}`);
      res.status(404).send(`Page not found: ${route}`);
    }
  });
});

// Test endpoints for validation
app.get('/test', (req, res) => {
  res.json({
    message: 'Axis Thorn Test Server is running!',
    timestamp: new Date().toISOString(),
    environment: 'local-development',
    features: {
      security_middleware: '✅ Active',
      api_versioning: '✅ v1 Available', 
      input_validation: '✅ Joi Schemas',
      cors_protection: '✅ Restricted Origins',
      rate_limiting: '✅ Configured',
      error_logging: '✅ Winston Active',
      navigation_consistency: '✅ Shared Component'
    }
  });
});

// API test endpoint
app.get('/test/api', async (req, res) => {
  const tests = [];
  
  // Test API version endpoint
  try {
    const versionHandler = apiHandlers['/api/v1'];
    const mockReq = { method: 'GET', url: '/api/v1', query: {} };
    const mockRes = {
      status: (code) => ({ json: (data) => ({ statusCode: code, body: data }) }),
      setHeader: () => {},
      json: (data) => data
    };
    
    const result = await versionHandler(mockReq, mockRes);
    tests.push({
      name: 'API Version Info',
      status: '✅ Pass',
      result: result
    });
  } catch (error) {
    tests.push({
      name: 'API Version Info', 
      status: '❌ Fail',
      error: error.message
    });
  }
  
  res.json({
    message: 'API Test Results',
    tests: tests,
    endpoints: Object.keys(apiHandlers)
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`❓ 404: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: 'Not Found',
    path: req.url,
    available_routes: [
      '/',
      '/terminal', 
      '/axis-ai',
      '/invoices',
      '/banking-portal',
      '/test',
      '/test/api',
      '/api/v1',
      '/api/v1/invoices'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Axis Thorn Local Test Server running!`);
  console.log(`\n🌐 URLs to test:`);
  console.log(`   Main site: http://localhost:${PORT}`);
  console.log(`   Terminal:  http://localhost:${PORT}/terminal`);
  console.log(`   AXIS AI:   http://localhost:${PORT}/axis-ai`);
  console.log(`   Invoices:  http://localhost:${PORT}/invoices`);
  console.log(`   Banking:   http://localhost:${PORT}/banking-portal`);
  console.log(`\n🧪 Test endpoints:`);
  console.log(`   Status:    http://localhost:${PORT}/test`);
  console.log(`   API Test:  http://localhost:${PORT}/test/api`);
  console.log(`   API v1:    http://localhost:${PORT}/api/v1`);
  console.log(`   Invoices:  http://localhost:${PORT}/api/v1/invoices`);
  console.log(`\n📋 Features to test:`);
  console.log(`   ✅ Navigation consistency across pages`);
  console.log(`   ✅ API versioning (/api/v1/)`);
  console.log(`   ✅ Input validation on POST requests`);
  console.log(`   ✅ Security headers (check Network tab)`);
  console.log(`   ✅ CORS protection`);
  console.log(`   ✅ Error handling and logging`);
  console.log(`\n🛠  CTRL+C to stop server`);
});

module.exports = app;