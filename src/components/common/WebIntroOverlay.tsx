import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface WebIntroOverlayProps {
  isOpen: boolean;
  onFinish: () => void;
}

export const WebIntroOverlay: React.FC<WebIntroOverlayProps> = ({ isOpen, onFinish }) => {
  const [phase, setPhase] = useState<'gradient-start' | 'video-reveal' | 'video-playing' | 'fading-out'>('gradient-start');
  const [isMuted, setIsMuted] = useState(false); // Empezar con audio activo
  const [progress, setProgress] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const exitTimeoutRef = useRef<number | null>(null);
  const canPlayVideoRef = useRef(false);

  // Desbloqueo universal de audio
  const unlockAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      setIsMuted(false);
      setAudioBlocked(false);
      if (canPlayVideoRef.current) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      }
    }
  };

  // Orquestación: letras por al menos 2 segundos y luego el video dicta el tiempo exacto
  useEffect(() => {
    if (!isOpen) {
      setPhase('gradient-start');
      canPlayVideoRef.current = false;
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      return;
    }

    setPhase('gradient-start');
    setProgress(0);
    setAudioBlocked(false);
    canPlayVideoRef.current = false;

    // Asegurar que el video no inicie antes de que transcurran los 2 segundos de las letras
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    const startVideoPlayback = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsMuted(false);
              setAudioBlocked(false);
            })
            .catch(() => {
              // Si la directiva de seguridad del navegador requiere un primer toque en carga fría:
              if (videoRef.current) {
                videoRef.current.muted = true;
                setIsMuted(true);
                setAudioBlocked(true);
                videoRef.current.play().catch(() => {});
              }
            });
        }
      }
    };

    // 1. Las letras permanecen visibles por al menos 2 segundos (2000ms) antes de quitarlas y dar paso al video
    const t1 = window.setTimeout(() => {
      canPlayVideoRef.current = true;
      setPhase('video-reveal');
      startVideoPlayback();
    }, 2000);

    // 2. Transición fluida a reproducción activa
    const t2 = window.setTimeout(() => {
      setPhase('video-playing');
      if (videoRef.current && videoRef.current.muted && !hasInteracted) {
        unlockAudio();
      }
    }, 2400);

    // 3. Escuchador de desbloqueo táctil/clic global: cualquier toque en pantalla activa el sonido al instante
    const handleGlobalGesture = () => {
      setHasInteracted(true);
      unlockAudio();
      gestureEvents.forEach((evt) => {
        window.removeEventListener(evt, handleGlobalGesture, true);
      });
    };

    const gestureEvents = ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'click'];
    gestureEvents.forEach((evt) => {
      window.addEventListener(evt, handleGlobalGesture, true);
    });

    // NOTA: Se eliminó el temporizador artificial. El video es quien dicta el tiempo:
    // Solo cuando el video termina de reproducirse (onEnded) entra a la web, salvo clic en Saltar Intro.

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      if (exitTimeoutRef.current) {
        window.clearTimeout(exitTimeoutRef.current);
      }
      gestureEvents.forEach((evt) => {
        window.removeEventListener(evt, handleGlobalGesture, true);
      });
    };
  }, [isOpen]);

  // Manejar el término del video (únicamente cuando termina el video o por clic en saltar intro)
  const handleStartExit = () => {
    if (phase === 'fading-out') return;
    setPhase('fading-out');

    if (exitTimeoutRef.current) {
      window.clearTimeout(exitTimeoutRef.current);
    }

    // Esperar a que la transición de opacidad (1100ms) se complete
    exitTimeoutRef.current = window.setTimeout(() => {
      onFinish();
    }, 1100);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress(Math.min(100, (current / total) * 100));
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasInteracted(true);
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      videoRef.current.volume = 1.0;
      setIsMuted(nextMuted);
      if (!nextMuted) {
        setAudioBlocked(false);
        // Si el usuario tardó en activar el sonido en los primeros compases, rebobinar a 0 para disfrutar la melodía completa
        if (videoRef.current.currentTime > 0 && videoRef.current.currentTime < 4) {
          videoRef.current.currentTime = 0;
        }
        videoRef.current.play().catch(() => {});
      }
    }
  };

  // Permitir activar sonido haciendo clic o tocando en cualquier parte de la pantalla
  const handleOverlayTouchOrClick = () => {
    setHasInteracted(true);
    unlockAudio();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleOverlayTouchOrClick}
      onPointerDown={handleOverlayTouchOrClick}
      onTouchStart={handleOverlayTouchOrClick}
      className={`fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden transition-all duration-1000 ease-in-out cursor-pointer ${
        phase === 'fading-out'
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100 pointer-events-auto'
      }`}
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #4A0E78 0%, #2A0845 45%, #120220 100%)',
      }}
    >
      {/* Luces y Luces Ambientales Profesionales con Gradientes Púrpuras Difuminados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Glow púrpura central superior */}
        <div
          className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[42rem] h-[30rem] rounded-full bg-gradient-to-b from-[#A855F7]/35 via-[#7E22CE]/25 to-transparent blur-[120px] transition-all duration-1000 ${
            phase === 'gradient-start' ? 'scale-110 opacity-90' : 'scale-100 opacity-60'
          }`}
        />

        {/* Halo rosado / magenta lateral */}
        <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-[#EC4899]/20 blur-[100px] animate-pulse" />

        {/* Halo dorado / cálido studio */}
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#F59E0B]/15 blur-[120px]" />

        {/* Patrón sutil de cuadrícula etérea */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Presentación inicial de la marca con tipografía oficial en blanco (visible por al menos 2 segundos) */}
      <div
        className={`absolute z-10 flex flex-col items-center text-center px-4 transition-all duration-700 ease-out pointer-events-none ${
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

        {/* Spinner elegante de carga inicial */}
        <div className="mt-5 flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-fio-pink animate-ping" />
          <div className="w-2.5 h-2.5 rounded-full bg-fio-yellow animate-ping delay-150" />
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping delay-300" />
        </div>
      </div>

      {/* Contenedor del Video de Intro */}
      <div
        className={`relative z-20 w-full max-w-4xl px-3 sm:px-4 transition-all duration-1000 ease-out ${
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
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md text-xs font-bubble font-bold transition-all active:scale-95 group ${
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
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/90 hover:bg-white text-fio-900 text-xs font-bubble font-bold shadow-neuBtn hover:shadow-neuBtnHover border border-white transition-all active:scale-95"
            title="Saltar intro y entrar a la web"
          >
            <span>Saltar intro</span>
            <ArrowRight className="w-3.5 h-3.5 text-fio-pink" />
          </button>
        </div>

        {/* Marco Cinemático del Video */}
        <div className="relative aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-black/60 border border-white/25 shadow-[0_25px_80px_rgba(74,14,120,0.7)] backdrop-blur-md">
          <video
            ref={videoRef}
            src="/assets/intro-web-byfio.mp4?v=20261030"
            preload="auto"
            playsInline
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleStartExit}
            onError={handleStartExit}
            className="w-full h-full object-cover"
          />

          {/* Hint interactivo si el navegador retiene audio hasta tocar la pantalla */}
          {isMuted && (
            <div
              onClick={toggleSound}
              className="absolute inset-x-4 bottom-4 sm:bottom-6 z-20 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-amber-400 text-slate-900 text-xs sm:text-sm font-bubble font-bold shadow-2xl cursor-pointer hover:bg-amber-300 transition-all animate-bounce"
            >
              <Volume2 className="w-5 h-5 text-slate-900" />
              <span>¡Toca la pantalla para escuchar la música de By.Fio! 🎵</span>
            </div>
          )}

          {/* Barra de Progreso del Video (Línea Fina Neón) */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-fio-yellow via-fio-pink to-purple-400 transition-all duration-150 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Subtítulo bajo el video */}
        <div className="text-center mt-3 text-purple-200/70 text-[11px] sm:text-xs">
          <span>By.Fio Creative Studio • Ingresando a la plataforma...</span>
        </div>
      </div>
    </div>
  );
};
