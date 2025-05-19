// UPC Lookup Test Script - Updated with your real products
// This will test if we can automatically get product names from UPCs

async function testUPCLookup(upc) {
  console.log(`\n🔍 Looking up UPC: ${upc}`);
  
  try {
    // Test API #1: UPCitemdb (free tier)
    const response1 = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${upc}`);
    const data1 = await response1.json();
    
    if (data1.items && data1.items.length > 0) {
      const product = data1.items[0];
      console.log('✅ SUCCESS with UPCitemdb!');
      console.log(`   Product: ${product.title}`);
      console.log(`   Brand: ${product.brand || 'Unknown'}`);
      console.log(`   Category: ${product.category || 'Unknown'}`);
      return {
        success: true,
        source: 'UPCitemdb',
        name: product.title,
        brand: product.brand,
        category: product.category
      };
    }
  } catch (error) {
    console.log('❌ UPCitemdb failed:', error.message);
  }

  try {
    // Test API #2: World of UPC (backup)
    const response2 = await fetch(`https://world.openfoodfacts.org/api/v0/product/${upc}.json`);
    const data2 = await response2.json();
    
    if (data2.status === 1 && data2.product) {
      const product = data2.product;
      console.log('✅ SUCCESS with OpenFoodFacts!');
      console.log(`   Product: ${product.product_name || product.generic_name}`);
      console.log(`   Brand: ${product.brands || 'Unknown'}`);
      return {
        success: true,
        source: 'OpenFoodFacts',
        name: product.product_name || product.generic_name,
        brand: product.brands
      };
    }
  } catch (error) {
    console.log('❌ OpenFoodFacts failed:', error.message);
  }

  console.log('❌ No product info found for this UPC');
  return {
    success: false,
    name: `Unknown Product - UPC ${upc}`
  };
}

// Test with your real products
async function runTests() {
  console.log('🧪 Testing UPC Lookup APIs with your products...\n');
  
  // Your real product UPCs
  const testProducts = [
    { upc: '8008277115849', expectedName: 'Kevin Murphy Cream Activator' },
    { upc: '016000476738', expectedName: 'Chex Mix Snacks' },
    { upc: '884912129512', expectedName: 'Cocoa Pebbles' },
    { upc: '079400490896', expectedName: 'Suave Hand Soap' }
  ];
  
  let successCount = 0;
  
  for (const product of testProducts) {
    console.log(`\n📦 Expected: ${product.expectedName}`);
    const result = await testUPCLookup(product.upc);
    if (result.success) successCount++;
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between requests
  }
  
  console.log(`\n📊 RESULTS: ${successCount}/${testProducts.length} products found automatically`);
  console.log(`Success rate: ${Math.round((successCount/testProducts.length) * 100)}%`);
  
  if (successCount >= 2) {
    console.log('🎉 Auto-lookup works well! Dream scenario is viable!');
  } else {
    console.log('🤔 Auto-lookup has mixed results. Hybrid approach recommended.');
  }
}

// Run the tests
runTests();