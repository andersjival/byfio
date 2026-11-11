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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none"
      onClick={() => onClose()}
    >
      {/* Recuadro de Escaneo con Esquinas Amarillas: Único espacio donde se visualiza la cámara */}
      <div
        className="relative w-[92%] max-w-[340px] h-44 sm:h-48 rounded-3xl border-2 border-dashed border-fio-pink shadow-[0_0_35px_rgba(236,72,153,0.4)] bg-black animate-scaleUp flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Visor de Cámara confinado estrictamente al interior del recuadro */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div id={containerId} className="w-full h-full object-cover" />
        </div>

        {/* Esquinas Guía Amarillas Puntiagudas */}
        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-fio-yellow rounded-tl-xl pointer-events-none z-10" />
        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-fio-yellow rounded-tr-xl pointer-events-none z-10" />
        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-fio-yellow rounded-bl-xl pointer-events-none z-10" />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-fio-yellow rounded-br-xl pointer-events-none z-10" />

        {/* Retículo / Punto de centrado exacto */}
        <div className="absolute w-2.5 h-2.5 rounded-full bg-fio-yellow/90 shadow-[0_0_10px_#facc15] pointer-events-none z-10" />

        {/* Línea láser de escaneo centrada exactamente al 50% */}
        <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-fio-pink to-transparent shadow-[0_0_12px_rgba(236,72,153,0.95)] animate-pulse pointer-events-none z-10" />

        {/* Loader de Inicio */}
        {isStarting && (
          <div className="absolute inset-0 rounded-3xl bg-slate-950 flex flex-col items-center justify-center gap-2 p-3 text-center z-20">
            <RefreshCw className="w-7 h-7 text-purple-400 animate-spin" />
            <p className="text-xs font-bubble text-slate-300">Conectando cámara...</p>
          </div>
        )}

        {/* Mensaje si ocurre error o permiso denegado */}
        {cameraError && (
          <div className="absolute inset-0 rounded-3xl bg-slate-950/95 flex flex-col items-center justify-center p-4 text-center gap-2 z-20">
            <AlertCircle className="w-8 h-8 text-amber-400" />
            <p className="text-xs text-amber-200 font-bubble leading-relaxed">
              {cameraError}
            </p>
          </div>
        )}
      </div>

      {/* Indicador de ayuda fuera del recuadro */}
      <span className="mt-4 text-[11px] font-mono font-bold text-fio-yellow bg-slate-950/90 px-3 py-1 rounded-full border border-fio-yellow/30 shadow-lg pointer-events-none">
        Centra el código aquí
      </span>
    </div>
  );
};
