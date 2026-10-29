import React from 'react';
import { useApp } from '../../context/AppContext';
import { TypographyTheme } from '../../types';
import { X, Type, Palette, CheckCircle2, Heart, Sparkles, Volume2, Droplets, Sun, Moon } from 'lucide-react';
import { playBubblePopSound, playWaterDropSound } from '../../utils/soundEffects';

interface AdminDesignSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDesignSettingsModal: React.FC<AdminDesignSettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    typographyTheme,
    setTypographyTheme,
    colorTheme,
    setColorTheme,
    soundBubbleEnabled,
    setSoundBubbleEnabled,
    soundButtonsEnabled,
    setSoundButtonsEnabled,
  } = useApp();

  if (!isOpen) return null;

  const fontOptions: { id: TypographyTheme; name: string; desc: string; sample: string; fontClass: string }[] = [
    {
      id: 'bubble',
      name: 'Solo Letra Redondita',
      desc: 'Fredoka & Quicksand en todos los títulos.',
      sample: '¡Transformá tu creatividad!',
      fontClass: 'font-bubble text-sm text-fio-900',
    },
    {
      id: 'serif',
      name: 'Solo Letra Serif Zen',
      desc: 'Cormorant Garamond editorial y minimalista.',
      sample: 'SLOW SPACE • ESPACIO CREATIVO',
      fontClass: 'font-serif text-base tracking-wider text-slate-800',
    },
    {
      id: 'hybrid',
      name: 'Combinación Dual',
      desc: 'Títulos en Serif + subtítulos en Redondita.',
      sample: 'TALLERES / CREATIVOS • Aprendé con Fio',
      fontClass: 'font-serif text-sm tracking-wide text-fio-800',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-5 border border-fio-200">
        {/* Encabezado */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-fio-700 flex items-center justify-center">
              <Palette className="w-4 h-4 text-fio-pink" />
            </div>
            <div>
              <h2 className="font-bubble font-bold text-base text-fio-900">
                Personalización Visual y Sonido
              </h2>
              <p className="text-[11px] text-slate-500">
                Elige paleta de color, tipografía y activa o desactiva los efectos de sonido.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Selector de Tema de Color */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-fio-pink" />
              <span>Paleta de Colores de la Web</span>
            </span>
            <span className="text-[10px] font-bold text-fio-800 bg-fio-100 px-2 py-0.5 rounded-full">
              {colorTheme === 'vibrant' ? 'Moradito Original' : colorTheme === 'zen' ? 'Zen Cerámica' : 'Modo Oscuro'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Opción Vibrante */}
            <button
              type="button"
              onClick={() => setColorTheme('vibrant')}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                colorTheme === 'vibrant'
                  ? 'bg-fio-50/80 border-fio-500 ring-2 ring-fio-400/40'
                  : 'bg-white border-slate-200 hover:border-fio-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-[#A855F7] to-[#EC4899]" />
                  <span className="text-xs font-bold text-slate-900">Moradito &amp; Rosa</span>
                </div>
                {colorTheme === 'vibrant' && <CheckCircle2 className="w-3.5 h-3.5 text-fio-600 shrink-0" />}
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Lila pastel (#FAF5FF), morado profundo (#6B21A8) y rosa vibrante (#EC4899).
              </p>
            </button>

            {/* Opción Zen */}
            <button
              type="button"
              onClick={() => setColorTheme('zen')}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                colorTheme === 'zen'
                  ? 'bg-[#FAF7F2] border-fio-500 ring-2 ring-fio-400/40'
                  : 'bg-white border-slate-200 hover:border-fio-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-[#D4AEFA] to-[#FAF7F2] border border-slate-300" />
                  <span className="text-xs font-bold text-slate-900">Zen Cerámica</span>
                </div>
                {colorTheme === 'zen' && <CheckCircle2 className="w-3.5 h-3.5 text-fio-600 shrink-0" />}
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Crema cerámico (#FAF7F2), blanco perla y lavanda difusa minimalista.
              </p>
            </button>

            {/* Opción Modo Oscuro / Noche */}
            <button
              type="button"
              onClick={() => setColorTheme('dark')}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                colorTheme === 'dark'
                  ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-400/40 text-white'
                  : 'bg-slate-800/90 border-slate-700 text-slate-200 hover:border-indigo-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-xs font-bold text-white">Modo Oscuro</span>
                </div>
                {colorTheme === 'dark' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Noche profunda (#0C0A17), sombras cósmicas y destellos violeta.
              </p>
            </button>
          </div>
        </div>

        {/* 2. Selector de Tipografía */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-fio-700" />
              <span>Tipografía de Títulos y Encabezados</span>
            </span>
            <span className="text-[10px] font-bold text-fio-800 bg-fio-100 px-2 py-0.5 rounded-full">
              {typographyTheme === 'bubble' ? 'Solo Redondita' : typographyTheme === 'serif' ? 'Solo Serif' : 'Combinación'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {fontOptions.map((opt) => {
              const isSelected = typographyTheme === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTypographyTheme(opt.id)}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-fio-50/80 border-fio-500 ring-2 ring-fio-400/30'
                      : 'bg-white border-slate-200 hover:border-fio-300'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{opt.name}</span>
                      <span className="text-[10px] text-slate-400 hidden sm:inline">• {opt.desc}</span>
                    </div>
                    <p className={`${opt.fontClass} truncate mt-0.5`}>
                      {opt.sample}
                    </p>
                  </div>
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-fio-600 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Efectos de Sonido Interactivos (Switches Tipo iOS / Claymorphism) */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-fio-pink" />
              <span>Efectos de Sonido Interactivos</span>
            </span>
            <span className="text-[10px] font-bold text-fio-800 bg-fio-100 px-2 py-0.5 rounded-full">
              Audio Web
            </span>
          </div>

          <div className="space-y-2">
            {/* Switch 1: Sonido de Burbuja de Estrellita */}
            <div className="p-3 rounded-2xl border border-slate-200 bg-[#FDFBF9] flex items-center justify-between gap-3 transition-colors hover:border-purple-200">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    soundBubbleEnabled ? 'bg-purple-100 text-fio-700' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-fio-yellow fill-fio-yellow" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Burbuja de la Estrellita</span>
                    <span className="text-[9.5px] font-semibold text-fio-pink bg-pink-50 px-1.5 py-0.5 rounded-md">
                      Efecto Pop
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 leading-tight mt-0.5">
                    Sonido orgánico de burbuja al emerger la estrellita y su diálogo.
                  </p>
                </div>
              </div>

              {/* Interruptor Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={soundBubbleEnabled}
                onClick={() => {
                  const next = !soundBubbleEnabled;
                  setSoundBubbleEnabled(next);
                  if (next) playBubblePopSound(0.35);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-inner ${
                  soundBubbleEnabled ? 'bg-fio-800' : 'bg-slate-300'
                }`}
                title={soundBubbleEnabled ? 'Desactivar sonido de burbuja' : 'Activar sonido de burbuja'}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    soundBubbleEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Switch 2: Sonido de Gotas de Agua en Botones */}
            <div className="p-3 rounded-2xl border border-slate-200 bg-[#FDFBF9] flex items-center justify-between gap-3 transition-colors hover:border-purple-200">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    soundButtonsEnabled ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Droplets className="w-4 h-4 text-sky-500" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Botones de la Web</span>
                    <span className="text-[9.5px] font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded-md">
                      Gotas de Agua
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 leading-tight mt-0.5">
                    Sonido suave y táctil de gota de agua líquida al pulsar botones.
                  </p>
                </div>
              </div>

              {/* Interruptor Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={soundButtonsEnabled}
                onClick={() => {
                  const next = !soundButtonsEnabled;
                  setSoundButtonsEnabled(next);
                  if (next) playWaterDropSound(0.25);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-inner ${
                  soundButtonsEnabled ? 'bg-sky-600' : 'bg-slate-300'
                }`}
                title={soundButtonsEnabled ? 'Desactivar sonido de botones' : 'Activar sonido de botones'}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    soundButtonsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Botón de Confirmación */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-bold text-xs shadow-clayBtn transition-all"
          >
            Aplicar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
