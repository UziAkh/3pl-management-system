// Enhanced Transactions section functionality - focused on outbound fulfillment
(function() {
    'use strict';

    // State management
    let currentShipment = {
        clientId: null,
        items: [],
        boxType: null,
        boxCost: 0,
        totalCost: 0
    };
    
    let allClients = [];
    let allProducts = [];

    // Pricing configuration
    const PRICING = {
        baseFulfillment: 1.00,
        additionalItem: 0.05
    };

    // DOM elements
    const elements = {
        clientSelect: null,
        upcScanSection: null,
        upcInput: null,
        processUpcBtn: null,
        shipmentItemsList: null,
        boxScanSection: null,
        boxBarcodeInput: null,
        processBoxBtn: null,
        shipmentSummary: null,
        pricingDetails: null,
        completeShipmentBtn: null,
        cancelShipmentBtn: null,
        transactionsList: null,
        transactionFilter: null,
        loadTransactionsBtn: null
    };

    // Utility functions
    function showNotification(message, type = 'error') {
        const notification = document.getElementById('notification');
        const messageEl = document.getElementById('notification-message');
        
        if (notification && messageEl) {
            notification.className = `notification ${type}`;
            messageEl.textContent = message;
            notification.classList.remove('hidden');
            
            if (type === 'success') {
                setTimeout(() => {
                    notification.classList.add('hidden');
                }, 3000);
            }
        }
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Load clients for the dropdown
    async function loadClients() {
        try {
            console.log('Loading clients for shipment dropdown...');
            const response = await fetch('/api/clients');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            allClients = await response.json();
            console.log('Loaded clients:', allClients);
            
            populateClientDropdown();
        } catch (error) {
            console.error('Error loading clients:', error);
            showNotification('Failed to load clients: ' + error.message);
        }
    }

    // Populate the client dropdown
    function populateClientDropdown() {
        if (!elements.clientSelect) return;
        
        // Clear existing options except the first one
        elements.clientSelect.innerHTML = '<option value="">Select a client to ship for...</option>';
        
        // Add active clients
        const activeClients = allClients.filter(client => client.active);
        
        if (activeClients.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No active clients found';
            option.disabled = true;
            elements.clientSelect.appendChild(option);
            return;
        }
        
        activeClients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = client.name;
            elements.clientSelect.appendChild(option);
        });
        
        console.log(`Populated dropdown with ${activeClients.length} active clients`);
    }

    // Handle client selection
    function handleClientSelection() {
        const selectedClientId = elements.clientSelect.value;
        
        if (selectedClientId) {
            currentShipment.clientId = selectedClientId;
            const selectedClient = allClients.find(c => c.id === selectedClientId);
            
            console.log('Selected client:', selectedClient);
            
            // Show UPC scanning section
            if (elements.upcScanSection) {
                elements.upcScanSection.style.display = 'block';
            }
            
            // Focus on UPC input
            if (elements.upcInput) {
                elements.upcInput.focus();
            }
            
            showNotification(`Now shipping for ${selectedClient.name}`, 'success');
        } else {
            // Hide UPC scanning section if no client selected
            if (elements.upcScanSection) {
                elements.upcScanSection.style.display = 'none';
            }
            resetShipment();
        }
    }

    // Load products for UPC scanning
    async function loadProducts() {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            
            allProducts = await response.json();
            console.log(`Loaded ${allProducts.length} products`);
        } catch (error) {
            console.error('Error loading products:', error);
            showNotification('Failed to load products: ' + error.message);
        }
    }

    // Process UPC scan
    async function processUPC() {
        const upc = elements.upcInput.value.trim();
        
        if (!upc) {
            showNotification('Please enter a UPC');
            return;
        }
        
        if (!currentShipment.clientId) {
            showNotification('Please select a client first');
            return;
        }
        
        try {
            // Find product by UPC
            console.log('Looking for product with UPC:', upc);
            const product = allProducts.find(p => p.upc === upc && p.client_id === currentShipment.clientId);
            
            if (!product) {
                showNotification(`Product with UPC ${upc} not found`, 'error');
                elements.upcInput.value = '';
                return;
            }
            
            // Check if product belongs to selected client
            console.log('Product client_id:', product.client_id);
            console.log('Selected client ID:', currentShipment.clientId);
            console.log('Client ID comparison:', product.client_id === currentShipment.clientId);
            
            if (product.client_id !== currentShipment.clientId) {
                const productClient = allClients.find(c => c.id === product.client_id);
                const selectedClient = allClients.find(c => c.id === currentShipment.clientId);
                console.log('Product client:', productClient);
                console.log('Selected client:', selectedClient);
                showNotification(`This product belongs to ${productClient?.name || 'another client'}, not ${selectedClient?.name}`, 'error');
                elements.upcInput.value = '';
                return;
            }
            
            // Check inventory
            if (product.quantity <= 0) {
                showNotification(`${product.name} is out of stock`, 'error');
                elements.upcInput.value = '';
                return;
            }
            
            // Add to shipment
            addItemToShipment(product);
            elements.upcInput.value = '';
            elements.upcInput.focus();
            
        } catch (error) {
            console.error('Error processing UPC:', error);
            showNotification('Error processing UPC: ' + error.message);
        }
    }

    // Add item to current shipment
    function addItemToShipment(product) {
        // Check if item already exists in shipment
        const existingItem = currentShipment.items.find(item => item.productId === product.id);
        
        if (existingItem) {
            // Check if we have enough inventory
            if (existingItem.quantity >= product.quantity) {
                showNotification(`Cannot add more ${product.name} - not enough inventory`, 'error');
                return;
            }
            
            existingItem.quantity += 1;
            showNotification(`Added ${product.name} - Quantity: ${existingItem.quantity}`, 'success');
        } else {
            currentShipment.items.push({
                productId: product.id,
                name: product.name,
                sku: product.sku,
                upc: product.upc,
                quantity: 1,
                availableQuantity: product.quantity
            });
            showNotification(`Added ${product.name} - Quantity: 1`, 'success');
        }
        
        updateShipmentItemsList();
        
        // Show box scanning section if not already visible
        if (currentShipment.items.length > 0 && elements.boxScanSection) {
            elements.boxScanSection.style.display = 'block';
        }
    }

    // Update shipment items list display
    function updateShipmentItemsList() {
        if (!elements.shipmentItemsList) return;
        
        if (currentShipment.items.length === 0) {
            elements.shipmentItemsList.innerHTML = '<p>No items scanned yet...</p>';
            return;
        }
        
        const itemsHtml = currentShipment.items.map(item => `
            <div class="shipment-item">
                <div>
                    <span class="item-name">${escapeHtml(item.name)}</span>
                    <span class="item-quantity">(Qty: ${item.quantity})</span>
                </div>
                <button onclick="removeItemFromShipment('${item.productId}')" class="btn btn-sm btn-danger">Remove</button>
            </div>
        `).join('');
        
        elements.shipmentItemsList.innerHTML = itemsHtml;
    }

    // Remove item from shipment (global function for onclick)
    window.removeItemFromShipment = function(productId) {
        currentShipment.items = currentShipment.items.filter(item => item.productId !== productId);
        updateShipmentItemsList();
        
        // Hide box scanning section if no items
        if (currentShipment.items.length === 0 && elements.boxScanSection) {
            elements.boxScanSection.style.display = 'none';
        }
        
        // Hide shipment summary
        if (elements.shipmentSummary) {
            elements.shipmentSummary.style.display = 'none';
        }
        
        showNotification('Item removed from shipment', 'success');
    };

    // Process box barcode scan
    async function processBoxBarcode() {
        const barcode = elements.boxBarcodeInput.value.trim();
        
        if (!barcode) {
            showNotification('Please scan or enter a box barcode');
            return;
        }
        
        if (currentShipment.items.length === 0) {
            showNotification('Please add items to shipment first');
            return;
        }
        
        try {
            // Look up box type by barcode
            const response = await fetch(`/api/boxes/barcode/${barcode}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    showNotification(`Box barcode ${barcode} not found`, 'error');
                } else {
                    throw new Error('Failed to lookup box barcode');
                }
                return;
            }
            
            const boxType = await response.json();
            
            // Handle custom box (BOX999999)
            if (barcode === 'BOX999999') {
                const customPrice = prompt('Enter the price for this custom box:');
                if (customPrice === null) return;
                
                const price = parseFloat(customPrice);
                if (isNaN(price) || price < 0) {
                    showNotification('Please enter a valid price');
                    return;
                }
                
                boxType.price = price;
            }
            
            currentShipment.boxType = boxType;
            currentShipment.boxCost = boxType.price;
            
            showNotification(`Box selected: ${boxType.name} - ${formatCurrency(boxType.price)}`, 'success');
            
            // Calculate total cost and show summary
            calculateTotalCost();
            showShipmentSummary();
            
        } catch (error) {
            console.error('Error processing box barcode:', error);
            showNotification('Error processing box barcode: ' + error.message);
        }
    }

    // Calculate total cost
    function calculateTotalCost() {
        const totalItems = currentShipment.items.reduce((sum, item) => sum + item.quantity, 0);
        const fulfillmentFee = PRICING.baseFulfillment + (Math.max(0, totalItems - 1) * PRICING.additionalItem);
        
        currentShipment.totalCost = fulfillmentFee + currentShipment.boxCost;
        
        return {
            totalItems,
            fulfillmentFee,
            boxCost: currentShipment.boxCost,
            totalCost: currentShipment.totalCost
        };
    }

    // Show shipment summary
    function showShipmentSummary() {
        if (!elements.shipmentSummary || !elements.pricingDetails) return;
        
        const pricing = calculateTotalCost();
        
        const pricingHtml = `
            <div class="pricing-row">
                <span>Fulfillment Fee (${pricing.totalItems} items):</span>
                <span>${formatCurrency(pricing.fulfillmentFee)}</span>
            </div>
            <div class="pricing-row">
                <span>Box Cost (${currentShipment.boxType.name}):</span>
                <span>${formatCurrency(pricing.boxCost)}</span>
            </div>
            <div class="pricing-row total">
                <span><strong>Total Cost:</strong></span>
                <span><strong>${formatCurrency(pricing.totalCost)}</strong></span>
            </div>
        `;
        
        elements.pricingDetails.innerHTML = pricingHtml;
        elements.shipmentSummary.style.display = 'block';
    }

    // Complete shipment
    async function completeShipment() {
        if (currentShipment.items.length === 0) {
            showNotification('No items in shipment');
            return;
        }
        
        if (!currentShipment.boxType) {
            showNotification('Please scan a box barcode');
            return;
        }
        
        try {
    // Generate a single reference for the entire shipment
    const shipmentReference = `SHIPMENT-${Date.now()}`;
    
    // Step 1: Create the shipment record
    const shipmentData = {
        clientId: currentShipment.clientId,
        totalCost: currentShipment.totalCost,
        boxTypeId: currentShipment.boxType.id,
        reference: shipmentReference,
        notes: `Box: ${currentShipment.boxType.name}, Total: ${formatCurrency(currentShipment.totalCost)}`
    };
    
    const shipmentResponse = await fetch('/api/shipments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(shipmentData)
    });
    
    if (!shipmentResponse.ok) {
        const errorData = await shipmentResponse.json();
        throw new Error(errorData.message || 'Failed to create shipment');
    }
    
    const shipment = await shipmentResponse.json();
    console.log('Created shipment:', shipment);

    // Step 2: Create shipment items
for (const item of currentShipment.items) {
    const shipmentItemData = {
        shipmentId: shipment.id,
        productId: item.productId,
        quantity: item.quantity
    };
    
    const itemResponse = await fetch('/api/shipments/shipment-items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(shipmentItemData)
    });
    
    if (!itemResponse.ok) {
        const errorData = await itemResponse.json();
        throw new Error(errorData.message || 'Failed to create shipment item');
    }
}
    
    // Step 3: Create outbound transactions for each item (existing logic)
    for (const item of currentShipment.items) {
        const transactionData = {
            productId: item.productId,
            quantity: item.quantity,
            reference: shipmentReference, // Same reference for all items
            notes: `Shipment ID: ${shipment.id}, Box: ${currentShipment.boxType.name}`
        };
        
        const response = await fetch('/api/transactions/outbound', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create transaction');
        }
    }
    
    showNotification('Shipment completed successfully!', 'success');
            
            // Reset for next shipment
            resetShipment();
            loadTransactions(); // Refresh transaction history
            
        } catch (error) {
            console.error('Error completing shipment:', error);
            showNotification('Error completing shipment: ' + error.message);
        }
    }

    // Reset shipment state
    function resetShipment() {
        currentShipment = {
            clientId: null,
            items: [],
            boxType: null,
            boxCost: 0,
            totalCost: 0
        };
        
        // Reset form elements
        if (elements.clientSelect) elements.clientSelect.value = '';
        if (elements.upcInput) elements.upcInput.value = '';
        if (elements.boxBarcodeInput) elements.boxBarcodeInput.value = '';
        
        // Hide sections
        if (elements.upcScanSection) elements.upcScanSection.style.display = 'none';
        if (elements.boxScanSection) elements.boxScanSection.style.display = 'none';
        if (elements.shipmentSummary) elements.shipmentSummary.style.display = 'none';
        
        // Reset displays
        updateShipmentItemsList();
    }

    // Load transaction history
    async function loadTransactions() {
        if (!elements.transactionsList) return;
        
        try {
            elements.transactionsList.innerHTML = '<p class="loading-message">Loading shipments...</p>';
            
            const filter = elements.transactionFilter ? elements.transactionFilter.value : '';
            let url = '/api/transactions?type=outbound';
            
            // Add additional filtering based on filter value
            // For now, just load outbound transactions
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch transactions');
            
            const transactions = await response.json();
            
            if (transactions.length === 0) {
                elements.transactionsList.innerHTML = '<p class="empty-message">No shipments found.</p>';
                return;
            }
            
            displayTransactions(transactions);
        } catch (error) {
            console.error('Error loading transactions:', error);
            elements.transactionsList.innerHTML = `<p class="error-message">Error loading shipments: ${error.message}</p>`;
            showNotification('Failed to load transaction history: ' + error.message);
        }
    }

    // Display transactions
    function displayTransactions(transactions) {
        if (!elements.transactionsList) return;
        
        const transactionsHtml = transactions.map(transaction => {
            const date = new Date(transaction.created_at);
            
            return `
                <div class="transaction-card">
                    <div class="transaction-header">
                        <span class="transaction-type-badge transaction-outbound">SHIPPED</span>
                        <span class="transaction-timestamp">${date.toLocaleString()}</span>
                    </div>
                    
                    <div class="transaction-details">
                        <div class="info-item">
                            <span class="info-label">Product ID</span>
                            <p class="info-value">${transaction.product_id}</p>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Reference</span>
                            <p class="info-value">${transaction.reference || 'N/A'}</p>
                        </div>
                    </div>
                    
                    <div class="quantity-change">
                        <div class="quantity-item">
                            <span class="info-label">Previous</span>
                            <p class="info-value">${transaction.previous_quantity}</p>
                        </div>
                        <div class="quantity-item">
                            <span class="info-label">Shipped</span>
                            <p class="info-value">-${transaction.quantity}</p>
                        </div>
                        <div class="quantity-item">
                            <span class="info-label">New Total</span>
                            <p class="info-value">${transaction.new_quantity}</p>
                        </div>
                    </div>
                    
                    ${transaction.notes ? `
                    <div class="transaction-notes">
                        <span class="info-label">Notes</span>
                        <p class="info-value">${escapeHtml(transaction.notes)}</p>
                    </div>
                    ` : ''}
                </div>
            `;
        }).join('');
        
        elements.transactionsList.innerHTML = transactionsHtml;
    }

    // Initialize DOM elements
    function initializeElements() {
        elements.clientSelect = document.getElementById('shippingClientSelect');
        elements.upcScanSection = document.getElementById('upcScanSection');
        elements.upcInput = document.getElementById('shippingUpcInput');
        elements.processUpcBtn = document.getElementById('processUpcBtn');
        elements.shipmentItemsList = document.getElementById('shipmentItemsList');
        elements.boxScanSection = document.getElementById('boxScanSection');
        elements.boxBarcodeInput = document.getElementById('boxBarcodeInput');
        elements.processBoxBtn = document.getElementById('processBoxBtn');
        elements.shipmentSummary = document.getElementById('shipmentSummary');
        elements.pricingDetails = document.getElementById('pricingDetails');
        elements.completeShipmentBtn = document.getElementById('completeShipmentBtn');
        elements.cancelShipmentBtn = document.getElementById('cancelShipmentBtn');
        elements.transactionsList = document.getElementById('transactionsList');
        elements.transactionFilter = document.getElementById('transactionFilter');
        elements.loadTransactionsBtn = document.getElementById('loadTransactionsBtn');
    }

    // Initialize event listeners
    function initializeEventListeners() {
        // Client selection
        if (elements.clientSelect) {
            elements.clientSelect.addEventListener('change', handleClientSelection);
        }
        
        // UPC processing
        if (elements.processUpcBtn) {
            elements.processUpcBtn.addEventListener('click', processUPC);
        }
        
        if (elements.upcInput) {
            elements.upcInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    processUPC();
                }
            });
        }
        
        // Box processing
        if (elements.processBoxBtn) {
            elements.processBoxBtn.addEventListener('click', processBoxBarcode);
        }
        
        if (elements.boxBarcodeInput) {
            elements.boxBarcodeInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    processBoxBarcode();
                }
            });
        }
        
        // Shipment actions
        if (elements.completeShipmentBtn) {
            elements.completeShipmentBtn.addEventListener('click', completeShipment);
        }
        
        if (elements.cancelShipmentBtn) {
            elements.cancelShipmentBtn.addEventListener('click', resetShipment);
        }
        
        // Transaction history
        if (elements.loadTransactionsBtn) {
            elements.loadTransactionsBtn.addEventListener('click', loadTransactions);
        }
        
        if (elements.transactionFilter) {
            elements.transactionFilter.addEventListener('change', loadTransactions);
        }
        
        // Close notification
        const notificationClose = document.getElementById('notification-close');
        if (notificationClose) {
            notificationClose.addEventListener('click', () => {
                document.getElementById('notification').classList.add('hidden');
            });
        }
    }

    // Initialize the transactions functionality
    function initializeTransactions() {
        console.log('Initializing enhanced transactions...');
        
        initializeElements();
        initializeEventListeners();
        
        // Load initial data
        loadClients();
        loadProducts();
        loadTransactions();
        
        console.log('Enhanced transactions initialized successfully');
    }

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTransactions);
    } else {
        initializeTransactions();
    }

})();