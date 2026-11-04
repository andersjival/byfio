import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCRC, getWhatsAppLink } from '../../utils/formatters';
import { X, Printer, MessageCircle, FileSpreadsheet, Heart, Landmark, ShoppingBag, GraduationCap } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface DailyClosingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyClosingModal: React.FC<DailyClosingModalProps> = ({ isOpen, onClose }) => {
  const { orders, products, sinpeTransactions } = useApp();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('closing-report-open');
    } else {
      document.body.classList.remove('closing-report-open');
    }
    return () => {
      document.body.classList.remove('closing-report-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toISOString().slice(0, 10) === todayStr);

  // Transacciones SINPE BCR de hoy
  const todaySinpe = sinpeTransactions.filter(
    (tx) => (tx.createdAt ? tx.createdAt.slice(0, 10) : todayStr) === todayStr
  );
  const sinpeStoreTotal = todaySinpe
    .filter((tx) => tx.category === 'store')
    .reduce((acc, tx) => acc + tx.amount, 0);
  const sinpeWorkshopTotal = todaySinpe
    .filter((tx) => tx.category === 'workshop')
    .reduce((acc, tx) => acc + tx.amount, 0);

  // División de Órdenes Web (Tienda vs Talleres)
  const storeOrdersRevenue = todayOrders
    .filter((o) => o.items.every((it) => it.type !== 'workshop'))
    .reduce((acc, o) => acc + o.total, 0);
  const workshopOrdersRevenue = todayOrders
    .filter((o) => o.items.some((it) => it.type === 'workshop'))
    .reduce((acc, o) => acc + o.total, 0);

  // Totales de Caja Divididos
  const totalStoreSales = storeOrdersRevenue + sinpeStoreTotal;
  const totalWorkshopSales = workshopOrdersRevenue + sinpeWorkshopTotal;
  const totalCashGrand = totalStoreSales + totalWorkshopSales;

  // Costos y ganancia
  const totalCost = todayOrders.reduce((acc, o) => {
    return (
      acc +
      o.items.reduce((iAcc, it) => {
        const prod = products.find((p) => p.sku === it.sku);
        return iAcc + (prod ? prod.costPrice : it.price * 0.4) * it.quantity;
      }, 0)
    );
  }, 0);

  const netProfit = Math.max(0, totalCashGrand - totalCost);
  const sinpeTotal =
    todayOrders.filter((o) => o.paymentMethod === 'sinpe').reduce((acc, o) => acc + o.total, 0) +
    (sinpeStoreTotal + sinpeWorkshopTotal);
  const otherTotal = todayOrders
    .filter((o) => o.paymentMethod !== 'sinpe')
    .reduce((acc, o) => acc + o.total, 0);
  const pendingCount = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'picking').length;

  const handlePrint = () => window.print();

  const generateWhatsAppMessage = () => {
    let msg = `📊 *ACTA OFICIAL DE CIERRE DE CAJA BY.FIO*\n📅 Fecha: ${new Date().toLocaleDateString('es-CR')}\n\n`;
    msg += `💰 *TOTAL RECAUDADO EN CAJA:* ${formatCRC(totalCashGrand)}\n`;
    msg += `  🛍️ *Ventas Tienda & Catálogo:* ${formatCRC(totalStoreSales)}\n`;
    msg += `  🎨 *Ingresos Talleres Creativos:* ${formatCRC(totalWorkshopSales)}\n`;
    msg += `✨ *Ganancia Neta Est.:* ${formatCRC(netProfit)}\n\n`;
    msg += `📲 *SINPE Móvil Total (BCR + Web):* ${formatCRC(sinpeTotal)} (${todaySinpe.length} comprobantes BCR)\n`;
    msg += `🏦 *Otros Medios:* ${formatCRC(otherTotal)}\n\n`;
    msg += `📦 Pedidos atendidos hoy: ${todayOrders.length}\n`;
    msg += `⚠️ Pedidos pendientes en cola: ${pendingCount}\n\n`;
    msg += `¡Excelente jornada creativa! 💜🇨🇷`;
    return msg;
  };

  return (
    <div className="closing-modal-overlay fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="closing-modal-card relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Fijo */}
        <div className="no-print p-4 border-b border-slate-200 flex items-center justify-between bg-[#F1F2F6] shrink-0">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-fio-800" />
            <h3 className="font-bubble font-bold text-sm text-fio-900">Acta de Cierre de Caja Diario</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 neu-btn-circle text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reporte Imprimible */}
        <div id="printable-closing-report" className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-start justify-between border-b border-gray-200 pb-3">
            <div>
              <BrandLogo size="sm" />
              <p className="text-[11px] text-gray-500 mt-0.5">Talleres Creativos &amp; Tienda • WhatsApp: 6400-4640</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-gray-800">Cierre del Día</span>
              <p className="text-[11px] text-gray-400">{new Date().toLocaleDateString('es-CR')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-fio-50 p-3 rounded-2xl border border-fio-200">
            <div>
              <p className="text-gray-500 uppercase text-[10px] font-bold">Total en Caja Hoy:</p>
              <p className="font-bubble font-bold text-xl text-fio-900">{formatCRC(totalCashGrand)}</p>
            </div>
            <div>
              <p className="text-gray-500 uppercase text-[10px] font-bold">Ganancia Estimada:</p>
              <p className="font-bubble font-bold text-xl text-emerald-700">{formatCRC(netProfit)}</p>
            </div>
          </div>

          {/* DIVISIÓN TIENDA Y CATÁLOGO VS TALLERES */}
          <div className="space-y-1.5 pt-1">
            <p className="font-bold text-gray-700 uppercase text-[10px]">División de Ingresos en Caja:</p>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-600 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                Ventas Tienda &amp; Catálogo
              </span>
              <span className="font-bold text-gray-900">{formatCRC(totalStoreSales)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-600 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-pink-600" />
                Ingresos Talleres Creativos
              </span>
              <span className="font-bold text-gray-900">{formatCRC(totalWorkshopSales)}</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <p className="font-bold text-gray-700 uppercase text-[10px]">Desglose por Canal de Cobro:</p>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-600 flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5 text-purple-700" />
                SINPE Móvil (Banco BCR + Web)
              </span>
              <span className="font-bold text-purple-900">{formatCRC(sinpeTotal)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-600">Transferencias y Tarjeta</span>
              <span className="font-bold text-gray-900">{formatCRC(otherTotal)}</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <p className="font-bold text-gray-700 uppercase text-[10px]">Estado Operativo del Taller:</p>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-600">Pedidos Ingresados Hoy</span>
              <span className="font-bold text-gray-900">{todayOrders.length}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-600">Comprobantes BCR SINPE Verificados</span>
              <span className="font-bold text-purple-900">{todaySinpe.length}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-600">Pedidos Pendientes de Alisto</span>
              <span className="font-bold text-fio-pink">{pendingCount}</span>
            </div>
          </div>

          <div className="pt-2 text-center text-[10px] text-gray-400">
            Documento generado automáticamente por sistema contable by.fio • Tibás, San José
          </div>
        </div>

        {/* Acciones Fijas */}
        <div className="no-print p-4 border-t border-slate-200 bg-gray-50 flex items-center justify-between gap-2 shrink-0">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-gray-300 text-gray-700 font-bubble text-xs font-bold shadow-sm hover:bg-gray-50 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4 text-gray-500" />
            <span>Imprimir Cierre</span>
          </button>

          <a
            href={getWhatsAppLink('64004640', generateWhatsAppMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bubble text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Enviar Resumen por WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
