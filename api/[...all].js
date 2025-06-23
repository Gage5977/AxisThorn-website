// Catch-all API Handler - Prevents 500 errors in production
export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://axisthorn.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Log the attempted API call (for debugging)
    console.log(`API call attempted: ${req.url}`);

    // Return maintenance message
    res.status(503).json({
        error: 'Service Temporarily Unavailable',
        message: 'Our API is currently undergoing maintenance. Please try again later.',
        contact: 'For urgent matters, please contact AI.info@axisthorn.com',
        timestamp: new Date().toISOString()
    });
}