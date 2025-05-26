// Fresh start - Simple Receiving System
console.log('🆕 Loading fresh receiving system...');

// Simple product database for UPC lookups
const UPC_DATABASE = {
  '016000476738': 'General Mills Cheerios',
  '016571960230': 'Skippy Peanut Butter', 
  '038000138416': 'Kelloggs Rice Krispies',
  '011110806765': 'Coca-Cola Classic',
  '012000001031': 'Sprite 12oz Can',
  '028400064057': 'Doritos Nacho Cheese'
};

// Current receiving session
let receivingSession = {
  isActive: false,
  clientId: null,
  clientName: null,
  items: []
};

console.log('📦 Available UPCs:', Object.keys(UPC_DATABASE));

// Load clients into dropdown
async function loadClients() {
  try {
    console.log('📋 Loading clients...');
    const response = await fetch('/api/clients');
    const clients = await response.json();
    
    const select = document.getElementById('receivingClient');
    if (!select) {
      console.error('❌ Client select element not found');
      return;
    }
    
    select.innerHTML = '<option value="">Choose client...</option>';
    
    clients.filter(c => c.active).forEach(client => {
      const option = document.createElement('option');
      option.value = client.id;
      option.textContent = client.name;
      select.appendChild(option);
    });
    
    console.log('✅ Loaded', clients.length, 'clients');
  } catch (error) {
    console.error('❌ Error loading clients:', error);
  }
}

// Start receiving session
function startSession() {
  const select = document.getElementById('receivingClient');
  if (!select || !select.value) {
    alert('Please select a client first');
    return;
  }
  
  const clientId = select.value;
  const clientName = select.options[select.selectedIndex].text;
  
  receivingSession = {
    isActive: true,
    clientId: clientId,
    clientName: clientName,
    items: []
  };

  // Clear the items display immediately
  updateDisplay();
  
  // Update UI
  document.getElementById('receivingSelection').style.display = 'none';
  document.getElementById('receivingSession').style.display = 'block';
  document.getElementById('currentClient').textContent = clientName;
  document.getElementById('itemsScanned').textContent = '0';
  
  console.log('🚀 Started session for:', clientName);
  
  // Focus UPC input
  const upcInput = document.getElementById('upcInput');
  if (upcInput) {
    upcInput.focus();
  }
}

// Look up product name by UPC using API (MOVED OUTSIDE)
async function getProductName(upc) {
  console.log('🔍 Looking up UPC via API:', upc);
  
  try {
    const response = await fetch(`/api/upc/${upc}`); // ← This calls your UPC controller
    const data = await response.json();
    
    if (data.found && data.title) {
      console.log('✅ Found via API:', data.title);
      return data.title;
    } else {
      console.log('❌ Not found in API, using generic name');
      return `Product UPC-${upc}`;
    }
  } catch (error) {
    console.error('❌ API lookup failed:', error);
    return `Product UPC-${upc}`;
  }
}

// Process a UPC scan
async function processUPC() {
  console.log('🎯 Process UPC clicked');
  
  if (!receivingSession.isActive) {
    alert('No receiving session active. Please start a session first.');
    return;
  }
  
  // Get UPC from input
  const upcInput = document.getElementById('upcInput');
  let upc = '';
  
  if (upcInput && upcInput.value.trim()) {
    upc = upcInput.value.trim();
    console.log('📱 Got UPC from input:', upc);
  } else {
    console.log('❌ No UPC in input field');
    alert('Please enter a UPC in the input field first');
    return;
  }
  
  try {
    // Look up product name (FIXED - NOW ACTUALLY CALLING THE FUNCTION!)
    const productName = await getProductName(upc);
    console.log('🏷️ Product name:', productName);
    
    // Check if product exists for this client
    const productsResponse = await fetch(`/api/products?clientId=${receivingSession.clientId}`);
    const clientProducts = await productsResponse.json();
    let existingProduct = clientProducts.find(p => p.upc === upc);
    
    // Create product if it doesn't exist
    if (!existingProduct) {
      console.log('➕ Creating new product...');
      const newProduct = {
        name: productName,
        sku: `${receivingSession.clientId.substring(0, 6)}-${upc}`,
        upc: upc,
        clientId: receivingSession.clientId,
        description: '',
        quantity: 0
      };
      
      const createResponse = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      
      if (!createResponse.ok) {
        throw new Error('Failed to create product');
      }
      
      existingProduct = await createResponse.json();
      console.log('✅ Created product:', existingProduct.name);
    } else {
      console.log('📦 Using existing product:', existingProduct.name);
    }
    
    // Add to session
    receivingSession.items.push({
      productId: existingProduct.id,
      name: existingProduct.name,
      upc: upc,
      quantity: 1
    });
    
    // Create inbound transaction
    const transactionResponse = await fetch('/api/transactions/inbound', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: existingProduct.id,
        quantity: 1,
        reference: `RCV-${Date.now()}`,
        notes: `Scanned UPC: ${upc}`
      })
    });
    
    if (!transactionResponse.ok) {
      throw new Error('Failed to create transaction');
    }
    
    // Update UI
    updateDisplay();
    
    // Clear input and focus
    if (upcInput) {
      upcInput.value = '';
      upcInput.focus();
    }
    
    // Show success
    showSuccess(`Added: ${existingProduct.name}`);
    
  } catch (error) {
    console.error('❌ Error processing UPC:', error);
    alert('Error: ' + error.message);
  }
}

