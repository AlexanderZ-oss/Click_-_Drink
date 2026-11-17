
import { createClient } from '@supabase/supabase-js'

const SYS_URL = 'https://iaaavtbgfwatxvvpiphn.supabase.co';
const SYS_KEY = 'sb_publishable_1hsAVeQdmxw2UkQHHXbLaA_inyxKSiz';

const supabase = createClient(SYS_URL, SYS_KEY);

async function forceRegister() {
    console.log('--- FORCING REGISTRATION ---');
    const email = 'leninzumaran0@gmail.com';
    const password = '74814101';

    // 1. Check if user exists (by trying login)
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (!loginError && loginData.user) {
        console.log('User ALREADY EXISTS and password is correct. ID:', loginData.user.id);
        return;
    }

    // 2. Try to Sign Up
    console.log('Attempting Supabase SignUp...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: 'Admin User'
            }
        }
    });

    if (signUpError) {
        console.log('CRITICAL: SignUp Failed:', signUpError.message);
    } else {
        console.log('SignUp REQUEST successful.');
        if (signUpData.user) {
            console.log('User created/returned with ID:', signUpData.user.id);
            if (signUpData.session) {
                console.log('Session established immediately (Email Confirm is OFF).');
            } else {
                console.log('WARNING: No session returned. "Confirm Email" might be ON in Supabase.');
            }
        } else {
            console.log('Weird: No user object returned.');
        }
    }
    console.log('--- END ---');
}

forceRegister();

