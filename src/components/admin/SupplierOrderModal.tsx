import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCRC, getWhatsAppLink } from '../../utils/formatters';
import {
  X, Printer, MessageCircle, AlertTriangle, CheckCircle,
  Plus, Minus, Trash2, RefreshCw, FileText, Edit3, Eye
} from 'lucide-react';

export const SupplierOrderModal: React.FC = () => {
  const { isSupplierModalOpen, setIsSupplierModalOpen, products } = useApp();
  const [customQuantities, setCustomQuantities] = useState<Record<string, number>>({});
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
  const [additionalProductIds, setAdditionalProductIds] = useState<string[]>([]);
  const [selectedAddId, setSelectedAddId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'editor' | 'document'>('editor');

  // Activar clase de control en body para impresión de documento formal de hoja completa
  useEffect(() => {
    if (isSupplierModalOpen) {
      document.body.classList.add('supplier-order-open');
    } else {
      document.body.classList.remove('supplier-order-open');
    }
    return () => {
      document.body.classList.remove('supplier-order-open');
    };
  }, [isSupplierModalOpen]);

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

  const orderDocNumber = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `OC-${todayStr}-${orderItems.length}`;
  }, [orderItems.length]);

  const currentDateFormatted = useMemo(() => {
    return new Date().toLocaleDateString('es-CR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }, []);

  const handlePrint = () => {
    document.body.classList.add('supplier-order-open');
    setTimeout(() => {
      window.print();
    }, 50);
  };

  return (
    <div className="supplier-order-modal-overlay fixed inset-0 z-[80] overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-2 sm:p-5 animate-fadeIn">
      <div className="supplier-order-modal-card relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Barra Superior de Control en Pantalla (Oculta al Imprimir) */}
        <div className="supplier-header-bar no-print p-4 sm:p-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8FAFC] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bubble font-bold text-base sm:text-lg text-slate-900 leading-tight">
                Orden de Compra &amp; Requisición de Inventario
              </h3>
              <p className="text-[11px] text-slate-500 font-sans">
                Formato formal de documento con cantidades ajustadas para reposición
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Selector de Modo: Editor vs Documento Formal */}
            <div className="inline-flex p-1 rounded-2xl bg-slate-200/70 border border-slate-300/70">
              <button
                type="button"
                onClick={() => setViewMode('editor')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'editor'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Modificar Cantidades</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('document')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'document'
                    ? 'bg-purple-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-purple-800'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Vista Documento Formal</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bubble font-bold text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
              title="Imprime o guarda en PDF el documento formal con líneas nítidas"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSupplierModalOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {orderItems.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <CheckCircle className="w-12 h-12 mx-auto text-emerald-500" />
              <p className="font-bubble text-base text-slate-800">No hay productos en esta lista de pedido</p>
              <p className="text-xs text-slate-400">Puedes agregar cualquier producto del inventario abajo.</p>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bubble font-bold transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restaurar sugerencias automáticas</span>
              </button>
            </div>
          ) : (
            <>
              {/* VISTA 1: EDITOR INTERACTIVO DE CANTIDADES (Oculto en Impresión) */}
              <div className={`${viewMode === 'editor' ? 'block' : 'hidden'} print:hidden space-y-4`}>
                {/* Barra de Controles Superiores */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 font-medium">
                      {orderItems.length} producto{orderItems.length !== 1 ? 's' : ''} en la orden:
                    </span>
                    <span className="text-[11px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md font-semibold">
                      {totalReplenishUnits} unidades totales
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="inline-flex items-center gap-1 text-[11px] font-bubble font-bold text-purple-800 hover:text-purple-950 transition-colors self-start sm:self-auto"
                    title="Vuelve a calcular las cantidades sugeridas según el stock actual"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Restablecer sugerencias (Meta - Stock)</span>
                  </button>
                </div>

                {/* Tabla Editable */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                        <th className="py-2.5 px-3">SKU &amp; Ítem</th>
                        <th className="py-2.5 px-2 text-center">Stock</th>
                        <th className="py-2.5 px-2 text-center">Máx</th>
                        <th className="py-2.5 px-3 text-center text-purple-950 font-bold bg-purple-50">
                          Cantidad a Pedir (Editable)
                        </th>
                        <th className="py-2.5 px-3 text-right">Costo Est.</th>
                        <th className="py-2.5 px-2 text-center w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orderItems.map((item) => (
                        <tr key={item.id} className="hover:bg-purple-50/30 transition-colors">
                          <td className="py-2.5 px-3">
                            <span className="font-mono font-bold text-purple-800 text-[11px] bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                              {item.sku}
                            </span>
                            <p className="font-semibold text-slate-800 line-clamp-1 mt-0.5">{item.name}</p>
                          </td>

                          <td className="py-2.5 px-2 text-center">
                            <span className={`font-bold ${item.stock <= 0 ? 'text-red-600 bg-red-50 px-1.5 py-0.5 rounded' : 'text-slate-700'}`}>
                              {item.stock}
                            </span>
                          </td>

                          <td className="py-2.5 px-2 text-center text-slate-400 font-medium">
                            {item.maxStock}
                          </td>

                          {/* Campo Numérico Editable */}
                          <td className="py-2.5 px-3 text-center bg-purple-50/40">
                            <div className="inline-flex items-center gap-1 bg-white p-1 rounded-xl border border-purple-300 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.id, item.orderQty - 1)}
                                disabled={item.orderQty <= 0}
                                className="w-6 h-6 rounded-lg bg-slate-50 hover:bg-purple-100 text-slate-700 hover:text-purple-900 border border-slate-200 flex items-center justify-center font-bold text-xs transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
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
                                className="w-14 text-center font-bubble font-bold text-sm text-purple-900 bg-purple-50/50 rounded-lg py-0.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                title="Escribe directamente la cantidad deseada a pedir"
                              />

                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.id, item.orderQty + 1)}
                                className="w-6 h-6 rounded-lg bg-slate-50 hover:bg-purple-100 text-slate-700 hover:text-purple-900 border border-slate-200 flex items-center justify-center font-bold text-xs transition-all active:scale-95 cursor-pointer"
                                title="Sumar 1 unidad"
                              >
                                <Plus className="w-3 h-3" />
                              </button>

                              <span className="text-[10px] text-slate-400 font-medium px-1 truncate max-w-[60px]" title={item.unit}>
                                {item.unit}
                              </span>
                            </div>
                          </td>

                          <td className="py-2.5 px-3 text-right font-bubble font-bold text-slate-800 whitespace-nowrap">
                            {formatCRC(item.estCost)}
                          </td>

                          {/* Botón para remover de la orden */}
                          <td className="py-2.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setExcludedIds((prev) => new Set([...prev, item.id]));
                              }}
                              className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
                      className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-400"
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
                        className="px-4 py-2 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bubble text-xs font-bold transition-all shadow-xs active:scale-95 shrink-0"
                      >
                        + Añadir al Pedido
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* VISTA 2: FORMATO DE DOCUMENTO FORMAL (Siempre activo al imprimir con @media print) */}
              <div
                id="printable-supplier-order"
                className={`${viewMode === 'document' ? 'block' : 'hidden print:block'} bg-white space-y-5 rounded-2xl p-2 sm:p-6 border border-slate-200 print:border-none print:p-0 print:space-y-4`}
              >
                {/* CABECERA OFICIAL CON COLOR DE LA MARCA */}
                <div className="print-brand-header bg-gradient-to-r from-[#581C87] via-[#6B21A8] to-[#7E22CE] text-white p-5 sm:p-6 rounded-2xl relative overflow-hidden shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bubble font-bold text-3xl sm:text-4xl text-white tracking-tight drop-shadow-sm">
                          by.fio
                        </span>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] inline-block shadow-sm" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-purple-100 bg-white/15 px-2 py-0.5 rounded-md border border-white/20">
                          Costa Rica 🇨🇷
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-purple-100 font-medium">
                        Talleres Creativos &amp; Tienda de Papelería Personalizada
                      </p>
                      <div className="text-[11px] text-purple-200/95 space-y-0.5 pt-1 font-sans">
                        <p className="flex items-center gap-1.5">
                          <span>📍 200 sur del parque de Tibás, San José, Costa Rica (MAYO10 / by.fio)</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <span>📞 WhatsApp Oficial: +506 6400-4640 • Tienda Web: byfiocr.pages.dev</span>
                        </p>
                      </div>
                    </div>

                    {/* Recuadro de Requisición Oficial de Alta Visibilidad */}
                    <div className="print-contrast-box bg-white text-slate-900 rounded-xl p-3 sm:p-4 border-2 border-slate-900 shadow-md text-left sm:text-right shrink-0 min-w-[220px]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 bg-purple-100 border border-purple-200 px-2 py-0.5 rounded inline-block mb-1">
                        ORDEN DE COMPRA &amp; REPOSICIÓN
                      </span>
                      <div className="font-mono font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
                        {orderDocNumber}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 font-sans">
                        <strong className="text-slate-800">Fecha de Emisión:</strong> {currentDateFormatted}
                      </p>
                      <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        <span>REQUISICIÓN OFICIAL 📋</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECCIÓN DE DATOS DEL EMISOR Y DESTINO DE DESPACHO */}
                <div className="print-section-box grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border-2 border-slate-400 bg-slate-50/70 text-xs text-slate-800">
                  <div className="space-y-1 sm:border-r sm:border-slate-300 sm:pr-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block pb-0.5 border-b border-slate-300">
                      Datos del Solicitante / Empresa
                    </span>
                    <p className="font-bold text-sm text-slate-900 pt-1">by.fio — Fiorella Jara</p>
                    <p className="text-slate-700">
                      <strong className="text-slate-800">Departamento:</strong> Compras, Taller &amp; Inventarios
                    </p>
                    <p className="text-slate-700">
                      <strong className="text-slate-800">Teléfono / WhatsApp:</strong> +506 6400-4640
                    </p>
                    <p className="text-slate-500 text-[11px]">Ubicación: Tibás, San José, Costa Rica</p>
                  </div>

                  <div className="space-y-1 sm:pl-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block pb-0.5 border-b border-slate-300">
                      Instrucciones de Despacho y Entrega
                    </span>
                    <p className="font-bold text-slate-900 pt-1">
                      📦 Entrega en Taller Central Tibás
                    </p>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      <strong className="text-slate-800">Dirección:</strong> 200 sur del parque de Tibás, San José (MAYO10 / by.fio)
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      <strong className="text-slate-800">Observación:</strong> Favor adjuntar factura electrónica y desglosar por SKU.
                    </p>
                  </div>
                </div>

                {/* TABLA DE ARTÍCULOS CON TODAS LAS LÍNEAS VISIBLES Y DEFINIDAS (print-table) */}
                <div className="overflow-x-auto print-avoid-break">
                  <table className="print-table w-full text-left text-xs border-collapse border-2 border-slate-400">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 text-[10px] font-bold uppercase">
                        <th className="py-2.5 px-3 border border-slate-400 text-center w-10">#</th>
                        <th className="py-2.5 px-3 border border-slate-400 text-center w-28">Código / SKU</th>
                        <th className="py-2.5 px-3 border border-slate-400">Descripción del Artículo / Material</th>
                        <th className="py-2.5 px-2 border border-slate-400 text-center w-20">Unidad</th>
                        <th className="py-2.5 px-2 border border-slate-400 text-center w-16">Stock Act.</th>
                        <th className="py-2.5 px-3 border border-slate-400 text-center w-28 bg-amber-50">CANTIDAD A PEDIR</th>
                        <th className="py-2.5 px-3 border border-slate-400 text-right w-24">Costo Unit. Est.</th>
                        <th className="py-2.5 px-3 border border-slate-400 text-right w-28">Subtotal Est.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item, idx) => (
                        <tr key={item.id} className="border-b border-slate-300">
                          <td className="py-2 px-2.5 border border-slate-300 text-center font-mono font-semibold text-slate-600">
                            {idx + 1}
                          </td>
                          <td className="py-2 px-2.5 border border-slate-300 text-center font-mono font-bold text-slate-900 bg-slate-50/50">
                            {item.sku}
                          </td>
                          <td className="py-2 px-3 border border-slate-300 font-medium text-slate-800">
                            <span className="font-semibold text-slate-900">{item.name}</span>
                            {item.category && (
                              <span className="block text-[10px] text-slate-500 font-sans mt-0.5">
                                Categoría: {item.category}
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-2 border border-slate-300 text-center text-slate-600 capitalize">
                            {item.unit || 'Unidad'}
                          </td>
                          <td className="py-2 px-2 border border-slate-300 text-center font-mono text-slate-500">
                            {item.stock}
                          </td>
                          <td className="py-2 px-3 border border-slate-400 text-center font-bold text-slate-900 bg-amber-50/80 text-sm">
                            {item.orderQty}
                          </td>
                          <td className="py-2 px-3 border border-slate-300 text-right font-mono text-slate-700">
                            {formatCRC(item.costPrice)}
                          </td>
                          <td className="py-2 px-3 border border-slate-300 text-right font-mono font-bold text-slate-900">
                            {formatCRC(item.estCost)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-400">
                        <td colSpan={5} className="py-2.5 px-3 border border-slate-400 text-right uppercase text-[11px]">
                          Totales de la Requisición:
                        </td>
                        <td className="py-2.5 px-3 border border-slate-400 text-center font-mono text-base font-bold bg-amber-100/70 text-slate-900">
                          {totalReplenishUnits}
                        </td>
                        <td className="py-2.5 px-3 border border-slate-400 text-right text-[10px] uppercase text-slate-600">
                          Inversión Est.:
                        </td>
                        <td className="py-2.5 px-3 border border-slate-400 text-right font-mono text-base font-bold text-purple-950 bg-purple-50">
                          {formatCRC(totalReplenishCost)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* RESUMEN Y NOTAS FORMALES DEL PEDIDO */}
                <div className="print-section-box p-3.5 rounded-xl border border-slate-300 bg-slate-50 text-[11px] text-slate-700 space-y-1.5 print-avoid-break">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                      <strong className="text-slate-900">Total de Líneas / SKUs Requeridos:</strong> {orderItems.length} artículos
                    </div>
                    <div>
                      <strong className="text-slate-900">Total de Unidades Físicas:</strong> {totalReplenishUnits} unidades
                    </div>
                    <div>
                      <strong className="text-slate-900">Presupuesto Estimado:</strong> {formatCRC(totalReplenishCost)}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed pt-1">
                    <strong>Términos &amp; Condiciones:</strong> Esta Orden de Compra constituye una requisición formal de reposición de mercadería para by.fio. Favor suministrar únicamente productos que cumplan estrictamente con las especificaciones y códigos de SKU indicados. En caso de variaciones en precio o agotamiento de existencias, notificar previamente a nuestro WhatsApp oficial (+506 6400-4640).
                  </p>
                </div>

                {/* BLOQUE DE FIRMAS Y AUTORIZACIÓN */}
                <div className="grid grid-cols-2 gap-8 pt-6 pb-2 print-avoid-break">
                  <div className="text-center space-y-1">
                    <div className="border-b-2 border-slate-400 w-3/4 mx-auto mb-2 pt-6" />
                    <p className="font-bold text-xs text-slate-900">Fiorella Jara Vargas</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Aprobado / Dirección by.fio</p>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="border-b-2 border-slate-400 w-3/4 mx-auto mb-2 pt-6" />
                    <p className="font-bold text-xs text-slate-900">Firma &amp; Sello Proveedor</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Recibido y Aceptado (Fecha)</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer con Resumen y Acciones */}
        {orderItems.length > 0 && (
          <div className="supplier-actions-bar no-print p-4 sm:p-5 border-t border-slate-200 bg-slate-50/90 shrink-0 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div>
                <p className="text-xs text-slate-600 font-medium">
                  Total de productos en orden: <strong>{orderItems.length}</strong>
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  Unidades totales a solicitar: <strong className="text-purple-800 font-bubble text-sm">{totalReplenishUnits}</strong>
                </p>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                  Inversión Total Estimada:
                </span>
                <p className="text-xl sm:text-2xl font-bubble font-bold text-slate-900 leading-tight">
                  {formatCRC(totalReplenishCost)}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-end">
              <button
                type="button"
                onClick={() => setViewMode((prev) => (prev === 'editor' ? 'document' : 'editor'))}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-300 text-slate-700 hover:bg-white font-bubble text-xs font-semibold shadow-2xs transition-all active:scale-95"
              >
                {viewMode === 'editor' ? (
                  <>
                    <Eye className="w-4 h-4 text-purple-700" />
                    <span>Ver Formato Documento Formal</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 text-slate-600" />
                    <span>Volver a Modificar Cantidades</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-800 hover:bg-purple-900 text-white font-bubble text-xs font-bold shadow-md transition-all active:scale-95"
              >
                <Printer className="w-4 h-4 text-purple-200" />
                <span>Imprimir / Guardar Documento PDF</span>
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
