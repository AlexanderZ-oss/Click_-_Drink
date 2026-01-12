import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { cart } = useCart();

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                checkAdminRole(session.user.id);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                checkAdminRole(session.user.id);
            } else {
                setIsAdmin(false);
            }
        });

        const checkAdminRole = async (userId: string) => {
            try {
                const { data } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', userId)
                    .single();

                setIsAdmin(data?.role === 'admin');
            } catch (error) {
                console.error('Error checking admin role:', error);
            }
        };

        const handleScroll = () => {
            if (window.scrollY > 50) setScrolled(true);
            else setScrolled(false);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            subscription.unsubscribe();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const handleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#333]' : 'bg-transparent'}`}>
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 group">
                        <span className="text-2xl transition-transform group-hover:scale-110">🍸</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] bg-clip-text text-transparent">
                            FEREST
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/" className={`text-sm font-medium hover:text-[#d4af37] transition-colors ${location.pathname === '/' ? 'text-[#d4af37]' : 'text-gray-300'}`}>
                            INICIO
                        </Link>
                        <Link to="/contact" className={`text-sm font-medium hover:text-[#d4af37] transition-colors ${location.pathname === '/contact' ? 'text-[#d4af37]' : 'text-gray-300'}`}>
                            CONTACTO
                        </Link>
                        {isAdmin && (
                            <Link to="/admin" className={`text-sm font-medium hover:text-[#d4af37] transition-colors ${location.pathname === '/admin' ? 'text-[#d4af37]' : 'text-gray-300'}`}>
                                ADMIN
                            </Link>
                        )}
                    </nav>

                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/cart" className="relative p-2 hover:bg-[#1a1a1a] rounded-full transition-colors group">
                            <ShoppingCart className="w-5 h-5 text-gray-300 group-hover:text-[#d4af37]" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#d4af37] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-300 font-bold tracking-tight italic">{user.email?.split('@')[0]}</span>
                                <button onClick={handleLogout} className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors text-gray-300 hover:text-red-500">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <button onClick={handleLogin} className="btn-premium text-sm py-1 px-4">
                                INGRESAR
                            </button>
                        )}
                    </div>

                    <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                        className="md:hidden absolute top-full left-0 w-full bg-[#0a0a0a] border-b border-[#333] py-4 overflow-hidden"
                    >
                        <div className="flex flex-col gap-4 px-4 font-bold text-xs tracking-widest uppercase">
                            <Link to="/" className="text-gray-300 hover:text-[#d4af37]" onClick={() => setIsOpen(false)}>INICIO</Link>
                            <Link to="/contact" className="text-gray-300 hover:text-[#d4af37]" onClick={() => setIsOpen(false)}>CONTACTO</Link>
                            <Link to="/cart" className="text-gray-300 hover:text-[#d4af37] flex justify-between" onClick={() => setIsOpen(false)}>
                                CARRITO <span>({cartCount})</span>
                            </Link>
                            {isAdmin && <Link to="/admin" className="text-[#d4af37]" onClick={() => setIsOpen(false)}>ADMIN</Link>}
                            {user ? (
                                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-left text-red-500">CERRAR SESIÓN</button>
                            ) : (
                                <button onClick={() => { handleLogin(); setIsOpen(false); }} className="btn-premium w-full">INGRESAR GOOGLE</button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
