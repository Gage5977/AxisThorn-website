// Login API Endpoint
import crypto from 'crypto';
import { generateToken, generateRefreshToken, users } from '../middleware/auth.js';
import { createRateLimiter } from '../middleware/rate-limit.js';

// Strict rate limit for login attempts
const loginRateLimit = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: 'Too many login attempts. Please try again later.'
});

export default async function handler(req, res) {
    // Apply rate limiting
    await new Promise((resolve) => {
        loginRateLimit(req, res, resolve);
    });
    
    if (res.headersSent) return;

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'development' ? '*' : 'https://axisthorn.com');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Get user
        const user = users.get(email.toLowerCase());
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const hash = crypto.pbkdf2Sync(password, user.passwordSalt, 10000, 64, 'sha512').toString('hex');
        if (hash !== user.passwordHash) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if email is verified (skip for demo)
        if (!user.emailVerified && process.env.NODE_ENV === 'production') {
            return res.status(401).json({ error: 'Please verify your email before logging in' });
        }

        // Generate tokens
        const accessToken = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        // Return success
        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
}