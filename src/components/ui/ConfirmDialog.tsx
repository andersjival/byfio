import React from 'react';
import { AlertTriangle, X, Trash2, Check } from 'lucide-react';

export interface ConfirmDialogProps {
  open: boolean;
  message: string;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  message,
  title = '¿Estás segura?',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  const variantStyles = {
    danger: {
      icon: <Trash2 className="w-5 h-5 text-rose-600" />,
      iconBg: 'bg-rose-100',
      btn: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md',
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      iconBg: 'bg-amber-100',
      btn: 'bg-amber-500 hover:bg-amber-600 text-white shadow-md',
    },
    info: {
      icon: <Check className="w-5 h-5 text-fio-purple" />,
      iconBg: 'bg-purple-100',
      btn: 'bg-fio-purple hover:bg-purple-700 text-white shadow-md',
    },
  }[variant];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl ${variantStyles.iconBg} flex items-center justify-center shrink-0`}>
              {variantStyles.icon}
            </div>
            <h3 className="font-bubble font-bold text-base text-slate-900 leading-tight">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 pb-5">
          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-2xl border border-slate-300 text-slate-600 font-bubble font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 rounded-2xl font-bubble font-bold text-xs transition-all active:scale-95 cursor-pointer ${variantStyles.btn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
