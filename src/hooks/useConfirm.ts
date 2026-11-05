import { useState, useCallback, useRef } from 'react';

interface ConfirmOptions {
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

interface ConfirmState {
  open: boolean;
  message: string;
  options: ConfirmOptions;
}

/**
 * useConfirm — reemplaza window.confirm() con un modal estilo by.fio.
 * Uso:
 *   const { confirmDialog, confirm } = useConfirm();
 *   // en JSX: {confirmDialog}
 *   // para abrir: const ok = await confirm('¿Eliminar?', { variant: 'danger' });
 */
export function useConfirm() {
  const [state, setState] = useState<ConfirmState>({
    open: false,
    message: '',
    options: {},
  });

  const resolveRef = useRef<((val: boolean) => void) | null>(null);

  const confirm = useCallback((message: string, options: ConfirmOptions = {}): Promise<boolean> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setState({ open: true, message, options });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
    resolveRef.current?.(true);
  }, []);

  const handleCancel = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
    resolveRef.current?.(false);
  }, []);

  return { confirm, confirmState: state, handleConfirm, handleCancel };
}
