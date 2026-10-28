import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { formatCRC, formatShortDate, getWhatsAppLink } from '../../utils/formatters';
import { Search, FileText, Printer, MessageCircle, CheckCircle, Clock } from 'lucide-react';

export const QuickBillingSection: React.FC = () => {
  const { orders, setInvoiceOrder, updateOrderStatus } = useApp();
  const [searchInput, setSearchInput] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchInput.trim().toLowerCase();
    if (!query) return;

    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase().includes(query) ||
        o.orderNumber.replace(/[^0-9]/g, '').includes(query) ||
        o.customerName.toLowerCase().includes(query) ||
        o.customerPhone.includes(query)
    );

    if (found) {
      setSelectedOrder(found);
    } else {
      alert(`No se encontró ningún pedido con "${searchInput}". Verifica el número.`);
    }
  };

  const handleLoadOrder = (order: Order) => {
    setSelectedOrder(order);
    setSearchInput(order.orderNumber);
  };

  const handleBillAndOpenInvoice = (order: Order) => {
    if (order.orderStatus === 'pending' || order.orderStatus === 'picking') {
      updateOrderStatus(order.id, 'packed');
      setSelectedOrder({ ...order, orderStatus: 'packed' });
    }
    setInvoiceOrder(order);
  };

  return (
    <div className="bg-white rounded-3xl border border-fio-200 shadow-clay p-5 sm:p-6 mb-8">
      {/* Título de la Sección */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-fio-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-fio-800" />
            <h2 className="font-bubble font-bold text-xl text-fio-900">
              Módulo de Facturación Rápida
            </h2>
          </div>
          <p className="text-xs text-gray-500">
            Ingresa el número de pedido para jalar automáticamente los datos del cliente, desglose y emitir factura oficial.
          </p>
        </div>

        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-2xl self-start sm:self-auto">
          Facturación Instantánea
        </span>
      </div>

      {/* Buscador de Pedido */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Ingresa número de orden (ej: #FIO-1001, 1001) o nombre del cliente..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-fio-50/70 rounded-2xl border border-fio-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-fio-400 focus:outline-none"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3" />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-fio-800 hover:bg-fio-900 text-white rounded-2xl font-bubble font-semibold text-xs sm:text-sm shadow-clayBtn transition-all active:scale-95"
        >
          Jalar Datos de Pedido
        </button>
      </form>

      {/* Píldoras de Pedidos Recientes para Clic Rápido */}
      <div className="flex flex-wrap items-center gap-1.5 mb-6">
        <span className="text-[11px] font-bold text-gray-400 uppercase mr-1">Cargar reciente:</span>
        {orders.slice(0, 5).map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => handleLoadOrder(o)}
            className="px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-fio-200 text-fio-900 text-xs font-mono font-bold transition-all border border-purple-200"
          >
            {o.orderNumber} ({o.customerName.split(' ')[0]})
          </button>
        ))}
      </div>

      {/* Vista de Pedido Jalado Automáticamente */}
      {selectedOrder ? (
        <div className="p-5 bg-fio-50/60 rounded-3xl border-2 border-fio-300 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-fio-200 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base text-fio-900 bg-white px-3 py-1 rounded-xl border border-fio-200">
                  {selectedOrder.orderNumber}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                  Datos Cargados Correctamente ✅
                </span>
              </div>
              <h3 className="font-bubble font-bold text-xl text-gray-800 mt-2">{selectedOrder.customerName}</h3>
              <p className="text-xs text-gray-500">
                Tel: {selectedOrder.customerPhone} • {formatShortDate(selectedOrder.createdAt)}
              </p>
            </div>

            <div className="text-left md:text-right">
              <span className="text-[11px] text-gray-500 uppercase font-bold">Total Facturable</span>
              <p className="text-2xl font-bubble font-bold text-fio-900">{formatCRC(selectedOrder.total)}</p>
              <p className="text-xs text-gray-400">Método: {selectedOrder.paymentMethod.toUpperCase()}</p>
            </div>
          </div>

          {/* Desglose de Ítems */}
          <div className="space-y-2 mb-5">
            <p className="text-xs font-bold text-fio-800 uppercase tracking-wider">Productos en esta Factura:</p>
            <div className="divide-y divide-fio-100 bg-white rounded-2xl p-3 border border-fio-200">
              {selectedOrder.items.map((it) => (
                <div key={it.id} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-800">{it.quantity}x {it.name}</span>
                    <span className="font-mono text-[10px] text-fio-600 ml-2">({it.sku})</span>
                    {it.customText && (
                      <p className="text-[11px] text-fio-pink font-semibold">Personalizado: "{it.customText}"</p>
                    )}
                  </div>
                  <span className="font-bubble font-bold text-gray-900">{formatCRC(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Botones de Emisión de Factura */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
            <button
              onClick={() => handleBillAndOpenInvoice(selectedOrder)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-fio-800 hover:bg-fio-900 text-white rounded-2xl font-bubble font-semibold text-xs sm:text-sm shadow-clayBtn transition-all active:scale-95"
            >
              <Printer className="w-4 h-4 text-fio-yellow" />
              <span>Generar & Imprimir Factura Oficial</span>
            </button>

            <a
              href={getWhatsAppLink(selectedOrder.customerPhone, `¡Hola ${selectedOrder.customerName}! Te adjunto el comprobante oficial de tu pedido ${selectedOrder.orderNumber} por ${formatCRC(selectedOrder.total)} en by.fio.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bubble font-semibold text-xs sm:text-sm shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enviar Factura por WhatsApp</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 bg-fio-50/30 rounded-2xl border border-dashed border-fio-200">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-40 text-fio-600" />
          <p className="font-bubble text-sm text-gray-600">Ningún pedido seleccionado para facturar</p>
          <p className="text-xs text-gray-400 mt-0.5">Escribe el número de orden arriba o haz clic en uno de los accesos directos.</p>
        </div>
      )}
    </div>
  );
};
