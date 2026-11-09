import { useState, useEffect, useCallback } from 'react';

export interface PwaInstallState {
  isInstallable: boolean;
  isStandalone: boolean;
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isWindows: boolean;
  isInAppBrowser: boolean;
  promptInstall: () => Promise<'accepted' | 'dismissed' | 'unavailable'>;
}

export const usePwaInstall = (): PwaInstallState => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // 1. Detectar si la app ya está instalada o corriendo como PWA standalone
    const checkStandalone = () => {
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMedia || isIOSStandalone);
    };

    // 2. Detectar si el dispositivo es móvil o escritorio
    const checkDevice = () => {
      const userAgent = navigator.userAgent || '';
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isSmallScreen = window.innerWidth < 768;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(mobileRegex.test(userAgent) || (isSmallScreen && isTouch));
    };

    checkStandalone();
    checkDevice();

    window.addEventListener('resize', checkDevice);

    // 3. Capturar evento de instalación nativo (Chrome, Edge, Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<'accepted' | 'dismissed' | 'unavailable'> => {
    if (!deferredPrompt) {
      return 'unavailable';
    }

    try {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice?.outcome === 'accepted') {
        setIsStandalone(true);
        setDeferredPrompt(null);
        return 'accepted';
      } else {
        return 'dismissed';
      }
    } catch (err) {
      console.warn('Error al ejecutar prompt de instalación PWA:', err);
      return 'unavailable';
    }
  }, [deferredPrompt]);

  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isIOS =
    (/iPad|iPhone|iPod/.test(userAgent) ||
      (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
    !(window as any).MSStream;
  const isAndroid = /Android/.test(userAgent);
  const isWindows = /Windows/.test(userAgent);
  const isInAppBrowser = /FBAN|FBAV|Instagram|WhatsApp|Line|Twitter|Snapchat|TikTok|MicroMessenger/i.test(userAgent);

  return {
    isInstallable: !!deferredPrompt,
    isStandalone,
    isMobile,
    isIOS,
    isAndroid,
    isWindows,
    isInAppBrowser,
    promptInstall,
  };
};
