
import { createClient } from '@supabase/supabase-js'

const SYS_URL = 'https://iaaavtbgfwatxvvpiphn.supabase.co';
const SYS_KEY = 'sb_publishable_1hsAVeQdmxw2UkQHHXbLaA_inyxKSiz';

const supabase = createClient(SYS_URL, SYS_KEY);

async function run() {
    console.log('ðŸ”„ Iniciando prueba de conexiÃ³n con Supabase...');

    const start = Date.now();

    // Test connection by fetching count of products (or equivalent public table)
    // We use a simple select on a table we know likely exists or just basic health check

    // Attempt 1: Check 'products' table
    const { data, error, status, statusText } = await supabase.from('products').select('*').limit(1);

    const duration = Date.now() - start;

    if (error) {
        console.error('âŒ Error de conexiÃ³n:', error.message);
        console.error('   Detalles:', error);
        if (error.code === 'PGRST204') {
            console.error('   Nota: La conexiÃ³n funciona, pero la tabla no existe.');
        }
    } else {
        console.log(`âœ… ConexiÃ³n establecida exitosamente en ${duration}ms`);
        console.log(`   Status: ${status} ${statusText}`);

        // Also check Authentication service
        const { data: authData, error: authError } = await supabase.auth.getSession();
        if (authError) {
            console.log('âš ï¸ Servicio de Auth accesible pero con advertencia:', authError.message);
        } else {
            console.log('âœ… Servicio de AutenticaciÃ³n operativo');
        }

        console.log('\n--- Resumen de Tablas ---');
        console.log(`   Products: ${data ? 'Accesible' : 'Inaccesible'} (Registros recuperados: ${data?.length || 0})`);
    }
}

run();

