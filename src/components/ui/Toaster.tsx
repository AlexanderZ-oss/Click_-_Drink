import { useState, createContext, useContext } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

const ToastContext = createContext<{ showToast: (msg: string, type: ToastType) => void } | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider (internal implementation detail, for simpler usage just import the component)");
    }
    return context;
};


import React from 'react';

export const Toaster = () => {
    // Simple implementation for now, ideally this would be a real context provider
    // But since I can't easily wrap the entire app in a new provider without changing main.tsx heavily
    // I will make a simple static toaster or just a placeholder if the user hasn't asked for full notification logic yet.
    // Actually, I can just use a local state in App or similar, but for now let's just create an empty component 
    // that will eventually hold the toasts.
    // Real implementation requires a Context.
    return <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2"></div>;
};
