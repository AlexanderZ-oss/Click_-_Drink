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
import { Toaster } from './components/ui/Toaster';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToasterProvider } from './components/ui/Toaster';
import WhatsAppButton from './components/WhatsAppButton';

function App() {
    return (
        <AuthProvider>
            <ToasterProvider>
                <CartProvider>
                    <Router>
                        <div className="min-h-screen bg-[#0a0a0a] text-white">
                            <AnnouncementBanner />
                            <Navbar />
                            <main>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/catalog" element={<Catalog />} />
                                    <Route path="/promotions" element={<Promotions />} />
                                    <Route path="/nightclubs" element={<Nightclubs />} />
                                    <Route path="/cart" element={<Cart />} />
                                    <Route path="/contact" element={<Contact />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/admin" element={<Admin />} />
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
