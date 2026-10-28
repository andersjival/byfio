import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCRC } from '../../utils/formatters';
import { TypographyTheme } from '../../types';
import { Package, AlertTriangle, ShoppingCart, RefreshCw, FileText, Type, CheckCircle2, Sparkles } from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const { products, orders, setIsSupplierModalOpen, resetToDefaults, typographyTheme, setTypographyTheme } = useApp();

  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'picking');
  const criticalProducts = products.filter((p) => p.stock <= p.minStock);
  const totalInventoryValue = products.reduce((acc, p) => acc + p.stock * p.costPrice, 0);

  const fontOptions: { id: TypographyTheme; name: string; desc: string; sample: string; fontClass: string }[] = [
    {
      id: 'bubble',
      name: 'Solo Letra Redondita',
      desc: 'Tipografía tierno/kawaii (Fredoka & Quicksand) en todos los títulos.',
      sample: '¡Transformá tu creatividad en tu mejor proyecto!',
      fontClass: 'font-bubble text-base text-fio-900',
    },
    {
      id: 'serif',
      name: 'Solo Letra Serif Zen',
      desc: 'Tipografía refinada y editorial (Cormorant Garamond) en toda la web.',
      sample: 'MAKE ROOM FOR CALM • ESPACIO CREATIVO',
      fontClass: 'font-serif text-lg tracking-wider text-slate-800',
    },
    {
      id: 'hybrid',
      name: 'Combinación de Letras',
      desc: 'Títulos principales en Serif elegante + detalles y botones en Redondita.',
      sample: 'TALLERES / CREATIVOS • Aprendé y Emprendé',
      fontClass: 'font-serif text-base tracking-wide text-fio-800',
    },
  ];

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
            Gestión secuencial de pedidos, inventario con reposición automática y personalización visual.
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

      {/* Selector Global de Tipografía de la Web */}
      <div className="bg-white rounded-3xl p-5 border border-fio-200 shadow-sm mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-fio-700 flex items-center justify-center shrink-0">
              <Type className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bubble font-bold text-fio-900 flex items-center gap-1.5">
                <span>Tipografía del Sitio Web</span>
                <Sparkles className="w-3.5 h-3.5 text-fio-yellow fill-fio-yellow" />
              </h2>
              <p className="text-xs text-slate-500">
                Cambia al instante el tipo de letra de toda la página para que tenga exactamente el concepto que prefieras.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-fio-800 bg-fio-100 px-3 py-1 rounded-full self-start sm:self-auto shrink-0">
            {typographyTheme === 'bubble' ? '● Modo Redondita Activo' : typographyTheme === 'serif' ? '● Modo Serif Zen Activo' : '● Modo Combinación Activo'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {fontOptions.map((opt) => {
            const isSelected = typographyTheme === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTypographyTheme(opt.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-fio-50/80 border-fio-500 ring-2 ring-fio-400/40 shadow-sm'
                    : 'bg-[#FAF7F2]/50 border-slate-200 hover:border-fio-300 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{opt.name}</span>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-fio-600 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{opt.desc}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Vista previa:</span>
                  <p className={`${opt.fontClass} leading-tight line-clamp-1`}>
                    {opt.sample}
                  </p>
                </div>
              </button>
            );
          })}
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
