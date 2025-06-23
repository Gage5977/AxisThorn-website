// Authentication Middleware
import jwt from 'jsonwebtoken';

// In production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-development-secret-key-change-this';

// Temporary in-memory storage - replace with database in production
const users = new Map();
const refreshTokens = new Set();

// Initialize with a demo admin user (remove in production)
users.set('admin@axisthorn.com', {
    id: 'admin_001',
    email: 'admin@axisthorn.com',
    name: 'Admin User',
    role: 'admin',
    // Password: Admin123! (hashed)
    passwordHash: 'a8d6f0e8c7b5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9',
    passwordSalt: '1234567890abcdef1234567890abcdef',
    createdAt: new Date().toISOString(),
    emailVerified: true
});

// Verify JWT token
export function verifyAuth(req) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { authenticated: false, error: 'No token provided' };
        }

        const token = authHeader.substring(7);
        
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // Check if user still exists
            const user = users.get(decoded.email);
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
export function requireAuth(req, res, next) {
    const authResult = verifyAuth(req);
    
    if (!authResult.authenticated) {
        return res.status(401).json({ error: authResult.error || 'Authentication required' });
    }
    
    req.user = authResult.user;
    next();
}

// Middleware for admin-only routes
export function requireAdmin(req, res, next) {
    const authResult = verifyAuth(req);
    
    if (!authResult.authenticated) {
        return res.status(401).json({ error: authResult.error || 'Authentication required' });
    }
    
    if (authResult.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    
    req.user = authResult.user;
    next();
}

// Export users for auth endpoints (temporary - replace with database)
export { users, refreshTokens };