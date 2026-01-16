import { getConnectionStatus } from '../lib/supabase';
import { ShieldAlert, CheckCircle, XCircle, Settings } from 'lucide-react';

const Debug = () => {
    const status = getConnectionStatus();

    return (
        <div className="min-h-screen bg-[#050505] pt-40 pb-20 flex items-center justify-center p-8">
            <div className="max-w-2xl w-full bg-[#0a0a0a] border border-white/5 p-12 rounded-lg">
                <div className="flex items-center gap-4 mb-8">
                    <Settings className="text-[#c5a059]" size={32} />
                    <h1 className="text-3xl font-serif text-white uppercase italic">Diagnóstico de Sistema</h1>
                </div>

                <div className="space-y-8">
                    <div className={`p-6 border ${status.isReady ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'} rounded`}>
                        <div className="flex items-center gap-4 mb-4">
                            {status.isReady ? <CheckCircle className="text-green-500" /> : <ShieldAlert className="text-red-500" />}
                            <h2 className="text-lg font-bold uppercase tracking-widest text-white">
                                Estado: {status.isReady ? 'CONEXIÓN LISTA' : 'ERROR DE CONEXIÓN'}
                            </h2>
                        </div>
                        <p className="text-gray-400 text-sm font-light italic">
                            {status.isReady
                                ? 'El sistema se encuentra sincronizado con la nube.'
                                : 'Se requiere configuración adicional para establecer la conexión con el servidor.'}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 py-4">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Enlace de Datos</span>
                            {status.hasUrl ? <CheckCircle size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-500" />}
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 py-4">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Credencial de Acceso</span>
                            {status.hasKey ? <CheckCircle size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-500" />}
                        </div>
                    </div>

                    {!status.isReady && (
                        <div className="bg-white/5 p-8 rounded space-y-4">
                            <h3 className="text-[#c5a059] text-xs font-bold uppercase tracking-widest">¿Cómo solucionar esto?</h3>
                            <p className="text-xs text-gray-400 font-light leading-relaxed">
                                Por favor, contacte con el administrador del sistema para verificar las variables de entorno configuradas en el servidor.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Debug;

