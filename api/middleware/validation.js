// Input validation middleware using Joi
const Joi = require('joi');

// Validation schemas for different entities
const schemas = {
  // Invoice validation schema
  invoice: Joi.object({
    customer: Joi.object({
      name: Joi.string().min(1).max(100).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().pattern(/^[\d\s\-\+\(\)]+$/).optional(),
      address: Joi.string().max(500).optional()
    }).required(),
    items: Joi.array().items(
      Joi.object({
        description: Joi.string().min(1).max(500).required(),
        quantity: Joi.number().positive().required(),
        unitPrice: Joi.number().positive().required(),
        amount: Joi.number().positive().optional()
      })
    ).min(1).required(),
    discount: Joi.number().min(0).optional(),
    discountType: Joi.string().valid('fixed', 'percentage').optional(),
    taxRate: Joi.number().min(0).max(100).optional(),
    notes: Joi.string().max(1000).optional(),
    terms: Joi.string().max(1000).optional(),
    due_date: Joi.date().iso().optional(),
    status: Joi.string().valid('draft', 'sent', 'paid', 'overdue', 'cancelled').optional()
  }),

  // Customer validation schema
  customer: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[\d\s\-\+\(\)]+$/).optional(),
    company: Joi.string().max(100).optional(),
    address: Joi.object({
      street: Joi.string().max(200).optional(),
      city: Joi.string().max(100).optional(),
      state: Joi.string().max(50).optional(),
      zipCode: Joi.string().max(20).optional(),
      country: Joi.string().max(100).optional()
    }).optional(),
    taxId: Joi.string().max(50).optional()
  }),

  // Product validation schema
  product: Joi.object({
    name: Joi.string().min(1).max(200).required(),
    description: Joi.string().max(1000).optional(),
    price: Joi.number().positive().required(),
    category: Joi.string().max(100).optional(),
    sku: Joi.string().alphanum().max(50).optional(),
    active: Joi.boolean().optional()
  }),

  // Payment validation schema
  payment: Joi.object({
    amount: Joi.number().positive().required(),
    currency: Joi.string().length(3).uppercase().default('USD'),
    payment_method_id: Joi.string().required(),
    description: Joi.string().max(500).optional(),
    metadata: Joi.object().optional()
  }),

  // Email validation schema
  email: Joi.object({
    to: Joi.string().email().required(),
    subject: Joi.string().min(1).max(200).required(),
    body: Joi.string().min(1).max(10000).required(),
    cc: Joi.array().items(Joi.string().email()).optional(),
    bcc: Joi.array().items(Joi.string().email()).optional()
  }),

  // Query parameter validation
  listQuery: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string().valid('created_at', 'updated_at', 'name', 'amount').default('created_at'),
    order: Joi.string().valid('asc', 'desc').default('desc'),
    search: Joi.string().max(100).optional(),
    status: Joi.string().optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional()
  }),

  // ID parameter validation
  idParam: Joi.object({
    id: Joi.string().required()
  })
};

// Validation middleware factory
const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return next(new Error(`Validation schema '${schemaName}' not found`));
    }

    // Determine what to validate based on the request
    let dataToValidate;
    if (schemaName === 'listQuery') {
      dataToValidate = req.query;
    } else if (schemaName === 'idParam') {
      dataToValidate = req.params;
    } else {
      dataToValidate = req.body;
    }

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true // Remove unknown fields
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Validation failed',
        errors: errors
      });
    }

    // Replace the request data with the validated value
    if (schemaName === 'listQuery') {
      req.query = value;
    } else if (schemaName === 'idParam') {
      req.params = value;
    } else {
      req.body = value;
    }

    next();
  };
};

// Sanitize HTML to prevent XSS
const sanitizeHtml = (str) => {
  if (typeof str !== 'string') {return str;}
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Middleware to sanitize all string inputs
const sanitizeInputs = (req, res, next) => {
  const sanitizeObject = (obj) => {
    if (typeof obj === 'string') {
      return sanitizeHtml(obj);
    } else if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    } else if (obj !== null && typeof obj === 'object') {
      const sanitized = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = sanitizeObject(obj[key]);
        }
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

module.exports = {
  validate,
  sanitizeInputs,
  schemas
};