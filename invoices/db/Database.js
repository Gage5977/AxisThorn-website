class Database {
  constructor() {
    this.invoices = new Map();
    this.customers = new Map();
    this.products = new Map();
    this.paymentMethods = new Map();
    this.checkoutSessions = new Map();
  }

  // Invoice methods
  saveInvoice(invoice) {
    this.invoices.set(invoice.id, invoice);
    return invoice;
  }

  getInvoice(id) {
    return this.invoices.get(id);
  }

  getAllInvoices(filters = {}) {
    let invoices = Array.from(this.invoices.values());
    
    if (filters.status) {
      invoices = invoices.filter(inv => inv.status === filters.status);
    }
    
    if (filters.customer) {
      invoices = invoices.filter(inv => inv.customer === filters.customer);
    }
    
    if (filters.startDate) {
      invoices = invoices.filter(inv => new Date(inv.invoiceDate) >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      invoices = invoices.filter(inv => new Date(inv.invoiceDate) <= new Date(filters.endDate));
    }
    
    return invoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  deleteInvoice(id) {
    return this.invoices.delete(id);
  }

  searchInvoices(query) {
    const searchTerm = query.toLowerCase();
    return Array.from(this.invoices.values()).filter(invoice => {
      return invoice.number.toLowerCase().includes(searchTerm) ||
             invoice.customerName.toLowerCase().includes(searchTerm) ||
             invoice.customerEmail.toLowerCase().includes(searchTerm) ||
             (invoice.notes && invoice.notes.toLowerCase().includes(searchTerm));
    });
  }

  // Customer methods
  saveCustomer(customer) {
    this.customers.set(customer.id, customer);
    return customer;
  }

  getCustomer(id) {
    return this.customers.get(id);
  }

  getAllCustomers() {
    return Array.from(this.customers.values())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  deleteCustomer(id) {
    return this.customers.delete(id);
  }

  // Product methods
  saveProduct(product) {
    this.products.set(product.id, product);
    return product;
  }

  getProduct(id) {
    return this.products.get(id);
  }

  getAllProducts() {
    return Array.from(this.products.values())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  deleteProduct(id) {
    return this.products.delete(id);
  }

  // Payment method methods
  savePaymentMethod(paymentMethod) {
    this.paymentMethods.set(paymentMethod.id, paymentMethod);
    return paymentMethod;
  }

  getPaymentMethod(id) {
    return this.paymentMethods.get(id);
  }

  getAllPaymentMethods() {
    return Array.from(this.paymentMethods.values())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  deletePaymentMethod(id) {
    return this.paymentMethods.delete(id);
  }

  // Checkout session methods
  saveCheckoutSession(session) {
    this.checkoutSessions.set(session.id, session);
    return session;
  }

  getCheckoutSession(id) {
    return this.checkoutSessions.get(id);
  }

  getAllCheckoutSessions() {
    return Array.from(this.checkoutSessions.values())
      .sort((a, b) => b.created - a.created);
  }

  deleteCheckoutSession(id) {
    return this.checkoutSessions.delete(id);
  }
}

// Singleton instance
const database = new Database();

module.exports = database;