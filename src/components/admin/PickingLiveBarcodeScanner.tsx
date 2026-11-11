import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { playBarcodeSuccessSound, playBarcodeErrorSound, playWaterDropSound } from '../../utils/soundEffects';

interface PickingLiveBarcodeScannerProps {
  expectedSku: string;
  expectedName: string;
  expectedShelf?: string;
  onScanSuccess: (scannedCode: string) => void;
  onScanError?: (scannedCode: string, expectedSku: string) => void;
  isPaused?: boolean;
  onTogglePause?: () => void;
}

/**
 * Normaliza y comprueba si el código decodificado por la cámara coincide con el SKU esperado
 */
export const checkBarcodeMatch = (scannedRaw: string, expectedSkuRaw: string): boolean => {
  if (!scannedRaw || !expectedSkuRaw) return false;
  const s = scannedRaw.trim().toUpperCase().replace(/\s+/g, '');
  const exp = expectedSkuRaw.trim().toUpperCase().replace(/\s+/g, '');

  if (s === exp) return true;
  if (exp.length >= 4 && s.includes(exp)) return true;
  if (s.endsWith('/' + exp) || s.endsWith('=' + exp)) return true;
  if (s.includes('SKU=' + exp) || s.includes('SKU:' + exp) || s.includes('CODE=' + exp)) return true;

  return false;
};

