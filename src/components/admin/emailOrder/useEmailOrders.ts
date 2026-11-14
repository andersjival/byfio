import { useState, useEffect, useCallback } from 'react';
import { IncomingEmailOrder } from '../../../types';
import { useApp } from '../../../context/AppContext';
import { parseXmlInvoice, generateSampleXmlInvoice } from '../../../utils/xmlInvoiceParser';

const STORAGE_KEY = 'byfio_pending_email_order';

export const useEmailOrders = () => {
  const { addSupplierOrder, addInventoryAdjustment, currentUser, products } = useApp();
  const [pendingOrder, setPendingOrder] = useState<IncomingEmailOrder | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showAlertBanner, setShowAlertBanner] = useState(false);

  useEffect(() => {
    try {
      if (pendingOrder) localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingOrder));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, [pendingOrder]);

  useEffect(() => {
    fetch('/api/email-orders')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.pendingOrders && Array.isArray(data.pendingOrders) && data.pendingOrders.length > 0) {
          setPendingOrder(data.pendingOrders[0]);
          setShowAlertBanner(true);
        }
      }).catch(() => {});
  }, []);

  const simulateEmailOrder = useCallback(() => {
    const sampleXml = generateSampleXmlInvoice();
    const parsed = parseXmlInvoice(sampleXml, {
      from: 'facturacion@distribuidorafiore.cr',
      subject: 'Factura Electrónica Compra Insumos By.Fio #00100001010000009842',
    });
    setPendingOrder({
      id: `email-ord-${Date.now()}`,
      emailFrom: parsed.emailFrom || 'ingresarpedido@byfiocr.com',
      emailSubject: parsed.emailSubject || 'Factura Electrónica Insumos',
      receivedAt: new Date().toISOString(),
      xmlRaw: sampleXml,
      supplierName: parsed.supplierName || 'Distribuidora Fio Express S.A.',
      supplierLegalId: parsed.supplierLegalId || '3101889922',
      supplierPhone: parsed.supplierPhone || '8888-7766',
      supplierEmail: parsed.supplierEmail || 'ventas@proveedorexpress.cr',
      invoiceNumber: parsed.invoiceNumber || '00100001010000009842',
      entryDate: parsed.entryDate || new Date().toISOString().slice(0, 10),
      subtotalAmount: parsed.subtotalAmount || 180500,
      taxAmount: parsed.taxAmount || 23465,
      discountAmount: parsed.discountAmount || 0,
      totalCost: parsed.totalCost || 203965,
      items: parsed.items || [],
      status: 'pending',
    });
    setShowAlertBanner(true);
  }, []);

  const importXmlOrder = useCallback((xmlText: string) => {
    const parsed = parseXmlInvoice(xmlText, {
      from: 'correo-proveedor@byfiocr.com',
      subject: 'Factura Electrónica Importada XML',
    });
    setPendingOrder({
      id: `email-ord-${Date.now()}`,
      emailFrom: parsed.emailFrom || 'ingresarpedido@byfiocr.com',
      emailSubject: parsed.emailSubject || 'Factura Electrónica XML',
      receivedAt: new Date().toISOString(),
      xmlRaw: xmlText,
      supplierName: parsed.supplierName || 'Proveedor Factura Electrónica',
      supplierLegalId: parsed.supplierLegalId || '',
      supplierPhone: parsed.supplierPhone || '',
      supplierEmail: parsed.supplierEmail || '',
      invoiceNumber: parsed.invoiceNumber || `FAC-${Date.now().toString().slice(-6)}`,
      entryDate: parsed.entryDate || new Date().toISOString().slice(0, 10),
      subtotalAmount: parsed.subtotalAmount || 0,
      taxAmount: parsed.taxAmount || 0,
      discountAmount: parsed.discountAmount || 0,
      totalCost: parsed.totalCost || 0,
      items: parsed.items || [],
      status: 'pending',
    });
    setShowAlertBanner(true);
  }, []);

  const loadOrderToSystem = useCallback(async () => {
    if (!pendingOrder || isLoading) return;
    setIsLoading(true);
    try {
      const nowIso = new Date().toISOString();
      const userName = currentUser?.name || 'Administración';
      const totalUnits = pendingOrder.items.reduce((s, it) => s + it.orderQty, 0);

      addSupplierOrder({
        orderNumber: pendingOrder.invoiceNumber || `ING-${Date.now()}`,
        orderType: 'invoice', invoiceNumber: pendingOrder.invoiceNumber, entryDate: pendingOrder.entryDate,
        supplierName: pendingOrder.supplierName, supplierLegalId: pendingOrder.supplierLegalId,
        supplierPhone: pendingOrder.supplierPhone, supplierEmail: pendingOrder.supplierEmail,
        subtotalAmount: pendingOrder.subtotalAmount, taxAmount: pendingOrder.taxAmount, discountAmount: pendingOrder.discountAmount,
        status: 'received', receivedAt: nowIso, loadedAt: nowIso, loadedBy: userName, source: 'email',
        items: pendingOrder.items, totalUnits, totalCost: pendingOrder.totalCost,
        notes: `Factura Electrónica XML vía ingresarpedido@byfiocr.com • Ingresado por ${userName}`,
      });

      await addInventoryAdjustment({
        shelfName: 'Ingreso Proveedor (Correo XML)', performedBy: userName, userRole: currentUser?.role,
        totalItemsCounted: pendingOrder.items.length, totalDifferences: pendingOrder.items.length,
        netDifferenceUnits: totalUnits, notes: `Factura XML Proveedor ${pendingOrder.supplierName} #${pendingOrder.invoiceNumber}`,
        items: pendingOrder.items.map((it) => {
          const existing = products.find((p) => p.sku === it.sku || p.name.toLowerCase() === it.name.toLowerCase());
          const curStock = existing ? Number(existing.stock || 0) : it.currentStock;
          return {
            productId: existing?.id || '', sku: it.sku, name: it.name, category: it.category || 'Insumos',
            shelfLocation: existing?.shelfLocation || 'Bodega Principal', previousStock: curStock,
            countedStock: curStock + it.orderQty, difference: it.orderQty, reason: `Ingreso Correo XML (${pendingOrder.supplierName})`,
          };
        }),
      });

      setPendingOrder(null);
      setShowAlertBanner(false);
      localStorage.removeItem(STORAGE_KEY);
      fetch('/api/email-orders', { method: 'POST', body: JSON.stringify({ pendingOrders: [] }) }).catch(() => {});
    } finally {
      setIsLoading(false);
    }
  }, [pendingOrder, isLoading, currentUser, products, addSupplierOrder, addInventoryAdjustment]);

  return {
    pendingOrder, showAlertBanner, setShowAlertBanner, isLoading,
    simulateEmailOrder, importXmlOrder, loadOrderToSystem,
    dismissPendingOrder: () => { setPendingOrder(null); setShowAlertBanner(false); },
  };
};
