import React, { useState } from 'react';
import { Heart, User, Lock, Eye, EyeOff, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  isStandalonePage?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  isStandalonePage = false,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen && !isStandalonePage) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(
        mode === 'login'
          ? '¡Bienvenido(a) a by.fio! 💖 Sesión iniciada con éxito.'
          : '¡Cuenta creada con éxito! ✨ Bienvenida a la familia by.fio.'
      );

      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8e54e9', '#ff7597', '#ffbe3b', '#6c43b5'],
        });
      } catch {}

      if (!isStandalonePage) {
        setTimeout(() => {
          onClose();
          setSuccessMessage(null);
        }, 1600);
      }
    }, 1200);
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
          {/* Mensaje de Éxito Flotante */}
          {successMessage && (
            <div className="mb-3 p-2.5 rounded-2xl bg-emerald-500 text-white text-xs font-bubble font-bold text-center shadow-md animate-fadeIn flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="input-group">
            <div className="icon-badge">
              <User className="w-4 h-4 text-white" />
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
              <Lock className="w-4 h-4 text-white" />
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
