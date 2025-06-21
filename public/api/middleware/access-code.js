const prisma = require('../../lib/prisma');
const { logger, createRateLimiter } = require('./security');

// Rate limiter for access code attempts (5 attempts per minute per IP)
const accessCodeLimiter = createRateLimiter(60 * 1000, 5); // 1 minute, 5 attempts

/**
 * Middleware to validate access codes for protected routes
 * Can be used for invite-only features or limited access
 */
async function requireAccessCode(req, res, next) {
  // Apply rate limiting first
  accessCodeLimiter(req, res, async () => {
    if (res.headersSent) return;
    
    const accessCode = req.headers['x-access-code'] || req.query.access_code;
  
  if (!accessCode) {
    return res.status(401).json({ 
      error: 'Access code required',
      message: 'Please provide a valid access code to access this resource'
    });
  }

  try {
    // Find the access code
    const codeRecord = await prisma.accessCode.findUnique({
      where: { code: accessCode }
    });

    if (!codeRecord) {
      logger.warn('Invalid access code attempted', { code: accessCode, ip: req.ip });
      return res.status(401).json({ 
        error: 'Invalid access code',
        message: 'The provided access code is not valid'
      });
    }

    // Check if expired
    if (codeRecord.expiresAt && new Date() > codeRecord.expiresAt) {
      logger.warn('Expired access code used', { code: accessCode, ip: req.ip });
      return res.status(401).json({ 
        error: 'Access code expired',
        message: 'This access code has expired'
      });
    }

    // Check usage limit
    if (codeRecord.maxUses && codeRecord.usedCount >= codeRecord.maxUses) {
      logger.warn('Access code usage limit exceeded', { code: accessCode, ip: req.ip });
      return res.status(401).json({ 
        error: 'Access code limit reached',
        message: 'This access code has reached its usage limit'
      });
    }

    // Record the usage
    await prisma.$transaction([
      // Increment usage count
      prisma.accessCode.update({
        where: { id: codeRecord.id },
        data: { usedCount: { increment: 1 } }
      }),
      // Create usage record
      prisma.accessCodeUse.create({
        data: {
          accessCodeId: codeRecord.id,
          userId: req.auth?.userId || null,
          email: req.body?.email || req.query?.email || null,
          ipAddress: req.ip,
          userAgent: req.get('user-agent')
        }
      })
    ]);

    // Add access code info to request
    req.accessCode = {
      id: codeRecord.id,
      code: codeRecord.code,
      description: codeRecord.description
    };

    logger.info('Access code validated', { 
      codeId: codeRecord.id, 
      ip: req.ip,
      remainingUses: codeRecord.maxUses ? codeRecord.maxUses - codeRecord.usedCount - 1 : 'unlimited'
    });

    next();
  } catch (error) {
    logger.error('Access code validation error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to validate access code'
    });
  }
  }); // End of rate limiter callback
}

/**
 * Middleware to optionally check access codes
 * Allows access with either JWT auth OR valid access code
 */
async function accessCodeOrAuth(req, res, next) {
  const accessCode = req.headers['x-access-code'] || req.query.access_code;
  
  // If no access code provided, fall back to JWT auth
  if (!accessCode) {
    return require('./auth').authenticate(req, res, next);
  }
  
  // Try access code validation
  requireAccessCode(req, res, (err) => {
    if (err || res.headersSent) return;
    
    // Access code valid, continue
    next();
  });
}

/**
 * Generate a new access code
 */
async function generateAccessCode(options = {}) {
  const {
    description,
    maxUses = 1,
    expiresIn = null, // hours
    createdById = null,
    customCode = null
  } = options;

  // Generate code if not provided
  const code = customCode || generateRandomCode();
  
  // Calculate expiration
  const expiresAt = expiresIn 
    ? new Date(Date.now() + expiresIn * 60 * 60 * 1000)
    : null;

  try {
    const accessCode = await prisma.accessCode.create({
      data: {
        code,
        description,
        maxUses,
        expiresAt,
        createdById
      }
    });

    return accessCode;
  } catch (error) {
    if (error.code === 'P2002') {
      // Unique constraint violation - code already exists
      throw new Error('Access code already exists');
    }
    throw error;
  }
}

/**
 * Generate a random access code
 */
function generateRandomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = 3;
  const segmentLength = 4;
  
  const code = [];
  for (let i = 0; i < segments; i++) {
    let segment = '';
    for (let j = 0; j < segmentLength; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    code.push(segment);
  }
  
  return code.join('-'); // e.g., "ABCD-1234-WXYZ"
}

/**
 * Validate an access code without using it
 */
async function validateAccessCode(code) {
  try {
    const codeRecord = await prisma.accessCode.findUnique({
      where: { code },
      include: {
        _count: {
          select: { uses: true }
        }
      }
    });

    if (!codeRecord) {
      return { valid: false, reason: 'not_found' };
    }

    if (codeRecord.expiresAt && new Date() > codeRecord.expiresAt) {
      return { valid: false, reason: 'expired' };
    }

    if (codeRecord.maxUses && codeRecord.usedCount >= codeRecord.maxUses) {
      return { valid: false, reason: 'limit_reached' };
    }

    return {
      valid: true,
      remainingUses: codeRecord.maxUses ? codeRecord.maxUses - codeRecord.usedCount : null,
      expiresAt: codeRecord.expiresAt,
      description: codeRecord.description
    };
  } catch (error) {
    logger.error('Access code validation error:', error);
    return { valid: false, reason: 'error' };
  }
}

module.exports = {
  requireAccessCode,
  accessCodeOrAuth,
  generateAccessCode,
  generateRandomCode,
  validateAccessCode
};