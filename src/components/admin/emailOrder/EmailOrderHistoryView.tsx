import React, { useState, useMemo } from 'react';
import { SupplierOrder } from '../../../types';
import { formatCRC } from '../../../utils/formatters';
import { EmailOrderDetailModal } from './EmailOrderDetailModal';
import { Calendar, User, Eye, History, Search } from 'lucide-react';

interface EmailOrderHistoryViewProps {
  orders: SupplierOrder[];
}

type PeriodFilter = 'dia' | 'semana' | 'mes' | 'todos';

export const EmailOrderHistoryView: React.FC<EmailOrderHistoryViewProps> = ({ orders }) => {
  const [period, setPeriod] = useState<PeriodFilter>('dia');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<SupplierOrder | null>(null);

  const filteredOrders = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const sevenDaysAgo = now.getTime() - 7 * 86400000;
    const thirtyDaysAgo = now.getTime() - 30 * 86400000;

    return orders.filter((o) => {
      const t = new Date(o.receivedAt || o.createdAt).getTime();
      if (period === 'dia') return t >= startOfToday;
      if (period === 'semana') return t >= sevenDaysAgo;
      if (period === 'mes') return t >= thirtyDaysAgo;
      return true;
    }).filter((o) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return o.supplierName.toLowerCase().includes(q) || (o.invoiceNumber && o.invoiceNumber.toLowerCase().includes(q)) || (o.loadedBy && o.loadedBy.toLowerCase().includes(q));
    });
  }, [orders, period, search]);

  const formatDateTime = (isoDate?: string) => {
    if (!isoDate) return 'Fecha no reg.';
    const d = new Date(isoDate);
    return isNaN(d.getTime()) ? isoDate : d.toLocaleString('es-CR', { dateStyle: 'short', timeStyle: 'short' });
  };

  return (
    <div className="bg-white rounded-3xl border border-fio-200 shadow-clay p-5 sm:p-6 space-y-4 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bubble font-black text-base sm:text-lg text-slate-900">Historial de Cargas de Pedidos</h3>
            <p className="text-[11px] text-slate-500">Pedidos y facturas ingresados al inventario ({filteredOrders.length} registros)</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl shrink-0">
          {(['dia', 'semana', 'mes', 'todos'] as PeriodFilter[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
                period === p ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {p === 'dia' ? 'Hoy' : p === 'semana' ? 'Semana' : p === 'mes' ? 'Mes' : 'Todos'}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por proveedor, factura o usuario..."
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-10 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-xs text-slate-500">No hay pedidos ingresados en este período ({period}).</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
          {filteredOrders.map((ord) => (
            <div key={ord.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bubble font-bold text-sm text-slate-900">{ord.supplierName}</span>
                  {ord.source === 'email' && <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">Correo XML</span>}
                  {ord.invoiceNumber && <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">#{ord.invoiceNumber}</span>}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-purple-600" /><span>{formatDateTime(ord.receivedAt || ord.createdAt)}</span></span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-purple-600" /><span>Ingresó: <strong className="text-slate-700">{ord.loadedBy || 'Administración'}</strong></span></span>
                  <span>•</span>
                  <span>{ord.totalUnits} uds ({ord.items?.length || 0} ítems)</span>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total</span>
                  <span className="font-bubble font-bold text-sm text-purple-900">{formatCRC(ord.totalCost)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(ord)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bubble text-xs font-bold border border-purple-200 cursor-pointer transition-transform active:scale-95"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver Detalle</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && <EmailOrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  );
};
