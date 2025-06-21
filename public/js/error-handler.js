// Global Error Handler for Axis Thorn Website
class ErrorHandler {
  constructor() {
    this.init();
    this.setupGlobalHandlers();
  }

  init() {
    // Error types
    this.errorTypes = {
      NETWORK: 'network',
      VALIDATION: 'validation',
      API: 'api',
      PAYMENT: 'payment',
      AUTH: 'auth',
      UNKNOWN: 'unknown'
    };

    // Error tracking
    this.errorQueue = [];
    this.maxRetries = 3;
    this.retryDelay = 1000;
  }

  setupGlobalHandlers() {
    // Catch unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError({
        type: this.errorTypes.UNKNOWN,
        message: event.message,
        source: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack
      });
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: this.errorTypes.UNKNOWN,
        message: 'Unhandled promise rejection',
        details: event.reason,
        stack: event.reason?.stack
      });
    });

    // Network error detection
    window.addEventListener('offline', () => {
      this.showNotification('You are currently offline. Some features may not work.', 'warning');
    });

    window.addEventListener('online', () => {
      this.showNotification('Connection restored.', 'success');
      this.retryFailedRequests();
    });
  }

  handleError(error) {
    // Log error for debugging (only in development)
    if (!this.isProduction()) {
      console.error('Error caught by handler:', error);
    }

    // Track error
    this.trackError(error);

    // Show user-friendly message based on error type
    this.showUserError(error);

    // Attempt recovery if possible
    this.attemptRecovery(error);
  }

  showUserError(error) {
    let message = 'An unexpected error occurred.';
    let type = 'error';

    switch (error.type) {
    case this.errorTypes.NETWORK:
      message = 'Network connection issue. Please check your internet connection.';
      type = 'warning';
      break;
    case this.errorTypes.VALIDATION:
      message = error.message || 'Please check your input and try again.';
      type = 'warning';
      break;
    case this.errorTypes.API:
      message = 'Service temporarily unavailable. Please try again in a moment.';
      break;
    case this.errorTypes.PAYMENT:
      message = 'Payment processing error. Please try again or contact support.';
      break;
    case this.errorTypes.AUTH:
      message = 'Authentication required. Please sign in to continue.';
      break;
    default:
      message = 'Something went wrong. Please refresh the page and try again.';
    }

    this.showNotification(message, type);
  }

  showNotification(message, type = 'error') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.error-notification');
    existing.forEach(el => el.remove());

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'error-notification';
        
    const colors = {
      error: 'var(--axis-accent-tertiary)',
      warning: '#FF9500',
      success: 'var(--axis-accent-secondary)',
      info: 'var(--axis-accent-primary)'
    };

    notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: var(--space-6);
            background: ${colors[type] || colors.error};
            color: var(--axis-pure-white);
            padding: var(--space-4) var(--space-6);
            border-radius: 8px;
            z-index: 10000;
            font-size: var(--text-sm);
            max-width: 350px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            animation: slideInFromRight 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: var(--space-3);
        `;

    // Add icon based on type
    const icon = this.getIcon(type);
    notification.innerHTML = `
            <div style="flex-shrink: 0;">${icon}</div>
            <div style="flex-grow: 1;">${message}</div>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; padding: 0; margin-left: var(--space-2);">×</button>
        `;

    // Add CSS animation if not already added
    if (!document.querySelector('#error-animations')) {
      const style = document.createElement('style');
      style.id = 'error-animations';
      style.textContent = `
                @keyframes slideInFromRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Auto remove after 7 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 7000);
  }

  getIcon(type) {
    const icons = {
      error: '⚠️',
      warning: '⚠️',
      success: '✅',
      info: 'ℹ️'
    };
    return icons[type] || icons.error;
  }

  trackError(error) {
    // Add to local queue
    this.errorQueue.push({
      ...error,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    });

    // Send to analytics/error tracking service (if available)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: error.message,
        fatal: false
      });
    }

    // In production, you would send to error tracking service
    if (this.isProduction()) {
      this.sendErrorReport(error);
    }
  }

  async sendErrorReport(error) {
    try {
      // Example: Send to error tracking service
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      });
    } catch (e) {
      // Silently fail - don't want error reporting to cause more errors
    }
  }

  attemptRecovery(error) {
    switch (error.type) {
    case this.errorTypes.NETWORK:
      // Queue request for retry when online
      this.queueForRetry(error);
      break;
    case this.errorTypes.AUTH:
      // Redirect to login or refresh auth
      this.handleAuthError();
      break;
    case this.errorTypes.PAYMENT:
      // Reset payment form state
      this.resetPaymentForms();
      break;
    }
  }

  queueForRetry(error) {
    if (error.retryFunction && error.retryCount < this.maxRetries) {
      setTimeout(() => {
        error.retryFunction();
      }, this.retryDelay * Math.pow(2, error.retryCount));
    }
  }

  retryFailedRequests() {
    this.errorQueue.forEach(error => {
      if (error.type === this.errorTypes.NETWORK && error.retryFunction) {
        this.queueForRetry(error);
      }
    });
  }

  handleAuthError() {
    // Clear any stored auth tokens
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
        
    // Redirect to appropriate page or show login modal
    if (window.location.pathname.includes('/invoices') || 
            window.location.pathname.includes('/banking-portal')) {
      // Show auth required message
      this.showNotification('Please sign in to access this area.', 'warning');
    }
  }

  resetPaymentForms() {
    // Reset Stripe elements and payment forms
    const paymentForms = document.querySelectorAll('.payment-form');
    paymentForms.forEach(form => {
      form.reset();
    });

    // Clear any payment-related state
    if (window.stripe && window.paymentElement) {
      window.paymentElement.clear();
    }
  }

  isProduction() {
    return window.location.hostname === 'axisthorn.com' || 
               window.location.hostname === 'www.axisthorn.com';
  }

  // Public API methods
  reportError(message, type = 'unknown', details = {}) {
    this.handleError({
      type,
      message,
      details,
      source: 'manual'
    });
  }

  showMessage(message, type = 'info') {
    this.showNotification(message, type);
  }

  clearErrors() {
    const notifications = document.querySelectorAll('.error-notification');
    notifications.forEach(el => el.remove());
  }
}

// Initialize global error handler
const globalErrorHandler = new ErrorHandler();

// Export for use in other scripts
window.ErrorHandler = ErrorHandler;
window.errorHandler = globalErrorHandler;

// Enhanced fetch wrapper with error handling
const originalFetch = window.fetch;
window.fetch = async function(...args) {
  try {
    const response = await originalFetch.apply(this, args);
        
    if (!response.ok) {
      const error = {
        type: globalErrorHandler.errorTypes.API,
        message: `HTTP ${response.status}: ${response.statusText}`,
        details: {
          status: response.status,
          url: args[0]
        }
      };
            
      globalErrorHandler.handleError(error);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
        
    return response;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      globalErrorHandler.handleError({
        type: globalErrorHandler.errorTypes.NETWORK,
        message: 'Network request failed',
        details: { url: args[0] },
        retryFunction: () => originalFetch.apply(this, args)
      });
    }
    throw error;
  }
};