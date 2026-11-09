import React, { useState, useEffect, useRef } from 'react';
import { Volume2, ArrowRight, ShoppingBag } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { isHomeLocation } from '../../utils/routeHelpers';
import { safeSessionStorage } from '../../utils/safeStorage';

interface WebIntroOverlayProps {
  isOpen: boolean;
  onFinish: () => void;
  onSelectOrders?: () => void;
  onSelectStore?: () => void;
}

export const WebIntroOverlay: React.FC<WebIntroOverlayProps> = ({
  isOpen,
  onFinish,
  onSelectStore,
}) => {
  const [phase, setPhase] = useState<'gradient-start' | 'video-reveal' | 'video-playing' | 'fading-out'>('gradient-start');
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const exitTimeoutRef = useRef<number | null>(null);
  const canPlayVideoRef = useRef(false);
  const hasInteractedRef = useRef(false);
  const isExitingRef = useRef(false);

  // Desbloqueo universal de audio
  const unlockAudio = () => {
    hasInteractedRef.current = true;
    setIsMuted(false);
    if (videoRef.current) {
      try {
        videoRef.current.muted = false;
        try { videoRef.current.volume = 1.0; } catch {}
        if (canPlayVideoRef.current && videoRef.current.paused) {
          const p = videoRef.current.play();
          if (p !== undefined) p.catch(() => {});
        }
      } catch {}
    }
  };

  // Salida suave cuando termina el video o el usuario decide salir
  const handleStartExit = (_force = false) => {
    if (isExitingRef.current) return;
    isExitingRef.current = true;
    setPhase('fading-out');

    try {
      safeSessionStorage.setItem('byfio_seen_web_intro', '1');
    } catch {}

    if (exitTimeoutRef.current) {
      window.clearTimeout(exitTimeoutRef.current);
    }

    exitTimeoutRef.current = window.setTimeout(() => {
      onFinish();
    }, 500);
  };

  useEffect(() => {
    if (!isOpen) {
      setPhase('gradient-start');
      canPlayVideoRef.current = false;
      isExitingRef.current = false;
      if (videoRef.current) {
        try {
          videoRef.current.pause();
          if (videoRef.current.readyState >= 1) {
            videoRef.current.currentTime = 0;
          }
        } catch {}
      }
      return;
    }

    setPhase('gradient-start');
    setProgress(0);
    canPlayVideoRef.current = false;
    isExitingRef.current = false;

    if (videoRef.current) {
      try {
        videoRef.current.pause();
        if (videoRef.current.readyState >= 1) {
          videoRef.current.currentTime = 0;
        }
      } catch {}
    }

    const startVideoPlayback = () => {
      if (!videoRef.current) return;
      try {
        if (videoRef.current.readyState >= 1) {
          videoRef.current.currentTime = 0;
        }

        // Entrar automáticamente CON MÚSICA activada
        videoRef.current.muted = false;
        try { videoRef.current.volume = 1.0; } catch {}
        setIsMuted(false);

        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Éxito: video reproduciéndose con música automáticamente
              setIsMuted(false);
            })
            .catch(() => {
              // Si la directiva de seguridad del navegador bloquea audio antes de cualquier toque:
              // Reproducir con video de inmediato y desmutear al primer toque
              if (videoRef.current) {
                videoRef.current.muted = true;
                setIsMuted(true);
                videoRef.current.play().catch(() => {
                  handleStartExit(true);
                });
              }
            });
        }
      } catch {
        handleStartExit(true);
      }
    };

    // 1. Mostrar logotipo inicial 800ms para transición fluida
    const t1 = window.setTimeout(() => {
      canPlayVideoRef.current = true;
      setPhase('video-reveal');
      startVideoPlayback();
    }, 800);

    // 2. Transición a reproducción activa
    const t2 = window.setTimeout(() => {
      setPhase('video-playing');
    }, 1100);

    // 3. Fallback de seguridad extendido (15s) para dar margen completo al video de 10s
    // El video termina naturalmente mediante el evento onEnded
    const tSafety = window.setTimeout(() => {
      handleStartExit(true);
    }, 15000);

    // 4. Cualquier interacción en la pantalla desmutea el audio inmediatamente si el navegador lo bloqueó
    const handleGlobalGesture = () => {
      hasInteractedRef.current = true;
      unlockAudio();
    };

    const gestureEvents = ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'click'];
    gestureEvents.forEach((evt) => {
      window.addEventListener(evt, handleGlobalGesture, { capture: true, once: true });
    });

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(tSafety);
      if (exitTimeoutRef.current) {
        window.clearTimeout(exitTimeoutRef.current);
      }
      gestureEvents.forEach((evt) => {
        window.removeEventListener(evt, handleGlobalGesture, true);
      });
    };
  }, [isOpen]);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress(Math.min(100, (current / total) * 100));
    }
  };

  const toggleSound = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    hasInteractedRef.current = true;
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      videoRef.current.volume = 1.0;
      setIsMuted(nextMuted);
    }
  };

  if (!isOpen || !isHomeLocation()) return null;

  return (
    <div
      onClick={() => handleStartExit()}
      className={`fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden transition-all duration-500 ease-in-out cursor-pointer select-none ${
        phase === 'fading-out'
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100 pointer-events-auto'
      }`}
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #4A0E78 0%, #2A0845 45%, #120220 100%)',
      }}
    >
      {/* Luces Ambientales Profesionales */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[42rem] h-[30rem] rounded-full bg-gradient-to-b from-[#A855F7]/35 via-[#7E22CE]/25 to-transparent blur-[120px] transition-all duration-700 ${
            phase === 'gradient-start' ? 'scale-110 opacity-90' : 'scale-100 opacity-60'
          }`}
        />
        <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-[#EC4899]/20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#F59E0B]/15 blur-[120px]" />
      </div>

      {/* Presentación inicial de la marca (800ms) */}
      <div
        className={`absolute z-10 flex flex-col items-center text-center px-4 transition-all duration-500 ease-out pointer-events-none ${
          phase === 'gradient-start'
            ? 'opacity-100 scale-100 blur-0'
            : 'opacity-0 scale-95 blur-md'
        } ${phase === 'video-playing' || phase === 'fading-out' ? 'hidden' : ''}`}
      >
        <div className="relative mb-2 flex items-center justify-center">
          <BrandLogo
            size="hero"
            showSlogan={true}
            textColor="text-white"
            sloganColor="text-white/85"
            align="center"
          />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-fio-pink animate-ping" />
          <div className="w-2.5 h-2.5 rounded-full bg-fio-yellow animate-ping delay-150" />
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping delay-300" />
        </div>
      </div>

      {/* Contenedor del Video de Intro */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative z-20 w-full max-w-4xl px-3 sm:px-4 transition-all duration-500 ease-out ${
          phase === 'video-reveal' || phase === 'video-playing'
            ? 'opacity-100 scale-100 translate-y-0 blur-0'
            : 'opacity-0 scale-95 translate-y-4 blur-sm pointer-events-none'
        }`}
      >
        {/* Barra Superior con Controles Táctiles (Sonido + Saltar Intro) */}
        <div className="flex items-center justify-between gap-3 mb-3 px-2">
          {/* Botón de Sonido Mute / Unmute */}
          <button
            type="button"
            onClick={toggleSound}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md text-xs font-bubble font-bold transition-all active:scale-95 group cursor-pointer ${
              isMuted
                ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30 shadow-lg'
                : 'bg-white/20 text-emerald-200 border border-white/25 shadow-lg'
            }`}
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? (
              <>
                <Volume2 className="w-4 h-4 text-white" />
                <span>Activar sonido 🔊</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-300 animate-pulse" />
                <span className="text-emerald-100">Sonido activo 🎵</span>
              </>
            )}
          </button>

          {/* Botón Saltar Intro */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleStartExit();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/95 hover:bg-white text-fio-900 text-xs font-bubble font-bold shadow-neuBtn hover:shadow-neuBtnHover border border-white transition-all active:scale-95 cursor-pointer"
            title="Saltar intro y entrar a la web"
          >
            <span>Saltar intro</span>
            <ArrowRight className="w-3.5 h-3.5 text-fio-pink" />
          </button>
        </div>

        {/* Marco Cinemático del Video con soporte nativo Safari/iOS/Android */}
        <div className="relative aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-black/60 border border-white/25 shadow-[0_25px_80px_rgba(74,14,120,0.7)] backdrop-blur-md">
          <video
            ref={videoRef}
            src="/assets/intro-web-byfio.mp4?v=20261109"
            preload="auto"
            playsInline
            muted={isMuted}
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => handleStartExit(true)}
            onError={() => handleStartExit(true)}
            className="w-full h-full object-cover"
          />

          {/* Barra de Progreso del Video */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-fio-yellow via-fio-pink to-purple-400 transition-all duration-150 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Acceso Directo de Entrada a la Tienda */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 mt-3 px-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleStartExit();
              onSelectStore?.();
            }}
            className="w-full max-w-[220px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bubble font-bold text-xs sm:text-sm shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span>Entrar a la Tienda</span>
          </button>
        </div>

        {/* Subtítulo bajo el video con acción rápida */}
        <div className="text-center mt-2.5 text-purple-200/70 text-[11px] sm:text-xs">
          <span>By.Fio Creative Studio • Toca en cualquier lugar para saltar y entrar</span>
        </div>
      </div>
    </div>
  );
};
