import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';

export const HeroAnimatedSlogan: React.FC = () => {
  const { isIntroOpen } = useApp();

  const FULL_PHRASE = 'Aprendé, creá y emprendé con';

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
    setTypedText('');
    setIsTyping(false);
    setShowStar(false);
    setShowHeart(false);
    setShowByfio(false);

    // 1. Un segundo después de que se quita la intro (1000ms)
    const t1 = window.setTimeout(() => {
      setIsTyping(true);
      let charIndex = 0;

      typingIntervalRef.current = window.setInterval(() => {
        charIndex += 1;
        setTypedText(FULL_PHRASE.slice(0, charIndex));

        if (charIndex >= FULL_PHRASE.length) {
          if (typingIntervalRef.current) {
            window.clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
          }
          setIsTyping(false);

          // 2. Otro segundo después de que termina de escribirse el texto (1000ms)
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
      }, 34); // ~34ms por letra para escritura fluida y natural
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
      // Si la intro se abre nuevamente, pausar y limpiar
      clearAllTimers();
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
    <div className="flex flex-col items-center justify-center text-center space-y-2 sm:space-y-3 select-none">
      {/* Línea 1: Texto que se escribe dinámicamente letra por letra */}
      <span className="block text-slate-800 dark:text-slate-100 min-h-[1.3em] font-bubble font-bold transition-all">
        {typedText}
        {isTyping && (
          <span className="inline-block w-[3px] h-[0.9em] ml-1 bg-fio-pink animate-pulse align-middle rounded-full" />
        )}
      </span>

      {/* Línea 2: Estrella + BYFIO en el centro + Corazón */}
      <div className="min-h-[1.4em] flex items-center justify-center gap-1 sm:gap-2">
        {/* Paso A: La Estrella (Aparece primero a la izquierda) */}
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

        {/* Paso B: El Corazón (Aparece a la derecha) */}
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
  );
};
