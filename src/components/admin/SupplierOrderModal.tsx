import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCRC, getWhatsAppLink } from '../../utils/formatters';
import { X, Printer, MessageCircle, AlertTriangle, CheckCircle } from 'lucide-react';

export const SupplierOrderModal: React.FC = () => {
  const { isSupplierModalOpen, setIsSupplierModalOpen, products } = useApp();

  if (!isSupplierModalOpen) return null;

  const criticalItems = products
    .filter((p) => p.stock <= p.minStock)
    .map((p) => {
      const orderQty = Math.max(0, p.maxStock - p.stock);
      const estCost = orderQty * p.costPrice;
      return { ...p, orderQty, estCost };
    });

  const totalReplenishUnits = criticalItems.reduce((acc, i) => acc + i.orderQty, 0);
  const totalReplenishCost = criticalItems.reduce((acc, i) => acc + i.estCost, 0);

  const generateWhatsAppMessage = () => {
    let msg = `*ORDEN DE REPOSICIÓN BY.FIO - ${new Date().toLocaleDateString('es-CR')}*\n`;
    msg += `Solicitud de compra para insumos y productos críticos:\n\n`;
    criticalItems.forEach((i, idx) => {
      msg += `${idx + 1}. *${i.sku}* - ${i.name}\n   👉 Pedir: *${i.orderQty} ${i.unit}* (Stock actual: ${i.stock}/${i.maxStock})\n`;
    });
    msg += `\nTotal unidades: ${totalReplenishUnits}\n¡Favor confirmar disponibilidad y factura!`;
    return msg;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-clayLg border-2 border-fio-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-fio-200 flex items-center justify-between bg-fio-100/60">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <div>
              <h3 className="font-bubble font-bold text-lg text-fio-900">
                Lista de Compra a Proveedor (Stock Crítico)
              </h3>
              <p className="text-[11px] text-gray-500">
                Cálculo automático de unidades faltantes para alcanzar el stock máximo.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSupplierModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-5">
          {criticalItems.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto text-emerald-500 mb-2" />
              <p className="font-bubble text-base text-gray-800">¡Todo el inventario está en niveles óptimos!</p>
              <p className="text-xs text-gray-400">No hay artículos por debajo del stock mínimo.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 font-semibold uppercase text-[10px]">
                      <th className="py-2">SKU & Ítem</th>
                      <th className="py-2 text-center">Stock Actual</th>
                      <th className="py-2 text-center">Meta Máx</th>
                      <th className="py-2 text-center text-red-600 font-bold">A Pedir</th>
                      <th className="py-2 text-right">Costo Est.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {criticalItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-2.5">
                          <span className="font-mono font-bold text-fio-800">{item.sku}</span>
                          <p className="text-gray-800">{item.name}</p>
                        </td>
                        <td className="py-2.5 text-center text-red-600 font-bold">{item.stock}</td>
                        <td className="py-2.5 text-center text-gray-500">{item.maxStock}</td>
                        <td className="py-2.5 text-center font-bold text-fio-900 bg-amber-50 rounded-lg">
                          +{item.orderQty} {item.unit}
                        </td>
                        <td className="py-2.5 text-right font-semibold text-gray-700">
                          {formatCRC(item.estCost)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Resumen */}
              <div className="p-4 bg-fio-50 rounded-2xl border border-fio-200 flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
                <div>
                  <p className="text-xs text-gray-600">Total ítems críticos: <strong>{criticalItems.length}</strong></p>
                  <p className="text-xs text-gray-600">Unidades a reponer: <strong>{totalReplenishUnits}</strong></p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-gray-500 uppercase font-semibold">Inversión Estimada:</span>
                  <p className="text-xl font-bubble font-bold text-fio-900">{formatCRC(totalReplenishCost)}</p>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-bubble text-xs font-semibold"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Orden</span>
                </button>
                <a
                  href={getWhatsAppLink('64004640', generateWhatsAppMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bubble text-xs font-semibold shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar por WhatsApp a Proveedor</span>
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
