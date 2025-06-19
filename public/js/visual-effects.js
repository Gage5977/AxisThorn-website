// Visual Effects Module
export const VisualEffects = {
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

export default VisualEffects;