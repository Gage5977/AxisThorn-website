// Navigation Module
export const Navigation = {
    init() {
        this.initSmoothScrolling();
        this.initScrollEffects();
        this.handleExternalLinks();
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
                navigation.style.background = 'rgba(10, 15, 28, 0.98)';
                navigation.style.borderBottom = '1px solid rgba(6, 182, 212, 0.3)';
                navigation.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.1)';
            } else {
                navigation.style.background = 'rgba(10, 15, 28, 0.95)';
                navigation.style.borderBottom = '1px solid rgba(6, 182, 212, 0.1)';
                navigation.style.boxShadow = 'none';
            }
        });
    },
    
    handleExternalLinks() {
        // Add confirmation for external links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (!href) return;
            
            // Check if it's an external link
            const isExternal = href.startsWith('http') && !href.includes(window.location.hostname);
            const isMailto = href.startsWith('mailto:');
            
            if (isExternal && !isMailto) {
                e.preventDefault();
                
                if (confirm('You are leaving Axis Thorn LLC website. Continue to external site?')) {
                    window.open(href, '_blank', 'noopener,noreferrer');
                }
            }
        });
    }
};

export default Navigation;