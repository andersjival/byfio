import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCRC, formatShortDate, getWhatsAppLink } from '../../utils/formatters';
import { X, Printer, MessageCircle, CheckCircle2, Heart, MapPin, Phone, Building2 } from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const { invoiceOrder, setInvoiceOrder } = useApp();

  useEffect(() => {
    if (invoiceOrder) {
      document.body.classList.add('invoice-open');
    } else {
      document.body.classList.remove('invoice-open');
    }
    return () => {
      document.body.classList.remove('invoice-open');
    };
  }, [invoiceOrder]);

  if (!invoiceOrder) return null;

  const handlePrint = () => {
    document.body.classList.add('invoice-open');
    setTimeout(() => {
      window.print();
    }, 50);
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
    msg += `📍 *Ubicación Taller:* 200 sur del parque de Tibás, San José (MAYO10 / by.fio)\n`;
    msg += `¡Gracias por apoyar el talento y creatividad costarricense! 🇨🇷✨`;
    return msg;
  };

  return (
    <div className="invoice-modal-overlay fixed inset-0 z-[80] overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-2 sm:p-5 animate-fadeIn">
      <div className="invoice-modal-card relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Barra Superior de Control en Pantalla (Oculta al Imprimir) */}
        <div className="invoice-header-bar no-print p-4 sm:p-5 border-b border-slate-200/70 flex items-center justify-between bg-[#F1F2F6] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white shadow-neuBtn flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 leading-tight">
                Reporte &amp; Comprobante Oficial — {invoiceOrder.orderNumber}
              </h3>
              <p className="text-[11px] text-slate-500 font-sans">
                Formato estándar para impresión en papel Carta / A4 o descarga PDF
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-bold text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
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

        {/* Factura Imprimible - Formato Hoja Carta / A4 Normal */}
        <div
          id="printable-invoice"
          className="p-4 sm:p-8 bg-white space-y-5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* CABECERA OFICIAL CON COLOR DE LA MARCA */}
          <div className="print-brand-header bg-gradient-to-r from-[#581C87] via-[#6B21A8] to-[#7E22CE] text-white p-5 sm:p-6 rounded-2xl relative overflow-hidden shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              {/* Identidad de Marca by.fio */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bubble font-bold text-3xl sm:text-4xl text-white tracking-tight drop-shadow-sm">
                    by.fio
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] inline-block shadow-sm" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-fio-100 bg-white/15 px-2 py-0.5 rounded-md border border-white/20">
                    Costa Rica 🇨🇷
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-fio-100 font-medium">
                  Talleres Creativos &amp; Tienda de Papelería Personalizada
                </p>
                <div className="text-[11px] text-fio-200/90 space-y-0.5 pt-1 font-sans">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                    <span>200 sur del parque de Tibás, San José, CR (MAYO10 / by.fio)</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                    <span>WhatsApp Oficial: +506 6400-4640 • Tienda: byfiocr.pages.dev</span>
                  </p>
                </div>
              </div>

              {/* Recuadro de Factura Oficial de Alta Visibilidad */}
              <div className="print-contrast-box bg-white text-slate-900 rounded-xl p-3 sm:p-4 border-2 border-slate-900 shadow-md text-left sm:text-right shrink-0 min-w-[200px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-fio-900 bg-fio-100 border border-fio-200 px-2 py-0.5 rounded inline-block mb-1">
                  Comprobante / Factura Oficial
                </span>
                <div className="font-mono font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
                  {invoiceOrder.orderNumber}
                </div>
                <p className="text-[11px] text-slate-600 mt-1 font-sans">
                  <strong className="text-slate-800">Fecha:</strong> {formatShortDate(invoiceOrder.createdAt)}
                </p>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span>PAGADO &amp; VERIFICADO ✅</span>
                </div>
              </div>
            </div>
          </div>

          {/* DATOS DEL CLIENTE Y ENTREGA - LÍNEAS NÍTIDAS Y SÓLIDAS */}
          <div className="print-section-box grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border-2 border-slate-400 bg-slate-50/70 text-xs text-slate-800">
            <div className="space-y-1 sm:border-r sm:border-slate-300 sm:pr-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block pb-0.5 border-b border-slate-300">
                Datos del Cliente
              </span>
              <p className="font-bold text-sm text-slate-900 pt-1">{invoiceOrder.customerName}</p>
              <p className="text-slate-700">
                <strong className="text-slate-800">Teléfono / WhatsApp:</strong> {invoiceOrder.customerPhone}
              </p>
              <p className="text-slate-500 text-[11px]">Cliente Registrado en Plataforma by.fio</p>
            </div>

            <div className="space-y-1 sm:pl-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block pb-0.5 border-b border-slate-300">
                Modalidad &amp; Destino de Entrega
              </span>
              <p className="font-bold text-slate-900 pt-1">
                {invoiceOrder.deliveryMethod === 'envio'
                  ? '🚚 Envío por Correos de Costa Rica'
                  : '🛍️ Retiro en Taller Creativo (Tibás)'}
              </p>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                <strong className="text-slate-800">Dirección:</strong>{' '}
                {invoiceOrder.shippingAddress || '200 sur del parque de Tibás, San José (MAYO10 / by.fio)'}
              </p>
              <p className="text-slate-500 text-[11px]">
                <strong className="text-slate-800">Medio de Pago:</strong>{' '}
                {invoiceOrder.paymentMethod === 'sinpe' ? 'SINPE Móvil' : 'Transferencia Bancaria / BCR'}
              </p>
            </div>
          </div>

          {/* TABLA DE ARTÍCULOS CON TODAS LAS LÍNEAS VISIBLES Y DEFINIDAS */}
          <div className="overflow-x-auto print-avoid-break">
            <table className="print-table w-full text-left text-xs border-collapse border-2 border-slate-400">
              <thead>
                <tr className="bg-slate-100 text-slate-800 text-[10px] font-bold uppercase">
                  <th className="py-2.5 px-3 border border-slate-400 text-center w-10">#</th>
                  <th className="py-2.5 px-3 border border-slate-400">Ítem &amp; Descripción</th>
                  <th className="py-2.5 px-3 border border-slate-400 text-center w-28">SKU</th>
                  <th className="py-2.5 px-3 border border-slate-400 text-center w-16">Cant.</th>
                  <th className="py-2.5 px-3 border border-slate-400 text-right w-28">Precio Unit.</th>
                  <th className="py-2.5 px-3 border border-slate-400 text-right w-28">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoiceOrder.items.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="py-2.5 px-3 border border-slate-300 text-center font-mono text-slate-600">
                      {index + 1}
                    </td>
                    <td className="py-2.5 px-3 border border-slate-300">
                      <p className="font-bold text-slate-900 leading-snug">{item.name}</p>
                      {item.customText && (
                        <div className="mt-1 px-2 py-0.5 rounded bg-purple-50 border border-purple-200 text-fio-800 text-[10px] font-semibold inline-block">
                          ✨ Personalización: "{item.customText}"
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 border border-slate-300 text-center font-mono text-[10px] text-slate-600">
                      {item.sku}
                    </td>
                    <td className="py-2.5 px-3 border border-slate-300 text-center font-bold text-slate-800">
                      {item.quantity}
                    </td>
                    <td className="py-2.5 px-3 border border-slate-300 text-right text-slate-700 font-mono">
                      {formatCRC(item.price)}
                    </td>
                    <td className="py-2.5 px-3 border border-slate-300 text-right font-bold text-slate-900 font-mono">
                      {formatCRC(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* DESGLOSE DE TOTALES Y CUENTAS BANCARIAS OFICIALES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 print-avoid-break">
            {/* Cuentas Oficiales y Horarios */}
            <div className="print-section-box p-3.5 rounded-xl border-2 border-slate-300 bg-slate-50/80 text-[11px] space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 pb-1 border-b border-slate-300">
                <Building2 className="w-3.5 h-3.5 text-fio-800" />
                Cuentas Bancarias Oficiales by.fio
              </span>
              <p className="text-slate-800">
                <strong className="text-slate-900">• SINPE Móvil:</strong> 6400-4640 (Fiorella Patricia Jara Gutiérrez)
              </p>
              <p className="text-slate-800">
                <strong className="text-slate-900">• Banco de Costa Rica (BCR):</strong>
              </p>
              <p className="text-slate-600 font-mono text-[10px] pl-2">
                Ahorros: 00126752891 • IBAN: CR09015202001267528911
              </p>
              <p className="text-slate-600 text-[10px] pt-1 border-t border-slate-200">
                📍 Taller Tibás: Lun/Mar/Vie 9am-5pm • Jue 10am-4pm • Sáb 10am-3pm
              </p>
            </div>

            {/* Resumen de Montos con Líneas Sólidas */}
            <div className="border-2 border-slate-400 rounded-xl overflow-hidden bg-white text-xs">
              <div className="divide-y divide-slate-300">
                <div className="p-2.5 px-4 flex justify-between text-slate-700 bg-slate-50/50">
                  <span>Subtotal Artículos:</span>
                  <span className="font-mono font-semibold">{formatCRC(invoiceOrder.subtotal)}</span>
                </div>
                <div className="p-2.5 px-4 flex justify-between text-slate-700 bg-slate-50/50">
                  <span>Costo de Envío:</span>
                  <span className="font-mono font-semibold">
                    {invoiceOrder.shippingFee === 0 ? 'Gratis (Retiro)' : formatCRC(invoiceOrder.shippingFee)}
                  </span>
                </div>
                <div className="p-3 px-4 flex justify-between items-center bg-slate-100 font-bubble font-bold text-sm sm:text-base text-slate-900 border-t-2 border-slate-400">
                  <span className="text-slate-800">TOTAL OFICIAL:</span>
                  <span className="font-mono text-emerald-800 text-base sm:text-lg">
                    {formatCRC(invoiceOrder.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PIE DE FACTURA LEGAL / GARANTÍA */}
          <div className="pt-3 border-t-2 border-slate-300 text-center space-y-1 print-avoid-break">
            <p className="text-[10px] text-slate-500 font-sans">
              Documento emitido por la plataforma comercial by.fio — Válido como comprobante oficial de compra y alistado de taller.
            </p>
            <p className="text-center text-xs text-fio-800 font-bubble font-bold flex items-center justify-center gap-1.5 pt-0.5">
              <Heart className="w-3.5 h-3.5 text-pink-500 fill-current" />
              <span>¡Muchas gracias por apoyar el talento y diseño artesanal costarricense!</span>
            </p>
          </div>
        </div>

        {/* Barra Inferior de Acciones (Oculta al Imprimir) */}
        <div className="invoice-actions-bar no-print p-4 border-t border-slate-200 bg-[#F1F2F6] flex flex-col sm:flex-row gap-2 justify-end shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble text-xs font-bold shadow-md active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Factura / Guardar PDF</span>
          </button>
          <a
            href={getWhatsAppLink(invoiceOrder.customerPhone, generateWhatsAppMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bubble text-xs font-bold shadow-md active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Enviar por WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => setInvoiceOrder(null)}
            className="py-2.5 px-4 rounded-2xl neu-btn text-slate-700 font-bubble text-xs font-bold active:scale-95 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
