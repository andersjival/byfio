import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle, AlertTriangle, MapPin, Sparkles, Scan, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const GuidedPickingModal: React.FC = () => {
  const { activePickingOrder, setActivePickingOrder, markItemPicked, setInvoiceOrder } = useApp();
  const [manualInput, setManualInput] = useState('');
  const [scanFeedback, setScanFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!activePickingOrder) return null;

  const items = activePickingOrder.items;
  const currentItemIndex = items.findIndex((it) => !it.isPicked);
  const currentItem = currentItemIndex !== -1 ? items[currentItemIndex] : null;
  const pickedCount = items.filter((it) => it.isPicked).length;
  const totalCount = items.length;

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
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#A855F7', '#EC4899', '#38BDF8', '#FACC15'],
      });

      // Complete picking & auto-open invoice
      const completedOrder = {
        ...activePickingOrder,
        items: activePickingOrder.items.map((i) => ({ ...i, isPicked: true })),
        orderStatus: 'packed' as const,
        packedAt: new Date().toISOString(),
      };
      setActivePickingOrder(null);
      setInvoiceOrder(completedOrder);
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
        <div className="p-4 sm:p-5 bg-gradient-to-r from-fio-800 to-fio-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-white/10 rounded-2xl">
              <Scan className="w-6 h-6 text-fio-yellow animate-pulse" />
            </span>
            <div>
              <span className="text-[10px] text-fio-300 uppercase tracking-widest font-bold">
                Alisto Guiado en Tiempo Real
              </span>
              <h2 className="font-bubble font-bold text-lg sm:text-xl">
                Pedido {activePickingOrder.orderNumber} — {activePickingOrder.customerName}
              </h2>
            </div>
          </div>
          <button
            onClick={() => setActivePickingOrder(null)}
            className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Barra de Progreso Superior */}
        <div className="bg-fio-100 px-5 py-2.5 flex items-center justify-between text-xs font-bold text-fio-900 border-b border-fio-200">
          <span>
            Producto {currentItemIndex !== -1 ? currentItemIndex + 1 : totalCount} de {totalCount}
          </span>
          <span className="text-fio-pink font-bubble">
            {pickedCount} de {totalCount} Alistados ({Math.round((pickedCount / totalCount) * 100)}%)
          </span>
        </div>

        {/* Contenido Principal: Pantalla Gigante del Producto Actual */}
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
                      <Sparkles className="w-4 h-4 text-fio-pink" />
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
                  <p className="text-xs font-bold text-fio-900">Validar Código QR:</p>

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
                      className="px-3.5 py-2 bg-fio-800 text-white rounded-xl text-xs font-bold hover:bg-fio-900"
                    >
                      Validar
                    </button>
                  </form>

                  <div className="flex gap-2">
                    <button
                      onClick={handleSimulateScanCurrent}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <Scan className="w-3.5 h-3.5" />
                      <span>Escanear QR Correcto ({currentItem.sku})</span>
                    </button>
                    <button
                      onClick={handleSimulateWrongScan}
                      title="Probar alerta de error al escanear QR incorrecto"
                      className="py-2 px-3 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl text-xs font-bold"
                    >
                      Probar Error
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-bubble font-bold text-2xl text-fio-900">¡Alisto Completado al 100%!</h3>
              <p className="text-xs text-gray-500 mb-4">Todos los artículos fueron verificados con código QR.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
