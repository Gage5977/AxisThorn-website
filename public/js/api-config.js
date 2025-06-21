// API Configuration
const API_CONFIG = {
  // API Version
  version: 'v1',
  
  // Base API URL
  baseUrl: '/api',
  
  // Get versioned API endpoint
  getEndpoint: function(endpoint) {
    return `${this.baseUrl}/${this.version}/${endpoint}`;
  },
  
  // Default headers for API requests
  defaultHeaders: {
    'Content-Type': 'application/json',
    'X-API-Version': 'v1'
  },
  
  // API endpoints
  endpoints: {
    invoices: 'invoices',
    customers: 'customers',
    products: 'products',
    stripePayment: 'stripe-payment',
    paymentMethods: 'payment-methods',
    aiChat: 'ai-chat',
    aiDemo: 'ai-demo',
    contact: 'contact'
  }
};

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = API_CONFIG.getEndpoint(endpoint);
  const headers = {
    ...API_CONFIG.defaultHeaders,
    ...options.headers
  };
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    // Check for deprecation warnings
    const deprecationWarning = response.headers.get('X-API-Deprecation-Warning');
    if (deprecationWarning) {
      console.warn('API Deprecation Warning:', deprecationWarning);
    }
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `API request failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Request Error (${endpoint}):`, error);
    throw error;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_CONFIG, apiRequest };
} else {
  window.API_CONFIG = API_CONFIG;
  window.apiRequest = apiRequest;
}