import React from 'react';
import { Settings, Sparkles, MessageSquare, Power, FileText, Sliders, Clock, ShieldCheck } from 'lucide-react';
import { AiAgentConfig } from '../../../types/aiAgent';

interface AiGeneralSettingsCardProps {
  config: AiAgentConfig;
  onChangeField: (field: keyof AiAgentConfig, val: any) => void;
  onSave: () => void;
  isSaving: boolean;
}

export const AiGeneralSettingsCard: React.FC<AiGeneralSettingsCardProps> = ({
  config,
  onChangeField,
  onSave,
  isSaving,
}) => {
  return (
    <div className="bg-white dark:bg-[#1a1429] rounded-3xl p-5 sm:p-6 shadow-md border-2 border-purple-100 dark:border-purple-900/40 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-50 dark:border-purple-900/30 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white shadow-sm">
            <Settings className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-bubble font-bold text-base sm:text-lg text-slate-800 dark:text-purple-100">
              Calibración & Reglas Humanizadas del Agente
            </h3>
            <p className="text-xs text-slate-500 dark:text-purple-300 font-sans">
              Ajusta temperatura, tope de tokens, simulación de tipeo WhatsApp y filtros de seguridad.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="self-end sm:self-auto px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 active:scale-95 text-white font-bubble font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
        >
          {isSaving ? <span className="animate-spin text-xs">⏳</span> : <Sparkles className="w-3.5 h-3.5 text-pink-200" />}
          <span>Guardar Cambios</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Toggle: Estado del Asistente */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/30">
          <div className="flex items-center gap-2.5">
            <span className={`p-1.5 rounded-lg ${config.isEnabled ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-600'}`}>
              <Power className="w-4 h-4" />
            </span>
            <div>
              <p className="font-bubble font-bold text-xs sm:text-sm text-slate-800 dark:text-purple-100">
                Agente Estrellita Activo en la Web
              </p>
              <p className="text-[11px] text-slate-500 dark:text-purple-300 font-sans">
                Permite a los visitantes interactuar con la asistente en tiempo real.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.isEnabled ?? true}
              onChange={(e) => onChangeField('isEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* 1. Parámetros Técnicos del Modelo */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/60 dark:border-purple-900/40 space-y-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h4 className="font-bubble font-bold text-xs text-slate-800 dark:text-purple-200">
              1. Parámetros Técnicos del Modelo (Calibración Estricta)
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Temperatura */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-600 dark:text-purple-300">
                <span>Temperatura</span>
                <span className="font-bold text-purple-700 dark:text-purple-300">{Number(config.temperature ?? 0.3).toFixed(2)}</span>
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
              <p className="text-[10px] text-slate-400">0.1 a 0.4: Respuestas directas sin inventos ni rodeos.</p>
            </div>

            {/* Max Output Tokens */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-600 dark:text-purple-300">
                <span>Límite de Tokens</span>
                <span className="font-bold text-purple-700 dark:text-purple-300">{config.maxTokens ?? 120} tok</span>
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
              <p className="text-[10px] text-slate-400">60 a 120: Fuerza concisión por cada mensaje.</p>
            </div>

            {/* Top-P */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-600 dark:text-purple-300">
                <span>Top-P / Muestreo</span>
                <span className="font-bold text-purple-700 dark:text-purple-300">{Number(config.topP ?? 0.85).toFixed(2)}</span>
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
              <p className="text-[10px] text-slate-400">Delimita palabras para consistencia comercial.</p>
            </div>
          </div>
        </div>

        {/* 2. Dinámica de Conversación y Retrasos (Simulación Humana) */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/60 dark:border-purple-900/40 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-fio-pink dark:text-pink-400" />
              <h4 className="font-bubble font-bold text-xs text-slate-800 dark:text-purple-200">
                2. Dinámica de Conversación & Retrasos WhatsApp
              </h4>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enableHumanSimulation ?? true}
                onChange={(e) => onChangeField('enableHumanSimulation', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-600"></div>
            </label>
          </div>

          {/* Fila A: Tipo de Retraso & Separador de Respuestas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Tipo de Retraso */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#201833] border border-slate-200/70 dark:border-purple-900/40 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-700 dark:text-purple-200">Tipo de Retraso</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold">
                  Default: Dinámico
                </span>
              </div>
              <select
                value={config.delayType || 'dynamic'}
                onChange={(e) => onChangeField('delayType', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-purple-900/40 bg-slate-50 dark:bg-purple-950/30 text-xs font-sans text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="dynamic">Dinámico (Recomendado - 40ms/carácter)</option>
                <option value="natural">Natural (Con variación y pausas humanas)</option>
                <option value="fixed">Fijo uniforme (2s por mensaje)</option>
              </select>
              <p className="text-[10px] text-slate-400">Calcula el tiempo de escritura según el tamaño del texto.</p>
            </div>

            {/* Separador de Respuestas & Cantidad */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#201833] border border-slate-200/70 dark:border-purple-900/40 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-700 dark:text-purple-200">Separador de Respuestas</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold">
                  Default: |||
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={config.responseChunkSeparator ?? '|||'}
                  onChange={(e) => onChangeField('responseChunkSeparator', e.target.value)}
                  placeholder="|||"
                  className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-purple-900/40 bg-slate-50 dark:bg-purple-950/30 text-xs font-mono font-bold text-center text-purple-700 dark:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={() => onChangeField('responseChunkSeparator', '|||')}
                  className="text-[10px] px-2 py-1 rounded-lg border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/40 text-purple-600 dark:text-purple-300 transition-colors"
                >
                  Restaurar |||
                </button>
              </div>
              <p className="text-[10px] text-slate-400">Carácter usado para dividir el mensaje en fragmentos independientes.</p>
            </div>
          </div>

          {/* Fila B: Retraso Inicial, Velocidad de Tipeo & Cantidad Máxima */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Cantidad de Fragmentos */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#201833] border border-slate-200/70 dark:border-purple-900/40 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-700 dark:text-purple-200">Máx. Separaciones</span>
                <span className="font-bold text-purple-700 dark:text-purple-300">{config.maxResponseChunks ?? 3} msgs</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={config.maxResponseChunks ?? 3}
                onChange={(e) => onChangeField('maxResponseChunks', parseInt(e.target.value))}
                className="w-full accent-pink-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 (Único)</span>
                <span className="font-semibold text-purple-600">3 (Recomendado)</span>
                <span>5 (Máx)</span>
              </div>
            </div>

            {/* Retraso Inicial */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#201833] border border-slate-200/70 dark:border-purple-900/40 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-700 dark:text-purple-200">Retraso Inicial</span>
                <span className="font-bold text-purple-700 dark:text-purple-300">
                  {(Number(config.initialDelayMs ?? 2500) / 1000).toFixed(1)}s
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="4500"
                step="250"
                value={config.initialDelayMs ?? 2500}
                onChange={(e) => onChangeField('initialDelayMs', parseInt(e.target.value))}
                className="w-full accent-pink-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1.0s (Rápido)</span>
                <span className="font-semibold text-purple-600">2.5s (Recomendado)</span>
                <span>4.5s</span>
              </div>
            </div>

            {/* Velocidad de Tipeo Humano */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#201833] border border-slate-200/70 dark:border-purple-900/40 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-700 dark:text-purple-200">Velocidad Tipeo</span>
                <span className="font-bold text-purple-700 dark:text-purple-300">{config.msPerChar ?? 40} ms/char</span>
              </div>
              <input
                type="range"
                min="20"
                max="65"
                step="5"
                value={config.msPerChar ?? 40}
                onChange={(e) => onChangeField('msPerChar', parseInt(e.target.value))}
                className="w-full accent-pink-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>20ms (Veloz)</span>
                <span className="font-semibold text-purple-600">40ms (Recomendado)</span>
                <span>65ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Reglas de Comportamiento Activas (Lista Negra & Escape) - Tema Púrpura/Rosa ByFio */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50/70 to-purple-50 dark:from-purple-950/40 dark:via-[#241738]/50 dark:to-purple-950/40 border-2 border-purple-200/80 dark:border-purple-800/60 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-pink-100 dark:bg-pink-950/60 text-fio-pink dark:text-pink-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h4 className="font-bubble font-bold text-xs sm:text-sm text-purple-950 dark:text-purple-100">
              3. Reglas de Comportamiento Activas (Lista Negra & Protocolo de Escape)
            </h4>
          </div>
          <ul className="text-xs text-slate-700 dark:text-purple-200 space-y-1.5 list-disc pl-5 font-sans">
            <li>
              <strong className="text-purple-800 dark:text-pink-300">Lista Negra Estricta:</strong> Prohibido decir que es una IA, un bot o modelo de lenguaje; prohibido prometer descuentos inexistentes; prohibido hablar de competidores y prohibido usar frases de relleno corporativas clichés.
            </li>
            <li>
              <strong className="text-purple-800 dark:text-pink-300">Protocolo de Escape Humano:</strong> Si el bot no tiene el dato exacto o si el cliente solicita una persona real, se deriva de inmediato con Fiorella al WhatsApp oficial 6400-4640 de forma natural.
            </li>
          </ul>
        </div>

        {/* Saludo de Bienvenida */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bubble font-bold text-slate-700 dark:text-purple-200">
            <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
            <span>Mensaje de Saludo Inicial (Estrellita)</span>
          </label>
          <input
            type="text"
            value={config.welcomeMessage || ''}
            onChange={(e) => onChangeField('welcomeMessage', e.target.value)}
            placeholder="¡Hola! ✨🌸 Soy la Estrellita de by.fio..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-purple-900/40 bg-white dark:bg-purple-950/20 text-xs font-sans text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Instrucciones Adicionales del Admin */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bubble font-bold text-slate-700 dark:text-purple-200">
            <FileText className="w-3.5 h-3.5 text-pink-600" />
            <span>Instrucciones Especiales Temporales (Inyectadas al Prompt)</span>
          </label>
          <textarea
            rows={2}
            value={config.customInstructions || ''}
            onChange={(e) => onChangeField('customInstructions', e.target.value)}
            placeholder="Ej: Estamos en semana de talleres de encuadernación. Si preguntan por agendas, recuérdales que incluye sticker de regalo."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-purple-900/40 bg-white dark:bg-purple-950/20 text-xs font-sans text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>
      </div>
    </div>
  );
};
