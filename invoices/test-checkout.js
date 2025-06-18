// Test Stripe Checkout functionality
const Invoice = require('./models/Invoice');
const CheckoutSession = require('./models/CheckoutSession');
const Customer = require('./models/Customer');
const database = require('./db/Database');

console.log('🛒 Testing Stripe Checkout Integration...\n');

// Create a test customer
const customer = new Customer({
    name: 'Test Customer Inc.',
    email: 'customer@test.com',
    phone: '(555) 123-4567',
    address: {
        line1: '123 Test Street',
        city: 'Test City',
        state: 'CA',
        postalCode: '90210'
    }
});
database.saveCustomer(customer);

// Create a test invoice
const invoice = new Invoice({
    customerName: customer.name,
    customerEmail: customer.email,
    customerAddress: customer.address,
    items: [
        {
            description: 'Website Design Services',
            quantity: 1,
            unitPrice: 2500.00
        },
        {
            description: 'Monthly Hosting (12 months)',
            quantity: 12,
            unitPrice: 25.00
        },
        {
            description: 'SSL Certificate',
            quantity: 1,
            unitPrice: 99.00
        }
    ],
    taxRate: 8.5,
    discount: 200,
    discountType: 'fixed',
    notes: 'Thank you for choosing our services!',
    terms: 'Payment due within 15 days',
    paymentMethods: ['card', 'paypal', 'apple_pay', 'google_pay', 'bank_account']
});

database.saveInvoice(invoice);

console.log('📄 Test Invoice Created:');
console.log(`Invoice: ${invoice.number}`);
console.log(`Customer: ${invoice.customerName}`);
console.log(`Total: $${invoice.total.toFixed(2)}`);
console.log(`Status: ${invoice.status}`);

// Create checkout session from invoice
console.log('\n🔄 Creating Checkout Session...');

const checkoutOptions = {
    success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://example.com/cancel',
    metadata: {
        customer_id: customer.id,
        order_type: 'website_services'
    }
};

const checkoutSession = CheckoutSession.fromInvoice(invoice, checkoutOptions);
database.saveCheckoutSession(checkoutSession);

console.log('✅ Checkout Session Created:');
console.log(`Session ID: ${checkoutSession.id}`);
console.log(`Checkout URL: ${checkoutSession.url}`);
console.log(`Amount: $${(checkoutSession.amount_total / 100).toFixed(2)}`);
console.log(`Status: ${checkoutSession.status}`);
console.log(`Expires: ${new Date(checkoutSession.expires_at * 1000).toLocaleString()}`);

console.log('\n📋 Line Items:');
checkoutSession.line_items.forEach((item, index) => {
    console.log(`${index + 1}. ${item.price_data.product_data.name}`);
    console.log(`   Quantity: ${item.quantity}`);
    console.log(`   Unit Price: $${(item.price_data.unit_amount / 100).toFixed(2)}`);
    console.log(`   Total: $${((item.price_data.unit_amount * item.quantity) / 100).toFixed(2)}`);
    console.log('');
});

console.log('💳 Payment Methods Available:');
checkoutSession.payment_method_types.forEach((type, index) => {
    const methodName = {
        'card': 'Credit/Debit Cards',
        'paypal': 'PayPal',
        'apple_pay': 'Apple Pay',
        'google_pay': 'Google Pay',
        'bank_account': 'Bank Transfer'
    }[type] || type;
    console.log(`${index + 1}. ${methodName}`);
});

// Test checkout session operations
console.log('\n🧪 Testing Checkout Operations...');

// Test retrieval
const retrievedSession = database.getCheckoutSession(checkoutSession.id);
console.log(`✓ Session retrieved: ${retrievedSession ? 'SUCCESS' : 'FAILED'}`);

// Test expiry check
const isExpired = checkoutSession.isExpired();
console.log(`✓ Expiry check: ${isExpired ? 'EXPIRED' : 'ACTIVE'}`);

