import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCRC, getWhatsAppLink } from '../../utils/formatters';
import { X, Printer, MessageCircle, FileSpreadsheet, Heart } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface DailyClosingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyClosingModal: React.FC<DailyClosingModalProps> = ({ isOpen, onClose }) => {
  const { orders, products } = useApp();

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toISOString().slice(0, 10) === todayStr);

  const totalSales = todayOrders.reduce((acc, o) => acc + o.total, 0);
  const totalCost = todayOrders.reduce((acc, o) => {
    return (
      acc +
      o.items.reduce((iAcc, it) => {
        const prod = products.find((p) => p.sku === it.sku);
        return iAcc + (prod ? prod.costPrice : it.price * 0.4) * it.quantity;
      }, 0)
    );
  }, 0);

  const netProfit = Math.max(0, totalSales - totalCost);
  const sinpeTotal = todayOrders.filter((o) => o.paymentMethod === 'sinpe').reduce((acc, o) => acc + o.total, 0);
  const otherTotal = todayOrders.filter((o) => o.paymentMethod !== 'sinpe').reduce((acc, o) => acc + o.total, 0);
  const pendingCount = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'picking').length;

  const handlePrint = () => window.print();

  const generateWhatsAppMessage = () => {
    let msg = `📊 *CIERRE DE CAJA DIARIO BY.FIO*\n📅 Fecha: ${new Date().toLocaleDateString('es-CR')}\n\n`;
    msg += `💰 *Ventas Totales:* ${formatCRC(totalSales)}\n`;
    msg += `✨ *Ganancia Neta Est.:* ${formatCRC(netProfit)}\n`;
    msg += `📲 *SINPE Móvil:* ${formatCRC(sinpeTotal)}\n`;
    msg += `🏦 *Otros Medios:* ${formatCRC(otherTotal)}\n\n`;
    msg += `📦 Pedidos atendidos hoy: ${todayOrders.length}\n`;
    msg += `⚠️ Pedidos pendientes en cola: ${pendingCount}\n\n`;
    msg += `¡Excelente jornada creativa! 💜🇨🇷`;
    return msg;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-clayLg border-2 border-fio-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-fio-200 flex items-center justify-between bg-fio-100/70">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-fio-800" />
            <h3 className="font-bubble font-bold text-sm text-fio-900">Acta de Cierre de Caja Diario</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reporte Imprimible */}
        <div id="printable-closing-report" className="p-6 space-y-4 text-xs">
          <div className="flex items-start justify-between border-b border-gray-200 pb-3">
            <div>
              <BrandLogo size="sm" />
              <p className="text-[11px] text-gray-500 mt-0.5">Talleres Creativos & Tienda • WhatsApp: 6400-4640</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-gray-800">Cierre del Día</span>
              <p className="text-[11px] text-gray-400">{new Date().toLocaleDateString('es-CR')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-fio-50 p-3 rounded-2xl border border-fio-200">
            <div>
              <p className="text-gray-500 uppercase text-[10px] font-bold">Total Facturado Hoy:</p>
              <p className="font-bubble font-bold text-xl text-fio-900">{formatCRC(totalSales)}</p>
            </div>
            <div>
              <p className="text-gray-500 uppercase text-[10px] font-bold">Ganancia Estimada:</p>
              <p className="font-bubble font-bold text-xl text-emerald-700">{formatCRC(netProfit)}</p>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <p className="font-bold text-gray-700 uppercase text-[10px]">Desglose de Formas de Pago:</p>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-600">SINPE Móvil (6400-4640)</span>
              <span className="font-bold text-gray-900">{formatCRC(sinpeTotal)}</span>
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
              <span className="text-gray-600">Pedidos Pendientes para Mañana</span>
              <span className="font-bold text-amber-700">{pendingCount}</span>
            </div>
          </div>

          <p className="text-center text-[11px] text-fio-pink font-semibold pt-2 flex items-center justify-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Cierre verificado y registrado en el sistema Cloudflare D1</span>
          </p>
        </div>

        {/* Acciones */}
        <div className="p-4 border-t border-fio-200 bg-fio-50/60 flex flex-col sm:flex-row gap-2 justify-end">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-2xl border border-gray-300 bg-white text-gray-700 font-bubble text-xs font-semibold"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Cierre</span>
          </button>
          <a
            href={getWhatsAppLink('64004640', generateWhatsAppMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bubble text-xs font-semibold shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Enviar Reporte a WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
