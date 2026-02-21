// supabase-client.js
// Initialize Supabase client for browser

// Wait for config to be loaded
if (typeof SUPABASE_CONFIG === 'undefined') {
  console.error('SUPABASE_CONFIG is not defined. Make sure config.js is loaded first.');
}

const supabaseUrl = SUPABASE_CONFIG.url;
const supabaseKey = SUPABASE_CONFIG.anonKey;

// Create Supabase client using the global window.supabase
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Export to window for other scripts to use
window.supabaseClient = supabase;