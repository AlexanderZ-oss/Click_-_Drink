import { useState } from 'react';
import { Upload } from 'lucide-react';
import { isCloudinaryEnabled, uploadImage } from '../../lib/cloudinary';

interface Props {
    /** URL actual (o estado) del formulario */
    value: string;
    /** Recibe la nueva URL de la imagen subida */
    onChange: (url: string) => void;
    /** Indica que el input está dentro de otro botón/form: detener propagación */
    disabled?: boolean;
}

/**
 * Botón de subida de archivo por imagen:
 *  - Con Cloudinary configurado: sube al CDN de Cloudinary.
 *  - Sin Cloudinary: sube al bucket público "images" de Supabase Storage (fallback).
 * Al completar, llena el campo [image_url] del formulario que lo contenga.
 * No reemplaza el input de URL: ambos conviven (pegar URL manual o subir archivo).
 */
export default function CloudinaryUploadField({ onChange, disabled }: Props) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;

        setError(null);
        setUploading(true);
        try {
            const url = await uploadImage(file);
            onChange(url);
        } catch (err: any) {
            setError(err?.message || 'Error al subir la imagen');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="mt-2">
            <label className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-white/10 px-4 py-2 rounded-lg cursor-pointer hover:border-[#c5a059] transition-colors ${disabled || uploading ? 'opacity-50 pointer-events-none' : 'text-gray-300'}`}>
                <Upload size={14} className={uploading ? 'animate-bounce text-[#c5a059]' : 'text-gray-400'} />
                {uploading ? 'Subiendo...' : isCloudinaryEnabled() ? 'Subir archivo (CDN Cloudinary)' : 'Subir archivo desde tu PC'}
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={disabled || uploading} />
            </label>
            {error && <p className="text-red-500 text-[10px] mt-1">{error}</p>}
        </div>
    );
}
