// Simple PDF generation script without external dependencies
const fs = require('fs');

// Create a basic PDF manually without PDFKit dependency
function generateSimplePDF(invoice) {
    // Simple PDF content (this is a minimal implementation)
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Resources <<
/Font <<
/F1 4 0 R
>>
>>
/Contents 5 0 R
>>
endobj

4 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

5 0 obj
<<
/Length 1000
>>
stream
BT
/F1 16 Tf
72 720 Td
(INVOICE) Tj
0 -30 Td
/F1 12 Tf
(Invoice #: ${invoice.number}) Tj
0 -20 Td
(Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}) Tj
0 -20 Td
(Due Date: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'Upon Receipt'}) Tj
0 -40 Td
/F1 14 Tf
(Bill To:) Tj
0 -20 Td
/F1 12 Tf
(${invoice.customerName}) Tj
0 -15 Td
(${invoice.customerEmail}) Tj
0 -40 Td
/F1 14 Tf
(Items:) Tj
0 -20 Td
/F1 10 Tf
${invoice.items.map(item => 
    `(${item.description} - Qty: ${item.quantity} - $${item.unitPrice.toFixed(2)} = $${item.amount.toFixed(2)}) Tj 0 -15 Td`
).join('\n')}
0 -20 Td
/F1 12 Tf
(Subtotal: $${invoice.subtotal.toFixed(2)}) Tj
0 -15 Td
(Tax: $${invoice.tax.toFixed(2)}) Tj
0 -15 Td
/F1 14 Tf
(Total: $${invoice.total.toFixed(2)}) Tj
${invoice.notes ? `
0 -40 Td
/F1 12 Tf
(Notes: ${invoice.notes}) Tj
` : ''}
ET
endstream
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000125 00000 n 
0000000348 00000 n 
0000000434 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
1500
%%EOF`;

    return Buffer.from(pdfContent);
}

// Create a sample invoice and generate PDF
const Invoice = require('./models/Invoice');
const Customer = require('./models/Customer');
const { defaultPaymentMethods } = require('./config/paymentMethods');

console.log('Generating sample invoice PDF...\n');

// Create sample data
const customer = new Customer({
    name: 'Acme Corporation',
    email: 'billing@acme.com',
    phone: '555-0123',
    address: {
        line1: '123 Business Avenue',
        line2: 'Suite 100',
        city: 'Business City',
        state: 'California',
        postalCode: '90210'
    }
});

const invoice = new Invoice({
    customerName: customer.name,
    customerEmail: customer.email,
    customerAddress: customer.address,
    items: [
        {
            description: 'Website Development Services',
            quantity: 40,
            unitPrice: 125.00
        },
        {
            description: 'SEO Optimization Package',
            quantity: 1,
            unitPrice: 800.00
        },
        {
            description: 'Content Management System Setup',
            quantity: 1,
            unitPrice: 1200.00
        }
    ],
    taxRate: 8.25,
    discount: 500,
    discountType: 'fixed',
    notes: 'Thank you for choosing our services. Payment is due within 30 days.',
    terms: 'Net 30 terms. Late payments subject to 1.5% monthly service charge.',
    paymentMethods: ['card', 'bank_account', 'paypal', 'apple_pay', 'google_pay', 'wire_transfer'],
    paymentInstructions: {
      card: 'Pay securely online with any major credit or debit card',
      bank_account: 'ACH bank transfer - US bank accounts only',
      paypal: 'Pay with your PayPal account or PayPal Credit',
      apple_pay: 'Use Touch ID or Face ID for secure payment',
      google_pay: 'Fast, simple payment with Google Pay',
      wire_transfer: 'Contact us for wire transfer instructions',
      check: 'Make checks payable to: Your Company Name'
    },
    paymentUrl: 'https://pay.yourcompany.com/invoice/' + Date.now()
});

console.log('Invoice Details:');
console.log('================');
console.log(`Invoice Number: ${invoice.number}`);
console.log(`Customer: ${invoice.customerName}`);
console.log(`Email: ${invoice.customerEmail}`);
console.log(`Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`);
console.log(`Due Date: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'Upon Receipt'}`);
console.log('\nLine Items:');
invoice.items.forEach((item, index) => {
    const amount = item.quantity * item.unitPrice;
    console.log(`  ${index + 1}. ${item.description}`);
    console.log(`     Qty: ${item.quantity} × $${item.unitPrice.toFixed(2)} = $${amount.toFixed(2)}`);
});
console.log('\nTotals:');
console.log(`  Subtotal: $${invoice.subtotal.toFixed(2)}`);
if (invoice.discount > 0) {
    const discountAmount = invoice.discountType === 'percentage' 
        ? (invoice.subtotal * invoice.discount / 100) 
        : invoice.discount;
    console.log(`  Discount: -$${discountAmount.toFixed(2)}`);
}
console.log(`  Tax (${invoice.taxRate}%): $${invoice.tax.toFixed(2)}`);
console.log(`  Total: $${invoice.total.toFixed(2)}`);
console.log(`  Amount Due: $${invoice.amountDue.toFixed(2)}`);

if (invoice.notes) {
    console.log(`\nNotes: ${invoice.notes}`);
}
if (invoice.terms) {
    console.log(`Terms: ${invoice.terms}`);
}

console.log('\nPayment Methods Accepted:');
const acceptedMethods = defaultPaymentMethods.filter(method => 
    invoice.paymentMethods.includes(method.type)
);
acceptedMethods.forEach((method, index) => {
    const fee = method.calculateFee(invoice.total);
    console.log(`  ${index + 1}. ${method.name} (${method.provider})`);
    console.log(`     Fee: ${method.fees.percentage}% + $${(method.fees.fixed/100).toFixed(2)} = $${fee.toFixed(2)}`);
    console.log(`     Processing: ${method.processingTime}`);
    if (invoice.paymentInstructions[method.type]) {
        console.log(`     Instructions: ${invoice.paymentInstructions[method.type]}`);
    }
    console.log('');
});

if (invoice.paymentUrl) {
    console.log(`Online Payment: ${invoice.paymentUrl}`);
}

// Generate text-based invoice for immediate viewing
console.log('\n' + '='.repeat(80));
console.log('TEXT-BASED INVOICE PREVIEW');
console.log('='.repeat(80));

const textInvoice = `
                              INVOICE
                         ${invoice.number}

Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}
Due Date: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'Upon Receipt'}
Status: ${invoice.status.toUpperCase()}

