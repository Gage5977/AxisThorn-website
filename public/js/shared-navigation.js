// Shared navigation component for consistent branding across all pages
function createStandardNavigation() {
  const navigationHTML = `
    <nav class="navigation" role="navigation" aria-label="Main navigation">
      <div class="nav-container">
        <a href="/" class="logo" aria-label="Axis Thorn home">
          <img src="/logo.svg" alt="Axis Thorn LLC logo" class="logo-img" width="40" height="40">
          <span class="logo-text">Axis Thorn</span>
        </a>
        <button class="mobile-menu-toggle" aria-label="Toggle menu" aria-expanded="false">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
        </button>
        <ul class="nav-menu" role="menubar">
          <li role="none"><a href="/#overview" class="nav-link" role="menuitem">Overview</a></li>
          <li role="none"><a href="/#services" class="nav-link" role="menuitem">Services</a></li>
          <li role="none"><a href="/banking-portal" class="nav-link" role="menuitem">Banking</a></li>
          <li role="none"><a href="/invoices" class="nav-link" role="menuitem">Client Portal</a></li>
          <li role="none"><a href="/axis-ai" class="nav-link" role="menuitem">Axis AI</a></li>
          <li role="none"><a href="/#contact" class="nav-link" role="menuitem">Contact</a></li>
        </ul>
      </div>
    </nav>
  `;
  
  return navigationHTML;
}

// Function to replace existing navigation with standard navigation
function standardizeNavigation() {
  const existingNav = document.querySelector('nav.navigation');
  if (existingNav) {
    const newNav = document.createElement('div');
    newNav.innerHTML = createStandardNavigation();
    existingNav.parentNode.replaceChild(newNav.firstElementChild, existingNav);
    
    // Re-initialize mobile menu if needed
    if (typeof initMobileMenu === 'function') {
      initMobileMenu();
    }
  }
}

// Auto-initialize on pages that include this script
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', standardizeNavigation);
} else {
  standardizeNavigation();
}