// k6: CARRERA POR LA ULTIMA BOTELLA - VERSION POST-FIX
// 10 compradores llaman al RPC atomico create_order con stock = 1.
// Resultado CORRECTO: exactamente 1 recibe id de pedido, los demas reciben AGOTADO.
// Uso: $env:K6_TOKEN="eyJ..." ; k6 run tests/k6/ultima_botella_rpc.js
import http from 'k6/http';
import { check } from 'k6';

const SUPABASE_URL = 'https://iaaavtbgfwatxvvpiphn.supabase.co';
const ANON_KEY = 'sb_publishable_1hsAVeQdmxw2UkQHHXbLaA_inyxKSiz';

const TOKEN = __ENV.K6_TOKEN || '';
const PRODUCT_ID = Number(__ENV.PRODUCT_ID || 1);
const COMPRADORES = Number(__ENV.COMPRADORES || 10);

export const options = {
    scenarios: {
        carrera: {
            executor: 'shared-iterations',
            vus: COMPRADORES,
            iterations: COMPRADORES,
            maxDuration: '2m',
        },
    },
};

export default function () {
    const payload = JSON.stringify({
        p_items: [{ id: PRODUCT_ID, name: 'TEST-K6 Agua Mineral', price: 5.0, quantity: 1 }],
        p_total: 5.0,
        p_delivery_address: 'Direccion de prueba k6',
        p_customer_phone: '999888777',
        p_delivery_fee: 0,
        p_invoice_type: 'boleta',
        p_ruc_dni: '00000000',
        p_company_name: '',
        p_delivery_time: '',
        p_notes: 'k6-carrera'
    });

    const res = http.post(`${SUPABASE_URL}/rest/v1/rpc/create_order`, payload, {
        headers: {
            apikey: ANON_KEY,
            Authorization: 'Bearer ' + TOKEN,
            'Content-Type': 'application/json',
        },
        tags: { name: 'comprar_ultima_rpc' },
    });

    // 200 = compró (devuelve el id del pedido); 4xx = rechazado (AGOTADO)
    check(res, {
        'COMPRO (200 con id)': (r) => r.status === 200 && /^\d+$/.test(r.body.trim()),
        'RECHAZADO por AGOTADO': (r) => r.status === 400 && r.body.includes('AGOTADO'),
    });
}
