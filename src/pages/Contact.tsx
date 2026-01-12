import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
    return (
        <div className="pt-32 pb-20 bg-[#0a0a0a]">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-12 text-center border-b-2 border-[#d4af37] py-4 inline-block">CONTÁCTANOS</h1>

                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-200">Información de Contacto</h2>
                        <p className="text-gray-400">Estamos aquí para atenderte. Contáctanos por cualquiera de nuestros canales.</p>

                        <div className="flex items-center gap-4 text-gray-300">
                            <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#d4af37]">
                                <Phone />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Teléfono</p>
                                <p className="text-lg font-bold">+51 987 654 321</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-gray-300">
                            <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#d4af37]">
                                <Mail />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-lg font-bold">pedidos@ferest.com</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-gray-300">
                            <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#d4af37]">
                                <MapPin />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Ubicación</p>
                                <p className="text-lg font-bold">Av. Principal 123, Miraflores</p>
                            </div>
                        </div>
                    </div>

                    <form className="bg-[#1a1a1a] p-8 rounded-xl border border-[#333]">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Nombre Completo</label>
                                <input type="text" className="w-full bg-[#0a0a0a] border border-[#333] rounded-md p-3 text-white focus:border-[#d4af37] outline-none" placeholder="Tu nombre" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                <input type="email" className="w-full bg-[#0a0a0a] border border-[#333] rounded-md p-3 text-white focus:border-[#d4af37] outline-none" placeholder="tu@email.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Mensaje</label>
                                <textarea className="w-full bg-[#0a0a0a] border border-[#333] rounded-md p-3 text-white focus:border-[#d4af37] outline-none h-32" placeholder="¿En qué podemos ayudarte?"></textarea>
                            </div>
                            <button className="btn-premium w-full">ENVIAR MENSAJE</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
