import React, { useState } from 'react';
import { Supplier } from '../../types';
import { formatCRC } from '../../utils/formatters';
import {
  Truck, UserPlus, ArrowRight,
  Calendar, Receipt, Phone, Mail, Hash, Calculator
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
  const [newName, setNewName] = useState('');
  const [newLegalId, setNewLegalId] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectSupplier = (supp: Supplier | undefined) => {
    setErrorMsg(null);
    onChangeDraft((prev) => ({
      ...prev,
      supplierId: supp?.id || '',
      supplierName: supp?.name || '',
      supplierLegalId: supp?.legalId || '',
      supplierPhone: supp?.whatsappPhone || supp?.phone || '',
      supplierEmail: supp?.email || '',
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
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-clay p-4 sm:p-5 space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bubble font-bold text-base text-fio-900">1. Proveedor y Datos de Factura</h3>
          <p className="text-[11px] text-slate-500">Elige un proveedor o créalo aquí mismo y presiona Aceptar.</p>
        </div>
        <div className="inline-flex p-0.5 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => { setIsCreatingNew(false); setErrorMsg(null); }}
            className={`px-2.5 py-1 rounded-lg font-bubble text-[11px] font-bold transition-all cursor-pointer ${!isCreatingNew ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600'}`}
          >
            Proveedor Existente
          </button>
          <button
            type="button"
            onClick={() => { setIsCreatingNew(true); setErrorMsg(null); }}
            className={`px-2.5 py-1 rounded-lg font-bubble text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${isCreatingNew ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'}`}
          >
            <UserPlus className="w-3 h-3" />
            <span>Crear Proveedor</span>
          </button>
        </div>
      </div>

      {!isCreatingNew ? (
        <div className="space-y-1.5">
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={draft.supplierId}
              onChange={(e) => selectSupplier(suppliers.find((s) => s.id === e.target.value))}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
            >
              <option value="">-- Seleccionar proveedor ({suppliers.length}) --</option>
              {suppliers.map((supp) => (
                <option key={supp.id} value={supp.id}>
                  {supp.name}{supp.phone ? ` • Tel: ${supp.phone}` : ''}{supp.legalId ? ` • Céd: ${supp.legalId}` : ''}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => { setIsCreatingNew(true); setErrorMsg(null); }}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bubble text-[11px] font-bold cursor-pointer shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Nuevo proveedor</span>
            </button>
          </div>
          {draft.supplierName && (
            <p className="text-[11px] text-purple-800 bg-purple-50/70 border border-purple-100 rounded-lg px-2.5 py-1 font-medium truncate">
              <strong>{draft.supplierName}</strong>
              {draft.supplierLegalId ? ` • Céd: ${draft.supplierLegalId}` : ''}
              {draft.supplierPhone ? ` • Tel: ${draft.supplierPhone}` : ''}
              {draft.supplierEmail ? ` • ${draft.supplierEmail}` : ''}
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
          <div>
            <label className="text-[10px] font-bold text-slate-700 mb-0.5 block">Nombre proveedor *</label>
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ej: Distribuidora CR" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-700 mb-0.5 block">Cédula jurídica (opc.)</label>
            <input type="text" value={newLegalId} onChange={(e) => setNewLegalId(e.target.value)} placeholder="3-101-123456" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-mono" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-700 mb-0.5 block flex items-center gap-1"><Phone className="w-3 h-3" />Teléfono</label>
            <input type="tel" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="2222-3344" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-mono" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-700 mb-0.5 block flex items-center gap-1"><Mail className="w-3 h-3" />Correo proveedor</label>
            <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="facturas@prov.cr" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100">
        <div>
          <label className="text-[10px] font-bold text-slate-700 mb-0.5 block flex items-center gap-1"><Hash className="w-3 h-3" />Número de pedido</label>
          <input type="text" value={draft.orderNumber} onChange={(e) => onChangeDraft((p) => ({ ...p, orderNumber: e.target.value }))} placeholder="OC-2026-01" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-700 mb-0.5 block flex items-center gap-1"><Receipt className="w-3 h-3" />Número de factura</label>
          <input type="text" value={draft.invoiceNumber} onChange={(e) => onChangeDraft((p) => ({ ...p, invoiceNumber: e.target.value }))} placeholder="FAC-001294" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-700 mb-0.5 block flex items-center gap-1"><Calendar className="w-3 h-3" />Fecha de ingreso</label>
          <input type="date" value={draft.entryDate} onChange={(e) => onChangeDraft((p) => ({ ...p, entryDate: e.target.value }))} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {moneyInputs.map(({ key, label }) => (
          <div key={key}>
            <label className="text-[10px] font-bold text-slate-600 mb-0.5 block">{label}</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={draft[key]}
              onChange={(e) => updateMoneyField(key, e.target.value)}
              placeholder="0"
              className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
            />
          </div>
        ))}
        <div>
          <label className="text-[10px] font-bold text-purple-800 mb-0.5 flex items-center justify-between">
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
            className="w-full px-2 py-1.5 rounded-lg border-2 border-purple-300 bg-purple-50/50 text-xs font-mono font-bold text-purple-900"
          />
        </div>
      </div>

      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">{errorMsg}</div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <span className="text-[11px] font-semibold text-slate-500">
          {draft.supplierName ? `Seleccionado: ${draft.supplierName}` : 'Ningún proveedor seleccionado aún'}
          {num(draft.totalGeneral) > 0 ? ` • Total: ${formatCRC(num(draft.totalGeneral))}` : ''}
        </span>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-fio-pink text-white font-bubble text-xs font-bold shadow-clayBtn hover:opacity-95 active:scale-95 transition-all cursor-pointer"
        >
          <Truck className="w-3.5 h-3.5" />
          <span>{isCreatingNew ? 'Guardar Proveedor y Aceptar' : 'Aceptar e Ingresar Productos'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
};
