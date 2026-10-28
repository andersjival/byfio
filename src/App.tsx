import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { FloatingMascot } from './components/common/FloatingMascot';
import { HeroDual } from './components/store/HeroDual';
import { WorkshopsSection } from './components/store/WorkshopsSection';
import { ProductsSection } from './components/store/ProductsSection';
import { CartDrawer } from './components/store/CartDrawer';
import { CheckoutModal } from './components/store/CheckoutModal';
import { AdminHeader } from './components/admin/AdminHeader';
import { OrdersQueue } from './components/admin/OrdersQueue';
import { InventoryTable } from './components/admin/InventoryTable';
import { GuidedPickingModal } from './components/admin/GuidedPickingModal';
import { SupplierOrderModal } from './components/admin/SupplierOrderModal';
import { QrLabelModal } from './components/admin/QrLabelModal';
import { InvoiceModal } from './components/admin/InvoiceModal';
import { NewProductModal } from './components/admin/NewProductModal';

export const App: React.FC = () => {
  const { viewMode } = useApp();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const scrollToWorkshops = () => {
    document.getElementById('workshops-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProducts = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF5FF] flex flex-col justify-between selection:bg-fio-300 selection:text-fio-900">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {viewMode === 'store' ? (
            <>
              <HeroDual
                onScrollToWorkshops={scrollToWorkshops}
                onScrollToProducts={scrollToProducts}
              />
              <WorkshopsSection />
              <ProductsSection />
            </>
          ) : (
            <>
              <AdminHeader />
              <OrdersQueue />
              <InventoryTable />
            </>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-fio-200 bg-white/70 py-8 text-center text-xs text-gray-500">
        <p className="font-bubble font-semibold text-fio-900 mb-1">
          by.fio — Talleres Creativos & Tienda Online | Costa Rica
        </p>
        <p className="text-gray-400">
          WhatsApp 6400-4640 • Instagram @by_fio10 • San José, Costa Rica 🇨🇷
        </p>
      </footer>

      {/* Modales y Elementos Flotantes Globales */}
      <FloatingMascot />
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      <GuidedPickingModal />
      <SupplierOrderModal />
      <QrLabelModal />
      <InvoiceModal />
      <NewProductModal />
    </div>
  );
};

export default App;
