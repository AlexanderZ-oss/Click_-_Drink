import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnnouncementBanner from './components/AnnouncementBanner';
import Home from './pages/Home';
import { Toaster } from './components/ui/Toaster';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToasterProvider } from './components/ui/Toaster';
import WhatsAppButton from './components/WhatsAppButton';
import InstallAppButton from './components/InstallAppButton';
import AppGate from './components/AppGate';
import { Suspense, lazy, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Code splitting: cada página se descarga solo cuando se visita.
// Home se importa directo (es lo primero que ve el cliente).
const Catalog = lazy(() => import('./pages/Catalog'));
const Promotions = lazy(() => import('./pages/Promotions'));
const Nightclubs = lazy(() => import('./pages/Nightclubs'));
const Cart = lazy(() => import('./pages/Cart'));
const Contact = lazy(() => import('./pages/Contact'));
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Events = lazy(() => import('./pages/Events'));
const Debug = lazy(() => import('./pages/Debug'));

function PageLoader() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin" />
        </div>
    );
}

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
                        <AppGate>
                        <div className="min-h-screen bg-[#0a0a0a] text-white">
                            <AnnouncementBanner />
                            <Navbar />
                            <main>
                                <Suspense fallback={<PageLoader />}>
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
                                </Suspense>
                            </main>
                            <Footer />
                            <WhatsAppButton />
                            <InstallAppButton />
                        </div>
                        </AppGate>
                    </Router>
                </CartProvider>
            </ToasterProvider>
        </AuthProvider>
    );
}

export default App;
