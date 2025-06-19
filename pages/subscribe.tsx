import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Subscribe() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubscribe = async () => {
    setLoading(true);
    
    // Demo mode - simulate checkout without Stripe
    setTimeout(() => {
      // For demo, just redirect to success page
      router.push('/success');
    }, 1500);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#0A0F1C',
      color: '#E6F8FF',
      fontFamily: 'Inter, sans-serif'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Subscribe to AXIS Terminal</h1>
      <p style={{ marginBottom: '2rem', color: '#A0AEC0' }}>Get unlimited access to our advanced financial intelligence platform</p>
      
      <div style={{
        backgroundColor: 'rgba(13, 20, 32, 0.9)',
        border: '1px solid rgba(6, 182, 212, 0.2)',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#06B6D4' }}>Professional Plan</h2>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          $99<span style={{ fontSize: '1rem', color: '#A0AEC0' }}>/month</span>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
          <li style={{ marginBottom: '0.5rem', color: '#A0AEC0' }}>✓ Unlimited AI queries</li>
          <li style={{ marginBottom: '0.5rem', color: '#A0AEC0' }}>✓ Advanced financial analysis</li>
          <li style={{ marginBottom: '0.5rem', color: '#A0AEC0' }}>✓ Real-time market data</li>
          <li style={{ marginBottom: '0.5rem', color: '#A0AEC0' }}>✓ Portfolio optimization</li>
          <li style={{ marginBottom: '0.5rem', color: '#A0AEC0' }}>✓ Priority support</li>
        </ul>
      </div>
      
      <button 
        onClick={handleSubscribe}
        disabled={loading}
        style={{
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          backgroundColor: '#3F72AF',
          color: '#E6F8FF',
          border: '2px solid #06B6D4',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'all 0.3s ease'
        }}
      >
        {loading ? 'Processing...' : 'Start Free Trial'}
      </button>
      
      <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#A0AEC0' }}>
        Demo Mode - No payment required
      </p>
    </div>
  );
}