import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin, Navigation, RefreshCw, ExternalLink, Sparkles,
  Search, Maximize2, Minimize2
} from 'lucide-react';
import { playWaterDropSound, playBubblePopSound } from '../../utils/soundEffects';

export interface MapCoordinates {
  lat: number;
  lng: number;
  addressSuggestion?: string;
}

interface InteractiveMapPickerProps {
  lat: number;
  lng: number;
  onChange: (coords: MapCoordinates) => void;
  height?: string;
  showPresets?: boolean;
  showGpsButton?: boolean;
  className?: string;
}

// Zonas frecuentes de Costa Rica para salto rápido
const CR_PRESETS = [
  { name: 'Tibás (Taller by.fio)', lat: 9.9548, lng: -84.0815 },
  { name: 'San José Centro', lat: 9.9333, lng: -84.0833 },
  { name: 'Heredia Centro', lat: 9.9984, lng: -84.1165 },
  { name: 'Alajuela Centro', lat: 10.0163, lng: -84.2116 },
  { name: 'Cartago Centro', lat: 9.8644, lng: -83.9194 },
  { name: 'Escazú', lat: 9.9192, lng: -84.1397 },
  { name: 'Curridabat', lat: 9.9156, lng: -84.0354 },
  { name: 'San Pedro', lat: 9.9281, lng: -84.0507 },
  { name: 'Moravia', lat: 9.9608, lng: -84.0483 },
  { name: 'Santa Ana', lat: 9.9326, lng: -84.1825 },
];

