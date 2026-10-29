import React, { useState } from 'react';
import { Copy, Check, Smartphone, Building2, MessageCircle, ShieldCheck } from 'lucide-react';
import { formatCRC } from '../../utils/formatters';

interface PaymentAccountsCardProps {
  amount?: number;
  orderNumber?: string;
  compact?: boolean;
}

export const PaymentAccountsCard: React.FC<PaymentAccountsCardProps> = ({
  amount,
  orderNumber,
  compact = false,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2500);
    });
  };

  return (
    <div className={`rounded-3xl bg-[#F1F2F6] border border-white/90 shadow-neuCard text-slate-800 space-y-4 transition-all ${compact ? 'p-4' : 'p-5 sm:p-6'}`}>
      {/* Encabezado */}
      <div className="flex items-center justify-between border-b border-slate-300/40 pb-3">
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

      {/* BLOQUE 1: SINPE MÓVIL */}
      <div className="p-4 rounded-2xl bg-[#ECEEF2] border border-white/70 shadow-neuInset space-y-2">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs font-bubble font-bold text-slate-800">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            Sinpe Móvil
          </span>
          <button
            type="button"
            onClick={() => copyToClipboard('64004640', 'sinpe')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl neu-btn text-[11px] font-bubble font-bold text-emerald-800 active:scale-95 transition-all"
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

      {/* BLOQUE 2: TRANSFERENCIA BANCARIA BCR (BANCO DE COSTA RICA) */}
      <div className="p-4 rounded-2xl bg-[#F1F2F6] border border-white/80 shadow-neuCard space-y-3">
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
            className="neu-btn px-2.5 py-1 rounded-xl text-[10px] font-bubble font-bold text-slate-700 active:scale-95 transition-all shrink-0 flex items-center gap-1"
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
            className="neu-btn px-2.5 py-1 rounded-xl text-[10px] font-bubble font-bold text-slate-700 active:scale-95 transition-all shrink-0 flex items-center gap-1"
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

      {/* Pie con Envío de Comprobante por WhatsApp */}
      <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <p className="text-[11px] text-slate-500 text-center sm:text-left">
          📸 Al transferir, enviá tu comprobante para confirmar y procesar tu pedido.
        </p>

        <a
          href="https://wa.me/50664004640?text=Hola%20Fio!%20Te%20adjunto%20mi%20comprobante%20de%20pago"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bubble font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-neuBtn active:scale-95 transition-all shrink-0"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Enviar Comprobante</span>
        </a>
      </div>
    </div>
  );
};
