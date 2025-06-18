const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();

class CheckoutSession {
  constructor(data = {}) {
    this.id = data.id || `cs_${uuidv4()}`;
    this.object = 'checkout.session';
    this.invoice = data.invoice || null;
    this.customer = data.customer || null;
    this.mode = data.mode || 'payment'; // payment, setup, subscription
    this.status = data.status || 'open'; // open, complete, expired
    
    // URLs
    this.success_url = data.success_url || null;
    this.cancel_url = data.cancel_url || null;
    this.url = data.url || null;
    
    // Payment details
    this.amount_total = data.amount_total || 0;
    this.amount_subtotal = data.amount_subtotal || 0;
    this.currency = data.currency || 'usd';
    this.payment_status = data.payment_status || 'unpaid'; // paid, unpaid, no_payment_required
    
    // Payment method configuration
    this.payment_method_types = data.payment_method_types || ['card'];
    this.payment_method_options = data.payment_method_options || {};
    this.payment_intent = data.payment_intent || null;
    
    // Line items
    this.line_items = data.line_items || [];
    
    // Customer details
    this.customer_details = data.customer_details || null;
    this.customer_email = data.customer_email || null;
    
    // Session configuration
    this.expires_at = data.expires_at || this.generateExpiryTime();
    this.allow_promotion_codes = data.allow_promotion_codes || false;
    this.automatic_tax = data.automatic_tax || { enabled: false };
    this.billing_address_collection = data.billing_address_collection || 'auto';
    this.shipping_address_collection = data.shipping_address_collection || null;
    
    // Metadata
    this.metadata = data.metadata || {};
    this.client_reference_id = data.client_reference_id || null;
    
    // Timestamps
    this.created = data.created || Math.floor(Date.now() / 1000);
    this.livemode = data.livemode || false;
    
    // Generate checkout URL if not provided
    if (!this.url) {
      this.url = this.generateCheckoutUrl();
    }
  }

  generateExpiryTime() {
    // Checkout sessions expire after 24 hours by default
    return Math.floor(Date.now() / 1000) + (24 * 60 * 60);
  }

  generateCheckoutUrl() {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/checkout/${this.id}`;
  }

  addLineItem(item) {
    const lineItem = {
      price_data: {
        currency: this.currency,
        product_data: {
          name: item.name || item.description,
          description: item.description || '',
          metadata: item.metadata || {}
        },
        unit_amount: Math.round((item.unit_amount || 0) * 100) // Convert to cents
      },
      quantity: item.quantity || 1,
      adjustable_quantity: item.adjustable_quantity || { enabled: false }
    };

    this.line_items.push(lineItem);
    this.recalculateAmounts();
    return lineItem;
  }

  recalculateAmounts() {
    this.amount_subtotal = this.line_items.reduce((total, item) => {
      return total + (item.price_data.unit_amount * item.quantity);
    }, 0);

    // Add tax if automatic tax is enabled
    let taxAmount = 0;
    if (this.automatic_tax.enabled && this.automatic_tax.tax_rate) {
      taxAmount = Math.round(this.amount_subtotal * (this.automatic_tax.tax_rate / 100));
    }

    this.amount_total = this.amount_subtotal + taxAmount;
  }

  complete() {
    this.status = 'complete';
    this.payment_status = 'paid';
    return this;
  }

  expire() {
    this.status = 'expired';
    return this;
  }

  isExpired() {
    return Date.now() / 1000 > this.expires_at;
  }

  // Create Stripe-compatible checkout session object
  toStripeFormat() {
    return {
      id: this.id,
      object: this.object,
      after_expiration: null,
      allow_promotion_codes: this.allow_promotion_codes,
      amount_subtotal: this.amount_subtotal,
      amount_total: this.amount_total,
      automatic_tax: this.automatic_tax,
      billing_address_collection: this.billing_address_collection,
      cancel_url: this.cancel_url,
      client_reference_id: this.client_reference_id,
      consent: null,
      consent_collection: null,
      created: this.created,
      currency: this.currency,
      custom_fields: [],
      custom_text: {},
      customer: this.customer,
      customer_creation: 'if_required',
      customer_details: this.customer_details,
      customer_email: this.customer_email,
      expires_at: this.expires_at,
      invoice: this.invoice,
      invoice_creation: null,
      line_items: {
        object: 'list',
        data: this.line_items,
        has_more: false,
        total_count: this.line_items.length,
        url: `/v1/checkout/sessions/${this.id}/line_items`
      },
      livemode: this.livemode,
      locale: null,
      metadata: this.metadata,
      mode: this.mode,
      payment_intent: this.payment_intent,
      payment_link: null,
      payment_method_collection: 'if_required',
      payment_method_configuration_details: null,
      payment_method_options: this.payment_method_options,
      payment_method_types: this.payment_method_types,
      payment_status: this.payment_status,
      phone_number_collection: { enabled: false },
      recovered_from: null,
      setup_intent: null,
      shipping_address_collection: this.shipping_address_collection,
      shipping_cost: null,
      shipping_details: null,
      shipping_options: [],
      status: this.status,
      submit_type: null,
      subscription: null,
      success_url: this.success_url,
      total_details: {
        amount_discount: 0,
        amount_shipping: 0,
        amount_tax: this.amount_total - this.amount_subtotal
      },
      ui_mode: 'hosted',
      url: this.url
    };
  }

  toJSON() {
    return this.toStripeFormat();
  }

  // Static method to create checkout session from invoice
  static fromInvoice(invoice, options = {}) {
    const session = new CheckoutSession({
      invoice: invoice.id,
      customer: invoice.customer,
      customer_email: invoice.customerEmail,
      amount_total: Math.round(invoice.total * 100), // Convert to cents
      amount_subtotal: Math.round(invoice.subtotal * 100),
      currency: invoice.currency || 'usd',
      success_url: options.success_url,
      cancel_url: options.cancel_url,
      payment_method_types: invoice.paymentMethods || ['card'],
      metadata: {
        invoice_id: invoice.id,
        invoice_number: invoice.number,
        ...options.metadata
      },
      client_reference_id: invoice.number,
      automatic_tax: {
        enabled: invoice.taxRate > 0,
        tax_rate: invoice.taxRate
      }
    });

    // Add line items from invoice
    invoice.items.forEach(item => {
      session.addLineItem({
        name: item.description,
        description: item.description,
        unit_amount: item.unitPrice,
        quantity: item.quantity,
        metadata: item.metadata || {}
      });
    });

    return session;
  }
}

module.exports = CheckoutSession;