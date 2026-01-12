import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, MapPin, Truck, ChevronRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, subtotal, deliveryFee, total, distance, setDistance } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    if (cart.length === 0) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-[#0a0a0a] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md"
                >
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 grayscale opacity-30">
                        <ShoppingBag size={48} />
                    </div>
                    <h1 className="text-4xl font-black mb-4 italic uppercase tracking-tighter">Tu carrito está <span className="text-[#d4af37]">vacío</span></h1>
                    <p className="text-gray-500 mb-10 italic">Parece que aún no has seleccionado tus licores premium para hoy.</p>
                    <Link to="/" className="btn-premium px-10 py-4 inline-block">DESCUBRIR CATÁLOGO</Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 min-h-screen bg-[#0a0a0a]">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-black mb-10 italic uppercase tracking-tighter">Mi Carrito <span className="text-[#d4af37]">Premium</span></h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Products List */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {cart.map((item) => {
                                const isWholesale = item.wholesale_price && item.wholesale_min && item.quantity >= item.wholesale_min;
                                const currentPrice = isWholesale ? item.wholesale_price! : item.price;

                                return (
                                    <motion.div
                                        layout key={item.id} exit={{ opacity: 0, x: -20 }}
                                        className="bg-[#111] p-6 rounded-[2rem] border border-white/5 flex flex-col md:flex-row items-center gap-6 group hover:border-[#d4af37]/30 transition-all"
                                    >
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-white/10 group-hover:border-[#d4af37]/50 transition-all">
                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <h3 className="font-bold text-white text-xl mb-1 italic">{item.name}</h3>
                                            <div className="flex flex-wrap justify-center md:justify-start gap-4 items-center">
                                                <p className={`text-lg font-black tracking-tighter ${isWholesale ? 'text-green-500' : 'text-[#d4af37]'}`}>
                                                    S/ {currentPrice.toFixed(2)}
                                                </p>
                                                {isWholesale && (
                                                    <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded font-black uppercase tracking-widest">Precio Mayorista</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-4 bg-white/5 p-2 rounded-xl border border-white/10">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="font-black text-xl italic w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-600 hover:text-red-500 transition-colors p-2"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 sticky top-32">
                            <h2 className="text-2xl font-black mb-8 italic uppercase tracking-tighter">Resumen de <span className="text-[#d4af37]">Orden</span></h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-400 text-sm font-bold uppercase">
                                    <span>Subtotal</span>
                                    <span className="text-white">S/ {subtotal.toFixed(2)}</span>
                                </div>

                                {/* Delivery Settings */}
                                <div className="pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2 text-[#d4af37] mb-4">
                                        <Truck size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Calculadora de Delivery</span>
                                    </div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <label className="text-xs font-bold text-gray-500 uppercase shrink-0">Distancia (km):</label>
                                        <input
                                            type="number" min="0"
                                            value={distance}
                                            onChange={(e) => setDistance(Number(e.target.value))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-[#d4af37] outline-none transition-all font-black"
                                        />
                                    </div>
                                    <div className="flex justify-between text-gray-400 text-sm font-bold uppercase">
                                        <span>Envío Express</span>
                                        <span className={deliveryFee === 0 ? 'text-green-500' : 'text-white'}>
                                            {deliveryFee === 0 ? 'GRATIS' : `S/ ${deliveryFee.toFixed(2)}`}
                                        </span>
                                    </div>
                                    {subtotal < 100 && (
                                        <p className="text-[10px] text-gray-500 mt-2 italic">* Falta S/ {(100 - subtotal).toFixed(2)} para envío gratis</p>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                    <span className="text-gray-400 font-black uppercase text-xs">Total a Pagar</span>
                                    <span className="text-4xl font-black text-[#d4af37] italic tracking-tighter">S/ {total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsCheckingOut(true)}
                                className="w-full btn-premium py-5 flex items-center justify-center gap-3"
                            >
                                FINALIZAR COMPRA <ChevronRight size={20} />
                            </button>

                            <div className="mt-8 bg-white/5 rounded-2xl p-4 border border-white/5">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                    <MapPin size={12} className="text-[#d4af37]" /> Trujillo, California - El Molino - Centro
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
