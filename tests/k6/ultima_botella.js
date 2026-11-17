// k6: CARRERA POR LA ULTIMA BOTELLA
// N compradores intentan comprar EL MISMO producto CON STOCK 1 al mismo tiempo.
// Comportamiento CORRECTO esperado: exactamente 1 pedido exitoso, el resto recibe "AGOTADO".
// Uso (despues de confirmar el email del usuario de prueba y crear el producto TEST):
//   $env:K6_TOKEN="eyJ..." ; k6 run tests/k6/ultima_botella.js
import http from 'k6/http';
import { check } from 'k6';

const SUPABASE_URL = 'https://iaaavtbgfwatxvvpiphn.supabase.co';
const ANON_KEY = 'sb_publishable_1hsAVeQdmxw2UkQHHXbLaA_inyxKSiz';

const TOKEN = __ENV.K6_TOKEN || '';
const UID = __ENV.K6_UID || '';
const PRODUCT_ID = Number(__ENV.PRODUCT_ID || 0);
const COMPRADORES = Number(__ENV.COMPRADORES || 10);

export const options = {
    scenarios: {
        carrera: {
            executor: 'shared-iterations',
            vus: COMPRADORES,        // todos los compradores concurrentes
            iterations: COMPRADORES, // cada uno intenta comprar 1 vez
            maxDuration: '2m',
        },
    },
    thresholds: {
        // NO exigimos 0% de fallos: en una carrera por la ultima unidad,
        // lo CORRECTO es que varios reciban error de stock (409 del negocio).
        http_req_duration: ['p(95)<3000'],
    },
};

export default function () {
    const payload = JSON.stringify([{
        user_id: UID,
        customer_email: 'k6.loadtest+1@gmail.com',
        customer_name: 'K6 Carrera',
        customer_phone: '999888777',
        delivery_address: 'Direccion de prueba k6',
        delivery_fee: 0,
        invoice_type: 'boleta',
        ruc_dni: '00000000',
        total: 5.0,
        status: 'pending',
        items: [{ id: PRODUCT_ID, name: 'TEST-K6 Agua Mineral', price: 5.0, quantity: 1 }]
    }]);

    const res = http.post(`${SUPABASE_URL}/rest/v1/orders`, payload, {
        headers: {
            apikey: ANON_KEY,
            Authorization: 'Bearer ' + TOKEN,
            'Content-Type': 'application/json',
            Prefer: 'return=representation',
        },
        tags: { name: 'comprar_ultima' },
    });

    // 201 = compró; 403/400/409 = rechazado (lo ideal tras el fix)
    check(res, {
        'pedido aceptado (201)': (r) => r.status === 201,
        'pedido rechazado (sin stock u otro motivo)': (r) => r.status !== 201,
    });
}
