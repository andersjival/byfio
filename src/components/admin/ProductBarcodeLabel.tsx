import React from 'react';
import { Barcode128 } from '../common/Barcode128';
import { QRCodeSVG } from 'qrcode.react';
import { formatCRC, formatInternalProductCode } from '../../utils/formatters';

export type CodeLabelFormat = 'barcode' | 'qr';

/**
 * Emblema oficial en círculo lila con el nombre 'byfio' en blanco, corazón y estrella en pequeñito
 */
export const EMBLEM_SVG_DATA_URI =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48"><circle cx="24" cy="24" r="23" fill="#FFFFFF"/><circle cx="24" cy="24" r="21" fill="#C084FC" stroke="#A855F7" stroke-width="1.2"/><g transform="translate(24, 15)"><path d="M-4.5 -3.5 C-4.5 -5.5 -2 -5.5 -1 -4 C0 -5.5 2.5 -5.5 2.5 -3.5 C2.5 -1.5 -1 0.5 -1 0.5 C-1 0.5 -4.5 -1.5 -4.5 -3.5 Z" fill="#EC4899"/><path d="M4 -5.5 L4.7 -3.5 L6.8 -3.5 L5.1 -2.2 L5.7 -0.2 L4 -1.4 L2.3 -0.2 L2.9 -2.2 L1.2 -3.5 L3.3 -3.5 Z" fill="#FACC15" stroke="#CA8A04" stroke-width="0.4"/></g><text x="24" y="32.5" text-anchor="middle" fill="#FFFFFF" stroke="#7E22CE" stroke-width="0.7" paint-order="stroke" font-family="'Bubblegum Sans', -apple-system, sans-serif" font-size="11.5" font-weight="900" letter-spacing="-0.2">byfio</text></svg>`
  );

