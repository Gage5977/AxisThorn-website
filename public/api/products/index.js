// Vercel serverless function for product management
let products = [];

class Product {
  constructor(data) {
    this.id = data.id || `prod_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    this.name = data.name || '';
    this.description = data.description || '';
    this.price = parseFloat(data.price) || 0;
    this.created_at = data.created_at || new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
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
      const productList = products.map(product => product.toJSON());
      return res.status(200).json(productList);

    case 'POST':
      const newProduct = new Product(req.body);
      products.push(newProduct);
      return res.status(201).json(newProduct.toJSON());

    default:
      res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Product API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};