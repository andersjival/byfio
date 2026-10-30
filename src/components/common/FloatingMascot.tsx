import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Sparkles, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getWhatsAppLink } from '../../utils/formatters';
import { playBubblePopSound, playWaterDropSound } from '../../utils/soundEffects';
import { AppRoute } from '../../types';

// Colección oficial de 60 mensajes positivos y motivacionales para by.fio
const MOTIVATIONAL_MESSAGES = [
  "¡Hoy es un gran día para crear cosas maravillosas! ✨",
  "Tu talento y dedicación hacen brillar cada detalle en by.fio. 🌸",
  "Cada pedido preparado lleva una pizca de amor y magia. 📦💖",
  "La creatividad no tiene límites, y hoy vas a demostrarlo. 🎨",
  "¡Respira, sonríe y disfruta cada momento de creación! ☀️",
  "El éxito se construye con pequeños detalles hechos con cariño. 🌟",
  "Hoy los talleres y pedidos van a salir increíbles. ¡A brillar! 💫",
  "Tu pasión se nota en cada entrega. ¡Gracias por dar lo mejor! 🌺",
  "Que tu jornada esté llena de inspiración, orden y sonrisas. 🌈",
  "¡Tenés la magia en tus manos para transformar el día! 🪄",
  "Un taller creativo cambia el día de quien lo toma. ¡Sos inspiración! 🌻",
  "Paso a paso, con paciencia y amor, todo sale perfecto. 🎀",
  "¡Qué alegría verte por acá! La tienda está lista para triunfar. 🚀",
  "La dedicación de hoy es la satisfacción de nuestros clientes mañana. 💌",
  "Hoy es una nueva oportunidad para sorprender con arte y calidez. 💖",
  "Hacer las cosas con el corazón siempre da los mejores resultados. 🌷",
  "¡Sos parte fundamental de la magia que vive en by.fio! ✨",
  "Cada sticker, libreta y kit lleva tu sello de calidad. 🏷️",
  "La creatividad es la inteligencia divirtiéndose. ¡A disfrutar hoy! 🎈",
  "Con una actitud positiva no hay pedido que se complique. 💪",
  "¡Sonreí! Alguien hoy va a recibir un paquete que le alegrará el día. 🎁",
  "Todo gran proyecto comienza con las ganas de hacer las cosas bien. 🌼",
  "La energía que le ponés a tu trabajo se siente en cada rincón. ☕✨",
  "Hoy es un día perfecto para alcanzar nuevas metas creativas. 🎯",
  "Confía en tu capacidad: todo lo que hacés tiene un valor enorme. 💎",
  "Organización y cariño: la fórmula secreta de nuestro éxito. 📋🌸",
  "¡A darle con todo! Cada día aprendemos y crecemos más. 🌱",
  "El arte de crear con amor transforma vidas. ¡Seguí así! 🎨",
  "Tu entusiasmo contagia a todo el equipo de by.fio. ¡Gracias! 🤗",
  "Que las ideas fluyan y la productividad te acompañe siempre. 🌊",
  "Un taller bien preparado deja huella en el corazón de los alumnos. 📖",
  "Hoy es tu momento para destacar y sentir orgullo de tu trabajo. 🏆",
  "La paciencia y el esmero convierten lo simple en extraordinario. 🌿",
  "¡Ánimo! Lo estás haciendo fantástico y cada paso cuenta. 👟",
  "La excelencia no es un acto, es un hábito diario con amor. 💫",
  "Un cliente feliz es el reflejo de tu esmero en cada detalle. 😊",
  "Que la armonía y la buena vibra llenen todo tu espacio de trabajo. 🕯️",
  "¡Hoy vamos a superar expectativas con cada pedido alistado! 📦✨",
  "Cada trazo, corte y empaque cuenta una historia de dedicación. ✂️",
  "Tu esfuerzo constante es el motor que hace crecer este sueño. 🌟",
  "Si puedes soñarlo, puedes crearlo con tus propias manos. 🦋",
  "¡Hoy celebramos cada pequeño logro y cada meta cumplida! 🥂",
  "El orden de hoy es la tranquilidad de mañana. ¡Gran trabajo! 🗂️",
  "Tu energía positiva ilumina el camino de quienes te rodean. 💡",
  "Hacer lo que amamos es el secreto para no cansarse nunca. 💜",
  "¡Qué lindo tenerte aquí! Vamos a hacer que hoy sea memorable. 🗓️",
  "La amabilidad y el buen servicio marcan siempre la diferencia. 🤝",
  "Enfocate en lo positivo y verás florecer cada proyecto. 💐",
  "No hay límites para quien pone el alma en lo que hace. 🕊️",
  "¡El equipo de by.fio es invencible gracias a tu talento! 👑",
  "Que no te falte un rico cafecito y muchas ganas de crear hoy. ☕",
  "La magia existe y se encuentra en todo lo que hacés con pasión. 🪄",
  "Cada reto es una oportunidad para demostrar de qué estamos hechos. 🔥",
  "Hoy la creatividad será tu mejor aliada en cada tarea. 🧩",
  "Gracias por cuidar cada detalle como si fuera el más importante. 🔍",
  "El trabajo bien hecho siempre rinde los más dulces frutos. 🍎",
  "¡Arriba el ánimo! Hoy vienen cosas muy buenas para by.fio. 🎈",
  "La constancia vence lo que la dicha no alcanza. ¡Seguí brillando! 🌠",
  "Tu dedicación transforma cada taller en una experiencia inolvidable. 🎪",
  "¡Hoy vas a brillar más que nunca! Que sea un día maravilloso. 💖✨"
];

