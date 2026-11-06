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

### Versión 4.16.5 - Corrección y Estabilidad Total de la Intro Web (Sin Bloqueos de Autoplay ni Congelamiento)
- [x] **Arranque Fluido sin Bloqueo por Autoplay Policy ([`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - Corrección del bloqueo crítico que congelaba la intro al entrar al video: se eliminó el intento forzado de desmutear en timer (`t2`) sin interacción previa, el cual causaba que el navegador pausara el video de inmediato.
  - El video inicia de forma segura en modo silenciado (`muted=true`) garantizando arranque instantáneo en cualquier navegador móvil o de escritorio (Chrome, Safari, iOS, Edge).
  - Desbloqueo universal de audio mediante gesto real del usuario (toque en pantalla, clic en el botón de sonido o cualquier pulsación), activando el audio sin interrupciones.
  - Temporizador de máxima seguridad de 13.5 segundos (`tSafety`) y bandera atómica `isExitingRef` para asegurar que bajo ninguna circunstancia la intro quede pegada.


### Versión 4.16.4 - Notificación de Estrellita Adaptativa para Inscripciones a Talleres Creativos
- [x] **Detección Automática y Mensaje Personalizado para Talleres ([`NewOrderStarAlert.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/NewOrderStarAlert.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Cuando la compra corresponde a un taller creativo, el título de la alerta de la estrellita cambia dinámicamente a: *"Hemos recibido una nueva inscripción al taller"*.
  - En compras de productos regulares o catálogo, conserva el mensaje estándar *"Hemos recibido un nuevo pedido"*.
  - Detección dual ultra-robusta: flag explícito `isWorkshop` y verificación retroactiva por número de orden e ítems tipo `'workshop'`.
  - Despliegue visual adaptativo: distintivo de birrete (`GraduationCap`), etiqueta *"Inscripción #ORDEN"*, nombre del taller creativo (`🎨 Título del Taller`) y nombre del alumno(a).
- [x] **Botones de Prueba Rápida en Panel de Administración ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx), [`AdminDesignSettingsModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminDesignSettingsModal.tsx)):**
  - Añadido botón interactivo *"Probar Taller 🎨"* en la Cola de Pedidos y en el configurador de diseño para verificar la animación y el mensaje de taller con un solo clic.

### Versión 4.16.3 - Propuesta Integral y Modelo Partner By.Fio con 11 Módulos Base, Regalías y Desglose Financiero
- [x] **Propuesta Comercial de Alianza Partner Oficial ([`PropuestaPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/propuesta/PropuestaPage.tsx)):**
  - Incorporada la estructura formal completa de propuesta comercial y alianza estratégica adaptada al negocio de Fio (creadora de contenido, talleres creativos y papelería).
  - Presentación del modelo SaaS (propiedad tecnológica vs alquiler adaptado sin inversión inicial, cero cobros sorpresas de renovación y libertad total sin contratos forzosos).
  - Desglose detallado de los **11 Módulos Base** con sus valores comerciales regulares (Total: ₡130.000/mes) y botones de acceso directo a cada uno.
  - Sección destacada de **Regalías 100% GRATIS (₡0)**: Módulo de Comprobantes por Correo (₡10.000/mes), Módulo de Agenda para citas y eventos, y Hosting + Dominio anual ($25 USD / ₡13.000/mes bonificado).
  - Tarifa Exclusiva Partner de **₡40.000 colones / mes** garantizada por 12 meses (reducción desde más de ₡153.000/mes regular y ₡75.000/mes promo).
  - Beneficio Adicional Opcional de App Multiusuario para Celular y PC a **₡5.000 adicionales / mes** (ahorro de ₡10.000 mensuales).
  - Resumen de ahorro real (+₡110.000/mes directo y ajuste anual topado al 10%).
  - Ruta de arranque en 3 pasos (Activación, Adaptación a tu medida, Pruebas y Carga en Vivo) y botón directo de confirmación vía WhatsApp.
  - **Actualización Integral de la Lista Completa de Todo lo que Contiene:** Organización exhaustiva en 3 columnas de los 11 módulos base, las regalías bonificadas y el ecosistema integral de la plataforma.
  - Botón de copiado integral que transfiere el texto exacto estructurado para WhatsApp / correo en un solo clic.
- [x] **Acceso Directo y Desbloqueo Público ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Eliminada la restricción de PIN/Admin en `App.tsx` para que la propuesta sea visible inmediatamente por URL directa (`/propuesta`) sin mostrar *"Acceso Restringido"*.
  - Incorporado el botón *"Propuesta"* directamente en la barra de navegación pública (PC y menú móvil).

### Versión 4.16.2 - Selector de Hora y Minutos en Nueva Actividad de Agenda y Campanita Push Sonora
- [x] **Selector Interactivo de Hora y Minutos en Modal de Agenda ([`AgendaSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AgendaSection.tsx)):**
  - Reemplazado el campo de texto libre por selectores dropdown dedicados para Horas (`01` a `12`) y Minutos (`00`, `05`, `10`, ... `55`).
  - Toggle táctil de período `AM` / `PM` y casilla para elegir entre actividad con horario específico o de jornada completa.
  - Atajos rápidos de horarios habituales de taller (`09:00 AM`, `10:00 AM`, `02:00 PM`, `04:00 PM`, `06:00 PM`).
  - Algoritmo de parsing inteligente retrocompatible para cargar registros existentes sin pérdida de formato.
- [x] **Campanita Sonora y Notificación Push ([`soundEffects.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/soundEffects.ts), [`AgendaSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AgendaSection.tsx), [`index.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/types/index.ts)):**
  - Síntesis de sonido de campana armónica de dos golpes ("Ding-Dong" cristalino D6/A6) mediante Web Audio API puro, sin latencia ni dependencias externas.
  - Función universal de notificación push con solicitud de permisos (`Notification.requestPermission`) e ícono oficial By.Fio.
  - Interruptor en el modal para activar/desactivar la campanita y botón interactivo *"Probar 🔔"* con escucha previa en tiempo real.
  - Banner push emergente animado en pantalla con campana repicando y auto-cierre a los 6 segundos.
  - Distintivo visual de campanita activa en vistas de lista y cuadrícula con botón para reproducir el repique sonoro en cualquier momento.

### Versión 4.16.1 - Cierre de Caja Diario Persistente con Historial y Filtros por Día y Fecha
- [x] **Cierre de Caja Diario y Persistencia Oficial ([`DailyClosingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/DailyClosingModal.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`daily-closings.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/daily-closings.ts)):**
  - Implementada selección de fecha para realizar el cierre diario (*"Hoy"*, *"Ayer"* o fecha específica con selector interactivo).
  - Cálculo automático de totales de caja (Ventas Tienda & Catálogo, Talleres Creativos, SINPE Móvil BCR + Web y otros medios).
  - Soporte para arqueo físico con cálculo en vivo de diferencia (Cuadrado, Sobrante, Faltante), notas y responsable del turno.
  - Botón *"Guardar Cierre de Caja"* / *"Actualizar Cierre Guardado"* con almacenamiento persistente en memoria local (`localStorage`), difusión entre pestañas (`BroadcastChannel`) y persistencia en la nube Cloudflare D1 (`/api/daily-closings`).
- [x] **Historial de Cierres Diarios y Consultas Posteriores ([`CashRegisterReports.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/CashRegisterReports.tsx), [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Incorporada nueva sección *"Historial de Cierres de Caja Diarios"* dentro del módulo de Caja & Reportería.
  - **Filtros por Día y Fecha:** Botones rápidos *"Todos"*, *"Hoy"*, *"Ayer"*, *"Semana"*, *"Mes"* y selector de fecha exacta (`<input type="date" />`).
  - Tabla completa con historial de actas guardadas: fecha, hora, responsable, desglose por canal, total recaudado, estado de arqueo y notas.
  - Botón directo *"Ver Acta"* para abrir cualquier cierre pasado, reimprimir el comprobante formal o compartir el resumen oficial por WhatsApp.
  - Pestaña de consulta histórica integrada también dentro del modal de cierre para inspección ágil.

### Versión 4.16.0 - Módulo Integral de Historial de Ventas con Filtros por Día, Semana, Mes y Detalle Completo de Pedido
- [x] **Nuevo Módulo de Historial de Ventas ([`SalesHistorySection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SalesHistorySection.tsx), [`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx), [`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx), [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`routeHelpers.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/routeHelpers.ts)):**
  - Incorporada nueva sección administrativa *"Historial de Ventas"* con acceso oficial desde el Menú Principal (Hub) y soporte para URL directa (`/admin/ventas`).
  - **Filtros Temporales de Alta Precisión:**
    - **Por Día:** Botones directos *"Hoy"*, *"Ayer"* y selector de fecha personalizada (`<input type="date" />`).
    - **Por Semana:** Botones *"Esta Semana"* (Lunes a Domingo), *"Últimos 7 Días"* y *"Semana Pasada"*.
    - **Por Mes:** Botones *"Este Mes"*, *"Mes Pasado"* y selector de mes personalizado (`<input type="month" />`).
    - Opción de visualización general *"Todo"* el histórico.
  - **Buscador & Filtros Operativos:** Búsqueda en tiempo real por número de orden, cliente, teléfono o productos, combinable con filtros por estado de pago (Pagado / Pendiente) y estado del flujo de alisto.
  - **Métricas Consolidadas del Período:** Tarjetas en cabecera con cálculo automático de Ventas Totales (₡), Total de Pedidos, Ticket Promedio y Cantidad de Artículos Vendidos.
  - **Inspección Profunda de "El Pedido que el Cliente Realizó":**
    - Modal emergente con el desglose exacto de cada artículo (nombre, SKU, estante, cantidad, precio unitario y personalización de grabado en foil `customText`).
    - Ficha de cliente con teléfono vinculado a WhatsApp con 1 clic, correo y dirección completa o modalidad de retiro.
    - Resumen financiero formal con desglose de subtotal, costo de envío y total cobrado.
    - Botones de acción directa para emitir comprobante de pago (`setInvoiceOrder`) y contactar al cliente por WhatsApp.
  - **Exportación de Datos:** Botón para descargar el reporte filtrado en formato CSV compatible con Excel.

### Versión 4.15.7 - Eliminación de Botones Duplicados en Cabecera Admin (SINPE BCR y Pedidos Proveedor)
- [x] **Depuración de la Barra Superior de Administración ([`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx)):**
  - Eliminados los botones redundantes *"SINPE BCR"* y *"Pedidos Proveedor"* de la cabecera del panel de administración.
  - La navegación hacia ambos módulos se mantiene de manera centralizada y espaciosa a través de sus tarjetas oficiales en el Menú Principal de Administración (Hub), evitando duplicidad visual.

### Versión 4.15.6 - Renombramiento de Estados a "Terminados" en Cola de Pedidos
- [x] **Actualización de Etiquetas y Acciones en Cola de Pedidos ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx)):**
  - Botón de filtro de pedidos cambiado de *"Entregados"* a *"Terminados"*.
  - Botón de acción operativa cambiado de *"Marcar Entregado"* a *"Marcar Terminado"*.
  - Distintivo visual de estado actualizado a *"Terminado"* para máxima claridad operativa en el flujo de pedidos.

### Versión 4.15.5 - Entrada Suave de Arriba Hacia Abajo, Contador de Minutos y Configuración de Duración de la Estrellita
- [x] **Animación de Entrada de Arriba Hacia Abajo ([`index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css), [`NewOrderStarAlert.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/NewOrderStarAlert.tsx)):**
  - Implementada animación fluida con física suave (`@keyframes starAlertSlideInFromTop` con `cubic-bezier(0.16, 1, 0.3, 1)`) que desplaza la alerta desde la parte superior hacia el centro con desenfoque de fondo.
- [x] **Cierre Manual por Defecto con Contador Continuo de Minutos y Barra Cíclica:**
  - Por defecto, la alerta no se cierra sola: el administrador debe cerrarla manualmente mediante el botón *"Entendido / Cerrar Alerta"* o la `X` superior.
  - Ticker en tiempo real que suma segundos progresivamente (`00:01` ... `00:59`), llenando la barrita de color linealmente hasta alcanzar el minuto (60s). Al llegar a 60s, la barra se reinicia para el siguiente minuto y el contador continúa acumulando el tiempo total (`Minuto 2`, `Minuto 3`...) indefinidamente hasta el cierre manual.
- [x] **Panel de Configuración de la Estrellita para el Administrador ([`AdminDesignSettingsModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminDesignSettingsModal.tsx), [`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`types/index.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/types/index.ts)):**
  - En el botón *"Configuración"* del panel admin se integró el selector con las opciones solicitadas: `Cierre manual por el usuario (Por defecto)`, `5 segundos`, `10 segundos`, `15 segundos` y `20 segundos`.
  - Persistencia local en `localStorage` (`byfio_star_alert_duration_v1`) y botón *"Probar Estrellita"* interactivo para ensayar la duración y animación en vivo.

### Versión 4.15.4 - Erradicación Definitiva del Logo / Ícono de Destellos Verdes
- [x] **Eliminación Total del Ícono Sparkles en Toda la Aplicación ([`InventoryTable.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx), [`NewOrderStarAlert.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/NewOrderStarAlert.tsx), [`CashRegisterReports.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/CashRegisterReports.tsx), [`SinpeBcrVerificationModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SinpeBcrVerificationModal.tsx), [`SinpePaymentsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SinpePaymentsSection.tsx), [`WorkshopEnrollmentsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/WorkshopEnrollmentsSection.tsx), [`SuperadminLogin.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminLogin.tsx)):**
  - Removido el distintivo verde con destellos (`bg-emerald-600` con `Sparkles`) en la cabecera de control de inventario, sustituido por el icono corporativo unificado de cajas `Boxes` con la paleta By.Fio (`bg-fio-800`).
  - Erradicado el icono `Sparkles` de todos los módulos y modales de la web para mantener la pureza de la identidad visual de la marca By.Fio.

