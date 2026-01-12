import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAccess = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                navigate('/');
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();

            if (profile?.role !== 'admin') {
                navigate('/'); // Redirect standard users
            } else {
                setSession(session);
                setLoading(false);
            }
        };

        checkAccess();
    }, [navigate]);

    if (loading) return <div className="pt-32 text-center">Cargando...</div>;

    return (
        <div className="pt-32 pb-20 container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-8 text-[#d4af37]">Panel de Administración</h1>
            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#333]">
                <h2 className="text-xl font-bold mb-4">Bienvenido, {session?.user?.email}</h2>
                <p className="text-gray-400 mb-4">Aquí podrás gestionar el inventario y ver reportes de ventas.</p>

                const [stats, setStats] = useState({views: 0, orders: 0, revenue: 0 });

    useEffect(() => {
        // ... (existing auth check)

        const fetchStats = async () => {
            const today = new Date().toISOString().split('T')[0];

                // Get Views
                const {data: analytics } = await supabase
                .from('analytics')
                .select('page_views')
                .eq('date', today)
                .single();

                // Get Orders Count
                const {count} = await supabase
                .from('orders')
                .select('*', {count: 'exact', head: true });

                setStats({
                    views: analytics?.page_views || 0,
                orders: count || 0,
                revenue: 0 // Calculate form orders if needed
            });
        };

                if (session) fetchStats();
    }, [session]); // Add session to dependency to trigger logic

                // ... (render logic)

                <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#d4af37]/30">
                        <h3 className="text-gray-400 text-sm">Vistas de Hoy</h3>
                        <p className="text-3xl font-bold text-[#d4af37]">{stats.views}</p>
                    </div>
                    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#d4af37]/30">
                        <h3 className="text-gray-400 text-sm">Pedidos Totales</h3>
                        <p className="text-3xl font-bold text-white">{stats.orders}</p>
                    </div>
                    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#d4af37]/30">
                        <h3 className="text-gray-400 text-sm">Ingresos</h3>
                        <p className="text-3xl font-bold text-green-500">S/ --</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="p-6 bg-[#0a0a0a] rounded-lg border border-[#333] hover:border-[#d4af37] transition-all cursor-pointer">
                        <h3 className="font-bold text-lg mb-2">Gestionar Productos</h3>
                        <p className="text-sm text-gray-400">Agregar, editar o eliminar productos del catálogo.</p>
                    </div>
                    <div className="p-6 bg-[#0a0a0a] rounded-lg border border-[#333] hover:border-[#d4af37] transition-all cursor-pointer">
                        <h3 className="font-bold text-lg mb-2">Reporte de Ventas</h3>
                        <p className="text-sm text-gray-400">Ver historial de transacciones y métricas.</p>
                    </div>
                    <div className="p-6 bg-[#0a0a0a] rounded-lg border border-[#333] hover:border-[#d4af37] transition-all cursor-pointer">
                        <h3 className="font-bold text-lg mb-2">Usuarios</h3>
                        <p className="text-sm text-gray-400">Gestionar usuarios y permisos.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
