import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import { AppRoute, UserProfile, UserPermissions } from '../../types';
import {
  Download, Smartphone, ShieldCheck, KeyRound, Check,
  Boxes, Receipt, Calendar, ArrowRight, Share2, Sparkles,
  CheckCircle2, AlertCircle, RefreshCw, Lock, ChevronRight, User, Users
} from 'lucide-react';
import { playBubblePopSound, playWaterDropSound } from '../../utils/soundEffects';

interface PwaInstallPageProps {
  onNavigate: (route: AppRoute) => void;
  onSelectAdminTab?: (tab: any) => void;
}

interface AppTargetConfig {
  id: string;
  title: string;
  roleTag: string;
  badgeColor: string;
  description: string;
  destinationRoute: AppRoute;
  destinationTab?: string;
  icon: React.ComponentType<{ className?: string }>;
  suggestedProfile?: string;
}

const APPS_CONFIG: Record<string, AppTargetConfig> = {
  admin: {
    id: 'admin',
    title: 'PWA Administradora By.Fio',
    roleTag: 'Administración Total',
    badgeColor: 'bg-purple-600 text-white',
    description: 'Control de ventas, alisto, inventario, caja y configuración general del negocio.',
    destinationRoute: 'admin',
    icon: ShieldCheck,
    suggestedProfile: 'Fiorella (Fio)',
  },
  colaborador: {
    id: 'colaborador',
    title: 'App Colaborador By.Fio (Única)',
    roleTag: 'Permisos Dinámicos por Perfil',
    badgeColor: 'bg-gradient-to-r from-fio-pink to-purple-600 text-white',
    description: 'Aplicación única para todo el equipo de trabajo. Al ingresar con tu PIN, se activarán automáticamente tus herramientas autorizadas (Alisto, Empaque, Mostrador POS o Agenda).',
    destinationRoute: 'pedidos-mobile',
    icon: Users,
    suggestedProfile: 'Colaborador Alisto',
  },
};

