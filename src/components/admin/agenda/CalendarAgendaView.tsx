import React, { useState, useMemo, useEffect } from 'react';
import {
  CalendarViewType,
  TimeIntervalType,
  TeamFilterType,
  BlockedSpace,
  TIME_SLOTS_60,
  TEAM_MEMBERS,
  CalendarTheme,
  CALENDAR_THEMES,
} from './agendaCalendarTypes';
import { CalendarTopBar } from './CalendarTopBar';
import { BlockSpaceModal } from './BlockSpaceModal';
import { CalendarSyncModal } from './CalendarSyncModal';
import { AgendaItem, AgendaCategory, Workshop } from '../../../types';
import { syncCalendarBlockedSpacesToCloud } from '../../../utils/storeConfigSync';
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
const DAYS_NAMES_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

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

function parseTimeToMinutes(timeStr?: string): number | null {
  if (!timeStr || !timeStr.trim()) return null;
  const clean = timeStr.trim().toUpperCase();
  const isPM = clean.includes('PM');
  const isAM = clean.includes('AM');
  const numbers = clean.replace(/[^0-9:]/g, '').split(':');
  let hour = parseInt(numbers[0], 10);
  let min = numbers[1] ? parseInt(numbers[1], 10) : 0;
  if (isNaN(hour)) return null;
  if (isNaN(min)) min = 0;

  if (isPM && hour < 12) hour += 12;
  if (isAM && hour === 12) hour = 0;

  return hour * 60 + min;
}

function isItemInSlot(item: { time?: string; endTime?: string }, slotLabel: string): { matches: boolean; isStart: boolean } {
  if (!item.time || !item.time.trim()) {
    return { matches: false, isStart: false };
  }
  const startBucket = getHourBucket(item.time);
  const isStart = startBucket === slotLabel;

  if (!item.endTime || !item.endTime.trim()) {
    return { matches: isStart, isStart };
  }

  const startMin = parseTimeToMinutes(item.time);
  const endMin = parseTimeToMinutes(item.endTime);
  const slotStartMin = parseTimeToMinutes(slotLabel);

  if (startMin === null || endMin === null || slotStartMin === null || endMin <= startMin) {
    return { matches: isStart, isStart };
  }

  const slotEndMin = slotStartMin + 60;
  const matches = slotStartMin < endMin && slotEndMin > startMin;
  return { matches, isStart };
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
  onSelectItem?: (item: AgendaItem) => void;
  onToggleStatus: (item: AgendaItem) => void;
  onDeleteItem: (id: string) => void;
}

