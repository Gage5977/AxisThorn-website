// Access code redemption endpoint
const prisma = require('../../lib/prisma');
const { logger } = require('../middleware/security');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Access code required' });
  }

  try {
    const accessCode = await prisma.accessCode.findUnique({
      where: { code }
    });

    if (!accessCode) {
      logger.warn('Invalid access code attempted', { code, ip: req.ip });
      return res.status(404).json({ valid: false, error: 'Invalid code' });
    }

    // Check if expired
    if (accessCode.expiresAt && new Date() > accessCode.expiresAt) {
      return res.status(400).json({ valid: false, error: 'Code expired' });
    }

    // Check usage limit
    if (accessCode.maxUses && accessCode.usedCount >= accessCode.maxUses) {
      return res.status(400).json({ valid: false, error: 'Code limit reached' });
    }

    // Update usage count
    await prisma.accessCode.update({
      where: { id: accessCode.id },
      data: { usedCount: { increment: 1 } }
    });

    logger.info('Access code redeemed', { 
      codeId: accessCode.id, 
      ip: req.ip,
      remainingUses: accessCode.maxUses ? accessCode.maxUses - accessCode.usedCount - 1 : 'unlimited'
    });

    res.json({ 
      valid: true,
      code: accessCode.code
    });
  } catch (error) {
    logger.error('Access code redemption error:', error);
    res.status(500).json({ error: 'Failed to validate code' });
  }
};