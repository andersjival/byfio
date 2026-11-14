import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SupplierOrderItem } from '../../types';
import { SupplierInvoiceHeaderStep, SupplierInvoiceDraft } from './SupplierInvoiceHeaderStep';
import { SupplierInvoiceProductsStep } from './SupplierInvoiceProductsStep';
import { CheckCircle2 } from 'lucide-react';

interface SupplierManualIntakeStepProps {
  onGoToOrders: () => void;
  onOrderSaved?: () => void;
}

const getTodayLocalDate = (): string => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

const createEmptyDraft = (): SupplierInvoiceDraft => ({
  supplierId: '', supplierName: '', supplierLegalId: '', supplierPhone: '', supplierEmail: '',
  orderNumber: '', invoiceNumber: '', entryDate: getTodayLocalDate(), invoiceAmount: '',
  discountAmount: '', taxAmount: '', subtotalAmount: '', otherAmount: '', totalGeneral: '', totalEditedManually: false,
});

const parseMoney = (val: string) => {
  const n = parseFloat(val);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export const SupplierManualIntakeStep: React.FC<SupplierManualIntakeStepProps> = ({ onGoToOrders, onOrderSaved }) => {
  const { suppliers, addSupplier, products, addSupplierOrder, addInventoryAdjustment, currentUser } = useApp();
  const [step, setStep] = useState<'header' | 'products' | 'done'>('header');
  const [draft, setDraft] = useState<SupplierInvoiceDraft>(createEmptyDraft);
  const [items, setItems] = useState<SupplierOrderItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSummary, setSavedSummary] = useState('');

  const handleSave = async () => {
    if (items.length === 0 || isSaving) return;
    setIsSaving(true);
    try {
      const totalUnits = items.reduce((s, it) => s + it.orderQty, 0);
      const itemsCost = items.reduce((s, it) => s + it.subtotal, 0);
      const totalGeneralVal = parseMoney(draft.totalGeneral) || itemsCost;
      const orderNum = draft.orderNumber.trim() || draft.invoiceNumber.trim() || `ING-${draft.entryDate.replace(/-/g, '')}-${Math.floor(Math.random() * 899 + 100)}`;
      const nowIso = new Date().toISOString();

      addSupplierOrder({
        orderNumber: orderNum, orderType: 'invoice', invoiceNumber: draft.invoiceNumber.trim() || undefined,
        entryDate: draft.entryDate, supplierId: draft.supplierId || undefined, supplierName: draft.supplierName.trim(),
        supplierLegalId: draft.supplierLegalId.trim() || undefined, supplierPhone: draft.supplierPhone.trim() || undefined,
        supplierEmail: draft.supplierEmail.trim() || undefined, invoiceAmount: parseMoney(draft.invoiceAmount) || undefined,
        discountAmount: parseMoney(draft.discountAmount) || undefined, taxAmount: parseMoney(draft.taxAmount) || undefined,
        subtotalAmount: parseMoney(draft.subtotalAmount) || undefined, otherAmount: parseMoney(draft.otherAmount) || undefined,
        status: 'received', receivedAt: nowIso, loadedAt: nowIso, loadedBy: currentUser?.name || 'Administración',
        source: 'manual', items, totalUnits, totalCost: totalGeneralVal,
        notes: [draft.invoiceNumber.trim() ? `Factura #${draft.invoiceNumber.trim()}` : '', `Fecha ingreso: ${draft.entryDate}`].filter(Boolean).join(' • '),
      });

      await addInventoryAdjustment({
        shelfName: 'Ingreso Proveedor', performedBy: currentUser?.name || 'Administración', userRole: currentUser?.role,
        totalItemsCounted: items.length, totalDifferences: items.length, netDifferenceUnits: totalUnits,
        notes: `Factura Proveedor ${draft.supplierName.trim()}${draft.invoiceNumber.trim() ? ` #${draft.invoiceNumber.trim()}` : ''}`,
        items: items.map((it) => ({
          productId: it.productId || '', sku: it.sku, name: it.name, category: it.category,
          shelfLocation: it.shelfLocation || 'Sin estante', previousStock: it.currentStock,
          countedStock: it.currentStock + it.orderQty, difference: it.orderQty, reason: 'Ingreso Factura Proveedor',
        })),
      });

      setSavedSummary(`${draft.supplierName} • ${orderNum}${draft.invoiceNumber.trim() ? ` (Factura ${draft.invoiceNumber.trim()})` : ''} • ${totalUnits} uds ingresadas`);
      setStep('done');
      onOrderSaved?.();
    } finally {
      setIsSaving(false);
    }
  };

  if (step === 'header') {
    return <SupplierInvoiceHeaderStep suppliers={suppliers} draft={draft} onChangeDraft={setDraft} onCreateSupplier={addSupplier} onAccept={(resolved) => { setDraft(resolved); setStep('products'); }} />;
  }
  if (step === 'products') {
    return <SupplierInvoiceProductsStep draft={draft} products={products} items={items} onChangeItems={setItems} onBackToHeader={() => setStep('header')} onSaveOrderAndInventory={handleSave} isSaving={isSaving} />;
  }

  return (
    <div className="bg-white rounded-3xl border border-emerald-200 shadow-clay p-8 text-center space-y-4">
      <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
      <h3 className="font-bubble font-bold text-xl text-slate-900">Factura y Productos Ingresados</h3>
      <p className="text-xs sm:text-sm text-slate-600">{savedSummary}</p>
      <div className="flex flex-wrap justify-center gap-2.5 pt-2">
        <button type="button" onClick={() => { setDraft(createEmptyDraft()); setItems([]); setStep('header'); }} className="px-4 py-2.5 rounded-2xl bg-purple-700 text-white font-bubble text-xs font-bold cursor-pointer">Ingresar Otra Factura</button>
        <button type="button" onClick={onGoToOrders} className="px-4 py-2.5 rounded-2xl bg-amber-500 text-white font-bubble text-xs font-bold cursor-pointer">Ver Pedidos a Proveedores</button>
      </div>
    </div>
  );
};
