import { useState, useEffect, useCallback } from 'react';
import { AiAgentConfig, DEFAULT_AI_AGENT_CONFIG } from '../types/aiAgent';
import { fetchAiConfig, saveAiConfig, getCachedAiConfig } from '../services/aiConfigService';

export const useAiAgentConfig = () => {
  const [config, setConfig] = useState<AiAgentConfig>(getCachedAiConfig);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const live = await fetchAiConfig();
      setConfig(live);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    const handleUpdated = (e: Event) => {
      const custom = e as CustomEvent<AiAgentConfig>;
      if (custom.detail) {
        setConfig(custom.detail);
      }
    };

    window.addEventListener('byfio_ai_config_updated', handleUpdated);
    return () => {
      window.removeEventListener('byfio_ai_config_updated', handleUpdated);
    };
  }, [refresh]);

  const updateConfig = useCallback((updates: Partial<AiAgentConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const persistConfig = useCallback(
    async (override?: Partial<AiAgentConfig>): Promise<boolean> => {
      setSaving(true);
      try {
        const payload = override ? { ...config, ...override } : config;
        const res = await saveAiConfig(payload);
        if (res.success) {
          setConfig(res.config);
          showToast('✓ Configuración de AI BYFIO guardada en vivo');
          return true;
        } else {
          showToast('⚠️ No se pudo sincronizar en la nube, guardado local');
          return false;
        }
      } catch {
        showToast('⚠️ Error al guardar configuración');
        return false;
      } finally {
        setSaving(false);
      }
    },
    [config, showToast]
  );

  return {
    config,
    loading,
    saving,
    toastMessage,
    updateConfig,
    persistConfig,
    refresh,
    showToast,
  };
};
