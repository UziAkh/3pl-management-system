// Receiving functionality for 3PL Management System
let currentReceivingSession = {
  clientId: null,
  clientName: null,
  items: [],
  sessionId: null,
  startTime: null
};

// Load clients for the receiving dropdown
async function loadReceivingClients() {
  try {
    const response = await fetch('/api/clients');
    const clients = await response.json();
    
    const clientSelect = document.getElementById('receivingClient');
    clientSelect.innerHTML = '<option value="">Choose a client to receive for...</option>';
    
    clients.forEach(client => {
      if (client.active) {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.name;
        clientSelect.appendChild(option);
      }
    });
  } catch (error) {
    console.error('Error loading clients:', error);
    alert('Failed to load clients');
  }
}

// Updated UPC Lookup function (using our backend endpoint)
async function lookupUPC(upc) {
  console.log(`Looking up UPC: ${upc}`);
  
  try {
    // Call our backend UPC lookup endpoint
    const response = await fetch(`/api/upc/lookup/${upc}`);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ UPC lookup successful:', data.name);
      return {
        success: true,
        name: data.name,
        brand: data.brand || '',
        upc: data.upc
      };
    } else {
      console.log('❌ UPC not found in database');
      return {
        success: false,
        name: data.name || `Unknown Product - UPC ${upc}`,
        brand: '',
        upc: upc
      };
    }
  } catch (error) {
    console.error('UPC lookup failed:', error);
    return {
      success: false,
      name: `Unknown Product - UPC ${upc}`,
      brand: '',
      upc: upc
    };
  }
}

// Start receiving session
function startReceivingSession() {
  const clientSelect = document.getElementById('receivingClient');
  const clientId = clientSelect.value;
  const clientName = clientSelect.options[clientSelect.selectedIndex].text;
  
  if (!clientId) {
    alert('Please select a client first');
    return;
  }
  
  // Initialize session
  currentReceivingSession = {
    clientId: clientId,
    clientName: clientName,
    items: [],
    sessionId: Date.now().toString(),
    startTime: new Date()
  };
  
  // Update UI
  document.getElementById('receivingSelection').style.display = 'none';
  document.getElementById('receivingSession').style.display = 'block';
  document.getElementById('currentClient').textContent = clientName;
  document.getElementById('itemsScanned').textContent = '0';
  document.getElementById('upcInput').focus();
  
  console.log('Started receiving session for:', clientName);
}

// Updated processUPC function with proper client ID handling
async function processUPC() {
  const upcInput = document.getElementById('upcInput');
  const upc = upcInput.value.trim();
  
  if (!upc) {
    alert('Please scan or enter a UPC');
    return;
  }
  
  if (!currentReceivingSession.clientId) {
    alert('No receiving session active');
    return;
  }
  
  // Show loading state
  const scanBtn = document.getElementById('scanBtn');
  const originalBtnText = scanBtn.innerHTML;
  scanBtn.innerHTML = '<span class="btn-icon">⏳</span>Processing...';
  scanBtn.disabled = true;
  
  try {
    // Look up product info
    const productInfo = await lookupUPC(upc);
    
    // Check if this UPC already exists as a product for this SPECIFIC CLIENT
    let existingProduct = null;
    try {
      // Get all products for this client first
      const response = await fetch(`/api/products?clientId=${currentReceivingSession.clientId}`);
      if (response.ok) {
        const clientProducts = await response.json();
        // Find the product with matching UPC that belongs to this client
        existingProduct = clientProducts.find(product => product.upc === upc);
        
        if (existingProduct) {
          console.log('Found existing product for this client and UPC:', existingProduct);
        } else {
          console.log('No existing product found for this client with this UPC');
        }
      }
    } catch (error) {
      console.log('Error checking for existing product:', error);
    }
    
    // If product doesn't exist for this client, create it
    if (!existingProduct) {
      console.log(`Creating new product for client ${currentReceivingSession.clientId}`);
      
      const newProduct = {
  name: productInfo.name,
  sku: `${currentReceivingSession.clientId.substring(0, 8)}-${upc}`,
  upc: upc,
  clientId: currentReceivingSession.clientId,
  description: productInfo.brand ? `Brand: ${productInfo.brand}` : '',
  quantity: 0
};
      
      console.log('Creating product with data:', JSON.stringify(newProduct, null, 2));
      console.log('Product name:', newProduct.name);
      console.log('Product SKU:', newProduct.sku);
      console.log('Product client_id:', newProduct.client_id);
      
      const createResponse = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
      });
      
      if (createResponse.ok) {
        existingProduct = await createResponse.json();
        console.log('Created new product successfully:', existingProduct);
      } else {
        const errorData = await createResponse.json();
        console.error('Failed to create product:', errorData);
        throw new Error(`Failed to create product: ${errorData.message || 'Unknown error'}`);
      }
    } else {
      console.log('Found existing product for this client:', existingProduct);
    }
    
    // Add to current session
    const sessionItem = {
      productId: existingProduct.id,
      upc: upc,
      name: productInfo.name,
      quantity: 1,
      timestamp: new Date()
    };
    
    currentReceivingSession.items.push(sessionItem);
    
    // Update inventory
    const transactionResponse = await fetch('/api/transactions/inbound', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: existingProduct.id,
        quantity: 1,
        reference: `Receiving Session ${currentReceivingSession.sessionId}`,
        notes: `Scanned: ${upc}`
      })
    });
    
    if (!transactionResponse.ok) {
      const errorData = await transactionResponse.json();
      throw new Error(`Failed to create transaction: ${errorData.message || 'Unknown error'}`);
    }
    
    // Update UI
    updateSessionDisplay();
    upcInput.value = '';
    upcInput.focus();
    
    // Show success message
    showScanSuccess(productInfo.name);
    
  } catch (error) {
    console.error('Error processing UPC:', error);
    alert(`Error processing UPC: ${error.message}`);
  } finally {
    // Reset button
    scanBtn.innerHTML = originalBtnText;
    scanBtn.disabled = false;
  }
}

