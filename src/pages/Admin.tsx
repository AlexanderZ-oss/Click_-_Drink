import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, Users, BarChart3, DollarSign, Eye, ChevronRight, ShoppingBag, Percent, Mail, Megaphone, LogOut, Settings, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductManager from '../components/ProductManager';
import PromoManager from '../components/PromoManager';
import BannerManager from '../components/BannerManager';
import EventManager from '../components/EventManager';

const Admin = () => {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'sales' | 'users' | 'promos' | 'messages' | 'banners' | 'events'>('dashboard');
    const { user, isAdmin, signOut } = useAuth();
    const [stats, setStats] = useState({ views: 0, orders: 0, revenue: 0, users: 0, dailyRevenue: 0, dailyOrdersCount: 0, eventsCount: 0 });
    const [orders, setOrders] = useState<any[]>([]);
    const [usersList, setUsersList] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !isAdmin) {
            navigate('/login');
            return;
        }

        const initializeAdmin = async () => {
            try {
                setLoading(true);
                setFetchError(null);
                await Promise.all([
                    fetchStats(),
                    fetchOrders(),
                    fetchUsers(),
                    fetchMessages()
                ]);
            } catch (error: any) {
                console.error('Admin init error:', error);
                setFetchError('Error de conexión con la base de datos (Failed to fetch). Verifique sus credenciales.');
            } finally {
                setLoading(false);
            }
        };

        initializeAdmin();
    }, [user, isAdmin, navigate]);

    const fetchStats = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            // Fetch safely
            const { data: analytics } = await supabase.from('analytics').select('page_views').eq('date', today).maybeSingle();
            const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
            const { data: todayOrders } = await supabase.from('orders').select('total').eq('status', 'paid').gte('created_at', startOfDay.toISOString());
            const { data: allPaidOrders } = await supabase.from('orders').select('total').eq('status', 'paid');
            const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            const { count: eventsCount } = await supabase.from('events').select('*', { count: 'exact', head: true });

            const totalRevenue = allPaidOrders?.reduce((acc, order) => acc + Number(order.total), 0) || 0;
            const dailyRevenue = todayOrders?.reduce((acc, order) => acc + Number(order.total), 0) || 0;

            setStats({
                views: analytics?.page_views || 0,
                orders: ordersCount || 0,
                revenue: totalRevenue,
                users: usersCount || 0,
                dailyRevenue,
                dailyOrdersCount: todayOrders?.length || 0,
                eventsCount: eventsCount || 0
            });
        } catch (e) {
            console.error('Stats fetch error:', e);
        }
    };

    const fetchOrders = async () => {
        const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(20);
        if (data) setOrders(data);
    };

    const fetchUsers = async () => {
        const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (data) setUsersList(data);
    };

    const fetchMessages = async () => {
        const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
        if (data) setMessages(data);
    };

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="text-[#c5a059] text-[10px] font-bold tracking-[0.5em] uppercase animate-pulse">Sincronizando Sistema...</div>
        </div>
    );

    if (fetchError) return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6">
            <div className="bg-red-500/10 border border-red-500/20 p-12 rounded-lg text-center max-w-md">
                <h2 className="text-red-500 font-serif italic text-3xl mb-4">Error Crítico</h2>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">{fetchError}</p>
                <div className="flex gap-4">
                    <button onClick={() => window.location.reload()} className="btn-premium flex-1">Reintentar</button>
                    <button onClick={() => navigate('/')} className="text-[10px] font-bold tracking-widest uppercase py-4 px-8 border border-white/5 hover:bg-white/5">Inicio</button>
                </div>
            </div>
        </div>
    );

    const NavItem = ({ id, label, icon: Icon }: any) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-3 px-6 py-4 transition-all duration-500 border-b-2 ${activeTab === id ? 'border-[#c5a059] text-white' : 'border-transparent text-gray-600 hover:text-white'}`}
        >
            <Icon size={16} strokeWidth={1.5} />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-[#050505] flex overflow-hidden">
            {/* Sidebar Minimalist */}
            <div className="w-20 lg:w-64 border-r border-white/5 flex flex-col bg-[#080808]">
                <div className="p-8 border-b border-white/5">
                    <span className="text-[#c5a059] font-serif text-2xl italic hidden lg:block tracking-tighter">Ferest Admin</span>
                    <span className="text-[#c5a059] font-serif text-2xl italic lg:hidden">F</span>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-4 p-4 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-[#c5a059]/10 text-[#c5a059]' : 'text-gray-500 hover:bg-white/5'}`}>
                        <BarChart3 size={20} /><span className="hidden lg:block text-xs font-bold uppercase tracking-widest">Dashboard</span>
                    </button>
                    <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-4 p-4 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-[#c5a059]/10 text-[#c5a059]' : 'text-gray-500 hover:bg-white/5'}`}>
                        <Package size={20} /><span className="hidden lg:block text-xs font-bold uppercase tracking-widest">Productos</span>
                    </button>
                    <button onClick={() => setActiveTab('sales')} className={`w-full flex items-center gap-4 p-4 rounded-lg transition-colors ${activeTab === 'sales' ? 'bg-[#c5a059]/10 text-[#c5a059]' : 'text-gray-500 hover:bg-white/5'}`}>
                        <ShoppingBag size={20} /><span className="hidden lg:block text-xs font-bold uppercase tracking-widest">Ventas</span>
                    </button>
                    <button onClick={() => setActiveTab('promos')} className={`w-full flex items-center gap-4 p-4 rounded-lg transition-colors ${activeTab === 'promos' ? 'bg-[#c5a059]/10 text-[#c5a059]' : 'text-gray-500 hover:bg-white/5'}`}>
                        <Percent size={20} /><span className="hidden lg:block text-xs font-bold uppercase tracking-widest">Promociones</span>
                    </button>
                    <button onClick={() => setActiveTab('banners')} className={`w-full flex items-center gap-4 p-4 rounded-lg transition-colors ${activeTab === 'banners' ? 'bg-[#c5a059]/10 text-[#c5a059]' : 'text-gray-500 hover:bg-white/5'}`}>
                        <Megaphone size={20} /><span className="hidden lg:block text-xs font-bold uppercase tracking-widest">Anuncios</span>
                    </button>
                    <button onClick={() => setActiveTab('events')} className={`w-full flex items-center gap-4 p-4 rounded-lg transition-colors ${activeTab === 'events' ? 'bg-[#c5a059]/10 text-[#c5a059]' : 'text-gray-500 hover:bg-white/5'}`}>
                        <Calendar size={20} /><span className="hidden lg:block text-xs font-bold uppercase tracking-widest">Eventos</span>
                    </button>
                </nav>
                <div className="p-4 mt-auto border-t border-white/5">
                    <button onClick={() => signOut()} className="w-full flex items-center gap-4 p-4 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                        <LogOut size={20} /><span className="hidden lg:block text-xs font-bold uppercase tracking-widest">Salir</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto h-screen">
                <header className="p-8 border-b border-white/5 flex justify-between items-center bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-30">
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mb-1 italic">Gestión Boutique</p>
                        <h1 className="text-2xl font-serif italic text-white uppercase">{activeTab}</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:block text-right">
                            <p className="text-[10px] text-white font-bold">{user?.email}</p>
                            <p className="text-[9px] text-green-500 font-black tracking-widest uppercase">Sistema Activo</p>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-[#c5a059]/20 text-[#c5a059]">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                <main className="p-8 pb-32 max-w-7xl mx-auto">
                    {activeTab === 'dashboard' && (
                        <div className="space-y-12">
                            {/* Metrics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <div className="p-8 border border-white/5 bg-[#080808] rounded-lg">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">Ventas de Hoy</p>
                                    <div className="flex items-end justify-between">
                                        <p className="text-3xl font-serif text-[#c5a059]">S/ {stats.dailyRevenue.toFixed(2)}</p>
                                        <p className="text-[9px] text-green-500 font-bold">+{stats.dailyOrdersCount}</p>
                                    </div>
                                </div>
                                <div className="p-8 border border-white/5 bg-[#080808] rounded-lg">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">Vistas del Sitio</p>
                                    <div className="flex items-end justify-between">
                                        <p className="text-3xl font-serif text-white">{stats.views}</p>
                                        <Eye size={16} className="text-gray-700" />
                                    </div>
                                </div>
                                <div className="p-8 border border-white/5 bg-[#080808] rounded-lg">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">Recaudación Total</p>
                                    <p className="text-3xl font-serif text-[#c5a059]">S/ {stats.revenue.toFixed(2)}</p>
                                </div>
                                <div className="p-8 border border-white/5 bg-[#080808] rounded-lg">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">Base CRM</p>
                                    <p className="text-3xl font-serif text-white">{stats.users} <Users size={16} className="inline ml-2 text-gray-700" /></p>
                                </div>
                            </div>

                            {/* Recent Sales Table Small */}
                            <div className="border border-white/5 bg-[#080808] rounded-lg overflow-hidden">
                                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                    <h2 className="text-sm font-bold tracking-widest uppercase italic">Últimos Movimientos</h2>
                                    <button onClick={() => setActiveTab('sales')} className="text-[9px] font-bold text-[#c5a059] uppercase tracking-widest">Ver Todos {'>'}</button>
                                </div>
                                <div className="divide-y divide-white/5">
                                    {orders.slice(0, 5).map((order) => (
                                        <div key={order.id} className="p-6 flex justify-between items-center hover:bg-white/5 transition-colors">
                                            <div className="flex items-center gap-6">
                                                <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-gray-400">
                                                    <DollarSign size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white uppercase tracking-tighter italic">#{order.id.slice(0, 8)}</p>
                                                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-[#c5a059]">S/ {order.total.toFixed(2)}</p>
                                                <p className="text-[9px] text-gray-600 uppercase font-black">{order.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Manager Tabs */}
                    <div className="reveal">
                        {activeTab === 'products' && <ProductManager />}
                        {activeTab === 'promos' && (
                            <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-lg">
                                <PromoManager />
                            </div>
                        )}
                        {activeTab === 'banners' && <BannerManager />}
                        {activeTab === 'events' && <EventManager />}
                        {activeTab === 'sales' && (
                            <div className="border border-white/5 bg-[#080808] rounded-lg p-10">
                                <h2 className="text-2xl font-serif italic mb-10">Bitácora de Ventas</h2>
                                <div className="space-y-4">
                                    {orders.map(order => (
                                        <div key={order.id} className="p-6 border border-white/5 flex justify-between items-center hover:border-[#c5a059]/20 transition-all rounded">
                                            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">#{order.id.slice(0, 12)}</span>
                                            <span className="text-sm font-bold text-white">S/ {order.total.toFixed(2)}</span>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-[#c5a059] bg-[#c5a059]/5 px-3 py-1">{order.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Admin;
