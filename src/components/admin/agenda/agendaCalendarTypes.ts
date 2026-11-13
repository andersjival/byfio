export interface BlockedSpace {
  id: string;
  title: string;
  date?: string; // YYYY-MM-DD or undefined for daily recurring
  isRecurringDaily?: boolean;
  startTime: string; // e.g. "12:30 PM"
  endTime: string; // e.g. "01:30 PM"
  scope: 'all' | 'fiorella' | 'taller';
  scopeLabel: string; // e.g. "Todo el local"
  reason?: string;
}

export type CalendarViewType = 'daily' | 'weekly';
export type TimeIntervalType = '60' | '30' | '15';
export type TeamFilterType = 'all' | 'fiorella' | 'taller';

export const DEFAULT_LUNCH_BREAK: BlockedSpace = {
  id: 'lunch-default',
  title: 'RECESO DE ALMUERZO',
  startTime: '12:30 PM',
  endTime: '01:30 PM',
  isRecurringDaily: true,
  scope: 'all',
  scopeLabel: 'Todo el local',
  reason: 'Receso general de almuerzo para todo el equipo',
};

export const TIME_SLOTS_60 = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
];

export const TEAM_MEMBERS = [
  { id: 'all', name: 'Todo el Equipo (2)' },
  { id: 'fiorella', name: 'Fiorella (Diseño & Admin)' },
  { id: 'taller', name: 'Taller & Envíos' },
];

export type CalendarTheme = 'celeste' | 'amarillo' | 'lila' | 'menta' | 'rosa';

export interface CalendarThemeConfig {
  id: CalendarTheme;
  name: string;
  circleColor: string;
  bgContainer: string;
  bgHeader: string;
  bgHourCol: string;
  borderTable: string;
  borderDiv: string;
  accentText: string;
  hoverCell: string;
}

export const CALENDAR_THEMES: Record<CalendarTheme, CalendarThemeConfig> = {
  celeste: {
    id: 'celeste',
    name: 'Celeste Cielo',
    circleColor: '#BAE6FD',
    bgContainer: '#F0F7FF',
    bgHeader: '#E3F0FC',
    bgHourCol: '#EBF4FE',
    borderTable: '#CCE3F9',
    borderDiv: '#D4E7FA',
    accentText: '#0284C7',
    hoverCell: 'rgba(186, 230, 253, 0.25)',
  },
  amarillo: {
    id: 'amarillo',
    name: 'Amarillo Crema',
    circleColor: '#FDE68A',
    bgContainer: '#FEF9EC',
    bgHeader: '#FDF0D5',
    bgHourCol: '#FDF5E3',
    borderTable: '#FBE4B5',
    borderDiv: '#FBEBC8',
    accentText: '#D97706',
    hoverCell: 'rgba(253, 230, 138, 0.25)',
  },
  lila: {
    id: 'lila',
    name: 'Lila Lavanda',
    circleColor: '#DDD6FE',
    bgContainer: '#F8F4FF',
    bgHeader: '#EFE5FD',
    bgHourCol: '#F4ECFE',
    borderTable: '#E4D2FC',
    borderDiv: '#EBE0FF',
    accentText: '#9333EA',
    hoverCell: 'rgba(221, 214, 254, 0.25)',
  },
  menta: {
    id: 'menta',
    name: 'Menta Suave',
    circleColor: '#A7F3D0',
    bgContainer: '#F0FAF5',
    bgHeader: '#DDF4E7',
    bgHourCol: '#E7F7EE',
    borderTable: '#C3ECD5',
    borderDiv: '#D2F2E2',
    accentText: '#059669',
    hoverCell: 'rgba(167, 243, 208, 0.25)',
  },
  rosa: {
    id: 'rosa',
    name: 'Rosa Pastel',
    circleColor: '#FECDD3',
    bgContainer: '#FEF2F5',
    bgHeader: '#FCE0E7',
    bgHourCol: '#FCE9EE',
    borderTable: '#FAC6D3',
    borderDiv: '#FCDAE3',
    accentText: '#E11D48',
    hoverCell: 'rgba(254, 205, 211, 0.25)',
  },
};

export const CALENDAR_DARK_THEMES: Record<CalendarTheme, CalendarThemeConfig> = {
  celeste: {
    id: 'celeste',
    name: 'Celeste Cielo (Noche)',
    circleColor: '#38BDF8',
    bgContainer: '#091524',
    bgHeader: '#0F243B',
    bgHourCol: '#0C1C2E',
    borderTable: 'rgba(56, 189, 248, 0.28)',
    borderDiv: 'rgba(56, 189, 248, 0.14)',
    accentText: '#38BDF8',
    hoverCell: 'rgba(56, 189, 248, 0.08)',
  },
  amarillo: {
    id: 'amarillo',
    name: 'Amarillo Crema (Noche)',
    circleColor: '#FBBF24',
    bgContainer: '#1C1506',
    bgHeader: '#2B210A',
    bgHourCol: '#231A08',
    borderTable: 'rgba(251, 191, 36, 0.28)',
    borderDiv: 'rgba(251, 191, 36, 0.14)',
    accentText: '#FBBF24',
    hoverCell: 'rgba(251, 191, 36, 0.08)',
  },
  lila: {
    id: 'lila',
    name: 'Lila Lavanda (Noche)',
    circleColor: '#C084FC',
    bgContainer: '#171126',
    bgHeader: '#261B3E',
    bgHourCol: '#1E1433',
    borderTable: 'rgba(192, 132, 252, 0.28)',
    borderDiv: 'rgba(192, 132, 252, 0.14)',
    accentText: '#C084FC',
    hoverCell: 'rgba(192, 132, 252, 0.08)',
  },
  menta: {
    id: 'menta',
    name: 'Menta Suave (Noche)',
    circleColor: '#34D399',
    bgContainer: '#061914',
    bgHeader: '#0B2921',
    bgHourCol: '#08211A',
    borderTable: 'rgba(52, 211, 153, 0.28)',
    borderDiv: 'rgba(52, 211, 153, 0.14)',
    accentText: '#34D399',
    hoverCell: 'rgba(52, 211, 153, 0.08)',
  },
  rosa: {
    id: 'rosa',
    name: 'Rosa Pastel (Noche)',
    circleColor: '#F472B6',
    bgContainer: '#1F0B16',
    bgHeader: '#301223',
    bgHourCol: '#270E1C',
    borderTable: 'rgba(244, 114, 182, 0.28)',
    borderDiv: 'rgba(244, 114, 182, 0.14)',
    accentText: '#F472B6',
    hoverCell: 'rgba(244, 114, 182, 0.08)',
  },
};
