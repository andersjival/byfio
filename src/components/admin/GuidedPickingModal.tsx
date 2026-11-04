import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X, CheckCircle, AlertTriangle, MapPin, Heart, Scan, QrCode,
  ClipboardList, CheckSquare, Square, Printer, CheckCheck, RotateCcw,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const GuidedPickingModal: React.FC = () => {
  const {
    activePickingOrder,
    setActivePickingOrder,
    pickingMode,
    setPickingMode,
    markItemPicked,
    unmarkItemPicked,
    markAllItemsPicked,
    markItemMissing,
    setInvoiceOrder,
  } = useApp();

  const [manualInput, setManualInput] = useState('');
  const [scanFeedback, setScanFeedback] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const [showSummaryList, setShowSummaryList] = useState(false);

  if (!activePickingOrder) return null;

  const items = activePickingOrder.items;
  // Buscar el primer producto que aún no ha sido alistado ni marcado como faltante
  const currentItemIndex = items.findIndex((it) => !it.isPicked && !it.isMissing);
  const currentItem = currentItemIndex !== -1 ? items[currentItemIndex] : null;
  const pickedCount = items.filter((it) => it.isPicked).length;
  const missingCount = items.filter((it) => it.isMissing).length;
  const handledCount = pickedCount + missingCount;
  const totalCount = items.length;

  const triggerCompletion = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#A855F7', '#EC4899', '#38BDF8', '#FACC15'],
    });

    const completedOrder = {
      ...activePickingOrder,
      orderStatus: 'packed' as const,
      packedAt: new Date().toISOString(),
    };
    setActivePickingOrder(null);
    setInvoiceOrder(completedOrder);
  };

  const handleProcessScan = (scannedSku: string) => {
    setScanFeedback(null);
    const result = markItemPicked(activePickingOrder.id, scannedSku.trim());

    if (result.error) {
      setScanFeedback({ type: 'error', message: result.error });
      return;
    }

    setScanFeedback({ type: 'success', message: `¡Correcto! ${scannedSku} verificado y guardado.` });
    setManualInput('');

    if (result.isComplete) {
      triggerCompletion();
    }
  };

  const handleMarkItemPickedManual = (itemSku: string) => {
    setScanFeedback(null);
    const result = markItemPicked(activePickingOrder.id, itemSku);

    if (result.error) {
      setScanFeedback({ type: 'error', message: result.error });
      return;
    }

    setScanFeedback({ type: 'success', message: `¡Alistado! Producto verificado con éxito.` });

    if (result.isComplete) {
      triggerCompletion();
    }
  };

  const handleMarkItemMissingManual = (itemSku: string) => {
    setScanFeedback(null);
    const result = markItemMissing(activePickingOrder.id, itemSku);

    if (result.error) {
      setScanFeedback({ type: 'error', message: result.error });
      return;
    }

    setScanFeedback({ type: 'warning', message: `⚠️ Producto reportado como faltante / sin existencias.` });

    if (result.isComplete) {
      triggerCompletion();
    }
  };

  const handleSimulateScanCurrent = () => {
    if (currentItem) handleProcessScan(currentItem.sku);
  };

  const handleSimulateWrongScan = () => {
    handleProcessScan('SKU-ERRONEO-999');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border-4 border-fio-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header de Alisto */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-fio-800 to-fio-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-white/10 rounded-2xl">
              {pickingMode === 'barcode' ? (
                <QrCode className="w-6 h-6 text-fio-yellow animate-pulse" />
              ) : (
                <ClipboardList className="w-6 h-6 text-fio-pink animate-pulse" />
              )}
            </span>
            <div>
              <span className="text-[10px] text-fio-300 uppercase tracking-widest font-bold">
                Módulo de Despacho y Alisto
              </span>
              <h2 className="font-bubble font-bold text-base sm:text-lg">
                Pedido {activePickingOrder.orderNumber} — {activePickingOrder.customerName}
              </h2>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2">
            {/* Selector de Modo en Español: Con Código vs Manual */}
            <div className="flex items-center gap-1 p-1 bg-white/10 rounded-2xl">
              <button
                type="button"
                onClick={() => setPickingMode('barcode')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bubble text-xs font-bold transition-all cursor-pointer ${
                  pickingMode === 'barcode'
                    ? 'bg-fio-yellow text-slate-900 shadow-md'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                title="Alisto guiado paso a paso con lector láser o QR"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Alisto con Código</span>
              </button>
              <button
                type="button"
                onClick={() => setPickingMode('manual')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bubble text-xs font-bold transition-all cursor-pointer ${
                  pickingMode === 'manual'
                    ? 'bg-fio-pink text-white shadow-md'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                title="Alisto manual paso a paso producto por producto con reporte de faltantes"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Alisto Manual</span>
              </button>
            </div>

            <button
              onClick={() => setActivePickingOrder(null)}
              className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 cursor-pointer"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Progreso Superior */}
        <div className="bg-fio-100 px-5 py-2.5 flex items-center justify-between text-xs font-bold text-fio-900 border-b border-fio-200">
          <span>
            {currentItem ? `Producto ${currentItemIndex + 1} de ${totalCount}` : `Total de artículos: ${totalCount}`}
          </span>
          <span className="text-fio-pink font-bubble">
            {pickedCount} Alistados{missingCount > 0 ? ` • ${missingCount} Faltante(s)` : ''} de {totalCount} ({totalCount > 0 ? Math.round((handledCount / totalCount) * 100) : 0}%)
          </span>
        </div>

        {/* CUERPO GUIADO PRODUCTO POR PRODUCTO (Idéntico en Código y Manual) */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {currentItem ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Imagen y Ubicación en Estante */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-full max-h-56 sm:max-h-64 rounded-3xl overflow-hidden bg-fio-50 border-2 border-fio-200 shadow-clay mb-3">
                  <img
                    src={currentItem.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'}
                    alt={currentItem.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 inset-x-2 bg-fio-900/90 backdrop-blur text-white py-1.5 px-3 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-bold shadow-md">
                    <MapPin className="w-4 h-4 text-fio-yellow" />
                    <span>{currentItem.shelfLocation || 'Bodega Central'}</span>
                  </div>
                </div>

                <span className="font-mono font-bold text-sm bg-fio-100 text-fio-800 px-3 py-1 rounded-xl">
                  SKU Requerido: {currentItem.sku}
                </span>
              </div>

              {/* Información y Acciones */}
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-fio-pink uppercase tracking-wider block">
                    Buscar en Estante / Ubicación:
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-100 text-purple-900 font-bold text-xs mt-1 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-700" />
                    <span>{currentItem.shelfLocation || 'Bodega Central'}</span>
                  </div>
                  <h3 className="font-bubble font-bold text-2xl text-fio-900 leading-tight">
                    {currentItem.name}
                  </h3>
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-xs font-bold text-purple-900">
                    <span>Cantidad a Alistar:</span>
                    <span className="text-base text-fio-pink">{currentItem.quantity} unidad(es)</span>
                  </div>
                </div>

                {/* Personalización si aplica */}
                {currentItem.customText && (
                  <div className="p-3 bg-pink-50 rounded-2xl border border-pink-200 text-xs">
                    <p className="font-bold text-pink-900 flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-fio-pink fill-fio-pink" />
                      <span>Detalle Personalizado a Verificar:</span>
                    </p>
                    <p className="text-pink-800 font-semibold mt-1">"{currentItem.customText}"</p>
                  </div>
                )}

                {/* Feedback de Escaneo o Acción */}
                {scanFeedback && (
                  <div
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
                      scanFeedback.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : scanFeedback.type === 'warning'
                        ? 'bg-amber-50 text-amber-900 border-amber-300'
                        : 'bg-red-50 text-red-800 border-red-300 animate-bounce'
                    }`}
                  >
                    {scanFeedback.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : scanFeedback.type === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                    )}
                    <span>{scanFeedback.message}</span>
                  </div>
                )}

                {/* ACCIÓN SEGÚN EL MODO: CÓDIGO vs MANUAL */}
                {pickingMode === 'barcode' ? (
                  /* Modo 1: Alisto con Código (Escáner Láser / QR) */
                  <div className="p-4 bg-fio-50 rounded-2xl border border-fio-200 space-y-3">
                    <p className="text-xs font-bold text-fio-900">Validar Código con Escáner o Teclado:</p>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (manualInput) handleProcessScan(manualInput);
                      }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        placeholder="Escanear con lector láser o escribir SKU..."
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white rounded-xl border border-fio-300 text-xs font-mono focus:ring-2 focus:ring-fio-400 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 bg-fio-800 text-white rounded-xl text-xs font-bold hover:bg-fio-900 cursor-pointer"
                      >
                        Validar
                      </button>
                    </form>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSimulateScanCurrent}
                        className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                      >
                        <Scan className="w-3.5 h-3.5" />
                        <span>Validar ({currentItem.sku})</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSimulateWrongScan}
                        title="Probar alerta de error al escanear QR incorrecto"
                        className="py-2 px-3 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Probar Error
                      </button>
                    </div>

                    <div className="pt-1 flex items-center justify-between border-t border-fio-200/60">
                      <button
                        type="button"
                        onClick={() => handleMarkItemMissingManual(currentItem.sku)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-bold underline cursor-pointer"
                      >
                        Reportar Faltante en Bodega
                      </button>
                      <button
                        type="button"
                        onClick={() => setPickingMode('manual')}
                        className="text-xs text-fio-pink hover:text-purple-700 font-bold underline cursor-pointer"
                      >
                        Cambiar a Alisto Manual
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Modo 2: Alisto Manual (Botón de Listo y Botón de Faltante) */
                  <div className="p-4 bg-purple-50/70 rounded-2xl border-2 border-purple-200 space-y-3">
                    <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <ClipboardList className="w-4 h-4 text-fio-pink" />
                      <span>Acción de Alisto Manual en Estante:</span>
                    </p>

                    {/* Botón Principal: LISTO */}
                    <button
                      type="button"
                      onClick={() => handleMarkItemPickedManual(currentItem.sku)}
                      className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-2xl font-bubble font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-clayBtn transition-all cursor-pointer"
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-200" />
                      <span>Listo (Alistado) — {currentItem.quantity} ud(s)</span>
                    </button>

                    {/* Botón de Faltante / Sin Existencias */}
                    <button
                      type="button"
                      onClick={() => handleMarkItemMissingManual(currentItem.sku)}
                      className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 active:scale-[0.98] border-2 border-amber-300 hover:border-amber-400 text-amber-900 rounded-2xl font-bubble font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                      title="Reportar que este producto no tiene existencias o falta en el estante"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Sin Existencias / Reportar Faltante</span>
                    </button>

                    <div className="pt-2 flex items-center justify-between border-t border-purple-200/80 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setShowSummaryList(!showSummaryList)}
                        className="text-fio-800 hover:text-fio-900 flex items-center gap-1 cursor-pointer underline"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-600" />
                        <span>{showSummaryList ? 'Ocultar Lista Completa' : 'Ver Lista Completa / Imprimir'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPickingMode('barcode')}
                        className="text-fio-pink hover:text-purple-700 cursor-pointer underline"
                      >
                        Cambiar a Alisto con Código
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Alisto Completado */
            <div className="text-center py-12 space-y-4">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="font-bubble font-bold text-2xl text-fio-900">
                {missingCount === 0 ? '¡Alisto Completado al 100%!' : '¡Alisto Finalizado con Reporte!'}
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {missingCount === 0
                  ? 'Todos los artículos fueron verificados y alistados exitosamente. El pedido está listo para empacar y generar la factura.'
                  : `Se alistaron ${pickedCount} artículo(s) y se reportaron ${missingCount} faltante(s) a inventario.`}
              </p>
              <button
                type="button"
                onClick={triggerCompletion}
                className="px-6 py-3 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-bold text-sm shadow-clayBtn transition-all active:scale-95 cursor-pointer"
              >
                Finalizar Alisto y Ver Factura Oficial
              </button>
            </div>
          )}

          {/* Sección Plegable: Resumen de Lista Completa e Impresión */}
          {showSummaryList && (
            <div className="mt-6 pt-5 border-t border-slate-200 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h4 className="font-bubble font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-fio-pink" />
                  <span>Resumen de Todos los Artículos del Pedido</span>
                </h4>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bubble text-xs font-bold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Hoja</span>
                </button>
              </div>

              <div className="space-y-2">
                {items.map((it, idx) => (
                  <div
                    key={`${it.sku}-${idx}`}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                      it.isPicked
                        ? 'bg-emerald-50/60 border-emerald-300'
                        : it.isMissing
                        ? 'bg-amber-50/70 border-amber-300'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={it.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'}
                        alt={it.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                            {it.sku}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-900">
                            {it.shelfLocation || 'Bodega Central'}
                          </span>
                        </div>
                        <p className={`font-bubble text-xs truncate mt-0.5 ${it.isPicked ? 'line-through text-slate-400' : 'font-bold text-slate-800'}`}>
                          {it.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-lg bg-purple-100 text-purple-900 font-bubble font-bold text-xs">
                        x{it.quantity}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-xl text-[11px] font-bold font-bubble ${
                          it.isPicked
                            ? 'bg-emerald-600 text-white'
                            : it.isMissing
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {it.isPicked ? 'Alistado ✓' : it.isMissing ? 'Faltante ⚠️' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
