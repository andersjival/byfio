import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useConfirm } from '../../context/ConfirmContext';
import { SweepEntryStatus } from '../../types';
import { formatShortDate } from '../../utils/formatters';
import { STANDARD_SHELVES, extractShelfNumber, getExtraShelves } from '../../utils/inventoryShelves';
import {
  History, Search, Trash2, User, Clock, Layers, MapPin, Building2, Tag, CheckCircle2, Package, X
} from 'lucide-react';

interface InventorySweepHistoryProps {
  defaultShelfFilter?: string;
}

const norm = (v?: string) => (v || '').trim().toLowerCase();

const collectUnique = (values: (string | undefined)[], shelfSort = false): string[] => {
  const map = new Map<string, string>();
  values.forEach((v) => {
    const clean = (v || '').trim();
    const key = clean.toLowerCase();
    if (clean && !map.has(key)) map.set(key, clean);
  });
  return Array.from(map.values()).sort((a, b) => {
    if (shelfSort) {
      const na = extractShelfNumber(a);
      const nb = extractShelfNumber(b);
      if (na !== null && nb !== null) return na - nb;
      if (na !== null) return -1;
      if (nb !== null) return 1;
    }
    return a.localeCompare(b, 'es', { numeric: true });
  });
};

export const InventorySweepHistory: React.FC<InventorySweepHistoryProps> = ({
  defaultShelfFilter = 'ALL',
}) => {
  const { sweepEntries, products, suppliers, updateSweepEntryStatus, deleteSweepEntry } = useApp();
  const confirm = useConfirm();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | SweepEntryStatus>('ALL');
  const [shelfFilter, setShelfFilter] = useState<string>(defaultShelfFilter);
  const [locationFilter, setLocationFilter] = useState<string>('ALL');
  const [supplierFilter, setSupplierFilter] = useState<string>('ALL');

  const extraShelves = useMemo(() => getExtraShelves(), []);

  const uniqueShelves = useMemo(
    () =>
      collectUnique(
        [...STANDARD_SHELVES, ...extraShelves, ...sweepEntries.map((e) => e.shelfName || e.shelfLocation)],
        true
      ),
    [sweepEntries, extraShelves]
  );

  const uniqueLocations = useMemo(
    () =>
      collectUnique(
        [
          ...sweepEntries.map((e) => e.shelfLocation),
          ...products.map((p) => p.shelfLocation),
          ...STANDARD_SHELVES,
          ...extraShelves,
        ],
        true
      ),
    [sweepEntries, products, extraShelves]
  );

  const uniqueSuppliers = useMemo(
    () =>
      collectUnique([
        ...sweepEntries.map((e) => e.supplier),
        ...suppliers.map((s) => s.name),
        ...products.map((p) => p.supplier),
      ]),
    [sweepEntries, suppliers, products]
  );

  const counts = useMemo(() => {
    const guardado = sweepEntries.filter((e) => e.status === 'guardado').length;
    const cargado = sweepEntries.filter((e) => e.status === 'cargado_inv').length;
    return { total: sweepEntries.length, guardado, cargado };
  }, [sweepEntries]);

  const filtered = useMemo(() => {
    const q = norm(search);
    const fShelf = norm(shelfFilter);
    const fLoc = norm(locationFilter);
    const fSup = norm(supplierFilter);
    return sweepEntries.filter((e) => {
      if (statusFilter !== 'ALL' && e.status !== statusFilter) return false;
      if (shelfFilter !== 'ALL' && norm(e.shelfName || e.shelfLocation) !== fShelf) return false;
      if (locationFilter !== 'ALL' && norm(e.shelfLocation) !== fLoc) return false;
      if (supplierFilter !== 'ALL' && norm(e.supplier) !== fSup) return false;
      if (!q) return true;
      return (
        norm(e.productName).includes(q) ||
        norm(e.sku).includes(q) ||
        norm(e.userName).includes(q) ||
        norm(e.supplier).includes(q) ||
        norm(e.category).includes(q) ||
        norm(e.shelfLocation).includes(q) ||
        norm(e.shelfName).includes(q)
      );
    });
  }, [sweepEntries, statusFilter, shelfFilter, locationFilter, supplierFilter, search]);

  const hasActiveFilters =
    search.trim() !== '' ||
    statusFilter !== 'ALL' ||
    shelfFilter !== 'ALL' ||
    locationFilter !== 'ALL' ||
    supplierFilter !== 'ALL';

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setShelfFilter('ALL');
    setLocationFilter('ALL');
    setSupplierFilter('ALL');
  };

  const selectFilters = [
    {
      key: 'status',
      label: 'Filtrar por estado de barrido',
      value: statusFilter,
      onChange: (v: string) => setStatusFilter(v as 'ALL' | SweepEntryStatus),
      cls: 'bg-purple-50/70 text-purple-950 border-purple-200 focus:border-purple-500',
      options: [
        { value: 'ALL', label: `Estado: Todos (${counts.total})` },
        { value: 'guardado', label: `Estado: Guardado (${counts.guardado})` },
        { value: 'cargado_inv', label: `Estado: Cargado Inv (${counts.cargado})` },
      ],
    },
    {
      key: 'shelf',
      label: 'Filtrar por estante',
      value: shelfFilter,
      onChange: setShelfFilter,
      cls: 'bg-slate-50 text-slate-800 border-slate-200 focus:border-purple-400',
      options: [
        { value: 'ALL', label: 'Estante: Todos' },
        ...uniqueShelves.map((s) => ({ value: s, label: /^estante\b/i.test(s) ? s : `Estante: ${s}` })),
      ],
    },
    {
      key: 'location',
      label: 'Filtrar por ubicación',
      value: locationFilter,
      onChange: setLocationFilter,
      cls: 'bg-slate-50 text-slate-800 border-slate-200 focus:border-purple-400',
      options: [
        { value: 'ALL', label: 'Ubicación: Todas' },
        ...uniqueLocations.map((loc) => ({ value: loc, label: `Ubicación: ${loc}` })),
      ],
    },
    {
      key: 'supplier',
      label: 'Filtrar por proveedor',
      value: supplierFilter,
      onChange: setSupplierFilter,
      cls: 'bg-slate-50 text-slate-800 border-slate-200 focus:border-purple-400',
      options: [
        { value: 'ALL', label: 'Proveedor: Todos' },
        ...uniqueSuppliers.map((sup) => ({ value: sup, label: `Proveedor: ${sup}` })),
      ],
    },
  ];

  const handleDelete = async (id: string, name: string) => {
    const ok = await confirm(
      `¿Eliminar el registro de barrido de "${name}" del historial?`,
      { title: 'Eliminar registro de barrido', confirmLabel: 'Eliminar', cancelLabel: 'Cancelar', variant: 'danger' }
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
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">Total: {counts.total}</span>
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">Guardado: {counts.guardado}</span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">Cargado Inv: {counts.cargado}</span>
        </div>
      </div>

      {/* Buscador y selectores de estado, estante, ubicación y proveedor */}
      <div className="space-y-2.5">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto, SKU, usuario, proveedor, ubicación..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400"
            />
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              Limpiar ({filtered.length}/{counts.total})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {selectFilters.map((f) => (
            <select
              key={f.key}
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              aria-label={f.label}
              className={`px-3 py-2 text-xs font-bold border rounded-xl focus:outline-none cursor-pointer ${f.cls}`}
            >
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-8 text-center text-slate-400 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
          <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <p className="text-xs font-bold text-slate-500">No hay registros de barrido con estos filtros</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {filtered.map((entry) => {
            const isLoaded = entry.status === 'cargado_inv';
            const showDistinctLocation =
              entry.shelfLocation && norm(entry.shelfLocation) !== norm(entry.shelfName);
            return (
              <div
                key={entry.id}
                className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isLoaded ? 'bg-emerald-50/40 border-emerald-200/80' : 'bg-amber-50/40 border-amber-200/80'
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
                    <span className="inline-flex items-center gap-1 text-purple-700 font-bold" title="Estante">
                      <Layers className="w-3 h-3" />
                      {entry.shelfName || entry.shelfLocation}
                    </span>
                    {showDistinctLocation && (
                      <span className="inline-flex items-center gap-1 text-fuchsia-700 font-semibold" title="Ubicación">
                        <MapPin className="w-3 h-3" />
                        {entry.shelfLocation}
                      </span>
                    )}
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
