// Stripe Webhook Handler
import Stripe from 'stripe';
import db from '../../lib/db.js';
import { sendEmail, emailTemplates } from '../../lib/email.js';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});

// Webhook endpoint secret
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
        return;
    }
    
    const sig = req.headers['stripe-signature'];
    let event;
    
    try {
        // Verify webhook signature
        if (!endpointSecret) {
            // For testing without webhook secret
            event = req.body;
            console.warn('⚠️  Webhook endpoint secret not set. Skipping signature verification.');
        } else {
            // Construct event with signature verification
            const rawBody = await getRawBody(req);
            event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
        }
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    
    // Log the event
    console.log(`📨 Stripe webhook received: ${event.type}`);
    
    try {
        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentIntentSucceeded(event.data.object);
                break;
                
            case 'payment_intent.payment_failed':
                await handlePaymentIntentFailed(event.data.object);
                break;
                
            case 'customer.subscription.created':
                await handleSubscriptionCreated(event.data.object);
                break;
                
            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object);
                break;
                
            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object);
                break;
                
            case 'invoice.payment_succeeded':
                await handleInvoicePaymentSucceeded(event.data.object);
                break;
                
            case 'invoice.payment_failed':
                await handleInvoicePaymentFailed(event.data.object);
                break;
                
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
        
        // Return a 200 response to acknowledge receipt of the event
        res.status(200).json({ received: true });
        
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
}

// Helper function to get raw body for signature verification
async function getRawBody(req) {
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks).toString('utf8');
}

// Handle successful payment
async function handlePaymentIntentSucceeded(paymentIntent) {
    console.log('💰 Payment succeeded:', paymentIntent.id);
    
    try {
        // Extract metadata
        const { userId, invoiceId, type } = paymentIntent.metadata || {};
        
        if (!userId) {
            console.warn('No userId in payment metadata');
            return;
        }
        
        // Record payment in database
        await db.activity.create({
            data: {
                userId,
                type: 'payment_succeeded',
                data: {
                    paymentIntentId: paymentIntent.id,
                    amount: paymentIntent.amount,
                    currency: paymentIntent.currency,
                    invoiceId,
                    type
                }
            }
        });
        
        // Update invoice status if applicable
        if (invoiceId) {
            await db.invoice.update({
                where: { id: invoiceId },
                data: {
                    status: 'paid',
                    paidAt: new Date(),
                    paymentIntentId: paymentIntent.id
                }
            });
        }
        
        // Send confirmation email
        const user = await db.user.findUnique({ where: { id: userId } });
        if (user) {
            await sendEmail({
                to: user.email,
                subject: 'Payment Confirmation - Axis Thorn',
                html: `
                    <div style="font-family: Inter, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1>Payment Received</h1>
                        <p>Hi ${user.name},</p>
                        <p>We've successfully received your payment of ${formatCurrency(paymentIntent.amount, paymentIntent.currency)}.</p>
                        <p>Transaction ID: ${paymentIntent.id}</p>
                        <p>Thank you for your business!</p>
                        <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;">
                        <p style="color: #999; font-size: 12px;">Axis Thorn LLC</p>
                    </div>
                `
            });
        }
        
    } catch (error) {
        console.error('Error handling payment success:', error);
        throw error;
    }
}

// Handle failed payment
async function handlePaymentIntentFailed(paymentIntent) {
    console.log('❌ Payment failed:', paymentIntent.id);
    
    try {
        const { userId, invoiceId } = paymentIntent.metadata || {};
        
        if (!userId) return;
        
        // Record failed payment
        await db.activity.create({
            data: {
                userId,
                type: 'payment_failed',
                data: {
                    paymentIntentId: paymentIntent.id,
                    amount: paymentIntent.amount,
                    currency: paymentIntent.currency,
                    error: paymentIntent.last_payment_error?.message,
                    invoiceId
                }
            }
        });
        
        // Update invoice status
        if (invoiceId) {
            await db.invoice.update({
                where: { id: invoiceId },
                data: {
                    status: 'payment_failed',
                    lastPaymentError: paymentIntent.last_payment_error?.message
                }
            });
        }
        
        // Send failure notification
        const user = await db.user.findUnique({ where: { id: userId } });
        if (user) {
            await sendEmail({
                to: user.email,
                subject: 'Payment Failed - Action Required',
                html: `
                    <div style="font-family: Inter, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1>Payment Failed</h1>
                        <p>Hi ${user.name},</p>
                        <p>Your payment of ${formatCurrency(paymentIntent.amount, paymentIntent.currency)} could not be processed.</p>
                        <p>Error: ${paymentIntent.last_payment_error?.message || 'Unknown error'}</p>
                        <p>Please update your payment method or contact support.</p>
                        <a href="https://axisthorn.com/portal" style="display: inline-block; background: #0066ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 24px 0;">Update Payment Method</a>
                        <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;">
                        <p style="color: #999; font-size: 12px;">Axis Thorn LLC</p>
                    </div>
                `
            });
        }
        
    } catch (error) {
        console.error('Error handling payment failure:', error);
        throw error;
    }
}

// Handle subscription creation
async function handleSubscriptionCreated(subscription) {
    console.log('📋 Subscription created:', subscription.id);
    
    // TODO: Implement subscription tracking
    // - Update user's subscription status
    // - Grant access to premium features
    // - Send welcome email
}

// Handle subscription update
async function handleSubscriptionUpdated(subscription) {
    console.log('📝 Subscription updated:', subscription.id);
    
    // TODO: Implement subscription updates
    // - Update user's plan
    // - Adjust feature access
    // - Send confirmation email
}

// Handle subscription cancellation
async function handleSubscriptionDeleted(subscription) {
    console.log('🚫 Subscription cancelled:', subscription.id);
    
    // TODO: Implement subscription cancellation
    // - Revoke premium access
    // - Send cancellation confirmation
    // - Schedule data retention/deletion
}

// Handle successful invoice payment
async function handleInvoicePaymentSucceeded(invoice) {
    console.log('📄 Invoice paid:', invoice.id);
    
    // TODO: Implement invoice payment tracking
    // - Update invoice status
    // - Send receipt
}

// Handle failed invoice payment
async function handleInvoicePaymentFailed(invoice) {
    console.log('❌ Invoice payment failed:', invoice.id);
    
    // TODO: Implement failed invoice handling
    // - Send payment failure notice
    // - Update subscription status if needed
}

// Format currency for display
function formatCurrency(amount, currency) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase()
    }).format(amount / 100);
}

// Disable body parsing for raw webhook payload
export const config = {
    api: {
        bodyParser: false
    }
};