import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCRC } from '../../utils/formatters';
import { DollarSign, TrendingUp, Calendar, Clock, CheckCircle2, AlertCircle, FileSpreadsheet } from 'lucide-react';

interface CashRegisterReportsProps {
  onOpenDailyClosing: () => void;
}

export const CashRegisterReports: React.FC<CashRegisterReportsProps> = ({ onOpenDailyClosing }) => {
  const { orders, products } = useApp();
  const [timeRange, setTimeRange] = useState<'today' | 'week'>('today');

  const todayStr = new Date().toISOString().slice(0, 10);
  const oneWeekAgoMs = Date.now() - 7 * 24 * 60 * 60 * 1000;

  // Filtrado por fecha
  const filteredOrders = orders.filter((o) => {
    const orderDate = new Date(o.createdAt);
    if (timeRange === 'today') {
      return orderDate.toISOString().slice(0, 10) === todayStr;
    }
    return orderDate.getTime() >= oneWeekAgoMs;
  });

  const totalSales = filteredOrders.reduce((acc, o) => acc + o.total, 0);

  // Estimación de Costos y Ganancias Reales
  const totalCost = filteredOrders.reduce((acc, o) => {
    const orderCost = o.items.reduce((itemAcc, it) => {
      const prod = products.find((p) => p.sku === it.sku);
      const unitCost = prod ? prod.costPrice : it.price * 0.4;
      return itemAcc + unitCost * it.quantity;
    }, 0);
    return acc + orderCost;
  }, 0);

  const estimatedProfit = Math.max(0, totalSales - totalCost);
  const completedOrders = filteredOrders.filter((o) => o.orderStatus === 'packed' || o.orderStatus === 'delivered');
  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'picking');

  const sinpeTotal = filteredOrders.filter((o) => o.paymentMethod === 'sinpe').reduce((acc, o) => acc + o.total, 0);
  const transferTotal = filteredOrders.filter((o) => o.paymentMethod !== 'sinpe').reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="bg-white rounded-3xl border border-fio-200 shadow-clay p-5 sm:p-6 mb-8">
      {/* Encabezado y Filtro Día / Semana */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-fio-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-fio-800" />
            <h2 className="font-bubble font-bold text-xl text-fio-900">Registro de Caja & Reportería</h2>
          </div>
          <p className="text-xs text-gray-500">
            Control en tiempo real de ventas, ganancias, métodos de pago y pedidos pendientes de despacho.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Selector Día vs Semana */}
          <div className="flex bg-fio-100 p-1 rounded-2xl border border-fio-200">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeRange === 'today' ? 'bg-white text-fio-800 shadow-sm' : 'text-gray-600'
              }`}
            >
              Caja del Día (Hoy)
            </button>
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeRange === 'week' ? 'bg-white text-fio-800 shadow-sm' : 'text-gray-600'
              }`}
            >
              Semana (7 días)
            </button>
          </div>

          <button
            onClick={onOpenDailyClosing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble text-xs font-bold shadow-clayBtn transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-fio-yellow" />
            <span>Cierre de Caja Oficial</span>
          </button>
        </div>
      </div>

      {/* Grid de Métricas Principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-tr from-purple-50 to-fio-100/50 p-4 rounded-3xl border border-fio-200 shadow-claySm">
          <span className="text-[11px] font-bold text-gray-500 uppercase">
            {timeRange === 'today' ? 'Ventas de Hoy' : 'Ventas de la Semana'}
          </span>
          <h3 className="text-2xl font-bubble font-bold text-fio-900 mt-1">{formatCRC(totalSales)}</h3>
          <p className="text-[11px] text-gray-500 mt-0.5">{filteredOrders.length} pedido(s) recibidos</p>
        </div>

        <div className="bg-gradient-to-tr from-emerald-50 to-emerald-100/40 p-4 rounded-3xl border border-emerald-200 shadow-claySm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase">Ganancia Neta Est.</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bubble font-bold text-emerald-800 mt-1">{formatCRC(estimatedProfit)}</h3>
          <p className="text-[11px] text-emerald-600 mt-0.5">Descontando costo insumos</p>
        </div>

        <div className="bg-gradient-to-tr from-blue-50 to-blue-100/40 p-4 rounded-3xl border border-blue-200 shadow-claySm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-800 uppercase">Pedidos Atendidos</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bubble font-bold text-blue-900 mt-1">{completedOrders.length}</h3>
          <p className="text-[11px] text-blue-600 mt-0.5">Empacados o entregados</p>
        </div>

        <div className="bg-gradient-to-tr from-amber-50 to-amber-100/40 p-4 rounded-3xl border border-amber-200 shadow-claySm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase">Pedidos Pendientes</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-2xl font-bubble font-bold text-amber-900 mt-1">{pendingOrders.length}</h3>
          <p className="text-[11px] text-amber-700 mt-0.5">Por alistar en cola FIFO</p>
        </div>
      </div>

      {/* Desglose de Canales de Cobro (SINPE vs Transferencia) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-fio-50/50 p-4 rounded-3xl border border-fio-200">
        <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-fio-100 shadow-sm">
          <div>
            <span className="text-xs font-bold text-fio-pink flex items-center gap-1">
              📲 Recaudado vía SINPE Móvil (6400-4640)
            </span>
            <p className="text-xs text-gray-500 mt-0.5">
              {filteredOrders.filter((o) => o.paymentMethod === 'sinpe').length} transacciones verificadas
            </p>
          </div>
          <span className="font-bubble font-bold text-lg text-gray-900">{formatCRC(sinpeTotal)}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-fio-100 shadow-sm">
          <div>
            <span className="text-xs font-bold text-fio-800 flex items-center gap-1">
              🏦 Transferencia Bancaria / Tarjeta
            </span>
            <p className="text-xs text-gray-500 mt-0.5">
              {filteredOrders.filter((o) => o.paymentMethod !== 'sinpe').length} transacciones
            </p>
          </div>
          <span className="font-bubble font-bold text-lg text-gray-900">{formatCRC(transferTotal)}</span>
        </div>
      </div>
    </div>
  );
};
