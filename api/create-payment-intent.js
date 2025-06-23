// api/create-payment-intent.js
import Stripe from 'stripe';
import { createRateLimiter } from './middleware/rate-limit.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Strict rate limit for payment endpoints
const paymentRateLimit = createRateLimiter({
    windowMs: 60000, // 1 minute
    max: 5, // 5 requests per minute
    message: 'Too many payment requests. Please wait before trying again.'
});

export default async function handler(req, res) {
  // Apply rate limiting
  await new Promise((resolve) => {
    paymentRateLimit(req, res, resolve);
  });
  
  if (res.headersSent) return;
  // Set CORS headers - restrict to production domains
  const allowedOrigins = [
    'https://axisthorn.com',
    'https://www.axisthorn.com',
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null,
    process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : null,
  ].filter(Boolean);
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Basic authentication check
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  // Verify the API key (in production, validate against database or auth service)
  const apiKey = authHeader.substring(7);
  if (apiKey !== process.env.PAYMENT_API_KEY) {
    res.status(403).json({ error: 'Invalid API key' });
    return;
  }

  try {
    const { amount, currency = 'usd', description, metadata } = req.body;

    // Validate amount
    if (!amount || amount < 50) {
      res.status(400).json({ error: 'Invalid amount. Minimum is $0.50' });
      return;
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      description,
      metadata: {
        ...metadata,
        source: 'axis-thorn-website'
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ 
      error: 'Failed to create payment intent',
      message: err.message 
    });
  }
}