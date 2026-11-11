import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, Calendar, Clock, ArrowLeft, LogOut, ShieldCheck, CheckCircle2, Save
} from 'lucide-react';
import { AppRoute, AdminTabType, AuthUser } from '../../types';
import { playBubblePopSound, playWaterDropSound } from '../../utils/soundEffects';

interface AdminAccountViewProps {
  currentUser: AuthUser;
  onNavigate: (route: AppRoute, targetTab?: AdminTabType) => void;
  updateCurrentUserData: (updates: Partial<AuthUser>) => void;
  logoutUser: () => void;
}

const DEFAULT_ADMIN_CREATED_AT = '2026-10-30T10:00:00-06:00';

const formatAdminCreationParts = (dateStr?: string) => {
  const raw = dateStr || DEFAULT_ADMIN_CREATED_AT;
  const d = new Date(raw);
  if (isNaN(d.getTime())) {
    return { day: 'Viernes', date: '30 de octubre de 2026', time: '10:00 a. m.' };
  }
  const dayRaw = d.toLocaleDateString('es-CR', { weekday: 'long' });
  const day = dayRaw.charAt(0).toUpperCase() + dayRaw.slice(1);
  const date = d.toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric' });
  const time = d.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit', hour12: true });
  return { day, date, time };
};

export const AdminAccountView: React.FC<AdminAccountViewProps> = ({
  currentUser,
  onNavigate,
  updateCurrentUserData,
  logoutUser,
}) => {
  const fallbackEmail = currentUser.name?.toUpperCase().includes('SUPER')
    ? 'superadmin@byfio.com'
    : 'fio@byfiocr.com';

  const [email, setEmail] = useState(currentUser.email || fallbackEmail);
  const [phone, setPhone] = useState(currentUser.phone || '6400-4640');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setEmail(currentUser.email || fallbackEmail);
    setPhone(currentUser.phone || '6400-4640');
  }, [currentUser, fallbackEmail]);

  const creation = formatAdminCreationParts(currentUser.createdAt);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    playBubblePopSound(0.4);
    updateCurrentUserData({
      email: email.trim(),
      phone: phone.trim(),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5 pb-12 animate-fadeIn">
      {/* Navegación superior */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={() => {
            playWaterDropSound();
            onNavigate('admin', 'hub');
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white hover:bg-pink-50 text-slate-700 hover:text-fio-pink border border-slate-200/90 shadow-2xs font-bubble font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-fio-pink" />
          <span>Volver al Panel Admin</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playBubblePopSound(0.3);
            logoutUser();
            onNavigate('home');
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bubble font-bold transition-all active:scale-95 cursor-pointer"
          title="Cerrar sesión de mi cuenta"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      {/* Hero del Administrador */}
      <div className="p-5 sm:p-7 rounded-[32px] bg-gradient-to-r from-purple-100/90 via-pink-100/70 to-purple-50 border border-white/90 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-purple-600 via-pink-500 to-fio-pink text-white flex items-center justify-center font-bubble font-black text-2xl sm:text-3xl shadow-clayBtn shrink-0">
              {(currentUser.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-bubble font-black text-xl sm:text-2xl text-slate-900 truncate">
                  {currentUser.name}
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-fio-pink text-white text-[11px] font-bold tracking-wider uppercase shadow-2xs">
                  Administradora
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-fio-pink shrink-0" />
                <span className="truncate">{email || 'Sin correo registrado'}</span>
              </p>
              <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-fio-purple shrink-0" />
                <span>{phone || 'Sin teléfono registrado'}</span>
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/80 border border-purple-100 text-xs font-bold text-fio-purple self-start sm:self-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-fio-pink" />
            <span>Cuenta Verificada</span>
          </div>
        </div>
      </div>

      {/* Fecha de Creación de la Cuenta: Día, Fecha y Hora */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-fio-pink" />
            <span>Día de Creación</span>
          </span>
          <p className="font-bubble font-bold text-sm text-slate-900">{creation.day}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-600" />
            <span>Fecha de Creación</span>
          </span>
          <p className="font-bubble font-bold text-sm text-slate-900">{creation.date}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-fio-purple" />
            <span>Hora de Creación</span>
          </span>
          <p className="font-bubble font-bold text-sm text-slate-900 uppercase">{creation.time}</p>
        </div>
      </div>

      {/* Datos de Contacto (Correo Electrónico y Teléfono) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-fio-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="font-bubble font-bold text-base text-slate-800 flex items-center gap-2">
            <User className="w-4 h-4 text-fio-pink" />
            <span>Datos de Contacto</span>
          </h2>
          <span className="text-[11px] text-slate-400">Cuenta de Administración</span>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Correo Electrónico:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="fio@byfiocr.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-fio-400 focus:outline-none bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Teléfono / WhatsApp:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej: 6400-4640"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-fio-400 focus:outline-none bg-slate-50/50"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            {isSaved ? (
              <span className="text-xs font-bubble font-bold text-emerald-600 flex items-center gap-1 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>¡Datos de contacto guardados!</span>
              </span>
            ) : (
              <span className="text-[10px] text-slate-400">
                Información de contacto oficial de la cuenta administradora
              </span>
            )}

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-fio-pink hover:from-purple-700 hover:to-pink-600 text-white font-bubble font-bold text-xs shadow-clayBtn active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
