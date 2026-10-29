# 📜 HISTORIAL DE CAMBIOS APROBADOS — BY.FIO TALLERES CREATIVOS & TIENDA

Este archivo es el Registro Universal de Memoria Protegida.
Cualquier funcionalidad registrada aquí está blindada: ninguna IA puede eliminarla o revertirla.

---

## 🔗 VINCULACIÓN DEL PROYECTO

- **Repositorio:** https://github.com/andersjival/byfio
- **Rama:** main
- **URL Producción:** https://byfiocr.pages.dev
- **Base de Datos Cloudflare D1:** `byfiocr-db` (ID: `60326015-d917-4a7b-baac-ab90d972ae57`)
- **Arquitectura:** Vite + React + TypeScript + Tailwind CSS + Cloudflare Pages & D1

---

## 📦 REGISTRO DE ENTREGAS Y MÓDULOS

### Versión 1.38.0 - Corrección Definitiva del Selector de Impresión de Factura y Generación PDF
- [x] **Aislamiento Quirúrgico del Contenedor de Impresión ([`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Corregido el selector CSS de impresión (`body.invoice-open #root > div > *:not(.invoice-modal-overlay)`) que provocaba pantalla en blanco en el diálogo de impresión al ocultar erróneamente el contenedor principal de React `#root > div`.
  - Restablecida la jerarquía de impresión en `#root` y `#root > div` (`display: block !important; position: static !important; overflow: visible !important; min-height: 0 !important;`).
  - Habilitado el flujo nativo a página completa de `.invoice-modal-overlay` e `#printable-invoice` para visualización y descarga nítida en Carta / A4.
- [x] **Optimización en Flujo de Checkout ([`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx) e [`InvoiceModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InvoiceModal.tsx)):**
  - Cierre automático del modal de checkout al pulsar "Imprimir Factura / PDF", desplegando limpiamente la factura con capa superior `z-[80]`.
  - Asegurada la clase `body.invoice-open` en `handlePrint` previo a invocar `window.print()`.

### Versión 1.37.0 - Color Lila Pastel Oficial en Botones de Carrito y Catálogo con Hover Fucsia Suave
- [x] **Rediseño de Color en Botones de Carrito y Catálogo ([`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Reemplazado el morado fuerte anterior por el gradiente exacto lila pastel suave de referencia (`linear-gradient(135deg, #D4AEFA 0%, #C084FC 100%)`) en `.neu-btn-primary` y `.neu-btn-cart`.
  - Configurado efecto hover que transita fluidamente al fucsia suave oficial (`linear-gradient(135deg, #F472B6 0%, #EC4899 100%)`) con sombra suave `rgba(236, 72, 153, 0.45)`.
- [x] **Botones "Agregar al Carrito" en Tienda y Catálogo ([`StorePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/StorePage.tsx) y [`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx)):**
  - Formato pill táctil idéntico a la imagen de referencia con icono de bolsa de compras `ShoppingBag`, tipografía en blanco puro y respuesta táctil.
  - Actualizado el botón del carrito en barra superior ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)) y botón de pago en drawer ([`CartDrawer.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CartDrawer.tsx)).

### Versión 1.36.0 - Reproducción de Intro con Audio Activo e Imagen de Marca HD (logo-byfio-lila-HD)
- [x] **Video Intro con Inicio de Audio Directo ([`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - Configurado para reproducir directamente con audio activo (`isMuted: false`, `videoRef.current.muted = false`).
  - Fallback automático seguro: si la directiva de seguridad del navegador exige interacción previa, inicia silenciosamente y activa el sonido inmediatamente al hacer clic en cualquier parte de la pantalla o sobre el video.
  - Indicador flotante táctil "Toca aquí para escuchar el video 🎵" en caso de bloqueo estricto del navegador.
- [x] **Imagen Oficial de la Marca en Alta Definición ([`logo-byfio-lila-HD.png`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/assets/logo-byfio-lila-HD.png)):**
  - Incorporada la imagen oficial 2000x2000 HD en la fase inicial de la intro con halos radiales púrpuras y dorados pulsantes.
  - Utilizada como imagen de portada (`poster`) nativa en el reproductor de video para máxima nitidez visual.

### Versión 1.35.0 - Efecto Hover Fucsia Suave en Botón de Menú Principal y Navegación
- [x] **Botón "Menú Principal" en Panel Administrativo ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Implementado efecto de hover interactivo al pasar el mouse (`hover:bg-fio-pink` y resplandor `hover:shadow-[0_4px_14px_rgba(236,72,153,0.45)]`), transitando suavemente del púrpura al fucsia suave de la marca by.fio.
  - Icono de cuadrícula (`LayoutGrid`) con transición a blanco al pasar el mouse por encima.
- [x] **Botones del Menú Principal en Barra Superior y Móvil ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Efecto hover fucsia suave en todos los botones del menú de navegación (Inicio, Talleres, Tienda, Catálogo, Precios): `hover:text-fio-pink hover:bg-pink-50/70 hover:border-pink-200/80`.
  - Botón de regreso "Ver Tienda / Web" con transición fucsia suave.
- [x] **Tarjetas del Menú Principal de Administración ([`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx)):**
  - Transición a tono fucsia suave en bordes (`hover:border-pink-200/90`), fondo (`hover:bg-pink-50/40`), flecha y títulos al hacer hover.

### Versión 1.34.0 - Video Oficial de Intro Cinematográfica con Gradientes Púrpuras Difuminados y Transición Suave a la Web
- [x] **Video Intro Oficial Integrado ([`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - Incorporado video oficial de bienvenida (`intro-web-byfio.mp4`, 10 segundos, 1280x720 HD con audio AAC).
  - Apertura cinematográfica con fondo púrpura profundo y gradientes profesionales (`#4A0E78` a `#120220`, halos radiales difuminados y monograma oficial).
  - Difuminación suave de los gradientes ("SE DIFUMINAN Y APARECE EL VIDEO") con revelación fluida del marco de video en proporción 16:9 con sombras y bordes de cristal.
  - Salida gradual ("DESAPARECE LENTAMENTE Y ENTRA EN LA WEB") con desvanecimiento de 1100ms hacia la plataforma web interactiva.
- [x] **Controles Táctiles y Accesibilidad:**
  - Botón táctil para alternar sonido (Mute / Unmute con Audio HD) y detección de toque directo en el video.
  - Botón "Entrar a la web" (Saltar intro) con acceso instantáneo.
  - Barra de progreso del video en gradiente neón.
  - Botón "Ver Intro Web 🎬" disponible en el pie de página para repetir la experiencia en cualquier momento.
- [x] **Sincronización en Contexto Global ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx) y [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Métodos `isIntroOpen`, `playWebIntro` y `closeWebIntro` disponibles en toda la app.

### Versión 1.33.0 - Sección Oficial de Precios de Stickers, Pasos de Pedido y Editor Administrativo Completo
- [x] **Sección de Precios de Stickers Neumórfica ([`PricingStickersSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/PricingStickersSection.tsx)):**
  - Paquetes oficiales para Stickers 5x5: 15 (₡1.000 con 4-5 regalías), 75 (₡5.000 con 20-25 regalías), 105 (₡7.500 con 28-35 regalías), 150 (₡9.500 con 40-50 regalías).
  - Paquetes oficiales para Stickers 4x4: 24 (₡1.000), 120 (₡5.000), 168 (₡7.500), 240 (₡9.500).
  - Notas de especificación ("Las regalías son de tamaño 3x3", "Pregunta por nuestros servicios de diseño") y botón directo para pedir por WhatsApp con mensaje pre-rellenado.
- [x] **Flujo Visual "¿Cómo Realizar el Pedido?" con Botones de Acción:**
  - Guía paso a paso de los 5 pasos oficiales: Envío de logo/diseño, afinación de detalles, depósito 50% / 100%, envío de comprobante SINPE/BCR y revisión con 2 modificaciones permitidas.
  - Botones de acción directa: "Ir a la Tienda", "Ver Catálogo Online" y "Pedir por WhatsApp".
- [x] **Editor Completo para el Administrador ([`AdminPricingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminPricingModal.tsx)):**
  - Edición total en tiempo real de títulos, categorías, paquetes de stickers (cantidad, precio, regalías, badge destacado), notas y los 5 pasos del pedido.
  - Persistencia en almacenamiento local y sincronización de estado global en [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx).
- [x] **Navegación e Integración Multi-Ruta ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx), [`HomePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HomePage.tsx), [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx), [`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx)):**
  - Añadido botón "Precios" en la barra de navegación superior y menú móvil.
  - Sección integrada en la página de Inicio y con ruta directa `/precios`.
  - Pestaña "Precios & Stickers" en el panel de administración (`/admin/precios`) con botón "Editar Precios".

### Versión 1.32.0 - Despliegue Universal del Estilo Neumórfico en Botones Principales (Inicio, Talleres, Tienda) y Secciones
- [x] **Botones Principales de Navegación Más Grandes y Táctiles ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Implementados botones con relieve físico cerámico `.neu-btn` e iluminado activo `.neu-btn-primary` en la barra de navegación superior (desktop y mobile drawer).
  - Aumentado el tamaño táctil de los botones `Inicio`, `Talleres`, `Tienda` y `Catálogo` (`px-5 py-2.5` en desktop y `py-3` en móvil con tipografía `font-bubble font-bold`).
  - Botón de carrito neumórfico con reborde extruido y contador flotante.
- [x] **Botones Principales en Hero y Home ([`HeroDual.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HeroDual.tsx) y [`HomePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HomePage.tsx)):**
  - Botones principales de acción ampliados a `px-9 py-4.5 text-base sm:text-lg` con relieve dual táctil y respuesta al presionar.
  - Botones de exploración hacia talleres y tienda en el home con estilo neumórfico.
- [x] **Estilo Neumórfico Integral en Sección TALLERES ([`WorkshopsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/WorkshopsPage.tsx) y [`WorkshopDetailPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/WorkshopDetailPage.tsx)):**
  - Tarjetas cerámicas `.neu-card` con esquinas redondeadas generosas, contenedor de fotos rehundido `.neu-inset`, caja de beneficios y botones táctiles de inscripción y compartir `.neu-btn-primary` y `.neu-btn-circle`.
- [x] **Estilo Neumórfico Integral en Sección TIENDA & CATÁLOGO ([`StorePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/StorePage.tsx) y [`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx)):**
  - Pastillas de categorías neumórficas grandes y táctiles, buscador rehundido con sombra interior, tarjetas de productos con relieve suave y botones de cantidad/carrito táctiles.

### Versión 1.31.0 - Factura PDF e Impresión Universal en Hoja Estándar (Carta / A4): Cabecera con Color de Marca y Cuadrícula de Líneas Nítidas
- [x] **Cabecera Oficial con Color de la Marca ([`InvoiceModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InvoiceModal.tsx) e [`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Cabecera con fondo púrpura institucional `#6B21A8` (degradado corporativo `#581C87` a `#7E22CE`) preservado en impresión con `-webkit-print-color-adjust: exact` y `print-color-adjust: exact`.
  - Tipografía en blanco puro con logotipo `by.fio`, distintivo `Costa Rica 🇨🇷`, dirección física oficial de Tibás y WhatsApp `6400-4640`.
  - Recuadro de alta visibilidad para número de orden `#FIO-XXXX`, fecha de emisión y badge de verificación `PAGADO & VERIFICADO ✅`.
- [x] **Formato Universal de Hoja de Papel Normal (Carta / A4):**
  - Configuración `@page { size: letter portrait; margin: 10mm 12mm 12mm 12mm; }` para impresión limpia y proporcionada sin cortes de margen en cualquier impresora.
  - Supresión automática de fondos oscuros, barras de desplazamiento y botones de pantalla (`no-print`) al imprimir o guardar como PDF.
  - Flujo libre del documento (`invoice-modal-overlay` y `invoice-modal-card` estáticos en `@media print`) para admitir pedidos de múltiples páginas sin desbordes.
- [x] **Líneas Sólidas y Cuadrícula Nítida en Todos los Bloques:**
  - Tabla de artículos con cuadrícula completa (`border-collapse`, `border-2 border-slate-400` y divisiones entre celdas `border border-slate-300`), índices numéricos, personalizaciones destacadas y totales alineados.
  - Cuadro de datos del cliente y método de entrega estructurado con bordes de alta definición.
  - Desglose de totales con recuadro perimetral cerrado y cuentas bancarias oficiales (SINPE Móvil y BCR IBAN).
- [x] **Acceso Directo desde Checkout ([`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx)):**
  - Incorporado botón "Imprimir Factura / PDF" al confirmar la orden para que el comprador descargue o imprima su comprobante al instante.

### Versión 1.30.0 - Integración Oficial de Dirección Física (Tibás) y Horarios de Atención Semanales
- [x] **Componente Neumórfico de Dirección y Horarios ([`StudioLocationScheduleCard.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/StudioLocationScheduleCard.tsx)):**
  - **Ubicación Física Oficial:** 200 sur del parque de Tibás, San José, Costa Rica (Referencia: MAYO10 / by.fio) con botón de navegación directa hacia Google Maps y WhatsApp oficial `6400-4640`.
  - **Horarios de Atención Semanales:**
    - Lunes, Martes y Viernes: 9:00 am – 5:00 pm (badge de horario regular).
    - Jueves: 10:00 am – 4:00 pm.
    - Sábado: 10:00 am – 3:00 pm.
    - Miércoles y Domingo: Cerrado al público (badge ámbar de descanso).
- [x] **Modal Global de Horarios y Ubicación ([`StudioScheduleModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/StudioScheduleModal.tsx) & [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Botón táctil permanente en el footer para consultar dirección exacta y horarios en cualquier momento.
  - Indicador de estado en tiempo real (Abierto / Cerrado según día de la semana).
- [x] **Integración en Home y Flujo de Checkout ([`HomePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HomePage.tsx) & [`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx)):**
  - Tarjeta destacada en la página principal para visitantes y participantes de talleres.
  - Alerta detallada en el Checkout al seleccionar "Retiro en Taller (Gratis)" con dirección exacta y horarios de retiro.
- [x] **Actualización de Ubicación Predeterminada de Talleres ([`seedData.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/seedData.ts) y [`NewWorkshopModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/NewWorkshopModal.tsx)):**
  - Los talleres presenciales y el formulario de creación configuran automáticamente la sede en Tibás.

### Versión 1.29.0 - Corrección Integral de la Parte Superior de Reportes de Pedidos en la Web: Eliminación de Recorte Vertical y Rediseño Neumórfico
- [x] **Eliminación del Recorte Superior en Modales de Pedido ([`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx) e [`InvoiceModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InvoiceModal.tsx)):**
  - Solucionado el bug de flexbox (`items-center` con desborde en coordenadas negativas) que empujaba la cabecera del reporte fuera del margen superior de la pantalla.
  - Implementada arquitectura de ventana con cabecera fija superior (`shrink-0`), contenedor con límite `max-h-[92vh] flex flex-col` y cuerpo con scroll interno suave sin barras antiestéticas (`overflow-y-auto [scrollbar-width:none]`).
- [x] **Rediseño de la Cabecera del Reporte de Pedido Confirmado:**
  - Sustituido el texto interno de desarrollo por una cabecera editorial neumórfica con distintivo de pedido generado, nombre del cliente, número de orden `#FIO-XXXX` destacado en recuadro cerámico y metadatos rápidos (fecha, teléfono y método de entrega).
  - Desglose estructurado de los artículos comprados con personalizaciones, subtotales y tarjeta de cuentas SINPE/BCR con copia rápida.
- [x] **Alineación y Proporciones en Comprobante Oficial Imprimible:**
  - Rediseñado el encabezado de factura en [`InvoiceModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InvoiceModal.tsx) y reporte diario en [`DailyClosingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/DailyClosingModal.tsx) garantizando visibilidad al 100% desde el primer píxel.

### Versión 1.28.0 - Integración Oficial de Cuentas para SINPE Móvil y Pagos BCR: Tarjetas Neumórficas con Copiado Rápido y Modal de Consulta
- [x] **Datos Bancarios Oficiales de la Marca ([`PaymentAccountsCard.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/PaymentAccountsCard.tsx)):**
  - **SINPE Móvil:** Teléfono `6400-4640` con titularidad oficial a nombre de **Fiorella Patricia Jara Gutiérrez** y botón de copiado inmediato.
  - **Banco de Costa Rica (BCR):**
    - Cuenta de Ahorros: `00126752891` (con botón de copiado).
    - Cuenta IBAN: `CR09015202001267528911` (con botón de copiado).
    - Titular: **Fiorella Patricia Jara Gutiérrez**.
  - Enlace directo a WhatsApp para recepción instantánea de comprobantes.
- [x] **Integración en Flujo de Compra y Checkout ([`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx)):**
  - Se sustituyó el texto plano por la tarjeta neumórfica completa tanto en el formulario de pago como en la pantalla de orden confirmada con desglose de monto y número de pedido.
- [x] **Integración en Inscripción a Talleres ([`WorkshopDetailPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/WorkshopDetailPage.tsx)):**
  - Incorporada la tarjeta completa con el monto exacto del taller seleccionado y la titularidad verificada de Fio.
- [x] **Modal Global de Consulta de Cuentas ([`PaymentAccountsModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/PaymentAccountsModal.tsx) & [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Botón táctil disponible en el pie de página para que cualquier visitante consulte las cuentas y números SINPE en cualquier momento con 1 clic.

### Versión 1.27.0 - Adopción y Modulación del Estilo Neumorphism / Soft UI: Cajas de Información con Relieve Táctil, Botones Neumórficos y Showcase Interactivo
- [x] **Copiado y Modulación Exacta del Estilo Neumorphism ([`tailwind.config.js`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/tailwind.config.js) y [`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - **Cajas de Información Neumórficas (`.neu-card`):** Superficies cerámicas `#F1F2F6`, esquinas redondeadas generosas (`rounded-3xl`), bisel blanco sutil (`border-white/90`) y doble sombra física proyectada (`-10px -10px 24px #FFFFFF, 10px 10px 24px rgba(166, 175, 195, 0.38)`).
  - **Cajas Inset / Hundidas (`.neu-card-inset`):** Contenedores interiores con sombra cóncava (`inset 4px 4px 8px ...`).
  - **Botones Neumórficos Táctiles (`.neu-btn`, `.neu-btn-primary`, `.neu-btn-amber`):** Efecto de botón físico extruido que al hacer clic se hunde con sensación táctil (`:active { inset 3px 3px 6px ... }`).
  - **Botones Circulares de Acción (`.neu-btn-circle`):** Redondeados completos con resalte suave para iconos de corazón, audio y sumas.
  - **Selectores Segmentados (`.neu-segmented-container`):** Píldoras hundidas con interruptores de resalte al estilo del control solar de la referencia.
- [x] **Demostrador Interactivo en Vivo ([`NeumorphicShowcase.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/NeumorphicShowcase.tsx)):**
  - Incorporado en la página principal recreando todos los elementos de la hoja de diseño: dial de 28°, selector de clima (sol/nube/luna), los 4 pilares (soft, minimal, tactile, natural), barra de búsqueda inset, interruptor toggle on/off, reproductor de audio y la tarjeta de cita con comillas doradas `66` y esfera ámbar táctil.
- [x] **Adaptación Integral en la Web:**
  - Tarjetas y botones de talleres ([`WorkshopsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/WorkshopsSection.tsx)).
  - Tarjetas y selector de cantidad táctil `[-] 1 [+]` en el catálogo ([`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx)).
  - Botones del Hero y píldoras de calidad ([`HeroDual.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HeroDual.tsx)).
  - Botón de Proceder al Pago ([`CartDrawer.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CartDrawer.tsx)).
  - Integración en el selector de diseño del Admin ([`AdminDesignSettingsModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminDesignSettingsModal.tsx)).

### Versión 1.26.0 - Sistema Multifuncional de Carga de Fotografías (URL, Subida de Archivo, Pegar Foto Ctrl+V y Arrastrar y Soltar)
- [x] **Componente Universal de Carga de Fotos ([`ImageUploadField.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/ImageUploadField.tsx)):**
  - Implementado sistema modular de 4 métodos simultáneos para fotos:
    1. **Arrastrar y Soltar (Drag & Drop):** Zona interactiva con respuesta visual que captura cualquier archivo de imagen soltado sobre la caja.
    2. **Cargar desde Dispositivo:** Botón de subida y selector nativo de archivos compatible con celulares y computadoras.
    3. **Pegar Foto (Ctrl+V / Portapapeles):** Captura directa de imágenes copiadas en el portapapeles mediante botón interactivo o atajo de teclado `Ctrl+V`.
    4. **Pegar URL Directa:** Campo de texto con detección inmediata de enlaces web o Unsplash.
  - **Optimización y Compresión Client-Side (HTML5 Canvas):** Escalamiento automático de fotos pesadas a un máximo de 1200px con compresión JPEG 0.85 (~100-200 KB) para cargas instantáneas y cero sobrecarga de base de datos o almacenamiento.
- [x] **Integración en Creación y Edición de Talleres ([`NewWorkshopModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/NewWorkshopModal.tsx)):**
  - Reemplazado el campo básico de URL por el componente multifuncional con vista previa en vivo, badges de origen y resguardo.
- [x] **Integración en Creación y Edición de Productos e Inventario ([`NewProductModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/NewProductModal.tsx)):**
  - Incorporado en la ficha técnica del producto con formato cuadrado y todas las opciones de carga inmediata.

### Versión 1.25.0 - Modal Detallado de Producto 100% sin Barra de Scroll: Diseño Horizontal en 2 Columnas para Computadora y Vista Optimizada para Celular
- [x] **Eliminación Total de Barras de Scroll en Computadora y Móvil ([`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx)):**
  - Rediseñada la ventana modal que se abre al tocar cualquier producto del catálogo: en computadoras se presenta en 2 columnas horizontales (`md:flex-row max-w-3xl`) con fotografía a la izquierda e información, precio, descripción y acciones a la derecha.
  - Al distribuir el contenido horizontalmente, la altura total cabe 100% dentro de la pantalla sin necesidad alguna de scroll en computadoras.
  - Aplicado `[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden` tanto en el contenedor como en el cuerpo para erradicar cualquier barra de desplazamiento gris antiestética.
  - En celulares se despliega con proporciones equilibradas, botón flotante de cierre accesible y controles táctiles limpios sin estorbar la visibilidad.

### Versión 1.24.0 - Botón "Proceder al Pago", Catálogo Compacto en Cuadrícula Doble (50% Ancho / 2 Productos por Fila), Modal de Descripción en Grande, Limpieza de Iconos IA por Corazón Azul y Reubicación de Botones a Administración
- [x] **Actualización de Botón a "Proceder al Pago" ([`CartDrawer.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CartDrawer.tsx)):**
  - Modificado el botón principal del carrito para que exprese textualmente `Proceder al Pago` en sustitución del anglicismo "Proceder al Checkout".
- [x] **Reducción de Espacio al 50% y Vista de 2 Productos por Fila ([`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx)):**
  - Transformado el catálogo de filas anchas a una cuadrícula compacta de 2 columnas (`grid grid-cols-1 md:grid-cols-2 gap-4`), duplicando la densidad de productos visibles en pantalla.
  - Tarjetas compactas con fotografía interactiva, chips de categoría, selector ágil de cantidad `[-] 1 [+]` y botones de orden directa.
- [x] **Despliegue de Descripción Detallada en Grande al Clic:**
  - Al pulsar sobre la foto o el título de cualquier artículo, se despliega una ventana modal emergente con fotografía ampliada, especificaciones completas, personalización y botón de compra.
- [x] **Reubicación de Acciones de Compartir al Panel de Administración ([`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx)):**
  - Eliminados los botones de "Copiar Link del Catálogo" y "Compartir por WhatsApp" del home/catálogo público; ahora residen exclusivamente en el Hub del Panel Administrativo de Fio.
- [x] **Sustitución de Iconos de IA por el Corazón Azul Oficial:**
  - Retirados los iconos genéricos de IA (destellos, paquetes, manos, etc.) y reemplazados en todo el catálogo por el corazoncito azul oficial de by.fio (`#38BDF8`).

### Versión 1.23.0 - Corrección Integral de la Palabra "fio": Alineación Horizontal Continua y Posicionamiento Óptimo de la Estrella
- [x] **Alineación Tipográfica Continua ([`BrandLogo.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/BrandLogo.tsx)):**
  - Eliminado el contenedor `flex-col` que provocaba que el tallo de la `i` cayera por debajo de la línea base visual de `f` y `o`.
  - La palabra `fio` ahora fluye en una sola línea horizontal continua (`inline-flex items-center`) perfectamente cohesionada.
  - La estrella brillante `#FBBF24` se asienta de manera exacta sobre la `i` con micro-desplazamiento suave (`top-[-1px] sm:top-[-2px]`), manteniendo proximidad perfecta con la letra sin salirse ni recortarse en el borde superior del navegador.

### Versión 1.22.0 - Ajuste de la Estrella del Logotipo: Proximidad Natural sobre la "i", Eliminación de Desborde y Espaciado en Navbar
- [x] **Ajuste y Rediseño de la Estrella ([`BrandLogo.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/BrandLogo.tsx)):**
  - Eliminado el desplazamiento negativo agresivo (`-top-3.5`) que hacía que la estrella flotara demasiado lejos de la letra y se saliera de la pantalla cortándose contra el borde del navegador.
  - La estrella `#FBBF24` ahora se integra directamente sobre el tallo de la letra `i` con un espaciado natural e inmediato (`1.5px`), actuando como su punto oficial en la misma línea visual armónica de la palabra `fio`.
  - Construcción de tallo redondeado exacto (`rounded-full bg-fio-800`) alineado con la línea base de `f` y `o`.
- [x] **Margen y Altura en Barra Superior ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Barra superior ajustada a `min-h-[50px] sm:min-h-[54px] py-1.5` con margen superior de resguardo para garantizar que el logo, la estrella y el slogan se visualicen completos sin ningún recorte ni desborde superior.

### Versión 1.21.0 - Catálogo Online Oficial (`/catalogo`): Vista en Lista Editorial, Banner Fotográfico, Categorías con Botones y Selector, Edición de Precios y Generación Inmediata de Pedidos
- [x] **Nueva Página de Catálogo Online ([`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx)):**
  - Enrutamiento independiente en `/catalogo` y enlace directo en la barra superior de navegación ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)).
  - Banner fotográfico panorámico en grande con ambientación visual by.fio, métricas de productos y descripción detallada del catálogo para clientes mayoristas e individuales.
  - Enlaces de 1-clic para compartir: `[🔗 Copiar Link del Catálogo]` y `[📲 Compartir por WhatsApp]`.
- [x] **Sección Especial de Categorías con Botones, Selector y Buscador:**
  - Botones (pills) interactivos por categoría con contador dinámico de artículos.
  - Selector desplegable (`<select>`) para filtrado veloz en celulares y filtro para productos personalizables.
  - Buscador reactivo por nombre, código SKU o palabras clave de la descripción.
- [x] **Presentación de Productos en Formato Lista Editorial:**
  - Filas de catálogo con fotografía amplia (`w-52`), chips de categoría, título, código SKU y descripción completa visible.
  - Controles de cantidad táctiles `[-] 1 [+]`, cálculo en tiempo real del precio total (`formatCRC`), campo opcional de personalización de texto y botón `[🛒 Agregar al Pedido]`.
  - Botón directo `[⚡ Pedir por WhatsApp]` para generar el mensaje de orden listo para enviar a Fio con comprobante SINPE Móvil al 6400-4640.
  - Botón `[✏️ Editar Artículo]` en cada producto para que el administrador pueda modificar precios, fotos o descripciones en caliente con guardado permanente.
- [x] **Acceso en Panel de Administración ([`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx)):**
  - Módulo integrado para copiar el enlace del catálogo online o abrirlo en vivo directamente desde el Hub administrativo.

### Versión 1.20.0 - Restitución del Logotipo Oficial con Estrella, Corazón Interactivo que se Agranda al Tocar y Slogan
- [x] **Logotipo Tipográfico Oficial Restituido ([`BrandLogo.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/BrandLogo.tsx)):**
  - Reemplazado el isotipo en caja cuadrada por el logo original tipográfico oficial: letras moradas `by` y `fio` (`font-bubble font-bold text-fio-800`), corazón celeste `#38BDF8` en el centro y estrellita amarilla brillante `#FBBF24` posicionada sobre la `i`.
  - Slogan oficial integrado debajo: `TALLERES CREATIVOS & TIENDA` en tipografía morada tracking-wider en mayúsculas.
- [x] **Micro-Interacción Táctil del Corazón Celeste:**
  - Al hacer clic o tocar con el dedo en pantallas táctiles, el corazón celeste se agranda dinámicamente (`scale-150 rotate-6` con retorno elástico suave).
  - Al pasar el cursor (hover) se expande con efecto resorte (`scale-130`).
- [x] **Integración en Barra de Navegación ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Ajustada la barra superior con altura flexible (`min-h-[48px] sm:min-h-[52px]`) para enmarcar el logo y slogan con equilibrio estético perfecto.

### Versión 1.19.0 - Edición Completa y Persistente de Artículos del Inventario con Fotos, Precios, Stock y WMS
- [x] **Edición Integral de Artículos ([`NewProductModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/NewProductModal.tsx)):**
  - Modal adaptado a modo dual (`Crear Producto` vs `Modificar Artículo del Inventario`).
  - Edición completa de todos los atributos: nombre, código SKU (con generador automático), categoría (con creador dinámico de nueva categoría), ubicación física en estantería (WMS), precio de venta (₡), costo unitario (₡), cálculo automático de margen de ganancia en colones y porcentaje, stock actual, alertas de stock mínimo y meta de stock máximo, unidad de medida, descripción detallada y opciones de personalización por cliente.
  - Previsualización en vivo de la fotografía del producto a partir de la URL ingresada con fallback automático.
- [x] **Acceso Directo de Edición en Tabla de Inventario ([`InventoryTable.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx)):**
  - Añadido botón `[✏️ Editar]` en la columna de acciones de cada fila del inventario.
  - La fila del producto (foto, SKU y nombre) es interactiva y permite abrir el editor completo al hacer clic.
  - El botón `+ Agregar Producto al Inventario` limpia el formulario para crear un nuevo ítem desde cero.
- [x] **Gestión y Persistencia Global en Context ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Nuevos estados globales `editingProduct`, `setEditingProduct` y función `updateProduct`.
  - Sincronización instantánea con `localStorage` (`byfio_products_v1`) y reactividad inmediata en catálogo de tienda, buscador, órdenes y facturación.

### Versión 1.18.0 - Modal de Crear/Modificar Taller a Pantalla Completa & Edición Completa Persistente con Fotos y Descripción
- [x] **Ventana Inmersiva a Pantalla Completa ([`NewWorkshopModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/NewWorkshopModal.tsx)):**
  - Transformación del modal a una experiencia de pantalla completa (`fixed inset-0 w-full h-full`), sin cuadros reducidos ni scrolls apretados.
  - Encabezado superior con botón de cierre rápido y título dinámico contextual (`Crear Nuevo Taller` vs `Modificar Taller Existente`).
  - Maquetado editorial a 2 columnas con vista previa de fotografía en tiempo real, campos de título, subtítulo, fecha, horario, modalidad, ubicación física, cupos totales y precio en colones.
  - Editor dinámico de descripción completa del temario y lista editable de materiales incluidos (`¿Qué incluye?`) con opción de agregar o eliminar ítems.
  - Barra inferior fija de guardado con aviso de confirmación toast.
- [x] **Edición y Modificación de Talleres Existentes ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Nuevos estados globales `editingWorkshop`, `setEditingWorkshop` y función `updateWorkshop`.
  - Carga automática de todos los datos vigentes del taller al abrir el modal en modo edición.
  - Guardado persistente inmediato en `localStorage` (`byfio_workshops_v1`) y reactividad en todo el sitio (página pública del taller, catálogo y panel de administración).
- [x] **Acceso Rápido de Modificación en Panel Admin ([`WorkshopEnrollmentsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/WorkshopEnrollmentsSection.tsx)):**
  - Añadido botón directo `[✏️ Modificar]` en cada fila de taller (tanto en vista colapsada como en el panel desplegado de acciones).
  - Al pulsar `+ Crear Taller`, limpia el formulario a blanco; al pulsar `Modificar`, pre-llena los datos del taller seleccionado.

### Versión 1.17.0 - Selector Dinámico de Cantidad en Catálogo, Precio en Tiempo Real y Carrito Centrado en Móvil con Botón "Seguir Comprando"
- [x] **Controles de Cantidad y Precio Dinámico en Catálogo ([`StorePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/StorePage.tsx)):**
  - Incorporado selector táctil `[-] 1 [+]` directamente en la tarjeta de cada producto antes de añadir.
  - El monto del precio se multiplica y actualiza en tiempo real (`formatCRC(p.price * currentQty)`).
  - Al pulsar "Agregar al Carrito", se añade la cantidad exacta seleccionada y se abre automáticamente el carrito.
- [x] **Carrito Centrado en Móvil ([`CartDrawer.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CartDrawer.tsx)):**
  - Eliminado el desfase lateral (`pl-10`) que provocaba que el carrito se viera de lado o cortado en pantallas de celular.
  - Maquetado responsivo: en celular se abre centrado en pantalla completa con bordes suaves (`rounded-[32px]`) y sombra envolvente; en desktop se desliza lateralmente.
  - Añadido botón secundario mandatorio `[Volver a Seguir Comprando]` en el pie del carrito y en estado vacío, facilitando continuar explorando la tienda sin fricción.

### Versión 1.16.0 - Hero a Pantalla Completa & Animación Dinámica Rápida de Letras "BYFIO" en el Centro
- [x] **Hero a Pantalla Completa ([`HeroDual.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HeroDual.tsx)):** Dimensionado con `min-h-[calc(100vh-3rem)] sm:min-h-[calc(100vh-3.5rem)]` en disposición centrada vertical y horizontal (`flex flex-col justify-center items-center`), cubriendo el viewport con degradados ambientales expandidos para un impacto visual envolvente.
- [x] **Animación Veloz de Letras "BYFIO" ([`AnimatedByfioLetters.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/AnimatedByfioLetters.tsx)):**
  - Efecto de onda física escalonada en cada letra individual (B - Y - F - I - O) con retraso dinámico de resorte (`0.1s` por letra).
  - Barrido de brillo iridiscente ultra-rápido (`byfioShineSweep`) sobre gradiente morado-fucsia-celeste oficial.
  - Micro-interacción interactiva con salto elástico al hover y clic (`translateY(-16px) scale(1.3)`).
  - Decoración con la estrellita amarilla oficial giratoria y corazoncito celeste pulsante con sombras de luz.

### Versión 1.15.0 - Reorganización Compacta del Panel Admin, Eliminación de Pestaña Redundante y Ubicación Superior de Botones Clave
- [x] **Eliminación del botón redundante "Menú Principal" en [`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx):** Retirado el Tab 0 inferior que duplicaba el acceso; ahora las pestañas se centran estrictamente en las 5 secciones de trabajo operativo (Pedidos, Facturación, Inventario, Caja, Talleres).
- [x] **Reubicación Superior de Botones de Acción ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):** Botón `🎨 Diseño & Letra` (detalles y personalización visual) trasladado a la barra superior justo al lado del botón `Menú Principal`, permitiendo ajustar tipografías y paletas de color desde cualquier sección sin tener que regresar al Hub.
- [x] **Eliminación de la etiqueta estática "Panel Administrativo" en Navbar ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):** Reemplazado por un acceso limpio `← Ver Tienda / Web`, y retirada la repetición textual en la barra de árbol con slashes (`by.fio / [sección]`).
- [x] **Elevación vertical de contenidos:** Reducido el espaciado global (`space-y-3 sm:space-y-4` y `mb-4`) para que los datos e inventario queden inmediatamente a la vista sin scroll innecesario.

### Versión 1.14.0 - Landing Page Individual de Taller por URL (`/talleres/:id`), Enlace Social Específico vs General e Inscripción Directa con SINPE Móvil
- [x] **Página de Destino Dedicada por Taller ([`WorkshopDetailPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/WorkshopDetailPage.tsx)):**
  - Enrutamiento por URL individual e independiente (`/talleres/:id` o `/talleres?taller=:id`).
  - Navegación con árbol de slashes integrado (`by.fio / talleres / [nombre del taller]`) y botón de retorno al catálogo.
  - Maquetación editorial en 2 columnas:
    - **Lado Izquierdo:** Fotografía principal en marco zen/neumórfico suave, chips de fecha, horario, ubicación física/virtual, título editorial y descripción completa del taller y experiencia impartida por Fio.
    - **Lado Derecho:** Tarjeta "Materiales y Todo lo que Incluye" con checks esmeralda de todos los insumos, herramientas y coffee break artesanal; tarjeta de "Inversión & Reserva Inmediata" con selector dinámico de cupos, cálculo automático en colones (`formatCRC`) y formulario integrado de contacto.
- [x] **Flujo de Pago e Inscripción Oficial con SINPE Móvil:**
  - Caja informativa de SINPE Móvil oficial (`6400-4640`, Fiorella Carballo) con botón de 1-clic para copiar número.
  - Al confirmar la reserva: registra el pedido con número único en la base de datos y panel de Fio (`/admin/pedidos` y `/admin/talleres`), descuenta cupos en tiempo real y abre WhatsApp oficial (`6400-4640`) con el mensaje pre-redactado y estructurado para adjuntar el comprobante.
  - Opción secundaria de agregar el taller al carrito general para compras conjuntas con artículos de papelería.
- [x] **Separación Estricta de Enlaces Sociales en Panel Admin ([`WorkshopEnrollmentsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/WorkshopEnrollmentsSection.tsx)):**
  - Botón general en el encabezado: `[🔗 Copiar Link de Todos los Talleres]` (`/talleres`).
  - Botón individual en cada taller: `[🔗 Copiar Link de este Taller]` (`/talleres/:id`).
  - Botón `[👁️ Ver Página Pública]` para inspección directa del taller en vivo.
- [x] Integración en catálogo público ([`WorkshopsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/WorkshopsPage.tsx)): Enlaces directos a la página de cada taller desde imagen, título y botón "Ver Taller & Inscribirme", con botón rápido de copiado de link por tarjeta.

### Versión 1.13.0 - Sub-Rutas de URL Independientes para Admin, Menú Hub Compacto en 1 Pantalla & Modal Discreto de Diseño
- [x] Enrutamiento por URL independiente en cada sección administrativa:
  - `/admin` (Menú Principal / Hub)
  - `/admin/facturacion` (Facturación Rápida)
  - `/admin/pedidos` (Cola de Pedidos & Alisto QR)
  - `/admin/inventario` (Inventario & Etiquetas QR)
  - `/admin/caja` (Caja & Reportería)
  - `/admin/talleres` (Talleres & Alumnos)
  Sincronización bidireccional con historial del navegador y recargas directas con soporte SPA.
- [x] Rediseño ultra-compacto del Menú Hub en [`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx): Eliminadas las descripciones largas y botones redundantes; cajitas táctiles estilizadas (`grid-cols-5` en desktop) con iconos profesionales en gradiente pastel, títulos concisos y badges en una sola pantalla sin necesidad de scroll.
- [x] Modal discreto de Personalización Visual ([`AdminDesignSettingsModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminDesignSettingsModal.tsx)): Retiradas las dos cajas gigantes de tipografía y color de la pantalla principal, reemplazándolas por un botón compacto `🎨 Diseño & Letra` en el encabezado de [`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx).

### Versión 1.12.0 - Reducción del 50% de la Barra Superior de Navegación (Navbar Slim)
- [x] Reducción de la altura total de la barra de navegación de `h-20` (80px) a `h-11 sm:h-12` (44px-48px), reduciendo exactamente un 50% el espacio vertical ocupado.
- [x] Pastilla de enlaces (`Inicio`, `Talleres`, `Tienda`) compactada a `p-0.5` con botones de `px-3 py-1 text-xs`.
- [x] Dimensiones de isotipo y logotipo optimizadas en [`BrandLogo.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/BrandLogo.tsx) (`size="sm"` con `w-7 h-7 sm:w-8 sm:h-8`).
- [x] Botones de redes sociales y carrito redimensionados para una alineación equilibrada y sin desperdicio de pantalla.

### Versión 1.11.0 - Selector Global de Paleta de Colores en Admin (Moradito & Rosa Vibrante vs Zen Cerámica)
- [x] Selector de Tema de Color interactivo en el encabezado del panel admin ([`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx)):
  1. **Moradito & Rosa Vibrante (Original by.fio):** Fondo lavanda pastel (`#FAF5FF`), morado profundo (`#6B21A8`), cajas blancas con sombras moraditas y acentos en rosa fuerte (`#EC4899`).
  2. **Zen Cerámica & Calma (Slow Space):** Fondo crema cerámico cálido (`#FAF7F2`), blanco perla (`#FDFBF9`), sombras neumórficas suaves y acentos lavanda sutil.
- [x] Sobreescritura dinámica en todo el sitio web mediante `data-color-theme="vibrant|zen"` en el body y reglas en [`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css).
- [x] Adaptación automática de los destellos y texturas ambientales en [`BackgroundDecor.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/BackgroundDecor.tsx).
- [x] Persistencia en `localStorage` (`byfio_color_theme_v1`).

### Versión 1.10.0 - Menú Principal del Panel Admin con Cajitas Grandes Redonditas (Hub Central)
- [x] Nuevo componente [`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx) con 5 cajitas de botones táctiles bien grandes y redonditas (`rounded-[32px]`) en una sola pantalla:
  1. **📦 Cola de Pedidos & Alisto QR** (con contador de pedidos pendientes en vivo).
  2. **🧾 Facturación Rápida** (búsqueda instantánea por # de orden).
  3. **🏷️ Inventario & Etiquetas QR** (con indicador de stock crítico y total de productos).
  4. **💰 Caja & Reportería Diaria** (resumen de ingresos, arqueo y valor de inventario).
  5. **🎓 Talleres & Inscripciones** (seguimiento de alumnos y cupos activos).
- [x] Navegación fluida: al dar clic a cualquier cajita entra a la sección específica. Dentro de la sección se incluye el botón permanente `← Volver al Menú Principal` y pestañas rápidas.
- [x] Árbol de navegación con slashes sincronizado (`by.fio / panel administrativo` y `by.fio / panel administrativo / [sección]`).

### Versión 1.9.0 - Limpieza Visual de Borde Blanco, Eliminación de Logo Redundante & Árbol Compacto sobre Cuadro Difuminado
- [x] Eliminación del borde blanco invasivo en el isotipo y retiro del slogan secundario en el Navbar (`BrandLogo.tsx`), dejando únicamente el isotipo degradado suave y el nombre `by.fio`.
- [x] Retiro del bloque flotante duplicado con borde blanco en el Hero (`HeroDual.tsx`).
- [x] Integración directa de la barra de navegación con slashes (`by.fio / inicio`, `by.fio / tienda`, `by.fio / talleres`) encima del cuadro con difuminado, erradicando el espacio en blanco vacío superior y compactando el diseño.

### Versión 1.8.0 - Selector Global de Tipografía en Panel Admin (Redondita vs Serif vs Combinación)
- [x] Selector tipográfico interactivo en el encabezado del panel admin (`AdminHeader.tsx`):
  1. **Solo Letra Redondita:** Fuerza Fredoka & Quicksand en todos los títulos de la tienda, talleres y home.
  2. **Solo Letra Serif Zen:** Fuerza Cormorant Garamond en todos los títulos para una estética 100% editorial slow space.
  3. **Combinación de Ambas:** Títulos principales en Serif elegante + subtítulos, insignias y botones en letra redondita.
- [x] Persistencia en `localStorage` (`byfio_typography_theme_v1`) y sobreescritura CSS en tiempo real vía `data-font-theme` en el body (`src/index.css`).

### Versión 1.7.0 - Páginas Independientes (/tienda, /talleres), Árbol de Navegación con Slashes, Estilo Zen Neumórfico & TikTok Oficial
- [x] Páginas independientes con enrutamiento de URL real: `/` (Inicio), `/tienda` (Tienda Online) y `/talleres` (Academia). Regla `_redirects` en Cloudflare Pages para SPA.
- [x] Árbol de navegación con división de slashes (`TreeNavigation.tsx`): `by.fio / tienda / [categoría]` y `by.fio / talleres`.
- [x] Rediseño de Tienda (`StorePage.tsx`) con estética Neumórfica / Zen Claymorphism (inspirada en la referencia enviada): tarjetas suaves de doble sombra ("cajitas bonitas"), pastillas de categorías rehundidas/resaltadas, inputs con efecto inset y botones táctiles circulares/pastilla.
- [x] Fondo decorativo cerámico sereno con degradados de luz difusa y textura artesanal (`BackgroundDecor.tsx`).
- [x] Enlace oficial de TikTok integrado en Navbar y Footer: `https://www.tiktok.com/@by_fio/`.

### Versión 1.6.0 - Navbar Limpio con Navegación de Secciones & Acceso Admin Discreto
- [x] Navbar limpio con links de secciones y acceso administrativo por hash route (`#admin`).

### Versión 1.5.0 - Creación de Talleres (CRUD) & Enlaces Compartibles para Redes
- [x] Modal `NewWorkshopModal`: Alta de nuevos talleres con foto, precio, cupos y campos "qué incluye".
- [x] Generación de enlaces directos compartibles con parámetro `?taller=ID` y resalte automático.

### Versión 1.4.0 - Gestión de Inscripciones a Talleres
- [x] Pestaña `Talleres & Inscripciones` en Panel Admin con detalle de inscritos por taller derivado de órdenes.

### Versión 1.3.0 - Identidad de Marca Vectorial Oficial Ultra HD (Trazos Originales)
- [x] Integración de trazos vectoriales SVG oficiales de `by.fio`:
  - Letra "b" y "y" con grosores originales (stroke-width: 50).
  - Corazón celeste central (#9BE4FF) con coordenadas curvas Bézier exactas.
  - Letra "f" e "i" con espaciado original.
  - Estrella amarilla (#FFF07C) inclinada 12° sobre la "i".
  - Fondo degradado lila pastel (#D4AEFA a #E7B8F9) con esquinas redondeadas.
- [x] Favicon oficial y archivo vectorial standalone `/assets/logo-byfio.svg`.
- [x] Botones de llamada a la acción con gradiente oficial de marca (#A855F7 a #EC4899).
- [x] Actualización de la paleta extendida en Tailwind CSS (`fio-brand`, `fio-dark`, `fio-blue`, `fio-yellow`).

### Versión 1.2.0 - Facturación Rápida por Número de Orden & Reportería de Caja
- [x] Módulo de Facturación Rápida (`QuickBillingSection`): Búsqueda instantánea por número de orden (#FIO-1001 / 1001) que jala automáticamente todos los datos del cliente, productos y desglose financiero.
- [x] Módulo de Registro de Caja & Reportería (`CashRegisterReports`): Ventas del día, ganancias netas estimadas (Ventas - Costos de insumos), pedidos atendidos en la semana y pedidos pendientes de despacho.
- [x] Desglose de canales de cobro: Ventas totales vía SINPE Móvil (6400-4640) vs Transferencias bancarias.
- [x] Acta de Cierre de Caja Diario (`DailyClosingModal`): Comprobante oficial imprimible y exportable con botón de envío directo a WhatsApp.
- [x] Barra de Pestañas de Navegación del Panel Admin (`AdminTabs`): Pestañas dedicadas para Pedidos & Alisto QR, Facturación Rápida, Inventario y Caja & Reportes.

### Versión 1.1.0 - Módulo de Alta de Productos & Filtros de Categoría en Inventario
- [x] Botón de alta prominente `+ Agregar Producto al Inventario` en la tabla de control WMS.
- [x] Modal completo `NewProductModal` con campos completos y autogenerador de SKU.
- [x] Barra de Filtros de Categorías dinámicas en la tabla de inventario.
- [x] Realce visual del botón `Iniciar Alisto con Escáner QR`.

### Versión 1.0.0 - Lanzamiento Inicial E-commerce & WMS Picking QR
- [x] Identidad de Marca `by.fio` y selector dual Tienda / Admin WMS.
- [x] Mascota animada con video oficial (`ESTRELLA BYFIO.mp4`).
- [x] Catálogo de 5 Talleres Creativos oficiales y Tienda con stock en tiempo real.
- [x] Checkout SINPE Móvil y ordenes FIFO.
- [x] Alisto guiado paso a paso con escaneo QR y sonidos Web Audio API.
