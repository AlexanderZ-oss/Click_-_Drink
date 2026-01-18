
import { createClient } from '@supabase/supabase-js'

const SYS_URL = 'https://nvojmgeooevmqbuttpxh.supabase.co';
const SYS_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52b2ptZ2Vvb2V2bXFidXR0cHhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxOTg3MDcsImV4cCI6MjA4Mzc3NDcwN30.M2SbkrSYRM2f4YxWLV1TrHFBUbyQRUSpeXFobEt9LZY';

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
