const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();

class Product {
  constructor(data = {}) {
    this.id = data.id || `prod_${uuidv4()}`;
    this.name = data.name || '';
    this.description = data.description || '';
    this.unitPrice = data.unitPrice || 0;
    this.currency = data.currency || 'usd';
    this.taxable = data.taxable !== undefined ? data.taxable : true;
    this.metadata = data.metadata || {};
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
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
      name: this.name,
      description: this.description,
      unitPrice: this.unitPrice,
      currency: this.currency,
      taxable: this.taxable,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Product;