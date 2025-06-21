// Simple test script to verify Axis AI functionality
const http = require('http');

console.log('Testing Axis Thorn LLC Website...\n');

// Test configuration
const tests = [
  {
    name: 'Homepage Load Test',
    url: 'http://localhost:3000/',
    checks: [
      { contains: 'Axis Thorn', description: 'Company name present' },
      { contains: 'Axis AI', description: 'Axis AI in navigation' },
      { contains: 'INTRODUCING AXIS AI', description: 'Axis AI showcase section' },
      { contains: 'Next-Generation AI', description: 'AI showcase title' }
    ]
  },
  {
    name: 'Axis AI Page Test',
    url: 'http://localhost:3000/axis-ai.html',
    checks: [
      { contains: 'AXIS AI', description: 'Axis AI branding' },
      { contains: 'Welcome to Axis AI', description: 'Chat welcome message' },
      { contains: 'Financial Analysis', description: 'AI capability listed' },
      { contains: 'chatForm', description: 'Chat form present' },
      { contains: 'Powered by GPT-4 Financial', description: 'Model info shown' }
    ]
  },
  {
    name: 'No Emoji Test',
    url: 'http://localhost:3000/axis-ai.html',
    checks: [
      { notContains: '🧠', description: 'No brain emoji' },
      { notContains: '📊', description: 'No chart emoji' },
      { notContains: '⚡', description: 'No lightning emoji' },
      { notContains: '🔒', description: 'No lock emoji' }
    ]
  }
];

// Run tests
async function runTests() {
  let totalTests = 0;
  let passedTests = 0;

  for (const test of tests) {
    console.log(`\n=== ${test.name} ===`);
    console.log(`URL: ${test.url}`);
        
    try {
      const html = await fetchPage(test.url);
            
      for (const check of test.checks) {
        totalTests++;
        let passed = false;
                
        if (check.contains) {
          passed = html.includes(check.contains);
        } else if (check.notContains) {
          passed = !html.includes(check.notContains);
        }
                
        if (passed) {
          passedTests++;
          console.log(`✅ ${check.description}`);
        } else {
          console.log(`❌ ${check.description}`);
        }
      }
    } catch (error) {
      console.log(`❌ Failed to load page: ${error.message}`);
    }
  }

  console.log('\n=== Test Summary ===');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Run the tests
runTests();