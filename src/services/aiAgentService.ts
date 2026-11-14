import { getCachedAiConfig } from './aiConfigService';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  hasAudio?: boolean;
  timestamp: number;
}

export interface SendMessageOptions {
  message: string;
  role?: 'customer' | 'staff' | 'admin';
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  userName?: string;
  conversationId?: string;
  stockDisclosureMode?: 'availability_only' | 'full_stock';
}

export interface SendAudioOptions {
  audioBlob: Blob;
  role?: 'customer' | 'staff' | 'admin';
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  userName?: string;
  conversationId?: string;
}

const PRIMARY_AI_URL = 'https://ai.byfiocr.com';
const FALLBACK_AI_URL = window.location.origin;

async function requestWithFallback(endpoint: string, options: RequestInit): Promise<Response> {
  try {
    const primaryResp = await fetch(`${PRIMARY_AI_URL}${endpoint}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
      },
    });
    if (primaryResp.ok) {
      return primaryResp;
    }
  } catch {
    // Si ai.byfiocr.com está resolviendo DNS o en transición, usar endpoint relativo
  }

  return fetch(`${FALLBACK_AI_URL}${endpoint}`, options);
}

export const aiAgentService = {
  async sendMessage(opts: SendMessageOptions): Promise<{ success: boolean; response: string; conversationId?: string }> {
    try {
      const resp = await requestWithFallback('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: opts.message,
          role: opts.role || 'customer',
          history: opts.history || [],
          userName: opts.userName,
          conversationId: opts.conversationId,
          stockDisclosureMode: opts.stockDisclosureMode || getCachedAiConfig().stockDisclosureMode,
        }),
      });

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }

      const data = await resp.json();
      return {
        success: true,
        response: data.response || '¡Hola! ¿En qué puedo ayudarte hoy en by.fio? ✨',
        conversationId: data.conversationId,
      };
    } catch {
      return {
        success: false,
        response:
          '¡Hola! En este instante no pude conectar con el catálogo. Escríbenos directamente a nuestro WhatsApp 6400-4640 y con gusto te atenderemos ✨🌸',
      };
    }
  },

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      const resp = await requestWithFallback('/api/ai/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': audioBlob.type || 'audio/webm' },
        body: audioBlob,
      });

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }

      const data = await resp.json();
      return (data.text || '').trim();
    } catch {
      return '';
    }
  },

  async sendVoiceNote(opts: SendAudioOptions): Promise<{
    success: boolean;
    transcription: string;
    response: string;
    conversationId?: string;
  }> {
    const transcription = await this.transcribeAudio(opts.audioBlob);
    if (!transcription) {
      return {
        success: false,
        transcription: '',
        response: 'No pude escuchar con claridad el audio. ¿Podrías intentar grabarlo de nuevo o escribirlo? ✨',
      };
    }

    const chatResult = await this.sendMessage({
      message: transcription,
      role: opts.role,
      history: opts.history,
      userName: opts.userName,
      conversationId: opts.conversationId,
    });

    return {
      success: chatResult.success,
      transcription,
      response: chatResult.response,
      conversationId: chatResult.conversationId,
    };
  },

  async trackChatOpened(role = 'customer', userIdentifier = 'anon'): Promise<void> {
    try {
      await requestWithFallback('/api/ai/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'chat_opened', role, userIdentifier }),
      });
    } catch {}
  },

  async fetchMetrics(): Promise<any> {
    try {
      const resp = await requestWithFallback('/api/ai/metrics', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return await resp.json();
    } catch {
      return null;
    }
  },
};
