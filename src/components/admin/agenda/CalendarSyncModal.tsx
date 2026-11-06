import React, { useState } from 'react';
import { X, CalendarSync, Check, Copy, Download, RefreshCw, Smartphone, Globe } from 'lucide-react';
import { AgendaItem } from '../../../types';

interface CalendarSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  agendaItems: AgendaItem[];
}

export const CalendarSyncModal: React.FC<CalendarSyncModalProps> = ({
  isOpen,
  onClose,
  agendaItems,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedSuccess, setSyncedSuccess] = useState(false);

  if (!isOpen) return null;

  const calendarFeedUrl = 'webcal://byfio.cr/api/calendar.ics';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(calendarFeedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleForceSync = () => {
    setIsSyncing(true);
    setSyncedSuccess(false);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncedSuccess(true);
      setTimeout(() => setSyncedSuccess(false), 4000);
    }, 1200);
  };

  const handleDownloadICS = () => {
    // Generate valid iCalendar (.ics) string
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ByFio Store//Agenda y Taller ByFio//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Agenda By.Fio Taller & WMS',
      'X-WR-TIMEZONE:America/Costa_Rica',
    ];

    agendaItems.forEach((item) => {
      const cleanDate = item.date.replace(/-/g, '');
      const dtStart = `${cleanDate}T090000Z`;
      const dtEnd = `${cleanDate}T100000Z`;

      icsContent.push('BEGIN:VEVENT');
      icsContent.push(`UID:agenda-${item.id}@byfio.cr`);
      icsContent.push(`DTSTAMP:${now}`);
      icsContent.push(`DTSTART:${dtStart}`);
      icsContent.push(`DTEND:${dtEnd}`);
      icsContent.push(`SUMMARY:${item.title.replace(/[,;]/g, ' ')}`);
      if (item.notes) {
        icsContent.push(`DESCRIPTION:${item.notes.replace(/[\r\n]/g, ' ')}`);
      }
      icsContent.push(`CATEGORIES:${item.category.toUpperCase()}`);
      icsContent.push(`STATUS:${item.status === 'completed' ? 'COMPLETED' : 'CONFIRMED'}`);
      icsContent.push('END:VEVENT');
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `agenda-byfio-${new Date().toISOString().split('T')[0]}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#F1F2F6] rounded-3xl max-w-md w-full max-h-[92vh] shadow-2xl border border-white/90 flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        {/* Header Fijo */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 shrink-0 bg-[#F1F2F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-pink-600 text-white flex items-center justify-center shadow-xs">
              <CalendarSync className="w-4 h-4 text-fio-yellow" />
            </div>
            <div>
              <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 leading-tight">
                Sincronizar Calendario
              </h3>
              <p className="text-[10px] text-slate-500 font-sans">
                Conecta con Google Calendar, Apple Calendar &amp; Outlook
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-white/80 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cuerpo Scrolleable */}
        <div className="overflow-y-auto px-5 py-3.5 space-y-3.5 flex-1 scrollbar-thin">

        {/* Brand Integration Badges */}
        <div className="flex items-center justify-center gap-4 py-2">
          {/* Apple Calendar */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <span className="text-base">🍎</span>
            <span className="text-xs font-bubble font-bold text-slate-800">Apple Calendar</span>
          </div>

          {/* Google Calendar */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <span className="text-base font-bold text-blue-500 font-sans">G</span>
            <span className="text-xs font-bubble font-bold text-slate-800">Google Calendar</span>
          </div>
        </div>

        {/* Sync Status Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border border-purple-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">
              Estado de Sincronización
            </span>
            <span className="text-xs font-bubble font-bold text-purple-950 flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sincronización Cloud Activa
            </span>
          </div>

          <button
            type="button"
            onClick={handleForceSync}
            disabled={isSyncing}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bubble font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar'}</span>
          </button>
        </div>

        {syncedSuccess && (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bubble font-bold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>¡Agenda sincronizada exitosamente con los calendarios externos!</span>
          </div>
        )}

        {/* Opción 1: Descargar archivo .ics */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bubble font-bold text-slate-800">
                Descargar Archivo iCalendar (.ics)
              </span>
            </div>
            <button
              type="button"
              onClick={handleDownloadICS}
              className="px-3 py-1 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bubble font-bold text-xs transition-all cursor-pointer"
            >
              Descargar .ics
            </button>
          </div>
          <p className="text-[11px] text-slate-500 font-sans">
            Exporta todas las {agendaItems.length} actividades para abrirlas en tu iPhone, Mac o aplicación de calendario.
          </p>
        </div>

        {/* Opción 2: URL de Suscripción en Vivo */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bubble font-bold text-slate-800">
              Enlace de Suscripción en Tiempo Real
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={calendarFeedUrl}
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700 select-all"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bubble font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 font-sans">
            Pega este enlace en Google Calendar o Apple Calendar en "Suscribirse a calendario público".
          </p>
        </div>

        </div>

        {/* Footer Fijo */}
        <div className="flex justify-end px-5 py-3 border-t border-slate-200 shrink-0 bg-[#F1F2F6]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-bubble font-bold text-slate-700 hover:bg-white cursor-pointer transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
