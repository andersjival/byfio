import React from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { isLayawayReservationOrder, isLayawaySaleOrder } from '../../utils/layaway';
import { formatCRC, formatShortDate } from '../../utils/formatters';
import { QrCode, FileCheck, Phone, MapPin, Clock, ArrowRight, CheckCircle2, ClipboardList, Scan, Package, Printer, Trash2, UserCheck } from 'lucide-react';

export const OrdersQueue: React.FC = () => {
  const { orders, startPicking, setInvoiceOrder, updateOrderStatus, isFeatureEnabled, deleteOrder, currentUser } = useApp();
  const [filterMode, setFilterMode] = React.useState<'all' | 'pending' | 'packing' | 'packed' | 'delivered'>('all');

  // IDs de pedidos recién terminados que deben mostrar el colorcito temporal
  const [recentlyFinishedIds, setRecentlyFinishedIds] = React.useState<Set<string>>(() => {
    const initial = new Set<string>();
    const now = Date.now();
    try {
      const seenRaw = sessionStorage.getItem('BYFIO_SEEN_FINISHED_IDS');
      const seenSet = new Set<string>(seenRaw ? JSON.parse(seenRaw) : []);
      orders.forEach((o) => {
        if (o.orderStatus === 'delivered' && !seenSet.has(o.id)) {
          const timestamp = new Date(o.deliveredAt || o.packedAt || o.createdAt).getTime();
          // Si fue terminado hace menos de 10 minutos y no ha sido visto en esta sesión
          if (now - timestamp < 10 * 60 * 1000) {
            initial.add(o.id);
          }
        }
      });
    } catch {}
    return initial;
  });

  // Temporizador para quitar el colorcito pasados unos segundos (5.5 segundos mientras la persona lo ve)
  React.useEffect(() => {
    if (recentlyFinishedIds.size === 0) return;

    const timer = window.setTimeout(() => {
      try {
        const seenRaw = sessionStorage.getItem('BYFIO_SEEN_FINISHED_IDS');
        const seenSet = new Set<string>(seenRaw ? JSON.parse(seenRaw) : []);
        recentlyFinishedIds.forEach((id) => seenSet.add(id));
        sessionStorage.setItem('BYFIO_SEEN_FINISHED_IDS', JSON.stringify(Array.from(seenSet)));
      } catch {}
      setRecentlyFinishedIds(new Set());
    }, 5500);

    return () => window.clearTimeout(timer);
  }, [recentlyFinishedIds]);

  const handleMarkDelivered = (orderId: string) => {
    updateOrderStatus(orderId, 'delivered', currentUser?.name);
    setRecentlyFinishedIds((prev) => new Set([...prev, orderId]));
  };

  // EXCLUSIÓN ESTRICTA: Los apartados NO forman parte de la cola de pedidos de alisto/empaque.
  const isLayawayOrder = (o: Order) => isLayawayReservationOrder(o) || isLayawaySaleOrder(o);

  // Ordenamiento cronológico descendente estricto (pedidos más recientes arriba, más antiguos abajo)
  const sortedOrders = React.useMemo(() => {
    return orders
      .filter((o) => !isLayawayOrder(o))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders]);

  // Determina si un pedido ya finalizó el alisto (progreso 100% estricto de todos los items)
  const isOrderFullyAlistado = (order: Order) => {
    return (
      Array.isArray(order.items) &&
      order.items.length > 0 &&
      order.items.every((it) => it.isPicked || it.isMissing)
    );
  };

  // 1. Pendientes de Alisto: SOLO los que NO se han completado en alisto (progreso < 100%)
  const pendingOrders = sortedOrders.filter(
    (o) => !isOrderFullyAlistado(o)
  );

  // 2. En Empaque: pedidos cuyo alisto YA está al 100% y están en fase de empaque
  const packingOrders = sortedOrders.filter(
    (o) =>
      isOrderFullyAlistado(o) &&
      (o.orderStatus === 'packing' || o.orderStatus === 'pending' || o.orderStatus === 'picking')
  );

  // 3. Empacados: pedidos con alisto al 100% y marcados como empacados
  const packedOrders = sortedOrders.filter(
    (o) => isOrderFullyAlistado(o) && o.orderStatus === 'packed'
  );

  // 4. Terminados: pedidos con alisto al 100% y marcados como entregados (caen arriba por fecha de entrega)
  const deliveredOrders = React.useMemo(() => {
    return orders
      .filter((o) => !isLayawayOrder(o) && isOrderFullyAlistado(o) && o.orderStatus === 'delivered')
      .sort((a, b) => {
        const timeA = new Date(a.deliveredAt || a.packedAt || a.createdAt).getTime();
        const timeB = new Date(b.deliveredAt || b.packedAt || b.createdAt).getTime();
        return timeB - timeA;
      });
  }, [orders]);

  // Lista general ordenada con los pedidos terminados o actualizados más recientes arriba
  const allOrdersSorted = React.useMemo(() => {
    return [...orders].sort((a, b) => {
      const timeA = new Date(a.deliveredAt || a.packedAt || a.createdAt).getTime();
      const timeB = new Date(b.deliveredAt || b.packedAt || b.createdAt).getTime();
      return timeB - timeA;
    });
  }, [orders]);

  const displayedOrders = filterMode === 'pending'
    ? pendingOrders
    : filterMode === 'packing'
    ? packingOrders
    : filterMode === 'packed'
    ? packedOrders
    : filterMode === 'delivered'
    ? deliveredOrders
    : allOrdersSorted;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Pendiente de Alisto</span>;
      case 'picking':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 animate-pulse">En Alisto QR Activo</span>;
      case 'packing':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shadow-xs">
            <Package className="w-3.5 h-3.5 text-amber-700" />
            <span>En Empaque</span>
          </span>
        );
      case 'packed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-900 border border-pink-300 flex items-center gap-1 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-fio-pink" />
            <span>Empacado</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Terminado</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-fio-200 shadow-clay p-5 mb-8">
      {/* Encabezado con Banner Explicativo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-fio-100 pb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-bubble font-bold text-xl text-fio-900">Cola de Pedidos de Clientes</h2>
            <span
              className="text-xs font-bold text-fio-pink bg-pink-50 border border-pink-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5"
              title="Pedidos pendientes de alisto o en alisto QR activo"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-fio-pink animate-pulse" />
              {pendingOrders.length} pendientes
            </span>
            <span
              className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full"
              title="Total histórico de pedidos registrados en el sistema"
            >
              {orders.length} totales
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Los pedidos nuevos ingresan automáticamente en la parte superior y se actualizan en orden en tiempo real.
          </p>
        </div>
      </div>

      {/* Pestañas de Filtro Rápido de Cola */}
      <div className="p-1.5 md:p-1 rounded-2xl bg-slate-100 dark:bg-[#1E1A30] border border-slate-200/80 dark:border-white/10 mb-4 w-full md:w-fit grid grid-cols-2 gap-1.5 md:flex md:items-center md:gap-1.5 md:flex-wrap">
        <button
          type="button"
          onClick={() => setFilterMode('all')}
          className={`col-span-2 md:col-span-1 flex items-center justify-between md:justify-start gap-2 px-3.5 py-2 md:py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
            filterMode === 'all'
              ? 'bg-white dark:bg-[#352F54] text-fio-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-fio-900 dark:hover:text-white bg-white/70 dark:bg-white/5 md:bg-transparent'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <ClipboardList className="w-3.5 h-3.5 text-slate-500 md:hidden" />
            <span className="md:hidden">Todos los Pedidos</span>
            <span className="hidden md:inline">Todos ({orders.length})</span>
          </div>
          <span
            className={`md:hidden px-2 py-0.5 rounded-full text-[10px] font-bold ${
              filterMode === 'all' ? 'bg-fio-pink text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {orders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilterMode('pending')}
          className={`col-span-1 flex items-center justify-between md:justify-start gap-1.5 px-3 py-2 md:py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
            filterMode === 'pending'
              ? 'bg-fio-pink text-white shadow-xs'
              : 'text-slate-600 hover:text-fio-pink bg-white/70 md:bg-transparent'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <Clock className="w-3.5 h-3.5 shrink-0 md:hidden" />
            <span className="truncate hidden md:inline">Pendientes de Alisto</span>
            <span className="truncate md:hidden">Pendientes</span>
          </div>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold shrink-0 ${
              filterMode === 'pending' ? 'bg-white text-fio-pink' : 'bg-pink-100 text-fio-pink'
            }`}
          >
            {pendingOrders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilterMode('packing')}
          className={`col-span-1 flex items-center justify-between md:justify-start gap-1.5 px-3 py-2 md:py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
            filterMode === 'packing'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-700 hover:text-amber-800 bg-white/70 md:bg-transparent'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <Package className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">En Empaque</span>
          </div>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold shrink-0 ${
              filterMode === 'packing' ? 'bg-white text-amber-800' : 'bg-amber-100 text-amber-900'
            }`}
          >
            {packingOrders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilterMode('packed')}
          className={`col-span-1 flex items-center justify-between md:justify-start gap-1.5 px-3 py-2 md:py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
            filterMode === 'packed'
              ? 'bg-fio-pink text-white shadow-xs'
              : 'text-slate-700 hover:text-pink-600 bg-white/70 md:bg-transparent'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Empacados</span>
          </div>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold shrink-0 ${
              filterMode === 'packed' ? 'bg-white text-pink-700' : 'bg-pink-100 text-pink-800'
            }`}
          >
            {packedOrders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilterMode('delivered')}
          className={`col-span-1 flex items-center justify-between md:justify-start gap-1.5 px-3 py-2 md:py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
            filterMode === 'delivered'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-purple-700 bg-white/70 md:bg-transparent'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <FileCheck className="w-3.5 h-3.5 shrink-0 md:hidden" />
            <span className="truncate">Terminados</span>
          </div>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold shrink-0 ${
              filterMode === 'delivered' ? 'bg-white text-purple-700' : 'bg-purple-100 text-purple-800'
            }`}
          >
            {deliveredOrders.length}
          </span>
        </button>
      </div>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {displayedOrders.length === 0 ? (
          <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm font-bubble font-bold text-slate-600">No hay pedidos con este filtro</p>
            <p className="text-xs text-slate-400 mt-1">Selecciona "Todos" para ver el historial completo.</p>
          </div>
        ) : (
          displayedOrders.map((order: Order) => {
          const totalItems = order.items.length;
          const pickedItems = order.items.filter((it) => it.isPicked || it.isMissing).length;
          const progressPercent = totalItems > 0 ? Math.round((pickedItems / totalItems) * 100) : 0;
          const isFinished = isOrderFullyAlistado(order);
          const effectiveStatus: OrderStatus = isFinished && (order.orderStatus === 'pending' || order.orderStatus === 'picking')
            ? 'packing'
            : !isFinished && (order.orderStatus === 'packing' || order.orderStatus === 'packed' || order.orderStatus === 'delivered')
            ? (order.items?.some((it) => it.isPicked) ? 'picking' : 'pending')
            : order.orderStatus;

          const isNewlyFinished = recentlyFinishedIds.has(order.id);

          return (
            <div
              key={order.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-1000 ${
                isNewlyFinished
                  ? 'border-2 border-purple-400 bg-gradient-to-r from-purple-50 via-pink-50/70 to-purple-50 shadow-[0_0_25px_rgba(168,85,247,0.25)] ring-4 ring-purple-300/40 scale-[1.01]'
                  : !isFinished && order.orderStatus === 'picking'
                  ? 'border-fio-500 bg-fio-50/70 shadow-md ring-2 ring-fio-400'
                  : effectiveStatus === 'delivered'
                  ? 'border-purple-200 bg-purple-50/25 hover:border-purple-300 shadow-sm'
                  : 'border-fio-200 hover:border-fio-300 bg-white shadow-sm'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Info Cliente */}
                <div className="space-y-1.5 min-w-[250px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-sm text-fio-900 bg-fio-100 px-2.5 py-1 rounded-xl">
                      {order.orderNumber}
                    </span>
                    {getStatusBadge(effectiveStatus)}
                    {isNewlyFinished && (
                      <span className="px-3 py-1 rounded-full text-xs font-bubble font-black bg-purple-600 text-white shadow-md animate-pulse flex items-center gap-1.5 transition-all">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-200" />
                        <span>¡Recién Terminado! ✨</span>
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1 shadow-xs">
                      <CheckCircle2 className="w-3 h-3 text-purple-600" />
                      <span>Pagado por {order.paymentMethod === 'sinpe' ? 'SINPE Móvil' : 'Transferencia'} (Verificado)</span>
                    </span>
                    {(order.items?.some((it) => it.isLayaway) || (order.notes && order.notes.includes('[APARTADO]'))) && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shadow-xs">
                        🏷️ Plan de Apartado (1ª Cuota)
                      </span>
                    )}
                    {(order.pickedBy || isFinished) && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bubble font-bold bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1 shadow-xs">
                        <UserCheck className="w-3 h-3 text-fio-pink" />
                        <span>Alistó: <strong>{order.pickedBy || currentUser?.name || 'Administración'}</strong></span>
                        {(order.pickedAt || order.packedAt) && (
                          <span className="text-[9px] text-purple-600 font-mono font-normal">
                            ({new Date(order.pickedAt || order.packedAt!).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })})
                          </span>
                        )}
                      </span>
                    )}
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatShortDate(order.createdAt)}
                    </span>
                  </div>

                  <h3 className="font-bubble font-bold text-lg text-gray-800">{order.customerName}</h3>

                  {order.notes && (
                    <p className="text-[11px] text-purple-900 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200 font-mono w-fit">
                      📌 {order.notes}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1 font-semibold">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      {order.customerPhone}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-fio-pink" />
                      {order.deliveryMethod === 'envio' ? 'Envío por Correos CR' : 'Retiro en taller'}
                    </span>
                    <span className="font-bubble font-bold text-fio-900">{formatCRC(order.total)}</span>
                  </div>
                </div>

                {/* Barra de Progreso de Alisto */}
                <div className="flex-1 max-w-xs">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-600">Progreso de Alisto</span>
                    <span className="text-fio-900 font-bold">
                      {pickedItems}/{totalItems} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isFinished ? 'bg-gradient-to-r from-purple-500 to-fio-pink' : 'bg-gradient-to-r from-fio-500 via-fio-400 to-fio-pink'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* BOTONES PROMINENTES DE ALISTO (CÓDIGO Y MANUAL) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                  {!isFinished ? (
                    <>
                      {isFeatureEnabled('orders', 'code_picking') && (
                        <button
                          type="button"
                          onClick={() => startPicking(order.id, 'barcode')}
                          className="flex items-center justify-center gap-2 px-4 py-3.5 sm:px-3.5 sm:py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-fio-pink hover:from-purple-500 hover:to-pink-500 text-white font-bubble font-black text-sm sm:text-xs shadow-clayBtn transition-all active:scale-95 cursor-pointer min-h-[48px]"
                          title="Alisto guiado con escáner QR o código de barras"
                        >
                          <QrCode className="w-5 h-5 sm:w-4 sm:h-4 text-fio-yellow shrink-0" />
                          <span>Alisto con Código</span>
                        </button>
                      )}

                      {isFeatureEnabled('orders', 'manual_picking') && (
                        <button
                          type="button"
                          onClick={() => startPicking(order.id, 'manual')}
                          className="flex items-center justify-center gap-2 px-4 py-3.5 sm:px-3.5 sm:py-2.5 rounded-2xl bg-white hover:bg-purple-50/80 text-purple-900 border-2 border-purple-200 hover:border-purple-400 font-bubble font-black text-sm sm:text-xs shadow-xs transition-all active:scale-95 cursor-pointer min-h-[48px]"
                          title="Alistar pedido paso a paso producto por producto con reporte de faltante"
                        >
                          <ClipboardList className="w-5 h-5 sm:w-4 sm:h-4 text-fio-pink shrink-0" />
                          <span>Alistar Pedido</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`¿Eliminar permanentemente el pedido ${order.orderNumber} de ${order.customerName}?`)) {
                            deleteOrder(order.id);
                          }
                        }}
                        className="p-3 sm:p-2 rounded-2xl text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors cursor-pointer self-center"
                        title="Eliminar pedido"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setInvoiceOrder(order)}
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-fio-pink hover:from-purple-500 hover:to-pink-500 text-white font-bubble text-xs font-bold transition-all shadow-clayBtn cursor-pointer active:scale-95"
                        title="Generar o imprimir comprobante y factura oficial"
                      >
                        <Printer className="w-4 h-4 text-fio-yellow" />
                        <span>Generar / Ver Factura</span>
                      </button>

                      {effectiveStatus === 'packing' && (
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(order.id, 'packed', currentUser?.name)}
                          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bubble text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                          title="Marcar pedido como empacado"
                        >
                          <Package className="w-4 h-4 text-amber-200" />
                          <span>Marcar Empacado</span>
                        </button>
                      )}

                      {effectiveStatus === 'packed' && (
                        <button
                          type="button"
                          onClick={() => handleMarkDelivered(order.id)}
                          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bubble text-xs font-bold transition-all cursor-pointer shadow-neuBtn active:scale-95"
                          title="Marcar pedido como terminado"
                        >
                          <CheckCircle2 className="w-4 h-4 text-purple-200" />
                          <span>Marcar Terminado</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`¿Eliminar permanentemente el pedido ${order.orderNumber} de ${order.customerName}?`)) {
                            deleteOrder(order.id);
                          }
                        }}
                        className="p-2.5 rounded-2xl text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors cursor-pointer"
                        title="Eliminar pedido"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
};
