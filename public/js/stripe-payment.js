class StripePaymentHandler {
  constructor(publishableKey, authManager = null) {
    this.stripe = Stripe(publishableKey);
    this.elements = null;
    this.cardElement = null;
    this.paymentIntentClientSecret = null;
    this.authManager = authManager;
  }

  async initialize(containerSelector, options = {}) {
    const appearance = {
      theme: 'night',
      variables: {
        colorPrimary: '#00F0FF',
        colorBackground: '#0A0E1B',
        colorText: '#E0E6FF',
        colorDanger: '#df1c41',
        fontFamily: 'Inter, system-ui, sans-serif',
        borderRadius: '8px',
        spacingUnit: '4px'
      },
      rules: {
        '.Label': {
          color: '#B0B8DB',
          fontWeight: '500',
          fontSize: '14px',
          marginBottom: '8px'
        },
        '.Input': {
          backgroundColor: '#1A1F2E',
          borderColor: '#2A3142',
          color: '#E0E6FF'
        },
        '.Input:focus': {
          borderColor: '#00F0FF',
          boxShadow: '0 0 0 1px #00F0FF'
        }
      }
    };

    this.elements = this.stripe.elements({ 
      appearance,
      ...options 
    });

    const cardOptions = {
      style: {
        base: {
          fontSize: '16px',
          color: '#E0E6FF',
          '::placeholder': {
            color: '#6B7494'
          }
        },
        invalid: {
          color: '#df1c41',
          iconColor: '#df1c41'
        }
      }
    };

    this.cardElement = this.elements.create('card', cardOptions);
    
    const container = document.querySelector(containerSelector);
    if (!container) {
      throw new Error(`Container ${containerSelector} not found`);
    }

    this.cardElement.mount(container);

    this.cardElement.on('change', (event) => {
      const errorElement = document.getElementById('card-errors');
      if (errorElement) {
        if (event.error) {
          errorElement.textContent = event.error.message;
          errorElement.style.display = 'block';
        } else {
          errorElement.textContent = '';
          errorElement.style.display = 'none';
        }
      }
    });

    return this.cardElement;
  }

  async createPaymentIntent(amount, options = {}) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add authentication if available
      if (this.authManager && this.authManager.hasValidToken()) {
        const authHeaders = this.authManager.getAuthHeader();
        Object.assign(headers, authHeaders);
      }
      
      const response = await fetch('/api/v1/stripe-payment', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'create-payment-intent',
          amount,
          ...options
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment intent');
      }

      const data = await response.json();
      this.paymentIntentClientSecret = data.clientSecret;
      return data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  async confirmPayment(billingDetails = {}) {
    if (!this.paymentIntentClientSecret) {
      throw new Error('No payment intent created');
    }

    try {
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(
        this.paymentIntentClientSecret,
        {
          payment_method: {
            card: this.cardElement,
            billing_details: billingDetails
          }
        }
      );

      if (error) {
        throw error;
      }

      return paymentIntent;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  async getPaymentStatus(paymentIntentId) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add authentication if available
      if (this.authManager && this.authManager.hasValidToken()) {
        const authHeaders = this.authManager.getAuthHeader();
        Object.assign(headers, authHeaders);
      }
      
      const response = await fetch('/api/v1/stripe-payment', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'get-payment-status',
          paymentIntentId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get payment status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  }

  destroy() {
    if (this.cardElement) {
      this.cardElement.destroy();
    }
  }
}

// Helper function to format amount for display
function formatAmount(amount, currency = 'usd') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
}

// Helper function to validate email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StripePaymentHandler, formatAmount, validateEmail };
}