export const CalendarAgendaView: React.FC<CalendarAgendaViewProps> = ({
  agendaItems,
  workshops = [],
  onAddNewItem,
  onEditItem,
  onSelectItem,
  onToggleStatus,
  onDeleteItem,
}) => {
  // Estado de vista y filtros
  const [viewType, setViewType] = useState<CalendarViewType>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'daily';
    }
    return 'weekly';
  });
  const [interval, setInterval] = useState<TimeIntervalType>('60');
  const [teamFilter, setTeamFilter] = useState<TeamFilterType>('all');
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  // Tema de Color Pastel del Calendario con Persistencia
  const [calendarTheme, setCalendarTheme] = useState<CalendarTheme>(() => {
    try {
      const saved = localStorage.getItem('byfio_calendar_theme') as CalendarTheme;
      if (saved && CALENDAR_THEMES[saved]) return saved;
    } catch {}
    return 'celeste';
  });

  const handleSelectTheme = (theme: CalendarTheme) => {
    setCalendarTheme(theme);
    try {
      localStorage.setItem('byfio_calendar_theme', theme);
    } catch {}
  };

  const themeConfig = CALENDAR_THEMES[calendarTheme] || CALENDAR_THEMES.celeste;

    // Estado de Bloqueos de Espacio (Almuerzo y personalizados)
  const [blockedSpaces, setBlockedSpaces] = useState<BlockedSpace[]>(() => {
    try {
      const saved = localStorage.getItem(BLOCKED_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.filter((b: BlockedSpace) => b.id !== 'lunch-default' && !b.title?.includes('ALMUERZO')) : [];
      }
    } catch {}
    return [];
  });

  // Modales
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [editingBlockSpace, setEditingBlockSpace] = useState<BlockedSpace | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Persistir bloqueos en localStorage y Cloudflare D1
  const saveBlockedSpaces = (spaces: BlockedSpace[]) => {
    setBlockedSpaces(spaces);
    try {
      localStorage.setItem(BLOCKED_STORAGE_KEY, JSON.stringify(spaces));
      syncCalendarBlockedSpacesToCloud(spaces);
    } catch {}
  };

  useEffect(() => {
    const onConfigSync = () => {
      try {
        const saved = localStorage.getItem(BLOCKED_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setBlockedSpaces(parsed.filter((b: BlockedSpace) => b.id !== 'lunch-default' && !b.title?.includes('ALMUERZO')));
          }
        }
      } catch {}
    };
    window.addEventListener('byfio_store_config_updated', onConfigSync);
    return () => window.removeEventListener('byfio_store_config_updated', onConfigSync);
  }, []);

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
        currentTheme={calendarTheme}
        onSelectTheme={handleSelectTheme}
        onOpenBlockSpaceModal={() => {
          setEditingBlockSpace(null);
          setIsBlockModalOpen(true);
        }}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
      />

      {/* 2. Cuadrícula del Calendario */}
      <div className="rounded-3xl border shadow-neuCard overflow-hidden transition-colors" style={{ backgroundColor: themeConfig.bgContainer, borderColor: themeConfig.borderTable }}>
        <div className="overflow-auto max-h-[75vh] sm:max-h-[80vh] min-w-full custom-scrollbar touch-auto overscroll-contain">
          {viewType === 'weekly' ? (
            /* ============================================================ */
            /* VISTA SEMANAL (7 COLUMNAS: LUNES A DOMINGO)                 */
            /* ============================================================ */
            <table className="w-full border-separate border-spacing-0 min-w-[700px] sm:min-w-[800px] lg:min-w-full table-fixed">
              <thead>
                <tr>
                  {/* Columna Hora */}
                  <th
                    className="sticky top-0 left-0 z-30 w-16 sm:w-20 p-2 sm:p-3 text-center text-[11px] sm:text-xs font-bubble font-bold text-slate-600 shadow-[2px_2px_4px_rgba(0,0,0,0.06)]"
                    style={{
                      backgroundColor: themeConfig.bgHeader,
                      borderRight: `1px solid ${themeConfig.borderDiv}`,
                      borderBottom: `1px solid ${themeConfig.borderDiv}`,
                    }}
                  >
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
                        className={`sticky top-0 z-20 p-2.5 sm:p-3 text-left transition-all shadow-[0_2px_4px_rgba(0,0,0,0.04)] ${
                          isToday
                            ? 'border-b-2 border-b-blue-500 ring-2 ring-blue-400/40'
                            : ''
                        }`}
                        style={{
                          borderRight: idx === 6 ? 'none' : `1px solid ${themeConfig.borderDiv}`,
                          borderBottom: `1px solid ${themeConfig.borderDiv}`,
                          backgroundColor: isToday
                            ? 'rgba(59, 130, 246, 0.12)'
                            : isSunday
                            ? 'rgba(100, 116, 139, 0.05)'
                            : themeConfig.bgHeader,
                        }}
                      >
                        <div className="flex items-center justify-between gap-1">
                          {/* Nombre del Día y Mes */}
                          <div className="min-w-0">
                            <span className="font-bubble font-bold text-xs sm:text-sm text-slate-900 block truncate">
                              <span className="inline lg:hidden">{DAYS_NAMES_SHORT[idx]}</span>
                              <span className="hidden lg:inline">{dayName}</span>
                            </span>
                            <span className="text-[11px] text-slate-400 font-sans block -mt-0.5">
                              {monthName}
                            </span>
                          </div>

                          {/* Número del Día (Pastilla resaltada en el día de hoy) */}
                          <div className="flex items-center gap-1 shrink-0">
                            {isSunday ? (
                              <span className="px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200 whitespace-nowrap">
                                <span className="inline lg:hidden">{dayNum}</span>
                                <span className="hidden lg:inline">Cerrado {dayNum}</span>
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
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {timeRows.map((hourLabel) => {
                  return (
                    <tr key={hourLabel} className="transition-colors hover:bg-black/[0.015]">
                      {/* Columna Hora */}
                      <td
                        className="sticky left-0 z-10 p-3 text-center text-xs font-mono font-bold text-slate-600 align-top shadow-[2px_0_4px_rgba(0,0,0,0.06)]"
                        style={{
                          borderRight: `1px solid ${themeConfig.borderDiv}`,
                          borderBottom: `1px solid ${themeConfig.borderDiv}`,
                          backgroundColor: themeConfig.bgHourCol,
                        }}
                      >
                        {hourLabel}
                      </td>

                      {/* 7 Celdas de Día */}
                      {weekDays.map((dayDate, dayIdx) => {
                        const dayKey = formatDateKey(dayDate);
                        const isSunday = dayIdx === 6;
                        const isToday = dayKey === todayKey;

                        // Filtrar citas en este día y hora (incluyendo rangos continuos como Talleres Creativos)
                        const cellItems = agendaItems.filter((item) => {
                          if (item.date !== dayKey) return false;
                          return isItemInSlot(item, hourLabel).matches;
                        });

                        // Bloqueos personalizados para este día y hora
                        const customBlocks = blockedSpaces.filter((b) => {
                          if (b.id === 'lunch-default' || b.title.includes('ALMUERZO')) return false;
                          if (b.isRecurringDaily || b.date === dayKey) {
                            return isItemInSlot({ time: b.startTime, endTime: b.endTime }, hourLabel).matches;
                          }
                          return false;
                        });

                        return (
                          <td
                            key={`${dayKey}-${hourLabel}`}
                            className="p-1.5 sm:p-2 align-top relative group min-h-[64px] transition-colors"
                            style={{
                              borderRight: dayIdx === 6 ? 'none' : `1px solid ${themeConfig.borderDiv}`,
                              borderBottom: `1px solid ${themeConfig.borderDiv}`,
                              backgroundColor: isToday
                                ? 'rgba(59, 130, 246, 0.06)'
                                : isSunday
                                ? 'rgba(100, 116, 139, 0.03)'
                                : 'transparent',
                            }}
                          >
                            <div className="space-y-1.5 min-h-[50px] flex flex-col justify-between">
                              {/* 1. Bloqueos Personalizados */}
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
                                const slotCheck = isItemInSlot(item, hourLabel);
                                const isContinuation = !slotCheck.isStart;

                                return (
                                  <div
                                    key={`${item.id}-${hourLabel}`}
                                    onClick={() => (onSelectItem ? onSelectItem(item) : onEditItem(item))}
                                    className={`p-2 rounded-xl border text-xs shadow-xs transition-all cursor-pointer group/item flex flex-col justify-between ${
                                      isDone
                                        ? 'bg-slate-100 border-slate-200 opacity-60'
                                        : isContinuation
                                        ? `${cat.bg} ${cat.border} opacity-95 border-dashed border-2 hover:shadow-md`
                                        : `${cat.bg} ${cat.border} hover:shadow-md hover:scale-[1.01]`
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-1">
                                      <div className="flex items-center gap-1 min-w-0">
                                        <CatIcon className={`w-3 h-3 shrink-0 ${cat.text}`} />
                                        <span className={`font-bubble font-bold text-[11px] truncate ${cat.text} ${isDone ? 'line-through' : ''}`}>
                                          {item.title} {isContinuation && <span className="text-[9px] opacity-75 font-normal">(en curso)</span>}
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

                                    <div className="flex items-center justify-between text-[10px] font-mono mt-1 text-slate-500">
                                      <span className="flex items-center gap-0.5 truncate mr-1">
                                        {item.time && <Clock className="w-2.5 h-2.5 shrink-0" />}
                                        <span className="truncate">
                                          {item.time
                                            ? item.endTime
                                              ? (isContinuation ? `Hasta ${item.endTime}` : `${item.time} - ${item.endTime}`)
                                              : item.time
                                            : 'Ver detalle'}
                                        </span>
                                      </span>
                                      <div className="flex items-center gap-1 shrink-0">
                                        {item.notes && (
                                          <span className="text-[9px] font-sans px-1 rounded bg-white/80 text-purple-700 border border-purple-200/60 font-bold" title="Tiene notas">
                                            📝
                                          </span>
                                        )}
                                        {item.priority === 'alta' && (
                                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}

                              {/* 4. Botón Hover para Agendar en Celda Vacía */}
                              {cellItems.length === 0 && customBlocks.length === 0 && (
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


              </div>

              {/* Grid Horario Detallado para Vista Diaria */}
              <table className="w-full border-separate border-spacing-0 table-fixed">
                <thead>
                  <tr>
                    <th
                      className="sticky top-0 left-0 z-30 w-24 p-3 text-center text-xs font-bubble font-bold text-slate-600 shadow-[2px_2px_4px_rgba(0,0,0,0.06)]"
                      style={{
                        backgroundColor: themeConfig.bgHeader,
                        borderRight: `1px solid ${themeConfig.borderDiv}`,
                        borderBottom: `1px solid ${themeConfig.borderDiv}`,
                      }}
                    >
                      Hora
                    </th>
                    {teamFilter === 'all' ? (
                      <>
                        <th
                          className="sticky top-0 z-20 p-3 text-left text-xs font-bubble font-bold text-purple-900 shadow-[0_2px_4px_rgba(0,0,0,0.04)]"
                          style={{
                            backgroundColor: '#FAF5FF',
                            borderRight: `1px solid ${themeConfig.borderDiv}`,
                            borderBottom: `1px solid ${themeConfig.borderDiv}`,
                          }}
                        >
                          Fiorella Brenes (Diseño &amp; Admin)
                        </th>
                        <th
                          className="sticky top-0 z-20 p-3 text-left text-xs font-bubble font-bold text-sky-900 shadow-[0_2px_4px_rgba(0,0,0,0.04)]"
                          style={{
                            backgroundColor: '#F0F9FF',
                            borderBottom: `1px solid ${themeConfig.borderDiv}`,
                          }}
                        >
                          Taller Creativo &amp; Envíos
                        </th>
                      </>
                    ) : (
                      <th
                        className="sticky top-0 z-20 p-3 text-left text-xs font-bubble font-bold text-slate-800 shadow-[0_2px_4px_rgba(0,0,0,0.04)]"
                        style={{
                          backgroundColor: themeConfig.bgHeader,
                          borderBottom: `1px solid ${themeConfig.borderDiv}`,
                        }}
                      >
                        {TEAM_MEMBERS.find((m) => m.id === teamFilter)?.name || 'Agenda del Día'}
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {timeRows.map((hourLabel) => {                    const dayKey = formatDateKey(currentDate);

                    const hourItems = agendaItems.filter((i) => {
                      if (i.date !== dayKey) return false;
                      return isItemInSlot(i, hourLabel).matches;
                    });

                    return (
                      <tr key={`daily-${hourLabel}`} className="hover:bg-black/[0.015] transition-colors">
                        <td
                        className="sticky left-0 z-10 p-3 text-center text-xs font-mono font-bold text-slate-600 align-top shadow-[2px_0_4px_rgba(0,0,0,0.06)]"
                        style={{
                          borderRight: `1px solid ${themeConfig.borderDiv}`,
                          borderBottom: `1px solid ${themeConfig.borderDiv}`,
                          backgroundColor: themeConfig.bgHourCol,
                        }}
                      >
                          {hourLabel}
                        </td>

                        {teamFilter === 'all' ? (
                          <>
                            {/* Columna Fiorella */}
                            <td className="p-2 align-top" style={{ borderRight: `1px solid ${themeConfig.borderDiv}`, borderBottom: `1px solid ${themeConfig.borderDiv}` }}>
                              <div className="space-y-1.5">
                                {hourItems
                                  .filter((i) => i.category === 'recordatorio' || i.category === 'proveedor')
                                  .map((item) => (
                                    <div
                                      key={item.id}
                                      onClick={() => (onSelectItem ? onSelectItem(item) : onEditItem(item))}
                                      className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-xs cursor-pointer hover:shadow-sm hover:border-purple-300 transition-all"
                                    >
                                      <div className="font-bubble font-bold text-purple-900 truncate">{item.title}</div>
                                      <div className="flex items-center justify-between text-[10px] text-purple-700 font-mono mt-1">
                                        <span className="truncate">{item.endTime ? `${item.time} - ${item.endTime}` : item.time || 'Programado'}</span>
                                        {item.notes && (
                                          <span className="text-[9px] bg-purple-100 text-purple-800 font-sans font-bold px-1.5 py-0.5 rounded-md shrink-0 ml-1">
                                            📝 Detalle
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </td>

                            {/* Columna Taller & Envíos */}
                            <td className="p-2 align-top" style={{ borderBottom: `1px solid ${themeConfig.borderDiv}` }}>
                              <div className="space-y-1.5">
                                {hourItems
                                  .filter((i) => i.category === 'taller' || i.category === 'entrega' || i.category === 'produccion')
                                  .map((item) => (
                                    <div
                                      key={item.id}
                                      onClick={() => (onSelectItem ? onSelectItem(item) : onEditItem(item))}
                                      className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-xs cursor-pointer hover:shadow-sm hover:border-sky-300 transition-all"
                                    >
                                      <div className="font-bubble font-bold text-sky-900 truncate">{item.title}</div>
                                      <div className="flex items-center justify-between text-[10px] text-sky-700 font-mono mt-1">
                                        <span className="truncate">{item.endTime ? `${item.time} - ${item.endTime}` : item.time || 'Programado'}</span>
                                        {item.notes && (
                                          <span className="text-[9px] bg-sky-100 text-sky-800 font-sans font-bold px-1.5 py-0.5 rounded-md shrink-0 ml-1">
                                            📝 Detalle
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </td>
                          </>
                        ) : (
                          /* Columna Única Amplia */
                          <td className="p-2 align-top" style={{ borderBottom: `1px solid ${themeConfig.borderDiv}` }}>
                            <div className="space-y-1.5">
                              {hourItems.map((item) => (
                                <div
                                  key={item.id}
                                  onClick={() => (onSelectItem ? onSelectItem(item) : onEditItem(item))}
                                  className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-purple-300 transition-all"
                                >
                                  <div className="min-w-0 pr-2">
                                    <div className="font-bubble font-bold text-xs sm:text-sm text-slate-900 truncate">{item.title}</div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-[10px] font-mono text-purple-700 font-bold">
                                        {item.endTime ? `${item.time} - ${item.endTime}` : item.time}
                                      </span>
                                      {item.notes && (
                                        <span className="text-[9px] bg-slate-100 text-slate-600 font-sans font-semibold px-1.5 py-0.2 rounded">
                                          📝 Ver detalle
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
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
