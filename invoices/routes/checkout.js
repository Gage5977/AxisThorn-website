const express = require('express');
const router = express.Router();
const CheckoutSession = require('../models/CheckoutSession');
const database = require('../db/Database');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create checkout session
router.post('/sessions', async (req, res) => {
  try {
    const {
      invoice_id,
      success_url,
      cancel_url,
      payment_method_types = ['card'],
      allow_promotion_codes = false,
      automatic_tax = { enabled: false },
      billing_address_collection = 'auto',
      customer_email,
      metadata = {}
    } = req.body;

    let checkoutSession;

    // If Stripe is configured, create real Stripe checkout session
    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'your_stripe_secret_key_here') {
      
      if (invoice_id) {
        // Create session from existing invoice
        const invoice = database.getInvoice(invoice_id);
        if (!invoice) {
          return res.status(404).json({ error: 'Invoice not found' });
        }

        const lineItems = invoice.items.map(item => ({
          price_data: {
            currency: invoice.currency || 'usd',
            product_data: {
              name: item.description,
              metadata: { invoice_id: invoice.id }
            },
            unit_amount: Math.round(item.unitPrice * 100) // Convert to cents
          },
          quantity: item.quantity
        }));

        // Add tax as a line item if applicable
        if (invoice.tax > 0) {
          lineItems.push({
            price_data: {
              currency: invoice.currency || 'usd',
              product_data: {
                name: `Tax (${invoice.taxRate}%)`,
                metadata: { type: 'tax', invoice_id: invoice.id }
              },
              unit_amount: Math.round(invoice.tax * 100)
            },
            quantity: 1
          });
        }

        // Apply discount if applicable
        const discounts = [];
        if (invoice.discount > 0) {
          // Note: In a real implementation, you'd create a Stripe coupon first
          // For demo purposes, we'll subtract the discount from the line items
        }

        const stripeSession = await stripe.checkout.sessions.create({
          payment_method_types,
          line_items: lineItems,
          mode: 'payment',
          success_url,
          cancel_url,
          customer_email: customer_email || invoice.customerEmail,
          allow_promotion_codes,
          automatic_tax,
          billing_address_collection,
          metadata: {
            invoice_id: invoice.id,
            invoice_number: invoice.number,
            ...metadata
          },
          client_reference_id: invoice.number
        });

        // Save session to database
        checkoutSession = new CheckoutSession({
          id: stripeSession.id,
          ...stripeSession,
          invoice: invoice.id
        });
        
      } else {
        // Create session from line items
        const stripeSession = await stripe.checkout.sessions.create({
          payment_method_types,
          line_items: req.body.line_items,
          mode: req.body.mode || 'payment',
          success_url,
          cancel_url,
          customer_email,
          allow_promotion_codes,
          automatic_tax,
          billing_address_collection,
          metadata
        });

        checkoutSession = new CheckoutSession(stripeSession);
      }

    } else {
      // Create mock checkout session for demo
      if (invoice_id) {
        const invoice = database.getInvoice(invoice_id);
        if (!invoice) {
          return res.status(404).json({ error: 'Invoice not found' });
        }

        checkoutSession = CheckoutSession.fromInvoice(invoice, {
          success_url,
          cancel_url,
          metadata
        });
      } else {
        checkoutSession = new CheckoutSession({
          success_url,
          cancel_url,
          payment_method_types,
          customer_email,
          metadata,
          line_items: req.body.line_items || []
        });
      }
    }

    database.saveCheckoutSession(checkoutSession);
    res.json(checkoutSession.toJSON());

  } catch (error) {
    console.error('Checkout session creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Retrieve checkout session
router.get('/sessions/:id', async (req, res) => {
  try {
    let session = database.getCheckoutSession(req.params.id);
    
    if (!session && process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'your_stripe_secret_key_here') {
      // Try to retrieve from Stripe
      try {
        const stripeSession = await stripe.checkout.sessions.retrieve(req.params.id);
        session = new CheckoutSession(stripeSession);
        database.saveCheckoutSession(session);
      } catch (stripeError) {
        return res.status(404).json({ error: 'Checkout session not found' });
      }
    }

    if (!session) {
      return res.status(404).json({ error: 'Checkout session not found' });
    }

    // Check if session is expired
    if (session.isExpired() && session.status === 'open') {
      session.expire();
      database.saveCheckoutSession(session);
    }

    res.json(session.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List checkout sessions
router.get('/sessions', async (req, res) => {
  try {
    const sessions = database.getAllCheckoutSessions();
    res.json({
      object: 'list',
      data: sessions.map(s => s.toJSON()),
      has_more: false,
      total_count: sessions.length,
      url: '/v1/checkout/sessions'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Expire a checkout session
router.post('/sessions/:id/expire', async (req, res) => {
  try {
    const session = database.getCheckoutSession(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Checkout session not found' });
    }

    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'your_stripe_secret_key_here') {
      // Expire Stripe session
      await stripe.checkout.sessions.expire(req.params.id);
    }

    session.expire();
    database.saveCheckoutSession(session);
    
    res.json(session.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get line items for a checkout session
router.get('/sessions/:id/line_items', async (req, res) => {
  try {
    const session = database.getCheckoutSession(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Checkout session not found' });
    }

    res.json({
      object: 'list',
      data: session.line_items,
      has_more: false,
      total_count: session.line_items.length,
      url: `/v1/checkout/sessions/${req.params.id}/line_items`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create checkout session from invoice (convenience endpoint)
router.post('/sessions/from-invoice/:invoice_id', async (req, res) => {
  try {
    const invoice = database.getInvoice(req.params.invoice_id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const {
      success_url = `${process.env.BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url = `${process.env.BASE_URL || 'http://localhost:3000'}/cancel`,
      payment_method_types = invoice.paymentMethods || ['card'],
      ...options
    } = req.body;

    // Create checkout session
    const sessionData = {
      invoice_id: invoice.id,
      success_url,
      cancel_url,
      payment_method_types,
      customer_email: invoice.customerEmail,
      ...options
    };

    // Forward to main session creation endpoint
    req.body = sessionData;
    return router.handle(req, res, (err) => {
      if (err) throw err;
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Process payment (demo implementation)
router.post('/process-payment', async (req, res) => {
  try {
    const { session_id, payment_method, billing_details, card } = req.body;

    const session = database.getCheckoutSession(session_id);
    if (!session) {
      return res.status(404).json({ error: 'Checkout session not found' });
    }

    if (session.status !== 'open') {
      return res.status(400).json({ error: 'Checkout session is not open' });
    }

    // Simulate payment processing
    const success = Math.random() > 0.1; // 90% success rate for demo

    if (success) {
      // Complete the session
      session.complete();
      session.customer_details = billing_details;
      database.saveCheckoutSession(session);

      // Update related invoice if exists
      if (session.metadata && session.metadata.invoice_id) {
        const invoice = database.getInvoice(session.metadata.invoice_id);
        if (invoice) {
          invoice.pay(invoice.total);
          database.saveInvoice(invoice);
        }
      }

      res.json({ 
        success: true, 
        session: session.toJSON(),
        message: 'Payment processed successfully'
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: 'Payment failed. Please try again or use a different payment method.' 
      });
    }

  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook endpoint for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      // For demo purposes, parse the body directly
      event = JSON.parse(req.body);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        
        // Update local session
        const localSession = database.getCheckoutSession(session.id);
        if (localSession) {
          localSession.complete();
          database.saveCheckoutSession(localSession);
        }

        // Update related invoice if exists
        if (session.metadata && session.metadata.invoice_id) {
          const invoice = database.getInvoice(session.metadata.invoice_id);
          if (invoice) {
            invoice.pay(invoice.total);
            database.saveInvoice(invoice);
          }
        }
        
        console.log('Checkout session completed:', session.id);
        break;

      case 'checkout.session.expired':
        const expiredSession = event.data.object;
        const localExpiredSession = database.getCheckoutSession(expiredSession.id);
        if (localExpiredSession) {
          localExpiredSession.expire();
          database.saveCheckoutSession(localExpiredSession);
        }
        console.log('Checkout session expired:', expiredSession.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

module.exports = router;