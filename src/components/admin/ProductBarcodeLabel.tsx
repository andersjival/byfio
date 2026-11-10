import React from 'react';
import { Barcode128 } from '../common/Barcode128';
import { formatCRC } from '../../utils/formatters';

interface ProductBarcodeLabelProps {
  product: {
    name: string;
    sku: string;
    shelfLocation?: string;
    price?: number;
    category?: string;
    supplier?: string;
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
  const cleanCategory = product.category || 'General';

  return (
    <div
      className={`bg-white rounded-xl border border-dashed border-slate-300 p-2 sm:p-2.5 flex flex-col justify-between text-center relative print:border-black print:rounded-none print:shadow-none break-inside-avoid print:p-1.5 ${className}`}
      style={{
        boxSizing: 'border-box',
        pageBreakInside: 'avoid',
      }}
    >
      {/* 1. Encabezado de Etiqueta: Logo ByFio + Categoría & Estante */}
      <div className="flex items-center justify-between text-[8px] sm:text-[9px] uppercase font-bold text-slate-500 print:text-black border-b border-slate-100 print:border-black/30 pb-0.5 mb-1 gap-1">
        <div className="flex items-center gap-1 shrink-0">
          <span className="font-bubble text-fio-pink print:text-black text-[9px] sm:text-[10px]">
            by.fio★
          </span>
        </div>

        <div className="flex items-center gap-1 truncate text-right">
          <span className="text-[8px] sm:text-[8.5px] px-1 py-0.2 bg-purple-50 print:bg-transparent text-purple-700 print:text-black rounded truncate font-medium max-w-[90px] sm:max-w-[110px]">
            {cleanCategory}
          </span>
          {cleanLocation && (
            <span className="font-semibold text-slate-600 print:text-black truncate max-w-[70px] sm:max-w-[85px]">
              📍 {cleanLocation.split('(')[0].trim()}
            </span>
          )}
        </div>
      </div>

      {/* 2. Nombre del Producto (Arriba del Código de Barras) */}
      <div className="px-0.5 mb-1">
        <h4 className="font-bubble font-bold text-[10px] sm:text-[11px] text-slate-900 print:text-black leading-tight line-clamp-2">
          {cleanName}
        </h4>
      </div>

      {/* 3. Código de Barras 128 (Centro) */}
      <div className="py-0.5 bg-white flex items-center justify-center overflow-hidden">
        <Barcode128
          value={cleanSku}
          height={compact ? 28 : 32}
          moduleWidth={1.8}
          className="w-full max-h-8 sm:max-h-9"
        />
      </div>

      {/* 4. SKU + Proveedor (si existe) + Precio Abajo */}
      <div className="mt-0.5 pt-0.5 border-t border-slate-100 print:border-black/30 flex items-center justify-between px-0.5 text-[9px] sm:text-[10px]">
        <span className="font-mono font-black text-slate-900 print:text-black bg-slate-100 print:bg-transparent px-1.5 py-0.2 rounded tracking-wider">
          {cleanSku}
        </span>

        {product.supplier && (
          <span className="text-[7.5px] text-slate-400 print:text-black truncate max-w-[60px] hidden sm:inline">
            {product.supplier}
          </span>
        )}

        {showPrice && typeof product.price === 'number' && product.price > 0 && (
          <span className="font-bubble font-black text-fio-800 print:text-black text-[10px] sm:text-[11px]">
            {formatCRC(product.price)}
          </span>
        )}
      </div>
    </div>
  );
};
