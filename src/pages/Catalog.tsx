import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ShoppingCart, Search, Filter } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image_url: string;
    stock: number;
}

export default function Catalog() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [selectedCategory, searchTerm, products]);

    const fetchProducts = async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('active', true)
            .order('name');

        if (!error && data) {
            setProducts(data);
        }
    };

    const filterProducts = () => {
        let filtered = products;

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
    };

    const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

    return (
        <div className="min-h-screen pt-32 pb-20 bg-[#0a0a0a]">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-6xl font-black italic uppercase mb-4">
                        Nuestro <span className="text-[#d4af37]">Catálogo</span>
                    </h1>
                    <p className="text-gray-400 text-lg">Descubre nuestra selección premium de bebidas</p>
                </motion.div>

                {/* Search and Filter */}
                <div className="mb-12 flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${selectedCategory === category
                                        ? 'bg-[#d4af37] text-black'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                {category === 'all' ? 'Todos' : category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group bg-white/5 rounded-3xl overflow-hidden border border-white/10 hover:border-[#d4af37]/50 transition-all hover:shadow-2xl hover:shadow-[#d4af37]/20"
                        >
                            {/* Image */}
                            <div className="relative h-64 overflow-hidden bg-black/40">
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                {product.stock < 10 && product.stock > 0 && (
                                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-black">
                                        ¡Últimas unidades!
                                    </div>
                                )}
                                {product.stock === 0 && (
                                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                        <span className="text-white font-black text-xl">AGOTADO</span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="mb-3">
                                    <span className="text-xs font-black text-[#d4af37] uppercase tracking-wider">
                                        {product.category}
                                    </span>
                                </div>
                                <h3 className="text-xl font-black italic text-white mb-2">{product.name}</h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-3xl font-black italic text-white">
                                            S/ {product.price.toFixed(2)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => addToCart(product)}
                                        disabled={product.stock === 0}
                                        className="bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-black px-6 py-3 rounded-xl font-black text-sm uppercase hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        Agregar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-xl font-bold">No se encontraron productos</p>
                    </div>
                )}
            </div>
        </div>
    );
}
