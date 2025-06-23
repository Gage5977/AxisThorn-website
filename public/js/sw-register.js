// Service Worker Registration
(function() {
    'use strict';

    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
        console.log('Service Workers not supported');
        return;
    }

    // Register service worker
    async function registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            console.log('Service Worker registered with scope:', registration.scope);

            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('Service Worker update found');

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New content available
                        showUpdateNotification();
                    }
                });
            });

            // Check for updates periodically
            setInterval(() => {
                registration.update();
            }, 60000); // Check every minute

        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }

    // Show update notification
    function showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'sw-update-notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--axis-accent-primary, #0066FF);
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 10000;
            animation: slideUp 0.3s ease-out;
        `;

        notification.innerHTML = `
            <span>New version available!</span>
            <button onclick="window.location.reload()" style="
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 4px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            ">Refresh</button>
        `;

        document.body.appendChild(notification);

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideUp {
                from {
                    transform: translateY(100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Handle offline/online events
    function setupNetworkHandling() {
        let isOffline = !navigator.onLine;
        
        // Show offline indicator
        function updateNetworkStatus() {
            if (isOffline && navigator.onLine) {
                // Back online
                isOffline = false;
                hideOfflineIndicator();
                if (window.ErrorHandler) {
                    window.ErrorHandler.showSuccess('You are back online');
                }
            } else if (!isOffline && !navigator.onLine) {
                // Gone offline
                isOffline = true;
                showOfflineIndicator();
                if (window.ErrorHandler) {
                    window.ErrorHandler.showWarning('You are currently offline');
                }
            }
        }

        window.addEventListener('online', updateNetworkStatus);
        window.addEventListener('offline', updateNetworkStatus);

        // Initial check
        if (!navigator.onLine) {
            isOffline = true;
            showOfflineIndicator();
        }
    }

    // Show offline indicator
    function showOfflineIndicator() {
        let indicator = document.getElementById('offline-indicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'offline-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: #f59e0b;
                color: white;
                text-align: center;
                padding: 8px;
                font-size: 14px;
                z-index: 10001;
                font-family: Inter, sans-serif;
            `;
            indicator.textContent = 'You are currently offline. Some features may be limited.';
            document.body.appendChild(indicator);
        }
    }

    // Hide offline indicator
    function hideOfflineIndicator() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            registerServiceWorker();
            setupNetworkHandling();
        });
    } else {
        registerServiceWorker();
        setupNetworkHandling();
    }

    // Export for manual control
    window.ServiceWorkerManager = {
        update: async () => {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
                registration.update();
            }
        },
        unregister: async () => {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
                registration.unregister();
            }
        }
    };
})();