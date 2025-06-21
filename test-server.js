#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Configuration
const PORT = process.env.PORT || 5173;
const PUBLIC_DIR = path.join(__dirname, 'public');

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

// URL rewrite rules (matching vercel.json)
const rewrites = {
    '/invoices': '/invoices.html',
    '/app': '/app.html',
    '/banking': '/banking.html',
    '/banking-portal': '/banking-portal.html',
    '/terminal': '/terminal.html',
    '/axis-ai': '/axis-ai.html',
    '/consultation': '/consultation.html',
    '/implementation': '/implementation.html',
    '/support': '/support.html',
    '/services': '/services.html',
    '/privacy-policy': '/privacy-policy.html',
    '/terms-of-service': '/terms-of-service.html',
    '/cookie-policy': '/cookie-policy.html',
    '/contact-form': '/contact-form.html'
};

// Mock API responses for testing
const mockApiResponses = {
    '/api/contact': {
        method: 'POST',
        handler: (req, res, body) => {
            console.log('📧 Contact form submission:', JSON.parse(body));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                message: 'Thank you for your message. We will respond within 24 hours.',
                timestamp: new Date().toISOString()
            }));
        }
    }
};

function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'application/octet-stream';
}

function serveFile(filePath, res) {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found, serve 404 page
                const notFoundPath = path.join(PUBLIC_DIR, '404.html');
                fs.readFile(notFoundPath, (err404, content404) => {
                    if (err404) {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('404 - Page Not Found');
                    } else {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(content404);
                    }
                });
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 - Internal Server Error');
            }
        } else {
            const contentType = getContentType(filePath);
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
}

function handleApiRequest(pathname, req, res) {
    const apiConfig = mockApiResponses[pathname];
    
    if (!apiConfig) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'API endpoint not found' }));
        return;
    }

    if (req.method !== apiConfig.method) {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    // Collect request body for POST requests
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            apiConfig.handler(req, res, body);
        });
    } else {
        apiConfig.handler(req, res, '');
    }
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;

    // Add CORS headers for API requests
    if (pathname.startsWith('/api/')) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }
        
        handleApiRequest(pathname, req, res);
        return;
    }

    // Handle URL rewrites
    if (rewrites[pathname]) {
        pathname = rewrites[pathname];
    }

    // Default to index.html for root
    if (pathname === '/') {
        pathname = '/index.html';
    }

    // Remove query parameters and construct file path
    const cleanPathname = pathname.split('?')[0];
    const filePath = path.join(PUBLIC_DIR, cleanPathname);

    // Security check - prevent directory traversal
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 - Forbidden');
        return;
    }

    serveFile(filePath, res);
});

server.listen(PORT, () => {
    console.log('🚀 Axis Thorn Test Server Started');
    console.log('==========================================');
    console.log(`📍 Server running at: http://localhost:${PORT}`);
    console.log('📄 Available pages:');
    console.log(`   • Homepage: http://localhost:${PORT}`);
    console.log(`   • Services: http://localhost:${PORT}/services`);
    console.log(`   • Consultation: http://localhost:${PORT}/consultation`);
    console.log(`   • Contact Form: http://localhost:${PORT}/contact-form`);
    console.log(`   • Privacy Policy: http://localhost:${PORT}/privacy-policy`);
    console.log(`   • Terms of Service: http://localhost:${PORT}/terms-of-service`);
    console.log(`   • Cookie Policy: http://localhost:${PORT}/cookie-policy`);
    console.log(`   • 404 Test: http://localhost:${PORT}/nonexistent-page`);
    console.log('');
    console.log('🧪 Test Features:');
    console.log('   • Contact form submission (mocked)');
    console.log('   • Error handling and notifications');
    console.log('   • Navigation and responsive design');
    console.log('   • Legal page compliance');
    console.log('');
    console.log('⏹  Press Ctrl+C to stop the server');
    console.log('==========================================');
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please close other applications using this port or try a different port.`);
    } else {
        console.error('❌ Server error:', err);
    }
});