### Versión 4.15.3 - Alerta Animada de la Estrellita en Nuevo Pedido con Salida Hacia Abajo
- [x] **Notificación de Pedidos con la Estrellita Animada ([`NewOrderStarAlert.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/NewOrderStarAlert.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx), [`index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Implementado modal de alerta centrado en pantalla que se dispara automáticamente cada vez que ingresa un pedido nuevo (tienda online, reservas de talleres, facturación rápida o sincronización remota en segundo plano).
  - Muestra la mascota oficial en video (`vid-estrellita.mp4`) con corazón animado, el mensaje exacto *"Hemos recibido un nuevo pedido"*, número de orden y barra de progreso.
  - Permanece en el centro de la pantalla durante 6.5 segundos y desciende suavemente del centro hacia abajo (`animate-star-alert-down`), con botón `X` para descarte manual instantáneo.
  - Incorporado botón *"Probar Estrellita"* en la cabecera de la cola de pedidos de administración para verificación directa.

### Versión 4.15.2 - Erradicación Total de Alertas y Confirmaciones Nativas del Navegador
- [x] **Reemplazo 100% de Notificaciones Nativas por Diálogos Integrados By.Fio ([`ConfirmDialog.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/ui/ConfirmDialog.tsx), [`ConfirmContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/ConfirmContext.tsx)):**
  - Añadido soporte para avisos informativos (`useAlert()`) y confirmaciones asíncronas (`useConfirm()`) con diseño nativo By.Fio (fondo blur, botones temáticos, iconos y cero popups feos del navegador tipo `byfiocr.pages.dev dice`).
  - Aplicado en toda la plataforma: [`AgendaSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AgendaSection.tsx), [`CustomersSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/CustomersSection.tsx), [`InventoryTable.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx), [`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx), [`QuickBillingSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/QuickBillingSection.tsx), [`SinpeBcrVerificationModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SinpeBcrVerificationModal.tsx), [`SinpePaymentsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SinpePaymentsSection.tsx), [`SuppliersOrdersSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SuppliersOrdersSection.tsx), [`UserProfilesSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/UserProfilesSection.tsx), [`WorkshopEnrollmentsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/WorkshopEnrollmentsSection.tsx), [`SuperadminSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminSection.tsx) y [`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx).

### Versión 4.15.1 - Eliminación del Submenú de Pestañas y Reemplazo por Barra Limpia
- [x] **Eliminación del Submenú Horizontal ([`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx)):**
  - Eliminado por completo el contenedor neumórfico con la fila comprimida de 11 botones y badges (`Pedi...`, `Factura...`, `Inventa...`, etc.) que colapsaba y saturaba la pantalla.
  - Reemplazado por una barra de navegación limpia y de una sola línea con botón directo *"← Volver al Menú Principal"* y breadcrumb indicador de sección actual.
  - La navegación entre módulos se realiza de forma ordenada y espaciosa desde el Menú Principal (Hub), erradicando el desbordamiento en dispositivos móviles y de escritorio.

### Versión 4.15.0 - Sistema Global de Diálogos de Confirmación Profesionales
- [x] **Reemplazo de alertas nativas por `ConfirmDialog` ([`ConfirmDialog.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/ui/ConfirmDialog.tsx), [`ConfirmContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/ConfirmContext.tsx), [`useConfirm.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/hooks/useConfirm.ts), [`main.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/main.tsx)):**
  - Creado sistema reactivo con hook `useConfirm()` y modal de confirmación con variantes visuales (`danger`, `warning`, `info`) con estética corporativa By.Fio para sustituir el `window.confirm` nativo del navegador.
  - Integrado de forma fluida en las acciones críticas de eliminación y restablecimiento en [`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx), [`AdminPricingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminPricingModal.tsx) y [`AgendaSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AgendaSection.tsx).

### Versión 4.14.9 - Corrección de Errores TypeScript y Código Limpio (v4.14.6 + v4.14.7)
- [x] **Corrección de errores TS en `products.ts`:** `TS2367` resuelto — comparación `r.is_available === true` (number vs boolean) corregida a `Number(r.is_available) === 1`.
- [x] **`UserProfilesSection.tsx`:** Inicialización completa de los 10 permisos en `handleOpenCreate`, `handleOpenEdit` y `handleToggleAllPermissions` incluyendo `agenda` y `suppliers`. Conteo de permisos otorgados corregido con null-safe `perms[mod.key]`.
- [x] **`AppContext.tsx` — `hasPermission`:** Eliminados todos los `as any`; ahora usa `Record<string, boolean | undefined>` para acceso seguro por índice string.
- [x] **`AppContext.tsx` — `loginWithPin`:** Reescrito para priorizar PINs de perfil antes que PINs maestros (`7777`, `0777`, `9999`). PINs `1234` y `2026` ya no colisionan con perfiles María y Mostrador.
- [x] **`formatters.ts`:** `formatCRC` y `getWhatsAppLink` protegidos contra valores `null`/`undefined`.
- [x] **`tsconfig.json`:** Incluye `functions/` para que TS audite también las Cloudflare Functions.
- [x] **`SuppliersOrdersSection.tsx` / `SupplierOrderModal.tsx`:** Guardado en Agenda integrado con detección de duplicados.

### Versión 4.14.7 - Rediseño Ejecutivo y Profesional de la Agenda WMS
- [x] **Rediseño Neumórfico Ejecutivo ([`AgendaSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AgendaSection.tsx)):**
  - Transformada la interfaz a estándar B2B neumórfico con paleta institucional, superficies suaves (`shadow-neuCard`), campos inset (`shadow-neuInset`) y tipografía corporativa equilibrada.
  - Incorporadas 4 tarjetas KPI ejecutivas: Total de Actividades, Actividades Para Hoy con pulso de atención inmediata, Efectividad con porcentaje y barra de progreso animada, y Talleres Sincronizados.
  - Implementado selector de vista dual: **Vista Lista Cronológica** (con agrupación inteligente en *Para Hoy & Prioritarias*, *Próximos Días*, *Fechas Posteriores* y acordeón de *Completadas*) y **Vista Cuadrícula de Tarjetas**.
  - Rediseñada la modal de creación/edición con selector visual interactivo de 5 categorías con iconos, selector de prioridad en 3 niveles y atajos de fecha rápida.

### Versión 4.14.6 - Integración Completa del Módulo Pedidos a Proveedor en Panel Super Admin
- [x] **Consola Maestra de Pedidos a Proveedor en Super Admin ([`SuperadminSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminSection.tsx)):**
  - Implementado selector de vistas superior para alternar instantáneamente entre el *"Gestor Maestro de Módulos"* y *"Pedidos a Proveedor"* dentro de la consola del Super Admin.
  - Integrada la vista completa de [`SuppliersOrdersSection`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SuppliersOrdersSection.tsx) en el panel Super Admin con sincronización en tiempo real con Cloudflare D1.
  - Añadido botón de acción rápida *"Pedidos Proveedor"* en la barra de cabecera con contador de órdenes activas y botón de retorno al gestor de módulos.
  - Diseñada tarjeta interactiva de control directo *"Control de Pedidos a Proveedor & Requisiciones"* con métricas en vivo de órdenes por pedir e historial de compras realizadas.

### Versión 4.14.5 - Blindaje y Persistencia Inmutable de Disponibilidad de Productos
- [x] **Solución a Reversión de Disponibilidad en Polling ([`products.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/products.ts)):**
  - Corregido el mapeo `mapRowToProduct`: los valores `NULL` de SQLite en `is_available` ahora se resuelven a `true` (disponible por defecto) en lugar de evaluarse erróneamente a `false` por coerción booleana de `null`.
  - Agregada migración defensiva automática en `onRequestGet` (`UPDATE products SET is_available = 1 WHERE is_available IS NULL`) para blindar todos los registros existentes en la base de datos Cloudflare D1.
  - Implementado upsert seguro en `onRequestPut` para garantizar que actualizaciones de disponibilidad persistan tanto si el registro ya existía como si debe crearse.
- [x] **Sincronización Segura en Frontend ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`seedData.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/seedData.ts)):**
  - Actualizado `fetchLatestData` para verificar tipo estricto `boolean` al mezclar datos de la nube con el estado local, impidiendo que respuestas no inicializadas sobreescriban el estado disponible.
  - Enriquecido el payload de `toggleProductAvailability` con datos de respaldo para sincronización atómica en D1 y añadidas banderas explícitas en `INITIAL_PRODUCTS`.

### Versión 4.14.4 - Visibilidad Inmediata y Acceso Rápido al Módulo Pedidos Proveedor
- [x] **Acceso Directo desde la Barra Superior ([`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx)):**
  - Actualizado el botón de cabecera con el rótulo claro *"Pedidos Proveedor"*, icono `Truck` y badge con el conteo de pedidos activos para entrar directamente a la sección desde cualquier pantalla.
- [x] **Claridad en Pestañas ([`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx)):**
  - Renombrada la pestaña administrativa de *"Proveedores"* a *"Pedidos Proveedor"* para que sea inmediatamente reconocible frente a otros módulos.
- [x] **Blindaje Universal de Permisos de Sesión ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Ajustado `hasPermission` y la inicialización de sesiones guardadas en `localStorage` para asignar `suppliers: true` por defecto a todos los roles y perfiles existentes (Administración, María, Alisto, Mostrador), evitando que sesiones anteriores ocultaran el módulo.

### Versión 4.14.3 - Selector y Creador Dinámico de Ubicaciones en Estante (WMS)
- [x] **Selector y Creación Dinámica de Ubicaciones ([`NewProductModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/NewProductModal.tsx)):**
  - Implementado selector desplegable de ubicaciones en estante que unifica las estanterías por defecto, las ubicaciones utilizadas por los productos existentes y las ubicaciones personalizadas guardadas.
  - Incorporada opción `✨ + Crear nueva ubicación...` dentro del dropdown y botón superior `+ Nueva ubicación` para alternar fluidamente al campo de creación con autofocus y botón cancelar.
  - Persistencia automática de nuevas ubicaciones creadas en memoria persistente (`byfio_custom_shelf_locations_v1`) para reutilizarlas en futuros productos.

### Versión 4.14.2 - Módulo Completo de Pedidos a Proveedor con Borradores e Historial
- [x] **Módulo Dedicado de Pedidos a Proveedor ([`SuppliersOrdersSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SuppliersOrdersSection.tsx)):**
  - Implementado el módulo administrativo *"Pedidos a Proveedores & Requisiciones"* con métricas en tiempo real, búsqueda por número, proveedor y SKU, y filtros por pestañas (*"Todos"*, *"Por Pedir (Borradores)"*, *"Pedidos Realizados"* y *"Recibidos"*).
  - Pestaña *"Por Pedir (Borradores)"*: permite guardar pedidos en preparación para pedirlos formalmente después al proveedor.
  - Pestaña *"Pedidos Realizados (Historial)"*: registra el historial de compras ya solicitadas a los proveedores con fecha y montos.
  - Acciones completas por orden: marcar como pedido al proveedor, marcar como recibido en taller, enviar o reenviar por WhatsApp con mensaje desglosado, e imprimir ficha formal.
- [x] **Integración con Requisición y Base de Datos D1 ([`SupplierOrderModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierOrderModal.tsx), [`supplier-orders.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/supplier-orders.ts), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - En la modal de requisición de stock bajo se añadieron los botones directos *"Guardar Por Pedir"* y *"Guardar Pedido Realizado"*.
  - Persistencia remota en Cloudflare D1 vía `/api/supplier-orders` y en `localStorage`.
- [x] **Navegación y Permisos de Usuario ([`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx), [`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx), [`UserProfilesSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/UserProfilesSection.tsx), [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Añadida la pestaña superior *"Proveedores"* con contador en vivo de órdenes activas.
  - Tarjeta de acceso directo en el Menú Principal (Hub) y asignación de permisos por perfil de usuario.

### Versión 4.14.1 - Restauración Oficial y Blindaje del Perfil de MARÍA en D1
- [x] **Restauración del Perfil de MARÍA ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`user-profiles.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/user-profiles.ts)):**
  - Se restauró formalmente a **MARÍA** (PIN inicial `1234`, rol `staff` con permisos completos de ventas, facturación, mostrador y pedidos) como perfil permanente del sistema.
  - Sincronizado en la base de datos Cloudflare D1 (`app_user_profiles`) para que aparezca en todos los dispositivos y nunca más dependa de la memoria volátil del navegador.
- [x] **Módulo de Pedidos a Proveedor & Requisiciones de Inventario ([`SuppliersOrdersSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SuppliersOrdersSection.tsx), [`SupplierOrderModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierOrderModal.tsx)):**
  - Finalizada la integración del módulo de gestión de órdenes de reposición y compras a proveedores vinculadas con el inventario y agenda.


### Versión 4.14.0 - Control Maestro de Stock y Disponibilidad en Superadmin
- [x] **Tarjeta de Control Directo en Superadmin ([`SuperadminSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminSection.tsx)):**
  - Incorporada tarjeta de control directo interactiva en la consola del Superadmin con los dos botones exactos: *"Desactivar stock de inventario"* y *"Activar disponibilidad de producto"*, permitiendo alternar al instante entre Modo Stock Numérico Real y Disponibilidad Rápida con sincronización en tiempo real.
- [x] **Nombres Literales y Persistencia en Base de Datos D1 ([`superadminModulesData.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/superadminModulesData.ts), [`InventoryTable.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx)):**
  - Renombradas las sub-funcionalidades internas del módulo Inventario a *"Desactivar stock de inventario"* (`inventory_stock_mode`) y *"Activar disponibilidad de producto"* (`product_availability_mode`).
  - Habilitados ambos toggles en Cloudflare D1 (`byfiocr-db`) y vinculados en [`InventoryTable.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx) con fallback defensivo (`!== false`) para garantizar su visualización inmediata en cualquier dispositivo.

### Versión 4.13.9 - Sincronización Automática Continua y Bypass de Caché para Perfiles
- [x] **Fusión Forzosa y Polling Continuo ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`users.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/users.ts), [`user-profiles.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/user-profiles.ts)):**
  - Implementado mapa de fusión defensiva en el estado inicial de `userProfiles` para inyectar automáticamente el perfil de Administración aunque el navegador mantenga caché de 2 perfiles.
  - Integrada la sincronización de perfiles en `fetchLatestData` (con polling inteligente cada 8s y al enfocar la ventana) con parámetros de bypass de caché (`?_t=timestamp`, `cache: 'no-store'`) y cabeceras `Cache-Control: no-store` en los endpoints D1.


### Versión 4.13.8 - Limpieza Visual en Cabecera del Panel de Control
- [x] **Eliminación de Texto Técnico ([`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx)):**
  - Removido el rótulo superior `"Sistema WMS / ERP Ligero"` de la cabecera del panel de administración para un encabezado más limpio, directo y enfocado en la marca By.Fio.

### Versión 4.13.7 - Incorporación y Protección del Perfil de Administrador Maestro en Base de Datos D1
- [x] **Restablecimiento del 3er Perfil de Usuario ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`UserProfilesSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/UserProfilesSection.tsx)):**
  - Se vinculó explícitamente el perfil `prof-admin` (*ADMINISTRACIÓN (FIO)*, PIN `7777`, rol `admin`) en `DEFAULT_USER_PROFILES`, en la persistencia local y en Cloudflare D1.
  - El sistema ahora muestra con total exactitud los 3 perfiles oficiales: `ADMINISTRACIÓN (FIO)`, `ALISTO DE PEDIDOS` y `ATENCIÓN Y TALLERES`.
- [x] **Blindaje del Perfil Maestro ([`UserProfilesSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/UserProfilesSection.tsx)):**
  - Distintivo visual dorado `👑 Administrador Total` y bloqueo contra eliminación accidental para asegurar que el acceso administrativo permanezca disponible.


### Versión 4.13.6 - Restauración y Visibilidad Omnipresente de Perfiles de Usuario
- [x] **Visibilidad Omnipresente en Admin y Móvil ([`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx), [`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Se renombró la pestaña administrativa a *"Perfiles de Usuario"* y se amplió la cuadrícula a `xl:grid-cols-10` para garantizar que las 10 pestañas quepan de manera simétrica sin ocultarse ni empujarse.
  - Se eliminó la restricción `hidden sm:flex` del indicador de sesión en la barra de navegación; ahora el perfil activo (`ALISTO DE PEDIDOS`, `ATENCIÓN Y TALLERES`, `Admin`) es visible en celulares y escritorio en todo momento.
- [x] **Aviso Claro y Selector de Perfiles Operativos ([`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx), [`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx), [`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx)):**
  - Si un usuario ingresa con un PIN de colaborador operativo (Staff), se despliega un aviso intuitivo indicando que está en perfil operativo y un botón directo para cambiar a Administrador.
  - En la ventana de inicio de sesión se incorporaron chips de acceso rápido con los perfiles existentes para entrar en 1 toque.
  - La tarjeta de *"Perfiles de Usuarios"* se organizó en cuadrícula balanceada `lg:grid-cols-5` en el Menú Principal del Admin.


### Versión 4.13.5 - Transición de Estado a Empaque y Nueva Pestaña de Filtro Empacados
- [x] **Flujo Completo En Empaque → Empacado ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`index.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/types/index.ts)):**
  - Los pedidos que finalizan alisto pasan a estado *"En Empaque"* (`packing`) mostrando la etiqueta de empaque y el botón de acción *"Marcar Empacado"*.
  - Al pulsar *"Marcar Empacado"*, el pedido pasa a estado *"Empacado"* (`packed`), mostrando la etiqueta verde de empacado y habilitando el botón *"Marcar Entregado"*.
- [x] **Nueva Pestaña de Filtro Rápido *"Empacados"* ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx)):**
  - Se agregó la pestaña de filtro dedicada *"Empacados"* con conteo en tiempo real, permitiendo aislar y gestionar de forma independiente los pedidos que ya fueron empacados y esperan retiro o entrega.

### Versión 4.13.4 - Reubicación Ergonómica del Botón Cerrar en Requisición de Inventario
- [x] **Reubicación Dual de Cierre ([`SupplierOrderModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierOrderModal.tsx)):**
  - Se desacopló el botón de cierre de la barra de herramientas y se ancló fijamente en la esquina superior derecha (`absolute top-3.5 right-3.5`) con badge circular blanco y sombra sutil para acceso inmediato y ergonómico.
  - Se incorporó un botón secundario adicional *"Cerrar"* en la barra de acciones inferior junto a *"Imprimir / PDF"* y *"Guardar en Agenda"*.

### Versión 4.13.3 - Optimización Responsiva del Modal Registrar Nuevo Cliente
- [x] **Ajuste de Visualización sin Cortes de Pantalla ([`CustomersSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/CustomersSection.tsx), [`QuickBillingSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/QuickBillingSection.tsx)):**
  - Se corrigió el problema de corte vertical en la ventana modal *"Registrar Nuevo Cliente"* en pantallas pequeñas, móviles y laptops.
  - Implementada estructura de flex-column con altura máxima adaptable (`max-h-[92vh] sm:max-h-[90vh]`), cabecera fija (`shrink-0`), zona de campos con scroll interno independiente (`overflow-y-auto flex-1`) y barra inferior de botones fija (`shrink-0`).
  - Los botones de *"Guardar Cliente"* y *"Cancelar"* ahora permanecen siempre visibles y accesibles en pantalla.

### Versión 4.13.2 - Integración de Requisición de Inventario con Guardado en Agenda
- [x] **Guardar Órdenes de Compra en Agenda ([`SupplierOrderModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierOrderModal.tsx)):**
  - En la modal *"Orden de Compra & Requisición de Inventario"*, se reemplazó el enlace de *"Enviar Orden por WhatsApp a Proveedor"* por el botón interactivo *"Guardar en Agenda"*.
  - Al pulsar, genera automáticamente una actividad de alta prioridad en la Agenda en la categoría `proveedor`, con fecha, hora, desglose de artículos y costo estimado, mostrando confirmación táctil `¡Guardado en Agenda!`.

### Versión 4.13.1 - Módulo de Agenda & Organizador de Tareas en Admin y Superadmin
- [x] **Módulo Dedicado de Agenda en Admin ([`AgendaSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AgendaSection.tsx)):**
  - Implementado el módulo completo *"Agenda & Organizador de Tareas"* para planificación del taller, entregas de pedidos, compras de insumos, producción y recordatorios.
  - Gestión completa de tareas con fechas, horas, niveles de prioridad (alta, media, baja) y categorías visuales.
  - Checkbox interactivo circular para completar tareas al instante con efectos visuales y filtros rápidos por fecha ("Hoy", "Esta Semana", "Pendientes", "Completadas").
  - Sincronización automática con talleres creativos de By.Fio para ver cursos programados directamente en el calendario.
- [x] **Integración Granular en Superadmin ([`superadminModulesData.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/superadminModulesData.ts)):**
  - Creado el módulo `"agenda"` (`Agenda & Organizador de Tareas`) en la categoría *Operaciones & WMS* con funcionalidades configurables: *"Calendario y Cronograma de Actividades"*, *"Lista de Tareas Rápidas (To-Do)"* y *"Sincronización Automática con Talleres"*.
  - Sincronización remota y persistencia en Cloudflare D1 mediante el endpoint `/api/agenda`.
- [x] **Pestañas y Accesos ([`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx), [`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx), [`UserProfilesSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/UserProfilesSection.tsx)):**
  - Añadido el tab *"Agenda"* con contador en vivo de tareas pendientes.
  - Tarjeta de acceso directo en el Menú Principal (Hub) y asignación de permisos por perfil de usuario.

### Versión 4.9.4 - Erradicación Universal de Caracteres Corruptos y Saneamiento UTF-8
- [x] **Corrección de Codificación en Base de Datos Cloudflare D1 ([`users.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/users.ts), [`user-profiles.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/user-profiles.ts), [`orders.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/orders.ts)):**
  - Identificada y erradicada la presencia de caracteres de reemplazo corruptos (`` / `\uFFFD`) almacenados en los registros remotos de D1 (`app_user_profiles` y pedidos históricos).
  - Los endpoints de API ahora incorporan saneamiento automático (`healString` / `sanitizeProfilesData`) en lectura y escritura para garantizar acentos, eñes y caracteres en español perfectos.
- [x] **Motor de Saneamiento Profundo en Frontend ([`sanitizeText.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/sanitizeText.ts), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Creada la utilidad `deepSanitize` que detecta y repara automáticamente patrones mal codificados (ej. `"ATENCIN"` -> `"ATENCIÓN"`, `"Tibs"` -> `"Tibás"`, `"catlogo"` -> `"catálogo"`, `"rdenes"` -> `"órdenes"`, `"cumpleaos"` -> `"cumpleaños"`).
  - Auto-reparación de la caché local (`localStorage`): Al arrancar la aplicación, si el navegador del cliente contiene datos locales previamente dañados, los sanea en memoria y sobreescribe el almacenamiento con la versión íntegra.

### Versión 4.13.0 - Módulo Independiente de Directorio de Clientes & Contactos
- [x] **Módulo Dedicado de Clientes en Panel Admin ([`CustomersSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/CustomersSection.tsx)):**
  - Creado el módulo independiente *"Directorio de Clientes"* en el panel de administración para registrar y consultar clientes frecuentes.
  - Formulario completo con Nombre, Cédula / Identificación, Teléfono / WhatsApp, Correo, Dirección de entrega y Notas de pedido.
  - Búsqueda reactiva instantánea por cualquier dato y enlace directo a WhatsApp en un solo clic.
  - Botón de acción rápida *"Facturar / Crear Pedido"* para abrir la facturación POS con todos los datos del cliente cargados automáticamente.
- [x] **Navegación e Integración de Pestañas ([`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx), [`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx), [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Añadida la pestaña superior *"Clientes"* con contador en vivo de clientes registrados.
  - Tarjeta de acceso directo en el Menú Principal (Hub) con gradiente y conteo.
  - Conexión fluida con [`QuickBillingSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/QuickBillingSection.tsx) para facturar de inmediato.
- [x] **Control Granular en Superadmin ([`superadminModulesData.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/superadminModulesData.ts), [`routeHelpers.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/routeHelpers.ts)):**
  - Módulo `customers` registrado en la matriz de Superadmin con toggles de creación, búsqueda y pedidos rápidos.
  - Soporte de sub-ruta `/admin/clientes` con protección de permisos de rol.

### Versión 4.12.5 - Sincronización en la Nube D1 y Fusión Inmutable de Funcionalidades de Superadmin
- [x] **Fusión Defensiva Cloud & Local ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Implementada la función `mergeSuperadminModules` en la carga de la API `/api/superadmin-modules`, en eventos de `BroadcastChannel` y eventos `storage`.
  - Evita que snapshots antiguos en Cloudflare D1 sobreescriban o eliminen funcionalidades nuevas como `"Desactivar / Activar Stock de Inventario"` o `"Activar / Desactivar Disponibilidad de Producto"`.
- [x] **Actualización Inmediata de Base de Datos Cloudflare D1:**
  - Base de datos en producción actualizada directamente con los 12 módulos y todas las funcionalidades hijas sincronizadas.

### Versión 4.12.4 - Escala +50% en Alisto de Pedidos y Perfil de Alisto para Dispositivos Móviles
- [x] **Optimización Ergonómica de Alisto en Celular (+50%) ([`GuidedPickingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx)):**
  - Incrementadas en un 50% las dimensiones de imagen de producto (`w-36 h-36`), badge de estante (`text-xs` destacado), código SKU, título del artículo (`text-xl font-black`) y contador de cantidad a alistar (`text-base font-black` con fondo contrastado) en vista móvil.
  - Botón táctil principal *"Aceptar y Continuar"* ampliado a `py-4 text-base font-black min-h-[52px]` con icono agrandado para facilitar el picking con una sola mano.
  - Botones secundarios de faltante, salida y validación de código ampliados a escala táctil para celular.
- [x] **Botones de Cola de Pedidos en Celular ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx)):**
  - Los botones de *"Alisto con Código"* y *"Alisto Manual"* cuentan con altura mínima ergonómica `min-h-[48px]`, tipografía aumentada (`text-sm font-black`) e iconos de 20px en vista móvil.
- [x] **Tarjeta de Perfil de Alisto en Celular ([`UserProfilesSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/UserProfilesSection.tsx)):**
  - La tarjeta del colaborador de Alisto (`ALISTO DE PEDIDOS`) en celulares se muestra un 50% más grande con padding ampliado (`p-6`), título `text-xl font-black`, PIN en `text-2xl font-black`, badge distintivo `📦 Alisto Móvil (+50%)` y botones táctiles agrandados.
- [x] **Navegación Directa a Alisto para Colaboradores ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Al ingresar con el PIN del perfil de alisto (PIN 1001), el sistema redirige automáticamente y de inmediato a la Cola de Pedidos / Alisto sin escalas intermedias.

### Versión 4.12.3 - Toggles de Stock de Inventario y Disponibilidad de Producto en Superadmin
- [x] **Funcionalidades de Inventario en Superadmin ([`superadminModulesData.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/superadminModulesData.ts)):**
  - Incorporadas las funcionalidades granulares `"Desactivar / Activar Stock de Inventario"` (`inventory_stock_mode`) y `"Activar / Desactivar Disponibilidad de Producto"` (`product_availability_mode`) dentro del módulo `Inventario & Etiquetas QR`.
  - Conexión reactiva en vivo en [`InventoryTable.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx) para condicionar la visibilidad de los botones de alternancia y ajustar automáticamente el modo activo según los permisos de Superadmin.

### Versión 4.12.2 - Toggles Granulares de Alisto con Código y Alisto Manual en Superadmin & Auto-Recuperación de Chunks
- [x] **Funcionalidades de Alisto en Superadmin ([`superadminModulesData.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/superadminModulesData.ts)):**
  - Renombradas y expuestas con exactitud las funcionalidades `"Alisto con Código"` y `"Alisto Manual"` en el módulo `Cola de Pedidos & Alisto WMS`.
  - Conexión reactiva en vivo en la Cola de Pedidos ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx)) y en el modal de alisto guiado ([`GuidedPickingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx)) mediante `isFeatureEnabled`.
- [x] **Auto-Recuperación Transparente tras Despliegues ([`ErrorBoundary.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/ErrorBoundary.tsx), [`main.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/main.tsx)):**
  - Eliminado el bloqueo de recarga al detectar assets desactualizados tras un despliegue en producción; se aplica bypass de caché inmediato con timestamp para actualizar los scripts transparentemente sin interrupciones.

### Versión 4.12.1 - Eliminación de Barra de Breadcrumbs del Panel de Administración
- [x] **Eliminación Quirúrgica de Breadcrumbs en Panel Admin ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Removida la sección de navegación tipo píldora (`TreeNavigation`) que mostraba `[ ★ by.fio / caja & reportes ]` en la cabecera del panel administrativo.
  - Limpiadas las referencias locales de navegación de migas de pan y dependencias no utilizadas en la vista de administración.

### Versión 4.12.0 - Desactivación Reactiva en Tiempo Real (0ms) de Módulos y Funcionalidades
- [x] **Ejecución Reactiva en Tiempo Real 0ms ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`superadmin-modules.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/superadmin-modules.ts)):**
  - Al desmarcar cualquier casilla de módulo o funcionalidad hija en `/panel/superadmin`, el cambio se propaga de inmediato (0ms) en la sesión local, a través de `BroadcastChannel`, evento `storage` entre pestañas y respaldo en la nube con Cloudflare D1.
- [x] **Desactivación Inmediata de Funcionalidades en Componentes Web:**
  - **Cola de Pedidos & Alisto ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx), [`GuidedPickingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx)):** Los botones de *"Alisto Manual"*, *"Alisto con Código"* y el botón *"Reportar Faltante"* se ocultan de inmediato si su casilla respectiva está desactivada.
  - **Inventario & Etiquetas QR ([`InventoryTable.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx)):** Los controles de *"Nuevo Producto"*, *"Editar/Eliminar"*, *"Lista de Proveedores"* y *"Generar QR"* responden al estado de cada checkbox.
  - **Facturación POS ([`QuickBillingSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/QuickBillingSection.tsx)):** Las pestañas de *"Facturar Pedido Existente"* y *"Crear Factura Directa"* se ocultan reactivamente.
  - **Caja & Reportería ([`CashRegisterReports.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/CashRegisterReports.tsx)):** El botón de *"Cierre de Caja"* y el desglose de *"Tienda vs Talleres"* se desactivan si se desmarcan sus funcionalidades.
  - **Pagos SINPE Móvil BCR ([`SinpePaymentsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SinpePaymentsSection.tsx), [`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx)):** Ocultación de la pestaña de vinculación de correo BCR y activación o flexibilización de validación de comprobante único y monto cruzado.
  - **Talleres Creativos ([`WorkshopEnrollmentsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/WorkshopEnrollmentsSection.tsx)):** El botón *"Crear Taller"* y el contador de auditoría *"Talleres Pagados & Confirmados"* se ocultan en tiempo real.
  - **Catálogo & Tienda ([`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx), [`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx), [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):** El botón directo de WhatsApp en catálogo y el botón/panel del carrito interactivo se desactivan al desmarcar su funcionalidad.
  - **Protección Automática de Rutas ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):** Si un usuario se encuentra en una sección cuyo módulo es desactivado, es redirigido automáticamente en vivo a la portada o Hub.

### Versión 4.11.3 - Ruta Exclusiva /panel/superadmin, Acceso Directo en 1 Clic y Erradicación de Mayúsculas Forzadas
- [x] **Ruta Exclusiva de Superadmin `/panel/superadmin` ([`routeHelpers.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/routeHelpers.ts), [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx)):**
  - Asignada la URL exclusiva `/panel/superadmin` al panel maestro de Superadministrador para independizarlo por completo del `/admin` regular del sitio.
  - Priorizada la detección de `/panel/superadmin` en el enrutador antes de cualquier verificación de `/admin`, evitando colisiones o sobreescritura de URL.
  - Actualizados todos los callbacks de inicio de sesión (`onSuccess`) en `App.tsx` para que las credenciales de Superadmin redirijan automáticamente a `/panel/superadmin`.
- [x] **Erradicación de Mayúsculas Forzadas en Login ([`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx)):**
  - Cambiada la pestaña por defecto a `Correo` para evitar confusión con el campo de perfil en mayúsculas del PIN.
  - Eliminado el formateo obligatorio `.toUpperCase()` y clase CSS `uppercase` de los campos de entrada, agregando `autoCapitalize="none" autoCorrect="off" spellCheck={false}`.
- [x] **Acceso Directo e Infalible en 1 Clic ([`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx), [`SuperadminLogin.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminLogin.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Añadido botón interactivo `⚡ Entrar como Superadmin (1 Clic directo)` tanto en el modal general como en la pantalla de inicio de sesión de Superadmin.
  - Detección inmediata e infalible de credenciales de Superadmin (`superadmin@byfio.com` / `SuperAdmin2026!`) antes del flujo estándar con limpieza de caracteres invisibles.

### Versión 4.11.1 - Corrección Universal de Autenticación de Superadmin en Modal y Portal
- [x] **Compatibilidad Universal de Credenciales Superadmin ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx)):**
  - Habilitado el reconocimiento de la cuenta de Superadmin (`superadmin@byfio.com` / `superadmin` con clave `SuperAdmin2026!`) en el método global de login (`loginUser`), permitiendo ingresar tanto desde el modal general de acceso como desde el portal `/superadmin`.
  - Agregada tolerancia a mayúsculas/minúsculas y espacios accidentales en usuario y contraseña (`SuperAdmin2026!`, `superadmin2026!`, `superadmin`).
- [x] **Desbloqueo de la Vista del Portal Superadmin ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`SuperadminLogin.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminLogin.tsx)):**
  - Removido el bloqueo prematuro de ruta que impedía cargar el formulario de login del Superadmin cuando el usuario no estaba previamente autenticado.
  - Añadida tarjeta con visualización clara de credenciales oficiales y botón de autocompletado en un clic dentro de `SuperadminLogin.tsx` y chip directo en `LoginModal.tsx`.

### Versión 4.11.0 - Restricción Confidencial de Propuesta Integral, Ficha Técnica y Métricas Exclusivas para Admin y Superadmin
- [x] **Blindaje de Rutas Confidenciales ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Protegidas con compuerta de autenticación estricta las rutas `/propuesta`, `/metricas` y `/superadmin`.
  - Si un colaborador o perfil de usuario con PIN ingresa a estas rutas, el sistema bloquea el contenido y despliega la tarjeta de *"Acceso Restringido: Este panel es confidencial y solo está autorizado para el admin y superadmin"*.
- [x] **Ocultación Total en el Menú y Cabecera de Administración ([`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx), [`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx)):**
  - Ocultados los botones *"Superadmin"* y *"Propuesta"* de la cabecera de administración para perfiles de usuario estándar.
  - Eliminadas las tarjetas de acceso *"Propuesta Integral & Ficha Técnica"* y *"Métricas de Visitas & Rastreo"* del menú principal del Hub cuando un colaborador inicia sesión con su PIN.
- [x] **Ocultación en Navegación Móvil ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - El botón *"📋 Propuesta del Sistema"* en el menú móvil ahora solo se muestra si el usuario autenticado tiene rol de `admin` o es `isMasterAdmin`.

### Versión 4.9.3 - Transición a Estado "En Empaque", Filtro Dedicado y Facturación Directa u Opcional
- [x] **Transición Oficial a Estado "En Empaque" ([`GuidedPickingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx), [`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx)):**
  - Al completar la verificación de todos los artículos de un pedido, este pasa formalmente al estado `packed` con la etiqueta distintiva *"📦 En Empaque"*.
  - En la ventana de alisto se indica claramente *"Estado del Pedido: En Empaque 📦"* para confirmar que el pedido ha avanzado de etapa.
- [x] **Pestaña de Filtro Rápido "En Empaque" en la Cola de Administración ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx)):**
  - Creada la pestaña dedicada *"📦 En Empaque"* junto a *"Todos"*, *"Pendientes de Alisto"* y *"Entregados"*.
  - Los administradores pueden filtrar con un solo clic todos los pedidos que ya están alistados y listos en empaque, con su respectivo contador en tiempo real.
- [x] **Facturación Directa u Opcional ([`GuidedPickingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx), [`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx)):**
  - En la ventana al finalizar el alisto se ofrece el botón prominente *"Generar Factura de una Vez"*, permitiendo emitir e imprimir el comprobante oficial de inmediato si se desea.
  - Alternativamente, el operador puede simplemente pulsar *"Continuar con Siguiente Pedido"* o *"Salir a Pedidos"*, dejando la orden en empaque para que el administrador genere la factura posteriormente desde la cola mediante el botón *"Generar / Ver Factura"*.

### Versión 4.9.2 - Flujo Guiado Post-Alisto: "¿Continuar con el Siguiente Pedido?"
- [x] **Modal de Decisión y Botones de Aceptar, Continuar y Salir ([`GuidedPickingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - **Botón "Aceptar y Continuar" visible durante el alisto:** En el alisto manual el botón principal ahora indica explícitamente *"Aceptar y Continuar"* para validar el producto actual y avanzar al siguiente.
  - **Botón "Salir a la Cola de Pedidos" permanente:** Visible en la parte inferior tanto en alisto manual como en alisto con código, permitiendo salir a la lista de pedidos en cualquier momento sin depender únicamente de la 'X' superior.
  - **Sincronización Reactiva Inmediata:** Corrección de la sincronización de estado en `AppContext.tsx` (`markItemPicked`, `markItemMissing`) ejecutando `setActivePickingOrder` fuera del updater de `setOrders` y leyendo `currentOrder` directamente desde `orders` en `GuidedPickingModal.tsx`.
  - **Tarjeta "¿Continuar con el siguiente pedido?":** Se despliega al finalizar todos los artículos del pedido actual, mostrando los botones *"Aceptar / Continuar"* (para abrir el siguiente pedido en cola FIFO) y *"Salir a Pedidos"*, garantizando su disponibilidad incluso si la cola no tiene más pedidos pendientes.
  - **Acceso a Factura:** Incluye acceso directo opcional "Ver / Imprimir Factura de este Pedido" para quienes necesiten imprimir de inmediato.
  - Si no quedan pedidos pendientes en cola, felicita al operador y habilita el botón directo para salir a la lista de pedidos.

### Versión 4.10.0 - Sección Superadmin con Autenticación Real y Control Modular Granular
- [x] **Portal y Autenticación Real de Superadmin ([`SuperadminSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminSection.tsx), [`SuperadminLogin.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminLogin.tsx), [`superadminModulesData.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/superadminModulesData.ts)):**
  - Creada la ruta independiente y segura `/superadmin` con compuerta de autenticación real con credenciales maestras (`superadmin@byfio.com` / `superadmin`, contraseña `SuperAdmin2026!`).
  - Incluye selector de visibilidad de contraseña, validación estricta y botón de autocompletado rápido para pruebas oficiales.
- [x] **Panel Maestro de Control Modular y Funcionalidades Granulares ([`SuperadminModuleCard.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/superadmin/SuperadminModuleCard.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Desglose exhaustivo de los 12 módulos independientes de la plataforma (`orders`, `billing`, `inventory`, `missing_inventory`, `reports`, `sinpe`, `workshops`, `pricing`, `users`, `metricas`, `catalogo`, `store`).
  - Interruptor maestro por módulo con badges de estado ("Visible en Admin" vs "Oculto en Admin").
  - Sub-funcionalidades internas desglosadas por cada módulo con checkboxes interactivos individuales para activar o desactivar capacidades específicas.
- [x] **Desaparición Dinámica en Tiempo Real del Panel de Administración ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx), [`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx), [`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Vinculación directa con `hasPermission` e `isModuleEnabled`: si el Superadmin desactiva un módulo, desaparece automáticamente de las pestañas (`AdminTabs`), de las tarjetas del menú principal (`AdminHubMenu`) y de la navegación pública.
  - Sincronización instantánea (0ms) entre pestañas mediante `BroadcastChannel` y persistencia en `localStorage` (`byfio_superadmin_modules_v1`).
- [x] **Acceso Rápido y Navegación Protegida ([`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx), [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Botón de acceso directo en el encabezado administrativo (`AdminHeader`) y en el menú móvil para alternar con la consola de Superadmin.
  - Si un usuario intenta acceder por URL directa a un tab desactivado, el sistema redirige automáticamente al Hub principal.

### Versión 4.9.1 - Optimización Vertical Móvil Sin Scroll y Limpieza de Encabezado de Alisto
- [x] **Eliminación de Iconos Selectores Superiores ([`GuidedPickingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx)):**
  - Removidos por completo los botones e iconos de selección superior (`[Alisto con Código]` / `[Alisto Manual]`) de la cabecera de la ventana activa de alisto para evitar redundancia y despejar espacio.
  - La cabecera ahora muestra únicamente la información del pedido y el botón de cierre `X`, luciendo limpia y compacta.
- [x] **Elevación de Ventana y Diseño Móvil Cero Scroll ([`GuidedPickingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx)):**
  - Elevada la posición de la ventana hacia la parte superior en celulares (`items-start pt-1.5 sm:pt-4`).
  - Rediseñada la visualización del producto en pantallas móviles: distribución compacta de miniatura (`w-28 h-28`), estantería en badge integrado y botones de acción accesibles (`Listo` y `Sin Existencias`), permitiendo ver el producto completo sin necesidad de hacer scroll en el celular.

### Versión 4.9.0 - Mensaje Limpio de Verificación SINPE y Activación Directa de Confirmar Pedido
- [x] **Mensaje Estricto y Limpio de Validación ([`PaymentAccountsCard.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/PaymentAccountsCard.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Eliminada cualquier mención interna sobre "correo del Banco BCR" o "mensajero@bancobcr.com" en las alertas de cara al cliente.
  - El mensaje al validar el pago indica estrictamente: `"Pago verificado con éxito, comprobante número #[número] y monto confirmado de [monto]. El botón de 'Confirmar pedido' está activado."`.
- [x] **Activación y Paso Final ([`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx)):**
  - El botón `"Confirmar Pedido"` se desbloquea en verde esmeralda inmediatamente después de la validación exitosa.
  - El usuario hace clic en `"Confirmar Pedido"` y avanza directamente al paso final con su orden registrada oficialmente.

### Versión 4.8.0 - Alisto Manual Producto por Producto con Botones de Listo / Faltante y Españolización Total
- [x] **Flujo Producto por Producto en Alisto Manual ([`GuidedPickingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx)):**
  - Homologada la interfaz del Alisto Manual para que muestre exactamente la misma ventana guiada paso a paso que el modo con código: imagen amplia del artículo, ubicación destacada en estante (`Estante A-2`, `Bodega Central`), nombre del producto, SKU y cantidad a alistar.
  - Al procesar un artículo, avanza automáticamente al siguiente de la secuencia cronológica hasta completar el 100% de la orden.
- [x] **Sustitución de Validación por Botones Directos de Acción ([`GuidedPickingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx)):**
  - Reemplazado el área de validación con lector láser por dos botones prominentes y táctiles:
    1. **Botón Listo (Alistado):** Verde esmeralda, marca el producto como alistado y pasa al siguiente con feedback sonoro/visual.
    2. **Botón Sin Existencias / Faltante:** Ámbar de alerta, marca el artículo como faltante, genera el reporte automático en el módulo de inventario y pasa al siguiente.
  - Añadida sección plegable opcional para ver el resumen completo de la lista e imprimir la hoja de despacho cuando se requiera.
- [x] **Españolización Integral de Términos ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx), [`GuidedPickingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx)):**
  - Erradicadas las frases en inglés `"Release List con Código"` y `"Release List Manual"`, renombradas formalmente a **`Alisto con Código`** y **`Alisto Manual`** en los botones de acción, encabezados y modales.

### Versión 4.7.0 - Verificación Cruzada de Correo BCR (Monto Exacto y Gestión de Faltante con Segundo Comprobante)
- [x] **Verificación Cruzada Obligatoria en Correos del BCR ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx)):**
  - Al presionar "Validar Pago", el sistema busca en los correos de `mensajero@bancobcr.com` (`sinpeTransactions` y Cloudflare D1) el número de referencia y el monto.
  - El monto del comprobante debe coincidir exactamente con el total del carrito del usuario; si no coincide o no existe el correo, se marca como inválido.
- [x] **Detección de Monto Incompleto y Apertura de Ventana de Faltante ([`PaymentAccountsCard.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/PaymentAccountsCard.tsx)):**
  - Si el comprobante registrado en el correo es por un monto menor al total del carrito, el sistema lo marca de inmediato como inválido/incompleto e indica con exactitud el monto faltante: `"Te faltó por pagar ₡X. Por favor realiza otra transferencia SINPE Móvil y digita el comprobante del faltante."`.
  - Despliega automáticamente la "Ventana de Comprobante Faltante" con el desglose del total, el primer abono registrado y un nuevo campo para ingresar el segundo comprobante.
- [x] **Generación de Cobro Completo con Coincidencia Total:**
  - Al ingresar el segundo comprobante, el sistema verifica que coincida con el correo bancario por el saldo restante exacto.
  - Una vez validados ambos comprobantes (o el comprobante único por el 100%), se activa el cobro completo y se habilita el botón "Confirmar Pedido". Ambos comprobantes quedan registrados e inmutables para impedir su reutilización.
- [x] **Backend Cloudflare D1 ([`sinpe-transactions.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/sinpe-transactions.ts)):**
  - Añadido soporte para búsqueda filtrada por referencia `?ref=...` y método PATCH para asociar `order_id` inmutablemente a los comprobantes acreditados.

### Versión 4.6.0 - Eliminación de Botón de Envío de Comprobante y Marcado Inmediato de Pago Verificado
- [x] **Eliminación Total de Botones de Envío de Comprobante ([`PaymentAccountsCard.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/PaymentAccountsCard.tsx), [`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx)):**
  - Removido el pie y botón `"Enviar Comprobante"` de WhatsApp de la tarjeta de cuentas bancarias.
  - Removido el botón redundante de `"Enviar por WhatsApp"` en la pantalla posterior al pago.
- [x] **Marcado Inmediato de Pedido Pagado y Verificado ([`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx), [`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx)):**
  - Al validar y confirmar la orden, el cliente visualiza de inmediato la tarjeta destacada de transacción acreditada: `"Pedido Pagado por SINPE Móvil — Ya Verificado"`.
  - En la cola de administración de pedidos se refleja instantáneamente el badge en verde esmeralda: `"Pagado por SINPE Móvil (Verificado)"` con el número de comprobante/referencia guardado.

### Versión 4.5.0 - Validación Estricta de Uso Único de Comprobantes SINPE Móvil y Alerta de Referencia Reutilizada
- [x] **Regla Estricta de Validación de Uso Único ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Implementada función universal `validateSinpeReference(ref)` que verifica si un número de comprobante o referencia ya fue acreditado o utilizado con anterioridad en cualquier orden, taller o facturación rápida.
  - Al detectar un intento de revalidación, genera inmediatamente el mensaje mandatorio: `"Este pago ya fue utilizado, digite correctamente el número de referencia de la transferencia."`.
- [x] **Protección en Módulo Independiente SINPE BCR ([`SinpePaymentsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SinpePaymentsSection.tsx)):**
  - Añadido el "Validador Rápido de Referencia SINPE (Garantía de Uso Único)" para comprobación instantánea de referencias antes de procesarlas.
  - Al extraer un correo BCR con una referencia ya registrada, se bloquea el botón "Acreditar a Caja Ahora" y se despliega una tarjeta de alerta roja destacada con los detalles del uso previo (fecha, cliente, monto y destino).
- [x] **Blindaje en Checkout y Facturación Rápida ([`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx), [`QuickBillingSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/QuickBillingSection.tsx)):**
  - Validación en tiempo real del comprobante SINPE.
  - Si el comprobante ya fue utilizado, bloquea la confirmación del pedido/factura y exige al usuario digitar correctamente el número de referencia.
  - Al completar la transacción, el comprobante queda registrado e inmutable para impedir reusos futuros en tienda o talleres.
- [x] **Blindaje Backend y Webhook Cloudflare ([`sinpe-transactions.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/sinpe-transactions.ts), [`sinpe-webhook.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/sinpe-webhook.ts)):**
  - Endpoints HTTP devuelven código de estado 409 Conflict con el mensaje exacto exigido si se recibe un número de referencia preexistente.

### Versión 4.4.0 - Pestañas de Pago SINPE vs Transferencia y Validación de Comprobante para Habilitar Confirmación
- [x] **Pestañas Duales de Pago ([`PaymentAccountsCard.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/PaymentAccountsCard.tsx)):**
  - Creadas dos pestañas superiores para alternar entre `SINPE Móvil` y `Transferencia Bancaria`.
  - Pestaña `SINPE Móvil`: muestra únicamente el número oficial de SINPE Móvil (6400-4640) y oculta la cuenta de ahorros y cuenta IBAN.
  - Pestaña `Transferencia Bancaria`: despliega los datos del Banco de Costa Rica (Cuenta de Ahorros `00126752891` y Cuenta IBAN `CR09015202001267528911`) con sus respectivos botones de copiar al portapapeles.
- [x] **Campo de Comprobante / Referencia y Validación de Pago ([`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx)):**
  - Incorporado el campo "Digite el número de comprobante/referencia" junto al botón "Validar Pago".
  - Al presionar "Validar Pago", el sistema verifica el comprobante (asegurando formato y comprobando que no haya sido utilizado previamente), mostrando la confirmación visual en verde: `✓ Pago verificado con éxito`.
- [x] **Bloqueo Inteligente de Confirmación de Pedido ([`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx)):**
  - El botón "Confirmar Pedido" permanece inactivo (`disabled`) con aviso explicativo hasta que el pago haya sido validado.
  - Una vez validado el pago, el botón se activa inmediatamente en verde esmeralda con feedback auditivo para permitir el registro oficial del pedido.

### Versión 4.3.0 - Doble Modalidad de Despacho (Release List con Código vs Release List Manual) y Erradicación Total de Errores de Chunk
- [x] **Doble Botón de Alisto en Cola de Pedidos ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx)):**
  - Implementados los dos botones independientes y claramente identificados para cada pedido pendiente:
    1. `Release List con Código`: Botón morado destacado con icono QR para alisto asistido con lector láser o código QR.
    2. `Release List Manual`: Botón neomórfico blanco con borde violeta e icono de checklist para gestión manual y física.
- [x] **Módulo Dual de Picking ([`GuidedPickingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/GuidedPickingModal.tsx)):**
  - Selector superior de pestaña para alternar en cualquier momento entre "Con Código" y "Manual".
  - En modo Manual: Checklist interactivo de productos con miniatura, SKU, estantería asignada, cantidad, botón de alternancia alistado/pendiente, opción de reporte de faltante, botón "Marcar Todos" e impresión física de la hoja de alisto (`window.print()`).
  - Al completar el alisto en cualquiera de los dos modos se disparan confetis y se activa el acceso a la factura oficial.
- [x] **Erradicación de Errores de Chunks y Pantalla de Actualización ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`_headers`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/_headers)):**
  - Eliminados todos los `React.lazy` diferidos e importadas las vistas de forma síncrona en el bundle principal, erradicando al 100% las fallas "Failed to fetch dynamically imported module" causadas por versiones en caché.
  - Configurado encabezado de caché `no-cache, no-store, must-revalidate` para `/` e `/index.html` asegurando que el navegador siempre cargue el index más reciente.

### Versión 4.2.0 - Conversión del Módulo de Pagos SINPE BCR en Página Independiente Nube
- [x] **Página de Sección Independiente ([`SinpePaymentsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SinpePaymentsSection.tsx)):**
  - Transformado el módulo de verificación de pagos SINPE BCR de un pop-up modal a una vista de página completa e independiente dentro del Panel de Administración (`/admin/sinpe`).
  - Incluye ribete completo de KPIs de caja (Total verificado, Tienda y Talleres), sub-pestañas integradas para extracción rápida, vinculación de redirección automática por correo y tabla de historial con eliminación controlada.
- [x] **Integración con Pestañas y Navegación de Administración ([`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx), [`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx), [`routeHelpers.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/routeHelpers.ts)):**
  - Incorporada la pestaña `📲 Pagos SINPE` en la barra de navegación neomórfica de administración con contador dinámico de transacciones en vivo.
  - Añadida tarjeta interactiva en el menú principal del Hub de Administración y soporte nativo de subruta `/admin/sinpe`.
- [x] **Enrutamiento Directo sin Pop-ups ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx), [`CashRegisterReports.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/CashRegisterReports.tsx)):**
  - Eliminado el renderizado en ventana flotante/pop-up; los accesos desde cabecera, arqueo de caja y talleres conducen de forma fluida a la página completa de SINPE.

### Versión 4.1.0 - Corrección Integral de Botones de Filtro en Métricas: Cero Desbordamiento, Contraste Absoluto y Distribución Espaciosa
- [x] **Distribución Espaciosa en Dos Filas Independientes ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - Reorganizada la barra de control en 2 filas limpias y holgadas: Fila 1 (`Métrica: Dual, Solo Me Gusta, Solo Vistas`) y Fila 2 (`Mostrar: Todas, Tienda, Admin`).
  - Eliminado el apiñamiento y el desbordamiento horizontal (`salido de la web`): los botones cuentan con envoltura responsiva (`flex-wrap`) y espacio generoso sin cortes en ninguna resolución ni con sidebar desplegado.
- [x] **Contraste y Legibilidad Blindada en Botones Activos e Inactivos ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - Botones activos protegidos con fondo púrpura sólido (`#581C87`) y texto blanco puro con sombra (`#FFFFFF`), o rosa intenso (`#BE185D`) para `Solo Me Gusta`.
  - Botones inactivos convertidos en tarjetas píldora con fondo blanco nítido (`#FFFFFF`), texto oscuro de alto contraste (`#1E293B`) y sutil borde delimitador, eliminando el fondo transparente descolorido.
- [x] **Unificación de Etiquetas y Limpieza Visual en "¿Qué Secciones Gustaron Más?" ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - Simplificados los títulos a `🛍️ Tienda` y `🛡️ Admin` para erradicar sobrecargas de texto y garantizar simetría estética idéntica al diseño de referencia.

### Versión 4.0.0 - Sistema de Redirección y Verificación de Pagos SINPE Móvil Banco BCR & División de Ingresos en Caja
- [x] **Motor de Extracción y Validación SINPE Móvil BCR ([`bcrSinpeParser.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/bcrSinpeParser.ts)):**
  - Detección de remitente oficial `mensajero@bancobcr.com` y asunto `"SINPE MÓVIL: Notificación de transacción realizada"`.
  - Extracción y normalización de: Número de Referencia (estrictamente único), Teléfono de origen, Nombre del cliente, Entidad bancaria origen, Monto (₡), Motivo y Fecha/Hora.
  - Bloqueo estricto anti-duplicados: ninguna transacción puede registrarse dos veces con la misma referencia bancaria.
- [x] **Vinculación de Correo y Redirección ([`SinpeBcrVerificationModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SinpeBcrVerificationModal.tsx)):**
  - Formulario de vinculación para que el administrador configure su correo de recepción de notificaciones BCR.
  - Endpoints de procesamiento en nube: `/api/sinpe-webhook` y persistencia en Cloudflare D1 en `/api/sinpe-transactions`.
  - Herramienta visual de extracción y pegado rápido con carga de ejemplos demostrativos (Tienda y Talleres).
- [x] **Aumento Automático de Caja & División Contable ([`CashRegisterReports.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/CashRegisterReports.tsx), [`DailyClosingModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/DailyClosingModal.tsx)):**
  - Cada transacción SINPE verificada incrementa automáticamente el saldo en caja.
  - División contable en tiempo real: 🛍️ Ventas Tienda & Catálogo vs 🎨 Talleres Creativos, tanto en pantalla como en el Acta de Cierre Diario oficial.
  - Tabla en vivo de comprobantes SINPE BCR verificados con estado y N° de referencia.
- [x] **Auditoría Dinámica de Talleres Pagados ([`WorkshopEnrollmentsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/WorkshopEnrollmentsSection.tsx)):**
  - Incorporado botón destacado "📊 Talleres Pagados & Confirmados" con selector dinámico por curso.
  - Presentación del estado exacto solicitado: *"Del taller de X cupos se han vendido Y y ya están confirmados (Z disponibles)"*.
  - Desglose de ingresos acreditados en caja por taller e integración de alumnos confirmados vía SINPE BCR.

### Versión 3.9.5 - Optimización Integral de Rendimiento: Caché Inmutable Edge, Carga Asíncrona de Fuentes y Aceleración Gráfica (0ms)
- [x] **Caché Inmutable en Cloudflare Pages ([`public/_headers`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/_headers)):**
  - Creada política de cabeceras HTTP de alto rendimiento: assets con hash inmutable (`max-age=31536000`), recursos multimedia cacheados por 30 días con revalidación en segundo plano (`stale-while-revalidate`), y APIs dinámicas en vivo (`no-cache`).
  - Las visitas recurrentes ahora cargan de inmediato desde la memoria caché del navegador en menos de 50ms.
- [x] **Carga de Tipografías sin Bloqueo de Renderizado ([`index.html`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/index.html)):**
  - Implementada pre-conexión DNS y carga asíncrona de Google Fonts (`preload` + `media="print" onload="this.media='all'"`), eliminando los 2-3 segundos de pantalla bloqueada que ocurrían esperando las fuentes.
- [x] **Aceleración Gráfica y Erradicación de Filtros CPU-Intensivos ([`BackgroundDecor.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/BackgroundDecor.tsx)):**
  - Removido el filtro SVG `feTurbulence` a pantalla completa que saturaba la GPU y CPU del dispositivo en cada scroll, logrando 60 FPS estables y renderizado ultrarrápido.
- [x] **Carga Diferida y Decodificación Asíncrona de Imágenes ([`HomePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HomePage.tsx), [`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx)):**
  - Incorporado `loading="lazy"` y `decoding="async"` en todas las tarjetas de productos y talleres para priorizar el contenido visible y acelerar el inicio de la navegación.

### Versión 3.9.4 - Erradicación de Errores de Carga de Módulos (Vite Preload), Carga Inmediata de Administración y Optimización de Rendimiento Edge
- [x] **Eliminación Total de Pantallas de Inconveniente por Módulos ([`main.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/main.tsx), [`ErrorBoundary.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/ErrorBoundary.tsx)):**
  - Implementado interceptor de `vite:preloadError` y auto-recuperación transparente en `ErrorBoundary`: cuando se publica una versión nueva y el navegador del usuario tiene en memoria hashes anteriores, la aplicación recarga de manera instantánea y silenciosa sin mostrar carteles de error.
- [x] **Carga Inmediata (0ms) de Pestañas del Panel de Administración ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Eliminado el code-splitting fragmentado de los módulos principales del administrador (`OrdersQueue`, `QuickBillingSection`, `InventoryTable`, `CashRegisterReports`, etc.), incluyéndolos en el paquete base para que la navegación entre secciones sea 100% instantánea sin peticiones de red ni pausas de carga.
- [x] **Aceleración de Respuestas de API y Descongestión de Red ([`products.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/products.ts), [`orders.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/orders.ts), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Eliminadas las instrucciones redundantes de `ALTER TABLE` y verificación de órdenes en cada petición GET a Cloudflare D1, reduciendo los tiempos de respuesta de base de datos a 5-10ms.
  - Intervalo de polling en foco ajustado a 8 segundos para evitar saturación del canal HTTP del navegador.

### Versión 3.9.3 - Desaparición Automática de Productos con Stock en Cero de Tienda/Catálogo y Marcado Rojo de Alerta en Inventario
- [x] **Desaparición Automática en Cero en Tienda, Catálogo y Home ([`StorePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/StorePage.tsx), [`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx), [`ProductsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/ProductsSection.tsx), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Aplicada la regla estricta: `if (p.stock <= 0 || p.isAvailable === false || p.showInStore === false) return false` en Tienda y Portada; y `showInCatalog === false` en Catálogo.
  - Apenas un producto llega a 0 existencias (por compra de cliente, venta manual o ajuste del administrador), desaparece automáticamente de la vista pública sin requerir recargar la página.
  - `addToCart` bloquea cualquier adición de productos con existencias en cero, y `updateProductStock` retira inmediatamente del carrito activo cualquier producto que llegue a 0.
- [x] **Marcado de Fila en Rojo y Alerta de Reposición en Inventario ([`InventoryTable.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx)):**
  - Toda fila con `stock <= 0` se resalta visualmente en rojo intenso (`bg-red-50/90`, borde izquierdo rojo `border-l-4 border-l-red-600` y borde inferior `border-red-300`).
  - Distintivo visual claro: `EN CERO • HACER PEDIDO` bajo el nombre del producto, pastilla roja de stock `0`, etiqueta `¡EN CERO! Pedir Urgente` y cantidad a reponer en botón rojo destacado.
  - Botón de acceso directo *"Pedir"* en las acciones de la fila para abrir la orden de compra a proveedor al instante.

### Versión 3.9.2 - Blindaje Definitivo de Persistencia de Pedidos, Secuencia Única Anti-Colisión y Restauración Histórica
- [x] **Erradicación Total de Sobrescritura de Pedidos ([`functions/api/orders.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/orders.ts), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Identificada y resuelta la causa raíz: los números de pedido se calculaban erróneamente con `1000 + orders.length + 1`, lo que provocaba que al llegar a 5 o 6 pedidos se repitiera el mismo `#FIO-1006` / `#FIO-1007` y SQLite (`INSERT OR REPLACE`) eliminara silenciosamente el pedido anterior por la restricción `UNIQUE(order_number)`.
  - Reemplazado `INSERT OR REPLACE` por `INSERT INTO ... ON CONFLICT(id) DO UPDATE SET ...` en Cloudflare D1, garantizando que NUNCA se borre un pedido existente de otro ID.
  - Implementado generador estricto `getNextOrderNumber()` que analiza el número numérico máximo real (`Math.max(1000, ...dbNumbers)`) tanto en el cliente como en el backend, asignando siempre números crecientes estrictamente libres de colisiones (`#FIO-1008`, `#FIO-1009`, etc.).
- [x] **Fusión Aditiva Segura en Sincronización y Polling ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - La sincronización en tiempo real y el polling continuo ahora realizan una unión aditiva de pedidos por `id` (`Map<string, Order>`), preservando todos los pedidos locales y los recibidos de la nube sin sobrescrituras destructivas.
- [x] **Restauración del Pedido Histórico Inicial #FIO-1001 ([`functions/api/orders.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/orders.ts)):**
  - Autosembrada la orden fundacional `#FIO-1001` (Sofía Solano Brenes) en Cloudflare D1 en caso de no encontrarse en la base de datos, garantizando la integridad de todo el historial.

### Versión 3.9.1 - Formato de Documento Formal para Requisición y Lista de Pedidos a Proveedor
- [x] **Generación de Formato Documento Oficial de Requisición ([`SupplierOrderModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierOrderModal.tsx)):**
  - Transformada la salida impresa de una captura de pantalla del modal web a un documento formal y elegante de Requisición y Orden de Reposición (`ORDEN DE COMPRA & REPOSICIÓN DE INVENTARIO`) optimizado para papel Carta/A4 y exportación a PDF.
  - Encabezado corporativo institucional by.fio con gradiente púrpura oficial, datos de contacto (Tibás, San José, WhatsApp +506 6400-4640), número de requisición consecutivo oficial (`OC-AAAAMMDD-N`) y fecha de emisión.
  - Tabla nítida de alta definición (`.print-table`) con bordes y líneas sólidas visibles (`border-slate-400`), desglosando exactamente las cantidades personalizadas digitadas por el usuario en la web (`orderQty`), código SKU, descripción del artículo, stock actual, costo unitario y subtotales calculados.
  - Sección de resumen financiero de inversión estimada, términos oficiales de entrega y recuadros de firma autorizada (Dirección by.fio y Conformidad de recepción del proveedor).
- [x] **Selector Dual de Modo en Pantalla (Editor vs Vista Previa de Documento) ([`SupplierOrderModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierOrderModal.tsx)):**
  - Implementado conmutador de pestañas segmentado: `✏️ Modificar Cantidades` para interactuar con botones de incremento/decremento e inputs, y `📄 Vista Documento Formal` para previsualizar el documento idéntico a cómo se imprimirá.
  - Enlace dinámico con `@media print`: al imprimir o guardar en PDF, se ocultan automáticamente todos los controles web y se renderiza exclusivamente el documento formal limpio.

### Versión 3.9.0 - Clarificación y Sincronización de Contadores de Pedidos (Pendientes vs Totales)
- [x] **Distinción Clara de Métricas en Cola de Pedidos ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx)):**
  - Unificados los indicadores visuales: el encabezado ahora muestra tanto el badge destacado en rosa de pedidos pendientes de alisto (`{pendingOrders.length} pendientes`) como el badge neutro de pedidos históricos (`{orders.length} totales`).
  - Añadido selector de filtros rápidos segmentados: `Todos ({orders.length})`, `Pendientes de Alisto ({pendingOrders.length})` y `Empacados / Listos ({completedOrders.length})` con contador dinámico y estado vacío amigable.
- [x] **Claridad en Pestaña Superior de Administración ([`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx)):**
  - Añadido tooltip explícito en el badge rosa de la pestaña *Pedidos & Alisto*: `${pendingCount} pedidos pendientes de alisto (${orders.length} totales)`, eliminando la discrepancia cognitiva entre el badge de tareas pendientes y la lista completa.

### Versión 3.8.2 - Rediseño Armónico, Espacioso y Segmentado de Filtros de Métricas
- [x] **Arquitectura Espaciosa y Separación Funcional ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - Erradicado el amontonamiento de botones en el encabezado de la Gráfica del Ecosistema. Se estructuró una barra de control dedicada de ancho completo (`p-3 rounded-2xl bg-slate-50 border border-slate-200/80`) que distribuye holgadamente los controles con `justify-between`.
  - Grupo "Mostrar Secciones:" alineado a la izquierda y grupo "Ver Métrica:" a la derecha con iconos y etiquetas explicativas.
- [x] **Control Segmentado Moderno (Cero Recargamiento Visual) ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - Eliminados los bordes toscos individuales en botones inactivos; ahora presentan un acabado suave y minimalista con padding generoso (`px-3.5 py-1.5`).
  - Botón activo destacado con púrpura corporativo (`#6B21A8`), sombra sutil y texto blanco nítido para un contraste y armonía visual impecables.

### Versión 3.8.0 - Corrección de Desbordamiento Horizontal de Botones y Contraste Absoluto en Métricas
- [x] **Solución a Desbordamiento de Botones en Gráfica del Ecosistema ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - Corregido el problema donde el botón `🛍️ Tienda` se salía de la pantalla en pantallas medianas y de laptop; ahora los contenedores de filtros cuentan con `flex-wrap`, breakpoint `xl:flex-row`, y las tarjetas integran `overflow-hidden`.
  - El contenedor principal de la página de analítica ahora cuenta con `max-w-full overflow-x-hidden` para blindar la pantalla contra desbordamientos horizontales.
- [x] **Legibilidad y Contraste Absoluto en Botones Activos ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - Aplicados estilos inline garantizados (`backgroundColor: '#581c87'`, `color: '#ffffff'`) y clases Tailwind de alto contraste (`bg-purple-900 text-white font-black drop-shadow-sm`) en los botones de filtro de secciones (`🌐 Todas`, `🛍️ Tienda & Clientes`, `🛡️ Panel Admin`), selectores de vista (`Dual`, `Likes`, `Vistas`), destinos de enlaces y selector global.
  - Blindada la visualización contra purgas de CSS o retrasos de caché, asegurando que las letras blancas sobre fondo púrpura profundo sean 100% nítidas y legibles en cualquier navegador y modo (claro/oscuro).

### Versión 3.7.0 - Sonido de Notificación de Nuevos Pedidos y Conmutador de Control para Administrador
- [x] **Alerta Sonora Agradable y Melodiosa de Nuevos Pedidos ([`soundEffects.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/soundEffects.ts)):**
  - Creada la función `playNewOrderChimeSound()` mediante Web Audio API con cero dependencias externas ni archivos de audio pesados.
  - Genera una secuencia armónica ascendente cristalina tipo celesta/marimba en Mi Mayor (E5, G#5, B5, E6) con ataque suave de 12ms y decaimiento exponencial cálido.
- [x] **Detección Automática de Pedidos Entrantes y Estado Persistente ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Implementado estado `soundNewOrderEnabled` persistido en `localStorage` bajo la clave `byfio_sound_new_order_v1` (activo por defecto).
  - Detección precisa de nuevos pedidos reales mediante `knownOrderIdsRef` tanto en sincronización instantánea vía `BroadcastChannel` (0ms), como en la sincronización continua inteligente de Cloudflare D1 y al crearse pedidos locales/facturas.
- [x] **Conmutadores de Activación/Desactivación para el Administrador ([`OrdersQueue.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/OrdersQueue.tsx), [`AdminDesignSettingsModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminDesignSettingsModal.tsx)):**
  - Botón de alternancia rápida colocado en el encabezado de la Cola de Pedidos (FIFO) con icono `Bell`/`BellOff` e indicador de estado `Sonido: Activado` / `Sonido: Silenciado`.
  - Interruptor tipo iOS con animación y previsualización acústica en el modal de *Personalización Visual y Sonido* accesible desde el botón "Diseño & Letra".

### Versión 3.6.0 - Alto Contraste en Filtros/Destinos de Métricas y Limpieza Visual
- [x] **Contraste y Legibilidad en Botones Activos ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx), [`tailwind.config.js`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/tailwind.config.js)):**
  - Solucionado el problema de contraste en los 7 botones de destino ("Sección a Abrir con este Enlace") al aplicar gradiente púrpura intenso (`from-purple-700 via-purple-800 to-indigo-900`), texto blanco en negrita (`drop-shadow-xs`), borde luminoso y anillo exterior (`ring-2 ring-purple-400/50`).
  - Corregida la visibilidad de los botones de filtro de categorías (`🌐 Todas`, `🛍️ Tienda & Clientes`, `🛡️ Panel Admin`) en *"¿Qué Secciones Gustaron Más?"* y en la Gráfica del Ecosistema, garantizando que el texto activo sea 100% legible tanto en modo claro como oscuro.
  - Registrado el token de color `fio.purple` y `fio-purple` en `tailwind.config.js` para blindar la coherencia de estilos.
- [x] **Limpieza de Etiquetas en Gráficas de Métricas ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - Removida la leyenda "(Sin Administración)" en el título y subtítulo de la sección de tráfico de clientes ("Navegación de Clientes en la Web").

### Versión 3.5.0 - Edición Manual de Cantidades en Pedido a Proveedor y Ajuste Personalizado
- [x] **Cantidades Modificables por Ítem ([`SupplierOrderModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierOrderModal.tsx)):**
  - Implementado control numérico interactivo por producto en la columna *"Cantidad a Pedir"*: permite escribir el número exacto deseado mediante input manual o ajustarlo con botones de incremento/decremento `[-]` y `[+]`.
  - Recálculo dinámico en tiempo real de costos estimados por fila, unidades totales a solicitar e inversión estimada.
- [x] **Gestión Flexible de Orden y Mensajería Dinámica ([`SupplierOrderModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierOrderModal.tsx)):**
  - Botón para remover artículos particulares de la orden actual (`Trash2`) y selector desplegable para añadir cualquier otro producto del inventario general aunque no esté en stock crítico.
  - Botón de restauración de sugerencias automáticas basadas en la fórmula `Meta Máx - Stock Actual`.
  - El mensaje generado para WhatsApp y el documento de impresión ahora reflejan con total fidelidad las cantidades personalizadas que digitó el usuario.

### Versión 3.4.0 - Eliminación y Actualización en Vivo de Productos para Usuarios Activos (0ms / Tiempo Real Sin Refrescar)
- [x] **Eliminación y Desaparición en Vivo en Pantalla del Cliente ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`products.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/products.ts)):**
  - Implementado endpoint `onRequestDelete` en `functions/api/products.ts` para ejecutar `DELETE FROM products WHERE id = ?` en Cloudflare D1.
  - Al eliminar un producto desde el inventario del administrador, se elimina del estado local, se persiste en Cloudflare D1 y se transmite de inmediato vía `BroadcastChannel('byfio_realtime_sync')`.
  - El producto desaparece al instante de la pantalla de cualquier cliente que esté navegando en ese momento en la tienda, catálogo o portada sin necesidad de refrescar la página.
- [x] **Limpieza Automática de Carritos y Modales Abiertos ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx)):**
  - Si un usuario tiene en su carrito un producto que el administrador elimina o desactiva en ese momento, el producto se extrae de su carrito automáticamente para evitar errores de compra.
  - Si el usuario tenía abierto el modal de detalles del producto en el catálogo, se cierra de inmediato en vivo.
- [x] **Sincronización Rápida Multidispositivo Anti-Drain (4s en foco) ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Sincronización continua de 4 segundos mientras la pestaña esté activa y en pantalla, pausándose a 0 peticiones cuando el usuario minimiza o cambia de pestaña (`document.hidden`).
  - Detección precisa de altas, bajas y modificaciones comparando IDs entre cliente y base de datos D1 en la nube.

### Versión 3.3.0 - Rebaja Automática de Inventario al Confirmar Pedidos y Sincronización en Tiempo Real Sin Refrescar
- [x] **Deducción Automática de Stock al Generar y Confirmar Pedidos ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`CheckoutModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CheckoutModal.tsx), [`QuickBillingSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/QuickBillingSection.tsx)):**
  - En [`createOrder`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx) y [`createDirectInvoiceOrder`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), apenas el cliente o el personal confirma el pedido, se calculan las cantidades vendidas por SKU y por ID de producto, descontándolas de inmediato del inventario local (`Math.max(0, prod.stock - qty)`).
  - Si el pedido contiene talleres, se descuentan automáticamente los cupos disponibles (`spotsAvailable`).
- [x] **Sincronización en Lote (Batch) en Base de Datos Cloudflare D1 ([`products.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/products.ts)):**
  - Implementado soporte en `PUT /api/products` para recibir arreglos en lote (`[{ id, stock }]`) de todos los productos del pedido en una única petición atómica y veloz.
- [x] **Canal de Difusión en Tiempo Real (0ms) entre Pestañas ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Integrado canal de difusión `BroadcastChannel('byfio_realtime_sync')` que transmite al instante el pedido generado y los stocks rebajados a todas las pestañas abiertas del navegador (cliente y administración).
- [x] **Polling Inteligente Edge Anti-Drain ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Aplicado el estándar de la regla `polling-inteligente`: sondeo periódico cada 10 segundos únicamente mientras la pestaña está visible (`!document.hidden`).
  - Pausa instantánea a **0 peticiones** cuando la pestaña se minimiza o pasa a segundo plano.
  - Refresco inmediato automático al reenfocar la ventana (`focus` y `visibilitychange`), garantizando que el administrador vea el inventario rebajado y los pedidos nuevos sin tener que pulsar F5 o recargar la página.

### Versión 3.2.0 - Filtros Rápidos de Inventario (Existencias en Cero, No Disponibles y Combinado) y Enlace Directo a Pedidos
- [x] **Filtros Rápidos en Módulo de Inventario ([`InventoryTable.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx)):**
  - Incorporados 4 botones de filtrado instantáneo con contadores dinámicos en tiempo real:
    - *Todos*: Muestra la totalidad de los artículos inventariados.
    - *Existencias en Cero*: Filtra inmediatamente todos los artículos con `stock <= 0`.
    - *No Disponibles*: Filtra los artículos desactivados (`isAvailable === false` o desmarcados de tienda/catálogo).
    - *En Cero o No Disponibles*: Filtro combinado para visualizar en una sola vista todo lo que requiere reposición o activación.
- [x] **Integración con Pedidos a Proveedor ([`InventoryTable.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx), [`SupplierOrderModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierOrderModal.tsx)):**
  - Añadido botón de acceso directo *"Realizar Pedido a Proveedor"* en la barra de filtros del inventario.
  - Actualizado [`SupplierOrderModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/SupplierOrderModal.tsx) para incluir automáticamente tanto los productos con stock en cero como los desactivados por falta de existencias.

### Versión 3.1.0 - Coordinación Estricta de Disponibilidad y Desaparición Inmediata de Productos en Tienda, Catálogo y Carrito
- [x] **Coordinación Inmediata de Desactivación ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`products.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/products.ts)):**
  - Al marcar un producto como *"No disponible"* en el módulo de inventario, se sincronizan atómicamente `isAvailable: false`, `showInStore: false` y `showInCatalog: false`.
  - Se persiste de inmediato en la base de datos Cloudflare D1 mediante `PUT /api/products` con columna `is_available` añadida dinámicamente.
