import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { getConnectionStatus, supabase } from '../lib/supabase';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { signIn } = useAuth();
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
                // Check if admin by email
                if (data.user.email === 'leninzumaran9@gmail.com') {
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
                    navigate('/cart');
                }
            } else {
                navigate('/cart');
            }
        }
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

                    <div className="flex flex-col gap-6 mt-12 text-center">
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

