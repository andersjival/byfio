import React from 'react';
import { X, Download, ExternalLink, Calendar, HardDrive, ZoomIn } from 'lucide-react';
import { EtfFileAttachment } from '../../../types';
import { downloadEtfFile } from '../../../services/etfService';

interface EtfPhotoModalProps {
  file: EtfFileAttachment | null;
  orderNumber: string;
  customerName: string;
  onClose: () => void;
}

export const EtfPhotoModal: React.FC<EtfPhotoModalProps> = ({
  file,
  orderNumber,
  customerName,
  onClose,
}) => {
  if (!file) return null;

  const isImage = file.type?.startsWith('image/') || /\.(png|jpe?g|webp|svg|gif)$/i.test(file.name || file.url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800/90 border-b border-slate-700">
          <div className="min-w-0 pr-3">
            <div className="flex items-center gap-2 text-xs text-purple-400 font-bold uppercase tracking-wider">
              <span>Orden {orderNumber}</span>
              <span>•</span>
              <span className="text-slate-300 truncate">{customerName}</span>
            </div>
            <h3 className="font-bubble text-sm sm:text-base text-white truncate">{file.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadEtfFile(file)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
              title="Descargar archivo en resolución original"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Descargar</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition"
              title="Cerrar vista"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/40 min-h-[300px]">
          {isImage ? (
            <img
              src={file.url}
              alt={file.name}
              className="max-h-[68vh] w-auto max-w-full object-contain rounded-lg shadow-lg border border-slate-800"
            />
          ) : (
            <div className="text-center p-8 bg-slate-800/60 rounded-xl border border-slate-700 max-w-md">
              <HardDrive className="w-12 h-12 text-purple-400 mx-auto mb-3" />
              <p className="font-bold text-white mb-1">{file.name}</p>
              <p className="text-xs text-slate-400 mb-4">Archivo de diseño o documento listo para descarga e impresión.</p>
              <a
                href={file.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition"
              >
                <ExternalLink className="w-4 h-4" /> Abrir en pestaña externa
              </a>
            </div>
          )}
        </div>

        {/* Footer Meta */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-800/90 border-t border-slate-700 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : 'Reciente'}
            </span>
            {file.size && (
              <span className="flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            )}
          </div>
          <span className="text-[11px] text-purple-300">
            Resolución original preservada para uso en taller
          </span>
        </div>
      </div>
    </div>
  );
};
