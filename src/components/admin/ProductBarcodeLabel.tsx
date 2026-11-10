import React from 'react';
import { Product } from '../../types';
import { Barcode128 } from '../common/Barcode128';
import { formatCRC } from '../../utils/formatters';
import { MapPin, Tag } from 'lucide-react';

interface ProductBarcodeLabelProps {
  product: {
    name: string;
    sku: string;
    shelfLocation?: string;
    price?: number;
    category?: string;
  };
  compact?: boolean;
  showPrice?: boolean;
  className?: string;
}

export const ProductBarcodeLabel: React.FC<ProductBarcodeLabelProps> = ({
  product,
  compact = false,
  showPrice = true,
  className = '',
}) => {
  const cleanSku = (product.sku || 'FIO-PRD-000').toUpperCase().trim();
  const cleanName = product.name || 'Producto by.fio';
  const cleanLocation = product.shelfLocation || 'Estante General';

  return (
    <div
      className={`bg-white rounded-xl border-2 border-dashed border-slate-300 p-3 flex flex-col justify-between text-center relative print:border-black print:rounded-none print:shadow-none break-inside-avoid ${className}`}
      style={{ minWidth: compact ? '180px' : '220px' }}
    >
      {/* 1. Nombre del Producto (Arriba) */}
      <div className="mb-1.5 px-1">
        <div className="flex items-center justify-between text-[9px] uppercase font-bold text-slate-400 print:text-black mb-0.5">
          <span className="truncate">by.fio estudio</span>
          {cleanLocation && (
            <span className="truncate font-semibold text-fio-purple print:text-black">
              📍 {cleanLocation.split('(')[0].trim()}
            </span>
          )}
        </div>
        <h4 className="font-bubble font-bold text-xs sm:text-sm text-slate-900 print:text-black leading-tight line-clamp-2">
          {cleanName}
        </h4>
      </div>

      {/* 2. Código en Código de Barras (Centro) */}
      <div className="px-2 py-1 bg-white flex items-center justify-center">
        <Barcode128
          value={cleanSku}
          height={compact ? 40 : 46}
          moduleWidth={2}
          className="w-full max-h-12"
        />
      </div>

      {/* 3. Código SKU Interno Abajo del Código de Barras */}
      <div className="mt-1 pt-1 border-t border-slate-100 print:border-black/30 flex items-center justify-between px-1">
        <span className="font-mono font-black text-xs sm:text-sm tracking-wider text-slate-900 print:text-black bg-slate-100 print:bg-transparent px-2 py-0.5 rounded">
          {cleanSku}
        </span>

        {showPrice && typeof product.price === 'number' && product.price > 0 && (
          <span className="font-bubble font-black text-xs sm:text-sm text-fio-800 print:text-black">
            {formatCRC(product.price)}
          </span>
        )}
      </div>
    </div>
  );
};
