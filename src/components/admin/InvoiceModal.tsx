import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCRC, formatShortDate, getWhatsAppLink } from '../../utils/formatters';
import { X, Printer, MessageCircle, CheckCircle2, Heart } from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const { invoiceOrder, setInvoiceOrder } = useApp();

  if (!invoiceOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const generateWhatsAppMessage = () => {
    let msg = `¡Hola *${invoiceOrder.customerName}*! 💜✨\n\n`;
    msg += `¡Tu pedido *${invoiceOrder.orderNumber}* de *by.fio* ya está 100% empacado y listo!\n\n`;
    msg += `📦 *Detalle del Pedido:*\n`;
    invoiceOrder.items.forEach((it) => {
      msg += `• ${it.quantity}x ${it.name} ${it.customText ? `("${it.customText}")` : ''}\n`;
    });
    msg += `\n*Total:* ${formatCRC(invoiceOrder.total)}\n`;
    msg += `*Entrega:* ${invoiceOrder.deliveryMethod === 'envio' ? 'En ruta con Correos de Costa Rica 🚚' : 'Listo para retiro en taller 🛍️'}\n\n`;
    msg += `¡Gracias por apoyar el talento y creatividad costarricense! 🇨🇷✨`;
    return msg;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Barra Superior Fija (Nunca se Recorta) */}
        <div className="p-4 sm:p-5 border-b border-slate-200/70 flex items-center justify-between bg-[#F1F2F6] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white shadow-neuBtn flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 leading-tight">
                Reporte &amp; Comprobante Oficial — {invoiceOrder.orderNumber}
              </h3>
              <p className="text-[11px] text-slate-500 font-sans">
                Alistado y verificado en el sistema by.fio
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bubble font-bold text-xs border border-slate-200 shadow-neuBtn flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
            <button
              type="button"
              onClick={() => setInvoiceOrder(null)}
              className="w-8 h-8 neu-btn-circle text-slate-500 hover:text-slate-800 transition-colors"
              title="Cerrar ventana"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Factura Imprimible con Scroll Suave */}
        <div id="printable-invoice" className="p-5 sm:p-6 bg-white space-y-5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Encabezado del Reporte */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-dashed border-gray-300 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bubble font-bold text-2xl text-fio-800">by.fio</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Costa Rica</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">Talleres Creativos &amp; Tienda de Personalizados</p>
              <p className="text-xs text-slate-500">San José, Costa Rica &bull; WhatsApp: 6400-4640</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="font-mono font-bold text-base text-fio-900 bg-purple-50 border border-purple-200 px-3.5 py-1 rounded-xl inline-block">
                {invoiceOrder.orderNumber}
              </span>
              <p className="text-xs text-slate-500 mt-1 font-sans">Fecha: {formatShortDate(invoiceOrder.createdAt)}</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 mt-1">
                Alistado &amp; Verificado con QR ✅
              </span>
            </div>
          </div>

          {/* Datos Cliente */}
          <div className="bg-fio-50/60 rounded-2xl p-3 border border-fio-100 text-xs grid grid-cols-2 gap-2">
            <div>
              <p className="text-gray-400 text-[10px] uppercase font-semibold">Cliente:</p>
              <p className="font-bold text-gray-800">{invoiceOrder.customerName}</p>
              <p className="text-gray-600">{invoiceOrder.customerPhone}</p>
            </div>
            <div>
              <p className="text-gray-400 text-[10px] uppercase font-semibold">Modalidad de Entrega:</p>
              <p className="font-bold text-gray-800">
                {invoiceOrder.deliveryMethod === 'envio' ? 'Envío por Correos de CR' : 'Retiro en Taller by.fio'}
              </p>
              {invoiceOrder.shippingAddress && (
                <p className="text-gray-500 line-clamp-1">{invoiceOrder.shippingAddress}</p>
              )}
            </div>
          </div>

          {/* Tabla de Artículos */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 text-[10px] font-bold uppercase">
                  <th className="py-2">Ítem & SKU</th>
                  <th className="py-2 text-center">Cant.</th>
                  <th className="py-2 text-right">Precio</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoiceOrder.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2.5">
                      <p className="font-bold text-gray-800">{item.name}</p>
                      <span className="font-mono text-[10px] text-fio-600">{item.sku}</span>
                      {item.customText && (
                        <p className="text-[10px] text-fio-pink font-semibold">✨ "{item.customText}"</p>
                      )}
                    </td>
                    <td className="py-2.5 text-center font-semibold text-gray-700">{item.quantity}</td>
                    <td className="py-2.5 text-right text-gray-600">{formatCRC(item.price)}</td>
                    <td className="py-2.5 text-right font-bold text-gray-900">
                      {formatCRC(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className="border-t border-gray-200 pt-3 space-y-1 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatCRC(invoiceOrder.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Costo de Envío</span>
              <span>{formatCRC(invoiceOrder.shippingFee)}</span>
            </div>
            <div className="flex justify-between font-bubble font-bold text-base text-fio-900 pt-1 border-t border-gray-200">
              <span>Total Pagado</span>
              <span>{formatCRC(invoiceOrder.total)}</span>
            </div>
          </div>

          <p className="text-center text-[11px] text-fio-pink font-medium flex items-center justify-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>¡Gracias por confiar en el arte y pasión de by.fio!</span>
          </p>
        </div>

        {/* Acciones */}
        <div className="p-4 border-t border-fio-200 bg-fio-50/60 flex flex-col sm:flex-row gap-2 justify-end">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bubble text-xs font-semibold"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Factura / PDF</span>
          </button>
          <a
            href={getWhatsAppLink(invoiceOrder.customerPhone, generateWhatsAppMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bubble text-xs font-semibold shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Enviar Comprobante por WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
