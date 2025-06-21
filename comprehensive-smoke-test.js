#!/usr/bin/env node

const http = require('http');
const https = require('https');

// Configuration
const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const isHTTPS = BASE_URL.startsWith('https');
const httpModule = isHTTPS ? https : http;

// Test credentials
const TEST_ACCESS_CODE = 'DEMO-2025-AXIS';
const TEST_EMAIL = 'demo@axisthorn.com';
const TEST_PASSWORD = 'demo123';

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

// Helper functions
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = httpModule.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = {
            status: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null
          };
          resolve(result);
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });
    
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function test(name, fn) {
  try {
    await fn();
    console.log(`${colors.green}✓${colors.reset} ${name}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${name}`);
    console.log(`  ${colors.red}${error.message}${colors.reset}`);
    return false;
  }
}

// Parse URL
const url = new URL(BASE_URL);
const baseOptions = {
  hostname: url.hostname,
  port: url.port || (isHTTPS ? 443 : 80),
  headers: {
    'Content-Type': 'application/json'
  }
};

// Test suites
async function runTests() {
  console.log('\\n🧪 Running Comprehensive Smoke Tests\\n');
  console.log(`Base URL: ${BASE_URL}\\n`);
  
  let passCount = 0;
  let totalTests = 0;
  let authToken = '';

  // 1. Basic connectivity
  totalTests++;
  if (await test('Health check endpoint', async () => {
    const res = await makeRequest({
      ...baseOptions,
      path: '/api/health',
      method: 'GET'
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  })) passCount++;

  // 2. API version info
  totalTests++;
  if (await test('API version endpoint', async () => {
    const res = await makeRequest({
      ...baseOptions,
      path: '/api/v1',
      method: 'GET'
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.body.version) throw new Error('Missing version info');
  })) passCount++;

  // 3. Authentication flow
  totalTests++;
  if (await test('User login', async () => {
    const res = await makeRequest({
      ...baseOptions,
      path: '/api/v1/auth/login',
      method: 'POST'
    }, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.body.token) throw new Error('No token received');
    authToken = res.body.token;
  })) passCount++;

  // 4. Protected endpoint with JWT
  totalTests++;
  if (await test('Access protected endpoint with JWT', async () => {
    const res = await makeRequest({
      ...baseOptions,
      path: '/api/v1/invoices',
      method: 'GET',
      headers: {
        ...baseOptions.headers,
        'Authorization': `Bearer ${authToken}`
      }
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  })) passCount++;

  // 5. Access code validation
  totalTests++;
  if (await test('Validate access code', async () => {
    const res = await makeRequest({
      ...baseOptions,
      path: '/api/v1/access-codes?action=validate',
      method: 'POST',
      headers: {
        ...baseOptions.headers,
        'Authorization': `Bearer ${authToken}`
      }
    }, {
      code: TEST_ACCESS_CODE
    });
    if (res.status !== 200 && res.status !== 403) {
      throw new Error(`Expected 200 or 403, got ${res.status}`);
    }
  })) passCount++;

  // 6. Access exclusive content with code
  totalTests++;
  if (await test('Access exclusive content with valid code', async () => {
    const res = await makeRequest({
      ...baseOptions,
      path: '/api/v1/exclusive',
      method: 'GET',
      headers: {
        ...baseOptions.headers,
        'X-Access-Code': TEST_ACCESS_CODE
      }
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.body.access || res.body.access !== 'granted') {
      throw new Error('Access not granted');
    }
  })) passCount++;

  // 7. Test rate limiting on access codes
  totalTests++;
  if (await test('Rate limiting on access code attempts', async () => {
    const invalidCode = 'XXXX-XXXX-XXXX';
    let rateLimited = false;
    
    // Make 6 attempts (limit is 5 per minute)
    for (let i = 0; i < 6; i++) {
      const res = await makeRequest({
        ...baseOptions,
        path: '/api/v1/exclusive',
        method: 'GET',
        headers: {
          ...baseOptions.headers,
          'X-Access-Code': invalidCode
        }
      });
      
      if (res.status === 429) {
        rateLimited = true;
        break;
      }
    }
    
    if (!rateLimited) {
      throw new Error('Rate limiting not triggered after 6 attempts');
    }
  })) passCount++;

  // 8. Test CORS headers
  totalTests++;
  if (await test('CORS headers present', async () => {
    const res = await makeRequest({
      ...baseOptions,
      path: '/api/v1',
      method: 'OPTIONS',
      headers: {
        ...baseOptions.headers,
        'Origin': 'https://axisthorn.com'
      }
    });
    if (!res.headers['access-control-allow-origin']) {
      throw new Error('CORS headers missing');
    }
  })) passCount++;

  // 9. Static file serving
  totalTests++;
  if (await test('Static files accessible', async () => {
    const res = await makeRequest({
      ...baseOptions,
      path: '/invite.html',
      method: 'GET',
      headers: {}
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  })) passCount++;

  // 10. Invalid access code rejection
  totalTests++;
  if (await test('Invalid access code rejected', async () => {
    const res = await makeRequest({
      ...baseOptions,
      path: '/api/v1/exclusive',
      method: 'GET',
      headers: {
        ...baseOptions.headers,
        'X-Access-Code': 'INVALID-CODE-HERE'
      }
    });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  })) passCount++;

  // Summary
  console.log(`\\n📊 Test Summary: ${passCount}/${totalTests} passed\\n`);
  
  if (passCount === totalTests) {
    console.log(`${colors.green}✅ All tests passed!${colors.reset}\\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}❌ ${totalTests - passCount} tests failed${colors.reset}\\n`);
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});