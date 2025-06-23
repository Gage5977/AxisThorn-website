// Feature Status Handler - Shows honest status messages for non-functional features
(function() {
    'use strict';

    // Feature status configuration
    const featureStatus = {
        payment: {
            status: 'development',
            message: 'Payment processing is currently being integrated. Please contact AI.info@axisthorn.com for payment arrangements.',
            eta: 'Coming Soon'
        },
        auth: {
            status: 'development',
            message: 'User authentication system is under development. Client portal access coming soon.',
            eta: 'Q1 2025'
        },
        dashboard: {
            status: 'development',
            message: 'Client dashboard is being built. Your documents and invoices will be accessible here soon.',
            eta: 'Q1 2025'
        },
        documents: {
            status: 'development',
            message: 'Document management system is in progress. Please email documents to AI.info@axisthorn.com.',
            eta: 'Coming Soon'
        },
        admin: {
            status: 'development',
            message: 'Admin dashboard requires database configuration. Internal use only.',
            eta: 'Internal'
        }
    };

    // Show status modal
    function showFeatureStatus(feature) {
        const status = featureStatus[feature] || {
            status: 'unknown',
            message: 'This feature is currently unavailable.',
            eta: 'TBD'
        };

        // Remove existing modal if any
        const existingModal = document.getElementById('feature-status-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'feature-status-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: var(--axis-neutral-900);
            border: 1px solid var(--axis-neutral-800);
            border-radius: 16px;
            padding: var(--space-8);
            max-width: 500px;
            width: 90%;
            text-align: center;
            position: relative;
        `;

        content.innerHTML = `
            <button onclick="this.closest('#feature-status-modal').remove()" style="
                position: absolute;
                top: var(--space-4);
                right: var(--space-4);
                background: none;
                border: none;
                color: var(--axis-neutral-400);
                font-size: 24px;
                cursor: pointer;
            ">&times;</button>
            
            <div style="
                width: 80px;
                height: 80px;
                margin: 0 auto var(--space-6);
                background: var(--axis-neutral-800);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 40px;
            ">🚧</div>
            
            <h2 style="
                color: var(--axis-accent-primary);
                margin-bottom: var(--space-4);
                font-size: var(--text-2xl);
            ">Feature In Development</h2>
            
            <p style="
                color: var(--axis-neutral-300);
                margin-bottom: var(--space-6);
                line-height: 1.6;
            ">${status.message}</p>
            
            <div style="
                background: var(--axis-neutral-950);
                border: 1px solid var(--axis-neutral-800);
                border-radius: 8px;
                padding: var(--space-4);
                margin-bottom: var(--space-6);
            ">
                <div style="
                    font-size: var(--text-sm);
                    color: var(--axis-neutral-500);
                    margin-bottom: var(--space-2);
                ">Expected Availability</div>
                <div style="
                    font-size: var(--text-lg);
                    color: var(--axis-accent-secondary);
                    font-weight: var(--font-semibold);
                ">${status.eta}</div>
            </div>
            
            <div style="display: flex; gap: var(--space-3); justify-content: center;">
                <button onclick="this.closest('#feature-status-modal').remove()" class="btn-2025">
                    Understood
                </button>
                <a href="mailto:AI.info@axisthorn.com?subject=Feature%20Inquiry%20-%20${feature}" class="btn-2025 btn-primary-2025">
                    Contact Us
                </a>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Add animation
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
        });

        // Close on escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Intercept feature clicks
    function interceptFeatureClicks() {
        // Login/Register buttons
        document.querySelectorAll('a[href="/login.html"], a[href="/register.html"], button[data-auth]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                showFeatureStatus('auth');
            });
        });

        // Payment links
        document.querySelectorAll('a[href*="payment"], a[href*="pay"], button[data-payment]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                showFeatureStatus('payment');
            });
        });

        // Dashboard links
        document.querySelectorAll('a[href*="dashboard"], a[href="/portal"]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                showFeatureStatus('dashboard');
            });
        });

        // Document management
        document.querySelectorAll('button[onclick*="upload"], button[onclick*="document"]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                showFeatureStatus('documents');
            });
        });

        // Admin links
        document.querySelectorAll('a[href*="admin"]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                showFeatureStatus('admin');
            });
        });
    }

    // Add inline status indicators
    function addStatusIndicators() {
        // Find all links to non-functional features
        const featureLinks = document.querySelectorAll(`
            a[href="/login.html"],
            a[href="/dashboard.html"],
            a[href="/portal"],
            a[href="/app"],
            a[href="/axis-ai"],
            a[href="/payment"],
            a[href*="admin"]
        `);

        featureLinks.forEach(link => {
            if (!link.querySelector('.status-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'status-indicator';
                indicator.style.cssText = `
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    background: #f59e0b;
                    border-radius: 50%;
                    margin-left: 6px;
                    vertical-align: middle;
                    animation: pulse 2s infinite;
                `;
                indicator.title = 'Feature in development';
                link.appendChild(indicator);
            }
        });
    }

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
        }
        
        .feature-unavailable {
            position: relative;
            cursor: not-allowed !important;
            opacity: 0.7;
        }
        
        .feature-unavailable::after {
            content: 'Coming Soon';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: #f59e0b;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
        }
        
        .feature-unavailable:hover::after {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            interceptFeatureClicks();
            addStatusIndicators();
        });
    } else {
        interceptFeatureClicks();
        addStatusIndicators();
    }

    // Export for manual use
    window.FeatureStatus = {
        show: showFeatureStatus,
        updateStatus: (feature, status) => {
            featureStatus[feature] = status;
        }
    };
})();