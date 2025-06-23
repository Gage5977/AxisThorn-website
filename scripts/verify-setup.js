#!/usr/bin/env node

/**
 * Verify Production Setup Script
 * This script checks that all required environment variables and services are configured
 */

import { validateEnvVars } from '../lib/validation.js';
import db from '../lib/db.js';
import { sendEmail } from '../lib/email.js';
import Stripe from 'stripe';

console.log('🔍 Axis Thorn Production Setup Verification\n');

const results = {
    passed: [],
    failed: [],
    warnings: []
};

// Check 1: Required Environment Variables
console.log('1️⃣ Checking environment variables...');
const requiredVars = ['JWT_SECRET', 'DATABASE_URL'];
const envCheck = validateEnvVars(requiredVars);

if (envCheck.valid) {
    results.passed.push('✅ Required environment variables are set');
    
    // Check JWT_SECRET strength
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32) {
        results.passed.push('✅ JWT_SECRET is sufficiently strong');
    } else {
        results.warnings.push('⚠️  JWT_SECRET should be at least 32 characters');
    }
} else {
    envCheck.missing.forEach(v => {
        results.failed.push(`❌ Missing required: ${v}`);
    });
    envCheck.invalid.forEach(e => {
        results.failed.push(`❌ Invalid: ${e}`);
    });
}

// Check 2: Database Connection
console.log('\n2️⃣ Checking database connection...');
try {
    if (db.isUsingDatabase()) {
        results.passed.push('✅ Connected to PostgreSQL database');
        
        // Try a simple query
        try {
            await db.user.findMany({ take: 1 });
            results.passed.push('✅ Database queries working');
        } catch (error) {
            results.failed.push('❌ Database query failed: ' + error.message);
        }
    } else {
        results.warnings.push('⚠️  Using in-memory storage (no DATABASE_URL)');
    }
} catch (error) {
    results.failed.push('❌ Database connection failed: ' + error.message);
}

// Check 3: Email Service
console.log('\n3️⃣ Checking email service...');
if (process.env.SENDGRID_API_KEY) {
    results.passed.push('✅ SendGrid configured');
} else if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    results.passed.push('✅ AWS SES configured');
} else {
    results.warnings.push('⚠️  No email service configured (emails will log to console)');
}

// Check 4: Stripe Configuration
console.log('\n4️⃣ Checking payment processing...');
if (process.env.STRIPE_SECRET_KEY) {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
        // Test connection with a simple request
        await stripe.customers.list({ limit: 1 });
        results.passed.push('✅ Stripe API connected');
        
        if (process.env.STRIPE_PUBLISHABLE_KEY) {
            results.passed.push('✅ Stripe publishable key set');
        } else {
            results.warnings.push('⚠️  Missing STRIPE_PUBLISHABLE_KEY for frontend');
        }
        
        if (process.env.STRIPE_WEBHOOK_SECRET) {
            results.passed.push('✅ Stripe webhook secret configured');
        } else {
            results.warnings.push('⚠️  Missing STRIPE_WEBHOOK_SECRET for webhooks');
        }
    } catch (error) {
        results.failed.push('❌ Stripe connection failed: ' + error.message);
    }
} else {
    results.warnings.push('⚠️  Stripe not configured (payments disabled)');
}

// Check 5: Admin User
console.log('\n5️⃣ Checking for admin user...');
try {
    const admins = await db.user.findMany({
        where: { role: 'admin' },
        take: 1
    });
    
    if (admins.length > 0) {
        results.passed.push('✅ Admin user exists');
    } else {
        results.warnings.push('⚠️  No admin user found (run create-admin.js)');
    }
} catch (error) {
    results.warnings.push('⚠️  Could not check for admin user');
}

// Check 6: API Endpoints
console.log('\n6️⃣ Testing API endpoints...');
const testEndpoints = [
    { path: '/api/health', expected: 'healthy' },
    { path: '/api/status', expected: 'overall' }
];

for (const endpoint of testEndpoints) {
    try {
        const baseUrl = process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}` 
            : 'http://localhost:3000';
            
        const response = await fetch(`${baseUrl}${endpoint.path}`);
        const data = await response.json();
        
        if (data[endpoint.expected]) {
            results.passed.push(`✅ API endpoint ${endpoint.path} working`);
        } else {
            results.failed.push(`❌ API endpoint ${endpoint.path} returned unexpected response`);
        }
    } catch (error) {
        results.warnings.push(`⚠️  Could not test ${endpoint.path} (may need to test from browser)`);
    }
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 SETUP VERIFICATION SUMMARY\n');

console.log(`✅ Passed: ${results.passed.length}`);
results.passed.forEach(item => console.log(`   ${item}`));

if (results.warnings.length > 0) {
    console.log(`\n⚠️  Warnings: ${results.warnings.length}`);
    results.warnings.forEach(item => console.log(`   ${item}`));
}

if (results.failed.length > 0) {
    console.log(`\n❌ Failed: ${results.failed.length}`);
    results.failed.forEach(item => console.log(`   ${item}`));
}

// Overall status
console.log('\n' + '='.repeat(60));
if (results.failed.length === 0) {
    if (results.warnings.length === 0) {
        console.log('🎉 PRODUCTION READY - All checks passed!');
    } else {
        console.log('✅ READY FOR DEPLOYMENT - Some optional features not configured');
    }
} else {
    console.log('❌ NOT READY - Please fix the failed checks above');
}

// Exit
await db.$disconnect();
process.exit(results.failed.length > 0 ? 1 : 0);