const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { authenticate, validatePaymentAmount } = require('../middleware/auth');

const ALLOWED_ORIGINS = [
  'https://axisthorn.com',
  'https://www.axisthorn.com',
  process.env.VERCEL_URL,
  'http://localhost:3000',
  'http://localhost:5173'
];

module.exports = async function handler(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe configuration missing' });
  }

  // Apply authentication middleware
  await new Promise((resolve, reject) => {
    authenticate(req, res, (err) => {
      if (err) {reject(err);}
      else {resolve();}
    });
  }).catch(() => {
    // Response already sent by middleware
    
  });

  if (!req.auth) {
    return; // Authentication failed, response already sent
  }

  try {
    switch (req.method) {
    case 'POST':
      const { action } = req.body;

      switch (action) {
      case 'create-payment-intent':
        return await createPaymentIntent(req, res);
          
      case 'confirm-payment':
        return await confirmPayment(req, res);
          
      case 'get-payment-status':
        return await getPaymentStatus(req, res);
          
      default:
        return res.status(400).json({ error: 'Invalid action' });
      }

    default:
      res.setHeader('Allow', ['POST', 'OPTIONS']);
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Stripe API Error:', error);
    return res.status(500).json({ 
      error: 'Payment processing error',
      message: error.message 
    });
  }
};

async function createPaymentIntent(req, res) {
  // Apply payment amount validation
  await new Promise((resolve, reject) => {
    validatePaymentAmount(req, res, (err) => {
      if (err) {reject(err);}
      else {resolve();}
    });
  }).catch(() => {
    
  });

  const { 
    amount, 
    currency = 'usd', 
    description,
    metadata = {},
    customer_email,
    invoice_id
  } = req.body;

  // Additional validation for authenticated request
  if (req.auth.metadata && req.auth.metadata.invoiceNumber) {
    if (invoice_id && invoice_id !== req.auth.metadata.invoiceNumber) {
      return res.status(403).json({ 
        error: 'Invoice mismatch',
        message: 'You can only process payments for the authorized invoice'
      });
    }
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      description,
      metadata: {
        ...metadata,
        customer_email,
        invoice_id,
        created_at: new Date().toISOString()
      },
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: customer_email
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    return res.status(400).json({ error: error.message });
  }
}

async function confirmPayment(req, res) {
  const { paymentIntentId, payment_method } = req.body;

  if (!paymentIntentId || !payment_method) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.confirm(
      paymentIntentId,
      { payment_method }
    );

    return res.status(200).json({
      status: paymentIntent.status,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      receipt_url: paymentIntent.charges?.data[0]?.receipt_url
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    return res.status(400).json({ error: error.message });
  }
}

async function getPaymentStatus(req, res) {
  const { paymentIntentId } = req.body;

  if (!paymentIntentId) {
    return res.status(400).json({ error: 'Payment intent ID required' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return res.status(200).json({
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      created: paymentIntent.created,
      metadata: paymentIntent.metadata,
      receipt_url: paymentIntent.charges?.data[0]?.receipt_url
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    return res.status(400).json({ error: error.message });
  }
}