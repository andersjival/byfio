import React from 'react';
import { Settings, Sparkles, MessageSquare, Power, FileText } from 'lucide-react';
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
              Personalización General & Saludo de Bienvenida
            </h3>
            <p className="text-xs text-slate-500 dark:text-purple-300 font-sans">
              Activa o pausa a la Estrellita en la tienda web y personaliza el primer mensaje que recibe el cliente.
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
            <span
              className={`p-1.5 rounded-lg ${
                config.isEnabled
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
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

        {/* Instrucciones Especiales del Admin */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bubble font-bold text-slate-700 dark:text-purple-200">
            <FileText className="w-3.5 h-3.5 text-pink-600" />
            <span>Instrucciones Especiales Temporales (Inyectadas al Prompt)</span>
          </label>
          <textarea
            rows={2}
            value={config.customInstructions || ''}
            onChange={(e) => onChangeField('customInstructions', e.target.value)}
            placeholder="Ej: Estamos en semana de talleres. Si preguntan por agendas, recuérdales que incluye sticker de regalo."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-purple-900/40 bg-white dark:bg-purple-950/20 text-xs font-sans text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>
      </div>
    </div>
  );
};
