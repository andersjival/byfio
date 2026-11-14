import React, { useState } from 'react';
import { Bot, Send, Sparkles, RefreshCw } from 'lucide-react';
import { aiAgentService } from '../../../services/aiAgentService';
import { AiStockDisclosureMode } from '../../../types/aiAgent';

interface AiLiveTesterCardProps {
  currentMode: AiStockDisclosureMode;
}

export const AiLiveTesterCard: React.FC<AiLiveTesterCardProps> = ({ currentMode }) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: '¡Hola! ✨🌸 Soy la Estrellita de by.fio en modo de prueba. Hazme una consulta sobre cualquier producto o pide una cantidad para probar la política activa.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (customText?: string) => {
    const text = (customText || input).trim();
    if (!text || loading) return;

    const newHistory = [...messages, { role: 'user' as const, text }];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = newHistory.slice(-5).map((m) => ({ role: m.role, content: m.text }));
      const res = await aiAgentService.sendMessage({
        message: text,
        role: 'customer',
        history: historyPayload,
        stockDisclosureMode: currentMode,
      });

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: res.response || 'Sin respuesta' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Error de conexión con el motor AI.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        text: '¡Chat de prueba reiniciado! ✨ Puedes preguntar nuevamente.',
      },
    ]);
  };

  return (
    <div className="bg-white dark:bg-[#1a1429] rounded-3xl p-5 sm:p-6 shadow-md border-2 border-purple-100 dark:border-purple-900/40 space-y-3.5">
      <div className="flex items-center justify-between border-b border-purple-50 dark:border-purple-900/30 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-2xl bg-gradient-to-tr from-fio-pink to-purple-600 text-white shadow-sm">
            <Bot className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-bubble font-bold text-base sm:text-lg text-slate-800 dark:text-purple-100">
              Simulador en Vivo de la Estrellita (Cliente Web)
            </h3>
            <p className="text-xs text-slate-500 dark:text-purple-300 font-sans">
              Prueba al instante cómo interactúa la Estrellita según la política de stock seleccionada.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={clearChat}
          className="text-xs font-bubble text-slate-400 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reiniciar
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {['¿Tienen tazas kawaii disponibles?', 'Quiero 2 tazas', 'Quiero 30 tazas'].map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleSend(chip)}
            disabled={loading}
            className="text-[11px] px-2.5 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40 cursor-pointer transition-all active:scale-95"
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="h-56 overflow-y-auto space-y-2 p-3 rounded-2xl bg-slate-50/80 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-3 py-2 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                m.role === 'user'
                  ? 'bg-purple-600 text-white font-sans'
                  : 'bg-white dark:bg-[#201833] text-slate-800 dark:text-purple-100 border border-purple-100 dark:border-purple-900/50 shadow-xs'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-[#201833] px-3 py-2 rounded-2xl text-[11px] text-purple-600 flex items-center gap-1.5 shadow-xs">
              <span className="animate-spin">✨</span> Estrellita escribiendo...
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje de prueba a la Estrellita..."
          className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-purple-900/40 bg-white dark:bg-purple-950/20 text-xs font-sans text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 active:scale-95 text-white font-bubble font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
