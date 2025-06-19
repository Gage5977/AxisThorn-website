import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Success() {
  const router = useRouter();
  
  useEffect(() => {
    // Set cookie to mark user as subscribed
    document.cookie = 'subscribed_user=active;path=/;max-age=2592000'; // 30 days
    
    // Redirect to app after 3 seconds
    const timer = setTimeout(() => {
      router.push('/app');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#0A0F1C',
      color: '#E6F8FF',
      fontFamily: 'Inter, sans-serif',
      textAlign: 'center'
    }}>
      <div style={{
        padding: '2rem',
        backgroundColor: 'rgba(63, 114, 175, 0.1)',
        borderRadius: '12px',
        border: '2px solid #06B6D4',
        maxWidth: '500px'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#06B6D4' }}>
          🎉 Success!
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
          Thank you for subscribing to AXIS Terminal!
        </p>
        <p style={{ color: '#A0AEC0' }}>
          Redirecting you to the app in a moment...
        </p>
        <div style={{
          marginTop: '2rem',
          width: '100%',
          height: '4px',
          backgroundColor: 'rgba(6, 182, 212, 0.2)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: '100%',
            backgroundColor: '#06B6D4',
            animation: 'progress 3s linear'
          }} />
        </div>
      </div>
      <style jsx>{`
        @keyframes progress {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}