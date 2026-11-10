import React, { useState } from 'react';
import {
  QrCode, Receipt, Boxes, AlertTriangle, DollarSign, Landmark,
  GraduationCap, Tag, Users, BarChart3, BookOpen, ShoppingBag,
  CheckCircle2, XCircle, ChevronDown, ChevronUp, Layers, Calendar, Truck,
  PowerOff, CheckCheck, EyeOff, Sparkles
} from 'lucide-react';
import { SuperadminModuleConfig } from '../../types';

export interface SuperadminModuleCardProps {
  module: SuperadminModuleConfig;
  onToggleModule: (moduleId: string) => void;
  onToggleFeature: (moduleId: string, featureId: string) => void;
  onDeactivateComplete?: (moduleId: string) => void;
  onActivateComplete?: (moduleId: string) => void;
}

const getModuleIcon = (iconName: string) => {
  switch (iconName) {
    case 'QrCode': return QrCode;
    case 'Receipt': return Receipt;
    case 'Boxes': return Boxes;
    case 'AlertTriangle': return AlertTriangle;
    case 'DollarSign': return DollarSign;
    case 'Landmark': return Landmark;
    case 'GraduationCap': return GraduationCap;
    case 'Tag': return Tag;
    case 'Users': return Users;
    case 'BarChart3': return BarChart3;
    case 'BookOpen': return BookOpen;
    case 'ShoppingBag': return ShoppingBag;
    case 'Calendar': return Calendar;
    case 'Truck': return Truck;
    default: return Layers;
  }
};

export const SuperadminModuleCard: React.FC<SuperadminModuleCardProps> = ({
  module,
  onToggleModule,
  onToggleFeature,
  onDeactivateComplete,
  onActivateComplete,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const Icon = getModuleIcon(module.iconName);

  const activeFeaturesCount = module.features.filter((f) => f.enabled).length;
  const isModuleCompletelyOff = !module.enabled && activeFeaturesCount === 0;
  const isModuleHiddenWithFeaturesOn = !module.enabled && activeFeaturesCount > 0;

  return (
    <div
      className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
        module.enabled
          ? 'bg-white border-purple-200 shadow-[0_4px_20px_rgba(147,51,234,0.06)] hover:border-purple-300'
          : isModuleHiddenWithFeaturesOn
          ? 'bg-amber-50/50 border-amber-300 shadow-xs'
          : 'bg-slate-50/90 border-slate-200 opacity-75'
      }`}
    >
      {/* Cabecera Principal del Módulo */}
      <div className="p-4 sm:p-5 flex flex-col gap-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-colors ${
                module.enabled
                  ? 'bg-gradient-to-tr from-purple-700 to-pink-600 text-white'
                  : isModuleHiddenWithFeaturesOn
                  ? 'bg-gradient-to-tr from-amber-600 to-purple-700 text-white'
                  : 'bg-slate-300 text-slate-600'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-bubble font-bold text-sm sm:text-base text-fio-900 leading-snug">
                  {module.name}
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100/70 text-purple-800 border border-purple-200/60 font-sans">
                  {module.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans leading-relaxed line-clamp-2">
                {module.description}
              </p>
            </div>
          </div>

          {/* Badge de Estado del Módulo */}
          <div className="shrink-0 text-right">
            {module.enabled ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bubble font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Visible en Admin</span>
              </span>
            ) : isModuleHiddenWithFeaturesOn ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bubble font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                <EyeOff className="w-3.5 h-3.5 text-amber-700" />
                <span>Nombre Oculto</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bubble font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Desactivado por Completo</span>
              </span>
            )}
          </div>
        </div>

        {/* Barra de Acciones: Check Ocultar Nombre + Botón Desactivar Todo el Módulo */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-200/70 bg-white/60 p-2.5 rounded-2xl">
          {/* Checkbox / Interruptor para "Ocultar el Nombre" */}
          <label
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bubble font-bold transition-all cursor-pointer select-none ${
              !module.enabled
                ? 'bg-amber-100 text-amber-950 border-amber-300 shadow-2xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
            title="Al marcar este check, el módulo y su nombre desaparecen de la vista del panel admin, pero las funcionalidades marcadas con check abajo siguen funcionando."
          >
            <input
              type="checkbox"
              checked={!module.enabled}
              onChange={() => onToggleModule(module.id)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer accent-amber-600"
            />
            <EyeOff className="w-3.5 h-3.5 text-amber-800" />
            <span>Ocultar el nombre en Admin</span>
          </label>

          <div className="flex items-center gap-1.5 ml-auto">
            {/* Botón para Desactivar por Completo Todo el Módulo */}
            <button
              type="button"
              onClick={() => onDeactivateComplete?.(module.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bubble font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 transition-all active:scale-95 cursor-pointer shadow-2xs"
              title="Apaga todo el módulo por completo: desmarca todas las funcionalidades y lo oculta del panel admin"
            >
              <PowerOff className="w-3.5 h-3.5 text-rose-600" />
              <span>Desactivar Todo el Módulo</span>
            </button>

            {/* Botón para Activar Todo el Módulo */}
            {isModuleCompletelyOff && (
              <button
                type="button"
                onClick={() => onActivateComplete?.(module.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bubble font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 transition-all active:scale-95 cursor-pointer shadow-2xs"
                title="Activa el módulo y marca todas sus funcionalidades"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Activar Todo</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Barra de Funcionalidades Hijas / Sub-features */}
      <div className="px-4 sm:px-5 py-2.5 bg-slate-50/90 border-t border-slate-200/80 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 text-xs font-bubble font-bold text-slate-700 hover:text-fio-pink transition-colors cursor-pointer"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span>
            Funcionalidades internas ({activeFeaturesCount}/{module.features.length} activas)
          </span>
          {!module.enabled && activeFeaturesCount > 0 && (
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full ml-1">
              ⚡ Operando en segundo plano
            </span>
          )}
        </button>

        <span className="text-[11px] text-slate-400 font-mono">
          ID: <code className="text-purple-700">{module.id}</code>
        </span>
      </div>

      {/* Lista Desplegable de Checkboxes por Funcionalidad */}
      {isExpanded && (
        <div className="p-4 sm:p-5 pt-3 bg-white/70 space-y-2 border-t border-slate-100">
          <p className="text-[11px] text-slate-500 font-sans mb-2">
            {!module.enabled
              ? 'El nombre del módulo está oculto en el panel admin. Sin embargo, las funcionalidades que mantengas marcadas con check abajo seguirán operando activamente en la tienda y el sistema.'
              : 'Marca o desmarca cada funcionalidad específica para habilitarla o bloquearla en el sistema.'}
          </p>

          {module.features.map((feature) => (
            <label
              key={feature.id}
              className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                feature.enabled
                  ? !module.enabled
                    ? 'bg-amber-50/60 border-amber-300/80 hover:border-amber-400 shadow-2xs'
                    : 'bg-purple-50/40 border-purple-200 hover:border-purple-300 shadow-2xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-400'
              }`}
            >
              <input
                type="checkbox"
                checked={feature.enabled}
                onChange={() => onToggleFeature(module.id, feature.id)}
                className="mt-0.5 w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 cursor-pointer accent-purple-600"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-bubble font-bold block ${
                      feature.enabled ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {feature.name}
                  </span>
                  {feature.enabled && !module.enabled && (
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
                      Activa sin nombre
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 font-sans leading-tight block mt-0.5">
                  {feature.description}
                </span>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
