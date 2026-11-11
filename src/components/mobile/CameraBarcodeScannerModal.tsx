import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { playBubblePopSound } from '../../utils/soundEffects';

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

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef(false);

  const containerId = 'byfio-qr-camera-viewport';

  // Cerrar con tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

        // Configuración de escaneo robusta sin qrbox para abarcar todo el sensor
        const config = {
          fps: 20,
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
      } catch (err: any) {
        if (!isMounted) return;
        console.warn('Inconveniente al iniciar la cámara para escaneo:', err);
        setIsStarting(false);

        const errMsg = String(err?.message || err || '').toLowerCase();
        if (errMsg.includes('permission') || errMsg.includes('denied') || errMsg.includes('notallowed')) {
          setCameraError('Permiso de cámara denegado. Puedes activarlo en los ajustes de tu navegador para escanear.');
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={() => onClose()}
    >
      <div
        className="relative w-full max-w-sm bg-slate-950 border-2 border-purple-800/70 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-slate-100 animate-scaleUp select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Visor de Cámara: Única sección central activa */}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
