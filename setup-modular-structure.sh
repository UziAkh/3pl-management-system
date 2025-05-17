#!/bin/bash

echo "Creating modular file structure for 3PL Management System..."

# Create directories if they don't exist
mkdir -p public/css
mkdir -p public/js

# Create CSS files
echo "Creating CSS files..."
cat > public/css/main.css << 'EOF'
:root {
  --color-primary: #1e3a8a;
  --color-primary-light: #2d4eaa;
  --color-primary-dark: #152a66;
  
  --color-secondary: #0d9488;
  --color-secondary-light: #14b8a6;
  --color-secondary-dark: #0f766e;
  
  --color-accent: #f97316;
  --color-accent-light: #fb923c;
  --color-accent-dark: #ea580c;
  
  --color-neutral-light: #f8fafc;
  --color-neutral: #e2e8f0;
  --color-neutral-dark: #64748b;
}

body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: var(--color-neutral-light);
  color: #333;
}

.container {
  display: flex;
  height: 100vh;
}

/* Sidebar styles */
.sidebar {
  width: 250px;
  background-color: var(--color-primary);
  color: white;
  padding: 20px 0;
}

.sidebar-header {
  padding: 0 20px 20px;
  border-bottom: 1px solid var(--color-primary-light);
}

.sidebar-title {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.sidebar-nav {
  margin-top: 30px;
}

.nav-section {
  margin-bottom: 30px;
}

.nav-label {
  padding: 0 20px;
  font-size: 12px;
  text-transform: uppercase;
  color: var(--color-primary-light);
  margin-bottom: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: white;
  text-decoration: none;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  background-color: var(--color-primary-dark);
  border-left: 4px solid var(--color-accent);
  padding-left: 16px;
}

.nav-icon {
  margin-right: 12px;
  font-size: 18px;
}

/* Main content area styles */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
}

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

/* Button styles */
.btn {
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.btn-icon {
  margin-right: 8px;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

.btn-secondary {
  background-color: var(--color-secondary);
  color: white;
}

.btn-secondary:hover {
  background-color: var(--color-secondary-dark);
}

.btn-accent {
  background-color: var(--color-accent);
  color: white;
}

.btn-accent:hover {
  background-color: var(--color-accent-dark);
}

/* Card and form styles */
.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid var(--color-neutral);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
}

.card-content {
  padding: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-group {
  flex: 1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* Section header styles */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
}

/* Tab content styles */
.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}

/* Mobile menu button */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: var(--color-neutral-dark);
  font-size: 24px;
  cursor: pointer;
  margin-right: 10px;
}

/* Utility classes */
.mb-4 {
  margin-bottom: 20px;
}

.loading-message {
  text-align: center;
  color: var(--color-neutral-dark);
  padding: 20px;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .form-row {
    flex-direction: column;
    gap: 10px;
  }
}
EOF

cat > public/css/dashboard.css << 'EOF'
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.stat-label {
  font-size: 14px;
  color: var(--color-neutral-dark);
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--color-primary);
  margin: 0;
}

.stat-description {
  font-size: 14px;
  color: var(--color-neutral-dark);
  margin-top: 10px;
}

.dashboard-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.panel {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
}

.view-all {
  font-size: 14px;
  color: var(--color-secondary);
  text-decoration: none;
}

@media (max-width: 768px) {
  .dashboard-stats {
    grid-template-columns: 1fr;
  }
  
  .dashboard-panels {
    grid-template-columns: 1fr;
  }
}
EOF

cat > public/css/clients.css << 'EOF'
.client-card {
  border: 1px solid var(--color-neutral);
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
}

.client-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.client-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.client-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.client-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 5px 0;
}

.client-code {
  font-size: 14px;
  color: var(--color-neutral-dark);
}

.info-label {
  font-size: 13px;
  color: var(--color-neutral-dark);
  margin-bottom: 3px;
}

.info-value {
  font-size: 15px;
  margin: 0;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
}

.status-active {
  background-color: rgba(13, 148, 136, 0.15);
  color: var(--color-secondary-dark);
}

.status-inactive {
  background-color: rgba(239, 68, 68, 0.15);
  color: #b91c1c;
}

@media (max-width: 768px) {
  .client-info {
    grid-template-columns: 1fr;
  }
}
EOF

