import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useConfirm } from '../../context/ConfirmContext';
import { formatCRC } from '../../utils/formatters';
import {
  QrCode, AlertOctagon, Plus, Minus, Search, MapPin,
  PlusCircle, Trash2, Pencil, CheckCircle2, Check, EyeOff, Filter, PackageX, Truck
} from 'lucide-react';

export const InventoryTable: React.FC = () => {
  const {
    products,
    updateProductStock,
    inventoryMode,
    setInventoryMode,
    toggleProductAvailability,
    setQrModalProduct,
    setIsNewProductModalOpen,
    setIsSupplierModalOpen,
    deleteProduct,
    setEditingProduct,
    isFeatureEnabled,
  } = useApp();
  const confirm = useConfirm();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [statusFilter, setStatusFilter] = useState<'all' | 'zero_stock' | 'unavailable' | 'zero_or_unavailable'>('all');

  const isStockModeEnabled = isFeatureEnabled('inventory', 'inventory_stock_mode') !== false;
  const isAvailabilityModeEnabled = isFeatureEnabled('inventory', 'product_availability_mode') !== false || isFeatureEnabled('inventory', 'inventory_availability_mode') !== false;

  React.useEffect(() => {
    if (!isStockModeEnabled && isAvailabilityModeEnabled && inventoryMode === 'stock') {
      setInventoryMode('availability');
    } else if (!isAvailabilityModeEnabled && isStockModeEnabled && inventoryMode === 'availability') {
      setInventoryMode('stock');
    }
  }, [isStockModeEnabled, isAvailabilityModeEnabled, inventoryMode, setInventoryMode]);

  const zeroStockCount = useMemo(() => products.filter((p) => p.stock <= 0).length, [products]);
  const unavailableCount = useMemo(
    () => products.filter((p) => p.isAvailable === false || p.showInStore === false || p.showInCatalog === false).length,
    [products]
  );
  const zeroOrUnavailableCount = useMemo(
    () =>
      products.filter(
        (p) =>
          p.stock <= 0 ||
          p.isAvailable === false ||
          p.showInStore === false ||
          p.showInCatalog === false
      ).length,
    [products]
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return ['Todas', ...Array.from(set)];
  }, [products]);

  const filtered = products.filter((p) => {
    const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shelfLocation.toLowerCase().includes(searchQuery.toLowerCase());

    const isZero = p.stock <= 0;
    const isUnavail = p.isAvailable === false || p.showInStore === false || p.showInCatalog === false;

    let matchesStatus = true;
    if (statusFilter === 'zero_stock') {
      matchesStatus = isZero;
    } else if (statusFilter === 'unavailable') {
      matchesStatus = isUnavail;
    } else if (statusFilter === 'zero_or_unavailable') {
      matchesStatus = isZero || isUnavail;
    }

    return matchesCategory && matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-3xl border border-fio-200 shadow-clay p-5 mb-8">
      {/* Encabezado con Botón Principal para AGREGAR PRODUCTO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 border-b border-fio-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bubble font-bold text-xl text-fio-900">Control de Inventario & Estanterías</h2>
            <span className="text-xs bg-fio-100 text-fio-800 font-bold px-2 py-0.5 rounded-full">
              {products.length} ítems
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Administra existencias, categorías, ubicación física y genera etiquetas QR para picking.
          </p>
        </div>

        {/* BOTÓN PROMINENTE AGREGAR PRODUCTO NUEVO */}
        {isFeatureEnabled('inventory', 'product_crud') && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsNewProductModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-fio-pink hover:bg-pink-600 text-white font-bubble font-bold text-xs sm:text-sm shadow-clayPink transition-all active:scale-95 animate-pulse-subtle"
            >
              <PlusCircle className="w-5 h-5" />
              <span>+ Agregar Producto al Inventario</span>
            </button>
          </div>
        )}
      </div>

{/* Botones de Filtro Rápido por Existencias en Cero y Disponibilidad para Pedidos */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-fio-50/70 rounded-2xl border border-fio-200 mb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-gray-500 uppercase mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-fio-800" />
            <span>Filtro de Estado:</span>
          </span>

          {/* Botón: Todos */}
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-fio-800 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-fio-100 border border-fio-200/80'
            }`}
          >
            Todos ({products.length})
          </button>

          {/* Botón: Existencias en Cero */}
          <button
            type="button"
            onClick={() => setStatusFilter('zero_stock')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all ${
              statusFilter === 'zero_stock'
                ? 'bg-red-600 text-white shadow-sm ring-2 ring-red-300'
                : 'bg-white text-red-600 hover:bg-red-50 border border-red-200'
            }`}
            title="Muestra únicamente los productos con existencias en cero (0)"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Existencias en Cero</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              statusFilter === 'zero_stock' ? 'bg-red-700 text-white' : 'bg-red-100 text-red-700'
            }`}>
              {zeroStockCount}
            </span>
          </button>

          {/* Botón: No Disponibles */}
          <button
            type="button"
            onClick={() => setStatusFilter('unavailable')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all ${
              statusFilter === 'unavailable'
                ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300'
                : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
            }`}
            title="Muestra los productos desactivados o marcados como No Disponibles"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>No Disponibles</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              statusFilter === 'unavailable' ? 'bg-rose-700 text-white' : 'bg-rose-100 text-rose-700'
            }`}>
              {unavailableCount}
            </span>
          </button>

          {/* Botón: En Cero o No Disponibles (Combinado para realizar pedido) */}
          <button
            type="button"
            onClick={() => setStatusFilter('zero_or_unavailable')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all ${
              statusFilter === 'zero_or_unavailable'
                ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-300'
                : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-200'
            }`}
            title="Muestra todos los productos que están no disponibles y los que están en cero"
          >
            <PackageX className="w-3.5 h-3.5" />
            <span>En Cero o No Disponibles</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              statusFilter === 'zero_or_unavailable' ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-800'
            }`}>
              {zeroOrUnavailableCount}
            </span>
          </button>
        </div>

        {/* Botón Realizar Pedido a Proveedor */}
        {isFeatureEnabled('inventory', 'supplier_list') && (
          <button
            type="button"
            onClick={() => setIsSupplierModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-fio-800 border border-purple-300 font-bubble text-xs font-bold transition-all shadow-2xs active:scale-95 shrink-0"
            title="Generar orden de compra y reposición para enviar al proveedor por WhatsApp"
          >
            <Truck className="w-3.5 h-3.5 text-fio-pink" />
            <span>Realizar Pedido a Proveedor</span>
          </button>
        )}
      </div>

      {/* Selector de Categorías & Buscador */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-gray-400 uppercase mr-1">Categorías:</span>
          {categories.map((cat) => {
            const count = cat === 'Todas' ? products.length : products.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-fio-800 text-white shadow-sm'
                    : 'bg-fio-50 text-gray-700 hover:bg-fio-100 border border-fio-200/60'
                }`}
              >
                {cat} <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-64">
          <input
            type="text"
            placeholder="Buscar por SKU, nombre o estante..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-fio-50/70 rounded-2xl border border-fio-200 text-xs focus:ring-2 focus:ring-fio-400 focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-fio-100 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
              <th className="pb-3 px-2">SKU & Producto</th>
              <th className="pb-3 px-2">Categoría</th>
              <th className="pb-3 px-2">Ubicación</th>
              <th className="pb-3 px-2">Precio</th>
              <th className="pb-3 px-2 text-center">Stock Actual</th>
              {inventoryMode === 'stock' ? (
                <>
                  <th className="pb-3 px-2 text-center">Alerta Mín/Máx</th>
                  <th className="pb-3 px-2 text-center">A Reponer</th>
                </>
              ) : (
                <>
                  <th className="pb-3 px-2 text-center">Disponibilidad</th>
                  <th className="pb-3 px-2 text-center">Estado en Tienda / Catálogo</th>
                </>
              )}
              <th className="pb-3 px-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-fio-100">
            {filtered.map((prod) => {
              const isZeroStock = prod.stock <= 0;
              const isCritical = prod.stock <= prod.minStock;
              const suggestedOrder = Math.max(0, prod.maxStock - prod.stock);
              const isAvailable = prod.isAvailable !== false;

              return (
                <tr
                  key={prod.id}
                  className={`transition-colors border-b ${
                    isZeroStock
                      ? 'bg-red-50/90 hover:bg-red-100/90 border-l-4 border-l-red-600 border-red-300'
                      : isCritical
                      ? 'bg-amber-50/40 hover:bg-amber-100/50 border-fio-100'
                      : 'hover:bg-fio-50/40 border-fio-100'
                  }`}
                >
                  <td className="py-3 px-2">
                    <div
                      onClick={() => {
                        setEditingProduct(prod);
                        setIsNewProductModalOpen(true);
                      }}
                      className="flex items-center gap-2 cursor-pointer group"
                      title="Haz clic para editar y modificar este artículo por completo"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className={`w-9 h-9 rounded-xl object-cover shrink-0 transition-all ${
                          isZeroStock ? 'ring-2 ring-red-400' : 'group-hover:ring-2 group-hover:ring-fio-300'
                        }`}
                      />
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`font-mono font-bold text-[11px] px-1.5 py-0.5 rounded ${
                            isZeroStock ? 'bg-red-200 text-red-900 font-black' : 'text-fio-800 bg-fio-100'
                          }`}>
                            {prod.sku}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                            isZeroStock
                              ? 'bg-red-100 text-red-700 border-red-200'
                              : 'bg-purple-100 text-fio-800 border-purple-200'
                          }`}>
                            Stock: {prod.stock} {prod.unit || 'uds'}
                          </span>
                        </div>
                        <p className={`font-semibold line-clamp-1 transition-colors ${
                          isZeroStock ? 'text-red-900 font-bold' : 'text-gray-800 group-hover:text-fio-800'
                        }`}>
                          {prod.name}
                        </p>
                        {isZeroStock && (
                          <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.2 rounded-md bg-red-600 text-white font-bubble font-bold text-[9px] uppercase tracking-wide shadow-2xs">
                            <AlertOctagon className="w-2.5 h-2.5 stroke-[2.5]" />
                            <span>EN CERO • HACER PEDIDO</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-2">
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700 text-[11px] font-semibold block w-fit">
                        {prod.category}
                      </span>
                      <div className="flex items-center gap-1 text-[9px] font-bold">
                        {isZeroStock ? (
                          <span className="px-1.5 py-0.2 rounded bg-red-600 text-white font-bold" title="Agotado: Oculto automáticamente de Tienda y Catálogo">
                            Agotado (Oculto)
                          </span>
                        ) : !isAvailable ? (
                          <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-600 border border-rose-200 font-semibold" title="Oculto de tienda y catálogo">
                            Desactivado
                          </span>
                        ) : (
                          <>
                            {prod.showInStore !== false && (
                              <span className="px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200" title="Visible en Tienda">
                                Tienda
                              </span>
                            )}
                            {prod.showInCatalog !== false && (
                              <span className="px-1.5 py-0.2 rounded bg-pink-50 text-pink-700 border border-pink-200" title="Visible en Catálogo">
                                Catálogo
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-2 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-semibold text-purple-900 bg-purple-50 px-2 py-1 rounded-xl border border-purple-200">
                      <MapPin className="w-3 h-3 text-fio-pink shrink-0" />
                      <span>{prod.shelfLocation}</span>
                    </span>
                  </td>

                  <td className="py-3 px-2 font-bubble font-bold text-gray-800">{formatCRC(prod.price)}</td>

                  {/* Columna Stock Actual (Siempre visible en pantalla principal) */}
                  <td className="py-3 px-2 text-center">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-xl border ${
                      isZeroStock
                        ? 'bg-red-100 border-red-300 ring-2 ring-red-200'
                        : isCritical
                        ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-200'
                        : 'bg-fio-100/60 border-fio-200'
                    }`}>
                      <button
                        type="button"
                        onClick={() => updateProductStock(prod.id, Math.max(0, prod.stock - 1))}
                        className="p-1 text-gray-500 hover:text-red-600 hover:bg-white rounded transition-colors active:scale-90"
                        title="Reducir stock en 1 unidad"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <div className="flex flex-col items-center min-w-[34px] px-0.5">
                        <span className={`font-bubble font-bold text-sm leading-none ${
                          isZeroStock ? 'text-red-700 font-black' : isCritical ? 'text-amber-800' : 'text-gray-900'
                        }`}>
                          {prod.stock}
                        </span>
                        <span className={`text-[9px] font-semibold leading-tight mt-0.5 ${
                          isZeroStock ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {isZeroStock ? 'Agotado' : (prod.unit || 'uds')}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateProductStock(prod.id, prod.stock + 1)}
                        className="p-1 text-gray-500 hover:text-emerald-600 hover:bg-white rounded transition-colors active:scale-90"
                        title="Aumentar stock en 1 unidad"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </td>

                  {inventoryMode === 'stock' ? (
                    <>
                      <td className="py-3 px-2 text-center">
                        {isZeroStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600 text-white font-bold text-[10px] shadow-sm animate-pulse">
                            <AlertOctagon className="w-3 h-3 stroke-[2.5]" />
                            <span>¡EN CERO! Pedir Urgente</span>
                          </span>
                        ) : isCritical ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 font-bold text-[10px] animate-pulse">
                            <AlertOctagon className="w-3 h-3" />
                            <span>¡Reabastecer! (≤{prod.minStock})</span>
                          </span>
                        ) : (
                          <span className="text-gray-500 text-[11px]">{prod.minStock} / {prod.maxStock}</span>
                        )}
                      </td>

                      <td className="py-3 px-2 text-center font-bold">
                        {suggestedOrder > 0 ? (
                          <span className={`px-2 py-0.5 rounded-lg font-bubble ${
                            isZeroStock ? 'bg-red-600 text-white font-black shadow-sm' : 'bg-amber-100 text-amber-800'
                          }`}>
                            +{suggestedOrder}
                          </span>
                        ) : (
                          <span className="text-gray-400">0</span>
                        )}
                      </td>
                    </>
                  ) : (
                    <>
                      {/* Columna Disponibilidad */}
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => toggleProductAvailability(prod.id)}
                          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bubble font-bold text-xs transition-all shadow-sm active:scale-95 border ${
                            isAvailable
                              ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-200'
                              : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-300'
                          }`}
                          title={`Clic para cambiar a ${isAvailable ? 'No disponible' : 'Disponible'}`}
                        >
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              isAvailable ? 'bg-white animate-pulse' : 'bg-rose-500'
                            }`}
                          />
                          <span>{isAvailable ? 'Disponible' : 'No disponible'}</span>
                        </button>
                      </td>

                      {/* Columna Estado en Tienda / Catálogo */}
                      <td className="py-3 px-2 text-center">
                        {isZeroStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-800 border border-red-300 font-bold text-[10px]">
                            <AlertOctagon className="w-3 h-3 text-red-600" />
                            <span>En Cero (Oculto del público)</span>
                          </span>
                        ) : isAvailable ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                            <span>En Tienda, Catálogo y Carrito</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200 font-bold text-[10px]">
                            <EyeOff className="w-3 h-3" />
                            <span>Oculto (no aparece)</span>
                          </span>
                        )}
                      </td>
                    </>
                  )}

                  <td className="py-3 px-2 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {isZeroStock && isFeatureEnabled('inventory', 'supplier_list') && (
                        <button
                          type="button"
                          onClick={() => setIsSupplierModalOpen(true)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bubble text-xs font-bold shadow-sm active:scale-95 transition-all"
                          title="Hacer pedido al proveedor para reabastecer este artículo"
                        >
                          <Truck className="w-3.5 h-3.5 text-white" />
                          <span>Pedir</span>
                        </button>
                      )}
                      {isFeatureEnabled('inventory', 'product_crud') && (
                        <button
                          onClick={() => {
                            setEditingProduct(prod);
                            setIsNewProductModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-fio-800 border border-purple-200 font-bubble text-xs shadow-2xs active:scale-95 transition-all"
                          title="Modificar o editar artículo por completo"
                        >
                          <Pencil className="w-3.5 h-3.5 text-fio-pink" />
                          <span>Editar</span>
                        </button>
                      )}
                      {isFeatureEnabled('inventory', 'qr_labels') && (
                        <button
                          onClick={() => setQrModalProduct(prod)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-fio-800 hover:bg-fio-900 text-white font-bubble text-xs shadow-sm active:scale-95 transition-all"
                          title="Generar etiqueta QR"
                        >
                          <QrCode className="w-3.5 h-3.5 text-fio-yellow" />
                          <span>QR</span>
                        </button>
                      )}
                      {isFeatureEnabled('inventory', 'product_crud') && (
                        <button
                          onClick={async () => {
                            if (await confirm(`¿Eliminar ${prod.name} del inventario?`, { title: 'Eliminar Producto', confirmLabel: 'Eliminar' })) deleteProduct(prod.id);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={inventoryMode === 'stock' ? 8 : 7} className="py-12 text-center text-gray-500">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="font-bubble font-bold text-sm text-gray-700">
                      No hay productos con los filtros seleccionados
                    </p>
                    <p className="text-xs text-gray-400">
                      {statusFilter === 'zero_stock'
                        ? '¡Excelente! No tienes productos con existencias en cero.'
                        : statusFilter === 'unavailable'
                        ? 'Todos tus productos están activos y disponibles.'
                        : 'Prueba cambiando de categoría o limpiando los filtros.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setStatusFilter('all');
                        setSelectedCategory('Todas');
                        setSearchQuery('');
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-fio-100 hover:bg-fio-200 text-fio-800 text-xs font-bubble font-bold transition-all shadow-2xs"
                    >
                      <span>Ver todos los productos</span>
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
