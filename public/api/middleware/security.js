// Security middleware for all API endpoints
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const winston = require('winston');

// Configure logger with production log aggregation support
const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  })
];

// Add file transports in development
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  );
}

// Add external log aggregation in production
if (process.env.NODE_ENV === 'production' && process.env.LOG_TOKEN) {
  // Example: Datadog
  if (process.env.LOG_SERVICE === 'datadog') {
    const DatadogTransport = require('winston-datadog-transport');
    transports.push(new DatadogTransport({
      apiKey: process.env.LOG_TOKEN,
      service: 'axis-thorn-api',
      ddsource: 'nodejs',
      ddtags: `env:${process.env.NODE_ENV}`,
      hostname: process.env.HOSTNAME || 'api',
    }));
  }
  // Example: Logtail
  else if (process.env.LOG_SERVICE === 'logtail') {
    const { Logtail } = require('@logtail/node');
    const { LogtailTransport } = require('@logtail/winston');
    const logtail = new Logtail(process.env.LOG_TOKEN);
    transports.push(new LogtailTransport(logtail));
  }
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { 
    service: 'axis-thorn-api',
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  },
  transports
});

// Rate limiting configuration with Redis support
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');

const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Use Redis in production, memory store in development
  let store = undefined;
  
  if (isProduction && process.env.REDIS_URL) {
    const client = new Redis(process.env.REDIS_URL);
    store = new RedisStore({
      client: client,
      prefix: 'rl:',
    });
    
    logger.info('Rate limiter using Redis store');
  } else if (isProduction && !process.env.REDIS_URL) {
    logger.error('REDIS_URL not set in production - rate limiting will not work properly across replicas');
    process.exit(1);
  } else {
    logger.info('Rate limiter using memory store (development mode)');
  }
  
  return rateLimit({
    windowMs,
    max,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    store,
  });
};

// API rate limiters for different endpoints
const rateLimiters = {
  general: createRateLimiter(15 * 60 * 1000, 100), // 100 requests per 15 minutes
  auth: createRateLimiter(15 * 60 * 1000, 5), // 5 auth attempts per 15 minutes
  stripe: createRateLimiter(60 * 1000, 10), // 10 payment requests per minute
};

// CORS configuration - restricted to specific origins
const { validateEnvironment } = require('../../lib/env-check');
const { allowedOrigins, isProduction } = validateEnvironment();

const corsOptions = {
  origin: function (origin, callback) {
    // Production: strict origin check
    if (isProduction) {
      if (!origin || allowedOrigins.indexOf(origin) === -1) {
        callback(new Error('Not allowed by CORS'));
      } else {
        callback(null, true);
      }
      return;
    }
    
    // Development: allow localhost
    const devOrigins = [
      ...allowedOrigins,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:8080'
    ];
    
    // Allow requests with no origin in dev (Postman, etc)
    if (!origin) return callback(null, true);
    
    if (devOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  maxAge: 86400 // 24 hours
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Apply Helmet for security headers
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ['\'self\''],
        styleSrc: ['\'self\'', '\'unsafe-inline\''],
        scriptSrc: ['\'self\'', '\'unsafe-inline\'', '\'unsafe-eval\''],
        imgSrc: ['\'self\'', 'data:', 'https:'],
        connectSrc: ['\'self\'', 'https://api.stripe.com'],
        fontSrc: ['\'self\'', 'https:', 'data:'],
        objectSrc: ['\'none\''],
        mediaSrc: ['\'self\''],
        frameSrc: ['\'self\'', 'https://js.stripe.com', 'https://hooks.stripe.com'],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  })(req, res, next);
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : err.message;

  res.status(err.status || 500).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Request logger middleware
const requestLogger = (req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
};

module.exports = {
  logger,
  rateLimiters,
  corsOptions,
  securityHeaders,
  errorHandler,
  requestLogger,
  createRateLimiter
};