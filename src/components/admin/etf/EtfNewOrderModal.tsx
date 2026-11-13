import React, { useState } from 'react';
import { X, UploadCloud, Plus, Layers, Check } from 'lucide-react';
import { Order, EtfFileAttachment } from '../../../types';

interface EtfNewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateOrder: (order: Partial<Order>) => void;
}

export const EtfNewOrderModal: React.FC<EtfNewOrderModalProps> = ({ isOpen, onClose, onCreateOrder }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [productName, setProductName] = useState('Metro Lineal DTF / ETF Textil');
  const [total, setTotal] = useState('6500');
  const [requirement, setRequirement] = useState('');
  const [files, setFiles] = useState<EtfFileAttachment[]>([]);
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;

    const orderNumber = `#ETF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Partial<Order> = {
      orderNumber,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryMethod: 'retiro',
      paymentMethod: 'sinpe',
      paymentStatus: 'paid',
      orderStatus: 'pending',
      subtotal: Number(total) || 0,
      shippingFee: 0,
      total: Number(total) || 0,
      createdAt: new Date().toISOString(),
      items: [
        {
          id: `prod_etf_${Date.now()}`,
          type: 'product',
          name: productName,
          quantity: 1,
          price: Number(total) || 0,
          sku: 'ETF-PRINT-01',
        },
      ],
      etfData: {
        isEtfOrder: true,
        requirement: requirement.trim(),
        files,
        productionStatus: files.length > 0 ? 'files_received' : 'pending_files',
        updatedAt: new Date().toISOString(),
      },
    };

    onCreateOrder(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="font-bubble font-bold text-slate-800 dark:text-white">Registrar Compra ETF</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre del Cliente *</label>
              <input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ej: Laura Castro"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Teléfono / WhatsApp *</label>
              <input
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Ej: 8888-1234"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Servicio / Producto ETF</label>
              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Monto (CRC)</label>
              <input
                type="number"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Requerimiento de Impresión</label>
            <textarea
              rows={2}
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="Ej: Medidas 58x100cm, fondo transparente, colores CMYK vibrantes..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Subir Archivos y Fotos ({files.length})</label>
              <label className="cursor-pointer text-purple-600 dark:text-purple-400 font-bold hover:underline inline-flex items-center gap-1">
                <UploadCloud className="w-3.5 h-3.5" /> {uploading ? 'Cargando...' : 'Seleccionar'}
                <input type="file" multiple accept="image/*,.pdf,.ai,.eps,.psd" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            {files.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-900 rounded-xl max-h-24 overflow-y-auto">
                {files.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[10px]">
                    <Check className="w-3 h-3 text-emerald-500" /> {f.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold inline-flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Guardar Compra ETF
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
