import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCRC } from '../../utils/formatters';
import { parseBcrSinpeEmail, SAMPLE_BCR_SINPE_EMAILS } from '../../utils/bcrSinpeParser';
import {
  CheckCircle2, AlertTriangle, Mail, ShieldCheck,
  Sparkles, Copy, Check, Trash2, ArrowRight, DollarSign,
  GraduationCap, ShoppingBag, Landmark, Phone, Calendar, Hash,
  RefreshCw, Send, CheckCircle, ExternalLink, Search, ShieldAlert
} from 'lucide-react';

export const SinpePaymentsSection: React.FC = () => {
  const {
    sinpeTransactions,
    sinpeSettings,
    registerSinpeTransaction,
    validateSinpeReference,
    deleteSinpeTransaction,
    updateSinpeSettings,
    workshops,
    isFeatureEnabled,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'extract' | 'settings' | 'history'>('extract');
  const [emailText, setEmailText] = useState('');
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  // Estado del validador rápido de comprobante manual
  const [manualRefInput, setManualRefInput] = useState('');
  const [manualValidationResult, setManualValidationResult] = useState<{
    tested: boolean;
    isUsed: boolean;
    message: string;
    transaction?: (typeof sinpeTransactions)[0];
  } | null>(null);

  // Estado del correo configurado
  const [tempEmail, setTempEmail] = useState(sinpeSettings.forwardingEmail || 'fiorellajaravargas@gmail.com');

  // Estado de extracción
  const [parsedData, setParsedData] = useState<ReturnType<typeof parseBcrSinpeEmail> | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'store' | 'workshop'>('store');
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>('');
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleVerifyManualRef = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanRef = manualRefInput.trim();
    if (!cleanRef) {
      setManualValidationResult({
        tested: true,
        isUsed: false,
        message: 'Por favor digite el número de referencia de la transferencia.',
      });
      return;
    }
    const check = validateSinpeReference(cleanRef);
    setManualValidationResult({
      tested: true,
      isUsed: check.isUsed,
      message: check.message,
      transaction: check.transaction,
    });
  };

  const handleProcessEmail = () => {
    setActionFeedback(null);
    if (!emailText.trim()) {
      setActionFeedback({ type: 'error', text: 'Por favor pega el texto del correo del BCR primero.' });
      return;
    }

    const availableWs = workshops.map((w) => ({ id: w.id, title: w.title }));
    const result = parseBcrSinpeEmail(emailText, availableWs);
    setParsedData(result);
    setSelectedCategory(result.category);
    if (result.detectedWorkshopId) {
      setSelectedWorkshopId(result.detectedWorkshopId);
    } else if (workshops.length > 0) {
      setSelectedWorkshopId(workshops[0].id);
    }

    if (!result.isValidBcrEmail) {
      setActionFeedback({
        type: 'error',
        text: 'El texto no cumple con todos los campos obligatorios de un comprobante SINPE MÓVIL del BCR.',
      });
      return;
    }

    if (result.referenceNumber) {
      const refCheck = validateSinpeReference(result.referenceNumber);
      if (refCheck.isUsed) {
        setActionFeedback({
          type: 'error',
          text: '⚠️ Este pago ya fue utilizado, digite correctamente el número de referencia de la transferencia.',
        });
      }
    }
  };

  const loadSample = (index: number) => {
    setActionFeedback(null);
    const sample = SAMPLE_BCR_SINPE_EMAILS[index];
    if (sample) {
      setEmailText(sample.text);
      const availableWs = workshops.map((w) => ({ id: w.id, title: w.title }));
      const result = parseBcrSinpeEmail(sample.text, availableWs);
      setParsedData(result);
      setSelectedCategory(result.category);
      if (result.detectedWorkshopId) {
        setSelectedWorkshopId(result.detectedWorkshopId);
      } else if (workshops.length > 0) {
        setSelectedWorkshopId(workshops[0].id);
      }

      if (result.isValidBcrEmail && result.referenceNumber) {
        const refCheck = validateSinpeReference(result.referenceNumber);
        if (refCheck.isUsed) {
          setActionFeedback({
            type: 'error',
            text: '⚠️ Este pago ya fue utilizado, digite correctamente el número de referencia de la transferencia.',
          });
        }
      }
    }
  };

  const handleCreditTransaction = () => {
    setActionFeedback(null);
    if (!parsedData || !parsedData.isValidBcrEmail) {
      setActionFeedback({ type: 'error', text: 'No hay datos válidos para procesar esta transacción.' });
      return;
    }

    // Regla estricta: los comprobantes solo se pueden validar una única vez
    const refValidation = validateSinpeReference(parsedData.referenceNumber);
    if (refValidation.isUsed) {
      setActionFeedback({
        type: 'error',
        text: 'Este pago ya fue utilizado, digite correctamente el número de referencia de la transferencia.',
      });
      return;
    }

    const targetWs = selectedCategory === 'workshop' ? workshops.find((w) => w.id === selectedWorkshopId) : undefined;

    const res = registerSinpeTransaction({
      referenceNumber: parsedData.referenceNumber,
      originPhone: parsedData.originPhone,
      originName: parsedData.originName,
      originBank: parsedData.originBank,
      amount: parsedData.amount,
      description: parsedData.description,
      transactionDate: parsedData.transactionDate,
      category: selectedCategory,
      workshopId: targetWs?.id,
      workshopTitle: targetWs?.title,
      status: 'verified',
      rawEmail: emailText,
    });

    if (res.success) {
      setActionFeedback({
        type: 'success',
        text: `¡Pago de ${formatCRC(parsedData.amount)} acreditado exitosamente a la Caja (${selectedCategory === 'store' ? 'Tienda' : 'Talleres'}) con Referencia #${parsedData.referenceNumber}!`,
      });
      setEmailText('');
      setParsedData(null);
    } else {
      setActionFeedback({
        type: 'error',
        text: res.message || 'Error al guardar la transacción.',
      });
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempEmail.trim() || !tempEmail.includes('@')) {
      setActionFeedback({ type: 'error', text: 'Por favor ingresa una dirección de correo electrónico válida.' });
      return;
    }

    updateSinpeSettings({
      forwardingEmail: tempEmail.trim(),
      isLinked: true,
    });

    setSavedSettingsSuccess(true);
    setActionFeedback({
      type: 'success',
      text: `¡Correo "${tempEmail}" vinculado exitosamente! Las notificaciones redirigidas de mensajero@bancobcr.com serán procesadas automáticamente.`,
    });
    setTimeout(() => setSavedSettingsSuccess(false), 3000);
  };

  const copyWebhookUrl = () => {
    const url = `${window.location.origin}/api/sinpe-webhook`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2000);
    });
  };

  // Cálculos de totales
  const totalSinpeVerified = sinpeTransactions.reduce((acc, tx) => acc + tx.amount, 0);
  const totalStoreSinpe = sinpeTransactions.filter((tx) => tx.category === 'store').reduce((acc, tx) => acc + tx.amount, 0);
  const totalWorkshopSinpe = sinpeTransactions.filter((tx) => tx.category === 'workshop').reduce((acc, tx) => acc + tx.amount, 0);

  // Validación del comprobante extraído en tiempo real
  const parsedRefValidation = parsedData?.referenceNumber
    ? validateSinpeReference(parsedData.referenceNumber)
    : null;
  const isParsedRefAlreadyUsed = parsedRefValidation?.isUsed ?? false;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Encabezado Principal del Módulo Independiente */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white shadow-neu border border-white/80 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-800 to-indigo-900 flex items-center justify-center text-white shadow-md shrink-0">
              <Landmark className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bubble font-bold text-slate-900 leading-tight">
                  Módulo de Pagos &amp; Redirección SINPE BCR
                </h2>
                <span className="text-[11px] uppercase font-bold bg-amber-400 text-purple-950 px-2.5 py-0.5 rounded-full shadow-xs">
                  Banco BCR Oficial
                </span>
                {sinpeSettings.isLinked && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Redirección Vinculada
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-sans mt-0.5">
                Procesamiento de notificaciones de <span className="font-mono text-purple-800 font-semibold">mensajero@bancobcr.com</span> con incremento automático de caja en Tienda y Talleres.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bubble font-bold transition-all active:scale-95 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-purple-700" />
              <span>Configurar Correo</span>
            </button>
          </div>
        </div>

        {/* Cintas Resumen de Ingresos por SINPE BCR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center shrink-0 shadow-sm">
              <DollarSign className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <p className="text-[11px] font-bubble font-bold text-purple-900 uppercase">Total SINPE BCR Verificado</p>
              <p className="font-bubble font-bold text-xl text-purple-950 mt-0.5">{formatCRC(totalSinpeVerified)}</p>
              <span className="text-[10px] text-purple-700/80 font-medium">{sinpeTransactions.length} comprobantes procesados</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bubble font-bold text-blue-900 uppercase">Acreditado a Tienda &amp; Catálogo</p>
              <p className="font-bubble font-bold text-xl text-blue-950 mt-0.5">{formatCRC(totalStoreSinpe)}</p>
              <span className="text-[10px] text-blue-700/80 font-medium">{sinpeTransactions.filter(t => t.category === 'store').length} pagos a productos</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-pink-50/80 border border-pink-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bubble font-bold text-pink-900 uppercase">Acreditado a Talleres Creativos</p>
              <p className="font-bubble font-bold text-xl text-pink-950 mt-0.5">{formatCRC(totalWorkshopSinpe)}</p>
              <span className="text-[10px] text-pink-700/80 font-medium">{sinpeTransactions.filter(t => t.category === 'workshop').length} inscripciones de alumnos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pestañas de Navegación del Módulo */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300/80 shrink-0 flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab('extract')}
          style={activeTab === 'extract' ? { backgroundColor: '#581C87', color: '#FFFFFF' } : { backgroundColor: '#FFFFFF', color: '#1E293B' }}
          className={`px-4 py-2 rounded-xl text-xs font-bubble font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'extract'
              ? 'bg-purple-900 text-white shadow-md ring-2 ring-purple-400/80 scale-[1.01]'
              : 'bg-white text-slate-800 hover:text-purple-700 hover:bg-purple-50 shadow-xs border border-slate-300/80'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'extract' ? 'text-amber-300' : 'text-purple-600'}`} />
          <span>Extraer &amp; Acreditar Correo BCR</span>
        </button>

        {isFeatureEnabled('sinpe', 'email_redirect') && (
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            style={activeTab === 'settings' ? { backgroundColor: '#581C87', color: '#FFFFFF' } : { backgroundColor: '#FFFFFF', color: '#1E293B' }}
            className={`px-4 py-2 rounded-xl text-xs font-bubble font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-purple-900 text-white shadow-md ring-2 ring-purple-400/80 scale-[1.01]'
                : 'bg-white text-slate-800 hover:text-purple-700 hover:bg-purple-50 shadow-xs border border-slate-300/80'
            }`}
          >
            <Mail className={`w-3.5 h-3.5 ${activeTab === 'settings' ? 'text-blue-300' : 'text-blue-600'}`} />
            <span>Vinculación de Redirección Automática</span>
            {sinpeSettings.isLinked && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block ml-0.5" />
            )}
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          style={activeTab === 'history' ? { backgroundColor: '#581C87', color: '#FFFFFF' } : { backgroundColor: '#FFFFFF', color: '#1E293B' }}
          className={`px-4 py-2 rounded-xl text-xs font-bubble font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'history'
              ? 'bg-purple-900 text-white shadow-md ring-2 ring-purple-400/80 scale-[1.01]'
              : 'bg-white text-slate-800 hover:text-purple-700 hover:bg-purple-50 shadow-xs border border-slate-300/80'
          }`}
        >
          <ShieldCheck className={`w-3.5 h-3.5 ${activeTab === 'history' ? 'text-emerald-300' : 'text-emerald-600'}`} />
          <span>Historial de Pagos Verificados ({sinpeTransactions.length})</span>
        </button>
      </div>

      {/* Alertas y Feedback Global */}
      {actionFeedback && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-3 animate-fadeIn ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-900 shadow-sm'
              : 'bg-red-50 border border-red-300 text-red-900 shadow-sm'
          }`}
        >
          {actionFeedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <p className="flex-1">{actionFeedback.text}</p>
        </div>
      )}

      {/* CONTENIDO DE LA PESTAÑA: EXTRAER & ACREDITAR CORREO */}
      {activeTab === 'extract' && (
        <div className="space-y-5">
          {/* Validador Rápido de Referencia SINPE - Garantía de Uso Único */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-50/90 via-white to-indigo-50/90 border border-purple-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldAlert className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-bubble font-bold text-xs sm:text-sm text-purple-950">
                    Validador Rápido de Referencia SINPE (Garantía de Uso Único)
                  </h4>
                  <p className="text-[11px] text-slate-500 font-sans">
                    Comprueba al instante si un comprobante ya fue utilizado para evitar duplicados y fraudes.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bubble font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-1 rounded-full self-start sm:self-auto border border-purple-200">
                1 Sola Validación Permitida
              </span>
            </div>

            <form onSubmit={handleVerifyManualRef} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <Hash className="w-4 h-4 text-purple-600 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={manualRefInput}
                  onChange={(e) => {
                    setManualRefInput(e.target.value);
                    if (manualValidationResult) setManualValidationResult(null);
                  }}
                  placeholder="Digita el número de comprobante o referencia (ej: 20261104-987654)..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-purple-200 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-800 hover:bg-purple-900 text-white text-xs font-bubble font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <Search className="w-3.5 h-3.5 text-amber-300" />
                <span>Comprobar Referencia</span>
              </button>
            </form>

            {manualValidationResult && manualValidationResult.tested && (
              <div
                className={`p-3.5 rounded-2xl text-xs transition-all animate-fadeIn ${
                  manualValidationResult.isUsed
                    ? 'bg-red-50 border-2 border-red-500 text-red-950 shadow-sm'
                    : 'bg-emerald-50 border border-emerald-400 text-emerald-950 shadow-sm'
                }`}
              >
                {manualValidationResult.isUsed ? (
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bubble font-bold text-xs sm:text-sm text-red-700">
                        ⚠️ Este pago ya fue utilizado, digite correctamente el número de referencia de la transferencia.
                      </p>
                      {manualValidationResult.transaction && (
                        <div className="text-[11px] text-red-900 bg-red-100/70 p-2.5 rounded-xl border border-red-200 mt-1 font-sans">
                          <span className="font-bold">Detalle del registro previo:</span> Comprobante acreditado el{' '}
                          <span className="font-semibold">{manualValidationResult.transaction.transactionDate}</span> a nombre de{' '}
                          <span className="font-bold">{manualValidationResult.transaction.originName}</span> por{' '}
                          <span className="font-bold">{formatCRC(manualValidationResult.transaction.amount)}</span> para{' '}
                          <span className="font-semibold">{manualValidationResult.transaction.category === 'store' ? 'Ventas Tienda' : 'Taller Creativo'}</span>.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <p className="font-bubble font-bold text-xs text-emerald-800">
                      ✓ Comprobante libre y disponible. Esta referencia nunca ha sido utilizada en el sistema.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white shadow-neu border border-white/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bubble font-bold text-base text-slate-900">
                  Pegar Notificación del BCR para Extracción Inmediata
                </h3>
                <p className="text-xs text-slate-500">
                  Copia y pega el texto del correo recibido de <span className="font-mono text-purple-700">mensajero@bancobcr.com</span> con asunto <span className="font-mono text-purple-700">SINPE MÓVIL: Notificación de transacción realizada</span>.
                </p>
              </div>

              {/* Botones de Ejemplos */}
              <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Cargar Ejemplo:</span>
                <button
                  type="button"
                  onClick={() => loadSample(0)}
                  className="px-2.5 py-1 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bubble font-bold transition-all active:scale-95"
                >
                  🛍️ Tienda (₡18,500)
                </button>
                <button
                  type="button"
                  onClick={() => loadSample(1)}
                  className="px-2.5 py-1 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-900 text-xs font-bubble font-bold transition-all active:scale-95"
                >
                  🎨 Taller (₡25,000)
                </button>
              </div>
            </div>

            {/* Textarea del Correo */}
            <div className="space-y-2">
              <textarea
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                placeholder="Pega aquí el contenido completo del correo de notificación SINPE MÓVIL del Banco BCR..."
                rows={5}
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-300 font-mono text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
              />

              <div className="flex items-center justify-between gap-3 flex-wrap">
                <p className="text-[11px] text-slate-400">
                  * El sistema abstrae de forma segura: Referencia, Teléfono, Nombre, Entidad bancaria, Monto, Motivo y Fecha/Hora.
                </p>
                <button
                  type="button"
                  onClick={handleProcessEmail}
                  className="px-5 py-2.5 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bubble font-bold text-xs shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Procesar y Extraer Datos del Correo</span>
                </button>
              </div>
            </div>
          </div>

          {/* VISTA PREVIA DE LOS DATOS ABSTRAÍDOS */}
          {parsedData && (
            <div className="p-5 sm:p-6 rounded-3xl bg-white shadow-neu border-2 border-purple-300 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-purple-100 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${parsedData.isValidBcrEmail && !isParsedRefAlreadyUsed ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <h4 className="font-bubble font-bold text-sm sm:text-base text-purple-950">
                    Datos Abstraídos del Correo BCR
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-mono">
                    Ref: #{parsedData.referenceNumber || 'NO DETECTADA'}
                  </span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    isParsedRefAlreadyUsed
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : parsedData.isValidBcrEmail
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {isParsedRefAlreadyUsed
                      ? '⚠️ Ya Utilizado'
                      : parsedData.isValidBcrEmail
                      ? '✓ Verificación Exitosa'
                      : '⚠️ Inválido o Incompleto'}
                  </span>
                </div>
              </div>

              {/* Alerta de Referencia Duplicada / Pago Ya Utilizado */}
              {isParsedRefAlreadyUsed && (
                <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-500 text-red-950 flex items-start gap-3 shadow-md animate-fadeIn">
                  <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="font-bubble font-bold text-sm text-red-700">
                      ⚠️ Este pago ya fue utilizado, digite correctamente el número de referencia de la transferencia.
                    </h5>
                    <p className="text-xs text-red-900 font-sans">
                      El comprobante SINPE con referencia <span className="font-mono font-bold">#{parsedData.referenceNumber}</span> ya fue acreditado el{' '}
                      <span className="font-semibold">{parsedRefValidation?.transaction?.transactionDate}</span> por{' '}
                      <span className="font-bold">{formatCRC(parsedRefValidation?.transaction?.amount || 0)}</span> para{' '}
                      <span className="font-semibold">{parsedRefValidation?.transaction?.category === 'store' ? 'Ventas Tienda' : 'Taller Creativo'}</span>.
                      Los comprobantes solo pueden ser validados una única vez en el sistema.
                    </p>
                  </div>
                </div>
              )}

              {/* Grid con las casillas requeridas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Hash className="w-3 h-3 text-purple-600" />
                    <span>N° Referencia Único</span>
                  </div>
                  <div className="font-mono font-bold text-sm text-purple-950 mt-1 truncate" title={parsedData.referenceNumber}>
                    {parsedData.referenceNumber || '---'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>Teléfono Origen</span>
                  </div>
                  <div className="font-mono font-bold text-sm text-slate-900 mt-1 truncate">
                    {parsedData.originPhone || '---'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                    <span>Cliente Origen</span>
                  </div>
                  <div className="font-bubble font-bold text-sm text-slate-900 mt-1 truncate" title={parsedData.originName}>
                    {parsedData.originName || '---'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Landmark className="w-3 h-3 text-indigo-600" />
                    <span>Entidad Origen</span>
                  </div>
                  <div className="font-bubble font-bold text-xs text-slate-800 mt-1 truncate" title={parsedData.originBank}>
                    {parsedData.originBank || 'Banco BCR / SINPE'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 sm:col-span-2">
                  <div className="text-[10px] uppercase font-bold text-purple-700 flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-purple-700" />
                    <span>Monto Recibido</span>
                  </div>
                  <div className="font-bubble font-bold text-xl text-purple-950 mt-0.5">
                    {formatCRC(parsedData.amount)}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-600" />
                    <span>Fecha &amp; Hora de Transacción</span>
                  </div>
                  <div className="font-mono font-semibold text-xs text-slate-700 mt-1">
                    {parsedData.transactionDate || new Date().toLocaleString('es-CR')}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-4">
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    Motivo / Descripción de la Notificación
                  </div>
                  <div className="font-sans text-xs text-slate-800 mt-1 italic">
                    "{parsedData.description || 'Sin motivo especificado'}"
                  </div>
                </div>
              </div>

              {/* SELECCIÓN DE DESTINO PARA LA CAJA: TIENDA VS TALLER */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="font-bubble font-bold text-xs text-purple-950 flex items-center gap-1.5">
                    <span>Acreditar este dinero en Caja a:</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('store')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all flex items-center gap-1.5 ${
                        selectedCategory === 'store'
                          ? 'bg-purple-800 text-white shadow-xs'
                          : 'bg-white text-purple-900 border border-purple-200'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>🛍️ Ventas Tienda</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedCategory('workshop')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all flex items-center gap-1.5 ${
                        selectedCategory === 'workshop'
                          ? 'bg-pink-700 text-white shadow-xs'
                          : 'bg-white text-pink-900 border border-pink-200'
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>🎨 Taller Creativo</span>
                    </button>
                  </div>
                </div>

                {/* Si se selecciona taller, elegir cuál taller específico */}
                {selectedCategory === 'workshop' && (
                  <div className="pt-2 border-t border-purple-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-fadeIn">
                    <span className="text-xs font-bubble font-bold text-pink-900">
                      Seleccionar Taller Específico para el Cupo:
                    </span>
                    <select
                      value={selectedWorkshopId}
                      onChange={(e) => setSelectedWorkshopId(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-pink-300 text-xs font-bubble font-bold text-pink-950 focus:outline-none focus:border-pink-500"
                    >
                      {workshops.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.title} ({w.totalSpots} cupos tot.)
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Botón de Acreditación Final a Caja */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCreditTransaction}
                  disabled={!parsedData.isValidBcrEmail || isParsedRefAlreadyUsed}
                  className={`px-6 py-3 rounded-2xl font-bubble font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-all active:scale-95 ${
                    parsedData.isValidBcrEmail && !isParsedRefAlreadyUsed
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 text-emerald-200" />
                  <span>
                    {isParsedRefAlreadyUsed
                      ? 'Comprobante Ya Utilizado (Acreditación Bloqueada)'
                      : `Acreditar a Caja Ahora (+${formatCRC(parsedData.amount)})`}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CONTENIDO DE LA PESTAÑA: CONFIGURACIÓN DE VINCULACIÓN */}
      {activeTab === 'settings' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white shadow-neu border border-white/80 space-y-6 animate-fadeIn">
          <div>
            <h3 className="font-bubble font-bold text-lg text-slate-900">
              Vinculación de Redirección Automática de Correos BCR
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Al configurar tu correo electrónico aquí, el sistema queda vinculado para recibir y procesar las notificaciones bancarias de <span className="font-mono text-purple-700">mensajero@bancobcr.com</span>.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl">
            <div className="space-y-1.5">
              <label className="text-xs font-bubble font-bold text-slate-700 flex items-center justify-between">
                <span>Tu Correo Electrónico de Notificaciones BCR:</span>
                <span className="text-[11px] font-normal text-emerald-600 font-mono">
                  {sinpeSettings.isLinked ? '✓ Vinculado Activo' : 'Pendiente'}
                </span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  placeholder="ejemplo@gmail.com"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bubble font-bold text-xs shadow-sm transition-all active:scale-95 shrink-0"
                >
                  {savedSettingsSuccess ? '¡Guardado!' : 'Vincular Correo'}
                </button>
              </div>
            </div>
          </form>

          {/* Webhook Endpoint Info */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-purple-700 shrink-0" />
                <span className="font-bubble font-bold text-xs text-purple-950">
                  URL de Redirección / Webhook Cloudflare Worker:
                </span>
              </div>
              <button
                type="button"
                onClick={copyWebhookUrl}
                className="px-2.5 py-1 rounded-lg bg-white border border-purple-300 text-purple-900 text-[11px] font-bubble font-bold hover:bg-purple-100 transition-all flex items-center gap-1"
              >
                {copiedWebhook ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedWebhook ? '¡Copiado!' : 'Copiar URL'}</span>
              </button>
            </div>
            <div className="p-2.5 rounded-xl bg-white font-mono text-xs text-purple-900 border border-purple-200 break-all select-all">
              {window.location.origin}/api/sinpe-webhook
            </div>
          </div>

          {/* Instrucciones paso a paso para Gmail / Outlook */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs text-slate-700">
            <h4 className="font-bubble font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Cómo Activar la Redirección Automática en Gmail o Outlook:</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 leading-relaxed font-sans">
              <li>Ingresa a tu cuenta de correo donde te llegan las notificaciones de SINPE Móvil del BCR.</li>
              <li>Crea un filtro de búsqueda con: <strong>De:</strong> <code className="text-purple-700">mensajero@bancobcr.com</code> y <strong>Asunto:</strong> <code className="text-purple-700">SINPE MÓVIL: Notificación de transacción realizada</code>.</li>
              <li>Configura la acción: <em>"Reenviar a"</em> con la dirección de tu webhook o copia el texto de las notificaciones directamente en este panel.</li>
              <li>¡Listo! Apenas entra un pago SINPE del BCR, el saldo de la caja aumentará automáticamente y quedará asentado en el sistema con su N° de referencia único.</li>
            </ol>
          </div>
        </div>
      )}

      {/* CONTENIDO DE LA PESTAÑA: HISTORIAL DE COMPROBANTES VERIFICADOS */}
      {activeTab === 'history' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white shadow-neu border border-white/80 space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bubble font-bold text-base text-slate-900">
                Historial de Comprobantes SINPE BCR Acreditados ({sinpeTransactions.length})
              </h3>
              <p className="text-xs text-slate-500">
                Registro inmutable de pagos que ya incrementaron la caja registradora de by.fio.
              </p>
            </div>
          </div>

          {sinpeTransactions.length === 0 ? (
            <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Landmark className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bubble font-bold text-slate-600">Aún no hay pagos SINPE BCR verificados</p>
              <p className="text-xs text-slate-400 mt-1">Usa la pestaña "Extraer &amp; Acreditar Correo" para procesar el primer comprobante.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bubble font-bold text-[11px] uppercase">
                  <tr>
                    <th className="p-3">Ref. N°</th>
                    <th className="p-3">Cliente Origen</th>
                    <th className="p-3">Teléfono</th>
                    <th className="p-3">Destino en Caja</th>
                    <th className="p-3 text-right">Monto</th>
                    <th className="p-3">Fecha Transacción</th>
                    <th className="p-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {sinpeTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-purple-950">
                        #{tx.referenceNumber}
                      </td>
                      <td className="p-3 font-bubble font-bold text-slate-900">
                        {tx.originName}
                      </td>
                      <td className="p-3 font-mono text-slate-600">
                        {tx.originPhone}
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bubble font-bold uppercase ${
                          tx.category === 'workshop'
                            ? 'bg-pink-100 text-pink-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {tx.category === 'workshop' ? '🎨 Taller' : '🛍️ Tienda'}
                        </span>
                        {tx.workshopTitle && (
                          <div className="text-[10px] text-pink-700 font-medium truncate max-w-[160px] mt-0.5" title={tx.workshopTitle}>
                            {tx.workshopTitle}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-right font-bubble font-bold text-sm text-purple-950">
                        {formatCRC(tx.amount)}
                      </td>
                      <td className="p-3 text-[11px] text-slate-500 font-mono">
                        {tx.transactionDate}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`¿Estás segura de eliminar el comprobante #${tx.referenceNumber}? Esta acción reducirá la caja.`)) {
                              deleteSinpeTransaction(tx.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Eliminar comprobante"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
