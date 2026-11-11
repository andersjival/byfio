import React, { useState } from 'react';
import { Order, PaymentMethod } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatCRC } from '../../utils/formatters';
import {
  X,
  CreditCard,
  Smartphone,
  Building2,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShoppingBag,
  MessageCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playWaterDropSound, playBubblePopSound } from '../../utils/soundEffects';

interface LayawayPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  totalAmount: number;
  downPayment: number;
  remainingDebt: number;
  cleanOrderNumber: string;
}

export const LayawayPaymentModal: React.FC<LayawayPaymentModalProps> = ({
  isOpen,
  onClose,
  order,
  totalAmount,
  downPayment,
  remainingDebt,
  cleanOrderNumber,
}) => {
  const { addLayawayPayment } = useApp();

  const layawayItem = (order.items && order.items.find((i) => i.isLayaway)) || (order.items && order.items[0]);

  // Monto predeterminado de abono (sugiere ₡5 000 o el saldo completo si es menor)
  const defaultAmount = Math.min(remainingDebt, 10000);
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [customAmountText, setCustomAmountText] = useState<string>(String(defaultAmount));
  const [paymentMethod, setPaymentMethod] = useState<'sinpe' | 'transferencia' | 'tarjeta'>('sinpe');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [copiedSinpe, setCopiedSinpe] = useState(false);
  const [copiedIban, setCopiedIban] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleAmountChange = (num: number) => {
    const safeNum = Math.max(0, Math.min(remainingDebt, num));
    setAmount(safeNum);
    setCustomAmountText(safeNum ? String(safeNum) : '');
    setErrorMessage('');
    playWaterDropSound();
  };

  const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setCustomAmountText(val);
    const parsed = parseInt(val, 10) || 0;
    if (parsed > remainingDebt) {
      setAmount(remainingDebt);
      setCustomAmountText(String(remainingDebt));
    } else {
      setAmount(parsed);
    }
    setErrorMessage('');
  };

  const handleCopy = (text: string, type: 'sinpe' | 'iban') => {
    navigator.clipboard.writeText(text);
    if (type === 'sinpe') {
      setCopiedSinpe(true);
      setTimeout(() => setCopiedSinpe(false), 2500);
    } else {
      setCopiedIban(true);
      setTimeout(() => setCopiedIban(false), 2500);
    }
    playWaterDropSound();
  };

  const newBalance = Math.max(0, remainingDebt - amount);
  const willBeFullyPaid = newBalance === 0 && amount > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (amount <= 0) {
      setErrorMessage('Por favor ingresa un monto válido a abonar.');
      return;
    }

    if (amount > remainingDebt) {
      setErrorMessage(`El monto no puede superar tu saldo pendiente de ${formatCRC(remainingDebt)}.`);
      return;
    }

    if (paymentMethod === 'sinpe' && !reference.trim()) {
      setErrorMessage('Por favor escribe el número de comprobante SINPE para registrar tu pago.');
      return;
    }

    setIsSubmitting(true);
    try {
      const ok = await addLayawayPayment(order.id, {
        amount,
        paymentMethod,
        reference: reference.trim(),
        notes: notes.trim(),
        registeredBy: 'Cliente',
      });

      if (ok) {
        setIsSuccess(true);
        playBubblePopSound();
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}
      } else {
        setErrorMessage('No pudimos procesar el abono. Por favor intenta de nuevo.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error inesperado al registrar el abono.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `¡Hola Fiorella! 🌸 Acabo de realizar un abono de mi apartado en by.fio:\n\n` +
      `🏷️ *Número de Pedido:* ${cleanOrderNumber}\n` +
      `📦 *Artículo:* ${layawayItem?.name || 'Artículo Apartado'}\n` +
      `💵 *Monto Abonado:* ${formatCRC(amount)}\n` +
      `💳 *Método:* ${paymentMethod.toUpperCase()}${reference ? ` (Comprobante: #${reference})` : ''}\n` +
      `⚠️ *Nuevo Saldo:* ${formatCRC(newBalance)}\n\n` +
      `¿Me confirmas la recepción por favor? ¡Muchas gracias!`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-amber-200/90 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Cabecera del Modal */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bubble font-bold text-base sm:text-lg leading-tight">
                Abonar a mi Apartado
              </h3>
              <p className="text-xs text-amber-100 font-sans">
                Pedido <strong>{cleanOrderNumber}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido Desplazable */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {isSuccess ? (
            /* Vista de Éxito */
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-md shadow-emerald-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="font-bubble font-bold text-xl text-slate-800">
                  ¡Abono Registrado con Éxito!
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Hemos acreditado tu pago de <strong>{formatCRC(amount)}</strong> a tu apartado en tiempo real.
                </p>
              </div>

              {/* Resumen del Nuevo Saldo */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left space-y-2 max-w-sm mx-auto text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Valor de contado:</span>
                  <strong>{formatCRC(totalAmount)}</strong>
                </div>
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Total abonado acumulado:</span>
                  <strong>{formatCRC(downPayment + amount)}</strong>
                </div>
                <div className="flex justify-between text-amber-900 font-bubble font-bold text-sm pt-1 border-t border-amber-200">
                  <span>Saldo pendiente:</span>
                  <span>{newBalance === 0 ? '₡0 (100% Pagado)' : formatCRC(newBalance)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2 max-w-sm mx-auto">
                <a
                  href={`https://wa.me/50664004640?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bubble font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Comprobante</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bubble font-bold text-xs transition-all cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            /* Formulario de Abono */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tarjetita del Artículo y Resumen */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                {layawayItem?.image ? (
                  <img
                    src={layawayItem.image}
                    alt={layawayItem.name}
                    className="w-12 h-12 rounded-xl object-cover bg-white shadow-xs shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bubble font-bold text-sm text-slate-800 truncate">
                    {layawayItem?.name || 'Artículo en apartado'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Saldo que debes: <strong className="text-amber-800 font-bold">{formatCRC(remainingDebt)}</strong>
                  </p>
                </div>
              </div>

              {/* Selector de Monto */}
              <div className="space-y-2">
                <label className="block text-xs font-bubble font-bold text-slate-700 uppercase tracking-wide">
                  1. Elige el monto que deseas abonar hoy:
                </label>

                {/* Botones de sugerencias rápidas */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[5000, 10000, 15000].map((quick) => {
                    if (quick > remainingDebt) return null;
                    const isSelected = amount === quick;
                    return (
                      <button
                        key={quick}
                        type="button"
                        onClick={() => handleAmountChange(quick)}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-bubble font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-amber-300 hover:bg-amber-50/50'
                        }`}
                      >
                        {formatCRC(quick)}
                      </button>
                    );
                  })}

                  {/* Botón de liquidar todo */}
                  <button
                    type="button"
                    onClick={() => handleAmountChange(remainingDebt)}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bubble font-bold transition-all cursor-pointer ${
                      amount === remainingDebt
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-500 text-white shadow-sm'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    Liquidar Todo ({formatCRC(remainingDebt)})
                  </button>
                </div>

                {/* Entrada manual libre */}
                <div className="relative mt-2">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    ₡
                  </span>
                  <input
                    type="text"
                    value={customAmountText}
                    onChange={handleCustomInput}
                    placeholder="Otro monto (ej. 7500)"
                    className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 font-mono text-sm font-bold text-slate-800 transition-all outline-hidden"
                  />
                </div>

                {/* Simulación reactiva del nuevo saldo */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Saldo tras este abono:</span>
                  <span
                    className={`font-bubble font-bold ${
                      willBeFullyPaid ? 'text-emerald-700' : 'text-amber-800'
                    }`}
                  >
                    {willBeFullyPaid ? '🎉 100% Cancelado' : formatCRC(newBalance)}
                  </span>
                </div>
              </div>

              {/* Selector de Método de Pago */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bubble font-bold text-slate-700 uppercase tracking-wide">
                  2. Método de pago:
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('sinpe');
                      playWaterDropSound();
                    }}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'sinpe'
                        ? 'bg-purple-50 border-purple-400 text-purple-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                    <span className="text-[11px] font-bubble font-bold block">SINPE Móvil</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('transferencia');
                      playWaterDropSound();
                    }}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'transferencia'
                        ? 'bg-purple-50 border-purple-400 text-purple-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                    <span className="text-[11px] font-bubble font-bold block">Transferencia</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('tarjeta');
                      playWaterDropSound();
                    }}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'tarjeta'
                        ? 'bg-purple-50 border-purple-400 text-purple-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                    <span className="text-[11px] font-bubble font-bold block">Tarjeta</span>
                  </button>
                </div>
              </div>

              {/* Detalles del método elegido */}
              {paymentMethod === 'sinpe' && (
                <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/90 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-purple-800 font-bold block">SINPE Móvil Oficial By.Fio</span>
                      <span className="text-slate-600 font-mono font-bold text-sm">64004640</span>
                      <span className="text-[10px] text-purple-600 block">Fiorella Barahona (BCR / BAC)</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy('64004640', 'sinpe')}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bubble font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      {copiedSinpe ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSinpe ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>

                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Número de comprobante SINPE: *
                    </label>
                    <input
                      type="text"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="Ej: 849204"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-purple-200 focus:border-purple-500 font-mono text-xs text-slate-800 outline-hidden"
                      required
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'transferencia' && (
                <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/90 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-indigo-900 font-bold block">IBAN BCR Colones</span>
                      <span className="text-slate-700 font-mono text-[11px]">CR28015202001150493641</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('CR28015202001150493641', 'iban')}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-bold flex items-center gap-1"
                    >
                      {copiedIban ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>Copiar</span>
                    </button>
                  </div>

                  <div className="pt-1">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Número de referencia bancaria:
                    </label>
                    <input
                      type="text"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="Ej: REF-948291"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-indigo-200 font-mono text-xs text-slate-800 outline-hidden"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'tarjeta' && (
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 space-y-2 text-xs">
                  <span className="text-emerald-900 font-bold block">Pasarela Segura con Tarjeta</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Aceptamos todas las tarjetas Visa, Mastercard y AMEX. Tu abono de <strong>{formatCRC(amount)}</strong> se debitará de forma segura.
                  </p>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Referencia o autorización de tarjeta:
                    </label>
                    <input
                      type="text"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="Ej: AUT-582910"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-200 font-mono text-xs text-slate-800 outline-hidden"
                    />
                  </div>
                </div>
              )}

              {/* Mensaje de Error si lo hay */}
              {errorMessage && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Botón de Confirmación */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || amount <= 0}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bubble font-bold text-sm shadow-md shadow-orange-500/20 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Procesando abono...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Confirmar y Abonar {formatCRC(amount)}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
