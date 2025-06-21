// Stripe Checkout Session API endpoint
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const ALLOWED_ORIGINS = [
  'https://axisthorn.com',
  'https://www.axisthorn.com',
  process.env.VERCEL_URL,
  'http://localhost:3000'
];

export default async function handler(req, res) {
  // CORS headers
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ 
      error: 'Stripe is not configured',
      message: 'Missing STRIPE_SECRET_KEY environment variable' 
    });
  }

  try {
    const { 
      priceId,
      mode = 'payment', // 'payment' or 'subscription'
      successUrl = 'https://axisthorn.com/success',
      cancelUrl = 'https://axisthorn.com',
      customerEmail,
      metadata = {}
    } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    const sessionConfig = {
      payment_method_types: ['card'],
      mode,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        ...metadata,
        created_at: new Date().toISOString()
      }
    };

    if (customerEmail) {
      sessionConfig.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return res.status(200).json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Stripe session error:', error);
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error.message 
    });
  }
}