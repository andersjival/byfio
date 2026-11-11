import React from 'react';
import { Star, Sparkles, X, Heart, UserPlus, LogIn } from 'lucide-react';
import { playWaterDropSound } from '../../utils/soundEffects';

interface LikeRegisterStarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: () => void;
  onLogin: () => void;
}

export const LikeRegisterStarModal: React.FC<LikeRegisterStarModalProps> = ({
  isOpen,
  onClose,
  onRegister,
  onLogin,
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    playWaterDropSound();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Aviso de la estrellita by.fio para dar Me Gusta"
      className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm sm:max-w-md bg-white/95 rounded-[32px] p-6 sm:p-7 shadow-2xl border-2 border-purple-200/90 text-center overflow-hidden animate-star-alert-in-top"
      >
        <div className="absolute -top-16 -left-16 w-44 h-44 bg-fio-pink/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-amber-300/30 rounded-full blur-3xl pointer-events-none" />

        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Cerrar rótulo de Me Gusta"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Avatar Circular con Video de la Estrellita */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden flex items-center justify-center shadow-xl border-4 border-white bg-gradient-to-tr from-amber-100 via-pink-100 to-purple-100 mb-4">
          <video
            src="/assets/vid-estrellita.mp4"
            preload="auto"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105 pointer-events-none"
          />
          <span className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-tr from-amber-500 to-yellow-400 text-white rounded-full flex items-center justify-center shadow-md animate-bounce">
            <Star className="w-4 h-4 fill-current" />
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-800 text-xs font-bubble font-bold mb-3">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>¡Estrellita by.fio!</span>
          <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
        </div>

        {/* Rótulo con el mensaje solicitado */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 via-pink-50/80 to-amber-50/70 border border-purple-200/80 shadow-inner mb-5">
          <p className="font-bubble font-extrabold text-base sm:text-lg text-purple-950 leading-relaxed">
            ¡Hola ⭐, ya sabemos que te gusta la web de byfio ahora registrate y dejanos tu me gusta, te esperamos..!
          </p>
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => {
              playWaterDropSound();
              onRegister();
            }}
            className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-purple-600 to-fio-pink hover:from-purple-700 hover:to-pink-600 text-white font-bubble font-bold text-sm shadow-clayBtn hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>¡Registrarme ahora!</span>
            <Sparkles className="w-4 h-4 text-fio-yellow" />
          </button>

          <button
            type="button"
            onClick={() => {
              playWaterDropSound();
              onLogin();
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200/80 font-bubble font-bold text-xs sm:text-sm transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-fio-pink" />
            <span>Ya tengo cuenta · Iniciar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};
