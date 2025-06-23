// Registration API Endpoint
import crypto from 'crypto';
import { users } from '../middleware/auth.js';
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
        if (users.has(normalizedEmail)) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

        // Create user
        const userId = `user_${crypto.randomBytes(8).toString('hex')}`;
        const user = {
            id: userId,
            email: normalizedEmail,
            name: name,
            company: company || null,
            passwordHash: hash,
            passwordSalt: salt,
            role: 'client',
            createdAt: new Date().toISOString(),
            emailVerified: false
        };

        // Save user
        users.set(normalizedEmail, user);

        // In production, send verification email here
        console.log('User registered:', normalizedEmail);

        // Return success
        res.status(201).json({
            success: true,
            message: 'Registration successful. Please check your email to verify your account.',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
}