import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, InventoryAdjustmentItem } from '../../types';
import { getOrganizedShelves, getExtraShelves } from '../../utils/inventoryShelves';
import {
  ArrowLeft, CheckCircle2, Camera, Search, Plus, Minus,
  Save, AlertTriangle, Check, Package, Sparkles, UploadCloud
} from 'lucide-react';
import { playWaterDropSound, playBubblePopSound } from '../../utils/soundEffects';

const CameraBarcodeScannerModal = React.lazy(() =>
  import('../mobile/CameraBarcodeScannerModal').then((m) => ({ default: m.CameraBarcodeScannerModal }))
);

interface InventoryCountSessionProps {
  shelfName: string;
  onBack: () => void;
  onCompleted: () => void;
}

export const InventoryCountSession: React.FC<InventoryCountSessionProps> = ({
  shelfName,
  onBack,
  onCompleted,
}) => {
  const {
    products,
    currentUser,
    addInventoryAdjustment,
    updateShelfInventoryStatus,
    updateProduct,
  } = useApp();

  const shelfProducts = useMemo(() => {
    const organized = getOrganizedShelves(products, getExtraShelves());
    const found = organized.find((s) => s.shelfName === shelfName);
    return found ? found.products : [];
  }, [products, shelfName]);

  // Estado local del conteo por ID de producto
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [verifiedMap, setVerifiedMap] = useState<Record<string, boolean>>({});
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanToast, setScanToast] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [globalNotes, setGlobalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializar conteo con el stock actual si aún no ha sido tocado
  useEffect(() => {
    setCounts((prev) => {
      const next = { ...prev };
      shelfProducts.forEach((p) => {
        if (next[p.id] === undefined) {
          next[p.id] = p.stock;
        }
      });
      return next;
    });
  }, [shelfProducts]);

  // Marcar estante como "En Proceso" al comenzar si tenía productos
  useEffect(() => {
    if (shelfProducts.length > 0) {
      updateShelfInventoryStatus(shelfName, 'in_progress', Object.values(verifiedMap).filter(Boolean).length);
    }
  }, [shelfName]);

  const handleSetCount = (productId: string, newVal: number) => {
    const safeVal = Math.max(0, Math.floor(newVal));
    setCounts((prev) => ({ ...prev, [productId]: safeVal }));
    setVerifiedMap((prev) => ({ ...prev, [productId]: true }));
  };

  const handleToggleVerify = (product: Product) => {
    playWaterDropSound();
    setVerifiedMap((prev) => {
      const nextVal = !prev[product.id];
      return { ...prev, [product.id]: nextVal };
    });
    if (counts[product.id] === undefined) {
      setCounts((prev) => ({ ...prev, [product.id]: product.stock }));
    }
  };

  const handleBarcodeScanned = (code: string) => {
    const clean = code.trim().toLowerCase();
    const match = shelfProducts.find(
      (p) => p.sku.toLowerCase() === clean || (p.qrCode && p.qrCode.toLowerCase() === clean)
    );
    if (match) {
      playBubblePopSound();
      const currentCount = verifiedMap[match.id] ? (counts[match.id] ?? 0) : 0;
      handleSetCount(match.id, currentCount + 1);
      setScanToast(`✓ +1 unidad a ${match.name} (Total contado: ${currentCount + 1})`);
    } else {
      setScanToast(`⚠ Código "${code}" no pertenece a ${shelfName}`);
    }
    setTimeout(() => setScanToast(null), 3500);
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return shelfProducts;
    const q = searchQuery.toLowerCase().trim();
    return shelfProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [shelfProducts, searchQuery]);

  const verifiedCount = shelfProducts.filter((p) => verifiedMap[p.id]).length;
  const progressPercent = shelfProducts.length > 0 ? Math.round((verifiedCount / shelfProducts.length) * 100) : 100;

  // Productos con diferencias encontradas
  const differencesList = useMemo(() => {
    return shelfProducts
      .map((p) => {
        const counted = counts[p.id] ?? p.stock;
        const diff = counted - p.stock;
        return {
          product: p,
          counted,
          diff,
        };
      })
      .filter((entry) => entry.diff !== 0);
  }, [shelfProducts, counts]);

  const handleConfirmUploadToSystem = async () => {
    setIsSubmitting(true);
    try {
      const itemsForRecord: InventoryAdjustmentItem[] = shelfProducts.map((p) => {
        const counted = counts[p.id] ?? p.stock;
        return {
          productId: p.id,
          sku: p.sku,
          name: p.name,
          category: p.category,
          shelfLocation: shelfName,
          image: p.image,
          previousStock: p.stock,
          countedStock: counted,
          difference: counted - p.stock,
          reason: notesMap[p.id] || (counted !== p.stock ? 'Diferencia en conteo físico' : 'Verificado conforme'),
        };
      });

      const netDifferenceUnits = itemsForRecord.reduce((acc, it) => acc + it.difference, 0);

      await addInventoryAdjustment({
        shelfName,
        performedBy: currentUser?.name || 'ADMINISTRACIÓN (FIO)',
        userRole: currentUser?.role || 'admin',
        totalItemsCounted: shelfProducts.length,
        totalDifferences: differencesList.length,
        netDifferenceUnits,
        items: itemsForRecord,
        notes: globalNotes.trim() || `Toma física de inventario en ${shelfName}`,
      });

      updateShelfInventoryStatus(shelfName, 'completed', shelfProducts.length);
      playBubblePopSound();
      setShowConfirmModal(false);
      onCompleted();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Opción rápida para asignar productos existentes si el estante está vacío
  const [showAssignQuick, setShowAssignQuick] = useState(false);
  const [assignSearch, setAssignSearch] = useState('');
  const unassignedOrOtherProducts = useMemo(() => {
    if (!showAssignQuick) return [];
    const q = assignSearch.toLowerCase().trim();
    return products
      .filter((p) => p.shelfLocation !== shelfName)
      .filter((p) => !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
      .slice(0, 15);
  }, [products, shelfName, showAssignQuick, assignSearch]);

  return (
    <div className="space-y-4 pb-20">
      {/* Cabecera de la Sesión de Conteo */}
      <div className="bg-white rounded-3xl border border-purple-200/90 shadow-xs p-4 space-y-3 sticky top-2 z-20">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              playWaterDropSound();
              onBack();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bubble font-bold text-xs transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Estanterías</span>
          </button>

          <div className="text-center">
            <h2 className="font-bubble font-bold text-base sm:text-lg text-fio-900">
              {shelfName}
            </h2>
            <p className="text-[11px] text-slate-500 font-sans">
              {verifiedCount} de {shelfProducts.length} verificados ({progressPercent}%)
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              playWaterDropSound();
              setIsScannerOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-fio-pink text-white font-bubble font-bold text-xs shadow-sm active:scale-95 cursor-pointer"
          >
            <Camera className="w-4 h-4 text-fio-yellow" />
            <span>Escanear</span>
          </button>
        </div>

        {/* Barra de progreso del estante */}
        <div className="w-full h-2 bg-purple-50 rounded-full overflow-hidden border border-purple-100">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Buscador rápido en estante */}
        {shelfProducts.length > 0 && (
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Filtrar productos dentro de ${shelfName}...`}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-purple-400 focus:outline-none text-xs"
            />
          </div>
        )}

        {scanToast && (
          <div className="px-3 py-2 rounded-xl bg-purple-900 text-white text-xs font-bubble font-bold text-center animate-fadeIn">
            {scanToast}
          </div>
        )}
      </div>

      {/* Lista de Productos del Estante */}
      {shelfProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-purple-100 p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center">
            <Package className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bubble font-bold text-base text-slate-800">
              {shelfName} no tiene productos asignados
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Puedes asignar productos existentes a este estante ahora mismo o marcar este estante como revisado.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowAssignQuick((v) => !v)}
              className="px-4 py-2.5 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bubble font-bold text-xs cursor-pointer"
            >
              + Asignar Productos a {shelfName}
            </button>
            <button
              type="button"
              onClick={() => {
                updateShelfInventoryStatus(shelfName, 'completed', 0);
                playBubblePopSound();
                onCompleted();
              }}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bubble font-bold text-xs cursor-pointer"
            >
              Marcar Estante Vacío como Inventariado ✓
            </button>
          </div>

          {showAssignQuick && (
            <div className="mt-4 pt-4 border-t border-slate-100 text-left space-y-2 max-w-lg mx-auto">
              <input
                type="text"
                value={assignSearch}
                onChange={(e) => setAssignSearch(e.target.value)}
                placeholder="Buscar producto para moverlo a este estante..."
                className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs"
              />
              <div className="max-h-60 overflow-y-auto space-y-1.5">
                {unassignedOrOtherProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{p.name}</p>
                      <p className="text-[10px] text-slate-500">
                        Actual: {p.shelfLocation} • SKU: {p.sku}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        updateProduct(p.id, { shelfLocation: shelfName });
                        playBubblePopSound();
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-purple-600 text-white text-[11px] font-bubble font-bold shrink-0 cursor-pointer"
                    >
                      Mover aquí
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProducts.map((prod) => {
            const counted = counts[prod.id] ?? prod.stock;
            const diff = counted - prod.stock;
            const isVerified = !!verifiedMap[prod.id];

            return (
              <div
                key={prod.id}
                className={`rounded-3xl border-2 p-3.5 sm:p-4 bg-white transition-all shadow-2xs ${
                  diff !== 0
                    ? 'border-amber-300 bg-amber-50/15'
                    : isVerified
                    ? 'border-emerald-300 bg-emerald-50/15'
                    : 'border-purple-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Info Producto */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={prod.image || '/images/placeholder-new-product.jpg'}
                      alt={prod.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-purple-100 shrink-0 bg-slate-50"
                    />
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-900">
                          {prod.sku}
                        </span>
                        <span className="text-[10px] font-sans text-slate-400">
                          {prod.category}
                        </span>
                      </div>
                      <h4 className="font-bubble font-bold text-sm text-slate-900 leading-snug">
                        {prod.name}
                      </h4>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-slate-500">
                          Stock Sistema: <strong className="text-slate-900 font-mono">{prod.stock}</strong>
                        </span>
                        {diff !== 0 && (
                          <span
                            className={`font-mono font-bold px-2 py-0.5 rounded-full text-[11px] ${
                              diff > 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            Diferencia: {diff > 0 ? `+${diff}` : diff}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Controles Táctiles de Conteo Físico */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          playWaterDropSound();
                          handleSetCount(prod.id, counted - 1);
                        }}
                        className="w-10 h-10 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <div className="flex flex-col items-center">
                        <span className="text-[9px] uppercase font-bold text-slate-400">Físico</span>
                        <input
                          type="number"
                          min="0"
                          value={counted}
                          onChange={(e) => handleSetCount(prod.id, parseInt(e.target.value, 10) || 0)}
                          className="w-16 text-center py-1.5 rounded-xl border border-purple-300 bg-white font-mono font-bold text-base text-fio-900 focus:outline-none focus:ring-2 focus:ring-fio-pink"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          playWaterDropSound();
                          handleSetCount(prod.id, counted + 1);
                        }}
                        className="w-10 h-10 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleVerify(prod)}
                      className={`px-3 py-2.5 rounded-xl font-bubble font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                        isVerified
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{isVerified ? 'Contado' : 'Confirmar'}</span>
                    </button>
                  </div>
                </div>

                {/* Campo opcional de nota si hay diferencia */}
                {diff !== 0 && (
                  <div className="mt-2.5 pt-2.5 border-t border-amber-100">
                    <input
                      type="text"
                      value={notesMap[prod.id] || ''}
                      onChange={(e) => setNotesMap((prev) => ({ ...prev, [prod.id]: e.target.value }))}
                      placeholder="Motivo de diferencia (ej: producto dañado, ingreso sin registrar, merma)..."
                      className="w-full px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50/50 text-xs text-amber-900 placeholder:text-amber-600/60 focus:outline-none focus:bg-white"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Botón Fijo Inferior: Cargar Información al Sistema */}
      {shelfProducts.length > 0 && (
        <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-30">
          <button
            type="button"
            onClick={() => {
              playWaterDropSound();
              setShowConfirmModal(true);
            }}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:opacity-95 text-white font-bubble font-bold text-sm shadow-xl border-2 border-white flex items-center justify-center gap-2.5 active:scale-95 transition-all cursor-pointer"
          >
            <UploadCloud className="w-5 h-5" />
            <span>
              Cargar Inventario al Sistema
              {differencesList.length > 0 ? ` (${differencesList.length} dif.)` : ' ✓'}
            </span>
          </button>
        </div>
      )}

      {/* Modal de Confirmación y Resumen antes de Guardar */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl border border-purple-200 p-5 shadow-2xl space-y-4 max-h-[88vh] overflow-y-auto animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                {differencesList.length > 0 ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              <div>
                <h3 className="font-bubble font-bold text-base text-slate-900">
                  Finalizar Inventario: {shelfName}
                </h3>
                <p className="text-xs text-slate-500">
                  Usuario: <strong>{currentUser?.name || 'Administración'}</strong>
                </p>
              </div>
            </div>

            {differencesList.length === 0 ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
                <p className="font-bubble font-bold flex items-center gap-1.5 text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  ¡Inventario Cuadrado al 100%!
                </p>
                <p>
                  Todos los {shelfProducts.length} productos en <strong>{shelfName}</strong> coinciden exactamente con el stock del sistema.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  Se detectaron <strong>{differencesList.length} diferencias</strong> de existencias. Al confirmar se actualizará el stock real en el sistema y se guardará el reporte de ajuste.
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {differencesList.map(({ product, counted, diff }) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate">{product.name}</p>
                        <p className="text-[11px] text-slate-500">
                          Sistema: {product.stock} → Conteo Físico: <strong>{counted}</strong>
                        </p>
                      </div>
                      <span
                        className={`font-mono font-bold px-2 py-1 rounded-lg shrink-0 ${
                          diff > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {diff > 0 ? `+${diff}` : diff}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">
                Observaciones generales (opcional)
              </label>
              <textarea
                rows={2}
                value={globalNotes}
                onChange={(e) => setGlobalNotes(e.target.value)}
                placeholder="Notas sobre la revisión de este estante..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bubble font-bold text-xs cursor-pointer"
              >
                Seguir Revisando
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmUploadToSystem}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bubble font-bold text-xs shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Guardando...' : 'Confirmar y Cargar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Escáner de Cámara */}
      <React.Suspense fallback={null}>
        {isScannerOpen && (
          <CameraBarcodeScannerModal
            isOpen={isScannerOpen}
            onClose={() => setIsScannerOpen(false)}
            onScan={handleBarcodeScanned}
          />
        )}
      </React.Suspense>
    </div>
  );
};
