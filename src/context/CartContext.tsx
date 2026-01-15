import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
    id: number;
    name: string;
    price: number;
    wholesale_price?: number;
    wholesale_min?: number;
    quantity: number;
    image_url: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    subtotal: number;
    total: number;
    deliveryFee: number;
    setDistance: (km: number) => void;
    distance: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('ferest_cart');
        try {
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (e) {
            console.error('Error loading cart from localStorage:', e);
            return [];
        }
    });
    const [distance, setDistance] = useState(0);

    useEffect(() => {
        localStorage.setItem('ferest_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: any) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: number) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
    };

    const clearCart = () => setCart([]);

    const subtotal = cart.reduce((acc, item) => {
        const price = (item.wholesale_price && item.wholesale_min && item.quantity >= item.wholesale_min)
            ? item.wholesale_price
            : item.price;
        return acc + (price * item.quantity);
    }, 0);

    const deliveryFee = subtotal >= 100 ? 0 : distance * 2;
    const total = subtotal + deliveryFee;

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateQuantity, clearCart,
            subtotal, total, deliveryFee, setDistance, distance
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
