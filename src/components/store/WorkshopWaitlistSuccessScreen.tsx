import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2, MessageCircle, Mail, Calendar, Clock, ArrowLeft, User, ExternalLink
} from 'lucide-react';
import { AppRoute, Workshop, WorkshopWaitlistEntry, WorkshopWaitlistSettings } from '../../types';
import { formatShortDate } from '../../utils/formatters';
import { resolveWaitlistWhatsappTarget } from '../../utils/workshopWaitlist';
import { playBubblePopSound, playWaterDropSound } from '../../utils/soundEffects';

interface WorkshopWaitlistSuccessScreenProps {
  workshop: Workshop;
  entry: WorkshopWaitlistEntry;
  position: number;
  settings: WorkshopWaitlistSettings;
  emailDispatch?: { sent: boolean; provider: string; error?: string };
  onNavigate: (route: AppRoute, targetTab?: any, wsId?: string) => void;
}

export const WorkshopWaitlistSuccessScreen: React.FC<WorkshopWaitlistSuccessScreenProps> = ({
  workshop,
  entry,
  position,
  settings,
  emailDispatch,
  onNavigate,
}) => {
  const whatsappTarget = resolveWaitlistWhatsappTarget(workshop, settings);

  useEffect(() => {
    playBubblePopSound(0.45);
    try {
      confetti({
        particleCount: 80,
        spread: 75,
        origin: { y: 0.55 },
        colors: ['#8e54e9', '#ff7597', '#10b981', '#ffbe3b'],
      });
    } catch {}
  }, []);

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-8 border border-purple-200/80 shadow-2xl space-y-5 text-center animate-fadeIn">
      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <div className="space-y-1.5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bubble font-bold">
          <span>Turno en Lista de Espera: #{position}</span>
        </span>
        <h1 className="font-bubble font-black text-2xl sm:text-3xl text-slate-900">
          ¡Listo, {(entry.name || '').split(' ')[0]}! Ya estás anotad@
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          Estás en la lista de espera de <strong className="text-fio-900">{workshop.title}</strong>.
        </p>
      </div>

      {/* Confirmación de correo automático */}
      <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200/80 text-left space-y-2 text-xs">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <p className="font-bubble font-bold text-purple-950">
              {emailDispatch?.sent
                ? `Correo de confirmación enviado a ${entry.email}`
                : `Confirmación registrada para ${entry.email}`}
            </p>
            <p className="text-[11px] text-slate-600 leading-snug">
              Mantente pendiente de tu correo electrónico y únete al grupo de WhatsApp: apenas se libere un cupo, el sistema te notificará.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-purple-200/60 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-fio-pink shrink-0" />
            <span>{workshop.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-fio-purple shrink-0" />
            <span>Registro: {formatShortDate(entry.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Botón Mandatorio: Agregarse al grupo de WhatsApp de lista de espera */}
      <div className="space-y-3 pt-1">
        <a
          href={whatsappTarget.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => playBubblePopSound(0.3)}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bubble font-bold text-sm sm:text-base shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span>Agregarse al grupo de WhatsApp de lista de espera</span>
          <ExternalLink className="w-4 h-4 opacity-90" />
        </a>

        <p className="text-[11px] text-slate-400">
          {whatsappTarget.isGroupLink
            ? 'Te llevará directamente al grupo oficial de lista de espera.'
            : `Redirigiendo a WhatsApp oficial (${whatsappTarget.whatsappNumber}) para integrarte al grupo.`}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={() => {
            playWaterDropSound();
            onNavigate('mi-cuenta');
          }}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bubble font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <User className="w-3.5 h-3.5" />
          <span>Ver mi estado en Mi Cuenta</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playWaterDropSound();
            onNavigate('workshop-detail', undefined, workshop.id);
          }}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bubble font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Taller</span>
        </button>
      </div>
    </div>
  );
};
