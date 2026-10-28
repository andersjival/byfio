import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCRC } from '../../utils/formatters';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, Tag } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const QrLabelModal: React.FC = () => {
  const { qrModalProduct, setQrModalProduct } = useApp();

  if (!qrModalProduct) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-clayLg border-2 border-fio-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-fio-200 flex items-center justify-between bg-fio-100/60">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-fio-800" />
            <h3 className="font-bubble font-bold text-sm text-fio-900">Etiqueta QR para Picking</h3>
          </div>
          <button
            onClick={() => setQrModalProduct(null)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tarjeta de Etiqueta Imprimible */}
        <div className="p-6 flex flex-col items-center">
          <div
            id="printable-qr-label"
            className="w-full bg-white p-5 rounded-2xl border-2 border-dashed border-fio-300 shadow-sm flex flex-col items-center text-center"
          >
            <div className="scale-75 origin-top mb-1">
              <BrandLogo size="sm" showSlogan={false} />
            </div>

            <p className="font-bubble font-bold text-sm text-gray-900 mt-1 max-w-[220px]">
              {qrModalProduct.name}
            </p>

            <span className="font-mono font-bold text-xs bg-fio-100 text-fio-800 px-2 py-0.5 rounded-md my-2">
              {qrModalProduct.sku}
            </span>

            {/* Código QR oficial con el SKU */}
            <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-inner mb-2">
              <QRCodeSVG
                value={qrModalProduct.sku}
                size={140}
                level="H"
                includeMargin={false}
              />
            </div>

            <p className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg mb-1">
              📍 {qrModalProduct.shelfLocation}
            </p>

            <p className="font-bubble font-bold text-base text-fio-900">
              {formatCRC(qrModalProduct.price)}
            </p>
          </div>

          <p className="text-[11px] text-gray-400 text-center mt-3">
            Pegar en el empaque o en la bandeja del estante para alisto guiado con escáner.
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
            <span>Imprimir Etiqueta</span>
          </button>
        </div>
      </div>
    </div>
  );
};
