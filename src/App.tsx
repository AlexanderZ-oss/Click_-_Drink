import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnnouncementBanner from './components/AnnouncementBanner';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Promotions from './pages/Promotions';
import Nightclubs from './pages/Nightclubs';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import Debug from './pages/Debug';
import { Toaster } from './components/ui/Toaster';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToasterProvider } from './components/ui/Toaster';
import WhatsAppButton from './components/WhatsAppButton';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

function NotFound() {
    return (
        <div className="min-h-screen pt-40 pb-32 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-6xl font-serif italic text-white mb-4">404</h1>
            <p className="text-gray-500 mb-8">Esta página no fue encontrada.</p>
            <Link to="/" className="btn-premium">VOLVER AL INICIO</Link>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <ToasterProvider>
                <CartProvider>
                    <Router>
                        <ScrollToTop />
                        <div className="min-h-screen bg-[#0a0a0a] text-white">
                            <AnnouncementBanner />
                            <Navbar />
                            <main>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/catalog" element={<Catalog />} />
                                    <Route path="/promotions" element={<Promotions />} />
                                    <Route path="/events" element={<Events />} />
                                    <Route path="/nightclubs" element={<Nightclubs />} />
                                    <Route path="/cart" element={<Cart />} />
                                    <Route path="/contact" element={<Contact />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/admin" element={<Admin />} />
                                    <Route path="/debug" element={<Debug />} />
                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </main>
                            <Footer />
                            <WhatsAppButton />
                        </div>
                    </Router>
                </CartProvider>
            </ToasterProvider>
        </AuthProvider>
    );
}

export default App;
