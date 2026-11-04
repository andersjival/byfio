import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AppRoute } from '../../types';
import { SuperadminLogin } from './SuperadminLogin';
import { SuperadminModuleCard } from './SuperadminModuleCard';
import {
  Shield, CheckCheck, RotateCcw, ExternalLink, LogOut, Search,
  SlidersHorizontal, CheckCircle2, AlertCircle, Layers
} from 'lucide-react';

interface SuperadminSectionProps {
  onNavigate: (route: AppRoute) => void;
}

export const SuperadminSection: React.FC<SuperadminSectionProps> = ({ onNavigate }) => {
  const {
    superadminModules,
    isSuperAdminAuthenticated,
    loginSuperAdmin,
    logoutSuperAdmin,
    toggleSuperadminModule,
    toggleSuperadminFeature,
    resetSuperadminModules,
    setAllSuperadminModules,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
              onClick={() => onNavigate('admin')}
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
              onClick={() => {
                if (window.confirm('¿Restablecer configuración oficial de módulos por defecto?')) {
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-purple-800/40">
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
            <span className="text-[10px] text-purple-300 font-medium block">Modo de Control</span>
            <span className="text-xs font-bubble font-bold text-emerald-300 truncate block mt-1">
              Tiempo Real (Live)
            </span>
          </div>
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
          />
        ))}
      </div>

      {filteredModules.length === 0 && (
        <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400">
          <Layers className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold">No se encontraron módulos con el filtro aplicado.</p>
        </div>
      )}
    </div>
  );
};
