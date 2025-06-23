// Authentication Middleware
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import db from '../../lib/db.js';

// In production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-development-secret-key-change-this';

// Temporary refresh token storage - will be replaced with database sessions
const refreshTokens = new Set();

// Helper function to hash passwords
export function hashPassword(password, salt = null) {
    if (!salt) {
        salt = crypto.randomBytes(16).toString('hex');
    }
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return { hash, salt };
}

// Helper function to verify passwords
export function verifyPassword(password, hash, salt) {
    const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
}

// Initialize development admin user if needed
async function initDevAdmin() {
    if (process.env.NODE_ENV === 'development' && process.env.CREATE_DEV_ADMIN === 'true') {
        try {
            const existingAdmin = await db.user.findUnique({ where: { email: 'admin@axisthorn.com' } });
            if (!existingAdmin) {
                const { hash, salt } = hashPassword('TempAdmin123!');
                await db.user.create({
                    data: {
                        email: 'admin@axisthorn.com',
                        name: 'Development Admin',
                        role: 'admin',
                        passwordHash: hash,
                        passwordSalt: salt,
                        emailVerified: true
                    }
                });
                console.log('Development admin user created. Remove CREATE_DEV_ADMIN env var in production.');
            }
        } catch (error) {
            console.error('Failed to create dev admin:', error);
        }
    }
}

// Initialize on module load
initDevAdmin().catch(console.error);

// Verify JWT token
export async function verifyAuth(req) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { authenticated: false, error: 'No token provided' };
        }

        const token = authHeader.substring(7);
        
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // Check if user still exists
            const user = await db.user.findUnique({ where: { email: decoded.email } });
            if (!user) {
                return { authenticated: false, error: 'User not found' };
            }

            return {
                authenticated: true,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            };
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return { authenticated: false, error: 'Token expired' };
            }
            return { authenticated: false, error: 'Invalid token' };
        }
    } catch (error) {
        console.error('Auth verification error:', error);
        return { authenticated: false, error: 'Authentication failed' };
    }
}

// Generate JWT token
export function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
    };

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d'
    });
}

// Generate refresh token
export function generateRefreshToken(user) {
    const refreshToken = jwt.sign(
        { id: user.id, type: 'refresh' },
        JWT_SECRET,
        { expiresIn: '30d' }
    );
    
    refreshTokens.add(refreshToken);
    return refreshToken;
}

// Verify refresh token
export function verifyRefreshToken(token) {
    if (!refreshTokens.has(token)) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.type !== 'refresh') {
            return null;
        }
        return decoded;
    } catch (error) {
        refreshTokens.delete(token);
        return null;
    }
}

// Middleware function for Express-style routes
export async function requireAuth(req, res, next) {
    const authResult = await verifyAuth(req);
    
    if (!authResult.authenticated) {
        return res.status(401).json({ error: authResult.error || 'Authentication required' });
    }
    
    req.user = authResult.user;
    next();
}

// Middleware for admin-only routes
export async function requireAdmin(req, res, next) {
    const authResult = await verifyAuth(req);
    
    if (!authResult.authenticated) {
        return res.status(401).json({ error: authResult.error || 'Authentication required' });
    }
    
    if (authResult.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    
    req.user = authResult.user;
    next();
}

// Export utilities
export { refreshTokens, db };