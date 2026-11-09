import React from 'react';
import { AgendaItem, AgendaCategory, AgendaPriority } from '../../../types';
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Edit3,
  Trash2,
  Bell,
  GraduationCap,
  Package,
  Scissors,
  Truck,
  Copy,
  Check,
  Phone,
  FileText,
} from 'lucide-react';
import { playAgendaBellSound } from '../../../utils/soundEffects';

const CATEGORY_MAP: Record<AgendaCategory, { label: string; icon: any; color: string; bg: string; border: string }> = {
  taller: { label: 'Taller Creativo', icon: GraduationCap, color: 'text-purple-700', bg: 'bg-purple-100', border: 'border-purple-300' },
  entrega: { label: 'Entrega / Envío', icon: Package, color: 'text-pink-700', bg: 'bg-pink-100', border: 'border-pink-300' },
  produccion: { label: 'Producción & Ensamble', icon: Scissors, color: 'text-sky-700', bg: 'bg-sky-100', border: 'border-sky-300' },
  proveedor: { label: 'Proveedor & Insumos', icon: Truck, color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-300' },
  recordatorio: { label: 'Recordatorio / Admin', icon: Bell, color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-300' },
};

const PRIORITY_MAP: Record<AgendaPriority, { label: string; badge: string }> = {
  alta: { label: 'Alta Prioridad', badge: 'bg-rose-100 text-rose-700 border-rose-300' },
  media: { label: 'Prioridad Normal', badge: 'bg-amber-100 text-amber-700 border-amber-300' },
  baja: { label: 'Prioridad Baja', badge: 'bg-slate-100 text-slate-600 border-slate-300' },
};

const formatFullDate = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('es-CR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

interface AgendaDetailModalProps {
  isOpen: boolean;
  item: AgendaItem | null;
  onClose: () => void;
  onEdit: (item: AgendaItem) => void;
  onToggleStatus: (item: AgendaItem) => void;
  onDelete: (id: string) => void;
}

export const AgendaDetailModal: React.FC<AgendaDetailModalProps> = ({
  isOpen,
  item,
  onClose,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !item) return null;

  const cat = CATEGORY_MAP[item.category] || CATEGORY_MAP.recordatorio;
  const pri = PRIORITY_MAP[item.priority] || PRIORITY_MAP.media;
  const CatIcon = cat.icon;
  const isDone = item.status === 'completed';

  const handleCopyNotes = () => {
    if (!item.notes) return;
    navigator.clipboard.writeText(item.notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = item.notes ? item.notes.split('\n').filter((l) => l.trim().length > 0) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-[#F1F2F6] w-full sm:max-w-lg rounded-t-[28px] sm:rounded-3xl border-t sm:border border-white/90 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden z-10 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
        {/* Barra superior de arrastre en móvil */}
        <div className="w-12 h-1.5 rounded-full bg-slate-300 mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

        {/* Encabezado con Categoría y Cerrar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/80 bg-white/70 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bubble font-bold border ${cat.bg} ${cat.color} ${cat.border}`}>
              <CatIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{cat.label}</span>
            </span>

            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${pri.badge}`}>
              {pri.label}
            </span>

            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
              isDone ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-blue-100 text-blue-800 border-blue-300'
            }`}>
              {isDone ? '✅ Completada' : '⏳ Pendiente'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-all cursor-pointer shrink-0"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo estructurado con scroll fluido */}
        <div className="overflow-y-auto px-5 py-4 space-y-4 flex-1 custom-scrollbar">
          {/* Título de la actividad */}
          <div>
            <h2 className={`font-bubble font-bold text-lg sm:text-xl leading-snug ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
              {item.title}
            </h2>
          </div>

          {/* Tarjeta de Fecha y Horario */}
          <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center gap-2.5 text-xs font-sans text-slate-700">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fecha programada</span>
                <span className="font-bubble font-bold text-slate-900 capitalize">{formatFullDate(item.date)}</span>
              </div>
            </div>

            {item.time && (
              <div className="flex items-center gap-2.5 text-xs font-sans text-slate-700 pt-2 border-t border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Horario de atención</span>
                  <span className="font-mono font-bold text-slate-900">
                    {item.endTime ? `${item.time} a ${item.endTime}` : item.time}
                  </span>
                </div>
              </div>
            )}

            {item.notifyBell && (
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-purple-700">
                <span className="flex items-center gap-1.5 font-sans font-medium text-[11px]">
                  <Bell className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                  <span>Notificación sonora y recordatorio activo</span>
                </span>
                <button
                  type="button"
                  onClick={() => playAgendaBellSound(0.4)}
                  className="text-[10px] font-bubble font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 px-2 py-0.5 rounded-lg border border-purple-200 transition-all cursor-pointer"
                >
                  Probar sonido
                </button>
              </div>
            )}
          </div>

          {/* Texto de la Agenda de Adentro (Estructurado y limpio) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bubble font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-600" />
                <span>Contenido &amp; Notas de la Actividad</span>
              </span>
              {item.notes && (
                <button
                  type="button"
                  onClick={handleCopyNotes}
                  className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold text-purple-600 hover:text-purple-800 bg-white/80 px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-neuInset min-h-[90px]">
              {lines.length > 0 ? (
                <div className="space-y-2">
                  {lines.map((line, idx) => {
                    const trimmed = line.trim();
                    const isBullet = trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*');
                    const isNumber = /^\d+[\.\)]/.test(trimmed);
                    const cleanText = isBullet ? trimmed.replace(/^[-•*]\s*/, '') : trimmed;
                    const phoneMatch = cleanText.match(/\b\d{4}[-\s]?\d{4}\b/);

                    return (
                      <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800 leading-relaxed">
                        {isBullet && (
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                        )}
                        {isNumber && (
                          <span className="w-4 h-4 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">
                            {trimmed.match(/^\d+/)?.[0]}
                          </span>
                        )}
                        <span className="flex-1 font-sans break-words whitespace-pre-wrap">
                          {isNumber ? cleanText.replace(/^\d+[\.\)]\s*/, '') : cleanText}
                          {phoneMatch && (
                            <a
                              href={`tel:${phoneMatch[0].replace(/\D/g, '')}`}
                              className="ml-2 inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md hover:underline"
                            >
                              <Phone className="w-3 h-3" />
                              <span>Llamar {phoneMatch[0]}</span>
                            </a>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-4 text-center text-slate-400 text-xs font-sans italic">
                  Sin notas adicionales registradas en esta actividad.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botones de acción adaptados para vista de celular */}
        <div className="p-4 bg-white/90 border-t border-slate-200/90 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onToggleStatus(item)}
            className={`w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl font-bubble font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-sm active:scale-95 ${
              isDone
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isDone ? (
              <>
                <Circle className="w-4 h-4" />
                <span>Marcar como Pendiente</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Marcar como Completada</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(item);
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bubble font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onDelete(item.id);
              }}
              className="p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bubble font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-95"
              title="Eliminar actividad"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bubble font-bold text-xs transition-all cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
