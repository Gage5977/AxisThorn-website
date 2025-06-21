/**
 * API endpoint tests
 * Run with: node test-api.js
 */

const https = require('https');

const API_BASE = process.env.API_URL || 'https://axisthorn.com/api';

// Test utilities
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_BASE}${path}`);
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = https.request(url, options, (res) => {
      let body = '';
      
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            headers: res.headers,
            data: body ? JSON.parse(body) : null
          };
          resolve(response);
        } catch (err) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: body
          });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function runTests() {
  log('\n🚀 API Test Suite\n', 'blue');
  
  let passed = 0;
  let failed = 0;

  // Test 1: Ping endpoint
  try {
    log('Testing GET /ping... ', 'yellow');
    const res = await testEndpoint('GET', '/ping');
    
    if (res.status === 200 && res.data.message === 'pong') {
      log('✓ Ping successful', 'green');
      passed++;
    } else {
      throw new Error(`Unexpected response: ${JSON.stringify(res.data)}`);
    }
  } catch (err) {
    log(`✗ Ping failed: ${err.message}`, 'red');
    failed++;
  }

  // Test 2: Health check
  try {
    log('Testing GET /health... ', 'yellow');
    const res = await testEndpoint('GET', '/health');
    
    if (res.status === 200 || res.status === 503) {
      log(`✓ Health check returned ${res.data.status}`, 'green');
      if (res.data.database) {
        log(`  Database: ${res.data.database}`, 'blue');
      }
      passed++;
    } else {
      throw new Error(`Unexpected status: ${res.status}`);
    }
  } catch (err) {
    log(`✗ Health check failed: ${err.message}`, 'red');
    failed++;
  }

  // Test 3: Environment check
  try {
    log('Testing GET /env-check... ', 'yellow');
    const res = await testEndpoint('GET', '/env-check');
    
    if (res.status === 200) {
      log(`✓ Environment check: ${res.data.configured ? 'Configured' : 'Not configured'}`, 'green');
      
      if (!res.data.configured) {
        log('  Missing configurations:', 'yellow');
        if (!res.data.environment.stripe.secretKey) log('    - Stripe secret key', 'yellow');
        if (!res.data.environment.stripe.publishableKey) log('    - Stripe publishable key', 'yellow');
        if (!res.data.environment.jwt.secret) log('    - JWT secret', 'yellow');
      }
      passed++;
    } else {
      throw new Error(`Unexpected status: ${res.status}`);
    }
  } catch (err) {
    log(`✗ Environment check failed: ${err.message}`, 'red');
    failed++;
  }

  // Test 4: Create checkout session (will fail without Stripe keys)
  try {
    log('Testing POST /create-checkout-session... ', 'yellow');
    const res = await testEndpoint('POST', '/create-checkout-session', {
      priceId: 'price_test_123',
      customerEmail: 'test@example.com'
    });
    
    if (res.status === 500 && res.data.error === 'Stripe is not configured') {
      log('✓ Checkout endpoint exists (Stripe not configured)', 'green');
      passed++;
    } else if (res.status === 200) {
      log('✓ Checkout session created!', 'green');
      passed++;
    } else {
      throw new Error(`Unexpected response: ${JSON.stringify(res.data)}`);
    }
  } catch (err) {
    log(`✗ Checkout session failed: ${err.message}`, 'red');
    failed++;
  }

  // Test 5: CORS headers
  try {
    log('Testing CORS headers... ', 'yellow');
    const res = await testEndpoint('OPTIONS', '/ping');
    
    if (res.status === 200 || res.status === 204) {
      log('✓ CORS preflight successful', 'green');
      passed++;
    } else {
      throw new Error(`CORS preflight failed with status ${res.status}`);
    }
  } catch (err) {
    log(`✗ CORS test failed: ${err.message}`, 'red');
    failed++;
  }

  // Test 6: 404 handling
  try {
    log('Testing 404 handling... ', 'yellow');
    const res = await testEndpoint('GET', '/this-endpoint-does-not-exist');
    
    if (res.status === 404) {
      log('✓ 404 handled correctly', 'green');
      passed++;
    } else {
      throw new Error(`Expected 404, got ${res.status}`);
    }
  } catch (err) {
    log(`✗ 404 test failed: ${err.message}`, 'red');
    failed++;
  }

  // Summary
  log('\n📊 Test Summary:', 'blue');
  log(`✓ Passed: ${passed}`, 'green');
  log(`✗ Failed: ${failed}`, 'red');
  log(`Total: ${passed + failed}\n`);

  // Configuration status
  if (failed === 0) {
    log('🎉 All API tests passed!', 'green');
    log('\nNext steps:', 'blue');
    log('1. Add Stripe keys to Vercel environment variables');
    log('2. Configure JWT secret for authentication');
    log('3. Set up database connection (if using Prisma)');
  } else {
    log('⚠️  Some tests failed. Check the errors above.', 'yellow');
  }

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(err => {
  log(`\nTest suite error: ${err.message}`, 'red');
  process.exit(1);
});