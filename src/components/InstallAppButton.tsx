import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, X, Share, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'ferest-install-dismissed';

const InstallAppButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showIosHelp, setShowIosHelp] = useState(false);
    const [hidden, setHidden] = useState(() => localStorage.getItem(DISMISS_KEY) === 'true');

    useEffect(() => {
        const onPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };
        window.addEventListener('beforeinstallprompt', onPrompt);
        return () => window.removeEventListener('beforeinstallprompt', onPrompt);
    }, []);

    const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            await deferredPrompt.userChoice;
            setDeferredPrompt(null);
        } else {
            setShowIosHelp(true); // iPhone: sin prompt automático, mostrar instrucciones
        }
    };

    const dismiss = () => {
        setHidden(true);
        try { localStorage.setItem(DISMISS_KEY, 'true'); } catch { /* modo privado */ }
    };

    if (hidden) return null;

    return (
        <>
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="fixed bottom-8 left-8 z-[100] flex flex-col items-start gap-2"
            >
                <AnimatePresence>
                    {showIosHelp && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className="absolute bottom-16 left-0 w-64 bg-white text-black rounded-2xl p-4 shadow-2xl border border-black/5 text-xs leading-relaxed"
                        >
                            <button
                                onClick={() => setShowIosHelp(false)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-black"
                                aria-label="Cerrar"
                            >
                                <X size={14} />
                            </button>
                            <p className="font-black uppercase tracking-widest text-[10px] mb-2 text-[#8a6d1f]">
                                Instalar en iPhone
                            </p>
                            <p className="flex items-center gap-1">
                                1. Toca el botón <Share size={12} className="inline" /> (Compartir) de Safari
                            </p>
                            <p className="mt-1">2. Elige <b>"Añadir a pantalla de inicio"</b></p>
                            <p className="mt-1">3. ¡Listo! FEREST queda como una app</p>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="flex items-center gap-2">
                    <motion.button
                        onClick={handleInstall}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-[#c5a059] text-[#0a0a0a] p-4 rounded-full shadow-[0_10px_30px_rgba(197,160,89,0.4)] flex items-center justify-center group"
                        aria-label="Instalar la app de FEREST"
                    >
                        <Smartphone size={28} />
                        <span className="absolute right-full mr-4 bg-white text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-black/5 flex items-center gap-1">
                            <Download size={11} /> Instalar la app FEREST
                        </span>
                    </motion.button>
                    <button
                        onClick={dismiss}
                        className="w-6 h-6 rounded-full bg-black/60 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center"
                        aria-label="No mostrar más este botón"
                    >
                        <X size={12} />
                    </button>
                </div>
            </motion.div>
        </>
    );
};

export default InstallAppButton;
