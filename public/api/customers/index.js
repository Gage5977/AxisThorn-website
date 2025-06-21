// Vercel serverless function for customer management
let customers = [];

class Customer {
  constructor(data) {
    this.id = data.id || `cust_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    this.name = data.name || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.address = data.address || {};
    this.created_at = data.created_at || new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      address: this.address,
      created_at: this.created_at
    };
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
    case 'GET':
      const customerList = customers.map(customer => customer.toJSON());
      return res.status(200).json(customerList);

    case 'POST':
      const newCustomer = new Customer(req.body);
      customers.push(newCustomer);
      return res.status(201).json(newCustomer.toJSON());

    default:
      res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Customer API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};