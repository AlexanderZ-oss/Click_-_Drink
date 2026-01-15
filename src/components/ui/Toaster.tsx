import { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToasterContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToasterContext = createContext<ToasterContextType | undefined>(undefined);

export const useToaster = () => {
    const context = useContext(ToasterContext);
    if (!context) throw new Error('useToaster must be used within a ToasterProvider');
    return context;
};

export const ToasterProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: ToastType) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    };

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToasterContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.9 }}
                            className={`pointer-events-auto flex items-center gap-4 p-5 rounded-[2rem] border backdrop-blur-xl shadow-2xl min-w-[320px] max-w-md ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                    toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                        'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                }`}
                        >
                            <div className="shrink-0">
                                {toast.type === 'success' && <CheckCircle2 size={24} />}
                                {toast.type === 'error' && <AlertCircle size={24} />}
                                {toast.type === 'info' && <Info size={24} />}
                            </div>
                            <p className="flex-1 text-sm font-black italic uppercase tracking-tight leading-tight">
                                {toast.message}
                            </p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="shrink-0 text-white/20 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToasterContext.Provider>
    );
};

export const Toaster = () => null; // Placeholder for legacy usage
