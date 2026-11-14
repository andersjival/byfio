import React, { useEffect, useMemo, useState } from 'react';
import {
  Clock, MessageCircle, Mail, Phone, Users, CheckCircle2, Trash2, Send, Save, Link2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useConfirm } from '../../context/ConfirmContext';
import { formatShortDate, getWhatsAppLink } from '../../utils/formatters';
import { sortWaitlistFifo } from '../../utils/workshopWaitlist';
import { playBubblePopSound, playWaterDropSound } from '../../utils/soundEffects';

interface WorkshopWaitlistAdminPanelProps {
  selectedWorkshopId?: string | null;
}

export const WorkshopWaitlistAdminPanel: React.FC<WorkshopWaitlistAdminPanelProps> = ({
  selectedWorkshopId,
}) => {
  const {
    workshops,
    workshopWaitlist,
    workshopWaitlistSettings,
    saveWorkshopWaitlistSettings,
    notifyWorkshopWaitlistSpotOpened,
    removeWorkshopWaitlistEntry,
    refreshWorkshopWaitlist,
  } = useApp();
  const confirm = useConfirm();

  const [filterWsId, setFilterWsId] = useState<string>(selectedWorkshopId || 'all');
  const [waNumber, setWaNumber] = useState(workshopWaitlistSettings.whatsappNumber || '64004640');
  const [waLink, setWaLink] = useState(workshopWaitlistSettings.whatsappGroupLink || '');
  const [savedToast, setSavedToast] = useState(false);
  const [notifyToast, setNotifyToast] = useState<string | null>(null);

  useEffect(() => {
    refreshWorkshopWaitlist();
  }, [refreshWorkshopWaitlist]);

  useEffect(() => {
    if (selectedWorkshopId) setFilterWsId(selectedWorkshopId);
  }, [selectedWorkshopId]);

  useEffect(() => {
    setWaNumber(workshopWaitlistSettings.whatsappNumber || '64004640');
    setWaLink(workshopWaitlistSettings.whatsappGroupLink || '');
  }, [workshopWaitlistSettings]);

  const activeEntries = useMemo(
    () => sortWaitlistFifo(workshopWaitlist.filter((e) => e.status !== 'cancelled')),
    [workshopWaitlist]
  );

  const countByWorkshop = useMemo(() => {
    const counts = new Map<string, number>();
    activeEntries.forEach((e) => counts.set(e.workshopId, (counts.get(e.workshopId) || 0) + 1));
    return counts;
  }, [activeEntries]);

  const visibleEntries = useMemo(
    () => (filterWsId === 'all' ? activeEntries : activeEntries.filter((e) => e.workshopId === filterWsId)),
    [activeEntries, filterWsId]
  );

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    playBubblePopSound(0.3);
    await saveWorkshopWaitlistSettings({ whatsappNumber: waNumber, whatsappGroupLink: waLink });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleNotifySpot = async (wsId: string, entryId?: string) => {
    playBubblePopSound(0.35);
    const res = await notifyWorkshopWaitlistSpotOpened(wsId, entryId);
    setNotifyToast(
      res.emailSentCount > 0
        ? `Notificación marcada y ${res.emailSentCount} correo(s) enviado(s).`
        : 'Notificación de cupo liberado activada en el perfil del usuario.'
    );
    setTimeout(() => setNotifyToast(null), 3500);
  };

  return (
    <div className="bg-white dark:bg-[#1C1829] rounded-3xl p-5 sm:p-6 border border-purple-200/80 dark:border-purple-800/80 shadow-clay space-y-5 animate-fadeIn">
      {/* Configuración Oficial de WhatsApp y Grupo de Lista de Espera */}
      <form onSubmit={handleSaveConfig} className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-purple-50/60 dark:from-[#211D35] dark:via-[#1E1A30] dark:to-[#25203D] border border-emerald-200/80 dark:border-purple-800/60 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>WhatsApp y Link del Grupo de Lista de Espera</span>
          </h3>
          {savedToast && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> ¡Configuración guardada!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-4">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Número de WhatsApp:</label>
            <input
              type="text"
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
              placeholder="Ej: 64004640"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#151122] text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-300 focus:outline-none"
            />
          </div>
          <div className="md:col-span-6">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Link del Grupo de WhatsApp (Lista de Espera):</label>
            <div className="relative">
              <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={waLink}
                onChange={(e) => setWaLink(e.target.value)}
                placeholder="https://chat.whatsapp.com/..."
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#151122] text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-300 focus:outline-none"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bubble font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar</span>
            </button>
          </div>
        </div>
      </form>

      {/* Cabecera y Filtro por Taller */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="font-bubble font-bold text-base text-fio-900 dark:text-purple-200 flex items-center gap-2">
            <Users className="w-4 h-4 text-fio-pink" />
            <span>Lista de Espera en Orden de Registro ({visibleEntries.length} personas)</span>
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Ordenada cronológicamente desde la primera persona registrada (#1).</p>
        </div>

        {filterWsId !== 'all' && visibleEntries.length > 0 && (
          <button
            type="button"
            onClick={() => handleNotifySpot(filterWsId)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fio-pink text-white text-xs font-bubble font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Notificar Cupo Liberado a Todos</span>
          </button>
        )}
      </div>

      {notifyToast && (
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          {notifyToast}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => { playWaterDropSound(); setFilterWsId('all'); }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold border transition-all cursor-pointer ${
            filterWsId === 'all'
              ? 'bg-purple-800 text-white border-purple-900 dark:bg-purple-600 dark:border-purple-500'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-purple-50 dark:bg-[#25203D] dark:text-slate-300 dark:border-white/10 dark:hover:bg-[#2C2746]'
          }`}
        >
          Todos los Talleres ({activeEntries.length})
        </button>
        {workshops.map((ws) => (
          <button
            key={ws.id}
            type="button"
            onClick={() => { playWaterDropSound(); setFilterWsId(ws.id); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold border transition-all cursor-pointer ${
              filterWsId === ws.id
                ? 'bg-purple-800 text-white border-purple-900 dark:bg-purple-600 dark:border-purple-500'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-purple-50 dark:bg-[#25203D] dark:text-slate-300 dark:border-white/10 dark:hover:bg-[#2C2746]'
            }`}
          >
            {ws.title} ({countByWorkshop.get(ws.id) || 0})
          </button>
        ))}
      </div>

      {/* Lista Ordenada Cronológicamente */}
      {visibleEntries.length === 0 ? (
        <p className="text-xs text-slate-400 italic py-6 text-center bg-slate-50 dark:bg-[#151122] rounded-2xl border border-slate-100 dark:border-white/10">
          No hay personas registradas en lista de espera todavía.
        </p>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-white/10 max-h-96 overflow-y-auto pr-1">
          {visibleEntries.map((entry, idx) => (
            <div key={entry.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-purple-50/30 dark:hover:bg-white/5 px-2 rounded-xl">
              <div className="flex items-start gap-3 min-w-0">
                <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-600 to-fio-pink text-white font-bubble font-bold flex items-center justify-center shrink-0">
                  #{idx + 1}
                </span>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold text-slate-900 dark:text-white">{entry.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      entry.status === 'notified'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}>
                      {entry.status === 'notified' ? 'Cupo liberado notificado' : 'En espera'}
                    </span>
                  </div>
                  <p className="text-[11px] text-fio-purple dark:text-pink-300 font-semibold truncate">{entry.workshopTitle}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {entry.email}</span>
                    <a
                      href={getWhatsAppLink(entry.phone, `¡Hola ${entry.name}! Te escribimos de by.fio por la lista de espera del taller "${entry.workshopTitle}".`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                    >
                      <Phone className="w-3 h-3" /> {entry.phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 shrink-0 pl-10 sm:pl-0">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-fio-pink" />
                  {formatShortDate(entry.createdAt)}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleNotifySpot(entry.workshopId, entry.id)}
                    className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 dark:text-purple-300 dark:border-purple-800/60 text-[10px] font-bold border border-purple-200 cursor-pointer"
                    title="Enviar notificación de cupo liberado"
                  >
                    Notificar cupo
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (await confirm(`¿Quitar a ${entry.name} de la lista de espera?`, { title: 'Lista de Espera', confirmLabel: 'Quitar' })) {
                        removeWorkshopWaitlistEntry(entry.id);
                      }
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                    title="Eliminar registro"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
