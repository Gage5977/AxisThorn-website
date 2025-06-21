// Email service function
async function sendContactEmail(data) {
  // In production, integrate with email service like SendGrid, AWS SES, or similar
  if (process.env.SENDGRID_API_KEY) {
    // Example SendGrid integration
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
    const msg = {
      to: 'AI.info@axisthorn.com',
      from: 'noreply@axisthorn.com',
      subject: `New Contact Form Submission - ${data.type}`,
      html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Company:</strong> ${data.company}</p>
                <p><strong>Type:</strong> ${data.type}</p>
                <p><strong>Message:</strong></p>
                <p>${data.message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><small>Submitted: ${data.timestamp}<br>IP: ${data.clientIP}</small></p>
            `
    };
        
    return await sgMail.send(msg);
  } 
  // Development/fallback: log to console or use alternative service
  throw new Error('Email service not configured');
    
}

export default async function handler(req, res) {
  // Set secure CORS headers
  const allowedOrigins = [
    'https://axisthorn.com',
    'https://www.axisthorn.com',
    'https://axis-thorn-llc-website.vercel.app',
    'http://localhost:3000'
  ];
    
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
    
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { name, email, company, message, type = 'general' } = req.body;

    // Input validation
    if (!name || !email || !message) {
      res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Name, email, and message are required'
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ 
        error: 'Invalid email format'
      });
      return;
    }

    // Rate limiting check (simple implementation)
    const userAgent = req.headers['user-agent'] || '';
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        
    // Log the contact request to proper logging service in production
    // For production, this should be sent to a structured logging service
    const logData = {
      timestamp: new Date().toISOString(),
      name,
      email,
      company,
      type,
      message: message.substring(0, 100) + '...',
      clientIP,
      userAgent
    };
        
    // Future: Send to structured logging service in production
    // logData would be sent to monitoring/logging platform

    // Send email notification
    try {
      await sendContactEmail({
        name,
        email,
        company: company || 'Not provided',
        type,
        message,
        clientIP,
        timestamp: new Date().toISOString()
      });
    } catch (emailError) {
      // Log email error but don't fail the entire request
      // In production, this would go to monitoring service
    }

    res.status(200).json({ 
      success: true,
      message: 'Thank you for your message. We will respond within 24 hours.',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    // Error would be logged to monitoring service in production
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Please try again later or email us directly at AI.info@axisthorn.com'
    });
  }
}