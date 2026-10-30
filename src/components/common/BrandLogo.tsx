import React, { useState } from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSlogan?: boolean;
  variant?: 'badge' | 'text';
  textColor?: string;
  sloganColor?: string;
  align?: 'start' | 'center';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSlogan = true,
  textColor = 'text-fio-800',
  sloganColor = 'text-purple-600/90',
  align = 'start',
}) => {
  const [isPopped, setIsPopped] = useState(false);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopped(true);
    setTimeout(() => setIsPopped(false), 700);
  };

  const getSizes = () => {
    switch (size) {
      case 'sm':
        return {
          text: 'text-lg sm:text-2xl',
          heart: 'w-3.5 h-3.5 sm:w-4 sm:h-4',
          star: 'w-3.5 h-3.5 sm:w-4 sm:h-4',
          starPos: 'top-[-1px] sm:top-[-2px]',
          slogan: 'text-[7.5px] sm:text-[9.5px]',
        };
      case 'lg':
        return {
          text: 'text-3xl sm:text-4xl',
          heart: 'w-6 h-6',
          star: 'w-5 h-5 sm:w-6 sm:h-6',
          starPos: 'top-[-3px] sm:top-[-4px]',
          slogan: 'text-xs sm:text-sm',
        };
      case 'hero':
        return {
          text: 'text-5xl sm:text-6xl',
          heart: 'w-9 h-9 sm:w-11 sm:h-11',
          star: 'w-8 h-8 sm:w-10 sm:h-10',
          starPos: 'top-[-5px] sm:top-[-6px]',
          slogan: 'text-sm sm:text-base',
        };
      case 'md':
      default:
        return {
          text: 'text-2xl sm:text-3xl',
          heart: 'w-4 h-4 sm:w-5 sm:h-5',
          star: 'w-4 h-4 sm:w-4.5 sm:h-4.5',
          starPos: 'top-[-2px] sm:top-[-3px]',
          slogan: 'text-[9px] sm:text-[10px]',
        };
    }
  };

  const dims = getSizes();

  return (
    <div
      className={`flex flex-col ${
        align === 'center' ? 'items-center text-center' : 'items-start'
      } select-none group cursor-pointer pt-0.5`}
    >
      {/* Fila Principal: by + corazón interactivo + fio en una sola línea continua */}
      <div
        className={`flex items-center tracking-tight font-bubble font-bold ${textColor} leading-none`}
      >
        <span className={`${dims.text} tracking-tight drop-shadow-sm`}>
          by
        </span>

        {/* Corazón celeste interactivo: se agranda al pasar el cursor o al tocarlo */}
        <button
          type="button"
          onClick={handleHeartClick}
          aria-label="Tocar corazón by.fio"
          className="inline-flex items-center justify-center mx-1 sm:mx-1.5 focus:outline-none focus:ring-0 active:scale-125"
          title="¡Tócame!"
        >
          <span
            className={`inline-flex items-center justify-center transform transition-transform duration-300 ease-out active:scale-150 ${
              isPopped ? 'scale-150 rotate-6' : 'group-hover:scale-130'
            }`}
          >
            <svg
              className={`${dims.heart} text-[#38BDF8] drop-shadow-sm fill-current`}
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </span>
        </button>

        {/* Palabra "fio" continua con la estrella posada exactamente sobre la letra i */}
        <span className={`${dims.text} tracking-tight inline-flex items-center`}>
          <span>f</span>
          <span className="relative inline-block">
            {/* Estrella colocada justo encima de la letra i, sin hueco excesivo ni desborde */}
            <span
              className={`absolute ${dims.starPos} left-1/2 -translate-x-1/2 pointer-events-none text-[#FBBF24] drop-shadow-xs animate-pulse`}
            >
              <svg className={`${dims.star} fill-current`} viewBox="0 0 24 24">
                <path d="M12 1.5l3.09 6.26 6.91 1-5 4.87 1.18 6.88L12 17.27l-6.18 3.24 1.18-6.88-5-4.87 6.91-1z" />
              </svg>
            </span>
            <span>ı</span>
          </span>
          <span>o</span>
        </span>
      </div>

      {/* Slogan Oficial: TALLERES CREATIVOS & TIENDA */}
      {showSlogan && (
        <span
          className={`${dims.slogan} font-bold tracking-wider uppercase ${sloganColor} mt-1 leading-tight select-none`}
        >
          Talleres Creativos & Tienda
        </span>
      )}
    </div>
  );
};
