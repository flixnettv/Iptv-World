// assets/js/supabase-client.js
import { createClient } from '@supabase/supabase-js';

// Get the Supabase URL and ANON_KEY from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://kiygsjsaxijwebqwmccb.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_cD6J1pox3KmDlBoeqsSapg_Y-zkbPp3';

// Create and export the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);