// Test completion
console.log('\n🎯 Simulating Payment Completion...');
checkoutSession.complete();
database.saveCheckoutSession(checkoutSession);

// Update invoice to paid status
invoice.pay(invoice.total);
database.saveInvoice(invoice);

console.log(`✓ Checkout completed: ${checkoutSession.status}`);
console.log(`✓ Payment status: ${checkoutSession.payment_status}`);
console.log(`✓ Invoice status: ${invoice.status}`);
console.log(`✓ Amount paid: $${invoice.amountPaid.toFixed(2)}`);

// Test webhook simulation
console.log('\n🔗 Webhook Event Simulation:');
const webhookEvent = {
    type: 'checkout.session.completed',
    data: {
        object: checkoutSession.toStripeFormat()
    }
};

console.log(`✓ Event type: ${webhookEvent.type}`);
console.log(`✓ Session ID: ${webhookEvent.data.object.id}`);
console.log(`✓ Payment status: ${webhookEvent.data.object.payment_status}`);

// Create another session for testing different scenarios
console.log('\n🆕 Creating Session for Different Payment Methods...');

const cryptoInvoice = new Invoice({
    customerName: 'Crypto Customer',
    customerEmail: 'crypto@test.com',
    items: [
        {
            description: 'Bitcoin Consulting',
            quantity: 5,
            unitPrice: 200.00
        }
    ],
    paymentMethods: ['cryptocurrency', 'card'],
    notes: 'Payment accepted in Bitcoin or traditional methods'
});

database.saveInvoice(cryptoInvoice);

const cryptoSession = CheckoutSession.fromInvoice(cryptoInvoice, {
    success_url: 'https://example.com/crypto-success',
    cancel_url: 'https://example.com/crypto-cancel',
    payment_method_types: ['card'] // Note: crypto would need special handling
});

database.saveCheckoutSession(cryptoSession);

console.log(`✓ Crypto session: ${cryptoSession.id}`);
console.log(`✓ Amount: $${(cryptoSession.amount_total / 100).toFixed(2)}`);

// Test session listing
console.log('\n📊 Database Summary:');
const allSessions = database.getAllCheckoutSessions();
const allInvoices = database.getAllInvoices();

console.log(`✓ Total checkout sessions: ${allSessions.length}`);
console.log(`✓ Active sessions: ${allSessions.filter(s => s.status === 'open').length}`);
console.log(`✓ Completed sessions: ${allSessions.filter(s => s.status === 'complete').length}`);
console.log(`✓ Total invoices: ${allInvoices.length}`);
console.log(`✓ Paid invoices: ${allInvoices.filter(i => i.status === 'paid').length}`);

// Calculate total revenue
const totalRevenue = allInvoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.total, 0);

console.log(`✓ Total revenue: $${totalRevenue.toFixed(2)}`);

console.log('\n🎉 Checkout System Test Complete!');

console.log('\n📝 Sample API Calls:');
console.log(`
// Create checkout session from invoice
POST /api/checkout/sessions/from-invoice/${invoice.id}
{
  "success_url": "https://yoursite.com/success?session_id={CHECKOUT_SESSION_ID}",
  "cancel_url": "https://yoursite.com/cancel"
}

// Retrieve checkout session
GET /api/checkout/sessions/${checkoutSession.id}

// Process payment (demo)
POST /api/checkout/process-payment
{
  "session_id": "${checkoutSession.id}",
  "payment_method": "card",
  "billing_details": { ... }
}

// List all sessions
GET /api/checkout/sessions
`);

console.log('🌐 Frontend URLs:');
console.log(`Checkout: http://localhost:3000/checkout.html?session_id=${checkoutSession.id}`);
console.log(`Success: http://localhost:3000/success.html?session_id=${checkoutSession.id}`);
console.log(`Cancel: http://localhost:3000/cancel.html?session_id=${checkoutSession.id}`);

console.log('\n✨ Ready for Stripe-like checkout experience!');