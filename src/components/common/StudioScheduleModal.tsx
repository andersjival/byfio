import React from 'react';
import { X, Store } from 'lucide-react';
import { StudioLocationScheduleCard } from './StudioLocationScheduleCard';

interface StudioScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudioScheduleModal: React.FC<StudioScheduleModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-5 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Fijo */}
        <div className="p-4 sm:p-5 border-b border-slate-200/70 flex items-center justify-between bg-[#F1F2F6] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white shadow-neuBtn flex items-center justify-center text-amber-500">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bubble font-bold text-base text-slate-900 leading-tight">
                Ubicación &amp; Horarios de Atención
              </h3>
              <p className="text-[11px] text-slate-500 font-sans">
                Taller Creativo by.fio en Tibás, San José
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 neu-btn-circle text-slate-500 hover:text-slate-800 transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4 sm:p-6 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <StudioLocationScheduleCard compact />
        </div>
      </div>
    </div>
  );
};
