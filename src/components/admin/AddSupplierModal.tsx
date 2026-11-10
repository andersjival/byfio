import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Supplier } from '../../types';
import {
  X, Truck, Phone, MessageCircle, Mail, MapPin, FileText, CheckCircle2, UserPlus
} from 'lucide-react';
import { playBubblePopSound } from '../../utils/soundEffects';

interface AddSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSupplierCreated?: (newSupplier: Supplier) => void;
}

export const AddSupplierModal: React.FC<AddSupplierModalProps> = ({
  isOpen,
  onClose,
  onSupplierCreated,
}) => {
  const { addSupplier } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (sameAsPhone) {
      setWhatsappPhone(val);
    }
  };

  const handleSameAsPhoneToggle = (checked: boolean) => {
    setSameAsPhone(checked);
    if (checked) {
      setWhatsappPhone(phone);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const finalWhatsApp = sameAsPhone ? cleanPhone : whatsappPhone.trim();

    if (!cleanName) {
      setErrorMsg('Por favor ingresa el nombre del proveedor.');
      return;
    }

    if (!cleanPhone && !finalWhatsApp) {
      setErrorMsg('Por favor ingresa al menos un número telefónico o de WhatsApp.');
      return;
    }

    playBubblePopSound(0.4);

    const created = addSupplier({
      name: cleanName,
      phone: cleanPhone || finalWhatsApp,
      whatsappPhone: finalWhatsApp || cleanPhone,
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    if (onSupplierCreated) {
      onSupplierCreated(created);
    }

    // Limpiar formulario y cerrar
    setName('');
    setPhone('');
    setWhatsappPhone('');
    setEmail('');
    setAddress('');
    setNotes('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-emerald-300 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
      >
        {/* Cabecera del Modal */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold shadow-inner">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bubble font-bold text-base sm:text-lg leading-tight">
                Registrar Nuevo Proveedor
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                Datos de contacto para pedidos automáticos por WhatsApp y órdenes de compra
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-slate-800">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bubble font-bold animate-fadeIn">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Nombre del Proveedor */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Nombre del Proveedor / Empresa <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Papelera Internacional o Sublimaciones CR"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            />
          </div>

          {/* Teléfono y WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Teléfono de Contacto <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="Ej: 2222-1111"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  WhatsApp de Pedidos <span className="text-rose-500">*</span>
                </label>
                <label className="inline-flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsPhone}
                    onChange={(e) => handleSameAsPhoneToggle(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-400"
                  />
                  <span>Mismo</span>
                </label>
              </div>
              <div className="relative">
                <MessageCircle className="w-4 h-4 text-emerald-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="tel"
                  required
                  value={whatsappPhone}
                  onChange={(e) => {
                    setWhatsappPhone(e.target.value);
                    setSameAsPhone(false);
                  }}
                  placeholder="Ej: 64004640"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 -mt-2">
            El número de WhatsApp se utilizará para abrir el chat directo con la lista del pedido ya armada.
          </p>

          {/* Correo Electrónico Opcional */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Correo Electrónico del Proveedor <span className="text-slate-400 font-normal">(Opcional)</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ej: ventas@proveedor.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Dirección Física Opcional */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Dirección del Proveedor <span className="text-slate-400 font-normal">(Opcional)</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ej: San José, Tibás centro, 200m este de la iglesia"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Notas / Contacto Opcional */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Notas Adicionales / Persona de Contacto <span className="text-slate-400 font-normal">(Opcional)</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Contactar a doña Martha. Descuento del 10% por pago de contado..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            />
          </div>

          {/* Footer de Acciones */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl neu-btn text-slate-700 font-bubble font-bold text-xs cursor-pointer hover:bg-slate-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bubble font-bold text-xs shadow-clayBtn transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Guardar Proveedor</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
