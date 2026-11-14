import { useState } from 'react';
import { Shield, KeyRound, Truck, ArrowRight, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { SUPERADMIN_CREDENTIALS } from '../../../utils/superadminModulesData';

interface EnviosLoginGateProps {
  onSuperadminLogin: (user: string, pass: string) => boolean;
  onTokenLogin: (token: string) => boolean;
  errorMessage: string | null;
  onClearError: () => void;
  onNavigateHome: () => void;
}

export const EnviosLoginGate: React.FC<EnviosLoginGateProps> = ({
  onSuperadminLogin,
  onTokenLogin,
  errorMessage,
  onClearError,
  onNavigateHome,
}) => {
  const [tab, setTab] = useState<'token' | 'superadmin'>('token');
  const [tokenInput, setTokenInput] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClearError();
    onTokenLogin(tokenInput.trim());
  };

  const handleSuperadminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClearError();
    onSuperadminLogin(username.trim(), password.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#160B24] to-slate-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-purple-600 text-white shadow-lg mb-3">
            <Truck className="w-7 h-7" />
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold mb-1">
            <span>By.Fio Envíos</span>
            <span>•</span>
            <span>Uber Direct Testbed</span>
          </div>
          <h1 className="text-2xl font-bubble font-bold text-white">Subdominio de Envíos</h1>
          <p className="text-xs text-purple-200/70 mt-1">
            Entorno seguro de configuración y pruebas en vivo de despachos Uber Direct.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/40 rounded-xl mb-5 border border-purple-500/20">
          <button
            type="button"
            onClick={() => { setTab('token'); onClearError(); }}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bubble font-bold rounded-lg transition-all ${
              tab === 'token' ? 'bg-emerald-600 text-white shadow-md' : 'text-purple-300 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Token de Acceso</span>
          </button>
          <button
            type="button"
            onClick={() => { setTab('superadmin'); onClearError(); }}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bubble font-bold rounded-lg transition-all ${
              tab === 'superadmin' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-300 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Superadmin</span>
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs text-center font-medium animate-in fade-in">
            {errorMessage}
          </div>
        )}

        {tab === 'token' ? (
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-purple-200 mb-1">
                Token de Acceso Generado por Superadmin
              </label>
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Ej: UBER-XXXX-XXXX-XXXX"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-purple-500/30 text-white text-sm font-mono placeholder:text-purple-300/40 focus:outline-hidden focus:border-emerald-400"
                required
              />
              <p className="text-[11px] text-purple-300/60 mt-1">
                El token puede ser creado y administrado en el panel de Superadmin.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onTokenLogin('UBER-DIRECT-DEMO-2026')}
              className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-300 text-xs font-medium border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-fio-yellow" />
              <span>Usar Token Maestro de Pruebas (UBER-DIRECT-DEMO-2026)</span>
            </button>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bubble font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>Acceder con Token</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleSuperadminSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-purple-200 mb-1">Usuario Superadmin</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="superadmin@byfio.com"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-purple-500/30 text-white text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-purple-200 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-purple-500/30 text-white text-xs"
              />
            </div>
            <button
              type="button"
              onClick={() => onSuperadminLogin(SUPERADMIN_CREDENTIALS.username, SUPERADMIN_CREDENTIALS.password)}
              className="w-full py-2 rounded-xl bg-purple-900/50 hover:bg-purple-800/60 text-purple-200 text-xs font-medium border border-purple-500/40 flex items-center justify-center gap-1.5 transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-fio-yellow" />
              <span>Entrar como Superadmin Oficial (1 Clic)</span>
            </button>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bubble font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>Iniciar Sesión Superadmin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-5 pt-4 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={onNavigateHome}
            className="text-xs text-purple-300 hover:text-white transition-colors"
          >
            ← Volver a la Tienda Principal byfiocr.com
          </button>
        </div>
      </div>
    </div>
  );
};
