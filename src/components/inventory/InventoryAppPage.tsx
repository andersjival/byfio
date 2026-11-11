import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppRoute } from '../../types';
import { InventoryShelvesView } from './InventoryShelvesView';
import { InventoryCountSession } from './InventoryCountSession';
import { InventoryAdjustmentsView } from './InventoryAdjustmentsView';
import { InventoryHistoryReportsView } from './InventoryHistoryReportsView';
import { InventorySweepView } from './InventorySweepView';
import {
  ClipboardList, Layers, SlidersHorizontal, FileText, ArrowLeft,
  Lock, KeyRound, Smartphone, LogOut, User, ShieldAlert, Boxes, Scan
} from 'lucide-react';
import { playWaterDropSound, playBubblePopSound } from '../../utils/soundEffects';

interface InventoryAppPageProps {
  onNavigate: (route: AppRoute, tab?: any) => void;
}

type InventoryModuleTab = 'shelves' | 'sweep' | 'adjustments' | 'history';

export const InventoryAppPage: React.FC<InventoryAppPageProps> = ({ onNavigate }) => {
  const {
    currentUser,
    isSuperAdminAuthenticated,
    loginWithPin,
    logoutUser,
    collaboratorInventoryEnabled,
    toggleCollaboratorInventoryEnabled,
    inventoryAdjustments,
    sweepEntries,
  } = useApp();

  const [activeModule, setActiveModule] = useState<InventoryModuleTab>('shelves');
  const [activeShelfCounting, setActiveShelfCounting] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  const isAdmin = isSuperAdminAuthenticated || (currentUser?.role === 'admin' || !!currentUser?.isMasterAdmin);
  const isStaff = currentUser?.role === 'staff';
  const isAuthenticated = isSuperAdminAuthenticated || Boolean(currentUser && (currentUser.role === 'admin' || currentUser.role === 'staff'));

  const handlePinDigit = (digit: string) => {
    playWaterDropSound();
    if (pinInput.length >= 4) return;
    const nextPin = pinInput + digit;
    setPinInput(nextPin);
    setPinError(null);

    if (nextPin.length === 4) {
      const res = loginWithPin(nextPin);
      if (res.success) {
        playBubblePopSound();
        setPinInput('');
      } else {
        setPinError(res.error || 'PIN incorrecto');
        setTimeout(() => setPinInput(''), 600);
      }
    }
  };

  const handleBackNavigation = () => {
    playWaterDropSound();
    if (isAdmin) {
      onNavigate('admin', 'inventory');
    } else {
      onNavigate('pedidos-mobile');
    }
  };

  // 1. Pantalla de Acceso con PIN si no ha iniciado sesión como Colaborador o Admin
  if (!isAuthenticated) {
    return (
      <div className="min-h-[100dvh] w-full bg-gradient-to-br from-[#F6EEFF] via-[#FFF6FA] to-[#EDE2FF] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-3xl border border-purple-200/90 shadow-2xl p-6 space-y-5 text-center animate-scaleUp">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-700 via-fio-purple to-fio-pink text-white mx-auto flex items-center justify-center shadow-md">
            <ClipboardList className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bubble font-bold bg-purple-100 text-purple-800 uppercase tracking-wider">
              PWA Inventarios By.Fio
            </span>
            <h1 className="font-bubble font-bold text-xl text-slate-900">
              Acceso a Toma de Inventario
            </h1>
            <p className="text-xs text-slate-500 font-sans">
              Ingresa tu PIN de 4 dígitos para iniciar sesión como colaborador o administrador.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 py-2">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  pinInput.length > idx
                    ? 'bg-fio-pink border-purple-500 scale-110'
                    : 'bg-purple-50 border-purple-200'
                }`}
              />
            ))}
          </div>

          {pinError && <p className="text-xs text-rose-600 font-bold">{pinError}</p>}

          <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => handlePinDigit(d)}
                className="h-12 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-mono font-bold text-lg border border-purple-200 active:scale-95 transition-all cursor-pointer"
              >
                {d}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPinInput('')}
              className="h-12 rounded-2xl bg-slate-100 text-slate-600 font-bubble text-xs active:scale-95 cursor-pointer"
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={() => handlePinDigit('0')}
              className="h-12 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-mono font-bold text-lg border border-purple-200 active:scale-95 transition-all cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => setPinInput((p) => p.slice(0, -1))}
              className="h-12 rounded-2xl bg-slate-100 text-slate-600 font-bubble text-xs active:scale-95 cursor-pointer"
            >
              ←
            </button>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-xs text-slate-400 hover:text-purple-700 font-bubble cursor-pointer pt-2"
          >
            ← Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  // 2. Bloqueo si el colaborador intenta ingresar cuando el admin desactivó el módulo
  if (isStaff && !isAdmin && !collaboratorInventoryEnabled) {
    return (
      <div className="min-h-[100dvh] w-full bg-[#F9F6FE] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-purple-200 p-6 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-bubble font-bold text-lg text-slate-900">
              Módulo de Inventario Desactivado
            </h2>
            <p className="text-xs text-slate-500 font-sans leading-relaxed">
              Hola <strong>{currentUser?.name}</strong>, la toma física de inventario en la PWA de colaboradores está desactivada en este momento por administración.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('pedidos-mobile')}
              className="flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-purple-700 to-fio-pink text-white font-bubble font-bold text-xs cursor-pointer"
            >
              Volver a Pedidos
            </button>
            <button
              type="button"
              onClick={() => {
                logoutUser();
                setPinInput('');
              }}
              className="py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bubble font-bold text-xs cursor-pointer"
            >
              Cambiar Usuario
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[#F7F4FC] flex flex-col text-slate-800">
      {/* Header Independiente de la App PWA de Inventario */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-2xs">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleBackNavigation}
              className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 transition-all active:scale-95 cursor-pointer"
              title={isAdmin ? 'Volver a Mis Productos' : 'Volver a Pedidos'}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-700 via-fio-purple to-fio-pink text-white flex items-center justify-center shadow-xs">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bubble font-bold text-sm sm:text-base text-fio-900 leading-none">
                  App de Inventarios By.Fio
                </h1>
                <span className="text-[10px] font-sans text-slate-500 flex items-center gap-1 mt-0.5">
                  <User className="w-3 h-3 text-fio-pink" />
                  {currentUser?.name || 'Administración'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Switch rápido para el Administrador: Activar / Desactivar en PWA Colaborador */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  playWaterDropSound();
                  toggleCollaboratorInventoryEnabled();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bubble font-bold transition-all active:scale-95 cursor-pointer ${
                  collaboratorInventoryEnabled
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
                title="Activar o desactivar este módulo en la PWA del colaborador"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PWA Colaborador:</span>
                <span>{collaboratorInventoryEnabled ? 'ON' : 'OFF'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                playWaterDropSound();
                logoutUser();
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
              title="Cerrar sesión / Cambiar PIN"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Barra de Navegación Interna de Módulos de Inventario */}
        {!activeShelfCounting && (
          <div className="max-w-6xl mx-auto px-3 sm:px-6 pb-2.5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-purple-50/80 p-1 rounded-2xl border border-purple-100">
              <button
                type="button"
                onClick={() => {
                  playWaterDropSound();
                  setActiveModule('sweep');
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
                  activeModule === 'sweep'
                    ? 'bg-white text-purple-900 shadow-xs border border-purple-200/60'
                    : 'text-slate-600 hover:text-purple-800'
                }`}
              >
                <Scan className="w-4 h-4 text-fuchsia-600 shrink-0" />
                <span className="truncate">
                  Inv. por Barrido ({sweepEntries.filter((e) => e.status === 'guardado').length})
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playWaterDropSound();
                  setActiveModule('shelves');
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
                  activeModule === 'shelves'
                    ? 'bg-white text-purple-900 shadow-xs border border-purple-200/60'
                    : 'text-slate-600 hover:text-purple-800'
                }`}
              >
                <Layers className="w-4 h-4 text-fio-pink shrink-0" />
                <span className="truncate">Realizar Inventario</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playWaterDropSound();
                  setActiveModule('adjustments');
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
                  activeModule === 'adjustments'
                    ? 'bg-white text-purple-900 shadow-xs border border-purple-200/60'
                    : 'text-slate-600 hover:text-purple-800'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="truncate">Ajustes</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playWaterDropSound();
                  setActiveModule('history');
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
                  activeModule === 'history'
                    ? 'bg-white text-purple-900 shadow-xs border border-purple-200/60'
                    : 'text-slate-600 hover:text-purple-800'
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">
                  Reportes ({inventoryAdjustments.length})
                </span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Área Principal del Módulo Activo */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-3 sm:p-6">
        {activeShelfCounting ? (
          <InventoryCountSession
            shelfName={activeShelfCounting}
            onBack={() => setActiveShelfCounting(null)}
            onCompleted={() => {
              setActiveShelfCounting(null);
            }}
          />
        ) : (
          <>
            {activeModule === 'shelves' && (
              <InventoryShelvesView
                onStartShelfCount={(shelfName) => setActiveShelfCounting(shelfName)}
              />
            )}
            {activeModule === 'adjustments' && (
              <InventoryAdjustmentsView
                onSaved={() => {
                  // Mantener al usuario en ajustes con notificación o permitirle ir a reportes
                }}
              />
            )}
            {activeModule === 'history' && <InventoryHistoryReportsView />}
            {activeModule === 'sweep' && <InventorySweepView />}
          </>
        )}
      </main>
    </div>
  );
};
