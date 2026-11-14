import { useState, useEffect, useCallback, useRef } from 'react';
import { AiAgentConfig, DEFAULT_AI_AGENT_CONFIG } from '../types/aiAgent';
import { fetchAiConfig, saveAiConfig, getCachedAiConfig, setCachedAiConfig } from '../services/aiConfigService';

export const useAiAgentConfig = () => {
  const [config, setConfig] = useState<AiAgentConfig>(getCachedAiConfig);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(new Date());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const debounceTimerRef = useRef<any>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const live = await fetchAiConfig();
      setConfig(live);
      setLastSaved(new Date());
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
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [refresh]);

  const persistConfig = useCallback(
    async (override?: Partial<AiAgentConfig>): Promise<boolean> => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      setSaving(true);
      try {
        const payload = override ? { ...config, ...override } : config;
        const res = await saveAiConfig(payload);
        if (res.success) {
          setConfig(res.config);
          setLastSaved(new Date());
          showToast('✓ Configuración de AI guardada y activa en el bot');
          return true;
        } else {
          showToast('⚠️ Guardado localmente en tu navegador');
          return false;
        }
      } catch {
        showToast('⚠️ Error al guardar en la nube');
        return false;
      } finally {
        setSaving(false);
      }
    },
    [config, showToast]
  );

  const updateConfig = useCallback(
    (updates: Partial<AiAgentConfig>, autoPersistCloud = true) => {
      setConfig((prev) => {
        const next = { ...prev, ...updates };
        setCachedAiConfig(next); // Guardado inmediato en localStorage para evitar pérdidas al recargar

        if (autoPersistCloud) {
          if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = setTimeout(() => {
            saveAiConfig(next).then((res) => {
              if (res.success) setLastSaved(new Date());
            });
          }, 1200);
        }
        return next;
      });
    },
    []
  );

  const resetToRecommendedDefaults = useCallback(() => {
    setConfig(DEFAULT_AI_AGENT_CONFIG);
    setCachedAiConfig(DEFAULT_AI_AGENT_CONFIG);
    persistConfig(DEFAULT_AI_AGENT_CONFIG);
    showToast('✓ Restaurados todos los parámetros recomendados');
  }, [persistConfig, showToast]);

  return {
    config,
    loading,
    saving,
    lastSaved,
    toastMessage,
    updateConfig,
    persistConfig,
    resetToRecommendedDefaults,
    refresh,
    showToast,
  };
};
