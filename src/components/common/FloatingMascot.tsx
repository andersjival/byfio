import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Sparkles, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getWhatsAppLink } from '../../utils/formatters';
import { playBubblePopSound, playWaterDropSound } from '../../utils/soundEffects';

export const FloatingMascot: React.FC = () => {
  const { isIntroOpen } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    // Si la ventana de animación de presentación está abierta o activa, NO iniciamos el conteo
    if (isIntroOpen) {
      return;
    }

    // Si ya completó la entrada inicial, evitamos re-ejecutar el temporizador de 5 segundos
    if (hasTriggeredRef.current) {
      return;
    }

    // El tiempo empieza a contar en el momento exacto en que la animación termina o el usuario le da a saltar
    const entranceTimer = window.setTimeout(() => {
      hasTriggeredRef.current = true;
      setIsVisible(true);
      // Efecto sonoro orgánico: burbuja estallando
      playBubblePopSound(0.35);

      // Tras 1150ms culmina la subida animada y vibración rápida, dando paso a la burbujita de saludo
      const speechBubbleTimer = window.setTimeout(() => {
        setHasEntered(true);
        setShowSpeechBubble(true);
        // Efecto sonoro de burbuja al emerger el saludo
        playBubblePopSound(0.28);
      }, 1150);

      return () => window.clearTimeout(speechBubbleTimer);
    }, 5000);

    return () => window.clearTimeout(entranceTimer);
  }, [isIntroOpen]);

  if (isIntroOpen || !isVisible) return null;

  const defaultMsg = '¡Hola Fio! Vi la tienda online y me gustaría hacer una consulta sobre los talleres y personalizados.';
  const waUrl = getWhatsAppLink('64004640', defaultMsg);

  return (
    <div
      className={`fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-40 flex flex-col items-end max-w-[calc(100vw-1.5rem)] ${
        !hasEntered ? 'animate-bubble-rise-vibrate' : ''
      }`}
    >
      {/* Globo de Diálogo Kawaii Completo */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-xs sm:w-80 bg-white rounded-3xl p-4 shadow-clayLg border-2 border-fio-200 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between gap-2 border-b border-fio-100 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-full bg-fio-100 text-fio-700">
                <Sparkles className="w-4 h-4 text-fio-yellow fill-fio-yellow" />
              </span>
              <div>
                <h4 className="font-bubble font-bold text-sm text-fio-900">Estrellita by.fio</h4>
                <p className="text-[11px] text-fio-pink font-semibold">¡Tu guía creativa oficial!</p>
              </div>
            </div>
            <button
              onClick={() => {
                playWaterDropSound();
                setIsOpen(false);
              }}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Cerrar ventana de ayuda"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Video de la Mascota */}
          <div className="rounded-2xl overflow-hidden bg-fio-100 mb-3 shadow-inner max-h-40 flex items-center justify-center">
            <video
              src="/assets/vid-estrellita.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-xs text-gray-600 mb-3 leading-relaxed">
            ¿Tenés preguntas sobre un taller, cupos o querés personalizar una agenda o libro de vacunas?
          </p>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playWaterDropSound()}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xs font-bold shadow-md transition-all active:scale-95 btn-water-drop"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chatear al WhatsApp 6400-4640</span>
          </a>
        </div>
      )}

      {/* Mini Burbujita de Saludo (Aparece tras el movimiento y vibración rápida) */}
      {showSpeechBubble && !isOpen && (
        <div
          onClick={() => {
            playWaterDropSound();
            setIsOpen(true);
            setShowSpeechBubble(false);
          }}
          className="mb-2 max-w-[230px] bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-fio-200/80 flex items-center gap-2 cursor-pointer hover:shadow-2xl transition-all duration-200 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 relative group"
        >
          <div className="flex-1">
            <p className="text-[12px] font-bold text-fio-900 leading-tight">
              ¡Hola! Soy <span className="text-fio-pink">Estrellita</span> ✨
            </p>
            <p className="text-[11px] text-gray-500 font-medium leading-tight mt-0.5">
              ¿Tenés alguna consulta?
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              playWaterDropSound();
              setShowSpeechBubble(false);
            }}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Cerrar saludo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          {/* Colita de la burbujita hacia la estrellita */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white rotate-45 border-r border-b border-fio-200/80" />
        </div>
      )}

      {/* Botón Flotante con Video / Avatar de la Estrellita (SIN BORDE) */}
      <button
        onClick={() => {
          playWaterDropSound();
          setIsOpen(!isOpen);
          setShowSpeechBubble(false);
        }}
        className="relative group rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none border-0 p-0"
        aria-label="Ayuda con Estrellita by.fio"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex items-center justify-center relative shadow-xl border-0">
          <video
            src="/assets/vid-estrellita.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover pointer-events-none scale-105 border-0"
          />
        </div>

        {/* Insignia de Corazón */}
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-fio-pink text-white rounded-full flex items-center justify-center shadow-md animate-bounce">
          <Heart className="w-3.5 h-3.5 fill-current" />
        </span>
      </button>
    </div>
  );
};
