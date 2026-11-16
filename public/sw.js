/* Service Worker de FEREST Premium (PWA)
   Estrategia:
   - Navegación: red primero, si falla -> caché -> offline.html
   - Assets con hash (/assets/...): caché primero (inmutables)
   - Imágenes estáticas: caché primero
   - APIs (Supabase, Cloudinary): siempre red, nunca caché */
const CACHE_VERSION = 'ferest-v1';
const PRECACHE = [
    '/',
    '/offline.html',
    '/logo-192.png',
    '/logo.png',
    '/favicon.svg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then((cache) => cache.addAll(PRECACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((key) => key !== CACHE_VERSION)
                    .map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);

    // Nunca cachear APIs ni rutas de administración
    if (url.origin !== self.location.origin) return; // Supabase/Cloudinary: pasa directo
    if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/')) return;

    // Navegación (páginas): red primero, caché de respaldo
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE_VERSION).then((cache) => cache.put('/', copy));
                    return response;
                })
                .catch(() =>
                    caches.match(request).then((cached) =>
                        cached || caches.match('/').then((home) => home || caches.match('/offline.html'))
                    )
                )
        );
        return;
    }

    // Assets con hash e imágenes: caché primero
    if (url.pathname.startsWith('/assets/') || /\.(png|jpg|jpeg|svg|webp|ico|woff2?)$/.test(url.pathname)) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;
                return fetch(request).then((response) => {
                    if (response.ok) {
                        const copy = response.clone();
                        caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
                    }
                    return response;
                });
            })
        );
    }
});
