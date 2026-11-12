## [v4.19.124] - 2026-11-12

### 📱 Detección de Dispositivo, Modelo, IP y Mini Dashboard de Métricas por Provincia
- **Auditoría de Registro Real en Cloudflare D1 ([`registered-users.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/registered-users.ts), [`deviceDetection.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/deviceDetection.ts), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx))**:
  - Detección automática en registro web de tipo de dispositivo (`pc` vs `mobile` / `tablet`), modelo exacto del equipo (iPhone, Android, Windows, Mac) e IP de conexión real (`cf-connecting-ip` / `x-real-ip`) guardados directamente en Cloudflare D1 (`site_metrics` id `app_registered_users`).
  - Incorporado selector de las 7 provincias de Costa Rica en el formulario de registro en 3 pasos ([`ThreeStepRegisterForm.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/ThreeStepRegisterForm.tsx)).
- **Segmentación por Provincias y Mini Dashboard ([`RegisteredClientsList.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/RegisteredClientsList.tsx), [`UserMetricsDashboardModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/UserMetricsDashboardModal.tsx))**:
  - Agregado filtro horizontal por las 7 provincias (San José, Alajuela, Cartago, Heredia, Guanacaste, Puntarenas, Limón) con insignias dinámicas del total de usuarios registrados en cada una.
  - Indicador numérico principal: `Total de usuarios: X`.
  - Nuevo botón interactivo **Métricas de usuarios** que abre un mini dashboard con gráficos de barras porcentuales por provincia, desglose de Celulares vs Computadoras, modelos más frecuentes e IPs registradas.
  - Actualizado Service Worker a `byfio-pwa-v4.19.124`.

---

## [v4.19.123] - 2026-11-12

### 🌐 Actualización Integral al Nuevo Dominio Oficial `https://byfiocr.com`
- **Migración de Dominio en Metadatos y Redes Sociales ([index.html](file:///C:/Users/Juan/byfio/index.html))**:
  - Actualizadas las etiquetas Open Graph (`og:url`, `og:image`, `og:image:secure_url`) y Twitter Card (`twitter:image`) para que al compartir en WhatsApp, Facebook, Instagram y Telegram aparezca el nuevo dominio oficial con marca propia `https://byfiocr.com` junto con su imagen de portada.
- **Documentos Comerciales y Facturación ([InvoiceModal.tsx](file:///C:/Users/Juan/byfio/src/components/admin/InvoiceModal.tsx), [SupplierOrderModal.tsx](file:///C:/Users/Juan/byfio/src/components/admin/SupplierOrderModal.tsx))**:
  - En las facturas para clientes y requisiciones para proveedores se muestra ahora `Tienda: byfiocr.com`.
- **PWA Manager y Códigos QR ([PwaManagerModal.tsx](file:///C:/Users/Juan/byfio/src/components/admin/PwaManagerModal.tsx))**:
  - El generador de enlaces de instalación y códigos QR para colaboradores y clientes ahora apunta a `https://byfiocr.com`.
- **Métricas y Enlaces de Campaña ([MetricsPage.tsx](file:///C:/Users/Juan/byfio/src/components/admin/MetricsPage.tsx))**:
  - Generación de links de referidos y campañas formateados como `https://byfiocr.com/?ref=codigo`.
- **Recordatorios, Notificaciones y Webhooks ([workshop-waitlist.ts](file:///C:/Users/Juan/byfio/functions/api/workshop-waitlist.ts), [layawayReminderService.ts](file:///C:/Users/Juan/byfio/src/services/layawayReminderService.ts), [seedData.ts](file:///C:/Users/Juan/byfio/src/utils/seedData.ts))**:
  - Correos de lista de espera emitidos con remitente `@byfiocr.com` y webhook SINPE enrutado a `https://byfiocr.com/api/sinpe-webhook`.
- **Skills y Protocolos de Despliegue ([SKILL.md](file:///C:/Users/Juan/byfio/.agents/skills/deploy-cloudflare-byfio/SKILL.md), [GEMINI.md](file:///C:/Users/Juan/byfio/GEMINI.md))**:
  - Protocolo oficial de verificación apuntando al dominio en producción `https://byfiocr.com`.
  - Actualizado el Service Worker a `byfio-pwa-v4.19.123`.

---

## [v4.19.122] - 2026-11-12

### 👤 Fecha, Hora y Usuario Creador en Ficha de Clientes
- **Registro y Auditoría de Clientes ([CustomersSection.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/CustomersSection.tsx), [QuickBillingSection.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/QuickBillingSection.tsx), [AppContext.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [types/index.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/types/index.ts))**:
  - Incorporada la visualización obligatoria de Fecha y Hora de Creación (`createdAt`) y Usuario Creador (`createdBy`) en la ficha de registrar nuevo cliente y editar cliente existente.
  - El campo "Creado por" se pre-rellena automáticamente con el perfil del usuario activo en sesión (`currentUser?.name || 'Administración'`) y permite asignación o ajuste cuando sea necesario.
  - Agregados los metadatos de creación al pie de cada tarjeta en el Directorio de Clientes y en el directorio de Facturación Rápida POS.
  - Sincronización automática de registros web con etiqueta `Registro Web (Cliente)`.
  - Actualizado el Service Worker a `byfio-pwa-v4.19.122`.

---

## [v4.19.122] - 2026-11-12

### 👥 Pestañas Duales en Perfiles de Usuario: Colaboradores y Clientes Registrados
- **Selector Dual y Directorio de Clientes Web ([UserProfilesSection.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/UserProfilesSection.tsx), [RegisteredClientsList.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/RegisteredClientsList.tsx))**:
  - Incorporado selector superior de pestañas con dos botones interactivos: **Usuarios Colaboradores** y **Usuarios Clientes** con badges dinámicos de cantidad de usuarios.
  - La sección 'Usuarios Colaboradores' mantiene el panel de perfiles con código PIN de 4 dígitos y matriz de permisos por módulos.
  - La sección 'Usuarios Clientes' despliega el directorio de clientes registrados en la plataforma web, detallando fecha y hora de registro, nombre completo, correo, teléfono con enlace directo a WhatsApp, cédula/identificación, provincia detectada, dirección exacta y enlace a Google Maps cuando hay coordenadas registradas.
  - Agregado buscador en tiempo real por nombre, correo, cédula, teléfono o provincia, y botón de actualización/sincronización con Cloudflare D1 (`/api/registered-users`).
  - Actualizado Service Worker a `byfio-pwa-v4.19.122`.

---

## [v4.19.121] - 2026-11-12

### 🌐 Vinculación y Activación del Dominio Personalizado `byfiocr.com`
- **Conexión de Dominio Real y Enrutamiento Cloudflare ([GEMINI.md](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/GEMINI.md), [index.html](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/index.html))**:
  - Asociado el dominio personalizado `byfiocr.com` y su subdominio `www.byfiocr.com` al proyecto de Cloudflare Pages `byfiocr`.
  - Creados y propagados los registros CNAME en la zona DNS `byfiocr.com` de la cuenta Cloudflare correspondiente con proxy activo y certificado SSL automático emitido por Google Trust Services.
  - Actualizados los metadatos de Open Graph y Twitter Cards en `index.html` hacia el dominio canónico de producción `https://byfiocr.com`.

---

## [v4.19.120] - 2026-11-12

### ðŸŽ¨ Paleta Celeste y Lila Pastel para Botones de Inventario
- **DiferenciaciÃ³n Visual en Toma de Inventario ([InventoryShelvesView.tsx](file:///C:/Users/Juan/byfio/src/components/inventory/InventoryShelvesView.tsx), [InventoryAdminBanner.tsx](file:///C:/Users/Juan/byfio/src/components/inventory/InventoryAdminBanner.tsx), [InventoryAdjustmentsView.tsx](file:///C:/Users/Juan/byfio/src/components/inventory/InventoryAdjustmentsView.tsx))**:
  - El botÃ³n 'Empezar Inventario' (estantes pendientes) ahora luce un suave y elegante **Lila Pastel** sÃ³lido (#C084FC).
  - El botÃ³n 'Continuar Inventario' (estantes en proceso) ahora luce un fresco y visible **Celeste Pastel** sÃ³lido (#38BDF8).
  - Erradicados completamente el rosado y amarillo de estos botones e insignias.
  - Actualizado el Service Worker a yfio-pwa-v4.19.120.

---

## [v4.19.119] - 2026-11-12

### ðŸŽ¨ Botones de Inventario en Colores Pastel TemÃ¡ticos (Sin Degradado)
- **Estilos Pastel en Toma de Inventario ([InventoryShelvesView.tsx](file:///C:/Users/Juan/byfio/src/components/inventory/InventoryShelvesView.tsx), [InventoryAdminBanner.tsx](file:///C:/Users/Juan/byfio/src/components/inventory/InventoryAdminBanner.tsx), [InventoryAdjustmentsView.tsx](file:///C:/Users/Juan/byfio/src/components/inventory/InventoryAdjustmentsView.tsx))**:
  - Sustituidos los degradados morado/fucsia oscuros de los botones de acciÃ³n por colores pastel sÃ³lidos acordes a la temÃ¡tica de by.fio.
  - El botÃ³n 'Empezar Inventario' ahora utiliza el color rosa pastel sÃ³lido de la pÃ¡gina (#F472B6), limpio y sin degradado.
  - Cuando el estante estÃ¡ 'En Proceso', el botÃ³n muestra 'Continuar Inventario' en Ã¡mbar pastel suave (#FBBF24), y cuando estÃ¡ completado muestra verde esmeralda pastel suave (#10B981).
  - Actualizado el Service Worker a yfio-pwa-v4.19.119.

---

## [v4.19.118] - 2026-11-12

### ðŸ§¹ Limpieza de Barra Superior (Eliminado BotÃ³n MenÃº Redundante)
- **RemociÃ³n de BotÃ³n MenÃº en Navbar ([Navbar.tsx](file:///C:/Users/Juan/byfio/src/components/common/Navbar.tsx))**:
  - Se eliminÃ³ el botÃ³n 'MenÃº' con degradado morado/rosa ubicado en la barra superior entre el selector de tema y el avatar de usuario.
  - Mejora la limpieza visual en dispositivos mÃ³viles y de escritorio, optimizando el espacio del encabezado.
  - Actualizado el Service Worker a yfio-pwa-v4.19.118.

---

## [v4.19.117] - 2026-11-12

### ðŸ“± Persistencia Total de Barra Inferior PWA y Visibilidad de Botones en Inventario
- **Barra Inferior Persistente de 5 Botones ([AdminMobileDock.tsx](file:///C:/Users/Juan/byfio/src/components/admin/AdminMobileDock.tsx), [InventoryAppPage.tsx](file:///C:/Users/Juan/byfio/src/components/inventory/InventoryAppPage.tsx), [MobileOrdersView.tsx](file:///C:/Users/Juan/byfio/src/components/mobile/MobileOrdersView.tsx))**:
  - La barra tÃ¡ctil inferior ahora mantiene fijos, uniformes y consistentes los 5 botones principales: Inicio, Pedidos, Cobrar, Agenda e Inventario en todas las pantallas de la PWA.
  - El botÃ³n Inventario navega de forma directa a la pestaÃ±a de administraciÃ³n (dminTab = 'inventory'), manteniÃ©ndose dentro de la experiencia PWA sin redirecciones ni pÃ©rdidas de navegaciÃ³n.
  - Integrada la barra tÃ¡ctil fija inferior dentro de InventoryAppPage para que nunca desaparezca al gestionar inventarios.
- **Ajuste de Cabecera Superior y Botones AtrÃ¡s / Salir ([InventoryAppPage.tsx](file:///C:/Users/Juan/byfio/src/components/inventory/InventoryAppPage.tsx))**:
  - AÃ±adido espaciado seguro safe-area-inset-top con margen extra de holgura y fondo blanco nÃ­tido sÃ³lido a la cabecera de inventario.
  - Los botones de AtrÃ¡s (arriba a la izquierda) y Salir (arriba a la derecha) ahora descienden por debajo del notch y la barra de estado con etiquetas de texto visibles y bordes nÃ­tidos sin perderse en difuminados.
- **SupresiÃ³n de la Compuerta de Entrada para Administradores ([CollaboratorPwaShell.tsx](file:///C:/Users/Juan/byfio/src/apps/collaborator/CollaboratorPwaShell.tsx))**:
  - Bloqueada la apariciÃ³n de la ventana modal 'Tienda vs Entrar a pedidos' cuando el usuario es administrador o colaborador logueado, garantizando navegaciÃ³n fluida.
  - Actualizado el Service Worker a yfio-pwa-v4.19.117.

---

## [v4.19.116] - 2026-11-12

### ðŸ”” Alertas y Notificaciones Exclusivas para Pedidos en LÃ­nea (Silenciada FacturaciÃ³n RÃ¡pida POS)
- **Silenciamiento de Ventas Presenciales POS ([AppContext.tsx](file:///C:/Users/Juan/byfio/src/context/AppContext.tsx), [NewOrderStarAlert.tsx](file:///C:/Users/Juan/byfio/src/components/common/NewOrderStarAlert.tsx), [orders.ts](file:///C:/Users/Juan/byfio/functions/api/orders.ts), [index.ts](file:///C:/Users/Juan/byfio/src/types/index.ts))**:
  - En createDirectInvoiceOrder, se suprimiÃ³ la activaciÃ³n de showNewOrderAlert (modal de la estrellita) y el sonido chime de nuevo pedido al cobrar ventas presenciales en mostrador por FacturaciÃ³n RÃ¡pida POS (efectivo o SINPE).
  - Se aÃ±adiÃ³ la propiedad isDirectInvoice: true a las Ã³rdenes de mostrador para que el proceso de sincronizaciÃ³n en segundo plano (checkAndNotifyNewOrders) no dispare alertas en otras pantallas del panel.
  - Las compras de clientes en lÃ­nea (tienda online, talleres y apartados) mantienen al 100% sus alertas visuales, animaciones de estrellita y sonidos chime habituales.
  - Actualizado el Service Worker a yfio-pwa-v4.19.116.

---

## [v4.19.112] - 2026-11-11

### ðŸ§¾ Historial Diario en Lista para FacturaciÃ³n RÃ¡pida POS
- **Lista de Ventas del DÃ­a ([`FastPosSalesHistoryList.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/FastPosSalesHistoryList.tsx), [`FastPosBillingPanel.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/FastPosBillingPanel.tsx), [`orders.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/orders.ts))**:
  - Agregada vista en lista debajo de FacturaciÃ³n RÃ¡pida POS mostrando las ventas del dÃ­a realizadas por POS rÃ¡pido (con resumen de Efectivo, SINPE, Total del DÃ­a, unidades, hora, detalle de productos y acceso directo al comprobante).
  - Etiquetado persistente `'FacturaciÃ³n RÃ¡pida POS'` en SQLite Cloudflare D1 (`notes` / `orderTitle`) y filtro por fecha local con valor predeterminado al dÃ­a actual (`Hoy`).
  - Actualizado el Service Worker a `byfio-pwa-v4.19.112`.

---

## [v4.19.111] - 2026-11-11

### ðŸ—„ï¸ ConexiÃ³n Real a Base de Datos D1 para Talleres (Rebaja AtÃ³mica de Cupos) y SincronizaciÃ³n Global Web
- **Talleres Conectados en Tiempo Real a Cloudflare D1 ([`functions/api/workshops.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/workshops.ts), [`functions/api/orders.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/orders.ts), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`WorkshopDetailPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/WorkshopDetailPage.tsx), [`WorkshopsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/WorkshopsPage.tsx))**:
  - Agregado endpoint atÃ³mico `PATCH /api/workshops` para descontar o restaurar `spots_available` directo en SQLite (`MAX(0, spots_available - ?)`).
  - `POST /api/orders` ahora descuenta atÃ³micamente los cupos de talleres nuevos en D1 (con protecciÃ³n anti-doble cobro) y `DELETE /api/orders` restaura cupos si se elimina una orden activa no entregada.
  - Eliminada la autorecuperaciÃ³n automÃ¡tica en `WorkshopsPage` que podÃ­a reiniciar talleres al cargar, agregada validaciÃ³n de cupo antes de reservar en `WorkshopDetailPage`, y blindado `AppContext` (`bookWorkshopDirect`, `createOrder`, `registerSinpeTransaction`, `updateWorkshop`, `deleteOrder`) con protecciÃ³n anti-rebote (`lastLocalWorkshopUpdateRef`).
- **SincronizaciÃ³n Global Completa vÃ­a `/api/store-config` ([`functions/api/store-config.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/store-config.ts), [`storeConfigSync.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/storeConfigSync.ts), [`NewProductModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/NewProductModal.tsx), [`InventorySweepProductPanel.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/inventory/InventorySweepProductPanel.tsx), [`AssignSupplierModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AssignSupplierModal.tsx), [`inventoryShelves.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/inventoryShelves.ts), [`CalendarAgendaView.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/agenda/CalendarAgendaView.tsx))**:
  - Conectados a D1 (`site_metrics`) los clientes manuales POS/Admin (`customers`), campos personalizados (`customerFields`), precios (`pricingData`), configuraciÃ³n SINPE (`sinpeSettings`), reportes de inventario faltante (`missingInventoryReports`), modo de inventario (`inventoryMode`), diseÃ±o global (`siteDesignSettings`), taxonomÃ­as personalizadas del catÃ¡logo (categorÃ­as, ubicaciones, proveedores, estantes extra) y bloqueos de agenda.
  - Actualizado el Service Worker a `byfio-pwa-v4.19.111`.

---

## [v4.19.110] - 2026-11-11

### âš¡ FacturaciÃ³n RÃ¡pida POS y PWA (Escaneo / BÃºsqueda + Pago Directo Efectivo / SINPE)
- **MÃ³dulo POS de FacturaciÃ³n RÃ¡pida ([`FastPosBillingPanel.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/FastPosBillingPanel.tsx), [`QuickBillingSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/QuickBillingSection.tsx))**:
  - Agregada pestaÃ±a prioritaria `FacturaciÃ³n RÃ¡pida` en POS/PWA manteniendo intactos `Crear Factura Directa`, `Facturar Pedido Existente` y `Ficha de Clientes`.
  - Barra Ãºnica de bÃºsqueda por nombre o escaneo de cÃ³digo de barras/QR (`CameraBarcodeScannerModal` o lector USB + `Enter`), sin grilla de productos frecuentes ni pasos intermedios.
  - Carrito Ã¡gil multiproducto (`+`/`-`/quitar) con botones directos **`Pago en Efectivo`** y **`Pago SINPE`**.
  - Actualizado Service Worker a `byfio-pwa-v4.19.110`.

---

## [v4.19.108] - 2026-11-11

### â¤ï¸ BotÃ³n Me Gusta Exclusivo para Usuarios Registrados, RÃ³tulo Estrellita y Contador Superior Admin
- **Me Gusta Verificado y Toggle por Usuario Registrado ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx), [`BrandLogo.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/BrandLogo.tsx), [`metricsTracker.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/services/metricsTracker.ts), [`metrics.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/metrics.ts), [`types/index.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/types/index.ts))**:
  - Solo usuarios registrados/autenticados (`currentUser`) pueden registrar o alternar `Me Gusta` por secciÃ³n, persistido en D1 (`registeredLikes` en `global_metrics`).
- **RÃ³tulo de Estrellita para No Registrados ([`LikeRegisterStarModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LikeRegisterStarModal.tsx))**:
  - Al pulsar `Me Gusta` sin registro/sesiÃ³n, emerge el rÃ³tulo animado con la estrellita invitando a registrarse con el mensaje oficial y acceso directo al registro.
- **Contador en Parte Superior del Admin y Polling Inteligente ([`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx), [`RegisteredLikesModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/RegisteredLikesModal.tsx), [`useRegisteredLikes.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/hooks/useRegisteredLikes.ts), [`useSmartPolling.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/hooks/useSmartPolling.ts))**:
  - Agregado indicador superior en barra de Admin/Superadmin y tarjeta superior en `AdminHeader` con total de Me Gusta de usuarios registrados y modal de detalle.
  - Actualizado el Service Worker a `byfio-pwa-v4.19.108`.

---

## [v4.19.107] - 2026-11-11

### ðŸŽ¯ Selector Compacto de Proveedor y OptimizaciÃ³n de Espacio en Ingreso de Pedido
- **Selector `<select>` y Formulario Compacto ([`SupplierInvoiceHeaderStep.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierInvoiceHeaderStep.tsx), [`SupplierInvoiceIntakeView.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierInvoiceIntakeView.tsx))**:
  - Reemplazada la grilla de tarjetas grandes de proveedores por un selector desplegable compacto (`<select>`) con botÃ³n inline `+ Nuevo proveedor`, y contenido ajustado a ancho compacto (`max-w-4xl`) con campos optimizados.
  - Actualizado el Service Worker a `byfio-pwa-v4.19.107`.

---

## [v4.19.106] - 2026-11-11

### ðŸšš BotÃ³n Pedidos de Clientes & Flujo Dual de Proveedores (Ingreso de Factura y Productos)
- **Renombre a "Pedidos de Clientes" ([`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx), [`AdminMobileDock.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminMobileDock.tsx))**:
  - Actualizado el botÃ³n de pedidos del panel y dock mÃ³vil de `Pedidos` a `Pedidos de Clientes`.
- **MenÃº Dual de Proveedores e Ingreso de Pedido/Factura ([`SuppliersOrdersSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SuppliersOrdersSection.tsx), [`SupplierInvoiceIntakeView.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierInvoiceIntakeView.tsx), [`SupplierInvoiceHeaderStep.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierInvoiceHeaderStep.tsx), [`SupplierInvoiceProductsStep.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierInvoiceProductsStep.tsx))**:
  - Al ingresar a Proveedores se muestran los dos botones principales: **`Pedidos a Proveedores`** e **`Ingresar pedido de Proveedor`**.
  - En el ingreso de factura de proveedor: permite crear el proveedor inline (nombre, cÃ©dula jurÃ­dica opcional, telÃ©fono, correo) o seleccionar uno existente solicitando `# pedido`, `# factura`, `fecha de ingreso` (hoy por defecto editable), `monto de factura`, `descuento`, `IVA`, `subtotal`, `otros` y `total general`, luego presionar **Aceptar** para buscar productos manualmente, indicar cantidades e ingresar stock al inventario y a D1 ([`supplier-orders.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/supplier-orders.ts), [`types/index.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/types/index.ts), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)).
  - Actualizado el Service Worker a `byfio-pwa-v4.19.106`.

---

## [v4.19.105] - 2026-11-11

### ðŸ§© SeparaciÃ³n Modular y Aislamiento de CÃ³digo/SesiÃ³n/Tema (Web PÃºblica vs PWA Colaborador vs PWA Admin)
- **Aislamiento de Scope, SesiÃ³n y Tema ([`appScope.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/appScope.ts), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`routeHelpers.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/routeHelpers.ts))**:
  - Claves de sesiÃ³n `localStorage` independientes por app (`byfio_auth_user_web_v1`, `byfio_auth_user_admin_v1`, `byfio_auth_user_collab_v1`) con migraciÃ³n segura y cierre de sesiÃ³n aislado sin cerrar sesiÃ³n en las demÃ¡s PWAs.
  - RestauraciÃ³n de `sessionStorage` en `/` restringida a rutas pÃºblicas de la Web; `isCollaboratorPwaContext()` blindado contra activaciÃ³n en `/` y `/admin*`; `viewMode` acotado por scope y tema `.dark`/`data-font-theme` aislado en PWA Colaborador preservando Ãºnicamente la sincronizaciÃ³n compartida de datos D1/`BroadcastChannel`.
- **Shells, Bundles y Manifiestos PWA Separados ([`WebShell.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/apps/web/WebShell.tsx), [`AdminPwaShell.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/apps/admin/AdminPwaShell.tsx), [`CollaboratorPwaShell.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/apps/collaborator/CollaboratorPwaShell.tsx), [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`vite.config.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/vite.config.ts))**:
  - Enrutador raÃ­z liviano (`React.lazy`) y divisiÃ³n explÃ­cita en chunks (`app-web`, `app-admin`, `app-collaborator`, `app-data`) mÃ¡s 3 manifiestos independientes ([`manifest.webmanifest`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/manifest.webmanifest), [`manifest-admin.webmanifest`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/manifest-admin.webmanifest), [`manifest-colaborador.webmanifest`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/manifest-colaborador.webmanifest)) enlazados dinÃ¡micamente desde [`index.html`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/index.html).
  - Actualizado el Service Worker a `byfio-pwa-v4.19.105`.

---

## [v4.19.102] - 2026-11-11

### ðŸ† Directorio de Clientes: Historial de Compras, Etiquetas VIP y Filtro de Mayores Compradores
- **LÃ³gica & EstadÃ­sticas por Cliente ([`customerPurchases.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/customerPurchases.ts), [`customer-settings.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/customer-settings.ts))**:
  - CÃ¡lculo de compras por cliente empatando telÃ©fono/correo/nombre y deduplicando apartados ya liquidados; persistencia del umbral mÃ­nimo de compras VIP configurable por administrador en `localStorage` y D1 (`site_metrics`).
- **Historial Detallado y Ranking Visual ([`CustomerPurchaseHistoryModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/CustomerPurchaseHistoryModal.tsx), [`CustomersSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/CustomersSection.tsx))**:
  - Agregado modal de historial completo de compras por cliente (resumen KPI, listado cronolÃ³gico de pedidos/apartados e Ã­tems, y acceso directo a comprobante/factura).
  - Agregado selector de meta mÃ­nima para **Cliente VIP** (`â˜… VIP`), etiquetado de mayores compradores (`Top #1..#3`), filtros `Todos` / `MÃ¡s han comprado` / `Solo VIP` y ordenamiento de **Mayores compras â†’ Menores** y **Menores compras â†’ Mayores**.
  - Actualizado el Service Worker a `byfio-pwa-v4.19.102`.

---

## [v4.19.101] - 2026-11-11

### ðŸ—‘ï¸ Retiro del MÃ³dulo "Precios & Stickers" del Panel Admin
- **Panel Admin (`AdminHubMenu.tsx`, `AdminTabs.tsx`, `App.tsx`, `routeHelpers.ts`, `UserProfilesSection.tsx`, `MetricsPage.tsx`):**
  - Eliminada la tarjeta/mÃ³dulo `Precios & Stickers` (`pricing`) del MenÃº Principal de AdministraciÃ³n (`AdminHubMenu`), de `AdminTabType`, de la ruta `/admin/precios`, de `SECTION_METADATA` (`admin-pricing`) y de la matriz de permisos de perfiles de usuario (`UserProfilesSection.tsx`), ajustando `allChecked` y `grantedCount` al listado visible.
  - Actualizado el Service Worker a `byfio-pwa-v4.19.101`.

---

## [v4.19.100] - 2026-11-11

### ðŸ§¾ Clientes Registrados en la PÃ¡gina Integrados a FacturaciÃ³n POS
- **SincronizaciÃ³n AutomÃ¡tica Web / D1 -> Directorio POS ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx))**:
  - Agregada la fusiÃ³n deduplicada [`mergeRegisteredUsersIntoCustomers`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx) y la acciÃ³n [`syncRegisteredUsers`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx) para integrar cuentas web de `byfio_registered_users_v1` y Cloudflare D1 (`/api/registered-users`) en `customers` (con id `reg-<correo>`, nombre, telÃ©fono, correo, direcciÃ³n y cÃ©dula), sincronizando tambiÃ©n registros, inicios de sesiÃ³n, actualizaciones de perfil y `BroadcastChannel`.
- **Autocompletado y Ficha de Clientes POS ([`QuickBillingSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/QuickBillingSection.tsx), [`CustomersSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/CustomersSection.tsx))**:
  - Al abrir FacturaciÃ³n POS o Directorio de Clientes se sincronizan las cuentas registradas en D1; el buscador `"Â¿Cliente ya registrado?"` despliega clientes web/POS al enfocar y busca por nombre, telÃ©fono (con o sin guiones), cÃ©dula y correo con insignia `Web` y tolerancia a telÃ©fono vacÃ­o (`Sin telÃ©fono`).
  - Actualizado el Service Worker a `byfio-pwa-v4.19.100`.

---

## [v4.19.99] - 2026-11-11

### ðŸ“¦ MÃ³dulo de Inventario por Barrido con Carga AutomÃ¡tica/Manual y Registro en D1
- **Nuevo MÃ³dulo Inventario por Barrido ([`InventorySweepView.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/inventory/InventorySweepView.tsx), [`InventorySweepProductPanel.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/inventory/InventorySweepProductPanel.tsx), [`InventorySweepHistory.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/inventory/InventorySweepHistory.tsx))**:
  - SelecciÃ³n inicial de estante (`Estante 1..N`) y espera interactiva por escaneo (cÃ¡mara QR/Barras o lector USB) o ingreso manual.
  - DetecciÃ³n automÃ¡tica de productos existentes (ubicaciÃ³n, descripciÃ³n, categorÃ­a, proveedor y cantidad a ingresar, con asignaciÃ³n inmediata de ubicaciÃ³n si faltaba) y creaciÃ³n directa en el barrido cuando el producto aÃºn no existe (ubicaciÃ³n, categorÃ­a, proveedor, descripciÃ³n y cantidad al final).
- **Lotes cada 10 productos (AutomÃ¡tico / Manual), Ãšltimo Producto e Historial con Selector ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`InventoryAppPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/inventory/InventoryAppPage.tsx), [`InventoryAdminBanner.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/inventory/InventoryAdminBanner.tsx), [`inventory-adjustments.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/inventory-adjustments.ts), [`products.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/products.ts))**:
  - Persistencia en D1 (`app_inventory_sweep_entries`, `app_sweep_load_mode` y columna `supplier` en `products`).
  - Selector de modo **AutomÃ¡tico** (carga al inventario real cada 10 productos guardados) o **Manual** (muestra botÃ³n destacado `Cargar al Inventario` cada 10 productos).
  - Banner permanente del Ãºltimo producto registrado e historial detallado por usuario, fecha, hora y selector de estado (`Guardado` / `Cargado Inv`).
  - Actualizado el Service Worker a `byfio-pwa-v4.19.99`.

---

## [v4.19.98] - 2026-11-11

### ðŸ·ï¸ Registro AutomÃ¡tico de "Ventas de apartados" al Completar el Ãšltimo Pago
- **GeneraciÃ³n AutomÃ¡tica en Fecha de LiquidaciÃ³n ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`orders.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/orders.ts), [`types/index.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/types/index.ts))**:
  - Al registrar el Ãºltimo abono que lleva el saldo pendiente a `â‚¡0`, [`addLayawayPayment`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx) genera automÃ¡ticamente la venta del producto apartado fechada ese mismo dÃ­a, con categorÃ­a **`Ventas de apartados`** e idempotencia anti-duplicados persistida en `localStorage` y D1 (`items_json`).
- **ExclusiÃ³n de Reservas Sin Liquidar & Aislamiento ([`layaway.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/layaway.ts), [`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx), [`MyAccountPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/MyAccountPage.tsx), [`MyAccountModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/MyAccountModal.tsx))**:
  - Las reservas de apartados pendientes/activos no se contabilizan en Caja, Historial de Ventas ni Cierre Diario hasta su liquidaciÃ³n final, y las ventas generadas no ingresan a cola de alisto QR ni duplican tarjetas de cliente.
- **Desglose en Ventas del DÃ­a ([`CashRegisterReports.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/CashRegisterReports.tsx), [`SalesHistorySection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SalesHistorySection.tsx), [`DailyClosingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/DailyClosingModal.tsx), [`AdminLayawaysSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminLayawaysSection.tsx), [`InvoiceModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InvoiceModal.tsx))**:
  - Agregada la secciÃ³n/tarjeta **`Ventas de apartados`** en Caja & ReporterÃ­a, filtro e insignias en Historial de Ventas + CSV, lÃ­nea oficial en Acta/WhatsApp/Historial de Cierre Diario y botÃ³n de liquidaciÃ³n total en GestiÃ³n de Apartados.
  - Actualizado el Service Worker a `byfio-pwa-v4.19.98`.

---

## [v4.19.97] - 2026-11-11

### ðŸ·ï¸ Prefijo Interno `bf-`, QR MÃ¡s Grande y Emblema Blanco en Etiquetas
- **CÃ³digo Interno de Producto (`formatInternalProductCode`, D1 y EscÃ¡neres):**
  - Cambiado el prefijo de cÃ³digo interno para barras y QR de `FIO-` a `bf-` (en minÃºscula, compatible con Code 128 Set B) en [`formatters.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/formatters.ts), [`Barcode128.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Barcode128.tsx), [`NewProductModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/NewProductModal.tsx), [`seedData.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/seedData.ts), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx) y [`functions/api/products.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/products.ts) (auto-migraciÃ³n SQL en D1 y compatibilidad retroactiva de escaneo en [`PickingLiveBarcodeScanner.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/PickingLiveBarcodeScanner.tsx), [`InventoryCountSession.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/inventory/InventoryCountSession.tsx) y [`MobileOrdersView.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/mobile/MobileOrdersView.tsx)).
- **QR MÃ¡s Grande y Letras Blancas (`ProductBarcodeLabel.tsx`, `QrLabelModal.tsx`, `InventoryChecklistModal.tsx`):**
  - Cambiadas las letras `byfio` dentro del cÃ­rculo lila central del cÃ³digo QR a color blanco (`#FFFFFF`) manteniendo alto contraste sobre lila (`#C084FC`).
  - Ampliado el tamaÃ±o del cÃ³digo QR en etiquetas (`88px` en hoja, `108px` en tarjeta, `200px` en modal QR y `44px` en checklist de inventario).
  - Actualizado el Service Worker a `byfio-pwa-v4.19.97`.

---

## [v4.19.96] - 2026-11-11

### ðŸŽ¨ Banner de GestiÃ³n de Apartados en Lila con Rosado Pastel
- **ActualizaciÃ³n Visual (`AdminLayawaysSection.tsx`):**
  - Cambiado el gradiente del encabezado principal de `GestiÃ³n de Apartados` a tonos lila con rosado pastel (`from-[#E6D4FB] via-[#F3D9FA] to-[#FBD5E8]`) con borde lila suave y tipografÃ­a morado oscuro legible (`text-purple-950`).
  - Actualizado el Service Worker a `byfio-pwa-v4.19.96`.

---

## [v4.19.95] - 2026-11-11

### ðŸ“¦ AplicaciÃ³n PWA Independiente de Inventario por EstanterÃ­as, Ajustes y Reportes
- **SecciÃ³n y BotÃ³n "Inventario" en Mis Productos (`InventoryAdminBanner.tsx` & `InventoryTable.tsx`):**
  - Integrado acceso directo al mÃ³dulo de inventario aislado (`/inventario-app`) y switch administrativo (**PWA Colaborador: Activado / Desactivado**) para habilitar o deshabilitar el acceso en la PWA de los colaboradores en tiempo real.
- **AplicaciÃ³n PWA Aislada de Inventarios (`InventoryAppPage.tsx`):**
  - Acceso independiente mediante PIN para colaboradores/admin y verificaciÃ³n automÃ¡tica de permisos si el administrador desactiva el mÃ³dulo.
  - **Realizar Inventario por EstanterÃ­a (`InventoryShelvesView.tsx` & `InventoryCountSession.tsx`):** Vista visual de estantes ordenados (Estante 1, 2, 3, 4, 5, 6+ y ubicaciones adicionales), selector de estante, indicadores visuales de avance (Pendiente / En Proceso / Inventariado âœ…), conteo fÃ­sico tÃ¡ctil + escÃ¡ner de cÃ¡mara y carga al sistema.
  - **Ajustes de Inventario (`InventoryAdjustmentsView.tsx`):** Ajuste directo de diferencias/mermas con actualizaciÃ³n inmediata en sistema y motivo detallado.
  - **Historial y Reportes (`InventoryHistoryReportsView.tsx`):** Historial cronolÃ³gico con usuario, dÃ­a, fecha, hora y detalle completo producto por producto, con impresiÃ³n/PDF y descarga CSV.
- **Persistencia en D1 (`functions/api/inventory-adjustments.ts` & `AppContext.tsx`):**
  - SincronizaciÃ³n en la nube de ajustes, configuraciÃ³n de acceso colaborador y estado visual de estanterÃ­as.
- **IntegraciÃ³n PWA Colaboradores (`MobileOrdersView.tsx`, `AdminHubMenu.tsx`, `AdminMobileDock.tsx`, `PwaManagerModal.tsx`):**
  - BotÃ³n dinÃ¡mico visible Ãºnicamente cuando el administrador activa la toma de inventario.
  - Actualizado el Service Worker a `byfio-pwa-v4.19.95`.

---

## [v4.19.94] - 2026-11-11

### ðŸŽ¯ CorrecciÃ³n Definitiva del CÃ¡lculo Inmutable en Modal de Abono y Tarjeta de Apartado
- **EliminaciÃ³n del Doble DÃ©bito/CrÃ©dito Reactivo (`LayawayPaymentModal.tsx`):**
  - **Causa RaÃ­z:** Al confirmar un abono, `AppContext` actualizaba inmediatamente el pedido en la base de datos local y reactiva. Cuando React renderizaba el modal de Ã©xito, los nuevos props ya traÃ­an el saldo reducido (ej. â‚¡10 000 en vez de â‚¡15 000). El modal volvÃ­a a restar y sumar el abono (`remainingDebt - amount` y `downPayment + amount`), duplicando el efecto (mostrando errÃ³neamente â‚¡5 000 en saldo pendiente y â‚¡40 000 abonados en vez de â‚¡10 000 y â‚¡35 000).
  - **SoluciÃ³n Robusta con InstantÃ¡nea Inmutable (`completedSummary`):** Se congela una instantÃ¡nea inmutable de los saldos (`paidAmount`, `totalAbonadoAcumulado`, `saldoPendiente`) en el momento exacto en que el usuario presiona el botÃ³n. La pantalla de confirmaciÃ³n exitosa y el mensaje de WhatsApp utilizan esta instantÃ¡nea fiel, garantizando 100% de precisiÃ³n matemÃ¡tica.
  - **Aislamiento del `useEffect`:** El reseteo del modal ahora depende exclusivamente del evento de apertura (`[isOpen]`), evitando que el cambio de saldo posterior a la transacciÃ³n descalibre el estado del modal.
- **UnificaciÃ³n de FÃ³rmulas MatemÃ¡ticas (`LayawayOrderCard.tsx`):**
  - Se unificÃ³ la lÃ³gica de cÃ¡lculo con la de `AdminLayawaysSection.tsx` y `functions/api/orders.ts`:
    - `sumOfAbonos = payments.reduce(...)`
    - `downPayment = payments.length > 0 ? initialCheckoutPayment + sumOfAbonos : ...`
    - `totalAmount = order.layawayTotalAmount > 0 ? ...` (resuelto el bug donde `> downPayment` podÃ­a fallar si se pagaba el 100%).
    - `remainingDebt = Math.max(0, totalAmount - downPayment)`.
  - El historial desplegable de abonos ahora toma la lista consolidada `payments` garantizando total visibilidad de cada abono realizado.

---

## [v4.19.93] - 2026-11-11

### ðŸ”– Notificaciones Adaptativas de Apartados en Modal de la Estrellita y Push Notifications
- **Alerta Visual de la Estrellita Adaptativa (`NewOrderStarAlert.tsx`):**
  - **TÃ­tulo Personalizado para Apartados:** Cuando se genera o sincroniza un apartado, el tÃ­tulo del modal ahora dice exactamente: **"Hemos recibido un nuevo apartado"** (en lugar de "Hemos recibido un nuevo pedido").
  - **PÃ­ldora Distintiva de Apartado:** En lugar de "Pedido #FIO-XXXX" con icono de bolsa de compras, muestra la pÃ­ldora en tono Ã¡mbar suave con el icono de marcador `BookmarkCheck` y el texto **"Apartado #FIO-XXXX"**.
  - **Encabezado TemÃ¡tico:** El subtÃ­tulo superior cambia de "by.fio Notificaciones" a **"by.fio Apartados"** con la estrella dorada.
  - **Limpieza de Prefijo:** Formato limpio y garantizado para evitar dobles `#` (`cleanOrderNumber`).
- **Notificaciones Push y Sonoras Nativas (`pushNotifications.ts`):**
  - TÃ­tulo adaptado a: `ðŸ”– Â¡Nuevo Apartado #FIO-XXXX!`.
  - Mensaje detallado: `Cliente: ... \nTotal Apartado: â‚¡XX XXX\nToca para abrir Apartados.`
  - RedirecciÃ³n con 1 toque directo a la vista de `/apartados`.
- **DetecciÃ³n y Permisos en el Contexto (`AppContext.tsx`):**
  - PropagaciÃ³n de bandera `isLayaway` a travÃ©s de `NewOrderAlertInfo`, `canReceiveOrderNotifications` y todas las emisiones de alerta tanto en creaciÃ³n local como por sincronizaciÃ³n en tiempo real.

---

## [v4.19.92] - 2026-11-11

### ðŸŽ¯ CorrecciÃ³n MatemÃ¡tica en Abonos y RediseÃ±o Ultra Compacto de Fichas de Apartados
- **PrecisiÃ³n MatemÃ¡tica en CÃ¡lculo de Abonos (`AppContext.tsx`, `orders.ts` & `LayawayPaymentModal.tsx`):**
  - Se unificÃ³ la fÃ³rmula matemÃ¡tica de saldos en todo el sistema:
    - **Total Abonado:** Anticipo inicial de checkout (`order.total`) + suma exacta de cada abono registrado en `order.layawayPayments`.
    - **Saldo que Debes:** `Total Contado - Total Abonado`.
  - Se resolviÃ³ la discrepancia de cÃ¡lculo al ingresar montos de abono (ej. deber â‚¡10 000 y al abonar â‚¡2 000 el saldo resultante ahora marca con precisiÃ³n matemÃ¡tica exacta **â‚¡8 000**).
  - SincronizaciÃ³n reactiva con `useEffect` en el modal de abono para reiniciar el monto al abrir y garantizar que la simulaciÃ³n de saldo posterior sea 100% fiel en todo momento.
- **RediseÃ±o Ultra Compacto de Apartados en el Panel Administrativo (`AdminLayawaysSection.tsx`):**
  - **ReducciÃ³n del 75% del espacio vertical:** Se transformÃ³ la tarjeta grande que ocupaba toda la pantalla en una ficha horizontal compacta, moderna y elegante (~75px de alto).
  - **Toda la informaciÃ³n visible a simple vista:**
    - Miniatura del producto, nÃºmero de pedido `#FIO-...` e insignia de estado (`Activo â€¢ 30d` / `Vencido` / `100% Pagado`).
    - Nombre del cliente, telÃ©fono con acceso directo a WhatsApp y nombre del artÃ­culo.
    - PÃ­ldoras financieras compactas: Total de contado, Total abonado a la fecha y Saldo pendiente.
    - Botones de acciÃ³n directos: `[ ðŸ’µ Abonar ]`, `[ ðŸ“± WhatsApp ]`, `[ ðŸ–¨ï¸ Factura ]`.
  - **Detalle Desplegable Opcional:** Al tocar la flecha se despliega suavemente la barra de progreso de tiempo y el historial detallado de abonos sin recargar la pantalla.

---

## [v4.19.91] - 2026-11-11

### ðŸ·ï¸ Sistema Completo de Abonos en LÃ­nea para Clientes y SecciÃ³n Exclusiva de Apartados en el Panel Administrativo
- **BotÃ³n y Modal Interactivo de Abono para Clientes (`LayawayPaymentModal.tsx` & `LayawayOrderCard.tsx`):**
  - Nuevo botÃ³n principal **[ ðŸ’µ Abonar Cuota ]** en la tarjeta de pedidos del cliente en *Mis Pedidos*.
  - Ventana modal interactiva que presenta el saldo pendiente actual y permite elegir el monto a pagar:
    - Botones de selecciÃ³n rÃ¡pida (â‚¡5 000, â‚¡10 000, â‚¡15 000).
    - OpciÃ³n de liquidaciÃ³n total directa (**Liquidar Todo**).
    - Entrada personalizada con simulaciÃ³n en tiempo real del saldo resultante tras el abono.
  - Pasarela multicanal integrada:
    - **SINPE MÃ³vil:** TelÃ©fono oficial 64004640 (Fiorella Barahona) con botÃ³n de copiado rÃ¡pido y campo para ingresar el nÃºmero de comprobante.
    - **Transferencia Bancaria:** Cuentas IBAN de BCR con copiado en un clic y comprobante.
    - **Tarjeta de CrÃ©dito / DÃ©bito:** Con acreditaciÃ³n inmediata.
  - **ActualizaciÃ³n AutomÃ¡tica e InstantÃ¡nea:** Al confirmar el abono, se descuenta de lo adeudado, se suma a lo abonado a la fecha, se emite confeti sonoro y se actualiza en tiempo real en la base de datos remota D1.
  - **Historial Desplegable de Abonos Realizados:** La tarjeta del cliente ahora muestra el desglose cronolÃ³gico de cada pago efectuado con fecha, monto, mÃ©todo y comprobante.
- **ExclusiÃ³n Estricta de la Cola de Pedidos (`OrdersQueue.tsx`):**
  - Los apartados quedan **100% excluidos** de la cola de pedidos regulares de alisto, picking y empaque.
  - Los contadores de la cola de pedidos Ãºnicamente contabilizan pedidos regulares de contado listos para despacho.
- **Nueva SecciÃ³n Exclusiva de "Apartados" en el Panel de AdministraciÃ³n (`AdminLayawaysSection.tsx` & `AdminHubMenu.tsx`):**
  - Nuevo mÃ³dulo administrativo con tarjeta de acceso en el Hub principal e insignia con el contador de apartados activos en vivo.
  - **MÃ©tricas Ejecutivas en Tiempo Real:**
    - Contador de apartados activos.
    - Total recaudado en abonos a la fecha (â‚¡).
    - Saldo global pendiente de cobro en la tienda (â‚¡).
    - Alerta de apartados prÃ³ximos a vencer (â‰¤ 5 dÃ­as).
  - **Buscador y Filtros de Estado:** Activos con saldo, PrÃ³ximos a vencer, Vencidos, 100% Liquidados y Todos.
  - **Ficha Integral por Cliente:** Datos de contacto, botÃ³n directo para llamar o abrir WhatsApp con mensaje de recordatorio prellenado, barra de progreso del plazo e historial detallado de abonos.
  - **Registro de Abonos Manuales:** Permite a la administradora o colaboradores ingresar abonos recibidos en efectivo en el taller o transferencias directas, actualizando el saldo de inmediato.

---

## [v4.19.90] - 2026-11-11

### ðŸ·ï¸ CorrecciÃ³n y ReconstrucciÃ³n Integral de Montos y Saldos de Apartados en Mis Pedidos
- **CorrecciÃ³n de Montos Financieros en Tarjetas de Apartado (`LayawayOrderCard.tsx`):**
  - **Valor del Producto (Precio de Contado):** Se resolviÃ³ el error que mostraba â‚¡10 000 en lugar del precio total (â‚¡45 000). Ahora calcula con mÃ¡xima fidelidad el valor de contado basÃ¡ndose en `layawayTotalAmount`, el catÃ¡logo de productos por SKU/ID o la suma del anticipo y saldo adeudado (`downPayment + remainingDebt`).
  - **Monto Abonado:** Refleja con precisiÃ³n la cuota o anticipo cancelado a la fecha (â‚¡10 000).
  - **Saldo que Debes:** Muestra el monto adeudado exacto pendiente de liquidar (â‚¡35 000) en lugar de â‚¡0.
  - **Estado del Plazo:** Se eliminÃ³ el distintivo errÃ³neo de *"100% Cancelado"* cuando existe saldo adeudado. Ahora muestra claramente *"Apartado Activo (X dÃ­as restantes)"* con su barra de progreso de tiempo y advertencia preventiva de 5 dÃ­as.
  - **Limpieza de Identificador de Pedido:** Se corrigiÃ³ el prefijo para mostrar `Apartado #FIO-1015` en lugar del duplicado `##FIO-1015`.
- **Integridad y Mapeo en API Backend Cloudflare D1 (`functions/api/orders.ts`):**
  - El transformador `mapRowToOrder` ahora extrae y normaliza de forma nativa los atributos de apartados (`layawayTotalAmount`, `layawayDownPaymentAmount`, `layawayRemainingAmount`, `layawayMonths`, `layawayDueDate`, `layawayDaysTotal`) desde el contenido persistido en la base de datos D1.
  - SanitizaciÃ³n en `onRequestPost` para garantizar que los nÃºmeros de orden siempre almacenen un Ãºnico carÃ¡cter `#`.
- **AutocuraciÃ³n en Arranque (`AppContext.tsx`):**
  - La funciÃ³n `sanitizeOrderList` reconstruye automÃ¡ticamente pedidos preexistentes en `localStorage` o memoria, asegurando que cualquier orden de apartado mantenga el total original, saldo adeudado y nÃºmero de pedido saneado.

---

## [v4.19.89] - 2026-11-11

### ðŸ” Persistencia en Cloudflare D1 y SincronizaciÃ³n Remota de Cuentas de Clientes Registrados
- **Nueva API de Base de Datos Cloudflare D1 (`functions/api/registered-users.ts`):**
  - Se creÃ³ el endpoint centralizado en D1 para persistir las cuentas de clientes registrados en la tabla `site_metrics` (`app_registered_users`), evitando la pÃ©rdida de cuentas cuando el usuario cambia de dispositivo, navegador, modo incÃ³gnito o limpia el cachÃ©.
  - MÃ©todos `GET`, `POST` y `PUT` con fusiÃ³n atÃ³mica por correo electrÃ³nico normalizado en minÃºsculas.
- **SincronizaciÃ³n AutomÃ¡tica e Inmediata (`AppContext.tsx`):**
  - Al cargar la aplicaciÃ³n se consultan las cuentas remotas en D1 y se sincronizan con `safeLocalStorage`.
  - Al completar el registro (`registerUser`), se guarda localmente y se transmite en segundo plano a Cloudflare D1 sin demoras.
  - NormalizaciÃ³n defensiva de correos y contraseÃ±as (eliminaciÃ³n de espacios en blanco y caracteres de ancho cero invisibles `\u200B-\u200D\uFEFF`).
- **VerificaciÃ³n AsÃ­ncrona Remota en Inicio de SesiÃ³n (`LoginModal.tsx`):**
  - Si un usuario ingresa sus credenciales en un dispositivo nuevo o pestaÃ±a incÃ³gnita donde aÃºn no se ha descargado el cachÃ© local, el modal consulta de inmediato a la base de datos de Cloudflare D1 en tiempo real.
  - Al validar la cuenta remota, la incorpora a la sesiÃ³n local y permite el ingreso exitoso instantÃ¡neamente sin mostrar *"Credenciales incorrectas"*.
- **Prellenado Inteligente de Correo (`ThreeStepRegisterForm.tsx`):**
  - Guarda automÃ¡ticamente el correo registrado en `byfio_saved_login_email` para facilitar inicios de sesiÃ³n futuros.

---

## [v4.19.88] - 2026-11-11

### âœ¨ Sistema de Apartados DinÃ¡mico, PersonalizaciÃ³n de Abono y Seguimiento con Cuenta Regresiva
- **BotÃ³n Dual de Apartado en Tienda (`StorePage.tsx` y `ProductDetailModal.tsx`):**
  - Los productos configurados para apartado (o categorÃ­a Maquinaria) ahora presentan simultÃ¡neamente el botÃ³n de compra de contado **[ ðŸ›ï¸ Al Carrito ]** y el botÃ³n dorado de reserva **[ ðŸ·ï¸ Apartar ]**.
  - Etiqueta indicativa en la tarjeta de producto que resalta la cuota inicial mÃ­nima configurada (ej. *Aparta con â‚¡9 000*).
- **Modal Interactivo de PersonalizaciÃ³n de Monto de Apartado (`LayawaySelectionModal.tsx`):**
  - Precarga de manera reactiva el monto mÃ­nimo de abono segÃºn la configuraciÃ³n del producto (ej. 20% = â‚¡9 000 sobre una mÃ¡quina de â‚¡45 000).
  - Permite al comprador ingresar cualquier monto mayor deseado (ej. â‚¡10 000, â‚¡15 000, etc.).
  - Recalcula al instante y en tiempo real:
    - Monto pagado hoy.
    - Saldo pendiente que debe (ej. â‚¡45 000 - â‚¡10 000 = â‚¡35 000).
    - Cuotas restantes y monto por cuota.
    - Fecha estimada de vencimiento del plazo.
  - Con un solo clic en *"Apartar y Proceder al Pago"*, redirige directamente a la pasarela de pago (`CheckoutModal.tsx`) con el monto exacto del abono listo para cancelar.
- **Seguimiento en Vivo en "Mi Cuenta" -> "Mis Pedidos" (`LayawayOrderCard.tsx`, `MyAccountModal.tsx` y `MyAccountPage.tsx`):**
  - Tarjeta de apartado de alta fidelidad que desglosa:
    - Valor total del producto (`â‚¡45 000`).
    - Monto abonado a la fecha (`â‚¡10 000`).
    - Saldo pendiente que debe (`â‚¡35 000`).
    - **Reloj y Cuenta Regresiva Diaria:** Calcula dinÃ¡micamente los dÃ­as restantes de plazo (`dÃ­asRestantes = dueDate - hoy`). Cada dÃ­a que el cliente ingrese se descuentan los dÃ­as transcurridos con barra de progreso visual de vencimiento.
    - Acciones rÃ¡pidas para copiar el nÃºmero SINPE MÃ³vil (`6400-4640 Fiorella Solano`) y reportar abonos adicionales vÃ­a WhatsApp con mensaje pre-rellenado.
- **Sistema de Recordatorio Automatizado por Correo a los 5 DÃ­as (`layawayReminderService.ts`):**
  - Cuando faltan 5 dÃ­as o menos para el vencimiento del apartado (`daysRemaining <= 5`), el sistema prepara y despacha el correo de recordatorio con la plantilla oficial HTML de by.fio.
  - Detalla nombre del cliente, nÃºmero de pedido, artÃ­culo, monto pagado, saldo que debe, fecha lÃ­mite y cuenta SINPE MÃ³vil.
  - Bandera `layawayReminderEmailSent: true` para evitar envÃ­os duplicados.

---

# ðŸ“œ HISTORIAL DE CAMBIOS APROBADOS â€” BY.FIO TALLERES CREATIVOS & TIENDA

Este archivo es el Registro Universal de Memoria Protegida.
Cualquier funcionalidad registrada aquÃ­ estÃ¡ blindada: ninguna IA puede eliminarla o revertirla.

---

## ðŸ”— VINCULACIÃ“N DEL PROYECTO

- **Repositorio:** https://github.com/andersjival/byfio
- **Rama:** main
- **URL ProducciÃ³n:** https://byfiocr.pages.dev
- **Base de Datos Cloudflare D1:** `byfiocr-db` (ID: `60326015-d917-4a7b-baac-ab90d972ae57`)
- **Arquitectura:** Vite + React + TypeScript + Tailwind CSS + Cloudflare Pages & D1

---

## ðŸ“¦ REGISTRO DE ENTREGAS Y MÃ“DULOS

### VersiÃ³n 4.19.87 - Persistencia Universal del BotÃ³n de Perfil de Administrador en Todas las Pantallas
- [x] **Persistencia Universal del MenÃº de Usuario ([Navbar.tsx](file:///C:/Users/Juan/byfio/src/components/common/Navbar.tsx), [NavbarUserMenu.tsx](file:///C:/Users/Juan/byfio/src/components/common/navbar/NavbarUserMenu.tsx)):**
  - Se corrigiÃ³ la regla condicional que ocultaba el botÃ³n `[F] Fiorella [Admin] âŒ„` al ingresar al Panel de AdministraciÃ³n o a la Cola de Pedidos de Clientes.
  - El botÃ³n con el avatar, el nombre del administrador y la insignia `Admin` ahora se mantiene **100% persistente en todas las pantallas** (Tienda, Cola de Pedidos, FacturaciÃ³n, Inventario, Panel de Control, Superadmin y Mi Cuenta).
  - La insignia `Admin` y `Colaborador` ahora se visualizan nÃ­tidas y continuas tambiÃ©n en pantallas mÃ³viles sin ocultarse.
  - Al hacer clic en cualquier momento sobre el botÃ³n de perfil, se despliega el acceso rÃ¡pido a *Mi cuenta*, *Cola de pedidos de clientes*, *Panel de administraciÃ³n* y *Cerrar sesiÃ³n*.
  - Actualizado el Service Worker a `byfio-pwa-v4.19.87`.

### VersiÃ³n 4.19.86 - Blindaje de Permisos en Tienda, Filtros en Fila Ãšnica y Buscador Inferior
- [x] **Blindaje Estricto de Roles y Permisos en Tienda ([StorePage.tsx](file:///C:/Users/Juan/byfio/src/components/store/StorePage.tsx)):**
  - Conectados `currentUser` y `hasPermission` desde el contexto global (`AppContext`).
  - Se estableciÃ³ el control de acceso `canManageProducts`: solo administradores (`admin` o `isMasterAdmin`) y colaboradores con permiso explÃ­cito de inventario (`currentUser.role === 'staff' && hasPermission('inventory')`) pueden crear o editar artÃ­culos.
  - Para clientes registrados externos (`role === 'customer'`) e invitados, se ocultan por completo:
    - El botÃ³n `+ Agregar Producto` en la barra de filtros.
    - El botÃ³n `+ Agregar Producto a [Departamento]` en los estados sin productos.
    - El icono de lÃ¡piz (`Pencil`) de ediciÃ³n en cada una de las tarjetas de producto.
- [x] **EliminaciÃ³n Total del BotÃ³n `â¤ï¸ Personalizables`:**
  - Retirado de forma definitiva de la barra de filtros en todas las secciones, eliminando la duplicidad con el departamento de Personalizables.
- [x] **Filtros RÃ¡pidos en Fila Ãšnica hacia la Derecha:**
  - Se alinearon los botones de subcategorÃ­a en una sola fila continua hacia la derecha con scroll horizontal tÃ¡ctil suave (`overflow-x-auto no-scrollbar`), evitando que se partan en dos lÃ­neas.
- [x] **Buscador Inteligente Reubicado en la Franja Inferior:**
  - El buscador ahora ocupa la parte inferior del contenedor, justo por encima de las tarjetas de productos (en la zona indicada por el usuario), con mayor amplitud, icono de lupa y botÃ³n rÃ¡pido de limpiar (`X`).
  - Actualizado el Service Worker a `byfio-pwa-v4.19.86`.

### VersiÃ³n 4.19.85 - ReducciÃ³n Compacta del 60% del Banner de Departamentos en Tienda
- [x] **OptimizaciÃ³n Compacta del Selector de Departamentos ([StorePage.tsx](file:///C:/Users/Juan/byfio/src/components/store/StorePage.tsx)):**
  - Se redujo el tamaÃ±o vertical del banner de departamentos en mÃ¡s de un 65% (pasando de ~240px a ~45px de altura en escritorio y ~70px en mÃ³vil).
  - EliminaciÃ³n de encabezados redundantes y pÃ¡rrafos explicativos voluminosos que desplazaban el contenido de los productos hacia abajo.
  - DiseÃ±o ultra-estilizado en pÃ­ldoras horizontales alineadas (`flex items-center gap-1.5 py-1.5 px-3`):
    - Micro-icono contextual en caja neumÃ³rfica compacta (`w-5 h-5` / `w-6 h-6`).
    - TipografÃ­a en negrita concisa (`text-[11px] sm:text-xs font-bubble`).
    - Pastilla numÃ©rica de stock integrado discreta (`text-[9px] sm:text-[10px]`).
  - Preserva intacta la interactividad instantÃ¡nea al tacto, el degradado activo, el cambio dinÃ¡mico de subfiltros y el buscador inteligente.
  - Actualizado el Service Worker a `byfio-pwa-v4.19.85`.

### VersiÃ³n 4.19.84 - Selector Central de Macro-Departamentos con Subfiltros DinÃ¡micos y Buscador Inteligente
- [x] **Selector Centrado de 4 Macro-Departamentos en Tienda ([StorePage.tsx](file:///C:/Users/Juan/byfio/src/components/store/StorePage.tsx)):**
  - Ubicado entre el banner ilustrado oficial (`imagen-tienda-online.jpeg`) y la barra de filtros de productos.
  - ImplementaciÃ³n de 4 tarjetas tÃ¡ctiles neumÃ³rficas interactivas:
    1. âœ‚ï¸ **PapelerÃ­a e Insumos** (`papeleria`): stickers de vinil, kits de encuadernaciÃ³n, papeles especiales, opalinas y herramientas manuales.
    2. ðŸ–¨ï¸ **DTF** (`dtf`): impresiones DTF textil, lÃ¡minas DTF UV multisuperficie, transfers por metro y poliamidas adhesivas.
    3. âœ¨ **Personalizables** (`personalizables`): agendas fechadas con nombre, libros de vacunas acolchados, artÃ­culos sublimados y tazas con diseÃ±o personalizado.
    4. âš™ï¸ **Maquinaria** (`maquinaria`): prensas tÃ©rmicas 8 en 1 multifuncionales, plotters de corte digital Silhouette Cameo 5 y repuestos.
  - Cada departamento cuenta con icono dinÃ¡mico, conteo de artÃ­culos disponibles en tiempo real, descripciÃ³n de la secciÃ³n y degradado de activaciÃ³n (`from-purple-600 via-fio-purple to-fio-pink`).
- [x] **Subfiltros RÃ¡pidos DinÃ¡micos por Departamento:**
  - Al cambiar de departamento, la barra inferior carga exclusivamente los subfiltros correspondientes a esa Ã¡rea de la tienda.
  - SubcategorÃ­as contextuales:
    - *PapelerÃ­a e Insumos:* `Todas`, `Stickers y PapelerÃ­a`, `Kits e Insumos`, `Papeles y Cartulinas`, `Herramientas Manuales`.
    - *DTF:* `Todas`, `DTF Textil`, `DTF UV`, `LÃ¡minas y Transfers`, `Insumos DTF`.
    - *Personalizables:* `Todas`, `Agendas Personalizadas`, `Libros de Vacunas`, `ArtÃ­culos Sublimados`, `Detalles con Nombre`.
    - *Maquinaria:* `Todas`, `MÃ¡quinas y Equipo`, `Prensas TÃ©rmicas`, `Plotters de Corte`, `Repuestos y Accesorios`.
- [x] **Buscador Inteligente de Productos con DetecciÃ³n Multi-Departamento:**
  - BÃºsqueda en tiempo real por nombre, SKU, descripciÃ³n y categorÃ­as.
  - Si una bÃºsqueda no tiene resultados en el departamento actual pero sÃ­ existen productos coincidentes en otra secciÃ³n (ej. buscar "prensa" estando en "PapelerÃ­a"), el sistema muestra un banner inteligente sugiriendo las coincidencias con botÃ³n de 1 toque para saltar directamente a ese departamento.
- [x] **AmpliaciÃ³n de CategorÃ­as y CatÃ¡logo Base ([seedData.ts](file:///C:/Users/Juan/byfio/src/utils/seedData.ts), [NewProductModal.tsx](file:///C:/Users/Juan/byfio/src/components/admin/NewProductModal.tsx), [AppContext.tsx](file:///C:/Users/Juan/byfio/src/context/AppContext.tsx)):**
  - AÃ±adidos productos base de DTF (`Metro Lineal DTF Textil`, `LÃ¡mina DTF UV Adhesivo`, `Poliamida en Polvo Premium`) para que la secciÃ³n cuente con existencias y catÃ¡logo inicial.
  - Incorporadas categorÃ­as de DTF y maquinaria al modal de creaciÃ³n de productos para el panel de administraciÃ³n.
  - Actualizado el Service Worker a `byfio-pwa-v4.19.84`.

### VersiÃ³n 4.19.83 - Ordenamiento Responsivo y SimÃ©trico de Filtros de Cola de Pedidos en la App
- [x] **RediseÃ±o SimÃ©trico y Ordenado en la App MÃ³vil ([OrdersQueue.tsx](file:///C:/Users/Juan/byfio/src/components/admin/OrdersQueue.tsx)):**
  - Se eliminÃ³ el wrapping desordenado de 3 filas asimÃ©tricas que dejaba botones huÃ©rfanos y espacios en blanco en la versiÃ³n mÃ³vil.
  - Se implementÃ³ una cuadrÃ­cula estructurada de 2 columnas exclusiva para pantallas mÃ³viles:
    - Fila 1 (ancho completo): `Todos los Pedidos` con contador destacado en pill.
    - Fila 2 (50% / 50% simÃ©trico): `Pendientes` y `En Empaque`.
    - Fila 3 (50% / 50% simÃ©trico): `Empacados` y `Terminados`.
  - Cada botÃ³n cuenta con distribuciÃ³n balanceada `justify-between`, iconografÃ­a uniforme y etiquetas legibles.
  - En la versiÃ³n web de escritorio (`md:`), se preserva intacta la barra horizontal en lÃ­nea original (`md:flex md:w-fit md:items-center`), garantizando que la versiÃ³n de escritorio permanezca 100% igual.

### VersiÃ³n 4.19.82 - EliminaciÃ³n de Sobrescritura CSS Global en Header a Blanco (#FAF5FF)
- [x] **CorrecciÃ³n de Regla de Sobrescritura Global ([index.css](file:///C:/Users/Juan/byfio/src/index.css)):**
  - Se detectÃ³ y erradicÃ³ la regla CSS heredada `body[data-color-theme="vibrant"] header { background-color: rgba(250, 245, 255, 0.92) !important; }` que anulaba cualquier estilo de color en el encabezado y lo forzaba a un tono prÃ¡cticamente blanco (#FAF5FF).
  - Se blindÃ³ la regla con el tono lila pastel autÃ©ntico de by.fio: `header, body[data-color-theme="vibrant"] header { background-color: #C592F9 !important; border-bottom-color: rgba(192, 132, 252, 0.5) !important; }`.
  - Ahora las letras blancas del logotipo, el corazÃ³n celeste (#9BE4FF) y la estrella dorada (#FFF07C) resaltan con contraste y saturaciÃ³n Ã³ptimos.

### VersiÃ³n 4.19.81 - CorrecciÃ³n de Status Bar en PWA iOS, Fondo Lila Pastel y Retiro de Referencia MAYO10
- [x] **EliminaciÃ³n de Filtro Borroso en iOS PWA ([index.html](file:///C:/Users/Juan/byfio/index.html)):**
  - Cambiado `apple-mobile-web-app-status-bar-style` de `black-translucent` a `default` para desactivar la capa de cristal esmerilado que desenfocaba los botones en la pantalla de inicio del iPhone.
  - Sincronizado `<meta name="theme-color" content="#C592F9" />` para que la barra de estado de iOS coincida en nitidez y tono con el header.
- [x] **Ajuste de Altura y Espaciado de Botones ([Navbar.tsx](file:///C:/Users/Juan/byfio/src/components/common/Navbar.tsx)):**
  - Incrementado el padding superior a `pt-[calc(env(safe-area-inset-top,0px)+8px)] pb-1.5 sm:pb-2` para que los botones ("Tienda", "MenÃº", "Salir", "Modo Oscuro") bajen a una posiciÃ³n cÃ³moda, visible y completamente despejada del Notch o Dynamic Island.
  - Aplicado el color lila pastel caracterÃ­stico de la web: `bg-[#C592F9]`.
- [x] **Retiro Completo de Referencia `MAYO10 / by.fio` en Direcciones:**
  - Eliminado `(MAYO10 / by.fio)` y `Ref: MAYO10 / by.fio` de todos los puntos de la aplicaciÃ³n:
    - [StudioLocationScheduleCard.tsx](file:///C:/Users/Juan/byfio/src/components/common/StudioLocationScheduleCard.tsx) (Tarjeta de ubicaciÃ³n en pÃ¡gina de inicio).
    - [InvoiceModal.tsx](file:///C:/Users/Juan/byfio/src/components/admin/InvoiceModal.tsx) (Facturas digitales, mensaje de WhatsApp y comprobante impreso).
    - [CheckoutModal.tsx](file:///C:/Users/Juan/byfio/src/components/store/CheckoutModal.tsx) (Modal de retiro en tienda).
    - [SupplierOrderModal.tsx](file:///C:/Users/Juan/byfio/src/components/admin/SupplierOrderModal.tsx) (Ã“rdenes de compra y entrega a proveedores).
    - [SalesHistorySection.tsx](file:///C:/Users/Juan/byfio/src/components/admin/SalesHistorySection.tsx) (Historial de ventas).

### VersiÃ³n 4.19.80 - UnificaciÃ³n a Moradito Pastel SÃ³lido en Header sin Difuminado a Blanco
- [x] **Fondo Parejo en Header ([Navbar.tsx](file:///C:/Users/Juan/byfio/src/components/common/Navbar.tsx)):**
  - Eliminado el degradado horizontal con desvanecimiento a blanco (`from-[#C99BF9] via-[#D4AEFA] to-[#E2C0F4]`).
  - Fijado fondo sÃ³lido en el tono moradito pastel exacto `bg-[#C99BF9]`.
  - Reemplazado el borde blanco inferior difuminado (`border-white/50`) por un borde sutil tono sobre tono (`border-purple-300/40`) y sombra suave `shadow-sm`, eliminando cualquier difuminado sobre los botones.
- [x] **Consistencia en MenÃº Desplegable MÃ³vil ([NavbarMobileDrawer.tsx](file:///C:/Users/Juan/byfio/src/components/common/navbar/NavbarMobileDrawer.tsx)):**
  - Aplicado fondo uniforme `bg-[#C99BF9]` y borde superior `border-purple-300/40` sin desenfoque ni gradientes hacia blanco.

### VersiÃ³n 4.19.79 - EliminaciÃ³n de Halos y Destellos NeumÃ³rficos en Botones de PWA y Header
- [x] **EliminaciÃ³n de halos blancos y destellos:**
  - En los botones del encabezado y panel de administraciÃ³n (`MenÃº`, `Salir`, `Volver a Tienda`, `Panel Admin`, `Hamburguesa mÃ³vil` e `Iniciar SesiÃ³n`), se reemplazÃ³ la sombra neumÃ³rfica con destello blanco (`-5px -5px 12px #FFFFFF`) por sombras suaves y limpias (`shadow-sm`, `hover:shadow`).
  - Los botones ahora lucen nÃ­tidos, sÃ³lidos y perfectamente integrados con el fondo lila/morado sin auras ni halos artificiales.
- [x] **Selector de Modo Oscuro / Claro ([NavbarThemeToggle.tsx](file:///C:/Users/Juan/byfio/src/components/common/navbar/NavbarThemeToggle.tsx)):**
  - Se eliminÃ³ el reborde y halo interior (`shadow-neuInset` con `inset -4px -4px 8px #FFFFFF`) y el destello exterior en los botones de Sol y Luna (`shadow-neuBtn`), adoptando bordes limpios y sutiles (`shadow-xs` / `border-white/80`).
- [x] **Saneamiento de Clases Globales ([index.css](file:///C:/Users/Juan/byfio/src/index.css) y [tailwind.config.js](file:///C:/Users/Juan/byfio/tailwind.config.js)):**
  - Se actualizaron las reglas `.neu-btn` y la clave `neuBtn` para usar sombras sutiles sin desplazamientos negativos blancos deslumbrantes.

### VersiÃ³n 4.19.78 - Soporte Safe Area Notch y Dynamic Island para iPhone en PWA
- [x] **Ajuste de Ãrea Segura en Header ([Navbar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - AÃ±adido pt-[max(0px,env(safe-area-inset-top))] al <header> para que en iPhones con Notch o Dynamic Island en modo PWA standalone el fondo moradito cubra estÃ©ticamente la barra de estado y el contenido (logo, modo oscuro, iniciar sesiÃ³n, carrito) se dibuje de forma 100% visible y accesible debajo del Notch.
- [x] **ProtecciÃ³n de Barra Inferior en MenÃº MÃ³vil ([NavbarMobileDrawer.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/navbar/NavbarMobileDrawer.tsx)):**
  - AÃ±adido pb-[max(1.25rem,calc(env(safe-area-inset-bottom)+1rem))] para respetar el Home Indicator de iOS.
- [x] **Contenedor RaÃ­z Adaptativo ([App.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Integrado min-h-[100dvh] para asegurar la altura dinÃ¡mica Ã³ptima en navegadores mÃ³viles.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a yfio-pwa-v4.19.78 en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.77 - Suavizado Imperceptible de Hover en BotÃ³n CatÃ¡logo
- [x] **AtenuaciÃ³n de Hover en CatÃ¡logo ([NavbarNavLinks.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/navbar/NavbarNavLinks.tsx), [NavbarMobileDrawer.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/navbar/NavbarMobileDrawer.tsx)):**
  - Cambiado `hover:text-pink-600` a `hover:text-slate-800` para que el texto permanezca neutro y casi imperceptible en reposo/hover con un leve fondo pastel rosado blanquecino (`hover:bg-[#FDF2F8]`), igualando el comportamiento sutil de Inicio, Talleres y Tienda.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.77` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.76 - Color Rosadito Pastel en BotÃ³n CatÃ¡logo Seleccionado
- [x] **DiferenciaciÃ³n de BotÃ³n CatÃ¡logo en Estado Activo ([NavbarNavLinks.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/navbar/NavbarNavLinks.tsx), [NavbarMobileDrawer.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/navbar/NavbarMobileDrawer.tsx)):**
  - Aplicado un rosadito pastel suave (`from-[#F9A8D4] to-[#F472B6]`) con texto blanco puro (`text-white`) para diferenciarlo de Tienda (morado pastel), completando la paleta de 4 colores pasteles Ãºnicos: Inicio (amarillo), Talleres (celeste), Tienda (morado) y CatÃ¡logo (rosado).
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.76` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.75 - BotÃ³n Inicio Pastel Suave y NormalizaciÃ³n de CatÃ¡logo sin Tonos Rojos
- [x] **BotÃ³n Inicio Amarillo Pastel Suave ([NavbarNavLinks.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/navbar/NavbarNavLinks.tsx), [NavbarMobileDrawer.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/navbar/NavbarMobileDrawer.tsx)):**
  - Sustituido el degradado saturado de Ã¡mbar (`from-amber-400 to-amber-500`) por un amarillo pastel suave manteca (`from-[#FEF08A] to-[#FDE047]`) con texto Ã¡mbar oscuro de alto contraste y sombra tÃ¡ctil sutil.
- [x] **NormalizaciÃ³n de BotÃ³n CatÃ¡logo ([NavbarNavLinks.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/navbar/NavbarNavLinks.tsx), [NavbarMobileDrawer.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/navbar/NavbarMobileDrawer.tsx)):**
  - **Estado no seleccionado:** Erradicado el fondo rosa (`bg-[#FCE7F3]`) y texto rojizo (`text-pink-700`); unificado al fondo blanco translÃºcido (`bg-white/90`) con tipografÃ­a neutra (`text-slate-700`) idÃ©ntica a Talleres y Tienda.
  - **Estado seleccionado:** Fondo lila/morado pastel (`from-purple-500 to-purple-600`) con texto blanco nÃ­tido (`text-white`).
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.75` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.74 - DiseÃ±o Oficial de Etiqueta QR (1/3 QR con CÃ­rculo Lila ByFio y 2/3 DescripciÃ³n, UbicaciÃ³n y CÃ³digo)
- [x] **RedistribuciÃ³n Proporcional de Etiqueta ([ProductBarcodeLabel.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/ProductBarcodeLabel.tsx)):**
  - **1/3 del tamaÃ±o de la etiqueta:** Dedicado estrictamente al CÃ³digo QR (`w-[34%]`), optimizado en tamaÃ±o y proporciÃ³n.
  - **Emblema Central en CÃ­rculo Lila:** Creado componente e imagen vectorial (`ByFioQrCenterEmblem` y data URI) con cÃ­rculo color lila (`#D4AEFA`), nombre `byfio`, corazÃ³n rosado y estrella dorada en pequeÃ±ito en el centro, con excavaciÃ³n de mÃ³dulos QR y correcciÃ³n de error nivel H (30%) para escaneo instantÃ¡neo.
  - **2/3 del tamaÃ±o de la etiqueta:** Dedicado al contenido textual con descripciÃ³n del producto en grande (`line-clamp-2`), ubicaciÃ³n destacada (`ðŸ“ UbicaciÃ³n`), cÃ³digo SKU en badge monospace y precio en colones.
- [x] **ActualizaciÃ³n en Modal Individual ([QrLabelModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/QrLabelModal.tsx)):**
  - Integrado el cÃ­rculo lila central con `byfio`, corazÃ³n y estrella en la vista previa del cÃ³digo QR de 140px.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.74` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.73 - BotÃ³n de ConfirmaciÃ³n "Aceptar 1 unidad" en Color Fucsia con Rosado
- [x] **Estilo y Paleta de Color en Alisto Guiado ([GuidedPickingModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx)):**
  - Actualizado el botÃ³n principal de confirmaciÃ³n de cantidad escaneada (`Aceptar 1 unidad` / `Confirmar cantidad`) de verde esmeralda al degradado corporativo fucsia con rosado (`from-fuchsia-600 via-pink-600 to-fio-pink`).
  - Sombra y anillo de enfoque integrados en tonos rosados (`shadow-pink-500/35`, `ring-pink-400/25`, `border-pink-300`).
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.73` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.72 - CorrecciÃ³n CrÃ­tica de ActivaciÃ³n de CÃ¡mara en Alistar Pedido y Escaneo Robusto Multi-dispositivo
- [x] **SoluciÃ³n del Fallo de InicializaciÃ³n de CÃ¡mara ([PickingLiveBarcodeScanner.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/PickingLiveBarcodeScanner.tsx)):**
  - Erradicada la restricciÃ³n incompatible `{ facingMode: { ideal: facing } }` que provocaba que `html5-qrcode` lanzara una excepciÃ³n fatal (`facingMode object should have exact key`), bloqueando el encendido del stream de video.
  - Implementada selecciÃ³n inteligente de sensor mediante enumeraciÃ³n de dispositivos con `Html5Qrcode.getCameras()`: selecciona prioritariamente la lente trasera de alta definiciÃ³n (`rear / back / environment`) en telÃ©fonos celulares Android e iPhone.
  - Mecanismo de doble intento (`dual fallback`): si la cÃ¡mara por ID especÃ­fico no responde, conmuta de forma transparente e instantÃ¡nea al `facingMode` estÃ¡ndar.
- [x] **Blindaje de Montaje en DOM y BotÃ³n de Reintento ([PickingLiveBarcodeScanner.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/PickingLiveBarcodeScanner.tsx), [CameraBarcodeScannerModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/mobile/CameraBarcodeScannerModal.tsx)):**
  - AÃ±adida espera asÃ­ncrona de disponibilidad del nodo contenedor en el DOM para evitar carreras de renderizado al abrir el modal de alisto.
  - BotÃ³n tÃ¡ctil `"Reintentar"` aÃ±adido en la tarjeta de error si el navegador requiriÃ³ confirmaciÃ³n manual de permisos de cÃ¡mara.
- [x] **Ajuste de Estilos de Contenedor ([index.css](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Dimensiones forzadas al 100% en elementos intermedios generados por la librerÃ­a para garantizar que el stream ocupe la totalidad del visor delimitado por las esquinas amarillas.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.72` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.71 - EliminaciÃ³n de Alisto PWA en Desplegable de Colaborador y Enlace Directo a Cola de Pedidos de Clientes
- [x] **PurificaciÃ³n del MenÃº Desplegable de Colaborador ([NavbarUserMenu.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/navbar/NavbarUserMenu.tsx)):**
  - Removido por completo el botÃ³n `"Alisto de pedidos (Pwa)"` y toda la secciÃ³n interna que enlazaba a la vista mÃ³vil aislada.
  - Para perfiles de colaborador (`role: 'staff'`), se eliminaron botones no operativos dejando Ãºnica y exclusivamente el acceso directo `"Cola de Pedidos"` con subtÃ­tulo `"Cola de pedidos de clientes"` y el botÃ³n de cerrar sesiÃ³n.
  - La navegaciÃ³n redirige directamente a la **Cola de Pedidos de Clientes** oficial del sistema ([OrdersQueue.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx) en `/admin` con pestaÃ±a `orders`), con alisto guiado, escÃ¡ner en tiempo real y empaque.
- [x] **SincronizaciÃ³n en Drawer y Mi Cuenta ([NavbarMobileDrawer.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/navbar/NavbarMobileDrawer.tsx), [MyAccountPage.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/MyAccountPage.tsx)):**
  - Actualizado el botÃ³n mÃ³vil a `"ðŸ“‹ Cola de Pedidos de Clientes"` navegando a `onNavigate('admin', 'orders')`.
  - Re-exportado el tipo `AdminTabType` desde [index.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/types/index.ts) para tipado estricto en toda la navegaciÃ³n del sistema.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.71` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.70 - Confinamiento Estricto de VisiÃ³n de CÃ¡mara al Recuadro con Esquinas Amarillas
- [x] **Aislamiento Ã“ptico Total del Sensor ([CameraBarcodeScannerModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/mobile/CameraBarcodeScannerModal.tsx), [PickingLiveBarcodeScanner.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/PickingLiveBarcodeScanner.tsx)):**
  - La cÃ¡mara en vivo ahora se muestra Ãºnica y exclusivamente dentro del recuadro punteado delimitado por las 4 esquinas amarillas.
  - Fuera de dicho recuadro, el stream de video queda completamente oculto, dejando visible Ãºnicamente el fondo oscuro limpio y sin sangrado de video.
  - El visor utiliza recorte interno geomÃ©trico (`overflow-hidden rounded-2xl / rounded-3xl`) con esquinas amarillas y lÃ­nea lÃ¡ser perfectamente sincronizadas sobre el recuadro.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.70` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.69 - PurificaciÃ³n Visual del Modal EscÃ¡ner de Productos (Solo Visor Central)
- [x] **EliminaciÃ³n QuirÃºrgica de Cabecera y Pie Manual ([CameraBarcodeScannerModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/mobile/CameraBarcodeScannerModal.tsx)):**
  - Removida la cabecera superior completa que contenÃ­a el tÃ­tulo "EscÃ¡ner de Productos", subtÃ­tulo, botÃ³n de linterna y botÃ³n de cerrar.
  - Removido el contenedor inferior de digitaciÃ³n manual de SKU ("O ingresa SKU manual...").
  - Conservado de forma exclusiva y limpia el visor central de cÃ¡mara con el cuadro de escaneo, esquinas puntiagudas amarillas, retÃ­culo central y lÃ­nea lÃ¡ser animada.
  - Cierre intuitivo mediante toque en el backdrop oscurecido o tecla Escape.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.69` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.68 - IntegraciÃ³n de Escaneo de CÃ³digos y ActivaciÃ³n de CÃ¡mara en "Alistar Pedido"
- [x] **UnificaciÃ³n Total de Alistar Pedido ([GuidedPickingModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx)):**
  - Erradicada la bifurcaciÃ³n rÃ­gida que ocultaba el escÃ¡ner y la cÃ¡mara al ingresar por "Alistar Pedido".
  - AÃ±adido botÃ³n interactivo y prominente `ðŸ“· Activar CÃ¡mara para Escanear` directamente en la secciÃ³n de Alistar Pedido, junto a selector de estado (`CÃ¡mara Activa` / `Teclado / USB`).
  - Flujo completo de escaneo por cÃ¡mara de celular o lector USB/lÃ¡ser accesible dentro de Alistar Pedido con validaciÃ³n sonora, check visual y activaciÃ³n del botÃ³n grande para confirmar cantidad antes de pasar al siguiente producto.
  - Opciones completas de soporte manual (`Aceptar y Continuar`, `Simular Escaneo`, `Reportar Faltante`, `Ver Resumen` y `Salir a la Cola`).
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.68` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.67 - RestauraciÃ³n y EstabilizaciÃ³n Total de la CÃ¡mara de Escaneo de CÃ³digos de Barra
- [x] **SoluciÃ³n a Bloqueo de CÃ¡mara y EliminaciÃ³n de qrbox ProblemÃ¡tico ([PickingLiveBarcodeScanner.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/PickingLiveBarcodeScanner.tsx), [CameraBarcodeScannerModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/mobile/CameraBarcodeScannerModal.tsx)):**
  - Eliminada la restricciÃ³n de cÃ¡lculo dinÃ¡mico de `qrbox` que provocaba la excepciÃ³n crÃ­tica `qrbox dimensions should not be greater than viewfinder dimensions` en dispositivos mÃ³viles o durante el inicio del viewport.
  - El escÃ¡ner ahora abarca el 100% del sensor de la cÃ¡mara sin recortes errÃ³neos, capturando cÃ³digos de barra 1D (Code 128, EAN, UPC) y QR con mÃ¡xima velocidad y sensibilidad Ã³ptica.
  - Erradicado el constraint rÃ­gido `min: 720` que disparaba `OverconstrainedError` en cÃ¡maras de celulares en orientaciÃ³n vertical (portrait).
  - Implementada protecciÃ³n contra doble inicializaciÃ³n concurrente (`isStartingRef`) y limpieza previa del contenedor DOM (`containerEl.innerHTML = ''`).
- [x] **RestauraciÃ³n de Canvas y EliminaciÃ³n de Bloqueos en CSS ([index.css](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Removida la regla `canvas { display: none !important; }` que impedÃ­a al decodificador de `html5-qrcode` procesar los fotogramas del video en navegadores basados en WebKit/Safari y Chromium.
  - Eliminados los filtros GPU agresivos que provocaban pantalla negra en WebRTC.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.67` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.66 - Vista Exclusiva y Depurada de "Mi Cuenta" para Perfil de Alisto Creado por Administrador
- [x] **DepuraciÃ³n Total de Opciones de Cliente en Perfil de Alisto ([MyAccountPage.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/MyAccountPage.tsx) y [MyAccountModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/MyAccountModal.tsx)):**
  - IdentificaciÃ³n estricta del operario de alisto (`isAlistoUser`: rol `staff`, id `prof-alisto` o nombre con `ALISTO`).
  - Erradicadas todas las pestaÃ±as de cliente comercial: "Mis Pedidos", "Promociones", "Ofertas" y los formularios de telÃ©fono, direcciÃ³n de entrega y mapa interactivo.
  - Renderizado exclusivo y limpio que expone Ãºnicamente:
    1. Nombre del usuario (`currentUser.name`).
    2. Insignia `"Creado por Administrador"`.
    3. Fecha de creaciÃ³n de la cuenta en formato local (`formatCreationDateOnly`).
    4. Hora de creaciÃ³n de la cuenta en formato local (`formatCreationTimeOnly`).
    5. BotÃ³n de acceso directo a la PWA de Alisto de Pedidos (`/pedidos`) y botÃ³n de cerrar sesiÃ³n.
- [x] **SincronizaciÃ³n de Timestamps de Perfil ([AppContext.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - PreservaciÃ³n y propagaciÃ³n del campo `createdAt` al iniciar sesiÃ³n mediante PIN o selecciÃ³n de perfil administrativo.
  - Fecha y hora base local para el perfil maestro de alisto (`2026-10-30T10:00:00-06:00`).
- [x] **AdaptaciÃ³n en MenÃº de NavegaciÃ³n ([NavbarUserMenu.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/navbar/NavbarUserMenu.tsx)):**
  - Muestra la etiqueta `Alisto` y la leyenda `"Creado por Administrador"` en la opciÃ³n "Mi Cuenta", en sustituciÃ³n de la leyenda general de envÃ­os y mapa de clientes.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n de cachÃ© PWA elevada a `byfio-pwa-v4.19.66` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.65 - ConfirmaciÃ³n Obligatoria de Cantidad tras Escaneo en Alisto Guiado
- [x] **Flujo de Escaneo con VerificaciÃ³n y ConfirmaciÃ³n Manual ([GuidedPickingModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx)):**
  - Implementado nuevo estado `scannedVerifiedItem`: al escanear un producto, el sistema valida el cÃ³digo con sonido y check visual, pero **no avanza automÃ¡ticamente** al siguiente producto.
  - Se activa un **botÃ³n grande** de confirmaciÃ³n adaptado a la cantidad requerida: `"Aceptar 1 unidad"` si el pedido solicita 1 ud, o `"Confirmar cantidad: N unidades"` si solicita mÃ¡s de una.
  - Al pulsar el botÃ³n grande, el artÃ­culo se estampa como alistado (`markItemPicked`), se resetea la verificaciÃ³n y se abre de forma reactiva e inmediata el siguiente producto para escanear.
  - OpciÃ³n de re-escaneo rÃ¡pido (`Â¿Deseas volver a escanear?`) para corregir escaneos accidentales sin afectar el inventario.
- [x] **CÃ¡mara Persistente sin Reinicios ni Parpadeos ([PickingLiveBarcodeScanner.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/PickingLiveBarcodeScanner.tsx)):**
  - Pausa inteligente por ref (`isPausedRef`): la cÃ¡mara se mantiene activa en vivo en segundo plano sin destruir el stream ni solicitar permisos en cada producto.
  - Overlay cinemÃ¡tico verde esmeralda en el visor de cÃ¡mara al validar el cÃ³digo (`Â¡CÃ³digo Validado!`), indicando al operario confirmar la cantidad en el botÃ³n inferior.
  - SincronizaciÃ³n continua de referencias del SKU esperado para reanudar el escaneo del siguiente artÃ­culo de forma instantÃ¡nea tras la confirmaciÃ³n.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n de cachÃ© PWA elevada a `byfio-pwa-v4.19.65` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.64 - CÃ³digos de Barras Optimizados de Alta Legibilidad, Soporte Dual Barcode/QR y Etiquetas QR por Producto
- [x] **RediseÃ±o y OptimizaciÃ³n de CÃ³digos de Barras ([Barcode128.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Barcode128.tsx)):**
  - Erradicado el formato hiperalargado y las lÃ­neas delgaditas que dificultaban el escaneo Ã³ptico.
  - Implementado renderizado con `shapeRendering="crispEdges"`, ancho de mÃ³dulo reforzado (`moduleWidth: 2.4`) y altura vertical generosa (42-56px), eliminando el antialiasing borroso en pantallas e impresoras.
  - Aspecto proporcionado y centrado con `preserveAspectRatio="xMidYMid meet"`, logrando barras oscuras y gruesas de lectura instantÃ¡nea para pistolas lÃ¡ser y cÃ¡maras de celular.
- [x] **Selector Dual de Formato (CÃ³digo de Barras vs CÃ³digo QR) ([ShelfBarcodeLabelsModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/ShelfBarcodeLabelsModal.tsx)):**
  - AÃ±adido selector interactivo de formato en la cabecera de la hoja de 21 etiquetas: `[ ðŸ“Š CÃ³digo de Barras ]` y `[ ðŸ“± CÃ³digo QR ]`.
  - El administrador puede alternar con un solo clic quÃ© tipo de cÃ³digo desea utilizar e imprimir en la cuadrÃ­cula de 21 etiquetas por pÃ¡gina (3 columnas Ã— 7 filas).
  - TÃ­tulos y encabezados de impresiÃ³n dinÃ¡micos segÃºn el formato seleccionado.
- [x] **Etiquetas Dedicadas de CÃ³digo QR por Producto ([ProductBarcodeLabel.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/ProductBarcodeLabel.tsx)):**
  - Nuevo diseÃ±o de etiqueta 2D QR que integra: logo oficial ByFioâ˜…, categorÃ­a, ubicaciÃ³n de estante, nombre del artÃ­culo, cÃ¡psula con cÃ³digo SKU, precio destacado y cÃ³digo QR vectorial nÃ­tido con correcciÃ³n de error nivel M.
  - Compatible con la propiedad `qrCode` en el modelo de datos de `Product` ([index.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/types/index.ts)) con fallback automÃ¡tico al SKU.
- [x] **Modal Individual de Etiqueta con Selector Dual ([QrLabelModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/QrLabelModal.tsx)):**
  - Al abrir la etiqueta de cualquier producto individual desde la tabla de inventario, el usuario puede alternar entre CÃ³digo QR y CÃ³digo de Barras e imprimir en cualquiera de los dos formatos.
- [x] **Soporte de Formato Dual en Checklist de Inventario ([InventoryChecklistModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryChecklistModal.tsx)):**
  - Selector en la barra de control para elegir si la hoja de conteo de inventario por estante se imprime con `Barras 128`, `CÃ³digo QR 2D` o `Solo Texto`.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n de cachÃ© PWA elevada a `byfio-pwa-v4.19.64` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.63 - BotÃ³n "Producto sin Proveedor" y Modal Emergente de AsignaciÃ³n RÃ¡pida
- [x] **BotÃ³n DinÃ¡mico de AsignaciÃ³n RÃ¡pida ([InventoryTable.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx)):**
  - Implementado botÃ³n interactivo `"Producto sin proveedor"` con icono de camiÃ³n en la columna de UbicaciÃ³n & Proveedor y como acceso directo bajo el nombre del producto para cualquier artÃ­culo sin proveedor asignado.
  - Al hacer clic, abre de inmediato el pop-up emergente de asignaciÃ³n de proveedor.
  - Para productos con proveedor ya asignado, el badge del proveedor tambiÃ©n permite hacer clic para editarlo o reasignarlo fÃ¡cilmente.
  - AÃ±adido botÃ³n de filtro rÃ¡pido `"Sin Proveedor"` con conteo numÃ©rico en vivo en la barra de filtros superior.
- [x] **Nuevo Modal AtÃ³mico de AsignaciÃ³n ([AssignSupplierModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AssignSupplierModal.tsx)):**
  - Modal reactivo con cabecera en degradado Ã¡mbar, ficha resumen del producto (foto, SKU, categorÃ­a, estante).
  - MenÃº desplegable unificado con proveedores del sistema, histÃ³rico y opciÃ³n de escribir un nuevo proveedor al vuelo con telÃ©fono/WhatsApp.
  - BotÃ³n "Aceptar y Guardar" con confirmaciÃ³n sonora y persistencia inmediata en estado, almacenamiento local y Cloudflare D1 vÃ­a `updateProduct`.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.63` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.62 - Limpieza Visual Minimalista del Cuadro del EscÃ¡ner (Solo Esquinas Puntiagudas Amarillas)
- [x] **PurificaciÃ³n del Visor del EscÃ¡ner ([PickingLiveBarcodeScanner.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/PickingLiveBarcodeScanner.tsx)):**
  - Removida la barra superior completa de controles que contenÃ­a los textos "Pistola Lectora Activa", selector de cÃ¡mara y botones de luz / claridad.
  - Removido el pie de pÃ¡gina inferior que contenÃ­a "Esperando SKU:" y las etiquetas de formato.
  - Eliminados los textos flotantes internos dentro del encuadre.
  - Conservado Ãºnicamente el recuadro de escaneo con esquinas puntiagudas amarillas, retÃ­culo central y lÃ­nea lÃ¡ser animada centrada, garantizando una interfaz 100% limpia y sin distracciones.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.62` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.61 - CalibraciÃ³n y Centrado MilimÃ©trico del Cuadro de Escaneo con CÃ¡mara
- [x] **AlineaciÃ³n GeomÃ©trica Exacta del Stream de Video ([index.css](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Corregido el desplazamiento vertical donde el video se anclaba en `top: 0` y forzaba al usuario a subir el celular para enfocar.
  - Aplicado centrado absoluto del elemento `<video>` con `top: 50%; left: 50%; transform: translate(-50%, -50%)`, asegurando que el centro Ã³ptico del sensor coincida 1:1 con el centro de la pantalla.
- [x] **CalibraciÃ³n de qrbox y Marco GuÃ­a ([CameraBarcodeScannerModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/mobile/CameraBarcodeScannerModal.tsx), [PickingLiveBarcodeScanner.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/PickingLiveBarcodeScanner.tsx)):**
  - Configurado `qrbox` proporcional rectangular y dinÃ¡mico en el decodificador para enfocar la lectura en el centro exacto del recuadro.
  - Incorporado punto retÃ­culo guÃ­a en el centro y lÃ­nea lÃ¡ser centrada al 50% con indicador `"Centra el cÃ³digo aquÃ­"`.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.61` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.60 - ErradicaciÃ³n de Opacidad y OptimizaciÃ³n de Nitidez HD en CÃ¡mara de EscÃ¡ner
- [x] **EliminaciÃ³n del Velo Oscuro de Html5Qrcode ([PickingLiveBarcodeScanner.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/PickingLiveBarcodeScanner.tsx), [CameraBarcodeScannerModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/mobile/CameraBarcodeScannerModal.tsx)):**
  - Desactivada la inyecciÃ³n del sombreado opaco `rgba(0,0,0,0.48)` (`#qr-shaded-region`) que oscurecÃ­a y empaÃ±aba el video de la cÃ¡mara del celular.
  - El sensor ahora captura y decodifica el 100% del cuadro sin velos oscuros intermedios y a 25 FPS fluidos.
- [x] **Realce Ã“ptico y CalibraciÃ³n de Contraste en CSS ([index.css](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Aplicados filtros directos sobre el elemento `<video>` de la cÃ¡mara (`contrast(1.14) brightness(1.10) saturate(1.12)` y `-webkit-optimize-contrast`), haciendo que las lÃ­neas negras de los cÃ³digos de barra resalten con mÃ¡xima nitidez sobre fondo blanco.
  - Suprimidos los filtros de desenfoque (`backdrop-blur`) dentro del marco visor para evitar difuminar los cÃ³digos de barra.
- [x] **Controles de IluminaciÃ³n y Enfoque Continuo:**
  - AÃ±adido botÃ³n interactivo "Claridad / Ultra Luz" (icono de sol) en la barra del visor para realzar contraste en estanterÃ­as poco iluminadas.
  - Activado enfoque continuo (`focusMode: continuous`) y exposiciÃ³n automÃ¡tica en el hardware de la cÃ¡mara del celular.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.60` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.59 - Visibilidad Omnipresente del EscÃ¡ner de CÃ³digos de Barras en PWA de Alisto
- [x] **Banner y BotÃ³n Principal Superior ([MobileOrdersView.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/mobile/MobileOrdersView.tsx)):**
  - AÃ±adido banner prominente a todo lo ancho con gradiente y cÃ¡mara dorada: "Escanear Productos para Alisto" para acceso inmediato en 1 toque.
  - Integrado botÃ³n dedicado "CÃ¡mara" junto a la barra de bÃºsqueda y entrada rÃ¡pida de SKU.
- [x] **Acceso RÃ¡pido en Cada Pedido e Ãtem:**
  - Incorporado botÃ³n "Escanear" en la cabecera de cada tarjeta de pedido sin necesidad de desplegarla.
  - AÃ±adido botÃ³n "Escanear" individual en cada producto pendiente del checklist para alistar el Ã­tem exacto con la cÃ¡mara.
- [x] **BotÃ³n Flotante Fijo (FAB) y Dock MÃ³vil ([AdminMobileDock.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminMobileDock.tsx)):**
  - BotÃ³n flotante circular permanente `[ ðŸ“· Escanear Producto ]` sobre el margen inferior derecho.
  - BotÃ³n central "Escanear" integrado en la barra de navegaciÃ³n tÃ¡ctil inferior (`AdminMobileDock`) de la PWA.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.59` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.58 - Sistema de Apartados para MÃ¡quinas y Equipo (Plazo, Cuotas y Pago Inicial en Tienda)
- [x] **ConfiguraciÃ³n en Agregar y Editar Producto ([NewProductModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/NewProductModal.tsx), [types/index.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/types/index.ts)):**
  - AÃ±adida la categorÃ­a oficial `'MÃ¡quinas y Equipo'` al listado de categorÃ­as predeterminadas.
  - Creado bloque dedicado e interactivo de **Sistema de Apartados** que se auto-activa al seleccionar "MÃ¡quinas y Equipo" o de forma opcional para cualquier producto.
  - Selectores configurables:
    1. **Plazo del apartado:** 1 mes (30 dÃ­as), 2 meses (60 dÃ­as), 3 meses (90 dÃ­as), 4 meses (120 dÃ­as) o 6 meses (180 dÃ­as).
    2. **Cantidad total de pagos:** 2 a 6 cuotas.
    3. **Porcentaje de pago inicial:** 20% a 50% del valor total.
  - Calculadora financiera en vivo que muestra inmediatamente el monto exacto en colones (â‚¡) de la 1Âª cuota que pagarÃ¡ el cliente en tienda, el saldo restante y las cuotas periÃ³dicas resultantes.
- [x] **Tienda y CatÃ¡logo Online con BotÃ³n de Apartado ([ProductsSection.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/ProductsSection.tsx), [ProductDetailModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/ProductDetailModal.tsx), [CatalogPage.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx)):**
  - Insignia destacada `ðŸ”– Apartado Disponible` en tarjetas y modal de detalle para artÃ­culos elegibles.
  - Desglose financiero transparente: el cliente ve claramente el precio de contado y el monto con el que puede apartar hoy pagando solo su 1Âª cuota inicial.
  - BotÃ³n "Apartar" / "Realizar Apartado" que agrega al carrito la 1Âª cuota correspondiente para pagar de inmediato vÃ­a SINPE MÃ³vil o Transferencia, registrando la reserva y descontando inventario.
- [x] **Flujo de Carrito, Checkout y Pedidos ([CartDrawer.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CartDrawer.tsx), [CheckoutModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx), [OrdersQueue.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx), [InvoiceModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InvoiceModal.tsx)):**
  - Carrito y comprobante desglosan el Ã­tem como "1Âª Cuota de Apartado", detallando saldo pendiente y plazo.
  - Notas del pedido y comprobante de alisto documentan el monto pagado hoy y las cuotas restantes para control administrativo.
- [x] **CachÃ© PWA y Service Worker ([sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js)):**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.58`.

### VersiÃ³n 4.19.57 - IntegraciÃ³n del Lector de Alisto Continuo con CÃ¡mara en la PWA MÃ³vil de Pedidos
- [x] **IntegraciÃ³n en la PWA de Alisto ([App.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Montado `GuidedPickingModal` en la ruta exclusiva `/pedidos-mobile` (PWA de colaboradores/operarios de alisto) para que el modal de cÃ¡mara tome toda la pantalla del celular sin importar la ruta de entrada.
- [x] **Acceso Directo en Tarjetas y Cola ([MobileOrdersView.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/mobile/MobileOrdersView.tsx)):**
  - AÃ±adido botÃ³n destacado "ðŸ“± Iniciar Alisto con Lector de CÃ¡mara" en cada pedido con productos pendientes.
  - Implementado banner de acceso rÃ¡pido en la cabecera mÃ³vil que detecta el siguiente pedido pendiente en cola FIFO con botÃ³n de escaneo inmediato a un clic.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.57` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.56 - Directorio de Proveedores, BotÃ³n "+ Agregar Proveedor" y Despacho Dual (WhatsApp + Descarga PDF)
- [x] **Directorio y Modal de Registro de Proveedores ([AddSupplierModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AddSupplierModal.tsx), [AppContext.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Creado modal atÃ³mico de alta fidelidad para registrar proveedores con campos: Nombre del proveedor, TelÃ©fono de contacto, WhatsApp de pedidos (con interruptor de sincronizaciÃ³n "Mismo"), Correo electrÃ³nico opcional, DirecciÃ³n fÃ­sica opcional y Notas.
  - Persistencia en almacenamiento local bajo la clave `byfio_suppliers_directory_v1` sincronizada vÃ­a BroadcastChannel.
  - Incorporado botÃ³n "+ Agregar Proveedor" en la barra de acciÃ³n principal de la secciÃ³n de proveedores ([SuppliersOrdersSection.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SuppliersOrdersSection.tsx)).
  - AÃ±adida pestaÃ±a interactiva "Directorio Proveedores" con tarjetas individuales para llamar, chatear por WhatsApp, ver direcciÃ³n/correo o generar pedidos de inmediato.
- [x] **GeneraciÃ³n Dual de Pedidos a Proveedor: WhatsApp + Descarga/ImpresiÃ³n PDF ([CreateSupplierOrderPage.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/CreateSupplierOrderPage.tsx)):**
  - Selector inteligente que agrupa proveedores del directorio con conteo en vivo de artÃ­culos agotados.
  - DetecciÃ³n y auto-completado automÃ¡tico del nÃºmero de WhatsApp al elegir cualquier proveedor del directorio.
  - Acceso directo "+ Agregar Proveedor" integrado junto al selector para registrar nuevos contactos al vuelo sin abandonar la requisiciÃ³n.
  - Doble formato de despacho oficial:
    1. **BotÃ³n WhatsApp:** EnvÃ­a el pedido completo estructurado con cÃ³digo de referencia, SKU, unidades y totales formateados para confirmar disponibilidad.
    2. **BotÃ³n Descargar / Imprimir (PDF):** Genera la orden de compra oficial membretada con encabezado formal, datos del proveedor, receptor y firmas de autorizaciÃ³n para imprimir o guardar como PDF.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n de cachÃ© PWA elevada a `byfio-pwa-v4.19.56` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.55 - Checklist de Toma FÃ­sica de Inventario por Estante con CÃ³digos de Barra y Hojas de Conteo
- [x] **Generador de Checklist y Hojas de Conteo por Estante ([InventoryChecklistModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryChecklistModal.tsx)):**
  - Implementado modal y motor de hojas de conteo de inventario fÃ­sico agrupadas estrictamente por estante (`shelfLocation`).
  - Configurado salto de pÃ¡gina forzado en impresiÃ³n (`break-after: page !important; min-height: 260mm`) para garantizar exactamente 1 hoja independiente por cada estante.
  - Encabezado oficial con logo de ByFio, banner destacado de la estanterÃ­a auditada (`ðŸ“ EstanterÃ­a: [Nombre]`), nÃºmero de hoja, responsable/auditor y fecha.
  - Columnas estructuradas: `#`, cÃ³digo SKU con cÃ³digo de barras Code 128 legible por escÃ¡ner o pistola, descripciÃ³n y categorÃ­a, stock teÃ³rico en sistema, casilla de conteo fÃ­sico real (`[ ___ ]`) para escribir a mano o ingresar en digital, estado/diferencia calculada (`+ / -`) y observaciones.
  - Pie de pÃ¡gina oficial en cada hoja con lÃ­neas de firma para el Auditor y el Supervisor de ByFio.
- [x] **Acceso Directo en Inventario ([InventoryTable.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx)):**
  - AÃ±adido botÃ³n de acciÃ³n rÃ¡pida `ðŸ“‹ Checklist por Estante` junto a los controles de impresiÃ³n de cÃ³digos.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n de cachÃ© PWA elevada a `byfio-pwa-v4.19.55` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.54 - Sistema de Lector de CÃ³digos de Barras con la CÃ¡mara del Celular en Modo Alisto
- [x] **Pistola Lectora de CÃ³digos en Vivo ([PickingLiveBarcodeScanner.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/PickingLiveBarcodeScanner.tsx)):**
  - Desarrollado componente atÃ³mico de escÃ¡ner en tiempo real con activaciÃ³n continua de la cÃ¡mara trasera del celular.
  - Soporte nativo multiformato (Code 128, QR Code, Code 39, EAN-13, EAN-8, UPC-A, Codabar) con aceleraciÃ³n por `BarcodeDetector` en GPU mÃ³vil y respaldo en ZXing.
  - Visor guiado con mira rectangular para cÃ³digos de barra horizontales y lÃ­nea lÃ¡ser roja animada continua.
  - Controles mÃ³viles tÃ¡ctiles: encendido/apagado de Linterna (Torch) para estanterÃ­as oscuras, alternador de cÃ¡mara trasera/frontal y botÃ³n de pausa.
- [x] **Flujo Continuo de Alisto Guiado ([GuidedPickingModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx)):**
  - Al abrir un pedido en "Alisto con CÃ³digo", el sistema presenta el producto a buscar (foto, estante destacado en grande, cantidad requerida y SKU) y activa de inmediato la cÃ¡mara lectora.
  - ValidaciÃ³n en vivo con funciÃ³n normalizadora `checkBarcodeMatch`: al enfocar el cÃ³digo de barras, reconoce el SKU en milisegundos, emite sonido industrial de confirmaciÃ³n ("pip"), hace vibrar el celular y avanza automÃ¡ticamente al siguiente producto de la orden sin detener la cÃ¡mara.
  - DetecciÃ³n de error y tolerancia a productos desordenados: si el operario escanea un producto incorrecto, emite advertencia acÃºstica y hÃ¡ptica indicando el cÃ³digo leÃ­do y el producto correcto esperado en el estante; si escanea otro producto que tambiÃ©n estÃ¡ en el pedido, lo marca y lo avanza de inmediato.
  - Selector de mÃ©todo para alternar entre "CÃ¡mara Celular" y "Teclado / USB" para pistolas lÃ¡ser fÃ­sicas conectadas a computadoras.
- [x] **Sintetizador de Sonidos Industriales y HÃ¡ptica ([soundEffects.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/soundEffects.ts)):**
  - Creadas funciones `playBarcodeSuccessSound()` (beep agudo de 2450Hz para lectura exitosa) y `playBarcodeErrorSound()` (doble tono grave de advertencia) sintetizadas vÃ­a Web Audio API sin latencia ni dependencias externas.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.54` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.53 - ImpresiÃ³n de 21 CÃ³digos de Barras por Hoja con Logo ByFio, CategorÃ­a y Filtros Avanzados
- [x] **Formato EstÃ¡ndar de 21 CÃ³digos por Hoja (3Ã—7) ([ShelfBarcodeLabelsModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/ShelfBarcodeLabelsModal.tsx)):**
  - Configurada cuadrÃ­cula estricta de 3 columnas Ã— 7 filas para que quepan exactamente 21 etiquetas de cÃ³digos de barra por hoja impresa (estÃ¡ndar tipo Avery / adhesivos de 21 unidades).
  - PaginaciÃ³n automÃ¡tica y salto de pÃ¡gina limpio en impresiÃ³n (`@media print` con `break-after: page`).
  - Encabezado oficial en cada hoja impresa con:
    - Logo oficial de ByFio con corazÃ³n y estrella.
    - CategorÃ­a de producto destacada (`ðŸ·ï¸ CategorÃ­a: [Nombre]`).
    - Estante, proveedor filtrado, nÃºmero de hoja (`Hoja X de Y`) y fecha/hora.
- [x] **Filtros Flexibles y Modos de ImpresiÃ³n:**
  - **Por CategorÃ­a:** Selector desplegable con todas las categorÃ­as de producto.
  - **Por Estante:** Filtro por estanterÃ­a con accesos rÃ¡pidos directos para `Estante 1`, `Estante 2`, etc.
  - **Por Proveedor:** Filtro dinÃ¡mico por proveedor o distribuidor del producto.
  - **Por Nombre / SKU:** Buscador en vivo y ordenamiento mÃºltiple (Nombre A-Z, EstanterÃ­a, CategorÃ­a, Proveedor, SKU).
  - **Modo Llenar Hoja (21 del mismo producto):** Permite seleccionar 1 solo producto y llenar la hoja completa de 21 stickers idÃ©nticos para etiquetar lotes nuevos de estante.
- [x] **Etiquetas AtÃ³micas Optimizadas ([ProductBarcodeLabel.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/ProductBarcodeLabel.tsx)):**
  - Cada etiqueta incluye mini logo ByFio, categorÃ­a, nombre del producto, cÃ³digo de barras Code 128 nÃ­tido, SKU, estante y precio.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.53` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.52 - PÃ¡gina Completa para Realizar Pedidos a Proveedor con Selector Inteligente de Faltantes
- [x] **TransformaciÃ³n de Modal a PÃ¡gina Completa ([CreateSupplierOrderPage.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/CreateSupplierOrderPage.tsx)):**
  - La secciÃ³n de realizar pedidos a proveedor dejÃ³ de ser un modal emergente / pop-up flotante y se convirtiÃ³ en una pÃ¡gina completa dedicada con sub-ruta propia (`/admin/realizar-pedido`, pestaÃ±a `supplier-order-create`).
  - Eliminado el pop-up residual `SupplierOrderModal` del renderizado global de modales.
  - Conectados los accesos directos desde la tabla de inventario ("Realizar Pedido a Proveedor" y botones "Pedir" de stock en cero) y la secciÃ³n de proveedores ("+ Nuevo Pedido" y "RequisiciÃ³n AutomÃ¡tica").
- [x] **Selector Inteligente de Proveedores con Auto-DetecciÃ³n de Faltantes:**
  - Selector desplegable que lista dinÃ¡micamente todos los proveedores disponibles junto con la cantidad exacta de productos sin existencias (`stock <= 0`).
  - Al seleccionar un proveedor especÃ­fico, el sistema jala y filtra automÃ¡ticamente Ãºnicamente los productos agotados pertenecientes a dicho proveedor, calculando cantidades sugeridas de reposiciÃ³n (`maxStock - stock`) y costos estimados.
  - OpciÃ³n "Sin Proveedor / Compra Particular / Sin Nombre" que permite generar Ã³rdenes sin exigir nombre formal de proveedor (ideal para compras ocasionales o a personas particulares).
  - OpciÃ³n de ver todos los productos sin existencias consolidados o ingresar nombres de proveedores personalizados libremente.
- [x] **Herramientas de Pedido y Despacho:**
  - Buscador integrado para sumar artÃ­culos adicionales del inventario.
  - GeneraciÃ³n de mensaje para envÃ­o directo por WhatsApp con formato profesional.
  - Vista previa de documento oficial de Orden de Compra para impresiÃ³n en papel o PDF con membrete y firmas.
  - Guardado como Borrador ("Por Pedir"), registro de pedido realizado ("Ordenado") y sincronizaciÃ³n con Agenda ByFio.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.52` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.51 - CorrecciÃ³n Visual de Nitidez y Sombra en MenÃº de Usuario
- [x] **EliminaciÃ³n de Borrosidad y Mancha Oscura ([NavbarUserMenu.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/navbar/NavbarUserMenu.tsx)):**
  - Reemplazado el fondo translÃºcido con blur (`bg-white/98 backdrop-blur-xl`) por blanco sÃ³lido puro (`bg-white`), eliminando los artefactos de desenfoque de GPU que provocaban la mancha oscura en la parte inferior del menÃº.
  - Sustituida la sombra genÃ©rica pesada (`shadow-2xl`) por elevaciÃ³n ambiental lila-pÃºrpura (`shadow-[0_12px_32px_rgba(107,33,168,0.14)]`) acorde al diseÃ±o pastel de ByFio.
  - Estilizado el botÃ³n "Cerrar SesiÃ³n" con contenedor suave, icono en pastilla rosada y borde definido.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.51` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.50 - SoluciÃ³n a Encogimiento de Zoom y ExpansiÃ³n en Mapa Interactivo
- [x] **SoluciÃ³n de RaÃ­z al Encogimiento de Zoom ([InteractiveMapPicker.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/InteractiveMapPicker.tsx)):**
  - Desacoplado el ciclo de vida del mapa Leaflet de los cambios de `lat`, `lng` y `onChange`: el mapa ahora se monta Ãºnicamente una vez (`useEffect(..., [])`) y no se destruye con `map.remove()` al mover el pin o al recibir la direcciÃ³n sugerida.
  - Implementado `panTo` para sincronizaciÃ³n externa y `Math.max(currentZoom, ...)` para presets y GPS, preservando intacto el nivel de acercamiento detallado (zoom 17-19) elegido por el usuario sin regresar al zoom inicial 15.
- [x] **BÃºsqueda de DirecciÃ³n Directa en el Mapa:**
  - AÃ±adido buscador en vivo con Nominatim para Costa Rica (`Search`), permitiendo al usuario escribir su cantÃ³n, barrio o calle directamente en la cabecera del mapa, centrando el pin y manteniendo la vista ampliada.
- [x] **BotÃ³n 'Hacer Grande' / Reducir:**
  - Incorporado control interactivo de expansiÃ³n de altura (`Maximize2` / `Minimize2`) con re-cÃ¡lculo automÃ¡tico de tiles (`map.invalidateSize()`) para ver el mapa en formato grande sin encogimiento involuntario.
- [x] **Blindaje en Modal de Registro ([RegisterMapModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/RegisterMapModal.tsx)):**
  - Memoizado el callback `onChange` y restringido el reinicio de coordenadas a la apertura del modal (`[isOpen]`), evitando reinicios de posiciÃ³n o zoom ante re-renders del componente padre.

### VersiÃ³n 4.19.49 - GeneraciÃ³n AutomÃ¡tica de CÃ³digos de Barras e ImpresiÃ³n para EstanterÃ­as y Productos
- [x] **Generador Vectorial Nativo de CÃ³digo 128 ([Barcode128.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Barcode128.tsx)):**
  - Implementado algoritmo estÃ¡ndar Code 128 (Subset B) en SVG vectorial puro sin dependencias externas pesadas.
  - CÃ¡lculo estricto de mÃ³dulo 103 checksum, barras de inicio y parada estÃ¡ndar, resoluciÃ³n nÃ­tida para impresiÃ³n tÃ©rmica o papel adhesivo.
- [x] **Etiqueta Universal de Producto ([ProductBarcodeLabel.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/ProductBarcodeLabel.tsx)):**
  - Muestra nombre del producto en la parte superior, barras vectoriales legibles por pistola escÃ¡ner, cÃ³digo SKU interno debajo de las barras, indicador de estanterÃ­a (ðŸ“) y precio formateado en colones con borde punteado de recorte.
- [x] **Flujo de CreaciÃ³n Inmediata con CÃ³digo de Barras ([NewProductModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/NewProductModal.tsx)):**
  - GeneraciÃ³n reactiva de SKU en tiempo real mientras el usuario escribe el nombre del producto nuevo.
  - PrevisualizaciÃ³n dinÃ¡mica de la etiqueta de barras durante la ediciÃ³n.
  - Pantalla modal de confirmaciÃ³n y entrega que genera el cÃ³digo de barras con botÃ³n directo "Imprimir Etiqueta", "+ Agregar Otro Producto" y "Listo / Finalizar".
- [x] **MÃ³dulo de ImpresiÃ³n por EstanterÃ­a y CategorÃ­a ([ShelfBarcodeLabelsModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/ShelfBarcodeLabelsModal.tsx)):**
  - Modal accesible desde la tabla de inventario con filtros por estante, categorÃ­a, bÃºsqueda en vivo y ordenamiento (por estanterÃ­a, nombre o SKU).
  - CuadrÃ­cula de etiquetas lista para imprimir (`window.print()`) con CSS optimizado para omitir navegaciÃ³n y aprovechar hojas de etiquetas/recorte para estantes.
- [x] **IntegraciÃ³n en Tabla de Inventario ([InventoryTable.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx)):**
  - BotÃ³n prominente "Imprimir CÃ³digos Estante" en el encabezado superior.
  - BotÃ³n de acciÃ³n individual "Barras" en cada fila para inspeccionar o imprimir la etiqueta del producto y su estanterÃ­a de forma instantÃ¡nea.
- [x] **Estilos de ImpresiÃ³n Aislados ([index.css](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Agregadas directivas `@media print` para aislar `#printable-shelf-barcodes` y `#printable-product-barcode`.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.49` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.48 - DirecciÃ³n con Texto y PIN de Mapa Real en Paso 2 de Registro
- [x] **Campo de DirecciÃ³n en Texto y BotÃ³n de PIN de Mapa ([ThreeStepRegisterForm.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/ThreeStepRegisterForm.tsx)):**
  - AÃ±adido campo de texto de direcciÃ³n fÃ­sica exacta con icono de `MapPin` en el Paso 2 del registro.
  - Implementado selector con botÃ³n interactivo de PIN de mapa real que muestra estado dinÃ¡mico ("Marcar PIN en el Mapa Real" vs "UbicaciÃ³n seleccionada con PIN").
- [x] **Componente AtÃ³mico de Mapa Modal ([RegisterMapModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/RegisterMapModal.tsx)):**
  - Creado modal atÃ³mico montado en `createPortal` con z-index seguro (`z-[120]`), integrando `InteractiveMapPicker` con OpenStreetMap y Leaflet, arrastre de pin estrella de ByFio, geocodificaciÃ³n inversa con Nominatim, accesos rÃ¡pidos de Costa Rica y botÃ³n GPS.
  - BotÃ³n "Aceptar UbicaciÃ³n" que guarda coordenadas `lat`/`lng` y autocompleta la sugerencia de direcciÃ³n en el formulario.
- [x] **Persistencia en el Sistema ([AppContext.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Actualizado `registerUser` para recibir y persistir `address`, `lat` y `lng` en `REGISTERED_USERS` y en la sesiÃ³n activa `currentUser` / `AUTH_USER`.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.48` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.47 - Retiro de SecciÃ³n de Lista de Precios de Stickers del Home
- [x] **Limpieza QuirÃºrgica en PÃ¡gina Principal ([HomePage.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HomePage.tsx)):**
  - Removida la secciÃ³n `PricingStickersSection` (*"LISTA DE PRECIOS â€¢ STICKERS & PERSONALIZADOS"*) de la pÃ¡gina principal (Home), dejando la vista centrada en la Academia Creativa (Talleres), Productos Destacados y Horarios/UbicaciÃ³n de TibÃ¡s.
  - La secciÃ³n permanece intacta y disponible para consulta directa en su ruta dedicada `/precios`.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.47` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.46 - RediseÃ±o Visual de Alta Fidelidad del MenÃº Desplegable de Usuario
- [x] **OptimizaciÃ³n de la Cabecera de Identidad en el MenÃº ([NavbarUserMenu.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/navbar/NavbarUserMenu.tsx)):**
  - RediseÃ±ada la secciÃ³n superior de identidad y nombre dentro del menÃº desplegable: tarjeta estilizada con avatar gradiente de 40px, inicial destacada, nombre completo en tipografÃ­a bubble legible (`text-sm font-bold`), insignia de rol (`Admin`, `Staff`, `Cliente`) y correo electrÃ³nico sin cortes antiestÃ©ticos.
  - Ampliado el ancho del menÃº de `w-64` a `w-72 sm:w-80` para evitar truncado prematuro en nombres o correos extensos.
  - BotÃ³n disparador del navbar mejorado con sombreado tÃ¡ctil consistente, mayor lÃ­mite de ancho para el nombre (`max-w-[160px]`), mejor contraste y anillo activo al desplegar.
  - Cabecera de usuario en drawer mÃ³vil ([`NavbarMobileDrawer.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/navbar/NavbarMobileDrawer.tsx)) sincronizada con avatar e insignias consistentes.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.46` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.45 - Mapa Real Interactivo con Pin Arrastrable para DirecciÃ³n de Entrega
- [x] **Componente AtÃ³mico de Mapa Interactivo Real ([InteractiveMapPicker.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/InteractiveMapPicker.tsx)):**
  - Implementado mapa interactivo real basado en Leaflet y OpenStreetMap (adiÃ³s al iframe estÃ¡tico embebido).
  - Pin personalizado con gradiente ByFio y estrella dorada (`L.divIcon`), con capacidad de arrastre fluido (`draggable: true`).
  - Al arrastrar el pin o hacer clic en cualquier lugar del mapa, las coordenadas (`lat`, `lng`) se actualizan en tiempo real.
  - GeocodificaciÃ³n inversa con OpenStreetMap Nominatim que identifica automÃ¡ticamente la calle, cantÃ³n y provincia del punto marcado.
  - BotÃ³n de geolocalizaciÃ³n GPS real en Costa Rica y selector de zonas frecuentes (TibÃ¡s, San JosÃ©, Heredia, Alajuela, Cartago, EscazÃº, etc.).
- [x] **IntegraciÃ³n en PÃ¡ginas y Modales de Entrega:**
  - Integrado en [`MyAccountPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/MyAccountPage.tsx) para la pestaÃ±a "Mis Datos & EnvÃ­o".
  - Integrado en [`MyAccountModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/MyAccountModal.tsx).
  - Integrado en el checkout [`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx) mediante botÃ³n desplegable para fijar la direcciÃ³n de envÃ­o en vivo antes de pagar.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.45` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.44 - SecciÃ³n "Mi Cuenta" como PÃ¡gina Independiente Ãšnica (/mi-cuenta)
- [x] **TransformaciÃ³n de "Mi Cuenta" a PÃ¡gina Standalone ([MyAccountPage.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/MyAccountPage.tsx)):**
  - La secciÃ³n "Mi Cuenta" dejÃ³ de ser un modal emergente / pop-up flotante y se convirtiÃ³ en una pÃ¡gina interna completa, Ãºnica para el usuario.
  - DiseÃ±o responsive de alta fidelidad con perfil de usuario (avatar, nombre, rol, email, fecha de registro con formato legible).
  - PestaÃ±as dinÃ¡micas:
    1. **Mis Datos & EnvÃ­o:** Formulario editable para nÃºmero de telÃ©fono/WhatsApp y direcciÃ³n exacta en texto, sincronizado con visor interactivo de mapa OpenStreetMap, geolocalizaciÃ³n GPS real en Costa Rica con presets rÃ¡pidos (TibÃ¡s Estudio, San JosÃ© Centro, Heredia, Alajuela, EscazÃº, etc.) y controles direccionales de ajuste fino.
    2. **Mis Pedidos:** Historial de compras en vivo con barra de progreso de 4 estados (Recibido, Alisto, Empacado & Listo, Entregado), desglose de productos y generaciÃ³n de Factura PDF.
    3. **Promociones:** Cupones de descuento exclusivos (`BYFIOSTAR`, `ENVIOGRATIS`, `TALLER15`) con copiado en 1 clic.
    4. **Ofertas Especiales:** Tarjetas de productos en combo y preventas de talleres.
  - Portal de bienvenida para usuarios no autenticados con llamado a la acciÃ³n para iniciar sesiÃ³n o registrarse.
- [x] **Enrutamiento y NavegaciÃ³n Directa ([routeHelpers.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/routeHelpers.ts), [App.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - AÃ±adida ruta oficial `'mi-cuenta'` en `AppRoute`.
  - DetecciÃ³n automÃ¡tica en URL de `/mi-cuenta`, `/cuenta`, `/perfil`, `#mi-cuenta` y `?seccion=mi-cuenta`.
  - Retirado el componente de modal emergente (`MyAccountModal`) del render global de modales.
  - Actualizado el botÃ³n "Mi Cuenta" en [`NavbarUserMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/navbar/NavbarUserMenu.tsx) y [`NavbarMobileDrawer.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/navbar/NavbarMobileDrawer.tsx) para navegar directamente a la pÃ¡gina `/mi-cuenta`.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.44` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.43 - CreaciÃ³n del Directorio y Hub de Descarga de Skills (.dev/skills)
- [x] **Directorio Oficial de Skills ([.dev/skills/](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/.dev/skills/)):**
  - Creada la carpeta `.dev/skills/` en la raÃ­z con las 13 skills oficiales utilizadas en el proyecto (`arqmodular`, `codigo-eficiente`, `deploy-cloudflare-byfio`, `verificacion-deploy`, `respuesta-concisa`, `polling-inteligente`, `emil-kowalski`, `magic-ui-aceternity`, `shadcn-ui`, `taste`, `uiverse`, `premium-ecommerce-storefront`, `boveda-skills`).
  - Cada skill cuenta con su archivo normativo `SKILL.md` estructurado y documentado.
- [x] **Portal Interactivo y Botones de Descarga ([index.html](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/.dev/skills/index.html)):**
  - Desarrollada interfaz web con tarjetas individuales por skill, nombre, categorÃ­a, peso en KB, descripciÃ³n, botÃ³n de descarga directa (`Descargar SKILL.md`), botÃ³n de copiado al portapapeles y visor modal de contenido.
  - BotÃ³n masivo **"Descargar Todas (.ZIP)"** que empaqueta todas las skills en un solo archivo con 1 clic.
  - Replicado en [`public/dev/skills/`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/dev/skills/) para acceso y descarga en vivo desde Cloudflare Pages (`https://byfiocr.pages.dev/dev/skills`).
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.43` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.42 - Desacoplamiento y ModularizaciÃ³n ARQMODULAR del Navbar
- [x] **ExtracciÃ³n AtÃ³mica del Monolito Navbar ([Navbar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Aplicada la **Regla del Boy Scout** de ARQMODULAR, reduciendo `Navbar.tsx` de 758 lÃ­neas a un orquestador liviano y limpio.
  - Creado submÃ³dulo [`NavbarNavLinks.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/navbar/NavbarNavLinks.tsx) (75 lÃ­neas): Enlaces de navegaciÃ³n desktop con colores oficiales activos y textos blancos.
  - Creado submÃ³dulo [`NavbarThemeToggle.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/navbar/NavbarThemeToggle.tsx) (44 lÃ­neas): Selector neumÃ³rfico Sol/Luna.
  - Creado submÃ³dulo [`NavbarUserMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/navbar/NavbarUserMenu.tsx) (181 lÃ­neas): MenÃº de sesiÃ³n, "Mi Cuenta", accesos de rol y cierre de sesiÃ³n.
  - Creado submÃ³dulo [`NavbarMobileDrawer.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/navbar/NavbarMobileDrawer.tsx) (252 lÃ­neas): Drawer desplegable mÃ³vil/tablets independiente.
- [x] **Cero Efectos Secundarios y Cero Regresiones:**
  - Todas las rutas, props y listeners preservados al 100%.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.42` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.41 - CorrecciÃ³n de Colores y ErradicaciÃ³n de Borde Oscuro en Botones Principales
- [x] **EliminaciÃ³n Total de Borde/Contorno CafÃ© Oscuro ([Navbar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx), [index.css](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Aplicado `outline-none focus:outline-none focus:ring-0 focus-visible:outline-none` a los 4 botones principales (Inicio, Talleres, Tienda, CatÃ¡logo) en desktop y mÃ³vil.
  - Regla global `button:focus, button:focus-visible { outline: none !important; }` en CSS base para suprimir definitivamente contornos de foco no deseados del navegador.
  - Eliminados bordes y sombras cafÃ©s/Ã¡mbar oscuras (`border-amber-300/80`, `rgba(202,138,4)`, `color: #713F12`, `hover:text-amber-900`).
- [x] **Color Activo por Defecto con Fondo de Hover Oficial ([Navbar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Cada botÃ³n activo luce de forma predeterminada su color vibrante correspondiente: Inicio (Ãmbar solar cÃ¡lido), Talleres (Celeste creativo), Tienda (Morado ByFio) y CatÃ¡logo (Fucsia/Rosa corazÃ³n).
- [x] **Letras Blancas en Botones Activos y Seleccionados ([Navbar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Los 4 botones en estado activo presentan tipografÃ­a en blanco nÃ­tido (`text-white font-bold`) garantizando mÃ¡ximo contraste y legibilidad.
- [x] **BotÃ³n CatÃ¡logo en Estado Normal en Rosa Pastel Suave ([Navbar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Cuando CatÃ¡logo estÃ¡ en reposo (normal), presenta su tonalidad activa pero en una versiÃ³n suave tipo pastel (`bg-[#FCE7F3] text-pink-700 border border-pink-200/90 shadow-[0_2px_8px_rgba(219,39,119,0.15)] hover:bg-[#FBCFE8] hover:text-pink-800`).
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.41` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.40 - Color Rosa CorazÃ³n en BotÃ³n Tienda y Letras Blancas en Botones Activos
- [x] **Color Oficial Rosa CorazÃ³n en Tienda ([Navbar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - BotÃ³n de Tienda actualizado con el color rosa/fucsia caracterÃ­stico del corazÃ³n de la marca (`bg-gradient-to-r from-[#F472B6] to-[#EC4899]`) con sombra suave `shadow-[0_3px_10px_rgba(236,72,153,0.35)]`.
- [x] **Letras Blancas en los 4 Botones de NavegaciÃ³n Activos ([Navbar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Inicio, Talleres, Tienda y CatÃ¡logo muestran texto blanco nÃ­tido (`text-white`) cuando estÃ¡n en estado activo, manteniendo legibilidad y contraste Ã³ptimo sobre sus respectivos fondos.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.40` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.39 - Sombra Leve y Resalte TÃ¡ctil en Botones de NavegaciÃ³n
- [x] **ElevaciÃ³n TÃ¡ctil en Botones Principales ([Navbar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Implementada sombra leve (`shadow-[0_2px_8px_rgba(80,30,120,0.18),0_1px_3px_rgba(0,0,0,0.08)]`) y borde biselado `border-white/80` en los botones de Inicio, Talleres, Tienda y CatÃ¡logo.
  - Refuerzo en estados activos con borde delimitador y sombra suave en versiÃ³n desktop y menÃº mÃ³vil.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.39` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.38 - Bienvenida con Estrellita, Autocompletado Inteligente en Carrito y MenÃº Desplegable "Mi Cuenta"
- [x] **Alerta de Bienvenida Ãšnica con la Estrellita ([WelcomeStarModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WelcomeStarModal.tsx)):**
  - Implementado modal de bienvenida festivo activado por Ãºnica vez tras el registro exitoso del usuario o en su primer inicio de sesiÃ³n.
  - Integra video circular en bucle de la mascota oficial (`/assets/vid-estrellita.mp4`), confeti dinÃ¡mico, sonido pop y mensaje personalizado con su nombre.
  - Guarda en almacenamiento (`byfio_welcome_star_${email}` y en `REGISTERED_USERS`) para asegurar que solo se muestre una Ãºnica vez por cuenta.
- [x] **DetecciÃ³n y Autocompletado de Usuario en Carrito y Checkout ([CartDrawer.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CartDrawer.tsx), [CheckoutModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx)):**
  - En `CartDrawer`: Si el usuario estÃ¡ registrado, se despliega una tarjeta de detecciÃ³n de cuenta con su nombre, correo, telÃ©fono y direcciÃ³n lista.
  - En `CheckoutModal`: SincronizaciÃ³n automÃ¡tica de campos (`customerName`, `customerPhone`, `shippingAddress`, `customerEmail`) jalados directamente del perfil registrado, con aviso de confirmaciÃ³n visual.
  - Al generar el pedido, los datos de envÃ­o y telÃ©fono actualizados se sincronizan automÃ¡ticamente con el perfil guardado del usuario.
- [x] **MenÃº Desplegable hacia Abajo y SecciÃ³n "Mi Cuenta" ([Navbar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx), [MyAccountModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/MyAccountModal.tsx)):**
  - Al hacer clic en el nombre del usuario logeado en la barra superior o mÃ³vil, se despliega hacia abajo un menÃº interactivo con la opciÃ³n destacada **"Mi Cuenta"**.
  - **Fecha y Hora de Registro:** VisualizaciÃ³n de la fecha y hora exacta en espaÃ±ol en que fue creada la cuenta.
  - **Correo y TelÃ©fono:** VisualizaciÃ³n y ediciÃ³n del nÃºmero de contacto con guardado persistente.
  - **DirecciÃ³n en Texto y Mapa Interactivo:** Selector de ubicaciÃ³n en mapa con OpenStreetMap, pin marker ðŸ“ de coordenadas exactas, botÃ³n *"Usar mi GPS actual"*, botones direccionales de ajuste fino y enlace directo a Google Maps / Waze.
  - **SecciÃ³n de Promociones:** Cupones de descuento activos (2x1 en Stickers, EnvÃ­o Gratis en CR y 15% OFF en Talleres) con botÃ³n para copiar al portapapeles.
  - **SecciÃ³n de Ofertas:** Combos y ofertas especiales por tiempo limitado en agendas y talleres.
  - **Mis Pedidos:** Historial de compras filtrado por el usuario, mostrando fecha y hora del pedido, detalle de productos, total, botÃ³n para ver factura PDF, y estados visuales del pedido destacando con insignia verde brillante **"Empacado y listo para envÃ­o"**.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.38` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.37 - Ajuste de Pantalla Completa y Altura DinÃ¡mica para Alisto de Pedidos en MÃ³viles
- [x] **AdaptaciÃ³n Nativa a Celulares Android y iPhone ([GuidedPickingModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx)):**
  - Implementada altura dinÃ¡mica completa en celular (`h-[100dvh] sm:h-auto sm:max-h-[92vh]`) eliminando por completo el espacio vacÃ­o o filtraciÃ³n de la pantalla de pedidos en la parte inferior.
  - DiseÃ±o responsivo adaptativo: en mÃ³viles ocupa el 100% de la pantalla (`rounded-none border-0`) y en computadoras conserva la tarjeta flotante centrada (`sm:rounded-3xl sm:border-4`).
  - Incorporada protecciÃ³n para Notch y Dynamic Island en la cabecera (`pt-[max(0.75rem,env(safe-area-inset-top))]`) y para la barra de gestos inferior en iPhone/Android (`pb-[max(1.25rem,env(safe-area-inset-bottom))]`).
  - DistribuciÃ³n vertical fluida (`flex-1 flex flex-col justify-between`) para los botones de acciÃ³n de alisto y centrado automÃ¡tico en pantalla de confirmaciÃ³n.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.37` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.36 - Blindaje contra QuotaExceededError en Almacenamiento Local de Pedidos
- [x] **Parche Global contra Cuota Excedida ([safeStorage.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/safeStorage.ts)):**
  - Sobrescritura defensiva global de `window.localStorage.setItem` para interceptar `DOMException: QuotaExceededError`. Si el almacenamiento del navegador (5 MB) se satura, auto-purga claves secundarias y redirige transparentemente a memoria RAM sin quebrar la interfaz.
  - Implementado mÃ©todo `clear()` seguro tanto en `safeLocalStorage` como en `safeSessionStorage`.
- [x] **SerializaciÃ³n Ligera de Pedidos ([AppContext.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Creado `serializeOrdersForStorage` que omite imÃ¡genes base64 gigantes (`data:image`) y limita el cachÃ© local a los 50 pedidos mÃ¡s recientes, reduciendo el consumo de megabytes a solo kilobytes.
  - Envuelto el almacenamiento de sincronizaciÃ³n D1 en `try/catch` con `safeLocalStorage.setItem` erradicando fallos no controlados en `setOrders`.
- [x] **Auto-Saneamiento Total en Pantalla de Error ([ErrorBoundary.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/ErrorBoundary.tsx)):**
  - El botÃ³n *"Restablecer datos"* ejecuta limpieza completa de almacenamiento en navegador y recarga limpia sin rastros de cuota saturada.
- [x] **ActualizaciÃ³n de Service Worker:**
  - VersiÃ³n elevada a `byfio-pwa-v4.19.36` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js).

### VersiÃ³n 4.19.35 - CorrecciÃ³n CrÃ­tica de Pantalla Blanca en Tienda, Blindaje de Almacenamiento y BotÃ³n Carrito PWA Desktop
- [x] **Blindaje Defensivo en Buscador y CatÃ¡logo de Tienda ([StorePage.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/StorePage.tsx), [CatalogPage.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx), [ProductDetailModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/ProductDetailModal.tsx)):**
  - SanitizaciÃ³n estricta de propiedades de texto (`name`, `sku`, `description`, `category`) con fallbacks `|| ''` antes de invocar `.toLowerCase()` o `.includes()`, previniendo excepciones fatales de `TypeError: undefined`.
  - ValidaciÃ³n de arrays en `p.images` e imÃ¡genes auxiliares para asegurar strings vÃ¡lidos antes de comprobar placeholders.
  - ValidaciÃ³n de cantidad y precio numÃ©rico en `handleAdd` para inserciones directas al carrito seguras.
- [x] **Blindaje Total de Inicializadores y Storage ([AppContext.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Reemplazo de llamadas directas a `localStorage` por `safeLocalStorage` dentro de bloques `try/catch` para `products`, `orders`, `pricingData`, `sinpeTransactions`, `sinpeSettings` y `missingInventoryReports`.
  - NormalizaciÃ³n ultra-segura de identificadores en `normalizeModuleId` con `String(id || '').trim().toLowerCase()`.
- [x] **Auto-RecuperaciÃ³n y DiagnÃ³stico en Pantalla de Error ([ErrorBoundary.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/ErrorBoundary.tsx)):**
  - Incorporado botÃ³n interactivo *"Restablecer datos"* que purga claves corruptas de almacenamiento local (`byfio_cart_v1`, `byfio_products_v1`, etc.) y auto-sana la sesiÃ³n al recargar.
  - AÃ±adido panel visual de diagnÃ³stico con el mensaje de error tÃ©cnico capturado.
- [x] **Ajuste de Margen y Visibilidad del BotÃ³n Carrito en PWA Desktop ([Navbar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Ajustados mÃ¡rgenes laterales (`mr-0 sm:mr-1`) y flexibilidad de contenedor para erradicar el recorte del botÃ³n de Carrito en ventanas PWA de escritorio con barra de desplazamiento lateral.
  - Asegurada la lectura de nombres de usuario con fallback defensivo `(currentUser?.name || 'Usuario').split(' ')[0]`.
- [x] **ActualizaciÃ³n de Service Worker:**
  - CachÃ© PWA elevada a `byfio-pwa-v4.19.35` en [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js) para invalidaciÃ³n inmediata de assets en producciÃ³n.

### VersiÃ³n 4.19.34 - Blindaje Anti-Pantalla Blanca al Agregar Productos al Carrito
- [x] **ProtecciÃ³n Global contra Errores de Renderizado ([main.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/main.tsx), [App.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Implementado `ErrorBoundary` global de primer nivel en `main.tsx` cubriendo la raÃ­z de la aplicaciÃ³n, evitando que cualquier excepciÃ³n no capturada deje la pantalla en blanco.
  - Aislados los componentes globales de carrito (`CartSuccessToast` y `CartDrawer`) dentro de sus propios lÃ­mites de error (`ErrorBoundary`) independientes.
- [x] **Persistencia Segura y Almacenamiento a Prueba de Fallos ([AppContext.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Migrada la sincronizaciÃ³n de `cart`, `orders` y `workshops` en `useEffect` al almacenamiento seguro `safeLocalStorage` protegido con `try/catch`, blindando la aplicaciÃ³n contra excepciones de cuota excedida (`QuotaExceededError`) y modos de navegaciÃ³n privada.
  - InicializaciÃ³n blindada de `cart` desde almacenamiento verificando que el JSON parseado sea estrictamente un array vÃ¡lido con elementos filtrados.
- [x] **CÃ¡lculos e Iteraciones Defensivas en Carrito ([CartSuccessToast.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/CartSuccessToast.tsx), [Navbar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx), [StorePage.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/StorePage.tsx), [CatalogPage.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx), [CartDrawer.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CartDrawer.tsx)):**
  - Protegidas todas las operaciones `.reduce()`, `.find()` y `.map()` sobre el carrito mediante arrays seguros (`safeCart = Array.isArray(cart) ? cart.filter(Boolean) : []`) con comprobaciÃ³n de propiedades numÃ©ricas y nulas.
  - Envolvimiento con `try/catch` en `addToCart` y en el disparador `handleAdd` de la tienda.

### VersiÃ³n 4.19.33 - BotÃ³n y Flujo de Restablecimiento de ContraseÃ±a para Clientes
- [x] **BotÃ³n y Vista de Restablecimiento ([LoginModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx)):**
  - AÃ±adido botÃ³n interactivo y enlace destacado *"Â¿Olvidaste tu contraseÃ±a? Restablecer"* en el panel de inicio de sesiÃ³n.
  - Implementada vista interactiva para definir una nueva contraseÃ±a con confirmaciÃ³n, validaciÃ³n de longitud (mÃ­nimo 6 caracteres), verificaciÃ³n de coincidencia en vivo y botÃ³n de confirmaciÃ³n *"Restablecer ContraseÃ±a"*.
  - Enlace de asistencia alternativa por WhatsApp oficial de By.Fio (6400-4640) para soporte humano directo.
- [x] **Persistencia de Nueva Clave ([AppContext.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Creado mÃ©todo `resetPassword` para actualizar de forma segura y persistente la contraseÃ±a del usuario registrado en `localStorage`, con validaciÃ³n de existencia de cuenta.

### VersiÃ³n 4.19.32 - Sistema Interactivo de Registro de Usuarios en 3 Pasos con TransiciÃ³n Suave
- [x] **Asistente Interactivo de Registro en 3 Pasos ([ThreeStepRegisterForm.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/ThreeStepRegisterForm.tsx)):**
  - Implementado asistente interactivo con barra de progreso superior de 3 fases y animaciÃ³n fluida con aceleraciÃ³n natural (`animate-step-next` y `animate-step-prev`).
  - **Paso 1:** Solicitud de Nombre Completo y Correo ElectrÃ³nico, estableciendo explÃ­citamente el correo como identificador/usuario para iniciar sesiÃ³n.
  - **Paso 2:** Solicitud de TelÃ©fono de Contacto y NÃºmero de CÃ©dula de Identidad (fÃ­sica, jurÃ­dica o DIMEX).
  - **Paso 3:** CreaciÃ³n y confirmaciÃ³n de ContraseÃ±a con validaciÃ³n en vivo, resumen de la cuenta y botÃ³n final de confirmaciÃ³n *"Aceptar"*.
- [x] **IntegraciÃ³n en Modal de Acceso y NavegaciÃ³n ([LoginModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx), [Navbar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx), [App.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - PestaÃ±as neumÃ³rficas superiores para alternar al instante entre *"Iniciar SesiÃ³n"* y *"Registrarse"*.
  - BotÃ³n directo de *"Registrarse"* en la barra de navegaciÃ³n (desktop) y acceso *"Crear Cuenta (Registro 3 Pasos)"* en el menÃº lateral mÃ³vil.
  - Soporte de rutas directas `/registro` y `#registro` para abrir automÃ¡ticamente el modal en modo registro.
- [x] **Persistencia y Perfil de Usuario ([AppContext.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [index.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/types/index.ts)):**
  - Ampliada la interfaz `AuthUser` y el mÃ©todo `registerUser` para almacenar `phone` y `idCard` con guardado persistente en `localStorage`.
  - Inicio de sesiÃ³n automÃ¡tico tras el registro exitoso con animaciÃ³n festiva de confeti.

### VersiÃ³n 4.19.31 - AsignaciÃ³n y Registro DinÃ¡mico de Proveedores en CreaciÃ³n de Productos
- [x] **Selector DinÃ¡mico y Registro en el Acto de Proveedores ([NewProductModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/NewProductModal.tsx)):**
  - Incorporado selector inteligente de proveedores que combina proveedores por defecto, Ã³rdenes a proveedores existentes y catÃ¡logo de productos.
  - Habilitada creaciÃ³n instantÃ¡nea *"ahÃ­ mismo"* (`+ Nuevo`) con campo en lÃ­nea para registrar y seleccionar un proveedor nuevo sin salir del modal.
  - Funcionalidades de ediciÃ³n (renombrado) y desvinculaciÃ³n/eliminaciÃ³n con almacenamiento persistente en `localStorage`.
- [x] **Tipado y Persistencia de Proveedor ([index.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/types/index.ts)):**
  - AÃ±adido campo `supplier?: string` a la interfaz `Product`, persistido en base de datos D1 y sincronizado en tiempo real por BroadcastChannel.
- [x] **BÃºsqueda e Insignia en Inventario ([InventoryTable.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx)):**
  - VisualizaciÃ³n del proveedor asociado en cada fila de inventario junto a la ubicaciÃ³n en estante y soporte de filtrado en el buscador por nombre de proveedor.

### VersiÃ³n 4.19.30 - Enrutamiento Independiente y Exclusivo de Superadmin en /admin/superadmin
- [x] **Enrutamiento CanÃ³nico e Independiente en Superadmin ([App.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [routeHelpers.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/routeHelpers.ts)):**
  - Configurada la URL canÃ³nica `/admin/superadmin` en la navegaciÃ³n y manipulaciÃ³n de historial (`window.history.pushState`).
  - Priorizado el parser de rutas para `/admin/superadmin`, aislÃ¡ndolo de la raÃ­z pÃºblica `/` y del hub administrativo `/admin`.
  - Agregado guard `!path.startsWith('/admin/superadmin')` en las reglas genÃ©ricas de administraciÃ³n para evitar colisiones.
- [x] **Aislamiento de Interfaz y NavegaciÃ³n Limpia ([Navbar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx), [SuperadminLogin.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminLogin.tsx)):**
  - Retirados elementos de tienda (redes sociales, carrito interactivo y menÃº mÃ³vil) en la cabecera cuando se accede a `/admin/superadmin`.
  - Habilitados accesos directos bidireccionales entre "Panel Admin" (`/admin`) y "Superadmin" (`/admin/superadmin`).
- [x] **Acceso Directo desde el MenÃº de AdministraciÃ³n ([AdminHubMenu.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx)):**
  - Incorporada tarjeta directa de acceso a Superadmin Maestro (`/admin/superadmin`) para administradores.

### VersiÃ³n 4.19.29 - ActualizaciÃ³n de TÃ­tulo en Cabecera Administrativa
- [x] **Renombrado del TÃ­tulo Principal ([AdminHeader.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx)):**
  - Modificado el tÃ­tulo principal de la cabecera del panel administrativo de *"Panel de Control & Alisto QR"* a *"Panel de control y alisto"*, simplificando la nomenclatura y eliminando el sufijo tÃ©cnico QR.

### VersiÃ³n 4.19.28 - Blindaje Definitivo PWA en iOS Safari / MÃ³vil (Storage, SW y Audio)
- [x] **Blindaje de Storage en NavegaciÃ³n Privada / In-App ([index.html](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/index.html)):**
  - Implementado polyfill en memoria para `localStorage` y `sessionStorage` que previene errores fatales de cuota/permisos (`SecurityError`) en Safari iOS en modo navegaciÃ³n privada o webviews.
- [x] **PrevenciÃ³n de Bucle de Recarga en Service Worker ([main.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/main.tsx), [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js)):**
  - Evitada la recarga en el primer registro del Service Worker en iOS mediante flag `hadController`.
  - Excluidos archivos multimedia y solicitudes con cabecera `Range` del Service Worker para evitar bloqueos en WebKit iOS.
  - Actualizada la versiÃ³n de cachÃ© a `byfio-pwa-v4.19.28`.
- [x] **ProtecciÃ³n de Volumen de Audio en iOS ([WebIntroOverlay.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - Aislada la propiedad `volume` de solo lectura en iOS con `try-catch` para evitar fallos de renderizado al iniciar la aplicaciÃ³n.
- [x] **Ãmbito DinÃ¡mico en Manifest PWA ([manifest.json](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/manifest.json), [manifest.webmanifest](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/manifest.webmanifest)):**
  - Ajustado `start_url: "/"` en los manifests para permitir apertura contextual limpia tanto en el portal de colaboradores como en la tienda y administraciÃ³n.
- [x] **Carga Diferida del EscÃ¡ner de CÃ¡mara ([MobileOrdersView.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/mobile/MobileOrdersView.tsx)):**
  - Transformado `CameraBarcodeScannerModal` a importaciÃ³n diferida (`React.lazy`) para aligerar la carga inicial en dispositivos mÃ³viles.

### VersiÃ³n 4.19.27 - SoluciÃ³n Integral de Pantalla en Blanco en CÃ³digo QR de Colaborador PWA
- [x] **Blindaje de Dominio PÃºblico en CÃ³digos QR ([PwaManagerModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/PwaManagerModal.tsx)):**
  - Forzado el dominio pÃºblico oficial `https://byfiocr.pages.dev` en todos los cÃ³digos QR y enlaces compartidos cuando el administrador se encuentra en localhost o redes locales, erradicando el fallo de conexiÃ³n y pantalla en blanco en telÃ©fonos mÃ³viles.
- [x] **Enrutamiento Universal de Colaboradores ([routeHelpers.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/routeHelpers.ts)):**
  - Agregadas las rutas `/colaborador`, `/colaboradores`, `/app/colaborador` y detecciÃ³n de query params (`?app=colaborador`, `?target=colaborador`, `?pwa=colaborador`) directamente al portal PWA de instalaciÃ³n `pwa-install`, evitando pantallas vacÃ­as al escanear desde cualquier aplicaciÃ³n de cÃ¡mara.
- [x] **ProtecciÃ³n contra Excepciones y Filtrado Exclusivo de Colaboradores ([AppContext.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [PwaInstallPage.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/pwa/PwaInstallPage.tsx)):**
  - Blindadas las comparaciones de nombre de usuario contra `undefined` en `hasPermission` y sincronizaciÃ³n de perfiles.
  - En la PWA de colaboradores ahora se filtran exclusivamente los perfiles de colaboradores (`role === 'staff'`), ocultando el perfil de administraciÃ³n.
- [x] **Bumping de VersiÃ³n de CachÃ© PWA ([sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js)):**
  - Actualizado a `byfio-pwa-v4.19.21` para forzar invalidaciÃ³n de cachÃ© y entrega inmediata del bundle corregido.


### VersiÃ³n 4.19.26 - Compatibilidad Total PWA Colaboradores para Android e iOS (iPhone) con EscÃ¡ner de CÃ¡mara y Safe-Area Insets
- [x] **EscÃ¡ner de CÃ³digo de Barras con CÃ¡mara Trasera en Tiempo Real ([CameraBarcodeScannerModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/mobile/CameraBarcodeScannerModal.tsx), [MobileOrdersView.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/mobile/MobileOrdersView.tsx)):**
  - Implementado modal con escÃ¡ner activo mediante `Html5Qrcode` (`facingMode: "environment"`), compatible con navegadores mÃ³viles de Android (Chrome, Samsung Internet) e iPhone (Safari, Chrome iOS).
  - Soporte de linterna/flash (torch), retÃ­cula de enfoque animada, aviso de feedback sonoro/vibratorio y botÃ³n para ingreso de SKU manual alternativo.
  - ConexiÃ³n directa en la barra de bÃºsqueda del mÃ³dulo de alisto mÃ³vil para escanear y marcar productos en pedidos pendientes.
- [x] **Flujo de InstalaciÃ³n Adaptativo para Android e iOS ([PwaInstallPage.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/pwa/PwaInstallPage.tsx), [usePwaInstall.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/hooks/usePwaInstall.ts)):**
  - DetecciÃ³n precisa de navegadores dentro de aplicaciones (In-App Browser como WhatsApp, Instagram) en iOS, mostrando advertencia para abrir la pÃ¡gina en Safari.
  - GuÃ­a contextual para Android (1-clic nativo o menÃº de 3 puntos en Chrome) y para iPhone (botÃ³n Compartir â¬†ï¸ > "Agregar a pantalla de inicio" âž•).
  - RedirecciÃ³n automÃ¡tica al mÃ³dulo de pedidos si el usuario ya estÃ¡ autenticado o si la URL porta un parÃ¡metro de escaneo (`sku`/`scan`), eliminando mensajes de error.
  - ProtecciÃ³n de seguridad en la lista de perfiles contra objetos nulos o incompletos.
- [x] **ProtecciÃ³n Safe-Area para Notch y Barra Gestual ([MobileOrdersView.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/mobile/MobileOrdersView.tsx), [AdminMobileDock.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminMobileDock.tsx)):**
  - Cabecera fija protegida con `pt-[max(0.625rem,env(safe-area-inset-top))]` para evitar solapes con la Dynamic Island, notch o status bar de iPhone y Android.
  - Dock tÃ¡ctil inferior y espaciador protegidos con `env(safe-area-inset-bottom)` para respetar la barra gestual (Home Indicator) de iPhones y Android modernos.

### VersiÃ³n 4.19.25 - RediseÃ±o Pastel y ArmonizaciÃ³n Visual del MÃ³dulo de Pedidos y Alisto
- [x] **EliminaciÃ³n Total de Fondos Oscuros y Verdes NeÃ³n ([MobileOrdersView.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/mobile/MobileOrdersView.tsx)):**
  - Se suprimieron completamente el fondo negro (`bg-slate-950`), barras oscuras (`bg-slate-900`) y acentos verde esmeralda (`bg-emerald-600/500`) en la vista mÃ³vil de pedidos.
  - La pantalla ahora implementa el fondo cerÃ¡mico cÃ¡lido oficial (`#FAF7F2`), tarjetas blancas (`bg-white`), bordes lila suaves (`border-purple-200`) y tipografÃ­a oscura legible (`text-slate-800` y `text-fio-900`).
- [x] **Botones, PÃ­ldoras de Filtro y Checkboxes Pastel ([MobileOrdersView.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/mobile/MobileOrdersView.tsx)):**
  - Los botones de acciÃ³n para marcar pedidos ("Pasar a Empacado", "Marcar como Entregado") y checkboxes de alisto fueron renovados con gradientes suaves pastel lila/rosa (`from-purple-500 to-fio-pink`).
  - Los filtros de estado y badges se actualizaron a tonos pastel Ã¡mbar, lavanda, rosa y lila, en perfecta armonÃ­a con el resto de la tienda.
  - Los modales de teclado numÃ©rico (PIN) y ajuste de cantidades se transformaron en tarjetas blancas con botones lila pastel.
- [x] **ArmonizaciÃ³n de Pedidos Escritorio y Alisto Guiado ([OrdersQueue.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx), [GuidedPickingModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx)):**
  - Actualizados los botones principales de alisto y facturaciÃ³n, retirando fondos negros y verdes en favor de gradientes pastel lila/rosa.
- [x] **UnificaciÃ³n de Nomenclatura a 'Pedidos' ([AdminHubMenu.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx), [AdminMobileDock.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminMobileDock.tsx)):**
  - Estandarizado el botÃ³n a *"Pedidos"* en la tarjeta del Hub principal y en el botÃ³n de la barra mÃ³vil inferior.

### VersiÃ³n 4.19.24 - Renombrado de 'Hub' / 'MenÃº' a 'Inicio' en la PWA del Colaborador
- [x] **UnificaciÃ³n de Nomenclatura en Vista MÃ³vil de Pedidos ([MobileOrdersView.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/mobile/MobileOrdersView.tsx)):**
  - Cambiada la etiqueta y tÃ­tulo del botÃ³n de retorno de la cabecera en el mÃ³dulo de alisto mÃ³vil para colaboradores: reemplazado *"MenÃº"* por *"Inicio"* (`title="Ir a Inicio"`).
  - Mantiene la coherencia visual con el botÃ³n *"Inicio"* de la barra fija tÃ¡ctil inferior ([AdminMobileDock.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminMobileDock.tsx)), garantizando una experiencia intuitiva y uniforme para los colaboradores en celulares y PWA.

### VersiÃ³n 4.19.23 - Login Flotante Centrado con Fondo de Marca para PWA de AdministraciÃ³n
- [x] **Aislamiento Exclusivo de Pantalla de Login en PWA Admin ([App.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Retirados completamente el Navbar de la tienda, la decoraciÃ³n de fondo genÃ©rica, la mascota flotante, el pie de pÃ¡gina y los textos/bloques informativos previos para usuarios no autenticados en la PWA de administraciÃ³n (`/admin`).
  - La pantalla ahora presenta exclusivamente la tarjeta 3D de login centrada vertical y horizontalmente sobre el escritorio, flotando suavemente en el espacio abierto central.
- [x] **Fondo FotogrÃ¡fico de Marca Oficial ([bg-pwa-login.png](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/bg-pwa-login.png)):**
  - Incorporada como fondo completo (`bg-cover bg-center`) la fotografÃ­a de papelerÃ­a, cuadernos By.Fio, stickers y mascota estrella, con un sutil filtro ambiental que maximiza el contraste de la tarjeta.
- [x] **Acceso Directo al Panel Tras AutenticaciÃ³n ([App.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [LoginModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx)):**
  - Una vez validado el acceso (correo/contraseÃ±a o PIN), se transiciona de inmediato al panel de administraciÃ³n normal (`AdminHeader`, `AdminHubMenu`, accesos operativos y barra inferior).
  - Ocultado el enlace de auto-registro en el login administrativo (`forcedRole="admin"`) para restringir el portal exclusivamente a personal autorizado.

### VersiÃ³n 4.19.22 - Renombrado de PestaÃ±a 'Hub' a 'Inicio' en Barra Inferior PWA MÃ³vil
- [x] **ActualizaciÃ³n de Nomenclatura en Barra MÃ³vil ([AdminMobileDock.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminMobileDock.tsx)):**
  - Se sustituyÃ³ la palabra tÃ©cnica *"Hub"* por *"Inicio"* en el primer botÃ³n de navegaciÃ³n de la barra fija inferior para smartphones y PWA de administraciÃ³n.
  - Actualizado el texto informativo del botÃ³n a *"Ir a Inicio"*, manteniendo la coherencia visual con el icono de casa y facilitando la orientaciÃ³n intuitiva del usuario en pantallas tÃ¡ctiles.

### VersiÃ³n 4.19.21 - Logo PWA con Puntas Redondeadas para PC y Escritorio
- [x] **Iconos Squircle con Esquinas Curvas Anti-aliasing ([logo-byfio-512.png](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/logo-byfio-512.png), [logo-byfio-192.png](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/logo-byfio-192.png)):**
  - Generados iconos PNG optimizados con mÃ¡scara de bordes redondeados (`rx=112` en 512px, `rx=42` en 192px y `rx=440` en 2000px HD) con transparencia en las esquinas, eliminando las esquinas en Ã¡ngulo recto de 90Â°.
  - Los 4 vÃ©rtices del icono ahora cuentan con canal alfa al 0% permitiendo que la ventana, barra de tareas y acceso directo de Windows/macOS en Chrome y Edge lo muestren con curva suave integrada.
- [x] **ConfiguraciÃ³n PWA Desktop y Apple ([manifest.json](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/manifest.json), [manifest.webmanifest](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/manifest.webmanifest), [index.html](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/index.html)):**
  - Declarados los nuevos iconos con `"purpose": "any"` tanto en `manifest.json` como en `manifest.webmanifest` para forzar a los navegadores de escritorio (Windows/Mac) a utilizarlos con transparencia en lugar de estirar los maskable completos.
  - Actualizadas las etiquetas `<link rel="icon">` y `<link rel="apple-touch-icon">` en `index.html` vinculando los recursos de esquinas redondeadas en 192px y 512px.

### VersiÃ³n 4.19.20 - Retiro de 'Cobrar' y 'Agenda' en PWA de Colaboradores y CorrecciÃ³n del MenÃº Flotante
- [x] **ExclusiÃ³n Estricta de Cobrar y Agenda para Colaboradores ([AdminMobileDock.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminMobileDock.tsx)):**
  - Los botones de *"Cobrar"* (facturaciÃ³n POS) y *"Agenda"* ahora estÃ¡n ocultos y no existen en la PWA de colaboradores ni para usuarios con rol `staff`.
  - Los colaboradores disponen Ãºnicamente de los accesos pertinentes: *"Hub"* y *"Alisto"*, con un diseÃ±o equilibrado al 50% de ancho y Ã¡rea tÃ¡ctil cÃ³moda.
  - Para la administradora (rol `admin`), se mantienen los 4 accesos directos operativos completos.
- [x] **CorrecciÃ³n de NavegaciÃ³n del BotÃ³n 'Hub' en MenÃº Flotante ([App.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Solucionado el rebote que forzaba a los colaboradores con perfil exclusivo de alisto a volver a pedidos cada vez que pulsaban *"Hub"*. Ahora la auto-selecciÃ³n inicial ocurre solo al entrar y respeta el retorno voluntario al Hub principal.
- [x] **IntegraciÃ³n del MenÃº Flotante en Vista MÃ³vil de Pedidos ([MobileOrdersView.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/mobile/MobileOrdersView.tsx)):**
  - Incorporado el dock flotante tÃ¡ctil inferior en la vista dedicada de pedidos mÃ³vil y botÃ³n *"MenÃº"* en la cabecera, permitiendo alternar entre el Hub y Alisto desde cualquier secciÃ³n.

### VersiÃ³n 4.19.19 - ReproducciÃ³n Completa de Video Intro con Audio AutomÃ¡tico y Retiro de Cinta Amarilla
- [x] **CorrecciÃ³n de DuraciÃ³n y PrevenciÃ³n de Corte Prematuro ([WebIntroOverlay.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx))**:
  - Eliminado el temporizador artificial de 5 segundos que cortaba el video a la mitad; ahora se reproduce en su totalidad (10 segundos) finalizando fluidamente mediante el evento natural `onEnded`.
  - Suprimida la interrupciÃ³n prematura por buffering en `onWaiting` y ampliado el fallback de seguridad a 15 segundos.
  - Habilitada la reproducciÃ³n del video intro en todos los dispositivos (mÃ³viles y escritorio) con soporte nativo `playsInline`.
- [x] **Arranque AutomÃ¡tico con MÃºsica y Desbloqueo Inmediato ([WebIntroOverlay.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx))**:
  - Configurado el inicio del video directamente con audio activo (`muted: false`, `volume: 1.0`), con respaldo tÃ¡ctil universal para desmutear al primer toque en navegadores con directivas estrictas de autoplay.
- [x] **Retiro Definitivo de la Cinta Amarilla Inferior ([WebIntroOverlay.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx))**:
  - Eliminado el banner/cinta amarilla animada (`bg-amber-400`) situada al pie del video.
  - Estilizado el control de audio superior con efecto glassmorphism sobrio y sin tonos amarillos.

### VersiÃ³n 4.19.18 - SimplificaciÃ³n Minimalista de Botones del MenÃº Principal (Hub) en PWA de AdministraciÃ³n
- [x] **DiseÃ±o Limpio y Exclusivo de Icono y TÃ­tulo ([AdminHubMenu.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx)):**
  - Retiradas las descripciones secundarias y etiquetas badge de cada tarjeta del menÃº, mostrando Ãºnicamente el icono del mÃ³dulo y su nombre oficial.
  - Aumentado el tamaÃ±o tipogrÃ¡fico de los nombres de mÃ³dulo a `text-sm sm:text-base font-bubble font-bold` para una lectura mÃ¡s cÃ³moda, nÃ­tida y visual en la PWA y en pantallas mÃ³viles.
  - Ajustada la altura y espaciado de las tarjetas (`min-h-[105px] sm:min-h-[118px]`) con cajas de iconos mÃ¡s amplias (`w-10 h-10 sm:w-11 sm:h-11`).

### VersiÃ³n 4.19.17 - Modal Pop-Up MÃ³vil Estructurado y Celdas Limpias en Agenda PWA
- [x] **Celdas Limpias y Compactas en Agenda ([CalendarAgendaView.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/agenda/CalendarAgendaView.tsx)):**
  - En la vista mÃ³vil y PWA, cuando un horario tiene una actividad asignada solo se muestra el tÃ­tulo conciso y lo necesario (horario, categorÃ­a e indicador `ðŸ“ Detalle`), evitando desbordamientos de texto dentro de las cuadrÃ­culas horarias.
- [x] **Pop-Up de Detalle Adaptado para Celular ([AgendaDetailModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/agenda/AgendaDetailModal.tsx), [AgendaSection.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AgendaSection.tsx)):**
  - Al hacer clic en cualquier actividad de la agenda se despliega un pop-up mÃ³vil tipo bottom-sheet con animaciÃ³n suave.
  - Presenta de forma estructurada todo el contenido interno: fecha completa, rango de horas, badges de estado/categorÃ­a/prioridad, texto y notas con viÃ±etas o listas numeradas, enlace telefÃ³nico directo (`tel:`), botÃ³n de copiar notas y acciones tÃ¡ctiles inmediatas (Completar/Reabrir, Editar y Eliminar).

### VersiÃ³n 4.19.16 - EliminaciÃ³n Total de 'Entrar a Pedidos' y Modales de Entrada en el Home PÃºblico
- [x] **Retiro Definitivo del BotÃ³n 'Entrar a Pedidos' en el Home ([HeroDual.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HeroDual.tsx)):**
  - Suprimido de raÃ­z el botÃ³n *"Entrar a pedidos"* del Hero principal del Home, dejando Ãºnicamente los botones comerciales de cara al cliente: *"Tienda"* y *"Talleres Creativos"*.
  - Las herramientas de gestiÃ³n y alisto de pedidos quedan confinadas de manera exclusiva a la aplicaciÃ³n PWA para colaboradores.
- [x] **Bloqueo Absoluto de Modales de Acceso en Ruta Home ([App.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [WebIntroOverlay.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - Desactivada la inicializaciÃ³n y el renderizado de `AppEntryGatewayModal` en la ruta `home` (`currentRoute !== 'home'`), garantizando una experiencia limpia y sin ventanas emergentes de picking para los visitantes.
  - Eliminado el botÃ³n redundante de pedidos en la superposiciÃ³n de video de bienvenida del Home.

### VersiÃ³n 4.19.15 - SoluciÃ³n Integral a Prueba de VibraciÃ³n HÃ¡ptica TÃ¡ctil
- [x] **Desbloqueo de Debounce y CalibraciÃ³n FÃ­sica ([haptics.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/haptics.ts)):**
  - Corregido el bloqueo donde el escucha global de clics en fase de captura consumÃ­a el debounce antes de que el botÃ³n de prueba ejecutara su propio evento (`force = true` ahora ignora estrictamente el debounce).
  - Aumentada la duraciÃ³n base de vibraciÃ³n (de 7ms-32ms a 30ms-96ms) superando el umbral de inercia de micromotores mÃ³viles (ERM y LRA). En pruebas directas se emite un doble tap hÃ¡ptico `[dur, 45, dur]` de alta perceptibilidad.
  - Excluidos los botones de prueba (`data-haptic-test="true"`) del escucha genÃ©rico para evitar interferencias.
- [x] **Feedback HÃ¡ptico AcÃºstico Universal ([haptics.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/haptics.ts)):**
  - Incorporada sÃ­ntesis de micro-golpe tÃ¡ctil mecÃ¡nico mediante Web Audio API, garantizando retroalimentaciÃ³n inmediata tanto en PCs de escritorio como en dispositivos iOS (Safari/iPhone) donde el motor de vibraciÃ³n web estÃ¡ restringido.
- [x] **Claridad en Notificaciones de Prueba ([AdminHubMenu.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx), [AdminDesignSettingsModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminDesignSettingsModal.tsx), [PwaManagerModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/PwaManagerModal.tsx)):**
  - AÃ±adida confirmaciÃ³n en pantalla distinguiendo emisiÃ³n fÃ­sica en Android vs simulaciÃ³n tÃ¡ctil acÃºstica en ordenadores.

### VersiÃ³n 4.19.14 - Cambio de Nomenclatura a "MenÃº" en PWA de Admin y 60 Frases Nuevas para la Estrellita
- [x] **CompactaciÃ³n de BotÃ³n de NavegaciÃ³n ([Navbar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx), [App.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [AdminCatalogVisualView.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminCatalogVisualView.tsx)):**
  - Sustituida la palabra "MenÃº Principal" por "MenÃº" en el botÃ³n principal de la cabecera PWA de administraciÃ³n y en los retornos de navegaciÃ³n, optimizando el espacio horizontal en pantallas tÃ¡ctiles y mÃ³viles.
- [x] **AmpliaciÃ³n de Frases Motivacionales de la Estrellita ([FloatingMascot.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/FloatingMascot.tsx)):**
  - AÃ±adidas 60 frases adicionales, cortas, inspiradoras y 100% Ãºnicas sobre creatividad, alegrÃ­a, talleres, empaque con amor y trabajo en equipo.
  - El repertorio total asciende a 120 mensajes con selecciÃ³n aleatoria sin repeticiones inmediatas.

### VersiÃ³n 4.19.13 - Retiro de BotÃ³n Apps PWA en el Dock Flotante MÃ³vil de AdministraciÃ³n
- [x] **DepuraciÃ³n de Barra Flotante Inferior ([AdminMobileDock.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminMobileDock.tsx), [App.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx))**:
  - Eliminado el botÃ³n flotante inferior *"Apps PWA"* del menÃº dock de celular en la PWA del administrador.
  - DistribuciÃ³n equilibrada de los 4 accesos directos operativos restantes (Hub, Alisto, Cobrar y Agenda), optimizando el espacio y la pulsaciÃ³n tÃ¡ctil.

### VersiÃ³n 4.19.12 - Retiro de Indicador LED Verde, Ajuste ErgonÃ³mico de Agenda y SoluciÃ³n de Corte en BotÃ³n Carrito PWA
- [x] **Retiro de Indicador LED Verde en Barra Superior ([Navbar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx))**:
  - Eliminado el punto verde pulsante (`bg-emerald-500 animate-pulse`) que simulaba un LED activo en la barra superior del panel administrativo y en la sesiÃ³n de usuario de la cabecera.
  - Retirada la pÃ­ldora redundante en la cabecera de administraciÃ³n para mayor limpieza visual y liberaciÃ³n de espacio horizontal.
- [x] **Ajuste ErgonÃ³mico y Anti-Corte de la Agenda en PWA ([CalendarAgendaView.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/agenda/CalendarAgendaView.tsx), [CalendarTopBar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/agenda/CalendarTopBar.tsx), [App.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx))**:
  - Ampliado el contenedor principal administrativo a `max-w-[1600px]`, evitando que las columnas de dÃ­as se corten en laptops y ventanas PWA de escritorio.
  - CuadrÃ­cula semanal fluidamente escalable (`min-w-[680px] sm:min-w-[800px] lg:min-w-full`) con cabecera pegajosa (`sticky top-0 z-10`), nombres de dÃ­as abreviados adaptativos (`DAYS_NAMES_SHORT`) e insignia dominical compacta.
  - Vista adaptativa por defecto: vista diaria en telÃ©fonos mÃ³viles (<768px) con alternancia directa a vista semanal.
- [x] **Blindaje Anti-Corte de BotÃ³n Carrito en PWA de Computadora ([Navbar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx))**:
  - Reorganizado el breakpoint de navegaciÃ³n pÃºblica a `xl:flex` (y menÃº hamburguesa a `xl:hidden`), evitando el apiÃ±amiento horizontal en resoluciones de laptop y pantallas escaladas (1024px a 1366px).
  - Ocultados enlaces sociales externos en entornos PWA y perfiles administrativos/staff, liberando mÃ¡s de 120px de espacio en la barra.
  - Margen de seguridad derecho ampliado en el botÃ³n de Carrito (`mr-1 sm:mr-2`) para evitar cualquier recorte contra la barra de desplazamiento nativa de Windows.

### VersiÃ³n 4.19.12 - RestricciÃ³n Exclusiva del Modal Portal de Acceso (Tienda vs Pedidos) a MÃ³dulos PWA de Colaboradores
- [x] **RestricciÃ³n Estricta del Portal de Acceso a MÃ³dulos PWA ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`routeHelpers.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/routeHelpers.ts)):**
  - Implementado helper `isCollaboratorPwaContext` para detectar si el usuario se encuentra dentro de la PWA de colaboradores (modo standalone, rutas operativas `/pedidos-mobile`, `/alisto` o parÃ¡metros `?app=colaborador`).
  - El modal `AppEntryGatewayModal` (*Â¿CÃ³mo deseas ingresar hoy? Tienda vs Entrar a pedidos*) queda completamente bloqueado en la web pÃºblica para clientes y visitantes generales, mostrÃ¡ndose Ãºnica y exclusivamente en los mÃ³dulos PWA del personal de trabajo.
- [x] **Saneamiento de Botones Operativos en Vistas PÃºblicas ([`HeroDual.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HeroDual.tsx), [`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx), [`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - En el Hero de inicio, los visitantes ven *"Tienda"* y *"Talleres Creativos"*, mientras que el botÃ³n *"Entrar a pedidos"* se reserva para colaboradores y administradores autenticados.
  - En la barra de navegaciÃ³n mÃ³vil y en la superposiciÃ³n de video de bienvenida, el acceso a pedidos permanece oculto para clientes normales.

### VersiÃ³n 4.19.11 - ConfiguraciÃ³n de VibraciÃ³n PWA Administrador e Intensidad Calibrada 1 a 10 (Corta y Suave)
- [x] **Panel de ConfiguraciÃ³n HÃ¡ptica en PWA Administrador ([PwaManagerModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/PwaManagerModal.tsx), [AdminDesignSettingsModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminDesignSettingsModal.tsx))**:
  - Implementado interruptor tÃ¡ctil (ON/OFF) para activar o desactivar la vibraciÃ³n en clics e interacciones de la web.
  - AÃ±adido selector de intensidad tÃ¡ctil de 1 a 10 con 10 botones numÃ©ricos directos y barra slider de calibraciÃ³n fina.
  - BotÃ³n de prueba en vivo *"Probar VibraciÃ³n (Nivel X)"* para sentir la respuesta fÃ­sica en el dispositivo al instante.
  - SincronizaciÃ³n bidireccional reactiva mediante eventos personalizados (`byfio-haptics-changed`) entre todos los modales administrativos y almacenamiento seguro en `localStorage` (`byfio_pwa_vibration_enabled_v1`, `byfio_pwa_vibration_intensity_v1`).
- [x] **VibraciÃ³n Corta y Suave en Todos los Elementos de la Web ([haptics.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/haptics.ts), [App.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx))**:
  - Registrado escucha global pasivo en el documento para activar el micro-tap tÃ¡ctil al interactuar con botones (`button`), enlaces (`a`), campos de formulario (`input, select, textarea`), selectores (`[role="button"], label, .cursor-pointer`) y atributos especÃ­ficos (`[data-haptic]`).
  - CalibraciÃ³n matemÃ¡tica estricta para garantizar una vibraciÃ³n **corta y suave** (`Math.round(4 + intensity * 2.8)` ms):
    - Nivel 1: ~7ms (micro-tap sutil)
    - Nivel 5: ~18ms (tap suave estÃ¡ndar tipo smartphone nativo)
    - Nivel 10: ~32ms (tap firme pero corto, nunca invasivo ni excesivo)
  - Incorporado micro-debounce de 60ms para evitar doble pulsaciÃ³n en eventos simultÃ¡neos.
- [x] **DepuraciÃ³n de Vibraciones Bruscas en Efectos de Sonido ([soundEffects.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/soundEffects.ts))**:
  - Erradicada la vibraciÃ³n pesada de 1.6 segundos (`[350, 150, 350, 150, 600]`) en `playBubblePopSound`, `playWaterDropSound` y `playAgendaBellSound`, redirigiÃ©ndola a la respuesta hÃ¡ptica corta y suave gobernada por la configuraciÃ³n del usuario.

### VersiÃ³n 4.19.10 - OptimizaciÃ³n MÃ³vil y PrevenciÃ³n de Truncamiento en BotÃ³n MenÃº Principal
- [x] **Ajuste Responsivo del BotÃ³n MenÃº Principal ([Navbar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx))**:
  - Aplicado `shrink-0 whitespace-nowrap` tanto al botÃ³n como al texto interior de *"MenÃº Principal"* en la barra de navegaciÃ³n de administraciÃ³n, erradicando cualquier corte visual o deformaciÃ³n en pantallas mÃ³viles y PWA de celular.
  - Compactado el botÃ³n contiguo *"Volver a Tienda"* a *"Tienda"* en vistas mÃ³viles pequeÃ±as (<640px) y condensada la pÃ­ldora de usuario activo, liberando mÃ¡s de 85px de espacio horizontal en el encabezado.
- [x] **Blindaje Anti-desbordamiento en Vistas Administrativas ([App.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [AdminCatalogVisualView.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminCatalogVisualView.tsx))**:
  - Asegurada la clase `shrink-0 whitespace-nowrap` en todos los botones de *"Volver al MenÃº Principal"* en subsecciones de gestiÃ³n, garantizando legibilidad total e integridad tipogrÃ¡fica en cualquier resoluciÃ³n mÃ³vil.

### VersiÃ³n 4.19.9 - Retiro Completo de BotÃ³n de CorazÃ³n e Insignias en PWA de Admin y Colaborador
- [x] **SupresiÃ³n de BotÃ³n de Me Gusta (CorazÃ³n) en PWA ([Navbar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx))**:
  - Eliminado por completo el botÃ³n interactivo de corazÃ³n "Me Gusta" de la barra superior en el panel administrativo y para perfiles de colaborador.
  - En la barra de navegaciÃ³n general, restringido para desplegarse Ãºnicamente a clientes en la tienda y web pÃºblica.
- [x] **Limpieza Visual de la Mascota y Logotipo ([FloatingMascot.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/FloatingMascot.tsx), [BrandLogo.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/BrandLogo.tsx), [NewOrderStarAlert.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/NewOrderStarAlert.tsx))**:
  - Retirada la insignia animada de corazÃ³n sobre el botÃ³n flotante y sobre el avatar de la mascota en las PWAs de trabajo de admin y colaborador.
  - El corazÃ³n del logotipo oficial en la barra es ahora un elemento decorativo estÃ¡tico sin comportamiento de botÃ³n interactivo.

### VersiÃ³n 4.19.8 - InvalidaciÃ³n Forzada de CachÃ© PWA y Auto-Recarga en Tiempo Real
- [x] **Auto-actualizaciÃ³n de PWA y Service Worker ([sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js), [main.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/main.tsx), [_headers](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/_headers)):**
  - Implementada purga activa de cachÃ© en `sw.js` con eliminaciÃ³n de versiones obsoletas en el evento `activate`.
  - Configurado header `no-cache, no-store, must-revalidate` para `/sw.js` en Cloudflare Pages, forzando a los navegadores a chequear cambios en cada apertura.
  - AÃ±adido disparador `registration.update()` y listener `controllerchange` en `main.tsx` para recargar automÃ¡ticamente la app en clientes PWA tan pronto se publique una versiÃ³n nueva sin requerir borrado manual de datos.

### VersiÃ³n 4.19.7 - Estrellita con Mensajes Positivos Centrada en Pantalla para PWA del Admin y PWA del Colaborador
- [x] **Posicionamiento Central de la Mascota en PWA ([FloatingMascot.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/FloatingMascot.tsx)):**
  - La estrellita con los mensajes motivacionales (`vid-estrellita.mp4` y colecciÃ³n de 60 frases positivas) ahora se despliega exactamente en el centro de la pantalla (`fixed inset-0 flex items-center justify-center`) tanto en la PWA del Administrador como en la PWA del Colaborador (`/pedidos-mobile`).
  - Incorporado telÃ³n de fondo suave con efecto blur (`bg-black/45 backdrop-blur-xs`), tarjeta centrada con bordes neÃ³n y avatar circular con insignia animada de corazÃ³n.
- [x] **Saludo Personalizado y ErgonomÃ­a TÃ¡ctil ([FloatingMascot.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/FloatingMascot.tsx)):**
  - Mensaje superior adaptativo: *"Â¡Hola Fiorella! â€¢ by.fio Creativa"* para la administradora y *"Â¡Hola [Nombre]! â€¢ by.fio Equipo"* para colaboradores.
  - Efecto mÃ¡quina de escribir fluido, lectura pausada (8s), auto-despedida suave y botÃ³n principal *"Â¡A darlo todo hoy! âœ¨"* con cierre inmediato al toque o al clic en el fondo.
- [x] **Aislamiento en Web PÃºblica ([FloatingMascot.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/FloatingMascot.tsx)):**
  - Para visitantes de la tienda o catÃ¡logo pÃºblico, el asistente de WhatsApp se mantiene discretamente en la esquina inferior derecha.

### VersiÃ³n 4.19.6 - Retiro de BotÃ³n / Etiqueta de Tema ("Morado") en Encabezados Web y PWA
- [x] **Limpieza de Barra Superior en Web y PWA ([Navbar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Removido el botÃ³n `DiseÃ±o & Letra` con la etiqueta dinÃ¡mica `Morado / Oscuro / Zen` de la barra de navegaciÃ³n superior.
- [x] **Ajuste de BotÃ³n de ConfiguraciÃ³n en Admin ([AdminHeader.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx)):**
  - Retirada la pÃ­ldora indicadora `Morado` del botÃ³n `ConfiguraciÃ³n`, conservando el acceso directo a la personalizaciÃ³n sin etiquetas invasivas.
  - La selecciÃ³n y cambio de tema visual (`Moradito Original`, `Modo Zen`, `Modo Oscuro`) permanece ordenada y accesible exclusivamente en el modal interno de configuraciÃ³n.

### VersiÃ³n 4.19.5 - Retiro del BotÃ³n de Acceso RÃ¡pido a Superadmin en Modal de Inicio de SesiÃ³n de la DueÃ±a
- [x] **Aislamiento de Perfil de AdministraciÃ³n ([LoginModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx)):**
  - Eliminado el botÃ³n `âš¡ Entrar como Superadmin (1 Clic directo)` del modal de inicio de sesiÃ³n de colaboradores y administraciÃ³n.
  - Asegurada la privacidad y exclusividad del panel maestro de Superadmin, accesible Ãºnicamente mediante su ruta segura (`/panel/superadmin`).

### VersiÃ³n 4.19.4 - Blindaje Integral de Persistencia y VisualizaciÃ³n del Perfil de Alisto & Auto-llenado de Pedidos Web
- [x] **Persistencia en Base de Datos D1 ([orders.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/orders.ts)):**
  - Conectadas las columnas `picked_by` y `picked_at` en las sentencias SQL `UPDATE` y `INSERT` de la API de Cloudflare D1. Anteriormente las columnas existÃ­an pero no estaban enlazadas en los binds del query.
- [x] **Captura AutomÃ¡tica del Perfil en Contexto ([AppContext.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Actualizadas `markItemPicked`, `markAllItemsPicked` y `updateOrderStatus` para estampar `currentUser.name` en `order.pickedBy` y registrar `pickedAt`.
  - En `sanitizeOrderList`, se auto-completan pedidos histÃ³ricos al 100% de alisto sin perfil previo asignÃ¡ndoles "AdministraciÃ³n".
- [x] **VisualizaciÃ³n y Fallback Resiliente en Paneles ([OrdersQueue.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx), [MobileOrdersView.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/mobile/MobileOrdersView.tsx), [GuidedPickingModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx), [QuickBillingSection.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/QuickBillingSection.tsx)):**
  - Los badges de "AlistÃ³: [Nombre]" ahora se muestran con fallback inteligente para pedidos ya alistados, garantizando visualizaciÃ³n inmediata.
- [x] **Auto-llenado de Nombre en Pedidos Web ([CheckoutModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx)):**
  - Al realizar pedidos desde la tienda pÃºblica o checkout, si hay un usuario autenticado, su nombre y telÃ©fono se cargan automÃ¡ticamente como cliente.

### VersiÃ³n 4.19.3 - EliminaciÃ³n de Barra de Desplazamiento y Ajuste ErgonÃ³mico de PestaÃ±as en Centro de Aplicaciones PWA
- [x] **Ajuste Responsivo y SupresiÃ³n de Scrollbar ([PwaManagerModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/PwaManagerModal.tsx))**:
  - Eliminada por completo la barra de desplazamiento horizontal (`overflow-x-auto custom-scrollbar`) ubicada debajo de las pestaÃ±as del Centro de Aplicaciones PWA.
  - Reemplazada la disposiciÃ³n con scroll por un grid adaptativo (`grid grid-cols-1 sm:grid-cols-3 gap-2`) con distribuciÃ³n equilibrada al 100% del ancho del modal.
  - Sintetizadas las etiquetas de navegaciÃ³n a "ðŸ‘‘ PWA AdministraciÃ³n", "ðŸ‘¥ PWA Colaboradores" y "ðŸ“² CÃ³mo se Instala".
  - Ampliado el ancho mÃ¡ximo de la ventana modal a `max-w-4xl` (896px) para una lectura espaciosa y sin desbordamientos en cualquier pantalla.

### VersiÃ³n 4.19.2 - Renombrado Oficial de "Inventario & Etiquetas QR" a "Mis Productos"
- [x] **ActualizaciÃ³n de Nomenclatura en MÃ³dulo de Inventario ([superadminModulesData.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/superadminModulesData.ts), [AdminHubMenu.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx), [UserProfilesSection.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/UserProfilesSection.tsx), [InventoryTable.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx)):**
  - Renombrado oficialmente el mÃ³dulo de "Inventario & Etiquetas QR" por "Mis Productos" en el gestor maestro de Superadmin.
  - Actualizada la tarjeta del MenÃº Principal del Admin (Hub), la asignaciÃ³n de permisos de perfiles de usuario y el encabezado de la tabla de existencias para reflejar "Mis Productos".

### VersiÃ³n 4.19.1 - Renombrado Oficial de "Alisto Manual" a "Alistar Pedido" en Toda la Plataforma
- [x] **HomologaciÃ³n de Nomenclatura en Operaciones WMS ([OrdersQueue.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx), [GuidedPickingModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx), [superadminModulesData.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/superadminModulesData.ts))**:
  - Sustituida la frase "Alisto Manual" por "Alistar Pedido" en todos los botones primarios, tÃ­tulos de modales guiados, tooltips y opciones de cambio de modo de alisto.
  - Actualizado el catÃ¡logo maestro de mÃ³dulos en Superadmin para reflejar formalmente la funcionalidad con el nombre "Alistar Pedido".

### VersiÃ³n 4.19.0 - Control de Visibilidad de CatÃ¡logo en Admin, Nueva Vista Visual con Slider de Estrellitas y SincronizaciÃ³n de Stock vs Disponibilidad RÃ¡pida
- [x] **SincronizaciÃ³n Total de Stock vs Disponibilidad RÃ¡pida ([InventoryTable.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx), [SuperadminSection.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminSection.tsx), [AppContext.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Solucionado el fallo donde el switch de disponibilidad rÃ¡pida en Superadmin no afectaba al panel admin: ahora al activarse o desactivarse conmuta de inmediato el `inventoryMode`.
  - La columna y las celdas de "Stock Actual" ahora se desactivan y ocultan por completo cuando el control de stock estÃ¡ desactivado o se encuentra en modo de disponibilidad rÃ¡pida.
  - AÃ±adida pÃ­ldora de alternancia de modo (`ðŸ“¦ Stock NumÃ©rico` / `âš¡ Disponibilidad RÃ¡pida`) en la barra de filtros del inventario del administrador cuando ambos modos estÃ¡n habilitados.
- [x] **Control InstantÃ¡neo del CatÃ¡logo PÃºblico por el Administrador ([AdminDesignSettingsModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminDesignSettingsModal.tsx), [AdminHubMenu.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx), [Navbar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Incorporado interruptor en el modal de ConfiguraciÃ³n y en el MenÃº Principal (Hub) para activar o desactivar la secciÃ³n y botÃ³n del catÃ¡logo en la web.
  - Al pulsar el check y guardar, la barra de navegaciÃ³n pÃºblica (escritorio y mÃ³vil) oculta instantÃ¡neamente el botÃ³n "CatÃ¡logo", y la ruta `/catalogo` redirige a portada.
- [x] **Nueva Vista Visual de CatÃ¡logo en Panel Admin ([AdminCatalogVisualView.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminCatalogVisualView.tsx), [AdminTabs.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx), [App.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - DiseÃ±ada la vista exclusiva sin barra de informaciÃ³n administrativa ni KPIs, con encabezado minimalista que incluye Ãºnicamente el logotipo de By.Fio y el tÃ­tulo "CatÃ¡logo Digital Online".
  - Slider dinÃ¡mico automÃ¡tico alternando entre el banner oficial de las estrellitas (`vid-estrellita.mp4`) y el banner de catÃ¡logo online ByFio (`imagen-catalogo-digital.jpeg`).
  - CuadrÃ­cula orientada a fotografÃ­as de alta resoluciÃ³n con precios en â‚¡, ubicaciÃ³n fÃ­sica de estante y modal tÃ¡ctil de vista previa.
- [x] **Permisos y MÃ³dulos de Superadmin ([superadminModulesData.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/superadminModulesData.ts)):**
  - AÃ±adidas las subfuncionalidades `catalog_public_button` y `catalog_admin_visual_view` en el mÃ³dulo de CatÃ¡logo de Superadmin para habilitar o restringir el botÃ³n pÃºblico o la vista visual interna.

### VersiÃ³n 4.18.1 - Ocultamiento del BotÃ³n Superadmin en el Panel de AdministraciÃ³n de la PWA
- [x] **PrivatizaciÃ³n Total del Acceso a Superadmin ([AdminHeader.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx)):
  - Removido el botÃ³n Superadmin de la barra de acciones del panel de control de administraciÃ³n y PWA.
  - El administrador del comercio y colaboradores no visualizan ningÃºn enlace al gestor maestro de Superadmin en su panel de trabajo.
  - El acceso a Superadmin se mantiene estrictamente reservado para desarrolladores vÃ­a URL directa y credenciales maestras de seguridad.

### VersiÃ³n 4.18.0 - CorrecciÃ³n de Fallo Fatal al Escanear Producto en PWA & Soporte Integral de EscÃ¡ner y ModificaciÃ³n en MÃ³vil
- [x] **ErradicaciÃ³n del Error "Inconveniente al cargar el portal de instalaciÃ³n" ([PwaInstallPage.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/pwa/PwaInstallPage.tsx)):**
  - Resuelto el `TypeError: Cannot read properties of undefined (reading 'icon')` derivado de la clave obsoleta `'alisto'` en la inicializaciÃ³n de estado tras la unificaciÃ³n del ecosistema PWA.
  - Implementado inicializador seguro sÃ­ncrono que detecta el parÃ¡metro `?app=admin` o asigna por defecto `colaborador`, blindando `currentApp` y `AppIcon` con fallback permanente para impedir cualquier caÃ­da del `ErrorBoundary`.
- [x] **Blindaje y DelimitaciÃ³n QuirÃºrgica del Router ([routeHelpers.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/routeHelpers.ts)):**
  - Restringido el portal de instalaciÃ³n PWA exclusivamente a rutas exactas (`/instalar`, `/instalar-app`), eliminando interceptaciones indebidas de rutas como `/app`, `/app/*` o lecturas de query params.
  - Habilitado soporte explÃ­cito de rutas mÃ³viles de alisto (`/alisto`, `/picking`, `/app/pedidos`, `/pedidos-mobile`) para direccionar sin fricciÃ³n hacia la vista mÃ³vil de pedidos.
- [x] **Soporte de Escaneo LÃ¡ser y ModificaciÃ³n de Cantidad en Celular ([MobileOrdersView.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/mobile/MobileOrdersView.tsx)):**
  - Incorporado procesamiento automÃ¡tico de escaneo por URL (`?sku=...`, `?scan=...`, `?barcode=...`) y por teclado lÃ¡ser / tecla Enter en la barra de bÃºsqueda para marcar de inmediato el artÃ­culo como alistado con confirmaciÃ³n sonora y toast flotante.
  - AÃ±adido botÃ³n y modal tÃ¡ctil "Modificar" en cada producto para que el operario de alisto pueda registrar existencias menores encontradas en estante y actualizar la cantidad en tiempo real.

### VersiÃ³n 4.17.10 - CorrecciÃ³n de BotÃ³n Carrito Cortado en PWA de Escritorio & Adaptabilidad Responsive en Navbar
- [x] **Ajuste de Ancho y Contenedor de Encabezado ([Navbar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Ampliado el contenedor central de `max-w-7xl` (1280px) a `max-w-[1600px]`, aprovechando pantallas de escritorio y monitores de alta resoluciÃ³n sin estrangular los elementos de navegaciÃ³n.
  - AÃ±adido margen de seguridad `mr-0.5 sm:mr-1` y `shrink-0` al botÃ³n neumÃ³rfico del Carrito para garantizar separaciÃ³n fÃ­sica respecto al borde de ventana y barra de desplazamiento vertical en la PWA de escritorio.
- [x] **DistribuciÃ³n DinÃ¡mica de Elementos en Navbar ([Navbar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Slogan de marca bajo demanda (`hidden 2xl:block`): en resoluciones estÃ¡ndar de laptop o PWA de escritorio (<1536px) muestra el logotipo compacto sin slogan, liberando ~140px de espacio horizontal.
  - Ãconos sociales de TikTok e Instagram optimizados a `hidden 2xl:flex`, recuperando ~75px adicionales.
  - BotÃ³n de "Me Gusta": texto reducido a Ã­cono tÃ¡ctil interactivo en resoluciones intermedias (`hidden 2xl:inline`), preservando el estado de feedback y ahorrando ~60px.
  - PÃ­ldora de usuario administrador: texto "Pedidos" optimizado a `hidden xl:inline` y ancho mÃ¡ximo refinado, erradicando cualquier desbordamiento o recorte horizontal del botÃ³n "Carrito" en cualquier tamaÃ±o de pantalla.

### VersiÃ³n 4.17.9 - Trazabilidad de Alisto: Registro y VisualizaciÃ³n del Nombre del Perfil que AlistÃ³ el Pedido
- [x] **Persistencia y Trazabilidad del Perfil de Alisto ([AppContext.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [types/index.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/types/index.ts), [orders.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/orders.ts)):**
  - Incorporados los campos `pickedBy` y `pickedAt` en el modelo de datos del pedido y en la base de datos Cloudflare D1.
  - Al completar el alisto (manual, escÃ¡ner o masivo), el sistema captura automÃ¡ticamente el nombre del perfil activo del colaborador (`currentUser.name`) o administrador y la marca de tiempo exacta.
- [x] **VisualizaciÃ³n Omnipresente en Paneles ([OrdersQueue.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx), [MobileOrdersView.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/mobile/MobileOrdersView.tsx), [GuidedPickingModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx), [QuickBillingSection.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/QuickBillingSection.tsx)):**
  - **Cola de Pedidos (PC):** Badge destacado *"AlistÃ³: [Nombre]"* con hora de preparaciÃ³n visible en todas las etapas (Alisto, En Empaque, Empacados y Terminados).
  - **App MÃ³vil de Pedidos (Celular):** Franja superior con Ã­cono y nombre subrayado del colaborador responsable del alisto.
  - **Modal de Alisto Guiado y FacturaciÃ³n RÃ¡pida:** Resumen de cierre indicando formalmente el colaborador que procesÃ³ la orden.

### VersiÃ³n 4.17.9 - UnificaciÃ³n de PWA para Colaboradores en una Sola AplicaciÃ³n DinÃ¡mica por Permisos
- [x] **UnificaciÃ³n de la PWA de Colaboradores ([PwaManagerModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/PwaManagerModal.tsx)):**
  - Erradicada la dispersiÃ³n de 4 aplicaciones separadas en el panel PWA; sustituida por una Ãºnica aplicaciÃ³n oficial: App Colaborador By.Fio.
  - Centralizado un Ãºnico enlace de instalaciÃ³n /instalar-app?app=colaborador, botÃ³n de compartir por WhatsApp y cÃ³digo QR unificado para todo el equipo de trabajo.
- [x] **ActivaciÃ³n Funcional 100% Gobernada por Permisos ([PwaInstallPage.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/pwa/PwaInstallPage.tsx)):**
  - Al ingresar con su cÃ³digo PIN, la aplicaciÃ³n Ãºnica evalÃºa los permisos activos del colaborador en tiempo real:
    - Si Ãºnicamente tiene permisos de Alisto, abre directamente la interfaz tÃ¡ctil de bodega y picking.
    - Si cuenta con permisos de facturaciÃ³n, agenda, empaque o inventario, despliega el panel administrativo adaptado exclusivamente a sus mÃ³dulos autorizados.

### VersiÃ³n 4.17.8 - BotÃ³n Desactivar MÃ³dulo Completo y Modo Ocultar Nombre con Funcionalidades Activas en Superadmin
- [x] **Control Dual de MÃ³dulos en Superadmin ([SuperadminModuleCard.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminModuleCard.tsx), [SuperadminSection.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminSection.tsx)):
  - AÃ±adido el botÃ³n Desactivar Todo el MÃ³dulo: apaga por completo el mÃ³dulo y desmarca todas sus funcionalidades en 1 clic (sin ningÃºn check, ni el mÃ³dulo ni las funcionalidades operan).
  - Implementado el check Ocultar el nombre en Admin: oculta el mÃ³dulo y su nombre de la vista y menÃºs del panel de administraciÃ³n, pero preserva activas las funcionalidades que el Superadmin mantenga marcadas con check (ej: control de stock en tienda, existencias, alertas, etc. siguen funcionando en segundo plano).
- [x] **EvaluaciÃ³n Independiente de Funcionalidades ([AppContext.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):
  - Actualizada isFeatureEnabled para responder directamente al estado individual de cada check, permitiendo que funciones en segundo plano permanezcan habilitadas cuando el mÃ³dulo estÃ¡ oculto en la vista del administrador.
- [x] **BotÃ³n Guardar Cambios con ConfirmaciÃ³n en Tiempo Real ([SuperadminSection.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminSection.tsx)):
  - AÃ±adido botÃ³n destacado de guardado con feedback visual y sincronizaciÃ³n inmediata hacia Cloudflare D1.

### VersiÃ³n 4.17.8 - Portal Especializado de Descarga PWA & Onboarding con CÃ³digo PIN para Enlaces Compartidos
- [x] **Flujo Guiado de Descarga & PIN ([PwaInstallPage.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/pwa/PwaInstallPage.tsx)):**
  - Desarrollada la vista dedicada /instalar-app que recibe al usuario al abrir un enlace compartido de cualquier aplicaciÃ³n PWA (Administradora, Alisto, Empaque, POS o Agenda).
  - **Paso 1 (Descarga / InstalaciÃ³n):** GuÃ­a al usuario segÃºn su dispositivo para descargar e instalar la app en su pantalla de inicio (promptInstall con 1 clic en Android/Chrome/Edge, y guÃ­a de 3 pasos en iOS Safari).
  - **Paso 2 (CÃ³digo de Acceso PIN):** Tras la descarga (o al abrir desde el icono instalado en modo standalone), presenta el teclado numÃ©rico tÃ¡ctil y el selector de perfil para ingresar el PIN de 4 dÃ­gitos y desbloquear el acceso directo a la aplicaciÃ³n.
- [x] **Enrutamiento y SincronizaciÃ³n de Enlaces Compartidos ([routeHelpers.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/routeHelpers.ts), [PwaManagerModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/PwaManagerModal.tsx), [App.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Los botones de Copiar Enlace, Compartir por WhatsApp y los cÃ³digos QR del Centro PWA generan automÃ¡ticamente enlaces /instalar-app?app=[id], asegurando que cada colaborador pase por el flujo de instalaciÃ³n y autenticaciÃ³n con PIN.

### VersiÃ³n 4.17.7 - HomologaciÃ³n Exacta de Nombres y Descripciones entre Panel Principal y Permisos de Usuarios
- [x] **UnificaciÃ³n Total de Nombres y Descripciones ([AdminHubMenu.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx), [UserProfilesSection.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/UserProfilesSection.tsx)):
  - Homologados los nombres de los mÃ³dulos para erradicar cualquier discrepancia: Cola de Pedidos (antes rotulado como Pedidos & Alisto QR en permisos) y Perfiles de Usuarios (antes GestiÃ³n de Perfiles).
  - Integrada la descripciÃ³n funcional exacta en las tarjetas del MenÃº Principal del Administrador y en la lista de permisos/modal de perfiles (Cola de pedidos, escaneo de picking y empaque, Crear, editar o revocar accesos a otros usuarios, etc.).
  - AÃ±adido tooltip informativo con tÃ­tulo y descripciÃ³n completa en los chips de mÃ³dulos autorizados de cada perfil de colaborador.

### VersiÃ³n 4.17.7 - ErradicaciÃ³n de Menciones TÃ©cnicas "D1 En Vivo" en PWA MÃ³vil y Modales
- [x] **Limpieza Visual en PWA MÃ³vil ([MobileOrdersView.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/mobile/MobileOrdersView.tsx)):**
  - Eliminada la etiqueta y el punto verde pulsante "D1 En Vivo" de la cabecera de la aplicaciÃ³n mÃ³vil de pedidos para celular (administrador y colaboradores).
- [x] **Limpieza en Modales de Entrada ([AppEntryGatewayModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/AppEntryGatewayModal.tsx)):**
  - Reemplazada la referencia tÃ©cnica a la base de datos por un rÃ³tulo limpio y profesional: "Sincronizado en tiempo real".

### VersiÃ³n 4.17.6 - Centro de Aplicaciones PWA Adaptativas para Administradora (PC y Celular) y Colaboradores
- [x] **PWA Oficial Multi-versiÃ³n ([manifest.webmanifest](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/manifest.webmanifest), [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js), [usePwaInstall.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/hooks/usePwaInstall.ts)):**
  - Registro de manifiesto web PWA con accesos directos dinÃ¡micos, soporte offline Network-First y detector reactivo de modo standalone e instalabilidad.
- [x] **PWA Administradora para 2 Dispositivos (Computadora & Celular) ([PwaManagerModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/PwaManagerModal.tsx)):**
  - **PWA Computadora / PC:** Experiencia en ventana independiente sin barras de navegador, multiventana y optimizada para pantallas anchas en oficina/estudio.
  - **PWA Celular / MÃ³vil:** Experiencia 100% tÃ¡ctil para smartphone, botones de 48px al alcance del pulgar, alertas push sonoras con campanilla arpegiada y teclado numÃ©rico de PIN.
  - CÃ³digo QR dinÃ¡mico para escanear desde la pantalla de la PC y abrir al instante la app administradora en el celular.
- [x] **Generador de Aplicaciones para Colaboradores con Copiar y Compartir ([PwaManagerModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/PwaManagerModal.tsx)):**
  - GeneraciÃ³n de aplicaciones especÃ­ficas por rol: *App Alisto & Bodega* (oculta ventas/montos para mÃ¡xima privacidad), *App Empaque & EnvÃ­os*, *App Mostrador POS* y *App Agenda del Taller*.
  - BotÃ³n individual de **Copiar Enlace** con notificaciÃ³n tÃ¡ctil y botÃ³n de **Compartir por WhatsApp / Web Share API** con mensaje pre-redactado para enviar a los colaboradores con 1 clic.
  - CÃ³digos QR individuales para escanear en taller o bodega.
- [x] **DiseÃ±o Adaptativo con Dock TÃ¡ctil MÃ³vil ([AdminMobileDock.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminMobileDock.tsx), [AdminHubMenu.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx), [AdminHeader.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx)):**
  - Dock tÃ¡ctil inferior flotante en celulares para alternar entre Hub, Alisto, Cobro, Agenda y Apps PWA en 1 toque.
  - Tarjeta ejecutiva integrada en el MenÃº Principal (Hub) para gestiÃ³n y conmutaciÃ³n Ã¡gil de la PWA.



### VersiÃ³n 4.17.6 - Exclusividad del Control de Stock en Superadmin y Limpieza del Panel Admin
- [x] **Aislamiento Exclusivo del Control de Stock en Superadmin ([SuperadminSection.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminSection.tsx)):**
  - Los botones interactivos [Desactivar stock de inventario / Activar stock de inventario] y [Desactivar disponibilidad de producto / Activar disponibilidad de producto] operan de forma exclusiva dentro del panel de Superadmin (/panel/superadmin).
- [x] **EliminaciÃ³n Total de Controles de Stock del Panel de AdministraciÃ³n ([AdminHeader.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx), [InventoryTable.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx)):**
  - Removido el botÃ³n de acceso rÃ¡pido de stock de la cabecera del panel administrativo.
  - Eliminado el banner conmutador de modos y botones de conmutaciÃ³n dentro de la tabla de inventario del administrador, preservando la vista operativa limpia y garantizando que solo Superadmin gobierne el modo de inventario del sitio.

### VersiÃ³n 4.17.5 - Visibilidad Inmediata y Omnipresente del Control de Stock / Disponibilidad (Superadmin y Admin)
- [x] **Panel Superadmin ([SuperadminSection.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminSection.tsx)):**
  - Reubicada la tarjeta interactiva de "Control de Stock & Disponibilidad de Producto" al inicio absoluto del panel Superadmin (directamente debajo de las mÃ©tricas maestras).
  - Integrados los botones directos [Desactivar / Activar stock de inventario] y [Desactivar / Activar disponibilidad de producto] para alternar modos en vivo con un solo clic.
  - Actualizado el indicador de mÃ©tricas principales mostrando el modo activo: "Stock NumÃ©rico" vs "Disponibilidad".
- [x] **Cabecera del Panel de AdministraciÃ³n ([AdminHeader.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx)):**
  - AÃ±adido botÃ³n rÃ¡pido de conmutaciÃ³n [Desactivar stock / Activar stock] junto a ConfiguraciÃ³n para acceso instantÃ¡neo desde cualquier vista del panel.
- [x] **Tabla de Inventario ([InventoryTable.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx)):**
  - VerificaciÃ³n dual de flags de disponibilidad (product_availability_mode e inventory_availability_mode) garantizando compatibilidad y persistencia del modo seleccionado.
- [x] **CatÃ¡logo de MÃ³dulos Superadmin ([superadminModulesData.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/superadminModulesData.ts)):**
  - Clarificados los nombres de las funcionalidades a "Control y Columna de Stock NumÃ©rico (Activar / Desactivar Stock)" y "Control de Disponibilidad RÃ¡pida de Productos (Activar / Desactivar)".

### VersiÃ³n 4.17.4 - SincronizaciÃ³n Inmediata Online de Permisos de Colaboradores en Tiempo Real
- [x] **SincronizaciÃ³n Bidireccional en Vivo (0ms BroadcastChannel + 4s Cloud D1 Polling):**
  - Cuando el administrador activa o desactiva cualquier permiso o el perfil de un colaborador, los cambios se transmiten de inmediato a todas las pestaÃ±as y dispositivos mediante BroadcastChannel, eventos de ventana yfio_user_profiles_updated, storage y persistencia en Cloudflare D1.
- [x] **EvaluaciÃ³n DinÃ¡mica de Permisos y ExpulsiÃ³n AutomÃ¡tica ([AppContext.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [App.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):
  - La funciÃ³n hasPermission evalÃºa en caliente el perfil activo en userProfiles, garantizando que cualquier cambio en los accesos se refleje al instante sin depender de sesiones desactualizadas.
  - Si se revoca el permiso de una secciÃ³n en la que el colaborador se encuentra navegando, el sistema lo expulsa automÃ¡ticamente al MenÃº Principal (Hub).
  - Si se desactiva o elimina el perfil del colaborador, la sesiÃ³n se revoca en el acto con cierre inmediato (logoutUser).
- [x] **GestiÃ³n Integral de MÃ³dulos ([UserProfilesSection.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/UserProfilesSection.tsx)):
  - AÃ±adido el control de permisos para Historial de Ventas (sales) en la ediciÃ³n y creaciÃ³n de perfiles.

### VersiÃ³n 4.17.3 - ErradicaciÃ³n Total de Botones de MenciÃ³n y Migas de Pan (TreeNavigation)
- [x] **EliminaciÃ³n Definitiva de Etiquetas de UbicaciÃ³n ([TreeNavigation.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/TreeNavigation.tsx)):**
  - Desactivado por completo el componente de menciÃ³n y migas de pan (â­ by.fio / pÃ¡gina actual) en toda la aplicaciÃ³n.
  - Erradicadas las etiquetas de ubicaciÃ³n que aparecÃ­an en la parte superior al navegar en CatÃ¡logo, Tienda, Talleres y Detalle de Talleres.
  - Las vistas mantienen una cabecera limpia, despejada y enfocada directamente en el contenido sin duplicidad de menciÃ³n.
### VersiÃ³n 4.17.2 - Ocultamiento de Acceso a Propuesta en NavegaciÃ³n PÃºblica del Home
- [x] **PrivatizaciÃ³n de Acceso a Propuesta ([Navbar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Removidos los botones "Propuesta" y "ðŸ“‹ Propuesta Partner" de la barra de navegaciÃ³n pÃºblica de escritorio y menÃº mÃ³vil en la pÃ¡gina de inicio (home).
  - La propuesta comercial permanece preservada para uso interno en el panel de AdministraciÃ³n ([AdminHeader.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx), [AdminHubMenu.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx)), panel de Superadmin y mediante enlace directo (`/propuesta`).

### VersiÃ³n 4.17.1 - Notificaciones Push y Alerta Sonora en Celular para Pedidos en Tiempo Real
- [x] **Sistema de Notificaciones Push Nativas y Alerta Sonora ([pushNotifications.ts](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/pushNotifications.ts), [sw.js](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/sw.js)):**
  - Implementada integraciÃ³n nativa con la Web Push API y Service Worker para telÃ©fonos mÃ³viles (Android Chrome e iOS Safari PWA).
  - Al ingresar un nuevo pedido en tiempo real, el celular emite la campanilla sonora de orden (chime arpegiado a alto volumen) y patrÃ³n de vibraciÃ³n hÃ¡ptica ([350ms, 150ms, 350ms, 150ms, 600ms]).
  - Despliegue de notificaciÃ³n nativa con nÃºmero de orden, nombre del cliente y monto total en colones, abriendo directamente la vista de pedidos al pulsar.
- [x] **Barra de Control y Prueba RÃ¡pida en Celular ([MobileOrdersView.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/mobile/MobileOrdersView.tsx)):**
  - AÃ±adida barra de estado de notificaciones en la vista mÃ³vil de pedidos con botÃ³n *"Activar Notificaciones"* y botÃ³n *"Probar Alerta"* para comprobar el timbre sonoro y la vibraciÃ³n en vivo.
  - La vista `/pedidos` activa la recepciÃ³n sonora permanente garantizando que los colaboradores en el estudio o taller escuchen el timbre inmediatamente al entrar una compra.

### VersiÃ³n 4.17.0 - Vista MÃ³vil Separada de GestiÃ³n de Pedidos y Selector de Entrada Dual
- [x] **Vista MÃ³vil Independiente para GestiÃ³n de Pedidos ([MobileOrdersView.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/mobile/MobileOrdersView.tsx)):**
  - Creada interfaz de operaciones dedicada para smartphones y tablets en ruta `/pedidos` y `/pedidos-movil`.
  - Estilos propios estilo consola oscura de operaciones, separada del diseÃ±o de la tienda pÃºblica (sin cabecera pÃºblica, sin pie de pÃ¡gina ni mascotas).
  - ConexiÃ³n directa en tiempo real a la base de datos Cloudflare D1 con indicador de sincronizaciÃ³n en vivo y botÃ³n de recarga manual.
  - Barra de bÃºsqueda instantÃ¡nea por nÃºmero de orden, cliente, telÃ©fono o producto.
  - PestaÃ±as con contadores en tiempo real: Todos, Por Alistar, En Empaque, Empacados y Terminados.
- [x] **AdaptaciÃ³n por Perfil de Usuario y Permisos:**
  - **Perfil Operario de Alisto / Bodega:** Vista operativa enfocada exclusivamente en el alisto de productos (SKU, cantidad, estante, personalizaciones solicitadas y checklist tÃ¡ctil con barra de progreso). Oculta datos financieros, montos y configuraciones para mÃ¡xima privacidad y concentraciÃ³n.
  - **Perfil AdministraciÃ³n (Fio / Gerencia):** Acceso total con totales en colones, estado de pago (Pagado/Pendiente), botÃ³n directo a WhatsApp del cliente (`https://wa.me/506...`), direcciÃ³n con copia rÃ¡pida y controles completos de cambio de estado.
  - Teclado numÃ©rico tÃ¡ctil de PIN integrado para alternar de perfil en 2 segundos sin salir de la vista.
- [x] **Compuerta de Entrada Dual ("Tienda" y "Entrar a pedidos") ([AppEntryGatewayModal.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/AppEntryGatewayModal.tsx), [HeroDual.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HeroDual.tsx), [WebIntroOverlay.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx), [Navbar.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Al ingresar a la aplicaciÃ³n se ofrecen dos botones mandatorios de alto impacto:
    1. **"Tienda":** Acceso directo a la tienda pÃºblica, catÃ¡logo y talleres.
    2. **"Entrar a pedidos":** Acceso inmediato a la nueva vista separada optimizada para mÃ³viles de pedidos.
  - Integrado en modal de entrada de bienvenida, en el Hero principal y en la intro con video.

### VersiÃ³n 4.16.23 - Sistema SemiautomÃ¡tico y JerarquÃ­a de 3 Modalidades SINPE MÃ³vil
- [x] **Arquitectura de 3 Modalidades de SINPE MÃ³vil ([SinpePaymentsSection.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SinpePaymentsSection.tsx)):**
  - **Sistema 1 (AutomÃ¡tico por Gmail - 0% ComisiÃ³n):** Especificado que si el cliente NO tiene sistema de confirmaciÃ³n de correo en su banco, NO se puede instalar este sistema.
  - **Sistema 2 (SemiautomÃ¡tico por Referencia y SMS - 0% ComisiÃ³n):** SoluciÃ³n cuando no se cuenta con confirmaciÃ³n de correo. El cliente ingresa el nÃºmero de referencia en el producto; el administrador lo contrasta contra el SMS/notificaciÃ³n en su celular y pulsa "Confirmar Pago" para acreditarlo en caja.
  - **Sistema 3 (Pasarela Bancaria Directa - 1.5% ComisiÃ³n):** OpciÃ³n automatizada para comercios en el RÃ©gimen Simplificado cuando no se utilice el sistema semiautomÃ¡tico.
- [x] **SincronizaciÃ³n en Propuesta Comercial ([PropuestaPage.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/propuesta/PropuestaPage.tsx)):**
  - Micro-nota de la ficha de SINPE MÃ³vil y resumen de propuesta actualizados con la jerarquÃ­a de los 3 sistemas.

### VersiÃ³n 4.16.22 - Micro-Nota en Ficha de SINPE MÃ³vil
- [x] **Micro-Nota Estilizada en la Ficha de Propuesta ([PropuestaPage.tsx](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/propuesta/PropuestaPage.tsx)):**
  - AÃ±adida micro-nota al pie de la ficha del MÃ³dulo de SINPE MÃ³vil: *"Este servicio estÃ¡ incluido siempre y cuando el sistema del cliente permita el reenvÃ­o de correos o en caso de poder usar el sistema bajo comisiÃ³n con confirmaciÃ³n bancaria directa."*
  - Formato discreto y elegante (`text-[10px]`), borde sutil de separaciÃ³n y asterisco esmeralda.
  - Sincronizado en el texto de resumen copiable de la propuesta comercial.

### VersiÃ³n 4.16.21 - ReubicaciÃ³n de Condiciones SINPE MÃ³vil al Interior del MÃ³dulo
- [x] **Limpieza de Cara Exterior de la Tarjeta ([`PropuestaPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/propuesta/PropuestaPage.tsx)):**
  - Removido el bloque extenso de condiciones de la cara exterior de la tarjeta en la propuesta comercial.
  - La tarjeta exterior conserva exclusivamente su informaciÃ³n bÃ¡sica limpia, estÃ©tica y concisa.
- [x] **UbicaciÃ³n Exclusiva al Interior del MÃ³dulo ([`SinpePaymentsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SinpePaymentsSection.tsx)):**
  - Al ingresar al mÃ³dulo mediante *"Ver MÃ³dulo Sinpe MÃ³vil"*, se despliega en su interior la secciÃ³n completa con las dos opciones:
    1. **OpciÃ³n 1 (0% ComisiÃ³n):** CondiciÃ³n de instalaciÃ³n sujeta a recepciÃ³n de correos de verificaciÃ³n en bandeja de Gmail.
    2. **OpciÃ³n 2 (Pasarela 1.5% ComisiÃ³n):** ConfirmaciÃ³n automÃ¡tica instantÃ¡nea para negocios inscritos en el RÃ©gimen Simplificado.

### VersiÃ³n 4.16.20 - EspecificaciÃ³n de Condiciones de InstalaciÃ³n SINPE MÃ³vil y Modalidad Alternativa con Pasarela al 1.5%
- [x] **Condiciones de InstalaciÃ³n y RecepciÃ³n Gmail ([`SinpePaymentsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SinpePaymentsSection.tsx), [`PropuestaPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/propuesta/PropuestaPage.tsx)):**
  - Renombrado y estandarizado oficial: *"MÃ³dulo de Pagos y RecepciÃ³n SINPE MÃ³vil"*.
  - Incorporada especificaciÃ³n explÃ­cita de instalaciÃ³n: la modalidad directa de verificaciÃ³n de comprobantes opera al **0% de comisiÃ³n**, bajo la condiciÃ³n tÃ©cnica obligatoria de que el usuario / comercio reciba los correos de verificaciÃ³n bancaria en una bandeja de **Gmail**.
- [x] **SecciÃ³n de Modalidad Alternativa con Pasarela de Pagos (1.5% ComisiÃ³n) ([`SinpePaymentsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SinpePaymentsSection.tsx), [`PropuestaPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/propuesta/PropuestaPage.tsx), [`CashRegisterReports.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/CashRegisterReports.tsx), [`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx)):**
  - AÃ±adida secciÃ³n informativa destacada sobre la versiÃ³n con pasarela de pago para confirmaciÃ³n automÃ¡tica en tiempo real con comisiÃ³n de **1.5% por transacciÃ³n**.
  - Requisito legal y fiscal estipulado: esta versiÃ³n con pasarela puede integrarse siempre y cuando el comercio estÃ© debidamente inscrito en el **RÃ©gimen Simplificado** ante TributaciÃ³n.
  - SincronizaciÃ³n completa en la propuesta comercial de Partner (MÃ³dulo 1 Base y tarjetas comparativas) y en el panel administrativo.

### VersiÃ³n 4.16.19 - OptimizaciÃ³n de Rendimiento MÃ³vil, Carga InstantÃ¡nea y Compatibilidad Universal iOS Safari / Android
- [x] **Carga InstantÃ¡nea y Desbloqueo en iPhone Safari / Android ([`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - ReducciÃ³n drÃ¡stica del tiempo de presentaciÃ³n inicial a 800ms para impacto visual inmediato sin bloqueos de pantalla.
  - Temporizador de seguridad recortado a 5.0s (antes 13.5s) con escape automÃ¡tico ante buffering o retrasos de red mÃ³vil.
  - Blindaje contra excepciones de WebKit en iOS Safari (`InvalidStateError` al consultar `currentTime` antes de metadata).
  - Tocar en cualquier punto de la pantalla entra inmediatamente a la tienda sin demoras.
  - Memoria de sesiÃ³n con `safeSessionStorage`: tras ver o saltar la intro, las navegaciones y recargas dentro de la sesiÃ³n cargan la web al instante en 0.1s.
- [x] **DivisiÃ³n de CÃ³digo y ReducciÃ³n del Bundle Principal ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`vite.config.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/vite.config.ts)):**
  - Carga perezosa (`React.lazy` + `Suspense`) de mÃ³dulos pesados administrativos (`GuidedPickingModal`, `QuickBillingSection`, `AgendaSection`, `MetricsPage`, `PropuestaPage`, `SuperadminSection`).
  - Aislamiento de librerÃ­as de escaneo QR y cÃ¡mara (`html5-qrcode`, `qrcode.react`) en su propio chunk diferido.
  - El peso del bundle principal se redujo en mÃ¡s de 330 kB, permitiendo a cualquier telÃ©fono mÃ³vil descargar la portada y tienda a mÃ¡xima velocidad.
- [x] **Blindaje Universal para Modos Privados y WebViews ([`safeStorage.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/safeStorage.ts), [`main.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/main.tsx), [`ErrorBoundary.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/ErrorBoundary.tsx)):**
  - MÃ³dulo `safeStorage` con almacenamiento en memoria fallback ante bloqueos de `SecurityError` en pestaÃ±as privadas de Safari.
  - Compatibilidad de compilaciÃ³n extendida a Safari 13+, iOS 12+ y WebViews de redes sociales (Instagram, TikTok, WhatsApp).

### VersiÃ³n 4.16.18 - Ajuste ErgonÃ³mico de Altura y ContenciÃ³n en Ventanas de la Agenda
- [x] **ContenciÃ³n de Altura y Scroll Inteligente ([`AgendaSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AgendaSection.tsx), [`BlockSpaceModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/agenda/BlockSpaceModal.tsx), [`CalendarSyncModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/agenda/CalendarSyncModal.tsx)):**
  - LimitaciÃ³n estricta de altura mÃ¡xima a `max-h-[92vh]` con disposiciÃ³n flex en columnas (`flex flex-col overflow-hidden`).
  - FijaciÃ³n perimetral de encabezado y pie de pÃ¡gina: los tÃ­tulos y botones de acciÃ³n ("Guardar Cambios", "Cancelar") permanecen siempre visibles e inmÃ³viles sin salirse de la pantalla ni en resoluciones reducidas ni en dispositivos mÃ³viles.
  - DistribuciÃ³n en 2 columnas para campos de fecha y horario, compactaciÃ³n ergonÃ³mica de categorÃ­as, prioridades y banner de notificaciÃ³n push, eliminando desbordamientos en los bordes superior e inferior.


### VersiÃ³n 4.16.17 - ModificaciÃ³n de Cantidad de Productos en Alisto de Pedidos
- [x] **Ajuste de Unidades en Pantalla de Alisto ([`GuidedPickingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`orders.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/orders.ts)):**
  - Implementado botÃ³n *"Modificar"* junto a la cantidad del producto a alistar.
  - Panel interactivo con contador `- / +`, entrada numÃ©rica directa, botÃ³n *"Aceptar"* y botÃ³n *"Cancelar"*.
  - En caso de encontrar menos unidades en estante (ejemplo: pidieron 3 pero solo hay 2), quien alista cambia la cantidad a 2, presiona *"Aceptar"* y la orden se actualiza de inmediato.
  - RecÃ¡lculo automÃ¡tico instantÃ¡neo del subtotal y total del pedido.
  - Persistencia reactiva en memoria, `localStorage` y base de datos Cloudflare D1.
  - Los botones de confirmaciÃ³n y el resumen completo del pedido reflejan la nueva cantidad de forma sincronizada.

### VersiÃ³n 4.16.16 - Blindaje Estricto de Alisto Obligatorio para Empaque, Empacados y Despacho
- [x] **Regla Estricta de Alisto Obligatorio ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - NingÃºn pedido puede pasar a *En Empaque* (`packing`), *Empacados* (`packed`) o *Terminado/Despachado* (`delivered`) si su alisto no estÃ¡ al 100% completado (`isPicked: true` o `isMissing: true` en todos sus productos).
  - Eliminada la condiciÃ³n circular que consideraba un pedido alistado Ãºnicamente por su estado. Ahora la validaciÃ³n verifica matemÃ¡ticamente la totalidad de Ã­tems del pedido.
  - Los pedidos sin alisto completo se mantienen y muestran estrictamente en la pestaÃ±a *"Pendientes de Alisto"*, ocultÃ¡ndose de *"En Empaque"*, *"Empacados"* y *"Terminados"*.
- [x] **ProtecciÃ³n en FacturaciÃ³n y Acciones RÃ¡pidas ([`QuickBillingSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/QuickBillingSection.tsx)):**
  - Desactivada la mutaciÃ³n forzada de estado a `packed` al abrir o facturar pedidos existentes si su alisto aÃºn no estÃ¡ completo al 100%.
- [x] **ValidaciÃ³n Defensiva en Backend y Saneamiento AutomÃ¡tico ([`orders.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/orders.ts), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - `updateOrderStatus` y el endpoint PUT `/api/orders` bloquean cualquier intento de transiciÃ³n a `packing`, `packed` o `delivered` si el alisto no estÃ¡ al 100%.
  - `sanitizeOrderList` normaliza automÃ¡ticamente en carga y sincronizaciÃ³n cualquier registro histÃ³rico con alisto incompleto devolviÃ©ndolo a `pending` o `picking`.
  - Reparados los registros en la base de datos Cloudflare D1 (`byfiocr-db`), devolviendo los pedidos con progreso en cero a `pending` para su procesamiento reglamentario.

### VersiÃ³n 4.16.15 - Botones Aceptar Propuesta con Flujo de ConfirmaciÃ³n y NotificaciÃ³n Exclusiva a Superadmin
- [x] **Botones "Aceptar Propuesta" en MÃºltiples Secciones ([`PropuestaPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/propuesta/PropuestaPage.tsx)):**
  - Incorporados 5 botones de acciÃ³n directa *"Aceptar Propuesta"* distribuidos estratÃ©gicamente a lo largo de la propuesta: Hero Header, Tarifa Partner â‚¡40.000/mes, Resumen de Ahorro Real, Â¿CÃ³mo arrancamos? y Banner de Cierre Final.
  - Flujo de aceptaciÃ³n interactivo con modal dedicado: muestra el mensaje de confirmaciÃ³n previo (*"Haz clic en el botÃ³n 'Aceptar Propuesta' para formalizar tu acuerdo. Inmediatamente despuÃ©s de tu clic, se enviarÃ¡ la notificaciÃ³n exclusiva al panel de Superadmin para iniciar la implementaciÃ³n de tu plataforma"*), campos de contacto precompletados y botÃ³n de formalizaciÃ³n.
  - **Ajuste Responsive y Enfoque en Pantalla Completa:** Ventana modal optimizada con `max-h-[94vh]`, scroll interno suave (`custom-scrollbar`), cabecera y pie fijos con botones accesibles, eliminando desbordamientos de bordes y garantizando visualizaciÃ³n perfecta en cualquier dispositivo mÃ³vil o de escritorio.
  - Estado de Ã©xito tras el clic con animaciÃ³n de confeti, efectos de sonido y retroalimentaciÃ³n confirmando el envÃ­o inmediato.
- [x] **RecepciÃ³n y Notificaciones Exclusivas en Consola Superadmin ([`SuperadminSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminSection.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`proposal-acceptances.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/proposal-acceptances.ts)):**
  - **Aislamiento Estricto:** La notificaciÃ³n de aceptaciÃ³n de propuesta llega Ãºnica y exclusivamente a la consola de Superadmin (`isSuperAdminAuthenticated`); ningÃºn usuario administrador estÃ¡ndar o staff tiene acceso.
  - Banner de alerta visual en el encabezado de Superadmin con conteo de aceptaciones pendientes, datos del cliente, telÃ©fono y botones de acciÃ³n rÃ¡pida (*WhatsApp*, *Atender*, *Ver en PestaÃ±a*).
  - PestaÃ±a dedicada *"Propuestas Aceptadas"* dentro de la consola con filtros por estado (*Pendientes*, *Contactadas*, *Activas*), cambio de estado, enlace a WhatsApp y eliminaciÃ³n segura.
  - SincronizaciÃ³n en la nube multi-dispositivo Cloudflare D1 vÃ­a `/api/proposal-acceptances` y en tiempo real local con `BroadcastChannel`.

### VersiÃ³n 4.16.14 - Nueva Vista de Agenda Calendario Semanal y Diaria con Bloqueo de Espacios y SincronizaciÃ³n
- [x] **CuadrÃ­cula de Calendario Semanal y Diaria ([`CalendarAgendaView.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/agenda/CalendarAgendaView.tsx), [`CalendarTopBar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/agenda/CalendarTopBar.tsx), [`AgendaSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AgendaSection.tsx)):**
  - ImplementaciÃ³n de la vista de agenda tipo cuadrÃ­cula inspirada en la referencia: cabecera con toggle `[ Vista Diaria | Semanal ]`, selector de intervalo (60 min, 30 min, 15 min), navegador semanal `< 2 nov - 8 nov >` con indicador `Hoy`, y filtro de equipo (`Todo el Equipo (2)`, `Fiorella`, `Taller & EnvÃ­os`).
  - Cabeceras de dÃ­as (Lunes a Domingo) con insignias de fecha, tag de almuerzo `ðŸ´ 12:30 PM`, resaltado activo en el dÃ­a de hoy con recuadro azul/morado, y domingo marcado con insignia `Cerrado 8` y `0 citas`.
  - Franja horaria de 8:00 AM a 8:00 PM con renderizado de tarjetas de receso de almuerzo rayadas en Ã¡mbar (`ðŸ´ RECESO DE ALMUERZO 12:30 PM - 1:30 PM`), botÃ³n de ajustes, y tarjetas de citas/actividades con paleta By.Fio.
  - Al hacer clic en cualquier franja horaria vacÃ­a, se abre el modal para agendar con la fecha y hora seleccionada precompletadas.
- [x] **Gestor de Bloqueo de Espacios y Modal ([`BlockSpaceModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/agenda/BlockSpaceModal.tsx), [`agendaCalendarTypes.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/agenda/agendaCalendarTypes.ts)):**
  - BotÃ³n superior `ðŸ”’ Bloquear Espacio` para registrar o editar recesos de almuerzo, mantenimientos, reuniones o cierres locales, con soporte para repeticiÃ³n diaria o fecha especÃ­fica, alcance de personal y persistencia en `localStorage`.
- [x] **SincronizaciÃ³n con Google Calendar & Apple Calendar ([`CalendarSyncModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/agenda/CalendarSyncModal.tsx)):**
  - BotÃ³n `ðŸŽ G Sincronizar Calendario` que despliega modal interactivo con generaciÃ³n y descarga de archivo `.ics` (iCalendar) para importar todas las actividades, enlace de suscripciÃ³n webcal y botÃ³n de sincronizaciÃ³n forzada.

### VersiÃ³n 4.16.13 - ErradicaciÃ³n de Agendas Duplicadas, Purga en D1 y Blindaje Reactivo Universal
- [x] **Purga de Duplicados en Base de Datos Cloudflare D1 ([`agenda.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/agenda.ts)):**
  - Limpieza y purga inmediata ejecutada en producciÃ³n sobre la tabla `site_metrics` (`app_agenda_items`), eliminando 7 entradas redundantes generadas por clics consecutivos y dejando Ãºnicamente los 5 registros legÃ­timos Ãºnicos.
  - ImplementaciÃ³n del deduplicador de servidor en `functions/api/agenda.ts`: las peticiones `GET` y `POST` filtran automÃ¡ticamente duplicados por identificador y clave compuesta de tÃ­tulo y fecha antes de enviar o persistir.
- [x] **Blindaje y DeduplicaciÃ³n Reactiva en Cliente ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`AgendaSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AgendaSection.tsx), [`SupplierOrderModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierOrderModal.tsx)):**
  - Implementada funciÃ³n universal `deduplicateAgendaItems` integrada en el estado inicial de `localStorage`, `saveAgendaItems`, el canal de difusiÃ³n `BroadcastChannel` y la sincronizaciÃ³n con la nube.
  - `addAgendaItem` valida si ya existe una actividad idÃ©ntica (mismo tÃ­tulo normalizado y fecha), retornando la referencia existente sin registrar copias.
  - ProtecciÃ³n contra doble clic en formularios mediante estados de bloqueo `isSubmitting` en la creaciÃ³n de actividades y `isSavingAgenda` en Ã³rdenes a proveedor.

### VersiÃ³n 4.16.12 - Desbloqueo y Robustez en ConfirmaciÃ³n de Reserva de Talleres con Pago Verificado
- [x] **Flujo de ConfirmaciÃ³n de Reserva y Checkout de Talleres Inmediato ([`WorkshopDetailPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/WorkshopDetailPage.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Eliminado el bloqueo silencioso del botÃ³n "Confirmar Reserva con Pago Verificado": se implementÃ³ `noValidate` en el formulario y un despachador de eventos con control de excepciones `try/catch`.
  - Alerta de validaciÃ³n reactiva renderizada directamente sobre el botÃ³n de confirmaciÃ³n con desplazamiento automÃ¡tico suave hacia los campos faltantes, evitando que el usuario sienta que el botÃ³n se queda congelado.
  - Auto-completado inteligente del nombre del participante si el comprobante SINPE validado contiene el nombre de origen (`originName`).
  - AsignaciÃ³n inmediata del estado de pago `'paid'` a la orden de taller en base de datos si el pago fue verificado por SINPE MÃ³vil.
  - Apertura inmediata del modal de Ã©xito con detalles de la reserva, confetti, nÃºmero de orden y los botones de acciÃ³n ("Ir a la Tienda", "Ver MÃ¡s Detalles" y enlace directo a WhatsApp del profesor con mensaje preformateado).
- [x] **ReconfirmaciÃ³n de Interfaz Limpia en Admin ([`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx), [`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx)):**
  - Mantenimiento estricto de la remociÃ³n del antiguo submenÃº horizontal repetido (`AdminTabs` nulo) y de los botones duplicados `SINPE BCR` y `Pedidos Proveedor` de la cabecera superior.

### VersiÃ³n 4.16.11 - Pedidos Terminados al Inicio con Destacado Temporal de FinalizaciÃ³n
- [x] **UbicaciÃ³n Superior AutomÃ¡tica para Pedidos Terminados ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`orders.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/orders.ts)):**
  - Implementado registro y persistencia de `deliveredAt` en base de datos Cloudflare D1 y memoria reactiva al marcar pedidos como terminados.
  - La secciÃ³n de Terminados y la vista general ahora ordenan los pedidos por fecha de terminaciÃ³n/entrega (`deliveredAt`), garantizando que cualquier pedido reciÃ©n finalizado caiga inmediatamente en el tope superior de la lista en vez de irse al fondo.
- [x] **Efecto de Color Temporal Desvanecible:**
  - Al terminar un pedido o ingresar a la pantalla para revisarlo, la tarjeta queda resaltada con un resplandor esmeralda brillante (`border-emerald-400`, sombra verde neÃ³n y badge *"Â¡ReciÃ©n Terminado! âœ¨"*).
  - El color se sostiene durante 5.5 segundos mientras la persona lo visualiza en pantalla y luego se desvanece suavemente con animaciÃ³n fluida de 1000ms al estilo de tarjeta terminada estÃ¡ndar, sin saltos bruscos.


### VersiÃ³n 4.16.10 - TransiciÃ³n AutomÃ¡tica de Pedidos 100% Alistados a Empaque y Saneamiento Reactivo
- [x] **TransiciÃ³n AutomÃ¡tica a Empaque y ExclusiÃ³n de Pendientes de Alisto ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx), [`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx)):**
  - Implementado `sanitizeOrderList` para normalizar reactivamente pedidos con alisto al 100% (`isPicked` o `isMissing` en todos los Ã­tems), promoviÃ©ndolos de `'pending'` / `'picking'` directamente a `'packing'`.
  - Las Ã³rdenes de talleres o compras de cursos quedan inicializadas de inmediato en `'packing'` (empaque/gestiÃ³n de acceso), sin quedar estancadas en pendientes de alisto.
  - La cola de pendientes de alisto y los indicadores de cabecera excluyen rigurosamente pedidos cuyo progreso ya alcanzÃ³ el 100%, mostrÃ¡ndolos en la secciÃ³n de empaque con su botÃ³n "Marcar Empacado".
  - SincronizaciÃ³n bidireccional continua con Cloudflare D1 y `BroadcastChannel` manteniendo la integridad del flujo operativo.

### VersiÃ³n 4.16.9 - Ordenamiento CronolÃ³gico Descendente Estricto de Pedidos y SincronizaciÃ³n en Tiempo Real
- [x] **CorrecciÃ³n de Ordenamiento CronolÃ³gico Invertido ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`orders.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/orders.ts), [`SalesHistorySection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SalesHistorySection.tsx)):**
  - Se corrigiÃ³ el ordenamiento ascendente (`ORDER BY created_at ASC` y `a.createdAt - b.createdAt`) que mantenÃ­a el pedido de SofÃ­a Solano Brenes (#FIO-1001, del 28 de octubre) clavado de forma permanente en la primera posiciÃ³n de la lista.
  - Se estableciÃ³ el orden cronolÃ³gico descendente estricto (`ORDER BY created_at DESC` y `b.createdAt - a.createdAt`) tanto en la API Cloudflare D1 como en la memoria reactiva de la aplicaciÃ³n.
  - Los pedidos mÃ¡s recientes aparecen automÃ¡ticamente arriba en tiempo real, mientras que las Ã³rdenes pasadas se desplazan hacia abajo naturalmente.
  - SincronizaciÃ³n Ã­ntegra de `items_json` en peticiones PUT para no corromper ni vaciar los Ã­tems de los pedidos al actualizar su estado operativo.


### VersiÃ³n 4.16.8 - Flujo Oficial de Reserva de Talleres sin RedirecciÃ³n Involuntaria, Checkout SINPE MÃ³vil y Acciones Post-Reserva
- [x] **ErradicaciÃ³n de RedirecciÃ³n AutomÃ¡tica a WhatsApp ([`WorkshopDetailPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/WorkshopDetailPage.tsx)):**
  - Eliminada la apertura forzada de WhatsApp (`window.open(waUrl)`) al confirmar la inscripciÃ³n de un taller.
  - La persona ahora permanece en la web y recibe de inmediato la confirmaciÃ³n visual de su cupo apartado.
- [x] **Checkout Interactivo de Pago por SINPE MÃ³vil:**
  - Integrada la validaciÃ³n de comprobante bancario en tiempo real con notificaciones del BCR (`PaymentAccountsCard` con `verifySinpePaymentForCheckout`), soporte de verificaciÃ³n, faltante y simulaciÃ³n de prueba.
- [x] **Mensaje de Ã‰xito y Resumen Oficial:**
  - Mensaje explÃ­cito: *"Â¡Ya tienes tu cupo para el taller [TÃ­tulo] el dÃ­a [Fecha]!"* junto al nÃºmero de pedido/reserva, cupos reservados y estado del pago.
- [x] **Acciones Posteriores con los 3 Botones Solicitados:**
  - **BotÃ³n 1:** *"Ir a la Tienda"* para continuar explorando productos y papelerÃ­a.
  - **BotÃ³n 2:** *"Ver MÃ¡s Detalles"* para desplegar la lista de materiales, coffee break, tÃ©cnicas y ubicaciÃ³n exacta en TibÃ¡s.
  - **BotÃ³n 3:** *"Â¿Dudas o preguntas? Contactar al profesor"* con badge visible del nÃºmero oficial (`WhatsApp: 6400-4640`), que abre el chat de WhatsApp Ãºnicamente cuando el usuario lo solicita por propia voluntad.

### VersiÃ³n 4.16.7 - Blindaje de Seguridad en NotificaciÃ³n de Estrellita (Exclusiva para Administrador y Perfiles Autorizados)
- [x] **RestricciÃ³n Estricta de NotificaciÃ³n por Roles y Permisos ([`NewOrderStarAlert.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/NewOrderStarAlert.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Erradicada la apariciÃ³n de la alerta de la estrellita en la web pÃºblica para visitantes y clientes sin sesiÃ³n activa.
  - La notificaciÃ³n y el repique de sonido (`playNewOrderChimeSound`) solo se disparan si existe un usuario autenticado con rol Administrador (`role === 'admin'`, `isMasterAdmin` o Superadmin) o perfil Staff con permiso especÃ­fico habilitado (`workshops` para talleres, `orders` para pedidos).
  - Bloqueo cuÃ¡druple:
    1. `showNewOrderAlert()` valida sesiÃ³n y permiso antes de registrar la alerta en estado global.
    2. Sonido de campana condicionado a `canReceiveOrderNotifications()`.
    3. `NewOrderStarAlert` renderiza `null` y silencia burbujas ante sesiones pÃºblicas o permisos insuficientes.
    4. Renderizado condicional en `App.tsx` supeditado a existencia de sesiÃ³n administrativa.

### VersiÃ³n 4.16.6 - Arranque AutomÃ¡tico InstantÃ¡neo de Video Intro con Audio
- [x] **ReproducciÃ³n AutomÃ¡tica Inmediata con Audio ([`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - Eliminado el retraso de 2 segundos de pantalla de letras para que el video arranque de forma 100% automÃ¡tica apenas carga la web.
  - El video se inicializa directamente con audio activo (`muted=false`, `volume=1.0`) sin requerir que el usuario presione la pantalla.
  - Gatillado dual inmediato: reproducciÃ³n automÃ¡tica al montar el componente y respaldo en `onLoadedData` para arrancar en el milisegundo exacto en que los metadatos del video estÃ¡n listos.
  - RetenciÃ³n de respaldo anti-bloqueo: si una directiva estricta de navegador bloquea audio en carga frÃ­a, reproduce fluido sin congelarse y desmutea al primer toque.


### VersiÃ³n 4.16.5 - CorrecciÃ³n y Estabilidad Total de la Intro Web (Sin Bloqueos de Autoplay ni Congelamiento)
- [x] **Arranque Fluido sin Bloqueo por Autoplay Policy ([`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - CorrecciÃ³n del bloqueo crÃ­tico que congelaba la intro al entrar al video: se eliminÃ³ el intento forzado de desmutear en timer (`t2`) sin interacciÃ³n previa, el cual causaba que el navegador pausara el video de inmediato.
  - El video inicia de forma segura en modo silenciado (`muted=true`) garantizando arranque instantÃ¡neo en cualquier navegador mÃ³vil o de escritorio (Chrome, Safari, iOS, Edge).
  - Desbloqueo universal de audio mediante gesto real del usuario (toque en pantalla, clic en el botÃ³n de sonido o cualquier pulsaciÃ³n), activando el audio sin interrupciones.
  - Temporizador de mÃ¡xima seguridad de 13.5 segundos (`tSafety`) y bandera atÃ³mica `isExitingRef` para asegurar que bajo ninguna circunstancia la intro quede pegada.


### VersiÃ³n 4.16.4 - NotificaciÃ³n de Estrellita Adaptativa para Inscripciones a Talleres Creativos
- [x] **DetecciÃ³n AutomÃ¡tica y Mensaje Personalizado para Talleres ([`NewOrderStarAlert.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/NewOrderStarAlert.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Cuando la compra corresponde a un taller creativo, el tÃ­tulo de la alerta de la estrellita cambia dinÃ¡micamente a: *"Hemos recibido una nueva inscripciÃ³n al taller"*.
  - En compras de productos regulares o catÃ¡logo, conserva el mensaje estÃ¡ndar *"Hemos recibido un nuevo pedido"*.
  - DetecciÃ³n dual ultra-robusta: flag explÃ­cito `isWorkshop` y verificaciÃ³n retroactiva por nÃºmero de orden e Ã­tems tipo `'workshop'`.
  - Despliegue visual adaptativo: distintivo de birrete (`GraduationCap`), etiqueta *"InscripciÃ³n #ORDEN"*, nombre del taller creativo (`ðŸŽ¨ TÃ­tulo del Taller`) y nombre del alumno(a).
- [x] **Botones de Prueba RÃ¡pida en Panel de AdministraciÃ³n ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx), [`AdminDesignSettingsModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminDesignSettingsModal.tsx)):**
  - AÃ±adido botÃ³n interactivo *"Probar Taller ðŸŽ¨"* en la Cola de Pedidos y en el configurador de diseÃ±o para verificar la animaciÃ³n y el mensaje de taller con un solo clic.

### VersiÃ³n 4.16.3 - Propuesta Integral y Modelo Partner By.Fio con 11 MÃ³dulos Base, RegalÃ­as y Desglose Financiero
- [x] **Propuesta Comercial de Alianza Partner Oficial ([`PropuestaPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/propuesta/PropuestaPage.tsx)):**
  - Incorporada la estructura formal completa de propuesta comercial y alianza estratÃ©gica adaptada al negocio de Fio (creadora de contenido, talleres creativos y papelerÃ­a).
  - PresentaciÃ³n del modelo SaaS (propiedad tecnolÃ³gica vs alquiler adaptado sin inversiÃ³n inicial, cero cobros sorpresas de renovaciÃ³n y libertad total sin contratos forzosos).
  - Desglose detallado de los **11 MÃ³dulos Base** con sus valores comerciales regulares (Total: â‚¡130.000/mes) y botones de acceso directo a cada uno.
  - SecciÃ³n destacada de **RegalÃ­as 100% GRATIS (â‚¡0)**: MÃ³dulo de Comprobantes por Correo (â‚¡10.000/mes), MÃ³dulo de Agenda para citas y eventos, y Hosting + Dominio anual ($25 USD / â‚¡13.000/mes bonificado).
  - Tarifa Exclusiva Partner de **â‚¡40.000 colones / mes** garantizada por 12 meses (reducciÃ³n desde mÃ¡s de â‚¡153.000/mes regular y â‚¡75.000/mes promo).
  - Beneficio Adicional Opcional de App Multiusuario para Celular y PC a **â‚¡5.000 adicionales / mes** (ahorro de â‚¡10.000 mensuales).
  - Resumen de ahorro real (+â‚¡110.000/mes directo y ajuste anual topado al 10%).
  - Ruta de arranque en 3 pasos (ActivaciÃ³n, AdaptaciÃ³n a tu medida, Pruebas y Carga en Vivo) y botÃ³n directo de confirmaciÃ³n vÃ­a WhatsApp.
  - **ActualizaciÃ³n Integral de la Lista Completa de Todo lo que Contiene:** OrganizaciÃ³n exhaustiva en 3 columnas de los 11 mÃ³dulos base, las regalÃ­as bonificadas y el ecosistema integral de la plataforma.
  - BotÃ³n de copiado integral que transfiere el texto exacto estructurado para WhatsApp / correo en un solo clic.
- [x] **Acceso Directo y Desbloqueo PÃºblico ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Eliminada la restricciÃ³n de PIN/Admin en `App.tsx` para que la propuesta sea visible inmediatamente por URL directa (`/propuesta`) sin mostrar *"Acceso Restringido"*.
  - Incorporado el botÃ³n *"Propuesta"* directamente en la barra de navegaciÃ³n pÃºblica (PC y menÃº mÃ³vil).

### VersiÃ³n 4.16.2 - Selector de Hora y Minutos en Nueva Actividad de Agenda y Campanita Push Sonora
- [x] **Selector Interactivo de Hora y Minutos en Modal de Agenda ([`AgendaSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AgendaSection.tsx)):**
  - Reemplazado el campo de texto libre por selectores dropdown dedicados para Horas (`01` a `12`) y Minutos (`00`, `05`, `10`, ... `55`).
  - Toggle tÃ¡ctil de perÃ­odo `AM` / `PM` y casilla para elegir entre actividad con horario especÃ­fico o de jornada completa.
  - Atajos rÃ¡pidos de horarios habituales de taller (`09:00 AM`, `10:00 AM`, `02:00 PM`, `04:00 PM`, `06:00 PM`).
  - Algoritmo de parsing inteligente retrocompatible para cargar registros existentes sin pÃ©rdida de formato.
- [x] **Campanita Sonora y NotificaciÃ³n Push ([`soundEffects.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/soundEffects.ts), [`AgendaSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AgendaSection.tsx), [`index.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/types/index.ts)):**
  - SÃ­ntesis de sonido de campana armÃ³nica de dos golpes ("Ding-Dong" cristalino D6/A6) mediante Web Audio API puro, sin latencia ni dependencias externas.
  - FunciÃ³n universal de notificaciÃ³n push con solicitud de permisos (`Notification.requestPermission`) e Ã­cono oficial By.Fio.
  - Interruptor en el modal para activar/desactivar la campanita y botÃ³n interactivo *"Probar ðŸ””"* con escucha previa en tiempo real.
  - Banner push emergente animado en pantalla con campana repicando y auto-cierre a los 6 segundos.
  - Distintivo visual de campanita activa en vistas de lista y cuadrÃ­cula con botÃ³n para reproducir el repique sonoro en cualquier momento.

### VersiÃ³n 4.16.1 - Cierre de Caja Diario Persistente con Historial y Filtros por DÃ­a y Fecha
- [x] **Cierre de Caja Diario y Persistencia Oficial ([`DailyClosingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/DailyClosingModal.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`daily-closings.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/daily-closings.ts)):**
  - Implementada selecciÃ³n de fecha para realizar el cierre diario (*"Hoy"*, *"Ayer"* o fecha especÃ­fica con selector interactivo).
  - CÃ¡lculo automÃ¡tico de totales de caja (Ventas Tienda & CatÃ¡logo, Talleres Creativos, SINPE MÃ³vil BCR + Web y otros medios).
  - Soporte para arqueo fÃ­sico con cÃ¡lculo en vivo de diferencia (Cuadrado, Sobrante, Faltante), notas y responsable del turno.
  - BotÃ³n *"Guardar Cierre de Caja"* / *"Actualizar Cierre Guardado"* con almacenamiento persistente en memoria local (`localStorage`), difusiÃ³n entre pestaÃ±as (`BroadcastChannel`) y persistencia en la nube Cloudflare D1 (`/api/daily-closings`).
- [x] **Historial de Cierres Diarios y Consultas Posteriores ([`CashRegisterReports.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/CashRegisterReports.tsx), [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Incorporada nueva secciÃ³n *"Historial de Cierres de Caja Diarios"* dentro del mÃ³dulo de Caja & ReporterÃ­a.
  - **Filtros por DÃ­a y Fecha:** Botones rÃ¡pidos *"Todos"*, *"Hoy"*, *"Ayer"*, *"Semana"*, *"Mes"* y selector de fecha exacta (`<input type="date" />`).
  - Tabla completa con historial de actas guardadas: fecha, hora, responsable, desglose por canal, total recaudado, estado de arqueo y notas.
  - BotÃ³n directo *"Ver Acta"* para abrir cualquier cierre pasado, reimprimir el comprobante formal o compartir el resumen oficial por WhatsApp.
  - PestaÃ±a de consulta histÃ³rica integrada tambiÃ©n dentro del modal de cierre para inspecciÃ³n Ã¡gil.

### VersiÃ³n 4.16.0 - MÃ³dulo Integral de Historial de Ventas con Filtros por DÃ­a, Semana, Mes y Detalle Completo de Pedido
- [x] **Nuevo MÃ³dulo de Historial de Ventas ([`SalesHistorySection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SalesHistorySection.tsx), [`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx), [`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx), [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`routeHelpers.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/routeHelpers.ts)):**
  - Incorporada nueva secciÃ³n administrativa *"Historial de Ventas"* con acceso oficial desde el MenÃº Principal (Hub) y soporte para URL directa (`/admin/ventas`).
  - **Filtros Temporales de Alta PrecisiÃ³n:**
    - **Por DÃ­a:** Botones directos *"Hoy"*, *"Ayer"* y selector de fecha personalizada (`<input type="date" />`).
    - **Por Semana:** Botones *"Esta Semana"* (Lunes a Domingo), *"Ãšltimos 7 DÃ­as"* y *"Semana Pasada"*.
    - **Por Mes:** Botones *"Este Mes"*, *"Mes Pasado"* y selector de mes personalizado (`<input type="month" />`).
    - OpciÃ³n de visualizaciÃ³n general *"Todo"* el histÃ³rico.
  - **Buscador & Filtros Operativos:** BÃºsqueda en tiempo real por nÃºmero de orden, cliente, telÃ©fono o productos, combinable con filtros por estado de pago (Pagado / Pendiente) y estado del flujo de alisto.
  - **MÃ©tricas Consolidadas del PerÃ­odo:** Tarjetas en cabecera con cÃ¡lculo automÃ¡tico de Ventas Totales (â‚¡), Total de Pedidos, Ticket Promedio y Cantidad de ArtÃ­culos Vendidos.
  - **InspecciÃ³n Profunda de "El Pedido que el Cliente RealizÃ³":**
    - Modal emergente con el desglose exacto de cada artÃ­culo (nombre, SKU, estante, cantidad, precio unitario y personalizaciÃ³n de grabado en foil `customText`).
    - Ficha de cliente con telÃ©fono vinculado a WhatsApp con 1 clic, correo y direcciÃ³n completa o modalidad de retiro.
    - Resumen financiero formal con desglose de subtotal, costo de envÃ­o y total cobrado.
    - Botones de acciÃ³n directa para emitir comprobante de pago (`setInvoiceOrder`) y contactar al cliente por WhatsApp.
  - **ExportaciÃ³n de Datos:** BotÃ³n para descargar el reporte filtrado en formato CSV compatible con Excel.

### VersiÃ³n 4.15.7 - EliminaciÃ³n de Botones Duplicados en Cabecera Admin (SINPE BCR y Pedidos Proveedor)
- [x] **DepuraciÃ³n de la Barra Superior de AdministraciÃ³n ([`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx)):**
  - Eliminados los botones redundantes *"SINPE BCR"* y *"Pedidos Proveedor"* de la cabecera del panel de administraciÃ³n.
  - La navegaciÃ³n hacia ambos mÃ³dulos se mantiene de manera centralizada y espaciosa a travÃ©s de sus tarjetas oficiales en el MenÃº Principal de AdministraciÃ³n (Hub), evitando duplicidad visual.

### VersiÃ³n 4.15.6 - Renombramiento de Estados a "Terminados" en Cola de Pedidos
- [x] **ActualizaciÃ³n de Etiquetas y Acciones en Cola de Pedidos ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx)):**
  - BotÃ³n de filtro de pedidos cambiado de *"Entregados"* a *"Terminados"*.
  - BotÃ³n de acciÃ³n operativa cambiado de *"Marcar Entregado"* a *"Marcar Terminado"*.
  - Distintivo visual de estado actualizado a *"Terminado"* para mÃ¡xima claridad operativa en el flujo de pedidos.

### VersiÃ³n 4.15.5 - Entrada Suave de Arriba Hacia Abajo, Contador de Minutos y ConfiguraciÃ³n de DuraciÃ³n de la Estrellita
- [x] **AnimaciÃ³n de Entrada de Arriba Hacia Abajo ([`index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css), [`NewOrderStarAlert.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/NewOrderStarAlert.tsx)):**
  - Implementada animaciÃ³n fluida con fÃ­sica suave (`@keyframes starAlertSlideInFromTop` con `cubic-bezier(0.16, 1, 0.3, 1)`) que desplaza la alerta desde la parte superior hacia el centro con desenfoque de fondo.
- [x] **Cierre Manual por Defecto con Contador Continuo de Minutos y Barra CÃ­clica:**
  - Por defecto, la alerta no se cierra sola: el administrador debe cerrarla manualmente mediante el botÃ³n *"Entendido / Cerrar Alerta"* o la `X` superior.
  - Ticker en tiempo real que suma segundos progresivamente (`00:01` ... `00:59`), llenando la barrita de color linealmente hasta alcanzar el minuto (60s). Al llegar a 60s, la barra se reinicia para el siguiente minuto y el contador continÃºa acumulando el tiempo total (`Minuto 2`, `Minuto 3`...) indefinidamente hasta el cierre manual.
- [x] **Panel de ConfiguraciÃ³n de la Estrellita para el Administrador ([`AdminDesignSettingsModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminDesignSettingsModal.tsx), [`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`types/index.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/types/index.ts)):**
  - En el botÃ³n *"ConfiguraciÃ³n"* del panel admin se integrÃ³ el selector con las opciones solicitadas: `Cierre manual por el usuario (Por defecto)`, `5 segundos`, `10 segundos`, `15 segundos` y `20 segundos`.
  - Persistencia local en `localStorage` (`byfio_star_alert_duration_v1`) y botÃ³n *"Probar Estrellita"* interactivo para ensayar la duraciÃ³n y animaciÃ³n en vivo.

### VersiÃ³n 4.15.4 - ErradicaciÃ³n Definitiva del Logo / Ãcono de Destellos Verdes
- [x] **EliminaciÃ³n Total del Ãcono Sparkles en Toda la AplicaciÃ³n ([`InventoryTable.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx), [`NewOrderStarAlert.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/NewOrderStarAlert.tsx), [`CashRegisterReports.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/CashRegisterReports.tsx), [`SinpeBcrVerificationModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SinpeBcrVerificationModal.tsx), [`SinpePaymentsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SinpePaymentsSection.tsx), [`WorkshopEnrollmentsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/WorkshopEnrollmentsSection.tsx), [`SuperadminLogin.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminLogin.tsx)):**
  - Removido el distintivo verde con destellos (`bg-emerald-600` con `Sparkles`) en la cabecera de control de inventario, sustituido por el icono corporativo unificado de cajas `Boxes` con la paleta By.Fio (`bg-fio-800`).
  - Erradicado el icono `Sparkles` de todos los mÃ³dulos y modales de la web para mantener la pureza de la identidad visual de la marca By.Fio.

### VersiÃ³n 4.15.3 - Alerta Animada de la Estrellita en Nuevo Pedido con Salida Hacia Abajo
- [x] **NotificaciÃ³n de Pedidos con la Estrellita Animada ([`NewOrderStarAlert.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/NewOrderStarAlert.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx), [`index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Implementado modal de alerta centrado en pantalla que se dispara automÃ¡ticamente cada vez que ingresa un pedido nuevo (tienda online, reservas de talleres, facturaciÃ³n rÃ¡pida o sincronizaciÃ³n remota en segundo plano).
  - Muestra la mascota oficial en video (`vid-estrellita.mp4`) con corazÃ³n animado, el mensaje exacto *"Hemos recibido un nuevo pedido"*, nÃºmero de orden y barra de progreso.
  - Permanece en el centro de la pantalla durante 6.5 segundos y desciende suavemente del centro hacia abajo (`animate-star-alert-down`), con botÃ³n `X` para descarte manual instantÃ¡neo.
  - Incorporado botÃ³n *"Probar Estrellita"* en la cabecera de la cola de pedidos de administraciÃ³n para verificaciÃ³n directa.

### VersiÃ³n 4.15.2 - ErradicaciÃ³n Total de Alertas y Confirmaciones Nativas del Navegador
- [x] **Reemplazo 100% de Notificaciones Nativas por DiÃ¡logos Integrados By.Fio ([`ConfirmDialog.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/ui/ConfirmDialog.tsx), [`ConfirmContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/ConfirmContext.tsx)):**
  - AÃ±adido soporte para avisos informativos (`useAlert()`) y confirmaciones asÃ­ncronas (`useConfirm()`) con diseÃ±o nativo By.Fio (fondo blur, botones temÃ¡ticos, iconos y cero popups feos del navegador tipo `byfiocr.pages.dev dice`).
  - Aplicado en toda la plataforma: [`AgendaSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AgendaSection.tsx), [`CustomersSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/CustomersSection.tsx), [`InventoryTable.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx), [`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx), [`QuickBillingSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/QuickBillingSection.tsx), [`SinpeBcrVerificationModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SinpeBcrVerificationModal.tsx), [`SinpePaymentsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SinpePaymentsSection.tsx), [`SuppliersOrdersSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SuppliersOrdersSection.tsx), [`UserProfilesSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/UserProfilesSection.tsx), [`WorkshopEnrollmentsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/WorkshopEnrollmentsSection.tsx), [`SuperadminSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminSection.tsx) y [`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx).

### VersiÃ³n 4.15.1 - EliminaciÃ³n del SubmenÃº de PestaÃ±as y Reemplazo por Barra Limpia
- [x] **EliminaciÃ³n del SubmenÃº Horizontal ([`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx)):**
  - Eliminado por completo el contenedor neumÃ³rfico con la fila comprimida de 11 botones y badges (`Pedi...`, `Factura...`, `Inventa...`, etc.) que colapsaba y saturaba la pantalla.
  - Reemplazado por una barra de navegaciÃ³n limpia y de una sola lÃ­nea con botÃ³n directo *"â† Volver al MenÃº Principal"* y breadcrumb indicador de secciÃ³n actual.
  - La navegaciÃ³n entre mÃ³dulos se realiza de forma ordenada y espaciosa desde el MenÃº Principal (Hub), erradicando el desbordamiento en dispositivos mÃ³viles y de escritorio.

### VersiÃ³n 4.15.0 - Sistema Global de DiÃ¡logos de ConfirmaciÃ³n Profesionales
- [x] **Reemplazo de alertas nativas por `ConfirmDialog` ([`ConfirmDialog.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/ui/ConfirmDialog.tsx), [`ConfirmContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/ConfirmContext.tsx), [`useConfirm.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/hooks/useConfirm.ts), [`main.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/main.tsx)):**
  - Creado sistema reactivo con hook `useConfirm()` y modal de confirmaciÃ³n con variantes visuales (`danger`, `warning`, `info`) con estÃ©tica corporativa By.Fio para sustituir el `window.confirm` nativo del navegador.
  - Integrado de forma fluida en las acciones crÃ­ticas de eliminaciÃ³n y restablecimiento en [`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx), [`AdminPricingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminPricingModal.tsx) y [`AgendaSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AgendaSection.tsx).

### VersiÃ³n 4.14.9 - CorrecciÃ³n de Errores TypeScript y CÃ³digo Limpio (v4.14.6 + v4.14.7)
- [x] **CorrecciÃ³n de errores TS en `products.ts`:** `TS2367` resuelto â€” comparaciÃ³n `r.is_available === true` (number vs boolean) corregida a `Number(r.is_available) === 1`.
- [x] **`UserProfilesSection.tsx`:** InicializaciÃ³n completa de los 10 permisos en `handleOpenCreate`, `handleOpenEdit` y `handleToggleAllPermissions` incluyendo `agenda` y `suppliers`. Conteo de permisos otorgados corregido con null-safe `perms[mod.key]`.
- [x] **`AppContext.tsx` â€” `hasPermission`:** Eliminados todos los `as any`; ahora usa `Record<string, boolean | undefined>` para acceso seguro por Ã­ndice string.
- [x] **`AppContext.tsx` â€” `loginWithPin`:** Reescrito para priorizar PINs de perfil antes que PINs maestros (`7777`, `0777`, `9999`). PINs `1234` y `2026` ya no colisionan con perfiles MarÃ­a y Mostrador.
- [x] **`formatters.ts`:** `formatCRC` y `getWhatsAppLink` protegidos contra valores `null`/`undefined`.
- [x] **`tsconfig.json`:** Incluye `functions/` para que TS audite tambiÃ©n las Cloudflare Functions.
- [x] **`SuppliersOrdersSection.tsx` / `SupplierOrderModal.tsx`:** Guardado en Agenda integrado con detecciÃ³n de duplicados.

### VersiÃ³n 4.14.7 - RediseÃ±o Ejecutivo y Profesional de la Agenda WMS
- [x] **RediseÃ±o NeumÃ³rfico Ejecutivo ([`AgendaSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AgendaSection.tsx)):**
  - Transformada la interfaz a estÃ¡ndar B2B neumÃ³rfico con paleta institucional, superficies suaves (`shadow-neuCard`), campos inset (`shadow-neuInset`) y tipografÃ­a corporativa equilibrada.
  - Incorporadas 4 tarjetas KPI ejecutivas: Total de Actividades, Actividades Para Hoy con pulso de atenciÃ³n inmediata, Efectividad con porcentaje y barra de progreso animada, y Talleres Sincronizados.
  - Implementado selector de vista dual: **Vista Lista CronolÃ³gica** (con agrupaciÃ³n inteligente en *Para Hoy & Prioritarias*, *PrÃ³ximos DÃ­as*, *Fechas Posteriores* y acordeÃ³n de *Completadas*) y **Vista CuadrÃ­cula de Tarjetas**.
  - RediseÃ±ada la modal de creaciÃ³n/ediciÃ³n con selector visual interactivo de 5 categorÃ­as con iconos, selector de prioridad en 3 niveles y atajos de fecha rÃ¡pida.

### VersiÃ³n 4.14.6 - IntegraciÃ³n Completa del MÃ³dulo Pedidos a Proveedor en Panel Super Admin
- [x] **Consola Maestra de Pedidos a Proveedor en Super Admin ([`SuperadminSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminSection.tsx)):**
  - Implementado selector de vistas superior para alternar instantÃ¡neamente entre el *"Gestor Maestro de MÃ³dulos"* y *"Pedidos a Proveedor"* dentro de la consola del Super Admin.
  - Integrada la vista completa de [`SuppliersOrdersSection`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SuppliersOrdersSection.tsx) en el panel Super Admin con sincronizaciÃ³n en tiempo real con Cloudflare D1.
  - AÃ±adido botÃ³n de acciÃ³n rÃ¡pida *"Pedidos Proveedor"* en la barra de cabecera con contador de Ã³rdenes activas y botÃ³n de retorno al gestor de mÃ³dulos.
  - DiseÃ±ada tarjeta interactiva de control directo *"Control de Pedidos a Proveedor & Requisiciones"* con mÃ©tricas en vivo de Ã³rdenes por pedir e historial de compras realizadas.

### VersiÃ³n 4.14.5 - Blindaje y Persistencia Inmutable de Disponibilidad de Productos
- [x] **SoluciÃ³n a ReversiÃ³n de Disponibilidad en Polling ([`products.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/products.ts)):**
  - Corregido el mapeo `mapRowToProduct`: los valores `NULL` de SQLite en `is_available` ahora se resuelven a `true` (disponible por defecto) en lugar de evaluarse errÃ³neamente a `false` por coerciÃ³n booleana de `null`.
  - Agregada migraciÃ³n defensiva automÃ¡tica en `onRequestGet` (`UPDATE products SET is_available = 1 WHERE is_available IS NULL`) para blindar todos los registros existentes en la base de datos Cloudflare D1.
  - Implementado upsert seguro en `onRequestPut` para garantizar que actualizaciones de disponibilidad persistan tanto si el registro ya existÃ­a como si debe crearse.
- [x] **SincronizaciÃ³n Segura en Frontend ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`seedData.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/seedData.ts)):**
  - Actualizado `fetchLatestData` para verificar tipo estricto `boolean` al mezclar datos de la nube con el estado local, impidiendo que respuestas no inicializadas sobreescriban el estado disponible.
  - Enriquecido el payload de `toggleProductAvailability` con datos de respaldo para sincronizaciÃ³n atÃ³mica en D1 y aÃ±adidas banderas explÃ­citas en `INITIAL_PRODUCTS`.

### VersiÃ³n 4.14.4 - Visibilidad Inmediata y Acceso RÃ¡pido al MÃ³dulo Pedidos Proveedor
- [x] **Acceso Directo desde la Barra Superior ([`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx)):**
  - Actualizado el botÃ³n de cabecera con el rÃ³tulo claro *"Pedidos Proveedor"*, icono `Truck` y badge con el conteo de pedidos activos para entrar directamente a la secciÃ³n desde cualquier pantalla.
- [x] **Claridad en PestaÃ±as ([`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx)):**
  - Renombrada la pestaÃ±a administrativa de *"Proveedores"* a *"Pedidos Proveedor"* para que sea inmediatamente reconocible frente a otros mÃ³dulos.
- [x] **Blindaje Universal de Permisos de SesiÃ³n ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Ajustado `hasPermission` y la inicializaciÃ³n de sesiones guardadas en `localStorage` para asignar `suppliers: true` por defecto a todos los roles y perfiles existentes (AdministraciÃ³n, MarÃ­a, Alisto, Mostrador), evitando que sesiones anteriores ocultaran el mÃ³dulo.

### VersiÃ³n 4.14.3 - Selector y Creador DinÃ¡mico de Ubicaciones en Estante (WMS)
- [x] **Selector y CreaciÃ³n DinÃ¡mica de Ubicaciones ([`NewProductModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/NewProductModal.tsx)):**
  - Implementado selector desplegable de ubicaciones en estante que unifica las estanterÃ­as por defecto, las ubicaciones utilizadas por los productos existentes y las ubicaciones personalizadas guardadas.
  - Incorporada opciÃ³n `âœ¨ + Crear nueva ubicaciÃ³n...` dentro del dropdown y botÃ³n superior `+ Nueva ubicaciÃ³n` para alternar fluidamente al campo de creaciÃ³n con autofocus y botÃ³n cancelar.
  - Persistencia automÃ¡tica de nuevas ubicaciones creadas en memoria persistente (`byfio_custom_shelf_locations_v1`) para reutilizarlas en futuros productos.

### VersiÃ³n 4.14.2 - MÃ³dulo Completo de Pedidos a Proveedor con Borradores e Historial
- [x] **MÃ³dulo Dedicado de Pedidos a Proveedor ([`SuppliersOrdersSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SuppliersOrdersSection.tsx)):**
  - Implementado el mÃ³dulo administrativo *"Pedidos a Proveedores & Requisiciones"* con mÃ©tricas en tiempo real, bÃºsqueda por nÃºmero, proveedor y SKU, y filtros por pestaÃ±as (*"Todos"*, *"Por Pedir (Borradores)"*, *"Pedidos Realizados"* y *"Recibidos"*).
  - PestaÃ±a *"Por Pedir (Borradores)"*: permite guardar pedidos en preparaciÃ³n para pedirlos formalmente despuÃ©s al proveedor.
  - PestaÃ±a *"Pedidos Realizados (Historial)"*: registra el historial de compras ya solicitadas a los proveedores con fecha y montos.
  - Acciones completas por orden: marcar como pedido al proveedor, marcar como recibido en taller, enviar o reenviar por WhatsApp con mensaje desglosado, e imprimir ficha formal.
- [x] **IntegraciÃ³n con RequisiciÃ³n y Base de Datos D1 ([`SupplierOrderModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierOrderModal.tsx), [`supplier-orders.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/supplier-orders.ts), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - En la modal de requisiciÃ³n de stock bajo se aÃ±adieron los botones directos *"Guardar Por Pedir"* y *"Guardar Pedido Realizado"*.
  - Persistencia remota en Cloudflare D1 vÃ­a `/api/supplier-orders` y en `localStorage`.
- [x] **NavegaciÃ³n y Permisos de Usuario ([`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx), [`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx), [`UserProfilesSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/UserProfilesSection.tsx), [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - AÃ±adida la pestaÃ±a superior *"Proveedores"* con contador en vivo de Ã³rdenes activas.
  - Tarjeta de acceso directo en el MenÃº Principal (Hub) y asignaciÃ³n de permisos por perfil de usuario.

### VersiÃ³n 4.14.1 - RestauraciÃ³n Oficial y Blindaje del Perfil de MARÃA en D1
- [x] **RestauraciÃ³n del Perfil de MARÃA ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`user-profiles.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/user-profiles.ts)):**
  - Se restaurÃ³ formalmente a **MARÃA** (PIN inicial `1234`, rol `staff` con permisos completos de ventas, facturaciÃ³n, mostrador y pedidos) como perfil permanente del sistema.
  - Sincronizado en la base de datos Cloudflare D1 (`app_user_profiles`) para que aparezca en todos los dispositivos y nunca mÃ¡s dependa de la memoria volÃ¡til del navegador.
- [x] **MÃ³dulo de Pedidos a Proveedor & Requisiciones de Inventario ([`SuppliersOrdersSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SuppliersOrdersSection.tsx), [`SupplierOrderModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierOrderModal.tsx)):**
  - Finalizada la integraciÃ³n del mÃ³dulo de gestiÃ³n de Ã³rdenes de reposiciÃ³n y compras a proveedores vinculadas con el inventario y agenda.


### VersiÃ³n 4.14.0 - Control Maestro de Stock y Disponibilidad en Superadmin
- [x] **Tarjeta de Control Directo en Superadmin ([`SuperadminSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminSection.tsx)):**
  - Incorporada tarjeta de control directo interactiva en la consola del Superadmin con los dos botones exactos: *"Desactivar stock de inventario"* y *"Activar disponibilidad de producto"*, permitiendo alternar al instante entre Modo Stock NumÃ©rico Real y Disponibilidad RÃ¡pida con sincronizaciÃ³n en tiempo real.
- [x] **Nombres Literales y Persistencia en Base de Datos D1 ([`superadminModulesData.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/superadminModulesData.ts), [`InventoryTable.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx)):**
  - Renombradas las sub-funcionalidades internas del mÃ³dulo Inventario a *"Desactivar stock de inventario"* (`inventory_stock_mode`) y *"Activar disponibilidad de producto"* (`product_availability_mode`).
  - Habilitados ambos toggles en Cloudflare D1 (`byfiocr-db`) y vinculados en [`InventoryTable.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx) con fallback defensivo (`!== false`) para garantizar su visualizaciÃ³n inmediata en cualquier dispositivo.

### VersiÃ³n 4.13.9 - SincronizaciÃ³n AutomÃ¡tica Continua y Bypass de CachÃ© para Perfiles
- [x] **FusiÃ³n Forzosa y Polling Continuo ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`users.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/users.ts), [`user-profiles.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/user-profiles.ts)):**
  - Implementado mapa de fusiÃ³n defensiva en el estado inicial de `userProfiles` para inyectar automÃ¡ticamente el perfil de AdministraciÃ³n aunque el navegador mantenga cachÃ© de 2 perfiles.
  - Integrada la sincronizaciÃ³n de perfiles en `fetchLatestData` (con polling inteligente cada 8s y al enfocar la ventana) con parÃ¡metros de bypass de cachÃ© (`?_t=timestamp`, `cache: 'no-store'`) y cabeceras `Cache-Control: no-store` en los endpoints D1.


### VersiÃ³n 4.13.8 - Limpieza Visual en Cabecera del Panel de Control
- [x] **EliminaciÃ³n de Texto TÃ©cnico ([`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx)):**
  - Removido el rÃ³tulo superior `"Sistema WMS / ERP Ligero"` de la cabecera del panel de administraciÃ³n para un encabezado mÃ¡s limpio, directo y enfocado en la marca By.Fio.

### VersiÃ³n 4.13.7 - IncorporaciÃ³n y ProtecciÃ³n del Perfil de Administrador Maestro en Base de Datos D1
- [x] **Restablecimiento del 3er Perfil de Usuario ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`UserProfilesSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/UserProfilesSection.tsx)):**
  - Se vinculÃ³ explÃ­citamente el perfil `prof-admin` (*ADMINISTRACIÃ“N (FIO)*, PIN `7777`, rol `admin`) en `DEFAULT_USER_PROFILES`, en la persistencia local y en Cloudflare D1.
  - El sistema ahora muestra con total exactitud los 3 perfiles oficiales: `ADMINISTRACIÃ“N (FIO)`, `ALISTO DE PEDIDOS` y `ATENCIÃ“N Y TALLERES`.
- [x] **Blindaje del Perfil Maestro ([`UserProfilesSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/UserProfilesSection.tsx)):**
  - Distintivo visual dorado `ðŸ‘‘ Administrador Total` y bloqueo contra eliminaciÃ³n accidental para asegurar que el acceso administrativo permanezca disponible.


### VersiÃ³n 4.13.6 - RestauraciÃ³n y Visibilidad Omnipresente de Perfiles de Usuario
- [x] **Visibilidad Omnipresente en Admin y MÃ³vil ([`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx), [`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Se renombrÃ³ la pestaÃ±a administrativa a *"Perfiles de Usuario"* y se ampliÃ³ la cuadrÃ­cula a `xl:grid-cols-10` para garantizar que las 10 pestaÃ±as quepan de manera simÃ©trica sin ocultarse ni empujarse.
  - Se eliminÃ³ la restricciÃ³n `hidden sm:flex` del indicador de sesiÃ³n en la barra de navegaciÃ³n; ahora el perfil activo (`ALISTO DE PEDIDOS`, `ATENCIÃ“N Y TALLERES`, `Admin`) es visible en celulares y escritorio en todo momento.
- [x] **Aviso Claro y Selector de Perfiles Operativos ([`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx), [`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx), [`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx)):**
  - Si un usuario ingresa con un PIN de colaborador operativo (Staff), se despliega un aviso intuitivo indicando que estÃ¡ en perfil operativo y un botÃ³n directo para cambiar a Administrador.
  - En la ventana de inicio de sesiÃ³n se incorporaron chips de acceso rÃ¡pido con los perfiles existentes para entrar en 1 toque.
  - La tarjeta de *"Perfiles de Usuarios"* se organizÃ³ en cuadrÃ­cula balanceada `lg:grid-cols-5` en el MenÃº Principal del Admin.


### VersiÃ³n 4.13.5 - TransiciÃ³n de Estado a Empaque y Nueva PestaÃ±a de Filtro Empacados
- [x] **Flujo Completo En Empaque â†’ Empacado ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`index.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/types/index.ts)):**
  - Los pedidos que finalizan alisto pasan a estado *"En Empaque"* (`packing`) mostrando la etiqueta de empaque y el botÃ³n de acciÃ³n *"Marcar Empacado"*.
  - Al pulsar *"Marcar Empacado"*, el pedido pasa a estado *"Empacado"* (`packed`), mostrando la etiqueta verde de empacado y habilitando el botÃ³n *"Marcar Entregado"*.
- [x] **Nueva PestaÃ±a de Filtro RÃ¡pido *"Empacados"* ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx)):**
  - Se agregÃ³ la pestaÃ±a de filtro dedicada *"Empacados"* con conteo en tiempo real, permitiendo aislar y gestionar de forma independiente los pedidos que ya fueron empacados y esperan retiro o entrega.

### VersiÃ³n 4.13.4 - ReubicaciÃ³n ErgonÃ³mica del BotÃ³n Cerrar en RequisiciÃ³n de Inventario
- [x] **ReubicaciÃ³n Dual de Cierre ([`SupplierOrderModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierOrderModal.tsx)):**
  - Se desacoplÃ³ el botÃ³n de cierre de la barra de herramientas y se anclÃ³ fijamente en la esquina superior derecha (`absolute top-3.5 right-3.5`) con badge circular blanco y sombra sutil para acceso inmediato y ergonÃ³mico.
  - Se incorporÃ³ un botÃ³n secundario adicional *"Cerrar"* en la barra de acciones inferior junto a *"Imprimir / PDF"* y *"Guardar en Agenda"*.

### VersiÃ³n 4.13.3 - OptimizaciÃ³n Responsiva del Modal Registrar Nuevo Cliente
- [x] **Ajuste de VisualizaciÃ³n sin Cortes de Pantalla ([`CustomersSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/CustomersSection.tsx), [`QuickBillingSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/QuickBillingSection.tsx)):**
  - Se corrigiÃ³ el problema de corte vertical en la ventana modal *"Registrar Nuevo Cliente"* en pantallas pequeÃ±as, mÃ³viles y laptops.
  - Implementada estructura de flex-column con altura mÃ¡xima adaptable (`max-h-[92vh] sm:max-h-[90vh]`), cabecera fija (`shrink-0`), zona de campos con scroll interno independiente (`overflow-y-auto flex-1`) y barra inferior de botones fija (`shrink-0`).
  - Los botones de *"Guardar Cliente"* y *"Cancelar"* ahora permanecen siempre visibles y accesibles en pantalla.

### VersiÃ³n 4.13.2 - IntegraciÃ³n de RequisiciÃ³n de Inventario con Guardado en Agenda
- [x] **Guardar Ã“rdenes de Compra en Agenda ([`SupplierOrderModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierOrderModal.tsx)):**
  - En la modal *"Orden de Compra & RequisiciÃ³n de Inventario"*, se reemplazÃ³ el enlace de *"Enviar Orden por WhatsApp a Proveedor"* por el botÃ³n interactivo *"Guardar en Agenda"*.
  - Al pulsar, genera automÃ¡ticamente una actividad de alta prioridad en la Agenda en la categorÃ­a `proveedor`, con fecha, hora, desglose de artÃ­culos y costo estimado, mostrando confirmaciÃ³n tÃ¡ctil `Â¡Guardado en Agenda!`.

### VersiÃ³n 4.13.1 - MÃ³dulo de Agenda & Organizador de Tareas en Admin y Superadmin
- [x] **MÃ³dulo Dedicado de Agenda en Admin ([`AgendaSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AgendaSection.tsx)):**
  - Implementado el mÃ³dulo completo *"Agenda & Organizador de Tareas"* para planificaciÃ³n del taller, entregas de pedidos, compras de insumos, producciÃ³n y recordatorios.
  - GestiÃ³n completa de tareas con fechas, horas, niveles de prioridad (alta, media, baja) y categorÃ­as visuales.
  - Checkbox interactivo circular para completar tareas al instante con efectos visuales y filtros rÃ¡pidos por fecha ("Hoy", "Esta Semana", "Pendientes", "Completadas").
  - SincronizaciÃ³n automÃ¡tica con talleres creativos de By.Fio para ver cursos programados directamente en el calendario.
- [x] **IntegraciÃ³n Granular en Superadmin ([`superadminModulesData.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/superadminModulesData.ts)):**
  - Creado el mÃ³dulo `"agenda"` (`Agenda & Organizador de Tareas`) en la categorÃ­a *Operaciones & WMS* con funcionalidades configurables: *"Calendario y Cronograma de Actividades"*, *"Lista de Tareas RÃ¡pidas (To-Do)"* y *"SincronizaciÃ³n AutomÃ¡tica con Talleres"*.
  - SincronizaciÃ³n remota y persistencia en Cloudflare D1 mediante el endpoint `/api/agenda`.
- [x] **PestaÃ±as y Accesos ([`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx), [`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx), [`UserProfilesSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/UserProfilesSection.tsx)):**
  - AÃ±adido el tab *"Agenda"* con contador en vivo de tareas pendientes.
  - Tarjeta de acceso directo en el MenÃº Principal (Hub) y asignaciÃ³n de permisos por perfil de usuario.

### VersiÃ³n 4.9.4 - ErradicaciÃ³n Universal de Caracteres Corruptos y Saneamiento UTF-8
- [x] **CorrecciÃ³n de CodificaciÃ³n en Base de Datos Cloudflare D1 ([`users.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/users.ts), [`user-profiles.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/user-profiles.ts), [`orders.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/orders.ts)):**
  - Identificada y erradicada la presencia de caracteres de reemplazo corruptos (`` / `\uFFFD`) almacenados en los registros remotos de D1 (`app_user_profiles` y pedidos histÃ³ricos).
  - Los endpoints de API ahora incorporan saneamiento automÃ¡tico (`healString` / `sanitizeProfilesData`) en lectura y escritura para garantizar acentos, eÃ±es y caracteres en espaÃ±ol perfectos.
- [x] **Motor de Saneamiento Profundo en Frontend ([`sanitizeText.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/sanitizeText.ts), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Creada la utilidad `deepSanitize` que detecta y repara automÃ¡ticamente patrones mal codificados (ej. `"ATENCIN"` -> `"ATENCIÃ“N"`, `"Tibs"` -> `"TibÃ¡s"`, `"catlogo"` -> `"catÃ¡logo"`, `"rdenes"` -> `"Ã³rdenes"`, `"cumpleaos"` -> `"cumpleaÃ±os"`).
  - Auto-reparaciÃ³n de la cachÃ© local (`localStorage`): Al arrancar la aplicaciÃ³n, si el navegador del cliente contiene datos locales previamente daÃ±ados, los sanea en memoria y sobreescribe el almacenamiento con la versiÃ³n Ã­ntegra.

### VersiÃ³n 4.13.0 - MÃ³dulo Independiente de Directorio de Clientes & Contactos
- [x] **MÃ³dulo Dedicado de Clientes en Panel Admin ([`CustomersSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/CustomersSection.tsx)):**
  - Creado el mÃ³dulo independiente *"Directorio de Clientes"* en el panel de administraciÃ³n para registrar y consultar clientes frecuentes.
  - Formulario completo con Nombre, CÃ©dula / IdentificaciÃ³n, TelÃ©fono / WhatsApp, Correo, DirecciÃ³n de entrega y Notas de pedido.
  - BÃºsqueda reactiva instantÃ¡nea por cualquier dato y enlace directo a WhatsApp en un solo clic.
  - BotÃ³n de acciÃ³n rÃ¡pida *"Facturar / Crear Pedido"* para abrir la facturaciÃ³n POS con todos los datos del cliente cargados automÃ¡ticamente.
- [x] **NavegaciÃ³n e IntegraciÃ³n de PestaÃ±as ([`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx), [`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx), [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - AÃ±adida la pestaÃ±a superior *"Clientes"* con contador en vivo de clientes registrados.
  - Tarjeta de acceso directo en el MenÃº Principal (Hub) con gradiente y conteo.
  - ConexiÃ³n fluida con [`QuickBillingSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/QuickBillingSection.tsx) para facturar de inmediato.
- [x] **Control Granular en Superadmin ([`superadminModulesData.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/superadminModulesData.ts), [`routeHelpers.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/routeHelpers.ts)):**
  - MÃ³dulo `customers` registrado en la matriz de Superadmin con toggles de creaciÃ³n, bÃºsqueda y pedidos rÃ¡pidos.
  - Soporte de sub-ruta `/admin/clientes` con protecciÃ³n de permisos de rol.

### VersiÃ³n 4.12.5 - SincronizaciÃ³n en la Nube D1 y FusiÃ³n Inmutable de Funcionalidades de Superadmin
- [x] **FusiÃ³n Defensiva Cloud & Local ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Implementada la funciÃ³n `mergeSuperadminModules` en la carga de la API `/api/superadmin-modules`, en eventos de `BroadcastChannel` y eventos `storage`.
  - Evita que snapshots antiguos en Cloudflare D1 sobreescriban o eliminen funcionalidades nuevas como `"Desactivar / Activar Stock de Inventario"` o `"Activar / Desactivar Disponibilidad de Producto"`.
- [x] **ActualizaciÃ³n Inmediata de Base de Datos Cloudflare D1:**
  - Base de datos en producciÃ³n actualizada directamente con los 12 mÃ³dulos y todas las funcionalidades hijas sincronizadas.

### VersiÃ³n 4.12.4 - Escala +50% en Alisto de Pedidos y Perfil de Alisto para Dispositivos MÃ³viles
- [x] **OptimizaciÃ³n ErgonÃ³mica de Alisto en Celular (+50%) ([`GuidedPickingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx)):**
  - Incrementadas en un 50% las dimensiones de imagen de producto (`w-36 h-36`), badge de estante (`text-xs` destacado), cÃ³digo SKU, tÃ­tulo del artÃ­culo (`text-xl font-black`) y contador de cantidad a alistar (`text-base font-black` con fondo contrastado) en vista mÃ³vil.
  - BotÃ³n tÃ¡ctil principal *"Aceptar y Continuar"* ampliado a `py-4 text-base font-black min-h-[52px]` con icono agrandado para facilitar el picking con una sola mano.
  - Botones secundarios de faltante, salida y validaciÃ³n de cÃ³digo ampliados a escala tÃ¡ctil para celular.
- [x] **Botones de Cola de Pedidos en Celular ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx)):**
  - Los botones de *"Alisto con CÃ³digo"* y *"Alisto Manual"* cuentan con altura mÃ­nima ergonÃ³mica `min-h-[48px]`, tipografÃ­a aumentada (`text-sm font-black`) e iconos de 20px en vista mÃ³vil.
- [x] **Tarjeta de Perfil de Alisto en Celular ([`UserProfilesSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/UserProfilesSection.tsx)):**
  - La tarjeta del colaborador de Alisto (`ALISTO DE PEDIDOS`) en celulares se muestra un 50% mÃ¡s grande con padding ampliado (`p-6`), tÃ­tulo `text-xl font-black`, PIN en `text-2xl font-black`, badge distintivo `ðŸ“¦ Alisto MÃ³vil (+50%)` y botones tÃ¡ctiles agrandados.
- [x] **NavegaciÃ³n Directa a Alisto para Colaboradores ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Al ingresar con el PIN del perfil de alisto (PIN 1001), el sistema redirige automÃ¡ticamente y de inmediato a la Cola de Pedidos / Alisto sin escalas intermedias.

### VersiÃ³n 4.12.3 - Toggles de Stock de Inventario y Disponibilidad de Producto en Superadmin
- [x] **Funcionalidades de Inventario en Superadmin ([`superadminModulesData.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/superadminModulesData.ts)):**
  - Incorporadas las funcionalidades granulares `"Desactivar / Activar Stock de Inventario"` (`inventory_stock_mode`) y `"Activar / Desactivar Disponibilidad de Producto"` (`product_availability_mode`) dentro del mÃ³dulo `Inventario & Etiquetas QR`.
  - ConexiÃ³n reactiva en vivo en [`InventoryTable.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx) para condicionar la visibilidad de los botones de alternancia y ajustar automÃ¡ticamente el modo activo segÃºn los permisos de Superadmin.

### VersiÃ³n 4.12.2 - Toggles Granulares de Alisto con CÃ³digo y Alisto Manual en Superadmin & Auto-RecuperaciÃ³n de Chunks
- [x] **Funcionalidades de Alisto en Superadmin ([`superadminModulesData.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/superadminModulesData.ts)):**
  - Renombradas y expuestas con exactitud las funcionalidades `"Alisto con CÃ³digo"` y `"Alisto Manual"` en el mÃ³dulo `Cola de Pedidos & Alisto WMS`.
  - ConexiÃ³n reactiva en vivo en la Cola de Pedidos ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx)) y en el modal de alisto guiado ([`GuidedPickingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx)) mediante `isFeatureEnabled`.
- [x] **Auto-RecuperaciÃ³n Transparente tras Despliegues ([`ErrorBoundary.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/ErrorBoundary.tsx), [`main.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/main.tsx)):**
  - Eliminado el bloqueo de recarga al detectar assets desactualizados tras un despliegue en producciÃ³n; se aplica bypass de cachÃ© inmediato con timestamp para actualizar los scripts transparentemente sin interrupciones.

### VersiÃ³n 4.12.1 - EliminaciÃ³n de Barra de Breadcrumbs del Panel de AdministraciÃ³n
- [x] **EliminaciÃ³n QuirÃºrgica de Breadcrumbs en Panel Admin ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Removida la secciÃ³n de navegaciÃ³n tipo pÃ­ldora (`TreeNavigation`) que mostraba `[ â˜… by.fio / caja & reportes ]` en la cabecera del panel administrativo.
  - Limpiadas las referencias locales de navegaciÃ³n de migas de pan y dependencias no utilizadas en la vista de administraciÃ³n.

### VersiÃ³n 4.12.0 - DesactivaciÃ³n Reactiva en Tiempo Real (0ms) de MÃ³dulos y Funcionalidades
- [x] **EjecuciÃ³n Reactiva en Tiempo Real 0ms ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`superadmin-modules.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/superadmin-modules.ts)):**
  - Al desmarcar cualquier casilla de mÃ³dulo o funcionalidad hija en `/panel/superadmin`, el cambio se propaga de inmediato (0ms) en la sesiÃ³n local, a travÃ©s de `BroadcastChannel`, evento `storage` entre pestaÃ±as y respaldo en la nube con Cloudflare D1.
- [x] **DesactivaciÃ³n Inmediata de Funcionalidades en Componentes Web:**
  - **Cola de Pedidos & Alisto ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx), [`GuidedPickingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx)):** Los botones de *"Alisto Manual"*, *"Alisto con CÃ³digo"* y el botÃ³n *"Reportar Faltante"* se ocultan de inmediato si su casilla respectiva estÃ¡ desactivada.
  - **Inventario & Etiquetas QR ([`InventoryTable.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx)):** Los controles de *"Nuevo Producto"*, *"Editar/Eliminar"*, *"Lista de Proveedores"* y *"Generar QR"* responden al estado de cada checkbox.
  - **FacturaciÃ³n POS ([`QuickBillingSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/QuickBillingSection.tsx)):** Las pestaÃ±as de *"Facturar Pedido Existente"* y *"Crear Factura Directa"* se ocultan reactivamente.
  - **Caja & ReporterÃ­a ([`CashRegisterReports.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/CashRegisterReports.tsx)):** El botÃ³n de *"Cierre de Caja"* y el desglose de *"Tienda vs Talleres"* se desactivan si se desmarcan sus funcionalidades.
  - **Pagos SINPE MÃ³vil BCR ([`SinpePaymentsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SinpePaymentsSection.tsx), [`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx)):** OcultaciÃ³n de la pestaÃ±a de vinculaciÃ³n de correo BCR y activaciÃ³n o flexibilizaciÃ³n de validaciÃ³n de comprobante Ãºnico y monto cruzado.
  - **Talleres Creativos ([`WorkshopEnrollmentsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/WorkshopEnrollmentsSection.tsx)):** El botÃ³n *"Crear Taller"* y el contador de auditorÃ­a *"Talleres Pagados & Confirmados"* se ocultan en tiempo real.
  - **CatÃ¡logo & Tienda ([`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx), [`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx), [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):** El botÃ³n directo de WhatsApp en catÃ¡logo y el botÃ³n/panel del carrito interactivo se desactivan al desmarcar su funcionalidad.
  - **ProtecciÃ³n AutomÃ¡tica de Rutas ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):** Si un usuario se encuentra en una secciÃ³n cuyo mÃ³dulo es desactivado, es redirigido automÃ¡ticamente en vivo a la portada o Hub.

### VersiÃ³n 4.11.3 - Ruta Exclusiva /panel/superadmin, Acceso Directo en 1 Clic y ErradicaciÃ³n de MayÃºsculas Forzadas
- [x] **Ruta Exclusiva de Superadmin `/panel/superadmin` ([`routeHelpers.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/routeHelpers.ts), [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx)):**
  - Asignada la URL exclusiva `/panel/superadmin` al panel maestro de Superadministrador para independizarlo por completo del `/admin` regular del sitio.
  - Priorizada la detecciÃ³n de `/panel/superadmin` en el enrutador antes de cualquier verificaciÃ³n de `/admin`, evitando colisiones o sobreescritura de URL.
  - Actualizados todos los callbacks de inicio de sesiÃ³n (`onSuccess`) en `App.tsx` para que las credenciales de Superadmin redirijan automÃ¡ticamente a `/panel/superadmin`.
- [x] **ErradicaciÃ³n de MayÃºsculas Forzadas en Login ([`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx)):**
  - Cambiada la pestaÃ±a por defecto a `Correo` para evitar confusiÃ³n con el campo de perfil en mayÃºsculas del PIN.
  - Eliminado el formateo obligatorio `.toUpperCase()` y clase CSS `uppercase` de los campos de entrada, agregando `autoCapitalize="none" autoCorrect="off" spellCheck={false}`.
- [x] **Acceso Directo e Infalible en 1 Clic ([`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx), [`SuperadminLogin.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminLogin.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - AÃ±adido botÃ³n interactivo `âš¡ Entrar como Superadmin (1 Clic directo)` tanto en el modal general como en la pantalla de inicio de sesiÃ³n de Superadmin.
  - DetecciÃ³n inmediata e infalible de credenciales de Superadmin (`superadmin@byfio.com` / `SuperAdmin2026!`) antes del flujo estÃ¡ndar con limpieza de caracteres invisibles.

### VersiÃ³n 4.11.1 - CorrecciÃ³n Universal de AutenticaciÃ³n de Superadmin en Modal y Portal
- [x] **Compatibilidad Universal de Credenciales Superadmin ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx)):**
  - Habilitado el reconocimiento de la cuenta de Superadmin (`superadmin@byfio.com` / `superadmin` con clave `SuperAdmin2026!`) en el mÃ©todo global de login (`loginUser`), permitiendo ingresar tanto desde el modal general de acceso como desde el portal `/superadmin`.
  - Agregada tolerancia a mayÃºsculas/minÃºsculas y espacios accidentales en usuario y contraseÃ±a (`SuperAdmin2026!`, `superadmin2026!`, `superadmin`).
- [x] **Desbloqueo de la Vista del Portal Superadmin ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`SuperadminLogin.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminLogin.tsx)):**
  - Removido el bloqueo prematuro de ruta que impedÃ­a cargar el formulario de login del Superadmin cuando el usuario no estaba previamente autenticado.
  - AÃ±adida tarjeta con visualizaciÃ³n clara de credenciales oficiales y botÃ³n de autocompletado en un clic dentro de `SuperadminLogin.tsx` y chip directo en `LoginModal.tsx`.

### VersiÃ³n 4.11.0 - RestricciÃ³n Confidencial de Propuesta Integral, Ficha TÃ©cnica y MÃ©tricas Exclusivas para Admin y Superadmin
- [x] **Blindaje de Rutas Confidenciales ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Protegidas con compuerta de autenticaciÃ³n estricta las rutas `/propuesta`, `/metricas` y `/superadmin`.
  - Si un colaborador o perfil de usuario con PIN ingresa a estas rutas, el sistema bloquea el contenido y despliega la tarjeta de *"Acceso Restringido: Este panel es confidencial y solo estÃ¡ autorizado para el admin y superadmin"*.
- [x] **OcultaciÃ³n Total en el MenÃº y Cabecera de AdministraciÃ³n ([`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx), [`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx)):**
  - Ocultados los botones *"Superadmin"* y *"Propuesta"* de la cabecera de administraciÃ³n para perfiles de usuario estÃ¡ndar.
  - Eliminadas las tarjetas de acceso *"Propuesta Integral & Ficha TÃ©cnica"* y *"MÃ©tricas de Visitas & Rastreo"* del menÃº principal del Hub cuando un colaborador inicia sesiÃ³n con su PIN.
- [x] **OcultaciÃ³n en NavegaciÃ³n MÃ³vil ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - El botÃ³n *"ðŸ“‹ Propuesta del Sistema"* en el menÃº mÃ³vil ahora solo se muestra si el usuario autenticado tiene rol de `admin` o es `isMasterAdmin`.

### VersiÃ³n 4.9.3 - TransiciÃ³n a Estado "En Empaque", Filtro Dedicado y FacturaciÃ³n Directa u Opcional
- [x] **TransiciÃ³n Oficial a Estado "En Empaque" ([`GuidedPickingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx), [`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx)):**
  - Al completar la verificaciÃ³n de todos los artÃ­culos de un pedido, este pasa formalmente al estado `packed` con la etiqueta distintiva *"ðŸ“¦ En Empaque"*.
  - En la ventana de alisto se indica claramente *"Estado del Pedido: En Empaque ðŸ“¦"* para confirmar que el pedido ha avanzado de etapa.
- [x] **PestaÃ±a de Filtro RÃ¡pido "En Empaque" en la Cola de AdministraciÃ³n ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx)):**
  - Creada la pestaÃ±a dedicada *"ðŸ“¦ En Empaque"* junto a *"Todos"*, *"Pendientes de Alisto"* y *"Entregados"*.
  - Los administradores pueden filtrar con un solo clic todos los pedidos que ya estÃ¡n alistados y listos en empaque, con su respectivo contador en tiempo real.
- [x] **FacturaciÃ³n Directa u Opcional ([`GuidedPickingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx), [`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx)):**
  - En la ventana al finalizar el alisto se ofrece el botÃ³n prominente *"Generar Factura de una Vez"*, permitiendo emitir e imprimir el comprobante oficial de inmediato si se desea.
  - Alternativamente, el operador puede simplemente pulsar *"Continuar con Siguiente Pedido"* o *"Salir a Pedidos"*, dejando la orden en empaque para que el administrador genere la factura posteriormente desde la cola mediante el botÃ³n *"Generar / Ver Factura"*.

### VersiÃ³n 4.9.2 - Flujo Guiado Post-Alisto: "Â¿Continuar con el Siguiente Pedido?"
- [x] **Modal de DecisiÃ³n y Botones de Aceptar, Continuar y Salir ([`GuidedPickingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - **BotÃ³n "Aceptar y Continuar" visible durante el alisto:** En el alisto manual el botÃ³n principal ahora indica explÃ­citamente *"Aceptar y Continuar"* para validar el producto actual y avanzar al siguiente.
  - **BotÃ³n "Salir a la Cola de Pedidos" permanente:** Visible en la parte inferior tanto en alisto manual como en alisto con cÃ³digo, permitiendo salir a la lista de pedidos en cualquier momento sin depender Ãºnicamente de la 'X' superior.
  - **SincronizaciÃ³n Reactiva Inmediata:** CorrecciÃ³n de la sincronizaciÃ³n de estado en `AppContext.tsx` (`markItemPicked`, `markItemMissing`) ejecutando `setActivePickingOrder` fuera del updater de `setOrders` y leyendo `currentOrder` directamente desde `orders` en `GuidedPickingModal.tsx`.
  - **Tarjeta "Â¿Continuar con el siguiente pedido?":** Se despliega al finalizar todos los artÃ­culos del pedido actual, mostrando los botones *"Aceptar / Continuar"* (para abrir el siguiente pedido en cola FIFO) y *"Salir a Pedidos"*, garantizando su disponibilidad incluso si la cola no tiene mÃ¡s pedidos pendientes.
  - **Acceso a Factura:** Incluye acceso directo opcional "Ver / Imprimir Factura de este Pedido" para quienes necesiten imprimir de inmediato.
  - Si no quedan pedidos pendientes en cola, felicita al operador y habilita el botÃ³n directo para salir a la lista de pedidos.

### VersiÃ³n 4.10.0 - SecciÃ³n Superadmin con AutenticaciÃ³n Real y Control Modular Granular
- [x] **Portal y AutenticaciÃ³n Real de Superadmin ([`SuperadminSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminSection.tsx), [`SuperadminLogin.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminLogin.tsx), [`superadminModulesData.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/superadminModulesData.ts)):**
  - Creada la ruta independiente y segura `/superadmin` con compuerta de autenticaciÃ³n real con credenciales maestras (`superadmin@byfio.com` / `superadmin`, contraseÃ±a `SuperAdmin2026!`).
  - Incluye selector de visibilidad de contraseÃ±a, validaciÃ³n estricta y botÃ³n de autocompletado rÃ¡pido para pruebas oficiales.
- [x] **Panel Maestro de Control Modular y Funcionalidades Granulares ([`SuperadminModuleCard.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminModuleCard.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Desglose exhaustivo de los 12 mÃ³dulos independientes de la plataforma (`orders`, `billing`, `inventory`, `missing_inventory`, `reports`, `sinpe`, `workshops`, `pricing`, `users`, `metricas`, `catalogo`, `store`).
  - Interruptor maestro por mÃ³dulo con badges de estado ("Visible en Admin" vs "Oculto en Admin").
  - Sub-funcionalidades internas desglosadas por cada mÃ³dulo con checkboxes interactivos individuales para activar o desactivar capacidades especÃ­ficas.
- [x] **DesapariciÃ³n DinÃ¡mica en Tiempo Real del Panel de AdministraciÃ³n ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx), [`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx), [`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - VinculaciÃ³n directa con `hasPermission` e `isModuleEnabled`: si el Superadmin desactiva un mÃ³dulo, desaparece automÃ¡ticamente de las pestaÃ±as (`AdminTabs`), de las tarjetas del menÃº principal (`AdminHubMenu`) y de la navegaciÃ³n pÃºblica.
  - SincronizaciÃ³n instantÃ¡nea (0ms) entre pestaÃ±as mediante `BroadcastChannel` y persistencia en `localStorage` (`byfio_superadmin_modules_v1`).
- [x] **Acceso RÃ¡pido y NavegaciÃ³n Protegida ([`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx), [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - BotÃ³n de acceso directo en el encabezado administrativo (`AdminHeader`) y en el menÃº mÃ³vil para alternar con la consola de Superadmin.
  - Si un usuario intenta acceder por URL directa a un tab desactivado, el sistema redirige automÃ¡ticamente al Hub principal.

### VersiÃ³n 4.9.1 - OptimizaciÃ³n Vertical MÃ³vil Sin Scroll y Limpieza de Encabezado de Alisto
- [x] **EliminaciÃ³n de Iconos Selectores Superiores ([`GuidedPickingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx)):**
  - Removidos por completo los botones e iconos de selecciÃ³n superior (`[Alisto con CÃ³digo]` / `[Alisto Manual]`) de la cabecera de la ventana activa de alisto para evitar redundancia y despejar espacio.
  - La cabecera ahora muestra Ãºnicamente la informaciÃ³n del pedido y el botÃ³n de cierre `X`, luciendo limpia y compacta.
- [x] **ElevaciÃ³n de Ventana y DiseÃ±o MÃ³vil Cero Scroll ([`GuidedPickingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx)):**
  - Elevada la posiciÃ³n de la ventana hacia la parte superior en celulares (`items-start pt-1.5 sm:pt-4`).
  - RediseÃ±ada la visualizaciÃ³n del producto en pantallas mÃ³viles: distribuciÃ³n compacta de miniatura (`w-28 h-28`), estanterÃ­a en badge integrado y botones de acciÃ³n accesibles (`Listo` y `Sin Existencias`), permitiendo ver el producto completo sin necesidad de hacer scroll en el celular.

### VersiÃ³n 4.9.0 - Mensaje Limpio de VerificaciÃ³n SINPE y ActivaciÃ³n Directa de Confirmar Pedido
- [x] **Mensaje Estricto y Limpio de ValidaciÃ³n ([`PaymentAccountsCard.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/PaymentAccountsCard.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Eliminada cualquier menciÃ³n interna sobre "correo del Banco BCR" o "mensajero@bancobcr.com" en las alertas de cara al cliente.
  - El mensaje al validar el pago indica estrictamente: `"Pago verificado con Ã©xito, comprobante nÃºmero #[nÃºmero] y monto confirmado de [monto]. El botÃ³n de 'Confirmar pedido' estÃ¡ activado."`.
- [x] **ActivaciÃ³n y Paso Final ([`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx)):**
  - El botÃ³n `"Confirmar Pedido"` se desbloquea en verde esmeralda inmediatamente despuÃ©s de la validaciÃ³n exitosa.
  - El usuario hace clic en `"Confirmar Pedido"` y avanza directamente al paso final con su orden registrada oficialmente.

### VersiÃ³n 4.8.0 - Alisto Manual Producto por Producto con Botones de Listo / Faltante y EspaÃ±olizaciÃ³n Total
- [x] **Flujo Producto por Producto en Alisto Manual ([`GuidedPickingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx)):**
  - Homologada la interfaz del Alisto Manual para que muestre exactamente la misma ventana guiada paso a paso que el modo con cÃ³digo: imagen amplia del artÃ­culo, ubicaciÃ³n destacada en estante (`Estante A-2`, `Bodega Central`), nombre del producto, SKU y cantidad a alistar.
  - Al procesar un artÃ­culo, avanza automÃ¡ticamente al siguiente de la secuencia cronolÃ³gica hasta completar el 100% de la orden.
- [x] **SustituciÃ³n de ValidaciÃ³n por Botones Directos de AcciÃ³n ([`GuidedPickingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx)):**
  - Reemplazado el Ã¡rea de validaciÃ³n con lector lÃ¡ser por dos botones prominentes y tÃ¡ctiles:
    1. **BotÃ³n Listo (Alistado):** Verde esmeralda, marca el producto como alistado y pasa al siguiente con feedback sonoro/visual.
    2. **BotÃ³n Sin Existencias / Faltante:** Ãmbar de alerta, marca el artÃ­culo como faltante, genera el reporte automÃ¡tico en el mÃ³dulo de inventario y pasa al siguiente.
  - AÃ±adida secciÃ³n plegable opcional para ver el resumen completo de la lista e imprimir la hoja de despacho cuando se requiera.
- [x] **EspaÃ±olizaciÃ³n Integral de TÃ©rminos ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx), [`GuidedPickingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx)):**
  - Erradicadas las frases en inglÃ©s `"Release List con CÃ³digo"` y `"Release List Manual"`, renombradas formalmente a **`Alisto con CÃ³digo`** y **`Alisto Manual`** en los botones de acciÃ³n, encabezados y modales.

### VersiÃ³n 4.7.0 - VerificaciÃ³n Cruzada de Correo BCR (Monto Exacto y GestiÃ³n de Faltante con Segundo Comprobante)
- [x] **VerificaciÃ³n Cruzada Obligatoria en Correos del BCR ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx)):**
  - Al presionar "Validar Pago", el sistema busca en los correos de `mensajero@bancobcr.com` (`sinpeTransactions` y Cloudflare D1) el nÃºmero de referencia y el monto.
  - El monto del comprobante debe coincidir exactamente con el total del carrito del usuario; si no coincide o no existe el correo, se marca como invÃ¡lido.
- [x] **DetecciÃ³n de Monto Incompleto y Apertura de Ventana de Faltante ([`PaymentAccountsCard.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/PaymentAccountsCard.tsx)):**
  - Si el comprobante registrado en el correo es por un monto menor al total del carrito, el sistema lo marca de inmediato como invÃ¡lido/incompleto e indica con exactitud el monto faltante: `"Te faltÃ³ por pagar â‚¡X. Por favor realiza otra transferencia SINPE MÃ³vil y digita el comprobante del faltante."`.
  - Despliega automÃ¡ticamente la "Ventana de Comprobante Faltante" con el desglose del total, el primer abono registrado y un nuevo campo para ingresar el segundo comprobante.
- [x] **GeneraciÃ³n de Cobro Completo con Coincidencia Total:**
  - Al ingresar el segundo comprobante, el sistema verifica que coincida con el correo bancario por el saldo restante exacto.
  - Una vez validados ambos comprobantes (o el comprobante Ãºnico por el 100%), se activa el cobro completo y se habilita el botÃ³n "Confirmar Pedido". Ambos comprobantes quedan registrados e inmutables para impedir su reutilizaciÃ³n.
- [x] **Backend Cloudflare D1 ([`sinpe-transactions.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/sinpe-transactions.ts)):**
  - AÃ±adido soporte para bÃºsqueda filtrada por referencia `?ref=...` y mÃ©todo PATCH para asociar `order_id` inmutablemente a los comprobantes acreditados.

### VersiÃ³n 4.6.0 - EliminaciÃ³n de BotÃ³n de EnvÃ­o de Comprobante y Marcado Inmediato de Pago Verificado
- [x] **EliminaciÃ³n Total de Botones de EnvÃ­o de Comprobante ([`PaymentAccountsCard.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/PaymentAccountsCard.tsx), [`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx)):**
  - Removido el pie y botÃ³n `"Enviar Comprobante"` de WhatsApp de la tarjeta de cuentas bancarias.
  - Removido el botÃ³n redundante de `"Enviar por WhatsApp"` en la pantalla posterior al pago.
- [x] **Marcado Inmediato de Pedido Pagado y Verificado ([`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx), [`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx)):**
  - Al validar y confirmar la orden, el cliente visualiza de inmediato la tarjeta destacada de transacciÃ³n acreditada: `"Pedido Pagado por SINPE MÃ³vil â€” Ya Verificado"`.
  - En la cola de administraciÃ³n de pedidos se refleja instantÃ¡neamente el badge en verde esmeralda: `"Pagado por SINPE MÃ³vil (Verificado)"` con el nÃºmero de comprobante/referencia guardado.

### VersiÃ³n 4.5.0 - ValidaciÃ³n Estricta de Uso Ãšnico de Comprobantes SINPE MÃ³vil y Alerta de Referencia Reutilizada
- [x] **Regla Estricta de ValidaciÃ³n de Uso Ãšnico ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Implementada funciÃ³n universal `validateSinpeReference(ref)` que verifica si un nÃºmero de comprobante o referencia ya fue acreditado o utilizado con anterioridad en cualquier orden, taller o facturaciÃ³n rÃ¡pida.
  - Al detectar un intento de revalidaciÃ³n, genera inmediatamente el mensaje mandatorio: `"Este pago ya fue utilizado, digite correctamente el nÃºmero de referencia de la transferencia."`.
- [x] **ProtecciÃ³n en MÃ³dulo Independiente SINPE BCR ([`SinpePaymentsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SinpePaymentsSection.tsx)):**
  - AÃ±adido el "Validador RÃ¡pido de Referencia SINPE (GarantÃ­a de Uso Ãšnico)" para comprobaciÃ³n instantÃ¡nea de referencias antes de procesarlas.
  - Al extraer un correo BCR con una referencia ya registrada, se bloquea el botÃ³n "Acreditar a Caja Ahora" y se despliega una tarjeta de alerta roja destacada con los detalles del uso previo (fecha, cliente, monto y destino).
- [x] **Blindaje en Checkout y FacturaciÃ³n RÃ¡pida ([`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx), [`QuickBillingSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/QuickBillingSection.tsx)):**
  - ValidaciÃ³n en tiempo real del comprobante SINPE.
  - Si el comprobante ya fue utilizado, bloquea la confirmaciÃ³n del pedido/factura y exige al usuario digitar correctamente el nÃºmero de referencia.
  - Al completar la transacciÃ³n, el comprobante queda registrado e inmutable para impedir reusos futuros en tienda o talleres.
- [x] **Blindaje Backend y Webhook Cloudflare ([`sinpe-transactions.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/sinpe-transactions.ts), [`sinpe-webhook.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/sinpe-webhook.ts)):**
  - Endpoints HTTP devuelven cÃ³digo de estado 409 Conflict con el mensaje exacto exigido si se recibe un nÃºmero de referencia preexistente.

### VersiÃ³n 4.4.0 - PestaÃ±as de Pago SINPE vs Transferencia y ValidaciÃ³n de Comprobante para Habilitar ConfirmaciÃ³n
- [x] **PestaÃ±as Duales de Pago ([`PaymentAccountsCard.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/PaymentAccountsCard.tsx)):**
  - Creadas dos pestaÃ±as superiores para alternar entre `SINPE MÃ³vil` y `Transferencia Bancaria`.
  - PestaÃ±a `SINPE MÃ³vil`: muestra Ãºnicamente el nÃºmero oficial de SINPE MÃ³vil (6400-4640) y oculta la cuenta de ahorros y cuenta IBAN.
  - PestaÃ±a `Transferencia Bancaria`: despliega los datos del Banco de Costa Rica (Cuenta de Ahorros `00126752891` y Cuenta IBAN `CR09015202001267528911`) con sus respectivos botones de copiar al portapapeles.
- [x] **Campo de Comprobante / Referencia y ValidaciÃ³n de Pago ([`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx)):**
  - Incorporado el campo "Digite el nÃºmero de comprobante/referencia" junto al botÃ³n "Validar Pago".
  - Al presionar "Validar Pago", el sistema verifica el comprobante (asegurando formato y comprobando que no haya sido utilizado previamente), mostrando la confirmaciÃ³n visual en verde: `âœ“ Pago verificado con Ã©xito`.
- [x] **Bloqueo Inteligente de ConfirmaciÃ³n de Pedido ([`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx)):**
  - El botÃ³n "Confirmar Pedido" permanece inactivo (`disabled`) con aviso explicativo hasta que el pago haya sido validado.
  - Una vez validado el pago, el botÃ³n se activa inmediatamente en verde esmeralda con feedback auditivo para permitir el registro oficial del pedido.

### VersiÃ³n 4.3.0 - Doble Modalidad de Despacho (Release List con CÃ³digo vs Release List Manual) y ErradicaciÃ³n Total de Errores de Chunk
- [x] **Doble BotÃ³n de Alisto en Cola de Pedidos ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx)):**
  - Implementados los dos botones independientes y claramente identificados para cada pedido pendiente:
    1. `Release List con CÃ³digo`: BotÃ³n morado destacado con icono QR para alisto asistido con lector lÃ¡ser o cÃ³digo QR.
    2. `Release List Manual`: BotÃ³n neomÃ³rfico blanco con borde violeta e icono de checklist para gestiÃ³n manual y fÃ­sica.
- [x] **MÃ³dulo Dual de Picking ([`GuidedPickingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx)):**
  - Selector superior de pestaÃ±a para alternar en cualquier momento entre "Con CÃ³digo" y "Manual".
  - En modo Manual: Checklist interactivo de productos con miniatura, SKU, estanterÃ­a asignada, cantidad, botÃ³n de alternancia alistado/pendiente, opciÃ³n de reporte de faltante, botÃ³n "Marcar Todos" e impresiÃ³n fÃ­sica de la hoja de alisto (`window.print()`).
  - Al completar el alisto en cualquiera de los dos modos se disparan confetis y se activa el acceso a la factura oficial.
- [x] **ErradicaciÃ³n de Errores de Chunks y Pantalla de ActualizaciÃ³n ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`_headers`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/_headers)):**
  - Eliminados todos los `React.lazy` diferidos e importadas las vistas de forma sÃ­ncrona en el bundle principal, erradicando al 100% las fallas "Failed to fetch dynamically imported module" causadas por versiones en cachÃ©.
  - Configurado encabezado de cachÃ© `no-cache, no-store, must-revalidate` para `/` e `/index.html` asegurando que el navegador siempre cargue el index mÃ¡s reciente.

### VersiÃ³n 4.2.0 - ConversiÃ³n del MÃ³dulo de Pagos SINPE BCR en PÃ¡gina Independiente Nube
- [x] **PÃ¡gina de SecciÃ³n Independiente ([`SinpePaymentsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SinpePaymentsSection.tsx)):**
  - Transformado el mÃ³dulo de verificaciÃ³n de pagos SINPE BCR de un pop-up modal a una vista de pÃ¡gina completa e independiente dentro del Panel de AdministraciÃ³n (`/admin/sinpe`).
  - Incluye ribete completo de KPIs de caja (Total verificado, Tienda y Talleres), sub-pestaÃ±as integradas para extracciÃ³n rÃ¡pida, vinculaciÃ³n de redirecciÃ³n automÃ¡tica por correo y tabla de historial con eliminaciÃ³n controlada.
- [x] **IntegraciÃ³n con PestaÃ±as y NavegaciÃ³n de AdministraciÃ³n ([`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx), [`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx), [`routeHelpers.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/routeHelpers.ts)):**
  - Incorporada la pestaÃ±a `ðŸ“² Pagos SINPE` en la barra de navegaciÃ³n neomÃ³rfica de administraciÃ³n con contador dinÃ¡mico de transacciones en vivo.
  - AÃ±adida tarjeta interactiva en el menÃº principal del Hub de AdministraciÃ³n y soporte nativo de subruta `/admin/sinpe`.
- [x] **Enrutamiento Directo sin Pop-ups ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx), [`CashRegisterReports.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/CashRegisterReports.tsx)):**
  - Eliminado el renderizado en ventana flotante/pop-up; los accesos desde cabecera, arqueo de caja y talleres conducen de forma fluida a la pÃ¡gina completa de SINPE.

### VersiÃ³n 4.1.0 - CorrecciÃ³n Integral de Botones de Filtro en MÃ©tricas: Cero Desbordamiento, Contraste Absoluto y DistribuciÃ³n Espaciosa
- [x] **DistribuciÃ³n Espaciosa en Dos Filas Independientes ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - Reorganizada la barra de control en 2 filas limpias y holgadas: Fila 1 (`MÃ©trica: Dual, Solo Me Gusta, Solo Vistas`) y Fila 2 (`Mostrar: Todas, Tienda, Admin`).
  - Eliminado el apiÃ±amiento y el desbordamiento horizontal (`salido de la web`): los botones cuentan con envoltura responsiva (`flex-wrap`) y espacio generoso sin cortes en ninguna resoluciÃ³n ni con sidebar desplegado.
- [x] **Contraste y Legibilidad Blindada en Botones Activos e Inactivos ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - Botones activos protegidos con fondo pÃºrpura sÃ³lido (`#581C87`) y texto blanco puro con sombra (`#FFFFFF`), o rosa intenso (`#BE185D`) para `Solo Me Gusta`.
  - Botones inactivos convertidos en tarjetas pÃ­ldora con fondo blanco nÃ­tido (`#FFFFFF`), texto oscuro de alto contraste (`#1E293B`) y sutil borde delimitador, eliminando el fondo transparente descolorido.
- [x] **UnificaciÃ³n de Etiquetas y Limpieza Visual en "Â¿QuÃ© Secciones Gustaron MÃ¡s?" ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - Simplificados los tÃ­tulos a `ðŸ›ï¸ Tienda` y `ðŸ›¡ï¸ Admin` para erradicar sobrecargas de texto y garantizar simetrÃ­a estÃ©tica idÃ©ntica al diseÃ±o de referencia.

### VersiÃ³n 4.0.0 - Sistema de RedirecciÃ³n y VerificaciÃ³n de Pagos SINPE MÃ³vil Banco BCR & DivisiÃ³n de Ingresos en Caja
- [x] **Motor de ExtracciÃ³n y ValidaciÃ³n SINPE MÃ³vil BCR ([`bcrSinpeParser.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/bcrSinpeParser.ts)):**
  - DetecciÃ³n de remitente oficial `mensajero@bancobcr.com` y asunto `"SINPE MÃ“VIL: NotificaciÃ³n de transacciÃ³n realizada"`.
  - ExtracciÃ³n y normalizaciÃ³n de: NÃºmero de Referencia (estrictamente Ãºnico), TelÃ©fono de origen, Nombre del cliente, Entidad bancaria origen, Monto (â‚¡), Motivo y Fecha/Hora.
  - Bloqueo estricto anti-duplicados: ninguna transacciÃ³n puede registrarse dos veces con la misma referencia bancaria.
- [x] **VinculaciÃ³n de Correo y RedirecciÃ³n ([`SinpeBcrVerificationModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SinpeBcrVerificationModal.tsx)):**
  - Formulario de vinculaciÃ³n para que el administrador configure su correo de recepciÃ³n de notificaciones BCR.
  - Endpoints de procesamiento en nube: `/api/sinpe-webhook` y persistencia en Cloudflare D1 en `/api/sinpe-transactions`.
  - Herramienta visual de extracciÃ³n y pegado rÃ¡pido con carga de ejemplos demostrativos (Tienda y Talleres).
- [x] **Aumento AutomÃ¡tico de Caja & DivisiÃ³n Contable ([`CashRegisterReports.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/CashRegisterReports.tsx), [`DailyClosingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/DailyClosingModal.tsx)):**
  - Cada transacciÃ³n SINPE verificada incrementa automÃ¡ticamente el saldo en caja.
  - DivisiÃ³n contable en tiempo real: ðŸ›ï¸ Ventas Tienda & CatÃ¡logo vs ðŸŽ¨ Talleres Creativos, tanto en pantalla como en el Acta de Cierre Diario oficial.
  - Tabla en vivo de comprobantes SINPE BCR verificados con estado y NÂ° de referencia.
- [x] **AuditorÃ­a DinÃ¡mica de Talleres Pagados ([`WorkshopEnrollmentsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/WorkshopEnrollmentsSection.tsx)):**
  - Incorporado botÃ³n destacado "ðŸ“Š Talleres Pagados & Confirmados" con selector dinÃ¡mico por curso.
  - PresentaciÃ³n del estado exacto solicitado: *"Del taller de X cupos se han vendido Y y ya estÃ¡n confirmados (Z disponibles)"*.
  - Desglose de ingresos acreditados en caja por taller e integraciÃ³n de alumnos confirmados vÃ­a SINPE BCR.

### VersiÃ³n 3.9.5 - OptimizaciÃ³n Integral de Rendimiento: CachÃ© Inmutable Edge, Carga AsÃ­ncrona de Fuentes y AceleraciÃ³n GrÃ¡fica (0ms)
- [x] **CachÃ© Inmutable en Cloudflare Pages ([`public/_headers`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/_headers)):**
  - Creada polÃ­tica de cabeceras HTTP de alto rendimiento: assets con hash inmutable (`max-age=31536000`), recursos multimedia cacheados por 30 dÃ­as con revalidaciÃ³n en segundo plano (`stale-while-revalidate`), y APIs dinÃ¡micas en vivo (`no-cache`).
  - Las visitas recurrentes ahora cargan de inmediato desde la memoria cachÃ© del navegador en menos de 50ms.
- [x] **Carga de TipografÃ­as sin Bloqueo de Renderizado ([`index.html`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/index.html)):**
  - Implementada pre-conexiÃ³n DNS y carga asÃ­ncrona de Google Fonts (`preload` + `media="print" onload="this.media='all'"`), eliminando los 2-3 segundos de pantalla bloqueada que ocurrÃ­an esperando las fuentes.
- [x] **AceleraciÃ³n GrÃ¡fica y ErradicaciÃ³n de Filtros CPU-Intensivos ([`BackgroundDecor.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/BackgroundDecor.tsx)):**
  - Removido el filtro SVG `feTurbulence` a pantalla completa que saturaba la GPU y CPU del dispositivo en cada scroll, logrando 60 FPS estables y renderizado ultrarrÃ¡pido.
- [x] **Carga Diferida y DecodificaciÃ³n AsÃ­ncrona de ImÃ¡genes ([`HomePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HomePage.tsx), [`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx)):**
  - Incorporado `loading="lazy"` y `decoding="async"` en todas las tarjetas de productos y talleres para priorizar el contenido visible y acelerar el inicio de la navegaciÃ³n.

### VersiÃ³n 3.9.4 - ErradicaciÃ³n de Errores de Carga de MÃ³dulos (Vite Preload), Carga Inmediata de AdministraciÃ³n y OptimizaciÃ³n de Rendimiento Edge
- [x] **EliminaciÃ³n Total de Pantallas de Inconveniente por MÃ³dulos ([`main.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/main.tsx), [`ErrorBoundary.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/ErrorBoundary.tsx)):**
  - Implementado interceptor de `vite:preloadError` y auto-recuperaciÃ³n transparente en `ErrorBoundary`: cuando se publica una versiÃ³n nueva y el navegador del usuario tiene en memoria hashes anteriores, la aplicaciÃ³n recarga de manera instantÃ¡nea y silenciosa sin mostrar carteles de error.
- [x] **Carga Inmediata (0ms) de PestaÃ±as del Panel de AdministraciÃ³n ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Eliminado el code-splitting fragmentado de los mÃ³dulos principales del administrador (`OrdersQueue`, `QuickBillingSection`, `InventoryTable`, `CashRegisterReports`, etc.), incluyÃ©ndolos en el paquete base para que la navegaciÃ³n entre secciones sea 100% instantÃ¡nea sin peticiones de red ni pausas de carga.
- [x] **AceleraciÃ³n de Respuestas de API y DescongestiÃ³n de Red ([`products.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/products.ts), [`orders.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/orders.ts), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Eliminadas las instrucciones redundantes de `ALTER TABLE` y verificaciÃ³n de Ã³rdenes en cada peticiÃ³n GET a Cloudflare D1, reduciendo los tiempos de respuesta de base de datos a 5-10ms.
  - Intervalo de polling en foco ajustado a 8 segundos para evitar saturaciÃ³n del canal HTTP del navegador.

### VersiÃ³n 3.9.3 - DesapariciÃ³n AutomÃ¡tica de Productos con Stock en Cero de Tienda/CatÃ¡logo y Marcado Rojo de Alerta en Inventario
- [x] **DesapariciÃ³n AutomÃ¡tica en Cero en Tienda, CatÃ¡logo y Home ([`StorePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/StorePage.tsx), [`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx), [`ProductsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/ProductsSection.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Aplicada la regla estricta: `if (p.stock <= 0 || p.isAvailable === false || p.showInStore === false) return false` en Tienda y Portada; y `showInCatalog === false` en CatÃ¡logo.
  - Apenas un producto llega a 0 existencias (por compra de cliente, venta manual o ajuste del administrador), desaparece automÃ¡ticamente de la vista pÃºblica sin requerir recargar la pÃ¡gina.
  - `addToCart` bloquea cualquier adiciÃ³n de productos con existencias en cero, y `updateProductStock` retira inmediatamente del carrito activo cualquier producto que llegue a 0.
- [x] **Marcado de Fila en Rojo y Alerta de ReposiciÃ³n en Inventario ([`InventoryTable.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx)):**
  - Toda fila con `stock <= 0` se resalta visualmente en rojo intenso (`bg-red-50/90`, borde izquierdo rojo `border-l-4 border-l-red-600` y borde inferior `border-red-300`).
  - Distintivo visual claro: `EN CERO â€¢ HACER PEDIDO` bajo el nombre del producto, pastilla roja de stock `0`, etiqueta `Â¡EN CERO! Pedir Urgente` y cantidad a reponer en botÃ³n rojo destacado.
  - BotÃ³n de acceso directo *"Pedir"* en las acciones de la fila para abrir la orden de compra a proveedor al instante.

### VersiÃ³n 3.9.2 - Blindaje Definitivo de Persistencia de Pedidos, Secuencia Ãšnica Anti-ColisiÃ³n y RestauraciÃ³n HistÃ³rica
- [x] **ErradicaciÃ³n Total de Sobrescritura de Pedidos ([`functions/api/orders.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/orders.ts), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Identificada y resuelta la causa raÃ­z: los nÃºmeros de pedido se calculaban errÃ³neamente con `1000 + orders.length + 1`, lo que provocaba que al llegar a 5 o 6 pedidos se repitiera el mismo `#FIO-1006` / `#FIO-1007` y SQLite (`INSERT OR REPLACE`) eliminara silenciosamente el pedido anterior por la restricciÃ³n `UNIQUE(order_number)`.
  - Reemplazado `INSERT OR REPLACE` por `INSERT INTO ... ON CONFLICT(id) DO UPDATE SET ...` en Cloudflare D1, garantizando que NUNCA se borre un pedido existente de otro ID.
  - Implementado generador estricto `getNextOrderNumber()` que analiza el nÃºmero numÃ©rico mÃ¡ximo real (`Math.max(1000, ...dbNumbers)`) tanto en el cliente como en el backend, asignando siempre nÃºmeros crecientes estrictamente libres de colisiones (`#FIO-1008`, `#FIO-1009`, etc.).
- [x] **FusiÃ³n Aditiva Segura en SincronizaciÃ³n y Polling ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - La sincronizaciÃ³n en tiempo real y el polling continuo ahora realizan una uniÃ³n aditiva de pedidos por `id` (`Map<string, Order>`), preservando todos los pedidos locales y los recibidos de la nube sin sobrescrituras destructivas.
- [x] **RestauraciÃ³n del Pedido HistÃ³rico Inicial #FIO-1001 ([`functions/api/orders.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/orders.ts)):**
  - Autosembrada la orden fundacional `#FIO-1001` (SofÃ­a Solano Brenes) en Cloudflare D1 en caso de no encontrarse en la base de datos, garantizando la integridad de todo el historial.

### VersiÃ³n 3.9.1 - Formato de Documento Formal para RequisiciÃ³n y Lista de Pedidos a Proveedor
- [x] **GeneraciÃ³n de Formato Documento Oficial de RequisiciÃ³n ([`SupplierOrderModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierOrderModal.tsx)):**
  - Transformada la salida impresa de una captura de pantalla del modal web a un documento formal y elegante de RequisiciÃ³n y Orden de ReposiciÃ³n (`ORDEN DE COMPRA & REPOSICIÃ“N DE INVENTARIO`) optimizado para papel Carta/A4 y exportaciÃ³n a PDF.
  - Encabezado corporativo institucional by.fio con gradiente pÃºrpura oficial, datos de contacto (TibÃ¡s, San JosÃ©, WhatsApp +506 6400-4640), nÃºmero de requisiciÃ³n consecutivo oficial (`OC-AAAAMMDD-N`) y fecha de emisiÃ³n.
  - Tabla nÃ­tida de alta definiciÃ³n (`.print-table`) con bordes y lÃ­neas sÃ³lidas visibles (`border-slate-400`), desglosando exactamente las cantidades personalizadas digitadas por el usuario en la web (`orderQty`), cÃ³digo SKU, descripciÃ³n del artÃ­culo, stock actual, costo unitario y subtotales calculados.
  - SecciÃ³n de resumen financiero de inversiÃ³n estimada, tÃ©rminos oficiales de entrega y recuadros de firma autorizada (DirecciÃ³n by.fio y Conformidad de recepciÃ³n del proveedor).
- [x] **Selector Dual de Modo en Pantalla (Editor vs Vista Previa de Documento) ([`SupplierOrderModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierOrderModal.tsx)):**
  - Implementado conmutador de pestaÃ±as segmentado: `âœï¸ Modificar Cantidades` para interactuar con botones de incremento/decremento e inputs, y `ðŸ“„ Vista Documento Formal` para previsualizar el documento idÃ©ntico a cÃ³mo se imprimirÃ¡.
  - Enlace dinÃ¡mico con `@media print`: al imprimir o guardar en PDF, se ocultan automÃ¡ticamente todos los controles web y se renderiza exclusivamente el documento formal limpio.

### VersiÃ³n 3.9.0 - ClarificaciÃ³n y SincronizaciÃ³n de Contadores de Pedidos (Pendientes vs Totales)
- [x] **DistinciÃ³n Clara de MÃ©tricas en Cola de Pedidos ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx)):**
  - Unificados los indicadores visuales: el encabezado ahora muestra tanto el badge destacado en rosa de pedidos pendientes de alisto (`{pendingOrders.length} pendientes`) como el badge neutro de pedidos histÃ³ricos (`{orders.length} totales`).
  - AÃ±adido selector de filtros rÃ¡pidos segmentados: `Todos ({orders.length})`, `Pendientes de Alisto ({pendingOrders.length})` y `Empacados / Listos ({completedOrders.length})` con contador dinÃ¡mico y estado vacÃ­o amigable.
- [x] **Claridad en PestaÃ±a Superior de AdministraciÃ³n ([`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx)):**
  - AÃ±adido tooltip explÃ­cito en el badge rosa de la pestaÃ±a *Pedidos & Alisto*: `${pendingCount} pedidos pendientes de alisto (${orders.length} totales)`, eliminando la discrepancia cognitiva entre el badge de tareas pendientes y la lista completa.

### VersiÃ³n 3.8.2 - RediseÃ±o ArmÃ³nico, Espacioso y Segmentado de Filtros de MÃ©tricas
- [x] **Arquitectura Espaciosa y SeparaciÃ³n Funcional ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - Erradicado el amontonamiento de botones en el encabezado de la GrÃ¡fica del Ecosistema. Se estructurÃ³ una barra de control dedicada de ancho completo (`p-3 rounded-2xl bg-slate-50 border border-slate-200/80`) que distribuye holgadamente los controles con `justify-between`.
  - Grupo "Mostrar Secciones:" alineado a la izquierda y grupo "Ver MÃ©trica:" a la derecha con iconos y etiquetas explicativas.
- [x] **Control Segmentado Moderno (Cero Recargamiento Visual) ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - Eliminados los bordes toscos individuales en botones inactivos; ahora presentan un acabado suave y minimalista con padding generoso (`px-3.5 py-1.5`).
  - BotÃ³n activo destacado con pÃºrpura corporativo (`#6B21A8`), sombra sutil y texto blanco nÃ­tido para un contraste y armonÃ­a visual impecables.

### VersiÃ³n 3.8.0 - CorrecciÃ³n de Desbordamiento Horizontal de Botones y Contraste Absoluto en MÃ©tricas
- [x] **SoluciÃ³n a Desbordamiento de Botones en GrÃ¡fica del Ecosistema ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - Corregido el problema donde el botÃ³n `ðŸ›ï¸ Tienda` se salÃ­a de la pantalla en pantallas medianas y de laptop; ahora los contenedores de filtros cuentan con `flex-wrap`, breakpoint `xl:flex-row`, y las tarjetas integran `overflow-hidden`.
  - El contenedor principal de la pÃ¡gina de analÃ­tica ahora cuenta con `max-w-full overflow-x-hidden` para blindar la pantalla contra desbordamientos horizontales.
- [x] **Legibilidad y Contraste Absoluto en Botones Activos ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - Aplicados estilos inline garantizados (`backgroundColor: '#581c87'`, `color: '#ffffff'`) y clases Tailwind de alto contraste (`bg-purple-900 text-white font-black drop-shadow-sm`) en los botones de filtro de secciones (`ðŸŒ Todas`, `ðŸ›ï¸ Tienda & Clientes`, `ðŸ›¡ï¸ Panel Admin`), selectores de vista (`Dual`, `Likes`, `Vistas`), destinos de enlaces y selector global.
  - Blindada la visualizaciÃ³n contra purgas de CSS o retrasos de cachÃ©, asegurando que las letras blancas sobre fondo pÃºrpura profundo sean 100% nÃ­tidas y legibles en cualquier navegador y modo (claro/oscuro).

### VersiÃ³n 3.7.0 - Sonido de NotificaciÃ³n de Nuevos Pedidos y Conmutador de Control para Administrador
- [x] **Alerta Sonora Agradable y Melodiosa de Nuevos Pedidos ([`soundEffects.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/soundEffects.ts)):**
  - Creada la funciÃ³n `playNewOrderChimeSound()` mediante Web Audio API con cero dependencias externas ni archivos de audio pesados.
  - Genera una secuencia armÃ³nica ascendente cristalina tipo celesta/marimba en Mi Mayor (E5, G#5, B5, E6) con ataque suave de 12ms y decaimiento exponencial cÃ¡lido.
- [x] **DetecciÃ³n AutomÃ¡tica de Pedidos Entrantes y Estado Persistente ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Implementado estado `soundNewOrderEnabled` persistido en `localStorage` bajo la clave `byfio_sound_new_order_v1` (activo por defecto).
  - DetecciÃ³n precisa de nuevos pedidos reales mediante `knownOrderIdsRef` tanto en sincronizaciÃ³n instantÃ¡nea vÃ­a `BroadcastChannel` (0ms), como en la sincronizaciÃ³n continua inteligente de Cloudflare D1 y al crearse pedidos locales/facturas.
- [x] **Conmutadores de ActivaciÃ³n/DesactivaciÃ³n para el Administrador ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx), [`AdminDesignSettingsModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminDesignSettingsModal.tsx)):**
  - BotÃ³n de alternancia rÃ¡pida colocado en el encabezado de la Cola de Pedidos (FIFO) con icono `Bell`/`BellOff` e indicador de estado `Sonido: Activado` / `Sonido: Silenciado`.
  - Interruptor tipo iOS con animaciÃ³n y previsualizaciÃ³n acÃºstica en el modal de *PersonalizaciÃ³n Visual y Sonido* accesible desde el botÃ³n "DiseÃ±o & Letra".

### VersiÃ³n 3.6.0 - Alto Contraste en Filtros/Destinos de MÃ©tricas y Limpieza Visual
- [x] **Contraste y Legibilidad en Botones Activos ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx), [`tailwind.config.js`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/tailwind.config.js)):**
  - Solucionado el problema de contraste en los 7 botones de destino ("SecciÃ³n a Abrir con este Enlace") al aplicar gradiente pÃºrpura intenso (`from-purple-700 via-purple-800 to-indigo-900`), texto blanco en negrita (`drop-shadow-xs`), borde luminoso y anillo exterior (`ring-2 ring-purple-400/50`).
  - Corregida la visibilidad de los botones de filtro de categorÃ­as (`ðŸŒ Todas`, `ðŸ›ï¸ Tienda & Clientes`, `ðŸ›¡ï¸ Panel Admin`) en *"Â¿QuÃ© Secciones Gustaron MÃ¡s?"* y en la GrÃ¡fica del Ecosistema, garantizando que el texto activo sea 100% legible tanto en modo claro como oscuro.
  - Registrado el token de color `fio.purple` y `fio-purple` en `tailwind.config.js` para blindar la coherencia de estilos.
- [x] **Limpieza de Etiquetas en GrÃ¡ficas de MÃ©tricas ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - Removida la leyenda "(Sin AdministraciÃ³n)" en el tÃ­tulo y subtÃ­tulo de la secciÃ³n de trÃ¡fico de clientes ("NavegaciÃ³n de Clientes en la Web").

### VersiÃ³n 3.5.0 - EdiciÃ³n Manual de Cantidades en Pedido a Proveedor y Ajuste Personalizado
- [x] **Cantidades Modificables por Ãtem ([`SupplierOrderModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierOrderModal.tsx)):**
  - Implementado control numÃ©rico interactivo por producto en la columna *"Cantidad a Pedir"*: permite escribir el nÃºmero exacto deseado mediante input manual o ajustarlo con botones de incremento/decremento `[-]` y `[+]`.
  - RecÃ¡lculo dinÃ¡mico en tiempo real de costos estimados por fila, unidades totales a solicitar e inversiÃ³n estimada.
- [x] **GestiÃ³n Flexible de Orden y MensajerÃ­a DinÃ¡mica ([`SupplierOrderModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierOrderModal.tsx)):**
  - BotÃ³n para remover artÃ­culos particulares de la orden actual (`Trash2`) y selector desplegable para aÃ±adir cualquier otro producto del inventario general aunque no estÃ© en stock crÃ­tico.
  - BotÃ³n de restauraciÃ³n de sugerencias automÃ¡ticas basadas en la fÃ³rmula `Meta MÃ¡x - Stock Actual`.
  - El mensaje generado para WhatsApp y el documento de impresiÃ³n ahora reflejan con total fidelidad las cantidades personalizadas que digitÃ³ el usuario.

### VersiÃ³n 3.4.0 - EliminaciÃ³n y ActualizaciÃ³n en Vivo de Productos para Usuarios Activos (0ms / Tiempo Real Sin Refrescar)
- [x] **EliminaciÃ³n y DesapariciÃ³n en Vivo en Pantalla del Cliente ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`products.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/products.ts)):**
  - Implementado endpoint `onRequestDelete` en `functions/api/products.ts` para ejecutar `DELETE FROM products WHERE id = ?` en Cloudflare D1.
  - Al eliminar un producto desde el inventario del administrador, se elimina del estado local, se persiste en Cloudflare D1 y se transmite de inmediato vÃ­a `BroadcastChannel('byfio_realtime_sync')`.
  - El producto desaparece al instante de la pantalla de cualquier cliente que estÃ© navegando en ese momento en la tienda, catÃ¡logo o portada sin necesidad de refrescar la pÃ¡gina.
- [x] **Limpieza AutomÃ¡tica de Carritos y Modales Abiertos ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx)):**
  - Si un usuario tiene en su carrito un producto que el administrador elimina o desactiva en ese momento, el producto se extrae de su carrito automÃ¡ticamente para evitar errores de compra.
  - Si el usuario tenÃ­a abierto el modal de detalles del producto en el catÃ¡logo, se cierra de inmediato en vivo.
- [x] **SincronizaciÃ³n RÃ¡pida Multidispositivo Anti-Drain (4s en foco) ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - SincronizaciÃ³n continua de 4 segundos mientras la pestaÃ±a estÃ© activa y en pantalla, pausÃ¡ndose a 0 peticiones cuando el usuario minimiza o cambia de pestaÃ±a (`document.hidden`).
  - DetecciÃ³n precisa de altas, bajas y modificaciones comparando IDs entre cliente y base de datos D1 en la nube.

### VersiÃ³n 3.3.0 - Rebaja AutomÃ¡tica de Inventario al Confirmar Pedidos y SincronizaciÃ³n en Tiempo Real Sin Refrescar
- [x] **DeducciÃ³n AutomÃ¡tica de Stock al Generar y Confirmar Pedidos ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx), [`QuickBillingSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/QuickBillingSection.tsx)):**
  - En [`createOrder`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx) y [`createDirectInvoiceOrder`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), apenas el cliente o el personal confirma el pedido, se calculan las cantidades vendidas por SKU y por ID de producto, descontÃ¡ndolas de inmediato del inventario local (`Math.max(0, prod.stock - qty)`).
  - Si el pedido contiene talleres, se descuentan automÃ¡ticamente los cupos disponibles (`spotsAvailable`).
- [x] **SincronizaciÃ³n en Lote (Batch) en Base de Datos Cloudflare D1 ([`products.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/products.ts)):**
  - Implementado soporte en `PUT /api/products` para recibir arreglos en lote (`[{ id, stock }]`) de todos los productos del pedido en una Ãºnica peticiÃ³n atÃ³mica y veloz.
- [x] **Canal de DifusiÃ³n en Tiempo Real (0ms) entre PestaÃ±as ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Integrado canal de difusiÃ³n `BroadcastChannel('byfio_realtime_sync')` que transmite al instante el pedido generado y los stocks rebajados a todas las pestaÃ±as abiertas del navegador (cliente y administraciÃ³n).
- [x] **Polling Inteligente Edge Anti-Drain ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Aplicado el estÃ¡ndar de la regla `polling-inteligente`: sondeo periÃ³dico cada 10 segundos Ãºnicamente mientras la pestaÃ±a estÃ¡ visible (`!document.hidden`).
  - Pausa instantÃ¡nea a **0 peticiones** cuando la pestaÃ±a se minimiza o pasa a segundo plano.
  - Refresco inmediato automÃ¡tico al reenfocar la ventana (`focus` y `visibilitychange`), garantizando que el administrador vea el inventario rebajado y los pedidos nuevos sin tener que pulsar F5 o recargar la pÃ¡gina.

### VersiÃ³n 3.2.0 - Filtros RÃ¡pidos de Inventario (Existencias en Cero, No Disponibles y Combinado) y Enlace Directo a Pedidos
- [x] **Filtros RÃ¡pidos en MÃ³dulo de Inventario ([`InventoryTable.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx)):**
  - Incorporados 4 botones de filtrado instantÃ¡neo con contadores dinÃ¡micos en tiempo real:
    - *Todos*: Muestra la totalidad de los artÃ­culos inventariados.
    - *Existencias en Cero*: Filtra inmediatamente todos los artÃ­culos con `stock <= 0`.
    - *No Disponibles*: Filtra los artÃ­culos desactivados (`isAvailable === false` o desmarcados de tienda/catÃ¡logo).
    - *En Cero o No Disponibles*: Filtro combinado para visualizar en una sola vista todo lo que requiere reposiciÃ³n o activaciÃ³n.
- [x] **IntegraciÃ³n con Pedidos a Proveedor ([`InventoryTable.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx), [`SupplierOrderModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierOrderModal.tsx)):**
  - AÃ±adido botÃ³n de acceso directo *"Realizar Pedido a Proveedor"* en la barra de filtros del inventario.
  - Actualizado [`SupplierOrderModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierOrderModal.tsx) para incluir automÃ¡ticamente tanto los productos con stock en cero como los desactivados por falta de existencias.

### VersiÃ³n 3.1.0 - CoordinaciÃ³n Estricta de Disponibilidad y DesapariciÃ³n Inmediata de Productos en Tienda, CatÃ¡logo y Carrito
- [x] **CoordinaciÃ³n Inmediata de DesactivaciÃ³n ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`products.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/products.ts)):**
  - Al marcar un producto como *"No disponible"* en el mÃ³dulo de inventario, se sincronizan atÃ³micamente `isAvailable: false`, `showInStore: false` y `showInCatalog: false`.
  - Se persiste de inmediato en la base de datos Cloudflare D1 mediante `PUT /api/products` con columna `is_available` aÃ±adida dinÃ¡micamente.
- [x] **DesapariciÃ³n AutomÃ¡tica en Tienda, CatÃ¡logo y Home ([`StorePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/StorePage.tsx), [`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx), [`HomePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HomePage.tsx), [`ProductsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/ProductsSection.tsx)):**
  - Ajustados todos los filtros de visualizaciÃ³n pÃºblica con la regla estricta: `if (p.isAvailable === false || p.showInStore === false) return false` (y `showInCatalog === false` para el catÃ¡logo).
  - Apenas el administrador desactiva el producto, desaparece al instante de la vista del cliente sin requerir recargar la pÃ¡gina.
- [x] **ProtecciÃ³n contra Compras por Error en Carrito ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Al desactivar un producto, se remueve automÃ¡ticamente de cualquier carrito activo (`cart.filter`).
  - El mÃ©todo `addToCart` bloquea cualquier intento de aÃ±adir artÃ­culos con `isAvailable === false`.

### VersiÃ³n 3.0.0 - OptimizaciÃ³n CrÃ­tica de Velocidad de Carga, ErradicaciÃ³n de Pantallas en Blanco y Acceso Inmediato (0ms) a AdministraciÃ³n
- [x] **ErradicaciÃ³n de Pantallas en Blanco al Iniciar SesiÃ³n en Administrador ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS%20/BYFIO/src/context/AppContext.tsx), [`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx), [`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Eliminada la cascada artificial de temporizadores de 6 segundos (`triggerLoginCinematic` y `loginIntroStage`) que ocultaba toda la interfaz (`opacity-0`, `pointer-events-none`) y dejaba la pantalla totalmente en blanco.
  - Corregido el bug donde `onClose` invocaba `navigate('home')` tras 2 segundos de haber iniciado sesiÃ³n con Ã©xito, devolviendo al usuario a la portada.
  - El acceso a administraciÃ³n tras ingresar las credenciales o el PIN de 4 dÃ­gitos ahora es 100% instantÃ¡neo (0 milisegundos).
- [x] **Carga Inmediata del Panel de Control ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx), [`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx)):**
  - ImportaciÃ³n directa de la cabecera, pestaÃ±as y menÃº del panel administrativo (`AdminHeader`, `AdminTabs`, `AdminHubMenu`) eliminando saltos de Suspense y demoras de red.
  - Enrutamiento SPA directo en enlaces internos (`/propuesta`, `/metricas`) sin recargas completas de navegador ni descargas redundantes de HTML.
- [x] **Aislamiento Estricto Bajo Demanda de Modales Administrativos ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Condicionados los 9 modales administrativos diferidos (`GuidedPickingModal`, `SupplierOrderModal`, `QrLabelModal`, `InvoiceModal`, `NewProductModal`, `NewWorkshopModal`, etc.) a sus banderas de activaciÃ³n correspondientes.
  - Esto erradica la descarga simultÃ¡nea de 9 mÃ³dulos JavaScript pesados en cada carga en frÃ­o de la pÃ¡gina web, acelerando drÃ¡sticamente el inicio en mÃ³viles y conexiones lentas.
- [x] **Blindaje AnticaÃ­das con ErrorBoundary ([`ErrorBoundary.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/ErrorBoundary.tsx)):**
  - Implementado componente `ErrorBoundary` global que intercepta cualquier excepciÃ³n de red o carga dinÃ¡mica, ofreciendo opciones automÃ¡ticas de recarga y navegaciÃ³n sin permitir pantallas blancas.

### VersiÃ³n 2.9.0 - Suite Integral de GrÃ¡ficas AnalÃ­ticas (Ecosistema Total, Web PÃºblica de Clientes y DistribuciÃ³n por Uso) en /metricas
- [x] **GrÃ¡fica 1: Ecosistema Completo de Todas las Secciones ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - Implementada grÃ¡fica comparativa integral con selector interactivo de tres vistas: `[ ðŸŒ Todas ]`, `[ ðŸ›ï¸ Tienda & Clientes ]` y `[ ðŸ›¡ï¸ Panel Admin ]`.
  - Monitorea las 17 secciones de la web reflejando vistas, me gusta (â¤ï¸), clics directos a cursos (`workshop-detail`), agregados al carrito y alumnos suscritos/inscritos a los talleres (`totalWorkshopSubscribers` extraÃ­do de cupos ocupados).
- [x] **GrÃ¡fica 2: TrÃ¡fico Exclusivo de la Web PÃºblica de Clientes ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - GrÃ¡fica dedicada exclusivamente a la experiencia de compra y navegaciÃ³n de los usuarios sin la parte administrativa.
  - Compara la navegaciÃ³n entre Portada (`home`), Tienda Online (`store`), CatÃ¡logo (`catalogo`), Cursos (`workshops`), Clics a cursos (`workshop-detail`), Precios (`precios`) y Login (`login`), indicando visitas exactas y porcentaje del trÃ¡fico pÃºblico total.
- [x] **Suite de GrÃ¡ficas Circulares SVG ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - **GrÃ¡fica Circular 1 (DistribuciÃ³n por Uso de la Web):** Dona SVG interactiva que representa la cuota porcentual exacta de usuarios en cada secciÃ³n de la pÃ¡gina web con visor central dinÃ¡mico al pasar el cursor.
  - **GrÃ¡fica Circular 2 (Dispositivos & Canales):** Dona SVG interactiva con alternador entre Celulares vs Computadoras (PC) y Canales de Enlaces rastreados.

### VersiÃ³n 2.8.0 - Modo Dual de Inventario (Stock Real vs Disponibilidad RÃ¡pida) y Zona Horaria Local en Pedidos
- [x] **Selector de Modo en MÃ³dulo de Inventario ([`InventoryTable.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx)):**
  - Incorporados dos botones de acciÃ³n directa: *"Desactivar stock de inventario"* y *"Activar disponibilidad de producto"*, permitiendo alternar al instante entre **Modo Stock NumÃ©rico Real** y **Modo Disponibilidad RÃ¡pida**.
  - Al activar el modo disponibilidad, la columna de *Stock* (junto con alertas y reposiciÃ³n) se oculta automÃ¡ticamente y es sustituida por la columna interactiva **Disponibilidad**.
- [x] **Control de Disponibilidad y SincronizaciÃ³n en Tiempo Real ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`StorePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/StorePage.tsx), [`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx), [`ProductsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/ProductsSection.tsx)):**
  - Cada fila cuenta con un botÃ³n switch tÃ¡ctil para alternar entre *"Disponible"* y *"No disponible"*.
  - Si un producto se marca como *"Disponible"*, aparece automÃ¡ticamente activo en la Tienda Online, en el CatÃ¡logo y listo para ser aÃ±adido al Carrito.
  - Si se marca como *"No disponible"*, se oculta por completo de la Tienda y del CatÃ¡logo, impidiendo compras involuntarias.
- [x] **Persistencia de Fecha de CreaciÃ³n del Usuario ([`orders.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/orders.ts)):**
  - AÃ±adida la columna `created_at` en la sentencia `INSERT OR REPLACE INTO orders` para guardar fielmente la marca de tiempo enviada por el navegador del cliente en lugar de delegar en el `datetime('now')` de SQLite.
- [x] **NormalizaciÃ³n de Marcas de Tiempo UTC en Servidor y Frontend ([`orders.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/orders.ts), [`formatters.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/formatters.ts)):**
  - Creada funciÃ³n `normalizeIsoDate` que detecta cadenas de SQLite en formato `"YYYY-MM-DD HH:MM:SS"` y les anexa `'Z'` para que el navegador interprete correctamente el huso UTC y lo traduzca a la hora real del usuario.
  - Actualizado [`formatShortDate`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/formatters.ts#L9) con normalizaciÃ³n y formato `hour12: true`, corrigiendo la visualizaciÃ³n de pedidos de 03:29 PM a 09:29 AM (hora de Costa Rica).


### VersiÃ³n 2.7.0 - IncorporaciÃ³n de GrÃ¡ficas AnalÃ­ticas (Comparativa de Barras y Circular de DistribuciÃ³n) en /metricas
- [x] **GrÃ¡fica Comparativa de Barras Interactiva ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - Incorporado histograma interactivo con selector de dos vistas: *Por Enlaces / CampaÃ±as* (comparando Clics directos, Vistas acumuladas y Agregados al carrito) y *Por Secciones del Sitio* (comparando Vistas de pÃ¡gina e Interacciones / Me Gusta).
  - Escala vertical dinÃ¡mica con tooltips flotantes en hover que detallan las cifras exactas y etiquetas truncadas elegantes.
- [x] **GrÃ¡fica Circular / Dona Proporcional SVG ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - Implementada dona SVG ultra liviana (0 dependencias externas) con selector de dos modos: *Dispositivos* (proporciÃ³n exacta de Celulares vs Computadoras) y *Canales / Enlaces* (cuota porcentual aportada por cada campaÃ±a).
  - Centro dinÃ¡mico interactivo con cÃ¡lculo automÃ¡tico de porcentajes y total de visitas, acompaÃ±ado de leyenda descriptiva con hover bidireccional.

### VersiÃ³n 2.6.0 - RestricciÃ³n Exclusiva del Video Intro a la PÃ¡gina Principal (Home)
- [x] **Carga y Renderizado Exclusivo en Portada ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - El video intro ahora estÃ¡ condicionado estrictamente a `{currentRoute === 'home' && isIntroOpen && <WebIntroOverlay ... />}`.
  - En todas las demÃ¡s pÃ¡ginas (`/tienda`, `/catalogo`, `/talleres`, `/precios`, `/propuesta`, `/metricas`, `/admin`, subrutas de talleres, login) el componente no se monta en el DOM, por lo que el video nunca sale ni se muestra.
- [x] **EliminaciÃ³n del Preload Global de Video ([`index.html`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/index.html)):**
  - Removida la directiva `<link rel="preload" as="video">` del encabezado HTML para impedir que navegadores descarguen el archivo multimedia al acceder directamente a pÃ¡ginas internas o compartidas en redes sociales.
- [x] **DetecciÃ³n QuirÃºrgica de Ruta Inicial y SincronizaciÃ³n ([`routeHelpers.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/routeHelpers.ts), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Implementada funciÃ³n modular `isHomeLocation()` para inicializar `isIntroOpen` en `false` si el usuario ingresa directamente a cualquier URL secundaria.
  - Configurada auto-cancelaciÃ³n de la intro en `navigate()` y en el oyente de navegaciÃ³n del historial (`popstate`).

### VersiÃ³n 2.5.0 - Nuevo Video Intro "INTRO BYFIO WEB (1)", Streaming FastStart y OptimizaciÃ³n Extrema de Velocidad (68% Menor Carga Inicial)
- [x] **ActualizaciÃ³n y OptimizaciÃ³n de Video Intro ([`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - Procesado el video oficial `INTRO BYFIO WEB (1).mp4` con FFmpeg aplicando `-movflags +faststart` para mover los metadatos al inicio del archivo, permitiendo reproducciÃ³n inmediata por streaming sin esperar la descarga completa.
  - CompresiÃ³n de alta fidelidad H.264 CRF 23 que redujo el peso de 2.27 MB a 1.47 MB (35% mÃ¡s liviano) manteniendo resoluciÃ³n nÃ­tida 720p y audio AAC 128 kbps.
  - Desplegado en `public/assets/intro-web-byfio.mp4` y `public/intro-web-byfio.mp4` con URL de versiÃ³n fresca `?v=20261104`.
  - Agregada etiqueta `<link rel="preload" as="video" ...>` en [`index.html`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/index.html) para pre-carga paralela desde el inicio del documento.
- [x] **OptimizaciÃ³n Extrema de Velocidad de la Web (Code-Splitting Modular) ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`vite.config.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/vite.config.ts)):**
  - Dividido el paquete JavaScript monolÃ­tico mediante `React.lazy` y `Suspense`: todos los paneles de administraciÃ³n, modales pesados, escÃ¡neres QR, pÃ¡ginas de mÃ©tricas y propuesta se cargan exclusivamente bajo demanda.
  - Configurados `manualChunks` en Vite para cachear por separado librerÃ­as crÃ­ticas de React, iconos y utilidades.
  - Paquete JavaScript inicial reducido de 741 kB a solo 235 kB (reducciÃ³n del 68%), acelerando drÃ¡sticamente el First Contentful Paint (FCP) y la velocidad en redes mÃ³viles.

### VersiÃ³n 2.4.0 - Persistencia en Nube Cloudflare D1 de Perfiles de Usuario y SincronizaciÃ³n Multi-Dispositivo
- [x] **DiagnÃ³stico de PÃ©rdida de Perfiles Locales:**
  - Identificada la causa por la que desaparecÃ­an perfiles creados: se almacenaban exclusivamente en la memoria local (`localStorage`) del dispositivo del usuario. Al cambiar de dispositivo (celular/PC), entrar en incÃ³gnito o limpiar datos de navegaciÃ³n, el navegador recurrÃ­a a los 2 perfiles predeterminados en cÃ³digo.
- [x] **Endpoint Serverless de Persistencia en la Nube ([`user-profiles.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/user-profiles.ts)):**
  - Creado endpoint `/api/user-profiles` con soporte GET, POST y PUT respaldado en la base de datos distribuida Cloudflare D1.
- [x] **SincronizaciÃ³n Bidireccional en AplicaciÃ³n ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - `syncProfilesToCloud()` sincroniza de inmediato a la nube cualquier creaciÃ³n, ediciÃ³n, borrado o cambio de estado de perfil.
  - Al iniciar en cualquier dispositivo, se descargan los perfiles almacenados en D1 y se combinan con la memoria local para garantizar disponibilidad permanente cross-device.

### VersiÃ³n 2.3.0 - PrevisualizaciÃ³n de Imagen en Enlaces Compartidos (Open Graph / WhatsApp / Redes Sociales)
- [x] **ConfiguraciÃ³n de Open Graph y Twitter Cards ([`index.html`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/index.html)):**
  - Implementadas etiquetas canÃ³nicas `<meta property="og:image">`, `<meta property="og:image:secure_url">`, `<meta property="og:title">`, `<meta property="og:description">` y `<meta name="twitter:image">`.
  - Vinculada la imagen oficial de la web (`https://byfiocr.pages.dev/assets/og-image.jpg`) optimizada a 135 KB (bajo el lÃ­mite estricto de 300 KB de WhatsApp) y con dimensiones 1200x630.
- [x] **IntegraciÃ³n con Web Share API y WhatsApp ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - La funciÃ³n `shareWhatsApp()` ahora aprovecha `navigator.share` en mÃ³viles para generar previsualizaciones ricas nativas con tÃ­tulo, descripciÃ³n y foto de portada al compartir desde el panel de mÃ©tricas.
- [x] **Disponibilidad de Activos EstÃ¡ticos:**
  - Desplegados `public/og-image.jpg` y `public/assets/og-image.jpg` directamente en la CDN global para respuesta inmediata a crawlers de mensajerÃ­a.

### VersiÃ³n 2.2.0 - ErradicaciÃ³n Total de IconografÃ­a Perceptible como IA en Toda la AplicaciÃ³n
- [x] **EliminaciÃ³n QuirÃºrgica de Iconos de IA (`Wand2`, `Sparkles`, `Sparkle`):**
  - Erradicados todos los iconos que evocan herramientas de IA (`Wand2` en generaciÃ³n de SKU y `Sparkles`/`Sparkle` en insignias, badges, modales y cabeceras).
  - Reemplazados por iconos estÃ¡ndar y coherentes con la identidad de marca (`Star`, `Heart`, `Award`, `Hash`, `CheckCircle2`, `Gift`, `Loader2`).
  - Cero referencias a animaciones o identificadores `sparkle` en hojas de estilo (`index.css` migrado a `byfioTwinkleFast`).
  - VerificaciÃ³n estricta: 0 ocurrencias de iconos de IA en todo el directorio `src/`.


### VersiÃ³n 2.1.0 - MÃ©trica de Agregados al Carrito Global y Atribuida por Enlace de CampaÃ±a
- [x] **Rastreo AutomÃ¡tico al Agregar al Carrito ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`metricsTracker.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/services/metricsTracker.ts)):**
  - Cada vez que un usuario aÃ±ade un producto o taller al carrito (`addToCart()`), se dispara `metricsTracker.recordCartAddition()`, contabilizando la cantidad de artÃ­culos y vinculÃ¡ndolo de inmediato al enlace de origen activo (si ingresÃ³ por campaÃ±a `?ref=...`).
- [x] **Persistencia en la Nube y SincronizaciÃ³n Edge ([`metrics.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/metrics.ts)):**
  - Nueva acciÃ³n `record_cart_addition` en el backend serverless para incrementar de forma atÃ³mica `totalCartAdditions` global y `cartAdditions` especÃ­fico bajo el enlace correspondiente en Cloudflare D1.
- [x] **Tarjeta KPI y Reporte en el Panel de MÃ©tricas ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - AÃ±adida tarjeta principal de KPI "Al Carrito" con icono de bolsa de compras, total acumulado y porcentaje de conversiÃ³n sobre aperturas de enlaces.
  - Indicador rÃ¡pido de productos al carrito en el listado de enlaces rastreados (`{link.cartAdditions} carrito`).
  - Reporte copiable de WhatsApp actualizado con la mÃ©trica de agregados al carrito.

### VersiÃ³n 2.0.0 - Persistencia Universal del ParÃ¡metro de CampaÃ±a (?ref=...) y AtribuciÃ³n Multi-SecciÃ³n en MÃ©tricas
- [x] **Persistencia Continua del ParÃ¡metro `?ref=` en Toda la NavegaciÃ³n ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`metricsTracker.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/services/metricsTracker.ts)):**
  - Resuelto el problema donde al hacer clic en cualquier secciÃ³n interna de la web el parÃ¡metro `?ref=` desaparecÃ­a de la URL del navegador.
  - La funciÃ³n `navigate()` ahora incorpora automÃ¡ticamente `appendRefToPath()`, garantizando que la URL mantenga el parÃ¡metro de campaÃ±a activo (ej. `?ref=wa-catalogo`) en todos los cambios de pÃ¡gina y subsecciones sin perderse.
  - SincronizaciÃ³n bidireccional entre la barra de direcciones y `sessionStorage.getItem('byfio_active_campaign_ref')`.
- [x] **AtribuciÃ³n Completa de Secciones y Cargas al Enlace Compartido ([`metricsTracker.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/services/metricsTracker.ts), [`metrics.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/metrics.ts)):**
  - Solucionado el envÃ­o nulo de `slug` al navegar internamente: el tracker ahora envÃ­a continuamente `activeCampaignSlug` a la API en la nube en cada clic y vista de secciÃ³n.
  - DistinciÃ³n inteligente entre `clicks` (apertura inicial de entrada desde redes/WhatsApp con flag `isFreshClick`) y `pageViews` (pÃ¡ginas recorridas acumuladas por el usuario bajo esa misma campaÃ±a).
  - Cada secciÃ³n visitada (CatÃ¡logo, Tienda, Talleres, Precios, etc.) se registra de inmediato bajo `targetLink.sectionsVisited[secKey]`, mostrÃ¡ndose reflejada con exactitud en el panel de `/metricas`.
- [x] **FusiÃ³n Resiliente Anti-RegresiÃ³n en SincronizaciÃ³n Remota:**
  - `fetchRemoteMetrics` ahora fusiona mÃ©tricas locales y remotas utilizando `Math.max` para evitar sobrescrituras accidentales durante rÃ¡fagas de navegaciÃ³n.

### VersiÃ³n 1.99.0 - ApariciÃ³n Suave Inicial del Slogan y CalibraciÃ³n Pausada de Escritura
- [x] **ApariciÃ³n de Primero Suavemente del Slogan ([`HeroAnimatedSlogan.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HeroAnimatedSlogan.tsx)):**
  - La secciÃ³n insignia *"Â¡TransformÃ¡ tu creatividad en tu mejor proyecto!"* ahora aparece **de primero de forma suave** con transiciÃ³n difuminada (`duration-1000 ease-out`) a los 250ms de quitarse la intro.
- [x] **Ritmo de Escritura Calibrado MÃ¡s Lento y Serena:**
  - Ajustada la velocidad de escritura de *"AprendÃ©, creÃ¡ y emprendÃ© con"* a **75ms por letra** (duplicando la pausa entre caracteres), permitiendo una lectura cÃ³moda y un efecto de mÃ¡quina de escribir mucho mÃ¡s elegante.
- [x] **Secuencia Coordinada en el Hero Principal ([`HeroDual.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HeroDual.tsx)):**
  - Consolidado en un Ãºnico flujo: Slogan suave primero â†’ Escritura pausada â†’ 1s despuÃ©s la Estrella â†’ CorazÃ³n â†’ Palabra BYFIO suave en el centro.

### VersiÃ³n 1.98.0 - IncorporaciÃ³n de Beneficios EstratÃ©gicos, Ahorro en WhatsApp y Ecosistema Centralizado en la Propuesta
- [x] **SecciÃ³n de TransformaciÃ³n Operativa & Beneficios Clave ([`PropuestaPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/propuesta/PropuestaPage.tsx)):**
  - **Ahorro Radical de Tiempo en WhatsApp:** EliminaciÃ³n de conversaciones largas de 15 a 20 min por cliente. Proceso 100% automatizado desde la tienda/catÃ¡logo con comprobante SINPE directo al panel de pedidos online.
  - **Beneficios en Orden de Inventario:** Existencias en tiempo real, alertas de reabastecimiento antes del quiebre, cÃ¡lculo de compras para proveedores *(MÃ¡ximo - Actual)* y ubicaciÃ³n QR por estanterÃ­a.
  - **Beneficios en Orden de Pedidos:** Cola cronolÃ³gica FIFO, alisto guiado paso a paso y validaciÃ³n por escÃ¡ner QR para cero errores en paquetes personalizados.
  - **Beneficios de Todo Organizado & Centralizado:** ErradicaciÃ³n de libretas de papel y capturas dispersas. Tienda, WMS, academia de talleres, caja, reportes y mÃ©tricas unificados en una sola pantalla.
- [x] **ActualizaciÃ³n de Resumen Copiable y Lista Final de Nombres:**
  - InclusiÃ³n de los 4 pilares de transformaciÃ³n en el portapapeles y en el inventario terminal de la plataforma.

### VersiÃ³n 1.97.0 - ErradicaciÃ³n Total de Referencias TÃ©cnicas de Infraestructura en la Web y Propuesta
- [x] **EliminaciÃ³n Total de Nombres de Proveedores en UI & Propuesta (`PropuestaPage.tsx`, `DailyClosingModal.tsx`, `health.ts`):**
  - Eliminada de forma absoluta cualquier menciÃ³n visible o textual de marcas de infraestructura ("Cloudflare", "Pages", "D1").
  - Sustituidas en la pÃ¡gina de propuesta, modales de cierre de caja y tarjetas por terminologÃ­a empresarial de alto nivel: *"Infraestructura Cloud Segura"*, *"Base de Datos en la Nube de Alta Disponibilidad"* y *"SincronizaciÃ³n en Tiempo Real"*.
  - Limpieza de comentarios internos en cÃ³digo para mantener privacidad y confidencialidad tÃ©cnica 100%.

### VersiÃ³n 1.96.0 - OptimizaciÃ³n Responsiva Integral del CatÃ¡logo Online para Celulares y Pantallas MÃ³viles
- [x] **DepuraciÃ³n de Banners y Ahorro de Espacio Vertical en MÃ³vil (`CatalogPage.tsx`):**
  - Ocultado el banner estÃ¡tico duplicado en pantallas mÃ³viles (`hidden sm:block`) para que los productos aparezcan de inmediato sin scroll muerto.
  - Hero banner del catÃ¡logo adaptado con paddings responsivos (`p-4 sm:p-8`), tÃ­tulos proporcionales y descripciÃ³n condensada en mÃ³vil.
- [x] **Barra de CategorÃ­as y Filtros Touch-Friendly (`CatalogPage.tsx`):**
  - Eliminado el selector desplegable duplicado; las categorÃ­as ahora se deslizan fluidamente con desplazamiento tÃ¡ctil horizontal y contadores claros.
  - Buscador integrado y botÃ³n de administraciÃ³n con anchos fluidos sin provocar desbordamiento.
- [x] **Tarjetas de Producto de Alto Rendimiento en Celulares (`CatalogPage.tsx`):**
  - TÃ­tulos de producto con soporte para dos lÃ­neas completas (`line-clamp-2`) sin recortes prematuros de nombres largos.
  - Fila inferior de compras reestructurada (`flex-row items-center gap-1.5`) evitando saltos de lÃ­nea antiestÃ©ticos o truncamiento en botones de carrito y WhatsApp.
  - Retirado el badge redundante "Producto Agregado" del encabezado interno, conservando la pastilla limpia sobre la imagen.
- [x] **Barra Flotante de Carrito y Modal de Detalle MÃ³vil (`CatalogPage.tsx`):**
  - Barra inferior flotante convertida a una sola fila delgada (`flex-row items-center justify-between`) que no tapa los productos.
  - Modal ampliado con fotografÃ­a proporcionada (`h-40 sm:h-56`) y Ã¡rea de texto con scroll tÃ¡ctil suave.

### VersiÃ³n 1.95.0 - CoreografÃ­a Secuencial Post-Intro: Escritura de Texto, Estrella, CorazÃ³n y BYFIO Suave en el Centro
- [x] **CoreografÃ­a Post-Intro en Hero Principal (`HeroAnimatedSlogan.tsx` & `HeroDual.tsx`):**
  - **Paso 1 (1 segundo despuÃ©s de quitar la intro):** Se escribe automÃ¡ticamente con efecto mÃ¡quina de escribir letra por letra la frase: *"AprendÃ©, creÃ¡ y emprendÃ© con"*.
  - **Paso 2 (1 segundo despuÃ©s de terminar la escritura):**
    - Aparece la **Estrella Amarilla By.Fio** destellante a la izquierda con animaciÃ³n spring/pop.
    - 400ms despuÃ©s aparece el **CorazÃ³n Celeste** a la derecha con latido suave.
    - 400ms despuÃ©s emerge en el centro con transiciÃ³n suave (`transition-all duration-1000 ease-out`) la palabra **BYFIO** con sus ondas de color interactivas y relieve cerÃ¡mico.
  - SincronizaciÃ³n automÃ¡tica con el estado global `isIntroOpen` del video intro.

### VersiÃ³n 1.94.0 - CorrecciÃ³n Integral de Contraste TipogrÃ¡fico en Filtros de MÃ©tricas y CategorÃ­as de Secciones
- [x] **Visibilidad Total en Selector de Enlaces Rastreables (`MetricsPage.tsx`):**
  - AÃ±adido texto explicativo de alto contraste directamente bajo el tÃ­tulo de filtrado para orientar al administrador en tiempo real.
  - PÃ­ldoras de enlaces no seleccionadas convertidas a tarjetas sÃ³lidas (`bg-white dark:bg-[#252038]`) con borde definido (`border-2 border-slate-300 dark:border-purple-800`) y tipografÃ­a nÃ­tida de mÃ¡xima legibilidad (`text-slate-900 dark:text-white`).
  - Badges numÃ©ricos de cargas y clics con contraste reforzado en modo claro y modo oscuro.
- [x] **Contraste de Alta DefiniciÃ³n en Filtros de CategorÃ­a de Secciones (`MetricsPage.tsx`):**
  - Erradicado el texto lavado `text-slate-600` en los botones deseleccionados `ðŸ›ï¸ Tienda & Clientes` y `ðŸ›¡ï¸ Panel Admin`.
  - Aplicado fondo sÃ³lido con relieve y tipografÃ­a en negrita pura `text-slate-900 dark:text-white` para visualizaciÃ³n nÃ­tida y descanso visual en cualquier monitor y tema.

### VersiÃ³n 1.93.0 - CreaciÃ³n de la PÃ¡gina de Propuesta Integral (/propuesta) & Acceso en Panel Admin
- [x] **PÃ¡gina de Propuesta Integral y Ficha TÃ©cnica Oficial (`/propuesta` & `PropuestaPage.tsx`):**
  - Desarrollo de una vista ejecutiva de alta fidelidad estÃ©tica con hero header, KPIs, filtros interactivos y presentaciÃ³n estructurada en orden riguroso de todos los mÃ³dulos:
    1. **GestiÃ³n de Pedidos y Alisto (LogÃ­stica WMS):** Cola FIFO, Control de Estados, Alisto Guiado Paso a Paso y ValidaciÃ³n por EscÃ¡ner QR.
    2. **Inventario Inteligente y Abastecimiento:** Stock Actual, MÃ­nimos y MÃ¡ximos, Alertas de Reabastecimiento, Cantidad Sugerida y Generador de Etiquetas QR.
    3. **Tienda Online & CatÃ¡logo Digital:** Vitrina Mobile-First para TikTok e Instagram, CategorÃ­as DinÃ¡micas, PersonalizaciÃ³n Interactiva y Checkout RÃ¡pido SINPE 6400-4640.
    4. **Academia y Talleres Creativos:** Cartelera de los 5 Pilares Formativos, Cupos en Tiempo Real, Fichas de Contenido y Registro de Alumnos con Control de Asistencia.
    5. **Caja, FacturaciÃ³n y ReporterÃ­a:** FacturaciÃ³n RÃ¡pida en Mostrador & POS, Cierre Diario de Caja, GrÃ¡ficos Financieros y EnvÃ­o Directo por WhatsApp.
    6. **AdministraciÃ³n, Precios y Usuarios:** Editor de Precios y Listas, Perfiles de Usuarios con PINs de 4 DÃ­gitos y Mascota Interactiva Estrellita Animada.
    7. **AnalÃ­tica & Rastreo en Tiempo Real (/metricas):** Enlaces Rastreados para Redes, TelemetrÃ­a PC vs Celulares, SincronizaciÃ³n Cloudflare D1 y Mapeo de Popularidad de 16 Secciones.
    8. **Multimedia, Audio & Cloud Edge:** Video Intro Oficial By.Fio, Sonido HÃ¡ptico de Gotas de Agua, Modo Claro/Oscuro y Base de Datos SQLite D1 en el Borde.
- [x] **Lista Exhaustiva al Final con Solo el Nombre de Cada Cosa:**
  - SecciÃ³n final estructurada en 3 columnas limpias con el inventario completo de herramientas, submÃ³dulos y pantallas de la plataforma sin pÃ¡rrafos de relleno.
- [x] **BotÃ³n de Acceso a la Propuesta en el Panel de AdministraciÃ³n:**
  - BotÃ³n *"Propuesta"* en cabecera de administraciÃ³n ([`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx)).
  - Tarjeta destacada *"Propuesta Integral & Ficha TÃ©cnica Oficial (/propuesta) - Documento DueÃ±o"* en el menÃº central de administraciÃ³n ([`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx)).
  - Acceso desde menÃº mÃ³vil en la barra de navegaciÃ³n ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)).

### VersiÃ³n 1.92.0 - Control de DuraciÃ³n por el Video y Entrada a la Web Exclusiva al Finalizar la ReproducciÃ³n
- [x] **EliminaciÃ³n Total de Temporizadores Artificiales de Cierre (`WebIntroOverlay.tsx`):**
  - Erradicado cualquier temporizador de cuenta regresiva fija o fallback arbitrario que cerraba la animaciÃ³n antes de tiempo.
  - El video de introducciÃ³n es ahora el Ãºnico que gobierna el tiempo exacto de permanencia en el intro.
- [x] **Entrada a la Web Exclusiva tras FinalizaciÃ³n del Video (`WebIntroOverlay.tsx`):**
  - La transiciÃ³n hacia la web se activa estrictamente cuando el video emite su evento de tÃ©rmino natural (`onEnded`) o si el usuario pulsa explÃ­citamente el botÃ³n "Saltar intro".
  - Si el usuario tarda en presionar el botÃ³n de volumen o activar el audio, el video no se corta prematuramente. Al activar el sonido en los primeros compases, el video se rebobina suavemente al inicio (`currentTime = 0`) para escuchar la melodÃ­a completa.

### VersiÃ³n 1.91.0 - VisualizaciÃ³n de Letras de Marca por al Menos 2 Segundos Antes del Video Intro
- [x] **RetenciÃ³n Temporal de 2 Segundos en Letras Previas al Video (`WebIntroOverlay.tsx`):**
  - Las letras oficiales de la marca (`BrandLogo` en formato hero con eslogan oficial y puntos de carga) ahora se muestran nÃ­tidas y en foco durante al menos 2 segundos completos (`2000ms`) antes de retirarse.
  - El video se precarga (`preload="auto"`) en pausa durante esos 2 segundos para no perder fotogramas ni reproducir audio desincronizado.
- [x] **TransiciÃ³n QuirÃºrgica y Desbloqueo Gestual Coordinado (`WebIntroOverlay.tsx`):**
  - Al cumplirse los 2 segundos, las letras se desvanecen y se ocultan por completo, dando paso al video que inicia inmediatamente desde el segundo 0 con sonido activo.
  - AÃ±adido control de bloqueo preventivo (`canPlayVideoRef`) para impedir reproducciÃ³n anticipada si el visitante toca la pantalla durante la fase de letras.

### VersiÃ³n 1.90.0 - SincronizaciÃ³n en Tiempo Real de Enlaces & MÃ©tricas (Cross-Tab y Cloudflare D1)
- [x] **SincronizaciÃ³n en Tiempo Real Reactiva InstantÃ¡nea (0ms entre pestaÃ±as):**
  - ImplementaciÃ³n de `BroadcastChannel('byfio_metrics_channel')` y escuchador `window.addEventListener('storage')`.
  - Cuando un visitante o usuario abre cualquier enlace rastreado en otra pestaÃ±a o ventana, la pantalla `/metricas` detecta el evento de inmediato y refresca los contadores de clics, cargas de pÃ¡gina y dispositivos en tiempo real sin recargar la pÃ¡gina.
- [x] **Persistencia y SincronizaciÃ³n Multi-Dispositivo con Cloudflare D1 (`functions/api/metrics.ts`):**
  - CreaciÃ³n del endpoint `/api/metrics` conectado a la base de datos Cloudflare D1 (`byfiocr-db`, tabla `site_metrics`).
  - Cada vez que un usuario abre un enlace desde su telÃ©fono celular, tablet u otra computadora (ej. enlaces compartidos por WhatsApp o redes), la visita se persiste en Cloudflare D1 y se sincroniza en vivo con el panel del administrador.
- [x] **Polling Inteligente Anti-Consumo (Anti-Drain Polling segÃºn `polling-inteligente`):**
  - La pÃ¡gina `/metricas` consulta actualizaciones remotas cada 2.5 segundos Ãºnicamente cuando la pestaÃ±a estÃ¡ activa y visible (`!document.hidden`).
  - Si la pestaÃ±a se oculta o minimiza, el polling se suspende al 100% para ahorro de cuota y baterÃ­a, y se reactiva de inmediato en el microsegundo en que el usuario vuelve a enfocar la pestaÃ±a.
- [x] **ExtracciÃ³n Robusta de ParÃ¡metros en URL (`extractRefSlugFromUrl`):**
  - Soporte de captura de slug desde `window.location.search`, `window.location.hash` y expresiones regulares en la URL completa (`ref`, `link`, `c`, `camp`).
- [x] **Indicador Visual de Estado en Vivo:**
  - Badge pulsante en cabecera: `ðŸŸ¢ En Vivo Â· Tiempo Real Activo`.

### VersiÃ³n 1.89.0 - InclusiÃ³n de Todas las Partes de la Web hasta el Panel Admin en Secciones MÃ¡s Gustadas
- [x] **Monitoreo Integral de Toda la Web hasta el Panel de AdministraciÃ³n (`MetricsPage.tsx` & `metricsTracker.ts`):**
  - La secciÃ³n *"Â¿QuÃ© Secciones Gustaron MÃ¡s?"* ahora incluye absolutamente todas las partes del ecosistema web:
    - **PÃºblicas / Tienda:** Portada / Inicio, CatÃ¡logo Digital, Tienda Online, Talleres Creativos, Detalle de Taller, Precios & Stickers, Portal de Acceso / Login.
    - **Panel de AdministraciÃ³n:** MenÃº Principal (Hub), FacturaciÃ³n RÃ¡pida & POS, Cola de Pedidos & Alisto QR, Inventario & Stock QR, Caja & ReporterÃ­a / Cierre Diario, GestiÃ³n de Alumnos & Talleres, Editor de Precios & Stickers, GestiÃ³n de Perfiles & PINs, y Panel de MÃ©tricas Privado.
  - Filtro interactivo de 3 vistas en cabecera:
    - `ðŸŒ Todas las Partes` (16 secciones combinadas ordenadas por popularidad)
    - `ðŸ›ï¸ Tienda & Clientes` (7 secciones pÃºblicas)
    - `ðŸ›¡ï¸ Panel de AdministraciÃ³n` (9 submÃ³dulos administrativos)
- [x] **Rastreo AutomÃ¡tico Activo de MÃ³dulos Admin (`App.tsx` & `metricsTracker.ts`):**
  - ConexiÃ³n del listener de rutas para registrar la navegaciÃ³n activa entre los submÃ³dulos de administraciÃ³n (`admin`, `admin-billing`, `admin-orders`, `admin-inventory`, etc.).
  - BotÃ³n *"Abrir SecciÃ³n â†’"* en cada tarjeta de mÃ©trica para saltar de inmediato a la secciÃ³n correspondiente.

### VersiÃ³n 1.88.0 - MÃ©tricas EspecÃ­ficas por Enlace Creado & OpciÃ³n "Todas las Secciones"
- [x] **MÃ©tricas EspecÃ­ficas por Enlace Creado (`MetricsPage.tsx` & `metricsTracker.ts`):**
  - Selector interactivo de enlaces en cabecera: permite alternar entre **MÃ©tricas Globales (Todo el Sitio)** y **MÃ©tricas Exclusivas de cada Enlace Creado**.
  - Al seleccionar un enlace creado, se muestran sus datos 100% aislados:
    - CuÃ¡ntas veces se abriÃ³ ese enlace especÃ­fico (`clicks`).
    - CuÃ¡ntas cargas de pÃ¡gina generÃ³ (`pageViews`).
    - En cuÃ¡ntas computadoras (PC) y telÃ©fonos celulares se abriÃ³ ese enlace especÃ­fico con su barra comparativa porcentual.
    - QuÃ© secciones navegaron y gustaron mÃ¡s a las personas que abrieron ese enlace en particular (`sectionsVisited`).
  - BotÃ³n directo *"Ver MÃ©tricas de este Link"* en cada tarjeta de enlace de la lista para cargarlo a pantalla con un solo clic.
- [x] **OpciÃ³n y BotÃ³n "Todas las Secciones" en Generador de Enlaces (`MetricsPage.tsx`):**
  - AÃ±adido el botÃ³n destacado **"ðŸŒ Todas las Secciones / Todo el Sitio Web"** para generar enlaces que abren la portada y rastrean la navegaciÃ³n completa del visitante en cualquier secciÃ³n del sitio web.
  - Botones de selecciÃ³n rÃ¡pida de un clic para destino: [Todas las Secciones], [Tienda Online], [CatÃ¡logo Digital], [Talleres Creativos] y [Precios de Stickers].

### VersiÃ³n 1.87.0 - CorrecciÃ³n de Tema Claro en FacturaciÃ³n & ConfiguraciÃ³n Estricta darkMode: class
- [x] **ConfiguraciÃ³n Estricta `darkMode: 'class'` en Tailwind (`tailwind.config.js`):**
  - AÃ±adido `darkMode: 'class'` para erradicar el conflicto donde el modo oscuro del sistema operativo (Windows `@media prefers-color-scheme: dark`) forzaba clases oscuras en componentes mientras la app estaba en Tema Claro (`vibrant`).
  - Ahora las clases `dark:` se activan exclusivamente cuando el usuario conmuta a modo oscuro en la aplicaciÃ³n y `document.documentElement` contiene la clase `.dark`.
- [x] **Refinamiento Visual del MÃ³dulo de FacturaciÃ³n & POS en Tema Claro (`QuickBillingSection.tsx`):**
  - Contenedor principal en blanco puro brillante con sombra orgÃ¡nica y borde sutil lila.
  - Subpaneles de alisto y formulario de cliente con fondo slate claro suave (`#F8FAFC`).
  - Buscador de productos con fondo blanco, texto oscuro de alto contraste y botones de cantidad limpios.
  - Caja de estado vacÃ­o de la factura rediseÃ±ada con borde punteado lila, Ã­cono morado suave y tipografÃ­a nÃ­tida con contraste AAA.

### VersiÃ³n 1.86.0 - PÃ¡gina Privada de MÃ©tricas (/metricas), Generador de Enlaces y Rastreo por Dispositivos y Secciones
- [x] **PÃ¡gina Privada de MÃ©tricas (`/metricas` y `MetricsPage.tsx`):**
  - Creada la ruta `/metricas` accesible tanto directamente por URL como desde el MenÃº Principal de AdministraciÃ³n.
  - Puerta de acceso de seguridad con cÃ³digo privado `1985`: campo con bullets ocultos (`type="password"` / `â€¢â€¢â€¢â€¢`) sin pistas visuales ni texto del cÃ³digo en la interfaz.
  - Persistencia de sesiÃ³n en `sessionStorage` y botÃ³n de bloqueo rÃ¡pido.
- [x] **Rastreo Global de Cargas y Dispositivos (PC vs Celulares):**
  - Contador de cargas totales de la web y sesiones Ãºnicas individuales.
  - ClasificaciÃ³n de dispositivos en tiempo real: Computadoras de Escritorio (PC) vs TelÃ©fonos Celulares (MÃ³viles) con porcentaje visual comparativo.
- [x] **Generador de Enlaces EspecÃ­ficos Rastreables:**
  - Formulario para crear enlaces con etiquetas personalizadas (ej. Instagram Bio, WhatsApp, TikTok, Promociones o Clientes).
  - Formato generado: `https://byfiocr.pages.dev/?ref=slug` o a secciÃ³n especÃ­fica.
  - Contador individual de aperturas por link, desglose de aperturas en PC y Celular, y Ãºltima fecha de acceso.
  - Botones de 1-clic para copiar enlace, compartir por WhatsApp, probar en nueva pestaÃ±a, reiniciar o eliminar.
- [x] **MÃ©tricas de Preferencias por SecciÃ³n:**
  - Ranking de secciones mÃ¡s vistas y gustadas (CatÃ¡logo Digital, Tienda, Talleres, Portada, Precios de Stickers, etc.).
  - Desglose de vistas, Ã­ndice de me gusta y tiempo promedio de permanencia.
- [x] **Servicio Central de Rastreo (`src/services/metricsTracker.ts`):**
  - Motor de tracking automÃ¡tico que detecta parÃ¡metros de enlace (`?ref=...`), dispositivo del visitante y secciÃ³n navegada.

### VersiÃ³n 1.85.0 - ActualizaciÃ³n del Video de IntroducciÃ³n Oficial
- [x] **Reemplazo del Video de la Intro Web (`public/assets/intro-web-byfio.mp4`):**
  - Actualizado el archivo del video de intro con la versiÃ³n descargada `INTRO BYFIO WEB.mp4` (3.64 MB).
  - Copiado tanto a `public/assets/intro-web-byfio.mp4` como a `public/intro-web-byfio.mp4`.
  - Agregado parÃ¡metro de cache-busting (`?v=20261030`) en [`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx#L291) para forzar la recarga limpia en todos los navegadores sin retenciÃ³n de cachÃ©.

### VersiÃ³n 1.84.0 - CreaciÃ³n Directa de Facturas (POS), Buscador RÃ¡pido de Productos y Ficha de Clientes DinÃ¡mica
- [x] **Flujo RÃ¡pido de FacturaciÃ³n en Mostrador / POS (`QuickBillingSection.tsx`):**
  - Buscador predictivo de productos en tiempo real con selector de cantidad (+ / - / input numÃ©rico) y botÃ³n directo de inclusiÃ³n.
  - Tabla de partidas con recÃ¡lculo automÃ¡tico de subtotales, totales, eliminaciÃ³n rÃ¡pida de Ã­tems y ajuste de cantidades.
  - GeneraciÃ³n instantÃ¡nea de la factura oficial con modal de impresiÃ³n/compartir (`InvoiceModal.tsx`) y descuento automÃ¡tico de stock de inventario.
- [x] **Captura de Datos de Cliente y Entrega al Final del Pedido:**
  - Los datos del cliente (nombre, telÃ©fono, correo, mÃ©todo de entrega, direcciÃ³n y mÃ©todo de pago) se solicitan al final para acelerar el alisto de productos sin demoras en mostrador.
  - Selector de mÃ©todo de entrega: Retiro en tienda (â‚¡0) o EnvÃ­o Correos de Costa Rica (+â‚¡2,500).
  - Medios de pago soportados: SINPE MÃ³vil, Efectivo en Caja, Tarjeta / Datafono y Transferencia Bancaria.
- [x] **Buscador de Clientes Registrados y Auto-Completado:**
  - Buscador de clientes frecuentes por nombre, cÃ©dula, telÃ©fono o correo con selecciÃ³n a un solo clic para autocompletar todo el formulario de facturaciÃ³n.
- [x] **Ficha de Clientes DinÃ¡mica y Personalizable por el Administrador:**
  - Directorio completo de clientes con modal para registrar nuevos clientes (nombre, telÃ©fono, correo, direcciÃ³n y campos dinÃ¡micos).
  - Gestor de campos personalizados: el administrador puede agregar o eliminar nuevos datos requeridos en la ficha de clientes (ej. CÃ©dula/DIMEX, Usuario Instagram, RazÃ³n Social, CumpleaÃ±os) sin tocar la base de cÃ³digo.
- [x] **Tipos y Contexto Global Actualizados (`types/index.ts`, `AppContext.tsx`):**
  - Agregadas interfaces `CustomerFieldDef` y `Customer`.
  - Agregado mÃ©todo `createDirectInvoiceOrder` para crear pedidos directos con cÃ³digo correlativo `#FIO-XXXX`, reduciendo stock y enlazando la factura inmediatamente.

### VersiÃ³n 1.83.0 - CorrecciÃ³n de Contraste en MÃ³dulos de Perfiles, BotÃ³n Pausar y TipografÃ­a de la Mascota
- [x] **Legibilidad Total en Chips de MÃ³dulos Autorizados (`UserProfilesSection.tsx`):**
  - Eliminado el tachado (`line-through`) y la opacidad excesiva (`opacity-40`) que hacÃ­an invisibles los mÃ³dulos no concedidos en tema oscuro.
  - Implementado contraste AAA con bordes y fondos balanceados tanto en tema claro (`text-slate-600` / `bg-slate-100`) como en tema oscuro (`text-slate-300` / `bg-[#201B34]`).
  - MÃ³dulos concedidos resaltados con pÃ­ldora morada de alta visibilidad (`bg-purple-100` / `dark:bg-purple-950/80`).
- [x] **Botones de Estado con Contraste Protegido (`UserProfilesSection.tsx` e `index.css`):**
  - CreaciÃ³n de `.btn-pause-profile` y `.btn-activate-profile` con colores forzados independientes del override de botones generales.
  - El botÃ³n *"Pausar Perfil"* ahora muestra texto Ã¡mbar cÃ¡lido legible `#78350F` en tema claro y `#FDE68A` en tema oscuro, erradicando el texto blanco sobre fondo blanco.
- [x] **TipografÃ­a y Estabilidad del Mensaje de la Mascota (`FloatingMascot.tsx` e `index.css`):**
  - MÃ¡quina de estados (`mascotStatus`: typing -> reading -> goodbye -> exiting) con manejo seguro de caracteres Unicode y emojis mediante `Array.from()`, evitando re-cortes o loops.
  - Tiempo de lectura extendido a **7 segundos completos** tras completarse la escritura del mensaje.
  - TipografÃ­a `font-bubble` en 15px con color forzado `.mascot-speech-text`: Ã­ndigo profundo `#1E1B4B` en tema claro y blanco puro `#FFFFFF` en tema oscuro sobre fondo sÃ³lido.
  - Asignada altura mÃ­nima `min-h-[46px]` para evitar que el cartel se vea vacÃ­o al inicio.

### VersiÃ³n 1.82.0 - DiagnÃ³stico, Visibilidad Inmediata de Perfiles de Usuario y Badge en Admin Navbar
- [x] **Apertura Directa en Modo PIN con Selector de Perfiles (`LoginModal.tsx`):**
  - Establecido `pin` como mÃ©todo predeterminado en lugar de `email`, haciendo inmediatamente visibles el campo *"Perfil de Usuario"* y los botones de acceso rÃ¡pido de los perfiles activos (`ALISTO DE PEDIDOS`, `ATENCIÃ“N Y TALLERES` y los perfiles creados por el admin).
  - Erradicado el problema donde los perfiles quedaban ocultos tras la pestaÃ±a de correo.
- [x] **Indicador Visual del Perfil Activo en la Barra de AdministraciÃ³n (`Navbar.tsx`):**
  - Agregada pÃ­ldora identificadora con punto verde pulsante, nombre del perfil y etiqueta `Admin`/`Staff` en la barra superior al estar dentro del panel de administraciÃ³n.
- [x] **Persistencia y ClarificaciÃ³n de Perfiles Locales:**
  - Garantizada la compatibilidad con el almacenamiento `byfio_user_profiles_v1` en `localStorage` y verificada la restricciÃ³n de visibilidad segÃºn los permisos asignados en el perfil de cada colaborador.

### VersiÃ³n 1.81.0 - OptimizaciÃ³n de Legibilidad y Cadencia Pausada en Mascota Motivacional
- [x] **Cadencia de Escritura CÃ³moda y Pausada (`FloatingMascot.tsx`):**
  - Velocidad de mecanografÃ­a ajustada de 34ms a **62ms por carÃ¡cter**, logrando una lectura fluida, natural y comprensible.
- [x] **AmpliaciÃ³n del Tiempo de Lectura en Pantalla:**
  - El mensaje se mantiene en pantalla durante **6 segundos completos** tras completarse la Ãºltima letra (antes 3s), otorgando tiempo generoso para leer y reflexionar.
  - La despedida *"Â¡AdiÃ³s! ðŸ‘‹âœ¨"* se visualiza durante 1.6s antes de iniciar el descenso animado.
- [x] **Mejora de Contraste y Espaciado del Cartel (`FloatingMascot.tsx` e `index.css`):**
  - Ancho ampliado a `max-w-[340px]` con espaciado interno `p-3.5 sm:p-4`.
  - TipografÃ­a `font-sans` en `14px` con peso seminegrilla, `leading-relaxed` y contraste nÃ­tido (`text-slate-900` / `text-white`).
  - Fondo interior sÃ³lido `#FFFFFF` en tema claro y `#1e1932` en tema oscuro.
  - Encabezado con distintivo *"Mensaje Positivo by.fio"*.

### VersiÃ³n 1.80.0 - Ajuste Textual de Copyright (byfio) y ArmonizaciÃ³n Neutra de PÃ­ldora
- [x] **CorrecciÃ³n Textual Sin Punto (`App.tsx` y `LoginModal.tsx`):**
  - Actualizado el texto oficial a *"Â© Copyright en byfio by GeoSoft"*, eliminando el punto en *"byfio"*.
- [x] **ArmonizaciÃ³n Visual de la PÃ­ldora (`index.css`):**
  - Implementada la clase `.geosoft-copyright-pill` sustituyendo el fondo morado estridente (`#2C2746`) y sus bordes morados.
  - En tema claro, adopta un fondo blanco translÃºcido (`rgba(255, 255, 255, 0.72)`) con borde suave (`rgba(226, 232, 240, 0.85)`).
  - En tema oscuro, utiliza una superficie sutil neutra (`rgba(25, 22, 38, 0.65)`) con borde translÃºcido (`rgba(255, 255, 255, 0.08)`), integrÃ¡ndose orgÃ¡nicamente sin contrastes molestos.

### VersiÃ³n 1.79.0 - Incremento Proporcional del 10% en Tarjeta de Login
- [x] **AmpliaciÃ³n ArmÃ³nica del 10% (`index.css`, `LoginModal.tsx` y `App.tsx`):**
  - Ancho de tarjeta expandido exactamente un 10% de 360px a **395px** (`max-w-[395px]`), con border-radius en 30px y padding a `16px 20px 18px`.
  - Escena 3D de personajes reescalada proporcionalmente a `clamp(138px, 17.5vh, 168px)` (en mÃ³vil a `clamp(132px, 16.5vh, 160px)`).
  - TipografÃ­as y botones escalados en un 10%: tÃ­tulo a `20px`, subtÃ­tulo a `12.5px`, botÃ³n principal a `16px`, inputs a `14px` y badges a `33px`.
  - Preservado el centrado vertical seguro con `my-auto` y padding libre superior e inferior sin recortes en pantalla.

### VersiÃ³n 1.78.0 - Mascota Motivacional en Panel de AdministraciÃ³n con Borde de Luz y Despedida Animada
- [x] **Secuencia CinemÃ¡tica Cronometrada (5s despuÃ©s de la Ãºltima animaciÃ³n) (`FloatingMascot.tsx`):**
  - En el panel de administraciÃ³n (`currentRoute === 'admin'`), la burbuja emerge automÃ¡ticamente exactamente 5 segundos despuÃ©s de completarse la Ãºltima animaciÃ³n de carga del login (`loginIntroStage === 0`).
  - Emerge con efecto sonoro orgÃ¡nico y animaciÃ³n de elevaciÃ³n elÃ¡stica (`animate-bubble-rise-vibrate`).
- [x] **ColecciÃ³n de 60 Mensajes Positivos y Motivacionales:**
  - Integrado un banco de 60 mensajes inspiradores, creativos y de alta energÃ­a diseÃ±ados para el equipo de by.fio.
  - Cada vez que el usuario se conecta se selecciona aleatoriamente un mensaje diferente evitando repeticiones consecutivas mediante memoria de sesiÃ³n.
  - Eliminado por completo el texto *"Soy Estrellita"* tanto en administraciÃ³n como en la vista pÃºblica.
- [x] **Cartel con Borde de Luz Multicolor (Border Beam) (`index.css` y `FloatingMascot.tsx`):**
  - Implementado el efecto visual `.mascot-border-beam` con rotaciÃ³n continua de gradiente espectral luminoso (`@keyframes rotateMascotBeam`), destacando el cartel a la vista del usuario.
- [x] **Efecto MÃ¡quina de Escribir y Despedida Hacia Abajo:**
  - El mensaje se escribe progresivamente letra por letra (34ms por carÃ¡cter).
  - Exactamente **3 segundos** despuÃ©s de escribirse la Ãºltima letra, el cartel muestra *"Â¡AdiÃ³s! ðŸ‘‹âœ¨"*.
  - 1.2 segundos despuÃ©s, la burbuja completa se desliza suavemente hacia abajo (`.animate-mascot-slide-down`) y se cierra de forma limpia.

### VersiÃ³n 1.77.0 - Rebalanceo Ã“ptimo de Proporciones y Escala en Tarjeta de Login
- [x] **AmpliaciÃ³n Balanceada del Contenedor y Escena 3D (`LoginModal.tsx` e `index.css`):**
  - Ancho de tarjeta expandido a **360px** (`max-w-[360px]`), devolviendo cuerpo, presencia y comodidad de lectura sin tocar bordes de pantalla.
  - Altura de la escena 3D reajustada a `clamp(125px, 16vh, 152px)` (con `clamp(120px, 15vh, 145px)` en mÃ³viles), logrando que la ilustraciÃ³n de la niÃ±a y la estrellita luzca destacada y adorable.
- [x] **RestauraciÃ³n de TipografÃ­as, Botones e Inputs (`index.css` y `LoginModal.tsx`):**
  - TÃ­tulo a `18px`, subtÃ­tulo a `11.5px`, botÃ³n principal a `14.5px` y campos de texto con altura ergonÃ³mica.
  - PestaÃ±as de Correo / PIN y badge de copyright GeoSoft con tamaÃ±os equilibrados.
- [x] **Blindaje Anti-Cortes y Centrado Seguro Preservado:**
  - El overlay mantiene `my-auto` dinÃ¡mico y padding seguro `py-4 sm:py-6`, garantizando que la tarjeta nunca toque el lÃ­mite superior ni sufra recortes.

### VersiÃ³n 1.76.0 - ErradicaciÃ³n Definitiva del Corte Superior en Login (Centrado Seguro y DesactivaciÃ³n de Sobrescritura MÃ³vil)
- [x] **AlineaciÃ³n Vertical Segura Sin Recortes (`LoginModal.tsx`):**
  - Removido `justify-center` del contenedor de overlay con scroll (`fixed inset-0 overflow-y-auto`) y aplicado padding vertical seguro `p-2 sm:p-4 py-4 sm:py-6`.
  - El centrado vertical ahora es gestionado exclusivamente por `my-auto` en la tarjeta: cuando hay espacio se centra perfectamente, y si la pantalla es reducida se ajusta desde el margen superior sin empujar el encabezado fuera del viewport.
- [x] **EliminaciÃ³n de Sobrescritura MÃ³vil en Escena 3D (`index.css`):**
  - Removida la regla heredada en `@media (max-width: 640px)` que forzaba `.characters-stage` a `180px !important`, causante de que la tarjeta se expandiera verticalmente y se cortara arriba en pantallas mÃ³viles y laptops.
  - Estandarizada la altura de la ilustraciÃ³n a `clamp(72px, 10vh, 95px)` con padding compacto en la tarjeta (`10px 14px 12px`), logrando un alto total de ~430px que cabe holgadamente en cualquier pantalla.
  - DirecciÃ³n de micro-flotaciÃ³n en `loginSoftFloat` configurada en `translateY(3px)` para no ascender hacia el lÃ­mite superior.

### VersiÃ³n 1.75.0 - Ajuste Anti-Desborde de Navbar, CorrecciÃ³n de Recorte en Login y Selector Visual de Perfiles
- [x] **Ajuste Anti-Desborde de Barra Superior (`Navbar.tsx`):**
  - Ocultamiento responsivo del eslogan de marca en pantallas `<xl` (`hidden xl:inline`).
  - ReducciÃ³n de espaciados y padding en botones de navegaciÃ³n (`px-2.5 xl:px-4 py-1.5 xl:py-2 text-xs xl:text-sm`).
  - Redes sociales condicionadas a pantallas extra-grandes (`hidden xl:flex`) y cambio del breakpoint del menÃº hamburguesa a `lg:hidden`, evitando que la barra se corte de lado en laptops intermedias (1024px-1280px).
- [x] **CorrecciÃ³n de Cortes Verticales en Login (`LoginModal.tsx` e `index.css`):**
  - Reescalado y acotamiento de la escena 3D a `clamp(125px, 17vh, 155px)`, reduciendo mÃ¡s de 120px de altura total de la tarjeta.
  - Padding vertical compacto en inputs y tarjeta (`12px 16px 14px`).
  - SustituciÃ³n de centrado flex rÃ­gido por contenedor con `overflow-y-auto` y margen dinÃ¡mico `m-auto`, eliminando cortes superior e inferior en cualquier resoluciÃ³n o nivel de zoom.
- [x] **Selector Visual de Perfiles Activos en PIN Login (`LoginModal.tsx`):**
  - Renderizado de chips / botones interactivos con los perfiles existentes (`userProfiles.filter(p => p.isActive)`).
  - SelecciÃ³n inmediata con un clic para rellenar el perfil deseado sin necesidad de escribir a mano.

### VersiÃ³n 1.74.0 - IncorporaciÃ³n Global del Badge de Copyright GeoSoft en el Footer
- [x] **Footer Global con Badge Animado de GeoSoft (`App.tsx`):**
  - Incorporado en la base del layout principal el badge de copyright flotante con animaciÃ³n de barrido de color (`.animate-copyright-sweep`), enlace oficial a `https://www.geosoft.lat` y texto *"Â© Copyright en by.fio by GeoSoft"*.
  - Configurado para mostrarse en todo momento en todas las rutas pÃºblicas (`home`, `store`, `catalogo`, `workshops`, `workshop-detail`, `precios`, `login`) y suprimirse estrictamente en la secciÃ³n de administraciÃ³n (`currentRoute !== 'admin'`).
  - Totalmente adaptado para tema claro y tema oscuro con sombras y bordes sutiles con desenfoque de fondo (`backdrop-blur-sm`).

### VersiÃ³n 1.73.0 - OptimizaciÃ³n de Intervalo a 1 Segundo en CoreografÃ­a de Inicio de SesiÃ³n
- [x] **ReducciÃ³n de Intervalo a 1 Segundo (`AppContext.tsx`):**
  - Actualizado el escalonamiento temporal de `triggerLoginCinematic` de 2 segundos a **1 segundo** por elemento para una experiencia Ã¡gil, cinematogrÃ¡fica y dinÃ¡mica:
    - **Paso 1 (0s):** Salida vertical de la tarjeta de login hacia arriba (`.login-exit-up`).
    - **Paso 2 (1s):** Desvanecimiento suave del fondo difuminado (`.backdrop-fade-out`).
    - **Paso 3 (2s):** Descenso de la barra superior de menÃº (`.navbar-slide-down`).
    - **Paso 4 (3s):** Deslizamiento del Panel de Control de izquierda a derecha (`.panel-slide-left`).
    - **Paso 5 (4s):** Deslizamiento del MenÃº Principal de derecha a izquierda (`.menu-slide-right`).
    - **Paso 6 (5s):** Deslizamiento del CatÃ¡logo Comercial de abajo hacia arriba (`.catalog-slide-up`).
    - **CulminaciÃ³n (6s):** Retorno de estado a reposo sin bloqueos.
- [x] **Ajuste de Duraciones CSS en Animaciones (`index.css`):**
  - Duraciones de transiciÃ³n y keyframes ajustadas a `0.8s` (curva `cubic-bezier(0.16, 1, 0.3, 1)`), logrando una cadencia visual fluida que concluye con precisiÃ³n justo antes de iniciarse el siguiente paso.

### VersiÃ³n 1.72.0 - CorrecciÃ³n de Capas y SincronizaciÃ³n Temporal en AnimaciÃ³n de Cierre de SesiÃ³n (Logout)
- [x] **Secuencia Temporal Estricta (Cortina Primero, Login DespuÃ©s) (`index.css` y `LoginModal.tsx`):**
  - La cortina translÃºcida desciende cubriendo toda la web (0s a 0.65s).
  - La ventana de login permanece completamente oculta e invisible durante los primeros 0.70s (`loginDropIn` con delay 0.70s y `animation-fill-mode: both`), iniciando su suave descenso desde la parte superior estrictamente despuÃ©s de que la cortina ha cubierto la pantalla.
  - La flotaciÃ³n permanente suave (`loginSoftFloat`) se activa armÃ³nicamente a los 1.50s al asentarse la tarjeta.
- [x] **CorrecciÃ³n de JerarquÃ­a de Capas (Login Delante de la Cortina) (`LoginModal.tsx` e `index.css`):**
  - Ajustado `.login-curtain-backdrop` a `z-index: 10`.
  - Tarjeta de login (`.login-drop-motion` y wrapper modal) configurada con posiciÃ³n `relative` y `z-index: 30`, garantizando que la ventana de login siempre quede delante de la cortina translÃºcida sin desenfoques ni velos por encima.
  - Envoltorio de modal overlay elevado a `z-[100]`.
- [x] **SupresiÃ³n de Tarjeta Duplicada en Admin (`App.tsx`):**
  - Al cerrar sesiÃ³n en `/admin`, se redirige hacia la vista principal y se desactiva la renderizaciÃ³n estÃ¡tica de la compuerta administrativa mientras `isLogoutTransitionOpen` estÃ¡ activa, impidiendo que aparezca una tarjeta detrÃ¡s de la cortina.

### VersiÃ³n 1.71.0 - RedimensiÃ³n Compacta y ErradicaciÃ³n de Desborde/Cortes en Extremos del Login
- [x] **Ajuste de ProporciÃ³n y Ancho MÃ¡ximo Seguro (`LoginModal.tsx`, `App.tsx` e `index.css`):**
  - Reducido el ancho mÃ¡ximo de la tarjeta de login (`.login-card` y `.scene-wrapper`) de 380px/448px a **335px**, logrando una tarjeta vertical armÃ³nica, compacta y proporcionada.
  - En mÃ³viles (`max-width: 640px`), ajustado el ancho a `min(335px, calc(100vw - 36px))` con padding `14px 16px 18px`, garantizando un margen libre mÃ­nimo de 18px a cada lado para que ni los bordes ni las sombras 3D se corten contra los extremos de la pantalla.
  - Reescalada la escena de personajes (`.characters-stage`) a 195px (180px mÃ³vil) con `max-width: 95%`, impidiendo que la ilustraciÃ³n toque o desborde los laterales del contenedor.
  - Contenedor seguro en administraciÃ³n (`App.tsx`) ajustado a `max-w-[360px]` para mÃ¡xima elegancia visual.

### VersiÃ³n 1.70.0 - Badge de Copyright Animado de GeoSoft en el Login (Estilo BOSUNI CR)
- [x] **InclusiÃ³n del Badge de Copyright en Login (`LoginModal.tsx`):**
  - Incorporada la pÃ­ldora flotante con fondo translÃºcido y borde sutil debajo de la tarjeta de login (`.scene-wrapper`), visible tanto en el modal overlay como en la vista de `/login`.
  - Enlace oficial a `https://www.geosoft.lat` con texto *"Â© Copyright en by.fio by GeoSoft"*.
- [x] **AnimaciÃ³n de Barrido de Luz CromÃ¡tica (`index.css`):**
  - Implementada la animaciÃ³n de barrido de color `.animate-copyright-sweep` (`@keyframes textLightSweep`), con gradiente espectral continuo en ciclo de 4 segundos tomado de la arquitectura de BOSUNI CR.
  - Soporte completo y contraste optimizado tanto en tema claro como en tema oscuro.

### VersiÃ³n 1.69.0 - CoreografÃ­a CinemÃ¡tica de Inicio de SesiÃ³n y EliminaciÃ³n del Footer
- [x] **Secuencia CinemÃ¡tica Cronometrada (cada 2 segundos) (`AppContext.tsx`, `LoginModal.tsx`, `Navbar.tsx`, `AdminHeader.tsx`, `AdminHubMenu.tsx` e `index.css`):**
  - **Paso 1 (0s):** Al autenticarse, la tarjeta de login asciende hacia arriba (`.login-exit-up`, `translateY(-130vh)`) y se esconde suavemente.
  - **Paso 2 (2s despuÃ©s):** El difuminado y fondo translÃºcido (`.backdrop-fade-out`) desaparece con transiciÃ³n suave y fluida.
  - **Paso 3 (2s despuÃ©s):** La barra de menÃº superior (`Navbar`) desciende suavemente de arriba hacia abajo (`.navbar-slide-down`).
  - **Paso 4 (2s despuÃ©s):** La secciÃ³n *"Panel de Control & Alisto QR"* con sus mÃ©tricas y KPIs (`AdminHeader`) ingresa suavemente de izquierda a derecha (`.panel-slide-left`).
  - **Paso 5 (2s despuÃ©s):** La secciÃ³n *"MenÃº Principal de AdministraciÃ³n"* con el grid modular (`AdminHubMenu`) ingresa suavemente de derecha a izquierda (`.menu-slide-right`).
  - **Paso 6 (2s despuÃ©s):** La secciÃ³n *"CatÃ¡logo Comercial Online"* (`AdminHubMenu`) ingresa suavemente de abajo hacia arriba (`.catalog-slide-up`).
- [x] **EliminaciÃ³n Total del Bloque Footer (`App.tsx`):**
  - Removida por completo la secciÃ³n del pie de pÃ¡gina inferior que contenÃ­a el texto *"by.fio â€” Talleres Creativos & Tienda Online â€¢ Costa Rica"*, enlaces y botones flotantes, logrando una interfaz limpia y despejada.

### VersiÃ³n 1.68.0 - AnimaciÃ³n CinemÃ¡tica de Cierre de SesiÃ³n (Cortina TranslÃºcida + CaÃ­da Suave + FlotaciÃ³n 3D)
- [x] **Secuencia CinemÃ¡tica al Cerrar SesiÃ³n (`AppContext.tsx`, `App.tsx`, `LoginModal.tsx` e `index.css`):**
  - Al hacer clic en *"Salir"* o *"Cerrar SesiÃ³n"* (admin, colaboradores o clientes), se activa automÃ¡ticamente la transiciÃ³n global `isLogoutTransitionOpen` que lleva directamente a la ventana de login.
  - **Paso 1 (Cortina TranslÃºcida):** Una cortina translÃºcida con desenfoque de fondo profundo (`backdrop-filter: blur(14px)`, `background-color: rgba(15, 10, 30, 0.72)`) desciende suavemente de arriba hacia abajo (`@keyframes curtainSlideDown`) cubriendo y velando toda la vista de la web de manera permanente.
  - **Paso 2 (CaÃ­da Suave del Login):** Tras descender la cortina, la tarjeta 3D de login aparece deslizÃ¡ndose desde la parte superior (`@keyframes loginDropIn`) con desaceleraciÃ³n orgÃ¡nica y fÃ­sica elÃ¡stica (`cubic-bezier(0.16, 1, 0.3, 1)`).
  - **Paso 3 (FlotaciÃ³n Suave Perpetua):** Una vez centrada en pantalla, la tarjeta entra en un bucle continuo de flotaciÃ³n suave y relajante (`@keyframes loginSoftFloat`), oscilando verticalmente de forma hipnÃ³tica y elegante.
  - Al completar el login o cerrar el modal se restituye el flujo normal y se redirige con seguridad.

### VersiÃ³n 1.67.0 - UnificaciÃ³n 3D de Tarjeta de Login sin Cortes y Campos de Perfil y PIN SimultÃ¡neos
- [x] **UnificaciÃ³n Total de la Tarjeta 3D sin Cortes de Bordes (`LoginModal.tsx` e `index.css`):**
  - Desactivado por completo el elemento de pedestal inferior (`.pedestal` a `display: none !important`), eliminando la semiluna oscura saliente y los huecos triangulares inferiores.
  - Aplanada la curvatura interna de `.form-panel` (`border-radius: 0; background: transparent; box-shadow: none; padding: 10px 0 0`), suprimiendo los arcos cÃ³ncavos en los costados que daban aspecto de tarjeta cortada o mordida.
  - `.login-card` ahora funciona como una sola pieza continua e impecable con `border-radius: 36px` y acolchado completo `18px 20px 24px`.
  - Contenedor modal overlay ajustado con `flex flex-col items-center justify-start sm:justify-center` y `my-auto` evitando cortes verticales en dispositivos mÃ³viles.
- [x] **Campos de Perfil y PIN Visibles en Pantalla SimultÃ¡neamente (`LoginModal.tsx`):**
  - Mostrados en la misma vista los campos *"Perfil de Usuario"* (con forzado en mayÃºsculas) y *"Ingresa el PIN"* (4 dÃ­gitos), erradicando la confusiÃ³n de visualizaciÃ³n escalonada.
  - Mantenimiento estricto del lÃ­mite de 3 intentos mÃ¡ximos con contador reactivo y bloqueo seguro tras fallar 3 veces.

### VersiÃ³n 1.66.0 - Flujo de Acceso por PIN con Solicitud de Nombre, TransiciÃ³n Fluida y LÃ­mite de 3 Intentos
- [x] **Limpieza de Interfaz y Nomenclatura Simplificada (`LoginModal.tsx`):**
  - Eliminado el bloque y pÃ­ldoras pÃºblicas de *"Perfiles de Colaborador activos: ALISTO DE PEDIDOS / ATENCIÃ“N Y TALLERES"*.
  - Renombradas las opciones del selector: *"Correo / Fio"* ahora es estrictamente *"Correo"*, y *"PIN 4 DÃ­gitos"* simplificado a *"PIN"*.
- [x] **Flujo en 2 Pasos con TransiciÃ³n Suave para PIN (`LoginModal.tsx` y `AppContext.tsx`):**
  - **Paso 1:** Solicita en la misma lÃ­nea el nombre del perfil (`Nombre del perfil`), forzando mayÃºsculas automÃ¡ticas y validÃ¡ndolo contra perfiles activos.
  - **TransiciÃ³n Profesional:** Al confirmar, el campo de perfil se desvanece con animaciÃ³n lateral suave (`duration-300`) y da paso inmediato al campo de ingreso de PIN con enfoque automÃ¡tico.
  - El perfil validado se muestra en una cÃ¡psula con opciÃ³n rÃ¡pida *"Cambiar"* para reescribir el nombre si se desea.
- [x] **LÃ­mite de Seguridad Estricto de 3 Intentos (`LoginModal.tsx` y `AppContext.tsx`):**
  - Monitoreo de intentos fallidos en `sessionStorage`; muestra contador reactivo (*"Intentos restantes: X de 3"*).
  - Al tercer intento fallido, bloquea el campo de PIN y el botÃ³n de ingreso de forma segura con mensaje de advertencia.

### VersiÃ³n 1.65.0 - ErradicaciÃ³n de Cortes en Bordes del Login (Tema Oscuro y Claro)
- [x] **Enmarcado 3D Completo y Bordes Delicados (`LoginModal.tsx` e `index.css`):**
  - Incorporado borde definido `1.5px solid rgba(216, 180, 254, 0.45)` y sombra con halo perimetral en modo oscuro, ademÃ¡s de borde sutil `rgba(255, 255, 255, 0.85)` en modo claro, eliminando sensaciones de tarjeta cortada o bordes duros.
  - El pedestal inferior (`.pedestal`) ahora cuenta con degradado oscuro ambientado (`#5b3e8a` a `#2f1d4f`) con brillo pÃºrpura suave en tema oscuro y ancho contenido anti-desborde en mÃ³viles.
- [x] **ContenciÃ³n Ãntegra de IlustraciÃ³n de NiÃ±a y Estrella (`index.css`):**
  - Ajustada la cÃ¡psula `.characters-stage` con padding horizontal de seguridad (`14px` desktop / `10px` mÃ³vil) y escala `max-width: 100%; max-height: 100%`.
  - La estrella violeta con su mini-estrella dorada, los brazos, dedos, manos y el peinado de la niÃ±a se despliegan al 100% completos sin ser recortados por el `overflow` de la tarjeta.
- [x] **BotÃ³n de Cierre "X" Protegido contra Cortes (`LoginModal.tsx` e `index.css`):**
  - Reubicado el botÃ³n de cierre dentro de la tarjeta (`.login-card`), con anclaje seguro `top-3.5 right-3.5` y estilos adaptados a ambos temas, eliminando el corte que sufrÃ­a en esquinas de pantalla.
- [x] **EliminaciÃ³n del Contenedor RÃ­gido Radial en PÃ¡ginas AutÃ³nomas (`LoginModal.tsx`):**
  - Sustituido el bloque rectangular con fondo radial pÃºrpura que generaba cortes cuadrados en `/login` y en `/admin` por una alineaciÃ³n fluida y limpia que respeta el fondo natural del tema activo.
- [x] **IntegraciÃ³n Continua del Selector de MÃ©todo (`LoginModal.tsx` e `index.css`):**
  - Selector de "Correo / Fio" vs "PIN 4 DÃ­gitos" integrado de forma armÃ³nica dentro de `.form-panel`, manteniendo la continuidad anatÃ³mica donde la niÃ±a y la estrella descansan sobre el panel.

### VersiÃ³n 1.64.0 - CorrecciÃ³n Visual y Contraste de Elementos en Tema Oscuro
- [x] **NotificaciÃ³n Flotante de Carrito (`CartSuccessToast.tsx` e `index.css`):**
  - Fondo oscuro con desenfoque `rgba(44, 39, 70, 0.98)` y borde lila translÃºcido en lugar de blanco deslumbrante.
  - TÃ­tulo en verde esmeralda luminoso (`#34D399`), nombre del producto en blanco puro (`#FFFFFF`) y textos secundarios en lavanda suave (`#CBD5E1`), erradicando textos blancos sobre fondo claro.
- [x] **PÃ­ldoras de InformaciÃ³n de Calidad del Hero (`HeroDual.tsx` e `index.css`):**
  - Contenedores estilizados en `#2C2746` con borde suave `rgba(168, 85, 247, 0.3)`.
  - TÃ­tulos en blanco nÃ­tido (`#FFFFFF`), subtÃ­tulos en `#CBD5E1` e iconos con cÃ¡psulas adaptadas `#352F54`.
- [x] **Botones Circulares de AcciÃ³n (`neu-btn-circle` en `index.css`):**
  - Reemplazado el fondo blanco plano por tono nocturno `#332D52` con borde sutil, icono violeta claro (`#E9D5FF`) y estados activos/hover con sombras invertidas.
  - Estado verde esmeralda para productos ya agregados al carrito con contraste Ã³ptimo.
- [x] **ProtecciÃ³n EstÃ©tica del Modal 3D de Login (`index.css`):**
  - Aislada la tarjeta de login 3D frente a reglas globales de inputs en modo oscuro.
  - Campos de texto preservados con fondo blanco crema, texto oscuro legible (`#2D1E40`), placeholder claro y textos/enlaces respetando la paleta original del formulario.

### VersiÃ³n 1.63.0 - RedirecciÃ³n Inmediata a AdministraciÃ³n, URL Segura y Sistema de Perfiles con PIN (4 DÃ­gitos)
- [x] **Ingreso Real e Inmediato a AdministraciÃ³n ([`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx) y [`src/App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Eliminado el bloqueo/congelamiento del modal; al autenticarse se cierra el diÃ¡logo al instante y redirige de inmediato al panel de administraciÃ³n en la URL segura `/admin`.
  - Tolerancia de mayÃºsculas/minÃºsculas para contraseÃ±a `Fio777` / `fio777` y accesos directos si ya existe sesiÃ³n activa.
- [x] **URL Segura y Puerta de AutenticaciÃ³n en `/admin` ([`src/App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - ProtecciÃ³n de ruta: cualquier visita directa a `https://byfiocr.pages.dev/admin` sin sesiÃ³n activa muestra la pantalla de acceso seguro con autenticaciÃ³n integrada, garantizando que nunca quede en blanco ni desprotegida.
- [x] **MÃ³dulo de GestiÃ³n de Perfiles de Usuario ([`UserProfilesSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/UserProfilesSection.tsx) y [`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx)):**
  - Nuevo panel en el Administrador accesible desde `/admin/usuarios` y en el MenÃº Principal con icono de Perfiles.
  - CreaciÃ³n y ediciÃ³n de perfiles (ej: `ALISTO DE PEDIDOS`, `ATENCIÃ“N Y TALLERES`) con nombre forzado en **MAYÃšSCULAS**.
  - AsignaciÃ³n de cÃ³digo de acceso PIN de 4 dÃ­gitos numÃ©ricos con botÃ³n de generaciÃ³n aleatoria.
  - SelecciÃ³n granular de accesos con casillas de verificaciÃ³n (checkboxes) para cada mÃ³dulo del sistema: Pedidos & Alisto, FacturaciÃ³n, Inventario, Caja & Reportes, Talleres, Precios y Perfiles, ademÃ¡s de botÃ³n para marcar todos los accesos (Admin Total).
- [x] **Acceso RÃ¡pido por PIN de 4 DÃ­gitos ([`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx) y [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Selector de mÃ©todo en el formulario de inicio de sesiÃ³n: "Correo / Fio" vs "PIN 4 DÃ­gitos".
  - DetecciÃ³n automÃ¡tica en tiempo real del perfil correspondiente al cÃ³digo digitado (ej: PIN `1001` identifica automÃ¡ticamente a `ALISTO DE PEDIDOS`).
  - RestricciÃ³n visual de mÃ³dulos: los colaboradores solo ven y acceden a las secciones marcadas en sus casillas de verificaciÃ³n.


### VersiÃ³n 1.62.0 - OptimizaciÃ³n Responsiva Universal y AdaptaciÃ³n ErgonÃ³mica para Celulares
- [x] **Meta Viewport & Anti-Overflow Global ([`index.html`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/index.html) y [`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Incorporado `viewport-fit=cover` y escala tÃ¡ctil en meta tag; reglas globales `overflow-x: hidden; width: 100%; max-width: 100vw` y prevenciÃ³n de auto-zoom molesto en inputs en Safari iOS (`font-size: 16px !important`).
- [x] **AdaptaciÃ³n de Tarjetas y Pedestales 3D ([`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Reemplazados anchos rÃ­gidos de login card y pedestal inferior por escalas fluidas `width: 100%; max-width: ...` con `max-width: calc(100vw - 28px)` para pantallas angostas.
- [x] **Barra Superior y NavegaciÃ³n MÃ³vil Limpia ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx) y [`BrandLogo.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/BrandLogo.tsx)):**
  - Ajuste ergonÃ³mico en mÃ³viles: red social TikTok visible en menÃº desplegable y ocultada de la barra ultra angosta para dar espacio al selector de Sol/Luna, Carrito y MenÃº.
  - PÃ­ldora de usuario activo compacta para no desplazar elementos en resoluciones de 320px a 390px.
- [x] **Escalabilidad de TipografÃ­a Hero y Filtros ([`AnimatedByfioLetters.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/AnimatedByfioLetters.tsx), [`HeroDual.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HeroDual.tsx), [`ProductsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/ProductsSection.tsx) y [`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx)):**
  - Letras animadas BYFIO adaptadas con escala fluida desde mÃ³vil (`text-3xl xs:text-4xl...`).
  - Botones de categorÃ­as y filtros convertidos en carrusel horizontal tÃ¡ctil deslizable con `overflow-x-auto scrollbar-none`.
- [x] **Modales, Notificaciones y Mascota Flotante Seguros ([`FloatingMascot.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/FloatingMascot.tsx), [`CartSuccessToast.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/CartSuccessToast.tsx) y [`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - Globos de Estrellita delimitados a `calc(100vw - 2rem)` y toasts centrados sin superar el ancho de la pantalla.


### VersiÃ³n 1.61.0 - Aclarado del Tema Oscuro & CorrecciÃ³n Integral de Contraste TipogrÃ¡fico
- [x] **Aclarado Elegante de la Paleta Nocturna ([`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css) y [`BackgroundDecor.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/BackgroundDecor.tsx)):**
  - Fondo base elevado a `#211D35` (un tono mÃ¡s suave, luminoso y descansado que el negro anterior `#0C0A17`), con tarjetas en `#2C2746` y botones en `#332D52`.
  - Halos ambientales con lavanda, rosa magenta y destellos Ã¡mbar suaves que eliminan la sensaciÃ³n de oscuridad extrema.
- [x] **Legibilidad y Contraste Total de Textos ([`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Encabezados y tÃ­tulos en blanco nÃ­tido (`#FFFFFF`), letras BYFIO animadas con gradiente luminoso pastel, subtÃ­tulos en lavanda clara (`#E9D5FF`) y textos secundarios en gris suave (`#CBD5E1` / `#D1D5DB`).
  - TransformaciÃ³n automÃ¡tica de pÃ­ldoras y cajas blancas a superficies oscuras contrastadas con tipografÃ­a brillante.


### VersiÃ³n 1.60.0 - ReproducciÃ³n Inmediata con Sonido Activo en AnimaciÃ³n Intro
- [x] **Arranque Inmediato sin Esperas ([`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - Eliminado el retraso de 1.4 segundos; el video arranca a reproducirse de una vez con audio activo (`muted = false`, `volume = 1.0`).
- [x] **Desbloqueo TÃ¡ctil y Gestual Universal ([`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - Configurados escuchadores globales en captura para `pointerdown`, `touchstart`, `mousedown` y `click` sobre toda la ventana y el overlay completo, garantizando que el audio se active de inmediato sin quedar bloqueado por polÃ­ticas del navegador.
- [x] **Indicador y BotÃ³n TÃ¡ctil de Audio HD ([`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - BotÃ³n superior con estados dinÃ¡micos ("Sonido activo ðŸŽµ" vs "Activar sonido ðŸ”Š") y banner interactivo de activaciÃ³n instantÃ¡nea al tocar la pantalla.


### VersiÃ³n 1.59.0 - EliminaciÃ³n de MÃ³dulo NeumÃ³rfico y ActivaciÃ³n de Switcher Claro/Oscuro con Botones Sol y Luna
- [x] **EliminaciÃ³n de SecciÃ³n NeumÃ³rfica ([`HomePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HomePage.tsx)):**
  - Removido por completo el bloque demostrativo con textos de neomorfismo, soft UI, tÃ¡ctil minimal y dial circular.
- [x] **Conmutador de Tema Claro / Oscuro con Botones Sol y Luna ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Incorporado selector tÃ¡ctil de tema en la barra superior (tienda y admin) y menÃº mÃ³vil con los botones e iconos de Sol (Ã¡mbar / claro) y Luna (Ã­ndigo / oscuro).
- [x] **Tema Oscuro Completo ([`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css) y [`BackgroundDecor.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/BackgroundDecor.tsx)):**
  - Estilos oscuros globales con fondo noche profunda (#0C0A17), nebulosas violeta cÃ³smicas y contraste refinado en tarjetas, botones y encabezados.


### VersiÃ³n 1.58.0 - Inicio de SesiÃ³n Real con Credenciales Maestras (fio@byfiocr.com / Fio777)
- [x] **AutenticaciÃ³n Maestra Oficial ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Implementado sistema de autenticaciÃ³n real reconociendo `fio@byfiocr.com` (o usuario `fio`) con contraseÃ±a `Fio777` como cuenta Maestra / Administradora con privilegios totales.
  - Soporte de registro de nuevos usuarios de clientes con persistencia segura en `localStorage` (`byfio_auth_user_v1` y `byfio_registered_users_v1`).
- [x] **Formulario Interactivo y ValidaciÃ³n en Modal ([`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx)):**
  - ValidaciÃ³n de credenciales en tiempo real con alertas de error claras ante datos invÃ¡lidos y mensaje de bienvenida personalizado con confeti ante inicio exitoso.
  - Indicador de sesiÃ³n activa con opciÃ³n de desconexiÃ³n inmediata y redirecciÃ³n automÃ¡tica al Panel de AdministraciÃ³n si el rol es administrador.
- [x] **Indicador de Usuario y Acceso RÃ¡pido en Navbar ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Despliegue del estado autenticado en la barra de navegaciÃ³n superior y menÃº mÃ³vil con badge "Admin", botÃ³n de acceso directo a "Panel" y botÃ³n para "Cerrar SesiÃ³n".


### VersiÃ³n 1.57.0 - AmpliaciÃ³n de IlustraciÃ³n de Login y ExposiciÃ³n Total de Manos y Dedos
- [x] **AmpliaciÃ³n de Escala de Personajes ([`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Incrementada la altura de `.characters-stage` a 245px con `max-width: 96%`, brindando una presencia visual mucho mÃ¡s grande, nÃ­tida y destacada a la niÃ±a y a la estrella.
- [x] **Visibilidad Total de Manos y Dedos Apoyados ([`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Asignado `z-index: 5` con `pointer-events: none` a `.characters-stage`, colocando las manos, dedos y codos de la niÃ±a descansando por encima del borde superior de `.form-panel` (`z-index: 3`).
  - Erradicado cualquier corte o solapamiento que tape los dedos; los personajes lucen Ã­ntegros y apoyados fÃ­sicamente sobre el lomo acolchado del formulario.

### VersiÃ³n 1.56.0 - CorrecciÃ³n Definitiva de Apoyo en Login: EliminaciÃ³n de LÃ­neas y CalibraciÃ³n
- [x] **RegeneraciÃ³n de PNG Limpio Sin ExtrusiÃ³n ([`login-3d-girl-star.png`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/assets/login-3d-girl-star.png)):**
  - Eliminadas las lÃ­neas verticales/artefactos inferiores generados por el pixel-stretching anterior.
  - Recorte exacto y limpio sobre el borde real de los personajes (860 x 575 px) con canal alfa 100% transparente en todo el contorno.
- [x] **AlineaciÃ³n Continua Sobre el Panel Acolchado ([`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Calibrado `.characters-stage` a 200px de alto (`width: auto; max-width: 92%`), ubicando los codos de la niÃ±a y el cuerpo de la estrella enteramente dentro del tramo horizontal del panel.
  - Solapamiento de `.form-panel` ajustado a `margin-top: -18px` y radio a 32px, permitiendo que la parte inferior de los personajes quede suavemente oculta tras el lomo del formulario, luciendo 100% apoyados de forma natural y sin cortes.

### VersiÃ³n 1.55.0 - Switches de ActivaciÃ³n de Sonido en Panel de AdministraciÃ³n
- [x] **GestiÃ³n Centralizada de Audio ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx) y [`soundEffects.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/soundEffects.ts)):**
  - AÃ±adidos estados reactivos persistentes (`soundBubbleEnabled` y `soundButtonsEnabled`) con respaldo en `localStorage`.
  - Los sintetizadores `playBubblePopSound` y `playWaterDropSound` evalÃºan de inmediato el estado configurado, silenciÃ¡ndose o activÃ¡ndose al instante.
- [x] **Switches Interactivos en Modal de AdministraciÃ³n ([`AdminDesignSettingsModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminDesignSettingsModal.tsx)):**
  - Incorporada nueva secciÃ³n "Efectos de Sonido Interactivos" accesible desde el botÃ³n "DiseÃ±o & Letra" en el encabezado de administraciÃ³n.
  - Implementados interruptores tipo switch con animaciÃ³n fluida, iconos representativos y vista previa auditiva al encenderlos.

### VersiÃ³n 1.54.0 - Apoyo Natural y ErradicaciÃ³n de Cortes en IlustraciÃ³n 3D del Login
- [x] **Aislamiento en PNG Transparente Real ([`login-3d-girl-star.png`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/assets/login-3d-girl-star.png)):**
  - Removido el fondo plano sÃ³lido mediante algoritmo de segmentaciÃ³n alfa y BFS perimetral, eliminando el recuadro opaco y los bordes rectangulares.
  - Extendido el cuerpo inferior de las mangas y de la estrella en 55px hacia abajo para garantizar que los personajes desciendan de forma continua por detrÃ¡s de la curvatura del panel.
- [x] **CalibraciÃ³n de Solapamiento y Escenario ([`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Eliminado el `border-radius` residual en la imagen y ajustado `.characters-stage` a 215px de altura (`width: 98%`, `max-width: 365px`).
  - Incrementado el solapamiento de `.form-panel` a `margin-top: -26px` para que el panel funcione como un reposabrazos/cuchillo 3D perfecto, logrando que la niÃ±a y la estrella se vean 100% completas y apoyadas de forma natural sin lÃ­neas de corte en ningÃºn extremo.

### VersiÃ³n 1.53.0 - EliminaciÃ³n de Migas de Pan Redundantes ("by.fio inicio") en Portada
- [x] **Limpieza del Hero Principal ([`HeroDual.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HeroDual.tsx)):**
  - Eliminado el bloque de navegaciÃ³n de migas de pan `TreeNavigation` ("by.fio > inicio") ubicado sobre el slogan "Â¡TransformÃ¡ tu creatividad en tu mejor proyecto!".
  - Se despeja la cabecera del Home, dejando la insignia destacada directamente bajo el encabezado principal de la tienda.

### VersiÃ³n 1.52.0 - Efectos Sonoros OrgÃ¡nicos: Burbuja Estallando y Gotas de Agua en Botones
- [x] **Sonido de Burbuja Estallando ([`soundEffects.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/soundEffects.ts) y [`FloatingMascot.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/FloatingMascot.tsx)):**
  - Creada funciÃ³n sintetizada con Web Audio API `playBubblePopSound()` sin dependencias de red, emulando la liberaciÃ³n instantÃ¡nea de presiÃ³n acÃºstica de una burbuja reventando.
  - ReproducciÃ³n automÃ¡tica al emerger la estrellita desde abajo y al desplegarse la burbujita de diÃ¡logo de saludo.
- [x] **Efecto Sonoro de Gotas de Agua en Botones ([`soundEffects.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/soundEffects.ts) y [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Sintetizado el tono resonante de gota de agua lÃ­quida `playWaterDropSound()` mediante curva fÃ­sica de frecuencia ("bloop / plink").
  - Integrado de forma tÃ¡ctil en los controles de la mascota flotante y listener delegado global en todos los botones de la interfaz.

### VersiÃ³n 1.51.0 - SincronizaciÃ³n de Temporizador de Estrellita Tras Cierre de Intro
- [x] **Conteo de 5 Segundos Condicionado al Cierre del Intro ([`FloatingMascot.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/FloatingMascot.tsx)):**
  - Vinculado el componente con `useApp().isIntroOpen` para impedir que el temporizador de la estrellita se ejecute mientras la animaciÃ³n de bienvenida estÃ¡ activa o cubriendo la pantalla.
  - El temporizador de 5 segundos inicia su cuenta regresiva en el instante preciso en que la ventana de animaciÃ³n concluye o el usuario la cierra pulsando "Entrar a la web".
  - Transcurridos los 5 segundos exactos tras el cierre, la estrellita emerge desde abajo con su animaciÃ³n vibrante y desplegando su burbujita de saludo de forma fluida.

### VersiÃ³n 1.50.0 - EliminaciÃ³n de Cuadro de Carga y TipografÃ­a Oficial Blanca en Splash Intro
- [x] **EliminaciÃ³n Total del Marco/Cuadro Cuadrado ([`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - Erradicado el asset de imagen cuadrado `logo-byfio-lila-HD.png` y cualquier marco o caja de fondo en la pantalla de carga/splash.
  - Retirado el atributo poster que mostraba la imagen cuadrada al iniciar la carga del video.
- [x] **TipografÃ­a Oficial de Marca en Color Blanco ([`BrandLogo.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/BrandLogo.tsx) y [`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - AÃ±adido soporte en `BrandLogo` para personalizar el color del texto (`textColor`) y del eslogan (`sloganColor`), manteniendo intactos el corazÃ³n celeste interactivo (`#38BDF8`) y la estrellita dorada (`#FBBF24`).
  - Configurada la marca en formato `hero` con letras blancas limpias y alineaciÃ³n central, idÃ©ntica a la tipografÃ­a oficial del Navbar.

### VersiÃ³n 1.49.0 - EliminaciÃ³n de Redes Sociales en Login y VisualizaciÃ³n Completa de IlustraciÃ³n 3D
- [x] **Retiro de Botones de Redes Sociales ([`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx) e [`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Eliminados los botones de inicio de sesiÃ³n con Google, Apple y Facebook, asÃ­ como el divisor "o continÃºa con", despejando el formulario y enfocÃ¡ndolo al acceso directo por cuenta.
- [x] **AmpliaciÃ³n y VisualizaciÃ³n Ãntegra de la IlustraciÃ³n 3D ([`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Espacio vertical liberado asignado a `.characters-stage` (altura incrementada a 195px con `object-fit: contain`).
  - La muÃ±equita con su moÃ±o castaÃ±o, rostro, suÃ©ter morado, la estrellita sonriente y sus corazones se aprecian al 100% sin cortes en ningÃºn extremo, manteniendo un apoyo natural sobre el marco.

### VersiÃ³n 1.48.0 - Banners Ilustrados Oficiales: Taller Creativo, CatÃ¡logo Digital y Tienda Online
- [x] **IlustraciÃ³n para Taller Creativo ([`WorkshopsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/WorkshopsPage.tsx) y [`HomePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HomePage.tsx)):**
  - Importada la ilustraciÃ³n `imagen tienda creativa.jpeg` y `taller-creativo.jpeg` a `public/assets/imagen-tienda-creativa.jpeg`.
  - Integrado banner ilustrado panorÃ¡mico en la cabecera de la pÃ¡gina de Talleres y en la secciÃ³n de Academia Creativa de la pÃ¡gina de inicio.
- [x] **IlustraciÃ³n para CatÃ¡logo Digital ([`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx)):**
  - Importada la ilustraciÃ³n `IMAGEN CATALODO DIGITAL.jpeg` a `public/assets/imagen-catalogo-digital.jpeg`.
  - Integrado banner ilustrado oficial destacado en la cabecera del CatÃ¡logo Online, sustituyendo las imÃ¡genes genÃ©ricas de stock.
- [x] **IlustraciÃ³n para Tienda Online ([`StorePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/StorePage.tsx) y [`HomePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HomePage.tsx)):**
  - Importada la ilustraciÃ³n `IMAGEN TIENDA ONLINE.jpeg` a `public/assets/imagen-tienda-online.jpeg`.
  - Integrado banner ilustrado oficial en la pÃ¡gina de Tienda y en la secciÃ³n de Favoritos de la Tienda del inicio.

### VersiÃ³n 1.47.0 - Ajuste de Escala Completa y Apoyo Exacto en Tarjeta de Login 3D
- [x] **Ajuste de Escala para VisualizaciÃ³n Completa Sin Cortes ([`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css) y [`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx)):**
  - Calibradas las dimensiones verticales de la tarjeta a escala compacta equilibrada (~500px de altura total) para garantizar que todo el contenido (cabecera con corazÃ³n, personajes, campos de entrada, botones sociales y pedestal) se aprecie al 100% sin cortes en la pantalla.
- [x] **Recorte de PrecisiÃ³n y Apoyo Directo de la MuÃ±equita ([`public/assets/login-3d-girl-star.png`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/assets/login-3d-girl-star.png) e [`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Recortados los 131 pÃ­xeles de espacio vacÃ­o inferior del asset grÃ¡fico, posicionando la lÃ­nea base de los codos y las patas de la estrellita en el pÃ­xel final de la imagen.
  - Aplicado solapamiento quirÃºrgico (`margin-top: -18px` en `.form-panel`) para que los personajes descansen de manera continua y natural sobre el marco acolchado del formulario, erradicando el espacio en blanco.

### VersiÃ³n 1.46.0 - ReorganizaciÃ³n del Header de AdministraciÃ³n y Dock de PestaÃ±as Sin Scroll
- [x] **Limpieza y ReubicaciÃ³n en Encabezado ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Ocultadas las redes sociales (TikTok, Instagram y WhatsApp) en la vista del panel administrativo.
  - Reubicado el botÃ³n "Volver a Tienda" inmediatamente al lado del logotipo `by.fio` en el extremo izquierdo.
  - Reubicados los botones "DiseÃ±o & Letra" y "MenÃº Principal" en la barra superior derecha del Navbar en modo admin.
- [x] **Dock de Botones Administrativos Responsivo y Sin Desplazamiento ([`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx) y [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Erradicada la barra de desplazamiento horizontal (`overflow-x-auto`) sustituyÃ©ndola por una cuadrÃ­cula fluida de 6 columnas en desktop (`lg:grid-cols-6`), 3 columnas en tablet (`sm:grid-cols-3`) y 2 en mÃ³vil.
  - Botones estilizados en pastillas tÃ¡ctiles neumÃ³rficas con badges de estado (Pedidos & Alisto, FacturaciÃ³n, Inventario & QR, Caja & Reportes, Talleres y Precios).
  - Eliminados los botones redundantes del cuerpo inferior de la pÃ¡gina en [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), liberando espacio vertical.

### VersiÃ³n 1.45.0 - AnimaciÃ³n de Entrada Retardada, VibraciÃ³n y Burbuja Sin Borde en Mascota Estrellita
- [x] **EliminaciÃ³n Total de Borde ([`FloatingMascot.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/FloatingMascot.tsx)):**
  - Removido el borde grueso y el padding blanco perimetral de la burbuja flotante del video de la estrellita (`border-0 p-0`), conservando una silueta circular pura con sombras suaves `shadow-2xl`.
- [x] **ApariciÃ³n Retardada a los 5 Segundos ([`FloatingMascot.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/FloatingMascot.tsx)):**
  - Implementado temporizador de 5000ms al cargar la pÃ¡gina para que la estrellita permanezca oculta y no interrumpa la visualizaciÃ³n inicial de la tienda.
- [x] **AnimaciÃ³n de Subida, VibraciÃ³n RÃ¡pida y Burbujita de Saludo ([`FloatingMascot.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/FloatingMascot.tsx) e [`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - AnimaciÃ³n fÃ­sica de resorte `@keyframes bubbleRiseVibrate`: la burbuja asciende fluidamente desde abajo (`translateY(160px)`), alcanza su cÃºspide, realiza una vibraciÃ³n lateral rÃ¡pida y se detiene en seco.
  - Al detenerse la vibraciÃ³n (1150ms post-llegada), emerge de inmediato la burbujita interactiva de saludo ("Â¡Hola! Soy Estrellita âœ¨ Â¿TenÃ©s alguna consulta?").

### VersiÃ³n 1.44.0 - IlustraciÃ³n Oficial Recortada de NiÃ±a y Estrellita en Login 3D
- [x] **IntegraciÃ³n de IlustraciÃ³n Recortada y Ajuste EscÃ©nico ([`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx) e [`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - AÃ±adida la imagen recortada de alta resoluciÃ³n de la niÃ±a con suÃ©ter morado y la estrellita sonriente en [`public/assets/login-3d-girl-star.png`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/assets/login-3d-girl-star.png).
  - Ajustado el encuadre con `object-position: center bottom` y ancho del 90% para que los codos de la niÃ±a y la base de la estrellita descansen de manera natural y exacta sobre el marco acolchado del formulario 3D.
  - Soporte de fallback bidireccional en caso de carga de recursos (`.png` -> `.jpg`).

### VersiÃ³n 1.43.0 - Login 3D Claymorphism (NiÃ±a & Estrellita By.Fio) con IlustraciÃ³n Oficial
- [x] **Componente y Modal de Login 3D ([`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx) e [`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Implementado fielmente el diseÃ±o 3D Claymorphism aportado: tarjeta con sombras biseladas, cabecera con corazÃ³n pulsante `å½¡ ðŸ’– å½¡`, tipografÃ­a `Fredoka` + `Quicksand`, escenario de personajes apoyados en el marco y pedestal 3D inferior.
  - IlustraciÃ³n oficial incorporada en [`public/assets/login-3d-girl-star.jpg`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/assets/login-3d-girl-star.jpg) (con encuadre exacto `center 38%` y corazones flotantes).
  - Formulario interactivo con insignias de iconos en cÃ­rculo morado 3D, alternador de visibilidad de contraseÃ±a (ojo), botÃ³n tÃ¡ctil de envÃ­o con confetti, botones sociales 3D (Google, Apple, Facebook) y selector de modo (Iniciar SesiÃ³n vs Registrarse).
- [x] **Accesos Directos y Rutas ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx) y [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - BotÃ³n tÃ¡ctil "Iniciar SesiÃ³n" en la barra de navegaciÃ³n superior (desktop y drawer mÃ³vil) y en el footer.
  - Habilitada ruta y hash `/login` (#login) para visualizaciÃ³n tanto en modal overlay como en pÃ¡gina inmersiva completa.

### VersiÃ³n 1.42.0 - IntegraciÃ³n del Video VID ESTRELLITA en la Burbuja Flotante
- [x] **Video VID ESTRELLITA en la Mascota / Burbuja Flotante ([`FloatingMascot.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/FloatingMascot.tsx)):**
  - Importado el archivo oficial `VID ESTRELLITA.mp4` desde Descargas a `public/assets/vid-estrellita.mp4` y `public/vid-estrellita.mp4`.
  - Integrado en reproducciÃ³n fluida en bucle continuo (`autoPlay loop muted playsInline`) tanto en la burbuja circular flotante inferior como en la tarjeta interior desplegable de asistencia por WhatsApp.

### VersiÃ³n 1.41.0 - CorrecciÃ³n Integral de Espacios y Cortes en Hero Segment (Full-Bleed de Borde a Borde)
- [x] **Hero Segment a Pantalla Completa De Borde a Borde ([`HeroDual.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HeroDual.tsx) y [`HomePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HomePage.tsx)):**
  - Eliminados los espacios vacÃ­os y mÃ¡rgenes laterales que cortaban visualmente el segmento principal en pantallas anchas.
  - El fondo y degradados ambientales lila pastel oficial ahora cubren el 100% del ancho del viewport (`w-full`) de lado a lado sin esquinas recortadas artificiales.
- [x] **EliminaciÃ³n del Gap Superior y Aislamiento del Contenedor ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Ajustado el layout para que el Hero se conecte directamente y sin separaciones con la barra de navegaciÃ³n superior en la vista principal (`pt-0`), manteniendo el contenedor central `max-w-7xl` para las secciones inferiores de talleres, tienda, precios y ubicaciÃ³n.
  - Resplandores ambientales expandidos (`blur-[120px]`) que logran una atmÃ³sfera continua, pulida y 100% profesional.

### VersiÃ³n 1.40.0 - Etiqueta Sin Bordes "Producto Agregado", NotificaciÃ³n Flotante de Ã‰xito y Carrito Cerrado
- [x] **Etiqueta Sin Bordes "Producto Agregado" en Tarjetas de Productos ([`StorePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/StorePage.tsx), [`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx), [`HomePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HomePage.tsx)):**
  - Implementada insignia distintiva sin bordes (`border-0`, `bg-emerald-500`, texto blanco con icono de verificaciÃ³n `Check`) que se activa reactivamente cuando un producto ya se encuentra en el carrito (`cart.some(it => it.id === product.id)`).
  - Permite a los clientes identificar de un vistazo quÃ© artÃ­culos ya han aÃ±adido a su pedido y cuÃ¡les no.
  - Actualizado el botÃ³n de acciÃ³n en tarjeta a `Agregar MÃ¡s (X en Carrito)` para permitir incrementar unidades cÃ³modamente.
- [x] **Flujo de Carrito Sin Apertura AutomÃ¡tica ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`StorePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/StorePage.tsx), [`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx)):**
  - Eliminada la apertura forzada del drawer del carrito (`setIsCartOpen(true)`) al agregar productos, permitiendo que el usuario continÃºe navegando y comprando sin interrupciones.
- [x] **Cartel / Toast Flotante Auto-Descartable ([`CartSuccessToast.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/CartSuccessToast.tsx)):**
  - Cartel flotante superior en estilo NeumÃ³rfico Glassmorphism con el mensaje `Â¡Producto agregado con Ã©xito!`, nombre del artÃ­culo, foto y resumen reactivo en tiempo real de cantidad y monto total del carrito.
  - Se auto-descarta suavemente tras 3.2 segundos con barra de progreso animada, o manualmente mediante botÃ³n de cierre o acceso opcional a "Ver Carrito".
  - SincronizaciÃ³n reactiva inmediata de contadores en el navbar y barra flotante de pedidos.

### VersiÃ³n 1.39.0 - PublicaciÃ³n Cruzada AutomÃ¡tica (Tienda y CatÃ¡logo) Marcada por Defecto y Opcional
- [x] **Campos de PublicaciÃ³n Cruzada en Productos ([`types/index.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/types/index.ts) y [`NewProductModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/NewProductModal.tsx)):**
  - Incorporados flags `showInStore` y `showInCatalog` activados por defecto (`true`) en creaciÃ³n y ediciÃ³n de productos.
  - Bloque visual con tarjetas neumÃ³rficas e interruptores: al agregar un producto desde la tienda o desde el catÃ¡logo, aparece automÃ¡ticamente en ambos canales, con la opciÃ³n para el administrador de desmarcar cualquiera segÃºn convenga.
- [x] **Filtrado DinÃ¡mico en Tienda, CatÃ¡logo y Home ([`StorePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/StorePage.tsx), [`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx) y [`HomePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HomePage.tsx)):**
  - La Tienda y el Home muestran Ãºnicamente productos con `showInStore !== false`.
  - El CatÃ¡logo muestra Ãºnicamente productos con `showInCatalog !== false`, sincronizando contadores de categorÃ­as.
  - BotÃ³n directo "+ Agregar Producto" y lÃ¡piz de ediciÃ³n rÃ¡pida disponibles directamente en las vistas de Tienda y CatÃ¡logo.
- [x] **Visibilidad en Tabla de Inventario ([`InventoryTable.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx)):**
  - Distintivos visuales `[Tienda]` y `[CatÃ¡logo]` para supervisar los canales asignados a cada artÃ­culo.

### VersiÃ³n 1.38.0 - CorrecciÃ³n Definitiva del Selector de ImpresiÃ³n de Factura y GeneraciÃ³n PDF
- [x] **Aislamiento QuirÃºrgico del Contenedor de ImpresiÃ³n ([`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Corregido el selector CSS de impresiÃ³n (`body.invoice-open #root > div > *:not(.invoice-modal-overlay)`) que provocaba pantalla en blanco en el diÃ¡logo de impresiÃ³n al ocultar errÃ³neamente el contenedor principal de React `#root > div`.
  - Restablecida la jerarquÃ­a de impresiÃ³n en `#root` y `#root > div` (`display: block !important; position: static !important; overflow: visible !important; min-height: 0 !important;`).
  - Habilitado el flujo nativo a pÃ¡gina completa de `.invoice-modal-overlay` e `#printable-invoice` para visualizaciÃ³n y descarga nÃ­tida en Carta / A4.
- [x] **OptimizaciÃ³n en Flujo de Checkout ([`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx) e [`InvoiceModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InvoiceModal.tsx)):**
  - Cierre automÃ¡tico del modal de checkout al pulsar "Imprimir Factura / PDF", desplegando limpiamente la factura con capa superior `z-[80]`.
  - Asegurada la clase `body.invoice-open` en `handlePrint` previo a invocar `window.print()`.

### VersiÃ³n 1.37.0 - Color Lila Pastel Oficial en Botones de Carrito y CatÃ¡logo con Hover Fucsia Suave
- [x] **RediseÃ±o de Color en Botones de Carrito y CatÃ¡logo ([`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Reemplazado el morado fuerte anterior por el gradiente exacto lila pastel suave de referencia (`linear-gradient(135deg, #D4AEFA 0%, #C084FC 100%)`) en `.neu-btn-primary` y `.neu-btn-cart`.
  - Configurado efecto hover que transita fluidamente al fucsia suave oficial (`linear-gradient(135deg, #F472B6 0%, #EC4899 100%)`) con sombra suave `rgba(236, 72, 153, 0.45)`.
- [x] **Botones "Agregar al Carrito" en Tienda y CatÃ¡logo ([`StorePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/StorePage.tsx) y [`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx)):**
  - Formato pill tÃ¡ctil idÃ©ntico a la imagen de referencia con icono de bolsa de compras `ShoppingBag`, tipografÃ­a en blanco puro y respuesta tÃ¡ctil.
  - Actualizado el botÃ³n del carrito en barra superior ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)) y botÃ³n de pago en drawer ([`CartDrawer.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CartDrawer.tsx)).

### VersiÃ³n 1.36.0 - ReproducciÃ³n de Intro con Audio Activo e Imagen de Marca HD (logo-byfio-lila-HD)
- [x] **Video Intro con Inicio de Audio Directo ([`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - Configurado para reproducir directamente con audio activo (`isMuted: false`, `videoRef.current.muted = false`).
  - Fallback automÃ¡tico seguro: si la directiva de seguridad del navegador exige interacciÃ³n previa, inicia silenciosamente y activa el sonido inmediatamente al hacer clic en cualquier parte de la pantalla o sobre el video.
  - Indicador flotante tÃ¡ctil "Toca aquÃ­ para escuchar el video ðŸŽµ" en caso de bloqueo estricto del navegador.
- [x] **Imagen Oficial de la Marca en Alta DefiniciÃ³n ([`logo-byfio-lila-HD.png`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/assets/logo-byfio-lila-HD.png)):**
  - Incorporada la imagen oficial 2000x2000 HD en la fase inicial de la intro con halos radiales pÃºrpuras y dorados pulsantes.
  - Utilizada como imagen de portada (`poster`) nativa en el reproductor de video para mÃ¡xima nitidez visual.

### VersiÃ³n 1.35.0 - Efecto Hover Fucsia Suave en BotÃ³n de MenÃº Principal y NavegaciÃ³n
- [x] **BotÃ³n "MenÃº Principal" en Panel Administrativo ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Implementado efecto de hover interactivo al pasar el mouse (`hover:bg-fio-pink` y resplandor `hover:shadow-[0_4px_14px_rgba(236,72,153,0.45)]`), transitando suavemente del pÃºrpura al fucsia suave de la marca by.fio.
  - Icono de cuadrÃ­cula (`LayoutGrid`) con transiciÃ³n a blanco al pasar el mouse por encima.
- [x] **Botones del MenÃº Principal en Barra Superior y MÃ³vil ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Efecto hover fucsia suave en todos los botones del menÃº de navegaciÃ³n (Inicio, Talleres, Tienda, CatÃ¡logo, Precios): `hover:text-fio-pink hover:bg-pink-50/70 hover:border-pink-200/80`.
  - BotÃ³n de regreso "Ver Tienda / Web" con transiciÃ³n fucsia suave.
- [x] **Tarjetas del MenÃº Principal de AdministraciÃ³n ([`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx)):**
  - TransiciÃ³n a tono fucsia suave en bordes (`hover:border-pink-200/90`), fondo (`hover:bg-pink-50/40`), flecha y tÃ­tulos al hacer hover.

### VersiÃ³n 1.34.0 - Video Oficial de Intro CinematogrÃ¡fica con Gradientes PÃºrpuras Difuminados y TransiciÃ³n Suave a la Web
- [x] **Video Intro Oficial Integrado ([`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - Incorporado video oficial de bienvenida (`intro-web-byfio.mp4`, 10 segundos, 1280x720 HD con audio AAC).
  - Apertura cinematogrÃ¡fica con fondo pÃºrpura profundo y gradientes profesionales (`#4A0E78` a `#120220`, halos radiales difuminados y monograma oficial).
  - DifuminaciÃ³n suave de los gradientes ("SE DIFUMINAN Y APARECE EL VIDEO") con revelaciÃ³n fluida del marco de video en proporciÃ³n 16:9 con sombras y bordes de cristal.
  - Salida gradual ("DESAPARECE LENTAMENTE Y ENTRA EN LA WEB") con desvanecimiento de 1100ms hacia la plataforma web interactiva.
- [x] **Controles TÃ¡ctiles y Accesibilidad:**
  - BotÃ³n tÃ¡ctil para alternar sonido (Mute / Unmute con Audio HD) y detecciÃ³n de toque directo en el video.
  - BotÃ³n "Entrar a la web" (Saltar intro) con acceso instantÃ¡neo.
  - Barra de progreso del video en gradiente neÃ³n.
  - BotÃ³n "Ver Intro Web ðŸŽ¬" disponible en el pie de pÃ¡gina para repetir la experiencia en cualquier momento.
- [x] **SincronizaciÃ³n en Contexto Global ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx) y [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - MÃ©todos `isIntroOpen`, `playWebIntro` y `closeWebIntro` disponibles en toda la app.

### VersiÃ³n 1.33.0 - SecciÃ³n Oficial de Precios de Stickers, Pasos de Pedido y Editor Administrativo Completo
- [x] **SecciÃ³n de Precios de Stickers NeumÃ³rfica ([`PricingStickersSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/PricingStickersSection.tsx)):**
  - Paquetes oficiales para Stickers 5x5: 15 (â‚¡1.000 con 4-5 regalÃ­as), 75 (â‚¡5.000 con 20-25 regalÃ­as), 105 (â‚¡7.500 con 28-35 regalÃ­as), 150 (â‚¡9.500 con 40-50 regalÃ­as).
  - Paquetes oficiales para Stickers 4x4: 24 (â‚¡1.000), 120 (â‚¡5.000), 168 (â‚¡7.500), 240 (â‚¡9.500).
  - Notas de especificaciÃ³n ("Las regalÃ­as son de tamaÃ±o 3x3", "Pregunta por nuestros servicios de diseÃ±o") y botÃ³n directo para pedir por WhatsApp con mensaje pre-rellenado.
- [x] **Flujo Visual "Â¿CÃ³mo Realizar el Pedido?" con Botones de AcciÃ³n:**
  - GuÃ­a paso a paso de los 5 pasos oficiales: EnvÃ­o de logo/diseÃ±o, afinaciÃ³n de detalles, depÃ³sito 50% / 100%, envÃ­o de comprobante SINPE/BCR y revisiÃ³n con 2 modificaciones permitidas.
  - Botones de acciÃ³n directa: "Ir a la Tienda", "Ver CatÃ¡logo Online" y "Pedir por WhatsApp".
- [x] **Editor Completo para el Administrador ([`AdminPricingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminPricingModal.tsx)):**
  - EdiciÃ³n total en tiempo real de tÃ­tulos, categorÃ­as, paquetes de stickers (cantidad, precio, regalÃ­as, badge destacado), notas y los 5 pasos del pedido.
  - Persistencia en almacenamiento local y sincronizaciÃ³n de estado global en [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx).
- [x] **NavegaciÃ³n e IntegraciÃ³n Multi-Ruta ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx), [`HomePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HomePage.tsx), [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx), [`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx)):**
  - AÃ±adido botÃ³n "Precios" en la barra de navegaciÃ³n superior y menÃº mÃ³vil.
  - SecciÃ³n integrada en la pÃ¡gina de Inicio y con ruta directa `/precios`.
  - PestaÃ±a "Precios & Stickers" en el panel de administraciÃ³n (`/admin/precios`) con botÃ³n "Editar Precios".

### VersiÃ³n 1.32.0 - Despliegue Universal del Estilo NeumÃ³rfico en Botones Principales (Inicio, Talleres, Tienda) y Secciones
- [x] **Botones Principales de NavegaciÃ³n MÃ¡s Grandes y TÃ¡ctiles ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Implementados botones con relieve fÃ­sico cerÃ¡mico `.neu-btn` e iluminado activo `.neu-btn-primary` en la barra de navegaciÃ³n superior (desktop y mobile drawer).
  - Aumentado el tamaÃ±o tÃ¡ctil de los botones `Inicio`, `Talleres`, `Tienda` y `CatÃ¡logo` (`px-5 py-2.5` en desktop y `py-3` en mÃ³vil con tipografÃ­a `font-bubble font-bold`).
  - BotÃ³n de carrito neumÃ³rfico con reborde extruido y contador flotante.
- [x] **Botones Principales en Hero y Home ([`HeroDual.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HeroDual.tsx) y [`HomePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HomePage.tsx)):**
  - Botones principales de acciÃ³n ampliados a `px-9 py-4.5 text-base sm:text-lg` con relieve dual tÃ¡ctil y respuesta al presionar.
  - Botones de exploraciÃ³n hacia talleres y tienda en el home con estilo neumÃ³rfico.
- [x] **Estilo NeumÃ³rfico Integral en SecciÃ³n TALLERES ([`WorkshopsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/WorkshopsPage.tsx) y [`WorkshopDetailPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/WorkshopDetailPage.tsx)):**
  - Tarjetas cerÃ¡micas `.neu-card` con esquinas redondeadas generosas, contenedor de fotos rehundido `.neu-inset`, caja de beneficios y botones tÃ¡ctiles de inscripciÃ³n y compartir `.neu-btn-primary` y `.neu-btn-circle`.
- [x] **Estilo NeumÃ³rfico Integral en SecciÃ³n TIENDA & CATÃLOGO ([`StorePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/StorePage.tsx) y [`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx)):**
  - Pastillas de categorÃ­as neumÃ³rficas grandes y tÃ¡ctiles, buscador rehundido con sombra interior, tarjetas de productos con relieve suave y botones de cantidad/carrito tÃ¡ctiles.

### VersiÃ³n 1.31.0 - Factura PDF e ImpresiÃ³n Universal en Hoja EstÃ¡ndar (Carta / A4): Cabecera con Color de Marca y CuadrÃ­cula de LÃ­neas NÃ­tidas
- [x] **Cabecera Oficial con Color de la Marca ([`InvoiceModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InvoiceModal.tsx) e [`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Cabecera con fondo pÃºrpura institucional `#6B21A8` (degradado corporativo `#581C87` a `#7E22CE`) preservado en impresiÃ³n con `-webkit-print-color-adjust: exact` y `print-color-adjust: exact`.
  - TipografÃ­a en blanco puro con logotipo `by.fio`, distintivo `Costa Rica ðŸ‡¨ðŸ‡·`, direcciÃ³n fÃ­sica oficial de TibÃ¡s y WhatsApp `6400-4640`.
  - Recuadro de alta visibilidad para nÃºmero de orden `#FIO-XXXX`, fecha de emisiÃ³n y badge de verificaciÃ³n `PAGADO & VERIFICADO âœ…`.
- [x] **Formato Universal de Hoja de Papel Normal (Carta / A4):**
  - ConfiguraciÃ³n `@page { size: letter portrait; margin: 10mm 12mm 12mm 12mm; }` para impresiÃ³n limpia y proporcionada sin cortes de margen en cualquier impresora.
  - SupresiÃ³n automÃ¡tica de fondos oscuros, barras de desplazamiento y botones de pantalla (`no-print`) al imprimir o guardar como PDF.
  - Flujo libre del documento (`invoice-modal-overlay` y `invoice-modal-card` estÃ¡ticos en `@media print`) para admitir pedidos de mÃºltiples pÃ¡ginas sin desbordes.
- [x] **LÃ­neas SÃ³lidas y CuadrÃ­cula NÃ­tida en Todos los Bloques:**
  - Tabla de artÃ­culos con cuadrÃ­cula completa (`border-collapse`, `border-2 border-slate-400` y divisiones entre celdas `border border-slate-300`), Ã­ndices numÃ©ricos, personalizaciones destacadas y totales alineados.
  - Cuadro de datos del cliente y mÃ©todo de entrega estructurado con bordes de alta definiciÃ³n.
  - Desglose de totales con recuadro perimetral cerrado y cuentas bancarias oficiales (SINPE MÃ³vil y BCR IBAN).
- [x] **Acceso Directo desde Checkout ([`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx)):**
  - Incorporado botÃ³n "Imprimir Factura / PDF" al confirmar la orden para que el comprador descargue o imprima su comprobante al instante.

### VersiÃ³n 1.30.0 - IntegraciÃ³n Oficial de DirecciÃ³n FÃ­sica (TibÃ¡s) y Horarios de AtenciÃ³n Semanales
- [x] **Componente NeumÃ³rfico de DirecciÃ³n y Horarios ([`StudioLocationScheduleCard.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/StudioLocationScheduleCard.tsx)):**
  - **UbicaciÃ³n FÃ­sica Oficial:** 200 sur del parque de TibÃ¡s, San JosÃ©, Costa Rica (Referencia: MAYO10 / by.fio) con botÃ³n de navegaciÃ³n directa hacia Google Maps y WhatsApp oficial `6400-4640`.
  - **Horarios de AtenciÃ³n Semanales:**
    - Lunes, Martes y Viernes: 9:00 am â€“ 5:00 pm (badge de horario regular).
    - Jueves: 10:00 am â€“ 4:00 pm.
    - SÃ¡bado: 10:00 am â€“ 3:00 pm.
    - MiÃ©rcoles y Domingo: Cerrado al pÃºblico (badge Ã¡mbar de descanso).
- [x] **Modal Global de Horarios y UbicaciÃ³n ([`StudioScheduleModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/StudioScheduleModal.tsx) & [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - BotÃ³n tÃ¡ctil permanente en el footer para consultar direcciÃ³n exacta y horarios en cualquier momento.
  - Indicador de estado en tiempo real (Abierto / Cerrado segÃºn dÃ­a de la semana).
- [x] **IntegraciÃ³n en Home y Flujo de Checkout ([`HomePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HomePage.tsx) & [`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx)):**
  - Tarjeta destacada en la pÃ¡gina principal para visitantes y participantes de talleres.
  - Alerta detallada en el Checkout al seleccionar "Retiro en Taller (Gratis)" con direcciÃ³n exacta y horarios de retiro.
- [x] **ActualizaciÃ³n de UbicaciÃ³n Predeterminada de Talleres ([`seedData.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/seedData.ts) y [`NewWorkshopModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/NewWorkshopModal.tsx)):**
  - Los talleres presenciales y el formulario de creaciÃ³n configuran automÃ¡ticamente la sede en TibÃ¡s.

### VersiÃ³n 1.29.0 - CorrecciÃ³n Integral de la Parte Superior de Reportes de Pedidos en la Web: EliminaciÃ³n de Recorte Vertical y RediseÃ±o NeumÃ³rfico
- [x] **EliminaciÃ³n del Recorte Superior en Modales de Pedido ([`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx) e [`InvoiceModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InvoiceModal.tsx)):**
  - Solucionado el bug de flexbox (`items-center` con desborde en coordenadas negativas) que empujaba la cabecera del reporte fuera del margen superior de la pantalla.
  - Implementada arquitectura de ventana con cabecera fija superior (`shrink-0`), contenedor con lÃ­mite `max-h-[92vh] flex flex-col` y cuerpo con scroll interno suave sin barras antiestÃ©ticas (`overflow-y-auto [scrollbar-width:none]`).
- [x] **RediseÃ±o de la Cabecera del Reporte de Pedido Confirmado:**
  - Sustituido el texto interno de desarrollo por una cabecera editorial neumÃ³rfica con distintivo de pedido generado, nombre del cliente, nÃºmero de orden `#FIO-XXXX` destacado en recuadro cerÃ¡mico y metadatos rÃ¡pidos (fecha, telÃ©fono y mÃ©todo de entrega).
  - Desglose estructurado de los artÃ­culos comprados con personalizaciones, subtotales y tarjeta de cuentas SINPE/BCR con copia rÃ¡pida.
- [x] **AlineaciÃ³n y Proporciones en Comprobante Oficial Imprimible:**
  - RediseÃ±ado el encabezado de factura en [`InvoiceModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InvoiceModal.tsx) y reporte diario en [`DailyClosingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/DailyClosingModal.tsx) garantizando visibilidad al 100% desde el primer pÃ­xel.

### VersiÃ³n 1.28.0 - IntegraciÃ³n Oficial de Cuentas para SINPE MÃ³vil y Pagos BCR: Tarjetas NeumÃ³rficas con Copiado RÃ¡pido y Modal de Consulta
- [x] **Datos Bancarios Oficiales de la Marca ([`PaymentAccountsCard.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/PaymentAccountsCard.tsx)):**
  - **SINPE MÃ³vil:** TelÃ©fono `6400-4640` con titularidad oficial a nombre de **Fiorella Patricia Jara GutiÃ©rrez** y botÃ³n de copiado inmediato.
  - **Banco de Costa Rica (BCR):**
    - Cuenta de Ahorros: `00126752891` (con botÃ³n de copiado).
    - Cuenta IBAN: `CR09015202001267528911` (con botÃ³n de copiado).
    - Titular: **Fiorella Patricia Jara GutiÃ©rrez**.
  - Enlace directo a WhatsApp para recepciÃ³n instantÃ¡nea de comprobantes.
- [x] **IntegraciÃ³n en Flujo de Compra y Checkout ([`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx)):**
  - Se sustituyÃ³ el texto plano por la tarjeta neumÃ³rfica completa tanto en el formulario de pago como en la pantalla de orden confirmada con desglose de monto y nÃºmero de pedido.
- [x] **IntegraciÃ³n en InscripciÃ³n a Talleres ([`WorkshopDetailPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/WorkshopDetailPage.tsx)):**
  - Incorporada la tarjeta completa con el monto exacto del taller seleccionado y la titularidad verificada de Fio.
- [x] **Modal Global de Consulta de Cuentas ([`PaymentAccountsModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/PaymentAccountsModal.tsx) & [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - BotÃ³n tÃ¡ctil disponible en el pie de pÃ¡gina para que cualquier visitante consulte las cuentas y nÃºmeros SINPE en cualquier momento con 1 clic.

### VersiÃ³n 1.27.0 - AdopciÃ³n y ModulaciÃ³n del Estilo Neumorphism / Soft UI: Cajas de InformaciÃ³n con Relieve TÃ¡ctil, Botones NeumÃ³rficos y Showcase Interactivo
- [x] **Copiado y ModulaciÃ³n Exacta del Estilo Neumorphism ([`tailwind.config.js`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/tailwind.config.js) y [`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - **Cajas de InformaciÃ³n NeumÃ³rficas (`.neu-card`):** Superficies cerÃ¡micas `#F1F2F6`, esquinas redondeadas generosas (`rounded-3xl`), bisel blanco sutil (`border-white/90`) y doble sombra fÃ­sica proyectada (`-10px -10px 24px #FFFFFF, 10px 10px 24px rgba(166, 175, 195, 0.38)`).
  - **Cajas Inset / Hundidas (`.neu-card-inset`):** Contenedores interiores con sombra cÃ³ncava (`inset 4px 4px 8px ...`).
  - **Botones NeumÃ³rficos TÃ¡ctiles (`.neu-btn`, `.neu-btn-primary`, `.neu-btn-amber`):** Efecto de botÃ³n fÃ­sico extruido que al hacer clic se hunde con sensaciÃ³n tÃ¡ctil (`:active { inset 3px 3px 6px ... }`).
  - **Botones Circulares de AcciÃ³n (`.neu-btn-circle`):** Redondeados completos con resalte suave para iconos de corazÃ³n, audio y sumas.
  - **Selectores Segmentados (`.neu-segmented-container`):** PÃ­ldoras hundidas con interruptores de resalte al estilo del control solar de la referencia.
- [x] **Demostrador Interactivo en Vivo ([`NeumorphicShowcase.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/NeumorphicShowcase.tsx)):**
  - Incorporado en la pÃ¡gina principal recreando todos los elementos de la hoja de diseÃ±o: dial de 28Â°, selector de clima (sol/nube/luna), los 4 pilares (soft, minimal, tactile, natural), barra de bÃºsqueda inset, interruptor toggle on/off, reproductor de audio y la tarjeta de cita con comillas doradas `66` y esfera Ã¡mbar tÃ¡ctil.
- [x] **AdaptaciÃ³n Integral en la Web:**
  - Tarjetas y botones de talleres ([`WorkshopsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/WorkshopsSection.tsx)).
  - Tarjetas y selector de cantidad tÃ¡ctil `[-] 1 [+]` en el catÃ¡logo ([`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx)).
  - Botones del Hero y pÃ­ldoras de calidad ([`HeroDual.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HeroDual.tsx)).
  - BotÃ³n de Proceder al Pago ([`CartDrawer.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CartDrawer.tsx)).
  - IntegraciÃ³n en el selector de diseÃ±o del Admin ([`AdminDesignSettingsModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminDesignSettingsModal.tsx)).

### VersiÃ³n 1.26.0 - Sistema Multifuncional de Carga de FotografÃ­as (URL, Subida de Archivo, Pegar Foto Ctrl+V y Arrastrar y Soltar)
- [x] **Componente Universal de Carga de Fotos ([`ImageUploadField.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/ImageUploadField.tsx)):**
  - Implementado sistema modular de 4 mÃ©todos simultÃ¡neos para fotos:
    1. **Arrastrar y Soltar (Drag & Drop):** Zona interactiva con respuesta visual que captura cualquier archivo de imagen soltado sobre la caja.
    2. **Cargar desde Dispositivo:** BotÃ³n de subida y selector nativo de archivos compatible con celulares y computadoras.
    3. **Pegar Foto (Ctrl+V / Portapapeles):** Captura directa de imÃ¡genes copiadas en el portapapeles mediante botÃ³n interactivo o atajo de teclado `Ctrl+V`.
    4. **Pegar URL Directa:** Campo de texto con detecciÃ³n inmediata de enlaces web o Unsplash.
  - **OptimizaciÃ³n y CompresiÃ³n Client-Side (HTML5 Canvas):** Escalamiento automÃ¡tico de fotos pesadas a un mÃ¡ximo de 1200px con compresiÃ³n JPEG 0.85 (~100-200 KB) para cargas instantÃ¡neas y cero sobrecarga de base de datos o almacenamiento.
- [x] **IntegraciÃ³n en CreaciÃ³n y EdiciÃ³n de Talleres ([`NewWorkshopModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/NewWorkshopModal.tsx)):**
  - Reemplazado el campo bÃ¡sico de URL por el componente multifuncional con vista previa en vivo, badges de origen y resguardo.
- [x] **IntegraciÃ³n en CreaciÃ³n y EdiciÃ³n de Productos e Inventario ([`NewProductModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/NewProductModal.tsx)):**
  - Incorporado en la ficha tÃ©cnica del producto con formato cuadrado y todas las opciones de carga inmediata.

### VersiÃ³n 1.25.0 - Modal Detallado de Producto 100% sin Barra de Scroll: DiseÃ±o Horizontal en 2 Columnas para Computadora y Vista Optimizada para Celular
- [x] **EliminaciÃ³n Total de Barras de Scroll en Computadora y MÃ³vil ([`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx)):**
  - RediseÃ±ada la ventana modal que se abre al tocar cualquier producto del catÃ¡logo: en computadoras se presenta en 2 columnas horizontales (`md:flex-row max-w-3xl`) con fotografÃ­a a la izquierda e informaciÃ³n, precio, descripciÃ³n y acciones a la derecha.
  - Al distribuir el contenido horizontalmente, la altura total cabe 100% dentro de la pantalla sin necesidad alguna de scroll en computadoras.
  - Aplicado `[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden` tanto en el contenedor como en el cuerpo para erradicar cualquier barra de desplazamiento gris antiestÃ©tica.
  - En celulares se despliega con proporciones equilibradas, botÃ³n flotante de cierre accesible y controles tÃ¡ctiles limpios sin estorbar la visibilidad.

### VersiÃ³n 1.24.0 - BotÃ³n "Proceder al Pago", CatÃ¡logo Compacto en CuadrÃ­cula Doble (50% Ancho / 2 Productos por Fila), Modal de DescripciÃ³n en Grande, Limpieza de Iconos IA por CorazÃ³n Azul y ReubicaciÃ³n de Botones a AdministraciÃ³n
- [x] **ActualizaciÃ³n de BotÃ³n a "Proceder al Pago" ([`CartDrawer.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CartDrawer.tsx)):**
  - Modificado el botÃ³n principal del carrito para que exprese textualmente `Proceder al Pago` en sustituciÃ³n del anglicismo "Proceder al Checkout".
- [x] **ReducciÃ³n de Espacio al 50% y Vista de 2 Productos por Fila ([`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx)):**
  - Transformado el catÃ¡logo de filas anchas a una cuadrÃ­cula compacta de 2 columnas (`grid grid-cols-1 md:grid-cols-2 gap-4`), duplicando la densidad de productos visibles en pantalla.
  - Tarjetas compactas con fotografÃ­a interactiva, chips de categorÃ­a, selector Ã¡gil de cantidad `[-] 1 [+]` y botones de orden directa.
- [x] **Despliegue de DescripciÃ³n Detallada en Grande al Clic:**
  - Al pulsar sobre la foto o el tÃ­tulo de cualquier artÃ­culo, se despliega una ventana modal emergente con fotografÃ­a ampliada, especificaciones completas, personalizaciÃ³n y botÃ³n de compra.
- [x] **ReubicaciÃ³n de Acciones de Compartir al Panel de AdministraciÃ³n ([`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx)):**
  - Eliminados los botones de "Copiar Link del CatÃ¡logo" y "Compartir por WhatsApp" del home/catÃ¡logo pÃºblico; ahora residen exclusivamente en el Hub del Panel Administrativo de Fio.
- [x] **SustituciÃ³n de Iconos de IA por el CorazÃ³n Azul Oficial:**
  - Retirados los iconos genÃ©ricos de IA (destellos, paquetes, manos, etc.) y reemplazados en todo el catÃ¡logo por el corazoncito azul oficial de by.fio (`#38BDF8`).

### VersiÃ³n 1.23.0 - CorrecciÃ³n Integral de la Palabra "fio": AlineaciÃ³n Horizontal Continua y Posicionamiento Ã“ptimo de la Estrella
- [x] **AlineaciÃ³n TipogrÃ¡fica Continua ([`BrandLogo.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/BrandLogo.tsx)):**
  - Eliminado el contenedor `flex-col` que provocaba que el tallo de la `i` cayera por debajo de la lÃ­nea base visual de `f` y `o`.
  - La palabra `fio` ahora fluye en una sola lÃ­nea horizontal continua (`inline-flex items-center`) perfectamente cohesionada.
  - La estrella brillante `#FBBF24` se asienta de manera exacta sobre la `i` con micro-desplazamiento suave (`top-[-1px] sm:top-[-2px]`), manteniendo proximidad perfecta con la letra sin salirse ni recortarse en el borde superior del navegador.

### VersiÃ³n 1.22.0 - Ajuste de la Estrella del Logotipo: Proximidad Natural sobre la "i", EliminaciÃ³n de Desborde y Espaciado en Navbar
- [x] **Ajuste y RediseÃ±o de la Estrella ([`BrandLogo.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/BrandLogo.tsx)):**
  - Eliminado el desplazamiento negativo agresivo (`-top-3.5`) que hacÃ­a que la estrella flotara demasiado lejos de la letra y se saliera de la pantalla cortÃ¡ndose contra el borde del navegador.
  - La estrella `#FBBF24` ahora se integra directamente sobre el tallo de la letra `i` con un espaciado natural e inmediato (`1.5px`), actuando como su punto oficial en la misma lÃ­nea visual armÃ³nica de la palabra `fio`.
  - ConstrucciÃ³n de tallo redondeado exacto (`rounded-full bg-fio-800`) alineado con la lÃ­nea base de `f` y `o`.
- [x] **Margen y Altura en Barra Superior ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Barra superior ajustada a `min-h-[50px] sm:min-h-[54px] py-1.5` con margen superior de resguardo para garantizar que el logo, la estrella y el slogan se visualicen completos sin ningÃºn recorte ni desborde superior.

### VersiÃ³n 1.21.0 - CatÃ¡logo Online Oficial (`/catalogo`): Vista en Lista Editorial, Banner FotogrÃ¡fico, CategorÃ­as con Botones y Selector, EdiciÃ³n de Precios y GeneraciÃ³n Inmediata de Pedidos
- [x] **Nueva PÃ¡gina de CatÃ¡logo Online ([`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx)):**
  - Enrutamiento independiente en `/catalogo` y enlace directo en la barra superior de navegaciÃ³n ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)).
  - Banner fotogrÃ¡fico panorÃ¡mico en grande con ambientaciÃ³n visual by.fio, mÃ©tricas de productos y descripciÃ³n detallada del catÃ¡logo para clientes mayoristas e individuales.
  - Enlaces de 1-clic para compartir: `[ðŸ”— Copiar Link del CatÃ¡logo]` y `[ðŸ“² Compartir por WhatsApp]`.
- [x] **SecciÃ³n Especial de CategorÃ­as con Botones, Selector y Buscador:**
  - Botones (pills) interactivos por categorÃ­a con contador dinÃ¡mico de artÃ­culos.
  - Selector desplegable (`<select>`) para filtrado veloz en celulares y filtro para productos personalizables.
  - Buscador reactivo por nombre, cÃ³digo SKU o palabras clave de la descripciÃ³n.
- [x] **PresentaciÃ³n de Productos en Formato Lista Editorial:**
  - Filas de catÃ¡logo con fotografÃ­a amplia (`w-52`), chips de categorÃ­a, tÃ­tulo, cÃ³digo SKU y descripciÃ³n completa visible.
  - Controles de cantidad tÃ¡ctiles `[-] 1 [+]`, cÃ¡lculo en tiempo real del precio total (`formatCRC`), campo opcional de personalizaciÃ³n de texto y botÃ³n `[ðŸ›’ Agregar al Pedido]`.
  - BotÃ³n directo `[âš¡ Pedir por WhatsApp]` para generar el mensaje de orden listo para enviar a Fio con comprobante SINPE MÃ³vil al 6400-4640.
  - BotÃ³n `[âœï¸ Editar ArtÃ­culo]` en cada producto para que el administrador pueda modificar precios, fotos o descripciones en caliente con guardado permanente.
- [x] **Acceso en Panel de AdministraciÃ³n ([`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx)):**
  - MÃ³dulo integrado para copiar el enlace del catÃ¡logo online o abrirlo en vivo directamente desde el Hub administrativo.

### VersiÃ³n 1.20.0 - RestituciÃ³n del Logotipo Oficial con Estrella, CorazÃ³n Interactivo que se Agranda al Tocar y Slogan
- [x] **Logotipo TipogrÃ¡fico Oficial Restituido ([`BrandLogo.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/BrandLogo.tsx)):**
  - Reemplazado el isotipo en caja cuadrada por el logo original tipogrÃ¡fico oficial: letras moradas `by` y `fio` (`font-bubble font-bold text-fio-800`), corazÃ³n celeste `#38BDF8` en el centro y estrellita amarilla brillante `#FBBF24` posicionada sobre la `i`.
  - Slogan oficial integrado debajo: `TALLERES CREATIVOS & TIENDA` en tipografÃ­a morada tracking-wider en mayÃºsculas.
- [x] **Micro-InteracciÃ³n TÃ¡ctil del CorazÃ³n Celeste:**
  - Al hacer clic o tocar con el dedo en pantallas tÃ¡ctiles, el corazÃ³n celeste se agranda dinÃ¡micamente (`scale-150 rotate-6` con retorno elÃ¡stico suave).
  - Al pasar el cursor (hover) se expande con efecto resorte (`scale-130`).
- [x] **IntegraciÃ³n en Barra de NavegaciÃ³n ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Ajustada la barra superior con altura flexible (`min-h-[48px] sm:min-h-[52px]`) para enmarcar el logo y slogan con equilibrio estÃ©tico perfecto.

### VersiÃ³n 1.19.0 - EdiciÃ³n Completa y Persistente de ArtÃ­culos del Inventario con Fotos, Precios, Stock y WMS
- [x] **EdiciÃ³n Integral de ArtÃ­culos ([`NewProductModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/NewProductModal.tsx)):**
  - Modal adaptado a modo dual (`Crear Producto` vs `Modificar ArtÃ­culo del Inventario`).
  - EdiciÃ³n completa de todos los atributos: nombre, cÃ³digo SKU (con generador automÃ¡tico), categorÃ­a (con creador dinÃ¡mico de nueva categorÃ­a), ubicaciÃ³n fÃ­sica en estanterÃ­a (WMS), precio de venta (â‚¡), costo unitario (â‚¡), cÃ¡lculo automÃ¡tico de margen de ganancia en colones y porcentaje, stock actual, alertas de stock mÃ­nimo y meta de stock mÃ¡ximo, unidad de medida, descripciÃ³n detallada y opciones de personalizaciÃ³n por cliente.
  - PrevisualizaciÃ³n en vivo de la fotografÃ­a del producto a partir de la URL ingresada con fallback automÃ¡tico.
- [x] **Acceso Directo de EdiciÃ³n en Tabla de Inventario ([`InventoryTable.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx)):**
  - AÃ±adido botÃ³n `[âœï¸ Editar]` en la columna de acciones de cada fila del inventario.
  - La fila del producto (foto, SKU y nombre) es interactiva y permite abrir el editor completo al hacer clic.
  - El botÃ³n `+ Agregar Producto al Inventario` limpia el formulario para crear un nuevo Ã­tem desde cero.
- [x] **GestiÃ³n y Persistencia Global en Context ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Nuevos estados globales `editingProduct`, `setEditingProduct` y funciÃ³n `updateProduct`.
  - SincronizaciÃ³n instantÃ¡nea con `localStorage` (`byfio_products_v1`) y reactividad inmediata en catÃ¡logo de tienda, buscador, Ã³rdenes y facturaciÃ³n.

### VersiÃ³n 1.18.0 - Modal de Crear/Modificar Taller a Pantalla Completa & EdiciÃ³n Completa Persistente con Fotos y DescripciÃ³n
- [x] **Ventana Inmersiva a Pantalla Completa ([`NewWorkshopModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/NewWorkshopModal.tsx)):**
  - TransformaciÃ³n del modal a una experiencia de pantalla completa (`fixed inset-0 w-full h-full`), sin cuadros reducidos ni scrolls apretados.
  - Encabezado superior con botÃ³n de cierre rÃ¡pido y tÃ­tulo dinÃ¡mico contextual (`Crear Nuevo Taller` vs `Modificar Taller Existente`).
  - Maquetado editorial a 2 columnas con vista previa de fotografÃ­a en tiempo real, campos de tÃ­tulo, subtÃ­tulo, fecha, horario, modalidad, ubicaciÃ³n fÃ­sica, cupos totales y precio en colones.
  - Editor dinÃ¡mico de descripciÃ³n completa del temario y lista editable de materiales incluidos (`Â¿QuÃ© incluye?`) con opciÃ³n de agregar o eliminar Ã­tems.
  - Barra inferior fija de guardado con aviso de confirmaciÃ³n toast.
- [x] **EdiciÃ³n y ModificaciÃ³n de Talleres Existentes ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Nuevos estados globales `editingWorkshop`, `setEditingWorkshop` y funciÃ³n `updateWorkshop`.
  - Carga automÃ¡tica de todos los datos vigentes del taller al abrir el modal en modo ediciÃ³n.
  - Guardado persistente inmediato en `localStorage` (`byfio_workshops_v1`) y reactividad en todo el sitio (pÃ¡gina pÃºblica del taller, catÃ¡logo y panel de administraciÃ³n).
- [x] **Acceso RÃ¡pido de ModificaciÃ³n en Panel Admin ([`WorkshopEnrollmentsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/WorkshopEnrollmentsSection.tsx)):**
  - AÃ±adido botÃ³n directo `[âœï¸ Modificar]` en cada fila de taller (tanto en vista colapsada como en el panel desplegado de acciones).
  - Al pulsar `+ Crear Taller`, limpia el formulario a blanco; al pulsar `Modificar`, pre-llena los datos del taller seleccionado.

### VersiÃ³n 1.17.0 - Selector DinÃ¡mico de Cantidad en CatÃ¡logo, Precio en Tiempo Real y Carrito Centrado en MÃ³vil con BotÃ³n "Seguir Comprando"
- [x] **Controles de Cantidad y Precio DinÃ¡mico en CatÃ¡logo ([`StorePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/StorePage.tsx)):**
  - Incorporado selector tÃ¡ctil `[-] 1 [+]` directamente en la tarjeta de cada producto antes de aÃ±adir.
  - El monto del precio se multiplica y actualiza en tiempo real (`formatCRC(p.price * currentQty)`).
  - Al pulsar "Agregar al Carrito", se aÃ±ade la cantidad exacta seleccionada y se abre automÃ¡ticamente el carrito.
- [x] **Carrito Centrado en MÃ³vil ([`CartDrawer.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CartDrawer.tsx)):**
  - Eliminado el desfase lateral (`pl-10`) que provocaba que el carrito se viera de lado o cortado en pantallas de celular.
  - Maquetado responsivo: en celular se abre centrado en pantalla completa con bordes suaves (`rounded-[32px]`) y sombra envolvente; en desktop se desliza lateralmente.
  - AÃ±adido botÃ³n secundario mandatorio `[Volver a Seguir Comprando]` en el pie del carrito y en estado vacÃ­o, facilitando continuar explorando la tienda sin fricciÃ³n.

### VersiÃ³n 1.16.0 - Hero a Pantalla Completa & AnimaciÃ³n DinÃ¡mica RÃ¡pida de Letras "BYFIO" en el Centro
- [x] **Hero a Pantalla Completa ([`HeroDual.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HeroDual.tsx)):** Dimensionado con `min-h-[calc(100vh-3rem)] sm:min-h-[calc(100vh-3.5rem)]` en disposiciÃ³n centrada vertical y horizontal (`flex flex-col justify-center items-center`), cubriendo el viewport con degradados ambientales expandidos para un impacto visual envolvente.
- [x] **AnimaciÃ³n Veloz de Letras "BYFIO" ([`AnimatedByfioLetters.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/AnimatedByfioLetters.tsx)):**
  - Efecto de onda fÃ­sica escalonada en cada letra individual (B - Y - F - I - O) con retraso dinÃ¡mico de resorte (`0.1s` por letra).
  - Barrido de brillo iridiscente ultra-rÃ¡pido (`byfioShineSweep`) sobre gradiente morado-fucsia-celeste oficial.
  - Micro-interacciÃ³n interactiva con salto elÃ¡stico al hover y clic (`translateY(-16px) scale(1.3)`).
  - DecoraciÃ³n con la estrellita amarilla oficial giratoria y corazoncito celeste pulsante con sombras de luz.

### VersiÃ³n 1.15.0 - ReorganizaciÃ³n Compacta del Panel Admin, EliminaciÃ³n de PestaÃ±a Redundante y UbicaciÃ³n Superior de Botones Clave
- [x] **EliminaciÃ³n del botÃ³n redundante "MenÃº Principal" en [`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx):** Retirado el Tab 0 inferior que duplicaba el acceso; ahora las pestaÃ±as se centran estrictamente en las 5 secciones de trabajo operativo (Pedidos, FacturaciÃ³n, Inventario, Caja, Talleres).
- [x] **ReubicaciÃ³n Superior de Botones de AcciÃ³n ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):** BotÃ³n `ðŸŽ¨ DiseÃ±o & Letra` (detalles y personalizaciÃ³n visual) trasladado a la barra superior justo al lado del botÃ³n `MenÃº Principal`, permitiendo ajustar tipografÃ­as y paletas de color desde cualquier secciÃ³n sin tener que regresar al Hub.
- [x] **EliminaciÃ³n de la etiqueta estÃ¡tica "Panel Administrativo" en Navbar ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):** Reemplazado por un acceso limpio `â† Ver Tienda / Web`, y retirada la repeticiÃ³n textual en la barra de Ã¡rbol con slashes (`by.fio / [secciÃ³n]`).
- [x] **ElevaciÃ³n vertical de contenidos:** Reducido el espaciado global (`space-y-3 sm:space-y-4` y `mb-4`) para que los datos e inventario queden inmediatamente a la vista sin scroll innecesario.

### VersiÃ³n 1.14.0 - Landing Page Individual de Taller por URL (`/talleres/:id`), Enlace Social EspecÃ­fico vs General e InscripciÃ³n Directa con SINPE MÃ³vil
- [x] **PÃ¡gina de Destino Dedicada por Taller ([`WorkshopDetailPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/WorkshopDetailPage.tsx)):**
  - Enrutamiento por URL individual e independiente (`/talleres/:id` o `/talleres?taller=:id`).
  - NavegaciÃ³n con Ã¡rbol de slashes integrado (`by.fio / talleres / [nombre del taller]`) y botÃ³n de retorno al catÃ¡logo.
  - MaquetaciÃ³n editorial en 2 columnas:
    - **Lado Izquierdo:** FotografÃ­a principal en marco zen/neumÃ³rfico suave, chips de fecha, horario, ubicaciÃ³n fÃ­sica/virtual, tÃ­tulo editorial y descripciÃ³n completa del taller y experiencia impartida por Fio.
    - **Lado Derecho:** Tarjeta "Materiales y Todo lo que Incluye" con checks esmeralda de todos los insumos, herramientas y coffee break artesanal; tarjeta de "InversiÃ³n & Reserva Inmediata" con selector dinÃ¡mico de cupos, cÃ¡lculo automÃ¡tico en colones (`formatCRC`) y formulario integrado de contacto.
- [x] **Flujo de Pago e InscripciÃ³n Oficial con SINPE MÃ³vil:**
  - Caja informativa de SINPE MÃ³vil oficial (`6400-4640`, Fiorella Carballo) con botÃ³n de 1-clic para copiar nÃºmero.
  - Al confirmar la reserva: registra el pedido con nÃºmero Ãºnico en la base de datos y panel de Fio (`/admin/pedidos` y `/admin/talleres`), descuenta cupos en tiempo real y abre WhatsApp oficial (`6400-4640`) con el mensaje pre-redactado y estructurado para adjuntar el comprobante.
  - OpciÃ³n secundaria de agregar el taller al carrito general para compras conjuntas con artÃ­culos de papelerÃ­a.
- [x] **SeparaciÃ³n Estricta de Enlaces Sociales en Panel Admin ([`WorkshopEnrollmentsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/WorkshopEnrollmentsSection.tsx)):**
  - BotÃ³n general en el encabezado: `[ðŸ”— Copiar Link de Todos los Talleres]` (`/talleres`).
  - BotÃ³n individual en cada taller: `[ðŸ”— Copiar Link de este Taller]` (`/talleres/:id`).
  - BotÃ³n `[ðŸ‘ï¸ Ver PÃ¡gina PÃºblica]` para inspecciÃ³n directa del taller en vivo.
- [x] IntegraciÃ³n en catÃ¡logo pÃºblico ([`WorkshopsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/WorkshopsPage.tsx)): Enlaces directos a la pÃ¡gina de cada taller desde imagen, tÃ­tulo y botÃ³n "Ver Taller & Inscribirme", con botÃ³n rÃ¡pido de copiado de link por tarjeta.

### VersiÃ³n 1.13.0 - Sub-Rutas de URL Independientes para Admin, MenÃº Hub Compacto en 1 Pantalla & Modal Discreto de DiseÃ±o
- [x] Enrutamiento por URL independiente en cada secciÃ³n administrativa:
  - `/admin` (MenÃº Principal / Hub)
  - `/admin/facturacion` (FacturaciÃ³n RÃ¡pida)
  - `/admin/pedidos` (Cola de Pedidos & Alisto QR)
  - `/admin/inventario` (Inventario & Etiquetas QR)
  - `/admin/caja` (Caja & ReporterÃ­a)
  - `/admin/talleres` (Talleres & Alumnos)
  SincronizaciÃ³n bidireccional con historial del navegador y recargas directas con soporte SPA.
- [x] RediseÃ±o ultra-compacto del MenÃº Hub en [`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx): Eliminadas las descripciones largas y botones redundantes; cajitas tÃ¡ctiles estilizadas (`grid-cols-5` en desktop) con iconos profesionales en gradiente pastel, tÃ­tulos concisos y badges en una sola pantalla sin necesidad de scroll.
- [x] Modal discreto de PersonalizaciÃ³n Visual ([`AdminDesignSettingsModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminDesignSettingsModal.tsx)): Retiradas las dos cajas gigantes de tipografÃ­a y color de la pantalla principal, reemplazÃ¡ndolas por un botÃ³n compacto `ðŸŽ¨ DiseÃ±o & Letra` en el encabezado de [`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx).

### VersiÃ³n 1.12.0 - ReducciÃ³n del 50% de la Barra Superior de NavegaciÃ³n (Navbar Slim)
- [x] ReducciÃ³n de la altura total de la barra de navegaciÃ³n de `h-20` (80px) a `h-11 sm:h-12` (44px-48px), reduciendo exactamente un 50% el espacio vertical ocupado.
- [x] Pastilla de enlaces (`Inicio`, `Talleres`, `Tienda`) compactada a `p-0.5` con botones de `px-3 py-1 text-xs`.
- [x] Dimensiones de isotipo y logotipo optimizadas en [`BrandLogo.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/BrandLogo.tsx) (`size="sm"` con `w-7 h-7 sm:w-8 sm:h-8`).
- [x] Botones de redes sociales y carrito redimensionados para una alineaciÃ³n equilibrada y sin desperdicio de pantalla.

### VersiÃ³n 1.11.0 - Selector Global de Paleta de Colores en Admin (Moradito & Rosa Vibrante vs Zen CerÃ¡mica)
- [x] Selector de Tema de Color interactivo en el encabezado del panel admin ([`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx)):
  1. **Moradito & Rosa Vibrante (Original by.fio):** Fondo lavanda pastel (`#FAF5FF`), morado profundo (`#6B21A8`), cajas blancas con sombras moraditas y acentos en rosa fuerte (`#EC4899`).
  2. **Zen CerÃ¡mica & Calma (Slow Space):** Fondo crema cerÃ¡mico cÃ¡lido (`#FAF7F2`), blanco perla (`#FDFBF9`), sombras neumÃ³rficas suaves y acentos lavanda sutil.
- [x] Sobreescritura dinÃ¡mica en todo el sitio web mediante `data-color-theme="vibrant|zen"` en el body y reglas en [`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css).
- [x] AdaptaciÃ³n automÃ¡tica de los destellos y texturas ambientales en [`BackgroundDecor.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/BackgroundDecor.tsx).
- [x] Persistencia en `localStorage` (`byfio_color_theme_v1`).

### VersiÃ³n 1.10.0 - MenÃº Principal del Panel Admin con Cajitas Grandes Redonditas (Hub Central)
- [x] Nuevo componente [`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx) con 5 cajitas de botones tÃ¡ctiles bien grandes y redonditas (`rounded-[32px]`) en una sola pantalla:
  1. **ðŸ“¦ Cola de Pedidos & Alisto QR** (con contador de pedidos pendientes en vivo).
  2. **ðŸ§¾ FacturaciÃ³n RÃ¡pida** (bÃºsqueda instantÃ¡nea por # de orden).
  3. **ðŸ·ï¸ Inventario & Etiquetas QR** (con indicador de stock crÃ­tico y total de productos).
  4. **ðŸ’° Caja & ReporterÃ­a Diaria** (resumen de ingresos, arqueo y valor de inventario).
  5. **ðŸŽ“ Talleres & Inscripciones** (seguimiento de alumnos y cupos activos).
- [x] NavegaciÃ³n fluida: al dar clic a cualquier cajita entra a la secciÃ³n especÃ­fica. Dentro de la secciÃ³n se incluye el botÃ³n permanente `â† Volver al MenÃº Principal` y pestaÃ±as rÃ¡pidas.
- [x] Ãrbol de navegaciÃ³n con slashes sincronizado (`by.fio / panel administrativo` y `by.fio / panel administrativo / [secciÃ³n]`).

### VersiÃ³n 1.9.0 - Limpieza Visual de Borde Blanco, EliminaciÃ³n de Logo Redundante & Ãrbol Compacto sobre Cuadro Difuminado
- [x] EliminaciÃ³n del borde blanco invasivo en el isotipo y retiro del slogan secundario en el Navbar (`BrandLogo.tsx`), dejando Ãºnicamente el isotipo degradado suave y el nombre `by.fio`.
- [x] Retiro del bloque flotante duplicado con borde blanco en el Hero (`HeroDual.tsx`).
- [x] IntegraciÃ³n directa de la barra de navegaciÃ³n con slashes (`by.fio / inicio`, `by.fio / tienda`, `by.fio / talleres`) encima del cuadro con difuminado, erradicando el espacio en blanco vacÃ­o superior y compactando el diseÃ±o.

### VersiÃ³n 1.8.0 - Selector Global de TipografÃ­a en Panel Admin (Redondita vs Serif vs CombinaciÃ³n)
- [x] Selector tipogrÃ¡fico interactivo en el encabezado del panel admin (`AdminHeader.tsx`):
  1. **Solo Letra Redondita:** Fuerza Fredoka & Quicksand en todos los tÃ­tulos de la tienda, talleres y home.
  2. **Solo Letra Serif Zen:** Fuerza Cormorant Garamond en todos los tÃ­tulos para una estÃ©tica 100% editorial slow space.
  3. **CombinaciÃ³n de Ambas:** TÃ­tulos principales en Serif elegante + subtÃ­tulos, insignias y botones en letra redondita.
- [x] Persistencia en `localStorage` (`byfio_typography_theme_v1`) y sobreescritura CSS en tiempo real vÃ­a `data-font-theme` en el body (`src/index.css`).

### VersiÃ³n 1.7.0 - PÃ¡ginas Independientes (/tienda, /talleres), Ãrbol de NavegaciÃ³n con Slashes, Estilo Zen NeumÃ³rfico & TikTok Oficial
- [x] PÃ¡ginas independientes con enrutamiento de URL real: `/` (Inicio), `/tienda` (Tienda Online) y `/talleres` (Academia). Regla `_redirects` en Cloudflare Pages para SPA.
- [x] Ãrbol de navegaciÃ³n con divisiÃ³n de slashes (`TreeNavigation.tsx`): `by.fio / tienda / [categorÃ­a]` y `by.fio / talleres`.
- [x] RediseÃ±o de Tienda (`StorePage.tsx`) con estÃ©tica NeumÃ³rfica / Zen Claymorphism (inspirada en la referencia enviada): tarjetas suaves de doble sombra ("cajitas bonitas"), pastillas de categorÃ­as rehundidas/resaltadas, inputs con efecto inset y botones tÃ¡ctiles circulares/pastilla.
- [x] Fondo decorativo cerÃ¡mico sereno con degradados de luz difusa y textura artesanal (`BackgroundDecor.tsx`).
- [x] Enlace oficial de TikTok integrado en Navbar y Footer: `https://www.tiktok.com/@by_fio/`.

### VersiÃ³n 1.6.0 - Navbar Limpio con NavegaciÃ³n de Secciones & Acceso Admin Discreto
- [x] Navbar limpio con links de secciones y acceso administrativo por hash route (`#admin`).

### VersiÃ³n 1.5.0 - CreaciÃ³n de Talleres (CRUD) & Enlaces Compartibles para Redes
- [x] Modal `NewWorkshopModal`: Alta de nuevos talleres con foto, precio, cupos y campos "quÃ© incluye".
- [x] GeneraciÃ³n de enlaces directos compartibles con parÃ¡metro `?taller=ID` y resalte automÃ¡tico.

### VersiÃ³n 1.4.0 - GestiÃ³n de Inscripciones a Talleres
- [x] PestaÃ±a `Talleres & Inscripciones` en Panel Admin con detalle de inscritos por taller derivado de Ã³rdenes.

### VersiÃ³n 1.3.0 - Identidad de Marca Vectorial Oficial Ultra HD (Trazos Originales)
- [x] IntegraciÃ³n de trazos vectoriales SVG oficiales de `by.fio`:
  - Letra "b" y "y" con grosores originales (stroke-width: 50).
  - CorazÃ³n celeste central (#9BE4FF) con coordenadas curvas BÃ©zier exactas.
  - Letra "f" e "i" con espaciado original.
  - Estrella amarilla (#FFF07C) inclinada 12Â° sobre la "i".
  - Fondo degradado lila pastel (#D4AEFA a #E7B8F9) con esquinas redondeadas.
- [x] Favicon oficial y archivo vectorial standalone `/assets/logo-byfio.svg`.
- [x] Botones de llamada a la acciÃ³n con gradiente oficial de marca (#A855F7 a #EC4899).
- [x] ActualizaciÃ³n de la paleta extendida en Tailwind CSS (`fio-brand`, `fio-dark`, `fio-blue`, `fio-yellow`).

### VersiÃ³n 1.2.0 - FacturaciÃ³n RÃ¡pida por NÃºmero de Orden & ReporterÃ­a de Caja
- [x] MÃ³dulo de FacturaciÃ³n RÃ¡pida (`QuickBillingSection`): BÃºsqueda instantÃ¡nea por nÃºmero de orden (#FIO-1001 / 1001) que jala automÃ¡ticamente todos los datos del cliente, productos y desglose financiero.
- [x] MÃ³dulo de Registro de Caja & ReporterÃ­a (`CashRegisterReports`): Ventas del dÃ­a, ganancias netas estimadas (Ventas - Costos de insumos), pedidos atendidos en la semana y pedidos pendientes de despacho.
- [x] Desglose de canales de cobro: Ventas totales vÃ­a SINPE MÃ³vil (6400-4640) vs Transferencias bancarias.
- [x] Acta de Cierre de Caja Diario (`DailyClosingModal`): Comprobante oficial imprimible y exportable con botÃ³n de envÃ­o directo a WhatsApp.
- [x] Barra de PestaÃ±as de NavegaciÃ³n del Panel Admin (`AdminTabs`): PestaÃ±as dedicadas para Pedidos & Alisto QR, FacturaciÃ³n RÃ¡pida, Inventario y Caja & Reportes.

### VersiÃ³n 1.1.0 - MÃ³dulo de Alta de Productos & Filtros de CategorÃ­a en Inventario
- [x] BotÃ³n de alta prominente `+ Agregar Producto al Inventario` en la tabla de control WMS.
- [x] Modal completo `NewProductModal` con campos completos y autogenerador de SKU.
- [x] Barra de Filtros de CategorÃ­as dinÃ¡micas en la tabla de inventario.
- [x] Realce visual del botÃ³n `Iniciar Alisto con EscÃ¡ner QR`.

### VersiÃ³n 1.0.0 - Lanzamiento Inicial E-commerce & WMS Picking QR
- [x] Identidad de Marca `by.fio` y selector dual Tienda / Admin WMS.
- [x] Mascota animada con video oficial (`ESTRELLA BYFIO.mp4`).
- [x] CatÃ¡logo de 5 Talleres Creativos oficiales y Tienda con stock en tiempo real.
- [x] Checkout SINPE MÃ³vil y ordenes FIFO.
- [x] Alisto guiado paso a paso con escaneo QR y sonidos Web Audio API.
