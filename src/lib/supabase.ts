import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const defaultUrl = 'https://placeholder-project.supabase.co'
const defaultKey = 'placeholder-key'

// Si no hay variables, usa placeholders para que la app no crashee en el build o primer render
export const supabase = createClient(
    supabaseUrl || defaultUrl,
    supabaseAnonKey || defaultKey
)
