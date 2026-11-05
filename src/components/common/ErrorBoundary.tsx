import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    const msg = error?.message || '';
    const isChunkError =
      msg.includes('dynamically imported module') ||
      msg.includes('Failed to fetch dynamically') ||
      msg.includes('Importing a module script failed') ||
      msg.includes('Loading chunk') ||
      msg.includes('error loading dynamically imported module');

    // Auto-recarga instantánea con bypass de caché si el navegador tiene una versión anterior
    if (isChunkError && typeof window !== 'undefined') {
      const lastReload = sessionStorage.getItem('byfio_chunk_reload_lock');
      const now = Date.now();
      if (!lastReload || now - Number(lastReload) > 10000) {
        sessionStorage.setItem('byfio_chunk_reload_lock', String(now));
        window.location.href = window.location.origin + window.location.pathname + '?r=' + now + window.location.hash;
        return { hasError: false };
      }
    }

    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    sessionStorage.removeItem('byfio_chunk_reload_lock');
    this.setState({ hasError: false, error: undefined });
    window.location.href = window.location.origin + window.location.pathname + '?r=' + Date.now() + window.location.hash;
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-clayCard border border-purple-200/80 text-center space-y-4 animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center shadow-inner">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bubble font-bold text-lg text-slate-800">
                {this.props.fallbackTitle || 'Hubo un inconveniente al cargar esta sección'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                {this.state.error?.message?.includes('dynamically imported module')
                  ? 'Se actualizó una versión nueva de la plataforma. Recarga para continuar.'
                  : 'Puedes recargar esta vista o regresar al inicio para continuar navegando con normalidad.'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bubble text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Recargar</span>
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#F1F2F6] hover:bg-white text-slate-700 font-bubble text-xs font-bold border border-white/80 shadow-neuBtn transition-all active:scale-95 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-fio-pink" />
                <span>Ir al Inicio</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
