import React, { useState } from 'react';
import { KeyRound, Plus, Copy, Trash2, ExternalLink, CheckCircle2, Shield, Calendar, Sparkles } from 'lucide-react';
import { EnviosAccessToken } from '../../apps/envios/types';
import { getStoredEnviosTokens, saveStoredEnviosTokens, generateRandomToken } from '../../apps/envios/services/uberDirectService';

interface SuperadminEnviosTokensTabProps {
  onNavigateToEnvios: () => void;
}

export const SuperadminEnviosTokensTab: React.FC<SuperadminEnviosTokensTabProps> = ({ onNavigateToEnvios }) => {
  const [tokens, setTokens] = useState<EnviosAccessToken[]>(getStoredEnviosTokens);
  const [label, setLabel] = useState('');
  const [durationDays, setDurationDays] = useState<number>(7);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreateToken = (e: React.FormEvent) => {
    e.preventDefault();
    const newToken = generateRandomToken(label, durationDays === 0 ? null : durationDays);
    const updated = [newToken, ...tokens];
    setTokens(updated);
    saveStoredEnviosTokens(updated);
    setLabel('');
  };

  const handleDeleteToken = (id: string) => {
    const updated = tokens.filter((t) => t.id !== id);
    setTokens(updated);
    saveStoredEnviosTokens(updated);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-5 animate-in fade-in">
      {/* Tarjeta de Información del Subdominio */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-teal-950/50 to-purple-950/60 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold">
              Subdominio Oficial
            </span>
            <span className="text-xs text-purple-300 font-mono">https://envios.byfiocr.com</span>
          </div>
          <h2 className="text-lg font-bubble font-bold text-white mt-1">
            Gestor de Tokens de Acceso para Envíos &amp; Uber Direct
          </h2>
          <p className="text-xs text-purple-200/80">
            Genera tokens para permitir acceso a evaluadores o probadores sin entregar credenciales de Superadmin.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToEnvios}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bubble font-bold text-xs flex items-center gap-1.5 shadow-lg shrink-0 cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Abrir Subdominio Envíos</span>
        </button>
      </div>

      {/* Formulario de Creación de Nuevo Token */}
      <form onSubmit={handleCreateToken} className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-purple-500/20 space-y-4">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bubble font-bold text-sm text-white">Crear Nuevo Token de Acceso</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="sm:col-span-2">
            <label className="text-slate-300 block mb-1">Nombre o Destinatario del Token</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ej: Prueba Repartidor Externo / Auditor Uber"
              className="w-full px-3 py-2 bg-black/60 border border-purple-500/30 rounded-xl text-white placeholder:text-slate-500"
              required
            />
          </div>
          <div>
            <label className="text-slate-300 block mb-1">Vigencia / Expiración</label>
            <select
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full px-3 py-2 bg-black/80 border border-purple-500/30 rounded-xl text-white"
            >
              <option value={1}>1 Día (24 Horas)</option>
              <option value={7}>7 Días (1 Semana)</option>
              <option value={30}>30 Días (1 Mes)</option>
              <option value={0}>Permanente (Sin Expiración)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bubble font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Generar y Guardar Token en Cloudflare D1</span>
        </button>
      </form>

      {/* Lista de Tokens Generados */}
      <div className="space-y-3">
        <h3 className="font-bubble font-bold text-sm text-purple-200">
          Tokens Activos ({tokens.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tokens.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-2xl bg-black/40 border border-purple-500/30 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bubble font-bold text-sm text-white block">{t.label}</span>
                    <span className="text-[11px] text-purple-300/80 font-mono">
                      Creado: {new Date(t.createdAt).toLocaleDateString('es-CR')}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {t.expiresAt ? `Expira: ${new Date(t.expiresAt).toLocaleDateString('es-CR')}` : 'Permanente'}
                  </span>
                </div>

                <div className="mt-2.5 p-2 bg-slate-950 rounded-xl border border-white/5 flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-emerald-400 font-bold select-all truncate">
                    {t.token}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(t.token, t.id)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-purple-200 text-xs flex items-center gap-1 shrink-0 cursor-pointer"
                    title="Copiar Token"
                  >
                    {copiedId === t.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleCopy(`https://envios.byfiocr.com?token=${t.token}`, `url-${t.id}`)}
                  className="text-[11px] text-teal-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === `url-${t.id}` ? <span>✓ Enlace Copiado</span> : <span>Copiar Enlace Directo</span>}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteToken(t.id)}
                  className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                  title="Eliminar Token"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
