import { useState } from 'react';

export default function App() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([
    { role: 'assistant', content: 'Welcome to AXIS Terminal! I\'m your AI-powered financial analysis assistant. How can I help you today?' }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    
    // Simulate AI response based on query content
    setTimeout(() => {
      let response = '';
      const lowerQuery = query.toLowerCase();
      
      if (lowerQuery.includes('portfolio')) {
        response = 'Based on your portfolio analysis request, I recommend:\n\n• Diversification: Your current allocation shows 65% equities, 25% bonds, 10% alternatives\n• Risk Assessment: Moderate risk profile with Sharpe ratio of 1.2\n• Optimization: Consider increasing alternative investments to 15% for better risk-adjusted returns\n• Market timing: Current conditions favor defensive positions';
      } else if (lowerQuery.includes('market')) {
        response = 'Market Analysis Summary:\n\n• S&P 500: +2.3% MTD, volatility index at 18.5\n• Key sectors: Technology (+3.1%), Healthcare (+1.8%), Energy (-0.5%)\n• Trend indicators: Bullish momentum in growth stocks\n• Risk factors: Rising interest rate expectations, geopolitical tensions';
      } else if (lowerQuery.includes('risk')) {
        response = 'Risk Assessment Report:\n\n• Value at Risk (95%): $125,000 over 10-day period\n• Beta coefficient: 1.15 (slightly above market)\n• Maximum drawdown: -12.3% (within acceptable range)\n• Stress test results: Portfolio resilient to 20% market decline';
      } else {
        response = `I've analyzed your query: "${query}".\n\nIn the full version, I would provide:\n• Detailed financial analysis\n• Real-time market data integration\n• Predictive modeling results\n• Actionable recommendations\n\nThis demo shows the interface capabilities.`;
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response
      }]);
    }, 1500);
    
    setQuery('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0F1C',
      color: '#E6F8FF',
      fontFamily: 'Inter, sans-serif',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <header style={{
          marginBottom: '2rem',
          borderBottom: '1px solid rgba(6, 182, 212, 0.2)',
          paddingBottom: '1rem'
        }}>
          <h1 style={{ fontSize: '2rem', color: '#06B6D4' }}>AXIS Terminal</h1>
          <p style={{ color: '#A0AEC0' }}>Advanced Financial Intelligence Platform</p>
        </header>

        <div style={{
          backgroundColor: 'rgba(13, 20, 32, 0.9)',
          borderRadius: '12px',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          padding: '1.5rem',
          height: '60vh',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            flex: 1,
            overflowY: 'auto',
            marginBottom: '1rem',
            padding: '1rem',
            backgroundColor: 'rgba(10, 15, 28, 0.5)',
            borderRadius: '8px'
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                marginBottom: '1rem',
                padding: '0.75rem',
                backgroundColor: msg.role === 'user' ? 'rgba(63, 114, 175, 0.2)' : 'rgba(6, 182, 212, 0.1)',
                borderRadius: '8px',
                borderLeft: `3px solid ${msg.role === 'user' ? '#3F72AF' : '#06B6D4'}`
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: msg.role === 'user' ? '#3F72AF' : '#06B6D4' }}>
                  {msg.role === 'user' ? 'You' : 'AXIS AI'}
                </div>
                <div>{msg.content}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            gap: '0.5rem'
          }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about financial analysis, portfolio optimization, or market trends..."
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: 'rgba(10, 15, 28, 0.7)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '8px',
                color: '#E6F8FF',
                fontSize: '1rem'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3F72AF',
                color: '#E6F8FF',
                border: '2px solid #06B6D4',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              Send
            </button>
          </form>
        </div>

        <div style={{
          marginTop: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(13, 20, 32, 0.9)',
            borderRadius: '8px',
            border: '1px solid rgba(6, 182, 212, 0.2)'
          }}>
            <h3 style={{ color: '#06B6D4', marginBottom: '0.5rem' }}>Quick Actions</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>📊 Portfolio Analysis</li>
              <li style={{ marginBottom: '0.5rem' }}>📈 Market Trends</li>
              <li style={{ marginBottom: '0.5rem' }}>💰 Risk Assessment</li>
              <li>🔍 Financial Reports</li>
            </ul>
          </div>
          
          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(13, 20, 32, 0.9)',
            borderRadius: '8px',
            border: '1px solid rgba(6, 182, 212, 0.2)'
          }}>
            <h3 style={{ color: '#06B6D4', marginBottom: '0.5rem' }}>Your Subscription</h3>
            <p style={{ color: '#A0AEC0' }}>Status: <span style={{ color: '#10B981' }}>Active</span></p>
            <p style={{ color: '#A0AEC0' }}>Plan: Professional</p>
            <button
              onClick={() => document.cookie = 'subscribed_user=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT'}
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'transparent',
                color: '#EF4444',
                border: '1px solid #EF4444',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}