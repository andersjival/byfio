import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCRC } from '../../utils/formatters';
import {
  GraduationCap, Users, ChevronDown, ChevronUp, Phone, Hash,
  Calendar, Plus, Link2, Trash2, CheckCircle2, ExternalLink, Pencil,
} from 'lucide-react';

export const WorkshopEnrollmentsSection: React.FC = () => {
  const { workshops, orders, setIsNewWorkshopModalOpen, deleteWorkshop, setEditingWorkshop } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCatalog, setCopiedCatalog] = useState(false);

  const enrollmentsByWorkshop = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; email?: string; orderNumber: string; quantity: number; date: string }[]>();
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
            });
          }
        });
    });
    return map;
  }, [workshops, orders]);

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

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <h2 className="text-lg font-bubble font-bold text-fio-900 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-fio-300" />
          Inscripciones a Talleres
        </h2>
        <div className="flex flex-wrap items-center gap-2">
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
              <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ¡Link del catálogo copiado!</>
            ) : (
              <><Link2 className="w-3.5 h-3.5 text-fio-pink" /> Copiar Link de Todos los Talleres</>
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

      {workshops.map((ws) => {
        const enrollments = enrollmentsByWorkshop.get(ws.id) || [];
        const totalSold = enrollments.reduce((acc, e) => acc + e.quantity, 0);
        const spotsUsed = ws.totalSpots - ws.spotsAvailable + totalSold;
        const pct = Math.min(100, Math.round((spotsUsed / ws.totalSpots) * 100));
        const isOpen = expandedId === ws.id;

        return (
          <div key={ws.id} className="bg-white rounded-2xl border border-fio-200 shadow-sm overflow-hidden">
            <button
              onClick={() => toggle(ws.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-fio-50/50 transition-colors"
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
                    {spotsUsed}/{ws.totalSpots}
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

                {enrollments.length === 0 ? (
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
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-fio-200 text-xs">
                  <span className="text-gray-500">
                    {enrollments.length} inscri{enrollments.length === 1 ? 'to' : 'tos'} •{' '}
                    {totalSold} cupo{totalSold !== 1 ? 's' : ''} vendido{totalSold !== 1 ? 's' : ''}
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
