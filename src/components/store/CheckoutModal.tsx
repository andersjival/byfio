import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { formatCRC, formatShortDate } from '../../utils/formatters';
import { X, CheckCircle, Truck, Store, ArrowRight, MessageCircle, Printer, AlertTriangle, Hash, Lock, CheckCircle2 } from 'lucide-react';
import { PaymentAccountsCard, PartialPaymentInfo } from '../common/PaymentAccountsCard';
import { playBubblePopSound } from '../../utils/soundEffects';
import { playAudioBeep } from '../../utils/formatters';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    createOrder,
    setViewMode,
    setInvoiceOrder,
    validateSinpeReference,
    registerSinpeTransaction,
    verifySinpePaymentForCheckout,
    markSinpeTransactionUsed,
    simulateBcrEmailNotification,
    isFeatureEnabled,
    currentUser,
  } = useApp();

  const [deliveryMethod, setDeliveryMethod] = useState<'envio' | 'retiro'>('envio');
  const [customerName, setCustomerName] = useState(() => currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(() => (currentUser as any)?.phone || '');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentTab, setPaymentTab] = useState<'sinpe' | 'transferencia'>('sinpe');
  const [sinpeReference, setSinpeReference] = useState('');
  const [secondSinpeReference, setSecondSinpeReference] = useState('');
  const [partialPayment, setPartialPayment] = useState<PartialPaymentInfo | null>(null);
  const [isPaymentValidated, setIsPaymentValidated] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [refValidationError, setRefValidationError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const shippingFee = deliveryMethod === 'envio' ? 2500 : 0;
  const total = subtotal + shippingFee;

  const handleSinpeRefChange = (val: string) => {
    setSinpeReference(val);
    setRefValidationError(null);
    if (isPaymentValidated) {
      setIsPaymentValidated(false);
    }
  };

  const handleSecondRefChange = (val: string) => {
    setSecondSinpeReference(val);
    setRefValidationError(null);
  };

  const handleResetPartialPayment = () => {
    setPartialPayment(null);
    setSecondSinpeReference('');
    setRefValidationError(null);
    setIsPaymentValidated(false);
  };

  // Validación estricta con búsqueda directa en correos del BCR
  const handleValidatePayment = async () => {
    const clean = sinpeReference.trim();
    if (!clean || clean.length < 3) {
      setRefValidationError('Digita un número de comprobante o referencia válido (mínimo 3 dígitos/caracteres).');
      setIsPaymentValidated(false);
      setPartialPayment(null);
      return;
    }

    setIsValidating(true);
    setRefValidationError(null);

    const res = await verifySinpePaymentForCheckout(clean, total, false);
    setIsValidating(false);

    if (res.status === 'already_used') {
      setRefValidationError('⚠️ Este pago ya fue utilizado, digite correctamente el número de referencia de la transferencia.');
      setIsPaymentValidated(false);
      setPartialPayment(null);
      return;
    }

    if (res.status === 'not_found') {
      setRefValidationError(res.message);
      setIsPaymentValidated(false);
      setPartialPayment(null);
      return;
    }

    if (res.status === 'invalid_mismatch') {
      setRefValidationError(res.message);
      setIsPaymentValidated(false);
      setPartialPayment(null);
      return;
    }

    if (res.status === 'invalid_incomplete') {
      setRefValidationError(res.message);
      setIsPaymentValidated(false);
      if (isFeatureEnabled('sinpe', 'missing_voucher_window')) {
        setPartialPayment({
          requiredTotal: total,
          missingAmount: res.missingAmount || (total - (res.voucherAmount || 0)),
          firstVoucher: {
            ref: res.transaction?.referenceNumber || clean,
            amount: res.voucherAmount || 0,
            originName: res.transaction?.originName,
          },
          isComplete: false,
        });
        setSecondSinpeReference('');
      } else {
        setPartialPayment(null);
      }
      playAudioBeep('error');
      return;
    }

    if (res.status === 'valid_exact') {
      setIsPaymentValidated(true);
      setPartialPayment(null);
      setRefValidationError(null);
      playBubblePopSound(0.4);
    }
  };

  // Validación del segundo comprobante para cubrir el saldo faltante
  const handleValidateSecondPayment = async () => {
    if (!partialPayment) return;
    const clean2 = secondSinpeReference.trim();
    if (!clean2 || clean2.length < 3) {
      setRefValidationError('Por favor digite el número de referencia del segundo comprobante.');
      return;
    }

    setIsValidating(true);
    setRefValidationError(null);

    const res = await verifySinpePaymentForCheckout(
      clean2,
      partialPayment.missingAmount,
      true,
      partialPayment.firstVoucher.ref
    );
    setIsValidating(false);

    if (res.status === 'already_used') {
      setRefValidationError('⚠️ Este pago ya fue utilizado, digite correctamente el número de referencia de la transferencia.');
      return;
    }

    if (res.status === 'not_found') {
      setRefValidationError(res.message);
      return;
    }

    if (res.status === 'invalid_mismatch' || res.status === 'invalid_incomplete') {
      setRefValidationError(
        `⚠️ Monto inválido. El segundo comprobante encontrado en el correo registra ₡${(res.voucherAmount || 0).toLocaleString('es-CR')}, pero el saldo faltante exacto es ₡${partialPayment.missingAmount.toLocaleString('es-CR')}. El monto tiene que coincidir exactamente con el correo.`
      );
      return;
    }

    if (res.status === 'valid_exact') {
      setPartialPayment({
        ...partialPayment,
        secondVoucher: {
          ref: res.transaction?.referenceNumber || clean2,
          amount: res.voucherAmount || partialPayment.missingAmount,
          originName: res.transaction?.originName,
        },
        isComplete: true,
      });
      setIsPaymentValidated(true);
      setRefValidationError(null);
      playBubblePopSound(0.4);
    }
  };

  // Simulación para pruebas rápidas
  const handleSimulateBcrEmail = (type: 'exact' | 'partial') => {
    if (type === 'exact') {
      const isSecond = partialPayment && !partialPayment.isComplete;
      const refToUse = isSecond
        ? (secondSinpeReference.trim() || `BCR-SIM-${Date.now().toString().slice(-5)}`)
        : (sinpeReference.trim() || `BCR-SIM-${Date.now().toString().slice(-5)}`);

      const amountToUse = isSecond ? partialPayment.missingAmount : total;

      if (isSecond) {
        setSecondSinpeReference(refToUse);
      } else {
        setSinpeReference(refToUse);
      }

      simulateBcrEmailNotification(refToUse, amountToUse, customerName || 'Cliente by.fio');

      setTimeout(() => {
        if (isSecond) {
          handleValidateSecondPayment();
        } else {
          handleValidatePayment();
        }
      }, 150);
    } else {
      const refToUse = sinpeReference.trim() || `BCR-SIM-${Date.now().toString().slice(-5)}`;
      const partialAmount = Math.round(total * 0.6); // 60%
      setSinpeReference(refToUse);
      simulateBcrEmailNotification(refToUse, partialAmount, customerName || 'Cliente by.fio');
      setTimeout(() => {
        handleValidatePayment();
      }, 150);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    if (!isPaymentValidated) {
      setRefValidationError('Por favor digita tu número de comprobante y haz clic en "Validar Pago" para habilitar la confirmación.');
      return;
    }

    let orderNotesCombined = notes;
    if (partialPayment && partialPayment.isComplete && partialPayment.secondVoucher) {
      orderNotesCombined = `Comprobantes SINPE BCR Multi-Pago: #1 ${partialPayment.firstVoucher.ref} (${formatCRC(partialPayment.firstVoucher.amount)}) + #2 ${partialPayment.secondVoucher.ref} (${formatCRC(partialPayment.secondVoucher.amount)}) | Total: ${formatCRC(total)}${notes ? ` | ${notes}` : ''}`;
    } else {
      const cleanRef = sinpeReference.trim();
      orderNotesCombined = `Comprobante ${paymentTab === 'sinpe' ? 'SINPE Móvil' : 'Transferencia BCR'}: #${cleanRef} (${formatCRC(total)})${notes ? ` | ${notes}` : ''}`;
    }

    const order = createOrder({
      customerName,
      customerPhone,
      deliveryMethod,
      shippingAddress: deliveryMethod === 'envio' ? shippingAddress : 'Retiro en Taller (200 sur del parque de Tibás)',
      paymentMethod: paymentTab,
      notes: orderNotesCombined,
    });

    // Marcar los comprobantes como utilizados en el sistema inmutablemente
    if (partialPayment && partialPayment.isComplete && partialPayment.secondVoucher) {
      markSinpeTransactionUsed(partialPayment.firstVoucher.ref, order.id);
      markSinpeTransactionUsed(partialPayment.secondVoucher.ref, order.id);
    } else {
      const cleanRef = sinpeReference.trim();
      if (cleanRef) {
        markSinpeTransactionUsed(cleanRef, order.id);
      }
    }

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
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bubble font-bold text-xs border border-emerald-300 shadow-xs">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pedido Pagado por {confirmedOrder.paymentMethod === 'sinpe' ? 'SINPE Móvil' : 'Transferencia'} — Ya Verificado</span>
                  </span>
                  <h2 className="font-bubble font-bold text-lg sm:text-xl text-slate-900 mt-1">
                    ¡Gracias por tu compra, {confirmedOrder.customerName.split(' ')[0]}!
                  </h2>
                  <p className="text-[11px] text-slate-500 font-sans">
                    Tu pago ha sido verificado con éxito y el pedido está registrado oficialmente.
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
              {confirmedOrder.notes && (
                <div className="pt-2 border-t border-slate-300/40">
                  <p className="text-[11px] text-emerald-800 font-mono bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                    📌 {confirmedOrder.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Tarjeta de Pago Verificado Inmediato */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-50 to-[#ECEEF2] border-2 border-emerald-300 shadow-neuCard text-slate-800 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white shadow-neuBtn flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                      Transacción Acreditada
                    </span>
                    <h4 className="font-bubble font-bold text-sm text-emerald-950">
                      Pagado por {confirmedOrder.paymentMethod === 'sinpe' ? 'SINPE Móvil' : 'Transferencia Bancaria'}
                    </h4>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bubble font-bold text-xs shadow-xs">
                  ✓ VERIFICADO
                </span>
              </div>
            </div>

            {/* Botones de Acción Oficiales */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  setInvoiceOrder(confirmedOrder);
                  handleClose();
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 text-fio-900 border border-slate-200 shadow-neuBtn font-bubble font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 text-fio-800" />
                <span>Imprimir Factura / PDF</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 px-4 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-bold text-xs flex items-center justify-center gap-1.5 shadow-clayBtn active:scale-95 transition-all cursor-pointer"
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

            {/* Cuadro de Cuentas para SINPE Móvil y Transferencia Bancaria con Validación Integrada */}
            <PaymentAccountsCard
              amount={total}
              compact
              activeTab={paymentTab}
              onTabChange={(tab) => {
                setPaymentTab(tab);
                handleResetPartialPayment();
              }}
              showValidation={true}
              referenceNumber={sinpeReference}
              onReferenceChange={handleSinpeRefChange}
              isPaymentValidated={isPaymentValidated}
              onValidatePayment={handleValidatePayment}
              isValidating={isValidating}
              validationError={refValidationError}
              partialPayment={partialPayment}
              secondReferenceNumber={secondSinpeReference}
              onSecondReferenceChange={handleSecondRefChange}
              onValidateSecondPayment={handleValidateSecondPayment}
              onResetPartialPayment={handleResetPartialPayment}
              onSimulateBcrEmail={handleSimulateBcrEmail}
            />

            {/* Resumen Totales y Botón de Confirmación */}
            <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <p className="text-[11px] text-gray-500">Total a Pagar ({cart.length} ítems)</p>
                <p className="text-xl font-bubble font-bold text-fio-900">{formatCRC(total)}</p>
              </div>

              <div className="flex flex-col items-stretch sm:items-end gap-1">
                <button
                  type="submit"
                  disabled={!isPaymentValidated}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bubble font-bold text-xs transition-all ${
                    isPaymentValidated
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-clayBtn active:scale-95 cursor-pointer ring-2 ring-emerald-400'
                      : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed shadow-none'
                  }`}
                  title={
                    isPaymentValidated
                      ? 'Confirmar pedido oficialmente'
                      : 'Digita el comprobante y presiona "Validar Pago" para habilitar este botón'
                  }
                >
                  {isPaymentValidated ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      <span>Confirmar Pedido</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Confirmar Pedido (Valida el pago)</span>
                    </>
                  )}
                </button>
                {!isPaymentValidated && (
                  <span className="text-[10px] text-slate-400 text-center sm:text-right">
                    Digita el comprobante y dale a validar pago para activar
                  </span>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
