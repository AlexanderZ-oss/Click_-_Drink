import { useState } from 'react';
import { Music2, Users, Package, Calculator, MessageCircle, Star, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface PackageOption {
    id: string;
    name: string;
    description: string;
    items: string[];
    price: number;
    discount: number;
    recommended?: boolean;
}

export default function Nightclubs() {
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

    const packages: PackageOption[] = [
        {
            id: 'starter',
            name: 'Pack Fiesta Básico',
            description: 'Perfecto para eventos pequeños (20-30 personas)',
            items: [
                '2 Botellas de Vodka Premium',
                '6 Red Bulls',
                '2 Litros de Gaseosa',
                'Hielo Gratis',
                'Vasos descartables'
            ],
            price: 350,
            discount: 10
        },
        {
            id: 'premium',
            name: 'Pack Discoteca Premium',
            description: 'Ideal para fiestas medianas (50-80 personas)',
            items: [
                '4 Botellas de Vodka/Ron Premium',
                '2 Botellas de Whisky',
                '12 Red Bulls',
                '4 Litros de Gaseosa',
                'Hielo Gratis',
                'Vasos y mezcladores',
                'Delivery Gratis'
            ],
            price: 850,
            discount: 15,
            recommended: true
        },
        {
            id: 'vip',
            name: 'Pack VIP Discoteca',
            description: 'Para eventos grandes (100+ personas)',
            items: [
                '6 Botellas de Vodka/Ron Premium',
                '3 Botellas de Whisky Premium',
                '2 Botellas de Champagne',
                '24 Red Bulls',
                '8 Litros de Gaseosa',
                'Hielo Ilimitado',
                'Vasos, mezcladores y decoración',
                'Delivery Gratis',
                'Asesoría personalizada'
            ],
            price: 1500,
            discount: 20
        }
    ];

    const benefits = [
        {
            icon: TrendingUp,
            title: 'Precios Mayoristas',
            description: 'Descuentos especiales por volumen'
        },
        {
            icon: Package,
            title: 'Packs Personalizados',
            description: 'Armamos el pack según tus necesidades'
        },
        {
            icon: Users,
            title: 'Asesoría Experta',
            description: 'Te ayudamos a calcular cantidades'
        },
        {
            icon: Star,
            title: 'Productos Premium',
            description: 'Solo marcas reconocidas y de calidad'
        }
    ];

    const handleWhatsAppContact = (packageName?: string) => {
        const message = packageName
            ? `Hola, estoy interesado en el ${packageName} para mi discoteca/evento`
            : 'Hola, necesito cotización para un evento/discoteca';

        window.open(`https://wa.me/51901296314?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-[#0a0a0a]">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-6">
                        <Music2 className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-6xl font-black italic uppercase mb-4">
                        Packs para <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Discotecas</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Soluciones completas para eventos, discotecas y fiestas. Precios especiales por volumen.
                    </p>
                </motion.div>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center"
                        >
                            <benefit.icon className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                            <h3 className="font-black text-white mb-2">{benefit.title}</h3>
                            <p className="text-gray-400 text-sm">{benefit.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Packages */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {packages.map((pkg, index) => (
                        <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.15 }}
                            className={`relative bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-8 border-2 transition-all hover:shadow-2xl ${pkg.recommended
                                    ? 'border-purple-500 shadow-purple-500/20'
                                    : 'border-white/20 hover:border-purple-500/50'
                                }`}
                        >
                            {pkg.recommended && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-black">
                                    MÁS POPULAR
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-black italic text-white mb-2">{pkg.name}</h3>
                                <p className="text-gray-400 text-sm">{pkg.description}</p>
                            </div>

                            {/* Price */}
                            <div className="text-center mb-6">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <span className="text-gray-500 line-through text-xl">
                                        S/ {pkg.price.toFixed(2)}
                                    </span>
                                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-black">
                                        -{pkg.discount}%
                                    </span>
                                </div>
                                <div className="text-5xl font-black italic text-white">
                                    S/ {(pkg.price * (1 - pkg.discount / 100)).toFixed(2)}
                                </div>
                            </div>

                            {/* Items */}
                            <ul className="space-y-3 mb-8">
                                {pkg.items.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-gray-300">
                                        <span className="text-purple-500 mt-1">✓</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <button
                                onClick={() => handleWhatsAppContact(pkg.name)}
                                className={`w-full py-4 rounded-xl font-black uppercase transition-all ${pkg.recommended
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                            >
                                Solicitar Cotización
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Calculator Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl p-8 md:p-12 border border-purple-500/20 text-center"
                >
                    <Calculator className="w-16 h-16 text-purple-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-black italic text-white mb-4">
                        ¿Necesitas un Pack Personalizado?
                    </h2>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                        Contáctanos y te ayudamos a calcular las cantidades exactas según tu evento.
                        Ofrecemos asesoría gratuita y cotizaciones personalizadas.
                    </p>
                    <button
                        onClick={() => handleWhatsAppContact()}
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-black uppercase hover:opacity-90 transition-all"
                    >
                        <MessageCircle className="w-6 h-6" />
                        Hablar con un Asesor
                    </button>
                </motion.div>

                {/* Info Section */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <h3 className="font-black text-white mb-2">Delivery Gratis</h3>
                        <p className="text-gray-400 text-sm">En compras mayores a S/ 500</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <h3 className="font-black text-white mb-2">Pago Flexible</h3>
                        <p className="text-gray-400 text-sm">Efectivo, transferencia o Yape</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <h3 className="font-black text-white mb-2">Atención 24/7</h3>
                        <p className="text-gray-400 text-sm">Disponibles cuando nos necesites</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
