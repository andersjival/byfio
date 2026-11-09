import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminTabType } from './AdminTabs';
import {
  QrCode, Receipt, Boxes, Landmark, GraduationCap, Vibrate, Sliders, Zap,
  ChevronRight, Star, BookOpen, Link2, CheckCircle2, ExternalLink, Share2, Tag, Users,
  BarChart3, Lock, UserCheck, Calendar, Truck, ShoppingBag, Smartphone, Save
} from 'lucide-react';

import { AppRoute, SupplierOrder } from '../../types';
import {
  isHapticVibrationEnabled,
  setHapticVibrationEnabled,
  getHapticVibrationIntensity,
  setHapticVibrationIntensity,
  triggerHapticFeedback,
  calculateHapticDuration,
  isVibrationSupported,
} from '../../utils/haptics';

interface AdminHubMenuProps {
  onSelectTab: (tab: AdminTabType) => void;
  onNavigate?: (route: AppRoute) => void;
  onOpenPwaModal?: () => void;
}

export const AdminHubMenu: React.FC<AdminHubMenuProps> = ({ onSelectTab, onNavigate, onOpenPwaModal }) => {
  const { orders, products, workshops, userProfiles, customers, hasPermission, sinpeTransactions, isModuleEnabled, toggleSuperadminModule, currentUser, agendaItems, supplierOrders } = useApp();
  const isAdminOrSuperadmin = !!currentUser && (currentUser.role === 'admin' || !!currentUser.isMasterAdmin);
  const [copiedCatalog, setCopiedCatalog] = useState(false);
  const [catalogWebCheck, setCatalogWebCheck] = useState<boolean>(isModuleEnabled('catalogo'));
  const [catalogSaveToast, setCatalogSaveToast] = useState<string | null>(null);
  const [hubVibrationEnabled, setHubVibrationEnabled] = useState<boolean>(() => isHapticVibrationEnabled());
  const [hubVibrationIntensity, setHubVibrationIntensity] = useState<number>(() => getHapticVibrationIntensity());
  const [hubVibrationNotice, setHubVibrationNotice] = useState<string | null>(null);

  useEffect(() => {
    const handleSync = () => {
      setHubVibrationEnabled(isHapticVibrationEnabled());
      setHubVibrationIntensity(getHapticVibrationIntensity());
    };
    window.addEventListener('byfio-haptics-changed', handleSync);
    return () => window.removeEventListener('byfio-haptics-changed', handleSync);
  }, []);

  const handleToggleHubVibration = () => {
    const next = !hubVibrationEnabled;
    setHubVibrationEnabled(next);
    setHapticVibrationEnabled(next);
    if (next) {
      triggerHapticFeedback(hubVibrationIntensity, true);
      setHubVibrationNotice(`✓ Vibración táctil activada (Nivel ${hubVibrationIntensity})`);
    } else {
      setHubVibrationNotice('✕ Vibración táctil desactivada');
    }
    setTimeout(() => setHubVibrationNotice(null), 2500);
  };

  const handleIntensityChangeHub = (level: number) => {
    setHubVibrationIntensity(level);
    setHapticVibrationIntensity(level);
    if (!hubVibrationEnabled) {
      setHubVibrationEnabled(true);
      setHapticVibrationEnabled(true);
    }
    triggerHapticFeedback(level, true);
    setHubVibrationNotice(`Nivel ${level} seleccionado (${calculateHapticDuration(level)}ms)`);
    setTimeout(() => setHubVibrationNotice(null), 2500);
  };

  const handleTestVibrationHub = () => {
    triggerHapticFeedback(hubVibrationIntensity, true);
    const dur = calculateHapticDuration(hubVibrationIntensity);
    const hasVib = isVibrationSupported();
    setHubVibrationNotice(
      hasVib
        ? `⚡ Vibración física emitida (Nivel ${hubVibrationIntensity} • ${dur}ms)`
        : `⚡ Vibración táctil emitida (Nivel ${hubVibrationIntensity} • ${dur}ms) • En celulares Android activa el motor físico`
    );
    setTimeout(() => setHubVibrationNotice(null), 3000);
  };

  useEffect(() => {
    setCatalogWebCheck(isModuleEnabled('catalogo'));
  }, [isModuleEnabled]);

  const handleSaveCatalogVisibility = () => {
    if (catalogWebCheck !== isModuleEnabled('catalogo')) {
      toggleSuperadminModule('catalogo');
    }
    setCatalogSaveToast(
      catalogWebCheck
        ? '✓ ¡Guardado! Catálogo activado: botón y sección visibles en la web.'
        : '✓ ¡Guardado! Catálogo desactivado: botón y sección ocultos de la web.'
    );
    setTimeout(() => setCatalogSaveToast(null), 3500);
  };

  const copyCatalogLink = () => {
    const link = `${window.location.origin}/catalogo`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedCatalog(true);
      setTimeout(() => setCopiedCatalog(false), 2000);
    });
  };

  const shareCatalogWhatsApp = () => {
    const link = `${window.location.origin}/catalogo`;
    const message = encodeURIComponent(
      `¡Hola! Te comparto el Catálogo Oficial de by.fio con toda nuestra colección de papelería bonita, agendas y artículos listos para pedir: ${link}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const pendingOrders = orders.filter(
    (o) => !(Array.isArray(o.items) && o.items.length > 0 && o.items.every((it) => it.isPicked || it.isMissing))
  );
  const criticalProducts = products.filter((p) => p.stock <= p.minStock);
  const activeProfiles = userProfiles.filter((p) => p.isActive);

  const allMenuItems = [
    {
      id: 'orders' as AdminTabType,
      title: 'Pedidos',

      icon: QrCode,
      gradient: 'from-[#A855F7] to-[#6B21A8]',
    },
    {
      id: 'billing' as AdminTabType,
      title: 'Facturación Rápida',
                        icon: Receipt,
      gradient: 'from-[#C084FC] to-[#8B5CF6]',
    },
    {
      id: 'inventory' as AdminTabType,
      title: 'Mis Productos',

      icon: Boxes,
      gradient: 'from-[#38BDF8] to-[#4338CA]',
    },
    {
      id: 'reports' as AdminTabType,
      title: 'Caja & Reportería',
                        icon: Landmark,
      gradient: 'from-[#34D399] to-[#047857]',
    },
    {
      id: 'sinpe' as AdminTabType,
      title: 'Pagos y Recepción SINPE Móvil',

      icon: Landmark,
      gradient: 'from-[#6B21A8] to-[#4C1D95]',
    },
    {
      id: 'workshops' as AdminTabType,
      title: 'Talleres & Alumnos',
                        icon: GraduationCap,
      gradient: 'from-[#EC4899] to-[#BE185D]',
    },
    {
      id: 'pricing' as AdminTabType,
      title: 'Precios & Stickers',
                        icon: Tag,
      gradient: 'from-[#F59E0B] to-[#D97706]',
    },
    {
      id: 'users' as AdminTabType,
      title: 'Perfiles de Usuarios',
                        icon: Users,
      gradient: 'from-[#8B5CF6] to-[#6D28D9]',
    },
    {
      id: 'customers' as AdminTabType,
      title: 'Directorio de Clientes',
                        icon: UserCheck,
      gradient: 'from-[#10B981] to-[#047857]',
    },
    {
      id: 'agenda' as AdminTabType,
      title: 'Agenda & Tareas',
                        icon: Calendar,
      gradient: 'from-[#D946EF] to-[#8B5CF6]',
    },
    {
      id: 'suppliers' as AdminTabType,
      title: 'Pedidos a Proveedor',
                        icon: Truck,
      gradient: 'from-[#F59E0B] to-[#B45309]',
    },
    {
      id: 'sales' as AdminTabType,
      title: 'Historial de Ventas',
                        icon: ShoppingBag,
      gradient: 'from-[#059669] to-[#047857]',
    },
    {
      id: 'catalog-view' as AdminTabType,
      title: 'Catálogo Visual & Fotos',
                        icon: BookOpen,
      gradient: 'from-[#EC4899] to-[#8B5CF6]',
    },
  ];

  const menuItems = allMenuItems.filter((item) => hasPermission(item.id));

  return (
    <div className="space-y-4">
      {/* Sección Menú Principal de Administración */}
      <div className="space-y-4">
        {/* Título Compacto de una Sola Línea */}
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-purple-100 text-fio-700">
              <Star className="w-3.5 h-3.5 fill-current" />
            </span>
            <h2 className="font-bubble font-bold text-sm sm:text-base text-fio-900">
              Menú de Administración
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-sans hidden sm:inline">
            Selecciona una sección para ingresar
          </span>
        </div>

        {/* Grid de Cajitas Compactas, Redonditas y Profesionales (Balance Simétrico 2x5) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-3.5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className="group text-left rounded-2xl p-3.5 sm:p-4 bg-[#FDFBF9] hover:bg-pink-50/40 border border-white/90 hover:border-pink-200/90 shadow-[0_4px_16px_rgba(180,160,200,0.08)] hover:shadow-[0_8px_24px_rgba(236,72,153,0.18)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 flex flex-col justify-between min-h-[105px] sm:min-h-[118px]"
              >
                {/* Icono Elegante con Gradiente */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-fio-pink group-hover:translate-x-0.5 transition-all" />
                </div>

                {/* Título de Módulo con Letras Más Grandes */}
                <div>
                  <h3 className="font-bubble font-bold text-sm sm:text-base text-fio-900 group-hover:text-fio-pink transition-colors leading-snug">
                    {item.title}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      
        {/* Tarjeta Ejecutiva del Centro de Aplicaciones PWA (PC & Celular) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#200B3B] via-[#3B1161] to-[#170529] border border-purple-500/50 text-white shadow-md flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fio-pink via-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-md shrink-0">
                <Smartphone className="w-6 h-6 text-fio-yellow" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bubble font-bold text-sm sm:text-base text-white">
                    Centro de Aplicaciones PWA (PC &amp; Celular)
                  </h3>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-fio-pink/30 text-pink-200 border border-fio-pink/40 font-bubble font-bold">
                    ★ Administradora &amp; Colaboradores
                  </span>
                </div>
                <p className="text-xs text-purple-200/90 font-sans max-w-2xl leading-relaxed">
                  Instala la plataforma en tu computadora de escritorio y en tu celular personal. Configura la vibración táctil al hacer clic y genera accesos directos para tu equipo.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto shrink-0 flex-wrap sm:flex-nowrap">
              <button
                type="button"
                onClick={onOpenPwaModal}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-fio-pink to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bubble font-bold shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-fio-yellow" />
                <span>Gestionar Aplicaciones PWA</span>
              </button>
            </div>
          </div>

          {/* Fila Directa de Configuración de Vibración Táctil en PWA */}
          <div className="p-3.5 rounded-2xl bg-black/35 border border-purple-400/30 backdrop-blur-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-purple-500/30 text-pink-300 flex items-center justify-center shrink-0 border border-purple-400/40">
                <Vibrate className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bubble font-bold text-white text-xs sm:text-sm">
                    Vibración Táctil al Clic (PWA y Web)
                  </span>
                  <span
                    className={`text-[10px] font-bubble font-bold px-2 py-0.5 rounded-full border ${
                      hubVibrationEnabled
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-white/10 text-slate-300 border-white/20'
                    }`}
                  >
                    {hubVibrationEnabled ? `Activa • Nivel ${hubVibrationIntensity}` : 'Desactivada'}
                  </span>
                </div>
                <p className="text-[11px] text-purple-200/80 font-sans mt-0.5">
                  Vibración corta y suave de {calculateHapticDuration(hubVibrationIntensity)}ms al hacer clic en cualquier botón o enlace.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap sm:flex-nowrap justify-between md:justify-end">
              {/* Botones numéricos de intensidad 1 a 10 */}
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/10 overflow-x-auto max-w-full">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleIntensityChangeHub(lvl)}
                    className={`w-6 h-6 rounded-lg text-[10px] font-bubble font-bold flex items-center justify-center transition-all cursor-pointer ${
                      hubVibrationIntensity === lvl
                        ? 'bg-gradient-to-tr from-fio-pink to-purple-500 text-white shadow-xs scale-105'
                        : hubVibrationEnabled
                        ? 'text-white/80 hover:bg-white/15'
                        : 'text-white/30'
                    }`}
                    title={`Nivel ${lvl} (${calculateHapticDuration(lvl)}ms)`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              {/* Botón Switch ON/OFF */}
              <button
                type="button"
                role="switch"
                aria-checked={hubVibrationEnabled}
                onClick={handleToggleHubVibration}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-inner ${
                  hubVibrationEnabled ? 'bg-fio-pink' : 'bg-white/20'
                }`}
                title={hubVibrationEnabled ? 'Desactivar vibración' : 'Activar vibración'}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    hubVibrationEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>

              {/* Botón Probar */}
              <button
                type="button"
                data-haptic-test="true"
                onClick={handleTestVibrationHub}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white font-bubble font-bold text-xs border border-purple-400/40 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                title="Probar respuesta táctil en el dispositivo"
              >
                <Zap className="w-3.5 h-3.5 text-fio-yellow" />
                <span>Probar</span>
              </button>
            </div>
          </div>

          {hubVibrationNotice && (
            <div className="py-1 px-3 rounded-xl bg-purple-400/20 border border-purple-400/30 text-xs font-bubble font-bold text-pink-200 flex items-center gap-2 animate-fadeIn">
              <Zap className="w-3.5 h-3.5 text-fio-yellow shrink-0 animate-bounce" />
              <span>{hubVibrationNotice}</span>
            </div>
          )}
        </div>

      {/* Sección Catálogo Comercial Online (Aparece de abajo hacia arriba) */}
      <div className="pt-2 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-white to-pink-50 border border-purple-200/80 shadow-2xs flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-fio-800 to-fio-pink text-white flex items-center justify-center shadow-xs shrink-0">
                <BookOpen className="w-5 h-5 text-fio-yellow" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bubble font-bold text-xs sm:text-sm text-fio-900">
                    Catálogo Comercial Online (Público &amp; Vista Visual)
                  </h4>
                  <span className={`text-[10px] font-bubble font-bold px-2 py-0.5 rounded-full ${
                    isModuleEnabled('catalogo')
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-100 text-rose-700 border border-rose-200'
                  }`}>
                    {isModuleEnabled('catalogo') ? '✓ Activo en la Web' : '✗ Desactivado / Oculto'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                  Controla la presencia del catálogo en la web pública o accede a la vista visual exclusiva con fotos y slider.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
              {/* Checkbox y Botón Guardar para Activar / Desactivar Catálogo en la Web */}
              <div className="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-xl border border-purple-200 shadow-2xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={catalogWebCheck}
                    onChange={(e) => setCatalogWebCheck(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 cursor-pointer accent-purple-600"
                  />
                  <span className="text-xs font-bubble font-bold text-slate-800">
                    {catalogWebCheck ? 'Visible en Web' : 'Oculto en Web'}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={handleSaveCatalogVisibility}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-fio-800 hover:bg-fio-900 text-white text-xs font-bubble font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                  title="Guardar el estado de activación o desactivación del catálogo"
                >
                  <Save className="w-3 h-3 text-fio-yellow" />
                  <span>Guardar</span>
                </button>
              </div>

              {/* Botón Nueva Vista Catálogo Visual */}
              <button
                type="button"
                onClick={() => onSelectTab('catalog-view')}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-fio-pink hover:from-purple-800 hover:to-pink-600 text-white text-xs font-bubble font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                title="Abrir vista de catálogo exclusiva con fotos y slider sin barra de info"
              >
                <BookOpen className="w-3.5 h-3.5 text-fio-yellow" />
                <span>Vista Catálogo Visual</span>
              </button>
            </div>
          </div>

          {catalogSaveToast && (
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bubble font-bold text-center animate-fadeIn flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{catalogSaveToast}</span>
            </div>
          )}

          {/* Enlaces de compartir (visibles cuando está activo en la web) */}
          {isModuleEnabled('catalogo') && (
            <div className="pt-2 border-t border-purple-100 flex items-center justify-end gap-2 flex-wrap">
              <button
                type="button"
                onClick={copyCatalogLink}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-xs active:scale-95 transition-all"
                title="Copiar link directo del catálogo online"
              >
                {copiedCatalog ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-3.5 h-3.5 text-fio-pink" />
                    <span>Copiar Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={shareCatalogWhatsApp}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold shadow-xs active:scale-95 transition-all"
                title="Compartir catálogo completo por WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Compartir por WhatsApp</span>
              </button>

              <a
                href="/catalogo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-fio-800 hover:bg-fio-900 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5 text-fio-yellow" />
                <span>Ver en la Web</span>
              </a>
            </div>
          )}
        </div>

        {/* Tarjeta de Acceso a la Propuesta Oficial para el Dueño (Solo Admin y Superadmin) */}
        {isAdminOrSuperadmin && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#2D1B4E] via-[#4A1E6D] to-[#1E1035] text-white shadow-md border border-purple-600/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-fio-pink/20 border border-fio-pink/40 flex items-center justify-center shrink-0 text-fio-yellow">
                <Star className="w-5 h-5 text-fio-yellow fill-fio-yellow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bubble font-bold text-sm text-white">
                    Propuesta Integral & Ficha Técnica Oficial (/propuesta)
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/30 text-pink-200 font-bubble font-bold">
                    ★ Documento Dueño
                  </span>
                </div>
                <p className="text-[11px] text-purple-200/80 font-sans">
                  Resumen ejecutivo de todas las características: WMS, Inventario QR, Tienda, Academia, Facturación POS y Analítica.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onNavigate) onNavigate('propuesta');
                else window.location.href = '/propuesta';
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-fio-pink to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bubble font-bold shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <span>Ver Propuesta Completa</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tarjeta de Acceso Rápido a Métricas & Rastreo de Enlaces (Solo Admin y Superadmin) */}
        {isAdminOrSuperadmin && isModuleEnabled('metricas') && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white shadow-md border border-purple-800/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shrink-0 text-fio-yellow">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bubble font-bold text-sm text-white">
                    Métricas de Visitas & Rastreo de Enlaces (/metricas)
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 font-mono flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Privado
                  </span>
                </div>
                <p className="text-[11px] text-purple-200/80 font-sans">
                  Genera links específicos, rastrea aperturas por campañas, dispositivos (PC vs Celular) y preferencias por sección.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onNavigate) onNavigate('metricas');
                else window.location.href = '/metricas';
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white text-purple-950 hover:bg-purple-50 text-xs font-bubble font-bold shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5 text-fio-purple" />
              <span>Abrir Panel de Métricas</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
