import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Edit2, X, Save, Calendar, MapPin } from 'lucide-react';

const EventManager = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: 'Trujillo',
        image_url: '',
        ticket_link: '',
        active: true
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        const { data } = await supabase.from('events').select('*').order('date', { ascending: true });
        if (data) setEvents(data);
    };

    const handleOpenModal = (event: any = null) => {
        if (event) {
            setEditingEvent(event);
            setFormData({
                title: event.title,
                description: event.description || '',
                date: event.date.slice(0, 16), // Para input datetime-local
                location: event.location,
                image_url: event.image_url || '',
                ticket_link: event.ticket_link || '',
                active: event.active
            });
        } else {
            setEditingEvent(null);
            setFormData({
                title: '',
                description: '',
                date: '',
                location: 'Trujillo',
                image_url: '',
                ticket_link: '',
                active: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingEvent) {
            const { error } = await supabase.from('events').update(formData).eq('id', editingEvent.id);
            if (!error) {
                setIsModalOpen(false);
                fetchEvents();
            }
        } else {
            const { error } = await supabase.from('events').insert([formData]);
            if (!error) {
                setIsModalOpen(false);
                fetchEvents();
            }
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Desea eliminar este evento?')) {
            const { error } = await supabase.from('events').delete().eq('id', id);
            if (!error) fetchEvents();
        }
    };

    return (
        <div className="bg-[#080808] rounded-lg border border-white/5 p-10">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-serif italic text-white uppercase">Agenda <span className="text-[#c5a059] not-italic">Trujillo</span></h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn-premium"
                >
                    <Plus size={18} className="mr-2 inline" /> Nuevo Evento
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                    <div key={event.id} className="border border-white/5 bg-[#0a0a0a] rounded-lg overflow-hidden group">
                        <div className="aspect-video relative overflow-hidden">
                            <img src={event.image_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button onClick={() => handleOpenModal(event)} className="p-2 bg-black/60 rounded-full text-white hover:bg-[#c5a059] transition-colors"><Edit2 size={14} /></button>
                                <button onClick={() => handleDelete(event.id)} className="p-2 bg-black/60 rounded-full text-white hover:bg-red-500 transition-colors"><Trash2 size={14} /></button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-3 text-[#c5a059] text-[9px] font-bold uppercase tracking-widest mb-3">
                                <Calendar size={12} /> {new Date(event.date).toLocaleDateString()}
                            </div>
                            <h3 className="text-xl font-serif text-white mb-2">{event.title}</h3>
                            <p className="text-gray-500 text-xs font-light mb-4 line-clamp-2">{event.description}</p>
                            <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase font-bold tracking-tighter">
                                <MapPin size={12} /> {event.location}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-lg p-10 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-serif text-white italic">{editingEvent ? 'Editar' : 'Programar'} Evento</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Título del Evento</label>
                                    <input required type="text" className="w-full bg-white/5 border border-white/10 rounded py-3 px-4 text-white focus:border-[#c5a059] outline-none font-light" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Fecha y Hora</label>
                                    <input required type="datetime-local" className="w-full bg-white/5 border border-white/10 rounded py-3 px-4 text-white focus:border-[#c5a059] outline-none font-light" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Ubicación</label>
                                    <input required type="text" className="w-full bg-white/5 border border-white/10 rounded py-3 px-4 text-white focus:border-[#c5a059] outline-none font-light" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">URL Imagen</label>
                                    <input required type="text" className="w-full bg-white/5 border border-white/10 rounded py-3 px-4 text-white focus:border-[#c5a059] outline-none font-light" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Descripción</label>
                                <textarea className="w-full bg-white/5 border border-white/10 rounded py-3 px-4 text-white focus:border-[#c5a059] outline-none font-light h-32 resize-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Link de Tickets (Opcional)</label>
                                <input type="text" className="w-full bg-white/5 border border-white/10 rounded py-3 px-4 text-white focus:border-[#c5a059] outline-none font-light" value={formData.ticket_link} onChange={e => setFormData({ ...formData, ticket_link: e.target.value })} />
                            </div>

                            <button type="submit" className="w-full btn-premium py-5">
                                <Save size={20} className="mr-2 inline" /> {editingEvent ? 'Guardar Cambios' : 'Publicar Evento'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventManager;
