import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// No usamos placeholders que causen 'Failed to fetch' si las variables no existen.
// En su lugar, validamos antes de inicializar.
const isValidConfig = supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http');

export const supabase = createClient(
    isValidConfig ? supabaseUrl : 'https://missing-config.supabase.co',
    isValidConfig ? supabaseAnonKey : 'missing-key',
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true
        }
    }
);

export const checkConnection = () => isValidConfig;
