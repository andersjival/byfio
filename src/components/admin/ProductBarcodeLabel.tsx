import React from 'react';
import { Barcode128 } from '../common/Barcode128';
import { QRCodeSVG } from 'qrcode.react';
import { formatCRC } from '../../utils/formatters';

export type CodeLabelFormat = 'barcode' | 'qr';

interface ProductBarcodeLabelProps {
  product: {
    name: string;
    sku: string;
    shelfLocation?: string;
    price?: number;
    category?: string;
    supplier?: string;
    qrCode?: string;
  };
  codeFormat?: CodeLabelFormat;
  compact?: boolean;
  showPrice?: boolean;
  className?: string;
}

export const ProductBarcodeLabel: React.FC<ProductBarcodeLabelProps> = ({
  product,
  codeFormat = 'barcode',
  compact = false,
  showPrice = true,
  className = '',
}) => {
  const cleanSku = (product.sku || 'FIO-PRD-000').toUpperCase().trim();
  const cleanName = product.name || 'Producto by.fio';
  const cleanLocation = product.shelfLocation || 'Estante General';
  const cleanCategory = product.category || 'General';
  const cleanQrValue = (product.qrCode || product.sku || 'FIO-PRD-000').trim();

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
          <span className="text-[7.5px] text-slate-400 print:text-black">
            {codeFormat === 'qr' ? 'QR' : '128'}
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

      {codeFormat === 'qr' ? (
        /* FORMATO A: ETIQUETA DE CÓDIGO QR 2D */
        <div className="flex items-center gap-2 py-0.5 flex-1 min-h-0 text-left">
          <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
            <div>
              <h4 className="font-bubble font-bold text-[10px] sm:text-[11px] text-slate-900 print:text-black leading-tight line-clamp-2">
                {cleanName}
              </h4>
              <div className="mt-1 flex items-center gap-1">
                <span className="font-mono font-black text-slate-900 print:text-black bg-slate-100 print:bg-transparent px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] tracking-wider border border-slate-200 print:border-black/30">
                  {cleanSku}
                </span>
              </div>
            </div>
            {showPrice && typeof product.price === 'number' && product.price > 0 && (
              <span className="font-bubble font-black text-fio-800 print:text-black text-[10.5px] sm:text-xs block mt-1">
                {formatCRC(product.price)}
              </span>
            )}
          </div>

          <div className="shrink-0 p-1 bg-white rounded-lg border border-slate-300 print:border-black flex items-center justify-center">
            <QRCodeSVG
              value={cleanQrValue}
              size={compact ? 54 : 62}
              level="M"
              includeMargin={false}
            />
          </div>
        </div>
      ) : (
        /* FORMATO B: ETIQUETA DE CÓDIGO DE BARRAS CODE 128 (Barras gruesas de alta legibilidad, no alargadas) */
        <>
          {/* Nombre del Producto */}
          <div className="px-0.5 mb-0.5">
            <h4 className="font-bubble font-bold text-[10px] sm:text-[11px] text-slate-900 print:text-black leading-tight line-clamp-2">
              {cleanName}
            </h4>
          </div>

          {/* Código de Barras 128 (Barras gruesas, proporcionadas y con crispEdges) */}
          <div className="py-0.5 bg-white flex items-center justify-center overflow-hidden w-full">
            <Barcode128
              value={cleanSku}
              height={compact ? 42 : 48}
              moduleWidth={2.4}
              className="h-8.5 sm:h-9.5 w-auto max-w-[170px] sm:max-w-[185px] mx-auto"
            />
          </div>

          {/* SKU + Proveedor + Precio */}
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
        </>
      )}
    </div>
  );
};
