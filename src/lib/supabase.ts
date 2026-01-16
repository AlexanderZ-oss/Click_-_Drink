import { createClient } from '@supabase/supabase-js'

/**
 * FEREST: Supabase Client Configuration
 * 
 * "Failed to fetch" usually happens because:
 * 1. The VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables are missing in Vercel.
 * 2. There are leading/trailing spaces in the environment variables in the Vercel dashboard.
 * 3. The URL provided is not reachable from the client's network.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// If configuration is missing, we use a recognizable dummy that won't trigger real network calls 
// that result in cryptic "Failed to fetch" errors.
const isReady = supabaseUrl.length > 0 && supabaseAnonKey.length > 0 && supabaseUrl.startsWith('http');

if (!isReady) {
    console.error('CRITICAL: Supabase environment variables are missing or incorrect.');
}

export const supabase = createClient(
    isReady ? supabaseUrl : 'https://MISSING-ENV-VARS.supabase.co',
    isReady ? supabaseAnonKey : 'MISSING-KEY',
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    }
);

export const getSupabaseStatus = () => ({
    isReady,
    hasUrl: supabaseUrl.length > 0,
    hasKey: supabaseAnonKey.length > 0,
    urlPrefix: supabaseUrl.substring(0, 10) + '...'
});
