#!/bin/bash

echo "Fixing JavaScript errors..."

# Fix main.js
echo "Fixing main.js..."
cat > public/js/main.js << 'EOF'
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
EOF

# Fix dashboard.js
echo "Fixing dashboard.js..."
cat > public/js/dashboard.js << 'EOF'
// Dashboard functionality
async function loadDashboardStats() {
  try {
    // Load clients count
    const clientsResponse = await fetch('/api/clients');
    const clients = await clientsResponse.json();
    document.getElementById('total-clients').textContent = clients.length || 0;
    
    // Load products count
    const productsResponse = await fetch('/api/products');
    const products = await productsResponse.json();
    document.getElementById('total-products').textContent = products.length || 0;
    
    // Load recent transactions
    const transactionsResponse = await fetch('/api/transactions');
    const transactions = await transactionsResponse.json();
    const recentTransactions = transactions.filter(t => {
      const date = new Date(t.created_at || t.createdAt);
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      return date >= sevenDaysAgo;
    });
    document.getElementById('recent-transactions').textContent = recentTransactions.length || 0;
    
    // Populate recent activity
    populateRecentActivity(transactions);
    
    // Populate low stock items
    populateLowStockItems(products);
    
    // Initialize view all buttons
    initializeViewAllButtons();
    
  } catch (error) {
    console.error('Error loading dashboard stats:', error);
    document.getElementById('total-clients').textContent = '0';
    document.getElementById('total-products').textContent = '0';
    document.getElementById('recent-transactions').textContent = '0';
    document.getElementById('recent-activity-list').innerHTML = '<p class="loading-message" style="color: #b91c1c;">Error loading data</p>';
    document.getElementById('low-stock-list').innerHTML = '<p class="loading-message" style="color: #b91c1c;">Error loading data</p>';
  }
}

function populateRecentActivity(transactions) {
  const activityList = document.getElementById('recent-activity-list');
  
  if (!transactions || transactions.length === 0) {
    activityList.innerHTML = '<p class="loading-message">No recent activity</p>';
    return;
  }
  
  activityList.innerHTML = '';
  const recentFive = transactions.slice(0, 5);
  
  recentFive.forEach(transaction => {
    const date = new Date(transaction.created_at || transaction.createdAt);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const isInbound = transaction.type === 'inbound';
    const icon = isInbound ? '📥' : '📤';
    
    const item = document.createElement('div');
    item.style.borderBottom = '1px solid #e2e8f0';
    item.style.paddingBottom = '12px';
    item.style.marginBottom = '12px';
    item.innerHTML = `
      <div style="display: flex; align-items: flex-start;">
        <div style="margin-right: 12px; font-size: 18px;">${icon}</div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <span style="font-weight: 500; color: ${isInbound ? 'var(--color-secondary)' : 'var(--color-accent)'};">
              ${isInbound ? 'Received' : 'Shipped'} ${transaction.quantity} units
            </span>
            <span style="font-size: 12px; color: var(--color-neutral-dark);">${formattedDate}, ${formattedTime}</span>
          </div>
          <p style="font-size: 14px; margin-top: 4px;">Product ID: ${transaction.product_id || transaction.productId}</p>
          ${transaction.reference ? `<p style="font-size: 12px; color: var(--color-neutral-dark); margin-top: 4px;">Ref: ${transaction.reference}</p>` : ''}
        </div>
      </div>
    `;
    
    activityList.appendChild(item);
  });
}

function populateLowStockItems(products) {
  const lowStockList = document.getElementById('low-stock-list');
  
  if (!products || products.length === 0) {
    lowStockList.innerHTML = '<p class="loading-message">No products found</p>';
    return;
  }
  
  const lowStockItems = products.filter(p => p.quantity <= 10);
  
  if (lowStockItems.length === 0) {
    lowStockList.innerHTML = '<p class="loading-message">All products well-stocked</p>';
    return;
  }
  
  lowStockList.innerHTML = '';
  lowStockItems.slice(0, 5).forEach(product => {
    const item = document.createElement('div');
    item.style.borderBottom = '1px solid #e2e8f0';
    item.style.paddingBottom = '12px';
    item.style.marginBottom = '12px';
    
    let statusClass = 'var(--color-secondary)';
    let statusText = 'In Stock';
    
    if (product.quantity <= 0) {
      statusClass = '#b91c1c';
      statusText = 'Out of Stock';
    } else if (product.quantity <= 5) {
      statusClass = 'var(--color-accent)';
      statusText = 'Critical Low';
    } else if (product.quantity <= 10) {
      statusClass = 'var(--color-accent)';
      statusText = 'Low Stock';
    }
    
    item.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <span style="font-weight: 500;">${product.name}</span>
        <span style="font-size: 14px; color: ${statusClass};">${statusText}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 4px;">
        <span style="font-size: 14px;">SKU: ${product.sku}</span>
        <span style="font-size: 14px; font-weight: 500;">${product.quantity} units</span>
      </div>
    `;
    
    lowStockList.appendChild(item);
  });
}

function initializeViewAllButtons() {
  document.getElementById('view-all-activity').addEventListener('click', () => {
    window.app.switchTab('transactions');
  });
  
  document.getElementById('view-all-inventory').addEventListener('click', () => {
    window.app.switchTab('products');
  });
}
EOF

# Fix index.html to remove any problematic references
echo "Updating index.html..."
sed -i '' 's/<script src="\/js\/notifications.js"><\/script>//g' public/index.html || true

echo "JavaScript errors fixed. Please restart your server with 'npm run dev'"