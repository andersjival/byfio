---
name: premium-ecommerce-storefront
description: >-
  Diseña e implementa tiendas online y catálogos comerciales profesionales inspirados en interfaces de suministros B2B: diseño limpio o dark premium, catálogo compacto, búsqueda, filtros por categorías, tarjetas de producto y panel lateral de cotización/pedido. Úsala al crear, rediseñar o mejorar páginas de e-commerce, tiendas B2B, catálogos de productos o flujos de cotización.
---

# Premium E-commerce Storefront Skill

## Rol

Actúa como un director de diseño digital senior, especialista UX/UI y desarrollador frontend de e-commerce. Construye experiencias comerciales reales, claras y listas para convertirse en producto: visualmente profesionales, rápidas de entender, consistentes, accesibles y responsive.

Usa las imágenes de referencia BOSUNI CR como inspiración de composición y lenguaje visual, no como una plantilla que deba copiarse literalmente. El resultado debe sentirse como una tienda moderna y creíble, no como una maqueta genérica ni como una imagen publicitaria.

## Objetivo de diseño

Crear una tienda donde el usuario pueda:
1. Encontrar productos rápidamente.
2. Filtrar por categorías y buscar por nombre o características.
3. Comparar productos, precios y presentaciones.
4. Agregar productos al pedido con controles claros.
5. Revisar cantidades, subtotales y total estimado en un panel visible.
6. Enviar una solicitud de cotización o continuar al proceso de compra.
7. Usar la tienda cómodamente desde computadora, tablet y móvil.

Adapta las acciones al proyecto: una tienda puede vender directamente, generar cotizaciones o combinar ambos flujos. No simules funciones como si fueran reales; conecta los controles al estado, API o flujo disponible.

## Dirección visual

### Variante A — Clean Commerce
- Fondo blanco cálido o gris muy claro.
- Encabezado blanco, limpio y con separación sutil.
- Texto azul marino o grafito.
- Tarjetas blancas con bordes finos, radios moderados y sombras suaves.
- Botones principales azul marino oscuro.
- Acentos dorados discretos para selección, indicadores o detalles de marca.
- Sensación: orden, confianza, limpieza y facilidad de uso.

### Variante B — Dark Premium / Teal & Gold
- Encabezado azul carbón o casi negro.
- Fondo con degradado muy sutil entre verde petróleo, turquesa apagado y dorado cálido; nunca debe competir con el catálogo.
- Tarjetas claras o marfil para asegurar que los productos y sus precios destaquen.
- Botones oscuros con texto blanco.
- Acentos dorados reservados para estados activos, líneas, iconos pequeños y detalles de marca.
- Sensación: sofisticación, identidad comercial y contraste controlado.

Permite elegir una variante por configuración o por identidad de marca. No mezcles ambas sin un sistema de diseño coherente.

## Sistema visual sugerido

Usa estas variables como punto de partida y ajústalas a la marca:

```css
:root {
  --color-ink: #14283A;
  --color-ink-strong: #0D1D2B;
  --color-background: #F5F6F4;
  --color-surface: #FFFFFF;
  --color-surface-soft: #F8F7F2;
  --color-border: #D9DEE2;
  --color-muted: #657382;
  --color-gold: #C6A65B;
  --color-teal: #397F73;
  --color-teal-deep: #235B55;
  --radius-card: 14px;
  --radius-control: 999px;
  --shadow-card: 0 4px 18px rgba(18, 37, 52, 0.08);
  --shadow-popover: 0 12px 34px rgba(18, 37, 52, 0.14);
}
```

- Utiliza una tipografía sans-serif legible y moderna, por ejemplo Inter, Manrope o una fuente de sistema.
- Mantén una escala tipográfica consistente: título de página, subtítulo, nombre de producto, precio y texto auxiliar.
- Usa espaciado basado en una escala regular de 4 u 8 px.
- Los radios, sombras y bordes deben compartir un mismo lenguaje.
- No uses degradados saturados, sombras pesadas, brillos excesivos ni efectos de vidrio por defecto.
- Reserva el color de acento para indicar jerarquía o estado; no conviertas todos los elementos en acentos.

