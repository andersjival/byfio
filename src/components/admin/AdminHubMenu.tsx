import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminTabType } from './AdminTabs';
import { formatCRC } from '../../utils/formatters';
import {
  QrCode, FileText, Package, DollarSign, GraduationCap,
  ArrowRight, Sparkles, AlertTriangle, Users, ShoppingCart,
  Clock, TrendingUp, ChevronRight
} from 'lucide-react';

interface AdminHubMenuProps {
  onSelectTab: (tab: AdminTabType) => void;
}

export const AdminHubMenu: React.FC<AdminHubMenuProps> = ({ onSelectTab }) => {
  const { orders, products, workshops } = useApp();

  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'picking');
  const criticalProducts = products.filter((p) => p.stock <= p.minStock);
  const totalInventoryValue = products.reduce((acc, p) => acc + p.stock * p.costPrice, 0);

  const menuCards = [
    {
      id: 'orders' as AdminTabType,
      title: 'Cola de Pedidos & Alisto QR',
      subtitle: 'Alisto guiado paso a paso con escáner QR y control de entregas en orden cronológico (FIFO).',
      badge: pendingOrders.length > 0 ? `${pendingOrders.length} pendientes` : 'Al día',
      badgeColor: pendingOrders.length > 0 ? 'bg-fio-pink text-white animate-pulse' : 'bg-emerald-100 text-emerald-700',
      icon: QrCode,
      iconGradient: 'from-purple-500 to-fio-800',
      highlightStat: `${orders.length} pedidos registrados`,
      actionText: 'Ingresar a Pedidos',
    },
    {
      id: 'billing' as AdminTabType,
      title: 'Facturación Rápida',
      subtitle: 'Ingresa o escanea el número de orden (#FIO-1001) para jalar los datos y generar comprobantes al instante.',
      badge: 'Búsqueda por # orden',
      badgeColor: 'bg-fio-100 text-fio-800',
      icon: FileText,
      iconGradient: 'from-fio-300 to-fio-600',
      highlightStat: 'Envío directo por WhatsApp',
      actionText: 'Ingresar a Facturación',
    },
    {
      id: 'inventory' as AdminTabType,
      title: 'Inventario & Etiquetas QR',
      subtitle: 'Control de existencias, alertas automáticas de reabastecimiento, alta de productos e impresión de stickers QR.',
      badge: criticalProducts.length > 0 ? `${criticalProducts.length} por reabastecer` : 'Stock saludable',
      badgeColor: criticalProducts.length > 0 ? 'bg-red-500 text-white' : 'bg-emerald-100 text-emerald-700',
      icon: Package,
      iconGradient: 'from-sky-400 to-indigo-600',
      highlightStat: `${products.length} productos activos`,
      actionText: 'Ingresar a Inventario',
    },
    {
      id: 'reports' as AdminTabType,
      title: 'Caja & Reportería Diaria',
      subtitle: 'Ventas del día, cálculo de ganancias netas, desglose de pagos SINPE Móvil y cierre de caja imprimible.',
      badge: 'Cierre & Finanzas',
      badgeColor: 'bg-amber-100 text-amber-800',
      icon: DollarSign,
      iconGradient: 'from-emerald-400 to-teal-700',
      highlightStat: `Inventario: ${formatCRC(totalInventoryValue)}`,
      actionText: 'Ingresar a Caja',
    },
    {
      id: 'workshops' as AdminTabType,
      title: 'Talleres & Inscripciones',
      subtitle: 'Seguimiento de cupos vendidos por fecha, lista de personas inscritas, creación de talleres y links para redes.',
      badge: `${workshops.length} talleres`,
      badgeColor: 'bg-fio-pink/10 text-fio-pink border border-fio-pink/20',
      icon: GraduationCap,
      iconGradient: 'from-fio-pink to-purple-600',
      highlightStat: 'Control de alumnos 1 a 1',
      actionText: 'Ingresar a Talleres',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Bienvenida del Menú Principal */}
      <div className="text-center py-6 px-4 rounded-[32px] bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_10px_25px_rgba(180,160,200,0.08)]">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF5FF] border border-fio-200/60 text-fio-800 text-[11px] font-bold uppercase tracking-widest mb-2">
          <Sparkles className="w-3.5 h-3.5 text-fio-yellow fill-fio-yellow" />
          <span>Centro de Control Administrativo</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bubble font-bold text-fio-900">
          ¿A qué sección deseas ingresar hoy?
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
          Selecciona una de las opciones principales para gestionar tu tienda, inventario, pedidos o talleres.
        </p>
      </div>

      {/* Grid de Cajitas Grandes y Redonditas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuCards.map((card, idx) => {
          const Icon = card.icon;
          const isWide = idx === 0; // The first card can be slightly more prominent if on 2-col layout

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onSelectTab(card.id)}
              className={`group text-left rounded-[32px] p-6 sm:p-7 bg-[#FDFBF9] border border-white/90 shadow-[10px_14px_28px_rgba(180,160,200,0.1),-8px_-8px_20px_rgba(255,255,255,0.95)] hover:shadow-[16px_22px_40px_rgba(180,160,200,0.18),-10px_-10px_24px_rgba(255,255,255,1)] hover:-translate-y-1.5 active:scale-[0.98] transition-all duration-300 flex flex-col justify-between ${
                isWide ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div>
                {/* Header de la Cajita con Icono Gigante Redondito y Badge */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[24px] bg-gradient-to-br ${card.iconGradient} text-white flex items-center justify-center shadow-[0_10px_20px_rgba(147,51,234,0.25),inset_0_2px_4px_rgba(255,255,255,0.4)] group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>

                {/* Título y Subtítulo */}
                <h3 className="text-lg sm:text-xl font-bubble font-bold text-fio-900 group-hover:text-fio-600 transition-colors mb-2 leading-snug">
                  {card.title}
                </h3>

                <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed mb-4">
                  {card.subtitle}
                </p>
              </div>

              {/* Pie de la Cajita con Stat y Botón Redondito de Entrada */}
              <div className="pt-4 border-t border-slate-200/50 flex items-center justify-between gap-2 mt-2">
                <span className="text-[11px] font-semibold text-slate-400">
                  {card.highlightStat}
                </span>

                <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-fio-800 group-hover:bg-fio-900 text-white font-bubble font-bold text-xs shadow-clayBtn transition-all group-hover:translate-x-1">
                  <span>{card.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
