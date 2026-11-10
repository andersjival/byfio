import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCRC } from '../../utils/formatters';
import { QRCodeSVG } from 'qrcode.react';
import { Barcode128 } from '../common/Barcode128';
import { X, Printer, Tag, Barcode, QrCode } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { playWaterDropSound } from '../../utils/soundEffects';

export const QrLabelModal: React.FC = () => {
  const { qrModalProduct, setQrModalProduct } = useApp();
  const [selectedFormat, setSelectedFormat] = useState<'qr' | 'barcode'>('qr');

  if (!qrModalProduct) return null;

  const handlePrint = () => {
    window.print();
  };

  const cleanQrValue = (qrModalProduct.qrCode || qrModalProduct.sku || 'FIO-PRD-000').trim();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-clayLg border-2 border-fio-200 overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-4 border-b border-fio-200 flex items-center justify-between bg-fio-100/60">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-fio-800" />
            <h3 className="font-bubble font-bold text-sm text-fio-900">
              Etiqueta de Producto ({selectedFormat === 'qr' ? 'Código QR' : 'Código de Barras'})
            </h3>
          </div>
          <button
            onClick={() => setQrModalProduct(null)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selector de Formato: QR vs Código de Barras */}
        <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedFormat('qr');
              playWaterDropSound();
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
              selectedFormat === 'qr'
                ? 'bg-gradient-to-r from-purple-700 to-fio-pink text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-pink-200" />
            <span>Código QR</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedFormat('barcode');
              playWaterDropSound();
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
              selectedFormat === 'barcode'
                ? 'bg-fio-800 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Barcode className="w-3.5 h-3.5 text-amber-300" />
            <span>Código de Barras</span>
          </button>
        </div>

        {/* Tarjeta de Etiqueta Imprimible */}
        <div className="p-5 flex flex-col items-center">
          <div
            id="printable-qr-label"
            className="w-full bg-white p-5 rounded-2xl border-2 border-dashed border-fio-300 shadow-sm flex flex-col items-center text-center print:border-black print:rounded-none"
          >
            <div className="scale-75 origin-top mb-1">
              <BrandLogo size="sm" showSlogan={false} />
            </div>

            <p className="font-bubble font-bold text-sm text-gray-900 mt-1 max-w-[240px]">
              {qrModalProduct.name}
            </p>

            <span className="font-mono font-black text-xs bg-fio-100 text-fio-800 px-2 py-0.5 rounded-md my-2">
              {qrModalProduct.sku}
            </span>

            {/* Código en el formato seleccionado */}
            {selectedFormat === 'qr' ? (
              <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-inner mb-2">
                <QRCodeSVG
                  value={cleanQrValue}
                  size={140}
                  level="H"
                  includeMargin={false}
                />
              </div>
            ) : (
              <div className="py-3 px-2 bg-white border border-gray-200 rounded-xl shadow-inner mb-2 w-full flex items-center justify-center">
                <Barcode128
                  value={qrModalProduct.sku}
                  height={64}
                  moduleWidth={2.4}
                  showText={true}
                  className="max-w-[240px] h-auto mx-auto"
                />
              </div>
            )}

            <p className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg mb-1">
              📍 {qrModalProduct.shelfLocation || 'Estante General'}
            </p>

            <p className="font-bubble font-bold text-base text-fio-900">
              {formatCRC(qrModalProduct.price)}
            </p>
          </div>

          <p className="text-[11px] text-gray-400 text-center mt-3">
            {selectedFormat === 'qr'
              ? 'Código QR 2D óptimo para escaneo por cámara de celular en alisto guiado.'
              : 'Código de Barras 128 con líneas gruesas de alta legibilidad para pistola láser o celular.'}
          </p>
        </div>

        {/* Acciones */}
        <div className="p-4 border-t border-fio-100 bg-fio-50/50 flex gap-2">
          <button
            onClick={() => setQrModalProduct(null)}
            className="flex-1 py-2.5 rounded-2xl border border-gray-300 text-gray-700 font-bubble text-xs font-semibold hover:bg-gray-100"
          >
            Cerrar
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble text-xs font-semibold shadow-clayBtn"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Etiqueta ({selectedFormat === 'qr' ? 'QR' : 'Barras'})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
