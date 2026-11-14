import React, { useState, useEffect } from 'react';
import { Activity, Zap, MessageCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { aiAgentService } from '../../../services/aiAgentService';

export const AiMetricsOverviewCard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

  const totalInteractions = metrics?.totals?.totalConversations ?? metrics?.total_conversations ?? 0;
  const neuronsConsumed = metrics?.totals?.totalNeurons ?? metrics?.total_neurons ?? 0;
  const chatOpened = metrics?.totals?.totalChatsOpened ?? metrics?.chat_opened_count ?? 0;

  return (
    <div className="bg-white dark:bg-[#1a1429] rounded-3xl p-5 sm:p-6 shadow-md border-2 border-purple-100 dark:border-purple-900/40 space-y-4">
      <div className="flex items-center justify-between border-b border-purple-50 dark:border-purple-900/30 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-sm">
            <Activity className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-bubble font-bold text-base sm:text-lg text-slate-800 dark:text-purple-100">
              Rendimiento & Métricas Workers AI
            </h3>
            <p className="text-xs text-slate-500 dark:text-purple-300 font-sans">
              Consumo de inferencia y actividad del asistente en Cloudflare.
            </p>
          </div>
        </div>
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
          <span className="text-[11px] font-sans text-slate-500 dark:text-amber-300 block">Neuronas Workers AI</span>
          <span className="font-bubble font-extrabold text-xl text-amber-600 dark:text-amber-300 mt-1 block">
            {Number(neuronsConsumed).toFixed(1)}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 text-center flex flex-col items-center justify-center">
          <span className="text-[11px] font-sans text-slate-500 dark:text-emerald-300 block">Estado del Motor</span>
          <span className="flex items-center gap-1 font-bubble font-bold text-xs text-emerald-700 dark:text-emerald-300 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Llama 3.3 70B
          </span>
        </div>
      </div>
    </div>
  );
};
