import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCRC } from '../../utils/formatters';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const { isCartOpen, setIsCartOpen, cart, updateCartQuantity, removeFromCart } = useApp();

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const totalItems = cart.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center sm:justify-end p-3 sm:p-0 animate-fadeIn"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="relative w-full max-w-md bg-[#FDFBF9] sm:bg-white sm:h-full rounded-[32px] sm:rounded-none sm:rounded-l-[32px] shadow-2xl flex flex-col justify-between max-h-[92vh] sm:max-h-full border border-white/80 overflow-hidden animate-in zoom-in-95 sm:zoom-in-100 sm:slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del Carrito */}
        <div className="p-4 sm:p-5 border-b border-fio-200/80 flex items-center justify-between bg-fio-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-fio-800 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4 text-fio-pink" />
            </div>
            <div>
              <h2 className="font-bubble font-bold text-base sm:text-lg text-fio-900 leading-tight">
                Tu Carrito by.fio
              </h2>
              <p className="text-[11px] text-slate-500 font-sans">
                {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'} seleccionados
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-white text-slate-400 hover:text-slate-700 transition-colors shadow-2xs"
            title="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Ítems */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3.5">
          {cart.length === 0 ? (
            <div className="text-center py-12 sm:py-16 text-slate-400 space-y-3">
              <div className="w-16 h-16 rounded-full bg-purple-50 text-fio-400 flex items-center justify-center mx-auto shadow-inner">
                <ShoppingBag className="w-8 h-8 opacity-40 text-fio-700" />
              </div>
              <p className="font-bubble font-bold text-base text-slate-700">Tu carrito está vacío</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                ¡Explora nuestros talleres o productos de papelería artesanal!
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-fio-800 text-white text-xs font-semibold shadow-clayBtn hover:bg-fio-900 transition-all active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Explorar la Tienda</span>
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartId}
                className="flex gap-3 p-3 bg-white rounded-2xl border border-fio-200/70 shadow-xs hover:border-fio-300 transition-all"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#F2EDE7] border border-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-slate-800 truncate">
                      {item.name}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.cartId)}
                      className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                      title="Eliminar del carrito"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {item.customText && (
                    <p className="text-[11px] text-fio-pink font-semibold truncate mt-0.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 shrink-0" />
                      <span>"{item.customText}"</span>
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-2.5">
                    <span className="font-serif font-bold text-sm text-slate-900">
                      {formatCRC(item.price * item.quantity)}
                    </span>

                    {/* Control de Cantidad [-] 1 [+] */}
                    <div className="flex items-center gap-1 bg-[#F4EFEA] px-2 py-0.5 rounded-xl border border-slate-200/60 shadow-inner">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.cartId, item.quantity - 1)}
                        className="text-slate-500 hover:text-fio-800 p-1 active:scale-90"
                        title="Restar uno"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center select-none text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.cartId, item.quantity + 1)}
                        className="text-slate-500 hover:text-fio-800 p-1 active:scale-90"
                        title="Sumar uno"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer del Carrito con Botón de Seguir Comprando */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-fio-200/80 bg-white space-y-2.5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500 font-semibold">Subtotal estimado</span>
              <span className="font-serif font-bold text-xl text-slate-900">
                {formatCRC(subtotal)}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              El costo de envío o retiro por Correos de Costa Rica se calcula en el paso de pago.
            </p>

            {/* Botón Principal: Pago */}
            <button
              type="button"
              onClick={() => {
                setIsCartOpen(false);
                onOpenCheckout();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-semibold text-xs sm:text-sm shadow-clayBtn active:scale-95 transition-all"
            >
              <span>Proceder al Pago</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Botón Secundario Mandatorio: Volver a Seguir Comprando */}
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-[#F5F1EB] hover:bg-[#EFEAE2] text-slate-700 font-semibold text-xs border border-slate-200/70 shadow-xs active:scale-95 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>Volver a Seguir Comprando</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
