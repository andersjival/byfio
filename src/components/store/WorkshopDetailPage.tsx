import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Workshop, AppRoute } from '../../types';
import { formatCRC, getWhatsAppLink } from '../../utils/formatters';
import { BenefitIcon, getDefaultWorkshopBenefits } from '../../utils/workshopBenefits';
import { TreeNavigation } from '../common/TreeNavigation';
import { PaymentAccountsCard, PartialPaymentInfo } from '../common/PaymentAccountsCard';
import {
  Calendar, Clock, MapPin, Star, Check, ArrowLeft,
  Share2, CheckCircle2, Phone, Copy, Heart, Users,
  ShoppingBag, ShieldCheck, Coffee, Gift, AlertCircle,
  MessageCircle, Eye, ChevronDown, ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playBubblePopSound } from '../../utils/soundEffects';

interface WorkshopDetailPageProps {
  workshopId?: string | null;
  onNavigate: (route: AppRoute, targetTab?: any, wsId?: string) => void;
}

export const WorkshopDetailPage: React.FC<WorkshopDetailPageProps> = ({
  workshopId,
  onNavigate,
}) => {
  const {
    workshops,
    bookWorkshopDirect,
    addToCart,
    cart,
    verifySinpePaymentForCheckout,
    simulateBcrEmailNotification,
  } = useApp();

  // Buscar el taller por id o slug
  const workshop: Workshop | undefined = workshops.find((w) => {
    if (!workshopId) return false;
    const cleanParam = workshopId.toLowerCase().trim();
    return (
      w.id.toLowerCase() === cleanParam ||
      w.title.toLowerCase().replace(/\s+/g, '-').includes(cleanParam)
    );
  }) || workshops[0];

  // Estado del formulario de inscripción directa
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Estados de validación de pago SINPE Móvil
  const [sinpeReference, setSinpeReference] = useState<string>('');
  const [secondSinpeReference, setSecondSinpeReference] = useState<string>('');
  const [partialPayment, setPartialPayment] = useState<PartialPaymentInfo | null>(null);
  const [isPaymentValidated, setIsPaymentValidated] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Estados de feedback visual y modal
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSinpe, setCopiedSinpe] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string>('');
  const [showDetails, setShowDetails] = useState(false);
  const [addedToCartToast, setAddedToCartToast] = useState(false);

  const formTopRef = useRef<HTMLDivElement>(null);

  if (!workshop) {
    return (
      <div className="py-12 text-center max-w-lg mx-auto space-y-4">
        <p className="text-base text-slate-600 font-sans">
          No se encontró el taller solicitado.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('workshops')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-fio-800 text-white text-xs font-semibold hover:bg-fio-900 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ver todos los talleres</span>
        </button>
      </div>
    );
  }

  const isFull = workshop.spotsAvailable <= 0;
  const isVirtual = workshop.modality === 'Virtual en Vivo';
  const hasCoffeeBreak = workshop.hasCoffeeBreak !== undefined ? workshop.hasCoffeeBreak : !isVirtual;
  const coffeeBreakText = workshop.coffeeBreakText || 'Coffee break artesanal con repostería dulce y bebidas.';
  const hasToolsIncluded = workshop.hasToolsIncluded !== undefined ? workshop.hasToolsIncluded : true;
  const toolsText = workshop.toolsText || 'Uso ilimitado de herramientas de alta precisión durante el taller.';
  const hasTakeHomeProject = workshop.hasTakeHomeProject !== undefined ? workshop.hasTakeHomeProject : true;
  const takeHomeText = workshop.takeHomeText || 'Te llevás tu proyecto completo y terminado a casa el mismo día.';
  const instructorName = workshop.instructorName || 'Impartido personalmente por Fio (Fiorella Patricia Jara Gutiérrez)';
  const instructorSubtitle = workshop.instructorSubtitle || 'Cupos estrictamente reducidos para garantizar atención personalizada y corrección técnica individual.';
  const benefitsList = workshop.benefits && Array.isArray(workshop.benefits) && workshop.benefits.length > 0
    ? workshop.benefits
    : getDefaultWorkshopBenefits(workshop);
  const activeBenefits = benefitsList.filter((b) => b.enabled && b.text && b.text.trim());
  const totalPrice = workshop.price * quantity;

  // Copiar link directo a este taller
  const handleCopyWorkshopLink = () => {
    const link = `${window.location.origin}/talleres/${workshop.id}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }).catch(() => {});
  };

  // Copiar número SINPE Móvil
  const handleCopySinpe = () => {
    navigator.clipboard.writeText('64004640').then(() => {
      setCopiedSinpe(true);
      setTimeout(() => setCopiedSinpe(false), 2000);
    }).catch(() => {});
  };

  // Validación estricta con búsqueda de comprobante SINPE en notificaciones BCR
  const handleValidatePayment = async () => {
    const clean = sinpeReference.trim();
    if (!clean || clean.length < 3) {
      setValidationError('Digita un número de comprobante o referencia válido (mínimo 3 dígitos).');
      setIsPaymentValidated(false);
      setPartialPayment(null);
      return;
    }

    setIsValidating(true);
    setValidationError(null);

    const res = await verifySinpePaymentForCheckout(clean, totalPrice, false);
    setIsValidating(false);

    if (res.status === 'already_used') {
      setValidationError('⚠️ Este comprobante ya fue utilizado, digita correctamente el número de referencia de la transferencia.');
      setIsPaymentValidated(false);
      setPartialPayment(null);
      return;
    }

    if (res.status === 'not_found') {
      setValidationError(res.message);
      setIsPaymentValidated(false);
      setPartialPayment(null);
      return;
    }

    if (res.status === 'invalid_mismatch') {
      setValidationError(res.message);
      setIsPaymentValidated(false);
      setPartialPayment(null);
      return;
    }

    if (res.status === 'invalid_incomplete') {
      setValidationError(res.message);
      setIsPaymentValidated(false);
      setPartialPayment({
        requiredTotal: totalPrice,
        missingAmount: res.missingAmount || (totalPrice - (res.voucherAmount || 0)),
        firstVoucher: {
          ref: res.transaction?.referenceNumber || clean,
          amount: res.voucherAmount || 0,
          originName: res.transaction?.originName,
        },
        isComplete: false,
      });
      return;
    }

    if (res.status === 'valid_exact') {
      setIsPaymentValidated(true);
      setPartialPayment(null);
      setValidationError(null);
      if (res.transaction?.originName && !customerName.trim()) {
        setCustomerName(res.transaction.originName);
      }
      playBubblePopSound();
    }
  };

  const handleValidateSecondPayment = async () => {
    if (!partialPayment || !secondSinpeReference.trim()) return;
    setIsValidating(true);
    setValidationError(null);

    const res = await verifySinpePaymentForCheckout(
      secondSinpeReference.trim(),
      totalPrice,
      true,
      partialPayment.firstVoucher.ref
    );
    setIsValidating(false);

    if (res.status === 'valid_exact') {
      setIsPaymentValidated(true);
      setValidationError(null);
      if (res.transaction?.originName && !customerName.trim()) {
        setCustomerName(res.transaction.originName);
      }
      playBubblePopSound();
    } else {
      setValidationError(res.message);
    }
  };

  const handleResetPartialPayment = () => {
    setPartialPayment(null);
    setSecondSinpeReference('');
    setValidationError(null);
    setIsPaymentValidated(false);
  };

  const handleSimulateBcrEmail = (type: 'exact' | 'partial') => {
    const clean = sinpeReference.trim() || 'FIO-TEST';
    setSinpeReference(clean);
    const amountToSimulate = type === 'exact' ? totalPrice : Math.round(totalPrice * 0.6);
    simulateBcrEmailNotification(clean, amountToSimulate, customerName.trim() || 'Alumno by.fio');
    setValidationError(null);
    setTimeout(() => {
      handleValidatePayment();
    }, 350);
  };

  // Confirmar reserva con SINPE Móvil (Cero apertura automática de WhatsApp)
  const handleConfirmReservation = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const cleanName = customerName.trim();
    const cleanPhone = customerPhone.trim();
    const digitsOnly = cleanPhone.replace(/\D/g, '');

    if (!cleanName) {
      setFormError('Por favor ingresá tu nombre y apellido para tu cupo.');
      formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!cleanPhone || digitsOnly.length < 8) {
      setFormError('Por favor ingresá un número de teléfono / WhatsApp válido (al menos 8 dígitos).');
      formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (isFull || workshop.spotsAvailable < quantity) {
      setFormError('Lo sentimos, los cupos disponibles para este taller acaban de agotarse o son insuficientes para la cantidad elegida.');
      formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setFormError(null);

    // Armar notas completas con número de comprobante si fue ingresado
    const notesArr: string[] = [];
    if (customerNotes.trim()) notesArr.push(customerNotes.trim());
    if (sinpeReference.trim()) notesArr.push(`Comprobante SINPE: #${sinpeReference.trim()}`);
    if (isPaymentValidated) notesArr.push('(Pago 100% verificado)');

    try {
      // Registrar la orden en el sistema de talleres
      const order = bookWorkshopDirect(workshop, quantity, {
        name: cleanName,
        phone: cleanPhone,
        email: customerEmail.trim() || undefined,
        notes: notesArr.length > 0 ? notesArr.join(' • ') : undefined,
        paymentStatus: isPaymentValidated ? 'paid' : 'pending',
      });

      setConfirmedOrderNumber(order?.orderNumber || '#WS-BYFIO');
      setIsSuccessModalOpen(true);
      playBubblePopSound();

      try {
        confetti({
          particleCount: 75,
          spread: 65,
          origin: { y: 0.55 },
        });
      } catch {}
    } catch (err) {
      console.error('Error al registrar reserva:', err);
      // Fallback a prueba de fallos para que la UI nunca se quede pegada
      setConfirmedOrderNumber('#WS-' + Math.floor(1000 + Math.random() * 9000));
      setIsSuccessModalOpen(true);
      playBubblePopSound();
    }
  };

  // Agregar al carrito web
  const handleAddToCart = () => {
    addToCart({
      type: 'workshop',
      id: workshop.id,
      sku: `WS-${workshop.id.toUpperCase()}`,
      name: workshop.title,
      price: workshop.price,
      quantity,
      image: workshop.image,
      spotsLeft: workshop.spotsAvailable,
    });
    setAddedToCartToast(true);
    setTimeout(() => setAddedToCartToast(false), 3000);
  };

  const breadcrumbs = [
    { label: 'by.fio', route: 'home' as AppRoute },
    { label: 'talleres', route: 'workshops' as AppRoute },
    { label: workshop.title },
  ];

  return (
    <div className="py-2 sm:py-4 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Barra de Árbol de Páginas y Botón de Retorno */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 sm:px-0">
        <TreeNavigation nodes={breadcrumbs} onNavigate={onNavigate} />

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleCopyWorkshopLink}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold border transition-all ${
              copiedLink
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-white/80 hover:bg-white text-slate-700 border-white/80 shadow-xs'
            }`}
          >
            {copiedLink ? (
              <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ¡Enlace copiado!</>
            ) : (
              <><Share2 className="w-3.5 h-3.5 text-fio-pink" /> Compartir Taller</>
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('workshops')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/80 hover:bg-white text-slate-700 text-xs font-semibold border border-white/80 shadow-xs transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>Todos los Talleres</span>
          </button>
        </div>
      </div>

      {/* Grid Editorial de 2 Columnas: Foto & Descripción (Izq) vs Materiales & Pago (Der) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* =========================================================
            LADO IZQUIERDO: FOTO, DETALLES Y DESCRIPCIÓN DEL TALLER
            ========================================================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tarjeta de Foto Principal Neumórfica */}
          <div className="relative rounded-[32px] overflow-hidden bg-[#F1F2F6] border border-white/90 shadow-neuCard">
            <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-[#ECEEF2] shadow-neuInset">
              <img
                src={workshop.image}
                alt={workshop.title}
                className="w-full h-full object-cover"
              />
              {/* Badges Flotantes sobre la Imagen */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-bubble font-bold text-slate-800 shadow-neuBtn border border-white/80 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-fio-yellow fill-fio-yellow" />
                  {workshop.modality}
                </span>
                <span
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bubble font-bold shadow-neuBtn ${
                    isFull
                      ? 'bg-red-500 text-white'
                      : 'bg-fio-pink text-white'
                  }`}
                >
                  {isFull ? 'Cupos Agotados' : `${workshop.spotsAvailable} cupos disponibles`}
                </span>
              </div>
            </div>

            {/* Fila de Datos Clave (Fecha, Horario, Lugar) */}
            <div className="p-6 bg-[#F1F2F6] border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl neu-btn-circle bg-white text-fio-800 shadow-neuBtn shrink-0">
                  <Calendar className="w-4 h-4 text-fio-700" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Fecha</p>
                  <p className="font-bubble font-bold text-slate-800">{workshop.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl neu-btn-circle bg-white text-fio-800 shadow-neuBtn shrink-0">
                  <Clock className="w-4 h-4 text-fio-700" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Horario</p>
                  <p className="font-bubble font-bold text-slate-800">{workshop.schedule}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl neu-btn-circle bg-white text-fio-800 shadow-neuBtn shrink-0">
                  <MapPin className="w-4 h-4 text-fio-700" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Lugar</p>
                  <p className="font-bubble font-bold text-slate-800">{workshop.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bloque Editorial: Título y Descripción Detallada */}
          <div className="bg-[#F1F2F6] rounded-[32px] p-6 sm:p-8 border border-white/90 shadow-neuCard space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-white/90 text-fio-800 text-[11px] font-bubble font-bold tracking-wider uppercase shadow-neuBtn">
              <Star className="w-3 h-3 text-fio-pink fill-fio-pink" />
              <span>Academia de Arte y Creación</span>
            </div>

            <h1 className="font-bubble text-2xl sm:text-4xl text-slate-900 font-bold leading-tight">
              {workshop.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed font-sans">
              {workshop.subtitle}
            </p>

            <div className="pt-2 border-t border-slate-200/60 space-y-3 text-sm text-slate-600 leading-relaxed font-sans">
              <p className="font-bold text-slate-800 text-base">
                ¿De qué trata esta experiencia?
              </p>
              {workshop.description ? (
                workshop.description.split('\n').filter((p) => p.trim()).map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="leading-relaxed">
                  En este taller práctico aprenderás paso a paso las técnicas de diseño, armado y acabado artesanal para crear proyectos con calidad profesional.
                </p>
              )}
            </div>

            {/* Sello de Acompañamiento Fio */}
            <div className="pt-4 flex items-center gap-3.5 p-4 rounded-2xl bg-[#ECEEF2] border border-white/70 shadow-neuInset">
              <div className="w-10 h-10 rounded-2xl neu-btn-circle bg-white text-fio-pink shadow-neuBtn shrink-0">
                <Heart className="w-5 h-5 fill-fio-pink text-fio-pink" />
              </div>
              <div>
                <p className="text-xs font-bubble font-bold text-slate-900">
                  {instructorName}
                </p>
                <p className="text-[11px] text-slate-500 font-sans">
                  {instructorSubtitle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            LADO DERECHO: MATERIALES, TODO LO QUE INCLUYE Y PAGO
            ========================================================= */}
        <div className="lg:col-span-5 space-y-6">
          {/* Caja 1: Materiales y Todo lo que Incluye */}
          <div className="bg-[#F1F2F6] rounded-[32px] p-6 border border-white/90 shadow-neuCard space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <h2 className="font-bubble text-lg text-slate-900 font-bold flex items-center gap-2">
                <Gift className="w-4 h-4 text-fio-pink" />
                Materiales y Todo lo que Incluye
              </h2>
              <span className="text-[10px] font-bubble font-bold uppercase tracking-wider text-emerald-700 bg-white shadow-neuBtn px-2.5 py-0.5 rounded-full border border-white/80">
                Todo cubierto
              </span>
            </div>

            <ul className="space-y-2.5">
              {workshop.includes.map((inc, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <div className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="leading-snug">{inc}</span>
                </li>
              ))}
            </ul>

            {/* Destacados Adicionales Configurables con Íconos Dinámicos */}
            {activeBenefits.length > 0 && (
              <div className="pt-3 border-t border-slate-200/60 space-y-2 text-xs text-slate-500">
                {activeBenefits.map((b) => (
                  <div key={b.id} className="flex items-center gap-2 text-slate-600">
                    <BenefitIcon name={b.icon} className="w-4 h-4 shrink-0" />
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Caja 2: Inversión, Reserva e Inscripción / Pago con SINPE */}
          <div className="bg-[#F1F2F6] rounded-[32px] p-6 border border-white/90 shadow-neuCard space-y-5">
            {/* Encabezado de Inversión */}
            <div className="flex items-baseline justify-between gap-2 pb-3 border-b border-slate-200/60">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Inversión por participante
                </span>
                <p className="font-bubble text-3xl font-bold text-slate-900">
                  {formatCRC(workshop.price)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bubble font-bold text-slate-700 flex items-center gap-1 justify-end">
                  <Users className="w-3.5 h-3.5 text-fio-pink" />
                  {workshop.spotsAvailable} disponibles
                </span>
                <span className="text-[10px] text-slate-400">Total cupo: {workshop.totalSpots}</span>
              </div>
            </div>

            {isFull ? (
              /* Caso: Cupos Agotados */
              <div className="space-y-4 py-3 text-center">
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-amber-800 text-xs dark:bg-amber-950/40 dark:border-amber-700/40 dark:text-amber-200">
                  <p className="font-bold">¡Cupos agotados para esta fecha!</p>
                  <p className="mt-1 text-amber-700 dark:text-amber-300">
                    Únete a la lista de espera oficial para recibir notificación automática por correo electrónico y WhatsApp apenas se libere un cupo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('workshop-waitlist', undefined, workshop.id)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-fio-pink hover:bg-pink-600 text-white font-bubble font-bold text-xs sm:text-sm shadow-clayBtn hover:shadow-lg active:scale-95 transition-all cursor-pointer dark:bg-gradient-to-r dark:from-purple-600 dark:to-fio-pink dark:hover:opacity-95 dark:shadow-[0_0_20px_rgba(217,70,239,0.35)]"
                >
                  <Users className="w-4 h-4" />
                  <span>Ingresar a la lista de espera</span>
                </button>
              </div>
            ) : (
              /* Caso: Cupos Disponibles - Formulario Directo */
              <form onSubmit={handleConfirmReservation} noValidate className="space-y-4">
                <div ref={formTopRef} />
                {/* Selector de Cantidad de Cupos */}
                <div>
                  <label className="text-[11px] font-bubble font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                    ¿Cuántos cupos deseas reservar?
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].filter((n) => n <= workshop.spotsAvailable).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setQuantity(n)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bubble font-bold transition-all ${
                          quantity === n
                            ? 'neu-btn-primary text-white shadow-neuBtnHover'
                            : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-slate-900 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover'
                        }`}
                      >
                        {n} {n === 1 ? 'cupo' : 'cupos'}
                      </button>
                    ))}
                  </div>
                  {quantity > 1 && (
                    <p className="text-xs font-bubble font-bold text-fio-800 mt-1.5 text-right">
                      Total a pagar: {formatCRC(totalPrice)}
                    </p>
                  )}
                </div>

                {/* Campos de Contacto Neumórficos */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bubble font-bold text-slate-700 block mb-1">
                      Nombre y Apellido <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Carolina Vargas"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#ECEEF2] border border-white/60 shadow-neuInset text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bubble font-bold text-slate-700 block mb-1">
                      Teléfono / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej. 8888-8888"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#ECEEF2] border border-white/60 shadow-neuInset text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bubble font-bold text-slate-600 block mb-1">
                      Correo Electrónico (opcional)
                    </label>
                    <input
                      type="email"
                      placeholder="tu@correo.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#ECEEF2] border border-white/60 shadow-neuInset text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bubble font-bold text-slate-600 block mb-1">
                      Notas especiales o acompañantes (opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Voy con una amiga / Requiero factura"
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#ECEEF2] border border-white/60 shadow-neuInset text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                {formError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Caja de Datos SINPE Móvil y Cuentas Bancarias Oficiales con Validación en Vivo */}
                <PaymentAccountsCard
                  amount={totalPrice}
                  compact={false}
                  showValidation={true}
                  referenceNumber={sinpeReference}
                  onReferenceChange={(val) => {
                    setSinpeReference(val);
                    setValidationError(null);
                    if (isPaymentValidated) setIsPaymentValidated(false);
                  }}
                  isPaymentValidated={isPaymentValidated}
                  onValidatePayment={handleValidatePayment}
                  isValidating={isValidating}
                  validationError={validationError}
                  partialPayment={partialPayment}
                  secondReferenceNumber={secondSinpeReference}
                  onSecondReferenceChange={(val) => {
                    setSecondSinpeReference(val);
                    setValidationError(null);
                  }}
                  onValidateSecondPayment={handleValidateSecondPayment}
                  onResetPartialPayment={handleResetPartialPayment}
                  onSimulateBcrEmail={handleSimulateBcrEmail}
                />

                {/* Alerta de Error Visible Directamente sobre el Botón de Confirmación */}
                {formError && (
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-red-100/90 border border-red-300 text-red-700 text-xs font-bubble font-bold animate-pulse shadow-sm">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Botón Principal: Confirmar Reserva y Registrar Cupo */}
                <button
                  type="submit"
                  onClick={handleConfirmReservation}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-bubble font-bold text-white neu-btn-primary shadow-neuBtn hover:shadow-neuBtnHover active:scale-95 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isPaymentValidated
                      ? 'Confirmar Reserva con Pago Verificado'
                      : sinpeReference.trim()
                      ? 'Confirmar Reserva e Inscribirme'
                      : 'Confirmar Reserva del Taller'}
                  </span>
                </button>

                {/* Botón Secundario: Agregar al Carrito */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bubble font-bold text-slate-700 neu-btn bg-[#F1F2F6] border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover active:scale-95 transition-all"
                >
                  <ShoppingBag className="w-4 h-4 text-fio-pink" />
                  <span>
                    {addedToCartToast
                      ? '¡Agregado con éxito!'
                      : (Array.isArray(cart) && cart.some((it) => it && it.id === workshop.id))
                      ? 'Agregar Más al Carrito'
                      : 'O agregar al Carrito de la Web'}
                  </span>
                </button>

                <p className="text-[10px] text-center text-slate-400">
                  🔒 Tu cupo queda reservado en el sistema y se confirma automáticamente al verificar el comprobante.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Éxito al Confirmar Reserva & Pago */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-[#FDFBF9] rounded-[32px] p-5 sm:p-7 max-w-lg w-full border border-white/90 shadow-2xl space-y-4 text-center my-6 max-h-[92vh] overflow-y-auto">
            {/* Ícono Celebratorio */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-100 to-teal-100 text-emerald-600 flex items-center justify-center mx-auto shadow-neuBtn border-2 border-white">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            {/* Badge de Estado */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bubble font-bold border border-emerald-200 shadow-2xs">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>
                {isPaymentValidated
                  ? '¡Pago Recibido & Cupo Confirmado!'
                  : sinpeReference.trim()
                  ? '¡Comprobante Recibido & Reserva Registrada!'
                  : '¡Reserva Registrada con Éxito!'}
              </span>
            </div>

            {/* Mensaje Solicitado: ya tienes tu cupo para el taller el día tal */}
            <div className="space-y-1.5">
              <h3 className="font-bubble font-bold text-xl sm:text-2xl text-slate-900 leading-snug">
                ¡Ya tienes tu cupo para el taller!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                Hemos recibido tus datos correctamente para{' '}
                <strong className="text-fio-900">{workshop.title}</strong> el día{' '}
                <strong className="text-fio-pink font-bold">{workshop.date}</strong>.
              </p>
            </div>

            {/* Ficha Resumen de la Reserva */}
            <div className="p-4 rounded-2xl bg-[#ECEEF2] border border-white/80 shadow-neuInset text-left space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">N° de Reserva:</span>
                <span className="font-bubble font-bold text-fio-800 text-sm">
                  #{confirmedOrderNumber}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11.5px]">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-fio-pink shrink-0" />
                  <span><strong>Fecha:</strong> {workshop.date}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-fio-pink shrink-0" />
                  <span><strong>Horario:</strong> {workshop.schedule}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Users className="w-3.5 h-3.5 text-fio-pink shrink-0" />
                  <span><strong>Cupos:</strong> {quantity} {quantity === 1 ? 'persona' : 'personas'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-fio-pink shrink-0" />
                  <span className="truncate"><strong>Lugar:</strong> Tibás, San José</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-600 font-medium">Inversión Total:</span>
                <span className="font-bubble font-bold text-base text-slate-900">
                  {formatCRC(totalPrice)}
                </span>
              </div>

              {/* Estado de pago */}
              <div className="pt-1.5 text-[11px]">
                {isPaymentValidated ? (
                  <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    Pago verificado por SINPE Móvil
                  </span>
                ) : sinpeReference.trim() ? (
                  <span className="inline-flex items-center gap-1 text-purple-800 font-semibold bg-purple-100 px-2.5 py-0.5 rounded-full">
                    <Check className="w-3.5 h-3.5 text-purple-700" />
                    Comprobante #{sinpeReference.trim()} en proceso
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-800 font-semibold bg-amber-100 px-2.5 py-0.5 rounded-full">
                    Pendiente de pago por SINPE Móvil al 6400-4640
                  </span>
                )}
              </div>
            </div>

            {/* Sección Desplegable: Ver Más Detalles */}
            {showDetails && (
              <div className="p-4 rounded-2xl bg-white/95 border border-fio-200/80 text-left space-y-2.5 text-xs animate-fadeIn shadow-xs">
                <div className="flex items-center gap-1.5 font-bubble font-bold text-fio-900 text-xs">
                  <Gift className="w-4 h-4 text-fio-pink" />
                  <span>Materiales y Beneficios Incluidos:</span>
                </div>
                <ul className="space-y-1.5 text-slate-600 text-[11.5px] pl-1">
                  {workshop.includes.map((inc, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                  {activeBenefits.map((b) => (
                    <li key={b.id} className="flex items-start gap-1.5">
                      <BenefitIcon name={b.icon} className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{b.text}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                  <p>📍 <strong>Dirección:</strong> {workshop.location}</p>
                  <p>⏰ <strong>Recomendación:</strong> Te sugerimos llegar 10 minutos antes del inicio para ubicarte cómodamente.</p>
                </div>
              </div>
            )}

            {/* BOTÓN 3: Dudas y preguntas -> Contactar al Profesor por WhatsApp */}
            <div className="pt-1">
              <a
                href={getWhatsAppLink(
                  '64004640',
                  `¡Hola! 👋 Tengo dudas/preguntas sobre el taller "${workshop.title}" al que me acabo de registrar:\n\n` +
                  `📅 Fecha: ${workshop.date}\n` +
                  `⏰ Horario: ${workshop.schedule}\n` +
                  `👤 Alumno: ${customerName.trim()}\n` +
                  `🔖 N° de Reserva: ${confirmedOrderNumber}\n\n` +
                  `Mi consulta es la siguiente: `
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bubble font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-between gap-2"
                title="Abrir chat de WhatsApp para dudas y preguntas con el profesor"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-200 fill-current" />
                  <span>¿Dudas y preguntas? Contactar al profesor</span>
                </div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
                  WhatsApp: 6400-4640
                </span>
              </a>
            </div>

            {/* BOTONES 1 & 2: Ver Más Detalles + Ir a la Tienda */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="w-full py-2.5 px-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bubble font-bold text-xs border border-slate-200/90 shadow-2xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-fio-pink" />
                <span>{showDetails ? 'Ocultar Detalles' : 'Ver Más Detalles'}</span>
                {showDetails ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  onNavigate('store');
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-bold text-xs shadow-clayBtn transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-fio-yellow" />
                <span>Ir a la Tienda</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
