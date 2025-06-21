// Notification Module
export const NotificationModule = {
  show(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
        
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
        
    // Add styles
    notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#2d5016' : type === 'error' ? '#5d1a1a' : '#1a1a1a'};
            color: #e8e8e8;
            padding: 1rem 2rem;
            border-left: 4px solid ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#d4af37'};
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 400px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            border-radius: 2px;
        `;
        
    document.body.appendChild(notification);
        
    // Animate in
    requestAnimationFrame(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    });
        
    // Remove after delay
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
};

// Export convenience function
export function showNotification(message, type = 'info') {
  NotificationModule.show(message, type);
}

export default NotificationModule;