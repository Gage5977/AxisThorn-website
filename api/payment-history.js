// api/payment-history.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { limit = 100, starting_after, ending_before } = req.query;

    // Fetch payment intents
    const paymentIntents = await stripe.paymentIntents.list({
      limit: parseInt(limit),
      starting_after,
      ending_before,
    });

    // Transform the data for the dashboard
    const transactions = paymentIntents.data.map(pi => ({
      id: pi.id,
      amount: pi.amount / 100, // Convert from cents
      currency: pi.currency,
      status: pi.status,
      description: pi.description || 'Payment',
      created: new Date(pi.created * 1000).toISOString(),
      customer: pi.customer,
      metadata: pi.metadata,
      paymentMethod: pi.payment_method_types[0],
    }));

    // Calculate summary statistics
    const stats = {
      totalRevenue: transactions
        .filter(t => t.status === 'succeeded')
        .reduce((sum, t) => sum + t.amount, 0),
      successfulPayments: transactions.filter(t => t.status === 'succeeded').length,
      pendingPayments: transactions.filter(t => t.status === 'processing' || t.status === 'requires_payment_method').length,
      averageTransaction: transactions.length > 0 
        ? transactions
            .filter(t => t.status === 'succeeded')
            .reduce((sum, t) => sum + t.amount, 0) / transactions.filter(t => t.status === 'succeeded').length
        : 0,
    };

    res.status(200).json({
      transactions,
      stats,
      has_more: paymentIntents.has_more,
    });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch payment history',
      message: err.message 
    });
  }
}