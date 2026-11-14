import React from 'react';
import { Mail, Bell, ArrowRight, X } from 'lucide-react';
import { IncomingEmailOrder } from '../../../types';
import { formatCRC } from '../../../utils/formatters';

interface EmailOrderAlertBannerProps {
  order: IncomingEmailOrder;
  onAccept: () => void;
  onDismiss?: () => void;
}

export const EmailOrderAlertBanner: React.FC<EmailOrderAlertBannerProps> = ({
  order,
  onAccept,
  onDismiss,
}) => {
  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-slate-950 rounded-2xl p-4 sm:p-5 shadow-lg border border-amber-300 animate-bounce-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-white text-amber-600 flex items-center justify-center shadow-md shrink-0 animate-pulse">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h4 className="font-bubble font-black text-sm sm:text-base tracking-wide text-white drop-shadow-sm">
              Correo recibido para ingresar pedido al sistema
            </h4>
          </div>
          <p className="text-xs text-amber-100 mt-0.5">
            <strong>{order.supplierName}</strong> • Factura: <span className="font-mono font-bold text-white">{order.invoiceNumber}</span> • {order.items.length} productos ({formatCRC(order.totalCost)})
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          type="button"
          onClick={onAccept}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bubble text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-transform active:scale-95 cursor-pointer"
        >
          <span>Aceptar / Ver Ficha</span>
          <ArrowRight className="w-4 h-4 text-amber-600" />
        </button>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="p-2 rounded-xl bg-black/10 hover:bg-black/20 text-white cursor-pointer"
            title="Cerrar alerta"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
