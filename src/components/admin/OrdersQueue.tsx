import React from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { formatCRC, formatShortDate } from '../../utils/formatters';
import { QrCode, FileCheck, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';

export const OrdersQueue: React.FC = () => {
  const { orders, startPicking, setInvoiceOrder, updateOrderStatus } = useApp();

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">Pendiente de Alisto</span>;
      case 'picking':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-700 animate-pulse">En Alisto QR</span>;
      case 'packed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">Empacado / Facturado</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700">Entregado</span>;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-fio-200 shadow-clay p-5 mb-8">
      <div className="flex items-center justify-between gap-3 mb-5 border-b border-fio-100 pb-3">
        <div>
          <h2 className="font-bubble font-bold text-xl text-fio-900">Cola de Pedidos de Clientes (FIFO)</h2>
          <p className="text-xs text-gray-500">Alisto secuencial ordenado por hora de compra.</p>
        </div>
        <span className="text-xs font-bold text-fio-800 bg-fio-100 px-3 py-1.5 rounded-2xl">
          {orders.length} pedidos totales
        </span>
      </div>

      <div className="space-y-4">
        {orders.map((order: Order) => {
          const totalItems = order.items.length;
          const pickedItems = order.items.filter((it) => it.isPicked).length;
          const progressPercent = Math.round((pickedItems / totalItems) * 100);
          const isFinished = order.orderStatus === 'packed' || order.orderStatus === 'delivered';

          return (
            <div
              key={order.id}
              className={`p-4 rounded-2xl border transition-all ${
                order.orderStatus === 'picking'
                  ? 'border-fio-400 bg-fio-50/60 shadow-md ring-2 ring-fio-300'
                  : 'border-fio-200 hover:border-fio-300 bg-white'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Info Cliente */}
                <div className="space-y-1.5 min-w-[240px]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-fio-900 bg-fio-100 px-2 py-0.5 rounded-lg">
                      {order.orderNumber}
                    </span>
                    {getStatusBadge(order.orderStatus)}
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatShortDate(order.createdAt)}
                    </span>
                  </div>

                  <h3 className="font-bubble font-bold text-base text-gray-800">{order.customerName}</h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      {order.customerPhone}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-fio-pink" />
                      {order.deliveryMethod === 'envio' ? 'Envío a domicilio' : 'Retiro en taller'}
                    </span>
                    <span className="font-bold text-fio-800">{formatCRC(order.total)}</span>
                  </div>
                </div>

                {/* Barra de Progreso de Alisto */}
                <div className="flex-1 max-w-xs">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-600">Progreso de Alisto</span>
                    <span className="text-fio-800 font-bold">
                      {pickedItems}/{totalItems} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isFinished ? 'bg-emerald-500' : 'bg-gradient-to-r from-fio-400 to-fio-pink'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex items-center gap-2 shrink-0">
                  {!isFinished ? (
                    <button
                      onClick={() => startPicking(order.id)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-semibold text-xs shadow-clayBtn transition-all active:scale-95"
                    >
                      <QrCode className="w-4 h-4 text-fio-yellow" />
                      <span>{order.orderStatus === 'picking' ? 'Continuar Alisto QR' : 'Iniciar Alisto QR'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setInvoiceOrder(order)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-fio-100 text-fio-800 hover:bg-fio-200 font-bubble text-xs font-semibold transition-all"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-fio-600" />
                        <span>Ver Factura</span>
                      </button>

                      {order.orderStatus === 'packed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="px-3 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bubble text-xs font-semibold transition-all"
                        >
                          Marcar Entregado
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
