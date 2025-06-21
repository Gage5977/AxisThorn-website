// Vercel serverless function for invoice management with enhanced security
const { v4: uuidv4 } = require('uuid');
const { withMiddleware, withRateLimit } = require('../utils/handler-wrapper');
const { validate } = require('../middleware/validation');
const { rateLimiters, logger } = require('../middleware/security');
const prisma = require('../../lib/prisma');

// Helper function to format invoice for API response
function formatInvoiceForAPI(invoice) {
  return {
    id: invoice.id,
    invoice_number: invoice.invoiceNumber,
    customer: {
      id: invoice.customer?.id,
      name: invoice.customer?.name,
      email: invoice.customer?.email,
      phone: invoice.customer?.phone,
      company: invoice.customer?.company,
      address: invoice.customer?.address
    },
    items: invoice.items?.map(item => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      amount: item.amount
    })) || [],
    subtotal: invoice.subtotal,
    discount: invoice.discount,
    discountType: invoice.discountType,
    tax: invoice.tax,
    taxRate: invoice.taxRate,
    total: invoice.total,
    amount_due: invoice.amountDue,
    amount_paid: invoice.amountPaid,
    status: invoice.status.toLowerCase(),
    payment_status: invoice.paymentStatus.toLowerCase(),
    notes: invoice.notes,
    terms: invoice.terms,
    created_at: invoice.createdAt.toISOString(),
    updated_at: invoice.updatedAt.toISOString(),
    due_date: invoice.dueDate.toISOString()
  };
}

