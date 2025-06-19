import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Add click handler for AXIS Terminal link
    const handleMessage = (e: MessageEvent) => {
      if (e.data === 'navigate-to-app') {
        window.location.href = '/app';
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div>
      <iframe 
        src="/index.html" 
        style={{
          width: '100%',
          height: '100vh',
          border: 'none',
          margin: 0,
          padding: 0
        }}
        title="Axis Thorn LLC"
      />
    </div>
  );
}