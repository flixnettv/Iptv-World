// api/supabase-proxy.js
// IPTV World - Secure Supabase Proxy API
// Environment: Vercel Edge Runtime

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // CORS Headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }

  try {
    // Get environment variables
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    // Parse URL and get table name
    const url = new URL(req.url);
    const table = url.searchParams.get('table') || 'apps';    const id = url.searchParams.get('id');

    // Validate table name (security)
    const allowedTables = ['apps', 'orders', 'contacts'];
    if (!allowedTables.includes(table)) {
      throw new Error('Invalid table name');
    }

    // Build Supabase URL
    let supabaseEndpoint = `${supabaseUrl}/rest/v1/${table}`;
    
    if (id) {
      supabaseEndpoint += `?id=eq.${id}`;
    }

    // Make request to Supabase
    const response = await fetch(supabaseEndpoint, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Supabase error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        data: data,
        timestamp: new Date().toISOString(),
      }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
          ...corsHeaders 
        } 
      }
    );

  } catch (error) {    console.error('API Proxy Error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
}