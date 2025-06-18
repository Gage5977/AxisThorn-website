const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();

class Invoice {
  constructor(data = {}) {
    this.id = data.id || `inv_${uuidv4()}`;
    this.number = data.number || this.generateInvoiceNumber();
    this.customer = data.customer || null;
    this.customerName = data.customerName || '';
    this.customerEmail = data.customerEmail || '';
    this.customerAddress = data.customerAddress || {};
    this.items = data.items || [];
    this.status = data.status || 'draft';
    this.currency = data.currency || 'usd';
    this.subtotal = 0;
    this.tax = data.tax || 0;
    this.taxRate = data.taxRate || 0;
    this.discount = data.discount || 0;
    this.discountType = data.discountType || 'fixed';
    this.total = 0;
    this.amountPaid = data.amountPaid || 0;
    this.amountDue = 0;
    this.dueDate = data.dueDate || null;
    this.invoiceDate = data.invoiceDate || new Date().toISOString();
    this.notes = data.notes || '';
    this.terms = data.terms || '';
    this.footer = data.footer || '';
    this.paymentMethods = data.paymentMethods || []; // Allowed payment methods for this invoice
    this.paymentInstructions = data.paymentInstructions || {};
    this.paymentUrl = data.paymentUrl || null;
    this.metadata = data.metadata || {};
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    this.paidAt = data.paidAt || null;
    this.voidedAt = data.voidedAt || null;
    this.finalizedAt = data.finalizedAt || null;
    
    this.calculateTotals();
  }

  generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}${month}-${random}`;
  }

  calculateTotals() {
    this.subtotal = this.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice;
      return sum + itemTotal;
    }, 0);

    let discountAmount = 0;
    if (this.discountType === 'percentage') {
      discountAmount = (this.subtotal * this.discount) / 100;
    } else {
      discountAmount = this.discount;
    }

    const subtotalAfterDiscount = this.subtotal - discountAmount;
    this.tax = (subtotalAfterDiscount * this.taxRate) / 100;
    this.total = subtotalAfterDiscount + this.tax;
    this.amountDue = this.total - this.amountPaid;
  }

  addItem(item) {
    const newItem = {
      id: item.id || `item_${uuidv4()}`,
      description: item.description || '',
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice || 0,
      amount: (item.quantity || 1) * (item.unitPrice || 0),
      taxable: item.taxable !== undefined ? item.taxable : true,
      metadata: item.metadata || {}
    };
    this.items.push(newItem);
    this.calculateTotals();
    return newItem;
  }

  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.calculateTotals();
  }

  updateItem(itemId, updates) {
    const itemIndex = this.items.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      this.items[itemIndex] = { ...this.items[itemIndex], ...updates };
      this.items[itemIndex].amount = this.items[itemIndex].quantity * this.items[itemIndex].unitPrice;
      this.calculateTotals();
    }
  }

  finalize() {
    if (this.status === 'draft') {
      this.status = 'open';
      this.finalizedAt = new Date().toISOString();
      this.updatedAt = new Date().toISOString();
    }
  }

  pay(amount = null) {
    const paymentAmount = amount || this.amountDue;
    this.amountPaid += paymentAmount;
    this.calculateTotals();
    
    if (this.amountDue <= 0) {
      this.status = 'paid';
      this.paidAt = new Date().toISOString();
    }
    this.updatedAt = new Date().toISOString();
  }

  void() {
    if (this.status !== 'void') {
      this.status = 'void';
      this.voidedAt = new Date().toISOString();
      this.updatedAt = new Date().toISOString();
    }
  }

  markUncollectible() {
    if (this.status === 'open') {
      this.status = 'uncollectible';
      this.updatedAt = new Date().toISOString();
    }
  }

  toJSON() {
    return {
      id: this.id,
      number: this.number,
      customer: this.customer,
      customerName: this.customerName,
      customerEmail: this.customerEmail,
      customerAddress: this.customerAddress,
      items: this.items,
      status: this.status,
      currency: this.currency,
      subtotal: this.subtotal,
      tax: this.tax,
      taxRate: this.taxRate,
      discount: this.discount,
      discountType: this.discountType,
      total: this.total,
      amountPaid: this.amountPaid,
      amountDue: this.amountDue,
      dueDate: this.dueDate,
      invoiceDate: this.invoiceDate,
      notes: this.notes,
      terms: this.terms,
      footer: this.footer,
      paymentMethods: this.paymentMethods,
      paymentInstructions: this.paymentInstructions,
      paymentUrl: this.paymentUrl,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      paidAt: this.paidAt,
      voidedAt: this.voidedAt,
      finalizedAt: this.finalizedAt
    };
  }
}

module.exports = Invoice;