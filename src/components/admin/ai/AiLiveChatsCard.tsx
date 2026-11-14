import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  MessageSquare,
  Search,
  RefreshCw,
  Trash2,
  Clock,
  User,
  Bot,
  Sparkles,
  ShieldAlert,
  Mic,
  Calendar,
  Layers,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { aiAgentService } from '../../../services/aiAgentService';
import { AiLiveConversation, AiLiveMessage, ChatRetentionPeriod } from '../../../types/aiAgent';

interface AiLiveChatsCardProps {
  onBackToHub?: () => void;
}

export const AiLiveChatsCard: React.FC<AiLiveChatsCardProps> = () => {
  const [conversations, setConversations] = useState<AiLiveConversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [selectedConv, setSelectedConv] = useState<AiLiveConversation | null>(null);
  const [messages, setMessages] = useState<AiLiveMessage[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'staff'>('all');
  const [periodFilter, setPeriodFilter] = useState<'all' | 'today'>('all');
  const [retentionPeriod, setRetentionPeriod] = useState<ChatRetentionPeriod>('7d');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [purging, setPurging] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback(async (quiet = false) => {
    if (!quiet) setLoadingList(true);
    try {
      const res = await aiAgentService.fetchLiveConversations({
        role: roleFilter,
        search: searchQuery,
        period: periodFilter === 'today' ? 'today' : undefined,
      });
      setConversations(res.conversations);
      if (res.retentionPeriod) {
        setRetentionPeriod(res.retentionPeriod);
      }
    } catch {
    } finally {
      if (!quiet) setLoadingList(false);
    }
  }, [roleFilter, searchQuery, periodFilter]);

  const loadThread = useCallback(async (convId: string, quiet = false) => {
    if (!quiet) setLoadingThread(true);
    try {
      const res = await aiAgentService.fetchConversationThread(convId);
      setSelectedConv(res.conversation);
      setMessages(res.messages);
    } catch {
    } finally {
      if (!quiet) setLoadingThread(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (selectedConvId) {
      loadThread(selectedConvId);
    } else {
      setSelectedConv(null);
      setMessages([]);
    }
  }, [selectedConvId, loadThread]);

  // Scroll al último mensaje del hilo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Polling automático cada 8 segundos si autoRefresh está activo
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadConversations(true);
      if (selectedConvId) {
        loadThread(selectedConvId, true);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [autoRefresh, selectedConvId, loadConversations, loadThread]);

  const handleSelectRetention = async (newPeriod: ChatRetentionPeriod) => {
    setRetentionPeriod(newPeriod);
    const ok = await aiAgentService.setChatRetention(newPeriod);
    if (ok) {
      showStatus('Tiempo de borrado actualizado');
      loadConversations(true);
    }
  };

  const handlePurgeNow = async () => {
    if (!window.confirm(`¿Estás segura de purgar los chats que superen el límite de retención (${retentionLabel(retentionPeriod)})?`)) {
      return;
    }
    setPurging(true);
    try {
      const res = await aiAgentService.purgeChatsNow(retentionPeriod);
      showStatus(`Purga completada. Chats eliminados: ${res.purgedCount ?? 0}`);
      loadConversations();
      if (selectedConvId) {
        setSelectedConvId(null);
      }
    } catch {
      showStatus('Error al ejecutar purga');
    } finally {
      setPurging(false);
    }
  };

  const handleDeleteCurrent = async () => {
    if (!selectedConvId) return;
    if (!window.confirm('¿Deseas eliminar este historial de conversación permanentemente?')) return;
    const ok = await aiAgentService.deleteConversation(selectedConvId);
    if (ok) {
      showStatus('Conversación eliminada');
      setSelectedConvId(null);
      loadConversations();
    }
  };

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const retentionLabel = (p: ChatRetentionPeriod) => {
    switch (p) {
      case '1h': return '1 hora';
      case '6h': return '6 horas';
      case '24h': return '24 horas (1 día)';
      case '3d': return '3 días';
      case '7d': return '7 días (1 semana)';
      case '30d': return '30 días (1 mes)';
      case 'never': return 'Nunca (Conservar siempre)';
      default: return p;
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      const diffMs = Date.now() - d.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) return 'Ahora';
      if (diffMin < 60) return `${diffMin}m`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `${diffHours}h`;
      return d.toLocaleDateString('es-CR', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-white dark:bg-[#1a1429] rounded-3xl shadow-md border-2 border-purple-100 dark:border-purple-900/40 overflow-hidden flex flex-col h-[740px] max-h-[85vh] animate-fadeIn">
      {/* Toast Notificación */}
      {statusMessage && (
        <div className="fixed top-6 right-6 z-50 bg-purple-900 text-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 font-bubble text-xs animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Barra Superior de Control & Configuración de Borrado */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 dark:from-[#201736] dark:via-[#1a132c] dark:to-[#201736] border-b border-purple-100 dark:border-purple-900/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-xs">
            <MessageSquare className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-800 dark:text-purple-100">
                Chats en Vivo — Estrellita ✨
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bubble font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>En Vivo</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-purple-300 font-sans">
              Monitoreo en tiempo real de interacciones con RAG y retención configurable.
            </p>
          </div>
        </div>

        {/* Controles de Auto-Borrado & Refresco */}
        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          {/* Selector de Tiempo de Borrado */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-[#281d42] px-2.5 py-1 rounded-xl border border-purple-200/80 dark:border-purple-800/60 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300 shrink-0" />
            <label className="text-[10px] font-bubble font-bold text-slate-600 dark:text-purple-200 hidden md:inline">
              Borrar chats tras:
            </label>
            <select
              value={retentionPeriod}
              onChange={(e) => handleSelectRetention(e.target.value as ChatRetentionPeriod)}
              className="bg-transparent text-[11px] font-bubble font-bold text-purple-900 dark:text-purple-100 focus:outline-none cursor-pointer"
              title="Período de retención automática de conversaciones"
            >
              <option value="1h" className="dark:bg-[#1a1429]">1 hora</option>
              <option value="6h" className="dark:bg-[#1a1429]">6 horas</option>
              <option value="24h" className="dark:bg-[#1a1429]">24 horas (1 día)</option>
              <option value="3d" className="dark:bg-[#1a1429]">3 días</option>
              <option value="7d" className="dark:bg-[#1a1429]">7 días (1 semana)</option>
              <option value="30d" className="dark:bg-[#1a1429]">30 días (1 mes)</option>
              <option value="never" className="dark:bg-[#1a1429]">Nunca</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handlePurgeNow}
            disabled={purging}
            className="px-2.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900/60 dark:hover:bg-purple-900 dark:text-purple-200 text-[11px] font-bubble font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95 disabled:opacity-50"
            title="Purgar chats que superen el límite configurado"
          >
            <Trash2 className="w-3 h-3 text-purple-600 dark:text-purple-300" />
            <span className="hidden sm:inline">{purging ? 'Purgando...' : 'Purgar Ahora'}</span>
          </button>

          <button
            type="button"
            onClick={() => loadConversations()}
            disabled={loadingList}
            className="p-1.5 rounded-xl bg-white dark:bg-[#281d42] border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-200 hover:bg-purple-50 transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Refrescar chats"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingList ? 'animate-spin' : ''}`} />
          </button>

          <label className="flex items-center gap-1 text-[10px] font-bubble font-bold text-slate-500 dark:text-purple-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="accent-purple-600 rounded"
            />
            <span className="hidden sm:inline">Auto-live</span>
          </label>
        </div>
      </div>

      {/* Contenedor Principal Estilo WhatsApp Web */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panel Izquierdo: Lista de Sesiones & Filtros */}
        <div className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-purple-100 dark:border-purple-900/30 bg-slate-50/50 dark:bg-[#150f24] ${selectedConvId ? 'hidden md:flex' : 'flex'}`}>
          {/* Buscador & Filtros */}
          <div className="p-3 border-b border-purple-100 dark:border-purple-900/30 space-y-2 bg-white/60 dark:bg-[#1a1429]/60 backdrop-blur-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-purple-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por cliente o mensaje..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-purple-200/80 dark:border-purple-800/60 bg-white dark:bg-[#201833] text-xs font-sans text-slate-800 dark:text-purple-100 placeholder:text-slate-400 dark:placeholder:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Chips de Filtro */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[10px] font-bubble font-bold">
              <button
                type="button"
                onClick={() => setRoleFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer shrink-0 ${
                  roleFilter === 'all'
                    ? 'bg-purple-700 text-white shadow-2xs'
                    : 'bg-white dark:bg-[#281d42] text-slate-600 dark:text-purple-200 border border-purple-100 dark:border-purple-900/40 hover:bg-purple-50'
                }`}
              >
                Todos ({conversations.length})
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('customer')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer shrink-0 ${
                  roleFilter === 'customer'
                    ? 'bg-purple-700 text-white shadow-2xs'
                    : 'bg-white dark:bg-[#281d42] text-slate-600 dark:text-purple-200 border border-purple-100 dark:border-purple-900/40 hover:bg-purple-50'
                }`}
              >
                Clientes
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('staff')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer shrink-0 ${
                  roleFilter === 'staff'
                    ? 'bg-purple-700 text-white shadow-2xs'
                    : 'bg-white dark:bg-[#281d42] text-slate-600 dark:text-purple-200 border border-purple-100 dark:border-purple-900/40 hover:bg-purple-50'
                }`}
              >
                Staff
              </button>
              <button
                type="button"
                onClick={() => setPeriodFilter(periodFilter === 'today' ? 'all' : 'today')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer shrink-0 ${
                  periodFilter === 'today'
                    ? 'bg-pink-600 text-white shadow-2xs'
                    : 'bg-white dark:bg-[#281d42] text-slate-600 dark:text-purple-200 border border-purple-100 dark:border-purple-900/40 hover:bg-pink-50'
                }`}
              >
                📅 Hoy
              </button>
            </div>
          </div>

          {/* Lista Scrolleable de Conversaciones */}
          <div className="flex-1 overflow-y-auto divide-y divide-purple-50 dark:divide-purple-900/20">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-purple-300 space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto text-purple-300 dark:text-purple-600" />
                <p className="font-bubble font-bold text-xs">No hay conversaciones registradas</p>
                <p className="text-[10px] text-slate-400 dark:text-purple-400">
                  Las interacciones de los clientes en la tienda web aparecerán aquí en vivo.
                </p>
              </div>
            ) : (
              conversations.map((conv) => {
                const isSelected = selectedConvId === conv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConvId(conv.id)}
                    className={`p-3 transition-all cursor-pointer flex items-start gap-3 select-none ${
                      isSelected
                        ? 'bg-purple-100/80 dark:bg-purple-950/70 border-l-4 border-purple-600'
                        : 'hover:bg-purple-50/60 dark:hover:bg-purple-950/30'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-400 text-white flex items-center justify-center font-bubble font-bold text-sm shadow-2xs">
                        {conv.user_name ? conv.user_name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#150f24] absolute -bottom-0.5 -right-0.5" />
                    </div>

                    {/* Metadata & Snippet */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-bubble font-bold text-xs text-slate-800 dark:text-purple-100 truncate">
                          {conv.user_name || 'Cliente Web'}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-purple-400 shrink-0">
                          {formatRelativeTime(conv.updated_at)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className={`px-1.5 py-0.2 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                            conv.user_role === 'staff' || conv.user_role === 'admin'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300'
                          }`}
                        >
                          {conv.user_role}
                        </span>
                        {conv.message_count ? (
                          <span className="text-[10px] text-slate-400 dark:text-purple-300">
                            • {conv.message_count} msgs
                          </span>
                        ) : null}
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-purple-300 font-sans line-clamp-1 break-words">
                        {conv.last_message || 'Iniciando conversación...'}
                      </p>
                    </div>

                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-purple-600 self-center hidden sm:block shrink-0" />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Panel Derecho: Visor del Hilo de la Conversación */}
        <div className={`flex-1 flex flex-col bg-white dark:bg-[#1a1429] ${!selectedConvId ? 'hidden md:flex' : 'flex'}`}>
          {!selectedConvId ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 dark:text-purple-300 space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center shadow-inner">
                <Bot className="w-8 h-8" />
              </div>
              <h4 className="font-bubble font-bold text-base text-slate-700 dark:text-purple-100">
                Selecciona una conversación en vivo
              </h4>
              <p className="text-xs text-slate-500 dark:text-purple-300 max-w-sm font-sans">
                Explora los chats del panel izquierdo para ver las consultas de clientes, respuestas de la Estrellita y contexto RAG en tiempo real.
              </p>
            </div>
          ) : (
            <>
              {/* Header de la Conversación Seleccionada */}
              <div className="p-3.5 border-b border-purple-100 dark:border-purple-900/30 flex items-center justify-between gap-3 bg-purple-50/40 dark:bg-[#201836]/40">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => setSelectedConvId(null)}
                    className="md:hidden p-1.5 rounded-xl bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-bubble font-bold"
                  >
                    ← Volver
                  </button>
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center font-bubble font-bold text-xs shadow-2xs shrink-0">
                    {selectedConv?.user_name ? selectedConv.user_name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bubble font-bold text-xs sm:text-sm text-slate-900 dark:text-purple-100 truncate">
                      {selectedConv?.user_name || 'Cliente Web'}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-purple-300 truncate font-mono">
                      ID: {selectedConvId} • Rol: {selectedConv?.user_role || 'customer'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => loadThread(selectedConvId)}
                    disabled={loadingThread}
                    className="p-1.5 rounded-xl bg-white dark:bg-[#281d42] border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-200 hover:bg-purple-50 text-xs transition-all cursor-pointer"
                    title="Actualizar conversación"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingThread ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteCurrent}
                    className="p-1.5 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-700 dark:bg-pink-950 dark:hover:bg-pink-900 dark:text-pink-300 text-xs transition-all cursor-pointer"
                    title="Eliminar este historial"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Mensajes del Hilo */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30 dark:bg-[#130d22]">
                {loadingThread && messages.length === 0 ? (
                  <div className="py-12 text-center text-xs font-bubble text-slate-400 dark:text-purple-300">
                    Cargando hilo de conversación...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-12 text-center text-xs font-bubble text-slate-400 dark:text-purple-300">
                    No hay mensajes en este chat aún.
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isUser = msg.role === 'user';
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-2 items-end ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isUser && (
                          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center font-bubble text-[10px] shadow-2xs shrink-0 mb-1">
                            ✨
                          </div>
                        )}
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 shadow-xs text-xs font-sans leading-relaxed break-words ${
                            isUser
                              ? 'bg-purple-700 text-white rounded-br-xs'
                              : 'bg-white dark:bg-[#201836] text-slate-800 dark:text-purple-100 border border-purple-100 dark:border-purple-900/40 rounded-bl-xs'
                          }`}
                        >
                          {Boolean(msg.has_audio) && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 mb-1 block">
                              <Mic className="w-3 h-3" /> Nota de Voz
                            </span>
                          )}
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          <span
                            className={`block text-[9px] mt-1 text-right ${
                              isUser ? 'text-purple-200' : 'text-slate-400 dark:text-purple-400'
                            }`}
                          >
                            {new Date(msg.created_at).toLocaleTimeString('es-CR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Footer de Estado de Solo Lectura */}
              <div className="p-2.5 border-t border-purple-100 dark:border-purple-900/30 bg-purple-50/30 dark:bg-[#1a1429] text-center text-[10px] font-bubble font-semibold text-slate-500 dark:text-purple-300 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3 h-3 text-yellow-500" />
                <span>Modo Supervisión en Vivo — Memoria RAG e indexación de turnos activa</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