cat > public/css/products.css << 'EOF'
.product-card {
  border: 1px solid var(--color-neutral);
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.product-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.product-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 5px 0;
}

.product-sku {
  font-size: 14px;
  color: var(--color-neutral-dark);
}

.product-description {
  grid-column: span 3;
  margin-bottom: 15px;
}

.quantity-badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
}

.quantity-in-stock {
  background-color: rgba(13, 148, 136, 0.15);
  color: var(--color-secondary-dark);
}

.quantity-low-stock {
  background-color: rgba(249, 115, 22, 0.15);
  color: var(--color-accent-dark);
}

.quantity-out-of-stock {
  background-color: rgba(239, 68, 68, 0.15);
  color: #b91c1c;
}

@media (max-width: 768px) {
  .product-info {
    grid-template-columns: 1fr;
  }
  
  .product-description {
    grid-column: span 1;
  }
}
EOF

cat > public/css/transactions.css << 'EOF'
.transaction-card {
  border: 1px solid var(--color-neutral);
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
}

.transaction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.transaction-type-badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  text-transform: uppercase;
}

.transaction-inbound {
  background-color: rgba(13, 148, 136, 0.15);
  color: var(--color-secondary-dark);
}

.transaction-outbound {
  background-color: rgba(239, 68, 68, 0.15);
  color: #b91c1c;
}

.transaction-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.quantity-change {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 10px;
  background-color: rgba(226, 232, 240, 0.3);
  border-radius: 6px;
  margin-bottom: 15px;
}

.quantity-item {
  text-align: center;
}

.transaction-timestamp {
  font-size: 13px;
  color: var(--color-neutral-dark);
}
EOF

# Create JavaScript files
echo "Creating JavaScript files..."
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
    const typeClass = isInbound ? 'text-secondary' : 'text-accent';
    
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
cat > public/js/clients.js << 'EOF'
// Clients section functionality
function initializeClientSection() {
  const addClientToggleBtn = document.getElementById('addClientToggleBtn');
  const cancelAddClientBtn = document.getElementById('cancelAddClient');
  const addClientCard = document.getElementById('addClientCard');
  
  // Toggle add client form
  addClientToggleBtn.addEventListener('click', () => {
    addClientCard.style.display = 'block';
    document.getElementById('addClientForm').reset();
  });
  
  cancelAddClientBtn.addEventListener('click', () => {
    addClientCard.style.display = 'none';
  });
  
  // Load clients button
  document.getElementById('loadClientsBtn').addEventListener('click', loadClients);
  
  // Add client form submission
  document.getElementById('addClientForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newClient = {
      name: document.getElementById('clientName').value,
      code: document.getElementById('clientCode').value,
      contactName: document.getElementById('contactName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      active: document.getElementById('active').value === 'true'
    };
    
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newClient)
      });
      
      if (response.ok) {
        window.app.showNotification('Client added successfully', 'success');
        document.getElementById('addClientForm').reset();
        addClientCard.style.display = 'none';
        loadClients();
        loadDashboardStats();
      } else {
        const error = await response.json();
        window.app.showNotification(`Error: ${error.message}`, 'error');
      }
    } catch (error) {
      window.app.showNotification(`Error: ${error.message}`, 'error');
    }
  });
  
  // Initial load
  loadClients();
}

