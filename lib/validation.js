// Input Validation and Sanitization Library

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Common validation patterns
const PATTERNS = {
    email: EMAIL_REGEX,
    phone: /^\+?[\d\s\-\(\)]+$/,
    url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    alphanumeric: /^[a-zA-Z0-9]+$/,
    numeric: /^\d+$/,
    decimal: /^\d+(\.\d+)?$/,
    uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
};

// Validate email address
export function validateEmail(email) {
    if (!email || typeof email !== 'string') {
        return false;
    }
    return EMAIL_REGEX.test(email.trim());
}

// Sanitize string input
export function sanitizeInput(input, options = {}) {
    if (input === null || input === undefined) {
        return '';
    }
    
    // Convert to string
    let sanitized = String(input);
    
    // Trim whitespace
    if (options.trim !== false) {
        sanitized = sanitized.trim();
    }
    
    // Remove HTML tags
    if (options.stripHtml !== false) {
        sanitized = sanitized.replace(/<[^>]*>/g, '');
    }
    
    // Escape HTML entities
    if (options.escapeHtml) {
        sanitized = sanitized
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }
    
    // Remove non-printable characters
    if (options.stripNonPrintable) {
        sanitized = sanitized.replace(/[^\x20-\x7E]/g, '');
    }
    
    // Limit length
    if (options.maxLength && sanitized.length > options.maxLength) {
        sanitized = sanitized.substring(0, options.maxLength);
    }
    
    // Convert to lowercase
    if (options.toLowerCase) {
        sanitized = sanitized.toLowerCase();
    }
    
    // Convert to uppercase
    if (options.toUpperCase) {
        sanitized = sanitized.toUpperCase();
    }
    
    return sanitized;
}

// Validate request data against a schema
export function validateRequest(data, schema) {
    const errors = {};
    const validated = {};
    
    // Check each field in schema
    for (const [field, rules] of Object.entries(schema)) {
        const value = data[field];
        const fieldErrors = [];
        
        // Required check
        if (rules.required && (value === null || value === undefined || value === '')) {
            fieldErrors.push(`${field} is required`);
            errors[field] = fieldErrors;
            continue;
        }
        
        // Skip validation if not required and empty
        if (!rules.required && (value === null || value === undefined || value === '')) {
            continue;
        }
        
        // Type check
        if (rules.type) {
            switch (rules.type) {
                case 'string':
                    if (typeof value !== 'string') {
                        fieldErrors.push(`${field} must be a string`);
                    }
                    break;
                    
                case 'number':
                    if (typeof value !== 'number' || isNaN(value)) {
                        fieldErrors.push(`${field} must be a number`);
                    }
                    break;
                    
                case 'boolean':
                    if (typeof value !== 'boolean') {
                        fieldErrors.push(`${field} must be a boolean`);
                    }
                    break;
                    
                case 'email':
                    if (!validateEmail(value)) {
                        fieldErrors.push(`${field} must be a valid email address`);
                    }
                    break;
                    
                case 'array':
                    if (!Array.isArray(value)) {
                        fieldErrors.push(`${field} must be an array`);
                    }
                    break;
                    
                case 'object':
                    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
                        fieldErrors.push(`${field} must be an object`);
                    }
                    break;
            }
        }
        
        // String validations
        if (typeof value === 'string') {
            // Min length
            if (rules.minLength && value.length < rules.minLength) {
                fieldErrors.push(`${field} must be at least ${rules.minLength} characters`);
            }
            
            // Max length
            if (rules.maxLength && value.length > rules.maxLength) {
                fieldErrors.push(`${field} must be no more than ${rules.maxLength} characters`);
            }
            
            // Pattern matching
            if (rules.pattern) {
                const pattern = typeof rules.pattern === 'string' ? PATTERNS[rules.pattern] : rules.pattern;
                if (pattern && !pattern.test(value)) {
                    fieldErrors.push(`${field} has invalid format`);
                }
            }
            
            // Enum values
            if (rules.enum && !rules.enum.includes(value)) {
                fieldErrors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
            }
        }
        
        // Number validations
        if (typeof value === 'number') {
            // Min value
            if (rules.min !== undefined && value < rules.min) {
                fieldErrors.push(`${field} must be at least ${rules.min}`);
            }
            
            // Max value
            if (rules.max !== undefined && value > rules.max) {
                fieldErrors.push(`${field} must be no more than ${rules.max}`);
            }
        }
        
        // Array validations
        if (Array.isArray(value)) {
            // Min items
            if (rules.minItems && value.length < rules.minItems) {
                fieldErrors.push(`${field} must have at least ${rules.minItems} items`);
            }
            
            // Max items
            if (rules.maxItems && value.length > rules.maxItems) {
                fieldErrors.push(`${field} must have no more than ${rules.maxItems} items`);
            }
        }
        
        // Custom validation function
        if (rules.custom && typeof rules.custom === 'function') {
            const customError = rules.custom(value, data);
            if (customError) {
                fieldErrors.push(customError);
            }
        }
        
        // Add errors if any
        if (fieldErrors.length > 0) {
            errors[field] = fieldErrors;
        } else {
            // Add to validated data
            validated[field] = value;
        }
    }
    
    return {
        valid: Object.keys(errors).length === 0,
        errors,
        data: validated
    };
}

// Sanitize object recursively
export function sanitizeObject(obj, options = {}) {
    if (obj === null || obj === undefined) {
        return obj;
    }
    
    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item, options));
    }
    
    if (typeof obj === 'object') {
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string') {
                sanitized[key] = sanitizeInput(value, options);
            } else {
                sanitized[key] = sanitizeObject(value, options);
            }
        }
        return sanitized;
    }
    
    if (typeof obj === 'string') {
        return sanitizeInput(obj, options);
    }
    
    return obj;
}

// Validate environment variables
export function validateEnvVars(required = []) {
    const missing = [];
    const invalid = [];
    
    for (const envVar of required) {
        const value = process.env[envVar];
        
        if (!value) {
            missing.push(envVar);
            continue;
        }
        
        // Special validation for certain env vars
        switch (envVar) {
            case 'JWT_SECRET':
                if (value.length < 32) {
                    invalid.push(`${envVar} must be at least 32 characters`);
                }
                break;
                
            case 'DATABASE_URL':
                if (!value.startsWith('postgres://') && !value.startsWith('postgresql://')) {
                    invalid.push(`${envVar} must be a valid PostgreSQL connection string`);
                }
                break;
                
            case 'STRIPE_SECRET_KEY':
                if (!value.startsWith('sk_')) {
                    invalid.push(`${envVar} must be a valid Stripe secret key`);
                }
                break;
                
            case 'STRIPE_PUBLISHABLE_KEY':
                if (!value.startsWith('pk_')) {
                    invalid.push(`${envVar} must be a valid Stripe publishable key`);
                }
                break;
        }
    }
    
    return {
        valid: missing.length === 0 && invalid.length === 0,
        missing,
        invalid
    };
}

// Export common patterns for reuse
export { PATTERNS };