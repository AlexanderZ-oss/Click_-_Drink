import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ShoppingBag, Star, Clock, ShieldCheck, MapPin, Mail, Phone, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Home = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
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
            const { data } = await supabase.from('products').select('*').eq('active', true);
            if (data) {
                setProducts(data);
                setFilteredProducts(data);
            }
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

    return (
        <div className="bg-[#050505] min-h-screen text-white">
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-black/60 z-10"></div>
                    <img
                        src="https://images.unsplash.com/photo-1569701881644-02deb3312ae5?auto=format&fit=crop&q=80&w=1920"
                        className="w-full h-full object-cover"
                        alt="Background"
                    />
                </div>

                <div className="container relative z-20 px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <span className="text-[#c5a059] text-[10px] font-bold tracking-[0.6em] uppercase mb-6 block">Trujillo • Perú</span>
                        <h1 className="text-7xl md:text-9xl font-serif mb-8 tracking-tight">
                            FEREST
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light tracking-widest uppercase text-[12px]">
                            Licores seleccionados y experiencias exclusivas.
                        </p>
                        <div className="flex gap-6 justify-center">
                            <Link to="/catalog" className="btn-premium">COMPRAR AHORA</Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Categorías - Ordenadas */}
            <section className="py-24 container mx-auto px-8 border-b border-white/5">
                <div className="flex justify-center flex-wrap gap-8">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`text-[10px] font-bold tracking-[0.2em] uppercase pb-2 border-b-2 transition-all duration-300 ${activeCategory === cat ? 'border-[#c5a059] text-white' : 'border-transparent text-gray-600 hover:text-white'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            {/* Grid de Productos - Muy ordenado */}
            <section className="py-32 container mx-auto px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {filteredProducts.slice(0, 8).map((product) => (
                        <div key={product.id} className="group">
                            <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-[#0f0f0f] border border-white/5 rounded-sm">
                                <img src={product.image_url} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" alt={product.name} />
                                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => addToCart(product)} className="w-full btn-premium py-3 text-[9px]">AÑADIR</button>
                                </div>
                            </div>
                            <h3 className="font-serif text-lg text-white mb-2 uppercase tracking-wide">{product.name}</h3>
                            <div className="flex justify-between items-center border-t border-white/5 pt-4">
                                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">{product.category}</span>
                                <span className="text-md font-medium text-[#c5a059]">S/ {product.price.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
