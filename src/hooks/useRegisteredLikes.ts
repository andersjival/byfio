import { useState, useEffect, useCallback } from 'react';
import { AuthUser, RegisteredUserLike } from '../types';
import { metricsTracker } from '../services/metricsTracker';
import { useSmartPolling } from './useSmartPolling';

interface UseRegisteredLikesOptions {
  syncRemote?: boolean;
  pollIntervalMs?: number;
}

/**
 * Sincroniza los Me Gusta de usuarios registrados en tiempo real:
 * - Instantáneo vía BroadcastChannel y localStorage entre pestañas.
 * - Remoto desde D1 al montar y con polling inteligente pausado en segundo plano.
 */
export function useRegisteredLikes({
  syncRemote = false,
  pollIntervalMs = 45000,
}: UseRegisteredLikesOptions = {}) {
  const [registeredLikes, setRegisteredLikes] = useState<RegisteredUserLike[]>(() =>
    metricsTracker.getRegisteredLikes()
  );

  const refreshLocal = useCallback(() => {
    setRegisteredLikes([...metricsTracker.getRegisteredLikes()]);
  }, []);

  const refreshRemote = useCallback(async () => {
    const remote = await metricsTracker.fetchRemoteMetrics();
    if (remote && Array.isArray(remote.registeredLikes)) {
      setRegisteredLikes([...remote.registeredLikes]);
    }
  }, []);

  useEffect(() => {
    refreshLocal();
    if (syncRemote) {
      refreshRemote();
    }

    const channel =
      typeof window !== 'undefined' && 'BroadcastChannel' in window
        ? new BroadcastChannel('byfio_metrics_channel')
        : null;

    const handleBroadcast = (evt: MessageEvent) => {
      if (evt.data?.type === 'METRICS_UPDATED') {
        refreshLocal();
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'byfio_metrics_tracker_v1') {
        refreshLocal();
      }
    };

    channel?.addEventListener('message', handleBroadcast);
    window.addEventListener('storage', handleStorage);

    return () => {
      channel?.removeEventListener('message', handleBroadcast);
      channel?.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, [syncRemote, refreshLocal, refreshRemote]);

  useSmartPolling(refreshRemote, {
    intervalMs: pollIntervalMs,
    enabled: syncRemote,
    runImmediatelyOnFocus: true,
  });

  const hasLikedSection = useCallback(
    (sectionKey: string, user?: AuthUser | null) =>
      metricsTracker.hasUserLiked(sectionKey, user),
    [registeredLikes]
  );

  const toggleLike = useCallback(
    (sectionKey: string, user: AuthUser) => {
      const result = metricsTracker.toggleRegisteredLike(sectionKey, user);
      refreshLocal();
      return result;
    },
    [refreshLocal]
  );

  return {
    registeredLikes,
    totalRegisteredLikes: new Set(registeredLikes.map((l) => (l.userId || l.userEmail || l.userName || '').toLowerCase().trim()).filter(Boolean)).size,
    hasLikedSection,
    toggleLike,
    refreshRemote,
  };
}
