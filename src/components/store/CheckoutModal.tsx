import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCRC } from '../../utils/formatters';
import { X, CheckCircle, Truck, Store, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, createOrder, setViewMode } = useApp();

  const [deliveryMethod, setDeliveryMethod] = useState<'envio' | 'retiro'>('envio');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmedOrderNum, setConfirmedOrderNum] = useState<string | null>(null);

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
      shippingAddress: deliveryMethod === 'envio' ? shippingAddress : 'Retiro en taller by.fio',
      paymentMethod: 'sinpe',
      notes,
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#EC4899', '#C084FC', '#38BDF8', '#FACC15'],
    });

    setConfirmedOrderNum(order.orderNumber);
  };

  const handleFinishAndGoToAdmin = () => {
    setConfirmedOrderNum(null);
    onClose();
    setViewMode('admin'); // Directly switch to Admin to see the new order in FIFO queue!
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-clayLg border-2 border-fio-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-fio-200 flex items-center justify-between bg-fio-100/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-fio-pink fill-fio-pink" />
            <h3 className="font-bubble font-bold text-lg text-fio-900">
              {confirmedOrderNum ? '¡Pedido Confirmado!' : 'Checkout & Pago SINPE'}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedOrderNum ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h4 className="font-bubble font-bold text-2xl text-fio-900 mb-1">¡Gracias por tu compra!</h4>
            <p className="text-xs text-gray-500 mb-3">Tu orden fue inyectada al sistema de alisto:</p>
            <div className="inline-block px-4 py-2 bg-fio-100 rounded-2xl border border-fio-300 font-mono font-bold text-lg text-fio-800 mb-4">
              {confirmedOrderNum}
            </div>
            <p className="text-xs text-gray-600 mb-6 max-w-sm mx-auto">
              Realizá el SINPE Móvil al <strong>6400-4640</strong> a nombre de Fiorella con tu número de orden en el detalle.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleFinishAndGoToAdmin}
                className="px-5 py-3 rounded-2xl bg-fio-800 text-white font-bubble font-semibold text-xs shadow-clayBtn hover:bg-fio-900"
              >
                Ver en Panel Admin (Cola de Alisto) 🚀
              </button>
              <button
                onClick={() => {
                  setConfirmedOrderNum(null);
                  onClose();
                }}
                className="px-5 py-3 rounded-2xl bg-fio-100 text-fio-800 font-bubble font-semibold text-xs hover:bg-fio-200"
              >
                Seguir Comprando
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
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

            {/* Cuadro SINPE Móvil */}
            <div className="p-3 bg-fio-50 rounded-2xl border border-fio-200 text-xs">
              <p className="font-bold text-fio-800 mb-1">📲 Datos para SINPE Móvil:</p>
              <p className="text-gray-700">Número: <strong className="text-fio-pink">6400-4640</strong></p>
              <p className="text-gray-500 text-[11px]">A nombre de: Fiorella (by.fio)</p>
            </div>

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
