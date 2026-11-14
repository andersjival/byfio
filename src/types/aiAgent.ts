export type AiStockDisclosureMode = 'availability_only' | 'full_stock';

export interface AiAgentConfig {
  stockDisclosureMode: AiStockDisclosureMode;
  agentName?: string;
  welcomeMessage?: string;
  customInstructions?: string;
  isEnabled?: boolean;
  updatedAt?: string;
}

export const DEFAULT_AI_AGENT_CONFIG: AiAgentConfig = {
  stockDisclosureMode: 'availability_only',
  agentName: 'Estrellita',
  welcomeMessage:
    '¡Hola! ✨🌸 Soy la Estrellita de by.fio. Estoy aquí para contarte si tenemos productos en stock, fechas de talleres o ayudarte con lo que necesites.',
  customInstructions: '',
  isEnabled: true,
};