async function loadClients() {
  const clientsList = document.getElementById('clientsList');
  try {
    clientsList.innerHTML = '<p class="loading-message">Loading clients...</p>';
    
    const response = await fetch('/api/clients');
    const clients = await response.json();
    
    if (clients.length === 0) {
      clientsList.innerHTML = '<p class="loading-message">No clients found.</p>';
      return;
    }
    
    clientsList.innerHTML = '';
    clients.forEach(client => {
      const clientElement = document.createElement('div');
      clientElement.className = 'client-card';
      clientElement.innerHTML = `
        <div class="client-header">
          <div>
            <h3 class="client-name">${client.name}</h3>
            <span class="client-code">${client.code}</span>
          </div>
          <span class="status-badge ${client.active ? 'status-active' : 'status-inactive'}">
            ${client.active ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        <div class="client-info">
          <div>
            <div class="info-label">Contact</div>
            <p class="info-value">${client.contactName || 'N/A'}</p>
          </div>
          <div>
            <div class="info-label">Email</div>
            <p class="info-value">${client.email || 'N/A'}</p>
          </div>
          <div>
            <div class="info-label">Phone</div>
            <p class="info-value">${client.phone || 'N/A'}</p>
          </div>
        </div>
        
        <div class="client-actions">
          <button class="btn btn-secondary edit-client-btn" data-id="${client.id}">Edit</button>
          <button class="btn btn-accent delete-client-btn" data-id="${client.id}">Delete</button>
        </div>
      `;
      clientsList.appendChild(clientElement);
    });
    
    // Add event listeners for edit/delete buttons
    document.querySelectorAll('.edit-client-btn').forEach(btn => {
      btn.addEventListener('click', () => editClient(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-client-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteClient(btn.dataset.id));
    });
    
    // Also update client dropdowns for products section
    updateClientDropdowns(clients);
    
  } catch (error) {
    clientsList.innerHTML = `<p class="loading-message" style="color: #b91c1c;">Error loading clients: ${error.message}</p>`;
  }
}

function updateClientDropdowns(clients) {
  // Update client filter in products tab
  const clientFilter = document.getElementById('clientFilter');
  const productClient = document.getElementById('productClient');
  
  // Clear existing options except the first one
  clientFilter.innerHTML = '<option value="">All Clients</option>';
  productClient.innerHTML = '<option value="">Select a client</option>';
  
  // Add client options
  clients.forEach(client => {
    if (client.active) {
      const filterOption = document.createElement('option');
      filterOption.value = client.id;
      filterOption.textContent = client.name;
      clientFilter.appendChild(filterOption);
      
      const selectOption = document.createElement('option');
      selectOption.value = client.id;
      selectOption.textContent = client.name;
      productClient.appendChild(selectOption);
    }
  });
}

async function editClient(id) {
  try {
    const response = await fetch(`/api/clients/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch client details');
    }
    
    const client = await response.json();
    
    // In a real app, you'd show a modal with a form
    // For simplicity, we'll just use prompt
    const newName = prompt('Enter new client name:', client.name);
    if (newName === null) return;
    
    const updateResponse = await fetch(`/api/clients/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: newName })
    });
    
    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(errorData.message || 'Failed to update client');
    }
    
    window.app.showNotification('Client updated successfully', 'success');
    loadClients();
  } catch (error) {
    window.app.showNotification(`Error: ${error.message}`, 'error');
  }
}

