import React, { useState, useEffect, useRef } from 'react';
import {
  HardDrive, CheckCircle2, Sparkles, Copy, Check, ArrowRight,
  ShieldCheck, Smartphone, Building2, Lock, Eye, EyeOff, User,
  Mail, Phone, MapPin, RefreshCw, Star, Heart, ArrowLeft, ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DriveCourse, AppRoute } from '../../types';
import { fetchDriveCourses, purchaseCourse, DEFAULT_DRIVE_COURSES } from '../../services/driveCoursesService';
import { formatCRC } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';
import { playBubblePopSound, playWaterDropSound } from '../../utils/soundEffects';

interface DriveCoursesPageProps {
  onNavigate: (route: AppRoute, adminTab?: any) => void;
}

export const DriveCoursesPage: React.FC<DriveCoursesPageProps> = ({ onNavigate }) => {
  const { registerUser, currentUser } = useApp();

  const [courses, setCourses] = useState<DriveCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<DriveCourse | null>(null);
  const [loading, setLoading] = useState(true);

  // Step state: 'select' | 'checkout' | 'success'
  const [step, setStep] = useState<'select' | 'checkout' | 'success'>('select');

  // Formulario de Pago
  const [customerName, setCustomerName] = useState(() => currentUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(() => currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(() => (currentUser as any)?.phone || '');
  const [paymentReference, setPaymentReference] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Feedback de Copia
  const [copiedSinpe, setCopiedSinpe] = useState(false);
  const [copiedIban, setCopiedIban] = useState(false);

  // Datos tras compra confirmada
  const [confirmedData, setConfirmedData] = useState<{
    email: string;
    name: string;
    phone: string;
    courseTitle: string;
    driveFolderUrl?: string;
  } | null>(null);

  // Formulario de Registro posterior
  const [regAddress, setRegAddress] = useState('');
  const [regProvince, setRegProvince] = useState('San José');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const checkoutRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { courses: list } = await fetchDriveCourses();
        const activeOnly = list.filter((c) => c.isActive);
        const finalList = activeOnly.length > 0 ? activeOnly : DEFAULT_DRIVE_COURSES;
        setCourses(finalList);
        setSelectedCourse(finalList[0]);
      } catch {
        setCourses(DEFAULT_DRIVE_COURSES);
        setSelectedCourse(DEFAULT_DRIVE_COURSES[0]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSelectCourse = (c: DriveCourse) => {
    setSelectedCourse(c);
    playWaterDropSound();
  };

  const handleGoToCheckout = () => {
    setFormError(null);
    setStep('checkout');
    playBubblePopSound();
    setTimeout(() => {
      checkoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCopySinpe = () => {
    navigator.clipboard.writeText('64004640');
    setCopiedSinpe(true);
    setTimeout(() => setCopiedSinpe(false), 2000);
  };

  const handleCopyIban = () => {
    navigator.clipboard.writeText('CR48015202001183377771');
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const cleanName = customerName.trim();
    const cleanEmail = customerEmail.trim().toLowerCase();
    const cleanPhone = customerPhone.trim();

    if (!cleanName) {
      setFormError('Por favor ingresa tu nombre completo.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setFormError('Por favor ingresa un correo electrónico válido (debe ser tu cuenta Google para Drive).');
      return;
    }
    if (!cleanPhone || cleanPhone.replace(/\D/g, '').length < 8) {
      setFormError('Por favor ingresa un número de teléfono / WhatsApp válido (al menos 8 dígitos).');
      return;
    }

    setFormError(null);
    setIsProcessingPayment(true);

    try {
      const res = await purchaseCourse({
        courseId: selectedCourse.id,
        courseTitle: selectedCourse.title,
        customerName: cleanName,
        customerEmail: cleanEmail,
        customerPhone: cleanPhone,
        paymentReference: paymentReference.trim() || `SINPE-${Date.now().toString().slice(-6)}`,
        paymentAmount: selectedCourse.price,
        driveFolderUrl: selectedCourse.driveFolderUrl,
      });

      setConfirmedData({
        email: cleanEmail,
        name: cleanName,
        phone: cleanPhone,
        courseTitle: selectedCourse.title,
        driveFolderUrl: selectedCourse.driveFolderUrl,
      });

      setStep('success');
      playBubblePopSound();

      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}

      setTimeout(() => {
        successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err: any) {
      setFormError(err.message || 'Error al procesar la confirmación. Por favor intenta de nuevo.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSimulatePayment = () => {
    setPaymentReference(`SINPE-VERIFICADO-${Math.floor(1000 + Math.random() * 9000)}`);
    playWaterDropSound();
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);

    if (!confirmedData) return;

    if (!regAddress.trim() || regAddress.trim().length < 5) {
      setRegisterError('Por favor ingresa tu dirección de entrega o domicilio completa.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setRegisterError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegisterError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const res = registerUser(
        confirmedData.email,
        regPassword,
        confirmedData.name,
        confirmedData.phone,
        undefined,
        regAddress.trim(),
        undefined,
        undefined,
        { province: regProvince }
      );

      if (res.success) {
        setRegisterSuccess(true);
        playBubblePopSound();
        try {
          confetti({
            particleCount: 50,
            spread: 50,
          });
        } catch {}
      } else {
        setRegisterError(res.error || 'No se pudo completar el registro.');
      }
    } catch (err: any) {
      setRegisterError(err.message || 'Error al crear la cuenta.');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center font-bubble text-sm text-purple-700">
        Cargando Cursos Drive By.Fio...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-fadeIn select-none sm:select-text">
      {/* Hero Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 border border-purple-200/60 shadow-xs">
          <HardDrive className="w-4 h-4 text-blue-700" />
          <span className="font-bubble font-bold text-xs text-purple-900 tracking-wide">
            Cursos & Contenidos Digitales en Google Drive
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bubble font-black text-slate-900 tracking-tight">
          Aprende con <span className="text-purple-700">by.fio</span> desde Cualquier Lugar
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-2xl mx-auto leading-relaxed">
          Selecciona el curso que deseas llevar. Al confirmar tu pago, te otorgamos acceso automático
          en Google Drive con videos paso a paso, plantillas imprimibles y recursos descargables de por vida.
        </p>
      </div>

      {/* PASO 1: SELECCIONAR CURSO */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-purple-100 pb-2">
          <h2 className="font-bubble font-bold text-sm sm:text-base text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-700 text-white text-xs flex items-center justify-center font-black">1</span>
            <span>Elige tu Curso:</span>
          </h2>
          <span className="text-xs font-sans text-slate-400 hidden sm:inline">
            Haz clic en un curso para ver sus detalles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.map((course) => {
            const isSelected = selectedCourse?.id === course.id;
            return (
              <div
                key={course.id}
                onClick={() => handleSelectCourse(course)}
                className={`rounded-3xl p-4 cursor-pointer transition-all duration-200 relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-purple-50/70 border-2 border-purple-600 shadow-lg scale-[1.02]'
                    : 'bg-[#FDFBF9] border border-purple-100 hover:border-purple-300 hover:shadow-md'
                }`}
              >
                {/* Portada */}
                <div className="relative h-40 rounded-2xl overflow-hidden bg-purple-100 mb-3">
                  {course.coverImage ? (
                    <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-purple-400">
                      <HardDrive className="w-12 h-12" />
                    </div>
                  )}
                  {course.badge && (
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-purple-700/90 text-white font-bubble font-bold text-[10px] shadow-sm">
                      {course.badge}
                    </span>
                  )}
                  {isSelected && (
                    <span className="absolute top-2 right-2 p-1.5 rounded-full bg-purple-700 text-white shadow-md">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </span>
                  )}
                  <div className="absolute bottom-2 right-2 px-3 py-1 rounded-xl bg-white/95 text-purple-900 font-bubble font-black text-xs shadow-md">
                    {formatCRC(course.price)}
                  </div>
                </div>

                {/* Título y Tagline */}
                <div className="space-y-1">
                  <h3 className={`font-bubble font-bold text-sm ${isSelected ? 'text-purple-950' : 'text-slate-800'}`}>
                    {course.title}
                  </h3>
                  {course.tagline && (
                    <p className="text-[11px] text-purple-700 font-sans line-clamp-2">{course.tagline}</p>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-purple-100/60 flex items-center justify-between text-xs font-bubble font-bold">
                  <span className={isSelected ? 'text-purple-700' : 'text-slate-500'}>
                    {isSelected ? '✓ Seleccionado' : 'Elegir este curso'}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-700 translate-x-1' : 'text-slate-400'} transition-transform`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PASO 2: DETALLES DEL CURSO ELEGIDO ("lo que obtendrá y botón comprar") */}
      {selectedCourse && step === 'select' && (
        <div className="rounded-3xl p-6 sm:p-8 bg-[#FDFBF9] border border-purple-200/80 shadow-md space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bubble text-[11px] font-bold">
                  Acceso Inmediato en Google Drive
                </span>
                {selectedCourse.badge && (
                  <span className="px-3 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bubble text-[11px] font-bold">
                    {selectedCourse.badge}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bubble font-black text-slate-900">
                {selectedCourse.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                {selectedCourse.description}
              </p>
            </div>

            {/* Caja de Precio y Botón Comprar */}
            <div className="bg-purple-50/80 rounded-2xl p-5 border border-purple-200 text-center min-w-[260px] space-y-3 shrink-0">
              <span className="text-[11px] font-bubble font-bold text-slate-500 block uppercase">
                Inversión Total
              </span>
              <div className="text-3xl font-bubble font-black text-purple-900">
                {formatCRC(selectedCourse.price)}
              </div>
              <span className="text-[11px] text-slate-500 font-sans block">
                Pago único • Acceso ilimitado de por vida
              </span>
              <button
                type="button"
                onClick={handleGoToCheckout}
                className="w-full py-3 px-5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bubble text-sm font-bold shadow-lg shadow-purple-700/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Comprar Curso Ahora</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sección "Lo que obtendrás" */}
          <div className="bg-white rounded-2xl p-5 border border-purple-100 space-y-3">
            <h3 className="font-bubble font-bold text-sm text-purple-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>Lo que obtendrás con este curso:</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {selectedCourse.whatYouGet?.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-sans">
                  <span className="p-1 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PASO 3: FORMULARIO DE CHECKOUT Y PAGO */}
      {selectedCourse && step === 'checkout' && (
        <div ref={checkoutRef} className="rounded-3xl p-6 sm:p-8 bg-[#FDFBF9] border border-purple-200 shadow-xl space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-purple-100 pb-3">
            <button
              type="button"
              onClick={() => setStep('select')}
              className="inline-flex items-center gap-1.5 text-xs font-bubble font-bold text-purple-700 hover:text-purple-900"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Cambiar curso</span>
            </button>
            <span className="text-xs font-bubble font-bold text-slate-500">
              Curso: <span className="text-purple-900">{selectedCourse.title}</span> ({formatCRC(selectedCourse.price)})
            </span>
          </div>

          <form onSubmit={handleConfirmPayment} className="space-y-6">
            {/* Datos del Cliente */}
            <div className="space-y-4">
              <h3 className="font-bubble font-bold text-base text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-purple-700" />
                <span>Tus Datos para el Acceso a Google Drive:</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">
                    NOMBRE: *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Tu nombre y apellido"
                      className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-purple-200 bg-white text-xs font-sans text-slate-800 focus:outline-hidden focus:border-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">
                    CORREO (Google Drive): *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="ejemplo@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-purple-200 bg-white text-xs font-sans text-slate-800 focus:outline-hidden focus:border-purple-600"
                    />
                  </div>
                  <span className="text-[10px] text-purple-600 font-sans block mt-1">
                    A este correo te llegará la invitación a Google Drive.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">
                    TELÉFONO: *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="64004640"
                      className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-purple-200 bg-white text-xs font-sans text-slate-800 focus:outline-hidden focus:border-purple-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Opciones de Pago */}
            <div className="bg-purple-50/60 rounded-3xl p-5 border border-purple-200/80 space-y-4">
              <h3 className="font-bubble font-bold text-sm text-slate-800 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-purple-700" />
                <span>Instrucciones de Pago (SINPE Móvil / Transferencia BCR):</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                {/* SINPE MÓVIL */}
                <div className="bg-white p-3.5 rounded-2xl border border-purple-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bubble font-bold text-purple-900 text-xs">SINPE MÓVIL</span>
                    <button
                      type="button"
                      onClick={handleCopySinpe}
                      className="p-1 rounded-lg hover:bg-purple-50 text-purple-700"
                      title="Copiar número"
                    >
                      {copiedSinpe ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="font-mono text-sm font-bold text-slate-800">6400-4640</div>
                  <div className="text-[11px] text-slate-500">Titular: Fiorella Patricia Jara Gutiérrez</div>
                  <div className="text-[11px] font-bold text-purple-700">Monto: {formatCRC(selectedCourse.price)}</div>
                </div>

                {/* TRANSFERENCIA BCR */}
                <div className="bg-white p-3.5 rounded-2xl border border-purple-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bubble font-bold text-purple-900 text-xs">BANCO DE COSTA RICA (BCR)</span>
                    <button
                      type="button"
                      onClick={handleCopyIban}
                      className="p-1 rounded-lg hover:bg-purple-50 text-purple-700"
                      title="Copiar cuenta IBAN"
                    >
                      {copiedIban ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="font-mono text-[11px] font-bold text-slate-800 break-all select-all">
                    CR48015202001183377771
                  </div>
                  <div className="text-[11px] text-slate-500">Cédula: 1-1833-0771</div>
                  <div className="text-[11px] font-bold text-purple-700">Monto: {formatCRC(selectedCourse.price)}</div>
                </div>
              </div>

              {/* Comprobante SINPE */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-bubble font-bold text-slate-700">
                  Número de Comprobante / Referencia SINPE:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="Ej: 123456 o últimos dígitos del voucher"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-purple-200 bg-white text-xs font-sans text-slate-800 focus:outline-hidden focus:border-purple-600"
                  />
                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    className="px-3 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-[11px] font-bubble font-bold shrink-0"
                    title="Generar comprobante de prueba"
                  >
                    Simular Pago
                  </button>
                </div>
              </div>
            </div>

            {formError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-sans flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{formError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessingPayment}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-bubble text-sm font-bold shadow-xl shadow-purple-700/25 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessingPayment ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verificando y Activando en Google Drive...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span>Confirmar Pago y Obtener Acceso en Google Drive</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* PASO 4: CONFIRMACIÓN Y REGISTRO EN GOOGLE DRIVE */}
      {step === 'success' && confirmedData && (
        <div ref={successRef} className="space-y-6 animate-fadeIn">
          {/* Tarjeta de Éxito en Google Drive */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 text-white shadow-xl relative overflow-hidden space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bubble font-bold text-emerald-200 uppercase tracking-wider block">
                  ¡Pago Verificado con Éxito!
                </span>
                <h2 className="text-xl sm:text-2xl font-bubble font-black">
                  Acceso a Google Drive Concedido
                </h2>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 space-y-2">
              <p className="text-xs sm:text-sm font-sans leading-relaxed text-emerald-50">
                Tomamos tu correo <strong className="text-white font-mono bg-black/20 px-2 py-0.5 rounded-md">{confirmedData.email}</strong> y lo registramos en Google Drive para el curso <strong className="text-white">{confirmedData.courseTitle}</strong>.
              </p>
              <p className="text-xs sm:text-sm font-sans leading-relaxed text-emerald-100 font-semibold">
                📩 Por favor revisa tu bandeja de entrada de correo electrónico (o la pestaña <span className="underline">Compartido conmigo</span> en tu Google Drive) con el link de acceso a tu carpeta de materiales.
              </p>
            </div>

            {confirmedData.driveFolderUrl && (
              <a
                href={confirmedData.driveFolderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-emerald-900 font-bubble text-xs font-bold hover:bg-emerald-50 transition-all shadow-md active:scale-95"
              >
                <HardDrive className="w-4 h-4 text-emerald-600" />
                <span>Abrir Carpeta en Google Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* PASO 5: INVITACIÓN A REGISTRARSE ("como ya tiene algunos datos, sólo le pide los que faltan: dirección y contraseña") */}
          {!currentUser && !registerSuccess && (
            <div className="rounded-3xl p-6 sm:p-8 bg-[#FDFBF9] border border-purple-200 shadow-lg space-y-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-700" />
                  <span className="font-bubble font-bold text-xs uppercase tracking-wider text-purple-700">
                    Paso Opcional pero Recomendado
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bubble font-black text-slate-900">
                  ¿Deseas crear tu cuenta By.Fio para guardar tus accesos?
                </h3>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Ya tenemos guardado tu nombre (<strong>{confirmedData.name}</strong>), correo (<strong>{confirmedData.email}</strong>) y teléfono (<strong>{confirmedData.phone}</strong>).
                  Solo necesitamos que ingreses tu dirección y crees una contraseña para completar tu registro:
                </p>
              </div>

              <form onSubmit={handleCompleteRegistration} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">
                    Provincia:
                  </label>
                  <select
                    value={regProvince}
                    onChange={(e) => setRegProvince(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-purple-200 bg-white text-xs font-sans text-slate-800"
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

                <div>
                  <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">
                    Dirección Exacta: *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      placeholder="Barrio, señas exactas, número de casa..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-purple-200 bg-white text-xs font-sans text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">
                      Contraseña: *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full pl-9 pr-9 py-2.5 rounded-2xl border border-purple-200 bg-white text-xs font-sans text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">
                      Confirmar Contraseña: *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Repite la contraseña"
                        className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-purple-200 bg-white text-xs font-sans text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {registerError && (
                  <div className="p-3 rounded-2xl bg-rose-50 text-rose-700 text-xs font-sans">
                    {registerError}
                  </div>
                )}

                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bubble text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  Completar Mi Registro en By.Fio
                </button>
              </form>
            </div>
          )}

          {registerSuccess && (
            <div className="rounded-3xl p-6 bg-purple-50 border border-purple-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bubble font-bold text-base text-purple-900">
                ¡Tu cuenta By.Fio ha sido creada exitosamente!
              </h3>
              <p className="text-xs text-slate-600 font-sans">
                Ahora puedes iniciar sesión en cualquier momento para ver tus compras y talleres.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('mi-cuenta')}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-purple-700 text-white font-bubble text-xs font-bold"
              >
                Ir a Mi Cuenta
              </button>
            </div>
          )}

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setStep('select');
                setConfirmedData(null);
              }}
              className="text-xs font-bubble font-bold text-purple-700 hover:text-purple-900 underline"
            >
              ← Volver al catálogo de cursos
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriveCoursesPage;
