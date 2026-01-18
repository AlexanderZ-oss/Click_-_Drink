import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Percent, Clock, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

interface Promotion {
    id: number;
    title: string;
    description: string;
    discount_percent: number;
    image_url: string;
    active: boolean;
    valid_until: string;
}

export default function Promotions() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);

    useEffect(() => {
        fetchPromotions();

        // Subscribe to real-time updates
        const channel = supabase
            .channel('promotions')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'promotions' }, () => {
                fetchPromotions();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchPromotions = async () => {
        const { data, error } = await supabase
            .from('promotions')
            .select('*')
            .eq('active', true)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setPromotions(data);
        }
    };

    const isExpired = (date: string) => {
        if (!date) return false;
        return new Date(date) < new Date();
    };

    const getDaysRemaining = (date: string) => {
        if (!date) return null;
        const diff = new Date(date).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-[#0a0a0a]">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] mb-6">
                        <Percent className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black italic uppercase mb-4">
                        Promociones <span className="text-[#FF6B6B]">Especiales</span>
                    </h1>
                    <p className="text-gray-400 text-base md:text-lg">Aprovecha nuestras ofertas exclusivas</p>
                </motion.div>

                {/* Promotions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {promotions.map((promo, index) => {
                        const daysRemaining = getDaysRemaining(promo.valid_until);
                        const expired = isExpired(promo.valid_until);

                        return (
                            <motion.div
                                key={promo.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-gradient-to-br from-white/10 to-white/5 rounded-3xl overflow-hidden border border-white/20 hover:border-[#FF6B6B]/50 transition-all hover:shadow-2xl hover:shadow-[#FF6B6B]/20"
                            >
                                {/* Discount Badge */}
                                <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] text-white px-4 py-2 rounded-full shadow-lg">
                                    <span className="text-2xl font-black">-{promo.discount_percent}%</span>
                                </div>

                                {/* Image */}
                                <div className="relative h-64 overflow-hidden bg-black/40">
                                    <img
                                        src={promo.image_url}
                                        alt={promo.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {expired && (
                                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                            <span className="text-white font-black text-xl">EXPIRADA</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-xl md:text-2xl font-black italic text-white mb-3">{promo.title}</h3>
                                    <p className="text-gray-300 mb-4">{promo.description}</p>

                                    {/* Time Remaining */}
                                    {daysRemaining !== null && !expired && (
                                        <div className="flex items-center gap-2 text-[#FFE66D] mb-4">
                                            <Clock className="w-5 h-5" />
                                            <span className="font-bold">
                                                {daysRemaining === 0
                                                    ? '¡Último día!'
                                                    : `${daysRemaining} días restantes`}
                                            </span>
                                        </div>
                                    )}

                                    {/* CTA */}
                                    <a
                                        href="https://wa.me/51901296314?text=Hola,%20quiero%20información%20sobre%20las%20promociones"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] text-white text-center py-3 rounded-xl font-black uppercase hover:opacity-90 transition-all"
                                    >
                                        Consultar por WhatsApp
                                    </a>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {promotions.length === 0 && (
                    <div className="text-center py-20">
                        <Tag className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 text-xl font-bold">No hay promociones activas en este momento</p>
                        <p className="text-gray-600 mt-2">¡Vuelve pronto para ver nuestras ofertas!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
