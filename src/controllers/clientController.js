const supabase = require('../config/supabase');

// Get all clients
exports.getAllClients = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).json({ message: 'Failed to fetch clients', error: err.message });
  }
};

// Get a single client
exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Client not found' });
      }
      throw error;
    }
    
    res.json(data);
  } catch (err) {
    console.error('Error fetching client:', err);
    res.status(500).json({ message: 'Failed to fetch client', error: err.message });
  }
};

// Create a new client
exports.createClient = async (req, res) => {
  try {
    const { name, code, contactName, email, phone, address, notes } = req.body;
    
    // Basic validation
    if (!name || !code) {
      return res.status(400).json({ message: 'Name and code are required' });
    }
    
    // Check if code already exists
    const { data: existingClients, error: checkError } = await supabase
      .from('clients')
      .select('id')
      .eq('code', code)
      .limit(1);
      
    if (checkError) throw checkError;
    
    if (existingClients.length > 0) {
      return res.status(400).json({ message: 'Client code must be unique' });
    }
    
    // Create the client
    const { data, error } = await supabase
      .from('clients')
      .insert([
        { 
          name, 
          code: code.toUpperCase(), 
          contact_name: contactName, 
          email, 
          phone,
          street_address: address?.street,
          city: address?.city,
          state: address?.state,
          zip_code: address?.zipCode,
          country: address?.country || 'USA',
          notes,
          active: true
        }
      ])
      .select()
      .single();
      
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (err) {
    console.error('Error creating client:', err);
    res.status(500).json({ message: 'Failed to create client', error: err.message });
  }
};

// Update a client
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, contactName, email, phone, address, active, notes } = req.body;
    
    // Check if client exists
    const { data: existingClient, error: checkError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
      
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return res.status(404).json({ message: 'Client not found' });
      }
      throw checkError;
    }
    
    // Check if code is being changed and if it already exists
    if (code && code !== existingClient.code) {
      const { data: existingCode, error: codeError } = await supabase
        .from('clients')
        .select('id')
        .eq('code', code)
        .limit(1);
        
      if (codeError) throw codeError;
      
      if (existingCode.length > 0) {
        return res.status(400).json({ message: 'Client code must be unique' });
      }
    }
    
    // Update the client
    const { data, error } = await supabase
      .from('clients')
      .update({ 
        name: name || existingClient.name,
        code: code ? code.toUpperCase() : existingClient.code,
        contact_name: contactName !== undefined ? contactName : existingClient.contact_name,
        email: email !== undefined ? email : existingClient.email,
        phone: phone !== undefined ? phone : existingClient.phone,
        street_address: address?.street !== undefined ? address.street : existingClient.street_address,
        city: address?.city !== undefined ? address.city : existingClient.city,
        state: address?.state !== undefined ? address.state : existingClient.state,
        zip_code: address?.zipCode !== undefined ? address.zipCode : existingClient.zip_code,
        country: address?.country !== undefined ? address.country : existingClient.country,
        active: active !== undefined ? active : existingClient.active,
        notes: notes !== undefined ? notes : existingClient.notes,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    console.error('Error updating client:', err);
    res.status(500).json({ message: 'Failed to update client', error: err.message });
  }
};

// Delete a client
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if client exists
    const { data: existingClient, error: checkError } = await supabase
      .from('clients')
      .select('id')
      .eq('id', id)
      .single();
      
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return res.status(404).json({ message: 'Client not found' });
      }
      throw checkError;
    }
    
    // Delete the client
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    console.error('Error deleting client:', err);
    res.status(500).json({ message: 'Failed to delete client', error: err.message });
  }
};