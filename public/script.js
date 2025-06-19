// ===== Navigation Module =====
const Navigation = {
    init() {
        this.initSmoothScrolling();
        this.initScrollEffects();
    },
    
    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    },
    
    initScrollEffects() {
        const navigation = document.querySelector('.navigation');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 50) {
                navigation.style.background = 'rgba(10, 10, 10, 0.98)';
                navigation.style.borderBottom = '1px solid rgba(212, 175, 55, 0.3)';
            } else {
                navigation.style.background = 'rgba(10, 10, 10, 0.95)';
                navigation.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
            }
        });
    }
};

// ===== Animation Module =====
const AnimationModule = {
    observer: null,
    
    init() {
        this.setupIntersectionObserver();
        this.observeElements();
    },
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
    },
    
    observeElements() {
        const serviceCards = document.querySelectorAll('.service-card');
        const aboutSection = document.querySelector('.about-text');
        const contactSection = document.querySelector('.contact-info');
        
        serviceCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            card.style.transition = `opacity 0.8s ease-out ${index * 0.2}s, transform 0.8s ease-out ${index * 0.2}s`;
            this.observer.observe(card);
        });
        
        if (aboutSection) {
            aboutSection.style.opacity = '0';
            aboutSection.style.transform = 'translateY(30px)';
            aboutSection.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            this.observer.observe(aboutSection);
        }
        
        if (contactSection) {
            contactSection.style.opacity = '0';
            contactSection.style.transform = 'translateY(30px)';
            contactSection.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            this.observer.observe(contactSection);
        }
    }
};

// ===== Form Module =====
const FormModule = {
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

// ===== Notification Module =====
const NotificationModule = {
    show(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#2d5016' : type === 'error' ? '#5d1a1a' : '#1a1a1a'};
            color: #e8e8e8;
            padding: 1rem 2rem;
            border-left: 4px solid ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#d4af37'};
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 400px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            border-radius: 2px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
};

// ===== Visual Effects Module =====
const VisualEffects = {
    init() {
        this.initParallax();
        this.initServiceCardEffects();
        this.initGlitchEffect();
    },
    
    initParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset || document.documentElement.scrollTop;
            const thornPattern = document.querySelector('.thorn-pattern');
            const heroVisual = document.querySelector('.hero-visual');
            
            if (thornPattern && heroVisual) {
                const rate = scrolled * -0.5;
                thornPattern.style.transform = `translateY(${rate}px) rotate(${scrolled * 0.1}deg)`;
            }
        });
    },
    
    initServiceCardEffects() {
        document.querySelectorAll('.service-card').forEach(card => {
            const icon = card.querySelector('.service-icon > div');
            
            card.addEventListener('mouseenter', () => {
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(10deg)';
                    icon.style.filter = 'brightness(1.2)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                    icon.style.filter = 'brightness(1)';
                }
            });
        });
    },
    
    initGlitchEffect() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;
        
        let glitchTimeout;
        
        heroTitle.addEventListener('mouseenter', () => {
            heroTitle.style.textShadow = `
                2px 0 #d4af37,
                -2px 0 #8b0000,
                0 2px #c0c0c0
            `;
            
            glitchTimeout = setTimeout(() => {
                heroTitle.style.textShadow = 'none';
            }, 200);
        });
        
        heroTitle.addEventListener('mouseleave', () => {
            clearTimeout(glitchTimeout);
            heroTitle.style.textShadow = 'none';
        });
    }
};

// ===== Administrative Services Module =====
const AdminServices = {
    init() {
        this.initTaxIdFormatting();
        this.initBankingRequests();
    },
    
    initTaxIdFormatting() {
        const taxIdInput = document.getElementById('taxId');
        if (!taxIdInput) return;
        
        taxIdInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 9) {
                // SSN format: XXX-XX-XXXX
                if (value.length >= 6) {
                    value = value.slice(0, 3) + '-' + value.slice(3, 5) + '-' + value.slice(5);
                } else if (value.length >= 4) {
                    value = value.slice(0, 3) + '-' + value.slice(3);
                }
            } else {
                // EIN format: XX-XXXXXXX
                value = value.slice(0, 2) + '-' + value.slice(2, 9);
            }
            
            e.target.value = value;
        });
    },
    
    initBankingRequests() {
        const secureElements = document.querySelectorAll('.detail-value.secure');
        
        secureElements.forEach(element => {
            element.style.cursor = 'pointer';
            element.title = 'Click to request banking details';
            
            element.addEventListener('click', function() {
                const paymentType = this.getAttribute('data-payment-type');
                const paymentMethod = this.closest('.payment-method').querySelector('h5').textContent;
                AdminServices.requestBankingDetails(paymentMethod, paymentType);
            });
        });
    },
    
    requestBankingDetails(paymentMethod, paymentType) {
        const subject = encodeURIComponent(`Banking Instructions Request - ${paymentMethod}`);
        const body = encodeURIComponent(`Hello,

I am requesting banking instructions for: ${paymentMethod}
Payment Type: ${paymentType || 'Standard'}

Please provide secure banking details for payment processing.

Invoice/Reference Number: [Please specify]
Expected Payment Amount: [Please specify]
Payment Date: [Please specify]

Thank you.`);
        
        const mailtoLink = `mailto:AI.info@axisthorn.com?subject=${subject}&body=${body}`;
        window.location.href = mailtoLink;
        
        showNotification('Email client opened. Banking details will be provided via encrypted email within 2 hours.', 'info');
    }
};

