export type AiStockDisclosureMode = 'availability_only' | 'full_stock';

export interface AiChunkMessage {
  index: number;
  text: string;
  typingMs: number;
  delayBeforeMs?: number;
}

export type ChatRetentionPeriod = '1h' | '6h' | '24h' | '3d' | '7d' | '30d' | 'never';

export interface AiLiveConversation {
  id: string;
  user_id: string;
  user_name?: string;
  user_role: 'customer' | 'staff' | 'admin';
  last_message?: string;
  message_count?: number;
  created_at: string;
  updated_at: string;
}

export interface AiLiveMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  has_audio?: number | boolean;
  created_at: string;
}

export interface AiHumanSimulationData {
  initialDelayMs: number;
  isChunked: boolean;
  totalTypingMs: number;
}

export interface AiAgentConfig {
  stockDisclosureMode: AiStockDisclosureMode;
  agentName?: string;
  welcomeMessage?: string;
  customInstructions?: string;
  isEnabled?: boolean;
  // 1. Parámetros Técnicos del Modelo
  temperature?: number; // 0.1 a 0.4 (default 0.3)
  topP?: number; // default 0.85
  topK?: number; // default 40
  maxTokens?: number; // 60 a 120 (default 120)
  securityFilters?: boolean; // default true
  // 2. Instrucciones de Sistema y Directrices (System Prompt)
  agentRoleTone?: string; // Rol, tono y personalidad
  lengthStructure?: string; // Longitud y estructura (frases cortas, directas)
  strictBlacklist?: string; // Lista negra ("lo que no debe decir nunca")
  escapeProtocol?: string; // Protocolo de escape (fallo o derivación a humano)
  systemPromptOverride?: string; // Editor libre de system prompt completo
  // 3. Dinámica de Conversación & Retrasos WhatsApp
  enableHumanSimulation?: boolean; // default true
  enableChunking?: boolean; // default true
  delayType?: 'dynamic' | 'fixed' | 'natural'; // default 'dynamic' (recomendado)
  responseChunkSeparator?: string; // default '|||' (recomendado)
  maxResponseChunks?: number; // default 3 (recomendado)
  initialDelayMs?: number; // default 2500 (2.5s recomendado)
  initialDelayMinMs?: number; // 2000 ms (2s)
  initialDelayMaxMs?: number; // 3500 ms (3.5s)
  msPerChar?: number; // 30 a 50 ms (default 40 recomendado)
  delayMarginMs?: number; // 1000 a 2000 ms (default 1200)
  chatRetentionPeriod?: ChatRetentionPeriod; // Retención de historial (1h, 6h, 24h, 3d, 7d, 30d, never)
  updatedAt?: string;
}

export const DEFAULT_AI_AGENT_CONFIG: AiAgentConfig = {
  stockDisclosureMode: 'availability_only',
  agentName: 'Estrellita',
  chatRetentionPeriod: '7d',
  welcomeMessage:
    '¡Hola! ✨🌸 Soy la Estrellita de by.fio. Estoy aquí para contarte si tenemos productos en stock, fechas de talleres o ayudarte con lo que necesites.',
  customInstructions: '',
  isEnabled: true,
  // 1. Parámetros Técnicos
  temperature: 0.3,
  topP: 0.85,
  topK: 40,
  maxTokens: 200,
  securityFilters: true,
  // 2. Instrucciones de Sistema y Directrices
  agentRoleTone:
    'Asesora amable, ágil, profesional, cercana y cálida, sin sonar corporativa o robótica. Trato tierno, dulce y kawaii (✨, 🌸, 💖).',
  lengthStructure:
    'Responder en frases cortas, directas y al grano, sin párrafos extensos ni bloques pesados de texto.',
  strictBlacklist:
    '• Prohibido decir que es una IA, un bot o un modelo de lenguaje.\n• Prohibido prometer descuentos o condiciones que no estén en el catálogo.\n• Prohibido hablar de competidores o temas fuera del negocio.\n• Prohibido usar frases de relleno ("¡Excelente pregunta!", "Con mucho gusto te asisto", "¿Hay algo más en lo que te pueda colaborar hoy?").',
  escapeProtocol:
    'Solo derivar a Fiorella (WhatsApp oficial 6400-4640) cuando el cliente lo pida expresamente ("quiero hablar con un humano / Fiorella") o si requiere un encargo personalizado fuera de catálogo. Si el producto o cantidad consultada existe en inventario, o si el cliente desea pagar por SINPE, o si aclara que NO quiere hablar con nadie más, atiéndelo y concreta la compra directamente aquí sin derivarlo a WhatsApp.',
  systemPromptOverride: '',
  // 3. Dinámica de Conversación
  enableHumanSimulation: true,
  enableChunking: true,
  delayType: 'dynamic',
  responseChunkSeparator: '|||',
  maxResponseChunks: 3,
  initialDelayMs: 2500,
  initialDelayMinMs: 2000,
  initialDelayMaxMs: 3500,
  msPerChar: 40,
  delayMarginMs: 1200,
};