export const InteractiveMapPicker: React.FC<InteractiveMapPickerProps> = ({
  lat,
  lng,
  onChange,
  height = '320px',
  showPresets = true,
  showGpsButton = true,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [addressPreview, setAddressPreview] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const lastGeocodeTimeRef = useRef<number>(0);

  // Mantener referencia estable al callback onChange para no provocar recreaciones del mapa
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Crear icono SVG estilizado de by.fio con pin arrastrable
  const createPinIcon = useCallback(() => {
    return L.divIcon({
      className: 'byfio-custom-map-pin',
      html: `
        <div style="position: relative; width: 38px; height: 48px; display: flex; flex-direction: column; align-items: center; cursor: grab;">
          <div style="
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #9333EA 0%, #EC4899 100%);
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px rgba(236,72,153,0.55), 0 2px 4px rgba(0,0,0,0.15);
            border: 2.5px solid #ffffff;
            transition: transform 0.2s ease;
          ">
            <span style="transform: rotate(45deg); color: #ffffff; font-size: 15px; line-height: 1; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">⭐</span>
          </div>
          <div style="
            width: 14px;
            height: 5px;
            background: rgba(15, 23, 42, 0.35);
            border-radius: 50%;
            margin-top: 3px;
            filter: blur(1px);
          "></div>
        </div>
      `,
      iconSize: [38, 48],
      iconAnchor: [19, 46],
      popupAnchor: [0, -46],
    });
  }, []);

  // Geocodificación inversa con OpenStreetMap Nominatim
  const reverseGeocode = useCallback(async (targetLat: number, targetLng: number) => {
    const now = Date.now();
    if (now - lastGeocodeTimeRef.current < 1200) return;
    lastGeocodeTimeRef.current = now;

    try {
      setIsGeocoding(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${targetLat}&lon=${targetLng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'es-CR,es' } }
      );
      if (!res.ok) throw new Error('Geocoding error');
      const data = await res.json();
      if (data && data.display_name) {
        const addr = data.address || {};
        const road = addr.road || addr.neighbourhood || addr.suburb || '';
        const city = addr.city || addr.town || addr.county || '';
        const state = addr.state || 'Costa Rica';
        const formatted = [road, city, state].filter(Boolean).join(', ');
        setAddressPreview(formatted || data.display_name);
        onChangeRef.current({ lat: targetLat, lng: targetLng, addressSuggestion: formatted || data.display_name });
      }
    } catch {
      onChangeRef.current({ lat: targetLat, lng: targetLng });
    } finally {
      setIsGeocoding(false);
    }
  }, []);

  // Manejar cambio de ubicación desde arrastre o clic
  const handleLocationUpdate = useCallback((newLat: number, newLng: number, skipGeocode = false) => {
    const cleanLat = Number(newLat.toFixed(5));
    const cleanLng = Number(newLng.toFixed(5));
    playWaterDropSound();

    if (skipGeocode) {
      onChangeRef.current({ lat: cleanLat, lng: cleanLng });
    } else {
      reverseGeocode(cleanLat, cleanLng);
    }
  }, [reverseGeocode]);

  const handleLocationUpdateRef = useRef(handleLocationUpdate);
  useEffect(() => {
    handleLocationUpdateRef.current = handleLocationUpdate;
  }, [handleLocationUpdate]);

  // Inicializar mapa de Leaflet ÚNICAMENTE al montar el componente (previene que el zoom se reinicie o encoja)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialLat = Number.isFinite(lat) && lat !== 0 ? lat : 9.9548;
    const initialLng = Number.isFinite(lng) && lng !== 0 ? lng : -84.0815;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 16,
      zoomControl: true,
      scrollWheelZoom: 'center',
    });

    // Capa de tiles oficiales de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Marcador arrastrable (Pin)
    const marker = L.marker([initialLat, initialLng], {
      icon: createPinIcon(),
      draggable: true,
      autoPan: true,
      title: 'Arrastra este pin para fijar tu ubicación exacta',
    }).addTo(map);

    marker.bindPopup(
      `<div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; text-align: center; padding: 2px;">
        <strong style="color: #9333EA; display: block; font-size: 12px; margin-bottom: 2px;">📍 Pin de Entrega by.fio</strong>
        <span>Mueve el pin o haz clic en el mapa para ubicar tu casa o negocio.</span>
      </div>`,
      { closeButton: false }
    );

    // Evento de arrastre del pin
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      handleLocationUpdateRef.current(pos.lat, pos.lng);
    });

    // Evento de clic en cualquier punto del mapa
    map.on('click', (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      handleLocationUpdateRef.current(e.latlng.lat, e.latlng.lng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, [createPinIcon]);

  // Sincronizar posición del pin si cambian las coordenadas externamente SIN alterar el zoom del usuario
  useEffect(() => {
    if (!markerRef.current || !mapInstanceRef.current) return;
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || (lat === 0 && lng === 0)) return;
    const currentPos = markerRef.current.getLatLng();
    if (Math.abs(currentPos.lat - lat) > 0.0001 || Math.abs(currentPos.lng - lng) > 0.0001) {
      markerRef.current.setLatLng([lat, lng]);
      // panTo mueve suavemente la vista conservando intacto el nivel de zoom actual del usuario
      mapInstanceRef.current.panTo([lat, lng], { animate: true, duration: 0.4 });
    }
  }, [lat, lng]);

  // Redimensionar tiles cuando el usuario amplía o reduce el tamaño del contenedor del mapa
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 220);
    return () => clearTimeout(timer);
  }, [isExpanded]);

  // Búsqueda de dirección o cantón en Costa Rica
  const handleSearchAddress = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanQuery = searchQuery.trim();
    if (!cleanQuery) return;

    setIsSearching(true);
    setSearchError(null);
    playWaterDropSound();

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanQuery)}&countrycodes=cr&limit=1&addressdetails=1`,
        { headers: { 'Accept-Language': 'es-CR,es' } }
      );
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        const newLat = Number(parseFloat(item.lat).toFixed(5));
        const newLng = Number(parseFloat(item.lon).toFixed(5));
        const suggestion = item.display_name;

        if (markerRef.current && mapInstanceRef.current) {
          markerRef.current.setLatLng([newLat, newLng]);
          const currentZoom = mapInstanceRef.current.getZoom();
          // Conserva el zoom ampliado del usuario o aumenta a 17 para ver calles con claridad
          const targetZoom = Math.max(currentZoom, 17);
          mapInstanceRef.current.setView([newLat, newLng], targetZoom, { animate: true });
        }

        setAddressPreview(suggestion);
        onChangeRef.current({ lat: newLat, lng: newLng, addressSuggestion: suggestion });
        playBubblePopSound();
      } else {
        setSearchError('No encontramos esa dirección en Costa Rica. Puedes arrastrar el PIN en el mapa.');
      }
    } catch {
      setSearchError('Error al buscar dirección. Puedes mover el PIN directamente.');
    } finally {
      setIsSearching(false);
    }
  };

  // Botón GPS: Obtener ubicación real del usuario
  const handleGetGpsLocation = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador o dispositivo no soporta geolocalización GPS.');
      return;
    }
    setIsGpsLoading(true);
    playWaterDropSound();

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLat = Number(pos.coords.latitude.toFixed(5));
        const newLng = Number(pos.coords.longitude.toFixed(5));
        setIsGpsLoading(false);
        playBubblePopSound(0.4);

        if (markerRef.current && mapInstanceRef.current) {
          markerRef.current.setLatLng([newLat, newLng]);
          const currentZoom = mapInstanceRef.current.getZoom();
          const targetZoom = Math.max(currentZoom, 16);
          mapInstanceRef.current.setView([newLat, newLng], targetZoom, { animate: true });
        }
        handleLocationUpdate(newLat, newLng);
      },
      (err) => {
        console.warn('GPS Error:', err);
        setIsGpsLoading(false);
        alert('No pudimos acceder a tu ubicación GPS. Asegúrate de permitir los permisos de ubicación o toca el mapa directamente.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
  const effectiveHeight = isExpanded ? '460px' : height;

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Barra de Búsqueda de Dirección Directa */}
      <form onSubmit={handleSearchAddress} className="flex items-center gap-1.5">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar calle, barrio o cantón en CR..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-purple-200 text-xs text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fio-purple/40"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
        <button
          type="submit"
          disabled={isSearching || !searchQuery.trim()}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-fio-pink text-white text-xs font-bubble font-bold disabled:opacity-50 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
        >
          {isSearching ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {searchError && (
        <p className="text-[10px] text-rose-500 font-sans ml-1 leading-tight">
          {searchError}
        </p>
      )}

      {/* Barra Superior con Selector GPS, Ampliar Tamaño y Enlace Exterior */}
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <MapPin className="w-4 h-4 text-fio-pink shrink-0 animate-bounce" />
          <span className="font-bubble font-bold text-slate-800 text-[11px] sm:text-xs">
            Pin Interactivo en Vivo
          </span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">
            (Toca o arrastra la estrella)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Botón para Ampliar / Reducir Tamaño del Mapa */}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bubble font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            title={isExpanded ? 'Reducir tamaño del mapa' : 'Hacer grande el mapa'}
          >
            {isExpanded ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-fio-purple" />
                <span className="hidden sm:inline">Reducir</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-fio-purple" />
                <span className="hidden sm:inline">Hacer Grande</span>
              </>
            )}
          </button>

          {showGpsButton && (
            <button
              type="button"
              onClick={handleGetGpsLocation}
              disabled={isGpsLoading}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bubble font-bold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
              title="Obtener coordenadas desde el sensor GPS de tu celular o computadora"
            >
              {isGpsLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-700" />
              ) : (
                <Navigation className="w-3.5 h-3.5 text-purple-700" />
              )}
              <span>{isGpsLoading ? 'Buscando...' : 'GPS'}</span>
            </button>
          )}

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bubble font-bold transition-all shadow-xs"
            title="Abrir coordenadas en Google Maps"
          >
            <span>Maps</span>
            <ExternalLink className="w-3 h-3 text-fio-pink" />
          </a>
        </div>
      </div>

      {/* Presets Rápidos de Costa Rica */}
      {showPresets && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
          <span className="text-[10px] text-slate-400 shrink-0 font-medium">Zonas rápidas:</span>
          {CR_PRESETS.map((p) => {
            const isSelected = Math.abs(lat - p.lat) < 0.001 && Math.abs(lng - p.lng) < 0.001;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  if (markerRef.current && mapInstanceRef.current) {
                    markerRef.current.setLatLng([p.lat, p.lng]);
                    const currentZoom = mapInstanceRef.current.getZoom();
                    // Preserva el zoom grande del usuario si ya lo había ampliado
                    const targetZoom = Math.max(currentZoom, 15);
                    mapInstanceRef.current.setView([p.lat, p.lng], targetZoom, { animate: true });
                  }
                  handleLocationUpdate(p.lat, p.lng);
                }}
                className={`text-[10px] px-2.5 py-1 rounded-xl border shrink-0 transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-fio-pink text-white border-fio-pink font-bold shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                {p.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      )}

      {/* Contenedor del Mapa Real Interactivo */}
      <div className="relative w-full rounded-2xl overflow-hidden border-2 border-fio-200 shadow-inner bg-slate-100 z-0 transition-[height] duration-300">
        <div
          ref={mapContainerRef}
          style={{ height: effectiveHeight, width: '100%' }}
          className="w-full relative z-0 transition-[height] duration-300"
        />

        {/* Coordenadas en Vivo Flotantes */}
        <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl text-[10px] font-mono text-slate-700 shadow-md border border-slate-200 flex items-center gap-2 pointer-events-none z-10">
          <span className="font-bold text-fio-purple">📍 Pin:</span>
          <span>Lat: {lat.toFixed(4)} | Lng: {lng.toFixed(4)}</span>
          {isGeocoding && (
            <span className="text-[9px] text-fio-pink font-sans animate-pulse">
              Identificando zona...
            </span>
          )}
        </div>

        {/* Banner Informativo Táctil */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl text-[10px] font-bubble font-semibold text-slate-700 shadow-sm border border-slate-200 pointer-events-none z-10 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span className="hidden sm:inline">Arrastra el pin o toca para ubicar tu casa</span>
          <span className="sm:hidden">Toca o mueve el pin</span>
        </div>
      </div>

      {/* Sugerencia de Dirección Detectada por el Mapa */}
      {addressPreview && (
        <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200/80 text-[11px] text-purple-900 flex items-start gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-fio-pink mt-0.5 shrink-0" />
          <div className="leading-tight">
            <span className="font-bold text-slate-800">Zona detectada por el pin: </span>
            <span className="text-slate-600">{addressPreview}</span>
          </div>
        </div>
      )}
    </div>
  );
};
