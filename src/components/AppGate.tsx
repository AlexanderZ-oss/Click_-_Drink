import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Lock, Globe, LogIn, Mail, ArrowLeft, AlertTriangle, Loader2 } from 'lucide-react';

// Detecta si la web se esta ejecutando como app instalada (PWA / TWA de Android)
export function isRunningAsApp(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches
        || (window.navigator as any).standalone === true
        // TWA de Android: el user-agent del WebView lo delata
        || /\bwv\b/i.test(navigator.userAgent);
}

const WEB_URL = 'https://ferest.vercel.app';

// Portero de la app: la app instalada es SOLO para usuarios registrados.
// El registro se hace en la web; el inicio de sesion se hace aqui dentro.
const AppGate = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const isApp = isRunningAsApp();
    const [mode, setMode] = useState<'gate' | 'login'>('gate');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [signing, setSigning] = useState(false);
    const { signIn } = useAuth();

    if (!isApp) return <>{children}</>; // En la web normal: acceso libre

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (user) return <>{children}</>; // Registrado: acceso directo

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSigning(true);
        const { error } = await signIn(email, password);
        setSigning(false);
        if (error) setError('Correo o contraseña incorrectos.');
        // Si sale bien, el AuthContext detecta la sesion y la puerta se abre sola
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-8 text-center">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-sm w-full"
            >
                <div className="w-24 h-24 mx-auto mb-8 rounded-3xl border border-[#c5a059]/40 flex items-center justify-center">
                    <span className="font-serif italic font-bold text-5xl text-[#c5a059]">F</span>
                </div>

                <AnimatePresence mode="wait">
                    {mode === 'gate' ? (
                        <motion.div key="gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <h1 className="text-2xl font-serif italic mb-3">App exclusiva para clientes registrados</h1>
                            <p className="text-gray-400 text-sm leading-relaxed mb-10">
                                Para hacer tus pedidos desde la app necesitas una cuenta.
                                Regístrate primero en nuestra página web, vuelve aquí e inicia sesión.
                            </p>
                            <div className="flex flex-col gap-4">
                                <a
                                    href={`${WEB_URL}/register?from=app`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-premium flex items-center justify-center gap-2"
                                >
                                    <Globe size={18} />
                                    REGISTRARME EN LA WEB
                                </a>
                                <button
                                    onClick={() => setMode('login')}
                                    className="w-full border border-white/15 text-white text-xs font-black uppercase tracking-widest px-6 py-4 rounded-xl hover:border-[#c5a059]/60 transition-colors flex items-center justify-center gap-2"
                                >
                                    <LogIn size={18} />
                                    Ya tengo cuenta – Iniciar sesión
                                </button>
                            </div>
                            <div className="mt-10 flex items-center justify-center gap-2 text-gray-500 text-xs">
                                <Lock size={12} />
                                <span>FEREST Premium – Licorería online de Trujillo</span>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <h1 className="text-2xl font-serif italic mb-3">Iniciar sesión</h1>
                            <p className="text-gray-400 text-sm mb-8">
                                ¿Aún no tienes cuenta?{' '}
                                <a
                                    href={`${WEB_URL}/register?from=app`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#c5a059] underline underline-offset-4"
                                >
                                    Regístrate en la web
                                </a>
                            </p>
                            <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
                                <div className="relative">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="Correo electrónico"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:border-[#d4af37] outline-none"
                                    />
                                </div>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="password"
                                        required
                                        placeholder="Contraseña"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:border-[#d4af37] outline-none"
                                    />
                                </div>
                                {error && (
                                    <p className="flex items-center gap-2 text-red-400 text-sm">
                                        <AlertTriangle size={16} /> {error}
                                    </p>
                                )}
                                <button
                                    type="submit"
                                    disabled={signing}
                                    className="btn-premium flex items-center justify-center gap-2 disabled:opacity-60"
                                >
                                    {signing ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
                                    ENTRAR
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setMode('gate'); setError(null); }}
                                    className="text-gray-400 text-xs flex items-center justify-center gap-1 hover:text-white transition-colors"
                                >
                                    <ArrowLeft size={12} /> Volver
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default AppGate;
