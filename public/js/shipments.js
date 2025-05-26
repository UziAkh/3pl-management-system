// Shipments tab functionality
(function() {
    'use strict';

    // State management
    let allShipments = [];
    let allClients = [];

    // DOM elements
    const elements = {
        loadShipmentsBtn: null,
        shipmentClientFilter: null,
        shipmentDateFilter: null,
        shipmentsList: null,
        shipmentCount: null
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

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Load clients for the filter dropdown
    async function loadClients() {
        try {
            const response = await fetch('/api/clients');
            if (!response.ok) throw new Error('Failed to fetch clients');
            
            allClients = await response.json();
            populateClientFilter();
        } catch (error) {
            console.error('Error loading clients:', error);
            showNotification('Failed to load clients: ' + error.message);
        }
    }

    // Populate client filter dropdown
    function populateClientFilter() {
        if (!elements.shipmentClientFilter) return;
        
        // Clear existing options except the first one
        elements.shipmentClientFilter.innerHTML = '<option value="">All Clients</option>';
        
        // Add active clients
        const activeClients = allClients.filter(client => client.active);
        
        activeClients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = client.name;
            elements.shipmentClientFilter.appendChild(option);
        });
    }

    // Load all shipments
    async function loadShipments() {
        if (!elements.shipmentsList) return;
        
        try {
            elements.shipmentsList.innerHTML = '<p class="loading-message">Loading shipments...</p>';
            
            const response = await fetch('/api/shipments');
            if (!response.ok) throw new Error('Failed to fetch shipments');
            
            allShipments = await response.json();
            console.log('Loaded shipments:', allShipments);
            
            applyFilters();
            
        } catch (error) {
            console.error('Error loading shipments:', error);
            elements.shipmentsList.innerHTML = `<p class="error-message">Error loading shipments: ${error.message}</p>`;
            showNotification('Failed to load shipments: ' + error.message);
        }
    }

    // Apply current filters
    function applyFilters() {
        let filteredShipments = [...allShipments];
        
        // Filter by client
        const selectedClientId = elements.shipmentClientFilter ? elements.shipmentClientFilter.value : '';
        if (selectedClientId) {
            filteredShipments = filteredShipments.filter(shipment => shipment.client_id === selectedClientId);
        }
        
        // Filter by date
        const dateFilter = elements.shipmentDateFilter ? elements.shipmentDateFilter.value : '';
        if (dateFilter) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            
            filteredShipments = filteredShipments.filter(shipment => {
                const shipmentDate = new Date(shipment.created_at);
                
                switch (dateFilter) {
                    case 'today':
                        return shipmentDate >= today;
                    case 'week':
                        const weekAgo = new Date(today);
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return shipmentDate >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(today);
                        monthAgo.setMonth(monthAgo.getMonth() - 1);
                        return shipmentDate >= monthAgo;
                    default:
                        return true;
                }
            });
        }
        
        displayShipments(filteredShipments);
    }

    // Display shipments
    function displayShipments(shipments) {
        if (!elements.shipmentsList || !elements.shipmentCount) return;
        
        // Update count
        elements.shipmentCount.textContent = `${shipments.length} shipment${shipments.length !== 1 ? 's' : ''}`;
        
        if (shipments.length === 0) {
            elements.shipmentsList.innerHTML = '<p class="empty-message">No shipments found matching your filters.</p>';
            return;
        }
        
        const shipmentsHtml = shipments.map(shipment => {
            const clientName = shipment.clients ? shipment.clients.name : 'Unknown Client';
            const boxName = shipment.box_types ? shipment.box_types.name : 'Unknown Box';
            
            return `
                <div class="shipment-card" data-shipment-id="${shipment.id}">
                    <div class="shipment-header">
                        <div class="shipment-id">
                            <strong>Shipment #${shipment.reference || shipment.id.slice(-8)}</strong>
                        </div>
                        <div class="shipment-date">
                            ${formatDate(shipment.created_at)}
                        </div>
                    </div>
                    
                    <div class="shipment-details">
                        <div class="detail-item">
                            <span class="detail-label">Client:</span>
                            <span class="detail-value">${escapeHtml(clientName)}</span>
                        </div>
                        
                        <div class="detail-item">
                            <span class="detail-label">Box Type:</span>
                            <span class="detail-value">${escapeHtml(boxName)}</span>
                        </div>
                        
                        <div class="detail-item">
                            <span class="detail-label">Total Cost:</span>
                            <span class="detail-value cost">${formatCurrency(shipment.total_cost)}</span>
                        </div>
                    </div>
                    
                    ${shipment.notes ? `
                    <div class="shipment-notes">
                        <span class="detail-label">Notes:</span>
                        <span class="detail-value">${escapeHtml(shipment.notes)}</span>
                    </div>
                    ` : ''}
                    
                    <div class="shipment-actions">
                        <button class="btn btn-secondary btn-sm view-details-btn" data-shipment-id="${shipment.id}">
                            <span class="btn-icon">👁️</span>
                            View Details
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        elements.shipmentsList.innerHTML = shipmentsHtml;
        
        // Add event listeners for view details buttons
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', () => viewShipmentDetails(btn.dataset.shipmentId));
        });
    }

    // View shipment details
async function viewShipmentDetails(shipmentId) {
    try {
        const modal = document.getElementById('shipmentDetailsModal');
        const content = document.getElementById('shipmentDetailsContent');
        
        if (!modal || !content) {
            console.error('Modal elements not found');
            return;
        }
        
        // Show modal with loading state
        content.innerHTML = '<p class="loading-message">Loading shipment details...</p>';
        modal.classList.remove('hidden');
        
        // Find the shipment in our data
        const shipment = allShipments.find(s => s.id === shipmentId);
        if (!shipment) {
            throw new Error('Shipment not found');
        }
        
        // Fetch shipment items
        const itemsResponse = await fetch(`/api/shipments/${shipmentId}/items`);
        if (!itemsResponse.ok) {
            throw new Error('Failed to fetch shipment items');
        }
        
        const shipmentItems = await itemsResponse.json();
        
        // Render the details
        renderShipmentDetails(shipment, shipmentItems);
        
    } catch (error) {
        console.error('Error loading shipment details:', error);
        const content = document.getElementById('shipmentDetailsContent');
        if (content) {
            content.innerHTML = `<p class="error-message">Error loading shipment details: ${error.message}</p>`;
        }
    }
}

// Render shipment details in modal
function renderShipmentDetails(shipment, items) {
    const content = document.getElementById('shipmentDetailsContent');
    if (!content) return;
    
    const clientName = shipment.clients ? shipment.clients.name : 'Unknown Client';
    const boxName = shipment.box_types ? shipment.box_types.name : 'Unknown Box';
    
    // Calculate totals
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const uniqueProducts = items.length;
    
    const detailsHtml = `
        <div class="shipment-details-header">
            <div class="shipment-details-grid">
                <div class="detail-item">
                    <span class="detail-label">Shipment Reference</span>
                    <span class="detail-value">${escapeHtml(shipment.reference || shipment.id.slice(-8))}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Client</span>
                    <span class="detail-value">${escapeHtml(clientName)}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Box Type</span>
                    <span class="detail-value">${escapeHtml(boxName)}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Total Cost</span>
                    <span class="detail-value cost">${formatCurrency(shipment.total_cost)}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Ship Date</span>
                    <span class="detail-value">${formatDate(shipment.created_at)}</span>
                </div>
                
                ${shipment.notes ? `
                <div class="detail-item">
                    <span class="detail-label">Notes</span>
                    <span class="detail-value">${escapeHtml(shipment.notes)}</span>
                </div>
                ` : ''}
            </div>
        </div>
        
        <div class="shipment-items-section">
            <h4 class="shipment-items-title">
                📦 Products Shipped
            </h4>
            
            ${items.length === 0 ? `
                <div class="no-items-message">
                    No items found for this shipment
                </div>
            ` : items.map(item => `
                <div class="shipment-item-card">
                    <div class="item-header">
                        <div class="item-name">${escapeHtml(item.products ? item.products.name : 'Unknown Product')}</div>
                        <div class="item-quantity">Qty: ${item.quantity}</div>
                    </div>
                    
                    <div class="item-details">
                        <div class="item-detail">
                            <span class="item-detail-label">SKU</span>
                            <span class="item-detail-value">${escapeHtml(item.products ? item.products.sku : 'N/A')}</span>
                        </div>
                        
                        <div class="item-detail">
                            <span class="item-detail-label">UPC</span>
                            <span class="item-detail-value">${escapeHtml(item.products ? item.products.upc : 'N/A')}</span>
                        </div>
                        
                        <div class="item-detail">
                            <span class="item-detail-label">Description</span>
                            <span class="item-detail-value">${escapeHtml(item.products ? item.products.description : 'N/A')}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="shipment-summary-section">
            <h4 class="summary-title">Shipment Summary</h4>
            <div class="summary-grid">
                <div class="summary-item">
                    <div class="summary-value">${totalItems}</div>
                    <div class="summary-label">Total Items</div>
                </div>
                
                <div class="summary-item">
                    <div class="summary-value">${uniqueProducts}</div>
                    <div class="summary-label">Unique Products</div>
                </div>
                
                <div class="summary-item">
                    <div class="summary-value">${formatCurrency(shipment.total_cost)}</div>
                    <div class="summary-label">Total Cost</div>
                </div>
            </div>
        </div>
    `;
    
    content.innerHTML = detailsHtml;
}

    // Initialize DOM elements
    function initializeElements() {
        elements.loadShipmentsBtn = document.getElementById('loadShipmentsBtn');
        elements.shipmentClientFilter = document.getElementById('shipmentClientFilter');
        elements.shipmentDateFilter = document.getElementById('shipmentDateFilter');
        elements.shipmentsList = document.getElementById('shipmentsList');
        elements.shipmentCount = document.getElementById('shipmentCount');
    }

    // Initialize event listeners
    function initializeEventListeners() {
        if (elements.loadShipmentsBtn) {
            elements.loadShipmentsBtn.addEventListener('click', loadShipments);
        }
        
        if (elements.shipmentClientFilter) {
            elements.shipmentClientFilter.addEventListener('change', applyFilters);
        }
        
        if (elements.shipmentDateFilter) {
            elements.shipmentDateFilter.addEventListener('change', applyFilters);
        }

        // Modal close functionality
        const closeModal = document.getElementById('closeShipmentModal');
        const modal = document.getElementById('shipmentDetailsModal');
        const modalOverlay = modal ? modal.querySelector('.modal-overlay') : null;

        if (closeModal && modal) {
            closeModal.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }

        if (modalOverlay && modal) {
            modalOverlay.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
            }
        });
    }

    // Initialize the shipments functionality
    function initializeShipments() {
        console.log('Initializing shipments tab...');
        
        initializeElements();
        initializeEventListeners();
        
        // Load initial data
        loadClients();
        
        console.log('Shipments tab initialized successfully');
    }

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeShipments);
    } else {
        initializeShipments();
    }

})();