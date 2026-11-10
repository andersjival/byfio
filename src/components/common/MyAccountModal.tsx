import React, { useState, useEffect } from 'react';
import {
  X, User, Mail, Phone, MapPin, Calendar, Clock, PackageCheck,
  Tag, Gift, Sparkles, Navigation, ExternalLink, Check, Copy,
  ShoppingBag, Truck, CheckCircle2, ChevronRight, Printer, AlertCircle, RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCRC, formatShortDate } from '../../utils/formatters';
import { playBubblePopSound, playWaterDropSound } from '../../utils/soundEffects';
import { InteractiveMapPicker } from './InteractiveMapPicker';

interface MyAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (route: any) => void;
}

// Ubicaciones comunes de referencia en Costa Rica para el mapa
const CR_PRESETS = [
  { name: 'Tibás (Estudio by.fio)', lat: 9.9575, lng: -84.0818 },
  { name: 'San José Centro', lat: 9.9333, lng: -84.0833 },
  { name: 'Heredia Centro', lat: 10.0024, lng: -84.1165 },
  { name: 'Alajuela Centro', lat: 10.0163, lng: -84.2116 },
  { name: 'San Pedro / Montes de Oca', lat: 9.9327, lng: -84.0514 },
  { name: 'Curridabat', lat: 9.9142, lng: -84.0378 },
  { name: 'Escazú', lat: 9.9189, lng: -84.1389 },
  { name: 'Cartago Centro', lat: 9.8644, lng: -83.9194 },
];

