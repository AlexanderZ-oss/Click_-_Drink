import React from 'react';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, Clock } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#050505] pt-16 pb-8 border-t border-[#1a1a1a]">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">🍸</span>
                            <span className="text-2xl font-bold text-[#d4af37]">FEREST</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Tu destino para los mejores tragos y licores con delivery inmediato.
                            Calidad y sabor en cada sorbo. Experiencia premium garantizada.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-gray-400 hover:bg-[#d4af37] hover:text-black transition-all">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-gray-400 hover:bg-[#d4af37] hover:text-black transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-gray-400 hover:bg-[#d4af37] hover:text-black transition-all">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-0.5 after:bg-[#d4af37]">
                            ENLACES RÁPIDOS
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors">Inicio</a></li>
                            <li><a href="#tragos" className="text-gray-400 hover:text-[#d4af37] transition-colors">Nuestra Carta</a></li>
                            <li><a href="#promociones" className="text-gray-400 hover:text-[#d4af37] transition-colors">Promociones</a></li>
                            <li><a href="#combos" className="text-gray-400 hover:text-[#d4af37] transition-colors">Combos Especiales</a></li>
                            <li><a href="/cart" className="text-gray-400 hover:text-[#d4af37] transition-colors">Carrito de Compras</a></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-white font-bold mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-0.5 after:bg-[#d4af37]">
                            CATEGORÍAS
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors">Vodkas Premium</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors">Rones Añejos</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors">Whisky Selección</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors">Cervezas Importadas</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors">Packs Fiesta</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-0.5 after:bg-[#d4af37]">
                            CONTACTO
                        </h3>
                        <div className="space-y-4 text-sm text-gray-400">
                            <div className="flex items-start gap-3">
                                <MapPin className="text-[#d4af37] shrink-0" size={18} />
                                <span>Av. Principal 123, Miraflores<br />Lima, Perú</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="text-[#d4af37] shrink-0" size={18} />
                                <span>+51 987 654 321</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="text-[#d4af37] shrink-0" size={18} />
                                <span>pedidos@ferest.com</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="text-[#d4af37] shrink-0" size={18} />
                                <span>Lun - Dom: 4:00 PM - 2:00 AM<br /><span className="text-xs text-gray-500">Delivery continuado</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#1a1a1a] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs text-center md:text-left">
                        &copy; 2024 FEREST Licorería. Todos los derechos reservados.
                    </p>
                    <div className="px-4 py-2 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded text-[#d4af37] text-xs font-bold tracking-wider">
                        TOMAR BEBIDAS ALCOHÓLICAS EN EXCESO ES DAÑINO
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
