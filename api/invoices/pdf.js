// PDF generation endpoint for invoices
const { withMiddleware, withRateLimit } = require('../utils/handler-wrapper');
const { rateLimiters, logger } = require('../middleware/security');
const prisma = require('../../lib/prisma');
const PDFService = require('../../services/pdfService');

const handler = async (req, res) => {
  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Invoice ID is required' });
    }

    // Get invoice with all related data
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          orderBy: { order: 'asc' }
        },
        payments: true
      }
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Generate PDF
    logger.info(`Generating PDF for invoice: ${invoice.id}`);
    const pdfBuffer = await PDFService.generateInvoicePDF(invoice);
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    logger.info(`PDF generated successfully for invoice: ${invoice.id}, size: ${pdfBuffer.length} bytes`);
    return res.status(200).send(pdfBuffer);

  } catch (error) {
    logger.error('PDF generation error:', error);
    throw error; // Let the wrapper handle it
  }
};

// Export the wrapped handler with middleware and rate limiting
module.exports = withMiddleware(
  withRateLimit(handler, rateLimiters.general)
);