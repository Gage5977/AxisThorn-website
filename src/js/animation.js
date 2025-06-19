// Animation Module
export const AnimationModule = {
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

export default AnimationModule;