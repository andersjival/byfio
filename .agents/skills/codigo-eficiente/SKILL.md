---
name: codigo-eficiente
description: >-
  Principio de proporcionalidad, minimalismo práctico y edición quirúrgica (KISS / YAGNI). Aplica cambios quirúrgicos en código existente y bugfixes sin sobreingeniería, manteniendo completitud y robustez al construir nuevas funcionalidades.
---

# ⚡ Código Eficiente: Proporcionalidad y Ejecución Quirúrgica (KISS / YAGNI)

Esta habilidad establece el estándar para la generación y modificación de código: **máxima claridad, seguridad y robustez con la complejidad justa que exige el problema**.

---

## 🎯 Filosofía Central

> **"Complejidad proporcional: quirúrgico al modificar, sólido al construir."**
> El mejor código no es el que tiene menos líneas a toda costa, sino el que resuelve el requerimiento de forma directa, segura y mantenible, evitando tanto la sobreingeniería abstracta como los parches frágiles.

---

## ⚖️ Dos Modos de Operación

### Modo A: Mantenimiento, Bugfixes y Ajustes Puntuales (Strict Surgical Mode)
Aplica cuando se corrige un error, se cambia un estilo, se añade un parámetro o se realiza una edición puntual en código existente:

1. **Edición Quirúrgica:** Toca únicamente las líneas indispensables para resolver el problema. Nunca reescribas archivos completos ni re-formatees código no relacionado (evita ruido en git diffs y previene regresiones).
2. **Cero Refactorización No Solicitada:** No extraigas componentes, no muevas estados ni reorganices archivos legacy salvo que el usuario lo pida expresamente. Si el bug se resuelve cambiando un `if` o una clase CSS, haz solo ese cambio.
3. **Preservación de Contratos:** Respeta los contratos de props, tipos y estado existentes. No introduzcas dependencias ni capas intermedias innecesarias.

---

### Modo B: Nuevas Funcionalidades y Módulos desde Cero (Clean Architecture Mode)
Aplica cuando se crea una funcionalidad nueva, una integración o un módulo completo:

1. **Completitud Funcional:** Entrega código listo para producción, incluyendo manejo de errores, estados de carga, validaciones de entrada y casos límite críticos.
2. **Abstracción Justificada:** Se permiten helpers o módulos independientes únicamente cuando se reutilizan genuinamente en 2 o más lugares o cuando previenen riesgos reales (ej. cálculos financieros, validación de esquemas, seguridad o fechas).
3. **Cero Código Especulativo (YAGNI):** Resuelve el requerimiento presente. Prohibido agregar parámetros, flags o enums "por si acaso en el futuro".

---

## 🧱 Reglas Transversales de Eficiencia

* **Reutilización Inteligente:** Antes de crear una utilidad, componente UI o tipo nuevo, verifica si ya existe en el proyecto (`utils/`, `components/`, `hooks/`, `services/`) para evitar duplicación.
* **Co-locación vs. Fragmentación:** Un archivo de 50 líneas autocontenido con su interfaz local y estado simple es preferible a 3 archivos dispersos de 10 líneas cada uno. Separa únicamente cuando la lógica sature la vista o se comparta.
* **Derivación de Estado:** En el frontend, calcula valores derivados directamente durante el render o con `useMemo` si es costoso; evita sincronizar estados redundantes con `useEffect`.
* **Verificación de Compilación Obligatoria:** Antes de dar por finalizada una tarea, comprueba que el código compile sin errores de tipado o sintaxis (`npm run build` o `tsc --noEmit`).

---

## ⚡ Disparadores Verbales
* **Modo Base:** Determina automáticamente si la tarea es un ajuste/bugfix (Modo A) o una feature nueva (Modo B).
* **Modo Ultra-Minimalista:** Cuando el usuario indique *"hazlo quirúrgico"*, *"solo el diff"*, *"KISS"*, *"con menos código"* o *"solución directa"*, aplica la variante más concisa y localizada posible sin tocar código circundante.
