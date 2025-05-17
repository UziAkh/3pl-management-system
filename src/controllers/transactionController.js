const supabase = require('../config/supabase');

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const { type } = req.query;
    
    let query = supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Filter by type if provided
    if (type) {
      query = query.eq('type', type);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ message: 'Failed to fetch transactions', error: err.message });
  }
};

// Get transactions for a specific product
exports.getTransactionsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    console.error('Error fetching product transactions:', err);
    res.status(500).json({ message: 'Failed to fetch transactions', error: err.message });
  }
};

// Create an inbound transaction (receive inventory)
exports.createInboundTransaction = async (req, res) => {
  try {
    const { productId, quantity, reference, notes } = req.body;
    
    // Validation
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Product ID and positive quantity are required' });
    }
    
    // Start a Supabase transaction
    // Note: Supabase doesn't have built-in transactions, so we'll implement it manually
    
    // 1. Get the current product quantity
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('quantity')
      .eq('id', productId)
      .single();
      
    if (productError) {
      if (productError.code === 'PGRST116') {
        return res.status(404).json({ message: 'Product not found' });
      }
      throw productError;
    }
    
    const previousQuantity = product.quantity;
    const newQuantity = previousQuantity + quantity;
    
    // 2. Update the product quantity
    const { error: updateError } = await supabase
      .from('products')
      .update({ 
        quantity: newQuantity,
        updated_at: new Date()
      })
      .eq('id', productId);
      
    if (updateError) throw updateError;
    
    // 3. Create the transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert([
        {
          type: 'inbound',
          product_id: productId,
          quantity,
          previous_quantity: previousQuantity,
          new_quantity: newQuantity,
          reference: reference || null,
          notes: notes || null
        }
      ])
      .select()
      .single();
      
    if (transactionError) throw transactionError;
    
    res.status(201).json(transaction);
  } catch (err) {
    console.error('Error creating inbound transaction:', err);
    res.status(500).json({ message: 'Failed to create transaction', error: err.message });
  }
};

// Create an outbound transaction (ship inventory)
exports.createOutboundTransaction = async (req, res) => {
  try {
    const { productId, quantity, reference, notes } = req.body;
    
    // Validation
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Product ID and positive quantity are required' });
    }
    
    // 1. Get the current product quantity
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('quantity')
      .eq('id', productId)
      .single();
      
    if (productError) {
      if (productError.code === 'PGRST116') {
        return res.status(404).json({ message: 'Product not found' });
      }
      throw productError;
    }
    
    const previousQuantity = product.quantity;
    
    // Check if enough inventory
    if (previousQuantity < quantity) {
      return res.status(400).json({ message: 'Not enough inventory available' });
    }
    
    const newQuantity = previousQuantity - quantity;
    
    // 2. Update the product quantity
    const { error: updateError } = await supabase
      .from('products')
      .update({ 
        quantity: newQuantity,
        updated_at: new Date()
      })
      .eq('id', productId);
      
    if (updateError) throw updateError;
    
    // 3. Create the transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert([
        {
          type: 'outbound',
          product_id: productId,
          quantity,
          previous_quantity: previousQuantity,
          new_quantity: newQuantity,
          reference: reference || null,
          notes: notes || null
        }
      ])
      .select()
      .single();
      
    if (transactionError) throw transactionError;
    
    res.status(201).json(transaction);
  } catch (err) {
    console.error('Error creating outbound transaction:', err);
    res.status(500).json({ message: 'Failed to create transaction', error: err.message });
  }
};