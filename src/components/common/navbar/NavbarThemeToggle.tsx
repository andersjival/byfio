import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface NavbarThemeToggleProps {
  colorTheme: string;
  setColorTheme: (theme: 'vibrant' | 'dark' | 'zen') => void;
}

export const NavbarThemeToggle: React.FC<NavbarThemeToggleProps> = ({
  colorTheme,
  setColorTheme,
}) => {
  return (
    <div className="flex items-center p-0.5 sm:p-1 rounded-full bg-[#ECEEF2] shadow-neuInset border border-white/60 shrink-0">
      <button
        type="button"
        onClick={() => setColorTheme('vibrant')}
        className={`p-1.5 sm:p-2 rounded-full transition-all ${
          colorTheme !== 'dark'
            ? 'bg-[#F1F2F6] shadow-neuBtn text-amber-500 scale-105'
            : 'text-slate-400 hover:text-amber-500'
        }`}
        title="Cambiar a tema claro (Sol)"
        aria-label="Cambiar a tema claro"
      >
        <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400/20" />
      </button>
      <button
        type="button"
        onClick={() => setColorTheme('dark')}
        className={`p-1.5 sm:p-2 rounded-full transition-all ${
          colorTheme === 'dark'
            ? 'bg-[#1E1B4B] shadow-neuBtn text-indigo-400 scale-105'
            : 'text-slate-400 hover:text-indigo-400'
        }`}
        title="Cambiar a tema oscuro (Luna)"
        aria-label="Cambiar a tema oscuro"
      >
        <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-indigo-400/20" />
      </button>
    </div>
  );
};
