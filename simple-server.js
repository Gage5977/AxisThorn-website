#!/usr/bin/env node

// Simple server for testing access code implementation
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Simple logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// 1. Health route
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'axis-thorn-api',
      version: 'v1',
      database: 'connected',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

// 2. API version route
app.get('/api/v1', (req, res) => {
  res.json({
    version: 'v1',
    status: 'stable',
    endpoints: [
      '/api/v1/auth/login',
      '/api/v1/invoices',
      '/api/v1/access-codes/redeem',
      '/api/v1/exclusive'
    ]
  });
});

// 3. Login flow
app.post('/api/v1/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !await bcrypt.compare(password || 'demo123', user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '24h' }
    );
    
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Auth middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// 4. Protected endpoint
app.get('/api/v1/invoices', authenticate, async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { userId: req.user.userId },
      include: { customer: true, items: true }
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// 5. Access code redeem
app.post('/api/v1/access-codes/redeem', async (req, res) => {
  const { code } = req.body;
  
  try {
    const accessCode = await prisma.accessCode.findUnique({ where: { code } });
    
    if (!accessCode) {
      return res.status(404).json({ valid: false, error: 'Invalid code' });
    }
    
    if (accessCode.expiresAt && new Date() > accessCode.expiresAt) {
      return res.status(400).json({ valid: false, error: 'Code expired' });
    }
    
    if (accessCode.maxUses && accessCode.usedCount >= accessCode.maxUses) {
      return res.status(400).json({ valid: false, error: 'Code limit reached' });
    }
    
    // Update usage
    await prisma.accessCode.update({
      where: { id: accessCode.id },
      data: { usedCount: { increment: 1 } }
    });
    
    res.json({ valid: true, code: accessCode.code });
  } catch (error) {
    res.status(500).json({ error: 'Failed to validate code' });
  }
});

// 6. Exclusive content
app.get('/api/v1/exclusive', async (req, res) => {
  const accessCode = req.query.access_code || req.headers['x-access-code'];
  
  if (!accessCode) {
    return res.status(401).json({ error: 'Access code required' });
  }
  
  try {
    const code = await prisma.accessCode.findUnique({ where: { code: accessCode } });
    
    if (!code || (code.expiresAt && new Date() > code.expiresAt)) {
      return res.status(401).json({ error: 'Invalid or expired access code' });
    }
    
    res.json({
      access: 'granted',
      content: 'Welcome to exclusive content!',
      features: ['Premium analytics', 'Priority support', 'Advanced tools']
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to validate access' });
  }
});

// Start server
async function start() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
    
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

start();