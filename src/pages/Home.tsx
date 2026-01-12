import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ShoppingBag, ChevronRight, Star, Clock, ShieldCheck, MapPin, Calendar, Info, CheckCircle2, Award, Percent, MessageSquare, Send, Mail, Phone, Instagram, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Home = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [promotions, setPromotions] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState('TODOS');
    const [loading, setLoading] = useState(true);
    const [showAddedMsg, setShowAddedMsg] = useState<string | null>(null);
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
    const { addToCart } = useCart();

    const categories = ['TODOS', 'VODKA', 'RON', 'WHISKY', 'CERVEZA', 'GIN', 'VINOS'];

    useEffect(() => {
        fetchProducts();
        fetchPromotions();
        fetchReviews();
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
        const { data, error } = await supabase.from('products').select('*').eq('active', true);
        if (!error && data) {
            setProducts(data);
            setFilteredProducts(data);
        }
        setLoading(false);
    };

    const fetchPromotions = async () => {
        const { data } = await supabase.from('promotions').select('*').eq('active', true);
        if (data) setPromotions(data);
    };

    const fetchReviews = async () => {
        const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false }).limit(6);
        if (data) setReviews(data);
    };

    const handleAddToCart = (product: any) => {
        addToCart(product);
        setShowAddedMsg(product.name);
        setTimeout(() => setShowAddedMsg(null), 2000);
    };

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.from('messages').insert([{
            name: contactForm.name,
            email: contactForm.email,
            message: contactForm.message,
            subject: 'Contacto desde Web'
        }]);
        if (!error) {
            alert('Mensaje enviado con éxito. Nos pondremos en contacto contigo pronto!');
            setContactForm({ name: '', email: '', message: '' });
        }
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
        <div className="font-sans bg-[#0a0a0a] min-h-screen text-white overflow-x-hidden">
            {/* Added To Cart Toast */}
            <AnimatePresence>
                {showAddedMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 20, x: '-50%' }}
                        className="fixed bottom-10 left-1/2 z-[100] bg-[#d4af37] text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-2xl border border-black/10"
                    >
                        <CheckCircle2 size={18} />
                        <span className="uppercase text-[10px] tracking-widest font-black">Añadido: {showAddedMsg}</span>
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
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]"></div>
                </div>

                <div className="container relative z-10 px-4">
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="max-w-4xl"
                        >
                            <span className="inline-block py-2 px-6 rounded-full bg-white/5 backdrop-blur-md text-[#d4af37] text-[10px] font-black tracking-[0.3em] mb-8 border border-[#d4af37]/20 uppercase">
                                Trujillo • Licorería Premium • Delivery VIP
                            </span>
                            <h1 className="text-7xl md:text-9xl font-black mb-8 leading-none italic tracking-tighter">
                                FEREST <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] bg-[length:200%_auto] animate-gradient-x">
                                    PREMIUM
                                </span>
                            </h1>
                            <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-light italic">
                                La selección más exclusiva de licores del mundo, ahora en Trujillo.
                                <span className="text-white block mt-2 font-bold not-italic">S/ 2.00 KM • ENVÍO GRATIS {'>'} S/ 100</span>
                            </p>
                            <div className="flex flex-wrap gap-6 justify-center">
                                <a href="#catalogo" className="btn-premium px-12 py-5 text-sm">
                                    EXPLORAR CARTA
                                </a>
                                <a href="#promociones" className="btn-outline px-12 py-5 text-sm flex items-center gap-2">
                                    <Percent size={18} /> PROMOCIONES
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Promotions Section */}
            <section id="promociones" className="py-24 bg-[#0a0a0a]">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                            <Award size={24} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Ofertas <span className="text-red-500">Exclusivas</span></h2>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Lo mejor al mejor precio</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {promotions.length > 0 ? (
                            promotions.map(promo => (
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    key={promo.id}
                                    className="relative h-64 rounded-[2.5rem] overflow-hidden group shadow-2xl border border-white/5"
                                >
                                    <img src={promo.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-10 flex flex-col justify-end">
                                        <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full w-fit mb-4 tracking-widest">-{promo.discount_percent}% OFF</span>
                                        <h3 className="text-3xl font-black italic text-white mb-2 uppercase">{promo.title}</h3>
                                        <p className="text-gray-300 text-sm font-medium italic">{promo.description}</p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-2 p-20 border-2 border-dashed border-white/5 rounded-[3rem] text-center text-gray-600">
                                <p className="text-sm font-black uppercase tracking-widest">Próximamente nuevas promociones...</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Catalog Section */}
            <section id="catalogo" className="py-24 bg-[#080808] relative">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-center md:text-left">
                        <div className="w-full md:w-auto">
                            <span className="text-[#d4af37] font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block italic">The Black Collection</span>
                            <h2 className="text-5xl md:text-6xl font-black text-white italic uppercase tracking-tighter">Nuestra <span className="text-[#d4af37]">Carta</span></h2>
                        </div>
                        <div className="flex flex-wrap gap-3 justify-center">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase border transition-all ${activeCategory === cat
                                        ? 'bg-[#d4af37] border-[#d4af37] text-black shadow-[0_0_25px_rgba(212,175,55,0.3)]'
                                        : 'border-white/10 text-gray-500 hover:border-[#d4af37]/50 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {filteredProducts.map((product) => (
                            <motion.div layout key={product.id} className="bg-[#111] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-[#d4af37]/30 transition-all group relative p-2">
                                <div className="relative h-80 rounded-[2rem] overflow-hidden">
                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                                        <span className="bg-black/80 backdrop-blur-md text-[#d4af37] text-[10px] font-black px-4 py-2 rounded-xl border border-[#d4af37]/20 uppercase tracking-tighter">
                                            {product.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-4 gap-4">
                                        <h3 className="font-black text-white text-2xl group-hover:text-[#d4af37] transition-colors leading-tight italic uppercase tracking-tighter">{product.name}</h3>
                                        <div className="text-right shrink-0">
                                            <span className="text-[#d4af37] font-black text-2xl italic tracking-tighter">S/ {product.price.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {product.wholesale_price && (
                                        <div className="mb-6 bg-[#d4af37]/5 border border-[#d4af37]/10 rounded-2xl p-3 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-green-500 text-[9px] font-black uppercase tracking-widest">P. Mayorista</span>
                                                <span className="text-white font-black text-lg">S/ {product.wholesale_price.toFixed(2)}</span>
                                            </div>
                                            <span className="text-[9px] text-gray-500 font-bold uppercase italic text-right">Min: {product.wholesale_min} units</span>
                                        </div>
                                    )}

                                    <p className="text-gray-500 text-xs mb-8 line-clamp-2 italic font-medium leading-relaxed">"{product.description}"</p>

                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="w-full btn-premium py-5 flex items-center justify-center gap-3 active:scale-95"
                                    >
                                        <ShoppingBag size={18} /> AGREGAR AL CARRITO
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials/Reviews */}
            <section className="py-24 bg-[#0a0a0a]">
                <div className="container mx-auto px-4 text-center">
                    <span className="text-[#d4af37] font-black text-[10px] tracking-[0.5em] uppercase mb-4 block italic">Experiencias Reales</span>
                    <h2 className="text-4xl font-black italic mb-16 uppercase tracking-tighter">Lo que dicen <span className="text-[#d4af37]">Nuestros Clientes</span></h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        {reviews.length > 0 ? (
                            reviews.map(review => (
                                <div key={review.id} className="bg-[#111] p-10 rounded-[2.5rem] border border-white/5 relative group">
                                    <div className="flex gap-1 text-[#d4af37] mb-6">
                                        {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="#d4af37" />)}
                                    </div>
                                    <p className="text-gray-400 italic mb-8 leading-relaxed font-medium">"{review.comment}"</p>
                                    <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                                        {review.user_avatar ? (
                                            <img src={review.user_avatar} className="w-12 h-12 rounded-full border-2 border-[#d4af37]/30" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black text-[#d4af37]">{review.user_name?.charAt(0)}</div>
                                        )}
                                        <div>
                                            <p className="text-white font-black text-sm uppercase italic">{review.user_name}</p>
                                            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black">Cliente Premium</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 py-16 text-gray-600 italic uppercase text-xs font-black tracking-widest">Aún no hay reseñas. ¡Sé el primero en dejar una!</div>
                        )}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section id="contacto" className="py-24 bg-[#080808]">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 bg-[#111] rounded-[4rem] border border-white/5 p-12 md:p-20 shadow-3xl">
                        <div>
                            <span className="text-[#d4af37] font-black text-[10px] tracking-[0.5em] uppercase mb-4 block italic">Direct Support</span>
                            <h2 className="text-5xl font-black italic mb-8 uppercase tracking-tighter">Hablemos de <span className="text-[#d4af37]">Negocios</span></h2>
                            <p className="text-gray-400 mb-12 italic leading-relaxed text-lg font-medium">
                                ¿Deseas un pedido para un evento especial o consulta mayorista? Contáctanos directamente y nuestro sommelier te asesorará.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-center gap-6 group">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-[#d4af37] border border-white/5 group-hover:border-[#d4af37]/30 transition-all">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">E-mail VIP</p>
                                        <p className="text-white font-black italic text-lg">leninzumaran0@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 group">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-[#d4af37] border border-white/5 group-hover:border-[#d4af37]/30 transition-all">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">WhatsApp Directo</p>
                                        <p className="text-white font-black italic text-lg">+51 901 296 314</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleContactSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4 italic">Nombre Completo</label>
                                    <input
                                        type="text" required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-[#d4af37] outline-none transition-all font-bold italic"
                                        placeholder="Tu nombre..."
                                        value={contactForm.name}
                                        onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4 italic">Correo Electrónico</label>
                                    <input
                                        type="email" required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-[#d4af37] outline-none transition-all font-bold italic"
                                        placeholder="tu@email.com"
                                        value={contactForm.email}
                                        onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4 italic">Tu Mensaje</label>
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] px-8 py-6 text-sm focus:border-[#d4af37] outline-none transition-all h-48 resize-none font-bold italic"
                                    placeholder="¿En qué podemos ayudarte hoy?"
                                    value={contactForm.message}
                                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                                ></textarea>
                            </div>
                            <button className="w-full btn-premium py-6 flex items-center justify-center gap-3 italic font-black text-sm uppercase group">
                                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> ENVIAR MENSAJE
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
