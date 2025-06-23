// Contact Form API Endpoint
import { sendEmail, emailTemplates } from '../lib/email.js';
import { createRateLimiter } from './middleware/rate-limit.js';
import { validateRequest } from './middleware/validate-request.js';
import db from '../lib/db.js';

// Rate limit contact form submissions
const contactRateLimit = createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 submissions per hour
    message: 'Too many contact form submissions. Please try again later.'
});

// Validation schema
const contactSchema = {
    name: {
        required: true,
        type: 'string',
        minLength: 2,
        maxLength: 100
    },
    email: {
        required: true,
        type: 'email'
    },
    company: {
        type: 'string',
        maxLength: 100
    },
    type: {
        required: true,
        type: 'string',
        enum: ['consultation', 'implementation', 'support', 'general']
    },
    message: {
        required: true,
        type: 'string',
        minLength: 10,
        maxLength: 5000
    }
};

export default async function handler(req, res) {
    // Apply rate limiting
    await new Promise((resolve) => {
        contactRateLimit(req, res, resolve);
    });
    
    if (res.headersSent) return;
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'development' ? '*' : 'https://axisthorn.com');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    
    try {
        // Validate request
        const validation = validateRequest(req.body, contactSchema);
        if (!validation.valid) {
            return res.status(400).json({ errors: validation.errors });
        }
        
        const { name, email, company, type, message } = req.body;
        
        // Sanitize inputs
        const cleanData = {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            company: company?.trim() || null,
            type,
            message: message.trim()
        };
        
        // Log submission to database (if available)
        try {
            await db.activity.create({
                data: {
                    type: 'contact_form',
                    data: cleanData,
                    metadata: {
                        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                        userAgent: req.headers['user-agent']
                    }
                }
            });
        } catch (error) {
            console.error('Failed to log contact form submission:', error);
        }
        
        // Send email
        try {
            const emailData = emailTemplates.contactForm(cleanData);
            await sendEmail(emailData);
            
            // Send auto-reply to user
            await sendEmail({
                to: cleanData.email,
                subject: 'Thank you for contacting Axis Thorn',
                html: `
                    <div style="font-family: Inter, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #000; margin-bottom: 24px;">Thank you for your inquiry</h1>
                        <p style="color: #333; line-height: 1.6;">Hi ${cleanData.name},</p>
                        <p style="color: #333; line-height: 1.6;">
                            We've received your ${cleanData.type} inquiry and will respond within 24 business hours.
                        </p>
                        <p style="color: #333; line-height: 1.6;">
                            In the meantime, feel free to explore our services at 
                            <a href="https://axisthorn.com" style="color: #0066ff;">axisthorn.com</a>.
                        </p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
                        <p style="color: #999; font-size: 12px;">
                            Axis Thorn LLC<br>
                            AI-Powered Financial Intelligence
                        </p>
                    </div>
                `,
                text: `
Thank you for your inquiry

Hi ${cleanData.name},

We've received your ${cleanData.type} inquiry and will respond within 24 business hours.

In the meantime, feel free to explore our services at https://axisthorn.com.

Best regards,
Axis Thorn LLC
                `
            });
            
            res.status(200).json({
                success: true,
                message: 'Thank you for your message. We will respond within 24 business hours.'
            });
            
        } catch (emailError) {
            console.error('Failed to send email:', emailError);
            
            // Still return success if email fails (don't expose email failures to users)
            res.status(200).json({
                success: true,
                message: 'Thank you for your message. We have received your inquiry.'
            });
        }
        
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ 
            error: 'Failed to process your request. Please try again later.' 
        });
    }
}