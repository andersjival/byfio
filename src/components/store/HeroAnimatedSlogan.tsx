import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, Heart } from 'lucide-react';

export const HeroAnimatedSlogan: React.FC = () => {
  const { isIntroOpen } = useApp();

  const FULL_PHRASE = 'Aprendé, creá y emprendé con';

  const [showBadge, setShowBadge] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showStar, setShowStar] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [showByfio, setShowByfio] = useState(false);
  const [bouncedIndex, setBouncedIndex] = useState<number | null>(null);

  const prevIntroOpenRef = useRef(isIntroOpen);
  const timeoutsRef = useRef<number[]>([]);
  const typingIntervalRef = useRef<number | null>(null);

  const clearAllTimers = () => {
    timeoutsRef.current.forEach((t) => window.clearTimeout(t));
    timeoutsRef.current = [];
    if (typingIntervalRef.current) {
      window.clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
  };

  const startChoreography = () => {
    clearAllTimers();

    // Estado inicial en limpio
    setShowBadge(false);
    setTypedText('');
    setIsTyping(false);
    setShowStar(false);
    setShowHeart(false);
    setShowByfio(false);

    // 1. DE PRIMERO APARECE SUAVEMENTE: ¡Transformá tu creatividad en tu mejor proyecto! (a los 250ms)
    const tBadge = window.setTimeout(() => {
      setShowBadge(true);
    }, 250);
    timeoutsRef.current.push(tBadge);

    // 2. 1 SEGUNDO DESPUÉS (1000ms): Aparece que se escribe el texto "Aprendé, creá y emprendé con" (más lento y legible)
    const t1 = window.setTimeout(() => {
      setIsTyping(true);
      let charIndex = 0;

      // 75ms por letra para un ritmo sereno, elegante y fácil de leer
      typingIntervalRef.current = window.setInterval(() => {
        charIndex += 1;
        setTypedText(FULL_PHRASE.slice(0, charIndex));

        if (charIndex >= FULL_PHRASE.length) {
          if (typingIntervalRef.current) {
            window.clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
          }
          setIsTyping(false);

          // 3. OTRO SEGUNDO DESPUÉS (1000ms después de terminar la escritura):
          const t2 = window.setTimeout(() => {
            // Paso A: Aparece la estrella
            setShowStar(true);

            // Paso B: Después aparece el corazón (400ms después)
            const t3 = window.setTimeout(() => {
              setShowHeart(true);

              // Paso C: Y en el centro aparece suavemente la palabra BYFIO (400ms después)
              const t4 = window.setTimeout(() => {
                setShowByfio(true);
              }, 400);
              timeoutsRef.current.push(t4);
            }, 400);
            timeoutsRef.current.push(t3);
          }, 1000);
          timeoutsRef.current.push(t2);
        }
      }, 75);
    }, 1000);

    timeoutsRef.current.push(t1);
  };

  useEffect(() => {
    // Si la intro se acaba de cerrar (pasó de true a false)
    if (prevIntroOpenRef.current && !isIntroOpen) {
      startChoreography();
    } else if (!isIntroOpen && typedText === '') {
      // Carga inicial sin intro abierta
      startChoreography();
    } else if (isIntroOpen) {
      // Si la intro está en reproducción activa, mantener en reposo
      clearAllTimers();
      setShowBadge(false);
      setTypedText('');
      setIsTyping(false);
      setShowStar(false);
      setShowHeart(false);
      setShowByfio(false);
    }

    prevIntroOpenRef.current = isIntroOpen;

    return () => {
      clearAllTimers();
    };
  }, [isIntroOpen]);

  const letters = [
    { char: 'B', delay: '0s' },
    { char: 'Y', delay: '0.1s' },
    { char: 'F', delay: '0.2s' },
    { char: 'I', delay: '0.3s' },
    { char: 'O', delay: '0.4s' },
  ];

  const handleLetterClick = (idx: number) => {
    setBouncedIndex(idx);
    setTimeout(() => setBouncedIndex(null), 350);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 select-none w-full max-w-4xl mx-auto">
      {/* 1. SECCIÓN QUE APARECE DE PRIMERO SUAVEMENTE: ¡Transformá tu creatividad en tu mejor proyecto! */}
      <div className="flex items-center justify-center min-h-[38px]">
        <div
          className={`inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/95 dark:bg-[#1E1B2E] border border-fio-200/60 dark:border-purple-800/60 shadow-claySm transition-all duration-1000 ease-out transform ${
            showBadge
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}
        >
          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFF07C] fill-[#FFF07C]" />
          <span className="text-[11px] sm:text-sm font-bubble font-bold text-fio-900 dark:text-purple-100">
            ¡Transformá tu creatividad en tu mejor proyecto!
          </span>
          <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-fio-pink fill-fio-pink" />
        </div>
      </div>

      {/* 2. TÍTULO PRINCIPAL: Texto escrito pausadamente + Estrella + Corazón + BYFIO en el centro */}
      <div className="space-y-2 sm:space-y-3 w-full">
        {/* Línea 1: Texto escrito letra a letra de forma pausada y serena */}
        <span className="block text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bubble font-bold text-slate-800 dark:text-slate-100 min-h-[1.3em] transition-all">
          {typedText}
          {isTyping && (
            <span className="inline-block w-[3px] h-[0.85em] ml-1 bg-fio-pink animate-pulse align-middle rounded-full" />
          )}
        </span>

        {/* Línea 2: Estrella a la izquierda + BYFIO suave en el centro + Corazón a la derecha */}
        <div className="min-h-[1.5em] flex items-center justify-center gap-1 sm:gap-2">
          {/* Paso A: La Estrella */}
          <span
            className={`transition-all duration-700 transform ${
              showStar
                ? 'opacity-100 scale-100 rotate-0 translate-y-0'
                : 'opacity-0 scale-0 -rotate-45 translate-y-4 pointer-events-none'
            }`}
          >
            <span className="byfio-sparkle-star inline-flex items-center">
              <svg
                viewBox="0 0 100 100"
                className="w-7 h-7 xs:w-9 xs:h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 drop-shadow-[0_4px_12px_rgba(255,240,124,0.75)]"
              >
                <path
                  d="M 50 10 L 59 36 L 87 38 L 65 56 L 72 83 L 50 68 L 28 83 L 35 56 L 13 38 L 41 36 Z"
                  fill="#FFF07C"
                  stroke="#FACC15"
                  strokeWidth="4"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </span>

          {/* Paso C: En el centro aparece SUAVEMENTE la palabra BYFIO */}
          <span
            className={`byfio-animated-word font-bubble tracking-tight inline-flex items-center text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black transition-all duration-1000 ease-out transform ${
              showByfio
                ? 'opacity-100 scale-100 blur-0 translate-y-0'
                : 'opacity-0 scale-95 blur-xs translate-y-2 pointer-events-none'
            }`}
            title="by.fio"
          >
            {letters.map((item, idx) => (
              <span
                key={idx}
                onClick={() => handleLetterClick(idx)}
                onMouseEnter={() => handleLetterClick(idx)}
                style={{
                  animationDelay: `${item.delay}, ${parseFloat(item.delay) * 0.7}s`,
                  transform: bouncedIndex === idx ? 'translateY(-16px) scale(1.3) rotate(-6deg)' : undefined,
                }}
                className="byfio-letter px-[0.03em] cursor-pointer transition-transform duration-150"
              >
                {item.char}
              </span>
            ))}
          </span>

          {/* Paso B: El Corazón */}
          <span
            className={`transition-all duration-700 transform ${
              showHeart
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-0 translate-y-4 pointer-events-none'
            }`}
          >
            <span className="byfio-pulse-heart inline-flex items-center">
              <svg
                viewBox="0 0 100 100"
                className="w-6 h-6 xs:w-8 xs:h-8 sm:w-11 sm:h-11 lg:w-13 lg:h-13 drop-shadow-[0_4px_12px_rgba(155,228,255,0.8)]"
              >
                <path
                  d="M 50 78 C 30 62 16 48 16 32 C 16 18 27 10 40 10 C 46 10 50 14 50 14 C 50 14 54 10 60 10 C 73 10 84 18 84 32 C 84 48 70 62 50 78 Z"
                  fill="#9BE4FF"
                  stroke="#38BDF8"
                  strokeWidth="3"
                />
              </svg>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
