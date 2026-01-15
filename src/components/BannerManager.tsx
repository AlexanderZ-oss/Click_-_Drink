import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, Eye, EyeOff, Image, Link as LinkIcon } from 'lucide-react';

interface Banner {
    id: number;
    title: string;
    description: string | null;
    image_url: string | null;
    link_url: string | null;
    active: boolean;
    display_order: number;
    background_color: string;
    text_color: string;
    start_date: string | null;
    end_date: string | null;
}

export default function BannerManager() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: '',
        link_url: '',
        active: true,
        display_order: 0,
        background_color: '#FF6B6B',
        text_color: '#FFFFFF',
        start_date: '',
        end_date: '',
    });

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const { data, error } = await supabase
                .from('banners')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            setBanners(data || []);
        } catch (error) {
            console.error('Error fetching banners:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingBanner) {
                // Update existing banner
                const { error } = await supabase
                    .from('banners')
                    .update({
                        ...formData,
                        description: formData.description || null,
                        image_url: formData.image_url || null,
                        link_url: formData.link_url || null,
                        start_date: formData.start_date || null,
                        end_date: formData.end_date || null,
                    })
                    .eq('id', editingBanner.id);

                if (error) throw error;
            } else {
                // Create new banner
                const { error } = await supabase.from('banners').insert([
                    {
                        ...formData,
                        description: formData.description || null,
                        image_url: formData.image_url || null,
                        link_url: formData.link_url || null,
                        start_date: formData.start_date || null,
                        end_date: formData.end_date || null,
                    },
                ]);

                if (error) throw error;
            }

            resetForm();
            fetchBanners();
        } catch (error) {
            console.error('Error saving banner:', error);
            alert('Error al guardar el banner');
        }
    };

    const handleEdit = (banner: Banner) => {
        setEditingBanner(banner);
        setFormData({
            title: banner.title,
            description: banner.description || '',
            image_url: banner.image_url || '',
            link_url: banner.link_url || '',
            active: banner.active,
            display_order: banner.display_order,
            background_color: banner.background_color,
            text_color: banner.text_color,
            start_date: banner.start_date ? banner.start_date.split('T')[0] : '',
            end_date: banner.end_date ? banner.end_date.split('T')[0] : '',
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este banner?')) return;

        try {
            const { error } = await supabase.from('banners').delete().eq('id', id);

            if (error) throw error;
            fetchBanners();
        } catch (error) {
            console.error('Error deleting banner:', error);
            alert('Error al eliminar el banner');
        }
    };

    const toggleActive = async (banner: Banner) => {
        try {
            const { error } = await supabase
                .from('banners')
                .update({ active: !banner.active })
                .eq('id', banner.id);

            if (error) throw error;
            fetchBanners();
        } catch (error) {
            console.error('Error toggling banner:', error);
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingBanner(null);
        setFormData({
            title: '',
            description: '',
            image_url: '',
            link_url: '',
            active: true,
            display_order: 0,
            background_color: '#FF6B6B',
            text_color: '#FFFFFF',
            start_date: '',
            end_date: '',
        });
    };

    return (
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Administrar Banners</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Banner
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-white/5 p-6 rounded-lg border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Título *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                                placeholder="Título del banner"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Descripción
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                                placeholder="Descripción del banner (opcional)"
                                rows={2}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <Image className="w-4 h-4 inline mr-1" />
                                URL de Imagen
                            </label>
                            <input
                                type="url"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                                placeholder="https://..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <LinkIcon className="w-4 h-4 inline mr-1" />
                                URL de Enlace
                            </label>
                            <input
                                type="url"
                                value={formData.link_url}
                                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                                placeholder="https://..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Color de Fondo
                            </label>
                            <input
                                type="color"
                                value={formData.background_color}
                                onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                                className="w-full h-10 bg-white/5 border border-white/10 rounded-lg cursor-pointer"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Color de Texto
                            </label>
                            <input
                                type="color"
                                value={formData.text_color}
                                onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                                className="w-full h-10 bg-white/5 border border-white/10 rounded-lg cursor-pointer"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Fecha Inicio
                            </label>
                            <input
                                type="date"
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Fecha Fin
                            </label>
                            <input
                                type="date"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Orden de Visualización
                            </label>
                            <input
                                type="number"
                                value={formData.display_order}
                                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                            />
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    className="w-5 h-5 rounded border-white/20 text-[#FF6B6B] focus:ring-[#FF6B6B]"
                                />
                                <span className="text-gray-300">Activo</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            {editingBanner ? 'Actualizar' : 'Crear'} Banner
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            {/* Banners List */}
            <div className="space-y-3">
                {banners.map((banner) => (
                    <div
                        key={banner.id}
                        className="bg-white/5 p-4 rounded-lg border border-white/10 flex items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-4 flex-1">
                            {banner.image_url && (
                                <img
                                    src={banner.image_url}
                                    alt={banner.title}
                                    className="w-12 h-12 rounded object-cover"
                                />
                            )}
                            <div className="flex-1">
                                <h3 className="font-semibold text-white">{banner.title}</h3>
                                {banner.description && (
                                    <p className="text-sm text-gray-400">{banner.description}</p>
                                )}
                                <div className="flex items-center gap-2 mt-1">
                                    <span
                                        className="inline-block w-4 h-4 rounded"
                                        style={{ backgroundColor: banner.background_color }}
                                    />
                                    <span className="text-xs text-gray-500">
                                        Orden: {banner.display_order}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => toggleActive(banner)}
                                className={`p-2 rounded-lg transition-colors ${banner.active
                                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                        : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                                    }`}
                                title={banner.active ? 'Activo' : 'Inactivo'}
                            >
                                {banner.active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={() => handleEdit(banner)}
                                className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                            >
                                <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleDelete(banner.id)}
                                className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}

                {banners.length === 0 && (
                    <p className="text-center text-gray-400 py-8">
                        No hay banners creados. Crea uno para empezar.
                    </p>
                )}
            </div>
        </div>
    );
}
