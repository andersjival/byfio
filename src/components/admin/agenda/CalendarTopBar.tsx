import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  ChevronDown,
  Palette,
} from 'lucide-react';
import {
  CalendarViewType,
  TimeIntervalType,
  TeamFilterType,
  TEAM_MEMBERS,
  CalendarTheme,
  CALENDAR_THEMES,
} from './agendaCalendarTypes';

interface CalendarTopBarProps {
  viewType: CalendarViewType;
  onViewTypeChange: (view: CalendarViewType) => void;
  interval?: TimeIntervalType;
  onIntervalChange?: (interval: TimeIntervalType) => void;
  dateRangeLabel: string;
  onPrevDate: () => void;
  onNextDate: () => void;
  onToday: () => void;
  isCurrentPeriod: boolean;
  teamFilter: TeamFilterType;
  onTeamFilterChange: (filter: TeamFilterType) => void;
  appointmentsCount: number;
  currentTheme?: CalendarTheme;
  onSelectTheme?: (theme: CalendarTheme) => void;
  onOpenBlockSpaceModal?: () => void;
  onOpenSyncModal?: () => void;
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
  currentTheme = 'celeste',
  onSelectTheme,
  onOpenBlockSpaceModal,
  onOpenSyncModal,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-3xl bg-[#F1F2F6] border border-white/90 shadow-neuCard">
      {/* Lado Izquierdo: Vistas, Navegación de Fechas y Filtro */}
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

      {/* Lado Derecho: Paleta de Colores Pasteles y Contador de Citas */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Selector de Temas Pasteles */}
        {onSelectTheme && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-white/90 border border-slate-200/90 shadow-xs" title="Personalizar color del calendario">
            <Palette className="w-3.5 h-3.5 text-slate-400 mr-0.5" />
            {(Object.keys(CALENDAR_THEMES) as CalendarTheme[]).map((thmKey) => {
              const thm = CALENDAR_THEMES[thmKey];
              const isSelected = currentTheme === thmKey;
              return (
                <button
                  key={thmKey}
                  type="button"
                  onClick={() => onSelectTheme(thmKey)}
                  title={`Tema ${thm.name}`}
                  className={`w-5 h-5 rounded-full transition-all cursor-pointer ${
                    isSelected
                      ? 'scale-110 shadow-sm ring-2 ring-offset-1 ring-slate-700/80'
                      : 'hover:scale-110 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: thm.circleColor }}
                />
              );
            })}
          </div>
        )}

        {/* Contador de Citas */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/90 border border-slate-200/90 shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="text-xs font-bubble font-semibold text-slate-700">
            {appointmentsCount} citas programadas {viewType === 'weekly' ? 'esta semana' : 'este día'}
          </span>
        </div>

      </div>
    </div>
  );
};
