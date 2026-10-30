import React, { useState } from 'react';
import { Heart, User, Lock, Eye, EyeOff, ArrowRight, X, CheckCircle2, AlertCircle, LogOut, KeyRound, Shield, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { AuthUser } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  isStandalonePage?: boolean;
  onSuccess?: (user: AuthUser) => void;
  forcedRole?: 'admin' | 'staff' | 'all';
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  isStandalonePage = false,
  onSuccess,
}) => {
  const { currentUser, loginUser, loginWithPin, registerUser, logoutUser, userProfiles } = useApp();
  const [loginMethod, setLoginMethod] = useState<'email' | 'pin'>('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [profileNameInput, setProfileNameInput] = useState('');
  const [pinStep, setPinStep] = useState<'profile' | 'pin'>('profile');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pinAttempts, setPinAttempts] = useState(() => {
    try {
      return Number(sessionStorage.getItem('byfio_pin_attempts') || 0);
    } catch {
      return 0;
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen && !isStandalonePage) return null;

  const isPinLocked = pinAttempts >= 3;

  const handleLoginSuccess = (user: AuthUser) => {
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8e54e9', '#ff7597', '#ffbe3b', '#6c43b5'],
      });
    } catch {}

    if (onSuccess) {
      onSuccess(user);
    }
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Flujo de Autenticación por PIN
    if (loginMethod === 'pin') {
      if (pinStep === 'profile') {
        const cleanProfile = profileNameInput.trim().toUpperCase();
        if (!cleanProfile) {
          setErrorMessage('Por favor escribe el nombre de tu perfil.');
          return;
        }

        const matched = userProfiles.find((p) => p.isActive && p.name.toUpperCase() === cleanProfile);
        const isMaster = cleanProfile === 'FIO' || cleanProfile === 'FIORELLA' || cleanProfile === 'ADMIN' || cleanProfile === 'ADMINISTRADOR';

        if (!matched && !isMaster) {
          setErrorMessage('Perfil no encontrado. Verifica el nombre asignado.');
          return;
        }

        // Transición suave y profesional al input de PIN
        setIsTransitioning(true);
        setTimeout(() => {
          setPinStep('pin');
          setIsTransitioning(false);
        }, 220);
        return;
      }

      // Si está en el paso de ingreso de PIN
      if (isPinLocked) {
        setErrorMessage('Acceso con PIN bloqueado. Has agotado los 3 intentos permitidos.');
        return;
      }

      if (pinCode.length !== 4) {
        setErrorMessage('Ingresa el código PIN de 4 dígitos.');
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const result = loginWithPin(pinCode, profileNameInput);
        if (result.success && result.user) {
          try {
            sessionStorage.removeItem('byfio_pin_attempts');
          } catch {}
          setPinAttempts(0);
          handleLoginSuccess(result.user);
        } else {
          const nextAttempts = pinAttempts + 1;
          setPinAttempts(nextAttempts);
          try {
            sessionStorage.setItem('byfio_pin_attempts', String(nextAttempts));
          } catch {}
          setPinCode('');

          if (nextAttempts >= 3) {
            setErrorMessage('Has agotado los 3 intentos permitidos. Acceso con PIN bloqueado.');
          } else {
            const remaining = 3 - nextAttempts;
            setErrorMessage(
              `PIN incorrecto. Te ${remaining === 1 ? 'queda 1 intento' : `quedan ${remaining} intentos`}.`
            );
          }
        }
      }, 200);
      return;
    }

    // Flujo de Autenticación por Correo y Contraseña
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      if (mode === 'login') {
        const result = loginUser(email, password);
        if (result.success && result.user) {
          handleLoginSuccess(result.user);
        } else {
          setErrorMessage(result.error || 'Credenciales incorrectas. Verifica tu correo y contraseña.');
        }
      } else {
        const result = registerUser(email, password, name);
        if (result.success && result.user) {
          handleLoginSuccess(result.user);
        } else {
          setErrorMessage(result.error || 'Error al crear la cuenta.');
        }
      }
    }, 200);
  };

  const content = (
    <div className="scene-wrapper relative py-2 sm:py-3 w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center">
      {/* Tarjeta Principal Estilo Claymorphism 3D */}
      <div className="login-card relative">
        {/* Botón flotante para cerrar en modo modal (dentro de la tarjeta para evitar cortes en bordes) */}
        {!isStandalonePage && (
          <button
            type="button"
            onClick={onClose}
            className="login-close-btn absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-30 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-slate-600 hover:text-fio-pink shadow-sm flex items-center justify-center transition-all active:scale-90 border border-purple-200/80 cursor-pointer"
            title="Cerrar ventana"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Encabezado */}
        <div className="header px-8 sm:px-10">
          <div className="heart-badge">
            <span className="heart-rays">彡</span>
            <Heart className="w-6 h-6 fill-current heart-icon inline-block" />
            <span className="heart-rays">彡</span>
          </div>
          <h1>
            {mode === 'login'
              ? (loginMethod === 'pin' ? 'Acceso con PIN' : 'Bienvenido de nuevo')
              : 'Crear tu Cuenta'}
          </h1>
          <p>
            {mode === 'login'
              ? (loginMethod === 'pin' ? 'Ingresa tu perfil y PIN de acceso' : 'Inicia sesión para continuar')
              : 'Únete a nuestra academia y tienda creativa'}
          </p>
        </div>

        {/* Ilustración de la Niña y la Estrella 3D Completa */}
        <div className="characters-stage">
          <img
            src="/assets/login-3d-girl-star.png"
            alt="Niña y Estrella 3D by.fio"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/login-3d-girl-star.jpg';
            }}
          />
        </div>

        {/* Formulario */}
        <form className="form-panel" onSubmit={handleSubmit}>
          {/* Selector de Método: Correo vs PIN (integrado dentro del panel para continuidad visual 3D) */}
          {mode === 'login' && (
            <div className="mb-3.5">
              <div className="flex items-center p-1 rounded-2xl bg-white/80 border border-purple-200/80 shadow-2xs">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('email');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all flex items-center justify-center gap-1.5 ${
                    loginMethod === 'email'
                      ? 'bg-gradient-to-r from-purple-600 to-fio-pink text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Correo</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('pin');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all flex items-center justify-center gap-1.5 ${
                    loginMethod === 'pin'
                      ? 'bg-gradient-to-r from-purple-600 to-fio-pink text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>PIN</span>
                </button>
              </div>
            </div>
          )}
          {/* Mensaje de Sesión Activa con Botón Directo al Admin */}
          {currentUser && (
            <div className="mb-3 p-3 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-950 shadow-xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="truncate text-left pl-1">
                  <span className="font-bubble font-bold text-fio-purple">Sesión activa:</span>{' '}
                  <span className="font-extrabold uppercase">{currentUser.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logoutUser();
                    setErrorMessage(null);
                  }}
                  className="px-2 py-1 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-[11px] font-bold font-bubble flex items-center gap-1 shrink-0 transition-all shadow-2xs"
                  title="Cerrar sesión actual"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Salir</span>
                </button>
              </div>

              {(currentUser.role === 'admin' || currentUser.role === 'staff') && (
                <button
                  type="button"
                  onClick={() => handleLoginSuccess(currentUser)}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-fio-pink text-white font-bubble font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ingresar Directo al Panel de Administración &rarr;</span>
                </button>
              )}
            </div>
          )}

          {/* Mensaje de Error */}
          {errorMessage && (
            <div className="mb-3 p-2.5 rounded-2xl bg-rose-500 text-white text-xs font-bubble font-semibold text-center shadow-md animate-fadeIn flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* MODO PIN (SOLICITUD DE NOMBRE DE PERFIL Y TRANSICIÓN SUAVE A PIN CON 3 INTENTOS MÁXIMO) */}
          {loginMethod === 'pin' && mode === 'login' ? (
            <div className="space-y-3">
              {pinStep === 'profile' ? (
                /* Paso 1: Pide Nombre del Perfil en la misma línea */
                <div
                  className={`space-y-2 transition-all duration-300 ${
                    isTransitioning
                      ? 'opacity-0 -translate-x-3 pointer-events-none'
                      : 'opacity-100 translate-x-0'
                  }`}
                >
                  <div className="input-group">
                    <div className="icon-badge">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <input
                      type="text"
                      placeholder="Nombre del perfil (ej. ALISTO DE PEDIDOS)"
                      value={profileNameInput}
                      onChange={(e) => {
                        setProfileNameInput(e.target.value.toUpperCase());
                        if (errorMessage) setErrorMessage(null);
                      }}
                      autoFocus
                      required
                      autoComplete="off"
                      className="tracking-wider uppercase font-bubble font-bold text-sm"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 font-sans text-center">
                    Escribe tu nombre de perfil para continuar
                  </p>
                </div>
              ) : (
                /* Paso 2: Transición suave y profesional hacia "Ingresa el PIN" */
                <div
                  className={`space-y-2.5 transition-all duration-300 ${
                    isTransitioning
                      ? 'opacity-0 translate-x-3 pointer-events-none'
                      : 'opacity-100 translate-x-0'
                  }`}
                >
                  {/* Tarjeta del perfil confirmado con opción de cambiar */}
                  <div className="flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-purple-50/90 border border-purple-200/80 shadow-2xs">
                    <div className="flex items-center gap-1.5 truncate text-left">
                      <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                        ✓
                      </div>
                      <span className="text-xs font-bubble font-extrabold text-purple-950 uppercase truncate">
                        {profileNameInput.trim().toUpperCase()}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsTransitioning(true);
                        setTimeout(() => {
                          setPinStep('profile');
                          setPinCode('');
                          setErrorMessage(null);
                          setIsTransitioning(false);
                        }, 180);
                      }}
                      className="text-[11px] font-bubble font-bold text-fio-purple hover:underline shrink-0 ml-2"
                    >
                      Cambiar
                    </button>
                  </div>

                  {/* Input de PIN */}
                  <div className="input-group">
                    <div className="icon-badge">
                      <KeyRound className="w-4 h-4 text-white" />
                    </div>
                    <input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      placeholder="Ingresa el PIN"
                      value={pinCode}
                      disabled={isPinLocked}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setPinCode(clean);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      required
                      autoFocus
                      className="tracking-widest text-center text-lg font-mono font-bold"
                    />
                  </div>

                  {/* Contador de intentos restantes */}
                  {!isPinLocked && pinAttempts > 0 && (
                    <div className="text-[11px] font-bubble font-bold text-amber-700 text-center">
                      Intentos restantes: {3 - pinAttempts} de 3
                    </div>
                  )}

                  {isPinLocked && (
                    <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bubble font-bold text-center animate-fadeIn">
                      Acceso bloqueado por superar los 3 intentos permitidos.
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* MODO CORREO / CONTRASEÑA */
            <>
              {mode === 'register' && (
                <div className="input-group">
                  <div className="icon-badge">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <input
                    type="text"
                    placeholder="Tu Nombre Completo"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    required
                  />
                </div>
              )}

              <div className="input-group">
                <div className="icon-badge">
                  <User className="w-4 h-4 text-white" />
                </div>
                <input
                  type="text"
                  placeholder={mode === 'login' ? 'Correo (ej. fio@byfiocr.com)' : 'Correo electrónico'}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  required
                  autoComplete="username"
                />
              </div>

              <div className="input-group">
                <div className="icon-badge">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password focus:outline-none"
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="forgot-wrap">
                <a
                  href="#recuperar"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Por favor contactá a Fio al WhatsApp 6400-4640 para restablecer tu contraseña.');
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn-login mt-2"
            disabled={isLoading || (loginMethod === 'pin' && pinStep === 'pin' && isPinLocked)}
          >
            {isLoading ? (
              <span>Verificando...</span>
            ) : loginMethod === 'pin' ? (
              pinStep === 'profile' ? (
                <>
                  <span>Continuar</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : isPinLocked ? (
                <span>Acceso Bloqueado</span>
              ) : (
                <>
                  <span>Ingresar con PIN</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )
            ) : (
              <>
                <span>
                  {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {loginMethod === 'email' && (
            <p className="signup-text mt-3">
              {mode === 'login' ? (
                <>
                  ¿No tienes una cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMessage(null);
                    }}
                    className="font-bold hover:underline"
                  >
                    Regístrate
                  </button>
                </>
              ) : (
                <>
                  ¿Ya tienes una cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                    }}
                    className="font-bold hover:underline"
                  >
                    Inicia Sesión
                  </button>
                </>
              )}
            </p>
          )}
        </form>
      </div>

      {/* Base 3D Inferior (Pedestal) */}
      <div className="pedestal" />
    </div>
  );

  // Si es modo modal overlay
  if (!isStandalonePage) {
    return (
      <div
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
        onClick={onClose}
      >
        <div onClick={(e) => e.stopPropagation()} className="w-full flex justify-center">
          {content}
        </div>
      </div>
    );
  }

  // Si es modo página completa (/login) o embebido en /admin
  return (
    <div className="w-full flex items-center justify-center py-4 sm:py-8 px-2 sm:px-4">
      {content}
    </div>
  );
};
