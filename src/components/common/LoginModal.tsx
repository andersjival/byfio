import React, { useState } from 'react';
import { Heart, User, Lock, Eye, EyeOff, ArrowRight, X, CheckCircle2, AlertCircle, LogOut } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { AuthUser } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  isStandalonePage?: boolean;
  onSuccess?: (user: AuthUser) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  isStandalonePage = false,
  onSuccess,
}) => {
  const { currentUser, loginUser, registerUser, logoutUser } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen && !isStandalonePage) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (mode === 'login') {
        const result = loginUser(email, password);
        if (result.success && result.user) {
          setErrorMessage(null);
          setSuccessMessage(
            result.user.role === 'admin'
              ? '¡Bienvenida Fio! 💖 Sesión iniciada con éxito.'
              : `¡Bienvenid@ ${result.user.name}! ✨ Sesión iniciada con éxito.`
          );

          try {
            confetti({
              particleCount: 70,
              spread: 75,
              origin: { y: 0.6 },
              colors: ['#8e54e9', '#ff7597', '#ffbe3b', '#6c43b5'],
            });
          } catch {}

          if (onSuccess) {
            onSuccess(result.user);
          }

          setTimeout(() => {
            if (!isStandalonePage) {
              onClose();
            }
            setSuccessMessage(null);
          }, 1500);
        } else {
          setErrorMessage(result.error || 'Credenciales incorrectas. Verifica tu correo y contraseña.');
        }
      } else {
        const result = registerUser(email, password, name);
        if (result.success && result.user) {
          setErrorMessage(null);
          setSuccessMessage('¡Cuenta creada con éxito! ✨ Bienvenida a la familia by.fio.');

          try {
            confetti({
              particleCount: 70,
              spread: 75,
              origin: { y: 0.6 },
              colors: ['#8e54e9', '#ff7597', '#ffbe3b', '#6c43b5'],
            });
          } catch {}

          if (onSuccess) {
            onSuccess(result.user);
          }

          setTimeout(() => {
            if (!isStandalonePage) {
              onClose();
            }
            setSuccessMessage(null);
          }, 1500);
        } else {
          setErrorMessage(result.error || 'Error al crear la cuenta.');
        }
      }
    }, 600);
  };

  const content = (
    <div className="scene-wrapper relative py-2 sm:py-3">
      {/* Botón flotante para cerrar en modo modal */}
      {!isStandalonePage && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-0 z-30 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-600 hover:text-fio-pink shadow-md flex items-center justify-center transition-all active:scale-95 border border-purple-100"
          title="Cerrar ventana"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Tarjeta Principal Estilo Claymorphism 3D */}
      <div className="login-card">
        {/* Encabezado */}
        <div className="header">
          <div className="heart-badge">
            <span className="heart-rays">彡</span>
            <Heart className="w-6 h-6 fill-current heart-icon inline-block" />
            <span className="heart-rays">彡</span>
          </div>
          <h1>{mode === 'login' ? 'Bienvenido de nuevo' : 'Crear tu Cuenta'}</h1>
          <p>
            {mode === 'login'
              ? 'Inicia sesión para continuar tu viaje'
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
          {/* Mensaje de Sesión Activa */}
          {currentUser && !successMessage && !errorMessage && (
            <div className="mb-3 p-2 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-center justify-between gap-2 shadow-xs">
              <div className="truncate text-left pl-1">
                <span className="font-bubble font-bold text-fio-purple">Sesión activa:</span>{' '}
                <span className="font-semibold">{currentUser.email}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  logoutUser();
                  setSuccessMessage(null);
                }}
                className="px-2 py-1 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-[11px] font-bold font-bubble flex items-center gap-1 shrink-0 transition-all shadow-2xs"
                title="Cerrar sesión actual"
              >
                <LogOut className="w-3 h-3" />
                <span>Salir</span>
              </button>
            </div>
          )}

          {/* Mensaje de Error */}
          {errorMessage && (
            <div className="mb-3 p-2.5 rounded-2xl bg-rose-500 text-white text-xs font-bubble font-semibold text-center shadow-md animate-fadeIn flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Mensaje de Éxito Flotante */}
          {successMessage && (
            <div className="mb-3 p-2.5 rounded-2xl bg-emerald-500 text-white text-xs font-bubble font-bold text-center shadow-md animate-fadeIn flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

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

          <button type="submit" className="btn-login" disabled={isLoading}>
            {isLoading ? (
              <span>Iniciando...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="signup-text mt-3">
            {mode === 'login' ? (
              <>
                ¿No tienes una cuenta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage(null);
                    setSuccessMessage(null);
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
                    setSuccessMessage(null);
                  }}
                  className="font-bold hover:underline"
                >
                  Inicia Sesión
                </button>
              </>
            )}
          </p>
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
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn"
        onClick={onClose}
      >
        <div onClick={(e) => e.stopPropagation()} className="max-w-md w-full flex justify-center">
          {content}
        </div>
      </div>
    );
  }

  // Si es modo página completa (/login)
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-4 px-2 bg-radial from-[#f3e5f5] via-[#c8a7e0] to-[#9c78c2]">
      {content}
    </div>
  );
};
