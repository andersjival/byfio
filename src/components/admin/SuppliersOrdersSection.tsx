import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useConfirm, useAlert } from '../../context/ConfirmContext';
import { SupplierOrder, SupplierOrderItem, SupplierOrderStatus } from '../../types';
import { formatCRC, formatShortDate, getWhatsAppLink } from '../../utils/formatters';
import {
  Truck, Plus, Search, Calendar, Phone, Mail, CheckCircle2, Clock,
  Package, ChevronDown, ChevronUp, Printer, Trash2, MessageCircle,
  FileText, ArrowRight, RefreshCw, AlertCircle, Edit3, X, Check, Eye
} from 'lucide-react';

export const SuppliersOrdersSection: React.FC = () => {
  const {
    supplierOrders,
    addSupplierOrder,
    updateSupplierOrder,
    deleteSupplierOrder,
    updateSupplierOrderStatus,
    products,
    setIsSupplierModalOpen,
    agendaItems,
    addAgendaItem,
  } = useApp();
  const confirm = useConfirm();
  const showAlert = useAlert();

  const [activeFilter, setActiveFilter] = useState<'all' | 'draft' | 'ordered' | 'received'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [viewingOrder, setViewingOrder] = useState<SupplierOrder | null>(null);

  const handleSaveToAgenda = (order: SupplierOrder) => {
    const isAlreadyInAgenda = agendaItems?.some(
      (item) => item.title.includes(order.orderNumber) || (item.notes && item.notes.includes(order.orderNumber))
    );
    if (isAlreadyInAgenda) return;

    addAgendaItem({
      title: `Pedido a Proveedor (${order.orderNumber}): ${order.supplierName}`,
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      category: 'proveedor',
      priority: order.status === 'draft' ? 'alta' : 'media',
      status: 'pending',
      notes: `Requisición de ${order.items.length} productos (${order.totalUnits} uds) para ${order.supplierName}. Total: ${formatCRC(order.totalCost)}. Estado: ${order.status === 'draft' ? 'Por pedir' : 'Pedido realizado'}. Ref: ${order.orderNumber}`,
    });
  };

  // Modal para Crear Nuevo Pedido a Proveedor Directo
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState('Papelera & Insumos Creativos CR');
  const [newSupplierPhone, setNewSupplierPhone] = useState('64004640');
  const [newSupplierEmail, setNewSupplierEmail] = useState('');
  const [newOrderNotes, setNewOrderNotes] = useState('');
  const [newOrderStatus, setNewOrderStatus] = useState<SupplierOrderStatus>('draft');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);
  const [newOrderItems, setNewOrderItems] = useState<SupplierOrderItem[]>([]);

  // Conteos
  const totalCount = supplierOrders.length;
  const draftCount = supplierOrders.filter((o: SupplierOrder) => o.status === 'draft').length;
  const orderedCount = supplierOrders.filter((o: SupplierOrder) => o.status === 'ordered').length;
  const receivedCount = supplierOrders.filter((o: SupplierOrder) => o.status === 'received').length;

  const totalCommittedCost = useMemo(() => {
    return supplierOrders
      .filter((o: SupplierOrder) => o.status === 'draft' || o.status === 'ordered')
      .reduce((acc: number, o: SupplierOrder) => acc + (o.totalCost || 0), 0);
  }, [supplierOrders]);

  // Filtrado y Búsqueda
  const filteredOrders = useMemo(() => {
    return supplierOrders.filter((order: SupplierOrder) => {
      // Filtro por pestaña
      if (activeFilter !== 'all' && order.status !== activeFilter) {
        return false;
      }

      // Filtro por búsqueda
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchNumber = order.orderNumber.toLowerCase().includes(q);
      const matchSupplier = order.supplierName.toLowerCase().includes(q);
      const matchNotes = (order.notes || '').toLowerCase().includes(q);
      const matchItem = order.items.some(
        (it: SupplierOrderItem) => it.name.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q)
      );

      return matchNumber || matchSupplier || matchNotes || matchItem;
    });
  }, [supplierOrders, activeFilter, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddItemToNewOrder = () => {
    if (!selectedProductId) return;
    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) return;

    const existingIdx = newOrderItems.findIndex((it) => it.productId === prod.id || it.sku === prod.sku);
    if (existingIdx !== -1) {
      setNewOrderItems((prev) => {
        const next = [...prev];
        const updatedQty = next[existingIdx].orderQty + selectedQty;
        next[existingIdx] = {
          ...next[existingIdx],
          orderQty: updatedQty,
          subtotal: updatedQty * next[existingIdx].cost,
        };
        return next;
      });
    } else {
      const estimatedCost = prod.costPrice || Math.round(prod.price * 0.45);
      newOrderItems.push({
        productId: prod.id,
        sku: prod.sku,
        name: prod.name,
        category: prod.category,
        currentStock: prod.stock,
        minStock: prod.minStock,
        orderQty: selectedQty,
        cost: estimatedCost,
        subtotal: selectedQty * estimatedCost,
        shelfLocation: prod.shelfLocation,
      });
      setNewOrderItems([...newOrderItems]);
    }

    setSelectedProductId('');
    setSelectedQty(1);
  };

  const handleRemoveItemFromNewOrder = (index: number) => {
    setNewOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveDirectOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOrderItems.length === 0) {
      showAlert('Debes agregar al menos un producto a la orden de compra.', { title: 'Orden Vacía', variant: 'warning' });
      return;
    }

    const totalUnits = newOrderItems.reduce((acc, it) => acc + it.orderQty, 0);
    const totalCost = newOrderItems.reduce((acc, it) => acc + it.subtotal, 0);
    const nextNum = `#PROV-${new Date().getFullYear()}-${String(supplierOrders.length + 1).padStart(3, '0')}`;

    addSupplierOrder({
      orderNumber: nextNum,
      supplierName: newSupplierName.trim() || 'Proveedor General',
      supplierPhone: newSupplierPhone.trim() || undefined,
      supplierEmail: newSupplierEmail.trim() || undefined,
      status: newOrderStatus,
      items: newOrderItems,
      totalUnits,
      totalCost,
      notes: newOrderNotes.trim() || undefined,
      orderedAt: newOrderStatus === 'ordered' ? new Date().toISOString() : undefined,
    });

    setIsCreateModalOpen(false);
    setNewOrderItems([]);
    setNewOrderNotes('');
  };

  const generateWhatsAppMessage = (order: SupplierOrder) => {
    const itemsList = order.items
      .map((it: SupplierOrderItem, idx: number) => `${idx + 1}. *${it.name}* (SKU: \`${it.sku}\`)\n   Cantidad: *${it.orderQty} uds* | Costo est: ${formatCRC(it.subtotal)}`)
      .join('\n');

    return (
      `*ORDEN DE COMPRA / PEDIDO A PROVEEDOR*\n` +
      `*Número:* ${order.orderNumber}\n` +
      `*Comercio:* by.fio Talleres Creativos & Tienda\n` +
      `*Fecha:* ${new Date(order.createdAt).toLocaleDateString('es-CR')}\n\n` +
      `*DETALLE DE PRODUCTOS SOLICITADOS:*\n` +
      `${itemsList}\n\n` +
      `*Total Artículos:* ${order.items.length}\n` +
      `*Total Unidades:* ${order.totalUnits}\n` +
      `*Monto Estimado:* ${formatCRC(order.totalCost)}\n\n` +
      (order.notes ? `📌 *Nota adicional:* ${order.notes}\n\n` : '') +
      `Por favor confirmar disponibilidad y tiempo de entrega o despacho. ¡Muchas gracias!`
    );
  };

  const getStatusBadge = (status: SupplierOrderStatus) => {
    switch (status) {
      case 'draft':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>Por Pedir (Borrador)</span>
          </span>
        );
      case 'ordered':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1.5 shadow-2xs">
            <Truck className="w-3.5 h-3.5 text-purple-700" />
            <span>Pedido Realizado (Enviado)</span>
          </span>
        );
      case 'received':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Recibido en Taller</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-8">
      {/* Encabezado y Estadísticas Clave */}
      <div className="bg-white rounded-3xl border border-fio-200 shadow-clay p-5 sm:p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-fio-100 pb-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                <Truck className="w-5 h-5" />
              </div>
              <h2 className="font-bubble font-bold text-xl sm:text-2xl text-fio-900">
                Pedidos a Proveedores &amp; Requisiciones
              </h2>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                {totalCount} órdenes registradas
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Guarda tus pedidos de insumos y materiales como borradores para pedirlos después, o regístralos en el historial como pedidos ya realizados al proveedor.
            </p>
          </div>

          {/* Botones de Acción Superior */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsSupplierModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bubble text-xs font-bold shadow-clayBtn transition-all active:scale-95 cursor-pointer"
              title="Generar orden automática basada en stock crítico y bajo mínimo"
            >
              <RefreshCw className="w-4 h-4 text-fio-yellow" />
              <span>Requisición Automática (Stock Bajo)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setNewOrderItems([]);
                setNewOrderNotes('');
                setIsCreateModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bubble text-xs font-bold shadow-clayBtn transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>+ Nuevo Pedido a Proveedor</span>
            </button>
          </div>
        </div>

        {/* Tarjetas de Métricas Rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-[11px] font-bold text-slate-500 uppercase">Total Órdenes</p>
            <p className="font-bubble font-bold text-xl text-slate-800 mt-0.5">{totalCount}</p>
            <p className="text-[10px] text-slate-400">Histórico de compras</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
            <p className="text-[11px] font-bold text-amber-700 uppercase">Por Pedir (Borradores)</p>
            <p className="font-bubble font-bold text-xl text-amber-800 mt-0.5">{draftCount}</p>
            <p className="text-[10px] text-amber-600">Para pedir después</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200">
            <p className="text-[11px] font-bold text-purple-700 uppercase">Pedidos Realizados</p>
            <p className="font-bubble font-bold text-xl text-purple-800 mt-0.5">{orderedCount}</p>
            <p className="text-[10px] text-purple-600">Enviados a proveedores</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <p className="text-[11px] font-bold text-emerald-700 uppercase">Recibidos en Taller</p>
            <p className="font-bubble font-bold text-xl text-emerald-800 mt-0.5">{receivedCount}</p>
            <p className="text-[10px] text-emerald-600">Entregados con éxito</p>
          </div>
        </div>
      </div>

      {/* Pestañas de Filtro y Buscador */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/80 w-fit flex-wrap">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-white text-fio-900 shadow-xs'
                : 'text-slate-600 hover:text-fio-900'
            }`}
          >
            Todos ({totalCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('draft')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'draft'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-700 hover:text-amber-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Por Pedir (Borradores)</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeFilter === 'draft' ? 'bg-white text-amber-800' : 'bg-amber-100 text-amber-900'
              }`}
            >
              {draftCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('ordered')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'ordered'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-purple-700'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Pedidos Realizados</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeFilter === 'ordered' ? 'bg-white text-purple-800' : 'bg-purple-100 text-purple-900'
              }`}
            >
              {orderedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('received')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'received'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-emerald-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Recibidos</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeFilter === 'received' ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-900'
              }`}
            >
              {receivedCount}
            </span>
          </button>
        </div>

        {/* Buscador Rápido */}
        <div className="relative min-w-[260px] sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por # orden, proveedor, SKU..."
            className="w-full pl-9 pr-3.5 py-2 rounded-2xl border border-slate-300 bg-white text-xs font-sans placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Lista de Órdenes a Proveedores */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bubble font-bold text-base text-slate-800">
              {searchQuery ? 'No se encontraron órdenes con esta búsqueda' : 'No hay pedidos en esta sección'}
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Puedes preparar una orden guardada como borrador para pedirla después, o registrar un pedido que ya realizaste a tus proveedores.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bubble font-bold text-xs shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Pedido a Proveedor</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order: SupplierOrder) => {
            const isExpanded = !!expandedOrders[order.id];
            const visibleItems = isExpanded ? order.items : order.items.slice(0, 3);
            const hasMoreItems = order.items.length > 3;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all p-4 sm:p-5 space-y-4"
              >
                {/* Cabecera de la Tarjeta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-sm text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-xl border border-amber-300">
                        {order.orderNumber}
                      </span>
                      {getStatusBadge(order.status)}
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Creado: {formatShortDate(order.createdAt)}
                      </span>
                      {order.orderedAt && (
                        <span className="text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg font-medium">
                          Pedido el: {formatShortDate(order.orderedAt)}
                        </span>
                      )}
                      {order.receivedAt && (
                        <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg font-medium">
                          Recibido el: {formatShortDate(order.receivedAt)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                      <h3 className="font-bubble font-bold text-base sm:text-lg text-slate-900">
                        {order.supplierName}
                      </h3>
                      {order.supplierPhone && (
                        <a
                          href={getWhatsAppLink(order.supplierPhone, generateWhatsAppMessage(order))}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-lg transition-colors"
                          title="Enviar o consultar pedido por WhatsApp"
                        >
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{order.supplierPhone}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Resumen de Costo y Unidades */}
                  <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl">
                    <p className="text-[11px] text-slate-500 font-semibold uppercase">Costo Estimado</p>
                    <p className="font-bubble font-black text-lg text-fio-900">
                      {formatCRC(order.totalCost)}
                    </p>
                    <p className="text-xs text-slate-600 font-medium">
                      {order.totalUnits} uds • {order.items.length} productos
                    </p>
                  </div>
                </div>

                {/* Lista Desglosada de Productos */}
                <div className="space-y-2">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-slate-400 font-semibold border-b border-slate-100 pb-1">
                          <th className="pb-1.5 font-normal">Producto / SKU</th>
                          <th className="pb-1.5 font-normal text-center">Unidades</th>
                          <th className="pb-1.5 font-normal text-right">Costo Est. U.</th>
                          <th className="pb-1.5 font-normal text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {visibleItems.map((item: SupplierOrderItem, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-2 pr-2">
                              <p className="font-bubble font-bold text-slate-800 text-xs sm:text-sm">
                                {item.name}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                                <span>SKU: {item.sku}</span>
                                {item.shelfLocation && (
                                  <span className="text-purple-600 font-sans">
                                    • Ubic: {item.shelfLocation}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-2 px-2 text-center font-bold text-slate-800 font-mono text-sm">
                              {item.orderQty} uds
                            </td>
                            <td className="py-2 px-2 text-right font-medium text-slate-600">
                              {formatCRC(item.cost)}
                            </td>
                            <td className="py-2 pl-2 text-right font-bold text-slate-900">
                              {formatCRC(item.subtotal)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {hasMoreItems && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(order.id)}
                      className="text-xs font-bubble font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer pt-1"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          <span>Mostrar menos productos</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          <span>Ver {order.items.length - 3} producto(s) más...</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Nota de la orden si existe */}
                {order.notes && (
                  <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-purple-950 font-medium">
                    📌 <span className="font-bold">Nota:</span> {order.notes}
                  </div>
                )}

                {/* Barra de Acciones y Botones de Transición */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Botón Acción Principal de Estado */}
                    {order.status === 'draft' && (
                      <button
                        type="button"
                        onClick={() => updateSupplierOrderStatus(order.id, 'ordered')}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bubble text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                        title="Marcar como pedido ya enviado al proveedor"
                      >
                        <Truck className="w-4 h-4 text-fio-yellow" />
                        <span>Marcar como Pedido al Proveedor</span>
                      </button>
                    )}

                    {order.status === 'ordered' && (
                      <button
                        type="button"
                        onClick={() => updateSupplierOrderStatus(order.id, 'received')}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bubble text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                        title="Marcar como recibido en el taller"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                        <span>Marcar como Recibido en Taller</span>
                      </button>
                    )}

                    {order.status === 'received' && (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Completado &amp; Recibido</span>
                      </span>
                    )}

                    {/* Botón WhatsApp */}
                    {order.supplierPhone && (
                      <a
                        href={getWhatsAppLink(order.supplierPhone, generateWhatsAppMessage(order))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bubble text-xs font-bold shadow-xs transition-all active:scale-95"
                        title="Enviar resumen de orden por WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Enviar por WhatsApp</span>
                      </a>
                    )}

                    {/* Botón Guardar en Agenda */}
                    {agendaItems?.some((item) => item.title.includes(order.orderNumber) || (item.notes && item.notes.includes(order.orderNumber))) ? (
                      <button
                        type="button"
                        disabled={true}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bubble font-bold cursor-not-allowed opacity-90 shadow-2xs"
                        title="Este pedido ya fue guardado en la Agenda del Taller"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Guardado en Agenda</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSaveToAgenda(order)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 font-bubble text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
                        title="Guardar este pedido en la Agenda del Taller"
                      >
                        <Calendar className="w-4 h-4 text-purple-700" />
                        <span>Guardar en Agenda</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    {order.status === 'ordered' && (
                      <button
                        type="button"
                        onClick={() => updateSupplierOrderStatus(order.id, 'draft')}
                        className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg font-medium transition-colors cursor-pointer"
                        title="Volver a poner este pedido en estado de borrador"
                      >
                        Volver a Borrador
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setViewingOrder(order)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bubble text-xs font-bold transition-colors cursor-pointer"
                      title="Ver e imprimir ficha formal de orden"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Ver Ficha / Imprimir</span>
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        if (await confirm(`¿Eliminar la orden ${order.orderNumber} permanentemente?`, { title: 'Eliminar Orden', confirmLabel: 'Eliminar' })) {
                          deleteSupplierOrder(order.id);
                        }
                      }}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Eliminar orden"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Crear Nuevo Pedido a Proveedor Directo */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-amber-200 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header Modal */}
            <div className="px-5 py-3.5 sm:py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bubble font-bold text-base sm:text-lg leading-tight">
                    Nuevo Pedido a Proveedor
                  </h3>
                  <p className="text-[11px] text-amber-100">
                    Crea una orden para pedir después (borrador) o regístrala como pedido ya realizado
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSaveDirectOrder} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
                {/* Datos del Proveedor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nombre del Proveedor <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newSupplierName}
                      onChange={(e) => setNewSupplierName(e.target.value)}
                      placeholder="Ej: Papelera Creativa CR"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Teléfono / WhatsApp de Proveedor
                    </label>
                    <input
                      type="tel"
                      value={newSupplierPhone}
                      onChange={(e) => setNewSupplierPhone(e.target.value)}
                      placeholder="Ej: 64004640"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

                {/* Estado Inicial de la Orden */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    ¿Cómo deseas guardar este pedido?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewOrderStatus('draft')}
                      className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        newOrderStatus === 'draft'
                          ? 'border-amber-500 bg-amber-50 text-amber-950 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span className="font-bubble font-bold text-xs">Por Pedir (Borrador)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Para consolidar artículos y pedirlos formalmente después.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewOrderStatus('ordered')}
                      className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        newOrderStatus === 'ordered'
                          ? 'border-purple-600 bg-purple-50 text-purple-950 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-purple-700" />
                        <span className="font-bubble font-bold text-xs">Pedido ya Realizado</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Registrar en historial como pedido ya enviado al proveedor.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Agregar Productos a la Orden */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="font-bubble font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-amber-600" />
                    <span>Agregar Productos a la Orden</span>
                  </h4>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-sans focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      <option value="">Selecciona un producto del inventario...</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.sku}) — Stock actual: {p.stock}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={selectedQty}
                        onChange={(e) => setSelectedQty(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 px-2.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono font-bold text-center focus:outline-none focus:ring-2 focus:ring-amber-400"
                        placeholder="Cant."
                      />
                      <button
                        type="button"
                        onClick={handleAddItemToNewOrder}
                        disabled={!selectedProductId}
                        className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bubble font-bold text-xs transition-colors cursor-pointer"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>

                  {/* Lista de Artículos Agregados */}
                  {newOrderItems.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-200">
                      {newOrderItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 text-xs"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="font-bubble font-bold text-slate-800 truncate">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {item.orderQty} uds x {formatCRC(item.cost)} = {formatCRC(item.subtotal)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItemFromNewOrder(idx)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      <div className="flex items-center justify-between pt-2 px-1 text-xs font-bold text-slate-800">
                        <span>Total de la Orden:</span>
                        <span className="font-bubble text-sm text-fio-900">
                          {formatCRC(newOrderItems.reduce((acc, it) => acc + it.subtotal, 0))}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notas de la Orden */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Notas o Instrucciones para el Proveedor
                  </label>
                  <textarea
                    rows={2}
                    value={newOrderNotes}
                    onChange={(e) => setNewOrderNotes(e.target.value)}
                    placeholder="Ej: Enviar por encomienda a San José, o solicitar confirmación antes de despachar..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                  />
                </div>
              </div>

              {/* Footer Modal Fijo */}
              <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bubble text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={newOrderItems.length === 0}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-white font-bubble text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  Guardar Orden de Compra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Vista Formal e Imprimible de Orden */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div>
                <h3 className="font-bubble font-bold text-base text-slate-900">
                  Ficha de Orden {viewingOrder.orderNumber}
                </h3>
                <p className="text-xs text-slate-500">
                  Proveedor: {viewingOrder.supplierName} • {formatShortDate(viewingOrder.createdAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <p className="font-bubble font-bold text-sm text-fio-900">by.fio Talleres Creativos</p>
                  <p className="text-[11px] text-slate-500">Tibás, San José, Costa Rica</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-sm text-amber-800">{viewingOrder.orderNumber}</p>
                  <p className="text-[11px] text-slate-500">Estado: {viewingOrder.status.toUpperCase()}</p>
                </div>
              </div>

              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="pb-2 font-bold">Artículo</th>
                    <th className="pb-2 text-center font-bold">Cant.</th>
                    <th className="pb-2 text-right font-bold">Costo Unit.</th>
                    <th className="pb-2 text-right font-bold">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {viewingOrder.items.map((it: SupplierOrderItem, i: number) => (
                    <tr key={i}>
                      <td className="py-2">
                        <span className="font-bold text-slate-800">{it.name}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">SKU: {it.sku}</span>
                      </td>
                      <td className="py-2 text-center font-mono font-bold">{it.orderQty}</td>
                      <td className="py-2 text-right font-mono">{formatCRC(it.cost)}</td>
                      <td className="py-2 text-right font-mono font-bold">{formatCRC(it.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center pt-3 border-t-2 border-slate-200 font-bold text-sm">
                <span>Total Estimado ({viewingOrder.totalUnits} unidades):</span>
                <span className="font-bubble text-base text-fio-900">{formatCRC(viewingOrder.totalCost)}</span>
              </div>

              {viewingOrder.notes && (
                <div className="p-3 rounded-xl bg-purple-50 text-purple-900 text-xs">
                  📌 <span className="font-bold">Notas:</span> {viewingOrder.notes}
                </div>
              )}
            </div>

            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
              {agendaItems?.some((item) => item.title.includes(viewingOrder.orderNumber) || (item.notes && item.notes.includes(viewingOrder.orderNumber))) ? (
                <button
                  type="button"
                  disabled={true}
                  className="px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 font-bubble text-xs font-bold cursor-not-allowed opacity-90 flex items-center gap-1.5"
                  title="Este pedido ya fue guardado en la Agenda del Taller"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Guardado en Agenda</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSaveToAgenda(viewingOrder)}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bubble text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  title="Guardar este pedido en la Agenda del Taller"
                >
                  <Calendar className="w-4 h-4 text-purple-200" />
                  <span>Guardar en Agenda</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bubble text-xs font-bold hover:bg-slate-900 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>Imprimir Ficha</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bubble text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
