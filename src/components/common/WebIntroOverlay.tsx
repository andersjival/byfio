import React, { useState, useEffect, useRef } from 'react';
import { Volume2, ArrowRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { isHomeLocation } from '../../utils/routeHelpers';
import { safeSessionStorage } from '../../utils/safeStorage';

interface WebIntroOverlayProps {
  isOpen: boolean;
  onFinish: () => void;
}

const isMobileOrTabletDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent || (window.navigator as any).vendor || '';
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet|Silk/i.test(ua);
  const isIPad = /Macintosh/i.test(ua) && Boolean(navigator.maxTouchPoints && navigator.maxTouchPoints > 1);
  const isTouchScreen = ('ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)) && window.innerWidth <= 1024;
  return Boolean(isMobileUA || isIPad || isTouchScreen);
};

export const WebIntroOverlay: React.FC<WebIntroOverlayProps> = ({ isOpen, onFinish }) => {
  const [phase, setPhase] = useState<'gradient-start' | 'video-reveal' | 'video-playing' | 'fading-out'>('gradient-start');
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const exitTimeoutRef = useRef<number | null>(null);
  const canPlayVideoRef = useRef(false);
  const hasInteractedRef = useRef(false);
  const isExitingRef = useRef(false);
  const isMobile = useRef(isMobileOrTabletDevice()).current;
  const enterTimeRef = useRef<number>(
    typeof window !== 'undefined' && (window as any).__byfio_start_time
      ? (window as any).__byfio_start_time
      : Date.now()
  );

  // Desbloqueo universal de audio tras interacción
  const unlockAudio = () => {
    hasInteractedRef.current = true;
    setIsMuted(false);
    if (videoRef.current) {
      try {
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
        if (canPlayVideoRef.current) {
          const p = videoRef.current.play();
          if (p !== undefined) p.catch(() => {});
        }
      } catch {}
    }
  };

  // Salida suave y rápida
  const handleStartExit = (force = false) => {
    if (isExitingRef.current) return;
    if (isMobile && !force) {
      const elapsed = Date.now() - enterTimeRef.current;
      if (elapsed < 3000) return;
    }
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

  // Orquestación rápida y blindada para Safari / Android
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

    // MODO MÓVIL: No cargar video, mantener pantalla de marca y 3 puntos mínimo 3 segundos
    if (isMobile) {
      setPhase('gradient-start');
      isExitingRef.current = false;


      const elapsed = Date.now() - enterTimeRef.current;
      const minDuration = 3200; // Garantizar mínimo 3.2 segundos en pantalla de carga
      const remainingTime = Math.max(800, minDuration - elapsed);

      const mobileTimer = window.setTimeout(() => {
        handleStartExit(true);
      }, remainingTime);

      return () => {
        window.clearTimeout(mobileTimer);
        if (exitTimeoutRef.current) {
          window.clearTimeout(exitTimeoutRef.current);
        }
      };
    }

    // MODO ESCRITORIO: Video completo
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

        if (hasInteractedRef.current) {
          videoRef.current.muted = false;
          videoRef.current.volume = 1.0;
          setIsMuted(false);
        } else {
          videoRef.current.muted = true;
          setIsMuted(true);
        }

        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              if (hasInteractedRef.current) {
                setIsMuted(false);
              }
            })
            .catch(() => {
              if (videoRef.current) {
                videoRef.current.muted = true;
                setIsMuted(true);
                videoRef.current.play().catch(() => {
                  handleStartExit();
                });
              }
            });
        }
      } catch {
        handleStartExit();
      }
    };

    // 1. Letras por 800ms para impacto instantáneo sin esperas lentas
    const t1 = window.setTimeout(() => {
      canPlayVideoRef.current = true;
      setPhase('video-reveal');
      startVideoPlayback();
    }, 800);

    // 2. Transición fluida a reproducción activa
    const t2 = window.setTimeout(() => {
      setPhase('video-playing');
    }, 1100);

    // 3. Fallback de máxima seguridad reducido a 5s para que NUNCA se trabe en iPhone Safari
    const tSafety = window.setTimeout(() => {
      handleStartExit();
    }, 5000);

    // 4. Cualquier toque en pantalla activa el sonido
    const handleGlobalGesture = () => {
      hasInteractedRef.current = true;
      unlockAudio();
      gestureEvents.forEach((evt) => {
        window.removeEventListener(evt, handleGlobalGesture, true);
      });
    };

    const gestureEvents = ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'click'];
    gestureEvents.forEach((evt) => {
      window.addEventListener(evt, handleGlobalGesture, true);
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
      if (!nextMuted) {
        try {
          if (videoRef.current.currentTime > 0 && videoRef.current.currentTime < 4 && videoRef.current.readyState >= 1) {
            videoRef.current.currentTime = 0;
          }
          videoRef.current.play().catch(() => {});
        } catch {}
      }
    }
  };

  if (!isOpen || !isHomeLocation()) return null;

  // En dispositivos móviles (iPhone, Android, Tablet), no renderizar ni descargar el video:
  if (isMobile) {
    return (
      <div
        onClick={() => handleStartExit(false)}
        className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden transition-all duration-500 ease-in-out select-none ${
          phase === 'fading-out'
            ? 'opacity-0 scale-105 pointer-events-none'
            : 'opacity-100 scale-100 pointer-events-auto'
        }`}
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, #4A0E78 0%, #2A0845 45%, #120220 100%)',
        }}
      >
        {/* Luces Ambientales */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[32rem] h-[24rem] rounded-full bg-gradient-to-b from-[#A855F7]/35 via-[#7E22CE]/25 to-transparent blur-[100px]" />
          <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-[#EC4899]/20 blur-[90px] animate-pulse" />
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#F59E0B]/15 blur-[100px]" />
        </div>

        {/* Presentación móvil limpia: Logo By.Fio + 3 puntitos animados */}
        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <div className="relative mb-2 flex items-center justify-center">
            <BrandLogo
              size="hero"
              showSlogan={true}
              textColor="text-white"
              sloganColor="text-white/85"
              align="center"
            />
          </div>
          <div className="mt-6 flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-fio-pink animate-ping" />
            <div className="w-2.5 h-2.5 rounded-full bg-fio-yellow animate-ping delay-150" />
            <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping delay-300" />
          </div>
        </div>
      </div>
    );
  }

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
                ? 'bg-amber-400 text-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.6)] animate-pulse'
                : 'bg-white/20 text-emerald-200 border border-white/25 shadow-lg'
            }`}
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? (
              <>
                <Volume2 className="w-4 h-4 text-slate-900 animate-bounce" />
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

        {/* Marco Cinemático del Video con soporte nativo Safari/iOS */}
        <div className="relative aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-black/60 border border-white/25 shadow-[0_25px_80px_rgba(74,14,120,0.7)] backdrop-blur-md">
          <video
            ref={videoRef}
            src="/assets/intro-web-byfio.mp4?v=20261104"
            preload="metadata"
            playsInline
            muted={isMuted}
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => handleStartExit(true)}
            onError={() => handleStartExit(true)}
            onWaiting={() => {
              window.setTimeout(() => {
                if (videoRef.current && videoRef.current.paused) {
                  handleStartExit();
                }
              }, 1500);
            }}
            className="w-full h-full object-cover"
          />

          {/* Hint interactivo para activar música */}
          {isMuted && (
            <div
              onClick={toggleSound}
              className="absolute inset-x-4 bottom-4 sm:bottom-6 z-20 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-400 text-slate-900 text-xs sm:text-sm font-bubble font-bold shadow-2xl cursor-pointer hover:bg-amber-300 transition-all animate-bounce"
            >
              <Volume2 className="w-4 h-4 text-slate-900" />
              <span>¡Toca aquí para escuchar la música de By.Fio! 🎵</span>
            </div>
          )}

          {/* Barra de Progreso del Video */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-fio-yellow via-fio-pink to-purple-400 transition-all duration-150 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Subtítulo bajo el video con acción rápida */}
        <div className="text-center mt-3 text-purple-200/70 text-[11px] sm:text-xs">
          <span>By.Fio Creative Studio • Toca en cualquier lugar para saltar y entrar</span>
        </div>
      </div>
    </div>
  );
};
