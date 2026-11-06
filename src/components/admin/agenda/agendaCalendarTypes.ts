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
