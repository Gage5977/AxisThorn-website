// Environment check endpoint - only shows if variables are set, not their values
export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const envVars = {
    stripe: {
      secretKey: !!process.env.STRIPE_SECRET_KEY,
      publishableKey: !!process.env.STRIPE_PUBLISHABLE_KEY,
      webhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET
    },
    jwt: {
      secret: !!process.env.JWT_SECRET,
      expiry: process.env.JWT_EXPIRY || '30d'
    },
    database: {
      url: !!process.env.DATABASE_URL
    },
    email: {
      sendgridKey: !!process.env.SENDGRID_API_KEY,
      fromAddress: process.env.EMAIL_FROM || 'noreply@axisthorn.com'
    },
    api: {
      baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://axisthorn.com/api',
      nodeEnv: process.env.NODE_ENV || 'development'
    }
  };

  const allConfigured = 
    envVars.stripe.secretKey && 
    envVars.stripe.publishableKey && 
    envVars.jwt.secret;

  res.status(200).json({
    configured: allConfigured,
    environment: envVars,
    timestamp: new Date().toISOString()
  });
}