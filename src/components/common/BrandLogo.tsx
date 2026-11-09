import React, { useState } from 'react';
import { metricsTracker } from '../../services/metricsTracker';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSlogan?: boolean;
  variant?: 'badge' | 'text' | 'header';
  textColor?: string;
  sloganColor?: string;
  align?: 'start' | 'center';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSlogan = true,
  variant = 'text',
  textColor,
  sloganColor,
  align = 'start',
}) => {
  const [isPopped, setIsPopped] = useState(false);
  const isBadge = variant === 'badge';
  const isHeader = variant === 'header';

  const resolvedTextColor = textColor || (isHeader || isBadge ? 'text-white' : 'text-fio-800');
  const resolvedSloganColor = sloganColor || (isHeader || isBadge ? 'text-purple-100' : 'text-purple-600/90');

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopped(true);
    try {
      const currentRoute = typeof window !== 'undefined'
        ? (window.location.pathname.replace(/^\//, '').split('/')[0] || 'home')
        : 'home';
      metricsTracker.recordLike(currentRoute);
    } catch {
      // Ignorar
    }
    setTimeout(() => setIsPopped(false), 700);
  };

  const getSizes = () => {
    switch (size) {
      case 'sm':
        return {
          text: 'text-xl sm:text-2xl',
          heartSize: 11,
          heartMarginPx: -4,
          starSize: 14,
          starTop: '-3px',
          slogan: 'text-[7.5px] sm:text-[9.5px]',
        };
      case 'lg':
        return {
          text: 'text-3xl sm:text-4xl',
          heartSize: 15,
          heartMarginPx: -6,
          starSize: 20,
          starTop: '-5px',
          slogan: 'text-xs sm:text-sm',
        };
      case 'hero':
        return {
          text: 'text-5xl sm:text-6xl',
          heartSize: 22,
          heartMarginPx: -8,
          starSize: 32,
          starTop: '-8px',
          slogan: 'text-sm sm:text-base',
        };
      case 'md':
      default:
        return {
          text: 'text-2xl sm:text-3xl',
          heartSize: 12,
          heartMarginPx: -4.5,
          starSize: 16,
          starTop: '-4px',
          slogan: 'text-[9px] sm:text-[10px]',
        };
    }
  };

  const dims = getSizes();

  return (
    <div
      className={`flex flex-col ${
        align === 'center' ? 'items-center text-center' : 'items-start'
      } select-none group cursor-pointer ${
        isBadge
          ? 'px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-gradient-to-r from-[#4A0E78] via-[#6B21A8] to-[#7E22CE] text-white shadow-neuBtn border border-purple-400/30 hover:shadow-neuBtnHover hover:scale-[1.02] active:scale-95 transition-all'
          : isHeader
          ? 'pt-0.5 hover:opacity-95 transition-opacity'
          : 'pt-0.5'
      }`}
    >
      {/* Fila Principal: by + corazón celeste como un punto en la base + fio */}
      <div
        className={`flex items-baseline tracking-tight font-bubble font-bold ${resolvedTextColor} leading-none`}
      >
        <span className={`${dims.text} tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)]`}>by</span>
        {/* Corazón celeste interactivo: actuando como un punto/dot en la base dividiendo las palabras */}
        <button
          type="button"
          onClick={handleHeartClick}
          aria-label="Tocar corazón by.fio"
          style={{
            marginLeft: `${dims.heartMarginPx}px`,
            marginRight: `${dims.heartMarginPx}px`,
          }}
          className="inline-flex items-center justify-center self-baseline translate-y-[2px] focus:outline-none focus:ring-0 active:scale-125 cursor-pointer z-10"
          title="¡Tócame!"
        >
          <span
            className={`inline-flex items-center justify-center transform transition-transform duration-300 ease-out active:scale-150 ${
              isPopped ? 'scale-150 rotate-6' : 'group-hover:scale-125'
            }`}
          >
            <svg
              style={{
                width: `${dims.heartSize}px`,
                height: `${dims.heartSize}px`,
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))',
              }}
              className="fill-[#9BE4FF]"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </span>
        </button>
        {/* Palabra "fio" continua con la estrella posada exactamente sobre la letra i */}
        <span className={`${dims.text} tracking-tight inline-flex items-baseline drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)]`}>
          <span>f</span>
          <span className="relative inline-flex items-baseline justify-center">
            {/* Estrella colocada justo encima de la letra i (#FFF07C) con rotación e iluminación */}
            <span
              className="absolute pointer-events-none z-10"
              style={{
                top: dims.starTop,
                left: '50%',
                transform: 'translateX(-40%) rotate(12deg)',
              }}
            >
              <svg
                style={{
                  width: `${dims.starSize}px`,
                  height: `${dims.starSize}px`,
                  filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.22))',
                }}
                className="fill-[#FFF07C]"
                viewBox="0 0 24 24"
              >
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
          className={`${dims.slogan} font-bold tracking-wider uppercase ${resolvedSloganColor} mt-1 leading-tight select-none`}
        >
          Talleres Creativos & Tienda
        </span>
      )}
    </div>
  );
};
