import React, { createContext, useContext, useState, useEffect } from 'react';
import { FREE_DELIVERY_THRESHOLD, DELIVERY_COST_PER_KM } from '../lib/config';

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
    setDistance: (km: number) => void;    distance: number;
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
    const [distance, setDistanceState] = useState(0);
    const setDistance = (km: number) => setDistanceState(Math.max(0, Number.isFinite(km) ? km : 0));

    useEffect(() => {
        localStorage.setItem('ferest_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: any) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                // Respetar el stock disponible del producto
                const nextQty =
                    typeof product.stock === 'number'
                        ? Math.min(existing.quantity + 1, product.stock)
                        : existing.quantity + 1;
                if (nextQty === existing.quantity) return prev;
                return prev.map(item => item.id === product.id ? { ...item, quantity: nextQty } : item);
            }
            const quantity =
                typeof product.stock === 'number' && product.stock > 0 ? 1 : 1;
            return [...prev, { ...product, quantity }];
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
        setCart(prev =>
            prev.map(item => {
                if (item.id !== productId) return item;
                const maxStock = typeof (item as any).stock === 'number' ? (item as any).stock : Infinity;
                return { ...item, quantity: Math.min(quantity, maxStock) };
            })
        );
    };

    const clearCart = () => setCart([]);

    const subtotal = cart.reduce((acc, item) => {
        const price = (item.wholesale_price && item.wholesale_min && item.quantity >= item.wholesale_min)
            ? item.wholesale_price
            : item.price;
        return acc + (price * item.quantity);
    }, 0);

    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD
        ? 0
        : Math.max(0, distance) * DELIVERY_COST_PER_KM;
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
