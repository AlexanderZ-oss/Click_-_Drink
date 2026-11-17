import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { getConnectionStatus, supabase } from '../lib/supabase';
import { isAdminEmail } from '../lib/config';

// Icono oficial de Google (logo multicolor)
const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
);

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { signIn, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const status = getConnectionStatus();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!status.isReady) {
            setError('Error de Sistema: Las llaves de conexión no están configuradas en el servidor.');
            return;
        }

        setLoading(true);
        setError(null);

        // @ts-ignore
        const { data, error } = await signIn(email, password);

        if (error) {
            if (error.message && error.message.includes('Email not confirmed')) {
                setError('Acceso denegado: Su correo electrónico no ha sido verificado. Por favor revise su bandeja de entrada.');
            } else {
                setError('Acceso denegado. Verifique sus credenciales.');
            }
            setLoading(false);
        } else {
            // Check role for redirection
            const userId = data.user?.id;
            if (userId) {
                // Check if admin by email or profile role
                if (isAdminEmail(data.user.email)) {
                    navigate('/admin');
                    return;
                }

                // Check profile role
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', userId)
                    .single();

                if (profile?.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                navigate('/');
            }
        }
    };

    const handleGoogle = async () => {
        setError(null);
        const { error } = await signInWithGoogle();
        if (error) setError('No se pudo iniciar sesión con Google. Intenta de nuevo.');
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center px-8 pt-20 pb-20">
            <div className="max-w-md w-full">
                <div className="text-center mb-12">
                    <ShieldCheck className="mx-auto text-[#c5a059] mb-4" size={40} strokeWidth={1} />
                    <h1 className="text-5xl font-serif text-white mb-4">Ingreso</h1>
                    <p className="text-gray-500 font-light uppercase tracking-widest text-[10px]">Acceso Seguro al Sistema</p>
                </div>

                {!status.isReady && (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded mb-8 flex gap-4 items-start">
                        <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                        <div>
                            <p className="text-amber-200 text-[10px] font-bold uppercase tracking-widest mb-1">Sin Conexión al Servidor</p>
                            <p className="text-amber-200/60 text-[10px] leading-relaxed">Las credenciales de acceso no han sido detectadas. Ve a <Link to="/debug" className="underline text-amber-500">Diagnóstico</Link> para más detalles.</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 mb-8 text-[11px] font-bold uppercase tracking-widest text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-400 border-l border-[#c5a059] pl-3 uppercase tracking-widest">Correo de Usuario</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-[#c5a059] transition-colors" size={16} />
                            <input required type="email" className="w-full pl-12 bg-white/5 border border-white/5 py-4 focus:border-[#c5a059] transition-all outline-none text-white font-light text-sm" placeholder="usuario@sistema.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-400 border-l border-[#c5a059] pl-3 uppercase tracking-widest">Contraseña Administrativa</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-[#c5a059] transition-colors" size={16} />
                            <input required type="password" className="w-full pl-12 bg-white/5 border border-white/5 py-4 focus:border-[#c5a059] transition-all outline-none text-white font-light text-sm" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>

                    <button disabled={loading} type="submit" className="w-full btn-premium py-5 mt-4">
                        {loading ? 'Validando Acceso...' : 'INGRESAR'}
                    </button>

                    <div className="flex items-center gap-4 my-8">
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="text-gray-600 text-[9px] uppercase tracking-[0.3em] font-bold">o</span>
                        <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <button type="button" onClick={handleGoogle} className="w-full bg-white text-[#050505] font-bold py-4 flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors text-[11px] uppercase tracking-[0.25em]">
                        <GoogleIcon /> Continuar con Google
                    </button>

                    <div className="flex flex-col gap-6 mt-12 text-center">
                        <p className="text-gray-600 text-[10px] uppercase font-bold tracking-[0.3em]">
                            <Link to="/forgot-password" className="text-gray-500 hover:text-[#c5a059] transition-colors">¿Olvidaste tu contraseña?</Link>
                        </p>
                        <p className="text-gray-600 text-[10px] uppercase font-bold tracking-[0.3em]">
                            ¿No tienes cuenta? <Link to="/register" className="text-[#c5a059] hover:text-white transition-colors">Solicitar Acceso</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;

