import React from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title>Axis Thorn LLC - AI-Powered Financial Consulting | Architecting the Unseen</title>
        <meta name="description" content="Transform your financial architecture with AI-powered consulting services. We provide strategic consultation, implementation, and ongoing support for enterprise financial systems automation." />
        <meta name="keywords" content="AI financial consulting, financial systems automation, machine learning finance, enterprise AI solutions, predictive compliance, portfolio optimization, contract automation" />
        <meta name="author" content="Axis Thorn LLC" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://axisthorn.com/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://axisthorn.com/" />
        <meta property="og:title" content="Axis Thorn LLC - AI-Powered Financial Consulting" />
        <meta property="og:description" content="Transform your financial architecture through strategic AI implementation. Automated financial analysis, predictive compliance, and intelligent portfolio optimization for enterprise clients." />
        <meta property="og:image" content="https://axisthorn.com/logo.svg" />
        <meta property="og:image:alt" content="Axis Thorn LLC logo" />
        <meta property="og:site_name" content="Axis Thorn LLC" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://axisthorn.com/" />
        <meta property="twitter:title" content="Axis Thorn LLC - AI-Powered Financial Consulting" />
        <meta property="twitter:description" content="Transform your financial architecture through strategic AI implementation. Automated financial analysis, predictive compliance, and intelligent portfolio optimization." />
        <meta property="twitter:image" content="https://axisthorn.com/logo.svg" />
        <meta property="twitter:image:alt" content="Axis Thorn LLC logo" />
        <meta property="twitter:site" content="@axisthorn" />
        <meta property="twitter:creator" content="@axisthorn" />
        
        {/* Resource hints for performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* CSS files */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="/styles.css" rel="stylesheet" />
        <link href="/single-page.css" rel="stylesheet" />
        
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="mask-icon" href="/favicon.svg" color="#06b6d4" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0A0F1C" />
      </Head>
      
      <div>
        <iframe 
          src="/api/home" 
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
    </>
  );
}