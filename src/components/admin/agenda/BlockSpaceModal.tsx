import React, { useState } from 'react';
import { X, Lock, Clock, Users, Calendar, Trash2, Check } from 'lucide-react';
import { BlockedSpace, TEAM_MEMBERS } from './agendaCalendarTypes';

interface BlockSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (space: BlockedSpace) => void;
  onDelete?: (id: string) => void;
  initialSpace?: BlockedSpace | null;
  selectedDate?: string;
}

export const BlockSpaceModal: React.FC<BlockSpaceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialSpace,
  selectedDate,
}) => {
  const [title, setTitle] = useState(initialSpace?.title || 'ESPACIO BLOQUEADO');
  const [startTime, setStartTime] = useState(initialSpace?.startTime || '12:30 PM');
  const [endTime, setEndTime] = useState(initialSpace?.endTime || '01:30 PM');
  const [scope, setScope] = useState<'all' | 'fiorella' | 'taller'>(initialSpace?.scope || 'all');
  const [isRecurring, setIsRecurring] = useState(initialSpace ? !!initialSpace.isRecurringDaily : true);
  const [date, setDate] = useState(initialSpace?.date || selectedDate || new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState(initialSpace?.reason || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const scopeLabel = scope === 'all' ? 'Todo el local' : scope === 'fiorella' ? 'Fiorella' : 'Taller';

    const space: BlockedSpace = {
      id: initialSpace?.id || `blocked-${Date.now()}`,
      title: title.trim().toUpperCase(),
      startTime,
      endTime,
      scope,
      scopeLabel,
      isRecurringDaily: isRecurring,
      date: isRecurring ? undefined : date,
      reason: reason.trim() || undefined,
    };

    onSave(space);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#F1F2F6] rounded-3xl max-w-md w-full max-h-[92vh] shadow-2xl border border-white/90 flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        {/* Header Fijo */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 shrink-0 bg-[#F1F2F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Lock className="w-4 h-4 text-amber-100" />
            </div>
            <div>
              <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 leading-tight">
                {initialSpace ? 'Ajustar Espacio Bloqueado' : 'Bloquear Espacio en Agenda'}
              </h3>
              <p className="text-[10px] text-slate-500 font-sans">
                Reservar horarios no disponibles o mantenimientos
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

        <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1 overflow-hidden">
          <div className="overflow-y-auto px-5 py-3.5 space-y-3 flex-1 scrollbar-thin">
          {/* Título / Motivo */}
          <div>
            <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">
              Nombre o Motivo del Bloqueo *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: REUNIÓN DE EQUIPO, MANTENIMIENTO..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl bg-[#ECEEF2] border border-white/80 shadow-neuInset text-xs font-bubble font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 uppercase"
            />
          </div>

          {/* Horario Inicio y Fin */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-sans font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>Hora Inicio</span>
              </label>
              <input
                type="text"
                placeholder="12:30 PM"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#ECEEF2] border border-white shadow-neuInset text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-sans font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>Hora Fin</span>
              </label>
              <input
                type="text"
                placeholder="01:30 PM"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#ECEEF2] border border-white shadow-neuInset text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* Alcance del Bloqueo */}
          <div>
            <label className="block text-xs font-bubble font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>Alcance / Equipo Afectado</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'all', label: 'Todo el local' },
                { id: 'fiorella', label: 'Fiorella' },
                { id: 'taller', label: 'Taller & Envíos' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setScope(opt.id as any)}
                  className={`py-2 px-2 rounded-xl text-center text-xs font-bubble transition-all border cursor-pointer ${
                    scope === opt.id
                      ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Frecuencia / Recurrencia */}
          <div className="p-3 rounded-2xl bg-white/70 border border-slate-200 shadow-xs space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-bubble font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-600" />
                <span>Aplicar todos los días (Recurrente)</span>
              </span>
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </label>

            {!isRecurring && (
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-[11px] font-sans font-semibold text-slate-600 mb-1">
                  Fecha del Bloqueo
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#ECEEF2] border border-white shadow-neuInset text-xs font-mono font-bold text-slate-800"
                />
              </div>
            )}
          </div>

          {/* Notas */}
          <div>
            <label className="block text-[11px] font-sans font-semibold text-slate-600 mb-1">
              Notas u Observaciones (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: Todo el equipo almuerza en este horario"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl bg-[#ECEEF2] border border-white/80 shadow-neuInset text-xs text-slate-800 placeholder:text-slate-400"
            />
          </div>

          </div>

          {/* Botones de Acción Fijos al Pie */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 shrink-0 bg-[#F1F2F6]">
            {initialSpace && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(initialSpace.id);
                  onClose();
                }}
                className="flex items-center gap-1 text-xs font-bubble text-rose-600 hover:text-rose-800 py-1.5 px-2.5 rounded-xl hover:bg-rose-50 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl text-xs font-bubble font-semibold text-slate-600 hover:bg-white/80 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bubble font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Guardar Bloqueo</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
