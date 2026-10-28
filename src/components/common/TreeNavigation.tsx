import React from 'react';
import { AppRoute } from '../../types';
import { Sparkles } from 'lucide-react';

export interface BreadcrumbNode {
  label: string;
  route?: AppRoute;
  onClick?: () => void;
  active?: boolean;
}

interface TreeNavigationProps {
  nodes: BreadcrumbNode[];
  onNavigate: (route: AppRoute) => void;
  className?: string;
}

export const TreeNavigation: React.FC<TreeNavigationProps> = ({ nodes, onNavigate, className = '' }) => {
  return (
    <nav
      aria-label="Árbol de navegación"
      className={`inline-flex items-center flex-wrap gap-1.5 py-1.5 px-3.5 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_4px_14px_rgba(180,160,200,0.08)] text-[11px] font-sans tracking-wide ${className}`}
    >
      <div className="flex items-center gap-1.5 text-fio-700 font-semibold mr-1">
        <Sparkles className="w-3 h-3 text-fio-500 fill-fio-300" />
      </div>

      {nodes.map((node, index) => {
        const isLast = index === nodes.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <span className="text-slate-300 font-serif font-light text-xs select-none px-0.5">
                /
              </span>
            )}

            {isLast || (!node.route && !node.onClick) ? (
              <span className="font-bold text-fio-900 bg-fio-100/70 px-2 py-0.5 rounded-full shadow-sm">
                {node.label}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (node.onClick) node.onClick();
                  else if (node.route) onNavigate(node.route);
                }}
                className="text-slate-500 hover:text-fio-800 hover:underline underline-offset-4 font-medium transition-colors"
              >
                {node.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
