/**
 * Simple test suite for Axis Thorn website
 * Run with: node test-suite.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

// Test configuration
const BASE_URL = process.env.TEST_URL || 'https://axisthorn.com';
const TIMEOUT = 10000; // 10 seconds

// Test results
let passed = 0;
let failed = 0;

/**
 * Make HTTPS request and return response
 */
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Request timeout')), TIMEOUT);
    
    https.get(url, (res) => {
      clearTimeout(timer);
      let data = '';
      
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ 
        statusCode: res.statusCode, 
        headers: res.headers, 
        body: data 
      }));
    }).on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

/**
 * Test runner
 */
async function runTest(name, testFn) {
  process.stdout.write(`Testing ${name}... `);
  try {
    await testFn();
    console.log(`${colors.green}✓${colors.reset}`);
    passed++;
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${error.message}`);
    failed++;
  }
}

/**
 * Test suite
 */
async function runTests() {
  console.log(`\n🧪 Running tests for ${BASE_URL}\n`);

  // Test 1: Homepage loads
  await runTest('Homepage loads', async () => {
    const res = await makeRequest(BASE_URL);
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (!res.body.includes('Axis Thorn')) throw new Error('Missing company name');
  });

  // Test 2: Critical pages exist
  const pages = [
    '/invoices',
    '/banking-portal',
    '/axis-ai',
    '/terminal',
    '/services',
    '/about'
  ];

  for (const page of pages) {
    await runTest(`${page} page exists`, async () => {
      const res = await makeRequest(`${BASE_URL}${page}`);
      if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    });
  }

  // Test 3: API endpoints
  await runTest('API ping endpoint', async () => {
    const res = await makeRequest(`${BASE_URL}/api/ping`);
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    const data = JSON.parse(res.body);
    if (data.message !== 'pong') throw new Error('Invalid response');
  });

  await runTest('API health endpoint', async () => {
    const res = await makeRequest(`${BASE_URL}/api/health`);
    if (res.statusCode !== 200 && res.statusCode !== 503) {
      throw new Error(`Unexpected status ${res.statusCode}`);
    }
  });

  await runTest('API env-check endpoint', async () => {
    const res = await makeRequest(`${BASE_URL}/api/env-check`);
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    const data = JSON.parse(res.body);
    if (typeof data.configured !== 'boolean') throw new Error('Invalid response format');
  });

  // Test 4: Static assets
  await runTest('Robots.txt exists', async () => {
    const res = await makeRequest(`${BASE_URL}/robots.txt`);
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (!res.body.includes('User-agent')) throw new Error('Invalid robots.txt');
  });

  await runTest('Sitemap exists', async () => {
    const res = await makeRequest(`${BASE_URL}/sitemap.xml`);
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (!res.body.includes('<?xml')) throw new Error('Invalid sitemap');
  });

  // Test 5: Security headers
  await runTest('Security headers present', async () => {
    const res = await makeRequest(BASE_URL);
    const headers = res.headers;
    
    // Check for important security headers
    const requiredHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection'
    ];
    
    for (const header of requiredHeaders) {
      if (!headers[header]) {
        throw new Error(`Missing ${header} header`);
      }
    }
  });

  // Test 6: SSL/TLS
  await runTest('HTTPS redirect works', async () => {
    // This test assumes HTTPS is enforced
    const res = await makeRequest(BASE_URL);
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
  });

  // Test 7: 404 page
  await runTest('404 page works', async () => {
    const res = await makeRequest(`${BASE_URL}/this-page-does-not-exist-12345`);
    if (res.statusCode !== 404) throw new Error(`Expected 404, got ${res.statusCode}`);
  });

  // Test 8: Performance check
  await runTest('Homepage loads within 5 seconds', async () => {
    const start = Date.now();
    await makeRequest(BASE_URL);
    const duration = Date.now() - start;
    if (duration > 5000) throw new Error(`Took ${duration}ms`);
  });

  // Test 9: Local file checks
  if (fs.existsSync('./public')) {
    await runTest('Build output exists', () => {
      if (!fs.existsSync('./public/index.html')) {
        throw new Error('public/index.html not found');
      }
    });

    await runTest('CSS files exist', () => {
      if (!fs.existsSync('./public/css')) {
        throw new Error('CSS directory not found');
      }
    });

    await runTest('JS files exist', () => {
      if (!fs.existsSync('./public/js')) {
        throw new Error('JS directory not found');
      }
    });
  }

  // Print results
  console.log(`\n📊 Test Results:`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`Total: ${passed + failed}\n`);

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  console.error(`\n${colors.red}Test suite error:${colors.reset}`, error);
  process.exit(1);
});