import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, MapPin, Truck, ChevronRight, ShoppingBag, Landmark, CreditCard, ChevronDown, CheckCircle2, FileText, AlertCircle, Info, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToaster } from '../components/ui/Toaster';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Stripe Public Key provided by USER
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
                address: {
                    line1: details.address,
                },
                phone: details.phone,
            },
        });

        if (error) {
            showToast(error.message || 'Error en el pago', 'error');
            onPayingState(false);
        } else {
            console.log('[PaymentMethod]', paymentMethod);
            showToast('Pago autorizado exitosamente.', 'success');
            // En un entorno real aquí llamarías a tu backend para confirmar el pago
            // Por ahora simularemos el éxito
            setTimeout(() => {
                onOrderSuccess();
            }, 1000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-[2rem] mb-6">
                <div className="flex items-center gap-3 text-blue-400 mb-6">
                    <CreditCard size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Pasarela Segura SSL</span>
                </div>
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '14px',
                                    color: '#fff',
                                    '::placeholder': { color: '#4b5563' },
                                    fontSmoothing: 'antialiased',
                                },
                                invalid: { color: '#ef4444' },
                            },
                        }}
                    />
                </div>
                <p className="text-[9px] text-gray-600 mt-4 text-center font-bold uppercase italic">Encriptación de extremo a extremo</p>
            </div>

            <div className="flex justify-between items-center mb-8 px-2">
                <span className="text-gray-500 font-black text-[10px] uppercase">Final a Pagar</span>
                <span className="text-4xl font-black text-[#d4af37] italic">S/ {total.toFixed(2)}</span>
            </div>

            <button
                type="submit"
                disabled={!stripe}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-2xl flex items-center justify-center gap-3 shadow-3xl text-sm transition-all active:scale-95 disabled:opacity-50"
            >
                <Lock size={18} /> PAGAR S/ {total.toFixed(2)}
            </button>
        </form>
    );
};

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, subtotal, deliveryFee, total, distance, setDistance, clearCart } = useCart();
    const [user, setUser] = useState<any>(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [invoiceType, setInvoiceType] = useState<'boleta' | 'factura'>('boleta');
    const [details, setDetails] = useState({ ruc_dni: '', address: '', phone: '', company: '' });
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
            showToast('¡Atención! Debes iniciar sesión o registrarte para realizar pedidos.', 'error');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }
        setIsCheckingOut(true);
    };

    const handleFinalOrder = async () => {
        const { data, error } = await supabase.from('orders').insert([{
            user_id: user.id,
            total_amount: total,
            status: 'paid',
            items: cart,
            shipping_address: details.address,
            contact_phone: details.phone,
            delivery_fee: deliveryFee,
            distance_km: distance,
            invoice_type: invoiceType,
            ruc_dni: details.ruc_dni,
            company_name: details.company
        }]).select().single();

        if (error) {
            showToast('Error al registrar pedido: ' + error.message, 'error');
            setIsPaying(false);
        } else {
            showToast('¡Pedido completado con éxito!', 'success');
            setOrderSuccess(data.id);
            clearCart();
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
                        Gracias por elegir Ferest Premium. Su pedido <span className="text-white font-bold">#ORD-{orderSuccess.slice(0, 8)}</span> está en camino.
                    </p>
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
                    <h1 className="text-3xl font-black mb-4 italic uppercase tracking-tighter">Carrito Vacío</h1>
                    <Link to="/catalog" className="btn-premium px-10 py-4 inline-block text-sm">CATÁLOGO</Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 min-h-screen bg-[#0a0a0a]">
            <div className="container mx-auto px-4 text-white">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                    <h1 className="text-5xl font-black italic uppercase tracking-tighter">Mi <span className="text-[#d4af37]">Orden</span></h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {cart.map((item) => (
                                <motion.div layout key={item.id} exit={{ opacity: 0, x: -20 }} className="bg-[#111] p-8 rounded-[3rem] border border-white/5 flex flex-col md:flex-row items-center gap-8 shadow-xl relative overflow-hidden group">
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-white/10 group-hover:border-[#d4af37]/30 transition-all">
                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="font-black text-white text-xl mb-1 italic uppercase tracking-tighter">{item.name}</h3>
                                        <p className="text-[#d4af37] font-black italic">S/ {item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-xl border border-white/10">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-500 hover:text-white"><Minus size={16} /></button>
                                            <span className="font-black italic w-6 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-500 hover:text-white"><Plus size={16} /></button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="text-gray-700 hover:text-red-500"><Trash2 size={20} /></button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-[#111] p-10 rounded-[3.5rem] border border-white/5 sticky top-32 shadow-3xl">
                            <AnimatePresence mode="wait">
                                {!isCheckingOut ? (
                                    <motion.div key="summary" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                        <h2 className="text-xl font-black mb-8 italic uppercase tracking-widest">Resumen de <span className="text-[#d4af37]">Compra</span></h2>
                                        <div className="space-y-4 mb-8">
                                            <div className="flex justify-between text-xs font-black uppercase text-gray-500 italic"><span>Subtotal</span><span className="text-white">S/ {subtotal.toFixed(2)}</span></div>
                                            <div className="pt-4 border-t border-white/5">
                                                <input type="number" placeholder="KM Distancia" value={distance || ''} onChange={(e) => setDistance(Number(e.target.value))} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs italic font-black mb-4 focus:border-[#d4af37] outline-none" />
                                                <div className="flex justify-between text-xs font-black uppercase text-gray-500 italic"><span>Envío</span><span className="text-white">S/ {deliveryFee.toFixed(2)}</span></div>
                                            </div>
                                            <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                                <span className="text-[10px] font-black uppercase text-gray-600 italic">Total</span>
                                                <span className="text-4xl font-black text-[#d4af37] italic">S/ {total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <button onClick={handleCheckoutStart} className="w-full btn-premium py-5 flex items-center justify-center gap-3">IR AL PAGO <ChevronRight size={18} /></button>
                                    </motion.div>
                                ) : (
                                    <motion.div key="checkout" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                        <button onClick={() => setIsCheckingOut(false)} className="text-[9px] font-black text-gray-500 hover:text-white uppercase italic tracking-widest mb-4">← VOLVER AL CARRITO</button>
                                        <div className="space-y-4">
                                            <div className="flex gap-2 mb-4">
                                                <button onClick={() => setInvoiceType('boleta')} className={`flex-1 py-3 rounded-xl border text-[9px] font-black italic transition-all ${invoiceType === 'boleta' ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'bg-white/5 border-white/5 text-gray-500'}`}>BOLETA</button>
                                                <button onClick={() => setInvoiceType('factura')} className={`flex-1 py-3 rounded-xl border text-[9px] font-black italic transition-all ${invoiceType === 'factura' ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'bg-white/5 border-white/5 text-gray-500'}`}>FACTURA</button>
                                            </div>
                                            <input type="text" placeholder={invoiceType === 'boleta' ? 'DNI' : 'RUC'} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs italic font-black" value={details.ruc_dni} onChange={e => setDetails({ ...details, ruc_dni: e.target.value })} />
                                            {invoiceType === 'factura' && <input type="text" placeholder="Razón Social" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs italic font-black" value={details.company} onChange={e => setDetails({ ...details, company: e.target.value })} />}
                                            <input type="text" placeholder="Dirección Trujillo" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs italic font-black" value={details.address} onChange={e => setDetails({ ...details, address: e.target.value })} />
                                            <input type="tel" placeholder="Celular" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs italic font-black" value={details.phone} onChange={e => setDetails({ ...details, phone: e.target.value })} />
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
