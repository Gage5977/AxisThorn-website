const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();

class PaymentMethod {
  constructor(data = {}) {
    this.id = data.id || `pm_${uuidv4()}`;
    this.type = data.type || 'card'; // card, bank_account, paypal, crypto, etc.
    this.provider = data.provider || 'stripe'; // stripe, paypal, square, crypto_wallet, etc.
    this.name = data.name || '';
    this.description = data.description || '';
    this.enabled = data.enabled !== undefined ? data.enabled : true;
    this.fees = data.fees || {
      percentage: 2.9,
      fixed: 30, // in cents
      currency: 'usd'
    };
    this.processingTime = data.processingTime || 'instant';
    this.currencies = data.currencies || ['usd'];
    this.countries = data.countries || ['US'];
    this.metadata = data.metadata || {};
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  calculateFee(amount) {
    const percentageFee = (amount * this.fees.percentage) / 100;
    const totalFee = percentageFee + (this.fees.fixed / 100);
    return Math.round(totalFee * 100) / 100;
  }

  update(updates) {
    Object.keys(updates).forEach(key => {
      if (key !== 'id' && key !== 'createdAt') {
        this[key] = updates[key];
      }
    });
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      provider: this.provider,
      name: this.name,
      description: this.description,
      enabled: this.enabled,
      fees: this.fees,
      processingTime: this.processingTime,
      currencies: this.currencies,
      countries: this.countries,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = PaymentMethod;