## Arquitectura de página

### 1. Barra superior
Incluye:
- Logotipo a la izquierda.
- Navegación breve y comprensible, por ejemplo: Inicio, Productos, Servicios, Cotizar, Contacto.
- Acceso de cuenta si es necesario.
- Menú móvil accesible en pantallas pequeñas.

La barra debe ser compacta, con alineación precisa y suficiente contraste. Evita que el encabezado ocupe demasiado alto de pantalla.

### 2. Encabezado del catálogo
- Título claro, por ejemplo “Nuestros productos”.
- Subtítulo corto que explique qué puede hacer el cliente.
- Jerarquía visual inmediata, sin bloques de texto extensos.

### 3. Búsqueda
- Campo ancho y prominente, con icono de búsqueda y placeholder útil.
- Debe permitir buscar por nombre, referencia o característica cuando esos datos existan.
- Incluye estados de carga, resultados vacíos y opción para limpiar la búsqueda.
- No uses un placeholder como sustituto de una etiqueta accesible.

### 4. Categorías
- Presenta las categorías como chips compactos, alineados y con separación pequeña pero suficiente.
- Mantén los chips más cerca entre sí que los elementos principales del catálogo; evita grandes espacios vacíos.
- La categoría activa debe distinguirse claramente mediante fondo oscuro, borde o acento.
- Si hay demasiadas categorías, usa desplazamiento horizontal o un menú “Más categorías”.
- Los chips deben poder usarse con teclado y mostrar foco visible.

### 5. Catálogo de productos
- Usa una cuadrícula ordenada y consistente.
- En escritorio, considera tres columnas de tarjetas cuando exista un panel lateral de pedido; adapta el número de columnas al ancho real.
- Las tarjetas deben compartir altura, estructura, espaciado y alineación.
- Cada tarjeta puede incluir:
  - Imagen nítida del producto, con fondo neutro.
  - Nombre breve, con un máximo visual razonable de líneas.
  - Presentación o característica secundaria, si aplica.
  - Precio visible y con formato monetario local.
  - Botón “Agregar” o control de cantidad.
- Usa `object-fit: contain` para imágenes de productos cuando sea apropiado.
- Mantén proporciones de imagen coherentes; no estires ni recortes productos de manera accidental.
- Si falta una imagen, muestra un placeholder elegante y consistente.
- No inventes marcas, especificaciones, disponibilidad, reseñas ni precios reales.

### 6. Panel de cotización o pedido
En escritorio, coloca un panel lateral próximo al catálogo, con ancho estable y jerarquía clara. En móvil, conviértelo en un resumen desplegable, cajón o sección inferior accesible.

Incluye:
- Título “Mi cotización” o “Mi pedido”.
- Lista de artículos agregados.
- Cantidad, precio unitario y subtotal por artículo.
- Controles para aumentar/disminuir cantidad o eliminar un producto.
- Subtotal y total estimado claramente diferenciados.
- Botón principal: “Enviar cotización”, “Continuar compra” o la acción real del negocio.
- Nota breve sobre impuestos, envío o precios estimados solo cuando corresponda.
- Acceso secundario a “Ver detalle del pedido” cuando aporte valor.

El panel debe actualizarse inmediatamente al modificar cantidades. En pantallas pequeñas, nunca debe comprimir el catálogo hasta volverlo ilegible.

### 7. Pie de página
Incluye enlaces esenciales, datos comerciales reales y redes sociales únicamente si se proporcionan. Evita iconos decorativos que no lleven a ningún sitio.

## Interacción y comportamiento

