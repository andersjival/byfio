import React, { useEffect, useState } from 'react';
import { Star, Sparkles, X, Heart, ArrowRight, ShoppingBag, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { playBubblePopSound, playWaterDropSound } from '../../utils/soundEffects';
import { metricsTracker } from '../../services/metricsTracker';

export const WelcomeStarModal: React.FC = () => {
  const { welcomeStarModal, closeWelcomeStarModal } = useApp();
  const [likedPage, setLikedPage] = useState(false);

  const handlePageLike = () => {
    if (likedPage) return;
    setLikedPage(true);
    playBubblePopSound(0.45);
    metricsTracker.recordLike('home');
  };

  useEffect(() => {
    if (welcomeStarModal?.isOpen) {
      playBubblePopSound(0.5);
      try {
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#ff7597', '#8e54e9', '#ffbe3b', '#6c43b5', '#48bb78'],
        });
      } catch {}
    }
  }, [welcomeStarModal?.isOpen]);

  if (!welcomeStarModal?.isOpen) return null;

  const handleDismiss = () => {
    playWaterDropSound();
    closeWelcomeStarModal();
  };

  const displayName = (welcomeStarModal.userName || 'Creativ@').split(' ')[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mensaje de bienvenida de la estrellita by.fio"
      className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn"
      onClick={handleDismiss}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm sm:max-w-md bg-white/95 rounded-[32px] p-6 sm:p-7 shadow-2xl border-2 border-fio-200/90 text-center overflow-hidden animate-star-alert-in-top"
      >
        {/* Glows ambientales festivos */}
        <div className="absolute -top-16 -left-16 w-44 h-44 bg-fio-pink/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-amber-400/25 rounded-full blur-3xl pointer-events-none" />

        {/* Botón Cerrar (X) */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Cerrar mensaje de bienvenida"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Circular de la Estrellita Mágica */}
        <div className="relative mx-auto w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden flex items-center justify-center shadow-xl border-4 border-white bg-gradient-to-tr from-amber-100 via-pink-100 to-purple-100 mb-4">
          <video
            src="/assets/vid-estrellita.mp4"
            preload="auto"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105 pointer-events-none"
          />
          {/* Insignia animada con estrella */}
          <span className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-tr from-amber-500 to-yellow-400 text-white rounded-full flex items-center justify-center shadow-md animate-bounce">
            <Star className="w-4 h-4 fill-current" />
          </span>
        </div>

        {/* Título y Mensaje de Bienvenida Cálido */}
        <div className="space-y-2 mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/80 text-fio-pink text-xs font-bubble font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>¡Bienvenida Oficial a by.fio!</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bubble font-black text-slate-800 leading-tight">
            ¡Hola, <span className="bg-gradient-to-r from-purple-600 to-fio-pink bg-clip-text text-transparent">{displayName}</span>! ⭐
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
            ¡Qué alegría que formes parte de nuestra comunidad creativa! Tu cuenta ha sido creada exitosamente.
          </p>
        </div>

        {/* Mini tarjetas con beneficios del registro */}
        <div className="space-y-2 mb-5 text-left">
          <div className="p-2.5 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center gap-2.5 text-xs text-slate-700">
            <div className="w-7 h-7 rounded-xl bg-purple-200/80 text-purple-800 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4 text-purple-700" />
            </div>
            <p className="font-sans leading-tight">
              <strong>Compras más rápidas:</strong> Tus datos se autocompletarán en cada pedido.
            </p>
          </div>

          <div className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-center gap-2.5 text-xs text-slate-700">
            <div className="w-7 h-7 rounded-xl bg-amber-200/80 text-amber-800 flex items-center justify-center shrink-0">
              <Gift className="w-4 h-4 text-amber-700" />
            </div>
            <p className="font-sans leading-tight">
              <strong>Beneficios exclusivos:</strong> Consulta promociones y ofertas en <strong>Mi Cuenta</strong>.
            </p>
          </div>
        </div>

        {/* Invitación a darle Me Gusta a la página en el primer registro */}
        <div className="mb-3 rounded-2xl border border-pink-200 bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 p-3 flex items-center justify-between gap-3 text-left">
          <div className="min-w-0">
            <p className="text-xs font-extrabold text-purple-900">
              ¡Apoyanos en tu primer registro!
            </p>
            <p className="text-[11px] text-purple-700/80 leading-tight mt-0.5">
              {likedPage
                ? '¡Gracias por darle Me Gusta a nuestra página! 💖'
                : 'Dale Me Gusta a la página de By.Fio si te encanta crear.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handlePageLike}
            disabled={likedPage}
            className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              likedPage
                ? 'bg-emerald-500 text-white shadow-sm cursor-default'
                : 'bg-pink-500 hover:bg-pink-600 text-white shadow-sm active:scale-95'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${likedPage ? 'fill-white' : ''}`} />
            <span>{likedPage ? '¡Me Gusta!' : 'Me Gusta'}</span>
          </button>
        </div>

        {/* Botón de Acción Principal */}
        <button
          type="button"
          onClick={handleDismiss}
          className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-purple-600 to-fio-pink hover:from-purple-700 hover:to-pink-600 text-white font-bubble font-bold text-sm shadow-clayBtn hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>¡Empezar a Explorar la Web!</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[10px] text-slate-400 mt-3 flex items-center justify-center gap-1">
          <Heart className="w-3 h-3 text-fio-pink fill-fio-pink" />
          <span>Hecho a mano con amor en Costa Rica</span>
        </p>
      </div>
    </div>
  );
};
