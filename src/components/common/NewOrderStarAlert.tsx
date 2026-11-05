import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Heart, Star, ShoppingBag } from 'lucide-react';
import { playWaterDropSound, playBubblePopSound } from '../../utils/soundEffects';

export const NewOrderStarAlert: React.FC = () => {
  const { newOrderAlert, closeNewOrderAlert } = useApp();
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (newOrderAlert) {
      setIsExiting(false);
      playBubblePopSound(0.35);

      // Permanece en el centro de la pantalla unos segundos (6.5s) antes de salir
      timerRef.current = setTimeout(() => {
        handleDismiss();
      }, 6500);

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [newOrderAlert]);

  if (!newOrderAlert) return null;

  const handleDismiss = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    playWaterDropSound();
    setIsExiting(true);

    // Esperar a que concluya la animación de salida hacia abajo
    setTimeout(() => {
      closeNewOrderAlert();
      setIsExiting(false);
    }, 650);
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed inset-0 z-[120] flex items-center justify-center p-4 transition-all duration-300 ${
        isExiting ? 'bg-black/0 pointer-events-none' : 'bg-black/35 backdrop-blur-xs'
      }`}
      onClick={handleDismiss}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-sm sm:max-w-md bg-white/95 dark:bg-[#1a142a]/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-fio-200/90 dark:border-purple-500/40 text-center overflow-hidden ${
          isExiting
            ? 'animate-star-alert-down'
            : 'animate-in zoom-in-90 fade-in slide-in-from-top-6 duration-400 ease-out'
        }`}
      >
        {/* Glow ambiental decorativo */}
        <div className="absolute -top-16 -left-16 w-44 h-44 bg-fio-pink/20 dark:bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-amber-400/20 dark:bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Botón X de Cierre en la esquina superior derecha */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-purple-900/40 transition-colors cursor-pointer"
          aria-label="Cerrar notificación de pedido"
          title="Cerrar"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Avatar Circular con Video de la Estrellita */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden flex items-center justify-center shadow-xl border-4 border-white dark:border-purple-900/60 bg-gradient-to-tr from-amber-100 via-pink-100 to-purple-100">
          <video
            src="/assets/vid-estrellita.mp4"
            preload="metadata"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105 pointer-events-none"
          />
          {/* Insignia de Corazón Animada */}
          <span className="absolute -top-1 -right-1 w-7 h-7 bg-fio-pink text-white rounded-full flex items-center justify-center shadow-md animate-bounce">
            <Heart className="w-4 h-4 fill-current" />
          </span>
        </div>

        {/* Etiqueta superior */}
        <div className="mt-3.5 flex items-center justify-center gap-1.5 text-xs font-bubble font-bold text-fio-pink dark:text-pink-300">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>by.fio Notificaciones</span>
        </div>

        {/* Mensaje Solicitado: "Hemos recibido un nuevo pedido" */}
        <h3 className="font-bubble font-black text-xl sm:text-2xl text-fio-900 dark:text-purple-100 tracking-wide mt-1.5 leading-snug">
          Hemos recibido un nuevo pedido
        </h3>

        {/* Detalle del Pedido si está disponible */}
        {newOrderAlert.orderNumber && (
          <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/40 border border-purple-200/80 dark:border-purple-700/50 text-xs sm:text-sm font-bubble font-bold text-purple-900 dark:text-purple-200">
            <ShoppingBag className="w-4 h-4 text-fio-pink shrink-0" />
            <span>Pedido {newOrderAlert.orderNumber}</span>
          </div>
        )}

        {/* Barra de progreso visual de auto-descarte */}
        <div className="mt-5 w-full h-1.5 bg-slate-100 dark:bg-purple-900/30 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-fio-pink via-purple-500 to-amber-400 rounded-full animate-star-alert-progress" />
        </div>
      </div>
    </div>
  );
};
