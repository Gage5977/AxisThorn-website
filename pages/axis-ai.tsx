import { useRouter } from 'next/router';

export default function AxisAI() {
  const router = useRouter();

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <h1 style={{ fontSize: '1.5rem', color: '#06B6D4', margin: 0 }}>AXIS AI</h1>
            <nav style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="/" style={{ color: '#A0AEC0', textDecoration: 'none' }}>Home</a>
              <a href="/terminal" style={{ color: '#A0AEC0', textDecoration: 'none' }}>Terminal</a>
              <a href="/billing" style={{ color: '#A0AEC0', textDecoration: 'none' }}>Billing</a>
            </nav>
          </div>
          <button
            onClick={() => {
              document.cookie = 'subscribed_user=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
              router.push('/');
            }}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '1px solid #EF4444',
              borderRadius: '6px',
              color: '#EF4444',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Hero Section */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1.5rem' }}>
              AXIS AI
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#A0AEC0', maxWidth: '600px', margin: '0 auto' }}>
              Autonomous intelligence that processes financial data at the speed of light.
              Deploy AI agents that think, analyze, and execute beyond human capabilities.
            </p>
          </div>

          {/* Capabilities Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            <div style={{
              backgroundColor: 'rgba(13, 20, 32, 0.9)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#06B6D4', marginBottom: '1rem' }}>Cognitive Analysis</h3>
              <p style={{ color: '#A0AEC0', marginBottom: '1rem' }}>
                Process unstructured data from earnings calls to market sentiment with contextual understanding.
              </p>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#06B6D4' }}>347TB/day</div>
            </div>
            <div style={{
              backgroundColor: 'rgba(13, 20, 32, 0.9)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#06B6D4', marginBottom: '1rem' }}>Predictive Intelligence</h3>
              <p style={{ color: '#A0AEC0', marginBottom: '1rem' }}>
                Machine learning models trained on decades of market data to forecast trends.
              </p>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#06B6D4' }}>94.7%</div>
            </div>
            <div style={{
              backgroundColor: 'rgba(13, 20, 32, 0.9)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#06B6D4', marginBottom: '1rem' }}>Autonomous Execution</h3>
              <p style={{ color: '#A0AEC0', marginBottom: '1rem' }}>
                Self-optimizing algorithms that adapt to market conditions in real-time.
              </p>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#06B6D4' }}>&lt;10ms</div>
            </div>
          </div>

          {/* Live Analysis Demo */}
          <div style={{
            backgroundColor: 'rgba(13, 20, 32, 0.9)',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            borderRadius: '12px',
            padding: '3rem',
            marginBottom: '4rem'
          }}>
            <h3 style={{ color: '#06B6D4', marginBottom: '2rem', textAlign: 'center' }}>Live Analysis</h3>
            <div style={{
              backgroundColor: 'rgba(10, 15, 28, 0.5)',
              borderRadius: '8px',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{ fontSize: '0.875rem', color: '#06B6D4', marginBottom: '1rem' }}>QUERY</div>
              <div style={{ fontSize: '1.25rem', color: '#E6F8FF' }}>
                "Analyze tech sector volatility and recommend hedging strategies for $50M portfolio"
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{
                padding: '1rem',
                backgroundColor: 'rgba(10, 15, 28, 0.5)',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3F72AF', marginBottom: '0.5rem' }}>27.3%</div>
                <div style={{ fontSize: '0.875rem', color: '#A0AEC0' }}>Volatility Index</div>
              </div>
              <div style={{
                padding: '1rem',
                backgroundColor: 'rgba(10, 15, 28, 0.5)',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3F72AF', marginBottom: '0.5rem' }}>15%</div>
                <div style={{ fontSize: '0.875rem', color: '#A0AEC0' }}>Put Options</div>
              </div>
              <div style={{
                padding: '1rem',
                backgroundColor: 'rgba(10, 15, 28, 0.5)',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3F72AF', marginBottom: '0.5rem' }}>-12%</div>
                <div style={{ fontSize: '0.875rem', color: '#A0AEC0' }}>Max Drawdown</div>
              </div>
              <div style={{
                padding: '1rem',
                backgroundColor: 'rgba(10, 15, 28, 0.5)',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3F72AF', marginBottom: '0.5rem' }}>0.8%</div>
                <div style={{ fontSize: '0.875rem', color: '#A0AEC0' }}>Annual Cost</div>
              </div>
            </div>
          </div>

          {/* Applications */}
          <div>
            <h3 style={{ color: '#06B6D4', marginBottom: '2rem', textAlign: 'center' }}>Applications</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              <div style={{
                backgroundColor: 'rgba(13, 20, 32, 0.9)',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                borderRadius: '12px',
                padding: '2rem'
              }}>
                <h4 style={{ color: '#E6F8FF', marginBottom: '1rem' }}>Hedge Funds</h4>
                <p style={{ color: '#A0AEC0', marginBottom: '1.5rem' }}>
                  Alpha generation through AI-driven strategies and real-time risk management.
                </p>
                <a href="/terminal" style={{ color: '#06B6D4', textDecoration: 'none' }}>
                  Deploy AI →
                </a>
              </div>
              <div style={{
                backgroundColor: 'rgba(13, 20, 32, 0.9)',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                borderRadius: '12px',
                padding: '2rem'
              }}>
                <h4 style={{ color: '#E6F8FF', marginBottom: '1rem' }}>Family Offices</h4>
                <p style={{ color: '#A0AEC0', marginBottom: '1.5rem' }}>
                  Multi-generational wealth preservation with intelligent tax optimization.
                </p>
                <a href="/terminal" style={{ color: '#06B6D4', textDecoration: 'none' }}>
                  Learn More →
                </a>
              </div>
              <div style={{
                backgroundColor: 'rgba(13, 20, 32, 0.9)',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                borderRadius: '12px',
                padding: '2rem'
              }}>
                <h4 style={{ color: '#E6F8FF', marginBottom: '1rem' }}>Institutions</h4>
                <p style={{ color: '#A0AEC0', marginBottom: '1.5rem' }}>
                  Large-scale portfolio optimization with automated compliance monitoring.
                </p>
                <a href="/terminal" style={{ color: '#06B6D4', textDecoration: 'none' }}>
                  Get Started →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}