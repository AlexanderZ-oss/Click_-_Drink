import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, MapPin, Truck, ChevronRight, ShoppingBag, CreditCard, ChevronDown, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToaster } from '../components/ui/Toaster';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Stripe Public Key
const stripePromise = loadStripe('pk_test_51SlDOJRTyk5rxpp0DTU5MQM3yv8WZvxkKa9x7NzJGosrNSg9Uxaml3D0IGFe77ObPXez81TPpEPED5MYj3dMh8tA00KEHf9pB5');

const CheckoutForm = ({ total, details, invoiceType, onOrderSuccess, onPayingState }: any) => {
    const stripe = useStripe();
    const elements = useElements();
    const { showToast } = useToaster();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        onPayingState(true);
        showToast('Procesando pago con Stripe...', 'info');

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement!,
            billing_details: {
                address: { line1: details.address },
                phone: details.phone,
            },
        });

        if (error) {
            showToast(error.message || 'Error en el pago', 'error');
            onPayingState(false);
        } else {
            console.log('[PaymentMethod]', paymentMethod);
            showToast('Pago autorizado exitosamente.', 'success');
            setTimeout(() => {
                onOrderSuccess();
            }, 1000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
                <div className="flex items-center gap-3 text-emerald-400 mb-6">
                    <div className="p-2 bg-emerald-400/10 rounded-full">
                        <Lock size={14} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">Pago Seguro SSL</span>
                </div>
                <div className="p-4 bg-black/50 rounded-2xl border border-white/10 transition-colors focus-within:border-[#d4af37]/50">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#fff',
                                    '::placeholder': { color: '#666' },
                                    fontSmoothing: 'antialiased',
                                    iconColor: '#d4af37',
                                },
                                invalid: { color: '#ef4444' },
                            },
                        }}
                    />
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 opacity-50">
                    <span className="text-[10px] uppercase tracking-widest text-white/50">Powered by Stripe</span>
                </div>
            </div>

            <div className="flex justify-between items-center py-4 border-t border-white/10">
                <span className="text-sm font-medium text-white/60">Total a pagar</span>
                <span className="text-3xl font-bold text-[#d4af37]">S/ {total.toFixed(2)}</span>
            </div>

            <button
                type="submit"
                disabled={!stripe}
                className="w-full bg-[#d4af37] hover:bg-[#b5952f] text-black font-bold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <CreditCard size={20} />
                <span>PAGAR AHORA</span>
            </button>
        </form>
    );
};

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, subtotal, deliveryFee, total, distance, setDistance, clearCart } = useCart();
    const [user, setUser] = useState<any>(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [invoiceType, setInvoiceType] = useState<'boleta' | 'factura'>('boleta');
    const [details, setDetails] = useState({ ruc_dni: '', address: '', phone: '', company: '', delivery_time: '' });
    const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
    const [isPaying, setIsPaying] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToaster();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });
    }, []);

    const handleCheckoutStart = () => {
        if (!user) {
            showToast('Inicia sesión para continuar con tu compra.', 'info');
            // Allow checking out layout to appear, but maybe prompt login there? 
            // Or just redirect.
            // User requirement: "Debes iniciar sesión o registrarte"
            setTimeout(() => navigate('/login'), 1500);
            return;
        }
        setIsCheckingOut(true);
    };

    const handleFinalOrder = async () => {
        const { data, error } = await supabase.from('orders').insert([{
            user_id: user.id,
            customer_email: user.email,
            total: total,
            status: 'paid',
            items: cart,
            delivery_address: details.address,
            customer_phone: details.phone,
            delivery_fee: deliveryFee,
            invoice_type: invoiceType,
            ruc_dni: details.ruc_dni,
            company_name: details.company,
            delivery_time: details.delivery_time
        }]).select().single();

        if (error) {
            console.error('Order Error:', error);
            showToast('Error al registrar pedido: ' + error.message, 'error');
            setIsPaying(false);
        } else {
            setOrderSuccess(data.id);
            clearCart();
        }
    };

    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/10 via-[#000000] to-[#000000] z-0" />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="bg-[#111111]/80 backdrop-blur-xl p-10 md:p-16 rounded-[3rem] border border-white/10 text-center max-w-xl z-10 shadow-2xl"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                        className="w-28 h-28 bg-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-10 text-black shadow-[0_0_40px_rgba(212,175,55,0.4)]"
                    >
                        <CheckCircle2 size={56} strokeWidth={2.5} />
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">¡Pedido Recibido!</h1>
                    <p className="text-gray-400 mb-10 text-lg leading-relaxed font-light">
                        Tu pedido <span className="text-[#d4af37] font-mono font-medium">#{orderSuccess.slice(0, 8)}</span> ha sido procesado exitosamente. Te enviaremos los detalles a tu correo.
                    </p>

                    <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase border-b-2 border-[#d4af37] pb-1 text-[#d4af37] hover:text-white hover:border-white transition-colors">
                        <ArrowLeft size={16} /> Volver a la tienda
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-[#050505] flex items-center justify-center px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
                    <div className="w-32 h-32 bg-[#111] rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
                        <ShoppingBag size={48} className="text-white/20" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4 text-white">Tu carrito está vacío</h1>
                    <p className="text-gray-500 mb-8">Parece que aún no has agregado nada.</p>
                    <Link to="/catalog" className="bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-[#d4af37] transition-colors inline-block text-sm tracking-wide">
                        EXPLORAR CATÁLOGO
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-4 md:px-8 selection:bg-[#d4af37] selection:text-black">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex items-end justify-between">
                    <div>
                        <Link to="/catalog" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-4">
                            <ArrowLeft size={14} /> Seguir comprando
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Tu <span className="text-[#d4af37]">Orden</span></h1>
                    </div>
                    <div className="hidden md:block text-right">
                        <p className="text-white/40 text-sm">{cart.reduce((acc, item) => acc + item.quantity, 0)} items en tu carrito</p>
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                    {/* Cart Items Column */}
                    <div className="lg:col-span-7 space-y-6">
                        <AnimatePresence mode="popLayout">
                            {cart.map((item) => (
                                <motion.div
                                    layout
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-[#111] border border-white/5 p-4 rounded-[2rem] flex items-center gap-6 group hover:border-white/10 transition-all"
                                >
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shrink-0 bg-[#000]">
                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-lg md:text-xl truncate pr-4">{item.name}</h3>
                                        <p className="text-[#d4af37] font-medium text-lg mt-1">S/ {item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-4 pr-2">
                                        <button onClick={() => removeFromCart(item.id)} className="text-white/20 hover:text-red-500 transition-colors p-2">
                                            <Trash2 size={20} />
                                        </button>
                                        <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-xl border border-white/5">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="font-mono font-bold text-white w-6 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Checkout Column */}
                    <div className="lg:col-span-5 relative">
                        <div className="sticky top-32">
                            <AnimatePresence mode="wait">
                                {!isCheckingOut ? (
                                    <motion.div
                                        key="summary"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-[#111] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl"
                                    >
                                        <h2 className="text-2xl font-bold text-white mb-8">Resumen</h2>

                                        <div className="space-y-6">
                                            <div className="flex justify-between text-white/50 text-sm">
                                                <span>Subtotal</span>
                                                <span className="text-white font-mono">S/ {subtotal.toFixed(2)}</span>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">Distancia de Envío (KM)</label>
                                                <div className="relative">
                                                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                                    <input
                                                        type="number"
                                                        value={distance || ''}
                                                        onChange={(e) => setDistance(Number(e.target.value))}
                                                        placeholder="0"
                                                        className="w-full bg-black/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white font-mono placeholder:text-white/20 focus:border-[#d4af37] outline-none transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-between text-white/50 text-sm">
                                                <span>Costo de Envío</span>
                                                <span className="text-white font-mono">S/ {deliveryFee.toFixed(2)}</span>
                                            </div>

                                            <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                                <span className="text-lg font-medium text-white">Total</span>
                                                <span className="text-4xl font-bold text-[#d4af37]">S/ {total.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleCheckoutStart}
                                            className="w-full mt-8 bg-white hover:bg-gray-200 text-black font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98]"
                                        >
                                            CONTINUAR COMPRA <ChevronRight size={18} />
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="checkout"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-[#111] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl"
                                    >
                                        <button onClick={() => setIsCheckingOut(false)} className="flex items-center gap-2 text-white/50 hover:text-white text-xs font-bold uppercase tracking-widest mb-8 transition-colors">
                                            <ArrowLeft size={12} /> Volver
                                        </button>

                                        <h2 className="text-2xl font-bold text-white mb-6">Datos de Facturación</h2>

                                        <div className="space-y-4 mb-8">
                                            <div className="bg-black/30 p-1 rounded-2xl flex gap-1 border border-white/5">
                                                <button
                                                    onClick={() => setInvoiceType('boleta')}
                                                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${invoiceType === 'boleta' ? 'bg-[#d4af37] text-black shadow-lg' : 'text-white/50 hover:text-white'}`}
                                                >
                                                    BOLETA
                                                </button>
                                                <button
                                                    onClick={() => setInvoiceType('factura')}
                                                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${invoiceType === 'factura' ? 'bg-[#d4af37] text-black shadow-lg' : 'text-white/50 hover:text-white'}`}
                                                >
                                                    FACTURA
                                                </button>
                                            </div>

                                            <div className="space-y-3">
                                                <input type="text" placeholder={invoiceType === 'boleta' ? 'DNI' : 'RUC'} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#d4af37] outline-none" value={details.ruc_dni} onChange={e => setDetails({ ...details, ruc_dni: e.target.value })} />
                                                {invoiceType === 'factura' &&
                                                    <input type="text" placeholder="Razón Social" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#d4af37] outline-none" value={details.company} onChange={e => setDetails({ ...details, company: e.target.value })} />
                                                }
                                                <input type="text" placeholder="Dirección de Entrega" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#d4af37] outline-none" value={details.address} onChange={e => setDetails({ ...details, address: e.target.value })} />
                                                <input type="tel" placeholder="Teléfono / Celular" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#d4af37] outline-none" value={details.phone} onChange={e => setDetails({ ...details, phone: e.target.value })} />
                                                <div className="pt-2">
                                                    <label className="block text-[10px] uppercase font-bold text-[#d4af37] mb-2 tracking-widest">Hora de Entrega (Eventos)</label>
                                                    <input
                                                        type="time"
                                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#d4af37] outline-none"
                                                        value={details.delivery_time}
                                                        onChange={e => setDetails({ ...details, delivery_time: e.target.value })}
                                                    />
                                                    <p className="text-[9px] text-gray-500 mt-1">Opcional. Especifica la hora para entregas programadas.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-white/10">
                                            <Elements stripe={stripePromise}>
                                                <CheckoutForm total={total} details={details} invoiceType={invoiceType} onOrderSuccess={handleFinalOrder} onPayingState={setIsPaying} />
                                            </Elements>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
