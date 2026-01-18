
import { createClient } from '@supabase/supabase-js'

const SYS_URL = 'https://nvojmgeooevmqbuttpxh.supabase.co';
const SYS_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52b2ptZ2Vvb2V2bXFidXR0cHhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxOTg3MDcsImV4cCI6MjA4Mzc3NDcwN30.M2SbkrSYRM2f4YxWLV1TrHFBUbyQRUSpeXFobEt9LZY';

const supabase = createClient(SYS_URL, SYS_KEY);

async function checkSchema() {
    console.log('--- DB SCHEMA CHECK ---');
    console.log('Testing connection to Supabase...');

    const { data: profiles, error } = await supabase.from('profiles').select('*').limit(1);

    if (error) {
        console.log('❌ Error profiles table:', error.message);
        if (error.message.includes('column profiles.email does not exist')) {
            console.log('💡 DIAGNOSIS: The "email" column is missing in the "profiles" table.');
            console.log('   ACTION: Run Step 3 in supabase_setup.sql in the Supabase SQL Editor.');
        }
    } else {
        console.log('✅ Profiles table is accessible.');
        if (profiles.length > 0) {
            console.log('Columns found:', Object.keys(profiles[0]).join(', '));
        } else {
            console.log('Table is empty. Checking column existence manually...');
            const { error: colError } = await supabase.from('profiles').select('email').limit(0);
            if (colError) {
                console.log('❌ Column "email" MISSING:', colError.message);
            } else {
                console.log('✅ Column "email" EXISTS.');
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
        console.log('❌ Error checking admin profile:', adminError.message);
    } else if (adminProfile) {
        console.log('✅ Admin profile FOUND:');
        console.log(`   ID: ${adminProfile.id}`);
        console.log(`   Role: ${adminProfile.role}`);
        if (adminProfile.role !== 'admin') {
            console.log('⚠️ WARNING: User exists but is NOT an admin.');
        }
    } else {
        console.log('❌ Admin profile NOT FOUND in profiles table.');
    }
}

checkSchema();
