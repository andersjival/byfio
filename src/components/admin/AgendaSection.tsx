import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AgendaItem, AgendaCategory, AgendaPriority, AgendaStatus } from '../../types';
import {
  Calendar as CalendarIcon, CheckCircle2, Circle, Clock, Plus,
  Trash2, Edit3, Filter, Search, Tag, Sparkles, AlertCircle,
  GraduationCap, Package, Scissors, Truck, Bell, Check, X,
  ChevronRight, CalendarDays, ListTodo
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORY_CONFIG: Record<AgendaCategory, { label: string; icon: any; color: string; bg: string; border: string }> = {
  taller: {
    label: 'Taller Creativo',
    icon: GraduationCap,
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  entrega: {
    label: 'Entrega / Envío',
    icon: Package,
    color: 'text-pink-700',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
  },
  produccion: {
    label: 'Producción & Ensamble',
    icon: Scissors,
    color: 'text-sky-700',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
  },
  proveedor: {
    label: 'Proveedor & Insumos',
    icon: Truck,
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  recordatorio: {
    label: 'Recordatorio / Admin',
    icon: Bell,
    color: 'text-slate-700',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
  },
};

const PRIORITY_CONFIG: Record<AgendaPriority, { label: string; badge: string }> = {
  alta: { label: 'Alta Prioridad', badge: 'bg-rose-100 text-rose-800 border-rose-200' },
  media: { label: 'Prioridad Normal', badge: 'bg-amber-100 text-amber-800 border-amber-200' },
  baja: { label: 'Prioridad Baja', badge: 'bg-slate-100 text-slate-700 border-slate-200' },
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AgendaItem | null>(null);

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

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Sincronización automática de talleres si la funcionalidad está activada en Superadmin
  const showWorkshopSync = isFeatureEnabled('agenda', 'agenda_sync_workshops');
  const showTasksFeature = isFeatureEnabled('agenda', 'agenda_tasks');
  const showCalendarFeature = isFeatureEnabled('agenda', 'agenda_calendar');

  const openNewModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      category: 'recordatorio',
      priority: 'media',
      notes: '',
    });
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
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingItem) {
      updateAgendaItem(editingItem.id, {
        title: formData.title.trim(),
        date: formData.date,
        time: formData.time.trim() || undefined,
        category: formData.category,
        priority: formData.priority,
        notes: formData.notes.trim() || undefined,
      });
    } else {
      addAgendaItem({
        title: formData.title.trim(),
        date: formData.date,
        time: formData.time.trim() || undefined,
        category: formData.category,
        priority: formData.priority,
        status: 'pending',
        notes: formData.notes.trim() || undefined,
      });
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleToggleStatus = (item: AgendaItem) => {
    if (item.status === 'pending') {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#A855F7', '#EC4899', '#10B981'],
      });
    }
    toggleAgendaItemStatus(item.id);
  };

  // Filtrado
  const filteredItems = useMemo(() => {
    return agendaItems.filter((item) => {
      // Filtro de estado / fecha
      if (selectedFilter === 'today' && item.date !== todayStr) return false;
      if (selectedFilter === 'pending' && item.status !== 'pending') return false;
      if (selectedFilter === 'completed' && item.status !== 'completed') return false;

      // Filtro de categoría
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      // Filtro de búsqueda
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchNotes = item.notes?.toLowerCase().includes(q);
        if (!matchTitle && !matchNotes) return false;
      }

      return true;
    });
  }, [agendaItems, selectedFilter, selectedCategory, searchQuery, todayStr]);

  // Contadores
  const pendingCount = agendaItems.filter((i) => i.status === 'pending').length;
  const todayPendingCount = agendaItems.filter((i) => i.status === 'pending' && i.date === todayStr).length;
  const completedCount = agendaItems.filter((i) => i.status === 'completed').length;

  return (
    <div className="space-y-4">
      {/* Cabecera Principal de la Agenda */}
      <div className="bg-gradient-to-r from-purple-900 via-fio-800 to-pink-800 rounded-3xl p-4 sm:p-6 text-white shadow-clayCard">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
              <CalendarIcon className="w-6 h-6 text-fio-yellow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bubble font-bold text-white leading-tight">
                  Agenda &amp; Organizador de Tareas
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/30 text-pink-200 border border-pink-400/40">
                  Taller by.fio
                </span>
              </div>
              <p className="text-xs text-purple-200 font-sans mt-0.5">
                Planifica actividades del taller, entregas de pedidos, compras de insumos y fechas clave.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openNewModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-fio-yellow hover:bg-yellow-300 text-fio-900 font-bubble text-xs font-bold shadow-clayBtn transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nueva Actividad / Tarea</span>
          </button>
        </div>

        {/* Tarjetas KPI de Estado Rápido */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-white/10">
          <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-xs border border-white/10">
            <span className="text-[10px] text-purple-200 font-medium block">Pendientes Totales</span>
            <span className="text-lg font-bubble font-bold text-white">{pendingCount}</span>
          </div>

          <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-xs border border-white/10">
            <span className="text-[10px] text-fio-yellow font-bold block">⏰ Para Hoy</span>
            <span className="text-lg font-bubble font-bold text-fio-yellow">{todayPendingCount}</span>
          </div>

          <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-xs border border-white/10">
            <span className="text-[10px] text-emerald-300 font-medium block">✅ Completadas</span>
            <span className="text-lg font-bubble font-bold text-emerald-300">{completedCount}</span>
          </div>

          <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-xs border border-white/10">
            <span className="text-[10px] text-pink-200 font-medium block">Talleres Sincronizados</span>
            <span className="text-lg font-bubble font-bold text-pink-200">
              {showWorkshopSync ? workshops.length : 'Off'}
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Pestañas de Filtro Rápido */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-semibold transition-all whitespace-nowrap cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-fio-800 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Todas ({agendaItems.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('today')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-semibold transition-all whitespace-nowrap cursor-pointer ${
              selectedFilter === 'today'
                ? 'bg-fio-800 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Hoy ({agendaItems.filter((i) => i.date === todayStr).length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-semibold transition-all whitespace-nowrap cursor-pointer ${
              selectedFilter === 'pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Pendientes ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-semibold transition-all whitespace-nowrap cursor-pointer ${
              selectedFilter === 'completed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Completadas ({completedCount})
          </button>
        </div>

        {/* Buscador y Filtro de Categoría */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="relative min-w-[180px] flex-1">
            <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="Buscar en la agenda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-purple-400 focus:bg-white rounded-xl text-xs outline-none transition-all"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="all">Todas las Categorías</option>
            <option value="taller">🎨 Talleres</option>
            <option value="entrega">📦 Entregas / Envíos</option>
            <option value="produccion">✂️ Producción</option>
            <option value="proveedor">🚚 Proveedores</option>
            <option value="recordatorio">📌 Recordatorios</option>
          </select>
        </div>
      </div>

      {/* Grid Principal de Tarjetas de Agenda */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Talleres Creativos Sincronizados de By.Fio (Si la opción está habilitada en Superadmin) */}
        {showWorkshopSync && selectedCategory === 'all' && selectedFilter !== 'completed' && workshops.map((ws) => (
          <div
            key={`ws-sync-${ws.id}`}
            className="bg-white rounded-2xl border-2 border-dashed border-purple-300 p-4 shadow-xs relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-purple-600" />
                <span>Taller Creativo Programado</span>
              </span>
              <span className="text-[11px] font-bubble font-bold text-slate-500">
                {ws.schedule}
              </span>
            </div>

            <h4 className="font-bubble font-bold text-sm text-slate-900 mb-1 leading-snug">
              {ws.title}
            </h4>
            <p className="text-xs text-slate-500 line-clamp-2 mb-3">
              {ws.subtitle || 'Taller práctico presencial en el estudio de By.Fio en Tibás.'}
            </p>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-purple-100 text-slate-600 font-sans">
              <span className="flex items-center gap-1 font-semibold text-purple-700">
                <CalendarDays className="w-3.5 h-3.5 text-pink-500" />
                <span>{ws.date}</span>
              </span>
              <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-lg text-slate-700 font-mono">
                {ws.totalSpots - ws.spotsAvailable}/{ws.totalSpots} Cupos
              </span>
            </div>
          </div>
        ))}

        {/* Actividades y Tareas de la Agenda */}
        {filteredItems.map((item) => {
          const cat = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.recordatorio;
          const pri = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.media;
          const CatIcon = cat.icon;
          const isToday = item.date === todayStr;
          const isDone = item.status === 'completed';

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all p-4 flex flex-col justify-between shadow-xs ${
                isDone
                  ? 'bg-slate-50/70 border-slate-200 opacity-75'
                  : isToday
                  ? 'bg-white border-pink-300 shadow-[0_4px_20px_rgba(236,72,153,0.06)]'
                  : 'bg-white border-slate-200 hover:border-purple-300'
              }`}
            >
              <div>
                {/* Cabecera de la Tarjeta */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${cat.bg} ${cat.color} ${cat.border}`}>
                    <CatIcon className="w-3 h-3 shrink-0" />
                    <span>{cat.label}</span>
                  </span>

                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${pri.badge}`}>
                    {pri.label}
                  </span>
                </div>

                {/* Título de la Tarea con Checkbox Rápido */}
                <div className="flex items-start gap-2.5 my-2">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(item)}
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
                    <h3 className={`font-bubble font-bold text-sm text-slate-800 leading-snug ${isDone ? 'line-through text-slate-400' : ''}`}>
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

              {/* Pie de la Tarjeta: Fecha, Hora y Acciones */}
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span className={`flex items-center gap-1 font-semibold ${isToday ? 'text-pink-600 font-bold' : 'text-slate-600'}`}>
                    <CalendarIcon className="w-3 h-3" />
                    <span>{isToday ? 'Hoy' : item.date}</span>
                  </span>
                  {item.time && (
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{item.time}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                    title="Editar actividad"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`¿Eliminar la actividad "${item.title}" de la agenda?`)) {
                        deleteAgendaItem(item.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Eliminar actividad"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Estado Vacío */}
      {filteredItems.length === 0 && (!showWorkshopSync || selectedFilter === 'completed') && (
        <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-300 text-slate-400 space-y-3">
          <CalendarIcon className="w-10 h-10 mx-auto text-slate-300" />
          <div>
            <h4 className="font-bubble font-bold text-base text-slate-700">No hay actividades con este filtro</h4>
            <p className="text-xs text-slate-400 mt-1">
              Agrega una nueva actividad con el botón superior para empezar a organizar tu semana.
            </p>
          </div>
          <button
            type="button"
            onClick={openNewModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble text-xs font-bold shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Primera Actividad</span>
          </button>
        </div>
      )}

      {/* Modal de Creación / Edición */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-purple-200 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                  <CalendarIcon className="w-4 h-4" />
                </span>
                <h3 className="font-bubble font-bold text-lg text-slate-900">
                  {editingItem ? 'Editar Actividad' : 'Nueva Actividad de Agenda'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              {/* Título */}
              <div>
                <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">
                  Título de la Actividad o Tarea *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Despacho de libretas en Correos, Taller de encuadernación..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-xs outline-none"
                />
              </div>

              {/* Fecha y Hora */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-purple-500 text-xs outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">
                    Hora (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 10:00 AM, 2:30 PM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-purple-500 text-xs outline-none font-mono"
                  />
                </div>
              </div>

              {/* Categoría y Prioridad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as AgendaCategory })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-purple-500 text-xs outline-none cursor-pointer"
                  >
                    <option value="taller">🎨 Taller Creativo</option>
                    <option value="entrega">📦 Entrega / Envío</option>
                    <option value="produccion">✂️ Producción & Ensamble</option>
                    <option value="proveedor">🚚 Proveedor & Insumos</option>
                    <option value="recordatorio">📌 Recordatorio / Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">
                    Prioridad
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as AgendaPriority })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-purple-500 text-xs outline-none cursor-pointer"
                  >
                    <option value="alta">🔴 Alta Prioridad</option>
                    <option value="media">🟡 Prioridad Normal</option>
                    <option value="baja">⚪ Prioridad Baja</option>
                  </select>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">
                  Notas Adicionales (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles de insumos, número de pedido o recordatorios específicos..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-purple-500 text-xs outline-none resize-none font-sans"
                />
              </div>

              {/* Botones de Acción */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bubble font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bubble text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
                >
                  {editingItem ? 'Guardar Cambios' : 'Crear en Agenda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
