import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
    /** Controla si el modal esta visible */
    open: boolean;
    /** Se llama al cerrar (boton X, fondo o tecla ESC) */
    onClose: () => void;
    /** Titulo del modal (puede incluir JSX con colores) */
    title: React.ReactNode;
    /** Ancho maximo Tailwind, ej: 'max-w-2xl' (default) o 'max-w-xl' */
    maxWidth?: string;
    /** Contenido: el formulario completo del manager */
    children: React.ReactNode;
    /** Bloque extra pegado abajo (ej: boton GUARDAR sticky) */
    footer?: React.ReactNode;
}

/**
 * Modal reutilizable del panel admin.
 *
 * Caracteristicas (unico punto de verdad para TODAS las ventanas):
 *  - Montado via portal en document.body: "fixed inset-0" siempre es
 *    relativo a la pantalla, sin importar ancestros (transform, blur, etc).
 *  - El overlay entero hace scroll: en pantallas cortas NADA queda fuera
 *    de alcance (bug historico: campos superiores recortados).
 *  - ESC y clic en el fondo cierran; el scroll de la pagina se bloquea
 *    mientras esta abierto.
 *  - "footer" opcional se pega al borde inferior visible mientras se
 *    recorre el formulario (boton guardar siempre a la vista).
 *
 * Cada manager (Productos, Promos, Eventos, ...) SOLO define su contenido.
 */
export default function Modal({ open, onClose, title, maxWidth = 'max-w-2xl', children, footer }: ModalProps) {
    // Bloquea el scroll de la pagina de fondo mientras el modal esta abierto
    useEffect(() => {
        if (!open) return;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    // Cierra con la tecla ESC
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative min-h-full flex items-center justify-center p-4">
                <div className={`relative bg-[#111] border border-white/10 w-full ${maxWidth} rounded-[3rem] p-10 shadow-2xl`}>
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-black text-white italic uppercase">{title}</h3>
                        <button
                            onClick={onClose}
                            aria-label="Cerrar"
                            className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {children}

                    {footer && (
                        <div className="sticky bottom-0 -mx-10 px-10 pt-4 pb-1 bg-[#111]">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
