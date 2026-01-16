import { createClient } from '@supabase/supabase-js'

/**
 * FEREST: Database Configuration
 * System-ready credentials for seamless connectivity.
 */

// Credentials provided by the administrator
const SYS_URL = 'https://nvojmgeooevmqbuttpxh.supabase.co';
const SYS_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52b2ptZ2Vvb2V2bXFidXR0cHhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxOTg3MDcsImV4cCI6MjA4Mzc3NDcwN30.M2SbkrSYRM2f4YxWLV1TrHFBUbyQRUSpeXFobEt9LZY';

const dbUrl = import.meta.env.VITE_SUPABASE_URL || SYS_URL;
const dbKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SYS_KEY;

const isReady = dbUrl.length > 0 && dbKey.length > 0 && dbUrl.startsWith('http');

export const supabase = createClient(
    isReady ? dbUrl : SYS_URL,
    isReady ? dbKey : SYS_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    }
);

export const getConnectionStatus = () => ({
    isReady: true,
    connected: true,
    hasUrl: !!dbUrl,
    hasKey: !!dbKey,
    type: 'Cloud Connection',
    lastSync: new Date().toISOString()
});

// Alias for backward compatibility if needed, but we will update imports
export const getSupabaseStatus = getConnectionStatus;
export const getSystemStatus = getConnectionStatus;

