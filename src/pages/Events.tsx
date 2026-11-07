import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, MapPin, Ticket, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Events() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            const { data } = await supabase
                .from('events')
                .select('*')
                .eq('active', true)
                .order('date', { ascending: true });
            // Solo eventos actuales o futuros
            const now = new Date();
            const upcoming = (data || []).filter(e => !e.date || new Date(e.date) >= new Date(now.toDateString()));
            setEvents(upcoming);
            setLoading(false);
        };
        fetchEvents();
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] pt-40 pb-32">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center mb-16 md:mb-32 reveal px-4">
                    <span className="text-[#c5a059] text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block">Trujillo Exclusive</span>
                    <h1 className="text-4xl md:text-8xl font-serif italic mb-8 text-white">Próximos <span className="text-[#c5a059] not-italic">Eventos</span></h1>
                    <p className="text-gray-500 font-light tracking-wide italic max-w-2xl mx-auto text-sm md:text-base">
                        Descubra la agenda más selecta de la ciudad. Experiencias diseñadas para aquellos que buscan distinción y exclusividad.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-[#c5a059] font-bold tracking-widest uppercase text-[10px]">Cargando Agenda...</div>
                ) : events.length > 0 ? (
                    <div className="space-y-20 md:space-y-40">
                        {events.map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`flex flex-col lg:flex-row items-center gap-16 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                            >
                                <div className="flex-1 w-full aspect-[4/5] lg:aspect-square relative overflow-hidden group">
                                    {event.image_url ? (
                                        <img
                                            src={event.image_url}
                                            className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                                            alt={event.title}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(197,160,89,0.2)_0%,_#0a0a0a_70%)]"></div>
                                    )}
                                    <div className="absolute inset-0 border border-white/5 m-4 pointer-events-none"></div>
                                </div>

                                <div className="flex-1 space-y-8">
                                    <div className="flex items-center gap-4 text-[#c5a059]">
                                        <div className="w-12 h-[1px] bg-[#c5a059]"></div>
                                        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">
                                            {new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>

                                    <h2 className="text-3xl md:text-6xl font-serif text-white leading-tight italic">{event.title}</h2>

                                    <p className="text-gray-400 font-light text-lg leading-relaxed italic">
                                        "{event.description}"
                                    </p>

                                    <div className="flex flex-col gap-4 text-gray-500">
                                        <div className="flex items-center gap-3">
                                            <MapPin size={18} strokeWidth={1} />
                                            <span className="text-sm font-light tracking-widest uppercase">{event.location}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar size={18} strokeWidth={1} />
                                            <span className="text-sm font-light tracking-widest uppercase">{new Date(event.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} HRS</span>
                                        </div>
                                    </div>

                                    {event.ticket_link && (
                                        <a href={event.ticket_link} target="_blank" rel="noopener noreferrer" className="btn-premium inline-flex group items-center gap-3">
                                            Reservar Lugar <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40">
                        <p className="text-gray-600 font-serif italic text-2xl">No hay eventos programados en este momento.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
