import { createClient } from '@supabase/supabase-js'

// Intentamos capturar las variables de entorno, con fallbacks de seguridad.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Si faltan las variables, usamos un proyecto placeholder para que createClient no falle catastróficamente
const finalUrl = supabaseUrl.startsWith('http') ? supabaseUrl : 'https://placeholder-project.supabase.co';
const finalKey = supabaseAnonKey.length > 20 ? supabaseAnonKey : 'placeholder-key-0000000000000000000';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('FEREST: Supabase credentials missing. App running in restricted mode.');
}

export const supabase = createClient(finalUrl, finalKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});
