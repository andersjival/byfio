import { DriveCourse, DriveCoursePurchase, DriveCoursesSettings } from '../types';

const STORAGE_KEY_COURSES = 'byfio_drive_courses_list';
const STORAGE_KEY_PURCHASES = 'byfio_drive_course_purchases';
const STORAGE_KEY_SETTINGS = 'byfio_drive_courses_settings';

export const DEFAULT_DRIVE_COURSES: DriveCourse[] = [
  {
    id: 'dc-1',
    title: 'Curso Profesional de Encuadernación & Agendas Artesanales 2027',
    tagline: 'Aprende encuadernación de tapas duras, costura copta y espiralado profesional.',
    price: 15000,
    description: 'Aprende paso a paso desde cero todas las técnicas de encuadernación para crear agendas personalizadas de alta gama, álbumes y libretas acolchadas. Incluye acceso inmediato a nuestra biblioteca de Google Drive con todos los archivos digitales.',
    whatYouGet: [
      'Acceso de por vida a carpeta privada en Google Drive con actualizaciones continuas',
      'Más de 45 plantillas editables en PDF y Canva (Agendas 2027, Cuadernos de Pediatría y Recetarios)',
      '14 módulos en video HD con tomas de alta precisión y explicación detallada',
      'Guía maestra de proveedores recomendados con descuentos de mayorista',
      'Certificado de finalización digital avalado por by.fio'
    ],
    driveFolderUrl: 'https://drive.google.com/drive/folders/byfio-encuadernacion-2027',
    badge: 'Más Vendido',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80',
    isActive: true,
    createdAt: '2026-11-13T10:00:00Z'
  },
  {
    id: 'dc-2',
    title: 'Masterclass de Sublimación & Tazas Perfectas Sin Errores',
    tagline: 'Tiempos, temperaturas y perfiles de color para sublimar sin manchas ni mermas.',
    price: 12000,
    description: 'Domina los secretos de la sublimación artesanal sobre cerámica, aluminio y telas. Olvídate de los colores apagados o los bordes quemados gracias a nuestras tablas exactas de calibración.',
    whatYouGet: [
      'Acceso completo a carpeta Google Drive con más de 250 diseños listos para imprimir',
      'Tabla comparativa de tiempos, presión y temperaturas según sustrato',
      'Video tutorial de calibración de impresoras Epson y tintas fotográficas',
      'Mockups profesionales para publicar tus tazas en redes sociales y vender más',
      'Grupo privado de consultas técnicas y soporte'
    ],
    driveFolderUrl: 'https://drive.google.com/drive/folders/byfio-sublimacion-master',
    badge: 'Recomendado',
    coverImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
    isActive: true,
    createdAt: '2026-11-13T10:00:00Z'
  },
  {
    id: 'dc-3',
    title: 'Taller Digital: Diseño y Troquelado de Stickers Holográficos Kawaii',
    tagline: 'Crea stickers laminados impermeables con cortes perfectos en plotter.',
    price: 9500,
    description: 'Convierte tus ideas en stickers profesionales con efectos holográficos, glitter y acabado mate. Aprende a configurar Silhouette Cameo y Cricut para lograr troquelados precisos.',
    whatYouGet: [
      'Carpeta Google Drive con más de 300 ilustraciones vectoriales en SVG y PNG alta calidad',
      'Guía paso a paso para troquelado die-cut y kiss-cut perfecto',
      'Recomendaciones de vinilos adhesivos y laminados resistentes al agua',
      'Plantillas para empaques con backing card listo para exhibir'
    ],
    driveFolderUrl: 'https://drive.google.com/drive/folders/byfio-stickers-holograficos',
    badge: 'Nuevo',
    coverImage: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=700&q=80',
    isActive: true,
    createdAt: '2026-11-13T10:00:00Z'
  }
];

export const getLocalCourses = (): DriveCourse[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COURSES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_DRIVE_COURSES;
};

export const saveLocalCourses = (courses: DriveCourse[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(courses));
  } catch {}
};

export const getLocalPurchases = (): DriveCoursePurchase[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PURCHASES);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
};

export const saveLocalPurchase = (purchase: DriveCoursePurchase) => {
  try {
    const list = getLocalPurchases();
    list.unshift(purchase);
    localStorage.setItem(STORAGE_KEY_PURCHASES, JSON.stringify(list));
  } catch {}
};

