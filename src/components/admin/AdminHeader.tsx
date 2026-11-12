import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useConfirm } from '../../context/ConfirmContext';
import { formatCRC } from '../../utils/formatters';
import { AdminDesignSettingsModal } from './AdminDesignSettingsModal';
import { RegisteredLikesModal } from './RegisteredLikesModal';
import { useRegisteredLikes } from '../../hooks/useRegisteredLikes';
import {
  Package, AlertTriangle, ShoppingCart, RefreshCw,
  Palette, DollarSign, Settings, Smartphone, Heart
} from 'lucide-react';

import { AppRoute } from '../../types';
import { AdminTabType } from './AdminTabs';

interface AdminHeaderProps {
  onOpenDesignModal?: () => void;
  onOpenPwaModal?: () => void;
  onNavigate?: (route: AppRoute) => void;
  onSelectTab?: (tab: AdminTabType) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onOpenDesignModal, onOpenPwaModal, onNavigate, onSelectTab }) => {
  const confirm = useConfirm();
  const {
    products,
    orders,
    resetToDefaults,
    isModuleEnabled,
    currentUser,
    logoutUser,
  } = useApp();
  const [internalDesignModalOpen, setInternalDesignModalOpen] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const { registeredLikes, totalRegisteredLikes, refreshRemote } = useRegisteredLikes({ syncRemote: true });

  const isAdminOrSuperadmin = !!currentUser && (currentUser.role === 'admin' || !!currentUser.isMasterAdmin);

  const handleOpenDesign = onOpenDesignModal || (() => setInternalDesignModalOpen(true));

  const pendingOrders = orders.filter(
    (o) => !(Array.isArray(o.items) && o.items.length > 0 && o.items.every((it) => it.isPicked || it.isMissing))
  );
  const criticalProducts = products.filter((p) => p.stock <= p.minStock);
  const totalInventoryValue = products.reduce((acc, p) => acc + p.stock * p.costPrice, 0);

  return (
    <div className="space-y-4">
      {/* Barra de Título y Acciones Globales Compacta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bubble font-bold text-fio-900 leading-tight">
            Panel de control y alisto
          </h1>
        </div>

        {/* Acciones Rápidas & Botón Discreto de Personalización Visual */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Botón PWA Multi-dispositivo (PC & Celular) */}
          {onOpenPwaModal && (
            <button
              type="button"
              onClick={onOpenPwaModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-700 via-fio-purple to-pink-600 hover:from-purple-800 hover:to-pink-700 text-white text-xs font-bubble font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Centro de Aplicaciones PWA para Computadora, Celular y Colaboradores"
            >
              <Smartphone className="w-3.5 h-3.5 text-fio-yellow" />
              <span>Apps PWA</span>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {isAdminOrSuperadmin && (
          <button
            type="button"
            onClick={() => setShowLikesModal(true)}
            className="bg-gradient-to-br from-pink-50/90 to-white dark:from-[#2C2746] dark:to-[#211D35] hover:from-pink-100/80 hover:to-pink-50/40 dark:hover:from-[#352F54] dark:hover:to-[#2C2746] rounded-2xl p-3 border border-pink-200/90 dark:border-white/10 shadow-xs flex items-center gap-2.5 text-left transition-all active:scale-95 cursor-pointer"
            title="Ver Me Gusta de usuarios registrados"
          >
            <div className="p-2 rounded-xl bg-pink-100 text-fio-pink shrink-0">
              <Heart className="w-4 h-4 fill-fio-pink text-fio-pink" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-pink-700 dark:text-pink-300 truncate">Me Gusta Web</p>
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-lg font-bubble font-bold text-purple-950 dark:text-white">{totalRegisteredLikes}</h3>
                <span className="text-[9px] text-pink-600 dark:text-pink-400 font-bold">registrados</span>
              </div>
            </div>
          </button>
        )}
        {/* Pedidos en Cola */}
        <div className="bg-white rounded-2xl p-3 border border-fio-200/70 shadow-xs flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-100 text-fio-700 shrink-0">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-500 truncate">Pedidos en Cola</p>
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-lg font-bubble font-bold text-fio-900">{pendingOrders.length}</h3>
              <span className="text-[9px] text-fio-pink font-bold">En vivo</span>
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
      <RegisteredLikesModal
        isOpen={showLikesModal}
        onClose={() => setShowLikesModal(false)}
        registeredLikes={registeredLikes}
        onRefresh={refreshRemote}
      />
    </div>
  );
};
