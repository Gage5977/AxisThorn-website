// Main Application Module
import Navigation from './navigation.js';
import AnimationModule from './animation.js';
import FormModule from './form.js';
import VisualEffects from './visual-effects.js';
import AdminServices from './admin-services.js';
import MobileModule from './mobile.js';
import PerformanceModule from './performance.js';

// Initialize all modules when DOM is ready
export function initializeApp() {
    // Initialize all modules
    Navigation.init();
    AnimationModule.init();
    FormModule.init();
    VisualEffects.init();
    AdminServices.init();
    MobileModule.init();
    
    // Optimize scroll performance
    PerformanceModule.optimizeScrollPerformance();
    
    // Track page load
    if (typeof trackEvent === 'function') {
        trackEvent('page_load', 'engagement', document.title);
    }
}

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM is already loaded
    initializeApp();
}