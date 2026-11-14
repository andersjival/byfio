import React, { useState } from 'react';
import {
  ArrowLeft,
  Truck,
  Store,
  Copy,
  Check,
  CreditCard,
  Navigation,
  Loader2,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatCRC } from '../../utils/formatters';
import { playBubblePopSound, playWaterDropSound } from '../../utils/soundEffects';

interface StarAgentCheckoutViewProps {
  items: Array<{ product: Product; quantity: number }>;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onOrderPlaced: (orderData: { orderNumber: string; customerName: string; total: number }) => void;
  onBack: () => void;
}

export const StarAgentCheckoutView: React.FC<StarAgentCheckoutViewProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onOrderPlaced,
  onBack,
}) => {
  const { currentUser, createOrder, addToCart } = useApp();

  const [deliveryMethod, setDeliveryMethod] = useState<'envio' | 'retiro'>('envio');
  const [customerName, setCustomerName] = useState(() => currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(() => (currentUser as any)?.phone || '');
  const [shippingAddress, setShippingAddress] = useState(() => currentUser?.address || '');
  const [sinpeRef, setSinpeRef] = useState('');
  const [copiedSinpe, setCopiedSinpe] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = items.reduce((acc, it) => acc + it.product.price * it.quantity, 0);
  const shippingFee = deliveryMethod === 'envio' ? 2500 : 0;
  const total = subtotal + shippingFee;

  const handleCopySinpe = () => {
    navigator.clipboard.writeText('64004640');
    setCopiedSinpe(true);
    playWaterDropSound();
    setTimeout(() => setCopiedSinpe(false), 2000);
  };

  const handleGpsLocation = () => {
    if (!navigator.geolocation) {
      setError('GPS no disponible en este dispositivo.');
      return;
    }
    setError(null);
    setIsGpsLoading(true);
    playWaterDropSound();

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(5));
        const lng = Number(pos.coords.longitude.toFixed(5));
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': 'es' } }
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const parts = [addr.road, addr.neighbourhood, addr.city || addr.town, addr.state].filter(Boolean);
            setShippingAddress(parts.length > 0 ? parts.join(', ') : `Ubicación GPS (${lat}, ${lng})`);
          } else {
            setShippingAddress(`Ubicación GPS (${lat}, ${lng})`);
          }
        } catch {
          setShippingAddress(`Ubicación GPS (${lat}, ${lng})`);
        }
        setIsGpsLoading(false);
        playBubblePopSound(0.3);
      },
      () => {
        setIsGpsLoading(false);
        setError('No pudimos detectar tu ubicación GPS. Por favor escribe tu dirección.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim()) {
      setError('Por favor indica tu nombre completo.');
      return;
    }
    if (!customerPhone.trim()) {
      setError('Por favor indica tu número de WhatsApp.');
      return;
    }
    if (deliveryMethod === 'envio' && !shippingAddress.trim()) {
      setError('Por favor ingresa tu dirección de entrega.');
      return;
    }
    if (items.length === 0) {
      setError('No hay productos en el pedido.');
      return;
    }

    setIsSubmitting(true);
    playBubblePopSound(0.4);

    try {
      // Sincronizar ítems al carrito global si no están
      items.forEach((it) => {
        addToCart({
          type: 'product',
          id: it.product.id,
          sku: it.product.sku,
          name: it.product.name,
          price: it.product.price,
          quantity: it.quantity,
          image: it.product.image,
          images: it.product.images,
          shelfLocation: it.product.shelfLocation,
        });
      });

      const newOrder = createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryMethod,
        shippingAddress: deliveryMethod === 'envio' ? shippingAddress.trim() : 'Retiro en Tienda Tibás',
        paymentMethod: 'sinpe',
        notes: `Pedido por Chat con Estrellita. Ref SINPE: ${sinpeRef.trim() || 'Pendiente'}`,
      });

      playWaterDropSound();
      onOrderPlaced({
        orderNumber: newOrder.orderNumber || '#FIO-CHAT',
        customerName: customerName.trim(),
        total,
      });
    } catch (err: any) {
      setError(err?.message || 'Error al registrar pedido. Intenta nuevamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#130f20] overflow-hidden">
      {/* Sub-header de Checkout */}
      <div className="px-4 py-2.5 bg-white dark:bg-[#1a142a] border-b border-fio-100 dark:border-purple-800/40 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bubble font-bold text-slate-600 dark:text-purple-200 hover:text-fio-pink transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Chat</span>
        </button>
        <span className="text-[11px] font-bold text-fio-pink dark:text-pink-300">
          {items.length} {items.length === 1 ? 'producto' : 'productos'}
        </span>
      </div>

      {/* Formulario con Scroll */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 space-y-3 mobile-no-scrollbar sm:fuchsia-pastel-scrollbar">
        {error && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-in fade-in">
            {error}
          </div>
        )}

        {/* 1. Lista de Productos a Pagar */}
        <div className="p-3 rounded-2xl bg-white dark:bg-[#1f1635] border border-fio-200/80 dark:border-purple-800/40 shadow-xs space-y-2.5">
          <h5 className="font-bubble font-black text-xs text-slate-800 dark:text-purple-100 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-fio-pink" />
            <span>Productos en tu Pedido</span>
          </h5>

          <div className="space-y-2">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="p-2 rounded-xl bg-slate-50 dark:bg-purple-950/40 border border-slate-100 dark:border-purple-900/40 flex items-center gap-2.5"
              >
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&q=80'}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover border border-fio-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h6 className="font-bubble font-bold text-xs text-slate-800 dark:text-purple-100 truncate">
                    {product.name}
                  </h6>
                  <p className="text-[11px] font-black text-fio-pink">
                    {formatCRC(product.price)} c/u
                  </p>
                </div>
                <div className="flex items-center border border-slate-200 dark:border-purple-800 rounded-lg overflow-hidden bg-white dark:bg-purple-900/50">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(product.id, Math.max(1, quantity - 1))}
                    className="px-2 py-0.5 text-xs font-bold hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="px-2 text-xs font-bold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                    className="px-2 py-0.5 text-xs font-bold hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveItem(product.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 2. Método de Entrega */}
        <div className="p-3 rounded-2xl bg-white dark:bg-[#1f1635] border border-fio-200/80 dark:border-purple-800/40 shadow-xs space-y-2">
          <label className="block text-[11px] font-bold text-slate-700 dark:text-purple-200">
            Forma de Entrega
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                playWaterDropSound();
                setDeliveryMethod('envio');
              }}
              className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                deliveryMethod === 'envio'
                  ? 'border-fio-pink bg-pink-50/70 dark:bg-pink-950/40 dark:border-pink-500 font-bold'
                  : 'border-slate-200 dark:border-purple-800/40 bg-slate-50 dark:bg-purple-950/20 text-slate-600 dark:text-purple-300'
              }`}
            >
              <Truck className="w-4 h-4 text-fio-pink shrink-0" />
              <div>
                <p className="text-xs leading-tight">Envío a Casa</p>
                <p className="text-[10px] text-fio-pink font-semibold">+₡2.500</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                playWaterDropSound();
                setDeliveryMethod('retiro');
              }}
              className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                deliveryMethod === 'retiro'
                  ? 'border-fio-pink bg-pink-50/70 dark:bg-pink-950/40 dark:border-pink-500 font-bold'
                  : 'border-slate-200 dark:border-purple-800/40 bg-slate-50 dark:bg-purple-950/20 text-slate-600 dark:text-purple-300'
              }`}
            >
              <Store className="w-4 h-4 text-fio-pink shrink-0" />
              <div>
                <p className="text-xs leading-tight">Retiro en Tibás</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Gratis</p>
              </div>
            </button>
          </div>
        </div>

        {/* 3. Datos del Cliente */}
        <div className="p-3 rounded-2xl bg-white dark:bg-[#1f1635] border border-fio-200/80 dark:border-purple-800/40 shadow-xs space-y-2.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-purple-200 mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ej. Fiorella Jara"
              required
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-purple-950/40 border border-slate-200 dark:border-purple-800/40 text-xs text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-fio-pink/50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-purple-200 mb-1">
              WhatsApp / Teléfono
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Ej. 8888-8888"
              required
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-purple-950/40 border border-slate-200 dark:border-purple-800/40 text-xs text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-fio-pink/50"
            />
          </div>

          {deliveryMethod === 'envio' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-purple-200">
                  Dirección Exacta
                </label>
                <button
                  type="button"
                  onClick={handleGpsLocation}
                  disabled={isGpsLoading}
                  className="text-[10px] font-bold text-fio-pink hover:underline inline-flex items-center gap-1"
                >
                  {isGpsLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Navigation className="w-3 h-3" />
                  )}
                  <span>Usar GPS</span>
                </button>
              </div>
              <input
                type="text"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Provincia, cantón, señas exactas..."
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-purple-950/40 border border-slate-200 dark:border-purple-800/40 text-xs text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-fio-pink/50"
              />
            </div>
          )}
        </div>

        {/* 4. Pago SINPE Móvil */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-50/80 to-purple-50/80 dark:from-purple-950/50 dark:to-pink-950/30 border border-fio-200/80 dark:border-purple-700/40 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bubble font-black text-xs text-fio-900 dark:text-purple-100 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-fio-pink" />
              <span>SINPE Móvil Oficial</span>
            </span>
            <button
              type="button"
              onClick={handleCopySinpe}
              className="text-[11px] font-bold text-fio-pink hover:underline flex items-center gap-1 bg-white/80 dark:bg-purple-900/60 px-2 py-0.5 rounded-lg border border-fio-200/50 shadow-xs"
            >
              {copiedSinpe ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSinpe ? '¡Copiado!' : 'Copiar 64004640'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-purple-200 leading-tight">
            Transfiere <strong>{formatCRC(total)}</strong> al <strong>6400-4640</strong> a nombre de <em>by.fio</em>.
          </p>

          <input
            type="text"
            value={sinpeRef}
            onChange={(e) => setSinpeRef(e.target.value)}
            placeholder="Número de comprobante / Referencia SINPE"
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-purple-950/70 border border-fio-200 dark:border-purple-800/40 text-xs text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-fio-pink/50"
          />
        </div>

        {/* 5. Resumen Total y Botón */}
        <div className="p-3 rounded-2xl bg-white dark:bg-[#1f1635] border border-fio-200/80 dark:border-purple-800/40 shadow-xs space-y-2">
          <div className="flex justify-between text-xs text-slate-600 dark:text-purple-300">
            <span>Subtotal:</span>
            <span className="font-bold">{formatCRC(subtotal)}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-600 dark:text-purple-300">
            <span>Envío:</span>
            <span className="font-bold">{shippingFee === 0 ? 'Gratis' : formatCRC(shippingFee)}</span>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-purple-900/40 flex justify-between items-baseline">
            <span className="font-bubble font-bold text-xs text-slate-800 dark:text-purple-100">
              Total a Pagar:
            </span>
            <span className="font-bubble font-black text-base text-fio-pink dark:text-pink-400">
              {formatCRC(total)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-700 via-fio-pink to-purple-800 hover:opacity-95 text-white font-bubble font-bold text-sm shadow-clayBtn transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Registrando Pedido...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Confirmar Pedido ({formatCRC(total)}) ✨</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
