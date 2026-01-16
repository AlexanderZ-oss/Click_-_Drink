import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ShoppingBag, Star, Clock, ShieldCheck, MapPin, Percent, Send, Mail, Phone, Instagram, Facebook, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Home = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [promotions, setPromotions] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState('TODOS');
    const [loading, setLoading] = useState(true);
    const [showAddedMsg, setShowAddedMsg] = useState<string | null>(null);
    const { addToCart } = useCart();

    const categories = ['TODOS', 'VODKA', 'RON', 'WHISKY', 'GIN', 'VINOS'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [prodRes, promoRes] = await Promise.all([
                supabase.from('products').select('*').eq('active', true),
                supabase.from('promotions').select('*').eq('active', true)
            ]);

            if (prodRes.data) {
                setProducts(prodRes.data);
                setFilteredProducts(prodRes.data);
            }
            if (promoRes.data) setPromotions(promoRes.data);
        } catch (e) {
            console.error('Error fetching home data:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeCategory === 'TODOS') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category?.toUpperCase() === activeCategory));
        }
    }, [activeCategory, products]);

    const handleAddToCart = (product: any) => {
        addToCart(product);
        setShowAddedMsg(product.name);
        setTimeout(() => setShowAddedMsg(null), 2000);
    };

    return (
        <div className="bg-[#050505] min-h-screen text-white">
            {/* Added Toast - Sleek & Small */}
            <AnimatePresence>
                {showAddedMsg && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-[#c5a059] text-black px-8 py-3 rounded-full font-bold text-[10px] tracking-[0.2em] uppercase shadow-2xl"
                    >
                        Añadido: {showAddedMsg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cinematic Hero */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/60 z-10"></div>
                    <motion.img
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 10, ease: "linear" }}
                        src="https://images.unsplash.com/photo-1569701881644-02deb3312ae5?auto=format&fit=crop&q=80&w=1920"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="container relative z-20 px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                    >
                        <span className="text-gold text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block">Trujillo • Est. 2024</span>
                        <h1 className="text-7xl md:text-9xl font-serif mb-8 leading-tight">
                            Ferest <span className="italic block md:inline font-light opacity-80">Premium</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light tracking-wide italic">
                            Elevando el arte de la coctelería y los licores finos en la ciudad de la eterna primavera.
                        </p>
                        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                            <Link to="/catalog" className="btn-premium min-w-[240px]">
                                Ver Colección
                            </Link>
                            <Link to="/contact" className="text-[10px] font-bold tracking-[0.3em] uppercase hover:text-[#c5a059] transition-colors">
                                Reservas de Eventos
                            </Link>
                        </div>
                    </motion.div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
                    <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-[#c5a059] to-transparent"></div>
                </div>
            </section>

            {/* Quality Commitment - Minimalist */}
            <section className="py-24 border-y border-white/5 bg-[#080808]">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
                        <div className="space-y-4">
                            <ShieldCheck className="mx-auto text-[#c5a059]/50" size={32} strokeWidth={1} />
                            <h3 className="text-sm font-bold tracking-widest uppercase">Autenticidad</h3>
                            <p className="text-xs text-gray-500 leading-relaxed font-light">Garantía de origen en cada botella de nuestra exclusiva cava.</p>
                        </div>
                        <div className="space-y-4">
                            <Clock className="mx-auto text-[#c5a059]/50" size={32} strokeWidth={1} />
                            <h3 className="text-sm font-bold tracking-widest uppercase">Servicio VIP</h3>
                            <p className="text-xs text-gray-500 leading-relaxed font-light">Delivery especializado en menos de 45 minutos en todo Trujillo.</p>
                        </div>
                        <div className="space-y-4">
                            <Star className="mx-auto text-[#c5a059]/50" size={32} strokeWidth={1} />
                            <h3 className="text-sm font-bold tracking-widest uppercase">Curaduría</h3>
                            <p className="text-xs text-gray-500 leading-relaxed font-light">Seleccionamos solo lo mejor del mercado global para usted.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Collection */}
            <section className="py-32 container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="max-w-xl">
                        <h2 className="text-5xl font-serif italic mb-6">Nuestra Selección</h2>
                        <p className="text-gray-500 text-sm font-light leading-relaxed">Explore nuestra curaduría por categoría. Piezas seleccionadas por su carácter y distinción.</p>
                    </div>
                    <div className="flex flex-wrap gap-4 overflow-x-auto pb-4 md:pb-0">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`text-[10px] font-bold tracking-[0.2em] uppercase px-6 py-3 border transition-all duration-500 ${activeCategory === cat ? 'border-[#c5a059] text-[#c5a059]' : 'border-white/5 text-gray-600 hover:text-white'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {filteredProducts.slice(0, 8).map((product) => (
                        <div key={product.id} className="reveal group">
                            <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-[#0f0f0f]">
                                <img
                                    src={product.image_url}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 pointer-events-none"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="bg-white text-black px-8 py-3 text-[10px] font-bold tracking-widest uppercase hover:bg-[#c5a059] hover:text-white transition-colors"
                                    >
                                        Añadir al Carrito
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-serif text-xl mb-2 text-white/90 group-hover:text-[#c5a059] transition-colors">{product.name}</h3>
                            <div className="flex justify-between items-center border-t border-white/5 pt-4">
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{product.category}</span>
                                <span className="text-lg font-light text-[#c5a059]">S/ {product.price.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Experiences / Contact */}
            <section className="py-32 bg-[#080808] border-t border-white/5">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
                        <div>
                            <h2 className="text-5xl font-serif italic mb-8">Hablemos de <br /><span className="text-[#c5a059] not-italic">Momentos.</span></h2>
                            <p className="text-gray-400 font-light mb-12 text-lg">Para consultas corporativas, suministros para bares o pedidos especiales.</p>
                            <div className="space-y-6">
                                <a href="mailto:info@ferest.pe" className="flex items-center gap-4 group">
                                    <Mail className="text-[#c5a059]/50 group-hover:text-[#c5a059] transition-colors" size={20} />
                                    <span className="text-sm border-b border-transparent group-hover:border-[#c5a059] transition-all">leninzumaran0@gmail.com</span>
                                </a>
                                <div className="flex items-center gap-4">
                                    <Phone className="text-[#c5a059]/50" size={20} />
                                    <span className="text-sm font-light">+51 901 296 314</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <MapPin className="text-[#c5a059]/50" size={20} />
                                    <span className="text-sm font-light italic">Showroom: Trujillo, Perú</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-10 border border-white/5 bg-[#0f0f0f] rounded-lg">
                            <form className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">Nombre</label>
                                    <input className="w-full bg-transparent border-b border-white/10 py-3 focus:border-[#c5a059] outline-none transition-colors font-light" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">Mensaje</label>
                                    <textarea className="w-full bg-transparent border-b border-white/10 py-3 focus:border-[#c5a059] outline-none transition-colors resize-none h-32 font-light" />
                                </div>
                                <button className="btn-premium w-full">Enviar Consulta</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