// ===== Mobile Module =====
const MobileModule = {
    init() {
        if (window.innerWidth <= 768) {
            this.createMobileNav();
            this.addTouchSupport();
        }
    },
    
    createMobileNav() {
        const nav = document.querySelector('.navigation');
        const navMenu = document.querySelector('.nav-menu');
        
        // Create mobile menu toggle button
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-nav-toggle';
        mobileToggle.innerHTML = `
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        `;
        mobileToggle.setAttribute('aria-label', 'Toggle mobile navigation');
        
        // Add toggle button to nav
        const navContainer = document.querySelector('.nav-container');
        navContainer.appendChild(mobileToggle);
        
        // Toggle functionality
        let isMenuOpen = false;
        mobileToggle.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            mobileToggle.classList.toggle('active', isMenuOpen);
            navMenu.classList.toggle('mobile-open', isMenuOpen);
            document.body.classList.toggle('mobile-nav-open', isMenuOpen);
            
            // Animate hamburger lines
            const lines = mobileToggle.querySelectorAll('.hamburger-line');
            lines.forEach((line, index) => {
                line.style.transform = isMenuOpen ? 
                    (index === 0 ? 'rotate(45deg) translate(6px, 6px)' :
                     index === 1 ? 'opacity(0)' :
                     'rotate(-45deg) translate(6px, -6px)') : '';
            });
            
            // Track mobile nav usage
            if (typeof trackEvent === 'function') {
                trackEvent('mobile_nav_toggle', 'navigation', isMenuOpen ? 'open' : 'close');
            }
        });
        
        // Close menu on link click
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                isMenuOpen = false;
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('mobile-open');
                document.body.classList.remove('mobile-nav-open');
            });
        });
        
        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !nav.contains(e.target)) {
                isMenuOpen = false;
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('mobile-open');
                document.body.classList.remove('mobile-nav-open');
            }
        });
    },
    
    addTouchSupport() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        });
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
        });
    },
    
    handleSwipe(startX, startY, endX, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;
        
        // Horizontal swipes
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                // Swipe right - could trigger navigation
                if (typeof trackEvent === 'function') {
                    trackEvent('swipe_right', 'gesture', 'mobile');
                }
            } else {
                // Swipe left
                if (typeof trackEvent === 'function') {
                    trackEvent('swipe_left', 'gesture', 'mobile');
                }
            }
        }
    }
};

// ===== Performance Module =====
const optimizeScrollPerformance = () => {
    let ticking = false;
    
    const updateOnScroll = () => {
        const scrolled = window.pageYOffset || document.documentElement.scrollTop;
        const navigation = document.querySelector('.navigation');
        const thornPattern = document.querySelector('.thorn-pattern');
        
        // Throttled navigation background update
        if (scrolled > 50) {
            navigation.style.background = 'rgba(10, 10, 10, 0.98)';
            navigation.style.borderBottom = '1px solid rgba(212, 175, 55, 0.3)';
        } else {
            navigation.style.background = 'rgba(10, 10, 10, 0.95)';
            navigation.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        }
        
        // Parallax effect (only on desktop to preserve mobile performance)
        if (window.innerWidth > 768 && thornPattern) {
            const rate = scrolled * -0.5;
            thornPattern.style.transform = `translateY(${rate}px) rotate(${scrolled * 0.1}deg)`;
        }
        
        ticking = false;
    };
    
    const requestScrollUpdate = () => {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    };
    
    // Replace existing scroll listener
    window.removeEventListener('scroll', () => {});
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
};

// ===== Utility Functions =====
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ===== Main Application Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Navigation.init();
    AnimationModule.init();
    FormModule.init();
    VisualEffects.init();
    AdminServices.init();
    MobileModule.init();
    
    // Optimize scroll performance
    optimizeScrollPerformance();
    
    // Track page load
    if (typeof trackEvent === 'function') {
        trackEvent('page_load', 'engagement', document.title);
    }
});

// Global utility functions
function showNotification(message, type = 'info') {
    NotificationModule.show(message, type);
}