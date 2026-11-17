import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, KeyRound, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Recuperacion de contrasena: envia un enlace seguro al correo del usuario.
// El enlace aterriza en /reset-password donde define una clave nueva.
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { resetPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await resetPassword(email);
        if (error) {
            setError('No se pudo enviar el enlace. Verifica el correo e intenta de nuevo.');
        } else {
            setSent(true);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center px-8 pt-20 pb-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full"
            >
                {sent ? (
                    <div className="text-center">
                        <CheckCircle className="mx-auto text-[#c5a059] mb-6" size={56} strokeWidth={1} />
                        <h1 className="text-4xl font-serif text-white mb-6">Revisa tu correo</h1>
                        <p className="text-gray-400 font-light leading-relaxed mb-4">
                            Enviamos un enlace de recuperación a <span className="text-[#c5a059]">{email}</span>.
                            Ábrelo y crea tu nueva contraseña.
                        </p>
                        <p className="text-gray-600 text-[11px] mb-10">
                            Si no lo ves, revisa tu carpeta de Spam (puede tardar 1-2 minutos).
                        </p>
                        <Link to="/login" className="btn-premium inline-block">VOLVER AL INGRESO</Link>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-12">
                            <KeyRound className="mx-auto text-[#c5a059] mb-4" size={40} strokeWidth={1} />
                            <h1 className="text-4xl font-serif text-white mb-4">Recuperar Contraseña</h1>
                            <p className="text-gray-500 font-light uppercase tracking-widest text-[10px]">
                                Te enviaremos un enlace seguro
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 mb-8 text-[11px] font-bold uppercase tracking-widest text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-gray-400 border-l border-[#c5a059] pl-3 uppercase tracking-widest">Correo de tu cuenta</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-[#c5a059] transition-colors" size={16} />
                                    <input required type="email" className="w-full pl-12 bg-white/5 border border-white/5 py-4 focus:border-[#c5a059] transition-all outline-none text-white font-light text-sm" placeholder="usuario@sistema.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </div>

                            <button disabled={loading} type="submit" className="w-full btn-premium py-5">
                                {loading ? 'Enviando...' : 'ENVIAR ENLACE DE RECUPERACIÓN'}
                            </button>

                            <p className="text-center text-gray-600 text-[10px] uppercase font-bold tracking-[0.3em]">
                                <Link to="/login" className="text-[#c5a059] hover:text-white transition-colors">Volver al ingreso</Link>
                            </p>
                        </form>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
