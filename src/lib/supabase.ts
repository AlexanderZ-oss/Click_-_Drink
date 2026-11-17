import { createClient } from '@supabase/supabase-js'

/**
 * FEREST: Database Configuration
 * System-ready credentials for seamless connectivity.
 */

// Credentials provided by the administrator
const SYS_URL = 'https://iaaavtbgfwatxvvpiphn.supabase.co';
const SYS_KEY = 'sb_publishable_1hsAVeQdmxw2UkQHHXbLaA_inyxKSiz';

const dbUrl = import.meta.env.VITE_SUPABASE_URL || SYS_URL;
const dbKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SYS_KEY;

const isReady = dbUrl.length > 0 && dbKey.length > 0 && dbUrl.startsWith('http');

// Reemplaza variables de entorno vacías por fallback para evitar crasheos.
const effectiveUrl = isReady ? dbUrl : SYS_URL;
const effectiveKey = (dbUrl !== SYS_URL || dbKey !== SYS_KEY) && dbKey.length > 0 ? dbKey : SYS_KEY;

export const supabase = createClient(
    effectiveUrl,
    effectiveKey,
    {
        auth: {
            persistSession: true,
            // localStorage: la sesión sobrevive al cierre del navegador.
            storage: typeof window !== 'undefined' ? window.localStorage : undefined,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    }
);

export const getConnectionStatus = () => ({
    isReady,
    connected: isReady,
    hasUrl: !!dbUrl,
    hasKey: !!dbKey,
    type: 'Cloud Connection',
    lastSync: new Date().toISOString()
});

// Alias for backward compatibility if needed, but we will update imports
export const getSupabaseStatus = getConnectionStatus;
export const getSystemStatus = getConnectionStatus;

