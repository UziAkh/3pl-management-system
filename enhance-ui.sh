#!/bin/bash

echo "Applying UI enhancements to the 3PL Management System..."

# Update main.css with Google Fonts and enhanced styles
echo "Updating main.css..."
sed -i '' '1i\
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
' public/css/main.css

# Update the root variables in main.css
sed -i '' 's/:root {/:root {\
  \/* Base colors *\//g' public/css/main.css

# Add new variables to :root
sed -i '' '/:root {/,/}/c\
:root {\
  /* Base colors */\
  --color-primary: #1e3a8a;\
  --color-primary-light: #2d4eaa;\
  --color-primary-dark: #152a66;\
  \
  --color-secondary: #0d9488;\
  --color-secondary-light: #14b8a6;\
  --color-secondary-dark: #0f766e;\
  \
  --color-accent: #f97316;\
  --color-accent-light: #fb923c;\
  --color-accent-dark: #ea580c;\
  \
  --color-neutral-light: #f8fafc;\
  --color-neutral: #e2e8f0;\
  --color-neutral-dark: #64748b;\
  \
  /* Gradients */\
  --gradient-primary: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);\
  --gradient-secondary: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-light) 100%);\
  --gradient-accent: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%);\
  \
  /* Shadows */\
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);\
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);\
  \
  /* Border radius */\
  --border-radius-sm: 0.25rem;\
  --border-radius-md: 0.375rem;\
  --border-radius-lg: 0.5rem;\
  --border-radius-xl: 0.75rem;\
  \
  /* Transitions */\
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);\
  --transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);\
  --transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);\
}' public/css/main.css

# Update body font in main.css
sed -i '' 's/font-family: Arial, sans-serif;/font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;\
  -webkit-font-smoothing: antialiased;\
  -moz-osx-font-smoothing: grayscale;/g' public/css/main.css

# Update sidebar in main.css
sed -i '' 's/\.sidebar {/\.sidebar {\
  background: var(--gradient-primary);\
  box-shadow: var(--shadow-lg);\
  position: relative;\
  z-index: 10;/g' public/css/main.css

# Update buttons in main.css
sed -i '' '/\.btn {/,/}/c\
.btn {\
  background-color: var(--color-primary);\
  color: white;\
  border: none;\
  border-radius: var(--border-radius-md);\
  padding: 8px 16px;\
  font-size: 14px;\
  font-weight: 500;\
  cursor: pointer;\
  display: inline-flex;\
  align-items: center;\
  justify-content: center;\
  transition: all var(--transition-fast);\
  box-shadow: var(--shadow-sm);\
}\
\
.btn:hover {\
  transform: translateY(-1px);\
  box-shadow: var(--shadow-md);\
}' public/css/main.css

# Update button variations in main.css
sed -i '' '/\.btn-primary {/,/}/c\
.btn-primary {\
  background: var(--gradient-primary);\
  color: white;\
}\
\
.btn-primary:hover {\
  background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%);\
}' public/css/main.css

sed -i '' '/\.btn-secondary {/,/}/c\
.btn-secondary {\
  background: var(--gradient-secondary);\
  color: white;\
}\
\
.btn-secondary:hover {\
  background: linear-gradient(135deg, var(--color-secondary-dark) 0%, var(--color-secondary) 100%);\
}' public/css/main.css

sed -i '' '/\.btn-accent {/,/}/c\
.btn-accent {\
  background: var(--gradient-accent);\
  color: white;\
}\
\
.btn-accent:hover {\
  background: linear-gradient(135deg, var(--color-accent-dark) 0%, var(--color-accent) 100%);\
}' public/css/main.css

# Update cards in main.css
sed -i '' '/\.card {/,/}/c\
.card {\
  background-color: white;\
  border-radius: var(--border-radius-lg);\
  box-shadow: var(--shadow-md);\
  margin-bottom: 20px;\
  overflow: hidden;\
  transition: box-shadow var(--transition-normal), transform var(--transition-normal);\
  border: 1px solid rgba(226, 232, 240, 0.8);\
}\
\
.card:hover {\
  box-shadow: var(--shadow-lg);\
  transform: translateY(-2px);\
}' public/css/main.css

# Update navigation links in main.css
sed -i '' '/\.nav-link {/,/}/c\
.nav-link {\
  display: flex;\
  align-items: center;\
  padding: 12px 20px;\
  color: white;\
  text-decoration: none;\
  transition: all var(--transition-normal);\
  position: relative;\
  overflow: hidden;\
}\
\
.nav-link:before {\
  content: "";\
  position: absolute;\
  top: 0;\
  left: -100%;\
  width: 100%;\
  height: 100%;\
  background-color: rgba(255, 255, 255, 0.1);\
  transition: transform var(--transition-normal);\
}\
\
.nav-link:hover:before {\
  transform: translateX(100%);\
}' public/css/main.css

sed -i '' '/\.nav-link.active {/,/}/c\
.nav-link.active {\
  background-color: var(--color-primary-dark);\
  border-left: 4px solid var(--color-accent);\
  padding-left: calc(1rem - 4px);\
}' public/css/main.css

sed -i '' '/\.nav-icon {/,/}/c\
.nav-icon {\
  margin-right: 12px;\
  font-size: 18px;\
  transition: transform var(--transition-fast);\
}\
\
.nav-link:hover .nav-icon {\
  transform: scale(1.2);\
}' public/css/main.css

# Update dashboard stats cards
echo "Updating dashboard.css..."
sed -i '' '/\.stat-card {/,/}/c\
.stat-card {\
  background-color: white;\
  border-radius: var(--border-radius-lg);\
  box-shadow: var(--shadow-md);\
  padding: 20px;\
  transition: all var(--transition-normal);\
  border: 1px solid rgba(226, 232, 240, 0.8);\
  height: 100%;\
  display: flex;\
  flex-direction: column;\
}\
\
.stat-card:hover {\
  box-shadow: var(--shadow-lg);\
  transform: translateY(-2px);\
}' public/css/dashboard.css

# Create the notifications.js file
echo "Creating notifications.js..."
cat > public/js/notifications.js << 'EOF'
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
EOF

# Update the showNotification function in main.js
echo "Updating main.js..."
sed -i '' '/function showNotification/,/}/c\
function showNotification(message, type = "info") {\
  if (window.notifications) {\
    return window.notifications.show(message, type);\
  } else {\
    // Fallback to alert if the notification system is not loaded\
    alert(message);\
  }\
}' public/js/main.js

# Update index.html to include notifications.js
echo "Updating index.html..."
sed -i '' 's/<!-- JavaScript Files -->/<!-- JavaScript Files -->\
  <script src="\/js\/notifications.js"><\/script>/g' public/index.html

echo "UI enhancements applied successfully!"
echo "Make the script executable with: chmod +x apply-ui-enhancements.sh"
echo "Then run it with: ./apply-ui-enhancements.sh"