import React, { useState, useMemo } from 'react';
import { Supplier } from '../../types';
import { formatCRC } from '../../utils/formatters';
import {
  Truck, UserPlus, Search, CheckCircle2, ArrowRight,
  Calendar, Receipt, Phone, Mail, FileText, Hash, Calculator
} from 'lucide-react';

export interface SupplierInvoiceDraft {
  supplierId: string;
  supplierName: string;
  supplierLegalId: string;
  supplierPhone: string;
  supplierEmail: string;
  orderNumber: string;
  invoiceNumber: string;
  entryDate: string;
  invoiceAmount: string;
  discountAmount: string;
  taxAmount: string;
  subtotalAmount: string;
  otherAmount: string;
  totalGeneral: string;
  totalEditedManually: boolean;
}

interface SupplierInvoiceHeaderStepProps {
  suppliers: Supplier[];
  draft: SupplierInvoiceDraft;
  onChangeDraft: (updater: (prev: SupplierInvoiceDraft) => SupplierInvoiceDraft) => void;
  onCreateSupplier: (data: Omit<Supplier, 'id' | 'createdAt'>) => Supplier;
  onAccept: (resolvedDraft: SupplierInvoiceDraft) => void;
}

const num = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

export const SupplierInvoiceHeaderStep: React.FC<SupplierInvoiceHeaderStepProps> = ({
  suppliers,
  draft,
  onChangeDraft,
  onCreateSupplier,
  onAccept,
}) => {
  const [isCreatingNew, setIsCreatingNew] = useState(suppliers.length === 0);
  const [supplierSearch, setSupplierSearch] = useState('');
  const [newName, setNewName] = useState('');
  const [newLegalId, setNewLegalId] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filteredSuppliers = useMemo(() => {
    const q = supplierSearch.trim().toLowerCase();
    if (!q) return suppliers;
    return suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.phone || '').toLowerCase().includes(q) ||
        (s.legalId || '').toLowerCase().includes(q) ||
        (s.email || '').toLowerCase().includes(q)
    );
  }, [suppliers, supplierSearch]);

  const selectSupplier = (supp: Supplier) => {
    setErrorMsg(null);
    onChangeDraft((prev) => ({
      ...prev,
      supplierId: supp.id,
      supplierName: supp.name,
      supplierLegalId: supp.legalId || '',
      supplierPhone: supp.whatsappPhone || supp.phone || '',
      supplierEmail: supp.email || '',
    }));
  };

  const updateMoneyField = (
    field: 'invoiceAmount' | 'discountAmount' | 'taxAmount' | 'subtotalAmount' | 'otherAmount' | 'totalGeneral',
    value: string
  ) => {
    onChangeDraft((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'totalGeneral') {
        next.totalEditedManually = value.trim() !== '';
      } else if (!next.totalEditedManually) {
        const sub = num(next.subtotalAmount) || num(next.invoiceAmount);
        const calc = Math.max(0, sub - num(next.discountAmount) + num(next.taxAmount) + num(next.otherAmount));
        next.totalGeneral = calc > 0 ? String(Number(calc.toFixed(2))) : '';
      }
      return next;
    });
  };

  const handleRecalcTotal = () => {
    onChangeDraft((prev) => {
      const sub = num(prev.subtotalAmount) || num(prev.invoiceAmount);
      const calc = Math.max(0, sub - num(prev.discountAmount) + num(prev.taxAmount) + num(prev.otherAmount));
      return { ...prev, totalEditedManually: false, totalGeneral: calc > 0 ? String(Number(calc.toFixed(2))) : '' };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isCreatingNew) {
      const cleanName = newName.trim();
      const cleanPhone = newPhone.trim();
      if (!cleanName) {
        setErrorMsg('Ingresa el nombre del proveedor nuevo.');
        return;
      }
      const created = onCreateSupplier({
        name: cleanName,
        legalId: newLegalId.trim() || undefined,
        phone: cleanPhone,
        whatsappPhone: cleanPhone || undefined,
        email: newEmail.trim() || undefined,
      });
      const resolved: SupplierInvoiceDraft = {
        ...draft,
        supplierId: created.id,
        supplierName: created.name,
        supplierLegalId: created.legalId || '',
        supplierPhone: created.phone,
        supplierEmail: created.email || '',
      };
      onChangeDraft(() => resolved);
      onAccept(resolved);
      return;
    }

    if (!draft.supplierId && !draft.supplierName.trim()) {
      setErrorMsg('Selecciona un proveedor existente o crea uno nuevo ahí mismo.');
      return;
    }
    onAccept(draft);
  };

  const moneyInputs: { key: 'invoiceAmount' | 'discountAmount' | 'taxAmount' | 'subtotalAmount' | 'otherAmount'; label: string }[] = [
    { key: 'invoiceAmount', label: 'Monto de factura' },
    { key: 'discountAmount', label: 'Monto Descuento' },
    { key: 'taxAmount', label: 'Monto IVA' },
    { key: 'subtotalAmount', label: 'Monto Subtotal' },
    { key: 'otherAmount', label: 'Monto Otros' },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-clay p-5 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-bubble font-bold text-lg text-fio-900">1. Proveedor y Datos de Factura</h3>
          <p className="text-xs text-slate-500">Selecciona un proveedor existente o créalo aquí mismo, luego presiona Aceptar para ingresar productos.</p>
        </div>
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => { setIsCreatingNew(false); setErrorMsg(null); }}
            className={`px-3 py-1.5 rounded-xl font-bubble text-xs font-bold transition-all cursor-pointer ${!isCreatingNew ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600'}`}
          >
            Proveedor Existente
          </button>
          <button
            type="button"
            onClick={() => { setIsCreatingNew(true); setErrorMsg(null); if (supplierSearch.trim() && !newName) setNewName(supplierSearch.trim()); }}
            className={`px-3 py-1.5 rounded-xl font-bubble text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${isCreatingNew ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'}`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Crear Proveedor</span>
          </button>
        </div>
      </div>

      {!isCreatingNew ? (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={supplierSearch}
                onChange={(e) => setSupplierSearch(e.target.value)}
                placeholder="Buscar proveedor por nombre, cédula jurídica o teléfono..."
                className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <button
              type="button"
              onClick={() => { setIsCreatingNew(true); if (supplierSearch.trim()) setNewName(supplierSearch.trim()); }}
              className="px-3.5 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bubble text-xs font-bold cursor-pointer shrink-0"
            >
              + No existe, crear aquí
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-0.5">
            {filteredSuppliers.map((supp) => {
              const selected = draft.supplierId === supp.id;
              return (
                <button
                  key={supp.id}
                  type="button"
                  onClick={() => selectSupplier(supp)}
                  className={`text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                    selected ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-200' : 'bg-slate-50 border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bubble font-bold text-xs text-slate-900 truncate">{supp.name}</span>
                    {selected && <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                    {supp.phone}{supp.legalId ? ` • Céd: ${supp.legalId}` : ''}
                  </p>
                </button>
              );
            })}
          </div>
          {filteredSuppliers.length === 0 && (
            <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-2xl border border-amber-200">
              No se encontró el proveedor. Haz clic en <strong>+ Crear Proveedor</strong> para agregarlo aquí mismo.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
          <div>
            <label className="text-[11px] font-bold text-slate-700 mb-1 block">Nombre proveedor *</label>
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ej: Distribuidora Central CR" className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-700 mb-1 block">Cédula jurídica (opcional)</label>
            <input type="text" value={newLegalId} onChange={(e) => setNewLegalId(e.target.value)} placeholder="Ej: 3-101-123456" className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-700 mb-1 block flex items-center gap-1"><Phone className="w-3 h-3" />Teléfono</label>
            <input type="tel" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="Ej: 2222-3344" className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-700 mb-1 block flex items-center gap-1"><Mail className="w-3 h-3" />Correo del proveedor</label>
            <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="facturas@proveedor.cr" className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
        <div>
          <label className="text-[11px] font-bold text-slate-700 mb-1 block flex items-center gap-1"><Hash className="w-3 h-3" />Número de pedido</label>
          <input type="text" value={draft.orderNumber} onChange={(e) => onChangeDraft((p) => ({ ...p, orderNumber: e.target.value }))} placeholder="Ej: OC-2026-01" className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono" />
        </div>
        <div>
          <label className="text-[11px] font-bold text-slate-700 mb-1 block flex items-center gap-1"><Receipt className="w-3 h-3" />Número de factura</label>
          <input type="text" value={draft.invoiceNumber} onChange={(e) => onChangeDraft((p) => ({ ...p, invoiceNumber: e.target.value }))} placeholder="Ej: FAC-001294" className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono" />
        </div>
        <div>
          <label className="text-[11px] font-bold text-slate-700 mb-1 block flex items-center gap-1"><Calendar className="w-3 h-3" />Fecha de ingreso</label>
          <input type="date" value={draft.entryDate} onChange={(e) => onChangeDraft((p) => ({ ...p, entryDate: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {moneyInputs.map(({ key, label }) => (
          <div key={key}>
            <label className="text-[11px] font-bold text-slate-600 mb-1 block">{label}</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={draft[key]}
              onChange={(e) => updateMoneyField(key, e.target.value)}
              placeholder="0"
              className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-mono"
            />
          </div>
        ))}
        <div>
          <label className="text-[11px] font-bold text-purple-800 mb-1 flex items-center justify-between">
            <span>Total General</span>
            <button type="button" onClick={handleRecalcTotal} title="Recalcular total" className="text-purple-600 hover:text-purple-900 cursor-pointer"><Calculator className="w-3 h-3" /></button>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={draft.totalGeneral}
            onChange={(e) => updateMoneyField('totalGeneral', e.target.value)}
            placeholder="0"
            className="w-full px-2.5 py-2 rounded-xl border-2 border-purple-300 bg-purple-50/50 text-xs font-mono font-bold text-purple-900"
          />
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">{errorMsg}</div>
      )}

      <div className="flex items-center justify-between gap-3 pt-2">
        <span className="text-xs font-semibold text-slate-500">
          {draft.supplierName ? `Seleccionado: ${draft.supplierName}` : 'Ningún proveedor seleccionado aún'}
          {num(draft.totalGeneral) > 0 ? ` • Total factura: ${formatCRC(num(draft.totalGeneral))}` : ''}
        </span>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-700 to-fio-pink text-white font-bubble text-xs font-bold shadow-clayBtn hover:opacity-95 active:scale-95 transition-all cursor-pointer"
        >
          <Truck className="w-4 h-4" />
          <span>{isCreatingNew ? 'Guardar Proveedor y Aceptar' : 'Aceptar e Ingresar Productos'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
