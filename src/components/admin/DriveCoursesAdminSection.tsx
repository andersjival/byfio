import React, { useState, useEffect } from 'react';
import {
  HardDrive, Copy, Check, ExternalLink, Share2, Plus, Edit2, Trash2,
  Users, DollarSign, CheckCircle2, AlertCircle, RefreshCw, Sparkles,
  FolderGit2, ShieldCheck, ArrowRight, Eye, EyeOff, BookOpen, Send,
  Mail, Cloud, CheckCircle, Clock, Link as LinkIcon
} from 'lucide-react';
import { DriveCourse, DriveCoursePurchase, DriveCoursesSettings, AppRoute, ComposioAccountStatus } from '../../types';
import {
  fetchDriveCourses, fetchDrivePurchases, saveCourse, deleteCourse,
  saveComposioSettings, testComposioConnection, fetchComposioStatus,
  getComposioConnectLink, testComposioGmail, testComposioDrive, DEFAULT_DRIVE_COURSES
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
  const [composioKey, setComposioKey] = useState('ak_AiRbOjfO_jCuUfBfQHUc');
  const [adminEmail, setAdminEmail] = useState('tienda@byfiocr.com');
  const [isTestingComposio, setIsTestingComposio] = useState(false);
  const [composioTestResult, setComposioTestResult] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  // Live Composio Connected Accounts Status (Drive & Gmail)
  const [composioStatus, setComposioStatus] = useState<{
    drive: ComposioAccountStatus | null;
    gmail: ComposioAccountStatus | null;
    loading: boolean;
  }>({
    drive: null,
    gmail: null,
    loading: false,
  });

  const [isConnectingDrive, setIsConnectingDrive] = useState(false);
  const [isConnectingGmail, setIsConnectingGmail] = useState(false);
  const [isTestingGmail, setIsTestingGmail] = useState(false);
  const [isTestingDrive, setIsTestingDrive] = useState(false);
  const [testEmailInput, setTestEmailInput] = useState('tienda@byfiocr.com');
  const [driveDirectLink, setDriveDirectLink] = useState<string | null>(null);
  const [gmailDirectLink, setGmailDirectLink] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadComposioStatus = async () => {
    setComposioStatus((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetchComposioStatus();
      setComposioStatus({
        drive: res.drive,
        gmail: res.gmail,
        loading: false,
      });
      if (res.adminEmail) setAdminEmail(res.adminEmail);
    } catch {
      setComposioStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const { courses: cList, settings: cSettings } = await fetchDriveCourses();
      setCourses(cList.length > 0 ? cList : DEFAULT_DRIVE_COURSES);
      setSettings(cSettings);
      setComposioUrl(cSettings.composioWebhookUrl || '');
      if (cSettings.composioApiKey) setComposioKey(cSettings.composioApiKey);
      if (cSettings.adminEmail) setAdminEmail(cSettings.adminEmail);

      const pList = await fetchDrivePurchases();
      setPurchases(pList);
      await loadComposioStatus();
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
    const updated = {
      composioWebhookUrl: composioUrl.trim(),
      composioApiKey: composioKey.trim(),
      adminEmail: adminEmail.trim(),
    };
    await saveComposioSettings(updated);
    setSettings(updated);
    showToast('✓ Configuración de Composio guardada.');
    loadComposioStatus();
  };

  const handleConnectComposio = async (toolkit: 'googledrive' | 'gmail') => {
    if (toolkit === 'googledrive') setIsConnectingDrive(true);
    else setIsConnectingGmail(true);

    // Abrir ventana inmediatamente en el evento de clic para evitar que el navegador bloquee el popup
    const popup = window.open('about:blank', '_blank');
    if (popup) {
      try {
        popup.document.write(
          '<div style="font-family: -apple-system, sans-serif; text-align: center; padding-top: 60px;">' +
          '<h2 style="color: #6b21a8; font-size: 20px;">Cargando pantalla de consentimiento de Google...</h2>' +
          '<p style="color: #64748b; font-size: 13px;">Conectando con Composio Managed Auth. Redirigiendo en unos segundos...</p>' +
          '</div>'
        );
      } catch {}
    }

    try {
      const res = await getComposioConnectLink(toolkit, adminEmail, composioKey);
      if (res.success && res.redirectUrl) {
        if (toolkit === 'googledrive') setDriveDirectLink(res.redirectUrl);
        else setGmailDirectLink(res.redirectUrl);

        if (popup && !popup.closed) {
          popup.location.href = res.redirectUrl;
        } else {
          window.open(res.redirectUrl, '_blank');
        }
        showToast(`Pantalla de consentimiento abierta. Aprueba los permisos en la cuenta ${adminEmail}.`);
      } else {
        if (popup) popup.close();
        showToast(res.message || 'Error al obtener enlace de consentimiento.');
      }
    } catch (e: any) {
      if (popup) popup.close();
      showToast(e.message || 'Error de conexión.');
    } finally {
      setIsConnectingDrive(false);
      setIsConnectingGmail(false);
    }
  };

  const handleTestGmail = async () => {
    // Si Gmail aún no está activo, abrir directamente la pantalla de consentimiento
    if (composioStatus.gmail?.status !== 'ACTIVE') {
      showToast('Gmail requiere autorización previa. Abriendo pantalla de consentimiento...');
      await handleConnectComposio('gmail');
      return;
    }

    setIsTestingGmail(true);
    try {
      const res = await testComposioGmail({
        recipientEmail: testEmailInput,
        composioApiKey: composioKey,
        adminEmail,
      });
      showToast(res.message);
      if (!res.success) {
        await handleConnectComposio('gmail');
      }
    } catch (e: any) {
      showToast(e.message || 'Error al probar lectura de Gmail.');
    } finally {
      setIsTestingGmail(false);
    }
  };

  const handleTestDrive = async () => {
    // Si Google Drive aún no está activo, abrir directamente la pantalla de consentimiento
    if (composioStatus.drive?.status !== 'ACTIVE') {
      showToast('Google Drive requiere aprobación previa. Abriendo pantalla de consentimiento...');
      await handleConnectComposio('googledrive');
      return;
    }

    setIsTestingDrive(true);
    try {
      const res = await testComposioDrive({
        testEmail: testEmailInput,
        composioApiKey: composioKey,
        adminEmail,
      });
      showToast(res.message);
      if (!res.success) {
        await handleConnectComposio('googledrive');
      }
    } catch (e: any) {
      showToast(e.message || 'Error al probar Drive.');
    } finally {
      setIsTestingDrive(false);
    }
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
      <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-[#3B0764] via-[#701A75] to-[#BE185D] text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/20 backdrop-blur-xs text-white">
                <HardDrive className="w-5 h-5" />
              </span>
              <span className="text-xs uppercase font-bubble font-bold tracking-wider text-pink-200">
                Módulo Oficial
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bubble font-black tracking-wide">
              CURSOS DRIVE
            </h1>
            <p className="text-xs sm:text-sm text-pink-100 font-sans leading-relaxed">
              Genera enlaces para entregar a clientes que quieran comprar un curso. Al confirmar el pago,
              el sistema registra automáticamente el correo en Google Drive vía Composio y le da acceso a los materiales.
            </p>
          </div>

          {/* Generador de Enlace Público para Clientes */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 sm:p-4 space-y-2.5 min-w-[280px]">
            <div className="text-[11px] font-bubble font-bold text-pink-200 flex items-center justify-between">
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
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white text-purple-900 font-bubble text-xs font-bold hover:bg-pink-50 transition-all shadow-md active:scale-95"
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
            <span className="text-[10px] sm:text-xs font-bubble text-pink-200 block">Cursos Activos</span>
            <span className="text-lg sm:text-2xl font-bubble font-black">{activeCoursesCount}</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-2.5 sm:p-3 text-center">
            <span className="text-[10px] sm:text-xs font-bubble text-pink-200 block">Alumnos Registrados</span>
            <span className="text-lg sm:text-2xl font-bubble font-black">{purchases.length}</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-2.5 sm:p-3 text-center">
            <span className="text-[10px] sm:text-xs font-bubble text-pink-200 block">Ingresos Totales</span>
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
          <span>Integración Composio (Drive & Gmail)</span>
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

      {/* TAB 3: INTEGRACIÓN COMPOSIO (GOOGLE DRIVE & GMAIL) */}
      {activeTab === 'composio' && (
        <div className="bg-[#FDFBF9] rounded-3xl p-5 sm:p-6 border border-purple-100 space-y-6">
          {/* Header de la Integración */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
            <div className="space-y-1">
              <h2 className="text-base font-bubble font-bold text-slate-800 flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-purple-700" />
                <span>Conexión Google Drive & Gmail (Administrador)</span>
              </h2>
              <p className="text-xs text-slate-500 font-sans leading-relaxed">
                Cuenta Oficial del Administrador: <strong className="text-purple-900 font-mono">{adminEmail}</strong>.
                Composio automatiza los accesos a los cursos y el envío oficial de correos.
              </p>
            </div>

            <button
              type="button"
              onClick={loadComposioStatus}
              disabled={composioStatus.loading}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bubble text-xs font-bold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${composioStatus.loading ? 'animate-spin' : ''}`} />
              <span>{composioStatus.loading ? 'Consultando...' : 'Verificar Estado'}</span>
            </button>
          </div>

          {/* Tarjetas de Conexión: Google Drive y Gmail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Tarjeta Google Drive (Ver, Modificar y Eliminar) */}
            <div className="bg-white rounded-3xl p-5 border border-purple-100/90 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-300 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-2xl bg-amber-50 text-amber-600">
                      <HardDrive className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-bubble font-bold text-sm text-slate-900">Google Drive</h3>
                      <span className="text-[11px] font-sans text-slate-400">Ver, Modificar y Eliminar</span>
                    </div>
                  </div>

                  {composioStatus.drive?.status === 'ACTIVE' ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bubble text-[11px] font-bold flex items-center gap-1.5 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Conectado (Full)</span>
                    </span>
                  ) : composioStatus.drive?.status === 'INITIALIZING' ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bubble text-[11px] font-bold flex items-center gap-1.5 shadow-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Autorización Pendiente</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-bubble text-[11px] font-bold flex items-center gap-1.5 shadow-xs">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>No Conectado</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Permisos completos de administración (<code className="font-mono bg-amber-50 text-amber-800 px-1 py-0.5 rounded text-[11px]">https://www.googleapis.com/auth/drive</code>). Permite a By.Fio <strong>ver, modificar y eliminar</strong> archivos, carpetas y gestionar permisos de acceso para los alumnos de los cursos.
                </p>

                <div className="bg-purple-50/60 rounded-xl p-2.5 text-[11px] font-mono text-purple-900 truncate">
                  Cuenta vinculada: {adminEmail}
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleConnectComposio('googledrive')}
                    disabled={isConnectingDrive}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bubble text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>
                      {isConnectingDrive
                        ? 'Generando enlace...'
                        : composioStatus.drive?.status === 'ACTIVE'
                        ? 'Reconectar Google Drive'
                        : 'Abrir Pantalla de Consentimiento de Google Drive'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTestDrive}
                    disabled={isTestingDrive}
                    className="px-3.5 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bubble text-xs font-bold transition-all disabled:opacity-50"
                    title="Probar asignación de permiso en Google Drive"
                  >
                    {isTestingDrive ? 'Probando...' : 'Probar Permisos Drive'}
                  </button>
                </div>

                {driveDirectLink && (
                  <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200/80">
                    <a
                      href={driveDirectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-amber-900 underline font-bubble font-bold flex items-center gap-1.5 hover:text-amber-950"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Si tu navegador bloqueó el popup, toca aquí para abrir el consentimiento</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Tarjeta Gmail (Solo Lectura) */}
            <div className="bg-white rounded-3xl p-5 border border-purple-100/90 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-300 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-2xl bg-rose-50 text-rose-600">
                      <Mail className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-bubble font-bold text-sm text-slate-900">Gmail (Solo Lectura)</h3>
                      <span className="text-[11px] font-sans text-slate-400">Lectura de Correos & Comprobantes</span>
                    </div>
                  </div>

                  {composioStatus.gmail?.status === 'ACTIVE' ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bubble text-[11px] font-bold flex items-center gap-1.5 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Conectado (Lectura)</span>
                    </span>
                  ) : composioStatus.gmail?.status === 'INITIALIZING' ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bubble text-[11px] font-bold flex items-center gap-1.5 shadow-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Autorización Pendiente</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-bubble text-[11px] font-bold flex items-center gap-1.5 shadow-xs">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>No Conectado</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Permiso restringido exclusivamente a lectura (<code className="font-mono bg-purple-50 text-purple-700 px-1 py-0.5 rounded text-[11px]">GMAIL_FETCH_EMAILS</code>). Permite consultar bandejas para comprobar pagos SINPE BCR y notificaciones, sin permisos de envío ni edición.
                </p>

                <div className="bg-purple-50/60 rounded-xl p-2.5 text-[11px] font-mono text-purple-900 truncate">
                  Bandeja de consulta: {adminEmail}
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleConnectComposio('gmail')}
                    disabled={isConnectingGmail}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bubble text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>
                      {isConnectingGmail
                        ? 'Generando enlace...'
                        : composioStatus.gmail?.status === 'ACTIVE'
                        ? 'Reconectar Gmail (Solo Lectura)'
                        : 'Abrir Pantalla de Consentimiento (Gmail Solo Lectura)'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTestGmail}
                    disabled={isTestingGmail}
                    className="px-3.5 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bubble text-xs font-bold transition-all disabled:opacity-50"
                    title="Probar lectura de correos recibidos"
                  >
                    {isTestingGmail ? 'Consultando...' : 'Probar Lectura'}
                  </button>
                </div>

                {gmailDirectLink && (
                  <div className="p-2 rounded-xl bg-rose-50/80 border border-rose-200/80">
                    <a
                      href={gmailDirectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-rose-900 underline font-bubble font-bold flex items-center gap-1.5 hover:text-rose-950"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>Si tu navegador bloqueó el popup, toca aquí para abrir el consentimiento</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Destinatario de Pruebas */}
          <div className="bg-white rounded-2xl p-4 border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bubble font-bold text-slate-800 block">
                Correo para Pruebas de Diagnóstico
              </span>
              <p className="text-[11px] text-slate-400 font-sans">
                Las pruebas de envío y verificación de Drive usarán esta dirección.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={testEmailInput}
                onChange={(e) => setTestEmailInput(e.target.value)}
                placeholder="ej: tienda@byfiocr.com"
                className="px-3 py-1.5 rounded-xl border border-purple-200 text-xs font-mono text-slate-800 focus:outline-hidden focus:border-purple-600"
              />
            </div>
          </div>

          {/* Configuración de API & Credenciales Composio */}
          <div className="bg-white rounded-3xl p-5 border border-purple-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="font-bubble font-bold text-sm text-slate-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Credenciales Composio API v3.1</span>
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  Clave del proyecto preconfigurada para la tienda By.Fio.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="text-purple-700 hover:text-purple-900 font-bubble text-xs font-bold flex items-center gap-1"
              >
                {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showApiKey ? 'Ocultar' : 'Ver Clave'}</span>
              </button>
            </div>

            <form onSubmit={handleSaveComposio} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bubble font-bold text-slate-700 mb-1">
                    Composio API Key
                  </label>
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={composioKey}
                    onChange={(e) => setComposioKey(e.target.value)}
                    placeholder="ak_..."
                    className="w-full px-3.5 py-2 rounded-xl border border-purple-200 bg-[#FDFBF9] text-xs font-mono text-slate-800 focus:outline-hidden focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bubble font-bold text-slate-700 mb-1">
                    Correo del Administrador
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="tienda@byfiocr.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-purple-200 bg-[#FDFBF9] text-xs font-mono text-slate-800 focus:outline-hidden focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bubble text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  Guardar Ajustes
                </button>
              </div>
            </form>
          </div>

          {/* Flujo de Automatización */}
          <div className="mt-4 pt-4 border-t border-purple-100 space-y-2">
            <h4 className="font-bubble font-bold text-xs text-purple-900 uppercase">
              Flujo Oficial de Entrega Automática
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-sans text-slate-600">
              <div className="bg-white p-3.5 rounded-2xl border border-purple-100 space-y-1">
                <span className="font-bubble font-bold text-purple-700 block">1. Pago del Alumno</span>
                <p>El cliente adquiere el curso en la tienda e ingresa su correo de Google Drive al confirmar el pago por SINPE.</p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-purple-100 space-y-1">
                <span className="font-bubble font-bold text-amber-700 block">2. Permiso en Google Drive</span>
                <p>Composio otorga permiso de lector en la carpeta privada de Google Drive de manera inmediata y segura.</p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-purple-100 space-y-1">
                <span className="font-bubble font-bold text-rose-700 block">3. Notificación por Gmail</span>
                <p>By.Fio envía un correo electrónico automático desde {adminEmail} con la bienvenida y el enlace directo.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR / EDITAR CURSO - OPTIMIZADO PANTALLA COMPLETA SIN SCROLL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-purple-950/50 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-4 sm:p-5 w-full max-w-4xl lg:max-w-5xl shadow-2xl border border-purple-100 flex flex-col justify-between max-h-[96vh]">
            {/* Header del Modal */}
            <div className="flex items-center justify-between border-b border-purple-100 pb-2.5 shrink-0">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-purple-100 text-purple-800">
                  <HardDrive className="w-4 h-4" />
                </span>
                <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-800">
                  {editingCourse ? 'Editar Curso Drive' : 'Crear Nuevo Curso Drive'}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bubble font-bold border border-purple-200">
                  Ajustes en Pantalla Completa
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 font-bubble text-sm transition-colors"
                title="Cerrar ventana"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-3 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-start">
                {/* COLUMNA IZQUIERDA: DATOS PRINCIPALES */}
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-bubble font-bold text-slate-700 mb-0.5">
                      Título del Curso *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ej: Curso Completo de Encuadernación Artesanal"
                      className="w-full px-3 py-1.5 rounded-xl border border-purple-200 text-xs font-sans text-slate-800 focus:outline-hidden focus:border-purple-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bubble font-bold text-slate-700 mb-0.5">
                        Precio (Colones ₡) *
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-xl border border-purple-200 text-xs font-sans text-slate-800 focus:outline-hidden focus:border-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bubble font-bold text-slate-700 mb-0.5">
                        Etiqueta / Badge
                      </label>
                      <input
                        type="text"
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        placeholder="Ej: Bestseller, Nuevo"
                        className="w-full px-3 py-1.5 rounded-xl border border-purple-200 text-xs font-sans text-slate-800 focus:outline-hidden focus:border-purple-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bubble font-bold text-slate-700 mb-0.5">
                        Subtítulo / Tagline
                      </label>
                      <input
                        type="text"
                        value={formData.tagline}
                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                        placeholder="Resumen atractivo en 1 frase..."
                        className="w-full px-3 py-1.5 rounded-xl border border-purple-200 text-xs font-sans text-slate-800 focus:outline-hidden focus:border-purple-600"
                      />
                    </div>
                    <div className="flex flex-col justify-end">
                      <label className="flex items-center gap-2 p-1.5 rounded-xl bg-purple-50/80 border border-purple-200 cursor-pointer hover:bg-purple-100/60 transition-colors">
                        <input
                          type="checkbox"
                          id="isActiveCourse"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="rounded text-purple-600"
                        />
                        <span className="text-[11px] font-bubble font-bold text-slate-700">
                          Curso Activo para Clientes
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bubble font-bold text-slate-700 mb-0.5">
                      Descripción Completa
                    </label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Explica qué aprenderá el alumno y las ventajas..."
                      className="w-full px-3 py-1.5 rounded-xl border border-purple-200 text-xs font-sans text-slate-800 focus:outline-hidden focus:border-purple-600 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bubble font-bold text-slate-700 mb-0.5">
                        Carpeta Google Drive (URL)
                      </label>
                      <input
                        type="url"
                        value={formData.driveFolderUrl}
                        onChange={(e) => setFormData({ ...formData, driveFolderUrl: e.target.value })}
                        placeholder="https://drive.google.com/..."
                        className="w-full px-3 py-1.5 rounded-xl border border-purple-200 text-[11px] font-mono text-slate-800 focus:outline-hidden focus:border-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bubble font-bold text-slate-700 mb-0.5">
                        Imagen Portada (URL)
                      </label>
                      <input
                        type="url"
                        value={formData.coverImage}
                        onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-1.5 rounded-xl border border-purple-200 text-[11px] font-mono text-slate-800 focus:outline-hidden focus:border-purple-600"
                      />
                    </div>
                  </div>
                </div>

                {/* COLUMNA DERECHA: PUNTOS QUE OBTENDRÁ Y VISTA PREVIA COMPACTA */}
                <div className="space-y-2.5">
                  <div className="bg-purple-50/60 rounded-2xl p-3 border border-purple-100/90 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bubble font-bold text-purple-900">
                        Lo que obtendrá el alumno (Puntos destacados):
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, whatYouGet: [...formData.whatYouGet, ''] })}
                        className="text-purple-700 hover:text-purple-900 font-bubble text-[11px] font-bold"
                      >
                        + Agregar
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {formData.whatYouGet.slice(0, 4).map((point, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="w-4 text-center font-bubble font-bold text-[10px] text-purple-600 shrink-0">
                            #{idx + 1}
                          </span>
                          <input
                            type="text"
                            value={point}
                            onChange={(e) => {
                              const updated = [...formData.whatYouGet];
                              updated[idx] = e.target.value;
                              setFormData({ ...formData, whatYouGet: updated });
                            }}
                            placeholder={`Beneficio del curso #${idx + 1}`}
                            className="flex-1 px-2.5 py-1 rounded-lg border border-purple-200 text-xs font-sans text-slate-800 bg-white focus:outline-hidden focus:border-purple-600"
                          />
                          {formData.whatYouGet.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = formData.whatYouGet.filter((_, i) => i !== idx);
                                setFormData({ ...formData, whatYouGet: updated });
                              }}
                              className="text-rose-500 hover:text-rose-700 text-xs font-bold px-1.5"
                              title="Quitar punto"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vista Previa en Vivo de la Tarjeta del Curso */}
                  <div className="bg-[#FDFBF9] rounded-2xl p-2.5 border border-purple-200/80 flex items-center gap-3">
                    <div className="w-20 h-16 rounded-xl bg-purple-100 overflow-hidden shrink-0 relative">
                      {formData.coverImage ? (
                        <img src={formData.coverImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-purple-400">
                          <HardDrive className="w-6 h-6" />
                        </div>
                      )}
                      {formData.badge && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded-full bg-purple-700 text-white font-bubble font-bold text-[8px]">
                          {formData.badge}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <span className="text-[10px] font-bubble font-bold text-slate-400 block uppercase">
                        Vista Previa en Vivo:
                      </span>
                      <h4 className="font-bubble font-bold text-xs text-slate-900 truncate">
                        {formData.title || 'Título del curso'}
                      </h4>
                      <div className="flex items-center justify-between text-xs font-bubble font-black text-purple-800">
                        <span>{formatCRC(formData.price || 0)}</span>
                        <span className="text-[10px] font-normal text-slate-500 font-sans">
                          {formData.isActive ? '✓ Visible' : 'Oculto'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-purple-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bubble text-xs font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bubble text-xs font-bold shadow-md transition-all active:scale-95"
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
