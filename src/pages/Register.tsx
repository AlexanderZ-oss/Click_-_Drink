import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, CheckCircle, FileText } from 'lucide-react';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Patch: Validar que el correo termine en .com
        if (!email.toLowerCase().endsWith('.com')) {
            setError('Por seguridad, solo se permiten correos electrónicos válidos que terminen en .com');
            return;
        }

        setLoading(true);
        setError(null);

        const { error } = await signUp(email, password, fullName);

        if (error) {
            setError(error.message || 'Error al registrar usuario');
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
            setTimeout(() => navigate('/login'), 5000);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center px-8 pt-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-xl w-full bg-[#0a0a0a] border border-[#c5a059]/20 p-12 text-center"
                >
                    <CheckCircle className="mx-auto text-[#c5a059] mb-8" size={64} strokeWidth={1} />
                    <h2 className="text-4xl font-serif text-white mb-6 uppercase tracking-wider">¡Bienvenido a Ferest!</h2>
                    <div className="space-y-6 text-gray-400 font-light leading-relaxed text-lg">
                        <p>Tu registro ha sido exitoso.</p>
                        <p className="border-y border-white/5 py-6">
                            "Te damos la bienvenida oficial a la <span className="text-[#c5a059] font-medium uppercase tracking-widest">Cata de Trujillo</span> y a nuestra comunidad de licores selectos."
                        </p>
                        <p className="text-sm italic text-gray-500">
                            Recibirás un correo electrónico de confirmación con los detalles de tu membresía.
                            <br />
                            <span className="text-[#c5a059] font-bold uppercase mt-2 block tracking-widest text-[10px]">Las facturas de tus compras serán enviadas a este correo.</span>
                        </p>
                    </div>
                    <button onClick={() => navigate('/login')} className="btn-premium mt-12 w-full">Ir al Ingreso</button>
                    <p className="text-[10px] text-gray-600 mt-6 uppercase tracking-widest">Redirigiendo automáticamente...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center px-8 pt-32 pb-20">
            <div className="max-w-md w-full">
                <div className="text-center mb-12">
                    <span className="text-[#c5a059] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">Membresía Trujillo</span>
                    <h1 className="text-5xl font-serif text-white mb-4">Registro</h1>
                    <p className="text-gray-500 font-light uppercase tracking-widest text-[10px]">Únete a nuestra reserva exclusiva</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 mb-8 text-[11px] font-bold uppercase tracking-widest text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1">Nombre Completo</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#c5a059] transition-colors" size={16} />
                            <input required type="text" className="w-full pl-12 bg-white/5 border border-white/10 py-4 focus:border-[#c5a059] transition-all outline-none text-white font-light text-sm" placeholder="Ej: Juan Pérez" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1">Correo Electrónico</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#c5a059] transition-colors" size={16} />
                            <input required type="email" className="w-full pl-12 bg-white/5 border border-white/10 py-4 focus:border-[#c5a059] transition-all outline-none text-white font-light text-sm" placeholder="usuario@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1">Contraseña</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#c5a059] transition-colors" size={16} />
                            <input required type="password" title="Mínimo 6 caracteres" className="w-full pl-12 bg-white/5 border border-white/10 py-4 focus:border-[#c5a059] transition-all outline-none text-white font-light text-sm" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} />
                        </div>
                    </div>

                    <div className="bg-[#c5a059]/5 border border-[#c5a059]/10 p-4 rounded flex gap-4 items-start mb-4">
                        <FileText className="text-[#c5a059] shrink-0" size={18} />
                        <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-wider font-bold">
                            Nota: La factura de su compra será enviada automáticamente al correo electrónico registrado.
                        </p>
                    </div>

                    <button disabled={loading} type="submit" className="w-full btn-premium py-5 mt-4">
                        {loading ? 'Sincronizando...' : 'Completar Registro'}
                    </button>

                    <p className="text-center text-gray-600 text-[10px] uppercase font-bold tracking-widest mt-8">
                        ¿Ya tienes cuenta? <Link to="/login" className="text-[#c5a059] hover:underline">Ingresar aquí</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;

