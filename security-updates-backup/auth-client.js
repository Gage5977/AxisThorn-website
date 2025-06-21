// JWT Authentication Client
class AuthClient {
  constructor() {
    this.token = null;
    this.user = null;
    this.apiBase = '/api/v1';
    this.init();
  }

  init() {
    // Check for existing token in localStorage
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    
    if (savedToken && savedUser) {
      this.token = savedToken;
      this.user = JSON.parse(savedUser);
      this.setupAuthHeaders();
      this.scheduleTokenRefresh();
    }
  }

  setupAuthHeaders() {
    // Setup default headers for all fetch requests
    const originalFetch = window.fetch;
    window.fetch = (url, options = {}) => {
      if (this.token && url.startsWith('/api/')) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${this.token}`
        };
      }
      return originalFetch(url, options);
    };
  }

  async login(email, password) {
    try {
      const response = await fetch(`${this.apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token and user data
      this.token = data.token;
      this.user = data.user;
      
      localStorage.setItem('auth_token', this.token);
      localStorage.setItem('auth_user', JSON.stringify(this.user));
      
      this.setupAuthHeaders();
      this.scheduleTokenRefresh();

      return { success: true, user: this.user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  async register(userData) {
    try {
      const response = await fetch(`${this.apiBase}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Auto-login after registration
      return this.login(userData.email, userData.password);
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  }

  async verifyToken() {
    if (!this.token) return false;

    try {
      const response = await fetch(`${this.apiBase}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        this.logout();
        return false;
      }

      const data = await response.json();
      return data.valid;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  }

  scheduleTokenRefresh() {
    // Refresh token every 50 minutes (tokens expire in 1 hour)
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }

    this.refreshTimer = setInterval(async () => {
      const isValid = await this.verifyToken();
      if (!isValid) {
        this.logout();
        window.location.href = '/portal-login.html';
      }
    }, 50 * 60 * 1000); // 50 minutes
  }

  logout() {
    this.token = null;
    this.user = null;
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }

    // Reset fetch to original
    location.reload();
  }

  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  getUser() {
    return this.user;
  }

  getToken() {
    return this.token;
  }

  // Helper method for protected API calls
  async apiCall(endpoint, options = {}) {
    if (!this.token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${this.apiBase}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        ...options.headers
      }
    });

    if (response.status === 401) {
      this.logout();
      window.location.href = '/portal-login.html';
      throw new Error('Session expired');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API call failed');
    }

    return data;
  }
}

// Export for use in other scripts
const authClient = new AuthClient();

// Protect routes that require authentication
function requireAuth() {
  if (!authClient.isAuthenticated()) {
    // Save current location
    sessionStorage.setItem('redirect_after_login', window.location.href);
    window.location.href = '/portal-login.html';
    return false;
  }
  return true;
}

// Auto-check authentication on protected pages
if (window.location.pathname.includes('portal') && 
    !window.location.pathname.includes('portal-login')) {
  document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth()) {
      document.body.style.display = 'none';
    }
  });
}