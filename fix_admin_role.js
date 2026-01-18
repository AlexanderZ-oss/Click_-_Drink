
import { createClient } from '@supabase/supabase-js'

const SYS_URL = 'https://nvojmgeooevmqbuttpxh.supabase.co';
const SYS_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52b2ptZ2Vvb2V2bXFidXR0cHhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxOTg3MDcsImV4cCI6MjA4Mzc3NDcwN30.M2SbkrSYRM2f4YxWLV1TrHFBUbyQRUSpeXFobEt9LZY';

const supabase = createClient(SYS_URL, SYS_KEY);

async function checkAndFixAdmin() {
    console.log('🔍 Checking admin status for leninzumaran9@gmail.com...');

    // 1. Get User ID from Auth
    // Since we can't easily access auth.users table directly as anon, we rely on profiles.
    // However, we can try to find the profile by email if we set it up that way.

    // Check profiles table
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'leninzumaran9@gmail.com');

    if (error) {
        console.error('❌ Error fetching profiles:', error);
        return;
    }

    if (!profiles || profiles.length === 0) {
        console.error('❌ No profile found for leninzumaran9@gmail.com');
        console.log('   Note: The user must sign up first for a profile to exist, unless we manually create it.');
    } else {
        const profile = profiles[0];
        console.log('👤 Profile found:', profile);

        if (profile.role !== 'admin') {
            console.log('⚠️ Role is not admin. Updating to admin...');
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', profile.id);

            if (updateError) {
                console.error('❌ Failed to update role:', updateError);
            } else {
                console.log('✅ Role updated to ADMIN successfully.');
            }
        } else {
            console.log('✅ User is already ADMIN.');
        }
    }
}

checkAndFixAdmin();
