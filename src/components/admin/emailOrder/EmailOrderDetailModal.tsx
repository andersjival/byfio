import React from 'react';
import { SupplierOrder } from '../../../types';
import { formatCRC } from '../../../utils/formatters';
import { X, Package, Calendar, User, Receipt, CheckCircle2 } from 'lucide-react';

interface EmailOrderDetailModalProps {
  order: SupplierOrder;
  onClose: () => void;
}

export const EmailOrderDetailModal: React.FC<EmailOrderDetailModalProps> = ({ order, onClose }) => {
  const formattedDateTime = order.receivedAt
    ? new Date(order.receivedAt).toLocaleString('es-CR', { dateStyle: 'short', timeStyle: 'short' })
    : order.createdAt
    ? new Date(order.createdAt).toLocaleString('es-CR', { dateStyle: 'short', timeStyle: 'short' })
    : 'No registrada';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold">
              <Receipt className="w-3.5 h-3.5" />
              <span>Pedido: {order.orderNumber}</span>
            </div>
            <h3 className="font-bubble font-black text-lg text-slate-900 mt-1">{order.supplierName}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Meta info */}
        <div className="p-4 bg-purple-50/50 border-b border-purple-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] block uppercase font-bold">Fecha y Hora</span>
            <span className="font-medium text-slate-800 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              <span>{formattedDateTime}</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block uppercase font-bold">Ingresado por</span>
            <span className="font-medium text-slate-800 flex items-center gap-1 mt-0.5">
              <User className="w-3.5 h-3.5 text-purple-600" />
              <span>{order.loadedBy || 'Administración'}</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block uppercase font-bold">Factura Nº</span>
            <span className="font-mono font-bold text-slate-800 mt-0.5 block">{order.invoiceNumber || 'S/N'}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block uppercase font-bold">Total Factura</span>
            <span className="font-bubble font-bold text-emerald-700 mt-0.5 block">{formatCRC(order.totalCost)}</span>
          </div>
        </div>

        {/* Product Table */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Package className="w-4 h-4 text-purple-600" />
            <span>Productos del Pedido ({order.items?.length || 0} ítems)</span>
          </h4>

          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Producto</th>
                  <th className="py-2 px-3">SKU</th>
                  <th className="py-2 px-3 text-center">Cantidad</th>
                  <th className="py-2 px-3 text-right">Precio Costo</th>
                  <th className="py-2 px-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(order.items || []).map((it, idx) => (
                  <tr key={`${it.sku}-${idx}`} className="hover:bg-slate-50">
                    <td className="py-2 px-3 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-2 px-3 font-semibold text-slate-800">{it.name}</td>
                    <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">{it.sku}</td>
                    <td className="py-2 px-3 text-center font-bold text-purple-700">+{it.orderQty}</td>
                    <td className="py-2 px-3 text-right text-slate-600">{formatCRC(it.cost)}</td>
                    <td className="py-2 px-3 text-right font-bubble font-bold text-slate-900">{formatCRC(it.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Total unidades sumadas al inventario: <strong className="text-slate-800">{order.totalUnits} uds</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-purple-700 text-white font-bubble text-xs font-bold hover:bg-purple-800 cursor-pointer"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
};
