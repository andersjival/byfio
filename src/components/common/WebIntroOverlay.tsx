import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, ArrowRight, Sparkles } from 'lucide-react';

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
  const finishTimeoutRef = useRef<number | null>(null);

  // Fase 1 y 2: Orquestación de inicio
  useEffect(() => {
    if (!isOpen) {
      setPhase('gradient-start');
      return;
    }

    setPhase('gradient-start');
    setProgress(0);
    setAudioBlocked(false);

    // 1. Mostrar gradiente púrpura profesional 850ms con logo HD
    const t1 = window.setTimeout(() => {
      setPhase('video-reveal');
    }, 850);

    // 2. Revelar video e iniciar reproducción con audio activado
    const t2 = window.setTimeout(() => {
      setPhase('video-playing');
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false; // Empezar con audio
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsMuted(false);
              setAudioBlocked(false);
            })
            .catch(() => {
              // Si la directiva de seguridad del navegador requiere interacción para desmutear:
              if (videoRef.current) {
                videoRef.current.muted = true;
                setIsMuted(true);
                setAudioBlocked(true);
                videoRef.current.play();
              }
            });
        }
      }
    }, 1400);

    // 3. Fallback de seguridad: Si el evento onEnded no dispara en 12 segundos, salir
    const t3 = window.setTimeout(() => {
      handleStartExit();
    }, 12500);

    finishTimeoutRef.current = t3;

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [isOpen]);

  // Manejar el término del video (desaparece lentamente hacia la web)
  const handleStartExit = () => {
    if (phase === 'fading-out') return;
    setPhase('fading-out');

    if (finishTimeoutRef.current) {
      window.clearTimeout(finishTimeoutRef.current);
    }

    // Esperar a que la transición de opacidad (1100ms) se complete
    window.setTimeout(() => {
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
      setIsMuted(nextMuted);
    }
  };

  // Permitir activar sonido haciendo clic en cualquier parte del video
  const handleOverlayClick = () => {
    if (isMuted && videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);
      setHasInteracted(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleOverlayClick}
      className={`fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden transition-all duration-1000 ease-in-out ${
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

      {/* Tarjeta de bienvenida inicial que se difumina con Imagen de la Marca HD */}
      <div
        className={`absolute z-10 flex flex-col items-center text-center px-4 transition-all duration-700 ease-out pointer-events-none ${
          phase === 'gradient-start'
            ? 'opacity-100 scale-100 blur-0'
            : 'opacity-0 scale-95 blur-md'
        }`}
      >
        <div className="relative mb-3 flex items-center justify-center">
          {/* Resplandor suave detrás de la imagen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-fio-pink/35 via-purple-500/40 to-fio-yellow/30 rounded-full blur-2xl scale-125 animate-pulse" />
          <img
            src="/assets/logo-byfio-lila-HD.png"
            alt="by.fio"
            className="relative w-36 h-36 sm:w-48 sm:h-48 object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.55)] transition-transform duration-700 hover:scale-105"
          />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-semibold tracking-widest uppercase mb-2 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-fio-yellow fill-fio-yellow animate-spin" />
          <span>Experiencia Oficial</span>
        </div>

        <p className="text-xs sm:text-sm font-serif italic text-purple-200/90 tracking-widest uppercase">
          Talleres Creativos &amp; Tienda Online • Costa Rica 🇨🇷
        </p>

        {/* Spinner elegante de carga inicial */}
        <div className="mt-5 flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-fio-pink animate-ping" />
          <div className="w-2.5 h-2.5 rounded-full bg-fio-yellow animate-ping delay-150" />
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping delay-300" />
        </div>
      </div>

      {/* Contenedor del Video de Intro */}
      <div
        className={`relative z-20 w-full max-w-4xl mx-4 transition-all duration-1000 ease-out ${
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
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-medium border border-white/25 shadow-lg transition-all active:scale-95 group"
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-purple-200 group-hover:text-white" />
                <span>Activar sonido</span>
                <span className="hidden sm:inline text-[10px] bg-purple-500/40 px-1.5 py-0.5 rounded-full text-purple-100">
                  Audio HD
                </span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-300 animate-pulse" />
                <span className="text-emerald-100">Sonido activo</span>
              </>
            )}
          </button>

          {/* Botón Saltar Intro / Entrar Directo */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleStartExit();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/90 hover:bg-white text-fio-900 text-xs font-bubble font-bold shadow-neuBtn hover:shadow-neuBtnHover border border-white transition-all active:scale-95"
            title="Saltar y entrar a la web"
          >
            <span>Entrar a la web</span>
            <ArrowRight className="w-3.5 h-3.5 text-fio-pink" />
          </button>
        </div>

        {/* Marco Cinemático del Video */}
        <div className="relative aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-black/60 border border-white/25 shadow-[0_25px_80px_rgba(74,14,120,0.7)] backdrop-blur-md">
          <video
            ref={videoRef}
            src="/assets/intro-web-byfio.mp4"
            poster="/assets/logo-byfio-lila-HD.png"
            playsInline
            autoPlay
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleStartExit}
            className="w-full h-full object-cover"
          />

          {/* Hint sutil para activar sonido si el navegador lo bloqueó */}
          {isMuted && phase === 'video-playing' && (
            <div
              onClick={toggleSound}
              className="absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-950/85 backdrop-blur-md text-white text-xs font-semibold border border-purple-400/40 cursor-pointer hover:bg-fio-pink transition-all shadow-lg animate-bounce"
            >
              <Volume2 className="w-4 h-4 text-fio-yellow" />
              <span>Toca aquí para escuchar el video 🎵</span>
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
