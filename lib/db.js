// Database Connection Utility
import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = global;

export const prisma = globalForPrisma.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

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

// Transaction helper
export async function withTransaction(callback) {
    try {
        return await prisma.$transaction(callback);
    } catch (error) {
        throw handleDbError(error);
    }
}

// Pagination helper
export function getPaginationParams(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const skip = (page - 1) * limit;
    
    return { skip, take: limit, page, limit };
}

// Export Prisma types
export * from '@prisma/client';