import { AiAgentConfig, DEFAULT_AI_AGENT_CONFIG } from '../types/aiAgent';

const STORAGE_KEY = 'byfio_ai_agent_settings_v1';
const EVENT_NAME = 'byfio_ai_config_updated';

export const getCachedAiConfig = (): AiAgentConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_AI_AGENT_CONFIG;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_AI_AGENT_CONFIG, ...parsed };
  } catch {
    return DEFAULT_AI_AGENT_CONFIG;
  }
};

export const setCachedAiConfig = (config: AiAgentConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: config }));
    }
  } catch {}
};

export const fetchAiConfig = async (): Promise<AiAgentConfig> => {
  try {
    const resp = await fetch('/api/ai/config', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (resp.ok) {
      const data = await resp.json();
      const merged: AiAgentConfig = { ...DEFAULT_AI_AGENT_CONFIG, ...data };
      setCachedAiConfig(merged);
      return merged;
    }
  } catch {}
  return getCachedAiConfig();
};

export const saveAiConfig = async (
  updates: Partial<AiAgentConfig>
): Promise<{ success: boolean; config: AiAgentConfig; error?: string }> => {
  const current = getCachedAiConfig();
  const next: AiAgentConfig = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Guardar local de inmediato para respuesta reactiva instantánea
  setCachedAiConfig(next);

  try {
    const resp = await fetch('/api/ai/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    });

    if (resp.ok) {
      const resJson = await resp.json();
      const finalConfig = resJson.config ? { ...next, ...resJson.config } : next;
      setCachedAiConfig(finalConfig);
      return { success: true, config: finalConfig };
    }
    return { success: false, config: next, error: `HTTP ${resp.status}` };
  } catch (err: any) {
    return { success: true, config: next, error: err?.message };
  }
};
