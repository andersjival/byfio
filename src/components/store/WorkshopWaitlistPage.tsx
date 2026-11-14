import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, GraduationCap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppRoute, WorkshopWaitlistEntry } from '../../types';
import { BrandLogo } from '../common/BrandLogo';
import { WorkshopWaitlistStepsForm, WaitlistFormSubmission } from './WorkshopWaitlistStepsForm';
import { WorkshopWaitlistSuccessScreen } from './WorkshopWaitlistSuccessScreen';
import { playBubblePopSound, playWaterDropSound } from '../../utils/soundEffects';

interface WorkshopWaitlistPageProps {
  workshopId?: string | null;
  onNavigate: (route: AppRoute, targetTab?: any, wsId?: string) => void;
}

export const WorkshopWaitlistPage: React.FC<WorkshopWaitlistPageProps> = ({
  workshopId,
  onNavigate,
}) => {
  const {
    workshops,
    currentUser,
    registerUser,
    joinWorkshopWaitlist,
    workshopWaitlistSettings,
  } = useApp();

  const workshop =
    workshops.find((w) => {
      if (!workshopId) return false;
      const clean = workshopId.toLowerCase().trim();
      return w.id.toLowerCase() === clean || w.title.toLowerCase().replace(/\s+/g, '-').includes(clean);
    }) ||
    workshops.find((w) => w.spotsAvailable <= 0) ||
    workshops[0];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedResult, setCompletedResult] = useState<{
    entry: WorkshopWaitlistEntry;
    position: number;
    emailDispatch?: { sent: boolean; provider: string; error?: string };
  } | null>(null);

  if (!workshop) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <p className="text-sm text-slate-600">No se encontró el taller solicitado.</p>
        <button
          type="button"
          onClick={() => onNavigate('workshops')}
          className="px-5 py-2.5 rounded-2xl bg-fio-800 text-white text-xs font-bubble font-bold"
        >
          Ver Talleres
        </button>
      </div>
    );
  }

  const handleSubmitWaitlist = async (data: WaitlistFormSubmission) => {
    setIsSubmitting(true);
    playBubblePopSound(0.35);

    if (data.password && !currentUser) {
      registerUser(
        data.email,
        data.password,
        data.name,
        data.phone,
        data.idCard,
        data.address,
        undefined,
        undefined,
        { skipWelcomeModal: true }
      );
    }

    const res = await joinWorkshopWaitlist({
      workshop,
      name: data.name,
      email: data.email,
      phone: data.phone,
      idCard: data.idCard,
      address: data.address,
    });

    setIsSubmitting(false);
    setCompletedResult(res);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-[#F7F2FF] via-[#FDF7FA] to-[#F3EEFF] flex flex-col items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="w-full max-w-lg space-y-4">
        {/* Barra limpia superior */}
        <div className="flex items-center justify-between gap-3 px-1">
          <button
            type="button"
            onClick={() => {
              playWaterDropSound();
              onNavigate('workshop-detail', undefined, workshop.id);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-700 border border-purple-100 shadow-xs text-xs font-bubble font-bold transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-fio-pink" />
            <span>Volver al Taller</span>
          </button>

          <BrandLogo size="sm" showSlogan={false} />
        </div>

        {/* Cambio automático de pantalla: Registro paso a paso -> Confirmación + Botón WhatsApp */}
        {completedResult ? (
          <WorkshopWaitlistSuccessScreen
            workshop={workshop}
            entry={completedResult.entry}
            position={completedResult.position}
            settings={workshopWaitlistSettings}
            emailDispatch={completedResult.emailDispatch}
            onNavigate={onNavigate}
          />
        ) : (
          <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-5 sm:p-7 border border-purple-200/80 shadow-2xl space-y-5">
            <div className="text-center space-y-2 border-b border-purple-100 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bubble font-bold dark:bg-amber-500/20 dark:border-amber-500/40 dark:text-amber-300">
                <GraduationCap className="w-3.5 h-3.5 text-fio-pink" />
                <span>Lista de Espera • Cupos Agotados</span>
              </div>
              <h1 className="font-bubble font-black text-xl sm:text-2xl text-slate-900 leading-tight">
                {workshop.title}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-fio-pink" />
                  {workshop.date}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-fio-purple" />
                  {workshop.schedule}
                </span>
              </div>
            </div>

            <WorkshopWaitlistStepsForm
              initialUser={currentUser}
              isSubmitting={isSubmitting}
              onSubmitFinal={handleSubmitWaitlist}
            />
          </div>
        )}
      </div>
    </div>
  );
};
