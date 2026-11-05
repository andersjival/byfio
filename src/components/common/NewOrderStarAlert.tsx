import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Heart, Star, ShoppingBag, Clock, Check } from 'lucide-react';
import { playWaterDropSound, playBubblePopSound } from '../../utils/soundEffects';

export const NewOrderStarAlert: React.FC = () => {
  const { newOrderAlert, closeNewOrderAlert, starAlertDuration } = useApp();
  const [isExiting, setIsExiting] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (newOrderAlert) {
      setIsExiting(false);
      setElapsedSeconds(0);
      playBubblePopSound(0.35);

      // Limpiar temporizador previo si existiera
      if (intervalRef.current) clearInterval(intervalRef.current);

      // Ticker de 1 segundo para sumar segundos continuamente
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [newOrderAlert]);

  // Si está configurado para auto-cierre con segundos fijos (5, 10, 15, 20s)
  useEffect(() => {
    if (typeof starAlertDuration === 'number' && starAlertDuration > 0 && newOrderAlert) {
      if (elapsedSeconds >= starAlertDuration && !isExiting) {
        handleDismiss();
      }
    }
  }, [elapsedSeconds, starAlertDuration, newOrderAlert, isExiting]);

  if (!newOrderAlert) return null;

  const handleDismiss = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    playWaterDropSound();
    setIsExiting(true);

    // Esperar a que concluya la animación de salida hacia abajo
    setTimeout(() => {
      closeNewOrderAlert();
      setIsExiting(false);
      setElapsedSeconds(0);
    }, 550);
  };

  // Variables de tiempo y barra de progreso
  const isTimedAutoClose = typeof starAlertDuration === 'number' && starAlertDuration > 0;
  const currentMinutes = Math.floor(elapsedSeconds / 60);
  const currentCycleSeconds = elapsedSeconds % 60;

  // Si es manual: se llena de 0% a 100% cada 60s (1 minuto) y reinicia al minuto siguiente
  // Si es con segundos fijos: se llena de 0% a 100% a lo largo de esos segundos
  const progressPercent = isTimedAutoClose
    ? Math.min(100, Math.round(((elapsedSeconds) / starAlertDuration) * 100))
    : Math.min(100, Math.round(((currentCycleSeconds + 1) / 60) * 100));

  const remainingSeconds = isTimedAutoClose ? Math.max(0, starAlertDuration - elapsedSeconds) : 0;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed inset-0 z-[120] flex items-center justify-center p-4 transition-all duration-300 ${
        isExiting ? 'bg-black/0 pointer-events-none' : 'bg-black/40 backdrop-blur-xs'
      }`}
      onClick={handleDismiss}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-sm sm:max-w-md bg-white/95 dark:bg-[#1a142a]/95 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-fio-200/90 dark:border-purple-500/40 text-center overflow-hidden ${
          isExiting
            ? 'animate-star-alert-down'
            : 'animate-star-alert-in-top'
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
          title="Cerrar notificación"
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
        <h3 className="font-bubble font-black text-xl sm:text-2xl text-fio-900 dark:text-purple-100 tracking-wide mt-1 leading-snug">
          Hemos recibido un nuevo pedido
        </h3>

        {/* Detalle del Pedido si está disponible */}
        {newOrderAlert.orderNumber && (
          <div className="mt-2.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/40 border border-purple-200/80 dark:border-purple-700/50 text-xs sm:text-sm font-bubble font-bold text-purple-900 dark:text-purple-200">
            <ShoppingBag className="w-4 h-4 text-fio-pink shrink-0" />
            <span>Pedido {newOrderAlert.orderNumber}</span>
          </div>
        )}

        {/* Bloque de Tiempo y Barra de Progreso */}
        <div className="mt-3.5 px-3.5 py-2.5 rounded-2xl bg-purple-50/70 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800/40 text-center">
          <div className="flex items-center justify-between text-xs font-bubble font-bold text-slate-700 dark:text-purple-200 mb-1.5">
            <span className="flex items-center gap-1.5 text-fio-pink dark:text-pink-300">
              <Clock className="w-3.5 h-3.5" />
              <span>{isTimedAutoClose ? 'Cierre automático' : `Minuto ${currentMinutes + 1} en curso`}</span>
            </span>
            <span className="font-mono text-purple-900 dark:text-purple-100 bg-white dark:bg-purple-950 px-2 py-0.5 rounded-full border border-purple-200/80 shadow-2xs">
              {isTimedAutoClose
                ? `${remainingSeconds}s`
                : `${String(currentMinutes).padStart(2, '0')}:${String(currentCycleSeconds).padStart(2, '0')} min`}
            </span>
          </div>

          {/* Barra de progreso que se llena con cada segundo */}
          <div className="w-full h-2 bg-slate-200/80 dark:bg-purple-950/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-fio-pink via-purple-500 to-amber-400 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[10px] text-slate-500 dark:text-purple-300/70 mt-1.5 font-medium">
            {isTimedAutoClose
              ? `Auto-descarte en ${remainingSeconds}s (${elapsedSeconds}s transcurridos)`
              : `${currentCycleSeconds}s de 60s • Cierre manual requerido`}
          </p>
        </div>

        {/* Botón Principal para Cerrar Manualmente */}
        <div className="mt-3.5">
          <button
            type="button"
            onClick={handleDismiss}
            className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-purple-700 via-fio-pink to-purple-800 hover:opacity-95 text-white font-bubble font-bold text-xs sm:text-sm shadow-clayBtn transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 text-fio-yellow stroke-[3]" />
            <span>Entendido / Cerrar Alerta</span>
          </button>
        </div>
      </div>
    </div>
  );
};