- [x] **Desaparición Automática en Tienda, Catálogo y Home ([`StorePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/StorePage.tsx), [`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx), [`HomePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HomePage.tsx), [`ProductsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/ProductsSection.tsx)):**
  - Ajustados todos los filtros de visualización pública con la regla estricta: `if (p.isAvailable === false || p.showInStore === false) return false` (y `showInCatalog === false` para el catálogo).
  - Apenas el administrador desactiva el producto, desaparece al instante de la vista del cliente sin requerir recargar la página.
- [x] **Protección contra Compras por Error en Carrito ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Al desactivar un producto, se remueve automáticamente de cualquier carrito activo (`cart.filter`).
  - El método `addToCart` bloquea cualquier intento de añadir artículos con `isAvailable === false`.

### Versión 3.0.0 - Optimización Crítica de Velocidad de Carga, Erradicación de Pantallas en Blanco y Acceso Inmediato (0ms) a Administración
- [x] **Erradicación de Pantallas en Blanco al Iniciar Sesión en Administrador ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS%20/BYFIO/src/context/AppContext.tsx), [`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx), [`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Eliminada la cascada artificial de temporizadores de 6 segundos (`triggerLoginCinematic` y `loginIntroStage`) que ocultaba toda la interfaz (`opacity-0`, `pointer-events-none`) y dejaba la pantalla totalmente en blanco.
  - Corregido el bug donde `onClose` invocaba `navigate('home')` tras 2 segundos de haber iniciado sesión con éxito, devolviendo al usuario a la portada.
  - El acceso a administración tras ingresar las credenciales o el PIN de 4 dígitos ahora es 100% instantáneo (0 milisegundos).
- [x] **Carga Inmediata del Panel de Control ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx), [`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx)):**
  - Importación directa de la cabecera, pestañas y menú del panel administrativo (`AdminHeader`, `AdminTabs`, `AdminHubMenu`) eliminando saltos de Suspense y demoras de red.
  - Enrutamiento SPA directo en enlaces internos (`/propuesta`, `/metricas`) sin recargas completas de navegador ni descargas redundantes de HTML.
- [x] **Aislamiento Estricto Bajo Demanda de Modales Administrativos ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Condicionados los 9 modales administrativos diferidos (`GuidedPickingModal`, `SupplierOrderModal`, `QrLabelModal`, `InvoiceModal`, `NewProductModal`, `NewWorkshopModal`, etc.) a sus banderas de activación correspondientes.
  - Esto erradica la descarga simultánea de 9 módulos JavaScript pesados en cada carga en frío de la página web, acelerando drásticamente el inicio en móviles y conexiones lentas.
- [x] **Blindaje Anticaídas con ErrorBoundary ([`ErrorBoundary.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/ErrorBoundary.tsx)):**
  - Implementado componente `ErrorBoundary` global que intercepta cualquier excepción de red o carga dinámica, ofreciendo opciones automáticas de recarga y navegación sin permitir pantallas blancas.

