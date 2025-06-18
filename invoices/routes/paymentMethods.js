const express = require('express');
const router = express.Router();
const { defaultPaymentMethods, PaymentMethod } = require('../config/paymentMethods');
const database = require('../db/Database');

// Initialize payment methods in database if not already present
if (database.getAllPaymentMethods().length === 0) {
  defaultPaymentMethods.forEach(method => {
    database.savePaymentMethod(method);
  });
}

// Get all payment methods
router.get('/', async (req, res) => {
  try {
    const { country, currency, enabled } = req.query;
    let methods = database.getAllPaymentMethods();
    
    // Filter by country
    if (country) {
      methods = methods.filter(method => 
        method.countries.includes(country.toUpperCase())
      );
    }
    
    // Filter by currency
    if (currency) {
      methods = methods.filter(method => 
        method.currencies.includes(currency.toLowerCase())
      );
    }
    
    // Filter by enabled status
    if (enabled !== undefined) {
      methods = methods.filter(method => 
        method.enabled === (enabled === 'true')
      );
    }
    
    res.json(methods.map(method => method.toJSON()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment method by ID
router.get('/:id', async (req, res) => {
  try {
    const method = database.getPaymentMethod(req.params.id);
    if (!method) {
      return res.status(404).json({ error: 'Payment method not found' });
    }
    res.json(method.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create custom payment method
router.post('/', async (req, res) => {
  try {
    const method = new PaymentMethod(req.body);
    database.savePaymentMethod(method);
    res.json(method.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update payment method
router.put('/:id', async (req, res) => {
  try {
    const method = database.getPaymentMethod(req.params.id);
    if (!method) {
      return res.status(404).json({ error: 'Payment method not found' });
    }
    
    method.update(req.body);
    database.savePaymentMethod(method);
    res.json(method.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enable/disable payment method
router.post('/:id/toggle', async (req, res) => {
  try {
    const method = database.getPaymentMethod(req.params.id);
    if (!method) {
      return res.status(404).json({ error: 'Payment method not found' });
    }
    
    method.enabled = !method.enabled;
    method.updatedAt = new Date().toISOString();
    database.savePaymentMethod(method);
    
    res.json({
      message: `Payment method ${method.enabled ? 'enabled' : 'disabled'}`,
      method: method.toJSON()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate payment processing fee
router.post('/:id/calculate-fee', async (req, res) => {
  try {
    const method = database.getPaymentMethod(req.params.id);
    if (!method) {
      return res.status(404).json({ error: 'Payment method not found' });
    }
    
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount required' });
    }
    
    const fee = method.calculateFee(amount);
    const total = amount + fee;
    
    res.json({
      amount: amount,
      fee: fee,
      total: total,
      method: {
        id: method.id,
        name: method.name,
        provider: method.provider,
        processingTime: method.processingTime
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment methods by type
router.get('/type/:type', async (req, res) => {
  try {
    const methods = database.getAllPaymentMethods()
      .filter(method => method.type === req.params.type);
    
    res.json(methods.map(method => method.toJSON()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get supported countries for all payment methods
router.get('/meta/countries', async (req, res) => {
  try {
    const methods = database.getAllPaymentMethods();
    const countries = [...new Set(methods.flatMap(method => method.countries))];
    
    res.json({
      countries: countries.sort(),
      count: countries.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get supported currencies for all payment methods
router.get('/meta/currencies', async (req, res) => {
  try {
    const methods = database.getAllPaymentMethods();
    const currencies = [...new Set(methods.flatMap(method => method.currencies))];
    
    res.json({
      currencies: currencies.sort(),
      count: currencies.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;