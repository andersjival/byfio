import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCRC } from '../../utils/formatters';
import { Check, ShoppingBag, X, CheckCircle2 } from 'lucide-react';

export const CartSuccessToast: React.FC = () => {
  const { cartToast, closeCartToast, setIsCartOpen, cart } = useApp();

  if (!cartToast) return null;

  const totalCartCount = cart.reduce((acc, it) => acc + it.quantity, 0);
  const totalCartPrice = cart.reduce((acc, it) => acc + it.price * it.quantity, 0);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100vw-1.5rem)] sm:w-auto max-w-lg pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="cart-toast-card relative bg-[#F1F2F6]/95 backdrop-blur-xl border border-white/90 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          {/* Thumbnail o Ícono de Check */}
          {cartToast.image ? (
            <div className="toast-thumb relative w-12 h-12 rounded-xl overflow-hidden bg-white shadow-neuInset shrink-0 border border-white/80">
              <img
                src={cartToast.image}
                alt={cartToast.productName}
                className="w-full h-full object-cover"
              />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>
          ) : (
            <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shrink-0">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
          )}

          {/* Información del Mensaje */}
          <div className="flex-1 min-w-0">
            <div className="toast-title flex items-center gap-1.5 text-emerald-700 font-bubble font-bold text-xs sm:text-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>¡Producto agregado con éxito!</span>
            </div>

            <p className="toast-product-name font-bubble font-bold text-xs sm:text-sm text-slate-800 line-clamp-1 mt-0.5">
              {cartToast.productName}{' '}
              {cartToast.quantity && cartToast.quantity > 1 ? (
                <span className="toast-subtitle text-slate-500 font-sans font-normal text-xs">
                  ({cartToast.quantity} un.)
                </span>
              ) : null}
            </p>

            {/* Actualización Reactiva de Productos y Montos en el Carrito */}
            <p className="toast-subtitle text-[11px] font-sans text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span>
                Carrito:{' '}
                <strong className="text-fio-800 font-bold">
                  {totalCartCount} {totalCartCount === 1 ? 'artículo' : 'artículos'}
                </strong>
              </span>
              <span>•</span>
              <strong className="text-slate-900 font-bold">
                {formatCRC(totalCartPrice)}
              </strong>
            </p>
          </div>

          {/* Acciones: Botón Ver Carrito y Botón Cerrar */}
          <div className="flex items-center gap-1.5 shrink-0 pl-1">
            <button
              type="button"
              onClick={() => {
                setIsCartOpen(true);
                closeCartToast();
              }}
              className="px-3 py-1.5 rounded-full neu-btn-cart text-white font-bubble text-xs font-bold flex items-center gap-1.5 shadow-neuBtn active:scale-95 transition-all"
              title="Abrir Carrito"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Ver Carrito</span>
            </button>

            <button
              type="button"
              onClick={closeCartToast}
              className="p-1 rounded-xl hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 transition-colors"
              title="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Línea de auto-descarte animada */}
        <div className="w-full bg-slate-200/50 h-1 rounded-full mt-2.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-fio-pink to-fio-500 rounded-full"
            style={{
              animation: 'shrinkWidth 3.2s linear forwards',
            }}
          />
        </div>
      </div>
    </div>
  );
};
