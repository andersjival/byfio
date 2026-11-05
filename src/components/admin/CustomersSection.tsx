import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useConfirm } from '../../context/ConfirmContext';
import { Customer } from '../../types';
import {
  Users, UserPlus, Search, Phone, Mail, MapPin, FileText, Edit2,
  Trash2, X, Check, ShoppingBag, MessageCircle, CreditCard,
  Calendar, CheckCircle2, AlertCircle, Sparkles, Building2
} from 'lucide-react';
import { formatShortDate } from '../../utils/formatters';

interface CustomersSectionProps {
  onSelectCustomerForBilling?: (customer: Customer) => void;
}

export const CustomersSection: React.FC<CustomersSectionProps> = ({ onSelectCustomerForBilling }) => {
  const confirm = useConfirm();
  const {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    customerFieldDefs,
    orders,
    isFeatureEnabled,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [cedula, setCedula] = useState('');
  const [notes, setNotes] = useState('');
  const [customFieldValues, setCustomFieldValues] = useState<{ [id: string]: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filtrado reactivo en tiempo real
  const filteredCustomers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => {
      const matchName = c.name.toLowerCase().includes(q);
      const matchPhone = c.phone.toLowerCase().includes(q);
      const matchEmail = (c.email || '').toLowerCase().includes(q);
      const matchAddress = (c.address || '').toLowerCase().includes(q);
      const matchCedula = (c.customFields?.['field-cedula'] || '').toLowerCase().includes(q);
      const matchNotes = (c.notes || '').toLowerCase().includes(q);
      return matchName || matchPhone || matchEmail || matchAddress || matchCedula || matchNotes;
    });
  }, [customers, searchTerm]);

  const handleOpenCreate = () => {
    setEditingCustomer(null);
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setCedula('');
    setNotes('');
    setCustomFieldValues({});
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setName(customer.name);
    setPhone(customer.phone);
    setEmail(customer.email || '');
    setAddress(customer.address || '');
    setCedula(customer.customFields?.['field-cedula'] || '');
    setNotes(customer.notes || '');
    setCustomFieldValues(customer.customFields ? { ...customer.customFields } : {});
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setFormError('Por favor ingresa el nombre completo del cliente.');
      return;
    }
    if (!cleanPhone) {
      setFormError('Por favor ingresa un número de teléfono o WhatsApp de contacto.');
      return;
    }

    const mergedCustomFields: { [id: string]: string } = {
      ...customFieldValues,
    };
    if (cedula.trim()) {
      mergedCustomFields['field-cedula'] = cedula.trim();
    }

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        name: cleanName,
        phone: cleanPhone,
        email: email.trim() || undefined,
        address: address.trim() || undefined,
        notes: notes.trim() || undefined,
        customFields: Object.keys(mergedCustomFields).length > 0 ? mergedCustomFields : undefined,
      });
      setSuccessToast(`Cliente "${cleanName}" actualizado con éxito.`);
    } else {
      addCustomer({
        name: cleanName,
        phone: cleanPhone,
        email: email.trim() || undefined,
        address: address.trim() || undefined,
        notes: notes.trim() || undefined,
        customFields: Object.keys(mergedCustomFields).length > 0 ? mergedCustomFields : undefined,
      });
      setSuccessToast(`¡Cliente "${cleanName}" guardado con éxito para futuros pedidos!`);
    }

    setIsModalOpen(false);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    if (await confirm(`¿Seguro que deseas eliminar a "${customer.name}" del directorio de clientes?`, { title: 'Eliminar Cliente', confirmLabel: 'Eliminar' })) {
      deleteCustomer(customer.id);
      setSuccessToast(`Cliente "${customer.name}" eliminado del directorio.`);
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  // Cantidad de pedidos históricos de un cliente
  const getOrderCount = (customer: Customer) => {
    const cleanP = customer.phone.replace(/\D/g, '');
    const cleanN = customer.name.toLowerCase().trim();
    return orders.filter((o) => {
      const oP = (o.customerPhone || '').replace(/\D/g, '');
      const oN = (o.customerName || '').toLowerCase().trim();
      return (cleanP && oP === cleanP) || (cleanN && oN === cleanN);
    }).length;
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Toast Flotante */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center gap-2.5 font-bubble font-bold text-xs animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Encabezado Principal del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#F1F2F6] border border-white/80 shadow-neuCard">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bubble font-bold text-lg sm:text-xl text-slate-900 leading-tight">
                Directorio de Clientes Registrados
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shadow-2xs">
                {customers.length} clientes
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Crea y administra la base de datos de clientes con cédula, teléfono y dirección para generar pedidos futuros en 1 clic.
            </p>
          </div>
        </div>

        {isFeatureEnabled('customers', 'customers_create') && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bubble font-bold text-xs sm:text-sm shadow-neuBtnHover active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Registrar Nuevo Cliente</span>
          </button>
        )}
      </div>

      {/* Barra de Búsqueda Rápida */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar cliente por nombre, cédula, teléfono, correo o dirección de entrega..."
          className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#ECEEF2] border border-white/80 text-xs sm:text-sm font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-neuInset transition-all"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Grid de Tarjetas de Clientes */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl bg-[#F1F2F6] border border-dashed border-slate-300">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className="font-bubble font-bold text-base text-slate-700">
            {searchTerm ? 'No se encontraron clientes con ese criterio' : 'Aún no hay clientes registrados'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {searchTerm
              ? 'Prueba con otro nombre, número telefónico o cédula.'
              : 'Haz clic en "Registrar Nuevo Cliente" para guardar el primer contacto y reutilizarlo en futuras ventas.'}
          </p>
          {!searchTerm && isFeatureEnabled('customers', 'customers_create') && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bubble font-bold text-xs hover:bg-emerald-700 transition-all cursor-pointer shadow-md"
            >
              + Agregar Primer Cliente
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((cust) => {
            const orderCount = getOrderCount(cust);
            const cedulaVal = cust.customFields?.['field-cedula'];
            const phoneClean = cust.phone.replace(/\D/g, '');

            return (
              <div
                key={cust.id}
                className="rounded-3xl p-5 bg-[#F1F2F6] border border-white/90 shadow-neuCard hover:shadow-neuCardHover transition-all flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  {/* Fila Superior: Avatar + Nombre + Pedidos */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200/60">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-fio-purple to-fio-pink text-white font-bubble font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                        {getInitials(cust.name)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 truncate" title={cust.name}>
                          {cust.name}
                        </h3>
                        {cedulaVal && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-slate-500 bg-white/70 px-2 py-0.5 rounded-lg border border-slate-200 mt-0.5">
                            <CreditCard className="w-2.5 h-2.5 text-slate-400" />
                            <span>Céd: {cedulaVal}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200 shrink-0"
                      title="Pedidos asociados en el sistema"
                    >
                      {orderCount} pedido(s)
                    </span>
                  </div>

                  {/* Datos de Contacto y Envío */}
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-bold font-mono text-slate-900">{cust.phone}</span>
                      {phoneClean && (
                        <a
                          href={`https://wa.me/506${phoneClean}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[10px] font-bold transition-colors"
                          title="Escribir por WhatsApp"
                        >
                          <MessageCircle className="w-3 h-3 text-emerald-600" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>

                    {cust.email && (
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-fio-purple shrink-0" />
                        <span className="truncate">{cust.email}</span>
                      </div>
                    )}

                    {cust.address && (
                      <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-fio-pink shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-relaxed">{cust.address}</span>
                      </div>
                    )}

                    {cust.notes && (
                      <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 mt-1">
                        <p className="font-bold flex items-center gap-1 text-[10px] uppercase text-amber-800">
                          <span>📌 Notas del Cliente:</span>
                        </p>
                        <p className="mt-0.5 text-amber-950 font-sans italic">{cust.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones al Pie */}
                <div className="pt-3.5 mt-3.5 border-t border-slate-200/60 flex items-center justify-between gap-2">
                  {onSelectCustomerForBilling && isFeatureEnabled('customers', 'customers_quick_order') && (
                    <button
                      type="button"
                      onClick={() => onSelectCustomerForBilling(cust)}
                      className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bubble font-bold text-xs flex items-center justify-center gap-1.5 shadow-neuBtnHover transition-all cursor-pointer"
                      title="Abrir facturación rápida con los datos de este cliente cargados"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-fio-yellow" />
                      <span>Facturar / Crear Pedido &rarr;</span>
                    </button>
                  )}

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(cust)}
                      className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-fio-purple border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                      title="Editar ficha del cliente"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCustomer(cust)}
                      className="p-2 rounded-xl bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                      title="Eliminar cliente del sistema"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Registro / Edición de Cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-fio-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]">
            {/* Header Modal */}
            <div className="px-5 py-3.5 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bubble font-bold text-base leading-tight">
                    {editingCustomer ? 'Editar Ficha de Cliente' : 'Registrar Nuevo Cliente'}
                  </h3>
                  <p className="text-[11px] text-emerald-100 font-sans">
                    Quedará guardado en el sistema para futuros pedidos y facturación.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario con scroll independiente y footer fijo */}
            <form onSubmit={handleSaveCustomer} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-5 space-y-3 sm:space-y-3.5 overflow-y-auto flex-1">
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bubble font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Nombre Completo */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre Completo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Mariela Chaves Quesada"
                    className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                {/* Teléfono y Cédula */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Teléfono / WhatsApp <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej: 8899-7711"
                      className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Cédula / Identificación
                    </label>
                    <input
                      type="text"
                      value={cedula}
                      onChange={(e) => setCedula(e.target.value)}
                      placeholder="Ej: 1-1244-0899"
                      className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>

                {/* Correo Electrónico */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Correo Electrónico (opcional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                {/* Dirección de Entrega */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dirección de Entrega / Envío (opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Provincia, cantón, distrito y señas exactas..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                  />
                </div>

                {/* Notas del Cliente */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Notas / Observaciones de Pedidos (opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Preferencias de productos, detalles de entrega, etc..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                  />
                </div>
              </div>

              {/* Botones del Modal Fijos en Footer */}
              <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 sm:py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bubble font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bubble font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>{editingCustomer ? 'Guardar Cambios' : 'Guardar Cliente'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
