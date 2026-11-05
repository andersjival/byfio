import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useConfirm } from '../../context/ConfirmContext';
import { formatCRC } from '../../utils/formatters';
import { AdminDesignSettingsModal } from './AdminDesignSettingsModal';
import {
  Package, AlertTriangle, ShoppingCart, RefreshCw,
  FileText, Palette, DollarSign, Landmark, Shield, Truck, Settings
} from 'lucide-react';

import { AppRoute } from '../../types';
import { AdminTabType } from './AdminTabs';

interface AdminHeaderProps {
  onOpenDesignModal?: () => void;
  onNavigate?: (route: AppRoute) => void;
  onSelectTab?: (tab: AdminTabType) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onOpenDesignModal, onNavigate, onSelectTab }) => {
  const confirm = useConfirm();
  const {
    products,
    orders,
    setIsSupplierModalOpen,
    resetToDefaults,
    colorTheme,
    typographyTheme,
    setIsSinpeModalOpen,
    sinpeTransactions,
    isModuleEnabled,
    currentUser,
    logoutUser,
    supplierOrders,
  } = useApp();
  const [internalDesignModalOpen, setInternalDesignModalOpen] = useState(false);

  const isAdminOrSuperadmin = !!currentUser && (currentUser.role === 'admin' || !!currentUser.isMasterAdmin);

  const handleOpenDesign = onOpenDesignModal || (() => setInternalDesignModalOpen(true));

  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'picking');
  const criticalProducts = products.filter((p) => p.stock <= p.minStock);
  const totalInventoryValue = products.reduce((acc, p) => acc + p.stock * p.costPrice, 0);

  return (
    <div className="space-y-4">
      {/* Barra de Título y Acciones Globales Compacta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bubble font-bold text-fio-900 leading-tight">
            Panel de Control &amp; Alisto QR
          </h1>
        </div>

        {/* Acciones Rápidas & Botón Discreto de Personalización Visual */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Botón de Acceso Superadmin (Solo Admin y Superadmin) */}
          {isAdminOrSuperadmin && (
            <button
              type="button"
              onClick={() => {
                if (onNavigate) onNavigate('superadmin');
                else window.location.href = '/panel/superadmin';
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bubble font-bold border border-slate-700 shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Abrir panel maestro de Superadmin (Activar/Desactivar Módulos)"
            >
              <Shield className="w-3.5 h-3.5 text-pink-400" />
              <span>Superadmin</span>
            </button>
          )}

          {/* Botón de Propuesta Oficial para el Dueño (Solo Admin y Superadmin) */}
          {isAdminOrSuperadmin && (
            <button
              type="button"
              onClick={() => {
                if (onNavigate) onNavigate('propuesta');
                else window.location.href = '/propuesta';
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-fio-pink hover:from-purple-800 hover:to-pink-600 text-white text-xs font-bubble font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Ver propuesta integral y ficha de funcionalidades"
            >
              <FileText className="w-3.5 h-3.5 text-fio-yellow" />
              <span>Propuesta</span>
            </button>
          )}

          {/* Botón de Configuración del Sistema & Personalización */}
          <button
            type="button"
            onClick={handleOpenDesign}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-fio-50 text-fio-800 text-xs font-semibold border border-fio-200/80 shadow-xs transition-all active:scale-95 cursor-pointer"
            title="Configuración de la web: alerta estrellita, paleta de colores, tipografía y sonidos"
          >
            <Settings className="w-3.5 h-3.5 text-fio-pink" />
            <span>Configuración</span>
            <span className="text-[10px] text-fio-600 bg-fio-100 px-1.5 py-0.2 rounded-full font-bold ml-0.5">
              {colorTheme === 'vibrant' ? 'Morado' : colorTheme === 'dark' ? 'Oscuro' : 'Zen'}
            </span>
          </button>

          {/* Botón Módulo SINPE BCR */}
          {isModuleEnabled('sinpe') && (
            <button
              type="button"
              onClick={() => onSelectTab ? onSelectTab('sinpe') : (onNavigate ? onNavigate('admin') : setIsSinpeModalOpen(true))}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 text-xs font-bubble font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Ir al Módulo Independiente de Pagos SINPE Móvil Banco BCR"
            >
              <Landmark className="w-3.5 h-3.5 text-purple-700" />
              <span>SINPE BCR</span>
              {sinpeTransactions.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-purple-800 text-white text-[10px] font-bold">
                  {sinpeTransactions.length}
                </span>
              )}
            </button>
          )}

          {/* Módulo Pedidos a Proveedor */}
          <button
            type="button"
            onClick={() => onSelectTab ? onSelectTab('suppliers') : setIsSupplierModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bubble font-semibold text-xs shadow-clayBtn transition-all active:scale-95 cursor-pointer"
            title="Ir al Módulo de Pedidos a Proveedor (Borradores e Historial)"
          >
            <Truck className="w-3.5 h-3.5 text-amber-200" />
            <span>Pedidos Proveedor</span>
            {supplierOrders?.filter((o: any) => o.status === 'draft' || o.status === 'ordered').length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-950 text-amber-100 text-[10px] font-bold">
                {supplierOrders.filter((o: any) => o.status === 'draft' || o.status === 'ordered').length}
              </span>
            )}
          </button>

          {/* Reset Demo */}
          <button
            type="button"
            onClick={async () => {
              if (await confirm('¿Restablecer datos demo iniciales?', { title: 'Restablecer Demo', variant: 'warning', confirmLabel: 'Sí, restablecer' })) resetToDefaults();
            }}
            title="Restablecer datos iniciales de demo"
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Banner Informativo si se encuentra en perfil Staff (como Alisto de Pedidos) */}
      {currentUser?.role === 'staff' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bubble shadow-2xs">
          <div className="flex items-center gap-2 text-amber-900">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span>
              Sesión activa en perfil operativo <strong>{currentUser.name}</strong> (Staff). Los perfiles de usuarios se gestionan desde el acceso Administrador.
            </span>
          </div>
          <button
            type="button"
            onClick={logoutUser}
            className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px] shadow-2xs transition-all active:scale-95 cursor-pointer"
            title="Cambiar a cuenta de Administrador o Superadmin"
          >
            Cambiar a Administrador &rarr;
          </button>
        </div>
      )}

      {/* KPI Cards Compactas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Pedidos en Cola */}
        <div className="bg-white rounded-2xl p-3 border border-fio-200/70 shadow-xs flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-100 text-fio-700 shrink-0">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-500 truncate">Pedidos en Cola</p>
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-lg font-bubble font-bold text-fio-900">{pendingOrders.length}</h3>
              <span className="text-[9px] text-fio-pink font-bold">FIFO</span>
            </div>
          </div>
        </div>

        {/* Alertas Críticas */}
        <div className="bg-white rounded-2xl p-3 border border-fio-200/70 shadow-xs flex items-center gap-2.5">
          <div className={`p-2 rounded-xl shrink-0 ${criticalProducts.length > 0 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-emerald-100 text-emerald-600'}`}>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-500 truncate">Stock Crítico</p>
            <div className="flex items-baseline gap-1.5">
              <h3 className={`text-lg font-bubble font-bold ${criticalProducts.length > 0 ? 'text-red-600' : 'text-slate-800'}`}>
                {criticalProducts.length}
              </h3>
              <span className="text-[9px] text-slate-400">alertas</span>
            </div>
          </div>
        </div>

        {/* Total Catálogo */}
        <div className="bg-white rounded-2xl p-3 border border-fio-200/70 shadow-xs flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-100 text-sky-700 shrink-0">
            <Package className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-500 truncate">Inventario Total</p>
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-lg font-bubble font-bold text-fio-900">{products.length}</h3>
              <span className="text-[9px] text-slate-400">ítems QR</span>
            </div>
          </div>
        </div>

        {/* Valor de Inventario */}
        <div className="bg-white rounded-2xl p-3 border border-fio-200/70 shadow-xs flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-500 truncate">Valor Inventario</p>
            <h3 className="text-sm sm:text-base font-bubble font-bold text-fio-900 truncate">
              {formatCRC(totalInventoryValue)}
            </h3>
          </div>
        </div>
      </div>

      {/* Modal de Diseño & Tipografía Interno */}
      {!onOpenDesignModal && (
        <AdminDesignSettingsModal
          isOpen={internalDesignModalOpen}
          onClose={() => setInternalDesignModalOpen(false)}
        />
      )}
    </div>
  );
};
