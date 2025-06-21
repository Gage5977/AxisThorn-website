const prisma = require('../../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');
const { generateAccessCode, validateAccessCode } = require('../middleware/access-code');
const { logger } = require('../middleware/security');
const Joi = require('joi');

// Input validation schemas
const createSchema = Joi.object({
  description: Joi.string().optional(),
  maxUses: Joi.number().integer().min(1).max(1000).optional(),
  expiresIn: Joi.number().min(1).max(8760).optional(), // max 1 year in hours
  customCode: Joi.string().pattern(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/).optional()
});

const validateSchema = Joi.object({
  code: Joi.string().required()
});

module.exports = async function handler(req, res) {
  // Only admins can manage access codes
  await new Promise((resolve, reject) => {
    authenticate(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  }).catch(() => {});

  if (!req.auth) return;

  // Admin only
  if (req.auth.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await listAccessCodes(req, res);
      
      case 'POST':
        if (req.query.action === 'validate') {
          return await checkAccessCode(req, res);
        }
        return await createAccessCode(req, res);
      
      case 'DELETE':
        return await deleteAccessCode(req, res);
      
      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    logger.error('Access code management error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

async function listAccessCodes(req, res) {
  const { active = 'true', limit = '50', offset = '0' } = req.query;
  
  const where = {};
  
  // Filter active codes
  if (active === 'true') {
    where.OR = [
      { expiresAt: null },
      { expiresAt: { gt: new Date() } }
    ];
  }

  const [codes, total] = await Promise.all([
    prisma.accessCode.findMany({
      where,
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { uses: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    }),
    prisma.accessCode.count({ where })
  ]);

  // Format response
  const formattedCodes = codes.map(code => ({
    id: code.id,
    code: code.code,
    description: code.description,
    maxUses: code.maxUses,
    usedCount: code.usedCount,
    remainingUses: code.maxUses ? code.maxUses - code.usedCount : null,
    expiresAt: code.expiresAt,
    createdAt: code.createdAt,
    createdBy: code.createdBy,
    totalUses: code._count.uses,
    isExpired: code.expiresAt ? new Date() > code.expiresAt : false,
    isExhausted: code.maxUses ? code.usedCount >= code.maxUses : false
  }));

  return res.status(200).json({
    codes: formattedCodes,
    total,
    limit: parseInt(limit),
    offset: parseInt(offset)
  });
}

async function createAccessCode(req, res) {
  const { error, value } = createSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const code = await generateAccessCode({
      ...value,
      createdById: req.auth.userId
    });

    logger.info('Access code created', {
      codeId: code.id,
      createdBy: req.auth.userId,
      maxUses: code.maxUses
    });

    return res.status(201).json({
      id: code.id,
      code: code.code,
      description: code.description,
      maxUses: code.maxUses,
      expiresAt: code.expiresAt,
      createdAt: code.createdAt
    });
  } catch (error) {
    if (error.message === 'Access code already exists') {
      return res.status(409).json({ error: 'Access code already exists' });
    }
    throw error;
  }
}

async function checkAccessCode(req, res) {
  const { error, value } = validateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const result = await validateAccessCode(value.code);
  
  return res.status(200).json(result);
}

async function deleteAccessCode(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Access code ID required' });
  }

  try {
    await prisma.accessCode.delete({
      where: { id }
    });

    logger.info('Access code deleted', {
      codeId: id,
      deletedBy: req.auth.userId
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Access code not found' });
    }
    throw error;
  }
}