import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, MapPin, Truck, ChevronRight, ShoppingBag, Landmark, CreditCard, ChevronDown, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, subtotal, deliveryFee, total, distance, setDistance, clearCart } = useCart();
    const [user, setUser] = useState<any>(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [step, setStep] = useState(1);
    const [invoiceType, setInvoiceType] = useState<'boleta' | 'factura'>('boleta');
    const [details, setDetails] = useState({ ruc_dni: '', address: '', phone: '', company: '' });
    const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });
    }, []);

    const handleCheckoutStart = () => {
        if (!user) {
            alert('Debes iniciar sesión con Google para finalizar tu compra.');
            return;
        }
        setIsCheckingOut(true);
    };

    const handlePlaceOrder = async () => {
        const { data, error } = await supabase.from('orders').insert([{
            user_id: user.id,
            total_amount: total,
            status: 'paid', // Autoconfirm as requested for demo
            items: cart,
            shipping_address: details.address,
            contact_phone: details.phone,
            delivery_fee: deliveryFee,
            distance_km: distance,
            invoice_type: invoiceType,
            ruc_dni: details.ruc_dni,
            company_name: details.company
        }]).select().single();

        if (!error) {
            setOrderSuccess(data.id);
            clearCart();
            setTimeout(() => {
                navigate('/');
            }, 5000);
        }
    };

    if (orderSuccess) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-[#0a0a0a] flex items-center justify-center px-4">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#111] p-12 rounded-[4rem] border border-[#d4af37]/30 text-center max-w-2xl shadow-3xl">
                    <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500 border border-green-500/20">
                        <CheckCircle2 size={48} />
                    </div>
                    <h1 className="text-5xl font-black mb-4 italic uppercase tracking-tighter">¡Pedido <span className="text-[#d4af37]">Confirmado</span>!</h1>
                    <p className="text-gray-400 mb-8 italic text-lg leading-relaxed">
                        Gracias por elegir Ferest Premium. <br />
                        Tu orden <span className="text-white font-bold">#ORD-{orderSuccess}</span> ha sido procesada. <br />
                        Hemos enviado tu <span className="text-[#d4af37] font-bold uppercase">{invoiceType}</span> digital a <span className="text-white underline">{user.email}</span>.
                    </p>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5 mb-10 text-left">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Detalle de Envío</p>
                        <p className="text-white font-black italic flex items-center gap-2"><MapPin size={14} className="text-[#d4af37]" /> {details.address}</p>
                    </div>
                    <Link to="/" className="btn-premium px-12 py-5 inline-block text-sm">VOLVER AL INICIO</Link>
                </motion.div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-[#0a0a0a] flex items-center justify-center px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 grayscale opacity-30 border border-white/5">
                        <ShoppingBag size={48} />
                    </div>
                    <h1 className="text-4xl font-black mb-4 italic uppercase tracking-tighter">Tu carrito está <span className="text-[#d4af37]">vacío</span></h1>
                    <p className="text-gray-500 mb-10 italic">La mejor cava de Trujillo te espera.</p>
                    <Link to="/" className="btn-premium px-10 py-4 inline-block text-sm">DESCUBRIR CATÁLOGO</Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 min-h-screen bg-[#0a0a0a]">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                    <h1 className="text-5xl font-black italic uppercase tracking-tighter">Mi <span className="text-[#d4af37]">Orden</span></h1>
                    {!user && (
                        <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 px-6 py-3 rounded-2xl flex items-center gap-3 animate-pulse">
                            <AlertCircle size={18} className="text-[#d4af37]" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Inicia sesión para finalizar compra</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Products List */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {cart.map((item) => {
                                const isWholesale = item.wholesale_price && item.wholesale_min && item.quantity >= item.wholesale_min;
                                const currentPrice = isWholesale ? item.wholesale_price! : item.price;

                                return (
                                    <motion.div
                                        layout key={item.id} exit={{ opacity: 0, x: -20 }}
                                        className="bg-[#111] p-8 rounded-[3rem] border border-white/5 flex flex-col md:flex-row items-center gap-8 group hover:border-[#d4af37]/30 transition-all shadow-xl"
                                    >
                                        <div className="w-28 h-28 rounded-3xl overflow-hidden shrink-0 border-2 border-white/5 group-hover:border-[#d4af37]/50 transition-all shadow-inner">
                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <h3 className="font-black text-white text-2xl mb-1 italic uppercase tracking-tighter">{item.name}</h3>
                                            <div className="flex flex-wrap justify-center md:justify-start gap-4 items-center">
                                                <p className={`text-xl font-black tracking-tighter ${isWholesale ? 'text-green-500 scale-110' : 'text-[#d4af37]'}`}>
                                                    S/ {currentPrice.toFixed(2)}
                                                </p>
                                                {isWholesale && (
                                                    <span className="text-[10px] bg-green-500/10 text-green-500 px-3 py-1 rounded-full font-black uppercase tracking-[0.2em]">MAYORISTA</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="flex items-center gap-5 bg-white/5 p-3 rounded-2xl border border-white/10 shadow-inner">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-500 hover:text-white transition-all"><Minus size={18} /></button>
                                                <span className="font-black text-2xl italic w-8 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-500 hover:text-white transition-all"><Plus size={18} /></button>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="text-gray-700 hover:text-red-500 transition-colors"><Trash2 size={24} /></button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Summary & Checkout */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#111] p-10 rounded-[3.5rem] border border-white/5 sticky top-32 shadow-3xl">
                            {!isCheckingOut ? (
                                <>
                                    <h2 className="text-2xl font-black mb-10 italic uppercase tracking-tighter">Total <span className="text-[#d4af37]">Resumen</span></h2>
                                    <div className="space-y-6 mb-10">
                                        <div className="flex justify-between text-gray-400 text-xs font-black uppercase tracking-widest">
                                            <span>MERCANCÍA</span>
                                            <span className="text-white text-lg italic">S/ {subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="pt-6 border-t border-white/5">
                                            <div className="flex items-center gap-3 text-[#d4af37] mb-6">
                                                <Truck size={18} />
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Cálculo de Entrega</span>
                                            </div>
                                            <div className="flex items-center gap-4 mb-6">
                                                <input
                                                    type="number" min="0" placeholder="KM de distancia"
                                                    value={distance || ''}
                                                    onChange={(e) => setDistance(Number(e.target.value))}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-[#d4af37] outline-none transition-all font-black text-white italic"
                                                />
                                            </div>
                                            <div className="flex justify-between text-gray-400 text-xs font-black uppercase tracking-widest">
                                                <span>DELIVERY EXPRESS</span>
                                                <span className={deliveryFee === 0 ? 'text-green-500' : 'text-white'}>
                                                    {deliveryFee === 0 ? 'CORTESÍA' : `S/ ${deliveryFee.toFixed(2)}`}
                                                </span>
                                            </div>
                                            {subtotal < 100 && (
                                                <div className="mt-4 p-3 bg-white/5 rounded-xl flex items-center gap-2">
                                                    <Info size={14} className="text-gray-500" />
                                                    <p className="text-[9px] text-gray-500 font-bold uppercase italic tracking-widest">¡Agrega S/ {(100 - subtotal).toFixed(2)} para delivery GRATIS!</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="pt-8 border-t-2 border-white/5 flex justify-between items-end">
                                            <span className="text-gray-500 font-black uppercase text-[10px] tracking-widest mb-2">Total Final</span>
                                            <span className="text-5xl font-black text-[#d4af37] italic tracking-tighter">S/ {total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCheckoutStart}
                                        className="w-full btn-premium py-6 flex items-center justify-center gap-3 active:scale-95 shadow-2xl"
                                    >
                                        VERIFICAR DATOS <ChevronRight size={20} />
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex items-center gap-4 mb-8">
                                        <button onClick={() => setIsCheckingOut(false)} className="text-gray-500 hover:text-white uppercase text-[10px] font-black tracking-widest italic flex items-center gap-1">
                                            <ChevronDown className="rotate-90" size={14} /> ATRÁS
                                        </button>
                                        <h2 className="text-2xl font-black italic uppercase italic tracking-tighter">Pasarela <span className="text-[#d4af37]">VIP</span></h2>
                                    </div>

                                    <div className="flex gap-2">
                                        <button onClick={() => setInvoiceType('boleta')} className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${invoiceType === 'boleta' ? 'bg-[#d4af37] border-[#d4af37] text-black shadow-lg' : 'bg-white/5 border-white/5 text-gray-500'}`}>BOLETA</button>
                                        <button onClick={() => setInvoiceType('factura')} className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${invoiceType === 'factura' ? 'bg-[#1a1a1a] border-[#d4af37] text-[#d4af37] shadow-lg' : 'bg-white/5 border-white/5 text-gray-500'}`}>FACTURA</button>
                                    </div>

                                    <div className="space-y-5">
                                        <div>
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-3">{invoiceType === 'boleta' ? 'DNI' : 'RUC'}</label>
                                            <input type="text" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 mt-2 text-sm italic font-black text-white"
                                                value={details.ruc_dni} onChange={e => setDetails({ ...details, ruc_dni: e.target.value })} />
                                        </div>
                                        {invoiceType === 'factura' && (
                                            <div>
                                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-3">Razón Social</label>
                                                <input type="text" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 mt-2 text-sm italic font-black text-white"
                                                    value={details.company} onChange={e => setDetails({ ...details, company: e.target.value })} />
                                            </div>
                                        )}
                                        <div>
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-3">Dirección de Entrega</label>
                                            <input type="text" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 mt-2 text-sm italic font-black text-white"
                                                value={details.address} onChange={e => setDetails({ ...details, address: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-3">Contacto Trujillo (Celular)</label>
                                            <input type="tel" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 mt-2 text-sm italic font-black text-white"
                                                value={details.phone} onChange={e => setDetails({ ...details, phone: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/5">
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-gray-500 font-black text-[10px] uppercase">Total con Delivery</span>
                                            <span className="text-3xl font-black text-[#d4af37] italic">S/ {total.toFixed(2)}</span>
                                        </div>
                                        <button
                                            onClick={handlePlaceOrder}
                                            className="w-full btn-premium py-6 flex items-center justify-center gap-3 shadow-3xl text-sm"
                                        >
                                            FINALIZAR Y EMITIR COMPROBANTE <FileText size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