// Update the display
function updateDisplay() {
  const itemCount = receivingSession.items.length;
  
  // Update counter
  const counter = document.getElementById('itemsScanned');
  if (counter) {
    counter.textContent = itemCount;
  }
  
  // Update items list
  const list = document.getElementById('sessionItemsList');
  if (!list) return;
  
  if (itemCount === 0) {
    list.innerHTML = '<p>No items scanned yet...</p>';
    return;
  }
  
  // Group by product
  const grouped = {};
  receivingSession.items.forEach(item => {
    if (grouped[item.productId]) {
      grouped[item.productId].quantity += 1;
    } else {
      grouped[item.productId] = { ...item };
    }
  });
  
  // Build HTML
  list.innerHTML = Object.values(grouped).map(item => `
    <div style="background: #f5f5f5; padding: 12px; margin: 8px 0; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <strong>${item.name}</strong><br>
        <small style="color: #666;">UPC: ${item.upc}</small>
      </div>
      <div style="font-weight: bold; color: #059669;">+${item.quantity}</div>
    </div>
  `).join('');
}

// Show success message
function showSuccess(message) {
  const popup = document.createElement('div');
  popup.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #059669;
    color: white;
    padding: 20px 30px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 10000;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  `;
  popup.innerHTML = `
    <div style="font-size: 24px; margin-bottom: 8px;">✅</div>
    <div>${message}</div>
  `;
  
  document.body.appendChild(popup);
  
  setTimeout(() => {
    popup.remove();
  }, 2000);
}

// Switch client
function switchClient() {
  if (receivingSession.items.length > 0) {
    if (!confirm('This will end your current session. Continue?')) {
      return;
    }
  }
  
  receivingSession = { isActive: false, clientId: null, clientName: null, items: [] };
  
  document.getElementById('receivingSelection').style.display = 'block';
  document.getElementById('receivingSession').style.display = 'none';
  document.getElementById('receivingClient').value = '';
}

// Finish session
function finishSession() {
  const count = receivingSession.items.length;
  const client = receivingSession.clientName;
  
  if (count === 0) {
    if (!confirm('No items scanned. End session anyway?')) {
      return;
    }
  }
  
  alert(`Session Complete!\n\nClient: ${client}\nItems: ${count}\n\nInventory updated successfully.`);
  
  // Reset
  receivingSession = { isActive: false, clientId: null, clientName: null, items: [] };
  document.getElementById('receivingSelection').style.display = 'block';
  document.getElementById('receivingSession').style.display = 'none';
  document.getElementById('receivingClient').value = '';
}

// Set up all event listeners
function setupEventListeners() {
  console.log('🔧 Setting up event listeners...');
  
  // Client selection change
  const clientSelect = document.getElementById('receivingClient');
  if (clientSelect) {
    clientSelect.addEventListener('change', function() {
      const startBtn = document.getElementById('startReceivingBtn');
      if (startBtn) {
        startBtn.disabled = !this.value;
      }
    });
  }
  
  // Start session button
  const startBtn = document.getElementById('startReceivingBtn');
  if (startBtn) {
    startBtn.addEventListener('click', startSession);
    startBtn.disabled = true; // Initially disabled
  }
  
  // Process UPC button - try multiple ways to find it
  let processBtnFound = false;
  
  // Try by ID first
  const scanBtn = document.getElementById('scanBtn');
  if (scanBtn) {
    scanBtn.addEventListener('click', processUPC);
    processBtnFound = true;
    console.log('✅ Found process button by ID');
  }
  
  // If not found by ID, find by text content
  if (!processBtnFound) {
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(btn => {
      if (btn.textContent && (
          btn.textContent.includes('Process UPC') ||
          btn.textContent.includes('Process') ||
          btn.textContent.includes('Scan')
      )) {
        btn.addEventListener('click', processUPC);
        processBtnFound = true;
        console.log('✅ Found process button by text:', btn.textContent);
      }
    });
  }
  
  if (!processBtnFound) {
    console.log('⚠️ Process UPC button not found');
  }
  
  // UPC input - Enter key
  const upcInput = document.getElementById('upcInput');
  if (upcInput) {
    upcInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        processUPC();
      }
    });
    console.log('✅ UPC input enter key handler added');
  } else {
    console.log('⚠️ UPC input not found');
  }
  
  // Switch client button
  const switchBtn = document.getElementById('switchClientBtn');
  if (switchBtn) {
    switchBtn.addEventListener('click', switchClient);
  }
  
  // Finish session button
  const finishBtn = document.getElementById('finishReceivingBtn');
  if (finishBtn) {
    finishBtn.addEventListener('click', finishSession);
  }
  
  console.log('✅ Event listeners setup complete');
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎬 Page loaded - initializing receiving system');
  
  setupEventListeners();
  loadClients();
  
  console.log('🎉 Receiving system ready!');
  console.log('📝 Try these UPCs:', Object.keys(UPC_DATABASE).join(', '));
});