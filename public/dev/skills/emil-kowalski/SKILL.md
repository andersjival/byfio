---
name: emil-kowalski
description: >-
  Especialista en animaciones web, micro-interacciones de alta fidelidad, física de resortes (springs) y diseño interactivo según los estándares de Emil Kowalski (Animations on the Web, Sonner). Coreografía fluida de estados, feedback táctil y animaciones que se sienten naturales y vivas.
---

# 🪄 Skill: Emil Kowalski — Animaciones Web & Micro-Interacciones

Inspirado en la filosofía y técnica de **Emil Kowalski** (autor de *Animations on the Web* y creador de *Sonner*), esta habilidad transforma componentes estáticos en interfaces vivas, fluidas y con respuesta física táctil.

---

## ⚡ 1. Principios Fundamentales de Emil Kowalski

1. **Física sobre Duración Fija:**
   - Preferir curvas de resorte (*spring physics*) y transiciones con aceleración y desaceleración orgánica (`cubic-bezier(0.16, 1, 0.3, 1)` o `ease-out`).
   - Evitar `ease-in-out` o duraciones lentas (>500ms) que hagan sentir la interfaz pesada o torpe. El punto dulce está entre **180ms y 320ms**.

2. **Feedback Táctil Inmediato:**
   - Todo elemento interactivo debe responder en menos de 50ms al toque o clic: micro-escalado (`active:scale-95`), cambio sutil de brillo o elevación.
   - Si una acción tiene consecuencias (ej. reserva, cambio de plantilla, check-in), acompañar con un feedback visual claro (morphing, check animado, resplandor).

3. **Coreografía de Estado & Continuidad (Layout Projection):**
   - Cuando un elemento cambia de tamaño o posición, no debe "saltar". Los elementos secundarios deben acomodarse suavemente.
   - Transiciones de pestaña o selector con píldora flotante que se desplaza orgánicamente.

4. **Notificaciones y Toasts Estilo Sonner:**
   - Notificaciones apiladas con escala y desenfoque gradual.
   - Deslizamiento suave al aparecer y retroceso al descartar.

---

## 🛠️ 2. Patrones de Código Tailwind / CSS

### Micro-escalado y Resorte Táctil:
```tsx
className="transition-all duration-200 ease-out active:scale-95 hover:scale-[1.02]"
```

### Píldora Activa con Transición Suave:
```tsx
className={`relative transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
  isActive ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 scale-100' : 'text-slate-400 hover:text-slate-200'
}`}
```

### Fade-In con Elevación Natural:
```css
@keyframes emilFadeUp {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
```
