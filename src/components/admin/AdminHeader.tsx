import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCRC } from '../../utils/formatters';
import { AdminDesignSettingsModal } from './AdminDesignSettingsModal';
import {
  Package, AlertTriangle, ShoppingCart, RefreshCw,
  FileText, Palette, DollarSign
} from 'lucide-react';

interface AdminHeaderProps {
  onOpenDesignModal?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onOpenDesignModal }) => {
  const { products, orders, setIsSupplierModalOpen, resetToDefaults, colorTheme, typographyTheme } = useApp();
  const [internalDesignModalOpen, setInternalDesignModalOpen] = useState(false);

  const handleOpenDesign = onOpenDesignModal || (() => setInternalDesignModalOpen(true));

  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'picking');
  const criticalProducts = products.filter((p) => p.stock <= p.minStock);
  const totalInventoryValue = products.reduce((acc, p) => acc + p.stock * p.costPrice, 0);

  return (
    <div className="space-y-4">
      {/* Barra de Título y Acciones Globales Compacta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-fio-pink uppercase tracking-wider block">
            Sistema WMS / ERP Ligero
          </span>
          <h1 className="text-xl sm:text-2xl font-bubble font-bold text-fio-900 leading-tight">
            Panel de Control &amp; Alisto QR
          </h1>
        </div>

        {/* Acciones Rápidas & Botón Discreto de Personalización Visual */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Botón Discreto de Diseño & Tipografía */}
          <button
            type="button"
            onClick={handleOpenDesign}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-fio-50 text-fio-800 text-xs font-semibold border border-fio-200/80 shadow-xs transition-all active:scale-95"
            title="Ajustar paleta de colores y tipografía del sitio"
          >
            <Palette className="w-3.5 h-3.5 text-fio-pink" />
            <span>Diseño &amp; Letra</span>
            <span className="text-[10px] text-fio-600 bg-fio-100 px-1.5 py-0.2 rounded-full font-bold ml-0.5">
              {colorTheme === 'vibrant' ? 'Morado' : 'Zen'}
            </span>
          </button>

          {/* Lista de Compra */}
          <button
            type="button"
            onClick={() => setIsSupplierModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-semibold text-xs shadow-clayBtn transition-all active:scale-95"
          >
            <FileText className="w-3.5 h-3.5 text-fio-yellow" />
            <span>Lista Proveedor</span>
            {criticalProducts.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-fio-pink text-white text-[10px] font-bold">
                {criticalProducts.length}
              </span>
            )}
          </button>

          {/* Reset Demo */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('¿Restablecer datos demo iniciales?')) resetToDefaults();
            }}
            title="Restablecer datos iniciales de demo"
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

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
