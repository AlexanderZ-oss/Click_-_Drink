
import { createClient } from '@supabase/supabase-js'

const SYS_URL = 'https://iaaavtbgfwatxvvpiphn.supabase.co';
const SYS_KEY = 'sb_publishable_1hsAVeQdmxw2UkQHHXbLaA_inyxKSiz';

const supabase = createClient(SYS_URL, SYS_KEY);

async function attemptLogin() {
    console.log('--- LOGIN TEST ---');
    const email = 'leninzumaran0@gmail.com';
    const password = '345'; // Intentionally wrong first to see error

    // 1. Try with wrong password to verify we hit the server
    console.log('1. Testing with WRONG password...');
    const { error: error1 } = await supabase.auth.signInWithPassword({ email, password });
    if (error1) {
        console.log('Expected Error:', error1.message);
    } else {
        console.log('WARNING: Login with wrong password succeeded? That is impossible.');
    }

    // 2. Try with CORRECT password provided by user
    const correctPass = '74814101';
    console.log('2. Testing with CORRECT password (' + email + ')...');

    const { data, error: error2 } = await supabase.auth.signInWithPassword({
        email,
        password: correctPass
    });

    if (error2) {
        console.log('LOGIN FAILED:', error2.message);
        if (error2.message.includes('Email not confirmed')) {
            console.log('DIAGNOSIS: Email confirmation is required. Please disable "Confirm Email" in Supabase Dashboard.');
        } else if (error2.message.includes('Invalid login credentials')) {
            console.log('DIAGNOSIS: The user may not exist or the password is truly different.');
        }
    } else {
        console.log('LOGIN SUCCESS!');
        console.log('User ID:', data.user.id);
        console.log('Email:', data.user.email);
        console.log('Role:', data.user.role);
    }
    console.log('--- END TEST ---');
}

attemptLogin();