// Main handler function
const handler = async (req, res) => {
  try {
    switch (req.method) {
    case 'GET':
      // Apply query validation
      const validateQuery = validate('listQuery');
      await new Promise((resolve) => validateQuery(req, res, resolve));
        
      if (req.query.id) {
        // Get single invoice
        const invoice = await prisma.invoice.findUnique({
          where: { id: req.query.id },
          include: {
            customer: true,
            items: true,
            payments: true
          }
        });
        
        if (!invoice) {
          return res.status(404).json({ error: 'Invoice not found' });
        }
        
        logger.info(`Invoice retrieved: ${invoice.id}`);
        return res.status(200).json(formatInvoiceForAPI(invoice));
      }

      // List all invoices with pagination
      const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', search, status } = req.query;
      
      // Build where clause for filtering
      const where = {};
      if (status) {
        where.status = status.toUpperCase();
      }
      if (search) {
        where.OR = [
          { invoiceNumber: { contains: search, mode: 'insensitive' } },
          { customer: { name: { contains: search, mode: 'insensitive' } } },
          { customer: { email: { contains: search, mode: 'insensitive' } } }
        ];
      }

      // Get total count for pagination
      const totalCount = await prisma.invoice.count({ where });
      
      // Get paginated invoices
      const invoices = await prisma.invoice.findMany({
        where,
        include: {
          customer: true,
          items: true,
          payments: true
        },
        orderBy: { [sort === 'created_at' ? 'createdAt' : sort]: order },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit)
      });

      return res.status(200).json({
        data: invoices.map(formatInvoiceForAPI),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          totalPages: Math.ceil(totalCount / parseInt(limit))
        }
      });

    case 'POST':
      // Apply invoice validation
      const validateInvoice = validate('invoice');
      await new Promise((resolve, reject) => {
        validateInvoice(req, res, (err) => {
          if (err) {reject(err);}
          else {resolve();}
        });
      });

      const invoiceData = req.body;
      
      // Get demo user for development
      const demoUser = await prisma.user.findFirst({
        where: { email: 'demo@axisthorn.com' }
      });
      
      if (!demoUser) {
        return res.status(500).json({ error: 'Demo user not found' });
      }
      
      // Create or find customer
      let customer = await prisma.customer.findFirst({
        where: { email: invoiceData.customer.email }
      });
      
      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name: invoiceData.customer.name,
            email: invoiceData.customer.email,
            phone: invoiceData.customer.phone || null,
            company: invoiceData.customer.company || null,
            address: invoiceData.customer.address || null,
            userId: demoUser.id
          }
        });
      }
        
      // Calculate totals
      let subtotal = 0;
      if (invoiceData.items && Array.isArray(invoiceData.items)) {
        subtotal = invoiceData.items.reduce((sum, item) => {
          return sum + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0));
        }, 0);
      }

      let discountAmount = 0;
      if (invoiceData.discount) {
        if (invoiceData.discountType === 'percentage') {
          discountAmount = subtotal * (parseFloat(invoiceData.discount) / 100);
        } else {
          discountAmount = parseFloat(invoiceData.discount);
        }
      }

      const afterDiscount = subtotal - discountAmount;
      const taxAmount = afterDiscount * (parseFloat(invoiceData.taxRate || 0) / 100);
      const total = afterDiscount + taxAmount;

      // Generate invoice number
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

      // Create invoice with items
      const newInvoice = await prisma.invoice.create({
        data: {
          invoiceNumber,
          customerId: customer.id,
          userId: demoUser.id,
          subtotal,
          discount: discountAmount,
          discountType: invoiceData.discountType === 'percentage' ? 'PERCENTAGE' : 'FIXED',
          tax: taxAmount,
          taxRate: parseFloat(invoiceData.taxRate || 0),
          total,
          amountDue: total,
          status: 'DRAFT',
          paymentStatus: 'UNPAID',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          notes: invoiceData.notes || null,
          terms: invoiceData.terms || null,
          items: {
            create: invoiceData.items.map((item, index) => ({
              description: item.description,
              quantity: parseFloat(item.quantity),
              unitPrice: parseFloat(item.unitPrice),
              amount: parseFloat(item.quantity) * parseFloat(item.unitPrice),
              order: index
            }))
          }
        },
        include: {
          customer: true,
          items: true
        }
      });

      logger.info(`Invoice created: ${newInvoice.id}`);
      return res.status(201).json(formatInvoiceForAPI(newInvoice));

    case 'PUT':
      // Update invoice
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'Invoice ID is required' });
      }

      // Check if invoice exists
      const existingInvoice = await prisma.invoice.findUnique({
        where: { id },
        include: { customer: true, items: true }
      });
      
      if (!existingInvoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }

      // Apply validation for update
      const validateUpdate = validate('invoice');
      await new Promise((resolve, reject) => {
        validateUpdate(req, res, (err) => {
          if (err) {reject(err);}
          else {resolve();}
        });
      });

      const updatedData = req.body;
      
      // Recalculate totals if items changed
      let updatedSubtotal = 0;
      if (updatedData.items && Array.isArray(updatedData.items)) {
        updatedSubtotal = updatedData.items.reduce((sum, item) => {
          return sum + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0));
        }, 0);
      }

      let updatedDiscountAmount = 0;
      if (updatedData.discount) {
        if (updatedData.discountType === 'percentage') {
          updatedDiscountAmount = updatedSubtotal * (parseFloat(updatedData.discount) / 100);
        } else {
          updatedDiscountAmount = parseFloat(updatedData.discount);
        }
      }

      const updatedAfterDiscount = updatedSubtotal - updatedDiscountAmount;
      const updatedTaxAmount = updatedAfterDiscount * (parseFloat(updatedData.taxRate || 0) / 100);
      const totalAmount = updatedAfterDiscount + updatedTaxAmount;

      // Update invoice
      const updatedInvoice = await prisma.invoice.update({
        where: { id },
        data: {
          subtotal: updatedSubtotal,
          discount: updatedDiscountAmount,
          discountType: updatedData.discountType === 'percentage' ? 'PERCENTAGE' : 'FIXED',
          tax: updatedTaxAmount,
          taxRate: parseFloat(updatedData.taxRate || 0),
          total: totalAmount,
          amountDue: totalAmount - (existingInvoice.amountPaid || 0),
          status: updatedData.status ? updatedData.status.toUpperCase() : existingInvoice.status,
          notes: updatedData.notes !== undefined ? updatedData.notes : existingInvoice.notes,
          terms: updatedData.terms !== undefined ? updatedData.terms : existingInvoice.terms,
          // Update items if provided
          ...(updatedData.items && {
            items: {
              deleteMany: {},
              create: updatedData.items.map((item, index) => ({
                description: item.description,
                quantity: parseFloat(item.quantity),
                unitPrice: parseFloat(item.unitPrice),
                amount: parseFloat(item.quantity) * parseFloat(item.unitPrice),
                order: index
              }))
            }
          })
        },
        include: {
          customer: true,
          items: true
        }
      });

      logger.info(`Invoice updated: ${updatedInvoice.id}`);
      return res.status(200).json(formatInvoiceForAPI(updatedInvoice));

    case 'DELETE':
      // Delete invoice
      const deleteId = req.query.id;
      if (!deleteId) {
        return res.status(400).json({ error: 'Invoice ID is required' });
      }

      // Check if invoice exists
      const invoiceToDelete = await prisma.invoice.findUnique({
        where: { id: deleteId }
      });
      
      if (!invoiceToDelete) {
        return res.status(404).json({ error: 'Invoice not found' });
      }

      // Delete invoice (this will cascade delete items due to onDelete: Cascade)
      await prisma.invoice.delete({
        where: { id: deleteId }
      });

      logger.info(`Invoice deleted: ${deleteId}`);
      return res.status(200).json({ message: 'Invoice deleted successfully', id: deleteId });

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    logger.error('Invoice API Error:', error);
    throw error; // Let the wrapper handle it
  }
};

// Export the wrapped handler with middleware and rate limiting
module.exports = withMiddleware(
  withRateLimit(handler, rateLimiters.general)
);