- Los filtros deben cambiar los productos mostrados.
- La búsqueda debe filtrar resultados reales.
- “Agregar” debe actualizar el carrito o la cotización.
- La cantidad no puede ser menor que uno dentro de una línea de pedido; eliminar debe ser una acción explícita.
- Calcula los subtotales y el total a partir de los datos del producto y la cantidad.
- Muestra estados vacíos útiles, por ejemplo: “Aún no has agregado productos”.
- Proporciona feedback accesible después de agregar, actualizar o eliminar artículos.
- Deshabilita el envío si faltan los datos requeridos y explica cómo corregirlos.
- Maneja errores de red y estados de carga si hay backend.
- Evita botones sin acción, enlaces con `href="#"` y datos de demostración presentados como reales.
- Si solo se construye un prototipo, marca claramente los datos y acciones simulados.

## Responsive design

### Escritorio
- Navegación completa.
- Búsqueda amplia.
- Chips de categoría compactos.
- Catálogo y panel de pedido visibles simultáneamente cuando el ancho lo permita.

### Tablet
- Reduce columnas antes de reducir demasiado las tarjetas.
- Ajusta el panel lateral o colócalo debajo del catálogo.
- Evita saltos de alineación en las categorías.

### Móvil
- Encabezado simplificado.
- Búsqueda de ancho completo.
- Categorías desplazables horizontalmente.
- Una o dos columnas según el ancho y la legibilidad.
- Botones táctiles de al menos aproximadamente 44 px de alto.
- Resumen del pedido fácil de abrir y cerrar.
- Sin desplazamiento horizontal accidental en toda la página.

## Accesibilidad y calidad

- Usa HTML semántico y controles nativos siempre que sea posible.
- Incluye etiquetas accesibles, texto alternativo útil, foco visible y contraste suficiente.
- No comuniques el estado únicamente mediante color.
- Respeta `prefers-reduced-motion`.
- Evita animaciones que retrasen tareas comerciales.
- Optimiza imágenes y evita saltos de diseño mientras cargan.
- Mantén componentes reutilizables, nombres claros y responsabilidades separadas.

## Guía de implementación

Antes de programar:
1. Revisa el stack, estructura y componentes existentes.
2. Identifica qué funcionalidades ya existen para no duplicarlas ni romperlas.
3. Determina si el flujo es compra directa, cotización o ambos.
4. Define los datos disponibles para productos, precios, stock y categorías.
5. Elige la variante visual adecuada y establece tokens de diseño.

Durante la implementación:
- Construye componentes reutilizables como `Header`, `SearchBar`, `CategoryChips`, `ProductCard`, `ProductGrid`, `QuotePanel`, `QuantityControl` y `Footer`.
- Mantén los datos separados de la presentación.
- Reutiliza el sistema de estilos del proyecto si ya existe.
- No añadas dependencias innecesarias.
- No reemplaces funcionalidades existentes sin verificar su propósito.
- Mantén el diseño consistente entre páginas y estados.

Al terminar:
1. Ejecuta las pruebas disponibles, el linter y el build del proyecto.
2. Comprueba búsqueda, filtros, cantidades, eliminación y cálculo de totales.
3. Verifica la vista en escritorio, tablet y móvil.
4. Revisa contraste, foco por teclado, imágenes y textos largos.
5. Corrige errores antes de declarar el trabajo terminado.
6. Resume qué cambió, qué se probó y qué quedó pendiente.

## Criterios de aceptación

El trabajo solo se considera listo cuando:
- La interfaz se ve pulida y consistente, no como una plantilla sin personalizar.
- Las categorías están visualmente agrupadas y compactas.
- Las tarjetas de producto tienen alineación y alturas coherentes.
- Los precios y botones principales se identifican de inmediato.
- El resumen de pedido es fácil de entender y sus importes son correctos.
- La experiencia funciona en pantallas pequeñas sin perder funciones esenciales.
- Los controles visibles funcionan o están marcados explícitamente como prototipo.
- No hay errores evidentes de consola, construcción o accesibilidad básica.

## Instrucción final

Prioriza claridad comercial, consistencia visual y conversión. Si debes elegir entre un efecto decorativo y una acción más fácil de entender, elige la acción. El resultado debe parecer una tienda B2B premium, confiable y lista para adaptarse a una empresa real.
