// Vercel serverless function for product management with Prisma
const { withMiddleware, withRateLimit } = require('../utils/handler-wrapper');
const { validate } = require('../middleware/validation');
const { rateLimiters, logger } = require('../middleware/security');
const prisma = require('../../lib/prisma');

// Helper function to format product for API response
function formatProductForAPI(product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    sku: product.sku,
    active: product.active,
    created_at: product.createdAt.toISOString(),
    updated_at: product.updatedAt.toISOString()
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
        // Get single product
        const product = await prisma.product.findUnique({
          where: { id: req.query.id }
        });
        
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
        
        logger.info(`Product retrieved: ${product.id}`);
        return res.status(200).json(formatProductForAPI(product));
      }

      // List all products with pagination
      const { page = 1, limit = 20, search, category, active } = req.query;
      
      // Build where clause for filtering
      const where = {
        userId: demoUser.id
      };
      
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      if (category) {
        where.category = category;
      }
      
      if (active !== undefined) {
        where.active = active === 'true';
      }

      // Get total count for pagination
      const totalCount = await prisma.product.count({ where });
      
      // Get paginated products
      const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit)
      });

      return res.status(200).json({
        data: products.map(formatProductForAPI),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          totalPages: Math.ceil(totalCount / parseInt(limit))
        }
      });

    case 'POST':
      const productData = req.body;
      
      // Check if product with same SKU already exists
      if (productData.sku) {
        const existingProduct = await prisma.product.findFirst({
          where: { 
            sku: productData.sku,
            userId: demoUser.id
          }
        });
        
        if (existingProduct) {
          return res.status(400).json({ error: 'Product with this SKU already exists' });
        }
      }
      
      // Create new product
      const newProduct = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description || null,
          price: parseFloat(productData.price),
          category: productData.category || null,
          sku: productData.sku || null,
          active: productData.active !== false,
          userId: demoUser.id
        }
      });

      logger.info(`Product created: ${newProduct.id}`);
      return res.status(201).json(formatProductForAPI(newProduct));

    case 'PUT':
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'Product ID is required' });
      }

      // Check if product exists
      const productToUpdate = await prisma.product.findUnique({
        where: { id }
      });
      
      if (!productToUpdate) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const updateData = req.body;
      
      // Check SKU uniqueness if updating
      if (updateData.sku && updateData.sku !== productToUpdate.sku) {
        const existingProduct = await prisma.product.findFirst({
          where: { 
            sku: updateData.sku,
            userId: demoUser.id,
            NOT: { id }
          }
        });
        
        if (existingProduct) {
          return res.status(400).json({ error: 'Product with this SKU already exists' });
        }
      }
      
      // Update product
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          name: updateData.name !== undefined ? updateData.name : productToUpdate.name,
          description: updateData.description !== undefined ? updateData.description : productToUpdate.description,
          price: updateData.price !== undefined ? parseFloat(updateData.price) : productToUpdate.price,
          category: updateData.category !== undefined ? updateData.category : productToUpdate.category,
          sku: updateData.sku !== undefined ? updateData.sku : productToUpdate.sku,
          active: updateData.active !== undefined ? updateData.active : productToUpdate.active
        }
      });

      logger.info(`Product updated: ${updatedProduct.id}`);
      return res.status(200).json(formatProductForAPI(updatedProduct));

    case 'DELETE':
      const deleteId = req.query.id;
      if (!deleteId) {
        return res.status(400).json({ error: 'Product ID is required' });
      }

      // Check if product exists
      const productToDelete = await prisma.product.findUnique({
        where: { id: deleteId }
      });
      
      if (!productToDelete) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Check if product is used in any invoice items
      const invoiceItemCount = await prisma.invoiceItem.count({
        where: { productId: deleteId }
      });
      
      if (invoiceItemCount > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete product that is used in invoices',
          invoiceItemCount 
        });
      }

      // Delete product
      await prisma.product.delete({
        where: { id: deleteId }
      });

      logger.info(`Product deleted: ${deleteId}`);
      return res.status(200).json({ message: 'Product deleted successfully', id: deleteId });

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    logger.error('Product API Error:', error);
    throw error; // Let the wrapper handle it
  }
};

// Export the wrapped handler with middleware and rate limiting
module.exports = withMiddleware(
  withRateLimit(handler, rateLimiters.general)
);