// Obtener un mensaje diferente cada vez evitando repetición inmediata
const getNextMotivationalMessage = (): string => {
  try {
    const lastIdxStr = sessionStorage.getItem('byfio_last_mascot_msg_idx');
    const lastIdx = lastIdxStr !== null ? parseInt(lastIdxStr, 10) : -1;
    let newIdx = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length);
    if (newIdx === lastIdx) {
      newIdx = (newIdx + 1) % MOTIVATIONAL_MESSAGES.length;
    }
    sessionStorage.setItem('byfio_last_mascot_msg_idx', String(newIdx));
    return MOTIVATIONAL_MESSAGES[newIdx];
  } catch {
    return MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
  }
};

interface FloatingMascotProps {
  currentRoute?: AppRoute;
}

export const FloatingMascot: React.FC<FloatingMascotProps> = ({ currentRoute }) => {
  const { isIntroOpen, loginIntroStage } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState('');
  const [typedText, setTypedText] = useState('');
  const adminTriggeredRef = useRef(false);
  const clientTriggeredRef = useRef(false);

  // Flujo específico para Panel de Administración:
  // Sale 5 segundos después de que carga la última animación del login
  useEffect(() => {
    if (currentRoute !== 'admin') {
      adminTriggeredRef.current = false;
      return;
    }

    // Si aún está corriendo alguna de las etapas de animación (1 a 6), esperamos a que finalice en 0
    if (loginIntroStage > 0) {
      return;
    }

    if (adminTriggeredRef.current) {
      return;
    }

    adminTriggeredRef.current = true;

    // 5 segundos exactos tras finalizar la última animación
    const timer = window.setTimeout(() => {
      const msg = getNextMotivationalMessage();
      setSelectedMessage(msg);
      setTypedText('');
      setIsVisible(true);
      setHasEntered(false);
      setIsExiting(false);
      setShowSpeechBubble(true);
      playBubblePopSound(0.35);

      const enteredTimer = window.setTimeout(() => {
        setHasEntered(true);
      }, 1150);

      return () => window.clearTimeout(enteredTimer);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [currentRoute, loginIntroStage]);

  // Efecto Máquina de Escribir (Letra por Letra), espera de 3s y despedida hacia abajo
  useEffect(() => {
    if (currentRoute !== 'admin' || !showSpeechBubble || !selectedMessage) {
      return;
    }

    // Si aún no ha completado el mensaje seleccionado, escribimos letra por letra
    if (typedText.length < selectedMessage.length) {
      const charTimer = window.setTimeout(() => {
        setTypedText(selectedMessage.slice(0, typedText.length + 1));
      }, 34);
      return () => window.clearTimeout(charTimer);
    }

    // Si ya completó la última letra del mensaje original:
    // Espera exactamente 3 segundos, dice adiós y luego se desliza hacia abajo
    const byeTimer = window.setTimeout(() => {
      setTypedText('¡Adiós! 👋✨');

      // 1.2 segundos después de mostrar la despedida, se cierra deslizándose hacia abajo
      const exitTimer = window.setTimeout(() => {
        setIsExiting(true);

        const hideTimer = window.setTimeout(() => {
          setIsVisible(false);
          setShowSpeechBubble(false);
          setIsExiting(false);
        }, 750);

        return () => window.clearTimeout(hideTimer);
      }, 1200);

      return () => window.clearTimeout(exitTimer);
    }, 3000);

    return () => window.clearTimeout(byeTimer);
  }, [currentRoute, showSpeechBubble, selectedMessage, typedText]);

  // Flujo para páginas públicas (tienda, catálogo, talleres, inicio)
  useEffect(() => {
    if (currentRoute === 'admin') {
      return;
    }

    if (isIntroOpen || clientTriggeredRef.current) {
      return;
    }

    const entranceTimer = window.setTimeout(() => {
      clientTriggeredRef.current = true;
      setIsVisible(true);
      playBubblePopSound(0.35);

      const speechBubbleTimer = window.setTimeout(() => {
        setHasEntered(true);
        setShowSpeechBubble(true);
        playBubblePopSound(0.28);
      }, 1150);

      return () => window.clearTimeout(speechBubbleTimer);
    }, 5000);

    return () => window.clearTimeout(entranceTimer);
  }, [currentRoute, isIntroOpen]);

  if (isIntroOpen || !isVisible) return null;

  const defaultMsg = '¡Hola Fio! Vi la tienda online y me gustaría hacer una consulta sobre los talleres y personalizados.';
  const waUrl = getWhatsAppLink('64004640', defaultMsg);

  return (
    <div
      className={`fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-40 flex flex-col items-end max-w-[calc(100vw-1.5rem)] ${
        !hasEntered ? 'animate-bubble-rise-vibrate' : ''
      } ${isExiting ? 'animate-mascot-slide-down' : ''}`}
    >
      {/* Globo de Diálogo Kawaii Completo (Modal de WhatsApp en tienda) */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-xs sm:w-80 bg-white dark:bg-[#1f1a32] rounded-3xl p-4 shadow-clayLg border-2 border-fio-200 dark:border-purple-500/30 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between gap-2 border-b border-fio-100 dark:border-purple-500/20 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-full bg-fio-100 dark:bg-purple-900/40 text-fio-700 dark:text-purple-300">
                <Sparkles className="w-4 h-4 text-fio-yellow fill-fio-yellow" />
              </span>
              <div>
                <h4 className="font-bubble font-bold text-sm text-fio-900 dark:text-purple-100">by.fio Creativa</h4>
                <p className="text-[11px] text-fio-pink font-semibold">¡Talleres & Tienda Online!</p>
              </div>
            </div>
            <button
              onClick={() => {
                playWaterDropSound();
                setIsOpen(false);
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-purple-900/30 transition-colors"
              aria-label="Cerrar ventana de ayuda"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Video de la Mascota */}
          <div className="rounded-2xl overflow-hidden bg-fio-100 dark:bg-purple-950 mb-3 shadow-inner max-h-40 flex items-center justify-center">
            <video
              src="/assets/vid-estrellita.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-xs text-gray-600 dark:text-purple-200 mb-3 leading-relaxed">
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

      {/* Cartel Superior con Borde de Luz Multicolor y Efecto Máquina de Escribir */}
      {showSpeechBubble && !isOpen && (
        currentRoute === 'admin' ? (
          /* Cartel Exclusivo de Administración con Borde de Luz y 60 Mensajes Motivacionales */
          <div
            onClick={() => {
              playWaterDropSound();
              setIsExiting(true);
              setTimeout(() => {
                setIsVisible(false);
                setShowSpeechBubble(false);
                setIsExiting(false);
              }, 700);
            }}
            className="mb-2.5 max-w-[270px] sm:max-w-[290px] mascot-border-beam cursor-pointer group animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-300"
            title="Toca para despedir"
          >
            <div className="mascot-border-beam-inner p-3 sm:p-3.5 shadow-xl relative">
              <p className="text-[12.5px] sm:text-[13px] font-bubble font-bold text-slate-800 dark:text-slate-100 leading-snug tracking-wide">
                {typedText}
                {typedText.length < selectedMessage.length && (
                  <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-fio-pink animate-pulse align-middle" />
                )}
              </p>
              {/* Colita de la burbujita hacia la estrellita */}
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-[#1a142a] rotate-45 border-r border-b border-fio-200/80 dark:border-purple-500/30" />
            </div>
          </div>
        ) : (
          /* Cartel para Tienda Pública (Sin decir 'soy estrellita') */
          <div
            onClick={() => {
              playWaterDropSound();
              setIsOpen(true);
              setShowSpeechBubble(false);
            }}
            className="mb-2 max-w-[230px] bg-white/95 dark:bg-[#1f1a32]/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-fio-200/80 dark:border-purple-500/30 flex items-center gap-2 cursor-pointer hover:shadow-2xl transition-all duration-200 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 relative group"
          >
            <div className="flex-1">
              <p className="text-[12px] font-bold text-fio-900 dark:text-purple-100 leading-tight">
                ¡Bienvenido a <span className="text-fio-pink font-bubble">by.fio</span>! ✨
              </p>
              <p className="text-[11px] text-gray-500 dark:text-purple-300 font-medium leading-tight mt-0.5">
                ¿Tenés alguna consulta?
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                playWaterDropSound();
                setShowSpeechBubble(false);
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-purple-900/30 transition-colors"
              aria-label="Cerrar saludo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            {/* Colita de la burbujita hacia la estrellita */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-[#1f1a32] rotate-45 border-r border-b border-fio-200/80 dark:border-purple-500/30" />
          </div>
        )
      )}

      {/* Botón Flotante con Video / Avatar de la Estrellita (SIN BORDE) */}
      <button
        onClick={() => {
          playWaterDropSound();
          if (currentRoute === 'admin') {
            setIsExiting(true);
            setTimeout(() => {
              setIsVisible(false);
              setShowSpeechBubble(false);
              setIsExiting(false);
            }, 700);
          } else {
            setIsOpen(!isOpen);
            setShowSpeechBubble(false);
          }
        }}
        className="relative group rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none border-0 p-0"
        aria-label="Ayuda con by.fio"
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
