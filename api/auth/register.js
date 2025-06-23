// Registration API Endpoint
import crypto from 'crypto';
import db from '../../lib/db.js';
import { hashPassword, generateToken, generateRefreshToken } from '../middleware/auth.js';
import { createRateLimiter } from '../middleware/rate-limit.js';
import { validateRequest } from '../middleware/validate-request.js';

// Standard rate limit for registration
const registerRateLimit = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // 3 registration attempts per window
    message: 'Too many registration attempts. Please try again later.'
});

const registerSchema = {
    email: {
        required: true,
        type: 'email'
    },
    password: {
        required: true,
        type: 'string',
        minLength: 8,
        custom: (value) => {
            if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
            if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
            if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
            if (!/(?=.*[@$!%*?&])/.test(value)) return 'Password must contain at least one special character';
            return null;
        }
    },
    name: {
        required: true,
        type: 'string',
        minLength: 2,
        maxLength: 100
    },
    company: {
        type: 'string',
        maxLength: 100
    }
};

export default async function handler(req, res) {
    // Apply rate limiting
    await new Promise((resolve) => {
        registerRateLimit(req, res, resolve);
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
        // Validate request
        const validation = validateRequest(req.body, registerSchema);
        if (!validation.valid) {
            return res.status(400).json({ errors: validation.errors });
        }

        const { email, password, name, company } = req.body;
        const normalizedEmail = email.toLowerCase();

        // Check if user already exists
        const existingUser = await db.user.findUnique({ where: { email: normalizedEmail } });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Hash password
        const { hash, salt } = hashPassword(password);

        // Create user in database
        const user = await db.user.create({
            data: {
                email: normalizedEmail,
                name: name,
                company: company || null,
                passwordHash: hash,
                passwordSalt: salt,
                role: 'client',
                emailVerified: false
            }
        });

        // Generate tokens
        const accessToken = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        // Create session
        await db.session.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            }
        });

        // In production, send verification email here
        console.log('User registered:', normalizedEmail);

        // Return success with tokens
        res.status(201).json({
            success: true,
            message: 'Registration successful. Please check your email to verify your account.',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                emailVerified: user.emailVerified
            },
            tokens: {
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
}