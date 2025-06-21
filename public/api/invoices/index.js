// Vercel serverless function for invoice management
const { v4: uuidv4 } = require('uuid');

// In-memory storage for demo (replace with database in production)
let invoices = [];
let customers = [];
let products = [];

// Invoice model
class Invoice {
  constructor(data) {
    this.id = data.id || `inv_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    this.invoice_number = data.invoice_number || `INV-${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;
    this.customer = data.customer || {};
    this.items = data.items || [];
    this.subtotal = parseFloat(data.subtotal) || 0;
    this.discount = parseFloat(data.discount) || 0;
    this.discountType = data.discountType || 'fixed';
    this.tax = parseFloat(data.tax) || 0;
    this.taxRate = parseFloat(data.taxRate) || 0;
    this.total = parseFloat(data.total) || 0;
    this.amount_due = parseFloat(data.amount_due) || this.total;
    this.amount_paid = parseFloat(data.amount_paid) || 0;
    this.status = data.status || 'draft';
    this.payment_status = data.payment_status || 'unpaid';
    this.notes = data.notes || '';
    this.terms = data.terms || '';
    this.created_at = data.created_at || new Date().toISOString();
    this.due_date = data.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      invoice_number: this.invoice_number,
      customer: this.customer,
      items: this.items,
      subtotal: this.subtotal,
      discount: this.discount,
      discountType: this.discountType,
      tax: this.tax,
      taxRate: this.taxRate,
      total: this.total,
      amount_due: this.amount_due,
      amount_paid: this.amount_paid,
      status: this.status,
      payment_status: this.payment_status,
      notes: this.notes,
      terms: this.terms,
      created_at: this.created_at,
      due_date: this.due_date
    };
  }
}

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
    case 'GET':
      // List all invoices
      const invoiceList = invoices.map(inv => inv.toJSON());
      return res.status(200).json(invoiceList);

    case 'POST':
      // Create new invoice
      const invoiceData = req.body;
        
      // Calculate totals
      let subtotal = 0;
      if (invoiceData.items && Array.isArray(invoiceData.items)) {
        subtotal = invoiceData.items.reduce((sum, item) => {
          return sum + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0));
        }, 0);
      }

      let discountAmount = 0;
      if (invoiceData.discount) {
        if (invoiceData.discountType === 'percentage') {
          discountAmount = subtotal * (parseFloat(invoiceData.discount) / 100);
        } else {
          discountAmount = parseFloat(invoiceData.discount);
        }
      }

      const afterDiscount = subtotal - discountAmount;
      const taxAmount = afterDiscount * (parseFloat(invoiceData.taxRate || 0) / 100);
      const total = afterDiscount + taxAmount;

      const newInvoice = new Invoice({
        ...invoiceData,
        subtotal: subtotal,
        tax: taxAmount,
        total: total,
        amount_due: total
      });

      invoices.push(newInvoice);
      return res.status(201).json(newInvoice.toJSON());

    default:
      res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Invoice API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};