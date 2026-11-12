import React from 'react';
import { useApp } from '../../context/AppContext';
import { getOrganizedShelves, getExtraShelves } from '../../utils/inventoryShelves';
import { ClipboardList, Smartphone, CheckCircle2, ArrowRight, Layers, ShieldCheck, Power, Zap, Hand } from 'lucide-react';
import { playWaterDropSound } from '../../utils/soundEffects';

interface InventoryAdminBannerProps {
  onOpenInventoryApp: () => void;
}

export const InventoryAdminBanner: React.FC<InventoryAdminBannerProps> = ({ onOpenInventoryApp }) => {
  const {
    products,
    currentUser,
    isSuperAdminAuthenticated,
    collaboratorInventoryEnabled,
    toggleCollaboratorInventoryEnabled,
    shelfInventoryStates,
    inventoryAdjustments,
    sweepLoadMode,
    setSweepLoadMode,
    sweepEntries,
  } = useApp();

  const isAdmin = isSuperAdminAuthenticated || (currentUser?.role === 'admin' || !!currentUser?.isMasterAdmin);
  const shelves = React.useMemo(() => getOrganizedShelves(products, getExtraShelves()), [products]);
  const activeShelves = shelves.filter((s) => s.products.length > 0);
  const completedCount = activeShelves.filter(
    (s) => shelfInventoryStates[s.shelfName]?.status === 'completed'
  ).length;

  return (
    <div className="mb-5 rounded-2xl border border-purple-200/90 dark:border-purple-500/30 bg-gradient-to-r from-purple-50/90 via-white to-pink-50/90 dark:from-[#282245] dark:via-[#211D35] dark:to-[#2D244A] p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Izquierda: Título y Estado de Estanterías */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-700 via-fio-purple to-fio-pink text-white flex items-center justify-center shadow-md shrink-0">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bubble font-bold text-base sm:text-lg text-fio-900">
                Módulo de Inventario Físico por Estantería
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                <Layers className="w-3 h-3" />
                {completedCount} / {activeShelves.length || shelves.length} Estantes Listos
              </span>
              {inventoryAdjustments.length > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  {inventoryAdjustments.length} Ajustes Registrados
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 font-sans max-w-2xl leading-relaxed">
              Ingresa a la aplicación independiente tipo PWA para realizar el conteo físico por estantes (Estante 1, 2, 3, 4, 5, 6...), ajustar diferencias y consultar reportes detallados por usuario y fecha.
            </p>
          </div>
        </div>

        {/* Derecha: Switch para Colaborador + Botón Principal "Inventario" */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                playWaterDropSound();
                setSweepLoadMode(sweepLoadMode === 'auto' ? 'manual' : 'auto');
              }}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl border text-xs font-bubble font-bold transition-all active:scale-95 cursor-pointer ${
                sweepLoadMode === 'auto'
                  ? 'bg-purple-50 border-purple-200 text-purple-900 shadow-xs'
                  : 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
              }`}
              title="Alternar carga automática o manual cada 10 productos en Inventario por Barrido"
            >
              {sweepLoadMode === 'auto' ? (
                <Zap className="w-4 h-4 text-purple-600" />
              ) : (
                <Hand className="w-4 h-4 text-amber-600" />
              )}
              <span>
                Barrido: {sweepLoadMode === 'auto' ? 'Auto c/10' : 'Manual c/10'} (
                {sweepEntries.filter((e) => e.status === 'guardado').length} pend.)
              </span>
            </button>
          )}
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                playWaterDropSound();
                toggleCollaboratorInventoryEnabled();
              }}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border text-xs font-bubble font-bold transition-all active:scale-95 cursor-pointer ${
                collaboratorInventoryEnabled
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Activar o desactivar el acceso de este módulo en la PWA de los colaboradores"
            >
              <Smartphone className={`w-4 h-4 ${collaboratorInventoryEnabled ? 'text-emerald-600' : 'text-slate-400'}`} />
              <div className="text-left leading-tight">
                <span className="block text-[10px] uppercase tracking-wider opacity-75">
                  PWA Colaborador
                </span>
                <span className="flex items-center gap-1">
                  {collaboratorInventoryEnabled ? 'Activado' : 'Desactivado'}
                </span>
              </div>
              <div
                className={`w-9 h-5 rounded-full p-0.5 transition-colors flex items-center ${
                  collaboratorInventoryEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
              </div>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              playWaterDropSound();
              onOpenInventoryApp();
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#C084FC] hover:bg-[#A855F7] text-white font-bubble font-bold text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
            title="Abrir aplicación independiente de Inventario por Estantes"
          >
            <ClipboardList className="w-5 h-5 text-fio-yellow" />
            <span>Inventario</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
