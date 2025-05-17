const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables');
  console.error('Please ensure SUPABASE_URL and SUPABASE_KEY are set in your .env file');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;