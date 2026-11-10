import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, SupplierOrder, SupplierOrderItem, AgendaPriority } from '../../types';
import { formatCRC, getWhatsAppLink } from '../../utils/formatters';
import {
  Truck, ArrowLeft, Plus, Minus, Trash2, Search, Printer,
  MessageCircle, Calendar, Clock, CheckCircle2, RefreshCw,
  FileText, AlertTriangle, Eye, Edit3, X, HelpCircle, Package, UserCheck, ShieldAlert
} from 'lucide-react';

interface CreateSupplierOrderPageProps {
  onBackToSuppliers: () => void;
  onBackToInventory: () => void;
  initialProductId?: string;
}

const DEFAULT_SUPPLIERS = [
  'Papelera Internacional',
  'Sublimaciones CR',
  'Insumos Creativos',
  'Distribuidora FIO',
  'Proveedor Local',
];

const CUSTOM_SUPPLIERS_STORAGE_KEY = 'byfio_custom_suppliers_v1';

export const CreateSupplierOrderPage: React.FC<CreateSupplierOrderPageProps> = ({
  onBackToSuppliers,
  onBackToInventory,
  initialProductId,
}) => {
  const { products, addSupplierOrder, addAgendaItem, agendaItems } = useApp();

  // 1. Detección de Proveedores disponibles en el sistema y productos
  const availableSuppliers = useMemo(() => {
    const suppSet = new Set<string>();

    // Agregar proveedores de productos existentes
    products.forEach((p) => {
      if (p.supplier && p.supplier.trim()) {
        suppSet.add(p.supplier.trim());
      }
    });

    // Agregar proveedores predeterminados
    DEFAULT_SUPPLIERS.forEach((s) => suppSet.add(s));

    // Agregar proveedores guardados en localStorage
    try {
      const saved = localStorage.getItem(CUSTOM_SUPPLIERS_STORAGE_KEY);
      if (saved) {
        const list: string[] = JSON.parse(saved);
        list.forEach((s) => {
          if (s && s.trim()) suppSet.add(s.trim());
        });
      }
    } catch {}

    return Array.from(suppSet).sort((a, b) => a.localeCompare(b));
  }, [products]);

  // Contar cuántos productos sin existencias tiene cada proveedor
  const outOfStockCountsBySupplier = useMemo(() => {
    const counts: Record<string, number> = {};
    let noSupplierCount = 0;
    let totalZeroCount = 0;

    products.forEach((p) => {
      if (p.stock <= 0) {
        totalZeroCount++;
        const s = p.supplier ? p.supplier.trim() : '';
        if (s) {
          counts[s] = (counts[s] || 0) + 1;
        } else {
          noSupplierCount++;
        }
      }
    });

    return { counts, noSupplierCount, totalZeroCount };
  }, [products]);

  // 2. Estado del Selector de Proveedor
  // 'ALL' = Todos los agotados
  // 'NO_SUPPLIER' = Sin proveedor / Compra a particular / Sin nombre
  // 'CUSTOM' = Ingresar proveedor nuevo
  // '<Nombre Proveedor>' = Proveedor específico
  const [selectedSupplierMode, setSelectedSupplierMode] = useState<string>('ALL');
  const [customSupplierName, setCustomSupplierName] = useState<string>('');
  const [supplierPhone, setSupplierPhone] = useState<string>('64004640');
  const [orderNotes, setOrderNotes] = useState<string>('');

  // 3. Cantidades personalizadas y productos excluidos
  const [customQuantities, setCustomQuantities] = useState<Record<string, number>>({});
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
  const [additionalProductIds, setAdditionalProductIds] = useState<string[]>(() => {
    return initialProductId ? [initialProductId] : [];
  });

  // Buscador de productos para agregar manualmente
  const [searchAddQuery, setSearchAddQuery] = useState('');
  const [viewMode, setViewMode] = useState<'editor' | 'document'>('editor');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);
  const [isSavedInAgenda, setIsSavedInAgenda] = useState(false);

  // Cuando cambie el selector de proveedor, auto-actualizar el nombre de proveedor
  useEffect(() => {
    if (selectedSupplierMode === 'ALL') {
      setCustomSupplierName('Requisición General de Insumos');
    } else if (selectedSupplierMode === 'NO_SUPPLIER') {
      setCustomSupplierName('Sin Proveedor (Compra Particular / Ocasional)');
      setSupplierPhone('');
    } else if (selectedSupplierMode === 'CUSTOM') {
      setCustomSupplierName('');
    } else {
      setCustomSupplierName(selectedSupplierMode);
    }
  }, [selectedSupplierMode]);

  // 4. Auto-detección: Productos sin existencias filtrados según el proveedor seleccionado
  const detectedItems = useMemo(() => {
    return products.filter((p) => {
      // Si fue agregado manualmente, siempre se incluye
      if (additionalProductIds.includes(p.id)) return true;

      // Solo productos con stock <= 0 (o sin existencias)
      if (p.stock > 0) return false;

      if (selectedSupplierMode === 'ALL') {
        return true;
      }
      if (selectedSupplierMode === 'NO_SUPPLIER') {
        return !p.supplier || !p.supplier.trim();
      }
      if (selectedSupplierMode === 'CUSTOM') {
        return true;
      }
      // Proveedor específico
      return p.supplier && p.supplier.trim().toLowerCase() === selectedSupplierMode.trim().toLowerCase();
    });
  }, [products, selectedSupplierMode, additionalProductIds]);

  // Inicializar cantidades automáticas sugeridas
  useEffect(() => {
    setCustomQuantities((prev) => {
      const next = { ...prev };
      detectedItems.forEach((p) => {
        if (next[p.id] === undefined) {
          next[p.id] = Math.max(1, p.maxStock - p.stock);
        }
      });
      return next;
    });
  }, [detectedItems]);

  const handleQuantityChange = (productId: string, val: number) => {
    const cleanVal = isNaN(val) ? 0 : Math.max(0, Math.floor(val));
    setCustomQuantities((prev) => ({
      ...prev,
      [productId]: cleanVal,
    }));
  };

  const handleResetDefaults = () => {
    const next: Record<string, number> = {};
    detectedItems.forEach((p) => {
      next[p.id] = Math.max(1, p.maxStock - p.stock);
    });
    setCustomQuantities(next);
    setExcludedIds(new Set());
  };

  const handleRemoveItem = (id: string) => {
    setExcludedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleRestoreItem = (id: string) => {
    setExcludedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  // Artículos finales que formarán la orden
  const orderItems = useMemo(() => {
    return detectedItems
      .filter((p) => !excludedIds.has(p.id))
      .map((p) => {
        const defaultQty = Math.max(1, p.maxStock - p.stock);
        const qty = customQuantities[p.id] !== undefined ? customQuantities[p.id] : defaultQty;
        const estCost = Math.max(0, qty) * (p.costPrice || 0);
        return {
          ...p,
          orderQty: qty,
          estCost,
        };
      });
  }, [detectedItems, customQuantities, excludedIds]);

  // Lista de productos para agregar manualmente
  const availableToAdd = useMemo(() => {
    const currentIds = new Set(orderItems.map((i) => i.id));
    if (!searchAddQuery.trim()) return [];
    const q = searchAddQuery.toLowerCase().trim();
    return products
      .filter((p) => !currentIds.has(p.id))
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.shelfLocation || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q) ||
          (p.supplier || '').toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [products, orderItems, searchAddQuery]);

  const handleAddManualProduct = (p: Product) => {
    if (!additionalProductIds.includes(p.id)) {
      setAdditionalProductIds((prev) => [...prev, p.id]);
    }
    setExcludedIds((prev) => {
      const next = new Set(prev);
      next.delete(p.id);
      return next;
    });
    setCustomQuantities((prev) => ({
      ...prev,
      [p.id]: prev[p.id] || Math.max(1, p.maxStock - p.stock),
    }));
    setSearchAddQuery('');
  };

  const totalReplenishUnits = orderItems.reduce((acc, i) => acc + Math.max(0, i.orderQty), 0);
  const totalReplenishCost = orderItems.reduce((acc, i) => acc + i.estCost, 0);

  const orderDocNumber = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(Math.random() * 899 + 100);
    return `OC-${todayStr}-${rand}`;
  }, []);

  const currentDateFormatted = useMemo(() => {
    return new Date().toLocaleDateString('es-CR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }, []);

  // Generar mensaje formal para enviar por WhatsApp
  const generateWhatsAppMessage = () => {
    const suppLabel = customSupplierName.trim() || 'Proveedor / Particular';
    let msg = `*ORDEN DE REPOSICIÓN & COMPRA BY.FIO - ${new Date().toLocaleDateString('es-CR')}*\n`;
    msg += `📄 Referencia: *${orderDocNumber}*\n`;
    msg += `🏪 Destinatario: *${suppLabel}*\n\n`;
    msg += `Hola! Te adjuntamos la lista de artículos y materiales requeridos para el taller:\n\n`;

    const validItems = orderItems.filter((i) => i.orderQty > 0);
    validItems.forEach((i, idx) => {
      msg += `${idx + 1}. *${i.sku}* - ${i.name}\n   👉 Cantidad: *${i.orderQty} ${i.unit || 'uds'}*\n`;
      if (i.costPrice > 0) {
        msg += `   💰 Costo est.: ${formatCRC(i.estCost)}\n`;
      }
    });

    msg += `\n📦 Total unidades: *${totalReplenishUnits}*\n`;
    if (totalReplenishCost > 0) {
      msg += `💵 Total estimado: *${formatCRC(totalReplenishCost)}*\n`;
    }
    if (orderNotes.trim()) {
      msg += `📝 Notas: ${orderNotes.trim()}\n`;
    }
    msg += `\n¡Favor confirmar disponibilidad, fecha de entrega y cotización final! Muchas gracias.`;
    return msg;
  };

  // Guardar en Historial de Pedidos de Proveedores
  const handleSaveOrder = (status: 'draft' | 'ordered') => {
    if (orderItems.length === 0) {
      alert('Debes incluir al menos un producto en el pedido.');
      return;
    }

    const finalSupplierName = customSupplierName.trim() || 'Sin Proveedor (Compra General)';

    addSupplierOrder({
      orderNumber: orderDocNumber,
      supplierName: finalSupplierName,
      supplierPhone: supplierPhone.trim() || undefined,
      status,
      items: orderItems.map((it) => ({
        productId: it.id,
        sku: it.sku,
        name: it.name,
        category: it.category,
        currentStock: it.stock,
        minStock: it.minStock,
        orderQty: it.orderQty,
        cost: it.costPrice || 0,
        subtotal: it.estCost || 0,
        shelfLocation: it.shelfLocation,
      })),
      totalUnits: totalReplenishUnits,
      totalCost: totalReplenishCost,
      notes: orderNotes.trim() || undefined,
    });

    setSavedSuccessMsg(
      status === 'draft'
        ? `¡Pedido ${orderDocNumber} guardado como borrador ("Por Pedir")!`
        : `¡Pedido ${orderDocNumber} registrado como "Realizado / Ordenado"!`
    );

    setTimeout(() => {
      onBackToSuppliers();
    }, 1800);
  };

  // Guardar recordatorio en Agenda
  const handleSaveToAgenda = () => {
    if (orderItems.length === 0 || isSavedInAgenda) return;

    const suppLabel = customSupplierName.trim() || 'Compra de Insumos';
    const itemsSummary = orderItems
      .map((it) => `${it.name} (${it.orderQty} uds)`)
      .slice(0, 3)
      .join(', ');
    const moreCount = orderItems.length > 3 ? ` y ${orderItems.length - 3} más` : '';

    addAgendaItem({
      title: `Seguimiento de Pedido (${orderDocNumber}): ${suppLabel}`,
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      category: 'proveedor',
      priority: 'alta',
      status: 'pending',
      notes: `Requisición de ${orderItems.length} artículos: ${itemsSummary}${moreCount}. Inversión est: ${formatCRC(totalReplenishCost)}. Ref: ${orderDocNumber}`,
    });

    setIsSavedInAgenda(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-5 pb-16 animate-fadeIn">
      {/* Notificación Toast de Guardado */}
      {savedSuccessMsg && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-bubble font-bold text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <span>{savedSuccessMsg}</span>
        </div>
      )}

      {/* Barra de Navegación Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onBackToInventory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bubble font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
            title="Volver a la tabla de inventario"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-fio-pink" />
            <span>← Inventario</span>
          </button>

          <button
            type="button"
            onClick={onBackToSuppliers}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-purple-50 text-fio-purple border border-purple-200 text-xs font-bubble font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
            title="Volver al historial de pedidos a proveedores"
          >
            <Truck className="w-3.5 h-3.5 text-fio-pink" />
            <span>Historial Proveedores</span>
          </button>
        </div>

        {/* Selector de Modo: Editor vs Documento Oficial */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('editor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bubble font-bold transition-all cursor-pointer ${
              viewMode === 'editor'
                ? 'bg-white text-fio-purple shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-fio-pink" />
            <span>Modo Edición</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('document')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bubble font-bold transition-all cursor-pointer ${
              viewMode === 'document'
                ? 'bg-white text-fio-purple shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-purple-600" />
            <span>Vista Oficial (PDF)</span>
          </button>
        </div>
      </div>

      {/* Tarjeta de Título e Información */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-pink-500/15 border-2 border-amber-300/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold tracking-wider uppercase shadow-2xs">
                Página de Requisición
              </span>
              <h1 className="font-bubble font-black text-xl sm:text-2xl text-slate-900">
                Realizar Pedido &amp; Requisición a Proveedor
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Elige el proveedor de la lista desplegable y el sistema detectará automáticamente qué productos están sin existencias. También puedes generar pedidos generales o para compras a particulares sin nombre de proveedor.
            </p>
          </div>

          {/* Estadísticas de Artículos sin existencias */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="px-3.5 py-2 rounded-2xl bg-white border border-amber-200 shadow-2xs text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Agotados</span>
              <span className="font-bubble font-black text-base text-rose-600">
                {outOfStockCountsBySupplier.totalZeroCount} productos
              </span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-white border border-purple-200 shadow-2xs text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">En este Pedido</span>
              <span className="font-bubble font-black text-base text-fio-purple">
                {totalReplenishUnits} unidades
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* VISTA 1: MODO EDITOR INTERACTIVO */}
      {viewMode === 'editor' ? (
        <div className="space-y-6">
          {/* SECTOR 1: SELECTOR INTELIGENTE DE PROVEEDORES */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-purple-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-fio-purple flex items-center justify-center font-bold">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-800">
                    Selector de Proveedor &amp; Detección Automática de Faltantes
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Selecciona un proveedor para que el sistema jale automáticamente sus productos sin stock.
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-purple-50 text-fio-purple border border-purple-200">
                Ref: {orderDocNumber}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Selector Principal de Proveedor */}
              <div className="md:col-span-5 space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Elegir Proveedor de la Lista:
                </label>
                <div className="relative">
                  <select
                    value={selectedSupplierMode}
                    onChange={(e) => setSelectedSupplierMode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-purple-300 bg-purple-50/50 text-slate-800 text-xs sm:text-sm font-bubble font-bold focus:ring-2 focus:ring-fio-400 focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">
                      📦 Todos los productos sin existencias ({outOfStockCountsBySupplier.totalZeroCount} agotados)
                    </option>

                    <optgroup label="── Proveedores con Artículos Faltantes ──">
                      {availableSuppliers.map((supp) => {
                        const count = outOfStockCountsBySupplier.counts[supp] || 0;
                        return (
                          <option key={supp} value={supp}>
                            🏪 {supp} ({count} {count === 1 ? 'agotado' : 'agotados'})
                          </option>
                        );
                      })}
                    </optgroup>

                    <optgroup label="── Compras Especiales / Particulares ──">
                      <option value="NO_SUPPLIER">
                        👤 Sin Proveedor / Compra Particular / Sin Nombre ({outOfStockCountsBySupplier.noSupplierCount} sin proveedor)
                      </option>
                      <option value="CUSTOM">
                        ✏️ Otro Proveedor (Escribir nombre personalizado...)
                      </option>
                    </optgroup>
                  </select>
                </div>
                <p className="text-[10px] text-slate-400">
                  Al cambiar de proveedor, la lista inferior se actualiza de inmediato con sus productos agotados.
                </p>
              </div>

              {/* Nombre Final del Proveedor / Destinatario */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Nombre a Guardar en el Pedido:
                </label>
                <input
                  type="text"
                  value={customSupplierName}
                  onChange={(e) => setCustomSupplierName(e.target.value)}
                  placeholder="Ej: Papelera Internacional o Compra Particular"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans focus:ring-2 focus:ring-fio-400 focus:outline-none bg-white"
                />
                <p className="text-[10px] text-slate-400">
                  Puedes editarlo libremente o dejarlo en blanco si es una compra sin proveedor formal.
                </p>
              </div>

              {/* Teléfono / WhatsApp de Contacto */}
              <div className="md:col-span-3 space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  WhatsApp / Teléfono:
                </label>
                <input
                  type="tel"
                  value={supplierPhone}
                  onChange={(e) => setSupplierPhone(e.target.value)}
                  placeholder="Ej: 64004640"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans focus:ring-2 focus:ring-fio-400 focus:outline-none bg-white"
                />
                <p className="text-[10px] text-slate-400">
                  Para enviar la orden directamente por WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* SECTOR 2: LISTA DE ARTÍCULOS DETECTADOS Y EDITABLES */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <h3 className="font-bubble font-bold text-base text-slate-800 flex items-center gap-2">
                  <Package className="w-4 h-4 text-fio-pink" />
                  <span>Artículos a Reabastecer ({orderItems.length})</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Productos jalados automáticamente. Puedes modificar las cantidades deseadas o añadir otros productos.
                </p>
              </div>

              {/* Botón para restablecer sugerencias */}
              <button
                type="button"
                onClick={handleResetDefaults}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-fio-pink transition-colors font-bubble cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restablecer sugeridos</span>
              </button>
            </div>

            {/* Buscador Rápido para Añadir Productos Manualmente */}
            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchAddQuery}
                    onChange={(e) => setSearchAddQuery(e.target.value)}
                    placeholder="¿Deseas agregar más productos? Busca por nombre, SKU, ubicación o categoría..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-fio-400 focus:outline-none bg-slate-50/70"
                  />
                </div>
                {searchAddQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchAddQuery('')}
                    className="px-2.5 py-2 text-xs text-slate-400 hover:text-slate-700"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* Resultados de Búsqueda Rápida */}
              {availableToAdd.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-purple-200 rounded-2xl shadow-xl z-30 p-2 space-y-1 animate-in zoom-in-95 duration-150">
                  <span className="text-[10px] font-bold uppercase text-slate-400 px-2">
                    Toca un producto para sumarlo a la orden:
                  </span>
                  {availableToAdd.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleAddManualProduct(p)}
                      className="w-full text-left p-2 rounded-xl hover:bg-purple-50 text-slate-800 flex items-center justify-between text-xs transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono font-bold text-fio-purple">{p.sku}</span>
                        <span className="truncate">{p.name}</span>
                        <span className="text-[10px] text-slate-400">({p.shelfLocation})</span>
                        {p.supplier && (
                          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[9px] font-bold">
                            {p.supplier}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-slate-500">Stock: {p.stock}/{p.maxStock}</span>
                        <Plus className="w-3.5 h-3.5 text-fio-pink group-hover:scale-125 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Lista / Tabla de Artículos a Pedir */}
            {orderItems.length === 0 ? (
              <div className="p-8 sm:p-12 text-center bg-slate-50/70 rounded-3xl border border-slate-200 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bubble font-bold text-base text-slate-800">
                    No hay productos sin existencias para este filtro
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {selectedSupplierMode === 'ALL'
                      ? 'Todos los productos tienen existencias actualmente.'
                      : `Este proveedor no tiene artículos en stock 0. Puedes cambiar de proveedor o usar el buscador superior para agregar productos.`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-bold uppercase text-slate-500">
                  <div className="col-span-5">Producto / SKU / Ubicación</div>
                  <div className="col-span-2 text-center">Proveedor</div>
                  <div className="col-span-2 text-center">Stock Actual</div>
                  <div className="col-span-2 text-center">Pedir (Uds)</div>
                  <div className="col-span-1 text-right">Quitar</div>
                </div>

                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-purple-300 transition-all flex flex-col md:grid md:grid-cols-12 gap-3 items-start md:items-center"
                  >
                    {/* Nombre y SKU */}
                    <div className="md:col-span-5 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-fio-purple bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">
                          {item.sku}
                        </span>
                        <h4 className="font-bubble font-bold text-xs sm:text-sm text-slate-900 truncate" title={item.name}>
                          {item.name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span>📍 {item.shelfLocation}</span>
                      </div>
                    </div>

                    {/* Proveedor Asignado */}
                    <div className="md:col-span-2 text-left md:text-center w-full md:w-auto">
                      {item.supplier ? (
                        <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold truncate max-w-[150px]">
                          {item.supplier}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Sin proveedor</span>
                      )}
                    </div>

                    {/* Stock Actual vs Máximo */}
                    <div className="md:col-span-2 text-left md:text-center w-full md:w-auto">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                        <span>{item.stock}</span>
                        <span className="text-slate-400 font-normal">/ {item.maxStock} max</span>
                      </div>
                    </div>

                    {/* Controles de Cantidad */}
                    <div className="md:col-span-2 flex items-center justify-center gap-1.5 w-full md:w-auto">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.id, Math.max(0, item.orderQty - 1))}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold transition-colors cursor-pointer"
                        title="Restar 1"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <input
                        type="number"
                        min="0"
                        value={item.orderQty}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                        className="w-16 px-2 py-1 rounded-lg border border-slate-300 text-center text-xs font-mono font-bold focus:ring-2 focus:ring-fio-400 focus:outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.id, item.orderQty + 1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold transition-colors cursor-pointer"
                        title="Sumar 1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Quitar artículo */}
                    <div className="md:col-span-1 text-right w-full md:w-auto flex md:justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Quitar este artículo de la orden"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Artículos Excluidos (con opción de restaurar) */}
            {excludedIds.size > 0 && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <span className="text-[11px] font-bold text-slate-500">
                  Artículos omitidos ({excludedIds.size}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from(excludedIds).map((id) => {
                    const prod = products.find((p) => p.id === id);
                    if (!prod) return null;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handleRestoreItem(id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-fio-pink text-[11px] font-bubble transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Restaurar {prod.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Notas del Pedido */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Notas adicionales / Instrucciones para el pedido:
              </label>
              <textarea
                rows={2}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Ej: Pedir que sea entregado antes del miércoles, verificar si hay descuento por volumen..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-fio-400 focus:outline-none bg-slate-50/50"
              />
            </div>
          </div>

          {/* BARRA INFERIOR DE TOTALES Y BOTONES DE ACCIÓN */}
          <div className="sticky bottom-4 z-20 p-4 sm:p-5 rounded-3xl bg-slate-900/95 backdrop-blur-md text-white shadow-2xl border border-slate-700 flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-6 w-full lg:w-auto justify-between lg:justify-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Unidades:</span>
                <span className="font-bubble font-black text-xl sm:text-2xl text-amber-400">
                  {totalReplenishUnits} uds
                </span>
              </div>

              {totalReplenishCost > 0 && (
                <div className="border-l border-slate-700 pl-4 sm:pl-6">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Inversión Estimada:</span>
                  <span className="font-bubble font-black text-xl sm:text-2xl text-fio-pink">
                    {formatCRC(totalReplenishCost)}
                  </span>
                </div>
              )}
            </div>

            {/* Botones de Acción */}
            <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-end">
              {/* Enviar WhatsApp */}
              <a
                href={getWhatsAppLink(supplierPhone || '64004640', generateWhatsAppMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bubble text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer text-center"
                title="Abrir WhatsApp con la orden formateada"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              {/* Guardar en Agenda */}
              <button
                type="button"
                onClick={handleSaveToAgenda}
                disabled={isSavedInAgenda}
                className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bubble font-bold transition-all active:scale-95 cursor-pointer ${
                  isSavedInAgenda
                    ? 'bg-purple-950 text-purple-300 border border-purple-800'
                    : 'bg-purple-700 hover:bg-purple-800 text-white shadow-md'
                }`}
                title="Agendar seguimiento en la Agenda ByFio"
              >
                <Calendar className="w-4 h-4 text-fio-yellow" />
                <span>{isSavedInAgenda ? '✓ En Agenda' : 'Agendar'}</span>
              </button>

              {/* Guardar como Borrador */}
              <button
                type="button"
                onClick={() => handleSaveOrder('draft')}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bubble text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                title="Guardar como borrador para pedir después"
              >
                <Clock className="w-4 h-4" />
                <span>Guardar Borrador</span>
              </button>

              {/* Registrar como Realizado */}
              <button
                type="button"
                onClick={() => handleSaveOrder('ordered')}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-fio-pink to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bubble text-xs font-bold shadow-clayBtn transition-all active:scale-95 cursor-pointer"
                title="Registrar que ya se le pidió al proveedor"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Registrar Pedido</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* VISTA 2: DOCUMENTO OFICIAL PARA IMPRESIÓN Y PDF */
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs text-slate-500">
              Vista previa del documento oficial de Orden de Compra para imprimir en papel o guardar como PDF.
            </span>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-fio-pink text-white font-bubble text-xs font-bold shadow-clayBtn transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar PDF</span>
            </button>
          </div>

          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-300 shadow-xl max-w-4xl mx-auto text-slate-900 space-y-6 print:border-none print:shadow-none print:p-0">
            {/* Encabezado del Documento */}
            <div className="flex items-start justify-between pb-6 border-b-2 border-slate-800 gap-4">
              <div>
                <h2 className="font-bubble font-black text-2xl text-slate-900 tracking-tight">
                  by.fio
                </h2>
                <p className="text-xs text-slate-600 font-sans">
                  Talleres Creativos &amp; Papelería Artesanal
                </p>
                <p className="text-[11px] text-slate-500">
                  Tibás, San José, Costa Rica • WhatsApp: (+506) 6400-4640
                </p>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1 rounded-xl bg-slate-100 text-slate-900 text-xs font-mono font-bold border border-slate-300">
                  {orderDocNumber}
                </span>
                <p className="text-xs text-slate-500 mt-1">Fecha: {currentDateFormatted}</p>
                <p className="text-[11px] font-bold text-purple-700 uppercase mt-0.5">Orden de Compra &amp; Reposición</p>
              </div>
            </div>

            {/* Datos del Proveedor y Destino */}
            <div className="grid grid-cols-2 gap-4 text-xs p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-500 uppercase text-[10px] block">Proveedor / Destinatario:</span>
                <p className="font-bubble font-bold text-sm text-slate-900 mt-0.5">
                  {customSupplierName || 'Compra Ocasional / Sin Proveedor'}
                </p>
                {supplierPhone && (
                  <p className="text-slate-600 mt-0.5">Teléfono: {supplierPhone}</p>
                )}
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase text-[10px] block">Lugar de Recepción:</span>
                <p className="font-bubble font-bold text-sm text-slate-900 mt-0.5">
                  Estudio by.fio • Tibás Central
                </p>
                <p className="text-slate-600 mt-0.5">Contacto: Fiorella (by.fio)</p>
              </div>
            </div>

            {/* Tabla de Artículos */}
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-800 text-[10px] uppercase font-bold text-slate-600">
                  <th className="py-2 text-left">SKU</th>
                  <th className="py-2 text-left">Descripción del Artículo</th>
                  <th className="py-2 text-center">Ubicación</th>
                  <th className="py-2 text-center">Cantidad</th>
                  <th className="py-2 text-right">Costo Unit.</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orderItems.map((item, idx) => (
                  <tr key={item.id} className="py-2">
                    <td className="py-2 font-mono font-bold text-slate-700">{item.sku}</td>
                    <td className="py-2 font-sans font-medium text-slate-900">{item.name}</td>
                    <td className="py-2 text-center text-slate-500">{item.shelfLocation}</td>
                    <td className="py-2 text-center font-bold font-mono text-slate-900">{item.orderQty} {item.unit || 'uds'}</td>
                    <td className="py-2 text-right font-mono text-slate-600">{formatCRC(item.costPrice || 0)}</td>
                    <td className="py-2 text-right font-mono font-bold text-slate-900">{formatCRC(item.estCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totales y Resumen */}
            <div className="flex justify-between items-start pt-4 border-t-2 border-slate-800 text-xs">
              <div className="max-w-md">
                {orderNotes ? (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
                    <span className="font-bold text-[10px] uppercase block">Notas del Pedido:</span>
                    <p className="mt-0.5">{orderNotes}</p>
                  </div>
                ) : (
                  <p className="text-slate-400 italic">Sin observaciones adicionales.</p>
                )}
              </div>

              <div className="text-right space-y-1">
                <div className="text-slate-600">
                  <span>Total Unidades: </span>
                  <span className="font-mono font-bold text-slate-900">{totalReplenishUnits}</span>
                </div>
                <div className="text-base font-bubble font-black text-fio-pink pt-1 border-t border-slate-200">
                  <span>Total Inversión: </span>
                  <span>{formatCRC(totalReplenishCost)}</span>
                </div>
              </div>
            </div>

            {/* Firmas de Autorización */}
            <div className="grid grid-cols-2 gap-8 pt-12 border-t border-dashed border-slate-300 text-center text-xs">
              <div className="space-y-1">
                <div className="w-48 border-b border-slate-400 mx-auto mb-1" />
                <p className="font-bold text-slate-800">Solicitado por: by.fio</p>
                <p className="text-[10px] text-slate-400">Administración de Inventario</p>
              </div>

              <div className="space-y-1">
                <div className="w-48 border-b border-slate-400 mx-auto mb-1" />
                <p className="font-bold text-slate-800">Recibido por Proveedor / Repartidor</p>
                <p className="text-[10px] text-slate-400">Fecha y Firma de Aceptación</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
