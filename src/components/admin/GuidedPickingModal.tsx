import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X, CheckCircle, AlertTriangle, MapPin, Heart, Scan, QrCode,
  ClipboardList, Printer, FileCheck, Check, LogOut, FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const GuidedPickingModal: React.FC = () => {
  const {
    orders,
    activePickingOrder,
    setActivePickingOrder,
    pickingMode,
    setPickingMode,
    startPicking,
    markItemPicked,
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

  // Siguiente pedido en cola FIFO (pendiente o en alisto que no sea el actual)
  const nextPendingOrder = orders.find(
    (o) => o.id !== activePickingOrder.id && (o.orderStatus === 'pending' || o.orderStatus === 'picking')
  );

  const triggerCompletion = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#A855F7', '#EC4899', '#38BDF8', '#FACC15'],
    });
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-start sm:items-center justify-center pt-1.5 sm:pt-4 px-2 sm:px-4 pb-2 sm:pb-5">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-2 sm:border-4 border-fio-300 overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[90vh]">
        {/* Header de Alisto Compacto (Sin iconos de selección en la parte superior) */}
        <div className="px-3.5 py-2.5 sm:px-5 sm:py-3.5 bg-gradient-to-r from-fio-800 to-fio-900 text-white flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="p-1.5 sm:p-2 bg-white/10 rounded-xl sm:rounded-2xl shrink-0">
              {pickingMode === 'barcode' ? (
                <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-fio-yellow animate-pulse" />
              ) : (
                <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 text-fio-pink animate-pulse" />
              )}
            </span>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-fio-300 uppercase tracking-widest font-bold block truncate">
                Alisto {pickingMode === 'barcode' ? 'con Código' : 'Manual'}
              </span>
              <h2 className="font-bubble font-bold text-xs sm:text-base truncate">
                Pedido {activePickingOrder.orderNumber} — {activePickingOrder.customerName}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActivePickingOrder(null)}
            className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer shrink-0"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Progreso Superior Compacta */}
        <div className="bg-fio-100 px-3.5 py-1.5 sm:px-5 sm:py-2 flex items-center justify-between text-[11px] sm:text-xs font-bold text-fio-900 border-b border-fio-200 shrink-0">
          <span>
            {currentItem ? `Producto ${currentItemIndex + 1} de ${totalCount}` : `Total de artículos: ${totalCount}`}
          </span>
          <span className="text-fio-pink font-bubble">
            {pickedCount} Alistados{missingCount > 0 ? ` • ${missingCount} Faltante(s)` : ''} de {totalCount} ({totalCount > 0 ? Math.round((handledCount / totalCount) * 100) : 0}%)
          </span>
        </div>

        {/* CUERPO GUIADO PRODUCTO POR PRODUCTO (Optimizado para Celular sin Scroll) */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1">
          {currentItem ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 items-center">
              {/* Imagen y Ubicación en Estante */}
              <div className="flex flex-row md:flex-col items-center gap-3 md:gap-2">
                <div className="relative w-28 h-28 sm:w-full sm:h-52 rounded-2xl sm:rounded-3xl overflow-hidden bg-fio-50 border-2 border-fio-200 shadow-sm shrink-0">
                  <img
                    src={currentItem.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'}
                    alt={currentItem.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="hidden sm:flex absolute bottom-2 inset-x-2 bg-fio-900/90 backdrop-blur text-white py-1.5 px-3 rounded-2xl items-center justify-center gap-1.5 text-xs font-bold shadow-md">
                    <MapPin className="w-4 h-4 text-fio-yellow" />
                    <span className="truncate">{currentItem.shelfLocation || 'Bodega Central'}</span>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-center text-left md:text-center min-w-0 flex-1">
                  {/* Badge de Estante en Celular */}
                  <div className="sm:hidden inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-fio-900 text-white font-bold text-[11px] mb-1 shadow-xs">
                    <MapPin className="w-3 h-3 text-fio-yellow" />
                    <span className="truncate">{currentItem.shelfLocation || 'Bodega Central'}</span>
                  </div>

                  <span className="font-mono font-bold text-[11px] sm:text-xs bg-fio-100 text-fio-800 px-2.5 py-0.5 rounded-lg">
                    SKU: {currentItem.sku}
                  </span>
                </div>
              </div>

              {/* Información y Acciones */}
              <div className="space-y-2 sm:space-y-3.5">
                <div>
                  <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl bg-purple-100 text-purple-900 font-bold text-xs mb-1">
                    <MapPin className="w-3.5 h-3.5 text-purple-700" />
                    <span>Estante: {currentItem.shelfLocation || 'Bodega Central'}</span>
                  </div>
                  <h3 className="font-bubble font-bold text-base sm:text-2xl text-fio-900 leading-tight">
                    {currentItem.name}
                  </h3>
                  <div className="mt-1 sm:mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-xl bg-purple-50 border border-purple-200 text-xs font-bold text-purple-900">
                    <span>Cantidad a Alistar:</span>
                    <span className="text-sm sm:text-base text-fio-pink font-extrabold">{currentItem.quantity} unidad(es)</span>
                  </div>
                </div>

                {/* Personalización si aplica */}
                {currentItem.customText && (
                  <div className="p-2 sm:p-2.5 bg-pink-50 rounded-xl border border-pink-200 text-xs">
                    <p className="font-bold text-pink-900 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-fio-pink fill-fio-pink" />
                      <span>Personalizado:</span>
                    </p>
                    <p className="text-pink-800 font-semibold mt-0.5 truncate">"{currentItem.customText}"</p>
                  </div>
                )}

                {/* Feedback de Escaneo o Acción */}
                {scanFeedback && (
                  <div
                    className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                      scanFeedback.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : scanFeedback.type === 'warning'
                        ? 'bg-amber-50 text-amber-900 border-amber-300'
                        : 'bg-red-50 text-red-800 border-red-300 animate-bounce'
                    }`}
                  >
                    {scanFeedback.type === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <span className="text-xs">{scanFeedback.message}</span>
                  </div>
                )}

                {/* ACCIÓN SEGÚN EL MODO: CÓDIGO vs MANUAL */}
                {pickingMode === 'barcode' ? (
                  /* Modo 1: Alisto con Código (Escáner Láser / QR) */
                  <div className="p-3 sm:p-4 bg-fio-50 rounded-2xl border border-fio-200 space-y-2.5 sm:space-y-3">
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
                        className="flex-1 px-3 py-1.5 sm:py-2 bg-white rounded-xl border border-fio-300 text-xs font-mono focus:ring-2 focus:ring-fio-400 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 sm:py-2 bg-fio-800 text-white rounded-xl text-xs font-bold hover:bg-fio-900 cursor-pointer"
                      >
                        Validar
                      </button>
                    </form>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSimulateScanCurrent}
                        className="flex-1 py-1.5 sm:py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                      >
                        <Scan className="w-3.5 h-3.5" />
                        <span>Validar ({currentItem.sku})</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSimulateWrongScan}
                        title="Probar alerta de error al escanear QR incorrecto"
                        className="py-1.5 sm:py-2 px-3 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Probar Error
                      </button>
                    </div>

                    <div className="pt-1 flex items-center justify-between border-t border-fio-200/60 text-[11px] sm:text-xs">
                      <button
                        type="button"
                        onClick={() => handleMarkItemMissingManual(currentItem.sku)}
                        className="text-rose-600 hover:text-rose-800 font-bold underline cursor-pointer"
                      >
                        Reportar Faltante en Bodega
                      </button>
                      <button
                        type="button"
                        onClick={() => setPickingMode('manual')}
                        className="text-fio-pink hover:text-purple-700 font-bold underline cursor-pointer"
                      >
                        Cambiar a Alisto Manual
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Modo 2: Alisto Manual (Botón de Listo y Botón de Faltante) */
                  <div className="p-2.5 sm:p-3.5 bg-purple-50/70 rounded-2xl border-2 border-purple-200 space-y-2 sm:space-y-2.5">
                    <p className="text-[11px] sm:text-xs font-bold text-slate-800 flex items-center gap-1">
                      <ClipboardList className="w-3.5 h-3.5 text-fio-pink" />
                      <span>Acción de Alisto Manual en Estante:</span>
                    </p>

                    {/* Botón Principal: LISTO */}
                    <button
                      type="button"
                      onClick={() => handleMarkItemPickedManual(currentItem.sku)}
                      className="w-full py-2.5 sm:py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl sm:rounded-2xl font-bubble font-bold text-xs sm:text-base flex items-center justify-center gap-2 shadow-clayBtn transition-all cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-200" />
                      <span>Listo (Alistado) — {currentItem.quantity} ud(s)</span>
                    </button>

                    {/* Botón de Faltante / Sin Existencias */}
                    <button
                      type="button"
                      onClick={() => handleMarkItemMissingManual(currentItem.sku)}
                      className="w-full py-2 sm:py-2.5 px-4 bg-amber-50 hover:bg-amber-100 active:scale-[0.98] border-2 border-amber-300 hover:border-amber-400 text-amber-900 rounded-xl sm:rounded-2xl font-bubble font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      title="Reportar que este producto no tiene existencias o falta en el estante"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Sin Existencias / Reportar Faltante</span>
                    </button>

                    <div className="pt-1.5 flex items-center justify-between border-t border-purple-200/80 text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => setShowSummaryList(!showSummaryList)}
                        className="text-fio-800 hover:text-fio-900 flex items-center gap-1 cursor-pointer underline"
                      >
                        <Printer className="w-3 h-3 text-slate-600" />
                        <span>{showSummaryList ? 'Ocultar Resumen' : 'Ver Resumen / Imprimir'}</span>
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
            /* Flujo Post-Finalización: Continuar con el siguiente pedido */
            <div className="py-4 sm:py-6 px-2 sm:px-6 text-center space-y-4">
              <div className="inline-flex p-3 sm:p-4 rounded-full bg-emerald-100 text-emerald-600 shadow-sm animate-bounce">
                <CheckCircle className="w-10 h-10 sm:w-14 sm:h-14" />
              </div>

              <div>
                <h3 className="font-bubble font-bold text-lg sm:text-2xl text-fio-900 leading-snug">
                  ¡Alisto del Pedido {activePickingOrder.orderNumber} Finalizado!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
                  {missingCount === 0
                    ? `Se alistaron exitosamente los ${pickedCount} producto(s).`
                    : `Se alistaron ${pickedCount} producto(s) y se reportaron ${missingCount} con faltante.`}
                </p>
              </div>

              {/* Pregunta: Continuar con el siguiente pedido */}
              {nextPendingOrder ? (
                <div className="bg-purple-50/80 border-2 border-purple-200 rounded-2xl p-3.5 sm:p-5 max-w-md mx-auto text-left shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping" />
                    <h4 className="font-bubble font-bold text-sm sm:text-base text-purple-950">
                      ¿Continuar con el siguiente pedido?
                    </h4>
                  </div>

                  {/* Previsualización del Siguiente Pedido */}
                  <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-purple-200 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[10px] text-purple-700 font-bold uppercase tracking-wider">Siguiente en Cola FIFO</p>
                      <p className="font-bubble font-bold text-xs sm:text-sm text-slate-900 truncate">
                        Pedido {nextPendingOrder.orderNumber} — {nextPendingOrder.customerName}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {nextPendingOrder.items.length} artículo(s) para alistar
                      </p>
                    </div>
                    <span className="shrink-0 px-2 py-1 rounded-lg bg-purple-100 text-purple-800 font-bold text-[10px]">
                      En Espera
                    </span>
                  </div>

                  {/* Botones de Acción: Aceptar / Continuar o Salir */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => startPicking(nextPendingOrder.id, pickingMode)}
                      className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white rounded-xl font-bubble font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-clayBtn transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Aceptar / Continuar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivePickingOrder(null)}
                      className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 border border-slate-300 rounded-xl font-bubble font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-slate-500" />
                      <span>Salir a Pedidos</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 max-w-md mx-auto text-center shadow-sm space-y-2">
                  <p className="font-bubble font-bold text-sm text-emerald-950">
                    🎉 ¡Excelente trabajo!
                  </p>
                  <p className="text-xs text-emerald-800">
                    No hay más pedidos pendientes en la cola por el momento.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActivePickingOrder(null)}
                    className="mt-2 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl font-bubble font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-clayBtn transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Salir a la Cola de Pedidos</span>
                  </button>
                </div>
              )}

              {/* Opción Secundaria: Ver Factura del Pedido Finalizado */}
              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setInvoiceOrder(activePickingOrder);
                    setActivePickingOrder(null);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-purple-700 hover:text-purple-900 font-bold underline cursor-pointer py-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ver / Imprimir Factura de este Pedido ({activePickingOrder.orderNumber})</span>
                </button>
              </div>
            </div>
          )}

          {/* Sección Plegable: Resumen de Lista Completa e Impresión */}
          {showSummaryList && (
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h4 className="font-bubble font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5">
                  <ClipboardList className="w-3.5 h-3.5 text-fio-pink" />
                  <span>Resumen de Todos los Artículos del Pedido</span>
                </h4>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bubble text-[11px] font-bold cursor-pointer"
                >
                  <Printer className="w-3 h-3" />
                  <span>Imprimir</span>
                </button>
              </div>

              <div className="space-y-1.5">
                {items.map((it, idx) => (
                  <div
                    key={`${it.sku}-${idx}`}
                    className={`p-2 sm:p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                      it.isPicked
                        ? 'bg-emerald-50/60 border-emerald-300'
                        : it.isMissing
                        ? 'bg-amber-50/70 border-amber-300'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={it.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'}
                        alt={it.name}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-[9px] font-bold px-1 rounded bg-slate-100 text-slate-700">
                            {it.sku}
                          </span>
                          <span className="text-[9px] font-bold px-1 rounded bg-purple-100 text-purple-900">
                            {it.shelfLocation || 'Bodega'}
                          </span>
                        </div>
                        <p className={`font-bubble text-xs truncate ${it.isPicked ? 'line-through text-slate-400' : 'font-bold text-slate-800'}`}>
                          {it.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-900 font-bubble font-bold text-[10px]">
                        x{it.quantity}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-bubble ${
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
