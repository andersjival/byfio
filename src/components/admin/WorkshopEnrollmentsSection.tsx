import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCRC } from '../../utils/formatters';
import {
  GraduationCap, Users, ChevronDown, ChevronUp, Phone, Hash,
  Calendar, Plus, Link2, Trash2, CheckCircle2, ExternalLink, Pencil,
  Landmark, ShieldCheck, Sparkles, DollarSign
} from 'lucide-react';

interface WorkshopEnrollmentsSectionProps {
  onNavigateToSinpe?: () => void;
}

export const WorkshopEnrollmentsSection: React.FC<WorkshopEnrollmentsSectionProps> = ({ onNavigateToSinpe }) => {
  const {
    workshops,
    orders,
    setIsNewWorkshopModalOpen,
    deleteWorkshop,
    setEditingWorkshop,
    sinpeTransactions,
    setIsSinpeModalOpen,
  } = useApp();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCatalog, setCopiedCatalog] = useState(false);
  const [showPaidSummary, setShowPaidSummary] = useState(false);
  const [selectedAuditId, setSelectedAuditId] = useState<string>(workshops[0]?.id || '');

  // Mapeo de inscripciones provenientes de órdenes web
  const enrollmentsByWorkshop = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; email?: string; orderNumber: string; quantity: number; date: string; method?: string }[]>();
    workshops.forEach((ws) => map.set(ws.id, []));

    orders.forEach((order) => {
      order.items
        .filter((item) => item.type === 'workshop')
        .forEach((item) => {
          const ws = workshops.find((w) => item.sku === w.id || item.sku === `WS-${w.id.toUpperCase()}` || item.name === w.title);
          if (ws) {
            map.get(ws.id)?.push({
              name: order.customerName,
              phone: order.customerPhone,
              email: order.customerEmail,
              orderNumber: order.orderNumber,
              quantity: item.quantity,
              date: order.createdAt,
              method: order.paymentMethod,
            });
          }
        });
    });
    return map;
  }, [workshops, orders]);

  // Mapeo de pagos SINPE BCR acreditados para cada taller
  const sinpeByWorkshop = useMemo(() => {
    const map = new Map<string, typeof sinpeTransactions>();
    workshops.forEach((ws) => map.set(ws.id, []));

    sinpeTransactions
      .filter((tx) => tx.category === 'workshop')
      .forEach((tx) => {
        let matchedWs = workshops.find((w) => w.id === tx.workshopId);
        if (!matchedWs && tx.workshopTitle) {
          matchedWs = workshops.find((w) => w.title === tx.workshopTitle);
        }
        if (!matchedWs && tx.description) {
          matchedWs = workshops.find((w) => tx.description.toLowerCase().includes(w.title.toLowerCase()));
        }
        if (matchedWs) {
          map.get(matchedWs.id)?.push(tx);
        } else if (workshops.length > 0) {
          // Si no especifica taller puntual, asignar al primero
          map.get(workshops[0].id)?.push(tx);
        }
      });
    return map;
  }, [workshops, sinpeTransactions]);

  // Total de cupos vendidos y confirmados global
  const totalGlobalSold = useMemo(() => {
    let count = 0;
    workshops.forEach((ws) => {
      const orderEnrollments = enrollmentsByWorkshop.get(ws.id) || [];
      const sinpeTxs = sinpeByWorkshop.get(ws.id) || [];
      const ordersCount = orderEnrollments.reduce((acc, e) => acc + e.quantity, 0);
      count += ordersCount + sinpeTxs.length;
    });
    return count;
  }, [workshops, enrollmentsByWorkshop, sinpeByWorkshop]);

  const copyWorkshopLink = (wsId: string) => {
    const link = `${window.location.origin}/talleres/${wsId}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedId(wsId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const copyCatalogLink = () => {
    const link = `${window.location.origin}/talleres`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedCatalog(true);
      setTimeout(() => setCopiedCatalog(false), 2000);
    });
  };

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  // Taller seleccionado para la auditoría de cupos pagados
  const activeAuditWs = workshops.find((w) => w.id === selectedAuditId) || workshops[0];

  const auditEnrollments = activeAuditWs ? enrollmentsByWorkshop.get(activeAuditWs.id) || [] : [];
  const auditSinpeTxs = activeAuditWs ? sinpeByWorkshop.get(activeAuditWs.id) || [] : [];
  const auditOrdersQty = auditEnrollments.reduce((acc, e) => acc + e.quantity, 0);
  const auditSinpeQty = auditSinpeTxs.length;
  const auditTotalConfirmed = Math.min(activeAuditWs ? activeAuditWs.totalSpots : 0, auditOrdersQty + auditSinpeQty);
  const auditAvailable = activeAuditWs ? Math.max(0, activeAuditWs.totalSpots - auditTotalConfirmed) : 0;
  const auditTotalRevenue = activeAuditWs ? auditTotalConfirmed * activeAuditWs.price : 0;

  return (
    <section className="space-y-4">
      {/* Cabecera Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div>
          <h2 className="text-lg font-bubble font-bold text-fio-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-fio-300" />
            Inscripciones &amp; Cupos Pagados en Talleres
          </h2>
          <p className="text-xs text-gray-500">
            Control de asistencia, confirmaciones de pago SINPE BCR y recaudación en caja.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Botón Solicitado: Cantidad de Talleres Pagados */}
          <button
            type="button"
            onClick={() => setShowPaidSummary((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-bubble font-bold text-xs border shadow-sm transition-all active:scale-95 ${
              showPaidSummary
                ? 'bg-purple-900 text-white border-purple-950'
                : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 border-pink-400'
            }`}
            title="Ver desglose detallado de cupos vendidos y confirmados por taller"
          >
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>Talleres Pagados &amp; Confirmados</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-white text-purple-950 ml-0.5">
              {totalGlobalSold} cupos
            </span>
          </button>

          <button
            type="button"
            onClick={copyCatalogLink}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl font-bubble font-bold text-xs border transition-all ${
              copiedCatalog
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-white hover:bg-slate-50 text-fio-900 border-slate-200 shadow-xs'
            }`}
          >
            {copiedCatalog ? (
              <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ¡Link copiado!</>
            ) : (
              <><Link2 className="w-3.5 h-3.5 text-fio-pink" /> Link de Talleres</>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingWorkshop(null);
              setIsNewWorkshopModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-bold text-xs shadow-clayBtn active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Crear Taller
          </button>
        </div>
      </div>

      {/* PANEL AUDITORÍA DE CUPOS PAGADOS Y CONFIRMADOS (REQUERIMIENTO DEL USUARIO) */}
      {showPaidSummary && activeAuditWs && (
        <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-fio-900 text-white p-5 sm:p-6 rounded-3xl shadow-clay border-2 border-purple-300/40 space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/15 flex items-center justify-center text-amber-300 border border-white/20">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bubble font-bold text-base sm:text-lg">
                  Resumen de Cupos Pagados &amp; Confirmados en Caja
                </h3>
                <p className="text-xs text-purple-200">
                  El dinero recaudado cae en Caja y se clasifica automáticamente como <strong>Talleres Creativos</strong>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onNavigateToSinpe || (() => setIsSinpeModalOpen(true))}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-bubble text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Módulo Pagos SINPE BCR →</span>
            </button>
          </div>

          {/* Selector de Taller */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-purple-200 block">
              Elige el Taller para auditar cupos confirmados:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
              {workshops.map((ws) => {
                const isSelected = (selectedAuditId || workshops[0]?.id) === ws.id;
                const wsOrderEnrollments = enrollmentsByWorkshop.get(ws.id) || [];
                const wsSinpe = sinpeByWorkshop.get(ws.id) || [];
                const confirmed = wsOrderEnrollments.reduce((a, b) => a + b.quantity, 0) + wsSinpe.length;
                return (
                  <button
                    key={ws.id}
                    type="button"
                    onClick={() => setSelectedAuditId(ws.id)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bubble font-bold whitespace-nowrap transition-all border ${
                      isSelected
                        ? 'bg-white text-purple-950 border-white shadow-md scale-[1.02]'
                        : 'bg-white/10 hover:bg-white/20 text-purple-100 border-white/15'
                    }`}
                  >
                    <span>{ws.title}</span>
                    <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isSelected ? 'bg-purple-900 text-white' : 'bg-white/20 text-white'
                    }`}>
                      {confirmed}/{ws.totalSpots}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TARJETA DINÁMICA CON EL FORMATO EXACTO SOLICITADO */}
          <div className="bg-white text-slate-900 p-4 sm:p-5 rounded-2xl shadow-md border border-purple-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-pink-700 uppercase tracking-wider block">
                  Taller Seleccionado:
                </span>
                <h4 className="font-bubble font-bold text-lg text-slate-900">
                  {activeAuditWs.title}
                </h4>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  {activeAuditWs.date} • {activeAuditWs.schedule} • {activeAuditWs.location}
                </p>
              </div>

              <div className="sm:text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Total Ingresado en Caja:
                </span>
                <p className="font-bubble font-bold text-xl text-purple-900">
                  {formatCRC(auditTotalRevenue)}
                </p>
              </div>
            </div>

            {/* FRASE PRINCIPAL MANDATORIA: "Del taller de 20 cupos se han vendido 10 y ya están confirmados" */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-bubble font-bold text-sm sm:text-base text-purple-950">
                    Del taller de {activeAuditWs.totalSpots} cupos se han vendido {auditTotalConfirmed} y ya están confirmados.
                  </p>
                  <p className="text-xs text-slate-600 font-medium">
                    Quedan <strong className="text-pink-600 font-bold">{auditAvailable} cupos disponibles</strong> para inscripción.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200">
                  💰 En Caja: {formatCRC(activeAuditWs.price)} c/u
                </span>
              </div>
            </div>

            {/* Listado de Alumnos y Comprobantes SINPE Confirmados */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-slate-700 block">
                Comprobantes de Pago y Alumnos Confirmados ({auditEnrollments.length + auditSinpeTxs.length}):
              </span>

              {auditEnrollments.length === 0 && auditSinpeTxs.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  No hay pagos registrados para este taller aún. Puedes acreditar uno desde el Verificador SINPE BCR.
                </p>
              ) : (
                <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto text-xs pr-1">
                  {/* Pagos por Órdenes Web */}
                  {auditEnrollments.map((e, idx) => (
                    <div key={`ord-${idx}`} className="py-2 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{e.name}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span>📞 {e.phone}</span>
                          <span>• N° Orden: {e.orderNumber}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bubble font-bold text-purple-900">{e.quantity} cupo(s)</span>
                        <span className="text-[10px] block text-emerald-600 font-semibold">Pago Web Confirmado ✅</span>
                      </div>
                    </div>
                  ))}

                  {/* Pagos por SINPE BCR Acreditado Directo */}
                  {auditSinpeTxs.map((tx) => (
                    <div key={`sinpe-${tx.id}`} className="py-2 flex items-center justify-between bg-purple-50/30 px-2 rounded-lg">
                      <div>
                        <p className="font-semibold text-purple-950 flex items-center gap-1.5">
                          <span>{tx.originName}</span>
                          <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                            SINPE BCR
                          </span>
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span>📞 {tx.originPhone}</span>
                          <span>• Ref: <strong className="font-mono text-purple-900">{tx.referenceNumber}</strong></span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bubble font-bold text-purple-900">{formatCRC(tx.amount)}</span>
                        <span className="text-[10px] block text-emerald-600 font-semibold">Verificado BCR ✅</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lista General de Talleres */}
      {workshops.map((ws) => {
        const enrollments = enrollmentsByWorkshop.get(ws.id) || [];
        const sinpeTxs = sinpeByWorkshop.get(ws.id) || [];
        const totalSold = enrollments.reduce((acc, e) => acc + e.quantity, 0) + sinpeTxs.length;
        const spotsUsed = Math.min(ws.totalSpots, totalSold);
        const pct = Math.min(100, Math.round((spotsUsed / ws.totalSpots) * 100));
        const isOpen = expandedId === ws.id;

        return (
          <div key={ws.id} className="bg-white rounded-2xl border border-fio-200 shadow-sm overflow-hidden">
            <button
              onClick={() => toggle(ws.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-fio-50/50 transition-colors cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <p className="font-bubble font-bold text-sm text-fio-900 truncate">{ws.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" /> {ws.date} • {ws.schedule}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs font-bold text-fio-800">
                    <Users className="w-3.5 h-3.5" />
                    {spotsUsed}/{ws.totalSpots} confirmados
                  </div>
                  <div className="w-20 h-1.5 bg-fio-100 rounded-full mt-1 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${pct >= 90 ? 'bg-red-400' : pct >= 60 ? 'bg-fio-yellow' : 'bg-fio-300'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg hidden sm:block">
                  {formatCRC(totalSold * ws.price)}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingWorkshop(ws);
                    setIsNewWorkshopModalOpen(true);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-fio-100 hover:bg-fio-200 text-fio-900 border border-fio-200 transition-all active:scale-95 shadow-2xs"
                  title="Modificar o editar datos de este taller"
                >
                  <Pencil className="w-3.5 h-3.5 text-fio-pink" />
                  <span className="hidden sm:inline">Modificar</span>
                </button>

                {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-fio-100 px-5 py-3 bg-fio-50/30">
                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingWorkshop(ws);
                      setIsNewWorkshopModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-fio-800 text-white hover:bg-fio-900 transition-all shadow-xs active:scale-95"
                  >
                    <Pencil className="w-3.5 h-3.5 text-fio-yellow" />
                    <span>Modificar Taller</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAuditId(ws.id);
                      setShowPaidSummary(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-pink-100 text-pink-900 hover:bg-pink-200 transition-all shadow-xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-pink-700" />
                    <span>Ver Cupos Confirmados ({totalSold}/{ws.totalSpots})</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); copyWorkshopLink(ws.id); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      copiedId === ws.id
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-fio-100 text-fio-800 hover:bg-fio-200'
                    }`}
                  >
                    {copiedId === ws.id ? (
                      <><CheckCircle2 className="w-3.5 h-3.5" /> ¡Link de este taller copiado!</>
                    ) : (
                      <><Link2 className="w-3.5 h-3.5" /> Copiar Link de este Taller</>
                    )}
                  </button>

                  <a
                    href={`/talleres/${ws.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-fio-pink" />
                    <span>Ver Página Pública</span>
                  </a>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); if (confirm(`¿Eliminar "${ws.title}"?`)) deleteWorkshop(ws.id); }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Eliminar
                  </button>
                </div>

                {enrollments.length === 0 && sinpeTxs.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-2">Sin inscripciones registradas aún.</p>
                ) : (
                  <div className="divide-y divide-fio-100">
                    {enrollments.map((e, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2.5 text-xs">
                        <div>
                          <p className="font-semibold text-fio-900">{e.name}</p>
                          <p className="text-gray-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" /> {e.phone}
                            {e.email && <span className="ml-2">• {e.email}</span>}
                          </p>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <span className="flex items-center gap-1 text-fio-800 font-bold">
                            <Hash className="w-3 h-3" /> {e.orderNumber}
                          </span>
                          <span className="text-gray-400">{e.quantity} cupo{e.quantity > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    ))}

                    {sinpeTxs.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between py-2.5 text-xs bg-purple-50/40 px-2 rounded-lg">
                        <div>
                          <p className="font-semibold text-purple-950 flex items-center gap-1.5">
                            <span>{tx.originName}</span>
                            <span className="text-[10px] bg-purple-200 text-purple-900 px-1.5 py-0.2 rounded font-bold">
                              SINPE BCR
                            </span>
                          </p>
                          <p className="text-gray-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" /> {tx.originPhone}
                            <span className="ml-2 text-purple-800 font-mono font-bold">Ref: {tx.referenceNumber}</span>
                          </p>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <span className="font-bold text-purple-900">{formatCRC(tx.amount)}</span>
                          <span className="text-emerald-600 text-[10px] block font-semibold">Confirmado en Caja ✅</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-fio-200 text-xs">
                  <span className="text-gray-500">
                    {totalSold} cupo{totalSold !== 1 ? 's' : ''} vendido{totalSold !== 1 ? 's' : ''} y confirmados de {ws.totalSpots} totales
                  </span>
                  <span className="font-bold text-fio-800">Precio: {formatCRC(ws.price)} c/u</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};
