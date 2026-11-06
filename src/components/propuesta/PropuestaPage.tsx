import React, { useState } from 'react';
import {
  QrCode, Receipt, Boxes, Landmark, GraduationCap,
  Star, Award, BookOpen, CheckCircle2,
  Tag, Users, BarChart3, ShieldCheck, ShoppingBag,
  Check, Copy, ArrowRight, Printer, Heart,
  Smartphone, Database, Layers, Sparkles, Gift,
  Calendar, Mail, Bell, Wrench, DollarSign,
  TrendingUp, Percent, MessageCircle, CheckCircle,
  Truck, ArrowUpRight, X, Handshake, Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { playNewOrderChimeSound, playBubblePopSound } from '../../utils/soundEffects';
import { AppRoute } from '../../types';

interface PropuestaPageProps {
  onNavigate: (route: AppRoute, adminTab?: any) => void;
}

export const PropuestaPage: React.FC<PropuestaPageProps> = ({ onNavigate }) => {
  const { acceptProposal } = useApp();
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [selectedPlanView, setSelectedPlanView] = useState<'all' | 'modules' | 'gifts' | 'savings'>('all');
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [acceptedSuccess, setAcceptedSuccess] = useState(false);
  const [clientName, setClientName] = useState('Fiorella Jara / By.Fio');
  const [clientPhone, setClientPhone] = useState('6400-4640');
  const [clientNotes, setClientNotes] = useState('¡Acepto la propuesta formalmente! Listos para arrancar con la implementación.');

  const handleOpenAcceptModal = (source?: string) => {
    setAcceptedSuccess(false);
    setIsAcceptModalOpen(true);
    playBubblePopSound();
  };

  const handleConfirmAccept = () => {
    acceptProposal({
      clientName,
      clientPhone,
      notes: clientNotes,
      planName: 'Plan Partner By.Fio (11 Módulos Base + 3 Regalías)',
      monthlyFee: 40000,
    });
    setAcceptedSuccess(true);
    playNewOrderChimeSound();
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const fullProposalText = `Hola,

Te presento formalmente la propuesta para tu plataforma digital. Más que entregarte un sistema, mi objetivo es que trabajemos juntos a largo plazo como Partners estratégicos en el crecimiento de tu marca y en futuros proyectos.

¿Cómo funciona nuestra modalidad? (Cero riesgos para ti)
Tu sitio funciona bajo un modelo de suscripción mensual personalizada (SaaS). La tecnología e infraestructura son propiedad nuestra y tú únicamente pagas un alquiler mensual por el uso de la plataforma adaptada a tu negocio. Esto te da ventajas únicas:

• Sin pagos por adelantado ni inversión inicial: No tienes que desembolsar miles de dólares por el desarrollo desde cero.
• Cero cobros anuales sorpresas: Nosotros asumimos al 100% el costo y las renovaciones anuales de Hosting, Dominio, servidores y mantenimiento técnico.
• Libertad total sin ataduras: Al ser por suscripción por uso, no estás amarrada a contratos forzosos. Si el día de mañana decides pausar o retirarte, puedes cancelar tu suscripción en cualquier momento sin penalidades ni compromisos.

Lo que incluye tu plataforma (11 Módulos Base):
1. Verificación de pagos SinpePay: ₡15.000 / mes
2. Tienda Online: ₡15.000 / mes
3. Catálogo de Productos: ₡10.000 / mes
4. Cursos y Talleres: ₡15.000 / mes
5. Perfiles de Usuario: ₡10.000 / mes
6. Cola y Alisto de Pedidos: ₡15.000 / mes
7. Proveedores y Compras: ₡10.000 / mes
8. Directorio de Clientes: ₡10.000 / mes
9. Caja y Reportería: ₡15.000 / mes
10. Notificación de Pedidos: ₡5.000 / mes
11. Web y Mantenimiento continuo: ₡10.000 / mes

Valor comercial regular de los 11 módulos: ₡130.000 / mes.

Regalías incluidas 100% GRATIS para ti (₡0):
• Módulo de Comprobantes de Compra por Correo (Valorado en ₡10.000/mes).
• Módulo de Agenda para citas y eventos.
• Hosting, Dominio y Renovaciones Anuales (Ahorro directo de $25 USD / ₡13.000 al mes).

Tu Tarifa Exclusiva como Partner:
Por tu trayectoria como creadora de contenido y para consolidar nuestra alianza estratégica, redujimos el valor total del ecosistema (más de ₡153.000 mensuales) y la tarifa promocional de lanzamiento (₡75.000) a una mensualidad fija de Partner de solo ₡40.000 colones al mes, garantizada durante 12 meses.

Beneficio Adicional Opcional — App Multiusuario (Celular y PC):
• Precio regular: ₡15.000 / mes.
• Precio especial para ti: Solo ₡5.000 adicionales al mes (ahorras ₡10.000 mensuales).

Resumen de tu ahorro real:
• Ahorro mensual directo: Te ahorras más de ₡110.000 colones cada mes entre el descuento de plataforma, las regalías, la App y el ahorro de hosting y dominio.
• Beneficio en ajuste anual: Pasados los primeros 12 meses, nuestros planes tienen un ajuste regular del 20%. Como Partner, te reducimos ese ajuste a la mitad: se aplicará por única vez un incremento de solo el 10% sobre tu tarifa pactada.

¿Cómo arrancamos?
1. Activación: Con el pago del primer mes, iniciamos de inmediato la implementación sin cobros de instalación.
2. Adaptación a tu medida: Nos reunimos para adaptar el sistema a tu flujo de trabajo real y optimizar los tiempos de tu operativa diaria.
3. Pruebas y Carga en Vivo: Probamos juntos módulo por módulo y cargamos los datos reales de tu negocio para que todo quede listo y funcionando al 100%.

Quedo atento para que confirmemos el acuerdo y arranquemos con todo.`;

  const handleCopySummary = () => {
    navigator.clipboard.writeText(fullProposalText).then(() => {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const baseModules = [
    {
      id: 'sinpe',
      title: 'Verificación de pagos SinpePay',
      price: '₡15.000 / mes',
      priceNumber: 15000,
      description: 'Validación automatizada de comprobantes Banco BCR con detección de referencia única anti-reutilización y verificación exacta de monto pagado.',
      icon: Landmark,
      color: 'from-emerald-500 to-teal-600',
      tagColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300',
      actionLabel: 'Ver Módulo SinpePay',
      onClick: () => onNavigate('admin', 'sinpe'),
    },
    {
      id: 'store',
      title: 'Tienda Online',
      price: '₡15.000 / mes',
      priceNumber: 15000,
      description: 'Vitrina mobile-first de compra ágil pensada para el tráfico directo de TikTok (@by_fio) e Instagram (@by_fio10) con carrito interactivo.',
      icon: ShoppingBag,
      color: 'from-pink-500 to-rose-600',
      tagColor: 'bg-pink-100 text-pink-800 dark:bg-pink-950/80 dark:text-pink-300',
      actionLabel: 'Ver Tienda Online',
      onClick: () => onNavigate('store'),
    },
    {
      id: 'catalog',
      title: 'Catálogo de Productos',
      price: '₡10.000 / mes',
      priceNumber: 10000,
      description: 'Catálogo mayorista y minorista con filtros dinámicos para agendas personalizadas, libros de vacunas pediátricos, tazas, stickers y papelería.',
      icon: BookOpen,
      color: 'from-purple-500 to-indigo-600',
      tagColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300',
      actionLabel: 'Ver Catálogo',
      onClick: () => onNavigate('catalogo'),
    },
    {
      id: 'workshops',
      title: 'Cursos y Talleres',
      price: '₡15.000 / mes',
      priceNumber: 15000,
      description: 'Cartelera educativa estructurada de los 5 pilares formativos con gestión de cupos en tiempo real, temarios y registro digital de alumnos.',
      icon: GraduationCap,
      color: 'from-amber-500 to-orange-600',
      tagColor: 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300',
      actionLabel: 'Ver Talleres',
      onClick: () => onNavigate('workshops'),
    },
    {
      id: 'users',
      title: 'Perfiles de Usuario',
      price: '₡10.000 / mes',
      priceNumber: 10000,
      description: 'Control de accesos rápidos y seguros mediante PINs individuales de 4 dígitos para Fio (Administradora) y colaboradores de taller/alisto.',
      icon: Users,
      color: 'from-indigo-500 to-purple-600',
      tagColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300',
      actionLabel: 'Ver Perfiles & PINs',
      onClick: () => onNavigate('admin', 'users'),
    },
    {
      id: 'orders',
      title: 'Cola y Alisto de Pedidos',
      price: '₡15.000 / mes',
      priceNumber: 15000,
      description: 'Logística WMS con flujo FIFO cronológico, alisto guiado artículo por artículo, indicación de estante exacto y escaneo QR de confirmación.',
      icon: QrCode,
      color: 'from-fio-purple to-purple-800',
      tagColor: 'bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-fio-pink',
      actionLabel: 'Abrir Cola WMS',
      onClick: () => onNavigate('admin', 'orders'),
    },
    {
      id: 'suppliers',
      title: 'Proveedores y Compras',
      price: '₡10.000 / mes',
      priceNumber: 10000,
      description: 'Control de órdenes de compra, borradores de insumos (viniles, espirales, tazas), historial de abastecimiento y cálculo de reposición automática.',
      icon: Truck,
      color: 'from-sky-500 to-blue-600',
      tagColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300',
      actionLabel: 'Ver Compras & Proveedores',
      onClick: () => onNavigate('admin', 'suppliers'),
    },
    {
      id: 'customers',
      title: 'Directorio de Clientes',
      price: '₡10.000 / mes',
      priceNumber: 10000,
      description: 'Directorio central de clientes frecuentes, cédulas, números de teléfono, direcciones de envío y botón de pedido express en 1 clic.',
      icon: Users,
      color: 'from-teal-500 to-emerald-600',
      tagColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300',
      actionLabel: 'Ver Clientes',
      onClick: () => onNavigate('admin', 'customers'),
    },
    {
      id: 'reports',
      title: 'Caja y Reportería',
      price: '₡15.000 / mes',
      priceNumber: 15000,
      description: 'Facturación POS en mostrador, arqueo de caja diario en tiempo real, desglose detallado SINPE vs Efectivo y actas de cierre contable.',
      icon: Receipt,
      color: 'from-emerald-600 to-green-700',
      tagColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300',
      actionLabel: 'Ver Caja & Cierre',
      onClick: () => onNavigate('admin', 'reports'),
    },
    {
      id: 'notifications',
      title: 'Notificación de Pedidos',
      price: '₡5.000 / mes',
      priceNumber: 5000,
      description: 'Alertas automáticas de compras, despachos en preparación y envío instantáneo de resúmenes formateados al chat de WhatsApp de Fio.',
      icon: Bell,
      color: 'from-pink-600 to-rose-700',
      tagColor: 'bg-pink-100 text-pink-800 dark:bg-pink-950/80 dark:text-pink-300',
      actionLabel: 'Ver Alertas de Pedidos',
      onClick: () => onNavigate('admin', 'orders'),
    },
    {
      id: 'maintenance',
      title: 'Web y Mantenimiento continuo',
      price: '₡10.000 / mes',
      priceNumber: 10000,
      description: 'Actualizaciones periódicas de plataforma, soporte técnico continuo, copias de respaldo y optimización de velocidad de carga.',
      icon: Wrench,
      color: 'from-slate-600 to-purple-900',
      tagColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
      actionLabel: 'Infraestructura Cloud',
      onClick: () => onNavigate('admin'),
    },
  ];

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* 1. HERO HEADER DE LA PROPUESTA */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2D1B4E] via-[#4A1E6D] to-[#1E1035] text-white p-6 sm:p-10 shadow-2xl border border-purple-800/40">
        {/* Luces y Esferas Ambientales */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-fio-pink/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-fio-purple/30 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bubble font-bold text-fio-yellow">
            <Sparkles className="w-4 h-4 text-fio-yellow" />
            <span>Alianza Estratégica & Comercial • Propuesta Digital By.Fio</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bubble font-bold tracking-wide text-white leading-tight">
            Propuesta de Plataforma Digital & <span className="text-transparent bg-clip-text bg-gradient-to-r from-fio-pink via-purple-300 to-fio-yellow">Modelo Partner</span>
          </h1>

          {/* CARTA DE PRESENTACIÓN DIRECTA */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 text-purple-100 font-sans text-sm sm:text-base leading-relaxed">
            <p className="font-bubble font-bold text-white text-base sm:text-lg">
              Hola,
            </p>
            <p>
              Te presento formalmente la propuesta para tu plataforma digital. Más que entregarte un sistema, mi objetivo es que trabajemos juntos a largo plazo como <strong>Partners estratégicos</strong> en el crecimiento de tu marca y en futuros proyectos.
            </p>
          </div>

          {/* BOTONES DE ACCIÓN RÁPIDA */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleOpenAcceptModal('hero')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 font-bubble font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer ring-2 ring-emerald-300"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>Aceptar Propuesta</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-purple-950 hover:bg-purple-50 font-bubble font-bold text-xs sm:text-sm shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              {copiedSummary ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-fio-purple" />}
              <span>{copiedSummary ? '¡Propuesta Copiada!' : 'Copiar Propuesta Completa'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bubble font-bold text-xs sm:text-sm backdrop-blur-sm active:scale-95 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-purple-200" />
              <span>Imprimir / Guardar PDF</span>
            </button>

            <button
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-fio-pink to-purple-600 hover:from-purple-600 hover:to-fio-pink text-white font-bubble font-bold text-xs sm:text-sm shadow-lg shadow-pink-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <span>Ir al Panel de Administración</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* METRIC CHIPS CLAVE */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/10 text-center">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span className="block text-2xl sm:text-3xl font-bubble font-bold text-fio-yellow">₡40.000</span>
            <span className="text-[11px] text-purple-200 font-sans">Mensualidad Partner Fija</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span className="block text-2xl sm:text-3xl font-bubble font-bold text-emerald-300">&gt; ₡110.000</span>
            <span className="text-[11px] text-purple-200 font-sans">Ahorro Mensual Real</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span className="block text-2xl sm:text-3xl font-bubble font-bold text-pink-300">11 + 3</span>
            <span className="text-[11px] text-purple-200 font-sans">Módulos + Regalías ₡0</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span className="block text-2xl sm:text-3xl font-bubble font-bold text-sky-300">0 Riesgos</span>
            <span className="text-[11px] text-purple-200 font-sans">SaaS sin Contratos Forzosos</span>
          </div>
        </div>
      </div>

      {/* 2. ¿CÓMO FUNCIONA NUESTRA MODALIDAD? (CERO RIESGOS PARA TI) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-purple-100 dark:border-purple-900/40 shadow-xl shadow-purple-900/5 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-purple-900/40">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bubble font-bold text-xs mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Modelo SaaS • Máxima Tranquilidad</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bubble font-bold text-slate-900 dark:text-white">
              ¿Cómo funciona nuestra modalidad? (Cero riesgos para ti)
            </h2>
          </div>

          <span className="px-3 py-1.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-fio-purple dark:text-fio-pink text-xs font-bubble font-bold shrink-0">
            Tecnología Propia en Alquiler Adaptado
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
          Tu sitio funciona bajo un modelo de suscripción mensual personalizada (SaaS). La tecnología e infraestructura son propiedad nuestra y tú únicamente pagas un alquiler mensual por el uso de la plataforma adaptada a tu negocio. Esto te da ventajas únicas:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Ventaja 1 */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 dark:from-emerald-950/20 dark:via-[#1E1B2E] dark:to-teal-950/10 border-2 border-emerald-200/80 dark:border-emerald-800/40 space-y-2.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Sin pagos por adelantado ni inversión inicial
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
              No tienes que desembolsar miles de dólares por el desarrollo desde cero. Inicias de forma inmediata sin descapitalizar tu taller creativo ni tu inventario.
            </p>
          </div>

          {/* Ventaja 2 */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50/70 via-white to-indigo-50/40 dark:from-sky-950/20 dark:via-[#1E1B2E] dark:to-indigo-950/10 border-2 border-sky-200/80 dark:border-sky-800/40 space-y-2.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Cero cobros anuales sorpresas
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
              Nosotros asumimos al 100% el costo y las renovaciones anuales de Hosting, Dominio, servidores y mantenimiento técnico continuo. Cero cobros ocultos de fin de año.
            </p>
          </div>

          {/* Ventaja 3 */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50/70 via-white to-pink-50/40 dark:from-purple-950/20 dark:via-[#1E1B2E] dark:to-pink-950/10 border-2 border-purple-200/80 dark:border-purple-800/40 space-y-2.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-fio-purple text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Libertad total sin ataduras
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
              Al ser por suscripción por uso, no estás amarrada a contratos forzosos. Si el día de mañana decides pausar o retirarte, puedes cancelar tu suscripción en cualquier momento sin penalidades ni compromisos.
            </p>
          </div>
        </div>
      </section>

      {/* 3. LO QUE INCLUYE TU PLATAFORMA (11 MÓDULOS BASE) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-purple-100 dark:border-purple-900/40 shadow-xl shadow-purple-900/5 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-purple-900/40">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 text-fio-purple dark:text-fio-pink font-bubble font-bold text-xs mb-1.5">
              <Boxes className="w-3.5 h-3.5" />
              <span>Ecosistema Integral Completo</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bubble font-bold text-slate-900 dark:text-white">
              Lo que incluye tu plataforma (11 Módulos Base)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans mt-0.5">
              Cada módulo resuelve un área operativa clave de tu taller, catálogo y ventas online:
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-right">
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-sans uppercase font-bold">Valor Comercial Base</span>
            <span className="text-base sm:text-lg font-bubble font-bold text-fio-purple dark:text-fio-pink">₡130.000 / mes</span>
          </div>
        </div>

        {/* LISTA Y TARJETAS DE LOS 11 MÓDULOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {baseModules.map((mod, index) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className="p-5 rounded-2xl bg-slate-50/80 dark:bg-purple-950/20 border border-slate-200/80 dark:border-purple-900/40 hover:border-purple-300 dark:hover:border-purple-700/60 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${mod.color} text-white flex items-center justify-center shadow-xs shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bubble font-bold text-slate-500 dark:text-slate-400">
                        Módulo {index + 1}
                      </span>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bubble font-bold ${mod.tagColor} shrink-0`}>
                      {mod.price}
                    </span>
                  </div>

                  <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-fio-purple dark:group-hover:text-fio-pink transition-colors">
                    {mod.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/50 dark:border-purple-900/30">
                  <button
                    onClick={mod.onClick}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-purple-900/30 hover:bg-purple-50 dark:hover:bg-purple-900/60 text-slate-700 dark:text-slate-200 hover:text-fio-purple text-xs font-bubble font-bold border border-slate-200 dark:border-purple-800 transition-all cursor-pointer"
                  >
                    <span>{mod.actionLabel}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CALLOUT VALOR TOTAL REGULAR */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 dark:from-purple-950/40 dark:via-pink-950/20 dark:to-amber-950/20 border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-fio-purple text-white flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bubble font-bold text-sm text-slate-900 dark:text-white">
                Valor comercial regular de los 11 módulos base:
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-sans">
                Suma individual de licencias de software, WMS, e-commerce y facturación.
              </p>
            </div>
          </div>

          <div className="text-xl sm:text-2xl font-bubble font-bold text-fio-purple dark:text-fio-pink">
            ₡130.000 / mes
          </div>
        </div>
      </section>

      {/* 4. REGALÍAS INCLUIDAS 100% GRATIS PARA TI (₡0) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-pink-500/10 dark:from-amber-950/30 dark:via-purple-950/40 dark:to-pink-950/20 border-2 border-amber-300 dark:border-amber-700/60 shadow-xl shadow-amber-900/5 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-amber-200/60 dark:border-amber-800/40">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/90 text-amber-900 dark:text-amber-300 font-bubble font-bold text-xs mb-1.5">
              <Gift className="w-3.5 h-3.5 text-amber-600" />
              <span>100% Bonificado • Cero Costo</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bubble font-bold text-slate-900 dark:text-white">
              Regalías incluidas 100% GRATIS para ti (₡0)
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-sans mt-0.5">
              Herramientas de alto valor incorporadas sin ningún costo adicional dentro de tu suscripción:
            </p>
          </div>

          <span className="px-3 py-1.5 rounded-2xl bg-amber-500 text-white text-xs font-bubble font-bold shadow-sm shrink-0">
            ₡0 Adicionales
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Regalía 1: Módulo de Comprobantes de Compra por Correo */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1E1B2E] border border-amber-200 dark:border-amber-800/40 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-pink-500 text-white flex items-center justify-center shadow-xs">
                <Mail className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bubble font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                GRATIS (₡0)
              </span>
            </div>
            <div>
              <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Módulo de Comprobantes de Compra por Correo
              </h3>
              <p className="text-xs font-bubble font-bold text-amber-700 dark:text-amber-400 mt-0.5">
                Valorado en ₡10.000 / mes
              </p>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
              Emisión y despacho automatizado de comprobantes digitales formales directamente a la bandeja de entrada de tus clientes al confirmar su pago.
            </p>
            <button
              onClick={() => onNavigate('admin', 'billing')}
              className="inline-flex items-center gap-1.5 text-xs font-bubble font-bold text-fio-purple dark:text-fio-pink hover:underline pt-1 cursor-pointer"
            >
              <span>Ver Facturación & Recibos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Regalía 2: Módulo de Agenda para citas y eventos */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1E1B2E] border border-amber-200 dark:border-amber-800/40 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bubble font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                GRATIS (₡0)
              </span>
            </div>
            <div>
              <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Módulo de Agenda para citas y eventos
              </h3>
              <p className="text-xs font-bubble font-bold text-purple-700 dark:text-purple-400 mt-0.5">
                Organización Total del Taller
              </p>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
              Cronograma de fechas de entrega de pedidos personalizados, calendario de talleres creativos, lista rápida de tareas y alertas visuales.
            </p>
            <button
              onClick={() => onNavigate('admin', 'agenda')}
              className="inline-flex items-center gap-1.5 text-xs font-bubble font-bold text-fio-purple dark:text-fio-pink hover:underline pt-1 cursor-pointer"
            >
              <span>Abrir Agenda de Taller</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Regalía 3: Hosting, Dominio y Renovaciones Anuales */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1E1B2E] border border-amber-200 dark:border-amber-800/40 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-600 text-white flex items-center justify-center shadow-xs">
                <Database className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bubble font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                100% CUBIERTO
              </span>
            </div>
            <div>
              <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Hosting, Dominio y Renovaciones Anuales
              </h3>
              <p className="text-xs font-bubble font-bold text-sky-700 dark:text-sky-400 mt-0.5">
                Ahorro directo de $25 USD / ₡13.000 al mes
              </p>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
              Servidores cloud de alta velocidad, base de datos en tiempo real, certificado SSL de seguridad y renovación anual de dominio asumida por nosotros.
            </p>
            <div className="text-xs font-bubble font-bold text-emerald-600 dark:text-emerald-400 pt-1">
              ✓ Cero trámites técnicos para ti
            </div>
          </div>
        </div>
      </section>

      {/* 5. TU TARIFA EXCLUSIVA COMO PARTNER (EL CORAZÓN DE LA ALIANZA) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1035] via-[#3B1559] to-[#5C1D73] text-white p-6 sm:p-10 shadow-2xl border-2 border-fio-pink/40 space-y-6">
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-fio-pink/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-fio-yellow/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/15">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fio-yellow text-slate-950 font-bubble font-bold text-xs shadow-md">
              <Award className="w-4 h-4 text-slate-950" />
              <span>Alianza Estratégica para Creadoras de Contenido</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bubble font-bold text-white tracking-wide">
              Tu Tarifa Exclusiva como Partner
            </h2>
            <p className="text-xs sm:text-sm text-purple-100 font-sans leading-relaxed">
              Por tu trayectoria como creadora de contenido y para consolidar nuestra alianza estratégica, redujimos el valor total del ecosistema (más de ₡153.000 mensuales) y la tarifa promocional de lanzamiento (₡75.000) a una mensualidad fija de Partner de <strong>solo ₡40.000 colones al mes</strong>, garantizada durante 12 meses.
            </p>
          </div>

          {/* CAJA DE PRECIO DESTACADA */}
          <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0 w-full md:w-auto min-w-[260px] shadow-2xl">
            <span className="block text-xs font-sans text-purple-200 uppercase tracking-wider line-through opacity-80">
              Valor Total: &gt; ₡153.000 / mes
            </span>
            <span className="block text-xs font-sans text-pink-300 uppercase tracking-wider line-through font-bold mt-0.5">
              Promo Lanzamiento: ₡75.000 / mes
            </span>
            <div className="my-2.5">
              <span className="text-3xl sm:text-4xl font-bubble font-bold text-fio-yellow">
                ₡40.000
              </span>
              <span className="text-xs font-sans text-purple-100 block">
                colones / mes
              </span>
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bubble font-bold bg-emerald-400 text-emerald-950">
              ✓ Garantizada por 12 meses
            </span>

            <button
              onClick={() => handleOpenAcceptModal('partner-tier')}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-fio-yellow via-amber-300 to-yellow-400 hover:from-amber-400 hover:to-fio-yellow text-slate-950 font-bubble font-bold text-xs sm:text-sm shadow-lg active:scale-95 transition-all cursor-pointer ring-2 ring-yellow-200/50"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>Aceptar Propuesta</span>
            </button>
          </div>
        </div>

        {/* BENEFICIO ADICIONAL OPCIONAL: APP MULTIUSUARIO */}
        <div className="relative z-10 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2">
                <h3 className="font-bubble font-bold text-sm sm:text-base text-white">
                  Beneficio Adicional Opcional — App Multiusuario (Celular y PC)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-fio-yellow text-purple-950">
                  Opcional
                </span>
              </div>
              <p className="text-xs text-purple-100 font-sans mt-0.5">
                Instalación multi-dispositivo para todo tu equipo de trabajo en simultáneo, sin límites de pantallas ni cierres de sesión.
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="block text-[11px] text-purple-200 line-through">
              Precio regular: ₡15.000 / mes
            </span>
            <div className="text-sm sm:text-base font-bubble font-bold text-fio-yellow">
              Solo ₡5.000 adicionales / mes
            </div>
            <span className="text-[10px] text-emerald-300 font-bold">
              (Ahorras ₡10.000 mensuales)
            </span>
          </div>
        </div>
      </section>

      {/* 6. RESUMEN DE TU AHORRO REAL */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-purple-100 dark:border-purple-900/40 shadow-xl shadow-purple-900/5 space-y-6">
        <div className="pb-4 border-b border-slate-100 dark:border-purple-900/40">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bubble font-bold text-xs mb-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Transparencia Financiera</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bubble font-bold text-slate-900 dark:text-white">
            Resumen de tu ahorro real
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ahorro 1 */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-emerald-950/20 dark:via-[#1E1B2E] dark:to-teal-950/10 border-2 border-emerald-300 dark:border-emerald-800/50 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">
                💰
              </span>
              <h3 className="font-bubble font-bold text-base text-slate-900 dark:text-white">
                Ahorro mensual directo
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
              <strong>Te ahorras más de ₡110.000 colones cada mes</strong> entre el descuento de plataforma, las regalías bonificadas, la App multiusuario y el ahorro permanente de hosting y dominio anual.
            </p>
          </div>

          {/* Ahorro 2 */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950/20 dark:via-[#1E1B2E] dark:to-pink-950/10 border-2 border-purple-300 dark:border-purple-800/50 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-fio-purple text-white flex items-center justify-center font-bold text-sm">
                📈
              </span>
              <h3 className="font-bubble font-bold text-base text-slate-900 dark:text-white">
                Beneficio en ajuste anual
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
              Pasados los primeros 12 meses, nuestros planes tienen un ajuste regular del 20%. <strong>Como Partner, te reducimos ese ajuste a la mitad:</strong> se aplicará por única vez un incremento de <strong>solo el 10%</strong> sobre tu tarifa pactada.
            </p>
          </div>
        </div>

        {/* BOTÓN ACEPTAR PROPUESTA EN SECCIÓN AHORRO */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-purple-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-purple-950/20 border border-emerald-200 dark:border-emerald-800/40">
          <div>
            <h4 className="font-bubble font-bold text-sm text-slate-900 dark:text-white">
              ¿Lista para empezar a ahorrar más de ₡110.000 colones al mes?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-sans">
              Activación inmediata con soporte continuo y sin pagos de desarrollo por adelantado.
            </p>
          </div>

          <button
            onClick={() => handleOpenAcceptModal('savings-summary')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bubble font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Aceptar Propuesta</span>
          </button>
        </div>
      </section>

      {/* 7. ¿CÓMO ARRANCAMOS? (PASO A PASO) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-purple-100 dark:border-purple-900/40 shadow-xl shadow-purple-900/5 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-purple-900/40">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 text-fio-purple dark:text-fio-pink font-bubble font-bold text-xs mb-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Ruta de Puesta en Marcha</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bubble font-bold text-slate-900 dark:text-white">
              ¿Cómo arrancamos?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans mt-0.5">
              Tres pasos simples y transparentes para tener tu plataforma operando al 100%:
            </p>
          </div>

          <span className="px-3 py-1.5 rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bubble font-bold shrink-0">
            Cero Costo de Instalación
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Paso 1 */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/80 dark:border-purple-900/40 space-y-2.5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-fio-purple text-white flex items-center justify-center font-bubble font-bold text-sm shadow-xs">
                1
              </span>
              <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Activación
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
              Con el pago del primer mes, iniciamos de inmediato la implementación sin cobros de instalación ni trámites engorrosos.
            </p>
          </div>

          {/* Paso 2 */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/80 dark:border-purple-900/40 space-y-2.5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-fio-pink text-white flex items-center justify-center font-bubble font-bold text-sm shadow-xs">
                2
              </span>
              <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Adaptación a tu medida
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
              Nos reunimos para adaptar el sistema a tu flujo de trabajo real y optimizar los tiempos de tu operativa diaria en el taller.
            </p>
          </div>

          {/* Paso 3 */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/80 dark:border-purple-900/40 space-y-2.5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bubble font-bold text-sm shadow-xs">
                3
              </span>
              <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Pruebas y Carga en Vivo
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
              Probamos juntos módulo por módulo y cargamos los datos reales de tu negocio para que todo quede listo y funcionando al 100%.
            </p>
          </div>
        </div>

        {/* CIERRE & LLAMADO A LA ACCIÓN */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-white dark:from-purple-950/50 dark:via-pink-950/20 dark:to-[#1E1B2E] border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <p className="font-bubble font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              Quedo atento para que confirmemos el acuerdo y arranquemos con todo.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-sans">
              Acepta la propuesta en línea o contáctame directamente por WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 shrink-0">
            <button
              onClick={() => handleOpenAcceptModal('how-we-start')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bubble font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer ring-2 ring-emerald-400/40"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Aceptar Propuesta</span>
            </button>

            <a
              href="https://wa.me/50664004640?text=Hola%20Fio,%20estoy%20listo%20para%20confirmar%20el%20acuerdo%20de%20la%20plataforma%20digital%20By.Fio%20con%20la%20tarifa%20Partner."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bubble font-bold text-xs sm:text-sm shadow-lg shadow-purple-700/25 active:scale-95 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Directo</span>
            </a>
          </div>
        </div>
      </section>

      {/* 8. LISTA COMPLETA DE TODO LO QUE CONTIENE (ACTUALIZADA) */}
      <section className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-[#1E1233] to-[#2B1048] text-white shadow-2xl border border-purple-800/40 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fio-purple/30 border border-purple-400/30 text-xs font-bubble font-bold text-fio-yellow">
            <Layers className="w-3.5 h-3.5" />
            <span>Inventario Exhaustivo Oficial</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bubble font-bold text-white tracking-wide">
            Lista Completa de Todo lo que Contiene
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/80 font-sans">
            Relación íntegra de todos los módulos base, regalías bonificadas y herramientas que conforman tu plataforma:
          </p>
        </div>

        {/* LISTADO EN 3 COLUMNAS LIMPIAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Columna 1: 11 Módulos Base */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-fio-pink font-bubble font-bold text-sm">
              <Boxes className="w-4 h-4" />
              <span>11 Módulos Base (Valor: ₡130.000/mes)</span>
            </div>
            <ul className="space-y-2 text-xs text-purple-100 font-sans">
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-fio-pink" />
                  <span>1. Verificación de pagos SinpePay</span>
                </span>
                <span className="text-[11px] font-bold text-fio-yellow">₡15.000/mes</span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-fio-pink" />
                  <span>2. Tienda Online</span>
                </span>
                <span className="text-[11px] font-bold text-fio-yellow">₡15.000/mes</span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-fio-pink" />
                  <span>3. Catálogo de Productos</span>
                </span>
                <span className="text-[11px] font-bold text-fio-yellow">₡10.000/mes</span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-fio-pink" />
                  <span>4. Cursos y Talleres</span>
                </span>
                <span className="text-[11px] font-bold text-fio-yellow">₡15.000/mes</span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-fio-pink" />
                  <span>5. Perfiles de Usuario</span>
                </span>
                <span className="text-[11px] font-bold text-fio-yellow">₡10.000/mes</span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-fio-pink" />
                  <span>6. Cola y Alisto de Pedidos</span>
                </span>
                <span className="text-[11px] font-bold text-fio-yellow">₡15.000/mes</span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-fio-pink" />
                  <span>7. Proveedores y Compras</span>
                </span>
                <span className="text-[11px] font-bold text-fio-yellow">₡10.000/mes</span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-fio-pink" />
                  <span>8. Directorio de Clientes</span>
                </span>
                <span className="text-[11px] font-bold text-fio-yellow">₡10.000/mes</span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-fio-pink" />
                  <span>9. Caja y Reportería</span>
                </span>
                <span className="text-[11px] font-bold text-fio-yellow">₡15.000/mes</span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-fio-pink" />
                  <span>10. Notificación de Pedidos</span>
                </span>
                <span className="text-[11px] font-bold text-fio-yellow">₡5.000/mes</span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-fio-pink" />
                  <span>11. Web y Mantenimiento continuo</span>
                </span>
                <span className="text-[11px] font-bold text-fio-yellow">₡10.000/mes</span>
              </li>
            </ul>
          </div>

          {/* Columna 2: Regalías 100% GRATIS (₡0) */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-emerald-300 font-bubble font-bold text-sm">
              <Gift className="w-4 h-4" />
              <span>Regalías Incluidas 100% GRATIS (₡0)</span>
            </div>
            <ul className="space-y-2 text-xs text-purple-100 font-sans">
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Módulo de Comprobantes por Correo</span>
                </span>
                <span className="text-[11px] font-bold text-emerald-300">₡0 (Val. ₡10.000)</span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Módulo de Agenda para citas y eventos</span>
                </span>
                <span className="text-[11px] font-bold text-emerald-300">₡0 (Gratis)</span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Hosting, Dominio y Renovaciones Anuales</span>
                </span>
                <span className="text-[11px] font-bold text-emerald-300">₡0 (Ahorro $25 USD)</span>
              </li>
              <li className="flex items-center gap-2 pt-2 border-t border-white/10 text-[11px] text-purple-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Cero pagos por adelantado ni inversión inicial</span>
              </li>
              <li className="flex items-center gap-2 text-[11px] text-purple-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Cero cobros anuales sorpresas</span>
              </li>
              <li className="flex items-center gap-2 text-[11px] text-purple-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Libertad total sin contratos forzosos</span>
              </li>
              <li className="flex items-center gap-2 text-[11px] text-purple-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Acompañamiento directo como Partners</span>
              </li>
            </ul>
          </div>

          {/* Columna 3: Beneficio Adicional & Operativa */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-fio-yellow font-bubble font-bold text-sm">
              <Smartphone className="w-4 h-4" />
              <span>Beneficio Adicional & Ecosistema</span>
            </div>
            <ul className="space-y-2 text-xs text-purple-100 font-sans">
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-fio-yellow" />
                  <span>App Multiusuario (Celular y PC)</span>
                </span>
                <span className="text-[11px] font-bold text-fio-yellow">₡5.000/mes</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-yellow" />
                <span>Tarifa Partner: ₡40.000/mes garantizada 12 meses</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-yellow" />
                <span>Ajuste anual reducido a la mitad (solo 10%)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-yellow" />
                <span>Ahorro mensual directo de más de ₡110.000/mes</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-yellow" />
                <span>Logística WMS con alisto guiado y escaneo QR</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-yellow" />
                <span>Mascota 3D interactiva Estrellita By.Fio</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-yellow" />
                <span>Panel de Analítica y Métricas (/metricas)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-yellow" />
                <span>Base de datos en la nube con alta disponibilidad</span>
              </li>
            </ul>
          </div>
        </div>

        {/* PIE DE FICHA / BOTÓN FINAL */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="text-xs font-bubble font-bold text-fio-yellow">
              By.Fio Talleres Creativos & Tienda de Papelería Bonita
            </p>
            <p className="text-[11px] text-purple-200/70 font-sans">
              Propuesta Oficial de Alianza Estratégica & Modelo Partner · Costa Rica 2026
            </p>
          </div>

          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bubble font-bold border border-white/20 cursor-pointer"
          >
            ↑ Subir al Inicio
          </button>
        </div>
      </section>
    </div>
  );
};