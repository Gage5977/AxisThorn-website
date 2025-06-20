// Production configuration
window.APP_CONFIG = {
  // This will be replaced at build time or fetched from API
  STRIPE_PUBLISHABLE_KEY: window.STRIPE_PUBLISHABLE_KEY || 'pk_live_YOUR_KEY_HERE',
  API_BASE_URL: window.location.origin,
  IS_PRODUCTION: window.location.hostname === 'axisthorn.com' || window.location.hostname === 'www.axisthorn.com'
};