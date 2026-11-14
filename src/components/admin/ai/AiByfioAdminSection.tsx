import React from 'react';
import { Bot, ArrowLeft, Sparkles } from 'lucide-react';
import { useAiAgentConfig } from '../../../hooks/useAiAgentConfig';
import { AiStockPolicyCard } from './AiStockPolicyCard';
import { AiGeneralSettingsCard } from './AiGeneralSettingsCard';
import { AiLiveTesterCard } from './AiLiveTesterCard';
import { AiMetricsOverviewCard } from './AiMetricsOverviewCard';

interface AiByfioAdminSectionProps {
  onBackToHub?: () => void;
}

export const AiByfioAdminSection: React.FC<AiByfioAdminSectionProps> = ({ onBackToHub }) => {
  const { config, saving, toastMessage, updateConfig, persistConfig } = useAiAgentConfig();

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Toast Notification */}
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
              AI BYFIO — Control de la Estrellita ✨
            </h1>
            <p className="text-xs sm:text-sm text-pink-100/90 font-sans max-w-2xl">
              Configura el comportamiento del agente de inteligencia artificial, política estricta de stock y respuestas al cliente.
            </p>
          </div>
        </div>
      </div>

      {/* Tarjeta de Política de Stock (Requerimiento Central) */}
      <AiStockPolicyCard
        currentMode={config.stockDisclosureMode}
        onSelectMode={(mode) => {
          updateConfig({ stockDisclosureMode: mode });
          persistConfig({ stockDisclosureMode: mode });
        }}
        onSave={() => persistConfig()}
        isSaving={saving}
      />

      {/* Tarjeta de Simulador en Vivo */}
      <AiLiveTesterCard currentMode={config.stockDisclosureMode} />

      {/* Tarjeta de Personalización General */}
      <AiGeneralSettingsCard
        config={config}
        onChangeField={(field, val) => updateConfig({ [field]: val })}
        onSave={() => persistConfig()}
        isSaving={saving}
      />

      {/* Métricas de Inferencia */}
      <AiMetricsOverviewCard />
    </div>
  );
};

export default AiByfioAdminSection;
