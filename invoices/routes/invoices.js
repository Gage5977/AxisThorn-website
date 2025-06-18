const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const database = require('../db/Database');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PDFGenerator = require('../utils/PDFGenerator');
const EmailService = require('../utils/EmailService');

// Create invoice
router.post('/', async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    database.saveInvoice(invoice);
    res.json(invoice.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create invoice preview
router.post('/create_preview', async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    res.json(invoice.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update invoice
router.post('/:id', async (req, res) => {
  try {
    const invoice = database.getInvoice(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    if (invoice.status !== 'draft') {
      return res.status(400).json({ error: 'Cannot update finalized invoice' });
    }
    
    Object.keys(req.body).forEach(key => {
      if (key !== 'id' && invoice.hasOwnProperty(key)) {
        invoice[key] = req.body[key];
      }
    });
    
    invoice.calculateTotals();
    invoice.updatedAt = new Date().toISOString();
    database.saveInvoice(invoice);
    
    res.json(invoice.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = database.getInvoice(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = database.getAllInvoices(req.query);
    res.json(invoices.map(inv => inv.toJSON()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete invoice
router.delete('/:id', async (req, res) => {
  try {
    const invoice = database.getInvoice(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    if (invoice.status !== 'draft') {
      return res.status(400).json({ error: 'Cannot delete finalized invoice' });
    }
    
    database.deleteInvoice(req.params.id);
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Attach payment to invoice
router.post('/:id/attach_payment', async (req, res) => {
  try {
    const invoice = database.getInvoice(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    const { paymentIntentId } = req.body;
    
    // If Stripe is configured, verify the payment
    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'your_stripe_secret_key_here') {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status === 'succeeded') {
        invoice.pay(paymentIntent.amount / 100); // Convert from cents
      }
    } else {
      // For demo purposes without Stripe
      invoice.pay(req.body.amount);
    }
    
    database.saveInvoice(invoice);
    res.json(invoice.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Finalize invoice
router.post('/:id/finalize', async (req, res) => {
  try {
    const invoice = database.getInvoice(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    invoice.finalize();
    database.saveInvoice(invoice);
    res.json(invoice.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark invoice as uncollectible
router.post('/:id/mark_uncollectible', async (req, res) => {
  try {
    const invoice = database.getInvoice(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    invoice.markUncollectible();
    database.saveInvoice(invoice);
    res.json(invoice.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pay invoice
router.post('/:id/pay', async (req, res) => {
  try {
    const invoice = database.getInvoice(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    invoice.pay(req.body.amount);
    database.saveInvoice(invoice);
    res.json(invoice.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search invoices
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }
    
    const invoices = database.searchInvoices(q);
    res.json(invoices.map(inv => inv.toJSON()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send invoice
router.post('/:id/send', async (req, res) => {
  try {
    const invoice = database.getInvoice(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    if (invoice.status === 'draft') {
      invoice.finalize();
      database.saveInvoice(invoice);
    }
    
    // Generate PDF
    const pdfBuffer = await PDFGenerator.generateInvoicePDF(invoice);
    
    // Send email
    await EmailService.sendInvoice(invoice, pdfBuffer);
    
    res.json({ message: 'Invoice sent successfully', invoice: invoice.toJSON() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Void invoice
router.post('/:id/void', async (req, res) => {
  try {
    const invoice = database.getInvoice(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    invoice.void();
    database.saveInvoice(invoice);
    res.json(invoice.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download invoice PDF
router.get('/:id/download', async (req, res) => {
  try {
    const invoice = database.getInvoice(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    const pdfBuffer = await PDFGenerator.generateInvoicePDF(invoice);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.number}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add item to invoice
router.post('/:id/items', async (req, res) => {
  try {
    const invoice = database.getInvoice(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    if (invoice.status !== 'draft') {
      return res.status(400).json({ error: 'Cannot modify finalized invoice' });
    }
    
    const item = invoice.addItem(req.body);
    database.saveInvoice(invoice);
    res.json({ item, invoice: invoice.toJSON() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update invoice item
router.put('/:id/items/:itemId', async (req, res) => {
  try {
    const invoice = database.getInvoice(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    if (invoice.status !== 'draft') {
      return res.status(400).json({ error: 'Cannot modify finalized invoice' });
    }
    
    invoice.updateItem(req.params.itemId, req.body);
    database.saveInvoice(invoice);
    res.json(invoice.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete invoice item
router.delete('/:id/items/:itemId', async (req, res) => {
  try {
    const invoice = database.getInvoice(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    if (invoice.status !== 'draft') {
      return res.status(400).json({ error: 'Cannot modify finalized invoice' });
    }
    
    invoice.removeItem(req.params.itemId);
    database.saveInvoice(invoice);
    res.json(invoice.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;