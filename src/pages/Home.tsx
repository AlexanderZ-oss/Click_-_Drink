import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ShoppingBag, ChevronRight, Star, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    const [products, setProducts] = useState([]);

    return (
        <div className="font-sans">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
                        alt="Background"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/50 to-[#0a0a0a]"></div>
                </div>

                <div className="container relative z-10 px-4 pt-20">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                                    FEREST <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f3e5ab]">
                                        LICORERÍA PREMIUM
                                    </span>
                                </h1>
                                <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto lg:mx-0">
                                    Los mejores tragos y licores seleccionados con delivery inmediato.
                                    Elevamos tus momentos especiales con calidad y distinción.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <a href="#catalogo" className="btn-premium flex items-center justify-center gap-2 group">
                                        VER CATÁLOGO
                                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </a>
                                    <a href="#promos" className="btn-outline">
                                        PROMOCIONES
                                    </a>
                                </div>

                                <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Clock className="text-[#d4af37]" size={18} />
                                        <span>Delivery 45m</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="text-[#d4af37]" size={18} />
                                        <span>Pago Seguro</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Star className="text-[#d4af37]" size={18} />
                                        <span>Calidad Premium</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <div className="lg:w-1/2 relative hidden lg:block">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="relative z-10"
                            >
                                {/* Floating cards effect would go here */}
                                <div className="relative w-[500px] h-[600px] mx-auto">
                                    <img
                                        src="https://images.unsplash.com/photo-1569529465841-dfecd0693295?auto=format&fit=crop&q=80&w=1000"
                                        alt="Premium Bottle"
                                        className="w-full h-full object-cover rounded-2xl shadow-2xl border border-[#d4af37]/30"
                                    />
                                    <div className="absolute -bottom-6 -right-6 bg-[#1a1a1a] p-4 rounded-xl border border-[#d4af37] shadow-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#d4af37] flex items-center justify-center">
                                                <ShoppingBag className="text-black" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">Producto Destacado</p>
                                                <p className="font-bold text-[#d4af37]">Blue Label</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Grid - simplified for now */}
            <section className="py-20 bg-[#0a0a0a]">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        <span className="border-b-2 border-[#d4af37] pb-2">CATEGORÍAS</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {['VODKA', 'RON', 'WHISKY', 'CERVEZA', 'GIN', 'VINOS'].map((cat, i) => (
                            <div key={i} className="group relative overflow-hidden rounded-xl aspect-square bg-[#1a1a1a] border border-[#333] hover:border-[#d4af37] transition-all cursor-pointer">
                                <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 z-10">
                                    <span className="text-2xl">🥃</span>
                                    <h3 className="font-bold group-hover:text-[#d4af37] transition-colors">{cat}</h3>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
