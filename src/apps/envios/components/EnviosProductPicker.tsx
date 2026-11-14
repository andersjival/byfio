import React from 'react';
import { EnviosTestProduct } from '../types';
import { TEST_PRODUCTS } from '../hooks/useUberDirectDispatch';
import { CheckCircle2, Package, Sparkles } from 'lucide-react';

interface EnviosProductPickerProps {
  selectedProduct: EnviosTestProduct;
  onSelectProduct: (product: EnviosTestProduct) => void;
}

export const EnviosProductPicker: React.FC<EnviosProductPickerProps> = ({
  selectedProduct,
  onSelectProduct,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
            1
          </span>
          <h3 className="font-bubble font-bold text-sm sm:text-base text-white">
            Selecciona un Producto de Prueba
          </h3>
        </div>
        <span className="text-[11px] text-purple-300 font-mono">
          2 artículos oficiales configurados
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {TEST_PRODUCTS.map((prod) => {
          const isSelected = selectedProduct.id === prod.id;
          return (
            <div
              key={prod.id}
              onClick={() => onSelectProduct(prod)}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-purple-900/70 to-slate-900 border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg'
                  : 'bg-white/5 border-white/10 hover:border-purple-400/50 hover:bg-white/10'
              }`}
            >
              <div className="flex gap-3">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-white/10 shrink-0"
                />
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    <Sparkles className="w-3 h-3 text-fio-yellow" />
                    <span>{prod.badge}</span>
                  </div>
                  <h4 className="font-bubble font-bold text-sm text-white leading-tight">
                    {prod.name}
                  </h4>
                  <p className="text-[11px] text-purple-200/80 line-clamp-2">
                    {prod.description}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-base font-bubble font-bold text-emerald-400">
                    ₡{prod.price.toLocaleString('es-CR')}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <span>Peso: {prod.weightKg} kg</span>
                    <span>•</span>
                    <span>{prod.dimensions.length}×{prod.dimensions.width}×{prod.dimensions.height} cm</span>
                  </div>
                </div>

                <button
                  type="button"
                  className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white/10 text-purple-200 hover:text-white'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Seleccionado</span>
                    </>
                  ) : (
                    <>
                      <Package className="w-3.5 h-3.5" />
                      <span>Elegir</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
