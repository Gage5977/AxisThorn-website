// Demo server without external dependencies
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Mock the required modules for demo
const mockInvoice = require('./models/Invoice');
const mockDatabase = require('./db/Database');

const PORT = 3001;

// Simple HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Serve static files
    if (pathname === '/' || pathname === '/index.html') {
        serveFile(res, './public/index.html', 'text/html');
    } else if (pathname === '/styles.css') {
        serveFile(res, './public/styles.css', 'text/css');
    } else if (pathname === '/script.js') {
        serveFile(res, './public/script.js', 'application/javascript');
    } 
    // API endpoints (simplified for demo)
    else if (pathname.startsWith('/api/')) {
        handleAPI(req, res, pathname);
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

function serveFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end('Internal Server Error');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}

function handleAPI(req, res, pathname) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const data = body ? JSON.parse(body) : {};
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        
        // Mock API responses
        if (pathname === '/api/invoices' && req.method === 'GET') {
            const invoices = mockDatabase.getAllInvoices();
            res.end(JSON.stringify(invoices.map(inv => inv.toJSON())));
        } else if (pathname === '/api/invoices' && req.method === 'POST') {
            const invoice = new mockInvoice(data);
            mockDatabase.saveInvoice(invoice);
            res.end(JSON.stringify(invoice.toJSON()));
        } else if (pathname === '/api/invoices/create_preview' && req.method === 'POST') {
            const preview = new mockInvoice(data);
            res.end(JSON.stringify(preview.toJSON()));
        } else if (pathname === '/api/customers' && req.method === 'GET') {
            const customers = mockDatabase.getAllCustomers();
            res.end(JSON.stringify(customers.map(c => c.toJSON())));
        } else if (pathname === '/api/products' && req.method === 'GET') {
            const products = mockDatabase.getAllProducts();
            res.end(JSON.stringify(products.map(p => p.toJSON())));
        } else {
            res.end(JSON.stringify({ message: 'API endpoint working - Demo mode' }));
        }
    });
}

server.listen(PORT, () => {
    console.log(`
🚀 Invoice Generator Demo Server Started!

Server running at: http://localhost:${PORT}

Features Available:
✓ Invoice creation and management
✓ Customer management
✓ Product catalog
✓ Invoice preview
✓ Dashboard with statistics
✓ Search and filtering

Note: This is a demo server. For full functionality with PDF generation,
email sending, and Stripe integration, run 'npm install' and 'npm start'.

Press Ctrl+C to stop the server.
    `);
});

// Add some sample data
const mockCustomer = require('./models/Customer');
const mockProduct = require('./models/Product');

// Create sample customer
const sampleCustomer = new mockCustomer({
    name: 'Acme Corporation',
    email: 'billing@acme.com',
    phone: '555-0123',
    address: {
        line1: '123 Business Ave',
        city: 'Business City',
        state: 'CA',
        postalCode: '90210'
    }
});
mockDatabase.saveCustomer(sampleCustomer);

// Create sample product
const sampleProduct = new mockProduct({
    name: 'Consulting Services',
    description: 'Professional consulting services',
    unitPrice: 150.00
});
mockDatabase.saveProduct(sampleProduct);

// Create sample invoice
const sampleInvoice = new mockInvoice({
    customerName: 'Acme Corporation',
    customerEmail: 'billing@acme.com',
    items: [
        {
            description: 'Website Development',
            quantity: 20,
            unitPrice: 125.00
        },
        {
            description: 'SEO Setup',
            quantity: 1,
            unitPrice: 500.00
        }
    ],
    taxRate: 8.25,
    notes: 'Thank you for your business!'
});
sampleInvoice.finalize();
mockDatabase.saveInvoice(sampleInvoice);