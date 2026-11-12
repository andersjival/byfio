import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin, Navigation, RefreshCw, ExternalLink, Sparkles,
  Search, Maximize2, Minimize2, X, Check
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

interface MapboxSuggestion {
  id: string;
  place_name: string;
  text: string;
  center: [number, number]; // [lng, lat]
  context?: Array<{ id: string; text: string }>;
}

export const InteractiveMapPicker: React.FC<InteractiveMapPickerProps> = ({
  lat,
  lng,
  onChange,
  height = '320px',
  showGpsButton = true,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [addressPreview, setAddressPreview] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Búsqueda y Autocompletado con Mapbox
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<MapboxSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const mapboxToken = (import.meta as any).env?.VITE_MAPBOX_TOKEN || '';
  const lastGeocodeTimeRef = useRef<number>(0);

  // Mantener referencia estable al callback onChange
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Cerrar sugerencias al hacer clic fuera del buscador
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Crear icono SVG estilizado de by.fio con pin arrastrable
  const createPinIcon = useCallback(() => {
    return L.divIcon({
      className: 'byfio-custom-map-pin',
      html: `
        <div style="position: relative; width: 40px; height: 50px; display: flex; flex-direction: column; align-items: center; cursor: grab;">
          <div style="
            width: 38px;
            height: 38px;
            background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%);
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 16px rgba(236,72,153,0.6), 0 2px 4px rgba(0,0,0,0.2);
            border: 2.5px solid #ffffff;
            transition: transform 0.2s ease;
          ">
            <span style="transform: rotate(45deg); color: #FFF07C; font-size: 16px; line-height: 1; text-shadow: 0 1px 2px rgba(0,0,0,0.4);">⭐</span>
          </div>
          <div style="
            width: 14px;
            height: 5px;
            background: rgba(15, 23, 42, 0.4);
            border-radius: 50%;
            margin-top: 3px;
            filter: blur(1px);
          "></div>
        </div>
      `,
      iconSize: [40, 50],
      iconAnchor: [20, 48],
      popupAnchor: [0, -48],
    });
  }, []);

  // Geocodificación Inversa Profesional con Mapbox v5
  const reverseGeocode = useCallback(async (targetLat: number, targetLng: number) => {
    const now = Date.now();
    if (now - lastGeocodeTimeRef.current < 600) return;
    lastGeocodeTimeRef.current = now;

    try {
      setIsGeocoding(true);
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${targetLng},${targetLat}.json?access_token=${mapboxToken}&country=cr&types=address,neighborhood,locality,place,poi&language=es`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Geocoding error');
      const data = await res.json();

      if (data && data.features && data.features.length > 0) {
        const bestFeature = data.features[0];
        const formatted = bestFeature.place_name || bestFeature.text;
        setAddressPreview(formatted);
        onChangeRef.current({ lat: targetLat, lng: targetLng, addressSuggestion: formatted });
      } else {
        onChangeRef.current({ lat: targetLat, lng: targetLng });
      }
    } catch {
      onChangeRef.current({ lat: targetLat, lng: targetLng });
    } finally {
      setIsGeocoding(false);
    }
  }, [mapboxToken]);

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

  // Inicializar mapa de Leaflet con Tiles de Mapbox HD Streets
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialLat = Number.isFinite(lat) && lat !== 0 ? lat : 9.9984; // Heredia / GAM por defecto
    const initialLng = Number.isFinite(lng) && lng !== 0 ? lng : -84.1165;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 16,
      zoomControl: true,
      scrollWheelZoom: 'center',
      attributionControl: false,
    });

    // Capa de tiles: Mapbox Streets v12 en Alta Definición Retina (@2x) con fallback a OSM
    const mapboxTileLayer = mapboxToken
      ? L.tileLayer(
          `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/512/{z}/{x}/{y}@2x?access_token=${mapboxToken}`,
          {
            maxZoom: 20,
            tileSize: 512,
            zoomOffset: -1,
            attribution: '© <a href="https://www.mapbox.com/">Mapbox</a> © <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
          }
        )
      : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors',
        });

    // Fallback a OpenStreetMap si la conexión de Mapbox fallara
    mapboxTileLayer.on('tileerror', () => {
      console.warn('Mapbox tile error, fallback to OSM');
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);
    });

    mapboxTileLayer.addTo(map);

    // Marcador interactivo by.fio con pin arrastrable
    const marker = L.marker([initialLat, initialLng], {
      icon: createPinIcon(),
      draggable: true,
      autoPan: true,
      title: 'Arrastra este pin para fijar tu ubicación exacta',
    }).addTo(map);

    marker.bindPopup(
      `<div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; text-align: center; padding: 2px;">
        <strong style="color: #7C3AED; display: block; font-size: 12px; margin-bottom: 2px;">📍 Pin de Entrega by.fio</strong>
        <span>Mueve el pin o toca el mapa para fijar tu ubicación exacta de entrega.</span>
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
  }, [createPinIcon, mapboxToken]);

  // Sincronizar posición del pin si cambian las coordenadas externamente
  useEffect(() => {
    if (!markerRef.current || !mapInstanceRef.current) return;
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || (lat === 0 && lng === 0)) return;
    const currentPos = markerRef.current.getLatLng();
    if (Math.abs(currentPos.lat - lat) > 0.0001 || Math.abs(currentPos.lng - lng) > 0.0001) {
      markerRef.current.setLatLng([lat, lng]);
      mapInstanceRef.current.panTo([lat, lng], { animate: true, duration: 0.4 });
    }
  }, [lat, lng]);

  // Redimensionar tiles cuando se amplía el mapa
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 220);
    return () => clearTimeout(timer);
  }, [isExpanded]);

  // Buscar lugares en Costa Rica con Mapbox Geocoding v5
  const fetchMapboxSuggestions = useCallback(async (query: string) => {
    const cleanQuery = query.trim();
    if (!cleanQuery || cleanQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      // Bounding box Costa Rica: [-85.95, 8.03, -82.55, 11.22]
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(cleanQuery)}.json?access_token=${mapboxToken}&country=cr&bbox=-85.95,8.03,-82.55,11.22&types=poi,address,neighborhood,locality,place&language=es&limit=6`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();

      if (data && data.features && data.features.length > 0) {
        setSuggestions(data.features);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setSearchError('No encontramos coincidencias exactas en Costa Rica. Puedes arrastrar el PIN en el mapa.');
      }
    } catch {
      setSuggestions([]);
      setSearchError('Error de conexión al buscar. Puedes mover el PIN directamente en el mapa.');
    } finally {
      setIsSearching(false);
    }
  }, [mapboxToken]);

  // Selección de una sugerencia de búsqueda
  const handleSelectSuggestion = (item: MapboxSuggestion) => {
    const [itemLng, itemLat] = item.center;
    const cleanLat = Number(itemLat.toFixed(5));
    const cleanLng = Number(itemLng.toFixed(5));

    if (markerRef.current && mapInstanceRef.current) {
      markerRef.current.setLatLng([cleanLat, cleanLng]);
      // Zoom de alta precisión (nivel 17-18)
      mapInstanceRef.current.setView([cleanLat, cleanLng], 17, { animate: true });
    }

    setSearchQuery(item.text || item.place_name);
    setAddressPreview(item.place_name);
    setShowSuggestions(false);
    playBubblePopSound();

    onChangeRef.current({
      lat: cleanLat,
      lng: cleanLng,
      addressSuggestion: item.place_name,
    });
  };

  // Enviar formulario de búsqueda manual
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelectSuggestion(suggestions[0]);
    } else {
      fetchMapboxSuggestions(searchQuery);
    }
  };

  // Botón GPS de Alta Precisión
  const handleGetGpsLocation = () => {
    if (!navigator.geolocation) {
      alert('Tu dispositivo no soporta geolocalización GPS.');
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
          const targetZoom = Math.max(mapInstanceRef.current.getZoom(), 17);
          mapInstanceRef.current.setView([newLat, newLng], targetZoom, { animate: true });
        }
        handleLocationUpdate(newLat, newLng);
      },
      (err) => {
        console.warn('GPS Error:', err);
        setIsGpsLoading(false);
        alert('No pudimos acceder a tu GPS. Asegúrate de otorgar permisos de ubicación en tu navegador o mueve el pin en el mapa.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
  const effectiveHeight = isExpanded ? '480px' : height;

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Buscador de Direcciones en Tiempo Real con Mapbox */}
      <div ref={searchContainerRef} className="relative z-20">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar barrio, cantón, comercio o calle en Costa Rica..."
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                if (val.trim().length >= 2) {
                  fetchMapboxSuggestions(val);
                } else {
                  setSuggestions([]);
                  setShowSuggestions(false);
                }
              }}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-purple-200/80 text-xs text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fio-purple/40 shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fio-pink text-white text-xs font-bubble font-bold disabled:opacity-50 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
          >
            {isSearching ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        {/* Lista Desplegable de Sugerencias en Tiempo Real */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-purple-200 overflow-hidden z-50 animate-fadeIn divide-y divide-purple-100/60 max-h-60 overflow-y-auto">
            {suggestions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className="w-full text-left px-3.5 py-2.5 hover:bg-purple-50/80 transition-colors flex items-start gap-2.5 text-xs group cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-fio-pink mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                <div className="flex-1 min-w-0">
                  <div className="font-bubble font-bold text-slate-800 truncate">
                    {item.text}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {item.place_name}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {searchError && (
          <p className="text-[10px] text-rose-500 font-sans mt-1 ml-1 leading-tight">
            {searchError}
          </p>
        )}
      </div>

      {/* Barra de Controles: Pin en Vivo, Botón GPS, Ampliar y Maps */}
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

      {/* Contenedor del Mapa Interactivo con Mapbox */}
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
              Identificando dirección...
            </span>
          )}
        </div>

        {/* Banner Informativo Táctil */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl text-[10px] font-bubble font-semibold text-slate-700 shadow-sm border border-slate-200 pointer-events-none z-10 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span className="hidden sm:inline">Arrastra la estrella o toca para fijar tu entrega</span>
          <span className="sm:hidden">Toca o mueve la estrella</span>
        </div>
      </div>

      {/* Zona o Dirección Detectada por el Pin */}
      {addressPreview && (
        <div className="p-2.5 rounded-xl bg-purple-50/80 border border-purple-200/90 text-[11px] text-purple-900 flex items-start gap-2 shadow-2xs">
          <MapPin className="w-3.5 h-3.5 text-fio-pink mt-0.5 shrink-0" />
          <div className="leading-tight flex-1">
            <span className="font-bold text-slate-800">Dirección fijada en el mapa: </span>
            <span className="text-slate-700">{addressPreview}</span>
          </div>
          <span className="text-[10px] font-bubble font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200/60 shrink-0 flex items-center gap-0.5">
            <Check className="w-3 h-3" />
            <span>Sincronizada</span>
          </span>
        </div>
      )}
    </div>
  );
};
