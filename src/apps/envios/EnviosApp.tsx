import React, { useState } from 'react';
import { useEnviosAuth } from './hooks/useEnviosAuth';
import { useUberDirectDispatch } from './hooks/useUberDirectDispatch';
import { getStoredUberSettings, saveStoredUberSettings } from './services/uberDirectService';
import { EnviosLoginGate } from './components/EnviosLoginGate';
import { UberDirectConfigModal } from './components/UberDirectConfigModal';
import { EnviosProductPicker } from './components/EnviosProductPicker';
import { EnviosCheckoutForm } from './components/EnviosCheckoutForm';
import { UberDirectLiveMonitor } from './components/UberDirectLiveMonitor';
import { Truck, Settings, LogOut, ArrowLeft, Shield, KeyRound, Sparkles } from 'lucide-react';
import { AppRoute } from '../../types';

interface EnviosAppProps {
  onNavigate?: (route: AppRoute) => void;
}

export const EnviosApp: React.FC<EnviosAppProps> = ({ onNavigate }) => {
  const {
    isAuthenticated,
    session,
    authError,
    clearError,
    handleSuperadminLogin,
    handleTokenLogin,
    logout,
  } = useEnviosAuth();

  const [uberSettings, setUberSettings] = useState(getStoredUberSettings);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const {
    selectedProduct,
    setSelectedProduct,
    customer,
    setCustomer,
    quote,
    delivery,
    isAutoPlaying,
    startDispatch,
    advanceStep,
    cancelDelivery,
    resetFlow,
  } = useUberDirectDispatch(uberSettings);

  const handleSaveSettings = (newSettings: typeof uberSettings) => {
    setUberSettings(newSettings);
    saveStoredUberSettings(newSettings);
  };

  if (!isAuthenticated) {
    return (
      <EnviosLoginGate
        onSuperadminLogin={handleSuperadminLogin}
        onTokenLogin={handleTokenLogin}
        errorMessage={authError}
        onClearError={clearError}
        onNavigateHome={() => (onNavigate ? onNavigate('home') : (window.location.href = '/'))}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#150B24] to-slate-950 text-white font-sans pb-16">
      {/* Barra de Navegación Superior */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-purple-500/20 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono tracking-wider font-bold text-emerald-400 uppercase">
                  envios.byfiocr.com
                </span>
                <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                  uberSettings.credentials.environment === 'sandbox'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {uberSettings.credentials.environment.toUpperCase()}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bubble font-bold text-white leading-tight">
                Entorno de Pruebas Uber Direct
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsConfigOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-600/60 hover:bg-purple-600 text-white text-xs font-bubble font-bold border border-purple-400/40 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4 text-fio-yellow" />
              <span>Configuración Uber Direct</span>
            </button>

            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-purple-200">
              {session?.type === 'superadmin' ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-fio-yellow" />
                  <span>Superadmin</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="truncate max-w-[120px]">{session?.identity || 'Token'}</span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={logout}
              title="Cerrar Sesión de Envíos"
              className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {delivery ? (
          <UberDirectLiveMonitor
            delivery={delivery}
            isAutoPlaying={isAutoPlaying}
            onAdvanceStep={advanceStep}
            onToggleAutoPlay={() => useUberDirectDispatch(uberSettings)}
            onCancelDelivery={cancelDelivery}
            onResetFlow={resetFlow}
          />
        ) : (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900/60 to-purple-950/50 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[11px] font-mono text-emerald-400 uppercase font-bold">
                  Simulación Integral de Compra y Logística
                </span>
                <h2 className="text-base sm:text-lg font-bubble font-bold text-white">
                  Flujo de Compra &amp; Despacho en Tiempo Real
                </h2>
                <p className="text-xs text-purple-200/80">
                  Selecciona uno de los productos de prueba, ingresa la dirección del destinatario y confirma para ver la solicitud en pantalla.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsConfigOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-purple-600/40 hover:bg-purple-600 text-white text-xs font-bubble font-bold border border-purple-400/40 flex items-center gap-1.5 shrink-0"
              >
                <Settings className="w-3.5 h-3.5 text-fio-yellow" />
                <span>Área de Configuración</span>
              </button>
            </div>

            <EnviosProductPicker
              selectedProduct={selectedProduct}
              onSelectProduct={setSelectedProduct}
            />

            <EnviosCheckoutForm
              product={selectedProduct}
              customer={customer}
              quoteFee={quote.fee}
              etaMinutes={quote.etaMinutes}
              onChangeCustomer={setCustomer}
              onConfirmPaymentAndDispatch={startDispatch}
            />
          </div>
        )}
      </main>

      {/* Modal de Configuración Uber Direct */}
      <UberDirectConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        settings={uberSettings}
        onSave={handleSaveSettings}
      />
    </div>
  );
};

export default EnviosApp;
