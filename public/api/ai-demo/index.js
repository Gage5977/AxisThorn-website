export default async function handler(req, res) {
  // Enable CORS with specific origin
  const allowedOrigins = [
    'https://axisthorn.com',
    'https://www.axisthorn.com',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
  ].filter(Boolean);
    
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
    
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, company, interest, message } = req.body;

    // Validate required fields
    if (!name || !email || !company || !interest) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'email', 'company', 'interest']
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Create demo request object
    const demoRequest = {
      id: `AIDEMO-${Date.now()}`,
      timestamp: new Date().toISOString(),
      contact: {
        name,
        email,
        company
      },
      interest,
      message: message || '',
      status: 'pending',
      source: 'axis-ai-website'
    };

    // In production, you would:
    // 1. Save to database
    // 2. Send notification email to sales team
    // 3. Send confirmation email to requestor
    // 4. Add to CRM system

    // For now, log the request
    // AI Demo request processed

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'AI demo request submitted successfully',
      requestId: demoRequest.id,
      nextSteps: [
        'You will receive a confirmation email shortly',
        'Our AI specialist will contact you within 24 hours',
        'We will schedule a personalized demo based on your requirements'
      ]
    });

  } catch (error) {
    console.error('Error processing AI demo request:', error);
    return res.status(500).json({ 
      error: 'Failed to process request',
      message: 'Please try again or contact us directly at AI.solutions@axisthorn.com'
    });
  }
}