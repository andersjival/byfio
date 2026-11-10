# ⚡ Instrucciones Automáticas del Proyecto BYFIO

## 🌐 Despliegue en Vivo a Cloudflare (Cero Servidores Locales)
1. **No correr servidores locales de desarrollo** (`npm run dev`) a menos que el usuario lo solicite expresamente. Todo cambio se compila y se despliega directamente en vivo a Cloudflare Pages.
2. **Ubicación de Accesos y Credenciales:**
   - Todas las credenciales, ID de cuenta y token de API de Cloudflare están guardados en el archivo local [`CLAVES ANDERSJIVAL.txt`](file:///c:/Users/User/Desktop/GeoSoft/CUENTA%20ANDERSJIVAL/CLIENTES%20WEBS/BYFIO/CLAVES%20ANDERSJIVAL.txt) en la raíz del proyecto.
   - El agente debe leer `CLAVES ANDERSJIVAL.txt` para obtener el `Tu token de API` y el `ID de cuenta`.
   - **Proyecto Cloudflare Pages:** `byfiocr`
   - **URL Producción:** `https://byfiocr.pages.dev`
   - **Database D1:** `byfiocr-db` (ID: `60326015-d917-4a7b-baac-ab90d972ae57`)

## 🚀 Comando Universal de Despliegue en Vivo
Tras cualquier modificación aprobada:
```powershell
npm run build
$claves = Get-Content "CLAVES ANDERSJIVAL.txt" -Raw
$token = [regex]::Match($claves, 'Tu token de API:\s*([^\r\n]+)').Groups[1].Value.Trim()
$cuenta = [regex]::Match($claves, 'ID de cuenta:\s*([^\r\n]+)').Groups[1].Value.Trim()
$env:CLOUDFLARE_API_TOKEN = $token
$env:CLOUDFLARE_ACCOUNT_ID = $cuenta
npx wrangler pages deploy dist --project-name=byfiocr
git add -A; git commit -m "feat/fix: descripción"; git push origin main
```
