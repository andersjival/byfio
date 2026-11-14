import React from 'react';
import { Sliders, ShieldCheck, RefreshCw } from 'lucide-react';
import { AiAgentConfig, DEFAULT_AI_AGENT_CONFIG } from '../../../types/aiAgent';

interface AiTechnicalParamsCardProps {
  config: AiAgentConfig;
  onChangeField: (field: keyof AiAgentConfig, val: any) => void;
}

export const AiTechnicalParamsCard: React.FC<AiTechnicalParamsCardProps> = ({
  config,
  onChangeField,
}) => {
  return (
    <div className="bg-white dark:bg-[#1a1429] rounded-3xl p-5 sm:p-6 shadow-md border-2 border-purple-100 dark:border-purple-900/40 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-50 dark:border-purple-900/30 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-sm">
            <Sliders className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-bubble font-bold text-base sm:text-lg text-slate-800 dark:text-purple-100">
              Parámetros Técnicos del Modelo
            </h3>
            <p className="text-xs text-slate-500 dark:text-purple-300 font-sans">
              Calibra temperatura, muestreo, tope de tokens y moderación estricta de seguridad.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            onChangeField('temperature', DEFAULT_AI_AGENT_CONFIG.temperature);
            onChangeField('maxTokens', DEFAULT_AI_AGENT_CONFIG.maxTokens);
            onChangeField('topP', DEFAULT_AI_AGENT_CONFIG.topP);
            onChangeField('topK', DEFAULT_AI_AGENT_CONFIG.topK);
            onChangeField('securityFilters', DEFAULT_AI_AGENT_CONFIG.securityFilters);
          }}
          className="text-[11px] font-bubble font-bold text-purple-700 hover:text-purple-900 dark:text-purple-300 underline cursor-pointer self-start sm:self-auto flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" /> Restaurar Defaults Técnicos
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Temperatura */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/40 space-y-2">
          <div className="flex justify-between items-center font-semibold text-slate-700 dark:text-purple-200">
            <span>Temperatura</span>
            <span className="font-bold text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/60">
              {Number(config.temperature ?? 0.3).toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="0.4"
            step="0.05"
            value={config.temperature ?? 0.3}
            onChange={(e) => onChangeField('temperature', parseFloat(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0.10 (Preciso)</span>
            <span className="font-semibold text-purple-600">0.30 (Default)</span>
            <span>0.40</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-purple-300">
            0.1 a 0.4: Respuestas concretas y directas, evitando inventos o rodeos.
          </p>
        </div>

        {/* Límite de Tokens */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/40 space-y-2">
          <div className="flex justify-between items-center font-semibold text-slate-700 dark:text-purple-200">
            <span>Tope de Tokens</span>
            <span className="font-bold text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/60">
              {config.maxTokens ?? 120} tok
            </span>
          </div>
          <input
            type="range"
            min="60"
            max="120"
            step="10"
            value={config.maxTokens ?? 120}
            onChange={(e) => onChangeField('maxTokens', parseInt(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>60 (Breve)</span>
            <span className="font-semibold text-purple-600">120 (Recomendado)</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-purple-300">
            Tope estricto por respuesta (60 a 120 tokens) para forzar concisión.
          </p>
        </div>

        {/* Top-P */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/40 space-y-2">
          <div className="flex justify-between items-center font-semibold text-slate-700 dark:text-purple-200">
            <span>Top-P / Muestreo</span>
            <span className="font-bold text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/60">
              {Number(config.topP ?? 0.85).toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.0"
            step="0.05"
            value={config.topP ?? 0.85}
            onChange={(e) => onChangeField('topP', parseFloat(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0.50</span>
            <span className="font-semibold text-purple-600">0.85</span>
            <span>1.00</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-purple-300">
            Delimita el abanico de palabras probables para consistencia comercial.
          </p>
        </div>

        {/* Filtros de Seguridad */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/40 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-700 dark:text-purple-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Moderación
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.securityFilters ?? true}
                  onChange={(e) => onChangeField('securityFilters', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mt-1">
              {config.securityFilters !== false ? 'Activo (Protegido)' : 'Desactivado'}
            </p>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-purple-300">
            Filtros para bloquear jailbreak, ataques prompt, política o lenguaje ofensivo.
          </p>
        </div>
      </div>
    </div>
  );
};
