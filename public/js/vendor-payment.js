// Vendor Payment Portal JavaScript
// Handles Stripe integration and payment processing

class VendorPaymentPortal {
    constructor(stripePublishableKey) {
        this.stripe = Stripe(stripePublishableKey);
        this.elements = this.stripe.elements();
        this.cardElement = null;
        this.authToken = null;
        this.init();
    }

    init() {
        // Initialize card element
        this.setupCardElement();
        
        // Check for authentication token
        this.checkAuth();
        
        // Setup event listeners
        this.setupEventListeners();
    }

    setupCardElement() {
        const style = {
            base: {
                color: '#ffffff',
                fontFamily: 'Inter, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#6b7280'
                }
            },
            invalid: {
                color: '#ff4444',
                iconColor: '#ff4444'
            }
        };

        this.cardElement = this.elements.create('card', { style });
        this.cardElement.mount('#card-element');

        // Handle real-time validation
        this.cardElement.on('change', (event) => {
            const displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
    }

    async checkAuth() {
        // Check if we have a stored auth token
        const storedAuth = sessionStorage.getItem('payment_auth');
        if (storedAuth) {
            try {
                const auth = JSON.parse(storedAuth);
                if (auth.expires > Date.now()) {
                    this.authToken = auth.token;
                    return;
                }
            } catch (e) {
                console.error('Invalid stored auth:', e);
            }
        }

        // Show auth modal if no valid token
        this.showAuthModal();
    }

    showAuthModal() {
        const modal = document.createElement('div');
        modal.id = 'authModal';
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;">
                <div style="background: var(--axis-neutral-900); border: 1px solid var(--axis-neutral-700); border-radius: 16px; padding: var(--space-8); max-width: 400px; width: 90%;">
                    <h3 style="font-size: var(--text-xl); margin-bottom: var(--space-4);">Authentication Required</h3>
                    <p style="color: var(--axis-neutral-400); margin-bottom: var(--space-6);">Please enter your client credentials to proceed with payment.</p>
                    
                    <form id="authForm">
                        <div style="margin-bottom: var(--space-4);">
                            <label style="display: block; margin-bottom: var(--space-2); color: var(--axis-neutral-300);">Client ID</label>
                            <input type="text" id="clientId" required style="width: 100%; padding: var(--space-3); background: var(--axis-neutral-800); border: 1px solid var(--axis-neutral-700); border-radius: 8px; color: white;">
                        </div>
                        
                        <div style="margin-bottom: var(--space-6);">
                            <label style="display: block; margin-bottom: var(--space-2); color: var(--axis-neutral-300);">Client Secret</label>
                            <input type="password" id="clientSecret" required style="width: 100%; padding: var(--space-3); background: var(--axis-neutral-800); border: 1px solid var(--axis-neutral-700); border-radius: 8px; color: white;">
                        </div>
                        
                        <button type="submit" class="btn-2025 btn-primary-2025" style="width: 100%;">Authenticate</button>
                    </form>
                    
                    <p style="font-size: var(--text-sm); color: var(--axis-neutral-500); margin-top: var(--space-4); text-align: center;">
                        Don't have credentials? Contact AI.info@axisthorn.com
                    </p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('authForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.authenticate();
        });
    }

