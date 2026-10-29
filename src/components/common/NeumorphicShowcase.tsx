import React, { useState } from 'react';
import {
  Sun, Cloud, Moon, Heart, Plus, Search,
  Play, Pause, SkipBack, SkipForward, Sparkles, Check
} from 'lucide-react';

export const NeumorphicShowcase: React.FC = () => {
  const [activeWeather, setActiveWeather] = useState<'sun' | 'cloud' | 'moon'>('sun');
  const [isLiked, setIsLiked] = useState(true);
  const [toggleState, setToggleState] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  return (
    <section className="p-6 sm:p-8 rounded-[36px] bg-[#F1F2F6] border border-white/90 shadow-neuCard text-slate-800 space-y-8 my-8 transition-all">
      {/* Encabezado Editorial del Estilo */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-300/40 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-slate-400 uppercase">
            <span>neomorphism</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>tactile &amp; minimal</span>
          </div>

          <h2 className="font-bubble font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Diseño Neumórfico &bull; Soft UI
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 max-w-lg leading-relaxed font-sans">
            Sombras dobles suaves, luces blancas difuminadas y superficies cerámicas que le devuelven la textura y el relieve táctil a cada botón y caja de información.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-200" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          </div>
        </div>

        {/* Tarjeta Termostato / Dial Táctil (Referencia Cuadrante Superior Derecho) */}
        <div className="p-6 rounded-[32px] bg-[#F1F2F6] border border-white/90 shadow-neuCard flex flex-col items-center space-y-5 self-center md:self-auto min-w-[240px]">
          {/* Dial Circular Extruido */}
          <div className="relative w-36 h-36 rounded-full bg-[#F1F2F6] shadow-neuCard flex items-center justify-center p-3 border border-white/80 group">
            {/* Anillo de Progreso Amarillo Solar */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(245, 184, 56, 0.15)"
                strokeWidth="6"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#solarGradient)"
                strokeWidth="6"
                strokeDasharray="251.2"
                strokeDashoffset="75"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="solarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
            </svg>

            {/* Núcleo Central en Relieve */}
            <div className="w-24 h-24 rounded-full bg-[#F1F2F6] shadow-neuInset flex flex-col items-center justify-center text-center">
              <span className="font-bubble font-bold text-2xl text-slate-800">28°</span>
              <span className="text-[10px] font-semibold text-amber-600 tracking-wider uppercase">soleado</span>
            </div>

            {/* Perilla Táctil en el Anillo */}
            <div className="absolute top-2 right-9 w-4 h-4 rounded-full bg-[#F1F2F6] shadow-neuBtn border border-white/80" />
          </div>

          {/* Selector de Clima Segmentado Neumórfico (Sol / Nube / Luna) */}
          <div className="neu-segmented-container">
            <button
              type="button"
              onClick={() => setActiveWeather('sun')}
              className={`p-2 rounded-full transition-all ${
                activeWeather === 'sun'
                  ? 'bg-[#F1F2F6] shadow-neuBtn text-amber-500 scale-105'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Soleado"
            >
              <Sun className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveWeather('cloud')}
              className={`p-2 rounded-full transition-all ${
                activeWeather === 'cloud'
                  ? 'bg-[#F1F2F6] shadow-neuBtn text-sky-500 scale-105'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Nublado"
            >
              <Cloud className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveWeather('moon')}
              className={`p-2 rounded-full transition-all ${
                activeWeather === 'moon'
                  ? 'bg-[#F1F2F6] shadow-neuBtn text-indigo-500 scale-105'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Noche"
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Los 4 Pilares Táctiles (Mismo formato del centro de la imagen) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {/* Pilar 1: Soft (Luz Suave) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#F1F2F6] border border-white/90 shadow-neuCard flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-100 shadow-[0_10px_20px_rgba(251,191,36,0.35),-4px_-4px_12px_#FFFFFF] border border-white/80" />
          <div>
            <h4 className="font-bubble font-bold text-sm text-slate-800">Soft (Relieve)</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Sombra y luz difuminada</p>
          </div>
        </div>

        {/* Pilar 2: Minimal (Píldoras Apiladas con Resalte Solar) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#F1F2F6] border border-white/90 shadow-neuCard flex flex-col items-center text-center space-y-3">
          <div className="flex flex-col gap-1.5 w-16">
            <div className="h-3 rounded-full bg-[#F1F2F6] shadow-neuBtn" />
            <div className="h-3.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_4px_10px_rgba(245,158,11,0.4)]" />
            <div className="h-3 rounded-full bg-[#F1F2F6] shadow-neuBtn" />
          </div>
          <div>
            <h4 className="font-bubble font-bold text-sm text-slate-800">Minimal</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Elementos depurados</p>
          </div>
        </div>

        {/* Pilar 3: Tactile (Botones Cuadrados) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#F1F2F6] border border-white/90 shadow-neuCard flex flex-col items-center text-center space-y-3">
          <div className="grid grid-cols-2 gap-1.5 w-14 h-14">
            <div className="rounded-xl bg-[#F1F2F6] shadow-neuBtn" />
            <div className="rounded-xl bg-gradient-to-tr from-amber-400 to-amber-300 shadow-[0_4px_10px_rgba(251,191,36,0.45)]" />
            <div className="rounded-xl bg-[#F1F2F6] shadow-neuBtn" />
            <div className="rounded-xl bg-[#F1F2F6] shadow-neuBtn" />
          </div>
          <div>
            <h4 className="font-bubble font-bold text-sm text-slate-800">Tactile</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Sensación al tacto</p>
          </div>
        </div>

        {/* Pilar 4: Natural (Dial 72%) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#F1F2F6] border border-white/90 shadow-neuCard flex flex-col items-center text-center space-y-3">
          <div className="relative w-14 h-14 rounded-full bg-[#F1F2F6] shadow-neuCard flex items-center justify-center p-1.5">
            <div className="w-10 h-10 rounded-full bg-[#F1F2F6] shadow-neuInset flex items-center justify-center font-bubble font-bold text-xs text-slate-800">
              72%
            </div>
          </div>
          <div>
            <h4 className="font-bubble font-bold text-sm text-slate-800">Natural</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Equilibrio visual sereno</p>
          </div>
        </div>
      </div>

      {/* Barra de Elementos Táctiles Interactivos (Controles Inferiores) */}
      <div className="p-5 sm:p-6 rounded-[28px] bg-[#ECEEF2] border border-white/80 shadow-neuInset space-y-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
          Demostrador de Botones &amp; Controles en Vivo
        </span>

        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Botón Circular Neumórfico con Corazón */}
          <button
            type="button"
            onClick={() => setIsLiked(!isLiked)}
            className={`w-12 h-12 rounded-full border border-white/80 transition-all active:scale-95 flex items-center justify-center ${
              isLiked ? 'neu-btn text-amber-500 shadow-neuBtn' : 'neu-btn text-slate-400'
            }`}
            title="Botón circular de acción"
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-amber-400 text-amber-500' : ''}`} />
          </button>

          {/* Campo de Búsqueda Inset Hundido */}
          <div className="flex-1 min-w-[200px] max-w-sm flex items-center gap-2 px-4 py-2 rounded-full bg-[#ECEEF2] border border-white/70 shadow-neuInset">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Buscar en estilo neumórfico..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Botón Circular + */}
          <button
            type="button"
            className="w-10 h-10 neu-btn-circle text-slate-600 active:scale-95 transition-all"
            title="Botón agregar"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Interruptor Toggle Neumórfico (On / Off) */}
          <div
            onClick={() => setToggleState(!toggleState)}
            className="w-16 h-8 rounded-full p-1 bg-[#ECEEF2] shadow-neuInset cursor-pointer flex items-center transition-colors"
          >
            <div
              className={`w-6 h-6 rounded-full transition-transform duration-200 ${
                toggleState
                  ? 'translate-x-8 bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_2px_8px_rgba(245,158,11,0.5)]'
                  : 'translate-x-0 bg-[#F1F2F6] shadow-neuBtn'
              }`}
            />
          </div>

          {/* Reproductor de Audio Táctil */}
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#F1F2F6] shadow-neuCard border border-white/80">
            <button
              type="button"
              className="p-2 neu-btn-circle active:scale-90 text-slate-500"
              title="Anterior"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-white shadow-[0_4px_10px_rgba(245,158,11,0.4)] active:scale-90"
              title={isPlaying ? 'Pausa' : 'Reproducir'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              className="p-2 neu-btn-circle active:scale-90 text-slate-500"
              title="Siguiente"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tarjeta de Cita / Inspiración (Exacta de la Parte Inferior de la Imagen) */}
      <div className="relative overflow-hidden p-6 sm:p-7 rounded-[32px] bg-[#F1F2F6] border border-white/90 shadow-neuCard flex flex-col sm:flex-row items-center justify-between gap-5 group">
        <div className="flex items-start gap-4">
          <span className="font-serif text-4xl sm:text-5xl font-bold text-amber-400 leading-none select-none">
            &ldquo;
          </span>
          <div className="space-y-1">
            <p className="font-bubble font-bold text-base sm:text-lg text-slate-800">
              good design is as little design as possible.
            </p>
            <p className="text-xs text-slate-500 font-sans">
              El buen diseño es el menor diseño posible &bull; Dieter Rams adaptado a by.fio
            </p>
          </div>
        </div>

        {/* Onda Dorada y Esfera Ámbar en Relieve */}
        <div className="relative flex items-center justify-end w-32 h-12 shrink-0">
          <svg className="w-full h-full text-amber-200/50" viewBox="0 0 100 40" fill="none">
            <path
              d="M0 35 C30 35, 50 10, 100 20 L100 40 L0 40 Z"
              fill="url(#waveGradient)"
            />
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(251, 191, 36, 0.05)" />
                <stop offset="100%" stopColor="rgba(251, 191, 36, 0.4)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute right-4 top-1 w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-[0_4px_12px_rgba(251,191,36,0.6)] border border-white" />
        </div>
      </div>
    </section>
  );
};
