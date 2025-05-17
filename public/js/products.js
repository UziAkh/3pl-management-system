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
