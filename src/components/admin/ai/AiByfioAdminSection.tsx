import React, { useState } from 'react';
import { Bot, ArrowLeft, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { useAiAgentConfig } from '../../../hooks/useAiAgentConfig';
import { AiStockPolicyCard } from './AiStockPolicyCard';
import { AiGeneralSettingsCard } from './AiGeneralSettingsCard';
import { AiLiveTesterCard } from './AiLiveTesterCard';
import { AiMetricsOverviewCard } from './AiMetricsOverviewCard';
import { AiSystemPromptDirectivesCard } from './AiSystemPromptDirectivesCard';
import { AiTechnicalParamsCard } from './AiTechnicalParamsCard';
import { AiConversationDynamicsCard } from './AiConversationDynamicsCard';
import { AiLiveChatsCard } from './AiLiveChatsCard';

interface AiByfioAdminSectionProps {
  onBackToHub?: () => void;
  initialTab?: TabKey;
}

type TabKey = 'directivas' | 'parametros' | 'dinamica' | 'stock' | 'simulador' | 'chats-vivo' | 'metricas' | 'todo';

export const AiByfioAdminSection: React.FC<AiByfioAdminSectionProps> = ({ onBackToHub, initialTab }) => {
  const { config, saving, toastMessage, updateConfig, persistConfig, resetToRecommendedDefaults } =
    useAiAgentConfig();
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab || 'directivas');

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: 'directivas', label: '🎯 Directrices & Prompt' },
    { key: 'parametros', label: '⚙️ Parámetros Técnicos' },
    { key: 'dinamica', label: '⏱️ Dinámica WhatsApp' },
    { key: 'stock', label: '📦 Política de Stock' },
    { key: 'simulador', label: '🧪 Bot de Prueba' },
    { key: 'chats-vivo', label: '💬 Chats en Vivo' },
    { key: 'metricas', label: '📊 Rendimiento AI' },
    { key: 'todo', label: '📑 Ver Todo' },
  ];

  return (
    <div className="space-y-5 animate-fadeIn">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-purple-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 font-bubble text-xs animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Banner Principal */}
      <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-[#4C1D95] via-[#7E22CE] to-[#BE185D] text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              {onBackToHub && (
                <button
                  type="button"
                  onClick={onBackToHub}
                  className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer mr-1"
                  title="Volver al Menú"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <span className="p-2 rounded-xl bg-white/20 backdrop-blur-xs text-white">
                <Bot className="w-5 h-5" />
              </span>
              <span className="text-xs uppercase font-bubble font-bold tracking-wider text-pink-200">
                Módulo Administrativo
              </span>
            </div>
            <h1 className="font-bubble font-extrabold text-2xl sm:text-3xl text-white tracking-wide">
              AI BYFIO — Control & Calibración de la Estrellita ✨
            </h1>
            <p className="text-xs sm:text-sm text-pink-100/90 font-sans max-w-2xl">
              Configura directrices, rol, lista negra, parámetros técnicos y prueba en vivo con tu calibración activa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-xs text-xs font-bubble font-bold text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Guardado en Vivo</span>
            </div>
            <button
              type="button"
              onClick={() => persistConfig()}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-white text-purple-900 hover:bg-pink-100 font-bubble font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-60 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
              <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
            <button
              type="button"
              onClick={resetToRecommendedDefaults}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              title="Restaurar todo a defaults recomendados"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Barra de Pestañas de Navegación Rápida */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bubble font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === t.key
                ? 'bg-purple-700 text-white shadow-md'
                : 'bg-white dark:bg-[#1a1429] text-slate-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Contenido Modular por Pestañas */}
      {(activeTab === 'directivas' || activeTab === 'todo') && (
        <AiSystemPromptDirectivesCard
          config={config}
          onChangeField={(f, val) => updateConfig({ [f]: val })}
        />
      )}

      {(activeTab === 'parametros' || activeTab === 'todo') && (
        <AiTechnicalParamsCard
          config={config}
          onChangeField={(f, val) => updateConfig({ [f]: val })}
        />
      )}

      {(activeTab === 'dinamica' || activeTab === 'todo') && (
        <AiConversationDynamicsCard
          config={config}
          onChangeField={(f, val) => updateConfig({ [f]: val })}
        />
      )}

      {(activeTab === 'stock' || activeTab === 'todo') && (
        <AiStockPolicyCard
          currentMode={config.stockDisclosureMode}
          onSelectMode={(mode) => {
            updateConfig({ stockDisclosureMode: mode });
            persistConfig({ stockDisclosureMode: mode });
          }}
          onSave={() => persistConfig()}
          isSaving={saving}
        />
      )}

      {(activeTab === 'simulador' || activeTab === 'todo') && (
        <AiLiveTesterCard
          currentMode={config.stockDisclosureMode}
          config={config}
        />
      )}

      {(activeTab === 'directivas' || activeTab === 'todo') && (
        <AiGeneralSettingsCard
          config={config}
          onChangeField={(f, val) => updateConfig({ [f]: val })}
          onSave={() => persistConfig()}
          isSaving={saving}
        />
      )}

      {(activeTab === 'metricas' || activeTab === 'todo') && <AiMetricsOverviewCard />}

      {(activeTab === 'chats-vivo' || activeTab === 'todo') && (
        <AiLiveChatsCard onBackToHub={onBackToHub} />
      )}
    </div>
  );
};

export default AiByfioAdminSection;
