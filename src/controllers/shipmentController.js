const supabase = require('../config/supabase');

// Create a new shipment
exports.createShipment = async (req, res) => {
  try {
    const { clientId, totalCost, boxTypeId, reference, notes } = req.body;
    
    // Basic validation
    if (!clientId || !totalCost || !boxTypeId) {
      return res.status(400).json({ message: 'Client ID, total cost, and box type ID are required' });
    }
    
    // Create the shipment
    const { data, error } = await supabase
      .from('shipments')
      .insert([
        { 
          client_id: clientId,
          total_cost: totalCost,
          box_type_id: boxTypeId,
          reference: reference || null,
          notes: notes || null
        }
      ])
      .select()
      .single();
      
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (err) {
    console.error('Error creating shipment:', err);
    res.status(500).json({ message: 'Failed to create shipment', error: err.message });
  }
};

// Get all shipments
exports.getAllShipments = async (req, res) => {
  try {
    const { clientId } = req.query;
    
    let query = supabase
      .from('shipments')
      .select(`
        *,
        clients(name),
        box_types(name, barcode)
      `)
      .order('created_at', { ascending: false });
    
    // Filter by client if provided
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    console.error('Error fetching shipments:', err);
    res.status(500).json({ message: 'Failed to fetch shipments', error: err.message });
  }
};

// Create a shipment item
exports.createShipmentItem = async (req, res) => {
  try {
    const { shipmentId, productId, quantity } = req.body;
    
    // Basic validation
    if (!shipmentId || !productId || !quantity) {
      return res.status(400).json({ message: 'Shipment ID, product ID, and quantity are required' });
    }
    
    // Create the shipment item
    const { data, error } = await supabase
      .from('shipment_items')
      .insert([
        { 
          shipment_id: shipmentId,
          product_id: productId,
          quantity: quantity
        }
      ])
      .select()
      .single();
      
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (err) {
    console.error('Error creating shipment item:', err);
    res.status(500).json({ message: 'Failed to create shipment item', error: err.message });
  }
};

// Get shipment items with product details
exports.getShipmentItems = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
  return res.status(400).json({ message: 'Shipment ID is required' });
    }
    
    // Get shipment items with product details
    const { data, error } = await supabase
      .from('shipment_items')
      .select(`
        *,
        products (
          id,
          name,
          sku,
          upc,
          description
        )
      `)
      .eq('shipment_id', id)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    console.error('Error fetching shipment items:', err);
    res.status(500).json({ message: 'Failed to fetch shipment items', error: err.message });
  }
};