BILL TO:
${invoice.customerName}
${invoice.customerEmail}
${invoice.customerAddress.line1}
${invoice.customerAddress.line2 ? invoice.customerAddress.line2 + '\n' : ''}${invoice.customerAddress.city}, ${invoice.customerAddress.state} ${invoice.customerAddress.postalCode}

${'─'.repeat(80)}
DESCRIPTION                           QTY    UNIT PRICE      AMOUNT
${'─'.repeat(80)}
${invoice.items.map(item => {
    const desc = item.description.padEnd(35);
    const qty = item.quantity.toString().padStart(5);
    const price = ('$' + item.unitPrice.toFixed(2)).padStart(12);
    const amount = ('$' + (item.quantity * item.unitPrice).toFixed(2)).padStart(12);
    return `${desc} ${qty} ${price} ${amount}`;
}).join('\n')}
${'─'.repeat(80)}

                                              Subtotal: $${invoice.subtotal.toFixed(2).padStart(8)}
${invoice.discount > 0 ? `                                              Discount: -$${((invoice.discountType === 'percentage' ? (invoice.subtotal * invoice.discount / 100) : invoice.discount)).toFixed(2).padStart(7)}` : ''}
                                           Tax (${invoice.taxRate}%): $${invoice.tax.toFixed(2).padStart(8)}
                                                ─────────────────
                                                 TOTAL: $${invoice.total.toFixed(2).padStart(8)}
                                            Amount Due: $${invoice.amountDue.toFixed(2).padStart(8)}

