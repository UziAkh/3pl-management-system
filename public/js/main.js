// Global utility functions and event handlers
let currentTab = 'dashboard';

// Navigation functionality
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMobileMenu();
  initNewTransactionButton();
  
  // Initialize all sections
  loadDashboardStats();
  initializeClientSection();
  // initializeProducts();
  initializeTransactionSection();
  initializeHealthSection();
});

// Initialize navigation
function initNavigation() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      // Update active link
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // Update header title
      currentTab = link.dataset.tab;
      document.querySelector('.header-title').textContent = link.textContent.trim();
      
      // Show active tab
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
      document.getElementById(`${currentTab}-tab`).classList.add('active');
      
      // Close mobile menu if open
      document.getElementById('mobile-sidebar').style.display = 'none';
    });
  });
}

// Initialize mobile menu
function initMobileMenu() {
  document.querySelector('.mobile-menu-btn').addEventListener('click', () => {
    document.getElementById('mobile-sidebar').style.display = 'block';
  });
  
  document.getElementById('close-mobile-menu').addEventListener('click', () => {
    document.getElementById('mobile-sidebar').style.display = 'none';
  });
}

// Initialize new transaction button
function initNewTransactionButton() {
  document.getElementById('new-transaction-btn').addEventListener('click', () => {
    document.querySelector('.nav-link[data-tab="transactions"]').click();
  });
}

// Helper function for notifications
function showNotification(message, type = 'info') {
  // You can replace this with a proper notification system later
  alert(message);
}

// Export functions for other modules
window.app = {
  showNotification,
  currentTab,
  switchTab: (tab) => {
    document.querySelector(`.nav-link[data-tab="${tab}"]`).click();
  }
};

// Notification functions
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  const messageElement = document.getElementById('notification-message');
  const closeButton = document.getElementById('notification-close');
  
  // Set the message
  messageElement.textContent = message;
  
  // Remove existing type classes and add the new one
  notification.classList.remove('success', 'error', 'hidden');
  notification.classList.add(type);
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    hideNotification();
  }, 5000);
}

function hideNotification() {
  const notification = document.getElementById('notification');
  notification.classList.add('hidden');
}

// Add click event to close button when page loads
document.addEventListener('DOMContentLoaded', function() {
  const closeButton = document.getElementById('notification-close');
  if (closeButton) {
    closeButton.addEventListener('click', hideNotification);
  }
});