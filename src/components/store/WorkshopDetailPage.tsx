import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Workshop, AppRoute } from '../../types';
import { formatCRC, getWhatsAppLink } from '../../utils/formatters';
import { TreeNavigation } from '../common/TreeNavigation';
import {
  Calendar, Clock, MapPin, Sparkles, Check, ArrowLeft,
  Share2, CheckCircle2, Phone, Copy, Heart, Users,
  ShoppingBag, ShieldCheck, Coffee, Sparkle, AlertCircle
} from 'lucide-react';

interface WorkshopDetailPageProps {
  workshopId?: string | null;
  onNavigate: (route: AppRoute, targetTab?: any, wsId?: string) => void;
}

export const WorkshopDetailPage: React.FC<WorkshopDetailPageProps> = ({
  workshopId,
  onNavigate,
}) => {
  const { workshops, bookWorkshopDirect, addToCart } = useApp();

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

  // Estados de feedback visual
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSinpe, setCopiedSinpe] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string>('');
  const [addedToCartToast, setAddedToCartToast] = useState(false);

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

  // Confirmar reserva con SINPE Móvil
  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setFormError('Por favor ingresá tu nombre completo.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 8) {
      setFormError('Por favor ingresá un número de teléfono / WhatsApp válido (8 dígitos).');
      return;
    }
    setFormError(null);

    // Registrar la orden en el sistema
    const order = bookWorkshopDirect(workshop, quantity, {
      name: customerName.trim(),
      phone: customerPhone.trim(),
      email: customerEmail.trim() || undefined,
      notes: customerNotes.trim() || undefined,
    });

    setConfirmedOrderNumber(order.orderNumber);
    setIsSuccessModalOpen(true);

    // Redactar mensaje para WhatsApp de Fio (6400-4640)
    const msg = `¡Hola Fio! 👋 Quiero confirmar mi reserva para el taller:\n\n` +
      `🎨 *${workshop.title}*\n` +
      `📅 Fecha: ${workshop.date}\n` +
      `⏰ Horario: ${workshop.schedule}\n` +
      `👤 Nombre: ${customerName.trim()}\n` +
      `📱 Teléfono: ${customerPhone.trim()}\n` +
      `🎟️ Cupos: ${quantity}\n` +
      `💰 Total: ${formatCRC(totalPrice)}\n` +
      `🔖 Pedido: ${order.orderNumber}\n\n` +
      `Ya realicé la transferencia por SINPE Móvil al 6400-4640. Te adjunto el comprobante oficial aquí mismo:`;

    const waUrl = getWhatsAppLink('64004640', msg);
    // Abrir WhatsApp en nueva pestaña
    window.open(waUrl, '_blank', 'noopener,noreferrer');
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
          {/* Tarjeta de Foto Principal */}
          <div className="relative rounded-[32px] overflow-hidden bg-[#FDFBF9] border border-white/90 shadow-[10px_14px_28px_rgba(180,160,200,0.1),-8px_-8px_20px_rgba(255,255,255,0.95)]">
            <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-[#F2EDE7]">
              <img
                src={workshop.image}
                alt={workshop.title}
                className="w-full h-full object-cover"
              />
              {/* Badges Flotantes sobre la Imagen */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-slate-800 shadow-sm border border-white/80 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-fio-yellow fill-fio-yellow" />
                  {workshop.modality}
                </span>
                <span
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm ${
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
            <div className="p-6 bg-white/90 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-fio-800 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-fio-700" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Fecha</p>
                  <p className="font-semibold text-slate-800">{workshop.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-fio-800 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-fio-700" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Horario</p>
                  <p className="font-semibold text-slate-800">{workshop.schedule}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-fio-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-fio-700" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Lugar</p>
                  <p className="font-semibold text-slate-800">{workshop.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bloque Editorial: Título y Descripción Detallada */}
          <div className="bg-[#FDFBF9] rounded-[32px] p-6 sm:p-8 border border-white/90 shadow-[10px_14px_28px_rgba(180,160,200,0.08),-8px_-8px_20px_rgba(255,255,255,0.95)] space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF5FF] border border-fio-200/60 text-fio-800 text-[11px] font-semibold tracking-wider uppercase">
              <Sparkle className="w-3 h-3 text-fio-pink" />
              <span>Academia de Arte y Creación</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl text-slate-800 font-semibold leading-tight">
              {workshop.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              {workshop.subtitle}
            </p>

            <div className="pt-2 border-t border-slate-200/50 space-y-3 text-sm text-slate-600 leading-relaxed font-sans">
              <p className="font-semibold text-slate-800">
                ¿De qué trata esta experiencia?
              </p>
              <p>
                {workshop.description ||
                  'En este taller práctico aprenderás paso a paso las técnicas de diseño, armado y acabado artesanal para crear proyectos con calidad profesional.'}
              </p>
              <p>
                Durante las horas de clase, compartirás en un ambiente relajado, inspirador y con asesoría continua. No necesitas tener ningún conocimiento previo: la clase está pensada para que aprendas desde cero con total tranquilidad y salgas con tu proyecto 100% terminado y listo para usar o emprender.
              </p>
            </div>

            {/* Sello de Acompañamiento Fio */}
            <div className="pt-4 flex items-center gap-3.5 p-4 rounded-2xl bg-[#FAF5FF]/70 border border-fio-200/60">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-fio-pink to-[#D4AEFA] flex items-center justify-center text-white shrink-0 shadow-xs">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Impartido personalmente por Fio (Fiorella Carballo)
                </p>
                <p className="text-[11px] text-slate-500">
                  Cupos estrictamente reducidos para garantizar atención personalizada y corrección técnica individual.
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
          <div className="bg-[#FDFBF9] rounded-[32px] p-6 border border-white/90 shadow-[10px_14px_28px_rgba(180,160,200,0.08),-8px_-8px_20px_rgba(255,255,255,0.95)] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
              <h2 className="font-serif text-lg text-slate-800 font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-fio-pink" />
                Materiales y Todo lo que Incluye
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Todo cubierto
              </span>
            </div>

            <ul className="space-y-2.5">
              {workshop.includes.map((inc, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <div className="w-5 h-5 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="leading-snug">{inc}</span>
                </li>
              ))}
            </ul>

            {/* Destacados Adicionales */}
            <div className="pt-3 border-t border-slate-200/40 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2 text-slate-600">
                <Coffee className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Coffee break artesanal con repostería dulce y bebidas.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-fio-600 shrink-0" />
                <span>Uso ilimitado de herramientas de alta precisión durante el taller.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Sparkle className="w-4 h-4 text-fio-pink shrink-0" />
                <span>Te llevás tu proyecto completo y terminado a casa el mismo día.</span>
              </div>
            </div>
          </div>

          {/* Caja 2: Inversión, Reserva e Inscripción / Pago con SINPE */}
          <div className="bg-[#FDFBF9] rounded-[32px] p-6 border border-white/90 shadow-[12px_16px_32px_rgba(180,160,200,0.12),-8px_-8px_20px_rgba(255,255,255,0.95)] space-y-5">
            {/* Encabezado de Inversión */}
            <div className="flex items-baseline justify-between gap-2 pb-3 border-b border-slate-200/50">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Inversión por participante
                </span>
                <p className="font-serif text-3xl font-bold text-slate-900">
                  {formatCRC(workshop.price)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 justify-end">
                  <Users className="w-3.5 h-3.5 text-fio-pink" />
                  {workshop.spotsAvailable} disponibles
                </span>
                <span className="text-[10px] text-slate-400">Total cupo: {workshop.totalSpots}</span>
              </div>
            </div>

            {isFull ? (
              /* Caso: Cupos Agotados */
              <div className="space-y-4 py-3 text-center">
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-amber-800 text-xs">
                  <p className="font-bold">¡Cupos agotados para esta fecha!</p>
                  <p className="mt-1 text-amber-700">
                    Escribile a Fio por WhatsApp para anotarte en la lista de espera o consultar la fecha de la próxima edición.
                  </p>
                </div>
                <a
                  href={getWhatsAppLink(
                    '64004640',
                    `Hola Fio! Vi que los cupos para "${workshop.title}" están agotados. Me gustaría saber cuándo abrís la próxima fecha.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Avisarme para la Próxima Fecha</span>
                </a>
              </div>
            ) : (
              /* Caso: Cupos Disponibles - Formulario Directo */
              <form onSubmit={handleConfirmReservation} className="space-y-4">
                {/* Selector de Cantidad de Cupos */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                    ¿Cuántos cupos deseas reservar?
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].filter((n) => n <= workshop.spotsAvailable).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setQuantity(n)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                          quantity === n
                            ? 'bg-fio-800 text-white border-fio-800 shadow-sm'
                            : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-white'
                        }`}
                      >
                        {n} {n === 1 ? 'cupo' : 'cupos'}
                      </button>
                    ))}
                  </div>
                  {quantity > 1 && (
                    <p className="text-xs font-semibold text-fio-800 mt-1.5 text-right">
                      Total a pagar: {formatCRC(totalPrice)}
                    </p>
                  )}
                </div>

                {/* Campos de Contacto */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Nombre y Apellido <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Carolina Vargas"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-fio-300"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Teléfono / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej. 8888-8888"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-fio-300"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Correo Electrónico (opcional)
                    </label>
                    <input
                      type="email"
                      placeholder="tu@correo.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-fio-300"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Notas especiales o acompañantes (opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Voy con una amiga / Requiero factura"
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-fio-300"
                    />
                  </div>
                </div>

                {formError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Caja de Datos SINPE Móvil Oficial */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/40 border border-emerald-200/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      SINPE Móvil Oficial Costa Rica
                    </span>
                    <button
                      type="button"
                      onClick={handleCopySinpe}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-200 transition-all"
                    >
                      {copiedSinpe ? (
                        <><Check className="w-3 h-3 text-emerald-600" /> ¡Copiado!</>
                      ) : (
                        <><Copy className="w-3 h-3" /> Copiar 6400-4640</>
                      )}
                    </button>
                  </div>
                  <div className="text-xs text-slate-700">
                    <p className="font-bold text-emerald-900 text-sm">
                      6400-4640
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Titular: <strong className="text-slate-700">Fiorella Carballo</strong>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Monto a transferir: <strong className="text-emerald-800">{formatCRC(totalPrice)}</strong>
                    </p>
                  </div>
                </div>

                {/* Botón Principal: Confirmar Reserva y Enviar Comprobante */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg active:scale-98 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar e Inscribirme con SINPE</span>
                </button>

                {/* Botón Secundario: Agregar al Carrito */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-xs font-semibold text-slate-700 bg-white/80 hover:bg-white border border-slate-200 shadow-xs active:scale-98 transition-all"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-fio-pink" />
                  <span>{addedToCartToast ? '¡Agregado al Carrito!' : 'O agregar al Carrito de la Web'}</span>
                </button>

                <p className="text-[10px] text-center text-slate-400">
                  🔒 Tu cupo queda reservado en el sistema y se confirma automáticamente al verificar el comprobante.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Éxito al Confirmar Reserva */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#FDFBF9] rounded-[32px] p-6 sm:p-8 max-w-md w-full border border-white/80 shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-2xl text-slate-800 font-bold">
              ¡Pre-Reserva Registrada!
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Hemos registrado tus datos para <strong>{workshop.title}</strong> con el pedido número{' '}
              <strong className="text-fio-800">{confirmedOrderNumber}</strong>.
            </p>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-xs text-emerald-800 text-left space-y-1">
              <p className="font-bold">Paso final:</p>
              <p>Se ha abierto tu WhatsApp con el mensaje pre-redactado para Fiorella (6400-4640). Enviá el comprobante de SINPE Móvil para apartar oficialmente tu espacio.</p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  onNavigate('workshops');
                }}
                className="flex-1 py-2.5 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-semibold text-xs transition-all"
              >
                Ver Más Talleres
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  onNavigate('store');
                }}
                className="flex-1 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 transition-all"
              >
                Ir a la Tienda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
