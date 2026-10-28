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

### Versión 1.1.0 - Módulo de Alta de Productos & Filtros de Categoría en Inventario
- [x] Botón de alta prominente `+ Agregar Producto al Inventario` en la tabla de control WMS.
- [x] Modal completo `NewProductModal` con campos: Nombre, SKU (con autogenerador inteligente), Categoría (selector + creación de nueva categoría), Ubicación en estante, Precios, Stock inicial, Mínimo y Máximo para alertas, Unidad de medida y Checkbox de personalización.
- [x] Barra de Filtros de Categorías dinámicas en la tabla de inventario para segmentar productos sin tenerlos todos en una sola fila.
- [x] Realce visual del botón `Iniciar Alisto con Escáner QR` en la cola de pedidos FIFO con animaciones y badges de alta visibilidad.
- [x] Acción de eliminación/archivado de productos del inventario.

### Versión 1.0.0 - Lanzamiento Inicial E-commerce & WMS Picking QR
- [x] Identidad de Marca `by.fio` con tipografía Fredoka/Quicksand y estética pastel claymorphic (Lila, Morado profundo, Rosa, Celeste y Amarillo estrella).
- [x] Selector superior de vista dual rápida (Vista Cliente / Panel Admin WMS) con sincronización de estado en tiempo real.
- [x] Mascota animada estrellita lila y widget interactivo de WhatsApp con video oficial integrado (`ESTRELLA BYFIO.mp4`).
- [x] Catálogo de 5 Talleres Creativos oficiales con reserva de cupos e información de técnicas/materiales.
- [x] Tienda Online de productos e insumos con filtros, stock en tiempo real y personalización con nombre.
- [x] Carrito de compras con Checkout SINPE Móvil al 6400-4640 y generación de orden secuencial (#FIO-1001).
- [x] Panel Administrativo con cola de pedidos cronológica FIFO y seguimiento de estados.
- [x] Gestión de inventario inteligente con cálculo de stock crítico (ROJO), sugerencia de reposición y generación de orden de compra a proveedores.
- [x] Generador de etiquetas con código QR por producto listas para imprimir.
- [x] Interfaz de Alisto Guiado (Picking paso a paso) con escaneo y validación de QR por cámara o simulación láser.
- [x] Cierre automático de alisto, generación de Factura/Comprobante oficial y botón de envío directo a WhatsApp.
