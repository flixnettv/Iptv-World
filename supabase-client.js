// supabase-client.js

const { createClient } = require('@supabase/supabase-js');

// Utility function to validate environment variables
function validateEnvVars() {
    const requiredVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
    for (const variable of requiredVars) {
        if (!process.env[variable]) {
            throw new Error(`Missing environment variable: ${variable}`);
        }
    }
}

// Validate environment variables
try {
    validateEnvVars();
} catch (error) {
    console.error(error.message);
    process.exit(1);
}

// Create Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabase;