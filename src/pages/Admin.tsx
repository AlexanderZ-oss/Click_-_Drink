import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Package, Users, BarChart3, DollarSign, Eye, ChevronRight, LayoutDashboard, ShoppingBag, Percent, Mail, Trash2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductManager from '../components/ProductManager';
import PromoManager from '../components/PromoManager';

const Admin = () => {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'sales' | 'users' | 'promos' | 'messages'>('dashboard');
    const [stats, setStats] = useState({ views: 0, orders: 0, revenue: 0, users: 0 });
    const [orders, setOrders] = useState<any[]>([]);
    const [usersList, setUsersList] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAccess = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { navigate('/'); return; }

            const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
            if (profile?.role !== 'admin') {
                navigate('/');
            } else {
                setSession(session);
                setLoading(false);
                fetchStats();
                fetchOrders();
                fetchUsers();
                fetchMessages();
            }
        };
        checkAccess();
    }, [navigate]);

    const fetchStats = async () => {
        const today = new Date().toISOString().split('T')[0];
        const { data: analytics } = await supabase.from('analytics').select('page_views').eq('date', today).single();
        const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
        const { data: ordersData } = await supabase.from('orders').select('total_amount').eq('status', 'paid');
        const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

        const totalRevenue = ordersData?.reduce((acc, order) => acc + Number(order.total_amount), 0) || 0;

        setStats({
            views: analytics?.page_views || 0,
            orders: ordersCount || 0,
            revenue: totalRevenue,
            users: usersCount || 0
        });
    };

    const fetchOrders = async () => {
        const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (data) setOrders(data);
    };

    const fetchUsers = async () => {
        const { data } = await supabase.from('profiles').select('*').order('role', { ascending: false });
        if (data) setUsersList(data);
    };

    const fetchMessages = async () => {
        const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
        if (data) setMessages(data);
    };

    const toggleMessageRead = async (id: number, current: boolean) => {
        await supabase.from('messages').update({ read: !current }).eq('id', id);
        fetchMessages();
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
            <div className="text-[#d4af37] text-xl animate-pulse font-black tracking-widest uppercase italic">Verificando Acceso...</div>
        </div>
    );

    const NavItem = ({ id, label, icon: Icon }: any) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black transition-all border ${activeTab === id ? 'bg-[#d4af37] border-[#d4af37] text-black shadow-2xl' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:text-white'}`}
        >
            <Icon size={16} /> {label}
        </button>
    );

    return (
        <div className="pt-24 pb-20 min-h-screen bg-[#0a0a0a]">
            <div className="container mx-auto px-4">
                {/* Admin Header */}
                <div className="bg-[#111] p-10 rounded-[3rem] border border-white/5 mb-10 flex flex-col lg:flex-row justify-between items-center gap-8 shadow-3xl">
                    <div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Panel de <span className="text-[#d4af37]">Control</span></h1>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Sistema Operativo • {session?.user?.email}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <NavItem id="dashboard" label="MÉTRICAS" icon={BarChart3} />
                        <NavItem id="products" label="PRODUCTOS" icon={Package} />
                        <NavItem id="sales" label="VENTAS" icon={ShoppingBag} />
                        <NavItem id="promos" label="PROMOS" icon={Percent} />
                        <NavItem id="users" label="USUARIOS" icon={Users} />
                        <NavItem id="messages" label="MENSAJES" icon={Mail} />
                    </div>
                </div>

                {/* Dashboard Content */}
                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-[#111] p-10 rounded-[3rem] border border-white/5 text-center group hover:border-[#d4af37]/30 transition-all">
                            <div className="w-16 h-16 rounded-3xl bg-[#d4af37]/10 flex items-center justify-center mx-auto mb-6 text-[#d4af37]"><Eye /></div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Vistas Hoy</p>
                            <p className="text-5xl font-black italic">{stats.views}</p>
                        </div>
                        <div className="bg-[#111] p-10 rounded-[3rem] border border-white/5 text-center group hover:border-blue-500/30 transition-all">
                            <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6 text-blue-500"><ShoppingBag /></div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Pedidos</p>
                            <p className="text-5xl font-black italic">{stats.orders}</p>
                        </div>
                        <div className="bg-[#111] p-10 rounded-[3rem] border border-white/5 text-center group hover:border-green-500/30 transition-all">
                            <div className="w-16 h-16 rounded-3xl bg-green-500/10 flex items-center justify-center mx-auto mb-6 text-green-500"><DollarSign /></div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Recaudación</p>
                            <p className="text-4xl font-black italic"><span className="text-[#d4af37] text-2xl">S/</span>{stats.revenue.toLocaleString()}</p>
                        </div>
                        <div className="bg-[#111] p-10 rounded-[3rem] border border-white/5 text-center group hover:border-purple-500/30 transition-all">
                            <div className="w-16 h-16 rounded-3xl bg-purple-500/10 flex items-center justify-center mx-auto mb-6 text-purple-500"><Users /></div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Registrados</p>
                            <p className="text-5xl font-black italic">{stats.users}</p>
                        </div>
                    </div>
                )}

                {/* Sales Tab */}
                {activeTab === 'sales' && (
                    <div className="bg-[#111] p-10 rounded-[3rem] border border-white/5">
                        <h2 className="text-2xl font-black italic uppercase mb-10">Cronograma de <span className="text-[#d4af37]">Ventas</span></h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-white/5">
                                    <tr className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">
                                        <th className="pb-6">ID Venta</th>
                                        <th className="pb-6">Cliente</th>
                                        <th className="pb-6">Tipo</th>
                                        <th className="pb-6">Monto</th>
                                        <th className="pb-6">Estado</th>
                                        <th className="pb-6">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {orders.map(order => (
                                        <tr key={order.id} className="text-xs font-bold italic group hover:bg-white/5 transition-all">
                                            <td className="py-6 font-black text-[#d4af37]">#ORD-{order.id}</td>
                                            <td className="py-6 text-white">{order.contact_phone || 'User Anonymous'}</td>
                                            <td className="py-6 uppercase font-black text-[10px]">{order.invoice_type}</td>
                                            <td className="py-6 text-lg font-black italic">S/ {order.total_amount}</td>
                                            <td className="py-6">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${order.status === 'paid' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-6 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="bg-[#111] p-10 rounded-[3rem] border border-white/5">
                        <h2 className="text-2xl font-black italic uppercase mb-10">Base de <span className="text-[#d4af37]">Datos</span></h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {usersList.map(user => (
                                <div key={user.id} className="bg-black/40 p-6 rounded-3xl border border-white/5 flex items-center gap-6">
                                    <img src={user.avatar_url || 'https://via.placeholder.com/150'} className="w-16 h-16 rounded-2xl border border-white/10" />
                                    <div>
                                        <p className="font-black text-white uppercase italic">{user.username?.split('@')[0]}</p>
                                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{user.role}</p>
                                        <p className="text-[10px] text-gray-600 mt-1">{user.username}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Messages Tab */}
                {activeTab === 'messages' && (
                    <div className="bg-[#111] p-10 rounded-[3rem] border border-white/5">
                        <h2 className="text-2xl font-black italic uppercase mb-10">Bandeja de <span className="text-[#d4af37]">Entrada</span></h2>
                        <div className="space-y-6">
                            {messages.map(msg => (
                                <div key={msg.id} className={`p-8 rounded-3xl border ${msg.read ? 'bg-black/20 border-white/5 opacity-60' : 'bg-[#d4af37]/5 border-[#d4af37]/20 shadow-xl'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-xs font-black text-[#d4af37] uppercase tracking-widest mb-1">{msg.name}</p>
                                            <p className="text-lg font-black italic text-white">{msg.email}</p>
                                        </div>
                                        <button
                                            onClick={() => toggleMessageRead(msg.id, msg.read)}
                                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#d4af37] hover:text-black transition-all"
                                        >
                                            <CheckCircle2 size={20} />
                                        </button>
                                    </div>
                                    <p className="text-gray-400 font-medium italic mb-4">"{msg.message}"</p>
                                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">{new Date(msg.created_at).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'products' && <ProductManager />}
                {activeTab === 'promos' && <PromoManager />}
            </div>
        </div>
    );
};

export default Admin;
