import React, { useState } from 'react';
import { Order, LayawayPaymentRecord } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatCRC, formatShortDate } from '../../utils/formatters';
import { calculateLayawayDaysRemaining } from '../../services/layawayReminderService';
import { LayawayPaymentModal } from './LayawayPaymentModal';
import {
  BookmarkCheck,
  Receipt,
  Coins,
  ChevronDown,
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
  const { products } = useApp();
  const [copiedSinpe, setCopiedSinpe] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const countdown = calculateLayawayDaysRemaining(order);

  const layawayItem = (order.items && order.items.find((i) => i.isLayaway)) || (order.items && order.items[0]);
  const firstItem = layawayItem || (order.items && order.items[0]);

  // Si hace falta recuperar el precio de catálogo de este producto
  const matchedProduct = firstItem
    ? products.find((p) => p.id === firstItem.id || (firstItem.sku && p.sku === firstItem.sku))
    : undefined;
  const catalogPrice = matchedProduct ? matchedProduct.price * (firstItem?.quantity || 1) : 0;

  // 1. Pagos y abonos realizados
  const payments: LayawayPaymentRecord[] =
    Array.isArray(order.layawayPayments) && order.layawayPayments.length > 0
      ? order.layawayPayments
      : Array.isArray(layawayItem?.layawayPayments)
      ? (layawayItem.layawayPayments as LayawayPaymentRecord[])
      : [];

  const sumOfAbonos = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  const initialCheckoutPayment = Number(order.total) || 0;

  // Monto total abonado a la fecha (anticipo de checkout + suma exacta de cada abono)
  const downPayment =
    payments.length > 0
      ? initialCheckoutPayment + sumOfAbonos
      : ((order.layawayDownPaymentAmount && order.layawayDownPaymentAmount > 0
          ? Number(order.layawayDownPaymentAmount)
          : 0) ||
        (layawayItem?.layawayDownPaymentAmount && layawayItem.layawayDownPaymentAmount > 0
          ? Number(layawayItem.layawayDownPaymentAmount)
          : 0) ||
        initialCheckoutPayment);

  // Valor real del producto de contado
  let totalAmount =
    (order.layawayTotalAmount && Number(order.layawayTotalAmount) > 0 ? Number(order.layawayTotalAmount) : 0) ||
    (layawayItem?.layawayTotalAmount && Number(layawayItem.layawayTotalAmount) > 0 ? Number(layawayItem.layawayTotalAmount) : 0) ||
    catalogPrice ||
    (Number(firstItem?.price) > initialCheckoutPayment ? Number(firstItem.price) : 0);

  if (!totalAmount) {
    totalAmount = downPayment + (Number(order.layawayRemainingAmount) || 0);
  }
  if (totalAmount < downPayment) {
    totalAmount = downPayment;
  }

  const remainingDebt = Math.max(0, totalAmount - downPayment);
  const isFullyPaid = remainingDebt <= 0;

  // Formato limpio del número de orden sin dobles '#'
  const rawNum = (order.orderNumber || '').replace(/^#+/, '');
  const cleanOrderNumber = rawNum ? `#${rawNum}` : '#FIO';

  const handleCopySinpe = () => {
    navigator.clipboard.writeText('64004640');
    setCopiedSinpe(true);
    playWaterDropSound();
    setTimeout(() => setCopiedSinpe(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `¡Hola Fiorella! 🌸 Quiero consultar / realizar un abono de mi apartado en by.fio:

` +
      `🏷️ *Número de Pedido:* ${cleanOrderNumber}
` +
      `📦 *Artículo:* ${firstItem?.name || 'Artículo Apartado'}
` +
      `💰 *Total:* ${formatCRC(totalAmount)}
` +
      `✅ *Abonado a la fecha:* ${formatCRC(downPayment)}
` +
      `⚠️ *Saldo pendiente:* ${formatCRC(remainingDebt)}
` +
      `⏳ *Días restantes:* ${countdown.daysRemaining} días (Vence: ${countdown.dueDateFormatted})

` +
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
                Apartado {cleanOrderNumber}
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
              <span>100% Pagado</span>
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
              <span>Apartado Activo ({countdown.daysRemaining} {countdown.daysRemaining === 1 ? 'día' : 'días'})</span>
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
                  {formatCRC(it.layawayTotalAmount || (it.price > downPayment ? it.price : 0) || totalAmount)}
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
            {isFullyPaid ? '₡0 (Pagado)' : formatCRC(remainingDebt)}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            {isFullyPaid ? 'Listo para entrega' : 'Pendiente de liquidar'}
          </span>
        </div>
      </div>

      {/* Barra de Tiempo y Plazo */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bubble font-bold text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>Fecha Límite: <strong>{countdown.dueDateFormatted}</strong></span>
          </span>
          <span
            className={`font-bold ${
              countdown.isExpired
                ? 'text-red-700'
                : countdown.isNearExpiry
                ? 'text-orange-700 animate-pulse'
                : 'text-amber-800'
            }`}
          >
            {countdown.isExpired
              ? 'Plazo expirado'
              : `${countdown.daysRemaining} ${countdown.daysRemaining === 1 ? 'día restante' : 'días restantes'}`}
          </span>
        </div>

        {/* Barra de Progreso Visual */}
        <div className="w-full bg-white/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-amber-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              countdown.isExpired
                ? 'bg-red-500'
                : countdown.isNearExpiry
                ? 'bg-gradient-to-r from-amber-500 to-red-500'
                : 'bg-gradient-to-r from-amber-400 to-orange-400'
            }`}
            style={{ width: `${Math.max(5, Math.min(100, countdown.progressPercent))}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
          <span>Inició: {formatShortDate(order.createdAt)}</span>
          <span className="text-amber-700 font-medium">
            {order.layawayPaymentsCount || 3} cuotas acordadas
          </span>
        </div>
      </div>

      {/* Historial de Abonos Realizados */}
      {payments.length > 0 && (
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
          <button
            type="button"
            onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
            className="w-full flex items-center justify-between text-slate-700 font-bubble font-bold cursor-pointer hover:text-amber-700 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-amber-600" />
              <span>Historial de Abonos ({payments.length})</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isHistoryExpanded ? 'rotate-180' : ''}`} />
          </button>

          {isHistoryExpanded && (
            <div className="space-y-1.5 pt-1.5 border-t border-slate-200/70 animate-in fade-in">
              {payments.map((p, idx) => (
                <div
                  key={p.id || idx}
                  className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-white border border-slate-200/70 text-[11px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bubble font-bold text-emerald-700">{formatCRC(p.amount)}</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px] uppercase">
                      {p.paymentMethod}
                    </span>
                    {p.reference && (
                      <span className="text-slate-500 font-mono text-[10px]">
                        Ref: #{p.reference}
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400 font-sans">{formatShortDate(p.date)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recordatorio del Sistema */}
      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 text-[11px] text-purple-900">
        <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Recordatorio automático:</strong> Te enviaremos un correo preventivo faltando <strong>5 días</strong> para el vencimiento de tu apartado. Puedes liquidar o abonar en cualquier momento.
        </p>
      </div>

      {/* Métodos de Abono y Acciones */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-amber-100">
        {/* Info SINPE Rápida */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-mono font-bold flex items-center gap-2">
            <span>SINPE: 64004640</span>
            <button
              type="button"
              onClick={handleCopySinpe}
              className="text-purple-600 hover:text-purple-800 p-0.5 transition-colors cursor-pointer"
              title="Copiar número SINPE Móvil"
            >
              {copiedSinpe ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          {copiedSinpe && (
            <span className="text-[11px] text-emerald-600 font-bold animate-in fade-in">
              ¡Copiado!
            </span>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center gap-2 justify-end flex-wrap">
          {!isFullyPaid && remainingDebt > 0 && (
            <button
              type="button"
              onClick={() => {
                playWaterDropSound();
                setIsPaymentModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white text-xs font-bubble font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Abonar Cuota</span>
            </button>
          )}

          {onPrintInvoice && (
            <button
              type="button"
              onClick={() => onPrintInvoice(order)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bubble font-bold transition-all cursor-pointer"
            >
              Ver Factura
            </button>
          )}

          <a
            href={`https://wa.me/50664004640?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playBubblePopSound()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-xs font-bubble font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Reportar Abono</span>
          </a>
        </div>
      </div>
      {/* Modal de Abonos del Cliente */}
      <LayawayPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        order={order}
        totalAmount={totalAmount}
        downPayment={downPayment}
        remainingDebt={remainingDebt}
        cleanOrderNumber={cleanOrderNumber}
      />
    </div>
  );
};
