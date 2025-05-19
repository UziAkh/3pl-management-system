const express = require('express');
const router = express.Router();

// UPC Lookup endpoint
router.get('/lookup/:upc', async (req, res) => {
  try {
    const { upc } = req.params;
    
    // Clean the UPC (remove any spaces, dashes)
    const cleanUPC = upc.replace(/\s|-/g, '');
    
    console.log(`Looking up UPC: ${cleanUPC}`);
    
    // Try UPCitemdb first
    const response = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${cleanUPC}`);
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const product = data.items[0];
      return res.json({
        success: true,
        name: product.title,
        brand: product.brand || '',
        category: product.category || '',
        upc: cleanUPC
      });
    }
    
    // If no product found, try OpenFoodFacts as backup
    try {
      const response2 = await fetch(`https://world.openfoodfacts.org/api/v0/product/${cleanUPC}.json`);
      const data2 = await response2.json();
      
      if (data2.status === 1 && data2.product) {
        const product = data2.product;
        return res.json({
          success: true,
          name: product.product_name || product.generic_name || 'Unknown Product',
          brand: product.brands || '',
          category: '',
          upc: cleanUPC
        });
      }
    } catch (error) {
      console.log('OpenFoodFacts backup failed:', error.message);
    }
    
    // If all lookups fail, return unknown product
    res.json({
      success: false,
      name: `Unknown Product - UPC ${cleanUPC}`,
      brand: '',
      category: '',
      upc: cleanUPC
    });
    
  } catch (error) {
    console.error('UPC lookup error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to lookup UPC',
      error: error.message 
    });
  }
});

module.exports = router;