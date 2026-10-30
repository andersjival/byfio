import React from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { formatCRC, formatShortDate } from '../../utils/formatters';
import { QrCode, FileCheck, Phone, MapPin, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const OrdersQueue: React.FC = () => {
  const { orders, startPicking, setInvoiceOrder, updateOrderStatus } = useApp();

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
          <div className="flex items-center gap-2">
            <h2 className="font-bubble font-bold text-xl text-fio-900">Cola de Pedidos de Clientes (FIFO)</h2>
            <span className="text-xs font-bold text-fio-800 bg-fio-100 px-3 py-0.5 rounded-full">
              {orders.length} pedidos
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Alisto secuencial cronológico por orden de llegada para empaque y despacho.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-purple-50 text-purple-900 px-3 py-1.5 rounded-2xl border border-purple-200 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-fio-pink" />
          <span>Validación paso a paso con Escáner QR</span>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {orders.map((order: Order) => {
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
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatShortDate(order.createdAt)}
                    </span>
                  </div>

                  <h3 className="font-bubble font-bold text-lg text-gray-800">{order.customerName}</h3>

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

                {/* BOTÓN PROMINENTE DE ACCIÓN DE ALISTO */}
                <div className="flex items-center gap-2 shrink-0">
                  {!isFinished ? (
                    <button
                      onClick={() => startPicking(order.id)}
                      className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-bold text-xs sm:text-sm shadow-clayBtn transition-all active:scale-95"
                    >
                      <QrCode className="w-5 h-5 text-fio-yellow animate-bounce" />
                      <span>{order.orderStatus === 'picking' ? 'Continuar Alisto QR' : 'Iniciar Alisto con Escáner QR'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
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
        })}
      </div>
    </div>
  );
};
