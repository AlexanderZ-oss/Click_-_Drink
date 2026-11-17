
import { createClient } from '@supabase/supabase-js'

const SYS_URL = 'https://iaaavtbgfwatxvvpiphn.supabase.co';
const SYS_KEY = 'sb_publishable_1hsAVeQdmxw2UkQHHXbLaA_inyxKSiz';

const supabase = createClient(SYS_URL, SYS_KEY);

async function checkAndFixAdmin() {
    console.log('ðŸ” Checking admin status for leninzumaran0@gmail.com...');

    // 1. Get User ID from Auth
    // Since we can't easily access auth.users table directly as anon, we rely on profiles.
    // However, we can try to find the profile by email if we set it up that way.

    // Check profiles table
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'leninzumaran0@gmail.com');

    if (error) {
        console.error('âŒ Error fetching profiles:', error);
        return;
    }

    if (!profiles || profiles.length === 0) {
        console.error('âŒ No profile found for leninzumaran9@gmail.com');
        console.log('   Note: The user must sign up first for a profile to exist, unless we manually create it.');
    } else {
        const profile = profiles[0];
        console.log('ðŸ‘¤ Profile found:', profile);

        if (profile.role !== 'admin') {
            console.log('âš ï¸ Role is not admin. Updating to admin...');
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', profile.id);

            if (updateError) {
                console.error('âŒ Failed to update role:', updateError);
            } else {
                console.log('âœ… Role updated to ADMIN successfully.');
            }
        } else {
            console.log('âœ… User is already ADMIN.');
        }
    }
}

checkAndFixAdmin();

