// Performance Module
export const PerformanceModule = {
  optimizeScrollPerformance() {
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
  }
};

export default PerformanceModule;