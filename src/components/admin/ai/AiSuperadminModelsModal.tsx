import React, { useState } from 'react';
import { X, Lock, Key, ShieldCheck, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';
import { SUPERADMIN_CREDENTIALS } from '../../../utils/superadminModulesData';

interface AiSuperadminModelsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiSuperadminModelsModal: React.FC<AiSuperadminModelsModalProps> = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SUPERADMIN_CREDENTIALS.password) {
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleClose = () => {
    setPassword('');
    setIsUnlocked(false);
    setError(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white dark:bg-[#1a1429] rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-purple-200 dark:border-purple-800/60 space-y-4 animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between border-b border-purple-50 dark:border-purple-900/30 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-gradient-to-tr from-purple-700 to-fio-pink text-white shadow-sm">
              <Cpu className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bubble font-bold text-base text-slate-800 dark:text-purple-100 flex items-center gap-2">
                Modelos de IA en Uso
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono font-bold">
                  Solo Superadmin
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-purple-300 font-sans">
                {isUnlocked ? 'Modelos activos y configuración interna del proyecto' : 'Requiere contraseña de Superadmin'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isUnlocked ? (
          <form onSubmit={handleVerify} className="space-y-3.5 py-2">
            <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/30 flex items-center gap-3">
              <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
              <p className="text-xs text-slate-600 dark:text-purple-200 font-sans">
                Por seguridad del sistema comercial, los motores de IA solo son visibles para la cuenta de Superadmin.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bubble font-bold text-slate-700 dark:text-purple-200 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-fio-pink" />
                <span>Contraseña del Superadmin</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Ingresa la contraseña..."
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-purple-900/40 bg-white dark:bg-purple-950/20 text-xs font-sans text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {error && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Contraseña incorrecta. Solo el Superadmin puede consultar los modelos.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-fio-pink text-white font-bubble font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Desbloquear Vista de Modelos
            </button>
          </form>
        ) : (
          <div className="space-y-3 py-1 text-xs">
            {/* Modelo 1: Cliente Web */}
            <div className="p-3 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bubble font-bold text-slate-800 dark:text-purple-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Modelo Clientes Web (Atención &amp; Ventas)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold">
                  Activo
                </span>
              </div>
              <code className="text-[11px] font-mono text-purple-700 dark:text-purple-300 font-bold block">
                @cf/meta/llama-3.3-70b-instruct-fp8-fast
              </code>
              <p className="text-[10px] text-slate-400">
                Fallback resiliente: <code className="text-purple-600 dark:text-purple-400">@cf/meta/llama-3.1-8b-instruct-fp8</code>
              </p>
            </div>

            {/* Modelo 2: Colaboradoras & Staff */}
            <div className="p-3 rounded-2xl bg-pink-50/60 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bubble font-bold text-slate-800 dark:text-purple-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Modelo Colaboradoras &amp; Staff (Inventario Interno)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold">
                  Activo
                </span>
              </div>
              <code className="text-[11px] font-mono text-pink-700 dark:text-pink-300 font-bold block">
                @cf/google/gemma-4-26b-a4b-it
              </code>
              <p className="text-[10px] text-slate-400">
                Fallback resiliente: <code className="text-pink-600 dark:text-pink-400">@cf/meta/llama-3.3-70b-instruct-fp8-fast</code>
              </p>
            </div>

            {/* Modelo 3: Transcripción de Audio */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bubble font-bold text-slate-800 dark:text-purple-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Transcripción de Audio / Notas de Voz
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold">
                  Activo
                </span>
              </div>
              <code className="text-[11px] font-mono text-purple-700 dark:text-purple-300 font-bold block">
                @cf/openai/whisper
              </code>
            </div>

            {/* Parámetros de Calibración */}
            <div className="p-3 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 text-[11px] space-y-1">
              <span className="font-bubble font-bold text-purple-900 dark:text-purple-200 block">
                Calibración &amp; Seguridad Activa:
              </span>
              <p className="text-slate-600 dark:text-purple-300">
                Temperatura: <strong>0.3</strong> | Tokens: <strong>120</strong> | Top-P: <strong>0.85</strong> | Top-K: <strong>40</strong> | Moderación: <strong>Activa</strong>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
