import React from 'react';
import { Home, PackageCheck, Receipt, Calendar, Camera, ClipboardList } from 'lucide-react';
import { AdminTabType } from './AdminTabs';
import { playWaterDropSound } from '../../utils/soundEffects';
import { useApp } from '../../context/AppContext';
import { isCollaboratorPwaContext } from '../../utils/routeHelpers';

interface AdminMobileDockProps {
  activeTab: AdminTabType;
  onSelectTab: (tab: AdminTabType) => void;
  onOpenScanner?: () => void;
  onOpenInventoryApp?: () => void;
}

export const AdminMobileDock: React.FC<AdminMobileDockProps> = ({
  activeTab,
  onSelectTab,
  onOpenScanner,
  onOpenInventoryApp,
}) => {
  const { currentUser, isModuleEnabled, hasPermission, collaboratorInventoryEnabled } = useApp();

  const isAdmin = Boolean(currentUser && (currentUser.role === 'admin' || currentUser.isMasterAdmin));
  const isCollaborator = !isAdmin && Boolean(currentUser?.role === 'staff' || isCollaboratorPwaContext());

  // En la PWA de colaboradores NO existen los botones de Cobrar ni de Agenda.
  const showBilling = !isCollaborator && isAdmin && isModuleEnabled('billing') && hasPermission('billing');
  const showAgenda = !isCollaborator && isAdmin && isModuleEnabled('agenda') && hasPermission('agenda');

  return (
    <div className="sm:hidden fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 right-3 z-40 bg-white/95 dark:bg-[#1C1829]/95 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_rgba(30,10,60,0.22)] border border-purple-200/90 dark:border-purple-800/80 px-2 py-1.5 flex items-center justify-around gap-1 animate-in slide-in-from-bottom-3 duration-200">
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
        <span className="text-[10px] font-bubble">Inicio</span>
      </button>

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
        <span className="text-[9px] font-bubble leading-tight text-center">Pedidos de Clientes</span>
      </button>

      {onOpenScanner && (
        <button
          type="button"
          onClick={() => {
            playWaterDropSound();
            onOpenScanner();
          }}
          className="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer touch-manipulation active:scale-95 group text-purple-900"
          title="Escanear Código de Barras de Alisto"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-fio-pink to-purple-600 text-white flex items-center justify-center shadow-clayBtn -mt-3 mb-0.5 group-hover:scale-105 transition-transform">
            <Camera className="w-4 h-4 text-fio-yellow" />
          </div>
          <span className="text-[10px] font-bubble font-black text-fio-pink leading-tight">Escanear</span>
        </button>
      )}

      {showBilling && (
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
          <span className="text-[10px] font-bubble">Cobrar</span>
        </button>
      )}

      {showAgenda && (
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
          <span className="text-[10px] font-bubble">Agenda</span>
        </button>
      )}

      {collaboratorInventoryEnabled && (
        <button
          type="button"
          onClick={() => {
            playWaterDropSound();
            if (onOpenInventoryApp) {
              onOpenInventoryApp();
            } else {
              window.history.pushState({ route: 'inventario-app' }, '', '/inventario-app');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }
          }}
          className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer touch-manipulation active:scale-95 text-purple-800 hover:text-fio-pink"
          title="Realizar Toma de Inventario"
        >
          <ClipboardList className="w-4 h-4 mb-0.5 text-purple-700" />
          <span className="text-[10px] font-bubble font-bold">Inventario</span>
        </button>
      )}
    </div>
  );
};
