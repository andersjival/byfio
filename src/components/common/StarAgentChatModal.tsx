import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Mic, Square, Sparkles, MessageCircle } from 'lucide-react';
import { ChatMessage, aiAgentService } from '../../services/aiAgentService';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';
import { playBubblePopSound, playWaterDropSound } from '../../utils/soundEffects';
import { getWhatsAppLink } from '../../utils/formatters';
import { StarAgentRegisterCard } from './StarAgentRegisterCard';
import { getCachedAiConfig } from '../../services/aiConfigService';

interface StarAgentChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: 'customer' | 'staff' | 'admin';
  userName?: string;
}

export const StarAgentChatModal: React.FC<StarAgentChatModalProps> = ({
  isOpen,
  onClose,
  userRole = 'customer',
  userName,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init',
      role: 'assistant',
      content:
        userRole === 'staff' || userRole === 'admin'
          ? `¡Hola ${userName ? userName.split(' ')[0] : 'compañera'}! ✨ Soy tu asistente de inventario y pedidos. Puedes preguntarme el stock de cualquier producto o cupos de talleres por texto o con un audio.`
          : (getCachedAiConfig().welcomeMessage || `¡Hola ${userName ? userName.split(' ')[0] : ''}! ✨🌸 Soy la Estrellita de by.fio. Estoy aquí para contarte si tenemos productos en stock, fechas de talleres o ayudarte con lo que necesites.`),
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingStatus, setTypingStatus] = useState<'thinking' | 'typing' | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [conversationId] = useState(() => `conv_${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isRecording, recordingTime, startRecording, stopRecording, cancelRecording } = useVoiceRecorder();

  const handleRegisterSuccess = ({ name, email }: { name: string; email: string }) => {
    playWaterDropSound();
    setMessages((prev) => [
      ...prev,
      {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: `¡Muchas felicidades, ${name.split(' ')[0]}! 🎉🌸✨ Tu cuenta ha quedado registrada con éxito.\n\nCon los accesos que acabas de ingresar (${email} y tu contraseña), podrás ingresar a la web de by.fio cuando quieras para disfrutar de beneficios exclusivos y ver tus compras. ¡Bienvenida a nuestra familia! 💕`,
        timestamp: Date.now(),
      },
    ]);
  };

  useEffect(() => {
    if (isOpen) {
      aiAgentService.trackChatOpened(userRole, userName);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, userRole, userName]);

  if (!isOpen) return null;

  const handleSendText = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    // Detectar intención de registro de usuario
    const isRegisterIntent = /(registrar|registro|crear cuenta|inscribirme|crear mi cuenta|quiero una cuenta|abrir cuenta)/i.test(text);
    if (isRegisterIntent) {
      playBubblePopSound(0.3);
      setMessages((prev) => [
        ...prev,
        {
          id: `u_${Date.now()}`,
          role: 'user',
          content: text,
          timestamp: Date.now(),
        },
        {
          id: `a_${Date.now() + 1}`,
          role: 'assistant',
          content: '¡Qué emoción! 🌸 Vamos a crear tu cuenta. Acabo de abrirte la tarjeta de registro a la par para que ingreses tus datos paso a paso ✨',
          timestamp: Date.now() + 1,
        },
      ]);
      setInputValue('');
      setIsRegisterOpen(true);
      return;
    }

    playBubblePopSound(0.3);
    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setTypingStatus('thinking');

    const historyPayload = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }));
    const result = await aiAgentService.sendMessage({
      message: text,
      role: userRole,
      history: historyPayload,
      userName,
      conversationId,
    });

    await deliverAssistantChunks(result);
  };

  const deliverAssistantChunks = async (result: {
    response: string;
    messages?: string[];
    chunks?: Array<{ index: number; text: string; typingMs: number }>;
    humanSimulation?: { initialDelayMs: number };
  }) => {
    const config = getCachedAiConfig();
    const chunks =
      result.chunks && result.chunks.length > 0
        ? result.chunks
        : result.messages && result.messages.length > 0
        ? result.messages.map((m, i) => ({ index: i, text: m, typingMs: 1200 }))
        : [{ index: 0, text: result.response, typingMs: 1200 }];

    if (config.enableHumanSimulation !== false) {
      setTypingStatus('thinking');
      const initialDelay = result.humanSimulation?.initialDelayMs || 2200;
      await new Promise((resolve) => setTimeout(resolve, Math.min(initialDelay, 3200)));

      for (let i = 0; i < chunks.length; i++) {
        setTypingStatus('typing');
        const chunk = chunks[i];
        const typingTime = Math.min(chunk.typingMs || 1400, 3200);
        await new Promise((resolve) => setTimeout(resolve, typingTime));

        playWaterDropSound();
        setMessages((prev) => [
          ...prev,
          {
            id: `a_${Date.now()}_${i}`,
            role: 'assistant',
            content: chunk.text,
            timestamp: Date.now(),
          },
        ]);
      }
    } else {
      playWaterDropSound();
      setMessages((prev) => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          role: 'assistant',
          content: result.response,
          timestamp: Date.now(),
        },
      ]);
    }
    setIsLoading(false);
    setTypingStatus(null);
  };

  const handleToggleVoice = async () => {
    if (isRecording) {
      const audioBlob = await stopRecording();
      if (!audioBlob) return;

      playBubblePopSound(0.3);
      setIsLoading(true);
      setTypingStatus('thinking');

      const historyPayload = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }));
      const result = await aiAgentService.sendVoiceNote({
        audioBlob,
        role: userRole,
        history: historyPayload,
        userName,
        conversationId,
      });

      if (result.transcription) {
        setMessages((prev) => [
          ...prev,
          {
            id: `u_${Date.now()}`,
            role: 'user',
            content: `🎤 "${result.transcription}"`,
            hasAudio: true,
            timestamp: Date.now(),
          },
        ]);
        await deliverAssistantChunks(result);
      } else {
        await deliverAssistantChunks(result);
      }
    } else {
      await startRecording();
    }
  };

  const quickChips =
    userRole === 'staff' || userRole === 'admin'
      ? ['¿Cuánto stock queda de tazas?', '¿Qué talleres tienen cupos?', '¿Cuáles productos están agotados?']
      : ['✨ Registrarme en by.fio', '¿Tienen tazas disponibles?', '¿Qué talleres hay disponibles?', '¿Hacen envíos a todo Costa Rica?'];

  const waUrl = getWhatsAppLink('64004640', '¡Hola! Estaba conversando con la Estrellita y quisiera hacer una consulta.');

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[130] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/55 backdrop-blur-xs animate-in fade-in duration-200 overflow-x-hidden"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col sm:flex-row items-center justify-center max-w-full"
      >
        {/* Ventana de Chat de la Estrellita (z-20) */}
        <div
          className="relative z-20 w-full sm:w-[420px] h-[88vh] sm:h-[620px] max-h-[92vh] bg-white dark:bg-[#1a142a] rounded-t-3xl sm:rounded-3xl shadow-[16px_0_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-15px_rgba(0,0,0,0.45)] border-2 border-fio-200/90 dark:border-purple-500/40 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-200 transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
        {/* Header con Mascota Estrellita */}
        <div className="relative px-4 py-3 bg-gradient-to-r from-fio-100 via-pink-50 to-purple-100 dark:from-purple-950 dark:via-[#221838] dark:to-purple-900 border-b border-fio-200/80 dark:border-purple-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white dark:border-purple-400 shadow-md bg-amber-100 flex-shrink-0">
              <video
                src="/assets/vid-estrellita.mp4"
                preload="metadata"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover scale-110 pointer-events-none"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bubble font-black text-base text-fio-900 dark:text-purple-100 leading-tight">
                  Estrellita by.fio
                </h3>
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              </div>
              <p className="text-[11px] font-semibold text-fio-pink dark:text-pink-300">
                {userRole === 'staff' || userRole === 'admin'
                  ? 'Asistente de Equipo & Inventario'
                  : 'Servicio & Consultas en Vivo'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-white/60 dark:hover:bg-purple-800/40 transition-colors"
            aria-label="Cerrar chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 bg-slate-50/60 dark:bg-[#130f20]/60">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-150`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-medium leading-relaxed shadow-xs ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-purple-700 to-fio-pink text-white rounded-br-xs'
                    : 'bg-white dark:bg-[#251d3d] text-slate-800 dark:text-purple-100 border border-fio-100 dark:border-purple-800/40 rounded-bl-xs'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-[#251d3d] border border-fio-100 dark:border-purple-800/40 rounded-2xl rounded-bl-xs px-4 py-2.5 shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-fio-pink animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.15s]" />
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.3s]" />
                <span className="text-[11px] text-fio-pink dark:text-purple-300 font-semibold ml-1">
                  {typingStatus === 'typing' ? 'Estrellita está escribiendo...' : 'Consultando...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Sugerencias Rápidas */}
        <div className="px-3 pt-2 pb-1.5 flex gap-1.5 overflow-x-auto no-scrollbar border-t border-fio-100/60 dark:border-purple-900/30 bg-white/70 dark:bg-[#1a142a]/70">
          {quickChips.map((chip, i) => (
            <button
              key={i}
              type="button"
              disabled={isLoading || isRecording}
              onClick={() => handleSendText(chip)}
              className="text-[11px] font-semibold whitespace-nowrap px-2.5 py-1 rounded-full bg-fio-50 hover:bg-fio-100 dark:bg-purple-950/70 dark:hover:bg-purple-900 text-fio-800 dark:text-purple-200 border border-fio-200/60 dark:border-purple-800/40 transition-colors disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Barra de Entrada (Texto y Audio) */}
        <div className="p-3 bg-white dark:bg-[#1a142a] border-t border-fio-100 dark:border-purple-900/40">
          {isRecording ? (
            <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-bold text-red-600 dark:text-red-400">
                  Grabando audio ({recordingTime}s)...
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={cancelRecording}
                  className="px-2 py-1 text-[11px] font-bold text-slate-600 hover:text-slate-800 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className="px-3 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>Enviar Audio</span>
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendText();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={userRole === 'staff' ? 'Consultar stock, cupo o producto...' : 'Pregúntale a la Estrellita...'}
                disabled={isLoading}
                className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-[#251d3d] border border-slate-200 dark:border-purple-800/40 text-xs sm:text-sm text-slate-800 dark:text-purple-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fio-pink/50"
              />

              <button
                type="button"
                onClick={handleToggleVoice}
                disabled={isLoading}
                title="Enviar mensaje de audio"
                aria-label="Grabar audio"
                className="p-2.5 rounded-2xl bg-fio-100 hover:bg-fio-200 dark:bg-purple-900/60 dark:hover:bg-purple-800 text-fio-800 dark:text-purple-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                aria-label="Enviar mensaje"
                className="p-2.5 rounded-2xl bg-gradient-to-r from-purple-700 to-fio-pink hover:opacity-95 text-white shadow-clayBtn transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

          {userRole === 'customer' && (
            <div className="mt-2 text-center">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <MessageCircle className="w-3 h-3" />
                <span>¿Prefieres hablar por WhatsApp? Clic aquí</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Tarjeta de Registro que sale por detrás hacia la derecha */}
      <StarAgentRegisterCard
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={handleRegisterSuccess}
      />
    </div>
  </div>
);
};
