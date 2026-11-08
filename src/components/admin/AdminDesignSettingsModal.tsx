import React from 'react';
import { useApp } from '../../context/AppContext';
import { TypographyTheme, StarAlertDuration } from '../../types';
import { X, Type, Palette, CheckCircle2, Heart, Star, Volume2, Droplets, Sun, Moon, Bell, Clock, Settings, Play, GraduationCap, BookOpen, Check } from 'lucide-react';
import { playBubblePopSound, playWaterDropSound, playNewOrderChimeSound } from '../../utils/soundEffects';

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
    soundNewOrderEnabled,
    setSoundNewOrderEnabled,
    starAlertDuration,
    setStarAlertDuration,
    showNewOrderAlert,
    isModuleEnabled,
    toggleSuperadminModule,
  } = useApp();

  const isCatalogCurrentlyActive = isModuleEnabled('catalogo');
  const [catalogEnabled, setCatalogEnabled] = React.useState<boolean>(isCatalogCurrentlyActive);
  const [saveSuccessNotice, setSaveSuccessNotice] = React.useState<string | null>(null);

  React.useEffect(() => {
    setCatalogEnabled(isModuleEnabled('catalogo'));
  }, [isModuleEnabled, isOpen]);

  if (!isOpen) return null;

  const handleApplyAndSave = () => {
    if (catalogEnabled !== isModuleEnabled('catalogo')) {
      toggleSuperadminModule('catalogo');
    }
    setSaveSuccessNotice(catalogEnabled ? '✓ Catálogo Online activado en la web' : '✓ Catálogo Online desactivado de la web');
    setTimeout(() => {
      setSaveSuccessNotice(null);
      onClose();
    }, 450);
  };

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
              <Settings className="w-4 h-4 text-fio-pink" />
            </div>
            <div>
              <h2 className="font-bubble font-bold text-base text-fio-900">
                Configuración del Sistema &amp; Personalización
              </h2>
              <p className="text-[11px] text-slate-500">
                Configura la alerta estrellita, paleta de color, tipografía y efectos de sonido.
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

        {/* Control del Botón y Sección de Catálogo Online en la Web Pública */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-50 via-pink-50/50 to-purple-50 border-2 border-purple-200/90 shadow-2xs space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-fio-800 to-fio-pink text-white flex items-center justify-center shrink-0 shadow-2xs">
                <BookOpen className="w-5 h-5 text-fio-yellow" />
              </div>
              <div>
                <h3 className="font-bubble font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                  Botón &amp; Sección de Catálogo Online en la Web
                </h3>
                <p className="text-[11px] text-slate-500 font-sans leading-tight mt-0.5">
                  Activa o desactiva al instante el botón de Catálogo en la barra superior y toda la sección pública (/catalogo).
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={catalogEnabled}
                onChange={(e) => setCatalogEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fio-800"></div>
            </label>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-purple-100">
            <span className="text-slate-600 font-medium">Estado del botón en la página:</span>
            <span className={`font-bubble font-bold px-2.5 py-0.5 rounded-full text-[10.5px] ${
              catalogEnabled ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-700 border border-rose-200'
            }`}>
              {catalogEnabled ? '✓ Catálogo Visible en la Web' : '✗ Catálogo Desactivado y Oculto'}
            </span>
          </div>
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
                Noche suave (#211D35), contraste claro y descansado.
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
                  <Star className="w-4 h-4 text-fio-yellow fill-fio-yellow" />
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

            {/* Switch 3: Sonido de Nuevos Pedidos */}
            <div className="p-3 rounded-2xl border border-slate-200 bg-[#FDFBF9] flex items-center justify-between gap-3 transition-colors hover:border-purple-200">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    soundNewOrderEnabled ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Bell className="w-4 h-4 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Alerta de Nuevos Pedidos</span>
                    <span className="text-[9.5px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-md">
                      Campanilla Chime
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 leading-tight mt-0.5">
                    Sonido melodioso y agradable al ingresar un nuevo pedido de cliente a la plataforma.
                  </p>
                </div>
              </div>

              {/* Interruptor Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={soundNewOrderEnabled}
                onClick={() => {
                  const next = !soundNewOrderEnabled;
                  setSoundNewOrderEnabled(next);
                  if (next) playNewOrderChimeSound(0.35);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-inner ${
                  soundNewOrderEnabled ? 'bg-amber-500' : 'bg-slate-300'
                }`}
                title={soundNewOrderEnabled ? 'Desactivar sonido de nuevos pedidos' : 'Activar sonido de nuevos pedidos'}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    soundNewOrderEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 4. Duración y Cierre de la Alerta Estrellita */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>Notificación de la Estrellita (Nuevos Pedidos)</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => showNewOrderAlert({ orderNumber: '#FIO-DEMO' })}
                className="inline-flex items-center gap-1 text-[10.5px] font-bubble font-bold text-fio-pink hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-2.5 py-1 rounded-full border border-pink-200 transition-all active:scale-95 cursor-pointer shadow-2xs"
                title="Probar notificación de pedido normal"
              >
                <Play className="w-3 h-3 fill-current text-fio-pink" />
                <span>Probar Pedido</span>
              </button>

              <button
                type="button"
                onClick={() => showNewOrderAlert({ orderNumber: '#WS-DEMO', isWorkshop: true, workshopTitle: 'Taller de Encuadernación Artesanal' })}
                className="inline-flex items-center gap-1 text-[10.5px] font-bubble font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-full border border-purple-200 transition-all active:scale-95 cursor-pointer shadow-2xs"
                title="Probar notificación de inscripción a taller"
              >
                <GraduationCap className="w-3 h-3 text-purple-600" />
                <span>Probar Taller</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-snug">
            Configura el tiempo que permanece la estrellita en pantalla o déjala en cierre manual:
          </p>

          {/* Opciones: Cierre manual (por defecto), 5s, 10s, 15s, 20s */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Opción Manual (Por defecto) */}
            <button
              type="button"
              onClick={() => setStarAlertDuration('manual')}
              className={`p-3 rounded-2xl border text-left transition-all sm:col-span-2 flex items-start justify-between gap-3 ${
                starAlertDuration === 'manual'
                  ? 'bg-fio-50/80 border-fio-500 ring-2 ring-fio-400/30'
                  : 'bg-white border-slate-200 hover:border-fio-300'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    Cierre manual por el usuario
                  </span>
                  <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                    Por defecto
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-500 leading-tight mt-1">
                  No se cierra temporalmente. El admin la cierra manual; suma segundos y llena la barrita de color hasta el minuto, pasando al siguiente minuto continuamente hasta que se cierre.
                </p>
              </div>
              {starAlertDuration === 'manual' ? (
                <CheckCircle2 className="w-4 h-4 text-fio-600 shrink-0 mt-0.5" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0 mt-0.5" />
              )}
            </button>

            {/* Opciones Temporizadas: 5s, 10s, 15s, 20s */}
            {([5, 10, 15, 20] as const).map((secs) => {
              const isSelected = starAlertDuration === secs;
              return (
                <button
                  key={secs}
                  type="button"
                  onClick={() => setStarAlertDuration(secs)}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-fio-50/80 border-fio-500 ring-2 ring-fio-400/30'
                      : 'bg-white border-slate-200 hover:border-fio-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-fio-pink' : 'text-slate-400'}`} />
                    <div>
                      <span className="text-xs font-bold text-slate-900">{secs} segundos</span>
                      <p className="text-[9.5px] text-slate-400">Auto-cierre tras {secs}s</p>
                    </div>
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

        {/* Botón de Confirmación y Guardado */}
        <div className="pt-2 space-y-2">
          {saveSuccessNotice && (
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bubble font-bold text-center animate-fadeIn flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
              <span>{saveSuccessNotice}</span>
            </div>
          )}
          <button
            type="button"
            onClick={handleApplyAndSave}
            className="w-full py-3 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-bold text-xs sm:text-sm shadow-clayBtn transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Guardar Configuración y Aplicar Cambios</span>
          </button>
        </div>
      </div>
    </div>
  );
};
