import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useConfirm } from '../../context/ConfirmContext';
import { AgendaItem, AgendaCategory, AgendaPriority } from '../../types';
import { CalendarAgendaView } from './agenda/CalendarAgendaView';
import {
  Calendar as CalendarIcon, CheckCircle2, Circle, Clock, Plus,
  Trash2, Edit3, Search, GraduationCap, Package, Scissors,
  Truck, Bell, BellRing, Volume2, X, CalendarDays, LayoutList, LayoutGrid,
  ChevronDown, ChevronUp, AlertCircle, Check, ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playAgendaBellSound, sendBrowserPushNotification } from '../../utils/soundEffects';

const TIME_HOURS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const TIME_MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
const TIME_PRESETS = [
  { label: '09:00 AM', hour: '09', minute: '00', period: 'AM' as const },
  { label: '10:00 AM', hour: '10', minute: '00', period: 'AM' as const },
  { label: '02:00 PM', hour: '02', minute: '00', period: 'PM' as const },
  { label: '04:00 PM', hour: '04', minute: '00', period: 'PM' as const },
  { label: '06:00 PM', hour: '06', minute: '00', period: 'PM' as const },
];

const parseTimeString = (timeStr?: string) => {
  if (!timeStr || !timeStr.trim()) {
    return { hasTime: false, hour: '10', minute: '00', period: 'AM' as 'AM' | 'PM' };
  }
  const clean = timeStr.trim().toUpperCase();
  const isPM = clean.includes('PM');
  const isAM = clean.includes('AM');
  const numbersOnly = clean.replace(/[^0-9:]/g, '');
  const parts = numbersOnly.split(':');
  let rawHour = parseInt(parts[0], 10);
  let rawMinute = parts[1] ? parseInt(parts[1], 10) : 0;

  if (isNaN(rawHour)) rawHour = 10;
  if (isNaN(rawMinute)) rawMinute = 0;

  let period: 'AM' | 'PM' = isPM ? 'PM' : isAM ? 'AM' : 'AM';
  if (!isPM && !isAM && rawHour >= 12) {
    period = 'PM';
    if (rawHour > 12) rawHour -= 12;
  } else if (rawHour > 12) {
    rawHour -= 12;
  }
  if (rawHour === 0) rawHour = 12;

  const roundedMin = Math.round(rawMinute / 5) * 5;
  const clampedMin = roundedMin >= 60 ? 55 : roundedMin;

  return {
    hasTime: true,
    hour: String(rawHour).padStart(2, '0'),
    minute: String(clampedMin).padStart(2, '0'),
    period,
  };
};

const CATEGORY_CONFIG: Record<AgendaCategory, { label: string; icon: any; color: string; bg: string; border: string; dot: string }> = {
  taller: {
    label: 'Taller Creativo',
    icon: GraduationCap,
    color: 'text-purple-700 dark:text-purple-300',
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    border: 'border-purple-200 dark:border-purple-800',
    dot: 'bg-purple-500',
  },
  entrega: {
    label: 'Entrega / Envío',
    icon: Package,
    color: 'text-pink-700 dark:text-pink-300',
    bg: 'bg-pink-50 dark:bg-pink-950/40',
    border: 'border-pink-200 dark:border-pink-800',
    dot: 'bg-pink-500',
  },
  produccion: {
    label: 'Producción & Ensamble',
    icon: Scissors,
    color: 'text-sky-700 dark:text-sky-300',
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    border: 'border-sky-200 dark:border-sky-800',
    dot: 'bg-sky-500',
  },
  proveedor: {
    label: 'Proveedor & Insumos',
    icon: Truck,
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
  },
  recordatorio: {
    label: 'Recordatorio / Admin',
    icon: Bell,
    color: 'text-slate-700 dark:text-slate-300',
    bg: 'bg-slate-100 dark:bg-slate-800',
    border: 'border-slate-200 dark:border-slate-700',
    dot: 'bg-slate-500',
  },
};

