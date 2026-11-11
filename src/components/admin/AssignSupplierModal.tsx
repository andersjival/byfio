import React, { useState, useEffect, useMemo } from 'react';
import { X, Truck, Check, Plus, AlertCircle } from 'lucide-react';
import { Product, Supplier } from '../../types';
import { useApp } from '../../context/AppContext';
import { playBubblePopSound, playBarcodeSuccessSound } from '../../utils/soundEffects';
import { syncCatalogTaxonomiesToCloud } from '../../utils/storeConfigSync';

interface AssignSupplierModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onAssign: (productId: string, supplierName: string) => void;
}

const DEFAULT_SUPPLIERS = ['Papelera Internacional', 'Sublimaciones CR'];
const CUSTOM_SUPPLIERS_STORAGE_KEY = 'byfio_custom_suppliers_v1';

export const AssignSupplierModal: React.FC<AssignSupplierModalProps> = ({
  isOpen,
  product,
  onClose,
  onAssign,
}) => {
  const { suppliers, products, addSupplier } = useApp();
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [isNewSupplierMode, setIsNewSupplierMode] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierPhone, setNewSupplierPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Recopilar lista completa de proveedores disponibles
  const availableSuppliers = useMemo(() => {
    const set = new Set<string>();
    DEFAULT_SUPPLIERS.forEach((s) => set.add(s.trim()));

    try {
      const saved = localStorage.getItem(CUSTOM_SUPPLIERS_STORAGE_KEY);
      if (saved) {
        const parsed: string[] = JSON.parse(saved);
        parsed.forEach((s) => typeof s === 'string' && s.trim() && set.add(s.trim()));
      }
    } catch {
      // ignore
    }

    if (Array.isArray(suppliers)) {
      suppliers.forEach((s: Supplier) => s.name?.trim() && set.add(s.name.trim()));
    }

    if (Array.isArray(products)) {
      products.forEach((p) => {
        if (p.supplier && typeof p.supplier === 'string' && p.supplier.trim() && p.supplier !== 'Sin Asignar') {
          set.add(p.supplier.trim());
        }
      });
    }

    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [suppliers, products]);

  // Sincronizar selección inicial cuando se abre el modal
  useEffect(() => {
    if (isOpen && product) {
      setErrorMsg(null);
      setIsNewSupplierMode(false);
      setNewSupplierName('');
      setNewSupplierPhone('');

      const current = product.supplier?.trim();
      if (current && current !== 'Sin Asignar' && current.toLowerCase() !== 'sin proveedor') {
        setSelectedSupplier(current);
      } else if (availableSuppliers.length > 0) {
        setSelectedSupplier(availableSuppliers[0]);
      } else {
        setSelectedSupplier('');
        setIsNewSupplierMode(true);
      }
    }
  }, [isOpen, product, availableSuppliers]);

  // Manejar tecla ESC para cerrar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleSave = () => {
    setErrorMsg(null);
    let finalSupplier = '';

    if (isNewSupplierMode) {
      finalSupplier = newSupplierName.trim();
      if (!finalSupplier) {
        setErrorMsg('Ingresa el nombre del nuevo proveedor.');
        return;
      }

      // Guardar en el directorio y custom storage
      try {
        if (addSupplier) {
          addSupplier({
            name: finalSupplier,
            phone: newSupplierPhone.trim() || 'N/A',
            whatsappPhone: newSupplierPhone.trim() || undefined,
          });
        }
        const saved = localStorage.getItem(CUSTOM_SUPPLIERS_STORAGE_KEY);
        const parsed: string[] = saved ? JSON.parse(saved) : [];
        if (!parsed.includes(finalSupplier)) {
          parsed.push(finalSupplier);
          localStorage.setItem(CUSTOM_SUPPLIERS_STORAGE_KEY, JSON.stringify(parsed));
          syncCatalogTaxonomiesToCloud();
        }
      } catch (err) {
        console.warn('Error guardando proveedor en catálogo:', err);
      }
    } else {
      finalSupplier = selectedSupplier.trim();
      if (!finalSupplier) {
        setErrorMsg('Selecciona un proveedor de la lista o crea uno nuevo.');
        return;
      }
    }

    playBubblePopSound();
    playBarcodeSuccessSound(0.2);
    onAssign(product.id, finalSupplier);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-amber-100 overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Cabecera */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 px-6 py-4 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bubble font-bold text-lg leading-tight">Asignar Proveedor</h3>
              <p className="text-amber-100 text-xs">Vincula un proveedor a este producto</p>
            </div>
          </div>
          <button
            onClick={() => {
              playBubblePopSound();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6 space-y-4">
          {/* Tarjeta resumen del producto */}
          <div className="flex items-center gap-3 p-3 bg-amber-50/70 rounded-2xl border border-amber-200/80">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 rounded-xl object-cover border border-amber-200 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-amber-200/60 flex items-center justify-center text-amber-800 font-bold shrink-0">
                📦
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h4 className="font-bubble font-bold text-sm text-gray-800 truncate" title={product.name}>
                {product.name}
              </h4>
              <p className="text-[11px] text-amber-900 font-mono">
                SKU: <span className="font-bold">{product.sku}</span> · {product.category}
              </p>
              <p className="text-[10px] text-gray-500">
                Ubicación: <span className="font-medium">{product.shelfLocation || 'Sin estante'}</span>
              </p>
            </div>
          </div>

          {/* Selector de modo: Existente vs Nuevo */}
          <div className="space-y-3">
            <label className="block text-xs font-bubble font-bold text-gray-700">
              Seleccionar o escribir proveedor:
            </label>

            {!isNewSupplierMode ? (
              <div className="space-y-2">
                <select
                  value={selectedSupplier}
                  onChange={(e) => {
                    if (e.target.value === '__NEW__') {
                      setIsNewSupplierMode(true);
                      setNewSupplierName('');
                    } else {
                      setSelectedSupplier(e.target.value);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer"
                >
                  <option value="" disabled>-- Elige un proveedor --</option>
                  {availableSuppliers.map((supp) => (
                    <option key={supp} value={supp}>
                      {supp}
                    </option>
                  ))}
                  <option value="__NEW__">➕ Escribir otro proveedor nuevo...</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    setIsNewSupplierMode(true);
                    setNewSupplierName('');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-800 font-bold font-bubble hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>¿No aparece en la lista? Escribir nuevo proveedor</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 p-3.5 bg-amber-50/50 rounded-2xl border border-amber-200">
                <div>
                  <label className="block text-[11px] font-bold text-amber-900 mb-1">
                    Nombre del Nuevo Proveedor *
                  </label>
                  <input
                    type="text"
                    value={newSupplierName}
                    onChange={(e) => setNewSupplierName(e.target.value)}
                    placeholder="Ej. Distribuidora Santa Rosa"
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-amber-900 mb-1">
                    Teléfono / WhatsApp (Opcional)
                  </label>
                  <input
                    type="tel"
                    value={newSupplierPhone}
                    onChange={(e) => setNewSupplierPhone(e.target.value)}
                    placeholder="Ej. 8888-8888"
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {availableSuppliers.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsNewSupplierMode(false)}
                    className="text-xs text-gray-600 hover:text-gray-800 underline cursor-pointer"
                  >
                    ← Volver a lista de proveedores existentes
                  </button>
                )}
              </div>
            )}

            {errorMsg && (
              <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() => {
              playBubblePopSound();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bubble font-bold transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bubble font-bold shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Aceptar y Guardar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
