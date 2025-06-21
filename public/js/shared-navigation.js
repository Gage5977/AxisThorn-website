// Shared Navigation Component - Provides consistent navigation across all pages
class AxisThornNavigation {
  constructor() {
    this.currentPath = window.location.pathname;
    this.currentHash = window.location.hash;
    
    // Define navigation structure
    this.navigationStructure = {
      main: [
        { href: '/', label: 'Home', id: 'home' },
        { href: '/#method', label: 'Method', id: 'method' },
        { href: '/#services', label: 'Services', id: 'services' },
        { href: '/portfolio', label: 'Portfolio', id: 'portfolio' },
        { href: '/about', label: 'About', id: 'about' },
        { href: '#contact', label: 'Contact', id: 'contact' }
      ],
      services: [
        { href: '/terminal', label: 'AXIS Terminal', id: 'terminal', badge: 'NEW' },
        { href: '/axis-ai', label: 'AXIS AI', id: 'ai', badge: 'BETA' },
        { href: '/banking-portal', label: 'Banking Portal', id: 'banking' },
        { href: '/invoices', label: 'Portal', id: 'portal' }
      ]
    };
  }
  
  // Get navigation items based on current page
  getNavigationItems() {
    const isHomePage = this.currentPath === '/';
    const isServicePage = ['/terminal', '/axis-ai', '/banking-portal', '/invoices'].includes(this.currentPath);
    
    if (isHomePage) {
      // Homepage navigation
      return [
        { href: '#method', label: 'Method' },
        { href: '#services', label: 'Services' },
        { href: '/portfolio', label: 'Portfolio' },
        { href: '/about', label: 'About' },
        { href: '#contact', label: 'Contact' }
      ];
    } else if (isServicePage) {
      // Service pages navigation
      return [
        { href: '/', label: 'Home' },
        { href: '/#services', label: 'Services' },
        { href: '/terminal', label: 'Terminal', highlight: this.currentPath === '/terminal' },
        { href: '/axis-ai', label: 'AXIS AI', highlight: this.currentPath === '/axis-ai' },
        { href: '/invoices', label: 'Portal', highlight: this.currentPath === '/invoices' },
        { href: '#contact', label: 'Contact' }
      ];
    } 
    // Other pages (portfolio, about, etc.)
    return [
      { href: '/', label: 'Home' },
      { href: '/#services', label: 'Services' },
      { href: '/portfolio', label: 'Portfolio', highlight: this.currentPath === '/portfolio' },
      { href: '/about', label: 'About', highlight: this.currentPath === '/about' },
      { href: '#contact', label: 'Contact' }
    ];
    
  }
  
  // Generate the navigation HTML
  generateNavigation() {
    const navItems = this.getNavigationItems();
    
    const logoSVG = `
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 44 L20 4 L24 4 L28 14 L20 14 L16 24 L32 24 L28 34 L20 34 L16 44 L4 44 Z" 
              fill="currentColor" opacity="1"/>
        <path d="M20 4 L44 4 L44 12 L32 12 L32 44 L24 44 L24 12 L20 12 L20 4 Z" 
              fill="currentColor" opacity="1"/>
        <rect x="16" y="20" width="16" height="8" fill="currentColor" opacity="0.2"/>
      </svg>
    `;
    
    const navHTML = `
      <nav class="nav-2025" role="navigation" aria-label="Main navigation">
        <div class="nav-2025-inner">
          <a href="/" class="logo-2025" aria-label="Axis Thorn">
            ${logoSVG}
            <span>Axis Thorn</span>
          </a>
          
          <button class="mobile-menu-toggle" aria-label="Toggle navigation menu" aria-expanded="false">
            <span class="hamburger"></span>
            <span class="hamburger"></span>
            <span class="hamburger"></span>
          </button>
          
          <ul class="nav-links-2025">
            ${navItems.map(item => `
              <li>
                <a href="${item.href}" 
                   class="nav-link-2025${item.highlight ? ' active' : ''}"
                   ${item.badge ? `data-badge="${item.badge}"` : ''}>
                  ${item.label}
                </a>
              </li>
            `).join('')}
          </ul>
          
          <div class="nav-actions">
            <a href="/app" class="nav-cta-button">Launch App</a>
          </div>
        </div>
      </nav>
    `;
    
    return navHTML;
  }
  
