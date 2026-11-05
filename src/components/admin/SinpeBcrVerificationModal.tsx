import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useConfirm } from '../../context/ConfirmContext';
import { formatCRC } from '../../utils/formatters';
import { parseBcrSinpeEmail, SAMPLE_BCR_SINPE_EMAILS } from '../../utils/bcrSinpeParser';
import {
  X, CheckCircle2, AlertTriangle, Mail, ShieldCheck,
  Sparkles, Copy, Check, Trash2, ArrowRight, DollarSign,
  GraduationCap, ShoppingBag, Landmark, Phone, Calendar, Hash
} from 'lucide-react';

interface SinpeBcrVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SinpeBcrVerificationModal: React.FC<SinpeBcrVerificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    sinpeTransactions,
    sinpeSettings,
    registerSinpeTransaction,
    deleteSinpeTransaction,
    updateSinpeSettings,
    workshops,
  } = useApp();
  const confirm = useConfirm();

  const [activeTab, setActiveTab] = useState<'extract' | 'settings' | 'history'>('extract');
  const [emailText, setEmailText] = useState('');
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  // Estado del correo configurado
  const [tempEmail, setTempEmail] = useState(sinpeSettings.forwardingEmail || 'fiorellajaravargas@gmail.com');

  // Estado de extracción
  const [parsedData, setParsedData] = useState<ReturnType<typeof parseBcrSinpeEmail> | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'store' | 'workshop'>('store');
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>('');
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

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
    }
  };

  const loadSample = (index: number) => {
    const sample = SAMPLE_BCR_SINPE_EMAILS[index];
    if (sample) {
      setEmailText(sample.text);
      setActionFeedback(null);
      const availableWs = workshops.map((w) => ({ id: w.id, title: w.title }));
      const result = parseBcrSinpeEmail(sample.text, availableWs);
      setParsedData(result);
      setSelectedCategory(sample.category);
      if (sample.category === 'workshop' && workshops.length > 0) {
        setSelectedWorkshopId(workshops[0].id);
      }
    }
  };

  const isDuplicate = parsedData
    ? sinpeTransactions.some(
        (tx) => tx.referenceNumber.toLowerCase() === parsedData.referenceNumber.toLowerCase()
      )
    : false;

  const handleConfirmAndCredit = () => {
    if (!parsedData || !parsedData.isValidBcrEmail) return;

    if (isDuplicate) {
      setActionFeedback({
        type: 'error',
        text: `Transacción rechazada: El número de referencia "${parsedData.referenceNumber}" ya está registrado en caja.`,
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
        text: `¡Acreditado con éxito! Se sumaron ${formatCRC(parsedData.amount)} a la caja en ${
          selectedCategory === 'workshop' ? 'Talleres Creativos' : 'Tienda y Catálogo'
        }.`,
      });
      setEmailText('');
      setParsedData(null);
    } else {
      setActionFeedback({
        type: 'error',
        text: res.message,
      });
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSinpeSettings({
      forwardingEmail: tempEmail.trim(),
      isLinked: true,
    });
    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 2500);
  };

  const copyWebhook = () => {
    const url = sinpeSettings.webhookUrl || `${window.location.origin}/api/sinpe-webhook`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2000);
    });
  };

  // Cálculos de totales
  const totalSinpeVerified = sinpeTransactions.reduce((acc, tx) => acc + tx.amount, 0);
  const totalStoreSinpe = sinpeTransactions.filter((tx) => tx.category === 'store').reduce((acc, tx) => acc + tx.amount, 0);
  const totalWorkshopSinpe = sinpeTransactions.filter((tx) => tx.category === 'workshop').reduce((acc, tx) => acc + tx.amount, 0);

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-2 sm:p-5 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between bg-gradient-to-r from-purple-900 via-purple-800 to-fio-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-white border border-white/20 shadow-inner">
              <Landmark className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bubble font-bold text-base sm:text-lg leading-tight">
                  Verificación de Pagos SINPE Móvil BCR
                </h3>
                <span className="text-[10px] uppercase font-bold bg-amber-400 text-purple-950 px-2 py-0.5 rounded-full">
                  Banco BCR
                </span>
              </div>
              <p className="text-xs text-purple-200/90 font-sans">
                Redirección de <span className="font-mono text-white">mensajero@bancobcr.com</span> con extracción automática
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pestañas de Navegación del Sistema SINPE */}
        <div className="flex items-center gap-2 px-4 sm:px-6 pt-3 border-b border-slate-200 bg-slate-50 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('extract')}
            className={`px-3.5 py-2 rounded-t-xl text-xs font-bubble font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'extract'
                ? 'border-purple-800 text-purple-900 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Extraer &amp; Acreditar Correo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-t-xl text-xs font-bubble font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-purple-800 text-purple-900 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>Vinculación de Redirección</span>
            {sinpeSettings.isLinked && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-2 rounded-t-xl text-xs font-bubble font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-purple-800 text-purple-900 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Historial Verificado ({sinpeTransactions.length})</span>
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Alertas y Feedback Global */}
          {actionFeedback && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-medium flex items-center gap-2.5 animate-fadeIn ${
                actionFeedback.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                  : 'bg-red-50 border border-red-300 text-red-900'
              }`}
            >
              {actionFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{actionFeedback.text}</span>
            </div>
          )}

          {/* TAB 1: EXTRAER Y PROCESAR CORREO */}
          {activeTab === 'extract' && (
            <div className="space-y-4">
              <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-purple-700" />
                    Pega el correo de notificación del Banco BCR:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-500">Probar ejemplo:</span>
                    <button
                      type="button"
                      onClick={() => loadSample(0)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-purple-100 text-purple-800 border border-purple-300 text-[11px] font-bold transition-all active:scale-95 shadow-2xs"
                      title="Cargar comprobante de ejemplo de Tienda"
                    >
                      🛍️ Ejemplo Tienda (₡18,500)
                    </button>
                    <button
                      type="button"
                      onClick={() => loadSample(1)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-pink-100 text-pink-800 border border-pink-300 text-[11px] font-bold transition-all active:scale-95 shadow-2xs"
                      title="Cargar comprobante de ejemplo de Taller"
                    >
                      🎨 Ejemplo Taller (₡22,000)
                    </button>
                    {emailText && (
                      <button
                        type="button"
                        onClick={() => {
                          setEmailText('');
                          setParsedData(null);
                          setActionFeedback(null);
                        }}
                        className="px-2 py-1 rounded-lg text-slate-500 hover:text-slate-800 text-[11px] font-semibold"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                </div>

                <textarea
                  rows={6}
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  placeholder={`De: mensajero@bancobcr.com\nAsunto: SINPE MÓVIL: Notificación de transacción realizada\n\nNúmero de referencia: BCR-...\nTeléfono origen: 8888-8888\nNombre cliente origen: ...\nEntidad origen: BANCO DE COSTA RICA\nMonto: ₡15,000.00\nMotivo: ...\nFecha y hora: ...`}
                  className="w-full text-xs font-mono p-3 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />

                <div className="mt-2.5 flex justify-end">
                  <button
                    type="button"
                    onClick={handleProcessEmail}
                    className="px-4 py-2 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bubble font-bold text-xs shadow-md flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>⚡ Extraer Datos del Correo</span>
                  </button>
                </div>
              </div>

              {/* Resultado de la Extracción */}
              {parsedData && (
                <div
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    parsedData.isValidBcrEmail
                      ? 'bg-white border-purple-300 shadow-sm'
                      : 'bg-red-50/40 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bubble font-bold text-sm text-slate-900">
                        Resultado de Extracción Bancaria BCR
                      </span>
                      {parsedData.isValidBcrEmail ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Datos Verificados
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                          <AlertTriangle className="w-3 h-3" /> Incompleto
                        </span>
                      )}
                    </div>

                    {/* Validación de Duplicado */}
                    {isDuplicate && (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-600 text-white animate-pulse">
                        ⚠️ Referencia Duplicada
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs mb-4">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">
                        Número de Referencia
                      </span>
                      <p className="font-mono font-bold text-sm text-purple-900 mt-0.5">
                        {parsedData.referenceNumber || 'No encontrado'}
                      </p>
                      {isDuplicate ? (
                        <p className="text-[10px] text-red-600 font-semibold mt-1">Ya acreditada previamente</p>
                      ) : (
                        <p className="text-[10px] text-emerald-600 font-semibold mt-1">✓ Referencia libre y única</p>
                      )}
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">
                        Monto Transferido
                      </span>
                      <p className="font-bubble font-bold text-lg text-slate-900 mt-0.5">
                        {formatCRC(parsedData.amount)}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">Banco Origen: {parsedData.originBank}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">
                        Cliente Origen
                      </span>
                      <p className="font-semibold text-slate-900 mt-0.5">{parsedData.originName}</p>
                      <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {parsedData.originPhone}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">
                        Motivo / Detalle de la Transacción
                      </span>
                      <p className="text-slate-800 italic mt-0.5">{parsedData.description || 'Sin motivo'}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Fecha/Hora: {parsedData.transactionDate}</p>
                    </div>

                    {/* Selector de Destino en Caja */}
                    <div className="p-2.5 rounded-xl bg-purple-50/80 border border-purple-200">
                      <span className="text-[10px] text-purple-900 font-bold uppercase block mb-1">
                        Destino de Ingreso en Caja:
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedCategory('store')}
                          className={`flex-1 py-1 px-2 rounded-lg text-xs font-bubble font-bold transition-all ${
                            selectedCategory === 'store'
                              ? 'bg-purple-800 text-white shadow-2xs'
                              : 'bg-white text-slate-700 hover:bg-purple-100 border border-slate-200'
                          }`}
                        >
                          🛍️ Tienda
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCategory('workshop')}
                          className={`flex-1 py-1 px-2 rounded-lg text-xs font-bubble font-bold transition-all ${
                            selectedCategory === 'workshop'
                              ? 'bg-pink-600 text-white shadow-2xs'
                              : 'bg-white text-slate-700 hover:bg-pink-100 border border-slate-200'
                          }`}
                        >
                          🎨 Taller
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Si es Taller, selector del Taller correspondiente */}
                  {selectedCategory === 'workshop' && (
                    <div className="p-3 bg-pink-50/60 rounded-xl border border-pink-200 mb-4">
                      <span className="text-xs font-bold text-pink-900 block mb-1">
                        Vincular al Taller Creativo (descontará 1 cupo y sumará a talleres en caja):
                      </span>
                      <select
                        value={selectedWorkshopId}
                        onChange={(e) => setSelectedWorkshopId(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-pink-300 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      >
                        {workshops.map((ws) => (
                          <option key={ws.id} value={ws.id}>
                            {ws.title} — {ws.spotsAvailable}/{ws.totalSpots} cupos disponibles ({formatCRC(ws.price)})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Botón de Acreditación Final */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <p className="text-[11px] text-slate-500">
                      Al confirmar, la transacción se marcará como <strong>VERIFICADA</strong> y se reflejará inmediatamente en el Registro de Caja.
                    </p>

                    <button
                      type="button"
                      onClick={handleConfirmAndCredit}
                      disabled={isDuplicate || !parsedData.isValidBcrEmail}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bubble font-bold text-xs shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Acreditar Pago en Caja &amp; Confirmar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VINCULACIÓN Y REDIRECCIÓN */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <form onSubmit={handleSaveSettings} className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bubble font-bold text-sm text-slate-900">
                      Configuración de Correo para Redirección
                    </h4>
                    <p className="text-xs text-slate-500">
                      El administrador vincula su correo para la recepción y extracción de comprobantes BCR.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Vinculación Activa
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Correo del Administrador para Recibir Notificaciones BCR:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      placeholder="ejemplo@gmail.com"
                      className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bubble font-bold text-xs shadow-sm transition-all active:scale-95 shrink-0"
                    >
                      {savedSettingsSuccess ? '¡Vinculado Guardado!' : 'Guardar y Vincular'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Remitente oficial verificado del Banco: <strong className="text-purple-900 font-mono">mensajero@bancobcr.com</strong>
                  </p>
                </div>

                {/* URL Webhook para Reenvío Automático */}
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-700 block mb-1">
                    URL de Redirección Automática / Webhook API:
                  </span>
                  <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-700">
                    <span className="flex-1 truncate">{sinpeSettings.webhookUrl || `${window.location.origin}/api/sinpe-webhook`}</span>
                    <button
                      type="button"
                      onClick={copyWebhook}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                    >
                      {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedWebhook ? 'Copiado' : 'Copiar URL'}</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Guía Rápida de Configuración */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50/50 p-4 rounded-2xl border border-purple-200 text-xs text-slate-700 space-y-2">
                <span className="font-bubble font-bold text-sm text-purple-900 block">
                  ¿Cómo funciona la redirección automática del Banco BCR?
                </span>
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  <li>En tu banca en línea del Banco BCR, registra tu correo para recibir las alertas de SINPE Móvil.</li>
                  <li>El BCR enviará cada comprobante desde <code className="bg-white px-1 py-0.5 rounded text-purple-800">mensajero@bancobcr.com</code> con el asunto <code className="bg-white px-1 py-0.5 rounded text-purple-800">SINPE MÓVIL: Notificación de transacción realizada</code>.</li>
                  <li>Al llegar a tu buzón, el sistema abstrae automáticamente el <strong>Número de Referencia</strong>, <strong>Teléfono</strong>, <strong>Nombre</strong>, <strong>Entidad</strong>, <strong>Monto</strong>, <strong>Motivo</strong> y <strong>Fecha</strong>.</li>
                  <li>El sistema valida que ninguna transacción tenga el mismo número de referencia y aumenta automáticamente el saldo en la Caja.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: HISTORIAL VERIFICADO */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {/* Resumen de Caja por SINPE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-gradient-to-tr from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200">
                  <span className="text-[10px] font-bold text-purple-800 uppercase block">Total SINPE BCR en Caja</span>
                  <p className="font-bubble font-bold text-xl text-purple-950 mt-1">{formatCRC(totalSinpeVerified)}</p>
                  <p className="text-[10px] text-purple-700 mt-0.5">{sinpeTransactions.length} pagos verificados</p>
                </div>

                <div className="p-3.5 bg-gradient-to-tr from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200">
                  <span className="text-[10px] font-bold text-blue-800 uppercase block">Ingresos Tienda &amp; Catálogo</span>
                  <p className="font-bubble font-bold text-xl text-blue-950 mt-1">{formatCRC(totalStoreSinpe)}</p>
                  <p className="text-[10px] text-blue-700 mt-0.5">Productos de papelería</p>
                </div>

                <div className="p-3.5 bg-gradient-to-tr from-pink-50 to-pink-100/50 rounded-2xl border border-pink-200">
                  <span className="text-[10px] font-bold text-pink-800 uppercase block">Ingresos Talleres Creativos</span>
                  <p className="font-bubble font-bold text-xl text-pink-950 mt-1">{formatCRC(totalWorkshopSinpe)}</p>
                  <p className="text-[10px] text-pink-700 mt-0.5">Inscripciones confirmadas</p>
                </div>
              </div>

              {/* Lista de Transacciones */}
              {sinpeTransactions.length === 0 ? (
                <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Landmark className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-bubble font-bold text-slate-600">No hay pagos SINPE BCR registrados aún</p>
                  <p className="text-xs text-slate-400">Pega un correo en la pestaña de extracción para acreditar el primero.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Fecha</th>
                        <th className="py-2.5 px-3">Referencia BCR</th>
                        <th className="py-2.5 px-3">Cliente / Teléfono</th>
                        <th className="py-2.5 px-3">Destino en Caja</th>
                        <th className="py-2.5 px-3 text-right">Monto</th>
                        <th className="py-2.5 px-2 text-center">Estado</th>
                        <th className="py-2.5 px-2 text-center w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sinpeTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-purple-50/20 transition-colors">
                          <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                            {tx.transactionDate || tx.createdAt?.slice(0, 10)}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-mono font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-[11px]">
                              {tx.referenceNumber}
                            </span>
                            <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[140px]">{tx.originBank}</p>
                          </td>
                          <td className="py-2.5 px-3">
                            <p className="font-semibold text-slate-900">{tx.originName}</p>
                            <p className="text-[10px] text-slate-500">{tx.originPhone}</p>
                          </td>
                          <td className="py-2.5 px-3">
                            {tx.category === 'workshop' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-pink-100 text-pink-800 px-2 py-0.5 rounded-md">
                                <GraduationCap className="w-3 h-3 text-pink-600" />
                                {tx.workshopTitle ? tx.workshopTitle.slice(0, 20) + '...' : 'Taller Creativo'}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md">
                                <ShoppingBag className="w-3 h-3 text-purple-600" />
                                Tienda &amp; Catálogo
                              </span>
                            )}
                            {tx.description && (
                              <p className="text-[10px] text-slate-500 italic truncate max-w-[150px] mt-0.5">
                                "{tx.description}"
                              </p>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bubble font-bold text-slate-900 text-sm whitespace-nowrap">
                            {formatCRC(tx.amount)}
                          </td>
                          <td className="py-2.5 px-2 text-center whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              VERIFICADO
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={async () => {
                                if (await confirm(`¿Eliminar la transacción ${tx.referenceNumber}?`, { title: 'Eliminar Transacción', confirmLabel: 'Eliminar' })) {
                                  deleteSinpeTransaction(tx.id);
                                }
                              }}
                              className="p-1 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                              title="Remover transacción de la caja"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Módulo de Redirección y Validación Banco BCR v1.0 Activo</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bubble text-xs font-bold transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
