import React, { useState } from 'react';
import { EnviosCustomerForm, EnviosTestProduct } from '../types';
import { MapPin, CreditCard, CheckCircle2, Truck, ArrowRight, ShieldCheck } from 'lucide-react';

interface EnviosCheckoutFormProps {
  product: EnviosTestProduct;
  customer: EnviosCustomerForm;
  quoteFee: number;
  etaMinutes: number;
  onChangeCustomer: (updated: EnviosCustomerForm) => void;
  onConfirmPaymentAndDispatch: () => void;
}

export const EnviosCheckoutForm: React.FC<EnviosCheckoutFormProps> = ({
  product,
  customer,
  quoteFee,
  etaMinutes,
  onChangeCustomer,
  onConfirmPaymentAndDispatch,
}) => {
  const [payMethod, setPayMethod] = useState<'simulated' | 'sinpe' | 'card'>('simulated');
  const [isProcessing, setIsProcessing] = useState(false);
  const total = product.price + quoteFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmPaymentAndDispatch();
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 2. Dirección de Entrega */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
            2
          </span>
          <h3 className="font-bubble font-bold text-sm sm:text-base text-white">
            Dirección de Entrega (Destino Uber Direct)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-slate-300 block mb-1">Nombre Completo del Cliente</label>
            <input
              type="text"
              value={customer.fullName}
              onChange={(e) => onChangeCustomer({ ...customer, fullName: e.target.value })}
              className="w-full px-3 py-2 bg-black/60 border border-purple-500/30 rounded-xl text-white"
              required
            />
          </div>
          <div>
            <label className="text-slate-300 block mb-1">Teléfono (para SMS/Uber)</label>
            <input
              type="text"
              value={customer.phone}
              onChange={(e) => onChangeCustomer({ ...customer, phone: e.target.value })}
              className="w-full px-3 py-2 bg-black/60 border border-purple-500/30 rounded-xl text-white font-mono"
              required
            />
          </div>
          <div>
            <label className="text-slate-300 block mb-1">Provincia</label>
            <select
              value={customer.province}
              onChange={(e) => onChangeCustomer({ ...customer, province: e.target.value })}
              className="w-full px-3 py-2 bg-black/80 border border-purple-500/30 rounded-xl text-white"
            >
              <option value="San José">San José</option>
              <option value="Heredia">Heredia</option>
              <option value="Alajuela">Alajuela</option>
              <option value="Cartago">Cartago</option>
            </select>
          </div>
          <div>
            <label className="text-slate-300 block mb-1">Cantón y Distrito</label>
            <input
              type="text"
              value={`${customer.canton}, ${customer.district}`}
              onChange={(e) => {
                const parts = e.target.value.split(',');
                onChangeCustomer({ ...customer, canton: parts[0]?.trim() || '', district: parts[1]?.trim() || '' });
              }}
              className="w-full px-3 py-2 bg-black/60 border border-purple-500/30 rounded-xl text-white"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-slate-300 block mb-1">Señas Exactas de Entrega</label>
            <input
              type="text"
              value={customer.addressDetails}
              onChange={(e) => onChangeCustomer({ ...customer, addressDetails: e.target.value })}
              className="w-full px-3 py-2 bg-black/60 border border-purple-500/30 rounded-xl text-white"
              required
            />
          </div>
        </div>
      </div>

      {/* 3. Método de Pago & Desglose */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-xs">
            3
          </span>
          <h3 className="font-bubble font-bold text-sm sm:text-base text-white">
            Método de Pago de Prueba
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setPayMethod('simulated')}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              payMethod === 'simulated'
                ? 'bg-emerald-600 border-emerald-400 text-white font-bold'
                : 'bg-black/40 border-white/10 text-slate-400'
            }`}
          >
            Aprobación Instantánea
          </button>
          <button
            type="button"
            onClick={() => setPayMethod('sinpe')}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              payMethod === 'sinpe'
                ? 'bg-purple-600 border-purple-400 text-white font-bold'
                : 'bg-black/40 border-white/10 text-slate-400'
            }`}
          >
            SINPE Móvil Test
          </button>
          <button
            type="button"
            onClick={() => setPayMethod('card')}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              payMethod === 'card'
                ? 'bg-pink-600 border-pink-400 text-white font-bold'
                : 'bg-black/40 border-white/10 text-slate-400'
            }`}
          >
            Tarjeta Test
          </button>
        </div>

        <div className="p-3 bg-black/40 rounded-xl space-y-1.5 text-xs border border-white/5">
          <div className="flex justify-between text-slate-300">
            <span>Artículo ({product.name}):</span>
            <span className="font-mono">₡{product.price.toLocaleString('es-CR')}</span>
          </div>
          <div className="flex justify-between text-emerald-300">
            <span>Tarifa Uber Direct ({etaMinutes} min estimados):</span>
            <span className="font-mono">+₡{quoteFee.toLocaleString('es-CR')}</span>
          </div>
          <div className="pt-2 border-t border-white/10 flex justify-between font-bubble font-bold text-sm text-white">
            <span>Total a Confirmar:</span>
            <span className="text-emerald-400">₡{total.toLocaleString('es-CR')}</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bubble font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl active:scale-98 transition-all cursor-pointer"
      >
        <ShieldCheck className="w-5 h-5 text-fio-yellow" />
        <span>{isProcessing ? 'Confirmando Pago...' : 'Confirmar Pago & Solicitar Uber Direct'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
};
