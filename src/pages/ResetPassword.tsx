import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// El usuario llega aqui desde el enlace del correo de recuperacion.
// Supabase inicia su sesion automaticamente via URL (detectSessionInUrl).
// Si hay sesion: define una contrasena nueva. Si no: avisa y manda al login.
const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSession, setHasSession] = useState<boolean | null>(null);
    const { session } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Dar un momento a Supabase para procesar el token de la URL.
        const t = setTimeout(() => setHasSession(!!session), 800);
        return () => clearTimeout(t);
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        if (password !== confirm) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
            setError('No se pudo actualizar. El enlace puede haber expirado: solicita uno nuevo.');
        } else {
            setDone(true);
            setTimeout(() => navigate('/'), 2500);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center px-8 pt-20 pb-20">
            <div className="max-w-md w-full">
                {done ? (
                    <div className="text-center">
                        <CheckCircle className="mx-auto text-[#c5a059] mb-6" size={56} strokeWidth={1} />
                        <h1 className="text-4xl font-serif text-white mb-4">¡Contraseña actualizada!</h1>
                        <p className="text-gray-500 mb-8">Te llevamos al inicio...</p>
                    </div>
                ) : hasSession === false ? (
                    <div className="text-center">
                        <AlertTriangle className="mx-auto text-amber-500 mb-6" size={56} strokeWidth={1} />
                        <h1 className="text-3xl font-serif text-white mb-6">Enlace inválido o expirado</h1>
                        <p className="text-gray-500 mb-10">
                            Los enlaces de recuperación se usan una sola vez.
                            Solicita uno nuevo para cambiar tu contraseña.
                        </p>
                        <Link to="/forgot-password" className="btn-premium inline-block">SOLICITAR NUEVO ENLACE</Link>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-12">
                            <ShieldCheck className="mx-auto text-[#c5a059] mb-4" size={40} strokeWidth={1} />
                            <h1 className="text-4xl font-serif text-white mb-4">Nueva Contraseña</h1>
                            <p className="text-gray-500 font-light uppercase tracking-widest text-[10px]">
                                Define tu nueva clave de acceso
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 mb-8 text-[11px] font-bold uppercase tracking-widest text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-gray-400 border-l border-[#c5a059] pl-3 uppercase tracking-widest">Nueva contraseña</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-[#c5a059] transition-colors" size={16} />
                                    <input required type="password" minLength={6} className="w-full pl-12 bg-white/5 border border-white/5 py-4 focus:border-[#c5a059] transition-all outline-none text-white font-light text-sm" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-gray-400 border-l border-[#c5a059] pl-3 uppercase tracking-widest">Confirmar contraseña</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-[#c5a059] transition-colors" size={16} />
                                    <input required type="password" minLength={6} className="w-full pl-12 bg-white/5 border border-white/5 py-4 focus:border-[#c5a059] transition-all outline-none text-white font-light text-sm" placeholder="Repite la contraseña" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                                </div>
                            </div>

                            <button disabled={loading} type="submit" className="w-full btn-premium py-5">
                                {loading ? 'Guardando...' : 'GUARDAR NUEVA CONTRASEÑA'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
