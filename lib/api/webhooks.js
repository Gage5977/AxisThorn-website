// Consolidated Webhook Handlers
import Stripe from 'stripe';
import db from '../db.js';
import { sendEmail, emailTemplates } from '../email.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});

// Get raw body for webhook verification
async function getRawBody(req) {
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf8');
}

// Stripe webhook handler
export async function stripeWebhook(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }
    
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    
    try {
        if (!endpointSecret) {
            event = req.body;
            console.warn('⚠️  Webhook endpoint secret not set. Skipping signature verification.');
        } else {
            const rawBody = await getRawBody(req);
            event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
        }
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    console.log(`📨 Stripe webhook received: ${event.type}`);
    
    try {
        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentSucceeded(event.data.object);
                break;
                
            case 'payment_intent.payment_failed':
                await handlePaymentFailed(event.data.object);
                break;
                
            case 'checkout.session.completed':
                await handleCheckoutCompleted(event.data.object);
                break;
                
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted':
                await handleSubscriptionChange(event.type, event.data.object);
                break;
                
            case 'invoice.payment_succeeded':
                await handleInvoicePaid(event.data.object);
                break;
                
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
        
        res.status(200).json({ received: true });
    } catch (error) {
        console.error('Webhook handler error:', error);
        res.status(500).json({ error: 'Webhook handler failed' });
    }
}

// Payment succeeded handler
async function handlePaymentSucceeded(paymentIntent) {
    console.log('💰 Payment succeeded:', paymentIntent.id);
    
    const { userId, userEmail } = paymentIntent.metadata || {};
    
    if (userEmail) {
        await sendEmail({
            to: userEmail,
            subject: 'Payment Confirmation',
            html: `
                <h2>Payment Received</h2>
                <p>Your payment of ${(paymentIntent.amount / 100).toFixed(2)} ${paymentIntent.currency.toUpperCase()} has been successfully processed.</p>
                <p>Transaction ID: ${paymentIntent.id}</p>
                <p>Thank you for your business!</p>
            `
        });
    }
}

// Payment failed handler
async function handlePaymentFailed(paymentIntent) {
    console.log('❌ Payment failed:', paymentIntent.id);
    
    const { userEmail } = paymentIntent.metadata || {};
    
    if (userEmail) {
        await sendEmail({
            to: userEmail,
            subject: 'Payment Failed',
            html: `
                <h2>Payment Failed</h2>
                <p>Your payment of ${(paymentIntent.amount / 100).toFixed(2)} ${paymentIntent.currency.toUpperCase()} could not be processed.</p>
                <p>Please try again or contact support if the issue persists.</p>
            `
        });
    }
}

// Checkout completed handler
async function handleCheckoutCompleted(session) {
    console.log('✅ Checkout completed:', session.id);
    
    if (session.customer_email) {
        await sendEmail({
            to: session.customer_email,
            subject: 'Order Confirmation',
            html: `
                <h2>Thank You for Your Order</h2>
                <p>Your order has been confirmed and is being processed.</p>
                <p>Order ID: ${session.id}</p>
                <p>Total: ${(session.amount_total / 100).toFixed(2)} ${session.currency.toUpperCase()}</p>
            `
        });
    }
}

// Subscription change handler
async function handleSubscriptionChange(eventType, subscription) {
    console.log('📅 Subscription event:', eventType, subscription.id);
    
    // Would update subscription status in database
    // and send appropriate notification emails
}

// Invoice paid handler
async function handleInvoicePaid(invoice) {
    console.log('📄 Invoice paid:', invoice.id);
    
    if (invoice.customer_email) {
        await sendEmail({
            to: invoice.customer_email,
            subject: 'Invoice Payment Received',
            html: `
                <h2>Payment Received</h2>
                <p>Thank you for your payment of ${(invoice.amount_paid / 100).toFixed(2)} ${invoice.currency.toUpperCase()}.</p>
                <p>Invoice Number: ${invoice.number || invoice.id}</p>
            `
        });
    }
}

export default {
    stripe: stripeWebhook
};