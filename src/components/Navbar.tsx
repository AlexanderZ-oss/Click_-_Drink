import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { cart } = useCart();
    const { user, signOut, isAdmin } = useAuth();

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) setScrolled(true);
            else setScrolled(false);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Inicio', path: '/' },
        { name: 'Catálogo', path: '/catalog' },
        { name: 'Promociones', path: '/promotions' },
        { name: 'Contacto', path: '/contact' },
    ];

    return (
        <header className={`fixed w-full z-[100] transition-all duration-1000 ${scrolled ? 'bg-black/80 backdrop-blur-2xl py-4 border-b border-white/5' : 'bg-transparent py-8'}`}>
            <div className="container mx-auto px-10">
                <div className="flex justify-between items-center">
                    {/* Logo Elegante */}
                    <Link to="/" className="group">
                        <h1 className="text-2xl font-serif italic text-white tracking-tight flex items-center gap-3">
                            <span className="text-[#c5a059] not-italic font-light">F</span>EREST
                        </h1>
                        <p className="text-[7px] font-bold tracking-[0.5em] text-gray-500 uppercase mt-1 group-hover:text-[#c5a059] transition-colors">Premium Liquor Boutique</p>
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden lg:flex items-center gap-12">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-300 hover:text-[#c5a059] ${location.pathname === link.path ? 'text-[#c5a059]' : 'text-gray-400'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Icons */}
                    <div className="hidden lg:flex items-center gap-8">
                        {isAdmin && (
                            <Link to="/admin" className="text-[9px] font-black tracking-widest text-[#c5a059] border border-[#c5a059]/30 px-4 py-2 hover:bg-[#c5a059] hover:text-black transition-all uppercase">
                                Admin Dashboard
                            </Link>
                        )}

                        <Link to="/cart" className="relative text-gray-400 hover:text-white transition-colors">
                            <ShoppingCart size={18} strokeWidth={1.5} />
                            {cartCount > 0 && (
                                <span className="absolute -top-3 -right-3 bg-[#c5a059] text-black text-[8px] font-black w-5 h-5 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{user.email?.split('@')[0]}</span>
                                <button onClick={() => signOut()} className="text-gray-600 hover:text-white transition-colors">
                                    <LogOut size={16} strokeWidth={1.5} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="text-gray-400 hover:text-white">
                                <User size={18} strokeWidth={1.5} />
                            </Link>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button className="lg:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="lg:hidden absolute top-full left-0 w-full bg-black border-b border-white/5 py-12 px-10"
                    >
                        <div className="flex flex-col gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="text-[11px] font-bold tracking-[0.4em] uppercase text-gray-400 hover:text-[#c5a059]"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {user && isAdmin && (
                                <Link to="/admin" onClick={() => setIsOpen(false)} className="text-[#c5a059] text-[11px] font-bold tracking-[0.4em] uppercase">Panel Admin</Link>
                            )}
                            <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                                {user ? (
                                    <button onClick={() => { signOut(); setIsOpen(false); }} className="text-red-500 text-[11px] font-bold tracking-[0.4em] uppercase">Cerrar Sesión</button>
                                ) : (
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="text-white text-[11px] font-bold tracking-[0.4em] uppercase">Iniciar Sesión</Link>
                                )}
                                <Link to="/cart" onClick={() => setIsOpen(false)} className="text-[#c5a059] text-[11px] font-bold tracking-[0.4em] uppercase">Carrito ({cartCount})</Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
