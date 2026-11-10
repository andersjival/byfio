import React, { useState, useRef, useEffect } from 'react';
import { Heart, User, Lock, Eye, EyeOff, ArrowRight, X, CheckCircle2, AlertCircle, LogOut, KeyRound, Shield, UserPlus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { useAlert } from '../../context/ConfirmContext';
import { AuthUser } from '../../types';
import { ThreeStepRegisterForm } from './ThreeStepRegisterForm';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  isStandalonePage?: boolean;
  onSuccess?: (user: AuthUser) => void;
  forcedRole?: 'admin' | 'staff' | 'all';
  isLogoutCurtain?: boolean;
  initialMode?: 'login' | 'register';
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  isStandalonePage = false,
  onSuccess,
  isLogoutCurtain = false,
  forcedRole = 'all',
  initialMode = 'login',
}) => {
  const showAlert = useAlert();
  const {
    currentUser,
    loginUser,
    loginWithPin,
    loginSuperAdmin,
    registerUser,
    logoutUser,
    userProfiles,
    loginIntroStage,
    triggerLoginCinematic,
    isFeatureEnabled,
  } = useApp();
  const isBackdropMouseDownRef = useRef(false);

  const [loginMethod, setLoginMethod] = useState<'email' | 'pin'>(() => {
    try {
      return (localStorage.getItem('byfio_saved_login_method') as 'email' | 'pin') || 'email';
    } catch {
      return 'email';
    }
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem('byfio_saved_login_email') || '';
    } catch {
      return '';
    }
  });
  const [password, setPassword] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [profileNameInput, setProfileNameInput] = useState(() => {
    try {
      return localStorage.getItem('byfio_saved_login_profile') || '';
    } catch {
      return '';
    }
  });

  const handleSelectLoginMethod = (method: 'email' | 'pin') => {
    setLoginMethod(method);
    setErrorMessage(null);
    try {
      localStorage.setItem('byfio_saved_login_method', method);
    } catch {}
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (errorMessage) setErrorMessage(null);
    try {
      localStorage.setItem('byfio_saved_login_email', val);
    } catch {}
  };

  const handleProfileNameChange = (pName: string) => {
    setProfileNameInput(pName);
    if (errorMessage) setErrorMessage(null);
    try {
      localStorage.setItem('byfio_saved_login_profile', pName);
    } catch {}
  };

  const handleBackdropMouseDown = (e: React.MouseEvent) => {
    isBackdropMouseDownRef.current = e.target === e.currentTarget;
  };

  const handleBackdropMouseUp = (e: React.MouseEvent) => {
    if (isBackdropMouseDownRef.current && e.target === e.currentTarget) {
      onClose();
    }
    isBackdropMouseDownRef.current = false;
  };
  const [pinAttempts, setPinAttempts] = useState(() => {
    try {
      return Number(sessionStorage.getItem('byfio_pin_attempts') || 0);
    } catch {
      return 0;
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);

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

    // Enrutar al usuario de inmediato sin demoras ni pantallas en blanco
    if (onSuccess) {
      onSuccess(user);
    }

    // Si es modal flotante, cerrar de inmediato. Si es página embebida (/admin o /login), onSuccess gestiona la ruta
    if (!isStandalonePage) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Flujo de Autenticación por PIN
    if (loginMethod === 'pin') {
      if (isPinLocked) {
        setErrorMessage('Acceso con PIN bloqueado. Has agotado los 3 intentos permitidos.');
        return;
      }

      const cleanProfile = profileNameInput.trim().toUpperCase();
      if (!cleanProfile) {
        setErrorMessage('Por favor escribe el nombre de tu perfil.');
        return;
      }

      if (pinCode.length !== 4) {
        setErrorMessage('Ingresa el código PIN de 4 dígitos.');
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const result = loginWithPin(pinCode, cleanProfile);
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
              `PIN o perfil incorrecto. Te ${remaining === 1 ? 'queda 1 intento' : `quedan ${remaining} intentos`}.`
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
        const cleanEmail = email.trim().replace(/[\u200B-\u200D\uFEFF]/g, '');
        const cleanPass = password.trim().replace(/[\u200B-\u200D\uFEFF]/g, '');

        // Detección directa e infalible de Superadmin
        const isSuperadminUser =
          cleanEmail.toLowerCase() === 'superadmin@byfio.com' ||
          cleanEmail.toLowerCase() === 'superadmin@byfiocr.com' ||
          cleanEmail.toLowerCase() === 'superadmin' ||
          cleanEmail.toLowerCase().includes('superadmin');
        const isSuperadminPass =
          cleanPass === 'SuperAdmin2026!' ||
          cleanPass.toLowerCase() === 'superadmin2026!' ||
          cleanPass === 'SuperAdmin2026' ||
          cleanPass.toLowerCase() === 'superadmin2026' ||
          cleanPass.toLowerCase() === 'superadmin';

        if (isSuperadminUser && isSuperadminPass) {
          loginSuperAdmin('superadmin@byfio.com', 'SuperAdmin2026!');
          const superAdminUser: AuthUser = {
            email: 'superadmin@byfio.com',
            name: 'SUPERADMIN MAESTRO',
            role: 'admin',
            isMasterAdmin: true,
            permissions: {
              orders: true,
              billing: true,
              inventory: true,
              reports: true,
              workshops: true,
              pricing: true,
              users: true,
            },
          };
          handleLoginSuccess(superAdminUser);
          return;
        }

        let result = loginUser(cleanEmail, cleanPass);
        
        // Respaldo de seguridad directo para Superadmin si el usuario escribe cualquier variante
        if (!result.success && (cleanEmail.toLowerCase().includes('super') || cleanPass.toLowerCase().includes('super'))) {
          const superCheck = loginSuperAdmin(cleanEmail, cleanPass);
          if (superCheck.success) {
            result = {
              success: true,
              user: {
                email: 'superadmin@byfio.com',
                name: 'SUPERADMIN MAESTRO',
                role: 'admin',
                isMasterAdmin: true,
                permissions: {
                  orders: true,
                  billing: true,
                  inventory: true,
                  reports: true,
                  workshops: true,
                  pricing: true,
                  users: true,
                },
              },
            };
          }
        }

        if (result.success && result.user) {
          if (
            forcedRole === 'admin' &&
            result.user.role !== 'admin' &&
            result.user.role !== 'staff' &&
            !result.user.isMasterAdmin &&
            result.user.email !== 'superadmin@byfio.com'
          ) {
            setErrorMessage('Acceso reservado únicamente para administración y colaboradores.');
            return;
          }
          handleLoginSuccess(result.user);
        } else {
          setErrorMessage(result.error || 'Credenciales incorrectas. Verifica tu correo y contraseña.');
        }
      } else {
        const result = registerUser(email, password, name);
        if (result.success && result.user) {
          if (
            forcedRole === 'admin' &&
            result.user.role !== 'admin' &&
            result.user.role !== 'staff' &&
            !result.user.isMasterAdmin &&
            result.user.email !== 'superadmin@byfio.com'
          ) {
            setErrorMessage('Acceso reservado únicamente para administración y colaboradores.');
            return;
          }
          handleLoginSuccess(result.user);
        } else {
          setErrorMessage(result.error || 'Error al crear la cuenta.');
        }
      }
    }, 200);
  };

  const content = (
    <div className="scene-wrapper relative py-1 w-full max-w-[395px] mx-auto flex flex-col items-center px-1">
      {/* Tarjeta Principal Estilo Claymorphism 3D */}
      <div className="login-card relative">
        {/* Botón flotante para cerrar en modo modal (dentro de la tarjeta para evitar cortes en bordes) */}
        {!isStandalonePage && (
          <button
            type="button"
            onClick={onClose}
            className="login-close-btn absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-fio-pink shadow-xs flex items-center justify-center transition-all active:scale-90 border border-purple-200/80 cursor-pointer"
            title="Cerrar ventana"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Encabezado */}
        <div className="header px-3 sm:px-4">
          <div className="heart-badge">
            <span className="heart-rays">彡</span>
            <Heart className="w-5 h-5 fill-current heart-icon inline-block" />
            <span className="heart-rays">彡</span>
          </div>
          <h1>
            {mode === 'login'
              ? (loginMethod === 'pin' ? 'Acceso con PIN' : 'Bienvenido de nuevo')
              : 'Registro en 3 Pasos'}
          </h1>
          <p>
            {mode === 'login'
              ? (loginMethod === 'pin' ? 'Ingresa tu perfil y PIN de acceso' : 'Inicia sesión para continuar')
              : 'Completa tus datos para crear tu cuenta'}
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

        {/* Selector de Modo: Iniciar Sesión vs Registrarse (Público) */}
        {forcedRole !== 'admin' && (
          <div className="px-3 sm:px-4 mb-2">
            <div className="flex items-center p-1 rounded-2xl bg-purple-100/70 border border-purple-200/80 shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 rounded-xl text-xs sm:text-sm font-bubble font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'login'
                    ? 'bg-gradient-to-r from-purple-600 to-fio-pink text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Iniciar Sesión</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 rounded-xl text-xs sm:text-sm font-bubble font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'register'
                    ? 'bg-gradient-to-r from-purple-600 to-fio-pink text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Registrarse</span>
              </button>
            </div>
          </div>
        )}

        {/* Contenido Dinámico: Registro en 3 Pasos vs Login Tradicional */}
        {mode === 'register' ? (
          <div className="form-panel">
            <ThreeStepRegisterForm
              onSuccess={handleLoginSuccess}
              onSwitchToLogin={() => {
                setMode('login');
                setErrorMessage(null);
              }}
            />
          </div>
        ) : (
          <form className="form-panel" onSubmit={handleSubmit}>
          {/* Selector de Método: Correo vs PIN (integrado dentro del panel para continuidad visual 3D) */}
          {mode === 'login' && (
            <div className="mb-2.5">
              <div className="flex items-center p-1 rounded-2xl bg-white/80 border border-purple-200/80 shadow-2xs">
                <button
                  type="button"
                  onClick={() => {
                    handleSelectLoginMethod('email');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs sm:text-sm font-bubble font-bold transition-all flex items-center justify-center gap-1.5 ${
                    loginMethod === 'email'
                      ? 'bg-gradient-to-r from-purple-600 to-fio-pink text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Correo</span>
                </button>

                {isFeatureEnabled('users', 'pin_authentication') && (
                  <button
                    type="button"
                    onClick={() => {
                      handleSelectLoginMethod('pin');
                      setErrorMessage(null);
                    }}
                    className={`flex-1 py-1.5 rounded-xl text-xs sm:text-sm font-bubble font-bold transition-all flex items-center justify-center gap-1.5 ${
                      loginMethod === 'pin'
                        ? 'bg-gradient-to-r from-purple-600 to-fio-pink text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>PIN</span>
                  </button>
                )}
              </div>

              {/* Acceso Rápido a Perfiles de Usuario con PIN */}
              {isFeatureEnabled('users', 'pin_authentication') && userProfiles.filter((p) => p.isActive).length > 0 && (
                <div className="pt-2 pb-1 text-center">
                  <div className="text-[10px] font-bubble font-bold text-slate-500 mb-1">
                    Perfiles de Usuario Disponibles:
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {userProfiles
                      .filter((p) => p.isActive)
                      .map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            handleSelectLoginMethod('pin');
                            handleProfileNameChange(p.name);
                            setErrorMessage(null);
                          }}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bubble font-bold transition-all border cursor-pointer ${
                            loginMethod === 'pin' && profileNameInput === p.name
                              ? 'bg-gradient-to-r from-purple-600 to-fio-pink text-white border-transparent shadow-xs scale-105'
                              : 'bg-white hover:bg-purple-50 text-purple-900 border-purple-200 shadow-2xs'
                          }`}
                          title={`Tocar para ingresar con perfil ${p.name}`}
                        >
                          👤 {p.name}
                        </button>
                      ))}
                  </div>
                </div>
              )}
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
                  <Shield className="w-3.5 h-3.5" />
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

          {/* MODO PIN (NOMBRE DE PERFIL + INGRESA EL PIN SIMULTÁNEOS, MÁXIMO 3 INTENTOS) */}
          {loginMethod === 'pin' && mode === 'login' ? (
            <div className="space-y-2.5">
              {/* Campo 1: Nombre de Perfil con selector rápido de perfiles activos */}
              <div className="space-y-1 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bubble font-bold text-slate-600 ml-1">
                    Perfil de Usuario:
                  </label>
                  <span className="text-[10px] text-fio-purple font-bold">Toca o escribe:</span>
                </div>

                {/* Chips rápidos de perfiles existentes para no tener que adivinar */}
                {userProfiles.filter((p) => p.isActive).length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {userProfiles
                      .filter((p) => p.isActive)
                      .map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            handleProfileNameChange(p.name);
                            if (errorMessage) setErrorMessage(null);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bubble font-bold transition-all border cursor-pointer ${
                            profileNameInput === p.name
                              ? 'bg-gradient-to-r from-purple-600 to-fio-pink text-white border-transparent shadow-xs scale-102'
                              : 'bg-white/80 text-purple-900 border-purple-200/80 hover:bg-purple-50 shadow-2xs'
                          }`}
                        >
                          {p.name}
                        </button>
                      ))}
                  </div>
                )}

                <div className="input-group">
                  <div className="icon-badge">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <input
                    type="text"
                    placeholder="Escribe o toca tu perfil"
                    value={profileNameInput}
                    onChange={(e) => {
                      handleProfileNameChange(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    required
                    autoComplete="off"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    className="tracking-wider font-bubble font-bold text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Campo 2: Ingresa el PIN */}
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-bubble font-bold text-slate-600 ml-1">
                  Ingresa el PIN:
                </label>
                <div className="input-group">
                  <div className="icon-badge">
                    <KeyRound className="w-4 h-4 text-white" />
                  </div>
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    placeholder="PIN de 4 dígitos"
                    value={pinCode}
                    disabled={isPinLocked}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setPinCode(clean);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    required
                    className="tracking-widest text-center text-lg font-mono font-bold"
                  />
                </div>
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
          ) : (
            /* MODO CORREO / CONTRASEÑA */
            <>
              <div className="input-group">
                <div className="icon-badge">
                  <User className="w-4 h-4 text-white" />
                </div>
                <input
                  type="email"
                  placeholder="Correo (ej. fio@byfiocr.com)"
                  value={email}
                  onChange={(e) => {
                    handleEmailChange(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  autoComplete="username"
                  className="normal-case lowercase"
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
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  autoComplete="current-password"
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
                    showAlert('Por favor contactá a Fio al WhatsApp 6400-4640 para restablecer tu contraseña.', {
                      title: 'Recuperar Contraseña',
                      variant: 'info',
                      confirmLabel: 'Entendido',
                    });
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
            disabled={isLoading || (loginMethod === 'pin' && isPinLocked)}
          >
            {isLoading ? (
              <span>Verificando...</span>
            ) : loginMethod === 'pin' ? (
              isPinLocked ? (
                <span>Acceso Bloqueado</span>
              ) : (
                <>
                  <span>Ingresar con PIN</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )
            ) : (
              <>
                <span>Iniciar Sesión</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {loginMethod === 'email' && forcedRole !== 'admin' && (
            <p className="signup-text mt-3">
              ¿No tienes una cuenta?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
                }}
                className="font-bold hover:underline"
              >
                Regístrate (3 pasos)
              </button>
            </p>
          )}
        </form>
      )}
      </div>

      {/* Badge de Copyright Animado de GeoSoft (Estilo BOSUNI CR) */}
      <div className="mt-2.5 text-center pb-0.5">
        <div className="geosoft-copyright-pill px-3 py-1">
          <a
            href="https://www.geosoft.lat"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10.5px] sm:text-[11px] tracking-wider hover:opacity-90 transition-opacity font-bubble"
            title="Desarrollado por GeoSoft"
          >
            <span className="animate-copyright-sweep font-bold">
              © Copyright en byfio by GeoSoft
            </span>
          </a>
        </div>
      </div>
    </div>
  );

  // Si es modo modal overlay
  if (!isStandalonePage) {
    return (
      <div
        className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain flex flex-col items-center p-2 sm:p-4 py-4 sm:py-6"
        style={{ minHeight: '100dvh' }}
        onMouseDown={handleBackdropMouseDown}
        onMouseUp={handleBackdropMouseUp}
      >
        {/* Cortina translúcida que tapa la web de arriba hacia abajo y luego se desvanece suavemente */}
        <div
          className={`fixed inset-0 pointer-events-none z-10 ${
            loginIntroStage >= 2
              ? 'backdrop-fade-out'
              : isLogoutCurtain
              ? 'login-curtain-backdrop'
              : 'bg-slate-950/70 backdrop-blur-md animate-fadeIn'
          }`}
        />

        {/* Ventana de login: centrada con margen vertical seguro para que NUNCA se corte arriba ni abajo */}
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          className={`relative z-30 w-full max-w-[395px] mx-auto my-auto py-2 flex justify-center ${
            loginIntroStage >= 1
              ? 'login-exit-up'
              : isLogoutCurtain
              ? 'login-drop-motion'
              : 'animate-fadeIn'
          }`}
        >
          <div className={loginIntroStage >= 1 ? 'w-full flex justify-center' : 'login-floating-card w-full flex justify-center'}>
            {content}
          </div>
        </div>
      </div>
    );
  }

  // Si es modo página completa (/login) o embebido en /admin
  return (
    <div className="w-full flex items-center justify-center py-4 sm:py-8 px-2 sm:px-4">
      <div
        className={`w-full max-w-[395px] mx-auto flex justify-center ${
          loginIntroStage >= 1 ? 'login-exit-up' : 'animate-fadeIn'
        }`}
      >
        <div className={loginIntroStage >= 1 ? 'w-full flex justify-center' : 'login-floating-card w-full flex justify-center'}>
          {content}
        </div>
      </div>
    </div>
  );
};
