---
name: shadcn-ui
description: >-
  Estandar de oro para sistemas de componentes de interfaz web modernos basado en shadcn/ui (Radix UI + Tailwind CSS, Licencia MIT). Enfoque de codigo propio y personalizable (copy-paste architecture), componentes accesibles (WAI-ARIA), formularios modulares y consistencia de diseno de nivel Supabase y Linear.
---

# 💎 Skill: shadcn/ui — Arquitectura de Componentes Web de Alta Calidad

Inspirado en el estándar de oro de la industria web moderna **shadcn/ui** (`shadcn-ui/ui`), este enfoque descarta las librerías de componentes empaquetadas en cajas negras para adoptar código fuente accesible, modular y completamente editable dentro del propio repositorio.

---

## 🧩 1. Principios de shadcn/ui

1. **Propiedad Total del Código:**
   - No dependas de librerías CSS pesadas que no puedes modificar. El código del componente vive en `components/ui/` y eres dueño del 100% de su marcado, estilos y lógica.

2. **Accesibilidad WAI-ARIA (Radix Primitives):**
   - Modales con bloqueo de foco, menús desplegables navegables con teclado, pestañas con roles ARIA y gestión de estado transparente.

3. **Composición sobre Configuración:**
   - Construir interfaces complejas a través de pequeños bloques elementales: `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardContent>`, `<Button variant="outline">`, `<Badge>`.

4. **Variantes Tipadas:**
   - Definir variantes de estilo (`default`, `secondary`, `destructive`, `outline`, `ghost`) para que los botones y tarjetas respondan de forma consistente en todo el SaaS.
