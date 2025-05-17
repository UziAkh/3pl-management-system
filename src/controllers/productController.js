const supabase = require('../config/supabase');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { clientId } = req.query;
    
    let query = supabase
      .from('products')
      .select('*')
      .order('name');
    
    // Filter by client if provided
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
};

// Get a single product
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Product not found' });
      }
      throw error;
    }
    
    res.json(data);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Failed to fetch product', error: err.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, sku, upc, clientId, description, quantity } = req.body;
    
    // Basic validation
    if (!name || !sku || !clientId) {
      return res.status(400).json({ message: 'Name, SKU, and client ID are required' });
    }
    
    // Check if SKU already exists
    const { data: existingSku, error: skuError } = await supabase
      .from('products')
      .select('id')
      .eq('sku', sku)
      .limit(1);
      
    if (skuError) throw skuError;
    
    if (existingSku.length > 0) {
      return res.status(400).json({ message: 'SKU must be unique' });
    }
    
    // Create the product
    const { data, error } = await supabase
      .from('products')
      .insert([
        { 
          name, 
          sku, 
          upc, 
          client_id: clientId, 
          description,
          quantity: quantity || 0
        }
      ])
      .select()
      .single();
      
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sku, upc, clientId, description, quantity } = req.body;
    
    // Check if product exists
    const { data: existingProduct, error: checkError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
      
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return res.status(404).json({ message: 'Product not found' });
      }
      throw checkError;
    }
    
    // Check if SKU is being changed and if it already exists
    if (sku && sku !== existingProduct.sku) {
      const { data: existingSku, error: skuError } = await supabase
        .from('products')
        .select('id')
        .eq('sku', sku)
        .limit(1);
        
      if (skuError) throw skuError;
      
      if (existingSku.length > 0) {
        return res.status(400).json({ message: 'SKU must be unique' });
      }
    }
    
    // Update the product
    const { data, error } = await supabase
      .from('products')
      .update({ 
        name: name || existingProduct.name,
        sku: sku || existingProduct.sku,
        upc: upc !== undefined ? upc : existingProduct.upc,
        client_id: clientId || existingProduct.client_id,
        description: description !== undefined ? description : existingProduct.description,
        quantity: quantity !== undefined ? quantity : existingProduct.quantity,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if product exists
    const { data: existingProduct, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('id', id)
      .single();
      
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return res.status(404).json({ message: 'Product not found' });
      }
      throw checkError;
    }
    
    // Delete the product
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
};

// Find product by UPC
exports.getProductByUpc = async (req, res) => {
  try {
    const { upc } = req.params;
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('upc', upc)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Product not found' });
      }
      throw error;
    }
    
    res.json(data);
  } catch (err) {
    console.error('Error fetching product by UPC:', err);
    res.status(500).json({ message: 'Failed to fetch product', error: err.message });
  }
};