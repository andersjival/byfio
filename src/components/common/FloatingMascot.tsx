import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Heart } from 'lucide-react';
import { getWhatsAppLink } from '../../utils/formatters';

export const FloatingMascot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const defaultMsg = '¡Hola Fio! Vi la tienda online y me gustaría hacer una consulta sobre los talleres y personalizados.';
  const waUrl = getWhatsAppLink('64004640', defaultMsg);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Globo de Diálogo Kawaii */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 bg-white rounded-3xl p-4 shadow-clayLg border-2 border-fio-200 animate-in fade-in slide-in-from-bottom-4 duration-200">
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
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Video de la Mascota */}
          <div className="rounded-2xl overflow-hidden bg-fio-100 mb-3 border border-fio-200 shadow-inner max-h-40 flex items-center justify-center">
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
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chatear al WhatsApp 6400-4640</span>
          </a>
        </div>
      )}

      {/* Botón Flotante con Video / Avatar de la Estrellita */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-1 bg-white rounded-full shadow-clayLg border-3 border-fio-300 hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Ayuda con Estrellita by.fio"
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gradient-to-tr from-fio-300 via-fio-200 to-fio-100 flex items-center justify-center relative shadow-inner">
          <video
            src="/assets/vid-estrellita.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover pointer-events-none scale-105"
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