export const PwaInstallPage: React.FC<PwaInstallPageProps> = ({
  onNavigate,
  onSelectAdminTab,
}) => {
  const { loginWithPin, userProfiles, currentUser } = useApp();
  const { isInstallable, isStandalone, isIOS, isAndroid, promptInstall } = usePwaInstall();

  // Detectar la aplicación objetivo mediante query params
  const [targetKey, setTargetKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const appParam = (params.get('app') || params.get('target') || 'colaborador').toLowerCase();
      return appParam === 'admin' ? 'admin' : 'colaborador';
    }
    return 'colaborador';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const appParam = (params.get('app') || params.get('target') || 'colaborador').toLowerCase();
      setTargetKey(appParam === 'admin' ? 'admin' : 'colaborador');
    }
  }, []);

  const currentApp = APPS_CONFIG[targetKey] || APPS_CONFIG.colaborador;
  const AppIcon = currentApp?.icon || Users;

  // Si la aplicación ya está instalada y corriendo como PWA standalone, pasar de inmediato al PIN
  const [step, setStep] = useState<'install' | 'pin'>(() => (isStandalone ? 'pin' : 'install'));

  useEffect(() => {
    if (isStandalone) {
      setStep('pin');
    }
  }, [isStandalone]);

  // Estado del PIN de acceso
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [installFeedback, setInstallFeedback] = useState<string | null>(null);

  // Auto-seleccionar perfil sugerido si coincide
  useEffect(() => {
    if (userProfiles.length > 0 && !selectedProfile) {
      const match = userProfiles.find(
        (p) => p.isActive && p.name.toLowerCase().includes(currentApp.suggestedProfile?.toLowerCase() || '')
      );
      if (match) setSelectedProfile(match);
    }
  }, [userProfiles, currentApp, selectedProfile]);

  // Manejador del botón Descargar / Instalar
  const handleInstallApp = async () => {
    playWaterDropSound();
    const result = await promptInstall();
    if (result === 'accepted') {
      playBubblePopSound();
      setInstallFeedback('¡Instalación completada con éxito!');
      setTimeout(() => {
        setStep('pin');
      }, 1000);
    } else if (result === 'dismissed') {
      setInstallFeedback('Instalación cancelada. Puedes continuar ingresando tu PIN.');
      setTimeout(() => setStep('pin'), 1200);
    } else {
      // Navegador que no soporta beforeinstallprompt (ej. Safari o PWA ya lista)
      setStep('pin');
    }
  };

  // Teclado numérico táctil
  const handleKeypadPress = (digit: string) => {
    playWaterDropSound();
    if (enteredPin.length < 4) {
      const next = enteredPin + digit;
      setEnteredPin(next);
      setPinError(null);
      if (next.length === 4) {
        verifyPin(next);
      }
    }
  };

  const handleBackspace = () => {
    playWaterDropSound();
    setEnteredPin((prev) => prev.slice(0, -1));
    setPinError(null);
  };

  const handleClearPin = () => {
    playWaterDropSound();
    setEnteredPin('');
    setPinError(null);
  };

  // Verificación del PIN y redirección dinámica según permisos
  const verifyPin = (pinToTest: string) => {
    const res = loginWithPin(pinToTest, selectedProfile ? selectedProfile.name : undefined);
    if (res.success && res.user) {
      playBubblePopSound();
      setIsSuccess(true);
      const user = res.user;

      setTimeout(() => {
        if (user.role === 'admin' || user.isMasterAdmin) {
          onNavigate('admin');
        } else {
          // Colaborador: la funcionalidad la definen sus permisos
          const perms = (user.permissions || {}) as UserPermissions;
          const isAlistoOnly = perms.orders && !perms.billing && !perms.inventory && !perms.reports && !perms.agenda;

          if (isAlistoOnly) {
            onNavigate('pedidos-mobile');
          } else if (perms.orders) {
            if (onSelectAdminTab) onSelectAdminTab('orders');
            onNavigate('admin');
          } else if (perms.billing) {
            if (onSelectAdminTab) onSelectAdminTab('billing');
            onNavigate('admin');
          } else if (perms.inventory) {
            if (onSelectAdminTab) onSelectAdminTab('inventory');
            onNavigate('admin');
          } else if (perms.agenda) {
            if (onSelectAdminTab) onSelectAdminTab('agenda');
            onNavigate('admin');
          } else {
            onNavigate('admin');
          }
        }
      }, 700);
    } else {
      setPinError(res.error || 'PIN incorrecto. Intenta de nuevo.');
      setEnteredPin('');
    }
  };

  // Soporte de teclado físico (para PC o tablets con teclado)
  useEffect(() => {
    if (step !== 'pin') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeypadPress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        handleClearPin();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, enteredPin, selectedProfile]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#1a0f2e] to-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans selection:bg-purple-600 selection:text-white">
      {/* Barra Superior con Logo */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center font-bubble font-bold text-base shadow-lg shadow-purple-900/30">
            FIO
          </div>
          <div>
            <h2 className="font-bubble font-bold text-sm text-white tracking-wide">
              by.fio Talleres Creativos
            </h2>
            <p className="text-[10px] text-purple-300 font-sans">
              Portal Oficial de Instalación PWA
            </p>
          </div>
        </div>

        {isStandalone && (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bubble font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            PWA Instalada
          </span>
        )}
      </div>

      {/* Contenedor Central Adaptativo */}
      <div className="w-full max-w-md mx-auto my-auto py-4">
        {/* ==================================================================== */}
        {/* PASO 1: DESCARGAR E INSTALAR LA APLICACIÓN                            */}
        {/* ==================================================================== */}
        {step === 'install' && (
          <div className="bg-slate-900/90 backdrop-blur-xl border border-purple-800/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-center animate-scaleUp">
            {/* Ícono de la App con Aura Brillante */}
            <div className="relative inline-flex mx-auto">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl blur-md opacity-40 animate-pulse" />
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-700 via-fio-purple to-pink-600 text-white flex items-center justify-center shadow-xl border border-purple-400/40">
                <AppIcon className="w-10 h-10 text-fio-yellow" />
              </div>
            </div>

            {/* Títulos y Rol */}
            <div className="space-y-1.5">
              <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bubble font-bold ${currentApp.badgeColor}`}>
                {currentApp.roleTag}
              </span>
              <h1 className="text-xl sm:text-2xl font-bubble font-bold text-white tracking-tight">
                {currentApp.title}
              </h1>
              <p className="text-xs text-slate-300 font-sans max-w-xs mx-auto leading-relaxed">
                {currentApp.description}
              </p>
            </div>

            {/* Mensaje de feedback de instalación si ocurrió */}
            {installFeedback && (
              <div className="p-3 rounded-2xl bg-purple-950/80 border border-purple-500 text-xs text-purple-200 font-bubble">
                {installFeedback}
              </div>
            )}

            {/* Beneficios Rápidos */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-left space-y-2">
              <div className="text-[11px] font-bubble font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-fio-yellow" />
                <span>Ventajas de instalar la App:</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pl-1">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Acceso directo con ícono en tu pantalla de inicio</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Pantalla completa táctil sin barra de navegador</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Sincronización de pedidos y alertas en tiempo real</span>
                </li>
              </ul>
            </div>

            {/* BOTÓN 1: INSTALACIÓN EN ANDROID / CHROME / EDGE */}
            {isInstallable && (
              <button
                type="button"
                onClick={handleInstallApp}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-fio-pink via-pink-600 to-purple-700 hover:from-pink-600 hover:to-purple-800 text-white font-bubble font-bold text-base flex items-center justify-center gap-2.5 shadow-xl shadow-pink-900/40 active:scale-95 transition-all cursor-pointer animate-pulse-subtle"
              >
                <Download className="w-5 h-5 text-fio-yellow" />
                <span>Descargar e Instalar Aplicación</span>
              </button>
            )}

            {/* GUÍA 2: INSTRUCCIONES PARA IPHONE / IPAD (SAFARI) */}
            {isIOS && !isStandalone && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/30 text-left space-y-2.5">
                <p className="text-xs font-bubble font-bold text-pink-300 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Cómo instalar en tu iPhone / iPad:</span>
                </p>
                <ol className="text-xs text-slate-300 space-y-2 pl-4 list-decimal leading-relaxed">
                  <li>Toca el botón <strong>Compartir</strong> <span className="text-sky-400 font-bold">⬆️</span> en la barra inferior de Safari.</li>
                  <li>Desliza hacia abajo y pulsa <strong>"Agregar a Inicio"</strong> ➕.</li>
                  <li>Toca <strong>"Agregar"</strong> en la esquina superior derecha.</li>
                </ol>
              </div>
            )}

            {/* BOTÓN SECUNDARIO: CONTINUAR AL CÓDIGO DE ACCESO PIN */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  playWaterDropSound();
                  setStep('pin');
                }}
                className="w-full py-3 px-5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-white font-bubble font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <span>{isIOS ? 'Ya la instalé • Ingresar mi PIN' : 'Continuar al Código de Acceso (PIN)'}</span>
                <ArrowRight className="w-4 h-4 text-purple-400" />
              </button>
              <p className="text-[11px] text-slate-400 font-sans">
                Paso 1 de 2: Descarga la app y luego ingresa con tu PIN personal.
              </p>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* PASO 2: INGRESAR EL CÓDIGO DE ACCESO (FAMOSO PIN)                     */}
        {/* ==================================================================== */}
        {step === 'pin' && (
          <div className="bg-slate-900/90 backdrop-blur-xl border border-purple-800/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-center animate-scaleUp">
            {/* Header del PIN */}
            <div className="space-y-1">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-900/60 border border-purple-500/40 text-purple-300 flex items-center justify-center shadow-md mb-2">
                <KeyRound className="w-6 h-6 text-fio-yellow" />
              </div>
              <h2 className="text-xl font-bubble font-bold text-white tracking-tight">
                Código PIN de Acceso
              </h2>
              <p className="text-xs text-slate-300 font-sans">
                Ingresa tu PIN de 4 dígitos para ingresar a <strong>{currentApp.title}</strong>
              </p>
            </div>

            {/* Selector de Perfil Rápido */}
            <div className="space-y-1.5 text-left">
              <span className="text-[10px] font-bubble font-bold text-purple-300 uppercase tracking-wider block">
                Selecciona tu Perfil:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {userProfiles
                  .filter((p) => p.isActive)
                  .map((p) => {
                    const isSelected = selectedProfile?.id === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          playWaterDropSound();
                          setSelectedProfile(p);
                          setEnteredPin('');
                          setPinError(null);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm ring-2 ring-purple-400/50'
                            : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60'
                        }`}
                      >
                        <User className="w-3 h-3" />
                        <span>{p.name}</span>
                        {p.role === 'admin' && (
                          <span className="text-[9px] bg-black/40 px-1 py-0.2 rounded-md uppercase">Admin</span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Puntos Indicadores del PIN (4 Dígitos) */}
            <div className="flex items-center justify-center gap-4 py-2">
              {[0, 1, 2, 3].map((idx) => {
                const filled = enteredPin.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full transition-all duration-200 ${
                      filled
                        ? 'bg-gradient-to-tr from-fio-pink to-purple-500 scale-125 shadow-md shadow-pink-500/50 ring-2 ring-pink-300'
                        : 'bg-slate-800 border-2 border-slate-700'
                    }`}
                  />
                );
              })}
            </div>

            {/* Alerta de Error */}
            {pinError && (
              <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs font-bubble flex items-center justify-center gap-1.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            {/* Alerta de Éxito */}
            {isSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-bubble flex items-center justify-center gap-2 animate-bounce-short">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>¡PIN verificado! Abriendo aplicación...</span>
              </div>
            )}

            {/* Teclado Numérico Táctil Optimizado para Celular (48px botones) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5 max-w-[280px] mx-auto pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  className="h-13 sm:h-14 rounded-2xl bg-slate-800/90 hover:bg-slate-700 active:bg-purple-600 text-white font-bubble font-bold text-xl sm:text-2xl shadow-md border border-slate-700/80 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                >
                  {digit}
                </button>
              ))}

              <button
                type="button"
                onClick={handleClearPin}
                className="h-13 sm:h-14 rounded-2xl bg-slate-800/60 hover:bg-slate-700/60 active:bg-rose-900/60 text-slate-400 hover:text-white font-bubble font-bold text-xs uppercase shadow-sm border border-slate-700/60 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                title="Borrar todo"
              >
                Limpiar
              </button>

              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="h-13 sm:h-14 rounded-2xl bg-slate-800/90 hover:bg-slate-700 active:bg-purple-600 text-white font-bubble font-bold text-xl sm:text-2xl shadow-md border border-slate-700/80 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              >
                0
              </button>

              <button
                type="button"
                onClick={handleBackspace}
                className="h-13 sm:h-14 rounded-2xl bg-slate-800/60 hover:bg-slate-700/60 active:bg-amber-900/60 text-slate-400 hover:text-white font-bubble font-bold text-lg shadow-sm border border-slate-700/60 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                title="Borrar un dígito"
              >
                ⌫
              </button>
            </div>

            {/* Enlace de regreso al Paso 1 si el usuario aún no la instaló */}
            {!isStandalone && (
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    playWaterDropSound();
                    setStep('install');
                  }}
                  className="text-xs text-purple-300 hover:text-pink-300 font-bubble transition-colors"
                >
                  ← Volver a ver instrucciones de descarga / instalación
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pie de Página Discreto */}
      <footer className="w-full max-w-md mx-auto text-center py-2 text-[11px] text-slate-400 font-sans">
        Aplicación PWA Progresiva Multi-dispositivo • By.Fio 2026
      </footer>
    </div>
  );
};
