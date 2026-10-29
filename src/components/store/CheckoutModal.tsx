import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { formatCRC, formatShortDate } from '../../utils/formatters';
import { X, CheckCircle, Truck, Store, ArrowRight, Sparkles, MessageCircle, Printer } from 'lucide-react';
import { PaymentAccountsCard } from '../common/PaymentAccountsCard';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, createOrder, setViewMode, setInvoiceOrder } = useApp();

  const [deliveryMethod, setDeliveryMethod] = useState<'envio' | 'retiro'>('envio');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const shippingFee = deliveryMethod === 'envio' ? 2500 : 0;
  const total = subtotal + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    const order = createOrder({
      customerName,
      customerPhone,
      deliveryMethod,
      shippingAddress: deliveryMethod === 'envio' ? shippingAddress : 'Retiro en Taller (200 sur del parque de Tibás)',
      paymentMethod: 'sinpe',
      notes,
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#EC4899', '#C084FC', '#38BDF8', '#FACC15'],
    });

    setConfirmedOrder(order);
  };

  const handleClose = () => {
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Superior Fijo (Nunca se Recorta) */}
        <div className="p-4 sm:p-5 border-b border-slate-200/70 flex items-center justify-between bg-[#F1F2F6] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white shadow-neuBtn flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 leading-tight">
                {confirmedOrder ? `Reporte de Pedido — ${confirmedOrder.orderNumber}` : 'Checkout & Pago SINPE'}
              </h3>
              <p className="text-[11px] text-slate-500 font-sans">
                {confirmedOrder ? 'Comprobante y reporte oficial de pedido' : 'Completa tus datos para confirmar tu pedido'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 neu-btn-circle text-slate-500 hover:text-slate-800 transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {confirmedOrder ? (
          <div className="overflow-y-auto p-4 sm:p-6 space-y-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* Bloque Superior del Reporte de Pedido */}
            <div className="p-4 sm:p-5 rounded-3xl bg-[#F1F2F6] border border-white/90 shadow-neuCard space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-300/40 pb-3">
                <div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    Pedido Generado con Éxito
                  </span>
                  <h2 className="font-bubble font-bold text-lg sm:text-xl text-slate-900 mt-1">
                    ¡Gracias por tu compra, {confirmedOrder.customerName.split(' ')[0]}!
                  </h2>
                  <p className="text-[11px] text-slate-500 font-sans">
                    Tu pedido ha sido registrado oficialmente en el sistema de by.fio.
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Número de Pedido</span>
                  <span className="font-mono font-bold text-base sm:text-lg text-fio-900 bg-white px-3.5 py-1 rounded-xl shadow-neuBtn inline-block border border-white/80">
                    {confirmedOrder.orderNumber}
                  </span>
                </div>
              </div>

              {/* Fila de Metadatos Rápidos */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#ECEEF2] shadow-neuInset border border-white/60">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Fecha</span>
                  <p className="font-bold text-slate-800 text-[11px]">{formatShortDate(confirmedOrder.createdAt)}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#ECEEF2] shadow-neuInset border border-white/60">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">WhatsApp / Tel</span>
                  <p className="font-bold text-slate-800 text-[11px] truncate">{confirmedOrder.customerPhone}</p>
                </div>
                <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-[#ECEEF2] shadow-neuInset border border-white/60">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Entrega</span>
                  <p className="font-bold text-slate-800 text-[11px] truncate">
                    {confirmedOrder.deliveryMethod === 'envio' ? 'Envío por Correos CR' : 'Retiro en Taller'}
                  </p>
                </div>
              </div>
            </div>

            {/* Desglose de Artículos del Pedido */}
            <div className="p-4 rounded-2xl bg-[#ECEEF2] border border-white/70 shadow-neuInset space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Artículos en tu Pedido ({confirmedOrder.items.length})
              </span>
              <div className="divide-y divide-slate-200/60">
                {confirmedOrder.items.map((it) => (
                  <div key={it.id} className="py-2 flex items-center justify-between text-xs gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate">{it.quantity}x {it.name}</p>
                      {it.customText && (
                        <p className="text-[10px] text-fio-pink font-semibold">✨ "{it.customText}"</p>
                      )}
                    </div>
                    <span className="font-bubble font-bold text-slate-900 shrink-0">
                      {formatCRC(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-300/50 flex items-center justify-between font-bubble font-bold text-sm">
                <span className="text-slate-700">Total Oficial:</span>
                <span className="text-emerald-700 text-base">{formatCRC(confirmedOrder.total)}</span>
              </div>
            </div>

            {/* Cuentas Bancarias & SINPE Móvil Oficial */}
            <PaymentAccountsCard amount={confirmedOrder.total} orderNumber={confirmedOrder.orderNumber} compact />

            {/* Botones de Acción */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <a
                href={`https://wa.me/50664004640?text=${encodeURIComponent(
                  `¡Hola Fio! Acabo de registrar mi pedido ${confirmedOrder.orderNumber} por ${formatCRC(
                    confirmedOrder.total
                  )} en la web. Te adjunto el comprobante oficial:`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bubble font-bold text-xs flex items-center justify-center gap-2 shadow-neuBtn active:scale-95 transition-all text-center"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar por WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setInvoiceOrder(confirmedOrder);
                  handleClose();
                }}
                className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 text-fio-900 border border-slate-200 shadow-neuBtn font-bubble font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <Printer className="w-4 h-4 text-fio-800" />
                <span>Imprimir Factura / PDF</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="py-3 px-4 rounded-2xl neu-btn text-slate-700 font-bubble font-bold text-xs active:scale-95 transition-all"
              >
                Seguir Comprando
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* Método de Entrega */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Método de Entrega:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('envio')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                    deliveryMethod === 'envio'
                      ? 'border-fio-500 bg-fio-50 text-fio-800 shadow-sm'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  <Truck className="w-4 h-4 text-fio-500" />
                  <span>Envío CR (+₡2.500)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('retiro')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                    deliveryMethod === 'retiro'
                      ? 'border-fio-500 bg-fio-50 text-fio-800 shadow-sm'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  <Store className="w-4 h-4 text-fio-500" />
                  <span>Retiro en Taller (Gratis)</span>
                </button>
              </div>

              {deliveryMethod === 'retiro' && (
                <div className="mt-2 p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs space-y-1 animate-fadeIn">
                  <p className="font-bubble font-bold text-amber-900 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-amber-600" />
                    <span>Lugar y Horarios para Retiro en Tibás:</span>
                  </p>
                  <p className="text-[11px] text-slate-700">
                    📍 <strong>200 sur del parque de Tibás</strong> (Ref: MAYO10 / by.fio).
                  </p>
                  <p className="text-[10px] text-slate-600">
                    ⏰ <strong>Horarios:</strong> Lun, Mar y Vie 9:00 am - 5:00 pm &bull; Jue 10:00 am - 4:00 pm &bull; Sáb 10:00 am - 3:00 pm (Mié y Dom cerrado).
                  </p>
                </div>
              )}
            </div>

            {/* Datos del Cliente */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Nombre Completo *</label>
                <input
                  required
                  type="text"
                  placeholder="Ej: Sofía Solano"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-fio-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">WhatsApp / Teléfono *</label>
                <input
                  required
                  type="tel"
                  placeholder="Ej: 8888-8888"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-fio-400 focus:outline-none"
                />
              </div>
            </div>

            {deliveryMethod === 'envio' && (
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Dirección de Entrega Exacta *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Provincia, cantón, señas exactas..."
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-fio-400 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Notas especiales (opcional):</label>
              <input
                type="text"
                placeholder="Dedicatoria o instrucciones de empaque"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-fio-400 focus:outline-none"
              />
            </div>

            {/* Cuadro de Cuentas para SINPE Móvil y Pagos */}
            <PaymentAccountsCard amount={total} compact />

            {/* Resumen Totales */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-gray-500">Total a Pagar ({cart.length} ítems)</p>
                <p className="text-xl font-bubble font-bold text-fio-900">{formatCRC(total)}</p>
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-semibold text-xs shadow-clayBtn transition-all active:scale-95"
              >
                <span>Confirmar Pedido</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
