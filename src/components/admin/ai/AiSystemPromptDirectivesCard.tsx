import React, { useState } from 'react';
import { BookOpen, ShieldAlert, Sparkles, MessageSquare, PhoneForwarded, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { AiAgentConfig, DEFAULT_AI_AGENT_CONFIG } from '../../../types/aiAgent';

interface AiSystemPromptDirectivesCardProps {
  config: AiAgentConfig;
  onChangeField: (field: keyof AiAgentConfig, val: any) => void;
}

export const AiSystemPromptDirectivesCard: React.FC<AiSystemPromptDirectivesCardProps> = ({
  config,
  onChangeField,
}) => {
  const [showAdvancedPrompt, setShowAdvancedPrompt] = useState(false);

  return (
    <div className="bg-white dark:bg-[#1a1429] rounded-3xl p-5 sm:p-6 shadow-md border-2 border-purple-100 dark:border-purple-900/40 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-50 dark:border-purple-900/30 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-sm">
            <BookOpen className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-bubble font-bold text-base sm:text-lg text-slate-800 dark:text-purple-100">
              Instrucciones de Sistema & Directrices (System Prompt)
            </h3>
            <p className="text-xs text-slate-500 dark:text-purple-300 font-sans">
              Define la identidad, tono de voz, lista negra estricta y protocolo de escape humano del bot.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            onChangeField('agentRoleTone', DEFAULT_AI_AGENT_CONFIG.agentRoleTone);
            onChangeField('lengthStructure', DEFAULT_AI_AGENT_CONFIG.lengthStructure);
            onChangeField('strictBlacklist', DEFAULT_AI_AGENT_CONFIG.strictBlacklist);
            onChangeField('escapeProtocol', DEFAULT_AI_AGENT_CONFIG.escapeProtocol);
          }}
          className="text-[11px] font-bubble font-bold text-purple-700 hover:text-purple-900 dark:text-purple-300 underline cursor-pointer self-start sm:self-auto"
        >
          Restaurar Directrices Recomendadas
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Rol, Tono y Personalidad */}
        <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 space-y-2">
          <label className="flex items-center justify-between text-xs font-bubble font-bold text-purple-950 dark:text-purple-100">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              1. Rol, Tono y Personalidad
            </span>
            <span className="text-[10px] text-purple-600 font-semibold">Editable</span>
          </label>
          <textarea
            rows={3}
            value={config.agentRoleTone || ''}
            onChange={(e) => onChangeField('agentRoleTone', e.target.value)}
            placeholder="Asesora amable, ágil, profesional, cercana y cálida, sin sonar corporativa o robótica..."
            className="w-full px-3 py-2 rounded-xl border border-purple-200/80 dark:border-purple-800/60 bg-white dark:bg-[#201833] text-xs font-sans text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
          <p className="text-[10px] text-slate-500 dark:text-purple-300">
            Define la calidez, dulzura kawaii y empatía en cada interacción comercial.
          </p>
        </div>

        {/* 2. Longitud y Estructura */}
        <div className="p-3.5 rounded-2xl bg-pink-50/60 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/40 space-y-2">
          <label className="flex items-center justify-between text-xs font-bubble font-bold text-pink-950 dark:text-pink-100">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-pink-600" />
              2. Longitud y Estructura
            </span>
            <span className="text-[10px] text-pink-600 font-semibold">Concisión</span>
          </label>
          <textarea
            rows={3}
            value={config.lengthStructure || ''}
            onChange={(e) => onChangeField('lengthStructure', e.target.value)}
            placeholder="Responder en frases cortas, directas y al grano, sin párrafos extensos..."
            className="w-full px-3 py-2 rounded-xl border border-pink-200/80 dark:border-pink-800/60 bg-white dark:bg-[#201833] text-xs font-sans text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
          />
          <p className="text-[10px] text-slate-500 dark:text-purple-300">
            Obliga al modelo a evitar párrafos pesados y responder como humano en chat.
          </p>
        </div>

        {/* 3. Lista Negra Estricta */}
        <div className="p-3.5 rounded-2xl bg-fuchsia-50/60 dark:bg-fuchsia-950/30 border border-fuchsia-100 dark:border-fuchsia-900/40 space-y-2">
          <label className="flex items-center justify-between text-xs font-bubble font-bold text-fuchsia-950 dark:text-fuchsia-100">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-fuchsia-600" />
              3. Lista Negra Estricta ("Lo que no debe decir nunca")
            </span>
            <span className="text-[10px] text-fuchsia-600 font-semibold">Prohibiciones</span>
          </label>
          <textarea
            rows={4}
            value={config.strictBlacklist || ''}
            onChange={(e) => onChangeField('strictBlacklist', e.target.value)}
            placeholder="• Prohibido decir que es IA o bot&#10;• Prohibido inventar descuentos&#10;• Prohibido hablar de competidores&#10;• Prohibido frases clichés..."
            className="w-full px-3 py-2 rounded-xl border border-fuchsia-200/80 dark:border-fuchsia-800/60 bg-white dark:bg-[#201833] text-xs font-sans text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 resize-none font-mono"
          />
          <p className="text-[10px] text-slate-500 dark:text-purple-300">
            Filtra de raíz menciones de IA, inventos de precios o frases clichés corporativas.
          </p>
        </div>

        {/* 4. Protocolo de Escape Humano */}
        <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 space-y-2">
          <label className="flex items-center justify-between text-xs font-bubble font-bold text-purple-950 dark:text-purple-100">
            <span className="flex items-center gap-1.5">
              <PhoneForwarded className="w-4 h-4 text-purple-600" />
              4. Protocolo de Escape (Fallo o Solicitud Humana)
            </span>
            <span className="text-[10px] text-purple-600 font-semibold">Derivación</span>
          </label>
          <textarea
            rows={4}
            value={config.escapeProtocol || ''}
            onChange={(e) => onChangeField('escapeProtocol', e.target.value)}
            placeholder="Solo derivar a Fiorella al WhatsApp 6400-4640 si el cliente lo solicita expresamente o si requiere encargo fuera de catálogo..."
            className="w-full px-3 py-2 rounded-xl border border-purple-200/80 dark:border-purple-800/60 bg-white dark:bg-[#201833] text-xs font-sans text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
          <p className="text-[10px] text-slate-500 dark:text-purple-300">
            Canaliza dudas no resueltas directamente al WhatsApp comercial oficial 6400-4640.
          </p>
        </div>
      </div>

      {/* Editor Adicional / Avanzado de System Prompt */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowAdvancedPrompt(!showAdvancedPrompt)}
          className="flex items-center gap-1.5 text-xs font-bubble font-bold text-purple-700 dark:text-purple-300 hover:text-purple-900 cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Directrices Adicionales del System Prompt (Opcional)</span>
          {showAdvancedPrompt ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvancedPrompt && (
          <div className="mt-2 space-y-1.5 animate-in fade-in duration-200">
            <textarea
              rows={3}
              value={config.systemPromptOverride || ''}
              onChange={(e) => onChangeField('systemPromptOverride', e.target.value)}
              placeholder="Instrucciones directas adicionales inyectadas al System Prompt del modelo..."
              className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800/60 bg-slate-50 dark:bg-[#201833] text-xs font-sans text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono"
            />
          </div>
        )}
      </div>
    </div>
  );
};
