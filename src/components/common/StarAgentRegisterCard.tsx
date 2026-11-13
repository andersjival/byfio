import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Sparkles, UserCheck, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { playBubblePopSound, playWaterDropSound } from '../../utils/soundEffects';

interface StarAgentRegisterCardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: { name: string; email: string }) => void;
}

export const StarAgentRegisterCard: React.FC<StarAgentRegisterCardProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { registerUser } = useApp();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: string, value: string) => {
    setError(null);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep1 = () => {
    if (!formData.name.trim()) {
      setError('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Por favor ingresa tu número de WhatsApp.');
      return;
    }
    playBubblePopSound(0.25);
    setStep(2);
  };

  const handleNextStep2 = () => {
    const cleanEmail = formData.email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Por favor ingresa un correo electrónico válido.');
      return;
    }
    if (!formData.address.trim()) {
      setError('Por favor indica tu dirección o provincia.');
      return;
    }
    playBubblePopSound(0.25);
    setStep(3);
  };

  const handleSubmitStep3 = () => {
    if (!formData.password || formData.password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const regResult = registerUser(
      formData.email,
      formData.password,
      formData.name,
      formData.phone,
      '',
      formData.address,
      undefined,
      undefined,
      { skipWelcomeModal: true }
    );

    if (regResult && !regResult.success) {
      setError(regResult.error || 'Inconveniente al registrar cuenta.');
      return;
    }

    playBubblePopSound(0.4);
    setStep(4);

    // Tras 2 segundos mostrar animación de despedida y cerrar
    setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => {
        onSuccess({ name: formData.name, email: formData.email });
        onClose();
        setIsClosing(false);
        setStep(1);
      }, 450);
    }, 2000);
  };

  const handleClose = () => {
    playWaterDropSound();
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setStep(1);
    }, 450);
  };

  return (
    <div
      className={`fixed inset-x-3 bottom-3 top-16 sm:relative sm:inset-auto sm:top-auto sm:bottom-auto w-auto sm:w-[360px] h-auto sm:h-[620px] bg-white/95 dark:bg-[#1f1535]/95 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-fio-300 dark:border-purple-500/50 flex flex-col justify-between overflow-hidden z-30 sm:z-10 transition-all ${
        isClosing ? 'animate-slide-into-behind' : 'animate-slide-from-behind'
      }`}
    >
      {/* Fondo Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-fio-pink/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-fio-100 dark:border-purple-900/40 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-gradient-to-tr from-fio-pink to-purple-600 text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h4 className="font-bubble font-black text-sm text-fio-900 dark:text-purple-100">
              Registro Rápido
            </h4>
            <p className="text-[10px] text-fio-pink font-bold">
              {step < 4 ? `Paso ${step} de 3` : '¡Completado!'}
            </p>
          </div>
        </div>

        {step < 4 && (
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-purple-900/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Contenido según el Paso */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-3">
        {error && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-in fade-in">
            {error}
          </div>
        )}

        {/* PASO 1: Nombre y Teléfono */}
        {step === 1 && (
          <div className="space-y-3.5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-purple-200 mb-1">
                1. Tu Nombre Completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ej. Fiorella Jara"
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-purple-950/50 border border-slate-200 dark:border-purple-800/40 text-xs sm:text-sm text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-fio-pink/50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-purple-200 mb-1">
                2. Número de WhatsApp
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Ej. 8888-8888"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-purple-950/50 border border-slate-200 dark:border-purple-800/40 text-xs sm:text-sm text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-fio-pink/50"
              />
            </div>
          </div>
        )}

        {/* PASO 2: Correo y Dirección */}
        {step === 2 && (
          <div className="space-y-3.5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-purple-200 mb-1">
                3. Correo Electrónico
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="tu@correo.com"
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-purple-950/50 border border-slate-200 dark:border-purple-800/40 text-xs sm:text-sm text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-fio-pink/50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-purple-200 mb-1">
                4. Dirección o Provincia (Envíos)
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Ej. Tibás, San José"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-purple-950/50 border border-slate-200 dark:border-purple-800/40 text-xs sm:text-sm text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-fio-pink/50"
              />
            </div>
          </div>
        )}

        {/* PASO 3: Contraseña y Confirmación */}
        {step === 3 && (
          <div className="space-y-3.5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-purple-200 mb-1">
                5. Crea tu Contraseña
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Mínimo 4 caracteres"
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-purple-950/50 border border-slate-200 dark:border-purple-800/40 text-xs sm:text-sm text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-fio-pink/50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-purple-200 mb-1">
                6. Confirma tu Contraseña
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="Repite la contraseña"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-purple-950/50 border border-slate-200 dark:border-purple-800/40 text-xs sm:text-sm text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-fio-pink/50"
              />
            </div>
          </div>
        )}

        {/* PASO 4: Pantalla de Bienvenida */}
        {step === 4 && (
          <div className="text-center py-6 space-y-3 animate-in zoom-in-95 duration-400">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-pink-500 text-white flex items-center justify-center shadow-lg animate-bounce">
              <Heart className="w-8 h-8 fill-current" />
            </div>
            <h3 className="font-bubble font-black text-xl sm:text-2xl text-fio-900 dark:text-purple-100 leading-snug">
              ¡Bienvenido a by.fio! 🌸🎉
            </h3>
            <p className="text-xs text-slate-600 dark:text-purple-200 font-medium max-w-xs mx-auto">
              Tu cuenta ha sido creada exitosamente. ¡Estamos listos para crear cosas lindas juntos! ✨
            </p>
          </div>
        )}
      </div>

      {/* Botones Inferiores */}
      {step < 4 && (
        <div className="relative z-10 pt-3 border-t border-fio-100 dark:border-purple-900/40 flex items-center justify-between gap-2">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                playWaterDropSound();
                setStep((prev) => (prev - 1) as any);
              }}
              className="p-2.5 rounded-2xl border border-slate-200 dark:border-purple-800 text-slate-600 dark:text-purple-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-purple-900/40 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={step === 1 ? handleNextStep1 : step === 2 ? handleNextStep2 : handleSubmitStep3}
            className="flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-purple-700 via-fio-pink to-purple-800 hover:opacity-95 text-white font-bubble font-bold text-xs sm:text-sm shadow-clayBtn transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{step === 3 ? 'Finalizar Registro 🌸' : 'Siguiente ✨'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
