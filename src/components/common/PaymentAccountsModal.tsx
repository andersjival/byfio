import React from 'react';
import { X, CreditCard } from 'lucide-react';
import { PaymentAccountsCard } from './PaymentAccountsCard';

interface PaymentAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount?: number;
  orderNumber?: string;
}

export const PaymentAccountsModal: React.FC<PaymentAccountsModalProps> = ({
  isOpen,
  onClose,
  amount,
  orderNumber,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#F1F2F6] rounded-3xl shadow-2xl border border-white/90 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-300/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F1F2F6] shadow-neuBtn flex items-center justify-center text-amber-500">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bubble font-bold text-base text-slate-900">
                Cuentas para SINPE Móvil y Pagos
              </h3>
              <p className="text-[11px] text-slate-500">
                Información bancaria oficial para transferencias
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

        {/* Contenido con la tarjeta neumórfica completa */}
        <div className="p-4 sm:p-5">
          <PaymentAccountsCard amount={amount} orderNumber={orderNumber} />
        </div>
      </div>
    </div>
  );
};
