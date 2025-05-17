// Notification system
(function() {
  // Create the notification container if it doesn't exist
  let notificationContainer = document.getElementById('notification-container');
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    document.body.appendChild(notificationContainer);
    
    // Add styles for the notification container
    const style = document.createElement('style');
    style.textContent = `
      #notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 350px;
      }
      
      .notification {
        padding: 15px;
        border-radius: var(--border-radius-md);
        color: white;
        box-shadow: var(--shadow-md);
        animation: slide-in 0.3s ease forwards;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
      }
      
      .notification.success {
        background: var(--gradient-secondary);
      }
      
      .notification.error {
        background: linear-gradient(135deg, #e11d48 0%, #f43f5e 100%);
      }
      
      .notification.info {
        background: var(--gradient-primary);
      }
      
      .notification.warning {
        background: var(--gradient-accent);
      }
      
      .notification-content {
        margin-right: 10px;
        flex: 1;
      }
      
      .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
        opacity: 0.8;
        padding: 0;
      }
      
      .notification-close:hover {
        opacity: 1;
      }
      
      @keyframes slide-in {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slide-out {
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
  }
  
  // Function to show a notification
  function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
      <div class="notification-content">${message}</div>
      <button class="notification-close">&times;</button>
    `;
    
    notificationContainer.appendChild(notification);
    
    // Add close button event listener
    notification.querySelector('.notification-close').addEventListener('click', () => {
      closeNotification(notification);
    });
    
    // Auto-close after duration
    if (duration > 0) {
      setTimeout(() => {
        closeNotification(notification);
      }, duration);
    }
    
    return notification;
  }
  
  // Function to close a notification
  function closeNotification(notification) {
    notification.style.animation = 'slide-out 0.3s ease forwards';
    
    // Remove the notification after animation completes
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }
  
  // Expose the functions to the global scope
  window.notifications = {
    show: showNotification,
    close: closeNotification
  };
})();
