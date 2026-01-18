
import { createClient } from '@supabase/supabase-js'

const SYS_URL = 'https://nvojmgeooevmqbuttpxh.supabase.co';
const SYS_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52b2ptZ2Vvb2V2bXFidXR0cHhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxOTg3MDcsImV4cCI6MjA4Mzc3NDcwN30.M2SbkrSYRM2f4YxWLV1TrHFBUbyQRUSpeXFobEt9LZY';

const supabase = createClient(SYS_URL, SYS_KEY);

async function checkAdmin() {
    const email = 'leninzumaran0@gmail.com';
    const password = '74814101';

    console.log(`🔍 Probando credenciales para: ${email}`);

    // 1. Intentar Loguear
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (signInError) {
        console.log('❌ Error al iniciar sesión:', signInError.message);

        if (signInError.message.includes('Email not confirmed')) {
            console.log('💡 DIAGNÓSTICO: El correo no ha sido confirmado.');
            console.log('   ACCION: Debes ir al Dashboard de Supabase -> Authorization -> Settings -> "Confirm Email" y DESACTIVARLO.');
            return;
        }

        if (signInError.message.includes('Invalid login credentials')) {
            console.log('💡 DIAGNÓSTICO: Usuario no existe o contraseña incorrecta.');
            console.log('   Intentando registrar automáticamente...');

            // 2. Intentar Registrar
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: 'Administrador Principal' }
                }
            });

            if (signUpError) {
                console.log('❌ Error al registrar:', signUpError.message);
            } else {
                console.log('✅ Intento de registro exitoso.');
                if (!signUpData.session) {
                    console.log('⚠️ ADVERTENCIA: Se registró pero requiere confirmación de email.');
                    console.log('   ACCION: Desactiva "Confirm Email" en Supabase Dashboard.');
                } else {
                    console.log('🎊 Registro completedo y sesión iniciada! Ya puedes entrar.');
                }
            }
        }
    } else {
        console.log('✅ ¡Credenciales correctas! El usuario existe y puede entrar.');
        console.log('ID Usuario:', signInData.user.id);

        // 3. Verificar si tiene el ROL de admin en la tabla profiles
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', signInData.user.id)
            .single();

        if (profile?.role !== 'admin') {
            console.log('⚠️ El perfil no tiene rol "admin". Actualizando...');
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', signInData.user.id);
            if (updateError) console.log('❌ Error actualizando rol:', updateError.message);
            else console.log('✅ Rol de ADMIN asignado correctamente.');
        } else {
            console.log('🤴 Usuario ya cuenta con rol ADMIN en la tabla profiles.');
        }
    }
}

checkAdmin();
