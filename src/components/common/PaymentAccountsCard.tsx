import React, { useState } from 'react';
import {
  Copy, Check, Smartphone, Building2, MessageCircle, ShieldCheck,
  AlertTriangle, RefreshCw, Sparkles, Hash, ArrowRight
} from 'lucide-react';
import { formatCRC } from '../../utils/formatters';

export interface PartialPaymentInfo {
  requiredTotal: number;
  missingAmount: number;
  firstVoucher: {
    ref: string;
    amount: number;
    originName?: string;
  };
  secondVoucher?: {
    ref: string;
    amount: number;
    originName?: string;
  };
  isComplete: boolean;
}

interface PaymentAccountsCardProps {
  amount?: number;
  orderNumber?: string;
  compact?: boolean;
  activeTab?: 'sinpe' | 'transferencia';
  onTabChange?: (tab: 'sinpe' | 'transferencia') => void;
  showValidation?: boolean;
  referenceNumber?: string;
  onReferenceChange?: (ref: string) => void;
  isPaymentValidated?: boolean;
  onValidatePayment?: () => void;
  isValidating?: boolean;
  validationError?: string | null;
  partialPayment?: PartialPaymentInfo | null;
  secondReferenceNumber?: string;
  onSecondReferenceChange?: (ref: string) => void;
  onValidateSecondPayment?: () => void;
  onResetPartialPayment?: () => void;
  onSimulateBcrEmail?: (type: 'exact' | 'partial') => void;
}

