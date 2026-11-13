import React, { useState, useEffect } from 'react';
import {
  HardDrive, Copy, Check, ExternalLink, Share2, Plus, Edit2, Trash2,
  Users, DollarSign, CheckCircle2, AlertCircle, RefreshCw, Sparkles,
  FolderGit2, ShieldCheck, ArrowRight, Eye, EyeOff, BookOpen, Send
} from 'lucide-react';
import { DriveCourse, DriveCoursePurchase, DriveCoursesSettings, AppRoute } from '../../types';
import {
  fetchDriveCourses, fetchDrivePurchases, saveCourse, deleteCourse,
  saveComposioSettings, testComposioConnection, DEFAULT_DRIVE_COURSES
} from '../../services/driveCoursesService';
import { formatCRC } from '../../utils/formatters';

interface DriveCoursesAdminSectionProps {
  onSelectTab?: (tab: any) => void;
  onNavigate?: (route: AppRoute) => void;
}

export const DriveCoursesAdminSection: React.FC<DriveCoursesAdminSectionProps> = ({ onNavigate }) => {
  const [courses, setCourses] = useState<DriveCourse[]>([]);
  const [purchases, setPurchases] = useState<DriveCoursePurchase[]>([]);
  const [settings, setSettings] = useState<DriveCoursesSettings>({ composioWebhookUrl: '', composioApiKey: '' });
  const [activeTab, setActiveTab] = useState<'courses' | 'purchases' | 'composio'>('courses');
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal de Curso
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<DriveCourse | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    price: 15000,
    description: '',
    whatYouGet: [''],
    driveFolderUrl: '',
    badge: 'Nuevo',
    coverImage: '',
    isActive: true,
  });

  // Composio Settings State
  const [composioUrl, setComposioUrl] = useState('');
  const [composioKey, setComposioKey] = useState('');
  const [isTestingComposio, setIsTestingComposio] = useState(false);
  const [composioTestResult, setComposioTestResult] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const { courses: cList, settings: cSettings } = await fetchDriveCourses();
      setCourses(cList.length > 0 ? cList : DEFAULT_DRIVE_COURSES);
      setSettings(cSettings);
      setComposioUrl(cSettings.composioWebhookUrl || '');
      setComposioKey(cSettings.composioApiKey || '');

      const pList = await fetchDrivePurchases();
      setPurchases(pList);
    } catch {
      setCourses(DEFAULT_DRIVE_COURSES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getPublicLink = () => {
    return `${window.location.origin}/cursos-drive`;
  };

  const handleCopyLink = () => {
    const link = getPublicLink();
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(true);
      showToast('¡Enlace copiado! Ya podés enviarlo a tus clientes.');
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleShareWhatsApp = () => {
    const link = getPublicLink();
    const text = encodeURIComponent(
      `¡Hola! Te comparto el enlace a nuestros Cursos Digitales con acceso en Google Drive de by.fio: ${link}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleOpenPublicPage = () => {
    if (onNavigate) {
      onNavigate('cursos-drive');
    } else {
      window.open('/cursos-drive', '_blank');
    }
  };

  // Crear o Editar Curso
  const handleOpenCreateModal = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      tagline: '',
      price: 15000,
      description: '',
      whatYouGet: [
        'Acceso de por vida a carpeta de Google Drive',
        'Videos explicativos paso a paso en alta resolución',
        'Plantillas descargables e imprimibles',
      ],
      driveFolderUrl: 'https://drive.google.com/drive/folders/',
      badge: 'Nuevo',
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (c: DriveCourse) => {
    setEditingCourse(c);
    setFormData({
      title: c.title,
      tagline: c.tagline || '',
      price: c.price,
      description: c.description,
      whatYouGet: c.whatYouGet && c.whatYouGet.length > 0 ? [...c.whatYouGet] : [''],
      driveFolderUrl: c.driveFolderUrl || '',
      badge: c.badge || '',
      coverImage: c.coverImage || '',
      isActive: c.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Por favor escribe un título para el curso.');
      return;
    }

    const cleanedWhatYouGet = formData.whatYouGet.map((it) => it.trim()).filter(Boolean);

    const courseToSave: DriveCourse = {
      id: editingCourse?.id || `dc-${Date.now()}`,
      title: formData.title.trim(),
      tagline: formData.tagline.trim(),
      price: Number(formData.price) || 0,
      description: formData.description.trim(),
      whatYouGet: cleanedWhatYouGet.length > 0 ? cleanedWhatYouGet : ['Acceso directo a Google Drive'],
      driveFolderUrl: formData.driveFolderUrl.trim(),
      badge: formData.badge.trim(),
      coverImage: formData.coverImage.trim(),
      isActive: formData.isActive,
      createdAt: editingCourse?.createdAt || new Date().toISOString(),
    };

    await saveCourse(courseToSave);
    setIsModalOpen(false);
    showToast('✓ Curso guardado exitosamente.');
    loadData();
  };

  const handleDeleteCourse = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este curso?')) {
      await deleteCourse(id);
      showToast('Curso eliminado.');
      loadData();
    }
  };

  const handleSaveComposio = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { composioWebhookUrl: composioUrl.trim(), composioApiKey: composioKey.trim() };
    await saveComposioSettings(updated);
    setSettings(updated);
    showToast('✓ Configuración de Composio guardada.');
  };

  const handleTestComposio = async () => {
    setIsTestingComposio(true);
    setComposioTestResult(null);
    const res = await testComposioConnection({ composioWebhookUrl: composioUrl, composioApiKey: composioKey });
    setIsTestingComposio(false);
    setComposioTestResult(res.message);
  };

  const totalSales = purchases.reduce((acc, p) => acc + (Number(p.paymentAmount) || 0), 0);
  const activeCoursesCount = courses.filter((c) => c.isActive).length;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-purple-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 font-bubble text-xs">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Banner Principal con Generador de Enlaces */}
      <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/20 backdrop-blur-xs text-white">
                <HardDrive className="w-5 h-5" />
              </span>
              <span className="text-xs uppercase font-bubble font-bold tracking-wider text-blue-200">
                Módulo Oficial
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bubble font-black tracking-wide">
              CURSOS DRIVE
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 font-sans leading-relaxed">
              Genera enlaces para entregar a clientes que quieran comprar un curso. Al confirmar el pago,
              el sistema registra automáticamente el correo en Google Drive vía Composio y le da acceso a los materiales.
            </p>
          </div>

          {/* Generador de Enlace Público para Clientes */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 sm:p-4 space-y-2.5 min-w-[280px]">
            <div className="text-[11px] font-bubble font-bold text-blue-200 flex items-center justify-between">
              <span>ENLACE PARA CLIENTES</span>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full">Activo</span>
            </div>
            <div className="bg-black/20 rounded-xl px-3 py-1.5 text-xs font-mono text-white/90 truncate select-all">
              {getPublicLink()}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white text-blue-900 font-bubble text-xs font-bold hover:bg-blue-50 transition-all shadow-md active:scale-95"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? '¡Copiado!' : 'Copiar Enlace'}</span>
              </button>
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-md active:scale-95"
                title="Compartir en WhatsApp"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleOpenPublicPage}
                className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all shadow-md active:scale-95"
                title="Abrir como cliente"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Métricas Rápidas */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-5 pt-4 border-t border-white/15">
          <div className="bg-white/10 rounded-2xl p-2.5 sm:p-3 text-center">
            <span className="text-[10px] sm:text-xs font-bubble text-blue-200 block">Cursos Activos</span>
            <span className="text-lg sm:text-2xl font-bubble font-black">{activeCoursesCount}</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-2.5 sm:p-3 text-center">
            <span className="text-[10px] sm:text-xs font-bubble text-blue-200 block">Alumnos Registrados</span>
            <span className="text-lg sm:text-2xl font-bubble font-black">{purchases.length}</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-2.5 sm:p-3 text-center">
            <span className="text-[10px] sm:text-xs font-bubble text-blue-200 block">Ingresos Totales</span>
            <span className="text-sm sm:text-xl font-bubble font-black text-emerald-300">{formatCRC(totalSales)}</span>
          </div>
        </div>
      </div>

      {/* Pestañas de Navegación del Módulo */}
      <div className="flex items-center gap-2 border-b border-purple-100 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bubble text-xs font-bold transition-all ${
            activeTab === 'courses'
              ? 'bg-purple-700 text-white shadow-md'
              : 'bg-[#FDFBF9] hover:bg-purple-50 text-slate-600'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Cursos Disponibles ({courses.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('purchases')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bubble text-xs font-bold transition-all ${
            activeTab === 'purchases'
              ? 'bg-purple-700 text-white shadow-md'
              : 'bg-[#FDFBF9] hover:bg-purple-50 text-slate-600'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Alumnos & Accesos ({purchases.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('composio')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bubble text-xs font-bold transition-all ${
            activeTab === 'composio'
              ? 'bg-purple-700 text-white shadow-md'
              : 'bg-[#FDFBF9] hover:bg-purple-50 text-slate-600'
          }`}
        >
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Integración Composio & Drive</span>
        </button>
      </div>

      {/* TAB 1: CURSOS DISPONIBLES */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bubble font-bold text-slate-800">
              Catálogo de Cursos en Google Drive
            </h2>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bubble text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Curso Drive</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="rounded-3xl p-4 bg-[#FDFBF9] border border-purple-100/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div className="space-y-3">
                  {/* Imagen y Badges */}
                  <div className="relative h-36 rounded-2xl overflow-hidden bg-purple-50">
                    {course.coverImage ? (
                      <img
                        src={course.coverImage}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-purple-300">
                        <HardDrive className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      {course.badge && (
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-600/90 text-white text-[10px] font-bubble font-bold backdrop-blur-xs">
                          {course.badge}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bubble font-bold backdrop-blur-xs ${
                        course.isActive ? 'bg-emerald-600/90 text-white' : 'bg-slate-700/80 text-white'
                      }`}>
                        {course.isActive ? 'Activo' : 'Oculto'}
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-xl bg-white/95 text-purple-900 font-bubble font-black text-xs shadow-sm">
                      {formatCRC(course.price)}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bubble font-bold text-sm text-slate-800 line-clamp-1">{course.title}</h3>
                    {course.tagline && <p className="text-[11px] text-purple-700 font-sans line-clamp-1 mt-0.5">{course.tagline}</p>}
                    <p className="text-xs text-slate-500 font-sans line-clamp-2 mt-1">{course.description}</p>
                  </div>

                  {/* Lo que incluye */}
                  <div className="bg-purple-50/50 rounded-2xl p-2.5 space-y-1 text-[11px] text-slate-600 font-sans">
                    <span className="font-bubble font-bold text-[10px] text-purple-800 uppercase block">Lo que obtendrá:</span>
                    {course.whatYouGet?.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-start gap-1.5 leading-tight">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
                    {course.whatYouGet?.length > 3 && (
                      <span className="text-[10px] text-purple-600 italic">+{course.whatYouGet.length - 3} beneficios más</span>
                    )}
                  </div>

                  {/* Link Drive */}
                  {course.driveFolderUrl && (
                    <a
                      href={course.driveFolderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] text-blue-600 hover:text-blue-800 font-sans truncate w-full"
                    >
                      <HardDrive className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{course.driveFolderUrl}</span>
                    </a>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-purple-100">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(course)}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-xl bg-purple-100 text-purple-800 hover:bg-purple-200 font-bubble text-xs font-bold transition-all"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Editar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCourse(course.id)}
                    className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all"
                    title="Eliminar curso"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ALUMNOS & COMPRAS */}
      {activeTab === 'purchases' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bubble font-bold text-slate-800">
              Registro de Clientes & Accesos Otorgados a Google Drive
            </h2>
            <button
              type="button"
              onClick={loadData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bubble font-bold transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Actualizar</span>
            </button>
          </div>

          {purchases.length === 0 ? (
            <div className="bg-[#FDFBF9] rounded-3xl p-8 text-center space-y-2 border border-purple-100">
              <Users className="w-10 h-10 text-purple-300 mx-auto" />
              <h3 className="font-bubble font-bold text-slate-700">Aún no hay compras registradas</h3>
              <p className="text-xs text-slate-500 font-sans max-w-md mx-auto">
                Comparte el enlace de cursos con tus clientes. Cuando completen el pago de un curso, aparecerán aquí con su correo de Google Drive registrado.
              </p>
              <button
                type="button"
                onClick={handleCopyLink}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-purple-700 text-white font-bubble text-xs font-bold hover:bg-purple-800"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Enlace para Clientes</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {purchases.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#FDFBF9] rounded-2xl p-3.5 sm:p-4 border border-purple-100/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-300 transition-all"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bubble font-bold text-sm text-slate-900">{p.customerName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bubble text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Google Drive Activo</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-sans">
                      <span className="font-semibold text-purple-700 font-bubble">{p.courseTitle}</span>
                      <span>•</span>
                      <span className="text-slate-800 font-mono bg-purple-50 px-2 py-0.5 rounded-md select-all">
                        {p.customerEmail}
                      </span>
                      <span>•</span>
                      <span>Tel: {p.customerPhone}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">{formatCRC(p.paymentAmount)}</span>
                    </div>

                    <div className="text-[11px] text-slate-400 font-sans">
                      Comprobante: {p.paymentReference || 'SINPE verificado'} • {new Date(p.createdAt).toLocaleString('es-CR')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`https://wa.me/506${p.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`¡Hola ${p.customerName}! Te escribimos de by.fio para confirmar tu acceso al curso en Google Drive.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bubble text-xs font-bold transition-all"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INTEGRACIÓN COMPOSIO & GOOGLE DRIVE */}
      {activeTab === 'composio' && (
        <div className="bg-[#FDFBF9] rounded-3xl p-5 sm:p-6 border border-purple-100 space-y-5">
          <div className="space-y-1">
            <h2 className="text-base font-bubble font-bold text-slate-800 flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-blue-600" />
              <span>Configuración de Composio & Google Drive</span>
            </h2>
            <p className="text-xs text-slate-500 font-sans leading-relaxed">
              Composio automatiza la asignación de permisos en Google Drive. Cuando un cliente realiza el pago,
              by.fio envía una solicitud a este Webhook con el correo del cliente para que Composio lo invite como lector/editor de la carpeta.
            </p>
          </div>

          <form onSubmit={handleSaveComposio} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">
                Webhook URL de Composio
              </label>
              <input
                type="url"
                value={composioUrl}
                onChange={(e) => setComposioUrl(e.target.value)}
                placeholder="https://backend.composio.dev/api/v1/actions/execute/..."
                className="w-full px-3.5 py-2.5 rounded-2xl border border-purple-200 bg-white text-xs font-mono text-slate-800 focus:outline-hidden focus:border-purple-600"
              />
              <span className="text-[11px] text-slate-400 font-sans block mt-1">
                URL generada en tu flujo de Composio para la acción de Google Drive (compartir carpeta/archivo).
              </span>
            </div>

            <div>
              <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">
                API Key o Token de Autorización (Opcional)
              </label>
              <input
                type="password"
                value={composioKey}
                onChange={(e) => setComposioKey(e.target.value)}
                placeholder="Bearer token o API Key si requiere autenticación..."
                className="w-full px-3.5 py-2.5 rounded-2xl border border-purple-200 bg-white text-xs font-mono text-slate-800 focus:outline-hidden focus:border-purple-600"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bubble text-xs font-bold shadow-md transition-all active:scale-95"
              >
                Guardar Configuración
              </button>

              <button
                type="button"
                onClick={handleTestComposio}
                disabled={isTestingComposio || !composioUrl.trim()}
                className="px-4 py-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bubble text-xs font-bold transition-all disabled:opacity-50"
              >
                {isTestingComposio ? 'Enviando prueba...' : 'Probar Conexión'}
              </button>
            </div>

            {composioTestResult && (
              <div className="p-3 rounded-2xl bg-purple-50 text-purple-900 text-xs font-sans">
                {composioTestResult}
              </div>
            )}
          </form>

          {/* Guía Rápida */}
          <div className="mt-6 pt-5 border-t border-purple-100 space-y-2">
            <h4 className="font-bubble font-bold text-xs text-purple-900 uppercase">¿Cómo funciona la automatización?</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-sans text-slate-600">
              <div className="bg-white p-3 rounded-2xl border border-purple-100 space-y-1">
                <span className="font-bubble font-bold text-purple-700 block">1. Pago del Cliente</span>
                <p>El cliente entra al enlace de cursos, elige uno, realiza el pago por SINPE Móvil e ingresa su correo de Google Drive.</p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-purple-100 space-y-1">
                <span className="font-bubble font-bold text-blue-700 block">2. Notificación a Composio</span>
                <p>By.Fio envía el correo y la carpeta correspondiente al Webhook de Composio para registrar el permiso en Google Drive.</p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-purple-100 space-y-1">
                <span className="font-bubble font-bold text-emerald-700 block">3. Acceso Inmediato</span>
                <p>El cliente recibe un correo de Google Drive para abrir los materiales y puede crear su cuenta By.Fio en el mismo paso.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR / EDITAR CURSO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-purple-950/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-xl shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="font-bubble font-bold text-base text-slate-800">
                {editingCourse ? 'Editar Curso Drive' : 'Crear Nuevo Curso Drive'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bubble text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">Título del Curso</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Curso Completo de Encuadernación Artesanal"
                  className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs font-sans text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">Precio (Colones ₡)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs font-sans text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">Etiqueta / Badge</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Ej: Bestseller, Nuevo, 2027"
                    className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs font-sans text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">Subtítulo / Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Resumen atractivo en 1 frase..."
                  className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs font-sans text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">Descripción Completa</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explica qué aprenderá el alumno y las ventajas del curso..."
                  className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs font-sans text-slate-800"
                />
              </div>

              {/* Lo que obtendrás */}
              <div>
                <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">
                  Lo que obtendrá el alumno (Puntos destacados):
                </label>
                <div className="space-y-2">
                  {formData.whatYouGet.map((point, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => {
                          const updated = [...formData.whatYouGet];
                          updated[idx] = e.target.value;
                          setFormData({ ...formData, whatYouGet: updated });
                        }}
                        placeholder={`Beneficio #${idx + 1}`}
                        className="flex-1 px-3 py-1.5 rounded-xl border border-purple-200 text-xs font-sans text-slate-800"
                      />
                      {formData.whatYouGet.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.whatYouGet.filter((_, i) => i !== idx);
                            setFormData({ ...formData, whatYouGet: updated });
                          }}
                          className="text-rose-500 hover:text-rose-700 text-xs font-bold px-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, whatYouGet: [...formData.whatYouGet, ''] })}
                    className="text-purple-700 hover:text-purple-900 font-bubble text-xs font-bold"
                  >
                    + Agregar otro punto
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">
                  Enlace a Carpeta de Google Drive
                </label>
                <input
                  type="url"
                  value={formData.driveFolderUrl}
                  onChange={(e) => setFormData({ ...formData, driveFolderUrl: e.target.value })}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bubble font-bold text-slate-700 mb-1">
                  Imagen de Portada (URL)
                </label>
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs font-mono text-slate-800"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveCourse"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-purple-600"
                />
                <label htmlFor="isActiveCourse" className="text-xs font-bubble font-bold text-slate-700 cursor-pointer">
                  Curso visible y activo para la venta
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-purple-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bubble text-xs font-bold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bubble text-xs font-bold shadow-md"
                >
                  Guardar Curso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriveCoursesAdminSection;
