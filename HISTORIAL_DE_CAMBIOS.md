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