export const PickingLiveBarcodeScanner: React.FC<PickingLiveBarcodeScannerProps> = ({
  expectedSku,
  expectedName,
  expectedShelf = 'Bodega Central',
  onScanSuccess,
  onScanError,
  isPaused = false,
}) => {
  const containerId = 'byfio-picking-live-scanner-viewport';

  const [isStarting, setIsStarting] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    code: string;
    message: string;
    timestamp: number;
  } | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const mediaStreamTrackRef = useRef<MediaStreamTrack | null>(null);
  const isCooldownRef = useRef(false);
  const lastScannedCodeRef = useRef<{ code: string; time: number }>({ code: '', time: 0 });
  const isStartingRef = useRef(false);
  const isStoppingRef = useRef(false);

  const isPausedRef = useRef(isPaused);
  const expectedSkuRef = useRef(expectedSku);
  const expectedNameRef = useRef(expectedName);
  const expectedShelfRef = useRef(expectedShelf);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    expectedSkuRef.current = expectedSku;
    expectedNameRef.current = expectedName;
    expectedShelfRef.current = expectedShelf;
  }, [expectedSku, expectedName, expectedShelf]);

  // Detener el escáner y liberar la cámara
  const stopScanner = useCallback(async () => {
    if (isStoppingRef.current) return;
    isStoppingRef.current = true;

    try {
      if (mediaStreamTrackRef.current) {
        mediaStreamTrackRef.current = null;
      }

      if (scannerRef.current) {
        const scanner = scannerRef.current;
        scannerRef.current = null;
        try {
          if (scanner.isScanning) {
            await scanner.stop();
          }
        } catch (e) {
          console.warn('Error al detener escáner:', e);
        }
        try {
          scanner.clear();
        } catch (e) {
          console.warn('Error al limpiar contenedor del escáner:', e);
        }
      }
    } finally {
      isStoppingRef.current = false;
    }
  }, []);

  // Manejo de la decodificación en vivo
  const handleDecodedBarcode = useCallback((rawCode: string) => {
    if (!rawCode || isCooldownRef.current || isPausedRef.current) return;

    const trimmed = rawCode.trim();
    const now = Date.now();

    // Evitar spam si el mismo código erróneo se lee consecutivamente en menos de 1.5s
    if (lastScannedCodeRef.current.code === trimmed && now - lastScannedCodeRef.current.time < 1500) {
      return;
    }

    lastScannedCodeRef.current = { code: trimmed, time: now };
    const currentTargetSku = expectedSkuRef.current || expectedSku;
    const isMatch = checkBarcodeMatch(trimmed, currentTargetSku);

    if (isMatch) {
      // ÉXITO: Código coincide con el producto actual
      isCooldownRef.current = true;
      playBarcodeSuccessSound();
      setFeedback({
        type: 'success',
        code: trimmed,
        message: `¡Correcto! ${trimmed} verificado`,
        timestamp: now,
      });

      // Notificar al componente padre
      onScanSuccess(trimmed);

      // Cooldown de 800ms
      setTimeout(() => {
        isCooldownRef.current = false;
      }, 800);
    } else {
      // ERROR: Código no coincide
      playBarcodeErrorSound();
      setFeedback({
        type: 'error',
        code: trimmed,
        message: `Código ${trimmed} no coincide. Busca ${expectedSkuRef.current || expectedSku} en ${expectedShelfRef.current || expectedShelf}.`,
        timestamp: now,
      });

      if (onScanError) {
        onScanError(trimmed, expectedSkuRef.current || expectedSku);
      }
    }
  }, [expectedSku, expectedShelf, onScanSuccess, onScanError]);

  // Iniciar el escáner de cámara
  const startScanner = useCallback(async (facing: 'environment' | 'user') => {
    if (isStartingRef.current) return;
    isStartingRef.current = true;
    setIsStarting(true);
    setCameraError(null);

    try {
      await stopScanner();

      // Esperar brevemente a que el DOM esté disponible
      const containerEl = document.getElementById(containerId);
      if (!containerEl) {
        setIsStarting(false);
        isStartingRef.current = false;
        return;
      }

      // Limpiar cualquier residuo previo en el contenedor DOM
      containerEl.innerHTML = '';

      const supportedFormats = [
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.CODABAR,
      ];

      const html5QrCode = new Html5Qrcode(containerId, {
        formatsToSupport: supportedFormats,
        verbose: false,
      });

      scannerRef.current = html5QrCode;

      // Configuración 100% compatible con todos los navegadores móviles y desktop
      // (sin qrbox para escanear todo el sensor y evitar errores de recorte)
      const config = {
        fps: 20,
      };

      await html5QrCode.start(
        { facingMode: { ideal: facing } },
        config,
        (decodedText: string) => {
          handleDecodedBarcode(decodedText);
        },
        () => {
          // Frame continuo sin código detectado
        }
      );

      setIsStarting(false);

      // Auto-enfoque continuo en dispositivos compatibles
      try {
        const videoElement = containerEl.querySelector('video') as HTMLVideoElement | null;
        if (videoElement && videoElement.srcObject) {
          const stream = videoElement.srcObject as MediaStream;
          const track = stream.getVideoTracks()[0];
          if (track) {
            mediaStreamTrackRef.current = track;
            const capabilities = (track.getCapabilities?.() || {}) as any;
            const adv: any[] = [];
            if (capabilities.focusMode?.includes('continuous')) adv.push({ focusMode: 'continuous' });
            if (capabilities.exposureMode?.includes('continuous')) adv.push({ exposureMode: 'continuous' });
            if (adv.length > 0) {
              try { await track.applyConstraints({ advanced: adv }); } catch {}
            }
          }
        }
      } catch {}
    } catch (err: any) {
      console.warn('Error al activar cámara para escaneo de códigos de barra:', err);
      setIsStarting(false);
      const msg = String(err?.message || err || '').toLowerCase();
      if (msg.includes('permission') || msg.includes('denied') || msg.includes('notallowed')) {
        setCameraError('Permiso de cámara denegado. Habilita los permisos de cámara en tu navegador.');
      } else if (msg.includes('notfound') || msg.includes('device')) {
        setCameraError('No se detectó cámara en este dispositivo.');
      } else {
        setCameraError('No se pudo acceder a la cámara. Revisa los permisos de tu navegador.');
      }
    } finally {
      isStartingRef.current = false;
    }
  }, [stopScanner, handleDecodedBarcode]);

  // Montar y desmontar escáner
  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => {
      if (mounted && !isPaused && !scannerRef.current) {
        startScanner(facingMode);
      }
    }, 120);

    return () => {
      mounted = false;
      clearTimeout(timer);
      stopScanner();
    };
  }, [facingMode]);

  // Si cambia el estado de pausa
  useEffect(() => {
    if (!isPaused && !scannerRef.current && !isStartingRef.current) {
      startScanner(facingMode);
    }
  }, [isPaused, facingMode, startScanner]);

  // Limpiar feedback tras 3.5 segundos
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => {
      setFeedback(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [feedback]);

  return (
    <div className="relative w-full bg-slate-950 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-purple-900/60 shadow-xl flex flex-col items-center justify-center p-3 sm:p-5 select-none bg-black">
      {/* Cuadrito de Escaneo Puntiagudo con Esquinas Amarillas: Único espacio donde se visualiza la cámara */}
      <div
        className={`relative w-[92%] max-w-[340px] h-44 sm:h-48 rounded-2xl border-2 transition-all duration-200 flex items-center justify-center bg-black ${
          feedback?.type === 'success'
            ? 'border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)]'
            : feedback?.type === 'error'
            ? 'border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.5)]'
            : 'border-fio-pink border-dashed shadow-[0_0_20px_rgba(236,72,153,0.35)]'
        }`}
      >
        {/* Contenedor de video confinado al recuadro */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div id={containerId} className="w-full h-full object-cover" />
        </div>

        {/* Overlay cuando el producto ya fue validado y espera confirmación de cantidad */}
        {isPaused && (
          <div className="absolute inset-0 rounded-2xl bg-emerald-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center z-20 animate-fadeIn pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-1 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              <CheckCircle className="w-7 h-7 text-emerald-400 animate-pulse" />
            </div>
            <span className="text-white font-bubble font-black text-xs uppercase tracking-wider">
              ¡Código Validado!
            </span>
            <span className="text-emerald-200 text-[11px] font-mono font-bold">
              {expectedSku}
            </span>
          </div>
        )}

        {/* Esquinas Guía Amarillas Puntiagudas */}
        <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-fio-yellow rounded-tl-lg pointer-events-none z-10" />
        <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-fio-yellow rounded-tr-lg pointer-events-none z-10" />
        <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-fio-yellow rounded-bl-lg pointer-events-none z-10" />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-fio-yellow rounded-br-lg pointer-events-none z-10" />

        {/* Retículo central */}
        <div className="absolute w-2 h-2 rounded-full bg-fio-yellow/80 shadow-[0_0_8px_#facc15] pointer-events-none z-10" />

        {/* Línea Láser Animada en Movimiento Centrada al 50% */}
        <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_10px_#ef4444] animate-pulse top-1/2 -translate-y-1/2 pointer-events-none z-10" />

        {/* Pantalla de Carga de Cámara */}
        {isStarting && (
          <div className="absolute inset-0 rounded-2xl bg-slate-950 flex flex-col items-center justify-center gap-2 p-3 text-center z-20">
            <RefreshCw className="w-7 h-7 text-fio-pink animate-spin" />
          </div>
        )}

        {/* Mensaje de Error de Cámara */}
        {cameraError && (
          <div className="absolute inset-0 rounded-2xl bg-slate-950/95 flex flex-col items-center justify-center p-3 text-center gap-2 z-20">
            <AlertTriangle className="w-7 h-7 text-amber-400" />
            <p className="text-xs text-amber-200 font-bubble font-medium max-w-xs leading-tight">
              {cameraError}
            </p>
            <button
              type="button"
              onClick={() => {
                isStartingRef.current = false;
                startScanner(facingMode);
              }}
              className="mt-1 px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bubble text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reintentar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
