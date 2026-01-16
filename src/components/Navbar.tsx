import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
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
        { name: 'Eventos', path: '/events' },
        { name: 'Promociones', path: '/promotions' },
        { name: 'Contacto', path: '/contact' },
    ];

    return (
        <header className={`fixed w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-black/90 backdrop-blur-md py-4 border-b border-white/5' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-8">
                <div className="flex justify-between items-center">
                    {/* Logo Limpio sin "Premium" */}
                    <Link to="/" className="group">
                        <h1 className="text-2xl font-serif text-white tracking-widest flex items-center gap-2">
                            <span className="text-[#c5a059] font-medium">F</span>EREST
                        </h1>
                        <p className="text-[8px] font-bold tracking-[0.4em] text-gray-500 uppercase mt-1">Licores y Experiencias</p>
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden lg:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:text-[#c5a059] ${location.pathname === link.path ? 'text-[#c5a059]' : 'text-gray-400'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Icons */}
                    <div className="hidden lg:flex items-center gap-8">
                        {isAdmin && (
                            <Link to="/admin" className="text-[9px] font-bold tracking-[0.2em] text-[#c5a059] border border-[#c5a059]/30 px-5 py-2 hover:bg-[#c5a059] hover:text-black transition-all uppercase">
                                Panel Admin
                            </Link>
                        )}

                        <Link to="/cart" className="relative text-gray-400 hover:text-white transition-colors">
                            <ShoppingCart size={18} strokeWidth={1.5} />
                            {cartCount > 0 && (
                                <span className="absolute -top-3 -right-3 bg-[#c5a059] text-black text-[8px] font-bold w-5 h-5 flex items-center justify-center rounded-sm">
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
                            <Link to="/login" className="text-gray-400 hover:text-white flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase">
                                <UserIcon size={18} strokeWidth={1.5} />
                                <span>Ingresar</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button className="lg:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-black border-b border-white/5 overflow-hidden"
                    >
                        <div className="flex flex-col gap-6 p-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 hover:text-[#c5a059]"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
