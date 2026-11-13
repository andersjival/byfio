import React from 'react';
import { Home, PackageCheck, Receipt, Calendar, ClipboardList } from 'lucide-react';
import { AdminTabType } from './AdminTabs';
import { playWaterDropSound } from '../../utils/soundEffects';
import { useApp } from '../../context/AppContext';

interface AdminMobileDockProps {
  activeTab: AdminTabType;
  onSelectTab: (tab: AdminTabType) => void;
  onOpenScanner?: () => void;
  onOpenInventoryApp?: () => void;
}

export const AdminMobileDock: React.FC<AdminMobileDockProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const { hasPermission } = useApp();

  return (
    <div className="sm:hidden fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 right-3 z-40 bg-white/95 dark:bg-[#1C1829]/95 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_rgba(30,10,60,0.22)] border border-purple-200/90 dark:border-purple-800/80 px-2 py-1.5 flex items-center justify-around gap-1 animate-in slide-in-from-bottom-3 duration-200 select-none">
      {/* 1. Inicio (siempre disponible para ver menú con todos los módulos autorizados) */}
      <button
        type="button"
        onClick={() => {
          playWaterDropSound();
          onSelectTab('hub');
        }}
        className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer touch-manipulation active:scale-95 ${
          activeTab === 'hub'
            ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 font-bold scale-[1.02] shadow-xs'
            : 'text-slate-500 hover:text-purple-600'
        }`}
        title="Ir a Inicio"
      >
        <Home className="w-4 h-4 mb-0.5 text-purple-700 dark:text-purple-300" />
        <span className="text-[10px] font-bubble font-bold">Inicio</span>
      </button>

      {/* 2. Pedidos de Clientes (con validación de permiso) */}
      {hasPermission('orders') && (
        <button
          type="button"
          onClick={() => {
            playWaterDropSound();
            onSelectTab('orders');
          }}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer touch-manipulation active:scale-95 ${
            activeTab === 'orders'
              ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 font-bold scale-[1.02] shadow-xs'
              : 'text-slate-500 hover:text-purple-600'
          }`}
          title="Pedidos de Clientes"
        >
          <PackageCheck className="w-4 h-4 mb-0.5 text-fio-pink" />
          <span className="text-[9px] font-bubble font-bold leading-tight text-center">Pedidos</span>
        </button>
      )}

      {/* 3. Cobrar (con validación de permiso) */}
      {hasPermission('billing') && (
        <button
          type="button"
          onClick={() => {
            playWaterDropSound();
            onSelectTab('billing');
          }}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer touch-manipulation active:scale-95 ${
            activeTab === 'billing'
              ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 font-bold scale-[1.02] shadow-xs'
              : 'text-slate-500 hover:text-purple-600'
          }`}
          title="Facturación Rápida POS"
        >
          <Receipt className="w-4 h-4 mb-0.5 text-emerald-600" />
          <span className="text-[10px] font-bubble font-bold">Cobrar</span>
        </button>
      )}

      {/* 4. Agenda (con validación de permiso) */}
      {hasPermission('agenda') && (
        <button
          type="button"
          onClick={() => {
            playWaterDropSound();
            onSelectTab('agenda');
          }}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer touch-manipulation active:scale-95 ${
            activeTab === 'agenda'
              ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 font-bold scale-[1.02] shadow-xs'
              : 'text-slate-500 hover:text-purple-600'
          }`}
          title="Agenda del Taller"
        >
          <Calendar className="w-4 h-4 mb-0.5 text-amber-500" />
          <span className="text-[10px] font-bubble font-bold">Agenda</span>
        </button>
      )}

      {/* 5. Inventario (con validación de permiso) */}
      {hasPermission('inventory') && (
        <button
          type="button"
          onClick={() => {
            playWaterDropSound();
            onSelectTab('inventory');
          }}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer touch-manipulation active:scale-95 ${
            activeTab === 'inventory'
              ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 font-bold scale-[1.02] shadow-xs'
              : 'text-slate-500 hover:text-purple-600'
          }`}
          title="Control de Inventario"
        >
          <ClipboardList className="w-4 h-4 mb-0.5 text-purple-700" />
          <span className="text-[10px] font-bubble font-bold">Inventario</span>
        </button>
      )}
    </div>
  );
};
