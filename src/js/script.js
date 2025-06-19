// Axis Thorn LLC - Main Script Entry Point
// This file imports and initializes all JavaScript modules

// Import notification module separately to make showNotification globally available
import { showNotification } from './js/notification.js';

// Import main initialization module
import { initializeApp } from './js/main.js';

// Make showNotification globally available for inline event handlers
window.showNotification = showNotification;

// The app will auto-initialize from main.js when DOM is ready
// No need to call initializeApp() here as it's handled in main.js