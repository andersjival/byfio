import React, { useState } from 'react';
import {
  Key,
  Copy,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  ShieldCheck,
  Database,
  Globe,
  Server,
  Terminal,
  Lock,
} from 'lucide-react';

export const SuperadminAiAccessCards: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  const CLOUDFLARE_DATA = {
    accountId: 'c45409ee4154cf898c37375b1e96d910',
    apiToken: typeof window !== 'undefined' ? atob('Y2ZhdF9rbmttR0l0eTVTcEJUS3U2eU5DRUd2U2xrbnRJbGZKNUtLcjM3bjlNMzFlOWViZmE=') : '',
    pagesProject: 'byfiocr',
    prodUrl: 'https://byfiocr.com',
    aiSubdomain: 'https://ai.byfiocr.com',
    dnsZoneId: '01514e27c0cdd221efd91900be83fb16',
    agentDbName: 'byfio-agent-db',
    agentDbId: '56c38379-4579-41c5-a189-abb580893175',
    storeDbName: 'byfiocr-db',
    storeDbId: '60326015-d917-4a7b-baac-ab90d972ae57',
    r2AccessKeyId: '1dd212532cdea1e2dbbaa54e4dc4eafc',
    r2SecretKey: typeof window !== 'undefined' ? atob('MjRiM2QwOGY0Mzc1OGM1Njk0ODNmZDkyZTg3Y2M0NDE4N2U1ZWNiNzJjMDM2ZDdmYWYxMzc5NDRjMjUwMGMxZg==') : '',
    r2Endpoint: 'https://c45409ee4154cf898c37375b1e96d910.r2.cloudflarestorage.com',
    githubRepo: 'https://github.com/andersjival/byfio.git',
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Banner de Estado de Conectividad */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-purple-600/15 to-pink-500/15 border-2 border-amber-400/40 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-sm shrink-0">
            <Key className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h3 className="font-bubble font-black text-sm sm:text-base text-fio-900 dark:text-purple-100 flex items-center gap-2">
              Credenciales &amp; Accesos Oficiales del Agente
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono font-bold">
                Conectado y Operativo
              </span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-purple-300">
              Ubicación de credenciales en archivo local:&nbsp;
              <code className="px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/70 text-fio-pink font-mono text-[11px] font-bold">
                CLAVES ANDERSJIVAL.txt
              </code>
            </p>
          </div>
        </div>

        <a
          href="https://dash.cloudflare.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/70 hover:bg-purple-800 text-purple-200 text-xs font-bold border border-purple-500/40 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <span>Abrir Cloudflare Dashboard</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Grid de Tarjetas de Credenciales Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Tarjeta 1: Token de API Cloudflare */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1a142a] border border-purple-200/80 dark:border-purple-800/40 shadow-sm flex flex-col justify-between space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-500">
                <Lock className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-bubble font-bold text-xs text-fio-900 dark:text-purple-100">
                  Token de API Cloudflare
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-purple-300">
                  Permisos: Workers AI, D1 Edit, Pages Deploy
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
              title={showToken ? 'Ocultar token' : 'Mostrar token'}
            >
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-purple-950/50 border border-slate-200 dark:border-purple-800/40">
            <code className="text-xs font-mono text-fio-pink truncate">
              {showToken
                ? CLOUDFLARE_DATA.apiToken
                : `${CLOUDFLARE_DATA.apiToken.substring(0, 10)}••••••••••••••••••••••••••••••••`}
            </code>
            <button
              type="button"
              onClick={() => handleCopy(CLOUDFLARE_DATA.apiToken, 'token')}
              className="p-1.5 rounded-xl bg-purple-100 dark:bg-purple-900/60 hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-700 dark:text-purple-200 transition-colors cursor-pointer shrink-0"
              title="Copiar token"
            >
              {copiedKey === 'token' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Tarjeta 2: ID de Cuenta Cloudflare */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1a142a] border border-purple-200/80 dark:border-purple-800/40 shadow-sm flex flex-col justify-between space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-purple-500/10 text-purple-500">
                <Server className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-bubble font-bold text-xs text-fio-900 dark:text-purple-100">
                  ID de Cuenta Cloudflare
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-purple-300">
                  Cuenta: CUENTA ANDERSJIVAL
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 font-bold">
              Account ID
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-purple-950/50 border border-slate-200 dark:border-purple-800/40">
            <code className="text-xs font-mono text-purple-700 dark:text-purple-200 truncate">
              {CLOUDFLARE_DATA.accountId}
            </code>
            <button
              type="button"
              onClick={() => handleCopy(CLOUDFLARE_DATA.accountId, 'account_id')}
              className="p-1.5 rounded-xl bg-purple-100 dark:bg-purple-900/60 hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-700 dark:text-purple-200 transition-colors cursor-pointer shrink-0"
              title="Copiar ID de cuenta"
            >
              {copiedKey === 'account_id' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Tarjeta 3: Subdominio Dedicado IA */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1a142a] border border-purple-200/80 dark:border-purple-800/40 shadow-sm flex flex-col justify-between space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-pink-500/10 text-fio-pink">
                <Globe className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-bubble font-bold text-xs text-fio-900 dark:text-purple-100">
                  Subdominio Dedicado IA
                </h4>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  SSL Google Trust Services • HTTP/2
                </p>
              </div>
            </div>
            <a
              href={CLOUDFLARE_DATA.aiSubdomain}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-fio-pink hover:underline font-bold flex items-center gap-0.5"
            >
              <span>Abrir</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-purple-950/50 border border-slate-200 dark:border-purple-800/40">
            <code className="text-xs font-mono text-fio-pink truncate">
              {CLOUDFLARE_DATA.aiSubdomain}
            </code>
            <button
              type="button"
              onClick={() => handleCopy(CLOUDFLARE_DATA.aiSubdomain, 'subdomain')}
              className="p-1.5 rounded-xl bg-purple-100 dark:bg-purple-900/60 hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-700 dark:text-purple-200 transition-colors cursor-pointer shrink-0"
              title="Copiar subdominio"
            >
              {copiedKey === 'subdomain' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Tarjeta 4: Proyecto Pages & Dominio Principal */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1a142a] border border-purple-200/80 dark:border-purple-800/40 shadow-sm flex flex-col justify-between space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-blue-500/10 text-blue-500">
                <Globe className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-bubble font-bold text-xs text-fio-900 dark:text-purple-100">
                  Cloudflare Pages &amp; Dominio Producción
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-purple-300">
                  Proyecto: {CLOUDFLARE_DATA.pagesProject}
                </p>
              </div>
            </div>
            <a
              href={CLOUDFLARE_DATA.prodUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-blue-500 hover:underline font-bold flex items-center gap-0.5"
            >
              <span>byfiocr.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-purple-950/50 border border-slate-200 dark:border-purple-800/40">
            <code className="text-xs font-mono text-slate-700 dark:text-purple-200 truncate">
              {CLOUDFLARE_DATA.prodUrl} (Pages: {CLOUDFLARE_DATA.pagesProject})
            </code>
            <button
              type="button"
              onClick={() => handleCopy(CLOUDFLARE_DATA.prodUrl, 'prod_url')}
              className="p-1.5 rounded-xl bg-purple-100 dark:bg-purple-900/60 hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-700 dark:text-purple-200 transition-colors cursor-pointer shrink-0"
              title="Copiar URL"
            >
              {copiedKey === 'prod_url' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Bases de Datos D1 Cloudflare */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1a142a] border border-purple-200/80 dark:border-purple-800/40 shadow-sm space-y-3">
        <h4 className="font-bubble font-black text-sm text-fio-900 dark:text-purple-100 flex items-center gap-2">
          <Database className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          Bases de Datos Cloudflare D1 (Aislamiento de Seguridad)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* BD Agente */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-purple-950/40 border border-slate-200 dark:border-purple-800/40 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-fio-900 dark:text-purple-100">
                  1. BD Memoria &amp; Métricas (Agente):
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                  Independiente
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-purple-300">
                Guarda conversaciones, neuronas consumidas y eventos realtime.
              </p>
            </div>
            <div className="flex items-center justify-between gap-1 p-2 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-purple-900/40 font-mono text-[11px]">
              <span className="text-fio-pink font-bold truncate">
                {CLOUDFLARE_DATA.agentDbName} ({CLOUDFLARE_DATA.agentDbId})
              </span>
              <button
                type="button"
                onClick={() => handleCopy(CLOUDFLARE_DATA.agentDbId, 'agent_db')}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                title="Copiar ID D1"
              >
                {copiedKey === 'agent_db' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* BD Tienda */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-purple-950/40 border border-slate-200 dark:border-purple-800/40 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-fio-900 dark:text-purple-100">
                  2. BD Tienda Principal (Catálogo):
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">
                  Modo SELECT (Solo Lectura)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-purple-300">
                La IA solo consulta stock y cupos; es imposible que modifique o borre registros.
              </p>
            </div>
            <div className="flex items-center justify-between gap-1 p-2 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-purple-900/40 font-mono text-[11px]">
              <span className="text-purple-600 dark:text-purple-300 font-bold truncate">
                {CLOUDFLARE_DATA.storeDbName} ({CLOUDFLARE_DATA.storeDbId})
              </span>
              <button
                type="button"
                onClick={() => handleCopy(CLOUDFLARE_DATA.storeDbId, 'store_db')}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                title="Copiar ID D1"
              >
                {copiedKey === 'store_db' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Storage R2 / S3 y Endpoints de la API */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Storage R2 / S3 */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1a142a] border border-purple-200/80 dark:border-purple-800/40 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-bubble font-bold text-xs text-fio-900 dark:text-purple-100 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-amber-500" />
              Almacenamiento Cloudflare R2 / S3
            </h4>
            <button
              type="button"
              onClick={() => setShowSecretKey(!showSecretKey)}
              className="text-[10px] text-purple-500 hover:underline font-bold"
            >
              {showSecretKey ? 'Ocultar Secreto' : 'Revelar Secreto'}
            </button>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-purple-950/40 flex items-center justify-between">
              <span className="text-slate-500 dark:text-purple-300">Access Key ID:</span>
              <div className="flex items-center gap-1">
                <code className="font-mono font-bold text-slate-800 dark:text-purple-100">{CLOUDFLARE_DATA.r2AccessKeyId}</code>
                <button
                  type="button"
                  onClick={() => handleCopy(CLOUDFLARE_DATA.r2AccessKeyId, 'r2_key')}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  {copiedKey === 'r2_key' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 dark:bg-purple-950/40 flex items-center justify-between">
              <span className="text-slate-500 dark:text-purple-300">Secret Key:</span>
              <div className="flex items-center gap-1">
                <code className="font-mono font-bold text-fio-pink">
                  {showSecretKey ? CLOUDFLARE_DATA.r2SecretKey : '••••••••••••••••••••••••••••••••'}
                </code>
                <button
                  type="button"
                  onClick={() => handleCopy(CLOUDFLARE_DATA.r2SecretKey, 'r2_sec')}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  {copiedKey === 'r2_sec' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Endpoints REST de la API */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1a142a] border border-purple-200/80 dark:border-purple-800/40 shadow-sm space-y-2.5">
          <h4 className="font-bubble font-bold text-xs text-fio-900 dark:text-purple-100 flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-emerald-500" />
            Endpoints Oficiales de la API del Asistente
          </h4>

          <div className="space-y-1.5 text-[11px] font-mono">
            <div className="p-1.5 px-2.5 rounded-xl bg-slate-50 dark:bg-purple-950/40 flex items-center justify-between">
              <span className="text-purple-600 dark:text-purple-300 font-bold">POST /api/ai/chat</span>
              <span className="text-slate-500 dark:text-purple-400 text-[10px]">Llama 3.3 / Gemma 4</span>
            </div>
            <div className="p-1.5 px-2.5 rounded-xl bg-slate-50 dark:bg-purple-950/40 flex items-center justify-between">
              <span className="text-purple-600 dark:text-purple-300 font-bold">POST /api/ai/transcribe</span>
              <span className="text-slate-500 dark:text-purple-400 text-[10px]">Whisper Turbo Audio</span>
            </div>
            <div className="p-1.5 px-2.5 rounded-xl bg-slate-50 dark:bg-purple-950/40 flex items-center justify-between">
              <span className="text-purple-600 dark:text-purple-300 font-bold">GET/POST /api/ai/metrics</span>
              <span className="text-slate-500 dark:text-purple-400 text-[10px]">Telemetría y Neuronas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modelos Oficiales de IA en Uso en el Proyecto (Exclusivo Superadmin) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1a142a] border-2 border-purple-200/90 dark:border-purple-800/50 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bubble font-black text-sm text-fio-900 dark:text-purple-100 flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
              <Server className="w-4 h-4" />
            </span>
            <span>Modelos de Inteligencia Artificial Oficiales en Uso en el Proyecto</span>
          </h4>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-mono font-bold">
            Cloudflare Workers AI Activo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Modelo 1 */}
          <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 space-y-1">
            <span className="text-[11px] font-bold text-slate-700 dark:text-purple-200 block">
              1. Clientes Web (Atención &amp; Ventas)
            </span>
            <code className="text-[11px] font-mono text-purple-700 dark:text-purple-300 font-bold block truncate">
              @cf/meta/llama-3.3-70b-instruct-fp8-fast
            </code>
            <p className="text-[10px] text-slate-500 dark:text-purple-400">
              Fallback: <span className="font-mono">@cf/meta/llama-3.1-8b-instruct-fp8</span>
            </p>
          </div>

          {/* Modelo 2 */}
          <div className="p-3 rounded-2xl bg-pink-50/70 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/40 space-y-1">
            <span className="text-[11px] font-bold text-slate-700 dark:text-purple-200 block">
              2. Staff &amp; Administración (Inventario)
            </span>
            <code className="text-[11px] font-mono text-pink-700 dark:text-pink-300 font-bold block truncate">
              @cf/google/gemma-4-26b-a4b-it
            </code>
            <p className="text-[10px] text-slate-500 dark:text-purple-400">
              Fallback: <span className="font-mono">@cf/meta/llama-3.3-70b-instruct-fp8-fast</span>
            </p>
          </div>

          {/* Modelo 3 */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200/70 dark:border-purple-900/40 space-y-1">
            <span className="text-[11px] font-bold text-slate-700 dark:text-purple-200 block">
              3. Transcripción de Audio / Voz
            </span>
            <code className="text-[11px] font-mono text-purple-700 dark:text-purple-300 font-bold block truncate">
              @cf/openai/whisper
            </code>
            <p className="text-[10px] text-slate-500 dark:text-purple-400">
              Procesamiento de notas de voz en tiempo real
            </p>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 text-[11px] text-slate-600 dark:text-purple-300 flex items-center justify-between flex-wrap gap-2">
          <span>
            Calibración técnica activa: <strong>Temp 0.3</strong> | <strong>Tokens 120</strong> | <strong>Top-P 0.85</strong> | <strong>Top-K 40</strong>
          </span>
          <span className="text-purple-600 dark:text-purple-300 font-mono font-bold">
            Separador: ||| (Chunking WhatsApp)
          </span>
        </div>
      </div>
    </div>
  );
};
