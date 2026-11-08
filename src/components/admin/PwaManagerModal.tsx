import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Smartphone, Monitor, Download, Share2, Copy, Check,
  ExternalLink, QrCode, Sparkles, ShieldCheck, Users,
  Boxes, Receipt, Calendar, X, ChevronRight, Info,
  Laptop, Tablet, CheckCircle2, MessageCircle, AlertCircle, KeyRound
} from 'lucide-react';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import { playWaterDropSound, playBubblePopSound } from '../../utils/soundEffects';

interface PwaManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAdminTab?: (tab: any) => void;
  onNavigate?: (route: any) => void;
}

interface CollaboratorApp {
  id: string;
  title: string;
  roleTag: string;
  badgeColor: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  deviceRecommend: 'mobile' | 'tablet' | 'desktop' | 'all';
  deviceRecommendText: string;
  shareMessage: string;
}

export const PwaManagerModal: React.FC<PwaManagerModalProps> = ({
  isOpen,
  onClose,
  onSelectAdminTab,
  onNavigate,
}) => {
  const { isInstallable, isStandalone, isMobile, isIOS, isAndroid, promptInstall } = usePwaInstall();
  const [activeTab, setActiveTab] = useState<'admin' | 'collaborators' | 'guide'>('admin');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedQrApp, setSelectedQrApp] = useState<{ title: string; url: string } | null>(null);
  const [installResult, setInstallResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://byfiocr.pages.dev';

  const adminPcUrl = `${origin}/admin`;
  const adminMobileUrl = `${origin}/instalar-app?app=admin`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      playWaterDropSound();
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    });
  };

  const shareViaWhatsApp = (url: string, messageText: string) => {
    playWaterDropSound();
    const encoded = encodeURIComponent(`${messageText}\n\n👉 Accede e instálalo aquí: ${url}`);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const shareViaWebShare = async (title: string, text: string, url: string, fallbackKey: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        playBubblePopSound();
        return;
      } catch (err) {
        // Usuario canceló o no soportado
      }
    }
    shareViaWhatsApp(url, text);
  };

  const handleInstallClick = async () => {
    playWaterDropSound();
    const res = await promptInstall();
    if (res === 'accepted') {
      playBubblePopSound();
      setInstallResult('¡Excelente! La aplicación se ha instalado correctamente.');
    } else if (res === 'dismissed') {
      setInstallResult('Instalación postergada. Puedes instalarla en cualquier momento.');
    } else {
      setActiveTab('guide');
    }
    setTimeout(() => setInstallResult(null), 4000);
  };

  // Aplicación ÚNICA para los Colaboradores del Negocio (los permisos definen la funcionalidad)
  const collaboratorApp = {
    id: 'colaborador',
    title: 'App Colaborador By.Fio (Única)',
    roleTag: 'Permisos Dinámicos',
    badgeColor: 'bg-gradient-to-r from-fio-pink to-purple-600 text-white',
    description: 'Aplicación única para todo el equipo de trabajo. Las herramientas y vistas disponibles se adaptan automáticamente según los permisos y el PIN que le asignes a cada colaborador en Perfiles de Usuario.',
    path: '/instalar-app?app=colaborador',
    icon: Users,
    deviceRecommendText: '📱 Celular, Tablet o Computadora',
    shareMessage: '¡Hola! Te comparto tu acceso a la App de Colaboradores de By.Fio. Abre este enlace en tu celular para descargar la app e ingresar con tu PIN personal:',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div
        className="w-full max-w-4xl max-h-[94vh] sm:max-h-[90vh] my-auto bg-[#FBF9F6] dark:bg-[#1E1B2E] rounded-3xl shadow-2xl border border-purple-200/90 dark:border-purple-800/80 flex flex-col relative overflow-hidden animate-scaleUp text-slate-800 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Fijo con Indicador de Dispositivo Activo */}
        <div className="p-4 sm:p-5 border-b border-purple-100 dark:border-purple-900/50 flex items-start justify-between gap-3 bg-gradient-to-r from-purple-50 via-white to-pink-50 dark:from-purple-950/40 dark:via-[#1E1B2E] dark:to-pink-950/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-purple-700 via-fio-purple to-fio-pink text-white flex items-center justify-center shadow-md shrink-0">
              {isMobile ? <Smartphone className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bubble font-bold text-slate-900 dark:text-white leading-tight">
                  Centro de Aplicaciones PWA (PC &amp; Celular)
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bubble font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 border border-purple-300/60">
                  {isMobile ? '📱 Estás en Celular' : '💻 Estás en Computadora'}
                </span>
                {isStandalone && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    PWA Activa
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                Instalación para la administradora y generación de accesos directos para tu equipo de colaboradores.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-purple-900/50 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all cursor-pointer shrink-0"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notificación de Instalación si ocurrió */}
        {installResult && (
          <div className="mx-4 mt-3 p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-900 dark:text-emerald-200 text-xs font-bubble font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{installResult}</span>
          </div>
        )}

        {/* Pestañas de Navegación del Centro PWA */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-purple-100 dark:border-purple-900/40 grid grid-cols-1 sm:grid-cols-3 gap-2 shrink-0 bg-slate-50/50 dark:bg-slate-900/30">
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bubble font-bold flex items-center justify-center gap-2 transition-all cursor-pointer text-center ${
              activeTab === 'admin'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-purple-600 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="truncate">👑 PWA Administración</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('collaborators')}
            className={`w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bubble font-bold flex items-center justify-center gap-2 transition-all cursor-pointer text-center ${
              activeTab === 'collaborators'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-purple-600 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span className="truncate">👥 PWA Colaboradores</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bubble font-bold flex items-center justify-center gap-2 transition-all cursor-pointer text-center ${
              activeTab === 'guide'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-purple-600 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Info className="w-4 h-4 shrink-0" />
            <span className="truncate">📲 Cómo se Instala</span>
          </button>
        </div>

        {/* Contenido con Scroll Suave */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar flex-1">
          {/* TAB 1: PWA ADMINISTRADORA (FIO) */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-100/70 to-pink-100/50 dark:from-purple-950/40 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800/60 text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                <span className="font-bubble font-bold text-fio-purple dark:text-fio-pink block mb-0.5 text-sm">
                  ★ Tu Ecosistema Administrativo en 2 Dispositivos
                </span>
                Instala la aplicación administrativa tanto en tu <strong>computadora</strong> para trabajar cómoda en el estudio, como en tu <strong>celular</strong> para supervisar pedidos, responder clientes y recibir alertas sonoras dondequiera que estés.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* TARJETA PWA 1: COMPUTADORA / PC */}
                <div
                  className={`p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#252136] border transition-all space-y-3.5 flex flex-col justify-between ${
                    !isMobile
                      ? 'border-purple-400 dark:border-purple-600 shadow-md ring-2 ring-purple-300/30'
                      : 'border-slate-200 dark:border-slate-800 shadow-xs'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
                        <Laptop className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bubble font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                        💻 Para tu Laptop / PC
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bubble font-bold text-base text-slate-900 dark:text-white">
                        PWA Versión Escritorio
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                        Funciona en ventana independiente sin pestañas del navegador, barra de título ejecutiva, diseño ancho con vista completa de inventario y pedidos.
                      </p>
                    </div>

                    <ul className="text-[11px] text-slate-600 dark:text-slate-300 font-sans space-y-1">
                      <li className="flex items-center gap-1.5">✓ Ventana flotante limpia estilo app de escritorio</li>
                      <li className="flex items-center gap-1.5">✓ Accesos directos y atajos de teclado</li>
                      <li className="flex items-center gap-1.5">✓ Ideal para Chrome, Edge, Safari y Brave</li>
                    </ul>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {/* Botón de Instalación Directa si está en PC */}
                    {!isMobile && isInstallable && (
                      <button
                        type="button"
                        onClick={handleInstallClick}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-bubble font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-fio-yellow" />
                        <span>Instalar en esta Computadora</span>
                      </button>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(adminPcUrl, 'admin-pc')}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bubble font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                      >
                        {copiedKey === 'admin-pc' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>¡Link Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-purple-600" />
                            <span>Copiar Enlace PC</span>
                          </>
                        )}
                      </button>

                      <a
                        href="/admin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 font-bubble font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer"
                        title="Abrir en pestaña nueva"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Abrir</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* TARJETA PWA 2: CELULAR / SMARTPHONE */}
                <div
                  className={`p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#252136] border transition-all space-y-3.5 flex flex-col justify-between ${
                    isMobile
                      ? 'border-fio-pink dark:border-pink-600 shadow-md ring-2 ring-pink-300/30'
                      : 'border-slate-200 dark:border-slate-800 shadow-xs'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-2xl bg-pink-50 dark:bg-pink-950/80 text-fio-pink flex items-center justify-center shadow-xs">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bubble font-bold bg-pink-100 text-fio-pink dark:bg-pink-950 dark:text-pink-300">
                        📱 Para tu Celular (Fio)
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bubble font-bold text-base text-slate-900 dark:text-white">
                        PWA Versión Móvil Táctil
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                        Convertida 100% en aplicación táctil: botones grandes de 48px para el pulgar, campanilla sonora de compras y teclado de PIN instantáneo.
                      </p>
                    </div>

                    <ul className="text-[11px] text-slate-600 dark:text-slate-300 font-sans space-y-1">
                      <li className="flex items-center gap-1.5">✓ Botones e interacciones adaptadas al pulgar</li>
                      <li className="flex items-center gap-1.5">✓ Notificaciones push con campanilla y vibración</li>
                      <li className="flex items-center gap-1.5">✓ Ícono propio en la pantalla de inicio de tu celular</li>
                    </ul>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {/* Botón de Instalación Directa si está en Celular */}
                    {isMobile && isInstallable && (
                      <button
                        type="button"
                        onClick={handleInstallClick}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-fio-pink to-purple-700 hover:from-pink-600 hover:to-purple-800 text-white font-bubble font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-fio-yellow" />
                        <span>Instalar App en este Celular</span>
                      </button>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(adminMobileUrl, 'admin-mobile')}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bubble font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                      >
                        {copiedKey === 'admin-mobile' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>¡Link Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-fio-pink" />
                            <span>Copiar Link Celular</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          shareViaWebShare(
                            'App Administradora By.Fio',
                            '¡Hola! Aquí tienes tu acceso para descargar la App Administradora de By.Fio en tu celular e ingresar con tu PIN:',
                            adminMobileUrl,
                            'share-admin-mobile'
                          )
                        }
                        className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bubble font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
                        title="Compartir por WhatsApp o enviar a mi celular"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Enviar a mi WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedQrApp({ title: 'PWA Administradora (Fio)', url: adminMobileUrl })}
                        className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/60 hover:bg-purple-200 text-purple-900 dark:text-purple-200 transition-all cursor-pointer"
                        title="Ver Código QR para escanear con la cámara del celular"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APP ÚNICA PARA COLABORADORES */}
          {activeTab === 'collaborators' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-xs text-indigo-950 dark:text-indigo-200 font-sans flex items-start gap-2.5">
                <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                <p className="leading-relaxed">
                  Esta es la <strong>única aplicación para tus colaboradores</strong>. No necesitas compartir varias apps distintas: una sola app sirve para todo tu equipo, y <strong>lo que cada colaborador puede ver o hacer se define exclusivamente mediante los permisos y el PIN</strong> que le asignes en el panel de Perfiles de Usuario.
                </p>
              </div>

              {/* Tarjeta Principal de la App Única de Colaboradores */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#252136] border-2 border-purple-200/90 dark:border-purple-800/80 shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-fio-pink via-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                      <Users className="w-6 h-6 text-fio-yellow" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bubble font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                          {collaboratorApp.title}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bubble font-bold bg-purple-100 text-purple-900 dark:bg-purple-900/60 dark:text-purple-200 border border-purple-200 dark:border-purple-700">
                          1 Sola App para todo el Equipo
                        </span>
                      </div>
                      <p className="text-xs text-purple-700 dark:text-purple-300 font-medium mt-0.5">
                        {collaboratorApp.deviceRecommendText} • Descarga guiada + PIN
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedQrApp({ title: collaboratorApp.title, url: `${origin}${collaboratorApp.path}` })}
                    className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/40 hover:bg-purple-100 dark:hover:bg-purple-900/70 text-purple-700 dark:text-purple-300 transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto text-xs font-bubble font-bold border border-purple-200/70"
                    title="Generar código QR para escanear en taller"
                  >
                    <QrCode className="w-4 h-4 text-fio-pink" />
                    <span>Ver Código QR</span>
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  {collaboratorApp.description}
                </p>

                {/* Resumen de Módulos Gobernados por Permisos */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 space-y-2">
                  <div className="text-[11px] font-bubble font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-fio-pink" />
                    <span>Módulos que se activan según los permisos del PIN:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 font-sans">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0" />
                      <span><strong>Alisto &amp; Bodega:</strong> Picking táctil (oculta finanzas)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                      <span><strong>Empaque:</strong> Rotulación y despacho</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span><strong>Mostrador POS:</strong> Búsqueda de órdenes y cobros</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <span><strong>Agenda:</strong> Citas y fechas límite del taller</span>
                    </div>
                  </div>
                </div>

                {/* Botones de Acción de la App Única */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`${origin}${collaboratorApp.path}`, 'app-colaborador')}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bubble font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 border border-slate-200 dark:border-slate-700"
                  >
                    {copiedKey === 'app-colaborador' ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>¡Enlace Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-fio-pink" />
                        <span>Copiar Enlace de la App</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => shareViaWebShare(collaboratorApp.title, collaboratorApp.shareMessage, `${origin}${collaboratorApp.path}`, 'share-colaborador')}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bubble font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
                    title="Compartir por WhatsApp con el colaborador"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Compartir por WhatsApp</span>
                  </button>

                  {onSelectAdminTab && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectAdminTab('users');
                        onClose();
                      }}
                      className="py-2.5 px-3.5 rounded-xl bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 text-purple-900 dark:text-purple-200 font-bubble font-bold text-xs flex items-center justify-center gap-1.5 border border-purple-200 dark:border-purple-800/50 cursor-pointer active:scale-95 transition-all"
                      title="Ir a configurar qué puede hacer cada colaborador"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-fio-pink" />
                      <span>Configurar Permisos &amp; PINs</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GUÍA PASO A PASO SEGÚN DISPOSITIVO */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* GUÍA ANDROID / CHROME */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#252136] border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bubble font-bold text-sm">
                    <Smartphone className="w-4 h-4" />
                    <span>Android (Google Chrome / Brave)</span>
                  </div>
                  <ol className="text-xs text-slate-600 dark:text-slate-300 font-sans space-y-2 list-decimal list-inside leading-relaxed">
                    <li>Abre el enlace en Chrome desde tu celular.</li>
                    <li>Toca los <strong>3 puntos verticales (⋮)</strong> en la esquina superior derecha.</li>
                    <li>Selecciona <strong>"Instalar aplicación"</strong> o <strong>"Añadir a la pantalla de inicio"</strong>.</li>
                    <li>¡Listo! El icono de By.Fio aparecerá como una app nativa con alertas sonoras.</li>
                  </ol>
                </div>

                {/* GUÍA IPHONE / SAFARI */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#252136] border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bubble font-bold text-sm">
                    <Smartphone className="w-4 h-4" />
                    <span>iPhone / iPad (Apple Safari)</span>
                  </div>
                  <ol className="text-xs text-slate-600 dark:text-slate-300 font-sans space-y-2 list-decimal list-inside leading-relaxed">
                    <li>Abre el enlace exclusivamente en <strong>Safari</strong>.</li>
                    <li>Toca el botón <strong>Compartir</strong> (icono de cuadrado con flecha hacia arriba ↑ en la barra inferior).</li>
                    <li>Baja en el menú y selecciona <strong>"Agregar a pantalla de inicio"</strong> (+).</li>
                    <li>Toca <strong>"Agregar"</strong> en la esquina superior derecha.</li>
                  </ol>
                </div>

                {/* GUÍA WINDOWS / PC */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#252136] border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bubble font-bold text-sm">
                    <Monitor className="w-4 h-4" />
                    <span>Computadora PC (Google Chrome o Edge)</span>
                  </div>
                  <ol className="text-xs text-slate-600 dark:text-slate-300 font-sans space-y-2 list-decimal list-inside leading-relaxed">
                    <li>Abre el sitio en tu computadora.</li>
                    <li>En la barra de direcciones (al lado de la estrella de favoritos), verás un icono de <strong>Instalar (⊕ o pantalla)</strong>.</li>
                    <li>Haz clic en <strong>Instalar</strong>. Se abrirá una ventana de escritorio independiente sin barras.</li>
                    <li>Puedes anclarla a la barra de tareas de Windows para abrirla con 1 clic.</li>
                  </ol>
                </div>

                {/* GUÍA MAC / SAFARI */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#252136] border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bubble font-bold text-sm">
                    <Laptop className="w-4 h-4" />
                    <span>Mac (macOS Sonoma / Safari)</span>
                  </div>
                  <ol className="text-xs text-slate-600 dark:text-slate-300 font-sans space-y-2 list-decimal list-inside leading-relaxed">
                    <li>Abre el sitio en Safari en tu Mac.</li>
                    <li>En el menú superior de Safari, haz clic en <strong>Archivo &gt; Agregar al Dock...</strong></li>
                    <li>Confirma el nombre y haz clic en <strong>Agregar</strong>.</li>
                    <li>Quedará como una app nativa en el Dock de macOS.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Fijo con Botón de Cierre */}
        <div className="p-3.5 sm:p-4 border-t border-purple-100 dark:border-purple-900/50 bg-slate-50/70 dark:bg-slate-900/60 flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500 font-sans hidden sm:block">
            PWA Multi-dispositivo By.Fio • Soporte para PC, Móvil y Tablet
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bubble font-bold text-xs shadow-md cursor-pointer transition-all active:scale-95"
          >
            Entendido / Cerrar
          </button>
        </div>
      </div>

      {/* MODAL SECUNDARIO: CÓDIGO QR PARA ESCANEAR EN CELULAR */}
      {selectedQrApp && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn"
          onClick={() => setSelectedQrApp(null)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-[#1E1B2E] rounded-3xl p-6 shadow-2xl border border-purple-300 text-center space-y-4 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bubble font-bold text-purple-700 dark:text-purple-300">
                Escanear con Cámara
              </span>
              <button
                onClick={() => setSelectedQrApp(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <h4 className="font-bubble font-bold text-base text-slate-900 dark:text-white">
                {selectedQrApp.title}
              </h4>
              <p className="text-xs text-slate-500 font-sans">
                Apunta la cámara de tu celular o tablet a este código para abrir la app al instante:
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl shadow-inner inline-block border border-slate-200">
              <QRCodeSVG
                value={selectedQrApp.url}
                size={180}
                level="M"
                includeMargin={true}
              />
            </div>

            <p className="text-[11px] font-mono text-purple-900 dark:text-purple-300 break-all bg-purple-50 dark:bg-purple-950/60 p-2 rounded-xl">
              {selectedQrApp.url}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => copyToClipboard(selectedQrApp.url, 'qr-modal')}
                className="flex-1 py-2 px-3 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bubble font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedKey === 'qr-modal' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'qr-modal' ? '¡Copiado!' : 'Copiar Link'}</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedQrApp(null)}
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bubble font-bold text-xs cursor-pointer"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
