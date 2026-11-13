import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Smartphone, Monitor, Download, Share2, Copy, Check,
  ExternalLink, QrCode, ShieldCheck, Users,
  Boxes, Receipt, Calendar, ArrowLeft, Vibrate, Zap,
  KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle,
  Truck, ShoppingBag, ClipboardList, Lock, Sliders, PackageCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useConfirm, useAlert } from '../../context/ConfirmContext';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import { AdminTabType } from './AdminTabs';
import { AppRoute, UserProfile, UserPermissions } from '../../types';
import { COLLABORATOR_PERMISSION_MODULES } from '../../utils/permissionModules';
import {
  isHapticVibrationEnabled,
  setHapticVibrationEnabled,
  getHapticVibrationIntensity,
  setHapticVibrationIntensity,
  triggerHapticFeedback,
  calculateHapticDuration,
  isVibrationSupported,
} from '../../utils/haptics';

interface AppsManagementSectionProps {
  onSelectAdminTab?: (tab: AdminTabType) => void;
  onNavigate?: (route: AppRoute, adminTab?: AdminTabType) => void;
  onOpenDesignModal?: () => void;
  onOpenPwaModal?: () => void;
}

export const AppsManagementSection: React.FC<AppsManagementSectionProps> = ({
  onSelectAdminTab,
  onNavigate,
  onOpenDesignModal,
  onOpenPwaModal,
}) => {
  const confirm = useConfirm();
  const showAlert = useAlert();
  const { isInstallable, isStandalone, isMobile, isIOS, isAndroid, promptInstall } = usePwaInstall();
  const {
    userProfiles,
    updateUserProfile,
    toggleUserProfileStatus,
    collaboratorInventoryEnabled,
    toggleCollaboratorInventoryEnabled,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'config' | 'admin' | 'collaborator'>('admin');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedQrApp, setSelectedQrApp] = useState<{ title: string; url: string } | null>(null);
  const [installResult, setInstallResult] = useState<string | null>(null);
  const [revealedPins, setRevealedPins] = useState<{ [id: string]: boolean }>({});
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Perfil específico de la Administradora vs Colaboradores
  const adminProfile = userProfiles.find(
    (p) => p.role === 'admin' || p.id === 'prof-admin'
  ) || userProfiles[0];

  const collaboratorProfiles = userProfiles.filter(
    (p) => p.role !== 'admin' && p.id !== 'prof-admin'
  );

  // Estados de vibración háptica
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(() => isHapticVibrationEnabled());
  const [vibrationIntensity, setVibrationIntensity] = useState<number>(() => getHapticVibrationIntensity());
  const [vibrationNotice, setVibrationNotice] = useState<string | null>(null);

  React.useEffect(() => {
    const handleHapticSync = () => {
      setVibrationEnabled(isHapticVibrationEnabled());
      setVibrationIntensity(getHapticVibrationIntensity());
    };
    window.addEventListener('byfio-haptics-changed', handleHapticSync);
    return () => window.removeEventListener('byfio-haptics-changed', handleHapticSync);
  }, []);

  const handleToggleVibration = () => {
    const next = !vibrationEnabled;
    setVibrationEnabled(next);
    setHapticVibrationEnabled(next);
    if (next) {
      triggerHapticFeedback(vibrationIntensity, true);
      setVibrationNotice(`✓ Vibración táctil activada (Nivel ${vibrationIntensity})`);
    } else {
      setVibrationNotice('✕ Vibración táctil desactivada');
    }
    setTimeout(() => setVibrationNotice(null), 3000);
  };

  const handleIntensitySelect = (level: number) => {
    setVibrationIntensity(level);
    setHapticVibrationIntensity(level);
    if (!vibrationEnabled) {
      setVibrationEnabled(true);
      setHapticVibrationEnabled(true);
    }
    triggerHapticFeedback(level, true);
    setVibrationNotice(`Nivel ${level} seleccionado (${calculateHapticDuration(level)}ms)`);
    setTimeout(() => setVibrationNotice(null), 3000);
  };

  const handleTestVibration = () => {
    triggerHapticFeedback(vibrationIntensity, true);
    const dur = calculateHapticDuration(vibrationIntensity);
    const hasVib = isVibrationSupported();
    setVibrationNotice(
      hasVib
        ? `⚡ Vibración física emitida: Nivel ${vibrationIntensity} (${dur}ms)`
        : `⚡ Vibración táctil emitida: Nivel ${vibrationIntensity} (${dur}ms) • En celulares activa el motor físico`
    );
    setTimeout(() => setVibrationNotice(null), 3000);
  };

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://byfiocr.com';

  const adminUrl = `${origin}/admin`;
  const collabPath = '/usuario/colaborador/pedidos/apps';
  const collabUrl = `${origin}${collabPath}`;

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  const shareWhatsApp = (message: string) => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await promptInstall();
      if (outcome === 'accepted') {
        setInstallResult('✓ ¡Aplicación instalada con éxito en tu dispositivo!');
      } else {
        setInstallResult('Instalación pospuesta. Puedes volver a intentarlo cuando desees.');
      }
      setTimeout(() => setInstallResult(null), 4000);
    } else {
      setInstallResult('Para instalar en esta computadora o celular: Abre el menú de tu navegador (tres puntos arriba a la derecha) y pulsa "Instalar aplicación" o "Agregar a la pantalla principal".');
      setTimeout(() => setInstallResult(null), 6000);
    }
  };

  const togglePinReveal = (id: string) => {
    setRevealedPins((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTogglePermission = (profile: UserProfile, permissionKey: keyof UserPermissions) => {
    const currentPermissions = profile.permissions || {
      orders: true,
      layaways: false,
      billing: false,
      inventory: false,
      reports: false,
      sinpe: false,
      workshops: false,
      pricing: false,
      users: false,
      customers: false,
      agenda: false,
      suppliers: false,
      sales: false,
    };

    const nextValue = !currentPermissions[permissionKey];
    const updatedPermissions = {
      ...currentPermissions,
      [permissionKey]: nextValue,
    };

    updateUserProfile(profile.id, { permissions: updatedPermissions });
    const moduleDef = COLLABORATOR_PERMISSION_MODULES.find((m) => m.key === permissionKey);
    const moduleName = moduleDef ? moduleDef.label : permissionKey;
    setSaveToast(`✓ Permiso "${moduleName}" ${nextValue ? 'activado' : 'desactivado'} para ${profile.name} (sincronizado automáticamente en Celular y PC)`);
    setTimeout(() => setSaveToast(null), 2500);
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {/* Cabecera Principal del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#200B3B] via-[#3B1161] to-[#170529] text-white shadow-md border border-purple-500/40">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fio-pink via-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-md shrink-0">
            <Smartphone className="w-6 h-6 text-fio-yellow" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bubble font-bold text-white">
                Aplicaciones PC / Celular
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-fio-pink/30 text-pink-200 border border-fio-pink/40 font-bubble font-bold">
                ★ Módulo Independiente
              </span>
            </div>
            <p className="text-xs text-purple-200/90 font-sans mt-0.5 leading-relaxed">
              Centro de aplicaciones instalables y gestión de permisos exclusivos para los celulares de tus colaboradores.
            </p>
          </div>
        </div>

        {/* Botón de Retorno */}
        {onSelectAdminTab && (
          <button
            type="button"
            onClick={() => onSelectAdminTab('hub')}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bubble font-bold border border-white/20 active:scale-95 transition-all cursor-pointer self-start sm:self-auto shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-fio-pink" />
            <span>Volver al Menú</span>
          </button>
        )}
      </div>

      {/* Selector de Pestañas / Filtro de Secciones */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80">
        <button
          type="button"
          onClick={() => setActiveTab('config')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bubble font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'config'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-purple-700 hover:bg-white/60'
          }`}
        >
          <Sliders className="w-4 h-4 text-fio-pink" />
          <span>Configuración</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('admin')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bubble font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'admin'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-purple-700 hover:bg-white/60'
          }`}
        >
          <Monitor className="w-4 h-4 text-fio-yellow" />
          <span>Aplicacion admin (PC / Celular)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('collaborator')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bubble font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'collaborator'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-purple-700 hover:bg-white/60'
          }`}
        >
          <Users className="w-4 h-4 text-pink-300" />
          <span>Aplicacion Colaborador (PC / Celular)</span>
        </button>
      </div>

      {saveToast && (
        <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bubble font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECCIÓN 1: APLICACIÓN ADMIN (PC / CELULAR)                     */}
      {/* ============================================================== */}
      {activeTab === 'admin' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-purple-200 shadow-sm space-y-5 animate-fadeIn">
          {/* Cabecera Principal de la Sección Admin */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 via-purple-600 to-fio-pink text-white flex items-center justify-center shadow-md shrink-0">
                <Monitor className="w-6 h-6 text-fio-yellow" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bubble font-bold text-base sm:text-lg text-fio-900">
                    Aplicacion admin (PC / Celular)
                  </h3>
                  <span className="text-[10px] font-bubble font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
                    Sincronización Total (PC &amp; Celular)
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  Acceso unificado para computadora de escritorio y celular. Lo que modifiques dentro de esta sección se modificará en las dos al mismo tiempo.
                </p>
              </div>
            </div>

            {/* Botones de Acción Rápida */}
            <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setSelectedQrApp({ title: 'Aplicacion admin (PC / Celular)', url: adminUrl })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bubble font-bold transition-all cursor-pointer border border-purple-200"
                title="Ver código QR para escanear con la cámara del celular"
              >
                <QrCode className="w-3.5 h-3.5 text-purple-600" />
                <span>Ver QR</span>
              </button>

              <button
                type="button"
                onClick={() => copyToClipboard('admin', adminUrl)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bubble font-bold transition-all cursor-pointer"
                title="Copiar enlace directo"
              >
                {copiedKey === 'admin' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>Copiar Enlace</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => shareWhatsApp(`Acceso al Panel de Aplicacion admin (PC / Celular) de by.fio: ${adminUrl}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bubble font-bold transition-all cursor-pointer border border-emerald-200"
                title="Enviar enlace por WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </button>

              <a
                href="/admin"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-fio-800 hover:bg-fio-900 text-white text-xs font-bubble font-bold transition-all shadow-xs"
              >
                <span>Abrir Panel</span>
                <ExternalLink className="w-3.5 h-3.5 text-fio-yellow" />
              </a>
            </div>
          </div>

          {/* Banner de Instalación Rápida PWA */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-white to-pink-50 border border-purple-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h4 className="font-bubble font-bold text-xs sm:text-sm text-fio-900 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-fio-pink" />
                <span>Instalación Directa en este Dispositivo</span>
              </h4>
              <p className="text-xs text-slate-600 font-sans">
                {isStandalone
                  ? '✓ La aplicación administradora ya está instalada y activa en este dispositivo.'
                  : 'Instala el acceso directo en tu pantalla de inicio o escritorio para abrirla como programa nativo.'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleInstallClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-fio-pink hover:from-purple-800 hover:to-pink-600 text-white font-bubble font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Download className="w-4 h-4 text-fio-yellow" />
              <span>{isStandalone ? 'Aplicación Ya Instalada' : 'Instalar en este Dispositivo'}</span>
            </button>
          </div>

          {installResult && (
            <div className="p-3 rounded-xl bg-purple-100 text-purple-950 border border-purple-300 text-xs font-sans animate-fadeIn">
              {installResult}
            </div>
          )}

          {/* Perfil de Acceso Administradora: ADMINISTRACIÓN (FIO) */}
          {adminProfile && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h4 className="font-bubble font-bold text-sm sm:text-base text-fio-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-700" />
                    <span>Perfil de Administradora Principal (PC / Celular)</span>
                  </h4>
                  <p className="text-xs text-slate-500 font-sans">
                    Perfil con control y acceso total al sistema. Se sincroniza simultáneamente en PC y Celular.
                  </p>
                </div>
              </div>

              {(() => {
                const perms = adminProfile.permissions || {
                  orders: true,
                  billing: true,
                  inventory: true,
                  reports: true,
                  sinpe: true,
                  workshops: true,
                  pricing: true,
                  users: true,
                  customers: true,
                  agenda: true,
                  suppliers: true,
                  sales: true,
                };
                const isPinRevealed = !!revealedPins[adminProfile.id];

                return (
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-50/90 via-white to-pink-50/90 border-2 border-purple-300 shadow-2xs space-y-3.5">
                    {/* Encabezado del Perfil Administradora */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 via-fio-purple to-fio-pink text-white flex items-center justify-center font-bubble font-bold text-base shadow-sm shrink-0">
                          👑
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-bubble font-bold text-base text-fio-900">
                              {adminProfile.name}
                            </h5>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bubble font-bold bg-gradient-to-r from-purple-600 to-fio-pink text-white shadow-2xs">
                              👑 Administrador Total • PC &amp; Celular
                            </span>
                            <span className="text-[10px] font-bubble font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                              {adminProfile.isActive ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-sans mt-0.5">
                            {adminProfile.note || 'Administración general, gerencia y control total del sistema'}
                          </p>
                        </div>
                      </div>

                      {/* PIN de Seguridad del Admin */}
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-purple-200 text-xs shadow-2xs">
                          <KeyRound className="w-3.5 h-3.5 text-purple-600" />
                          <span className="font-sans text-slate-500">PIN:</span>
                          <span className="font-mono font-bold text-purple-900">
                            {isPinRevealed ? adminProfile.pin : '••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePinReveal(adminProfile.id)}
                            className="text-slate-400 hover:text-slate-700 ml-1 cursor-pointer"
                            title={isPinRevealed ? 'Ocultar PIN' : 'Ver PIN'}
                          >
                            {isPinRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Módulos Habilitados para la Administradora */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bubble font-bold text-purple-900 uppercase tracking-wider">
                          Módulos y Privilegios Habilitados (Control Total en PC &amp; Celular):
                        </span>
                        <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          ✓ Acceso Maestro
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {COLLABORATOR_PERMISSION_MODULES.map((mod) => {
                          const Icon = mod.icon;
                          const isGranted = perms[mod.key] !== false;
                          return (
                            <button
                              key={mod.key}
                              type="button"
                              onClick={() => handleTogglePermission(adminProfile, mod.key)}
                              title={`${mod.label}: ${mod.desc}`}
                              className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                                isGranted
                                  ? 'bg-purple-100/90 border-purple-300 text-purple-950 font-bold shadow-2xs'
                                  : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <Icon className={`w-4 h-4 shrink-0 ${isGranted ? 'text-fio-pink' : 'text-slate-400'}`} />
                                <span className="text-xs truncate">{mod.label}</span>
                              </div>
                              <span
                                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                                  isGranted ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-500'
                                }`}
                              >
                                {isGranted ? '✓' : ''}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* SECCIÓN 2: APLICACIÓN COLABORADOR (PC / CELULAR)               */}
      {/* ============================================================== */}
      {activeTab === 'collaborator' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-amber-200/90 shadow-sm space-y-5 animate-fadeIn">
          {/* Cabecera Principal de la Sección Colaborador */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-100">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-pink-600 to-purple-700 text-white flex items-center justify-center shadow-md shrink-0">
                <Users className="w-6 h-6 text-fio-yellow" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bubble font-bold text-base sm:text-lg text-fio-900">
                    Aplicacion Colaborador (PC / Celular)
                  </h3>
                  <span className="text-[10px] font-bubble font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    1 Sola Aplicación • Módulos por Permiso
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  Alisto &amp; Pedidos e Inventario Físico son módulos gobernados por permisos. Lo que modifiques dentro de esta sección se modificará en las dos al mismo tiempo.
                </p>
              </div>
            </div>

            {/* Botones de Acción Rápida */}
            <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setSelectedQrApp({ title: 'Aplicacion Colaborador (PC / Celular)', url: collabUrl })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bubble font-bold transition-all cursor-pointer border border-amber-200"
                title="Ver código QR para escanear en taller o celular"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-600" />
                <span>Ver QR</span>
              </button>

              <button
                type="button"
                onClick={() => copyToClipboard('collab', collabUrl)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bubble font-bold transition-all cursor-pointer"
                title="Copiar enlace directo"
              >
                {copiedKey === 'collab' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>Copiar Enlace</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => shareWhatsApp(`Hola, aquí tienes tu acceso a la Aplicacion Colaborador (PC / Celular) de by.fio: ${collabUrl}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bubble font-bold transition-all cursor-pointer border border-emerald-200"
                title="Enviar enlace por WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </button>

              <a
                href={collabPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bubble font-bold transition-all shadow-xs"
              >
                <span>Abrir App</span>
                <ExternalLink className="w-3.5 h-3.5 text-fio-yellow" />
              </a>
            </div>
          </div>

          {/* Módulo de Inventario Físico (Switch Maestro para PC y Celulares) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white border border-purple-500/30 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/30 text-indigo-300 border border-indigo-400/40 flex items-center justify-center shrink-0">
                <ClipboardList className="w-5 h-5 text-fio-yellow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bubble font-bold text-xs sm:text-sm text-white">
                    Módulo: Toma de Inventario Físico por Estantes
                  </h4>
                  <span className={`text-[10px] font-bubble font-bold px-2 py-0.5 rounded-full ${
                    collaboratorInventoryEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    {collaboratorInventoryEnabled ? '✓ Habilitado (PC & Celular)' : '✗ Bloqueado'}
                  </span>
                </div>
                <p className="text-[11px] text-purple-200/80 font-sans mt-0.5">
                  Habilita o bloquea el acceso en tiempo real a la ruta <code>/inventario-app</code> para todos los colaboradores.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                toggleCollaboratorInventoryEnabled();
                const nextState = !collaboratorInventoryEnabled;
                setSaveToast(
                  nextState
                    ? '✓ Módulo de Inventario Físico habilitado simultáneamente para PC y Celular'
                    : '✓ Módulo de Inventario Físico bloqueado simultáneamente para PC y Celular'
                );
                setTimeout(() => setSaveToast(null), 3000);
              }}
              className={`px-4 py-2 rounded-xl font-bubble font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer shrink-0 ${
                collaboratorInventoryEnabled
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {collaboratorInventoryEnabled ? 'Bloquear Módulo de Inventario' : 'Habilitar Módulo de Inventario'}
            </button>
          </div>

          {/* Asignación y Modificación de Permisos por Colaborador */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <div>
                <h4 className="font-bubble font-bold text-sm sm:text-base text-fio-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  <span>Asignar Permisos de Módulos a Colaboradores (PC / Celular)</span>
                </h4>
                <p className="text-xs text-slate-500 font-sans">
                  Activa o desactiva los módulos que cada colaborador puede ver. Lo que modifiques aquí se actualizará en PC y Celular al mismo tiempo.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {collaboratorProfiles.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-bubble">
                  No hay perfiles de colaboradores registrados actualmente. Se configuran desde la sección de Perfiles de Usuario.
                </div>
              ) : (
                collaboratorProfiles.map((profile) => {
                  const perms = profile.permissions || {
                    orders: true,
                    billing: false,
                    inventory: false,
                    reports: false,
                    sinpe: false,
                    workshops: false,
                    pricing: false,
                    users: false,
                    customers: false,
                    agenda: false,
                    suppliers: false,
                    sales: false,
                  };
                  const isPinRevealed = !!revealedPins[profile.id];

                  return (
                    <div
                      key={profile.id}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 shadow-2xs space-y-3.5"
                    >
                      {/* Encabezado del Perfil */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 to-fio-pink text-white flex items-center justify-center font-bubble font-bold text-sm shrink-0">
                          {profile.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-bubble font-bold text-sm sm:text-base text-fio-900">
                              {profile.name}
                            </h5>
                            <span className={`text-[10px] font-bubble font-bold px-2 py-0.5 rounded-full ${
                              profile.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {profile.isActive ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                          {profile.note && (
                            <p className="text-xs text-slate-500 font-sans mt-0.5">
                              {profile.note}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* PIN de Seguridad */}
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs">
                          <KeyRound className="w-3.5 h-3.5 text-purple-600" />
                          <span className="font-sans text-slate-500">PIN:</span>
                          <span className="font-mono font-bold text-purple-900">
                            {isPinRevealed ? profile.pin : '••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePinReveal(profile.id)}
                            className="text-slate-400 hover:text-slate-700 ml-1 cursor-pointer"
                            title={isPinRevealed ? 'Ocultar PIN' : 'Ver PIN'}
                          >
                            {isPinRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Fila de Módulos conmutables */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bubble font-bold text-slate-500 uppercase tracking-wider">
                        Módulos Asignados (se sincronizan en PC &amp; Celular):
                      </span>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {COLLABORATOR_PERMISSION_MODULES.map((mod) => {
                          const isGranted = Boolean(perms[mod.key]);
                          const Icon = mod.icon;
                          return (
                            <button
                              key={mod.key}
                              type="button"
                              onClick={() => handleTogglePermission(profile, mod.key)}
                              title={`${mod.label}: ${mod.desc}`}
                              className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                                isGranted
                                  ? 'bg-purple-100/90 border-purple-300 text-purple-950 font-bold shadow-2xs'
                                  : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <Icon className={`w-4 h-4 shrink-0 ${isGranted ? 'text-fio-pink' : 'text-slate-400'}`} />
                                <span className="text-xs truncate">{mod.label}</span>
                              </div>
                              <span
                                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                                  isGranted ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-500'
                                }`}
                              >
                                {isGranted ? '✓' : ''}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECCIÓN 3: CONFIGURACIÓN (CENTRO DE APLICACIONES PWA)          */}
      {/* ============================================================== */}
      {activeTab === 'config' && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#200B3B] via-[#3B1161] to-[#170529] border border-purple-500/50 text-white shadow-md flex flex-col gap-4 animate-fadeIn">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fio-pink via-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-md shrink-0">
                <Smartphone className="w-6 h-6 text-fio-yellow" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bubble font-bold text-sm sm:text-base text-white">
                    Centro de Aplicaciones (PC &amp; Celular)
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
                onClick={() => {
                  if (onOpenPwaModal) {
                    onOpenPwaModal();
                  } else {
                    setActiveTab('admin');
                  }
                }}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-fio-pink to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bubble font-bold shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-fio-yellow" />
                <span>Abrir Centro de Aplicaciones</span>
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
                    Vibración Táctil al Clic (Celular y PC)
                  </span>
                  <span
                    className={`text-[10px] font-bubble font-bold px-2 py-0.5 rounded-full border ${
                      vibrationEnabled
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-white/10 text-slate-300 border-white/20'
                    }`}
                  >
                    {vibrationEnabled ? `Activa • Nivel ${vibrationIntensity}` : 'Desactivada'}
                  </span>
                </div>
                <p className="text-[11px] text-purple-200/80 font-sans mt-0.5">
                  Vibración corta y suave de {calculateHapticDuration(vibrationIntensity)}ms al hacer clic en cualquier botón o enlace.
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
                    onClick={() => handleIntensitySelect(lvl)}
                    className={`w-6 h-6 rounded-lg text-[10px] font-bubble font-bold flex items-center justify-center transition-all cursor-pointer ${
                      vibrationIntensity === lvl
                        ? 'bg-gradient-to-tr from-fio-pink to-purple-500 text-white shadow-xs scale-105'
                        : vibrationEnabled
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
                aria-checked={vibrationEnabled}
                onClick={handleToggleVibration}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-inner ${
                  vibrationEnabled ? 'bg-fio-pink' : 'bg-white/20'
                }`}
                title={vibrationEnabled ? 'Desactivar vibración' : 'Activar vibración'}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    vibrationEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>

              {/* Botón Probar */}
              <button
                type="button"
                data-haptic-test="true"
                onClick={handleTestVibration}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white font-bubble font-bold text-xs border border-purple-400/40 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                title="Probar respuesta táctil en el dispositivo"
              >
                <Zap className="w-3.5 h-3.5 text-fio-yellow" />
                <span>Probar</span>
              </button>
            </div>
          </div>

          {vibrationNotice && (
            <div className="py-1 px-3 rounded-xl bg-purple-400/20 border border-purple-400/30 text-xs font-bubble font-bold text-pink-200 flex items-center gap-2 animate-fadeIn">
              <Zap className="w-3.5 h-3.5 text-fio-yellow shrink-0 animate-bounce" />
              <span>{vibrationNotice}</span>
            </div>
          )}
        </div>
      )}

      {/* Modal Flotante de Código QR */}
      {selectedQrApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-purple-200 text-center">
            <h3 className="font-bubble font-bold text-base text-fio-900">
              {selectedQrApp.title}
            </h3>
            <p className="text-xs text-slate-500 font-sans">
              Apunta la cámara de tu celular a este código QR para abrir e instalar la aplicación inmediatamente.
            </p>

            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 inline-block shadow-inner">
              <QRCodeSVG value={selectedQrApp.url} size={200} level="H" includeMargin />
            </div>

            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedQrApp(null)}
                className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bubble font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Cerrar Código QR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
