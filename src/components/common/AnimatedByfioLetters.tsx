import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface AnimatedByfioLettersProps {
  size?: 'md' | 'lg' | 'xl' | 'hero';
  showDecorations?: boolean;
  className?: string;
}

export const AnimatedByfioLetters: React.FC<AnimatedByfioLettersProps> = ({
  size = 'hero',
  showDecorations = true,
  className = '',
}) => {
  const [bouncedIndex, setBouncedIndex] = useState<number | null>(null);

  // Letras individuales de BYFIO con su retraso en segundos para la onda continua
  const letters = [
    { char: 'B', delay: '0s' },
    { char: 'Y', delay: '0.1s' },
    { char: 'F', delay: '0.2s' },
    { char: 'I', delay: '0.3s' },
    { char: 'O', delay: '0.4s' },
  ];

  const sizeClasses = {
    md: 'text-2xl sm:text-3xl font-extrabold',
    lg: 'text-3xl sm:text-4xl lg:text-5xl font-black',
    xl: 'text-4xl sm:text-5xl lg:text-6xl font-black',
    hero: 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black',
  };

  const handleLetterClick = (idx: number) => {
    setBouncedIndex(idx);
    setTimeout(() => setBouncedIndex(null), 350);
  };

  return (
    <span
      className={`byfio-animated-word font-bubble tracking-tight inline-flex items-center select-none ${sizeClasses[size]} ${className}`}
      title="by.fio — Talleres Creativos & Tienda"
    >
      {/* Estrellita Amarilla Oficial Destellante a la Izquierda */}
      {showDecorations && (
        <span className="byfio-sparkle-star inline-flex items-center -mr-1 sm:-mr-2 z-10">
          <svg
            viewBox="0 0 100 100"
            className="w-5 h-5 sm:w-7 sm:h-7 lg:w-9 lg:h-9 drop-shadow-[0_2px_8px_rgba(255,240,124,0.65)]"
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
      )}

      {/* Letras Animadas B-Y-F-I-O con Ondas y Gradiente Rápido */}
      {letters.map((item, idx) => (
        <span
          key={idx}
          onClick={() => handleLetterClick(idx)}
          onMouseEnter={() => handleLetterClick(idx)}
          style={{
            animationDelay: `${item.delay}, ${parseFloat(item.delay) * 0.7}s`,
            transform: bouncedIndex === idx ? 'translateY(-16px) scale(1.3) rotate(-6deg)' : undefined,
          }}
          className="byfio-letter px-[0.03em] transition-transform duration-150"
        >
          {item.char}
        </span>
      ))}

      {/* Corazoncito Celeste Central / Derecha Oficial */}
      {showDecorations && (
        <span className="byfio-pulse-heart inline-flex items-center -ml-0.5 sm:-ml-1 z-10">
          <svg
            viewBox="0 0 100 100"
            className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 drop-shadow-[0_2px_8px_rgba(155,228,255,0.7)]"
          >
            <path
              d="M 50 78 C 30 62 16 48 16 32 C 16 18 27 10 40 10 C 46 10 50 14 50 14 C 50 14 54 10 60 10 C 73 10 84 18 84 32 C 84 48 70 62 50 78 Z"
              fill="#9BE4FF"
              stroke="#38BDF8"
              strokeWidth="3"
            />
          </svg>
        </span>
      )}
    </span>
  );
};
