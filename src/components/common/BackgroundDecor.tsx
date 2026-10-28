import React from 'react';

/**
 * Serene ceramic background with soft diffused ambient lighting & subtle botanical lavender atmosphere,
 * inspired by warm minimalist ceramic pottery & calming Japanese paper aesthetics.
 */
export const BackgroundDecor: React.FC = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
    {/* Base warm ceramic tint */}
    <div className="absolute inset-0 bg-[#FAF7F2]" />

    {/* Soft diffused lavender bloom top-left */}
    <div className="absolute -top-32 -left-20 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#E7B8F9]/25 via-[#D4AEFA]/15 to-transparent blur-[130px]" />

    {/* Warm golden morning sun glow top-right */}
    <div className="absolute top-12 right-[5%] w-[420px] h-[420px] rounded-full bg-gradient-to-bl from-[#FFF07C]/15 via-[#FCE7F3]/20 to-transparent blur-[120px]" />

    {/* Soft sky-cyan reflection center-left */}
    <div className="absolute top-[45%] -left-24 w-[400px] h-[400px] rounded-full bg-[#9BE4FF]/12 blur-[130px]" />

    {/* Serene mauve-violet depth bottom-right */}
    <div className="absolute bottom-[5%] -right-16 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#C084FC]/15 via-[#FAF5FF]/10 to-transparent blur-[140px]" />

    {/* Subtle artistic micro-grain / handmade texture */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.025] mix-blend-multiply">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);
