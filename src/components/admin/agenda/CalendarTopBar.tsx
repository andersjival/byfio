import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Info,
  Calendar,
  Clock,
  Users,
  ChevronDown,
} from 'lucide-react';
import {
  CalendarViewType,
  TimeIntervalType,
  TeamFilterType,
  TEAM_MEMBERS,
} from './agendaCalendarTypes';

interface CalendarTopBarProps {
  viewType: CalendarViewType;
  onViewTypeChange: (view: CalendarViewType) => void;
  interval: TimeIntervalType;
  onIntervalChange: (interval: TimeIntervalType) => void;
  dateRangeLabel: string;
  onPrevDate: () => void;
  onNextDate: () => void;
  onToday: () => void;
  isCurrentPeriod: boolean;
  teamFilter: TeamFilterType;
  onTeamFilterChange: (filter: TeamFilterType) => void;
  appointmentsCount: number;
  onOpenBlockSpaceModal: () => void;
  onOpenSyncModal: () => void;
}

export const CalendarTopBar: React.FC<CalendarTopBarProps> = ({
  viewType,
  onViewTypeChange,
  interval,
  onIntervalChange,
  dateRangeLabel,
  onPrevDate,
  onNextDate,
  onToday,
  isCurrentPeriod,
  teamFilter,
  onTeamFilterChange,
  appointmentsCount,
  onOpenBlockSpaceModal,
  onOpenSyncModal,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-3xl bg-[#F1F2F6] border border-white/90 shadow-neuCard">
      {/* Lado Izquierdo: Vistas, Intervalo, Navegación de Fechas y Filtro */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Toggle Vista Diaria vs Semanal */}
        <div className="flex items-center p-1 rounded-2xl bg-[#ECEEF2] border border-white/80 shadow-neuInset">
          <button
            type="button"
            onClick={() => onViewTypeChange('daily')}
            className={`px-3.5 py-1.5 rounded-xl font-bubble font-bold text-xs transition-all cursor-pointer ${
              viewType === 'daily'
                ? 'bg-[#1E1035] text-white shadow-md scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vista Diaria
          </button>
          <button
            type="button"
            onClick={() => onViewTypeChange('weekly')}
            className={`px-3.5 py-1.5 rounded-xl font-bubble font-bold text-xs transition-all cursor-pointer ${
              viewType === 'weekly'
                ? 'bg-[#1E1035] text-white shadow-md scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semanal
          </button>
        </div>

        {/* Intervalo */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/90 border border-slate-200/90 shadow-xs">
          <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="text-xs text-slate-500 font-sans font-medium">Intervalo:</span>
          <div className="relative">
            <select
              value={interval}
              onChange={(e) => onIntervalChange(e.target.value as TimeIntervalType)}
              className="appearance-none bg-transparent pr-4 text-xs font-bubble font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="60">60 min (1 h)</option>
              <option value="30">30 min</option>
              <option value="15">15 min</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none absolute right-0 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Navegación de Fechas con Flechas */}
        <div className="flex items-center gap-1 px-1.5 py-1 rounded-2xl bg-white/90 border border-slate-200/90 shadow-xs">
          <button
            type="button"
            onClick={onPrevDate}
            className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
            title="Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-2 text-xs font-bubble font-bold text-slate-800 select-none min-w-[90px] text-center">
            {dateRangeLabel}
          </span>

          <button
            type="button"
            onClick={onNextDate}
            className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
            title="Siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {!isCurrentPeriod && (
            <button
              type="button"
              onClick={onToday}
              className="ml-1 px-2 py-0.5 rounded-lg text-[10px] font-bubble font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 transition-all cursor-pointer"
            >
              Hoy
            </button>
          )}
        </div>

        {/* Filtro de Equipo */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/90 border border-slate-200/90 shadow-xs">
          <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="text-xs text-slate-500 font-sans font-medium">Filtrar:</span>
          <div className="relative">
            <select
              value={teamFilter}
              onChange={(e) => onTeamFilterChange(e.target.value as TeamFilterType)}
              className="appearance-none bg-transparent pr-4 text-xs font-bubble font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {TEAM_MEMBERS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none absolute right-0 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Lado Derecho: Bloquear Espacio, Contador de Citas, Sincronizar Calendario */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Botón Bloquear Espacio */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenBlockSpaceModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#1E1035] hover:bg-[#2A1747] text-white font-bubble font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-amber-300" />
            <span>Bloquear Espacio</span>
          </button>
          <button
            type="button"
            onClick={onOpenBlockSpaceModal}
            title="Información sobre bloqueo de recesos y horas no disponibles"
            className="w-5 h-5 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-all cursor-pointer"
          >
            <Info className="w-3 h-3" />
          </button>
        </div>

        {/* Contador de Citas */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/90 border border-slate-200/90 shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="text-xs font-bubble font-semibold text-slate-700">
            {appointmentsCount} citas programadas {viewType === 'weekly' ? 'esta semana' : 'este día'}
          </span>
        </div>

        {/* Sincronizar Calendario con Apple y Google */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenSyncModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/90 hover:bg-white border border-slate-200/90 text-slate-800 font-bubble font-bold text-xs shadow-xs hover:border-purple-300 transition-all cursor-pointer"
          >
            <span className="text-xs">🍎</span>
            <span className="text-xs font-bold text-blue-500 font-sans">G</span>
            <span>Sincronizar Calendario</span>
          </button>
          <button
            type="button"
            onClick={onOpenSyncModal}
            title="Detalles de sincronización automática con Google y Apple Calendar"
            className="w-5 h-5 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-all cursor-pointer"
          >
            <Info className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
