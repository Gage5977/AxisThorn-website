// Loading indicator component
class LoadingIndicator {
  constructor() {
    this.createStyles();
  }

  createStyles() {
    if (document.getElementById('loading-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'loading-styles';
    styles.textContent = `
      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(10, 15, 28, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .loading-overlay.show {
        opacity: 1;
      }
      
      .loading-spinner {
        width: 50px;
        height: 50px;
        border: 3px solid rgba(63, 114, 175, 0.3);
        border-top: 3px solid #3F72AF;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .loading-text {
        color: #E6F8FF;
        margin-top: 1rem;
        font-size: 0.875rem;
        text-align: center;
        opacity: 0.8;
      }
      
      .inline-loading {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .inline-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(63, 114, 175, 0.3);
        border-top: 2px solid #3F72AF;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      .button-loading {
        position: relative;
        pointer-events: none;
        opacity: 0.7;
      }
      
      .button-loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
    `;
    document.head.appendChild(styles);
  }

  // Show full-screen loading overlay
  showOverlay(text = 'Loading...') {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div>
        <div class="loading-spinner"></div>
        <div class="loading-text">${text}</div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    
    // Trigger animation
    requestAnimationFrame(() => {
      overlay.classList.add('show');
    });
    
    return overlay;
  }

  // Hide loading overlay
  hideOverlay(overlay) {
    if (!overlay) return;
    
    overlay.classList.remove('show');
    document.body.style.overflow = '';
    
    setTimeout(() => {
      overlay.remove();
    }, 300);
  }

  // Show inline loading spinner
  showInline(element, text = 'Loading...') {
    const originalContent = element.innerHTML;
    element.innerHTML = `
      <div class="inline-loading">
        <div class="inline-spinner"></div>
        <span>${text}</span>
      </div>
    `;
    
    return originalContent;
  }

  // Add loading state to button
  setButtonLoading(button, loading = true) {
    if (loading) {
      button.classList.add('button-loading');
      button.disabled = true;
      button.dataset.originalText = button.textContent;
      button.textContent = 'Processing...';
    } else {
      button.classList.remove('button-loading');
      button.disabled = false;
      if (button.dataset.originalText) {
        button.textContent = button.dataset.originalText;
        delete button.dataset.originalText;
      }
    }
  }

  // Utility function for async operations with loading
  async withLoading(asyncFunction, loadingText = 'Processing...') {
    const overlay = this.showOverlay(loadingText);
    try {
      const result = await asyncFunction();
      return result;
    } finally {
      this.hideOverlay(overlay);
    }
  }
}

// Create global instance
const loading = new LoadingIndicator();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LoadingIndicator;
}