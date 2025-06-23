// Consolidated Auth Handlers
import jwt from 'jsonwebtoken';
import db from '../../db.js';
import { validateEmail, sanitizeInput, validateRequest } from '../../validation.js';
import { hashPassword, verifyPassword, generateToken, generateRefreshToken, verifyRefreshToken } from '../../../api/middleware/auth.js';
import { sendEmail, emailTemplates } from '../../email.js';
import crypto from 'crypto';

// Login handler
export async function login(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const schema = {
        email: { required: true, type: 'email' },
        password: { required: true, type: 'string', minLength: 6 }
    };

    const validation = validateRequest(req.body, schema);
    if (!validation.valid) {
        return res.status(400).json({ errors: validation.errors });
    }

    try {
        const { email, password } = validation.data;
        
        // Find user
        const user = await db.user.findUnique({ 
            where: { email: email.toLowerCase() } 
        });

        if (!user || !user.passwordHash) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const validPassword = verifyPassword(password, user.passwordHash, user.passwordSalt);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate tokens
        const accessToken = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        res.status(200).json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Register handler
export async function register(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const schema = {
        email: { required: true, type: 'email' },
        password: { required: true, type: 'string', minLength: 8 },
        name: { required: true, type: 'string', minLength: 2 },
        company: { required: false, type: 'string' }
    };

    const validation = validateRequest(req.body, schema);
    if (!validation.valid) {
        return res.status(400).json({ errors: validation.errors });
    }

    try {
        const { email, password, name, company } = validation.data;
        
        // Check if user exists
        const existingUser = await db.user.findUnique({ 
            where: { email: email.toLowerCase() } 
        });

        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Hash password
        const { hash, salt } = hashPassword(password);

        // Create user
        const user = await db.user.create({
            data: {
                email: email.toLowerCase(),
                name: sanitizeInput(name),
                company: company ? sanitizeInput(company) : null,
                passwordHash: hash,
                passwordSalt: salt,
                role: 'user',
                emailVerified: false
            }
        });

        // Generate tokens
        const accessToken = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        // Send welcome email
        await sendEmail({
            to: user.email,
            subject: 'Welcome to Axis Thorn',
            html: emailTemplates.welcome({ name: user.name })
        });

        res.status(201).json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Refresh token handler
export async function refresh(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token required' });
    }

    try {
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        // Get user
        const user = await db.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Generate new access token
        const accessToken = generateToken(user);

        res.status(200).json({ accessToken });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Reset password handler
export async function resetPassword(req, res) {
    if (req.method === 'POST' && !req.body.token) {
        // Request password reset
        const { email } = req.body;
        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Valid email required' });
        }

        try {
            const user = await db.user.findUnique({ 
                where: { email: email.toLowerCase() } 
            });

            if (user) {
                // Generate reset token
                const resetToken = crypto.randomBytes(32).toString('hex');
                const resetExpires = new Date(Date.now() + 3600000); // 1 hour

                // Save token
                await db.user.update({
                    where: { id: user.id },
                    data: {
                        resetToken,
                        resetTokenExpires: resetExpires
                    }
                });

                // Send email
                await sendEmail({
                    to: user.email,
                    subject: 'Password Reset Request',
                    html: emailTemplates.passwordReset({
                        name: user.name,
                        resetLink: `${process.env.APP_URL}/reset-password?token=${resetToken}`
                    })
                });
            }

            // Always return success to prevent email enumeration
            res.status(200).json({ 
                message: 'If an account exists, a reset email has been sent' 
            });
        } catch (error) {
            console.error('Password reset error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else if (req.method === 'POST' && req.body.token) {
        // Reset password with token
        const { token, password } = req.body;
        
        if (!token || !password || password.length < 8) {
            return res.status(400).json({ 
                error: 'Valid token and password (min 8 chars) required' 
            });
        }

        try {
            const user = await db.user.findFirst({
                where: {
                    resetToken: token,
                    resetTokenExpires: { gt: new Date() }
                }
            });

            if (!user) {
                return res.status(400).json({ error: 'Invalid or expired token' });
            }

            // Hash new password
            const { hash, salt } = hashPassword(password);

            // Update user
            await db.user.update({
                where: { id: user.id },
                data: {
                    passwordHash: hash,
                    passwordSalt: salt,
                    resetToken: null,
                    resetTokenExpires: null
                }
            });

            res.status(200).json({ message: 'Password reset successful' });
        } catch (error) {
            console.error('Password reset error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default {
    login,
    register,
    refresh,
    resetPassword
};