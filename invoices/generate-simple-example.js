// Generate a simple business example invoice
const Invoice = require('./models/Invoice');
const Customer = require('./models/Customer');
const { defaultPaymentMethods } = require('./config/paymentMethods');

console.log('📄 Creating Simple Business Invoice Example...\n');

// Create a typical business scenario
const customer = new Customer({
    name: 'Tech Startup Inc.',
    email: 'finance@techstartup.com',
    phone: '(555) 123-4567',
    address: {
        line1: '456 Innovation Drive',
        line2: 'Floor 12',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105'
    }
});

const invoice = new Invoice({
    customerName: customer.name,
    customerEmail: customer.email,
    customerAddress: customer.address,
    items: [
        {
            description: 'Monthly Software License (Pro Plan)',
            quantity: 5,
            unitPrice: 99.00
        },
        {
            description: 'Setup and Onboarding Services',
            quantity: 1,
            unitPrice: 250.00
        },
        {
            description: 'Priority Support Package',
            quantity: 1,
            unitPrice: 150.00
        }
    ],
    taxRate: 7.5,
    discount: 50,
    discountType: 'fixed',
    notes: 'Thank you for your business! Support is available 24/7.',
    terms: 'Payment due within 15 days. Late fees apply after 30 days.',
    paymentMethods: ['card', 'bank_account', 'paypal', 'apple_pay', 'google_pay'],
    paymentInstructions: {
        card: 'Secure online payment with any major credit or debit card',
        bank_account: 'Direct bank transfer (US accounts only)',
        paypal: 'Pay with PayPal account or credit',
        apple_pay: 'One-touch payment with Touch/Face ID',
        google_pay: 'Quick payment with Google Pay'
    },
    paymentUrl: 'https://pay.example-company.com/invoice/simple-' + Date.now()
});

// Display the invoice
console.log('BUSINESS INVOICE EXAMPLE');
console.log('========================');
console.log(`Invoice: ${invoice.number}`);
console.log(`Customer: ${invoice.customerName}`);
console.log(`Email: ${invoice.customerEmail}`);
console.log(`Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`);
console.log(`Amount: $${invoice.total.toFixed(2)}`);

console.log('\n📋 SERVICES PROVIDED:');
invoice.items.forEach((item, index) => {
    console.log(`${index + 1}. ${item.description}`);
    console.log(`   ${item.quantity} × $${item.unitPrice.toFixed(2)} = $${(item.quantity * item.unitPrice).toFixed(2)}`);
});

console.log('\n💰 PAYMENT BREAKDOWN:');
console.log(`Subtotal: $${invoice.subtotal.toFixed(2)}`);
console.log(`Discount: -$${invoice.discount.toFixed(2)}`);
console.log(`Tax (${invoice.taxRate}%): $${invoice.tax.toFixed(2)}`);
console.log(`TOTAL: $${invoice.total.toFixed(2)}`);

console.log('\n💳 RECOMMENDED PAYMENT OPTIONS:');

// Get the recommended payment methods
const acceptedMethods = defaultPaymentMethods.filter(method => 
    invoice.paymentMethods.includes(method.type)
);

// Sort by fee (lowest first)
const sortedMethods = acceptedMethods
    .map(method => ({ method, fee: method.calculateFee(invoice.total) }))
    .sort((a, b) => a.fee - b.fee);

sortedMethods.forEach((item, index) => {
    const { method, fee } = item;
    const total = invoice.total + fee;
    const badge = index === 0 ? '🏆 BEST VALUE' : index === 1 ? '⚡ FAST' : '✅ POPULAR';
    
    console.log(`\n${badge} - ${method.name}`);
    console.log(`  Processing Fee: $${fee.toFixed(2)}`);
    console.log(`  Total Cost: $${total.toFixed(2)}`);
    console.log(`  Processing Time: ${method.processingTime}`);
    console.log(`  ${invoice.paymentInstructions[method.type] || 'Standard processing'}`);
});

console.log(`\n🌐 Pay Online: ${invoice.paymentUrl}`);

console.log('\n📞 CUSTOMER SERVICE:');
console.log('Questions about this invoice? Contact us:');
console.log('Email: billing@example-company.com');
console.log('Phone: (555) 999-0123');
console.log('Hours: Monday-Friday 9AM-6PM PST');

console.log('\n✉️ EMAIL PREVIEW:');
console.log('================');
console.log('Subject: Invoice ' + invoice.number + ' - $' + invoice.total.toFixed(2));
console.log(`
Dear ${invoice.customerName},

Thank you for your business! Your invoice is ready for payment.

Invoice Details:
• Invoice #: ${invoice.number}
• Amount Due: $${invoice.total.toFixed(2)}
• Due Date: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'Upon Receipt'}

Services Provided:
${invoice.items.map(item => `• ${item.description} - $${(item.quantity * item.unitPrice).toFixed(2)}`).join('\n')}

Pay Online: ${invoice.paymentUrl}

Payment Options Available:
${sortedMethods.slice(0, 3).map((item, index) => 
    `${index + 1}. ${item.method.name} - $${item.fee.toFixed(2)} fee`
).join('\n')}

Questions? Reply to this email or call (555) 999-0123.

Best regards,
Your Company Team
`);

console.log('\n✅ Simple Business Invoice Example Complete!');
console.log('\nThis demonstrates a typical B2B software invoice with:');
console.log('• Professional service descriptions');
console.log('• Competitive pricing ($845 total)');
console.log('• Multiple payment options');
console.log('• Clear fee transparency');
console.log('• Customer service information');
console.log('• Email-ready format');