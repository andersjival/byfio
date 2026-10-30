import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile, UserPermissions } from '../../types';
import {
  Users, Plus, KeyRound, Shield, Check, X, Edit3, Trash2,
  CheckCircle2, AlertCircle, Copy, Eye, EyeOff, Sparkles,
  QrCode, Receipt, Boxes, Landmark, GraduationCap, Tag, UserCheck
} from 'lucide-react';

export const UserProfilesSection: React.FC = () => {
  const { userProfiles, addUserProfile, updateUserProfile, deleteUserProfile, toggleUserProfileStatus } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [note, setNote] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [permissions, setPermissions] = useState<UserPermissions>({
    orders: true,
    billing: false,
    inventory: false,
    reports: false,
    workshops: false,
    pricing: false,
    users: false,
  });

  const [revealedPins, setRevealedPins] = useState<{ [id: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const togglePinReveal = (id: string) => {
    setRevealedPins((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyPin = (id: string, pinCode: string) => {
    navigator.clipboard.writeText(pinCode).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleOpenCreate = () => {
    setEditingProfileId(null);
    setName('');
    // Generar un PIN aleatorio de 4 dígitos por defecto
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    setPin(randomPin);
    setNote('');
    setIsActive(true);
    setPermissions({
      orders: true,
      billing: false,
      inventory: false,
      reports: false,
      workshops: false,
      pricing: false,
      users: false,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (profile: UserProfile) => {
    setEditingProfileId(profile.id);
    setName(profile.name.toUpperCase());
    setPin(profile.pin);
    setNote(profile.note || '');
    setIsActive(profile.isActive);
    setPermissions({ ...profile.permissions });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleToggleAllPermissions = (grantAll: boolean) => {
    setPermissions({
      orders: grantAll,
      billing: grantAll,
      inventory: grantAll,
      reports: grantAll,
      workshops: grantAll,
      pricing: grantAll,
      users: grantAll,
    });
  };

  const handlePermissionChange = (moduleKey: keyof UserPermissions) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleKey]: !prev[moduleKey],
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim().toUpperCase();
    const cleanPin = pin.trim().replace(/\D/g, '');

    if (!cleanName || cleanName.length < 2) {
      setFormError('Por favor ingresa un nombre descriptivo para el perfil (mínimo 2 letras).');
      return;
    }

    if (cleanPin.length !== 4) {
      setFormError('El código PIN debe tener exactamente 4 dígitos numéricos.');
      return;
    }

    // Verificar si el PIN ya está en uso por otro perfil
    const duplicatePin = userProfiles.find(
      (p) => p.pin === cleanPin && p.id !== editingProfileId
    );
    if (duplicatePin || cleanPin === '7777') {
      setFormError(`El PIN ${cleanPin} ya está reservado o en uso por otro perfil. Ingresa uno diferente.`);
      return;
    }

    const hasAtLeastOne = Object.values(permissions).some((v) => v);
    if (!hasAtLeastOne) {
      setFormError('Debes marcar al menos un módulo o acceso para este perfil.');
      return;
    }

    if (editingProfileId) {
      updateUserProfile(editingProfileId, {
        name: cleanName,
        pin: cleanPin,
        note: note.trim() || undefined,
        isActive,
        permissions,
      });
      setSuccessToast(`Perfil "${cleanName}" actualizado con éxito.`);
    } else {
      addUserProfile({
        name: cleanName,
        pin: cleanPin,
        role: 'staff',
        isActive,
        note: note.trim() || undefined,
        permissions,
      });
      setSuccessToast(`Perfil "${cleanName}" creado con éxito con PIN ${cleanPin}.`);
    }

    setIsModalOpen(false);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleDelete = (profile: UserProfile) => {
    if (window.confirm(`¿Estás seguro de eliminar el perfil "${profile.name}"? Los colaboradores que usen este PIN ya no podrán ingresar.`)) {
      deleteUserProfile(profile.id);
      setSuccessToast(`Perfil "${profile.name}" eliminado.`);
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  const permissionModules: { key: keyof UserPermissions; label: string; desc: string; icon: any }[] = [
    { key: 'orders', label: 'Pedidos & Alisto QR', desc: 'Cola de pedidos, escaneo de picking y empaque', icon: QrCode },
    { key: 'billing', label: 'Facturación Rápida', desc: 'Búsqueda de órdenes y facturas por número', icon: Receipt },
    { key: 'inventory', label: 'Inventario & QR', desc: 'Catálogo de insumos, stock y etiquetas QR', icon: Boxes },
    { key: 'reports', label: 'Caja & Reportería', desc: 'Arqueo diario, balances y cobros del día', icon: Landmark },
    { key: 'workshops', label: 'Talleres & Alumnos', desc: 'Inscripciones, cupos y lista de participantes', icon: GraduationCap },
    { key: 'pricing', label: 'Precios & Stickers', desc: 'Lista oficial y editor de tarifas de stickers', icon: Tag },
    { key: 'users', label: 'Gestión de Perfiles', desc: 'Crear, editar o revocar accesos a otros usuarios', icon: Users },
  ];

  const allChecked = Object.values(permissions).every((v) => v);

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Toast de Éxito Flotante */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center gap-2.5 font-bubble font-bold text-xs animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#F1F2F6] border border-white/90 shadow-neuCard">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#6D28D9] text-white flex items-center justify-center shadow-xs shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bubble font-bold text-lg sm:text-xl text-slate-900 leading-tight">
                Perfiles de Usuarios &amp; Permisos de Acceso
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-fio-purple shadow-2xs">
                {userProfiles.length} perfiles
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Crea perfiles con nombre en <strong>MAYÚSCULAS</strong> y código PIN de 4 dígitos. Asigna módulos con casillas de verificación.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl neu-btn-primary text-white font-bubble font-bold text-xs sm:text-sm shadow-neuBtnHover active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nuevo Perfil</span>
        </button>
      </div>

      {/* Tarjeta Informativa: Acceso con PIN de 4 Dígitos */}
      <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200/80 text-xs text-purple-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-fio-purple shrink-0" />
          <div>
            <span className="font-bubble font-bold text-fio-purple">Acceso Seguro e Inmediato:</span>{' '}
            <span>
              Los colaboradores ingresan desde cualquier celular o PC con su código PIN de 4 dígitos sin contraseñas difíciles.
            </span>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-purple-200 font-mono text-[11px] font-bold text-purple-800 self-start sm:self-auto shrink-0 shadow-2xs">
          <span>Ej: PIN 1001 &rarr; ALISTO DE PEDIDOS</span>
        </div>
      </div>

      {/* Listado de Perfiles en Grid Neumórfico */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userProfiles.map((prof) => {
          const isRevealed = !!revealedPins[prof.id];
          const isCopied = copiedId === prof.id;

          const grantedCount = Object.values(prof.permissions).filter(Boolean).length;
          const totalCount = Object.keys(prof.permissions).length;

          return (
            <div
              key={prof.id}
              className={`rounded-3xl p-5 border transition-all flex flex-col justify-between ${
                prof.isActive
                  ? 'bg-[#F1F2F6] border-white/90 shadow-neuCard hover:shadow-neuCardHover'
                  : 'bg-slate-100/80 border-slate-200/80 opacity-70'
              }`}
            >
              <div className="space-y-4">
                {/* Cabecera del Perfil */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200/60">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${prof.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                      <h3 className="font-bubble font-extrabold text-base sm:text-lg text-slate-900 tracking-wider">
                        {prof.name.toUpperCase()}
                      </h3>
                    </div>
                    {prof.note && (
                      <p className="text-xs text-slate-500 font-sans pl-4">
                        {prof.note}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        prof.isActive
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {prof.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>

                {/* Bloque del Código PIN de 4 Dígitos */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#ECEEF2] border border-white/70 shadow-neuInset">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-fio-pink" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
                        Código de Acceso (PIN)
                      </span>
                      <span className="font-mono font-extrabold text-base text-fio-900 tracking-widest">
                        {isRevealed ? prof.pin : '••••'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => togglePinReveal(prof.id)}
                      className="p-1.5 rounded-xl hover:bg-white text-slate-500 hover:text-slate-800 transition-colors shadow-2xs"
                      title={isRevealed ? 'Ocultar PIN' : 'Ver PIN'}
                    >
                      {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyPin(prof.id, prof.pin)}
                      className="p-1.5 rounded-xl hover:bg-white text-slate-500 hover:text-emerald-700 transition-colors shadow-2xs"
                      title="Copiar PIN"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Módulos Permitidos (Checkboxes o Pills) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">
                      Módulos Autorizados ({grantedCount}/{totalCount})
                    </span>
                    {grantedCount === totalCount && (
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                        Acceso Total
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {permissionModules.map((mod) => {
                      const hasIt = prof.permissions[mod.key];
                      const Icon = mod.icon;

                      return (
                        <span
                          key={mod.key}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                            hasIt
                              ? 'bg-white text-slate-800 border border-white/90 shadow-2xs'
                              : 'bg-slate-200/50 text-slate-400 line-through opacity-40'
                          }`}
                        >
                          <Icon className={`w-3 h-3 ${hasIt ? 'text-fio-purple' : 'text-slate-400'}`} />
                          <span>{mod.label}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Botones de Acción al Pie de la Tarjeta */}
              <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={() => toggleUserProfileStatus(prof.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all active:scale-95 ${
                    prof.isActive
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
                >
                  {prof.isActive ? 'Pausar Perfil' : 'Activar Perfil'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(prof)}
                    className="neu-btn bg-[#F1F2F6] px-3 py-1.5 rounded-xl text-xs font-bubble font-bold text-slate-700 hover:text-fio-pink border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover flex items-center gap-1 active:scale-95"
                    title="Editar perfil y permisos"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(prof)}
                    className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Eliminar perfil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Neumórfico para Crear o Editar Perfil */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-[#F1F2F6] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-purple-100 text-fio-purple flex items-center justify-center shadow-xs">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bubble font-bold text-base sm:text-lg text-slate-900 leading-tight">
                    {editingProfileId ? 'Editar Perfil de Colaborador' : 'Crear Nuevo Perfil de Colaborador'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-sans">
                    Asigna nombre en mayúsculas, código PIN de 4 dígitos y módulos de acceso.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
                title="Cerrar ventana"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Contenido con Scroll */}
            <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4">
              {formError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bubble font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Campo Nombre en MAYÚSCULAS Estrictas */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bubble font-bold text-slate-800">
                  Nombre del Perfil (Se guardará en MAYÚSCULAS) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value.toUpperCase())}
                  placeholder="EJ: ALISTO DE PEDIDOS / MARÍA FACTURACIÓN"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#ECEEF2] border border-white/70 shadow-neuInset font-bubble font-extrabold text-sm text-slate-900 tracking-wide uppercase placeholder:text-slate-400 placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <p className="text-[10px] text-slate-500">
                  El sistema convertirá y leerá el nombre en MAYÚSCULAS automáticamente.
                </p>
              </div>

              {/* Campo Código PIN de 4 Dígitos */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bubble font-bold text-slate-800">
                    Código de Acceso PIN (4 dígitos numéricos) *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
                      setPin(randomPin);
                    }}
                    className="text-[11px] text-fio-purple font-bubble font-bold hover:underline"
                  >
                    Generar PIN aleatorio ✨
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={4}
                    inputMode="numeric"
                    pattern="[0-9]{4}"
                    value={pin}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setPin(clean);
                    }}
                    placeholder="1001"
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#ECEEF2] border border-white/70 shadow-neuInset font-mono font-extrabold text-lg tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <KeyRound className="w-4 h-4 text-fio-pink absolute left-4 top-3.5 pointer-events-none" />
                </div>
                <p className="text-[10px] text-slate-500">
                  Código de 4 números que el colaborador usará para ingresar de inmediato.
                </p>
              </div>

              {/* Nota Opcional */}
              <div className="space-y-1">
                <label className="block text-xs font-bubble font-bold text-slate-800">
                  Descripción o Función del Puesto (Opcional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ej: Encargado de empaque y retiro en taller"
                  className="w-full px-4 py-2 rounded-2xl bg-[#ECEEF2] border border-white/70 shadow-neuInset text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              {/* Selección de Módulos & Casillas de Verificación (Checkboxes) */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bubble font-bold text-slate-900">
                    Módulos y Accesos Permitidos:
                  </label>
                  <button
                    type="button"
                    onClick={() => handleToggleAllPermissions(!allChecked)}
                    className="text-[11px] font-bubble font-bold text-fio-purple hover:underline"
                  >
                    {allChecked ? 'Desmarcar todos' : 'Marcar todos los accesos (Admin Total)'}
                  </button>
                </div>

                <div className="space-y-2">
                  {permissionModules.map((mod) => {
                    const isChecked = permissions[mod.key];
                    const Icon = mod.icon;

                    return (
                      <label
                        key={mod.key}
                        className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer select-none transition-all ${
                          isChecked
                            ? 'bg-purple-50/70 border-purple-300 shadow-2xs'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handlePermissionChange(mod.key)}
                          className="w-4 h-4 mt-0.5 rounded text-fio-purple focus:ring-purple-400 accent-purple-600 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <Icon className={`w-3.5 h-3.5 ${isChecked ? 'text-fio-purple' : 'text-slate-500'}`} />
                            <span className="font-bubble font-bold text-xs text-slate-900">{mod.label}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                            {mod.desc}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Botón de Estado Activo */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#ECEEF2] border border-white/70 shadow-neuInset">
                <div>
                  <span className="font-bubble font-bold text-xs text-slate-900 block">
                    Estado del Perfil
                  </span>
                  <span className="text-[11px] text-slate-500 font-sans">
                    {isActive ? 'El colaborador puede ingresar con este PIN' : 'Acceso suspendido temporalmente'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`px-3 py-1 rounded-xl text-xs font-bubble font-bold transition-all ${
                    isActive ? 'bg-emerald-500 text-white shadow-2xs' : 'bg-slate-300 text-slate-700'
                  }`}
                >
                  {isActive ? 'Activo' : 'Inactivo'}
                </button>
              </div>

              {/* Acciones del Formulario */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bubble font-bold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl neu-btn-primary text-white font-bubble font-bold text-xs sm:text-sm shadow-neuBtnHover active:scale-95 transition-all"
                >
                  {editingProfileId ? 'Guardar Cambios' : 'Crear Perfil'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