${invoice.notes ? `NOTES:\n${invoice.notes}\n` : ''}
${invoice.terms ? `TERMS & CONDITIONS:\n${invoice.terms}\n` : ''}

PAYMENT METHODS ACCEPTED:
${acceptedMethods.map((method, index) => {
    const fee = method.calculateFee(invoice.total);
    return `${index + 1}. ${method.name} (${method.provider})
   Fee: ${method.fees.percentage}% + $${(method.fees.fixed/100).toFixed(2)} = $${fee.toFixed(2)}
   Processing: ${method.processingTime}
   ${invoice.paymentInstructions[method.type] ? `Instructions: ${invoice.paymentInstructions[method.type]}` : ''}`;
}).join('\n\n')}

${invoice.paymentUrl ? `PAY ONLINE: ${invoice.paymentUrl}\n` : ''}
Thank you for your business!
`;

console.log(textInvoice);

// Save text version
const filename = `invoice-${invoice.number.replace(/[^a-zA-Z0-9]/g, '-')}.txt`;
fs.writeFileSync(filename, textInvoice);
console.log(`\n✓ Text invoice saved as: ${filename}`);

// Create a simple HTML version for better PDF conversion
const htmlInvoice = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invoice ${invoice.number}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 40px; }
        .invoice-title { font-size: 32px; font-weight: bold; color: #333; }
        .invoice-number { font-size: 16px; color: #666; margin: 10px 0; }
        .details { display: flex; justify-content: space-between; margin: 30px 0; }
        .bill-to { flex: 1; }
        .invoice-info { flex: 1; text-align: right; }
        .items-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
        .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .items-table th { background-color: #f8f9fa; font-weight: bold; }
        .amount { text-align: right; }
        .totals { margin-top: 20px; text-align: right; }
        .totals-row { margin: 5px 0; }
        .total-final { font-size: 18px; font-weight: bold; border-top: 2px solid #333; padding-top: 10px; }
        .notes { margin-top: 40px; padding: 20px; background-color: #f8f9fa; border-radius: 5px; }
        .payment-methods { margin-top: 40px; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .payment-methods h3 { margin-bottom: 20px; color: #333; }
        .payment-method { margin-bottom: 15px; padding: 15px; background-color: #f8f9fa; border-radius: 5px; border-left: 4px solid #007bff; }
        .method-header { font-size: 16px; margin-bottom: 8px; }
        .provider { color: #666; font-weight: normal; }
        .method-details { font-size: 14px; }
        .method-details div { margin-bottom: 5px; }
        .fee { color: #28a745; }
        .processing-time { color: #6c757d; }
        .instructions { color: #495057; font-style: italic; }
        .payment-url { margin-top: 20px; padding: 15px; background-color: #e3f2fd; border-radius: 5px; text-align: center; }
        .payment-link { color: #007bff; text-decoration: none; font-weight: bold; }
        .footer { margin-top: 40px; text-align: center; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="invoice-title">INVOICE</div>
        <div class="invoice-number">#${invoice.number}</div>
    </div>
    
    <div class="details">
        <div class="bill-to">
            <h3>Bill To:</h3>
            <div><strong>${invoice.customerName}</strong></div>
            <div>${invoice.customerEmail}</div>
            <div>${invoice.customerAddress.line1}</div>
            ${invoice.customerAddress.line2 ? `<div>${invoice.customerAddress.line2}</div>` : ''}
            <div>${invoice.customerAddress.city}, ${invoice.customerAddress.state} ${invoice.customerAddress.postalCode}</div>
        </div>
        
        <div class="invoice-info">
            <div><strong>Invoice Date:</strong> ${new Date(invoice.invoiceDate).toLocaleDateString()}</div>
            <div><strong>Due Date:</strong> ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'Upon Receipt'}</div>
            <div><strong>Status:</strong> ${invoice.status.toUpperCase()}</div>
        </div>
    </div>
    
    <table class="items-table">
        <thead>
            <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th class="amount">Amount</th>
            </tr>
        </thead>
        <tbody>
            ${invoice.items.map(item => `
                <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.unitPrice.toFixed(2)}</td>
                    <td class="amount">$${(item.quantity * item.unitPrice).toFixed(2)}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    
    <div class="totals">
        <div class="totals-row">Subtotal: $${invoice.subtotal.toFixed(2)}</div>
        ${invoice.discount > 0 ? `<div class="totals-row">Discount: -$${((invoice.discountType === 'percentage' ? (invoice.subtotal * invoice.discount / 100) : invoice.discount)).toFixed(2)}</div>` : ''}
        <div class="totals-row">Tax (${invoice.taxRate}%): $${invoice.tax.toFixed(2)}</div>
        <div class="totals-row total-final">Total: $${invoice.total.toFixed(2)}</div>
        <div class="totals-row"><strong>Amount Due: $${invoice.amountDue.toFixed(2)}</strong></div>
    </div>
    
    ${invoice.notes || invoice.terms ? `
        <div class="notes">
            ${invoice.notes ? `<p><strong>Notes:</strong><br>${invoice.notes}</p>` : ''}
            ${invoice.terms ? `<p><strong>Terms & Conditions:</strong><br>${invoice.terms}</p>` : ''}
        </div>
    ` : ''}
    
    <div class="payment-methods">
        <h3>Payment Methods Accepted</h3>
        ${acceptedMethods.map((method, index) => {
            const fee = method.calculateFee(invoice.total);
            return `
                <div class="payment-method">
                    <div class="method-header">
                        <strong>${method.name}</strong> <span class="provider">(${method.provider})</span>
                    </div>
                    <div class="method-details">
                        <div class="fee">Processing Fee: ${method.fees.percentage}% + $${(method.fees.fixed/100).toFixed(2)} = <strong>$${fee.toFixed(2)}</strong></div>
                        <div class="processing-time">Processing Time: ${method.processingTime}</div>
                        ${invoice.paymentInstructions[method.type] ? `<div class="instructions">${invoice.paymentInstructions[method.type]}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('')}
        
        ${invoice.paymentUrl ? `
            <div class="payment-url">
                <h4>Pay Online:</h4>
                <a href="${invoice.paymentUrl}" class="payment-link">${invoice.paymentUrl}</a>
            </div>
        ` : ''}
    </div>
    
    <div class="footer">
        <p>Thank you for your business!</p>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
    </div>
</body>
</html>
`;

const htmlFilename = `invoice-${invoice.number.replace(/[^a-zA-Z0-9]/g, '-')}.html`;
fs.writeFileSync(htmlFilename, htmlInvoice);
console.log(`✓ HTML invoice saved as: ${htmlFilename}`);

console.log('\n' + '='.repeat(80));
console.log('PDF GENERATION INSTRUCTIONS');
console.log('='.repeat(80));
console.log(`
To convert the HTML invoice to PDF, you can:

1. Open ${htmlFilename} in your browser and use "Print to PDF"
2. Use a command-line tool like wkhtmltopdf:
   wkhtmltopdf ${htmlFilename} invoice-${invoice.number.replace(/[^a-zA-Z0-9]/g, '-')}.pdf

3. Use Chrome headless:
   google-chrome --headless --disable-gpu --print-to-pdf=invoice.pdf ${htmlFilename}

4. Online converter: Upload the HTML file to any HTML-to-PDF service

The invoice has been generated successfully with all Stripe-like features:
✓ Professional formatting
✓ Line items with calculations
✓ Tax and discount handling  
✓ Customer information
✓ Terms and notes
✓ Proper totals calculation
`);