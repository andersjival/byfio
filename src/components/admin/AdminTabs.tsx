import React from 'react';
import {
  ArrowLeft, Package, FileText, QrCode, DollarSign,
  GraduationCap, Tag, Users, Landmark, UserCheck, Calendar, Truck
} from 'lucide-react';

export type AdminTabType =
  | 'hub'
  | 'orders'
  | 'billing'
  | 'inventory'
  | 'reports'
  | 'sinpe'
  | 'workshops'
  | 'pricing'
  | 'users'
  | 'customers'
  | 'agenda'
  | 'suppliers';

interface AdminTabsProps {
  activeTab: AdminTabType;
  setActiveTab: (tab: AdminTabType) => void;
}

const TAB_CONFIG: Record<AdminTabType, { label: string; icon: any }> = {
  hub: { label: 'Menú Principal', icon: ArrowLeft },
  orders: { label: 'Pedidos & Alisto', icon: QrCode },
  billing: { label: 'Facturación Rápida', icon: FileText },
  inventory: { label: 'Inventario & WMS', icon: Package },
  reports: { label: 'Caja & Reportes', icon: DollarSign },
  sinpe: { label: 'Pagos SINPE BCR', icon: Landmark },
  workshops: { label: 'Talleres Creativos', icon: GraduationCap },
  pricing: { label: 'Precios & Stickers', icon: Tag },
  users: { label: 'Perfiles de Usuario', icon: Users },
  customers: { label: 'Directorio de Clientes', icon: UserCheck },
  agenda: { label: 'Agenda & Tareas', icon: Calendar },
  suppliers: { label: 'Pedidos a Proveedor', icon: Truck },
};

export const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, setActiveTab }) => {
  const current = TAB_CONFIG[activeTab] || { label: 'Administración', icon: ArrowLeft };
  const Icon = current.icon;

  return (
    <div className="flex items-center justify-between gap-3 mb-4 p-2 sm:p-2.5 rounded-2xl bg-white/85 backdrop-blur-xs border border-slate-200/80 shadow-2xs">
      <button
        type="button"
        onClick={() => setActiveTab('hub')}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-pink-50 hover:bg-pink-100/90 text-fio-pink hover:text-fio-700 font-bubble font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer border border-pink-200/70 shadow-2xs"
        title="Regresar al Menú Principal de Administración"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>← Volver al Menú Principal</span>
      </button>

      <div className="flex items-center gap-2 text-xs font-bubble font-semibold text-slate-600 pr-2">
        <span className="w-7 h-7 rounded-lg bg-purple-50 text-fio-pink flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </span>
        <span className="hidden sm:inline text-slate-400">Sección:</span>
        <span className="text-slate-800 font-bold">{current.label}</span>
      </div>
    </div>
  );
};
