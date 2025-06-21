// API Version 1 Express Router
const router = require('express').Router();
const { authenticate } = require('../../api/middleware/auth');
const { accessCodeOrAuth } = require('../../api/middleware/access-code');
const { rateLimiters } = require('../../api/middleware/security');
const wrap = require('../utils/express-wrapper');

// Version endpoint
router.get('/', (_req, res) => res.json({ version: 'v1' }));

// Auth routes (public)
router.post('/auth/register', rateLimiters.auth, wrap(require('../auth/register')));
router.post('/auth/login', rateLimiters.auth, wrap(require('../auth/login')));
router.post('/auth/verify', wrap(require('../auth/verify')));

// Protected routes
router.use('/invoices', authenticate, wrap(require('./invoices/router')));
router.use('/customers', authenticate, wrap(require('../customers')));
router.use('/products', authenticate, wrap(require('../products')));
router.use('/payments', authenticate, wrap(require('../payments')));
router.use('/stripe-payment', authenticate, wrap(require('../stripe-payment')));
router.use('/payment-methods', wrap(require('../payment-methods'))); // Public

// AI routes (commented out - files don't exist yet)
// router.use('/ai-chat', authenticate, require('../ai-chat'));
// router.use('/ai-demo', authenticate, require('../ai-demo'));

// Access code routes
router.post('/access-codes/redeem', wrap(require('../access-codes/redeem')));
router.use('/access-codes', authenticate, wrap(require('../access-codes')));

// Exclusive content - uses access code OR JWT auth
router.use('/exclusive', accessCodeOrAuth, wrap(require('../exclusive/content')));

module.exports = router;