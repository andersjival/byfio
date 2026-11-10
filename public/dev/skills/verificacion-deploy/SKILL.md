---
name: verificacion-deploy
description: >-
  Protocolo obligatorio de verificación real de despliegue en 3 filtros y auto-inicialización de proyectos nuevos.
  Garantiza que ningún agente declare una tarea como terminada sin confirmar que el código llegó a producción.
  Crea automáticamente HISTORIAL_DE_CAMBIOS.md en proyectos nuevos.
---

# 🛡️ VERIFICACION-DEPLOY: Protocolo de Verificación Real de Despliegue e Inicialización de Proyectos

## 🎯 Objetivo
1. **Nunca declarar una tarea como terminada** sin verificación real de que el código está en producción.
2. **Auto-inicializar proyectos nuevos** con `HISTORIAL_DE_CAMBIOS.md` si no existe.

---

## 📋 Regla 1: Inicialización Automática de Proyecto Nuevo

Al abrir cualquier proyecto, el agente DEBE verificar si existe `HISTORIAL_DE_CAMBIOS.md` en la raíz.
Si **NO existe**, crearlo inmediatamente con esta plantilla:

```markdown
# 📜 HISTORIAL DE CAMBIOS APROBADOS — [NOMBRE_PROYECTO]

Este archivo es el Registro Universal de Memoria Protegida.
Cualquier funcionalidad registrada aquí está blindada: ninguna IA puede eliminarla o revertirla.

---

## 🔗 VINCULACIÓN DEL PROYECTO

- **Repositorio:** [URL del repositorio]
- **Rama:** main
- **URL Producción:** [URL de producción si aplica]

---

(Las entradas de cambios aprobados se agregan aquí)
```

---

## 🔒 Regla 2: Protocolo de 3 Filtros (OBLIGATORIO antes de declarar tarea terminada)

### Filtro 1: Validación Dual Local (Frontend + Backend)

Compilar AMBOS:

1. **Frontend:** `npm run build` (o el build command del proyecto)
2. **Backend/Functions:** Si el proyecto tiene carpeta `functions/`, validar con:
   ```
   npx esbuild functions/**/*.ts --bundle --platform=neutral --format=esm --outfile=node_modules/.cache/test-fn.js
   ```
   Si NO tiene `functions/`, omitir este paso.

**Ambos deben terminar con 0 errores.** Si alguno falla, corregir antes de continuar.

### Filtro 2: Monitoreo de GitHub Actions (CI/CD)

Tras ejecutar `git push origin main`:

1. Consultar la API de GitHub Actions:
   ```
   GET /repos/{owner}/{repo}/actions/runs?per_page=1
   ```
2. Esperar hasta que el run más reciente muestre:
   - `status: completed`
   - `conclusion: success`
3. Si `conclusion: failure`, leer los logs del job fallido, corregir el error y repetir desde Filtro 1.

**PROHIBIDO** declarar la tarea como terminada si `conclusion` no es `success`.

### Filtro 3: Smoke Test HTTP en Producción

Verificar que el bundle desplegado coincide con el build local:

1. Consultar la URL de producción del proyecto:
   ```
   curl -s https://[URL_PRODUCCION] | grep "assets/index-"
   ```
2. Comparar el hash del archivo JS/CSS con el que aparece en `dist/index.html` local.
3. Si los hashes **no coinciden**, significa que el despliegue no se completó. Investigar y resolver.

---

## ⚡ Regla 3: Formato de Reporte de Cierre

Al completar los 3 filtros exitosamente, reportar al usuario con esta tabla:

```
| Filtro | Resultado |
|--------|-----------|
| 1. Validación Dual Local | ✅ / ❌ |
| 2. GitHub Actions (Job ID, conclusion) | ✅ success / ❌ failure |
| 3. Smoke Test HTTP (hash match) | ✅ / ❌ |
```

Incluir siempre el **hash del commit** generado.

---

## 🔄 Adaptabilidad por Proyecto

- **Sin CI/CD:** Si el proyecto no tiene GitHub Actions ni workflow de deploy, omitir Filtro 2 y documentar que el despliegue es manual.
- **Sin URL de producción:** Si es un proyecto local sin hosting, omitir Filtro 3.
- **Sin `functions/`:** Si no hay backend serverless, la validación dual se reduce solo al frontend.

El agente debe **detectar automáticamente** qué filtros aplican al proyecto actual.
