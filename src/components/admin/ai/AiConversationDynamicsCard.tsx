import React from 'react';
import { Clock, RefreshCw, MessageSquareDashed } from 'lucide-react';
import { AiAgentConfig, DEFAULT_AI_AGENT_CONFIG } from '../../../types/aiAgent';

interface AiConversationDynamicsCardProps {
  config: AiAgentConfig;
  onChangeField: (field: keyof AiAgentConfig, val: any) => void;
}

export const AiConversationDynamicsCard: React.FC<AiConversationDynamicsCardProps> = ({
  config,
  onChangeField,
}) => {
  return (
    <div className="bg-white dark:bg-[#1a1429] rounded-3xl p-5 sm:p-6 shadow-md border-2 border-purple-100 dark:border-purple-900/40 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-50 dark:border-purple-900/30 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-sm">
            <Clock className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-bubble font-bold text-base sm:text-lg text-slate-800 dark:text-purple-100">
              Dinámica de Conversación & Retrasos WhatsApp
            </h3>
            <p className="text-xs text-slate-500 dark:text-purple-300 font-sans">
              Configura fragmentación (chunking), simulación de tipeo dinámico y pausas humanas.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            onChangeField('delayType', DEFAULT_AI_AGENT_CONFIG.delayType);
            onChangeField('responseChunkSeparator', DEFAULT_AI_AGENT_CONFIG.responseChunkSeparator);
            onChangeField('maxResponseChunks', DEFAULT_AI_AGENT_CONFIG.maxResponseChunks);
            onChangeField('initialDelayMs', DEFAULT_AI_AGENT_CONFIG.initialDelayMs);
            onChangeField('msPerChar', DEFAULT_AI_AGENT_CONFIG.msPerChar);
          }}
          className="text-[11px] font-bubble font-bold text-purple-700 hover:text-purple-900 dark:text-purple-300 underline cursor-pointer self-start sm:self-auto flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" /> Restaurar Dinámica Recomendada
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
        {/* Tipo de Retraso */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#201833] border border-purple-100 dark:border-purple-900/40 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-700 dark:text-purple-200">Tipo de Retraso</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold">
              Default: Dinámico
            </span>
          </div>
          <select
            value={config.delayType || 'dynamic'}
            onChange={(e) => onChangeField('delayType', e.target.value)}
            className="w-full px-2.5 py-2 rounded-xl border border-purple-200 dark:border-purple-900/40 bg-slate-50 dark:bg-purple-950/30 text-xs font-sans text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            <option value="dynamic">Dinámico (Recomendado - 40ms/carácter)</option>
            <option value="natural">Natural (Pausas variables humanas)</option>
            <option value="fixed">Fijo uniforme (2s por mensaje)</option>
          </select>
          <p className="text-[10px] text-slate-400">
            Calcula el tiempo de escritura según el tamaño del texto para simular ritmo humano real.
          </p>
        </div>

        {/* Separador de Respuestas (Chunking) */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#201833] border border-purple-100 dark:border-purple-900/40 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-700 dark:text-purple-200 flex items-center gap-1">
              <MessageSquareDashed className="w-3.5 h-3.5 text-purple-600" /> Separador
            </span>
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
              className="flex-1 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-900/40 bg-slate-50 dark:bg-purple-950/30 text-xs font-mono font-bold text-center text-purple-700 dark:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={() => onChangeField('responseChunkSeparator', '|||')}
              className="text-[10px] px-2.5 py-1 rounded-xl border border-purple-200 dark:border-purple-800 hover:bg-purple-50 text-purple-700 transition-colors cursor-pointer"
            >
              Reset |||
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            Divide la respuesta para enviar cada fragmento como mensaje independiente de WhatsApp.
          </p>
        </div>

        {/* Máximo de Fragmentos */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#201833] border border-purple-100 dark:border-purple-900/40 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-700 dark:text-purple-200">Máx. Mensajes Divididos</span>
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
            <span>1 (Bloque único)</span>
            <span className="font-semibold text-purple-600">3 (Recomendado)</span>
            <span>5 (Máx)</span>
          </div>
          <p className="text-[10px] text-slate-400">Tope de globos de texto independientes por turno.</p>
        </div>

        {/* Retraso Inicial */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#201833] border border-purple-100 dark:border-purple-900/40 space-y-2">
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
          <p className="text-[10px] text-slate-400">
            Espera de 2 a 4 segundos antes del primer saludo, simulando tomar el teléfono.
          </p>
        </div>

        {/* Velocidad de Tipeo Humano */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#201833] border border-purple-100 dark:border-purple-900/40 space-y-2 sm:col-span-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-700 dark:text-purple-200">Velocidad de Escritura (Typing)</span>
            <span className="font-bold text-purple-700 dark:text-purple-300">{config.msPerChar ?? 40} ms / carácter</span>
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
            <span>20ms (Ultrarrápido)</span>
            <span className="font-semibold text-purple-600">40ms (Recomendado: 30 a 50ms)</span>
            <span>65ms (Pausado)</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Simula typing... en WhatsApp coincidiendo con el ritmo de escritura de una persona real.
          </p>
        </div>
      </div>
    </div>
  );
};