export const ByFioQrCenterEmblem: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className="rounded-full select-none"
    style={{ display: 'block' }}
  >
    <circle cx="24" cy="24" r="23" fill="#FFFFFF" />
    <circle cx="24" cy="24" r="21" fill="#C084FC" stroke="#A855F7" strokeWidth="1.2" />
    <g transform="translate(24, 15)">
      <path
        d="M-4.5 -3.5 C-4.5 -5.5 -2 -5.5 -1 -4 C0 -5.5 2.5 -5.5 2.5 -3.5 C2.5 -1.5 -1 0.5 -1 0.5 C-1 0.5 -4.5 -1.5 -4.5 -3.5 Z"
        fill="#EC4899"
      />
      <path
        d="M4 -5.5 L4.7 -3.5 L6.8 -3.5 L5.1 -2.2 L5.7 -0.2 L4 -1.4 L2.3 -0.2 L2.9 -2.2 L1.2 -3.5 L3.3 -3.5 Z"
        fill="#FACC15"
        stroke="#CA8A04"
        strokeWidth="0.4"
      />
    </g>
    <text
      x="24"
      y="32.5"
      textAnchor="middle"
      fill="#FFFFFF"
      stroke="#7E22CE"
      strokeWidth="0.7"
      paintOrder="stroke"
      style={{
        fontFamily: "'Bubblegum Sans', 'Comfortaa', system-ui, sans-serif",
        fontSize: '11.5px',
        fontWeight: 900,
        letterSpacing: '-0.2px',
      }}
    >
      byfio
    </text>
  </svg>
);

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
  const cleanSku = formatInternalProductCode(product.sku, 'bf-PRD-000');
  const cleanName = product.name || 'Producto by.fio';
  const cleanLocation = product.shelfLocation || 'Estante General';
  const cleanCategory = product.category || 'General';
  const cleanQrValue = formatInternalProductCode(product.qrCode || product.sku, 'bf-PRD-000');

  return (
    <div
      className={`bg-white rounded-xl border border-dashed border-slate-300 p-2 sm:p-2.5 flex flex-col justify-between text-center relative print:border-black print:rounded-none print:shadow-none break-inside-avoid print:p-1 ${className}`}
      style={{
        boxSizing: 'border-box',
        pageBreakInside: 'avoid',
      }}
    >
      {codeFormat === 'qr' ? (
        /* FORMATO A: ETIQUETA QR OFICIAL (QR ampliado con Círculo Lila ByFio en letras blancas y Descripción/Ubicación) */
        <div className="flex items-center gap-2 h-full w-full py-0.5 text-left">
          {/* LADO 1: CÓDIGO QR GRANDE + CÓDIGO DEL PRODUCTO ABAJO */}
          <div className="w-[42%] shrink-0 flex flex-col items-center justify-center">
            <div className="relative p-0.5 bg-white rounded-xl border border-slate-300 print:border-black flex items-center justify-center shadow-2xs">
              <QRCodeSVG
                value={cleanQrValue}
                size={compact ? 76 : 94}
                level="H"
                includeMargin={false}
                className="max-w-full h-auto"
                imageSettings={{
                  src: EMBLEM_SVG_DATA_URI,
                  width: compact ? 24 : 30,
                  height: compact ? 24 : 30,
                  excavate: true,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <ByFioQrCenterEmblem size={compact ? 24 : 30} />
              </div>
            </div>
            {/* Código del producto abajo del QR sin la palabra Código */}
            <span className="font-mono font-black text-slate-900 print:text-black bg-slate-100 print:bg-transparent px-1.5 py-0.2 rounded tracking-wider text-[8px] sm:text-[9px] text-center mt-1 border border-slate-200 print:border-none max-w-full truncate">
              {cleanSku}
            </span>
          </div>

          {/* LADO 2: DESCRIPCIÓN (MISMO TAMAÑO QUE BARRAS) Y UBICACIÓN / PRECIO */}
          <div className="w-[58%] flex-1 min-w-0 flex flex-col justify-between h-full py-0.5 pr-0.5">
            {/* Cabecera compacta: by.fio★ y Categoría */}
            <div className="flex items-center justify-between text-[8px] uppercase font-bold text-slate-500 print:text-black border-b border-slate-100 print:border-black/30 pb-0.5 mb-1 gap-1">
              <span className="font-bubble text-fio-pink print:text-black text-[9px]">
                by.fio★
              </span>
              <span className="text-[7.5px] px-1 py-0.2 bg-purple-50 print:bg-transparent text-purple-700 print:text-black rounded truncate font-medium max-w-[100px]">
                {cleanCategory}
              </span>
            </div>

            {/* Descripción / Nombre del Producto (mismo tamaño del código de barras: 10px sm:11px) */}
            <div className="flex-1 min-h-0 flex items-center">
              <h4 className="font-bubble font-bold text-[10px] sm:text-[11px] text-slate-900 print:text-black leading-tight line-clamp-2">
                {cleanName}
              </h4>
            </div>

            {/* Ubicación y Precio (sin palabras Ubicación: ni Código:) */}
            <div className="mt-1 pt-0.5 border-t border-slate-100 print:border-black/30 flex items-center justify-between gap-1 text-[9px] sm:text-[10px]">
              {cleanLocation ? (
                <span className="font-bubble font-bold text-purple-900 print:text-black truncate max-w-[95px] sm:max-w-[115px]">
                  📍 {cleanLocation.split('(')[0].trim()}
                </span>
              ) : (
                <span />
              )}

              {showPrice && typeof product.price === 'number' && product.price > 0 && (
                <span className="font-bubble font-black text-fio-800 print:text-black text-[10px] sm:text-[11px] shrink-0 ml-auto">
                  {formatCRC(product.price)}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* FORMATO B: ETIQUETA DE CÓDIGO DE BARRAS CODE 128 (Barras gruesas de alta legibilidad, no alargadas) */
        <>
          {/* 1. Encabezado de Etiqueta: Categoría & Estante */}
          <div className="flex items-center justify-between text-[8px] sm:text-[9px] uppercase font-bold text-slate-500 print:text-black border-b border-slate-100 print:border-black/30 pb-0.5 mb-1 gap-1">
            <span className="text-[8px] sm:text-[8.5px] px-1 py-0.2 bg-purple-50 print:bg-transparent text-purple-700 print:text-black rounded truncate font-medium max-w-[110px] sm:max-w-[130px]">
              {cleanCategory}
            </span>

            {cleanLocation && (
              <span className="font-semibold text-slate-600 print:text-black truncate max-w-[90px] sm:max-w-[110px] text-right">
                📍 {cleanLocation.split('(')[0].trim()}
              </span>
            )}
          </div>

          {/* Nombre del Producto */}
          <div className="px-0.5 mb-0.5">
            <h4 className="font-bubble font-bold text-[10px] sm:text-[11px] text-slate-900 print:text-black leading-tight line-clamp-2">
              {cleanName}
            </h4>
          </div>

          {/* Código de Barras con Código Interno centrado */}
          <div className="py-0.5 bg-white flex flex-col items-center justify-center overflow-hidden w-full">
            <Barcode128
              value={cleanSku}
              height={compact ? 36 : 42}
              moduleWidth={2.4}
              className="h-7.5 sm:h-8.5 w-auto max-w-[170px] sm:max-w-[185px] mx-auto"
            />
            <span className="font-mono font-black text-slate-900 print:text-black bg-slate-100 print:bg-transparent px-1.5 py-0.2 rounded tracking-wider text-[8.5px] sm:text-[9.5px] text-center mt-0.5">
              {cleanSku}
            </span>
          </div>

          {/* Pie: by.fio★ (donde estaba el código interno) + Proveedor + Precio */}
          <div className="mt-0.5 pt-0.5 border-t border-slate-100 print:border-black/30 flex items-center justify-between px-0.5 text-[9px] sm:text-[10px]">
            <span className="font-bubble font-bold text-fio-pink print:text-black text-[9.5px] sm:text-[10.5px] shrink-0">
              by.fio★
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
