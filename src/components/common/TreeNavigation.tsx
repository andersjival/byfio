import React from 'react';
import { AppRoute } from '../../types';

export interface BreadcrumbNode {
  label: string;
  route?: AppRoute;
  onClick?: () => void;
  active?: boolean;
}

interface TreeNavigationProps {
  nodes?: BreadcrumbNode[];
  onNavigate?: (route: AppRoute) => void;
  className?: string;
}

/**
 * Componente de mención / migas de pan (TreeNavigation) eliminado definitivamente
 * de toda la web a petición del usuario.
 */
export const TreeNavigation: React.FC<TreeNavigationProps> = () => null;