    async authenticate() {
        const clientId = document.getElementById('clientId').value;
        const clientSecret = document.getElementById('clientSecret').value;

        try {
            const response = await fetch('/api/auth/payment-access', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ clientId, clientSecret })
            });

            const data = await response.json();

            if (data.success) {
                this.authToken = data.token;
                
                // Store auth with expiration
                sessionStorage.setItem('payment_auth', JSON.stringify({
                    token: data.token,
                    expires: Date.now() + (60 * 60 * 1000) // 1 hour
                }));

                // Remove auth modal
                document.getElementById('authModal').remove();
            } else {
                alert('Authentication failed: ' + (data.message || 'Invalid credentials'));
            }
        } catch (error) {
            console.error('Auth error:', error);
            alert('Authentication error. Please try again.');
        }
    }

    setupEventListeners() {
        // Payment method selection
        document.querySelectorAll('.payment-method-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const method = e.currentTarget.dataset.method;
                this.selectPaymentMethod(method);
            });
        });

        // Form submission
        document.getElementById('paymentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processPayment();
        });
    }

    selectPaymentMethod(method) {
        const buttons = document.querySelectorAll('.payment-method-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        
        const selectedBtn = document.querySelector(`[data-method="${method}"]`);
        selectedBtn.classList.add('active');
        
        const cardSection = document.getElementById('cardPaymentSection');
        const achSection = document.getElementById('achPaymentSection');
        
        if (method === 'card') {
            cardSection.style.display = 'block';
            achSection.style.display = 'none';
        } else {
            cardSection.style.display = 'none';
            achSection.style.display = 'block';
        }
    }

    async processPayment() {
        if (!this.authToken) {
            this.showAuthModal();
            return;
        }

        const submitButton = document.getElementById('submitButton');
        const buttonText = document.getElementById('buttonText');
        const spinner = document.getElementById('spinner');
        
        // Disable button and show spinner
        submitButton.disabled = true;
        buttonText.style.display = 'none';
        spinner.style.display = 'inline';
        
        // Get form values
        const formData = {
            invoiceNumber: document.getElementById('invoiceNumber').value,
            amount: parseFloat(document.getElementById('amount').value),
            email: document.getElementById('email').value,
            companyName: document.getElementById('companyName').value,
            description: document.getElementById('description').value
        };
        
        // Validate form
        if (!formData.invoiceNumber || !formData.amount || !formData.email) {
            this.showError('Please fill in all required fields');
            this.resetButton();
            return;
        }
        
        try {
            // Create payment intent
            const response = await fetch('/api/stripe-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
                body: JSON.stringify({
                    action: 'create-payment-intent',
                    amount: formData.amount,
                    currency: 'usd',
                    description: formData.description || `Payment for invoice ${formData.invoiceNumber}`,
                    customer_email: formData.email,
                    invoice_id: formData.invoiceNumber,
                    metadata: {
                        company_name: formData.companyName,
                        invoice_number: formData.invoiceNumber
                    }
                })
            });
            
            const data = await response.json();
            
            if (!response.ok || data.error) {
                throw new Error(data.error || 'Payment initialization failed');
            }
            
            // Confirm the payment with Stripe
            const { error, paymentIntent } = await this.stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: this.cardElement,
                    billing_details: {
                        email: formData.email,
                        name: formData.companyName || formData.email
                    }
                }
            });
            
            if (error) {
                throw error;
            } else {
                // Payment succeeded
                this.showPaymentStatus('success', paymentIntent);
                this.sendConfirmationEmail(formData, paymentIntent);
            }
            
        } catch (error) {
            console.error('Payment error:', error);
            this.showError(error.message);
            this.resetButton();
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('card-errors');
        errorDiv.textContent = message;
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    resetButton() {
        const submitButton = document.getElementById('submitButton');
        const buttonText = document.getElementById('buttonText');
        const spinner = document.getElementById('spinner');
        
        submitButton.disabled = false;
        buttonText.style.display = 'inline';
        spinner.style.display = 'none';
    }

    showPaymentStatus(status, paymentIntent) {
        // Hide all form sections
        document.querySelectorAll('.card-2025').forEach(card => {
            if (card.id !== 'paymentStatus') {
                card.style.display = 'none';
            }
        });
        
        const statusDiv = document.getElementById('paymentStatus');
        const statusIcon = document.getElementById('statusIcon');
        const statusTitle = document.getElementById('statusTitle');
        const statusMessage = document.getElementById('statusMessage');
        const receiptLink = document.getElementById('receiptLink');
        
        statusDiv.style.display = 'block';
        
        if (status === 'success') {
            statusIcon.innerHTML = '✅';
            statusTitle.textContent = 'Payment Successful!';
            statusMessage.textContent = `Your payment of $${(paymentIntent.amount / 100).toFixed(2)} has been processed successfully. Transaction ID: ${paymentIntent.id}`;
            
            if (paymentIntent.charges && paymentIntent.charges.data[0] && paymentIntent.charges.data[0].receipt_url) {
                receiptLink.innerHTML = `<a href="${paymentIntent.charges.data[0].receipt_url}" target="_blank" class="btn-2025" style="margin-top: var(--space-4);">View Receipt</a>`;
            }
        } else {
            statusIcon.innerHTML = '❌';
            statusTitle.textContent = 'Payment Failed';
            statusMessage.textContent = 'There was an error processing your payment. Please try again or contact support at AI.info@axisthorn.com';
        }
        
        statusDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    async sendConfirmationEmail(formData, paymentIntent) {
        // Send confirmation email through your API
        try {
            await fetch('/api/send-payment-confirmation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
                body: JSON.stringify({
                    email: formData.email,
                    invoiceNumber: formData.invoiceNumber,
                    amount: paymentIntent.amount / 100,
                    transactionId: paymentIntent.id,
                    companyName: formData.companyName
                })
            });
        } catch (error) {
            console.error('Failed to send confirmation email:', error);
        }
    }

    // ACH Payment Processing
    async processACHPayment() {
        if (!this.authToken) {
            this.showAuthModal();
            return;
        }

        const accountHolder = document.getElementById('accountHolder').value;
        const routingNumber = document.getElementById('routingNumber').value;
        const accountNumber = document.getElementById('accountNumber').value;

        if (!accountHolder || !routingNumber || !accountNumber) {
            alert('Please fill in all bank account fields');
            return;
        }

        // This would integrate with Stripe ACH
        alert('ACH payment processing is coming soon. Please use card payment for now.');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the payment portal with Stripe live publishable key
    window.vendorPaymentPortal = new VendorPaymentPortal('pk_live_51RbCgpG1uUSyJ0ucqzJ6P7OQ6wkDkdx2o4cklRD2XxFUssui1RjnzuR2zIAim0Oa3WgLMKTUFA2sW7IWl8hy6qEN00YEf8zSvh');
});