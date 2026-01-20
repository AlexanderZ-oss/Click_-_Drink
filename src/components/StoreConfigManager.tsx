import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Save, MapPin, Clock } from 'lucide-react';
import { useToaster } from './ui/Toaster';

const StoreConfigManager = () => {
    const [config, setConfig] = useState<any>({
        store_address: '',
        store_hours: ''
    });
    const { showToast } = useToaster();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        const { data, error } = await supabase.from('store_settings').select('*');
        if (data) {
            const newConfig: any = {};
            data.forEach((item: any) => {
                newConfig[item.key] = item.value;
            });
            // Set defaults if missing from DB
            if (!newConfig.store_address) newConfig.store_address = 'Mercado La Hermelinda';
            if (!newConfig.store_hours) newConfig.store_hours = '8:00 AM - 4:00 PM';

            setConfig(newConfig);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updates = Object.keys(config).map(key => ({
                key,
                value: config[key]
            }));

            const { error } = await supabase.from('store_settings').upsert(updates, { onConflict: 'key' });

            if (error) throw error;

            showToast('Configuración guardada exitosamente', 'success');
        } catch (error: any) {
            console.error('Error saving config:', error);
            showToast('Error al guardar configuración', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#111] rounded-[2.5rem] border border-white/5 p-10 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black italic uppercase">Configuración de <span className="text-[#d4af37]">Tienda</span></h2>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-[#d4af37]/30 transition-colors group">
                        <div className="flex items-center gap-3 mb-4 text-[#d4af37]">
                            <MapPin size={24} />
                            <h3 className="text-sm font-black uppercase tracking-widest">Dirección del Local</h3>
                        </div>
                        <input
                            type="text"
                            className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-[#d4af37] outline-none transition-all"
                            value={config.store_address}
                            onChange={(e) => setConfig({ ...config, store_address: e.target.value })}
                            placeholder="Ej. Mercado La Hermelinda"
                        />
                        <p className="text-[10px] text-gray-500 mt-3 font-medium uppercase tracking-wider">Visible en el pie de página y contacto.</p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-[#d4af37]/30 transition-colors group">
                        <div className="flex items-center gap-3 mb-4 text-[#d4af37]">
                            <Clock size={24} />
                            <h3 className="text-sm font-black uppercase tracking-widest">Horario de Atención</h3>
                        </div>
                        <input
                            type="text"
                            className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-[#d4af37] outline-none transition-all"
                            value={config.store_hours}
                            onChange={(e) => setConfig({ ...config, store_hours: e.target.value })}
                            placeholder="Ej. 8:00 AM - 4:00 PM"
                        />
                        <p className="text-[10px] text-gray-500 mt-3 font-medium uppercase tracking-wider">Define el horario operativo activo.</p>
                    </div>
                </div>

                <div className="pt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-premium px-10 py-4 flex items-center gap-3 disabled:opacity-50"
                    >
                        <Save size={20} />
                        {loading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StoreConfigManager;
