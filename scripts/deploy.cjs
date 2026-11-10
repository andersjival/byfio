const fs = require('fs');
const { execSync } = require('child_process');

try {
  const claves = fs.readFileSync('CLAVES ANDERSJIVAL.txt', 'utf8');
  const tokenMatch = claves.match(/Tu token de API:\s*([^\r\n]+)/);
  const accountMatch = claves.match(/ID de cuenta:\s*([^\r\n]+)/);

  if (!tokenMatch || !accountMatch) {
    console.error('No se pudieron extraer las credenciales de CLAVES ANDERSJIVAL.txt');
    process.exit(1);
  }

  const token = tokenMatch[1].trim();
  const accountId = accountMatch[1].trim();

  process.env.CLOUDFLARE_API_TOKEN = token;
  process.env.CLOUDFLARE_ACCOUNT_ID = accountId;

  console.log('🚀 Desplegando en vivo a Cloudflare Pages (byfiocr)...');
  execSync('npx wrangler pages deploy dist --project-name=byfiocr', {
    stdio: 'inherit',
    env: process.env,
  });
  console.log('✅ Despliegue completado con éxito.');
} catch (error) {
  console.error('Error durante el despliegue:', error.message);
  process.exit(1);
}
