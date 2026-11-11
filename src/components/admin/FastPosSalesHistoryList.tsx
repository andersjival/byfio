import React, { useMemo, useState } from 'react';
import { Receipt, Calendar, DollarSign, Smartphone, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { formatCRC } from '../../utils/formatters';

const toLocalDateKey = (isoOrDate: string | Date): string => {
  const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const isFastPosOrder = (o: Order): boolean =>
  o.orderTitle === 'Facturación Rápida POS' ||
  Boolean(o.notes?.includes('Facturación Rápida POS')) ||
  (o.customerName === 'Cliente Mostrador' && o.customerPhone === '0000-0000');

export const FastPosSalesHistoryList: React.FC = () => {
  const { orders, setInvoiceOrder } = useApp();
  const todayKey = toLocalDateKey(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(todayKey);

  const daySales = useMemo(() => {
    return orders
      .filter((o) => isFastPosOrder(o) && toLocalDateKey(o.createdAt) === selectedDate)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, selectedDate]);

  const summary = useMemo(() => {
    let cash = 0;
    let sinpe = 0;
    let units = 0;
    for (const ord of daySales) {
      if (ord.paymentMethod === 'efectivo') cash += ord.total || 0;
      else sinpe += ord.total || 0;
      for (const it of ord.items || []) {
        units += Number(it.quantity) || 0;
      }
    }
    return { cash, sinpe, total: cash + sinpe, units };
  }, [daySales]);

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-[#ECEEF2] dark:bg-[#1C1830] shadow-neu border border-white/60 dark:border-white/10 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-fio-purple/15 text-fio-purple flex items-center justify-center shrink-0">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-800 dark:text-white leading-tight">
              Historial de Ventas · Facturación Rápida
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {daySales.length} {daySales.length === 1 ? 'venta' : 'ventas'} · {summary.units} {summary.units === 1 ? 'unidad vendida' : 'unidades vendidas'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <Calendar className="w-3.5 h-3.5 text-fio-purple absolute left-2.5 pointer-events-none" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value || todayKey)}
              className="pl-8 pr-2.5 py-1.5 rounded-xl bg-white dark:bg-[#231F3D] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-fio-purple/30"
              aria-label="Fecha del historial POS"
            />
          </div>
          {selectedDate !== todayKey && (
            <button
              type="button"
              onClick={() => setSelectedDate(todayKey)}
              className="px-2.5 py-1.5 rounded-xl bg-fio-purple/10 text-fio-purple text-xs font-bold hover:bg-fio-purple/20 transition-colors"
            >
              Hoy
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="px-3 py-2 rounded-2xl bg-white/80 dark:bg-[#231F3D]/80 border border-white/60 dark:border-white/10">
          <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-600 flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> Efectivo
          </span>
          <p className="text-sm font-bubble font-bold text-slate-800 dark:text-white">{formatCRC(summary.cash)}</p>
        </div>
        <div className="px-3 py-2 rounded-2xl bg-white/80 dark:bg-[#231F3D]/80 border border-white/60 dark:border-white/10">
          <span className="text-[10px] font-bold uppercase tracking-wide text-fio-purple flex items-center gap-1">
            <Smartphone className="w-3 h-3" /> SINPE
          </span>
          <p className="text-sm font-bubble font-bold text-slate-800 dark:text-white">{formatCRC(summary.sinpe)}</p>
        </div>
        <div className="px-3 py-2 rounded-2xl bg-gradient-to-r from-fio-purple/10 to-fuchsia-500/10 border border-fio-purple/20">
          <span className="text-[10px] font-bold uppercase tracking-wide text-fio-purple dark:text-fio-pink">Total Día</span>
          <p className="text-sm font-bubble font-bold text-fio-purple dark:text-white">{formatCRC(summary.total)}</p>
        </div>
      </div>

      {daySales.length === 0 ? (
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 py-5 rounded-2xl bg-white/60 dark:bg-[#231F3D]/50">
          No hay ventas registradas por Facturación Rápida POS en esta fecha.
        </p>
      ) : (
        <ul className="divide-y divide-slate-200/70 dark:divide-white/10 rounded-2xl bg-white/85 dark:bg-[#231F3D]/85 border border-white/60 dark:border-white/10 overflow-hidden">
          {daySales.map((ord) => {
            const timeStr = new Date(ord.createdAt).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
            const isCash = ord.paymentMethod === 'efectivo';
            return (
              <li key={ord.id} className="px-3.5 py-2.5 flex items-center justify-between gap-3 hover:bg-fio-purple/5 transition-colors">
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bubble font-bold text-slate-800 dark:text-white">{ord.orderNumber}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <Clock className="w-3 h-3" /> {timeStr}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isCash ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-fio-purple/15 text-fio-purple dark:text-fuchsia-300'
                    }`}>
                      {isCash ? 'Efectivo' : 'SINPE'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
                    {(ord.items || []).map((it) => `${it.quantity}× ${it.name}`).join(' · ')}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-bubble font-bold text-slate-800 dark:text-white">{formatCRC(ord.total)}</span>
                  <button
                    type="button"
                    onClick={() => setInvoiceOrder(ord)}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-fio-purple transition-colors"
                    title="Ver / Imprimir comprobante"
                  >
                    <Receipt className="w-4 h-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
