import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useConfirm } from '../../context/ConfirmContext';
import { AppRoute } from '../../types';
import { AdminTabType } from '../admin/AdminTabs';
import { SuperadminLogin } from './SuperadminLogin';
import { SuperadminModuleCard } from './SuperadminModuleCard';
import { SuppliersOrdersSection } from '../admin/SuppliersOrdersSection';
import {
  Shield, CheckCheck, RotateCcw, ExternalLink, LogOut, Search,
  SlidersHorizontal, CheckCircle2, AlertCircle, Layers,
  ToggleLeft, ToggleRight, Boxes, Truck, ArrowLeft, Bell,
  MessageCircle, Trash2, Calendar, Phone, CheckCircle, Sparkles, Eye, Award, Save
} from 'lucide-react';

interface SuperadminSectionProps {
  onNavigate: (route: AppRoute, targetTab?: AdminTabType) => void;
}

export const SuperadminSection: React.FC<SuperadminSectionProps> = ({ onNavigate }) => {
  const confirm = useConfirm();
  const {
    superadminModules,
    isSuperAdminAuthenticated,
    loginSuperAdmin,
    logoutSuperAdmin,
    toggleSuperadminModule,
    toggleSuperadminFeature,
    deactivateSuperadminModuleComplete,
    activateSuperadminModuleComplete,
    resetSuperadminModules,
    setAllSuperadminModules,
    inventoryMode,
    setInventoryMode,
    supplierOrders,
    proposalAcceptances,
    updateProposalAcceptanceStatus,
    deleteProposalAcceptance,
    markProposalAcceptanceAsRead,
  } = useApp();

  const [activeSuperadminTab, setActiveSuperadminTab] = useState<'modules' | 'suppliers' | 'proposals'>('modules');
  const [proposalStatusFilter, setProposalStatusFilter] = useState<'all' | 'pending' | 'contacted' | 'active'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const totalModules = superadminModules.length;
  const enabledModules = superadminModules.filter((m) => m.enabled).length;

  const totalFeatures = useMemo(() => {
    return superadminModules.reduce((acc, m) => acc + m.features.length, 0);
  }, [superadminModules]);

  const enabledFeatures = useMemo(() => {
    return superadminModules.reduce(
      (acc, m) => acc + (m.enabled ? m.features.filter((f) => f.enabled).length : 0),
      0
    );
  }, [superadminModules]);

  const handleSaveExplicit = () => {
    setSaveToast('Configuración de módulos y funcionalidades guardada con éxito en tiempo real en Cloudflare D1.');
    setTimeout(() => setSaveToast(null), 3500);
  };

  const categories = ['all', 'Operaciones & WMS', 'Ventas & Caja', 'Tienda & Catálogo', 'Configuración & Analítica'];

  const filteredModules = useMemo(() => {
    return superadminModules.filter((m) => {
      const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory;

      const matchesQuery =
        m.name.toLowerCase().includes(query) ||
        m.id.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.features.some((f) => f.name.toLowerCase().includes(query) || f.description.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [superadminModules, selectedCategory, searchQuery]);

  if (!isSuperAdminAuthenticated) {
    return <SuperadminLogin onLogin={loginSuperAdmin} onBackToStore={() => onNavigate('home')} />;
  }

  return (
    <div className="space-y-5 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      {saveToast && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center gap-2.5 font-bubble font-bold text-xs animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-200" />
          <span>{saveToast}</span>
        </div>
      )}
      {/* Barra de Encabezado Superadmin */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-[#1F1033] via-[#2A1344] to-[#160B24] text-white border border-purple-500/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-900/40 shrink-0">
              <Shield className="w-6 h-6 text-fio-yellow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-pink-300 uppercase font-bold bg-pink-500/20 px-2 py-0.5 rounded-full">
                  Superadmin Console
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> En vivo (0ms)
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bubble font-bold text-white leading-tight">
                Gestor Maestro de Módulos Web
              </h1>
              <p className="text-xs text-purple-200/80 font-sans">
                Activa o desactiva módulos y funcionalidades independientes de la plataforma by.fio
              </p>
            </div>
          </div>

          {/* Acciones Rápidas Superadmin */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveSuperadminTab(activeSuperadminTab === 'suppliers' ? 'modules' : 'suppliers')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer ${
                activeSuperadminTab === 'suppliers'
                  ? 'bg-amber-500 text-amber-950 font-bold border border-amber-300'
                  : 'bg-amber-600/50 hover:bg-amber-600 text-white border border-amber-400/40'
              }`}
              title="Gestionar Pedidos a Proveedor & Requisiciones directamente en Superadmin"
            >
              <Truck className="w-3.5 h-3.5 text-amber-200" />
              <span>Pedidos Proveedor</span>
              {supplierOrders?.filter((o: any) => o.status === 'draft' || o.status === 'ordered').length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-950 text-amber-100 text-[10px] font-bold">
                  {supplierOrders.filter((o: any) => o.status === 'draft' || o.status === 'ordered').length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={handleSaveExplicit}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bubble font-bold shadow-md active:scale-95 transition-all cursor-pointer"
              title="Guardar y sincronizar configuración en Cloudflare D1"
            >
              <Save className="w-3.5 h-3.5 text-emerald-200" />
              <span>Guardar Cambios</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('admin', 'suppliers')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600/50 hover:bg-purple-600 text-white text-xs font-semibold border border-purple-400/40 shadow-xs active:scale-95 transition-all cursor-pointer"
              title="Abrir panel administrativo estándar"
            >
              <ExternalLink className="w-3.5 h-3.5 text-fio-yellow" />
              <span>Ver Panel Admin</span>
            </button>

            <button
              type="button"
              onClick={() => setAllSuperadminModules(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/40 hover:bg-emerald-600 text-white text-xs font-semibold border border-emerald-400/40 shadow-xs active:scale-95 transition-all cursor-pointer"
              title="Habilitar todos los módulos y sub-funcionalidades"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Activar Todos</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                if (await confirm('¿Restablecer configuración oficial de módulos por defecto?', { title: 'Restablecer Módulos', variant: 'warning', confirmLabel: 'Sí, restablecer' })) {
                  resetSuperadminModules();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 shadow-xs active:scale-95 transition-all cursor-pointer"
              title="Restablecer todos los módulos al estado de fábrica"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Restablecer</span>
            </button>

            <button
              type="button"
              onClick={logoutSuperAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-200 text-xs font-semibold border border-rose-500/40 shadow-xs active:scale-95 transition-all cursor-pointer"
              title="Cerrar sesión de Superadmin"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Salir</span>
            </button>
          </div>
        </div>

        {/* Tarjetas de Resumen KPI */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-5 pt-4 border-t border-purple-800/40">
          <div className="bg-purple-950/50 rounded-xl p-2.5 border border-purple-500/20">
            <span className="text-[10px] text-purple-300 font-medium block">Módulos Activos</span>
            <span className="text-lg font-bubble font-bold text-white">
              {enabledModules} <span className="text-xs text-purple-400">/ {totalModules}</span>
            </span>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-2.5 border border-purple-500/20">
            <span className="text-[10px] text-purple-300 font-medium block">Funcionalidades</span>
            <span className="text-lg font-bubble font-bold text-pink-300">
              {enabledFeatures} <span className="text-xs text-purple-400">/ {totalFeatures}</span>
            </span>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-2.5 border border-purple-500/20">
            <span className="text-[10px] text-purple-300 font-medium block">Ocultos en Admin</span>
            <span className="text-lg font-bubble font-bold text-rose-300">
              {totalModules - enabledModules}
            </span>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-2.5 border border-purple-500/20">
            <span className="text-[10px] text-purple-300 font-medium block">Propuestas Aceptadas</span>
            <span className="text-lg font-bubble font-bold text-amber-300">
              {proposalAcceptances.length} <span className="text-xs text-purple-400">({proposalAcceptances.filter(a => a.status === 'pending').length} pend.)</span>
            </span>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-2.5 border border-purple-500/20">
            <span className="text-[10px] text-purple-300 font-medium block">Modo Inventario</span>
            <span className={`text-xs font-bubble font-bold truncate block mt-1 ${inventoryMode === 'stock' ? 'text-purple-300' : 'text-emerald-300'}`}>
              {inventoryMode === 'stock' ? 'Stock Numérico' : 'Disponibilidad'}
            </span>
          </div>
        </div>
      </div>

      {/* Tarjeta de Control Directo de Modos de Inventario (Stock vs Disponibilidad) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-purple-300 shadow-[0_4px_25px_rgba(147,51,234,0.08)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-700 to-pink-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <SlidersHorizontal className="w-5 h-5 text-fio-yellow" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-wider text-purple-700 uppercase font-bold bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200/60">
                Funcionalidad Directa Superadmin
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Modo actual: <strong className="text-purple-700 font-bold">{inventoryMode === 'stock' ? 'Stock Numérico Real' : 'Disponibilidad Rápida'}</strong>
              </span>
            </div>
            <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-800 leading-tight">
              Control de Stock &amp; Disponibilidad de Producto
            </h3>
            <p className="text-xs text-slate-500 font-sans">
              Alterna al instante el comportamiento del inventario y la visibilidad de los artículos en la tienda
            </p>
          </div>
        </div>

        {/* Los 2 botones exactos con interacción inmediata */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
          <button
            type="button"
            onClick={() => {
              const nextMode = inventoryMode === 'stock' ? 'availability' : 'stock';
              setInventoryMode(nextMode);
              toggleSuperadminFeature('inventory', 'inventory_stock_mode', nextMode === 'stock');
              toggleSuperadminFeature('inventory', 'product_availability_mode', nextMode === 'availability');
              setSaveToast(nextMode === 'stock' ? '✓ Modo Stock Numérico activado (Columna visible en Admin)' : '✓ Modo Disponibilidad Rápida activado (Columna Stock desactivada)');
              setTimeout(() => setSaveToast(null), 3000);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bubble text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer ${
              inventoryMode === 'stock'
                ? 'bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 hover:border-rose-300'
                : 'bg-fio-800 hover:bg-fio-900 text-white shadow-sm'
            }`}
            title={inventoryMode === 'stock' ? 'Desactiva la columna de stock y activa el modo de disponibilidad rápida' : 'Vuelve a mostrar la columna de stock numérico'}
          >
            {inventoryMode === 'stock' ? (
              <>
                <ToggleLeft className="w-4 h-4 text-rose-500" />
                <span>Desactivar stock de inventario</span>
              </>
            ) : (
              <>
                <Boxes className="w-4 h-4 text-fio-yellow" />
                <span>Activar stock de inventario</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              const nextMode = inventoryMode === 'availability' ? 'stock' : 'availability';
              setInventoryMode(nextMode);
              toggleSuperadminFeature('inventory', 'inventory_stock_mode', nextMode === 'stock');
              toggleSuperadminFeature('inventory', 'product_availability_mode', nextMode === 'availability');
              setSaveToast(nextMode === 'availability' ? '✓ Modo Disponibilidad Rápida activado (Columna Stock desactivada)' : '✓ Modo Stock Numérico activado');
              setTimeout(() => setSaveToast(null), 3000);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bubble text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer ${
              inventoryMode === 'availability'
                ? 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
            }`}
            title={inventoryMode === 'availability' ? 'Desactiva el modo disponibilidad y regresa a stock real' : 'Activa la columna de disponibilidad y oculta el stock'}
          >
            {inventoryMode === 'availability' ? (
              <>
                <ToggleRight className="w-4 h-4 text-emerald-600" />
                <span>Desactivar disponibilidad de producto</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Activar disponibilidad de producto</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* BANNER DE NOTIFICACIÓN EXCLUSIVA DE PROPUESTAS ACEPTADAS (SOLO SUPERADMIN) */}
      {proposalAcceptances.filter((a) => a.status === 'pending' || !a.readBySuperadmin).length > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/20 via-pink-500/15 to-purple-600/20 border-2 border-amber-400/60 shadow-xl shadow-amber-900/10 space-y-3 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-amber-300/30">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-500 text-amber-950 flex items-center justify-center font-bold text-sm animate-bounce">
                <Bell className="w-4 h-4" />
              </span>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bubble font-bold">
                  <span>Exclusivo Superadmin</span>
                </div>
                <h3 className="font-bubble font-bold text-sm sm:text-base text-white">
                  ¡Nueva Propuesta Partner Aceptada! ({proposalAcceptances.filter((a) => a.status === 'pending').length} pendiente{proposalAcceptances.filter((a) => a.status === 'pending').length > 1 ? 's' : ''})
                </h3>
              </div>
            </div>

            <button
              onClick={() => setActiveSuperadminTab('proposals')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bubble font-bold transition-all shadow-sm cursor-pointer"
            >
              <span>Ver en Pestaña Propuestas</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {proposalAcceptances
              .filter((a) => a.status === 'pending' || !a.readBySuperadmin)
              .slice(0, 2)
              .map((acc) => (
                <div
                  key={acc.id}
                  className="p-3.5 rounded-2xl bg-black/40 border border-amber-400/40 text-xs text-purple-100 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bubble font-bold text-white text-sm block">
                        {acc.clientName}
                      </span>
                      <span className="text-[11px] text-amber-300 font-mono">
                        Tel: {acc.clientPhone}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/30 text-amber-300 border border-amber-400/40">
                      {acc.status === 'pending' ? 'Pendiente' : acc.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-purple-200/90 font-sans italic bg-white/5 p-2 rounded-xl">
                    "{acc.notes}"
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[11px]">
                    <span className="text-pink-300 font-bold">
                      {acc.planName} • ₡{acc.monthlyFee.toLocaleString()}/mes
                    </span>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/506${acc.clientPhone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(acc.clientName)},%20he%20recibido%20tu%20aceptación%20de%20la%20propuesta%20Partner%20By.Fio.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                      <button
                        onClick={() => updateProposalAcceptanceStatus(acc.id, 'contacted')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] transition-all cursor-pointer"
                      >
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        <span>Atender</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Selector de Vistas de la Consola Superadmin */}
      <div className="flex items-center gap-2 p-1.5 bg-purple-950/40 rounded-2xl border border-purple-800/40 w-fit">
        <button
          type="button"
          onClick={() => setActiveSuperadminTab('modules')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bubble text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSuperadminTab === 'modules'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
              : 'text-purple-200 hover:text-white hover:bg-white/10'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Gestor Maestro de Módulos</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 text-purple-200 font-mono">
            {enabledModules}/{totalModules}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSuperadminTab('suppliers')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bubble text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSuperadminTab === 'suppliers'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs'
              : 'text-amber-200 hover:text-white hover:bg-white/10'
          }`}
        >
          <Truck className="w-4 h-4 text-amber-300" />
          <span>Pedidos a Proveedor</span>
          {supplierOrders && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-200 font-bold font-mono">
              {supplierOrders.filter((o: any) => o.status === 'draft').length} por pedir • {supplierOrders.filter((o: any) => o.status === 'ordered').length} realizados
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSuperadminTab('proposals')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bubble text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSuperadminTab === 'proposals'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xs'
              : 'text-emerald-200 hover:text-white hover:bg-white/10'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-300" />
          <span>Propuestas Aceptadas</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-200 font-bold font-mono">
            {proposalAcceptances.length}
          </span>
        </button>
      </div>

      {activeSuperadminTab === 'suppliers' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-300/80 rounded-3xl shadow-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveSuperadminTab('modules')}
                className="p-2 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 transition-all cursor-pointer shadow-2xs"
                title="Volver al Gestor Maestro de Módulos"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full">
                    Control Maestro Superadmin
                  </span>
                  <span className="text-xs text-amber-800 font-semibold">
                    Acceso Total con Sincronización en la Nube Cloudflare D1
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bubble font-bold text-slate-900">
                  Gestión de Pedidos a Proveedor &amp; Requisiciones
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveSuperadminTab('modules')}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bubble font-bold border border-slate-300 shadow-2xs cursor-pointer"
              >
                ← Volver a Módulos
              </button>
              <button
                type="button"
                onClick={() => onNavigate('admin', 'suppliers')}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bubble font-bold shadow-2xs cursor-pointer flex items-center gap-1.5"
                title="Abrir este módulo en el Panel de Administración Estándar"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-200" />
                <span>Abrir en Panel Admin</span>
              </button>
            </div>
          </div>

          <SuppliersOrdersSection />
        </div>
      )}

      {/* PESTAÑA DE PROPUESTAS ACEPTADAS (EXCLUSIVO SUPERADMIN) */}
      {activeSuperadminTab === 'proposals' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-purple-500/10 border border-emerald-300/80 rounded-3xl shadow-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveSuperadminTab('modules')}
                className="p-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 border border-emerald-300 transition-all cursor-pointer shadow-2xs"
                title="Volver al Gestor Maestro de Módulos"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-emerald-950 bg-emerald-200 px-2 py-0.5 rounded-full">
                    Exclusivo Superadmin
                  </span>
                  <span className="text-xs text-emerald-800 font-semibold">
                    Registro Confidencial de Propuestas Aceptadas
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bubble font-bold text-slate-900">
                  Notificaciones de Aceptación de Propuesta Partner
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('propuesta')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bubble font-bold shadow-xs cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ver Ficha Propuesta</span>
              </button>
            </div>
          </div>

          {/* Filtros de Estado */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-1.5">
              {[
                { id: 'all', label: `Todas (${proposalAcceptances.length})` },
                { id: 'pending', label: `Pendientes (${proposalAcceptances.filter((a) => a.status === 'pending').length})` },
                { id: 'contacted', label: `Contactadas (${proposalAcceptances.filter((a) => a.status === 'contacted').length})` },
                { id: 'active', label: `Activas (${proposalAcceptances.filter((a) => a.status === 'active').length})` },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setProposalStatusFilter(pill.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-semibold transition-all cursor-pointer ${
                    proposalStatusFilter === pill.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Aceptaciones */}
          <div className="space-y-3">
            {proposalAcceptances
              .filter((acc) => proposalStatusFilter === 'all' || acc.status === proposalStatusFilter)
              .map((acc) => (
                <div
                  key={acc.id}
                  className={`p-5 rounded-2xl border transition-all space-y-3 ${
                    acc.status === 'pending'
                      ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                      : acc.status === 'contacted'
                      ? 'bg-sky-50/70 border-sky-300'
                      : 'bg-emerald-50/70 border-emerald-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-fio-purple to-fio-pink text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        <Award className="w-5 h-5 text-fio-yellow" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bubble font-bold text-base text-slate-900">
                            {acc.clientName}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              acc.status === 'pending'
                                ? 'bg-amber-200 text-amber-900 animate-pulse'
                                : acc.status === 'contacted'
                                ? 'bg-sky-200 text-sky-900'
                                : 'bg-emerald-200 text-emerald-900'
                            }`}
                          >
                            {acc.status === 'pending'
                              ? '● Pendiente de Contacto'
                              : acc.status === 'contacted'
                              ? '✓ Contactado'
                              : '★ Socio Activo'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-sans">
                          Aceptado el {new Date(acc.acceptedAt).toLocaleString('es-CR')}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-500 block">Plan Aceptado</span>
                      <span className="font-bubble font-bold text-sm text-fio-purple">
                        {acc.planName} • ₡{acc.monthlyFee.toLocaleString()}/mes
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/80 border border-slate-200/70 text-xs text-slate-700 font-sans">
                    <span className="font-bold text-slate-900 block mb-0.5">Mensaje o Nota del Cliente:</span>
                    <p className="italic">{acc.notes || 'Sin notas adicionales.'}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/506${acc.clientPhone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(acc.clientName)},%20te%20escribo%20del%20equipo%20técnico%20de%20By.Fio%20para%20coordinar%20la%20activación%20de%20tu%20plataforma%20digital.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bubble font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp ({acc.clientPhone})</span>
                      </a>

                      <a
                        href={`tel:${acc.clientPhone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bubble font-semibold transition-all cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Llamar</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={acc.status}
                        onChange={(e) => updateProposalAcceptanceStatus(acc.id, e.target.value as any)}
                        className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                      >
                        <option value="pending">Estado: Pendiente</option>
                        <option value="contacted">Estado: Contactado</option>
                        <option value="active">Estado: Socio Activo</option>
                      </select>

                      <button
                        type="button"
                        onClick={async () => {
                          if (await confirm('¿Eliminar esta notificación de aceptación de propuesta?', { title: 'Eliminar Notificación', variant: 'danger', confirmLabel: 'Sí, eliminar' })) {
                            deleteProposalAcceptance(acc.id);
                          }
                        }}
                        className="p-1.5 rounded-xl hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                        title="Eliminar notificación"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            {proposalAcceptances.length === 0 && (
              <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 text-slate-400 space-y-2">
                <Award className="w-10 h-10 mx-auto text-slate-300" />
                <h4 className="font-bubble font-bold text-base text-slate-700">
                  No hay propuestas aceptadas todavía
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
                  Cuando un cliente o Fio haga clic en "Aceptar Propuesta" en la página /propuesta, la notificación se registrará exclusivamente aquí en tiempo real.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSuperadminTab === 'modules' && (
        <>
          {/* Tarjeta de Acceso y Control Directo: Pedidos a Proveedor en Superadmin */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-300/80 shadow-[0_4px_20px_rgba(245,158,11,0.08)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Truck className="w-5 h-5 text-amber-100" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono tracking-wider text-amber-800 uppercase font-bold bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300/70">
                    Módulo Integrado en Superadmin
                  </span>
                  <span className="text-xs text-slate-600 font-medium">
                    {supplierOrders.filter((o: any) => o.status === 'draft').length} por pedir • {supplierOrders.filter((o: any) => o.status === 'ordered').length} realizados en historial
                  </span>
                </div>
                <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-800 leading-tight">
                  Control de Pedidos a Proveedor &amp; Requisiciones
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  Gestiona órdenes de compra en borrador para pedir después e historial de compras formalizadas con los proveedores
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
              <button
                type="button"
                onClick={() => setActiveSuperadminTab('suppliers')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bubble text-xs font-bold transition-all shadow-clayBtn active:scale-95 cursor-pointer"
                title="Abrir y gestionar pedidos a proveedor directamente en Superadmin"
              >
                <Truck className="w-4 h-4 text-amber-200" />
                <span>Gestionar Pedidos Proveedor</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('admin', 'suppliers')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 font-bubble text-xs font-semibold shadow-2xs active:scale-95 cursor-pointer"
                title="Abrir en el panel administrativo estándar"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
                <span>Ver en Admin</span>
              </button>
            </div>
          </div>

          {/* Barra de Filtros y Búsqueda */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Pestañas de Categoría */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-fio-800 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat === 'all' ? `Todos (${totalModules})` : cat}
                </button>
              ))}
            </div>

            {/* Input de Búsqueda */}
            <div className="relative min-w-[240px]">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar módulo o funcionalidad..."
                className="w-full pl-8.5 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-purple-400 focus:bg-white text-xs outline-none transition-all"
              />
            </div>
          </div>

          {/* Lista de Módulos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredModules.map((module) => (
              <SuperadminModuleCard
                key={module.id}
                module={module}
                onToggleModule={toggleSuperadminModule}
                onToggleFeature={toggleSuperadminFeature}
                onDeactivateComplete={deactivateSuperadminModuleComplete}
                onActivateComplete={activateSuperadminModuleComplete}
              />
            ))}
          </div>

          {filteredModules.length === 0 && (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400">
              <Layers className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold">No se encontraron módulos con el filtro aplicado.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
