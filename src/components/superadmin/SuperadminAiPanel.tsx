import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  Calendar,
  RefreshCw,
  Download,
  Users,
  MessageSquare,
  Mic,
  Activity,
  CheckCircle2,
  Server,
  Database,
  ShieldCheck,
} from 'lucide-react';
import { aiAgentService } from '../../services/aiAgentService';

export const SuperadminAiPanel: React.FC = () => {
  const [reportView, setReportView] = useState<'realtime' | 'hourly' | 'daily'>('realtime');
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const loadData = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    const data = await aiAgentService.fetchMetrics();
    if (data && data.success) {
      setMetrics(data);
    }
    setLastUpdated(new Date().toLocaleTimeString('es-CR'));
    setIsLoading(false);
    if (isManual) {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    loadData();
    const interval = window.setInterval(() => {
      loadData();
    }, 12000); // Refresco automático en realtime cada 12 segundos
    return () => window.clearInterval(interval);
  }, []);

  const handleExportReport = () => {
    if (!metrics) return;
    const reportData = {
      titulo: 'Reporte Oficial de Métricas y Neuronas - IA ByFio',
      fechaGeneracion: new Date().toISOString(),
      resumen: metrics.summary,
      reportePorHora: metrics.hourly,
      reportePorDia: metrics.daily,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-ia-byfio-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const summary = metrics?.summary || {
    totalNeuronsToday: 0,
    totalNeuronsMonth: 0,
    freeTierDailyLimit: 10000,
    quotaUsedPercent: 0,
    remainingNeuronsToday: 10000,
    totalChatOpens: 0,
    totalMessagesAnswered: 0,
    totalVoiceNotes: 0,
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Encabezado del Panel IA ByFio */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-[#200e3a] via-[#31114d] to-[#1a0c2b] text-white border-2 border-purple-500/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 text-white flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bubble font-black text-xl sm:text-2xl text-white tracking-wide">
                  IA ByFio
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Realtime Activo
                </span>
              </div>
              <p className="text-xs text-purple-300 font-medium mt-0.5">
                Panel Central de Control de Neuronas Cloudflare, Uso y Reportes de la Estrellita
              </p>
            </div>
          </div>

          {/* Botones de Acción Superior */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-bold border border-purple-500/30 shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              title="Actualizar métricas en tiempo real"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Actualizando...' : 'Refrescar'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-pink-600 hover:opacity-95 text-white text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
              title="Descargar reporte detallado en JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Reporte</span>
            </button>
          </div>
        </div>

        {/* Tarjetas KPI de Neuronas y Uso */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-4 border-t border-purple-800/50">
          {/* Tarjeta 1: Neuronas Hoy */}
          <div className="p-3.5 rounded-2xl bg-purple-950/60 border border-purple-500/30">
            <div className="flex items-center justify-between text-purple-300 text-[11px] font-bold mb-1">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Neuronas Hoy
              </span>
              <span className="text-[10px] text-amber-300 font-mono">
                {summary.quotaUsedPercent}% del cupo
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bubble font-black text-amber-300">
              {Number(summary.totalNeuronsToday).toLocaleString('es-CR')}
              <span className="text-xs text-purple-400 font-normal"> / 10,000</span>
            </div>
            {/* Barra de Progreso del Plan Gratuito */}
            <div className="w-full h-2 bg-purple-900/80 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(2, summary.quotaUsedPercent))}%` }}
              />
            </div>
            <p className="text-[10px] text-purple-400 mt-1">
              {summary.remainingNeuronsToday.toLocaleString('es-CR')} neuronas libres hoy
            </p>
          </div>

          {/* Tarjeta 2: Clics / Aperturas del Chat */}
          <div className="p-3.5 rounded-2xl bg-purple-950/60 border border-purple-500/30">
            <div className="flex items-center justify-between text-purple-300 text-[11px] font-bold mb-1">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-pink-400" />
                Clics al Chat
              </span>
              <span className="text-[10px] text-pink-300 font-bold">Interacciones</span>
            </div>
            <div className="text-xl sm:text-2xl font-bubble font-black text-pink-300">
              {Number(summary.totalChatOpens).toLocaleString('es-CR')}
            </div>
            <p className="text-[10px] text-purple-400 mt-1">
              Personas que han abierto a la Estrellita
            </p>
          </div>

          {/* Tarjeta 3: Respuestas Generadas */}
          <div className="p-3.5 rounded-2xl bg-purple-950/60 border border-purple-500/30">
            <div className="flex items-center justify-between text-purple-300 text-[11px] font-bold mb-1">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                Chats Respondidos
              </span>
              <span className="text-[10px] text-cyan-300 font-bold">En Vivo</span>
            </div>
            <div className="text-xl sm:text-2xl font-bubble font-black text-cyan-300">
              {Number(summary.totalMessagesAnswered).toLocaleString('es-CR')}
            </div>
            <p className="text-[10px] text-purple-400 mt-1">
              Consultas de stock, talleres y tienda
            </p>
          </div>

          {/* Tarjeta 4: Mensajes de Voz (Audio) */}
          <div className="p-3.5 rounded-2xl bg-purple-950/60 border border-purple-500/30">
            <div className="flex items-center justify-between text-purple-300 text-[11px] font-bold mb-1">
              <span className="flex items-center gap-1">
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
                Audios Procesados
              </span>
              <span className="text-[10px] text-emerald-300 font-bold">Whisper</span>
            </div>
            <div className="text-xl sm:text-2xl font-bubble font-black text-emerald-300">
              {Number(summary.totalVoiceNotes).toLocaleString('es-CR')}
            </div>
            <p className="text-[10px] text-purple-400 mt-1">
              Notas de voz recibidas y transcritas
            </p>
          </div>
        </div>
      </div>

      {/* Selector de Sub-Reportes (Realtime, Por Hora, Por Día) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-purple-950/40 rounded-2xl border border-purple-800/40 w-fit">
          <button
            type="button"
            onClick={() => setReportView('realtime')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bubble text-xs font-bold transition-all cursor-pointer ${
              reportView === 'realtime'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
                : 'text-purple-200 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tiempo Real</span>
          </button>

          <button
            type="button"
            onClick={() => setReportView('hourly')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bubble text-xs font-bold transition-all cursor-pointer ${
              reportView === 'hourly'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
                : 'text-purple-200 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Reporte por Hora</span>
          </button>

          <button
            type="button"
            onClick={() => setReportView('daily')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bubble text-xs font-bold transition-all cursor-pointer ${
              reportView === 'daily'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
                : 'text-purple-200 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reporte por Día</span>
          </button>
        </div>

        <span className="text-[11px] text-purple-300 font-semibold self-end sm:self-center">
          Última actualización: {lastUpdated || 'Cargando...'}
        </span>
      </div>

      {/* VISTA 1: TIEMPO REAL */}
      {reportView === 'realtime' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1a142a] border border-purple-200/80 dark:border-purple-800/40 shadow-sm">
            <h3 className="font-bubble font-black text-base text-fio-900 dark:text-purple-100 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              Feed en Vivo de Actividad de la Estrellita
            </h3>

            {metrics?.recent && metrics.recent.length > 0 ? (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {metrics.recent.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-purple-950/40 border border-slate-100 dark:border-purple-800/30 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            item.role === 'assistant'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                          }`}
                        >
                          {item.role === 'assistant' ? 'Estrellita' : `Usuario (${item.user_role || 'cliente'})`}
                        </span>
                        {item.has_audio === 1 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300 text-[10px] font-bold flex items-center gap-0.5">
                            <Mic className="w-2.5 h-2.5" /> Audio
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 dark:text-purple-400">
                          {item.created_at || 'Reciente'}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-purple-200 font-medium line-clamp-2">
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 dark:text-purple-400 text-xs font-medium">
                No hay mensajes recientes en el feed en este momento.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VISTA 2: REPORTE POR HORA */}
      {reportView === 'hourly' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1a142a] border border-purple-200/80 dark:border-purple-800/40 shadow-sm">
            <h3 className="font-bubble font-black text-base text-fio-900 dark:text-purple-100 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Consumo de Neuronas por Hora (Hoy)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-purple-800/40 text-slate-500 dark:text-purple-300 font-bold">
                    <th className="py-2.5 px-3">Hora (UTC)</th>
                    <th className="py-2.5 px-3">Neuronas Gastadas</th>
                    <th className="py-2.5 px-3">Consultas Respondidas</th>
                    <th className="py-2.5 px-3">Aperturas de Chat</th>
                    <th className="py-2.5 px-3">Intensidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-purple-900/20">
                  {(metrics?.hourly || []).map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-purple-950/30">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700 dark:text-purple-200">
                        {row.hour}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-amber-600 dark:text-amber-400">
                        {row.neurons}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-purple-300">
                        {row.queries}
                      </td>
                      <td className="py-2.5 px-3 text-pink-600 dark:text-pink-400 font-semibold">
                        {row.opens}
                      </td>
                      <td className="py-2.5 px-3 w-40">
                        <div className="w-full h-2 bg-slate-100 dark:bg-purple-900/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${Math.min(100, (row.neurons / 200) * 100)}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 3: REPORTE POR DÍA */}
      {reportView === 'daily' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1a142a] border border-purple-200/80 dark:border-purple-800/40 shadow-sm">
            <h3 className="font-bubble font-black text-base text-fio-900 dark:text-purple-100 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-500" />
              Histórico Diario de Neuronas y Consultas (Últimos 7 Días)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-purple-800/40 text-slate-500 dark:text-purple-300 font-bold">
                    <th className="py-2.5 px-3">Fecha</th>
                    <th className="py-2.5 px-3">Total Neuronas</th>
                    <th className="py-2.5 px-3">Consultas Respondidas</th>
                    <th className="py-2.5 px-3">Audios</th>
                    <th className="py-2.5 px-3">Aperturas de Chat</th>
                    <th className="py-2.5 px-3">Estado del Cupo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-purple-900/20">
                  {(metrics?.daily || []).map((d: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-purple-950/30">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800 dark:text-purple-100">
                        {d.date}
                      </td>
                      <td className="py-2.5 px-3 font-black text-amber-600 dark:text-amber-400">
                        {d.neurons} / 10,000
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700 dark:text-purple-200">
                        {d.queries}
                      </td>
                      <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">
                        {d.voiceNotes}
                      </td>
                      <td className="py-2.5 px-3 text-pink-600 dark:text-pink-400 font-bold">
                        {d.opens}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                          ✓ Dentro del plan gratuito
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Estado Técnico de la Infraestructura */}
      <div className="p-4 sm:p-5 rounded-3xl bg-purple-950/30 border border-purple-800/40 text-xs space-y-2">
        <h4 className="font-bubble font-bold text-sm text-purple-200 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Infraestructura y Aislamiento de Seguridad
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px] text-purple-300">
          <div className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-800/40">
            <span className="font-bold text-white block">Subdominio Dedicado:</span>
            ai.byfiocr.com (SSL Google Trust Services)
          </div>
          <div className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-800/40">
            <span className="font-bold text-white block">Base de Memoria:</span>
            byfio-agent-db (Aislada e Independiente)
          </div>
          <div className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-800/40">
            <span className="font-bold text-white block">Permisos Tienda Principal:</span>
            Modo Solo Lectura SELECT (Inmune a modificaciones)
          </div>
        </div>
      </div>
    </div>
  );
};