async function deleteClient(id) {
  if (!confirm('Are you sure you want to delete this client?')) return;
  
  try {
    const response = await fetch(`/api/clients/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      window.app.showNotification('Client deleted successfully', 'success');
      loadClients();
      loadDashboardStats(); // Refresh dashboard after deletion
    } else {
      const error = await response.json();
      window.app.showNotification(`Error: ${error.message}`, 'error');
    }
  } catch (error) {
    window.app.showNotification(`Error: ${error.message}`, 'error');
  }
}
EOF

cat > public/js/products.js << 'EOF'
// Products section functionality
function initializeProductSection() {
  const addProductToggleBtn = document.getElementById('addProductToggleBtn');
  const cancelAddProductBtn = document.getElementById('cancelAddProduct');
  const addProductCard = document.getElementById('addProductCard');
  
  // Toggle add product form
  addProductToggleBtn.addEventListener('click', () => {
    addProductCard.style.display = 'block';
    document.getElementById('addProductForm').reset();
  });
  
  cancelAddProductBtn.addEventListener('click', () => {
    addProductCard.style.display = 'none';
  });
  
  // Load products button
  document.getElementById('loadProductsBtn').addEventListener('click', () => {
    loadProducts(document.getElementById('clientFilter').value);
  });
  
  // Client filter change
  document.getElementById('clientFilter').addEventListener('change', function() {
    loadProducts(this.value);
  });
  
  // Add product form submission
  document.getElementById('addProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newProduct = {
      name: document.getElementById('productName').value,
      sku: document.getElementById('productSku').value,
      upc: document.getElementById('productUpc').value,
      clientId: document.getElementById('productClient').value,
      description: document.getElementById('productDescription').value,
      quantity: parseInt(document.getElementById('productQuantity').value) || 0
    };
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
      });
      
      if (response.ok) {
        window.app.showNotification('Product added successfully', 'success');
        document.getElementById('addProductForm').reset();
        addProductCard.style.display = 'none';
        loadProducts(document.getElementById('clientFilter').value);
        loadDashboardStats();
      } else {
        const error = await response.json();
        window.app.showNotification(`Error: ${error.message}`, 'error');
      }
    } catch (error) {
      window.app.showNotification(`Error: ${error.message}`, 'error');
    }
  });
  
  // Initial load
  loadProducts();
}

async function loadProducts(clientId = '') {
  const productsList = document.getElementById('productsList');
  try {
    productsList.innerHTML = '<p class="loading-message">Loading products...</p>';
    
    const url = clientId ? `/api/products?clientId=${clientId}` : '/api/products';
    const response = await fetch(url);
    const products = await response.json();
    
    if (products.length === 0) {
      productsList.innerHTML = '<p class="loading-message">No products found.</p>';
      return;
    }
    
    productsList.innerHTML = '';
    products.forEach(product => {
      // Determine stock status
      let stockStatus = { class: 'quantity-in-stock', text: 'In Stock' };
      if (product.quantity <= 0) {
        stockStatus = { class: 'quantity-out-of-stock', text: 'Out of Stock' };
      } else if (product.quantity <= 10) {
        stockStatus = { class: 'quantity-low-stock', text: 'Low Stock' };
      }
      
      const productElement = document.createElement('div');
      productElement.className = 'product-card';
      productElement.innerHTML = `
        <div class="product-header">
          <div>
            <h3 class="product-name">${product.name}</h3>
            <span class="product-sku">SKU: ${product.sku}</span>
          </div>
          <span class="quantity-badge ${stockStatus.class}">
            ${stockStatus.text}: ${product.quantity} units
          </span>
        </div>
        
        <div class="product-info">
          <div>
            <div class="info-label">UPC</div>
            <p class="info-value">${product.upc || 'N/A'}</p>
          </div>
          <div>
            <div class="info-label">Client ID</div>
            <p class="info-value">${product.clientId}</p>
          </div>
        </div>
        
        ${product.description ? `
          <div class="product-description">
            <div class="info-label">Description</div>
            <p class="info-value">${product.description}</p>
          </div>
        ` : ''}
        
        <div class="client-actions">
          <button class="btn btn-secondary edit-product-btn" data-id="${product.id}">Edit</button>
          <button class="btn btn-accent delete-product-btn" data-id="${product.id}">Delete</button>
        </div>
      `;
      productsList.appendChild(productElement);
    });
    
    // Add event listeners for edit/delete buttons
    document.querySelectorAll('.edit-product-btn').forEach(btn => {
      btn.addEventListener('click', () => editProduct(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-product-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteProduct(btn.dataset.id));
    });
    
    // Update transaction product dropdown
    updateProductDropdown(products);
    
  } catch (error) {
    productsList.innerHTML = `<p class="loading-message" style="color: #b91c1c;">Error loading products: ${error.message}</p>`;
  }
}

function updateProductDropdown(products) {
  const transactionProduct = document.getElementById('transactionProduct');
  
  // Clear existing options except the first one
  transactionProduct.innerHTML = '<option value="">Select a product</option>';
  
  // Add product options
  products.forEach(product => {
    const option = document.createElement('option');
    option.value = product.id;
    option.textContent = `${product.name} (${product.sku}) - ${product.quantity} in stock`;
    transactionProduct.appendChild(option);
  });
}

async function editProduct(id) {
  try {
    const response = await fetch(`/api/products/${id}`);
    const product = await response.json();
    
    // In a real app, you'd show a modal with a form
    // For simplicity, we'll just use prompt
    const newName = prompt('Enter new product name:', product.name);
    if (newName === null) return;
    
    const updateResponse = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: newName })
    });
    
    if (updateResponse.ok) {
      window.app.showNotification('Product updated successfully', 'success');
      loadProducts(document.getElementById('clientFilter').value);
    } else {
      const error = await updateResponse.json();
      window.app.showNotification(`Error: ${error.message}`, 'error');
    }
  } catch (error) {
    window.app.showNotification(`Error: ${error.message}`, 'error');
  }
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      window.app.showNotification('Product deleted successfully', 'success');
      loadProducts(document.getElementById('clientFilter').value);
      loadDashboardStats();
    } else {
      const error = await response.json();
      window.app.showNotification(`Error: ${error.message}`, 'error');
    }
  } catch (error) {
    window.app.showNotification(`Error: ${error.message}`, 'error');
  }
}
EOF

cat > public/js/transactions.js << 'EOF'
// Transactions section functionality
function initializeTransactionSection() {
  // Load transactions button
  document.getElementById('loadTransactionsBtn').addEventListener('click', () => {
    loadTransactions(document.getElementById('transactionFilter').value);
  });
  
  // Transaction filter change
  document.getElementById('transactionFilter').addEventListener('change', function() {
    loadTransactions(this.value);
  });
  
  // Create transaction form
  document.getElementById('createTransactionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const type = document.getElementById('transactionType').value;
    const productId = document.getElementById('transactionProduct').value;
    const quantity = parseInt(document.getElementById('transactionQuantity').value);
    const reference = document.getElementById('transactionReference').value;
    const notes = document.getElementById('transactionNotes').value;
    
    if (!productId || !quantity || quantity < 1) {
      window.app.showNotification('Please select a product and enter a valid quantity', 'error');
      return;
    }
    
    try {
      const response = await fetch(`/api/transactions/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, quantity, reference, notes })
      });
      
      if (response.ok) {
        window.app.showNotification('Transaction created successfully', 'success');
        document.getElementById('transactionQuantity').value = '1';
        document.getElementById('transactionReference').value = '';
        document.getElementById('transactionNotes').value = '';
        loadTransactions(document.getElementById('transactionFilter').value);
        // Reload products to show updated quantities
        loadProducts(document.getElementById('clientFilter').value);
        // Update dashboard
        loadDashboardStats();
      } else {
        const error = await response.json();
        window.app.showNotification(`Error: ${error.message}`, 'error');
      }
    } catch (error) {
      window.app.showNotification(`Error: ${error.message}`, 'error');
    }
  });
  
  // Initial load
  loadTransactions();
}

