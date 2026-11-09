import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Star, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getWhatsAppLink } from '../../utils/formatters';
import { playBubblePopSound, playWaterDropSound } from '../../utils/soundEffects';
import { AppRoute } from '../../types';

// Colección oficial de 120 mensajes positivos y motivacionales para by.fio (60 iniciales + 60 adicionales)
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
  "¡Hoy vas a brillar más que nunca! Que sea un día maravilloso. 💖✨",
  "¡Que tu día comience con paz y termine con grandes logros! ☀️",
  "Tu sonrisa es el detalle más lindo que acompaña cada entrega. 😊✨",
  "Crear con el corazón convierte cualquier rutina en arte. 🖌️",
  "Hoy todo fluye en armonía, orden y buena energía. 🍃",
  "Un empaque bonito alegra el corazón de quien lo abre. 🎀📦",
  "Cada pincelada y cada idea suman valor a nuestro proyecto. 🎨💫",
  "La pasión que ponés hoy abre puertas increíbles mañana. 🚪🌟",
  "¡Vamos con todo! El mundo necesita de tu chispa creativa. ✨",
  "Una mente despejada y un corazón alegre hacen maravillas. 🕊️",
  "Tu tiempo y dedicación son el regalo más valioso de by.fio. 🎁",
  "No hay detalle pequeño cuando se hace con cariño sincero. 🌸",
  "Que la alegría de crear te inspire en cada paso hoy. 🎶",
  "¡Qué lindo ver florecer cada idea que nace en el taller! 🌷",
  "Con orden, calma y enfoque, la jornada será un éxito rotundo. 📋✨",
  "Tenés la fuerza y el ingenio para solucionar cualquier reto. 💡",
  "Hacer feliz a un cliente es la mayor satisfacción del día. 💖",
  "Que la serenidad guíe tus manos en cada hermosa creación. 🌿",
  "Un pasito a la vez, hoy vas a llegar lejísimos. 🐾",
  "¡La magia de by.fio cobra vida con tu presencia y energía! 🌟",
  "Cada taller es una semilla de arte que sembrás con amor. 🌱🎨",
  "Tu trabajo inspira y llena de color la vida de los demás. 🌈",
  "Hoy es una hermosa página en blanco lista para llenarse de éxito. 📖✨",
  "La amabilidad con la que trabajás deja una huella imborrable. 🌻",
  "Disfrutá del proceso tanto como del resultado final. 🎈",
  "¡Arriba ese ánimo! Todo tu esfuerzo vale completamente la pena. 🚀",
  "La perseverancia transforma los sueños en realidades tangibles. 🏰",
  "Cuidar la calidad en cada pieza es tu superpoder secreto. 💎",
  "Que nunca te falte la curiosidad para seguir aprendiendo. 🔍✨",
  "Tu luz propia hace que cualquier día gris se vuelva brillante. ☀️",
  "Detrás de cada pedido alistado hay una persona muy agradecida. 💌",
  "La verdadera maestría nace de la paciencia y el esmero diario. ⏳",
  "¡Celebremos hoy las ganas de superarnos y hacer las cosas bien! 🥂",
  "Poner amor en lo que hacés es la mejor firma de calidad. ✍️💖",
  "Que la inspiración te encuentre trabajando con entusiasmo. ⚡",
  "Un ambiente lleno de respeto y cariño hace el trabajo ligero. 🤝🌸",
  "Hoy vas a conquistar cada meta que te propongas. ¡A darle! 🎯",
  "La belleza de las cosas hechas a mano radica en su alma. 🧶✨",
  "Tu constancia silenciosa genera frutos gigantescos. 🌳",
  "¡Respirá hondo! Estás exactamente donde necesitás brillar hoy. 🧘‍♀️",
  "Cada cliente atendido con cariño se convierte en un amigo fiel. 🛍️",
  "La creatividad florece cuando confiás en tu propia intuición. 🦋",
  "¡Qué orgullo formar equipo con personas tan entregadas y capaces! 👏",
  "Una actitud agradecida multiplica todas las cosas buenas. 🌺",
  "Transformás materiales simples en tesoros llenos de emoción. 🪄📦",
  "Que la música y las risas no falten en tu estación de trabajo. 🎵",
  "Tu compromiso diario es la base de todo lo que construimos. 🧱✨",
  "Hoy tenés el poder de hacer sonreír a alguien con tu labor. 😄",
  "La precisión y la delicadeza hacen de tus creaciones algo único. ✂️🌟",
  "¡Creé en vos! Tu potencial no tiene techo ni fronteras. 🦅",
  "Cuidar los detalles es demostrar cuánto valoramos a la gente. 🤍",
  "Que cada momento de hoy te acerque más a tus grandes sueños. 🛤️",
  "El arte y la papelería tienen el poder de sanar el alma. 🖍️",
  "Gracias por poner tanta chispa y dedicación en cada jornada. 🎆",
  "Hoy la productividad y la tranquilidad van a ir de la mano. 🕊️🌿",
  "Un paquete bien preparado es un abrazo que viaja a la distancia. 📬💖",
  "Tu mirada atenta asegura que todo salga impecable. 👁️✨",
  "¡Qué privilegio compartir este camino creativo a tu lado! 🌟",
  "La pasión es el ingrediente que nunca puede faltar en la receta. 🍯",
  "Que la satisfacción de haberlo dado todo te acompañe al final del día. 🌙",
  "¡Sos pura inspiración, talento y magia en acción! ¡A triunfar! 💫🎉"
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
  const { isIntroOpen, loginIntroStage, currentUser } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState('');
  const [typedText, setTypedText] = useState('');
  const [mascotStatus, setMascotStatus] = useState<'idle' | 'typing' | 'reading' | 'goodbye' | 'exiting'>('idle');
  const adminTriggeredRef = useRef(false);
  const clientTriggeredRef = useRef(false);

  // Detección estricta si estamos en la PWA del Admin o en la PWA del Colaborador
  const isAdminOrStaff = Boolean(
    currentRoute === 'admin' ||
    currentRoute === 'pedidos-mobile' ||
    currentRoute === 'superadmin' ||
    (currentUser && (currentUser.role === 'admin' || currentUser.role === 'staff'))
  );

  // Flujo específico para PWA del Admin y PWA del Colaborador:
  // Se activa 3.5 segundos después de ingresar y sale EN EL CENTRO DE LA PANTALLA
  useEffect(() => {
    if (!isAdminOrStaff) {
      adminTriggeredRef.current = false;
      return;
    }

    if (loginIntroStage > 0) {
      return;
    }

    if (adminTriggeredRef.current) {
      return;
    }

    adminTriggeredRef.current = true;

    const timer = window.setTimeout(() => {
      const msg = getNextMotivationalMessage();
      setSelectedMessage(msg);
      setTypedText('');
      setMascotStatus('typing');
      setIsVisible(true);
      setHasEntered(false);
      setIsExiting(false);
      setShowSpeechBubble(true);
      playBubblePopSound(0.35);

      const enteredTimer = window.setTimeout(() => {
        setHasEntered(true);
      }, 600);

      return () => window.clearTimeout(enteredTimer);
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [currentRoute, loginIntroStage, isAdminOrStaff]);

  // Efecto Máquina de Escribir respetando caracteres Unicode/Emojis y lectura pausada
  useEffect(() => {
    if (!isAdminOrStaff || !showSpeechBubble || !selectedMessage) {
      return;
    }

    if (mascotStatus === 'typing') {
      const allChars = Array.from(selectedMessage);
      const currChars = Array.from(typedText);

      if (currChars.length < allChars.length) {
        const charTimer = window.setTimeout(() => {
          setTypedText(allChars.slice(0, currChars.length + 1).join(''));
        }, 45);
        return () => window.clearTimeout(charTimer);
      } else {
        setMascotStatus('reading');
      }
    }

    if (mascotStatus === 'reading') {
      // 8 segundos completos para lectura tranquila del mensaje motivacional
      const readTimer = window.setTimeout(() => {
        setTypedText('¡A dar lo mejor hoy! ✨👋');
        setMascotStatus('goodbye');
      }, 8000);
      return () => window.clearTimeout(readTimer);
    }

    if (mascotStatus === 'goodbye') {
      // 2 segundos mostrando la despedida antes de descender animadamente
      const exitTimer = window.setTimeout(() => {
        handleDismiss();
      }, 2000);

      return () => window.clearTimeout(exitTimer);
    }
  }, [isAdminOrStaff, showSpeechBubble, selectedMessage, typedText, mascotStatus]);

  // Flujo para páginas públicas (tienda, catálogo, talleres, inicio)
  useEffect(() => {
    if (isAdminOrStaff) {
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
  }, [currentRoute, isIntroOpen, isAdminOrStaff]);

  const handleDismiss = () => {
    playWaterDropSound();
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setShowSpeechBubble(false);
      setIsExiting(false);
      setMascotStatus('idle');
    }, 550);
  };

  if (isIntroOpen || !isVisible) return null;

  // =========================================================================
  // VISTA 1: PWA DEL ADMIN & PWA DEL COLABORADOR — EN EL CENTRO DE LA PANTALLA
  // =========================================================================
  if (isAdminOrStaff) {
    const greetingName = currentUser?.name
      ? currentUser.name.split(' ')[0]
      : (currentUser?.role === 'staff' ? 'Equipo' : 'Fiorella');

    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mensaje Motivacional de by.fio"
        className={`fixed inset-0 z-[125] flex items-center justify-center p-4 transition-all duration-300 ${
          isExiting ? 'bg-black/0 pointer-events-none' : 'bg-black/45 backdrop-blur-xs'
        }`}
        onClick={handleDismiss}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-sm sm:max-w-md bg-white/95 dark:bg-[#1a142a]/95 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-fio-200/90 dark:border-purple-500/40 text-center overflow-hidden transition-all ${
            isExiting
              ? 'animate-star-alert-down'
              : 'animate-star-alert-in-top'
          }`}
        >
          {/* Glow ambiental decorativo */}
          <div className="absolute -top-16 -left-16 w-44 h-44 bg-fio-pink/20 dark:bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-amber-400/20 dark:bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Botón X de Cierre en la esquina superior derecha */}
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-purple-900/40 transition-colors cursor-pointer"
            aria-label="Cerrar mensaje motivacional"
            title="Cerrar mensaje"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Avatar Circular Centrado con Video de la Estrellita */}
          <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden flex items-center justify-center shadow-xl border-4 border-white dark:border-purple-900/60 bg-gradient-to-tr from-amber-100 via-pink-100 to-purple-100">
            <video
              src="/assets/vid-estrellita.mp4"
              preload="metadata"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover scale-105 pointer-events-none"
            />
            {/* Insignia de Corazón Animada (Solo visible en web pública para visitantes) */}
            {!isAdminOrStaff && (
              <span className="absolute -top-1 -right-1 w-7 h-7 bg-fio-pink text-white rounded-full flex items-center justify-center shadow-md animate-bounce">
                <Heart className="w-4 h-4 fill-current" />
              </span>
            )}
          </div>

          {/* Etiqueta superior personalizada */}
          <div className="mt-3.5 flex items-center justify-center gap-1.5 text-xs font-bubble font-bold text-fio-pink dark:text-pink-300">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>
              {currentUser?.role === 'staff'
                ? `¡Hola ${greetingName}! • by.fio Equipo`
                : `¡Hola ${greetingName}! • by.fio Creativa`}
            </span>
          </div>

          {/* Título */}
          <h3 className="font-bubble font-black text-xl sm:text-2xl text-fio-900 dark:text-purple-100 tracking-wide mt-1 leading-snug">
            Mensaje Positivo del Día 🌸
          </h3>

          {/* Burbuja del Mensaje con Efecto Máquina de Escribir */}
          <div className="mt-3.5 p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-900/30 border border-purple-200/80 dark:border-purple-800/50 shadow-inner">
            <p className="font-bubble font-bold text-base sm:text-lg text-slate-800 dark:text-purple-100 leading-relaxed min-h-[56px] flex items-center justify-center">
              <span>
                {typedText}
                {mascotStatus === 'typing' && (
                  <span className="inline-block w-2 h-4 ml-1 bg-fio-pink animate-pulse align-middle rounded-full" />
                )}
              </span>
            </p>
          </div>

          {/* Botón Principal para Cerrar / Continuar */}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-purple-700 via-fio-pink to-purple-800 hover:opacity-95 text-white font-bubble font-bold text-xs sm:text-sm shadow-clayBtn transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>¡A darlo todo hoy! ✨</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VISTA 2: WEB PÚBLICA (Tienda / Catálogo) — ESQUINA INFERIOR DERECHA
  // =========================================================================
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
                <Star className="w-4 h-4 text-fio-yellow fill-fio-yellow" />
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
              preload="metadata"
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

      {/* Cartel para Tienda Pública */}
      {showSpeechBubble && !isOpen && (
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
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-[#1f1a32] rotate-45 border-r border-b border-fio-200/80 dark:border-purple-500/30" />
        </div>
      )}

      {/* Botón Flotante con Video de la Estrellita */}
      <button
        onClick={() => {
          playWaterDropSound();
          setIsOpen(!isOpen);
          setShowSpeechBubble(false);
        }}
        className="relative group rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none border-0 p-0"
        aria-label="Ayuda con by.fio"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex items-center justify-center relative shadow-xl border-0">
          <video
            src="/assets/vid-estrellita.mp4"
            preload="metadata"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover pointer-events-none scale-105 border-0"
          />
        </div>

        {/* Insignia de Corazón (Solo visible en web pública para visitantes) */}
        {!isAdminOrStaff && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-fio-pink text-white rounded-full flex items-center justify-center shadow-md animate-bounce">
            <Heart className="w-3.5 h-3.5 fill-current" />
          </span>
        )}
      </button>
    </div>
  );
};
