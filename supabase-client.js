// supabase-client.js
// Initialize Supabase client for browser

// Check if config is loaded
if (typeof window.SUPABASE_CONFIG === 'undefined') {
  console.error('SUPABASE_CONFIG is not defined. Make sure config.js is loaded first.');
} else {
  const supabaseUrl = window.SUPABASE_CONFIG.url;
  const supabaseKey = window.SUPABASE_CONFIG.anonKey;
  
  // Create Supabase client using the global window.supabase
  window.supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
  
  console.log('✅ Supabase client initialized successfully');
}