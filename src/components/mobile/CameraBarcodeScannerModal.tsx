import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, Flashlight, AlertCircle, RefreshCw, KeyRound, Check } from 'lucide-react';
import { playBubblePopSound, playWaterDropSound } from '../../utils/soundEffects';

interface CameraBarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (scannedText: string) => void;
}

export const CameraBarcodeScannerModal: React.FC<CameraBarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onScan,
}) => {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(true);
  const [manualCode, setManualCode] = useState('');
  const [hasTorch, setHasTorch] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const mediaStreamTrackRef = useRef<MediaStreamTrack | null>(null);
  const isScanningRef = useRef(false);

  const containerId = 'byfio-qr-camera-viewport';

  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      return;
    }

    let isMounted = true;
    setIsStarting(true);
    setCameraError(null);

    const initScanner = async () => {
      try {
        // Detener instancia previa si existiera
        await stopScanner();

        if (!isMounted) return;

        const html5QrCode = new Html5Qrcode(containerId);
        scannerRef.current = html5QrCode;

        // Configuración de escaneo centrada: qrbox rectangular adaptado a códigos de barra y QR
        const config = {
          fps: 25,
          qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
            // Marco rectangular centrado que coincide milimétricamente con el marco visual
            const width = Math.floor(viewfinderWidth * 0.86);
            const height = Math.floor(Math.min(viewfinderHeight * 0.52, 175));
            return { width: Math.max(220, width), height: Math.max(120, height) };
          },
        };

        await html5QrCode.start(
          { facingMode: 'environment' }, // Cámara trasera del celular
          config,
          (decodedText) => {
            if (!isScanningRef.current) return;
            isScanningRef.current = false;
            playBubblePopSound();

            // Vibración táctil si el hardware lo permite
            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
              try {
                navigator.vibrate([120, 40, 120]);
              } catch {}
            }

            onScan(decodedText.trim());
            onClose();
          },
          () => {
            // Error por frame vacío (comportamiento normal continuo)
          }
        );

        if (!isMounted) {
          await stopScanner();
          return;
        }

        isScanningRef.current = true;
        setIsStarting(false);

        // Comprobar soporte de linterna / Flash (Torch)
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
            }
          }
        } catch {}
      } catch (err: any) {
        if (!isMounted) return;
        console.warn('Inconveniente al iniciar la cámara para escaneo:', err);
        setIsStarting(false);

        const errMsg = String(err?.message || err || '').toLowerCase();
        if (errMsg.includes('permission') || errMsg.includes('denied') || errMsg.includes('notallowed')) {
          setCameraError('Permiso de cámara denegado. Puedes activarlo en los ajustes de tu navegador o ingresar el código manualmente abajo.');
        } else if (errMsg.includes('notfound') || errMsg.includes('device')) {
          setCameraError('No se encontró una cámara compatible en este dispositivo.');
        } else {
          setCameraError('No se pudo acceder a la cámara trasera. Asegúrate de otorgar permisos al navegador.');
        }
      }
    };

    // Pequeño retardo para asegurar que el DOM del contenedor esté montado
    const timer = setTimeout(() => {
      initScanner();
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      stopScanner();
    };
  }, [isOpen]);

  const stopScanner = async () => {
    isScanningRef.current = false;
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
  };

  const toggleTorch = async () => {
    if (!mediaStreamTrackRef.current || !hasTorch) return;
    try {
      const nextTorch = !isTorchOn;
      await (mediaStreamTrackRef.current as any).applyConstraints({
        advanced: [{ torch: nextTorch }],
      });
      setIsTorchOn(nextTorch);
      playWaterDropSound();
    } catch {}
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    playBubblePopSound();
    onScan(manualCode.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={() => onClose()}
    >
      <div
        className="relative w-full max-w-sm bg-slate-900 border border-purple-800/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-slate-100 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Escáner */}
        <div className="p-4 border-b border-purple-900/60 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 text-fio-yellow flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bubble font-bold text-sm text-white">Escáner de Productos</h3>
              <p className="text-[10px] text-purple-300">Enfoca el código de barras o QR de la etiqueta</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {hasTorch && (
              <button
                type="button"
                onClick={toggleTorch}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isTorchOn
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
                title={isTorchOn ? 'Apagar linterna' : 'Encender linterna'}
              >
                <Flashlight className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visor de Cámara */}
        <div className="relative aspect-square w-full bg-black overflow-hidden flex items-center justify-center">
          <div id={containerId} className="w-full h-full object-cover" />

          {/* Animación del marco de escaneo centrado milimétricamente con el sensor */}
          {!cameraError && !isStarting && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-3">
              <div className="relative w-[86%] max-w-[310px] h-36 sm:h-40 border-2 border-dashed border-fio-pink rounded-3xl shadow-[0_0_25px_rgba(236,72,153,0.35)] flex items-center justify-center">
                {/* Esquinas guía */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-fio-yellow rounded-tl-xl" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-fio-yellow rounded-tr-xl" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-fio-yellow rounded-bl-xl" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-fio-yellow rounded-br-xl" />

                {/* Retículo / Punto de centrado exacto */}
                <div className="w-2 h-2 rounded-full bg-fio-yellow/80 shadow-[0_0_8px_#facc15]" />

                {/* Línea láser de escaneo centrada exactamente al 50% */}
                <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-fio-pink to-transparent shadow-[0_0_10px_rgba(236,72,153,0.9)] animate-pulse" />

                {/* Indicador de ayuda */}
                <span className="absolute -bottom-6 text-[10px] font-mono font-bold text-fio-yellow bg-slate-950/80 px-2 py-0.5 rounded-full border border-fio-yellow/30">
                  Centra el código aquí
                </span>
              </div>
            </div>
          )}

          {/* Loader de Inicio */}
          {isStarting && (
            <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-3 p-4 text-center z-10">
              <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
              <p className="text-xs font-bubble text-slate-300">Conectando cámara del celular...</p>
              <p className="text-[10px] text-slate-500">Android & iPhone compatibles</p>
            </div>
          )}

          {/* Mensaje si ocurre error o permiso denegado */}
          {cameraError && (
            <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center gap-3 z-10">
              <AlertCircle className="w-10 h-10 text-amber-400" />
              <p className="text-xs text-amber-200 font-bubble leading-relaxed">
                {cameraError}
              </p>
              <p className="text-[11px] text-slate-400">
                Puedes digitar el SKU manualmente abajo para continuar con el pedido.
              </p>
            </div>
          )}
        </div>

        {/* Input Manual de Emergencia */}
        <div className="p-3.5 bg-slate-950 border-t border-purple-900/60">
          <form onSubmit={handleManualSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="O ingresa SKU manual (ej. LIB-PED-001)..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400"
            />
            <button
              type="submit"
              disabled={!manualCode.trim()}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bubble font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>OK</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
