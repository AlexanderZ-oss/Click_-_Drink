import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { cart } = useCart();
    const { user, profile, signOut, isAdmin } = useAuth();

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) setScrolled(true);
            else setScrolled(false);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = async () => {
        await signOut();
    };

    return (
        <header className={`fixed w-full z-[100] transition-all duration-700 ${scrolled ? 'bg-[#0a0a0a]/80 backdrop-blur-2xl py-3 border-b border-white/5' : 'bg-transparent py-8'}`}>
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3 group">
                        <span className="text-3xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">🍸</span>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black italic bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] bg-clip-text text-transparent leading-none">
                                FEREST
                            </span>
                            <span className="text-[8px] font-black tracking-[0.4em] text-gray-500 uppercase mt-1">Premium Liquor Store</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/" className={`text-[10px] font-black tracking-[0.3em] hover:text-[#d4af37] transition-all uppercase italic ${location.pathname === '/' ? 'text-[#d4af37]' : 'text-gray-400'}`}>
                            INICIO
                        </Link>
                        <Link to="/catalog" className={`text-[10px] font-black tracking-[0.3em] hover:text-[#d4af37] transition-all uppercase italic ${location.pathname === '/catalog' ? 'text-[#d4af37]' : 'text-gray-400'}`}>
                            CATÁLOGO
                        </Link>
                        <Link to="/promotions" className={`text-[10px] font-black tracking-[0.3em] hover:text-[#d4af37] transition-all uppercase italic ${location.pathname === '/promotions' ? 'text-[#d4af37]' : 'text-gray-400'}`}>
                            PROMOCIONES
                        </Link>
                        <Link to="/nightclubs" className={`text-[10px] font-black tracking-[0.3em] hover:text-[#d4af37] transition-all uppercase italic ${location.pathname === '/nightclubs' ? 'text-[#d4af37]' : 'text-gray-400'}`}>
                            DISCOTECAS
                        </Link>
                        <Link to="/contact" className={`text-[10px] font-black tracking-[0.3em] hover:text-[#d4af37] transition-all uppercase italic ${location.pathname === '/contact' ? 'text-[#d4af37]' : 'text-gray-400'}`}>
                            CONTACTO
                        </Link>
                        {isAdmin && (
                            <Link to="/admin" className={`text-[10px] font-black tracking-[0.3em] text-[#d4af37] border border-[#d4af37]/30 px-4 py-2 rounded-xl hover:bg-[#d4af37] hover:text-black transition-all uppercase italic ${location.pathname === '/admin' ? 'bg-[#d4af37] text-black' : ''}`}>
                                ADMIN
                            </Link>
                        )}
                    </nav>

                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/cart" className="relative p-3 bg-white/5 border border-white/5 rounded-2xl hover:border-[#d4af37]/30 transition-all group">
                            <ShoppingCart className="w-5 h-5 text-gray-400 group-hover:text-[#d4af37] transition-colors" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#d4af37] text-black text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-[0_5px_15px_rgba(212,175,55,0.4)] border-2 border-[#0a0a0a]">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{isAdmin ? 'Admin' : 'Usuario'}</p>
                                    <p className="text-[10px] text-white font-bold italic lowercase">{user.email?.split('@')[0]}</p>
                                </div>
                                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition-colors">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className="text-[10px] font-black text-white uppercase tracking-widest hover:text-[#d4af37] transition-all px-4 py-2"
                                >
                                    Ingresar
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-[#d4af37] text-black px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#f3e5ab] transition-all shadow-lg shadow-[#d4af37]/10"
                                >
                                    Unirse
                                </Link>
                            </div>
                        )}
                    </div>

                    <button className="md:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="md:hidden absolute top-full left-0 w-full bg-[#0a0a0a]/95 backdrop-blur-2xl border-b border-white/5 py-10"
                    >
                        <div className="flex flex-col items-center gap-8 font-black text-xs tracking-[0.4em] uppercase italic px-6">
                            <Link to="/" className="text-gray-400 hover:text-[#d4af37]" onClick={() => setIsOpen(false)}>INICIO</Link>
                            <Link to="/catalog" className="text-gray-400 hover:text-[#d4af37]" onClick={() => setIsOpen(false)}>CATÁLOGO</Link>
                            <Link to="/promotions" className="text-gray-400 hover:text-[#d4af37]" onClick={() => setIsOpen(false)}>PROMOCIONES</Link>
                            <Link to="/nightclubs" className="text-gray-400 hover:text-[#d4af37]" onClick={() => setIsOpen(false)}>DISCOTECAS</Link>
                            <Link to="/contact" className="text-gray-400 hover:text-[#d4af37]" onClick={() => setIsOpen(false)}>CONTACTO</Link>
                            <Link to="/cart" className="text-gray-400 hover:text-[#d4af37]" onClick={() => setIsOpen(false)}>CARRITO ({cartCount})</Link>
                            {isAdmin && <Link to="/admin" className="text-[#d4af37]" onClick={() => setIsOpen(false)}>ADMIN</Link>}
                            <div className="w-full pt-8 border-t border-white/10 space-y-4">
                                {user ? (
                                    <>
                                        <p className="text-center text-sm text-white">{user.email}</p>
                                        <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-red-500 tracking-widest">CERRAR SESIÓN</button>
                                    </>
                                ) : (
                                    <div className="flex flex-col w-full gap-4">
                                        <Link
                                            to="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="block w-full text-center py-4 bg-white/5 border border-white/10 rounded-2xl tracking-widest font-black uppercase text-[10px]"
                                        >
                                            INGRESAR
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setIsOpen(false)}
                                            className="block w-full text-center py-4 bg-[#d4af37] text-black rounded-2xl tracking-widest font-black uppercase text-[10px]"
                                        >
                                            REGISTRARSE
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
