// Global Error Handler
(function() {
    'use strict';

    // Error display container
    let errorContainer = null;
    let successContainer = null;

    // Initialize error handling
    function init() {
        createContainers();
        setupGlobalErrorHandlers();
    }

    // Create message containers
    function createContainers() {
        // Error container
        errorContainer = document.createElement('div');
        errorContainer.id = 'error-container';
        errorContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;
        document.body.appendChild(errorContainer);

        // Success container
        successContainer = document.createElement('div');
        successContainer.id = 'success-container';
        successContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;
        document.body.appendChild(successContainer);
    }

    // Setup global error handlers
    function setupGlobalErrorHandlers() {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            showError('An unexpected error occurred. Please try again.');
            event.preventDefault();
        });

        // Handle global errors
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            // Only show user-friendly message for runtime errors
            if (!event.filename || event.filename.includes(window.location.origin)) {
                showError('An unexpected error occurred. Please refresh the page.');
            }
        });
    }

    // Show error message
    function showError(message, duration = 5000) {
        const errorElement = createMessageElement(message, 'error');
        errorContainer.appendChild(errorElement);
        
        // Auto-remove after duration
        setTimeout(() => {
            removeMessage(errorElement);
        }, duration);
    }

    // Show success message
    function showSuccess(message, duration = 3000) {
        const successElement = createMessageElement(message, 'success');
        successContainer.appendChild(successElement);
        
        // Auto-remove after duration
        setTimeout(() => {
            removeMessage(successElement);
        }, duration);
    }

    // Show warning message
    function showWarning(message, duration = 4000) {
        const warningElement = createMessageElement(message, 'warning');
        errorContainer.appendChild(warningElement);
        
        // Auto-remove after duration
        setTimeout(() => {
            removeMessage(warningElement);
        }, duration);
    }

    // Create message element
    function createMessageElement(message, type) {
        const element = document.createElement('div');
        element.className = `message-toast ${type}`;
        
        const colors = {
            error: '#ef4444',
            success: '#10b981',
            warning: '#f59e0b'
        };

        element.style.cssText = `
            background: ${colors[type]};
            color: white;
            padding: 16px 20px;
            margin-bottom: 10px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            animation: slideIn 0.3s ease-out;
            font-family: Inter, sans-serif;
            font-size: 14px;
            line-height: 1.5;
        `;

        const messageText = document.createElement('span');
        messageText.textContent = message;
        element.appendChild(messageText);

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            margin-left: 16px;
            padding: 0;
            line-height: 1;
            opacity: 0.8;
            transition: opacity 0.2s;
        `;
        closeButton.onmouseover = () => closeButton.style.opacity = '1';
        closeButton.onmouseout = () => closeButton.style.opacity = '0.8';
        closeButton.onclick = () => removeMessage(element);
        element.appendChild(closeButton);

        return element;
    }

    // Remove message with animation
    function removeMessage(element) {
        element.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 300);
    }

    // Handle API errors
    function handleApiError(error, customMessage) {
        if (error.response) {
            // Server responded with error
            const status = error.response.status;
            const data = error.response.data || {};
            
            switch (status) {
                case 400:
                    showError(data.error || customMessage || 'Invalid request. Please check your input.');
                    break;
                case 401:
                    showError('Please log in to continue.');
                    // Redirect to login if needed
                    if (window.location.pathname !== '/login.html') {
                        setTimeout(() => {
                            window.location.href = '/login.html';
                        }, 2000);
                    }
                    break;
                case 403:
                    showError('You do not have permission to perform this action.');
                    break;
                case 404:
                    showError(customMessage || 'The requested resource was not found.');
                    break;
                case 429:
                    showError('Too many requests. Please slow down and try again.');
                    break;
                case 500:
                case 502:
                case 503:
                    showError('Server error. Please try again later.');
                    break;
                default:
                    showError(customMessage || 'An error occurred. Please try again.');
            }
        } else if (error.request) {
            // Request made but no response
            showError('Network error. Please check your connection.');
        } else {
            // Something else happened
            showError(customMessage || 'An unexpected error occurred.');
        }
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export global API
    window.ErrorHandler = {
        showError,
        showSuccess,
        showWarning,
        handleApiError
    };
})();