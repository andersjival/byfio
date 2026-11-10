import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, X, CheckCircle2 } from 'lucide-react';
import { InteractiveMapPicker, MapCoordinates } from './InteractiveMapPicker';
import { playBubblePopSound } from '../../utils/soundEffects';

interface RegisterMapModalProps {
  isOpen: boolean;
  initialLat?: number | null;
  initialLng?: number | null;
  initialAddress?: string;
  onClose: () => void;
  onConfirm: (coords: MapCoordinates) => void;
}

export const RegisterMapModal: React.FC<RegisterMapModalProps> = ({
  isOpen,
  initialLat,
  initialLng,
  initialAddress,
  onClose,
  onConfirm,
}) => {
  const [coords, setCoords] = useState<MapCoordinates>({
    lat: initialLat ?? 9.9575,
    lng: initialLng ?? -84.0818,
    addressSuggestion: initialAddress || undefined,
  });

  useEffect(() => {
    if (isOpen) {
      setCoords({
        lat: initialLat ?? 9.9575,
        lng: initialLng ?? -84.0818,
        addressSuggestion: initialAddress || undefined,
      });
    }
  }, [isOpen, initialLat, initialLng, initialAddress]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleAccept = () => {
    playBubblePopSound();
    onConfirm(coords);
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-purple-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-white to-pink-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-fio-pink text-white flex items-center justify-center shadow-xs shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bubble font-bold text-sm text-slate-800 leading-tight">
                Elige tu Ubicación en el Mapa Real
              </h3>
              <p className="text-[11px] text-slate-500 font-sans leading-tight">
                Arrastra el PIN estrella o usa GPS para entregas exactas
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Cerrar mapa"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mapa Interactivo */}
        <div className="p-3 bg-slate-50 overflow-y-auto space-y-2">
          <InteractiveMapPicker
            lat={coords.lat}
            lng={coords.lng}
            height="290px"
            showPresets={true}
            showGpsButton={true}
            onChange={(newCoords) => setCoords(newCoords)}
          />

          {coords.addressSuggestion && (
            <div className="p-2.5 rounded-xl bg-purple-50/90 border border-purple-200 text-[11px] text-purple-900 flex items-start gap-2 font-sans">
              <MapPin className="w-3.5 h-3.5 text-fio-purple shrink-0 mt-0.5" />
              <div className="leading-tight">
                <span className="font-bubble font-bold">Dirección sugerida: </span>
                <span>{coords.addressSuggestion}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-purple-100 flex items-center justify-end gap-2 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-3.5 rounded-xl text-xs font-bubble font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="py-2 px-4 rounded-xl text-xs font-bubble font-bold text-white bg-gradient-to-r from-purple-600 via-fio-purple to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Aceptar Ubicación</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
