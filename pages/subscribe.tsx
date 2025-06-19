import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Subscribe() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout-session', { method: 'POST' });
      const { url } = await res.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setLoading(false);
    }
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
        {loading ? 'Loading...' : 'Subscribe Now'}
      </button>
    </div>
  );
}