// Vercel serverless function for payment management with Prisma
const { withMiddleware, withRateLimit } = require('../utils/handler-wrapper');
const { validate } = require('../middleware/validation');
const { rateLimiters, logger } = require('../middleware/security');
const prisma = require('../../lib/prisma');

// Helper function to format payment for API response
function formatPaymentForAPI(payment) {
  return {
    id: payment.id,
    invoiceId: payment.invoiceId,
    amount: payment.amount,
    currency: payment.currency,
    method: payment.method.toLowerCase(),
    stripePaymentId: payment.stripePaymentId,
    status: payment.status.toLowerCase(),
    notes: payment.notes,
    created_at: payment.createdAt.toISOString(),
    updated_at: payment.updatedAt.toISOString()
  };
}

// Main handler function
const handler = async (req, res) => {
  try {
    switch (req.method) {
    case 'GET':
      if (req.query.id) {
        // Get single payment
        const payment = await prisma.payment.findUnique({
          where: { id: req.query.id },
          include: {
            invoice: {
              include: {
                customer: true
              }
            }
          }
        });
        
        if (!payment) {
          return res.status(404).json({ error: 'Payment not found' });
        }
        
        logger.info(`Payment retrieved: ${payment.id}`);
        return res.status(200).json({
          ...formatPaymentForAPI(payment),
          invoice: {
            id: payment.invoice.id,
            invoiceNumber: payment.invoice.invoiceNumber,
            customer: payment.invoice.customer
          }
        });
      }

      // List payments with filters
      const { page = 1, limit = 20, invoiceId, status, method } = req.query;
      
      // Build where clause
      const where = {};
      
      if (invoiceId) {
        where.invoiceId = invoiceId;
      }
      
      if (status) {
        where.status = status.toUpperCase();
      }
      
      if (method) {
        where.method = method.toUpperCase();
      }

      // Get total count
      const totalCount = await prisma.payment.count({ where });
      
      // Get paginated payments
      const payments = await prisma.payment.findMany({
        where,
        include: {
          invoice: {
            select: {
              id: true,
              invoiceNumber: true,
              total: true,
              customer: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit)
      });

      return res.status(200).json({
        data: payments.map(payment => ({
          ...formatPaymentForAPI(payment),
          invoice: payment.invoice
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          totalPages: Math.ceil(totalCount / parseInt(limit))
        }
      });

    case 'POST':
      const paymentData = req.body;
      
      // Validate invoice exists
      const invoice = await prisma.invoice.findUnique({
        where: { id: paymentData.invoiceId }
      });
      
      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }
      
      // Check if invoice is already fully paid
      if (invoice.amountDue <= 0) {
        return res.status(400).json({ error: 'Invoice is already fully paid' });
      }
      
      // Validate payment amount
      const paymentAmount = parseFloat(paymentData.amount);
      if (paymentAmount <= 0) {
        return res.status(400).json({ error: 'Payment amount must be positive' });
      }
      
      if (paymentAmount > invoice.amountDue) {
        return res.status(400).json({ 
          error: 'Payment amount exceeds amount due',
          amountDue: invoice.amountDue 
        });
      }
      
      // Create payment
      const newPayment = await prisma.payment.create({
        data: {
          invoiceId: paymentData.invoiceId,
          amount: paymentAmount,
          currency: paymentData.currency || 'USD',
          method: paymentData.method?.toUpperCase() || 'OTHER',
          stripePaymentId: paymentData.stripePaymentId || null,
          status: 'PENDING',
          notes: paymentData.notes || null
        }
      });
      
      // Update invoice amounts
      await prisma.invoice.update({
        where: { id: paymentData.invoiceId },
        data: {
          amountPaid: invoice.amountPaid + paymentAmount,
          amountDue: invoice.amountDue - paymentAmount,
          status: invoice.amountDue - paymentAmount <= 0 ? 'PAID' : 'PARTIAL',
          paymentStatus: invoice.amountDue - paymentAmount <= 0 ? 'COMPLETED' : 'PROCESSING'
        }
      });

      logger.info(`Payment created: ${newPayment.id} for invoice ${invoice.invoiceNumber}`);
      return res.status(201).json(formatPaymentForAPI(newPayment));

    case 'PUT':
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'Payment ID is required' });
      }

      // Get existing payment
      const existingPayment = await prisma.payment.findUnique({
        where: { id },
        include: { invoice: true }
      });
      
      if (!existingPayment) {
        return res.status(404).json({ error: 'Payment not found' });
      }
      
      const updateData = req.body;
      
      // Only allow status updates
      if (updateData.status && updateData.status !== existingPayment.status) {
        const newStatus = updateData.status.toUpperCase();
        
        // Update payment status
        const updatedPayment = await prisma.payment.update({
          where: { id },
          data: {
            status: newStatus,
            notes: updateData.notes || existingPayment.notes
          }
        });
        
        // If payment is completed, update invoice
        if (newStatus === 'COMPLETED' && existingPayment.status !== 'COMPLETED') {
          await prisma.invoice.update({
            where: { id: existingPayment.invoiceId },
            data: {
              paymentStatus: existingPayment.invoice.amountDue <= existingPayment.amount ? 'COMPLETED' : 'PROCESSING'
            }
          });
        }
        
        logger.info(`Payment updated: ${updatedPayment.id}, status: ${newStatus}`);
        return res.status(200).json(formatPaymentForAPI(updatedPayment));
      }
      
      return res.status(400).json({ error: 'Only status updates are allowed' });

    case 'DELETE':
      // Payments should not be deleted, only voided/refunded
      return res.status(405).json({ error: 'Payments cannot be deleted. Use status update to mark as CANCELLED or REFUNDED.' });

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'OPTIONS']);
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    logger.error('Payment API Error:', error);
    throw error; // Let the wrapper handle it
  }
};

// Export the wrapped handler with middleware and rate limiting
module.exports = withMiddleware(
  withRateLimit(handler, rateLimiters.general)
);