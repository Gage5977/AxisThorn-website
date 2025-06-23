// Password Reset API Endpoint
import crypto from 'crypto';
import { users } from '../middleware/auth.js';
import { createRateLimiter } from '../middleware/rate-limit.js';
import { validateRequest } from '../middleware/validate-request.js';

// Rate limit for password reset
const resetRateLimit = createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 reset attempts per hour
    message: 'Too many password reset attempts. Please try again later.'
});

// In-memory storage for reset tokens (use Redis in production)
const resetTokens = new Map();

const requestResetSchema = {
    email: {
        required: true,
        type: 'email'
    }
};

const confirmResetSchema = {
    token: {
        required: true,
        type: 'string'
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
    }
};

export default async function handler(req, res) {
    // Apply rate limiting
    await new Promise((resolve) => {
        resetRateLimit(req, res, resolve);
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
        const { action } = req.query;

        if (action === 'request') {
            // Request password reset
            const validation = validateRequest(req.body, requestResetSchema);
            if (!validation.valid) {
                return res.status(400).json({ errors: validation.errors });
            }

            const { email } = req.body;
            const normalizedEmail = email.toLowerCase();
            const user = users.get(normalizedEmail);

            // Always return success to prevent email enumeration
            if (user) {
                // Generate reset token
                const resetToken = crypto.randomBytes(32).toString('hex');
                const expires = Date.now() + 3600000; // 1 hour

                resetTokens.set(resetToken, {
                    email: normalizedEmail,
                    expires
                });

                // In production, send email with reset link
                console.log('Password reset token:', resetToken);
                console.log('Reset link:', `https://axisthorn.com/reset-password?token=${resetToken}`);
            }

            res.status(200).json({
                success: true,
                message: 'If an account exists with this email, a password reset link has been sent.'
            });

        } else if (action === 'confirm') {
            // Confirm password reset
            const validation = validateRequest(req.body, confirmResetSchema);
            if (!validation.valid) {
                return res.status(400).json({ errors: validation.errors });
            }

            const { token, password } = req.body;
            const resetData = resetTokens.get(token);

            if (!resetData || resetData.expires < Date.now()) {
                resetTokens.delete(token);
                return res.status(400).json({ error: 'Invalid or expired reset token' });
            }

            const user = users.get(resetData.email);
            if (!user) {
                return res.status(400).json({ error: 'Invalid reset token' });
            }

            // Update password
            const salt = crypto.randomBytes(16).toString('hex');
            const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

            user.passwordHash = hash;
            user.passwordSalt = salt;
            users.set(resetData.email, user);

            // Clean up token
            resetTokens.delete(token);

            res.status(200).json({
                success: true,
                message: 'Password reset successful. You can now log in with your new password.'
            });

        } else {
            res.status(400).json({ error: 'Invalid action' });
        }

    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ error: 'Password reset failed' });
    }
}