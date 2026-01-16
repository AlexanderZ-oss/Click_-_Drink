import { getSupabaseStatus } from '../lib/supabase';
import { ShieldAlert, CheckCircle, XCircle, Settings } from 'lucide-react';

const Debug = () => {
    const status = getSupabaseStatus();

    return (
        <div className="min-h-screen bg-[#050505] pt-40 pb-20 flex items-center justify-center p-8">
            <div className="max-w-2xl w-full bg-[#0a0a0a] border border-white/5 p-12 rounded-lg">
                <div className="flex items-center gap-4 mb-8">
                    <Settings className="text-[#c5a059]" size={32} />
                    <h1 className="text-3xl font-serif text-white uppercase italic">Diagnóstico de Conexión</h1>
                </div>

                <div className="space-y-8">
                    <div className={`p-6 border ${status.isReady ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'} rounded`}>
                        <div className="flex items-center gap-4 mb-4">
                            {status.isReady ? <CheckCircle className="text-green-500" /> : <ShieldAlert className="text-red-500" />}
                            <h2 className="text-lg font-bold uppercase tracking-widest text-white">
                                Estado: {status.isReady ? 'CONFIGURADO' : 'ERROR DE CONFIGURACIÓN'}
                            </h2>
                        </div>
                        <p className="text-gray-400 text-sm font-light italic">
                            {status.isReady
                                ? 'La aplicación ha detectado las llaves de Supabase correctamente.'
                                : 'Faltan las variables de entorno necesarias para conectarse a la base de datos.'}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 py-4">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">URL de Supabase (VITE_SUPABASE_URL)</span>
                            {status.hasUrl ? <CheckCircle size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-500" />}
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 py-4">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Llave Anónima (VITE_SUPABASE_ANON_KEY)</span>
                            {status.hasKey ? <CheckCircle size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-500" />}
                        </div>
                    </div>

                    {!status.isReady && (
                        <div className="bg-white/5 p-8 rounded space-y-4">
                            <h3 className="text-[#c5a059] text-xs font-bold uppercase tracking-widest">¿Cómo solucionar esto?</h3>
                            <ol className="text-xs text-gray-400 space-y-4 list-decimal ml-4 font-light leading-relaxed">
                                <li>Ve a tu panel de <span className="text-white font-medium">Vercel</span>.</li>
                                <li>Entra en <span className="text-white font-medium">Settings {'>'} Environment Variables</span>.</li>
                                <li>Añade <span className="text-[#c5a059] font-medium">VITE_SUPABASE_URL</span> con la URL de tu proyecto.</li>
                                <li>Añade <span className="text-[#c5a059] font-medium">VITE_SUPABASE_ANON_KEY</span> con la anon key secreta.</li>
                                <li>Vuelve a la pestaña de <span className="text-white font-medium">Deployments</span> y haz un <span className="text-white font-medium">Redeploy</span>.</li>
                            </ol>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Debug;
