class PaymentAuthManager {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.clientId = null;
  }

  // Check if we have a valid token
  hasValidToken() {
    if (!this.accessToken || !this.tokenExpiry) {
      return false;
    }
    
    // Check if token is expired (with 5 minute buffer)
    const now = Date.now();
    const expiryWithBuffer = this.tokenExpiry - (5 * 60 * 1000);
    return now < expiryWithBuffer;
  }

  // Get stored credentials from sessionStorage
  getStoredCredentials() {
    try {
      const stored = sessionStorage.getItem('payment_auth');
      if (stored) {
        const data = JSON.parse(stored);
        this.accessToken = data.access_token;
        this.tokenExpiry = data.expiry;
        this.clientId = data.client_id;
        return this.hasValidToken();
      }
    } catch (error) {
      console.error('Error retrieving stored credentials:', error);
    }
    return false;
  }

  // Store credentials in sessionStorage
  storeCredentials(tokenData) {
    try {
      const expiryTime = Date.now() + (tokenData.expires_in * 1000);
      const dataToStore = {
        access_token: tokenData.access_token,
        expiry: expiryTime,
        client_id: tokenData.client_id
      };
      
      sessionStorage.setItem('payment_auth', JSON.stringify(dataToStore));
      this.accessToken = tokenData.access_token;
      this.tokenExpiry = expiryTime;
      this.clientId = tokenData.client_id;
      
      return true;
    } catch (error) {
      console.error('Error storing credentials:', error);
      return false;
    }
  }

  // Clear stored credentials
  clearCredentials() {
    sessionStorage.removeItem('payment_auth');
    this.accessToken = null;
    this.tokenExpiry = null;
    this.clientId = null;
  }

  // Authenticate with the payment system
  async authenticate(clientId, clientSecret, invoiceNumber = null, customerEmail = null) {
    try {
      const response = await fetch('/api/auth/payment-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId,
          clientSecret,
          invoiceNumber,
          customerEmail
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Authentication failed');
      }

      const tokenData = await response.json();
      this.storeCredentials(tokenData);
      
      return {
        success: true,
        token: tokenData.access_token
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get authorization header for API calls
  getAuthHeader() {
    if (!this.hasValidToken()) {
      return null;
    }
    return {
      'Authorization': `Bearer ${this.accessToken}`
    };
  }

  // Make authenticated API request
  async makeAuthenticatedRequest(url, options = {}) {
    if (!this.hasValidToken()) {
      throw new Error('No valid authentication token');
    }

    const authHeaders = this.getAuthHeader();
    const requestOptions = {
      ...options,
      headers: {
        ...options.headers,
        ...authHeaders
      }
    };

    const response = await fetch(url, requestOptions);
    
    // If unauthorized, clear credentials
    if (response.status === 401) {
      this.clearCredentials();
      throw new Error('Authentication expired. Please log in again.');
    }

    return response;
  }
}

// Create auth UI component
class PaymentAuthUI {
  constructor(authManager) {
    this.authManager = authManager;
    this.isAuthenticated = false;
  }

  createLoginModal() {
    const modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.className = 'auth-modal';
    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>Payment Authentication</h2>
        </div>
        
        <div class="modal-body">
          <form id="auth-form">
            <div class="auth-notice">
              <p>To process payments, please authenticate with your client credentials.</p>
            </div>
            
            <div class="form-group">
              <label for="client-id">Client ID</label>
              <input type="text" id="client-id" name="clientId" required 
                     placeholder="Enter your client ID">
            </div>
            
            <div class="form-group">
              <label for="client-secret">Client Secret</label>
              <input type="password" id="client-secret" name="clientSecret" required 
                     placeholder="Enter your client secret">
            </div>
            
            <div class="form-group">
              <label for="auth-invoice">Invoice Number (Optional)</label>
              <input type="text" id="auth-invoice" name="invoiceNumber" 
                     placeholder="INV-2025-001">
            </div>
            
            <div class="form-actions">
              <button type="submit" class="auth-button primary">
                <span id="auth-button-text">Authenticate</span>
                <span id="auth-spinner" style="display: none;">Authenticating...</span>
              </button>
            </div>
            
            <div id="auth-error" class="form-error" style="display: none;"></div>
          </form>
          
          <div class="auth-help">
            <p>Don't have credentials? <a href="mailto:AI.info@axisthorn.com">Contact Support</a></p>
          </div>
        </div>
      </div>
    `;
    
    return modal;
  }

  async showAuthModal() {
    // Check if already authenticated
    if (this.authManager.getStoredCredentials()) {
      this.isAuthenticated = true;
      return true;
    }

    // Create and show modal
    const modal = this.createLoginModal();
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    return new Promise((resolve) => {
      const form = modal.querySelector('#auth-form');
      const errorDiv = modal.querySelector('#auth-error');
      const buttonText = modal.querySelector('#auth-button-text');
      const spinner = modal.querySelector('#auth-spinner');
      const submitBtn = form.querySelector('button[type="submit"]');

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
        
        // Show loading state
        submitBtn.disabled = true;
        buttonText.style.display = 'none';
        spinner.style.display = 'inline';

        const formData = new FormData(form);
        const clientId = formData.get('clientId');
        const clientSecret = formData.get('clientSecret');
        const invoiceNumber = formData.get('invoiceNumber');

        try {
          const result = await this.authManager.authenticate(
            clientId,
            clientSecret,
            invoiceNumber
          );

          if (result.success) {
            this.isAuthenticated = true;
            modal.remove();
            document.body.style.overflow = '';
            resolve(true);
          } else {
            throw new Error(result.error);
          }
        } catch (error) {
          errorDiv.textContent = error.message;
          errorDiv.style.display = 'block';
          
          // Reset button state
          submitBtn.disabled = false;
          buttonText.style.display = 'inline';
          spinner.style.display = 'none';
        }
      });

      // Close modal on backdrop click
      modal.querySelector('.modal-backdrop').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
        resolve(false);
      });
    });
  }

  addAuthStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
      .auth-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 10001;
      }
      
      .auth-notice {
        background: #1A1F2E;
        border: 1px solid #2A3142;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1.5rem;
      }
      
      .auth-notice p {
        color: #B0B8DB;
        margin: 0;
        font-size: 0.875rem;
      }
      
      .auth-button {
        width: 100%;
        padding: 0.75rem 2rem;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        font-size: 1rem;
      }
      
      .auth-button.primary {
        background: #00F0FF;
        color: #0A0E1B;
      }
      
      .auth-button.primary:hover:not(:disabled) {
        background: #00D4E6;
      }
      
      .auth-button.primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .auth-help {
        margin-top: 2rem;
        text-align: center;
        padding-top: 1.5rem;
        border-top: 1px solid #1A1F2E;
      }
      
      .auth-help p {
        color: #6B7494;
        font-size: 0.875rem;
        margin: 0;
      }
      
      .auth-help a {
        color: #00F0FF;
        text-decoration: none;
      }
      
      .auth-help a:hover {
        text-decoration: underline;
      }
    `;
    document.head.appendChild(styles);
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PaymentAuthManager, PaymentAuthUI };
}