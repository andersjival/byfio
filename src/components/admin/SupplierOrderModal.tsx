import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCRC, getWhatsAppLink } from '../../utils/formatters';
import {
  X, Printer, MessageCircle, AlertTriangle, CheckCircle,
  Plus, Minus, Trash2, ShoppingCart, RefreshCw
} from 'lucide-react';

export const SupplierOrderModal: React.FC = () => {
  const { isSupplierModalOpen, setIsSupplierModalOpen, products } = useApp();
  const [customQuantities, setCustomQuantities] = useState<Record<string, number>>({});
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
  const [additionalProductIds, setAdditionalProductIds] = useState<string[]>([]);
  const [selectedAddId, setSelectedAddId] = useState<string>('');

  // Artículos base que requieren atención (por debajo de minStock, stock <= 0, no disponibles o agregados manualmente)
  const baseItems = useMemo(() => {
    return products.filter(
      (p) =>
        p.stock <= p.minStock ||
        p.stock <= 0 ||
        p.isAvailable === false ||
        p.showInStore === false ||
        additionalProductIds.includes(p.id)
    );
  }, [products, additionalProductIds]);

  // Inicializar cantidades predeterminadas sugeridas cuando se abre el modal
  useEffect(() => {
    if (isSupplierModalOpen) {
      setCustomQuantities((prev) => {
        const next = { ...prev };
        baseItems.forEach((p) => {
          if (next[p.id] === undefined) {
            next[p.id] = Math.max(1, p.maxStock - p.stock);
          }
        });
        return next;
      });
    }
  }, [isSupplierModalOpen, baseItems]);

  const handleQuantityChange = (productId: string, val: number) => {
    const cleanVal = isNaN(val) ? 0 : Math.max(0, Math.floor(val));
    setCustomQuantities((prev) => ({
      ...prev,
      [productId]: cleanVal,
    }));
  };

  const handleResetDefaults = () => {
    const next: Record<string, number> = {};
    baseItems.forEach((p) => {
      next[p.id] = Math.max(1, p.maxStock - p.stock);
    });
    setCustomQuantities(next);
    setExcludedIds(new Set());
  };

  const orderItems = useMemo(() => {
    return baseItems
      .filter((p) => !excludedIds.has(p.id))
      .map((p) => {
        const defaultQty = Math.max(1, p.maxStock - p.stock);
        const qty = customQuantities[p.id] !== undefined ? customQuantities[p.id] : defaultQty;
        const estCost = Math.max(0, qty) * p.costPrice;
        return {
          ...p,
          orderQty: qty,
          estCost,
        };
      });
  }, [baseItems, customQuantities, excludedIds]);

  // Productos del inventario que no están en la lista actual y pueden añadirse
  const availableToAdd = useMemo(() => {
    const currentIds = new Set(orderItems.map((i) => i.id));
    return products.filter((p) => !currentIds.has(p.id));
  }, [products, orderItems]);

  if (!isSupplierModalOpen) return null;

  const totalReplenishUnits = orderItems.reduce((acc, i) => acc + Math.max(0, i.orderQty), 0);
  const totalReplenishCost = orderItems.reduce((acc, i) => acc + i.estCost, 0);

  const generateWhatsAppMessage = () => {
    let msg = `*ORDEN DE REPOSICIÓN BY.FIO - ${new Date().toLocaleDateString('es-CR')}*\n`;
    msg += `Solicitud de compra y reposición para proveedor:\n\n`;
    const validItems = orderItems.filter((i) => i.orderQty > 0);
    validItems.forEach((i, idx) => {
      msg += `${idx + 1}. *${i.sku}* - ${i.name}\n   👉 Pedir: *${i.orderQty} ${i.unit}* (Stock actual: ${i.stock}/${i.maxStock})\n   💰 Costo est.: ${formatCRC(i.estCost)}\n`;
    });
    msg += `\n📦 Total unidades: ${totalReplenishUnits}\n💵 Inversión estimada: ${formatCRC(totalReplenishCost)}\n¡Favor confirmar disponibilidad y cotización formal!`;
    return msg;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-clayLg border-2 border-fio-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-fio-200 flex items-center justify-between bg-fio-100/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bubble font-bold text-base sm:text-lg text-fio-900 leading-tight">
                Lista de Pedido a Proveedor (Cantidades Modificables)
              </h3>
              <p className="text-[11px] text-gray-500 font-sans">
                Puedes escribir o cambiar el número a pedir para cada producto antes de enviarlo.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSupplierModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-white transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {orderItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500 space-y-2">
              <CheckCircle className="w-12 h-12 mx-auto text-emerald-500" />
              <p className="font-bubble text-base text-gray-800">No hay productos en esta lista de pedido</p>
              <p className="text-xs text-gray-400">Puedes agregar cualquier producto del inventario abajo.</p>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-fio-100 hover:bg-fio-200 text-fio-800 text-xs font-bubble font-bold transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restaurar sugerencias automáticas</span>
              </button>
            </div>
          ) : (
            <>
              {/* Barra de Controles Superiores */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-gray-100">
                <span className="text-xs text-gray-500 font-medium">
                  {orderItems.length} producto{orderItems.length !== 1 ? 's' : ''} en la orden:
                </span>
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="inline-flex items-center gap-1 text-[11px] font-bubble font-bold text-fio-800 hover:text-fio-pink transition-colors self-start sm:self-auto"
                  title="Vuelve a calcular las cantidades sugeridas según el stock actual"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Restablecer sugerencias (Meta - Stock)</span>
                </button>
              </div>

              {/* Tabla Editable */}
              <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/80">
                    <tr className="border-b border-gray-200 text-gray-500 font-semibold uppercase text-[10px]">
                      <th className="py-2.5 px-3">SKU & Ítem</th>
                      <th className="py-2.5 px-2 text-center">Stock</th>
                      <th className="py-2.5 px-2 text-center">Máx</th>
                      <th className="py-2.5 px-3 text-center text-amber-900 font-bold bg-amber-100/60">
                        Cantidad a Pedir (Editable)
                      </th>
                      <th className="py-2.5 px-3 text-right">Costo Est.</th>
                      <th className="py-2.5 px-2 text-center w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orderItems.map((item) => (
                      <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                        <td className="py-2.5 px-3">
                          <span className="font-mono font-bold text-fio-800 text-[11px] bg-fio-50 px-1.5 py-0.5 rounded border border-fio-200">
                            {item.sku}
                          </span>
                          <p className="font-semibold text-gray-800 line-clamp-1 mt-0.5">{item.name}</p>
                        </td>

                        <td className="py-2.5 px-2 text-center">
                          <span className={`font-bold ${item.stock <= 0 ? 'text-red-600 bg-red-50 px-1.5 py-0.5 rounded' : 'text-gray-700'}`}>
                            {item.stock}
                          </span>
                        </td>

                        <td className="py-2.5 px-2 text-center text-gray-400 font-medium">
                          {item.maxStock}
                        </td>

                        {/* Campo Numérico Editable */}
                        <td className="py-2.5 px-3 text-center bg-amber-50/40">
                          <div className="inline-flex items-center gap-1 bg-white p-1 rounded-xl border border-amber-300 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.id, item.orderQty - 1)}
                              disabled={item.orderQty <= 0}
                              className="w-6 h-6 rounded-lg bg-gray-50 hover:bg-amber-100 text-gray-700 hover:text-amber-900 border border-gray-200 flex items-center justify-center font-bold text-xs transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="Restar 1 unidad"
                            >
                              <Minus className="w-3 h-3" />
                            </button>

                            <input
                              type="number"
                              min="0"
                              value={item.orderQty === 0 ? '' : item.orderQty}
                              placeholder="0"
                              onChange={(e) => {
                                const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                                handleQuantityChange(item.id, val);
                              }}
                              className="w-14 text-center font-bubble font-bold text-sm text-fio-900 bg-amber-50/50 rounded-lg py-0.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-fio-500"
                              title="Escribe directamente la cantidad deseada a pedir"
                            />

                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.id, item.orderQty + 1)}
                              className="w-6 h-6 rounded-lg bg-gray-50 hover:bg-amber-100 text-gray-700 hover:text-amber-900 border border-gray-200 flex items-center justify-center font-bold text-xs transition-all active:scale-95 cursor-pointer"
                              title="Sumar 1 unidad"
                            >
                              <Plus className="w-3 h-3" />
                            </button>

                            <span className="text-[10px] text-gray-400 font-medium px-1 truncate max-w-[60px]" title={item.unit}>
                              {item.unit}
                            </span>
                          </div>
                        </td>

                        <td className="py-2.5 px-3 text-right font-bubble font-bold text-gray-800 whitespace-nowrap">
                          {formatCRC(item.estCost)}
                        </td>

                        {/* Botón para remover de la orden */}
                        <td className="py-2.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setExcludedIds((prev) => new Set([...prev, item.id]));
                            }}
                            className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Quitar este ítem del pedido actual"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Agregar otro producto del catálogo */}
              {availableToAdd.length > 0 && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                  <select
                    value={selectedAddId}
                    onChange={(e) => setSelectedAddId(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-fio-400"
                  >
                    <option value="">+ Agregar otro producto del inventario a este pedido...</option>
                    {availableToAdd.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.sku} — {p.name} (Stock: {p.stock})
                      </option>
                    ))}
                  </select>

                  {selectedAddId && (
                    <button
                      type="button"
                      onClick={() => {
                        setAdditionalProductIds((prev) => [...prev, selectedAddId]);
                        setExcludedIds((prev) => {
                          const next = new Set(prev);
                          next.delete(selectedAddId);
                          return next;
                        });
                        setCustomQuantities((prev) => ({
                          ...prev,
                          [selectedAddId]: prev[selectedAddId] || 5,
                        }));
                        setSelectedAddId('');
                      }}
                      className="px-4 py-2 rounded-xl bg-fio-800 hover:bg-fio-900 text-white font-bubble text-xs font-bold transition-all shadow-xs active:scale-95 shrink-0"
                    >
                      + Añadir al Pedido
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer con Resumen y Acciones */}
        {orderItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-fio-200 bg-gray-50/80 shrink-0 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-fio-200/80 shadow-2xs">
              <div>
                <p className="text-xs text-gray-600 font-medium">
                  Total de productos en orden: <strong>{orderItems.length}</strong>
                </p>
                <p className="text-xs text-gray-600 font-medium">
                  Unidades totales a solicitar: <strong className="text-fio-800 font-bubble text-sm">{totalReplenishUnits}</strong>
                </p>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">
                  Inversión Total Estimada:
                </span>
                <p className="text-xl sm:text-2xl font-bubble font-bold text-fio-900 leading-tight">
                  {formatCRC(totalReplenishCost)}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-end">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-300 text-gray-700 hover:bg-white font-bubble text-xs font-semibold shadow-2xs transition-all active:scale-95"
              >
                <Printer className="w-4 h-4 text-gray-500" />
                <span>Imprimir Orden</span>
              </button>

              <a
                href={getWhatsAppLink('64004640', generateWhatsAppMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bubble text-xs font-bold shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar Orden por WhatsApp a Proveedor</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
