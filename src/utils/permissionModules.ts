import React from 'react';
import {
  QrCode,
  BookmarkCheck,
  Receipt,
  Boxes,
  Landmark,
  GraduationCap,
  Users,
  UserCheck,
  Calendar,
  Truck,
  ShoppingBag,
} from 'lucide-react';
import { UserPermissions } from '../types';

export interface PermissionModuleDef {
  key: keyof UserPermissions;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * Catálogo unificado y oficial de módulos de administración con permisos asignables
 * a colaboradores. Usado idénticamente en Perfiles de Usuario y en Aplicaciones PC / Celular.
 */
export const COLLABORATOR_PERMISSION_MODULES: PermissionModuleDef[] = [
  { key: 'orders', label: 'Cola de Pedidos', desc: 'Cola de pedidos, escaneo de picking y empaque', icon: QrCode },
  { key: 'layaways', label: 'Apartados', desc: 'Control y abonos de apartados de clientes', icon: BookmarkCheck },
  { key: 'billing', label: 'Facturación Rápida', desc: 'Búsqueda de órdenes y facturas por número', icon: Receipt },
  { key: 'inventory', label: 'Mis Productos', desc: 'Catálogo de insumos, stock y etiquetas QR', icon: Boxes },
  { key: 'reports', label: 'Caja & Reportería', desc: 'Arqueo diario, balances y cobros del día', icon: Landmark },
  { key: 'workshops', label: 'Talleres & Alumnos', desc: 'Inscripciones, cupos y lista de participantes', icon: GraduationCap },
  { key: 'users', label: 'Perfiles de Usuarios', desc: 'Crear, editar o revocar accesos a otros usuarios', icon: Users },
  { key: 'customers', label: 'Directorio de Clientes', desc: 'Registro de clientes y fichas para pedidos', icon: UserCheck },
  { key: 'agenda', label: 'Agenda & Tareas', desc: 'Acceso al organizador del taller y calendario', icon: Calendar },
  { key: 'suppliers', label: 'Pedidos a Proveedor', desc: 'Órdenes de compra, borradores e historial con proveedores', icon: Truck },
  { key: 'sales', label: 'Historial de Ventas', desc: 'Consulta de ventas realizadas y órdenes facturadas', icon: ShoppingBag },
];
