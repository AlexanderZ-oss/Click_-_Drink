/**
 * FEREST: Integración con Cloudinary (CDN de imágenes).
 *
 * Beneficios:
 *  - Las imágenes se sirven desde el CDN global de Cloudinary (rápido y cacheado).
 *  - `f_auto,q_auto` comprime automáticamente (~60-80% menos peso).
 *  - El proxy "fetch" sirve TAMBIÉN imágenes que ya viven en Supabase Storage
 *    a través del CDN de Cloudinary, dejando de consumir la cuota (5 GB) de Supabase.
 *
 * Configuración (con cuenta gratis de cloudinary.com):
 *  VITE_CLOUDINARY_CLOUD_NAME=nombredetucloud
 *  VITE_CLOUDINARY_UPLOAD_PRESET=nombredetupreset     (Settings > Upload > Presets, modo "Unsigned")
 *
 * Si las variables están vacías, la app sigue funcionando normal con Supabase.
 */

const env = (import.meta as any).env || {};

export const CLOUDINARY_CLOUD_NAME: string = env.VITE_CLOUDINARY_CLOUD_NAME || '';
export const CLOUDINARY_UPLOAD_PRESET: string = env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

export const isCloudinaryEnabled = () =>
    CLOUDINARY_CLOUD_NAME.length > 0 && CLOUDINARY_UPLOAD_PRESET.length > 0;

/**
 * Devuelve una URL optimizada vía Cloudinary Fetch:
 * https://res.cloudinary.com/<cloud>/image/fetch/f_auto,q_auto,w_<ancho>/<url_original>
 *
 * Si Cloudinary no está configurado, o la URL no es válida, devuelve la original.
 */
export const cdnImage = (url?: string | null, width = 800): string => {
    if (!url) return '';
    try {
        const u = new URL(url, window.location.origin);
        if (!CLOUDINARY_CLOUD_NAME) return url;
        if (u.hostname.includes('res.cloudinary.com')) return url; // ya es de Cloudinary
        if (u.protocol === 'data:' || u.protocol === 'blob:') return url;
        const encoded = encodeURIComponent(url);
        return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/f_auto,q_auto,w_${width}/${encoded}`;
    } catch {
        return url;
    }
};

/** Sube un archivo a Cloudinary (upload unsigned) y devuelve la URL segura. */
export const uploadToCloudinary = async (file: File): Promise<string> => {
    if (!isCloudinaryEnabled()) {
        throw new Error('Cloudinary no está configurado (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET)');
    }

    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    form.append('folder', 'ferest');

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: form }
    );

    if (!res.ok) {
        const detail = await res.json().catch(() => ({} as any));
        throw new Error(detail?.error?.message || `Error HTTP ${res.status} al subir a Cloudinary`);
    }

    const data = await res.json();
    return data.secure_url as string;
};
