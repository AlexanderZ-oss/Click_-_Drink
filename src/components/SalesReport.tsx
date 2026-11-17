import { useEffect, useState } from 'react';
import { Download, FileDown, Trash2, RefreshCw, ShoppingCart } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Order = {
    id: any;
    created_at: string;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    delivery_address?: string;
    total?: number;
    status: string;
    items?: any[];
};

const fmt = (n: any) => (Number(n) || 0).toFixed(2);
const detalleItems = (items: any) =>
    Array.isArray(items)
        ? items.map(i => `${i.quantity || 1}x ${i.name || i.title || 'Producto'}`).join(' | ')
        : '';

// SECCION VENTAS DEL PANEL ADMIN:
// - Tabla de pedidos con detalle y filtros
// - Reportes descargables en CSV (Excel) y PDF (impresion/guardar como PDF)
// - Limpieza de ventas con mas de 1 mes para no acumular facturas antiguas
const SalesReport = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');

    const load = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(500);
        if (data) setOrders(data as Order[]);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const shown = orders.filter(o => filter === 'all' || o.status === filter);
    const revenue = shown.filter(o => o.status === 'paid').reduce((s, o) => s + (Number(o.total) || 0), 0);
    const unidades = shown.reduce((s, o) => s + (Array.isArray(o.items) ? o.items.reduce((a, i) => a + (i.quantity || 1), 0) : 0), 0);

    // CSV: separador ; y BOM para que Excel en espanol lo abra en columnas
    const downloadCSV = () => {
        const rows: string[][] = [
            ['ID Pedido', 'Fecha', 'Cliente', 'Email', 'Telefono', 'Direccion', 'Estado', 'Unidades', 'Detalle', 'Total (S/)']
        ];
        shown.forEach(o => {
            const items = Array.isArray(o.items) ? o.items : [];
            rows.push([
                String(o.id),
                new Date(o.created_at).toLocaleString(),
                o.customer_name || '',
                o.customer_email || '',
                o.customer_phone || '',
                String(o.delivery_address || '').replace(/\r?\n/g, ' '),
                o.status,
                String(items.reduce((a, i) => a + (i.quantity || 1), 0)),
                detalleItems(o.items),
                fmt(o.total)
            ]);
        });
        const csv = '\uFEFF' + rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(';')).join('\r\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `ventas_ferest_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
    };

    // PDF: genera un reporte imprimible y abre el dialogo de impresion
    // (aqui eliges "Guardar como PDF"; sin librerias externas, cero peso extra)
    const downloadPDF = () => {
        const filas = shown.map(o => `
            <tr>
                <td>#${String(o.id)}</td>
                <td>${new Date(o.created_at).toLocaleDateString()}</td>
                <td>${o.customer_email || '-'}</td>
                <td>${detalleItems(o.items) || '-'}</td>
                <td>${o.status}</td>
                <td style="text-align:right">S/ ${fmt(o.total)}</td>
            </tr>`).join('');
        const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
            <title>Reporte de Ventas FEREST</title>
            <style>
                body { font-family: Georgia, serif; color: #111; padding: 30px; }
                h1 { font-size: 22px; margin: 0 0 4px; }
                .sub { color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 24px; }
                .resumen { background: #f5f0e6; padding: 14px 18px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; }
                table { width: 100%; border-collapse: collapse; font-size: 11px; }
                th { background: #111; color: #c5a059; text-align: left; padding: 8px; text-transform: uppercase; font-size: 9px; letter-spacing: 1px; }
                td { border-bottom: 1px solid #ddd; padding: 7px 8px; }
                .total { font-weight: bold; color: #111; }
            </style></head><body>
            <h1>FEREST Premium - Reporte de Ventas</h1>
            <div class="sub">Generado el ${new Date().toLocaleString()} - ${shown.length} pedidos</div>
            <div class="resumen">
                <b>Recaudado (pagados):</b> S/ ${fmt(revenue)} &nbsp;&nbsp;
                <b>Unidades vendidas:</b> ${unidades} &nbsp;&nbsp;
                <b>Filtro:</b> ${filter === 'all' ? 'Todos' : filter}
            </div>
            <table><thead><tr>
                <th>Pedido</th><th>Fecha</th><th>Cliente</th><th>Articulos</th><th>Estado</th><th style="text-align:right">Total</th>
            </tr></thead><tbody>${filas}</tbody></table>
            </body></html>`;
        const w = window.open('', '_blank');
        if (!w) { alert('Tu navegador bloqueo la ventana. Permite ventanas emergentes para generar el PDF.'); return; }
        w.document.write(html);
        w.document.close();
        setTimeout(() => w.print(), 400);
    };

    const cleanOld = async () => {
        const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const viejos = orders.filter(o => new Date(o.created_at) < cutoff);
        if (!viejos.length) { alert('No hay ventas con más de 1 mes. Nada que limpiar.'); return; }
        if (!confirm(`Se eliminarán ${viejos.length} pedidos anteriores al ${cutoff.toLocaleDateString()}.\n\nDescarga antes tu CSV/PDF si quieres conservarlos.\n¿Continuar?`)) return;
        setBusy(true);
        const { error } = await supabase.from('orders').delete().lt('created_at', cutoff.toISOString());
        if (error) {
            alert('No se pudo limpiar: ' + error.message);
        } else {
            alert(`Listo: ${viejos.length} pedidos antiguos eliminados.`);
            await load();
        }
        setBusy(false);
    };

    return (
        <div className="border border-white/5 bg-[#080808] rounded-lg">
            <div className="p-8 border-b border-white/5 flex flex-wrap gap-4 justify-between items-center">
                <div>
                    <h2 className="text-2xl font-serif italic mb-2">Ventas y Reportes</h2>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                        {shown.length} pedidos · S/ {fmt(revenue)} recaudados (pagados) · {unidades} unidades
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button onClick={load} disabled={loading} className="border border-white/10 text-gray-400 hover:text-white hover:border-[#c5a059]/40 px-4 py-3 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Actualizar
                    </button>
                    <button onClick={downloadCSV} disabled={!shown.length} className="border border-[#c5a059]/40 text-[#c5a059] hover:bg-[#c5a059]/10 px-4 py-3 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 disabled:opacity-40">
                        <Download size={14} /> CSV (Excel)
                    </button>
                    <button onClick={downloadPDF} disabled={!shown.length} className="border border-[#c5a059]/40 text-[#c5a059] hover:bg-[#c5a059]/10 px-4 py-3 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 disabled:opacity-40">
                        <FileDown size={14} /> PDF
                    </button>
                </div>
            </div>

            <div className="px-8 py-4 border-b border-white/5 flex flex-wrap gap-2 items-center">
                {([['all', 'Todas'], ['paid', 'Pagadas'], ['pending', 'Pendientes']] as const).map(([k, label]) => (
                    <button key={k} onClick={() => setFilter(k)}
                        className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-colors ${filter === k ? 'bg-[#c5a059] text-black' : 'bg-white/5 text-gray-500 hover:text-white'}`}>
                        {label}
                    </button>
                ))}
                <div className="flex-1" />
                <button onClick={cleanOld} disabled={busy} className="text-[9px] font-bold uppercase tracking-widest text-gray-600 hover:text-red-400 flex items-center gap-2 disabled:opacity-40">
                    <Trash2 size={13} /> Limpiar ventas de más de 1 mes
                </button>
            </div>

            <div className="divide-y divide-white/5 max-h-[55vh] overflow-y-auto">
                {loading && <div className="p-10 text-center text-gray-600 text-xs uppercase tracking-widest">Cargando ventas...</div>}
                {!loading && !shown.length && (
                    <div className="p-10 text-center">
                        <ShoppingCart size={32} className="mx-auto text-gray-800 mb-4" />
                        <p className="text-gray-600 text-xs uppercase tracking-widest">Sin ventas en este filtro todavía</p>
                    </div>
                )}
                {!loading && shown.map(o => {
                    const items = Array.isArray(o.items) ? o.items : [];
                    return (
                        <div key={o.id} className="p-6 flex flex-wrap gap-4 justify-between items-center hover:bg-white/5 transition-colors">
                            <div className="min-w-[160px]">
                                <p className="text-xs font-bold text-white uppercase tracking-tighter italic">#{String(o.id).slice(0, 12)}</p>
                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{new Date(o.created_at).toLocaleString()}</p>
                            </div>
                            <div className="min-w-[180px]">
                                <p className="text-[10px] text-gray-400 font-bold">{o.customer_email || 'Sin email'}</p>
                                <p className="text-[9px] text-gray-600">{o.customer_phone || ''} {o.delivery_address ? '· ' + o.delivery_address : ''}</p>
                            </div>
                            <div className="min-w-[200px] flex-1">
                                <p className="text-[9px] text-gray-500 leading-relaxed">{detalleItems(o.items) || 'Sin detalle'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-[#c5a059]">S/ {fmt(o.total)}</p>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded ${o.status === 'paid' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>{o.status}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SalesReport;
