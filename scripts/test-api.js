#!/usr/bin/env node

/**
 * API Testing Script
 * Tests all API endpoints to ensure they're working correctly
 */

import fetch from 'node-fetch';
import chalk from 'chalk';

// Get base URL from environment or use production
const BASE_URL = process.env.API_URL || 'https://axisthorn.com';

console.log(chalk.blue.bold('🧪 Axis Thorn API Testing Suite\n'));
console.log(`Testing against: ${BASE_URL}\n`);

const tests = {
    passed: 0,
    failed: 0,
    skipped: 0
};

// Test helper
async function testEndpoint(method, path, options = {}) {
    const { body, headers = {}, expectedStatus = 200, description, requiresAuth = false } = options;
    
    if (requiresAuth && !process.env.TEST_JWT_TOKEN) {
        console.log(chalk.yellow(`⏭️  SKIPPED: ${description || path} (requires authentication)`));
        tests.skipped++;
        return null;
    }
    
    try {
        console.log(chalk.cyan(`Testing: ${method} ${path}`));
        if (description) console.log(`  ${description}`);
        
        const response = await fetch(`${BASE_URL}${path}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(requiresAuth && { 'Authorization': `Bearer ${process.env.TEST_JWT_TOKEN}` }),
                ...headers
            },
            ...(body && { body: JSON.stringify(body) })
        });
        
        const data = await response.json().catch(() => null);
        
        if (response.status === expectedStatus) {
            console.log(chalk.green(`  ✅ PASSED (${response.status} ${response.statusText})`));
            tests.passed++;
            return { success: true, data, response };
        } else {
            console.log(chalk.red(`  ❌ FAILED - Expected ${expectedStatus}, got ${response.status}`));
            if (data) console.log(`     Response: ${JSON.stringify(data, null, 2)}`);
            tests.failed++;
            return { success: false, data, response };
        }
    } catch (error) {
        console.log(chalk.red(`  ❌ FAILED - ${error.message}`));
        tests.failed++;
        return { success: false, error };
    }
    
    console.log('');
}

// Run tests
async function runTests() {
    console.log(chalk.bold('1️⃣ Public Endpoints\n'));
    
    // Health check
    await testEndpoint('GET', '/api/health', {
        description: 'Health check endpoint'
    });
    
    // Status
    await testEndpoint('GET', '/api/status', {
        description: 'Service status endpoint'
    });
    
    // Contact form
    await testEndpoint('POST', '/api/contact', {
        description: 'Contact form submission',
        body: {
            name: 'Test User',
            email: 'test@example.com',
            company: 'Test Company',
            type: 'general',
            message: 'This is a test message from the API testing script'
        }
    });
    
    console.log(chalk.bold('\n2️⃣ Authentication Endpoints\n'));
    
    // Register
    const timestamp = Date.now();
    const registerResult = await testEndpoint('POST', '/api/auth/register', {
        description: 'User registration',
        body: {
            email: `test${timestamp}@example.com`,
            password: 'TestPass123!',
            name: 'Test User',
            company: 'Test Co'
        },
        expectedStatus: 201
    });
    
    let authToken = null;
    if (registerResult?.success && registerResult.data?.tokens?.accessToken) {
        authToken = registerResult.data.tokens.accessToken;
        console.log(chalk.gray(`  Got auth token: ${authToken.substring(0, 20)}...`));
    }
    
    // Login
    await testEndpoint('POST', '/api/auth/login', {
        description: 'User login',
        body: {
            email: `test${timestamp}@example.com`,
            password: 'TestPass123!'
        }
    });
    
    // Password reset
    await testEndpoint('POST', '/api/auth/reset-password', {
        description: 'Password reset request',
        body: {
            email: `test${timestamp}@example.com`
        }
    });
    
    console.log(chalk.bold('\n3️⃣ Protected Endpoints\n'));
    
    // Set auth token for protected endpoints
    if (authToken) {
        process.env.TEST_JWT_TOKEN = authToken;
    }
    
    // Documents
    await testEndpoint('GET', '/api/documents', {
        description: 'List documents',
        requiresAuth: true
    });
    
    // Invoices
    await testEndpoint('GET', '/api/invoices', {
        description: 'List invoices',
        requiresAuth: true
    });
    
    // Payment history
    await testEndpoint('GET', '/api/payment/history', {
        description: 'Payment history',
        requiresAuth: true
    });
    
    console.log(chalk.bold('\n4️⃣ Admin Endpoints\n'));
    
    // Admin endpoints (will fail without admin token)
    await testEndpoint('GET', '/api/admin/analytics', {
        description: 'Admin analytics',
        requiresAuth: true,
        expectedStatus: 403 // Expect forbidden for non-admin
    });
    
    console.log(chalk.bold('\n5️⃣ Webhook Endpoints\n'));
    
    // Stripe webhook (without signature)
    await testEndpoint('POST', '/api/webhooks/stripe', {
        description: 'Stripe webhook (no signature)',
        body: {
            type: 'payment_intent.succeeded',
            data: { object: { id: 'pi_test123' } }
        },
        expectedStatus: 400 // Should fail without signature
    });
    
    // Summary
    console.log(chalk.bold('\n📊 Test Summary\n'));
    console.log(chalk.green(`✅ Passed: ${tests.passed}`));
    console.log(chalk.red(`❌ Failed: ${tests.failed}`));
    console.log(chalk.yellow(`⏭️  Skipped: ${tests.skipped}`));
    
    const total = tests.passed + tests.failed + tests.skipped;
    const successRate = total > 0 ? ((tests.passed / (tests.passed + tests.failed)) * 100).toFixed(1) : 0;
    
    console.log(`\nSuccess Rate: ${successRate}%`);
    
    if (tests.failed === 0) {
        console.log(chalk.green.bold('\n🎉 All tests passed!'));
    } else {
        console.log(chalk.red.bold('\n❌ Some tests failed. Check the output above.'));
    }
    
    // Exit with appropriate code
    process.exit(tests.failed > 0 ? 1 : 0);
}

// Check if required modules are installed
try {
    await import('node-fetch');
    await import('chalk');
} catch (error) {
    console.log(chalk.red('Missing dependencies. Installing...'));
    console.log('Run: npm install node-fetch chalk');
    process.exit(1);
}

// Run the tests
runTests().catch(console.error);