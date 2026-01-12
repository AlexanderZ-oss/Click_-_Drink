import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Edit2, X, Save, Award, Percent } from 'lucide-react';

const PromoManager = () => {
    const [promos, setPromos] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState<any>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        discount_percent: '',
        image_url: '',
        active: true
    });

    useEffect(() => {
        fetchPromos();
    }, []);

    const fetchPromos = async () => {
        const { data } = await supabase.from('promotions').select('*');
        if (data) setPromos(data);
    };

    const handleOpenModal = (promo: any = null) => {
        if (promo) {
            setEditingPromo(promo);
            setFormData({
                title: promo.title,
                description: promo.description,
                discount_percent: promo.discount_percent.toString(),
                image_url: promo.image_url,
                active: promo.active
            });
        } else {
            setEditingPromo(null);
            setFormData({ title: '', description: '', discount_percent: '', image_url: '', active: true });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = { ...formData, discount_percent: parseFloat(formData.discount_percent) };
        if (editingPromo) {
            await supabase.from('promotions').update(data).eq('id', editingPromo.id);
        } else {
            await supabase.from('promotions').insert([data]);
        }
        setIsModalOpen(false);
        fetchPromos();
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Eliminar promoción?')) {
            await supabase.from('promotions').delete().eq('id', id);
            fetchPromos();
        }
    };

    return (
        <div className="bg-[#111] p-10 rounded-[3rem] border border-white/5">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black italic uppercase">Gestión de <span className="text-red-500">Ofertas</span></h2>
                <button onClick={() => handleOpenModal()} className="px-6 py-3 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-600 transition-all">
                    <Plus size={16} /> NUEVA PROMO
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {promos.map(promo => (
                    <div key={promo.id} className="bg-black/40 p-6 rounded-[2rem] border border-white/5 flex gap-6 group hover:border-red-500/30 transition-all">
                        <img src={promo.image_url} className="w-24 h-24 object-cover rounded-2xl border border-white/10" />
                        <div className="flex-1">
                            <h3 className="font-black text-white italic uppercase mb-1">{promo.title}</h3>
                            <p className="text-[10px] text-red-500 font-black uppercase tracking-widest mb-2">{promo.discount_percent}% OFF</p>
                            <div className="flex gap-2">
                                <button onClick={() => handleOpenModal(promo)} className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all"><Edit2 size={14} /></button>
                                <button onClick={() => handleDelete(promo.id)} className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-[#111] border border-white/10 w-full max-w-xl rounded-[3rem] p-10">
                        <h3 className="text-2xl font-black mb-8 italic uppercase text-white">Configurar <span className="text-red-500">Promoción</span></h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <input type="text" placeholder="Título" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-red-500 transition-all" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            <textarea placeholder="Descripción" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none h-24 resize-none focus:border-red-500 transition-all" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            <div className="grid grid-cols-2 gap-6">
                                <input type="number" placeholder="% Descuento" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-red-500 transition-all" value={formData.discount_percent} onChange={e => setFormData({ ...formData, discount_percent: e.target.value })} />
                                <input type="url" placeholder="URL Imagen" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-red-500 transition-all" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} />
                            </div>
                            <button type="submit" className="w-full py-5 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:bg-red-600 transition-all">GUARDAR PROMO</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromoManager;
