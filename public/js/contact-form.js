// Contact Form Handler
class ContactForm {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.submitButton = this.form?.querySelector('[type="submit"]');
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.addValidation();
    }

    addValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', this.validateField.bind(this));
            input.addEventListener('input', this.clearFieldError.bind(this));
        });
    }

    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Clear previous error
        this.clearFieldError(e);

        // Validate based on field type
        switch(field.type) {
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    this.showFieldError(field, 'Please enter a valid email address');
                }
                break;
            case 'text':
                if (field.required && !value) {
                    this.showFieldError(field, 'This field is required');
                }
                break;
            case 'textarea':
                if (field.required && !value) {
                    this.showFieldError(field, 'This field is required');
                }
                break;
        }
    }

    clearFieldError(e) {
        const field = e.target;
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        field.classList.remove('error');
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: var(--axis-accent-tertiary);
            font-size: var(--text-sm);
            margin-top: var(--space-2);
        `;
        
        field.parentNode.appendChild(errorElement);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate required fields
        if (!this.validateForm(data)) {
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                this.showSuccess(result.message);
                this.form.reset();
            } else {
                this.showError(result.error || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            this.showError('Network error. Please check your connection and try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    validateForm(data) {
        let isValid = true;
        
        // Check required fields
        const requiredFields = ['name', 'email', 'message'];
        requiredFields.forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (!data[fieldName] || !data[fieldName].trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            }
        });

        // Validate email
        if (data.email && !this.isValidEmail(data.email)) {
            const emailField = this.form.querySelector('[name="email"]');
            this.showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
        }

        return isValid;
    }

    setLoadingState(loading) {
        if (!this.submitButton) return;
        
        if (loading) {
            this.submitButton.disabled = true;
            this.submitButton.textContent = 'Sending...';
            this.submitButton.style.opacity = '0.7';
        } else {
            this.submitButton.disabled = false;
            this.submitButton.textContent = 'Send Message';
            this.submitButton.style.opacity = '1';
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Remove existing notification
        const existing = document.querySelector('.contact-notification');
        if (existing) {
            existing.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = 'contact-notification';
        notification.textContent = message;
        
        const backgroundColor = type === 'success' 
            ? 'var(--axis-accent-secondary)' 
            : 'var(--axis-accent-tertiary)';
            
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: var(--space-6);
            background: ${backgroundColor};
            color: var(--axis-pure-white);
            padding: var(--space-4) var(--space-6);
            border-radius: 8px;
            z-index: 1000;
            font-size: var(--text-sm);
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease-out;
        `;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Initialize contact forms when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize any contact forms found on the page
    const contactForms = document.querySelectorAll('.contact-form');
    contactForms.forEach((form, index) => {
        new ContactForm(`.contact-form:nth-child(${index + 1})`);
    });
});

// Export for use in other scripts
window.ContactForm = ContactForm;