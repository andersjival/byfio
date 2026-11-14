import React from 'react';
import { ShieldCheck, Eye, EyeOff, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { AiStockDisclosureMode } from '../../../types/aiAgent';

interface AiStockPolicyCardProps {
  currentMode: AiStockDisclosureMode;
  onSelectMode: (mode: AiStockDisclosureMode) => void;
  onSave: () => void;
  isSaving: boolean;
}

export const AiStockPolicyCard: React.FC<AiStockPolicyCardProps> = ({
  currentMode,
  onSelectMode,
  onSave,
  isSaving,
}) => {
  return (
    <div className="bg-white dark:bg-[#1a1429] rounded-3xl p-5 sm:p-6 shadow-md border-2 border-purple-100 dark:border-purple-900/40 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-50 dark:border-purple-900/30 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-bubble font-bold text-base sm:text-lg text-slate-800 dark:text-purple-100">
              Política de Revelación de Stock (Clientes Web)
            </h3>
            <p className="text-xs text-slate-500 dark:text-purple-300 font-sans">
              Controla cómo responde la Estrellita cuando los clientes preguntan por productos en la web.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="self-end sm:self-auto px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 active:scale-95 text-white font-bubble font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
        >
          {isSaving ? (
            <span className="animate-spin text-xs">⏳ Guardando...</span>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Guardar Política</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Opción 1: Por Disponibilidad y Demanda */}
        <div
          onClick={() => onSelectMode('availability_only')}
          className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
            currentMode === 'availability_only'
              ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 shadow-sm'
              : 'border-slate-200 dark:border-purple-900/20 hover:border-purple-300 bg-slate-50/50 dark:bg-purple-950/10'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                <EyeOff className="w-4 h-4" />
              </span>
              <span className="font-bubble font-bold text-sm text-slate-800 dark:text-purple-100">
                Por Disponibilidad y Demanda
              </span>
            </div>
            {currentMode === 'availability_only' && (
              <span className="flex items-center gap-1 text-[11px] font-bubble font-bold text-purple-700 dark:text-purple-300 bg-white dark:bg-purple-900 px-2 py-0.5 rounded-full shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Activo
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-slate-600 dark:text-purple-200 font-sans leading-relaxed">
            La Estrellita <strong>NO</strong> revela el total de inventario ante preguntas generales ("¿cuántas tienes en tienda?"), pero si el cliente pide una cantidad específica ("¿tienes 10?"), verifica el stock real y le confirma de inmediato que sí están disponibles para entrega o SINPE. Si pide más de las que hay, le ofrece las disponibles o encargo por WhatsApp.
          </p>
          <div className="mt-2.5 p-2 rounded-xl bg-white/80 dark:bg-purple-900/40 border border-purple-100 dark:border-purple-800/40 text-[11px] text-purple-900 dark:text-purple-200 space-y-1">
            <p><strong>Ejemplo 1:</strong> — "¿Cuántas tazas tienes en inventario?" → "¡Sí, tenemos existencias disponibles! ✨ ¿Cuántas te gustaría llevarte?"</p>
            <p className="text-[10.5px] text-purple-900 dark:text-purple-200"><strong>Ejemplo 2:</strong> — "Quiero 10 tazas" (habiendo 10) → "¡Sí, totalmente! Tenemos las 10 unidades disponibles para ti a ₡6.500 c/u ✨"</p>
            <p className="text-[10.5px] text-slate-500 dark:text-purple-300 italic">— Si pide 15 y hay 10: "Por el momento tenemos 10 unidades para entrega inmediata ✨ ¿Deseas llevarte esas 10 o encargar las restantes por WhatsApp?"</p>
          </div>
        </div>

        {/* Opción 2: Stock Completo Transparente */}
        <div
          onClick={() => onSelectMode('full_stock')}
          className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
            currentMode === 'full_stock'
              ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 shadow-sm'
              : 'border-slate-200 dark:border-purple-900/20 hover:border-purple-300 bg-slate-50/50 dark:bg-purple-950/10'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300">
                <Eye className="w-4 h-4" />
              </span>
              <span className="font-bubble font-bold text-sm text-slate-800 dark:text-purple-100">
                Stock Completo Transparente
              </span>
            </div>
            {currentMode === 'full_stock' && (
              <span className="flex items-center gap-1 text-[11px] font-bubble font-bold text-purple-700 dark:text-purple-300 bg-white dark:bg-purple-900 px-2 py-0.5 rounded-full shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Activo
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-slate-600 dark:text-purple-200 font-sans leading-relaxed">
            La Estrellita dice abiertamente el número exacto total de stock disponible en tienda desde su primera respuesta, sin filtros.
          </p>
          <div className="mt-2.5 p-2 rounded-xl bg-white/80 dark:bg-purple-900/40 border border-purple-100 dark:border-purple-800/40 text-[11px] text-purple-900 dark:text-purple-200 space-y-1">
            <p><strong>Ejemplo:</strong> — "¿Hay libretas?" → "¡Sí tenemos disponible! Nos quedan 4 unidades disponibles a ₡3.500 ✨"</p>
          </div>
        </div>
      </div>
    </div>
  );
};
