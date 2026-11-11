import React, { useState } from 'react';
import { Order } from '../../types';
import { formatCRC, formatShortDate } from '../../utils/formatters';
import { calculateLayawayDaysRemaining } from '../../services/layawayReminderService';
import {
  BookmarkCheck,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  Sparkles,
  ShoppingBag,
  Info,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { playWaterDropSound, playBubblePopSound } from '../../utils/soundEffects';

interface LayawayOrderCardProps {
  order: Order;
  onPrintInvoice?: (order: Order) => void;
}

export const LayawayOrderCard: React.FC<LayawayOrderCardProps> = ({ order, onPrintInvoice }) => {
  const [copiedSinpe, setCopiedSinpe] = useState(false);
  const countdown = calculateLayawayDaysRemaining(order);

  const firstItem = order.items && order.items[0];
  const totalAmount = order.layawayTotalAmount ?? order.total;
  const downPayment = order.layawayDownPaymentAmount ?? order.total;
  const remainingDebt = order.layawayRemainingAmount ?? Math.max(0, totalAmount - downPayment);
  const isFullyPaid = remainingDebt <= 0;

  const handleCopySinpe = () => {
    navigator.clipboard.writeText('64004640');
    setCopiedSinpe(true);
    playWaterDropSound();
    setTimeout(() => setCopiedSinpe(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `¡Hola Fiorella! 🌸 Quiero consultar / realizar un abono de mi apartado en by.fio:\n\n` +
      `🏷️ *Número de Pedido:* #${order.orderNumber}\n` +
      `📦 *Artículo:* ${firstItem?.name || 'Artículo Apartado'}\n` +
      `💰 *Total:* ${formatCRC(totalAmount)}\n` +
      `✅ *Abonado a la fecha:* ${formatCRC(downPayment)}\n` +
      `⚠️ *Saldo pendiente:* ${formatCRC(remainingDebt)}\n` +
      `⏳ *Días restantes:* ${countdown.daysRemaining} días (Vence: ${countdown.dueDateFormatted})\n\n` +
      `¿Me confirmas por favor? ¡Muchas gracias!`
  );

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border-2 border-amber-200/90 shadow-md hover:shadow-lg transition-all duration-300 p-5 sm:p-6 space-y-4">
      {/* Listón Superior de Estado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            <BookmarkCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bubble font-bold text-base sm:text-lg text-slate-800">
                Apartado #{order.orderNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wide">
                Plan en Cuotas
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 font-sans">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Fecha de apartado: <strong>{formatShortDate(order.createdAt)}</strong></span>
            </p>
          </div>
        </div>

        {/* Badge de Estado del Plazo */}
        <div className="shrink-0 flex items-center gap-2">
          {isFullyPaid ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bubble font-bold shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% Cancelado</span>
            </span>
          ) : countdown.isExpired ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-800 border border-red-300 text-xs font-bubble font-bold shadow-xs">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Plazo Vencido</span>
            </span>
          ) : countdown.isNearExpiry ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-800 border border-red-300 text-xs font-bubble font-bold shadow-xs animate-pulse">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>¡Por Vencer! ({countdown.daysRemaining} {countdown.daysRemaining === 1 ? 'día' : 'días'})</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bubble font-bold shadow-xs">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Apartado Activo ({countdown.daysRemaining} días)</span>
            </span>
          )}
        </div>
      </div>

      {/* Artículos del Apartado */}
      <div className="space-y-2">
        {order.items &&
          order.items.map((it, idx) => (
            <div
              key={it.id || idx}
              className="flex items-center gap-3 p-2.5 rounded-2xl bg-amber-50/50 border border-amber-100/70"
            >
              {it.image ? (
                <img
                  src={it.image}
                  alt={it.name}
                  className="w-14 h-14 rounded-xl object-cover bg-white shadow-xs shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-bubble font-bold text-sm text-slate-800 truncate">
                  {it.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  {it.sku && <span className="font-mono text-[11px]">SKU: {it.sku}</span>}
                  <span>•</span>
                  <span>Cantidad: {it.quantity || 1}</span>
                </div>
                {it.customText && (
                  <p className="text-[11px] text-purple-700 italic truncate mt-0.5">
                    Personalizado: &quot;{it.customText}&quot;
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-slate-400 block font-sans">Valor total</span>
                <span className="font-bubble font-bold text-sm text-slate-800">
                  {formatCRC(it.layawayTotalAmount || it.price * (it.quantity || 1))}
                </span>
              </div>
            </div>
          ))}
      </div>

      {/* Cajas Financieras: Total, Abonado y Saldo que Debe */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        {/* Total */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
            Valor del Producto
          </span>
          <span className="font-bubble font-bold text-base sm:text-lg text-slate-800 block mt-0.5">
            {formatCRC(totalAmount)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Precio de contado</span>
        </div>

        {/* Monto Abonado */}
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-center">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide block">
            Monto Abonado
          </span>
          <span className="font-bubble font-bold text-base sm:text-lg text-emerald-700 block mt-0.5">
            {formatCRC(downPayment)}
          </span>
          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
            ✓ Pagado a la fecha
          </span>
        </div>

        {/* Saldo que Debe */}
        <div
          className={`p-3 rounded-2xl text-center border ${
            isFullyPaid
              ? 'bg-purple-50 border-purple-200/80 text-purple-800'
              : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 text-amber-900 shadow-xs'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wide block text-slate-600">
            Saldo que Debes
          </span>
          <span
            className={`font-bubble font-bold text-base sm:text-lg block mt-0.5 ${
              isFullyPaid ? 'text-purple-700' : 'text-amber-800'
            }`}
          >
            {isFullyPaid ? '₡0 (Cancelado)' : formatCRC(remainingDebt)}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            {isFullyPaid ? 'Listo para entrega' : 'Pendiente de liquidar'}
          </span>
        </div>
      </div>

      {/* Reloj y Cuenta Regresiva de Días Restantes */}
      {!isFullyPaid && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/80 via-orange-50/60 to-purple-50/80 border border-amber-200 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
            <div className="flex items-center gap-1.5 font-bubble font-bold text-slate-800 text-sm">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>
                {countdown.isExpired
                  ? 'El plazo para cancelar este apartado ya ha vencido'
                  : `Te quedan ${countdown.daysRemaining} día${countdown.daysRemaining !== 1 ? 's' : ''} de plazo`}
              </span>
            </div>
            <span className="text-slate-500 font-sans text-xs">
              Fecha límite: <strong className="text-slate-800">{countdown.dueDateFormatted}</strong>
            </span>
          </div>

          {/* Barra de Progreso Dinámica de Días */}
          <div className="space-y-1">
            <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden shadow-inner p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  countdown.isExpired
                    ? 'bg-red-500'
                    : countdown.isNearExpiry
                    ? 'bg-gradient-to-r from-amber-500 to-red-500 animate-pulse'
                    : 'bg-gradient-to-r from-emerald-500 via-amber-500 to-amber-600'
                }`}
                style={{ width: `${Math.max(5, countdown.progressPercent)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1">
              <span>Día 1</span>
              <span>
                {countdown.daysElapsed} de {countdown.daysTotal} días transcurridos ({countdown.progressPercent}%)
              </span>
              <span>Día {countdown.daysTotal}</span>
            </div>
          </div>

          {/* Banner de Urgencia Si Faltan <= 5 Días */}
          {countdown.isNearExpiry && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs space-y-1 animate-fadeIn">
              <div className="flex items-center gap-2 font-bubble font-bold text-red-900">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>¡Recordatorio importante! Tu apartado está a punto de vencer</span>
              </div>
              <p className="text-[11px] text-red-700 leading-relaxed font-sans">
                Faltan solo <strong>{countdown.daysRemaining} días</strong> para la fecha límite (
                {countdown.dueDateFormatted}). Cancela tu saldo de <strong>{formatCRC(remainingDebt)}</strong>{' '}
                para no perder tu reserva. Te hemos enviado los detalles a tu correo electrónico.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Acciones de Pago / SINPE / WhatsApp */}
      {!isFullyPaid && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-amber-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySinpe}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bubble font-bold transition-all cursor-pointer"
              title="Copiar número de SINPE Móvil"
            >
              {copiedSinpe ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-purple-700" />}
              <span>{copiedSinpe ? '¡Copiado 6400-4640!' : 'SINPE: 6400-4640'}</span>
            </button>
            <span className="text-[11px] text-slate-500 font-sans hidden sm:inline">
              (Fiorella Solano)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onPrintInvoice && (
              <button
                type="button"
                onClick={() => onPrintInvoice(order)}
                className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bubble font-bold transition-all cursor-pointer"
              >
                Ver Comprobante
              </button>
            )}

            <a
              href={`https://wa.me/50664004640?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playBubblePopSound(0.3)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bubble font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Abonar por WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
