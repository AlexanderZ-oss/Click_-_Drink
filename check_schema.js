
import { createClient } from '@supabase/supabase-js'

const SYS_URL = 'https://iaaavtbgfwatxvvpiphn.supabase.co';
const SYS_KEY = 'sb_publishable_1hsAVeQdmxw2UkQHHXbLaA_inyxKSiz';

const supabase = createClient(SYS_URL, SYS_KEY);

async function checkSchema() {
    console.log('--- DB SCHEMA CHECK ---');
    console.log('Testing connection to Supabase...');

    const { data: profiles, error } = await supabase.from('profiles').select('*').limit(1);

    if (error) {
        console.log('âŒ Error profiles table:', error.message);
        if (error.message.includes('column profiles.email does not exist')) {
            console.log('ðŸ’¡ DIAGNOSIS: The "email" column is missing in the "profiles" table.');
            console.log('   ACTION: Run Step 3 in supabase_setup.sql in the Supabase SQL Editor.');
        }
    } else {
        console.log('âœ… Profiles table is accessible.');
        if (profiles.length > 0) {
            console.log('Columns found:', Object.keys(profiles[0]).join(', '));
        } else {
            console.log('Table is empty. Checking column existence manually...');
            const { error: colError } = await supabase.from('profiles').select('email').limit(0);
            if (colError) {
                console.log('âŒ Column "email" MISSING:', colError.message);
            } else {
                console.log('âœ… Column "email" EXISTS.');
            }
        }
    }

    const adminEmail = 'leninzumaran0@gmail.com';
    console.log(`\n--- ADMIN CHECK (Email: ${adminEmail}) ---`);
    const { data: adminProfile, error: adminError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', adminEmail)
        .maybeSingle();

    if (adminError) {
        console.log('âŒ Error checking admin profile:', adminError.message);
    } else if (adminProfile) {
        console.log('âœ… Admin profile FOUND:');
        console.log(`   ID: ${adminProfile.id}`);
        console.log(`   Role: ${adminProfile.role}`);
        if (adminProfile.role !== 'admin') {
            console.log('âš ï¸ WARNING: User exists but is NOT an admin.');
        }
    } else {
        console.log('âŒ Admin profile NOT FOUND in profiles table.');
    }
}

checkSchema();

