import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X, CheckCircle, AlertTriangle, MapPin, Heart, Scan, QrCode,
  ClipboardList, Printer, FileCheck, Check, LogOut, FileText, Package,
  Edit3, UserCheck, Camera, Sparkles
} from 'lucide-react';
import { PickingLiveBarcodeScanner, checkBarcodeMatch } from './PickingLiveBarcodeScanner';
import { playBarcodeSuccessSound, playBarcodeErrorSound } from '../../utils/soundEffects';
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
    updateOrderItemQuantity,
    setInvoiceOrder,
    isFeatureEnabled,
    currentUser,
  } = useApp();

  const [manualInput, setManualInput] = useState('');
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState(true);
  const [scanFeedback, setScanFeedback] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const [showSummaryList, setShowSummaryList] = useState(false);
  const [isEditingQty, setIsEditingQty] = useState(false);
  const [tempQty, setTempQty] = useState<number>(1);
  const [editingItemSku, setEditingItemSku] = useState<string | null>(null);

  const activeOrderId = activePickingOrder?.id;
  const activeOrderObj = activePickingOrder ? (orders.find((o) => o.id === activeOrderId) || activePickingOrder) : null;
  const currentItemSku = activeOrderObj?.items.find((it) => !it.isPicked && !it.isMissing)?.sku;

  // Limpiar cualquier feedback residual al cambiar de producto, orden o modo
  React.useEffect(() => {
    setScanFeedback(null);
  }, [activeOrderId, currentItemSku, pickingMode]);

  if (!activePickingOrder) return null;

  // Sincronización reactiva directa con el estado general de orders
  const currentOrder = orders.find((o) => o.id === activePickingOrder.id) || activePickingOrder;
  const items = currentOrder.items;
  // Buscar el primer producto que aún no ha sido alistado ni marcado como faltante
  const currentItemIndex = items.findIndex((it) => !it.isPicked && !it.isMissing);
  const currentItem = currentItemIndex !== -1 ? items[currentItemIndex] : null;
  const pickedCount = items.filter((it) => it.isPicked).length;
  const missingCount = items.filter((it) => it.isMissing).length;
  const handledCount = pickedCount + missingCount;
  const totalCount = items.length;

  // El pedido está completado si todos los artículos fueron procesados o si su estado ya es empaque/empacado/entregado
  const isCompleted = !currentItem || (totalCount > 0 && handledCount === totalCount) || currentOrder.orderStatus === 'packing' || currentOrder.orderStatus === 'packed' || currentOrder.orderStatus === 'delivered';

  // Siguiente pedido en cola FIFO (pendiente o en alisto con productos pendientes de alistar)
  const nextPendingOrder = orders.find(
    (o) =>
      o.id !== currentOrder.id &&
      !(Array.isArray(o.items) && o.items.length > 0 && o.items.every((it) => it.isPicked || it.isMissing))
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
    const raw = (scannedSku || '').trim();
    if (!raw) return;

    // 1. Coincidencia directa o parcial con el producto actual esperado
    if (currentItem && checkBarcodeMatch(raw, currentItem.sku)) {
      const result = markItemPicked(currentOrder.id, currentItem.sku, currentUser?.name);
      if (result.error) {
        setScanFeedback({ type: 'error', message: result.error });
        playBarcodeErrorSound();
        return;
      }
      playBarcodeSuccessSound();
      setScanFeedback({ type: 'success', message: `¡Correcto! ${currentItem.sku} verificado y alistado.` });
      setManualInput('');
      if (result.isComplete) {
        triggerCompletion();
      }
      return;
    }

    // 2. Coincidencia con algún otro producto pendiente en el pedido
    const matchedPending = items.find(
      (it) => !it.isPicked && !it.isMissing && checkBarcodeMatch(raw, it.sku)
    );
    if (matchedPending) {
      const result = markItemPicked(currentOrder.id, matchedPending.sku, currentUser?.name);
      if (result.error) {
        setScanFeedback({ type: 'error', message: result.error });
        playBarcodeErrorSound();
        return;
      }
      playBarcodeSuccessSound();
      setScanFeedback({ type: 'success', message: `¡Alistado! ${matchedPending.name} (${matchedPending.sku}) verificado.` });
      setManualInput('');
      if (result.isComplete) {
        triggerCompletion();
      }
      return;
    }

    // 3. No coincide con ningún producto pendiente del pedido
    playBarcodeErrorSound();
    setScanFeedback({
      type: 'error',
      message: `Código "${raw}" no coincide. Se requiere ${currentItem?.sku || 'el producto'} en estante ${currentItem?.shelfLocation || 'Bodega'}.`,
    });
  };

  const handleMarkItemPickedManual = (itemSku: string) => {
    setScanFeedback(null);
    const result = markItemPicked(currentOrder.id, itemSku, currentUser?.name);

    if (result.error && pickingMode === 'barcode') {
      setScanFeedback({ type: 'error', message: result.error });
      return;
    }

    if (result.isComplete) {
      triggerCompletion();
    }
  };

  const handleMarkItemMissingManual = (itemSku: string) => {
    setScanFeedback(null);
    const result = markItemMissing(currentOrder.id, itemSku);

    if (result.error) {
      setScanFeedback({ type: 'error', message: result.error });
      return;
    }

    setScanFeedback({ type: 'warning', message: `⚠️ Producto reportado como faltante / sin existencias.` });

    if (result.isComplete) {
      triggerCompletion();
    }
  };

  const handleStartEditQuantity = (sku: string, currentQty: number) => {
    setEditingItemSku(sku);
    setTempQty(currentQty);
    setIsEditingQty(true);
  };

  const handleConfirmEditQuantity = () => {
    if (!editingItemSku) return;
    const res = updateOrderItemQuantity(currentOrder.id, editingItemSku, tempQty);
    if (res.error) {
      setScanFeedback({ type: 'error', message: res.error });
    } else {
      setScanFeedback({
        type: 'success',
        message: `Cantidad modificada a ${tempQty} unidad(es) correctamente.`,
      });
    }
    setIsEditingQty(false);
    setEditingItemSku(null);
  };

  const handleSimulateScanCurrent = () => {
    if (currentItem) handleProcessScan(currentItem.sku);
  };

  const handleSimulateWrongScan = () => {
    handleProcessScan('SKU-ERRONEO-999');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4">
      <div className="relative w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] max-w-3xl bg-white rounded-none sm:rounded-3xl shadow-2xl border-0 sm:border-4 border-fio-300 overflow-hidden flex flex-col">
        {/* Header de Alisto Compacto con soporte para Notch / Dynamic Island */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-gradient-to-r from-fio-800 to-fio-900 text-white flex items-center justify-between gap-2 shrink-0 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span className="p-2 sm:p-2 bg-white/10 rounded-xl sm:rounded-2xl shrink-0">
              {pickingMode === 'barcode' ? (
                <QrCode className="w-5 h-5 sm:w-5 sm:h-5 text-fio-yellow animate-pulse" />
              ) : (
                <ClipboardList className="w-5 h-5 sm:w-5 sm:h-5 text-fio-pink animate-pulse" />
              )}
            </span>
            <div className="min-w-0">
              <span className="text-xs sm:text-[10px] text-fio-300 uppercase tracking-widest font-bold block truncate">
                {pickingMode === 'barcode' ? 'Alisto con Código' : 'Alistar Pedido'}
              </span>
              <h2 className="font-bubble font-bold text-base sm:text-base truncate">
                Pedido {currentOrder.orderNumber} — {currentOrder.customerName}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActivePickingOrder(null)}
            className="text-white/80 hover:text-white p-2 sm:p-1 rounded-full hover:bg-white/10 cursor-pointer shrink-0"
            title="Cerrar ventana"
          >
            <X className="w-6 h-6 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Barra de Progreso Superior */}
        <div className="bg-fio-100 px-4 py-2.5 sm:px-5 sm:py-2 flex items-center justify-between text-xs sm:text-xs font-bold text-fio-900 border-b border-fio-200 shrink-0">
          <span>
            {!isCompleted && currentItem ? `Producto ${currentItemIndex + 1} de ${totalCount}` : `Total de artículos: ${totalCount}`}
          </span>
          <span className="text-fio-pink font-bubble text-sm sm:text-xs font-bold">
            {pickedCount} Alistados{missingCount > 0 ? ` • ${missingCount} Faltante(s)` : ''} de {totalCount} ({totalCount > 0 ? Math.round((handledCount / totalCount) * 100) : 0}%)
          </span>
        </div>

        {/* CUERPO GUIADO PRODUCTO POR PRODUCTO (Adaptado 100% a Pantallas Android e iPhone) */}
        <div className="p-3.5 sm:p-5 overflow-y-auto flex-1 flex flex-col justify-between pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          {!isCompleted && currentItem ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-6 items-center flex-1">
              {/* Imagen y Ubicación en Estante */}
              <div className="flex flex-row md:flex-col items-center gap-4 md:gap-2">
                <div className="relative w-36 h-36 sm:w-full sm:h-52 rounded-2xl sm:rounded-3xl overflow-hidden bg-fio-50 border-2 sm:border-2 border-fio-200 shadow-md shrink-0">
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
                  {/* Badge de Estante en Celular (50% más grande) */}
                  <div className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-fio-900 text-white font-black text-xs mb-2 shadow-sm">
                    <MapPin className="w-4 h-4 text-fio-yellow shrink-0" />
                    <span className="truncate">{currentItem.shelfLocation || 'Bodega Central'}</span>
                  </div>

                  <span className="font-mono font-extrabold text-xs sm:text-xs bg-fio-100 text-fio-800 px-3 py-1 rounded-xl shadow-2xs">
                    SKU: {currentItem.sku}
                  </span>
                </div>
              </div>

              {/* Información y Acciones */}
              <div className="space-y-3 sm:space-y-3.5">
                <div>
                  <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl bg-purple-100 text-purple-900 font-bold text-xs mb-1">
                    <MapPin className="w-3.5 h-3.5 text-purple-700" />
                    <span>Estante: {currentItem.shelfLocation || 'Bodega Central'}</span>
                  </div>
                  <h3 className="font-bubble font-black text-xl sm:text-2xl text-fio-900 leading-tight">
                    {currentItem.name}
                  </h3>
                  {isEditingQty && editingItemSku === currentItem.sku ? (
                    <div className="mt-2.5 p-3 rounded-2xl bg-white border-2 border-fio-pink shadow-md space-y-2 animate-fadeIn">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span className="flex items-center gap-1.5 text-purple-900 font-bubble">
                          <Edit3 className="w-3.5 h-3.5 text-fio-pink" />
                          Modificar Cantidad en Alisto
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">Original: {currentItem.quantity} ud</span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1 bg-purple-50 p-1 rounded-xl border border-purple-200">
                          <button
                            type="button"
                            onClick={() => setTempQty((q) => Math.max(0, q - 1))}
                            className="w-8 h-8 rounded-lg bg-white hover:bg-purple-100 text-slate-800 font-black text-base flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-2xs"
                            title="Disminuir cantidad"
                          >
                            -
                          </button>

                          <input
                            type="number"
                            min="0"
                            max="999"
                            value={tempQty}
                            onChange={(e) => setTempQty(Math.max(0, parseInt(e.target.value, 10) || 0))}
                            className="w-16 text-center font-bubble font-black text-lg text-fio-900 py-1 px-1 bg-transparent focus:outline-none"
                          />

                          <button
                            type="button"
                            onClick={() => setTempQty((q) => q + 1)}
                            className="w-8 h-8 rounded-lg bg-white hover:bg-purple-100 text-slate-800 font-black text-base flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-2xs"
                            title="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={handleConfirmEditQuantity}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fio-pink hover:from-purple-500 hover:to-pink-500 text-white font-bubble font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                        >
                          <Check className="w-4 h-4 text-white" />
                          <span>Aceptar ({tempQty} ud)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingQty(false);
                            setEditingItemSku(null);
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bubble font-bold text-xs active:scale-95 transition-all cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Si encontraste menos productos en bodega, digita la cantidad real y pulsa <strong>Aceptar</strong>.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2 sm:mt-1.5 flex items-center gap-2 flex-wrap">
                      <div className="inline-flex items-center gap-2 px-3.5 py-2 sm:py-1 rounded-2xl bg-purple-100/90 border border-purple-300 text-xs sm:text-xs font-bold text-purple-950 shadow-xs">
                        <span>Cantidad a Alistar:</span>
                        <span className="text-base sm:text-base text-fio-pink font-black px-2 py-0.5 bg-white rounded-lg shadow-2xs">
                          {currentItem.quantity} unidad(es)
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleStartEditQuantity(currentItem.sku, currentItem.quantity)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-1 rounded-xl bg-white hover:bg-purple-100 border border-purple-300 text-purple-900 font-bubble font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
                        title="Modificar cantidad de unidades si encontraste menos en bodega"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-fio-pink" />
                        <span>Modificar</span>
                      </button>
                    </div>
                  )}
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



                {/* ACCIÓN SEGÚN EL MODO: CÓDIGO (CÁMARA CELULAR / USB) vs MANUAL */}
                {pickingMode === 'barcode' ? (
                  /* Modo 1: Alisto con Código (Pistola Lectora con Cámara del Celular) */
                  <div className="p-3 sm:p-4 bg-fio-50/90 rounded-2xl border-2 border-fio-200 space-y-3">
                    {/* Selector de Método: Cámara Celular vs USB / Teclado */}
                    <div className="flex items-center justify-between gap-2 border-b border-fio-200/80 pb-2">
                      <span className="text-xs font-bold text-fio-900 flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-fio-pink" />
                        <span>Lector de Códigos:</span>
                      </span>
                      <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-fio-200 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setIsCameraScannerOpen(true)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bubble font-bold transition-all flex items-center gap-1 ${
                            isCameraScannerOpen
                              ? 'bg-fio-800 text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Camera className="w-3.5 h-3.5 text-fio-yellow" />
                          <span>Cámara Celular</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCameraScannerOpen(false)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bubble font-bold transition-all flex items-center gap-1 ${
                            !isCameraScannerOpen
                              ? 'bg-fio-800 text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Scan className="w-3.5 h-3.5" />
                          <span>Teclado / USB</span>
                        </button>
                      </div>
                    </div>

                    {/* Visor de Cámara en Vivo: Celular como Pistola Escáner */}
                    {isCameraScannerOpen && (
                      <div className="w-full">
                        <PickingLiveBarcodeScanner
                          key={`${currentItem.sku}-${currentItemIndex}`}
                          expectedSku={currentItem.sku}
                          expectedName={currentItem.name}
                          expectedShelf={currentItem.shelfLocation || 'Bodega Central'}
                          onScanSuccess={(code: string) => handleProcessScan(code)}
                          onScanError={(code: string) => {
                            setScanFeedback({
                              type: 'error',
                              message: `Código leído: ${code}. No coincide con ${currentItem.sku} (${currentItem.name}).`,
                            });
                          }}
                        />
                      </div>
                    )}

                    {/* Feedback de Escaneo */}
                    {scanFeedback && (
                      <div
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                          scanFeedback.type === 'success'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : scanFeedback.type === 'warning'
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : 'bg-red-50 text-red-800 border-red-300'
                        }`}
                      >
                        {scanFeedback.type === 'success' ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <span className="text-xs leading-tight">{scanFeedback.message}</span>
                      </div>
                    )}

                    {/* Modo Manual o Teclado/USB */}
                    {!isCameraScannerOpen && (
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
                          className="flex-1 px-3.5 py-2.5 bg-white rounded-xl border border-fio-300 text-xs font-mono focus:ring-2 focus:ring-fio-400 focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-fio-800 text-white rounded-xl text-xs font-bold hover:bg-fio-900 cursor-pointer"
                        >
                          Validar
                        </button>
                      </form>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSimulateScanCurrent}
                        className="w-full py-2.5 px-3 bg-gradient-to-r from-purple-600 to-fio-pink hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs active:scale-95 cursor-pointer"
                      >
                        <Scan className="w-3.5 h-3.5" />
                        <span>Validar ({currentItem.sku})</span>
                      </button>
                    </div>

                    <div className="pt-1 flex items-center justify-between border-t border-fio-200/60 text-xs">
                      {isFeatureEnabled('orders', 'missing_reporting') ? (
                        <button
                          type="button"
                          onClick={() => handleMarkItemMissingManual(currentItem.sku)}
                          className="text-rose-600 hover:text-rose-800 font-bold underline cursor-pointer"
                        >
                          Reportar Faltante
                        </button>
                      ) : <span />}
                      {isFeatureEnabled('orders', 'manual_picking') && (
                        <button
                          type="button"
                          onClick={() => setPickingMode('manual')}
                          className="text-fio-pink hover:text-purple-700 font-bold underline cursor-pointer"
                        >
                          Cambiar a Alistar Pedido
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setActivePickingOrder(null)}
                      className="w-full py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bubble font-bold flex items-center justify-center gap-2 cursor-pointer border border-slate-300 transition-all min-h-[40px]"
                    >
                      <LogOut className="w-3.5 h-3.5 text-slate-500" />
                      <span>Salir a la Cola de Pedidos</span>
                    </button>
                  </div>
                ) : (
                  /* Modo 2: Alistar Pedido (Botón de Aceptar/Continuar, Faltante y Salir) */
                  <div className="p-3.5 sm:p-3.5 bg-purple-50/70 rounded-2xl border-2 border-purple-200 space-y-2.5 sm:space-y-2.5">
                    <p className="text-xs sm:text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <ClipboardList className="w-4 h-4 text-fio-pink" />
                      <span>Acción de Alisto en Estante:</span>
                    </p>

                    {/* Botón Principal: ACEPTAR Y CONTINUAR (50% más grande en celular) */}
                    <button
                      type="button"
                      onClick={() => handleMarkItemPickedManual(currentItem.sku)}
                      className="w-full py-4 sm:py-3.5 px-4 bg-gradient-to-r from-purple-600 to-fio-pink hover:from-purple-500 hover:to-pink-500 active:scale-[0.98] text-white rounded-2xl font-bubble font-black text-base sm:text-base flex items-center justify-center gap-2.5 shadow-clayBtn transition-all cursor-pointer min-h-[52px]"
                    >
                      <Check className="w-6 h-6 sm:w-5 sm:h-5 text-white" />
                      <span>Aceptar y Continuar ({currentItem.quantity} ud)</span>
                    </button>

                    {/* Botón de Faltante / Sin Existencias (50% más grande en celular) */}
                    {isFeatureEnabled('orders', 'missing_reporting') && (
                      <button
                        type="button"
                        onClick={() => handleMarkItemMissingManual(currentItem.sku)}
                        className="w-full py-3 sm:py-2.5 px-4 bg-amber-50 hover:bg-amber-100 active:scale-[0.98] border-2 border-amber-300 hover:border-amber-400 text-amber-900 rounded-xl sm:rounded-2xl font-bubble font-bold text-xs sm:text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs min-h-[44px]"
                        title="Reportar que este producto no tiene existencias o falta en el estante"
                      >
                        <AlertTriangle className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-amber-600" />
                        <span>Sin Existencias / Reportar Faltante</span>
                      </button>
                    )}

                    {/* Botón de Salir a la Cola de Pedidos (50% más grande en celular) */}
                    <button
                      type="button"
                      onClick={() => setActivePickingOrder(null)}
                      className="w-full py-3 sm:py-2.5 px-4 bg-white hover:bg-slate-100 active:scale-[0.98] border border-slate-300 text-slate-700 rounded-xl sm:rounded-2xl font-bubble font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs min-h-[44px]"
                    >
                      <LogOut className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-500" />
                      <span>Salir a la Cola de Pedidos</span>
                    </button>

                    <div className="pt-2 flex items-center justify-between border-t border-purple-200/80 text-xs sm:text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => setShowSummaryList(!showSummaryList)}
                        className="text-fio-800 hover:text-fio-900 flex items-center gap-1 cursor-pointer underline"
                      >
                        <Printer className="w-3 h-3 text-slate-600" />
                        <span>{showSummaryList ? 'Ocultar Resumen' : 'Ver Resumen / Imprimir'}</span>
                      </button>
                      {isFeatureEnabled('orders', 'code_picking') && (
                        <button
                          type="button"
                          onClick={() => setPickingMode('barcode')}
                          className="text-fio-pink hover:text-purple-700 cursor-pointer underline"
                        >
                          Cambiar a Alisto con Código
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Flujo Post-Finalización: Continuar con el siguiente pedido */
            <div className="py-4 sm:py-6 px-2 sm:px-6 text-center space-y-4 my-auto">
              <div className="inline-flex p-3 sm:p-4 rounded-full bg-purple-100 text-purple-700 shadow-sm animate-bounce">
                <CheckCircle className="w-10 h-10 sm:w-14 sm:h-14" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold mb-2 shadow-xs">
                  <Package className="w-3.5 h-3.5 text-amber-700" />
                  <span>Estado del Pedido: En Empaque 📦</span>
                </div>
                <h3 className="font-bubble font-bold text-lg sm:text-2xl text-fio-900 leading-snug">
                  ¡Alisto del Pedido {currentOrder.orderNumber} Finalizado!
                </h3>
                {(currentOrder.pickedBy || missingCount + pickedCount === totalCount) && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-300 text-xs font-bubble font-bold my-1 shadow-xs">
                    <UserCheck className="w-3.5 h-3.5 text-fio-pink" />
                    <span>Alistado por: <strong>{currentOrder.pickedBy || currentUser?.name || 'Administración'}</strong></span>
                  </div>
                )}
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
                  {missingCount === 0
                    ? `Se alistaron exitosamente los ${pickedCount} producto(s). El pedido pasó a la sección de Empaque.`
                    : `Se alistaron ${pickedCount} producto(s) y se reportaron ${missingCount} con faltante. El pedido pasó a Empaque.`}
                </p>
              </div>

              {/* Botón Destacado Opcional: Generar Factura de una Vez */}
              <div className="max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    setInvoiceOrder(currentOrder);
                    setActivePickingOrder(null);
                  }}
                  className="w-full py-2.5 sm:py-3 px-4 bg-gradient-to-r from-purple-600 to-fio-pink hover:from-purple-500 hover:to-pink-500 active:scale-[0.98] text-white rounded-xl font-bubble font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-clayBtn transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-fio-yellow" />
                  <span>Generar Factura de una Vez</span>
                </button>
              </div>

              {/* Pregunta: Continuar con el siguiente pedido */}
              <div className="bg-purple-50/80 border-2 border-purple-200 rounded-2xl p-3.5 sm:p-5 max-w-md mx-auto text-left shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping" />
                  <h4 className="font-bubble font-bold text-sm sm:text-base text-purple-950">
                    ¿Continuar con el siguiente pedido?
                  </h4>
                </div>

                {/* Previsualización del Siguiente Pedido o Estado de Cola */}
                {nextPendingOrder ? (
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
                ) : (
                  <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-purple-200 text-center">
                    <p className="font-bubble font-bold text-xs text-slate-800">
                      🎉 ¡Todos los pedidos pendientes han sido alistados!
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      No hay más pedidos pendientes en cola en este momento.
                    </p>
                  </div>
                )}

                {/* Botones de Acción: Aceptar / Continuar o Salir */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (nextPendingOrder) {
                        startPicking(nextPendingOrder.id, pickingMode);
                      } else {
                        setActivePickingOrder(null);
                      }
                    }}
                    className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white rounded-xl font-bubble font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-clayBtn transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{nextPendingOrder ? 'Aceptar / Continuar' : 'Aceptar'}</span>
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
                        ? 'bg-purple-50/70 border-purple-300'
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
                      {!it.isPicked && (
                        <button
                          type="button"
                          onClick={() => handleStartEditQuantity(it.sku, it.quantity)}
                          className="p-1 rounded-lg bg-white hover:bg-purple-100 text-slate-600 hover:text-fio-pink border border-slate-200 transition-all cursor-pointer shadow-2xs"
                          title="Modificar cantidad de este producto"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-bubble ${
                          it.isPicked
                            ? 'bg-purple-600 text-white'
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
