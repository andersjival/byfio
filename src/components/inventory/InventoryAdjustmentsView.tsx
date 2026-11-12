import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, InventoryAdjustmentItem } from '../../types';
import {
  Search, SlidersHorizontal, Plus, Minus, Save, Trash2,
  CheckCircle2, AlertCircle, Package
} from 'lucide-react';
import { playWaterDropSound, playBubblePopSound } from '../../utils/soundEffects';

interface StagedAdjustment {
  product: Product;
  newStock: number;
  reason: string;
}

const ADJUSTMENT_REASONS = [
  'Conteo Físico / Diferencia detectada',
  'Merma / Producto Dañado',
  'Pérdida / Extravío',
  'Sobrante / Ingreso sin registrar',
  'Corrección Administrativa',
  'Uso Interno / Muestra',
];

export const InventoryAdjustmentsView: React.FC<{ onSaved?: () => void }> = ({ onSaved }) => {
  const { products, currentUser, addInventoryAdjustment } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [stagedItems, setStagedItems] = useState<Record<string, StagedAdjustment>>({});
  const [generalNotes, setGeneralNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return products.slice(0, 12);
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.shelfLocation.toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [products, searchQuery]);

  const handleStageProduct = (product: Product) => {
    playWaterDropSound();
    setStagedItems((prev) => {
      if (prev[product.id]) return prev;
      return {
        ...prev,
        [product.id]: {
          product,
          newStock: product.stock,
          reason: ADJUSTMENT_REASONS[0],
        },
      };
    });
  };

  const handleUpdateStagedStock = (productId: string, val: number) => {
    const safeVal = Math.max(0, Math.floor(val));
    setStagedItems((prev) => {
      const existing = prev[productId];
      if (!existing) return prev;
      return {
        ...prev,
        [productId]: { ...existing, newStock: safeVal },
      };
    });
  };

  const handleUpdateStagedReason = (productId: string, reason: string) => {
    setStagedItems((prev) => {
      const existing = prev[productId];
      if (!existing) return prev;
      return {
        ...prev,
        [productId]: { ...existing, reason },
      };
    });
  };

  const handleRemoveStaged = (productId: string) => {
    playWaterDropSound();
    setStagedItems((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const stagedList = Object.values(stagedItems);
  const changedItems = stagedList.filter((st) => st.newStock !== st.product.stock);

  const handleApplyAdjustments = async () => {
    if (changedItems.length === 0) return;
    setIsSaving(true);
    try {
      const itemsPayload: InventoryAdjustmentItem[] = changedItems.map((st) => ({
        productId: st.product.id,
        sku: st.product.sku,
        name: st.product.name,
        category: st.product.category,
        shelfLocation: st.product.shelfLocation || 'Estante 1',
        image: st.product.image,
        previousStock: st.product.stock,
        countedStock: st.newStock,
        difference: st.newStock - st.product.stock,
        reason: st.reason,
      }));

      const netDifference = itemsPayload.reduce((acc, it) => acc + it.difference, 0);

      await addInventoryAdjustment({
        shelfName:
          itemsPayload.length === 1
            ? `${itemsPayload[0].shelfLocation} (Ajuste Individual)`
            : 'Ajuste Múltiple de Inventario',
        performedBy: currentUser?.name || 'ADMINISTRACIÓN (FIO)',
        userRole: currentUser?.role || 'admin',
        totalItemsCounted: itemsPayload.length,
        totalDifferences: itemsPayload.length,
        netDifferenceUnits: netDifference,
        items: itemsPayload,
        notes: generalNotes.trim() || 'Ajuste directo por diferencia de inventario',
      });

      playBubblePopSound();
      setStagedItems({});
      setGeneralNotes('');
      setSuccessMsg(`✓ Ajuste aplicado con éxito a ${itemsPayload.length} producto(s). El stock y el reporte ya están guardados.`);
      setTimeout(() => setSuccessMsg(null), 5000);
      if (onSaved) onSaved();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Cabecera */}
      <div className="bg-white rounded-3xl border border-purple-200/80 p-4 sm:p-5 space-y-3 shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-bubble font-bold text-lg sm:text-xl text-fio-900 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-fio-pink" />
              <span>Ajustes de Inventario</span>
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Si encontraste diferencias en el conteo o mermas, busca el producto, ajusta su stock real y genera automáticamente el respaldo en el historial.
            </p>
          </div>
        </div>

        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bubble font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Columna Izquierda: Buscador de Productos */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-purple-100 p-4 space-y-3 shadow-xs">
          <h3 className="font-bubble font-bold text-sm text-slate-800">
            1. Buscar producto para ajustar
          </h3>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Escribe nombre, SKU o estante..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-purple-400 focus:outline-none text-xs"
            />
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {searchResults.map((prod) => {
              const isStaged = Boolean(stagedItems[prod.id]);
              return (
                <div
                  key={prod.id}
                  className={`flex items-center justify-between gap-2.5 p-2.5 rounded-2xl border transition-all ${
                    isStaged
                      ? 'border-purple-300 bg-purple-50/50'
                      : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={prod.image || '/images/placeholder-new-product.jpg'}
                      alt={prod.name}
                      className="w-10 h-10 rounded-xl object-cover border border-white shrink-0 bg-white"
                    />
                    <div className="min-w-0">
                      <p className="font-bubble font-bold text-xs text-slate-900 truncate">
                        {prod.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        <span className="font-mono font-bold text-purple-800">{prod.sku}</span> • {prod.shelfLocation} • Stock actual: <strong>{prod.stock}</strong>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={isStaged}
                    onClick={() => handleStageProduct(prod)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold shrink-0 transition-all cursor-pointer ${
                      isStaged
                        ? 'bg-emerald-100 text-emerald-800 cursor-default'
                        : 'bg-purple-700 hover:bg-purple-800 text-white active:scale-95'
                    }`}
                  >
                    {isStaged ? 'Seleccionado ✓' : '+ Ajustar'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha: Lista de Ajustes a Aplicar */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-purple-100 p-4 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bubble font-bold text-sm text-slate-800">
                2. Detalle del Ajuste ({stagedList.length})
              </h3>
              {changedItems.length > 0 && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {changedItems.length} con diferencia
                </span>
              )}
            </div>

            {stagedList.length === 0 ? (
              <div className="py-12 text-center space-y-2 border-2 border-dashed border-slate-100 rounded-2xl">
                <Package className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-400 font-sans">
                  Selecciona productos de la lista para modificar su existencia real.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {stagedList.map(({ product, newStock, reason }) => {
                  const diff = newStock - product.stock;
                  return (
                    <div
                      key={product.id}
                      className="p-3 rounded-2xl border border-purple-100 bg-purple-50/30 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-bubble font-bold text-xs text-slate-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Sistema: <strong className="font-mono">{product.stock}</strong> | Estante: {product.shelfLocation}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveStaged(product.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                          title="Quitar de la lista"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateStagedStock(product.id, newStock - 1)}
                            className="w-8 h-8 rounded-lg bg-white border border-purple-200 flex items-center justify-center text-purple-900 font-bold active:scale-90 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={newStock}
                            onChange={(e) =>
                              handleUpdateStagedStock(product.id, parseInt(e.target.value, 10) || 0)
                            }
                            className="w-16 text-center py-1 rounded-lg border border-purple-300 bg-white font-mono font-bold text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => handleUpdateStagedStock(product.id, newStock + 1)}
                            className="w-8 h-8 rounded-lg bg-white border border-purple-200 flex items-center justify-center text-purple-900 font-bold active:scale-90 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span
                          className={`font-mono font-bold text-xs px-2.5 py-1 rounded-lg ${
                            diff > 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : diff < 0
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          Diferencia: {diff > 0 ? `+${diff}` : diff}
                        </span>
                      </div>

                      <select
                        value={reason}
                        onChange={(e) => handleUpdateStagedReason(product.id, e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-purple-200 bg-white text-xs text-slate-700"
                      >
                        {ADJUSTMENT_REASONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {stagedList.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <textarea
                rows={2}
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                placeholder="Comentario adicional para el reporte de ajuste..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-purple-400"
              />

              {changedItems.length === 0 && (
                <p className="text-[11px] text-amber-700 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Modifica la cantidad de al menos un producto para registrar una diferencia.
                </p>
              )}

              <button
                type="button"
                disabled={changedItems.length === 0 || isSaving}
                onClick={handleApplyAdjustments}
                className="w-full py-3 rounded-2xl bg-[#F472B6] hover:bg-[#EC4899] disabled:opacity-40 text-white font-bubble font-bold text-sm shadow-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>
                  {isSaving
                    ? 'Aplicando Ajuste...'
                    : `Aplicar Ajuste y Generar Reporte (${changedItems.length})`}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
