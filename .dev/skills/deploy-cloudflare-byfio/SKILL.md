---
name: deploy-cloudflare-byfio
description: >-
  Protocolo exclusivo de despliegue en vivo a Cloudflare Pages para el proyecto BYFIO.
  Usa las credenciales almacenadas en CLAVES ANDERSJIVAL.txt en la raíz del proyecto.
---

# 🚀 Despliegue en Vivo a Cloudflare Pages — BYFIO

Este proyecto **NO utiliza servidores locales** de desarrollo en producción. Todo cambio se compila y se despliega directamente en vivo a Cloudflare Pages.

---

## 🔑 Credenciales del Proyecto

Las credenciales y tokens de acceso oficiales se encuentran en el archivo local [`CLAVES ANDERSJIVAL.txt`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/CLAVES%20ANDERSJIVAL.txt) en la raíz del proyecto.
- **Proyecto Cloudflare Pages:** `byfiocr`
- **URL Producción:** `https://byfiocr.com`
- **D1 Database ID:** `60326015-d917-4a7b-baac-ab90d972ae57`

---

## 🛠️ Flujo Obligatorio de Despliegue en Vivo

1. **Compilar Frontend:**
   ```powershell
   npm run build
   ```

2. **Validar Backend (Functions):**
   ```powershell
   npx esbuild (Get-ChildItem -Path functions -Recurse -Filter *.ts | Select-Object -ExpandProperty FullName) --bundle --platform=neutral --format=esm --outdir=node_modules/.cache/test-fn
   ```

3. **Cargar Credenciales y Desplegar Directo a Cloudflare Pages:**
   ```powershell
   $claves = Get-Content "CLAVES ANDERSJIVAL.txt" -Raw
   $token = [regex]::Match($claves, 'Tu token de API:\s*([^\r\n]+)').Groups[1].Value.Trim()
   $cuenta = [regex]::Match($claves, 'ID de cuenta:\s*([^\r\n]+)').Groups[1].Value.Trim()
   $env:CLOUDFLARE_API_TOKEN = $token
   $env:CLOUDFLARE_ACCOUNT_ID = $cuenta
   npx wrangler pages deploy dist --project-name=byfiocr
   ```

4. **Sincronizar Repositorio GitHub:**
   ```powershell
   git add -A; git commit -m "feat/fix: descripción"; git push origin main
   ```

5. **Verificar Producción:**
   Consultar `https://byfiocr.com` para confirmar el nuevo bundle desplegado.
