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
    
    if (parallaxElements.length === 0) {return;}
    
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
    if (!typewriterElement) {return;}
    
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

// Lead Magnet System
function showLeadMagnet(type) {
  const modal = document.getElementById('leadMagnetModal');
  const content = document.getElementById('modalContent');
  
  const leadMagnets = {
    assessment: {
      title: 'AI Readiness Assessment',
      subtitle: 'Discover your automation potential in 5 minutes',
      form: `
        <div style="margin-bottom: var(--space-6);">
          <label style="display: block; margin-bottom: var(--space-2); color: var(--axis-neutral-300);">Current Monthly Processing Volume</label>
          <select style="width: 100%; padding: var(--space-3); background: var(--axis-neutral-800); border: 1px solid var(--axis-neutral-700); border-radius: 8px; color: var(--axis-pure-white);">
            <option>[ calculating... ]</option>
            <option>Under 100 transactions</option>
            <option>100-1,000 transactions</option>
            <option>1,000-10,000 transactions</option>
            <option>10,000+ transactions</option>
          </select>
        </div>
        <div style="margin-bottom: var(--space-6);">
          <label style="display: block; margin-bottom: var(--space-2); color: var(--axis-neutral-300);">Primary Challenge</label>
          <select style="width: 100%; padding: var(--space-3); background: var(--axis-neutral-800); border: 1px solid var(--axis-neutral-700); border-radius: 8px; color: var(--axis-pure-white);">
            <option>[ architecting... ]</option>
            <option>Manual data entry</option>
            <option>Analysis time</option>
            <option>Compliance tracking</option>
            <option>Risk assessment</option>
          </select>
        </div>
      `,
      cta: 'Generate My Report'
    },
    demo: {
      title: 'Interactive Demo',
      subtitle: 'See AI financial processing in action',
      form: `
        <div style="margin-bottom: var(--space-6);">
          <label style="display: block; margin-bottom: var(--space-2); color: var(--axis-neutral-300);">Preferred Demo Focus</label>
          <select style="width: 100%; padding: var(--space-3); background: var(--axis-neutral-800); border: 1px solid var(--axis-neutral-700); border-radius: 8px; color: var(--axis-pure-white);">
            <option>[ amplifying... ]</option>
            <option>Financial Statement Processing</option>
            <option>Portfolio Risk Analysis</option>
            <option>Contract Intelligence</option>
            <option>Custom Integration</option>
          </select>
        </div>
        <div style="margin-bottom: var(--space-6);">
          <label style="display: block; margin-bottom: var(--space-2); color: var(--axis-neutral-300);">Best Time for Demo</label>
          <select style="width: 100%; padding: var(--space-3); background: var(--axis-neutral-800); border: 1px solid var(--axis-neutral-700); border-radius: 8px; color: var(--axis-pure-white);">
            <option>[ scheduling... ]</option>
            <option>This week</option>
            <option>Next week</option>
            <option>Within 30 days</option>
            <option>Just exploring</option>
          </select>
        </div>
      `,
      cta: 'Book My Demo'
    },
    consultation: {
      title: 'Strategic Consultation',
      subtitle: 'Executive-level AI architecture discussion',
      form: `
        <div style="margin-bottom: var(--space-6);">
          <label style="display: block; margin-bottom: var(--space-2); color: var(--axis-neutral-300);">Organization Type</label>
          <select style="width: 100%; padding: var(--space-3); background: var(--axis-neutral-800); border: 1px solid var(--axis-neutral-700); border-radius: 8px; color: var(--axis-pure-white);">
            <option>[ identifying... ]</option>
            <option>Family Office</option>
            <option>Asset Manager</option>
            <option>Financial Institution</option>
            <option>Corporate Treasury</option>
          </select>
        </div>
        <div style="margin-bottom: var(--space-6);">
          <label style="display: block; margin-bottom: var(--space-2); color: var(--axis-neutral-300);">Investment Timeline</label>
          <select style="width: 100%; padding: var(--space-3); background: var(--axis-neutral-800); border: 1px solid var(--axis-neutral-700); border-radius: 8px; color: var(--axis-pure-white);">
            <option>[ planning... ]</option>
            <option>Immediate (Q1 2025)</option>
            <option>Near-term (Q2-Q3 2025)</option>
            <option>Future planning</option>
            <option>Research phase</option>
          </select>
        </div>
      `,
      cta: 'Schedule Consultation'
    }
  };
  
  const magnet = leadMagnets[type];
  
  content.innerHTML = `
    <div style="margin-bottom: var(--space-8);">
      <h3 style="font-size: var(--text-2xl); margin-bottom: var(--space-2); color: var(--axis-accent-primary);">${magnet.title}</h3>
      <p style="color: var(--axis-neutral-400);">${magnet.subtitle}</p>
    </div>
    
    <form onsubmit="submitLeadMagnet(event, '${type}')">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin-bottom: var(--space-6);">
        <div>
          <label style="display: block; margin-bottom: var(--space-2); color: var(--axis-neutral-300);">Name</label>
          <input required type="text" style="width: 100%; padding: var(--space-3); background: var(--axis-neutral-800); border: 1px solid var(--axis-neutral-700); border-radius: 8px; color: var(--axis-pure-white);">
        </div>
        <div>
          <label style="display: block; margin-bottom: var(--space-2); color: var(--axis-neutral-300);">Email</label>
          <input required type="email" style="width: 100%; padding: var(--space-3); background: var(--axis-neutral-800); border: 1px solid var(--axis-neutral-700); border-radius: 8px; color: var(--axis-pure-white);">
        </div>
      </div>
      
      ${magnet.form}
      
      <button type="submit" class="btn-2025 btn-primary-2025" style="width: 100%; margin-top: var(--space-6);">
        ${magnet.cta} →
      </button>
    </form>
  `;
  
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeLeadMagnet() {
  const modal = document.getElementById('leadMagnetModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

async function submitLeadMagnet(event, type) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  const content = document.getElementById('modalContent');
  
  // Show loading state
  content.innerHTML = `
    <div style="text-align: center;">
      <div style="font-size: 24px; margin-bottom: var(--space-4);">⟳</div>
      <h3 style="color: var(--axis-accent-primary); margin-bottom: var(--space-4);">Processing...</h3>
      <p style="color: var(--axis-neutral-300);">Please wait while we process your request.</p>
    </div>
  `;
  
  try {
    // Initialize CRM integration
    const crm = new CRMIntegration();
    
    // Prepare lead data
    const leadData = {
      name: formData.get('name') || form.querySelector('input[type="text"]').value,
      email: formData.get('email') || form.querySelector('input[type="email"]').value,
      company: formData.get('company') || '',
      type: type,
      timestamp: new Date().toISOString(),
      source: 'website-lead-magnet'
    };
    
    // Submit lead
    const result = await crm.submitLead(leadData);
    
    if (result.success) {
      showSuccessMessage(type, content);
    } else {
      showErrorMessage(content);
    }
  } catch (error) {
    showErrorMessage(content);
  }
}

function showSuccessMessage(type, content) {
  const thankYouMessages = {
    assessment: 'Your AI readiness report is being generated. Check your email in 5 minutes.',
    demo: 'Demo scheduled! Our team will contact you within 24 hours to confirm timing.',
    consultation: 'Consultation request received. Our executive team will reach out within 48 hours.'
  };
  
  content.innerHTML = `
    <div style="text-align: center;">
      <div style="font-size: 48px; margin-bottom: var(--space-4);">✓</div>
      <h3 style="color: var(--axis-accent-secondary); margin-bottom: var(--space-4);">Success!</h3>
      <p style="color: var(--axis-neutral-300); margin-bottom: var(--space-6);">${thankYouMessages[type]}</p>
      <button onclick="closeLeadMagnet()" class="btn-2025 btn-primary-2025">Continue Exploring</button>
    </div>
  `;
}

function showErrorMessage(content) {
  content.innerHTML = `
    <div style="text-align: center;">
      <div style="font-size: 48px; margin-bottom: var(--space-4);">⚠</div>
      <h3 style="color: var(--axis-accent-tertiary); margin-bottom: var(--space-4);">Connection Error</h3>
      <p style="color: var(--axis-neutral-300); margin-bottom: var(--space-6);">
        We're experiencing technical difficulties. Please try again or contact us directly at AI.info@axisthorn.com
      </p>
      <button onclick="closeLeadMagnet()" class="btn-2025">Close</button>
    </div>
  `;
}

// Progressive Disclosure for Services
function expandService(serviceType) {
  event.stopPropagation();
  
  const serviceCard = event.currentTarget;
  const details = serviceCard.querySelector('.service-details');
  const expandIcon = serviceCard.querySelector('.expand-icon');
  
  const isExpanded = serviceCard.classList.contains('expanded');
  
  // Close all other expanded services
  document.querySelectorAll('.service-card').forEach(card => {
    const cardDetails = card.querySelector('.service-details');
    const cardIcon = card.querySelector('.expand-icon');
    if (card !== serviceCard) {
      cardDetails.style.display = 'none';
      cardIcon.textContent = '[ expand ]';
      card.classList.remove('expanded');
    }
  });
  
  if (isExpanded) {
    details.style.display = 'none';
    expandIcon.textContent = '[ expand ]';
    serviceCard.classList.remove('expanded');
  } else {
    details.style.display = 'block';
    expandIcon.textContent = '[ collapse ]';
    serviceCard.classList.add('expanded');
    
    // Smooth scroll to bring the expanded card into view
    setTimeout(() => {
      serviceCard.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }, 200);
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  new AxisExperience();
  
  // Add loaded class for initial animations
  document.body.classList.add('loaded');
  
  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLeadMagnet();
    }
  });
  
  // Close modal on backdrop click
  document.getElementById('leadMagnetModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'leadMagnetModal') {
      closeLeadMagnet();
    }
  });
});

// Export for use in other modules
window.AxisExperience = AxisExperience;
window.showLeadMagnet = showLeadMagnet;
window.closeLeadMagnet = closeLeadMagnet;
window.submitLeadMagnet = submitLeadMagnet;
window.expandService = expandService;