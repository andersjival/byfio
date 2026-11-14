import React, { useState } from 'react';
import { Bot, Send, Sparkles, RefreshCw } from 'lucide-react';
import { aiAgentService } from '../../../services/aiAgentService';
import { AiAgentConfig, AiStockDisclosureMode } from '../../../types/aiAgent';

interface AiLiveTesterCardProps {
  currentMode: AiStockDisclosureMode;
  config?: AiAgentConfig;
}

export const AiLiveTesterCard: React.FC<AiLiveTesterCardProps> = ({ currentMode, config }) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: '¡Hola! ✨🌸 Soy la Estrellita de by.fio en modo de prueba. Hazme una consulta sobre stock, talleres o pon a prueba mis directrices.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState<string>('Estrellita escribiendo...');

  const handleSend = async (customText?: string) => {
    const text = (customText || input).trim();
    if (!text || loading) return;

    const newHistory = [...messages, { role: 'user' as const, text }];
    setMessages(newHistory);
    setInput('');
    setLoading(true);
    setStatusText('Consultando modelo con tus parámetros...');

    try {
      const historyPayload = newHistory.slice(-5).map((m) => ({ role: m.role, content: m.text }));
      const res = await aiAgentService.sendMessage({
        message: text,
        role: 'customer',
        history: historyPayload,
        stockDisclosureMode: config?.stockDisclosureMode || currentMode,
        temperature: config?.temperature,
        maxTokens: config?.maxTokens,
        topP: config?.topP,
        topK: config?.topK,
        responseChunkSeparator: config?.responseChunkSeparator,
        maxResponseChunks: config?.maxResponseChunks,
        initialDelayMs: config?.initialDelayMs,
        msPerChar: config?.msPerChar,
        delayType: config?.delayType,
        customInstructions: config?.customInstructions,
        agentRoleTone: config?.agentRoleTone,
        lengthStructure: config?.lengthStructure,
        strictBlacklist: config?.strictBlacklist,
        escapeProtocol: config?.escapeProtocol,
        systemPromptOverride: config?.systemPromptOverride,
        securityFilters: config?.securityFilters,
      });

      const chunks =
        res.chunks && res.chunks.length > 0
          ? res.chunks
          : res.messages && res.messages.length > 0
          ? res.messages.map((m, i) => ({ index: i, text: m, typingMs: 1000 }))
          : [{ index: 0, text: res.response, typingMs: 1000 }];

      // Simular retraso inicial configurado por el usuario
      const initialDelay = Math.min(config?.initialDelayMs || res.humanSimulation?.initialDelayMs || 2000, 2500);
      setStatusText(`Estrellita pensando (${(initialDelay / 1000).toFixed(1)}s)...`);
      await new Promise((resolve) => setTimeout(resolve, initialDelay));

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        setStatusText(`Escribiendo mensaje ${i + 1}/${chunks.length}... (${chunk.typingMs}ms)`);
        await new Promise((resolve) => setTimeout(resolve, Math.min(chunk.typingMs || 1000, 2000)));

        setMessages((prev) => [...prev, { role: 'assistant', text: chunk.text }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Error de conexión con el motor AI.' },
      ]);
    } finally {
      setLoading(false);
      setStatusText('Estrellita escribiendo...');
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
              Simulador en Vivo de la Estrellita (Bot de Prueba)
            </h3>
            <p className="text-xs text-slate-500 dark:text-purple-300 font-sans">
              Interacciona directamente con los parámetros y directrices que estás configurando en este momento.
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

      {/* Indicador de Calibración Activa en Tiempo Real */}
      <div className="flex flex-wrap items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-50/90 dark:bg-purple-950/50 border border-purple-200/70 dark:border-purple-800/50 text-[11px] text-purple-800 dark:text-purple-200">
        <span className="font-bold flex items-center gap-1 text-pink-600 dark:text-pink-400">
          <Sparkles className="w-3.5 h-3.5" /> Parámetros Activos:
        </span>
        <span className="px-2 py-0.5 rounded bg-white dark:bg-purple-900/80 font-mono font-bold shadow-2xs">
          Temp: {Number(config?.temperature ?? 0.3).toFixed(2)}
        </span>
        <span className="px-2 py-0.5 rounded bg-white dark:bg-purple-900/80 font-mono font-bold shadow-2xs">
          Tokens: {config?.maxTokens ?? 120}
        </span>
        <span className="px-2 py-0.5 rounded bg-white dark:bg-purple-900/80 font-mono font-bold shadow-2xs">
          Sep: "{config?.responseChunkSeparator ?? '|||'}"
        </span>
        <span className="px-2 py-0.5 rounded bg-white dark:bg-purple-900/80 font-mono font-bold shadow-2xs">
          {config?.stockDisclosureMode === 'full_stock' ? 'Stock Completo' : 'Solo Disp.'}
        </span>
        <span className="ml-auto text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
          ● Probando con tus datos ingresados
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {[
          '¿Eres un robot o una IA?',
          'Quiero hablar con una persona real',
          '¿Me das un 50% de descuento?',
          '¿Cuántas libretas tienen en stock?',
          '¿Hacen envíos a Cartago?',
        ].map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleSend(chip)}
            disabled={loading}
            className="text-[11px] px-2.5 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="h-60 overflow-y-auto space-y-2 p-3 rounded-2xl bg-slate-50/80 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-3.5 py-2 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                m.role === 'user'
                  ? 'bg-purple-700 text-white font-sans shadow-xs'
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
              <span className="animate-spin">✨</span> {statusText}
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
