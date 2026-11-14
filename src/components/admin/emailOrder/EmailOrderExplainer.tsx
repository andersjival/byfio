import React, { useState } from 'react';
import { Mail, Sparkles, Copy, Check, Upload, PlayCircle } from 'lucide-react';

interface EmailOrderExplainerProps {
  onSimulateEmail: () => void;
  onUploadXml: (xmlText: string) => void;
}

export const EmailOrderExplainer: React.FC<EmailOrderExplainerProps> = ({
  onSimulateEmail,
  onUploadXml,
}) => {
  const [copied, setCopied] = useState(false);
  const emailTarget = 'ipedidos@byfiocr.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(emailTarget);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) onUploadXml(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/90 via-indigo-900 to-fio-900 text-white rounded-3xl p-5 sm:p-6 shadow-clay border border-purple-500/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 bg-fio-pink/20 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-fio-pink text-xs font-bubble font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automatización Cloudflare Worker & Factura XML</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bubble font-black tracking-wide text-white">
            INGRESAR PEDIDO POR CORREO
          </h3>

          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
            El correo será enviado a: <strong className="text-amber-300 font-mono underline decoration-amber-400">{emailTarget}</strong>.
            Nuestro sistema tomará ese correo mediante un Worker y extraerá el archivo <strong className="text-white">XML de la Factura Electrónica</strong> con los datos necesarios (proveedor, montos y líneas de productos).
            Al procesarlo, se completará la ficha técnica automáticamente con subtotales, impuestos y lista de productos para revisión.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-200" />}
            <span className="font-mono text-purple-100">{copied ? '¡Copiado!' : emailTarget}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSimulateEmail}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-bubble text-xs font-bold shadow-md cursor-pointer transition-transform active:scale-95"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Simular Correo</span>
            </button>

            <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bubble text-xs font-bold shadow-md cursor-pointer transition-transform active:scale-95">
              <Upload className="w-3.5 h-3.5" />
              <span>Cargar XML</span>
              <input type="file" accept=".xml,text/xml" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