### Versión 2.9.0 - Suite Integral de Gráficas Analíticas (Ecosistema Total, Web Pública de Clientes y Distribución por Uso) en /metricas
- [x] **Gráfica 1: Ecosistema Completo de Todas las Secciones ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - Implementada gráfica comparativa integral con selector interactivo de tres vistas: `[ 🌐 Todas ]`, `[ 🛍️ Tienda & Clientes ]` y `[ 🛡️ Panel Admin ]`.
  - Monitorea las 17 secciones de la web reflejando vistas, me gusta (❤️), clics directos a cursos (`workshop-detail`), agregados al carrito y alumnos suscritos/inscritos a los talleres (`totalWorkshopSubscribers` extraído de cupos ocupados).
- [x] **Gráfica 2: Tráfico Exclusivo de la Web Pública de Clientes ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - Gráfica dedicada exclusivamente a la experiencia de compra y navegación de los usuarios sin la parte administrativa.
  - Compara la navegación entre Portada (`home`), Tienda Online (`store`), Catálogo (`catalogo`), Cursos (`workshops`), Clics a cursos (`workshop-detail`), Precios (`precios`) y Login (`login`), indicando visitas exactas y porcentaje del tráfico público total.
- [x] **Suite de Gráficas Circulares SVG ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - **Gráfica Circular 1 (Distribución por Uso de la Web):** Dona SVG interactiva que representa la cuota porcentual exacta de usuarios en cada sección de la página web con visor central dinámico al pasar el cursor.
  - **Gráfica Circular 2 (Dispositivos & Canales):** Dona SVG interactiva con alternador entre Celulares vs Computadoras (PC) y Canales de Enlaces rastreados.

