import React from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { formatCRC, formatShortDate } from '../../utils/formatters';
import { QrCode, FileCheck, Phone, MapPin, Clock, ArrowRight, CheckCircle2, Bell, BellOff, ClipboardList, Scan } from 'lucide-react';
import { playNewOrderChimeSound } from '../../utils/soundEffects';

export const OrdersQueue: React.FC = () => {
  const { orders, startPicking, setInvoiceOrder, updateOrderStatus, soundNewOrderEnabled, setSoundNewOrderEnabled } = useApp();
  const [filterMode, setFilterMode] = React.useState<'pending' | 'all' | 'completed'>('all');

  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'picking');
  const completedOrders = orders.filter((o) => o.orderStatus === 'packed' || o.orderStatus === 'delivered');

  const displayedOrders = filterMode === 'pending'
    ? pendingOrders
    : filterMode === 'completed'
    ? completedOrders
    : orders;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Pendiente de Alisto</span>;
      case 'picking':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 animate-pulse">En Alisto QR Activo</span>;
      case 'packed':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Empacado / Facturado</span>;
      case 'delivered':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Entregado</span>;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-fio-200 shadow-clay p-5 mb-8">
      {/* Encabezado con Banner Explicativo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-fio-100 pb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-bubble font-bold text-xl text-fio-900">Cola de Pedidos de Clientes (FIFO)</h2>
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
            Alisto secuencial cronológico por orden de llegada para empaque y despacho.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Botón Switch Sonido de Nuevos Pedidos */}
          <button
            type="button"
            onClick={() => {
              const next = !soundNewOrderEnabled;
              setSoundNewOrderEnabled(next);
              if (next) playNewOrderChimeSound(0.35);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-bold transition-all active:scale-95 cursor-pointer ${
              soundNewOrderEnabled
                ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
            title={soundNewOrderEnabled ? 'Sonido de pedidos activado (clic para silenciar)' : 'Sonido de pedidos desactivado (clic para activar)'}
          >
            {soundNewOrderEnabled ? (
              <Bell className="w-4 h-4 text-amber-600 fill-amber-500/20" />
            ) : (
              <BellOff className="w-4 h-4 text-slate-400" />
            )}
            <span>{soundNewOrderEnabled ? 'Sonido: Activado' : 'Sonido: Silenciado'}</span>
          </button>

          <div className="flex items-center gap-2 bg-purple-50 text-purple-900 px-3 py-1.5 rounded-2xl border border-purple-200 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-fio-pink" />
            <span>Release List con Código y Release List Manual</span>
          </div>
        </div>
      </div>

      {/* Pestañas de Filtro Rápido de Cola */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/80 mb-4 w-fit flex-wrap">
        <button
          type="button"
          onClick={() => setFilterMode('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
            filterMode === 'all'
              ? 'bg-white text-fio-900 shadow-xs'
              : 'text-slate-600 hover:text-fio-900'
          }`}
        >
          Todos ({orders.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterMode('pending')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterMode === 'pending'
              ? 'bg-fio-pink text-white shadow-xs'
              : 'text-slate-600 hover:text-fio-pink'
          }`}
        >
          <span>Pendientes de Alisto</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              filterMode === 'pending' ? 'bg-white text-fio-pink' : 'bg-pink-100 text-fio-pink'
            }`}
          >
            {pendingOrders.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setFilterMode('completed')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterMode === 'completed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-emerald-700'
          }`}
        >
          <span>Empacados / Listos</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              filterMode === 'completed' ? 'bg-white text-emerald-700' : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {completedOrders.length}
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
          const pickedItems = order.items.filter((it) => it.isPicked).length;
          const progressPercent = Math.round((pickedItems / totalItems) * 100);
          const isFinished = order.orderStatus === 'packed' || order.orderStatus === 'delivered';

          return (
            <div
              key={order.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                order.orderStatus === 'picking'
                  ? 'border-fio-500 bg-fio-50/70 shadow-md ring-2 ring-fio-400'
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
                    {getStatusBadge(order.orderStatus)}
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-xs">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Pagado por {order.paymentMethod === 'sinpe' ? 'SINPE Móvil' : 'Transferencia'} (Verificado)</span>
                    </span>
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
                        isFinished ? 'bg-emerald-500' : 'bg-gradient-to-r from-fio-500 via-fio-400 to-fio-pink'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* BOTONES PROMINENTES DE ALISTO (CÓDIGO Y MANUAL) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                  {!isFinished ? (
                    <>
                      <button
                        type="button"
                        onClick={() => startPicking(order.id, 'barcode')}
                        className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-bold text-xs shadow-clayBtn transition-all active:scale-95 cursor-pointer"
                        title="Alisto guiado con escáner QR o código de barras"
                      >
                        <QrCode className="w-4 h-4 text-fio-yellow" />
                        <span>Release List con Código</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => startPicking(order.id, 'manual')}
                        className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white hover:bg-purple-50/80 text-fio-800 border-2 border-purple-300 hover:border-purple-500 font-bubble font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                        title="Lista de despacho manual con checklist y opción de impresión"
                      >
                        <ClipboardList className="w-4 h-4 text-fio-pink" />
                        <span>Release List Manual</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setInvoiceOrder(order)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-fio-100 text-fio-800 hover:bg-fio-200 font-bubble text-xs font-bold transition-all"
                      >
                        <FileCheck className="w-4 h-4 text-fio-600" />
                        <span>Ver Factura Oficial</span>
                      </button>

                      {order.orderStatus === 'packed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bubble text-xs font-bold transition-all"
                        >
                          Entregar
                        </button>
                      )}
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
