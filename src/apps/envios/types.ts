export type UberEnvironment = 'sandbox' | 'production';

export interface UberDirectCredentials {
  customerId: string;
  clientId: string;
  clientSecret: string;
  webhookSecret?: string;
  environment: UberEnvironment;
}

export interface StorePickupLocation {
  storeName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  pickupNotes: string;
  latitude: number;
  longitude: number;
}

export interface UberDirectSettings {
  credentials: UberDirectCredentials;
  pickupLocation: StorePickupLocation;
  fallbackDeliveryFee: number;
  estimatedPrepMinutes: number;
  autoDispatchOnPayment: boolean;
  webhookUrl?: string;
}

export interface EnviosAccessToken {
  id: string;
  token: string;
  label: string;
  createdAt: string;
  expiresAt: string | null;
  isActive: boolean;
  createdBy?: string;
}

export interface EnviosTestProduct {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
  weightKg: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  description: string;
  badge: string;
}

export interface EnviosCustomerForm {
  fullName: string;
  phone: string;
  email: string;
  province: string;
  canton: string;
  district: string;
  addressDetails: string;
  deliveryNotes: string;
}

export type UberDeliveryStep =
  | 'idle'
  | 'quote_ready'
  | 'payment_confirmed'
  | 'requesting'
  | 'searching_driver'
  | 'driver_assigned'
  | 'pickup_in_progress'
  | 'pickup_complete'
  | 'dropoff_in_progress'
  | 'delivered'
  | 'cancelled';

export interface UberDriverInfo {
  name: string;
  phone: string;
  vehicleType: string;
  vehicleModel: string;
  licensePlate: string;
  photoUrl: string;
  rating: number;
}

export interface UberDeliveryTimelineItem {
  step: UberDeliveryStep;
  title: string;
  timestamp: string;
  description: string;
}

export interface UberDeliveryState {
  orderId: string;
  deliveryId: string;
  trackingUrl: string;
  step: UberDeliveryStep;
  quoteFee: number;
  estimatedMinutes: number;
  driver?: UberDriverInfo;
  timeline: UberDeliveryTimelineItem[];
  rawRequestPayload?: any;
  rawResponsePayload?: any;
  error?: string | null;
}
