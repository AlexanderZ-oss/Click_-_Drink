import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Please check your .env file.')
}

const defaultUrl = 'https://placeholder-project.supabase.co'
const defaultKey = 'placeholder-key'

export const supabase = createClient(
    supabaseUrl || defaultUrl,
    supabaseAnonKey || defaultKey
)
