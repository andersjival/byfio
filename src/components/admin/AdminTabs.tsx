import React from 'react';
import { useApp } from '../../context/AppContext';
import { Package, FileText, QrCode, DollarSign, GraduationCap, Tag, Users } from 'lucide-react';

export type AdminTabType = 'hub' | 'orders' | 'billing' | 'inventory' | 'reports' | 'workshops' | 'pricing' | 'users';

interface AdminTabsProps {
  activeTab: AdminTabType;
  setActiveTab: (tab: AdminTabType) => void;
}

export const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, setActiveTab }) => {
  const { orders, products, userProfiles, hasPermission } = useApp();

  const pendingCount = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'picking').length;
  const criticalCount = products.filter((p) => p.stock <= p.minStock).length;
  const activeProfilesCount = userProfiles.filter((p) => p.isActive).length;

  return (
    <div className="p-1.5 sm:p-2 rounded-3xl bg-[#ECEEF2] shadow-neuInset border border-white/60 mb-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-1.5 sm:gap-2">
        {/* Tab 1: Pedidos & Alisto */}
        {hasPermission('orders') && (
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bubble font-bold transition-all text-center select-none active:scale-95 ${
              activeTab === 'orders'
                ? 'neu-btn-primary text-white shadow-neuBtnHover scale-[1.01]'
                : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink hover:bg-pink-50/70 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover'
            }`}
            title="Cola de Pedidos y Alisto QR"
          >
            <QrCode className="w-4 h-4 text-fio-yellow shrink-0" />
            <span className="truncate">Pedidos &amp; Alisto</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-fio-pink text-white ml-0.5 shrink-0">
                {pendingCount}
              </span>
            )}
          </button>
        )}

        {/* Tab 2: Facturación */}
        {hasPermission('billing') && (
          <button
            type="button"
            onClick={() => setActiveTab('billing')}
            className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bubble font-bold transition-all text-center select-none active:scale-95 ${
              activeTab === 'billing'
                ? 'neu-btn-primary text-white shadow-neuBtnHover scale-[1.01]'
                : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink hover:bg-pink-50/70 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover'
            }`}
            title="Facturación Rápida de Órdenes"
          >
            <FileText className="w-4 h-4 text-fio-300 shrink-0" />
            <span className="truncate">Facturación</span>
          </button>
        )}

        {/* Tab 3: Inventario */}
        {hasPermission('inventory') && (
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bubble font-bold transition-all text-center select-none active:scale-95 ${
              activeTab === 'inventory'
                ? 'neu-btn-primary text-white shadow-neuBtnHover scale-[1.01]'
                : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink hover:bg-pink-50/70 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover'
            }`}
            title="Inventario de Productos & Etiquetas QR"
          >
            <Package className="w-4 h-4 text-fio-blue shrink-0" />
            <span className="truncate">Inventario &amp; QR</span>
            {criticalCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-500 text-white ml-0.5 shrink-0">
                {criticalCount}
              </span>
            )}
          </button>
        )}

        {/* Tab 4: Caja & Reportes */}
        {hasPermission('reports') && (
          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bubble font-bold transition-all text-center select-none active:scale-95 ${
              activeTab === 'reports'
                ? 'neu-btn-primary text-white shadow-neuBtnHover scale-[1.01]'
                : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink hover:bg-pink-50/70 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover'
            }`}
            title="Arqueo de Caja y Reportes Diarios"
          >
            <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">Caja &amp; Reportes</span>
          </button>
        )}

        {/* Tab 5: Talleres */}
        {hasPermission('workshops') && (
          <button
            type="button"
            onClick={() => setActiveTab('workshops')}
            className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bubble font-bold transition-all text-center select-none active:scale-95 ${
              activeTab === 'workshops'
                ? 'neu-btn-primary text-white shadow-neuBtnHover scale-[1.01]'
                : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink hover:bg-pink-50/70 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover'
            }`}
            title="Gestión de Talleres Creativos e Inscripciones"
          >
            <GraduationCap className="w-4 h-4 text-fio-pink shrink-0" />
            <span className="truncate">Talleres</span>
          </button>
        )}

        {/* Tab 6: Precios */}
        {hasPermission('pricing') && (
          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bubble font-bold transition-all text-center select-none active:scale-95 ${
              activeTab === 'pricing'
                ? 'neu-btn-primary text-white shadow-neuBtnHover scale-[1.01]'
                : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink hover:bg-pink-50/70 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover'
            }`}
            title="Tabla de Precios y Calculador de Stickers"
          >
            <Tag className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="truncate">Precios</span>
          </button>
        )}

        {/* Tab 7: Perfiles de Usuario */}
        {hasPermission('users') && (
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bubble font-bold transition-all text-center select-none active:scale-95 ${
              activeTab === 'users'
                ? 'neu-btn-primary text-white shadow-neuBtnHover scale-[1.01]'
                : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink hover:bg-pink-50/70 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover'
            }`}
            title="Administración de Perfiles y Accesos"
          >
            <Users className="w-4 h-4 text-purple-500 shrink-0" />
            <span className="truncate">Perfiles</span>
            {activeProfilesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-purple-500 text-white ml-0.5 shrink-0">
                {activeProfilesCount}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
