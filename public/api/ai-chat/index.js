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
        const { message, context } = req.body;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (message.length > 2000) {
            return res.status(400).json({ error: 'Message too long (max 2000 characters)' });
        }

        // Rate limiting check (simple implementation)
        const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        // In production, use Redis or similar for rate limiting
        
        // Simulate AI processing delay (replace with actual AI API call in production)
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        // Generate response based on message content
        const response = generateAIResponse(message, context);
        
        // Future: Log request to monitoring service
        // Request data would be sent to analytics platform

        return res.status(200).json({
            success: true,
            response: response,
            timestamp: new Date().toISOString(),
            model: 'axis-ai-financial-v1'
        });

    } catch (error) {
        console.error('Error in AI chat:', error);
        return res.status(500).json({ 
            error: 'Failed to process request',
            message: 'Our AI system encountered an error. Please try again.'
        });
    }
}

function generateAIResponse(message, context) {
    const lowerMessage = message.toLowerCase();
    
    // Financial analysis queries
    if (lowerMessage.includes('financial ratio') || lowerMessage.includes('analyze')) {
        return {
            text: "I'll help you analyze financial ratios. Key ratios to consider include:\n\n" +
                  "• **Liquidity Ratios**: Current ratio (2.0+ is healthy), Quick ratio (1.0+ preferred)\n" +
                  "• **Profitability Ratios**: ROE (15-20% is strong), Net profit margin (varies by industry)\n" +
                  "• **Leverage Ratios**: Debt-to-equity (below 2.0 is conservative)\n" +
                  "• **Efficiency Ratios**: Asset turnover, inventory turnover\n\n" +
                  "Would you like me to analyze specific ratios for a particular company or industry?",
            suggestions: [
                "Calculate liquidity ratios",
                "Compare industry benchmarks",
                "Analyze trend over time"
            ]
        };
    }
    
    // Market trends
    if (lowerMessage.includes('market trend') || lowerMessage.includes('renewable energy')) {
        return {
            text: "The renewable energy sector shows strong growth indicators:\n\n" +
                  "• **Market Size**: Expected to reach $2.15 trillion by 2025\n" +
                  "• **Growth Rate**: CAGR of 8.3% (2023-2030)\n" +
                  "• **Key Drivers**: Government incentives, ESG mandates, technology cost reductions\n" +
                  "• **Investment Opportunities**: Solar technology, wind farms, energy storage solutions\n\n" +
                  "The sector presents compelling opportunities for both growth and impact investing.",
            suggestions: [
                "View sector allocation strategies",
                "Analyze specific renewable stocks",
                "Review ESG investment criteria"
            ]
        };
    }
    
    // Portfolio optimization
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('optimize')) {
        return {
            text: "For risk-adjusted portfolio optimization, consider:\n\n" +
                  "• **Asset Allocation**: 60/40 stocks/bonds as baseline, adjust for risk tolerance\n" +
                  "• **Diversification**: Minimum 20-30 holdings across sectors\n" +
                  "• **Rebalancing**: Quarterly or when allocation drifts 5%+ from target\n" +
                  "• **Risk Metrics**: Sharpe ratio > 1.0, maximum drawdown < 20%\n\n" +
                  "I can help create a customized allocation based on your specific goals and constraints.",
            suggestions: [
                "Run portfolio analysis",
                "Calculate optimal weights",
                "Stress test scenarios"
            ]
        };
    }
    
    // Fed policy
    if (lowerMessage.includes('fed') || lowerMessage.includes('policy')) {
        return {
            text: "Recent Federal Reserve policy implications:\n\n" +
                  "• **Interest Rates**: Current target range and forward guidance\n" +
                  "• **Market Impact**: Bond yields, equity valuations, and sector rotations\n" +
                  "• **Economic Indicators**: Inflation expectations, employment data influence\n" +
                  "• **Investment Strategy**: Duration risk management, sector positioning\n\n" +
                  "Policy changes create both risks and opportunities across asset classes.",
            suggestions: [
                "Analyze rate sensitivity",
                "Review defensive strategies",
                "Explore inflation hedges"
            ]
        };
    }
    
    // Default response
    return {
        text: "I understand you're asking about: \"" + message + "\"\n\n" +
              "I can help with:\n" +
              "• Financial statement analysis and ratios\n" +
              "• Market trends and sector analysis\n" +
              "• Portfolio optimization strategies\n" +
              "• Risk management techniques\n" +
              "• Regulatory compliance guidance\n\n" +
              "Please provide more specific details about what you'd like to analyze.",
        suggestions: [
            "Financial analysis",
            "Market research",
            "Portfolio review",
            "Risk assessment"
        ]
    };
}