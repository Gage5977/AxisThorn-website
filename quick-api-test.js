// Quick API test for all Prisma-backed endpoints
const http = require('http');

async function testAPI(path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3001${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ path, status: res.statusCode, count: json.data?.length || 0 });
        } catch {
          resolve({ path, status: res.statusCode, error: 'Invalid JSON' });
        }
      });
    }).on('error', (err) => {
      resolve({ path, error: err.message });
    });
  });
}

async function runTests() {
  console.log('🧪 Quick API Test\n');
  
  const endpoints = [
    '/api/v1/invoices',
    '/api/v1/customers', 
    '/api/v1/products',
    '/api/v1/payments'
  ];
  
  for (const endpoint of endpoints) {
    const result = await testAPI(endpoint);
    if (result.error) {
      console.log(`❌ ${endpoint}: ${result.error}`);
    } else {
      console.log(`✅ ${endpoint}: ${result.count} records`);
    }
  }
}

runTests();