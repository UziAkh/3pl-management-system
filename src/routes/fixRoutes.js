const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Fix product names for products with UPCs
router.post('/update-product-names', async (req, res) => {
  try {
    console.log('Starting product name update...');
    
    // Get all products that have UPCs but generic names
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .not('upc', 'is', null)
      .like('name', 'Unknown Product%');
    
    if (fetchError) throw fetchError;
    
    console.log(`Found ${products.length} products to update`);
    let updatedCount = 0;
    let errors = [];
    
    // Update each product
    for (const product of products) {
      try {
        console.log(`Looking up UPC: ${product.upc}`);
        
        // Call our UPC lookup API
        const response = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${product.upc}`);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
          const productInfo = data.items[0];
          const newName = productInfo.title;
          const newDescription = productInfo.brand ? `Brand: ${productInfo.brand}` : product.description;
          
          // Update the product in database
          const { error: updateError } = await supabase
            .from('products')
            .update({
              name: newName,
              description: newDescription,
              updated_at: new Date()
            })
            .eq('id', product.id);
          
          if (updateError) {
            console.error(`Error updating product ${product.id}:`, updateError);
            errors.push(`Product ${product.upc}: ${updateError.message}`);
          } else {
            console.log(`✅ Updated ${product.upc} → ${newName}`);
            updatedCount++;
          }
        } else {
          console.log(`❌ No product info found for UPC: ${product.upc}`);
        }
        
        // Add a small delay to avoid hitting API rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`Error processing product ${product.upc}:`, error);
        errors.push(`Product ${product.upc}: ${error.message}`);
      }
    }
    
    res.json({
      success: true,
      message: `Updated ${updatedCount} out of ${products.length} products`,
      updatedCount,
      totalCount: products.length,
      errors: errors.length > 0 ? errors : undefined
    });
    
  } catch (error) {
    console.error('Error in product name update:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product names',
      error: error.message
    });
  }
});

module.exports = router;