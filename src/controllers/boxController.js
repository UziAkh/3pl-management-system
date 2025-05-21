const supabase = require('../config/supabase');

// Get all box types
exports.getAllBoxes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('box_types')
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    console.error('Error fetching box types:', err);
    res.status(500).json({ message: 'Failed to fetch box types', error: err.message });
  }
};

// Get a single box type
exports.getBoxById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('box_types')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Box type not found' });
      }
      throw error;
    }
    
    res.json(data);
  } catch (err) {
    console.error('Error fetching box type:', err);
    res.status(500).json({ message: 'Failed to fetch box type', error: err.message });
  }
};

// Create a new box type
exports.createBox = async (req, res) => {
  try {
    const { name, price, dimensions, description, barcode } = req.body;
    
    // Basic validation
    if (!name || !price || !barcode) {
      return res.status(400).json({ message: 'Name, price, and barcode are required' });
    }
    
    // Check if barcode already exists
    const { data: existingBox, error: checkError } = await supabase
      .from('box_types')
      .select('id')
      .eq('barcode', barcode)
      .limit(1);
      
    if (checkError) throw checkError;
    
    if (existingBox.length > 0) {
      return res.status(400).json({ message: 'Barcode must be unique' });
    }
    
    // Create the box type
    const { data, error } = await supabase
      .from('box_types')
      .insert([
        { 
          name, 
          price: parseFloat(price),
          dimensions,
          description,
          barcode,
          active: true
        }
      ])
      .select()
      .single();
      
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (err) {
    console.error('Error creating box type:', err);
    res.status(500).json({ message: 'Failed to create box type', error: err.message });
  }
};

// Update a box type
exports.updateBox = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, dimensions, description, active } = req.body;
    
    // Check if box type exists
    const { data: existingBox, error: checkError } = await supabase
      .from('box_types')
      .select('*')
      .eq('id', id)
      .single();
      
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return res.status(404).json({ message: 'Box type not found' });
      }
      throw checkError;
    }
    
    // Update the box type
    const { data, error } = await supabase
      .from('box_types')
      .update({ 
        name: name || existingBox.name,
        price: price !== undefined ? parseFloat(price) : existingBox.price,
        dimensions: dimensions !== undefined ? dimensions : existingBox.dimensions,
        description: description !== undefined ? description : existingBox.description,
        active: active !== undefined ? active : existingBox.active,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    console.error('Error updating box type:', err);
    res.status(500).json({ message: 'Failed to update box type', error: err.message });
  }
};

// Delete a box type
exports.deleteBox = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if box type exists
    const { data: existingBox, error: checkError } = await supabase
      .from('box_types')
      .select('id')
      .eq('id', id)
      .single();
      
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return res.status(404).json({ message: 'Box type not found' });
      }
      throw checkError;
    }
    
    // Delete the box type
    const { error } = await supabase
      .from('box_types')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    res.json({ message: 'Box type deleted successfully' });
  } catch (err) {
    console.error('Error deleting box type:', err);
    res.status(500).json({ message: 'Failed to delete box type', error: err.message });
  }
};

// Find box type by barcode
exports.getBoxByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;
    
    const { data, error } = await supabase
      .from('box_types')
      .select('*')
      .eq('barcode', barcode)
      .eq('active', true)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Box type not found' });
      }
      throw error;
    }
    
    res.json(data);
  } catch (err) {
    console.error('Error fetching box type by barcode:', err);
    res.status(500).json({ message: 'Failed to fetch box type', error: err.message });
  }
};