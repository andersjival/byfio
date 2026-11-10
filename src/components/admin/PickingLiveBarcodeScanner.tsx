import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import {
  Camera, Flashlight, RefreshCw, AlertTriangle, CheckCircle2,
  Pause, Play, Sparkles, SwitchCamera, XCircle, Sun
} from 'lucide-react';
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
  onTogglePause,
}) => {
  const containerId = 'byfio-picking-live-scanner-viewport';

  const [isStarting, setIsStarting] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hasTorch, setHasTorch] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isHighClarity, setIsHighClarity] = useState(false);
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

  // Detener el escáner y liberar la cámara
  const stopScanner = useCallback(async () => {
    if (mediaStreamTrackRef.current) {
      try {
        if (isTorchOn) {
          await (mediaStreamTrackRef.current as any).applyConstraints({ advanced: [{ torch: false }] });
        }
      } catch {}
      mediaStreamTrackRef.current = null;
    }

    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
  }, [isTorchOn]);

  // Iniciar el escáner de cámara
  const startScanner = useCallback(async (facing: 'environment' | 'user') => {
    setIsStarting(true);
    setCameraError(null);
    setHasTorch(false);
    setIsTorchOn(false);

    try {
      await stopScanner();

      // Esperar brevemente a que el DOM esté disponible
      const containerEl = document.getElementById(containerId);
      if (!containerEl) {
        setIsStarting(false);
        return;
      }

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
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true,
        },
      });

      scannerRef.current = html5QrCode;

      // Configuración calibrada con qrbox rectangular centrado con el marco visual
      const config = {
        fps: 25,
        qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
          const width = Math.floor(viewfinderWidth * 0.88);
          const height = Math.floor(Math.min(viewfinderHeight * 0.55, 160));
          return { width: Math.max(220, width), height: Math.max(110, height) };
        },
        videoConstraints: {
          facingMode: { ideal: facing },
          width: { min: 720, ideal: 1280, max: 1920 },
          height: { min: 720, ideal: 720, max: 1080 },
        },
      };

      await html5QrCode.start(
        { facingMode: facing },
        config,
        (decodedText: string) => {
          handleDecodedBarcode(decodedText);
        },
        () => {
          // Frame continuo sin código detectado
        }
      );

      setIsStarting(false);

      // Comprobar soporte de Linterna (Torch)
      try {
        const videoElement = document.querySelector(`#${containerId} video`) as HTMLVideoElement | null;
        if (videoElement && videoElement.srcObject) {
          const stream = videoElement.srcObject as MediaStream;
          const track = stream.getVideoTracks()[0];
          if (track) {
            mediaStreamTrackRef.current = track;
            const capabilities = (track.getCapabilities?.() || {}) as any;
            if (capabilities.torch) {
              setHasTorch(true);
            }
            // Activar enfoque continuo y auto-exposición para erradicar desenfoque
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
        setCameraError('Permiso de cámara denegado. Habilita los permisos de cámara en tu navegador para usar el celular como lector.');
      } else if (msg.includes('notfound') || msg.includes('device')) {
        setCameraError('No se detectó cámara trasera en este dispositivo.');
      } else {
        setCameraError('No se pudo acceder a la cámara. Asegúrate de otorgar permisos al navegador.');
      }
    }
  }, [stopScanner]);

  // Manejo de la decodificación en vivo
  const handleDecodedBarcode = (rawCode: string) => {
    if (!rawCode || isCooldownRef.current || isPaused) return;

    const trimmed = rawCode.trim();
    const now = Date.now();

    // Evitar spam si el mismo código erróneo se lee consecutivamente en menos de 1.5s
    if (lastScannedCodeRef.current.code === trimmed && now - lastScannedCodeRef.current.time < 1500) {
      return;
    }

    lastScannedCodeRef.current = { code: trimmed, time: now };
    const isMatch = checkBarcodeMatch(trimmed, expectedSku);

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

      // Notificar al componente padre para marcar el ítem y avanzar al siguiente
      onScanSuccess(trimmed);

      // Cooldown de 800ms para permitir transición limpia al siguiente producto
      setTimeout(() => {
        isCooldownRef.current = false;
      }, 800);
    } else {
      // ERROR: El código escaneado pertenece a otro producto o es inválido
      playBarcodeErrorSound();
      setFeedback({
        type: 'error',
        code: trimmed,
        message: `Código ${trimmed} no coincide. Busca ${expectedSku} (${expectedName}) en ${expectedShelf}.`,
        timestamp: now,
      });

      if (onScanError) {
        onScanError(trimmed, expectedSku);
      }
    }
  };

  // Alternar Linterna
  const toggleTorch = async () => {
    if (!mediaStreamTrackRef.current || !hasTorch) return;
    try {
      const next = !isTorchOn;
      await (mediaStreamTrackRef.current as any).applyConstraints({
        advanced: [{ torch: next }],
      });
      setIsTorchOn(next);
      playWaterDropSound();
    } catch {}
  };

  // Alternar Cámara (trasera <-> frontal)
  const toggleFacingMode = () => {
    playWaterDropSound();
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    startScanner(nextFacing);
  };

  // Montar y desmontar escáner
  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => {
      if (mounted && !isPaused) {
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
    if (isPaused) {
      stopScanner();
    } else if (!scannerRef.current) {
      startScanner(facingMode);
    }
  }, [isPaused, facingMode, startScanner, stopScanner]);

  // Limpiar feedback tras 3.5 segundos
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => {
      setFeedback(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [feedback]);

  return (
    <div className="relative w-full bg-slate-950 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-purple-900/60 shadow-xl flex flex-col select-none">
      {/* Barra de Controles Superiores del Lector */}
      <div className="p-2 sm:p-2.5 bg-slate-900/90 border-b border-purple-800/40 flex items-center justify-between text-xs gap-2 shrink-0 z-20">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isPaused || cameraError ? 'bg-amber-400' : 'bg-emerald-400'
            }`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              isPaused || cameraError ? 'bg-amber-500' : 'bg-emerald-500'
            }`} />
          </span>
          <span className="font-bubble font-bold text-[11px] text-white truncate">
            {isPaused ? 'Lector Pausado' : cameraError ? 'Cámara No Disponible' : 'Pistola Lectora Activa'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {hasTorch && (
            <button
              type="button"
              onClick={toggleTorch}
              className={`p-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1 ${
                isTorchOn
                  ? 'bg-fio-yellow text-slate-950 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-yellow-300'
              }`}
              title={isTorchOn ? 'Apagar Linterna' : 'Encender Linterna para estantes oscuros'}
            >
              <Flashlight className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px]">{isTorchOn ? 'Luz ON' : 'Luz'}</span>
            </button>
          )}

          {/* Botón de Realce de Claridad / Brillo */}
          <button
            type="button"
            onClick={() => {
              setIsHighClarity(!isHighClarity);
              playWaterDropSound();
            }}
            className={`p-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1 ${
              isHighClarity
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300'
            }`}
            title={isHighClarity ? 'Desactivar Realce de Claridad' : 'Activar Modo Ultra Claridad (Bodega / Poca Luz)'}
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px]">{isHighClarity ? 'Ultra Luz' : 'Claridad'}</span>
          </button>

          <button
            type="button"
            onClick={toggleFacingMode}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white transition-all active:scale-95 flex items-center gap-1"
            title="Alternar entre cámara trasera y frontal"
          >
            <SwitchCamera className="w-3.5 h-3.5" />
          </button>

          {onTogglePause && (
            <button
              type="button"
              onClick={onTogglePause}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all active:scale-95 flex items-center gap-1"
              title={isPaused ? 'Reanudar lectura de código de barras' : 'Pausar cámara'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Visor de Video en Vivo */}
      <div className={`relative w-full h-60 sm:h-72 md:h-80 bg-black flex items-center justify-center overflow-hidden ${isHighClarity ? "high-clarity-camera" : ""}`}>
        <div id={containerId} className="w-full h-full object-cover" />

        {/* Mira Láser y Encuadre Guiado para Códigos de Barras Centrado Milimétricamente */}
        {!cameraError && !isStarting && !isPaused && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-3">
            <div
              className={`relative w-[88%] max-w-[340px] h-32 sm:h-36 rounded-2xl border-2 transition-all duration-200 flex items-center justify-center ${
                feedback?.type === 'success'
                  ? 'border-emerald-400 bg-emerald-500/15 shadow-[0_0_30px_rgba(16,185,129,0.5)]'
                  : feedback?.type === 'error'
                  ? 'border-rose-500 bg-rose-500/15 shadow-[0_0_30px_rgba(244,63,94,0.5)]'
                  : 'border-fio-pink border-dashed shadow-[0_0_20px_rgba(236,72,153,0.35)]'
              }`}
            >
              {/* Esquinas Guía Amarillas */}
              <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-fio-yellow rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-fio-yellow rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-fio-yellow rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-fio-yellow rounded-br-lg" />

              {/* Retículo central */}
              <div className="w-2 h-2 rounded-full bg-fio-yellow/80 shadow-[0_0_8px_#facc15]" />

              {/* Línea Láser Animada en Movimiento Centrada al 50% */}
              <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_10px_#ef4444] animate-pulse top-1/2 -translate-y-1/2" />

              {/* Mensaje de guía flotante dentro de la mira */}
              <div className="absolute bottom-1.5 inset-x-0 flex justify-center">
                <span className="text-[10px] bg-slate-950/80 text-fio-yellow font-mono font-bold px-2 py-0.5 rounded-full border border-yellow-500/40">
                  Centra el código de barras aquí
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Pantalla de Carga de Cámara */}
        {isStarting && (
          <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-2 p-4 text-center z-10">
            <RefreshCw className="w-7 h-7 text-fio-pink animate-spin" />
            <p className="text-xs font-bubble font-bold text-white">Activando lector de código de barras...</p>
            <p className="text-[10px] text-purple-300">Optimizando enfoque para estanterías</p>
          </div>
        )}

        {/* Mensaje de Error de Cámara */}
        {cameraError && (
          <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-4 text-center gap-2 z-10">
            <AlertTriangle className="w-8 h-8 text-amber-400" />
            <p className="text-xs text-amber-200 font-bubble font-medium max-w-xs">
              {cameraError}
            </p>
            <button
              type="button"
              onClick={() => startScanner(facingMode)}
              className="mt-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bubble text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reintentar Conexión</span>
            </button>
          </div>
        )}

        {/* Estado Pausado */}
        {isPaused && !isStarting && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-4 text-center gap-2 z-10">
            <Pause className="w-8 h-8 text-purple-400" />
            <p className="text-xs font-bubble text-slate-300 font-bold">Cámara en Pausa</p>
            {onTogglePause && (
              <button
                type="button"
                onClick={onTogglePause}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-fio-pink text-white font-bubble text-xs font-bold shadow-sm"
              >
                Reanudar Lector
              </button>
            )}
          </div>
        )}

        {/* Banner de Feedback en Vivo (Éxito o Error) */}
        {feedback && (
          <div className={`absolute bottom-2 inset-x-3 p-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg animate-fadeIn z-20 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border border-emerald-500'
              : 'bg-rose-950/90 text-rose-200 border border-rose-500'
          }`}>
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="text-[11px] leading-tight flex-1">{feedback.message}</span>
          </div>
        )}
      </div>

      {/* Pie con SKU Esperado para Validación Rápida Visual */}
      <div className="p-2 sm:p-2.5 bg-slate-900 border-t border-purple-900/40 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-[10px] text-purple-400 uppercase font-mono font-bold">Esperando SKU:</span>
          <span className="font-mono font-black text-fio-yellow text-xs bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
            {expectedSku}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-bubble">Code 128 / QR / EAN</span>
      </div>
    </div>
  );
};
