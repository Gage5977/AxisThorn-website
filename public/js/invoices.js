// Invoice Portal Entry Point
import '../css/invoices.css';

// Import shared modules that invoice portal needs
import Navigation from './navigation';
import FormModule from './form';
import { showNotification } from './notification';
import PerformanceModule from './performance';

// Make showNotification globally available for inline event handlers
window.showNotification = showNotification;

// Invoice-specific functionality
export function initializeInvoicePortal() {
    // Initialize shared modules
    Navigation.init();
    FormModule.init();
    
    // Optimize scroll performance
    PerformanceModule.optimizeScrollPerformance();
    
    // Invoice portal initialized
}

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeInvoicePortal);
} else {
    // DOM is already loaded
    initializeInvoicePortal();
}