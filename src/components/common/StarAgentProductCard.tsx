import React from 'react';
import { ShoppingBag, Sparkles, CreditCard, Plus, Check } from 'lucide-react';
import { Product } from '../../types';
import { formatCRC } from '../../utils/formatters';

interface StarAgentProductCardProps {
  product: Product;
  actionType: 'pay_or_more' | 'add_second';
  onPay: (product: Product) => void;
  onWantAnother: (product: Product) => void;
  onAddSecond: (product: Product) => void;
  isAdded?: boolean;
}

export const StarAgentProductCard: React.FC<StarAgentProductCardProps> = ({
  product,
  actionType,
  onPay,
  onWantAnother,
  onAddSecond,
  isAdded = false,
}) => {
  return (
    <div className="mt-3 p-3 rounded-2xl bg-gradient-to-br from-fio-50/90 via-white to-purple-50/90 dark:from-[#251b3d] dark:via-[#1e1533] dark:to-[#2b1e45] border-2 border-fio-200/90 dark:border-purple-600/50 shadow-md flex flex-col gap-2.5 animate-in fade-in zoom-in-95 duration-200">
      {/* Detalle Producto: Foto + Datos */}
      <div className="flex items-center gap-3">
        <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-fio-200 dark:border-purple-700/60 shadow-xs bg-white dark:bg-purple-950 shrink-0">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-pink-100 text-fio-pink dark:bg-pink-950/70 dark:text-pink-300">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Disponible</span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-purple-300 font-semibold truncate">
              {product.category || 'Tienda by.fio'}
            </span>
          </div>

          <h4 className="font-bubble font-black text-xs sm:text-sm text-slate-900 dark:text-purple-100 leading-tight line-clamp-2">
            {product.name}
          </h4>

          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-black text-sm sm:text-base text-fio-pink dark:text-pink-400">
              {formatCRC(product.price)}
            </span>
            {product.stock > 0 && (
              <span className="text-[10px] text-slate-500 dark:text-purple-300">
                ({product.stock} en stock)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Acciones interactivas */}
      {actionType === 'pay_or_more' ? (
        <div className="pt-2 border-t border-fio-100 dark:border-purple-800/40 space-y-2">
          <p className="text-[11px] font-bold text-slate-700 dark:text-purple-200 text-center leading-snug">
            ¿Deseas pagar este producto ahora o te gustaría comprar algo más? ✨
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onPay(product)}
              className="py-2 px-3 rounded-xl bg-gradient-to-r from-purple-700 to-fio-pink hover:opacity-95 text-white font-bubble font-bold text-xs shadow-clayBtn transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Pagar ahora</span>
            </button>
            <button
              type="button"
              onClick={() => onWantAnother(product)}
              className="py-2 px-3 rounded-xl bg-white dark:bg-purple-900/60 border-2 border-fio-300 dark:border-purple-600/70 text-fio-900 dark:text-purple-200 font-bubble font-bold text-xs hover:bg-fio-50 dark:hover:bg-purple-800/70 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-fio-pink" />
              <span>Comprar otro</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-2 border-t border-fio-100 dark:border-purple-800/40">
          <button
            type="button"
            disabled={isAdded}
            onClick={() => onAddSecond(product)}
            className={`w-full py-2.5 px-3 rounded-xl font-bubble font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:opacity-95 text-white shadow-clayBtn'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Agregado! Abriendo carrito...</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Agregar</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
