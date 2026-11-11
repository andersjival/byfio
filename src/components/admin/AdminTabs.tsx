import React from 'react';

export type AdminTabType =
  | 'hub'
  | 'orders'
  | 'layaways'
  | 'billing'
  | 'inventory'
  | 'reports'
  | 'sinpe'
  | 'workshops'
  | 'pricing'
  | 'users'
  | 'customers'
  | 'agenda'
  | 'suppliers'
  | 'supplier-order-create'
  | 'sales'
  | 'catalog-view';

export interface AdminTabsProps {
  activeTab?: AdminTabType;
  setActiveTab?: (tab: AdminTabType) => void;
}

/**
 * Submenú de pestañas administrativas eliminado definitivamente a petición del usuario.
 * Retorna null en toda la aplicación.
 */
export const AdminTabs: React.FC<AdminTabsProps> = () => null;
