export type AiStockDisclosureMode = 'availability_only' | 'full_stock';

export interface AiChunkMessage {
  index: number;
  text: string;
  typingMs: number;
  delayBeforeMs?: number;
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
  // Parámetros técnicos del modelo
  temperature?: number; // 0.1 a 0.4 (default 0.3)
  topP?: number; // default 0.85
  topK?: number; // default 40
  maxTokens?: number; // 60 a 120 (default 120)
  // Lógica de simulación humana & retrasos
  enableHumanSimulation?: boolean; // default true
  enableChunking?: boolean; // default true
  initialDelayMinMs?: number; // 2000 ms (2s)
  initialDelayMaxMs?: number; // 3500 ms (3.5s)
  msPerChar?: number; // 30 a 50 ms (default 40)
  delayMarginMs?: number; // 1000 a 2000 ms (default 1200)
  updatedAt?: string;
}

export const DEFAULT_AI_AGENT_CONFIG: AiAgentConfig = {
  stockDisclosureMode: 'availability_only',
  agentName: 'Estrellita',
  welcomeMessage:
    '¡Hola! ✨🌸 Soy la Estrellita de by.fio. Estoy aquí para contarte si tenemos productos en stock, fechas de talleres o ayudarte con lo que necesites.',
  customInstructions: '',
  isEnabled: true,
  temperature: 0.3,
  topP: 0.85,
  topK: 40,
  maxTokens: 120,
  enableHumanSimulation: true,
  enableChunking: true,
  initialDelayMinMs: 2000,
  initialDelayMaxMs: 3500,
  msPerChar: 40,
  delayMarginMs: 1200,
};
