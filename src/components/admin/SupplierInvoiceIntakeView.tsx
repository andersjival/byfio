import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SupplierOrderItem } from '../../types';
import { SupplierInvoiceHeaderStep, SupplierInvoiceDraft } from './SupplierInvoiceHeaderStep';
import { SupplierInvoiceProductsStep } from './SupplierInvoiceProductsStep';
import { ArrowLeft, CheckCircle2, Receipt } from 'lucide-react';

interface SupplierInvoiceIntakeViewProps {
  onBackToMenu: () => void;
  onGoToOrders: () => void;
}

const getTodayLocalDate = (): string => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
};

const createEmptyDraft = (): SupplierInvoiceDraft => ({
  supplierId: '',
  supplierName: '',
  supplierLegalId: '',
  supplierPhone: '',
  supplierEmail: '',
  orderNumber: '',
  invoiceNumber: '',
  entryDate: getTodayLocalDate(),
  invoiceAmount: '',
  discountAmount: '',
  taxAmount: '',
  subtotalAmount: '',
  otherAmount: '',
  totalGeneral: '',
  totalEditedManually: false,
});

const parseMoney = (val: string) => {
  const n = parseFloat(val);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export const SupplierInvoiceIntakeView: React.FC<SupplierInvoiceIntakeViewProps> = ({
  onBackToMenu,
  onGoToOrders,
}) => {
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
      const entryIso = draft.entryDate ? `${draft.entryDate}T12:00:00.000Z` : new Date().toISOString();

      addSupplierOrder({
        orderNumber: orderNum,
        orderType: 'invoice',
        invoiceNumber: draft.invoiceNumber.trim() || undefined,
        entryDate: draft.entryDate,
        supplierId: draft.supplierId || undefined,
        supplierName: draft.supplierName.trim(),
        supplierLegalId: draft.supplierLegalId.trim() || undefined,
        supplierPhone: draft.supplierPhone.trim() || undefined,
        supplierEmail: draft.supplierEmail.trim() || undefined,
        invoiceAmount: parseMoney(draft.invoiceAmount) || undefined,
        discountAmount: parseMoney(draft.discountAmount) || undefined,
        taxAmount: parseMoney(draft.taxAmount) || undefined,
        subtotalAmount: parseMoney(draft.subtotalAmount) || undefined,
        otherAmount: parseMoney(draft.otherAmount) || undefined,
        status: 'received',
        receivedAt: entryIso,
        items,
        totalUnits,
        totalCost: totalGeneralVal,
        notes: [
          draft.invoiceNumber.trim() ? `Factura #${draft.invoiceNumber.trim()}` : '',
          `Fecha ingreso: ${draft.entryDate}`,
        ].filter(Boolean).join(' • '),
      });

      await addInventoryAdjustment({
        shelfName: 'Ingreso Proveedor',
        performedBy: currentUser?.name || 'Administración',
        userRole: currentUser?.role,
        totalItemsCounted: items.length,
        totalDifferences: items.length,
        netDifferenceUnits: totalUnits,
        notes: `Factura Proveedor ${draft.supplierName.trim()}${draft.invoiceNumber.trim() ? ` #${draft.invoiceNumber.trim()}` : ''}`,
        items: items.map((it) => ({
          productId: it.productId || '',
          sku: it.sku,
          name: it.name,
          category: it.category,
          shelfLocation: it.shelfLocation || 'Sin estante',
          previousStock: it.currentStock,
          countedStock: it.currentStock + it.orderQty,
          difference: it.orderQty,
          reason: 'Ingreso Factura Proveedor',
        })),
      });

      setSavedSummary(`${draft.supplierName} • ${orderNum}${draft.invoiceNumber.trim() ? ` (Factura ${draft.invoiceNumber.trim()})` : ''} • ${totalUnits} uds ingresadas`);
      setStep('done');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-3xl border border-slate-200 shadow-2xs p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 to-fio-pink text-white flex items-center justify-center shadow-md">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bubble font-bold text-lg sm:text-xl text-fio-900">Ingresar Pedido / Factura de Proveedor</h2>
            <p className="text-xs text-slate-500">Paso {step === 'header' ? '1 de 2: Datos del Proveedor y Factura' : step === 'products' ? '2 de 2: Ingresar Productos al Inventario' : 'Completado'}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onBackToMenu}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bubble text-xs font-bold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Proveedores</span>
        </button>
      </div>

      {step === 'header' && (
        <SupplierInvoiceHeaderStep
          suppliers={suppliers}
          draft={draft}
          onChangeDraft={setDraft}
          onCreateSupplier={addSupplier}
          onAccept={(resolved) => { setDraft(resolved); setStep('products'); }}
        />
      )}

      {step === 'products' && (
        <SupplierInvoiceProductsStep
          draft={draft}
          products={products}
          items={items}
          onChangeItems={setItems}
          onBackToHeader={() => setStep('header')}
          onSaveOrderAndInventory={handleSave}
          isSaving={isSaving}
        />
      )}

      {step === 'done' && (
        <div className="bg-white rounded-3xl border border-emerald-200 shadow-clay p-8 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="font-bubble font-bold text-xl text-slate-900">Factura y Productos Ingresados</h3>
          <p className="text-xs sm:text-sm text-slate-600">{savedSummary}</p>
          <div className="flex flex-wrap justify-center gap-2.5 pt-2">
            <button type="button" onClick={() => { setDraft(createEmptyDraft()); setItems([]); setStep('header'); }} className="px-4 py-2.5 rounded-2xl bg-purple-700 text-white font-bubble text-xs font-bold cursor-pointer">Ingresar Otra Factura</button>
            <button type="button" onClick={onGoToOrders} className="px-4 py-2.5 rounded-2xl bg-amber-500 text-white font-bubble text-xs font-bold cursor-pointer">Ver Pedidos a Proveedores</button>
          </div>
        </div>
      )}
    </div>
  );
};
