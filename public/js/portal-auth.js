// Simple authentication for client portals
class PortalAuth {
  constructor() {
    this.isAuthenticated = false;
    this.checkAuth();
  }

  checkAuth() {
    // Check if user is already authenticated in session
    const authToken = sessionStorage.getItem('portal_auth');
    if (authToken && authToken === 'authenticated') {
      this.isAuthenticated = true;
      return true;
    }
    return false;
  }

  showAuthPrompt() {
    // Create simple password prompt
    const authContainer = document.createElement('div');
    authContainer.className = 'auth-container';
    authContainer.innerHTML = `
      <div class="auth-modal">
        <div class="auth-content">
          <h2>Portal Access</h2>
          <p>Please enter the access code to continue.</p>
          <form id="auth-form">
            <input type="password" id="auth-password" placeholder="Enter access code" required>
            <button type="submit">Access Portal</button>
            <div id="auth-error" class="error-message" style="display: none;">
              Invalid access code. Please try again.
            </div>
          </form>
          <p class="auth-help">Need access? Contact <a href="mailto:AI.info@axisthorn.com">AI.info@axisthorn.com</a></p>
        </div>
      </div>
    `;

    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
      .auth-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(10, 15, 28, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      }
      
      .auth-modal {
        background: #0A0F1C;
        border: 1px solid #3F72AF;
        border-radius: 12px;
        padding: 2rem;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 0 40px rgba(63, 114, 175, 0.3);
      }
      
      .auth-content h2 {
        color: #E6F8FF;
        margin-bottom: 1rem;
        font-size: 1.75rem;
        text-align: center;
      }
      
      .auth-content p {
        color: #A0AEC0;
        margin-bottom: 1.5rem;
        text-align: center;
      }
      
      #auth-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      
      #auth-password {
        padding: 0.75rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid #3F72AF;
        border-radius: 8px;
        color: #E6F8FF;
        font-size: 1rem;
      }
      
      #auth-password:focus {
        outline: none;
        border-color: #E6F8FF;
        box-shadow: 0 0 10px rgba(230, 248, 255, 0.2);
      }
      
      #auth-form button {
        padding: 0.75rem;
        background: #3F72AF;
        border: none;
        border-radius: 8px;
        color: #E6F8FF;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      #auth-form button:hover {
        background: #4F82BF;
        box-shadow: 0 0 20px rgba(63, 114, 175, 0.5);
      }
      
      .error-message {
        color: #EF4444;
        font-size: 0.875rem;
        text-align: center;
        margin-top: 0.5rem;
      }
      
      .auth-help {
        margin-top: 1.5rem;
        font-size: 0.875rem;
        text-align: center;
        color: #6B7494;
      }
      
      .auth-help a {
        color: #3F72AF;
        text-decoration: none;
      }
      
      .auth-help a:hover {
        text-decoration: underline;
      }
    `;
    
    document.head.appendChild(styles);
    document.body.appendChild(authContainer);
    
    // Handle form submission
    const form = document.getElementById('auth-form');
    const errorDiv = document.getElementById('auth-error');
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const password = document.getElementById('auth-password').value;
      
      // Simple password check (in production, this should call an API)
      // Using the demo secret from the audit
      if (password === 'demo2024' || password === process.env.DEMO_SECRET) {
        sessionStorage.setItem('portal_auth', 'authenticated');
        this.isAuthenticated = true;
        authContainer.remove();
        styles.remove();
        this.onAuthenticated();
      } else {
        errorDiv.style.display = 'block';
        document.getElementById('auth-password').value = '';
      }
    });
  }

  requireAuth() {
    if (!this.isAuthenticated) {
      this.showAuthPrompt();
      return false;
    }
    return true;
  }

  onAuthenticated() {
    // Callback for when authentication succeeds
    // Can be overridden by specific pages
    console.log('Authentication successful');
  }

  logout() {
    sessionStorage.removeItem('portal_auth');
    this.isAuthenticated = false;
    window.location.reload();
  }
}

// Initialize auth on page load
const portalAuth = new PortalAuth();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortalAuth;
}