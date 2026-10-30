import React from 'react';
import { useApp } from '../../context/AppContext';

/**
 * Fondo ambiental dinámico que conmuta entre:
 * 1. Tema 'vibrant': Lavanda pastel, morado profundo y rosa fuerte original de by.fio (Claro).
 * 2. Tema 'zen': Cerámica cálida, perla y lavanda difusa estilo boutique slow space (Claro).
 * 3. Tema 'dark': Noche profunda con nebulosas violeta, destellos dorados y sombras cósmicas (Oscuro).
 */
export const BackgroundDecor: React.FC = () => {
  const { colorTheme } = useApp();

  if (colorTheme === 'dark') {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none transition-colors duration-500" aria-hidden="true">
        {/* Base Noche Suave & Clarita (#211D35) */}
        <div className="absolute inset-0 bg-[#211D35]" />

        {/* Halo lavanda cósmica superior-izquierdo */}
        <div className="absolute -top-32 -left-20 w-[580px] h-[580px] rounded-full bg-gradient-to-br from-[#7C3AED]/25 via-[#6D28D9]/18 to-transparent blur-[140px] animate-pulse" />

        {/* Destello rosa magenta estelar superior-derecho */}
        <div className="absolute top-10 right-[5%] w-[480px] h-[480px] rounded-full bg-gradient-to-bl from-[#EC4899]/20 via-[#BE185D]/12 to-transparent blur-[130px]" />

        {/* Destello lavanda pastel centro-izquierdo */}
        <div className="absolute top-[40%] -left-24 w-[420px] h-[420px] rounded-full bg-[#A855F7]/18 blur-[130px]" />

        {/* Destello ámbar estrella cálida */}
        <div className="absolute top-[22%] left-[28%] w-[280px] h-[280px] rounded-full bg-[#F59E0B]/12 blur-[100px]" />

        {/* Púrpura suave inferior-derecho */}
        <div className="absolute bottom-[2%] -right-16 w-[550px] h-[550px] rounded-full bg-gradient-to-tl from-[#4C1D95]/25 via-[#3B0764]/15 to-transparent blur-[150px]" />
      </div>
    );
  }

  if (colorTheme === 'vibrant') {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none transition-colors duration-500" aria-hidden="true">
        {/* Base Lavanda Pastel Original (#FAF5FF) */}
        <div className="absolute inset-0 bg-[#FAF5FF]" />

        {/* Gran halo lila/morado vibrante superior-izquierdo */}
        <div className="absolute -top-32 -left-20 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#D4AEFA]/35 via-[#C084FC]/25 to-transparent blur-[120px] animate-pulse" />

        {/* Halo rosa fuerte vibrante superior-derecho (#EC4899) */}
        <div className="absolute top-10 right-[5%] w-[450px] h-[450px] rounded-full bg-gradient-to-bl from-[#EC4899]/20 via-[#F472B6]/15 to-transparent blur-[110px]" />

        {/* Destello celeste corazón (#38BDF8 / #9BE4FF) centro-izquierdo */}
        <div className="absolute top-[40%] -left-24 w-[420px] h-[420px] rounded-full bg-[#38BDF8]/18 blur-[120px]" />

        {/* Destello amarillo estrella (#FACC15 / #FFF07C) */}
        <div className="absolute top-[20%] left-[30%] w-[280px] h-[280px] rounded-full bg-[#FACC15]/15 blur-[90px]" />

        {/* Morado profundo inferior-derecho (#6B21A8) */}
        <div className="absolute bottom-[2%] -right-16 w-[520px] h-[520px] rounded-full bg-gradient-to-tl from-[#6B21A8]/18 via-[#9333EA]/12 to-transparent blur-[130px]" />

        {/* Micro-textura lila sutil */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] mix-blend-multiply">
          <filter id="vibrantNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#vibrantNoise)" fill="#6B21A8" />
        </svg>
      </div>
    );
  }

  // Tema 'zen' (Cerámica cálida & lavanda suave)
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none transition-colors duration-500" aria-hidden="true">
      <div className="absolute inset-0 bg-[#FAF7F2]" />
      <div className="absolute -top-32 -left-20 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#E7B8F9]/25 via-[#D4AEFA]/15 to-transparent blur-[130px]" />
      <div className="absolute top-12 right-[5%] w-[420px] h-[420px] rounded-full bg-gradient-to-bl from-[#FFF07C]/15 via-[#FCE7F3]/20 to-transparent blur-[120px]" />
      <div className="absolute top-[45%] -left-24 w-[400px] h-[400px] rounded-full bg-[#9BE4FF]/12 blur-[130px]" />
      <div className="absolute bottom-[5%] -right-16 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#C084FC]/15 via-[#FAF5FF]/10 to-transparent blur-[140px]" />
      <svg className="absolute inset-0 w-full h-full opacity-[0.025] mix-blend-multiply">
        <filter id="zenNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#zenNoise)" />
      </svg>
    </div>
  );
};
