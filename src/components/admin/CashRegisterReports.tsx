import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCRC } from '../../utils/formatters';
import {
  DollarSign, TrendingUp, Calendar, CheckCircle2, AlertCircle,
  FileSpreadsheet, Landmark, ShoppingBag, GraduationCap,
  Sparkles, ExternalLink, ShieldCheck, Mail
} from 'lucide-react';

interface CashRegisterReportsProps {
  onOpenDailyClosing: () => void;
}

export const CashRegisterReports: React.FC<CashRegisterReportsProps> = ({ onOpenDailyClosing }) => {
  const { orders, products, sinpeTransactions, setIsSinpeModalOpen, workshops } = useApp();
  const [timeRange, setTimeRange] = useState<'today' | 'week'>('today');

  const todayStr = new Date().toISOString().slice(0, 10);
  const oneWeekAgoMs = Date.now() - 7 * 24 * 60 * 60 * 1000;

  // Filtrado de Órdenes por Fecha
  const filteredOrders = orders.filter((o) => {
    const orderDate = new Date(o.createdAt);
    if (timeRange === 'today') {
      return orderDate.toISOString().slice(0, 10) === todayStr;
    }
    return orderDate.getTime() >= oneWeekAgoMs;
  });

  // Filtrado de Transacciones SINPE BCR por Fecha
  const filteredSinpe = sinpeTransactions.filter((tx) => {
    const txDateStr = tx.createdAt ? tx.createdAt.slice(0, 10) : todayStr;
    if (timeRange === 'today') {
      return txDateStr === todayStr;
    }
    const txTime = new Date(tx.createdAt || Date.now()).getTime();
    return txTime >= oneWeekAgoMs;
  });

  // 1. División: Órdenes de Tienda vs Órdenes de Talleres
  const storeOrders = filteredOrders.filter((o) =>
    o.items.every((it) => it.type !== 'workshop')
  );
  const workshopOrders = filteredOrders.filter((o) =>
    o.items.some((it) => it.type === 'workshop')
  );

  const storeOrdersRevenue = storeOrders.reduce((acc, o) => acc + o.total, 0);
  const workshopOrdersRevenue = workshopOrders.reduce((acc, o) => acc + o.total, 0);

  // 2. División de Transacciones SINPE BCR (Tienda vs Talleres)
  const sinpeStoreTotal = filteredSinpe
    .filter((tx) => tx.category === 'store')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const sinpeWorkshopTotal = filteredSinpe
    .filter((tx) => tx.category === 'workshop')
    .reduce((acc, tx) => acc + tx.amount, 0);

  // 3. Totales Agrupados para la Caja
  const totalStoreSales = storeOrdersRevenue + sinpeStoreTotal;
  const totalWorkshopSales = workshopOrdersRevenue + sinpeWorkshopTotal;
  const totalCashIn = totalStoreSales + totalWorkshopSales;

  // Total recaudado vía SINPE (Órdenes pagadas con SINPE + Comprobantes BCR Verificados)
  const ordersSinpeTotal = filteredOrders
    .filter((o) => o.paymentMethod === 'sinpe')
    .reduce((acc, o) => acc + o.total, 0);
  const totalSinpeAll = ordersSinpeTotal + (sinpeStoreTotal + sinpeWorkshopTotal);

  // Estimación de Costos de Insumos y Ganancia
  const totalCost = filteredOrders.reduce((acc, o) => {
    const orderCost = o.items.reduce((itemAcc, it) => {
      const prod = products.find((p) => p.sku === it.sku);
      const unitCost = prod ? prod.costPrice : it.price * 0.4;
      return itemAcc + unitCost * it.quantity;
    }, 0);
    return acc + orderCost;
  }, 0);

  const estimatedProfit = Math.max(0, totalCashIn - totalCost);
  const completedOrders = filteredOrders.filter((o) => o.orderStatus === 'packed' || o.orderStatus === 'delivered');
  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'picking');

  return (
    <div className="bg-white rounded-3xl border border-fio-200 shadow-clay p-5 sm:p-6 mb-8 space-y-6">
      {/* Encabezado y Filtro Día / Semana + Botón SINPE BCR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-fio-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-fio-800" />
            <h2 className="font-bubble font-bold text-xl text-fio-900">
              Registro de Caja &amp; División de Ingresos
            </h2>
            <span className="text-[10px] uppercase font-bold bg-purple-100 text-purple-900 border border-purple-200 px-2 py-0.5 rounded-full">
              Caja Inteligente
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Ingresos divididos automáticamente entre Tienda/Catálogo y Talleres Creativos, con verificación bancaria BCR.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
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

          {/* Botón Verificador y Redirección SINPE BCR */}
          <button
            type="button"
            onClick={() => setIsSinpeModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-purple-800 to-fio-900 hover:from-purple-900 hover:to-black text-white font-bubble text-xs font-bold shadow-md transition-all active:scale-95"
            title="Abrir Centro de Verificación de Pagos SINPE Móvil Banco BCR"
          >
            <Landmark className="w-4 h-4 text-amber-300" />
            <span>Verificador SINPE BCR</span>
            {filteredSinpe.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-400 text-purple-950 ml-0.5">
                {filteredSinpe.length}
              </span>
            )}
          </button>

          <button
            onClick={onOpenDailyClosing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble text-xs font-bold shadow-clayBtn transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-fio-yellow" />
            <span>Cierre de Caja Oficial</span>
          </button>
        </div>
      </div>

      {/* Grid de Métricas Principales (Total en Caja + División Tienda vs Talleres) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL EN CAJA */}
        <div className="bg-gradient-to-tr from-purple-50 via-purple-100/40 to-fio-100/50 p-4 rounded-3xl border-2 border-purple-300 shadow-claySm">
          <span className="text-[11px] font-bold text-purple-900 uppercase block">
            {timeRange === 'today' ? 'Total en Caja (Hoy)' : 'Total en Caja (Semana)'}
          </span>
          <h3 className="text-2xl sm:text-3xl font-bubble font-bold text-purple-950 mt-1">
            {formatCRC(totalCashIn)}
          </h3>
          <p className="text-[11px] text-purple-800 font-medium mt-0.5">
            Tienda + Talleres Creativos
          </p>
        </div>

        {/* DIVISIÓN 1: TIENDA & CATÁLOGO */}
        <div className="bg-gradient-to-tr from-blue-50 to-blue-100/40 p-4 rounded-3xl border border-blue-200 shadow-claySm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-900 uppercase">🛍️ Tienda &amp; Catálogo</span>
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bubble font-bold text-blue-900 mt-1">
            {formatCRC(totalStoreSales)}
          </h3>
          <p className="text-[11px] text-blue-700 mt-0.5">
            {storeOrders.length} pedidos + {filteredSinpe.filter((t) => t.category === 'store').length} SINPE BCR
          </p>
        </div>

        {/* DIVISIÓN 2: TALLERES CREATIVOS */}
        <div className="bg-gradient-to-tr from-pink-50 to-pink-100/40 p-4 rounded-3xl border border-pink-200 shadow-claySm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-pink-900 uppercase">🎨 Talleres Creativos</span>
            <GraduationCap className="w-4 h-4 text-pink-600" />
          </div>
          <h3 className="text-2xl font-bubble font-bold text-pink-900 mt-1">
            {formatCRC(totalWorkshopSales)}
          </h3>
          <p className="text-[11px] text-pink-700 mt-0.5">
            {workshopOrders.length} inscripciones + {filteredSinpe.filter((t) => t.category === 'workshop').length} SINPE BCR
          </p>
        </div>

        {/* GANANCIA ESTIMADA */}
        <div className="bg-gradient-to-tr from-emerald-50 to-emerald-100/40 p-4 rounded-3xl border border-emerald-200 shadow-claySm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-900 uppercase">Ganancia Neta Est.</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bubble font-bold text-emerald-900 mt-1">
            {formatCRC(estimatedProfit)}
          </h3>
          <p className="text-[11px] text-emerald-700 mt-0.5">Descontando costo insumos</p>
        </div>
      </div>

      {/* Desglose de Canales de Cobro (SINPE BCR Verificado vs Otros) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-fio-50/50 p-4 rounded-3xl border border-fio-200">
        <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-fio-100 shadow-sm">
          <div>
            <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-purple-700" />
              Recaudado vía SINPE Móvil (Banco BCR &amp; Oficial)
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              {filteredSinpe.length} comprobantes BCR verificados • {filteredOrders.filter((o) => o.paymentMethod === 'sinpe').length} pedidos web
            </p>
          </div>
          <span className="font-bubble font-bold text-lg text-purple-900">
            {formatCRC(totalSinpeAll)}
          </span>
        </div>

        <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-fio-100 shadow-sm">
          <div>
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Transferencias / Otros Medios en Cola
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              {filteredOrders.filter((o) => o.paymentMethod !== 'sinpe').length} órdenes por transferencia/tarjeta
            </p>
          </div>
          <span className="font-bubble font-bold text-lg text-slate-900">
            {formatCRC(filteredOrders.filter((o) => o.paymentMethod !== 'sinpe').reduce((acc, o) => acc + o.total, 0))}
          </span>
        </div>
      </div>

      {/* SECCIÓN DEDICADA: HISTORIAL EN TIEMPO REAL DE PAGOS SINPE BCR VERIFICADOS */}
      <div className="border border-slate-200 rounded-3xl p-4 sm:p-5 bg-white space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900">
                Pagos SINPE Móvil Acreditados en Caja (Banco BCR)
              </h3>
              <p className="text-[11px] text-slate-500">
                Comprobantes abstraídos con N° de referencia único de <span className="font-mono text-purple-800">mensajero@bancobcr.com</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSinpeModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bubble font-bold transition-all active:scale-95 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span>Verificar / Extraer Correo BCR</span>
          </button>
        </div>

        {sinpeTransactions.length === 0 ? (
          <div className="text-center py-6 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs">No hay transacciones SINPE BCR registradas en esta vista.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2 px-3">Fecha</th>
                  <th className="py-2 px-3">N° Referencia BCR</th>
                  <th className="py-2 px-3">Cliente Origen</th>
                  <th className="py-2 px-3">Destino en Caja</th>
                  <th className="py-2 px-3 text-right">Monto Verificado</th>
                  <th className="py-2 px-2 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sinpeTransactions.slice(0, 5).map((tx) => (
                  <tr key={tx.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="py-2 px-3 text-slate-500 whitespace-nowrap">
                      {tx.transactionDate || tx.createdAt?.slice(0, 10)}
                    </td>
                    <td className="py-2 px-3">
                      <span className="font-mono font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-[11px]">
                        {tx.referenceNumber}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className="font-semibold text-slate-900">{tx.originName}</span>
                      <span className="text-[10px] text-slate-500 block">{tx.originPhone}</span>
                    </td>
                    <td className="py-2 px-3">
                      {tx.category === 'workshop' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-pink-100 text-pink-800 px-2 py-0.5 rounded-md">
                          <GraduationCap className="w-3 h-3 text-pink-600" />
                          {tx.workshopTitle ? tx.workshopTitle.slice(0, 22) + '...' : 'Taller Creativo'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                          <ShoppingBag className="w-3 h-3 text-blue-600" />
                          Tienda &amp; Catálogo
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-right font-bubble font-bold text-slate-900 text-sm whitespace-nowrap">
                      {formatCRC(tx.amount)}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        VERIFICADO
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
