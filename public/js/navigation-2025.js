// Navigation functionality for Axis Thorn 2025
class Navigation2025 {
  constructor() {
    this.init();
  }

  init() {
    this.setupServicesDropdown();
    this.setupMobileMenu();
    this.setupScrollBehavior();
  }

  setupServicesDropdown() {
    // Add dropdown functionality for Services link
    const servicesLink = document.querySelector('.nav-link-2025[href="#services"]');
    if (!servicesLink) {return;}

    // Create dropdown menu
    const dropdown = document.createElement('div');
    dropdown.className = 'nav-dropdown-2025';
    dropdown.innerHTML = `
            <a href="/consultation" class="dropdown-link-2025">Strategic Consultation</a>
            <a href="/implementation" class="dropdown-link-2025">Implementation</a>
            <a href="/support" class="dropdown-link-2025">Ongoing Support</a>
        `;

    // Style the dropdown
    Object.assign(dropdown.style, {
      position: 'absolute',
      top: '100%',
      left: '0',
      background: 'var(--axis-pure-black)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      minWidth: '200px',
      opacity: '0',
      visibility: 'hidden',
      transform: 'translateY(-10px)',
      transition: 'all 0.3s var(--ease-out-expo)',
      zIndex: '1000'
    });

    // Add dropdown to services li
    const servicesLi = servicesLink.parentElement;
    servicesLi.style.position = 'relative';
    servicesLi.appendChild(dropdown);

    // Show/hide dropdown on hover
    let hoverTimeout;
    servicesLi.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimeout);
      dropdown.style.opacity = '1';
      dropdown.style.visibility = 'visible';
      dropdown.style.transform = 'translateY(0)';
    });

    servicesLi.addEventListener('mouseleave', () => {
      hoverTimeout = setTimeout(() => {
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        dropdown.style.transform = 'translateY(-10px)';
      }, 200);
    });

    // Make services link clickable to show dropdown on mobile
    servicesLink.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const isVisible = dropdown.style.visibility === 'visible';
        dropdown.style.opacity = isVisible ? '0' : '1';
        dropdown.style.visibility = isVisible ? 'hidden' : 'visible';
        dropdown.style.transform = isVisible ? 'translateY(-10px)' : 'translateY(0)';
      }
    });
  }

  setupMobileMenu() {
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-toggle-2025';
    mobileToggle.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
        `;
        
    const nav = document.querySelector('.nav-2025');
    const navInner = document.querySelector('.nav-2025-inner');
    const navLinks = document.querySelector('.nav-links-2025');
        
    if (nav && navInner && navLinks) {
      navInner.appendChild(mobileToggle);
            
      mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
      });
    }
  }

  setupScrollBehavior() {
    // Smooth scroll for anchor links
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

    // Add scroll indicator
    let lastScroll = 0;
    const nav = document.querySelector('.nav-2025');
        
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
            
      if (currentScroll > lastScroll && currentScroll > 100) {
        nav.style.transform = 'translateY(-100%)';
      } else {
        nav.style.transform = 'translateY(0)';
      }
            
      lastScroll = currentScroll;
    });
  }
}

// Initialize navigation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new Navigation2025());
} else {
  new Navigation2025();
}