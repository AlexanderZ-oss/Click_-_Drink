import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ShoppingBag, Search, Filter } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Catalog() {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        let filtered = products;
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }
        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredProducts(filtered);
    }, [selectedCategory, searchTerm, products]);

    const fetchProducts = async () => {
        const { data } = await supabase.from('products').select('*').eq('active', true).order('name');
        if (data) setProducts(data);
    };

    const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

    return (
        <div className="min-h-screen bg-[#050505] pt-40 pb-32">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center mb-24 reveal">
                    <span className="text-[#c5a059] text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block font-sans">Elegancia Líquida</span>
                    <h1 className="text-6xl font-serif italic mb-8">Nuestra <span className="text-[#c5a059] not-italic">Reserva</span></h1>
                    <p className="text-gray-500 font-light tracking-wide italic">Una selección exhaustiva de los licores más distinguidos del mundo, listos para su paladar.</p>
                </div>

                {/* Filters */}
                <div className="mb-20 flex flex-col md:flex-row gap-12 items-center justify-between border-y border-white/5 py-10">
                    <div className="flex gap-8 overflow-x-auto w-full md:w-auto pb-4 md:pb-0 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`text-[9px] font-bold tracking-[0.3em] uppercase transition-all whitespace-nowrap ${selectedCategory === cat ? 'text-[#c5a059]' : 'text-gray-600 hover:text-white'}`}
                            >
                                {cat === 'all' ? 'Toda la Cava' : cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-64 group">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-[#c5a059] transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar pieza..."
                            className="bg-transparent border-b border-white/10 w-full pl-8 py-2 text-xs font-light outline-none focus:border-[#c5a059] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-20">
                    {filteredProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="group"
                        >
                            <div className="relative aspect-[3/4] bg-[#0a0a0a] overflow-hidden mb-8">
                                <img
                                    src={product.image_url}
                                    className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                                />
                                {product.stock === 0 && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                        <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-white border border-white/20 px-6 py-2">Agotado</span>
                                    </div>
                                )}
                                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black to-transparent">
                                    <button
                                        onClick={() => addToCart(product)}
                                        disabled={product.stock === 0}
                                        className="w-full btn-premium py-4"
                                    >
                                        Añadir
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <span className="text-[8px] font-bold tracking-[0.4em] uppercase text-[#c5a059]">{product.category}</span>
                                <h3 className="text-xl font-serif italic text-white/90">{product.name}</h3>
                                <p className="text-lg font-light text-gray-400 group-hover:text-[#c5a059] transition-colors">S/ {product.price.toFixed(2)}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
