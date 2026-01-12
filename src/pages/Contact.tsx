import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Instagram, Facebook } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        const { error } = await supabase.from('messages').insert([{
            name: formData.name,
            email: formData.email,
            message: formData.message,
            subject: 'Contacto desde Página Contacto'
        }]);

        if (!error) {
            alert('¡Mensaje enviado con éxito!');
            setFormData({ name: '', email: '', message: '' });
        }
        setSending(false);
    };

    return (
        <div className="pt-40 pb-20 bg-[#0a0a0a] min-h-screen">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#d4af37] font-black text-[10px] tracking-[0.5em] uppercase mb-4 block italic"
                    >
                        Luxury Assistance
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white"
                    >
                        Estamos a un <span className="text-[#d4af37]">Trago</span> de Distancia
                    </motion.h1>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-12"
                    >
                        <div className="bg-[#111] p-10 rounded-[3rem] border border-white/5 space-y-10 shadow-3xl">
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Canales <span className="text-[#d4af37]">VIP</span></h2>

                            <div className="flex items-center gap-6 group">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-[#d4af37] border border-white/5 group-hover:border-[#d4af37]/40 transition-all">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest italic">Llamada Directa</p>
                                    <p className="text-xl font-black text-white italic">+51 901 296 314</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-[#d4af37] border border-white/5 group-hover:border-[#d4af37]/40 transition-all">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest italic">Atención Gmail</p>
                                    <p className="text-xl font-black text-white italic">leninzumaran0@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-[#d4af37] border border-white/5 group-hover:border-[#d4af37]/40 transition-all">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest italic">Sede Trujillo</p>
                                    <p className="text-xl font-black text-white italic">Urb. California / El Molino</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <a href="#" className="flex-1 bg-[#111] py-6 rounded-2xl border border-white/5 flex items-center justify-center text-gray-400 hover:text-[#d4af37] hover:border-[#d4af37]/30 transition-all gap-3 font-black text-[10px] tracking-widest uppercase italic">
                                <Instagram size={18} /> @ferest.premium
                            </a>
                            <a href="#" className="flex-1 bg-[#111] py-6 rounded-2xl border border-white/5 flex items-center justify-center text-gray-400 hover:text-[#d4af37] hover:border-[#d4af37]/30 transition-all gap-3 font-black text-[10px] tracking-widest uppercase italic">
                                <Facebook size={18} /> /ferest.trillo
                            </a>
                        </div>
                    </motion.div>

                    <motion.form
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        onSubmit={handleSubmit}
                        className="bg-[#111] p-12 rounded-[4rem] border border-white/5 shadow-3xl space-y-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4">Nombre</label>
                                <input
                                    type="text" required
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-[#d4af37] transition-all italic"
                                    placeholder="Tu nombre..."
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4">Tu Correo</label>
                                <input
                                    type="email" required
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-[#d4af37] transition-all italic"
                                    placeholder="email@ejemplo.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4">Consulta Técnica o Pedido</label>
                            <textarea
                                className="w-full bg-black/40 border border-white/10 rounded-[2.5rem] px-8 py-6 text-sm font-bold text-white outline-none focus:border-[#d4af37] transition-all h-56 resize-none italic"
                                placeholder="Escribe aquí tu consulta..."
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                            ></textarea>
                        </div>
                        <button
                            disabled={sending}
                            className="w-full btn-premium py-6 flex items-center justify-center gap-3 text-sm active:scale-95 disabled:opacity-50"
                        >
                            <Send size={18} /> {sending ? 'ENVIANDO...' : 'ENVIAR MENSAJE PRIORITARIO'}
                        </button>
                    </motion.form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
