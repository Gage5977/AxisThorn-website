// Consolidated Payment Handlers
import Stripe from 'stripe';
import { requireAuth } from '../../api/middleware/auth.js';
import db from '../db.js';
import { validateRequest } from '../validation.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});

// Create payment intent
export async function createIntent(req, res) {
    await requireAuth(req, res, async () => {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const schema = {
            amount: { required: true, type: 'number', min: 100 },
            currency: { required: false, type: 'string', enum: ['usd', 'eur', 'gbp'] },
            description: { required: false, type: 'string', maxLength: 500 }
        };

        const validation = validateRequest(req.body, schema);
        if (!validation.valid) {
            return res.status(400).json({ errors: validation.errors });
        }

        try {
            const { amount, currency = 'usd', description } = validation.data;

            if (!process.env.STRIPE_SECRET_KEY) {
                return res.status(503).json({ 
                    error: 'Payment service not configured' 
                });
            }

            // Create payment intent
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency,
                description,
                metadata: {
                    userId: req.user.id,
                    userEmail: req.user.email
                }
            });

            res.status(200).json({
                clientSecret: paymentIntent.client_secret,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency
            });
        } catch (error) {
            console.error('Payment intent error:', error);
            res.status(500).json({ error: 'Failed to create payment intent' });
        }
    });
}

// Get payment history
export async function history(req, res) {
    await requireAuth(req, res, async () => {
        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        try {
            // Mock payment history for now
            const payments = [
                {
                    id: 'pay_1',
                    amount: 15000,
                    currency: 'usd',
                    status: 'succeeded',
                    description: 'AI Consulting Service',
                    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                },
                {
                    id: 'pay_2',
                    amount: 25000,
                    currency: 'usd',
                    status: 'succeeded',
                    description: 'Premium Support Package',
                    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                }
            ];

            res.status(200).json({ payments });
        } catch (error) {
            console.error('Payment history error:', error);
            res.status(500).json({ error: 'Failed to fetch payment history' });
        }
    });
}

// Get payment links
export async function links(req, res) {
    await requireAuth(req, res, async () => {
        if (req.method === 'GET') {
            // List payment links
            try {
                const links = []; // Would fetch from database
                res.status(200).json({ links });
            } catch (error) {
                console.error('Payment links error:', error);
                res.status(500).json({ error: 'Failed to fetch payment links' });
            }
        } else if (req.method === 'POST') {
            // Create payment link
            const schema = {
                amount: { required: true, type: 'number', min: 100 },
                description: { required: true, type: 'string', minLength: 3 }
            };

            const validation = validateRequest(req.body, schema);
            if (!validation.valid) {
                return res.status(400).json({ errors: validation.errors });
            }

            try {
                if (!process.env.STRIPE_SECRET_KEY) {
                    return res.status(503).json({ 
                        error: 'Payment service not configured' 
                    });
                }

                // Would create Stripe payment link here
                const link = {
                    id: 'link_' + Date.now(),
                    url: 'https://pay.stripe.com/example',
                    amount: validation.data.amount,
                    description: validation.data.description,
                    createdAt: new Date()
                };

                res.status(201).json(link);
            } catch (error) {
                console.error('Create payment link error:', error);
                res.status(500).json({ error: 'Failed to create payment link' });
            }
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    });
}

export default {
    createIntent,
    history,
    links
};