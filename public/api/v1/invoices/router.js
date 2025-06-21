// Invoice API Router - handles all invoice-related endpoints
const invoiceHandler = require('../../invoices');
const pdfHandler = require('./pdf');

module.exports = async (req, res) => {
  // Extract sub-path from URL
  const urlParts = req.url.split('?')[0].split('/').filter(Boolean);
  
  // Check if this is a PDF request
  if (urlParts[0] === 'pdf') {
    // Adjust URL for PDF handler
    req.url = req.url.replace('/pdf', '');
    if (req.url === '') req.url = '/';
    return pdfHandler(req, res);
  }
  
  // Otherwise, handle as regular invoice request
  return invoiceHandler(req, res);
};