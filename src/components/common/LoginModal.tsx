import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ArrowRight, X, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin?: (username: string) => void;
  isStandalonePage?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  isStandalonePage = false,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen && !isStandalonePage) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userDisplay = email.split('@')[0] || 'Creativa';
    setSuccessMessage(`¡Bienvenida/o de nuevo, ${userDisplay}! 🎉`);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AEFA', '#EC4899', '#FFF07C', '#38BDF8'],
      });
    } catch {
      // Ignore if confetti not supported
    }

    if (onSuccessLogin) {
      onSuccessLogin(userDisplay);
    }

    setTimeout(() => {
      setSuccessMessage(null);
      if (!isStandalonePage) {
        onClose();
      }
    }, 1800);
  };

  const handleSocial = (provider: string) => {
    setSuccessMessage(`¡Accediendo con ${provider}! ✨`);
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#8e54e9', '#ff7597', '#ffbe3b'],
      });
    } catch {}

    setTimeout(() => {
      setSuccessMessage(null);
      if (!isStandalonePage) {
        onClose();
      }
    }, 1500);
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
            <Heart className="w-8 h-8 fill-current heart-icon inline-block" />
            <span className="heart-rays">彡</span>
          </div>
          <h1>{mode === 'login' ? 'Bienvenido de nuevo' : 'Crear tu Cuenta'}</h1>
          <p>
            {mode === 'login'
              ? 'Inicia sesión para continuar tu viaje'
              : 'Únete a nuestra academia y tienda creativa'}
          </p>
        </div>

        {/* Ilustración de la Niña y la Estrella 3D */}
        <div className="characters-stage">
          <div className="floating-hearts">
            <span className="h-pink">💖</span>
            <span className="h-purple">💜</span>
          </div>
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
          {/* Mensaje de Éxito Flotante */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-500 text-white text-xs font-bubble font-bold text-center shadow-md animate-fadeIn flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="input-group">
            <div className="icon-badge">
              <User className="w-5 h-5 text-white" />
            </div>
            <input
              type="text"
              placeholder="Correo o Usuario"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <div className="icon-badge">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                alert('¡Hola! Escríbenos directamente a WhatsApp (6400-4640) para recuperar o restablecer tu cuenta.');
              }}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button type="submit" className="btn-login">
            <span>{mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="divider">
            <span>o continúa con</span>
          </div>

          <div className="social-row">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleSocial('Google')}
              className="social-btn"
              title="Continuar con Google"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </button>

            {/* Apple */}
            <button
              type="button"
              onClick={() => handleSocial('Apple')}
              className="social-btn"
              title="Continuar con Apple"
            >
              <svg className="w-6 h-6 fill-slate-900" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.31-7.79-11.94-13.79-25.03-18.01-39.26-4.22-14.23-6.33-27.18-6.33-38.86 0-14.45 3.51-26.6 10.53-36.46 7.02-9.86 16.03-14.95 27.04-15.28 4.89 0 10.37 1.25 16.44 3.75 6.07 2.5 10.15 3.75 12.24 3.75 2.61 0 6.94-1.33 12.98-4 6.04-2.67 11.24-3.84 15.6-3.52 11.75.54 21.03 4.84 27.84 12.89-10.22 6.19-15.23 14.88-15.02 26.07.21 8.8 3.53 16.14 9.97 22.03 6.44 5.89 14.24 9.28 23.4 10.17-1.96 6.08-4.46 12.43-7.52 19.06zM119.22 31.84c0-7.39 2.66-14.41 7.98-21.06 5.32-6.65 11.91-10.59 19.78-11.82.43 2.17.65 4.13.65 5.87 0 7.39-2.77 14.48-8.31 21.28-5.54 6.8-12.23 10.74-20.06 11.82-.04-2.03-.04-4.06-.04-6.09z" />
              </svg>
            </button>

            {/* Facebook */}
            <button
              type="button"
              onClick={() => handleSocial('Facebook')}
              className="social-btn"
              title="Continuar con Facebook"
            >
              <svg className="w-6 h-6 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
          </div>

          <p className="signup-text">
            {mode === 'login' ? (
              <>
                ¿No tienes una cuenta?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
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
                  onClick={() => setMode('login')}
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
