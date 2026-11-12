import { AdminAccountView } from './AdminAccountView';
import { MyAccountWaitlistBanner } from './MyAccountWaitlistBanner';
import { LayawayOrderCard } from './LayawayOrderCard';
import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, Clock, PackageCheck,
  Tag, Gift, Sparkles, Navigation, ExternalLink, Check, Copy,
  ShoppingBag, Truck, CheckCircle2, ChevronRight, Printer, RefreshCw,
  ArrowLeft, LogOut, ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppRoute, AdminTabType } from '../../types';
import { InteractiveMapPicker } from '../common/InteractiveMapPicker';
import { formatCRC, formatShortDate } from '../../utils/formatters';
import { isLayawaySaleOrder } from '../../utils/layaway';
import { playBubblePopSound, playWaterDropSound } from '../../utils/soundEffects';

interface MyAccountPageProps {
  onNavigate: (route: AppRoute, targetTab?: AdminTabType, wsId?: string) => void;
  onOpenLogin?: (mode?: 'login' | 'register') => void;
}

// Ubicaciones comunes de referencia en Costa Rica para el mapa de entregas
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

export const MyAccountPage: React.FC<MyAccountPageProps> = ({
  onNavigate,
  onOpenLogin,
}) => {
  const {
    currentUser,
    orders,
    setInvoiceOrder,
    updateCurrentUserData,
    logoutUser,
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

  // Sincronizar datos locales cuando cambie el currentUser
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

  // Si no hay usuario autenticado, renderizar portal de autenticación / bienvenida
  if (!currentUser) {
    return (
      <div className="w-full max-w-2xl mx-auto py-10 sm:py-16 px-4 animate-fadeIn">
        <div className="bg-white/95 rounded-[32px] p-6 sm:p-10 border border-purple-200/90 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-purple-500 via-pink-400 to-fio-pink text-white flex items-center justify-center mx-auto shadow-clayBtn">
            <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>

          <div className="space-y-2">
            <h2 className="font-bubble font-black text-2xl sm:text-3xl text-slate-900">
              Mi Cuenta by.fio
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Inicia sesión o crea una cuenta para acceder a tu historial de pedidos en vivo, cupones exclusivos y guardar tu dirección exacta de entrega en el mapa.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                playBubblePopSound(0.3);
                if (onOpenLogin) onOpenLogin('login');
                else onNavigate('login');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-fio-pink hover:from-purple-700 hover:to-pink-600 text-white font-bubble font-bold text-sm shadow-clayBtn active:scale-95 transition-all cursor-pointer"
            >
              Iniciar Sesión
            </button>

            <button
              type="button"
              onClick={() => {
                playBubblePopSound(0.3);
                if (onOpenLogin) onOpenLogin('register');
                else onNavigate('login');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl neu-btn bg-[#F1F2F6] text-slate-800 font-bubble font-bold text-sm border border-slate-200 shadow-neuBtn hover:bg-pink-50 transition-all active:scale-95 cursor-pointer"
            >
              Crear Cuenta
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onNavigate('store')}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-fio-pink transition-colors font-bubble cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continuar explorando la tienda</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtrar pedidos del usuario actual
  const userEmail = (currentUser.email || '').toLowerCase().trim();
  const userPhone = (currentUser.phone || '').replace(/\D/g, '');
  const userName = (currentUser.name || '').toLowerCase().trim();

  const userOrders = orders.filter((o) => {
    if (isLayawaySaleOrder(o)) return false;
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

  const formatCreationDateOnly = (dateStr?: string) => {
    if (!dateStr) return 'Viernes, 30 de octubre de 2026';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const str = d.toLocaleDateString('es-CR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return str.charAt(0).toUpperCase() + str.slice(1);
    } catch {
      return dateStr;
    }
  };

  const formatCreationTimeOnly = (dateStr?: string) => {
    if (!dateStr) return '10:00 AM';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '10:00 AM';
      return d.toLocaleTimeString('es-CR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return '10:00 AM';
    }
  };

  // Detección exclusiva del usuario de ALISTO (perfil operativo creado por el administrador)
  const isAlistoUser = Boolean(
    currentUser && (
      currentUser.role === 'staff' ||
      currentUser.id === 'prof-alisto' ||
      currentUser.name?.toUpperCase().includes('ALISTO')
    )
  );

  // Si el usuario es de ALISTO, mostrar ÚNICAMENTE nombre, leyenda "Creado por Administrador", fecha y hora de creación.
  // Cero pestañas de pedidos, promociones, ofertas ni datos de envío.
  if (isAlistoUser) {
    const creationIso = currentUser.createdAt || '2026-10-30T10:00:00-06:00';
    return (
      <div className="w-full max-w-xl mx-auto space-y-5 pb-12 animate-fadeIn">
        {/* Botón de Retorno y Cerrar Sesión */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              playWaterDropSound();
              onNavigate('admin', 'orders');
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white hover:bg-pink-50 text-slate-700 hover:text-fio-pink border border-slate-200/90 shadow-2xs font-bubble font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-fio-pink" />
            <span>Ir a Cola de Pedidos</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playBubblePopSound(0.3);
              logoutUser();
              onNavigate('home');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bubble font-bold transition-all active:scale-95 cursor-pointer"
            title="Cerrar sesión de mi cuenta"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        {/* Tarjeta Exclusiva de Alisto */}
        <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-10 border border-purple-200/90 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-purple-600 via-pink-500 to-fio-pink text-white flex items-center justify-center font-bubble font-black text-3xl sm:text-4xl shadow-clayBtn mx-auto">
            {(currentUser.name || 'A').charAt(0).toUpperCase()}
          </div>

          <div className="space-y-2">
            <h1 className="font-bubble font-black text-2xl sm:text-3xl text-slate-900 tracking-wide">
              {currentUser.name}
            </h1>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-800 text-xs font-bubble font-bold shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Creado por Administrador</span>
            </div>
          </div>

          {/* Fecha y Hora de Creación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/80 to-pink-50/60 border border-purple-100 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-fio-pink" />
                <span>Fecha de Creación</span>
              </span>
              <p className="font-bubble font-bold text-sm text-slate-800 capitalize">
                {formatCreationDateOnly(creationIso)}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/80 to-pink-50/60 border border-purple-100 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-fio-purple" />
                <span>Hora de Creación</span>
              </span>
              <p className="font-bubble font-bold text-sm text-slate-800 uppercase">
                {formatCreationTimeOnly(creationIso)}
              </p>
            </div>
          </div>

          {/* Acceso Directo a Cola de Pedidos de Clientes */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                playWaterDropSound();
                onNavigate('admin', 'orders');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-fio-pink hover:from-purple-700 hover:to-pink-600 text-white font-bubble font-bold text-sm shadow-clayBtn active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Ir a Cola de Pedidos de Clientes</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si el usuario es Administrador, mostrar únicamente Datos de Contacto, Fecha/Día/Hora de creación, Correo y Teléfono.
  if (currentUser.role === 'admin' || currentUser.isMasterAdmin) {
    return (
      <AdminAccountView
        currentUser={currentUser}
        onNavigate={onNavigate}
        updateCurrentUserData={updateCurrentUserData}
        logoutUser={logoutUser}
      />
    );
  }

  // URL del mapa OpenStreetMap embed
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${(lng - 0.007).toFixed(5)}%2C${(lat - 0.005).toFixed(5)}%2C${(lng + 0.007).toFixed(5)}%2C${(lat + 0.005).toFixed(5)}&layer=mapnik&marker=${lat.toFixed(5)}%2C${lng.toFixed(5)}`;

  // URL externa de Google Maps
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 sm:space-y-6 pb-12 animate-fadeIn">
      {/* Botón de Retorno y Título Superior */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={() => {
            playWaterDropSound();
            onNavigate('store');
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white hover:bg-pink-50 text-slate-700 hover:text-fio-pink border border-slate-200/90 shadow-2xs font-bubble font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-fio-pink" />
          <span>Volver a la Tienda</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playBubblePopSound(0.3);
              logoutUser();
              onNavigate('home');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bubble font-bold transition-all active:scale-95 cursor-pointer"
            title="Cerrar sesión de mi cuenta"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Hero Card del Perfil de Usuario */}
      <div className="p-5 sm:p-8 rounded-[32px] bg-gradient-to-r from-purple-100/90 via-pink-100/70 to-purple-50 border border-white/90 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-purple-600 via-pink-500 to-fio-pink text-white flex items-center justify-center font-bubble font-black text-2xl sm:text-3xl shadow-clayBtn shrink-0">
              {(currentUser.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-bubble font-black text-xl sm:text-2xl text-slate-900">
                  {currentUser.name}
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-fio-pink text-white text-[11px] font-bold tracking-wider uppercase shadow-2xs">
                  {currentUser.role === 'staff' ? 'Staff Colaborador' : 'Cliente Registrado'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{currentUser.email || 'Cuenta activa by.fio'}</span>
              </p>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="capitalize">{formatRegistrationDate(currentUser.createdAt)}</span>
              </p>
            </div>
          </div>

          {/* Badge Informativo de Cuenta */}
          <div className="hidden lg:flex flex-col items-end gap-1.5 p-3 rounded-2xl bg-white/70 backdrop-blur-xs border border-purple-100">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-fio-purple">
              <ShieldCheck className="w-3.5 h-3.5 text-fio-pink" />
              <span>Cuenta Verificada</span>
            </span>
            <span className="text-[10px] text-slate-500">
              {userOrders.length} pedido(s) registrado(s)
            </span>
          </div>
        </div>
      </div>

      {/* Botón y Alerta en Lista de Espera de Talleres */}
      <MyAccountWaitlistBanner onNavigate={onNavigate} />

      {/* Pestañas de Navegación de la Página */}
      <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto [scrollbar-width:none]">
        <button
          type="button"
          onClick={() => {
            setActiveTab('info');
            playWaterDropSound();
          }}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bubble font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'info'
              ? 'bg-gradient-to-r from-purple-600 to-fio-pink text-white shadow-clayBtn'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Mis Datos & Envío</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('orders');
            playWaterDropSound();
          }}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bubble font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap relative ${
            activeTab === 'orders'
              ? 'bg-gradient-to-r from-purple-600 to-fio-pink text-white shadow-clayBtn'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>Mis Pedidos</span>
          {userOrders.length > 0 && (
            <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === 'orders' ? 'bg-white text-fio-purple' : 'bg-purple-100 text-purple-800'
            }`}>
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
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bubble font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'promos'
              ? 'bg-gradient-to-r from-purple-600 to-fio-pink text-white shadow-clayBtn'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Promociones</span>
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('offers');
            playWaterDropSound();
          }}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bubble font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'offers'
              ? 'bg-gradient-to-r from-purple-600 to-fio-pink text-white shadow-clayBtn'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Ofertas</span>
        </button>
      </div>

      {/* CONTENIDO DE LA PESTAÑA SELECCIONADA */}

      {/* PESTAÑA 1: MIS DATOS Y DIRECCIÓN DE ENVÍO */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Columna Izquierda: Formulario de Contacto y Dirección */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-fio-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bubble font-bold text-base text-slate-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-fio-pink" />
                  <span>Datos de Contacto</span>
                </h3>
                <span className="text-[11px] text-slate-400">
                  Autocompleta tus pedidos
                </span>
              </div>

              <form onSubmit={handleSaveData} className="space-y-4">
                {/* Correo Electrónico (Solo Lectura) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Correo Electrónico Registrado:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={currentUser.email || ''}
                      disabled
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs bg-slate-100/70 text-slate-600 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Teléfono / WhatsApp */}
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
                  <p className="text-[10px] text-slate-400 mt-1">
                    Se utilizará para confirmar entregas y envíos por Correos de Costa Rica.
                  </p>
                </div>

                {/* Dirección en Texto */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Dirección de Envíos (señas exactas):
                  </label>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Provincia, cantón, distrito, señas exactas, color de casa..."
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-fio-400 focus:outline-none bg-slate-50/50 leading-relaxed"
                  />
                </div>

                {/* Feedback y Botón Guardar */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  {isSavedSuccess ? (
                    <span className="text-xs font-bubble font-bold text-emerald-600 flex items-center gap-1 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>¡Tus datos se guardaron correctamente!</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">
                      Se recordará en tu próxima compra
                    </span>
                  )}

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-fio-pink hover:from-purple-700 hover:to-pink-600 text-white font-bubble font-bold text-xs shadow-clayBtn active:scale-95 transition-all cursor-pointer"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Columna Derecha: Mapa Interactivo Real con Pin Arrastrable */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-fio-200/80 shadow-sm space-y-3">
              <div className="pb-1 border-b border-slate-100">
                <h3 className="font-bubble font-bold text-base text-slate-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-fio-pink" />
                  <span>Ubicación Exacta de Entrega en el Mapa</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Arrastra el pin o toca en el mapa para ubicar tu casa o negocio con precisión milimétrica.
                </p>
              </div>

              <InteractiveMapPicker
                lat={lat}
                lng={lng}
                height="340px"
                showGpsButton={true}
                onChange={(coords) => {
                  setLat(coords.lat);
                  setLng(coords.lng);
                  if (coords.addressSuggestion) {
                    setAddress(coords.addressSuggestion);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: MIS PEDIDOS EN VIVO */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bubble font-bold text-base text-slate-800 flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-fio-pink" />
              <span>Historial de Pedidos ({userOrders.length})</span>
            </h3>
            <span className="text-xs text-slate-500">
              Sincronizado en tiempo real
            </span>
          </div>

          {userOrders.length === 0 ? (
            <div className="p-8 sm:p-12 text-center bg-white rounded-3xl border border-fio-200/80 space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-3xl bg-purple-50 text-fio-pink flex items-center justify-center mx-auto shadow-inner">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bubble font-bold text-lg text-slate-800">
                  Aún no tienes pedidos registrados
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Cuando realices una compra de talleres, agendas personalizadas o papelería, aquí verás el estado en vivo de tu alisto y envío.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('store')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-fio-pink text-white text-xs sm:text-sm font-bubble font-bold shadow-clayBtn hover:shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <span>Explorar la Tienda</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((ord) => {
                const isLayaway = ord.isLayaway || (Array.isArray(ord.items) && ord.items.some((i) => i.isLayaway));
                if (isLayaway) {
                  return (
                    <LayawayOrderCard
                      key={ord.id}
                      order={ord}
                      onPrintInvoice={setInvoiceOrder}
                    />
                  );
                }

                const isPacked = ord.orderStatus === 'packed';
                const isDelivered = ord.orderStatus === 'delivered';
                const isPending = ord.orderStatus === 'pending';
                const isPicking = ord.orderStatus === 'picking' || ord.orderStatus === 'packing';

                return (
                  <div
                    key={ord.id}
                    className="p-5 sm:p-6 rounded-3xl bg-white border border-fio-200/80 shadow-sm space-y-4 hover:border-purple-300 transition-all"
                  >
                    {/* Cabecera del Pedido */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bubble font-bold text-base sm:text-lg text-fio-900">
                            {ord.orderNumber}
                          </span>
                          {ord.deliveryMethod === 'envio' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold">
                              <Truck className="w-3 h-3" />
                              <span>Envío CR</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">
                              <span>Retiro en Taller</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Fecha y Hora: <strong>{formatShortDate(ord.createdAt)}</strong></span>
                        </p>
                      </div>

                      {/* Estados del Pedido */}
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

                    {/* Barra de Progreso Visual */}
                    <div className="py-2">
                      <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold">
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
                      <div className="relative mt-1.5 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 via-fio-pink to-emerald-500 rounded-full transition-all duration-500"
                          style={{
                            width: isDelivered ? '100%' : isPacked ? '75%' : isPicking ? '50%' : '25%',
                          }}
                        />
                      </div>
                    </div>

                    {/* Desglose de Artículos */}
                    <div className="p-3 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs space-y-1.5">
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

                    {/* Total y Factura */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="font-bubble font-bold text-slate-800 text-sm">
                        <span>Total: </span>
                        <span className="text-base text-fio-pink">{formatCRC(ord.total)}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setInvoiceOrder(ord)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bubble font-bold transition-all cursor-pointer"
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

      {/* PESTAÑA 3: PROMOCIONES EXCLUSIVAS */}
      {activeTab === 'promos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bubble font-bold text-base text-slate-800 flex items-center gap-2">
              <Tag className="w-5 h-5 text-fio-pink" />
              <span>Promociones Activas para Clientes</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-fio-pink text-xs font-bold">
              Exclusivo Cuenta
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Promo 1: 2x1 Stickers */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-fio-pink text-white text-[10px] font-bold tracking-wider uppercase">
                  ⭐ Promoción Estrella
                </span>
                <h4 className="font-bubble font-bold text-base text-slate-900">
                  2x1 en Stickers Kawaii
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Lleva 2 láminas de stickers artesanales y paga solo 1 al ingresar tu cupón al cotizar o pagar.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="px-3 py-1.5 rounded-xl bg-white border border-pink-200 font-mono font-bold text-xs text-fio-pink tracking-wider">
                  BYFIOSTAR
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode('BYFIOSTAR')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-fio-pink hover:bg-pink-600 text-white text-xs font-bubble font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
                >
                  {copiedCode === 'BYFIOSTAR' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'BYFIOSTAR' ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            {/* Promo 2: Envío Gratis */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-50 to-amber-50 border border-purple-200 shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold tracking-wider uppercase">
                  🚚 Envíos Todo Costa Rica
                </span>
                <h4 className="font-bubble font-bold text-base text-slate-900">
                  Envío Gratis por Correos CR
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  En pedidos superiores a ₡25.000, el costo de entrega es 100% cubierto por by.fio a cualquier rincón del país.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="px-3 py-1.5 rounded-xl bg-white border border-purple-200 font-mono font-bold text-xs text-purple-700 tracking-wider">
                  ENVIOGRATIS
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode('ENVIOGRATIS')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bubble font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
                >
                  {copiedCode === 'ENVIOGRATIS' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'ENVIOGRATIS' ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            {/* Promo 3: Descuento en Talleres */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-pink-50 border border-amber-200 shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold tracking-wider uppercase">
                  🎨 Talleres Creativos
                </span>
                <h4 className="font-bubble font-bold text-base text-slate-900">
                  15% OFF en tu Primer Taller
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Aplica un 15% de descuento al inscribirte en tu primer taller presencial de encuadernación o lettering.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="px-3 py-1.5 rounded-xl bg-white border border-amber-200 font-mono font-bold text-xs text-amber-700 tracking-wider">
                  TALLER15
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode('TALLER15')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bubble font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
                >
                  {copiedCode === 'TALLER15' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'TALLER15' ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 4: OFERTAS ESPECIALES */}
      {activeTab === 'offers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bubble font-bold text-base text-slate-800 flex items-center gap-2">
              <Gift className="w-5 h-5 text-fio-pink" />
              <span>Ofertas Especiales Vigentes</span>
            </h3>
            <span className="text-xs text-slate-500">
              Por tiempo limitado
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Oferta 1: Combo Agendas */}
            <div className="p-5 rounded-3xl bg-white border border-fio-200/80 shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Ahorra ₡3.100
                </span>
                <h4 className="font-bubble font-bold text-base text-slate-900">
                  Combo Libreta Personalizada + Stickers
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Incluye dedicatoria personalizada con nombre y lámina holográfica.
                </p>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="font-bubble font-bold text-lg text-fio-pink">₡8.900</span>
                  <span className="text-xs text-slate-400 line-through">₡12.000</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('store')}
                className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bubble font-bold transition-all cursor-pointer text-center"
              >
                Ver en Tienda
              </button>
            </div>

            {/* Oferta 2: Kit Libros de Vacunas */}
            <div className="p-5 rounded-3xl bg-white border border-fio-200/80 shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-pink-100 text-fio-pink text-[10px] font-bold">
                  2x Especial
                </span>
                <h4 className="font-bubble font-bold text-base text-slate-900">
                  Pack Dúo Libros de Vacunas Pediátricos
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tapa dura laminada contra agua y libreta de control pediátrico.
                </p>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="font-bubble font-bold text-lg text-fio-pink">₡15.000</span>
                  <span className="text-xs text-slate-400 line-through">₡19.000</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('catalogo')}
                className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bubble font-bold transition-all cursor-pointer text-center"
              >
                Ver en Catálogo
              </button>
            </div>

            {/* Oferta 3: Preventa Taller */}
            <div className="p-5 rounded-3xl bg-white border border-fio-200/80 shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  Preventa Cupos Limitados
                </span>
                <h4 className="font-bubble font-bold text-base text-slate-900">
                  Taller Presencial de Encuadernación Copta
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Incluye herramientas, papeles importados y coffee break artesanal en Tibás.
                </p>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="font-bubble font-bold text-lg text-fio-pink">₡28.000</span>
                  <span className="text-xs text-slate-400 line-through">₡35.000</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('workshops')}
                className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bubble font-bold transition-all cursor-pointer text-center"
              >
                Ver Taller
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
