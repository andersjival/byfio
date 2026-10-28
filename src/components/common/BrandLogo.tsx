import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSlogan?: boolean;
  variant?: 'badge' | 'text';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSlogan = true,
  variant = 'badge',
}) => {
  const getDims = () => {
    switch (size) {
      case 'sm':
        return { badge: 'w-10 h-10', height: 28, text: 'text-[9px]' };
      case 'lg':
        return { badge: 'w-16 h-16', height: 48, text: 'text-xs' };
      case 'hero':
        return { badge: 'w-24 h-24', height: 72, text: 'text-sm' };
      case 'md':
      default:
        return { badge: 'w-12 h-12', height: 36, text: 'text-[10px]' };
    }
  };

  const dims = getDims();

  if (variant === 'badge') {
    return (
      <div className="flex items-center gap-3 select-none group cursor-pointer">
        {/* Isotipo Oficial con Gradiente Real #D4AEFA -> #E7B8F9 */}
        <div
          className={`${dims.badge} rounded-2xl overflow-hidden shadow-claySm border-2 border-white/80 group-hover:scale-105 transition-transform duration-300 shrink-0`}
        >
          <svg viewBox="0 0 1000 1000" width="100%" height="100%" className="drop-shadow-sm">
            <defs>
              <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D4AEFA" />
                <stop offset="100%" stopColor="#E7B8F9" />
              </linearGradient>
            </defs>

            <rect width="1000" height="1000" fill="url(#logoBgGrad)" />

            <g transform="translate(0, 15)">
              {/* Letra "b" */}
              <path d="M 145 335 L 145 575" stroke="#FFFFFF" strokeWidth="50" strokeLinecap="round" />
              <circle cx="208" cy="512" r="65" fill="none" stroke="#FFFFFF" strokeWidth="48" />

              {/* Letra "y" */}
              <path d="M 332 450 L 385 572" stroke="#FFFFFF" strokeWidth="50" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 438 450 L 372 615 Q 355 655 322 652" fill="none" stroke="#FFFFFF" strokeWidth="50" strokeLinecap="round" />

              {/* Corazón Celeste Central #9BE4FF */}
              <path
                d="M 490 562 C 490 546, 465 536, 454 550 C 442 565, 452 586, 490 612 C 528 586, 538 565, 526 550 C 515 536, 490 546, 490 562 Z"
                fill="#9BE4FF"
              />

              {/* Letra "f" */}
              <path d="M 628 380 C 600 368, 572 385, 572 425 L 572 575" fill="none" stroke="#FFFFFF" strokeWidth="50" strokeLinecap="round" />
              <path d="M 542 455 L 610 455" stroke="#FFFFFF" strokeWidth="46" strokeLinecap="round" />

              {/* Letra "i" */}
              <path d="M 668 455 L 668 575" stroke="#FFFFFF" strokeWidth="50" strokeLinecap="round" />

              {/* Letra "o" */}
              <circle cx="798" cy="512" r="65" fill="none" stroke="#FFFFFF" strokeWidth="48" />

              {/* Estrella Amarilla #FFF07C Inclinada 12° */}
              <g transform="translate(696, 385) rotate(12)">
                <path
                  d="M 0 -44 L 12 -14 L 44 -10 L 20 12 L 26 43 L 0 28 L -26 43 L -20 12 L -44 -10 L -12 -14 Z"
                  fill="#FFF07C"
                  stroke="#FFF07C"
                  strokeWidth="10"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </g>
            </g>
          </svg>
        </div>

        {/* Nombre y Slogan Tipográfico */}
        <div className="flex flex-col">
          <span className="font-bubble font-bold text-lg sm:text-xl text-fio-900 tracking-tight leading-tight">
            by.fio
          </span>
          {showSlogan && (
            <span className={`${dims.text} font-bold text-fio-pink tracking-wider uppercase -mt-0.5`}>
              Talleres Creativos & Tienda
            </span>
          )}
        </div>
      </div>
    );
  }

  // Versión Vectorial Horizontal Transparente
  return (
    <div className="flex flex-col items-start select-none group cursor-pointer">
      <svg
        viewBox="115 320 775 365"
        style={{ height: dims.height }}
        className="w-auto drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
      >
        <g transform="translate(0, 15)">
          <path d="M 145 335 L 145 575" stroke="#6B21A8" strokeWidth="50" strokeLinecap="round" />
          <circle cx="208" cy="512" r="65" fill="none" stroke="#6B21A8" strokeWidth="48" />

          <path d="M 332 450 L 385 572" stroke="#6B21A8" strokeWidth="50" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 438 450 L 372 615 Q 355 655 322 652" fill="none" stroke="#6B21A8" strokeWidth="50" strokeLinecap="round" />

          <path
            d="M 490 562 C 490 546, 465 536, 454 550 C 442 565, 452 586, 490 612 C 528 586, 538 565, 526 550 C 515 536, 490 546, 490 562 Z"
            fill="#38BDF8"
          />

          <path d="M 628 380 C 600 368, 572 385, 572 425 L 572 575" fill="none" stroke="#6B21A8" strokeWidth="50" strokeLinecap="round" />
          <path d="M 542 455 L 610 455" stroke="#6B21A8" strokeWidth="46" strokeLinecap="round" />

          <path d="M 668 455 L 668 575" stroke="#6B21A8" strokeWidth="50" strokeLinecap="round" />
          <circle cx="798" cy="512" r="65" fill="none" stroke="#6B21A8" strokeWidth="48" />

          <g transform="translate(696, 385) rotate(12)">
            <path
              d="M 0 -44 L 12 -14 L 44 -10 L 20 12 L 26 43 L 0 28 L -26 43 L -20 12 L -44 -10 L -12 -14 Z"
              fill="#FACC15"
              stroke="#FACC15"
              strokeWidth="10"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
        </g>
      </svg>
      {showSlogan && (
        <span className={`${dims.text} font-bold text-fio-pink tracking-wider uppercase mt-1`}>
          Talleres Creativos & Tienda
        </span>
      )}
    </div>
  );
};
