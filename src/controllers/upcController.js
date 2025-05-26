// UPC lookup controller
const https = require('https');

// Lookup product by UPC using UPCitemdb.com API
exports.lookupUPC = async (req, res) => {
  try {
    const { upc } = req.params;
    
    // Validate UPC
    if (!upc || upc.length < 6) {
      return res.status(400).json({ message: 'Valid UPC required' });
    }
    
    console.log(`🔍 Looking up UPC: ${upc}`);
    
    // Call UPCitemdb.com API
    const apiUrl = `https://api.upcitemdb.com/prod/trial/lookup?upc=${upc}`;
    
    const apiData = await makeAPICall(apiUrl);
    
    if (apiData.items && apiData.items.length > 0) {
      const product = apiData.items[0];
      
      const result = {
        found: true,
        upc: upc,
        title: product.title || 'Unknown Product',
        brand: product.brand || '',
        category: product.category || '',
        description: product.description || '',
        image: product.images && product.images.length > 0 ? product.images[0] : null
      };
      
      console.log(`✅ Found product: ${result.title}`);
      res.json(result);
    } else {
      console.log(`❌ Product not found for UPC: ${upc}`);
      res.json({
        found: false,
        upc: upc,
        title: `Product UPC-${upc}`,
        brand: '',
        category: '',
        description: ''
      });
    }
    
  } catch (error) {
    console.error('Error looking up UPC:', error);
    res.status(500).json({ 
      message: 'Failed to lookup UPC', 
      error: error.message,
      found: false,
      upc: req.params.upc,
      title: `Product UPC-${req.params.upc}`
    });
  }
};

// Helper function to make API calls
function makeAPICall(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(new Error('Failed to parse API response'));
        }
      });
      
    }).on('error', (error) => {
      reject(error);
    });
  });
}