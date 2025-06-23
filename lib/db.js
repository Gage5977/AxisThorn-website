// Database Connection Utility with Fallback Support
let PrismaClient;
let prisma = null;
let isUsingDatabase = false;

// Try to import Prisma Client
try {
    PrismaClient = require('@prisma/client').PrismaClient;
    
    // Only initialize if DATABASE_URL is set
    if (process.env.DATABASE_URL) {
        // Prevent multiple instances of Prisma Client in development
        const globalForPrisma = global;
        
        prisma = globalForPrisma.prisma || new PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        });
        
        if (process.env.NODE_ENV !== 'production') {
            globalForPrisma.prisma = prisma;
        }
        
        // Test connection
        prisma.$connect()
            .then(() => {
                console.log('✅ Connected to PostgreSQL database');
                isUsingDatabase = true;
            })
            .catch((error) => {
                console.error('❌ Database connection failed:', error.message);
                console.log('⚠️  Falling back to in-memory storage');
                prisma = null;
            });
    } else {
        console.log('⚠️  No DATABASE_URL found, using in-memory storage');
    }
} catch (error) {
    console.log('⚠️  Prisma not available, using in-memory storage');
}

// In-memory storage fallback
const memoryStorage = {
    users: new Map(),
    sessions: new Map(),
    documents: new Map(),
    invoices: new Map(),
    notes: new Map(),
    activities: []
};

// Unified database interface
const db = {
    // User operations
    user: {
        async findUnique({ where }) {
            if (prisma) {
                return await prisma.user.findUnique({ where });
            }
            
            if (where.id) {
                return memoryStorage.users.get(where.id);
            }
            if (where.email) {
                return Array.from(memoryStorage.users.values())
                    .find(u => u.email === where.email);
            }
            return null;
        },
        
        async create({ data }) {
            if (prisma) {
                return await prisma.user.create({ data });
            }
            
            const id = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const user = {
                id,
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            memoryStorage.users.set(id, user);
            return user;
        },
        
        async update({ where, data }) {
            if (prisma) {
                return await prisma.user.update({ where, data });
            }
            
            const user = await this.findUnique({ where });
            if (!user) throw new Error('User not found');
            
            const updated = {
                ...user,
                ...data,
                updatedAt: new Date()
            };
            memoryStorage.users.set(user.id, updated);
            return updated;
        },
        
        async findMany({ where = {}, orderBy, take, skip } = {}) {
            if (prisma) {
                return await prisma.user.findMany({ where, orderBy, take, skip });
            }
            
            let users = Array.from(memoryStorage.users.values());
            
            // Apply filters
            if (where.role) {
                users = users.filter(u => u.role === where.role);
            }
            
            // Apply sorting
            if (orderBy) {
                const field = Object.keys(orderBy)[0];
                const direction = orderBy[field];
                users.sort((a, b) => {
                    if (direction === 'asc') {
                        return a[field] > b[field] ? 1 : -1;
                    }
                    return a[field] < b[field] ? 1 : -1;
                });
            }
            
            // Apply pagination
            if (skip) {
                users = users.slice(skip);
            }
            if (take) {
                users = users.slice(0, take);
            }
            
            return users;
        }
    },
    
    // Session operations
    session: {
        async create({ data }) {
            if (prisma) {
                return await prisma.session.create({ data });
            }
            
            const id = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const session = {
                id,
                ...data,
                createdAt: new Date()
            };
            memoryStorage.sessions.set(id, session);
            return session;
        },
        
        async findUnique({ where }) {
            if (prisma) {
                return await prisma.session.findUnique({ where });
            }
            
            return memoryStorage.sessions.get(where.id);
        },
        
        async delete({ where }) {
            if (prisma) {
                return await prisma.session.delete({ where });
            }
            
            const session = memoryStorage.sessions.get(where.id);
            memoryStorage.sessions.delete(where.id);
            return session;
        }
    },
    
    // Database utilities
    async $disconnect() {
        if (prisma) {
            await prisma.$disconnect();
        }
    },
    
    isUsingDatabase() {
        return isUsingDatabase;
    }
};

// Helper function to handle database errors
export function handleDbError(error) {
    console.error('Database error:', error);
    
    if (error.code === 'P2002') {
        return { error: 'A record with this value already exists' };
    }
    
    if (error.code === 'P2025') {
        return { error: 'Record not found' };
    }
    
    if (error.code === 'P2003') {
        return { error: 'Invalid reference' };
    }
    
    return { error: 'Database operation failed' };
}

// Pagination helper
export function getPaginationParams(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const skip = (page - 1) * limit;
    
    return { skip, take: limit, page, limit };
}

// Export database interface
export default db;
export { db, prisma, memoryStorage };