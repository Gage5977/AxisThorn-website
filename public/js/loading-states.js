// Loading States Manager
(function() {
    'use strict';

    // Loading overlay element
    let loadingOverlay = null;
    let activeLoadings = 0;

    // Initialize loading states
    function init() {
        createLoadingOverlay();
        setupButtonLoadingStates();
    }

    // Create loading overlay
    function createLoadingOverlay() {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(4px);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;

        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.style.cssText = `
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255, 255, 255, 0.2);
            border-top-color: #0066FF;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        `;

        loadingOverlay.appendChild(spinner);
        document.body.appendChild(loadingOverlay);

        // Add spinner animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            .btn-loading {
                position: relative;
                color: transparent !important;
                pointer-events: none;
            }
            
            .btn-loading::after {
                content: '';
                position: absolute;
                width: 16px;
                height: 16px;
                top: 50%;
                left: 50%;
                margin-left: -8px;
                margin-top: -8px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top-color: white;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            }
            
            .skeleton {
                animation: skeleton-loading 1.5s infinite ease-in-out;
                background: linear-gradient(
                    90deg,
                    rgba(255, 255, 255, 0.05) 0%,
                    rgba(255, 255, 255, 0.1) 50%,
                    rgba(255, 255, 255, 0.05) 100%
                );
                background-size: 200% 100%;
            }
            
            @keyframes skeleton-loading {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Show loading overlay
    function showLoading() {
        activeLoadings++;
        if (activeLoadings === 1) {
            loadingOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    // Hide loading overlay
    function hideLoading() {
        activeLoadings = Math.max(0, activeLoadings - 1);
        if (activeLoadings === 0) {
            loadingOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    // Add loading state to button
    function setButtonLoading(button, loading = true) {
        if (!button) return;

        if (loading) {
            button.disabled = true;
            button.classList.add('btn-loading');
            button.dataset.originalText = button.textContent;
        } else {
            button.disabled = false;
            button.classList.remove('btn-loading');
            if (button.dataset.originalText) {
                button.textContent = button.dataset.originalText;
                delete button.dataset.originalText;
            }
        }
    }

    // Setup automatic button loading states
    function setupButtonLoadingStates() {
        // Add loading state to forms
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.tagName !== 'FORM') return;

            const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
            if (submitButton && !form.dataset.noLoading) {
                setButtonLoading(submitButton, true);

                // Reset on page unload or after timeout
                const resetLoading = () => setButtonLoading(submitButton, false);
                window.addEventListener('pagehide', resetLoading);
                setTimeout(resetLoading, 30000); // 30 second timeout
            }
        });
    }

    // Create skeleton loader
    function createSkeleton(type = 'text', options = {}) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton';
        
        const defaults = {
            text: { height: '20px', width: '100%', borderRadius: '4px' },
            title: { height: '32px', width: '60%', borderRadius: '4px' },
            avatar: { height: '48px', width: '48px', borderRadius: '50%' },
            image: { height: '200px', width: '100%', borderRadius: '8px' },
            card: { height: '150px', width: '100%', borderRadius: '12px' }
        };

        const config = { ...defaults[type], ...options };
        
        skeleton.style.cssText = `
            background-color: rgba(255, 255, 255, 0.05);
            height: ${config.height};
            width: ${config.width};
            border-radius: ${config.borderRadius};
            margin-bottom: ${config.marginBottom || '8px'};
        `;

        return skeleton;
    }

    // Replace element content with skeleton
    function showSkeleton(container, count = 3, type = 'text') {
        if (!container) return;

        const originalContent = container.innerHTML;
        container.innerHTML = '';
        container.dataset.originalContent = originalContent;

        for (let i = 0; i < count; i++) {
            container.appendChild(createSkeleton(type));
        }

        return () => {
            if (container.dataset.originalContent) {
                container.innerHTML = container.dataset.originalContent;
                delete container.dataset.originalContent;
            }
        };
    }

    // Wrap async function with loading state
    function withLoading(asyncFn) {
        return async function(...args) {
            showLoading();
            try {
                return await asyncFn.apply(this, args);
            } finally {
                hideLoading();
            }
        };
    }

    // Wrap fetch with loading state
    function fetchWithLoading(url, options) {
        showLoading();
        return fetch(url, options)
            .finally(() => hideLoading());
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export global API
    window.LoadingStates = {
        show: showLoading,
        hide: hideLoading,
        setButtonLoading,
        createSkeleton,
        showSkeleton,
        withLoading,
        fetchWithLoading
    };
})();