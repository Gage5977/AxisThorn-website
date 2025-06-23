// Development Notice Banner
(function() {
    'use strict';

    // Check if banner should be shown
    const isDismissed = localStorage.getItem('dev-notice-dismissed');
    const dismissedDate = localStorage.getItem('dev-notice-dismissed-date');
    
    // Show banner again after 7 days
    if (isDismissed && dismissedDate) {
        const daysSinceDismissed = (Date.now() - parseInt(dismissedDate)) / (1000 * 60 * 60 * 24);
        if (daysSinceDismissed < 7) {
            return;
        }
    }

    // Create banner
    function createDevNotice() {
        const banner = document.createElement('div');
        banner.id = 'dev-notice-banner';
        banner.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(90deg, #1a1a1a 0%, #0a0a0a 100%);
            border-top: 2px solid #f59e0b;
            padding: 16px 20px;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            font-family: Inter, -apple-system, sans-serif;
            font-size: 14px;
            color: #e5e5e5;
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
            transform: translateY(100%);
            animation: slideUp 0.3s ease-out forwards;
        `;

        banner.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                gap: 12px;
                flex-wrap: wrap;
                justify-content: center;
                text-align: center;
                max-width: 800px;
            ">
                <span style="
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(245, 158, 11, 0.1);
                    padding: 4px 12px;
                    border-radius: 20px;
                    color: #f59e0b;
                    font-weight: 500;
                    white-space: nowrap;
                ">
                    <span style="font-size: 16px;">🚧</span>
                    Development Preview
                </span>
                
                <span style="color: #999;">
                    This website is currently in development. Some features may not be available yet.
                </span>
                
                <a href="/deployment-status.html" style="
                    color: #0066ff;
                    text-decoration: none;
                    white-space: nowrap;
                    font-weight: 500;
                    border-bottom: 1px solid transparent;
                    transition: border-color 0.2s;
                " onmouseover="this.style.borderBottomColor='#0066ff'" onmouseout="this.style.borderBottomColor='transparent'">
                    View Status →
                </a>
            </div>
            
            <button id="dismiss-dev-notice" style="
                background: none;
                border: 1px solid #333;
                color: #666;
                padding: 6px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
                white-space: nowrap;
            " onmouseover="this.style.borderColor='#666'; this.style.color='#999';" onmouseout="this.style.borderColor='#333'; this.style.color='#666';">
                Dismiss
            </button>
        `;

        document.body.appendChild(banner);

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideUp {
                to { transform: translateY(0); }
            }
            
            @media (max-width: 768px) {
                #dev-notice-banner {
                    padding: 12px 16px !important;
                    font-size: 13px !important;
                }
                
                #dev-notice-banner > div {
                    flex-direction: column;
                    gap: 8px !important;
                }
            }
        `;
        document.head.appendChild(style);

        // Dismiss handler
        document.getElementById('dismiss-dev-notice').addEventListener('click', () => {
            banner.style.animation = 'slideUp 0.3s ease-in reverse';
            setTimeout(() => {
                banner.remove();
                localStorage.setItem('dev-notice-dismissed', 'true');
                localStorage.setItem('dev-notice-dismissed-date', Date.now().toString());
            }, 300);
        });
    }

    // Create notice on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createDevNotice);
    } else {
        createDevNotice();
    }

    // Export for manual control
    window.DevNotice = {
        show: createDevNotice,
        hide: () => {
            const banner = document.getElementById('dev-notice-banner');
            if (banner) banner.remove();
        },
        reset: () => {
            localStorage.removeItem('dev-notice-dismissed');
            localStorage.removeItem('dev-notice-dismissed-date');
        }
    };
})();