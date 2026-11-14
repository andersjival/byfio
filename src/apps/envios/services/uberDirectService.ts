import { UberDirectSettings, EnviosAccessToken, EnviosCustomerForm, EnviosTestProduct, UberDeliveryState, UberDriverInfo } from '../types';
import { pushStoreConfig } from '../../../utils/storeConfigSync';

const SETTINGS_KEY = 'byfio_uber_direct_settings_v1';
const TOKENS_KEY = 'byfio_envios_access_tokens_v1';

export const DEFAULT_UBER_SETTINGS: UberDirectSettings = {
  credentials: {
    customerId: '825d6709-ab28-42d2-8412-f3a508104730',
    clientId: 'XZr1K7kLoH-hETEr9refP3Dh3AolY6ze',
    clientSecret: '1BrFmLmzqgTJQjB8AaeRb2rOcuQAV54eUj-xSy_o',
    webhookSecret: 'whsec_uber_direct_byfio_prod',
    environment: 'sandbox',
  },
  pickupLocation: {
    storeName: 'By.Fio Arte & Papelería Fina',
    phoneNumber: '+506 8888 2934',
    streetAddress: '150m Norte de Tienda La Gloria, Calle Central',
    city: 'Heredia',
    province: 'Heredia',
    postalCode: '40101',
    country: 'CR',
    pickupNotes: 'Retirar en mostrador principal de empaque By.Fio con número de orden.',
    latitude: 9.9981,
    longitude: -84.1165,
  },
  fallbackDeliveryFee: 3200,
  estimatedPrepMinutes: 15,
  autoDispatchOnPayment: true,
  webhookUrl: 'https://byfiocr.com/api/uber-webhook',
};

export const getStoredUberSettings = (): UberDirectSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_UBER_SETTINGS;
    return { ...DEFAULT_UBER_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_UBER_SETTINGS;
  }
};

export const saveStoredUberSettings = (settings: UberDirectSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    pushStoreConfig({ uberDirectSettings: settings });
  } catch (e) {
    console.error('Error saving Uber settings:', e);
  }
};

export const getStoredEnviosTokens = (): EnviosAccessToken[] => {
  try {
    const raw = localStorage.getItem(TOKENS_KEY);
    if (!raw) {
      const defaultToken: EnviosAccessToken = {
        id: 'tok-uber-master-01',
        token: 'UBER-DIRECT-DEMO-2026',
        label: 'Token Oficial Master de Pruebas Uber Direct',
        createdAt: new Date().toISOString(),
        expiresAt: null,
        isActive: true,
        createdBy: 'Superadmin',
      };
      localStorage.setItem(TOKENS_KEY, JSON.stringify([defaultToken]));
      return [defaultToken];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveStoredEnviosTokens = (tokens: EnviosAccessToken[]): void => {
  try {
    localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
    pushStoreConfig({ enviosAccessTokens: tokens });
  } catch (e) {
    console.error('Error saving Envios tokens:', e);
  }
};

export const generateRandomToken = (label: string, durationDays: number | null): EnviosAccessToken => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) rand += '-';
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const token = `UBER-${rand}`;
  const now = new Date();
  let expiresAt: string | null = null;
  if (durationDays && durationDays > 0) {
    const exp = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
    expiresAt = exp.toISOString();
  }

  return {
    id: `tok-${Date.now()}`,
    token,
    label: label.trim() || 'Acceso Pruebas Envíos',
    createdAt: now.toISOString(),
    expiresAt,
    isActive: true,
    createdBy: 'Superadmin Console',
  };
};

export const validateEnviosToken = (inputToken: string): { valid: boolean; tokenObj?: EnviosAccessToken; error?: string } => {
  const clean = inputToken.trim().toUpperCase();
  if (!clean) return { valid: false, error: 'Ingresa un token de acceso.' };

  const tokens = getStoredEnviosTokens();
  const match = tokens.find((t) => t.token.toUpperCase() === clean);
  if (!match) return { valid: false, error: 'Token de acceso no encontrado o inválido.' };
  if (!match.isActive) return { valid: false, error: 'Este token ha sido revocado por el superadmin.' };
  if (match.expiresAt && new Date(match.expiresAt).getTime() < Date.now()) {
    return { valid: false, error: 'Este token de acceso ha expirado.' };
  }

  return { valid: true, tokenObj: match };
};

export const MOCK_UBER_DRIVERS: UberDriverInfo[] = [
  {
    name: 'Carlos Solís Morales',
    phone: '+506 8712 9043',
    vehicleType: 'Motocicleta Reparto Direct',
    vehicleModel: 'Honda CB160 F',
    licensePlate: 'MOT-59281',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 4.96,
  },
  {
    name: 'Valeria Vargas Rojas',
    phone: '+506 8923 1184',
    vehicleType: 'Auto Compacto Courier',
    vehicleModel: 'Toyota Yaris Sedan',
    licensePlate: 'BZF-842',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 4.98,
  },
];

export const calculateUberQuote = (customer: EnviosCustomerForm, product: EnviosTestProduct): { fee: number; etaMinutes: number } => {
  const base = 2200;
  let distanceKm = 6.4;
  const p = customer.province?.toLowerCase() || '';
  if (p.includes('san josé') || p.includes('san jose')) distanceKm = 11.2;
  else if (p.includes('alajuela')) distanceKm = 14.5;
  else if (p.includes('cartago')) distanceKm = 24.0;

  const fee = Math.round((base + distanceKm * 180) / 50) * 50;
  const etaMinutes = Math.round(15 + distanceKm * 2.2);
  return { fee, etaMinutes };
};
