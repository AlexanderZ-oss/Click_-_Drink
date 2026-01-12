import React from 'react';

const Cart = () => {
    return (
        <div className="container mx-auto px-4 py-32 text-center">
            <h1 className="text-4xl font-bold mb-4 text-[#d4af37]">Carrito de Compras</h1>
            <p className="text-gray-400">Tu carrito está vacío.</p>
            <button className="btn-premium mt-8">VOLVER AL CATÁLOGO</button>
        </div>
    );
};

export default Cart;
