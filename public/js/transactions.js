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
