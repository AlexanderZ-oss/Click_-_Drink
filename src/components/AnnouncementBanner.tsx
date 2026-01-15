import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function AnnouncementBanner() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dismissed, setDismissed] = useState<number[]>([]);

    useEffect(() => {
        fetchBanners();

        // Subscribe to banner changes
        const channel = supabase
            .channel('banners')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'banners' },
                () => {
                    fetchBanners();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    useEffect(() => {
        // Auto-rotate banners every 5 seconds
        if (activeBanners.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [banners, dismissed]);

    const fetchBanners = async () => {
        try {
            const { data, error } = await supabase
                .from('banners')
                .select('*')
                .eq('active', true)
                .order('display_order', { ascending: true });

            if (error) throw error;

            // Filter banners by date
            const now = new Date();
            const validBanners = (data || []).filter((banner) => {
                const startValid = !banner.start_date || new Date(banner.start_date) <= now;
                const endValid = !banner.end_date || new Date(banner.end_date) >= now;
                return startValid && endValid;
            });

            setBanners(validBanners);
        } catch (error) {
            console.error('Error fetching banners:', error);
        }
    };

    const handleDismiss = (id: number) => {
        setDismissed([...dismissed, id]);
    };

    const handleBannerClick = (url: string | null) => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    const activeBanners = banners.filter((banner) => !dismissed.includes(banner.id));
    const currentBanner = activeBanners[currentIndex];

    if (!currentBanner) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentBanner.id}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative overflow-hidden"
                style={{
                    backgroundColor: currentBanner.background_color,
                    color: currentBanner.text_color,
                }}
            >
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                            {/* Image */}
                            {currentBanner.image_url && (
                                <img
                                    src={currentBanner.image_url}
                                    alt={currentBanner.title}
                                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                />
                            )}

                            {/* Content */}
                            <div
                                className={`flex-1 ${currentBanner.link_url ? 'cursor-pointer' : ''}`}
                                onClick={() => handleBannerClick(currentBanner.link_url)}
                            >
                                <h3 className="font-bold text-sm md:text-base flex items-center gap-2">
                                    {currentBanner.title}
                                    {currentBanner.link_url && (
                                        <ExternalLink className="w-4 h-4" />
                                    )}
                                </h3>
                                {currentBanner.description && (
                                    <p className="text-xs md:text-sm opacity-90 mt-0.5">
                                        {currentBanner.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Dismiss Button */}
                        <button
                            onClick={() => handleDismiss(currentBanner.id)}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
                            aria-label="Cerrar anuncio"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Pagination Dots */}
                    {activeBanners.length > 1 && (
                        <div className="flex justify-center gap-2 mt-2">
                            {activeBanners.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                            ? 'bg-white w-4'
                                            : 'bg-white/50 hover:bg-white/70'
                                        }`}
                                    aria-label={`Ir a anuncio ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
