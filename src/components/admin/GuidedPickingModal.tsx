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
  const [scanFeedback, setScanFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!activePickingOrder) return null;

  const items = activePickingOrder.items;
  const currentItemIndex = items.findIndex((it) => !it.isPicked);
  const currentItem = currentItemIndex !== -1 ? items[currentItemIndex] : null;
  const pickedCount = items.filter((it) => it.isPicked).length;
  const totalCount = items.length;
  const isAllPicked = pickedCount === totalCount && totalCount > 0;

  const triggerCompletion = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#A855F7', '#EC4899', '#38BDF8', '#FACC15'],
    });

    const completedOrder = {
      ...activePickingOrder,
      items: activePickingOrder.items.map((i) => ({ ...i, isPicked: true })),
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

  const handleToggleItemManual = (itemSku: string, currentPicked: boolean) => {
    if (currentPicked) {
      unmarkItemPicked(activePickingOrder.id, itemSku);
    } else {
      handleProcessScan(itemSku);
    }
  };

  const handleMarkAll = () => {
    markAllItemsPicked(activePickingOrder.id);
    triggerCompletion();
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
                <ClipboardList className="w-6 h-6 text-fio-pink" />
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
            {/* Selector de Modo: Código vs Manual */}
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
                <span className="hidden xs:inline">Con Código</span>
              </button>
              <button
                type="button"
                onClick={() => setPickingMode('manual')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bubble text-xs font-bold transition-all cursor-pointer ${
                  pickingMode === 'manual'
                    ? 'bg-fio-pink text-white shadow-md'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                title="Lista de despacho manual con checklist"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Manual</span>
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
            {pickingMode === 'barcode'
              ? `Producto ${currentItemIndex !== -1 ? currentItemIndex + 1 : totalCount} de ${totalCount}`
              : `Total de artículos: ${totalCount}`}
          </span>
          <span className="text-fio-pink font-bubble">
            {pickedCount} de {totalCount} Alistados ({totalCount > 0 ? Math.round((pickedCount / totalCount) * 100) : 0}%)
          </span>
        </div>

        {/* VISTA 1: RELEASE LIST CON CÓDIGO (Lector Láser / Escáner QR) */}
        {pickingMode === 'barcode' ? (
          <div className="p-5 sm:p-6 overflow-y-auto flex-1">
            {currentItem ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Imagen y Ubicación */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-full max-h-56 sm:max-h-64 rounded-3xl overflow-hidden bg-fio-50 border-2 border-fio-200 shadow-clay mb-3">
                    <img
                      src={currentItem.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'}
                      alt={currentItem.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 inset-x-2 bg-fio-900/90 backdrop-blur text-white py-1.5 px-3 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-bold">
                      <MapPin className="w-4 h-4 text-fio-yellow" />
                      <span>{currentItem.shelfLocation || 'Bodega Central'}</span>
                    </div>
                  </div>

                  <span className="font-mono font-bold text-sm bg-fio-100 text-fio-800 px-3 py-1 rounded-xl">
                    SKU Requerido: {currentItem.sku}
                  </span>
                </div>

                {/* Información y Validación */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-fio-pink uppercase tracking-wider">
                      Buscar en Estante:
                    </span>
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

                  {/* Feedback de Escaneo */}
                  {scanFeedback && (
                    <div
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
                        scanFeedback.type === 'success'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-red-50 text-red-800 border-red-300 animate-bounce'
                      }`}
                    >
                      {scanFeedback.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                      )}
                      <span>{scanFeedback.message}</span>
                    </div>
                  )}

                  {/* Acciones de Escaneo Láser / Simulación */}
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
                        onClick={() => markItemMissing(activePickingOrder.id, currentItem.sku)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-bold underline cursor-pointer"
                      >
                        Reportar Faltante en Bodega
                      </button>
                      <button
                        type="button"
                        onClick={() => setPickingMode('manual')}
                        className="text-xs text-fio-pink hover:text-purple-700 font-bold underline cursor-pointer"
                      >
                        Cambiar a Release List Manual
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="font-bubble font-bold text-2xl text-fio-900">¡Alisto Completado al 100%!</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Todos los artículos fueron verificados con código. El pedido está listo para empacar y generar la factura.
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
          </div>
        ) : (
          /* VISTA 2: RELEASE LIST MANUAL (Checklist Interactivo + Imprimir) */
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
            {/* Barra de Acciones de Lista Manual */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-purple-50/70 rounded-2xl border border-purple-200/80">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-fio-pink" />
                <div>
                  <h4 className="font-bubble font-bold text-sm text-slate-800">
                    Hoja de Despacho (Release List Manual)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Marca cada producto con un clic al sacarlo de su estantería.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleMarkAll}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bubble text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                  title="Marcar todos los artículos como alistados"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Marcar Todos</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bubble text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                  title="Imprimir hoja de alisto para bodega"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>Imprimir</span>
                </button>
              </div>
            </div>

            {/* Checklist de Productos */}
            <div className="space-y-2.5">
              {items.map((item, idx) => (
                <div
                  key={`${item.sku}-${idx}`}
                  onClick={() => handleToggleItemManual(item.sku, !!item.isPicked)}
                  className={`p-3 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    item.isPicked
                      ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                      : 'bg-white hover:bg-purple-50/40 border-slate-200 shadow-neuBtn'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Checkbox visual */}
                    <button
                      type="button"
                      aria-label={item.isPicked ? 'Desmarcar' : 'Alistar'}
                      className="p-1 rounded-lg text-emerald-600 hover:text-emerald-700 shrink-0"
                    >
                      {item.isPicked ? (
                        <CheckSquare className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <Square className="w-6 h-6 text-slate-300 hover:text-purple-400" />
                      )}
                    </button>

                    {/* Miniatura */}
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />

                    {/* Datos del Producto */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700">
                          {item.sku}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg bg-purple-100 text-purple-900">
                          <MapPin className="w-3 h-3 text-purple-600" />
                          {item.shelfLocation || 'Bodega Central'}
                        </span>
                      </div>
                      <h5 className={`font-bubble text-sm mt-0.5 truncate ${item.isPicked ? 'text-slate-500 line-through' : 'font-bold text-slate-800'}`}>
                        {item.name}
                      </h5>
                      {item.customText && (
                        <span className="text-[11px] text-fio-pink font-semibold">
                          Personalizado: "{item.customText}"
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Cantidad y Estado */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-3 py-1 rounded-xl bg-purple-100 text-purple-900 font-bubble font-bold text-xs">
                      x{item.quantity}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-bold font-bubble ${
                        item.isPicked
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.isPicked ? 'Alistado ✓' : 'Pendiente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Banner inferior cuando todo está listo */}
            {isAllPicked && (
              <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left animate-fadeIn">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h5 className="font-bubble font-bold text-sm text-emerald-950">
                      ¡Todos los artículos de la lista están alistados!
                    </h5>
                    <p className="text-xs text-emerald-800">
                      Puedes finalizar el despacho para generar la factura electrónica oficial.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={triggerCompletion}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble text-xs font-bold shadow-clayBtn transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  <FileCheck className="w-4 h-4 text-fio-yellow" />
                  <span>Finalizar y Ver Factura</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
