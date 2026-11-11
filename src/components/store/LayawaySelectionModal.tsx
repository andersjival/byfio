import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../../types';
import { formatCRC } from '../../utils/formatters';
import { getProductLayawayDetails } from '../../utils/layaway';
import { calculateLayawayDaysRemaining } from '../../services/layawayReminderService';
import { X, BookmarkCheck, ArrowRight, Calendar, Calculator, ShieldCheck, Heart, AlertCircle, Sparkles } from 'lucide-react';
import { playWaterDropSound, playBubblePopSound } from '../../utils/soundEffects';

interface LayawaySelectionModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmLayaway: (product: Product, downPaymentAmount: number, customText?: string) => void;
  initialCustomText?: string;
}

export const LayawaySelectionModal: React.FC<LayawaySelectionModalProps> = ({
  product,
  isOpen,
  onClose,
  onConfirmLayaway,
  initialCustomText = '',
}) => {
  const [customAmount, setCustomAmount] = useState<number>(0);
  const [customText, setCustomText] = useState(initialCustomText);

  const layDetails = useMemo(() => {
    return product ? getProductLayawayDetails(product) : null;
  }, [product]);

  // Inicializar con el monto mínimo configurado al abrir
  useEffect(() => {
    if (product && layDetails) {
      setCustomAmount(layDetails.downPaymentAmount);
      setCustomText(initialCustomText);
    }
  }, [product, layDetails, initialCustomText, isOpen]);

  if (!isOpen || !product || !layDetails) return null;

  const totalPrice = Number(product.price) || 0;
  const minDownPayment = layDetails.downPaymentAmount;
  const isAmountValid = customAmount >= minDownPayment && customAmount <= totalPrice;
  const remainingAmount = Math.max(0, totalPrice - customAmount);

  // Cuotas restantes recalculadas dinámicamente con el nuevo abono
  const remainingPaymentsCount = Math.max(1, (layDetails.paymentsCount || 3) - 1);
  const dynamicInstallment = Math.round(remainingAmount / remainingPaymentsCount);

  // Estimación de fecha de vencimiento
  const daysTotal = (layDetails.months || 1) * 30;
  const dueDate = new Date(Date.now() + daysTotal * 24 * 60 * 60 * 1000);
  const dueDateFormatted = dueDate.toLocaleDateString('es-CR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePreset = (percent: number) => {
    const val = Math.round(totalPrice * (percent / 100));
    setCustomAmount(Math.max(minDownPayment, val));
    playWaterDropSound();
  };

  const handleConfirm = () => {
    if (!isAmountValid) return;
    playBubblePopSound(0.4);
    onConfirmLayaway(product, customAmount, customText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-[#FAF5FF] border border-white/90 rounded-[32px] shadow-2xl p-5 sm:p-7 space-y-4 max-h-[92vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-slate-700 shadow-sm transition-all cursor-pointer"
          aria-label="Cerrar modal de apartado"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-2.5 pb-2 border-b border-purple-100">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md">
            <BookmarkCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bubble text-lg sm:text-xl font-bold text-slate-800 leading-tight">
              Plan de Apartado Personalizado
            </h3>
            <p className="text-xs text-slate-500 font-sans">
              Abona el monto que desees hoy y asegura tu producto en taller
            </p>
          </div>
        </div>

        {/* Resumen del Artículo */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-purple-100/80 shadow-xs">
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200/60 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] text-fio-purple font-bold uppercase tracking-wider block">
              {product.category}
            </span>
            <h4 className="font-bubble text-sm font-bold text-slate-900 truncate" title={product.name}>
              {product.name}
            </h4>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xs text-slate-500 font-sans">Valor total:</span>
              <span className="font-bubble text-base font-bold text-slate-900">
                {formatCRC(totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Selector de Abono Inicial */}
        <div className="space-y-2.5 p-4 rounded-2xl bg-white/90 border border-purple-100 shadow-xs">
          <div className="flex items-center justify-between">
            <label className="font-bubble text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-amber-600" />
              <span>¿Cuánto deseas abonar hoy?</span>
            </label>
            <span className="text-[11px] font-sans font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
              Mínimo {layDetails.downPaymentPercent}%: {formatCRC(minDownPayment)}
            </span>
          </div>

          {/* Pastillas Rápidas de Porcentaje */}
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: `${layDetails.downPaymentPercent}% (Mínimo)`, pct: layDetails.downPaymentPercent },
              { label: '35%', pct: 35 },
              { label: '50%', pct: 50 },
              { label: '70%', pct: 70 },
            ].map((preset) => {
              const amountVal = Math.round(totalPrice * (preset.pct / 100));
              const isSelected = customAmount === amountVal;
              return (
                <button
                  key={preset.pct}
                  type="button"
                  onClick={() => handlePreset(preset.pct)}
                  className={`py-1.5 px-2 rounded-xl text-[10px] font-bubble font-bold transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-white shadow-sm scale-102'
                      : 'bg-[#F1F2F6] hover:bg-amber-50 text-slate-700 border border-slate-200/60'
                  }`}
                >
                  <span>{preset.pct}%</span>
                </button>
              );
            })}
          </div>

          {/* Input de Monto Editable */}
          <div className="relative pt-1">
            <span className="absolute left-3.5 top-3.5 text-base font-bold text-slate-400">₡</span>
            <input
              type="number"
              min={minDownPayment}
              max={totalPrice}
              step={500}
              value={customAmount || ''}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCustomAmount(val);
              }}
              className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#ECEEF2] text-base font-bubble font-bold text-slate-900 border border-white/60 shadow-neuInset focus:outline-none transition-all"
              placeholder={String(minDownPayment)}
            />
          </div>

          {customAmount < minDownPayment && (
            <p className="text-[11px] text-red-600 flex items-center gap-1 font-sans">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>El abono inicial no puede ser menor al mínimo configurado ({formatCRC(minDownPayment)}).</span>
            </p>
          )}

          {customAmount > totalPrice && (
            <p className="text-[11px] text-amber-700 flex items-center gap-1 font-sans">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Si abonas el 100% ({formatCRC(totalPrice)}), pagarás de contado sin saldo pendiente.</span>
            </p>
          )}
        </div>

        {/* Input de Personalización si el producto lo requiere */}
        {product.isCustomizable && (
          <div className="p-3.5 rounded-2xl bg-white border border-purple-100 shadow-xs space-y-1.5">
            <label className="text-xs font-bubble font-bold text-slate-800 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-fio-pink fill-fio-pink" />
              <span>Personalización (nombre o frase):</span>
            </label>
            <input
              type="text"
              placeholder={product.customizationPlaceholder || 'Ej: Nombre Sofía / Letra S'}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#ECEEF2] text-xs text-slate-800 border border-white/60 shadow-neuInset focus:outline-none"
            />
          </div>
        )}

        {/* Desglose Reactivo en Vivo del Apartado */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 via-purple-50/60 to-pink-50/60 border border-amber-200/80 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-amber-200/60">
            <span className="font-sans font-medium text-slate-600">Pagas hoy en la pasarela (1ª cuota):</span>
            <span className="font-bubble text-base font-bold text-emerald-700">
              {formatCRC(customAmount)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="font-sans font-medium text-slate-600">Saldo que quedas debiendo:</span>
            <span className="font-bubble text-base font-bold text-rose-600">
              {formatCRC(remainingAmount)}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-600 font-sans pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-fio-purple" />
              <span>Plazo de tiempo:</span>
            </span>
            <span className="font-bold text-slate-800">
              {daysTotal} días (Vence el {dueDateFormatted})
            </span>
          </div>

          {remainingAmount > 0 && (
            <div className="flex items-center justify-between text-[11px] text-slate-600 font-sans">
              <span>Cuotas sugeridas restantes:</span>
              <span className="font-semibold text-slate-800">
                {remainingPaymentsCount} cuota{remainingPaymentsCount !== 1 ? 's' : ''} de {formatCRC(dynamicInstallment)}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-[10px] text-amber-800 font-sans bg-white/70 p-2 rounded-xl border border-amber-200/40">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              Recibirás un recordatorio por correo faltando 5 días para vencer tu plazo y podrás consultar tu saldo en tiempo real desde Mi Cuenta.
            </span>
          </div>
        </div>

        {/* Botón de Confirmación Directo al Checkout */}
        <button
          type="button"
          disabled={!isAmountValid}
          onClick={handleConfirm}
          className={`w-full py-3.5 px-5 rounded-2xl font-bubble font-bold text-xs sm:text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
            isAmountValid
              ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800'
              : 'bg-slate-300 cursor-not-allowed text-slate-500'
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>Aceptar y Proceder al Pago ({formatCRC(customAmount)})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
