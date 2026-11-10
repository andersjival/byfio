import React from 'react';
import {
  Coffee, ShieldCheck, Star, Sparkles, Award, Gift, Video, MessageCircle,
  BookOpen, Scissors, Palette, Heart, Clock, Download, Users, Folder,
  CheckCircle2, Lightbulb, Smile, Music, Printer, Zap, Package, Camera,
  BadgePercent, ShoppingBag, Layers, Calendar, HelpCircle, Wifi, Crown, PenTool
} from 'lucide-react';
import { Workshop, WorkshopBenefitItem } from '../types';

export interface BenefitIconDef {
  name: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  color: string;
  category: 'Experiencia & Servicios' | 'Herramientas & Material' | 'Digital & Aprendizaje' | 'Comunidad & Beneficios';
}

export const AVAILABLE_BENEFIT_ICONS: BenefitIconDef[] = [
  // Experiencia & Servicios
  { name: 'Coffee', label: 'Coffee Break & Bebidas', Icon: Coffee, color: 'text-amber-500', category: 'Experiencia & Servicios' },
  { name: 'Smile', label: 'Ambiente Relajado', Icon: Smile, color: 'text-amber-400', category: 'Experiencia & Servicios' },
  { name: 'Music', label: 'Música & Inspiración', Icon: Music, color: 'text-rose-400', category: 'Experiencia & Servicios' },
  { name: 'Heart', label: 'Atención 1 a 1', Icon: Heart, color: 'text-pink-500', category: 'Experiencia & Servicios' },
  { name: 'Users', label: 'Grupos Reducidos', Icon: Users, color: 'text-purple-500', category: 'Experiencia & Servicios' },
  { name: 'Crown', label: 'Experiencia VIP', Icon: Crown, color: 'text-amber-500', category: 'Experiencia & Servicios' },
  { name: 'Clock', label: 'Tiempo Flexible', Icon: Clock, color: 'text-sky-500', category: 'Experiencia & Servicios' },
  { name: 'Calendar', label: 'Fechas Flexibles', Icon: Calendar, color: 'text-fio-700', category: 'Experiencia & Servicios' },

  // Herramientas & Material
  { name: 'ShieldCheck', label: 'Herramientas de Precisión', Icon: ShieldCheck, color: 'text-fio-600', category: 'Herramientas & Material' },
  { name: 'Star', label: 'Proyecto Terminado', Icon: Star, color: 'text-fio-pink', category: 'Herramientas & Material' },
  { name: 'Scissors', label: 'Corte & Manualidades', Icon: Scissors, color: 'text-rose-500', category: 'Herramientas & Material' },
  { name: 'Palette', label: 'Colorimetría & Arte', Icon: Palette, color: 'text-indigo-500', category: 'Herramientas & Material' },
  { name: 'Package', label: 'Empaque de Regalo', Icon: Package, color: 'text-amber-600', category: 'Herramientas & Material' },
  { name: 'Layers', label: 'Técnicas en Capas', Icon: Layers, color: 'text-violet-500', category: 'Herramientas & Material' },
  { name: 'Printer', label: 'Impresión de Calidad', Icon: Printer, color: 'text-cyan-600', category: 'Herramientas & Material' },
  { name: 'PenTool', label: 'Diseño & Trazo', Icon: PenTool, color: 'text-emerald-600', category: 'Herramientas & Material' },

  // Digital & Aprendizaje
  { name: 'Award', label: 'Certificado de Curso', Icon: Award, color: 'text-amber-500', category: 'Digital & Aprendizaje' },
  { name: 'BookOpen', label: 'Guía / Manual PDF', Icon: BookOpen, color: 'text-blue-500', category: 'Digital & Aprendizaje' },
  { name: 'Video', label: 'Grabación de la Clase', Icon: Video, color: 'text-red-500', category: 'Digital & Aprendizaje' },
  { name: 'Download', label: 'Plantillas Descargables', Icon: Download, color: 'text-teal-500', category: 'Digital & Aprendizaje' },
  { name: 'Folder', label: 'Archivos Editables', Icon: Folder, color: 'text-indigo-600', category: 'Digital & Aprendizaje' },
  { name: 'Wifi', label: 'Transmisión HD en Vivo', Icon: Wifi, color: 'text-sky-600', category: 'Digital & Aprendizaje' },
  { name: 'Lightbulb', label: 'Tips de Emprendimiento', Icon: Lightbulb, color: 'text-amber-400', category: 'Digital & Aprendizaje' },
  { name: 'Zap', label: 'Técnicas Rápidas', Icon: Zap, color: 'text-yellow-500', category: 'Digital & Aprendizaje' },

  // Comunidad & Beneficios
  { name: 'MessageCircle', label: 'Grupo VIP WhatsApp', Icon: MessageCircle, color: 'text-emerald-500', category: 'Comunidad & Beneficios' },
  { name: 'Gift', label: 'Regalo / Muestra Sorpresa', Icon: Gift, color: 'text-fio-pink', category: 'Comunidad & Beneficios' },
  { name: 'BadgePercent', label: 'Descuento para Alumnos', Icon: BadgePercent, color: 'text-emerald-600', category: 'Comunidad & Beneficios' },
  { name: 'ShoppingBag', label: 'Muestras de Materiales', Icon: ShoppingBag, color: 'text-pink-600', category: 'Comunidad & Beneficios' },
  { name: 'Camera', label: 'Sesión de Fotos', Icon: Camera, color: 'text-slate-600', category: 'Comunidad & Beneficios' },
  { name: 'CheckCircle2', label: 'Material Garantizado', Icon: CheckCircle2, color: 'text-emerald-600', category: 'Comunidad & Beneficios' },
  { name: 'HelpCircle', label: 'Soporte Post-Taller', Icon: HelpCircle, color: 'text-blue-600', category: 'Comunidad & Beneficios' },
  { name: 'Sparkles', label: 'Detalles Especiales', Icon: Sparkles, color: 'text-amber-500', category: 'Comunidad & Beneficios' },
];

