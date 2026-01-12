import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
            if (!session) {
                navigate('/'); // Redirect if not logged in
            }
        });
    }, [navigate]);

    if (loading) return <div className="pt-32 text-center">Cargando...</div>;

    return (
        <div className="pt-32 pb-20 container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-8 text-[#d4af37]">Panel de Administración</h1>
            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#333]">
                <h2 className="text-xl font-bold mb-4">Bienvenido, {session?.user?.email}</h2>
                <p className="text-gray-400 mb-4">Aquí podrás gestionar el inventario y ver reportes de ventas.</p>

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
