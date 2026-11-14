import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../../context/AppContext';
import { SUPERADMIN_CREDENTIALS, SUPERADMIN_AUTH_KEY } from '../../../utils/superadminModulesData';
import { validateEnviosToken } from '../services/uberDirectService';
import { EnviosAccessToken } from '../types';

const ENVIOS_SESSION_KEY = 'byfio_envios_auth_session_v1';

export interface EnviosAuthSession {
  type: 'superadmin' | 'token';
  identity: string;
  tokenData?: EnviosAccessToken;
  authenticatedAt: string;
}

export const useEnviosAuth = () => {
  const { isSuperAdminAuthenticated, loginSuperAdmin } = useApp();
  const [session, setSession] = useState<EnviosAuthSession | null>(() => {
    try {
      const stored = sessionStorage.getItem(ENVIOS_SESSION_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  });

  const [authError, setAuthError] = useState<string | null>(null);

  // Auto-authenticate if Superadmin is already logged in or if ?token= query param is provided
  useEffect(() => {
    if (isSuperAdminAuthenticated) {
      const superSession: EnviosAuthSession = {
        type: 'superadmin',
        identity: 'superadmin@byfio.com',
        authenticatedAt: new Date().toISOString(),
      };
      setSession(superSession);
      try {
        sessionStorage.setItem(ENVIOS_SESSION_KEY, JSON.stringify(superSession));
      } catch {}
      return;
    }

    try {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('token');
      if (urlToken) {
        const check = validateEnviosToken(urlToken);
        if (check.valid && check.tokenObj) {
          const tokenSession: EnviosAuthSession = {
            type: 'token',
            identity: check.tokenObj.label,
            tokenData: check.tokenObj,
            authenticatedAt: new Date().toISOString(),
          };
          setSession(tokenSession);
          sessionStorage.setItem(ENVIOS_SESSION_KEY, JSON.stringify(tokenSession));
        }
      }
    } catch {}
  }, [isSuperAdminAuthenticated]);

  const handleSuperadminLogin = useCallback((user: string, pass: string): boolean => {
    setAuthError(null);
    const u = user.trim().toLowerCase();
    const isUserValid = u === SUPERADMIN_CREDENTIALS.username.toLowerCase() || u === SUPERADMIN_CREDENTIALS.secondaryUsername.toLowerCase();
    const isPassValid = pass.trim() === SUPERADMIN_CREDENTIALS.password;

    if (isUserValid && isPassValid) {
      loginSuperAdmin(user, pass);
      const s: EnviosAuthSession = {
        type: 'superadmin',
        identity: 'superadmin@byfio.com',
        authenticatedAt: new Date().toISOString(),
      };
      setSession(s);
      try {
        sessionStorage.setItem(ENVIOS_SESSION_KEY, JSON.stringify(s));
      } catch {}
      return true;
    }

    setAuthError('Credenciales de Superadmin incorrectas.');
    return false;
  }, [loginSuperAdmin]);

  const handleTokenLogin = useCallback((inputToken: string): boolean => {
    setAuthError(null);
    const check = validateEnviosToken(inputToken);
    if (!check.valid || !check.tokenObj) {
      setAuthError(check.error || 'Token de acceso no válido.');
      return false;
    }

    const s: EnviosAuthSession = {
      type: 'token',
      identity: check.tokenObj.label,
      tokenData: check.tokenObj,
      authenticatedAt: new Date().toISOString(),
    };
    setSession(s);
    try {
      sessionStorage.setItem(ENVIOS_SESSION_KEY, JSON.stringify(s));
    } catch {}
    return true;
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    setAuthError(null);
    try {
      sessionStorage.removeItem(ENVIOS_SESSION_KEY);
    } catch {}
  }, []);

  const isAuthenticated = Boolean(isSuperAdminAuthenticated || session);

  return {
    isAuthenticated,
    session,
    authError,
    clearError: () => setAuthError(null),
    handleSuperadminLogin,
    handleTokenLogin,
    logout,
  };
};