export const PaymentAccountsCard: React.FC<PaymentAccountsCardProps> = ({
  amount,
  orderNumber,
  compact = false,
  activeTab: controlledTab,
  onTabChange,
  showValidation = false,
  referenceNumber = '',
  onReferenceChange,
  isPaymentValidated = false,
  onValidatePayment,
  isValidating = false,
  validationError = null,
  partialPayment = null,
  secondReferenceNumber = '',
  onSecondReferenceChange,
  onValidateSecondPayment,
  onResetPartialPayment,
  onSimulateBcrEmail,
}) => {
  const [internalTab, setInternalTab] = useState<'sinpe' | 'transferencia'>('sinpe');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const currentTab = controlledTab !== undefined ? controlledTab : internalTab;

  const handleSelectTab = (tab: 'sinpe' | 'transferencia') => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2500);
    });
  };

  return (
    <div className={`rounded-3xl bg-[#F1F2F6] border border-white/90 shadow-neuCard text-slate-800 space-y-3.5 transition-all ${compact ? 'p-3.5 sm:p-4' : 'p-5 sm:p-6'}`}>
      {/* Encabezado */}
      <div className="flex items-center justify-between border-b border-slate-300/40 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#F1F2F6] shadow-neuBtn flex items-center justify-center text-amber-500">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bubble font-bold text-sm sm:text-base text-slate-900 leading-tight">
              Formas de Pago Oficiales
            </h4>
            <p className="text-[10px] text-slate-500 font-sans">
              by.fio &bull; Costa Rica
            </p>
          </div>
        </div>

        {amount !== undefined && (
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total a transferir</span>
            <span className="font-bubble font-bold text-sm sm:text-base text-emerald-700">
              {formatCRC(amount)}
            </span>
          </div>
        )}
      </div>

      {/* Pestañas: SINPE Móvil vs Transferencia Bancaria */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#ECEEF2] border border-white/80 shadow-neuInset">
        <button
          type="button"
          onClick={() => handleSelectTab('sinpe')}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bubble font-bold transition-all flex-1 cursor-pointer ${
            currentTab === 'sinpe'
              ? 'bg-emerald-600 text-white shadow-neuBtn'
              : 'text-slate-600 hover:text-emerald-700'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>SINPE Móvil</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectTab('transferencia')}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bubble font-bold transition-all flex-1 cursor-pointer ${
            currentTab === 'transferencia'
              ? 'bg-[#D62828] text-white shadow-neuBtn'
              : 'text-slate-600 hover:text-[#D62828]'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Transferencia Bancaria</span>
        </button>
      </div>

      {/* PESTAÑA 1: SINPE MÓVIL (Activa por Defecto) */}
      {currentTab === 'sinpe' && (
        <div className="p-4 rounded-2xl bg-[#ECEEF2] border border-white/70 shadow-neuInset space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bubble font-bold text-slate-800">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              Número Oficial SINPE Móvil
            </span>
            <button
              type="button"
              onClick={() => copyToClipboard('64004640', 'sinpe')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl neu-btn text-[11px] font-bubble font-bold text-emerald-800 active:scale-95 transition-all cursor-pointer"
              title="Copiar número de SINPE"
            >
              {copiedField === 'sinpe' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-500" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pt-1">
            <p className="font-bubble font-bold text-xl sm:text-2xl text-emerald-700 tracking-wide">
              6400-4640
            </p>
            <p className="text-xs text-slate-600 font-medium">
              Titular: <strong className="text-slate-900 font-bold">Fiorella Patricia Jara Gutiérrez</strong>
            </p>
          </div>

          {orderNumber && (
            <p className="text-[11px] text-slate-500 bg-white/60 p-2 rounded-xl border border-slate-200/50">
              📌 En el detalle del SINPE colocar: <strong className="text-slate-800 font-mono font-bold">{orderNumber}</strong>
            </p>
          )}
        </div>
      )}

      {/* PESTAÑA 2: TRANSFERENCIA BANCARIA BCR (Aparece al dar clic en la pestaña) */}
      {currentTab === 'transferencia' && (
        <div className="p-4 rounded-2xl bg-[#F1F2F6] border border-white/80 shadow-neuCard space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-lg bg-[#D62828] text-white font-black text-[10px] tracking-wider uppercase shadow-xs">
                BCR
              </span>
              <span className="text-xs font-bubble font-bold text-slate-800">
                Banco de Costa Rica
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">
              Titular: <strong className="text-slate-800">Fiorella Patricia Jara Gutiérrez</strong>
            </span>
          </div>

          {/* Cuenta de Ahorros BCR */}
          <div className="p-2.5 rounded-xl bg-[#ECEEF2] border border-white/60 shadow-neuInset flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
                Cuenta de Ahorros
              </span>
              <p className="font-mono font-bold text-xs sm:text-sm text-slate-800 tracking-wider truncate">
                00126752891
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard('00126752891', 'ahorros')}
              className="neu-btn px-2.5 py-1 rounded-xl text-[10px] font-bubble font-bold text-slate-700 active:scale-95 transition-all shrink-0 flex items-center gap-1 cursor-pointer"
              title="Copiar número de cuenta de ahorros"
            >
              {copiedField === 'ahorros' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-500" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>

          {/* Cuenta IBAN BCR */}
          <div className="p-2.5 rounded-xl bg-[#ECEEF2] border border-white/60 shadow-neuInset flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
                Cuenta IBAN (Transferencias SINPE / Interbancarias)
              </span>
              <p className="font-mono font-bold text-xs sm:text-sm text-slate-900 tracking-wider break-all sm:break-normal">
                CR09015202001267528911
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard('CR09015202001267528911', 'iban')}
              className="neu-btn px-2.5 py-1 rounded-xl text-[10px] font-bubble font-bold text-slate-700 active:scale-95 transition-all shrink-0 flex items-center gap-1 cursor-pointer"
              title="Copiar cuenta IBAN completa"
            >
              {copiedField === 'iban' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-500" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* BLOQUE DE VALIDACIÓN DE PAGO (Comprobante / Referencia) */}
      {showValidation && (
        <div className="p-3.5 rounded-2xl bg-[#ECEEF2] border border-white/80 shadow-neuInset space-y-2.5 animate-fadeIn">
          {/* Si NO hay pago parcial en curso, mostrar el formulario estándar de referencia */}
          {(!partialPayment || partialPayment.isComplete) && (
            <>
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Digite el número de comprobante/referencia:</span>
                </label>
                {isPaymentValidated && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-bold font-bubble animate-fadeIn">
                    <Check className="w-3 h-3 text-emerald-600" />
                    Pago Verificado
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={currentTab === 'sinpe' ? 'Ej: 849201 ó ref. de SINPE...' : 'Ej: Ref. de transferencia bancaria...'}
                  value={referenceNumber}
                  onChange={(e) => {
                    if (onReferenceChange) onReferenceChange(e.target.value);
                  }}
                  disabled={isValidating || (isPaymentValidated && !partialPayment)}
                  className={`flex-1 px-3 py-2 rounded-xl bg-white border text-xs font-mono text-slate-800 focus:outline-none transition-all shadow-neuBtn ${
                    isPaymentValidated
                      ? 'border-emerald-400 bg-emerald-50/30'
                      : 'border-slate-200 focus:ring-2 focus:ring-emerald-400'
                  }`}
                />

                <button
                  type="button"
                  onClick={onValidatePayment}
                  disabled={isValidating || !referenceNumber?.trim() || isPaymentValidated}
                  className={`px-4 py-2 rounded-xl text-xs font-bubble font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                    isPaymentValidated
                      ? 'bg-emerald-600 text-white shadow-neuBtn'
                      : referenceNumber?.trim()
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-neuBtn active:scale-95 cursor-pointer'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {isValidating ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Validando en correo...</span>
                    </>
                  ) : isPaymentValidated ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Verificado</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Validar Pago</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {/* VENTANA DE COMPROBANTE FALTANTE (PAGO INCOMPLETO DETECTADO EN CORREO BCR) */}
          {partialPayment && !partialPayment.isComplete && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 border-2 border-rose-400 text-slate-800 space-y-3 shadow-md animate-fadeIn">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <AlertTriangle className="w-4 h-4 text-amber-200" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <h5 className="font-bubble font-bold text-xs sm:text-sm text-rose-900 leading-tight">
                      Monto Incompleto &bull; Pago Parcial Detectado
                    </h5>
                    <span className="text-[10px] font-bold uppercase bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full">
                      Falta Completar
                    </span>
                  </div>
                  <p className="text-xs text-rose-950 font-sans">
                    El comprobante <strong className="font-mono">#{partialPayment.firstVoucher.ref}</strong> registra <strong>{formatCRC(partialPayment.firstVoucher.amount)}</strong>.
                  </p>
                </div>
              </div>

              {/* Desglose de Montos */}
              <div className="grid grid-cols-3 gap-2 text-center p-2.5 rounded-xl bg-white/80 border border-rose-200 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total a Pagar</span>
                  <span className="font-bubble font-bold text-slate-800">{formatCRC(partialPayment.requiredTotal)}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 block">1er Abono BCR</span>
                  <span className="font-bubble font-bold text-emerald-700">{formatCRC(partialPayment.firstVoucher.amount)}</span>
                </div>
                <div className="border-l border-rose-200 pl-1">
                  <span className="text-[10px] uppercase font-black text-rose-600 block animate-pulse">Te Falta Pagar</span>
                  <span className="font-bubble font-bold text-rose-700 text-sm sm:text-base">{formatCRC(partialPayment.missingAmount)}</span>
                </div>
              </div>

              {/* Indicación de Segundo SINPE y Campo de Entrada */}
              <div className="space-y-2 pt-1 border-t border-rose-200/80">
                <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-rose-600" />
                  <span>
                    Digita el comprobante del faltante (por <strong>{formatCRC(partialPayment.missingAmount)}</strong>):
                  </span>
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Ej: Ref. de los ${formatCRC(partialPayment.missingAmount)} restantes...`}
                    value={secondReferenceNumber}
                    onChange={(e) => {
                      if (onSecondReferenceChange) onSecondReferenceChange(e.target.value);
                    }}
                    disabled={isValidating}
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-rose-300 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-neuBtn"
                  />

                  <button
                    type="button"
                    onClick={onValidateSecondPayment}
                    disabled={isValidating || !secondReferenceNumber?.trim()}
                    className={`px-4 py-2 rounded-xl text-xs font-bubble font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                      secondReferenceNumber?.trim()
                        ? 'bg-rose-700 hover:bg-rose-800 text-white shadow-neuBtn active:scale-95 cursor-pointer'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isValidating ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Validando...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Validar Faltante</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-500">
                    💡 Ambos comprobantes deben cubrir el monto total de la orden.
                  </span>
                  {onResetPartialPayment && (
                    <button
                      type="button"
                      onClick={onResetPartialPayment}
                      className="text-purple-700 hover:underline font-bold"
                    >
                      ← Cambiar 1er comprobante
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CONFIRMACIÓN DE COBRO COMPLETO CON MULTI-COMPROBANTE */}
          {partialPayment && partialPayment.isComplete && (
            <div className="p-3.5 rounded-2xl bg-emerald-100/80 border-2 border-emerald-400 text-emerald-950 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-700 shrink-0" />
                <h5 className="font-bubble font-bold text-xs sm:text-sm text-emerald-900">
                  Pago verificado con éxito, comprobantes números #{partialPayment.firstVoucher.ref} y #{partialPayment.secondVoucher?.ref} y monto confirmado de {formatCRC(partialPayment.requiredTotal)}.
                </h5>
              </div>
              <p className="text-[11px] text-emerald-800 font-sans">
                Se validaron los 2 comprobantes que cubren el 100% de la orden ({formatCRC(partialPayment.requiredTotal)}):
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-white/80 p-2.5 rounded-xl border border-emerald-300">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">1er Comprobante</span>
                  <span className="font-bold text-slate-800">#{partialPayment.firstVoucher.ref}</span>
                  <span className="text-emerald-700 font-bold block">{formatCRC(partialPayment.firstVoucher.amount)}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">2do Comprobante (Faltante)</span>
                  <span className="font-bold text-slate-800">#{partialPayment.secondVoucher?.ref}</span>
                  <span className="text-emerald-700 font-bold block">{formatCRC(partialPayment.secondVoucher?.amount || 0)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-bubble font-bold text-emerald-900">
                  ✓ El botón de "Confirmar pedido" está activado.
                </span>
                {onResetPartialPayment && (
                  <button
                    type="button"
                    onClick={onResetPartialPayment}
                    className="text-[10px] text-slate-500 hover:text-slate-800 underline"
                  >
                    Volver a validar
                  </button>
                )}
              </div>
            </div>
          )}

          {/* CONFIRMACIÓN DE COBRO COMPLETO CON COMPROBANTE ÚNICO EXACTO */}
          {!partialPayment && isPaymentValidated && (
            <div className="p-3 rounded-2xl bg-emerald-100/80 border border-emerald-300 text-[11px] text-emerald-900 font-semibold flex items-center gap-2.5 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Pago verificado con éxito, comprobante número #{referenceNumber.trim()} y monto confirmado de {formatCRC(amount || 0)}. El botón de "Confirmar pedido" está activado.
              </span>
            </div>
          )}

          {/* Alerta de Error de Validación */}
          {validationError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs space-y-1.5 animate-fadeIn">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="flex-1 font-bubble font-bold leading-relaxed">{validationError}</p>
              </div>

              {/* Botones de Asistencia para Pruebas Inmediatas */}
              {onSimulateBcrEmail && validationError.includes('No se encontró ninguna notificación') && (
                <div className="pt-1.5 border-t border-rose-200/80 space-y-1.5">
                  <span className="text-[10px] font-bold text-rose-800 block">
                    ¿Deseas simular la notificación bancaria del BCR para este comprobante?
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onSimulateBcrEmail('exact')}
                      className="px-2.5 py-1 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bubble font-bold text-[10px] shadow-xs active:scale-95 transition-all cursor-pointer"
                    >
                      ✓ Simular Correo Monto Exacto ({formatCRC(amount || 0)})
                    </button>
                    <button
                      type="button"
                      onClick={() => onSimulateBcrEmail('partial')}
                      className="px-2.5 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bubble font-bold text-[10px] shadow-xs active:scale-95 transition-all cursor-pointer"
                    >
                      ⚠️ Simular Correo Monto Incompleto ({formatCRC(Math.round((amount || 0) * 0.6))})
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