// Update session display
function updateSessionDisplay() {
  const itemsScanned = currentReceivingSession.items.length;
  document.getElementById('itemsScanned').textContent = itemsScanned;
  
  const sessionList = document.getElementById('sessionItemsList');
  
  if (itemsScanned === 0) {
    sessionList.innerHTML = '<p class="empty-message">No items scanned yet...</p>';
    return;
  }
  
  sessionList.innerHTML = '';
  
  // Group items by product
  const groupedItems = {};
  currentReceivingSession.items.forEach(item => {
    if (groupedItems[item.productId]) {
      groupedItems[item.productId].quantity += item.quantity;
    } else {
      groupedItems[item.productId] = {
        name: item.name,
        upc: item.upc,
        quantity: item.quantity
      };
    }
  });
  
  // Display grouped items
  Object.values(groupedItems).forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'session-item';
    itemElement.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f9f9f9; border-radius: 4px; margin-bottom: 8px;">
        <div>
          <strong>${item.name}</strong>
          <div style="font-size: 12px; color: #666;">UPC: ${item.upc}</div>
        </div>
        <div style="font-weight: bold; color: #4f46e5;">+${item.quantity}</div>
      </div>
    `;
    sessionList.appendChild(itemElement);
  });
}

// Show scan success animation
function showScanSuccess(productName) {
  // Create a temporary success message
  const successMsg = document.createElement('div');
  successMsg.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #10b981;
    color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    font-weight: bold;
    text-align: center;
    min-width: 300px;
  `;
  successMsg.innerHTML = `
    <div style="font-size: 24px; margin-bottom: 10px;">✅</div>
    <div>Added: ${productName}</div>
  `;
  
  document.body.appendChild(successMsg);
  
  // Remove after 2 seconds
  setTimeout(() => {
    successMsg.remove();
  }, 2000);
}

// Switch client
function switchClient() {
  if (currentReceivingSession.items.length > 0) {
    if (!confirm('You have scanned items for the current client. Are you sure you want to switch?')) {
      return;
    }
  }
  
  // Reset to client selection
  document.getElementById('receivingSelection').style.display = 'block';
  document.getElementById('receivingSession').style.display = 'none';
  
  // Keep the session data but allow switching
  // The items will be preserved until session is finished
}

// Finish receiving session
function finishReceivingSession() {
  if (currentReceivingSession.items.length === 0) {
    const confirmEmpty = confirm('No items were scanned. Are you sure you want to finish this session?');
    if (!confirmEmpty) return;
  }
  
  // Show summary
  const itemCount = currentReceivingSession.items.length;
  const clientName = currentReceivingSession.clientName;
  
  alert(`Session Complete!\n\nClient: ${clientName}\nItems Scanned: ${itemCount}\n\nInventory has been updated.`);
  
  // Reset session
  currentReceivingSession = {
    clientId: null,
    clientName: null,
    items: [],
    sessionId: null,
    startTime: null
  };
  
  // Reset UI
  document.getElementById('receivingSelection').style.display = 'block';
  document.getElementById('receivingSession').style.display = 'none';
  document.getElementById('upcInput').value = '';
  document.getElementById('receivingClient').value = '';
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Load clients when page loads
  loadReceivingClients();
  
  // Enable/disable start button based on client selection
  document.getElementById('receivingClient').addEventListener('change', function() {
    const startBtn = document.getElementById('startReceivingBtn');
    startBtn.disabled = !this.value;
  });
  
  // Start receiving session
  document.getElementById('startReceivingBtn').addEventListener('click', startReceivingSession);
  
  // Process UPC (scan button)
  document.getElementById('scanBtn').addEventListener('click', processUPC);
  
  // Allow Enter key to process UPC
  document.getElementById('upcInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      processUPC();
    }
  });
  
  // Switch client
  document.getElementById('switchClientBtn').addEventListener('click', switchClient);
  
  // Finish session
  document.getElementById('finishReceivingBtn').addEventListener('click', finishReceivingSession);
  
  // Auto-focus UPC input when it becomes visible
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && 
          mutation.attributeName === 'style' && 
          mutation.target.id === 'receivingSession' &&
          mutation.target.style.display !== 'none') {
        setTimeout(() => {
          document.getElementById('upcInput').focus();
        }, 100);
      }
    });
  });
  
  const receivingSession = document.getElementById('receivingSession');
  if (receivingSession) {
    observer.observe(receivingSession, { attributes: true });
  }
});