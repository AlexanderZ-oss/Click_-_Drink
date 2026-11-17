
import { createClient } from '@supabase/supabase-js'

const SYS_URL = 'https://iaaavtbgfwatxvvpiphn.supabase.co';
const SYS_KEY = 'sb_publishable_1hsAVeQdmxw2UkQHHXbLaA_inyxKSiz';

const supabase = createClient(SYS_URL, SYS_KEY);

async function run() {
    console.log('--- COLUMNS CHECK ---');

    // Check orders table
    const { data: ordersData, error: ordersError } = await supabase.from('orders').select('*').limit(1);
    if (ordersError) {
        console.log('Orders error:', ordersError.message);
    } else {
        console.log('Orders columns:', ordersData.length > 0 ? Object.keys(ordersData[0]) : 'No data to show columns');
    }

    // Check profiles table
    const { data: profilesData, error: profilesError } = await supabase.from('profiles').select('*').limit(1);
    if (profilesError) {
        console.log('Profiles error:', profilesError.message);
    } else {
        console.log('Profiles columns:', profilesData.length > 0 ? Object.keys(profilesData[0]) : 'No data to show columns');
    }
}

run();

