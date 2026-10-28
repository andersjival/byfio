import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCRC } from '../../utils/formatters';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const { isCartOpen, setIsCartOpen, cart, updateCartQuantity, removeFromCart } = useApp();

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((acc, it) => acc + it.price * it.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header del Carrito */}
          <div className="p-5 border-b border-fio-200 flex items-center justify-between bg-fio-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-fio-800" />
              <h2 className="font-bubble font-bold text-lg text-fio-900">Tu Carrito by.fio</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-white text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de Ítems */}
          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-fio-600" />
                <p className="font-bubble text-base text-gray-600">Tu carrito está vacío</p>
                <p className="text-xs text-gray-400 mt-1">¡Explora nuestros talleres o productos!</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartId}
                  className="flex gap-3 p-3 bg-fio-50/50 rounded-2xl border border-fio-200/80 shadow-claySm"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bubble font-bold text-xs text-fio-900 truncate">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.customText && (
                      <p className="text-[11px] text-fio-pink font-semibold truncate mt-0.5">
                        ✨ Personalizado: "{item.customText}"
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bubble font-bold text-xs text-fio-800">
                        {formatCRC(item.price)}
                      </span>

                      {/* Control de Cantidad */}
                      <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-fio-200 shadow-sm">
                        <button
                          onClick={() => updateCartQuantity(item.cartId, item.quantity - 1)}
                          className="text-gray-500 hover:text-fio-800"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.cartId, item.quantity + 1)}
                          className="text-gray-500 hover:text-fio-800"
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

          {/* Footer del Carrito */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-fio-200 bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 font-semibold">Subtotal</span>
                <span className="font-bubble font-bold text-lg text-fio-900">
                  {formatCRC(subtotal)}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mb-4">
                El envío o retiro se selecciona en el checkout.
              </p>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onOpenCheckout();
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-semibold text-sm shadow-clayBtn active:scale-95 transition-all"
              >
                <span>Proceder al Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
