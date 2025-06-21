// Environment configuration and validation
const requiredEnvVars = {
  production: [
    'DATABASE_URL',
    'JWT_SECRET',
    'STRIPE_SECRET_KEY',
    'ALLOWED_ORIGINS'
  ],
  development: [
    'DATABASE_URL',
    'JWT_SECRET'
  ]
};

function validateEnvironment() {
  const env = process.env.NODE_ENV || 'development';
  const required = requiredEnvVars[env] || requiredEnvVars.development;
  const missing = [];

  for (const varName of required) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(v => console.error(`   - ${v}`));
    
    if (env === 'production') {
      console.error('\n🚨 FATAL: Cannot start in production without required environment variables');
      process.exit(1);
    } else {
      console.warn('\n⚠️  WARNING: Running in development mode with missing variables');
    }
  }

  // Security checks for production
  if (env === 'production') {
    // JWT Secret strength check
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
      console.error('🚨 FATAL: JWT_SECRET must be at least 32 characters in production');
      process.exit(1);
    }

    // HTTPS only in production
    if (!process.env.FORCE_HTTPS) {
      console.warn('⚠️  WARNING: FORCE_HTTPS not set - ensure HTTPS is enforced by proxy');
    }

    // Ensure CORS is restricted
    const origins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    if (origins.length === 0 || origins.includes('*')) {
      console.error('🚨 FATAL: ALLOWED_ORIGINS must be restricted in production');
      process.exit(1);
    }
  }

  console.log(`✅ Environment: ${env}`);
  console.log(`✅ Required variables: ${required.length - missing.length}/${required.length} present`);
  
  return {
    env,
    isProduction: env === 'production',
    isDevelopment: env === 'development',
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',').filter(Boolean) || []
  };
}

module.exports = { validateEnvironment };