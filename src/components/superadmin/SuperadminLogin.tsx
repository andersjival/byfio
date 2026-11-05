import React, { useState } from 'react';
import { Shield, Lock, User, Eye, EyeOff, Key, ArrowLeft } from 'lucide-react';
import { SUPERADMIN_CREDENTIALS } from '../../utils/superadminModulesData';

interface SuperadminLoginProps {
  onLogin: (user: string, pass: string) => { success: boolean; error?: string };
  onBackToStore: () => void;
}

export const SuperadminLogin: React.FC<SuperadminLoginProps> = ({ onLogin, onBackToStore }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = onLogin(username.trim(), password.trim());
    if (!res.success) {
      setErrorMsg(res.error || 'Credenciales de Superadmin incorrectas.');
    }
  };

  const handleFillDemo = () => {
    setUsername(SUPERADMIN_CREDENTIALS.username);
    setPassword(SUPERADMIN_CREDENTIALS.password);
    setErrorMsg('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-gradient-to-b from-[#1E112A] to-[#120A1A] text-white rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-[0_20px_50px_rgba(107,33,168,0.25)] relative overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Encabezado */}
        <div className="text-center relative z-10 mb-5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/30 mb-3">
            <Shield className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-pink-400 uppercase font-bold block mb-1">
            Control Maestro Global
          </span>
          <h2 className="text-xl sm:text-2xl font-bubble font-bold text-white">
            Portal Superadmin
          </h2>
          <p className="text-xs text-purple-200/70 mt-1">
            Gestión y activación de módulos independientes de la plataforma
          </p>
        </div>

        {/* Tarjeta de Credenciales Oficiales de Fácil Acceso */}
        <div className="mb-3 p-3 rounded-2xl bg-purple-950/70 border border-purple-500/40 text-xs text-purple-200 space-y-1 relative z-10">
          <div className="flex items-center justify-between text-[11px] font-bold text-pink-300">
            <span>Credenciales Oficiales:</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-fio-yellow hover:text-white underline cursor-pointer inline-flex items-center gap-1"
            >
              <Key className="w-3 h-3 text-fio-yellow" />
              <span>Autocompletar</span>
            </button>
          </div>
          <p className="font-mono text-[11px] text-white select-all">
            <span className="text-purple-300 font-sans">Usuario:</span> superadmin@byfio.com <span className="text-purple-400 font-sans">(o superadmin)</span>
          </p>
          <p className="font-mono text-[11px] text-white select-all">
            <span className="text-purple-300 font-sans">Contraseña:</span> SuperAdmin2026!
          </p>
        </div>

        {/* Botón Acceso Rápido Directo en 1 Clic */}
        <button
          type="button"
          onClick={() => {
            const res = onLogin('superadmin@byfio.com', 'SuperAdmin2026!');
            if (!res.success) setErrorMsg(res.error || 'Credenciales incorrectas');
          }}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bubble font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 active:scale-98 transition-all mb-4 cursor-pointer relative z-10"
        >
          <Shield className="w-4 h-4 text-fio-yellow" />
          <span>⚡ Entrar como Superadmin (1 Clic directo)</span>
        </button>

        {/* Alerta de Error */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs text-center font-medium animate-in fade-in">
            {errorMsg}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1.5">
              Usuario o Correo de Superadmin
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="superadmin@byfio.com o superadmin"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-purple-950/50 border border-purple-500/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-white placeholder-purple-400/50 text-xs sm:text-sm outline-none transition-all normal-case lowercase"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1.5">
              Contraseña Maestra
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-purple-950/50 border border-purple-500/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-white placeholder-purple-400/50 text-xs sm:text-sm outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-purple-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Botón Acceso Rápido Demo para Pruebas */}
          <div className="flex items-center justify-between text-[11px] pt-1">
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1 text-pink-300 hover:text-pink-200 underline underline-offset-2 transition-colors cursor-pointer"
            >
              <Key className="w-3 h-3 text-fio-yellow" />
              <span>Autocompletar credenciales oficiales</span>
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-500 hover:to-pink-500 text-white font-bubble font-bold text-sm shadow-lg shadow-pink-600/30 active:scale-98 transition-all cursor-pointer"
          >
            Ingresar al Panel Superadmin
          </button>
        </form>

        {/* Volver */}
        <div className="mt-5 pt-4 border-t border-purple-800/40 text-center relative z-10">
          <button
            type="button"
            onClick={onBackToStore}
            className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la Tienda Oficial</span>
          </button>
        </div>
      </div>
    </div>
  );
};
