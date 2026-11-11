import React, { useMemo, useState, useRef, Suspense } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, SweepEntryStatus } from '../../types';
import {
  getOrganizedShelves, getExtraShelves, saveExtraShelf, extractShelfNumber
} from '../../utils/inventoryShelves';
import { formatShortDate } from '../../utils/formatters';
import { playWaterDropSound, playBubblePopSound } from '../../utils/soundEffects';
import { InventorySweepProductPanel } from './InventorySweepProductPanel';
import { InventorySweepHistory } from './InventorySweepHistory';
import {
  Layers, Camera, Search, Plus, ArrowLeft, Zap, Hand, UploadCloud,
  CheckCircle2, Clock, Sparkles, PlusCircle, ChevronRight
} from 'lucide-react';

const CameraBarcodeScannerModal = React.lazy(() =>
  import('../mobile/CameraBarcodeScannerModal').then((m) => ({ default: m.CameraBarcodeScannerModal }))
);

const normCode = (v?: string) => (v || '').trim().toLowerCase().replace(/^fio-/, 'bf-');

export const InventorySweepView: React.FC = () => {
  const {
    products,
    sweepEntries,
    sweepLoadMode,
    setSweepLoadMode,
    loadSweepEntriesToInventory,
  } = useApp();

  const [extraShelves, setExtraShelves] = useState<string[]>(() => getExtraShelves());
  const [selectedShelf, setSelectedShelf] = useState<string | null>(null);
  const [newShelfInput, setNewShelfInput] = useState('');
  const [showNewShelfForm, setShowNewShelfForm] = useState(false);

  // Estado de espera / escaneo / búsqueda
  const [codeInput, setCodeInput] = useState('');
  const [matchedProduct, setMatchedProduct] = useState<Product | null>(null);
  const [unmatchedCode, setUnmatchedCode] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isLoadingBatch, setIsLoadingBatch] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const shelves = useMemo(
    () => getOrganizedShelves(products, extraShelves),
    [products, extraShelves]
  );

  const availableShelfNames = useMemo(
    () => shelves.map((s) => s.shelfName),
    [shelves]
  );

  const pendingEntries = useMemo(
    () => sweepEntries.filter((e) => e.status === 'guardado'),
    [sweepEntries]
  );
  const pendingCount = pendingEntries.length;
  const lastEntry = sweepEntries[0] || null;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleAddShelf = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newShelfInput.trim();
    if (!clean) return;
    const formatted = /^\d+$/.test(clean) ? `Estante ${clean}` : clean;
    saveExtraShelf(formatted);
    setExtraShelves(getExtraShelves());
    setNewShelfInput('');
    setShowNewShelfForm(false);
    setSelectedShelf(formatted);
  };

  // Coincidencias rápidas mientras escribe en búsqueda manual
  const quickSuggestions = useMemo(() => {
    const q = codeInput.trim().toLowerCase();
    if (!q || q.length < 2) return [];
    const normQ = normCode(q);
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          normCode(p.sku).includes(normQ) ||
          (p.qrCode && normCode(p.qrCode).includes(normQ))
      )
      .slice(0, 6);
  }, [codeInput, products]);

  const lookupCodeOrManual = (raw: string) => {
    const clean = raw.trim();
    if (!clean) return;
    const cleanNorm = normCode(clean);
    const found =
      products.find(
        (p) =>
          normCode(p.sku) === cleanNorm ||
          (p.qrCode && normCode(p.qrCode) === cleanNorm) ||
          p.name.trim().toLowerCase() === clean.toLowerCase()
      ) || null;

    if (found) {
      playBubblePopSound();
      setMatchedProduct(found);
      setUnmatchedCode(null);
    } else {
      playWaterDropSound();
      setMatchedProduct(null);
      setUnmatchedCode(clean);
    }
    setCodeInput('');
  };

  const handleManualLoadBatch = async () => {
    if (pendingCount === 0 || isLoadingBatch) return;
    setIsLoadingBatch(true);
    try {
      const count = await loadSweepEntriesToInventory();
      if (count > 0) {
        playBubblePopSound();
        showToast(`✓ ${count} producto(s) cargados al inventario real correctamente.`);
      }
    } finally {
      setIsLoadingBatch(false);
    }
  };

  const handleRegistered = (info: {
    entryName: string;
    qty: number;
    autoLoadedCount: number;
    status: SweepEntryStatus;
  }) => {
    playBubblePopSound();
    setMatchedProduct(null);
    setUnmatchedCode(null);
    if (info.autoLoadedCount > 0) {
      showToast(
        `⚡ +${info.qty} "${info.entryName}". ¡Lote de ${info.autoLoadedCount} productos cargado automáticamente al inventario!`
      );
    } else {
      showToast(`✓ Guardado "${info.entryName}" (+${info.qty}) en estado Guardado.`);
    }
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  // Render de barra de Modo de Carga (Automático vs Manual) + Progreso cada 10
  const renderLoadModeAndBatchBar = () => (
    <div className="bg-white rounded-3xl border border-purple-100 shadow-xs p-3.5 sm:p-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-purple-700">
            Carga de datos al Inventario (cada 10 productos)
          </span>
          <p className="text-xs text-slate-500">
            {sweepLoadMode === 'auto'
              ? 'Modo Automático: cada 10 productos guardados se cargan solos al inventario.'
              : 'Modo Manual: al completar 10 productos guardados aparece el botón para cargar al inventario.'}
          </p>
        </div>

        {/* Switch Automático / Manual */}
        <div className="inline-flex bg-purple-50 p-1 rounded-2xl border border-purple-100 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              playWaterDropSound();
              setSweepLoadMode('auto');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              sweepLoadMode === 'auto'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-purple-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Automático
          </button>
          <button
            type="button"
            onClick={() => {
              playWaterDropSound();
              setSweepLoadMode('manual');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              sweepLoadMode === 'manual'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-purple-900'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
            Manual
          </button>
        </div>
      </div>

      {/* Progreso de lote + Botón Cargar al Inventario en modo Manual */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-purple-50">
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700">
              Lote pendiente en estado <strong className="text-amber-700">Guardado</strong>:
            </span>
            <span className="text-purple-900 font-black">
              {pendingCount} / 10 productos
            </span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                pendingCount >= 10
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  : 'bg-gradient-to-r from-fio-pink to-purple-600'
              }`}
              style={{ width: `${Math.min(100, (pendingCount / 10) * 100)}%` }}
            />
          </div>
        </div>

        {sweepLoadMode === 'manual' && pendingCount >= 10 && (
          <button
            type="button"
            disabled={isLoadingBatch}
            onClick={handleManualLoadBatch}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs sm:text-sm font-extrabold shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2 animate-pulse cursor-pointer shrink-0"
          >
            <UploadCloud className="w-4 h-4" />
            Cargar al Inventario ({pendingCount})
          </button>
        )}

        {sweepLoadMode === 'manual' && pendingCount > 0 && pendingCount < 10 && (
          <button
            type="button"
            disabled={isLoadingBatch}
            onClick={handleManualLoadBatch}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Cargar {pendingCount} ahora
          </button>
        )}
      </div>
    </div>
  );

  // Banner permanente con el último producto cargado o guardado
  const renderLastProductBanner = () =>
    lastEntry ? (
      <div className="bg-gradient-to-r from-[#2D1B4E] to-[#3B1F68] text-white rounded-2xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            {lastEntry.status === 'cargado_inv' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            ) : (
              <Clock className="w-4 h-4 text-amber-300" />
            )}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase tracking-wider text-purple-200 font-bold block">
              Último producto registrado en barrido
            </span>
            <p className="text-xs sm:text-sm font-extrabold truncate">
              {lastEntry.productName} <span className="text-purple-200 font-mono">({lastEntry.sku})</span> ·{' '}
              <span className="text-pink-300">+{lastEntry.quantityAdded} u.</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] shrink-0">
          <span className="text-purple-200">
            {lastEntry.shelfLocation} · {formatShortDate(lastEntry.createdAt)}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full font-extrabold ${
              lastEntry.status === 'cargado_inv'
                ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-300/30'
                : 'bg-amber-400/20 text-amber-200 border border-amber-300/30'
            }`}
          >
            {lastEntry.status === 'cargado_inv' ? 'Cargado Inv' : 'Guardado'}
          </span>
        </div>
      </div>
    ) : null;

  return (
    <div className="space-y-4">
      {toast && (
        <div className="px-4 py-3 rounded-2xl bg-emerald-600 text-white text-xs sm:text-sm font-extrabold shadow-lg animate-fade-in">
          {toast}
        </div>
      )}

      {renderLoadModeAndBatchBar()}
      {renderLastProductBanner()}

      {!selectedShelf ? (
        /* Pantalla inicial de selección de estante para empezar el barrido */
        <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bubble font-extrabold text-purple-950 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-fio-pink" />
                Inventario por Barrido — Seleccionar Estante
              </h2>
              <p className="text-xs text-slate-500">
                Elige por cuál estante empezar para escanear o ingresar productos uno por uno.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowNewShelfForm((v) => !v)}
              className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-extrabold flex items-center gap-1.5 self-start cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Nuevo Estante
            </button>
          </div>

          {showNewShelfForm && (
            <form onSubmit={handleAddShelf} className="flex gap-2">
              <input
                type="text"
                value={newShelfInput}
                onChange={(e) => setNewShelfInput(e.target.value)}
                placeholder="Ej. Estante 7 o Exhibidor Principal"
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-purple-200 rounded-xl focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-extrabold cursor-pointer"
              >
                Agregar e Iniciar
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {shelves.map((shelf) => {
              const num = extractShelfNumber(shelf.shelfName);
              const sweepCount = sweepEntries.filter(
                (e) => e.shelfLocation === shelf.shelfName || e.shelfName === shelf.shelfName
              ).length;

              return (
                <button
                  key={shelf.shelfName}
                  type="button"
                  onClick={() => {
                    playWaterDropSound();
                    setSelectedShelf(shelf.shelfName);
                    setTimeout(() => inputRef.current?.focus(), 100);
                  }}
                  className="text-left p-4 rounded-2xl bg-gradient-to-br from-purple-50/70 to-pink-50/50 hover:from-purple-100/80 hover:to-pink-100/70 border border-purple-200/70 transition-all group flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white font-bubble font-black text-base flex items-center justify-center shadow-sm">
                      {num || <Layers className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-purple-950">{shelf.shelfName}</h3>
                      <p className="text-[11px] text-slate-600">
                        {shelf.products.length} productos · {sweepCount} barridos
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-purple-400 group-hover:text-purple-700 group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Sesión activa de barrido en estante */
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-purple-200 shadow-sm p-4 sm:p-5 space-y-4">
            {/* Barra estante activo + cambiar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedShelf(null);
                    setMatchedProduct(null);
                    setUnmatchedCode(null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Estantes
                </button>
                <span className="px-3 py-1.5 rounded-xl bg-purple-100 text-purple-900 text-xs font-extrabold inline-flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-700" />
                  Barriendo: {selectedShelf}
                </span>
              </div>

              <select
                value={selectedShelf}
                onChange={(e) => {
                  setSelectedShelf(e.target.value);
                  setMatchedProduct(null);
                  setUnmatchedCode(null);
                }}
                aria-label="Cambiar estante de barrido"
                className="px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer"
              >
                {availableShelfNames.map((s) => (
                  <option key={s} value={s}>
                    Cambiar a: {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Caja de espera por escaneo o ingreso manual */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                lookupCodeOrManual(codeInput);
              }}
              className="space-y-2 relative"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-purple-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  En espera de producto por escaneo o ingreso manual...
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMatchedProduct(null);
                    setUnmatchedCode(`bf-SWP-${String(Date.now()).slice(-4)}`);
                  }}
                  className="text-[11px] font-extrabold text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Agregar producto nuevo directo
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="Escanea código de barras / QR o escribe SKU o nombre..."
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm font-bold bg-purple-50/50 border-2 border-purple-200 rounded-2xl focus:outline-none focus:border-purple-500 text-purple-950"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white text-xs sm:text-sm font-extrabold cursor-pointer"
                >
                  Buscar / Ingresar
                </button>

                <button
                  type="button"
                  onClick={() => setIsScannerOpen(true)}
                  className="px-4 py-3 rounded-2xl bg-gradient-to-r from-fio-pink to-purple-600 text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 shadow-sm hover:brightness-110 cursor-pointer"
                >
                  <Camera className="w-4 h-4" /> Escanear
                </button>
              </div>

              {/* Sugerencias rápidas al escribir manualmente */}
              {quickSuggestions.length > 0 && (
                <div className="bg-white border border-purple-200 rounded-2xl shadow-lg divide-y divide-slate-100 overflow-hidden">
                  {quickSuggestions.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        playBubblePopSound();
                        setMatchedProduct(p);
                        setUnmatchedCode(null);
                        setCodeInput('');
                      }}
                      className="w-full px-3.5 py-2.5 text-left hover:bg-purple-50 flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-slate-900 truncate">{p.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {p.sku} · {p.shelfLocation || 'Sin ubicación'} · {p.category}
                        </p>
                      </div>
                      <span className="text-[11px] font-black text-purple-700 shrink-0">
                        Stock: {p.stock}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Panel de producto detectado o registro inline de producto nuevo */}
          <InventorySweepProductPanel
            activeShelf={selectedShelf}
            matchedProduct={matchedProduct}
            unmatchedCode={unmatchedCode}
            availableShelves={availableShelfNames}
            onCancel={() => {
              setMatchedProduct(null);
              setUnmatchedCode(null);
              setTimeout(() => inputRef.current?.focus(), 60);
            }}
            onRegistered={handleRegistered}
          />
        </div>
      )}

      {/* Historial detallado de productos registrados por usuario con selector de estado */}
      <InventorySweepHistory />

      {isScannerOpen && (
        <Suspense fallback={null}>
          <CameraBarcodeScannerModal
            isOpen={isScannerOpen}
            onClose={() => setIsScannerOpen(false)}
            onScan={(code) => {
              setIsScannerOpen(false);
              lookupCodeOrManual(code);
            }}
          />
        </Suspense>
      )}
    </div>
  );
};
