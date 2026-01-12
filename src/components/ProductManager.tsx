import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Edit2, X, Save, Boxes } from 'lucide-react';

const ProductManager = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'VODKA',
        image_url: '',
        stock: '',
        wholesale_price: '',
        wholesale_min: '12'
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (data) setProducts(data);
    };

    const handleOpenModal = (product: any = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                category: product.category,
                image_url: product.image_url,
                stock: product.stock.toString(),
                wholesale_price: product.wholesale_price?.toString() || '',
                wholesale_min: product.wholesale_min?.toString() || '12'
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: 'VODKA',
                image_url: '',
                stock: '',
                wholesale_price: '',
                wholesale_min: '12'
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const productData = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            wholesale_price: formData.wholesale_price ? parseFloat(formData.wholesale_price) : null,
            wholesale_min: formData.wholesale_min ? parseInt(formData.wholesale_min) : 12
        };

        if (editingProduct) {
            const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
            if (!error) {
                setIsModalOpen(false);
                fetchProducts();
            }
        } else {
            const { error } = await supabase.from('products').insert([productData]);
            if (!error) {
                setIsModalOpen(false);
                fetchProducts();
            }
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (!error) fetchProducts();
        }
    };

    return (
        <div className="bg-[#111] rounded-[2.5rem] border border-white/5 p-10">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black italic uppercase">Gestión de <span className="text-[#d4af37]">Stock</span></h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn-premium flex items-center gap-2 py-3 px-8 text-xs font-black shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                >
                    <Plus size={18} /> NUEVO PRODUCTO
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black italic">
                            <th className="pb-6 font-medium">Producto</th>
                            <th className="pb-6 font-medium">Categoría</th>
                            <th className="pb-6 font-medium">Precios (Min/Max)</th>
                            <th className="pb-6 font-medium">Stock</th>
                            <th className="pb-6 font-medium text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-bold italic">
                        {products.map((product) => (
                            <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden shrink-0">
                                            <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-black text-white group-hover:text-[#d4af37] transition-colors">{product.name}</p>
                                            <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest not-italic">{product.category}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-6 text-xs text-gray-400 font-bold uppercase tracking-widest">{product.category}</td>
                                <td className="py-6">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-white text-sm">M: S/ {product.price.toFixed(2)}</span>
                                        {product.wholesale_price && (
                                            <span className="text-green-500 text-[10px] uppercase font-black tracking-widest">W: S/ {product.wholesale_price.toFixed(2)}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${product.stock > 10 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {product.stock} UNI.
                                    </span>
                                </td>
                                <td className="py-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleOpenModal(product)} className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all border border-transparent hover:border-white/10">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} className="w-10 h-10 flex items-center justify-center hover:bg-red-500/10 rounded-xl text-gray-400 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-[#111] border border-white/10 w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200 h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-white italic uppercase">
                                {editingProduct ? 'Editar' : 'Nuevo'} <span className="text-[#d4af37]">Licor</span>
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-3">Nombre del Producto</label>
                                    <input
                                        type="text" required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-[#d4af37] outline-none transition-all font-bold"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-3">Categoría</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-[#d4af37] outline-none transition-all font-bold"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="VODKA">VODKA</option>
                                        <option value="RON">RON</option>
                                        <option value="WHISKY">WHISKY</option>
                                        <option value="CERVEZA">CERVEZA</option>
                                        <option value="GIN">GIN</option>
                                        <option value="VINOS">VINOS</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-3">Precio Menudeo (S/)</label>
                                    <input
                                        type="number" step="0.01" required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-[#d4af37] outline-none transition-all font-bold"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-green-500 mb-3 uppercase tracking-widest">Precio Mayorista (S/)</label>
                                    <input
                                        type="number" step="0.01"
                                        placeholder="Opcional"
                                        className="w-full bg-white/5 border border-green-500/20 rounded-2xl px-5 py-4 text-sm focus:border-green-500 outline-none transition-all font-bold"
                                        value={formData.wholesale_price}
                                        onChange={(e) => setFormData({ ...formData, wholesale_price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-green-500 mb-3 uppercase tracking-widest">Mínimo Mayor (Units)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-white/5 border border-green-500/20 rounded-2xl px-5 py-4 text-sm focus:border-green-500 outline-none transition-all font-bold"
                                        value={formData.wholesale_min}
                                        onChange={(e) => setFormData({ ...formData, wholesale_min: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-3">Stock Disponible</label>
                                    <input
                                        type="number" required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-[#d4af37] outline-none transition-all font-bold"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-3">URL Imagen del Producto</label>
                                    <input
                                        type="url" required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-[#d4af37] outline-none transition-all font-bold"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-3">Descripción Breve</label>
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-[#d4af37] outline-none transition-all h-32 resize-none font-bold italic"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <button type="submit" className="w-full btn-premium py-5 flex items-center justify-center gap-3 mt-4 italic font-black text-sm uppercase">
                                <Save size={20} /> {editingProduct ? 'GUARDAR CAMBIOS' : 'CREAR PRODUCTO'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManager;
