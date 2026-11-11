import React, { useState } from 'react';
import {
  User, Mail, Phone, CreditCard, MapPin, Lock, Eye, EyeOff,
  ArrowRight, ArrowLeft, CheckCircle2, Sparkles, AlertCircle
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
      <div className="px-1">
        <div className="flex items-center justify-between relative mb-2">
          <div className="absolute top-1/2 left-4 right-4 h-1 -translate-y-1/2 bg-purple-100 rounded-full" />
          <div
            className="absolute top-1/2 left-4 h-1 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-fio-pink rounded-full transition-all duration-300"
            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : 'calc(100% - 32px)' }}
          />
          {([1, 2, 3] as const).map((num) => (
            <div key={num} className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                onClick={() => step > num && goStep(num, 'prev')}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bubble font-bold text-xs transition-all ${
                  step >= num
                    ? 'bg-gradient-to-tr from-purple-600 to-fio-pink text-white shadow-xs'
                    : 'bg-white text-slate-400 border border-purple-200'
                }`}
              >
                {num}
              </button>
              <span className="text-[10px] font-bubble font-bold text-slate-500 mt-0.5">
                {num === 1 ? 'Datos' : num === 2 ? 'Contacto' : 'Confirmar'}
              </span>
            </div>
          ))}
        </div>
        <div className="text-center">
          <span className="inline-block px-3 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-fio-purple font-bubble font-bold text-[11px]">
            {step === 1 && 'Paso 1: Nombre y Correo Electrónico'}
            {step === 2 && 'Paso 2: WhatsApp y Datos de Contacto'}
            {step === 3 && (isKnownAccount ? 'Paso 3: Revisión y Aceptar Lista de Espera' : 'Paso 3: Crea tu Contraseña y Acepta')}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {step === 1 && (
        <form key="wl-step-1" onSubmit={handleStep1} className={`space-y-3 ${anim}`}>
          <div className="space-y-1">
            <label className="text-[11px] font-bubble font-bold text-slate-600 ml-1">Nombre Completo:</label>
            <div className="input-group">
              <div className="icon-badge"><User className="w-4 h-4 text-white" /></div>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre y apellido" required autoFocus className="text-xs sm:text-sm" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bubble font-bold text-slate-600 ml-1">Correo Electrónico:</label>
            <div className="input-group">
              <div className="icon-badge"><Mail className="w-4 h-4 text-white" /></div>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ejemplo@correo.com" required className="normal-case lowercase text-xs sm:text-sm" />
            </div>
            <p className="text-[10px] text-purple-700 font-bubble ml-1">* Te enviaremos confirmación automática y aviso cuando se libere un cupo.</p>
          </div>
          <button type="submit" className="btn-login mt-2">
            <span>Continuar a WhatsApp y Contacto</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {step === 2 && (
        <form key="wl-step-2" onSubmit={handleStep2} className={`space-y-3 ${anim}`}>
          <div className="space-y-1">
            <label className="text-[11px] font-bubble font-bold text-slate-600 ml-1">Teléfono / WhatsApp:</label>
            <div className="input-group">
              <div className="icon-badge"><Phone className="w-4 h-4 text-white" /></div>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ej. 8888-8888" required autoFocus className="text-xs sm:text-sm" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bubble font-bold text-slate-600 ml-1">Número de Cédula (opcional):</label>
            <div className="input-group">
              <div className="icon-badge"><CreditCard className="w-4 h-4 text-white" /></div>
              <input type="text" value={idCard} onChange={(e) => setIdCard(e.target.value)} placeholder="Ej. 1-1234-0567" className="text-xs sm:text-sm" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bubble font-bold text-slate-600 ml-1">Dirección o Cantón (opcional):</label>
            <div className="input-group">
              <div className="icon-badge"><MapPin className="w-4 h-4 text-white" /></div>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="San José, Heredia..." className="text-xs sm:text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button type="button" onClick={() => goStep(1, 'prev')} className="py-2.5 px-3.5 rounded-2xl bg-white hover:bg-purple-50 text-slate-700 font-bubble font-bold text-xs border border-purple-200 flex items-center gap-1 cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" /><span>Atrás</span>
            </button>
            <button type="submit" className="btn-login flex-1 mt-0">
              <span>Continuar</span><ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form key="wl-step-3" onSubmit={handleFinalSubmit} className={`space-y-3 ${anim}`}>
          {!isKnownAccount && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] font-bubble font-bold text-slate-600 ml-1">Crea tu Contraseña (para ver tu estado en Mi Cuenta):</label>
                <div className="input-group">
                  <div className="icon-badge"><Lock className="w-4 h-4 text-white" /></div>
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required autoFocus className="text-xs sm:text-sm" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="toggle-password">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bubble font-bold text-slate-600 ml-1">Repetir Contraseña:</label>
                <div className="input-group">
                  <div className="icon-badge"><CheckCircle2 className="w-4 h-4 text-white" /></div>
                  <input type={showPass ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirma tu contraseña" required className="text-xs sm:text-sm" />
                </div>
              </div>
            </>
          )}
          <div className="p-3 rounded-2xl bg-purple-50/90 border border-purple-200/80 text-xs text-slate-700 space-y-1">
            <p className="font-bubble font-bold text-purple-950">Resumen de tu Registro en Lista de Espera:</p>
            <p className="truncate"><strong>Nombre:</strong> {name}</p>
            <p className="truncate"><strong>Correo:</strong> {email}</p>
            <p className="truncate"><strong>WhatsApp:</strong> {phone}</p>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button type="button" onClick={() => goStep(2, 'prev')} disabled={isSubmitting} className="py-2.5 px-3.5 rounded-2xl bg-white hover:bg-purple-50 text-slate-700 font-bubble font-bold text-xs border border-purple-200 flex items-center gap-1 cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" /><span>Atrás</span>
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-login flex-1 mt-0 bg-gradient-to-r from-purple-600 via-fio-purple to-pink-600">
              <Sparkles className="w-4 h-4 text-fio-yellow fill-fio-yellow" />
              <span className="font-extrabold tracking-wide">{isSubmitting ? 'Procesando...' : 'Aceptar'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