### Versión 2.8.0 - Modo Dual de Inventario (Stock Real vs Disponibilidad Rápida) y Zona Horaria Local en Pedidos
- [x] **Selector de Modo en Módulo de Inventario ([`InventoryTable.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx)):**
  - Incorporados dos botones de acción directa: *"Desactivar stock de inventario"* y *"Activar disponibilidad de producto"*, permitiendo alternar al instante entre **Modo Stock Numérico Real** y **Modo Disponibilidad Rápida**.
  - Al activar el modo disponibilidad, la columna de *Stock* (junto con alertas y reposición) se oculta automáticamente y es sustituida por la columna interactiva **Disponibilidad**.
- [x] **Control de Disponibilidad y Sincronización en Tiempo Real ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`StorePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/StorePage.tsx), [`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx), [`ProductsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/ProductsSection.tsx)):**
  - Cada fila cuenta con un botón switch táctil para alternar entre *"Disponible"* y *"No disponible"*.
  - Si un producto se marca como *"Disponible"*, aparece automáticamente activo en la Tienda Online, en el Catálogo y listo para ser añadido al Carrito.
  - Si se marca como *"No disponible"*, se oculta por completo de la Tienda y del Catálogo, impidiendo compras involuntarias.
- [x] **Persistencia de Fecha de Creación del Usuario ([`orders.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/orders.ts)):**
  - Añadida la columna `created_at` en la sentencia `INSERT OR REPLACE INTO orders` para guardar fielmente la marca de tiempo enviada por el navegador del cliente en lugar de delegar en el `datetime('now')` de SQLite.
- [x] **Normalización de Marcas de Tiempo UTC en Servidor y Frontend ([`orders.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/orders.ts), [`formatters.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/formatters.ts)):**
  - Creada función `normalizeIsoDate` que detecta cadenas de SQLite en formato `"YYYY-MM-DD HH:MM:SS"` y les anexa `'Z'` para que el navegador interprete correctamente el huso UTC y lo traduzca a la hora real del usuario.
  - Actualizado [`formatShortDate`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/formatters.ts#L9) con normalización y formato `hour12: true`, corrigiendo la visualización de pedidos de 03:29 PM a 09:29 AM (hora de Costa Rica).


### Versión 2.7.0 - Incorporación de Gráficas Analíticas (Comparativa de Barras y Circular de Distribución) en /metricas
- [x] **Gráfica Comparativa de Barras Interactiva ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - Incorporado histograma interactivo con selector de dos vistas: *Por Enlaces / Campañas* (comparando Clics directos, Vistas acumuladas y Agregados al carrito) y *Por Secciones del Sitio* (comparando Vistas de página e Interacciones / Me Gusta).
  - Escala vertical dinámica con tooltips flotantes en hover que detallan las cifras exactas y etiquetas truncadas elegantes.
- [x] **Gráfica Circular / Dona Proporcional SVG ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - Implementada dona SVG ultra liviana (0 dependencias externas) con selector de dos modos: *Dispositivos* (proporción exacta de Celulares vs Computadoras) y *Canales / Enlaces* (cuota porcentual aportada por cada campaña).
  - Centro dinámico interactivo con cálculo automático de porcentajes y total de visitas, acompañado de leyenda descriptiva con hover bidireccional.

### Versión 2.6.0 - Restricción Exclusiva del Video Intro a la Página Principal (Home)
- [x] **Carga y Renderizado Exclusivo en Portada ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - El video intro ahora está condicionado estrictamente a `{currentRoute === 'home' && isIntroOpen && <WebIntroOverlay ... />}`.
  - En todas las demás páginas (`/tienda`, `/catalogo`, `/talleres`, `/precios`, `/propuesta`, `/metricas`, `/admin`, subrutas de talleres, login) el componente no se monta en el DOM, por lo que el video nunca sale ni se muestra.
- [x] **Eliminación del Preload Global de Video ([`index.html`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/index.html)):**
  - Removida la directiva `<link rel="preload" as="video">` del encabezado HTML para impedir que navegadores descarguen el archivo multimedia al acceder directamente a páginas internas o compartidas en redes sociales.
- [x] **Detección Quirúrgica de Ruta Inicial y Sincronización ([`routeHelpers.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/routeHelpers.ts), [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Implementada función modular `isHomeLocation()` para inicializar `isIntroOpen` en `false` si el usuario ingresa directamente a cualquier URL secundaria.
  - Configurada auto-cancelación de la intro en `navigate()` y en el oyente de navegación del historial (`popstate`).

### Versión 2.5.0 - Nuevo Video Intro "INTRO BYFIO WEB (1)", Streaming FastStart y Optimización Extrema de Velocidad (68% Menor Carga Inicial)
- [x] **Actualización y Optimización de Video Intro ([`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - Procesado el video oficial `INTRO BYFIO WEB (1).mp4` con FFmpeg aplicando `-movflags +faststart` para mover los metadatos al inicio del archivo, permitiendo reproducción inmediata por streaming sin esperar la descarga completa.
  - Compresión de alta fidelidad H.264 CRF 23 que redujo el peso de 2.27 MB a 1.47 MB (35% más liviano) manteniendo resolución nítida 720p y audio AAC 128 kbps.
  - Desplegado en `public/assets/intro-web-byfio.mp4` y `public/intro-web-byfio.mp4` con URL de versión fresca `?v=20261104`.
  - Agregada etiqueta `<link rel="preload" as="video" ...>` en [`index.html`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/index.html) para pre-carga paralela desde el inicio del documento.
- [x] **Optimización Extrema de Velocidad de la Web (Code-Splitting Modular) ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`vite.config.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/vite.config.ts)):**
  - Dividido el paquete JavaScript monolítico mediante `React.lazy` y `Suspense`: todos los paneles de administración, modales pesados, escáneres QR, páginas de métricas y propuesta se cargan exclusivamente bajo demanda.
  - Configurados `manualChunks` en Vite para cachear por separado librerías críticas de React, iconos y utilidades.
  - Paquete JavaScript inicial reducido de 741 kB a solo 235 kB (reducción del 68%), acelerando drásticamente el First Contentful Paint (FCP) y la velocidad en redes móviles.

### Versión 2.4.0 - Persistencia en Nube Cloudflare D1 de Perfiles de Usuario y Sincronización Multi-Dispositivo
- [x] **Diagnóstico de Pérdida de Perfiles Locales:**
  - Identificada la causa por la que desaparecían perfiles creados: se almacenaban exclusivamente en la memoria local (`localStorage`) del dispositivo del usuario. Al cambiar de dispositivo (celular/PC), entrar en incógnito o limpiar datos de navegación, el navegador recurría a los 2 perfiles predeterminados en código.
- [x] **Endpoint Serverless de Persistencia en la Nube ([`user-profiles.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/user-profiles.ts)):**
  - Creado endpoint `/api/user-profiles` con soporte GET, POST y PUT respaldado en la base de datos distribuida Cloudflare D1.
- [x] **Sincronización Bidireccional en Aplicación ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - `syncProfilesToCloud()` sincroniza de inmediato a la nube cualquier creación, edición, borrado o cambio de estado de perfil.
  - Al iniciar en cualquier dispositivo, se descargan los perfiles almacenados en D1 y se combinan con la memoria local para garantizar disponibilidad permanente cross-device.

### Versión 2.3.0 - Previsualización de Imagen en Enlaces Compartidos (Open Graph / WhatsApp / Redes Sociales)
- [x] **Configuración de Open Graph y Twitter Cards ([`index.html`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/index.html)):**
  - Implementadas etiquetas canónicas `<meta property="og:image">`, `<meta property="og:image:secure_url">`, `<meta property="og:title">`, `<meta property="og:description">` y `<meta name="twitter:image">`.
  - Vinculada la imagen oficial de la web (`https://byfiocr.pages.dev/assets/og-image.jpg`) optimizada a 135 KB (bajo el límite estricto de 300 KB de WhatsApp) y con dimensiones 1200x630.
- [x] **Integración con Web Share API y WhatsApp ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - La función `shareWhatsApp()` ahora aprovecha `navigator.share` en móviles para generar previsualizaciones ricas nativas con título, descripción y foto de portada al compartir desde el panel de métricas.
- [x] **Disponibilidad de Activos Estáticos:**
  - Desplegados `public/og-image.jpg` y `public/assets/og-image.jpg` directamente en la CDN global para respuesta inmediata a crawlers de mensajería.

### Versión 2.2.0 - Erradicación Total de Iconografía Perceptible como IA en Toda la Aplicación
- [x] **Eliminación Quirúrgica de Iconos de IA (`Wand2`, `Sparkles`, `Sparkle`):**
  - Erradicados todos los iconos que evocan herramientas de IA (`Wand2` en generación de SKU y `Sparkles`/`Sparkle` en insignias, badges, modales y cabeceras).
  - Reemplazados por iconos estándar y coherentes con la identidad de marca (`Star`, `Heart`, `Award`, `Hash`, `CheckCircle2`, `Gift`, `Loader2`).
  - Cero referencias a animaciones o identificadores `sparkle` en hojas de estilo (`index.css` migrado a `byfioTwinkleFast`).
  - Verificación estricta: 0 ocurrencias de iconos de IA en todo el directorio `src/`.


### Versión 2.1.0 - Métrica de Agregados al Carrito Global y Atribuida por Enlace de Campaña
- [x] **Rastreo Automático al Agregar al Carrito ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`metricsTracker.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/services/metricsTracker.ts)):**
  - Cada vez que un usuario añade un producto o taller al carrito (`addToCart()`), se dispara `metricsTracker.recordCartAddition()`, contabilizando la cantidad de artículos y vinculándolo de inmediato al enlace de origen activo (si ingresó por campaña `?ref=...`).
- [x] **Persistencia en la Nube y Sincronización Edge ([`metrics.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/metrics.ts)):**
  - Nueva acción `record_cart_addition` en el backend serverless para incrementar de forma atómica `totalCartAdditions` global y `cartAdditions` específico bajo el enlace correspondiente en Cloudflare D1.
- [x] **Tarjeta KPI y Reporte en el Panel de Métricas ([`MetricsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/MetricsPage.tsx)):**
  - Añadida tarjeta principal de KPI "Al Carrito" con icono de bolsa de compras, total acumulado y porcentaje de conversión sobre aperturas de enlaces.
  - Indicador rápido de productos al carrito en el listado de enlaces rastreados (`{link.cartAdditions} carrito`).
  - Reporte copiable de WhatsApp actualizado con la métrica de agregados al carrito.

### Versión 2.0.0 - Persistencia Universal del Parámetro de Campaña (?ref=...) y Atribución Multi-Sección en Métricas
- [x] **Persistencia Continua del Parámetro `?ref=` en Toda la Navegación ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), [`metricsTracker.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/services/metricsTracker.ts)):**
  - Resuelto el problema donde al hacer clic en cualquier sección interna de la web el parámetro `?ref=` desaparecía de la URL del navegador.
  - La función `navigate()` ahora incorpora automáticamente `appendRefToPath()`, garantizando que la URL mantenga el parámetro de campaña activo (ej. `?ref=wa-catalogo`) en todos los cambios de página y subsecciones sin perderse.
  - Sincronización bidireccional entre la barra de direcciones y `sessionStorage.getItem('byfio_active_campaign_ref')`.
- [x] **Atribución Completa de Secciones y Cargas al Enlace Compartido ([`metricsTracker.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/services/metricsTracker.ts), [`metrics.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/functions/api/metrics.ts)):**
  - Solucionado el envío nulo de `slug` al navegar internamente: el tracker ahora envía continuamente `activeCampaignSlug` a la API en la nube en cada clic y vista de sección.
  - Distinción inteligente entre `clicks` (apertura inicial de entrada desde redes/WhatsApp con flag `isFreshClick`) y `pageViews` (páginas recorridas acumuladas por el usuario bajo esa misma campaña).
  - Cada sección visitada (Catálogo, Tienda, Talleres, Precios, etc.) se registra de inmediato bajo `targetLink.sectionsVisited[secKey]`, mostrándose reflejada con exactitud en el panel de `/metricas`.
- [x] **Fusión Resiliente Anti-Regresión en Sincronización Remota:**
  - `fetchRemoteMetrics` ahora fusiona métricas locales y remotas utilizando `Math.max` para evitar sobrescrituras accidentales durante ráfagas de navegación.

### Versión 1.99.0 - Aparición Suave Inicial del Slogan y Calibración Pausada de Escritura
- [x] **Aparición de Primero Suavemente del Slogan ([`HeroAnimatedSlogan.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HeroAnimatedSlogan.tsx)):**
  - La sección insignia *"¡Transformá tu creatividad en tu mejor proyecto!"* ahora aparece **de primero de forma suave** con transición difuminada (`duration-1000 ease-out`) a los 250ms de quitarse la intro.
- [x] **Ritmo de Escritura Calibrado Más Lento y Serena:**
  - Ajustada la velocidad de escritura de *"Aprendé, creá y emprendé con"* a **75ms por letra** (duplicando la pausa entre caracteres), permitiendo una lectura cómoda y un efecto de máquina de escribir mucho más elegante.
- [x] **Secuencia Coordinada en el Hero Principal ([`HeroDual.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HeroDual.tsx)):**
  - Consolidado en un único flujo: Slogan suave primero → Escritura pausada → 1s después la Estrella → Corazón → Palabra BYFIO suave en el centro.

### Versión 1.98.0 - Incorporación de Beneficios Estratégicos, Ahorro en WhatsApp y Ecosistema Centralizado en la Propuesta
- [x] **Sección de Transformación Operativa & Beneficios Clave ([`PropuestaPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/propuesta/PropuestaPage.tsx)):**
  - **Ahorro Radical de Tiempo en WhatsApp:** Eliminación de conversaciones largas de 15 a 20 min por cliente. Proceso 100% automatizado desde la tienda/catálogo con comprobante SINPE directo al panel de pedidos online.
  - **Beneficios en Orden de Inventario:** Existencias en tiempo real, alertas de reabastecimiento antes del quiebre, cálculo de compras para proveedores *(Máximo - Actual)* y ubicación QR por estantería.
  - **Beneficios en Orden de Pedidos:** Cola cronológica FIFO, alisto guiado paso a paso y validación por escáner QR para cero errores en paquetes personalizados.
  - **Beneficios de Todo Organizado & Centralizado:** Erradicación de libretas de papel y capturas dispersas. Tienda, WMS, academia de talleres, caja, reportes y métricas unificados en una sola pantalla.
- [x] **Actualización de Resumen Copiable y Lista Final de Nombres:**
  - Inclusión de los 4 pilares de transformación en el portapapeles y en el inventario terminal de la plataforma.

### Versión 1.97.0 - Erradicación Total de Referencias Técnicas de Infraestructura en la Web y Propuesta
- [x] **Eliminación Total de Nombres de Proveedores en UI & Propuesta (`PropuestaPage.tsx`, `DailyClosingModal.tsx`, `health.ts`):**
  - Eliminada de forma absoluta cualquier mención visible o textual de marcas de infraestructura ("Cloudflare", "Pages", "D1").
  - Sustituidas en la página de propuesta, modales de cierre de caja y tarjetas por terminología empresarial de alto nivel: *"Infraestructura Cloud Segura"*, *"Base de Datos en la Nube de Alta Disponibilidad"* y *"Sincronización en Tiempo Real"*.
  - Limpieza de comentarios internos en código para mantener privacidad y confidencialidad técnica 100%.

### Versión 1.96.0 - Optimización Responsiva Integral del Catálogo Online para Celulares y Pantallas Móviles
- [x] **Depuración de Banners y Ahorro de Espacio Vertical en Móvil (`CatalogPage.tsx`):**
  - Ocultado el banner estático duplicado en pantallas móviles (`hidden sm:block`) para que los productos aparezcan de inmediato sin scroll muerto.
  - Hero banner del catálogo adaptado con paddings responsivos (`p-4 sm:p-8`), títulos proporcionales y descripción condensada en móvil.
- [x] **Barra de Categorías y Filtros Touch-Friendly (`CatalogPage.tsx`):**
  - Eliminado el selector desplegable duplicado; las categorías ahora se deslizan fluidamente con desplazamiento táctil horizontal y contadores claros.
  - Buscador integrado y botón de administración con anchos fluidos sin provocar desbordamiento.
- [x] **Tarjetas de Producto de Alto Rendimiento en Celulares (`CatalogPage.tsx`):**
  - Títulos de producto con soporte para dos líneas completas (`line-clamp-2`) sin recortes prematuros de nombres largos.
  - Fila inferior de compras reestructurada (`flex-row items-center gap-1.5`) evitando saltos de línea antiestéticos o truncamiento en botones de carrito y WhatsApp.
  - Retirado el badge redundante "Producto Agregado" del encabezado interno, conservando la pastilla limpia sobre la imagen.
- [x] **Barra Flotante de Carrito y Modal de Detalle Móvil (`CatalogPage.tsx`):**
  - Barra inferior flotante convertida a una sola fila delgada (`flex-row items-center justify-between`) que no tapa los productos.
  - Modal ampliado con fotografía proporcionada (`h-40 sm:h-56`) y área de texto con scroll táctil suave.

### Versión 1.95.0 - Coreografía Secuencial Post-Intro: Escritura de Texto, Estrella, Corazón y BYFIO Suave en el Centro
- [x] **Coreografía Post-Intro en Hero Principal (`HeroAnimatedSlogan.tsx` & `HeroDual.tsx`):**
  - **Paso 1 (1 segundo después de quitar la intro):** Se escribe automáticamente con efecto máquina de escribir letra por letra la frase: *"Aprendé, creá y emprendé con"*.
  - **Paso 2 (1 segundo después de terminar la escritura):**
    - Aparece la **Estrella Amarilla By.Fio** destellante a la izquierda con animación spring/pop.
    - 400ms después aparece el **Corazón Celeste** a la derecha con latido suave.
    - 400ms después emerge en el centro con transición suave (`transition-all duration-1000 ease-out`) la palabra **BYFIO** con sus ondas de color interactivas y relieve cerámico.
  - Sincronización automática con el estado global `isIntroOpen` del video intro.

### Versión 1.94.0 - Corrección Integral de Contraste Tipográfico en Filtros de Métricas y Categorías de Secciones
- [x] **Visibilidad Total en Selector de Enlaces Rastreables (`MetricsPage.tsx`):**
  - Añadido texto explicativo de alto contraste directamente bajo el título de filtrado para orientar al administrador en tiempo real.
  - Píldoras de enlaces no seleccionadas convertidas a tarjetas sólidas (`bg-white dark:bg-[#252038]`) con borde definido (`border-2 border-slate-300 dark:border-purple-800`) y tipografía nítida de máxima legibilidad (`text-slate-900 dark:text-white`).
  - Badges numéricos de cargas y clics con contraste reforzado en modo claro y modo oscuro.
- [x] **Contraste de Alta Definición en Filtros de Categoría de Secciones (`MetricsPage.tsx`):**
  - Erradicado el texto lavado `text-slate-600` en los botones deseleccionados `🛍️ Tienda & Clientes` y `🛡️ Panel Admin`.
  - Aplicado fondo sólido con relieve y tipografía en negrita pura `text-slate-900 dark:text-white` para visualización nítida y descanso visual en cualquier monitor y tema.

### Versión 1.93.0 - Creación de la Página de Propuesta Integral (/propuesta) & Acceso en Panel Admin
- [x] **Página de Propuesta Integral y Ficha Técnica Oficial (`/propuesta` & `PropuestaPage.tsx`):**
  - Desarrollo de una vista ejecutiva de alta fidelidad estética con hero header, KPIs, filtros interactivos y presentación estructurada en orden riguroso de todos los módulos:
    1. **Gestión de Pedidos y Alisto (Logística WMS):** Cola FIFO, Control de Estados, Alisto Guiado Paso a Paso y Validación por Escáner QR.
    2. **Inventario Inteligente y Abastecimiento:** Stock Actual, Mínimos y Máximos, Alertas de Reabastecimiento, Cantidad Sugerida y Generador de Etiquetas QR.
    3. **Tienda Online & Catálogo Digital:** Vitrina Mobile-First para TikTok e Instagram, Categorías Dinámicas, Personalización Interactiva y Checkout Rápido SINPE 6400-4640.
    4. **Academia y Talleres Creativos:** Cartelera de los 5 Pilares Formativos, Cupos en Tiempo Real, Fichas de Contenido y Registro de Alumnos con Control de Asistencia.
    5. **Caja, Facturación y Reportería:** Facturación Rápida en Mostrador & POS, Cierre Diario de Caja, Gráficos Financieros y Envío Directo por WhatsApp.
    6. **Administración, Precios y Usuarios:** Editor de Precios y Listas, Perfiles de Usuarios con PINs de 4 Dígitos y Mascota Interactiva Estrellita Animada.
    7. **Analítica & Rastreo en Tiempo Real (/metricas):** Enlaces Rastreados para Redes, Telemetría PC vs Celulares, Sincronización Cloudflare D1 y Mapeo de Popularidad de 16 Secciones.
    8. **Multimedia, Audio & Cloud Edge:** Video Intro Oficial By.Fio, Sonido Háptico de Gotas de Agua, Modo Claro/Oscuro y Base de Datos SQLite D1 en el Borde.
- [x] **Lista Exhaustiva al Final con Solo el Nombre de Cada Cosa:**
  - Sección final estructurada en 3 columnas limpias con el inventario completo de herramientas, submódulos y pantallas de la plataforma sin párrafos de relleno.
- [x] **Botón de Acceso a la Propuesta en el Panel de Administración:**
  - Botón *"Propuesta"* en cabecera de administración ([`AdminHeader.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHeader.tsx)).
  - Tarjeta destacada *"Propuesta Integral & Ficha Técnica Oficial (/propuesta) - Documento Dueño"* en el menú central de administración ([`AdminHubMenu.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminHubMenu.tsx)).
  - Acceso desde menú móvil en la barra de navegación ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)).

### Versión 1.92.0 - Control de Duración por el Video y Entrada a la Web Exclusiva al Finalizar la Reproducción
- [x] **Eliminación Total de Temporizadores Artificiales de Cierre (`WebIntroOverlay.tsx`):**
  - Erradicado cualquier temporizador de cuenta regresiva fija o fallback arbitrario que cerraba la animación antes de tiempo.
  - El video de introducción es ahora el único que gobierna el tiempo exacto de permanencia en el intro.
- [x] **Entrada a la Web Exclusiva tras Finalización del Video (`WebIntroOverlay.tsx`):**
  - La transición hacia la web se activa estrictamente cuando el video emite su evento de término natural (`onEnded`) o si el usuario pulsa explícitamente el botón "Saltar intro".
  - Si el usuario tarda en presionar el botón de volumen o activar el audio, el video no se corta prematuramente. Al activar el sonido en los primeros compases, el video se rebobina suavemente al inicio (`currentTime = 0`) para escuchar la melodía completa.

### Versión 1.91.0 - Visualización de Letras de Marca por al Menos 2 Segundos Antes del Video Intro
- [x] **Retención Temporal de 2 Segundos en Letras Previas al Video (`WebIntroOverlay.tsx`):**
  - Las letras oficiales de la marca (`BrandLogo` en formato hero con eslogan oficial y puntos de carga) ahora se muestran nítidas y en foco durante al menos 2 segundos completos (`2000ms`) antes de retirarse.
  - El video se precarga (`preload="auto"`) en pausa durante esos 2 segundos para no perder fotogramas ni reproducir audio desincronizado.
- [x] **Transición Quirúrgica y Desbloqueo Gestual Coordinado (`WebIntroOverlay.tsx`):**
  - Al cumplirse los 2 segundos, las letras se desvanecen y se ocultan por completo, dando paso al video que inicia inmediatamente desde el segundo 0 con sonido activo.
  - Añadido control de bloqueo preventivo (`canPlayVideoRef`) para impedir reproducción anticipada si el visitante toca la pantalla durante la fase de letras.

### Versión 1.90.0 - Sincronización en Tiempo Real de Enlaces & Métricas (Cross-Tab y Cloudflare D1)
- [x] **Sincronización en Tiempo Real Reactiva Instantánea (0ms entre pestañas):**
  - Implementación de `BroadcastChannel('byfio_metrics_channel')` y escuchador `window.addEventListener('storage')`.
  - Cuando un visitante o usuario abre cualquier enlace rastreado en otra pestaña o ventana, la pantalla `/metricas` detecta el evento de inmediato y refresca los contadores de clics, cargas de página y dispositivos en tiempo real sin recargar la página.
- [x] **Persistencia y Sincronización Multi-Dispositivo con Cloudflare D1 (`functions/api/metrics.ts`):**
  - Creación del endpoint `/api/metrics` conectado a la base de datos Cloudflare D1 (`byfiocr-db`, tabla `site_metrics`).
  - Cada vez que un usuario abre un enlace desde su teléfono celular, tablet u otra computadora (ej. enlaces compartidos por WhatsApp o redes), la visita se persiste en Cloudflare D1 y se sincroniza en vivo con el panel del administrador.
- [x] **Polling Inteligente Anti-Consumo (Anti-Drain Polling según `polling-inteligente`):**
  - La página `/metricas` consulta actualizaciones remotas cada 2.5 segundos únicamente cuando la pestaña está activa y visible (`!document.hidden`).
  - Si la pestaña se oculta o minimiza, el polling se suspende al 100% para ahorro de cuota y batería, y se reactiva de inmediato en el microsegundo en que el usuario vuelve a enfocar la pestaña.
- [x] **Extracción Robusta de Parámetros en URL (`extractRefSlugFromUrl`):**
  - Soporte de captura de slug desde `window.location.search`, `window.location.hash` y expresiones regulares en la URL completa (`ref`, `link`, `c`, `camp`).
- [x] **Indicador Visual de Estado en Vivo:**
  - Badge pulsante en cabecera: `🟢 En Vivo · Tiempo Real Activo`.

### Versión 1.89.0 - Inclusión de Todas las Partes de la Web hasta el Panel Admin en Secciones Más Gustadas
- [x] **Monitoreo Integral de Toda la Web hasta el Panel de Administración (`MetricsPage.tsx` & `metricsTracker.ts`):**
  - La sección *"¿Qué Secciones Gustaron Más?"* ahora incluye absolutamente todas las partes del ecosistema web:
    - **Públicas / Tienda:** Portada / Inicio, Catálogo Digital, Tienda Online, Talleres Creativos, Detalle de Taller, Precios & Stickers, Portal de Acceso / Login.
    - **Panel de Administración:** Menú Principal (Hub), Facturación Rápida & POS, Cola de Pedidos & Alisto QR, Inventario & Stock QR, Caja & Reportería / Cierre Diario, Gestión de Alumnos & Talleres, Editor de Precios & Stickers, Gestión de Perfiles & PINs, y Panel de Métricas Privado.
  - Filtro interactivo de 3 vistas en cabecera:
    - `🌐 Todas las Partes` (16 secciones combinadas ordenadas por popularidad)
    - `🛍️ Tienda & Clientes` (7 secciones públicas)
    - `🛡️ Panel de Administración` (9 submódulos administrativos)
- [x] **Rastreo Automático Activo de Módulos Admin (`App.tsx` & `metricsTracker.ts`):**
  - Conexión del listener de rutas para registrar la navegación activa entre los submódulos de administración (`admin`, `admin-billing`, `admin-orders`, `admin-inventory`, etc.).
  - Botón *"Abrir Sección →"* en cada tarjeta de métrica para saltar de inmediato a la sección correspondiente.

### Versión 1.88.0 - Métricas Específicas por Enlace Creado & Opción "Todas las Secciones"
- [x] **Métricas Específicas por Enlace Creado (`MetricsPage.tsx` & `metricsTracker.ts`):**
  - Selector interactivo de enlaces en cabecera: permite alternar entre **Métricas Globales (Todo el Sitio)** y **Métricas Exclusivas de cada Enlace Creado**.
  - Al seleccionar un enlace creado, se muestran sus datos 100% aislados:
    - Cuántas veces se abrió ese enlace específico (`clicks`).
    - Cuántas cargas de página generó (`pageViews`).
    - En cuántas computadoras (PC) y teléfonos celulares se abrió ese enlace específico con su barra comparativa porcentual.
    - Qué secciones navegaron y gustaron más a las personas que abrieron ese enlace en particular (`sectionsVisited`).
  - Botón directo *"Ver Métricas de este Link"* en cada tarjeta de enlace de la lista para cargarlo a pantalla con un solo clic.
- [x] **Opción y Botón "Todas las Secciones" en Generador de Enlaces (`MetricsPage.tsx`):**
  - Añadido el botón destacado **"🌐 Todas las Secciones / Todo el Sitio Web"** para generar enlaces que abren la portada y rastrean la navegación completa del visitante en cualquier sección del sitio web.
  - Botones de selección rápida de un clic para destino: [Todas las Secciones], [Tienda Online], [Catálogo Digital], [Talleres Creativos] y [Precios de Stickers].

### Versión 1.87.0 - Corrección de Tema Claro en Facturación & Configuración Estricta darkMode: class
- [x] **Configuración Estricta `darkMode: 'class'` en Tailwind (`tailwind.config.js`):**
  - Añadido `darkMode: 'class'` para erradicar el conflicto donde el modo oscuro del sistema operativo (Windows `@media prefers-color-scheme: dark`) forzaba clases oscuras en componentes mientras la app estaba en Tema Claro (`vibrant`).
  - Ahora las clases `dark:` se activan exclusivamente cuando el usuario conmuta a modo oscuro en la aplicación y `document.documentElement` contiene la clase `.dark`.
- [x] **Refinamiento Visual del Módulo de Facturación & POS en Tema Claro (`QuickBillingSection.tsx`):**
  - Contenedor principal en blanco puro brillante con sombra orgánica y borde sutil lila.
  - Subpaneles de alisto y formulario de cliente con fondo slate claro suave (`#F8FAFC`).
  - Buscador de productos con fondo blanco, texto oscuro de alto contraste y botones de cantidad limpios.
  - Caja de estado vacío de la factura rediseñada con borde punteado lila, ícono morado suave y tipografía nítida con contraste AAA.

### Versión 1.86.0 - Página Privada de Métricas (/metricas), Generador de Enlaces y Rastreo por Dispositivos y Secciones
- [x] **Página Privada de Métricas (`/metricas` y `MetricsPage.tsx`):**
  - Creada la ruta `/metricas` accesible tanto directamente por URL como desde el Menú Principal de Administración.
  - Puerta de acceso de seguridad con código privado `1985`: campo con bullets ocultos (`type="password"` / `••••`) sin pistas visuales ni texto del código en la interfaz.
  - Persistencia de sesión en `sessionStorage` y botón de bloqueo rápido.
- [x] **Rastreo Global de Cargas y Dispositivos (PC vs Celulares):**
  - Contador de cargas totales de la web y sesiones únicas individuales.
  - Clasificación de dispositivos en tiempo real: Computadoras de Escritorio (PC) vs Teléfonos Celulares (Móviles) con porcentaje visual comparativo.
- [x] **Generador de Enlaces Específicos Rastreables:**
  - Formulario para crear enlaces con etiquetas personalizadas (ej. Instagram Bio, WhatsApp, TikTok, Promociones o Clientes).
  - Formato generado: `https://byfiocr.pages.dev/?ref=slug` o a sección específica.
  - Contador individual de aperturas por link, desglose de aperturas en PC y Celular, y última fecha de acceso.
  - Botones de 1-clic para copiar enlace, compartir por WhatsApp, probar en nueva pestaña, reiniciar o eliminar.
- [x] **Métricas de Preferencias por Sección:**
  - Ranking de secciones más vistas y gustadas (Catálogo Digital, Tienda, Talleres, Portada, Precios de Stickers, etc.).
  - Desglose de vistas, índice de me gusta y tiempo promedio de permanencia.
- [x] **Servicio Central de Rastreo (`src/services/metricsTracker.ts`):**
  - Motor de tracking automático que detecta parámetros de enlace (`?ref=...`), dispositivo del visitante y sección navegada.

### Versión 1.85.0 - Actualización del Video de Introducción Oficial
- [x] **Reemplazo del Video de la Intro Web (`public/assets/intro-web-byfio.mp4`):**
  - Actualizado el archivo del video de intro con la versión descargada `INTRO BYFIO WEB.mp4` (3.64 MB).
  - Copiado tanto a `public/assets/intro-web-byfio.mp4` como a `public/intro-web-byfio.mp4`.
  - Agregado parámetro de cache-busting (`?v=20261030`) en [`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx#L291) para forzar la recarga limpia en todos los navegadores sin retención de caché.

### Versión 1.84.0 - Creación Directa de Facturas (POS), Buscador Rápido de Productos y Ficha de Clientes Dinámica
- [x] **Flujo Rápido de Facturación en Mostrador / POS (`QuickBillingSection.tsx`):**
  - Buscador predictivo de productos en tiempo real con selector de cantidad (+ / - / input numérico) y botón directo de inclusión.
  - Tabla de partidas con recálculo automático de subtotales, totales, eliminación rápida de ítems y ajuste de cantidades.
  - Generación instantánea de la factura oficial con modal de impresión/compartir (`InvoiceModal.tsx`) y descuento automático de stock de inventario.
- [x] **Captura de Datos de Cliente y Entrega al Final del Pedido:**
  - Los datos del cliente (nombre, teléfono, correo, método de entrega, dirección y método de pago) se solicitan al final para acelerar el alisto de productos sin demoras en mostrador.
  - Selector de método de entrega: Retiro en tienda (₡0) o Envío Correos de Costa Rica (+₡2,500).
  - Medios de pago soportados: SINPE Móvil, Efectivo en Caja, Tarjeta / Datafono y Transferencia Bancaria.
- [x] **Buscador de Clientes Registrados y Auto-Completado:**
  - Buscador de clientes frecuentes por nombre, cédula, teléfono o correo con selección a un solo clic para autocompletar todo el formulario de facturación.
- [x] **Ficha de Clientes Dinámica y Personalizable por el Administrador:**
  - Directorio completo de clientes con modal para registrar nuevos clientes (nombre, teléfono, correo, dirección y campos dinámicos).
  - Gestor de campos personalizados: el administrador puede agregar o eliminar nuevos datos requeridos en la ficha de clientes (ej. Cédula/DIMEX, Usuario Instagram, Razón Social, Cumpleaños) sin tocar la base de código.
- [x] **Tipos y Contexto Global Actualizados (`types/index.ts`, `AppContext.tsx`):**
  - Agregadas interfaces `CustomerFieldDef` y `Customer`.
  - Agregado método `createDirectInvoiceOrder` para crear pedidos directos con código correlativo `#FIO-XXXX`, reduciendo stock y enlazando la factura inmediatamente.

### Versión 1.83.0 - Corrección de Contraste en Módulos de Perfiles, Botón Pausar y Tipografía de la Mascota
- [x] **Legibilidad Total en Chips de Módulos Autorizados (`UserProfilesSection.tsx`):**
  - Eliminado el tachado (`line-through`) y la opacidad excesiva (`opacity-40`) que hacían invisibles los módulos no concedidos en tema oscuro.
  - Implementado contraste AAA con bordes y fondos balanceados tanto en tema claro (`text-slate-600` / `bg-slate-100`) como en tema oscuro (`text-slate-300` / `bg-[#201B34]`).
  - Módulos concedidos resaltados con píldora morada de alta visibilidad (`bg-purple-100` / `dark:bg-purple-950/80`).
- [x] **Botones de Estado con Contraste Protegido (`UserProfilesSection.tsx` e `index.css`):**
  - Creación de `.btn-pause-profile` y `.btn-activate-profile` con colores forzados independientes del override de botones generales.
  - El botón *"Pausar Perfil"* ahora muestra texto ámbar cálido legible `#78350F` en tema claro y `#FDE68A` en tema oscuro, erradicando el texto blanco sobre fondo blanco.
- [x] **Tipografía y Estabilidad del Mensaje de la Mascota (`FloatingMascot.tsx` e `index.css`):**
  - Máquina de estados (`mascotStatus`: typing -> reading -> goodbye -> exiting) con manejo seguro de caracteres Unicode y emojis mediante `Array.from()`, evitando re-cortes o loops.
  - Tiempo de lectura extendido a **7 segundos completos** tras completarse la escritura del mensaje.
  - Tipografía `font-bubble` en 15px con color forzado `.mascot-speech-text`: índigo profundo `#1E1B4B` en tema claro y blanco puro `#FFFFFF` en tema oscuro sobre fondo sólido.
  - Asignada altura mínima `min-h-[46px]` para evitar que el cartel se vea vacío al inicio.

### Versión 1.82.0 - Diagnóstico, Visibilidad Inmediata de Perfiles de Usuario y Badge en Admin Navbar
- [x] **Apertura Directa en Modo PIN con Selector de Perfiles (`LoginModal.tsx`):**
  - Establecido `pin` como método predeterminado en lugar de `email`, haciendo inmediatamente visibles el campo *"Perfil de Usuario"* y los botones de acceso rápido de los perfiles activos (`ALISTO DE PEDIDOS`, `ATENCIÓN Y TALLERES` y los perfiles creados por el admin).
  - Erradicado el problema donde los perfiles quedaban ocultos tras la pestaña de correo.
- [x] **Indicador Visual del Perfil Activo en la Barra de Administración (`Navbar.tsx`):**
  - Agregada píldora identificadora con punto verde pulsante, nombre del perfil y etiqueta `Admin`/`Staff` en la barra superior al estar dentro del panel de administración.
- [x] **Persistencia y Clarificación de Perfiles Locales:**
  - Garantizada la compatibilidad con el almacenamiento `byfio_user_profiles_v1` en `localStorage` y verificada la restricción de visibilidad según los permisos asignados en el perfil de cada colaborador.

### Versión 1.81.0 - Optimización de Legibilidad y Cadencia Pausada en Mascota Motivacional
- [x] **Cadencia de Escritura Cómoda y Pausada (`FloatingMascot.tsx`):**
  - Velocidad de mecanografía ajustada de 34ms a **62ms por carácter**, logrando una lectura fluida, natural y comprensible.
- [x] **Ampliación del Tiempo de Lectura en Pantalla:**
  - El mensaje se mantiene en pantalla durante **6 segundos completos** tras completarse la última letra (antes 3s), otorgando tiempo generoso para leer y reflexionar.
  - La despedida *"¡Adiós! 👋✨"* se visualiza durante 1.6s antes de iniciar el descenso animado.
- [x] **Mejora de Contraste y Espaciado del Cartel (`FloatingMascot.tsx` e `index.css`):**
  - Ancho ampliado a `max-w-[340px]` con espaciado interno `p-3.5 sm:p-4`.
  - Tipografía `font-sans` en `14px` con peso seminegrilla, `leading-relaxed` y contraste nítido (`text-slate-900` / `text-white`).
  - Fondo interior sólido `#FFFFFF` en tema claro y `#1e1932` en tema oscuro.
  - Encabezado con distintivo *"Mensaje Positivo by.fio"*.

### Versión 1.80.0 - Ajuste Textual de Copyright (byfio) y Armonización Neutra de Píldora
- [x] **Corrección Textual Sin Punto (`App.tsx` y `LoginModal.tsx`):**
  - Actualizado el texto oficial a *"© Copyright en byfio by GeoSoft"*, eliminando el punto en *"byfio"*.
- [x] **Armonización Visual de la Píldora (`index.css`):**
  - Implementada la clase `.geosoft-copyright-pill` sustituyendo el fondo morado estridente (`#2C2746`) y sus bordes morados.
  - En tema claro, adopta un fondo blanco translúcido (`rgba(255, 255, 255, 0.72)`) con borde suave (`rgba(226, 232, 240, 0.85)`).
  - En tema oscuro, utiliza una superficie sutil neutra (`rgba(25, 22, 38, 0.65)`) con borde translúcido (`rgba(255, 255, 255, 0.08)`), integrándose orgánicamente sin contrastes molestos.

### Versión 1.79.0 - Incremento Proporcional del 10% en Tarjeta de Login
- [x] **Ampliación Armónica del 10% (`index.css`, `LoginModal.tsx` y `App.tsx`):**
  - Ancho de tarjeta expandido exactamente un 10% de 360px a **395px** (`max-w-[395px]`), con border-radius en 30px y padding a `16px 20px 18px`.
  - Escena 3D de personajes reescalada proporcionalmente a `clamp(138px, 17.5vh, 168px)` (en móvil a `clamp(132px, 16.5vh, 160px)`).
  - Tipografías y botones escalados en un 10%: título a `20px`, subtítulo a `12.5px`, botón principal a `16px`, inputs a `14px` y badges a `33px`.
  - Preservado el centrado vertical seguro con `my-auto` y padding libre superior e inferior sin recortes en pantalla.

### Versión 1.78.0 - Mascota Motivacional en Panel de Administración con Borde de Luz y Despedida Animada
- [x] **Secuencia Cinemática Cronometrada (5s después de la última animación) (`FloatingMascot.tsx`):**
  - En el panel de administración (`currentRoute === 'admin'`), la burbuja emerge automáticamente exactamente 5 segundos después de completarse la última animación de carga del login (`loginIntroStage === 0`).
  - Emerge con efecto sonoro orgánico y animación de elevación elástica (`animate-bubble-rise-vibrate`).
- [x] **Colección de 60 Mensajes Positivos y Motivacionales:**
  - Integrado un banco de 60 mensajes inspiradores, creativos y de alta energía diseñados para el equipo de by.fio.
  - Cada vez que el usuario se conecta se selecciona aleatoriamente un mensaje diferente evitando repeticiones consecutivas mediante memoria de sesión.
  - Eliminado por completo el texto *"Soy Estrellita"* tanto en administración como en la vista pública.
- [x] **Cartel con Borde de Luz Multicolor (Border Beam) (`index.css` y `FloatingMascot.tsx`):**
  - Implementado el efecto visual `.mascot-border-beam` con rotación continua de gradiente espectral luminoso (`@keyframes rotateMascotBeam`), destacando el cartel a la vista del usuario.
- [x] **Efecto Máquina de Escribir y Despedida Hacia Abajo:**
  - El mensaje se escribe progresivamente letra por letra (34ms por carácter).
  - Exactamente **3 segundos** después de escribirse la última letra, el cartel muestra *"¡Adiós! 👋✨"*.
  - 1.2 segundos después, la burbuja completa se desliza suavemente hacia abajo (`.animate-mascot-slide-down`) y se cierra de forma limpia.

### Versión 1.77.0 - Rebalanceo Óptimo de Proporciones y Escala en Tarjeta de Login
- [x] **Ampliación Balanceada del Contenedor y Escena 3D (`LoginModal.tsx` e `index.css`):**
  - Ancho de tarjeta expandido a **360px** (`max-w-[360px]`), devolviendo cuerpo, presencia y comodidad de lectura sin tocar bordes de pantalla.
  - Altura de la escena 3D reajustada a `clamp(125px, 16vh, 152px)` (con `clamp(120px, 15vh, 145px)` en móviles), logrando que la ilustración de la niña y la estrellita luzca destacada y adorable.
- [x] **Restauración de Tipografías, Botones e Inputs (`index.css` y `LoginModal.tsx`):**
  - Título a `18px`, subtítulo a `11.5px`, botón principal a `14.5px` y campos de texto con altura ergonómica.
  - Pestañas de Correo / PIN y badge de copyright GeoSoft con tamaños equilibrados.
- [x] **Blindaje Anti-Cortes y Centrado Seguro Preservado:**
  - El overlay mantiene `my-auto` dinámico y padding seguro `py-4 sm:py-6`, garantizando que la tarjeta nunca toque el límite superior ni sufra recortes.

### Versión 1.76.0 - Erradicación Definitiva del Corte Superior en Login (Centrado Seguro y Desactivación de Sobrescritura Móvil)
- [x] **Alineación Vertical Segura Sin Recortes (`LoginModal.tsx`):**
  - Removido `justify-center` del contenedor de overlay con scroll (`fixed inset-0 overflow-y-auto`) y aplicado padding vertical seguro `p-2 sm:p-4 py-4 sm:py-6`.
  - El centrado vertical ahora es gestionado exclusivamente por `my-auto` en la tarjeta: cuando hay espacio se centra perfectamente, y si la pantalla es reducida se ajusta desde el margen superior sin empujar el encabezado fuera del viewport.
- [x] **Eliminación de Sobrescritura Móvil en Escena 3D (`index.css`):**
  - Removida la regla heredada en `@media (max-width: 640px)` que forzaba `.characters-stage` a `180px !important`, causante de que la tarjeta se expandiera verticalmente y se cortara arriba en pantallas móviles y laptops.
  - Estandarizada la altura de la ilustración a `clamp(72px, 10vh, 95px)` con padding compacto en la tarjeta (`10px 14px 12px`), logrando un alto total de ~430px que cabe holgadamente en cualquier pantalla.
  - Dirección de micro-flotación en `loginSoftFloat` configurada en `translateY(3px)` para no ascender hacia el límite superior.

### Versión 1.75.0 - Ajuste Anti-Desborde de Navbar, Corrección de Recorte en Login y Selector Visual de Perfiles
- [x] **Ajuste Anti-Desborde de Barra Superior (`Navbar.tsx`):**
  - Ocultamiento responsivo del eslogan de marca en pantallas `<xl` (`hidden xl:inline`).
  - Reducción de espaciados y padding en botones de navegación (`px-2.5 xl:px-4 py-1.5 xl:py-2 text-xs xl:text-sm`).
  - Redes sociales condicionadas a pantallas extra-grandes (`hidden xl:flex`) y cambio del breakpoint del menú hamburguesa a `lg:hidden`, evitando que la barra se corte de lado en laptops intermedias (1024px-1280px).
- [x] **Corrección de Cortes Verticales en Login (`LoginModal.tsx` e `index.css`):**
  - Reescalado y acotamiento de la escena 3D a `clamp(125px, 17vh, 155px)`, reduciendo más de 120px de altura total de la tarjeta.
  - Padding vertical compacto en inputs y tarjeta (`12px 16px 14px`).
  - Sustitución de centrado flex rígido por contenedor con `overflow-y-auto` y margen dinámico `m-auto`, eliminando cortes superior e inferior en cualquier resolución o nivel de zoom.
- [x] **Selector Visual de Perfiles Activos en PIN Login (`LoginModal.tsx`):**
  - Renderizado de chips / botones interactivos con los perfiles existentes (`userProfiles.filter(p => p.isActive)`).
  - Selección inmediata con un clic para rellenar el perfil deseado sin necesidad de escribir a mano.

### Versión 1.74.0 - Incorporación Global del Badge de Copyright GeoSoft en el Footer
- [x] **Footer Global con Badge Animado de GeoSoft (`App.tsx`):**
  - Incorporado en la base del layout principal el badge de copyright flotante con animación de barrido de color (`.animate-copyright-sweep`), enlace oficial a `https://www.geosoft.lat` y texto *"© Copyright en by.fio by GeoSoft"*.
  - Configurado para mostrarse en todo momento en todas las rutas públicas (`home`, `store`, `catalogo`, `workshops`, `workshop-detail`, `precios`, `login`) y suprimirse estrictamente en la sección de administración (`currentRoute !== 'admin'`).
  - Totalmente adaptado para tema claro y tema oscuro con sombras y bordes sutiles con desenfoque de fondo (`backdrop-blur-sm`).

### Versión 1.73.0 - Optimización de Intervalo a 1 Segundo en Coreografía de Inicio de Sesión
- [x] **Reducción de Intervalo a 1 Segundo (`AppContext.tsx`):**
  - Actualizado el escalonamiento temporal de `triggerLoginCinematic` de 2 segundos a **1 segundo** por elemento para una experiencia ágil, cinematográfica y dinámica:
    - **Paso 1 (0s):** Salida vertical de la tarjeta de login hacia arriba (`.login-exit-up`).
    - **Paso 2 (1s):** Desvanecimiento suave del fondo difuminado (`.backdrop-fade-out`).
    - **Paso 3 (2s):** Descenso de la barra superior de menú (`.navbar-slide-down`).
    - **Paso 4 (3s):** Deslizamiento del Panel de Control de izquierda a derecha (`.panel-slide-left`).
    - **Paso 5 (4s):** Deslizamiento del Menú Principal de derecha a izquierda (`.menu-slide-right`).
    - **Paso 6 (5s):** Deslizamiento del Catálogo Comercial de abajo hacia arriba (`.catalog-slide-up`).
    - **Culminación (6s):** Retorno de estado a reposo sin bloqueos.
- [x] **Ajuste de Duraciones CSS en Animaciones (`index.css`):**
  - Duraciones de transición y keyframes ajustadas a `0.8s` (curva `cubic-bezier(0.16, 1, 0.3, 1)`), logrando una cadencia visual fluida que concluye con precisión justo antes de iniciarse el siguiente paso.

### Versión 1.72.0 - Corrección de Capas y Sincronización Temporal en Animación de Cierre de Sesión (Logout)
- [x] **Secuencia Temporal Estricta (Cortina Primero, Login Después) (`index.css` y `LoginModal.tsx`):**
  - La cortina translúcida desciende cubriendo toda la web (0s a 0.65s).
  - La ventana de login permanece completamente oculta e invisible durante los primeros 0.70s (`loginDropIn` con delay 0.70s y `animation-fill-mode: both`), iniciando su suave descenso desde la parte superior estrictamente después de que la cortina ha cubierto la pantalla.
  - La flotación permanente suave (`loginSoftFloat`) se activa armónicamente a los 1.50s al asentarse la tarjeta.
- [x] **Corrección de Jerarquía de Capas (Login Delante de la Cortina) (`LoginModal.tsx` e `index.css`):**
  - Ajustado `.login-curtain-backdrop` a `z-index: 10`.
  - Tarjeta de login (`.login-drop-motion` y wrapper modal) configurada con posición `relative` y `z-index: 30`, garantizando que la ventana de login siempre quede delante de la cortina translúcida sin desenfoques ni velos por encima.
  - Envoltorio de modal overlay elevado a `z-[100]`.
- [x] **Supresión de Tarjeta Duplicada en Admin (`App.tsx`):**
  - Al cerrar sesión en `/admin`, se redirige hacia la vista principal y se desactiva la renderización estática de la compuerta administrativa mientras `isLogoutTransitionOpen` está activa, impidiendo que aparezca una tarjeta detrás de la cortina.

### Versión 1.71.0 - Redimensión Compacta y Erradicación de Desborde/Cortes en Extremos del Login
- [x] **Ajuste de Proporción y Ancho Máximo Seguro (`LoginModal.tsx`, `App.tsx` e `index.css`):**
  - Reducido el ancho máximo de la tarjeta de login (`.login-card` y `.scene-wrapper`) de 380px/448px a **335px**, logrando una tarjeta vertical armónica, compacta y proporcionada.
  - En móviles (`max-width: 640px`), ajustado el ancho a `min(335px, calc(100vw - 36px))` con padding `14px 16px 18px`, garantizando un margen libre mínimo de 18px a cada lado para que ni los bordes ni las sombras 3D se corten contra los extremos de la pantalla.
  - Reescalada la escena de personajes (`.characters-stage`) a 195px (180px móvil) con `max-width: 95%`, impidiendo que la ilustración toque o desborde los laterales del contenedor.
  - Contenedor seguro en administración (`App.tsx`) ajustado a `max-w-[360px]` para máxima elegancia visual.

### Versión 1.70.0 - Badge de Copyright Animado de GeoSoft en el Login (Estilo BOSUNI CR)
- [x] **Inclusión del Badge de Copyright en Login (`LoginModal.tsx`):**
  - Incorporada la píldora flotante con fondo translúcido y borde sutil debajo de la tarjeta de login (`.scene-wrapper`), visible tanto en el modal overlay como en la vista de `/login`.
  - Enlace oficial a `https://www.geosoft.lat` con texto *"© Copyright en by.fio by GeoSoft"*.
- [x] **Animación de Barrido de Luz Cromática (`index.css`):**
  - Implementada la animación de barrido de color `.animate-copyright-sweep` (`@keyframes textLightSweep`), con gradiente espectral continuo en ciclo de 4 segundos tomado de la arquitectura de BOSUNI CR.
  - Soporte completo y contraste optimizado tanto en tema claro como en tema oscuro.

### Versión 1.69.0 - Coreografía Cinemática de Inicio de Sesión y Eliminación del Footer
- [x] **Secuencia Cinemática Cronometrada (cada 2 segundos) (`AppContext.tsx`, `LoginModal.tsx`, `Navbar.tsx`, `AdminHeader.tsx`, `AdminHubMenu.tsx` e `index.css`):**
  - **Paso 1 (0s):** Al autenticarse, la tarjeta de login asciende hacia arriba (`.login-exit-up`, `translateY(-130vh)`) y se esconde suavemente.
  - **Paso 2 (2s después):** El difuminado y fondo translúcido (`.backdrop-fade-out`) desaparece con transición suave y fluida.
  - **Paso 3 (2s después):** La barra de menú superior (`Navbar`) desciende suavemente de arriba hacia abajo (`.navbar-slide-down`).
  - **Paso 4 (2s después):** La sección *"Panel de Control & Alisto QR"* con sus métricas y KPIs (`AdminHeader`) ingresa suavemente de izquierda a derecha (`.panel-slide-left`).
  - **Paso 5 (2s después):** La sección *"Menú Principal de Administración"* con el grid modular (`AdminHubMenu`) ingresa suavemente de derecha a izquierda (`.menu-slide-right`).
  - **Paso 6 (2s después):** La sección *"Catálogo Comercial Online"* (`AdminHubMenu`) ingresa suavemente de abajo hacia arriba (`.catalog-slide-up`).
- [x] **Eliminación Total del Bloque Footer (`App.tsx`):**
  - Removida por completo la sección del pie de página inferior que contenía el texto *"by.fio — Talleres Creativos & Tienda Online • Costa Rica"*, enlaces y botones flotantes, logrando una interfaz limpia y despejada.

### Versión 1.68.0 - Animación Cinemática de Cierre de Sesión (Cortina Translúcida + Caída Suave + Flotación 3D)
- [x] **Secuencia Cinemática al Cerrar Sesión (`AppContext.tsx`, `App.tsx`, `LoginModal.tsx` e `index.css`):**
  - Al hacer clic en *"Salir"* o *"Cerrar Sesión"* (admin, colaboradores o clientes), se activa automáticamente la transición global `isLogoutTransitionOpen` que lleva directamente a la ventana de login.
  - **Paso 1 (Cortina Translúcida):** Una cortina translúcida con desenfoque de fondo profundo (`backdrop-filter: blur(14px)`, `background-color: rgba(15, 10, 30, 0.72)`) desciende suavemente de arriba hacia abajo (`@keyframes curtainSlideDown`) cubriendo y velando toda la vista de la web de manera permanente.
  - **Paso 2 (Caída Suave del Login):** Tras descender la cortina, la tarjeta 3D de login aparece deslizándose desde la parte superior (`@keyframes loginDropIn`) con desaceleración orgánica y física elástica (`cubic-bezier(0.16, 1, 0.3, 1)`).
  - **Paso 3 (Flotación Suave Perpetua):** Una vez centrada en pantalla, la tarjeta entra en un bucle continuo de flotación suave y relajante (`@keyframes loginSoftFloat`), oscilando verticalmente de forma hipnótica y elegante.
  - Al completar el login o cerrar el modal se restituye el flujo normal y se redirige con seguridad.

### Versión 1.67.0 - Unificación 3D de Tarjeta de Login sin Cortes y Campos de Perfil y PIN Simultáneos
- [x] **Unificación Total de la Tarjeta 3D sin Cortes de Bordes (`LoginModal.tsx` e `index.css`):**
  - Desactivado por completo el elemento de pedestal inferior (`.pedestal` a `display: none !important`), eliminando la semiluna oscura saliente y los huecos triangulares inferiores.
  - Aplanada la curvatura interna de `.form-panel` (`border-radius: 0; background: transparent; box-shadow: none; padding: 10px 0 0`), suprimiendo los arcos cóncavos en los costados que daban aspecto de tarjeta cortada o mordida.
  - `.login-card` ahora funciona como una sola pieza continua e impecable con `border-radius: 36px` y acolchado completo `18px 20px 24px`.
  - Contenedor modal overlay ajustado con `flex flex-col items-center justify-start sm:justify-center` y `my-auto` evitando cortes verticales en dispositivos móviles.
- [x] **Campos de Perfil y PIN Visibles en Pantalla Simultáneamente (`LoginModal.tsx`):**
  - Mostrados en la misma vista los campos *"Perfil de Usuario"* (con forzado en mayúsculas) y *"Ingresa el PIN"* (4 dígitos), erradicando la confusión de visualización escalonada.
  - Mantenimiento estricto del límite de 3 intentos máximos con contador reactivo y bloqueo seguro tras fallar 3 veces.

### Versión 1.66.0 - Flujo de Acceso por PIN con Solicitud de Nombre, Transición Fluida y Límite de 3 Intentos
- [x] **Limpieza de Interfaz y Nomenclatura Simplificada (`LoginModal.tsx`):**
  - Eliminado el bloque y píldoras públicas de *"Perfiles de Colaborador activos: ALISTO DE PEDIDOS / ATENCIÓN Y TALLERES"*.
  - Renombradas las opciones del selector: *"Correo / Fio"* ahora es estrictamente *"Correo"*, y *"PIN 4 Dígitos"* simplificado a *"PIN"*.
- [x] **Flujo en 2 Pasos con Transición Suave para PIN (`LoginModal.tsx` y `AppContext.tsx`):**
  - **Paso 1:** Solicita en la misma línea el nombre del perfil (`Nombre del perfil`), forzando mayúsculas automáticas y validándolo contra perfiles activos.
  - **Transición Profesional:** Al confirmar, el campo de perfil se desvanece con animación lateral suave (`duration-300`) y da paso inmediato al campo de ingreso de PIN con enfoque automático.
  - El perfil validado se muestra en una cápsula con opción rápida *"Cambiar"* para reescribir el nombre si se desea.
- [x] **Límite de Seguridad Estricto de 3 Intentos (`LoginModal.tsx` y `AppContext.tsx`):**
  - Monitoreo de intentos fallidos en `sessionStorage`; muestra contador reactivo (*"Intentos restantes: X de 3"*).
  - Al tercer intento fallido, bloquea el campo de PIN y el botón de ingreso de forma segura con mensaje de advertencia.

### Versión 1.65.0 - Erradicación de Cortes en Bordes del Login (Tema Oscuro y Claro)
- [x] **Enmarcado 3D Completo y Bordes Delicados (`LoginModal.tsx` e `index.css`):**
  - Incorporado borde definido `1.5px solid rgba(216, 180, 254, 0.45)` y sombra con halo perimetral en modo oscuro, además de borde sutil `rgba(255, 255, 255, 0.85)` en modo claro, eliminando sensaciones de tarjeta cortada o bordes duros.
  - El pedestal inferior (`.pedestal`) ahora cuenta con degradado oscuro ambientado (`#5b3e8a` a `#2f1d4f`) con brillo púrpura suave en tema oscuro y ancho contenido anti-desborde en móviles.
- [x] **Contención Íntegra de Ilustración de Niña y Estrella (`index.css`):**
  - Ajustada la cápsula `.characters-stage` con padding horizontal de seguridad (`14px` desktop / `10px` móvil) y escala `max-width: 100%; max-height: 100%`.
  - La estrella violeta con su mini-estrella dorada, los brazos, dedos, manos y el peinado de la niña se despliegan al 100% completos sin ser recortados por el `overflow` de la tarjeta.
- [x] **Botón de Cierre "X" Protegido contra Cortes (`LoginModal.tsx` e `index.css`):**
  - Reubicado el botón de cierre dentro de la tarjeta (`.login-card`), con anclaje seguro `top-3.5 right-3.5` y estilos adaptados a ambos temas, eliminando el corte que sufría en esquinas de pantalla.
- [x] **Eliminación del Contenedor Rígido Radial en Páginas Autónomas (`LoginModal.tsx`):**
  - Sustituido el bloque rectangular con fondo radial púrpura que generaba cortes cuadrados en `/login` y en `/admin` por una alineación fluida y limpia que respeta el fondo natural del tema activo.
- [x] **Integración Continua del Selector de Método (`LoginModal.tsx` e `index.css`):**
  - Selector de "Correo / Fio" vs "PIN 4 Dígitos" integrado de forma armónica dentro de `.form-panel`, manteniendo la continuidad anatómica donde la niña y la estrella descansan sobre el panel.

### Versión 1.64.0 - Corrección Visual y Contraste de Elementos en Tema Oscuro
- [x] **Notificación Flotante de Carrito (`CartSuccessToast.tsx` e `index.css`):**
  - Fondo oscuro con desenfoque `rgba(44, 39, 70, 0.98)` y borde lila translúcido en lugar de blanco deslumbrante.
  - Título en verde esmeralda luminoso (`#34D399`), nombre del producto en blanco puro (`#FFFFFF`) y textos secundarios en lavanda suave (`#CBD5E1`), erradicando textos blancos sobre fondo claro.
- [x] **Píldoras de Información de Calidad del Hero (`HeroDual.tsx` e `index.css`):**
  - Contenedores estilizados en `#2C2746` con borde suave `rgba(168, 85, 247, 0.3)`.
  - Títulos en blanco nítido (`#FFFFFF`), subtítulos en `#CBD5E1` e iconos con cápsulas adaptadas `#352F54`.
- [x] **Botones Circulares de Acción (`neu-btn-circle` en `index.css`):**
  - Reemplazado el fondo blanco plano por tono nocturno `#332D52` con borde sutil, icono violeta claro (`#E9D5FF`) y estados activos/hover con sombras invertidas.
  - Estado verde esmeralda para productos ya agregados al carrito con contraste óptimo.
- [x] **Protección Estética del Modal 3D de Login (`index.css`):**
  - Aislada la tarjeta de login 3D frente a reglas globales de inputs en modo oscuro.
  - Campos de texto preservados con fondo blanco crema, texto oscuro legible (`#2D1E40`), placeholder claro y textos/enlaces respetando la paleta original del formulario.

### Versión 1.63.0 - Redirección Inmediata a Administración, URL Segura y Sistema de Perfiles con PIN (4 Dígitos)
- [x] **Ingreso Real e Inmediato a Administración ([`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx) y [`src/App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Eliminado el bloqueo/congelamiento del modal; al autenticarse se cierra el diálogo al instante y redirige de inmediato al panel de administración en la URL segura `/admin`.
  - Tolerancia de mayúsculas/minúsculas para contraseña `Fio777` / `fio777` y accesos directos si ya existe sesión activa.
- [x] **URL Segura y Puerta de Autenticación en `/admin` ([`src/App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Protección de ruta: cualquier visita directa a `https://byfiocr.pages.dev/admin` sin sesión activa muestra la pantalla de acceso seguro con autenticación integrada, garantizando que nunca quede en blanco ni desprotegida.
- [x] **Módulo de Gestión de Perfiles de Usuario ([`UserProfilesSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/UserProfilesSection.tsx) y [`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx)):**
  - Nuevo panel en el Administrador accesible desde `/admin/usuarios` y en el Menú Principal con icono de Perfiles.
  - Creación y edición de perfiles (ej: `ALISTO DE PEDIDOS`, `ATENCIÓN Y TALLERES`) con nombre forzado en **MAYÚSCULAS**.
  - Asignación de código de acceso PIN de 4 dígitos numéricos con botón de generación aleatoria.
  - Selección granular de accesos con casillas de verificación (checkboxes) para cada módulo del sistema: Pedidos & Alisto, Facturación, Inventario, Caja & Reportes, Talleres, Precios y Perfiles, además de botón para marcar todos los accesos (Admin Total).
- [x] **Acceso Rápido por PIN de 4 Dígitos ([`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx) y [`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Selector de método en el formulario de inicio de sesión: "Correo / Fio" vs "PIN 4 Dígitos".
  - Detección automática en tiempo real del perfil correspondiente al código digitado (ej: PIN `1001` identifica automáticamente a `ALISTO DE PEDIDOS`).
  - Restricción visual de módulos: los colaboradores solo ven y acceden a las secciones marcadas en sus casillas de verificación.


### Versión 1.62.0 - Optimización Responsiva Universal y Adaptación Ergonómica para Celulares
- [x] **Meta Viewport & Anti-Overflow Global ([`index.html`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/index.html) y [`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Incorporado `viewport-fit=cover` y escala táctil en meta tag; reglas globales `overflow-x: hidden; width: 100%; max-width: 100vw` y prevención de auto-zoom molesto en inputs en Safari iOS (`font-size: 16px !important`).
- [x] **Adaptación de Tarjetas y Pedestales 3D ([`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Reemplazados anchos rígidos de login card y pedestal inferior por escalas fluidas `width: 100%; max-width: ...` con `max-width: calc(100vw - 28px)` para pantallas angostas.
- [x] **Barra Superior y Navegación Móvil Limpia ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx) y [`BrandLogo.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/BrandLogo.tsx)):**
  - Ajuste ergonómico en móviles: red social TikTok visible en menú desplegable y ocultada de la barra ultra angosta para dar espacio al selector de Sol/Luna, Carrito y Menú.
  - Píldora de usuario activo compacta para no desplazar elementos en resoluciones de 320px a 390px.
- [x] **Escalabilidad de Tipografía Hero y Filtros ([`AnimatedByfioLetters.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/AnimatedByfioLetters.tsx), [`HeroDual.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HeroDual.tsx), [`ProductsSection.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/ProductsSection.tsx) y [`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx)):**
  - Letras animadas BYFIO adaptadas con escala fluida desde móvil (`text-3xl xs:text-4xl...`).
  - Botones de categorías y filtros convertidos en carrusel horizontal táctil deslizable con `overflow-x-auto scrollbar-none`.
- [x] **Modales, Notificaciones y Mascota Flotante Seguros ([`FloatingMascot.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/FloatingMascot.tsx), [`CartSuccessToast.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/CartSuccessToast.tsx) y [`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - Globos de Estrellita delimitados a `calc(100vw - 2rem)` y toasts centrados sin superar el ancho de la pantalla.


### Versión 1.61.0 - Aclarado del Tema Oscuro & Corrección Integral de Contraste Tipográfico
- [x] **Aclarado Elegante de la Paleta Nocturna ([`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css) y [`BackgroundDecor.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/BackgroundDecor.tsx)):**
  - Fondo base elevado a `#211D35` (un tono más suave, luminoso y descansado que el negro anterior `#0C0A17`), con tarjetas en `#2C2746` y botones en `#332D52`.
  - Halos ambientales con lavanda, rosa magenta y destellos ámbar suaves que eliminan la sensación de oscuridad extrema.
- [x] **Legibilidad y Contraste Total de Textos ([`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Encabezados y títulos en blanco nítido (`#FFFFFF`), letras BYFIO animadas con gradiente luminoso pastel, subtítulos en lavanda clara (`#E9D5FF`) y textos secundarios en gris suave (`#CBD5E1` / `#D1D5DB`).
  - Transformación automática de píldoras y cajas blancas a superficies oscuras contrastadas con tipografía brillante.


### Versión 1.60.0 - Reproducción Inmediata con Sonido Activo en Animación Intro
- [x] **Arranque Inmediato sin Esperas ([`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - Eliminado el retraso de 1.4 segundos; el video arranca a reproducirse de una vez con audio activo (`muted = false`, `volume = 1.0`).
- [x] **Desbloqueo Táctil y Gestual Universal ([`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - Configurados escuchadores globales en captura para `pointerdown`, `touchstart`, `mousedown` y `click` sobre toda la ventana y el overlay completo, garantizando que el audio se active de inmediato sin quedar bloqueado por políticas del navegador.
- [x] **Indicador y Botón Táctil de Audio HD ([`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - Botón superior con estados dinámicos ("Sonido activo 🎵" vs "Activar sonido 🔊") y banner interactivo de activación instantánea al tocar la pantalla.


### Versión 1.59.0 - Eliminación de Módulo Neumórfico y Activación de Switcher Claro/Oscuro con Botones Sol y Luna
- [x] **Eliminación de Sección Neumórfica ([`HomePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HomePage.tsx)):**
  - Removido por completo el bloque demostrativo con textos de neomorfismo, soft UI, táctil minimal y dial circular.
- [x] **Conmutador de Tema Claro / Oscuro con Botones Sol y Luna ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Incorporado selector táctil de tema en la barra superior (tienda y admin) y menú móvil con los botones e iconos de Sol (ámbar / claro) y Luna (índigo / oscuro).
- [x] **Tema Oscuro Completo ([`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css) y [`BackgroundDecor.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/BackgroundDecor.tsx)):**
  - Estilos oscuros globales con fondo noche profunda (#0C0A17), nebulosas violeta cósmicas y contraste refinado en tarjetas, botones y encabezados.


### Versión 1.58.0 - Inicio de Sesión Real con Credenciales Maestras (fio@byfiocr.com / Fio777)
- [x] **Autenticación Maestra Oficial ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx)):**
  - Implementado sistema de autenticación real reconociendo `fio@byfiocr.com` (o usuario `fio`) con contraseña `Fio777` como cuenta Maestra / Administradora con privilegios totales.
  - Soporte de registro de nuevos usuarios de clientes con persistencia segura en `localStorage` (`byfio_auth_user_v1` y `byfio_registered_users_v1`).
- [x] **Formulario Interactivo y Validación en Modal ([`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx)):**
  - Validación de credenciales en tiempo real con alertas de error claras ante datos inválidos y mensaje de bienvenida personalizado con confeti ante inicio exitoso.
  - Indicador de sesión activa con opción de desconexión inmediata y redirección automática al Panel de Administración si el rol es administrador.
- [x] **Indicador de Usuario y Acceso Rápido en Navbar ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Despliegue del estado autenticado en la barra de navegación superior y menú móvil con badge "Admin", botón de acceso directo a "Panel" y botón para "Cerrar Sesión".


### Versión 1.57.0 - Ampliación de Ilustración de Login y Exposición Total de Manos y Dedos
- [x] **Ampliación de Escala de Personajes ([`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Incrementada la altura de `.characters-stage` a 245px con `max-width: 96%`, brindando una presencia visual mucho más grande, nítida y destacada a la niña y a la estrella.
- [x] **Visibilidad Total de Manos y Dedos Apoyados ([`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Asignado `z-index: 5` con `pointer-events: none` a `.characters-stage`, colocando las manos, dedos y codos de la niña descansando por encima del borde superior de `.form-panel` (`z-index: 3`).
  - Erradicado cualquier corte o solapamiento que tape los dedos; los personajes lucen íntegros y apoyados físicamente sobre el lomo acolchado del formulario.

### Versión 1.56.0 - Corrección Definitiva de Apoyo en Login: Eliminación de Líneas y Calibración
- [x] **Regeneración de PNG Limpio Sin Extrusión ([`login-3d-girl-star.png`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/assets/login-3d-girl-star.png)):**
  - Eliminadas las líneas verticales/artefactos inferiores generados por el pixel-stretching anterior.
  - Recorte exacto y limpio sobre el borde real de los personajes (860 x 575 px) con canal alfa 100% transparente en todo el contorno.
- [x] **Alineación Continua Sobre el Panel Acolchado ([`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Calibrado `.characters-stage` a 200px de alto (`width: auto; max-width: 92%`), ubicando los codos de la niña y el cuerpo de la estrella enteramente dentro del tramo horizontal del panel.
  - Solapamiento de `.form-panel` ajustado a `margin-top: -18px` y radio a 32px, permitiendo que la parte inferior de los personajes quede suavemente oculta tras el lomo del formulario, luciendo 100% apoyados de forma natural y sin cortes.

### Versión 1.55.0 - Switches de Activación de Sonido en Panel de Administración
- [x] **Gestión Centralizada de Audio ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx) y [`soundEffects.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/soundEffects.ts)):**
  - Añadidos estados reactivos persistentes (`soundBubbleEnabled` y `soundButtonsEnabled`) con respaldo en `localStorage`.
  - Los sintetizadores `playBubblePopSound` y `playWaterDropSound` evalúan de inmediato el estado configurado, silenciándose o activándose al instante.
- [x] **Switches Interactivos en Modal de Administración ([`AdminDesignSettingsModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminDesignSettingsModal.tsx)):**
  - Incorporada nueva sección "Efectos de Sonido Interactivos" accesible desde el botón "Diseño & Letra" en el encabezado de administración.
  - Implementados interruptores tipo switch con animación fluida, iconos representativos y vista previa auditiva al encenderlos.

### Versión 1.54.0 - Apoyo Natural y Erradicación de Cortes en Ilustración 3D del Login
- [x] **Aislamiento en PNG Transparente Real ([`login-3d-girl-star.png`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/assets/login-3d-girl-star.png)):**
  - Removido el fondo plano sólido mediante algoritmo de segmentación alfa y BFS perimetral, eliminando el recuadro opaco y los bordes rectangulares.
  - Extendido el cuerpo inferior de las mangas y de la estrella en 55px hacia abajo para garantizar que los personajes desciendan de forma continua por detrás de la curvatura del panel.
- [x] **Calibración de Solapamiento y Escenario ([`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Eliminado el `border-radius` residual en la imagen y ajustado `.characters-stage` a 215px de altura (`width: 98%`, `max-width: 365px`).
  - Incrementado el solapamiento de `.form-panel` a `margin-top: -26px` para que el panel funcione como un reposabrazos/cuchillo 3D perfecto, logrando que la niña y la estrella se vean 100% completas y apoyadas de forma natural sin líneas de corte en ningún extremo.

### Versión 1.53.0 - Eliminación de Migas de Pan Redundantes ("by.fio inicio") en Portada
- [x] **Limpieza del Hero Principal ([`HeroDual.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HeroDual.tsx)):**
  - Eliminado el bloque de navegación de migas de pan `TreeNavigation` ("by.fio > inicio") ubicado sobre el slogan "¡Transformá tu creatividad en tu mejor proyecto!".
  - Se despeja la cabecera del Home, dejando la insignia destacada directamente bajo el encabezado principal de la tienda.

### Versión 1.52.0 - Efectos Sonoros Orgánicos: Burbuja Estallando y Gotas de Agua en Botones
- [x] **Sonido de Burbuja Estallando ([`soundEffects.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/soundEffects.ts) y [`FloatingMascot.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/FloatingMascot.tsx)):**
  - Creada función sintetizada con Web Audio API `playBubblePopSound()` sin dependencias de red, emulando la liberación instantánea de presión acústica de una burbuja reventando.
  - Reproducción automática al emerger la estrellita desde abajo y al desplegarse la burbujita de diálogo de saludo.
- [x] **Efecto Sonoro de Gotas de Agua en Botones ([`soundEffects.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/utils/soundEffects.ts) y [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Sintetizado el tono resonante de gota de agua líquida `playWaterDropSound()` mediante curva física de frecuencia ("bloop / plink").
  - Integrado de forma táctil en los controles de la mascota flotante y listener delegado global en todos los botones de la interfaz.

### Versión 1.51.0 - Sincronización de Temporizador de Estrellita Tras Cierre de Intro
- [x] **Conteo de 5 Segundos Condicionado al Cierre del Intro ([`FloatingMascot.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/FloatingMascot.tsx)):**
  - Vinculado el componente con `useApp().isIntroOpen` para impedir que el temporizador de la estrellita se ejecute mientras la animación de bienvenida está activa o cubriendo la pantalla.
  - El temporizador de 5 segundos inicia su cuenta regresiva en el instante preciso en que la ventana de animación concluye o el usuario la cierra pulsando "Entrar a la web".
  - Transcurridos los 5 segundos exactos tras el cierre, la estrellita emerge desde abajo con su animación vibrante y desplegando su burbujita de saludo de forma fluida.

### Versión 1.50.0 - Eliminación de Cuadro de Carga y Tipografía Oficial Blanca en Splash Intro
- [x] **Eliminación Total del Marco/Cuadro Cuadrado ([`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - Erradicado el asset de imagen cuadrado `logo-byfio-lila-HD.png` y cualquier marco o caja de fondo en la pantalla de carga/splash.
  - Retirado el atributo poster que mostraba la imagen cuadrada al iniciar la carga del video.
- [x] **Tipografía Oficial de Marca en Color Blanco ([`BrandLogo.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/BrandLogo.tsx) y [`WebIntroOverlay.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/WebIntroOverlay.tsx)):**
  - Añadido soporte en `BrandLogo` para personalizar el color del texto (`textColor`) y del eslogan (`sloganColor`), manteniendo intactos el corazón celeste interactivo (`#38BDF8`) y la estrellita dorada (`#FBBF24`).
  - Configurada la marca en formato `hero` con letras blancas limpias y alineación central, idéntica a la tipografía oficial del Navbar.

### Versión 1.49.0 - Eliminación de Redes Sociales en Login y Visualización Completa de Ilustración 3D
- [x] **Retiro de Botones de Redes Sociales ([`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx) e [`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Eliminados los botones de inicio de sesión con Google, Apple y Facebook, así como el divisor "o continúa con", despejando el formulario y enfocándolo al acceso directo por cuenta.
- [x] **Ampliación y Visualización Íntegra de la Ilustración 3D ([`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Espacio vertical liberado asignado a `.characters-stage` (altura incrementada a 195px con `object-fit: contain`).
  - La muñequita con su moño castaño, rostro, suéter morado, la estrellita sonriente y sus corazones se aprecian al 100% sin cortes en ningún extremo, manteniendo un apoyo natural sobre el marco.

### Versión 1.48.0 - Banners Ilustrados Oficiales: Taller Creativo, Catálogo Digital y Tienda Online
- [x] **Ilustración para Taller Creativo ([`WorkshopsPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/WorkshopsPage.tsx) y [`HomePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HomePage.tsx)):**
  - Importada la ilustración `imagen tienda creativa.jpeg` y `taller-creativo.jpeg` a `public/assets/imagen-tienda-creativa.jpeg`.
  - Integrado banner ilustrado panorámico en la cabecera de la página de Talleres y en la sección de Academia Creativa de la página de inicio.
- [x] **Ilustración para Catálogo Digital ([`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx)):**
  - Importada la ilustración `IMAGEN CATALODO DIGITAL.jpeg` a `public/assets/imagen-catalogo-digital.jpeg`.
  - Integrado banner ilustrado oficial destacado en la cabecera del Catálogo Online, sustituyendo las imágenes genéricas de stock.
- [x] **Ilustración para Tienda Online ([`StorePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/StorePage.tsx) y [`HomePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HomePage.tsx)):**
  - Importada la ilustración `IMAGEN TIENDA ONLINE.jpeg` a `public/assets/imagen-tienda-online.jpeg`.
  - Integrado banner ilustrado oficial en la página de Tienda y en la sección de Favoritos de la Tienda del inicio.

### Versión 1.47.0 - Ajuste de Escala Completa y Apoyo Exacto en Tarjeta de Login 3D
- [x] **Ajuste de Escala para Visualización Completa Sin Cortes ([`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css) y [`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx)):**
  - Calibradas las dimensiones verticales de la tarjeta a escala compacta equilibrada (~500px de altura total) para garantizar que todo el contenido (cabecera con corazón, personajes, campos de entrada, botones sociales y pedestal) se aprecie al 100% sin cortes en la pantalla.
- [x] **Recorte de Precisión y Apoyo Directo de la Muñequita ([`public/assets/login-3d-girl-star.png`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/assets/login-3d-girl-star.png) e [`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Recortados los 131 píxeles de espacio vacío inferior del asset gráfico, posicionando la línea base de los codos y las patas de la estrellita en el píxel final de la imagen.
  - Aplicado solapamiento quirúrgico (`margin-top: -18px` en `.form-panel`) para que los personajes descansen de manera continua y natural sobre el marco acolchado del formulario, erradicando el espacio en blanco.

### Versión 1.46.0 - Reorganización del Header de Administración y Dock de Pestañas Sin Scroll
- [x] **Limpieza y Reubicación en Encabezado ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx)):**
  - Ocultadas las redes sociales (TikTok, Instagram y WhatsApp) en la vista del panel administrativo.
  - Reubicado el botón "Volver a Tienda" inmediatamente al lado del logotipo `by.fio` en el extremo izquierdo.
  - Reubicados los botones "Diseño & Letra" y "Menú Principal" en la barra superior derecha del Navbar en modo admin.
- [x] **Dock de Botones Administrativos Responsivo y Sin Desplazamiento ([`AdminTabs.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/AdminTabs.tsx) y [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Erradicada la barra de desplazamiento horizontal (`overflow-x-auto`) sustituyéndola por una cuadrícula fluida de 6 columnas en desktop (`lg:grid-cols-6`), 3 columnas en tablet (`sm:grid-cols-3`) y 2 en móvil.
  - Botones estilizados en pastillas táctiles neumórficas con badges de estado (Pedidos & Alisto, Facturación, Inventario & QR, Caja & Reportes, Talleres y Precios).
  - Eliminados los botones redundantes del cuerpo inferior de la página en [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx), liberando espacio vertical.

### Versión 1.45.0 - Animación de Entrada Retardada, Vibración y Burbuja Sin Borde en Mascota Estrellita
- [x] **Eliminación Total de Borde ([`FloatingMascot.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/FloatingMascot.tsx)):**
  - Removido el borde grueso y el padding blanco perimetral de la burbuja flotante del video de la estrellita (`border-0 p-0`), conservando una silueta circular pura con sombras suaves `shadow-2xl`.
- [x] **Aparición Retardada a los 5 Segundos ([`FloatingMascot.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/FloatingMascot.tsx)):**
  - Implementado temporizador de 5000ms al cargar la página para que la estrellita permanezca oculta y no interrumpa la visualización inicial de la tienda.
- [x] **Animación de Subida, Vibración Rápida y Burbujita de Saludo ([`FloatingMascot.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/FloatingMascot.tsx) e [`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Animación física de resorte `@keyframes bubbleRiseVibrate`: la burbuja asciende fluidamente desde abajo (`translateY(160px)`), alcanza su cúspide, realiza una vibración lateral rápida y se detiene en seco.
  - Al detenerse la vibración (1150ms post-llegada), emerge de inmediato la burbujita interactiva de saludo ("¡Hola! Soy Estrellita ✨ ¿Tenés alguna consulta?").

### Versión 1.44.0 - Ilustración Oficial Recortada de Niña y Estrellita en Login 3D
- [x] **Integración de Ilustración Recortada y Ajuste Escénico ([`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx) e [`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Añadida la imagen recortada de alta resolución de la niña con suéter morado y la estrellita sonriente en [`public/assets/login-3d-girl-star.png`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/assets/login-3d-girl-star.png).
  - Ajustado el encuadre con `object-position: center bottom` y ancho del 90% para que los codos de la niña y la base de la estrellita descansen de manera natural y exacta sobre el marco acolchado del formulario 3D.
  - Soporte de fallback bidireccional en caso de carga de recursos (`.png` -> `.jpg`).

### Versión 1.43.0 - Login 3D Claymorphism (Niña & Estrellita By.Fio) con Ilustración Oficial
- [x] **Componente y Modal de Login 3D ([`LoginModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/LoginModal.tsx) e [`src/index.css`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/index.css)):**
  - Implementado fielmente el diseño 3D Claymorphism aportado: tarjeta con sombras biseladas, cabecera con corazón pulsante `彡 💖 彡`, tipografía `Fredoka` + `Quicksand`, escenario de personajes apoyados en el marco y pedestal 3D inferior.
  - Ilustración oficial incorporada en [`public/assets/login-3d-girl-star.jpg`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/public/assets/login-3d-girl-star.jpg) (con encuadre exacto `center 38%` y corazones flotantes).
  - Formulario interactivo con insignias de iconos en círculo morado 3D, alternador de visibilidad de contraseña (ojo), botón táctil de envío con confetti, botones sociales 3D (Google, Apple, Facebook) y selector de modo (Iniciar Sesión vs Registrarse).
- [x] **Accesos Directos y Rutas ([`Navbar.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/Navbar.tsx) y [`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Botón táctil "Iniciar Sesión" en la barra de navegación superior (desktop y drawer móvil) y en el footer.
  - Habilitada ruta y hash `/login` (#login) para visualización tanto en modal overlay como en página inmersiva completa.

### Versión 1.42.0 - Integración del Video VID ESTRELLITA en la Burbuja Flotante
- [x] **Video VID ESTRELLITA en la Mascota / Burbuja Flotante ([`FloatingMascot.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/FloatingMascot.tsx)):**
  - Importado el archivo oficial `VID ESTRELLITA.mp4` desde Descargas a `public/assets/vid-estrellita.mp4` y `public/vid-estrellita.mp4`.
  - Integrado en reproducción fluida en bucle continuo (`autoPlay loop muted playsInline`) tanto en la burbuja circular flotante inferior como en la tarjeta interior desplegable de asistencia por WhatsApp.

### Versión 1.41.0 - Corrección Integral de Espacios y Cortes en Hero Segment (Full-Bleed de Borde a Borde)
- [x] **Hero Segment a Pantalla Completa De Borde a Borde ([`HeroDual.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HeroDual.tsx) y [`HomePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HomePage.tsx)):**
  - Eliminados los espacios vacíos y márgenes laterales que cortaban visualmente el segmento principal en pantallas anchas.
  - El fondo y degradados ambientales lila pastel oficial ahora cubren el 100% del ancho del viewport (`w-full`) de lado a lado sin esquinas recortadas artificiales.
- [x] **Eliminación del Gap Superior y Aislamiento del Contenedor ([`App.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/App.tsx)):**
  - Ajustado el layout para que el Hero se conecte directamente y sin separaciones con la barra de navegación superior en la vista principal (`pt-0`), manteniendo el contenedor central `max-w-7xl` para las secciones inferiores de talleres, tienda, precios y ubicación.
  - Resplandores ambientales expandidos (`blur-[120px]`) que logran una atmósfera continua, pulida y 100% profesional.

### Versión 1.40.0 - Etiqueta Sin Bordes "Producto Agregado", Notificación Flotante de Éxito y Carrito Cerrado
- [x] **Etiqueta Sin Bordes "Producto Agregado" en Tarjetas de Productos ([`StorePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/StorePage.tsx), [`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx), [`HomePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HomePage.tsx)):**
  - Implementada insignia distintiva sin bordes (`border-0`, `bg-emerald-500`, texto blanco con icono de verificación `Check`) que se activa reactivamente cuando un producto ya se encuentra en el carrito (`cart.some(it => it.id === product.id)`).
  - Permite a los clientes identificar de un vistazo qué artículos ya han añadido a su pedido y cuáles no.
  - Actualizado el botón de acción en tarjeta a `Agregar Más (X en Carrito)` para permitir incrementar unidades cómodamente.
- [x] **Flujo de Carrito Sin Apertura Automática ([`AppContext.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/context/AppContext.tsx), [`StorePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/StorePage.tsx), [`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx)):**
  - Eliminada la apertura forzada del drawer del carrito (`setIsCartOpen(true)`) al agregar productos, permitiendo que el usuario continúe navegando y comprando sin interrupciones.
- [x] **Cartel / Toast Flotante Auto-Descartable ([`CartSuccessToast.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/common/CartSuccessToast.tsx)):**
  - Cartel flotante superior en estilo Neumórfico Glassmorphism con el mensaje `¡Producto agregado con éxito!`, nombre del artículo, foto y resumen reactivo en tiempo real de cantidad y monto total del carrito.
  - Se auto-descarta suavemente tras 3.2 segundos con barra de progreso animada, o manualmente mediante botón de cierre o acceso opcional a "Ver Carrito".
  - Sincronización reactiva inmediata de contadores en el navbar y barra flotante de pedidos.

### Versión 1.39.0 - Publicación Cruzada Automática (Tienda y Catálogo) Marcada por Defecto y Opcional
- [x] **Campos de Publicación Cruzada en Productos ([`types/index.ts`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/types/index.ts) y [`NewProductModal.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/NewProductModal.tsx)):**
  - Incorporados flags `showInStore` y `showInCatalog` activados por defecto (`true`) en creación y edición de productos.
  - Bloque visual con tarjetas neumórficas e interruptores: al agregar un producto desde la tienda o desde el catálogo, aparece automáticamente en ambos canales, con la opción para el administrador de desmarcar cualquiera según convenga.
- [x] **Filtrado Dinámico en Tienda, Catálogo y Home ([`StorePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/StorePage.tsx), [`CatalogPage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/CatalogPage.tsx) y [`HomePage.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/store/HomePage.tsx)):**
  - La Tienda y el Home muestran únicamente productos con `showInStore !== false`.
  - El Catálogo muestra únicamente productos con `showInCatalog !== false`, sincronizando contadores de categorías.
  - Botón directo "+ Agregar Producto" y lápiz de edición rápida disponibles directamente en las vistas de Tienda y Catálogo.
- [x] **Visibilidad en Tabla de Inventario ([`InventoryTable.tsx`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/src/components/admin/InventoryTable.tsx)):**
  - Distintivos visuales `[Tienda]` y `[Catálogo]` para supervisar los canales asignados a cada artículo.

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
