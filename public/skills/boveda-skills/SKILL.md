---
name: boveda-skills
description: >-
  Gestor y cargador central de la Boveda de Skills (Skills Vault). Gestiona las skills de arranque por default y el catalogo de Skills Auxiliares. Detecta teclas rapidas (i, e, s, 1, inicio, start, empezar) para mostrar el indice interactivo y aplica Memoria Protegida universal.
---

# 🏛️ Boveda Central de Skills (`boveda-skills`)

Esta habilidad gestiona el catalogo central de skills ubicado en `C:\Users\User\SkillsVault\`.
Permite que cada proyecto trabaje con sus skills de arranque por default y cargue bajo demanda las skills auxiliares, reduciendo drasticamente el consumo de tokens.

## 📍 Ubicaciones Clave:
- **Boveda Central:** `C:\Users\User\SkillsVault\`
- **Skills Principales (Activas):** `C:\Users\User\SkillsVault\skills\`
- **Skills Auxiliares (Bajo Demanda):** `C:\Users\User\SkillsVault\Skills Auxiliares\`
- **Plugins Auxiliares (En Reserva):** `C:\Users\User\SkillsVault\Plugins Auxiliares\`
- **Catalogo Detallado:** `C:\Users\User\SkillsVault\CATALOGO.md`
- **Catalogo JSON:** `C:\Users\User\SkillsVault\catalogo.json`
- **Script Gestor:** `C:\Users\User\SkillsVault\gestor-skills.ps1`
- **Destino en el Proyecto:** `<directorio-del-proyecto>\.agents\skills\<nombre-skill>\`

---

## 💬 Regla Universal de Primer Mensaje (Obligatoria para Toda Conversación)

> ⚡ **PRIMERA RESPUESTA DE LA IA:**
> Sin importar lo que escriba el usuario en su primer mensaje (sea un comando de inicio `i`, `e`, `s`, `1`, un saludo, o una solicitud directa de trabajo), la IA **DEBE SIEMPRE incluir en su primera respuesta la siguiente pregunta proactiva**:
> 
> > 🧩 **¿Deseas activar el Modo de Trabajo por Módulos de Creación (Módulos Visuales y Aislamiento Quirúrgico)?**
> > *(Al activarlo, tú hablas en términos de tus pantallas visuales y la IA mapea el trabajo exclusivamente a los archivos correspondientes, sin tocar ni arriesgar el resto del sistema).*
> 
> Si el usuario responde afirmativamente (ej: *"sí"*, *"actívalo"*, *"1"*, *"módulo"*), la IA adoptará este protocolo de inmediato para toda la sesión.

---

## ⌨️ Disparador de Menú Rápido (Teclas de Inicio)

Cuando el usuario envíe un mensaje inicial o comando con cualquiera de las siguientes teclas o palabras:
> **`i`** | **`e`** | **`s`** | **`1`** | **`inicio`** | **`start`** | **`empezar`**

La IA **DEBE presentar de inmediato el Menú de Arranque de Skills** mostrando:
1. **Lista de Skills de Arranque por Default (Activas)** que acompañan al proyecto.
2. **Índice de Skills Auxiliares** disponibles en la carpeta `Skills Auxiliares`, preguntando si desea activar alguna para la sesión.
3. **La pregunta obligatoria de activación del Modo de Trabajo por Módulos de Creación.**

---

## 🚀 Skills de Arranque por Default (Siempre Activas / Listas)

Estas son las skills activas que rigen el proyecto desde el primer segundo:

| Skill | Nivel | Propósito Fundamental |
|---|---|---|
| **`arqmodular`** | Global | Arquitectura limpia modular (<150–180 líneas), separación estricta en 3 capas, componentes atómicos. |
| **`verificacion-deploy`** | Global | Protocolo obligatorio de 3 filtros (build dual, CI/CD GitHub Actions, smoke test HTTP) y auto-inicialización de `HISTORIAL_DE_CAMBIOS.md`. |
| **`boveda-skills`** | Global | Gestor de bóveda, receptor de teclas de menú y custodio de Memoria Protegida. |
| **`codigo-eficiente`** | Global | Máxima eficiencia de código, minimalismo quirúrgico (KISS / YAGNI), reutilización previa y cero sobreingeniería. |
| **`polling-inteligente`** | Global | Estándar anti-drain de cuota: prohíbe polling ciego, pausa inmediata en pestañas inactivas e intervalos racionales. |
| **`modo-caveman`** | Vault Principal | Comunicación concisa (Zero-Yap) para máximo ahorro de tokens de salida. |
| **`estilo-ide`** | Vault Principal | Estética AgentOS / VSCode, densidad alta y modo oscuro. |
| **`diseno-en-vivo`** | Vault Principal | Verificación de diseño, build local y deploy a Cloudflare Pages. |
| **`chat-en-vivo`** | Vault Principal | Soporte técnico, chat en tiempo real y tickets. |
| **`conexion-historial-agentes`** | Vault Principal | Auditoría, telemetría y logs de agentes IA. |
| **`frontend-design`** | Vault Principal | Dirección de arte intencional, diseño web corporativo de alta gama, B2B/SaaS y cero AI-slop. |

---

## 📦 Índice de Skills Auxiliares (Carpeta "Skills Auxiliares")

Estas skills están resguardadas en `C:\Users\User\SkillsVault\Skills Auxiliares` y se importan bajo demanda:

| # | Skill | Disparador / Cuándo Cargar |
|---|---|---|
| **1** | `android-cli` | Desarrollo o compilación de proyectos Android |
| **2** | `animacion-sesion` | Animaciones cinematográficas de Login/Logout y transiciones |
| **3** | `arqai-setup` | Conexión e inicialización con ARQ AI Studio Hub |
| **4** | `calculo-iva-factores` | Motor matemático de impuestos, factores SINALEVI D-105 y Débito/Crédito D-104 |
| **5** | `conexion-google-gmail` | Autenticación Google GIS OAuth 2.0 y escaneo Gmail en tiempo real (0 latencia) |
| **6** | `enviar-jules` | Delegación de tareas pesadas a Google Jules |
| **7-16** | `firebase-*` (10 módulos) | Firebase Auth, Firestore, Hosting, Crashlytics, Data Connect, etc. |
| **17** | `urllink-agent-api` | Conexión al Hub Central de APIs de urlLink |
| **18** | `xcode-project-setup` | Configuración de proyectos iOS y dependencias Swift |
| **19** | `sinpe-movil` | Flujo de pago en 2 pasos SINPE Móvil (Costa Rica), validación y comprobantes |

---

## ⚡ Cómo Cargar una Skill Auxiliar Bajo Demanda

Si el usuario solicita una skill auxiliar (ej: *"carga animacion-sesion"* o *"activa firebase"*):
1. La IA ejecuta de inmediato en segundo plano:
   ```powershell
   powershell -ExecutionPolicy Bypass -File "C:\Users\User\SkillsVault\gestor-skills.ps1" -Import <nombre-skill> -Project "<directorio-proyecto>"
   ```
2. Aplica las directivas de la skill importada para resolver la tarea.

---

## 🔌 Consulta de Plugins Disponibles

Si el usuario pregunta *"cuáles plugins hay"* o *"qué plugins tenemos"*, la IA responderá de inmediato consultando `C:\Users\User\SkillsVault\Plugins Auxiliares\CATALOGO_PLUGINS.md` y mostrando:
1. Los plugins auxiliares en reserva (`google_maps_platform`, `data-agent-kit-plugin`, `google-antigravity-sdk`, `chrome-devtools-plugin`, `android-cli-plugin`, `firebase`).
2. La opción de activar cualquiera cambiando `"enabled": true` en `~/.gemini/config/config.json`.

---

## 🛡️ Memoria Protegida Universal (Historial de Cambios Aprobados)

Aplica de forma obligatoria e inmutable a **TODOS LOS PROYECTOS Y CHATS**:
1. **Inmutabilidad Absoluta:** Todo proyecto debe contar con un archivo `HISTORIAL_DE_CAMBIOS.md`.
2. **Prohibido Volver Atrás:** La IA tiene **ESTRICTAMENTE PROHIBIDO** modificar, revertir, romper o borrar cualquier funcionalidad, componente o flujo que ya esté registrado en dicho historial.
3. **Construcción Siempre Hacia Adelante:** La aplicación se construye agregando módulos nuevos encima de lo que ya funciona, nunca rehaciendo o descomponiendo lo que el usuario ya aprobó.
4. **Registro Solo por Confirmación:** Solo se añaden nuevas entradas al historial cuando el usuario confirme explícitamente: *"Agrégalo al historial de cambios"*.
