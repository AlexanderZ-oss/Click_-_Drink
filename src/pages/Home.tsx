import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ShoppingBag, ChevronRight, Star, Clock, ShieldCheck, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState('TODOS');
    const [loading, setLoading] = useState(true);

    const categories = ['TODOS', 'VODKA', 'RON', 'WHISKY', 'CERVEZA', 'GIN', 'VINOS'];

    useEffect(() => {
        fetchProducts();
        trackPageView();

        // Realtime Subscription
        const channel = supabase
            .channel('products_updates')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'products',
                },
                (payload) => {
                    console.log('Change received!', payload);
                    if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE' || payload.eventType === 'DELETE') {
                        fetchProducts(); // Refresh data on any live update
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    useEffect(() => {
        if (activeCategory === 'TODOS') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category.toUpperCase() === activeCategory));
        }
    }, [activeCategory, products]);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('active', true);

        if (!error && data) {
            setProducts(data);
            setFilteredProducts(data);
        }
        setLoading(false);
    };

    const trackPageView = async () => {
        const today = new Date().toISOString().split('T')[0];
        const { data } = await supabase
            .from('analytics')
            .select('id, page_views')
            .eq('date', today)
            .single();

        if (data) {
            await supabase
                .from('analytics')
                .update({ page_views: data.page_views + 1 })
                .eq('id', data.id);
        } else {
            await supabase
                .from('analytics')
                .insert([{ date: today, page_views: 1, unique_visitors: 1 }]);
        }
    };

    return (
        <div className="font-sans bg-[#0a0a0a] min-h-screen text-white">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
                        alt="Background"
                        className="w-full h-full object-cover opacity-30 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/50 to-[#0a0a0a]"></div>
                </div>

                <div className="container relative z-10 px-4 pt-20">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <span className="inline-block py-1 px-3 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-xs font-bold tracking-widest mb-6 border border-[#d4af37]/20 uppercase">
                                    Experiencia Premium en Licores
                                </span>
                                <h1 className="text-6xl lg:text-8xl font-black mb-6 leading-none">
                                    CLINK <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f3e5ab]">
                                        & DRINK
                                    </span>
                                </h1>
                                <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                                    La licorería selecta más rápida de la ciudad. Entregamos las mejores marcas
                                    en la puerta de tu casa en menos de 45 minutos.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                                    <a href="#catalogo" className="btn-premium flex items-center justify-center gap-3 px-8 py-4">
                                        VER CATÁLOGO
                                        <ChevronRight size={20} />
                                    </a>
                                    <a href="#promos" className="btn-outline px-8 py-4">
                                        OFERTAS EXCLUSIVAS
                                    </a>
                                </div>

                                <div className="mt-16 flex flex-wrap items-center justify-center lg:justify-start gap-10 text-xs text-gray-500 font-bold tracking-widest uppercase">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#d4af37]"><Clock size={16} /></div>
                                        <span>45 MINUTOS</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#d4af37]"><ShieldCheck size={16} /></div>
                                        <span>PAGO SEGURO</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#d4af37]"><Star size={16} /></div>
                                        <span>PREMIUM</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <div className="lg:w-1/2 relative hidden lg:block">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ duration: 1 }}
                                className="relative"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1569529465841-dfecd0693295?auto=format&fit=crop&q=80&w=1000"
                                    alt="Premium Bottle"
                                    className="w-[500px] h-[650px] object-cover rounded-[2rem] shadow-[0_0_50px_rgba(212,175,55,0.15)] border border-white/10"
                                />
                                <div className="absolute -bottom-10 -left-10 bg-[#111] p-6 rounded-2xl border border-[#d4af37]/30 shadow-2xl backdrop-blur-xl bg-opacity-80">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[#d4af37] flex items-center justify-center text-black">
                                            <ShoppingBag size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Favorito de hoy</p>
                                            <p className="font-bold text-white text-lg">Blue Label Limited</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Catalog Section */}
            <section id="catalogo" className="py-24 bg-[#0a0a0a] relative">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div>
                            <span className="text-[#d4af37] font-bold tracking-widest text-xs uppercase mb-2 block">Selección Especial</span>
                            <h2 className="text-4xl md:text-5xl font-black text-white italic">NUESTRA <span className="text-[#d4af37]">CARTA</span></h2>
                        </div>

                        {/* Categories Filter */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase border transition-all ${activeCategory === cat
                                            ? 'bg-[#d4af37] border-[#d4af37] text-black ring-4 ring-[#d4af37]/10'
                                            : 'border-white/10 text-gray-400 hover:border-[#d4af37]/50 hover:text-white'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
                            <div className="w-12 h-12 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-xs font-bold tracking-widest">CARGANDO CATÁLOGO...</p>
                        </div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            <AnimatePresence mode='popLayout'>
                                {filteredProducts.map((product) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        key={product.id}
                                        className="bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-[#d4af37]/30 transition-all group relative"
                                    >
                                        <div className="relative h-72 overflow-hidden">
                                            <img
                                                src={product.image_url || 'https://images.unsplash.com/photo-1544145945-f904253d0c7e?auto=format&fit=crop&q=80&w=800'}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-[#0a0a0a]/80 backdrop-blur-md text-[#d4af37] text-[10px] font-black px-3 py-1 rounded-full border border-[#d4af37]/30 uppercase tracking-tighter">
                                                    {product.category}
                                                </span>
                                            </div>
                                            <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                <button className="w-full btn-premium py-3 text-xs flex items-center justify-center gap-2">
                                                    <ShoppingBag size={14} /> AÑADIR AL CARRITO
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-2 gap-4">
                                                <h3 className="font-bold text-white text-lg group-hover:text-[#d4af37] transition-colors leading-tight">{product.name}</h3>
                                                <div className="text-right">
                                                    <span className="text-xs text-gray-500 block mb-1">Precio</span>
                                                    <span className="text-white font-black text-xl italic tracking-tighter">S/ {product.price}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-500 text-xs mb-6 line-clamp-2 italic font-light">"{product.description}"</p>
                                            <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase border-t border-white/5 pt-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
                                                    <span>{product.stock > 0 ? `${product.stock} DISPONIBLES` : 'SIN STOCK'}</span>
                                                </div>
                                                <span className="text-[#d4af37]">ENVÍO EXPRESS</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {!loading && filteredProducts.length === 0 && (
                        <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[2rem]">
                            <div className="text-4xl mb-4 grayscale opacity-30">🥃</div>
                            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">No hay stock disponible</h3>
                            <p className="text-gray-500 max-w-xs mx-auto text-sm">Prueba seleccionando otra categoría o vuelve más tarde para ver nuevos ingresos.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
