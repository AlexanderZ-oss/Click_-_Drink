
import { createClient } from '@supabase/supabase-js'

const SYS_URL = 'https://iaaavtbgfwatxvvpiphn.supabase.co';
const SYS_KEY = 'sb_publishable_1hsAVeQdmxw2UkQHHXbLaA_inyxKSiz';

const supabase = createClient(SYS_URL, SYS_KEY);

async function checkAdmin() {
    const email = 'leninzumaran0@gmail.com';
    const password = '74814101';

    console.log(`ðŸ” Probando credenciales para: ${email}`);

    // 1. Intentar Loguear
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (signInError) {
        console.log('âŒ Error al iniciar sesiÃ³n:', signInError.message);

        if (signInError.message.includes('Email not confirmed')) {
            console.log('ðŸ’¡ DIAGNÃ“STICO: El correo no ha sido confirmado.');
            console.log('   ACCION: Debes ir al Dashboard de Supabase -> Authorization -> Settings -> "Confirm Email" y DESACTIVARLO.');
            return;
        }

        if (signInError.message.includes('Invalid login credentials')) {
            console.log('ðŸ’¡ DIAGNÃ“STICO: Usuario no existe o contraseÃ±a incorrecta.');
            console.log('   Intentando registrar automÃ¡ticamente...');

            // 2. Intentar Registrar
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: 'Administrador Principal' }
                }
            });

            if (signUpError) {
                console.log('âŒ Error al registrar:', signUpError.message);
            } else {
                console.log('âœ… Intento de registro exitoso.');
                if (!signUpData.session) {
                    console.log('âš ï¸ ADVERTENCIA: Se registrÃ³ pero requiere confirmaciÃ³n de email.');
                    console.log('   ACCION: Desactiva "Confirm Email" en Supabase Dashboard.');
                } else {
                    console.log('ðŸŽŠ Registro completedo y sesiÃ³n iniciada! Ya puedes entrar.');
                }
            }
        }
    } else {
        console.log('âœ… Â¡Credenciales correctas! El usuario existe y puede entrar.');
        console.log('ID Usuario:', signInData.user.id);

        // 3. Verificar si tiene el ROL de admin en la tabla profiles
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', signInData.user.id)
            .single();

        if (profile?.role !== 'admin') {
            console.log('âš ï¸ El perfil no tiene rol "admin". Actualizando...');
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', signInData.user.id);
            if (updateError) console.log('âŒ Error actualizando rol:', updateError.message);
            else console.log('âœ… Rol de ADMIN asignado correctamente.');
        } else {
            console.log('ðŸ¤´ Usuario ya cuenta con rol ADMIN en la tabla profiles.');
        }
    }
}

checkAdmin();

