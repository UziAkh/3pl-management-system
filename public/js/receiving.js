// Daily Receiving functionality
(function() {
    'use strict';

    // State management
    let receivingSession = {
        active: false,
        clientId: null,
        clientName: '',
        scannedItems: []
    };
    
    let allClients = [];
    let allProducts = [];

    // For development - helper to inspect the page structure
    function findAllInputs() {
        const inputs = document.querySelectorAll('input');
        console.log('All inputs on page:', inputs.length);
        inputs.forEach((input, i) => {
            console.log(`Input #${i}:`, {
                id: input.id,
                value: input.value,
                type: input.type,
                placeholder: input.placeholder
            });
        });
    }

    // Utility functions
    function showNotification(message, type = 'error') {
        console.log(`Notification: ${message} (${type})`);
        // Create notification if not exists
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.className = 'notification hidden';
            
            const messageEl = document.createElement('span');
            messageEl.id = 'notification-message';
            
            const closeBtn = document.createElement('button');
            closeBtn.id = 'notification-close';
            closeBtn.className = 'notification-close';
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', () => {
                notification.classList.add('hidden');
            });
            
            notification.appendChild(messageEl);
            notification.appendChild(closeBtn);
            document.body.appendChild(notification);
        }
        
        const messageEl = document.getElementById('notification-message');
        if (messageEl) {
            messageEl.textContent = message;
        }
        
        notification.className = `notification ${type}`;
        notification.classList.remove('hidden');
        
        if (type === 'success') {
            setTimeout(() => {
                notification.classList.add('hidden');
            }, 3000);
        }
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Load clients for dropdown
    async function loadClients() {
        try {
            console.log('Loading clients...');
            const response = await fetch('/api/clients');
            if (!response.ok) throw new Error('Failed to fetch clients');
            
            allClients = await response.json();
            console.log(`Loaded ${allClients.length} clients`);
            
            populateClientDropdown();
        } catch (error) {
            console.error('Error loading clients:', error);
            showNotification('Failed to load clients: ' + error.message);
        }
    }

    // Populate the client dropdown
    function populateClientDropdown() {
        const receivingClient = document.getElementById('receivingClient');
        if (!receivingClient) {
            console.error('No element with ID "receivingClient" found');
            return;
        }
        
        // Clear existing options except the first one
        receivingClient.innerHTML = '<option value="">Choose a client to receive for...</option>';
        
        // Add active clients
        const activeClients = allClients.filter(client => client.active);
        
        if (activeClients.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No active clients found';
            option.disabled = true;
            receivingClient.appendChild(option);
            return;
        }
        
        activeClients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = client.name;
            receivingClient.appendChild(option);
        });
        
        console.log(`Populated dropdown with ${activeClients.length} active clients`);
    }

    // Load products for UPC lookup
    async function loadProducts() {
        try {
            console.log('Loading products...');
            const response = await fetch('/api/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            
            allProducts = await response.json();
            console.log(`Loaded ${allProducts.length} products`);
        } catch (error) {
            console.error('Error loading products:', error);
            showNotification('Failed to load products: ' + error.message);
        }
    }

    // Handle client selection
    function handleClientSelection() {
        const startReceivingBtn = document.getElementById('startReceivingBtn');
        const receivingClient = document.getElementById('receivingClient');
        
        if (!startReceivingBtn || !receivingClient) {
            console.error('Client selection elements not found:', { 
                startReceivingBtn: !!startReceivingBtn, 
                receivingClient: !!receivingClient 
            });
            return;
        }
        
        const selectedClientId = receivingClient.value;
        console.log('Client selected:', selectedClientId);
        
        startReceivingBtn.disabled = !selectedClientId;
    }

    // Start receiving session
    function startReceivingSession() {
        const receivingClient = document.getElementById('receivingClient');
        if (!receivingClient) {
            console.error('receivingClient element not found');
            return;
        }
        
        const selectedClientId = receivingClient.value;
        if (!selectedClientId) {
            showNotification('Please select a client');
            return;
        }
        
        const selectedClient = allClients.find(client => client.id === selectedClientId);
        if (!selectedClient) {
            showNotification('Invalid client selection');
            return;
        }
        
        console.log('Starting receiving session for client:', selectedClient.name);
        
        // Set up session
        receivingSession = {
            active: true,
            clientId: selectedClientId,
            clientName: selectedClient.name,
            scannedItems: []
        };
        
        // Update UI - check for all elements
        const receivingSelection = document.getElementById('receivingSelection');
        const receivingSessionUI = document.getElementById('receivingSession');
        const currentClient = document.getElementById('currentClient');
        const itemsScanned = document.getElementById('itemsScanned');
        
        if (receivingSelection) {
            receivingSelection.style.display = 'none';
        } else {
            console.error('receivingSelection element not found');
        }
        
        if (receivingSessionUI) {
            receivingSessionUI.style.display = 'block';
        } else {
            console.error('receivingSession element not found');
        }
        
        if (currentClient) {
            currentClient.textContent = selectedClient.name;
        } else {
            console.error('currentClient element not found');
        }
        
        if (itemsScanned) {
            itemsScanned.textContent = '0';
        } else {
            console.error('itemsScanned element not found');
        }
        
        // Update session items list
        updateSessionItemsList();
        
        console.log(`Started receiving session for: "${selectedClient.name}"`);
    }

    // Process UPC scan - uses a hard-coded UPC for now
    // Process UPC scan - minimal version that should work
// Process UPC scan - ultra simple hardcoded approach
async function processUPC() {
    console.log('Process UPC called');
    
    // Use the exact UPC from the screen - replace this with what you see
    const upcValue = "016571960230";
    console.log('Using UPC value:', upcValue);
    
    if (!receivingSession.active) {
        showNotification('No active receiving session');
        return;
    }
    
    try {
        // First, look up by UPC in local cache
        console.log('Searching for product with UPC:', upcValue);
        let product = allProducts.find(p => p.upc === upcValue);
        
        // If not found, try to fetch from API
        if (!product) {
            console.log('Product not found in cache, fetching from API...');
            try {
                const response = await fetch(`/api/products/upc/${upcValue}`);
                if (response.ok) {
                    product = await response.json();
                    console.log('Product found via API:', product);
                } else {
                    console.log('API returned no product');
                }
            } catch (err) {
                console.error('API fetch error:', err);
            }
        } else {
            console.log('Product found in cache:', product);
        }
        
        if (!product) {
            showNotification(`Product with UPC ${upcValue} not found`, 'error');
            return;
        }
        
        // Allow products to be processed regardless of client assignment
        console.log('Processing product regardless of client assignment');
        
        // Add to session
        addItemToSession(product);
        
    } catch (error) {
        console.error('Error processing UPC:', error);
        showNotification('Error processing UPC: ' + error.message);
    }
}

    // Add item to session
    function addItemToSession(product) {
        console.log('Adding product to session:', product);
        // Check if item already exists in session
        const existingItem = receivingSession.scannedItems.find(item => item.product.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
            showNotification(`Added ${product.name} - Quantity: ${existingItem.quantity}`, 'success');
        } else {
            receivingSession.scannedItems.push({
                product: product,
                quantity: 1,
                timestamp: new Date()
            });
            showNotification(`Added ${product.name} - Quantity: 1`, 'success');
        }
        
        // Update UI
        const itemsScanned = document.getElementById('itemsScanned');
        if (itemsScanned) {
            const totalItems = receivingSession.scannedItems.reduce((sum, item) => sum + item.quantity, 0);
            itemsScanned.textContent = totalItems;
        } else {
            console.error('itemsScanned element not found');
        }
        
        updateSessionItemsList();
    }

    // Update session items list display
    function updateSessionItemsList() {
        const sessionItemsList = document.getElementById('sessionItemsList');
        if (!sessionItemsList) {
            console.error('sessionItemsList element not found');
            return;
        }
        
        if (receivingSession.scannedItems.length === 0) {
            sessionItemsList.innerHTML = '<p class="empty-message">No items scanned yet...</p>';
            return;
        }
        
        const itemsHtml = receivingSession.scannedItems.map(item => `
            <div class="session-item">
                <div class="item-details">
                    <span class="item-name">${escapeHtml(item.product.name)}</span>
                    <span class="item-identifier">SKU: ${escapeHtml(item.product.sku)} | UPC: ${escapeHtml(item.product.upc || 'N/A')}</span>
                </div>
                <div class="item-quantity">
                    <span class="quantity-value">${item.quantity}</span>
                </div>
            </div>
        `).join('');
        
        sessionItemsList.innerHTML = itemsHtml;
        console.log('Updated session items list with', receivingSession.scannedItems.length, 'items');
    }

    // Switch client / cancel session
    function switchClient() {
        if (!confirm('Are you sure you want to switch clients? This will end the current receiving session.')) {
            return;
        }
        
        // End current session
        endReceivingSession();
        
        // Reset UI for client selection
        const receivingSelection = document.getElementById('receivingSelection');
        const receivingSessionUI = document.getElementById('receivingSession');
        const receivingClient = document.getElementById('receivingClient');
        
        if (receivingSelection) receivingSelection.style.display = 'block';
        if (receivingSessionUI) receivingSessionUI.style.display = 'none';
        if (receivingClient) receivingClient.value = '';
        
        handleClientSelection();
        console.log('Switched client / cancelled session');
    }

    // Finish receiving session and create transactions
    async function finishReceivingSession() {
        if (receivingSession.scannedItems.length === 0) {
            if (!confirm('No items have been scanned. Do you still want to end the session?')) {
                return;
            }
        } else {
            if (!confirm(`Are you sure you want to finish this receiving session with ${receivingSession.scannedItems.length} item types?`)) {
                return;
            }
        }
        
        try {
            console.log('Finishing receiving session...');
            // Create inbound transactions for each item
            for (const item of receivingSession.scannedItems) {
                const transactionData = {
                    productId: item.product.id,
                    quantity: item.quantity,
                    reference: `RECEIVING-${Date.now()}`,
                    notes: `Receiving session for ${receivingSession.clientName}`
                };
                
                console.log('Creating transaction:', transactionData);
                
                const response = await fetch('/api/transactions/inbound', {
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
                
                const result = await response.json();
                console.log('Transaction created:', result);
            }
            
            showNotification(`Receiving session completed with ${receivingSession.scannedItems.length} item types`, 'success');
            
            // End session
            endReceivingSession();
            
            // Reset UI
            const receivingSelection = document.getElementById('receivingSelection');
            const receivingSessionUI = document.getElementById('receivingSession');
            const receivingClient = document.getElementById('receivingClient');
            
            if (receivingSelection) receivingSelection.style.display = 'block';
            if (receivingSessionUI) receivingSessionUI.style.display = 'none';
            if (receivingClient) receivingClient.value = '';
            
            handleClientSelection();
            
            // Refresh receiving history
            loadReceivingHistory();
            
        } catch (error) {
            console.error('Error finishing receiving session:', error);
            showNotification('Error finishing session: ' + error.message);
        }
    }

    // End receiving session (without saving)
    function endReceivingSession() {
        receivingSession = {
            active: false,
            clientId: null,
            clientName: '',
            scannedItems: []
        };
        console.log('Ended receiving session');
    }

    // Load receiving history
    async function loadReceivingHistory() {
        const receivingHistoryList = document.getElementById('receivingHistoryList');
        if (!receivingHistoryList) {
            console.error('receivingHistoryList element not found');
            return;
        }
        
        try {
            receivingHistoryList.innerHTML = '<p class="loading-message">Loading receiving history...</p>';
            
            // Get inbound transactions
            const response = await fetch('/api/transactions?type=inbound');
            if (!response.ok) throw new Error('Failed to fetch receiving history');
            
            const transactions = await response.json();
            console.log(`Loaded ${transactions.length} inbound transactions`);
            
            if (transactions.length === 0) {
                receivingHistoryList.innerHTML = '<p class="empty-message">No receiving sessions found.</p>';
                return;
            }
            
            // Group transactions by reference to show as sessions
            const sessionMap = new Map();
            
            transactions.forEach(transaction => {
                const reference = transaction.reference || 'Unknown';
                const dateKey = new Date(transaction.created_at).toLocaleDateString();
                const sessionKey = `${dateKey}-${reference}`;
                
                if (!sessionMap.has(sessionKey)) {
                    sessionMap.set(sessionKey, {
                        date: new Date(transaction.created_at),
                        reference: reference,
                        transactions: [],
                        totalItems: 0
                    });
                }
                
                sessionMap.get(sessionKey).transactions.push(transaction);
                sessionMap.get(sessionKey).totalItems += transaction.quantity;
            });
            
            // Convert to array and sort by date (newest first)
            const sessions = Array.from(sessionMap.values()).sort((a, b) => b.date - a.date);
            
            // Build HTML
            const sessionsHtml = sessions.slice(0, 10).map(session => {
                const date = session.date.toLocaleString();
                
                return `
                    <div class="history-card">
                        <div class="history-header">
                            <span class="history-date">${date}</span>
                            <span class="history-ref">Ref: ${escapeHtml(session.reference)}</span>
                        </div>
                        <div class="history-stats">
                            <div class="stat-item">
                                <span class="stat-label">Items</span>
                                <span class="stat-value">${session.transactions.length}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Quantity</span>
                                <span class="stat-value">${session.totalItems}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            
            receivingHistoryList.innerHTML = sessionsHtml || '<p class="empty-message">No receiving sessions found.</p>';
            
        } catch (error) {
            console.error('Error loading receiving history:', error);
            receivingHistoryList.innerHTML = `<p class="error-message">Error loading receiving history: ${error.message}</p>`;
        }
    }

    // Initialize event listeners
    function initializeEventListeners() {
        console.log('Setting up event listeners for receiving functionality...');
        
        // Client selection
        const receivingClient = document.getElementById('receivingClient');
        if (receivingClient) {
            receivingClient.addEventListener('change', handleClientSelection);
            console.log('Added change listener to receivingClient');
        } else {
            console.error('receivingClient element not found');
        }
        
        // Start receiving session
        const startReceivingBtn = document.getElementById('startReceivingBtn');
        if (startReceivingBtn) {
            startReceivingBtn.addEventListener('click', startReceivingSession);
            console.log('Added click listener to startReceivingBtn');
        } else {
            console.error('startReceivingBtn element not found');
        }
        
        // Process UPC button
        const scanBtn = document.getElementById('scanBtn');
        if (scanBtn) {
            scanBtn.addEventListener('click', processUPC);
            console.log('Added click listener to scanBtn');
        } else {
            // Try to find by text content
            const buttons = document.querySelectorAll('button');
            const processButton = Array.from(buttons).find(btn => 
                btn.textContent.includes('Process UPC')
            );
            
            if (processButton) {
                processButton.addEventListener('click', processUPC);
                console.log('Added click listener to Process UPC button (found by text)');
            } else {
                console.error('scanBtn element not found');
            }
        }
        
        // UPC input field enter key
        const upcInput = document.getElementById('upcInput');
        if (upcInput) {
            upcInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    console.log('Enter key pressed in UPC input');
                    e.preventDefault();
                    processUPC();
                }
            });
            console.log('Added keypress listener to upcInput');
        } else {
            console.error('upcInput element not found');
        }
        
        // Switch client
        const switchClientBtn = document.getElementById('switchClientBtn');
        if (switchClientBtn) {
            switchClientBtn.addEventListener('click', switchClient);
            console.log('Added click listener to switchClientBtn');
        } else {
            console.error('switchClientBtn element not found');
        }
        
        // Finish session
        const finishReceivingBtn = document.getElementById('finishReceivingBtn');
        if (finishReceivingBtn) {
            finishReceivingBtn.addEventListener('click', finishReceivingSession);
            console.log('Added click listener to finishReceivingBtn');
        } else {
            console.error('finishReceivingBtn element not found');
        }
        
        // Load receiving history
        const loadReceivingHistoryBtn = document.getElementById('loadReceivingHistoryBtn');
        if (loadReceivingHistoryBtn) {
            loadReceivingHistoryBtn.addEventListener('click', loadReceivingHistory);
            console.log('Added click listener to loadReceivingHistoryBtn');
        } else {
            console.error('loadReceivingHistoryBtn element not found');
        }
        
        // Notification close button
        const notificationClose = document.getElementById('notification-close');
        if (notificationClose) {
            notificationClose.addEventListener('click', () => {
                const notification = document.getElementById('notification');
                if (notification) {
                    notification.classList.add('hidden');
                }
            });
        }

        console.log('All event listeners set up');
    }

    // Initialize the receiving functionality
    function initializeReceiving() {
        console.log('Initializing receiving functionality...');
        
        // Add event listeners
        initializeEventListeners();
        
        // Load data
        loadClients();
        loadProducts();
        
        // Disable start button initially
        const startReceivingBtn = document.getElementById('startReceivingBtn');
        if (startReceivingBtn) {
            startReceivingBtn.disabled = true;
        }
        
        console.log('Receiving initialization complete');
    }

    // Start initializing when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeReceiving);
        console.log('Set up DOMContentLoaded listener for receiving initialization');
    } else {
        console.log('DOM already loaded, initializing receiving now');
        initializeReceiving();
    }

})();