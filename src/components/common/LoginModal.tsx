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
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen && !isStandalonePage) return null;

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
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (loginMethod === 'pin') {
        const result = loginWithPin(pinCode);
        if (result.success && result.user) {
          handleLoginSuccess(result.user);
        } else {
          setErrorMessage(result.error || 'Código PIN de 4 dígitos incorrecto o no asignado.');
        }
        return;
      }

      if (mode === 'login') {
        const result = loginUser(email, password);
        if (result.success && result.user) {
          handleLoginSuccess(result.user);
        } else {
          setErrorMessage(result.error || 'Credenciales incorrectas. Verifica tu correo y contraseña o PIN.');
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

  // Perfil detectado si se está digitando el PIN
  const matchedProfile = pinCode.length === 4
    ? userProfiles.find((p) => p.isActive && p.pin === pinCode)
    : null;

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
              ? (loginMethod === 'pin' ? 'Ingresa con tu código de 4 dígitos' : 'Inicia sesión para continuar')
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
          {/* Selector de Método: Correo vs PIN de Colaborador (integrado dentro del panel para continuidad visual 3D) */}
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
                  <span>Correo / Fio</span>
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
                  <span>PIN 4 Dígitos</span>
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

          {/* MODO PIN (COLABORADORES Y ACCESO RÁPIDO) */}
          {loginMethod === 'pin' && mode === 'login' ? (
            <div className="space-y-3">
              <div className="input-group">
                <div className="icon-badge">
                  <KeyRound className="w-4 h-4 text-white" />
                </div>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  placeholder="Código PIN de 4 dígitos"
                  value={pinCode}
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

              {/* Perfil detectado con el PIN */}
              {matchedProfile && (
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bubble font-bold text-center animate-fadeIn flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Perfil detectado: {matchedProfile.name.toUpperCase()}</span>
                </div>
              )}

              {pinCode === '7777' && (
                <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bubble font-bold text-center animate-fadeIn flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-fio-purple shrink-0" />
                  <span>Acceso Maestro: FIORELLA (ADMIN)</span>
                </div>
              )}

              {/* Píldoras de Perfiles Rápidos Registrados */}
              <div className="pt-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Perfiles de Colaborador activos:
                </span>
                <div className="flex flex-wrap gap-1">
                  {userProfiles.filter((p) => p.isActive).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPinCode(p.pin);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-white/90 hover:bg-white text-[10px] font-bubble font-bold text-purple-900 border border-purple-200/80 shadow-2xs transition-all"
                      title={`Ingresar como ${p.name.toUpperCase()}`}
                    >
                      {p.name.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
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

          <button type="submit" className="btn-login mt-2" disabled={isLoading}>
            {isLoading ? (
              <span>Ingresando...</span>
            ) : (
              <>
                <span>
                  {loginMethod === 'pin'
                    ? 'Ingresar con PIN'
                    : mode === 'login'
                    ? 'Iniciar Sesión'
                    : 'Crear Cuenta'}
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
