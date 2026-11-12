import React from 'react';
import { Customer, Order, OrderStatus } from '../../types';
import { CustomerPurchaseSummary } from '../../utils/customerPurchases';
import { formatCRC, formatShortDate } from '../../utils/formatters';
import { formatPaymentMethodLabel, isLayawayReservationOrder, isLayawaySaleOrder } from '../../utils/layaway';
import { X, ShoppingBag, Crown, Trophy, Receipt, Calendar, CreditCard, Truck, Store } from 'lucide-react';

interface CustomerPurchaseHistoryModalProps {
  customer: Customer | null;
  summary: CustomerPurchaseSummary | null;
  vipMinPurchases: number;
  onClose: () => void;
  onViewInvoice: (order: Order) => void;
  onSelectForBilling?: (customer: Customer) => void;
}

const STATUS_LABELS: Record<OrderStatus, { text: string; cls: string }> = {
  pending: { text: 'Pendiente', cls: 'bg-amber-100 text-amber-800 border-amber-200' },
  picking: { text: 'En Alisto', cls: 'bg-sky-100 text-sky-800 border-sky-200' },
  packing: { text: 'En Empaque', cls: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  packed: { text: 'Empacado', cls: 'bg-purple-100 text-purple-800 border-purple-200' },
  delivered: { text: 'Entregado', cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
};

export const CustomerPurchaseHistoryModal: React.FC<CustomerPurchaseHistoryModalProps> = ({
  customer,
  summary,
  vipMinPurchases,
  onClose,
  onViewInvoice,
  onSelectForBilling,
}) => {
  if (!customer || !summary) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-purple-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-fio-800 via-fio-purple to-fio-pink text-white flex items-start justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bubble font-bold text-base sm:text-lg truncate">
                Historial de Compras — {customer.name}
              </h3>
              {summary.isVip && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-bubble font-black shadow-2xs">
                  <Crown className="w-3 h-3" /> Cliente VIP (≥ {vipMinPurchases})
                </span>
              )}
              {summary.topRank && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bubble font-bold border border-white/30">
                  <Trophy className="w-3 h-3 text-fio-yellow" /> Top #{summary.topRank} Más Compras
                </span>
              )}
            </div>
            <p className="text-[11px] text-purple-100 font-sans mt-0.5">
              {customer.phone || 'Sin teléfono'}{customer.email ? ` • ${customer.email}` : ''}
              {customer.createdAt ? ` • Registrado: ${formatShortDate(customer.createdAt)}` : ''}
              {customer.createdBy ? ` (Por: ${customer.createdBy})` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* KPIs Resumen */}
        <div className="grid grid-cols-3 gap-2.5 p-4 bg-slate-50 border-b border-slate-200/80 shrink-0">
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200/80 text-center">
            <p className="text-[10px] font-bold uppercase text-slate-400">Compras</p>
            <p className="font-bubble font-black text-base sm:text-lg text-fio-900">{summary.count}</p>
          </div>
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200/80 text-center">
            <p className="text-[10px] font-bold uppercase text-slate-400">Total Invertido</p>
            <p className="font-bubble font-black text-base sm:text-lg text-emerald-700">{formatCRC(summary.totalSpent)}</p>
          </div>
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200/80 text-center">
            <p className="text-[10px] font-bold uppercase text-slate-400">Última Compra</p>
            <p className="font-bubble font-bold text-xs sm:text-sm text-slate-700 mt-1">
              {summary.lastPurchaseAt ? formatShortDate(summary.lastPurchaseAt) : '—'}
            </p>
          </div>
        </div>

        {/* Lista Cronológica de Pedidos */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1 bg-[#F8F9FB]">
          {summary.orders.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-2xl bg-white border border-dashed border-slate-300">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-bubble font-bold text-sm text-slate-700">Sin compras registradas aún</p>
              <p className="text-xs text-slate-500 mt-1">Cuando este cliente realice pedidos o facturación POS aparecerán aquí.</p>
              {onSelectForBilling && (
                <button
                  type="button"
                  onClick={() => { onClose(); onSelectForBilling(customer); }}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-fio-purple hover:bg-purple-700 text-white font-bubble font-bold text-xs cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-fio-yellow" />
                  <span>Facturar / Crear Pedido</span>
                </button>
              )}
            </div>
          ) : (
            summary.orders.map((order) => {
              const st = STATUS_LABELS[order.orderStatus] || STATUS_LABELS.pending;
              const isLayawaySale = isLayawaySaleOrder(order);
              const isLayawayRes = isLayawayReservationOrder(order);

              return (
                <div key={order.id} className="rounded-2xl p-3.5 sm:p-4 bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-black text-xs text-fio-900 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
                        {order.orderNumber}
                      </span>
                      {order.orderTitle && (
                        <span className="text-[11px] font-bubble font-bold text-slate-700">{order.orderTitle}</span>
                      )}
                      {isLayawaySale && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-800 border border-pink-200">
                          Venta apartado
                        </span>
                      )}
                      {isLayawayRes && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          Apartado activo
                        </span>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${st.cls}`}>{st.text}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> {formatShortDate(order.createdAt)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-slate-400" />
                      {formatPaymentMethodLabel(order.paymentMethod)} ({order.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'})
                    </span>
                    <span className="inline-flex items-center gap-1">
                      {order.deliveryMethod === 'envio' ? <Truck className="w-3 h-3 text-slate-400" /> : <Store className="w-3 h-3 text-slate-400" />}
                      {order.deliveryMethod === 'envio' ? 'Envío' : 'Retiro'}
                    </span>
                  </div>

                  <div className="bg-slate-50/90 rounded-xl p-2.5 space-y-1">
                    {order.items?.map((item, i) => (
                      <div key={`${item.id}-${i}`} className="flex items-start justify-between gap-2 text-xs">
                        <span className="text-slate-700">
                          <strong className="font-mono text-fio-800">{item.quantity}x</strong> {item.name}
                          {item.customText && <span className="text-slate-400 italic"> ({item.customText})</span>}
                        </span>
                        <span className="font-mono font-bold text-slate-700 shrink-0">
                          {formatCRC((Number(item.price) || 0) * (Number(item.quantity) || 1))}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-xs font-bubble font-bold text-slate-700">
                      Total: <span className="text-sm font-black text-emerald-700">{formatCRC(order.total)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onViewInvoice(order)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-bold text-[11px] cursor-pointer transition-colors"
                    >
                      <Receipt className="w-3.5 h-3.5 text-fio-yellow" />
                      <span>Ver Comprobante</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
