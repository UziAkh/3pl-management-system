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
  initializeProductSection();
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
