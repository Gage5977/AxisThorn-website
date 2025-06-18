const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const invoiceRoutes = require('./routes/invoices');
const customerRoutes = require('./routes/customers');
const productRoutes = require('./routes/products');
const paymentMethodRoutes = require('./routes/paymentMethods');
const checkoutRoutes = require('./routes/checkout');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/invoices', invoiceRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);
app.use('/api/checkout', checkoutRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Axis Thorn Client Portal running on port ${PORT}`);
  console.log(`Access at: http://localhost:${PORT}`);
});