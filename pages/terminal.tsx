import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Terminal() {
  const router = useRouter();
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
      } else if (lowerQuery.includes('1099')) {
        response = '1099 Analysis Report:\n\n• Total 1099 Payments: $148,000\n• Forms Issued: 3\n• Tax Years: 2023, 2024\n\nBy Year:\n  - 2024: $110,000\n  - 2023: $38,000\n\nTop Recipients:\n  - Sarah Developer: $65,000\n  - John Consultant: $45,000\n  - Mike Designer: $38,000\n\nTax Optimization:\n• Quarterly estimated payments recommended: $11,100\n• Consider business expense deductions\n• Review contractor vs employee classification';
      } else if (lowerQuery.includes('tax strategy') || lowerQuery.includes('quarterly')) {
        response = 'Tax Strategy for 1099 Income:\n\nCurrent Year (2025) Analysis:\n• Projected 1099 Income: $110,000\n• Estimated Tax Liability: $33,000\n• Quarterly Payment Needed: $8,250\n\nDeduction Opportunities:\n• Home office deduction: ~$3,500\n• Vehicle expenses: ~$5,200\n• Professional development: ~$2,000\n• Business insurance: ~$1,800\n\nAction Items:\n1. Set aside 30% of 1099 income\n2. Make quarterly payments by deadlines\n3. Track all business expenses\n4. Consider SEP-IRA contribution (up to $27,500)';
      } else if (lowerQuery.includes('tax')) {
        response = 'Tax Optimization Analysis:\n\n• Current tax efficiency: 82%\n• Tax-loss harvesting opportunities: $45,000 in unrealized losses\n• Recommended strategies:\n  - Convert traditional IRA to Roth (partial conversion)\n  - Maximize qualified dividends allocation\n  - Consider municipal bonds for high-tax bracket\n• Estimated tax savings: $12,000 annually';
      } else if (lowerQuery.includes('crypto') || lowerQuery.includes('bitcoin')) {
        response = 'Cryptocurrency Analysis:\n\n• Bitcoin correlation to portfolio: 0.23 (low)\n• Recommended allocation: 2-5% for risk-tolerant investors\n• Top holdings by market cap:\n  - BTC: $850B (45% dominance)\n  - ETH: $280B (15% dominance)\n• Volatility warning: 90-day volatility at 68%\n• Consider stablecoin yields: 4-8% APY';
      } else if (lowerQuery.includes('validate') && lowerQuery.includes('1099')) {
        response = '✓ 1099 Validation Results:\n\n• Form ID: 1099-001\n• Recipient: John Consultant\n• TIN Format: Valid (XX-XXXXXXX)\n• Amount: $45,000 (exceeds $600 threshold)\n• Box 7 (Nonemployee Comp): $45,000\n• Status: Ready for e-filing\n\nValidation Passed: All IRS requirements met\n\nNext Steps:\n1. Generate Copy B for recipient\n2. Submit Copy A to IRS\n3. File electronic return by January 31';
      } else if (lowerQuery.includes('export') && lowerQuery.includes('1099')) {
        response = 'Export 1099 Forms:\n\n• Format Options:\n  - IRS e-file (FIRE system compatible)\n  - PDF copies (A, B, C, and 1096)\n  - CSV for bulk processing\n  - QuickBooks import format\n\n• Current Forms Ready:\n  - 1099-001: John Consultant ($45,000)\n  - 1099-002: Sarah Developer ($65,000)\n  - 1099-003: Mike Designer ($38,000)\n\n• Export command: export 1099 --format=efile --year=2024\n• Batch print: print 1099 --copies=all --year=2024';
      } else {
        response = `I've analyzed your query: "${query}".\n\nIn the full version, I would provide:\n• Detailed financial analysis\n• Real-time market data integration\n• Predictive modeling results\n• Actionable recommendations\n\nThis demo shows the interface capabilities. Try asking about:\n• Portfolios, markets, risk, taxes, crypto\n• 1099 forms and tax strategies\n• Quarterly tax estimates\n• Validation and compliance`;
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
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'rgba(13, 20, 32, 0.9)',
        borderBottom: '1px solid rgba(6, 182, 212, 0.2)',
        padding: '1rem 2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: '#06B6D4', margin: 0 }}>AXIS Terminal</h1>
            <p style={{ color: '#A0AEC0', margin: 0 }}>Advanced Financial Intelligence Platform</p>
          </div>
          <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a href="/" style={{ color: '#A0AEC0', textDecoration: 'none' }}>Home</a>
            <a href="/billing" style={{ color: '#A0AEC0', textDecoration: 'none' }}>Billing</a>
            <a href="/axis-ai" style={{ color: '#A0AEC0', textDecoration: 'none' }}>Axis AI</a>
            <button
              onClick={() => {
                document.cookie = 'subscribed_user=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
                router.push('/');
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'transparent',
                color: '#EF4444',
                border: '1px solid #EF4444',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <div style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Terminal Interface */}
          <div style={{
            backgroundColor: 'rgba(13, 20, 32, 0.9)',
            borderRadius: '12px',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            padding: '1.5rem',
            height: '70vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Messages Area */}
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
                  <div style={{ 
                    fontWeight: 'bold', 
                    marginBottom: '0.25rem', 
                    color: msg.role === 'user' ? '#3F72AF' : '#06B6D4' 
                  }}>
                    {msg.role === 'user' ? 'You' : 'AXIS AI'}
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                </div>
              ))}
            </div>

            {/* Input Form */}
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3F72AF';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Send
              </button>
            </form>
          </div>

          {/* Quick Actions and Info */}
          <div style={{
            marginTop: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{
              padding: '1.5rem',
              backgroundColor: 'rgba(13, 20, 32, 0.9)',
              borderRadius: '8px',
              border: '1px solid rgba(6, 182, 212, 0.2)'
            }}>
              <h3 style={{ color: '#06B6D4', marginBottom: '1rem' }}>Quick Prompts</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.5rem', cursor: 'pointer', color: '#A0AEC0' }}
                    onClick={() => setQuery('Analyze my portfolio diversification')}>
                  📊 Analyze my portfolio diversification
                </li>
                <li style={{ marginBottom: '0.5rem', cursor: 'pointer', color: '#A0AEC0' }}
                    onClick={() => setQuery('What are the current market trends?')}>
                  📈 What are the current market trends?
                </li>
                <li style={{ marginBottom: '0.5rem', cursor: 'pointer', color: '#A0AEC0' }}
                    onClick={() => setQuery('Calculate my portfolio risk metrics')}>
                  💰 Calculate my portfolio risk metrics
                </li>
                <li style={{ marginBottom: '0.5rem', cursor: 'pointer', color: '#A0AEC0' }}
                    onClick={() => setQuery('Tax optimization strategies for high earners')}>
                  📋 Tax optimization strategies
                </li>
                <li style={{ cursor: 'pointer', color: '#A0AEC0' }}
                    onClick={() => setQuery('Should I add crypto to my portfolio?')}>
                  🔍 Cryptocurrency analysis
                </li>
              </ul>
            </div>
            
            <div style={{
              padding: '1.5rem',
              backgroundColor: 'rgba(13, 20, 32, 0.9)',
              borderRadius: '8px',
              border: '1px solid rgba(6, 182, 212, 0.2)'
            }}>
              <h3 style={{ color: '#06B6D4', marginBottom: '1rem' }}>Features</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.5rem', color: '#A0AEC0' }}>✓ Real-time market analysis</li>
                <li style={{ marginBottom: '0.5rem', color: '#A0AEC0' }}>✓ Portfolio optimization</li>
                <li style={{ marginBottom: '0.5rem', color: '#A0AEC0' }}>✓ Risk assessment</li>
                <li style={{ marginBottom: '0.5rem', color: '#A0AEC0' }}>✓ Tax strategies</li>
                <li style={{ color: '#A0AEC0' }}>✓ 24/7 AI assistance</li>
              </ul>
            </div>

            <div style={{
              padding: '1.5rem',
              backgroundColor: 'rgba(13, 20, 32, 0.9)',
              borderRadius: '8px',
              border: '1px solid rgba(6, 182, 212, 0.2)'
            }}>
              <h3 style={{ color: '#06B6D4', marginBottom: '1rem' }}>Your Account</h3>
              <p style={{ color: '#A0AEC0', marginBottom: '0.5rem' }}>
                Status: <span style={{ color: '#10B981' }}>Active</span>
              </p>
              <p style={{ color: '#A0AEC0', marginBottom: '0.5rem' }}>
                Plan: Professional
              </p>
              <p style={{ color: '#A0AEC0' }}>
                API Calls: Unlimited
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}