  // Mobile menu styles
  addMobileStyles() {
    if (!document.getElementById('axis-nav-mobile-styles')) {
      const styles = `
        <style id="axis-nav-mobile-styles">
          .mobile-menu-toggle {
            display: none;
            flex-direction: column;
            justify-content: space-between;
            width: 24px;
            height: 20px;
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 0;
            z-index: 1001;
          }
          
          .hamburger {
            width: 100%;
            height: 2px;
            background: var(--axis-primary-fg, #E0E6FF);
            transition: all 0.3s ease;
            transform-origin: left;
          }
          
          .mobile-menu-toggle.active .hamburger:nth-child(1) {
            transform: rotate(45deg);
          }
          
          .mobile-menu-toggle.active .hamburger:nth-child(2) {
            opacity: 0;
            transform: translateX(-20px);
          }
          
          .mobile-menu-toggle.active .hamburger:nth-child(3) {
            transform: rotate(-45deg);
          }
          
          @media (max-width: 768px) {
            .mobile-menu-toggle {
              display: flex;
            }
            
            .nav-links-2025 {
              position: fixed;
              top: 80px;
              left: 0;
              right: 0;
              background: var(--axis-neutral-900, #0A0F1C);
              flex-direction: column;
              padding: 2rem;
              transform: translateY(-120%);
              transition: transform 0.3s ease;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
              z-index: 999;
            }
            
            .nav-links-2025.mobile-open {
              transform: translateY(0);
            }
            
            .nav-links-2025 li {
              margin: 1rem 0;
            }
            
            .nav-actions {
              display: none;
            }
          }
        </style>
      `;
      document.head.insertAdjacentHTML('beforeend', styles);
    }
  }
  
  // Initialize mobile menu functionality
  initializeMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links-2025');
    const nav = document.querySelector('.nav-2025');
    
    if (toggle && navLinks) {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('mobile-open');
        toggle.classList.toggle('active');
        nav.classList.toggle('mobile-menu-active');
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-2025') && navLinks.classList.contains('mobile-open')) {
          toggle.setAttribute('aria-expanded', 'false');
          navLinks.classList.remove('mobile-open');
          toggle.classList.remove('active');
          nav.classList.remove('mobile-menu-active');
        }
      });
      
      // Close menu when clicking a link
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          toggle.setAttribute('aria-expanded', 'false');
          navLinks.classList.remove('mobile-open');
          toggle.classList.remove('active');
          nav.classList.remove('mobile-menu-active');
        });
      });
    }
  }
  
  // Add scroll behavior
  addScrollBehavior() {
    let lastScroll = 0;
    const nav = document.querySelector('.nav-2025');
    
    if (nav) {
      window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
          nav.classList.remove('scrolled', 'scroll-up');
          return;
        }
        
        if (currentScroll > lastScroll && !nav.classList.contains('scroll-down')) {
          // Scrolling down
          nav.classList.remove('scroll-up');
          nav.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && nav.classList.contains('scroll-down')) {
          // Scrolling up
          nav.classList.remove('scroll-down');
          nav.classList.add('scroll-up');
        }
        
        if (currentScroll > 50) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
      });
    }
  }
  
  // Replace or inject navigation
  inject() {
    const existingNav = document.querySelector('nav.nav-2025') || 
                       document.querySelector('nav.navigation') || 
                       document.querySelector('nav');
    
    const newNavHTML = this.generateNavigation();
    
    if (existingNav) {
      // Replace existing navigation
      existingNav.outerHTML = newNavHTML;
    } else {
      // Insert at beginning of body
      document.body.insertAdjacentHTML('afterbegin', newNavHTML);
    }
    
    // Add mobile styles
    this.addMobileStyles();
    
    // Initialize functionality
    this.initializeMobileMenu();
    this.addScrollBehavior();
  }
  
  // Initialize the navigation
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.inject());
    } else {
      this.inject();
    }
  }
}

// Create and initialize navigation
const axisNav = new AxisThornNavigation();
axisNav.init();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AxisThornNavigation;
} else {
  window.AxisThornNavigation = AxisThornNavigation;
}