---
name: codigo-eficiente
description: >-
  Principio de máxima eficiencia, minimalismo y edición quirúrgica de código (KISS / YAGNI). Obliga a buscar siempre la solución más rápida, directa y con la menor cantidad de código posible, reutilizando componentes existentes y con cero sobreingeniería ni código especulativo.
---

# ⚡ Código Eficiente: Principio de Minimalismo y Ejecución Quirúrgica (KISS / YAGNI)

Esta habilidad establece el estándar universal para la generación y modificación de código en todos los proyectos: **máxima eficacia con el menor volumen de código posible**.

---

## 🎯 Filosofía Central
> **"Menos código = Menos bugs, menor latencia, menor consumo de tokens y cero deuda técnica."**
> La mejor solución no es la más sofisticada ni la que añade más abstracciones, sino la que resuelve el problema de forma directa, robusta, legible y con el mínimo footprint de código.

---

## 🧱 Las 4 Reglas de Oro de Eficiencia

### 1. Simplicidad Máxima y Cero Sobreingeniería (KISS)
- Resuelve cualquier requerimiento o corrección con la menor cantidad de líneas posibles.
- **Prohibido:**
  - Crear wrappers, capas intermedias o abstracciones que solo se usan en un sitio.
  - Implementar patrones de diseño complejos (factories, adapters, observers) cuando una simple función pura o hook directo es suficiente.
  - Añadir librerías o dependencias externas si la plataforma o lenguaje nativo ya lo resuelve de forma nativa y limpia.

### 2. Cero Código Especulativo (YAGNI - You Aren't Gonna Need It)
- Escribe únicamente el código requerido para cumplir el objetivo actual.
- **Prohibido:**
  - Crear funciones, parámetros o props "por si en el futuro se necesitan".
  - Declarar tipos, interfaces o enums gigantes para casos hipotéticos no solicitados.
  - Implementar validaciones hiper-defensivas en rutas internas o controladas que compliquen el flujo sin necesidad real.

### 3. Reutilización Obligatoria Previa
- **Antes de escribir una sola línea de código nuevo:**
  - Inspecciona los archivos existentes del proyecto.
  - Reutiliza componentes UI, hooks personalizados, tipos e interfaces, funciones de utilidad y clases ya disponibles.
  - **Prohibido:** Duplicar lógica, recrear utilidades que ya existen en `utils/` o redefinir componentes similares.

### 4. Edición Quirúrgica de Alta Precisión (Surgical Diffs)
- Las modificaciones deben ser quirúrgicas: toca únicamente las líneas indispensables para resolver el ticket.
- **Prohibido:**
  - Reescribir archivos completos cuando basta editar un bloque o línea específica.
  - Reordenar o re-formatear código no relacionado con la tarea (evita ruido en git diffs y previene regresiones).
  - Tocar archivos bloqueados (`lockedFiles`) o funcionalidades ya aprobadas en el historial de cambios (Memoria Protegida).

---

## 🛠️ Directrices de Implementación Práctica

### En Frontend (React / Next.js / Astro / Vite):
- **Tailwind nativo:** Utilizar clases nativas directas en lugar de estilos inline redundantes o archivos CSS auxiliares innecesarios.
- **Hooks precisos:** Estados locales (`useState`) solo cuando sea necesario; derivar valores calculados durante el render en lugar de sincronizar con efectos (`useEffect`).
- **Componentes ligeros:** Mantener la separación de ARQMODULAR (<150 líneas) dividiendo por responsabilidad real, no por fragmentación artificial.

### En Backend & APIs (Workers / Functions / Node):
- **Rutas directas:** Handlers concisos con parseo rápido de payload y retorno inmediato.
- **Consultas optimizadas:** Queries SQL / D1 que soliciten solo las columnas requeridas (`SELECT id, name` en vez de `SELECT *`).
- **Manejo de errores limpio:** Try/catch en el punto de entrada con respuesta JSON clara y estandarizada, sin middleware innecesario.

---

## ⚡ Disparadores y Modos de Activación
- **Modo Automático:** Activo permanentemente en todas las intervenciones del agente.
- **Disparadores Verbales:** Cuando el usuario diga *"hazlo simple"*, *"con menos código"*, *"solución rápida"*, *"quirúrgico"*, *"KISS"*, *"eficiente"*, la IA priorizará la variante más corta y limpia que cumpla al 100% el objetivo sin sacrificar robustez.
