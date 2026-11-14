import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useEmailOrders } from './emailOrder/useEmailOrders';
import { EmailOrderExplainer } from './emailOrder/EmailOrderExplainer';
import { EmailOrderAlertBanner } from './emailOrder/EmailOrderAlertBanner';
import { EmailOrderFichaView } from './emailOrder/EmailOrderFichaView';
import { EmailOrderHistoryView } from './emailOrder/EmailOrderHistoryView';
import { SupplierManualIntakeStep } from './SupplierManualIntakeStep';
import { ArrowLeft, Mail, FileText, History, Sparkles } from 'lucide-react';

interface SupplierInvoiceIntakeViewProps {
  onBackToMenu: () => void;
  onGoToOrders: () => void;
}

export const SupplierInvoiceIntakeView: React.FC<SupplierInvoiceIntakeViewProps> = ({ onBackToMenu, onGoToOrders }) => {
  const { supplierOrders } = useApp();
  const [activeTab, setActiveTab] = useState<'email' | 'manual' | 'history'>('email');
  const { pendingOrder, showAlertBanner, setShowAlertBanner, isLoading, simulateEmailOrder, importXmlOrder, loadOrderToSystem, dismissPendingOrder } = useEmailOrders();

  const handleLoadSuccess = async () => {
    await loadOrderToSystem();
    setActiveTab('history');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 animate-fadeIn pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl border border-slate-200 shadow-2xs p-3.5 sm:px-5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 to-fio-pink text-white flex items-center justify-center shadow-sm">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bubble font-black text-lg sm:text-xl text-slate-900 leading-tight">Ingresar Pedido de Proveedor</h2>
            <p className="text-[11px] text-slate-500">Recepción automática vía Cloudflare Worker (XML) y registro directo al inventario</p>
          </div>
        </div>
        <button type="button" onClick={onBackToMenu} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bubble text-xs font-bold cursor-pointer transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a Proveedores</span>
        </button>
      </div>

      {showAlertBanner && pendingOrder && (
        <EmailOrderAlertBanner order={pendingOrder} onAccept={() => { setActiveTab('email'); setShowAlertBanner(false); }} onDismiss={() => setShowAlertBanner(false)} />
      )}

      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
        <button type="button" onClick={() => setActiveTab('email')} className={`flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bubble text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === 'email' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'}`}>
          <Sparkles className="w-4 h-4" />
          <span>Ingresar Pedido por Correo</span>
          {pendingOrder && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
        </button>
        <button type="button" onClick={() => setActiveTab('manual')} className={`flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bubble text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === 'manual' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'}`}>
          <FileText className="w-4 h-4" />
          <span>Factura Manual</span>
        </button>
        <button type="button" onClick={() => setActiveTab('history')} className={`flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bubble text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === 'history' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'}`}>
          <History className="w-4 h-4" />
          <span>Historial de Cargas</span>
        </button>
      </div>

      {activeTab === 'email' && (
        <div className="space-y-4">
          <EmailOrderExplainer onSimulateEmail={simulateEmailOrder} onUploadXml={importXmlOrder} />
          {pendingOrder ? (
            <EmailOrderFichaView order={pendingOrder} onLoadToSystem={handleLoadSuccess} isLoading={isLoading} onDiscard={dismissPendingOrder} />
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto"><Mail className="w-6 h-6" /></div>
              <h4 className="font-bubble font-bold text-base text-slate-800">Bandeja de Correo Lista para Recibir Facturas</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">Envía tus XML de factura electrónica a <strong className="text-purple-700">ipedidos@byfiocr.com</strong> o pulsa "Simular Correo" para probar la extracción automática.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'manual' && <SupplierManualIntakeStep onGoToOrders={onGoToOrders} onOrderSaved={() => setActiveTab('history')} />}
      {activeTab === 'history' && <EmailOrderHistoryView orders={supplierOrders} />}
    </div>
  );
};
