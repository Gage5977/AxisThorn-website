// Health Check Endpoint - Safe for production
export default function handler(req, res) {
    // Basic health check that doesn't depend on external services
    const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
        services: {
            api: 'operational',
            database: process.env.DATABASE_URL ? 'configured' : 'not configured',
            stripe: process.env.STRIPE_SECRET_KEY ? 'configured' : 'not configured',
            email: process.env.EMAIL_HOST ? 'configured' : 'not configured'
        }
    };

    // Don't expose sensitive info in production
    if (process.env.NODE_ENV === 'production') {
        health.services = {
            api: 'operational',
            database: 'check pending',
            stripe: 'check pending',
            email: 'check pending'
        };
    }

    res.status(200).json(health);
}