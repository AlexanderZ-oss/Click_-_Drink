// k6: Prueba base del catalogo publico de FEREST
// Mide latencia y estabilidad cuando muchos visitantes leen el catalogo a la vez.
// Uso: k6 run tests/k6/catalogo.js
import http from 'k6/http';
import { check, sleep } from 'k6';

const SUPABASE_URL = 'https://iaaavtbgfwatxvvpiphn.supabase.co';
const ANON_KEY = 'sb_publishable_1hsAVeQdmxw2UkQHHXbLaA_inyxKSiz';

export const options = {
    scenarios: {
        visita_tiendas: {
            executor: 'ramping-vus',
            startVUs: 1,
            stages: [
                { duration: '20s', target: 10 },   // sube a 10 usuarios
                { duration: '40s', target: 50 },   // pico: 50 navegando a la vez
                { duration: '20s', target: 0 },    // baja
            ],
        },
    },
    thresholds: {
        http_req_failed: ['rate<0.01'],          // menos del 1% de errores
        http_req_duration: ['p(95)<1500'],       // 95% de peticiones bajo 1.5s
    },
};

const H = { apikey: ANON_KEY, Authorization: 'Bearer ' + ANON_KEY, Accept: 'application/json' };

export default function () {
    // Lo que hace la web al abrir: productos + promos + banners + eventos
    const r1 = http.get(`${SUPABASE_URL}/rest/v1/products?select=*&active=eq.true`, { headers: H, tags: { name: 'catalogo' } });
    const r2 = http.get(`${SUPABASE_URL}/rest/v1/promotions?select=*&active=eq.true`, { headers: H, tags: { name: 'promos' } });
    const r3 = http.get(`${SUPABASE_URL}/rest/v1/banners?select=*&active=eq.true`, { headers: H, tags: { name: 'banners' } });

    check(r1, { 'catalogo 200': (r) => r.status === 200 });
    check(r2, { 'promos 200': (r) => r.status === 200 });
    check(r3, { 'banners 200': (r) => r.status === 200 });

    sleep(2 + Math.random() * 3); // como un humano que mira la tienda
}
