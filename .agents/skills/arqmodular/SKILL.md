---
name: arqmodular
description: >-
  Estándar de arquitectura modular pragmática, componentes cohesivos (~150-250 líneas como referencia), co-locación orgánica (KISS) y desacoplamiento seguro de mantenimiento vs. refactorización.
---

# 🏛️ ARQMODULAR: Arquitectura Modular y Cohesión Pragmática con IA

Este estándar define las pautas de modularidad y diseño para mantener proyectos escalables, legibles y seguros de editar con IA, **sin caer en sobreingeniería ni romper código en producción**.

---

## 🎯 Objetivos Fundamentales

1. **Aislamiento y Cero Regresiones:** Editar una sección, modal o componente no debe tener efectos secundarios en el resto del sistema.
2. **Contexto Ligero y Preciso:** Trabajar en módulos cohesivos reduce el consumo de tokens y mejora la precisión de las ediciones de la IA.
3. **Modularidad Práctica, no Burocrática:** La modularidad existe para clarificar el código y facilitar cambios futuros, no para crear capas de archivos innecesarios.

---

## 🧱 Las 5 Reglas de Oro de ARQMODULAR

### 1. Cohesión y Tamaño Referencial (~150–250 Líneas)
* **Guía de salud, no dogma matemático:** Los componentes visuales deben mantenerse idealmente alrededor de **150–250 líneas**.
* Si un archivo supera este umbral porque agrupa múltiples sub-secciones, listas complejas o modales incrustados, evalúa dividirlo en submódulos visuales claros dentro de su propia carpeta.
* **Orquestadores Delgados:** Las vistas de página/pantalla principal deben dedicarse a componer sus submódulos, coordinar el layout y verificar permisos o sesión, delegando el detalle visual a componentes hijos.

---

### 2. Co-locación Orgánica vs. Extracción por Umbral (Antisobreingeniería)
Queda prohibido fragmentar código trivial de forma artificial:

* **Nivel 1 — Co-locación Local por Defecto:**
  * Si un tipo/interfaz o estado simple (`useState`) se usa **únicamente dentro de ese componente**, debe vivir en el mismo archivo del componente.
  * *Un componente autocontenido de 50–80 líneas es infinitamente superior a tres archivos dispersos de 15 líneas cada uno.*

* **Nivel 2 — Extracción Justificada por Umbral:**
  * **A `types/`:** Extrae tipos/interfaces únicamente cuando se compartan entre **2 o más componentes distintos**, o cuando definan el contrato de una entidad de dominio central. Prohibido usar `any`.
  * **A `hooks/` o `services/`:** Extrae lógica a custom hooks o servicios únicamente cuando contenga llamadas de red complejas, sincronizaciones asíncronas, validaciones extensas o cuando vaya a ser reutilizada en múltiples lugares.

---

### 3. Desacoplamiento Seguro: Mantenimiento vs. Refactorización
Para proteger la estabilidad en producción de archivos existentes o legacy:

* **En Bugfixes y Ajustes Puntuales (Modo Quirúrgico):**
  * Queda **prohibido refactorizar o extraer código previo** si la tarea es solucionar un bug puntual o hacer un ajuste menor en un archivo monolítico. La IA debe editar únicamente las líneas necesarias en el lugar exacto.
* **Al Agregar Nuevas Funcionalidades a un Archivo Grande:**
  * Crea la nueva funcionalidad como un componente nuevo e independiente en su propio archivo, y en el archivo existente solo importa e inserta la etiqueta `<NuevaFuncionalidad />`. No desarmes el código existente adyacente.
* **Refactorización Activa Solo Bajo Demanda:**
  * La IA únicamente dividirá o reestructurará un archivo monolítico existente cuando el usuario lo solicite expresamente mediante instrucciones como *"refactoriza"*, *"modulariza"* o *"separa este archivo"*.

---

### 4. Núcleo Agnóstico al Stack Tecnológico
* Los principios de modularidad son universales y aplican tanto a frontend (React, Vue, Vite, Next.js) como a backend o serverless.
* La skill no debe asumir ni forzar bases de datos, librerías CSS o URLs externas específicas. Cada proyecto declara sus tecnologías y reglas de entorno en su propio archivo de configuración o `GEMINI.md`.

---

### 5. Línea Base de Verdad y Evolución Controlada
* **Protección contra Regresiones:** El comportamiento aprobado y documentado del sistema representa la línea base de verdad. La IA nunca debe revertir o eliminar funciones existentes por descuido, olvido o alucinación.
* **Evolución Explícita Permitida:** Cuando el usuario ordene explícitamente modificar, ampliar, reemplazar o rediseñar una funcionalidad existente, la IA implementará el cambio respetando la nueva intención y registrará la actualización correspondiente.

---

## 🤝 Sinergia entre `codigo-eficiente` y `arqmodular`

* **`codigo-eficiente`** determina **cuándo y con qué profundidad** intervenir (edición quirúrgica vs. desarrollo completo).
* **`arqmodular`** determina **dónde y cómo estructurar** los componentes y archivos resultantes para garantizar mantenibilidad a largo plazo.
