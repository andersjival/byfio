import React from 'react';
import { useApp } from '../../context/AppContext';
import { Package, FileText, QrCode, DollarSign, GraduationCap, LayoutGrid } from 'lucide-react';

export type AdminTabType = 'hub' | 'orders' | 'billing' | 'inventory' | 'reports' | 'workshops';

interface AdminTabsProps {
  activeTab: AdminTabType;
  setActiveTab: (tab: AdminTabType) => void;
}

export const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, setActiveTab }) => {
  const { orders, products } = useApp();

  const pendingCount = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'picking').length;
  const criticalCount = products.filter((p) => p.stock <= p.minStock).length;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
      {/* Tab 0: Menú Principal */}
      <button
        onClick={() => setActiveTab('hub')}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bubble font-bold transition-all shrink-0 ${
          activeTab === 'hub'
            ? 'bg-fio-800 text-white shadow-clayBtn scale-[1.02]'
            : 'bg-white text-gray-700 border border-fio-200 hover:bg-fio-50'
        }`}
      >
        <LayoutGrid className="w-4 h-4 text-fio-pink" />
        <span>Menú Principal</span>
      </button>
      {/* Tab 1: Pedidos & Alisto */}
      <button
        onClick={() => setActiveTab('orders')}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bubble font-bold transition-all shrink-0 ${
          activeTab === 'orders'
            ? 'bg-fio-800 text-white shadow-clayBtn scale-[1.02]'
            : 'bg-white text-gray-700 border border-fio-200 hover:bg-fio-50'
        }`}
      >
        <QrCode className="w-4 h-4 text-fio-yellow" />
        <span>Cola de Pedidos & Alisto QR</span>
        {pendingCount > 0 && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-fio-pink text-white">
            {pendingCount}
          </span>
        )}
      </button>

      {/* Tab 2: Facturación Rápida */}
      <button
        onClick={() => setActiveTab('billing')}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bubble font-bold transition-all shrink-0 ${
          activeTab === 'billing'
            ? 'bg-fio-800 text-white shadow-clayBtn scale-[1.02]'
            : 'bg-white text-gray-700 border border-fio-200 hover:bg-fio-50'
        }`}
      >
        <FileText className="w-4 h-4 text-fio-300" />
        <span>Facturación Rápida</span>
      </button>

      {/* Tab 3: Inventario */}
      <button
        onClick={() => setActiveTab('inventory')}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bubble font-bold transition-all shrink-0 ${
          activeTab === 'inventory'
            ? 'bg-fio-800 text-white shadow-clayBtn scale-[1.02]'
            : 'bg-white text-gray-700 border border-fio-200 hover:bg-fio-50'
        }`}
      >
        <Package className="w-4 h-4 text-fio-blue" />
        <span>Inventario & Etiquetas QR</span>
        {criticalCount > 0 && (
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">
            {criticalCount}
          </span>
        )}
      </button>

      {/* Tab 4: Caja & Reportes */}
      <button
        onClick={() => setActiveTab('reports')}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bubble font-bold transition-all shrink-0 ${
          activeTab === 'reports'
            ? 'bg-fio-800 text-white shadow-clayBtn scale-[1.02]'
            : 'bg-white text-gray-700 border border-fio-200 hover:bg-fio-50'
        }`}
      >
        <DollarSign className="w-4 h-4 text-emerald-400" />
        <span>Caja & Reportería</span>
      </button>

      {/* Tab 5: Talleres & Inscripciones */}
      <button
        onClick={() => setActiveTab('workshops')}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bubble font-bold transition-all shrink-0 ${
          activeTab === 'workshops'
            ? 'bg-fio-800 text-white shadow-clayBtn scale-[1.02]'
            : 'bg-white text-gray-700 border border-fio-200 hover:bg-fio-50'
        }`}
      >
        <GraduationCap className="w-4 h-4 text-fio-pink" />
        <span>Talleres & Inscripciones</span>
      </button>
    </div>
  );
};
