import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminTabType } from './AdminTabs';
import {
  QrCode, Receipt, Boxes, Landmark, GraduationCap,
  ChevronRight, Sparkles
} from 'lucide-react';

interface AdminHubMenuProps {
  onSelectTab: (tab: AdminTabType) => void;
}

export const AdminHubMenu: React.FC<AdminHubMenuProps> = ({ onSelectTab }) => {
  const { orders, products, workshops } = useApp();

  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'picking');
  const criticalProducts = products.filter((p) => p.stock <= p.minStock);

  const menuItems = [
    {
      id: 'orders' as AdminTabType,
      title: 'Cola de Pedidos',
      badge: pendingOrders.length > 0 ? `${pendingOrders.length} por alistar` : 'Al día',
      badgeClass: pendingOrders.length > 0 ? 'bg-fio-pink text-white animate-pulse' : 'bg-emerald-50 text-emerald-700',
      icon: QrCode,
      gradient: 'from-[#A855F7] to-[#6B21A8]',
    },
    {
      id: 'billing' as AdminTabType,
      title: 'Facturación Rápida',
      badge: 'Buscar por # orden',
      badgeClass: 'bg-fio-100 text-fio-800',
      icon: Receipt,
      gradient: 'from-[#C084FC] to-[#8B5CF6]',
    },
    {
      id: 'inventory' as AdminTabType,
      title: 'Inventario & QR',
      badge: criticalProducts.length > 0 ? `${criticalProducts.length} por reponer` : `${products.length} productos`,
      badgeClass: criticalProducts.length > 0 ? 'bg-red-500 text-white' : 'bg-sky-50 text-sky-700',
      icon: Boxes,
      gradient: 'from-[#38BDF8] to-[#4338CA]',
    },
    {
      id: 'reports' as AdminTabType,
      title: 'Caja & Reportería',
      badge: 'Cierre diario',
      badgeClass: 'bg-amber-50 text-amber-800',
      icon: Landmark,
      gradient: 'from-[#34D399] to-[#047857]',
    },
    {
      id: 'workshops' as AdminTabType,
      title: 'Talleres & Alumnos',
      badge: `${workshops.length} programados`,
      badgeClass: 'bg-pink-50 text-fio-pink',
      icon: GraduationCap,
      gradient: 'from-[#EC4899] to-[#BE185D]',
    },
  ];

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Título Compacto de una Sola Línea */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-purple-100 text-fio-700">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <h2 className="font-bubble font-bold text-sm sm:text-base text-fio-900">
            Menú Principal de Administración
          </h2>
        </div>
        <span className="text-[11px] text-slate-400 font-sans hidden sm:inline">
          Selecciona una sección para ingresar
        </span>
      </div>

      {/* Grid de Cajitas Compactas, Redonditas y Profesionales (Todo en 1 Sola Pantalla) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className="group text-left rounded-2xl p-4 bg-[#FDFBF9] border border-white/90 shadow-[0_4px_16px_rgba(180,160,200,0.08)] hover:shadow-[0_8px_24px_rgba(180,160,200,0.18)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 flex flex-col justify-between min-h-[125px] sm:min-h-[140px]"
            >
              {/* Icono Elegante con Gradiente & Badge */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-fio-700 group-hover:translate-x-0.5 transition-all" />
              </div>

              {/* Título & Badge Limpio (Sin Párrafos Relleno) */}
              <div className="space-y-1.5">
                <h3 className="font-bubble font-bold text-xs sm:text-sm text-fio-900 group-hover:text-fio-600 transition-colors leading-snug">
                  {item.title}
                </h3>

                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeClass}`}>
                  {item.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
