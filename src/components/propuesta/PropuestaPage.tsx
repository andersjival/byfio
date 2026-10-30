import React, { useState } from 'react';
import {
  QrCode, Receipt, Boxes, Landmark, GraduationCap,
  Sparkles, BookOpen, Link2, CheckCircle2, ExternalLink,
  Share2, Tag, Users, BarChart3, ShieldCheck, ShoppingBag,
  Clock, Check, Copy, ArrowRight, Printer, Star, Heart,
  Smartphone, Monitor, Award, Sliders, Volume2, Database,
  ArrowUpRight, Palette, HelpCircle, Layers
} from 'lucide-react';
import { AppRoute } from '../../types';

interface PropuestaPageProps {
  onNavigate: (route: AppRoute, adminTab?: any) => void;
}

export const PropuestaPage: React.FC<PropuestaPageProps> = ({ onNavigate }) => {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'wms' | 'store' | 'academy' | 'finance' | 'admin' | 'metrics'>('all');

  const handleCopySummary = () => {
    const text = `PROYECTO TECNOLÓGICO BY.FIO - RESUMEN DE FUNCIONALIDADES & BENEFICIOS

BENEFICIOS ESTRATÉGICOS CLAVE:
• Ahorro de tiempo en conversaciones largas por WhatsApp: Todo queda automatizado hacia el panel de pedidos online.
• Orden riguroso de Pedidos: Cola cronológica FIFO y alisto guiado con validación QR para cero confusiones.
• Orden y control de Inventario: Mínimos/máximos, alertas automáticas y cálculo sugerido para compras a proveedores.
• Todo Organizado y Centralizado: Un único ecosistema que unifica tienda, catálogo, talleres, WMS, facturación y analítica.

MÓDULOS DEL SISTEMA:
1. Gestión de Pedidos y Alisto (Logística WMS): FIFO, Control de Estados, Alisto Guiado QR, Validación por Escaneo.
2. Inventario Inteligente y Abastecimiento: Stock Actual, Mínimos/Máximos, Alertas Reabastecimiento, Cantidad Sugerida, Etiquetas QR.
3. Tienda Online & Catálogo Digital: Mobile-First, Categorías Dinámicas, Personalización Interactiva, Checkout SINPE 6400-4640.
4. Academia y Talleres Creativos: 5 Pilares Formativos, Cupos en Tiempo Real, Fichas de Contenido, Registro de Alumnos.
5. Caja, Facturación y Reportería: Factura Rápida, Cierre Diario e Ingresos, Envío por WhatsApp.
6. Administración, Precios y Usuarios: Editor de Precios, Perfiles de Usuarios y PINs, Mascota Interactiva Estrellita.
7. Analítica y Métricas en Tiempo Real (/metricas): Enlaces Rastreados, Sincronización en la Nube, PC vs Celulares, Secciones Favoritas.
8. Multimedia & Experiencia Sensorial: Video Intro Cinematográfico, Efectos de Sonido Gotas de Agua, Modo Claro/Oscuro, Alta Disponibilidad Cloud.`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* HEADER HERO DE LA PROPUESTA */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2D1B4E] via-[#4A1E6D] to-[#1E1035] text-white p-6 sm:p-10 shadow-2xl border border-purple-800/40">
        {/* Luces de Fondo y Decoración */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-fio-pink/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-fio-purple/30 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bubble font-bold text-fio-yellow">
            <Award className="w-4 h-4 text-fio-yellow" />
            <span>Documento Oficial de Entrega & Propuesta Integral</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bubble font-bold tracking-wide text-white leading-tight">
            Ecosistema Tecnológico <span className="text-transparent bg-clip-text bg-gradient-to-r from-fio-pink via-purple-300 to-fio-yellow">By.Fio</span>
          </h1>

          <p className="text-sm sm:text-base text-purple-100/90 font-sans leading-relaxed">
            Plataforma digital completa que integra <strong className="text-white">Logística de Alisto WMS</strong>, <strong className="text-white">Tienda E-Commerce Mobile-First</strong>, <strong className="text-white">Academia de Talleres Creativos</strong>, <strong className="text-white">Facturación & POS</strong> y <strong className="text-white">Analítica en Tiempo Real</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-purple-950 hover:bg-purple-50 font-bubble font-bold text-xs sm:text-sm shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              {copiedSummary ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-fio-purple" />}
              <span>{copiedSummary ? '¡Resumen Copiado!' : 'Copiar Resumen'}</span>
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

        {/* Cintas de Métricas Clave */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/10 text-center">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span className="block text-2xl sm:text-3xl font-bubble font-bold text-fio-yellow">6+2</span>
            <span className="text-[11px] text-purple-200 font-sans">Módulos Centrales</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span className="block text-2xl sm:text-3xl font-bubble font-bold text-emerald-300">100%</span>
            <span className="text-[11px] text-purple-200 font-sans">Mobile-First & Redes</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span className="block text-2xl sm:text-3xl font-bubble font-bold text-pink-300">0 ms</span>
            <span className="text-[11px] text-purple-200 font-sans">Tiempo Real Cross-Tab</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span className="block text-2xl sm:text-3xl font-bubble font-bold text-sky-300">Cloud</span>
            <span className="text-[11px] text-purple-200 font-sans">Infraestructura Segura</span>
          </div>
        </div>
      </div>

      {/* SECCIÓN ESTRATÉGICA: TRANSFORMACIÓN OPERATIVA & BENEFICIOS CLAVE */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-purple-100 dark:border-purple-900/40 shadow-xl shadow-purple-900/5 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-purple-900/40">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bubble font-bold text-xs mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Transformación Operativa del Negocio</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bubble font-bold text-slate-900 dark:text-white">
              Beneficios Clave & Impacto en la Operación Diaria
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans mt-0.5">
              Cómo la plataforma elimina los cuellos de botella más costosos y centraliza toda la gestión de By.Fio:
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-fio-purple dark:text-fio-pink text-xs font-bubble font-bold shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>100% Organizado & Centralizado</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Beneficio 1: Ahorro de tiempo en WhatsApp */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 dark:from-emerald-950/20 dark:via-[#1E1B2E] dark:to-teal-950/10 border-2 border-emerald-200/80 dark:border-emerald-800/40 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  💬
                </span>
                <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Ahorro Radical de Tiempo en WhatsApp
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                Cero Chats Largos
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
              <strong>Se acabaron las conversaciones largas y repetitivas de 15 a 20 minutos por cliente</strong> para enviar fotos sueltas, cotizar medidas, pedir el nombre de la personalización y solicitar comprobantes.
            </p>
            <div className="p-3 rounded-xl bg-white/80 dark:bg-purple-950/30 border border-emerald-100 dark:border-emerald-900/30 text-[11px] text-slate-700 dark:text-slate-200 font-sans space-y-1">
              <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                ✓ Todo Queda 100% Automatizado:
              </p>
              <p>
                El cliente navega la tienda o catálogo online, personaliza su artículo, adjunta su comprobante SINPE y el pedido ingresa estructurado y listo para alistar directamente en el <strong>Panel de Pedidos Online</strong>.
              </p>
            </div>
          </div>

          {/* Beneficio 2: Orden y Control del Inventario */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50/70 via-white to-indigo-50/40 dark:from-sky-950/20 dark:via-[#1E1B2E] dark:to-indigo-950/10 border-2 border-sky-200/80 dark:border-sky-800/40 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  📦
                </span>
                <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Beneficios en Orden de Inventario
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200">
                Cero Quiebres de Stock
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
              Control total de existencias físicas en tiempo real. Sabrás con exactitud <strong>qué hay, qué falta y cuánto pedir</strong> a los proveedores antes de que se agote un producto crítico.
            </p>
            <div className="p-3 rounded-xl bg-white/80 dark:bg-purple-950/30 border border-sky-100 dark:border-sky-900/30 text-[11px] text-slate-700 dark:text-slate-200 font-sans space-y-1">
              <p className="font-semibold text-sky-700 dark:text-sky-400">
                ✓ Alertas Automáticas & Ubicación QR:
              </p>
              <p>
                Umbrales de Mínimos/Máximos, cálculo automático de reposición <em>(Máximo - Actual)</em> y etiquetas QR vinculadas a la ubicación exacta de cada estante en bodega.
              </p>
            </div>
          </div>

          {/* Beneficio 3: Orden y Flujo de Pedidos */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50/70 via-white to-pink-50/40 dark:from-purple-950/20 dark:via-[#1E1B2E] dark:to-pink-950/10 border-2 border-purple-200/80 dark:border-purple-800/40 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-fio-purple text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  ⚡
                </span>
                <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Beneficios en Orden de Pedidos (WMS)
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200">
                Flujo FIFO & Cero Errores
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
              Organización secuencial cronológica (el primero en entrar es el primero en alistarse), erradicando pedidos olvidados, extraviados o duplicados.
            </p>
            <div className="p-3 rounded-xl bg-white/80 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/30 text-[11px] text-slate-700 dark:text-slate-200 font-sans space-y-1">
              <p className="font-semibold text-fio-purple dark:text-fio-pink">
                ✓ Alisto Guiado Paso a Paso:
              </p>
              <p>
                La pantalla guía al operario artículo por artículo indicando el estante exacto y valida por escáner QR que el producto empacado sea el correcto.
              </p>
            </div>
          </div>

          {/* Beneficio 4: Todo Organizado y Centralizado */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 dark:from-amber-950/20 dark:via-[#1E1B2E] dark:to-orange-950/10 border-2 border-amber-200/80 dark:border-amber-800/40 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  🎯
                </span>
                <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Todo Organizado & Centralizado
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200">
                Ecosistema Unificado
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
              <strong>Fin a las libretas de papel, capturas dispersas en chats y notas sueltas.</strong> Toda la información comercial, operativa y contable en una sola plataforma.
            </p>
            <div className="p-3 rounded-xl bg-white/80 dark:bg-purple-950/30 border border-amber-100 dark:border-amber-900/30 text-[11px] text-slate-700 dark:text-slate-200 font-sans space-y-1">
              <p className="font-semibold text-amber-800 dark:text-amber-400">
                ✓ Control Absoluto desde Cualquier Lugar:
              </p>
              <p>
                Tienda, catálogo mayorista, alisto WMS, academia de talleres, facturación POS, cierre diario y analítica integrados en un único panel accesible desde PC o móvil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FILTROS RÁPIDOS POR CATEGORÍA */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'Ver Todo el Ecosistema' },
          { id: 'wms', label: '1. Pedidos & WMS' },
          { id: 'store', label: '2. Inventario & Tienda' },
          { id: 'academy', label: '3. Academia & Talleres' },
          { id: 'finance', label: '4. Caja & Facturación' },
          { id: 'admin', label: '5. Admin & Usuarios' },
          { id: 'metrics', label: '6. Métricas & Analítica' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabFilter(tab.id as any)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bubble font-bold transition-all shrink-0 cursor-pointer ${
              activeTabFilter === tab.id
                ? 'bg-fio-purple text-white shadow-md scale-[1.02]'
                : 'bg-white dark:bg-[#1E1B2E] text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-900/40 border border-slate-200/80 dark:border-purple-900/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* BLOQUE DE MÓDULOS EN ORDEN RIGUROSO */}
      <div className="space-y-6">
        {/* 1. GESTIÓN DE PEDIDOS Y ALISTO (LOGÍSTICA WMS) */}
        {(activeTabFilter === 'all' || activeTabFilter === 'wms') && (
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-purple-100 dark:border-purple-900/40 shadow-xl shadow-purple-900/5 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-purple-900/40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#A855F7] to-[#6B21A8] text-white flex items-center justify-center shadow-md">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-fio-purple uppercase tracking-wider">Módulo 1</span>
                  <h2 className="text-xl sm:text-2xl font-bubble font-bold text-slate-900 dark:text-white">
                    Gestión de Pedidos y Alisto (Logística WMS)
                  </h2>
                </div>
              </div>

              <button
                onClick={() => onNavigate('admin', 'orders')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-fio-purple dark:text-fio-pink text-xs font-bubble font-bold border border-purple-200 dark:border-purple-800 transition-all cursor-pointer"
              >
                <span>Abrir Cola de Pedidos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white">
                    Cola de Pedidos en Orden (FIFO)
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Visualización secuencial y cronológica de los pedidos de los clientes (uno a uno) según van llegando, garantizando que el primer pedido recibido sea el primero en prepararse sin confusiones.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white">
                    Control de Estados en Tiempo Real
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Seguimiento del ciclo de vida de cada orden paso a paso: <em>Pendiente de Alisto → En Alisto → Empacado / Facturado → Entregado</em>, con filtros por pestañas y búsqueda instantánea por número o cliente.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white">
                    Alisto Guiado Paso a Paso por Escáner QR
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Interfaz optimizada que guía al operario o a Fio producto por producto, indicando el <strong>estante exacto de ubicación en bodega</strong> (ej. <em>Estante A-1, Nivel 2</em>) y la cantidad a recoger.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white">
                    Validación por Código QR
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Escaneo mediante cámara o lector láser para confirmar que el artículo recogido coincida exactamente con el SKU del pedido, eliminando errores de despacho en papelería y agendas personalizadas.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 2. INVENTARIO INTELIGENTE Y ABASTECIMIENTO */}
        {(activeTabFilter === 'all' || activeTabFilter === 'store') && (
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-sky-100 dark:border-sky-900/40 shadow-xl shadow-sky-900/5 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-purple-900/40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#38BDF8] to-[#4338CA] text-white flex items-center justify-center shadow-md">
                  <Boxes className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">Módulo 2</span>
                  <h2 className="text-xl sm:text-2xl font-bubble font-bold text-slate-900 dark:text-white">
                    Inventario Inteligente y Abastecimiento
                  </h2>
                </div>
              </div>

              <button
                onClick={() => onNavigate('admin', 'inventory')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 text-sky-700 dark:text-sky-300 text-xs font-bubble font-bold border border-sky-200 dark:border-sky-800 transition-all cursor-pointer"
              >
                <span>Abrir Inventario & QR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white">
                  Control de Stock Actual
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Registro pormenorizado en tiempo real de unidades físicas disponibles por producto, costo unitario y precio de venta.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white">
                  Definición de Mínimos y Máximos
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Configuración personalizada de umbrales para cada artículo (ej. mínimo 5 unidades para agendas, máximo 25 unidades).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white text-rose-600 dark:text-rose-400">
                  Alertas de Reabastecimiento Automáticas
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Insignias rojas luminosas en el panel que destacan de inmediato los productos que llegaron o cayeron por debajo del stock mínimo.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white">
                  Cálculo de Cantidad Sugerida
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Fórmula automática <em>(Stock Máximo - Stock Actual)</em> que genera al instante la lista de reposición exacta para proveedores.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2 sm:col-span-2">
                <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white">
                  Generador de Etiquetas QR
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Creación automática e instantánea de códigos QR vinculados al SKU del producto con formato de impresión listo para impresoras térmicas o planchas de stickers.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 3. TIENDA ONLINE & CATÁLOGO DIGITAL */}
        {(activeTabFilter === 'all' || activeTabFilter === 'store') && (
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-pink-100 dark:border-pink-900/40 shadow-xl shadow-pink-900/5 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-purple-900/40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-md">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-fio-pink uppercase tracking-wider">Módulo 3</span>
                  <h2 className="text-xl sm:text-2xl font-bubble font-bold text-slate-900 dark:text-white">
                    Tienda Online & Catálogo Digital
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('catalogo')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-fio-purple text-xs font-bubble font-bold border border-purple-200 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Catálogo</span>
                </button>
                <button
                  onClick={() => onNavigate('store')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bubble font-bold shadow-md cursor-pointer"
                >
                  <span>Ver Tienda</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white">
                  Vitrina Mobile-First para Redes Sociales
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Experiencia fluida pensada para el tráfico directo proveniente de los enlaces en bio de <strong>TikTok (@by_fio)</strong> e <strong>Instagram (@by_fio10)</strong>, con carga ultrarrápida en dispositivos móviles.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white">
                  Categorías Dinámicas
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Filtros visuales táctiles para: Agendas Personalizadas, Libros de Vacunas Pediátricos, Artículos Sublimados (tazas, tote bags), Stickers en Vinil y Kits de Insumos para creadores.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white">
                  Personalización Interactiva
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Casillas integradas donde el cliente introduce nombres, frases, tema botánico o letras personalizadas antes de enviar el producto al carrito de compras.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white">
                  Checkout Rápido & SINPE Móvil
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Cierre de venta en 1 minuto: datos de envío, comprobante de SINPE Móvil al número oficial <strong>6400-4640</strong> y redirección directa del pedido formateado al WhatsApp y al WMS de Fio.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 4. ACADEMIA Y TALLERES CREATIVOS */}
        {(activeTabFilter === 'all' || activeTabFilter === 'academy') && (
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-amber-100 dark:border-amber-900/40 shadow-xl shadow-amber-900/5 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-purple-900/40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#EC4899] to-[#BE185D] text-white flex items-center justify-center shadow-md">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Módulo 4</span>
                  <h2 className="text-xl sm:text-2xl font-bubble font-bold text-slate-900 dark:text-white">
                    Academia y Talleres Creativos
                  </h2>
                </div>
              </div>

              <button
                onClick={() => onNavigate('workshops')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-800 dark:text-amber-300 text-xs font-bubble font-bold border border-amber-200 dark:border-amber-800 transition-all cursor-pointer"
              >
                <span>Ver Cartelera de Talleres</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white">
                  Cartelera de Talleres (5 Pilares Formativos)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Exhibición estructurada de los 5 núcleos de aprendizaje: <em>1. Encuadernación Artesanal</em>, <em>2. Agendas Personalizadas</em>, <em>3. Libros de Vacunas Acolchados</em>, <em>4. Sublimación de Tazas & Artículos</em> y <em>5. Stickers & Papelería Bonita</em>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white text-emerald-600 dark:text-emerald-400">
                  Gestión de Cupos en Tiempo Real
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Contador dinámico que actualiza los espacios disponibles con avisos de urgencia psicológica para acelerar inscripciones (ej. <em>"¡Solo quedan 3 cupos!"</em>).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white">
                  Ficha de Contenido Detallada
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Desglose automatizado de lo que incluye cada formación: Técnicas paso a paso, Materiales incluidos, Tips de emprendimiento y Acompañamiento post-taller.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white">
                  Registro de Alumnos & Asistencia
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Módulo de administración interno para inscribir alumnos, registrar pagos y validar asistencia en modalidad presencial o virtual.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 5. CAJA, FACTURACIÓN Y REPORTERÍA */}
        {(activeTabFilter === 'all' || activeTabFilter === 'finance') && (
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-emerald-100 dark:border-emerald-900/40 shadow-xl shadow-emerald-900/5 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-purple-900/40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#34D399] to-[#047857] text-white flex items-center justify-center shadow-md">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Módulo 5</span>
                  <h2 className="text-xl sm:text-2xl font-bubble font-bold text-slate-900 dark:text-white">
                    Caja, Facturación y Reportería
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('admin', 'billing')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-fio-purple text-xs font-bubble font-bold border border-purple-200 cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Facturación POS</span>
                </button>
                <button
                  onClick={() => onNavigate('admin', 'reports')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bubble font-bold shadow-md cursor-pointer"
                >
                  <span>Caja & Reportes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white">
                  Generación de Factura Rápida & POS
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Creación instantánea de comprobantes de venta con desglose de artículos, descuentos, costo de envío y total en colones, con opción de facturar en mostrador o asociar a un pedido web.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white">
                  Cierre Diario & Métricas de Ingresos
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Dashboard financiero que consolida ventas diarias, ingresos por SINPE vs Efectivo y balance de caja con botón para cierre contable de jornada.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white text-emerald-600 dark:text-emerald-400">
                  Envío Directo por WhatsApp
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Botón de un clic para despachar el resumen de compra y comprobante digital directamente al chat de WhatsApp del cliente con formato formal y limpio.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 6. ADMINISTRACIÓN, PRECIOS Y USUARIOS */}
        {(activeTabFilter === 'all' || activeTabFilter === 'admin') && (
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-purple-100 dark:border-purple-900/40 shadow-xl shadow-purple-900/5 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-purple-900/40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#6D28D9] text-white flex items-center justify-center shadow-md">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-fio-purple uppercase tracking-wider">Módulo 6</span>
                  <h2 className="text-xl sm:text-2xl font-bubble font-bold text-slate-900 dark:text-white">
                    Administración, Precios y Usuarios
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('admin', 'pricing')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-800 text-xs font-bubble font-bold border border-amber-200 cursor-pointer"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Precios</span>
                </button>
                <button
                  onClick={() => onNavigate('admin', 'users')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bubble font-bold shadow-md cursor-pointer"
                >
                  <span>Perfiles & PINs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white">
                  Editor de Precios y Listas
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Modificación ágil de costos, precios mayoristas y escalas de descuentos para stickers y productos terminados desde una interfaz centralizada.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white">
                  Perfiles de Usuarios y Roles (PINs)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Gestión de accesos diferenciados para Fio (Administradora Principal con acceso total) y Asistentes de Alisto/Ventas con PINs individuales de 4 dígitos.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white text-fio-pink">
                  Mascota Interactiva (Estrellita Animada)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Asistente flotante 3D integrada en toda la web que guía con mensajes carismáticos, accesos directos al catálogo, carrito y WhatsApp de soporte.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 7. ANALÍTICA Y MÉTRICAS EN TIEMPO REAL (/metricas) */}
        {(activeTabFilter === 'all' || activeTabFilter === 'metrics') && (
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-indigo-100 dark:border-indigo-900/40 shadow-xl shadow-indigo-900/5 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-purple-900/40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-700 text-white flex items-center justify-center shadow-md">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Módulo 7</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 font-bold animate-pulse">
                      ● En Vivo (Tiempo Real)
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bubble font-bold text-slate-900 dark:text-white">
                    Analítica & Métricas en Tiempo Real (/metricas)
                  </h2>
                </div>
              </div>

              <button
                onClick={() => onNavigate('metricas')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bubble font-bold border border-indigo-200 dark:border-indigo-800 transition-all cursor-pointer"
              >
                <span>Abrir Panel /metricas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white">
                  Generador de Enlaces de Campaña con Rastreo (?ref=slug)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Crea links únicos para Instagram Bio, WhatsApp, TikTok o ferias, rastreando clics, cargas de página y destino específico (Portada o secciones puntuales).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white">
                  Sincronización en Vivo Multi-Dispositivo
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  0 ms de latencia entre pestañas abiertas y persistencia multi-dispositivo en la nube con polling inteligente (2.5s) y pausa automática en segundo plano.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white">
                  Desglose por Dispositivos (PC vs Teléfonos Celulares)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Conteo cuantitativo y barras porcentuales comparativas para conocer con exactitud desde dónde visita la audiencia a By.Fio.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <h3 className="font-bubble font-bold text-sm text-slate-900 dark:text-white">
                  Ranking de las 16 Secciones de la Web
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Mapeo de popularidad y permanencia de cada sección pública y submódulo de administración, con botón directo para navegar a cada una.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 8. EXPERIENCIA MULTIMEDIA, AUDIO & ARQUITECTURA CLOUD */}
        {(activeTabFilter === 'all' || activeTabFilter === 'admin') && (
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-purple-100 dark:border-purple-900/40 shadow-xl shadow-purple-900/5 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-purple-900/40">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-fio-pink to-purple-600 text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-fio-pink uppercase tracking-wider">Módulo 8</span>
                <h2 className="text-xl sm:text-2xl font-bubble font-bold text-slate-900 dark:text-white">
                  Experiencia Multimedia, Audio & Arquitectura Cloud
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <div className="flex items-center gap-2 text-fio-purple">
                  <Star className="w-4 h-4 fill-fio-purple" />
                  <h3 className="font-bubble font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Video Intro By.Fio</h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Cinemática de entrada fluida con overlay de bienvenida y botón de reproducción manual en la barra de navegación.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <div className="flex items-center gap-2 text-fio-pink">
                  <Volume2 className="w-4 h-4" />
                  <h3 className="font-bubble font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Audio Háptico Orgánico</h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Efectos de sonido de gotas de agua suaves al interactuar con botones para una sensación artesanal y táctil.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-500">
                  <Palette className="w-4 h-4" />
                  <h3 className="font-bubble font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Tema Claro / Oscuro</h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Conmutación visual Sol/Luna con contraste de alta legibilidad configurado estrictamente bajo <em>darkMode: 'class'</em>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/30 space-y-2">
                <div className="flex items-center gap-2 text-sky-500">
                  <Database className="w-4 h-4" />
                  <h3 className="font-bubble font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Base de Datos en la Nube</h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Arquitectura moderna con almacenamiento en la nube de alta disponibilidad, ultrarrápida, escalable y sin caídas de servicio.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* SECCIÓN FINAL REQUERIDA POR EL USUARIO: LISTA CON SOLO EL NOMBRE DE CADA COSA */}
      <section className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-[#1E1233] to-[#2B1048] text-white shadow-2xl border border-purple-800/40 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fio-purple/30 border border-purple-400/30 text-xs font-bubble font-bold text-fio-yellow">
            <Layers className="w-3.5 h-3.5" />
            <span>Inventario Exhaustivo de la Plataforma</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bubble font-bold text-white tracking-wide">
            Lista Completa de Todo lo que Contiene
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/80 font-sans">
            Relación directa de todas las herramientas, pantallas, funciones y módulos implementados en By.Fio:
          </p>
        </div>

        {/* LISTADO EN COLUMNAS CON SOLO EL NOMBRE DE CADA COSA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Columna 1: Logística, WMS & Inventario */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-fio-pink font-bubble font-bold text-sm">
              <QrCode className="w-4 h-4" />
              <span>Logística WMS & Abastecimiento</span>
            </div>
            <ul className="space-y-2 text-xs text-purple-100 font-sans">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-pink" />
                <span>Cola de Pedidos en Orden (FIFO)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-pink" />
                <span>Control de Estados en Tiempo Real</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-pink" />
                <span>Alisto Guiado Paso a Paso</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-pink" />
                <span>Validación por Escáner QR de Cámara / Láser</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-pink" />
                <span>Control de Stock Actual</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-pink" />
                <span>Definición de Mínimos y Máximos</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-pink" />
                <span>Alertas de Reabastecimiento Automáticas</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-pink" />
                <span>Cálculo de Cantidad Sugerida</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-pink" />
                <span>Generador de Etiquetas QR e Impresión</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-pink" />
                <span>Lista Automatizada para Proveedores</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-pink" />
                <span>Trazabilidad y Ubicación por Estantería</span>
              </li>
            </ul>
          </div>

          {/* Columna 2: Tienda Online, Academia & Facturación */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-emerald-300 font-bubble font-bold text-sm">
              <ShoppingBag className="w-4 h-4" />
              <span>Tienda, Academia & POS</span>
            </div>
            <ul className="space-y-2 text-xs text-purple-100 font-sans">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Vitrina Mobile-First (TikTok & Instagram)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Catálogo Comercial Mayorista Online</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Personalización Interactiva de Artículos</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Carrito Flotante & Checkout SINPE 6400-4640</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Cartelera de Talleres (5 Pilares)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Gestión de Cupos en Tiempo Real</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Fichas de Contenido de Talleres</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Registro de Alumnos & Control de Asistencia</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Facturación Rápida en Mostrador & POS</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Cierre Diario de Caja & Gráficos Financieros</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Envío Directo de Factura a WhatsApp</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Ahorro de Tiempo en Pedidos por WhatsApp</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Panel de Pedidos Online Automatizado</span>
              </li>
            </ul>
          </div>

          {/* Columna 3: Administración, Analítica & Experiencia */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-fio-yellow font-bubble font-bold text-sm">
              <BarChart3 className="w-4 h-4" />
              <span>Admin, Analítica & Multimedia</span>
            </div>
            <ul className="space-y-2 text-xs text-purple-100 font-sans">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-yellow" />
                <span>Panel de Administración Central (Hub)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-yellow" />
                <span>Editor de Precios y Listas de Stickers</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-yellow" />
                <span>Perfiles de Usuarios & PINs de 4 Dígitos</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-yellow" />
                <span>Mascota Interactiva (Estrellita Animada)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-yellow" />
                <span>Generador de Enlaces Rastreados (/metricas)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-yellow" />
                <span>Telemetría en Vivo PC vs Celulares</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-yellow" />
                <span>Mapeo de Popularidad de las 16 Secciones</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-yellow" />
                <span>Video Intro Cinematográfico Oficial By.Fio</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-yellow" />
                <span>Efectos de Sonido Hápticos (Gotas de Agua)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-yellow" />
                <span>Selector de Modo Claro / Modo Oscuro</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-yellow" />
                <span>Base de Datos en la Nube de Alta Disponibilidad</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fio-yellow" />
                <span>Ecosistema Centralizado Unificado</span>
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
              Desarrollado con arquitectura moderna de alto rendimiento · Costa Rica 2026
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
