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
        showNotification('Client added successfully!', 'success');
        document.getElementById('addClientForm').reset();
        addClientCard.style.display = 'none';
        loadClients();
        loadDashboardStats();
      } else {
        const error = await response.json();
        showNotification(`Error: ${error.message}`, 'error');
      }
    } catch (error) {
      showNotification(`Error: ${error.message}`, 'error');
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
    
    showNotification('Client updated successfully!', 'success');
    loadClients();
  } catch (error) {
    showNotification(`Error: ${error.message}`, 'error');
  }
}

async function deleteClient(id) {
  if (!confirm('Are you sure you want to delete this client?')) return;
  
  try {
    const response = await fetch(`/api/clients/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      showNotification('Client deleted successfully!', 'success');
      loadClients();
      loadDashboardStats(); // Refresh dashboard after deletion
    } else {
      const error = await response.json();
      showNotification(`Error: ${error.message}`, 'error');
    }
  } catch (error) {
    showNotification(`Error: ${error.message}`, 'error');
  }
}