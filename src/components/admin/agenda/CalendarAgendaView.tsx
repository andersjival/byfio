import React, { useState, useMemo, useEffect } from 'react';
import {
  CalendarViewType,
  TimeIntervalType,
  TeamFilterType,
  BlockedSpace,
  DEFAULT_LUNCH_BREAK,
  TIME_SLOTS_60,
  TEAM_MEMBERS,
} from './agendaCalendarTypes';
import { CalendarTopBar } from './CalendarTopBar';
import { BlockSpaceModal } from './BlockSpaceModal';
import { CalendarSyncModal } from './CalendarSyncModal';
import { AgendaItem, AgendaCategory, Workshop } from '../../../types';
import {
  Plus,
  Clock,
  CheckCircle2,
  Circle,
  Edit3,
  Trash2,
  GraduationCap,
  Package,
  Scissors,
  Truck,
  Bell,
  Lock,
  Settings,
  Sparkles,
  Info,
} from 'lucide-react';

const MONTHS_SHORT = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'
];
const DAYS_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const CATEGORY_COLORS: Record<AgendaCategory, { bg: string; text: string; border: string; icon: any }> = {
  taller: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', icon: GraduationCap },
  entrega: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300', icon: Package },
  produccion: { bg: 'bg-sky-100', text: 'text-sky-800', border: 'border-sky-300', icon: Scissors },
  proveedor: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300', icon: Truck },
  recordatorio: { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300', icon: Bell },
};

const BLOCKED_STORAGE_KEY = 'byfio_blocked_spaces_v1';

// Normaliza cualquier string de hora para agruparlo en el bucket de hora (e.g. "09:00 AM" -> "9:00 AM")
function getHourBucket(timeStr?: string): string | null {
  if (!timeStr || !timeStr.trim()) return null;
  const clean = timeStr.trim().toUpperCase();
  const isPM = clean.includes('PM');
  const isAM = clean.includes('AM');
  const numbers = clean.replace(/[^0-9:]/g, '').split(':');
  let hour = parseInt(numbers[0], 10);
  if (isNaN(hour)) return null;

  if (isPM && hour < 12) hour += 12;
  if (isAM && hour === 12) hour = 0;

  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:00 ${period}`;
}

function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getWeekDays(referenceDate: Date): Date[] {
  const d = new Date(referenceDate);
  const day = d.getDay();
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(d);
  monday.setDate(d.getDate() - diffToMonday);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    days.push(dayDate);
  }
  return days;
}

interface CalendarAgendaViewProps {
  agendaItems: AgendaItem[];
  workshops?: Workshop[];
  onAddNewItem: (initialDate?: string, initialTime?: string) => void;
  onEditItem: (item: AgendaItem) => void;
  onToggleStatus: (item: AgendaItem) => void;
  onDeleteItem: (id: string) => void;
}

export const CalendarAgendaView: React.FC<CalendarAgendaViewProps> = ({
  agendaItems,
  workshops = [],
  onAddNewItem,
  onEditItem,
  onToggleStatus,
  onDeleteItem,
}) => {
  // Estado de vista y filtros
  const [viewType, setViewType] = useState<CalendarViewType>('weekly');
  const [interval, setInterval] = useState<TimeIntervalType>('60');
  const [teamFilter, setTeamFilter] = useState<TeamFilterType>('all');
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  // Estado de Bloqueos de Espacio (Almuerzo y personalizados)
  const [blockedSpaces, setBlockedSpaces] = useState<BlockedSpace[]>(() => {
    try {
      const saved = localStorage.getItem(BLOCKED_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [DEFAULT_LUNCH_BREAK];
  });

  // Modales
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [editingBlockSpace, setEditingBlockSpace] = useState<BlockedSpace | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Persistir bloqueos
  const saveBlockedSpaces = (spaces: BlockedSpace[]) => {
    setBlockedSpaces(spaces);
    try {
      localStorage.setItem(BLOCKED_STORAGE_KEY, JSON.stringify(spaces));
    } catch {}
  };

  const handleSaveBlockSpace = (space: BlockedSpace) => {
    const exists = blockedSpaces.some((b) => b.id === space.id);
    let updated: BlockedSpace[];
    if (exists) {
      updated = blockedSpaces.map((b) => (b.id === space.id ? space : b));
    } else {
      updated = [...blockedSpaces, space];
    }
    saveBlockedSpaces(updated);
  };

  const handleDeleteBlockSpace = (id: string) => {
    const updated = blockedSpaces.filter((b) => b.id !== id);
    saveBlockedSpaces(updated);
  };

  // Cálculo de días de la semana activa
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);
  const todayKey = useMemo(() => formatDateKey(new Date()), []);

  // Etiqueta de rango de fechas
  const dateRangeLabel = useMemo(() => {
    if (viewType === 'weekly') {
      const first = weekDays[0];
      const last = weekDays[6];
      const firstMonth = MONTHS_SHORT[first.getMonth()];
      const lastMonth = MONTHS_SHORT[last.getMonth()];

      if (firstMonth === lastMonth) {
        return `${first.getDate()} ${firstMonth} - ${last.getDate()} ${lastMonth}`;
      }
      return `${first.getDate()} ${firstMonth} - ${last.getDate()} ${lastMonth}`;
    } else {
      // Vista Diaria
      const dayName = DAYS_NAMES[(currentDate.getDay() + 6) % 7];
      return `${dayName}, ${currentDate.getDate()} ${MONTHS_SHORT[currentDate.getMonth()]}`;
    }
  }, [viewType, weekDays, currentDate]);

  const isCurrentPeriod = useMemo(() => {
    if (viewType === 'weekly') {
      return weekDays.some((d) => formatDateKey(d) === todayKey);
    }
    return formatDateKey(currentDate) === todayKey;
  }, [viewType, weekDays, currentDate, todayKey]);

  // Navegación de Fechas
  const handlePrevDate = () => {
    const next = new Date(currentDate);
    if (viewType === 'weekly') {
      next.setDate(next.getDate() - 7);
    } else {
      next.setDate(next.getDate() - 1);
    }
    setCurrentDate(next);
  };

  const handleNextDate = () => {
    const next = new Date(currentDate);
    if (viewType === 'weekly') {
      next.setDate(next.getDate() + 7);
    } else {
      next.setDate(next.getDate() + 1);
    }
    setCurrentDate(next);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Citas del período activo
  const activePeriodAppointments = useMemo(() => {
    if (viewType === 'weekly') {
      const weekKeys = new Set(weekDays.map(formatDateKey));
      return agendaItems.filter((item) => weekKeys.has(item.date));
    }
    const currentKey = formatDateKey(currentDate);
    return agendaItems.filter((item) => item.date === currentKey);
  }, [viewType, weekDays, currentDate, agendaItems]);

  // Horas a mostrar en el grid
  const timeRows = TIME_SLOTS_60;

  // Busca el receso de almuerzo configurado
  const lunchBreak = useMemo(() => {
    return blockedSpaces.find((b) => b.id === 'lunch-default' || b.title.includes('ALMUERZO')) || DEFAULT_LUNCH_BREAK;
  }, [blockedSpaces]);

  return (
    <div className="space-y-3 font-sans">
      {/* 1. Barra Superior Idéntica a la Imagen de Referencia */}
      <CalendarTopBar
        viewType={viewType}
        onViewTypeChange={setViewType}
        interval={interval}
        onIntervalChange={setInterval}
        dateRangeLabel={dateRangeLabel}
        onPrevDate={handlePrevDate}
        onNextDate={handleNextDate}
        onToday={handleToday}
        isCurrentPeriod={isCurrentPeriod}
        teamFilter={teamFilter}
        onTeamFilterChange={setTeamFilter}
        appointmentsCount={activePeriodAppointments.length}
        onOpenBlockSpaceModal={() => {
          setEditingBlockSpace(null);
          setIsBlockModalOpen(true);
        }}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
      />

      {/* 2. Cuadrícula del Calendario */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-neuCard overflow-hidden">
        <div className="overflow-x-auto min-w-full">
          {viewType === 'weekly' ? (
            /* ============================================================ */
            /* VISTA SEMANAL (7 COLUMNAS: LUNES A DOMINGO)                 */
            /* ============================================================ */
            <table className="w-full border-collapse min-w-[950px] table-fixed">
              <thead>
                <tr className="border-b border-slate-200 bg-[#FAF9FC]">
                  {/* Columna Hora */}
                  <th className="w-20 sm:w-24 p-3 text-center text-xs font-bubble font-bold text-slate-500 border-r border-slate-200">
                    Hora
                  </th>

                  {/* 7 Columnas de Días */}
                  {weekDays.map((dayDate, idx) => {
                    const dayKey = formatDateKey(dayDate);
                    const isToday = dayKey === todayKey;
                    const isSunday = idx === 6;
                    const dayName = DAYS_NAMES[idx];
                    const monthName = MONTHS_SHORT[dayDate.getMonth()];
                    const dayNum = dayDate.getDate();

                    // Citas del día
                    const dayAppointments = agendaItems.filter((i) => i.date === dayKey);

                    return (
                      <th
                        key={dayKey}
                        className={`p-2.5 sm:p-3 text-left transition-all border-r border-slate-200 last:border-r-0 ${
                          isToday
                            ? 'bg-blue-50/70 border-b-2 border-b-blue-500 ring-2 ring-blue-400/40'
                            : isSunday
                            ? 'bg-slate-50/50'
                            : 'bg-[#FAF9FC]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          {/* Nombre del Día y Mes */}
                          <div className="min-w-0">
                            <span className="font-bubble font-bold text-xs sm:text-sm text-slate-900 block truncate">
                              {dayName}
                            </span>
                            <span className="text-[11px] text-slate-400 font-sans block -mt-0.5">
                              {monthName}
                            </span>
                          </div>

                          {/* Número del Día (Pastilla resaltada en el día de hoy) */}
                          <div className="flex items-center gap-1 shrink-0">
                            {isSunday ? (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                                Cerrado {dayNum}
                              </span>
                            ) : (
                              <span
                                className={`w-6 h-6 rounded-lg text-xs font-bubble font-bold flex items-center justify-center transition-all ${
                                  isToday
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-slate-200/80 text-slate-700'
                                }`}
                              >
                                {dayNum}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Etiqueta de Receso o Citas */}
                        <div className="mt-1 flex items-center justify-between text-[10px]">
                          {isSunday ? (
                            <span className="text-slate-400 font-sans">0 citas</span>
                          ) : (
                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200/80 text-amber-800 font-mono font-semibold">
                              <span>🍴</span>
                              <span>{lunchBreak.startTime}</span>
                            </div>
                          )}
                          {dayAppointments.length > 0 && !isSunday && (
                            <span className="text-purple-600 font-bold font-mono">
                              {dayAppointments.length} cita{dayAppointments.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {timeRows.map((hourLabel) => {
                  const isMiddayLunchSlot = hourLabel === '12:00 PM' || hourLabel === '1:00 PM';

                  return (
                    <tr key={hourLabel} className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors">
                      {/* Columna Hora */}
                      <td className="p-3 text-center text-xs font-mono font-bold text-slate-500 border-r border-slate-200 align-top bg-slate-50/20">
                        {hourLabel}
                      </td>

                      {/* 7 Celdas de Día */}
                      {weekDays.map((dayDate, dayIdx) => {
                        const dayKey = formatDateKey(dayDate);
                        const isSunday = dayIdx === 6;
                        const isToday = dayKey === todayKey;

                        // Filtrar citas en este día y hora
                        const cellItems = agendaItems.filter((item) => {
                          if (item.date !== dayKey) return false;
                          const bucket = getHourBucket(item.time);
                          return bucket === hourLabel;
                        });

                        // Bloqueo de almuerzo en 12:00 PM y 1:00 PM
                        const showLunchCard = isMiddayLunchSlot;

                        // Bloqueos personalizados para este día y hora
                        const customBlocks = blockedSpaces.filter((b) => {
                          if (b.id === 'lunch-default' || b.title.includes('ALMUERZO')) return false;
                          if (b.isRecurringDaily || b.date === dayKey) {
                            const bucket = getHourBucket(b.startTime);
                            return bucket === hourLabel;
                          }
                          return false;
                        });

                        return (
                          <td
                            key={`${dayKey}-${hourLabel}`}
                            className={`p-1.5 sm:p-2 border-r border-slate-100 last:border-r-0 align-top relative group min-h-[64px] ${
                              isToday ? 'bg-blue-50/15' : isSunday ? 'bg-slate-50/30' : ''
                            }`}
                          >
                            <div className="space-y-1.5 min-h-[50px] flex flex-col justify-between">
                              {/* 1. Tarjeta Estilo Rayas Diagonales de Receso de Almuerzo */}
                              {showLunchCard && (
                                <div
                                  style={{
                                    backgroundImage:
                                      'repeating-linear-gradient(45deg, rgba(254, 243, 199, 0.75), rgba(254, 243, 199, 0.75) 8px, rgba(254, 240, 138, 0.35) 8px, rgba(254, 240, 138, 0.35) 16px)',
                                  }}
                                  className="p-2 rounded-xl border border-amber-400/90 shadow-xs text-amber-900 flex flex-col justify-between transition-all hover:border-amber-500"
                                >
                                  <div className="flex items-center gap-1 text-[10px] font-bubble font-bold leading-tight uppercase">
                                    <span className="text-amber-800">🍴</span>
                                    <span className="truncate">
                                      {lunchBreak.title} {lunchBreak.startTime} - {lunchBreak.endTime}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-[9px] mt-1 pt-1 border-t border-amber-300/60 font-sans text-amber-800">
                                    <span>{lunchBreak.scopeLabel}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingBlockSpace(lunchBreak);
                                        setIsBlockModalOpen(true);
                                      }}
                                      className="flex items-center gap-0.5 hover:text-amber-950 font-bold hover:underline cursor-pointer"
                                      title="Ajustar horario o alcance de receso"
                                    >
                                      <Settings className="w-2.5 h-2.5" />
                                      <span>Ajustes</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* 2. Bloqueos Personalizados */}
                              {customBlocks.map((blk) => (
                                <div
                                  key={blk.id}
                                  className="p-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 text-[10px] shadow-xs flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-1 font-bubble font-bold truncate">
                                    <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                                    <span className="truncate">{blk.title}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingBlockSpace(blk);
                                      setIsBlockModalOpen(true);
                                    }}
                                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                                  >
                                    <Settings className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}

                              {/* 3. Citas & Actividades en este slot */}
                              {cellItems.map((item) => {
                                const cat = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.recordatorio;
                                const CatIcon = cat.icon;
                                const isDone = item.status === 'completed';

                                return (
                                  <div
                                    key={item.id}
                                    onClick={() => onEditItem(item)}
                                    className={`p-2 rounded-xl border text-xs shadow-xs transition-all cursor-pointer group/item flex flex-col justify-between ${
                                      isDone
                                        ? 'bg-slate-100 border-slate-200 opacity-60'
                                        : `${cat.bg} ${cat.border} hover:shadow-md hover:scale-[1.01]`
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-1">
                                      <div className="flex items-center gap-1 min-w-0">
                                        <CatIcon className={`w-3 h-3 shrink-0 ${cat.text}`} />
                                        <span className={`font-bubble font-bold text-[11px] truncate ${cat.text} ${isDone ? 'line-through' : ''}`}>
                                          {item.title}
                                        </span>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onToggleStatus(item);
                                        }}
                                        className="text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                                        title={isDone ? 'Marcar pendiente' : 'Marcar completado'}
                                      >
                                        {isDone ? (
                                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        ) : (
                                          <Circle className="w-3.5 h-3.5" />
                                        )}
                                      </button>
                                    </div>

                                    {item.time && (
                                      <div className="flex items-center justify-between text-[10px] font-mono mt-1 text-slate-500">
                                        <span className="flex items-center gap-0.5">
                                          <Clock className="w-2.5 h-2.5" />
                                          <span>{item.time}</span>
                                        </span>
                                        {item.priority === 'alta' && (
                                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}

                              {/* 4. Botón Hover para Agendar en Celda Vacía */}
                              {!showLunchCard && cellItems.length === 0 && (
                                <button
                                  type="button"
                                  onClick={() => onAddNewItem(dayKey, hourLabel)}
                                  className="w-full py-2.5 rounded-xl border border-dashed border-transparent hover:border-purple-300 hover:bg-purple-50/50 text-purple-600 opacity-0 group-hover:opacity-100 transition-all font-bubble font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Agendar</span>
                                </button>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            /* ============================================================ */
            /* VISTA DIARIA (DÍA SELECCIONADO: DETALLE / EQUIPO)           */
            /* ============================================================ */
            <div className="p-4 space-y-4">
              {/* Encabezado del Día */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex flex-col items-center justify-center shadow-xs">
                    <span className="text-[10px] uppercase font-bold tracking-wider">
                      {MONTHS_SHORT[currentDate.getMonth()]}
                    </span>
                    <span className="text-lg font-bubble font-bold leading-none">
                      {currentDate.getDate()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bubble font-bold text-base sm:text-lg text-slate-900 leading-tight">
                      {DAYS_NAMES[(currentDate.getDay() + 6) % 7]}, {currentDate.getDate()} de {MONTHS_SHORT[currentDate.getMonth()]}
                    </h3>
                    <p className="text-xs text-slate-500 font-sans">
                      {activePeriodAppointments.length} cita{activePeriodAppointments.length === 1 ? '' : 's'} programada{activePeriodAppointments.length === 1 ? '' : 's'} para este día
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onAddNewItem(formatDateKey(currentDate), '10:00 AM')}
                  className="px-4 py-2 rounded-2xl neu-btn-primary text-white font-bubble font-bold text-xs flex items-center gap-1.5 shadow-neuBtnHover cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nueva Cita Hoy</span>
                </button>
              </div>

              {/* Grid Horario Detallado para Vista Diaria */}
              <table className="w-full border-collapse table-fixed">
                <thead>
                  <tr className="border-b border-slate-200 bg-[#FAF9FC]">
                    <th className="w-24 p-3 text-center text-xs font-bubble font-bold text-slate-500 border-r border-slate-200">
                      Hora
                    </th>
                    {teamFilter === 'all' ? (
                      <>
                        <th className="p-3 text-left text-xs font-bubble font-bold text-purple-900 bg-purple-50/50 border-r border-slate-200">
                          Fiorella Brenes (Diseño &amp; Admin)
                        </th>
                        <th className="p-3 text-left text-xs font-bubble font-bold text-sky-900 bg-sky-50/50">
                          Taller Creativo &amp; Envíos
                        </th>
                      </>
                    ) : (
                      <th className="p-3 text-left text-xs font-bubble font-bold text-slate-800">
                        {TEAM_MEMBERS.find((m) => m.id === teamFilter)?.name || 'Agenda del Día'}
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {timeRows.map((hourLabel) => {
                    const isMiddayLunchSlot = hourLabel === '12:00 PM' || hourLabel === '1:00 PM';
                    const dayKey = formatDateKey(currentDate);

                    const hourItems = agendaItems.filter((i) => {
                      if (i.date !== dayKey) return false;
                      return getHourBucket(i.time) === hourLabel;
                    });

                    return (
                      <tr key={`daily-${hourLabel}`} className="border-b border-slate-100 hover:bg-slate-50/30">
                        <td className="p-3 text-center text-xs font-mono font-bold text-slate-500 border-r border-slate-200 align-top bg-slate-50/20">
                          {hourLabel}
                        </td>

                        {teamFilter === 'all' ? (
                          <>
                            {/* Columna Fiorella */}
                            <td className="p-2 border-r border-slate-100 align-top">
                              {isMiddayLunchSlot ? (
                                <div
                                  style={{
                                    backgroundImage:
                                      'repeating-linear-gradient(45deg, rgba(254, 243, 199, 0.75), rgba(254, 243, 199, 0.75) 8px, rgba(254, 240, 138, 0.35) 8px, rgba(254, 240, 138, 0.35) 16px)',
                                  }}
                                  className="p-2.5 rounded-xl border border-amber-400 text-amber-900 text-xs font-bubble font-bold flex items-center justify-between"
                                >
                                  <span>🍴 {lunchBreak.title} {lunchBreak.startTime} - {lunchBreak.endTime}</span>
                                  <span className="text-[10px] font-sans font-normal">{lunchBreak.scopeLabel}</span>
                                </div>
                              ) : (
                                <div className="space-y-1.5">
                                  {hourItems
                                    .filter((i) => i.category === 'recordatorio' || i.category === 'proveedor')
                                    .map((item) => (
                                      <div
                                        key={item.id}
                                        onClick={() => onEditItem(item)}
                                        className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-xs cursor-pointer hover:shadow-sm"
                                      >
                                        <div className="font-bubble font-bold text-purple-900">{item.title}</div>
                                        {item.notes && <div className="text-[11px] text-purple-700 font-sans mt-0.5">{item.notes}</div>}
                                      </div>
                                    ))}
                                </div>
                              )}
                            </td>

                            {/* Columna Taller & Envíos */}
                            <td className="p-2 align-top">
                              {isMiddayLunchSlot ? (
                                <div
                                  style={{
                                    backgroundImage:
                                      'repeating-linear-gradient(45deg, rgba(254, 243, 199, 0.75), rgba(254, 243, 199, 0.75) 8px, rgba(254, 240, 138, 0.35) 8px, rgba(254, 240, 138, 0.35) 16px)',
                                  }}
                                  className="p-2.5 rounded-xl border border-amber-400 text-amber-900 text-xs font-bubble font-bold flex items-center justify-between"
                                >
                                  <span>🍴 {lunchBreak.title} {lunchBreak.startTime} - {lunchBreak.endTime}</span>
                                  <span className="text-[10px] font-sans font-normal">{lunchBreak.scopeLabel}</span>
                                </div>
                              ) : (
                                <div className="space-y-1.5">
                                  {hourItems
                                    .filter((i) => i.category === 'taller' || i.category === 'entrega' || i.category === 'produccion')
                                    .map((item) => (
                                      <div
                                        key={item.id}
                                        onClick={() => onEditItem(item)}
                                        className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-xs cursor-pointer hover:shadow-sm"
                                      >
                                        <div className="font-bubble font-bold text-sky-900">{item.title}</div>
                                        {item.notes && <div className="text-[11px] text-sky-700 font-sans mt-0.5">{item.notes}</div>}
                                      </div>
                                    ))}
                                </div>
                              )}
                            </td>
                          </>
                        ) : (
                          /* Columna Única Amplia */
                          <td className="p-2 align-top">
                            {isMiddayLunchSlot ? (
                              <div
                                style={{
                                  backgroundImage:
                                    'repeating-linear-gradient(45deg, rgba(254, 243, 199, 0.75), rgba(254, 243, 199, 0.75) 8px, rgba(254, 240, 138, 0.35) 8px, rgba(254, 240, 138, 0.35) 16px)',
                                }}
                                className="p-3 rounded-xl border border-amber-400 text-amber-900 text-xs font-bubble font-bold flex items-center justify-between"
                              >
                                <span>🍴 {lunchBreak.title} {lunchBreak.startTime} - {lunchBreak.endTime}</span>
                                <span className="text-[11px] font-sans font-normal">{lunchBreak.scopeLabel}</span>
                              </div>
                            ) : (
                              <div className="space-y-1.5">
                                {hourItems.map((item) => (
                                  <div
                                    key={item.id}
                                    onClick={() => onEditItem(item)}
                                    className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-purple-300"
                                  >
                                    <div>
                                      <div className="font-bubble font-bold text-xs sm:text-sm text-slate-900">{item.title}</div>
                                      {item.notes && <p className="text-xs text-slate-500 font-sans mt-0.5">{item.notes}</p>}
                                    </div>
                                    <span className="text-xs font-mono text-purple-700 font-bold">{item.time}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Bloqueo de Espacio */}
      <BlockSpaceModal
        isOpen={isBlockModalOpen}
        onClose={() => {
          setIsBlockModalOpen(false);
          setEditingBlockSpace(null);
        }}
        onSave={handleSaveBlockSpace}
        onDelete={handleDeleteBlockSpace}
        initialSpace={editingBlockSpace}
        selectedDate={formatDateKey(currentDate)}
      />

      {/* Modal de Sincronización Google & Apple */}
      <CalendarSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        agendaItems={agendaItems}
      />
    </div>
  );
};
