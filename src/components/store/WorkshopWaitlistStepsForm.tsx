import React, { useState } from 'react';
import {
  User, Mail, Phone, CreditCard, MapPin, Lock, Eye, EyeOff,
  ArrowRight, ArrowLeft, CheckCircle2, Sparkles, AlertCircle, Users
} from 'lucide-react';
import { AuthUser } from '../../types';
import { playWaterDropSound } from '../../utils/soundEffects';

export interface WaitlistFormSubmission {
  name: string;
  email: string;
  phone: string;
  idCard: string;
  address: string;
  password?: string;
}

interface WorkshopWaitlistStepsFormProps {
  initialUser?: AuthUser | null;
  isSubmitting: boolean;
  onSubmitFinal: (data: WaitlistFormSubmission) => void;
}

const hasRegisteredEmail = (email: string): boolean => {
  try {
    const clean = email.trim().toLowerCase();
    const list = JSON.parse(localStorage.getItem('byfio_registered_users_v1') || '[]');
    return Array.isArray(list) && list.some((u: any) => String(u?.email || '').trim().toLowerCase() === clean);
  } catch {
    return false;
  }
};

export const WorkshopWaitlistStepsForm: React.FC<WorkshopWaitlistStepsFormProps> = ({
  initialUser,
  isSubmitting,
  onSubmitFinal,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [name, setName] = useState(initialUser?.name || '');
  const [email, setEmail] = useState(initialUser?.email || '');
  const [phone, setPhone] = useState(initialUser?.phone || '');
  const [idCard, setIdCard] = useState(initialUser?.idCard || '');
  const [address, setAddress] = useState(initialUser?.address || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isKnownAccount = Boolean(initialUser) || hasRegisteredEmail(email);
  const anim = direction === 'next' ? 'animate-step-next' : 'animate-step-prev';

  const goStep = (target: 1 | 2 | 3, dir: 'next' | 'prev') => {
    setError(null);
    playWaterDropSound();
    setDirection(dir);
    setStep(target);
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError('Por favor escribe tu nombre completo.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase())) {
      return setError('Por favor ingresa un correo electrónico válido para notificarte.');
    }
    goStep(2, 'next');
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, '').length < 8) {
      return setError('Ingresa un número de WhatsApp / teléfono válido (mínimo 8 dígitos).');
    }
    goStep(3, 'next');
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isKnownAccount) {
      if (password.length < 6) return setError('Crea una contraseña de al menos 6 caracteres para tu cuenta.');
      if (password !== confirmPassword) return setError('Las contraseñas no coinciden.');
    }
    onSubmitFinal({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      idCard: idCard.trim(),
      address: address.trim(),
      password: !isKnownAccount ? password.trim() : undefined,
    });
  };

  return (
    <div className="space-y-4">
      {/* Barra de progreso de 3 pasos */}
      <div className="px-1">
        <div className="flex items-center justify-between relative mb-2">
          <div className="absolute top-1/2 left-4 right-4 h-1 -translate-y-1/2 bg-purple-100 rounded-full" />
          <div
            className="absolute top-1/2 left-4 h-1 -translate-y-1/2 bg-fio-pink rounded-full transition-all duration-300"
            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : 'calc(100% - 32px)' }}
          />
          {([1, 2, 3] as const).map((num) => (
            <div key={num} className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                onClick={() => step > num && goStep(num, 'prev')}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bubble font-bold text-xs transition-all ${
                  step >= num
                    ? 'bg-fio-pink text-white shadow-md scale-105'
                    : 'bg-white text-slate-400 border border-purple-200'
                }`}
              >
                {num}
              </button>
              <span className="text-[10px] font-bubble font-bold text-slate-500 mt-1">
                {num === 1 ? 'Datos' : num === 2 ? 'Contacto' : 'Confirmar'}
              </span>
            </div>
          ))}
        </div>
        <div className="text-center mt-2.5">
          <span className="inline-block px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-fio-purple font-bubble font-bold text-[11px]">
            {step === 1 && 'Paso 1: Nombre y Correo Electrónico'}
            {step === 2 && 'Paso 2: WhatsApp y Datos de Contacto'}
            {step === 3 && (isKnownAccount ? 'Paso 3: Revisión y Confirmación' : 'Paso 3: Crea tu Contraseña y Confirma')}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-sans flex items-start gap-2 animate-fadeIn text-left">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* PASO 1: NOMBRE Y CORREO */}
      {step === 1 && (
        <form key="wl-step-1" onSubmit={handleStep1} className={`space-y-3.5 text-left ${anim}`}>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bubble font-bold text-slate-700 ml-1 flex items-center gap-1.5">
              <span>Nombre Completo:</span>
              <span className="text-fio-pink">*</span>
            </label>
            <div className="relative flex items-center bg-purple-50/50 hover:bg-purple-50/80 rounded-2xl border-2 border-purple-200/80 focus-within:border-fio-pink focus-within:ring-4 focus-within:ring-fio-pink/15 transition-all shadow-neuInset p-1.5">
              <div className="w-8 h-8 rounded-xl bg-fio-pink flex items-center justify-center shrink-0 shadow-xs">
                <User className="w-4 h-4 text-white" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre y apellido"
                required
                autoFocus
                className="w-full bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 font-sans outline-none focus:outline-none focus:ring-0 border-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bubble font-bold text-slate-700 ml-1 flex items-center gap-1.5">
              <span>Correo Electrónico:</span>
              <span className="text-fio-pink">*</span>
            </label>
            <div className="relative flex items-center bg-purple-50/50 hover:bg-purple-50/80 rounded-2xl border-2 border-purple-200/80 focus-within:border-fio-pink focus-within:ring-4 focus-within:ring-fio-pink/15 transition-all shadow-neuInset p-1.5">
              <div className="w-8 h-8 rounded-xl bg-fio-pink flex items-center justify-center shrink-0 shadow-xs">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                required
                className="w-full bg-transparent px-3 py-1.5 normal-case lowercase text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 font-sans outline-none focus:outline-none focus:ring-0 border-none"
              />
            </div>
            <p className="text-[11px] text-purple-700 font-bubble ml-1 leading-tight">
              * Te enviaremos confirmación automática y aviso cuando se libere un cupo.
            </p>
          </div>

          {/* Botón rosa de la página */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl bg-fio-pink hover:bg-pink-600 text-white font-bubble font-bold text-xs sm:text-sm shadow-clayBtn hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
          >
            <span>Continuar a WhatsApp y Contacto</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* PASO 2: TELÉFONO, CÉDULA Y DIRECCIÓN */}
      {step === 2 && (
        <form key="wl-step-2" onSubmit={handleStep2} className={`space-y-3 text-left ${anim}`}>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bubble font-bold text-slate-700 ml-1 flex items-center gap-1.5">
              <span>Teléfono / WhatsApp:</span>
              <span className="text-fio-pink">*</span>
            </label>
            <div className="relative flex items-center bg-purple-50/50 hover:bg-purple-50/80 rounded-2xl border-2 border-purple-200/80 focus-within:border-fio-pink focus-within:ring-4 focus-within:ring-fio-pink/15 transition-all shadow-neuInset p-1.5">
              <div className="w-8 h-8 rounded-xl bg-fio-pink flex items-center justify-center shrink-0 shadow-xs">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej. 8888-8888"
                required
                autoFocus
                className="w-full bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 font-sans outline-none focus:outline-none focus:ring-0 border-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bubble font-bold text-slate-700 ml-1 flex items-center gap-1.5">
              <span>Número de Cédula (opcional):</span>
            </label>
            <div className="relative flex items-center bg-purple-50/50 hover:bg-purple-50/80 rounded-2xl border-2 border-purple-200/80 focus-within:border-fio-pink focus-within:ring-4 focus-within:ring-fio-pink/15 transition-all shadow-neuInset p-1.5">
              <div className="w-8 h-8 rounded-xl bg-fio-pink flex items-center justify-center shrink-0 shadow-xs">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <input
                type="text"
                value={idCard}
                onChange={(e) => setIdCard(e.target.value)}
                placeholder="Ej. 1-1234-0567"
                className="w-full bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 font-sans outline-none focus:outline-none focus:ring-0 border-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bubble font-bold text-slate-700 ml-1 flex items-center gap-1.5">
              <span>Dirección o Cantón (opcional):</span>
            </label>
            <div className="relative flex items-center bg-purple-50/50 hover:bg-purple-50/80 rounded-2xl border-2 border-purple-200/80 focus-within:border-fio-pink focus-within:ring-4 focus-within:ring-fio-pink/15 transition-all shadow-neuInset p-1.5">
              <div className="w-8 h-8 rounded-xl bg-fio-pink flex items-center justify-center shrink-0 shadow-xs">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="San José, Tibás, Heredia..."
                className="w-full bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 font-sans outline-none focus:outline-none focus:ring-0 border-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => goStep(1, 'prev')}
              className="py-3 px-4 rounded-2xl bg-white hover:bg-purple-50 text-slate-700 font-bubble font-bold text-xs border border-purple-200 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Atrás</span>
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-2xl bg-fio-pink hover:bg-pink-600 text-white font-bubble font-bold text-xs sm:text-sm shadow-clayBtn hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* PASO 3: CONFIRMACIÓN Y CONTRASEÑA */}
      {step === 3 && (
        <form key="wl-step-3" onSubmit={handleFinalSubmit} className={`space-y-3.5 text-left ${anim}`}>
          {!isKnownAccount && (
            <>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bubble font-bold text-slate-700 ml-1 flex items-center gap-1.5">
                  <span>Crea tu Contraseña (para ver tu estado en Mi Cuenta):</span>
                  <span className="text-fio-pink">*</span>
                </label>
                <div className="relative flex items-center bg-purple-50/50 hover:bg-purple-50/80 rounded-2xl border-2 border-purple-200/80 focus-within:border-fio-pink focus-within:ring-4 focus-within:ring-fio-pink/15 transition-all shadow-neuInset p-1.5">
                  <div className="w-8 h-8 rounded-xl bg-fio-pink flex items-center justify-center shrink-0 shadow-xs">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    autoFocus
                    className="w-full bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 font-sans outline-none focus:outline-none focus:ring-0 border-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="p-1.5 text-slate-400 hover:text-fio-pink transition-colors cursor-pointer"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bubble font-bold text-slate-700 ml-1 flex items-center gap-1.5">
                  <span>Repetir Contraseña:</span>
                  <span className="text-fio-pink">*</span>
                </label>
                <div className="relative flex items-center bg-purple-50/50 hover:bg-purple-50/80 rounded-2xl border-2 border-purple-200/80 focus-within:border-fio-pink focus-within:ring-4 focus-within:ring-fio-pink/15 transition-all shadow-neuInset p-1.5">
                  <div className="w-8 h-8 rounded-xl bg-fio-pink flex items-center justify-center shrink-0 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirma tu contraseña"
                    required
                    className="w-full bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 font-sans outline-none focus:outline-none focus:ring-0 border-none"
                  />
                </div>
              </div>
            </>
          )}

          <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200/80 text-xs text-slate-700 space-y-1.5 font-sans dark:bg-[#1E1A30] dark:border-purple-800/60 dark:text-slate-300">
            <p className="font-bubble font-bold text-purple-950 dark:text-purple-200 text-sm">Resumen de tu Registro en Lista de Espera:</p>
            <p className="truncate"><strong className="text-purple-900 dark:text-purple-300">Nombre:</strong> {name}</p>
            <p className="truncate"><strong className="text-purple-900 dark:text-purple-300">Correo:</strong> {email}</p>
            <p className="truncate"><strong className="text-purple-900 dark:text-purple-300">WhatsApp:</strong> {phone}</p>
            {idCard && <p className="truncate"><strong className="text-purple-900 dark:text-purple-300">Cédula:</strong> {idCard}</p>}
            {address && <p className="truncate"><strong className="text-purple-900 dark:text-purple-300">Ubicación:</strong> {address}</p>}
          </div>

          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => goStep(2, 'prev')}
              disabled={isSubmitting}
              className="py-3 px-4 rounded-2xl bg-white hover:bg-purple-50 text-slate-700 font-bubble font-bold text-xs border border-purple-200 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all dark:bg-[#1E1A30] dark:hover:bg-[#25203D] dark:text-slate-200 dark:border-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Atrás</span>
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-fio-pink hover:bg-pink-600 text-white font-bubble font-bold text-xs sm:text-sm shadow-clayBtn hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 dark:bg-gradient-to-r dark:from-purple-600 dark:to-fio-pink dark:hover:opacity-95 dark:shadow-[0_0_20px_rgba(217,70,239,0.35)]"
            >
              <Users className="w-4 h-4" />
              <span className="font-extrabold tracking-wide">
                {isSubmitting ? 'Procesando...' : 'Ingresar a la lista de espera'}
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
