import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useConfirm } from '../../context/ConfirmContext';
import { SweepEntryStatus } from '../../types';
import { formatShortDate } from '../../utils/formatters';
import {
  History, Search, Trash2, User, Clock, Layers, Building2, Tag, CheckCircle2, Package
} from 'lucide-react';

interface InventorySweepHistoryProps {
  defaultShelfFilter?: string;
}

export const InventorySweepHistory: React.FC<InventorySweepHistoryProps> = ({
  defaultShelfFilter = 'ALL',
}) => {
  const { sweepEntries, updateSweepEntryStatus, deleteSweepEntry } = useApp();
  const confirm = useConfirm();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | SweepEntryStatus>('ALL');
  const [shelfFilter, setShelfFilter] = useState<string>(defaultShelfFilter);

  const uniqueShelves = useMemo(() => {
    const set = new Set<string>();
    sweepEntries.forEach((e) => {
      if (e.shelfLocation) set.add(e.shelfLocation);
      if (e.shelfName) set.add(e.shelfName);
    });
    return Array.from(set).sort();
  }, [sweepEntries]);

  const counts = useMemo(() => {
    const guardado = sweepEntries.filter((e) => e.status === 'guardado').length;
    const cargado = sweepEntries.filter((e) => e.status === 'cargado_inv').length;
    return { total: sweepEntries.length, guardado, cargado };
  }, [sweepEntries]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sweepEntries.filter((e) => {
      if (statusFilter !== 'ALL' && e.status !== statusFilter) return false;
      if (shelfFilter !== 'ALL' && e.shelfLocation !== shelfFilter && e.shelfName !== shelfFilter) {
        return false;
      }
      if (!q) return true;
      return (
        e.productName.toLowerCase().includes(q) ||
        e.sku.toLowerCase().includes(q) ||
        e.userName.toLowerCase().includes(q) ||
        (e.supplier || '').toLowerCase().includes(q) ||
        (e.category || '').toLowerCase().includes(q)
      );
    });
  }, [sweepEntries, statusFilter, shelfFilter, search]);

  const handleDelete = async (id: string, name: string) => {
    const ok = await confirm(
      `¿Eliminar el registro de barrido de "${name}" del historial?`,
      {
        title: 'Eliminar registro de barrido',
        confirmLabel: 'Eliminar',
        cancelLabel: 'Cancelar',
        variant: 'danger',
      }
    );
    if (ok) deleteSweepEntry(id);
  };

  return (
    <section className="bg-white rounded-3xl border border-purple-100 shadow-sm p-4 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bubble font-extrabold text-purple-950">
              Historial de Barrido por Usuario
            </h3>
            <p className="text-[11px] text-slate-500">
              Registro con usuario, fecha, hora y selector de estado (Guardado / Cargado Inv)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-bold">
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            Total: {counts.total}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
            Guardado: {counts.guardado}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
            Cargado Inv: {counts.cargado}
          </span>
        </div>
      </div>

      {/* Filtros con selector de estado */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar producto, SKU, usuario..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'ALL' | SweepEntryStatus)}
          aria-label="Filtrar por estado de barrido"
          className="px-3 py-2 text-xs font-bold bg-purple-50/70 text-purple-950 border border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 cursor-pointer"
        >
          <option value="ALL">Estado: Todos ({counts.total})</option>
          <option value="guardado">Estado: Guardado ({counts.guardado})</option>
          <option value="cargado_inv">Estado: Cargado Inv ({counts.cargado})</option>
        </select>

        <select
          value={shelfFilter}
          onChange={(e) => setShelfFilter(e.target.value)}
          aria-label="Filtrar por estante"
          className="px-3 py-2 text-xs font-bold bg-slate-50 text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 cursor-pointer"
        >
          <option value="ALL">Estante: Todos</option>
          {uniqueShelves.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="py-8 text-center text-slate-400 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
          <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <p className="text-xs font-bold text-slate-500">
            No hay registros de barrido con estos filtros
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {filtered.map((entry) => {
            const isLoaded = entry.status === 'cargado_inv';
            return (
              <div
                key={entry.id}
                className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isLoaded
                    ? 'bg-emerald-50/40 border-emerald-200/80'
                    : 'bg-amber-50/40 border-amber-200/80'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                      {entry.productName}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-mono text-[10px] font-bold text-purple-700">
                      {entry.sku}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black">
                      +{entry.quantityAdded} u.
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600">
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                      <User className="w-3 h-3 text-purple-500" />
                      {entry.userName}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {formatShortDate(entry.createdAt)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-purple-700 font-bold">
                      <Layers className="w-3 h-3" />
                      {entry.shelfLocation || entry.shelfName}
                    </span>
                    {entry.category && (
                      <span className="inline-flex items-center gap-1">
                        <Tag className="w-3 h-3 text-pink-500" />
                        {entry.category}
                      </span>
                    )}
                    {entry.supplier && (
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-indigo-500" />
                        {entry.supplier}
                      </span>
                    )}
                  </div>
                </div>

                {/* Selector de Estado Guardado / Cargado Inv + eliminar */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="relative flex items-center">
                    {isLoaded && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 absolute left-2.5 pointer-events-none" />
                    )}
                    <select
                      value={entry.status}
                      onChange={(e) =>
                        updateSweepEntryStatus(entry.id, e.target.value as SweepEntryStatus)
                      }
                      aria-label={`Estado de ${entry.productName}`}
                      className={`text-xs font-extrabold rounded-xl py-1.5 pr-3 border cursor-pointer focus:outline-none ${
                        isLoaded
                          ? 'pl-7 bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'pl-3 bg-amber-100 text-amber-900 border-amber-300'
                      }`}
                    >
                      <option value="guardado">Guardado</option>
                      <option value="cargado_inv">Cargado Inv</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id, entry.productName)}
                    title="Eliminar registro"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
