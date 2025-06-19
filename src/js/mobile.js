// Mobile Module
export const MobileModule = {
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

export default MobileModule;