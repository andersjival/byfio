import React, { useState } from 'react';
import { X, UploadCloud, CheckCircle2, Image as ImageIcon, Trash2, FileText, Send, Sparkles } from 'lucide-react';
import { Order, EtfFileAttachment } from '../../types';
import { useApp } from '../../context/AppContext';

interface EtfCustomerUploadModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EtfCustomerUploadModal: React.FC<EtfCustomerUploadModalProps> = ({ order, isOpen, onClose }) => {
  const { updateOrderEtfData } = useApp();
  if (!isOpen || !order) return null;

  const etf = order.etfData || { files: [], requirement: '', productionStatus: 'pending_files' };
  const [requirement, setRequirement] = useState(etf.requirement || '');
  const [files, setFiles] = useState<EtfFileAttachment[]>(etf.files || []);
  const [uploading, setUploading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list || list.length === 0) return;
    setUploading(true);
    const newItems: EtfFileAttachment[] = [];
    let count = 0;

    Array.from(list).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        newItems.push({
          id: `etf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          url: (ev.target?.result as string) || '',
          size: file.size,
          uploadedAt: new Date().toISOString(),
          type: file.type,
        });
        count++;
        if (count === list.length) {
          setFiles((prev) => [...prev, ...newItems]);
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSave = () => {
    updateOrderEtfData(order.id, {
      requirement: requirement.trim(),
      files,
      productionStatus: files.length > 0 ? (etf.productionStatus === 'pending_files' ? 'files_received' : etf.productionStatus) : 'pending_files',
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden text-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Requerimiento & Archivos ETF
            </div>
            <h3 className="font-bubble font-bold text-base sm:text-lg">Pedido {order.orderNumber}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
          {/* Requirement Text */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-600" /> ¿Qué deseas que imprimamos? (Requerimiento)
            </label>
            <textarea
              rows={3}
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="Indica medidas deseadas, detalles de colores, si es fondo transparente, número de copias por diseño, etc..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Upload Box */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Fotos y Archivos de Diseño ({files.length})
            </label>
            <label className="border-2 border-dashed border-purple-200 dark:border-purple-800 hover:border-purple-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-purple-50/40 dark:bg-purple-950/20 transition">
              <UploadCloud className="w-8 h-8 text-purple-500 mb-1" />
              <span className="font-bold text-purple-700 dark:text-purple-300">
                {uploading ? 'Procesando archivos...' : 'Toca para subir tus fotos o archivos'}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">Formatos recomendados: PNG, JPG, PDF, SVG</span>
              <input type="file" multiple accept="image/*,.pdf,.ai,.eps,.psd" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Files List / Thumbnails */}
          {files.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {files.map((file) => {
                const isImg = file.type?.startsWith('image/') || /\.(png|jpe?g|webp|svg|gif)$/i.test(file.name || file.url);
                return (
                  <div key={file.id} className="relative rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-900 aspect-video flex items-center justify-center group">
                    {isImg ? (
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="p-2 text-[10px] text-slate-500 font-bold truncate">📄 {file.name}</span>
                    )}
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="absolute top-1 right-1 p-1 rounded-lg bg-rose-600 text-white opacity-80 hover:opacity-100 transition shadow"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {savedSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> ¡Requerimiento y archivos guardados con éxito!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold">
            Cerrar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold inline-flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" /> Guardar y Enviar a Taller
          </button>
        </div>
      </div>
    </div>
  );
};
