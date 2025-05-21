// Products functionality - cleaned to avoid conflicts with enhanced transactions
(function() {
    'use strict';

    let allClients = [];
    let allProducts = [];

    // Utility function to show notifications
    function showNotification(message, type = 'error') {
        const notification = document.getElementById('notification');
        const messageEl = document.getElementById('notification-message');
        
        notification.className = `notification ${type}`;
        messageEl.textContent = message;
        notification.classList.remove('hidden');
        
        // Auto-hide success notifications after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                notification.classList.add('hidden');
            }, 3000);
        }
    }

    // Utility function to format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    // Load all clients for dropdowns
    async function loadClients() {
        try {
            const response = await fetch('/api/clients');
            if (!response.ok) throw new Error('Failed to fetch clients');
            
            allClients = await response.json();
            updateClientDropdowns();
        } catch (error) {
            console.error('Error loading clients:', error);
            showNotification('Failed to load clients: ' + error.message);
        }
    }

    // Update client dropdowns
    function updateClientDropdowns() {
        const clientFilter = document.getElementById('clientFilter');
        const productClient = document.getElementById('productClient');
        
        if (clientFilter) {
            // Clear and populate client filter
            clientFilter.innerHTML = '<option value="">All Clients</option>';
            allClients.forEach(client => {
                if (client.active) {
                    const option = document.createElement('option');
                    option.value = client.id;
                    option.textContent = client.name;
                    clientFilter.appendChild(option);
                }
            });
        }

        if (productClient) {
            // Clear and populate product client dropdown
            productClient.innerHTML = '<option value="">Select a client</option>';
            allClients.forEach(client => {
                if (client.active) {
                    const option = document.createElement('option');
                    option.value = client.id;
                    option.textContent = client.name;
                    productClient.appendChild(option);
                }
            });
        }
    }

    // Load products
    async function loadProducts(clientId = '') {
        const productsList = document.getElementById('productsList');
        if (!productsList) return;

        try {
            productsList.innerHTML = '<p class="loading-message">Loading products...</p>';
            
            const url = clientId ? `/api/products?clientId=${clientId}` : '/api/products';
            const response = await fetch(url);
            
            if (!response.ok) throw new Error('Failed to fetch products');
            
            allProducts = await response.json();
            
            if (allProducts.length === 0) {
                productsList.innerHTML = '<p class="empty-message">No products found.</p>';
                return;
            }
            
            displayProducts(allProducts);
        } catch (error) {
            console.error('Error loading products:', error);
            productsList.innerHTML = `<p class="error-message">Error loading products: ${error.message}</p>`;
            showNotification('Failed to load products: ' + error.message);
        }
    }

    // Display products in the list
    function displayProducts(products) {
        const productsList = document.getElementById('productsList');
        if (!productsList) return;

        productsList.innerHTML = '';
        
        products.forEach(product => {
            // Find client name
            const client = allClients.find(c => c.id === product.client_id);
            const clientName = client ? client.name : 'Unknown Client';
            
            // Determine stock status
            let stockStatus = { class: 'status-in-stock', text: 'In Stock' };
            if (product.quantity <= 0) {
                stockStatus = { class: 'status-out-of-stock', text: 'Out of Stock' };
            } else if (product.quantity <= 10) {
                stockStatus = { class: 'status-low-stock', text: 'Low Stock' };
            }
            
            const productCard = document.createElement('div');
            productCard.className = 'card mb-3';
            productCard.innerHTML = `
                <div class="card-content">
                    <div class="product-header">
                        <h4 class="product-name">${escapeHtml(product.name)}</h4>
                        <span class="status ${stockStatus.class}">${stockStatus.text}</span>
                    </div>
                    
                    <div class="product-details">
                        <div class="detail-item">
                            <span class="detail-label">SKU:</span>
                            <span class="detail-value">${escapeHtml(product.sku)}</span>
                        </div>
                        
                        <div class="detail-item">
                            <span class="detail-label">UPC:</span>
                            <span class="detail-value">${product.upc || 'N/A'}</span>
                        </div>
                        
                        <div class="detail-item">
                            <span class="detail-label">Client:</span>
                            <span class="detail-value">${escapeHtml(clientName)}</span>
                        </div>
                        
                        <div class="detail-item">
                            <span class="detail-label">Quantity:</span>
                            <span class="detail-value quantity-value">${product.quantity}</span>
                        </div>
                        
                        ${product.description ? `
                        <div class="detail-item full-width">
                            <span class="detail-label">Description:</span>
                            <span class="detail-value">${escapeHtml(product.description)}</span>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="product-actions">
                        <button class="btn btn-secondary edit-product-btn" data-id="${product.id}">
                            <span class="btn-icon">✏️</span>
                            Edit
                        </button>
                        <button class="btn btn-danger delete-product-btn" data-id="${product.id}">
                            <span class="btn-icon">🗑️</span>
                            Delete
                        </button>
                    </div>
                </div>
            `;
            
            productsList.appendChild(productCard);
        });
        
        // Add event listeners for action buttons
        addProductActionListeners();
    }

    // Add event listeners for product action buttons
    function addProductActionListeners() {
        const editButtons = document.querySelectorAll('.edit-product-btn');
        const deleteButtons = document.querySelectorAll('.delete-product-btn');
        
        editButtons.forEach(btn => {
            btn.addEventListener('click', (e) => editProduct(e.target.dataset.id));
        });
        
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => deleteProduct(e.target.dataset.id));
        });
    }

    // Edit product
    async function editProduct(id) {
        try {
            const response = await fetch(`/api/products/${id}`);
            if (!response.ok) throw new Error('Failed to fetch product details');
            
            const product = await response.json();
            
            // Simple prompt for now - in a real app, you'd show a modal
            const newName = prompt('Enter new product name:', product.name);
            if (newName === null) return;
            
            const updateResponse = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: newName })
            });
            
            if (!updateResponse.ok) {
                const errorData = await updateResponse.json();
                throw new Error(errorData.message || 'Failed to update product');
            }
            
            showNotification('Product updated successfully!', 'success');
            loadProducts(document.getElementById('clientFilter')?.value || '');
        } catch (error) {
            console.error('Error editing product:', error);
            showNotification('Error updating product: ' + error.message);
        }
    }

    // Delete product
    async function deleteProduct(id) {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
        
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete product');
            }
            
            showNotification('Product deleted successfully!', 'success');
            loadProducts(document.getElementById('clientFilter')?.value || '');
        } catch (error) {
            console.error('Error deleting product:', error);
            showNotification('Error deleting product: ' + error.message);
        }
    }

    // Add new product
    async function addProduct(formData) {
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create product');
            }
            
            showNotification('Product added successfully!', 'success');
            
            // Reset form and hide add product card
            document.getElementById('addProductForm').reset();
            document.getElementById('addProductCard').style.display = 'none';
            
            // Reload products
            loadProducts(document.getElementById('clientFilter')?.value || '');
        } catch (error) {
            console.error('Error adding product:', error);
            showNotification('Error adding product: ' + error.message);
        }
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Initialize products functionality
    function initializeProducts() {
        // Load initial data
        loadClients();
        loadProducts();

        // Event listeners
        const loadProductsBtn = document.getElementById('loadProductsBtn');
        if (loadProductsBtn) {
            loadProductsBtn.addEventListener('click', () => {
                loadProducts(document.getElementById('clientFilter')?.value || '');
            });
        }

        const clientFilter = document.getElementById('clientFilter');
        if (clientFilter) {
            clientFilter.addEventListener('change', function() {
                loadProducts(this.value);
            });
        }

        const addProductToggleBtn = document.getElementById('addProductToggleBtn');
        const addProductCard = document.getElementById('addProductCard');
        const cancelAddProduct = document.getElementById('cancelAddProduct');
        
        if (addProductToggleBtn && addProductCard) {
            addProductToggleBtn.addEventListener('click', () => {
                addProductCard.style.display = addProductCard.style.display === 'none' ? 'block' : 'none';
            });
        }
        
        if (cancelAddProduct && addProductCard) {
            cancelAddProduct.addEventListener('click', () => {
                addProductCard.style.display = 'none';
                document.getElementById('addProductForm').reset();
            });
        }

        const addProductForm = document.getElementById('addProductForm');
        if (addProductForm) {
            addProductForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = {
                    name: document.getElementById('productName').value,
                    sku: document.getElementById('productSku').value,
                    upc: document.getElementById('productUpc').value || null,
                    clientId: document.getElementById('productClient').value,
                    description: document.getElementById('productDescription').value || null,
                    quantity: parseInt(document.getElementById('productQuantity').value) || 0
                };
                
                // Validate required fields
                if (!formData.name || !formData.sku || !formData.clientId) {
                    showNotification('Please fill in all required fields (Name, SKU, Client)');
                    return;
                }
                
                addProduct(formData);
            });
        }

        // Close notification
        const notificationClose = document.getElementById('notification-close');
        if (notificationClose) {
            notificationClose.addEventListener('click', () => {
                document.getElementById('notification').classList.add('hidden');
            });
        }
    }

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeProducts);
    } else {
        initializeProducts();
    }

})();