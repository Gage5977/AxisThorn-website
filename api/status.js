// Public Status API - Returns honest status of features
export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    // Return honest status
    const status = {
        timestamp: new Date().toISOString(),
        overall: 'partial',
        message: 'Website is operational with limited functionality',
        features: {
            // Working features
            frontend: {
                status: 'operational',
                description: 'Static pages and content delivery',
                availability: 100
            },
            contact_form: {
                status: 'visual_only',
                description: 'Form displays but does not submit',
                availability: 50,
                workaround: 'Email AI.info@axisthorn.com directly'
            },
            // Non-working features
            authentication: {
                status: 'not_available',
                description: 'Login system requires database setup',
                availability: 0,
                eta: 'Q1 2025'
            },
            payment_processing: {
                status: 'not_available',
                description: 'Stripe integration pending',
                availability: 0,
                workaround: 'Contact for payment instructions'
            },
            client_portal: {
                status: 'not_available',
                description: 'Dashboard requires authentication',
                availability: 0,
                eta: 'Q1 2025'
            },
            document_management: {
                status: 'not_available',
                description: 'File storage not configured',
                availability: 0,
                workaround: 'Email documents to AI.info@axisthorn.com'
            },
            api_endpoints: {
                status: 'maintenance',
                description: 'Backend services not deployed',
                availability: 0,
                details: 'Requires database and external services'
            }
        },
        deployment: {
            frontend: 'production',
            backend: 'not_deployed',
            database: 'not_configured',
            external_services: 'not_connected'
        },
        contact: {
            email: 'AI.info@axisthorn.com',
            message: 'For all inquiries, please email us directly'
        }
    };

    res.status(200).json(status);
}