async function loadTransactions(type = '') {
  const transactionsList = document.getElementById('transactionsList');
  try {
    transactionsList.innerHTML = '<p class="loading-message">Loading transactions...</p>';
    
    const url = type ? `/api/transactions?type=${type}` : '/api/transactions';
    const response = await fetch(url);
    const transactions = await response.json();
    
    if (transactions.length === 0) {
      transactionsList.innerHTML = '<p class="loading-message">No transactions found.</p>';
      return;
    }
    
    transactionsList.innerHTML = '';
    transactions.forEach(transaction => {
      const transactionElement = document.createElement('div');
      transactionElement.className = 'transaction-card';
      
      const date = new Date(transaction.created_at || transaction.createdAt);
      const formattedDate = date.toLocaleDateString();
      const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      transactionElement.innerHTML = `
        <div class="transaction-header">
          <div>
            <span class="transaction-type-badge transaction-${transaction.type}">
              ${transaction.type === 'inbound' ? 'Received' : 'Shipped'}
            </span>
            <span class="transaction-timestamp">${formattedDate}, ${formattedTime}</span>
          </div>
          <h3 style="font-size: 18px; font-weight: 600; margin: 0;">
            ${transaction.quantity} units
          </h3>
        </div>
        
        <div class="transaction-details">
          <div>
            <div class="info-label">Product ID</div>
            <p class="info-value">${transaction.product_id || transaction.productId}</p>
          </div>
          <div>
            <div class="info-label">Reference</div>
            <p class="info-value">${transaction.reference || 'N/A'}</p>
          </div>
        </div>
        
        <div class="quantity-change">
          <div class="quantity-item">
            <div class="info-label">Previous</div>
            <p class="info-value">${transaction.previous_quantity || transaction.previousQuantity}</p>
          </div>
          <div class="quantity-item">
            <div class="info-label">Change</div>
            <p class="info-value" style="color: ${transaction.type === 'inbound' ? 'var(--color-secondary)' : 'var(--color-accent)'};">
              ${transaction.type === 'inbound' ? '+' : '-'}${transaction.quantity}
            </p>
          </div>
          <div class="quantity-item">
            <div class="info-label">New</div>
            <p class="info-value">${transaction.new_quantity || transaction.newQuantity}</p>
          </div>
        </div>
        
        ${transaction.notes ? `
          <div>
            <div class="info-label">Notes</div>
            <p class="info-value">${transaction.notes}</p>
          </div>
        ` : ''}
      `;
      transactionsList.appendChild(transactionElement);
    });
  } catch (error) {
    transactionsList.innerHTML = `<p class="loading-message" style="color: #b91c1c;">Error loading transactions: ${error.message}</p>`;
  }
}
EOF

