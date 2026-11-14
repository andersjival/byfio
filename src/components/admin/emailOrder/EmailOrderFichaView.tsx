import React from 'react';
import { IncomingEmailOrder } from '../../../types';
import { formatCRC } from '../../../utils/formatters';
import { Building2, Receipt, Calendar, Mail, Phone, Package, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface EmailOrderFichaViewProps {
  order: IncomingEmailOrder;
  onLoadToSystem: () => void;
  isLoading: boolean;
  onDiscard?: () => void;
}

export const EmailOrderFichaView: React.FC<EmailOrderFichaViewProps> = ({
  order,
  onLoadToSystem,
  isLoading,
  onDiscard,
}) => {
  const totalUnits = order.items.reduce((s, it) => s + it.orderQty, 0);

  return (
    <div className="bg-white rounded-3xl border border-fio-200 shadow-clay p-5 sm:p-7 space-y-6 animate-fadeIn">
      {/* Encabezado Ficha del Proveedor */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bubble font-bold border border-emerald-200 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Ficha de Pedido Extraída de Factura Electrónica XML</span>
          </div>
          <h3 className="font-bubble font-black text-xl sm:text-2xl text-slate-900">
            {order.supplierName}
          </h3>
          <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
            <span>Cédula: <strong>{order.supplierLegalId || 'No indicada'}</strong></span>
            <span>•</span>
            <span>Factura: <strong className="font-mono text-purple-700">{order.invoiceNumber}</strong></span>
            <span>•</span>
            <span>Fecha: <strong>{order.entryDate}</strong></span>
          </p>
        </div>

        <div className="text-right bg-purple-50/70 p-3.5 rounded-2xl border border-purple-100 shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 block">Total de Factura</span>
          <span className="text-2xl font-bubble font-black text-purple-900">{formatCRC(order.totalCost)}</span>
          <span className="text-[11px] text-purple-700/80 block mt-0.5">{totalUnits} unidades en {order.items.length} productos</span>
        </div>
      </div>

      {/* Tarjetas de Metadatos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
          <span className="text-slate-500 block text-[10px] uppercase font-bold">Subtotal Neto</span>
          <span className="font-bubble font-bold text-slate-900 text-sm mt-0.5">{formatCRC(order.subtotalAmount)}</span>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
          <span className="text-slate-500 block text-[10px] uppercase font-bold">Impuestos (IVA)</span>
          <span className="font-bubble font-bold text-slate-900 text-sm mt-0.5">{formatCRC(order.taxAmount)}</span>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
          <span className="text-slate-500 block text-[10px] uppercase font-bold">Descuentos</span>
          <span className="font-bubble font-bold text-slate-900 text-sm mt-0.5">{formatCRC(order.discountAmount)}</span>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
          <span className="text-slate-500 block text-[10px] uppercase font-bold">Total a Pagar</span>
          <span className="font-bubble font-bold text-emerald-700 text-sm mt-0.5">{formatCRC(order.totalCost)}</span>
        </div>
      </div>

      {/* Lista de Líneas de Productos */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bubble font-bold text-sm sm:text-base text-slate-800 flex items-center gap-2">
            <Package className="w-4 h-4 text-purple-600" />
            <span>Líneas de la Factura ({order.items.length} productos)</span>
          </h4>
          <span className="text-[11px] text-slate-500 font-medium">Se sumarán al inventario de By.Fio</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Producto / Detalle</th>
                <th className="py-2.5 px-3">Código / SKU</th>
                <th className="py-2.5 px-3 text-center">Cantidad</th>
                <th className="py-2.5 px-3 text-right">Precio Unitario</th>
                <th className="py-2.5 px-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((it, idx) => (
                <tr key={`${it.sku}-${idx}`} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{it.name}</td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{it.sku}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-bold text-xs">
                      +{it.orderQty} uds
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-slate-700">{formatCRC(it.cost)}</td>
                  <td className="py-2.5 px-3 text-right font-bubble font-bold text-slate-900">{formatCRC(it.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Botón Mandatorio: CARGAR AL SISTEMA */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
        <p className="text-[11px] text-slate-500">
          Al pulsar el botón se sumarán automáticamente las unidades correspondientes al inventario.
        </p>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {onDiscard && (
            <button
              type="button"
              onClick={onDiscard}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bubble text-xs font-bold hover:bg-slate-100 cursor-pointer"
            >
              Descartar
            </button>
          )}

          <button
            type="button"
            onClick={onLoadToSystem}
            disabled={isLoading}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bubble font-black text-sm shadow-md hover:shadow-lg transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>{isLoading ? 'Cargando inventario...' : 'CARGAR AL SISTEMA'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
