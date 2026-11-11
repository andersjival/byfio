import React, { useState, useMemo } from 'react';
import { Product, SupplierOrderItem } from '../../types';
import { formatCRC } from '../../utils/formatters';
import { SupplierInvoiceDraft } from './SupplierInvoiceHeaderStep';
import {
  Search, Plus, Minus, Trash2, ArrowLeft, CheckCircle2, Package
} from 'lucide-react';

interface SupplierInvoiceProductsStepProps {
  draft: SupplierInvoiceDraft;
  products: Product[];
  items: SupplierOrderItem[];
  onChangeItems: (updater: (prev: SupplierOrderItem[]) => SupplierOrderItem[]) => void;
  onBackToHeader: () => void;
  onSaveOrderAndInventory: () => void;
  isSaving: boolean;
}

export const SupplierInvoiceProductsStep: React.FC<SupplierInvoiceProductsStepProps> = ({
  draft,
  products,
  items,
  onChangeItems,
  onBackToHeader,
  onSaveOrderAndInventory,
  isSaving,
}) => {
  const [query, setQuery] = useState('');
  const [pendingQtyById, setPendingQtyById] = useState<Record<string, number>>({});

  const matchedProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 12);
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q) ||
          (p.shelfLocation || '').toLowerCase().includes(q)
      )
      .slice(0, 30);
  }, [products, query]);

  const addProductWithQty = (prod: Product, qtyToAdd: number) => {
    const qty = Math.max(1, Math.floor(qtyToAdd || 1));
    const unitCost = Number(prod.costPrice || 0);
    onChangeItems((prev) => {
      const idx = prev.findIndex((it) => it.productId === prod.id || it.sku === prod.sku);
      if (idx !== -1) {
        return prev.map((it, i) => {
          if (i !== idx) return it;
          const nextQty = it.orderQty + qty;
          return { ...it, orderQty: nextQty, subtotal: nextQty * it.cost };
        });
      }
      return [
        ...prev,
        {
          productId: prod.id,
          sku: prod.sku,
          name: prod.name,
          category: prod.category,
          currentStock: Number(prod.stock || 0),
          minStock: Number(prod.minStock || 0),
          orderQty: qty,
          cost: unitCost,
          subtotal: qty * unitCost,
          shelfLocation: prod.shelfLocation,
        },
      ];
    });
    setPendingQtyById((p) => ({ ...p, [prod.id]: 1 }));
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const clean = query.trim().toLowerCase();
    if (!clean) return;
    const exact = products.find((p) => p.sku.toLowerCase() === clean);
    if (exact) {
      addProductWithQty(exact, 1);
      setQuery('');
    }
  };

  const updateItemField = (index: number, field: 'orderQty' | 'cost', val: number) => {
    onChangeItems((prev) =>
      prev.map((it, i) => {
        if (i !== index) return it;
        const nextQty = field === 'orderQty' ? Math.max(1, Math.floor(val || 1)) : it.orderQty;
        const nextCost = field === 'cost' ? Math.max(0, val || 0) : it.cost;
        return { ...it, orderQty: nextQty, cost: nextCost, subtotal: nextQty * nextCost };
      })
    );
  };

  const totalUnits = items.reduce((s, it) => s + it.orderQty, 0);
  const itemsCostTotal = items.reduce((s, it) => s + it.subtotal, 0);
  const headerTotal = parseFloat(draft.totalGeneral || '0') || 0;

  return (
    <div className="space-y-4">
      <div className="bg-purple-50/80 border border-purple-200 rounded-3xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs space-y-0.5">
          <p className="font-bubble font-bold text-sm text-purple-950">{draft.supplierName}</p>
          <p className="text-purple-800 font-mono text-[11px]">
            {draft.orderNumber ? `Pedido: ${draft.orderNumber}` : 'Sin # pedido'} • {draft.invoiceNumber ? `Factura: ${draft.invoiceNumber}` : 'Sin # factura'} • Ingreso: {draft.entryDate}
            {headerTotal > 0 ? ` • Total Factura: ${formatCRC(headerTotal)}` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={onBackToHeader}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-purple-200 text-purple-900 font-bubble text-xs font-bold hover:bg-purple-100 cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Editar Proveedor / Factura</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-clay p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-bubble font-bold text-base text-slate-900">2. Buscar e Ingresar Productos</h3>
          <span className="text-[11px] text-slate-500">Busca manualmente por nombre o SKU, indica la cantidad y presiona Agregar.</span>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Buscar producto por nombre, SKU, categoría o estante (Enter agrega SKU exacto)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto border border-slate-100 rounded-2xl">
          {matchedProducts.map((prod) => {
            const qtyVal = pendingQtyById[prod.id] ?? 1;
            return (
              <div key={prod.id} className="p-2.5 sm:px-3.5 flex items-center justify-between gap-3 hover:bg-slate-50">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs text-slate-900 truncate">{prod.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {prod.sku} • {prod.shelfLocation || 'Sin estante'} • Stock actual: <strong>{prod.stock}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    min="1"
                    value={qtyVal}
                    onChange={(e) => setPendingQtyById((p) => ({ ...p, [prod.id]: Math.max(1, parseInt(e.target.value || '1', 10)) }))}
                    className="w-16 px-2 py-1.5 rounded-xl border border-slate-300 text-center text-xs font-mono font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => addProductWithQty(prod, qtyVal)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bubble text-xs font-bold cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar</span>
                  </button>
                </div>
              </div>
            );
          })}
          {matchedProducts.length === 0 && (
            <div className="p-6 text-center text-xs text-slate-400">No se encontraron productos para "{query}".</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-clay p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bubble font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-600" />
            <span>Productos a Ingresar ({items.length} ítems • {totalUnits} uds)</span>
          </h4>
          <span className="font-mono font-bold text-xs text-purple-900">Costo líneas: {formatCRC(itemsCostTotal)}</span>
        </div>

        {items.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6 border border-dashed border-slate-200 rounded-2xl">Aún no has agregado productos a este ingreso.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((it, idx) => (
              <div key={it.sku + idx} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">{it.name}</p>
                  <p className="text-[11px] font-mono text-slate-500">
                    {it.sku} • Stock: {it.currentStock} &rarr; <strong className="text-emerald-700">{it.currentStock + it.orderQty}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button type="button" onClick={() => updateItemField(idx, 'orderQty', it.orderQty - 1)} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer"><Minus className="w-3.5 h-3.5" /></button>
                  <input type="number" min="1" value={it.orderQty} onChange={(e) => updateItemField(idx, 'orderQty', parseInt(e.target.value || '1', 10))} className="w-16 px-2 py-1 rounded-xl border border-slate-300 text-center font-mono font-bold" />
                  <button type="button" onClick={() => updateItemField(idx, 'orderQty', it.orderQty + 1)} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer"><Plus className="w-3.5 h-3.5" /></button>
                  <input type="number" min="0" step="0.01" value={it.cost} onChange={(e) => updateItemField(idx, 'cost', parseFloat(e.target.value || '0'))} title="Costo unitario" className="w-24 px-2 py-1 rounded-xl border border-slate-300 text-right font-mono" />
                  <button type="button" onClick={() => onChangeItems((prev) => prev.filter((_, i) => i !== idx))} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            disabled={items.length === 0 || isSaving}
            onClick={onSaveOrderAndInventory}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bubble text-xs sm:text-sm font-bold shadow-clayBtn cursor-pointer active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSaving ? 'Guardando ingreso...' : 'Confirmar e Ingresar al Inventario'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
