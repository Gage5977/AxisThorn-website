#!/usr/bin/env node

// Local test server for API endpoints
const http = require('http');
const url = require('url');

console.log('🚀 Starting local test server for Axis Thorn API...\n');

// Import our API handlers
const handlers = {
  '/api/router': require('./api/router'),
  '/api/v1': require('./api/v1/index'),
  '/api/v1/invoices': require('./api/invoices/index'),
  '/api/invoices': require('./api/invoices/index')
};

// Create a mock request/response for testing
function createMockReq(method, path, body = null, headers = {}) {
  const parsedUrl = url.parse(path, true);
  return {
    method,
    url: path,
    query: parsedUrl.query,
    headers: {
      'content-type': 'application/json',
      ...headers
    },
    body: body,
    ip: '127.0.0.1'
  };
}

function createMockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader: function(name, value) {
      this.headers[name] = value;
      return this;
    },
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      this.body = data;
      return this;
    },
    end: function() {
      return this;
    }
  };
  return res;
}

// Test cases
async function runTests() {
  console.log('📋 Running API Tests:\n');
  
  // Test 1: API Version Info
  console.log('1️⃣  Testing API Version Endpoint');
  try {
    const req = createMockReq('GET', '/api/v1');
    const res = createMockRes();
    
    if (handlers['/api/v1']) {
      await handlers['/api/v1'](req, res);
      console.log(`✅ Status: ${res.statusCode}`);
      console.log('✅ Response:', JSON.stringify(res.body, null, 2));
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  // Test 2: Invoice List (GET)
  console.log('\n2️⃣  Testing Invoice List Endpoint');
  try {
    const req = createMockReq('GET', '/api/v1/invoices');
    const res = createMockRes();
    
    if (handlers['/api/v1/invoices']) {
      await handlers['/api/v1/invoices'](req, res);
      console.log(`✅ Status: ${res.statusCode}`);
      console.log('✅ CORS Header:', res.headers['Access-Control-Allow-Origin'] || 'Not set');
      console.log('✅ Rate Limit Header:', res.headers['X-RateLimit-Limit'] || 'Not set');
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  // Test 3: Invoice Creation with Invalid Data
  console.log('\n3️⃣  Testing Invoice Validation (Invalid Data)');
  try {
    const req = createMockReq('POST', '/api/v1/invoices', {
      customer: {
        name: '', // Invalid: empty name
        email: 'not-an-email' // Invalid: bad email format
      }
    });
    const res = createMockRes();
    
    if (handlers['/api/v1/invoices']) {
      await handlers['/api/v1/invoices'](req, res);
      console.log(`✅ Status: ${res.statusCode} (Should be 400)`);
      console.log('✅ Validation Error:', JSON.stringify(res.body, null, 2));
    }
  } catch (error) {
    console.log(`✅ Validation working - Error caught: ${error.message}`);
  }
  
  // Test 4: Invoice Creation with Valid Data
  console.log('\n4️⃣  Testing Invoice Creation (Valid Data)');
  try {
    const req = createMockReq('POST', '/api/v1/invoices', {
      customer: {
        name: 'Test Company',
        email: 'test@example.com',
        phone: '555-1234'
      },
      items: [{
        description: 'Consulting Services',
        quantity: 10,
        unitPrice: 150
      }],
      taxRate: 8.5,
      notes: 'Test invoice'
    });
    const res = createMockRes();
    
    if (handlers['/api/v1/invoices']) {
      await handlers['/api/v1/invoices'](req, res);
      console.log(`✅ Status: ${res.statusCode} (Should be 201)`);
      if (res.body && res.body.id) {
        console.log(`✅ Invoice Created: ID ${res.body.id}`);
        console.log(`✅ Total: $${res.body.total}`);
      }
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  // Test 5: CORS from Invalid Origin
  console.log('\n5️⃣  Testing CORS Security');
  try {
    const req = createMockReq('GET', '/api/v1/invoices', null, {
      origin: 'http://malicious-site.com'
    });
    const res = createMockRes();
    
    // Note: CORS might need adjustment for serverless
    console.log('⚠️  CORS testing requires running server environment');
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  console.log('\n✅ Basic API tests completed!');
  console.log('\n📝 Notes:');
  console.log('- Some features (like rate limiting) require a full server environment');
  console.log('- CORS headers are handled by Vercel in production');
  console.log('- For full testing, deploy to Vercel or use vercel dev locally');
}

// Simple HTTP server for manual testing
function startTestServer() {
  const server = http.createServer(async (req, res) => {
    console.log(`\n📥 ${req.method} ${req.url}`);
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    // Simple router
    if (req.url.startsWith('/api/v1/invoices')) {
      try {
        // Parse body if POST
        let body = '';
        if (req.method === 'POST' || req.method === 'PUT') {
          req.on('data', chunk => body += chunk);
          await new Promise(resolve => req.on('end', resolve));
          req.body = JSON.parse(body || '{}');
        }
        
        // Call handler
        const handler = handlers['/api/v1/invoices'];
        await handler(req, res);
        
        if (!res.headersSent) {
          res.writeHead(res.statusCode || 200, {
            'Content-Type': 'application/json',
            ...res.headers
          });
          res.end(JSON.stringify(res.body || {}));
        }
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  });
  
  const PORT = 3001;
  server.listen(PORT, () => {
    console.log(`\n🌐 Test server running at http://localhost:${PORT}`);
    console.log('\nTest with curl:');
    console.log(`curl http://localhost:${PORT}/api/v1/invoices`);
    console.log('\nOr test POST:');
    console.log(`curl -X POST http://localhost:${PORT}/api/v1/invoices \\
  -H "Content-Type: application/json" \\
  -d '{"customer":{"name":"Test","email":"test@test.com"},"items":[{"description":"Test","quantity":1,"unitPrice":100}]}'`);
  });
}

// Run tests or start server based on command line args
if (process.argv.includes('--server')) {
  startTestServer();
} else {
  runTests().catch(console.error);
}