import React, { useEffect, useState } from 'react';
import { Clock, MessageCircle, Mail, ChevronDown, ChevronUp, Sparkles, ExternalLink, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppRoute, AdminTabType } from '../../types';
import { formatShortDate } from '../../utils/formatters';
import {
  getWaitlistTurnNumber,
  matchesUserWaitlistEntry,
  resolveWaitlistWhatsappTarget,
} from '../../utils/workshopWaitlist';
import { playWaterDropSound, playBubblePopSound } from '../../utils/soundEffects';

interface MyAccountWaitlistBannerProps {
  onNavigate: (route: AppRoute, targetTab?: AdminTabType, wsId?: string) => void;
}

export const MyAccountWaitlistBanner: React.FC<MyAccountWaitlistBannerProps> = ({ onNavigate }) => {
  const {
    currentUser,
    workshops,
    workshopWaitlist,
    workshopWaitlistSettings,
    refreshWorkshopWaitlist,
  } = useApp();

  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    refreshWorkshopWaitlist();
  }, [refreshWorkshopWaitlist]);

  const userEntries = workshopWaitlist.filter((entry) => matchesUserWaitlistEntry(entry, currentUser));
  if (userEntries.length === 0) return null;

  return (
    <div className="space-y-3 animate-fadeIn">
      {userEntries.map((entry) => {
        const ws = workshops.find((w) => w.id === entry.workshopId);
        const workshopTitle = ws?.title || entry.workshopTitle;
        const turn = getWaitlistTurnNumber(workshopWaitlist, entry.workshopId, entry.id);
        const spotOpened = entry.status === 'notified' || (ws ? ws.spotsAvailable > 0 : false);
        const whatsappTarget = resolveWaitlistWhatsappTarget(ws, workshopWaitlistSettings);
        const isExpanded = expandedId === null ? true : expandedId === entry.id;

        return (
          <div
            key={entry.id}
            className={`rounded-[28px] border shadow-md overflow-hidden transition-all ${
              spotOpened
                ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-emerald-300 dark:from-[#1A2E26] dark:via-[#162922] dark:to-[#1A2E26] dark:border-emerald-700/60'
                : 'bg-gradient-to-r from-amber-50 via-pink-50/70 to-purple-50 border-amber-200/90 dark:from-[#251E33] dark:via-[#211A2E] dark:to-[#281D35] dark:border-amber-500/40'
            }`}
          >
            {/* Botón Principal de Estado en Lista de Espera */}
            <button
              type="button"
              onClick={() => {
                playWaterDropSound();
                setExpandedId((prev) => (prev === entry.id && expandedId !== null ? 'none' : entry.id));
              }}
              className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left cursor-pointer hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                    spotOpened
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gradient-to-tr from-amber-500 to-fio-pink text-white'
                  }`}
                >
                  {spotOpened ? <Sparkles className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bubble font-bold uppercase tracking-wider ${
                        spotOpened
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-200/90 text-amber-950 dark:bg-amber-500/25 dark:text-amber-300 dark:border dark:border-amber-500/40'
                      }`}
                    >
                      {spotOpened ? '¡Se liberó un cupo!' : `Lista de Espera • Turno #${turn}`}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                      Registrado: {formatShortDate(entry.createdAt)}
                    </span>
                  </div>
                  <p className="font-bubble font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                    Estás en la lista de espera del taller: Nombre: {workshopTitle}
                  </p>
                </div>
              </div>

              <span className="text-slate-500 shrink-0">
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>

            {isExpanded && (
              <div className="px-5 pb-4 pt-1 border-t border-white/70 space-y-3">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed flex items-start gap-2">
                  <Mail className="w-4 h-4 text-fio-pink shrink-0 mt-0.5" />
                  <span>
                    Mantente pendiente de tu correo electrónico (<strong>{entry.email}</strong>) y del grupo de WhatsApp porque apenas se libere un cupo el sistema te notificará.
                  </span>
                </p>

                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href={whatsappTarget.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playBubblePopSound(0.3)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bubble font-bold shadow-xs transition-all active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Grupo de WhatsApp de Lista de Espera</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {ws && (
                    <button
                      type="button"
                      onClick={() => {
                        playWaterDropSound();
                        onNavigate('workshop-detail', undefined, ws.id);
                      }}
                      className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bubble font-bold transition-all active:scale-95 cursor-pointer ${
                        spotOpened
                          ? 'bg-gradient-to-r from-purple-600 to-fio-pink text-white shadow-sm'
                          : 'bg-white hover:bg-purple-50 text-slate-700 border border-purple-200'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{spotOpened ? '¡Ir a Inscribirme Ahora!' : 'Ver Detalles del Taller'}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
