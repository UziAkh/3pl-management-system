// Create a test product with the UPC we're using
// Run this script with Node.js to add a test product to your database

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables');
  console.error('Please ensure SUPABASE_URL and SUPABASE_KEY are set in your .env file');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestProduct() {
  console.log('Creating test product...');

  // You'll need to replace this with an actual client ID from your database
  // You can get one by running a query like: 
  // SELECT id FROM clients LIMIT 1;
  const clientId = "YOUR_CLIENT_ID_HERE"; 

  const testProduct = {
    name: "Test Product",
    sku: "TEST-SKU-" + Date.now(),
    upc: "016571960230", // This is the UPC we're testing with
    client_id: clientId,
    description: "Test product for UPC scanning",
    quantity: 100
  };

  const { data, error } = await supabase
    .from('products')
    .insert([testProduct])
    .select();

  if (error) {
    console.error('Error creating test product:', error);
    return;
  }

  console.log('Test product created successfully:', data);
}

createTestProduct()
  .then(() => console.log('Done!'))
  .catch(err => console.error('Error:', err));