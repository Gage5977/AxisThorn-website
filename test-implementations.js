#!/usr/bin/env node

// Test script to verify implementations
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Axis Thorn Website Implementations\n');

// Test results tracker
const results = {
  passed: 0,
  failed: 0,
  warnings: 0
};

// Helper function to test file existence
function testFileExists(filePath, description) {
  const exists = fs.existsSync(path.join(__dirname, filePath));
  if (exists) {
    console.log(`✅ ${description}: ${filePath}`);
    results.passed++;
  } else {
    console.log(`❌ ${description}: ${filePath} - FILE NOT FOUND`);
    results.failed++;
  }
  return exists;
}

// Helper function to test file content
function testFileContent(filePath, searchString, description) {
  try {
    const content = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
    if (content.includes(searchString)) {
      console.log(`✅ ${description}`);
      results.passed++;
      return true;
    } 
    console.log(`❌ ${description} - NOT FOUND IN FILE`);
    results.failed++;
    return false;
    
  } catch (error) {
    console.log(`❌ ${description} - ERROR: ${error.message}`);
    results.failed++;
    return false;
  }
}

// Test JSON validity
function testJSONValid(filePath, description) {
  try {
    const content = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
    JSON.parse(content);
    console.log(`✅ ${description}: Valid JSON`);
    results.passed++;
    return true;
  } catch (error) {
    console.log(`❌ ${description}: Invalid JSON - ${error.message}`);
    results.failed++;
    return false;
  }
}

console.log('1️⃣  Testing Security Middleware Files\n');
testFileExists('api/middleware/security.js', 'Security middleware');
testFileExists('api/middleware/validation.js', 'Validation middleware');
testFileExists('api/utils/handler-wrapper.js', 'Handler wrapper');

console.log('\n2️⃣  Testing API Versioning\n');
testFileExists('api/v1/index.js', 'API v1 router');
testFileExists('api/router.js', 'Main API router');
testFileExists('API_VERSIONING_GUIDE.md', 'API versioning documentation');

console.log('\n3️⃣  Testing Updated API Endpoints\n');
if (testFileExists('api/invoices/index.js', 'Invoices API')) {
  testFileContent('api/invoices/index.js', 'withMiddleware', 'Invoices API uses security middleware');
  testFileContent('api/invoices/index.js', 'validate', 'Invoices API has validation');
  testFileContent('api/invoices/index.js', 'rateLimiters', 'Invoices API has rate limiting');
}

console.log('\n4️⃣  Testing Code Quality Configuration\n');
if (testFileExists('.eslintrc.json', 'ESLint configuration')) {
  testJSONValid('.eslintrc.json', 'ESLint config');
}
if (testFileExists('.prettierrc.json', 'Prettier configuration')) {
  testJSONValid('.prettierrc.json', 'Prettier config');
}
testFileExists('.prettierignore', 'Prettier ignore file');

console.log('\n5️⃣  Testing Client-Side Updates\n');
testFileExists('public/js/api-config.js', 'API configuration');
testFileExists('public/js/shared-navigation.js', 'Shared navigation component');

console.log('\n6️⃣  Testing Navigation Implementation\n');
const pagesToTest = [
  { file: 'public/index.html', name: 'Homepage' },
  { file: 'public/terminal.html', name: 'Terminal page' },
  { file: 'public/axis-ai.html', name: 'Axis AI page' },
  { file: 'public/invoices.html', name: 'Invoices page' },
  { file: 'public/banking-portal.html', name: 'Banking portal' }
];

pagesToTest.forEach(page => {
  if (fs.existsSync(path.join(__dirname, page.file))) {
    testFileContent(page.file, 'shared-navigation.js', `${page.name} includes shared navigation`);
  }
});

console.log('\n7️⃣  Testing Package.json Updates\n');
if (testFileExists('package.json', 'Package.json')) {
  testFileContent('package.json', 'helmet', 'Helmet dependency added');
  testFileContent('package.json', 'joi', 'Joi dependency added');
  testFileContent('package.json', 'express-rate-limit', 'Rate limit dependency added');
  testFileContent('package.json', 'winston', 'Winston logger dependency added');
  testFileContent('package.json', 'lint:fix', 'ESLint fix script added');
  testFileContent('package.json', 'format', 'Prettier format script added');
}

console.log('\n8️⃣  Testing API Endpoint Structure\n');
// Test that API endpoints are using versioned structure
if (testFileExists('public/js/stripe-payment.js', 'Stripe payment JS')) {
  testFileContent('public/js/stripe-payment.js', '/api/v1/stripe-payment', 'Stripe API uses v1 endpoint');
}

console.log('\n9️⃣  Checking for Common Issues\n');
// Check for any remaining unrestricted CORS
const filesToCheckCORS = ['api/invoices/index.js', 'api/customers/index.js', 'api/products/index.js'];
filesToCheckCORS.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
    if (content.includes('\'*\'') && content.includes('Access-Control-Allow-Origin')) {
      console.log(`⚠️  Warning: ${file} may still have unrestricted CORS`);
      results.warnings++;
    }
  }
});

// Summary
console.log('\n📊 Test Summary:\n');
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`⚠️  Warnings: ${results.warnings}`);
console.log(`\nTotal Tests: ${results.passed + results.failed}`);

if (results.failed === 0) {
  console.log('\n🎉 All tests passed! The implementations appear to be correctly in place.');
} else {
  console.log('\n⚠️  Some tests failed. Please review the output above.');
}

// Create a test report
const report = {
  timestamp: new Date().toISOString(),
  results: results,
  summary: {
    security_middleware: testFileExists('api/middleware/security.js', '') ? 'implemented' : 'missing',
    validation: testFileExists('api/middleware/validation.js', '') ? 'implemented' : 'missing',
    api_versioning: testFileExists('api/v1/index.js', '') ? 'implemented' : 'missing',
    code_quality: testFileExists('.eslintrc.json', '') ? 'configured' : 'missing',
    navigation_consistency: testFileExists('public/js/shared-navigation.js', '') ? 'implemented' : 'missing'
  }
};

fs.writeFileSync(
  path.join(__dirname, 'test-report.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n📄 Test report saved to test-report.json');

process.exit(results.failed > 0 ? 1 : 0);