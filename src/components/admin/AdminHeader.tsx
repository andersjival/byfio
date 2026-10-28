import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCRC } from '../../utils/formatters';
import { Package, AlertTriangle, ShoppingCart, RefreshCw, FileText } from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const { products, orders, setIsSupplierModalOpen, resetToDefaults } = useApp();

  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'picking');
  const criticalProducts = products.filter((p) => p.stock <= p.minStock);
  const totalInventoryValue = products.reduce((acc, p) => acc + p.stock * p.costPrice, 0);

  return (
    <div className="mb-8">
      {/* Barra de Título y Acciones Globales */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[11px] font-bold text-fio-pink uppercase tracking-wider">
            Sistema WMS / ERP Ligero
          </span>
          <h1 className="text-2xl sm:text-3xl font-bubble font-bold text-fio-900">
            Panel de Control & Alisto QR
          </h1>
          <p className="text-xs text-gray-500">
            Gestión secuencial de pedidos, inventario con reposición automática y picking guiado.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsSupplierModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-semibold text-xs shadow-clayBtn transition-all active:scale-95"
          >
            <FileText className="w-4 h-4 text-fio-yellow" />
            <span>Lista de Compra a Proveedor</span>
            {criticalProducts.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-fio-pink text-white text-[10px] font-bold">
                {criticalProducts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              if (window.confirm('¿Restablecer datos demo iniciales?')) resetToDefaults();
            }}
            title="Restablecer datos iniciales de demo"
            className="p-2.5 rounded-2xl bg-white hover:bg-gray-100 text-gray-500 border border-fio-200 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pedidos en Cola */}
        <div className="bg-white rounded-3xl p-4 border border-fio-200 shadow-claySm flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-100 text-fio-700">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">Pedidos en Cola</p>
            <h3 className="text-2xl font-bubble font-bold text-fio-900">{pendingOrders.length}</h3>
            <span className="text-[10px] text-fio-pink font-bold">Orden cronológico FIFO</span>
          </div>
        </div>

        {/* Alertas Críticas de Reabastecimiento */}
        <div className="bg-white rounded-3xl p-4 border border-fio-200 shadow-claySm flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${criticalProducts.length > 0 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-emerald-100 text-emerald-600'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">Alertas de Stock</p>
            <h3 className="text-2xl font-bubble font-bold text-red-600">{criticalProducts.length}</h3>
            <span className="text-[10px] font-bold text-red-500">Stock ≤ Mínimo</span>
          </div>
        </div>

        {/* Total Catálogo */}
        <div className="bg-white rounded-3xl p-4 border border-fio-200 shadow-claySm flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-sky-100 text-fio-blue">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">Productos e Insumos</p>
            <h3 className="text-2xl font-bubble font-bold text-fio-900">{products.length}</h3>
            <span className="text-[10px] text-gray-400">Con código QR único</span>
          </div>
        </div>

        {/* Valor de Inventario */}
        <div className="bg-white rounded-3xl p-4 border border-fio-200 shadow-claySm flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-600">
            <span className="font-bubble font-bold text-xl">₡</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">Costo Inventario</p>
            <h3 className="text-xl font-bubble font-bold text-fio-900">{formatCRC(totalInventoryValue)}</h3>
            <span className="text-[10px] text-gray-400">En bodega & estantes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
