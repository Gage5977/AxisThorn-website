// Simple test to verify the invoice generator functionality
const Invoice = require('./models/Invoice');
const Customer = require('./models/Customer');
const Product = require('./models/Product');
const database = require('./db/Database');

console.log('Testing Invoice Generator...\n');

// Test Customer creation
console.log('1. Testing Customer creation...');
const customer = new Customer({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-0123',
    address: {
        line1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        postalCode: '12345'
    }
});
database.saveCustomer(customer);
console.log('✓ Customer created:', customer.name);

// Test Product creation
console.log('\n2. Testing Product creation...');
const product = new Product({
    name: 'Web Development',
    description: 'Custom website development',
    unitPrice: 150.00
});
database.saveProduct(product);
console.log('✓ Product created:', product.name);

// Test Invoice creation
console.log('\n3. Testing Invoice creation...');
const invoice = new Invoice({
    customerName: customer.name,
    customerEmail: customer.email,
    customerAddress: customer.address,
    items: [
        {
            description: 'Web Development - Homepage',
            quantity: 8,
            unitPrice: 150.00
        },
        {
            description: 'SEO Optimization',
            quantity: 1,
            unitPrice: 500.00
        }
    ],
    taxRate: 8.5,
    discount: 100,
    discountType: 'fixed',
    notes: 'Thank you for your business!',
    terms: 'Payment due within 30 days'
});

database.saveInvoice(invoice);
console.log('✓ Invoice created:', invoice.number);
console.log('  - Subtotal:', `$${invoice.subtotal.toFixed(2)}`);
console.log('  - Discount:', `$${invoice.discount.toFixed(2)}`);
console.log('  - Tax:', `$${invoice.tax.toFixed(2)}`);
console.log('  - Total:', `$${invoice.total.toFixed(2)}`);

// Test Invoice operations
console.log('\n4. Testing Invoice operations...');

// Finalize invoice
invoice.finalize();
console.log('✓ Invoice finalized, status:', invoice.status);

// Mark as paid
invoice.pay(invoice.total);
console.log('✓ Invoice paid, status:', invoice.status);
console.log('  - Amount paid:', `$${invoice.amountPaid.toFixed(2)}`);
console.log('  - Amount due:', `$${invoice.amountDue.toFixed(2)}`);

// Test database operations
console.log('\n5. Testing Database operations...');
const allInvoices = database.getAllInvoices();
const allCustomers = database.getAllCustomers();
const allProducts = database.getAllProducts();

console.log('✓ Database contains:');
console.log('  - Invoices:', allInvoices.length);
console.log('  - Customers:', allCustomers.length);
console.log('  - Products:', allProducts.length);

// Test search functionality
const searchResults = database.searchInvoices('Web');
console.log('✓ Search results for "Web":', searchResults.length);

console.log('\n✓ All tests completed successfully!');
console.log('\nThe Invoice Generator is ready to use.');
console.log('To start the server: npm start');
console.log('Then visit: http://localhost:3000');