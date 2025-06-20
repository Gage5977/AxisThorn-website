// Axis Thorn 2025 - Interactive Elements

class AxisExperience {
  constructor() {
    this.initRevealAnimations();
    this.initSmoothScrolling();
    this.initParallax();
    this.initHoverEffects();
    this.initTypewriter();
  }

  // Reveal animations on scroll
  initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal-2025');
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('active');
          }, index * 100);
        }
      });
    }, observerOptions);
    
    reveals.forEach(el => observer.observe(el));
  }

  // Smooth scrolling
  initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const offset = 80; // Navigation height
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Parallax effects
  initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    let ticking = false;
    
    function updateParallax() {
      const scrolled = window.scrollY;
      
      parallaxElements.forEach(el => {
        const speed = el.dataset.parallax || 0.5;
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px)`;
      });
      
      ticking = false;
    }
    
    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', requestTick);
  }

  // Enhanced hover effects
  initHoverEffects() {
    // Magnetic button effect
    const buttons = document.querySelectorAll('.btn-2025');
    
    buttons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
      });
    });
    
    // Card tilt effect
    const cards = document.querySelectorAll('.card-2025, .system-showcase');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        const tiltX = (y - 0.5) * 10;
        const tiltY = (x - 0.5) * -10;
        
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(20px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      });
    });
    
    // Link underline animation
    const links = document.querySelectorAll('.contact-link, .nav-link-2025');
    
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        link.style.textDecoration = 'underline';
        link.style.textUnderlineOffset = '4px';
      });
      
      link.addEventListener('mouseleave', () => {
        link.style.textDecoration = 'none';
      });
    });
  }

  // Typewriter effect for hero
  initTypewriter() {
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;
    
    const text = typewriterElement.textContent;
    typewriterElement.textContent = '';
    typewriterElement.style.opacity = '1';
    
    let index = 0;
    
    function type() {
      if (index < text.length) {
        typewriterElement.textContent += text.charAt(index);
        index++;
        setTimeout(type, 50);
      }
    }
    
    setTimeout(type, 1000);
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  new AxisExperience();
  
  // Add loaded class for initial animations
  document.body.classList.add('loaded');
});

// Export for use in other modules
window.AxisExperience = AxisExperience;