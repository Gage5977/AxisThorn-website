// Comprehensive smoke tests for Axis Thorn website and API
const http = require('http');

const BASE_URL = 'http://localhost:3001';

async function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SmokeTest/1.0'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: body,
          data: body ? (() => {
            try { return JSON.parse(body); } catch { return body; }
          })() : null
        });
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function runSmokeTests() {
  console.log('🧪 Running Comprehensive Smoke Tests for Axis Thorn\n');
  
  const tests = [
    {
      name: 'Main Website',
      path: '/',
      expectedStatus: 200,
      checks: [(res) => res.body.includes('Axis Thorn')]
    },
    {
      name: 'API v1 Status',
      path: '/api/v1',
      expectedStatus: 200,
      checks: [(res) => res.data && res.data.status === 'ok']
    },
    {
      name: 'Get All Invoices (Prisma)',
      path: '/api/v1/invoices',
      expectedStatus: 200,
      checks: [
        (res) => res.data && Array.isArray(res.data.data),
        (res) => res.data.data.length > 0,
        (res) => res.data.pagination && typeof res.data.pagination.total === 'number'
      ]
    },
    {
      name: 'Get Single Invoice',
      path: '/api/v1/invoices?id=test-id',
      expectedStatus: [200, 404], // 404 is acceptable for test ID
      checks: []
    },
    {
      name: 'Security Headers Check',
      path: '/api/v1/invoices',
      expectedStatus: 200,
      checks: [
        (res) => res.headers['x-content-type-options'] === 'nosniff',
        (res) => res.headers['x-frame-options'] === 'DENY',
        (res) => res.headers['x-xss-protection'] === '1; mode=block'
      ]
    },
    {
      name: 'CORS Headers',
      path: '/api/v1/invoices',
      expectedStatus: 200,
      checks: [
        (res) => res.headers['access-control-allow-origin'] !== undefined
      ]
    },
    {
      name: 'Portal Page',
      path: '/invoices',
      expectedStatus: 200,
      checks: [(res) => res.body.includes('html')]
    },
    {
      name: 'Navigation Update Check',
      path: '/',
      expectedStatus: 200,
      checks: [(res) => res.body.includes('Portal')]
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`🔍 Testing: ${test.name}`);
      const response = await makeRequest(test.path);
      
      // Check status code
      const expectedStatuses = Array.isArray(test.expectedStatus) 
        ? test.expectedStatus 
        : [test.expectedStatus];
      
      if (!expectedStatuses.includes(response.status)) {
        console.log(`   ❌ Status code mismatch. Expected: ${test.expectedStatus}, Got: ${response.status}`);
        failed++;
        continue;
      }

      // Run custom checks
      let checksPassed = true;
      for (const check of test.checks) {
        try {
          if (!check(response)) {
            checksPassed = false;
            break;
          }
        } catch (error) {
          console.log(`   ❌ Check failed: ${error.message}`);
          checksPassed = false;
          break;
        }
      }

      if (checksPassed) {
        console.log(`   ✅ Passed`);
        passed++;
      } else {
        console.log(`   ❌ Custom checks failed`);
        failed++;
      }

    } catch (error) {
      console.log(`   ❌ Request failed: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Test Results:`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

  if (failed === 0) {
    console.log(`\n🎉 All smoke tests passed! System is ready for deployment.`);
  } else {
    console.log(`\n⚠️  Some tests failed. Please review before deployment.`);
  }

  // Test PDF generation endpoint
  try {
    console.log(`\n🔍 Testing PDF Generation...`);
    const invoicesResponse = await makeRequest('/api/v1/invoices');
    if (invoicesResponse.data && invoicesResponse.data.data.length > 0) {
      const firstInvoice = invoicesResponse.data.data[0];
      const pdfResponse = await makeRequest(`/api/invoices/pdf?id=${firstInvoice.id}`);
      
      if (pdfResponse.status === 200 && pdfResponse.headers['content-type'] === 'application/pdf') {
        console.log(`   ✅ PDF generation working`);
      } else {
        console.log(`   ❌ PDF generation failed. Status: ${pdfResponse.status}`);
      }
    } else {
      console.log(`   ⚠️  No invoices found for PDF test`);
    }
  } catch (error) {
    console.log(`   ❌ PDF test error: ${error.message}`);
  }

  return { passed, failed };
}

runSmokeTests().catch(console.error);