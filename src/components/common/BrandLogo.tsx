import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSlogan?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', showSlogan = true }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div className="flex flex-col items-start select-none group cursor-pointer">
      <div className="flex items-center tracking-tight font-bubble font-bold text-fio-800">
        <span className={`${isSm ? 'text-2xl' : isLg ? 'text-4xl' : 'text-3xl'} tracking-tight`}>
          by
        </span>

        {/* Corazón celeste en lugar del punto */}
        <span className="inline-flex items-center justify-center mx-0.5 transform group-hover:scale-125 transition-transform duration-300">
          <svg
            className={`${isSm ? 'w-4 h-4' : isLg ? 'w-6 h-6' : 'w-5 h-5'} text-fio-blue drop-shadow-sm fill-current`}
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </span>

        <span className={`${isSm ? 'text-2xl' : isLg ? 'text-4xl' : 'text-3xl'}`}>f</span>

        {/* Letra 'i' con estrella amarilla brillante encima */}
        <span className="relative inline-block">
          {/* Estrellita amarilla sobre la 'i' */}
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-fio-yellow animate-pulse drop-shadow-sm">
            <svg
              className={`${isSm ? 'w-3.5 h-3.5' : isLg ? 'w-5 h-5' : 'w-4 h-4'} fill-current`}
              viewBox="0 0 24 24"
            >
              <path d="M12 1.5l3.09 6.26 6.91 1-5 4.87 1.18 6.88L12 17.27l-6.18 3.24 1.18-6.88-5-4.87 6.91-1z" />
            </svg>
          </span>
          <span className={`${isSm ? 'text-2xl' : isLg ? 'text-4xl' : 'text-3xl'}`}>ı</span>
        </span>

        <span className={`${isSm ? 'text-2xl' : isLg ? 'text-4xl' : 'text-3xl'}`}>o</span>
      </div>

      {showSlogan && (
        <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-purple-700/80 -mt-0.5">
          Talleres Creativos & Tienda
        </span>
      )}
    </div>
  );
};