cat > public/js/health.js << 'EOF'
// API Health section functionality
function initializeHealthSection() {
  document.getElementById('checkHealthBtn').addEventListener('click', async () => {
    const resultElement = document.getElementById('healthResult');
    try {
      resultElement.textContent = 'Loading...';
      
      const response = await fetch('/api/health');
      const data = await response.json();
      
      resultElement.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
      resultElement.textContent = `Error: ${error.message}`;
    }
  });
}
EOF

# Create the index.html file
echo "Creating HTML file..."
cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>3PL Management System</title>
  
  <!-- CSS Files -->
  <link rel="stylesheet" href="/css/main.css">
  <link rel="stylesheet" href="/css/dashboard.css">
  <link rel="stylesheet" href="/css/clients.css">
  <link rel="stylesheet" href="/css/products.css">
  <link rel="stylesheet" href="/css/transactions.css">
</head>
<body>
  <div class="container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="sidebar-header">
        <h1 class="sidebar-title">3PL Management</h1>
      </div>
      
      <nav class="sidebar-nav">
        <div class="nav-section">
          <div class="nav-label">Main</div>
          
          <a href="#" class="nav-link active" data-tab="dashboard">
            <span class="nav-icon">📊</span>
            Dashboard
          </a>
          
          <a href="#" class="nav-link" data-tab="clients">
            <span class="nav-icon">👥</span>
            Clients
          </a>
          
          <a href="#" class="nav-link" data-tab="products">
            <span class="nav-icon">📦</span>
            Products
          </a>
          
          <a href="#" class="nav-link" data-tab="transactions">
            <span class="nav-icon">🔄</span>
            Transactions
          </a>
        </div>
        
        <div class="nav-section">
          <div class="nav-label">System</div>
          
          <a href="#" class="nav-link" data-tab="health">
            <span class="nav-icon">⚙️</span>
            API Health
          </a>
        </div>
      </nav>
    </div>
    
    <!-- Main content -->
    <div class="main-content">
      <!-- Top header -->
      <header class="header">
        <div style="display: flex; align-items: center;">
          <button class="mobile-menu-btn">☰</button>
          <h2 class="header-title">Dashboard</h2>
        </div>
        
        <div class="header-actions">
          <button class="btn" id="new-transaction-btn">
            <span class="btn-icon">+</span>
            New Transaction
          </button>
        </div>
      </header>
      
      <!-- Content area -->
      <main class="content">
        <!-- Dashboard Tab -->
        <div class="tab-content active" id="dashboard-tab">
          <div class="dashboard-stats">
            <!-- Stats cards -->
            <div class="stat-card">
              <div class="stat-label">Total Clients</div>
              <p class="stat-value" id="total-clients">--</p>
              <p class="stat-description">From all locations</p>
            </div>
            
            <div class="stat-card">
              <div class="stat-label">Products Tracked</div>
              <p class="stat-value" id="total-products">--</p>
              <p class="stat-description">Across all clients</p>
            </div>
            
            <div class="stat-card">
              <div class="stat-label">Recent Transactions</div>
              <p class="stat-value" id="recent-transactions">--</p>
              <p class="stat-description">Last 7 days</p>
            </div>
          </div>
          
          <div class="dashboard-panels">
            <!-- Recent activity -->
            <div class="panel">
              <div class="panel-header">
                <h3 class="panel-title">Recent Activity</h3>
                <a href="#" class="view-all" id="view-all-activity">View All</a>
              </div>
              <div id="recent-activity-list">
                <p class="loading-message">Loading...</p>
              </div>
            </div>
            
            <!-- Inventory status -->
            <div class="panel">
              <div class="panel-header">
                <h3 class="panel-title">Inventory Status</h3>
                <a href="#" class="view-all" id="view-all-inventory">View All</a>
              </div>
              <div id="low-stock-list">
                <p class="loading-message">Loading...</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Clients Tab -->
        <div class="tab-content" id="clients-tab">
          <div class="section-header">
            <h2 class="section-title">Client Management</h2>
            <button class="btn btn-primary" id="loadClientsBtn">
              <span class="btn-icon">↻</span>
              Refresh Clients
            </button>
          </div>

          <div class="card mb-4">
            <div class="card-header">
              <h3 class="card-title">Client List</h3>
              <button class="btn btn-secondary" id="addClientToggleBtn">
                <span class="btn-icon">+</span>
                Add New Client
              </button>
            </div>
            
            <div id="clientsList" class="card-content">
              <p class="loading-message">Loading clients...</p>
            </div>
          </div>

          <div class="card" id="addClientCard" style="display: none;">
            <div class="card-header">
              <h3 class="card-title">Add New Client</h3>
            </div>
            
            <div class="card-content">
              <form id="addClientForm">
                <div class="form-row">
                  <div class="form-group">
                    <label for="clientName">Client Name</label>
                    <input type="text" id="clientName" required>
                  </div>
                  
                  <div class="form-group">
                    <label for="clientCode">Client Code</label>
                    <input type="text" id="clientCode" required>
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="contactName">Contact Name</label>
                    <input type="text" id="contactName">
                  </div>
                  
                  <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email">
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="phone">Phone</label>
                    <input type="text" id="phone">
                  </div>
                  
                  <div class="form-group">
                    <label for="active">Status</label>
                    <select id="active">
                      <option value="true" selected>Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>
                
                <div class="form-actions">
                  <button type="button" class="btn btn-secondary" id="cancelAddClient">Cancel</button>
                  <button type="submit" class="btn btn-primary">Add Client</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <!-- Products Tab -->
        <div class="tab-content" id="products-tab">
          <div class="section-header">
            <h2 class="section-title">Product Management</h2>
            <button class="btn btn-primary" id="loadProductsBtn">
              <span class="btn-icon">↻</span>
              Refresh Products
            </button>
          </div>

          <div class="card mb-4">
            <div class="card-header">
              <h3 class="card-title">Product List</h3>
              <div>
                <select id="clientFilter" class="btn">
                  <option value="">All Clients</option>
                  <!-- Will be populated dynamically -->
                </select>
                <button class="btn btn-secondary" id="addProductToggleBtn">
                  <span class="btn-icon">+</span>
                  Add New Product
                </button>
              </div>
            </div>
            
            <div id="productsList" class="card-content">
              <p class="loading-message">Loading products...</p>
            </div>
          </div>

          <div class="card" id="addProductCard" style="display: none;">
            <div class="card-header">
              <h3 class="card-title">Add New Product</h3>
            </div>
            
            <div class="card-content">
              <form id="addProductForm">
                <div class="form-row">
                  <div class="form-group">
                    <label for="productName">Product Name</label>
                    <input type="text" id="productName" required>
                  </div>
                  
                  <div class="form-group">
                    <label for="productSku">SKU</label>
                    <input type="text" id="productSku" required>
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="productUpc">UPC (Barcode)</label>
                    <input type="text" id="productUpc">
                  </div>
                  
                  <div class="form-group">
                    <label for="productClient">Client</label>
                    <select id="productClient" required>
                      <option value="">Select a client</option>
                      <!-- Will be populated dynamically -->
                    </select>
                    </div>
                </div>
                
                <div class="form-group">
                  <label for="productDescription">Description</label>
                  <textarea id="productDescription" rows="3"></textarea>
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="productQuantity">Initial Quantity</label>
                    <input type="number" id="productQuantity" value="0" min="0">
                  </div>
                </div>
                
                <div class="form-actions">
                  <button type="button" class="btn btn-secondary" id="cancelAddProduct">Cancel</button>
                  <button type="submit" class="btn btn-primary">Add Product</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <!-- Transactions Tab -->
        <div class="tab-content" id="transactions-tab">
          <div class="section-header">
            <h2 class="section-title">Inventory Transactions</h2>
            <div>
              <select id="transactionFilter" class="btn">
                <option value="">All Transactions</option>
                <option value="inbound">Inbound Only</option>
                <option value="outbound">Outbound Only</option>
              </select>
              <button class="btn btn-primary" id="loadTransactionsBtn">
                <span class="btn-icon">↻</span>
                Refresh
              </button>
            </div>
          </div>

          <div class="card mb-4">
            <div class="card-header">
              <h3 class="card-title">Create New Transaction</h3>
            </div>
            
            <div class="card-content">
              <form id="createTransactionForm">
                <div class="form-row">
                  <div class="form-group">
                    <label for="transactionType">Transaction Type</label>
                    <select id="transactionType">
                      <option value="inbound">Inbound (Receive)</option>
                      <option value="outbound">Outbound (Ship)</option>
                    </select>
                  </div>
                  
                  <div class="form-group">
                    <label for="transactionProduct">Product</label>
                    <select id="transactionProduct" required>
                      <option value="">Select a product</option>
                      <!-- Will be populated dynamically -->
                    </select>
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="transactionQuantity">Quantity</label>
                    <input type="number" id="transactionQuantity" min="1" value="1" required>
                  </div>
                  
                  <div class="form-group">
                    <label for="transactionReference">Reference (Optional)</label>
                    <input type="text" id="transactionReference" placeholder="PO number, order number, etc.">
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="transactionNotes">Notes (Optional)</label>
                  <textarea id="transactionNotes" rows="3" placeholder="Additional information about this transaction"></textarea>
                </div>
                
                <div class="form-actions">
                  <button type="submit" class="btn btn-primary">Create Transaction</button>
                </div>
              </form>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Transaction History</h3>
            </div>
            
            <div id="transactionsList" class="card-content">
              <p class="loading-message">Loading transactions...</p>
            </div>
          </div>
        </div>
        
        <!-- API Health Tab -->
        <div class="tab-content" id="health-tab">
          <div class="section-header">
            <h2 class="section-title">API Health Check</h2>
          </div>
          
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">System Status</h3>
              <button class="btn btn-primary" id="checkHealthBtn">
                <span class="btn-icon">↻</span>
                Check Now
              </button>
            </div>
            
            <div class="card-content">
              <pre id="healthResult" style="background-color: #f5f5f5; padding: 15px; border-radius: 6px; overflow: auto;">Click the button to check API health...</pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
  
  <!-- Mobile sidebar (hidden by default) -->
  <div id="mobile-sidebar" style="display: none; position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: 20;">
    <div style="position: absolute; inset: 0; background-color: rgba(0, 0, 0, 0.5);"></div>
    <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 250px; background-color: var(--color-primary); color: white;">
      <!-- Mobile sidebar content (same as desktop sidebar) -->
      <div style="padding: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-primary-light);">
        <h1 style="font-size: 20px; font-weight: bold; margin: 0;">3PL Management</h1>
        <button id="close-mobile-menu" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">×</button>
      </div>
      
      <nav style="margin-top: 30px;">
        <!-- Same navigation as desktop sidebar -->
        <div style="margin-bottom: 30px;">
          <div style="padding: 0 20px; font-size: 12px; text-transform: uppercase; color: var(--color-primary-light); margin-bottom: 8px;">Main</div>
          
          <a href="#" class="nav-link active" data-tab="dashboard">
            <span style="margin-right: 12px;">📊</span>
            Dashboard
          </a>
          
          <a href="#" class="nav-link" data-tab="clients">
            <span style="margin-right: 12px;">👥</span>
            Clients
          </a>
          
          <a href="#" class="nav-link" data-tab="products">
            <span style="margin-right: 12px;">📦</span>
            Products
          </a>
          
          <a href="#" class="nav-link" data-tab="transactions">
            <span style="margin-right: 12px;">🔄</span>
            Transactions
          </a>
        </div>
        
        <div style="margin-bottom: 30px;">
          <div style="padding: 0 20px; font-size: 12px; text-transform: uppercase; color: var(--color-primary-light); margin-bottom: 8px;">System</div>
          
          <a href="#" class="nav-link" data-tab="health">
            <span style="margin-right: 12px;">⚙️</span>
            API Health
          </a>
        </div>
      </nav>
    </div>
  </div>

  <!-- JavaScript Files -->
  <script src="/js/main.js"></script>
  <script src="/js/dashboard.js"></script>
  <script src="/js/clients.js"></script>
  <script src="/js/products.js"></script>
  <script src="/js/transactions.js"></script>
  <script src="/js/health.js"></script>
</body>
</html>
EOF

echo "File structure created successfully!"
echo "Make the script executable with: chmod +x setup-modular-structure.sh"
echo "Then run it with: ./setup-modular-structure.sh"