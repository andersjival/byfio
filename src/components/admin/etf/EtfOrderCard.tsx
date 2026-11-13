import React, { useState } from 'react';
import {
  Download, Eye, Phone, MessageCircle, FileText, UploadCloud,
  CheckCircle2, Clock, Trash2, Edit3, Save, Layers, Package
} from 'lucide-react';
import { Order, EtfFileAttachment, EtfProductionStatus } from '../../../types';
import { getEtfStatusBadge, downloadEtfFile, downloadAllEtfFiles } from '../../../services/etfService';

interface EtfOrderCardProps {
  order: Order;
  onUpdateEtf: (orderId: string, updates: any) => void;
  onPreviewFile: (file: EtfFileAttachment, orderNumber: string, customerName: string) => void;
}

export const EtfOrderCard: React.FC<EtfOrderCardProps> = ({ order, onUpdateEtf, onPreviewFile }) => {
  const etf = order.etfData || { files: [], requirement: '', productionStatus: 'pending_files' };
  const files = etf.files || [];
  const [editingReq, setEditingReq] = useState(false);
  const [reqText, setReqText] = useState(etf.requirement || '');
  const [uploading, setUploading] = useState(false);

  const badge = getEtfStatusBadge(etf.productionStatus);
  const cleanPhone = (order.customerPhone || '').replace(/\D/g, '');
  const waUrl = cleanPhone ? `https://wa.me/506${cleanPhone}?text=${encodeURIComponent(`Hola ${order.customerName}, te contactamos de BYFIO sobre tu orden de ETF ${order.orderNumber}`)}` : undefined;

  const handleSaveReq = () => {
    onUpdateEtf(order.id, { requirement: reqText });
    setEditingReq(false);
  };

  const handleStatusChange = (status: EtfProductionStatus) => {
    onUpdateEtf(order.id, { productionStatus: status });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    const newAttachments: EtfFileAttachment[] = [];
    let processed = 0;

    Array.from(fileList).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newAttachments.push({
          id: `etf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          url: (event.target?.result as string) || '',
          size: file.size,
          uploadedAt: new Date().toISOString(),
          type: file.type,
        });
        processed++;
        if (processed === fileList.length) {
          const updated = [...files, ...newAttachments];
          onUpdateEtf(order.id, {
            files: updated,
            productionStatus: etf.productionStatus === 'pending_files' ? 'files_received' : etf.productionStatus,
          });
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteFile = (fileId: string) => {
    const updated = files.filter((f) => f.id !== fileId);
    onUpdateEtf(order.id, { files: updated });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
            <Layers className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bubble font-bold text-fio-900 dark:text-white text-base">{order.orderNumber}</span>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} {order.items.length === 1 ? 'ítem' : 'ítems'}
            </p>
          </div>
        </div>

        {/* Status Dropdown */}
        <select
          value={etf.productionStatus || 'pending_files'}
          onChange={(e) => handleStatusChange(e.target.value as EtfProductionStatus)}
          aria-label="Estado de producción"
          className="text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="pending_files">⏳ Pendiente de Archivos</option>
          <option value="files_received">📥 Archivos Recibidos</option>
          <option value="in_production">⚙️ En Impresión / Producción</option>
          <option value="ready">✅ Listo para Entrega</option>
          <option value="delivered">📦 Entregado</option>
        </select>
      </div>

      {/* Customer Info Row */}
      <div className="py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-100 dark:border-slate-700/40">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 dark:text-slate-200">{order.customerName}</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600 dark:text-slate-400">{order.customerPhone}</span>
        </div>
        {waUrl && (
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 font-bold hover:bg-emerald-100 transition"
          >
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </a>
        )}
      </div>

      {/* Requirement Box */}
      <div className="my-3 p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
        <div className="flex items-center justify-between mb-1.5">
          <span className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-300">
            <FileText className="w-3.5 h-3.5" /> Requerimiento del Cliente
          </span>
          <button
            onClick={() => { if (editingReq) handleSaveReq(); else setEditingReq(true); }}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400"
          >
            {editingReq ? <><Save className="w-3 h-3" /> Guardar</> : <><Edit3 className="w-3 h-3" /> Editar</>}
          </button>
        </div>
        {editingReq ? (
          <textarea
            value={reqText}
            onChange={(e) => setReqText(e.target.value)}
            rows={2}
            className="w-full text-xs p-2 rounded-lg border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
            placeholder="Escribe el requerimiento de impresión..."
          />
        ) : (
          <p className="text-xs text-slate-700 dark:text-slate-300 italic whitespace-pre-wrap">
            {etf.requirement ? `"${etf.requirement}"` : 'Sin requerimiento especificado aún por el cliente.'}
          </p>
        )}
      </div>

      {/* Files Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Archivos y Fotos ({files.length})
          </span>
          <div className="flex items-center gap-1.5">
            {files.length > 0 && (
              <button
                onClick={() => downloadAllEtfFiles(files, order.orderNumber)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 transition"
              >
                <Download className="w-3 h-3" /> Descargar Todo
              </button>
            )}
            <label className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition">
              <UploadCloud className="w-3 h-3" />
              <span>{uploading ? 'Subiendo...' : 'Subir Archivo'}</span>
              <input type="file" multiple accept="image/*,.pdf,.ai,.eps,.psd" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Thumbnails */}
        {files.length === 0 ? (
          <div className="p-3 text-center rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-700 text-xs text-slate-400">
            El cliente aún no ha subido fotos ni archivos para esta compra.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {files.map((file) => {
              const isImg = file.type?.startsWith('image/') || /\.(png|jpe?g|webp|svg|gif)$/i.test(file.name || file.url);
              return (
                <div key={file.id} className="group relative rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-900 aspect-video flex items-center justify-center">
                  {isImg ? (
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="p-2 text-center text-[10px] text-slate-500 font-bold truncate max-w-full">
                      📄 {file.name}
                    </div>
                  )}
                  {/* Overlay buttons */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-1">
                    <button
                      onClick={() => onPreviewFile(file, order.orderNumber, order.customerName)}
                      className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-800 transition"
                      title="Ver en pantalla completa"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => downloadEtfFile(file)}
                      className="p-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition"
                      title="Descargar archivo"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition"
                      title="Eliminar archivo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
