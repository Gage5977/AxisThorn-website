const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { logger } = require('../middleware/security');
const prisma = require('../../lib/prisma');

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY || !endpointSecret) {
    logger.error('Stripe configuration missing');
    return res.status(500).json({ error: 'Stripe configuration missing' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret
    );
  } catch (err) {
    logger.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object);
      break;
      
    case 'payment_intent.payment_failed':
      await handlePaymentFailure(event.data.object);
      break;
      
    case 'charge.succeeded':
      await handleChargeSuccess(event.data.object);
      break;
      
    case 'charge.failed':
      await handleChargeFailed(event.data.object);
      break;
      
    case 'customer.created':
      await handleCustomerCreated(event.data.object);
      break;
      
    default:
      logger.info(`Unhandled event type ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    logger.error('Webhook handler error:', error);
    // Return 200 to prevent Stripe retries on processing errors
    return res.status(200).json({ received: true, error: 'Processing error' });
  }
};

async function handlePaymentSuccess(paymentIntent) {
  logger.info('Payment succeeded:', paymentIntent.id);
  
  const { 
    amount, 
    currency, 
    metadata,
    receipt_email,
    charges
  } = paymentIntent;

  const { invoice_id } = metadata || {};
  
  if (invoice_id) {
    try {
      // Update invoice status in database
      await prisma.invoice.update({
        where: { id: invoice_id },
        data: {
          paymentStatus: 'paid',
          paidAt: new Date(),
          stripePaymentIntentId: paymentIntent.id,
          payments: {
            create: {
              amount: amount / 100,
              method: 'stripe',
              stripePaymentIntentId: paymentIntent.id,
              stripeChargeId: charges?.data[0]?.id,
              receiptUrl: charges?.data[0]?.receipt_url,
              status: 'completed'
            }
          }
        }
      });
      
      logger.info(`Invoice ${invoice_id} marked as paid`);
    } catch (error) {
      logger.error('Failed to update invoice:', error);
    }
  }

  // Log payment for accounting
  logger.info({
    event: 'payment_succeeded',
    paymentIntentId: paymentIntent.id,
    amount: amount / 100,
    currency,
    customer_email: metadata.customer_email || receipt_email,
    invoice_id: metadata.invoice_id,
    receipt_url: charges?.data[0]?.receipt_url
  });
}

async function handlePaymentFailure(paymentIntent) {
  console.log('Payment failed:', paymentIntent.id);
  
  const { 
    amount, 
    currency, 
    metadata,
    last_payment_error
  } = paymentIntent;

  console.error({
    paymentIntentId: paymentIntent.id,
    amount: amount / 100,
    currency,
    customer_email: metadata.customer_email,
    invoice_id: metadata.invoice_id,
    error: last_payment_error?.message
  });

  // TODO: Send failure notification to customer
  // TODO: Update invoice status as payment failed
}

async function handleChargeSuccess(charge) {
  console.log('Charge succeeded:', charge.id);
  
  // Additional charge processing if needed
  console.log({
    chargeId: charge.id,
    amount: charge.amount / 100,
    currency: charge.currency,
    receipt_url: charge.receipt_url,
    customer: charge.customer
  });
}

async function handleChargeFailed(charge) {
  console.log('Charge failed:', charge.id);
  
  console.error({
    chargeId: charge.id,
    amount: charge.amount / 100,
    currency: charge.currency,
    failure_code: charge.failure_code,
    failure_message: charge.failure_message
  });
}

async function handleCustomerCreated(customer) {
  console.log('Customer created:', customer.id);
  
  // Store customer information for future use
  console.log({
    customerId: customer.id,
    email: customer.email,
    name: customer.name,
    created: new Date(customer.created * 1000)
  });
}