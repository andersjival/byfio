import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw, CheckCircle2, Lock } from 'lucide-react';
import { aiAgentService } from '../../../services/aiAgentService';
import { AiSuperadminModelsModal } from './AiSuperadminModelsModal';

type TimeFilter = 'hour' | 'day' | 'week' | 'month';

export const AiMetricsOverviewCard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('day');
  const [isModelsModalOpen, setIsModelsModalOpen] = useState(false);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await aiAgentService.fetchMetrics();
      if (data) setMetrics(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  // Calcular métricas según el filtro de tiempo seleccionado
  const periodData = metrics?.periods?.[timeFilter] || {
    chatsOpened: timeFilter === 'hour' ? 0 : (metrics?.totals?.totalChatsOpened ?? metrics?.summary?.totalChatOpens ?? 0),
    conversations: timeFilter === 'hour' ? 0 : (metrics?.totals?.totalConversations ?? metrics?.summary?.totalMessagesAnswered ?? 0),
    neurons: timeFilter === 'hour' ? 0 : (metrics?.totals?.totalNeurons ?? metrics?.summary?.totalNeuronsToday ?? 0),
  };

  const chatOpened = periodData.chatsOpened;
  const totalInteractions = periodData.conversations;
  const neuronsConsumed = periodData.neurons;

  const filterLabels: Array<{ id: TimeFilter; label: string }> = [
    { id: 'hour', label: 'Hora' },
    { id: 'day', label: 'Día' },
    { id: 'week', label: 'Semana' },
    { id: 'month', label: 'Mes' },
  ];

  return (
    <div className="bg-white dark:bg-[#1a1429] rounded-3xl p-5 sm:p-6 shadow-md border-2 border-purple-100 dark:border-purple-900/40 space-y-4">
      {/* Header con Título (sin Workers AI) y Controles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-50 dark:border-purple-900/30 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-sm">
            <Activity className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-bubble font-bold text-base sm:text-lg text-slate-800 dark:text-purple-100">
              Rendimiento &amp; Métricas AI
            </h3>
            <p className="text-xs text-slate-500 dark:text-purple-300 font-sans">
              Consumo de inferencia y actividad del asistente en Cloudflare.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
          {/* Filtros por Hora, Día, Semana, Mes */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-purple-950/40 rounded-xl border border-slate-200/60 dark:border-purple-900/40">
            {filterLabels.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setTimeFilter(f.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bubble font-bold transition-all cursor-pointer ${
                  timeFilter === f.id
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-slate-600 dark:text-purple-300 hover:text-purple-900 dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Botón Ver Modelos con Password de Superadmin */}
          <button
            type="button"
            onClick={() => setIsModelsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200 text-xs font-bubble font-bold border border-purple-200/70 dark:border-purple-800/40 transition-colors cursor-pointer"
            title="Solo Superadmin con contraseña"
          >
            <Lock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Ver Modelos</span>
          </button>

          <button
            type="button"
            onClick={loadMetrics}
            disabled={loading}
            className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 transition-colors cursor-pointer"
            title="Actualizar métricas"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grid de Métricas Filtradas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/30 text-center">
          <span className="text-[11px] font-sans text-slate-500 dark:text-purple-300 block">Chats Abiertos</span>
          <span className="font-bubble font-extrabold text-xl text-purple-800 dark:text-purple-200 mt-1 block">
            {chatOpened}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-pink-50/60 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/30 text-center">
          <span className="text-[11px] font-sans text-slate-500 dark:text-pink-300 block">Conversaciones</span>
          <span className="font-bubble font-extrabold text-xl text-pink-700 dark:text-pink-300 mt-1 block">
            {totalInteractions}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/30 text-center">
          <span className="text-[11px] font-sans text-slate-500 dark:text-amber-300 block">Neuronas  AI</span>
          <span className="font-bubble font-extrabold text-xl text-amber-600 dark:text-amber-300 mt-1 block">
            {Number(neuronsConsumed).toFixed(1)}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 text-center flex flex-col items-center justify-center">
          <span className="text-[11px] font-sans text-slate-500 dark:text-emerald-300 block">Estado del Motor</span>
          <span className="flex items-center justify-center gap-1 font-bubble font-bold text-xs text-emerald-700 dark:text-emerald-300 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ACTIVO
          </span>
        </div>
      </div>

      {/* Modal Seguro para Superadmin */}
      <AiSuperadminModelsModal
        isOpen={isModelsModalOpen}
        onClose={() => setIsModelsModalOpen(false)}
      />
    </div>
  );
};
