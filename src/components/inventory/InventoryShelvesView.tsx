import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useConfirm } from '../../context/ConfirmContext';
import {
  getOrganizedShelves,
  getExtraShelves,
  saveExtraShelf,
  OrganizedShelf,
} from '../../utils/inventoryShelves';
import {
  Layers, Play, CheckCircle2, Clock, CircleDashed, Search,
  RotateCcw, Plus, Package, ChevronDown, Sparkles, ArrowRight
} from 'lucide-react';
import { playWaterDropSound, playBubblePopSound } from '../../utils/soundEffects';

interface InventoryShelvesViewProps {
  onStartShelfCount: (shelfName: string) => void;
}

export const InventoryShelvesView: React.FC<InventoryShelvesViewProps> = ({ onStartShelfCount }) => {
  const {
    products,
    shelfInventoryStates,
    resetShelvesInventoryStatus,
    currentUser,
    isSuperAdminAuthenticated,
  } = useApp();
  const confirm = useConfirm();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [extraShelves, setExtraShelves] = useState<string[]>(() => getExtraShelves());
  const [isShelfPickerOpen, setIsShelfPickerOpen] = useState(false);

  const isAdmin = isSuperAdminAuthenticated || currentUser?.role === 'admin' || !!currentUser?.isMasterAdmin;

  const shelves = useMemo(() => {
    return getOrganizedShelves(products, extraShelves);
  }, [products, extraShelves]);

  // Calcular métricas globales de la jornada
  const stats = useMemo(() => {
    const withProducts = shelves.filter((s) => s.products.length > 0);
    const targetList = withProducts.length > 0 ? withProducts : shelves;
    const completed = targetList.filter((s) => shelfInventoryStates[s.shelfName]?.status === 'completed').length;
    const inProgress = targetList.filter((s) => shelfInventoryStates[s.shelfName]?.status === 'in_progress').length;
    const pending = Math.max(0, targetList.length - completed - inProgress);
    const percent = targetList.length > 0 ? Math.round((completed / targetList.length) * 100) : 0;
    return { total: targetList.length, completed, inProgress, pending, percent };
  }, [shelves, shelfInventoryStates]);

  const filteredShelves = useMemo(() => {
    return shelves.filter((shelf) => {
      const state = shelfInventoryStates[shelf.shelfName]?.status || 'pending';
      if (statusFilter === 'completed' && state !== 'completed') return false;
      if (statusFilter === 'pending' && state === 'completed') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = shelf.shelfName.toLowerCase().includes(q);
        const matchProduct = shelf.products.some(
          (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
        );
        return matchName || matchProduct;
      }
      return true;
    });
  }, [shelves, shelfInventoryStates, statusFilter, searchQuery]);

  const handleAddNextNumberedShelf = () => {
    playWaterDropSound();
    let nextNum = 7;
    const existingNums = shelves
      .map((s) => s.shelfNumber)
      .filter((n): n is number => n !== null);
    if (existingNums.length > 0) {
      nextNum = Math.max(...existingNums) + 1;
    }
    const newName = `Estante ${nextNum}`;
    saveExtraShelf(newName);
    setExtraShelves(getExtraShelves());
    playBubblePopSound();
  };

  const handleResetProgress = async () => {
    const ok = await confirm(
      'Todos los estantes volverán a estado Pendiente para comenzar un nuevo inventario general de la tienda. El historial de ajustes previos se mantendrá intacto.',
      {
        title: '¿Reiniciar progreso visual de estantes?',
        confirmLabel: 'Sí, reiniciar jornada',
        cancelLabel: 'Cancelar',
        variant: 'warning',
      }
    );
    if (ok) {
      resetShelvesInventoryStatus();
      playBubblePopSound();
    }
  };

  return (
    <div className="space-y-4">
      {/* Cabecera y Progreso Visual General */}
      <div className="bg-white rounded-3xl border border-purple-200/80 shadow-xs p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-bubble font-bold text-lg sm:text-xl text-fio-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-fio-pink" />
              <span>Realizar Inventario por Estantería</span>
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Selecciona un estante para iniciar el conteo físico. Los estantes inventariados se marcan en verde automáticamente.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Botón directo de "Seleccionar Estante" */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  playWaterDropSound();
                  setIsShelfPickerOpen((prev) => !prev);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#C084FC] hover:bg-[#A855F7] text-white font-bubble font-bold text-xs sm:text-sm shadow-xs hover:opacity-95 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current text-fio-yellow" />
                <span>Seleccionar Estante</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isShelfPickerOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsShelfPickerOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto bg-white rounded-2xl border border-purple-200 shadow-xl z-40 p-2 space-y-1 animate-fadeIn">
                    <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Elige el estante a inventariar
                    </p>
                    {shelves.map((shelf) => {
                      const status = shelfInventoryStates[shelf.shelfName]?.status || 'pending';
                      return (
                        <button
                          key={shelf.shelfName}
                          type="button"
                          onClick={() => {
                            setIsShelfPickerOpen(false);
                            playWaterDropSound();
                            onStartShelfCount(shelf.shelfName);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-purple-50 text-left text-xs font-bubble font-bold text-slate-800 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-2 truncate">
                            {status === 'completed' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ) : status === 'in_progress' ? (
                              <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            ) : (
                              <CircleDashed className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            )}
                            <span className="truncate">{shelf.shelfName}</span>
                          </span>
                          <span className="text-[10px] font-sans px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                            {shelf.products.length} prod.
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {isAdmin && (
              <button
                type="button"
                onClick={handleResetProgress}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bubble font-bold text-xs transition-all active:scale-95 cursor-pointer"
                title="Reiniciar estado visual de todos los estantes para una nueva jornada"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nueva Jornada</span>
              </button>
            )}
          </div>
        </div>

        {/* Barra de Progreso Visual */}
        <div className="bg-purple-50/70 rounded-2xl p-3.5 border border-purple-100 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-3 font-bubble font-bold">
              <span className="text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {stats.completed} Inventariados
              </span>
              {stats.inProgress > 0 && (
                <span className="text-amber-700 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-amber-500" />
                  {stats.inProgress} En Conteo
                </span>
              )}
              <span className="text-slate-600 flex items-center gap-1">
                <CircleDashed className="w-4 h-4 text-slate-400" />
                {stats.pending} Pendientes
              </span>
            </div>
            <span className="font-mono font-bold text-purple-900">
              {stats.percent}% Completado
            </span>
          </div>
          <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-purple-100">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${stats.percent}%` }}
            />
          </div>
        </div>

        {/* Filtros y Buscador */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar estante o producto (ej: Estante 1, Agenda, bf-...)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:border-purple-400 focus:outline-none text-xs font-sans"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {(['all', 'pending', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-2 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-fio-800 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab === 'all' ? 'Todos' : tab === 'pending' ? 'Faltantes' : 'Completados'}
              </button>
            ))}
            <button
              type="button"
              onClick={handleAddNextNumberedShelf}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bubble font-bold transition-all cursor-pointer"
              title="Agregar un estante numerado adicional"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Estante</span>
            </button>
          </div>
        </div>
      </div>

      {/* Estantería Visual (Grid de Estantes 1, 2, 3, 4, 5, 6...) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredShelves.map((shelf: OrganizedShelf) => {
          const shelfState = shelfInventoryStates[shelf.shelfName];
          const status = shelfState?.status || 'pending';
          const isCompleted = status === 'completed';
          const isInProgress = status === 'in_progress';

          return (
            <div
              key={shelf.shelfName}
              className={`group relative rounded-3xl border-2 p-4 transition-all flex flex-col justify-between bg-white shadow-xs hover:shadow-md ${
                isCompleted
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : isInProgress
                  ? 'border-sky-300 bg-sky-50/20'
                  : 'border-purple-100 hover:border-purple-300'
              }`}
            >
              {/* Barra superior simulando repisa / etiqueta de estante */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bubble font-black text-base shadow-xs shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isInProgress
                          ? 'bg-[#38BDF8] text-white'
                          : 'bg-[#C084FC] text-white'
                      }`}
                    >
                      {shelf.shelfNumber !== null ? `#${shelf.shelfNumber}` : <Layers className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-bubble font-bold text-base text-slate-900 leading-tight">
                        {shelf.shelfName}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] font-sans text-slate-500">
                        <span className="flex items-center gap-1 font-semibold text-purple-800">
                          <Package className="w-3 h-3" />
                          {shelf.products.length} {shelf.products.length === 1 ? 'producto' : 'productos'}
                        </span>
                        <span>•</span>
                        <span>{shelf.totalStockUnits} unid. en sistema</span>
                      </div>
                    </div>
                  </div>

                  {/* Estado Visual Marcado */}
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bubble font-bold shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : isInProgress
                        ? 'bg-sky-100 text-sky-800 border border-sky-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Inventariado</span>
                      </>
                    ) : isInProgress ? (
                      <>
                        <Clock className="w-3 h-3 text-sky-600" />
                        <span>En Proceso</span>
                      </>
                    ) : (
                      <>
                        <CircleDashed className="w-3 h-3 text-slate-400" />
                        <span>Pendiente</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Vista previa tipo repisa de productos en este estante */}
                {shelf.products.length > 0 ? (
                  <div className="bg-slate-50/80 rounded-2xl p-2.5 border border-slate-100 space-y-1.5">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      {shelf.products.slice(0, 5).map((prod) => (
                        <div
                          key={prod.id}
                          className="w-9 h-9 rounded-xl overflow-hidden border border-white shadow-2xs bg-white shrink-0"
                          title={`${prod.name} (Stock: ${prod.stock})`}
                        >
                          <img
                            src={prod.image || '/images/placeholder-new-product.jpg'}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {shelf.products.length > 5 && (
                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                          +{shelf.products.length - 5}
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {shelf.products.slice(0, 2).map((p) => p.name).join(', ')}
                      {shelf.products.length > 2 ? '...' : ''}
                    </p>
                  </div>
                ) : (
                  <div className="bg-slate-50/50 rounded-2xl p-3 border border-dashed border-slate-200 text-center">
                    <p className="text-[11px] text-slate-400 font-sans">
                      Sin productos asignados a este estante aún
                    </p>
                  </div>
                )}

                {shelfState?.lastCountedAt && (
                  <p className="text-[10px] text-emerald-700 font-sans flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Último conteo por <strong>{shelfState.lastCountedBy || 'Usuario'}</strong>
                  </p>
                )}
              </div>

              {/* Botón de acción del estante */}
              <div className="pt-3 mt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    playWaterDropSound();
                    onStartShelfCount(shelf.shelfName);
                  }}
                  className={`w-full py-2.5 px-4 rounded-2xl font-bubble font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs'
                      : isInProgress
                      ? 'bg-[#38BDF8] hover:bg-[#0EA5E9] text-white shadow-xs'
                      : 'bg-[#C084FC] hover:bg-[#A855F7] text-white shadow-xs'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    {isCompleted
                      ? 'Ver / Recontar Estante'
                      : isInProgress
                      ? 'Continuar Inventario'
                      : 'Empezar Inventario'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