export const BENEFIT_ICONS_MAP: Record<string, React.ComponentType<{ className?: string }>> = AVAILABLE_BENEFIT_ICONS.reduce(
  (acc, def) => {
    acc[def.name] = def.Icon;
    return acc;
  },
  {} as Record<string, React.ComponentType<{ className?: string }>>
);

export const BENEFIT_ICONS_COLOR_MAP: Record<string, string> = AVAILABLE_BENEFIT_ICONS.reduce(
  (acc, def) => {
    acc[def.name] = def.color;
    return acc;
  },
  {} as Record<string, string>
);

export const BenefitIcon: React.FC<{ name: string; className?: string; defaultColor?: string }> = ({
  name,
  className = 'w-4 h-4',
  defaultColor,
}) => {
  const IconComponent = BENEFIT_ICONS_MAP[name] || Sparkles;
  const colorClass = defaultColor || BENEFIT_ICONS_COLOR_MAP[name] || 'text-fio-pink';
  return React.createElement(IconComponent, { className: `${className} ${colorClass}` });
};

export const getDefaultWorkshopBenefits = (workshop?: Partial<Workshop>): WorkshopBenefitItem[] => {
  if (workshop?.benefits && Array.isArray(workshop.benefits) && workshop.benefits.length > 0) {
    return workshop.benefits;
  }

  const isVirtual = workshop?.modality === 'Virtual en Vivo';
  const hasCoffeeBreak = workshop?.hasCoffeeBreak !== undefined ? workshop.hasCoffeeBreak : !isVirtual;

  return [
    {
      id: 'ben-coffee',
      icon: 'Coffee',
      text: workshop?.coffeeBreakText || 'Coffee break artesanal con repostería dulce y bebidas.',
      enabled: hasCoffeeBreak,
    },
    {
      id: 'ben-tools',
      icon: 'ShieldCheck',
      text: workshop?.toolsText || 'Uso ilimitado de herramientas de alta precisión durante el taller.',
      enabled: workshop?.hasToolsIncluded !== undefined ? workshop.hasToolsIncluded : true,
    },
    {
      id: 'ben-project',
      icon: 'Star',
      text: workshop?.takeHomeText || 'Te llevás tu proyecto completo y terminado a casa el mismo día.',
      enabled: workshop?.hasTakeHomeProject !== undefined ? workshop.hasTakeHomeProject : true,
    },
  ];
};
