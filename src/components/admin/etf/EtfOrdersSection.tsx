import React, { useState, useMemo } from 'react';
import { Layers, Search, Plus, Filter, ArrowLeft, Image as ImageIcon, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Order, EtfFileAttachment, EtfProductionStatus } from '../../../types';
import { isEtfOrder } from '../../../services/etfService';
import { EtfOrderCard } from './EtfOrderCard';
import { EtfPhotoModal } from './EtfPhotoModal';
import { EtfNewOrderModal } from './EtfNewOrderModal';

interface EtfOrdersSectionProps {
  onBackToHub?: () => void;
}

export const EtfOrdersSection: React.FC<EtfOrdersSectionProps> = ({ onBackToHub }) => {
  const { orders, updateOrderEtfData, createOrder } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<{ file: EtfFileAttachment; orderNumber: string; customerName: string } | null>(null);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);

  const etfOrders = useMemo(() => {
    return orders.filter(isEtfOrder);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return etfOrders.filter((o) => {
      const etf = o.etfData || {};
      const status = etf.productionStatus || 'pending_files';
      if (filterStatus !== 'all' && status !== filterStatus) return false;

      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      const matchName = o.customerName.toLowerCase().includes(term);
      const matchNum = o.orderNumber.toLowerCase().includes(term);
      const matchPhone = (o.customerPhone || '').toLowerCase().includes(term);
      const matchReq = (etf.requirement || '').toLowerCase().includes(term);
      return matchName || matchNum || matchPhone || matchReq;
    });
  }, [etfOrders, filterStatus, searchTerm]);

  const stats = useMemo(() => {
    const total = etfOrders.length;
    const withFiles = etfOrders.filter((o) => (o.etfData?.files?.length || 0) > 0).length;
    const inProd = etfOrders.filter((o) => o.etfData?.productionStatus === 'in_production').length;
    return { total, withFiles, inProd };
  }, [etfOrders]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          {onBackToHub && (
            <button
              onClick={onBackToHub}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 transition"
              title="Volver al Menú"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300">
                <Layers className="w-5 h-5" />
              </span>
              <h1 className="font-bubble font-bold text-lg sm:text-xl text-fio-900 dark:text-white">Módulo ETF</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-xs font-bold font-sans">
                {etfOrders.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Compras exclusivas de ETF/DTF, requerimientos y gestión de archivos para taller
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewOrderOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Registrar Compra ETF
        </button>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-[11px] text-slate-500 font-medium">Total Compras ETF</p>
          <p className="font-bubble text-lg font-bold text-fio-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-[11px] text-emerald-600 font-medium">Con Archivos Listos</p>
          <p className="font-bubble text-lg font-bold text-emerald-600">{stats.withFiles}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-[11px] text-amber-600 font-medium">En Impresión / Taller</p>
          <p className="font-bubble text-lg font-bold text-amber-600">{stats.inProd}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, teléfono, # orden o requerimiento..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'pending_files', label: 'Pendientes' },
            { id: 'files_received', label: 'Con Archivos' },
            { id: 'in_production', label: 'En Taller' },
            { id: 'ready', label: 'Listos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                filterStatus === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
          <Layers className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="font-bubble text-base font-bold text-slate-700 dark:text-slate-200">No hay compras ETF encontradas</h3>
          <p className="text-xs text-slate-400 mt-1">Registra una nueva orden o espera compras de productos ETF en la tienda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrders.map((order) => (
            <EtfOrderCard
              key={order.id}
              order={order}
              onUpdateEtf={updateOrderEtfData}
              onPreviewFile={(file, orderNumber, customerName) => setSelectedPhoto({ file, orderNumber, customerName })}
            />
          ))}
        </div>
      )}

      {/* Photo Modal */}
      <EtfPhotoModal
        file={selectedPhoto?.file || null}
        orderNumber={selectedPhoto?.orderNumber || ''}
        customerName={selectedPhoto?.customerName || ''}
        onClose={() => setSelectedPhoto(null)}
      />

      {/* New Order Modal */}
      <EtfNewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        onCreateOrder={(newOrder) => createOrder(newOrder as any)}
      />
    </div>
  );
};
