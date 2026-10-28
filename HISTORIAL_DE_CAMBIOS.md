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
