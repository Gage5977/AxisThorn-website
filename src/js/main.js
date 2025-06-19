// Main Application Module - Entry point for main website
import '../css/styles.css';

// Import modules
import Navigation from './navigation';
import AnimationModule from './animation';
import FormModule from './form';
import VisualEffects from './visual-effects';
import AdminServices from './admin-services';
import MobileModule from './mobile';
import PerformanceModule from './performance';
import { showNotification } from './notification';

// Make showNotification globally available for inline event handlers
window.showNotification = showNotification;

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