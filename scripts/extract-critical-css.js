// Critical CSS Extractor
// This script identifies above-the-fold CSS for inlining

const criticalCSS = `
/* Critical CSS - Inline this in <head> for faster initial render */

/* Base reset and variables */
:root {
  --axis-pure-black: #000000;
  --axis-pure-white: #ffffff;
  --axis-accent-primary: #8B1538;
  --axis-accent-secondary: #A21621;
  --axis-accent-tertiary: #6B0F2A;
  --axis-neutral-950: #030303;
  --axis-neutral-900: #0a0a0a;
  --axis-neutral-800: #1a1a1a;
  --axis-neutral-700: #2a2a2a;
  --axis-neutral-600: #3a3a3a;
  --axis-neutral-500: #666666;
  --axis-neutral-400: #999999;
  --axis-neutral-300: #cccccc;
  --font-display: 'Playfair Display', serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-body);
  background: var(--axis-pure-black);
  color: var(--axis-pure-white);
  line-height: 1.6;
  overflow-x: hidden;
}

/* Navigation - Critical for layout */
.nav-2025 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1.5rem 2rem;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.nav-2025-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Hero - Above the fold */
.hero-2025 {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0 2rem;
}

.hero-title-2025 {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

/* Noise overlay effect */
.noise-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.03;
  z-index: 1;
  pointer-events: none;
  background: url('data:image/svg+xml,%3Csvg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noise)" /%3E%3C/svg%3E');
}

/* Prevent FOUC */
.no-js { visibility: hidden; }
`;

console.log('Critical CSS extracted. Add this to your HTML <head> section:');
console.log('\n<style>' + criticalCSS + '</style>\n');

// Save to file
const fs = require('fs');
const path = require('path');

fs.writeFileSync(
  path.join(__dirname, '../public/css/critical.css'),
  criticalCSS
);

console.log('Critical CSS saved to public/css/critical.css');