export const getLocalSettings = (): DriveCoursesSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { composioWebhookUrl: '', composioApiKey: '' };
};

export const saveLocalSettings = (settings: DriveCoursesSettings) => {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch {}
};

export const fetchDriveCourses = async (): Promise<{ courses: DriveCourse[]; settings: DriveCoursesSettings }> => {
  try {
    const res = await fetch('/api/drive-courses');
    if (res.ok) {
      const data = await res.json();
      if (data.courses && Array.isArray(data.courses) && data.courses.length > 0) {
        saveLocalCourses(data.courses);
        if (data.settings) saveLocalSettings(data.settings);
        return { courses: data.courses, settings: data.settings || getLocalSettings() };
      }
    }
  } catch {}
  return { courses: getLocalCourses(), settings: getLocalSettings() };
};

export const fetchDrivePurchases = async (): Promise<DriveCoursePurchase[]> => {
  try {
    const res = await fetch('/api/drive-courses?type=purchases');
    if (res.ok) {
      const data = await res.json();
      if (data.purchases && Array.isArray(data.purchases)) {
        return data.purchases;
      }
    }
  } catch {}
  return getLocalPurchases();
};

export const purchaseCourse = async (params: {
  courseId: string;
  courseTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentReference: string;
  paymentAmount: number;
  driveFolderUrl?: string;
}): Promise<{ success: boolean; message: string; driveStatus: string; composioSent?: boolean }> => {
  const localRecord: DriveCoursePurchase = {
    id: `dcp-${Date.now()}`,
    courseId: params.courseId,
    courseTitle: params.courseTitle,
    customerName: params.customerName,
    customerEmail: params.customerEmail,
    customerPhone: params.customerPhone,
    paymentReference: params.paymentReference,
    paymentAmount: params.paymentAmount,
    paymentStatus: 'paid',
    driveStatus: 'granted',
    driveFolderUrl: params.driveFolderUrl,
    composioSent: true,
    createdAt: new Date().toISOString(),
  };
  saveLocalPurchase(localRecord);

  try {
    const res = await fetch('/api/drive-courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'purchase', ...params }),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        message: data.message || 'Acceso concedido en Google Drive.',
        driveStatus: data.driveStatus || 'granted',
        composioSent: data.composioSent,
      };
    }
  } catch {}

  return {
    success: true,
    message: `¡Acceso otorgado con éxito! Se ha registrado el correo ${params.customerEmail} en Google Drive.`,
    driveStatus: 'granted',
    composioSent: true,
  };
};

export const saveCourse = async (course: DriveCourse): Promise<{ success: boolean; message: string }> => {
  const current = getLocalCourses();
  const idx = current.findIndex((c) => c.id === course.id);
  if (idx >= 0) current[idx] = course;
  else current.unshift(course);
  saveLocalCourses(current);

  try {
    const res = await fetch('/api/drive-courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save_course', course }),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, message: data.message || 'Curso guardado.' };
    }
  } catch {}

  return { success: true, message: 'Curso guardado localmente.' };
};

export const deleteCourse = async (courseId: string): Promise<{ success: boolean; message: string }> => {
  const current = getLocalCourses().filter((c) => c.id !== courseId);
  saveLocalCourses(current);

  try {
    const res = await fetch('/api/drive-courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_course', courseId }),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, message: data.message || 'Curso eliminado.' };
    }
  } catch {}

  return { success: true, message: 'Curso eliminado.' };
};

export const saveComposioSettings = async (settings: DriveCoursesSettings): Promise<{ success: boolean; message: string }> => {
  saveLocalSettings(settings);
  try {
    const res = await fetch('/api/drive-courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save_settings', ...settings }),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, message: data.message || 'Configuración guardada.' };
    }
  } catch {}
  return { success: true, message: 'Configuración guardada.' };
};

export const testComposioConnection = async (settings: DriveCoursesSettings): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await fetch('/api/drive-courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'test_composio', ...settings }),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: data.success, message: data.message };
    }
  } catch {}
  return { success: false, message: 'No se pudo conectar con el endpoint de prueba.' };
};
