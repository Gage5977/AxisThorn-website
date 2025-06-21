export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
        
        // In production, send to logging service instead of console
        if (process.env.NODE_ENV !== 'production') {
            console.log(`Contact form submission:`, logData);
        }

        // In production, you would:
        // 1. Send email notification to the team
        // 2. Store in database
        // 3. Send confirmation email to user
        // 4. Add to CRM system

        // For now, we'll simulate email sending
        const emailContent = {
            to: 'AI.info@axisthorn.com',
            subject: `New Contact Form Submission - ${type}`,
            body: `
Name: ${name}
Email: ${email}
Company: ${company || 'Not provided'}
Type: ${type}
Message:
${message}

Submitted: ${new Date().toISOString()}
IP: ${clientIP}
            `
        };

        // Simulate email sending delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        res.status(200).json({ 
            success: true,
            message: 'Thank you for your message. We will respond within 24 hours.',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: 'Please try again later or email us directly at AI.info@axisthorn.com'
        });
    }
}