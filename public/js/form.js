// Form Module
import { showNotification } from './notification.js';

export const FormModule = {
    init() {
        this.initContactForm();
        this.initTaxForm();
        this.enhanceFormValidation();
    },
    
    initContactForm() {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Track form submission attempt
            if (typeof trackEvent === 'function') {
                trackEvent('form_submission_attempt', 'engagement', 'contact_form');
            }
            
            // Basic validation
            if (!data.name || !data.email || !data.service || !data.message) {
                showNotification('Please fill in all required fields.', 'error');
                if (typeof trackEvent === 'function') {
                    trackEvent('form_validation_error', 'engagement', 'missing_fields');
                }
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Please enter a valid email address.', 'error');
                if (typeof trackEvent === 'function') {
                    trackEvent('form_validation_error', 'engagement', 'invalid_email');
                }
                return;
            }
            
            // Track service interest
            if (typeof trackEvent === 'function') {
                trackEvent('service_interest', 'business', data.service);
            }
            
            // Simulate form submission
            const submitButton = this.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showNotification('Consultation request submitted successfully. We will contact you within 24 hours.', 'success');
                
                // Track successful submission
                if (typeof trackEvent === 'function') {
                    trackEvent('form_submission_success', 'conversion', 'contact_form');
                    trackEvent('lead_generated', 'business', data.service);
                }
                
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
        
        // Track form field interactions
        const formFields = contactForm.querySelectorAll('input, textarea, select');
        formFields.forEach(field => {
            field.addEventListener('focus', () => {
                if (typeof trackEvent === 'function') {
                    trackEvent('form_field_focus', 'engagement', field.name || field.type);
                }
            });
            
            // Track time spent in form
            let focusTime = 0;
            field.addEventListener('focus', () => {
                focusTime = Date.now();
            });
            
            field.addEventListener('blur', () => {
                if (focusTime) {
                    const timeSpent = (Date.now() - focusTime) / 1000;
                    if (timeSpent > 2 && typeof trackEvent === 'function') {
                        trackEvent('form_field_engagement', 'engagement', `${field.name}_${Math.round(timeSpent)}s`);
                    }
                }
            });
        });
    },
    
    initTaxForm() {
        const tax1099AccessForm = document.getElementById('tax1099AccessForm');
        if (!tax1099AccessForm) return;
        
        tax1099AccessForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Basic validation
            if (!data.taxId || !data.businessName || !data.accessCode) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Tax ID format validation
            const taxIdRegex = /^\d{3}-\d{2}-\d{4}$|^\d{2}-\d{7}$/;
            if (!taxIdRegex.test(data.taxId)) {
                showNotification('Please enter a valid Tax ID format (XXX-XX-XXXX or XX-XXXXXXX).', 'error');
                return;
            }
            
            const submitButton = this.querySelector('.admin-button');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Verifying Access...';
            submitButton.disabled = true;
            
            // Simulate authentication process
            setTimeout(() => {
                showNotification('Authentication successful. Redirecting to document portal...', 'success');
                
                setTimeout(() => {
                    showNotification('Document portal integration pending. Contact AI.info@axisthorn.com for manual access.', 'info');
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 2000);
            }, 3000);
        });
    },
    
    enhanceFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                // Real-time validation feedback
                input.addEventListener('blur', () => {
                    this.validateInput(input);
                });
                
                input.addEventListener('input', () => {
                    // Clear error state on input
                    input.classList.remove('error');
                    const errorMsg = input.parentNode.querySelector('.error-message');
                    if (errorMsg) errorMsg.remove();
                });
            });
        });
    },
    
    validateInput(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Required field check
        if (input.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Phone validation (if applicable)
        if (input.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        
        // Update UI
        input.classList.toggle('error', !isValid);
        
        // Remove existing error message
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        // Add error message if needed
        if (!isValid) {
            const errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.textContent = errorMessage;
            errorElement.style.cssText = `
                color: #EF4444;
                font-size: 0.8rem;
                margin-top: 0.25rem;
                display: block;
            `;
            input.parentNode.appendChild(errorElement);
        }
        
        return isValid;
    }
};

export default FormModule;