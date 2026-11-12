import React, { useState } from 'react';
import {
  User, Mail, Phone, CreditCard, Lock, Eye, EyeOff,
  ArrowRight, ArrowLeft, CheckCircle2, Sparkles, AlertCircle, MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { AuthUser } from '../../types';
import { playWaterDropSound, playBubblePopSound } from '../../utils/soundEffects';
import { RegisterMapModal } from './RegisterMapModal';

interface ThreeStepRegisterFormProps {
  onSuccess: (user: AuthUser) => void;
  onSwitchToLogin: () => void;
}

export const ThreeStepRegisterForm: React.FC<ThreeStepRegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const { registerUser } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  // Paso 1: Nombre y Correo
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Paso 2: Teléfono, Cédula y Dirección
  const [phone, setPhone] = useState('');
  const [idCard, setIdCard] = useState('');
  const [province, setProvince] = useState('San José');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Paso 3: Contraseña y Repetir
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Validación de Paso 1
  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 2) {
      setErrorMessage('Por favor escribe tu nombre completo.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage('Por favor ingresa un correo electrónico válido.');
      return;
    }

    playWaterDropSound();
    setDirection('next');
    setStep(2);
  };

  // Validación de Paso 2
  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanPhone = phone.trim();
    const cleanId = idCard.trim();

    if (cleanPhone.length < 8) {
      setErrorMessage('Ingresa un número de teléfono de al menos 8 dígitos.');
      return;
    }

    if (cleanId.length < 7) {
      setErrorMessage('Ingresa un número de cédula válido (física, jurídica o DIMEX).');
      return;
    }

    playWaterDropSound();
    setDirection('next');
    setStep(3);
  };

  // Retorno a paso anterior
  const handleGoBack = (targetStep: 1 | 2) => {
    setErrorMessage(null);
    playWaterDropSound();
    setDirection('prev');
    setStep(targetStep);
  };

  // Paso 3: Finalizar registro con el botón Aceptar
  const handleSubmitFinal = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden. Verifícalas e inténtalo de nuevo.');
      return;
    }

    setIsLoading(true);
    playBubblePopSound();

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();
      try {
        localStorage.setItem('byfio_saved_login_email', cleanEmail);
      } catch {}

      const res = registerUser(
        cleanEmail,
        cleanPass,
        name.trim(),
        phone.trim(),
        idCard.trim(),
        address.trim(),
        lat ?? undefined,
        lng ?? undefined,
        { province }
      );
      setIsLoading(false);

      if (res.success && res.user) {
        try {
          confetti({
            particleCount: 75,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch {}
        onSuccess(res.user);
      } else {
        setErrorMessage(res.error || 'Ocurrió un error al registrar tu cuenta.');
      }
    }, 250);
  };

  const animationClass = direction === 'next' ? 'animate-step-next' : 'animate-step-prev';

  return (
    <div className="w-full space-y-3">
      {/* Indicador Interactivo de 3 Pasos */}
      <div className="px-1 pt-1">
        <div className="flex items-center justify-between relative mb-2">
          {/* Línea de fondo */}
          <div className="absolute top-1/2 left-4 right-4 h-1 -translate-y-1/2 bg-purple-100 rounded-full z-0" />
          
          {/* Línea de progreso activa */}
          <div
            className="absolute top-1/2 left-4 h-1 -translate-y-1/2 bg-gradient-to-r from-purple-600 via-pink-500 to-fio-pink rounded-full transition-all duration-300 z-0"
            style={{
              width: step === 1 ? '0%' : step === 2 ? '50%' : 'calc(100% - 32px)',
            }}
          />

          {/* Paso 1 */}
          <div className="relative z-10 flex flex-col items-center">
            <button
              type="button"
              onClick={() => step > 1 && handleGoBack(1)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bubble font-bold text-xs transition-all ${
                step >= 1
                  ? 'bg-gradient-to-tr from-purple-600 to-fio-pink text-white shadow-xs scale-105'
                  : 'bg-white text-slate-400 border border-purple-200'
              }`}
              title="Paso 1: Nombre y Correo"
            >
              1
            </button>
            <span className="text-[10px] font-bubble font-bold text-slate-600 mt-0.5">
              Datos
            </span>
          </div>

          {/* Paso 2 */}
          <div className="relative z-10 flex flex-col items-center">
            <button
              type="button"
              onClick={() => step > 2 && handleGoBack(2)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bubble font-bold text-xs transition-all ${
                step >= 2
                  ? 'bg-gradient-to-tr from-purple-600 to-fio-pink text-white shadow-xs scale-105'
                  : 'bg-white text-slate-400 border border-purple-200'
              }`}
              title="Paso 2: Teléfono, Cédula y Dirección"
            >
              2
            </button>
            <span className="text-[10px] font-bubble font-bold text-slate-600 mt-0.5">
              Contacto
            </span>
          </div>

          {/* Paso 3 */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bubble font-bold text-xs transition-all ${
                step === 3
                  ? 'bg-gradient-to-tr from-purple-600 to-fio-pink text-white shadow-xs scale-105'
                  : 'bg-white text-slate-400 border border-purple-200'
              }`}
            >
              3
            </div>
            <span className="text-[10px] font-bubble font-bold text-slate-600 mt-0.5">
              Seguridad
            </span>
          </div>
        </div>

        {/* Subtítulo dinámico del paso activo */}
        <div className="text-center">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-fio-purple font-bubble font-bold text-[11px]">
            {step === 1 && 'Paso 1: Nombre y Correo Electrónico'}
            {step === 2 && 'Paso 2: Teléfono, Cédula y Dirección'}
            {step === 3 && 'Paso 3: Contraseña y Confirmación'}
          </span>
        </div>
      </div>

      {/* Alerta de Error */}
      {errorMessage && (
        <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-sans flex items-start gap-2 animate-fadeIn text-left">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <span className="leading-tight">{errorMessage}</span>
        </div>
      )}

      {/* Ventana Interactiva con Transición Suave */}
      <div className="relative overflow-hidden min-h-[220px]">
        {/* PASO 1: NOMBRE Y CORREO */}
        {step === 1 && (
          <form key="step-1" onSubmit={handleNextStep1} className={`space-y-3 ${animationClass}`}>
            <div className="space-y-1 text-left">
              <label className="text-[11px] font-bubble font-bold text-slate-600 ml-1">
                Nombre Completo:
              </label>
              <div className="input-group">
                <div className="icon-badge">
                  <User className="w-4 h-4 text-white" />
                </div>
                <input
                  type="text"
                  placeholder="Tu nombre y apellido"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  required
                  autoFocus
                  autoComplete="name"
                  className="font-sans text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-[11px] font-bubble font-bold text-slate-600 ml-1">
                Correo Electrónico (Tu Usuario):
              </label>
              <div className="input-group">
                <div className="icon-badge">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  autoComplete="email"
                  className="normal-case lowercase font-sans text-xs sm:text-sm"
                />
              </div>
              <p className="text-[10px] text-purple-700 font-bubble ml-1">
                * Tu correo será el usuario con el que ingresarás al sitio.
              </p>
            </div>

            <button
              type="submit"
              className="btn-login mt-2"
            >
              <span>Continuar a Contacto y Dirección</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* PASO 2: TELÉFONO, NÚMERO DE CÉDULA Y DIRECCIÓN */}
        {step === 2 && (
          <form key="step-2" onSubmit={handleNextStep2} className={`space-y-3 ${animationClass}`}>
            <div className="space-y-1 text-left">
              <label className="text-[11px] font-bubble font-bold text-slate-600 ml-1">
                Teléfono de Contacto:
              </label>
              <div className="input-group">
                <div className="icon-badge">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <input
                  type="tel"
                  placeholder="ej. 8888-8888"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  required
                  autoFocus
                  autoComplete="tel"
                  className="font-sans text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-[11px] font-bubble font-bold text-slate-600 ml-1">
                Número de Cédula:
              </label>
              <div className="input-group">
                <div className="icon-badge">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <input
                  type="text"
                  placeholder="ej. 1-1234-0567 o DIMEX"
                  value={idCard}
                  onChange={(e) => {
                    setIdCard(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  required
                  autoComplete="off"
                  className="font-sans text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Provincia de Costa Rica */}
            <div className="space-y-1 text-left">
              <label className="text-[11px] font-bubble font-bold text-slate-600 ml-1">
                Provincia de Costa Rica:
              </label>
              <div className="input-group">
                <div className="icon-badge">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="font-sans text-xs sm:text-sm bg-transparent w-full text-slate-800 focus:outline-none"
                >
                  <option value="San José">San José</option>
                  <option value="Alajuela">Alajuela</option>
                  <option value="Cartago">Cartago</option>
                  <option value="Heredia">Heredia</option>
                  <option value="Guanacaste">Guanacaste</option>
                  <option value="Puntarenas">Puntarenas</option>
                  <option value="Limón">Limón</option>
                </select>
              </div>
            </div>

            {/* Dirección en Texto */}
            <div className="space-y-1 text-left">
              <label className="text-[11px] font-bubble font-bold text-slate-600 ml-1">
                Dirección Exacta de Entrega (Texto):
              </label>
              <div className="input-group">
                <div className="icon-badge">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <input
                  type="text"
                  placeholder="ej. De la iglesia 100m norte, portón blanco..."
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  autoComplete="street-address"
                  className="font-sans text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Ubicación con PIN en Mapa Real */}
            <div className="space-y-1 text-left">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-bubble font-bold text-slate-600">
                  Ubicación con PIN en Mapa:
                </label>
                {lat !== null && lng !== null && (
                  <span className="text-[10px] font-bubble font-bold text-emerald-600 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>PIN Fijado</span>
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  playWaterDropSound();
                  setIsMapModalOpen(true);
                }}
                className={`w-full p-2.5 rounded-2xl border transition-all flex items-center justify-between text-xs cursor-pointer active:scale-[0.99] ${
                  lat !== null && lng !== null
                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900 shadow-xs hover:bg-emerald-100/70'
                    : 'bg-purple-50/60 hover:bg-purple-100/70 border-purple-200 text-purple-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs transition-colors ${
                      lat !== null && lng !== null
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gradient-to-tr from-purple-600 to-fio-pink text-white'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-bubble font-bold leading-tight text-[11px] sm:text-xs">
                      {lat !== null && lng !== null
                        ? 'Ubicación seleccionada con PIN'
                        : 'Elegir Ubicación con PIN en Mapa Real'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans leading-tight mt-0.5">
                      {lat !== null && lng !== null
                        ? `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)} • Clic para mover`
                        : 'Abre el mapa de Costa Rica para marcar el punto exacto'}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-bubble font-bold text-fio-purple underline shrink-0 ml-1">
                  {lat !== null && lng !== null ? 'Cambiar' : 'Abrir Mapa'}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleGoBack(1)}
                className="py-2.5 px-3.5 rounded-2xl bg-white hover:bg-purple-50 text-slate-700 font-bubble font-bold text-xs border border-purple-200 transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Atrás</span>
              </button>

              <button
                type="submit"
                className="btn-login flex-1 mt-0"
              >
                <span>Continuar a Seguridad</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* PASO 3: CONTRASEÑA Y REPETIR */}
        {step === 3 && (
          <form key="step-3" onSubmit={handleSubmitFinal} className={`space-y-3 ${animationClass}`}>
            <div className="space-y-1 text-left">
              <label className="text-[11px] font-bubble font-bold text-slate-600 ml-1">
                Crea tu Contraseña:
              </label>
              <div className="input-group">
                <div className="icon-badge">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  required
                  autoFocus
                  autoComplete="new-password"
                  className="font-sans text-xs sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password focus:outline-none"
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-[11px] font-bubble font-bold text-slate-600 ml-1">
                Repetir Contraseña:
              </label>
              <div className="input-group">
                <div className="icon-badge">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirma tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  required
                  autoComplete="new-password"
                  className="font-sans text-xs sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="toggle-password focus:outline-none"
                  title={showConfirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {confirmPassword.length > 0 && (
                <div className="text-[10px] font-bubble ml-1">
                  {password === confirmPassword ? (
                    <span className="text-emerald-600 font-bold">✓ Las contraseñas coinciden perfectamente</span>
                  ) : (
                    <span className="text-rose-500 font-bold">✕ Las contraseñas no coinciden aún</span>
                  )}
                </div>
              )}
            </div>

            {/* Resumen Compacto de la Cuenta */}
            <div className="p-2 rounded-xl bg-purple-50/80 border border-purple-200/80 text-[11px] text-slate-700 text-left font-sans space-y-0.5">
              <div className="truncate">
                <span className="font-bubble font-bold text-purple-900">Usuario:</span>{' '}
                <span className="font-semibold text-fio-purple">{email || '—'}</span>
              </div>
              <div className="truncate text-slate-500 text-[10px]">
                {name} • Tel: {phone} • Cédula: {idCard}
              </div>
              {(address || (lat !== null && lng !== null)) && (
                <div className="truncate text-slate-600 text-[10px] flex items-center gap-1 font-medium">
                  <MapPin className="w-3 h-3 text-fio-purple shrink-0" />
                  <span className="truncate">
                    {address || 'Ubicación seleccionada en mapa'}
                    {lat !== null && lng !== null ? ` (${lat.toFixed(4)}, ${lng.toFixed(4)})` : ''}
                  </span>
                </div>
              )}
            </div>

            {/* Botones Finales con el Botón Aceptar Mandatorio */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleGoBack(2)}
                disabled={isLoading}
                className="py-2.5 px-3.5 rounded-2xl bg-white hover:bg-purple-50 text-slate-700 font-bubble font-bold text-xs border border-purple-200 transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Atrás</span>
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-login flex-1 mt-0 bg-gradient-to-r from-purple-600 via-fio-purple to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isLoading ? (
                  <span>Registrando...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-fio-yellow fill-fio-yellow" />
                    <span className="font-extrabold tracking-wide">Aceptar</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Selector para cambiar a Iniciar Sesión */}
      <div className="pt-2 text-center border-t border-purple-100">
        <p className="text-xs font-sans text-slate-500">
          ¿Ya tienes una cuenta?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-bubble font-bold text-fio-purple hover:text-fio-pink hover:underline transition-colors cursor-pointer"
          >
            Inicia Sesión aquí
          </button>
        </p>
      </div>

      {/* Modal Interactivo de Mapa Real con PIN */}
      <RegisterMapModal
        isOpen={isMapModalOpen}
        initialLat={lat}
        initialLng={lng}
        initialAddress={address}
        onClose={() => setIsMapModalOpen(false)}
        onConfirm={(coords) => {
          setLat(coords.lat);
          setLng(coords.lng);
          if (!address.trim() && coords.addressSuggestion) {
            setAddress(coords.addressSuggestion);
          }
        }}
      />
    </div>
  );
};
