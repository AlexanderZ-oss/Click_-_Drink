import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Package, Users, BarChart3, TrendingUp, DollarSign, Eye, ChevronRight, LayoutDashboard } from 'lucide-react';
import ProductManager from '../components/ProductManager';

const Admin = () => {
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [session, setSession] = useState<any>(null);
    const [stats, setStats] = useState({ views: 0, orders: 0, revenue: 0 });
    const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'reports'>('dashboard');
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
                fetchStats();
            }
        };

        checkAccess();
    }, [navigate]);

    const fetchStats = async () => {
        setStatsLoading(true);
        try {
            const today = new Date().toISOString().split('T')[0];

            // Get Views
            const { data: analytics } = await supabase
                .from('analytics')
                .select('page_views')
                .eq('date', today)
                .single();

            // Get Orders Count
            const { count } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true });

            // Get Revenue
            const { data: ordersData } = await supabase
                .from('orders')
                .select('total_amount')
                .eq('status', 'paid');

            const totalRevenue = ordersData?.reduce((acc, order) => acc + Number(order.total_amount), 0) || 0;

            setStats({
                views: analytics?.page_views || 0,
                orders: count || 0,
                revenue: totalRevenue
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setStatsLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
            <div className="text-[#d4af37] text-xl animate-pulse font-bold tracking-widest uppercase">Verificando Credenciales...</div>
        </div>
    );

    return (
        <div className="pt-24 pb-20 min-h-screen bg-[#0a0a0a]">
            <div className="container mx-auto px-4">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 bg-[#111] p-8 rounded-[2rem] border border-white/5">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2 italic">ADMIN <span className="text-[#d4af37]">PANEL</span></h1>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Sesión activa: {session?.user?.email}</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'dashboard' ? 'bg-[#d4af37] text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                        >
                            <LayoutDashboard size={16} /> DASHBOARD
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'products' ? 'bg-[#d4af37] text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                        >
                            <Package size={16} /> PRODUCTOS
                        </button>
                    </div>
                </div>

                {activeTab === 'dashboard' && (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111] p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-full -mr-16 -mt-16 group-hover:bg-[#d4af37]/10 transition-all"></div>
                                <div className="flex justify-between items-center mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]"><Eye size={24} /></div>
                                    <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 uppercase tracking-widest">Hoy</span>
                                </div>
                                <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Tráfico Web</h3>
                                <p className="text-5xl font-black text-white tracking-tighter italic">
                                    {statsLoading ? '...' : stats.views}
                                    <span className="text-xs font-bold text-gray-500 ml-2 not-italic">vistas</span>
                                </p>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#111] p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500"><BarChart3 size={24} /></div>
                                    <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-widest">Total</span>
                                </div>
                                <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Pedidos</h3>
                                <p className="text-5xl font-black text-white tracking-tighter italic">
                                    {statsLoading ? '...' : stats.orders}
                                    <span className="text-xs font-bold text-gray-500 ml-2 not-italic">ventas</span>
                                </p>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#111] p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500"><DollarSign size={24} /></div>
                                    <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 uppercase tracking-widest">Mensual</span>
                                </div>
                                <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Recaudación</h3>
                                <p className="text-5xl font-black text-white tracking-tighter italic whitespace-nowrap">
                                    <span className="text-3xl font-light not-italic mr-1 text-[#d4af37]">S/</span>{statsLoading ? '...' : stats.revenue.toLocaleString()}
                                </p>
                            </motion.div>
                        </div>

                        {/* Quick Actions Shortcuts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div
                                onClick={() => setActiveTab('products')}
                                className="p-10 bg-[#111] rounded-[2rem] border border-white/5 hover:border-[#d4af37]/30 hover:bg-[#151515] transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-[#d4af37] group-hover:bg-[#d4af37]/5 transition-all">
                                        <Package size={32} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-2xl text-white italic">INVENTARIO</h3>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Actualizar productos y stock</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-[#d4af37] font-black text-xs tracking-[0.2em]">
                                    INGRESAR AL ÁREA <ChevronRight size={18} />
                                </div>
                            </div>

                            <div className="p-10 bg-[#111] rounded-[2rem] border border-white/5 opacity-50 cursor-not-allowed">
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500">
                                        <Users size={32} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-2xl text-white italic uppercase">Usuarios</h3>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Gestionar clientes (Próximamente)</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-gray-600 font-black text-xs tracking-[0.2em]">
                                    DESHABILITADO <ChevronRight size={18} />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'products' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <ProductManager />
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Admin;
