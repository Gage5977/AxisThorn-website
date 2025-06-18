// Smooth scrolling for navigation links
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

// Navigation background on scroll
let lastScrollTop = 0;
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
    
    lastScrollTop = scrollTop;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards and other elements
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    const aboutSection = document.querySelector('.about-text');
    const contactSection = document.querySelector('.contact-info');
    
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `opacity 0.8s ease-out ${index * 0.2}s, transform 0.8s ease-out ${index * 0.2}s`;
        observer.observe(card);
    });
    
    if (aboutSection) {
        aboutSection.style.opacity = '0';
        aboutSection.style.transform = 'translateY(30px)';
        aboutSection.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(aboutSection);
    }
    
    if (contactSection) {
        contactSection.style.opacity = '0';
        contactSection.style.transform = 'translateY(30px)';
        contactSection.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(contactSection);
    }
});

// Form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        // Basic validation
        if (!data.name || !data.email || !data.service || !data.message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitButton = this.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showNotification('Consultation request submitted successfully. We will contact you within 24 hours.', 'success');
            this.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    });
}

// Notification system
function showNotification(message, type = 'info') {
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

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const thornPattern = document.querySelector('.thorn-pattern');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (thornPattern && heroVisual) {
        const rate = scrolled * -0.5;
        thornPattern.style.transform = `translateY(${rate}px) rotate(${scrolled * 0.1}deg)`;
    }
});

// Cursor trail effect removed for performance

// Add typing effect to hero title (optional enhancement)
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

// Enhanced service card interactions
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

// Add glitch effect to title on hover (subtle)
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
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

// Administrative Services Functionality

// 1099 Tax ID formatting
document.addEventListener('DOMContentLoaded', function() {
    const taxIdInput = document.getElementById('taxId');
    if (taxIdInput) {
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
    }
});

// 1099 Access Form handling
const tax1099AccessForm = document.getElementById('tax1099AccessForm');
if (tax1099AccessForm) {
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
}

// Banking request functionality
document.addEventListener('DOMContentLoaded', function() {
    const secureElements = document.querySelectorAll('.detail-value.secure');
    
    secureElements.forEach(element => {
        element.style.cursor = 'pointer';
        element.title = 'Click to request banking details';
        
        element.addEventListener('click', function() {
            const paymentType = this.getAttribute('data-payment-type');
            const paymentMethod = this.closest('.payment-method').querySelector('h5').textContent;
            requestBankingDetails(paymentMethod, paymentType);
        });
    });
});

function requestBankingDetails(paymentMethod, paymentType) {
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