export const MyAccountModal: React.FC<MyAccountModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const {
    currentUser,
    orders,
    setInvoiceOrder,
    updateCurrentUserData,
    setIsCartOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'promos' | 'offers'>('info');

  // Estados de datos editables del usuario
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [lat, setLat] = useState<number>(currentUser?.lat || 9.9575);
  const [lng, setLng] = useState<number>(currentUser?.lng || -84.0818);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Sincronizar estados locales cuando cambie el currentUser
  useEffect(() => {
    if (currentUser) {
      setPhone(currentUser.phone || '');
      setAddress(currentUser.address || '');
      if (typeof currentUser.lat === 'number' && typeof currentUser.lng === 'number') {
        setLat(currentUser.lat);
        setLng(currentUser.lng);
      }
    }
  }, [currentUser]);

  if (!isOpen || !currentUser) return null;

  // Filtrar pedidos del usuario actual
  const userEmail = (currentUser.email || '').toLowerCase().trim();
  const userPhone = (currentUser.phone || '').replace(/\D/g, '');
  const userName = (currentUser.name || '').toLowerCase().trim();

  const userOrders = orders.filter((o) => {
    const oEmail = (o.customerEmail || '').toLowerCase().trim();
    const oPhone = (o.customerPhone || '').replace(/\D/g, '');
    const oName = (o.customerName || '').toLowerCase().trim();

    if (userEmail && oEmail && oEmail === userEmail) return true;
    if (userPhone && oPhone && (oPhone === userPhone || oPhone.endsWith(userPhone) || userPhone.endsWith(oPhone))) return true;
    if (userName && oName && oName === userName) return true;
    return false;
  });

  // Guardar datos editables del usuario
  const handleSaveData = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    playBubblePopSound(0.4);
    updateCurrentUserData({
      phone: phone.trim(),
      address: address.trim(),
      lat,
      lng,
    });
    setIsSavedSuccess(true);
    setTimeout(() => setIsSavedSuccess(false), 3000);
  };

  // Obtener ubicación GPS del dispositivo
  const handleGetGpsLocation = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización GPS.');
      return;
    }
    setIsGpsLoading(true);
    playWaterDropSound();

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLat = Number(pos.coords.latitude.toFixed(5));
        const newLng = Number(pos.coords.longitude.toFixed(5));
        setLat(newLat);
        setLng(newLng);
        setIsGpsLoading(false);
        playBubblePopSound(0.4);

        // Si la dirección de texto está vacía, sugerir una referencia
        if (!address.trim()) {
          setAddress(`Ubicación GPS fijada en mapa (${newLat}, ${newLng})`);
        }
      },
      (err) => {
        console.warn('GPS Error:', err);
        setIsGpsLoading(false);
        alert('No pudimos acceder a tu ubicación GPS. Puedes mover el pin o seleccionar una zona en el selector.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Copiar código promocional
  const handleCopyCode = (code: string) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      playBubblePopSound(0.3);
      setTimeout(() => setCopiedCode(null), 2500);
    } catch {}
  };

  // Formato legible de fecha y hora de registro
  const formatRegistrationDate = (dateStr?: string) => {
    if (!dateStr) return 'Miembro registrado de by.fio';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('es-CR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  // URL del mapa OpenStreetMap embed
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${(lng - 0.007).toFixed(5)}%2C${(lat - 0.005).toFixed(5)}%2C${(lng + 0.007).toFixed(5)}%2C${(lat + 0.005).toFixed(5)}&layer=mapnik&marker=${lat.toFixed(5)}%2C${lng.toFixed(5)}`;

  // URL externa de Google Maps
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Panel Mi Cuenta by.fio"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-[32px] shadow-2xl border border-white/90 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Encabezado del Perfil "Mi Cuenta" */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-100/90 via-pink-100/70 to-purple-50 border-b border-fio-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-fio-pink text-white flex items-center justify-center font-bubble font-black text-lg shadow-clayBtn shrink-0">
              {(currentUser.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-bubble font-bold text-lg sm:text-xl text-slate-800 truncate">
                  {currentUser.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-fio-pink text-white text-[10px] font-bold tracking-wider uppercase shadow-2xs">
                  {currentUser.role === 'admin' ? 'Administradora' : currentUser.role === 'staff' ? 'Staff' : 'Cliente Registrado'}
                </span>
              </div>
              <p className="text-xs text-slate-600 truncate mt-0.5">
                {currentUser.email || 'Cuenta de usuario by.fio'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/80 text-slate-400 hover:text-slate-700 transition-colors shadow-2xs cursor-pointer"
            aria-label="Cerrar Mi Cuenta"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Pestañas de Navegación de "Mi Cuenta" */}
        <div className="flex items-center border-b border-fio-200/80 bg-white/70 px-3 sm:px-6 overflow-x-auto [scrollbar-width:none] shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab('info');
              playWaterDropSound();
            }}
            className={`py-3 px-3 sm:px-4 text-xs font-bubble font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'info'
                ? 'border-fio-pink text-fio-pink'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Mis Datos & Envío</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('orders');
              playWaterDropSound();
            }}
            className={`py-3 px-3 sm:px-4 text-xs font-bubble font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer relative ${
              activeTab === 'orders'
                ? 'border-fio-pink text-fio-pink'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Mis Pedidos</span>
            {userOrders.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                {userOrders.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('promos');
              playWaterDropSound();
            }}
            className={`py-3 px-3 sm:px-4 text-xs font-bubble font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'promos'
                ? 'border-fio-pink text-fio-pink'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Promociones</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('offers');
              playWaterDropSound();
            }}
            className={`py-3 px-3 sm:px-4 text-xs font-bubble font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'offers'
                ? 'border-fio-pink text-fio-pink'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Ofertas</span>
          </button>
        </div>

        {/* Contenido Principal con Scroll */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: MIS DATOS Y DIRECCIÓN DE ENVÍO */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              {/* Tarjeta Informativa de Registro */}
              <div className="p-4 rounded-2xl bg-white border border-fio-200/80 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bubble font-bold text-fio-purple">
                  <Calendar className="w-4 h-4 text-fio-pink" />
                  <span>Información de tu Cuenta</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Fecha y Hora de Registro */}
                  <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Fecha y Hora de Registro:
                    </span>
                    <p className="font-bubble font-semibold text-slate-800 mt-0.5 capitalize">
                      {formatRegistrationDate(currentUser.createdAt)}
                    </p>
                  </div>

                  {/* Correo de la Cuenta */}
                  <div className="p-2.5 rounded-xl bg-pink-50/70 border border-pink-100">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Correo Electrónico:
                    </span>
                    <p className="font-semibold text-slate-800 mt-0.5 truncate">
                      {currentUser.email || 'No registrado'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Formulario de Actualización de Datos y Dirección */}
              <form onSubmit={handleSaveData} className="p-4 sm:p-5 rounded-2xl bg-white border border-fio-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bubble font-bold text-sm text-slate-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-fio-pink" />
                    <span>Datos de Envío & Contacto</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Se completan solos en el carrito
                  </span>
                </div>

                {/* Teléfono de Contacto */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Número de WhatsApp / Teléfono:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej: 8888-8888"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-fio-400 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                {/* Dirección de Envíos en Texto */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Dirección de Envíos (en texto):
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Provincia, cantón, distrito, señas exactas, color de casa..."
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-fio-400 focus:outline-none bg-slate-50/50 leading-relaxed"
                  />
                </div>

                {/* Dirección de Envío en Mapa (Marcar desde el Mapa) */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800">
                      Dirección de Envío en Mapa:
                    </label>
                    <p className="text-[10px] text-slate-500">
                      Arrastra el pin o toca en el mapa para entregas exactas de mensajería.
                    </p>
                  </div>

                  <InteractiveMapPicker
                    lat={lat}
                    lng={lng}
                    height="260px"
                    showPresets={true}
                    showGpsButton={true}
                    onChange={(coords) => {
                      setLat(coords.lat);
                      setLng(coords.lng);
                      if (coords.addressSuggestion && (!address.trim() || address.startsWith('Ubicación GPS'))) {
                        setAddress(coords.addressSuggestion);
                      }
                    }}
                  />
                </div>

                {/* Botón Guardar Cambios */}
                <div className="pt-2 flex items-center justify-between">
                  {isSavedSuccess ? (
                    <span className="text-xs font-bubble font-bold text-emerald-600 flex items-center gap-1 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>¡Tus datos de envío se guardaron correctamente!</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      Tus cambios se recordarán en tu siguiente pedido.
                    </span>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-fio-pink hover:from-purple-700 hover:to-pink-600 text-white font-bubble font-bold text-xs shadow-clayBtn active:scale-95 transition-all cursor-pointer"
                  >
                    Guardar Dirección
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: MIS PEDIDOS */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bubble font-bold text-sm text-slate-800 flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-fio-pink" />
                  <span>Historial de Pedidos ({userOrders.length})</span>
                </h3>
                <span className="text-[11px] text-slate-500">
                  Actualización en tiempo real
                </span>
              </div>

              {userOrders.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-fio-200/80 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-purple-50 text-fio-pink flex items-center justify-center mx-auto shadow-inner">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <h4 className="font-bubble font-bold text-base text-slate-800">
                    Aún no tienes pedidos registrados
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Cuando realices una compra de talleres, agendas o papelería, aquí verás el estado en vivo de tu pedido.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onNavigate) onNavigate('store');
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-fio-pink text-white text-xs font-bubble font-bold shadow-clayBtn hover:shadow-lg active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Explorar la Tienda</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userOrders.map((ord) => {
                    const isPacked = ord.orderStatus === 'packed';
                    const isDelivered = ord.orderStatus === 'delivered';
                    const isPending = ord.orderStatus === 'pending';
                    const isPicking = ord.orderStatus === 'picking' || ord.orderStatus === 'packing';

                    return (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl bg-white border border-fio-200/80 shadow-xs space-y-3 hover:border-purple-300 transition-all"
                      >
                        {/* Cabecera del Pedido */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bubble font-bold text-sm sm:text-base text-fio-900">
                                {ord.orderNumber}
                              </span>
                              {ord.deliveryMethod === 'envio' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold">
                                  <Truck className="w-3 h-3" />
                                  <span>Envío CR</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">
                                  <span>Retiro en Taller</span>
                                </span>
                              )}
                            </div>

                            {/* FECHA Y HORA DEL PEDIDO */}
                            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>Fecha y Hora: <strong>{formatShortDate(ord.createdAt)}</strong></span>
                            </p>
                          </div>

                          {/* ESTADOS DEL PEDIDO: DESTACANDO EMPACADO Y LISTO PARA ENVÍO */}
                          <div className="shrink-0">
                            {isPacked && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bubble font-bold shadow-xs animate-pulse">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Empacado y listo para envío</span>
                              </span>
                            )}
                            {isPending && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bubble font-bold">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Pendiente de alisto</span>
                              </span>
                            )}
                            {isPicking && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bubble font-bold">
                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-600" />
                                <span>En alisto y empaque</span>
                              </span>
                            )}
                            {isDelivered && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bubble font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Entregado</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Barra de Progreso Visual de Estados */}
                        <div className="py-1">
                          <div className="grid grid-cols-4 gap-1 text-center text-[9px] font-bold">
                            <span className={isPending || isPicking || isPacked || isDelivered ? 'text-fio-pink' : 'text-slate-300'}>
                              1. Recibido
                            </span>
                            <span className={isPicking || isPacked || isDelivered ? 'text-fio-pink' : 'text-slate-300'}>
                              2. Alisto
                            </span>
                            <span className={isPacked || isDelivered ? 'text-emerald-600 font-extrabold' : 'text-slate-300'}>
                              3. Empacado & Listo
                            </span>
                            <span className={isDelivered ? 'text-blue-600' : 'text-slate-300'}>
                              4. Entregado
                            </span>
                          </div>
                          <div className="relative mt-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 via-fio-pink to-emerald-500 rounded-full transition-all duration-500"
                              style={{
                                width: isDelivered ? '100%' : isPacked ? '75%' : isPicking ? '50%' : '25%',
                              }}
                            />
                          </div>
                        </div>

                        {/* Desglose de Artículos */}
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                          {ord.items.map((it) => (
                            <div key={it.id} className="flex items-center justify-between">
                              <span className="text-slate-700 truncate">
                                {it.quantity}x {it.name}
                              </span>
                              <span className="font-mono text-slate-800 font-semibold shrink-0">
                                {formatCRC(it.price * it.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Footer del Pedido: Total y Botón de Factura */}
                        <div className="flex items-center justify-between pt-1 text-xs">
                          <div className="font-bubble font-bold text-slate-800">
                            <span>Total: </span>
                            <span className="text-sm text-fio-pink">{formatCRC(ord.total)}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setInvoiceOrder(ord);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bubble font-bold transition-all cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5 text-purple-700" />
                            <span>Ver Factura PDF</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SECCIÓN DE PROMOCIONES */}
          {activeTab === 'promos' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bubble font-bold text-sm text-slate-800 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-fio-pink" />
                  <span>Promociones Activas para Clientes</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-pink-100 text-fio-pink text-[10px] font-bold">
                  Exclusivo Cuenta
                </span>
              </div>

              {/* Promo 1: 2x1 en Stickers */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-fio-pink text-white text-[10px] font-bold tracking-wider uppercase">
                    ⭐ Promoción Estrella
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Válido en Papelería</span>
                </div>
                <h4 className="font-bubble font-bold text-base text-slate-900">
                  2x1 en Planchas de Stickers Kawaii y Creativos
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Lleva 2 láminas de stickers artesanales y paga solo 1 al ingresar tu cupón al momento de cotizar o pagar.
                </p>
                <div className="flex items-center justify-between pt-1">
                  <div className="px-3 py-1.5 rounded-xl bg-white border border-pink-200 font-mono font-bold text-xs text-fio-pink tracking-wider">
                    BYFIOSTAR
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCode('BYFIOSTAR')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-fio-pink hover:bg-pink-600 text-white text-xs font-bubble font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
                  >
                    {copiedCode === 'BYFIOSTAR' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'BYFIOSTAR' ? '¡Copiado!' : 'Copiar Cupón'}</span>
                  </button>
                </div>
              </div>

              {/* Promo 2: Envío Gratis */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-amber-50 border border-purple-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold tracking-wider uppercase">
                    🚚 Envíos Todo Costa Rica
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Compras &gt; ₡25.000</span>
                </div>
                <h4 className="font-bubble font-bold text-base text-slate-900">
                  Envío Gratis por Correos de Costa Rica
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  En pedidos superiores a ₡25.000, el costo de entrega es 100% cubierto por by.fio a cualquier rincón del país.
                </p>
                <div className="flex items-center justify-between pt-1">
                  <div className="px-3 py-1.5 rounded-xl bg-white border border-purple-200 font-mono font-bold text-xs text-purple-700 tracking-wider">
                    ENVIOGRATIS
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCode('ENVIOGRATIS')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bubble font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
                  >
                    {copiedCode === 'ENVIOGRATIS' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'ENVIOGRATIS' ? '¡Copiado!' : 'Copiar Cupón'}</span>
                  </button>
                </div>
              </div>

              {/* Promo 3: Descuento en Talleres */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-pink-50 border border-amber-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold tracking-wider uppercase">
                    🎨 Talleres Creativos
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Estudio Tibás</span>
                </div>
                <h4 className="font-bubble font-bold text-base text-slate-900">
                  15% OFF en tu Primer Taller Presencial
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Aplica un 15% de descuento al inscribirte en tu primer taller de encuadernación artesanal o lettering.
                </p>
                <div className="flex items-center justify-between pt-1">
                  <div className="px-3 py-1.5 rounded-xl bg-white border border-amber-200 font-mono font-bold text-xs text-amber-700 tracking-wider">
                    TALLER15
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCode('TALLER15')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bubble font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
                  >
                    {copiedCode === 'TALLER15' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'TALLER15' ? '¡Copiado!' : 'Copiar Cupón'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SECCIÓN DE OFERTAS */}
          {activeTab === 'offers' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bubble font-bold text-sm text-slate-800 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-fio-pink" />
                  <span>Ofertas Especiales Vigentes</span>
                </h3>
                <span className="text-[11px] text-slate-500">
                  Por tiempo limitado
                </span>
              </div>

              {/* Oferta 1: Combo Agendas */}
              <div className="p-4 rounded-2xl bg-white border border-fio-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Ahorra ₡3.100
                    </span>
                    <h4 className="font-bubble font-bold text-sm text-slate-900">
                      Combo Libreta Personalizada + Pack de Stickers
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500">
                    Incluye dedicatoria personalizada con nombre y lámina holográfica.
                  </p>
                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="font-bubble font-bold text-base text-fio-pink">₡8.900</span>
                    <span className="text-xs text-slate-400 line-through">₡12.000</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onNavigate) onNavigate('store');
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bubble font-bold transition-all shrink-0 cursor-pointer"
                >
                  Ver en Tienda
                </button>
              </div>

              {/* Oferta 2: Kit Libros de Vacunas */}
              <div className="p-4 rounded-2xl bg-white border border-fio-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-pink-100 text-fio-pink text-[10px] font-bold">
                      2x Especial
                    </span>
                    <h4 className="font-bubble font-bold text-sm text-slate-900">
                      Pack Dúo Libros de Vacunas Pediátricos
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500">
                    Tapa dura laminada contra agua y libreta de control pediátrico.
                  </p>
                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="font-bubble font-bold text-base text-fio-pink">₡15.000</span>
                    <span className="text-xs text-slate-400 line-through">₡19.000</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onNavigate) onNavigate('catalogo');
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bubble font-bold transition-all shrink-0 cursor-pointer"
                >
                  Ver en Catálogo
                </button>
              </div>

              {/* Oferta 3: Preventa Taller */}
              <div className="p-4 rounded-2xl bg-white border border-fio-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                      Preventa Cupos Limitados
                    </span>
                    <h4 className="font-bubble font-bold text-sm text-slate-900">
                      Taller Presencial de Encuadernación Copta en Tibás
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500">
                    Incluye todas las herramientas, papeles importados y coffee break artesanal.
                  </p>
                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="font-bubble font-bold text-base text-fio-pink">₡28.000</span>
                    <span className="text-xs text-slate-400 line-through">₡35.000</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onNavigate) onNavigate('workshops');
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bubble font-bold transition-all shrink-0 cursor-pointer"
                >
                  Ver Taller
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer del Modal */}
        <div className="p-3.5 sm:p-4 bg-white/80 border-t border-fio-200/80 flex items-center justify-between shrink-0 text-xs">
          <span className="text-slate-400 text-[11px]">
            Cuenta activa by.fio • Tibás, San José
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl neu-btn text-slate-700 font-bubble font-bold text-xs cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
