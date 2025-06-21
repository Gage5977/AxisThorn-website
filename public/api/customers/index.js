// Vercel serverless function for customer management with Prisma
const { withMiddleware, withRateLimit } = require('../utils/handler-wrapper');
const { validate } = require('../middleware/validation');
const { rateLimiters, logger } = require('../middleware/security');
const prisma = require('../../lib/prisma');

// Helper function to format customer for API response
function formatCustomerForAPI(customer) {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    company: customer.company,
    address: customer.address,
    taxId: customer.taxId,
    created_at: customer.createdAt.toISOString(),
    updated_at: customer.updatedAt.toISOString()
  };
}

// Main handler function
const handler = async (req, res) => {
  try {
    // Get demo user for development
    const demoUser = await prisma.user.findFirst({
      where: { email: 'demo@axisthorn.com' }
    });
    
    if (!demoUser) {
      return res.status(500).json({ error: 'Demo user not found' });
    }

    switch (req.method) {
    case 'GET':
      if (req.query.id) {
        // Get single customer
        const customer = await prisma.customer.findUnique({
          where: { id: req.query.id }
        });
        
        if (!customer) {
          return res.status(404).json({ error: 'Customer not found' });
        }
        
        logger.info(`Customer retrieved: ${customer.id}`);
        return res.status(200).json(formatCustomerForAPI(customer));
      }

      // List all customers with pagination
      const { page = 1, limit = 20, search } = req.query;
      
      // Build where clause for filtering
      const where = {
        userId: demoUser.id
      };
      
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { company: { contains: search, mode: 'insensitive' } }
        ];
      }

      // Get total count for pagination
      const totalCount = await prisma.customer.count({ where });
      
      // Get paginated customers
      const customers = await prisma.customer.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit)
      });

      return res.status(200).json({
        data: customers.map(formatCustomerForAPI),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          totalPages: Math.ceil(totalCount / parseInt(limit))
        }
      });

    case 'POST':
      const customerData = req.body;
      
      // Check if customer already exists
      const existingCustomer = await prisma.customer.findFirst({
        where: { 
          email: customerData.email,
          userId: demoUser.id
        }
      });
      
      if (existingCustomer) {
        return res.status(400).json({ error: 'Customer with this email already exists' });
      }
      
      // Create new customer
      const newCustomer = await prisma.customer.create({
        data: {
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone || null,
          company: customerData.company || null,
          address: customerData.address || null,
          taxId: customerData.taxId || null,
          userId: demoUser.id
        }
      });

      logger.info(`Customer created: ${newCustomer.id}`);
      return res.status(201).json(formatCustomerForAPI(newCustomer));

    case 'PUT':
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'Customer ID is required' });
      }

      // Check if customer exists
      const customerToUpdate = await prisma.customer.findUnique({
        where: { id }
      });
      
      if (!customerToUpdate) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      const updateData = req.body;
      
      // Update customer
      const updatedCustomer = await prisma.customer.update({
        where: { id },
        data: {
          name: updateData.name !== undefined ? updateData.name : customerToUpdate.name,
          email: updateData.email !== undefined ? updateData.email : customerToUpdate.email,
          phone: updateData.phone !== undefined ? updateData.phone : customerToUpdate.phone,
          company: updateData.company !== undefined ? updateData.company : customerToUpdate.company,
          address: updateData.address !== undefined ? updateData.address : customerToUpdate.address,
          taxId: updateData.taxId !== undefined ? updateData.taxId : customerToUpdate.taxId
        }
      });

      logger.info(`Customer updated: ${updatedCustomer.id}`);
      return res.status(200).json(formatCustomerForAPI(updatedCustomer));

    case 'DELETE':
      const deleteId = req.query.id;
      if (!deleteId) {
        return res.status(400).json({ error: 'Customer ID is required' });
      }

      // Check if customer exists
      const customerToDelete = await prisma.customer.findUnique({
        where: { id: deleteId }
      });
      
      if (!customerToDelete) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      // Check if customer has invoices
      const invoiceCount = await prisma.invoice.count({
        where: { customerId: deleteId }
      });
      
      if (invoiceCount > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete customer with existing invoices',
          invoiceCount 
        });
      }

      // Delete customer
      await prisma.customer.delete({
        where: { id: deleteId }
      });

      logger.info(`Customer deleted: ${deleteId}`);
      return res.status(200).json({ message: 'Customer deleted successfully', id: deleteId });

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    logger.error('Customer API Error:', error);
    throw error; // Let the wrapper handle it
  }
};

// Export the wrapped handler with middleware and rate limiting
module.exports = withMiddleware(
  withRateLimit(handler, rateLimiters.general)
);