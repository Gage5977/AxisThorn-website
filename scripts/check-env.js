#!/usr/bin/env node

/**
 * Environment Configuration Checker
 * Run this before deployment to verify all required environment variables
 */

const requiredEnvVars = {
    // Critical for backend operation
    DATABASE_URL: {
        required: true,
        example: 'postgresql://user:password@localhost:5432/dbname',
        description: 'PostgreSQL connection string'
    },
    JWT_SECRET: {
        required: true,
        example: 'your-32-character-random-string-here',
        description: 'Secret for JWT token signing (min 32 chars)'
    },
    
    // Payment processing
    STRIPE_SECRET_KEY: {
        required: false,
        example: 'sk_test_...',
        description: 'Stripe secret key for payment processing'
    },
    STRIPE_PUBLISHABLE_KEY: {
        required: false,
        example: 'pk_test_...',
        description: 'Stripe publishable key for frontend'
    },
    STRIPE_WEBHOOK_SECRET: {
        required: false,
        example: 'whsec_...',
        description: 'Stripe webhook endpoint secret'
    },
    
    // Email service
    EMAIL_HOST: {
        required: false,
        example: 'smtp.sendgrid.net',
        description: 'SMTP server hostname'
    },
    EMAIL_PORT: {
        required: false,
        example: '587',
        description: 'SMTP server port'
    },
    EMAIL_USER: {
        required: false,
        example: 'apikey',
        description: 'SMTP username'
    },
    EMAIL_PASS: {
        required: false,
        example: 'your-api-key',
        description: 'SMTP password or API key'
    },
    
    // Application
    NODE_ENV: {
        required: true,
        example: 'production',
        description: 'Node environment (development/production)'
    },
    PAYMENT_API_KEY: {
        required: false,
        example: 'your-secure-api-key',
        description: 'API key for payment endpoints'
    }
};

console.log('🔍 Checking Environment Configuration\n');

let hasErrors = false;
let hasWarnings = false;

// Check each variable
Object.entries(requiredEnvVars).forEach(([varName, config]) => {
    const value = process.env[varName];
    const exists = value !== undefined && value !== '';
    
    if (config.required && !exists) {
        console.log(`❌ ${varName} - MISSING (Required)`);
        console.log(`   ${config.description}`);
        console.log(`   Example: ${config.example}\n`);
        hasErrors = true;
    } else if (!config.required && !exists) {
        console.log(`⚠️  ${varName} - Not set (Optional)`);
        console.log(`   ${config.description}\n`);
        hasWarnings = true;
    } else {
        // Check quality of value
        if (varName === 'JWT_SECRET' && value.length < 32) {
            console.log(`⚠️  ${varName} - WEAK (Should be 32+ characters)`);
            hasWarnings = true;
        } else if (varName === 'NODE_ENV' && value !== 'production' && value !== 'development') {
            console.log(`⚠️  ${varName} - Invalid value: "${value}"`);
            hasWarnings = true;
        } else {
            console.log(`✅ ${varName} - Set`);
        }
    }
});

// Database connection test
if (process.env.DATABASE_URL) {
    console.log('\n🔗 Testing Database Connection...');
    // Note: Actual connection test would go here
    console.log('   (Connection test requires Prisma client)');
}

// Summary
console.log('\n📊 Summary:');
if (hasErrors) {
    console.log('❌ Missing required environment variables!');
    console.log('   The application will not start properly.');
    process.exit(1);
} else if (hasWarnings) {
    console.log('⚠️  Some optional features may not work.');
    console.log('   The application can run with limited functionality.');
} else {
    console.log('✅ All environment variables are properly configured!');
    console.log('   The application is ready for deployment.');
}

// Deployment readiness
console.log('\n🚀 Deployment Readiness:');
if (!process.env.DATABASE_URL) {
    console.log('❌ Cannot deploy backend - No database configured');
    console.log('   Deploy frontend only with .vercelignore excluding /api');
} else if (!process.env.STRIPE_SECRET_KEY) {
    console.log('⚠️  Can deploy but payment processing will not work');
} else if (!process.env.EMAIL_HOST) {
    console.log('⚠️  Can deploy but email notifications will not work');
} else {
    console.log('✅ Ready for full deployment!');
}