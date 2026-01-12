import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import { Toaster } from './components/ui/Toaster';
import { CartProvider } from './context/CartContext';

function App() {
    return (
        <CartProvider>
            <Router>
                <div className="min-h-screen bg-[#0a0a0a] text-white">
                    <Navbar />
                    <main>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/admin" element={<Admin />} />
                        </Routes>
                    </main>
                    <Footer />
                    <Toaster />
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;