const PRIORITY_CONFIG: Record<AgendaPriority, { label: string; badge: string; dot: string }> = {
  alta: { label: 'Alta Prioridad', badge: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
  media: { label: 'Prioridad Normal', badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  baja: { label: 'Prioridad Baja', badge: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
};

const formatDateReadable = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('es-CR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return dateStr;
  }
};

export const AgendaSection: React.FC = () => {
  const {
    agendaItems,
    addAgendaItem,
    updateAgendaItem,
    deleteAgendaItem,
    toggleAgendaItemStatus,
    workshops,
    isFeatureEnabled,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'today' | 'pending' | 'completed'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'grid'>('calendar');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AgendaItem | null>(null);
  const [showCompletedSection, setShowCompletedSection] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    date: string;
    time: string;
    category: AgendaCategory;
    priority: AgendaPriority;
    notes: string;
  }>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    category: 'recordatorio',
    priority: 'media',
    notes: '',
  });

  // Selector de Hora y Minutos + Notificación Push
  const [selectedHour, setSelectedHour] = useState('10');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');
  const [hasSpecificTime, setHasSpecificTime] = useState(true);
  const [enableBellNotification, setEnableBellNotification] = useState(true);
  const [activeBellToast, setActiveBellToast] = useState<{ title: string; time?: string; date: string } | null>(null);

  // Auto-cierre de notificación push flotante tras 6 segundos
  useEffect(() => {
    if (activeBellToast) {
      const timer = setTimeout(() => {
        setActiveBellToast(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [activeBellToast]);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Superadmin features
  const showWorkshopSync = isFeatureEnabled('agenda', 'agenda_sync_workshops') !== false;

  const handleTestBell = () => {
    playAgendaBellSound(0.4);
    sendBrowserPushNotification('🔔 Campanita By.Fio Activada', {
      body: 'Notificación sonora y visual configurada con éxito en la agenda ✨',
      tag: 'test-bell',
    });
  };

  const openNewModal = (initialDate?: string, initialTime?: string) => {
    setEditingItem(null);
    const dateToUse = initialDate || new Date().toISOString().split('T')[0];
    const timeToUse = initialTime || '10:00 AM';
    setFormData({
      title: '',
      date: dateToUse,
      time: timeToUse,
      category: 'recordatorio',
      priority: 'media',
      notes: '',
    });
    const parsed = parseTimeString(timeToUse);
    setHasSpecificTime(true);
    setSelectedHour(parsed.hour);
    setSelectedMinute(parsed.minute);
    setSelectedPeriod(parsed.period);
    setEnableBellNotification(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: AgendaItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      date: item.date,
      time: item.time || '',
      category: item.category,
      priority: item.priority,
      notes: item.notes || '',
    });
    const parsed = parseTimeString(item.time);
    setHasSpecificTime(parsed.hasTime);
    setSelectedHour(parsed.hour);
    setSelectedMinute(parsed.minute);
    setSelectedPeriod(parsed.period);
    setEnableBellNotification(item.notifyBell !== false);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const finalTime = hasSpecificTime ? `${selectedHour}:${selectedMinute} ${selectedPeriod}` : undefined;

      if (editingItem) {
        updateAgendaItem(editingItem.id, {
          title: formData.title.trim(),
          date: formData.date,
          time: finalTime,
          category: formData.category,
          priority: formData.priority,
          notes: formData.notes.trim() || undefined,
          notifyBell: enableBellNotification,
        });
      } else {
        addAgendaItem({
          title: formData.title.trim(),
          date: formData.date,
          time: finalTime,
          category: formData.category,
          priority: formData.priority,
          status: 'pending',
          notes: formData.notes.trim() || undefined,
          notifyBell: enableBellNotification,
        });
      }

      // Si la campanita está activa, reproducir sonido cristalino y disparar notificación push
      if (enableBellNotification) {
        playAgendaBellSound(0.4);
        sendBrowserPushNotification(`🔔 Agenda By.Fio: ${formData.title.trim()}`, {
          body: `${finalTime ? '⏰ ' + finalTime + ' · ' : ''}Fecha: ${formData.date} · Prioridad: ${formData.priority.toUpperCase()}`,
          tag: `agenda-${Date.now()}`,
        });
        setActiveBellToast({
          title: formData.title.trim(),
          time: finalTime,
          date: formData.date,
        });
      }

      setIsModalOpen(false);
      setEditingItem(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = (item: AgendaItem) => {
    if (item.status === 'pending') {
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.8 },
        colors: ['#A855F7', '#EC4899', '#10B981'],
      });
    }
    toggleAgendaItemStatus(item.id);
  };

  // Filtrado de Actividades
  const filteredItems = useMemo(() => {
    return agendaItems.filter((item) => {
      if (selectedFilter === 'today' && item.date !== todayStr) return false;
      if (selectedFilter === 'pending' && item.status !== 'pending') return false;
      if (selectedFilter === 'completed' && item.status !== 'completed') return false;

      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchNotes = item.notes?.toLowerCase().includes(q);
        if (!matchTitle && !matchNotes) return false;
      }

      return true;
    });
  }, [agendaItems, selectedFilter, selectedCategory, searchQuery, todayStr]);

  // Contadores y Métricas
  const totalItems = agendaItems.length;
  const pendingCount = agendaItems.filter((i) => i.status === 'pending').length;
  const todayPendingCount = agendaItems.filter((i) => i.status === 'pending' && i.date === todayStr).length;
  const completedCount = agendaItems.filter((i) => i.status === 'completed').length;
  const completionRate = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  // Agrupamiento cronológico inteligente
  const { todayAndOverdueItems, upcomingItems, futureItems, completedItems } = useMemo(() => {
    const todayAndOverdue: AgendaItem[] = [];
    const upcoming: AgendaItem[] = [];
    const future: AgendaItem[] = [];
    const completed: AgendaItem[] = [];

    // Calcular fecha límite de los próximos 3 días
    const [ty, tm, td] = todayStr.split('-').map(Number);
    const in3Days = new Date(ty, tm - 1, td + 4).toISOString().split('T')[0];

    filteredItems.forEach((item) => {
      if (item.status === 'completed') {
        completed.push(item);
      } else if (item.date <= todayStr) {
        todayAndOverdue.push(item);
      } else if (item.date <= in3Days) {
        upcoming.push(item);
      } else {
        future.push(item);
      }
    });

    // Ordenar cronológicamente
    const sorter = (a: AgendaItem, b: AgendaItem) => a.date.localeCompare(b.date);
    todayAndOverdue.sort(sorter);
    upcoming.sort(sorter);
    future.sort(sorter);

    return {
      todayAndOverdueItems: todayAndOverdue,
      upcomingItems: upcoming,
      futureItems: future,
      completedItems: completed,
    };
  }, [filteredItems, todayStr]);

  return (
    <div className="space-y-4 animate-fadeIn pb-8">
      {/* 1. Encabezado Neumórfico Ejecutivo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#F1F2F6] border border-white/90 shadow-neuCard">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-pink-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <CalendarDays className="w-6 h-6 text-fio-yellow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bubble font-bold text-lg sm:text-xl text-slate-900 leading-tight">
                Agenda &amp; Cronograma de Operaciones
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                WMS / Taller
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Planificación ejecutiva de tareas diarias, entregas de pedidos, compras y talleres
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {/* Selector de Vista: Calendario vs Lista vs Cuadrícula */}
          <div className="flex items-center p-1 rounded-2xl bg-[#ECEEF2] border border-white/80 shadow-neuInset">
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-xl font-bubble font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-white text-purple-700 shadow-neuBtn scale-[1.02]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Vista Calendario Semanal / Diario"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendario</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-purple-700 shadow-neuBtn scale-[1.02]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Vista Lista Cronológica"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-purple-700 shadow-neuBtn scale-[1.02]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Vista Cuadrícula de Tarjetas"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => openNewModal()}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl neu-btn-primary text-white font-bubble font-bold text-xs sm:text-sm shadow-neuBtnHover active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nueva Actividad</span>
          </button>
        </div>
      </div>

      {/* 2. Tarjetas KPI de Resumen Ejecutivo con Barra de Progreso */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* KPI 1: Total Actividades */}
        <div className="p-4 rounded-3xl bg-[#F1F2F6] border border-white/90 shadow-neuCard flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Actividades
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bubble font-bold text-slate-900">{totalItems}</span>
              <span className="text-[11px] text-slate-400 font-sans font-semibold">programadas</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white/80 border border-white shadow-neuBtn flex items-center justify-center text-purple-600 shrink-0">
            <CalendarIcon className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2: Para Hoy */}
        <div className="p-4 rounded-3xl bg-[#F1F2F6] border border-white/90 shadow-neuCard flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1.5">
              <span>Para Hoy</span>
              {todayPendingCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bubble font-bold text-rose-600">{todayPendingCount}</span>
              <span className="text-[11px] text-rose-500/80 font-sans font-semibold">pendientes</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white/80 border border-white shadow-neuBtn flex items-center justify-center text-rose-500 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3: Progreso General */}
        <div className="p-4 rounded-3xl bg-[#F1F2F6] border border-white/90 shadow-neuCard flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Efectividad
            </span>
            <span className="text-[11px] font-bubble font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {completionRate}%
            </span>
          </div>
          <div className="space-y-1 mt-1">
            <div className="flex justify-between text-xs">
              <span className="font-bubble font-bold text-slate-900">{completedCount} completadas</span>
              <span className="text-slate-400 text-[11px]">{pendingCount} pendientes</span>
            </div>
            <div className="w-full h-2 bg-[#ECEEF2] rounded-full overflow-hidden shadow-neuInset border border-white/60">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* KPI 4: Talleres Creativos */}
        <div className="p-4 rounded-3xl bg-[#F1F2F6] border border-white/90 shadow-neuCard flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Talleres Vinculados
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bubble font-bold text-purple-700">
                {showWorkshopSync ? workshops.length : 'Off'}
              </span>
              <span className="text-[11px] text-purple-500 font-sans font-semibold">activos</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white/80 border border-white shadow-neuBtn flex items-center justify-center text-purple-600 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Contenido Principal según modo de vista */}
      {viewMode === 'calendar' ? (
        <CalendarAgendaView
          agendaItems={agendaItems}
          workshops={workshops}
          onAddNewItem={(date, time) => openNewModal(date, time)}
          onEditItem={openEditModal}
          onToggleStatus={handleToggleStatus}
          onDeleteItem={deleteAgendaItem}
        />
      ) : (
        <>
          {/* 3. Barra de Búsqueda y Filtros Neumórfica */}
      <div className="p-3 sm:p-3.5 rounded-3xl bg-[#F1F2F6] border border-white/90 shadow-neuCard flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Pestañas de Estado */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedFilter === 'all'
                ? 'neu-btn-primary text-white shadow-neuBtnHover scale-[1.01]'
                : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-purple-600 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover'
            }`}
          >
            Todas ({totalItems})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('today')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedFilter === 'today'
                ? 'neu-btn-primary text-white shadow-neuBtnHover scale-[1.01]'
                : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-rose-600 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover'
            }`}
          >
            ⏰ Hoy ({agendaItems.filter((i) => i.date === todayStr).length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedFilter === 'pending'
                ? 'neu-btn-primary text-white shadow-neuBtnHover scale-[1.01]'
                : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-amber-600 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover'
            }`}
          >
            Pendientes ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedFilter === 'completed'
                ? 'neu-btn-primary text-white shadow-neuBtnHover scale-[1.01]'
                : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-emerald-600 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover'
            }`}
          >
            ✅ Completadas ({completedCount})
          </button>
        </div>

        {/* Buscador & Selector de Categoría */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="relative min-w-[200px] flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="Buscar por título o notas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-2xl bg-[#ECEEF2] border border-white/80 text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-neuInset transition-all"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-2xl bg-[#ECEEF2] border border-white/80 text-xs font-bubble font-bold text-slate-700 shadow-neuInset focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
          >
            <option value="all">Todas las Categorías</option>
            <option value="taller">🎨 Talleres Creativos</option>
            <option value="entrega">📦 Entregas & Envíos</option>
            <option value="produccion">✂️ Producción & Ensamble</option>
            <option value="proveedor">🚚 Proveedores & Insumos</option>
            <option value="recordatorio">📌 Recordatorios Generales</option>
          </select>
        </div>
      </div>

      {/* 4. Talleres Creativos Sincronizados de By.Fio (Banner destacado si está activo) */}
      {showWorkshopSync && selectedCategory === 'all' && selectedFilter !== 'completed' && workshops.length > 0 && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border border-purple-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                <GraduationCap className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bubble font-bold text-xs sm:text-sm text-purple-950">
                  Talleres Creativos Programados en Tibás
                </h3>
                <p className="text-[11px] text-purple-700 font-sans">
                  Sincronizados automáticamente desde el catálogo oficial de talleres
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-purple-700 bg-white px-2.5 py-0.5 rounded-full border border-purple-200">
              {workshops.length} Talleres
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {workshops.map((ws) => (
              <div
                key={`ws-${ws.id}`}
                className="p-3 bg-white rounded-2xl border border-purple-200/70 shadow-xs flex flex-col justify-between space-y-2 hover:border-purple-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-purple-600 font-bold mb-1">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-pink-500" />
                      <span>{ws.schedule}</span>
                    </span>
                    <span className="text-[10px] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 font-mono text-purple-800">
                      {ws.totalSpots - ws.spotsAvailable}/{ws.totalSpots} Cupos
                    </span>
                  </div>
                  <h4 className="font-bubble font-bold text-xs text-slate-900 leading-snug line-clamp-1">
                    {ws.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-sans line-clamp-1 mt-0.5">
                    {ws.subtitle || 'Taller práctico presencial By.Fio.'}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] font-semibold text-purple-700 font-mono">
                  <span>📍 {ws.date}</span>
                  <span className="text-emerald-600 font-bold">₡{ws.price?.toLocaleString('es-CR')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Contenido Principal: Vista Lista vs Vista Cuadrícula */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {/* SECCIÓN 1: HOY & ACTIVIDADES URGENTES */}
          {todayAndOverdueItems.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bubble font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span>Para Hoy &amp; Tareas Prioritarias</span>
                  <span className="text-[11px] text-rose-600 bg-rose-50 px-2 py-0.2 rounded-full border border-rose-200 font-bold font-mono">
                    {todayAndOverdueItems.length}
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 font-sans font-medium">Atención inmediata</span>
              </div>

              <div className="space-y-1.5">
                {todayAndOverdueItems.map((item) => (
                  <AgendaListItem
                    key={item.id}
                    item={item}
                    todayStr={todayStr}
                    onToggle={handleToggleStatus}
                    onEdit={openEditModal}
                    onDelete={deleteAgendaItem}
                  />
                ))}
              </div>
            </div>
          )}

          {/* SECCIÓN 2: PRÓXIMOS DÍAS */}
          {upcomingItems.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bubble font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span>Próximos Días (Esta Semana)</span>
                  <span className="text-[11px] text-purple-700 bg-purple-50 px-2 py-0.2 rounded-full border border-purple-200 font-bold font-mono">
                    {upcomingItems.length}
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 font-sans font-medium">Planificado</span>
              </div>

              <div className="space-y-1.5">
                {upcomingItems.map((item) => (
                  <AgendaListItem
                    key={item.id}
                    item={item}
                    todayStr={todayStr}
                    onToggle={handleToggleStatus}
                    onEdit={openEditModal}
                    onDelete={deleteAgendaItem}
                  />
                ))}
              </div>
            </div>
          )}

          {/* SECCIÓN 3: MÁS ADELANTE */}
          {futureItems.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bubble font-bold text-slate-700 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span>Fechas Posteriores</span>
                  <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.2 rounded-full border border-slate-200 font-bold font-mono">
                    {futureItems.length}
                  </span>
                </span>
              </div>

              <div className="space-y-1.5">
                {futureItems.map((item) => (
                  <AgendaListItem
                    key={item.id}
                    item={item}
                    todayStr={todayStr}
                    onToggle={handleToggleStatus}
                    onEdit={openEditModal}
                    onDelete={deleteAgendaItem}
                  />
                ))}
              </div>
            </div>
          )}

          {/* SECCIÓN 4: COMPLETADAS (ACORDEÓN ELEGANTE) */}
          {completedItems.length > 0 && (
            <div className="pt-3">
              <button
                type="button"
                onClick={() => setShowCompletedSection(!showCompletedSection)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#ECEEF2] border border-white/70 shadow-neuInset text-xs font-bubble font-bold text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Tareas Completadas ({completedItems.length})</span>
                </div>
                {showCompletedSection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showCompletedSection && (
                <div className="space-y-1.5 mt-2 opacity-80">
                  {completedItems.map((item) => (
                    <AgendaListItem
                      key={item.id}
                      item={item}
                      todayStr={todayStr}
                      onToggle={handleToggleStatus}
                      onEdit={openEditModal}
                      onDelete={deleteAgendaItem}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* VISTA CUADRÍCULA / TARJETAS NEUMÓRFICAS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredItems.map((item) => (
            <AgendaCardItem
              key={item.id}
              item={item}
              todayStr={todayStr}
              onToggle={handleToggleStatus}
              onEdit={openEditModal}
              onDelete={deleteAgendaItem}
            />
          ))}
        </div>
      )}

          {/* Estado Vacío */}
          {filteredItems.length === 0 && (!showWorkshopSync || selectedFilter === 'completed') && (
            <div className="p-10 text-center rounded-3xl bg-[#F1F2F6] border border-white/90 shadow-neuCard text-slate-400 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/80 border border-white shadow-neuBtn flex items-center justify-center text-purple-400 mx-auto">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bubble font-bold text-base text-slate-800">
                  No hay actividades programadas con este filtro
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Organiza la semana del taller agregando entregas de pedidos, compras de vinil o recordatorios de caja.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openNewModal()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl neu-btn-primary text-white font-bubble font-bold text-xs shadow-neuBtnHover cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Primera Actividad</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* 6. Modal de Creación / Edición Neumórfica de Alta Fidelidad */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#F1F2F6] rounded-3xl max-w-lg w-full max-h-[92vh] shadow-2xl border border-white/90 flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-150">
            {/* Header Fijo */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/80 shrink-0 bg-[#F1F2F6]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  <CalendarDays className="w-4 h-4 text-fio-yellow" />
                </div>
                <div>
                  <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 leading-tight">
                    {editingItem ? 'Editar Actividad del Taller' : 'Nueva Actividad en Agenda'}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-sans">
                    Planificación ejecutiva y sincronización en tiempo real
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-white/80 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col min-h-0 flex-1 overflow-hidden">
              <div className="overflow-y-auto px-5 py-3.5 space-y-3 flex-1 scrollbar-thin">
              {/* Título de la Actividad */}
              <div>
                <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">
                  Título de la Actividad o Tarea *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Despacho de libretas en Correos, Comprar vinil holográfico..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#ECEEF2] border border-white/80 shadow-neuInset text-xs font-bubble font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-purple-400"
                  autoFocus
                />
              </div>

              {/* Selector Visual de Categorías */}
              <div>
                <label className="block text-xs font-bubble font-bold text-slate-700 mb-1.5">
                  Tipo de Actividad
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {(Object.keys(CATEGORY_CONFIG) as AgendaCategory[]).map((catKey) => {
                    const cat = CATEGORY_CONFIG[catKey];
                    const CatIcon = cat.icon;
                    const isSelected = formData.category === catKey;

                    return (
                      <button
                        key={catKey}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: catKey })}
                        className={`p-2 rounded-xl text-left border flex items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? `${cat.bg} ${cat.border} ${cat.color} font-bold shadow-xs scale-[1.02] ring-1 ring-purple-400`
                            : 'bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <CatIcon className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-[11px] font-bubble truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

                {/* Fecha y Horario en Cuadrícula Compacta de 2 Columnas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Fecha Programada */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bubble font-bold text-slate-700">
                        Fecha Programada *
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, date: todayStr })}
                        className="text-[10px] text-purple-600 font-bold hover:underline cursor-pointer"
                      >
                        Establecer Hoy
                      </button>
                    </div>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-[#ECEEF2] border border-white/80 shadow-neuInset text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  {/* Horario Programado */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bubble font-bold text-slate-700 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-purple-600" />
                        <span>Horario</span>
                      </label>
                      <label className="inline-flex items-center gap-1 cursor-pointer text-[10px] text-slate-500 font-medium">
                        <input
                          type="checkbox"
                          checked={hasSpecificTime}
                          onChange={(e) => setHasSpecificTime(e.target.checked)}
                          className="w-3 h-3 accent-purple-600 rounded cursor-pointer"
                        />
                        <span>Con hora</span>
                      </label>
                    </div>

                    {hasSpecificTime ? (
                      <div className="flex items-center gap-1">
                        <select
                          value={selectedHour}
                          onChange={(e) => setSelectedHour(e.target.value)}
                          className="flex-1 px-2 py-1.5 rounded-xl bg-[#ECEEF2] border border-white shadow-neuInset text-xs font-mono font-bold text-slate-800 focus:outline-none cursor-pointer"
                        >
                          {TIME_HOURS.map((h) => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                        <span className="font-bold text-slate-400">:</span>
                        <select
                          value={selectedMinute}
                          onChange={(e) => setSelectedMinute(e.target.value)}
                          className="flex-1 px-2 py-1.5 rounded-xl bg-[#ECEEF2] border border-white shadow-neuInset text-xs font-mono font-bold text-slate-800 focus:outline-none cursor-pointer"
                        >
                          {TIME_MINUTES.map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                        <div className="flex rounded-xl bg-[#ECEEF2] p-0.5 border border-white shadow-neuInset shrink-0">
                          <button
                            type="button"
                            onClick={() => setSelectedPeriod('AM')}
                            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                              selectedPeriod === 'AM' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600'
                            }`}
                          >
                            AM
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedPeriod('PM')}
                            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                              selectedPeriod === 'PM' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600'
                            }`}
                          >
                            PM
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 font-sans">
                        Todo el día
                      </div>
                    )}
                  </div>
                </div>

                {/* Notificación Push Sonora con Campanita */}
                <div className="p-2.5 rounded-2xl bg-gradient-to-r from-purple-50/80 via-pink-50/50 to-purple-50/80 border border-purple-200/80 shadow-xs flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <BellRing className="w-3.5 h-3.5 text-fio-yellow" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bubble font-bold text-[11px] text-slate-900 block truncate">
                        Campanita Sonora &amp; Alerta Push
                      </span>
                      <p className="text-[10px] text-slate-500 font-sans truncate">
                        Notificación armónica en el dispositivo
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleTestBell}
                      title="Probar sonido armónico de campana"
                      className="px-2 py-1 rounded-lg bg-white border border-purple-200 text-purple-700 hover:bg-purple-100 font-bubble font-bold text-[10px] flex items-center gap-0.5 shadow-xs transition-all cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3 text-purple-600" />
                      <span>Probar</span>
                    </button>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableBellNotification}
                        onChange={(e) => setEnableBellNotification(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4.5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>

              {/* Selector Visual de Prioridad */}
              <div>
                <label className="block text-xs font-bubble font-bold text-slate-700 mb-1.5">
                  Nivel de Prioridad
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['alta', 'media', 'baja'] as AgendaPriority[]).map((priKey) => {
                    const pri = PRIORITY_CONFIG[priKey];
                    const isSelected = formData.priority === priKey;

                    return (
                      <button
                        key={priKey}
                        type="button"
                        onClick={() => setFormData({ ...formData, priority: priKey })}
                        className={`py-2 px-2.5 rounded-xl text-center border text-xs font-bubble font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? `${pri.badge} shadow-xs ring-1 ring-purple-400 scale-[1.02]`
                            : 'bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${pri.dot}`} />
                        <span>{pri.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notas y Detalles */}
              <div>
                <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">
                  Notas Adicionales (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre números de guía, personas de contacto o insumos requeridos..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-2xl bg-[#ECEEF2] border border-white/80 shadow-neuInset text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none font-sans"
                />
              </div>

              </div>

              {/* Botones de Acción Fijos al Pie */}
              <div className="flex items-center justify-end gap-2.5 px-5 py-3 border-t border-slate-200/80 shrink-0 bg-[#F1F2F6]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bubble font-semibold text-slate-600 hover:bg-white/80 cursor-pointer transition-all"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-2xl neu-btn-primary text-white font-bubble font-bold text-xs sm:text-sm shadow-neuBtnHover active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Guardando...' : editingItem ? 'Guardar Cambios' : 'Crear en Agenda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Notificación Push Flotante en Pantalla con Campanita */}
      {activeBellToast && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 max-w-sm w-full bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-2xl border-2 border-purple-400 animate-in slide-in-from-top-4 duration-300 flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 shadow-xs">
            <BellRing className="w-5 h-5 text-purple-600 animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bubble font-bold text-purple-600 uppercase tracking-wider flex items-center gap-1">
                <span>🔔 Notificación de Agenda</span>
              </span>
              <button
                type="button"
                onClick={() => setActiveBellToast(null)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="font-bubble font-bold text-xs text-slate-800 dark:text-white line-clamp-1 mt-0.5">
              {activeBellToast.title}
            </p>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              {activeBellToast.time ? `⏰ ${activeBellToast.time} · ` : ''}📅 {activeBellToast.date}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Subcomponente: Fila Ejecutiva de Lista (List View)
interface AgendaListItemProps {
  item: AgendaItem;
  todayStr: string;
  onToggle: (item: AgendaItem) => void;
  onEdit: (item: AgendaItem) => void;
  onDelete: (id: string) => void;
}

const AgendaListItem: React.FC<AgendaListItemProps> = ({
  item,
  todayStr,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const confirm = useConfirm();
  const cat = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.recordatorio;
  const pri = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.media;
  const CatIcon = cat.icon;
  const isDone = item.status === 'completed';
  const isToday = item.date === todayStr;
  const isOverdue = !isDone && item.date < todayStr;

  return (
    <div
      className={`group p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
        isDone
          ? 'bg-slate-50/70 border-slate-200/70 opacity-65'
          : isToday
          ? 'bg-white border-pink-300 shadow-[0_2px_12px_rgba(236,72,153,0.08)] ring-1 ring-pink-100'
          : isOverdue
          ? 'bg-amber-50/40 border-amber-300 shadow-xs'
          : 'bg-white border-slate-200/90 hover:border-purple-300 shadow-xs'
      }`}
    >
      {/* Lado Izquierdo: Checkbox y Detalles */}
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={() => onToggle(item)}
          className="mt-0.5 cursor-pointer text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
          title={isDone ? 'Marcar como pendiente' : 'Marcar como completada'}
        >
          {isDone ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
          ) : (
            <Circle className="w-5 h-5 hover:text-purple-600" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {/* Badge de Categoría */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cat.bg} ${cat.color} ${cat.border}`}>
              <CatIcon className="w-3 h-3 shrink-0" />
              <span>{cat.label}</span>
            </span>

            {/* Badge de Fecha */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-mono font-bold border ${
                isToday
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : isOverdue
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <CalendarIcon className="w-3 h-3" />
              <span>{isToday ? 'Hoy' : isOverdue ? `Atrasada (${item.date})` : formatDateReadable(item.date)}</span>
            </span>

            {item.time && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500">
                <Clock className="w-3 h-3" />
                <span>{item.time}</span>
              </span>
            )}

            {item.notifyBell && (
              <button
                type="button"
                onClick={() => playAgendaBellSound(0.4)}
                title="Campanita sonora activada - Clic para escuchar sonido"
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-all cursor-pointer"
              >
                <Bell className="w-3 h-3 text-purple-600 animate-pulse" />
                <span>Campanita</span>
              </button>
            )}

            {/* Indicador de Prioridad Alta */}
            {item.priority === 'alta' && !isDone && (
              <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.2 rounded-full border border-rose-200">
                Urgente
              </span>
            )}
          </div>

          <h4 className={`font-bubble font-bold text-xs sm:text-sm leading-snug ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
            {item.title}
          </h4>

          {item.notes && (
            <p className="text-[11px] text-slate-500 font-sans mt-0.5 line-clamp-1 leading-relaxed">
              {item.notes}
            </p>
          )}
        </div>
      </div>

      {/* Lado Derecho: Acciones Rápidas */}
      <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => onEdit(item)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-all cursor-pointer"
          title="Editar actividad"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={async () => {
            if (await confirm(`¿Eliminar "${item.title}" de la agenda?`, { title: 'Eliminar Actividad', confirmLabel: 'Eliminar' })) {
              onDelete(item.id);
            }
          }}
          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
          title="Eliminar actividad"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// Subcomponente: Tarjeta Neumórfica (Grid View)
interface AgendaCardItemProps {
  item: AgendaItem;
  todayStr: string;
  onToggle: (item: AgendaItem) => void;
  onEdit: (item: AgendaItem) => void;
  onDelete: (id: string) => void;
}

const AgendaCardItem: React.FC<AgendaCardItemProps> = ({
  item,
  todayStr,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const confirm = useConfirm();
  const cat = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.recordatorio;
  const pri = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.media;
  const CatIcon = cat.icon;
  const isDone = item.status === 'completed';
  const isToday = item.date === todayStr;

  return (
    <div
      className={`rounded-3xl border transition-all p-4 flex flex-col justify-between shadow-neuCard ${
        isDone
          ? 'bg-slate-50/70 border-white/60 opacity-70'
          : isToday
          ? 'bg-[#F1F2F6] border-pink-300 ring-2 ring-pink-100 shadow-neuCardHover'
          : 'bg-[#F1F2F6] border-white/90 hover:shadow-neuCardHover'
      }`}
    >
      <div>
        {/* Cabecera */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${cat.bg} ${cat.color} ${cat.border}`}>
            <CatIcon className="w-3 h-3 shrink-0" />
            <span>{cat.label}</span>
          </span>

          <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold border ${pri.badge}`}>
            {pri.label}
          </span>
        </div>

        {/* Checkbox y Título */}
        <div className="flex items-start gap-2.5 my-2">
          <button
            type="button"
            onClick={() => onToggle(item)}
            className="mt-0.5 cursor-pointer text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
            title={isDone ? 'Marcar como pendiente' : 'Marcar como completada'}
          >
            {isDone ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
            ) : (
              <Circle className="w-5 h-5 hover:text-purple-600" />
            )}
          </button>

          <div className="min-w-0">
            <h3 className={`font-bubble font-bold text-sm text-slate-900 leading-snug ${isDone ? 'line-through text-slate-400' : ''}`}>
              {item.title}
            </h3>

            {item.notes && (
              <p className="text-xs text-slate-500 font-sans mt-1 leading-relaxed line-clamp-3">
                {item.notes}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Pie con Fecha y Botones */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-200/70 text-xs text-slate-500">
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className={`flex items-center gap-1 font-semibold ${isToday ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
            <CalendarIcon className="w-3 h-3" />
            <span>{isToday ? 'Hoy' : formatDateReadable(item.date)}</span>
          </span>
          {item.time && (
            <span className="flex items-center gap-1 text-slate-500">
              <Clock className="w-3 h-3" />
              <span>{item.time}</span>
            </span>
          )}
          {item.notifyBell && (
            <button
              type="button"
              onClick={() => playAgendaBellSound(0.4)}
              title="Campanita sonora activada - Clic para escuchar sonido"
              className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors cursor-pointer"
            >
              <Bell className="w-3 h-3 animate-pulse" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-white transition-all cursor-pointer"
            title="Editar actividad"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={async () => {
              if (await confirm(`¿Eliminar "${item.title}" de la agenda?`, { title: 'Eliminar Actividad', confirmLabel: 'Eliminar' })) {
                onDelete(item.id);
              }
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-white transition-all cursor-pointer"
            title="Eliminar actividad"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
