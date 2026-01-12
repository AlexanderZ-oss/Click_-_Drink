import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ShoppingBag, ChevronRight, Star, Clock, ShieldCheck, MapPin, Calendar, Info, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Home = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState('TODOS');
    const [loading, setLoading] = useState(true);
    const [showAddedMsg, setShowAddedMsg] = useState<string | null>(null);
    const { addToCart } = useCart();

    const categories = ['TODOS', 'VODKA', 'RON', 'WHISKY', 'CERVEZA', 'GIN', 'VINOS'];

    const trujilloEvents = [
        { id: 1, name: 'Festival de la Marinera', date: 'Enero 2024', place: 'Coliseo Gran Chimú', desc: 'El evento más emblemático de la ciudad.' },
        { id: 2, name: 'Noche de Licores Premium', date: 'Fin de mes', place: 'Golf y Country Club', desc: 'Cata exclusiva de rones y whiskys.' },
        { id: 3, name: 'Trujillo Rock Festival', date: 'Próximo Sábado', place: 'Explanada El Molino', desc: 'Los mejores grupos nacionales con barra libre Ferest.' }
    ];

    useEffect(() => {
        fetchProducts();
        trackPageView();
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

    const handleAddToCart = (product: any) => {
        addToCart(product);
        setShowAddedMsg(product.name);
        setTimeout(() => setShowAddedMsg(null), 2000);
    };

    const trackPageView = async () => {
        const today = new Date().toISOString().split('T')[0];
        const { data } = await supabase.from('analytics').select('id, page_views').eq('date', today).single();
        if (data) {
            await supabase.from('analytics').update({ page_views: data.page_views + 1 }).eq('id', data.id);
        } else {
            await supabase.from('analytics').insert([{ date: today, page_views: 1, unique_visitors: 1 }]);
        }
    };

    return (
        <div className="font-sans bg-[#0a0a0a] min-h-screen text-white">
            {/* Added To Cart Toast */}
            <AnimatePresence>
                {showAddedMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 20, x: '-50%' }}
                        className="fixed bottom-10 left-1/2 z-[100] bg-[#d4af37] text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-2xl"
                    >
                        <CheckCircle2 size={18} />
                        Añadido: {showAddedMsg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=1920"
                        alt="Background"
                        className="w-full h-full object-cover opacity-20 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/50 to-[#0a0a0a]"></div>
                </div>

                <div className="container relative z-10 px-4 pt-20">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2 text-center lg:text-left">
                            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                                <span className="inline-block py-1 px-3 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-xs font-bold tracking-widest mb-6 border border-[#d4af37]/20 uppercase">
                                    TU LICORERÍA DE CONFIANZA EN TRUJILLO
                                </span>
                                <h1 className="text-6xl lg:text-8xl font-black mb-6 leading-none italic">
                                    FEREST <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f3e5ab]">
                                        PREMIUM
                                    </span>
                                </h1>
                                <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light italic">
                                    Venta al <span className="text-white font-bold">por mayor y menor</span>.
                                    Delivery en todo Trujillo: <span className="text-[#d4af37] font-bold">S/ 2.00 por km</span>.
                                    <br />
                                    <span className="text-green-500 font-black">¡ENVÍO GRATIS EN COMPRAS MAYORES A S/ 100!</span>
                                </p>
                                <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                                    <a href="#catalogo" className="btn-premium flex items-center justify-center gap-3 px-8 py-4">
                                        PEDIR AHORA
                                        <ChevronRight size={20} />
                                    </a>
                                    <a href="#trujillo" className="btn-outline px-8 py-4">
                                        TOP EVENTOS TRUJILLO
                                    </a>
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
                            <span className="text-[#d4af37] font-bold tracking-widest text-xs uppercase mb-2 block italic">Trujillo Selecciona</span>
                            <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">Nuestro <span className="text-[#d4af37]">Stock</span></h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase border transition-all ${activeCategory === cat
                                        ? 'bg-[#d4af37] border-[#d4af37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
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
                            <p className="text-xs font-bold tracking-widest">CARGANDO...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {filteredProducts.map((product) => (
                                <motion.div layout key={product.id} className="bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-[#d4af37]/30 transition-all group relative">
                                    <div className="relative h-72 overflow-hidden">
                                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-[#0a0a0a]/90 backdrop-blur-md text-[#d4af37] text-[10px] font-black px-3 py-1 rounded-full border border-[#d4af37]/20 uppercase tracking-tighter">
                                                {product.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2 gap-4">
                                            <h3 className="font-bold text-white text-lg group-hover:text-[#d4af37] transition-colors leading-tight italic">{product.name}</h3>
                                            <div className="text-right">
                                                <span className="text-white font-black text-2xl italic tracking-tighter">S/ {product.price.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        {product.wholesale_price && (
                                            <div className="mb-4 bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                                                <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Precio x Mayor: S/ {product.wholesale_price.toFixed(2)}</p>
                                                <p className="text-[9px] text-gray-400 italic">Aplíca desde {product.wholesale_min || 12} unidades</p>
                                            </div>
                                        )}

                                        <p className="text-gray-500 text-xs mb-6 line-clamp-2 italic font-light">"{product.description}"</p>
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="w-full btn-premium py-3 text-xs flex items-center justify-center gap-2 mb-4"
                                        >
                                            <ShoppingBag size={14} /> AGREGAR AL CARRITO
                                        </button>
                                        <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase border-t border-white/5 pt-4 italic">
                                            <span>Mín. 1 Unid.</span>
                                            <span className="text-[#d4af37]">DISPONIBLE EN TRUJILLO</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Trujillo Events Section */}
            <section id="trujillo" className="py-24 bg-[#080808] border-y border-white/5">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter">¿Qué hacer en <span className="text-[#d4af37]">Trujillo</span>?</h2>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Recomendaciones Ferest para tus previas</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {trujilloEvents.map(event => (
                            <div key={event.id} className="bg-[#111] p-8 rounded-3xl border border-white/5 hover:border-[#d4af37]/20 transition-all relative group overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                                    <Calendar size={60} />
                                </div>
                                <div className="flex items-center gap-2 mb-4 text-[#d4af37]">
                                    <Calendar size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{event.date}</span>
                                </div>
                                <h3 className="text-xl font-black text-white mb-2 italic">{event.name}</h3>
                                <p className="text-gray-500 text-sm mb-4 leading-relaxed italic">{event.desc}</p>
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                    <Info size={14} />
                                    <span>Lugar: {event.place}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Delivery Info */}
            <section className="py-16 bg-[#d4af37]">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-black text-black mb-4 italic uppercase">DELIVERY EXPRESS EN TODA LA CIUDAD</h2>
                    <p className="text-black font-bold max-w-2xl mx-auto uppercase text-sm tracking-widest">
                        Tarifa plana de <span className="underline font-black">S/ 2.00 por Kilómetro</span> desde nuestro local en California.
                        Recordamos: <span className="bg-black text-[#d4af37] px-2 py-1 rounded">COMPRAS MAYORES A S/ 100 TIENEN ENVÍO GRATIS</span>.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Home;
