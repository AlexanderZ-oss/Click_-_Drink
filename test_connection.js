
import { createClient } from '@supabase/supabase-js'

const SYS_URL = 'https://nvojmgeooevmqbuttpxh.supabase.co';
const SYS_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52b2ptZ2Vvb2V2bXFidXR0cHhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxOTg3MDcsImV4cCI6MjA4Mzc3NDcwN30.M2SbkrSYRM2f4YxWLV1TrHFBUbyQRUSpeXFobEt9LZY';

const supabase = createClient(SYS_URL, SYS_KEY);

async function run() {
    console.log('🔄 Iniciando prueba de conexión con Supabase...');

    const start = Date.now();

    // Test connection by fetching count of products (or equivalent public table)
    // We use a simple select on a table we know likely exists or just basic health check

    // Attempt 1: Check 'products' table
    const { data, error, status, statusText } = await supabase.from('products').select('*').limit(1);

    const duration = Date.now() - start;

    if (error) {
        console.error('❌ Error de conexión:', error.message);
        console.error('   Detalles:', error);
        if (error.code === 'PGRST204') {
            console.error('   Nota: La conexión funciona, pero la tabla no existe.');
        }
    } else {
        console.log(`✅ Conexión establecida exitosamente en ${duration}ms`);
        console.log(`   Status: ${status} ${statusText}`);

        // Also check Authentication service
        const { data: authData, error: authError } = await supabase.auth.getSession();
        if (authError) {
            console.log('⚠️ Servicio de Auth accesible pero con advertencia:', authError.message);
        } else {
            console.log('✅ Servicio de Autenticación operativo');
        }

        console.log('\n--- Resumen de Tablas ---');
        console.log(`   Products: ${data ? 'Accesible' : 'Inaccesible'} (Registros recuperados: ${data?.length || 0})`);
    }
}

run();
