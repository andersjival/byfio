import React, { useState } from 'react';
import {
  QrCode, Receipt, Boxes, AlertTriangle, DollarSign, Landmark,
  GraduationCap, Tag, Users, BarChart3, BookOpen, ShoppingBag,
  CheckCircle2, XCircle, ChevronDown, ChevronUp, Layers
} from 'lucide-react';
import { SuperadminModuleConfig } from '../../types';

interface SuperadminModuleCardProps {
  module: SuperadminModuleConfig;
  onToggleModule: (moduleId: string) => void;
  onToggleFeature: (moduleId: string, featureId: string) => void;
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
    default: return Layers;
  }
};

export const SuperadminModuleCard: React.FC<SuperadminModuleCardProps> = ({
  module,
  onToggleModule,
  onToggleFeature,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const Icon = getModuleIcon(module.iconName);

  const activeFeaturesCount = module.features.filter((f) => f.enabled).length;

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        module.enabled
          ? 'bg-white border-purple-200 shadow-[0_4px_20px_rgba(147,51,234,0.06)] hover:border-purple-300'
          : 'bg-slate-50/80 border-slate-200 opacity-80'
      }`}
    >
      {/* Cabecera del Módulo con Interruptor Maestro */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-colors ${
              module.enabled
                ? 'bg-gradient-to-tr from-purple-700 to-pink-600 text-white'
                : 'bg-slate-200 text-slate-500'
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-bubble font-bold text-sm sm:text-base text-fio-900 leading-snug">
                {module.name}
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
                {module.category}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans leading-relaxed line-clamp-2">
              {module.description}
            </p>
          </div>
        </div>

        {/* Master Toggle & Estado */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                module.enabled
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {module.enabled ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Visible en Admin</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Oculto en Admin</span>
                </>
              )}
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={module.enabled}
              onChange={() => onToggleModule(module.id)}
              className="sr-only peer"
            />
            <div className="w-12 h-6.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-pink-600 shadow-inner"></div>
          </label>
        </div>
      </div>

      {/* Barra de Funcionalidades Hijas / Sub-features */}
      <div className="px-4 sm:px-5 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-fio-pink transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span>Funcionalidades internas ({activeFeaturesCount}/{module.features.length} activas)</span>
        </button>

        <span className="text-[11px] text-slate-400">
          ID: <code className="font-mono text-purple-700">{module.id}</code>
        </span>
      </div>

      {/* Lista Desplegable de Checkboxes por Funcionalidad */}
      {isExpanded && (
        <div className="p-4 sm:p-5 pt-3 bg-white/60 space-y-2.5 border-t border-slate-100/80">
          {module.features.map((feature) => (
            <label
              key={feature.id}
              className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                !module.enabled
                  ? 'bg-slate-100/50 border-slate-200/60 opacity-60 pointer-events-none'
                  : feature.enabled
                  ? 'bg-purple-50/30 border-purple-100 hover:border-purple-200'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="checkbox"
                disabled={!module.enabled}
                checked={feature.enabled && module.enabled}
                onChange={() => onToggleFeature(module.id, feature.id)}
                className="mt-0.5 w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 cursor-pointer accent-purple-600"
              />
              <div className="min-w-0">
                <span className={`text-xs font-bold block ${feature.enabled && module.enabled ? 'text-slate-800' : 'text-slate-500 line-through'}`}>
                  {feature.name}
                </span>
                <span className="text-[11px] text-slate-400 font-sans leading-tight block mt-0.5">
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
